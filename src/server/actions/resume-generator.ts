"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import {
  analyzeJobMatchOnly,
  generateTailoredResumeOnly,
  analyzeJobAndGenerateResume,
  evaluateResumeAtsScore,
  CandidateProfileData,
  JobMatchAnalysis,
  TailoredResumeResult,
  ResumeAtsScoreResult,
} from "../services/ai";

// ─── HELPER: EXTRACT FULL VERIFIED CANDIDATE PROFILE DATA ────────────────────
async function getFullCandidateData(userId: string, sessionUser: any): Promise<{ profile: any; candidateData: CandidateProfileData }> {
  let profile = await db.profile.findUnique({
    where: { userId },
    include: {
      educations: true,
      experiences: true,
      projects: true,
      skills: true,
      certifications: true, // Included!
    },
  });

  if (!profile) {
    profile = await db.profile.create({
      data: {
        userId,
        fullName: sessionUser.name,
        email: sessionUser.email,
      },
      include: {
        educations: true,
        experiences: true,
        projects: true,
        skills: true,
        certifications: true,
      },
    });
  }

  const candidateData: CandidateProfileData = {
    name: profile.fullName || sessionUser.name,
    headline: profile.headline,
    summary: profile.summary,
    contact: {
      email: profile.email || sessionUser.email,
      phone: profile.phone,
      countryCode: profile.countryCode || "+91",
      location: profile.location,
      websiteUrl: profile.websiteUrl,
      githubUrl: profile.githubUrl,
      linkedinUrl: profile.linkedinUrl,
      photoUrl: profile.photoUrl || sessionUser.image || null,
    },
    skills: profile.skills
      .filter((s) => s.category === "TECHNICAL" || s.category === "TOOL" || s.category === "LANGUAGE")
      .map((s) => s.name),
    softSkills: profile.skills
      .filter((s) => s.category === "SOFT")
      .map((s) => s.name),
    experiences: profile.experiences.map((e) => ({
      company: e.company,
      title: e.title,
      employmentType: e.employmentType || "Full-Time",
      location: e.location || undefined,
      startDate: e.startDate.toISOString().split("T")[0],
      endDate: e.endDate ? e.endDate.toISOString().split("T")[0] : undefined,
      isCurrent: e.isCurrent,
      bullets: e.bullets,
      technologies: e.technologies,
    })),
    projects: profile.projects.map((p) => ({
      name: p.name,
      role: p.role || undefined,
      description: p.description,
      demoUrl: p.demoUrl || undefined,
      repoUrl: p.repoUrl || undefined,
      bullets: p.bullets,
      technologies: p.technologies,
    })),
    educations: profile.educations.map((ed) => ({
      institution: ed.institution,
      degree: ed.degree,
      fieldOfStudy: ed.fieldOfStudy,
      level: ed.level || undefined,
      startDate: ed.startDate.toISOString().split("T")[0],
      endDate: ed.endDate ? ed.endDate.toISOString().split("T")[0] : undefined,
      gpa: ed.gpa || undefined,
      gpaScale: ed.gpaScale || undefined,
    })),
    certifications: profile.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate.toISOString().split("T")[0],
      credentialId: c.credentialId || undefined,
      url: c.url || undefined,
    })),
  };

  return { profile, candidateData };
}

// ─── STEP 1: ANALYZE JOB DESCRIPTION & MATCH SKILLS ONLY ─────────────────────
export async function analyzeJobMatchAction(jobDescriptionText: string) {
  if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
    return { success: false, error: "Please provide a valid job description with at least 20 characters." };
  }

  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) {
    return { success: false, error: "You must be signed in to analyze a job." };
  }

  const userId = session.user.id;

  try {
    const { profile, candidateData } = await getFullCandidateData(userId, session.user);

    // 1. Run AI Match Analysis (Skills, Education, Experience, Roadmap)
    const analysis = await analyzeJobMatchOnly(jobDescriptionText, candidateData);

    // 2. Save Job Description to Neon DB
    const savedJob = await db.jobDescription.create({
      data: {
        userId,
        title: analysis.jobTitle || "Target Role",
        company: analysis.company || "Company",
        rawText: jobDescriptionText,
        requiredSkills: analysis.extractedSkills,
        preferredSkills: analysis.softSkillsRequired || [],
        keywords: analysis.extractedSkills,
      },
    });

    // 3. Save Match Result to Neon DB
    const matchResult = await db.matchResult.create({
      data: {
        userId,
        profileId: profile.id,
        jobId: savedJob.id,
        overallScore: Math.round(analysis.matchScore),
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        partialMatches: analysis.partialMatches || [],
        softSkillsMatched: analysis.softSkillsMatched || [],
        softSkillsMissing: analysis.softSkillsMissing || [],
        scoreBreakdown: analysis.scoreBreakdown as any,
        educationMatch: analysis.educationMatch as any,
        experienceMatch: analysis.experienceMatch as any,
        scoreExplanation: analysis.scoreExplanation,
      },
    });

    // 4. Save Learning Roadmap items
    if (analysis.roadmap && analysis.roadmap.length > 0) {
      await db.learningRoadmap.createMany({
        data: analysis.roadmap.map((item) => ({
          userId,
          jobId: savedJob.id,
          skillName: item.skillName,
          priority: item.priority,
          recommendations: item.recommendations,
          practicalProject: item.practicalProject,
          estimatedHours: item.estimatedHours,
        })),
      });
    }

    return {
      success: true,
      data: {
        jobId: savedJob.id,
        matchResultId: matchResult.id,
        analysis,
      },
    };
  } catch (error: any) {
    console.error("Error analyzing job match:", error);
    return {
      success: false,
      error: error?.message || "Failed to analyze job match.",
    };
  }
}

// ─── STEP 2: GENERATE TAILORED RESUME FOR CHOSEN TEMPLATE ────────────────────
export async function generateResumeAction(
  jobId: string,
  matchResultId: string,
  templateId: string,
  customLatexSnippet?: string
) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) {
    return { success: false, error: "You must be signed in." };
  }

  const userId = session.user.id;

  try {
    const job = await db.jobDescription.findFirst({
      where: { id: jobId, userId },
    });
    if (!job) return { success: false, error: "Job description not found." };

    const { candidateData } = await getFullCandidateData(userId, session.user);

    // Generate Tailored Resume with Chosen Template & JD Keywords
    const tailoredResume = await generateTailoredResumeOnly(
      job.rawText,
      candidateData,
      templateId,
      customLatexSnippet
    );

    // Save to Neon DB
    const savedResume = await db.resume.create({
      data: {
        userId,
        jobId: job.id,
        matchResultId,
        title: `${tailoredResume.title} - ${job.company}`,
        targetRole: tailoredResume.targetRole,
        templateName: templateId || "jakes-tech",
        contentJson: tailoredResume as any,
        latexSource: tailoredResume.latexSource,
        versions: {
          create: {
            versionNum: 1,
            contentJson: tailoredResume as any,
            latexSource: tailoredResume.latexSource,
            note: `Generated with template ${templateId}`,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        resumeId: savedResume.id,
        tailoredResume,
      },
    };
  } catch (error: any) {
    console.error("Error generating resume:", error);
    return {
      success: false,
      error: error?.message || "Failed to generate tailored resume.",
    };
  }
}

// ─── ALL-IN-ONE PIPELINE (BACKWARDS COMPATIBLE) ──────────────────────────────
export async function processJobAndGenerateResume(
  jobDescriptionText: string,
  templateId?: string
) {
  const matchRes = await analyzeJobMatchAction(jobDescriptionText);
  if (!matchRes.success || !matchRes.data) {
    return matchRes;
  }

  const { jobId, matchResultId, analysis } = matchRes.data;
  const resumeRes = await generateResumeAction(jobId, matchResultId, templateId || "jakes-tech");

  if (!resumeRes.success || !resumeRes.data) {
    return resumeRes;
  }

  return {
    success: true,
    data: {
      jobId,
      resumeId: resumeRes.data.resumeId,
      templateId: templateId || "jakes-tech",
      analysis: {
        ...analysis,
        tailoredResume: resumeRes.data.tailoredResume,
      },
    },
  };
}

// ─── 4. CALCULATE ACCURATE ATS SCORE FOR GENERATED RESUME ───────────────────
export async function calculateResumeAtsScoreAction(
  jobId: string,
  tailoredResume: TailoredResumeResult
) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) {
    return { success: false, error: "You must be signed in to check ATS score." };
  }

  const userId = session.user.id;

  try {
    const job = await db.jobDescription.findFirst({
      where: { id: jobId, userId },
    });
    if (!job) {
      return { success: false, error: "Job description not found." };
    }

    const atsAudit = await evaluateResumeAtsScore(
      job.rawText,
      tailoredResume,
      tailoredResume.latexSource
    );

    return {
      success: true,
      data: atsAudit,
    };
  } catch (error: any) {
    console.error("Error evaluating ATS score:", error);
    return {
      success: false,
      error: error?.message || "Failed to audit ATS score.",
    };
  }
}

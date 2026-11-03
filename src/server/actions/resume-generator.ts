"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { analyzeJobAndGenerateResume, CandidateProfileData } from "../services/ai";

export async function processJobAndGenerateResume(jobDescriptionText: string) {
  if (!jobDescriptionText || jobDescriptionText.trim().length < 20) {
    return {
      success: false,
      error: "Please provide a valid job description with at least 20 characters.",
    };
  }

  // 1. Authenticate user
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session?.user) {
    return {
      success: false,
      error: "You must be signed in to generate a resume.",
    };
  }

  const userId = session.user.id;

  try {
    // 2. Fetch User Profile
    let profile = await db.profile.findUnique({
      where: { userId },
      include: {
        educations: true,
        experiences: true,
        projects: true,
        skills: true,
      },
    });

    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId,
          fullName: session.user.name,
          email: session.user.email,
        },
        include: {
          educations: true,
          experiences: true,
          projects: true,
          skills: true,
        },
      });
    }

    const candidateData: CandidateProfileData = {
      name: profile.fullName || session.user.name,
      headline: profile.headline,
      summary: profile.summary,
      skills: profile.skills.map((s) => s.name),
      experiences: profile.experiences.map((e) => ({
        company: e.company,
        title: e.title,
        bullets: e.bullets,
        technologies: e.technologies,
      })),
      projects: profile.projects.map((p) => ({
        name: p.name,
        description: p.description,
        bullets: p.bullets,
        technologies: p.technologies,
      })),
      educations: profile.educations.map((ed) => ({
        institution: ed.institution,
        degree: ed.degree,
        fieldOfStudy: ed.fieldOfStudy,
      })),
    };

    // 3. Run AI Analysis & Resume Tailoring
    const analysis = await analyzeJobAndGenerateResume(jobDescriptionText, candidateData);

    // 4. Save Job Description to Neon DB
    const savedJob = await db.jobDescription.create({
      data: {
        userId,
        title: analysis.jobTitle || "Target Role",
        company: analysis.company || "Company",
        rawText: jobDescriptionText,
        requiredSkills: analysis.extractedSkills,
        keywords: analysis.extractedSkills,
      },
    });

    // 5. Save Match Result to Neon DB
    const matchResult = await db.matchResult.create({
      data: {
        userId,
        profileId: profile.id,
        jobId: savedJob.id,
        overallScore: Math.round(analysis.matchScore),
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        scoreExplanation: analysis.scoreExplanation,
      },
    });

    // 6. Save Learning Roadmap items
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

    // 7. Save Generated Resume to Neon DB
    const savedResume = await db.resume.create({
      data: {
        userId,
        jobId: savedJob.id,
        matchResultId: matchResult.id,
        title: `${analysis.jobTitle} - ${analysis.company}`,
        targetRole: analysis.jobTitle,
        contentJson: analysis.tailoredResume as any,
        latexSource: analysis.tailoredResume.latexSource,
        versions: {
          create: {
            versionNum: 1,
            contentJson: analysis.tailoredResume as any,
            latexSource: analysis.tailoredResume.latexSource,
            note: "Initial AI tailored generation",
          },
        },
      },
    });

    return {
      success: true,
      data: {
        jobId: savedJob.id,
        resumeId: savedResume.id,
        analysis,
      },
    };
  } catch (error: any) {
    console.error("Error processing job description:", error);
    return {
      success: false,
      error: error?.message || "Failed to process job description and generate resume.",
    };
  }
}

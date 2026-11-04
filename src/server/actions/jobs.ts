"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── GET ALL SAVED JOB DESCRIPTIONS FOR CURRENT USER ────────────────────────
export async function getUserJobs() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const jobs = await db.jobDescription.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      matchResults: {
        select: { overallScore: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      resumes: {
        select: { id: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return { success: true, data: jobs };
}

// ─── GET SINGLE JOB WITH FULL MATCH + ROADMAP DETAILS ─────────────────────────
export async function getJobById(jobId: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const job = await db.jobDescription.findFirst({
    where: { id: jobId, userId: session.user.id }, // multi-tenant safe
    include: {
      matchResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      roadmaps: {
        orderBy: { createdAt: "desc" },
      },
      resumes: {
        select: { id: true, title: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!job) return { success: false, error: "Job not found" };
  return { success: true, data: job };
}

// ─── DELETE A JOB DESCRIPTION (CASCADE DELETES MATCH, ROADMAP, RESUME) ───────
export async function deleteJob(jobId: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  // Verify ownership before delete
  const job = await db.jobDescription.findFirst({
    where: { id: jobId, userId: session.user.id },
  });

  if (!job) return { success: false, error: "Job not found or access denied" };

  await db.jobDescription.delete({ where: { id: jobId } });
  return { success: true };
}

// ─── EXTRACT JD INTELLIGENCE (WITHOUT GENERATING RESUME) ─────────────────────
// Used in Phase 3 dedicated JD extraction panel
export interface JDIntelligence {
  jobTitle: string;
  company: string;
  location: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  tools: string[];
  experienceRequired: string;
  educationRequired: string;
  keywords: string[];
  salaryRange: string;
  workType: string; // Remote / Hybrid / On-site
  jobSummary: string;
}

export async function extractJobIntelligence(rawText: string) {
  if (!rawText || rawText.trim().length < 30) {
    return { success: false, error: "Job description too short" };
  }

  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const userId = session.user.id;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
  });

  const prompt = `
You are a professional job description parser. Extract structured intelligence from the following job description.

=== JOB DESCRIPTION ===
${rawText}

Return a JSON object with EXACTLY these fields:
{
  "jobTitle": "string",
  "company": "string (or 'Not Specified')",
  "location": "string (or 'Not Specified')",
  "requiredSkills": ["string array of must-have technical skills"],
  "preferredSkills": ["string array of nice-to-have skills"],
  "responsibilities": ["string array of key responsibilities, max 8"],
  "tools": ["string array of tools, platforms, frameworks mentioned"],
  "experienceRequired": "string (e.g. '3-5 years' or 'Not Specified')",
  "educationRequired": "string (e.g. 'Bachelor's in CS' or 'Not Specified')",
  "keywords": ["string array of important ATS keywords, max 15"],
  "salaryRange": "string (if mentioned, else 'Not Specified')",
  "workType": "Remote | Hybrid | On-site | Not Specified",
  "jobSummary": "string (2-3 sentence summary of the role)"
}
`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const intelligence = JSON.parse(text) as JDIntelligence;

  // Save to DB with extracted data
  const savedJob = await db.jobDescription.create({
    data: {
      userId,
      title: intelligence.jobTitle || "Untitled Role",
      company: intelligence.company || "Unknown Company",
      location: intelligence.location || undefined,
      rawText,
      requiredSkills: intelligence.requiredSkills,
      preferredSkills: intelligence.preferredSkills,
      responsibilities: intelligence.responsibilities,
      tools: intelligence.tools,
      keywords: intelligence.keywords,
    },
  });

  return {
    success: true,
    data: {
      jobId: savedJob.id,
      intelligence,
    },
  };
}


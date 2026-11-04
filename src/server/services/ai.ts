import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTemplateById } from "@/lib/templates-data";

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_APIKEY || "";
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in .env. Please add your Gemini API key."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite-preview",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
];

async function generateWithFallback(
  prompt: string,
  generationConfig?: any
): Promise<string> {
  const genAI = getGenAI();
  let lastError: any = null;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
      });
      const response = await model.generateContent(prompt);
      return response.response.text();
    } catch (err: any) {
      console.warn(`[CareerForge AI] Model ${modelName} failed, attempting next fallback:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini model fallbacks failed.");
}

export interface CandidateProfileData {
  name: string;
  headline?: string | null;
  summary?: string | null;
  skills: string[];
  softSkills: string[];
  experiences: Array<{
    company: string;
    title: string;
    employmentType?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    bullets: string[];
    technologies: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    bullets: string[];
    technologies: string[];
  }>;
  educations: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    level?: string;
    gpa?: string;
    gpaScale?: string;
  }>;
}

// ─── SCORE BREAKDOWN ───────────────────────────────────────────────────────────
export interface ScoreBreakdown {
  technical: number;    // 0-100 — how many required technical skills matched
  experience: number;   // 0-100 — does experience level/years satisfy the JD
  education: number;    // 0-100 — does education level satisfy the JD
  projects: number;     // 0-100 — how relevant are the candidate's projects
}

// ─── EDUCATION MATCH ──────────────────────────────────────────────────────────
export interface EducationMatch {
  required: string;     // e.g. "Bachelor's in Computer Science"
  candidate: string;    // e.g. "B.Tech in CSE from JNTU"
  matched: boolean;
  note: string;         // explanation
}

// ─── EXPERIENCE MATCH ─────────────────────────────────────────────────────────
export interface ExperienceMatch {
  required: string;     // e.g. "3+ years in full-stack development"
  candidate: string;    // e.g. "1 year internship + 2 years Full-Time"
  sufficient: boolean;
  note: string;         // explanation
}

// ─── FULL AI ANALYSIS RESULT ──────────────────────────────────────────────────
export interface JobAnalysisResult {
  jobTitle: string;
  company: string;

  // Technical Skills
  extractedSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  partialMatches: string[];  // skills candidate has partially (e.g. basic knowledge)

  // Soft Skills
  softSkillsRequired: string[];
  softSkillsMatched: string[];
  softSkillsMissing: string[];

  // Scores
  matchScore: number;        // overall 0-100
  scoreExplanation: string;
  scoreBreakdown: ScoreBreakdown;

  // Detailed Comparisons
  educationMatch: EducationMatch;
  experienceMatch: ExperienceMatch;

  // Evidence — projects relevant to the JD
  relevantProjects: Array<{
    name: string;
    relevance: string; // why this project supports the application
  }>;

  // Learning Roadmap for missing skills
  roadmap: Array<{
    skillName: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    recommendations: string[];
    practicalProject: string;
    estimatedHours: number;
  }>;

  // Tailored Resume
  tailoredResume: {
    title: string;
    targetRole: string;
    summary: string;
    skills: string[];
    experiences: Array<{
      company: string;
      title: string;
      bullets: string[];
    }>;
    projects: Array<{
      name: string;
      description: string;
      bullets: string[];
      technologies: string[];
    }>;
    latexSource: string;
  };
}

// ─── MAIN AI FUNCTION ─────────────────────────────────────────────────────────
export async function analyzeJobAndGenerateResume(
  jobDescription: string,
  candidate: CandidateProfileData,
  templateId?: string
): Promise<JobAnalysisResult> {
  const selectedTemplate = getTemplateById(templateId);

  const prompt = `
You are the CareerForge AI intelligence engine — a senior career advisor and resume specialist.

Your tasks:
1. Parse the job description to extract ALL requirements (technical skills, soft skills, experience, education).
2. Compare requirements against the candidate's ACTUAL verified profile — do NOT invent qualifications.
3. Identify exact matches, partial matches, and missing skills with evidence from the profile.
4. Calculate a transparent, broken-down compatibility score.
5. Compare education and experience requirements specifically.
6. Identify which of the candidate's projects are most relevant to this job.
7. Build an actionable learning roadmap for the skill gaps.
8. Generate a tailored, honest resume formatted precisely for the selected template: "${selectedTemplate.name}".

=== CANDIDATE PROFILE ===
${JSON.stringify(candidate, null, 2)}

=== JOB DESCRIPTION ===
${jobDescription}

=== SELECTED RESUME TEMPLATE ===
Name: ${selectedTemplate.name}
Category: ${selectedTemplate.category}
Style: ${selectedTemplate.subtitle}
Template LaTeX Layout Rules:
${selectedTemplate.latexGuidelines}

=== RULES & GUARDRAILS ===
1. NEVER fabricate companies, degrees, dates, skills, or achievements the candidate does not have.
2. Matched skills must have direct evidence in the profile (skills list, job bullets, project technologies).
3. Partial matches = candidate has some exposure but not full proficiency.
4. Score breakdown must be mathematically honest:
   - technical: (matchedSkills.length / extractedSkills.length) * 100
   - experience: based on years and type vs what job requires
   - education: based on degree level vs what job requires
   - projects: based on how many projects have overlapping tech with the JD
5. The "latexSource" MUST be a complete standalone document (\\documentclass to \\end{document}) formatted to the exact styling rules of the "${selectedTemplate.name}" template. Escape special characters (& as \\&, % as \\%, _ as \\_, # as \\#). Ensure it compiles with zero errors on Overleaf / pdflatex.

Return a JSON object with EXACTLY this structure:
{
  "jobTitle": "string",
  "company": "string",
  "extractedSkills": ["string"],
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "partialMatches": ["string"],
  "softSkillsRequired": ["string"],
  "softSkillsMatched": ["string"],
  "softSkillsMissing": ["string"],
  "matchScore": number,
  "scoreExplanation": "string — 2-3 sentences explaining what drove the score",
  "scoreBreakdown": {
    "technical": number,
    "experience": number,
    "education": number,
    "projects": number
  },
  "educationMatch": {
    "required": "string",
    "candidate": "string",
    "matched": boolean,
    "note": "string"
  },
  "experienceMatch": {
    "required": "string",
    "candidate": "string",
    "sufficient": boolean,
    "note": "string"
  },
  "relevantProjects": [
    {
      "name": "string",
      "relevance": "string"
    }
  ],
  "roadmap": [
    {
      "skillName": "string",
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "recommendations": ["step 1", "step 2"],
      "practicalProject": "string",
      "estimatedHours": number
    }
  ],
  "tailoredResume": {
    "title": "string",
    "targetRole": "string",
    "summary": "string",
    "skills": ["string"],
    "experiences": [
      {
        "company": "string",
        "title": "string",
        "bullets": ["string"]
      }
    ],
    "projects": [
      {
        "name": "string",
        "description": "string",
        "bullets": ["string"],
        "technologies": ["string"]
      }
    ],
    "latexSource": "string"
  }
}
`;

  const text = await generateWithFallback(prompt, {
    responseMimeType: "application/json",
    temperature: 0.2,
  });
  const parsed = JSON.parse(text) as JobAnalysisResult;
  return parsed;
}

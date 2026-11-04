import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTemplateById, ResumeTemplate } from "@/lib/templates-data";

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

// ─── COMPLETE CANDIDATE PROFILE DATA ─────────────────────────────────────────
export interface CandidateProfileData {
  name: string;
  headline?: string | null;
  summary?: string | null;
  contact: {
    email?: string | null;
    phone?: string | null;
    countryCode?: string | null;
    location?: string | null;
    websiteUrl?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
  };
  skills: string[];
  softSkills: string[];
  experiences: Array<{
    company: string;
    title: string;
    employmentType?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    bullets: string[];
    technologies: string[];
  }>;
  projects: Array<{
    name: string;
    role?: string;
    description: string;
    demoUrl?: string;
    repoUrl?: string;
    bullets: string[];
    technologies: string[];
  }>;
  educations: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    level?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    gpaScale?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate?: string;
    credentialId?: string;
    url?: string;
  }>;
}

// ─── MATCH SCORING INTERFACES ─────────────────────────────────────────────────
export interface ScoreBreakdown {
  technical: number;
  experience: number;
  education: number;
  projects: number;
}

export interface EducationMatch {
  required: string;
  candidate: string;
  matched: boolean;
  note: string;
}

export interface ExperienceMatch {
  required: string;
  candidate: string;
  sufficient: boolean;
  note: string;
}

// ─── STEP 1: JOB MATCH ANALYSIS RESULT ────────────────────────────────────────
export interface JobMatchAnalysis {
  jobTitle: string;
  company: string;
  extractedSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  partialMatches: string[];
  softSkillsRequired: string[];
  softSkillsMatched: string[];
  softSkillsMissing: string[];
  matchScore: number;
  scoreExplanation: string;
  scoreBreakdown: ScoreBreakdown;
  educationMatch: EducationMatch;
  experienceMatch: ExperienceMatch;
  relevantProjects: Array<{
    name: string;
    relevance: string;
  }>;
  roadmap: Array<{
    skillName: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    recommendations: string[];
    practicalProject: string;
    estimatedHours: number;
  }>;
}

// ─── STEP 2: TAILORED RESUME STRUCTURE ─────────────────────────────────────────
export interface TailoredResumeResult {
  title: string;
  targetRole: string;
  summary: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  skills: string[];
  educations: Array<{
    institution: string;
    degree: string;
    dates: string;
    gpa: string;
  }>;
  experiences: Array<{
    company: string;
    title: string;
    employmentType: string;
    dates: string;
    location: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    technologies: string[];
    link: string;
    bullets: string[];
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  latexSource: string;
}

export interface JobAnalysisResult extends JobMatchAnalysis {
  tailoredResume: TailoredResumeResult;
}

// ─── 1. ANALYZE JOB MATCH (STEP 1 ONLY) ───────────────────────────────────────
export async function analyzeJobMatchOnly(
  jobDescription: string,
  candidate: CandidateProfileData
): Promise<JobMatchAnalysis> {
  const prompt = `
You are the CareerForge AI intelligence engine. Analyze this candidate's verified profile against the job description.

=== CANDIDATE PROFILE ===
${JSON.stringify(candidate, null, 2)}

=== JOB DESCRIPTION ===
${jobDescription}

=== RULES & GUARDRAILS ===
1. Compare technical skills, soft skills, educational level, and years of experience.
2. NEVER fabricate skills the candidate does not have.
3. Calculate an honest, transparent score breakdown.
4. Identify which of the candidate's existing projects support the application.
5. Create a structured learning roadmap for missing skills.

Return JSON conforming EXACTLY to:
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
  "scoreExplanation": "string",
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
  ]
}
`;

  const text = await generateWithFallback(prompt, {
    responseMimeType: "application/json",
    temperature: 0.15,
  });
  return JSON.parse(text) as JobMatchAnalysis;
}

// ─── 2. GENERATE TAILORED RESUME (STEP 2) ─────────────────────────────────────
export async function generateTailoredResumeOnly(
  jobDescription: string,
  candidate: CandidateProfileData,
  templateId?: string,
  customLatexGuidelines?: string
): Promise<TailoredResumeResult> {
  const selectedTemplate = getTemplateById(templateId);
  const layoutRules = customLatexGuidelines || selectedTemplate.latexGuidelines;

  const phoneStr = candidate.contact.phone
    ? `${candidate.contact.countryCode || "+91"} ${candidate.contact.phone}`
    : "";

  const prompt = `
You are an elite executive resume writer and LaTeX engineer. Generate an ATS-optimized, high-impact resume tailored for the job description below using ALL verified profile details from the candidate.

=== CANDIDATE PROFILE ===
Full Name: ${candidate.name}
Headline: ${candidate.headline || ""}
Summary: ${candidate.summary || ""}
Contact:
  Email: ${candidate.contact.email || ""}
  Phone: ${phoneStr}
  Location: ${candidate.contact.location || ""}
  LinkedIn: ${candidate.contact.linkedinUrl || ""}
  GitHub: ${candidate.contact.githubUrl || ""}
  Website/Portfolio: ${candidate.contact.websiteUrl || ""}
Skills: ${candidate.skills.join(", ")}
Soft Skills: ${candidate.softSkills.join(", ")}
Educations: ${JSON.stringify(candidate.educations, null, 2)}
Experiences: ${JSON.stringify(candidate.experiences, null, 2)}
Projects: ${JSON.stringify(candidate.projects, null, 2)}
Certifications: ${JSON.stringify(candidate.certifications, null, 2)}

=== TARGET JOB DESCRIPTION ===
${jobDescription}

=== SELECTED RESUME TEMPLATE ===
Template Name: ${selectedTemplate.name}
Template Rules:
${layoutRules}

=== INSTRUCTIONS & CRITICAL GUARDRAILS ===
1. KEYWORD OPTIMIZATION: Naturally incorporate the target job description's critical keywords and industry terminology into the candidate's experience and project bullets. DO NOT fabricate companies or false job titles, but phrase genuine accomplishments to mirror the target role's technical vocabulary.
2. INCLUDE ALL CANDIDATE SECTIONS IN THE RESUME:
   - Header: Full Name, Phone, Email, Location, LinkedIn, GitHub, Portfolio.
   - Education: Every university/college, degree, field of study, graduation year, and GPA (e.g. "8.5 / 10 CGPA").
   - Technical Skills: Clean categories (Languages, Frameworks, Developer Tools, Databases, Cloud).
   - Work Experience: Job Title, Company, Location, Dates, Employment Type (e.g. Full-Time, Internship), and quantifiable metrics-driven accomplishment bullets.
   - Projects: Project Title, Tech Stack, URLs, and problem-solution-impact bullets.
   - Certifications: Issuer, certification name, and year (if any in profile).
3. COMPLETE STANDALONE LATEX SOURCE:
   - "latexSource" MUST be 100% syntactically valid LaTeX compilable with pdflatex on Overleaf (beginning with \\documentclass and ending with \\end{document}).
   - Escape all LaTeX special characters: & as \\&, % as \\%, _ as \\_, # as \\#, $ as \\$.
   - Must fit cleanly onto 1-2 pages without clipping or syntax errors.

Return JSON conforming EXACTLY to:
{
  "title": "string",
  "targetRole": "string",
  "summary": "string",
  "contact": {
    "name": "${candidate.name}",
    "email": "${candidate.contact.email || ""}",
    "phone": "${phoneStr}",
    "location": "${candidate.contact.location || ""}",
    "linkedin": "${candidate.contact.linkedinUrl || ""}",
    "github": "${candidate.contact.githubUrl || ""}",
    "website": "${candidate.contact.websiteUrl || ""}"
  },
  "skills": ["string"],
  "educations": [
    {
      "institution": "string",
      "degree": "string",
      "dates": "string",
      "gpa": "string"
    }
  ],
  "experiences": [
    {
      "company": "string",
      "title": "string",
      "employmentType": "string",
      "dates": "string",
      "location": "string",
      "bullets": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "technologies": ["string"],
      "link": "string",
      "bullets": ["string"]
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ],
  "latexSource": "string"
}
`;

  const text = await generateWithFallback(prompt, {
    responseMimeType: "application/json",
    temperature: 0.2,
  });
  return JSON.parse(text) as TailoredResumeResult;
}

// ─── 3. COMBINED ANALYSIS & RESUME (BACKWARDS COMPATIBLE) ────────────────────
export async function analyzeJobAndGenerateResume(
  jobDescription: string,
  candidate: CandidateProfileData,
  templateId?: string
): Promise<JobAnalysisResult> {
  const analysis = await analyzeJobMatchOnly(jobDescription, candidate);
  const tailoredResume = await generateTailoredResumeOnly(jobDescription, candidate, templateId);
  return {
    ...analysis,
    tailoredResume,
  };
}

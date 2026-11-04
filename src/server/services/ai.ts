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

function cleanAndParseJson<T>(rawText: string): T {
  let clean = rawText.trim();
  if (clean.startsWith("```json")) clean = clean.slice(7);
  else if (clean.startsWith("```")) clean = clean.slice(3);
  if (clean.endsWith("```")) clean = clean.slice(0, -3);
  clean = clean.trim();

  try {
    return JSON.parse(clean) as T;
  } catch (initialErr) {
    // When LLMs output LaTeX source inside JSON, unescaped backslashes (e.g. \d, \i, \s, \c) cause JSON.parse to fail.
    // Repair odd sequences of backslashes before non-JSON-escape characters:
    try {
      const withFixedSlashes = clean.replace(/(\\+)([^"\\\/bfnrtu]|u(?![\da-fA-F]{4})|$)/g, (match, slashes, nextChar) => {
        if (slashes.length % 2 === 1) {
          return slashes + "\\" + nextChar;
        }
        return match;
      });
      return JSON.parse(withFixedSlashes) as T;
    } catch (secondErr) {
      console.error("[CareerForge AI] Failed to parse JSON with repaired slashes:", (initialErr as any)?.message);
      throw secondErr;
    }
  }
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
You are the CareerForge AI Resume Engineering Engine.
Your task is to take this candidate's verified profile and generate a high-impact, ATS-optimized, fully customized resume tailored specifically to the target Job Description, styled using the chosen template.

=== CANDIDATE VERIFIED PROFILE DATA ===
Name: ${candidate.name}
Headline: ${candidate.headline || ""}
Target Role: ${candidate.headline || "Software Engineer"}
Summary: ${candidate.summary || ""}
Contact Info:
  Phone: ${phoneStr}
  Email: ${candidate.contact.email || ""}
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
1. CANDIDATE IDENTITY INTEGRITY:
   - "contact.name" MUST be "${candidate.name}". NEVER replace the candidate's name with a job title like "Aspiring Software Engineer".
   - "contact.phone" MUST be "${phoneStr}".
   - "contact.email" MUST be "${candidate.contact.email || ""}".

2. DYNAMIC SECTION PRUNING & ZERO PLACEHOLDER TOLERANCE (CRITICAL):
   - The selected resume template is a VISUAL BLUEPRINT ONLY (for styling, typography, spacing, rules, and colors).
   - NEVER keep dummy/sample placeholder text from the template (e.g. "Carl Johnson", "Dank Memes Inc.", "Viral News Robotics", "Library of Alexandria", "XYZ Institute", "Lorem ipsum", "PigeonScript", dummy dates).
   - DYNAMICALLY ADAPT SECTIONS TO CANDIDATE'S ACTUAL DATA COUNT:
     * If the candidate has 1 work experience, render ONLY that 1 experience using the template's style. NEVER output 2nd or 3rd dummy experiences just because the template had 3.
     * If the candidate has 0 work experiences, COMPLETELY SKIP AND OMIT the Work Experience section from both the JSON ("experiences": []) and the latexSource. Do NOT output empty headers or fake companies!
     * If the candidate has 0 projects, COMPLETELY SKIP AND OMIT the Projects section ("projects": []).
     * If the candidate has 0 certifications, COMPLETELY SKIP AND OMIT the Certifications section ("certifications": []).
     * If the template has extra sample sections (e.g. "Memberships", "Extracurriculars", "Language proficiencies", "Core Competencies", "Positions") that the candidate has no data for, COMPLETELY SKIP AND OMIT those sections!
     * If the candidate has data (such as Education with GPA, Certifications, Skills) that the template did not showcase, RENDER that section matching the template's exact font, heading style, and color palette.

3. KEYWORD OPTIMIZATION & HONESTY:
   - Naturally incorporate the target job description's critical keywords, tools, and technical terms into the candidate's verified skills, education highlights, and project/experience bullets.
   - DO NOT fabricate fake employers or degrees.

4. COMPLETE STANDALONE LATEX SOURCE:
   - "latexSource" MUST be 100% syntactically valid LaTeX compilable with pdflatex on Overleaf (beginning with \\documentclass and ending with \\end{document}).
   - Escape all LaTeX special characters: & as \\&, % as \\%, _ as \\_, # as \\$, $ as \\$.
   - Ensure all JSON backslashes in latexSource are properly escaped so the output is strictly valid JSON.

Return JSON conforming EXACTLY to:
{
  "title": "${candidate.name} - ${selectedTemplate.name}",
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

  const parsed = cleanAndParseJson<TailoredResumeResult>(text);

  // ─── GUARANTEE COMPLETE CANDIDATE PROFILE DATA INTEGRITY ─────────────────
  // 1. Contact Name & Info
  if (!parsed.contact) {
    parsed.contact = {
      name: candidate.name,
      email: candidate.contact.email || "",
      phone: phoneStr,
      location: candidate.contact.location || "",
      linkedin: candidate.contact.linkedinUrl || "",
      github: candidate.contact.githubUrl || "",
      website: candidate.contact.websiteUrl || "",
    };
  } else {
    if (!parsed.contact.name || parsed.contact.name.toLowerCase().includes("aspiring") || parsed.contact.name.toLowerCase().includes("engineer")) {
      parsed.contact.name = candidate.name;
    }
    if (!parsed.contact.email) parsed.contact.email = candidate.contact.email || "";
    if (!parsed.contact.phone) parsed.contact.phone = phoneStr;
    if (!parsed.contact.location) parsed.contact.location = candidate.contact.location || "";
    if (!parsed.contact.linkedin) parsed.contact.linkedin = candidate.contact.linkedinUrl || "";
    if (!parsed.contact.github) parsed.contact.github = candidate.contact.githubUrl || "";
    if (!parsed.contact.website) parsed.contact.website = candidate.contact.websiteUrl || "";
  }

  // 2. Education: Ensure candidate education is NEVER omitted
  if ((!parsed.educations || parsed.educations.length === 0) && candidate.educations && candidate.educations.length > 0) {
    parsed.educations = candidate.educations.map((ed) => ({
      institution: ed.institution,
      degree: ed.degree,
      dates: [ed.startDate, ed.endDate].filter(Boolean).join(" - ") || "Current",
      gpa: ed.gpa ? `${ed.gpa}${ed.gpaScale ? `/${ed.gpaScale}` : ""}` : "",
    }));
  }

  // 3. Certifications: Strictly match candidate data (omit if 0)
  if (!candidate.certifications || candidate.certifications.length === 0) {
    parsed.certifications = [];
  } else if ((!parsed.certifications || parsed.certifications.length === 0) && candidate.certifications.length > 0) {
    parsed.certifications = candidate.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: c.issueDate || "",
    }));
  }

  // 4. Skills: Ensure skills are populated
  if (!parsed.skills || parsed.skills.length === 0) {
    if (candidate.skills && candidate.skills.length > 0) {
      parsed.skills = candidate.skills;
    } else {
      parsed.skills = [
        "Data Structures & Algorithms",
        "Python",
        "SQL",
        "Machine Learning",
        "Git",
        "Problem Solving",
      ];
    }
  }

  // 5. Work Experience: Strictly match candidate data (omit if 0)
  if (!candidate.experiences || candidate.experiences.length === 0) {
    parsed.experiences = [];
  } else if ((!parsed.experiences || parsed.experiences.length === 0) && candidate.experiences.length > 0) {
    parsed.experiences = candidate.experiences.map((e) => ({
      company: e.company,
      title: e.title,
      employmentType: e.employmentType || "Full-Time",
      dates: [e.startDate, e.endDate].filter(Boolean).join(" - ") || "Present",
      location: e.location || "",
      bullets: e.bullets,
    }));
  }

  // 6. Projects: Strictly match candidate data (omit if 0)
  if (!candidate.projects || candidate.projects.length === 0) {
    parsed.projects = [];
  } else if ((!parsed.projects || parsed.projects.length === 0) && candidate.projects.length > 0) {
    parsed.projects = candidate.projects.map((p) => ({
      name: p.name,
      technologies: p.technologies,
      link: p.demoUrl || p.repoUrl || "",
      bullets: p.bullets,
    }));
  }

  return parsed;
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

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export interface CandidateProfileData {
  name: string;
  headline?: string | null;
  summary?: string | null;
  skills: string[];
  experiences: Array<{
    company: string;
    title: string;
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
  }>;
}

export interface JobAnalysisResult {
  jobTitle: string;
  company: string;
  extractedSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
  scoreExplanation: string;
  roadmap: Array<{
    skillName: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    recommendations: string[];
    practicalProject: string;
    estimatedHours: number;
  }>;
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

export async function analyzeJobAndGenerateResume(
  jobDescription: string,
  candidate: CandidateProfileData
): Promise<JobAnalysisResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2, // Low temperature for factual precision
    },
  });

  const prompt = `
You are the CareerForge AI intelligence engine. 
You are tasked with:
1. Parsing a Job Description to extract requirements.
2. Comparing the requirements against a candidate's actual verified profile.
3. Calculating an honest match score without inventing qualifications.
4. Building a personalized Learning Roadmap for missing skills.
5. Generating a tailored resume using ONLY the candidate's genuine experiences and projects.

=== CANDIDATE PROFILE ===
${JSON.stringify(candidate, null, 2)}

=== JOB DESCRIPTION ===
${jobDescription}

=== RULES & GUARDRAILS ===
1. DO NOT fabricate or hallucinate companies, degrees, dates, or skills that the candidate does not have.
2. Matched skills must be real skills that the candidate has evidence for in their profile.
3. Missing skills must be explicitly identified so the candidate can learn them.
4. The Learning Roadmap should give actionable, structured milestones for the missing skills.
5. The LaTeX source must be clean, syntactically valid LaTeX compatible with standard pdflatex / Overleaf.

Return a JSON object conforming EXACTLY to this JSON structure:
{
  "jobTitle": "string",
  "company": "string",
  "extractedSkills": ["string"],
  "matchedSkills": ["string"],
  "missingSkills": ["string"],
  "matchScore": number, // integer 0-100
  "scoreExplanation": "string explaining how the score was calculated",
  "roadmap": [
    {
      "skillName": "string",
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "recommendations": ["step 1", "step 2"],
      "practicalProject": "string describing a project to build",
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
    "latexSource": "string (complete standalone LaTeX document beginning with \\documentclass{article} and ending with \\end{document})"
  }
}
`;

  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const parsed = JSON.parse(text) as JobAnalysisResult;
  return parsed;
}

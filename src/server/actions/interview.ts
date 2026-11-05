"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_APIKEY || "";
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
  return new GoogleGenerativeAI(apiKey);
}

const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite-preview",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
];

async function generateWithFallback(prompt: string, config: any): Promise<string> {
  const genAI = getGenAI();
  let lastErr: any = null;
  for (const model of FALLBACK_MODELS) {
    try {
      const m = genAI.getGenerativeModel({ model, generationConfig: config });
      const res = await m.generateContent(prompt);
      return res.response.text();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function generateInterviewQuestions(jobRole: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const prompt = `
You are a senior technical hiring manager and interview coach.
Generate exactly 10 high-yield interview questions for the role: "${jobRole}".

Cover these categories proportionally:
- 2 × Technical (coding, algorithms, language-specific)
- 2 × Architecture (system-level, design decisions)
- 2 × System Design (scalability, distributed systems)
- 2 × Behavioral (STAR-method, leadership, conflict)
- 1 × Coding (live coding problem relevant to the role)
- 1 × Leadership (team, mentoring, ownership)

For EACH question assign a difficulty:
- "Easy"   = warm-up, conceptual, definition-level
- "Medium" = requires application and reasoning
- "Hard"   = senior/principal level, complex trade-offs

Return ONLY a valid JSON array with this exact shape:
[
  {
    "id": 1,
    "category": "Technical" | "Architecture" | "System Design" | "Behavioral" | "Coding" | "Leadership",
    "difficulty": "Easy" | "Medium" | "Hard",
    "question": "Full question text here?",
    "idealAnswerPoints": [
      "Key point interviewers look for",
      "Second key point",
      "Third key point",
      "Fourth key point"
    ]
  }
]

Rules:
- All 10 questions must be specific to "${jobRole}" — no generic filler.
- idealAnswerPoints must have 3-5 concrete, actionable points.
- Questions must be realistic and reflect what top-tier companies ask.
- Do NOT wrap in markdown code fences.
`;

  const text = await generateWithFallback(prompt, {
    responseMimeType: "application/json",
    temperature: 0.4,
    maxOutputTokens: 4096,
  });

  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    // Try extracting JSON array from response
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return [];
  }
}

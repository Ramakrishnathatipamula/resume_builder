"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_APIKEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
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
Generate 4 realistic, high-yield interview questions for the role: "${jobRole}".
Include:
1. Technical architecture question
2. Coding/System problem-solving question
3. Deep-dive on technologies relevant to this role
4. Behavioral / Situational question

Return a JSON array of objects conforming to:
[
  {
    "id": 1,
    "category": "Architecture" | "Technical" | "Behavioral" | "System Design",
    "question": "string",
    "idealAnswerPoints": ["point 1", "point 2", "point 3"]
  }
]
`;

  const text = await generateWithFallback(prompt, {
    responseMimeType: "application/json",
    temperature: 0.3,
  });
  const data = JSON.parse(text);
  return data;
}


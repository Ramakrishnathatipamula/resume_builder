"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateInterviewQuestions(jobRole: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

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

  const res = await model.generateContent(prompt);
  const data = JSON.parse(res.response.text());
  return data;
}


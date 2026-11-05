"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { orchestrator } from "../agents";

export interface InterviewQuestionItem {
  id: number;
  category: "Technical" | "Architecture" | "System Design" | "Behavioral" | "Coding" | "Leadership";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  idealAnswerPoints: string[];
}

export async function generateInterviewQuestions(jobRole: string): Promise<InterviewQuestionItem[]> {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const result = await orchestrator.executeAgent<string, InterviewQuestionItem[]>(
    "AG-008",
    {
      userId: session.user.id,
      data: jobRole,
    },
    (role) => `
Generate exactly 10 high-yield interview questions for the role: "${role}".

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
- All 10 questions must be specific to "${role}" — no generic filler.
- idealAnswerPoints must have 3-5 concrete, actionable points.
- Questions must be realistic and reflect what top-tier companies ask.
`
  );

  if (!result.success || !result.data) {
    throw new Error(result.error || "AG-008 Interview Preparation Agent failed.");
  }

  return Array.isArray(result.data) ? result.data : [];
}

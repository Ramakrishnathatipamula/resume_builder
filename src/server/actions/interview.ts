"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { orchestrator } from "../agents";

export interface InterviewQuestionItem {
  id: number;
  category: "Technical" | "Architecture" | "System Design" | "Behavioral" | "Coding" | "Leadership";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  idealAnswerPoints: string[];
}

export interface AnswerEvaluationResult {
  score: number; // 0 - 100
  verdict: "Strong Hire" | "Hire" | "Lean Hire" | "Needs Improvement";
  rubricBreakdown: {
    relevanceAndAccuracy: number; // 0 - 40
    structureAndStarMethod: number; // 0 - 30
    depthAndMetrics: number; // 0 - 20
    clarityAndConciseness: number; // 0 - 10
  };
  strengths: string[];
  improvements: string[];
  modelAnswerPoints: string[];
  coachingNote: string;
}

// ─── 1. GENERATE ROLE-SPECIFIC QUESTIONS ──────────────────────────────────────
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

// ─── 2. EVALUATE USER ANSWER (MOCK INTERVIEW EVALUATION) ───────────────────────
export async function evaluateAnswerAction(input: {
  question: string;
  idealAnswerPoints: string[];
  userAnswer: string;
  role: string;
}): Promise<{ success: boolean; data?: AnswerEvaluationResult; error?: string }> {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  if (!input.userAnswer || input.userAnswer.trim().length < 10) {
    return { success: false, error: "Please provide a more detailed answer to evaluate (at least 10 characters)." };
  }

  try {
    const result = await orchestrator.executeAgent<
      typeof input,
      AnswerEvaluationResult
    >(
      "AG-008",
      {
        userId: session.user.id,
        data: input,
      },
      (data) => `
You are an expert technical interviewer and hiring manager for "${data.role}".
Evaluate this candidate's interview answer rigorously against the question and the ideal answer benchmarks.

=== INTERVIEW QUESTION ===
"${data.question}"

=== IDEAL TALKING POINTS ===
${JSON.stringify(data.idealAnswerPoints, null, 2)}

=== CANDIDATE ANSWER ===
"${data.userAnswer}"

=== EVALUATION RUBRIC ===
1. Relevance & Technical Accuracy (0-40 points): Correct concepts, direct answer to the prompt.
2. Structure & STAR Method (0-30 points): Clear situation, task, action taken, and measurable outcome.
3. Depth & Specificity (0-20 points): Specific metrics, technologies, tools, and edge-cases addressed.
4. Clarity & Communication (0-10 points): Professional tone, active voice, conciseness.

Calculate total score (0 to 100) and assign verdict:
- 85-100: "Strong Hire"
- 70-84: "Hire"
- 55-69: "Lean Hire"
- <55: "Needs Improvement"

Return strictly valid JSON conforming to:
{
  "score": number,
  "verdict": "Strong Hire" | "Hire" | "Lean Hire" | "Needs Improvement",
  "rubricBreakdown": {
    "relevanceAndAccuracy": number,
    "structureAndStarMethod": number,
    "depthAndMetrics": number,
    "clarityAndConciseness": number
  },
  "strengths": ["2-3 specific things the candidate articulated well"],
  "improvements": ["2-3 concrete ways to elevate this answer"],
  "modelAnswerPoints": ["Key missing talking points or concepts that would have made this a 100/100 answer"],
  "coachingNote": "A supportive, 2-sentence hiring manager assessment."
}
`
    );

    if (!result.success || !result.data) {
      return { success: false, error: result.error || "Answer evaluation failed." };
    }

    return { success: true, data: result.data };
  } catch (err: any) {
    console.error("Error evaluating answer:", err);
    return { success: false, error: err?.message || "Failed to evaluate answer." };
  }
}

// ─── 3. SAVE MOCK INTERVIEW SESSION ───────────────────────────────────────────
export async function saveMockInterviewSession(input: {
  jobRole: string;
  company?: string;
  questions: any[];
  transcript: any[];
  feedback: any[];
  overallScore: number;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const record = await db.mockInterview.create({
      data: {
        userId: session.user.id,
        jobRole: input.jobRole.trim(),
        company: input.company?.trim() || null,
        questionsJson: input.questions as any,
        transcriptJson: input.transcript as any,
        feedbackJson: input.feedback as any,
        overallScore: Math.round(input.overallScore),
      },
    });

    return { success: true, id: record.id };
  } catch (err: any) {
    console.error("Error saving mock interview:", err);
    return { success: false, error: err?.message || "Failed to save mock interview." };
  }
}

// ─── 4. GET USER MOCK INTERVIEWS (PRACTICE HISTORY) ───────────────────────────
export async function getUserMockInterviews() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, data: [] };

  try {
    const list = await db.mockInterview.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: list };
  } catch (err: any) {
    console.error("Error fetching mock interviews:", err);
    return { success: false, data: [], error: err?.message };
  }
}

// ─── 5. DELETE MOCK INTERVIEW ─────────────────────────────────────────────────
export async function deleteMockInterview(id: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const existing = await db.mockInterview.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) return { success: false, error: "Not found or access denied." };

    await db.mockInterview.delete({ where: { id } });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

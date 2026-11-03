"use client";

import { useState } from "react";
import { generateInterviewQuestions } from "@/server/actions/interview";
import { Video, Sparkles, HelpCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function InterviewPrepPage() {
  const [role, setRole] = useState("Full-Stack Engineer");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;
    setLoading(true);
    try {
      const q = await generateInterviewQuestions(role);
      setQuestions(q || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Role-Specific AI Coach</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Interview Preparation</h1>
        <p className="text-sm text-gray-400 mt-1">
          Prepare for tough technical, architectural, and behavioral questions tailored to your target job.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
          Target Role or Interview Focus
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Backend Engineer, DevOps Specialist..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Get Questions</span>
              </>
            )}
          </button>
        </div>
      </form>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Targeted Interview Questions</h2>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/80 text-indigo-300 uppercase">
                    {q.category}
                  </span>
                  <span className="text-xs text-gray-500">Question {idx + 1}</span>
                </div>
                <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>

                {q.idealAnswerPoints && (
                  <div className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-800/60 text-xs space-y-1.5">
                    <span className="font-semibold text-indigo-300 block">
                      💡 Key talking points interviewers look for:
                    </span>
                    <ul className="space-y-1 text-gray-300">
                      {q.idealAnswerPoints.map((pt: string, pIdx: number) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

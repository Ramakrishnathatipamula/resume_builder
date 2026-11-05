"use client";

import { useEffect, useState, useRef } from "react";
import { generateInterviewQuestions } from "@/server/actions/interview";
import { getUserJobs } from "@/server/actions/jobs";
import {
  Video,
  Sparkles,
  CheckCircle2,
  Loader2,
  Briefcase,
  Clock,
  ChevronDown,
  ChevronUp,
  Timer,
  RotateCcw,
  BookOpen,
  Zap,
  Users,
  Code2,
  AlertTriangle,
  Building2,
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";
type Category = "Architecture" | "Technical" | "Behavioral" | "System Design" | "Coding" | "Leadership";

interface Question {
  id: number;
  category: Category;
  difficulty: Difficulty;
  question: string;
  idealAnswerPoints: string[];
}

const CATEGORY_ICON: Record<string, any> = {
  Architecture: Zap,
  Technical: Code2,
  Behavioral: Users,
  "System Design": BookOpen,
  Coding: Code2,
  Leadership: Users,
};

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  Easy: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60",
  Medium: "text-amber-400 bg-amber-950/60 border-amber-800/60",
  Hard: "text-red-400 bg-red-950/60 border-red-800/60",
};

const CATEGORY_STYLE: Record<string, string> = {
  Architecture: "text-violet-300 bg-violet-950/60 border-violet-800/60",
  Technical: "text-blue-300 bg-blue-950/60 border-blue-800/60",
  Behavioral: "text-amber-300 bg-amber-950/60 border-amber-800/60",
  "System Design": "text-cyan-300 bg-cyan-950/60 border-cyan-800/60",
  Coding: "text-emerald-300 bg-emerald-950/60 border-emerald-800/60",
  Leadership: "text-pink-300 bg-pink-950/60 border-pink-800/60",
};

// ── Answer Timer Component ─────────────────────────────────────────────────
function AnswerTimer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    stop();
    setElapsed(0);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const secs = String(elapsed % 60).padStart(2, "0");
  const isOver2 = elapsed > 120;

  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono text-sm font-bold ${isOver2 ? "text-amber-400" : "text-white"}`}>
        {mins}:{secs}
      </span>
      {!running ? (
        <button
          onClick={start}
          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <Timer className="w-3 h-3" />
          Start
        </button>
      ) : (
        <button
          onClick={stop}
          className="px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          Pause
        </button>
      )}
      <button
        onClick={reset}
        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition cursor-pointer"
        title="Reset timer"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Question Card ──────────────────────────────────────────────────────────
function QuestionCard({ q, index }: { q: Question; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CATEGORY_ICON[q.category] || Code2;
  const catStyle = CATEGORY_STYLE[q.category] || "text-gray-300 bg-gray-800/60 border-gray-700";
  const diffStyle = DIFFICULTY_STYLE[q.difficulty] || "text-gray-300 bg-gray-800/60 border-gray-700";

  return (
    <div className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden hover:border-gray-700 transition">
      {/* Question header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${catStyle} flex items-center gap-1`}>
              <Icon className="w-3 h-3" />
              {q.category}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${diffStyle}`}>
              {q.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <AnswerTimer />
            <span className="text-xs text-gray-500 font-mono">Q{index + 1}</span>
          </div>
        </div>

        <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>
      </div>

      {/* Ideal answer toggle */}
      <div className="border-t border-gray-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/20 transition cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {expanded ? "Hide" : "Show"} Ideal Answer Points
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="px-5 pb-4 space-y-1.5 bg-gray-950/40">
            {q.idealAnswerPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function InterviewPrepPage() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Saved jobs for quick-pick
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Difficulty filter
  const [diffFilter, setDiffFilter] = useState<"All" | Difficulty>("All");

  useEffect(() => {
    async function loadJobs() {
      const res = await getUserJobs();
      if (res.success && res.data) setSavedJobs(res.data as any[]);
      setLoadingJobs(false);
    }
    loadJobs();
  }, []);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!role.trim()) return;
    setLoading(true);
    setError(null);
    setQuestions([]);
    try {
      const q = await generateInterviewQuestions(role);
      setQuestions(q || []);
      if (!q?.length) setError("No questions returned. Try a more specific role.");
    } catch (err: any) {
      setError(err?.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions =
    diffFilter === "All" ? questions : questions.filter((q) => q.difficulty === diffFilter);

  const stats = {
    easy: questions.filter((q) => q.difficulty === "Easy").length,
    medium: questions.filter((q) => q.difficulty === "Medium").length,
    hard: questions.filter((q) => q.difficulty === "Hard").length,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Interview Coach
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Interview Preparation</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Get 10 role-specific questions with difficulty levels, model answers, and a per-question answer timer.
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick-pick from saved jobs ── */}
      {!loadingJobs && savedJobs.length > 0 && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Quick-pick from your JD Library
          </p>
          <div className="flex flex-wrap gap-2">
            {savedJobs.slice(0, 8).map((job) => (
              <button
                key={job.id}
                onClick={() => setRole(`${job.title} at ${job.company}`)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                  role === `${job.title} at ${job.company}`
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-gray-900 border-gray-800 text-gray-300 hover:text-white hover:border-gray-700"
                }`}
              >
                <Building2 className="w-3 h-3 text-gray-500" />
                {job.title}
                <span className="text-gray-500">· {job.company}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input form ── */}
      <form
        onSubmit={handleGenerate}
        className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3"
      >
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
          Target Role or Interview Focus
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Backend Engineer at Google, DevOps Specialist, ML Engineer…"
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !role.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Generating…</span></>
            ) : (
              <><Sparkles className="w-4 h-4" /><span>Generate Questions</span></>
            )}
          </button>
        </div>
      </form>

      {/* ── Error ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Questions ── */}
      {questions.length > 0 && (
        <div className="space-y-5">
          {/* Stats + filter bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-bold text-white">{questions.length} Questions</span>
              <div className="flex items-center gap-1.5 text-xs flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />{stats.easy} Easy
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-400 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />{stats.medium} Medium
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />{stats.hard} Hard
                </span>
              </div>
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-0.5 gap-0.5">
              {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    diffFilter === d
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Question cards */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => (
              <QuestionCard key={q.id} q={q} index={idx} />
            ))}
          </div>

          {/* Re-generate CTA */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-sm font-semibold flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Generate New Set
            </button>
          </div>
        </div>
      )}

      {/* Empty state hint */}
      {!loading && questions.length === 0 && !error && (
        <div className="p-10 text-center rounded-2xl bg-gray-900/40 border border-gray-800 border-dashed">
          <Video className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-white">Ready to practice?</p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Select a role from your JD library or type a custom role above, then click Generate Questions.
          </p>
        </div>
      )}
    </div>
  );
}

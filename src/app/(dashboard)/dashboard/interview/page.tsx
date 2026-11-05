"use client";

import { useEffect, useState, useRef } from "react";
import {
  generateInterviewQuestions,
  evaluateAnswerAction,
  saveMockInterviewSession,
  getUserMockInterviews,
  deleteMockInterview,
  InterviewQuestionItem,
  AnswerEvaluationResult,
} from "@/server/actions/interview";
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
  Send,
  History,
  Trash2,
  Award,
  TrendingUp,
  X,
  Eye,
  FileCheck2,
} from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";
type Category = "Architecture" | "Technical" | "Behavioral" | "System Design" | "Coding" | "Leadership";

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

export default function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState<"practice" | "mock" | "history">("practice");
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Saved jobs for quick-pick
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Filter
  const [diffFilter, setDiffFilter] = useState<"All" | Difficulty>("All");

  // Mock Interview State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [evaluations, setEvaluations] = useState<Record<number, AnswerEvaluationResult>>({});
  const [evaluatingMap, setEvaluatingMap] = useState<Record<number, boolean>>({});
  const [savingSession, setSavingSession] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // History State
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);

  const loadSavedJobs = async () => {
    const res = await getUserJobs();
    if (res.success && res.data) setSavedJobs(res.data as any[]);
    setLoadingJobs(false);
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    const res = await getUserMockInterviews();
    if (res.success && res.data) setHistoryList(res.data as any[]);
    setLoadingHistory(false);
  };

  useEffect(() => {
    loadSavedJobs();
    loadHistory();
  }, []);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!role.trim()) return;
    setLoading(true);
    setError(null);
    setSaveSuccessMsg(null);
    setQuestions([]);
    setUserAnswers({});
    setEvaluations({});

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

  const handleEvaluateAnswer = async (q: InterviewQuestionItem) => {
    const answer = userAnswers[q.id];
    if (!answer || answer.trim().length < 10) {
      setError("Please write an answer with at least 10 characters before evaluating.");
      return;
    }
    setError(null);
    setEvaluatingMap((prev) => ({ ...prev, [q.id]: true }));

    try {
      const res = await evaluateAnswerAction({
        question: q.question,
        idealAnswerPoints: q.idealAnswerPoints,
        userAnswer: answer,
        role: role || "Software Engineer",
      });

      if (res.success && res.data) {
        setEvaluations((prev) => ({ ...prev, [q.id]: res.data! }));
      } else {
        setError(res.error || "Failed to evaluate answer.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to evaluate answer.");
    } finally {
      setEvaluatingMap((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const handleSaveMockInterview = async () => {
    if (questions.length === 0) return;
    setSavingSession(true);
    setError(null);
    setSaveSuccessMsg(null);

    const evaluatedKeys = Object.keys(evaluations).map(Number);
    const totalScore = evaluatedKeys.length > 0
      ? evaluatedKeys.reduce((acc, k) => acc + (evaluations[k]?.score || 0), 0) / evaluatedKeys.length
      : 0;

    const transcript = questions.map((q) => ({
      questionId: q.id,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      userAnswer: userAnswers[q.id] || "No answer provided.",
    }));

    const feedbackList = evaluatedKeys.map((k) => ({
      questionId: k,
      evaluation: evaluations[k],
    }));

    const res = await saveMockInterviewSession({
      jobRole: role || "General Interview",
      questions,
      transcript,
      feedback: feedbackList,
      overallScore: Math.round(totalScore),
    });

    if (res.success) {
      setSaveSuccessMsg("Mock interview session saved to practice history!");
      await loadHistory();
    } else {
      setError(res.error || "Failed to save mock interview.");
    }
    setSavingSession(false);
  };

  const handleDeleteHistory = async (id: string) => {
    if (!confirm("Delete this practice session?")) return;
    await deleteMockInterview(id);
    await loadHistory();
    if (selectedHistoryItem?.id === id) setSelectedHistoryItem(null);
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
      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Interview Coach (AG-008)
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Interview Preparation</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Practice role-specific questions, evaluate your answers with instant AI feedback, and review practice history.
            </p>
          </div>
        </div>

        {/* ── Mode Tabs ── */}
        <div className="flex items-center gap-2 mt-4 bg-gray-900/70 border border-gray-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab("practice")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "practice"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practice Questions ({questions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("mock")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "mock"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mock Interview Evaluation</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("history");
              loadHistory();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Practice History ({historyList.length})</span>
          </button>
        </div>
      </div>

      {/* ── Error & Success Alerts ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="p-1 text-red-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* ── TAB 1 & 2: ROLE PICKER & GENERATOR ── */}
      {activeTab !== "history" && (
        <>
          {/* Quick-pick from saved jobs */}
          {!loadingJobs && savedJobs.length > 0 && (
            <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Quick-pick target role from your JD Library
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

          {/* Input form */}
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
                placeholder="e.g. Senior Backend Engineer at Google, ML Specialist, DevOps Lead…"
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
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB 1: PRACTICE QUESTIONS MODE                             */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === "practice" && (
        <div className="space-y-5">
          {questions.length > 0 && (
            <>
              {/* Stats & filter */}
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

              {/* Questions list */}
              <div className="space-y-4">
                {filteredQuestions.map((q, idx) => {
                  const Icon = CATEGORY_ICON[q.category] || Code2;
                  const catStyle = CATEGORY_STYLE[q.category] || "text-gray-300 bg-gray-800/60 border-gray-700";
                  const diffStyle = DIFFICULTY_STYLE[q.difficulty] || "text-gray-300 bg-gray-800/60 border-gray-700";

                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl bg-gray-900/70 border border-gray-800 overflow-hidden hover:border-gray-700 transition"
                    >
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
                            <span className="text-xs text-gray-500 font-mono">Q{idx + 1}</span>
                          </div>
                        </div>

                        <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>
                      </div>

                      {/* Ideal points */}
                      <div className="border-t border-gray-800 p-4 bg-gray-950/40 space-y-1.5">
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                          Ideal Answer Talking Points:
                        </span>
                        {q.idealAnswerPoints.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!loading && questions.length === 0 && (
            <div className="p-10 text-center rounded-2xl bg-gray-900/40 border border-gray-800 border-dashed">
              <Video className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">Generate interview questions to begin</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Pick a target role from your JD library above or enter a role title, then click Generate Questions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB 2: INTERACTIVE MOCK INTERVIEW EVALUATION               */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === "mock" && (
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-gray-900/40 border border-gray-800 border-dashed">
              <Zap className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">No active interview session</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Generate questions above first. You can then type your answers and receive immediate hiring manager evaluations.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Session save bar */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-sm font-bold text-white block">Mock Interview Session: {role}</span>
                  <span className="text-xs text-indigo-300">
                    {Object.keys(evaluations).length} of {questions.length} questions evaluated
                  </span>
                </div>
                <button
                  onClick={handleSaveMockInterview}
                  disabled={savingSession || Object.keys(evaluations).length === 0}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {savingSession ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck2 className="w-4 h-4" />}
                  <span>Save Session to History</span>
                </button>
              </div>

              {/* Questions with answer inputs */}
              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const isEvaluating = evaluatingMap[q.id];
                  const evaluation = evaluations[q.id];
                  const Icon = CATEGORY_ICON[q.category] || Code2;

                  return (
                    <div
                      key={q.id}
                      className="rounded-2xl bg-gray-900/70 border border-gray-800 p-5 space-y-4 hover:border-gray-700 transition"
                    >
                      {/* Question meta */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-gray-400 font-bold">Q{idx + 1}.</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${CATEGORY_STYLE[q.category] || "text-gray-300"}`}>
                            {q.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${DIFFICULTY_STYLE[q.difficulty]}`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <AnswerTimer />
                      </div>

                      <p className="text-sm font-bold text-white leading-relaxed">{q.question}</p>

                      {/* Candidate Answer Box */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 block">
                          Your Answer (type your response using the STAR method):
                        </label>
                        <textarea
                          rows={4}
                          value={userAnswers[q.id] || ""}
                          onChange={(e) =>
                            setUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          placeholder="Situation: In my previous project... Task: I needed to... Action: I architected and implemented... Result: Reduced latency by 40%..."
                          className="w-full p-3.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-600 transition"
                        />
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-gray-500">
                            {(userAnswers[q.id] || "").length} characters
                          </span>
                          <button
                            type="button"
                            onClick={() => handleEvaluateAnswer(q)}
                            disabled={isEvaluating || !(userAnswers[q.id] || "").trim()}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                          >
                            {isEvaluating ? (
                              <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Evaluating…</span></>
                            ) : (
                              <><Send className="w-3.5 h-3.5" /><span>Evaluate My Answer</span></>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Evaluation Feedback Panel */}
                      {evaluation && (
                        <div className="p-4 rounded-xl bg-gray-950 border border-emerald-800/40 space-y-3 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-bold text-white">AI Evaluation Score</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-black text-white">{evaluation.score}</span>
                              <span className="text-xs text-gray-400">/ 100</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  evaluation.verdict === "Strong Hire"
                                    ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                                    : evaluation.verdict === "Hire"
                                    ? "bg-blue-950 border border-blue-800 text-blue-400"
                                    : evaluation.verdict === "Lean Hire"
                                    ? "bg-amber-950 border border-amber-800 text-amber-400"
                                    : "bg-red-950 border border-red-800 text-red-400"
                                }`}
                              >
                                {evaluation.verdict}
                              </span>
                            </div>
                          </div>

                          {/* Rubric Breakdown */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div className="p-2 rounded-lg bg-gray-900 border border-gray-800">
                              <span className="text-gray-400 block">Relevance</span>
                              <span className="font-bold text-white">{evaluation.rubricBreakdown.relevanceAndAccuracy}/40</span>
                            </div>
                            <div className="p-2 rounded-lg bg-gray-900 border border-gray-800">
                              <span className="text-gray-400 block">STAR Method</span>
                              <span className="font-bold text-white">{evaluation.rubricBreakdown.structureAndStarMethod}/30</span>
                            </div>
                            <div className="p-2 rounded-lg bg-gray-900 border border-gray-800">
                              <span className="text-gray-400 block">Depth & Metrics</span>
                              <span className="font-bold text-white">{evaluation.rubricBreakdown.depthAndMetrics}/20</span>
                            </div>
                            <div className="p-2 rounded-lg bg-gray-900 border border-gray-800">
                              <span className="text-gray-400 block">Clarity</span>
                              <span className="font-bold text-white">{evaluation.rubricBreakdown.clarityAndConciseness}/10</span>
                            </div>
                          </div>

                          {/* Strengths & Improvements */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {evaluation.strengths.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[11px] font-bold text-emerald-400 block">Strengths:</span>
                                <ul className="space-y-1 text-xs text-gray-300">
                                  {evaluation.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                      <span>{s}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {evaluation.improvements.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[11px] font-bold text-amber-400 block">Key Improvements:</span>
                                <ul className="space-y-1 text-xs text-gray-300">
                                  {evaluation.improvements.map((imp, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                      <span>{imp}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {evaluation.coachingNote && (
                            <p className="text-xs text-indigo-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-800/40">
                              💡 <strong>Hiring Manager Note:</strong> {evaluation.coachingNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB 3: PRACTICE HISTORY MODE                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="flex items-center justify-center p-12 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
              <span>Loading practice history…</span>
            </div>
          ) : historyList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800 border-dashed">
              <History className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No saved mock interviews yet</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Complete an interactive mock interview under the Mock Interview Evaluation tab and click &quot;Save Session to History&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyList.map((session) => (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 transition flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-base">{session.jobRole}</span>
                      {session.company && (
                        <span className="text-gray-400 text-xs">@ {session.company}</span>
                      )}
                      {session.overallScore !== null && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                          {session.overallScore}/100 Score
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Saved {new Date(session.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>
                        {Array.isArray(session.questionsJson) ? session.questionsJson.length : 0} questions
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedHistoryItem(session)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                    <button
                      onClick={() => handleDeleteHistory(session.id)}
                      className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                      title="Delete practice record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HISTORY REVIEW MODAL                                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-950/60">
              <div>
                <h3 className="text-base font-bold text-white">{selectedHistoryItem.jobRole}</h3>
                <p className="text-xs text-gray-400">
                  {new Date(selectedHistoryItem.createdAt).toLocaleDateString()} · Overall Score:{" "}
                  <strong className="text-emerald-400">{selectedHistoryItem.overallScore}/100</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {Array.isArray(selectedHistoryItem.transcriptJson) &&
                selectedHistoryItem.transcriptJson.map((t: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400 font-bold">Q{i + 1}.</span>
                      <span className="text-xs font-semibold text-white">{t.question}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-900 text-xs text-gray-300">
                      <span className="text-gray-500 block mb-0.5">Candidate Answer:</span>
                      {t.userAnswer}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

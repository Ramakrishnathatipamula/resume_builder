"use client";

import { useEffect, useState } from "react";
import {
  extractJobIntelligence,
  getUserJobs,
  deleteJob,
  getJobById,
} from "@/server/actions/jobs";
import type { JDIntelligence } from "@/server/actions/jobs";
import {
  Briefcase,
  Sparkles,
  Loader2,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Building2,
  Clock,
  GraduationCap,
  Code2,
  Target,
  BookOpen,
  Wifi,
  Plus,
  ArrowRight,
  FileSearch,
  Tag,
} from "lucide-react";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string | null;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  tools: string[];
  keywords: string[];
  rawText: string;
  createdAt: string | Date;
  matchResults: { overallScore: number }[];
  resumes: { id: string }[];
}

export default function JobIntelligencePage() {
  const [mode, setMode] = useState<"library" | "extract">("library");
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Extract Form State
  const [jdText, setJdText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractResult, setExtractResult] = useState<{
    jobId: string;
    intelligence: JDIntelligence;
  } | null>(null);

  // View Detail Modal
  const [viewingJob, setViewingJob] = useState<SavedJob | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadJobs = async () => {
    setLoadingJobs(true);
    const res = await getUserJobs();
    if (res.success && res.data) {
      setJobs(res.data as SavedJob[]);
    }
    setLoadingJobs(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;
    setExtracting(true);
    setExtractError(null);
    setExtractResult(null);
    try {
      const res = await extractJobIntelligence(jdText);
      if (res.success && res.data) {
        setExtractResult(res.data as { jobId: string; intelligence: JDIntelligence });
        await loadJobs(); // refresh library
      } else {
        setExtractError(res.error || "Failed to extract job intelligence.");
      }
    } catch (err: any) {
      setExtractError(err?.message || "Unexpected error.");
    } finally {
      setExtracting(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Delete this job description and all related data?")) return;
    await deleteJob(jobId);
    await loadJobs();
    if (viewingJob?.id === jobId) setViewingJob(null);
  };

  const handleViewJob = async (jobId: string) => {
    setLoadingDetail(true);
    const res = await getJobById(jobId);
    if (res.success && res.data) {
      setViewingJob(res.data as any);
    }
    setLoadingDetail(false);
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400 bg-emerald-950/60 border-emerald-800/60";
    if (score >= 50) return "text-amber-400 bg-amber-950/60 border-amber-800/60";
    return "text-red-400 bg-red-950/60 border-red-800/60";
  };

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PAGE HEADER                                                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Job Intelligence
            </h1>
            <p className="text-xs text-gray-400">
              Extract structured requirements from any job description and build your JD library.
            </p>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mt-5 bg-gray-900/60 border border-gray-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setMode("library")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              mode === "library"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              JD Library ({jobs.length})
            </span>
          </button>
          <button
            onClick={() => {
              setMode("extract");
              setExtractResult(null);
              setJdText("");
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              mode === "extract"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Extract New JD
            </span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODE: LIBRARY                                              */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {mode === "library" && (
        <div>
          {loadingJobs ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-3 text-indigo-500" />
              <span className="text-sm">Loading your job library...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto text-gray-500">
                <Briefcase className="w-8 h-8" />
              </div>
              <p className="text-gray-300 font-semibold">No jobs saved yet</p>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Extract a job description to build your personal JD library with AI-parsed requirements.
              </p>
              <button
                onClick={() => setMode("extract")}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                Extract Your First JD
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => {
                const score = job.matchResults?.[0]?.overallScore;
                const hasResume = job.resumes?.length > 0;
                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 transition group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-white text-base truncate">
                            {job.title}
                          </h3>
                          {score !== undefined && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${scoreColor(
                                score
                              )}`}
                            >
                              {score}% Match
                            </span>
                          )}
                          {hasResume && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/60 border border-purple-800/60 text-purple-400">
                              Resume Generated
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {job.company}
                          </span>
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(job.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Skills preview */}
                        {job.requiredSkills && job.requiredSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.requiredSkills.slice(0, 6).map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded bg-gray-950 border border-gray-800 text-[10px] text-gray-400"
                              >
                                {s}
                              </span>
                            ))}
                            {job.requiredSkills.length > 6 && (
                              <span className="text-[10px] text-gray-500 self-center">
                                +{job.requiredSkills.length - 6} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                        <a
                          href={`/dashboard?jobId=${job.id}&company=${encodeURIComponent(job.company)}&role=${encodeURIComponent(job.title)}`}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                          title="Analyze & generate resume for this job"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          Generate Resume
                        </a>
                        <button
                          onClick={() => handleViewJob(job.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODE: EXTRACT NEW JD                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {mode === "extract" && (
        <div className="space-y-6">
          {!extractResult ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 text-sm text-indigo-300 flex items-start gap-3">
                <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Paste any job description below. The AI will extract structured requirements: skills,
                  responsibilities, tools, ATS keywords, experience level, and more — all saved to your
                  JD library automatically.
                </span>
              </div>

              {extractError && (
                <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{extractError}</span>
                </div>
              )}

              <form onSubmit={handleExtract} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Job Description Text
                    </label>
                    <span className="text-[11px] text-gray-500">{jdText.length} characters</span>
                  </div>
                  <textarea
                    required
                    rows={14}
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the full job description here (including title, company, responsibilities, requirements, qualifications)..."
                    className="w-full p-4 rounded-2xl bg-gray-950/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed transition font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={extracting || !jdText.trim()}
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {extracting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Extracting Intelligence...</span>
                    </>
                  ) : (
                    <>
                      <FileSearch className="w-5 h-5" />
                      <span>Extract Job Intelligence</span>
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ══ EXTRACTION RESULTS ══ */
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-gray-800">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 inline-flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Intelligence Extracted
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">
                    {extractResult.intelligence.jobTitle}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      {extractResult.intelligence.company}
                    </span>
                    {extractResult.intelligence.location !== "Not Specified" && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {extractResult.intelligence.location}
                      </span>
                    )}
                    {extractResult.intelligence.workType !== "Not Specified" && (
                      <span className="flex items-center gap-1.5">
                        <Wifi className="w-3.5 h-3.5" />
                        {extractResult.intelligence.workType}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setExtractResult(null);
                    setJdText("");
                    setMode("library");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-400 hover:text-white transition shrink-0"
                >
                  View Library
                </button>
              </div>

              {/* Job Summary */}
              <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Role Summary
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {extractResult.intelligence.jobSummary}
                </p>
                <div className="flex gap-4 mt-3 flex-wrap">
                  {extractResult.intelligence.experienceRequired !== "Not Specified" && (
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <strong className="text-white">Experience:</strong>{" "}
                      {extractResult.intelligence.experienceRequired}
                    </span>
                  )}
                  {extractResult.intelligence.educationRequired !== "Not Specified" && (
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3 h-3" />
                      <strong className="text-white">Education:</strong>{" "}
                      {extractResult.intelligence.educationRequired}
                    </span>
                  )}
                  {extractResult.intelligence.salaryRange !== "Not Specified" && (
                    <span className="text-xs text-gray-400">
                      <strong className="text-white">Salary:</strong>{" "}
                      {extractResult.intelligence.salaryRange}
                    </span>
                  )}
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Required Skills */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Required Skills ({extractResult.intelligence.requiredSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {extractResult.intelligence.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                {extractResult.intelligence.preferredSkills.length > 0 && (
                  <div className="p-5 rounded-2xl bg-sky-950/20 border border-sky-900/40 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" />
                      Preferred / Nice-to-Have ({extractResult.intelligence.preferredSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {extractResult.intelligence.preferredSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-300 text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tools */}
              {extractResult.intelligence.tools.length > 0 && (
                <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5" />
                    Tools, Platforms & Frameworks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {extractResult.intelligence.tools.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-gray-950 border border-gray-800 text-gray-300 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {extractResult.intelligence.responsibilities.length > 0 && (
                <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {extractResult.intelligence.responsibilities.map((r, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-indigo-400 font-bold mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ATS Keywords */}
              {extractResult.intelligence.keywords.length > 0 && (
                <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-900/40 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" />
                    ATS Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {extractResult.intelligence.keywords.map((k) => (
                      <span
                        key={k}
                        className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-medium"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA: Generate Resume */}
              <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">
                    Ready to generate a tailored resume?
                  </p>
                  <p className="text-xs text-gray-400">
                    Head to the Generate Resume page to match your profile against this job and build
                    an AI-tailored resume.
                  </p>
                </div>
                <a
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Resume
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* DETAIL VIEW MODAL                                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{viewingJob.title}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {viewingJob.company}
                  </span>
                  {viewingJob.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {viewingJob.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(viewingJob.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingJob(null)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Required Skills */}
            {viewingJob.requiredSkills.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Required Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewingJob.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Skills */}
            {viewingJob.preferredSkills && viewingJob.preferredSkills.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-sky-400" /> Preferred Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewingJob.preferredSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-300 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tools */}
            {viewingJob.tools && viewingJob.tools.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> Tools & Frameworks
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewingJob.tools.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-gray-300 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {viewingJob.responsibilities && viewingJob.responsibilities.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Responsibilities
                </p>
                <ul className="space-y-2">
                  {viewingJob.responsibilities.map((r, idx) => (
                    <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Keywords */}
            {viewingJob.keywords && viewingJob.keywords.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-400" /> ATS Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewingJob.keywords.map((k) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs"
                    >
                      #{k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleDelete(viewingJob.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 border border-red-900/60 text-red-400 hover:text-red-300 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Detail Overlay */}
      {loadingDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="flex items-center gap-3 text-white">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span className="text-sm">Loading job details...</span>
          </div>
        </div>
      )}
    </div>
  );
}


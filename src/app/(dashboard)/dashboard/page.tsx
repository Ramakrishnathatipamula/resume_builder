"use client";

import { useState } from "react";
import { processJobAndGenerateResume } from "@/server/actions/resume-generator";
import type { JobAnalysisResult } from "@/server/services/ai";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  ExternalLink,
  Download,
  Copy,
  Check,
  RotateCcw,
  Loader2,
  Briefcase,
  Code2,
} from "lucide-react";

const SAMPLE_JOB_DESCRIPTION = `Job Title: Senior Full-Stack Engineer
Company: CloudScale Technologies
Location: Remote (US / Global)

About the Role:
We are seeking an experienced Senior Full-Stack Engineer to lead the architecture and development of our next-generation cloud analytics platform.

Key Responsibilities:
- Design, build, and deploy high-performance web applications using Next.js, React, TypeScript, and Tailwind CSS.
- Architect resilient backend microservices using Node.js and PostgreSQL.
- Implement secure authentication and multi-tenant data access policies.
- Collaborate with product designers to implement responsive, accessible UI components.
- Integrate cloud storage and serverless edge functions.

Requirements:
- 4+ years of production experience with TypeScript, React, and modern Next.js.
- Solid experience designing relational schemas in PostgreSQL.
- Strong understanding of RESTful APIs, Server Actions, and state management.
- Experience with Docker, CI/CD pipelines, and cloud deployment (AWS or Vercel).
- Excellent communication and problem-solving skills.

Preferred Qualifications:
- Experience with GraphQL or Prisma ORM.
- Familiarity with AI model integration and LLM application engineering.
- Contributions to open-source software.`;

export default function DashboardPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError("Please paste or type a job description to begin.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await processJobAndGenerateResume(jobDescription);
      if (!res.success || !res.data) {
        setError(res.error || "Failed to analyze job description.");
      } else {
        setResult(res.data.analysis);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLatex = () => {
    if (!result?.tailoredResume.latexSource) return;
    navigator.clipboard.writeText(result.tailoredResume.latexSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLatex = () => {
    if (!result?.tailoredResume.latexSource) return;
    const blob = new Blob([result.tailoredResume.latexSource], {
      type: "text/x-tex;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.jobTitle.replace(/\s+/g, "_")}_Resume.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* ============================================================== */}
      {/* 1. INITIAL STATE: FOCUSED JOB DESCRIPTION INPUT + GENERATE BTN */}
      {/* ============================================================== */}
      {!result ? (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3 shadow-lg shadow-indigo-600/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Job Description & Resume Generator
            </h1>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Paste your target job description below. We will calculate your exact skill matches, identify missing requirements with a learning roadmap, and generate a tailored resume.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Target Job Description
                </label>
                <button
                  type="button"
                  onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
                >
                  Paste Sample Job Description
                </button>
              </div>

              <textarea
                required
                rows={12}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here (e.g. Responsibilities, Requirements, Qualifications, Tech Stack)..."
                className="w-full p-4 rounded-2xl bg-gray-950/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed transition shadow-inner font-mono"
              />

              <div className="flex justify-between items-center mt-2 px-1 text-xs text-gray-500">
                <span>{jobDescription.length} characters</span>
                {jobDescription.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setJobDescription("")}
                    className="text-gray-400 hover:text-white transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !jobDescription.trim()}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Match & Generating Tailored Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Resume</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* ============================================================== */
        /* 2. RESULTS STATE: SKILL MATCHES, ROADMAP & TAILORED RESUME     */
        /* ============================================================== */
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Header & Reset Button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-800 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 mb-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{result.company || "Target Company"}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {result.jobTitle || "Job Analysis & Tailored Resume"}
              </h1>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setJobDescription("");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-sm font-medium text-gray-300 transition shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Analyze Another Job</span>
            </button>
          </div>

          {/* ============================================================== */}
          {/* SECTION A: HOW MANY SKILLS MATCH & SCORE                       */}
          {/* ============================================================== */}
          <div className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-800/70">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white tracking-tight">Skill Match Analysis</h2>
                <p className="text-sm text-gray-400 max-w-xl">{result.scoreExplanation}</p>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-4 bg-gray-950/80 px-5 py-3 rounded-2xl border border-gray-800 shrink-0">
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-400">
                    {result.matchScore}%
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Compatibility
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                  {result.matchedSkills.length}/{result.extractedSkills.length}
                </div>
              </div>
            </div>

            {/* Matched vs Missing Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matched Skills ({result.matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No direct skill matches found in your profile yet.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-900/40">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Missing Skills Gap ({result.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-medium"
                      >
                        ! {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-400">You have all the required skills for this job!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION B: WHAT SHOULD LEARN (REQUIRED SKILLS ROADMAP)        */}
          {/* ============================================================== */}
          {result.roadmap && result.roadmap.length > 0 && (
            <div className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Skill Gap Closer</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    What You Should Learn (Required Skills Roadmap)
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.roadmap.map((item, index) => (
                  <div
                    key={item.skillName || index}
                    className="p-5 rounded-xl bg-gray-950/60 border border-gray-800/80 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-white text-base">{item.skillName}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              item.priority === "HIGH"
                                ? "bg-red-950/80 text-red-300 border border-red-800/60"
                                : item.priority === "MEDIUM"
                                ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                                : "bg-blue-950/80 text-blue-300 border border-blue-800/60"
                            }`}
                          >
                            {item.priority} Priority
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            ~{item.estimatedHours}h
                          </span>
                        </div>
                      </div>

                      {/* Learning Topics */}
                      <ul className="space-y-1.5 mt-3">
                        {item.recommendations.map((rec, rIdx) => (
                          <li key={rIdx} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practical Project Recommendation */}
                    {item.practicalProject && (
                      <div className="p-3 rounded-lg bg-gray-900/90 border border-gray-800 text-xs">
                        <span className="font-semibold text-indigo-300 block mb-1">
                          🛠️ Hands-on Project to Prove Skill:
                        </span>
                        <span className="text-gray-300">{item.practicalProject}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION C: TAILORED GENERATED RESUME & OVERLEAF EXPORT         */}
          {/* ============================================================== */}
          <div className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tailored Resume Ready</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Generated Resume for {result.jobTitle}
                </h2>
              </div>

              {/* Action Buttons: Overleaf & Download */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Official Overleaf Form Submission POST */}
                <form
                  action="https://www.overleaf.com/docs"
                  method="POST"
                  target="_blank"
                  className="inline-block"
                >
                  <input
                    type="hidden"
                    name="snip"
                    value={result.tailoredResume.latexSource}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Overleaf</span>
                  </button>
                </form>

                {/* Download LaTeX */}
                <button
                  onClick={handleDownloadLatex}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-white font-medium text-xs flex items-center gap-2 transition"
                >
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  <span>Download .tex</span>
                </button>

                {/* Copy LaTeX Source */}
                <button
                  onClick={handleCopyLatex}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-white font-medium text-xs flex items-center gap-2 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>Copy LaTeX</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Resume Preview Window */}
            <div className="p-6 rounded-xl bg-gray-950/90 border border-gray-800/90 space-y-5 text-gray-200">
              <div className="border-b border-gray-800 pb-4">
                <h3 className="text-lg font-bold text-white">{result.tailoredResume.title}</h3>
                <p className="text-xs text-indigo-400 font-medium">{result.tailoredResume.targetRole}</p>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  {result.tailoredResume.summary}
                </p>
              </div>

              {/* Skills Section */}
              {result.tailoredResume.skills && result.tailoredResume.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Emphasized Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.tailoredResume.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-xs text-gray-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiences Section */}
              {result.tailoredResume.experiences && result.tailoredResume.experiences.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Relevant Work Experience
                  </h4>
                  <div className="space-y-4">
                    {result.tailoredResume.experiences.map((exp, eIdx) => (
                      <div key={eIdx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <strong className="text-white">{exp.title}</strong>
                          <span className="text-gray-400">{exp.company}</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {result.tailoredResume.projects && result.tailoredResume.projects.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Targeted Projects
                  </h4>
                  <div className="space-y-4">
                    {result.tailoredResume.projects.map((proj, pIdx) => (
                      <div key={pIdx} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <strong className="text-white">{proj.name}</strong>
                          <span className="text-gray-400 text-[11px]">
                            {proj.technologies?.join(", ")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300">{proj.description}</p>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300">
                          {proj.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

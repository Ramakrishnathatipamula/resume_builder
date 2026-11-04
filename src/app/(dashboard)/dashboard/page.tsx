"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  analyzeJobMatchAction,
  generateResumeAction,
} from "@/server/actions/resume-generator";
import type { JobMatchAnalysis, TailoredResumeResult } from "@/server/services/ai";
import {
  RESUME_TEMPLATES,
  getTemplateById,
  getStoredCustomTemplates,
  ResumeTemplate,
} from "@/lib/templates-data";
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
  GraduationCap,
  Users,
  Code2,
  FolderOpen,
  Layers,
  TrendingUp,
  Info,
  Printer,
  X,
  LayoutTemplate,
  RefreshCw,
  Award,
  Globe,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
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

// ─── SCORE RING COMPONENT ──────────────────────────────────────────────────────
function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = 45;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color =
    score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="rotate-[-90deg]">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1f2937" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={circ - fill}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

// ─── CATEGORY BAR ──────────────────────────────────────────────────────────────
function CategoryBar({
  label,
  score,
  icon: Icon,
  color,
}: {
  label: string;
  score: number;
  icon: any;
  color: string;
}) {
  const barColor =
    color === "emerald" ? "bg-emerald-500" :
    color === "blue"    ? "bg-blue-500"    :
    color === "purple"  ? "bg-purple-500"  :
    color === "amber"   ? "bg-amber-500"   : "bg-indigo-500";

  const textColor =
    color === "emerald" ? "text-emerald-400" :
    color === "blue"    ? "text-blue-400"    :
    color === "purple"  ? "text-purple-400"  :
    color === "amber"   ? "text-amber-400"   : "text-indigo-400";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className={`flex items-center gap-1.5 font-medium ${textColor}`}>
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
        <span className="font-bold text-white">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Step 1: Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [matchAnalysis, setMatchAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [currentMatchResultId, setCurrentMatchResultId] = useState<string | null>(null);

  // Step 2: Resume Generation State
  const [generatingResume, setGeneratingResume] = useState(false);
  const [tailoredResume, setTailoredResume] = useState<TailoredResumeResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Template State
  const [customTemplates, setCustomTemplates] = useState<ResumeTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("jakes-tech");
  const [currentResumeTemplateId, setCurrentResumeTemplateId] = useState("jakes-tech");
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const [activeResultTab, setActiveResultTab] = useState<
    "overview" | "skills" | "education" | "roadmap" | "resume"
  >("overview");

  useEffect(() => {
    const custom = getStoredCustomTemplates();
    setCustomTemplates(custom);

    const urlTmpl = searchParams.get("template");
    const savedTmpl = localStorage.getItem("preferredResumeTemplate");
    if (urlTmpl) {
      setSelectedTemplateId(urlTmpl);
      setCurrentResumeTemplateId(urlTmpl);
    } else if (savedTmpl) {
      setSelectedTemplateId(savedTmpl);
      setCurrentResumeTemplateId(savedTmpl);
    }
  }, [searchParams]);

  // ─── STEP 1: ANALYZE JOB MATCH ──────────────────────────────────────────────
  const handleAnalyzeJobMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError("Please paste or type a job description to begin.");
      return;
    }
    setError(null);
    setAnalyzing(true);
    setTailoredResume(null);

    try {
      const res = await analyzeJobMatchAction(jobDescription);
      if (!res.success || !res.data) {
        setError(res.error || "Failed to analyze job description.");
      } else {
        setMatchAnalysis(res.data.analysis);
        setCurrentJobId(res.data.jobId);
        setCurrentMatchResultId(res.data.matchResultId);
        setActiveResultTab("overview");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  // ─── STEP 2: GENERATE TAILORED RESUME FOR CHOSEN TEMPLATE ───────────────────
  const handleExecuteResumeGeneration = async (templateId: string) => {
    if (!currentJobId || !currentMatchResultId) {
      setError("Job analysis session missing. Please analyze the job first.");
      return;
    }

    setShowTemplateModal(false);
    setError(null);
    setGeneratingResume(true);
    setCurrentResumeTemplateId(templateId);

    const all = [...customTemplates, ...RESUME_TEMPLATES];
    const tmplObj = all.find((t) => t.id === templateId);
    const customSnippet = tmplObj?.id.startsWith("custom-") ? tmplObj.latexGuidelines : undefined;

    try {
      const res = await generateResumeAction(
        currentJobId,
        currentMatchResultId,
        templateId,
        customSnippet
      );

      if (!res.success || !res.data) {
        setError(res.error || "Failed to generate tailored resume.");
      } else {
        setTailoredResume(res.data.tailoredResume);
        setActiveResultTab("resume");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while generating resume.");
    } finally {
      setGeneratingResume(false);
    }
  };

  const handleCopyLatex = () => {
    if (!tailoredResume?.latexSource) return;
    navigator.clipboard.writeText(tailoredResume.latexSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLatex = () => {
    if (!tailoredResume?.latexSource) return;
    const blob = new Blob([tailoredResume.latexSource], {
      type: "text/x-tex;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(matchAnalysis?.jobTitle || "Resume").replace(/\s+/g, "_")}_Resume.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintResume = () => {
    window.print();
  };

  const allAvailableTemplates = [...customTemplates, ...RESUME_TEMPLATES];
  const activeTemplate = getTemplateById(currentResumeTemplateId, customTemplates);

  return (
    <div className="max-w-4xl mx-auto py-4">

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 1. INITIAL STATE: JOB DESCRIPTION INPUT & ANALYZE BUTTON    */}
      {/* ════════════════════════════════════════════════════════════ */}
      {!matchAnalysis ? (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Job Description & Career Intelligence
            </h1>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Paste your target job description. We will first analyze and match your verified skills, education, and experience, identify gaps with a learning roadmap, and let you select a template to generate your resume.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAnalyzeJobMatch} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Target Job Description
                </label>
                <button
                  type="button"
                  onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTION)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition cursor-pointer"
                >
                  Paste Sample JD
                </button>
              </div>
              <textarea
                required
                rows={12}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here (responsibilities, required tech stack, qualifications)..."
                className="w-full p-4 rounded-2xl bg-gray-950/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed transition font-mono"
              />
              <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
                <span>{jobDescription.length} characters</span>
                {jobDescription.length > 0 && (
                  <button type="button" onClick={() => setJobDescription("")} className="text-gray-400 hover:text-white transition cursor-pointer">
                    Clear
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={analyzing || !jobDescription.trim()}
              className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Match, Skills & Requirements...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Job & Match Skills</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* ════════════════════════════════════════════════════════════ */
        /* 2. MATCH ANALYSIS STATE (WITH DEDICATED GENERATE CTA)        */
        /* ════════════════════════════════════════════════════════════ */
        <div className="space-y-6 animate-in fade-in duration-500">

          {/* Top Job Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-gray-800 gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 inline-flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" />
                  {matchAnalysis.company || "Target Company"}
                </span>
                {tailoredResume && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Resume Generated ({activeTemplate.name.split(" ")[0]})
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {matchAnalysis.jobTitle || "Job Analysis & Match"}
              </h1>
            </div>
            <button
              onClick={() => {
                setMatchAnalysis(null);
                setTailoredResume(null);
                setJobDescription("");
                setCurrentJobId(null);
                setCurrentMatchResultId(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-sm font-medium text-gray-300 transition shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Analyze Another Job</span>
            </button>
          </div>

          {/* ── CALL TO ACTION BANNER: GENERATE RESUME ─────────────── */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-gray-900 border border-indigo-800/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Step 2: Resume Engineering
              </span>
              <h3 className="text-base font-bold text-white">
                {tailoredResume ? "Resume Tailored & Ready!" : "Ready to Generate Your Tailored Resume?"}
              </h3>
              <p className="text-xs text-gray-300 max-w-xl">
                {tailoredResume
                  ? `Resume engineered using the ${activeTemplate.name} template with all verified profile details and JD keywords.`
                  : "Pick from built-in ATS templates or your custom LaTeX template to tailor a high-impact resume incorporating this job's keywords."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTemplateModal(true)}
              disabled={generatingResume}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition shrink-0 cursor-pointer disabled:opacity-50"
            >
              {generatingResume ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Engineering Resume...</span>
                </>
              ) : tailoredResume ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Change Template & Regenerate</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Select Template & Generate Resume</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>

          {/* ── RESULT TABS ─────────────────────────────────────────── */}
          <div className="flex gap-1 bg-gray-900/60 border border-gray-800 rounded-xl p-1 overflow-x-auto">
            {(["overview", "skills", "education", "roadmap", ...(tailoredResume ? ["resume"] : [])] as const).map((tab) => {
              const labels: Record<string, string> = {
                overview:  "Overview",
                skills:    "Skills Match",
                education: "Education & Experience",
                roadmap:   "Learning Roadmap",
                resume:    "Generated Resume",
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveResultTab(tab as any)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeResultTab === tab
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB: OVERVIEW — Score Ring + Category Breakdown             */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeResultTab === "overview" && (
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 flex flex-col md:flex-row items-center gap-8">
                <div className="relative shrink-0">
                  <ScoreRing score={matchAnalysis.matchScore} size={130} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-black ${
                      matchAnalysis.matchScore >= 75 ? "text-emerald-400" :
                      matchAnalysis.matchScore >= 50 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {matchAnalysis.matchScore}%
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      Match
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Compatibility Score Breakdown
                  </p>
                  <CategoryBar label="Technical Skills" score={matchAnalysis.scoreBreakdown?.technical ?? 0} icon={Code2} color="emerald" />
                  <CategoryBar label="Work Experience" score={matchAnalysis.scoreBreakdown?.experience ?? 0} icon={Briefcase} color="blue" />
                  <CategoryBar label="Education" score={matchAnalysis.scoreBreakdown?.education ?? 0} icon={GraduationCap} color="purple" />
                  <CategoryBar label="Relevant Projects" score={matchAnalysis.scoreBreakdown?.projects ?? 0} icon={FolderOpen} color="amber" />
                </div>
              </div>

              {/* Score Explanation */}
              <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 flex items-start gap-3">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300 leading-relaxed">{matchAnalysis.scoreExplanation}</p>
              </div>

              {/* Quick Counts Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Skills Matched", val: matchAnalysis.matchedSkills.length, color: "emerald" },
                  { label: "Skills Missing", val: matchAnalysis.missingSkills.length, color: "red" },
                  { label: "Partial Matches", val: (matchAnalysis.partialMatches || []).length, color: "amber" },
                  { label: "Relevant Projects", val: (matchAnalysis.relevantProjects || []).length, color: "blue" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-center">
                    <div className={`text-2xl font-black mb-1 ${
                      color === "emerald" ? "text-emerald-400" :
                      color === "red"     ? "text-red-400"     :
                      color === "amber"   ? "text-amber-400"   : "text-blue-400"
                    }`}>{val}</div>
                    <div className="text-[11px] text-gray-400 font-medium">{label}</div>
                  </div>
                ))}
              </div>

              {/* Relevant Projects Evidence */}
              {matchAnalysis.relevantProjects && matchAnalysis.relevantProjects.length > 0 && (
                <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                    Your Projects That Support This Application
                  </h3>
                  <div className="space-y-2">
                    {matchAnalysis.relevantProjects.map((p) => (
                      <div key={p.name} className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
                        <span className="text-sm font-semibold text-white">{p.name}</span>
                        <p className="text-xs text-gray-400 mt-0.5">{p.relevance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB: SKILLS                                                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeResultTab === "skills" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Matched Technical Skills ({matchAnalysis.matchedSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchAnalysis.matchedSkills.length > 0 ? matchAnalysis.matchedSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
                        ✓ {s}
                      </span>
                    )) : (
                      <span className="text-xs text-gray-400">No direct matches found.</span>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Technical Skills ({matchAnalysis.missingSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchAnalysis.missingSkills.length > 0 ? matchAnalysis.missingSkills.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-medium">
                        ✗ {s}
                      </span>
                    )) : (
                      <span className="text-xs text-emerald-400">You have all required technical skills!</span>
                    )}
                  </div>
                </div>
              </div>

              {matchAnalysis.partialMatches && matchAnalysis.partialMatches.length > 0 && (
                <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    Partial Matches ({matchAnalysis.partialMatches.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchAnalysis.partialMatches.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-medium">
                        ◑ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-900/40 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    Soft Skills Matched ({(matchAnalysis.softSkillsMatched || []).length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(matchAnalysis.softSkillsMatched || []).length > 0 ? (matchAnalysis.softSkillsMatched || []).map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-medium">
                        ✓ {s}
                      </span>
                    )) : (
                      <span className="text-xs text-gray-400">Add soft skills to your profile.</span>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    Soft Skills Required ({(matchAnalysis.softSkillsMissing || []).length} not matched)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(matchAnalysis.softSkillsMissing || []).length > 0 ? (matchAnalysis.softSkillsMissing || []).map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-gray-950 border border-gray-800 text-gray-400 text-xs">
                        {s}
                      </span>
                    )) : (
                      <span className="text-xs text-emerald-400">All soft skills matched!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB: EDUCATION & EXPERIENCE                                 */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeResultTab === "education" && (
            <div className="space-y-5">
              <div className={`p-6 rounded-2xl border space-y-4 ${
                matchAnalysis.educationMatch?.matched
                  ? "bg-emerald-950/20 border-emerald-900/40"
                  : "bg-amber-950/20 border-amber-900/40"
              }`}>
                <div className="flex items-center gap-2">
                  <GraduationCap className={`w-5 h-5 ${matchAnalysis.educationMatch?.matched ? "text-emerald-400" : "text-amber-400"}`} />
                  <h3 className="font-bold text-white text-base">Education Match</h3>
                  <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    matchAnalysis.educationMatch?.matched
                      ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-400"
                      : "bg-amber-950/60 border-amber-800/60 text-amber-400"
                  }`}>
                    {matchAnalysis.educationMatch?.matched ? "✓ Satisfied" : "⚠ Partial"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Job Requires</p>
                    <p className="text-sm text-white font-medium">{matchAnalysis.educationMatch?.required || "Not specified"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Your Qualification</p>
                    <p className="text-sm text-white font-medium">{matchAnalysis.educationMatch?.candidate || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-300">
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{matchAnalysis.educationMatch?.note}</span>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border space-y-4 ${
                matchAnalysis.experienceMatch?.sufficient
                  ? "bg-emerald-950/20 border-emerald-900/40"
                  : "bg-red-950/20 border-red-900/40"
              }`}>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-5 h-5 ${matchAnalysis.experienceMatch?.sufficient ? "text-emerald-400" : "text-red-400"}`} />
                  <h3 className="font-bold text-white text-base">Experience Match</h3>
                  <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    matchAnalysis.experienceMatch?.sufficient
                      ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-400"
                      : "bg-red-950/60 border-red-800/60 text-red-400"
                  }`}>
                    {matchAnalysis.experienceMatch?.sufficient ? "✓ Sufficient" : "✗ Below Requirement"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Job Requires</p>
                    <p className="text-sm text-white font-medium">{matchAnalysis.experienceMatch?.required || "Not specified"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Your Experience</p>
                    <p className="text-sm text-white font-medium">{matchAnalysis.experienceMatch?.candidate || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-300">
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>{matchAnalysis.experienceMatch?.note}</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB: LEARNING ROADMAP                                       */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeResultTab === "roadmap" && (
            <div className="space-y-4">
              {matchAnalysis.roadmap && matchAnalysis.roadmap.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-400 p-4 rounded-xl bg-purple-950/20 border border-purple-900/40">
                    <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      {matchAnalysis.roadmap.length} skills to close the gap. Prioritized by importance to this role.
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchAnalysis.roadmap.map((item, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{item.skillName}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              item.priority === "HIGH"
                                ? "bg-red-950/80 text-red-300 border border-red-800/60"
                                : item.priority === "MEDIUM"
                                ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                                : "bg-blue-950/80 text-blue-300 border border-blue-800/60"
                            }`}>
                              {item.priority}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              ~{item.estimatedHours}h
                            </span>
                          </div>
                        </div>
                        <ul className="space-y-1.5">
                          {item.recommendations.map((rec, rIdx) => (
                            <li key={rIdx} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                        {item.practicalProject && (
                          <div className="p-3 rounded-lg bg-gray-950/90 border border-gray-800 text-xs">
                            <span className="font-semibold text-indigo-300 block mb-1">🛠️ Build to prove it:</span>
                            <span className="text-gray-300">{item.practicalProject}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-emerald-400">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-semibold">No skill gaps found!</p>
                  <p className="text-sm text-gray-400 mt-1">You already have all the skills this job requires.</p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* TAB: GENERATED RESUME (WITH COMPLETE PROFILE DETAILS)       */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {activeResultTab === "resume" && tailoredResume && (
            <div className="space-y-5">
              {/* Template Info & Action Bar */}
              <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <LayoutTemplate className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{activeTemplate.name}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">
                        {activeTemplate.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">Engineered with JD keywords & complete verified profile data</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTemplateModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5 transition self-start md:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch Template</span>
                </button>
              </div>

              {/* Action Buttons: Overleaf + Print PDF + .tex + Copy */}
              <div className="flex flex-wrap items-center gap-2">
                <form action="https://www.overleaf.com/docs" method="POST" target="_blank">
                  <input type="hidden" name="snip" value={tailoredResume.latexSource} />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Overleaf</span>
                  </button>
                </form>

                <button
                  type="button"
                  onClick={handlePrintResume}
                  className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download / Print PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadLatex}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  <span>Download .tex</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLatex}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  {copied ? (
                    <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied!</span></>
                  ) : (
                    <><Copy className="w-3.5 h-3.5 text-gray-400" /><span>Copy LaTeX</span></>
                  )}
                </button>
              </div>

              {/* Printable & Screen Resume Preview */}
              <div
                id="careerforge-resume-document"
                className="p-8 rounded-2xl bg-gray-950 border border-gray-800 space-y-6 text-gray-200 shadow-2xl print:bg-white print:text-black print:p-0 print:border-0"
              >
                {/* 1. Complete Contact Header */}
                <div className="border-b border-gray-800 print:border-black pb-4 text-center sm:text-left">
                  <h2 className="text-2xl font-black text-white print:text-black">
                    {tailoredResume.contact?.name || tailoredResume.title}
                  </h2>
                  <p className="text-xs text-indigo-400 print:text-gray-700 font-bold mt-0.5 uppercase tracking-wider">
                    {tailoredResume.targetRole}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 print:text-gray-700 mt-2">
                    {tailoredResume.contact?.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-500" />
                        {tailoredResume.contact.email}
                      </span>
                    )}
                    {tailoredResume.contact?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-500" />
                        {tailoredResume.contact.phone}
                      </span>
                    )}
                    {tailoredResume.contact?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        {tailoredResume.contact.location}
                      </span>
                    )}
                    {tailoredResume.contact?.linkedin && (
                      <span className="flex items-center gap-1 text-indigo-400 print:text-black">
                        <Linkedin className="w-3 h-3" />
                        {tailoredResume.contact.linkedin}
                      </span>
                    )}
                    {tailoredResume.contact?.github && (
                      <span className="flex items-center gap-1 text-indigo-400 print:text-black">
                        <Github className="w-3 h-3" />
                        {tailoredResume.contact.github}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 print:text-gray-800 mt-3 leading-relaxed">
                    {tailoredResume.summary}
                  </p>
                </div>

                {/* 2. Education Section */}
                {tailoredResume.educations && tailoredResume.educations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-black mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400 print:text-black" />
                      Education
                    </h3>
                    <div className="space-y-2">
                      {tailoredResume.educations.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs">
                          <div>
                            <strong className="text-white print:text-black font-bold block">{edu.institution}</strong>
                            <span className="text-gray-300 print:text-gray-800">{edu.degree}</span>
                            {edu.gpa && (
                              <span className="ml-2 text-indigo-400 print:text-black font-semibold">• GPA: {edu.gpa}</span>
                            )}
                          </div>
                          {edu.dates && <span className="text-gray-400 print:text-gray-600 font-mono text-[11px]">{edu.dates}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Technical Skills */}
                {tailoredResume.skills && tailoredResume.skills.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-black mb-2 flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-indigo-400 print:text-black" />
                      Technical Skills (Keyword-Optimized)
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {tailoredResume.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-gray-900 print:bg-gray-100 print:text-black border border-gray-800 print:border-gray-300 text-xs text-gray-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Work Experience */}
                {tailoredResume.experiences && tailoredResume.experiences.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-black mb-3 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400 print:text-black" />
                      Work Experience
                    </h3>
                    <div className="space-y-4">
                      {tailoredResume.experiences.map((exp, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center text-xs flex-wrap">
                            <div className="flex items-center gap-2">
                              <strong className="text-white print:text-black font-bold">{exp.title}</strong>
                              <span className="text-gray-400 print:text-gray-600 font-medium">@ {exp.company}</span>
                              {exp.employmentType && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-900 print:border text-gray-400">
                                  {exp.employmentType}
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400 print:text-gray-600 font-mono text-[11px]">
                              {exp.dates} {exp.location && `• ${exp.location}`}
                            </span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300 print:text-gray-800">
                            {exp.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Projects */}
                {tailoredResume.projects && tailoredResume.projects.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-black mb-3 flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5 text-indigo-400 print:text-black" />
                      Projects
                    </h3>
                    <div className="space-y-4">
                      {tailoredResume.projects.map((proj, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <strong className="text-white print:text-black font-bold">{proj.name}</strong>
                            <span className="text-gray-400 print:text-gray-600 text-[11px] font-mono">
                              {proj.technologies?.join(", ")}
                            </span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300 print:text-gray-800">
                            {proj.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Certifications */}
                {tailoredResume.certifications && tailoredResume.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 print:text-black mb-2 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-400 print:text-black" />
                      Certifications & Credentials
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {tailoredResume.certifications.map((c, ci) => (
                        <div key={ci} className="text-xs text-gray-300 print:text-gray-800">
                          <strong className="text-white print:text-black">{c.name}</strong> — {c.issuer} ({c.date})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 3. TEMPLATE SELECTION POPUP MODAL                            */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-3xl my-6 p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-[11px] font-semibold text-indigo-300 mb-1.5">
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  <span>Choose Resume Template</span>
                </div>
                <h2 className="text-xl font-bold text-white">Select Your Resume Template</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  All verified profile details and JD keywords will be engineered into the chosen LaTeX format.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Cards Grid (Built-in + User Custom) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {allAvailableTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                const isCustom = tmpl.id.startsWith("custom-");
                const badgeStyles = {
                  indigo: "bg-indigo-950/80 border-indigo-800/80 text-indigo-300",
                  emerald: "bg-emerald-950/80 border-emerald-800/80 text-emerald-300",
                  purple: "bg-purple-950/80 border-purple-800/80 text-purple-300",
                  amber: "bg-amber-950/80 border-amber-800/80 text-amber-300",
                }[tmpl.badgeColor];

                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-600/10 ring-2 ring-indigo-500/50"
                        : "bg-gray-950/60 border-gray-800/80 hover:border-gray-700 hover:bg-gray-950"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badgeStyles}`}>
                            {tmpl.badge}
                          </span>
                          {isCustom && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-semibold">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "border-gray-700 bg-gray-900"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-sm mb-0.5">{tmpl.name}</h4>
                      <p className="text-[11px] text-gray-400 mb-2 leading-relaxed">{tmpl.description}</p>

                      <div className="space-y-1 mb-2">
                        {tmpl.features.slice(0, 2).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-800/60 text-[10px] text-gray-500">
                      Ideal for: <span className="text-gray-400">{tmpl.recommendedFor.split(",").slice(0, 3).join(", ")}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleExecuteResumeGeneration(selectedTemplateId)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Resume with {getTemplateById(selectedTemplateId, customTemplates).name.split(" ")[0]}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Clean Print / Download PDF */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          aside, header, nav, button, form, .no-print {
            display: none !important;
          }
          #careerforge-resume-document {
            background: white !important;
            color: black !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getUserResumeHistory } from "@/server/actions/history";
import {
  History,
  FileText,
  ExternalLink,
  Download,
  Calendar,
  Sparkles,
  Loader2,
  Briefcase,
  X,
  Eye,
  Code2,
  Copy,
  Check,
  GraduationCap,
  FolderOpen,
  Award,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  LayoutTemplate,
  TrendingUp,
  Printer,
} from "lucide-react";

export default function ResumeHistoryPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingResume, setViewingResume] = useState<any | null>(null);
  const [previewMode, setPreviewMode] = useState<"visual" | "latex">("visual");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getUserResumeHistory();
      setResumes(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleDownloadLatex = (resume: any) => {
    if (!resume?.latexSource) return;
    const blob = new Blob([resume.latexSource], { type: "text/x-tex;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(resume.targetRole || "Resume").replace(/\s+/g, "_")}_Resume.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-400 bg-emerald-950/60 border-emerald-800/60";
    if (score >= 50) return "text-amber-400 bg-amber-950/60 border-amber-800/60";
    return "text-red-400 bg-red-950/60 border-red-800/60";
  };

  const parseContent = (r: any) => {
    try {
      return typeof r.contentJson === "string" ? JSON.parse(r.contentJson) : r.contentJson;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
        <span>Loading generated resumes...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Resume History</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {resumes.length} resume{resumes.length !== 1 ? "s" : ""} generated — preview, download or reopen in Overleaf
          </p>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800">
          <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No resumes generated yet</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Paste a job description on the Job Analysis page to generate your first tailored resume.
          </p>
          <a
            href="/dashboard"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
          >
            <Sparkles className="w-4 h-4" />
            Generate Your First Resume
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => {
            const c = parseContent(r);
            const score = r.matchResult?.overallScore;
            return (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 transition group"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left: metadata */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-base">{r.targetRole}</span>
                      {score !== undefined && score !== null && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${scoreColor(score)}`}>
                          <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
                          {score}% JD Match
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      {r.job?.company && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                          {r.job.company}
                        </span>
                      )}
                      {r.templateName && (
                        <span className="flex items-center gap-1">
                          <LayoutTemplate className="w-3.5 h-3.5 text-gray-500" />
                          {r.templateName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Skills preview chips */}
                    {c?.skills && c.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(c.skills as string[]).slice(0, 7).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-gray-950 border border-gray-800 text-[10px] text-gray-400">
                            {s}
                          </span>
                        ))}
                        {c.skills.length > 7 && (
                          <span className="text-[10px] text-gray-500 self-center">+{c.skills.length - 7} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => { setViewingResume(r); setPreviewMode("visual"); }}
                      className="px-3 py-2 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 hover:text-white hover:bg-indigo-900/60 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>

                    {r.latexSource && (
                      <form action="https://www.overleaf.com/docs" method="POST" target="_blank" className="inline-block">
                        <input type="hidden" name="snip" value={r.latexSource} />
                        <button
                          type="submit"
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Overleaf
                        </button>
                      </form>
                    )}

                    <button
                      onClick={() => handleDownloadLatex(r)}
                      className="px-3 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      .tex
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PREVIEW MODAL                                             */}
      {/* ══════════════════════════════════════════════════════════ */}
      {viewingResume && (() => {
        const c = parseContent(viewingResume);
        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-3xl my-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden">

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/60">
                <div>
                  <p className="text-sm font-bold text-white">{viewingResume.targetRole}</p>
                  <p className="text-xs text-gray-400">
                    {viewingResume.job?.company && `${viewingResume.job.company} · `}
                    {new Date(viewingResume.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    {viewingResume.matchResult?.overallScore != null && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${scoreColor(viewingResume.matchResult.overallScore)}`}>
                        {viewingResume.matchResult.overallScore}% Match
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
                    <button
                      onClick={() => setPreviewMode("visual")}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${previewMode === "visual" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      Visual
                    </button>
                    <button
                      onClick={() => setPreviewMode("latex")}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${previewMode === "latex" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      LaTeX
                    </button>
                  </div>
                  <button
                    onClick={() => setViewingResume(null)}
                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-800 bg-gray-950/40 flex-wrap">
                {viewingResume.latexSource && (
                  <form action="https://www.overleaf.com/docs" method="POST" target="_blank">
                    <input type="hidden" name="snip" value={viewingResume.latexSource} />
                    <button type="submit" className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open in Overleaf
                    </button>
                  </form>
                )}
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </button>
                <button
                  onClick={() => handleDownloadLatex(viewingResume)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-gray-400" />
                  .tex
                </button>
                {viewingResume.latexSource && (
                  <button
                    onClick={() => handleCopy(viewingResume.latexSource)}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    {copied ? "Copied!" : "Copy LaTeX"}
                  </button>
                )}
              </div>

              {/* Resume content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {previewMode === "latex" ? (
                  <pre className="text-xs text-emerald-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
                    {viewingResume.latexSource || "No LaTeX source saved for this resume."}
                  </pre>
                ) : c ? (
                  <div className="space-y-5 text-gray-200">
                    {/* Contact Header */}
                    <div className="border-b border-gray-800 pb-4 text-center sm:text-left">
                      <h2 className="text-2xl font-black text-white">{c.contact?.name || viewingResume.targetRole}</h2>
                      <p className="text-xs text-indigo-400 font-bold mt-0.5 uppercase tracking-wider">{c.targetRole || viewingResume.targetRole}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-2">
                        {c.contact?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-gray-500" />{c.contact.email}</span>}
                        {c.contact?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-gray-500" />{c.contact.phone}</span>}
                        {c.contact?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-500" />{c.contact.location}</span>}
                        {c.contact?.linkedin && <span className="flex items-center gap-1 text-indigo-400"><Linkedin className="w-3 h-3" />{c.contact.linkedin}</span>}
                        {c.contact?.github && <span className="flex items-center gap-1 text-indigo-400"><Github className="w-3 h-3" />{c.contact.github}</span>}
                      </div>
                      {c.summary && <p className="text-xs text-gray-300 mt-3 leading-relaxed">{c.summary}</p>}
                    </div>

                    {/* Education */}
                    {c.educations?.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />Education
                        </h3>
                        <div className="space-y-1.5">
                          {c.educations.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between items-start text-xs">
                              <div>
                                <strong className="text-white">{edu.institution}</strong>
                                <span className="text-gray-300 ml-2">{edu.degree}</span>
                                {edu.gpa && <span className="text-indigo-400 ml-2">• GPA: {edu.gpa}</span>}
                              </div>
                              {edu.dates && <span className="text-gray-400 font-mono text-[11px]">{edu.dates}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {c.certifications?.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-400" />Certifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {c.certifications.map((cert: any, i: number) => (
                            <div key={i} className="text-xs text-gray-300 p-2 rounded-lg bg-gray-800 border border-gray-700">
                              <strong className="text-white block">{cert.name}</strong>
                              <span className="text-[11px] text-gray-400">{cert.issuer} {cert.date && `(${cert.date})`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {c.skills?.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-indigo-400" />Technical Skills
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {(c.skills as string[]).map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-xs text-gray-300">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experiences */}
                    {c.experiences?.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />Work Experience
                        </h3>
                        <div className="space-y-3">
                          {c.experiences.map((exp: any, i: number) => (
                            <div key={i}>
                              <div className="flex justify-between items-center text-xs flex-wrap">
                                <div className="flex items-center gap-1.5">
                                  <strong className="text-white">{exp.title}</strong>
                                  <span className="text-gray-400">@ {exp.company}</span>
                                </div>
                                <span className="text-gray-400 font-mono text-[11px]">{exp.dates}</span>
                              </div>
                              <ul className="list-disc pl-4 space-y-0.5 text-xs text-gray-300 mt-1">
                                {exp.bullets?.map((b: string, bi: number) => <li key={bi}>{b}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {c.projects?.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />Projects
                        </h3>
                        <div className="space-y-3">
                          {c.projects.map((proj: any, i: number) => (
                            <div key={i}>
                              <div className="flex justify-between items-center text-xs flex-wrap">
                                <strong className="text-white">{proj.name}</strong>
                                <span className="text-gray-400 text-[11px]">{proj.technologies?.join(", ")}</span>
                              </div>
                              <ul className="list-disc pl-4 space-y-0.5 text-xs text-gray-300 mt-1">
                                {proj.bullets?.map((b: string, bi: number) => <li key={bi}>{b}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">Resume content could not be parsed.</p>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

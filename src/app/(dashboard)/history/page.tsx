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
} from "lucide-react";

export default function ResumeHistoryPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const blob = new Blob([resume.latexSource], {
      type: "text/x-tex;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resume.targetRole.replace(/\s+/g, "_")}_Resume.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          History of Generated Resumes
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Review, download, or reopen in Overleaf any resume you tailored previously.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800">
          <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No resumes generated yet</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Paste a job description on the home screen to generate your first job-tailored resume.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{r.targetRole}</span>
                  {r.matchResult && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-semibold">
                      {r.matchResult.overallScore}% Match
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                    {r.job?.company || "Custom Job"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {r.latexSource && (
                  <form
                    action="https://www.overleaf.com/docs"
                    method="POST"
                    target="_blank"
                    className="inline-block"
                  >
                    <input type="hidden" name="snip" value={r.latexSource} />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Overleaf</span>
                    </button>
                  </form>
                )}

                <button
                  onClick={() => handleDownloadLatex(r)}
                  className="px-3 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.tex</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


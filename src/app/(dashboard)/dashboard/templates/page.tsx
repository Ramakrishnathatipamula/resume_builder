"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RESUME_TEMPLATES, ResumeTemplate } from "@/lib/templates-data";
import {
  Sparkles,
  Check,
  ArrowRight,
  FileCode,
  ShieldCheck,
  BookOpen,
  Briefcase,
  Layers,
  GraduationCap,
  ExternalLink,
} from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState("jakes-tech");
  const [savedDefault, setSavedDefault] = useState<string>("jakes-tech");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("preferredResumeTemplate");
    if (saved) {
      setSelectedTemplate(saved);
      setSavedDefault(saved);
    }
  }, []);

  const handleSetDefault = (id: string) => {
    localStorage.setItem("preferredResumeTemplate", id);
    setSelectedTemplate(id);
    setSavedDefault(id);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleUseToGenerate = (id: string) => {
    localStorage.setItem("preferredResumeTemplate", id);
    router.push(`/dashboard?template=${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS-Compliant & LaTeX Engineered</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Resume Template Gallery
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">
            Choose your preferred template design. When you generate a resume, CareerForge will automatically structure and format your verified credentials into that specific template's LaTeX code.
          </p>
        </div>

        {justSaved && (
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Default Template Updated!</span>
          </div>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {RESUME_TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          const isDefault = savedDefault === tmpl.id;

          const badgeStyles = {
            indigo: "bg-indigo-950/70 border-indigo-800/70 text-indigo-300",
            emerald: "bg-emerald-950/70 border-emerald-800/70 text-emerald-300",
            purple: "bg-purple-950/70 border-purple-800/70 text-purple-300",
            amber: "bg-amber-950/70 border-amber-800/70 text-amber-300",
          }[tmpl.badgeColor];

          return (
            <div
              key={tmpl.id}
              className={`p-6 rounded-2xl bg-gray-900/70 border transition flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-500 shadow-2xl shadow-indigo-600/10 ring-1 ring-indigo-500/50"
                  : "border-gray-800 hover:border-gray-700"
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badgeStyles}`}>
                    {tmpl.badge}
                  </span>
                  {isDefault && (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Active Default
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{tmpl.name}</h3>
                <p className="text-xs text-indigo-400 font-medium mb-3">{tmpl.subtitle}</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-5">{tmpl.description}</p>

                {/* Best for */}
                <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800/80 mb-5">
                  <span className="text-[11px] font-semibold text-gray-300 block mb-0.5">
                    🎯 Best suited for:
                  </span>
                  <span className="text-xs text-gray-400">{tmpl.recommendedFor}</span>
                </div>

                {/* Feature bullets */}
                <div className="space-y-2 mb-6">
                  {tmpl.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions row */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800/70">
                <button
                  type="button"
                  onClick={() => handleSetDefault(tmpl.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition border ${
                    isDefault
                      ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                      : "bg-gray-950 hover:bg-gray-800 border-gray-800 text-gray-300"
                  }`}
                >
                  {isDefault ? "✓ Active Default" : "Set as Default"}
                </button>

                <button
                  type="button"
                  onClick={() => handleUseToGenerate(tmpl.id)}
                  className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

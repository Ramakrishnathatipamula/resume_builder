"use client";

import { useState } from "react";
import { LayoutTemplate, Check, Sparkles, ExternalLink } from "lucide-react";

const TEMPLATES = [
  {
    id: "modern-ats",
    name: "Modern ATS Minimal",
    category: "Technical / Engineering",
    description: "Single-column high-parseability layout optimized for Applicant Tracking Systems and tech recruiters.",
    features: ["100% ATS-friendly", "Clean tabular-free flow", "Metrics-focused bullet formatting", "Compact vertical rhythm"],
    popular: true,
  },
  {
    id: "executive-classic",
    name: "Executive Classical",
    category: "Senior Leadership / Management",
    description: "Distinguished typography and traditional serif headings for staff, principal, and executive candidates.",
    features: ["Formal serif styling", "Leadership achievement callouts", "Clean margins", "Print & PDF optimized"],
    popular: false,
  },
  {
    id: "latex-academic",
    name: "Academic & Research LaTeX",
    category: "Academic / AI Research / Publications",
    description: "Built for researchers, data scientists, and engineers who prioritize publications, patents, and LaTeX typesetting.",
    features: ["Overleaf native", "BibTeX compatible", "Publication section support", "Standard article class"],
    popular: false,
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern-ats");

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ATS-Compliant & LaTeX Ready</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Resume Templates</h1>
        <p className="text-sm text-gray-400 mt-1">
          Select your preferred layout. Every template adheres strictly to ATS readability guidelines and supports one-click Overleaf export.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              className={`p-6 rounded-2xl bg-gray-900/70 border transition flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-500 shadow-xl shadow-indigo-500/10"
                  : "border-gray-800 hover:border-gray-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                    {tmpl.category}
                  </span>
                  {tmpl.popular && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold">
                      Recommended
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{tmpl.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">{tmpl.description}</p>

                <div className="space-y-2 mb-6">
                  {tmpl.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-gray-950 hover:bg-gray-800 text-gray-300 border border-gray-800"
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Active Template</span>
                  </>
                ) : (
                  <span>Select Template</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RESUME_TEMPLATES,
  ResumeTemplate,
  getStoredCustomTemplates,
  saveCustomTemplate,
  deleteCustomTemplate,
} from "@/lib/templates-data";
import { getProfileData } from "@/server/actions/profile";
import { TemplateVisualPreview } from "@/components/template-visual-preview";
import {
  Sparkles,
  Check,
  ArrowRight,
  FileCode,
  Plus,
  Trash2,
  Code2,
  Info,
  X,
  FileText,
  Eye,
  Maximize2,
} from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const [customTemplates, setCustomTemplates] = useState<ResumeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("jakes-tech");
  const [savedDefault, setSavedDefault] = useState<string>("jakes-tech");
  const [justSaved, setJustSaved] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [previewModalTemplate, setPreviewModalTemplate] = useState<ResumeTemplate | null>(null);

  // Custom Template Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("Custom Engineering");
  const [customSubtitle, setCustomSubtitle] = useState("");
  const [customLatexCode, setCustomLatexCode] = useState("");
  const [modalError, setModalError] = useState("");

  const loadTemplates = async () => {
    const custom = getStoredCustomTemplates();
    setCustomTemplates(custom);

    const saved = localStorage.getItem("preferredResumeTemplate");
    if (saved) {
      setSelectedTemplate(saved);
      setSavedDefault(saved);
    }

    try {
      const profile = await getProfileData();
      if (profile?.photoUrl) {
        setUserPhoto(profile.photoUrl);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadTemplates();
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

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customLatexCode.trim()) {
      setModalError("Please provide both a template name and LaTeX code.");
      return;
    }

    const newTemplate: ResumeTemplate = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      subtitle: customSubtitle.trim() || "User Custom LaTeX Template",
      category: customCategory.trim() || "Custom",
      badge: "User Custom Template",
      badgeColor: "purple",
      description: "Custom user-provided LaTeX template format and layout rules.",
      recommendedFor: "Custom Tailored Applications",
      features: [
        "User-defined LaTeX preamble & macros",
        "Overleaf compatible",
        "Directly selectable in generator modal",
      ],
      latexGuidelines: customLatexCode.trim(),
    };

    saveCustomTemplate(newTemplate);
    loadTemplates();
    setShowAddModal(false);
    setCustomName("");
    setCustomSubtitle("");
    setCustomLatexCode("");
    setModalError("");
  };

  const handleDeleteCustom = (id: string) => {
    if (!confirm("Are you sure you want to delete this custom template?")) return;
    deleteCustomTemplate(id);
    loadTemplates();
  };

  const allTemplates = [...customTemplates, ...RESUME_TEMPLATES];

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
            Choose your preferred template design or paste your own custom LaTeX template below. CareerForge will format your verified credentials into that exact structure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {justSaved && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Default Updated!</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom LaTeX Template</span>
          </button>
        </div>
      </div>

      {/* Codebase Guidance Alert */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Permanent Codebase Templates:</span> Built-in templates are defined in{" "}
          <code className="px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 font-mono text-[11px] text-indigo-300">
            src/lib/templates-data.ts
          </code>
          . You can paste any LaTeX code right here in the UI by clicking <strong>&quot;Add Custom LaTeX Template&quot;</strong>, or edit the source file directly!
        </div>
      </div>

      {/* Templates Grid with Visual Resume Output Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allTemplates.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          const isDefault = savedDefault === tmpl.id;
          const isCustom = tmpl.id.startsWith("custom-");

          const badgeStyles = {
            indigo: "bg-indigo-950/70 border-indigo-800/70 text-indigo-300",
            emerald: "bg-emerald-950/70 border-emerald-800/70 text-emerald-300",
            purple: "bg-purple-950/70 border-purple-800/70 text-purple-300",
            amber: "bg-amber-950/70 border-amber-800/70 text-amber-300",
          }[tmpl.badgeColor];

          return (
            <div
              key={tmpl.id}
              className={`p-5 rounded-2xl bg-gray-900/80 border transition flex flex-col justify-between ${
                isSelected
                  ? "border-indigo-500 shadow-2xl shadow-indigo-600/10 ring-1 ring-indigo-500/50"
                  : "border-gray-800 hover:border-gray-700"
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badgeStyles}`}>
                      {tmpl.badge}
                    </span>
                    {tmpl.hasPhoto && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-950 border border-teal-800 text-teal-300 font-semibold">
                        📷 Photo Frame
                      </span>
                    )}
                    {isCustom && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 font-semibold">
                        Custom User Code
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isDefault && (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Active Default
                      </span>
                    )}
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustom(tmpl.id)}
                        className="text-gray-500 hover:text-red-400 p-1 transition cursor-pointer"
                        title="Delete custom template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-lg font-extrabold text-white">{tmpl.name}</h3>
                  <p className="text-xs text-indigo-400 font-medium line-clamp-1">{tmpl.subtitle}</p>
                </div>

                {/* ── VISUAL RESUME OUTPUT PREVIEW WITH DUMMY CREDENTIALS ── */}
                <div
                  onClick={() => setPreviewModalTemplate(tmpl)}
                  className="relative group rounded-xl overflow-hidden cursor-pointer border border-gray-700/80 bg-gray-950 p-2 shadow-inner hover:border-indigo-500 transition mb-4"
                  title="Click to zoom / view full output"
                >
                  <TemplateVisualPreview
                    templateId={tmpl.id}
                    templateName={tmpl.name}
                    compact
                    userPhotoUrl={userPhoto}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition flex flex-col items-center justify-center gap-2 text-white p-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/50">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold tracking-wide">Click to Enlarge Preview</span>
                    <span className="text-[10px] text-gray-300 text-center">Inspect complete layout, fonts & dummy data</span>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="space-y-2 pt-3 border-t border-gray-800/70">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(tmpl.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition border cursor-pointer ${
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
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewModalTemplate(tmpl)}
                  className="w-full py-1.5 px-3 rounded-xl text-xs text-gray-400 hover:text-white bg-gray-950/60 hover:bg-gray-850 border border-gray-800/60 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View Full Output Preview</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* FULL RESUME OUTPUT PREVIEW MODAL                             */}
      {/* ════════════════════════════════════════════════════════════ */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-3xl my-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl overflow-hidden space-y-4">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{previewModalTemplate.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">
                    {previewModalTemplate.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{previewModalTemplate.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalTemplate(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-850 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Document Canvas */}
            <div className="p-6 max-h-[75vh] overflow-y-auto flex justify-center bg-gray-950/80">
              <div className="w-full max-w-2xl">
                <TemplateVisualPreview
                  templateId={previewModalTemplate.id}
                  templateName={previewModalTemplate.name}
                  compact={false}
                  userPhotoUrl={userPhoto}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-950">
              <button
                type="button"
                onClick={() => handleSetDefault(previewModalTemplate.id)}
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-semibold transition cursor-pointer"
              >
                {savedDefault === previewModalTemplate.id ? "✓ Active Default" : "Set as Default"}
              </button>
              <button
                type="button"
                onClick={() => handleUseToGenerate(previewModalTemplate.id)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ADD CUSTOM LATEX TEMPLATE MODAL                              */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-2xl my-6 p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/80 text-[11px] font-semibold text-purple-300 mb-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Custom Template Importer</span>
                </div>
                <h2 className="text-xl font-bold text-white">Paste Custom LaTeX Template</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Paste the preamble, structure, or formatting macros of any template you like (e.g. from Overleaf, GitHub, or your own files).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveCustom} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Stanford SWE LaTeX Template"
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Category / Role Focus
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Full Stack / SDE"
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Subtitle / Summary (Optional)
                </label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder="e.g. Single column with bold pipe headers and compact spacing"
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-300">
                    LaTeX Template Code / Preamble / Formatting Rules *
                  </label>
                  <span className="text-[10px] text-gray-500">Paste LaTeX structure below</span>
                </div>
                <textarea
                  required
                  rows={10}
                  value={customLatexCode}
                  onChange={(e) => setCustomLatexCode(e.target.value)}
                  placeholder={`\\documentclass[letterpaper,11pt]{article}\n\\usepackage{latexsym}\n\\usepackage[empty]{fullpage}\n\\usepackage{titlesec}\n\\usepackage{hyperref}\n\n% Paste your custom packages, commands, and layout macros here...`}
                  className="w-full p-3 rounded-2xl bg-gray-950 border border-gray-800 text-white font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  Save Custom Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

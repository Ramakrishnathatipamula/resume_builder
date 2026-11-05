"use client";

import { useEffect, useState } from "react";
import {
  getUserRoadmap,
  toggleRoadmapItem,
  deleteRoadmapItem,
  clearCompletedRoadmapItems,
} from "@/server/actions/roadmap";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Trash2,
  Loader2,
  Sparkles,
  TrendingUp,
  Clock,
  Briefcase,
  X,
  AlertTriangle,
  Filter,
  Trophy,
  Zap,
  ArrowRight,
} from "lucide-react";

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; order: number }> = {
  Critical:  { label: "Critical",  color: "text-red-400",    bg: "bg-red-950/40",    border: "border-red-800/60",    order: 1 },
  High:      { label: "High",      color: "text-amber-400",  bg: "bg-amber-950/40",  border: "border-amber-800/60",  order: 2 },
  Medium:    { label: "Medium",    color: "text-blue-400",   bg: "bg-blue-950/40",   border: "border-blue-800/60",   order: 3 },
  Low:       { label: "Low",       color: "text-gray-400",   bg: "bg-gray-800/40",   border: "border-gray-700",      order: 4 },
};

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG["Medium"];
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      {cfg.label}
    </span>
  );
}

export default function LearningRoadmapPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<"All" | "Active" | "Completed">("Active");
  const [clearing, setClearing] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await getUserRoadmap();
    if (res.success) setItems(res.data as any[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (itemId: string, current: boolean) => {
    // Optimistic update
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, isCompleted: !current } : i));
    const res = await toggleRoadmapItem(itemId, !current);
    if (!res.success) {
      setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, isCompleted: current } : i));
      setError("Failed to update item.");
    }
  };

  const handleDelete = async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    const res = await deleteRoadmapItem(itemId);
    if (!res.success) {
      setError("Failed to delete item.");
      await load();
    }
  };

  const handleClearCompleted = async () => {
    setClearing(true);
    await clearCompletedRoadmapItems();
    await load();
    setClearing(false);
  };

  const filtered = items.filter((i) => {
    if (filterPriority === "Active") return !i.isCompleted;
    if (filterPriority === "Completed") return i.isCompleted;
    return true;
  });

  const stats = {
    total: items.length,
    completed: items.filter((i) => i.isCompleted).length,
    critical: items.filter((i) => i.priority === "Critical" && !i.isCompleted).length,
    totalHours: items.reduce((sum, i) => sum + (i.estimatedHours || 0), 0),
    remainingHours: items.filter((i) => !i.isCompleted).reduce((sum, i) => sum + (i.estimatedHours || 0), 0),
  };
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
        <span>Loading roadmap…</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Learning Roadmap</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Skill gaps identified from your job analyses — prioritized and tracked.
            </p>
          </div>
        </div>
        {stats.completed > 0 && (
          <button
            onClick={handleClearCompleted}
            disabled={clearing}
            className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            {clearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Clear Completed ({stats.completed})
          </button>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {items.length === 0 ? (
        /* ── Empty state ── */
        <div className="p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800 border-dashed">
          <BookOpen className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No roadmap items yet</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Analyze a job description on the main dashboard. Skill gaps are automatically added here as your personal learning roadmap.
          </p>
          <a
            href="/dashboard"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
          >
            <Sparkles className="w-4 h-4" />
            Analyze a Job
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <>
          {/* ── Progress card ── */}
          <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">Overall Progress</span>
              </div>
              <span className="text-sm font-black text-white">{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { label: "Total Skills", value: stats.total, icon: BookOpen, color: "text-white" },
                { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-400" },
                { label: "Critical Remaining", value: stats.critical, icon: Zap, color: "text-red-400" },
                { label: "Hours Remaining", value: `${stats.remainingHours}h`, icon: Clock, color: "text-amber-400" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="text-center">
                  <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                  <div className={`text-lg font-black ${color}`}>{value}</div>
                  <div className="text-[11px] text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Filter ── */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500 shrink-0" />
            {(["Active", "All", "Completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterPriority(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filterPriority === f ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {f === "Active" && `Active (${items.filter((i) => !i.isCompleted).length})`}
                {f === "All" && `All (${items.length})`}
                {f === "Completed" && `Completed (${stats.completed})`}
              </button>
            ))}
          </div>

          {/* ── Items list ── */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-gray-900/40 border border-gray-800">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">
                  {filterPriority === "Completed" ? "No completed items yet." : "All items completed! 🎉"}
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition group ${
                    item.isCompleted
                      ? "bg-gray-900/30 border-gray-800/50 opacity-60"
                      : "bg-gray-900/70 border-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggle(item.id, item.isCompleted)}
                      className="mt-0.5 shrink-0 cursor-pointer"
                      title={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 hover:text-indigo-400 transition" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-base ${item.isCompleted ? "line-through text-gray-500" : "text-white"}`}>
                          {item.skillName}
                        </span>
                        <PriorityBadge priority={item.priority} />
                        {item.estimatedHours && (
                          <span className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Clock className="w-3 h-3" />
                            ~{item.estimatedHours}h
                          </span>
                        )}
                      </div>

                      {/* Job source */}
                      {item.job && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Briefcase className="w-3 h-3" />
                          <span>From: {item.job.title} @ {item.job.company}</span>
                        </div>
                      )}

                      {/* Recommendations */}
                      {item.recommendations && item.recommendations.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            Learning Resources
                          </p>
                          <ul className="space-y-1">
                            {item.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                <TrendingUp className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Practical project */}
                      {item.practicalProject && (
                        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200">
                          <span className="font-semibold text-indigo-400 block mb-0.5">💡 Build this:</span>
                          {item.practicalProject}
                        </div>
                      )}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-950/30 transition opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                      title="Remove from roadmap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

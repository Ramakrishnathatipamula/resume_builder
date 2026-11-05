"use client";

import { useEffect, useState } from "react";
import {
  getUserApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getUserResumesForPicker,
} from "@/server/actions/applications";
import { ApplicationStatus } from "@prisma/client";
import {
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  Edit3,
  X,
  CheckCircle2,
  Loader2,
  StickyNote,
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  Archive,
  Star,
  Filter,
} from "lucide-react";

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; border: string; icon: any }
> = {
  WISHLIST: {
    label: "Wishlist",
    color: "text-gray-300",
    bg: "bg-gray-800/60",
    border: "border-gray-700",
    icon: Star,
  },
  APPLIED: {
    label: "Applied",
    color: "text-blue-300",
    bg: "bg-blue-950/60",
    border: "border-blue-800/60",
    icon: FileText,
  },
  INTERVIEWING: {
    label: "Interviewing",
    color: "text-amber-300",
    bg: "bg-amber-950/60",
    border: "border-amber-800/60",
    icon: Clock,
  },
  OFFER: {
    label: "Offer",
    color: "text-emerald-300",
    bg: "bg-emerald-950/60",
    border: "border-emerald-800/60",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-300",
    bg: "bg-red-950/60",
    border: "border-red-800/60",
    icon: X,
  },
  ARCHIVED: {
    label: "Archived",
    color: "text-gray-500",
    bg: "bg-gray-900/40",
    border: "border-gray-800",
    icon: Archive,
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as ApplicationStatus[];

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Status Select ──────────────────────────────────────────────────────────────
function StatusSelect({
  value,
  onChange,
}: {
  value: ApplicationStatus;
  onChange: (s: ApplicationStatus) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ApplicationStatus)}
      className="px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_CONFIG[s].label}
        </option>
      ))}
    </select>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ApplicationTrackerPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter
  const [filterStatus, setFilterStatus] = useState<"ALL" | ApplicationStatus>("ALL");

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newApp, setNewApp] = useState({
    company: "",
    role: "",
    status: "WISHLIST" as ApplicationStatus,
    appliedDate: "",
    resumeId: "",
    notes: "",
    interviewDate: "",
  });

  // Edit modal
  const [editingApp, setEditingApp] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [appsRes, resumesRes] = await Promise.all([
      getUserApplications(),
      getUserResumesForPicker(),
    ]);
    if (appsRes.success) setApps(appsRes.data as any[]);
    if (resumesRes.success) setResumes(resumesRes.data as any[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ── Create ──
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.company.trim() || !newApp.role.trim()) return;
    setAdding(true);
    setError(null);
    const res = await createApplication({
      company: newApp.company,
      role: newApp.role,
      status: newApp.status,
      appliedDate: newApp.appliedDate || undefined,
      resumeId: newApp.resumeId || undefined,
      notes: newApp.notes || undefined,
      interviewDate: newApp.interviewDate || undefined,
    });
    if (res.success) {
      setShowAddForm(false);
      setNewApp({ company: "", role: "", status: "WISHLIST", appliedDate: "", resumeId: "", notes: "", interviewDate: "" });
      await load();
    } else {
      setError(res.error || "Failed to create application.");
    }
    setAdding(false);
  };

  // ── Inline status update ──
  const handleStatusChange = async (appId: string, status: ApplicationStatus) => {
    setApps((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
    await updateApplication(appId, { status });
  };

  // ── Save edit ──
  const handleSaveEdit = async () => {
    if (!editingApp) return;
    setSaving(true);
    const res = await updateApplication(editingApp.id, {
      status: editingApp.status,
      appliedDate: editingApp.appliedDate ? new Date(editingApp.appliedDate).toISOString() : null,
      interviewDate: editingApp.interviewDate ? new Date(editingApp.interviewDate).toISOString() : null,
      notes: editingApp.notes || null,
      resumeId: editingApp.resumeId || null,
    });
    if (res.success) {
      setEditingApp(null);
      await load();
    } else {
      setError(res.error || "Failed to update.");
    }
    setSaving(false);
  };

  // ── Delete ──
  const handleDelete = async (appId: string) => {
    if (!confirm("Delete this application?")) return;
    await deleteApplication(appId);
    await load();
  };

  // ── Filtered & stats ──
  const filtered = filterStatus === "ALL" ? apps : apps.filter((a) => a.status === filterStatus);

  const stats = {
    total: apps.length,
    applied: apps.filter((a) => a.status === "APPLIED").length,
    interviewing: apps.filter((a) => a.status === "INTERVIEWING").length,
    offers: apps.filter((a) => a.status === "OFFER").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
        <span>Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Application Tracker</h1>
            <p className="text-xs text-gray-400 mt-0.5">Track every job application from wishlist to offer.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* ── Stats row ── */}
      {apps.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-white", icon: Briefcase },
            { label: "Applied", value: stats.applied, color: "text-blue-400", icon: FileText },
            { label: "Interviewing", value: stats.interviewing, color: "text-amber-400", icon: Clock },
            { label: "Offers", value: stats.offers, color: "text-emerald-400", icon: CheckCircle2 },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="p-4 rounded-2xl bg-gray-900/70 border border-gray-800 flex items-center gap-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <div className={`text-xl font-black ${color}`}>{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Filter bar ── */}
      {apps.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          {(["ALL", ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterStatus === s
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {s === "ALL" ? `All (${apps.length})` : `${STATUS_CONFIG[s].label} (${apps.filter((a) => a.status === s).length})`}
            </button>
          ))}
        </div>
      )}

      {/* ── Applications list ── */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800 border-dashed">
          <Briefcase className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">
            {apps.length === 0 ? "No applications yet" : "No applications match this filter"}
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {apps.length === 0
              ? "Start tracking your job applications. Add your first one to begin."
              : "Try a different status filter above."}
          </p>
          {apps.length === 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add First Application
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 hover:border-gray-700 transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-base">{app.role}</span>
                    <span className="text-gray-400 text-sm">@ {app.company}</span>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                    {app.appliedDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                    )}
                    {app.interviewDate && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Clock className="w-3 h-3" />
                        Interview: {new Date(app.interviewDate).toLocaleDateString()}
                      </span>
                    )}
                    {app.resume && (
                      <span className="flex items-center gap-1 text-indigo-400">
                        <FileText className="w-3 h-3" />
                        {app.resume.targetRole}
                      </span>
                    )}
                  </div>

                  {app.notes && (
                    <p className="text-xs text-gray-400 flex items-start gap-1.5">
                      <StickyNote className="w-3 h-3 text-gray-500 shrink-0 mt-0.5" />
                      {app.notes}
                    </p>
                  )}
                </div>

                {/* Right: quick status + actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <StatusSelect
                    value={app.status}
                    onChange={(s) => handleStatusChange(app.id, s)}
                  />
                  <button
                    onClick={() =>
                      setEditingApp({
                        ...app,
                        appliedDate: app.appliedDate
                          ? new Date(app.appliedDate).toISOString().split("T")[0]
                          : "",
                        interviewDate: app.interviewDate
                          ? new Date(app.interviewDate).toISOString().split("T")[0]
                          : "",
                        resumeId: app.resume?.id || "",
                      })
                    }
                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-300 hover:bg-indigo-950/40 transition cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ADD APPLICATION MODAL                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-base font-bold text-white">Add Application</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Company *</label>
                  <input
                    required
                    type="text"
                    value={newApp.company}
                    onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                    placeholder="e.g. Google, Infosys"
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Role *</label>
                  <input
                    required
                    type="text"
                    value={newApp.role}
                    onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                    placeholder="e.g. SDE II, ML Engineer"
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</label>
                  <select
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value as ApplicationStatus })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Applied Date</label>
                  <input
                    type="date"
                    value={newApp.appliedDate}
                    onChange={(e) => setNewApp({ ...newApp, appliedDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Interview Date</label>
                  <input
                    type="date"
                    value={newApp.interviewDate}
                    onChange={(e) => setNewApp({ ...newApp, interviewDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Link Resume</label>
                  <select
                    value={newApp.resumeId}
                    onChange={(e) => setNewApp({ ...newApp, resumeId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">None</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.targetRole} ({r.templateName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Notes</label>
                <textarea
                  rows={2}
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  placeholder="Recruiter contact, referral, follow-up details…"
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {adding ? "Adding…" : "Add Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* EDIT APPLICATION MODAL                                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div>
                <h2 className="text-base font-bold text-white">Edit Application</h2>
                <p className="text-xs text-gray-400">{editingApp.role} @ {editingApp.company}</p>
              </div>
              <button
                onClick={() => setEditingApp(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</label>
                  <select
                    value={editingApp.status}
                    onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value as ApplicationStatus })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Applied Date</label>
                  <input
                    type="date"
                    value={editingApp.appliedDate}
                    onChange={(e) => setEditingApp({ ...editingApp, appliedDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Interview Date</label>
                  <input
                    type="date"
                    value={editingApp.interviewDate}
                    onChange={(e) => setEditingApp({ ...editingApp, interviewDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Link Resume</label>
                  <select
                    value={editingApp.resumeId || ""}
                    onChange={(e) => setEditingApp({ ...editingApp, resumeId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">None</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.targetRole} ({r.templateName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Notes</label>
                <textarea
                  rows={3}
                  value={editingApp.notes || ""}
                  onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })}
                  placeholder="Notes, follow-ups, contacts…"
                  className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setEditingApp(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

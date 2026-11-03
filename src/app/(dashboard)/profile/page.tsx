"use client";

import { useEffect, useState } from "react";
import {
  getProfileData,
  updateBasicProfile,
  addSkill,
  removeSkill,
} from "@/server/actions/profile";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkillText, setNewSkillText] = useState("");

  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProfileData();
      if (data) {
        setProfile(data);
        setFullName(data.fullName || "");
        setHeadline(data.headline || "");
        setSummary(data.summary || "");
        setGithubUrl(data.githubUrl || "");
        setLinkedinUrl(data.linkedinUrl || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateBasicProfile({
        fullName,
        headline,
        summary,
        githubUrl,
        linkedinUrl,
        targetRoles: profile?.targetRoles || [],
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    const res = await addSkill(newSkillText.trim());
    if (res.success && res.data) {
      setProfile((prev: any) => ({
        ...prev,
        skills: [...(prev?.skills || []), res.data],
      }));
      setNewSkillText("");
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    await removeSkill(skillId);
    setProfile((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((s: any) => s.id !== skillId),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
        <span>Loading career profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Career Profile</h1>
        <p className="text-sm text-gray-400 mt-1">
          Your canonical career records. Our engine uses these verified credentials to match against jobs without hallucinating.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile changes saved to Neon PostgreSQL!</span>
        </div>
      )}

      {/* Basic Profile Form */}
      <form onSubmit={handleSaveBasic} className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Personal Information</span>
          </h2>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Information</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full-Stack Engineer"
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Professional Summary</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief overview of your experience and impact..."
            className="w-full p-3 rounded-lg bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">GitHub URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-3.5 py-2 rounded-lg bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </form>

      {/* Verified Skills Section */}
      <div className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Verified Technical Skills</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Skills our matcher checks when calculating your job compatibility.
            </p>
          </div>
        </div>

        {/* Add Skill Input */}
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkillText}
            onChange={(e) => setNewSkillText(e.target.value)}
            placeholder="Add a skill (e.g. TypeScript, React, PostgreSQL, Docker)..."
            className="flex-1 px-3.5 py-2 rounded-lg bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </form>

        {/* Skills Tag Cloud */}
        <div className="flex flex-wrap gap-2 pt-2">
          {profile?.skills && profile.skills.length > 0 ? (
            profile.skills.map((s: any) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200"
              >
                <span>{s.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s.id)}
                  className="text-gray-500 hover:text-red-400 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">
              No skills added yet. Add skills to increase your job matching accuracy!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

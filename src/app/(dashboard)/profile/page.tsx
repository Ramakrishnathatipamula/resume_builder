"use client";

import { useEffect, useState } from "react";
import {
  getProfileData,
  updatePersonalInfo,
  addEducation,
  deleteEducation,
  addExperience,
  deleteExperience,
  addProject,
  deleteProject,
  addSkill,
  deleteSkill,
  addCertification,
  deleteCertification,
} from "@/server/actions/profile";
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Code2,
  Award,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

export default function CareerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "education" | "skills" | "projects" | "certifications">("personal");
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Personal form state
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [targetRoles, setTargetRoles] = useState<string[]>([]);

  // Experience modal/form state
  const [showExpModal, setShowExpModal] = useState(false);
  const [expCompany, setExpCompany] = useState("");
  const [expTitle, setExpTitle] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expCurrent, setExpCurrent] = useState(false);
  const [expBullets, setExpBullets] = useState("");
  const [expTech, setExpTech] = useState("");

  // Education form state
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduInst, setEduInst] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");
  const [eduCurrent, setEduCurrent] = useState(false);
  const [eduGpa, setEduGpa] = useState("");

  // Project form state
  const [showProjModal, setShowProjModal] = useState(false);
  const [projName, setProjName] = useState("");
  const [projRole, setProjRole] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projRepo, setProjRepo] = useState("");
  const [projBullets, setProjBullets] = useState("");
  const [projTech, setProjTech] = useState("");

  // Skill form state
  const [skillName, setSkillName] = useState("");
  const [skillCat, setSkillCat] = useState<"TECHNICAL" | "SOFT" | "TOOL" | "LANGUAGE">("TECHNICAL");
  const [skillLevel, setSkillLevel] = useState("Intermediate");

  // Cert form state
  const [showCertModal, setShowCertModal] = useState(false);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certCredId, setCertCredId] = useState("");

  const refreshProfile = async () => {
    const data = await getProfileData();
    if (data) {
      setProfile(data);
      setFullName(data.fullName || "");
      setHeadline(data.headline || "");
      setSummary(data.summary || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setLocation(data.location || "");
      setWebsiteUrl(data.websiteUrl || "");
      setGithubUrl(data.githubUrl || "");
      setLinkedinUrl(data.linkedinUrl || "");
      setTargetRoles(data.targetRoles || []);
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      await refreshProfile();
      setLoading(false);
    }
    load();
  }, []);

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPersonal(true);
    setMessage(null);
    try {
      const res = await updatePersonalInfo({
        fullName,
        headline,
        summary,
        email,
        phone,
        location,
        websiteUrl,
        githubUrl,
        linkedinUrl,
        targetRoles,
      });
      if (res.success) {
        setMessage({ type: "success", text: "Personal information saved successfully!" });
        await refreshProfile();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save profile." });
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleAddTargetRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRoleInput.trim()) return;
    if (!targetRoles.includes(targetRoleInput.trim())) {
      setTargetRoles([...targetRoles, targetRoleInput.trim()]);
    }
    setTargetRoleInput("");
  };

  const handleRemoveTargetRole = (role: string) => {
    setTargetRoles(targetRoles.filter((r) => r !== role));
  };

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExperience({
        company: expCompany,
        title: expTitle,
        location: expLocation || undefined,
        startDate: expStart,
        endDate: expEnd || undefined,
        isCurrent: expCurrent,
        bullets: expBullets.split("\n").filter((b) => b.trim().length > 0),
        technologies: expTech.split(",").map((t) => t.trim()).filter((t) => t.length > 0),
      });
      setShowExpModal(false);
      setExpCompany("");
      setExpTitle("");
      setExpLocation("");
      setExpStart("");
      setExpEnd("");
      setExpBullets("");
      setExpTech("");
      await refreshProfile();
    } catch (err: any) {
      alert(err?.message || "Failed to add experience.");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    await deleteExperience(id);
    await refreshProfile();
  };

  const handleCreateEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEducation({
        institution: eduInst,
        degree: eduDegree,
        fieldOfStudy: eduField,
        startDate: eduStart,
        endDate: eduEnd || undefined,
        isCurrent: eduCurrent,
        gpa: eduGpa || undefined,
      });
      setShowEduModal(false);
      setEduInst("");
      setEduDegree("");
      setEduField("");
      setEduStart("");
      setEduEnd("");
      setEduGpa("");
      await refreshProfile();
    } catch (err: any) {
      alert(err?.message || "Failed to add education.");
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Delete this education record?")) return;
    await deleteEducation(id);
    await refreshProfile();
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProject({
        name: projName,
        role: projRole || undefined,
        description: projDesc,
        demoUrl: projDemo || undefined,
        repoUrl: projRepo || undefined,
        bullets: projBullets.split("\n").filter((b) => b.trim().length > 0),
        technologies: projTech.split(",").map((t) => t.trim()).filter((t) => t.length > 0),
      });
      setShowProjModal(false);
      setProjName("");
      setProjRole("");
      setProjDesc("");
      setProjDemo("");
      setProjRepo("");
      setProjBullets("");
      setProjTech("");
      await refreshProfile();
    } catch (err: any) {
      alert(err?.message || "Failed to add project.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    await refreshProfile();
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    try {
      await addSkill({
        name: skillName,
        category: skillCat,
        level: skillLevel,
      });
      setSkillName("");
      await refreshProfile();
    } catch (err: any) {
      alert(err?.message || "Failed to add skill.");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    await deleteSkill(id);
    await refreshProfile();
  };

  const handleCreateCert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCertification({
        name: certName,
        issuer: certIssuer,
        issueDate: certDate,
        credentialId: certCredId || undefined,
      });
      setShowCertModal(false);
      setCertName("");
      setCertIssuer("");
      setCertDate("");
      setCertCredId("");
      await refreshProfile();
    } catch (err: any) {
      alert(err?.message || "Failed to add certification.");
    }
  };

  const handleDeleteCert = async (id: string) => {
    await deleteCertification(id);
    await refreshProfile();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span>Loading career profile...</span>
      </div>
    );
  }

  const score = profile?.completionScore || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Page Header & Completion Bar */}
      <div className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Career Profile
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Your single source of verified career truth. AI resume tailoring references only these records.
            </p>
          </div>

          {/* Completion Score */}
          <div className="flex items-center gap-4 bg-gray-950/80 px-5 py-3 rounded-2xl border border-gray-800 shrink-0">
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-400">{score}%</span>
              <p className="text-[10px] uppercase font-bold text-gray-400">Profile Complete</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
              : "bg-red-950/60 border-red-800/80 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-3">
        {[
          { key: "personal", label: "Personal & Roles", icon: User },
          { key: "experience", label: `Experience (${profile?.experiences?.length || 0})`, icon: Briefcase },
          { key: "education", label: `Education (${profile?.educations?.length || 0})`, icon: GraduationCap },
          { key: "skills", label: `Skills (${profile?.skills?.length || 0})`, icon: Sparkles },
          { key: "projects", label: `Projects (${profile?.projects?.length || 0})`, icon: Code2 },
          { key: "certifications", label: `Certifications (${profile?.certifications?.length || 0})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-gray-900/60 text-gray-400 hover:text-white hover:bg-gray-850"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PERSONAL & TARGET ROLES                            */}
      {/* ========================================================= */}
      {activeTab === "personal" && (
        <form onSubmit={handleSavePersonal} className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <h2 className="text-base font-bold text-white">Personal Information & Target Roles</h2>
            <button
              type="submit"
              disabled={savingPersonal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
            >
              {savingPersonal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Personal Information</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Professional Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Backend Systems Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Professional Summary</label>
            <textarea
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Concise, impactful summary of your technical specializations and career achievements..."
              className="w-full p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA (or Remote)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Portfolio / Website</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yoursite.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">GitHub Profile</label>
              <div className="relative">
                <Github className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">LinkedIn Profile</label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Target Job Roles */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Target Job Roles</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="Add target role (e.g. Senior Full-Stack Engineer, DevOps Specialist)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTargetRole}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold"
              >
                Add Role
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {targetRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-300"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTargetRole(role)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 2: WORK & INTERNSHIP EXPERIENCES                      */}
      {/* ========================================================= */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Work & Internship History</h2>
            <button
              onClick={() => setShowExpModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>
          </div>

          {/* Experience List */}
          {profile?.experiences && profile.experiences.length > 0 ? (
            <div className="space-y-4">
              {profile.experiences.map((exp: any) => (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-base">{exp.title}</h3>
                      <p className="text-xs text-indigo-400 font-medium">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {new Date(exp.startDate).toLocaleDateString(undefined, { year: "numeric", month: "short" })} -{" "}
                        {exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: "numeric", month: "short" }) : "N/A"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="text-gray-500 hover:text-red-400 p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-300">
                      {exp.bullets.map((b: string, idx: number) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologies.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-[11px] text-gray-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-gray-900/40 border border-gray-800 text-gray-400 text-sm">
              No work experiences added yet. Click &quot;Add Position&quot; to add your career history.
            </div>
          )}

          {/* Add Experience Modal */}
          {showExpModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Add Work Experience</h3>
                <form onSubmit={handleCreateExperience} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Job Title</label>
                    <input
                      type="text"
                      required
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={expLocation}
                      onChange={(e) => setExpLocation(e.target.value)}
                      placeholder="e.g. New York, NY (or Remote)"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={expStart}
                        onChange={(e) => setExpStart(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">End Date</label>
                      <input
                        type="date"
                        disabled={expCurrent}
                        value={expEnd}
                        onChange={(e) => setExpEnd(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm disabled:opacity-40"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="expCurrent"
                      checked={expCurrent}
                      onChange={(e) => setExpCurrent(e.target.checked)}
                      className="rounded bg-gray-950 border-gray-800 text-indigo-600"
                    />
                    <label htmlFor="expCurrent" className="text-xs text-gray-300">
                      I currently work here
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Achievement Bullets (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={expBullets}
                      onChange={(e) => setExpBullets(e.target.value)}
                      placeholder="Led development of high-throughput caching service reducing latency by 40%..."
                      className="w-full p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-white text-xs leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={expTech}
                      onChange={(e) => setExpTech(e.target.value)}
                      placeholder="TypeScript, Next.js, PostgreSQL, Docker"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowExpModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Save Experience
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: EDUCATION                                          */}
      {/* ========================================================= */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Education History</h2>
            <button
              onClick={() => setShowEduModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          {profile?.educations && profile.educations.length > 0 ? (
            <div className="space-y-4">
              {profile.educations.map((edu: any) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{edu.institution}</p>
                    <p className="text-[11px] text-gray-500">
                      {new Date(edu.startDate).getFullYear()} -{" "}
                      {edu.isCurrent ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : "N/A"}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="text-gray-500 hover:text-red-400 p-1 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-gray-900/40 border border-gray-800 text-gray-400 text-sm">
              No education records added yet. Click &quot;Add Education&quot; to get started.
            </div>
          )}

          {/* Education Modal */}
          {showEduModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Add Education</h3>
                <form onSubmit={handleCreateEducation} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Institution / University</label>
                    <input
                      type="text"
                      required
                      value={eduInst}
                      onChange={(e) => setEduInst(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Degree</label>
                      <input
                        type="text"
                        required
                        value={eduDegree}
                        onChange={(e) => setEduDegree(e.target.value)}
                        placeholder="Bachelor of Science"
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Field of Study</label>
                      <input
                        type="text"
                        required
                        value={eduField}
                        onChange={(e) => setEduField(e.target.value)}
                        placeholder="Computer Science"
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Start Date</label>
                      <input
                        type="date"
                        required
                        value={eduStart}
                        onChange={(e) => setEduStart(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">End Date</label>
                      <input
                        type="date"
                        disabled={eduCurrent}
                        value={eduEnd}
                        onChange={(e) => setEduEnd(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm disabled:opacity-40"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="eduCurrent"
                      checked={eduCurrent}
                      onChange={(e) => setEduCurrent(e.target.checked)}
                      className="rounded bg-gray-950 border-gray-800 text-indigo-600"
                    />
                    <label htmlFor="eduCurrent" className="text-xs text-gray-300">
                      Currently studying here
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">GPA / Honors (optional)</label>
                    <input
                      type="text"
                      value={eduGpa}
                      onChange={(e) => setEduGpa(e.target.value)}
                      placeholder="e.g. 3.8 / 4.0"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEduModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Save Education
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SKILLS MATRIX                                      */}
      {/* ========================================================= */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-white">Add Verified Skills</h2>
            <form onSubmit={handleCreateSkill} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="Skill name (e.g. TypeScript, React, Docker, Kubernetes)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={skillCat}
                onChange={(e) => setSkillCat(e.target.value as any)}
                className="px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm"
              >
                <option value="TECHNICAL">Technical Skill</option>
                <option value="TOOL">Tool / Platform</option>
                <option value="LANGUAGE">Language</option>
                <option value="SOFT">Soft Skill</option>
              </select>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </form>
          </div>

          {/* Grouped Skills Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["TECHNICAL", "TOOL", "LANGUAGE", "SOFT"] as const).map((cat) => {
              const catSkills = profile?.skills?.filter((s: any) => s.category === cat) || [];
              const catLabel =
                cat === "TECHNICAL"
                  ? "Technical Skills"
                  : cat === "TOOL"
                  ? "Tools & Infrastructure"
                  : cat === "LANGUAGE"
                  ? "Programming Languages"
                  : "Soft & Leadership Skills";

              return (
                <div key={cat} className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      {catLabel} ({catSkills.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.length > 0 ? (
                      catSkills.map((s: any) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200"
                        >
                          <span>{s.name}</span>
                          <span className="text-[10px] text-gray-500">({s.level})</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSkill(s.id)}
                            className="text-gray-500 hover:text-red-400 ml-1 transition"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No {catLabel.toLowerCase()} added.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: PROJECTS                                           */}
      {/* ========================================================= */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Featured Projects</h2>
            <button
              onClick={() => setShowProjModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          {profile?.projects && profile.projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((proj: any) => (
                <div
                  key={proj.id}
                  className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-white text-base">{proj.name}</h3>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-gray-500 hover:text-red-400 p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {proj.role && <p className="text-xs text-indigo-400 mb-2">{proj.role}</p>}
                    <p className="text-xs text-gray-300 leading-relaxed mb-3">{proj.description}</p>
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400 mb-3">
                        {proj.bullets.map((b: string, idx: number) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {proj.technologies.map((t: string) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-[10px] text-gray-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 text-xs text-indigo-400">
                      {proj.demoUrl && (
                        <a href={proj.demoUrl} target="_blank" rel="noreferrer" className="hover:underline">
                          Live Demo ↗
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
                          Source Code ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-gray-900/40 border border-gray-800 text-gray-400 text-sm">
              No projects added yet. Click &quot;Add Project&quot; to showcase your work.
            </div>
          )}

          {/* Project Modal */}
          {showProjModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Add Project</h3>
                <form onSubmit={handleCreateProject} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Project Name</label>
                    <input
                      type="text"
                      required
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      placeholder="e.g. Distributed Task Queue"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Your Role / Lead (optional)</label>
                    <input
                      type="text"
                      value={projRole}
                      onChange={(e) => setProjRole(e.target.value)}
                      placeholder="e.g. Lead Full-Stack Architect"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      required
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      placeholder="High-level description of what the project does..."
                      className="w-full p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Demo URL</label>
                      <input
                        type="url"
                        value={projDemo}
                        onChange={(e) => setProjDemo(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Repository URL</label>
                      <input
                        type="url"
                        value={projRepo}
                        onChange={(e) => setProjRepo(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Key Highlights / Bullets (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={projBullets}
                      onChange={(e) => setProjBullets(e.target.value)}
                      placeholder="Implemented zero-downtime rolling upgrades...&#10;Integrated Redis for pub/sub messaging..."
                      className="w-full p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-white text-xs leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projTech}
                      onChange={(e) => setProjTech(e.target.value)}
                      placeholder="Next.js, Prisma, PostgreSQL, Redis"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowProjModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Save Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: CERTIFICATIONS                                    */}
      {/* ========================================================= */}
      {activeTab === "certifications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Certifications & Credentials</h2>
            <button
              onClick={() => setShowCertModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          {profile?.certifications && profile.certifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.certifications.map((cert: any) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800 flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base">{cert.name}</h3>
                    <p className="text-xs text-indigo-400 font-medium">{cert.issuer}</p>
                    <p className="text-[11px] text-gray-500">
                      Issued {new Date(cert.issueDate).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                      {cert.credentialId && ` • ID: ${cert.credentialId}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="text-gray-500 hover:text-red-400 p-1 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-gray-900/40 border border-gray-800 text-gray-400 text-sm">
              No certifications added yet. Click &quot;Add Certification&quot; to add professional licenses or certificates.
            </div>
          )}

          {/* Certification Modal */}
          {showCertModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-4 shadow-2xl">
                <h3 className="text-lg font-bold text-white">Add Certification</h3>
                <form onSubmit={handleCreateCert} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Certification Name</label>
                    <input
                      type="text"
                      required
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder="e.g. AWS Certified Solutions Architect"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      required
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Issue Date</label>
                      <input
                        type="date"
                        required
                        value={certDate}
                        onChange={(e) => setCertDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Credential ID (optional)</label>
                      <input
                        type="text"
                        value={certCredId}
                        onChange={(e) => setCertCredId(e.target.value)}
                        placeholder="e.g. AWS-12345"
                        className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCertModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Save Certification
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

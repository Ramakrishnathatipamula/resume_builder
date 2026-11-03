"use client";

import { useEffect, useState } from "react";
import {
  getProfileData,
  updatePersonalInfo,
  addEducation,
  deleteEducation,
} from "@/server/actions/profile";
import { COUNTRY_CODES } from "@/lib/country-codes";
import { EDUCATION_LEVELS, POPULAR_UNIVERSITIES } from "@/lib/education-data";
import {
  User,
  GraduationCap,
  Sparkles,
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
  const [activeTab, setActiveTab] = useState<"personal" | "education">("personal");
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Personal Info State (including Country Code, Phone, DOB, Gender)
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [targetRoles, setTargetRoles] = useState<string[]>([]);

  // 2. Education Form State (with Level, Picklist, Mandatory GPA out of 10)
  const [showEduModal, setShowEduModal] = useState(false);
  const [eduLevel, setEduLevel] = useState("UNDERGRADUATE");
  const [eduInst, setEduInst] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");
  const [eduCurrent, setEduCurrent] = useState(false);
  const [eduGpa, setEduGpa] = useState("");
  const [eduGpaScale, setEduGpaScale] = useState("10"); // 10, 100, 4

  const refreshProfile = async () => {
    const data = await getProfileData();
    if (data) {
      setProfile(data);
      setFullName(data.fullName || "");
      setHeadline(data.headline || "");
      setSummary(data.summary || "");
      setEmail(data.email || "");
      setCountryCode(data.countryCode || "+91");
      setPhone(data.phone || "");
      setDob(data.dob ? new Date(data.dob).toISOString().split("T")[0] : "");
      setGender(data.gender || "");
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
        countryCode,
        phone,
        dob: dob || undefined,
        gender: gender || undefined,
        location,
        websiteUrl,
        githubUrl,
        linkedinUrl,
        targetRoles,
      });
      if (res.success) {
        setMessage({ type: "success", text: "Personal & demographic information saved successfully!" });
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

  // Current selected level details for education
  const currentLevelConfig = EDUCATION_LEVELS.find((l) => l.id === eduLevel) || EDUCATION_LEVELS[0];

  const handleCreateEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduGpa.trim()) {
      alert("GPA / Score is mandatory. Please enter your score (e.g. 8.85 / 10 CGPA or %).");
      return;
    }

    try {
      await addEducation({
        level: eduLevel,
        institution: eduInst,
        degree: eduDegree,
        fieldOfStudy: eduField || eduDegree,
        startDate: eduStart,
        endDate: eduEnd || undefined,
        isCurrent: eduCurrent,
        gpa: eduGpa.trim(),
        gpaScale: eduGpaScale,
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
              Your verified background records. AI resume tailoring references only these genuine credentials.
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

      {/* Tabs Navigation: ONLY Personal & Education */}
      <div className="flex gap-3 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition ${
            activeTab === "personal"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
              : "bg-gray-900/60 text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal, DOB & Contact</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition ${
            activeTab === "education"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold"
              : "bg-gray-900/60 text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Education & Boards ({profile?.educations?.length || 0})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PERSONAL, DOB, GENDER & COUNTRY CODE PHONE        */}
      {/* ========================================================= */}
      {activeTab === "personal" && (
        <form onSubmit={handleSavePersonal} className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-base font-bold text-white">Personal Information & Demographics</h2>
              <p className="text-xs text-gray-400 mt-0.5">Includes full country-code phone selection, DOB, and gender.</p>
            </div>
            <button
              type="submit"
              disabled={savingPersonal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
            >
              {savingPersonal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Information</span>
            </button>
          </div>

          {/* Row 1: Full Name & Headline */}
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
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Row 2: DOB & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-950/50 border border-gray-800/80">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Date of Birth (DOB)</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gender</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Row 3: Email & Country Code Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
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
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Phone Number (Choose Country Code)
              </label>
              <div className="flex gap-2">
                <div className="w-40 shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c, i) => (
                      <option key={`${c.code}-${i}`} value={c.code}>
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Location, Socials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Location / City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Hyderabad, India (or Remote)"
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

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Professional Summary</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Concise overview of your technical background, core competencies, and career goals..."
              className="w-full p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
            />
          </div>

          {/* Target Job Roles */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Target Job Roles</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer, Backend Architect..."
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
      {/* TAB 2: ENHANCED EDUCATION, BOARDS, & MANDATORY GPA/10     */}
      {/* ========================================================= */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Education, Intermediate & Board History</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Supports all tiers: B.Tech/Degrees, Intermediate / 12th (MPC/BiPC), 10th/SSC, and Diplomas with mandatory GPA / 10.
              </p>
            </div>
            <button
              onClick={() => setShowEduModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education / Board</span>
            </button>
          </div>

          {/* Education Records List */}
          {profile?.educations && profile.educations.length > 0 ? (
            <div className="space-y-4">
              {profile.educations.map((edu: any) => (
                <div
                  key={edu.id}
                  className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 flex justify-between items-start"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                        {edu.level || "Degree"}
                      </span>
                      <h3 className="font-bold text-white text-base">
                        {edu.degree}
                      </h3>
                    </div>
                    <p className="text-xs text-indigo-400 font-medium">{edu.institution}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>
                        {new Date(edu.startDate).getFullYear()} -{" "}
                        {edu.isCurrent ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : "N/A"}
                      </span>
                      {edu.gpa && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold">
                          Score / GPA: {edu.gpa} {edu.gpaScale === "10" ? "/ 10 CGPA" : edu.gpaScale === "100" ? "%" : "/ 4.0"}
                        </span>
                      )}
                    </div>
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
              No education records added yet. Click &quot;Add Education / Board&quot; to add your degrees, intermediate, or schooling.
            </div>
          )}

          {/* Enhanced Education Modal */}
          {showEduModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-xl p-6 md:p-8 rounded-2xl bg-gray-900 border border-gray-800 space-y-5 shadow-2xl my-8">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">Add Education / Board Record</h3>
                    <p className="text-xs text-gray-400">Select education tier to adjust fields appropriately.</p>
                  </div>
                  <button
                    onClick={() => setShowEduModal(false)}
                    className="text-gray-400 hover:text-white text-lg font-bold"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateEducation} className="space-y-4">
                  {/* Tier Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                      Education Level / Tier
                    </label>
                    <select
                      value={eduLevel}
                      onChange={(e) => {
                        setEduLevel(e.target.value);
                        setEduDegree("");
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      {EDUCATION_LEVELS.map((lvl) => (
                        <option key={lvl.id} value={lvl.id}>
                          {lvl.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* University / School Picklist */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-gray-300">
                        {currentLevelConfig.institutionLabel}
                      </label>
                      <span className="text-[11px] text-indigo-400">Searchable worldwide picklist</span>
                    </div>
                    <input
                      type="text"
                      required
                      list="universities-list"
                      value={eduInst}
                      onChange={(e) => setEduInst(e.target.value)}
                      placeholder={
                        eduLevel === "INTERMEDIATE"
                          ? "e.g. Narayana Junior College, Sri Chaitanya, DPS..."
                          : eduLevel === "SECONDARY"
                          ? "e.g. Hyderabad Public School, St. Joseph's High School..."
                          : "Type or pick university (e.g. IIT Bombay, Stanford, JNTU)..."
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <datalist id="universities-list">
                      {POPULAR_UNIVERSITIES.map((u, i) => (
                        <option key={i} value={u} />
                      ))}
                    </datalist>
                  </div>

                  {/* Degree / Stream Picklist */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-gray-300">
                        {currentLevelConfig.degreeLabel}
                      </label>
                      <span className="text-[11px] text-gray-400">Pick preset or type custom</span>
                    </div>
                    <input
                      type="text"
                      required
                      list="degrees-list"
                      value={eduDegree}
                      onChange={(e) => setEduDegree(e.target.value)}
                      placeholder={
                        eduLevel === "INTERMEDIATE"
                          ? "e.g. Intermediate - MPC (Maths, Physics, Chemistry)"
                          : eduLevel === "SECONDARY"
                          ? "e.g. Class 10th (SSC / CBSE)"
                          : "e.g. B.Tech - Computer Science & Engineering"
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <datalist id="degrees-list">
                      {currentLevelConfig.suggestedDegrees.map((deg, i) => (
                        <option key={i} value={deg} />
                      ))}
                    </datalist>
                  </div>

                  {/* Mandatory GPA / Percentage Section */}
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <span className="text-red-400">*</span>
                        <span>Mandatory Score / GPA</span>
                      </label>
                      <span className="text-[11px] text-indigo-400 font-semibold">
                        Calculated out of / 10 CGPA or %
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          value={eduGpa}
                          onChange={(e) => setEduGpa(e.target.value)}
                          placeholder="e.g. 8.85 or 85"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                        />
                      </div>
                      <div className="w-36 shrink-0">
                        <select
                          value={eduGpaScale}
                          onChange={(e) => setEduGpaScale(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="10">/ 10 Scale (CGPA)</option>
                          <option value="100">% Percentage</option>
                          <option value="4">/ 4.0 Scale</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Indian universities and boards standardly evaluate out of <strong>/ 10 CGPA</strong> or <strong>100%</strong>.
                    </p>
                  </div>

                  {/* Dates */}
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
                      <label className="block text-xs font-medium text-gray-300 mb-1">Completion / End Date</label>
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
                      id="eduCurrentModal"
                      checked={eduCurrent}
                      onChange={(e) => setEduCurrent(e.target.checked)}
                      className="rounded bg-gray-950 border-gray-800 text-indigo-600"
                    />
                    <label htmlFor="eduCurrentModal" className="text-xs text-gray-300">
                      Currently enrolled / studying here
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setShowEduModal(false)}
                      className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                    >
                      Save Education Record
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

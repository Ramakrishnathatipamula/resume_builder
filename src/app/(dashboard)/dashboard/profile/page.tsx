"use client";

import { useEffect, useState, useRef } from "react";
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
import { COUNTRY_CODES } from "@/lib/country-codes";
import { EDUCATION_LEVELS, POPULAR_UNIVERSITIES } from "@/lib/education-data";
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
  ChevronDown,
  Camera,
  Upload,
  Image as ImageIcon,
  Edit3,
  X,
} from "lucide-react";

export default function CareerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "education" | "skills" | "projects" | "certifications">("personal");
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Personal Info State (including Country Code, Phone, DOB, Gender, Passport Photo)
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // 3. Experience Form State
  const [showExpModal, setShowExpModal] = useState(false);
  const [expCompany, setExpCompany] = useState("");
  const [expTitle, setExpTitle] = useState("");
  const [expEmploymentType, setExpEmploymentType] = useState("Full-Time");
  const [expLocation, setExpLocation] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expCurrent, setExpCurrent] = useState(false);
  const [expBullets, setExpBullets] = useState("");
  const [expTech, setExpTech] = useState("");

  // 4. Project Form State
  const [showProjModal, setShowProjModal] = useState(false);
  const [projName, setProjName] = useState("");
  const [projRole, setProjRole] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projRepo, setProjRepo] = useState("");
  const [projBullets, setProjBullets] = useState("");
  const [projTech, setProjTech] = useState("");

  // 5. Skill Form State
  const [skillName, setSkillName] = useState("");
  const [skillCat, setSkillCat] = useState<"TECHNICAL" | "SOFT" | "TOOL" | "LANGUAGE">("TECHNICAL");
  const [skillLevel, setSkillLevel] = useState("Intermediate");

  // 6. Certification Form State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certCredId, setCertCredId] = useState("");

  const refreshProfile = async () => {
    const data = await getProfileData();
    if (data) {
      setProfile(data);
      setPhotoUrl(data.photoUrl || "");
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
        photoUrl: photoUrl || undefined,
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
        setMessage({ type: "success", text: "Personal details & passport photo saved successfully!" });
        setIsEditingPersonal(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("profilePhotoUpdated", { detail: photoUrl }));
        }
        await refreshProfile();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save profile." });
    } finally {
      setSavingPersonal(false);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setMessage({ type: "error", text: "Photo is larger than 3MB. Please upload a smaller photo." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoUrl(reader.result);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("profilePhotoUpdated", { detail: reader.result }));
        }
        setMessage({ type: "success", text: "Passport photo loaded! Click 'Save Information' below to persist." });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("profilePhotoUpdated", { detail: "" }));
    }
    setMessage({ type: "success", text: "Passport photo removed. Click 'Save Information' to persist changes." });
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
      alert("GPA / Score is mandatory. Please enter your CGPA (e.g. 8.5 / 10) or percentage.");
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

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExperience({
        company: expCompany,
        title: expTitle,
        employmentType: expEmploymentType,
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
      setExpEmploymentType("Full-Time");
      setExpLocation("");
      setExpStart("");
      setExpEnd("");
      setExpCurrent(false);
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
              Your single source of verified career truth. AI resume tailoring references only these credentials.
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
          { key: "personal", label: "Personal", icon: User },
          { key: "education", label: `Education (${profile?.educations?.length || 0})`, icon: GraduationCap },
          { key: "experience", label: `Experience (${profile?.experiences?.length || 0})`, icon: Briefcase },
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
      {/* TAB 1: PERSONAL, DOB, GENDER & COUNTRY CODE PHONE        */}
      {/* ========================================================= */}
      {activeTab === "personal" && (
        <form onSubmit={handleSavePersonal} className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Personal Information</h2>
                {!isEditingPersonal ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800/80 border border-gray-700/80 text-gray-400 font-semibold">
                    Locked / View Mode
                  </span>
                ) : (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 font-semibold animate-pulse">
                    Editing Mode Active
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {isEditingPersonal
                  ? "Make changes below and click 'Save Information' to persist."
                  : "Click 'Edit' to unlock fields and update your personal details or photo."}
              </p>
            </div>

            {/* Action Buttons: Edit, Cancel, Save */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {!isEditingPersonal ? (
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    // Revert changes back to current saved profile
                    if (profile) {
                      setFullName(profile.fullName || "");
                      setHeadline(profile.headline || "");
                      setSummary(profile.summary || "");
                      setEmail(profile.email || "");
                      setCountryCode(profile.countryCode || "+91");
                      setPhone(profile.phone || "");
                      setDob(profile.dob ? new Date(profile.dob).toISOString().split("T")[0] : "");
                      setGender(profile.gender || "");
                      setLocation(profile.location || "");
                      setWebsiteUrl(profile.websiteUrl || "");
                      setGithubUrl(profile.githubUrl || "");
                      setLinkedinUrl(profile.linkedinUrl || "");
                      setTargetRoles(profile.targetRoles || []);
                      setPhotoUrl(profile.photoUrl || "");
                    }
                    setIsEditingPersonal(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}

              <button
                type="submit"
                disabled={!isEditingPersonal || savingPersonal}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  isEditingPersonal
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md shadow-emerald-600/30"
                    : "bg-gray-800/60 border border-gray-700/50 text-gray-500 cursor-not-allowed opacity-60"
                }`}
              >
                {savingPersonal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Information</span>
              </button>
            </div>
          </div>

          {/* ── PASSPORT SIZE PHOTO UPLOAD SECTION ── */}
          <div className="p-5 rounded-2xl bg-gray-950/70 border border-gray-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              disabled={!isEditingPersonal}
              onChange={handlePhotoFileChange}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />

            {/* Passport Photo Frame (3.5 : 4.5 Ratio) */}
            <div className="shrink-0 flex flex-col items-center">
              <div
                onClick={() => {
                  if (isEditingPersonal) {
                    fileInputRef.current?.click();
                  }
                }}
                className={`w-32 h-40 rounded-xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center relative shadow-lg transition-all duration-200 ${
                  isEditingPersonal
                    ? "border-indigo-500/80 hover:border-indigo-400 bg-gray-900 cursor-pointer group hover:scale-[1.02]"
                    : "border-gray-800 bg-gray-950/60 cursor-not-allowed"
                }`}
                style={{ aspectRatio: "3.5 / 4.5" }}
                title={isEditingPersonal ? "Click to select passport photo" : "Click 'Edit' above to unlock photo changes"}
              >
                {photoUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt="Passport Photo Preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Overlay with Fingerpoint (only in edit mode) */}
                    {isEditingPersonal && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white p-2 text-center">
                        <Camera className="w-6 h-6 text-indigo-300" />
                        <span className="text-[10px] font-bold bg-indigo-600 px-2 py-0.5 rounded-full shadow">
                          Change Photo
                        </span>
                        <span className="text-[8px] text-gray-300">Click to replace</span>
                      </div>
                    )}

                    {/* Quick Remove Button (only in edit mode) */}
                    {isEditingPersonal && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto();
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-950/90 hover:bg-red-800 border border-red-700/80 text-red-300 hover:text-white transition shadow z-10 cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center p-3 flex flex-col items-center justify-center gap-2 transition">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-indigo-400" />
                    </div>
                    {/* Upload Photo Badge directly inside border lines */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition ${
                      isEditingPersonal
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                        : "bg-gray-800 text-gray-400"
                    }`}>
                      Upload Photo
                    </span>
                    <span className="text-[8px] text-gray-500">
                      {isEditingPersonal ? "Click to choose image" : "Locked (Click Edit)"}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[9px] font-semibold text-gray-500 mt-1.5 uppercase tracking-wider">
                3.5cm × 4.5cm
              </span>
            </div>

            {/* Details beside photo */}
            <div className="flex-1 space-y-1.5 text-center sm:text-left self-center">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-sm font-bold text-white">Passport Size Photograph</h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-semibold">
                  {photoUrl ? "✓ Photo Attached" : "Photo Recommended"}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {isEditingPersonal
                  ? "Click directly on the photo frame to upload or change your photo."
                  : "Photo frame is locked. Click 'Edit' above to modify."}
              </p>
            </div>
          </div>

          {/* Row 1: Full Name & Headline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                disabled={!isEditingPersonal}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Professional Headline</label>
              <input
                type="text"
                disabled={!isEditingPersonal}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
              />
            </div>
          </div>

          {/* Row 2: DOB & Gender (USER REQUEST #2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-950/50 border border-gray-800/80">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Date of Birth (DOB)</span>
              </label>
              <input
                type="date"
                disabled={!isEditingPersonal}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gender</span>
              </label>
              <select
                disabled={!isEditingPersonal}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
              >
                <option value="">Select Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Row 3: Email & Country Code Phone Selector (USER REQUEST #1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled={!isEditingPersonal}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Phone Number (Choose Country Code)
              </label>
              <div className="flex gap-2">
                {/* Country Code Picklist */}
                <div className="w-40 shrink-0">
                  <select
                    disabled={!isEditingPersonal}
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
                  >
                    {COUNTRY_CODES.map((c, i) => (
                      <option key={`${c.code}-${i}`} value={c.code}>
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                </div>
                {/* Phone Input */}
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    disabled={!isEditingPersonal}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Location, Portfolio, Socials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Location / City</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  disabled={!isEditingPersonal}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Hyderabad, India (or Remote)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">GitHub Profile</label>
              <div className="relative">
                <Github className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="url"
                  disabled={!isEditingPersonal}
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">LinkedIn Profile</label>
              <div className="relative">
                <Linkedin className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                <input
                  type="url"
                  disabled={!isEditingPersonal}
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Professional Summary</label>
            <textarea
              rows={3}
              disabled={!isEditingPersonal}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Concise overview of your technical background, core competencies, and career goals..."
              className="w-full p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-950/40"
            />
          </div>

          {/* Target Job Roles */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Target Job Roles</label>
            {isEditingPersonal && (
              <div className="flex gap-2 mb-2 animate-in fade-in">
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
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Add Role
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {targetRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-xs text-indigo-300"
                >
                  <span>{role}</span>
                  {isEditingPersonal && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTargetRole(role)}
                      className="text-gray-400 hover:text-red-400 cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ENHANCED EDUCATION, BOARDS, & MANDATORY GPA/10     */}
      {/* (USER REQUEST #3 & #4)                                    */}
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
              {profile.educations.map((edu: any) => {
                const isIntermediate = edu.level === "INTERMEDIATE" || edu.level === "SECONDARY";
                return (
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
                );
              })}
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

                  {/* University / School Picklist (USER REQUEST #4) */}
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
                          ? "e.g. Narayana Junior College, Chaitanya, DPS..."
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

                  {/* Degree / Stream Picklist (USER REQUEST #3 & #4) */}
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

                  {/* Mandatory GPA / Percentage Section (USER REQUEST #3) */}
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
                          className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* ========================================================= */}
      {/* TAB 3: WORK & INTERNSHIP EXPERIENCES                      */}
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

          {profile?.experiences && profile.experiences.length > 0 ? (
            <div className="space-y-4">
              {profile.experiences.map((exp: any) => (
                <div
                  key={exp.id}
                  className="p-6 rounded-2xl bg-gray-900/70 border border-gray-800 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-bold text-white text-base">{exp.title}</h3>
                        {exp.employmentType && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            exp.employmentType === "Internship"
                              ? "bg-amber-950/60 border-amber-700/50 text-amber-400"
                              : exp.employmentType === "Part-Time"
                              ? "bg-sky-950/60 border-sky-700/50 text-sky-400"
                              : exp.employmentType === "Contract" || exp.employmentType === "Freelance"
                              ? "bg-purple-950/60 border-purple-700/50 text-purple-400"
                              : "bg-emerald-950/60 border-emerald-700/50 text-emerald-400"
                          }`}>
                            {exp.employmentType}
                          </span>
                        )}
                      </div>
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
                    <label className="block text-xs font-medium text-gray-300 mb-1">Employment Type</label>
                    <select
                      value={expEmploymentType}
                      onChange={(e) => setExpEmploymentType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-sm"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="Trainee">Trainee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={expLocation}
                      onChange={(e) => setExpLocation(e.target.value)}
                      placeholder="e.g. Hyderabad, India (or Remote)"
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
                <option value="LANGUAGE">Programming Language</option>
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

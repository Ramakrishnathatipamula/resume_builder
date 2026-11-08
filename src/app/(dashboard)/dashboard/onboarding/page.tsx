"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getProfileData,
  updatePersonalInfo,
  addEducation,
  deleteEducation,
  addExperience,
  deleteExperience,
  addSkill,
  deleteSkill,
  addProject,
  deleteProject,
  addCertification,
  deleteCertification,
  completeOnboarding,
} from "@/server/actions/profile";
import { COUNTRY_CODES } from "@/lib/country-codes";
import { EDUCATION_LEVELS } from "@/lib/education-data";
import {
  User,
  GraduationCap,
  Briefcase,
  Sparkles,
  Code2,
  Award,
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Camera,
  Trash2,
  Plus,
  Calendar,
  Mail,
  Phone,
  MapPin,
  X,
  Rocket,
  SkipForward,
} from "lucide-react";

const STEPS = [
  { key: "personal", label: "Personal Info", icon: User, required: true, skippable: false },
  { key: "education", label: "Education", icon: GraduationCap, required: false, skippable: false },
  { key: "experience", label: "Experience", icon: Briefcase, required: false, skippable: true },
  { key: "skills", label: "Skills", icon: Sparkles, required: true, skippable: false },
  { key: "projects", label: "Projects", icon: Code2, required: false, skippable: true },
  { key: "certifications", label: "Certifications", icon: Award, required: false, skippable: true },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Personal Info State
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Education State
  const [eduLevel, setEduLevel] = useState("UNDERGRADUATE");
  const [eduInst, setEduInst] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduStart, setEduStart] = useState("");
  const [eduEnd, setEduEnd] = useState("");
  const [eduCurrent, setEduCurrent] = useState(false);
  const [eduGpa, setEduGpa] = useState("");
  const [eduGpaScale, setEduGpaScale] = useState("10");

  // Experience State
  const [expCompany, setExpCompany] = useState("");
  const [expTitle, setExpTitle] = useState("");
  const [expEmploymentType, setExpEmploymentType] = useState("Full-Time");
  const [expLocation, setExpLocation] = useState("");
  const [expStart, setExpStart] = useState("");
  const [expEnd, setExpEnd] = useState("");
  const [expCurrent, setExpCurrent] = useState(false);
  const [expBullets, setExpBullets] = useState("");
  const [expTech, setExpTech] = useState("");

  // Skills State
  const [skillName, setSkillName] = useState("");
  const [skillCat, setSkillCat] = useState<"TECHNICAL" | "SOFT" | "TOOL" | "LANGUAGE">("TECHNICAL");
  const [skillLevel, setSkillLevel] = useState("Intermediate");

  // Projects State
  const [projName, setProjName] = useState("");
  const [projRole, setProjRole] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projRepo, setProjRepo] = useState("");
  const [projBullets, setProjBullets] = useState("");
  const [projTech, setProjTech] = useState("");

  // Certifications State
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
      setEmail(data.email || "");
      setCountryCode(data.countryCode || "+91");
      setPhone(data.phone || "");
      setDob(data.dob ? new Date(data.dob).toISOString().split("T")[0] : "");
      setGender(data.gender || "");
      setLocation(data.location || "");
      setPhotoUrl(data.photoUrl || "");
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await refreshProfile();
      setLoading(false);
    }
    init();
  }, []);

  const clearMessage = () => {
    setTimeout(() => setMessage(null), 4000);
  };

  // Photo handler
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setMessage({ type: "error", text: "Photo must be under 3MB." });
      clearMessage();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save personal info
  const handleSavePersonal = async () => {
    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Full Name is required." });
      clearMessage();
      return false;
    }
    setSaving(true);
    try {
      await updatePersonalInfo({
        fullName,
        headline,
        summary: "",
        photoUrl: photoUrl || undefined,
        email,
        countryCode,
        phone,
        dob: dob || undefined,
        gender: gender || undefined,
        location,
        targetRoles: [],
      });
      if (photoUrl && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("profilePhotoUpdated", { detail: photoUrl }));
      }
      await refreshProfile();
      setMessage({ type: "success", text: "Personal info saved!" });
      clearMessage();
      return true;
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to save." });
      clearMessage();
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Add education
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduGpa.trim()) {
      setMessage({ type: "error", text: "GPA / Score is mandatory." });
      clearMessage();
      return;
    }
    setSaving(true);
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
      setEduInst("");
      setEduDegree("");
      setEduField("");
      setEduStart("");
      setEduEnd("");
      setEduCurrent(false);
      setEduGpa("");
      await refreshProfile();
      setMessage({ type: "success", text: "Education added!" });
      clearMessage();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to add education." });
      clearMessage();
    } finally {
      setSaving(false);
    }
  };

  // Add experience
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      setMessage({ type: "success", text: "Experience added!" });
      clearMessage();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to add experience." });
      clearMessage();
    } finally {
      setSaving(false);
    }
  };

  // Add skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setSaving(true);
    try {
      await addSkill({ name: skillName, category: skillCat, level: skillLevel });
      setSkillName("");
      await refreshProfile();
      setMessage({ type: "success", text: "Skill added!" });
      clearMessage();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to add skill." });
      clearMessage();
    } finally {
      setSaving(false);
    }
  };

  // Add project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      setProjName("");
      setProjRole("");
      setProjDesc("");
      setProjDemo("");
      setProjRepo("");
      setProjBullets("");
      setProjTech("");
      await refreshProfile();
      setMessage({ type: "success", text: "Project added!" });
      clearMessage();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to add project." });
      clearMessage();
    } finally {
      setSaving(false);
    }
  };

  // Add certification
  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addCertification({
        name: certName,
        issuer: certIssuer,
        issueDate: certDate,
        credentialId: certCredId || undefined,
      });
      setCertName("");
      setCertIssuer("");
      setCertDate("");
      setCertCredId("");
      await refreshProfile();
      setMessage({ type: "success", text: "Certification added!" });
      clearMessage();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to add certification." });
      clearMessage();
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const handleDeleteEdu = async (id: string) => {
    await deleteEducation(id);
    await refreshProfile();
  };
  const handleDeleteExp = async (id: string) => {
    await deleteExperience(id);
    await refreshProfile();
  };
  const handleDeleteSkill = async (id: string) => {
    await deleteSkill(id);
    await refreshProfile();
  };
  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
    await refreshProfile();
  };
  const handleDeleteCert = async (id: string) => {
    await deleteCertification(id);
    await refreshProfile();
  };

  // Navigation
  const handleNext = async () => {
    if (currentStep === 0) {
      const ok = await handleSavePersonal();
      if (!ok) return;
    }
    if (currentStep === 3 && (!profile?.skills || profile.skills.length === 0)) {
      setMessage({ type: "error", text: "Please add at least 1 skill before continuing." });
      clearMessage();
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setMessage(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setMessage(null);
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await completeOnboarding();
      router.push("/dashboard/profile");
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Failed to complete onboarding." });
      clearMessage();
    } finally {
      setSaving(false);
    }
  };

  const currentLevelConfig = EDUCATION_LEVELS.find((l) => l.id === eduLevel) || EDUCATION_LEVELS[0];

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 transition";
  const selectClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition";
  const labelClass = "block text-xs font-medium text-gray-300 mb-1.5";

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span>Preparing your onboarding...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-2 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
          <Rocket className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Welcome to CareerForge
        </h1>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Let&apos;s set up your career profile. This will take just a few minutes and helps our AI
          build better resumes for you.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/30"
                      : isCurrent
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-500/30 scale-110"
                        : "bg-gray-900 border-gray-700 text-gray-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1.5 transition-colors ${
                    isCurrent ? "text-indigo-300" : isCompleted ? "text-emerald-400" : "text-gray-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-8 md:w-14 h-0.5 mx-1 mb-5 transition-colors ${
                    idx < currentStep ? "bg-emerald-600" : "bg-gray-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`p-3 rounded-xl border text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
              : "bg-red-950/60 border-red-800/80 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <X className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Step Content Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gray-900/70 border border-gray-800 shadow-xl">
        {/* Step Title */}
        <div className="flex items-center gap-3 pb-5 border-b border-gray-800 mb-6">
          {(() => {
            const Icon = STEPS[currentStep].icon;
            return <Icon className="w-5 h-5 text-indigo-400" />;
          })()}
          <div>
            <h2 className="text-lg font-bold text-white">
              Step {currentStep + 1}: {STEPS[currentStep].label}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {currentStep === 0 && "Tell us about yourself — this is required."}
              {currentStep === 1 && "Add your educational background."}
              {currentStep === 2 && "Add your work experience. You can skip this step."}
              {currentStep === 3 && "Add your skills — at least 1 is required."}
              {currentStep === 4 && "Showcase your projects. You can skip this step."}
              {currentStep === 5 && "Add any certifications. You can skip this step."}
            </p>
          </div>
        </div>

        {/* ==================== STEP 1: PERSONAL INFO ==================== */}
        {currentStep === 0 && (
          <div className="space-y-5">
            {/* Photo Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-gray-950/50 border border-gray-800/80">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoFileChange}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-36 rounded-xl border-2 border-dashed border-indigo-500/60 hover:border-indigo-400 bg-gray-900 cursor-pointer overflow-hidden flex items-center justify-center relative group shrink-0 transition-all hover:scale-[1.02]"
              >
                {photoUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl} alt="Photo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                      <Camera className="w-5 h-5 text-indigo-300" />
                      <span className="text-[9px] font-bold text-white mt-1">Change</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-center p-2">
                    <Camera className="w-6 h-6 text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-300">Upload Photo</span>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-white">Profile Photo</p>
                <p className="text-xs text-gray-400">
                  Optional. Upload a passport-size photo (max 3MB).
                </p>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Remove photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Professional Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full-Stack Developer"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> Phone Number
                  </span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-36 shrink-0 px-2.5 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
                  >
                    {COUNTRY_CODES.map((c, i) => (
                      <option key={`${c.code}-${i}`} value={c.code}>
                        {c.flag} {c.code} ({c.name})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className={`flex-1 ${inputClass}`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-950/50 border border-gray-800/80">
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date of Birth
                  </span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Gender
                  </span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select Gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Location / City
                </span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hyderabad, India"
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* ==================== STEP 2: EDUCATION ==================== */}
        {currentStep === 1 && (
          <div className="space-y-5">
            {/* Existing items */}
            {profile?.educations?.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Added Education ({profile.educations.length})
                </p>
                {profile.educations.map((edu: any) => (
                  <div
                    key={edu.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-950/60 border border-gray-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{edu.degree}</p>
                      <p className="text-xs text-gray-400">
                        {edu.institution} • {edu.level} • GPA: {edu.gpa}/{edu.gpaScale}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEdu(edu.id)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add form */}
            <form onSubmit={handleAddEducation} className="space-y-4 p-4 rounded-xl bg-gray-950/40 border border-gray-800/60">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Education
              </p>

              <div>
                <label className={labelClass}>Education Level</label>
                <select
                  value={eduLevel}
                  onChange={(e) => {
                    setEduLevel(e.target.value);
                    setEduDegree("");
                  }}
                  className={selectClass}
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{currentLevelConfig.institutionLabel}</label>
                  <input
                    type="text"
                    required
                    value={eduInst}
                    onChange={(e) => setEduInst(e.target.value)}
                    placeholder="University name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{currentLevelConfig.degreeLabel}</label>
                  <select
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select or type below...</option>
                    {currentLevelConfig.suggestedDegrees.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {!eduDegree && (
                    <input
                      type="text"
                      value={eduDegree}
                      onChange={(e) => setEduDegree(e.target.value)}
                      placeholder="Or type your degree..."
                      className={`mt-2 ${inputClass}`}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className={labelClass}>Field of Study</label>
                <input
                  type="text"
                  value={eduField}
                  onChange={(e) => setEduField(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="date"
                    required
                    value={eduStart}
                    onChange={(e) => setEduStart(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    type="date"
                    value={eduEnd}
                    onChange={(e) => setEduEnd(e.target.value)}
                    disabled={eduCurrent}
                    className={`${inputClass} disabled:opacity-50`}
                  />
                  <label className="flex items-center gap-2 mt-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eduCurrent}
                      onChange={(e) => setEduCurrent(e.target.checked)}
                      className="rounded border-gray-700 bg-gray-900 text-indigo-500 focus:ring-indigo-500"
                    />
                    Currently studying here
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    GPA / Score <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eduGpa}
                    onChange={(e) => setEduGpa(e.target.value)}
                    placeholder="e.g. 8.5"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>GPA Scale</label>
                  <select
                    value={eduGpaScale}
                    onChange={(e) => setEduGpaScale(e.target.value)}
                    className={selectClass}
                  >
                    <option value="10">Out of 10</option>
                    <option value="100">Out of 100 (%)</option>
                    <option value="4">Out of 4.0</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Education
              </button>
            </form>
          </div>
        )}

        {/* ==================== STEP 3: EXPERIENCE ==================== */}
        {currentStep === 2 && (
          <div className="space-y-5">
            {profile?.experiences?.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Added Experience ({profile.experiences.length})
                </p>
                {profile.experiences.map((exp: any) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-950/60 border border-gray-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{exp.title}</p>
                      <p className="text-xs text-gray-400">
                        {exp.company} • {exp.employmentType}
                        {exp.location ? ` • ${exp.location}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExp(exp.id)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddExperience} className="space-y-4 p-4 rounded-xl bg-gray-950/40 border border-gray-800/60">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    type="text"
                    required
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="Company name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input
                    type="text"
                    required
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder="Software Engineer"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Employment Type</label>
                  <select
                    value={expEmploymentType}
                    onChange={(e) => setExpEmploymentType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    placeholder="City or Remote"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input
                    type="date"
                    required
                    value={expStart}
                    onChange={(e) => setExpStart(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    type="date"
                    value={expEnd}
                    onChange={(e) => setExpEnd(e.target.value)}
                    disabled={expCurrent}
                    className={`${inputClass} disabled:opacity-50`}
                  />
                  <label className="flex items-center gap-2 mt-2 text-xs text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expCurrent}
                      onChange={(e) => setExpCurrent(e.target.checked)}
                      className="rounded border-gray-700 bg-gray-900 text-indigo-500 focus:ring-indigo-500"
                    />
                    Currently working here
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>Key Achievements / Bullets (one per line)</label>
                <textarea
                  value={expBullets}
                  onChange={(e) => setExpBullets(e.target.value)}
                  rows={3}
                  placeholder="Built a feature that increased user engagement by 30%&#10;Led a team of 3 engineers"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={expTech}
                  onChange={(e) => setExpTech(e.target.value)}
                  placeholder="React, Node.js, PostgreSQL"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Experience
              </button>
            </form>
          </div>
        )}

        {/* ==================== STEP 4: SKILLS ==================== */}
        {currentStep === 3 && (
          <div className="space-y-5">
            {/* Existing skills */}
            {profile?.skills?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Added Skills ({profile.skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s: any) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm"
                    >
                      <span className="text-white font-medium">{s.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 font-semibold">
                        {s.category}
                      </span>
                      <span className="text-[10px] text-gray-500">{s.level}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(s.id)}
                        className="text-red-400 hover:text-red-300 transition ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inline add form */}
            <form onSubmit={handleAddSkill} className="space-y-4 p-4 rounded-xl bg-gray-950/40 border border-gray-800/60">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>
                    Skill Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    placeholder="e.g. React, Python"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={skillCat}
                    onChange={(e) => setSkillCat(e.target.value as any)}
                    className={selectClass}
                  >
                    <option value="TECHNICAL">Technical</option>
                    <option value="SOFT">Soft Skill</option>
                    <option value="TOOL">Tool / Platform</option>
                    <option value="LANGUAGE">Language</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Proficiency Level</label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className={selectClass}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !skillName.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Skill
              </button>
            </form>

            {(!profile?.skills || profile.skills.length === 0) && (
              <p className="text-xs text-amber-300/80 bg-amber-950/30 border border-amber-800/40 px-4 py-2.5 rounded-lg">
                ⚠ You need at least 1 skill to continue.
              </p>
            )}
          </div>
        )}

        {/* ==================== STEP 5: PROJECTS ==================== */}
        {currentStep === 4 && (
          <div className="space-y-5">
            {profile?.projects?.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Added Projects ({profile.projects.length})
                </p>
                {profile.projects.map((proj: any) => (
                  <div
                    key={proj.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-950/60 border border-gray-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{proj.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{proj.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddProject} className="space-y-4 p-4 rounded-xl bg-gray-950/40 border border-gray-800/60">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Project
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Project Name</label>
                  <input
                    type="text"
                    required
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="My Awesome Project"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Your Role</label>
                  <input
                    type="text"
                    value={projRole}
                    onChange={(e) => setProjRole(e.target.value)}
                    placeholder="Lead Developer"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  required
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  rows={2}
                  placeholder="Brief description of the project..."
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Demo URL</label>
                  <input
                    type="url"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    placeholder="https://myproject.demo.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Repository URL</label>
                  <input
                    type="url"
                    value={projRepo}
                    onChange={(e) => setProjRepo(e.target.value)}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Key Features / Bullets (one per line)</label>
                <textarea
                  value={projBullets}
                  onChange={(e) => setProjBullets(e.target.value)}
                  rows={3}
                  placeholder="Real-time collaboration using WebSockets&#10;JWT-based authentication system"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  placeholder="Next.js, Prisma, Tailwind CSS"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Project
              </button>
            </form>
          </div>
        )}

        {/* ==================== STEP 6: CERTIFICATIONS ==================== */}
        {currentStep === 5 && (
          <div className="space-y-5">
            {profile?.certifications?.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Added Certifications ({profile.certifications.length})
                </p>
                {profile.certifications.map((cert: any) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-950/60 border border-gray-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{cert.name}</p>
                      <p className="text-xs text-gray-400">
                        {cert.issuer}
                        {cert.credentialId ? ` • ID: ${cert.credentialId}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCert(cert.id)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddCert} className="space-y-4 p-4 rounded-xl bg-gray-950/40 border border-gray-800/60">
              <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Certification Name</label>
                  <input
                    type="text"
                    required
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="AWS Solutions Architect"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Issuing Organization</label>
                  <input
                    type="text"
                    required
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="Amazon Web Services"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Issue Date</label>
                  <input
                    type="date"
                    required
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Credential ID (optional)</label>
                  <input
                    type="text"
                    value={certCredId}
                    onChange={(e) => setCertCredId(e.target.value)}
                    placeholder="ABC-123-XYZ"
                    className={inputClass}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Certification
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold flex items-center gap-2 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-3">
          {/* Skip button for skippable steps */}
          {STEPS[currentStep].skippable && currentStep < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => {
                setCurrentStep(currentStep + 1);
                setMessage(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-gray-800/60 hover:bg-gray-700/60 text-gray-400 hover:text-gray-300 text-sm font-medium flex items-center gap-1.5 transition"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/30 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Complete Setup
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

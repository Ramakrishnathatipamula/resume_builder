"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  User,
  Briefcase,
  GitCompare,
  FileText,
  Compass,
  ListTodo,
  Video,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const modules = [
    {
      title: "Career Profile",
      desc: "Maintain your verified education, work history, projects, and skills without AI hallucinations.",
      href: "/dashboard/profile",
      icon: User,
      phase: "Phase 2",
    },
    {
      title: "Job Intelligence",
      desc: "Extract technical requirements, responsibilities, and keywords from job descriptions.",
      href: "/dashboard/jobs",
      icon: Briefcase,
      phase: "Phase 3",
    },
    {
      title: "Skill Match Engine",
      desc: "Calculate transparent compatibility scores and pinpoint missing skill gaps.",
      href: "/dashboard/match",
      icon: GitCompare,
      phase: "Phase 4",
    },
    {
      title: "Resume Builder & Overleaf",
      desc: "Generate ATS-optimized resumes and export directly to Overleaf or PDF.",
      href: "/dashboard/builder",
      icon: FileText,
      phase: "Phase 6 & 7",
    },
    {
      title: "Learning Roadmap",
      desc: "Actionable milestones and resources to bridge identified skill gaps.",
      href: "/dashboard/roadmap",
      icon: Compass,
      phase: "Phase 9",
    },
    {
      title: "Application Tracker",
      desc: "Track job applications, attached resume versions, and interview schedules.",
      href: "/dashboard/tracker",
      icon: ListTodo,
      phase: "Phase 10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Hello, {session?.user.name || "Engineer"}! 👋
            </h1>
            <p className="text-gray-300 text-sm mt-1 max-w-xl">
              Your CareerForge intelligence workspace is active. Manage your verified credentials, evaluate job listings, and create tailored resumes.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-700/60 text-xs text-gray-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Multi-User Tenant Isolated</span>
          </div>
        </div>
      </div>

      {/* Account Verification & Connection Badge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Authenticated As</p>
            <p className="text-sm font-semibold text-white truncate">{session?.user.email}</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Database Engine</p>
            <p className="text-sm font-semibold text-white">Neon Serverless PostgreSQL</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Auth Engine</p>
            <p className="text-sm font-semibold text-white">Better Auth Server Sessions</p>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 tracking-tight">Platform Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                className="p-5 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-medium">
                      {mod.phase}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-base mb-1">{mod.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{mod.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs font-medium text-indigo-400 hover:text-indigo-300">
                  <span>Enter Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

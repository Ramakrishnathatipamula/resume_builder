"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import {
  LayoutDashboard,
  User,
  Briefcase,
  GitCompare,
  FileText,
  Compass,
  ListTodo,
  Video,
  LogOut,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Career Profile", href: "/dashboard/profile", icon: User },
    { name: "Job Intelligence", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Skill Match Engine", href: "/dashboard/match", icon: GitCompare },
    { name: "Resume Builder", href: "/dashboard/builder", icon: FileText },
    { name: "Learning Roadmap", href: "/dashboard/roadmap", icon: Compass },
    { name: "Application Tracker", href: "/dashboard/tracker", icon: ListTodo },
    { name: "Interview Prep", href: "/dashboard/interview", icon: Video },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
        <span>Authenticating session...</span>
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  return (
    <div className="min-h-screen flex bg-[#0b0f19]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-800/80 bg-gray-950/70 p-5 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-600/30">
              C
            </div>
            <div>
              <span className="font-bold text-white tracking-tight block text-sm">CareerForge</span>
              <span className="text-[10px] text-indigo-400 font-medium block">AI Intelligence</span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-gray-900/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-gray-800/80">
          <div className="px-3 py-2.5 rounded-lg bg-gray-900/60 border border-gray-800/60 mb-2">
            <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
            <p className="text-[11px] text-gray-400 truncate">{session.user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-800/80 px-6 flex items-center justify-between bg-gray-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Neon DB Connected
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span>Welcome, <strong className="text-white">{session.user.name}</strong></span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

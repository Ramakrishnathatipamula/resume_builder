"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { getProfileData } from "@/server/actions/profile";
import {
  User,
  LayoutTemplate,
  History,
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
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.image) {
      setProfilePhoto(session.user.image);
    }
    getProfileData()
      .then((data) => {
        if (data?.photoUrl) {
          setProfilePhoto(data.photoUrl);
        }
      })
      .catch(() => {});

    const onPhotoUpdate = (e: any) => {
      setProfilePhoto(e.detail || null);
    };
    window.addEventListener("profilePhotoUpdated", onPhotoUpdate);
    return () => window.removeEventListener("profilePhotoUpdated", onPhotoUpdate);
  }, [session?.user]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Career Profile", href: "/dashboard/profile", icon: User },
    { name: "Resume Templates", href: "/dashboard/templates", icon: LayoutTemplate },
    { name: "History of Generated Resumes", href: "/dashboard/history", icon: History },
    { name: "Interview Preparation", href: "/dashboard/interview", icon: Video },
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
      <aside className="w-72 border-r border-gray-800/80 bg-gray-950/80 p-5 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo / Brand with Profile Picture at Left Corner */}
          <Link href="/dashboard" className="flex items-center gap-3 px-2 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-600/30 overflow-hidden shrink-0 border border-indigo-400/30 group-hover:border-indigo-400 group-hover:bg-indigo-500 transition">
              {profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profilePhoto}
                  alt={session.user.name || "Profile Photo"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>C</span>
              )}
            </div>
            <div>
              <span className="font-bold text-white tracking-tight block text-base group-hover:text-indigo-300 transition">CareerForge</span>
              <span className="text-[11px] text-gray-400 font-medium block">Resume Intelligence</span>
            </div>
          </Link>

          {/* User Requested Left Sidebar Menu Items */}
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition mb-2 ${
                pathname === "/dashboard"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-gray-900/60"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Job Analysis & Resume</span>
            </Link>

            <div className="pt-2 pb-1.5 px-3 text-[11px] font-semibold tracking-wider uppercase text-gray-500">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
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
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-gray-800/80">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-900/70 border border-gray-800/70 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/80 flex items-center justify-center font-bold text-white text-xs overflow-hidden shrink-0">
              {profilePhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profilePhoto}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{session.user.email}</p>
            </div>
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
            <span>Signed in as <strong className="text-white">{session.user.name}</strong></span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

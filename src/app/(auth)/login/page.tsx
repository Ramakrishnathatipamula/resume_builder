"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError(res.error.message || "Failed to sign in. Please verify your credentials.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0b0f19]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/90 border border-gray-800 shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            C
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your CareerForge workspace</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/50 border border-red-800/80 flex items-start gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-950/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800/80 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}


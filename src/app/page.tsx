import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Database, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-12 max-w-6xl mx-auto">
      <header className="flex justify-between items-center py-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/30">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CareerForge</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white shadow-md shadow-indigo-600/20 transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="my-16 md:my-24 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Tenant Career Intelligence & Resume Engineering</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Craft Factual, High-Impact Resumes with True Job Alignment.
        </h1>
        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
          Maintain your single source of career truth, extract deep requirements from job descriptions, discover genuine skill gaps, and generate ATS-optimized and LaTeX-quality resumes with zero hallucination.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
          >
            Create Your Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 font-semibold transition"
          >
            Sign In to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left">
          <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800/80">
            <ShieldCheck className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Strict Factual Grounding</h3>
            <p className="text-sm text-gray-400">Zero AI fabrication. Every bullet point is backed by your real verified career records.</p>
          </div>
          <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800/80">
            <Database className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">Multi-Tenant Isolation</h3>
            <p className="text-sm text-gray-400">Powered by Neon PostgreSQL and Better Auth. Your career data remains strictly private.</p>
          </div>
          <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800/80">
            <FileText className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="font-semibold text-white mb-1">LaTeX & Overleaf Export</h3>
            <p className="text-sm text-gray-400">One-click standard export to Overleaf and pixel-perfect ATS-compliant PDF downloads.</p>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-900 text-center text-xs text-gray-500">
        CareerForge © 2026. Built with Next.js, Neon PostgreSQL, Prisma and Better Auth.
      </footer>
    </div>
  );
}

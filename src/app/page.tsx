import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Database,
  FileText,
  Target,
  Brain,
  Zap,
  TrendingUp,
  CheckCircle2,
  Code2,
  LayoutTemplate,
  History,
  Video,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    color: "text-indigo-400",
    bg: "bg-indigo-600/10 border-indigo-500/20",
    title: "Job Intelligence Engine",
    desc: "Paste any job description and AI extracts required skills, ATS keywords, responsibilities, tools, salary range, and experience level — all saved to your personal JD library.",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-600/10 border-emerald-500/20",
    title: "Zero Hallucination Resumes",
    desc: "Every bullet point is backed by your verified career data. AI never fabricates skills, experiences, or projects — only what you've added to your Career Profile.",
  },
  {
    icon: Target,
    color: "text-violet-400",
    bg: "bg-violet-600/10 border-violet-500/20",
    title: "ATS Score Audit",
    desc: "After generating your resume, check a weighted ATS score (keyword match, formatting, action verbs, section completeness) with matched/missing keyword breakdown.",
  },
  {
    icon: LayoutTemplate,
    color: "text-sky-400",
    bg: "bg-sky-600/10 border-sky-500/20",
    title: "LaTeX Templates & Overleaf",
    desc: "Choose from professional LaTeX templates. One-click export to Overleaf or download the .tex file for pixel-perfect, ATS-friendly PDF generation.",
  },
  {
    icon: TrendingUp,
    color: "text-amber-400",
    bg: "bg-amber-600/10 border-amber-500/20",
    title: "Skill Gap & Learning Roadmap",
    desc: "See exactly which required skills you have vs. what you're missing, with a prioritised learning roadmap to close every gap before your next application.",
  },
  {
    icon: Video,
    color: "text-pink-400",
    bg: "bg-pink-600/10 border-pink-500/20",
    title: "Interview Preparation",
    desc: "Generate 10 role-specific interview questions with difficulty levels, ideal answer points, and a per-question answer timer — all tailored to your target role.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Build Your Career Profile",
    desc: "Add your education, work experience, projects, skills, and certifications once. This is your single source of verified career truth.",
  },
  {
    step: "02",
    title: "Paste the Job Description",
    desc: "AI analyses the JD, extracts skills and ATS keywords, compares against your profile, and identifies gaps with a learning roadmap.",
  },
  {
    step: "03",
    title: "Choose Template & Generate",
    desc: "Pick a LaTeX resume template. The AI tailors your profile data to the specific job — skipping empty sections, never faking data.",
  },
  {
    step: "04",
    title: "Check ATS Score & Export",
    desc: "Audit your resume's ATS score, review keyword coverage, then export to Overleaf or download as a .tex file for a perfect PDF.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      {/* ── Navbar ── */}
      <header className="border-b border-gray-800/80 bg-gray-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-indigo-500/30">
              C
            </div>
            <span className="text-lg font-bold tracking-tight text-white">CareerForge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 md:py-36 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Career Intelligence Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Resumes That Win Jobs.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Built on Real Data.
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Paste a job description. Get instant skill-gap analysis, an ATS keyword audit, and a
            professionally-formatted LaTeX resume — powered by your verified career profile, never fabricated.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition text-base"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 font-semibold transition text-base"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-20 px-6 border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 mb-4">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Everything you need to land your next role
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Career Intelligence, End-to-End
            </h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              From parsing job descriptions to generating ATS-optimised resumes and interview prep — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition group"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-6 border-t border-gray-800/60 bg-gray-950/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-400 mt-3 text-sm">From sign-up to ATS-ready resume in four steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 flex gap-5"
              >
                <div className="text-3xl font-black text-indigo-800/80 font-mono leading-none shrink-0 pt-0.5">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1.5">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack Banner ── */}
      <section className="py-14 px-6 border-t border-gray-800/60">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
            Built with enterprise-grade technology
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            {[
              { icon: Code2, label: "Next.js 15" },
              { icon: Database, label: "Neon PostgreSQL" },
              { icon: ShieldCheck, label: "Better Auth" },
              { icon: Brain, label: "Google Gemini AI" },
              { icon: FileText, label: "Prisma ORM" },
              { icon: LayoutTemplate, label: "LaTeX / Overleaf" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/60 border border-gray-800"
              >
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 border-t border-gray-800/60">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border border-indigo-800/40">
            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
              Ready to forge your career?
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Create your free account, build your career profile, and generate your first
              ATS-optimised resume in under 5 minutes.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition"
            >
              <Sparkles className="w-5 h-5" />
              Get Started — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-gray-900 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">C</div>
            <span>CareerForge © 2026</span>
          </div>
          <span>Built with Next.js · Neon PostgreSQL · Prisma · Better Auth · Google Gemini AI</span>
        </div>
      </footer>
    </div>
  );
}

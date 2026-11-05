import { USER_CUSTOM_TEMPLATES } from "./custom-latex-templates";

export interface ResumeTemplate {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  badge: string;
  badgeColor: "indigo" | "emerald" | "purple" | "amber";
  description: string;
  recommendedFor: string;
  features: string[];
  latexGuidelines: string;
  hasPhoto?: boolean;
}

const formattedUserTemplates: ResumeTemplate[] = (USER_CUSTOM_TEMPLATES || []).map((t) => ({
  id: t.id,
  name: t.name,
  subtitle: t.subtitle || "Custom User LaTeX Template",
  category: t.category || "Custom Template",
  badge: "Pasted Template",
  badgeColor: "purple" as const,
  description: "User-defined custom LaTeX template from custom-latex-templates.ts.",
  recommendedFor: "Custom Tailored Applications",
  features: [
    "User-defined LaTeX layout & macros",
    "Overleaf compatible",
    "Configured in custom-latex-templates.ts",
  ],
  latexGuidelines: t.latexCode,
}));

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  ...formattedUserTemplates,
  {
    id: "modern-photo",
    name: "Modern Executive with Photo (International / European)",
    subtitle: "Two-column executive header with passport-size photo frame & modern typography",
    category: "International & Executive",
    badge: "Photo Recommended",
    badgeColor: "emerald",
    hasPhoto: true,
    description: "Tailored for European, Middle Eastern, Asian, and executive CV formats where a formal professional passport photo is required. Clean two-column header with candidate details on the left and passport photo on the right.",
    recommendedFor: "International Roles, European CV (Europass style), Executive Leadership, Consulting",
    features: [
      "Dedicated passport-size photo frame in header",
      "Standard European & International CV compliant",
      "Crisp section dividers with highlighted credentials",
      "Full ATS readability with dual-format export",
    ],
    latexGuidelines: `
Use modern CV layout with photo support: \\usepackage{graphicx}, \\usepackage[margin=0.6in]{geometry}.
Header includes a minipage: candidate name and contacts on the left (0.75\\textwidth), and passport photo on the right (0.22\\textwidth) using \\includegraphics[width=2.5cm,height=3.2cm]{photo}.
Section headings use colored accent bar with clean horizontal separation.
Experience highlights leadership achievements, metrics, and cross-functional project delivery.
`,
  },
  {
    id: "jakes-tech",
    name: "Jake's Modern Tech (FAANG Standard)",
    subtitle: "Single-column, tight vertical rhythm, bold subheadings with horizontal rules",
    category: "Software Engineering & Tech",
    badge: "Most Popular in Tech / FAANG",
    badgeColor: "indigo",
    description: "The gold standard for software engineering and tech resumes worldwide. Clean tabular-free structure, hyperlinked headers, and 100% parseable by all major ATS parsers (Workday, Greenhouse, Lever).",
    recommendedFor: "SWE, SDE I/II/III, Full Stack, DevOps, Cloud Engineers, Tech Interns",
    features: [
      "100% ATS score across Workday & Greenhouse",
      "Tight 0.5in margins to maximize single-page content",
      "Bold role & company line with flush-right dates",
      "Action-verb & metrics-driven bullet lists",
    ],
    latexGuidelines: `
Use single-column layout with 0.5in margins: \\usepackage[empty]{fullpage}, \\usepackage{titlesec}, \\usepackage{hyperref}, \\usepackage{enumitem}.
Section titles should use \\titleformat{\\section}{\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}].
Use a clean sub-heading command for company/role: bold company and location on top line, italicized role and right-aligned dates on second line.
List bullets must have zero top/bottom separation (\\vspace{-1pt}, leftmargin=0.15in).
Font: Times or Computer Modern, 10pt or 11pt.
`,
  },
  {
    id: "classic-executive",
    name: "Classic Executive & Leadership",
    subtitle: "Distinguished serif typography with centered header and traditional dividers",
    category: "Senior Management & Staff Roles",
    badge: "Executive & Staff Level",
    badgeColor: "emerald",
    description: "Formal, authoritative design tailored for senior engineers, tech leads, engineering managers, and executive directors. Prioritizes leadership accomplishments, team scale, and business impact.",
    recommendedFor: "Engineering Managers, Staff / Principal Engineers, Product Managers, Directors",
    features: [
      "Distinguished Palatino or Georgia serif styling",
      "Centered contact header with elegant divider glyphs",
      "Dedicated Executive Summary & Core Competencies blocks",
      "Clean visual hierarchy optimized for executive recruiters",
    ],
    latexGuidelines: `
Use palatino or mathpazo font: \\usepackage{palatino}, \\usepackage[margin=0.65in]{geometry}.
Header centered with \\begin{center} \\huge\\bfseries ... \\end{center}.
Section headings in small caps with a subtle bottom line (\\vspace{4pt}\\hrule).
Include a structured 'Executive Summary' section before Experience.
Bullets should highlight team size, budget, architecture scale, and revenue impact.
`,
  },
  {
    id: "compact-minimal",
    name: "Minimalist Compact (Maximum Density)",
    subtitle: "High-density clean layout designed to fit extensive experience onto 1 page",
    category: "High-Density / Multi-Project",
    badge: "Best for Multi-Project Portfolios",
    badgeColor: "purple",
    description: "Ultra-clean sans-serif aesthetic with optimized horizontal space. Perfect for candidates with multiple complex projects, open-source contributions, and a large skill palette.",
    recommendedFor: "Frontend Engineers, AI/ML Engineers, Full Stack Developers with 3+ projects",
    features: [
      "Modern sans-serif font (Helvetica / Latin Modern Sans)",
      "Multi-column technical skills categorization",
      "Project cards with integrated live demo & GitHub repo links",
      "Ultra-compact bullet spacing preventing unwanted page 2 spill",
    ],
    latexGuidelines: `
Use sans-serif font: \\usepackage[scaled]{helvet}, \\renewcommand\\familydefault{\\sfdefault}.
Margins: 0.45in on all sides for maximum information density.
Skills section must use structured categories (Languages, Frameworks, Cloud, Databases) with bold category prefixes.
Projects must have project name, tech stack pill, and date flush-right.
`,
  },
  {
    id: "academic-research",
    name: "Academic, AI & Research LaTeX",
    subtitle: "Formal publication-oriented format emphasizing research, papers & education",
    category: "Academic & Data Science",
    badge: "Research & Data Science",
    badgeColor: "amber",
    description: "Designed specifically for researchers, data scientists, PhD/Master candidates, and patent holders. Features dedicated sections for Publications, Research Projects, Certifications, and Academic Honors.",
    recommendedFor: "Data Scientists, Machine Learning Researchers, PhD/Postdoc Candidates, AI Engineers",
    features: [
      "Standard academic article class compatible with BibTeX",
      "Numbered or bulleted Research Publications & Patents block",
      "Detailed Education breakdown with GPA, coursework & thesis title",
      "Professional mathematical font styling",
    ],
    latexGuidelines: `
Standard \\documentclass[11pt,a4paper]{article} with \\usepackage{latexsym}, \\usepackage{amsmath}.
Formal small-caps section formatting with clear numbering or neat horizontal lines.
Prominent Education section placed first with thesis, advisor, honors, and CGPA/scale.
Include a 'Publications & Research' or 'Patents & Preprints' section if relevant.
`,
  },
];

export function getStoredCustomTemplates(): ResumeTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("careerforge_custom_templates");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomTemplate(template: ResumeTemplate): void {
  if (typeof window === "undefined") return;
  const existing = getStoredCustomTemplates();
  const filtered = existing.filter((t) => t.id !== template.id);
  filtered.unshift(template);
  localStorage.setItem("careerforge_custom_templates", JSON.stringify(filtered));
}

export function deleteCustomTemplate(id: string): void {
  if (typeof window === "undefined") return;
  const existing = getStoredCustomTemplates();
  const filtered = existing.filter((t) => t.id !== id);
  localStorage.setItem("careerforge_custom_templates", JSON.stringify(filtered));
}

export function getTemplateById(id?: string, customList: ResumeTemplate[] = []): ResumeTemplate {
  const all = [...customList, ...RESUME_TEMPLATES];
  const found = all.find((t) => t.id === id);
  return found || RESUME_TEMPLATES[0];
}


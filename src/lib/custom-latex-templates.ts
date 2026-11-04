/**
 * ============================================================================
 * 📄 CAREERFORGE — USER CUSTOM LATEX TEMPLATES REPOSITORY
 * ============================================================================
 *
 * INSTRUCTIONS:
 * You can paste as many LaTeX resume templates as you want in this file!
 *
 * For each template, provide:
 *   1. id: A unique ID (e.g. "template-1", "stanford-tech", "faang-clean")
 *   2. name: The title shown on the card (e.g. "FAANG Software Engineer")
 *   3. category: The category (e.g. "Software Engineering", "Executive", "Freshers")
 *   4. subtitle: A short 1-line description of the layout
 *   5. latexCode: Paste the COMPLETE raw LaTeX source / preamble / macros between backticks (``)
 *
 * Every template you add here will AUTOMATICALLY appear:
 *   ✅ In the Resume Templates gallery (/dashboard/templates)
 *   ✅ In the Template Selection popup modal when generating a resume
 *   ✅ In the LaTeX generation engine & Overleaf export
 * ============================================================================
 */

export interface CustomUserTemplate {
  id: string;
  name: string;
  category?: string;
  subtitle?: string;
  latexCode: string;
}

export const USER_CUSTOM_TEMPLATES: CustomUserTemplate[] = [
  // ── TEMPLATE 1: PASTE YOUR LATEX CODE HERE ────────────────────────────────
  {
    id: "custom-template-1",
    name: "Custom Template 1",
    category: "Software Engineering",
    subtitle: "Paste your first LaTeX template code below",
    latexCode: `
% ============================================================================
% PASTE YOUR LATEX CODE FOR TEMPLATE 1 HERE
% (Replace this placeholder with your full LaTeX document or preamble)
% ============================================================================
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Add any custom macros or styling rules here...
`,
  },

  // ── TEMPLATE 2: PASTE YOUR LATEX CODE HERE ────────────────────────────────
  {
    id: "custom-template-2",
    name: "Custom Template 2",
    category: "Tech & Leadership",
    subtitle: "Paste your second LaTeX template code below",
    latexCode: `
% ============================================================================
% PASTE YOUR LATEX CODE FOR TEMPLATE 2 HERE
% ============================================================================
\\documentclass[10pt,letterpaper]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{palatino}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\titleformat{\\section}{\\large\\bfseries\\scshape}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{8pt}{4pt}
`,
  },

  // ── TEMPLATE 3: PASTE YOUR LATEX CODE HERE ────────────────────────────────
  {
    id: "custom-template-3",
    name: "Custom Template 3",
    category: "Minimalist & Compact",
    subtitle: "Paste your third LaTeX template code below",
    latexCode: `
% ============================================================================
% PASTE YOUR LATEX CODE FOR TEMPLATE 3 HERE
% ============================================================================
\\documentclass[10pt,a4paper]{article}
\\usepackage[margin=0.45in]{geometry}
\\usepackage[scaled]{helvet}
\\renewcommand\\familydefault{\\sfdefault}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\titleformat{\\section}{\\bfseries\\normalsize\\uppercase}{}{0em}{}[\\hrule]
\\titlespacing*{\\section}{0pt}{6pt}{3pt}
`,
  },

  // You can add more templates below by copying the block above!
];

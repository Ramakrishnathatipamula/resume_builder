/**
 * ============================================================================
 * 📄 CAREERFORGE — YOUR CUSTOM LATEX TEMPLATES FILE
 * ============================================================================
 *
 * YOU CAN PASTE AS MANY TEMPLATES AS YOU WANT HERE!
 * Whenever you add, edit, or remove a template in this file:
 *  ✅ It automatically appears in the Resume Templates page (/dashboard/templates)
 *  ✅ It automatically appears in the Template Selection popup modal
 *  ✅ The AI generates the resume using your exact LaTeX layout and macros
 *  ✅ Clicking "Open in Overleaf" opens your exact template
 *
 * HOW TO ADD A NEW TEMPLATE:
 * Just copy a block below and paste your LaTeX code between String.raw` and `
 * Note: String.raw ensures you DO NOT need to escape backslashes (\documentclass, \textbf, etc.)!
 * ============================================================================
 */

export interface CustomUserTemplate {
  id: string;          // A unique ID (e.g. "template-1", "harvard-clean", "swe-modern")
  name: string;        // Title displayed on the card (e.g. "FAANG Software Engineer")
  category?: string;   // Category (e.g. "Software Engineering", "Management", "Freshers")
  subtitle?: string;   // Short 1-line description of the layout
  latexCode: string;   // The raw LaTeX code
}

export const USER_CUSTOM_TEMPLATES: CustomUserTemplate[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 🟢 TEMPLATE 1: PASTE YOUR FIRST LATEX CODE HERE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "my-template-1",
    name: "My Custom Template 1",
    category: "Software Engineering",
    subtitle: "Clean single-column professional layout",
    latexCode: String.raw`
% PASTE YOUR FULL LATEX CODE FOR TEMPLATE 1 BELOW:
\documentclass[letterpaper,11pt]{article}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}

\pagestyle{fancy}
\fancyhf{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

% Add your custom macros, packages, and layout commands here...
`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 🟢 TEMPLATE 2: PASTE YOUR SECOND LATEX CODE HERE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "my-template-2",
    name: "My Custom Template 2",
    category: "Tech & Leadership",
    subtitle: "Distinguished serif typography layout",
    latexCode: String.raw`
% PASTE YOUR FULL LATEX CODE FOR TEMPLATE 2 BELOW:
\documentclass[10pt,letterpaper]{article}
\usepackage[margin=0.6in]{geometry}
\usepackage{palatino}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{hyperref}

\titleformat{\section}{\large\bfseries\scshape}{}{0em}{}[\titlerule]
\titlespacing*{\section}{0pt}{8pt}{4pt}

% Add your custom macros, packages, and layout commands here...
`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 🟢 TEMPLATE 3: PASTE YOUR THIRD LATEX CODE HERE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "my-template-3",
    name: "My Custom Template 3",
    category: "Minimalist & Compact",
    subtitle: "High-density space-saving layout",
    latexCode: String.raw`
% PASTE YOUR FULL LATEX CODE FOR TEMPLATE 3 BELOW:
\documentclass[10pt,a4paper]{article}
\usepackage[margin=0.45in]{geometry}
\usepackage[scaled]{helvet}
\renewcommand\familydefault{\sfdefault}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{hyperref}

\titleformat{\section}{\bfseries\normalsize\uppercase}{}{0em}{}[\hrule]
\titlespacing*{\section}{0pt}{6pt}{3pt}

% Add your custom macros, packages, and layout commands here...
`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ➕ TO ADD MORE TEMPLATES: Copy one of the blocks above and paste it here!
  // ──────────────────────────────────────────────────────────────────────────
];

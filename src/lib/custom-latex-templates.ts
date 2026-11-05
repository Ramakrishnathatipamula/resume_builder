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
%-------------------------
% Rezume, a latex resume template for developers
% Author : Nanu Panchamurthy
% Based off of: https://github.com/sb2nov/resume
% License : MIT

% Hope this resume template helps you land an awesome job. If you found this helpful, please consider starring the github repo here, .
%-------------------------



%------------PACKAGES----------------
\documentclass[a4paper,11pt]{article}

\usepackage{verbatim} % reimplements the "verbatim" and "verbatim*" environments

\usepackage{titlesec} % provides an interface to sectioning commands i.e. custom elements

\usepackage{color} % provides both foreground and background color management

\usepackage{enumitem} % provides control over enumerate, itemize and description

\usepackage{fancyhdr} % provides extensive facilities for constructing headers, footers and also controlling their use

\usepackage{tabularx} % defines an environment tabularx, extension of "tabular" with an extra designator x, paragraph like column whose width automatically expands to fill the width of the environment

\usepackage{latexsym} % provides mathematical symbols

\usepackage{marvosym} % provides martin vogel's symbol font which contains various symbols

\usepackage[empty]{fullpage} % sets margins to one inch and removes headers, footers etc..

\usepackage[hidelinks]{hyperref} % removes color and shadow of hyperlinks

\usepackage[normalem]{ulem} % provides "\ul" (uline) command which will break at line breaks

\usepackage[english]{babel} % provides culturally determined typographical rules for wide range of languages
%-----------------------------------------

\input glyphtounicode % converts glyph names to unicode
\pdfgentounicode=1 % ensures pdfs generated are ats readable

%----------FONT OPTIONS-------------------
\usepackage[default]{sourcesanspro} % uses the font source sans pro
\urlstyle{same} % changes url font from default urlfont to font being used by the document
%-----------------------------------------


%----------MARGIN OPTIONS-----------------
\pagestyle{fancy} % set page style to one configured by fancyhdr
\fancyhf{} % clear all header and footer fields

\renewcommand{\headrulewidth}{0in} % sets thickness of linerule under header to zero
\renewcommand{\footrulewidth}{0in} % sets thickness of linerule over footer to zero

\setlength{\tabcolsep}{0in} % sets thickness of column separator in tables to zero

% origin of the document is one inch from the top and from and the left
% oddsidemargin and evensidemargin both refer to the left margin
% right margin is indirectly set using oddsidemargin
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\topmargin}{-0.5in}

\addtolength{\textwidth}{1.0in} % sets width of text area in the page to one inch
\addtolength{\textheight}{1.0in} % sets height of text area in the page to one inch

\raggedbottom{} % makes all pages the height of current page, no extra vertical space added
\raggedright{} % makes all pages the width of current page, no extra horizontal space added
%------------------------------------------


%--------SECTIONING COMMANDS---------
% \titleformat{<command>}
%   [<shape>]{<format>}{<label>}{<sep>}
%     {<before-code>}[<after-code>]

% command is the sectioning command to be redefined
% shape is the style of the font; scshape stands for small caps style
% format is the format to be applied to whole title- label and text; absent here
% label defines the label
% sep is the horizontal separation between label and title body
% before-code is the code to be executed before
% after-code is the code to be executed after

\titleformat{\section}
  {\scshape\large}{}
    {0em}{\color{blue}}[\color{black}\titlerule\vspace{0pt}]
%-------------------------------------


%--------REDEFINITIONS----------------
% redefines the style of the bullet point
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}

% redefines the underline depth to 2pt
\renewcommand{\ULdepth}{2pt}
%-------------------------------------


%--------CUSTOM COMMANDS--------------
%\vspace{} defines a vertical space of given size, modifying this in custom commands can help stretch or shrink resume to remove or add content

% resumeItem renders a bullet point
\newcommand{\resumeItem}[1]{
  \item\small{#1}
}

% commands to start and end itemization of resumeItem, rightmargin set to 0.11in to avoid the overflow of resumetItem beyond whatever resumeItemHeading is being used
\newcommand{\resumeItemListStart}{\begin{itemize}[rightmargin=0.11in]}
\newcommand{\resumeItemListEnd}{\end{itemize}}

% resumeSectionType renders a bolded type to be used under a section, used as skill type here, middle element is used to keep ":"s in the same vertical line
\newcommand{\resumeSectionType}[3]{
  \item\begin{tabular*}{0.96\textwidth}[t]{
    p{0.15\linewidth}p{0.02\linewidth}p{0.81\linewidth}
  }
    \textbf{#1} & #2 & #3
  \end{tabular*}\vspace{-2pt}
}

% resumeTrioHeading renders three elements in three columns with second element being italicized and first element bolded, can be used for projects with three elements
\newcommand{\resumeTrioHeading}[3]{
  \item\small{
    \begin{tabular*}{0.96\textwidth}[t]{
      l@{\extracolsep{\fill}}c@{\extracolsep{\fill}}r
    }
      \textbf{#1} & \textit{#2} & #3
    \end{tabular*}
  }
}

% resumeQuadHeading renders four elements in a two columns with the second row being italicized and first element of first row bolded, can be used for experience and projects with four elements
\newcommand{\resumeQuadHeading}[4]{
  \item
  \begin{tabular*}{0.96\textwidth}[t]{l@{\extracolsep{\fill}}r}
    \textbf{#1} & #2 \\
    \textit{\small#3} & \textit{\small #4} \\
  \end{tabular*}
}

% resumeQuadHeadingChild renders the second row of resumeQuadHeading, can be used for experience if different roles in the same company need to added
\newcommand{\resumeQuadHeadingChild}[2]{
  \item
  \begin{tabular*}{0.96\textwidth}[t]{l@{\extracolsep{\fill}}r}
    \textbf{\small#1} & {\small#2} \\
  \end{tabular*}
}

% commands to start and end itemization of resumeQuadHeading, lefmargin for left indent of 0.15in for resumeItems
\newcommand{\resumeHeadingListStart}{
  \begin{itemize}[leftmargin=0.15in, label={}]
}
\newcommand{\resumeHeadingListEnd}{\end{itemize}}
%-------------------------------------------


%__________________RESUME____________________
% You can rearrange sections in any order you may prefer
\begin{document}

%-----------CONTACT DETAILS------------------
% Make sure all the details are correct, you can add more links in the first row of second column if needed

\begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
  \textbf{\Huge Jane Doe \vspace{2pt}} & % row = 1, col = 1
  Location: Anycity, Anystate, Anycountry \\ % row = 1, col = 2
  \href{https://jane-doe.com}{\uline{jane-doe.com}} $|$ % row = 2, col = 1
  \href{https://linkedin.com/in/jane-doe}{\uline{LinkedIn}} $|$ % row = 2, col = 1
  \href{https://github.com/jane-doe}{\uline{GitHub}} $|$ % row = 2, col = 1
  \href{https://leetcode.com/jane-doe}{\uline{Leetcode}} & % row = 2, col = 1
  Email: \href{mailto:jane.doe@anymail.com}{\uline{jane.doe@anymail.com}} $|$ % row = 2, col = 2
  Mobile: 5555555555 \\ % row = 2, col = 2
\end{tabular*}
%--------------------------------------------


%-----------SUMMARY--------------------------
% Keep this short, simple and straigth to point

\section{Full Stack Developer}
\small{
  I am a highly skilled web developer with over \textbf{3 years of experience} in \textbf{HTML, CSS, JavaScript, and PHP}. I have knowledge of popular frameworks such as \textbf{React, Angular, and Vue.js} and experience with REST APIs and MVC frameworks.
}
%--------------------------------------------


%--------------SKILLS------------------------
% Add or remove resumeSectionTypes according to your needs

\section{Technical Skills}
  \resumeHeadingListStart{}
    \resumeSectionType{Languages}{:}{JavaScript, PHP, Java, HTML, CSS}
    \resumeSectionType{Frameworks}{:}{React.js, Angular, Express, Node.js}
    \resumeSectionType{Libraries}{:}{Material, Redux, React Router}
    \resumeSectionType{Databases}{:}{MongoDB, PostgreSQL}
    \resumeSectionType{Dev Tools}{:}{Visual Studio Code, Git, Gitlab}
  \resumeHeadingListEnd{}
%--------------------------------------------


%-----------EXPERIENCE-----------------------
% Distill all your talking points to small bullet points which follow the pattern "challenge-action-result" for maximum efficiency. Try to quantify (use numbers) your points whenver possible, highlist words of importance

\section{Experience}
\resumeHeadingListStart{}
  \resumeQuadHeading{Web Developer}{Apr 2022 -- Present}
  {Anycompany}{Remote -- AnyCity, Anystate, Anycountry}
    \resumeItemListStart{}
      \resumeItem{Designed and developed dynamic and responsive websites using \textbf{HTML, CSS, JavaScript, and PHP}}
      \resumeItem{Worked with \textbf{REST APIs} to retrieve and display data from databases}
      \resumeItem{Improved \textbf{website performance} and speed through optimization techniques by \textbf{55\%}}
    \resumeItemListEnd{}

  \resumeQuadHeading{Backend Developer}{Aug 2021 -- Nov 2022}
  {Anycompany}{Anycity, Anystate, Anycountry}
    \resumeItemListStart{}
      \resumeItem{Worked with \textbf{MVC frameworks} to develop robust and scalable backends}
      \resumeItem{Troubleshot and \textbf{fixed bugs} and issues in the backend to ensure \textbf{smooth operation} of the applications}
    \resumeItemListEnd{}

  \resumeQuadHeadingChild{Backend Developer Intern}{Jan 2021 -- Aug 2021}
    \resumeItemListStart{}
      \resumeItem{Assisted senior web developers in the design and development of websites using \textbf{HTML, CSS, and JavaScript}}
    \resumeItemListEnd{}
\resumeHeadingListEnd{}
%---------------------------------------------


%-----------EDUCATION-------------------------
% Mention your CGPA, if its good, in the first row of second column

\section{Education}
  \resumeHeadingListStart{}
    \resumeQuadHeading{University of Anystate}{Anycity, Anystate, Anycountry}
    {Bachelor of Science in Computer Science}{Jan 2016 -- Dec 2020}
  \resumeHeadingListEnd{}
%---------------------------------------------


%-----------PROJECTS--------------------------
% Use resumeQuadHeading if four elements are feasible (ex: demo video link), else use resumeTrioHeading. Keep the bullet points simple and concise and try to cover wide variety of skills you have used to build these projects

\section{Projects}
  \resumeHeadingListStart{}
    \resumeTrioHeading{\href{https://project1.com}{\uline{Project 1}}}{React.js, Redux, PHP, MySQL Git}{\href{https://proect1.com/source-code/}{\uline{Source Code}}}
      \resumeItemListStart{}
        \resumeItem{Designed and developed a clean and modern website using \textbf{HTML, CSS, and JavaScript}}
        \resumeItem{Optimized website for \textbf{speed and user experience}}
        \resumeItem{Utilized \textbf{responsive design} to ensure compatibility across all devices}
        \resumeItem{Deployed on GitHub pages via GitHub Actions}
      \resumeItemListEnd{}

      \resumeTrioHeading{Project 2}{Node.js, Express, JavaScript, Git}{\href{https:project2.com/source-code}{\uline{Source Code}}}
      \resumeItemListStart{}
        \resumeItem{A \textbf{CRUD application} exposed using a RESTful API made with Node.js}
        \resumeItem{Exposed POST, GET, PATCH and DELETE HTTP methods using \textbf{Express}}
      \resumeItemListEnd{}
  \resumeHeadingListEnd{}
%--------------------------------------------


%----------------OTHERS----------------------
% You can add your acheivements, accolades, certifications etc. here.

\section{Certifications}
  \resumeItemListStart{}
    \resumeItem{\href{https://dummy-certification.com}{\uline{Certified Web Developer by the W3C}}}
    \resumeItem{\href{https://dummy-certification.com}{\uline{Microsoft Certified: Azure Developer Associate}}}
    \resumeItem{\href{https://dummy-certification.com}{\uline{AWS Certified Developer - Associate}}}
  \resumeItemListEnd{}
%--------------------------------------------

\end{document}

`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 🟢 TEMPLATE 2: PASTE YOUR SECOND LATEX CODE HERE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "my-template-2",
    name: "Classic Minimalist (Blue Accent)",
    category: "Tech & Leadership",
    subtitle: "Distinguished typography layout with subtle blue headers",
    latexCode: String.raw`
\documentclass[a4paper,11pt]{article}
\usepackage[bottom=0.8in,top=0.8in, left=0.8in,right=0.8in]{geometry}

% non-numbered pages
\pagestyle{empty} 

%%%%%%%%%%% pdflatex %%%%%%%%%
\usepackage[T1]{fontenc}
\usepackage{newtxmath,newtxtext}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%%%%%% xelatex %%%%%%%%%%%%%%
% \usepackage{fontspec}
% \setmainfont{Times New Roman}
% \setmainfont{TeX Gyre Termes}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%A Few Useful Packages
\usepackage{parskip}
\usepackage{titlesec}	
\usepackage{multirow}
\usepackage{graphicx}
\usepackage[usenames,dvipsnames]{xcolor}
\usepackage{hyperref}
\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\hypersetup{colorlinks,breaklinks,urlcolor={linkcolour!90}, linkcolor={linkcolour!90}}

% line spacing
\linespread{1.1}

% section reformatting
\titleformat{\section}{\color{black} \large}{}{0em}{}[\color{black}]
\titlespacing{\section}{0pt}{3pt}{3pt}

\newcommand{\sectitle}[1]{
    \vspace{1.5ex}
    \section{#1}
    \vspace{-3ex}
    \noindent\rule{\textwidth}{0.7pt}
    \vspace{-4ex}
}

% new text bold style
\newsavebox\CBox
\def\textBF#1{\sbox\CBox{#1}\resizebox{\wd\CBox}{\ht\CBox}{\textcolor{linkcolour}{{#1}}}}
\parindent=0pt

% dummy text
\newcommand{\mylipsum}{Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut purus elit,
vestibulum ut, placerat ac, adipiscing vitae, felis.}

%-------------------- Begin document ----------------------
\begin{document}

%-------------------- Title section ----------------------
\begin{minipage}{\textwidth}
    \vspace{7ex}
        \par{
        \centering
        \vspace{-0.9in}
            % \textcolor{black}{\emph{Curriculum Vitae}}\\
            \textcolor{linkcolour}{\Large YOUR NAME}
        \par}
\end{minipage}

%-------------------- Header ----------------------
\begin{center}
    Address, YY, XX \,$\cdot$\, \href{mailto:email@address.com}{email@address.com} \,$\cdot$\, \href{https://mywebsite.com/}{mywebsite.com}
\end{center}

%%% Short paragraph
My brief description.~\mylipsum

%-------------------- SECTIONS ----------------------

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\sectitle{Technical Skills}

\textBF{Programming skills} --- \mylipsum

\textBF{Data Analysis} --- \mylipsum

\textBF{Visualization} --- \mylipsum

\textBF{Git} --- \mylipsum

\textBF{Unix} --- \mylipsum

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\sectitle{Core Competencies}

\textBF{Leadership} --- \mylipsum

\textBF{Problem-solving} --- \mylipsum

\textBF{Communication} --- \mylipsum

\textBF{Writing} --- \mylipsum

\textBF{Languages} --- \mylipsum

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\sectitle{Positions}

\textBF{First Position} --- XYZ Institute \hfill XX 2000 --- Present

\mylipsum

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\sectitle{Education}

\mylipsum

\textBF{Ph.D.} in YYY -- {XYZ University, CT}\hfill {XX 2000 --- YY XXXX} 

\textBF{B.S.} in XXX -- {XYZ University, CT}  \hfill {XX 2000 --- YY XXXX} 

\end{document}
`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 🟢 TEMPLATE 3: PASTE YOUR THIRD LATEX CODE HERE
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "my-template-3",
    name: "Executive Navy (Giannetti Style)",
    category: "Executive & Consulting",
    subtitle: "Professional navy blue accented layout with tabular skills and project portfolios",
    latexCode: String.raw`
% This template is designed to offer an aesthetically pleasing resume that adheres to a formal and institutional tone, making it suitable for applications to companies and research centers requiring a high degree of professionalism. Navy blue has been chosen as the primary color to align with these objectives.
% Self-contained standalone version (compiles directly on Overleaf without requiring external resume.cls).
% Author: Christian Maria Giannetti

%----------------------------------------------------------------------------------------
%  Packages And Other Document Configurations
%----------------------------------------------------------------------------------------

\documentclass[11pt,a4paper]{article}

% Document margins
\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}

% Color and hyperlink packages
\usepackage{xcolor}
\usepackage{hyperref}
\usepackage{ifthen}

% Footnote and margin adjustment packages
\usepackage{footnote}
\usepackage{changepage}

% Tabularx package for custom tables
\usepackage{tabularx}

% Define navyblue color
\definecolor{navyblue}{RGB}{0,54,123}
\hypersetup{colorlinks=true, linkcolor=navyblue, urlcolor=navyblue}

% Page style
\pagestyle{empty}

%----------------------------------------------------------------------------------------
%   Standalone Resume Macros (No external .cls needed)
%----------------------------------------------------------------------------------------

% Candidate Name & Personal Info
\newcommand{\name}[1]{\def\candidatename{#1}}
\def\candidatename{}

\newcommand{\printPersonalInfo}[1]{%
  \begin{center}%
    \ifx\candidatename\empty\else%
      {\Huge\bfseries \candidatename}\\[4pt]%
    \fi%
    \small #1%
  \end{center}%
  \vspace{-0.5em}%
}

\newcommand{\personalInfo}[1]{#1 \\}
\providecommand{\tag}[1]{\textbf{#1:}\ }
\newcommand{\info}[1]{#1}
\newcommand{\infoSeparator}{\quad\vert\quad}

% Define italicitem, bolditem, and plainitem commands
\newcommand{\italicitem}[1]{\item{\textit{#1}}}
\newcommand{\bolditem}[1]{\item{\textbf{#1}}}
\newcommand{\plainitem}[1]{\item{#1}}

% Define user-friendly link command for hyperlinks
\newcommand{\link}[2]{{\href{#1}{#2}}}
\newcommand{\entry}[2]{#1 & #2 \tabularnewline}

% Section Environment
\newenvironment{rSection}[1]{%
  \vspace{1.2em}%
  {\color{navyblue}\large\bfseries\MakeUppercase{#1}}%
  \par\vspace{0.2em}%
  {\color{navyblue}\hrule height 0.8pt}%
  \vspace{0.6em}%
}{%
  \par\vspace{0.3em}%
}

% Subsection Environment for Work Experience
\newenvironment{rSubsection}[4]{%
  {\bfseries #1} \hfill {#2}%
  \ifthenelse{\equal{#3}{}}{}{%
    \\
    {\textit{#3}} \hfill {\textit{#4}}%
  }%
  \smallskip%
  \begin{list}{$\cdot$}{\setlength{\leftmargin}{1.5em}\setlength{\itemsep}{-0.2em}\setlength{\topsep}{0em}}%
}{%
  \end{list}%
  \vspace{0.3em}%
}

% Subsection Environment without Bullets (Education, etc.)
\newenvironment{rSubsectionNoBullet}[4]{%
  {\bfseries #1} \hfill {#4}%
  \ifthenelse{\equal{#2}{}}{}{%
    \\
    {\textit{#2}} \hfill {\textit{#3}}%
  }%
  \smallskip%
  \begin{list}{}{\setlength{\leftmargin}{1.2em}\setlength{\itemsep}{-0.2em}\setlength{\topsep}{0em}}%
}{%
  \end{list}%
  \vspace{0.3em}%
}

% Tabularx Environment Section
\newcommand{\tableEnv}[2]{%
  \begin{rSection}{#1}%
    \begin{adjustwidth}{0.0in}{0.1in}%
      \begin{tabularx}{\linewidth}{@{} >{\bfseries}l @{\hspace{4ex}} X @{}}%
        #2%
      \end{tabularx}%
    \end{adjustwidth}%
  \end{rSection}%
}

%----------------------------------------------------------------------------------------
%   Begin document
%----------------------------------------------------------------------------------------

\name{\color{navyblue} Carl Johnson (CJ)}

\begin{document}

\printPersonalInfo{
  \personalInfo{\tag{Residence/domicile}\info{113, Groove Street}}
  \personalInfo{\tag{E-mail}\info{pleasedonotcontactme@gmail.com} \infoSeparator\tag{Telephone number}\info{+1-202-555-0100}}
  \personalInfo{\tag{Place of birth}\info{Ariccia, Italy} \infoSeparator\tag{Date of birth}\info{08-11-1968}}
}

%----------------------------------------------------------------------------------------
%   Education section
%----------------------------------------------------------------------------------------

\begin{rSection}{Education}

    % Master's degree entry
    \begin{rSubsectionNoBullet}{\bf Master's degree in Memeology and Unicorn Analytics}{Faber College}{Master's degree program}{February 2019 - April 2020}
        \italicitem{Graduated with honors}
        \italicitem{Thesis title: A deep learning approach to predicting the next Brexit: Unicorns vs. White Walkers}
    \end{rSubsectionNoBullet}
    
    % Bachelor's degree entry
    \begin{rSubsectionNoBullet}{\bf Bachelor's degree in Absurd Robotics Engineering}{Westeros University}{Bachelor's degree program}{May 2016 - August 2018}
        \italicitem{Final grade: 9,001/10,000}
        \italicitem{Capstone project: Design and implementation of a robot that makes toast using a flamethrower}
    \end{rSubsectionNoBullet}
    
    % High School diploma entry
    \begin{rSubsectionNoBullet}{\bf High School Diploma}{Rydell High School}{High school's diploma program}{June 2011 - May 2015}
        \italicitem{Final grade: 7/7}
        \italicitem{Senior project: Applying machine learning techniques to predict students' failure rates based on their meme consumption habits}
    \end{rSubsectionNoBullet}

\end{rSection}

%----------------------------------------------------------------------------------------
%   Work experience section
%----------------------------------------------------------------------------------------

\begin{rSection}{Work experience}

    % First work experience entry
    \begin{rSubsection}{Dank Memes Inc.}{September 2019 - September 2021}{Head of "Machine Learning for Absurd Stuff" Department}{Ariccia, Italy}
        \item Developed state-of-the-art predictive models for next-generation memes.
        \item Applied machine learning techniques to optimize unicorn-mounted laser systems.
        \item Streamlined internal meme generation pipelines.
    \end{rSubsection}
    
    % Second work experience entry
    \begin{rSubsection}{Viral News Robotics Laboratory (VNRL)}{March 2019 - July 2019}{Robotics Comedian Intern}{Fries, Virginia}
        \item Engineered a robotic Tyrion Lannister that repeatedly asks, "Where's the wine?"
    \end{rSubsection}
    
    % Third work experience entry
    \begin{rSubsection}{Library of Alexandria 2.0}{January 2017 - April 2018}{Novelist}{Cut and Shoot, Texas}
        \item Curated the "Dumb \& Dumber Guide to Classic Literature", featuring "Fifty Smudges 
        of Gray", "Pride and Prejudice: smart girls can always find a way to rationalize marrying for money"
        \item Hosted a weekly meme reading club on "Breadxit": the debate over whether bread should be banned from Europe
    \end{rSubsection}
    
\end{rSection}

%----------------------------------------------------------------------------------------
%   Extracurricular activities section
%----------------------------------------------------------------------------------------

\begin{rSection}{Extracurricular activities}

% First extracurricular entry
\begin{rSubsectionNoBullet}{Procrastinators Anonymous: Machine Learning for Laziness}{November 2015}{Successfully delayed attending the course}{Rome, Italy}
    \plainitem{Developed an AI that predicts the perfect moment to start binge-watching Dr. House episodes instead of working on important tasks.}
\end{rSubsectionNoBullet}

% Third extracurricular entry
\begin{rSubsectionNoBullet}{Dumb Literature Club: Famous Books with Ridiculous Twists}{June 2014 - Present}{Proud Member}{Popejoy, Iowa}
    \plainitem{Regularly participate in discussions concerning famous literature works, such as "The Great Catsby", which is basically the Great Gatsby, but with cats.}
\end{rSubsectionNoBullet}

\end{rSection}

%----------------------------------------------------------------------------------------
% Technical skills section
%----------------------------------------------------------------------------------------

\tableEnv{Technical skills}{
    \entry{Programming Languages/Tools}{C, C++, Java, Javascript, Python, Prolog, \LaTeX, PigeonScript (for bird-based memes)}
}

%----------------------------------------------------------------------------------------
% Language proficiencies section
%----------------------------------------------------------------------------------------

\tableEnv{Language proficiencies}{
    \entry{English}{Fluent in Shakespearean insults}
    \entry{French}{Proficient in baguette related jokes}
}

%----------------------------------------------------------------------------------------
% Most relevant projects section
%----------------------------------------------------------------------------------------

\tableEnv{Portfolio of most relevant projects}{
    \entry{Survey}{Analyzing the effects of replacing office chairs with unicycles on employee morale}
    \entry{Survey}{Investigation of the therapeutic effects of watching cat videos for 8 hours a day}
    \entry{Paper}{The correlation between sock loss in laundry and the existence of parallel universes}
    \entry{Article}{The definitive study on the impact of pineapple as a pizza topping on global diplomacy}
}

%----------------------------------------------------------------------------------------
% Memberships section
%----------------------------------------------------------------------------------------

\tableEnv{Memberships}{
    \entry{Couch Potatoes Anonymous}{A support group for those addicted to binge-watching TV shows}
    \entry{Procrastinators' Club}{A group that will eventually get around to doing something, someday}
}

\end{document}
`,
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ➕ TO ADD MORE TEMPLATES: Copy one of the blocks above and paste it here!
  // ──────────────────────────────────────────────────────────────────────────
];

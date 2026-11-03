# CAREERFORGE — PROJECT CONTEXT & SPECIFICATION

## Project Identity
- **Project Name:** CareerForge
- **Workspace:** `/Users/kittu/Desktop/resume`
- **Architecture Model:** Modular Monolith (Next.js App Router) with Decoupled Multi-Agent AI Subsystem
- **Runtime:** Node.js v26.3.0, TypeScript, Neon PostgreSQL

---

## Domain Boundary & Problem Definition
Traditional resume builders suffer from two major flaws:
1. **Generic Word Processors:** They act as simple layout tools without understanding the alignment between candidate capabilities and specific job openings.
2. **Uncontrolled Hallucinatory AI Tools:** Generative AI tools often invent job titles, exaggerate skills, or fabricate metrics to "beat ATS filters," which damages candidate credibility in live interviews.

**CareerForge solves this by separating Career Truth from Job Alignment:**
- **Career Truth:** An immutable, user-verified career profile that serves as the candidate's canonical database.
- **Job Alignment:** An intelligent analysis engine that matches canonical profile records against job descriptions, highlights genuine overlaps and skill gaps, and tailors emphasis and phrasing without fabricating claims.

---

## Core Actors & Permissions
- **Authenticated User (`User`):**
  - Full CRUD control over personal career profile.
  - Ability to upload, store, and analyze job descriptions.
  - Ability to generate, preview, edit, and export resumes.
  - Access to personal learning roadmaps and interview sessions.
  - Complete isolation: cannot read, update, or delete records belonging to any other user.
- **System / AI Orchestrator (`System`):**
  - Stateless execution of multi-agent routines (`AG-001` - `AG-009`).
  - Strict input-context pruning (no leaking user data across sessions or agents).
  - Validation of all LLM structured responses against Zod schemas before database persistence.

---

## Key Performance & Quality Metrics
1. **ATS Compatibility:** Templates designed with standard semantic typography, single/two-column tabular-free layouts, and parsable font hierarchies.
2. **Export Fidelity:** Pixel-accurate PDF rendering and 100% syntactically valid LaTeX output compatible with Overleaf and TeXLive.
3. **Deterministic Scoring:** Skill compatibility scores must be transparently explainable with direct evidence links to candidate records.

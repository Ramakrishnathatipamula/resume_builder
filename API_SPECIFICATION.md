# CAREERFORGE — API & SERVER ACTION SPECIFICATION

## 1. Architecture Paradigm
CareerForge leverages **Next.js Server Actions** for internal mutations and secure data queries, complemented by standard **Route Handlers** (`/api/...`) for binary exports, webhooks, and third-party integrations (Better Auth and Overleaf).

All endpoints and actions require an active session via Better Auth, unless explicitly marked as public.

---

## 2. Server Actions Specification

### A. Authentication & Session Layer
*Handled natively by Better Auth through `/api/auth/[...all]`.*
- `POST /api/auth/sign-up/email`: Register with email and password.
- `POST /api/auth/sign-in/email`: Login and obtain session cookie.
- `POST /api/auth/sign-out`: Invalidate server session.
- `GET /api/auth/session`: Retrieve current active session and user info.

---

### B. Career Profile Actions (`src/server/actions/profile.ts`)

#### `getProfile(): Promise<ProfileWithRelations | null>`
- **Auth:** Required (`session.user.id`).
- **Description:** Returns the user's complete canonical profile including education, experience, projects, skills, and certifications.

#### `updatePersonalInfo(data: UpdateProfileInput): Promise<ActionResult<Profile>>`
- **Auth:** Required.
- **Input:**
  ```typescript
  {
    fullName: string;
    headline: string;
    summary: string;
    email: string;
    phone?: string;
    location?: string;
    websiteUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    targetRoles: string[];
  }
  ```
- **Response:** Updated profile object and recalculated profile completion score.

#### `upsertExperience(data: ExperienceInput): Promise<ActionResult<Experience>>`
- **Auth:** Required. Verifies `profile.userId === session.user.id`.
- **Input:** `{ id?: string, company: string, title: string, startDate: Date, endDate?: Date, isCurrent: boolean, bullets: string[], technologies: string[] }`.

#### `upsertProject(data: ProjectInput): Promise<ActionResult<Project>>`
- **Auth:** Required.
- **Input:** `{ id?: string, name: string, description: string, demoUrl?: string, repoUrl?: string, bullets: string[], technologies: string[] }`.

#### `upsertEducation(data: EducationInput): Promise<ActionResult<Education>>`
- **Auth:** Required.
- **Input:** `{ id?: string, institution: string, degree: string, fieldOfStudy: string, startDate: Date, endDate?: Date, isCurrent: boolean, gpa?: string }`.

#### `syncSkills(skills: { name: string, category: SkillCategory, level?: string }[]): Promise<ActionResult<Skill[]>>`
- **Auth:** Required. Replaces or synchronizes the candidate's skill matrix.

---

### C. Job Intelligence Actions (`src/server/actions/jobs.ts`)

#### `analyzeJobDescription(rawText: string): Promise<ActionResult<JobDescription>>`
- **Auth:** Required.
- **Processing:** Invokes `AG-002: Job Analyzer Agent` with structured Zod output validation.
- **Output:** Stored `JobDescription` record with extracted company, role, requiredSkills, preferredSkills, responsibilities, and keywords.

#### `getSavedJobs(): Promise<JobDescription[]>`
- **Auth:** Required. Returns list of analyzed job listings owned by `session.user.id`.

#### `deleteJob(jobId: string): Promise<ActionResult<boolean>>`
- **Auth:** Required. Enforces `WHERE id = jobId AND userId = session.user.id`.

---

### D. Skill Matching Actions (`src/server/actions/match.ts`)

#### `calculateMatch(jobId: string): Promise<ActionResult<MatchResult>>`
- **Auth:** Required.
- **Processing:** Retrieves user profile and target job description; passes payload to `AG-003: Skill Matching Agent`.
- **Output:**
  ```typescript
  {
    overallScore: number;          // 0 - 100
    matchedSkills: string[];
    missingSkills: string[];
    partialMatches: string[];
    scoreExplanation: string;
  }
  ```
- **Persistence:** Saved into `MatchResult` table linked to user, job, and profile.

---

### E. AI Resume Generation Actions (`src/server/actions/resumes.ts`)

#### `generateTailoredResume(params: { jobId: string, templateName: string, title: string }): Promise<ActionResult<Resume>>`
- **Auth:** Required.
- **Processing:** Invokes `AG-004: Resume Generation Agent` using the user's profile and matching results. Prohibits hallucination or unverified credentials.
- **Output:** New `Resume` record with structured JSON content, auto-generated LaTeX source, and initial `ResumeVersion`.

#### `updateResumeContent(resumeId: string, contentJson: any): Promise<ActionResult<Resume>>`
- **Auth:** Required. Allows manual section-level edits by the candidate.

#### `duplicateResume(resumeId: string): Promise<ActionResult<Resume>>`
- **Auth:** Required. Clones an existing resume with new timestamp.

---

## 3. Dedicated Route Handlers (`/api/...`)

### `POST /api/export/latex`
- **Auth:** Session cookie required.
- **Payload:** `{ resumeId: string }`.
- **Response:** Downloadable ZIP file containing `main.tex`, moderncv/awesome-cv style class files, and associated assets.

### `POST /api/export/overleaf`
- **Auth:** Session cookie required.
- **Payload:** `{ resumeId: string }`.
- **Mechanism:** Generates a standard HTML form submission to `https://www.overleaf.com/docs` with `snip_uri` or direct base64 `snip` data using official Overleaf documented form ingestion.

### `POST /api/export/pdf`
- **Auth:** Session cookie required.
- **Payload:** `{ resumeId: string }`.
- **Response:** Binary PDF stream (`Content-Type: application/pdf; Content-Disposition: attachment; filename="resume.pdf"`).

---

## 4. Error Handling & Standard Responses

All Server Actions return a consistent discriminated union type:
```typescript
export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: "UNAUTHORIZED" | "NOT_FOUND" | "VALIDATION_ERROR" | "AGENT_ERROR" };
```


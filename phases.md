# CAREERFORGE — PHASE-WISE DEVELOPMENT PLAN

## PHASE 0 — Project Discovery and Architecture

**Objective:** Understand the existing workspace and establish the technical blueprint before implementation.

Tasks:
- Inspect the complete project workspace.
- Identify existing files, dependencies and framework.
- Check Git configuration and repository status.
- Inspect Neon PostgreSQL project configuration.
- Check whether Better Auth is configured.
- Check whether database connectivity exists.
- Identify existing UI and backend implementation.
- Finalize the application architecture.
- Define database entities and relationships.
- Define module boundaries and API conventions.
- Design the multi-agent architecture at a conceptual level.

Documentation to establish:
- PROJECT_CONTEXT.md
- ARCHITECTURE.md
- DATABASE_DESIGN.md
- API_SPECIFICATION.md
- AGENT_ARCHITECTURE.md
- DEVELOPMENT_ROADMAP.md
- PHASE_STATUS.md

**Deliverable:** Approved architecture and development blueprint.

**Acceptance criteria:**
- Existing implementation is understood.
- Technology choices are justified.
- Database relationships are documented.
- Development phases and dependencies are finalized.

Do not implement application features in this phase.

---

## PHASE 1 — Application Foundation, Database and Authentication

**Objective:** Establish the working application foundation and secure multi-user functionality.

Tasks:
- Set up or verify Next.js application structure.
- Configure frontend and backend foundations.
- Connect Neon PostgreSQL.
- Configure Prisma if selected.
- Configure Better Auth after inspecting its current setup.
- Implement registration, login and logout.
- Implement secure server-side sessions.
- Implement protected routes.
- Create initial database migrations.
- Establish user-level data ownership.
- Configure environment variables securely.
- Establish a reusable UI component system.

Critical requirement:

Every user must have an independent account and must access only their own data.

Test:
- Register User A and User B.
- Log in independently.
- Verify session management.
- Verify database persistence.
- Verify that neither user can access the other's records.

**Deliverable:** A functioning application with secure authentication and a connected database.

---

## PHASE 2 — Career Profile Management

**Objective:** Build the central career profile used by all other modules.

Tasks:
- Personal information.
- Education history.
- Work experience.
- Internship experience.
- Technical skills.
- Soft skills.
- Projects.
- Certifications.
- Achievements.
- Portfolio and GitHub links.
- Target job roles.
- Profile completion indicator.
- Edit and update profile functionality.

Every profile section must persist in the database.

**Deliverable:** Users can create, edit and maintain their complete career profiles.

**Acceptance criteria:**
- Profile information survives logout and login.
- Different users have separate profiles.
- Profile data can be reused by future modules.

---

## PHASE 3 — Job Description Intelligence

**Objective:** Understand job descriptions and convert them into structured requirements.

Tasks:
- Paste job descriptions.
- Upload job descriptions where supported.
- Extract company and job title.
- Identify required skills.
- Identify preferred skills.
- Extract education requirements.
- Extract experience requirements.
- Identify responsibilities.
- Identify technical tools and technologies.
- Extract important keywords.
- Store analyzed job descriptions.
- Support multiple saved job descriptions.

**Deliverable:** A working job description analyzer.

**Acceptance criteria:**
- Job descriptions are converted into structured data.
- Users can view and edit saved job records.
- Records are private to their owners.

---

## PHASE 4 — Intelligent Skill Matching Engine

**Objective:** Compare a user's career profile against a selected job description.

Tasks:
- Match technical skills.
- Match soft skills.
- Compare educational qualifications.
- Compare experience requirements.
- Identify missing skills.
- Identify partial matches.
- Identify relevant projects and supporting evidence.
- Calculate a transparent compatibility score.
- Explain the score.
- Show skill gaps visually.
- Save matching results.

The matching engine must not invent skills or experience.

**Deliverable:** A job-specific skill matching dashboard.

**Acceptance criteria:**
- Every match has supporting profile evidence.
- Missing skills are correctly identified.
- Scoring logic is documented.
- Results are saved and retrievable.

---

## PHASE 5 — Resume Template Library

**Objective:** Build a professional resume template selection system.

Tasks:
- Design the resume template architecture.
- Create a collection of professional templates.
- Create template previews.
- Categorize templates.
- Support ATS-friendly layouts.
- Support different resume structures.
- Create reusable template components.
- Allow users to select and save their preferred templates.
- Maintain template versions.

**Deliverable:** A functional resume template gallery.

**Acceptance criteria:**
- Users can preview templates.
- Users can select templates.
- Template structure is reusable by the resume generation engine.

---

## PHASE 6 — AI-Powered Resume Generation

**Objective:** Generate job-specific resumes using the user's profile, job requirements and selected template.

Tasks:
- Retrieve the user's career profile.
- Retrieve the selected job description.
- Retrieve skill matching results.
- Retrieve the selected template.
- Generate tailored resume content.
- Optimize relevant keywords naturally.
- Improve project and experience descriptions.
- Maintain factual accuracy.
- Provide a resume preview.
- Allow section-level editing.
- Allow regeneration of selected sections.
- Save generated resumes.
- Maintain resume versions.

Important:
Never fabricate qualifications, skills, work experience, achievements or certifications.

**Deliverable:** A working AI resume builder.

**Acceptance criteria:**
- Resume generation uses actual user information.
- Generated content is relevant to the selected job.
- Users can edit and save resumes.
- Previous versions remain retrievable.

---

## PHASE 7 — Resume Export and Overleaf Integration

**Objective:** Allow users to export professional resumes in multiple formats.

Tasks:
- Generate PDF.
- Generate DOCX where supported.
- Generate LaTeX source.
- Create downloadable LaTeX source packages.
- Validate LaTeX output.
- Implement safe PDF compilation.
- Provide an officially supported Open in Overleaf workflow.
- Preserve the selected resume's formatting.
- Store generated files securely.

CareerForge must work even if the user does not have an Overleaf account.

Do not depend on undocumented Overleaf APIs.

**Deliverable:** A resume export system with Overleaf-compatible workflows.

**Acceptance criteria:**
- Exported files open correctly.
- Files belong to the correct user.
- LaTeX source is editable.
- Cross-user file access is prevented.

---

## PHASE 8 — Multi-Agent AI Architecture

**Objective:** Implement the specialized AI-agent system that powers CareerForge.

Initial agent registry:

- AG-001: Career Profile Agent.
- AG-002: Job Analyzer Agent.
- AG-003: Skill Matching Agent.
- AG-004: Resume Generation Agent.
- AG-005: Learning Roadmap Agent.
- AG-006: Template Agent.
- AG-007: Resume Quality Agent.
- AG-008: Interview Preparation Agent.
- AG-009: Application Tracking Agent.

Tasks:
- Create agent registry.
- Define stable agent IDs.
- Define agent responsibilities.
- Define versioned instructions.
- Define input and output schemas.
- Build central orchestrator.
- Implement context routing.
- Implement structured outputs.
- Implement validation and retries.
- Maintain execution logs.
- Implement provider-independent model gateway.
- Configure free, paid and local model options.
- Implement model fallback.
- Track token usage and costs.
- Establish permission boundaries.

The orchestrator should retrieve only the context needed for each operation.

For example, resume generation should receive the career profile, selected job requirements, matching results and selected template rather than the entire application history.

Agents should be reusable modules, not independent services by default.

**Deliverable:** A functional agent registry and orchestration system integrated with existing CareerForge modules.

**Acceptance criteria:**
- Agents resolve correctly by ID.
- Correct instructions and context are loaded.
- Outputs follow defined schemas.
- Execution logs are stored.
- Model usage and errors can be monitored.

---

## PHASE 9 — Personalized Learning Roadmap

**Objective:** Help users improve their employability based on identified skill gaps.

Tasks:
- Retrieve missing skills from matching results.
- Prioritize skills based on job requirements.
- Recommend learning sequences.
- Suggest relevant learning resources.
- Recommend practical projects.
- Estimate learning effort where reasonable.
- Track learning progress.
- Mark completed skills.
- Update roadmap as skills improve.

**Deliverable:** A personalized learning dashboard.

**Acceptance criteria:**
- Roadmaps are linked to user profiles and job targets.
- Recommendations explain why a skill is important.
- Users can track progress.

---

## PHASE 10 — Resume Library and Job Application Tracker

**Objective:** Provide centralized management of resumes and applications.

Resume library:
- View saved resumes.
- Search and filter.
- View resume history.
- Duplicate a resume.
- Edit existing versions.
- Download previous versions.

Application tracker:
- Add company and job role.
- Record application date.
- Attach the resume used.
- Track application status.
- Add interview dates.
- Add notes.
- Record follow-up information.

**Deliverable:** Resume management and job application tracking modules.

**Acceptance criteria:**
- All records persist.
- Resumes are connected to the correct user.
- Application status can be updated.
- Historical records remain accessible.

---

## PHASE 11 — AI Interview Preparation

**Objective:** Help users prepare for specific job interviews.

Tasks:
- Generate job-specific questions.
- Generate technical questions.
- Generate HR questions.
- Generate resume-based questions.
- Generate coding practice questions where appropriate.
- Conduct mock interviews.
- Evaluate user answers.
- Provide constructive feedback.
- Identify improvement areas.
- Maintain interview practice history.

**Deliverable:** AI-powered interview preparation module.

**Acceptance criteria:**
- Questions are relevant to the selected role.
- Feedback is actionable.
- Practice history is stored per user.

---

## PHASE 12 — Security, Testing and Optimization

**Objective:** Validate the complete platform before production deployment.

Tasks:
- Unit testing.
- Integration testing.
- End-to-end testing.
- Authentication testing.
- Multi-user isolation testing.
- API authorization testing.
- Database integrity testing.
- File access security testing.
- AI output validation.
- Prompt injection protection.
- Error handling.
- Performance optimization.
- Database query optimization.
- Rate limiting.
- Logging and monitoring.
- Accessibility review.

Mandatory test:
Use multiple independent accounts and attempt unauthorized access to every major resource.

**Deliverable:** A tested and security-reviewed application.

**Acceptance criteria:**
- Critical workflows pass.
- User data isolation passes.
- No known critical security issues remain.
- Production build succeeds.
- Known limitations are documented.

---

## PHASE 13 — Deployment and Production Launch

**Objective:** Deploy CareerForge as a usable online application.

Tasks:
- Select production hosting.
- Configure production database.
- Configure environment variables.
- Configure domain and HTTPS.
- Deploy frontend and backend.
- Configure file storage.
- Configure database migrations.
- Configure CI/CD.
- Configure error monitoring.
- Configure application logging.
- Configure backups and recovery.
- Verify production authentication.
- Verify production data isolation.
- Verify all major user workflows.
- Monitor deployment performance and costs.

**Deliverable:** A publicly accessible production version of CareerForge.

**Acceptance criteria:**
- Users can register and log in.
- All core workflows function in production.
- Database persistence works.
- User information remains private.
- Production errors can be monitored.
- Backup and recovery strategy is documented.

---

# DEVELOPMENT GOVERNANCE

These rules apply to every phase.

1. Complete only one approved phase at a time.
2. Inspect existing code before changing it.
3. Do not rebuild functioning modules unnecessarily.
4. Define objectives before implementation.
5. Identify dependencies and affected files.
6. Do not make destructive changes without approval.
7. Test every implemented feature.
8. Update PHASE_STATUS.md.
9. Document completed work and outstanding issues.
10. Stop after each phase and wait for approval.

Each phase must have:
- Objective.
- Scope.
- Dependencies.
- Implementation plan.
- Database changes.
- Security considerations.
- Testing plan.
- Acceptance criteria.
- Completion report.

Never mark a phase complete simply because code has been generated.

# FINAL PRODUCT EXPECTATION

CareerForge should become a complete AI-powered career intelligence platform where a user can maintain their professional profile, analyze job opportunities, understand skill gaps, generate tailored resumes, export documents, improve their skills, prepare for interviews and track applications.

All capabilities should be integrated through a secure, persistent and modular architecture.

The final application must be functional, maintainable, secure and deployable—not just a frontend prototype.
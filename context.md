# CAREERFORGE — MASTER PROJECT CONTEXT
## Complete Product Vision, Requirements and Technical Direction

## 1. Project Introduction

CareerForge is an AI-powered career intelligence and professional development platform designed primarily for college students, fresh graduates and job seekers.

The main objective is to create a single platform that helps individuals understand their current career capabilities, identify suitable job opportunities, evaluate skill gaps, generate job-specific resumes and prepare themselves for employment.

CareerForge should not be just another resume builder or chatbot.

It should function as an intelligent career assistant that understands a user's career background, evaluates job requirements, provides personalized recommendations and helps the user continuously improve their employability.

The platform should eventually support multiple users independently and have the architectural foundation to evolve into a scalable SaaS product.

## 2. The Problem We Are Solving

Students and job seekers commonly face these problems:

- They do not know how to present their skills effectively.
- They use the same resume for different job applications.
- They struggle to understand job descriptions.
- They do not know which required skills they are missing.
- They find it difficult to identify what to learn next.
- They cannot easily measure how well their profile matches a particular job.
- They spend considerable time manually editing resumes.
- They lack a centralized place to manage resumes, job applications and career progress.
- Existing AI tools often require users to repeatedly explain their background and requirements.

CareerForge aims to address these problems through a connected, personalized and AI-assisted workflow.

## 3. Target Users

### Primary users
- Engineering and university students.
- Fresh graduates.
- Entry-level job seekers.
- Professionals looking to improve or change careers.

### Future users
- Experienced professionals.
- Universities and placement departments.
- Career development organizations.
- Recruitment and enterprise teams.

The initial product should prioritize students and fresh graduates while keeping future expansion in mind.

## 4. Core Product Vision

CareerForge should maintain a persistent career profile for every registered user.

Instead of repeatedly asking users for their information, the platform should use their saved profile as the foundation for career-related operations.

A user should be able to:

1. Register and create an account.
2. Build a comprehensive career profile.
3. Add education, skills, projects, experience and certifications.
4. Submit or paste a job description.
5. Understand the requirements of that job.
6. Compare their profile against the job requirements.
7. Identify matched, partially matched and missing skills.
8. Receive a personalized learning roadmap.
9. Select a resume template.
10. Generate a resume tailored to the selected job.
11. Review, edit and save the generated resume.
12. Export the resume in supported formats.
13. Prepare for interviews based on the selected job.
14. Track job applications and career progress.

All these features should work together rather than behave like disconnected tools.

## 5. Major Product Modules

The following are the intended product capabilities. They represent the complete vision, not an instruction to implement everything immediately.

### A. Authentication and User Management

A secure multi-user platform.

Requirements:
- User registration and login.
- Secure authentication sessions.
- Individual user accounts.
- User-specific data persistence.
- Profile management.
- Logout and account security.
- Proper authorization and privacy.

Every user must access only their own private information.

### B. Career Profile Management

Each user should have a structured career profile.

It should support:

- Personal and professional information.
- Education history.
- Work experience and internships.
- Technical skills.
- Soft skills.
- Projects.
- Certifications.
- Achievements.
- Relevant links and portfolios.
- Career interests and target roles.

The profile should become the central source of information for other modules.

Users should be able to update their information whenever their experience or skills change.

### C. Job Description Intelligence

Users should be able to paste or upload a job description.

The system should identify and structure:

- Job title.
- Company name, where available.
- Required skills.
- Preferred skills.
- Educational qualifications.
- Experience requirements.
- Responsibilities.
- Technical tools and technologies.
- Important keywords.
- Other eligibility conditions.

The system should convert unstructured job descriptions into useful structured information.

### D. Intelligent Skill Matching

Compare the user's saved career profile against a selected job description.

The system should identify:

- Matching skills.
- Partially matching skills.
- Missing skills.
- Required qualifications already satisfied.
- Missing qualifications.
- Relevant project and experience evidence.
- Areas requiring improvement.

Provide a transparent match score with an explanation of how it was calculated.

Do not fabricate experience or claim that a user possesses a skill without supporting profile evidence.

### E. Resume Builder and Template Library

A major feature of CareerForge.

Users should be able to select a professional resume template and generate a resume using:

- Saved career profile.
- Selected job description.
- Skill-match information.
- Relevant projects and experience.
- Selected resume template.

The generated resume should be tailored to the target job without inventing qualifications or achievements.

Expected capabilities:

- Professional resume templates.
- Template previews.
- Resume generation.
- Resume editing.
- Section-level editing.
- Resume version history.
- Saved resume library.
- PDF export.
- DOCX export where supported.
- LaTeX source generation where supported.

Templates should have consistent formatting and be suitable for professional job applications.

### F. Overleaf Integration

CareerForge should support an Overleaf-compatible workflow.

The intended experience:

1. Generate a resume using a LaTeX-based template.
2. Produce the corresponding LaTeX source.
3. Allow the user to download the source files.
4. Provide an officially supported Open in Overleaf workflow where possible.
5. Allow the user to continue editing the source in Overleaf.

CareerForge must remain functional without an Overleaf account.

Do not depend on undocumented or private Overleaf APIs.

### G. Personalized Learning Roadmap

Based on missing skills and target job requirements, the platform should suggest what the user needs to learn.

The roadmap should include:

- Missing skill.
- Why it matters for the target role.
- Recommended learning sequence.
- Relevant learning resources.
- Practical exercises or project suggestions.
- Progress tracking.
- Completion status.

Recommendations should be realistic and relevant to the user's current level.

### H. AI Interview Preparation

Users should be able to prepare for interviews based on their target job.

Possible capabilities:

- Technical questions.
- Programming questions.
- HR questions.
- Questions based on the user's resume.
- Job-specific questions.
- Answer evaluation.
- Feedback and improvement suggestions.
- Mock interview sessions.

### I. Job Application Tracker

Users should have a centralized place to track job applications.

Possible information:

- Company.
- Job role.
- Applied date.
- Resume version used.
- Application status.
- Interview dates.
- Notes.
- Follow-up reminders.

### J. Resume Quality Analysis

Evaluate generated or uploaded resumes for:

- Readability.
- Formatting consistency.
- Relevant keywords.
- Missing sections.
- Clarity of achievements.
- Grammar and language.
- Job-description relevance.

Provide actionable feedback.

Do not advertise an unofficial score as an actual score from a particular company's ATS.

## 6. Multi-Agent AI Architecture

One of the important differentiating ideas behind CareerForge is its multi-agent architecture.

Instead of using one general-purpose AI prompt for every task, the system should have specialized agents with defined responsibilities.

Each agent should have a stable unique identifier.

Initial conceptual agent registry:

| Agent ID | Agent name | Responsibility |
|---|---|---|
| AG-001 | Career Profile Agent | Understand and structure career information |
| AG-002 | Job Analyzer Agent | Analyze job descriptions |
| AG-003 | Skill Matching Agent | Evaluate job-profile compatibility |
| AG-004 | Resume Generation Agent | Generate tailored resumes |
| AG-005 | Learning Roadmap Agent | Recommend skill development plans |
| AG-006 | Template Agent | Manage template selection and structure |
| AG-007 | Resume Quality Agent | Review resume quality |
| AG-008 | Interview Preparation Agent | Generate and evaluate interview practice |
| AG-009 | Application Tracking Agent | Assist with application management |

These are initial conceptual agents. Their final boundaries should be established during architecture design.

### Agent Registry Requirements

Every agent should have:

- Unique agent ID.
- Agent name.
- Description.
- Defined responsibilities.
- Versioned system instructions.
- Input schema.
- Output schema.
- Supported tools.
- Model configuration.
- Permission boundaries.
- Error handling.
- Execution history.

### Context Routing Concept

A central orchestrator should identify the user's requested operation and route it to the appropriate agent.

For example:

When the user requests a tailored resume:

1. Identify the requested operation.
2. Resolve the relevant agent ID.
3. Load that agent's instructions.
4. Retrieve the user's relevant career profile.
5. Retrieve the selected job description.
6. Retrieve the selected resume template.
7. Execute the task.
8. Validate the output.
9. Save the generated result.
10. Return the result to the user.

The user should not need to explain their career background every time.

### Important Identifier Distinction

Use separate identifiers for:

- Agent ID: identifies an AI agent.
- Task ID: identifies an execution.
- Requirement ID: identifies a product requirement.
- Model ID: identifies an AI model.
- User ID: identifies a registered user.
- Resume ID: identifies a resume.

These identifiers must not be confused.

The system should support traceability between requirements, tasks, agent executions and generated outputs.

### Model Gateway

Design the AI integration so the platform is not permanently tied to a single AI provider.

Potential providers and execution options:

- Free or low-cost hosted models.
- Paid API models.
- Locally hosted Ollama models.
- Future model providers.

Model selection should consider task complexity, response quality, latency, availability and cost.

Support:
- Model configuration.
- Provider fallback.
- Error handling.
- Token usage tracking.
- Execution logs.
- Cost monitoring.
- Configurable model selection.

Do not assume that every agent needs a separate AI model. Agents may share models while maintaining separate instructions and responsibilities.

## 7. User Experience and Interface Direction

CareerForge should have a professional, modern and clean interface.

Design principles:

- Simple and intuitive navigation.
- Professional dashboard.
- Consistent typography.
- Restrained color palette.
- Clear information hierarchy.
- Responsive layouts.
- Accessible components.
- Useful loading, empty and error states.
- Minimal unnecessary decoration.

Avoid:
- Excessive gradients.
- Unnecessary animations.
- Decorative AI-generated images.
- Overcrowded dashboards.
- Fake statistics.
- Non-functional buttons.
- Placeholder features presented as completed features.

Every visible feature should eventually connect to a real workflow.

## 8. Data Ownership and Multi-User Architecture

CareerForge is intended to be a multi-user SaaS application.

Every registered user must have an independent account and private career data.

Example:

User A logs in and sees User A's profile, jobs, resumes and learning roadmaps.

User B logs in and sees User B's profile, jobs, resumes and learning roadmaps.

User A must never be able to access User B's information by changing an API ID or URL.

The backend must derive the authenticated user ID from a verified server-side session.

Implement ownership checks for every protected database operation.

Related resources, including resume versions and generated files, must also be protected.

## 9. Initial Technology Direction

The current preferred technology direction is:

| Layer | Preferred technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| UI | Tailwind CSS and reusable components |
| Backend | Next.js server-side APIs initially |
| Database | Neon PostgreSQL |
| ORM | Prisma, subject to existing implementation review |
| Authentication | Better Auth, subject to configuration verification |
| AI integration | Provider-independent model gateway |
| Agent orchestration | A suitable orchestration framework or lightweight custom orchestrator |
| Local AI | Ollama where appropriate |
| Resume generation | HTML/PDF/DOCX and LaTeX generation workflows |
| Deployment | Suitable managed hosting and cloud services |

Neon PostgreSQL has already been selected and a project has been created in the Singapore region.

Better Auth was selected during database onboarding, but the actual implementation must be inspected and verified.

This is a preferred direction, not permission to install every technology or introduce unnecessary dependencies.

Start with a modular monolith and evolve only when justified.

## 10. Security, Privacy and Reliability

Security must be part of the product from the beginning.

Requirements include:

- Secure authentication and sessions.
- Server-side authorization.
- User-level data isolation.
- Input validation.
- Secure secret management.
- Protected file access.
- Database constraints.
- Error handling.
- Logging without exposing sensitive information.
- Safe AI output validation.
- Protection against prompt injection and untrusted uploaded content.
- Account data export and deletion capabilities.

Never expose database credentials, API keys or authentication secrets in frontend code or public repositories.

## 11. Future Expansion

CareerForge should have room to expand into:

- University placement management.
- College-specific career dashboards.
- Enterprise career development.
- Recruitment workflow integrations.
- Advanced AI career recommendations.
- Skill assessment and certification integrations.
- Team and organization accounts.
- Subscription plans.
- Usage limits and billing.
- Advanced analytics.

These are future possibilities, not immediate implementation requirements.

## 12. Expected Final Product

The final goal is a functional, secure and deployable CareerForge platform.

A user should be able to register, build a persistent career profile, analyze a job description, understand their skill gaps, generate a professional job-specific resume, edit and export it, receive a learning roadmap, practice interviews and manage job applications.

The platform should preserve user data between sessions, provide independent user accounts and use specialized AI agents to execute career-related tasks.

It must be a working product rather than a collection of disconnected demonstrations.

## 13. Instructions for the AI Development Agent

You are acting as the technical architect and implementation assistant for CareerForge.

Treat this document as the master product context.

Important working rules:

1. Understand the complete product vision before proposing implementation.
2. Do not immediately start coding every module.
3. First inspect the actual workspace and existing implementation.
4. Identify what has already been configured, including Neon, authentication, database connection and dependencies.
5. Do not assume a service is connected merely because a project has been created.
6. Identify architectural risks and missing requirements.
7. Later, help divide the project into logical development phases.
8. Each phase must have clear objectives, dependencies and acceptance criteria.
9. Implement one approved phase at a time.
10. Test before marking any phase complete.
11. Maintain project documentation and development status.
12. Do not perform destructive changes without approval.
13. Do not unnecessarily replace working technologies or modules.
14. Prefer reliable, maintainable and cost-conscious implementation decisions.
15. Clearly distinguish implemented features from planned features.

**Current instruction: Do not begin full implementation yet. First understand this project overview. We will discuss the architecture and divide the work into development phases separately.**
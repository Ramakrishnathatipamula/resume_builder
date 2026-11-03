"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { SkillCategory } from "@prisma/client";

function calculateCompletionScore(profile: any): number {
  let score = 0;
  if (profile.fullName && (profile.email || profile.phone)) score += 15;
  if (profile.headline && profile.summary) score += 15;
  if (profile.targetRoles && profile.targetRoles.length > 0) score += 10;
  if (profile.educations && profile.educations.length > 0) score += 15;
  if (profile.experiences && profile.experiences.length > 0) score += 20;
  if (profile.skills && profile.skills.length >= 3) score += 15;
  if (profile.projects && profile.projects.length > 0) score += 10;
  return Math.min(score, 100);
}

export async function getProfileData() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return null;

  const userId = session.user.id;

  let profile = await db.profile.findUnique({
    where: { userId },
    include: {
      educations: { orderBy: { startDate: "desc" } },
      experiences: { orderBy: { startDate: "desc" } },
      projects: { orderBy: { createdAt: "desc" } },
      skills: { orderBy: { createdAt: "asc" } },
      certifications: { orderBy: { issueDate: "desc" } },
    },
  });

  if (!profile) {
    profile = await db.profile.create({
      data: {
        userId,
        fullName: session.user.name,
        email: session.user.email,
      },
      include: {
        educations: true,
        experiences: true,
        projects: true,
        skills: true,
        certifications: true,
      },
    });
  }

  const score = calculateCompletionScore(profile);
  if (score !== profile.completionScore) {
    profile = await db.profile.update({
      where: { id: profile.id },
      data: { completionScore: score },
      include: {
        educations: { orderBy: { startDate: "desc" } },
        experiences: { orderBy: { startDate: "desc" } },
        projects: { orderBy: { createdAt: "desc" } },
        skills: { orderBy: { createdAt: "asc" } },
        certifications: { orderBy: { issueDate: "desc" } },
      },
    });
  }

  return profile;
}

export async function updatePersonalInfo(data: {
  fullName: string;
  headline: string;
  summary: string;
  email?: string;
  phone?: string;
  location?: string;
  websiteUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  targetRoles: string[];
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const existing = await db.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      educations: true,
      experiences: true,
      projects: true,
      skills: true,
    },
  });

  if (!existing) throw new Error("Profile not found");

  const newProfileState = {
    ...existing,
    ...data,
  };
  const score = calculateCompletionScore(newProfileState);

  const updated = await db.profile.update({
    where: { userId: session.user.id },
    data: {
      fullName: data.fullName,
      headline: data.headline,
      summary: data.summary,
      email: data.email,
      phone: data.phone,
      location: data.location,
      websiteUrl: data.websiteUrl,
      githubUrl: data.githubUrl,
      linkedinUrl: data.linkedinUrl,
      targetRoles: data.targetRoles,
      completionScore: score,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: updated };
}

// ----------------------------------------------------
// EDUCATION ACTIONS
// ----------------------------------------------------
export async function addEducation(data: {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: string;
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) throw new Error("Profile not found");

  const edu = await db.education.create({
    data: {
      profileId: profile.id,
      institution: data.institution,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy,
      startDate: new Date(data.startDate),
      endDate: data.endDate && !data.isCurrent ? new Date(data.endDate) : null,
      isCurrent: data.isCurrent,
      gpa: data.gpa,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: edu };
}

export async function deleteEducation(id: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const edu = await db.education.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!edu || edu.profile.userId !== session.user.id) {
    throw new Error("Unauthorized or not found");
  }

  await db.education.delete({ where: { id } });
  revalidatePath("/dashboard/profile");
  return { success: true };
}

// ----------------------------------------------------
// EXPERIENCE ACTIONS
// ----------------------------------------------------
export async function addExperience(data: {
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  bullets: string[];
  technologies: string[];
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) throw new Error("Profile not found");

  const exp = await db.experience.create({
    data: {
      profileId: profile.id,
      company: data.company,
      title: data.title,
      location: data.location,
      startDate: new Date(data.startDate),
      endDate: data.endDate && !data.isCurrent ? new Date(data.endDate) : null,
      isCurrent: data.isCurrent,
      bullets: data.bullets,
      technologies: data.technologies,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: exp };
}

export async function deleteExperience(id: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const exp = await db.experience.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!exp || exp.profile.userId !== session.user.id) {
    throw new Error("Unauthorized or not found");
  }

  await db.experience.delete({ where: { id } });
  revalidatePath("/dashboard/profile");
  return { success: true };
}

// ----------------------------------------------------
// PROJECT ACTIONS
// ----------------------------------------------------
export async function addProject(data: {
  name: string;
  role?: string;
  description: string;
  demoUrl?: string;
  repoUrl?: string;
  bullets: string[];
  technologies: string[];
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) throw new Error("Profile not found");

  const proj = await db.project.create({
    data: {
      profileId: profile.id,
      name: data.name,
      role: data.role,
      description: data.description,
      demoUrl: data.demoUrl,
      repoUrl: data.repoUrl,
      bullets: data.bullets,
      technologies: data.technologies,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: proj };
}

export async function deleteProject(id: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const proj = await db.project.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!proj || proj.profile.userId !== session.user.id) {
    throw new Error("Unauthorized or not found");
  }

  await db.project.delete({ where: { id } });
  revalidatePath("/dashboard/profile");
  return { success: true };
}

// ----------------------------------------------------
// SKILL ACTIONS
// ----------------------------------------------------
export async function addSkill(data: {
  name: string;
  category: "TECHNICAL" | "SOFT" | "TOOL" | "LANGUAGE";
  level?: string;
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) throw new Error("Profile not found");

  const skill = await db.skill.create({
    data: {
      profileId: profile.id,
      name: data.name.trim(),
      category: data.category as SkillCategory,
      level: data.level || "Intermediate",
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: skill };
}

export async function deleteSkill(id: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const skill = await db.skill.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!skill || skill.profile.userId !== session.user.id) {
    throw new Error("Unauthorized or not found");
  }

  await db.skill.delete({ where: { id } });
  revalidatePath("/dashboard/profile");
  return { success: true };
}

// ----------------------------------------------------
// CERTIFICATION ACTIONS
// ----------------------------------------------------
export async function addCertification(data: {
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  url?: string;
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const profile = await db.profile.findUnique({ where: { userId: session.user.id } });
  if (!profile) throw new Error("Profile not found");

  const cert = await db.certification.create({
    data: {
      profileId: profile.id,
      name: data.name,
      issuer: data.issuer,
      issueDate: new Date(data.issueDate),
      credentialId: data.credentialId,
      url: data.url,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: cert };
}

export async function deleteCertification(id: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const cert = await db.certification.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!cert || cert.profile.userId !== session.user.id) {
    throw new Error("Unauthorized or not found");
  }

  await db.certification.delete({ where: { id } });
  revalidatePath("/dashboard/profile");
  return { success: true };
}

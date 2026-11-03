"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProfileData() {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session?.user) {
    return null;
  }

  const userId = session.user.id;

  let profile = await db.profile.findUnique({
    where: { userId },
    include: {
      educations: true,
      experiences: true,
      projects: true,
      skills: true,
      certifications: true,
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

  return profile;
}

export async function updateBasicProfile(data: {
  fullName: string;
  headline: string;
  summary: string;
  githubUrl?: string;
  linkedinUrl?: string;
  targetRoles: string[];
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const updated = await db.profile.update({
    where: { userId: session.user.id },
    data: {
      fullName: data.fullName,
      headline: data.headline,
      summary: data.summary,
      githubUrl: data.githubUrl,
      linkedinUrl: data.linkedinUrl,
      targetRoles: data.targetRoles,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: updated };
}

export async function addSkill(skillName: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) throw new Error("Profile not found");

  const newSkill = await db.skill.create({
    data: {
      profileId: profile.id,
      name: skillName.trim(),
      category: "TECHNICAL",
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: newSkill };
}

export async function removeSkill(skillId: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  await db.skill.delete({
    where: { id: skillId },
  });

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function addExperience(data: {
  company: string;
  title: string;
  startDate: Date;
  isCurrent: boolean;
  bullets: string[];
  technologies: string[];
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) throw new Error("Unauthorized");

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("Profile not found");

  const exp = await db.experience.create({
    data: {
      profileId: profile.id,
      company: data.company,
      title: data.title,
      startDate: data.startDate,
      isCurrent: data.isCurrent,
      bullets: data.bullets,
      technologies: data.technologies,
    },
  });

  revalidatePath("/dashboard/profile");
  return { success: true, data: exp };
}

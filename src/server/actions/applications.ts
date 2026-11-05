"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { ApplicationStatus } from "@prisma/client";

// ─── GET ALL APPLICATIONS FOR CURRENT USER ───────────────────────────────────
export async function getUserApplications() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated", data: [] };

  const apps = await db.application.findMany({
    where: { userId: session.user.id },
    include: {
      resume: {
        select: { id: true, targetRole: true, templateName: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return { success: true, data: apps };
}

// ─── CREATE APPLICATION ───────────────────────────────────────────────────────
export async function createApplication(input: {
  company: string;
  role: string;
  status?: ApplicationStatus;
  appliedDate?: string;
  resumeId?: string;
  notes?: string;
  interviewDate?: string;
}) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const app = await db.application.create({
    data: {
      userId: session.user.id,
      company: input.company.trim(),
      role: input.role.trim(),
      status: input.status ?? "WISHLIST",
      appliedDate: input.appliedDate ? new Date(input.appliedDate) : null,
      resumeId: input.resumeId || null,
      notes: input.notes?.trim() || null,
      interviewDate: input.interviewDate ? new Date(input.interviewDate) : null,
    },
  });

  return { success: true, data: app };
}

// ─── UPDATE APPLICATION STATUS / FIELDS ──────────────────────────────────────
export async function updateApplication(
  appId: string,
  updates: {
    status?: ApplicationStatus;
    appliedDate?: string | null;
    notes?: string | null;
    interviewDate?: string | null;
    resumeId?: string | null;
  }
) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  // Multi-tenant guard
  const existing = await db.application.findFirst({
    where: { id: appId, userId: session.user.id },
  });
  if (!existing) return { success: false, error: "Application not found." };

  const updated = await db.application.update({
    where: { id: appId },
    data: {
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.appliedDate !== undefined && {
        appliedDate: updates.appliedDate ? new Date(updates.appliedDate) : null,
      }),
      ...(updates.interviewDate !== undefined && {
        interviewDate: updates.interviewDate ? new Date(updates.interviewDate) : null,
      }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
      ...(updates.resumeId !== undefined && { resumeId: updates.resumeId || null }),
    },
  });

  return { success: true, data: updated };
}

// ─── DELETE APPLICATION ───────────────────────────────────────────────────────
export async function deleteApplication(appId: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const existing = await db.application.findFirst({
    where: { id: appId, userId: session.user.id },
  });
  if (!existing) return { success: false, error: "Application not found." };

  await db.application.delete({ where: { id: appId } });
  return { success: true };
}

// ─── GET USER'S RESUMES (for linking to applications) ────────────────────────
export async function getUserResumesForPicker() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, data: [] };

  const resumes = await db.resume.findMany({
    where: { userId: session.user.id },
    select: { id: true, targetRole: true, templateName: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return { success: true, data: resumes };
}

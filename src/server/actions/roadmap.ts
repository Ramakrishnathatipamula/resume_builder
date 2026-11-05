"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

// ─── GET ALL ROADMAP ITEMS FOR USER ─────────────────────────────────────────
export async function getUserRoadmap() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, data: [] };

  const items = await db.learningRoadmap.findMany({
    where: { userId: session.user.id },
    include: { job: { select: { title: true, company: true } } },
    orderBy: [
      { isCompleted: "asc" },
      { priority: "asc" },
      { createdAt: "desc" },
    ],
  });

  return { success: true, data: items };
}

// ─── TOGGLE COMPLETED ────────────────────────────────────────────────────────
export async function toggleRoadmapItem(itemId: string, isCompleted: boolean) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const existing = await db.learningRoadmap.findFirst({
    where: { id: itemId, userId: session.user.id },
  });
  if (!existing) return { success: false, error: "Item not found." };

  const updated = await db.learningRoadmap.update({
    where: { id: itemId },
    data: { isCompleted },
  });

  return { success: true, data: updated };
}

// ─── DELETE ROADMAP ITEM ─────────────────────────────────────────────────────
export async function deleteRoadmapItem(itemId: string) {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const existing = await db.learningRoadmap.findFirst({
    where: { id: itemId, userId: session.user.id },
  });
  if (!existing) return { success: false, error: "Item not found." };

  await db.learningRoadmap.delete({ where: { id: itemId } });
  return { success: true };
}

// ─── CLEAR ALL COMPLETED ─────────────────────────────────────────────────────
export async function clearCompletedRoadmapItems() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return { success: false, error: "Not authenticated" };

  await db.learningRoadmap.deleteMany({
    where: { userId: session.user.id, isCompleted: true },
  });

  return { success: true };
}

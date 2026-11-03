"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function getUserResumeHistory() {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) return [];

  const resumes = await db.resume.findMany({
    where: { userId: session.user.id },
    include: {
      job: true,
      matchResult: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return resumes;
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const envCheck = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
    betterAuthUrl: process.env.BETTER_AUTH_URL || "NOT_SET",
    nextPublicAppUrl: process.env.NEXT_PUBLIC_APP_URL || "NOT_SET",
    vercelUrl: process.env.VERCEL_URL || "NOT_SET",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  };

  let dbStatus = "unknown";
  let dbError = null;

  try {
    const res = await db.$queryRaw`SELECT 1 as connected`;
    dbStatus = "connected";
  } catch (err: any) {
    dbStatus = "failed";
    dbError = err?.message || String(err);
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: envCheck,
    db: {
      status: dbStatus,
      error: dbError,
    },
  });
}

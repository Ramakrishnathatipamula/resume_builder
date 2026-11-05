import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth.handler);

export async function GET(req: NextRequest) {
  try {
    return await handler.GET(req);
  } catch (err: any) {
    console.error("[BETTER_AUTH_GET_ERROR]:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handler.POST(req);
  } catch (err: any) {
    console.error("[BETTER_AUTH_POST_ERROR]:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}


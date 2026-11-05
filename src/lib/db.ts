import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Strip channel_binding=require if present in Neon URLs, as it causes Node/Prisma connection dropouts
function getCleanDatabaseUrl(): string | undefined {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;
  return rawUrl
    .replace(/[?&]channel_binding=[^&]+(&|$)/g, (match) => (match.startsWith("?") && match.endsWith("&") ? "?" : ""))
    .replace(/\?$/, "");
}

const dbUrl = getCleanDatabaseUrl();

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;


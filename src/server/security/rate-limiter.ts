export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  error?: string;
}

interface RateLimitBucket {
  timestamps: number[];
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitBucket>();

// Cleanup stale entries every 5 minutes (unref so it does not block process exit)
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateLimitStore.entries()) {
      bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < 60_000);
      if (bucket.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300_000);
  if (cleanupTimer && typeof cleanupTimer.unref === "function") {
    cleanupTimer.unref();
  }
}

/**
 * Sliding window rate limiter
 * @param key unique identifier (e.g. userId or IP)
 * @param limit maximum allowed requests within window
 * @param windowMs window size in milliseconds (defaults to 60,000ms = 1 minute)
 */
export function checkRateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  let bucket = rateLimitStore.get(key);

  if (!bucket) {
    bucket = { timestamps: [] };
    rateLimitStore.set(key, bucket);
  }

  // Filter timestamps outside current window
  bucket.timestamps = bucket.timestamps.filter((ts) => now - ts < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    const resetMs = windowMs - (now - oldest);
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetMs,
      error: `Rate limit exceeded. Please wait ${Math.ceil(resetMs / 1000)} seconds before trying again.`,
    };
  }

  bucket.timestamps.push(now);
  const remaining = limit - bucket.timestamps.length;

  return {
    allowed: true,
    limit,
    remaining,
    resetMs: windowMs,
  };
}

export function resetRateLimits(): void {
  rateLimitStore.clear();
}

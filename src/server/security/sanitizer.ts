/**
 * Prompt injection defense and input sanitization
 */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/gi,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/gi,
  /forget\s+(all\s+)?(previous|prior|above)\s+instructions/gi,
  /you\s+are\s+now\s+(in\s+)?(dan|developer|jailbreak|unrestricted)\s+mode/gi,
  /system\s*prompt\s*override/gi,
  /print\s+(the\s+)?(full\s+)?system\s+prompt/gi,
  /output\s+the\s+exact\s+system\s+instructions/gi,
  /repeat\s+(all\s+)?words\s+above/gi,
  /bypass\s+(all\s+)?security\s+checks/gi,
  /ignore\s+guardrails/gi,
];

export interface SanitizationResult {
  sanitized: string;
  hasSuspiciousContent: boolean;
  neutralizedPatternsCount: number;
}

/**
 * Sanitizes external text (such as raw job descriptions or candidate bullets)
 * before injecting into LLM system prompts.
 */
export function sanitizePromptInput(input: string): SanitizationResult {
  if (!input) {
    return { sanitized: "", hasSuspiciousContent: false, neutralizedPatternsCount: 0 };
  }

  // 1. Remove dangerous zero-width and invisible control characters
  let clean = input
    .replace(/[\u200B-\u200D\uFEFF\u0000-\u0008\u000E-\u001F]/g, "")
    .trim();

  let hasSuspiciousContent = false;
  let neutralizedCount = 0;

  // 2. Scan and neutralize known prompt injection vectors
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(clean)) {
      hasSuspiciousContent = true;
      neutralizedCount += 1;
      // Neutralize by quoting and tagging as neutralized text
      clean = clean.replace(pattern, "[DISARMED_SECURITY_FLAG: User attempt to override instructions neutralized]");
    }
  }

  return {
    sanitized: clean,
    hasSuspiciousContent,
    neutralizedPatternsCount: neutralizedCount,
  };
}

/**
 * Validates that an ID does not contain path traversal or injection characters
 */
export function isValidId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  // CUID or standard UUID / alphanumeric slug
  return /^[a-zA-Z0-9_-]{1,64}$/.test(id);
}


import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ModelRequestOptions {
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  modelOverride?: string;
}

export interface ModelResponse {
  rawText: string;
  modelUsed: string;
  durationMs: number;
  estimatedTokens: {
    input: number;
    output: number;
    total: number;
  };
}

const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite-preview",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
];

function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_APIKEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  return new GoogleGenerativeAI(apiKey);
}

function estimateTokens(text: string): number {
  if (!text) return 0;
  // Standard heuristic: 1 token ~= 4 characters for English / technical text
  return Math.ceil(text.length / 4);
}

export function cleanAndParseJson<T>(rawText: string): T {
  let clean = rawText.trim();
  if (clean.startsWith("```json")) clean = clean.slice(7);
  else if (clean.startsWith("```")) clean = clean.slice(3);
  if (clean.endsWith("```")) clean = clean.slice(0, -3);
  clean = clean.trim();

  // 1. Try direct JSON parse
  try {
    return JSON.parse(clean) as T;
  } catch (initialErr) {
    // 2. Repair unescaped backslashes commonly produced in LaTeX strings
    try {
      const withFixedSlashes = clean.replace(
        /(\\+)([^"\\\/bfnrtu]|u(?![\da-fA-F]{4})|$)/g,
        (match, slashes, nextChar) => {
          if (slashes.length % 2 === 1) {
            return slashes + "\\" + nextChar;
          }
          return match;
        }
      );
      return JSON.parse(withFixedSlashes) as T;
    } catch (secondErr) {
      // 3. Repair unescaped literal control characters (newlines/tabs) inside string values
      try {
        let inString = false;
        let escaped = false;
        let sanitized = "";
        for (let i = 0; i < clean.length; i++) {
          const ch = clean[i];
          if (ch === '"' && !escaped) {
            inString = !inString;
            sanitized += ch;
          } else if (inString) {
            if (ch === "\n") sanitized += "\\n";
            else if (ch === "\r") sanitized += "\\r";
            else if (ch === "\t") sanitized += "\\t";
            else if (ch === "\\" && !escaped) {
              escaped = true;
              sanitized += ch;
            } else {
              escaped = false;
              sanitized += ch;
            }
          } else {
            sanitized += ch;
          }
        }
        const withFixedSlashes2 = sanitized.replace(
          /(\\+)([^"\\\/bfnrtu]|u(?![\da-fA-F]{4})|$)/g,
          (match, slashes, nextChar) => {
            if (slashes.length % 2 === 1) {
              return slashes + "\\" + nextChar;
            }
            return match;
          }
        );
        return JSON.parse(withFixedSlashes2) as T;
      } catch (thirdErr) {
        console.error(
          "[ModelGateway] JSON parse failure despite multiple escape repairs:",
          (initialErr as any)?.message
        );
        throw initialErr;
      }
    }
  }
}

export class ModelGateway {
  private static instance: ModelGateway;

  private constructor() {}

  public static getInstance(): ModelGateway {
    if (!ModelGateway.instance) {
      ModelGateway.instance = new ModelGateway();
    }
    return ModelGateway.instance;
  }

  public async generate(
    systemPrompt: string,
    userPrompt: string,
    options: ModelRequestOptions = {}
  ): Promise<ModelResponse> {
    const genAI = getGenAI();
    const startTime = Date.now();
    const combinedPrompt = `${systemPrompt}\n\n=== USER INPUT ===\n${userPrompt}`;
    const inputTokens = estimateTokens(combinedPrompt);

    const modelsToTry = options.modelOverride
      ? [options.modelOverride, ...FALLBACK_MODELS.filter((m) => m !== options.modelOverride)]
      : FALLBACK_MODELS;

    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: options.temperature ?? 0.2,
            maxOutputTokens: options.maxOutputTokens ?? 8192,
            responseMimeType: options.responseMimeType ?? "application/json",
          },
        });

        const result = await model.generateContent(combinedPrompt);
        const rawText = result.response.text();
        const durationMs = Date.now() - startTime;
        const outputTokens = estimateTokens(rawText);

        return {
          rawText,
          modelUsed: modelName,
          durationMs,
          estimatedTokens: {
            input: inputTokens,
            output: outputTokens,
            total: inputTokens + outputTokens,
          },
        };
      } catch (err: any) {
        console.warn(`[ModelGateway] Model ${modelName} failed (${err?.message || err}). Trying fallback...`);
        lastError = err;
      }
    }

    throw lastError || new Error("All AI model gateways failed to respond.");
  }

  public async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    options: ModelRequestOptions = {}
  ): Promise<{ data: T; meta: ModelResponse }> {
    const response = await this.generate(systemPrompt, userPrompt, {
      ...options,
      responseMimeType: "application/json",
    });

    const parsed = cleanAndParseJson<T>(response.rawText);
    return {
      data: parsed,
      meta: response,
    };
  }
}

export const modelGateway = ModelGateway.getInstance();


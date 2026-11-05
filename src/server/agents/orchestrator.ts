import { AgentContext, AgentExecutionResult, AgentId } from "./types";
import { getAgentById } from "./registry";
import { modelGateway } from "./gateway";
import { recordExecutionLog } from "./logger";
import { checkRateLimit, sanitizePromptInput } from "../security";

export class CentralOrchestrator {
  private static instance: CentralOrchestrator;

  private constructor() {}

  public static getInstance(): CentralOrchestrator {
    if (!CentralOrchestrator.instance) {
      CentralOrchestrator.instance = new CentralOrchestrator();
    }
    return CentralOrchestrator.instance;
  }

  /**
   * Executes a specialized AI Agent through the central orchestrator
   * with rate limiting, prompt sanitization, context boundaries, structured output parsing, metrics tracking, and audit logging.
   */
  public async executeAgent<TInput = any, TOutput = any>(
    agentId: AgentId,
    context: AgentContext<TInput>,
    promptTemplate: (input: TInput) => string
  ): Promise<AgentExecutionResult<TOutput>> {
    const agent = getAgentById(agentId);
    const startTime = Date.now();
    let retriesCount = 0;
    const maxRetries = context.options?.maxRetries ?? 2;

    // 1. Rate limiting guard (per user if userId provided)
    if (context.userId) {
      const rateCheck = checkRateLimit(context.userId, 25, 60_000);
      if (!rateCheck.allowed) {
        const errorMsg = rateCheck.error || "Rate limit exceeded. Please wait a moment.";
        recordExecutionLog({
          agentId: agent.id,
          agentName: agent.name,
          timestamp: new Date().toISOString(),
          success: false,
          durationMs: 0,
          modelUsed: "rate-limited",
          estimatedTokens: 0,
          error: errorMsg,
        });

        return {
          agentId: agent.id,
          agentName: agent.name,
          version: agent.version,
          success: false,
          error: errorMsg,
          metrics: {
            durationMs: 0,
            modelUsed: "rate-limited",
            estimatedTokens: { input: 0, output: 0, total: 0 },
            retriesCount: 0,
          },
          timestamp: new Date().toISOString(),
        };
      }
    }

    // 2. Optional input validation
    if (agent.inputValidator) {
      const validation = agent.inputValidator(context.data);
      if (!validation.valid) {
        const errorMsg = `Input validation failed for agent ${agentId}: ${validation.error}`;
        recordExecutionLog({
          agentId: agent.id,
          agentName: agent.name,
          timestamp: new Date().toISOString(),
          success: false,
          durationMs: 0,
          modelUsed: "none",
          estimatedTokens: 0,
          error: errorMsg,
        });

        return {
          agentId: agent.id,
          agentName: agent.name,
          version: agent.version,
          success: false,
          error: errorMsg,
          metrics: {
            durationMs: 0,
            modelUsed: "none",
            estimatedTokens: { input: 0, output: 0, total: 0 },
            retriesCount: 0,
          },
          timestamp: new Date().toISOString(),
        };
      }
    }

    // 3. Prompt generation & injection sanitization
    const rawUserPrompt = promptTemplate(context.data);
    const { sanitized: userPrompt, hasSuspiciousContent } = sanitizePromptInput(rawUserPrompt);
    if (hasSuspiciousContent) {
      console.warn(`[SECURITY AUDIT] Neutralized prompt injection attempt during dispatch of ${agentId}`);
    }

    let lastError: any = null;

    while (retriesCount <= maxRetries) {
      try {
        const { data, meta } = await modelGateway.generateStructured<TOutput>(
          agent.systemInstructions,
          userPrompt,
          {
            temperature: context.options?.temperatureOverride ?? agent.temperature ?? 0.2,
            modelOverride: context.options?.modelOverride,
          }
        );

        // Optional output validation
        if (agent.outputValidator) {
          const outValidation = agent.outputValidator(data);
          if (!outValidation.valid) {
            throw new Error(`Output validation failed for agent ${agentId}: ${outValidation.error}`);
          }
        }

        const durationMs = Date.now() - startTime;

        recordExecutionLog({
          agentId: agent.id,
          agentName: agent.name,
          timestamp: new Date().toISOString(),
          success: true,
          durationMs,
          modelUsed: meta.modelUsed,
          estimatedTokens: meta.estimatedTokens.total,
        });

        return {
          agentId: agent.id,
          agentName: agent.name,
          version: agent.version,
          success: true,
          data,
          metrics: {
            durationMs,
            modelUsed: meta.modelUsed,
            estimatedTokens: meta.estimatedTokens,
            retriesCount,
          },
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        lastError = err;
        retriesCount += 1;
        console.warn(
          `[Orchestrator] Agent ${agentId} execution attempt ${retriesCount} failed:`,
          err?.message || err
        );
      }
    }

    const totalDuration = Date.now() - startTime;
    const errorMsg = lastError?.message || `Agent ${agentId} failed after ${maxRetries} retries.`;

    recordExecutionLog({
      agentId: agent.id,
      agentName: agent.name,
      timestamp: new Date().toISOString(),
      success: false,
      durationMs: totalDuration,
      modelUsed: "all-fallbacks-exhausted",
      estimatedTokens: 0,
      error: errorMsg,
    });

    return {
      agentId: agent.id,
      agentName: agent.name,
      version: agent.version,
      success: false,
      error: errorMsg,
      metrics: {
        durationMs: totalDuration,
        modelUsed: "none",
        estimatedTokens: { input: 0, output: 0, total: 0 },
        retriesCount,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export const orchestrator = CentralOrchestrator.getInstance();


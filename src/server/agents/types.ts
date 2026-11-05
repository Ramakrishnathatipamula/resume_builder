// ─── AGENT IDENTIFIERS & ROLES ─────────────────────────────────────────────
export type AgentId =
  | "AG-001" // Career Profile Agent
  | "AG-002" // Job Analyzer Agent
  | "AG-003" // Skill Matching Agent
  | "AG-004" // Resume Generation Agent
  | "AG-005" // Learning Roadmap Agent
  | "AG-006" // Template Agent
  | "AG-007" // Resume Quality Agent
  | "AG-008" // Interview Preparation Agent
  | "AG-009"; // Application Tracking Agent

export type AgentPermission =
  | "read:profile"
  | "write:profile"
  | "read:job"
  | "write:job"
  | "read:resume"
  | "write:resume"
  | "read:interview"
  | "write:interview"
  | "read:application"
  | "write:application";

export interface AgentDefinition<TInput = any, TOutput = any> {
  id: AgentId;
  name: string;
  version: string;
  role: string;
  description: string;
  permissions: AgentPermission[];
  systemInstructions: string;
  defaultModelTier?: "fast" | "advanced";
  temperature?: number;
  inputValidator?: (input: TInput) => { valid: boolean; error?: string };
  outputValidator?: (output: TOutput) => { valid: boolean; error?: string };
}

export interface AgentContext<TInput = any> {
  userId?: string;
  sessionId?: string;
  data: TInput;
  options?: {
    modelOverride?: string;
    temperatureOverride?: number;
    maxRetries?: number;
  };
}

export interface AgentExecutionResult<TOutput = any> {
  agentId: AgentId;
  agentName: string;
  version: string;
  success: boolean;
  data?: TOutput;
  error?: string;
  metrics: {
    durationMs: number;
    modelUsed: string;
    estimatedTokens: {
      input: number;
      output: number;
      total: number;
    };
    retriesCount: number;
  };
  timestamp: string;
}

export interface ExecutionLogEntry {
  id: string;
  agentId: AgentId;
  agentName: string;
  timestamp: string;
  success: boolean;
  durationMs: number;
  modelUsed: string;
  estimatedTokens: number;
  error?: string;
}

export interface AgentMetrics {
  agentId: AgentId;
  agentName: string;
  totalCalls: number;
  successCount: number;
  errorCount: number;
  successRate: number; // 0 - 100%
  averageDurationMs: number;
  totalEstimatedTokens: number;
  lastExecutedAt?: string;
}

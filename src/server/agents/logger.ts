import { AgentId, AgentMetrics, ExecutionLogEntry } from "./types";

const MAX_LOGS = 500;
const executionLogs: ExecutionLogEntry[] = [];

export function recordExecutionLog(log: Omit<ExecutionLogEntry, "id">): ExecutionLogEntry {
  const entry: ExecutionLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...log,
  };

  executionLogs.unshift(entry);

  if (executionLogs.length > MAX_LOGS) {
    executionLogs.pop();
  }

  return entry;
}

export function getExecutionLogs(limit = 50, agentId?: AgentId): ExecutionLogEntry[] {
  if (agentId) {
    return executionLogs.filter((l) => l.agentId === agentId).slice(0, limit);
  }
  return executionLogs.slice(0, limit);
}

export function getAgentMetricsSummary(): AgentMetrics[] {
  const agentMap = new Map<AgentId, {
    agentName: string;
    total: number;
    success: number;
    error: number;
    totalDuration: number;
    tokens: number;
    lastExecutedAt?: string;
  }>();

  for (const log of executionLogs) {
    const existing = agentMap.get(log.agentId) || {
      agentName: log.agentName,
      total: 0,
      success: 0,
      error: 0,
      totalDuration: 0,
      tokens: 0,
      lastExecutedAt: log.timestamp,
    };

    existing.total += 1;
    if (log.success) {
      existing.success += 1;
    } else {
      existing.error += 1;
    }
    existing.totalDuration += log.durationMs;
    existing.tokens += log.estimatedTokens;

    if (!existing.lastExecutedAt || new Date(log.timestamp) > new Date(existing.lastExecutedAt)) {
      existing.lastExecutedAt = log.timestamp;
    }

    agentMap.set(log.agentId, existing);
  }

  const result: AgentMetrics[] = [];
  agentMap.forEach((val, id) => {
    result.push({
      agentId: id,
      agentName: val.agentName,
      totalCalls: val.total,
      successCount: val.success,
      errorCount: val.error,
      successRate: val.total > 0 ? Math.round((val.success / val.total) * 100) : 0,
      averageDurationMs: val.total > 0 ? Math.round(val.totalDuration / val.total) : 0,
      totalEstimatedTokens: val.tokens,
      lastExecutedAt: val.lastExecutedAt,
    });
  });

  return result.sort((a, b) => b.totalCalls - a.totalCalls);
}

export function clearExecutionLogs(): void {
  executionLogs.length = 0;
}

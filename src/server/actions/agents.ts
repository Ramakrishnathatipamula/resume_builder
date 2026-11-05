"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  getAllAgents,
  getExecutionLogs,
  getAgentMetricsSummary,
  AgentDefinition,
  ExecutionLogEntry,
  AgentMetrics,
} from "../agents";

export async function getAgentRegistryAction(): Promise<{
  success: boolean;
  agents: AgentDefinition[];
  metrics: AgentMetrics[];
  recentLogs: ExecutionLogEntry[];
  error?: string;
}> {
  const headerList = await headers();
  const session = await auth.api.getSession({ headers: headerList });
  if (!session?.user) {
    return {
      success: false,
      agents: [],
      metrics: [],
      recentLogs: [],
      error: "Unauthorized",
    };
  }

  const agents = getAllAgents();
  const metrics = getAgentMetricsSummary();
  const recentLogs = getExecutionLogs(25);

  return {
    success: true,
    agents,
    metrics,
    recentLogs,
  };
}

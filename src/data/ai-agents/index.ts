import { Course } from "../types";
import { agentFundamentalsModule } from "./01-agent-fundamentals";
import { toolUseModule } from "./02-tool-use";
import { agenticRagModule } from "./03-agentic-rag";
import { planningModule } from "./04-planning";
import { multiAgentModule } from "./05-multi-agent";
import { productionModule } from "./06-production";

export const aiAgentsCourse: Course = {
  id: "ai-agents",
  slug: "ai-agents",
  title: "AI Agents: From Basics to Production",
  description:
    "Master AI agent development from fundamentals to production. Learn agent architectures (ReAct, Plan-and-Execute), tool use, agentic RAG, multi-agent systems, memory, safety guardrails, and protocols like MCP and A2A. Based on Microsoft's AI Agents for Beginners and GenAI Agents.",
  icon: "\u{1F916}",
  tier: "pro",
  modules: [
    agentFundamentalsModule,
    toolUseModule,
    agenticRagModule,
    planningModule,
    multiAgentModule,
    productionModule,
  ],
};

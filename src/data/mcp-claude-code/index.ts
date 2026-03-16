import { Course } from "../types";
import { mcpFundamentalsModule } from "./01-mcp-fundamentals";
import { claudeCodeMasteryModule } from "./02-claude-code-mastery";
import { apiBridgesModule } from "./03-api-bridges";
import { obsidianMemoryModule } from "./04-obsidian-memory";
import { interviewPrepModule } from "./05-interview-prep";
import { mcpTransportsModule } from "./06-mcp-transports";
import { redisIdempotencyModule } from "./07-redis-idempotency";
import { productionArchitectureModule } from "./08-production-architecture";
import { interviewQaMasterclassModule } from "./09-interview-qa-masterclass";

export const mcpClaudeCodeCourse: Course = {
  id: "mcp-claude-code",
  slug: "mcp-claude-code",
  title: "Claude Code & MCP Integration",
  description:
    "Master the Model Context Protocol, Claude Code CLI, API bridges, Obsidian memory systems, transport internals, Redis idempotency patterns, production architecture, and interview Q&A masterclass. Targeted preparation for AI automation and Second Brain architecture roles.",
  icon: "\u{1F9E0}",
  tier: "pro",
  modules: [
    mcpFundamentalsModule,
    claudeCodeMasteryModule,
    apiBridgesModule,
    obsidianMemoryModule,
    interviewPrepModule,
    mcpTransportsModule,
    redisIdempotencyModule,
    productionArchitectureModule,
    interviewQaMasterclassModule,
  ],
};

import { Course } from "../types";
import { mcpFundamentalsModule } from "./01-mcp-fundamentals";
import { claudeCodeMasteryModule } from "./02-claude-code-mastery";
import { apiBridgesModule } from "./03-api-bridges";
import { obsidianMemoryModule } from "./04-obsidian-memory";
import { interviewPrepModule } from "./05-interview-prep";

export const mcpClaudeCodeCourse: Course = {
  id: "mcp-claude-code",
  slug: "mcp-claude-code",
  title: "Claude Code & MCP Integration",
  description:
    "Master the Model Context Protocol, Claude Code CLI, API bridges, and Obsidian memory systems. Targeted preparation for AI automation and Second Brain architecture roles.",
  icon: "\u{1F9E0}",
  modules: [
    mcpFundamentalsModule,
    claudeCodeMasteryModule,
    apiBridgesModule,
    obsidianMemoryModule,
    interviewPrepModule,
  ],
};

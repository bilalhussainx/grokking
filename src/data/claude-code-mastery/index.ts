import { Course } from "../types";
import { gettingStartedModule } from "./01-getting-started";
import { workflowsModule } from "./02-workflows";
import { skillsAgentsModule } from "./03-skills-agents";
import { codingPatternsModule } from "./04-coding-patterns";
import { advancedModule } from "./05-advanced";
import { productionModule } from "./06-production";

export const claudeCodeMasteryCourse: Course = {
  id: "claude-code-mastery",
  slug: "claude-code-mastery",
  title: "Claude Code Mastery",
  description:
    "Master Claude Code from installation to team-scale production. Learn workflows, skills, sub-agents, MCP integration, hooks, TDD, automated reviews, debugging, prompt engineering, and 40+ best practices. Based on Claude Code Best Practices and real-world usage patterns.",
  icon: "\u{26A1}",
  tier: "pro",
  modules: [
    gettingStartedModule,
    workflowsModule,
    skillsAgentsModule,
    codingPatternsModule,
    advancedModule,
    productionModule,
  ],
};

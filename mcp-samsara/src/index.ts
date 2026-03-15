#!/usr/bin/env node

/**
 * Samsara.ai MCP Server
 *
 * Exposes course-planning and lesson-planning skills as MCP tools.
 * Other agents can call these tools to generate course structures
 * and lesson content following Samsara.ai's methodology.
 *
 * Tools:
 *   samsara_plan_course  — Design a complete course skeleton
 *   samsara_plan_lesson  — Generate individual lesson content
 *   samsara_get_skill    — Read the raw skill file for a given skill
 *   samsara_list_domains — List all supported domains and variations
 *
 * Auth: API key via SAMSARA_API_KEY env var (optional, for future billing)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = resolve(__dirname, "../../skills");

// ─── Domain Registry ───

const DOMAIN_REGISTRY = {
  "computer-science": {
    variations: [
      "systems-programming", "web-development", "mobile-development",
      "ai-ml", "data-science", "devops-cloud", "interview-prep",
      "game-development", "security",
    ],
    teaching_archetype: "build-and-iterate",
    assessment_style: "code-execution",
  },
  "finance-business": {
    variations: [
      "personal-finance", "corporate-finance", "quantitative-finance",
      "accounting", "investment-banking", "entrepreneurship",
      "business-strategy", "fintech-blockchain",
    ],
    teaching_archetype: "case-study-driven",
    assessment_style: "scenario-analysis",
  },
  "economics": {
    variations: [
      "microeconomics", "macroeconomics", "behavioral-economics",
      "international-economics", "political-economy",
    ],
    teaching_archetype: "model-and-analyze",
    assessment_style: "graph-interpretation-and-essay",
  },
  "religious-studies": {
    variations: [
      "islam", "ahmadiyya-islam", "christianity", "judaism",
      "buddhism", "hinduism", "sikhism", "taoism",
      "confucianism", "sufism",
    ],
    teaching_archetype: "source-analysis-and-comparative",
    assessment_style: "primary-source-interpretation",
  },
  "philosophy": {
    variations: [
      "western-ancient", "western-modern", "eastern-philosophy",
      "ethics", "logic-critical-thinking", "political-philosophy",
      "philosophy-of-mind", "aesthetics",
    ],
    teaching_archetype: "socratic-dialogue",
    assessment_style: "argumentative-essay-and-debate",
  },
  "political-strategy": {
    variations: [
      "geopolitics", "international-relations", "campaign-strategy",
      "public-policy", "diplomacy-negotiation", "intelligence-analysis",
    ],
    teaching_archetype: "scenario-briefing",
    assessment_style: "policy-memo-and-simulation",
  },
  "health-wellness": {
    variations: [
      "mental-health", "physical-fitness", "nutrition",
      "sleep-science", "stress-management", "meditation-mindfulness",
      "sports-psychology", "holistic-health",
    ],
    teaching_archetype: "practice-and-reflect",
    assessment_style: "self-assessment-and-journaling",
  },
} as const;

// ─── Skill File Reader ───

function readSkillFile(skillName: string): string {
  const path = resolve(SKILLS_DIR, skillName, "SKILL.md");
  try {
    return readFileSync(path, "utf-8");
  } catch {
    throw new Error(`Skill file not found: ${path}`);
  }
}

// ─── Auth Check ───

function checkAuth(apiKey?: string): boolean {
  const requiredKey = process.env.SAMSARA_API_KEY;
  if (!requiredKey) return true; // No key configured = open access
  return apiKey === requiredKey;
}

// ─── MCP Server ───

const server = new McpServer({
  name: "samsara-skills",
  version: "1.0.0",
});

// Tool: List all supported domains and variations
server.tool(
  "samsara_list_domains",
  "List all supported course domains and their variations, teaching archetypes, and assessment styles",
  {},
  async () => {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(DOMAIN_REGISTRY, null, 2),
      }],
    };
  }
);

// Tool: Read raw skill file
server.tool(
  "samsara_get_skill",
  "Read the full skill file (course-planning or lesson-planning) with all instructions",
  {
    skill_name: z.enum(["course-planning", "lesson-planning"])
      .describe("Which skill file to read"),
  },
  async ({ skill_name }) => {
    const content = readSkillFile(skill_name);
    return {
      content: [{
        type: "text" as const,
        text: content,
      }],
    };
  }
);

// Tool: Plan a course skeleton
server.tool(
  "samsara_plan_course",
  `Design a complete course skeleton for the Samsara.ai platform.
Returns the course-planning skill instructions combined with the specific
course parameters. The calling agent should execute these instructions
to generate the Course TypeScript object.`,
  {
    title: z.string().describe("Course title, e.g., 'Islam: Foundations & Practice'"),
    domain: z.enum([
      "computer-science", "finance-business", "economics",
      "religious-studies", "philosophy", "political-strategy", "health-wellness",
    ]).describe("Primary domain for this course"),
    variation: z.string().describe("Specific variation within the domain, e.g., 'islam', 'web-development'"),
    level: z.enum(["beginner", "advanced"]).describe("Target education level"),
    description: z.string().optional().describe("Optional course description or special instructions"),
    prerequisites: z.array(z.string()).optional().describe("Course IDs that should be completed first"),
    api_key: z.string().optional().describe("Samsara API key for authenticated access"),
  },
  async ({ title, domain, variation, level, description, prerequisites, api_key }) => {
    if (!checkAuth(api_key)) {
      return {
        content: [{ type: "text" as const, text: "Error: Invalid API key" }],
        isError: true,
      };
    }

    const domainConfig = DOMAIN_REGISTRY[domain];
    if (!domainConfig.variations.includes(variation as never)) {
      return {
        content: [{
          type: "text" as const,
          text: `Error: Unknown variation '${variation}' for domain '${domain}'. Valid: ${domainConfig.variations.join(", ")}`,
        }],
        isError: true,
      };
    }

    const skillContent = readSkillFile("course-planning");

    const prompt = `# COURSE PLANNING ASSIGNMENT

Execute the course-planning skill below to design this course:

## Course Parameters
- **Title:** ${title}
- **Domain:** ${domain}
- **Variation:** ${variation}
- **Level:** ${level}
- **Teaching Archetype:** ${domainConfig.teaching_archetype}
- **Assessment Style:** ${domainConfig.assessment_style}
${description ? `- **Special Instructions:** ${description}` : ""}
${prerequisites?.length ? `- **Prerequisites:** ${prerequisites.join(", ")}` : "- **Prerequisites:** None (entry-level)"}

## Output Required
1. Course TypeScript object matching the Course interface
2. Module file structure (file names and exports)
3. Gamification config (XP, badges, checkpoints)
4. Voice persona assignment
5. Video content plan
6. Prerequisites and cross-references

---

${skillContent}`;

    return {
      content: [{
        type: "text" as const,
        text: prompt,
      }],
    };
  }
);

// Tool: Plan a lesson
server.tool(
  "samsara_plan_lesson",
  `Generate individual lesson content for a Samsara.ai course module.
Returns the lesson-planning skill instructions combined with the specific
lesson parameters. The calling agent should execute these instructions
to generate the Lesson TypeScript object.`,
  {
    course_id: z.string().describe("Course ID, e.g., 'islam-fundamentals'"),
    course_title: z.string().describe("Course title"),
    domain: z.enum([
      "computer-science", "finance-business", "economics",
      "religious-studies", "philosophy", "political-strategy", "health-wellness",
    ]).describe("Course domain"),
    variation: z.string().describe("Domain variation"),
    level: z.enum(["beginner", "advanced"]).describe("Education level"),
    module_id: z.string().describe("Module ID"),
    module_title: z.string().describe("Module title"),
    module_index: z.number().describe("Module position in course (0-based)"),
    lesson_title: z.string().describe("Title for this specific lesson"),
    lesson_index: z.number().describe("Lesson position in module (0-based)"),
    is_checkpoint: z.boolean().default(false).describe("Whether this is a checkpoint quiz lesson"),
    has_video: z.boolean().default(false).describe("Whether to generate a video script"),
    previous_lessons_summary: z.string().optional().describe("Summary of what prior lessons covered"),
    voice_persona: z.string().optional().describe("Voice persona name for coaching"),
    api_key: z.string().optional().describe("Samsara API key"),
  },
  async (params) => {
    if (!checkAuth(params.api_key)) {
      return {
        content: [{ type: "text" as const, text: "Error: Invalid API key" }],
        isError: true,
      };
    }

    const skillContent = readSkillFile("lesson-planning");

    const moduleContext = `# LESSON PLANNING ASSIGNMENT

Execute the lesson-planning skill below to generate this lesson:

## Module Context (YAML)
\`\`\`yaml
course_id: "${params.course_id}"
course_title: "${params.course_title}"
domain: "${params.domain}"
variation: "${params.variation}"
level: "${params.level}"
module_id: "${params.module_id}"
module_title: "${params.module_title}"
module_index: ${params.module_index}
lesson_title: "${params.lesson_title}"
lesson_index: ${params.lesson_index}
is_checkpoint: ${params.is_checkpoint}
has_video: ${params.has_video}
voice_persona: "${params.voice_persona || "Coach Alex"}"
previous_lessons_summary: "${params.previous_lessons_summary || "First lesson in module"}"
\`\`\`

## Output Required
1. TypeScript Lesson object: { id, slug, title, content, starterCode?, solutionCode? }
2. Lesson metadata (XP, difficulty, concepts, voice markers)
${params.is_checkpoint ? "3. Checkpoint quiz with 5-8 questions + voice summary config" : ""}
${params.has_video ? `${params.is_checkpoint ? "4" : "3"}. Video script YAML for Remotion pipeline` : ""}

---

${skillContent}`;

    return {
      content: [{
        type: "text" as const,
        text: moduleContext,
      }],
    };
  }
);

// ─── Start Server ───

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Samsara MCP Skills Server running on stdio");
}

main().catch(console.error);

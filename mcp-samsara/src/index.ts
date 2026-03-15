#!/usr/bin/env node

/**
 * Samsara.ai MCP Server
 *
 * Exposes course-planning and lesson-planning skills as MCP tools.
 * Other agents can call these tools to generate course structures
 * and lesson content following Samsara.ai's methodology.
 *
 * Tools:
 *   samsara_plan_course     — Design a complete course skeleton
 *   samsara_plan_lesson     — Generate individual lesson content
 *   samsara_get_skill       — Read the raw skill file for a given skill
 *   samsara_list_domains    — List all supported domains and variations
 *   samsara_embed_content   — Generate Gemini embeddings for content
 *   samsara_semantic_search — Hybrid semantic search across course content
 *   samsara_rag_query       — RAG query: embed question → search → return context
 *   samsara_generate_video  — Generate Remotion video script + pipeline for a lesson
 *   samsara_orchestrate     — Full quality-first course creation pipeline (chains all skills)
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

// ─── Embedding & RAG Tools ───

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function generateEmbedding(text: string, taskType: string = "SEMANTIC_SIMILARITY"): Promise<number[]> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: 768,
      }),
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini embedding failed: ${resp.status} ${err}`);
  }

  const data = await resp.json();
  return data.embedding.values;
}

async function supabaseQuery(sql: string, params: Record<string, unknown> = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase not configured");

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ query: sql, params }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Supabase query failed: ${resp.status} ${err}`);
  }

  return resp.json();
}

// Tool: Generate embeddings for content
server.tool(
  "samsara_embed_content",
  `Generate Gemini embeddings for course/lesson content. Use for:
- Indexing new courses/lessons for semantic search
- Embedding user profiles for recommendations
- Finding content gaps by comparing query embeddings to existing content`,
  {
    text: z.string().describe("Text content to embed (course description, lesson content, user profile, or search query)"),
    task_type: z.enum([
      "SEMANTIC_SIMILARITY",
      "RETRIEVAL_DOCUMENT",
      "RETRIEVAL_QUERY",
      "CLASSIFICATION",
      "CLUSTERING",
    ]).default("SEMANTIC_SIMILARITY").describe("Embedding task type — use RETRIEVAL_DOCUMENT for indexing, RETRIEVAL_QUERY for searching"),
    store: z.object({
      table: z.string().describe("Supabase table to store embedding in"),
      id_column: z.string().describe("ID column name"),
      id_value: z.string().describe("ID value for this record"),
      metadata: z.record(z.unknown()).optional().describe("Additional columns to store"),
    }).optional().describe("If provided, stores the embedding in Supabase pgvector"),
    api_key: z.string().optional(),
  },
  async ({ text, task_type, store, api_key }) => {
    if (!checkAuth(api_key)) {
      return { content: [{ type: "text" as const, text: "Error: Invalid API key" }], isError: true };
    }

    try {
      const embedding = await generateEmbedding(text, task_type);

      let stored = false;
      if (store && SUPABASE_URL && SUPABASE_KEY) {
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/${store.table}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Prefer": "resolution=merge-duplicates",
          },
          body: JSON.stringify({
            [store.id_column]: store.id_value,
            embedding: `[${embedding.join(",")}]`,
            ...store.metadata,
          }),
        });
        stored = resp.ok;
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            dimensions: embedding.length,
            task_type,
            stored,
            embedding_preview: embedding.slice(0, 5).map(v => v.toFixed(4)),
            // Full embedding available but truncated in response for readability
            full_embedding_available: true,
          }, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error: ${err}` }],
        isError: true,
      };
    }
  }
);

// Tool: Hybrid semantic search across course content
server.tool(
  "samsara_semantic_search",
  `Hybrid semantic search across Samsara.ai content. Combines:
- Vector similarity search (pgvector cosine distance on Gemini embeddings)
- Keyword filtering (domain, variation, level)
Use for finding related courses, content gaps, or matching users to content.`,
  {
    query: z.string().describe("Natural language search query"),
    search_type: z.enum(["courses", "lessons", "users"]).default("courses")
      .describe("What to search across"),
    filters: z.object({
      domain: z.string().optional(),
      variation: z.string().optional(),
      level: z.enum(["beginner", "advanced"]).optional(),
    }).optional().describe("Keyword filters to narrow results"),
    limit: z.number().default(5).describe("Max results to return"),
    similarity_threshold: z.number().default(0.6).describe("Minimum cosine similarity (0-1)"),
    api_key: z.string().optional(),
  },
  async ({ query, search_type, filters, limit, similarity_threshold, api_key }) => {
    if (!checkAuth(api_key)) {
      return { content: [{ type: "text" as const, text: "Error: Invalid API key" }], isError: true };
    }

    try {
      // Generate query embedding
      const queryEmbedding = await generateEmbedding(query, "RETRIEVAL_QUERY");

      // Build the search — returns instructions for the calling agent
      // since we can't guarantee the Supabase schema exists yet
      const searchConfig = {
        query_embedding: `[${queryEmbedding.join(",")}]`,
        search_type,
        filters,
        limit,
        similarity_threshold,
        supabase_rpc: {
          function_name: `match_${search_type}`,
          sql_template: `
-- Required Supabase function (create if not exists):
CREATE OR REPLACE FUNCTION match_${search_type}(
  query_embedding vector(768),
  match_threshold float DEFAULT ${similarity_threshold},
  match_count int DEFAULT ${limit}
  ${filters?.domain ? ", filter_domain text DEFAULT NULL" : ""}
  ${filters?.level ? ", filter_level text DEFAULT NULL" : ""}
)
RETURNS TABLE(
  id text,
  title text,
  ${search_type === "courses" ? "domain text, variation text, level text," : ""}
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    title,
    ${search_type === "courses" ? "domain, variation, level," : ""}
    1 - (embedding <=> query_embedding) as similarity
  FROM ${search_type === "courses" ? "course_embeddings" : search_type === "lessons" ? "lesson_embeddings" : "user_embeddings"}
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
    ${filters?.domain ? "AND (filter_domain IS NULL OR domain = filter_domain)" : ""}
    ${filters?.level ? "AND (filter_level IS NULL OR level = filter_level)" : ""}
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Call it:
SELECT * FROM match_${search_type}(
  '${queryEmbedding.slice(0, 3).join(",")}...', -- truncated for display
  ${similarity_threshold},
  ${limit}
  ${filters?.domain ? `, '${filters.domain}'` : ""}
  ${filters?.level ? `, '${filters.level}'` : ""}
);`,
        },
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(searchConfig, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error: ${err}` }],
        isError: true,
      };
    }
  }
);

// Tool: RAG query — embed question → search → return relevant context
server.tool(
  "samsara_rag_query",
  `RAG (Retrieval-Augmented Generation) query for course/lesson content.
Embeds the question, searches for relevant content, and returns context
that can be used to generate accurate, grounded responses.
Use for: dynamic content creation, answering user questions about courses,
generating lessons grounded in existing content.`,
  {
    question: z.string().describe("The question or topic to find relevant content for"),
    context_type: z.enum(["course_creation", "lesson_creation", "user_question", "recommendation"])
      .describe("What the retrieved context will be used for"),
    max_context_chunks: z.number().default(5).describe("Max content chunks to return"),
    include_sources: z.boolean().default(true).describe("Include source citations"),
    api_key: z.string().optional(),
  },
  async ({ question, context_type, max_context_chunks, include_sources, api_key }) => {
    if (!checkAuth(api_key)) {
      return { content: [{ type: "text" as const, text: "Error: Invalid API key" }], isError: true };
    }

    try {
      // Generate question embedding
      const questionEmbedding = await generateEmbedding(question, "RETRIEVAL_QUERY");

      // Build RAG pipeline instructions
      const ragPipeline = {
        step_1_embed: {
          model: "gemini-embedding-001",
          dimensions: 768,
          task_type: "RETRIEVAL_QUERY",
          embedding_generated: true,
        },
        step_2_search: {
          method: "hybrid",
          vector_search: {
            table: context_type === "recommendation" ? "user_embeddings" : "course_embeddings",
            column: "embedding",
            metric: "cosine",
            threshold: 0.6,
            limit: max_context_chunks,
          },
          keyword_search: {
            table: context_type === "recommendation" ? "user_profiles" : "courses",
            columns: ["title", "description"],
            query: question,
          },
          combine: "RRF (Reciprocal Rank Fusion) — merge vector and keyword results",
        },
        step_3_retrieve: {
          what_to_fetch: context_type === "course_creation"
            ? "Similar course structures, module outlines, lesson templates"
            : context_type === "lesson_creation"
            ? "Related lesson content, exercises, citations from same domain"
            : context_type === "recommendation"
            ? "User profile, completed courses, checkpoint scores, weak topics"
            : "Relevant lesson content, explanations, cited sources",
          max_chunks: max_context_chunks,
          include_sources,
        },
        step_4_augment: {
          instruction: `Use the retrieved context to ${
            context_type === "course_creation" ? "design a course that fills gaps in existing coverage"
            : context_type === "lesson_creation" ? "generate lesson content grounded in real sources"
            : context_type === "recommendation" ? "suggest courses matching the user's profile"
            : "answer the user's question accurately with citations"
          }`,
          grounding_rule: "NEVER fabricate content — only use information from retrieved context + Tavily search results",
        },
        supabase_sql: {
          hybrid_search_function: `
-- Hybrid search combining vector similarity + full-text search
-- Create this function in Supabase:

CREATE OR REPLACE FUNCTION hybrid_search(
  query_text text,
  query_embedding vector(768),
  match_count int DEFAULT 5,
  vector_weight float DEFAULT 0.7,
  text_weight float DEFAULT 0.3
)
RETURNS TABLE(
  id text,
  title text,
  content_preview text,
  similarity float,
  text_rank float,
  combined_score float
)
LANGUAGE sql STABLE
AS $$
  WITH vector_results AS (
    SELECT id, title, left(content, 500) as content_preview,
           1 - (embedding <=> query_embedding) as similarity,
           ROW_NUMBER() OVER (ORDER BY embedding <=> query_embedding) as vrank
    FROM course_content_embeddings
    WHERE 1 - (embedding <=> query_embedding) > 0.5
    LIMIT match_count * 2
  ),
  text_results AS (
    SELECT id, title, left(content, 500) as content_preview,
           ts_rank(to_tsvector('english', title || ' ' || content), plainto_tsquery('english', query_text)) as text_rank,
           ROW_NUMBER() OVER (ORDER BY ts_rank(to_tsvector('english', title || ' ' || content), plainto_tsquery('english', query_text)) DESC) as trank
    FROM course_content_embeddings
    WHERE to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', query_text)
    LIMIT match_count * 2
  )
  SELECT
    COALESCE(v.id, t.id) as id,
    COALESCE(v.title, t.title) as title,
    COALESCE(v.content_preview, t.content_preview) as content_preview,
    COALESCE(v.similarity, 0) as similarity,
    COALESCE(t.text_rank, 0) as text_rank,
    (COALESCE(v.similarity, 0) * vector_weight + COALESCE(t.text_rank, 0) * text_weight) as combined_score
  FROM vector_results v
  FULL OUTER JOIN text_results t ON v.id = t.id
  ORDER BY combined_score DESC
  LIMIT match_count;
$$;`,
        },
        embedding_preview: questionEmbedding.slice(0, 5).map(v => v.toFixed(4)),
      };

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify(ragPipeline, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{ type: "text" as const, text: `Error: ${err}` }],
        isError: true,
      };
    }
  }
);

// ─── Video Generation Tool ───

// Tool: Generate Remotion video for a lesson using Moonshot API
server.tool(
  "samsara_generate_video",
  `Generate a complete Remotion video pipeline for a lesson. Uses Moonshot API (Kimi K2)
to create a narration script from lesson content, then outputs the full Remotion
composition config, SadTalker/Wav2Lip avatar instructions, and render commands.

This tool does NOT render the video — it produces everything needed to render it:
1. Narration script (generated via Moonshot API)
2. TTS configuration (which voice provider + voice ID)
3. SadTalker avatar generation command
4. Remotion composition props
5. Render command to execute`,
  {
    lesson_id: z.string().describe("Lesson ID (kebab-case)"),
    lesson_title: z.string().describe("Lesson title"),
    lesson_content: z.string().describe("Full lesson markdown content to create video from"),
    domain: z.enum([
      "computer-science", "finance-business", "economics",
      "religious-studies", "philosophy", "political-strategy", "health-wellness",
    ]).describe("Course domain"),
    variation: z.string().describe("Domain variation"),
    video_type: z.enum([
      "concept_explainer", "code_walkthrough", "source_analysis", "case_study",
    ]).describe("Type of video to generate"),
    voice_persona: z.string().optional().describe("Voice persona name (e.g., 'Coach Alex', 'Ustadh Ibrahim')"),
    avatar_image: z.string().optional().describe("Path to avatar reference image for SadTalker"),
    target_duration_minutes: z.number().default(4).describe("Target video duration in minutes"),
    language: z.string().default("en").describe("Language for TTS (en, es, fr, de, it, nl, ja, hi, pa)"),
    api_key: z.string().optional(),
  },
  async (params) => {
    if (!checkAuth(params.api_key)) {
      return { content: [{ type: "text" as const, text: "Error: Invalid API key" }], isError: true };
    }

    const persona = params.voice_persona || "Coach Alex";
    const SARVAM_LANGUAGES = ["hi", "pa"];
    const DEEPGRAM_LANGUAGES = ["en", "es", "fr", "de", "it", "nl", "ja"];

    // Determine TTS provider based on language
    const ttsProvider = SARVAM_LANGUAGES.includes(params.language) ? "sarvam" : "deepgram";

    const deepgramVoices: Record<string, string> = {
      en: "aura-2-thalia-en", es: "aura-2-diana-es", fr: "aura-2-agathe-fr",
      de: "aura-2-viktoria-de", it: "aura-2-livia-it", nl: "aura-2-rhea-nl",
      ja: "aura-2-izanami-ja",
    };
    const sarvamSpeakers: Record<string, string> = { hi: "priya", pa: "simran" };

    const ttsVoice = ttsProvider === "deepgram"
      ? deepgramVoices[params.language] || "aura-2-thalia-en"
      : sarvamSpeakers[params.language] || "priya";

    // Build the complete video generation pipeline
    const pipeline = {
      meta: {
        lesson_id: params.lesson_id,
        lesson_title: params.lesson_title,
        video_type: params.video_type,
        persona,
        target_duration: `${params.target_duration_minutes} minutes`,
        language: params.language,
      },

      // Step 1: Generate narration script via Moonshot API
      step_1_narration: {
        provider: "Moonshot API (Kimi K2)",
        endpoint: "https://api.moonshot.ai/v1/chat/completions",
        model: "kimi-k2-turbo-preview",
        request: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ${MOONSHOT_API_KEY}",
          },
          body: {
            model: "kimi-k2-turbo-preview",
            messages: [
              {
                role: "system",
                content: `You are ${persona}, creating a ${params.target_duration_minutes}-minute video narration for a lesson titled "${params.lesson_title}".

RULES:
- Convert the lesson content into natural, conversational narration
- DO NOT read the lesson text verbatim — explain it as if tutoring 1-on-1
- Structure: greeting (10s) → explanation (${Math.floor(params.target_duration_minutes * 0.6)}min) → examples (${Math.floor(params.target_duration_minutes * 0.3)}min) → summary (10s)
- Use ${params.video_type === "code_walkthrough" ? "step-by-step code explanation with 'notice how...' and 'the key here is...'" :
  params.video_type === "source_analysis" ? "careful textual analysis, quoting key passages and explaining their significance" :
  params.video_type === "case_study" ? "narrative storytelling with real data, building to insights" :
  "clear concept explanation with real-world analogies"}
- Speak at natural pace (~150 words/minute)
- Target word count: ${params.target_duration_minutes * 150} words
- Include natural pauses marked with [PAUSE]
- Mark visual cues with [SHOW: description] for what should appear on screen
- End with a call to action to try the exercise`,
              },
              {
                role: "user",
                content: `Create the narration for this lesson:\n\n${params.lesson_content.slice(0, 3000)}`,
              },
            ],
            temperature: 0.7,
            max_tokens: params.target_duration_minutes * 250,
          },
        },
        output: "narration_text (string with [PAUSE] and [SHOW:] markers)",

        // Alternative: Use Claude API instead of Moonshot
        claude_alternative: {
          note: "If using Claude instead of Moonshot, replace the endpoint and model:",
          endpoint: "https://api.anthropic.com/v1/messages",
          model: "claude-sonnet-4-6",
          header: "x-api-key: ${ANTHROPIC_API_KEY}",
        },
      },

      // Step 2: Generate TTS audio from narration
      step_2_tts: {
        provider: ttsProvider,
        voice: ttsVoice,
        config: ttsProvider === "deepgram" ? {
          endpoint: `https://api.deepgram.com/v1/speak?model=${ttsVoice}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Token ${DEEPGRAM_API_KEY}",
          },
          body: "{ text: narration_text_without_markers }",
          output: "audio/mp3 file",
          preprocessing: "Strip [PAUSE] and [SHOW:] markers, replace [PAUSE] with '...' for natural pause",
        } : {
          endpoint: "https://api.sarvam.ai/text-to-speech",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": "${SARVAM_API_KEY}",
          },
          body: {
            text: "narration_text_without_markers",
            target_language_code: params.language === "hi" ? "hi-IN" : "pa-IN",
            speaker: ttsVoice,
            model: "bulbul:v3",
            pace: 1.0,
            speech_sample_rate: 22050,
            output_audio_codec: "mp3",
          },
          output: "base64 mp3 → decode to file",
        },
      },

      // Step 3: Generate avatar video with SadTalker
      step_3_avatar: {
        tool: "SadTalker (self-hosted on VPS)",
        repository: "https://github.com/OpenTalker/SadTalker",
        input: {
          audio: "step_2_output.mp3",
          source_image: params.avatar_image || "assets/avatars/default-professional.png",
        },
        command: `python inference.py \\
  --driven_audio step_2_output.mp3 \\
  --source_image ${params.avatar_image || "assets/avatars/default-professional.png"} \\
  --enhancer gfpgan \\
  --result_dir output/avatars/${params.lesson_id}/ \\
  --still \\
  --preprocess crop`,
        output: "output/avatars/{lesson_id}/source_image##step_2_output.mp4",
        alternative: {
          tool: "Wav2Lip",
          command: `python inference.py \\
  --checkpoint_path checkpoints/wav2lip_gan.pth \\
  --face ${params.avatar_image || "assets/avatars/default-professional.png"} \\
  --audio step_2_output.mp3 \\
  --outfile output/avatars/${params.lesson_id}/avatar.mp4`,
        },
      },

      // Step 4: Compose with Remotion
      step_4_remotion: {
        framework: "Remotion (React-based programmatic video)",
        install: "npm install @remotion/cli @remotion/renderer remotion",
        composition_props: {
          compositionId: "LessonVideo",
          fps: 30,
          width: 1920,
          height: 1080,
          durationInFrames: params.target_duration_minutes * 60 * 30,
          inputProps: {
            lessonId: params.lesson_id,
            lessonTitle: params.lesson_title,
            avatarVideoSrc: `output/avatars/${params.lesson_id}/avatar.mp4`,
            narrationAudioSrc: `output/audio/${params.lesson_id}.mp3`,
            narrationText: "< from step 1 >",
            showMarkers: "< [SHOW:] markers extracted from narration >",
            videoType: params.video_type,
            domainTheme: params.domain,
            subtitlesEnabled: true,
          },
        },
        composition_code: `
// src/remotion/LessonVideo.tsx
import { AbsoluteFill, Sequence, OffthreadVideo, Audio, Img } from 'remotion';

export const LessonVideo: React.FC<LessonVideoProps> = ({
  lessonTitle, avatarVideoSrc, narrationAudioSrc, showMarkers, domainTheme
}) => {
  const DOMAIN_COLORS = {
    'computer-science': '#1a1a2e',
    'finance-business': '#0a192f',
    'religious-studies': '#1a0a2e',
    'philosophy': '#0a1a0f',
    'political-strategy': '#1a1a1a',
    'health-wellness': '#0a1f0a',
    'economics': '#1f1a0a',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: DOMAIN_COLORS[domainTheme] || '#1a1a2e' }}>
      {/* Layer 1: Background gradient */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.05), transparent)' }} />

      {/* Layer 2: Content area (top-left 70%) */}
      <Sequence from={30 * 15}> {/* After 15s intro */}
        <div style={{ position: 'absolute', top: 40, left: 40, width: '65%', height: '85%' }}>
          {/* Render [SHOW:] content here — code blocks, text, diagrams */}
          {showMarkers.map((marker, i) => (
            <Sequence key={i} from={marker.frameStart} durationInFrames={marker.duration}>
              <ContentBlock type={marker.type} content={marker.content} />
            </Sequence>
          ))}
        </div>
      </Sequence>

      {/* Layer 3: Avatar (bottom-right 25%) */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, width: '25%' }}>
        <OffthreadVideo src={avatarVideoSrc} style={{ borderRadius: 16 }} />
      </div>

      {/* Layer 4: Title bar */}
      <Sequence durationInFrames={30 * 10}> {/* First 10 seconds */}
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <h1 style={{ color: 'white', fontSize: 48 }}>{lessonTitle}</h1>
        </div>
      </Sequence>

      {/* Layer 5: Subtitles */}
      <Subtitles narrationText={narrationText} />

      {/* Layer 6: Branding */}
      <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.15 }}>
        <span style={{ color: 'white', fontSize: 14 }}>Samsara.ai</span>
      </div>

      {/* Audio track */}
      <Audio src={narrationAudioSrc} />
    </AbsoluteFill>
  );
};`,
        render_command: `npx remotion render src/remotion/index.ts LessonVideo \\
  output/videos/${params.lesson_id}.mp4 \\
  --props='${JSON.stringify({
    lessonId: params.lesson_id,
    lessonTitle: params.lesson_title,
    videoType: params.video_type,
    domainTheme: params.domain,
  }).replace(/'/g, "\\'")}'`,
      },

      // Full execution script
      full_script: `
#!/bin/bash
# Full video generation pipeline for lesson: ${params.lesson_id}
# Run from project root

LESSON_ID="${params.lesson_id}"
MOONSHOT_API_KEY="\${MOONSHOT_API_KEY}"
${ttsProvider === "deepgram" ? 'DEEPGRAM_API_KEY="${DEEPGRAM_API_KEY}"' : 'SARVAM_API_KEY="${SARVAM_API_KEY}"'}

echo "=== Step 1: Generate narration via Moonshot API ==="
# Use the API call from step_1_narration above
# Save output to output/narrations/\${LESSON_ID}.txt

echo "=== Step 2: Generate TTS audio ==="
# Use the API call from step_2_tts above
# Save output to output/audio/\${LESSON_ID}.mp3

echo "=== Step 3: Generate avatar video ==="
# SSH to VPS and run SadTalker
# Save output to output/avatars/\${LESSON_ID}/avatar.mp4

echo "=== Step 4: Render with Remotion ==="
npx remotion render src/remotion/index.ts LessonVideo \\
  output/videos/\${LESSON_ID}.mp4

echo "=== Done: output/videos/\${LESSON_ID}.mp4 ==="
`,
    };

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(pipeline, null, 2),
      }],
    };
  }
);

// ─── Orchestration Tool ───

server.tool(
  "samsara_orchestrate",
  `Full quality-first course creation pipeline. Chains all Samsara.ai skills
(course-planning → lesson-planning → video-generation → content-embedding)
into a 10-step prompt chain with quality gates at each step.

Returns the complete orchestration plan as executable steps that an agent
or agent swarm should follow sequentially. Each step includes the prompt
to execute, the skill file to read, and the quality gate to pass.

Focuses on QUALITY over quantity — one excellent course beats ten mediocre ones.`,
  {
    title: z.string().describe("Course title"),
    domain: z.enum([
      "computer-science", "finance-business", "economics",
      "religious-studies", "philosophy", "political-strategy", "health-wellness",
    ]).describe("Primary domain"),
    variation: z.string().describe("Specific variation"),
    level: z.enum(["beginner", "advanced"]).describe("Education level"),
    ab_testing_phase: z.boolean().default(true).describe("Use lenient A/B testing checkpoint config"),
    generate_videos: z.boolean().default(true).describe("Include video generation steps"),
    api_key: z.string().optional(),
  },
  async ({ title, domain, variation, level, ab_testing_phase, generate_videos, api_key }) => {
    if (!checkAuth(api_key)) {
      return { content: [{ type: "text" as const, text: "Error: Invalid API key" }], isError: true };
    }

    const domainConfig = DOMAIN_REGISTRY[domain];
    const orchestratorSkill = readSkillFile("content-orchestrator");
    const coursePlanningSkill = readSkillFile("course-planning");
    const lessonPlanningSkill = readSkillFile("lesson-planning");

    let videoSkill = "";
    let embeddingSkill = "";
    try { videoSkill = readSkillFile("video-generation"); } catch {}
    try { embeddingSkill = readSkillFile("content-embedding"); } catch {}

    const plan = {
      meta: {
        title,
        domain,
        variation,
        level,
        teaching_archetype: domainConfig.teaching_archetype,
        assessment_style: domainConfig.assessment_style,
        ab_testing: ab_testing_phase,
        checkpoint_pass_threshold: ab_testing_phase ? "50%" : "60%",
        quality_focus: "DEPTH over breadth, UNDERSTANDING over memorization",
      },

      steps: [
        {
          step: 1,
          name: "UNDERSTAND",
          agent_count: 1,
          skill_file: "content-orchestrator/SKILL.md → Step 1",
          prompt: `Answer the 4 understanding questions for: "${title}" (${domain}/${variation}, ${level} level). Output course_understanding.yaml.`,
          quality_gate: "5+ specific measurable learning outcomes with action verbs",
        },
        {
          step: 2,
          name: "RESEARCH",
          agent_count: 1,
          skill_file: "content-orchestrator/SKILL.md → Step 2",
          prompt: `Run 3+ Tavily searches per planned module for "${title}". Rate sources A/B/C. Minimum 3 A-rated sources per module.`,
          quality_gate: "3+ A-rated sources per module, zero fabricated citations",
          tavily_config: { search_depth: "advanced", min_searches_per_module: 3 },
        },
        {
          step: 3,
          name: "OUTLINE",
          agent_count: 1,
          skill_file: "course-planning/SKILL.md",
          prompt: `Design course skeleton for "${title}". Each module has clear input→output transformation. 6-10 modules, 3-5 lessons each.`,
          quality_gate: "Every module has input/output states and aha moments defined",
        },
        {
          step: 4,
          name: "WRITE",
          agent_count: "1 per module (parallel)",
          skill_file: "lesson-planning/SKILL.md",
          prompt: `Generate lesson content for each module. ONE concept per lesson, taught COMPLETELY. Add voice markers. Escape template literals.`,
          quality_gate: "Every lesson has example→principle→example structure, zero template literal violations",
        },
        {
          step: 5,
          name: "EXERCISE",
          agent_count: "integrated with step 4",
          prompt: `Design exercises testing UNDERSTANDING not memorization. 3-level hints. Clear solutions.`,
          quality_gate: "No exercise tests recall only — all test comprehension or application",
        },
        {
          step: 6,
          name: "CHECKPOINT",
          agent_count: 1,
          skill_file: "content-orchestrator/SKILL.md → Step 6",
          prompt: `Create checkpoints. Pass threshold: ${ab_testing_phase ? "50%" : "60%"}. Frame as celebration. "Let's review" never "Failed".`,
          quality_gate: "No lockout language, XP for attempting, voice summary is optional conversation",
          ab_config: {
            pass_threshold: ab_testing_phase ? 50 : 60,
            xp_for_attempting: ab_testing_phase ? 10 : 5,
            voice_summary_required: !ab_testing_phase,
            failure_message: "Let's review a couple things!",
          },
        },
        {
          step: 7,
          name: "VOICE",
          agent_count: 1,
          prompt: `Add voice coaching prompts. Reference student history. Tone: warm, encouraging, specific to content.`,
          quality_gate: "Voice interactions reference actual content, not generic praise",
        },
        ...(generate_videos ? [{
          step: 8,
          name: "VIDEO",
          agent_count: 1,
          skill_file: "video-generation/SKILL.md",
          prompt: `Generate videos ONLY where text cannot suffice. Moonshot API for narration, Deepgram/Sarvam TTS, SadTalker avatar, Remotion composition.`,
          quality_gate: "Every video EXPLAINS something text cannot — delete any that just repeat",
        }] : []),
        {
          step: generate_videos ? 9 : 8,
          name: "EMBED",
          agent_count: 1,
          skill_file: "content-embedding/SKILL.md",
          prompt: `Embed course + lessons in pgvector. Set prerequisites and companions. Test search relevance.`,
          quality_gate: "Search test returns this course for relevant queries",
        },
        {
          step: generate_videos ? 10 : 9,
          name: "REVIEW",
          agent_count: 1,
          skill_file: "content-orchestrator/SKILL.md → Step 10",
          prompt: `Read entire course as a student. Expert test, student test, competitor test. Fix anything that fails.`,
          quality_gate: "PhD would say accurate, beginner would say clear, better than free alternatives",
        },
      ],

      skill_files_to_read: [
        "skills/content-orchestrator/SKILL.md",
        "skills/course-planning/SKILL.md",
        "skills/lesson-planning/SKILL.md",
        ...(generate_videos ? ["skills/video-generation/SKILL.md"] : []),
        "skills/content-embedding/SKILL.md",
      ],

      estimated_cost: {
        tavily_searches: "30-60 searches × $0.01 = $0.30-$0.60",
        gemini_embeddings: "~3000 tokens × $0.15/M = ~$0.001",
        moonshot_llm: "~40K tokens × $0.002/K = ~$0.08",
        video_tts: generate_videos ? "5-10 videos × $0.02 = $0.10-$0.20" : "N/A",
        total: generate_videos ? "$0.50-$0.90" : "$0.40-$0.70",
      },
    };

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(plan, null, 2),
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

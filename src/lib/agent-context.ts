// src/lib/agent-context.ts
// Unified context assembly for all AI agents.
// Builds a layered context (L0-L4) before every LLM call.
// Replaces the ad-hoc context building in coach/route.ts and agent-intelligence.ts.

import { createAdminSupabase } from "@/lib/supabase-auth";
import { getCurrentFacts, getCrossAgentInsights, formatFactsForPrompt } from "@/lib/knowledge-graph";
import { getRecentAgentMemories, searchAgentMemories, formatMemoriesForPrompt } from "@/lib/agent-memory-store";
import { generateEmbedding } from "@/lib/memory";
import type { AgentType } from "@/lib/agent-memory-store";
import type { KnowledgeFact } from "@/lib/knowledge-graph";

export interface AgentContext {
  // L0: Identity (~50 tokens)
  identity: {
    name: string;
    level: number;
    totalXP: number;
    streak: number;
    credits: number;
    nativeLanguage: string;
    learningStyle: string;
  };
  // L1: Knowledge graph facts (~150 tokens)
  facts: KnowledgeFact[];
  // L2: Agent-specific memories (~300 tokens)
  recentMemories: { role: string; content: string }[];
  relevantMemories: { role: string; content: string; similarity: number }[];
  // L3: Knowledge cache hits (~200 tokens)
  domainKnowledge: string[];
  // L4: Cross-agent insights (~100 tokens)
  crossInsights: KnowledgeFact[];

  // Pre-built prompt string — inject directly into system prompt
  promptContext: string;
}

/**
 * Build the full agent context for an LLM call.
 * This is the single entry point — replaces fetchUserIntelligence() for new agents.
 */
export async function buildAgentContext(
  userId: string,
  agentType: AgentType,
  query: string,
  opts?: {
    courseSlug?: string;
    companyId?: string;
    language?: string;
    sessionId?: string;
  }
): Promise<AgentContext> {
  // L0: User identity from user_profiles
  const identity = await getIdentity(userId);

  // L1: Current knowledge graph facts
  const facts = await getCurrentFacts(userId, { limit: 20 });

  // L2: Agent-specific memories
  const recentRaw = await getRecentAgentMemories(userId, agentType, 5);
  const recentMemories = recentRaw.map((m) => ({
    role: m.role,
    content: m.summary || m.content.slice(0, 200),
  }));

  let relevantMemories: { role: string; content: string; similarity: number }[] = [];
  if (query.length > 10) {
    const relevantRaw = await searchAgentMemories(userId, agentType, query, 3);
    relevantMemories = relevantRaw.map((m) => ({
      role: m.role,
      content: m.summary || m.content.slice(0, 200),
      similarity: m.similarity,
    }));
  }

  // L3: Knowledge cache (domain-specific data)
  let domainKnowledge: string[] = [];
  if (opts?.companyId || opts?.courseSlug || opts?.language) {
    domainKnowledge = await fetchDomainKnowledge(agentType, query, opts);
  }

  // L4: Cross-agent insights (facts from other agents, excluding current agent)
  const crossInsights = await getCrossAgentInsights(userId, agentType, 5);

  // Build the combined prompt string
  const promptContext = buildPromptString(
    identity,
    facts,
    recentMemories,
    relevantMemories,
    domainKnowledge,
    crossInsights
  );

  return {
    identity,
    facts,
    recentMemories,
    relevantMemories,
    domainKnowledge,
    crossInsights,
    promptContext,
  };
}

// --- Internal helpers ---

async function getIdentity(userId: string): Promise<AgentContext["identity"]> {
  let admin;
  try {
    admin = createAdminSupabase();
  } catch {
    return getDefaultIdentity();
  }

  const [profileResult, creditsResult, xpResult] = await Promise.all([
    admin
      .from("user_profiles")
      // Columns confirmed from agent-intelligence.ts: full_name, native_language,
      // learning_style, login_streak
      .select("full_name, native_language, learning_style, login_streak")
      .eq("id", userId)
      .single(),
    admin.rpc("get_credit_balance", { p_user_id: userId }),
    admin
      .from("xp_transactions")
      .select("xp_amount")
      .eq("user_id", userId)
      .limit(500),
  ]);

  const profile = profileResult.data;
  const credits = (creditsResult.data as number) || 0;
  const totalXP = (xpResult.data || []).reduce(
    (sum: number, r: { xp_amount: number }) => sum + (r.xp_amount || 0),
    0
  );

  return {
    name: profile?.full_name || "there",
    level: Math.floor(totalXP / 500) + 1,
    totalXP,
    streak: profile?.login_streak || 0,
    credits,
    nativeLanguage: profile?.native_language || "en",
    learningStyle: profile?.learning_style || "balanced",
  };
}

function getDefaultIdentity(): AgentContext["identity"] {
  return {
    name: "there",
    level: 1,
    totalXP: 0,
    streak: 0,
    credits: 0,
    nativeLanguage: "en",
    learningStyle: "balanced",
  };
}

async function fetchDomainKnowledge(
  agentType: AgentType,
  query: string,
  opts: { companyId?: string; courseSlug?: string; language?: string }
): Promise<string[]> {
  let admin;
  try {
    admin = createAdminSupabase();
  } catch {
    return [];
  }

  const embedding = await generateEmbedding(query);

  let domain = "domain_knowledge";
  let entity: string | null = null;

  if (agentType === "interviewer" && opts.companyId) {
    domain = "interview_patterns";
    entity = opts.companyId;
  } else if (agentType === "career_coach") {
    domain = "job_market";
  } else if (agentType === "university_coach") {
    domain = "university_stats";
  }

  const { data, error } = await admin.rpc("search_knowledge_cache", {
    p_domain: domain,
    p_entity: entity,
    p_embedding: embedding ? `[${embedding.join(",")}]` : null,
    p_limit: 3,
  });

  if (error || !data) return [];

  return (data as { content: string }[]).map((row) => row.content);
}

function buildPromptString(
  identity: AgentContext["identity"],
  facts: KnowledgeFact[],
  recentMemories: { role: string; content: string }[],
  relevantMemories: { role: string; content: string; similarity: number }[],
  domainKnowledge: string[],
  crossInsights: KnowledgeFact[]
): string {
  const parts: string[] = [];

  // L0: Identity
  parts.push(`## STUDENT PROFILE`);
  parts.push(
    `Name: ${identity.name} | Level ${identity.level} (${identity.totalXP} XP) | ${identity.streak}-day streak | ${identity.credits} credits`
  );
  if (identity.nativeLanguage !== "en") {
    parts.push(`Native language: ${identity.nativeLanguage}`);
  }

  // L1: Knowledge graph facts
  if (facts.length > 0) {
    parts.push(formatFactsForPrompt(facts));
  }

  // L2: Recent memories (chronological)
  if (recentMemories.length > 0) {
    parts.push(
      formatMemoriesForPrompt(
        recentMemories.map((m) => ({
          id: "",
          role: m.role,
          content: m.content,
          summary: null,
          metadata: {},
          similarity: 1.0,
          createdAt: "",
        })),
        "RECENT CONVERSATION HISTORY"
      )
    );
  }

  // L2b: Semantically relevant memories
  if (relevantMemories.length > 0) {
    parts.push(`## RELEVANT PAST CONVERSATIONS`);
    for (const m of relevantMemories) {
      const role = m.role === "user" ? "Student" : "Coach";
      parts.push(`- [${role}] ${m.content.slice(0, 150)}`);
    }
  }

  // L3: Domain knowledge
  if (domainKnowledge.length > 0) {
    parts.push(`## DOMAIN KNOWLEDGE (from real-world data)`);
    for (const dk of domainKnowledge) {
      parts.push(`- ${dk.slice(0, 300)}`);
    }
  }

  // L4: Cross-agent insights
  if (crossInsights.length > 0) {
    parts.push(`## INSIGHTS FROM OTHER COACHES`);
    for (const f of crossInsights) {
      parts.push(
        `- ${f.sourceAgent} observed: ${f.predicate} → ${f.object} (confidence: ${f.confidence})`
      );
    }
  }

  return parts.join("\n");
}

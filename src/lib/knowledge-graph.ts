// src/lib/knowledge-graph.ts
// CRUD operations for the user_knowledge_graph table.
// All writes use the admin client (service role) to bypass RLS.
// All reads filter by user_id for isolation.

import { createAdminSupabase } from "@/lib/supabase-auth";

export interface KnowledgeFact {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  sourceAgent: string;
  evidence: string | null;
  validFrom: string;
}

/**
 * Get all current (non-expired) facts for a user.
 * Optionally filter by predicate type or source agent.
 */
export async function getCurrentFacts(
  userId: string,
  opts?: {
    predicate?: string;
    sourceAgent?: string;
    limit?: number;
  }
): Promise<KnowledgeFact[]> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.rpc("get_current_facts", {
    p_user_id: userId,
    p_predicate: opts?.predicate ?? null,
    p_source_agent: opts?.sourceAgent ?? null,
    p_limit: opts?.limit ?? 50,
  });

  if (error) {
    console.error("[KnowledgeGraph] getCurrentFacts error:", error);
    return [];
  }

  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    subject: row.subject as string,
    predicate: row.predicate as string,
    object: row.object as string,
    confidence: row.confidence as number,
    sourceAgent: row.source_agent as string,
    evidence: row.evidence as string | null,
    validFrom: row.valid_from as string,
  }));
}

/**
 * Upsert a fact into the knowledge graph.
 * If the same (user, subject, predicate, object) triple exists and is active,
 * updates confidence and evidence. Otherwise inserts a new fact.
 */
export async function upsertFact(
  userId: string,
  fact: {
    subject: string;
    predicate: string;
    object: string;
    confidence?: number;
    sourceAgent: string;
    evidence?: string;
  }
): Promise<string | null> {
  const admin = createAdminSupabase();
  const { data, error } = await admin.rpc("upsert_fact", {
    p_user_id: userId,
    p_subject: fact.subject,
    p_predicate: fact.predicate,
    p_object: fact.object,
    p_confidence: fact.confidence ?? 1.0,
    p_source_agent: fact.sourceAgent,
    p_evidence: fact.evidence ?? null,
  });

  if (error) {
    console.error("[KnowledgeGraph] upsertFact error:", error);
    return null;
  }

  return data as string;
}

/**
 * Invalidate a fact (set valid_to = now).
 * Use when a fact is no longer true (e.g., user was weak_at X but now mastered it).
 */
export async function invalidateFact(factId: string): Promise<void> {
  const admin = createAdminSupabase();
  const { error } = await admin.rpc("invalidate_fact", {
    p_fact_id: factId,
  });

  if (error) {
    console.error("[KnowledgeGraph] invalidateFact error:", error);
  }
}

/**
 * Get facts from other agents about a user (cross-agent intelligence).
 * Excludes facts from the requesting agent to avoid circular reads.
 */
export async function getCrossAgentInsights(
  userId: string,
  excludeAgent: string,
  limit = 10
): Promise<KnowledgeFact[]> {
  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("user_knowledge_graph")
    .select("id, subject, predicate, object, confidence, source_agent, evidence, valid_from")
    .eq("user_id", userId)
    .is("valid_to", null)
    .neq("source_agent", excludeAgent)
    .order("confidence", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[KnowledgeGraph] getCrossAgentInsights error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    subject: row.subject,
    predicate: row.predicate,
    object: row.object,
    confidence: row.confidence,
    sourceAgent: row.source_agent,
    evidence: row.evidence,
    validFrom: row.valid_from,
  }));
}

/**
 * Format facts into a concise prompt string for LLM context injection.
 * Groups by predicate for readability.
 */
export function formatFactsForPrompt(facts: KnowledgeFact[]): string {
  if (facts.length === 0) return "";

  const grouped: Record<string, string[]> = {};
  for (const f of facts) {
    const key = f.predicate;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(`${f.object} (confidence: ${f.confidence}, via ${f.sourceAgent})`);
  }

  const lines: string[] = ["## KNOWLEDGE GRAPH (what we know about this student)"];
  for (const [predicate, objects] of Object.entries(grouped)) {
    lines.push(`- ${predicate}: ${objects.join(", ")}`);
  }
  return lines.join("\n");
}

// src/app/api/knowledge-cache/refresh/route.ts
// Background job endpoint for refreshing knowledge_cache via Tavily search.
// Called by cron or manually. Protected by API key.
// Searches for real-world data, embeds it, and upserts into knowledge_cache.

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase-auth";
import { generateEmbedding } from "@/lib/memory";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60s for batch operations

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

async function tavilySearch(query: string, maxResults = 5): Promise<TavilyResult[]> {
  if (!TAVILY_API_KEY) {
    console.warn("[KnowledgeCache] No TAVILY_API_KEY set");
    return [];
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      max_results: maxResults,
      search_depth: "advanced",
      include_answer: true,
    }),
  });

  if (!res.ok) {
    console.error("[KnowledgeCache] Tavily error:", res.status);
    return [];
  }

  const data = await res.json();
  return (data.results || []).map((r: { title: string; url: string; content: string; score: number }) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
  }));
}

// POST /api/knowledge-cache/refresh
// Body: { domain, entities: string[], expiresInDays?: number }
// Protected: requires CRON_SECRET or admin auth
export async function POST(req: NextRequest) {
  // Simple API key protection for cron jobs
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "";
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const domain = typeof body.domain === "string" ? body.domain : null;
  const entities = Array.isArray(body.entities) ? body.entities : [];
  const expiresInDays = typeof body.expiresInDays === "number" ? body.expiresInDays : 7;

  if (!domain || entities.length === 0) {
    return NextResponse.json(
      { error: "domain (string) and entities (string[]) required" },
      { status: 400 }
    );
  }

  const admin = createAdminSupabase();
  const results: { entity: string; count: number; error?: string }[] = [];

  for (const entity of entities) {
    try {
      // Build search query based on domain
      let searchQuery = "";
      switch (domain) {
        case "interview_patterns":
          searchQuery = `${entity} software engineer interview experience 2026 questions format`;
          break;
        case "job_market":
          searchQuery = `${entity} job requirements skills salary 2026`;
          break;
        case "university_stats":
          searchQuery = `${entity} university admissions acceptance rate 2026 what they look for`;
          break;
        case "domain_knowledge":
          searchQuery = entity;
          break;
        default:
          searchQuery = entity;
      }

      const searchResults = await tavilySearch(searchQuery, 3);
      let inserted = 0;

      for (const result of searchResults) {
        const content = `[${result.title}]\n${result.content}`;
        const embedding = await generateEmbedding(content);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const { error: insertErr } = await admin
          .from("knowledge_cache")
          .upsert(
            {
              domain,
              entity: entity.toLowerCase(),
              content,
              source_url: result.url,
              embedding: embedding ? `[${embedding.join(",")}]` : null,
              indexed_at: new Date().toISOString(),
              expires_at: expiresAt.toISOString(),
              metadata: { title: result.title, score: result.score },
            },
            { onConflict: "id" }
          );

        if (!insertErr) inserted++;
      }

      results.push({ entity, count: inserted });
    } catch (err) {
      console.error(`[KnowledgeCache] Failed to refresh ${entity}:`, err);
      results.push({ entity, count: 0, error: String(err) });
    }
  }

  return NextResponse.json({ refreshed: results });
}

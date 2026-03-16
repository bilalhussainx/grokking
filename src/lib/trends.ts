import { createAdminSupabase } from "./supabase-auth";
import { embedText } from "./embeddings";

// ---------------------------------------------------------------------------
// arXiv ingestion
// ---------------------------------------------------------------------------

/**
 * Fetch and embed recent arXiv papers for CS/ML/Finance topics.
 * arXiv API is free, no key needed.
 */
export async function ingestArxivPapers(
  queries: string[],
  maxPerQuery: number = 5
): Promise<number> {
  const supabase = createAdminSupabase();
  let ingested = 0;

  for (const query of queries) {
    try {
      const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(
        query
      )}&sortBy=submittedDate&sortOrder=descending&max_results=${maxPerQuery}`;

      const resp = await fetch(url);
      if (!resp.ok) {
        console.warn(`arXiv fetch failed for "${query}": ${resp.status}`);
        continue;
      }

      const xml = await resp.text();
      const entries = parseArxivXml(xml);

      for (const entry of entries) {
        try {
          const embedding = await embedText(
            `${entry.title}. ${entry.summary.slice(0, 500)}`,
            "RETRIEVAL_DOCUMENT"
          );

          await supabase.from("external_content").upsert(
            {
              source: "arxiv",
              external_id: entry.id,
              title: entry.title,
              description: entry.summary.slice(0, 500),
              url: entry.link,
              author: entry.authors.slice(0, 3).join(", "),
              published_at: entry.published,
              tags: entry.categories,
              embedding: `[${embedding.join(",")}]`,
              expires_at: new Date(
                Date.now() + 14 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            { onConflict: "source,external_id" }
          );

          ingested++;
          // Rate-limit embedding calls
          await new Promise((r) => setTimeout(r, 200));
        } catch (err) {
          console.warn(`Failed to ingest arXiv entry "${entry.title}":`, err);
        }
      }

      // arXiv rate limit: max 1 request per 3 seconds
      await new Promise((r) => setTimeout(r, 3000));
    } catch (err) {
      console.warn(`arXiv query "${query}" failed:`, err);
    }
  }

  return ingested;
}

// ---------------------------------------------------------------------------
// GitHub trending ingestion
// ---------------------------------------------------------------------------

/**
 * Fetch trending GitHub repos and embed them.
 */
export async function ingestGithubTrending(
  topics: string[],
  maxPerTopic: number = 5
): Promise<number> {
  const supabase = createAdminSupabase();
  let ingested = 0;

  for (const topic of topics) {
    try {
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
        topic
      )}&sort=stars&order=desc&per_page=${maxPerTopic}`;

      const resp = await fetch(url, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });

      if (!resp.ok) {
        console.warn(`GitHub fetch failed for "${topic}": ${resp.status}`);
        continue;
      }

      const data = await resp.json();

      for (const repo of data.items ?? []) {
        try {
          const text = `${repo.full_name}: ${
            repo.description ?? ""
          }. Language: ${repo.language ?? "unknown"}. Stars: ${
            repo.stargazers_count
          }`;
          const embedding = await embedText(text, "RETRIEVAL_DOCUMENT");

          await supabase.from("external_content").upsert(
            {
              source: "github",
              external_id: `gh-${repo.id}`,
              title: repo.full_name,
              description: repo.description?.slice(0, 500) ?? "",
              url: repo.html_url,
              author: repo.owner?.login ?? "",
              published_at: repo.created_at,
              tags: repo.topics ?? [],
              embedding: `[${embedding.join(",")}]`,
              expires_at: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            { onConflict: "source,external_id" }
          );

          ingested++;
          await new Promise((r) => setTimeout(r, 100));
        } catch (err) {
          console.warn(`Failed to ingest repo "${repo.full_name}":`, err);
        }
      }
    } catch (err) {
      console.warn(`GitHub topic "${topic}" failed:`, err);
    }
  }

  return ingested;
}

// ---------------------------------------------------------------------------
// User-facing trend retrieval
// ---------------------------------------------------------------------------

export interface TrendItem {
  content_id: string;
  source: string;
  title: string;
  description: string | null;
  url: string | null;
  published_at: string | null;
  related_course: string | null;
  similarity: number;
}

/**
 * Get personalized trend notifications for a user.
 * Falls back to recent content if the RPC is unavailable or yields no results.
 */
export async function getTrendsForUser(
  userId: string,
  limit: number = 5
): Promise<TrendItem[]> {
  const supabase = createAdminSupabase();

  // Try RPC first (vector-matched to user's completed lessons)
  try {
    const { data, error } = await supabase.rpc("match_trends_for_user", {
      p_user_id: userId,
      p_match_count: limit,
      p_match_threshold: 0.45,
    });

    if (!error && data && (data as TrendItem[]).length > 0) {
      return data as TrendItem[];
    }
  } catch {
    // RPC may not exist yet — fall through to fallback
  }

  // Fallback: return most-recent external content regardless of user
  const { data } = await supabase
    .from("external_content")
    .select("id, source, title, description, url, published_at")
    .gt("expires_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((d: Record<string, unknown>) => ({
    content_id: d.id as string,
    source: d.source as string,
    title: d.title as string,
    description: (d.description as string) ?? null,
    url: (d.url as string) ?? null,
    published_at: (d.published_at as string) ?? null,
    related_course: null,
    similarity: 0,
  }));
}

// ---------------------------------------------------------------------------
// arXiv Atom XML parser (no external dependency)
// ---------------------------------------------------------------------------

interface ArxivEntry {
  id: string;
  title: string;
  summary: string;
  published: string;
  link: string;
  authors: string[];
  categories: string[];
}

function parseArxivXml(xml: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];

    const getTag = (tag: string): string => {
      const m = entry.match(
        new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
      );
      return m ? m[1].trim() : "";
    };

    const id = getTag("id");
    const title = getTag("title").replace(/\s+/g, " ");
    const summary = getTag("summary").replace(/\s+/g, " ");
    const published = getTag("published");

    // Try <link rel="alternate" href="..."/> first, fall back to <id>
    const linkMatch = entry.match(
      /<link[^>]*rel="alternate"[^>]*href="([^"]*)"[^>]*\/>/
    );
    const link = linkMatch ? linkMatch[1] : id;

    // Collect all <author><name>...</name></author>
    const authorRegex = /<author>\s*<name>([^<]+)<\/name>/g;
    const authors: string[] = [];
    let am;
    while ((am = authorRegex.exec(entry)) !== null) {
      authors.push(am[1].trim());
    }

    // Collect all <category term="..."/>
    const catRegex = /<category[^>]*term="([^"]+)"/g;
    const categories: string[] = [];
    let cm;
    while ((cm = catRegex.exec(entry)) !== null) {
      categories.push(cm[1]);
    }

    entries.push({ id, title, summary, published, link, authors, categories });
  }

  return entries;
}

/**
 * Batch script: Cluster wrong submissions into misconception patterns.
 *
 * Run: npx tsx scripts/cluster-misconceptions.ts
 *
 * Prerequisites:
 * 1. Run migration 008_misconception_clusters.sql
 * 2. Have wrong submissions in submission_embeddings table
 * 3. MOONSHOT_API_KEY in .env.local (for label generation)
 */

import { readFileSync } from "fs";

// Load .env.local
try {
  const envFile = readFileSync(".env.local", "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

// --- Utility: cosine similarity between two vectors ---
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// --- Utility: compute centroid (average) of a set of vectors ---
function computeCentroid(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const dim = vectors[0].length;
  const sum = new Array(dim).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < dim; i++) {
      sum[i] += v[i];
    }
  }
  return sum.map((s) => s / vectors.length);
}

interface Submission {
  id: string;
  lesson_id: string;
  course_id: string;
  submission_text: string;
  embedding: number[];
}

// --- Greedy clustering: group submissions with similarity > threshold ---
function greedyCluster(
  submissions: Submission[],
  threshold: number
): Submission[][] {
  const clusters: Submission[][] = [];
  const assigned = new Set<string>();

  for (const sub of submissions) {
    if (assigned.has(sub.id)) continue;

    // Start a new cluster with this submission
    const cluster: Submission[] = [sub];
    assigned.add(sub.id);

    // Find all unassigned submissions similar to this one
    for (const other of submissions) {
      if (assigned.has(other.id)) continue;
      const sim = cosineSimilarity(sub.embedding, other.embedding);
      if (sim > threshold) {
        cluster.push(other);
        assigned.add(other.id);
      }
    }

    // Only keep clusters with 2+ members (real patterns, not one-offs)
    if (cluster.length >= 2) {
      clusters.push(cluster);
    }
  }

  return clusters;
}

// --- Generate cluster label + description using Moonshot ---
async function generateClusterLabel(
  exampleTexts: string[],
  lessonId: string
): Promise<{ label: string; description: string; remediation: string }> {
  const apiKey = process.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    return {
      label: `Cluster in ${lessonId}`,
      description: "Auto-discovered misconception pattern.",
      remediation: "Review the lesson material and try again.",
    };
  }

  const sampledTexts = exampleTexts.slice(0, 5).map((t, i) => `${i + 1}. ${t.slice(0, 400)}`).join("\n\n");

  try {
    const resp = await fetch("https://api.moonshot.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "kimi-k2-turbo-preview",
        messages: [
          {
            role: "user",
            content: `These are wrong submissions from students for lesson "${lessonId}". They all share a similar mistake pattern.

${sampledTexts}

Analyze the common mistake and respond with ONLY valid JSON (no markdown):
{
  "label": "Short label for this misconception (under 10 words)",
  "description": "One sentence explaining the root misunderstanding.",
  "remediation": "2-3 sentences explaining the correct approach. Be specific and helpful."
}`,
          },
        ],
        max_tokens: 300,
      }),
    });

    if (resp.ok) {
      const data = await resp.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          label: parsed.label || `Cluster in ${lessonId}`,
          description: parsed.description || "Auto-discovered misconception pattern.",
          remediation: parsed.remediation || "Review the lesson material and try again.",
        };
      }
    }
  } catch (err) {
    console.error("  LLM label generation failed:", err);
  }

  return {
    label: `Cluster in ${lessonId}`,
    description: "Auto-discovered misconception pattern.",
    remediation: "Review the lesson material and try again.",
  };
}

// --- Main ---
async function main() {
  const { createAdminSupabase } = await import("../src/lib/supabase-auth");
  const supabase = createAdminSupabase();

  console.log("Fetching wrong submissions...\n");

  const { data: submissions, error } = await supabase
    .from("submission_embeddings")
    .select("id, lesson_id, course_id, submission_text, embedding")
    .eq("is_correct", false);

  if (error || !submissions) {
    console.error("Failed to fetch submissions:", error);
    process.exit(1);
  }

  console.log(`Found ${submissions.length} wrong submissions.\n`);

  if (submissions.length === 0) {
    console.log("No wrong submissions to cluster. Done.");
    return;
  }

  // Parse embedding strings into number arrays
  const parsed: Submission[] = submissions.map((s) => ({
    id: s.id,
    lesson_id: s.lesson_id,
    course_id: s.course_id,
    submission_text: s.submission_text,
    embedding: typeof s.embedding === "string" ? JSON.parse(s.embedding) : s.embedding,
  }));

  // Group by lesson_id
  const byLesson: Record<string, Submission[]> = {};
  for (const sub of parsed) {
    if (!byLesson[sub.lesson_id]) byLesson[sub.lesson_id] = [];
    byLesson[sub.lesson_id].push(sub);
  }

  const lessonIds = Object.keys(byLesson);
  console.log(`Clustering across ${lessonIds.length} lessons...\n`);

  let totalClusters = 0;

  for (const lessonId of lessonIds) {
    const lessonSubs = byLesson[lessonId];
    if (lessonSubs.length < 2) {
      console.log(`  [${lessonId}] Only ${lessonSubs.length} submission(s), skipping.`);
      continue;
    }

    console.log(`  [${lessonId}] ${lessonSubs.length} wrong submissions...`);

    const clusters = greedyCluster(lessonSubs, 0.8);
    console.log(`    Found ${clusters.length} cluster(s).`);

    for (const cluster of clusters) {
      const vectors = cluster.map((s) => s.embedding);
      const centroid = computeCentroid(vectors);
      const centroidStr = `[${centroid.join(",")}]`;
      const exampleTexts = cluster.map((s) => s.submission_text);
      const courseId = cluster[0].course_id;

      // Generate label via LLM
      const { label, description, remediation } = await generateClusterLabel(
        exampleTexts,
        lessonId
      );

      // Upsert into misconception_clusters
      const { error: upsertError } = await supabase
        .from("misconception_clusters")
        .insert({
          centroid: centroidStr,
          label,
          description,
          course_id: courseId,
          lesson_id: lessonId,
          occurrence_count: cluster.length,
          remediation_content: remediation,
          example_submissions: exampleTexts.slice(0, 5),
          updated_at: new Date().toISOString(),
        });

      if (upsertError) {
        console.error(`    Failed to upsert cluster "${label}":`, upsertError);
      } else {
        console.log(`    + "${label}" (${cluster.length} submissions)`);
        totalClusters++;
      }

      // Rate limit LLM calls
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log(`\nDone: ${totalClusters} misconception clusters created.`);
}

main().catch(console.error);

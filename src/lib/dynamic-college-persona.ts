// SP-11 — dynamic college persona loader.
// Generates CollegePersona JSON via Sonnet for schools not in the hand-authored
// COLLEGE_PERSONAS list, caches globally in `college_personas_dynamic`, and
// serves subsequent users from cache.
//
// Future: once SP-8 (Python research service) is live, swap the LLM-only
// generation step for a Tavily-grounded research pass.

import { createClient } from "@supabase/supabase-js";
import type { CollegePersona } from "@/data/college-interviewer-personas";

const MODEL = "anthropic/claude-sonnet-4";

export function slugifySchool(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const PERSONA_SCHEMA_PROMPT = `You are designing a mock alumni interviewer for a university admissions interview simulator. Given a school name, author a rigorous, school-specific interviewer persona.

Return ONLY a JSON object with this exact shape (no markdown, no prose):

{
  "school": "display name used in conversation (e.g. Stanford)",
  "shortName": "short name (e.g. Stanford)",
  "fullName": "formal name (e.g. Stanford University)",
  "description": "1-line persona summary for the UI dropdown",
  "schoolFitTopics": [
    "4-6 things THIS school distinctively cares about — not generic 'passion for learning'. Name specific programs, values, traditions, regional context."
  ],
  "signatureQuestionThemes": [
    "5-7 themes the interviewer probes (e.g. 'how you handle intellectual disagreement', 'a time you changed your mind', 'why THIS school over peer X')"
  ],
  "antiPatterns": [
    "4-6 things that sink a candidate at THIS school specifically (e.g. 'generic prestige-chasing answers', 'can't name a single faculty member')"
  ],
  "openingLineRecentGrad": "how a recent grad alumni interviewer would open — conversational, peer-like",
  "openingLineOlderAlum": "how an older alumni interviewer would open — warmer, more formal",
  "openingLineSubjectSpecialist": "how a faculty-adjacent specialist would open — intellectually probing",
  "closingNote": "how this interviewer naturally closes the conversation",
  "reportTemplate": "a 1-2 sentence template for the written evaluation the alum submits, with {{candidate}}, {{rec}}, and 3-4 other {{variables}}"
}

Be specific, not generic. If the school has a residential college system, name it. If it has a distinctive core curriculum, mention it. If it is a religious/mission-driven institution, reflect that. If it is in a country with specific admissions norms (UK/Canada/etc.), reflect the local style (UK interviews are often subject-specialist, for example).`;

export async function generateDynamicPersona(schoolName: string): Promise<Omit<CollegePersona, "id"> | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: PERSONA_SCHEMA_PROMPT },
        { role: "user", content: `School: ${schoolName}` },
      ],
      temperature: 0.4,
      max_tokens: 1800,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) return null;

  const j = await res.json().catch(() => null);
  const raw = j?.choices?.[0]?.message?.content || "";
  try {
    const parsed = JSON.parse(raw);
    // Basic shape validation — bail if the model returned garbage.
    if (
      !parsed.school ||
      !parsed.shortName ||
      !parsed.fullName ||
      !Array.isArray(parsed.schoolFitTopics) ||
      parsed.schoolFitTopics.length < 3 ||
      !Array.isArray(parsed.signatureQuestionThemes) ||
      !Array.isArray(parsed.antiPatterns) ||
      !parsed.openingLineRecentGrad ||
      !parsed.openingLineOlderAlum ||
      !parsed.openingLineSubjectSpecialist ||
      !parsed.closingNote ||
      !parsed.reportTemplate
    ) {
      return null;
    }
    return parsed as Omit<CollegePersona, "id">;
  } catch {
    return null;
  }
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function getOrCreateDynamicPersona(schoolName: string): Promise<CollegePersona | null> {
  const name = schoolName.trim();
  if (!name) return null;
  const schoolId = slugifySchool(name);
  const admin = adminClient();

  const { data: cached } = await admin
    .from("college_personas_dynamic")
    .select("school_id, school_name, persona_json")
    .eq("school_id", schoolId)
    .maybeSingle();

  if (cached?.persona_json) {
    return { id: schoolId, ...(cached.persona_json as Omit<CollegePersona, "id">) };
  }

  const generated = await generateDynamicPersona(name);
  if (!generated) return null;

  await admin
    .from("college_personas_dynamic")
    .insert({
      school_id: schoolId,
      school_name: name,
      persona_json: generated,
      source: "llm",
      source_model: MODEL,
    })
    .then(() => null, () => null);

  return { id: schoolId, ...generated };
}

export async function getCachedDynamicPersona(schoolId: string): Promise<CollegePersona | null> {
  const admin = adminClient();
  const { data } = await admin
    .from("college_personas_dynamic")
    .select("school_id, persona_json")
    .eq("school_id", schoolId)
    .maybeSingle();
  if (!data?.persona_json) return null;
  return { id: data.school_id, ...(data.persona_json as Omit<CollegePersona, "id">) };
}

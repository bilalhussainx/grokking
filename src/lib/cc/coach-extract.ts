import { createAdminSupabase } from "@/lib/supabase-server";
import { chatOnce, type ChatMessage } from "@/lib/cc/openrouter";
import { convertToUS4, formatRawGPADisplay, type GradingSystem } from "@/lib/cc/gpa-converter";
import { ACTIVITY_RUBRIC_COMPACT, ACTIVITY_ACTION_VERBS } from "@/lib/cc/activity-exemplars";
import { financialNeedFromAffordability, type AffordabilityValue } from "@/lib/cc/affordability";
import type { CoachActions } from "@/lib/cc/coach-actions-block";

const VALID_AFFORDABILITY: ReadonlySet<AffordabilityValue> = new Set<AffordabilityValue>([
  "zero", "under_10k", "10k_20k", "20k_30k", "30k_50k", "50k_plus",
]);

type AdminSupabase = ReturnType<typeof createAdminSupabase>;

export async function runCoachExtraction(
  studentId: string,
  mode: string,
  actions?: CoachActions | null,
): Promise<{ extracted: boolean; schoolsAddedCount?: number; error?: string }> {
  const supabase = createAdminSupabase();

  // Always pull cross-mode messages — the coach may mention schools, activities,
  // or intake info in any mode. Use last 50 messages for full context.
  const { data: messages } = await supabase
    .from("cc_coach_conversations")
    .select("role, content, mode")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!messages || messages.length === 0) {
    return { extracted: false };
  }

  const transcript = messages
    .reverse()
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  console.log(`[extract] student=${studentId} mode=${mode} messages=${messages.length}`);

  try {
    if (mode === "intake") {
      await extractIntake(supabase, studentId, transcript);
    } else if (mode === "academic") {
      await extractAcademic(supabase, studentId, transcript);
    } else if (mode === "school-builder") {
      await extractSchoolPreferences(supabase, studentId, transcript);
    }

    // The coach may claim "I've added X schools" in ANY mode (intake, general,
    // school-builder, etc.). Always try school extraction. The LLM returns {} if
    // nothing was approved, so this is a cheap no-op when irrelevant.
    let schoolsAddedCount = 0;
    if (mode !== "academic") {
      const schoolsResult = await extractAndSaveSchools(supabase, studentId, transcript, actions);
      schoolsAddedCount = schoolsResult.added;
      await extractActivities(supabase, studentId, transcript);
    }
    return { extracted: true, schoolsAddedCount };
  } catch (err) {
    console.error("[extract] Extraction error:", err);
    return { extracted: false, error: String(err) };
  }
}

async function extractIntake(supabase: AdminSupabase, studentId: string, transcript: string) {
  const extractionPrompt: ChatMessage[] = [
    {
      role: "system",
      content: `Extract student profile data from this intake conversation. Return ONLY valid JSON with these fields (use null for missing):
{
  "preferred_name": string | null,
  "grade_level": number | null,
  "state_province": string | null,
  "country": string | null,
  "is_first_gen": boolean | null,
  "home_language": string | null
}`,
    },
    { role: "user", content: transcript },
  ];

  const raw = await chatOnce(extractionPrompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return;

  const data = JSON.parse(match[0]);
  const update: Record<string, unknown> = { intake_completed_at: new Date().toISOString() };

  if (data.preferred_name) update.preferred_name = data.preferred_name;
  if (data.grade_level) update.grade_level = data.grade_level;
  if (data.state_province) update.state_province = data.state_province;
  if (data.country) update.country = data.country;
  if (data.is_first_gen !== null) update.is_first_gen = data.is_first_gen;
  if (data.home_language) update.home_language = data.home_language;

  await supabase.from("cc_student_profiles").update(update).eq("id", studentId);
}

async function extractAcademic(supabase: AdminSupabase, studentId: string, transcript: string) {
  const extractionPrompt: ChatMessage[] = [
    {
      role: "system",
      content: `Extract academic data from this conversation. Return ONLY valid JSON:
{
  "gpa_unweighted": number | null,
  "test_strategy": "SAT" | "ACT" | "Both" | "Test-optional" | "Undecided" | null,
  "sat_total": number | null,
  "act_composite": number | null,
  "grading_system": "percentage" | "cgpa10" | "a-levels" | "ib" | null,
  "original_score": number | null,
  "original_score_display": string | null
}
If the student gave a non-US grade (percentage, CGPA, A-levels, IB), put the system in grading_system and their numeric score in original_score. Put the converted US GPA in gpa_unweighted. Also write the human-readable form (e.g. "87%", "8.5 / 10 CGPA", "A-Level A") in original_score_display.`,
    },
    { role: "user", content: transcript },
  ];

  const raw = await chatOnce(extractionPrompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return;

  const data = JSON.parse(match[0]);

  if (data.grading_system && data.original_score && !data.gpa_unweighted) {
    const conversion = convertToUS4(data.grading_system as GradingSystem, data.original_score);
    data.gpa_unweighted = Math.round(((conversion.gpaLow + conversion.gpaHigh) / 2) * 100) / 100;
  }

  // Derive a canonical display string if the LLM didn't produce one. Look up the
  // student's country so percentage grades get the country-flavored label
  // ("87% (Pakistani)") that Coach Kairos and the profile read view rely on.
  let countryCode: string | null = null;
  if (data.grading_system && data.original_score != null) {
    const { data: profile } = await supabase
      .from("cc_student_profiles")
      .select("country")
      .eq("id", studentId)
      .maybeSingle();
    countryCode = profile?.country ?? null;
    if (!data.original_score_display) {
      data.original_score_display = formatRawGPADisplay(
        data.grading_system as GradingSystem,
        data.original_score,
        countryCode ?? undefined
      );
    }
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (data.gpa_unweighted) update.gpa_unweighted = data.gpa_unweighted;
  if (data.test_strategy) update.test_strategy = data.test_strategy;
  if (data.sat_total) update.sat_total = data.sat_total;
  if (data.act_composite) update.act_composite = data.act_composite;
  if (data.grading_system && data.original_score != null) {
    update.gpa_raw_value = data.original_score;
    update.gpa_raw_display = data.original_score_display;
  }

  const { data: existing } = await supabase
    .from("cc_academic_profiles")
    .select("id")
    .eq("student_id", studentId)
    .maybeSingle();

  if (existing) {
    await supabase.from("cc_academic_profiles").update(update).eq("id", existing.id);
  } else {
    await supabase.from("cc_academic_profiles").insert({ student_id: studentId, ...update });
  }
}

async function extractSchoolPreferences(supabase: AdminSupabase, studentId: string, transcript: string) {
  const extractionPrompt: ChatMessage[] = [
    {
      role: "system",
      content: `Extract school preferences from this conversation. Return ONLY valid JSON:
{
  "affordability_value": "zero" | "under_10k" | "10k_20k" | "20k_30k" | "30k_50k" | "50k_plus" | null,
  "financial_need": "essential" | "important" | "nice-to-have" | "not-a-concern" | null,
  "income_bracket": string | null,
  "location_type": "big-city" | "college-town" | "suburban" | "no-preference" | null,
  "preferred_regions": string[],
  "intended_major": string | null,
  "needs_international_full_need": boolean | null,
  "extracurriculars_summary": string | null,
  "campus_size_preference": "small" | "large" | "no-preference" | null
}

Affordability detection rules:
- "I can't pay anything" / "I need full aid" / "my family has no money for college" / "zero dollars" → affordability_value="zero"
- "up to $10k" / "under 10k" / "less than ten thousand" → "under_10k"
- "$10k–$20k" / "between 10 and 20" → "10k_20k"
- "$20k–$30k" → "20k_30k"
- "$30k–$50k" → "30k_50k"
- "cost not a concern" / "can pay full tuition" / "any price is fine" → "50k_plus"
Always prefer a specific affordability_value over financial_need when both are clear.`,
    },
    { role: "user", content: transcript },
  ];

  const raw = await chatOnce(extractionPrompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return;

  const data = JSON.parse(match[0]);
  const upsert: Record<string, unknown> = {
    student_id: studentId,
    updated_at: new Date().toISOString(),
  };

  const rawAffordability =
    typeof data.affordability_value === "string" && VALID_AFFORDABILITY.has(data.affordability_value as AffordabilityValue)
      ? (data.affordability_value as AffordabilityValue)
      : null;

  if (data.financial_need) upsert.financial_need = data.financial_need;
  // If the LLM didn't supply financial_need but did give affordability, derive it
  // so cc_school_preferences stays consistent with cc_student_profiles.
  if (!upsert.financial_need && rawAffordability) {
    upsert.financial_need = financialNeedFromAffordability(rawAffordability);
  }
  if (data.income_bracket) upsert.income_bracket = data.income_bracket;
  if (data.location_type) upsert.location_type = data.location_type;
  if (data.preferred_regions?.length) upsert.preferred_regions = data.preferred_regions;
  if (data.intended_major) upsert.intended_major = data.intended_major;
  if (data.needs_international_full_need !== null) upsert.needs_international_full_need = data.needs_international_full_need;
  if (data.extracurriculars_summary) upsert.extracurriculars_summary = data.extracurriculars_summary;
  if (data.campus_size_preference) upsert.campus_size_preference = data.campus_size_preference;

  if (rawAffordability) {
    await supabase
      .from("cc_student_profiles")
      .update({ affordability_value: rawAffordability, updated_at: new Date().toISOString() })
      .eq("id", studentId);
  }

  await supabase.from("cc_school_preferences").upsert(upsert, { onConflict: "student_id" });
}

const SCHOOL_ALIASES: Record<string, string> = {
  "mit": "Massachusetts Institute of Technology",
  "massachusetts institute of technology": "Massachusetts Institute of Technology",
  "caltech": "California Institute of Technology",
  "georgia tech": "Georgia Institute of Technology",
  "ga tech": "Georgia Institute of Technology",
  "cmu": "Carnegie Mellon",
  "carnegie mellon": "Carnegie Mellon",
  "ucla": "California, Los Angeles",
  "uc la": "California, Los Angeles",
  "ucsd": "California, San Diego",
  "uc san diego": "California, San Diego",
  "uc berkeley": "California, Berkeley",
  "ucb": "California, Berkeley",
  "berkeley": "California, Berkeley",
  "uci": "California, Irvine",
  "uc irvine": "California, Irvine",
  "ucsb": "California, Santa Barbara",
  "uc santa barbara": "California, Santa Barbara",
  "ucd": "California, Davis",
  "uc davis": "California, Davis",
  "umich": "Michigan, Ann Arbor",
  "university of michigan": "Michigan, Ann Arbor",
  "michigan": "Michigan, Ann Arbor",
  "ut austin": "Texas at Austin",
  "ut-austin": "Texas at Austin",
  "university of texas": "Texas at Austin",
  "unc": "North Carolina at Chapel Hill",
  "unc chapel hill": "North Carolina at Chapel Hill",
  "uiuc": "Illinois Urbana-Champaign",
  "u of i": "Illinois Urbana-Champaign",
  "nyu": "New York University",
  "usc": "Southern California",
  "bu": "Boston University",
  "asu": "Arizona State",
  "penn": "Pennsylvania",
  "upenn": "Pennsylvania",
  "penn state": "Penn State",
  "osu": "Ohio State",
  "vt": "Virginia Tech",
  "wisc": "Wisconsin",
  "uw": "Washington",
  "purdue": "Purdue",
  "stanford": "Stanford",
  "harvard": "Harvard",
  "yale": "Yale",
  "princeton": "Princeton",
  "columbia": "Columbia",
  "cornell": "Cornell",
  "brown": "Brown",
  "dartmouth": "Dartmouth",
  "duke": "Duke",
  "northwestern": "Northwestern",
  "johns hopkins": "Johns Hopkins",
  "jhu": "Johns Hopkins",
  "vanderbilt": "Vanderbilt",
  "rice": "Rice",
  "emory": "Emory",
  "notre dame": "Notre Dame",
};

function lookupAlias(name: string): string {
  const normalized = name.toLowerCase().trim().replace(/\s+/g, " ");
  if (SCHOOL_ALIASES[normalized]) return SCHOOL_ALIASES[normalized];
  const stripped = normalized.replace(/\s+(university|college|institute)(\s+of\s+technology)?$/i, "").trim();
  if (SCHOOL_ALIASES[stripped]) return SCHOOL_ALIASES[stripped];
  return name;
}

async function extractAndSaveSchools(
  supabase: AdminSupabase,
  studentId: string,
  transcript: string,
  actions?: CoachActions | null,
): Promise<{ added: number }> {
  // Fast path: the LLM emitted a canonical <<actions>> block (parsed by
  // route.ts via parseActionsBlock and passed in). Trust the structured
  // names + bands and skip the LLM-based extraction pass entirely.
  if (actions?.add_schools && actions.add_schools.length > 0) {
    console.log(
      `[extract schools] fast path — actions block has ${actions.add_schools.length} schools:`,
      actions.add_schools.map((s) => `${s.name}${s.band ? ` (${s.band})` : ""}`).join(", "),
    );
    // Default to "unknown" only when the LLM didn't tag a band — this keeps
    // backward compatibility with older string-only emissions.
    const items = actions.add_schools.map((s) => ({ name: s.name, band: s.band ?? "unknown" }));
    return matchAndInsertSchools(supabase, studentId, items);
  }

  // Legacy path: text-extract from transcript via chatOnce. Kept for back-
  // compat in case the LLM omits the actions block (older sessions, edge
  // cases). Once the actions-block adoption is verified in prod, this path
  // can be deleted.
  const extractionPrompt: ChatMessage[] = [
    {
      role: "system",
      content: `Extract schools that the coach recommended AND the student approved/accepted in this conversation. Include schools the coach said "I've added" or "I added" — treat those as approved.
Use the FULL FORMAL name of each school (e.g. "Massachusetts Institute of Technology" not "MIT", "Georgia Institute of Technology" not "Georgia Tech", "University of California, San Diego" not "UC San Diego").
For each approved school, classify as reach, match, or safety based on what the coach said.
Return ONLY valid JSON:
{
  "schools": [
    { "name": "Harvard University", "band": "reach" },
    { "name": "University of Michigan, Ann Arbor", "band": "match" },
    { "name": "Arizona State University", "band": "safety" }
  ]
}
If no schools were approved, return { "schools": [] }`,
    },
    { role: "user", content: transcript },
  ];

  const raw = await chatOnce(extractionPrompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    console.warn("[extract schools] No JSON in LLM output");
    return { added: 0 };
  }

  let data: { schools?: { name: string; band: string }[] };
  try {
    data = JSON.parse(match[0]);
  } catch (err) {
    console.warn("[extract schools] JSON parse failed:", err);
    return { added: 0 };
  }
  const schools: { name: string; band: string }[] = data.schools || [];
  if (!schools.length) {
    console.log("[extract schools] LLM returned 0 schools");
    return { added: 0 };
  }

  console.log(`[extract schools] legacy path — LLM returned ${schools.length} schools:`, schools.map((s) => s.name).join(", "));
  return matchAndInsertSchools(supabase, studentId, schools);
}

async function matchAndInsertSchools(
  supabase: AdminSupabase,
  studentId: string,
  schools: { name: string; band: string }[],
): Promise<{ added: number }> {
  const matched: string[] = [];
  const unmatched: string[] = [];
  let added = 0;

  for (const school of schools) {
    const needle = lookupAlias(school.name);

    // Matching strategy (prefer most-specific, fully deterministic):
    //   1. exact case-insensitive name match
    //   2. prefix match ordered by shortest name (shortest = canonical row)
    //   3. substring match ordered by shortest name
    //   4. fallback: strip filler words and retry substring match
    // Without ORDER BY, Postgres returns rows in heap order — so the same search
    // can return a different cc_schools row on each run, and the dedup check
    // below (which keys on school_id) won't catch the duplicate. That was the
    // "Carnegie Mellon added 6 times" bug.
    let { data: found } = await supabase
      .from("cc_schools")
      .select("id, name")
      .ilike("name", needle)
      .order("name", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!found) {
      const res = await supabase
        .from("cc_schools")
        .select("id, name")
        .ilike("name", `${needle}%`)
        .order("name", { ascending: true })
        .limit(1)
        .maybeSingle();
      found = res.data;
    }

    if (!found) {
      const res = await supabase
        .from("cc_schools")
        .select("id, name")
        .ilike("name", `%${needle}%`)
        .order("name", { ascending: true })
        .limit(1)
        .maybeSingle();
      found = res.data;
    }

    if (!found) {
      const bare = school.name.replace(/\b(university|college|institute|of|the|at)\b/gi, "").replace(/\s+/g, " ").trim();
      if (bare.length >= 4) {
        const result = await supabase
          .from("cc_schools")
          .select("id, name")
          .ilike("name", `%${bare}%`)
          .order("name", { ascending: true })
          .limit(1)
          .maybeSingle();
        found = result.data;
      }
    }

    if (!found) {
      unmatched.push(school.name);
      continue;
    }

    const { data: existing } = await supabase
      .from("cc_student_schools")
      .select("id")
      .eq("student_id", studentId)
      .eq("school_id", found.id)
      .maybeSingle();

    if (existing) {
      matched.push(`${school.name} (already in list)`);
      continue;
    }

    const band = ["reach", "match", "safety"].includes(school.band) ? school.band : "unknown";
    const { error: insertError } = await supabase.from("cc_student_schools").insert({
      student_id: studentId,
      school_id: found.id,
      chancing_band: band,
      application_status: "researching",
    });

    if (insertError) {
      console.error(`[extract schools] Insert failed for ${school.name}:`, insertError);
      unmatched.push(`${school.name} (insert error)`);
    } else {
      matched.push(`${school.name} → ${found.name}`);
      added += 1;
    }
  }

  console.log(`[extract schools] Matched ${matched.length}:`, matched.join(" | "));
  if (unmatched.length) console.log(`[extract schools] Unmatched ${unmatched.length}:`, unmatched.join(" | "));

  // Post-insert verification — count actual rows in cc_student_schools for this student
  const { count, error: countErr } = await supabase
    .from("cc_student_schools")
    .select("id", { count: "exact", head: true })
    .eq("student_id", studentId);
  if (countErr) console.error("[extract schools] post-insert count failed:", countErr);
  else console.log(`[extract schools] cc_student_schools row count for student=${studentId}: ${count}`);

  return { added };
}

const ACTIVITY_STOP_WORDS = new Set([
  "the", "and", "for", "with", "inc", "inter", "intra",
  "school", "schools", "college", "colleges", "university",
  "competition", "competitions", "contest", "contests",
  "club", "clubs", "team", "teams", "society", "societies",
  "member", "membership", "student", "students", "players",
  "programme", "program", "high", "national", "international",
  "junior", "senior", "group", "groups", "class", "classes",
  "year", "years", "level", "levels", "event", "events",
  "leader", "captain", "organization", "organisation", "organizations",
]);

function normalizeActivityTokens(...parts: (string | null | undefined)[]): Set<string> {
  const joined = parts.filter(Boolean).join(" ").toLowerCase();
  return new Set(
    joined
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !ACTIVITY_STOP_WORDS.has(w))
  );
}

function activitySimilarity(
  a: { role: string; organization: string; description_150?: string | null },
  b: { role: string; organization: string; description_150?: string | null }
): number {
  const tokensA = normalizeActivityTokens(a.role, a.organization, a.description_150 || undefined);
  const tokensB = normalizeActivityTokens(b.role, b.organization, b.description_150 || undefined);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let overlap = 0;
  for (const t of tokensA) if (tokensB.has(t)) overlap++;
  return Math.max(overlap / tokensA.size, overlap / tokensB.size);
}

async function extractActivities(supabase: AdminSupabase, studentId: string, transcript: string) {
  if (!transcript.toLowerCase().match(/activit|extracurricular|captain|council|debate|violin|instrument|sport|club|competition|award|volunteer/)) {
    return;
  }

  const extractionPrompt: ChatMessage[] = [
    {
      role: "system",
      content: `Extract extracurricular activities the student described in this conversation. Only activities the student themselves mentioned.

CRITICAL CONSOLIDATION RULES:
- If the same activity is described multiple times in different ways (e.g. "violin", "inter-school violin competitions", "plays violin", "violinist" are all ONE activity) — return ONE entry only. Merge all supporting details (competitions, awards, context) into that single entry's description.
- Return EXACTLY ONE entry per distinct activity. If the student mentioned 4 distinct activities, return 4 entries. Do NOT return 7 or 10.
- Do NOT pad the list to reach 10. Return only what the student ACTUALLY said — it's fine to return 3 entries, or even 0.
- Do NOT invent activities, organizations, or awards the student did not mention.

WRITE DESCRIPTIONS IN COMMON APP RUBRIC STYLE:
${ACTIVITY_RUBRIC_COMPACT}

${ACTIVITY_ACTION_VERBS}

Example of a strong description extracted from "I play violin and won some inter-school competitions, and it's something I turn to when I'm dealing with being a religious minority at home":
"Violinist; multiple inter-school competition wins; music serves as refuge navigating religious-minority identity"

Example of a passion/self-directed activity without awards — "I taught myself tabla from YouTube and played at worker-rights community meetings, and taught my sister too":
"Self-taught via YouTube videos; played drums at community meetings for worker rights awareness; helped my sister become proficient."

Return ONLY valid JSON:
{
  "activities": [
    {
      "activity_type": "Music",
      "organization": "Inter-school violin competitions",
      "role": "Violinist",
      "description_150": "Violinist; multiple inter-school competition wins; music as refuge navigating religious-minority identity"
    }
  ]
}
activity_type must be one of: Art, Music, Theater, Sports, Academic, Community Service, Leadership, Technology, Work Experience, Other
If no activities were mentioned, return { "activities": [] }`,
    },
    { role: "user", content: transcript },
  ];

  const raw = await chatOnce(extractionPrompt);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return;

  const data = JSON.parse(match[0]);
  const extracted: { activity_type: string; organization: string; role: string; description_150: string }[] =
    data.activities || [];
  if (!extracted.length) return;

  // Dedupe WITHIN the freshly extracted list first — LLM may still repeat itself.
  const deduped: typeof extracted = [];
  for (const act of extracted) {
    const dupe = deduped.find((d) => activitySimilarity(act, d) >= 0.5);
    if (dupe) {
      // merge: keep the richer description
      if ((act.description_150 || "").length > (dupe.description_150 || "").length) {
        dupe.description_150 = act.description_150;
      }
      continue;
    }
    deduped.push(act);
  }

  const { data: existing } = await supabase
    .from("cc_activities")
    .select("id, role, organization, description_150, position")
    .eq("student_id", studentId);

  const existingRows = (existing || []) as {
    id: string;
    role: string;
    organization: string;
    description_150: string | null;
    position: number;
  }[];

  for (const act of deduped) {
    // Semantic match against existing rows — tokens overlap ≥ 50% = same activity
    const dupRow = existingRows.find((row) => activitySimilarity(act, row) >= 0.5);

    if (dupRow) {
      // Existing entry covers this activity; only enrich description if new one is richer
      const newDesc = (act.description_150 || "").slice(0, 150);
      if (newDesc.length > (dupRow.description_150?.length ?? 0)) {
        await supabase
          .from("cc_activities")
          .update({ description_150: newDesc, updated_at: new Date().toISOString() })
          .eq("id", dupRow.id);
        dupRow.description_150 = newDesc;
      }
      continue;
    }

    // Find first available position 1..10
    const usedPositions = new Set(existingRows.map((r) => r.position));
    let position = 1;
    while (usedPositions.has(position) && position <= 10) position++;
    if (position > 10) break;

    const { data: inserted, error: insertErr } = await supabase
      .from("cc_activities")
      .insert({
        student_id: studentId,
        position,
        activity_type: act.activity_type,
        organization: act.organization || "",
        role: act.role,
        description_150: (act.description_150 || "").slice(0, 150),
      })
      .select("id, role, organization, description_150, position")
      .single();

    if (!insertErr && inserted) {
      existingRows.push(inserted as (typeof existingRows)[number]);
    }
  }
}

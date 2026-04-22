import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { supabase, user } = auth;

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("*, cc_academic_profiles(*), cc_financial_profiles(*)")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  const admin = createAdminSupabase();

  const { data: preferences } = await admin
    .from("cc_school_preferences")
    .select("*")
    .eq("student_id", profile.id)
    .maybeSingle();

  const { data: allSchools } = await admin
    .from("cc_schools")
    .select("id, name, acceptance_rate, avg_net_price, test_policy, state, school_type, meets_full_need, need_blind_international, ipeds_id")
    .order("name");

  if (!allSchools || allSchools.length === 0) {
    return NextResponse.json({ error: "No schools in database" }, { status: 500 });
  }

  type SchoolRow = {
    id: string;
    name: string;
    acceptance_rate: number;
    avg_net_price: number;
    test_policy: string;
    state: string;
    school_type: string;
    meets_full_need: boolean;
    need_blind_international: boolean;
    ipeds_id: number | null;
  };
  const typedSchools = allSchools as SchoolRow[];
  const needsFullAid = !!(profile as { needs_full_aid?: boolean | null }).needs_full_aid;

  const academic = Array.isArray(profile.cc_academic_profiles)
    ? profile.cc_academic_profiles[0]
    : profile.cc_academic_profiles;
  const financial = Array.isArray(profile.cc_financial_profiles)
    ? profile.cc_financial_profiles[0]
    : profile.cc_financial_profiles;

  const profileParts = [
    profile.state_province ? `State: ${profile.state_province}` : null,
    academic?.gpa_unweighted ? `GPA (UW): ${academic.gpa_unweighted}` : null,
    academic?.gpa_weighted ? `GPA (W): ${academic.gpa_weighted}` : null,
    academic?.sat_total ? `SAT: ${academic.sat_total}` : null,
    academic?.act_composite ? `ACT: ${academic.act_composite}` : null,
    academic?.test_strategy ? `Test strategy: ${academic.test_strategy}` : null,
    financial?.household_income_bracket ? `Income: ${financial.household_income_bracket}` : null,
    profile.is_first_gen ? "First-generation student" : null,
    profile.is_international ? "International student" : null,
  ].filter(Boolean);

  if (needsFullAid) {
    profileParts.push("Affordability: $0 (needs full aid — must filter toward need-blind-international or meets-full-need schools)");
  }
  if (preferences?.financial_need) profileParts.push(`Financial aid need: ${preferences.financial_need}`);
  if (preferences?.income_bracket) profileParts.push(`Family income: ${preferences.income_bracket}`);
  if (preferences?.location_type) profileParts.push(`Preferred setting: ${preferences.location_type}`);
  if (preferences?.preferred_regions?.length) profileParts.push(`Preferred regions: ${preferences.preferred_regions.join(", ")}`);
  if (preferences?.intended_major) profileParts.push(`Intended major: ${preferences.intended_major}`);
  if (preferences?.needs_international_full_need) profileParts.push(`Needs schools that meet full financial need for international students`);
  if (preferences?.extracurriculars_summary) profileParts.push(`Activities: ${preferences.extracurriculars_summary}`);
  if (preferences?.campus_size_preference && preferences.campus_size_preference !== "no-preference") {
    profileParts.push(`Campus preference: ${preferences.campus_size_preference}`);
  }

  const profileSummary = profileParts.join(", ");

  let filteredSchools: SchoolRow[] = typedSchools;

  if (needsFullAid && profile.is_international) {
    const pool = typedSchools.filter((s) => s.need_blind_international || s.meets_full_need);
    if (pool.length >= 15) filteredSchools = pool;
  } else if (needsFullAid) {
    const pool = typedSchools.filter((s) => s.meets_full_need);
    if (pool.length >= 15) filteredSchools = pool;
  } else if (preferences?.needs_international_full_need) {
    const fullNeed = typedSchools.filter((s) => s.meets_full_need);
    if (fullNeed.length >= 30) filteredSchools = fullNeed;
  }

  const schoolList = filteredSchools.map((s) =>
    `${s.name} | ${s.state} | ${s.school_type} | accept: ${Math.round((s.acceptance_rate || 0) * 100)}% | net: $${s.avg_net_price || "?"} | test: ${s.test_policy}`
  ).join("\n");

  const prompt = `You are a college counselor building a balanced school list for a student.

Student profile: ${profileSummary || "Limited profile data available"}

Available schools:
${schoolList}

Create a balanced list of 8-12 schools from the available schools above. Categorize each as "reach", "match", or "safety" based on the student's profile. Include at least 2 safety schools, 3-4 match schools, and 2-4 reach schools.

${needsFullAid ? `FULL-AID CONSTRAINT: This student needs 100% of demonstrated financial need met. At least 6 of your recommendations must be need-blind-for-international or meets-full-need schools. Always include several of: MIT, Harvard, Yale, Princeton, Dartmouth, Amherst, Williams, Bowdoin if they appear in the candidate list. Do NOT recommend need-aware schools for internationals without flagging aid risk.` : ""}

For each school, provide a brief one-sentence reason for the recommendation.

Respond in JSON format:
{
  "suggestions": [
    { "name": "School Name (exact match from list)", "band": "reach|match|safety", "reason": "Brief reason" }
  ]
}`;

  const apiKey = process.env.MOONSHOT_API_KEY || process.env.GEMINI_API_KEY;
  const isMoonshot = !!process.env.MOONSHOT_API_KEY;

  const url = isMoonshot
    ? "https://api.moonshot.ai/v1/chat/completions"
    : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  let suggestions: Array<{ name: string; band: string; reason: string; school_id?: string }> = [];

  try {
    if (isMoonshot) {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "kimi-k2-0711-preview",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1500,
          response_format: { type: "json_object" },
        }),
      });
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      suggestions = parsed.suggestions || [];
    } else {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", maxOutputTokens: 1500 },
        }),
      });
      const data = await resp.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const parsed = JSON.parse(content);
      suggestions = parsed.suggestions || [];
    }
  } catch {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }

  const schoolNameMap = new Map(typedSchools.map((s) => [s.name.toLowerCase(), s]));
  type Suggestion = (typeof suggestions)[number] & { aid_warning?: "need-aware" };
  for (const sug of suggestions as Suggestion[]) {
    const match = schoolNameMap.get(sug.name.toLowerCase());
    if (match) {
      sug.school_id = match.id;
      if (needsFullAid && profile.is_international && !match.need_blind_international) {
        sug.aid_warning = "need-aware";
      }
    }
  }

  return NextResponse.json({
    suggestions: suggestions.filter((s) => s.school_id),
    unmatched: suggestions.filter((s) => !s.school_id).map((s) => s.name),
  });
}

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface CompareResult {
  schoolA: { label: string; defining: string[] };
  schoolB: { label: string; defining: string[] };
  similarities: string[];
  differences: string[];
  bestFor: { schoolA: string; schoolB: string };
  recommendation: string;
}

function describeSchool(s: Record<string, unknown>): string {
  const parts: string[] = [];
  parts.push(`Name: ${s.name}`);
  if (s.city || s.state) parts.push(`Location: ${[s.city, s.state].filter(Boolean).join(", ")}`);
  if (s.institution_type) parts.push(`Type: ${s.institution_type}`);
  if (s.enrollment_undergrad) parts.push(`Undergrads: ${s.enrollment_undergrad}`);
  if (s.acceptance_rate) parts.push(`Acceptance: ${Math.round(Number(s.acceptance_rate) * 100)}%`);
  if (s.sat_25 && s.sat_75) parts.push(`SAT mid-50: ${s.sat_25}-${s.sat_75}`);
  if (s.act_25 && s.act_75) parts.push(`ACT mid-50: ${s.act_25}-${s.act_75}`);
  if (s.avg_hs_gpa) parts.push(`Avg HS GPA: ${s.avg_hs_gpa}`);
  if (s.avg_net_price) parts.push(`Avg net price: $${s.avg_net_price}`);
  if (s.cost_of_attendance) parts.push(`Cost of attendance: $${s.cost_of_attendance}`);
  if (s.meets_full_need) parts.push("Meets full demonstrated need");
  if (s.no_loan_institution) parts.push("No-loan institution");
  if (s.mission_statement) parts.push(`Mission: ${s.mission_statement}`);
  if (Array.isArray(s.notable_departments) && s.notable_departments.length) {
    parts.push(`Notable departments: ${s.notable_departments.join(", ")}`);
  }
  if (s.graduation_rate_6y) parts.push(`6-yr grad rate: ${Math.round(Number(s.graduation_rate_6y) * 100)}%`);
  if (s.first_gen_pct) parts.push(`First-gen: ${Math.round(Number(s.first_gen_pct) * 100)}%`);
  if (s.pell_pct) parts.push(`Pell: ${Math.round(Number(s.pell_pct) * 100)}%`);
  return parts.join("\n");
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const { school_a, school_b } = (await req.json()) as { school_a?: string; school_b?: string };
  if (!school_a || !school_b || school_a === school_b) {
    return NextResponse.json({ error: "Pick two different schools" }, { status: 400 });
  }

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "school_compare");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const db = createAdminSupabase();

  const { data: schools } = await db
    .from("cc_schools")
    .select("*")
    .in("id", [school_a, school_b]);

  if (!schools || schools.length !== 2) {
    return NextResponse.json({ error: "Could not load both schools" }, { status: 404 });
  }

  const a = schools.find((s) => s.id === school_a)!;
  const b = schools.find((s) => s.id === school_b)!;

  const systemPrompt = `You are a college admissions counselor comparing two schools side-by-side for a student. Be concrete — cite actual numbers and programs, not vague generalities.

Rules:
- "defining" points: 3-4 distinctive features per school (e.g., specific programs, culture, unusual policies, notable strengths).
- "similarities" and "differences": 3-5 each, factual.
- "bestFor": one-line summary of the student profile each school suits.
- "recommendation": one sentence helping the student decide based on data, not opinion.

Return valid JSON only matching this schema:
{
  "schoolA": { "label": "${a.name}", "defining": ["...", "..."] },
  "schoolB": { "label": "${b.name}", "defining": ["...", "..."] },
  "similarities": ["...", "..."],
  "differences": ["...", "..."],
  "bestFor": { "schoolA": "...", "schoolB": "..." },
  "recommendation": "..."
}`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `SCHOOL A:\n${describeSchool(a)}\n\nSCHOOL B:\n${describeSchool(b)}\n\nCompare them.`,
    },
  ];

  const result = await callLLMJSON<CompareResult>(messages, { maxTokens: 1500, temperature: 0.4 });
  if (!result) {
    return NextResponse.json({ error: "Comparison failed — try again" }, { status: 500 });
  }

  return NextResponse.json({ comparison: result });
}

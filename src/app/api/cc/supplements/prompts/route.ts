// GET /api/cc/supplements/prompts?school=<name>
//
// Returns the supplement prompts for a school + which prompts the student
// has already started. Backs the per-school detail page at
// /cc/essays/supplements/[school]. The dashboard now embeds prompts inline
// (see dashboard/route.ts) so this route is kept for deep-link compat.
//
// Source: cc_school_supplements (DB table). Switched off the JSON seed in
// the same change that fixed the dashboard "No seed prompts yet" bug — the
// JSON used short names ("MIT") while cc_schools stores full names
// ("Massachusetts Institute of Technology"), and the lookup silently failed.
// The DB table uses the full official names that match cc_schools 1:1.

import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../helpers";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const url = new URL(req.url);
  const school = url.searchParams.get("school")?.trim();
  if (!school) {
    return NextResponse.json({ error: "Missing ?school=" }, { status: 400 });
  }

  const db = createAdminSupabase();

  // Resolve school_id from name (case-insensitive). Single-row lookup.
  const { data: schoolRow } = await db
    .from("cc_schools")
    .select("id, name, country")
    .ilike("name", school)
    .maybeSingle<{ id: string; name: string; country: string | null }>();

  if (!schoolRow) {
    return NextResponse.json({
      schoolName: school,
      country: null,
      prompts: [],
      hasSeed: false,
    });
  }

  const { data: supplementsRaw } = await db
    .from("cc_school_supplements")
    .select("id, prompt_text, word_limit, is_required, supplement_type, category, sort_order")
    .eq("school_id", schoolRow.id)
    .order("sort_order", { ascending: true })
    .order("is_required", { ascending: false });

  type SupRow = {
    id: string;
    prompt_text: string;
    word_limit: number | null;
    is_required: boolean;
    supplement_type: string | null;
    category: string | null;
  };
  const supplements = (supplementsRaw ?? []) as SupRow[];

  if (supplements.length === 0) {
    return NextResponse.json({
      schoolName: schoolRow.name,
      country: schoolRow.country,
      prompts: [],
      hasSeed: false,
    });
  }

  // Find the student's profile + existing supplement essays for this school.
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle<{ id: string }>();

  let existing: { id: string; prompt_text: string | null; phase: string | null; current_draft: string | null; supplement_id: string | null }[] = [];
  if (profile) {
    const { data: rows } = await db
      .from("cc_essays")
      .select("id, prompt_text, phase, current_draft, supplement_id")
      .eq("student_id", profile.id)
      .eq("school_id", schoolRow.id)
      .like("essay_type", "supplement%");
    existing = (rows ?? []) as typeof existing;
  }

  const prompts = supplements.map((p, idx) => {
    const match =
      existing.find((e) => e.supplement_id === p.id) ??
      existing.find(
        (e) => e.prompt_text && p.prompt_text.startsWith(e.prompt_text.slice(0, 80)),
      );
    const draftLen = match?.current_draft?.trim().split(/\s+/).filter(Boolean).length ?? 0;
    return {
      seedIndex: idx,
      supplementId: p.id,
      type: p.supplement_type ?? "other",
      category: p.category,
      text: p.prompt_text,
      wordLimit: p.word_limit ?? 0,
      required: p.is_required,
      essayId: match?.id ?? null,
      phase: match?.phase ?? null,
      currentWordCount: draftLen,
    };
  });

  return NextResponse.json({
    schoolName: schoolRow.name,
    country: schoolRow.country,
    prompts,
    hasSeed: true,
  });
}

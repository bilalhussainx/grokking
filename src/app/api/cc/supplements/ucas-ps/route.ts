// GET  /api/cc/supplements/ucas-ps — list the 3 UCAS personal statement
//                                    questions + which the student has started
// POST /api/cc/supplements/ucas-ps — create a cc_essays row for one of the 3
//                                    questions (idempotent on student+essay_type)
//
// UCAS replaced the single 4000-char personal statement with three structured
// short-answer questions starting with the 2026 cycle. The PS is shared across
// up to 5 UK university choices — there's only ONE set of answers per student,
// not per-school. So we model it differently from US/CA supplements:
//
//   US/CA supplements:  one cc_essays row per (student, school, prompt)
//   UCAS PS:            one cc_essays row per (student, ucas question)
//                       school_id stays NULL because the answer goes to all
//                       UK choices the student lists.
//
// essay_type values: "ucas_ps_q1", "ucas_ps_q2", "ucas_ps_q3"
// The Brainstorm → Outline → Draft → Review pipeline is reused as-is; only
// the prompt-aware guidance in those phases needs to switch on essay_type
// (Phase 2 of this rollout).

import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  unauthorized,
  createAdminSupabase,
  ensureStudentProfile,
} from "../../helpers";
import ucasSeed from "@/data/uk/ucas-personal-statement-questions.json";

interface UcasQuestion {
  id: number;
  title: string;
  guidance: string;
  char_min: number;
  char_max_recommended: number;
  required: boolean;
}
interface UcasSeed {
  format_version: string;
  format_change_note: string;
  questions: UcasQuestion[];
  total_combined_char_max: number;
  shared_across_choices: boolean;
  notes: string;
}
const SEED = ucasSeed as UcasSeed;

function essayTypeForQuestion(qId: number): string {
  return `ucas_ps_q${qId}`;
}

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  // No profile yet → return the seed only (questions still browsable).
  let existing: { id: string; essay_type: string; phase: string | null; current_draft: string | null }[] = [];
  if (profile) {
    const { data: rows } = await db
      .from("cc_essays")
      .select("id, essay_type, phase, current_draft")
      .eq("student_id", profile.id)
      .like("essay_type", "ucas_ps_%")
      .is("school_id", null);
    existing = (rows ?? []) as typeof existing;
  }

  const questions = SEED.questions.map((q) => {
    const essayType = essayTypeForQuestion(q.id);
    const match = existing.find((e) => e.essay_type === essayType);
    const charCount = match?.current_draft?.length ?? 0;
    return {
      questionId: q.id,
      essayType,
      title: q.title,
      guidance: q.guidance,
      charMin: q.char_min,
      charMaxRecommended: q.char_max_recommended,
      required: q.required,
      essayId: match?.id ?? null,
      phase: match?.phase ?? null,
      currentCharCount: charCount,
    };
  });

  return NextResponse.json({
    formatVersion: SEED.format_version,
    formatChangeNote: SEED.format_change_note,
    totalCombinedCharMax: SEED.total_combined_char_max,
    sharedAcrossChoices: SEED.shared_across_choices,
    notes: SEED.notes,
    questions,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as { questionId?: number };
  const qId = body.questionId;
  if (!qId || qId < 1 || qId > SEED.questions.length) {
    return NextResponse.json(
      { error: `questionId must be 1..${SEED.questions.length}` },
      { status: 400 },
    );
  }
  const question = SEED.questions.find((q) => q.id === qId);
  if (!question) {
    return NextResponse.json({ error: "Unknown questionId" }, { status: 400 });
  }
  const essayType = essayTypeForQuestion(qId);

  const profile = await ensureStudentProfile(auth.supabase, auth.user);
  const db = createAdminSupabase();

  // Idempotent: if this student already has a row for this UCAS question,
  // return the existing essay id rather than creating a duplicate.
  const { data: existing } = await db
    .from("cc_essays")
    .select("id")
    .eq("student_id", profile.id)
    .eq("essay_type", essayType)
    .is("school_id", null)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ id: existing.id, created: false });
  }

  // Store char_max_recommended in word_limit. The editor's word/character
  // unit is sorted out in Phase 2 (region-aware UI) — for now this gives a
  // directionally correct ceiling so reuse-detector and progress bars work.
  const { data, error } = await db
    .from("cc_essays")
    .insert({
      student_id: profile.id,
      school_id: null,
      essay_type: essayType,
      prompt_text: question.title,
      word_limit: question.char_max_recommended,
      phase: "brainstorm",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ id: data.id, created: true });
}

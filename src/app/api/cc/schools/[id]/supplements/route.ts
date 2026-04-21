import { NextResponse } from "next/server";
import { createAdminSupabase } from "../../../helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminSupabase();

  const { data, error } = await db
    .from("cc_school_supplements")
    .select("id, prompt_text, word_limit, is_required, supplement_type, category, academic_year, sort_order, source_url")
    .eq("school_id", id)
    .order("sort_order", { ascending: true })
    .order("is_required", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ supplements: data || [] });
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../helpers";

export async function GET(req: NextRequest) {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("cc_glossary")
    .select("term_slug, term, definition, category, translations")
    .order("term");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ terms: data });
}

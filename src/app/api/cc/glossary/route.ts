import { NextResponse } from "next/server";
import { createAdminSupabase } from "../helpers";

// Column names must match cc_glossary's real schema (term_display /
// short_def — see 20260417_coach_kairos_schema.sql). The previous select
// asked for non-existent `term, definition` columns, so this route 500'd on
// every page mount (GlossaryProvider fetches it globally) and littered the
// console. Mapped back to the GlossaryTerm client shape here.
export async function GET() {
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("cc_glossary")
    .select("term_slug, term_display, short_def, category, translations")
    .order("term_display");

  if (error) {
    // Decorative and fetched on every page mount: a schema or seed problem
    // must not 500 for every visitor. Log it and serve nothing.
    console.error("[glossary] fetch failed:", error.message);
    return NextResponse.json({ terms: [] });
  }

  return NextResponse.json({
    terms: (data ?? []).map((t) => ({
      term_slug: t.term_slug,
      term: t.term_display,
      definition: t.short_def,
      category: t.category,
      translations: t.translations,
    })),
  });
}

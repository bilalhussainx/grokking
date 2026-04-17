import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ term_slug: string }> }
) {
  const { term_slug } = await params;
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("cc_glossary")
    .select("*")
    .eq("term_slug", term_slug)
    .single();

  if (error) {
    return NextResponse.json({ error: "Term not found" }, { status: 404 });
  }

  return NextResponse.json({ term: data });
}

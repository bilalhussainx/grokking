import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("cc_schools")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "School not found" }, { status: 404 });
  }

  return NextResponse.json({ school: data });
}

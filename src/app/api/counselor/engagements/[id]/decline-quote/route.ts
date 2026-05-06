// POST /api/counselor/engagements/[id]/decline-quote
//
// Student declines a counselor's quote. Sets status='quote_declined' and
// stamps quote_declined_at. The counselor can still re-quote (the quote
// endpoint allows status='quoted' as a starting state too — by extension
// it would need to also accept 'quote_declined' if we wanted re-quote
// after decline; deferred until we see the use case).

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { createAdminSupabase } from "@/lib/supabase-server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createAdminSupabase();
  const { data: engagement } = await db
    .from("cc_counselor_engagements")
    .select("id, status, student:cc_student_profiles!student_id (user_id)")
    .eq("id", id)
    .maybeSingle();
  type Eng = {
    id: string;
    status: string;
    student: { user_id: string } | { user_id: string }[] | null;
  };
  const e = engagement as Eng | null;
  if (!e) return NextResponse.json({ error: "Engagement not found" }, { status: 404 });

  const student = Array.isArray(e.student) ? e.student[0] : e.student;
  if (student?.user_id !== user.id) {
    return NextResponse.json({ error: "Not your engagement" }, { status: 403 });
  }
  if (e.status !== "quoted") {
    return NextResponse.json({ error: `Cannot decline from status '${e.status}'` }, { status: 409 });
  }

  const { error } = await db
    .from("cc_counselor_engagements")
    .update({
      status: "quote_declined",
      quote_declined_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

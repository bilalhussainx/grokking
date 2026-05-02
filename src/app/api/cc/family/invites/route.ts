import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { sendEmail } from "@/lib/email/resend-client";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ invites: [] });

  const { data: invites } = await supabase
    .from("cc_parent_invites")
    .select("id, parent_email, parent_name, preferred_language, accepted_at, expires_at, invite_token")
    .eq("student_id", profile.id)
    .order("created_at", { ascending: false });
  return NextResponse.json({ invites: invites ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parentEmail: string | undefined = body.parentEmail?.trim();
  if (!parentEmail || !/^.+@.+\..+$/.test(parentEmail)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const parentName: string | null = body.parentName ?? null;
  const preferredLanguage: string = ["en", "ur", "hi", "pa"].includes(body.preferredLanguage) ? body.preferredLanguage : "en";

  const { data: profile } = await supabase
    .from("cc_student_profiles")
    .select("id, preferred_name")
    .eq("user_id", user.id)
    .maybeSingle<{ id: string; preferred_name: string | null }>();
  if (!profile) return NextResponse.json({ error: "Profile missing" }, { status: 400 });

  const { data: invite, error } = await supabase
    .from("cc_parent_invites")
    .insert({ student_id: profile.id, parent_email: parentEmail, parent_name: parentName, preferred_language: preferredLanguage })
    .select("id, invite_token")
    .single<{ id: string; invite_token: string }>();
  if (error || !invite) return NextResponse.json({ error: error?.message ?? "Insert failed" }, { status: 400 });

  const origin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "https://kairoslearn.com";
  const link = `${origin}/parent/${invite.invite_token}`;
  const studentName = profile.preferred_name ?? "your child";
  const greeting = parentName ? `Hi ${parentName},` : "Hello,";
  const html = `
    <p>${greeting}</p>
    <p>${studentName} is using KairosLearn — an AI college counselor — and added you so you can see how their applications are coming along.</p>
    <p><a href="${link}" style="background:#D4AF37;color:#05080d;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block">Open ${studentName}'s family dashboard</a></p>
    <p style="color:#666;font-size:12px">This link expires in 30 days. The dashboard is read-only — you'll see school list, deadlines, and progress, but can't change anything.</p>
  `;
  try {
    await sendEmail({ to: parentEmail, subject: `${studentName} invited you to their KairosLearn family dashboard`, html });
  } catch (e) {
    console.error("[family/invites] email failed", e);
  }

  return NextResponse.json({ ok: true, id: invite.id });
}

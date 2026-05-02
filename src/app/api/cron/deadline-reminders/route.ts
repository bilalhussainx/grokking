// GET — invoked daily by Vercel Cron. Looks at every cc_student_schools row
// and sends a reminder when a deadline is exactly 14, 7, 3, or 1 days away
// and we haven't already sent that reminder.
//
// Idempotency: deadline_reminder_log row keyed on
//   (user_id, student_school_id, deadline_type, days_offset, delivered_via).
//
// Auth: protected by CRON_SECRET — Vercel sets the Authorization header
// when it invokes the route.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email/resend-client";
import { renderDeadlineReminderEmail } from "@/lib/notifications/deadline-reminder-renderer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REMINDER_OFFSETS = [14, 7, 3, 1];

const DEADLINE_KEYS: Array<{ key: string; label: string }> = [
  { key: "deadline_ea", label: "EA" },
  { key: "deadline_ed", label: "ED" },
  { key: "deadline_edii", label: "EDII" },
  { key: "deadline_rea", label: "REA" },
  { key: "deadline_rd", label: "RD" },
  { key: "deadline_financial_aid", label: "Financial Aid" },
  { key: "deadline_css_profile", label: "CSS Profile" },
  { key: "deadline_fafsa", label: "FAFSA" },
];

function daysFromTodayUTC(iso: string): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const target = new Date(iso + "T00:00:00Z");
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET ?? ""}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: rows } = await db
    .from("cc_student_schools")
    .select(
      "id, student_id, deadline_ea, deadline_ed, deadline_edii, deadline_rea, deadline_rd, deadline_financial_aid, deadline_css_profile, deadline_fafsa, cc_schools(name), cc_student_profiles!inner(user_id, preferred_name)",
    );

  let sent = 0;
  let skipped = 0;
  const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "https://kairoslearn.com";

  for (const row of rows ?? []) {
    const profile = Array.isArray(row.cc_student_profiles)
      ? (row.cc_student_profiles[0] as { user_id?: string | null; preferred_name?: string | null } | undefined)
      : (row.cc_student_profiles as { user_id?: string | null; preferred_name?: string | null } | null);
    if (!profile?.user_id) continue;
    const school = Array.isArray(row.cc_schools) ? row.cc_schools[0] : row.cc_schools;
    const schoolName = (school as { name?: string } | null)?.name ?? "Your school";

    for (const dk of DEADLINE_KEYS) {
      const iso = (row as Record<string, unknown>)[dk.key] as string | null;
      if (!iso) continue;
      const days = daysFromTodayUTC(iso);
      if (!REMINDER_OFFSETS.includes(days)) continue;

      const { data: already } = await db
        .from("deadline_reminder_log")
        .select("id")
        .eq("user_id", profile.user_id)
        .eq("student_school_id", row.id)
        .eq("deadline_type", dk.label)
        .eq("days_offset", days)
        .eq("delivered_via", "email")
        .maybeSingle();
      if (already) { skipped++; continue; }

      const { data: userRow } = await db.auth.admin.getUserById(profile.user_id);
      const email = userRow?.user?.email;
      if (!email) { skipped++; continue; }

      const { subject, html } = renderDeadlineReminderEmail({
        studentName: profile.preferred_name ?? null,
        schoolName,
        deadlineType: dk.label,
        daysAway: days,
        deadlineDateIso: iso,
        appOrigin,
      });

      try {
        await sendEmail({ to: email, subject, html });
        await db.from("deadline_reminder_log").insert({
          user_id: profile.user_id,
          student_school_id: row.id,
          school_name: schoolName,
          deadline_type: dk.label,
          deadline_date: iso,
          days_offset: days,
          delivered_via: "email",
        });
        sent++;
      } catch (err) {
        console.error("[cron/deadline-reminders] send failed", err);
      }
    }
  }

  return NextResponse.json({ ok: true, sent, skipped });
}

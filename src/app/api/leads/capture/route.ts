import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase-server";
import { randomBytes } from "crypto";
import { Resend } from "resend";

// Exit-intent lead capture. Anonymous users who bounce off /landing get one
// chance to drop an email — we store it, snapshot whatever guest state they
// built up (school list, essay titles), and mint a resume_token they can
// follow back to restore their anon session on a new device.
//
// Plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md § 8.5
//
// Runs in an unauthenticated middleware allowlist (see middleware.ts
// PUBLIC_PREFIXES) because the whole point is to catch users before signup.

interface LeadPayload {
  email: string;
  source?: string;
}

function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) && raw.length <= 254;
}

export async function POST(req: NextRequest) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const source = body.source || "exit-intent";

  // Try to read the current anon session so we can snapshot their guest work.
  // Non-blocking — if auth cookie is missing we still capture the email.
  let guestUserId: string | null = null;
  let snapshot: Record<string, unknown> | null = null;

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.is_anonymous) {
      guestUserId = user.id;
      snapshot = await buildSnapshot(user.id);
    }
  } catch {
    // Ignore — not every call has a session.
  }

  const resumeToken = randomBytes(24).toString("hex");
  const admin = createAdminSupabase();

  const { error } = await admin.from("marketing_leads").insert({
    email,
    source,
    guest_user_id: guestUserId,
    snapshot,
    resume_token: resumeToken,
  });

  if (error) {
    console.error("[leads] insert failed", error.message);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }

  // Fire resume-link email. Failures don't fail the request — the lead row is
  // the source of truth for analytics; the email is the user-visible bonus.
  await sendResumeEmail({ to: email, resumeToken, snapshot }).catch((err) => {
    console.error("[leads] email send failed", err);
  });

  return NextResponse.json({ captured: true });
}

async function sendResumeEmail(params: {
  to: string;
  resumeToken: string;
  snapshot: Record<string, unknown> | null;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Dev/preview without provider — skip silently.

  const from = process.env.RESEND_FROM_EMAIL || "hello@kairoslearn.com";
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const resumeUrl = `${appUrl}/resume/${params.resumeToken}`;
  const preferredName =
    (params.snapshot?.preferred_name as string | undefined)?.trim() || null;
  const greeting = preferredName ? `Hey ${preferredName},` : "Hey,";

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: params.to,
    subject: "Pick up where you left off at KairosLearn",
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a;line-height:1.5">
        <p>${greeting}</p>
        <p>Your Coach Kairos session is saved. Tap the link below to continue on any device — schools you added, essays in progress, everything.</p>
        <p style="margin:24px 0">
          <a href="${resumeUrl}" style="background:#D4AF37;color:#000;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
            Resume my session
          </a>
        </p>
        <p style="color:#555;font-size:13px">Or paste this link into your browser:<br/><a href="${resumeUrl}" style="color:#8a6d1f">${resumeUrl}</a></p>
        <p style="color:#888;font-size:12px;margin-top:32px">— The KairosLearn team</p>
      </div>
    `,
  });
}

async function buildSnapshot(userId: string): Promise<Record<string, unknown> | null> {
  const admin = createAdminSupabase();
  const { data: profile } = await admin
    .from("cc_student_profiles")
    .select("id, preferred_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profile) return null;

  const { data: schools } = await admin
    .from("cc_student_schools")
    .select("school_id, chancing_band")
    .eq("student_id", profile.id);

  const { data: essays } = await admin
    .from("cc_essays")
    .select("id, essay_type, word_count")
    .eq("student_id", profile.id);

  return {
    preferred_name: profile.preferred_name,
    schools: schools || [],
    essays: essays || [],
  };
}

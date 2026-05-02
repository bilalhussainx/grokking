# Audit-Gap Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the seven concrete gaps surfaced in the 2026-05-01 audit of `todo-features/` by shipping in-place fixes to existing routes, adding missing API endpoints, wiring already-collected data into UI, and adding cross-cutting infra (route guards, transactional email).

**Architecture:** Each section is independent. We touch existing routes/components instead of forking new surfaces. Resend handles transactional email (deadline reminders + recommender ask emails). PDF generation uses `@react-pdf/renderer` (server-side). The grade-9 route guard goes into the existing middleware. The confidence chart is a plain SVG component (no new charting dep). Family alignment reuses the `cc_family_alignment_ratings` table that already exists in migrations.

**Tech Stack:** Next.js 16 App Router, TypeScript 5, React 19, Tailwind 4, Supabase (Postgres + RLS), `resend@^6.12.2` (installed), `@react-pdf/renderer` (to add), Sonnet 4.6 via OpenRouter.

**Existing infra we leverage:**
- `cc_parent_invites` + `cc_family_alignment_ratings` tables (migration `20260426_feature_10_parent_portal.sql`)
- `cc_student_schools` deadline columns (migration `20260426_feature_2_application_tracker.sql`)
- `interview_post_reflections.confidence_score` (migration `20260426_feature_8_interview_reflection.sql`)
- `cc_student_profiles.affordability_value` + `needs_full_aid`
- `src/lib/applications/ed-strategy.ts` `edWarningState()`
- `src/middleware.ts` `PUBLIC_PREFIXES` array

**Required env (must be rotated before first deploy):**
- `RESEND_API_KEY` — pasted in chat 2026-05-02; rotate at Resend Dashboard → API Keys before this code goes live.

---

## Section A — Feature 10: Parent Portal `/cc/family` page

**Files:**
- Create: `src/app/cc/family/page.tsx`
- Create: `src/app/api/cc/family/invites/route.ts`
- Create: `src/lib/email/resend-client.ts`
- Modify: `src/app/api/cc/parent-invite/route.ts` (send invite email after insert)

### Task A1: Resend client wrapper

- [ ] **Step 1: Create the wrapper.** `src/lib/email/resend-client.ts`:
  ```typescript
  // Thin wrapper around the Resend HTTP API. Centralizes the from-address,
  // error handling, and the "no key configured" graceful degrade so callers
  // don't need to know about transport details.
  import { Resend } from "resend";

  const FROM = process.env.RESEND_FROM_EMAIL ?? "Coach Kairos <coach@kairoslearn.com>";

  export type SendEmailInput = {
    to: string;
    subject: string;
    html: string;
    replyTo?: string;
  };

  export async function sendEmail(input: SendEmailInput): Promise<{ id: string } | { skipped: true }> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[email] RESEND_API_KEY not set — skipping send to", input.to);
      return { skipped: true };
    }
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    });
    if (error) throw new Error(error.message ?? "resend send failed");
    if (!data?.id) throw new Error("resend returned no id");
    return { id: data.id };
  }
  ```

- [ ] **Step 2: Commit.**
  ```bash
  git add src/lib/email/resend-client.ts
  git commit -m "feat(email): Resend transport wrapper"
  ```

### Task A2: `/cc/family` page

- [ ] **Step 1: Create the page.** `src/app/cc/family/page.tsx`:
  ```typescript
  // Family hub for the student. Lets them invite a parent, see invite status,
  // and start the family-alignment questionnaire. Family Mode (voice) lives
  // separately in CoachKairosShell — this is the persistent dashboard.
  "use client";

  import { useEffect, useState } from "react";
  import Link from "next/link";
  import { Loader2, Mail, MessageSquare, Languages } from "lucide-react";

  type Invite = {
    id: string;
    parent_email: string;
    parent_name: string | null;
    preferred_language: string;
    accepted_at: string | null;
    expires_at: string;
    invite_token: string;
  };

  export default function FamilyPage() {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [lang, setLang] = useState("en");
    const [sending, setSending] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const refresh = async () => {
      const r = await fetch("/api/cc/family/invites");
      if (!r.ok) return;
      setInvites((await r.json()).invites ?? []);
    };
    useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

    const submit = async () => {
      setErr(null);
      setSending(true);
      try {
        const r = await fetch("/api/cc/family/invites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parentEmail: email, parentName: name || null, preferredLanguage: lang }),
        });
        if (!r.ok) throw new Error((await r.json()).error ?? `HTTP ${r.status}`);
        setEmail(""); setName("");
        await refresh();
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      } finally { setSending(false); }
    };

    if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;

    return (
      <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-[12px] text-white/55 uppercase tracking-wider">Family</p>
          <h1 className="text-2xl font-semibold text-white">Bring a parent into the loop</h1>
          <p className="text-[13.5px] text-white/65 mt-1">
            Invite a parent and they get a read-only dashboard in their language. They can also rate your school list — you'll see where you agree and disagree.
          </p>
        </div>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
          <h2 className="text-[13px] font-semibold text-white">Invite a parent</h2>
          <input type="email" placeholder="parent@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <input type="text" placeholder="Parent's first name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85" />
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85">
            <option value="en">English</option>
            <option value="ur">Urdu (اردو)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
          </select>
          {err && <p className="text-[12px] text-rose-300">{err}</p>}
          <button onClick={submit} disabled={!email || sending} className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-1.5">
            {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
            {sending ? "Sending…" : "Send invite"}
          </button>
        </section>

        {invites.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h2 className="text-[13px] font-semibold text-white mb-3">Pending and accepted invites</h2>
            <ul className="space-y-2">
              {invites.map((i) => (
                <li key={i.id} className="text-[12.5px] text-white/80 flex items-center gap-2">
                  <Languages className="w-3.5 h-3.5 text-white/45" />
                  <span>{i.parent_name ? `${i.parent_name} <${i.parent_email}>` : i.parent_email}</span>
                  <span className="text-white/45">·</span>
                  <span className="text-white/55">{i.accepted_at ? "Accepted" : "Pending"}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link href="/cc/family/alignment" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04]">
            <MessageSquare className="w-4 h-4 text-[#D4AF37] mb-1" />
            <p className="text-[12.5px] text-white">Family alignment</p>
            <p className="text-[10px] text-white/45 mt-0.5">Rate your top schools — your parent rates them too. See where you align.</p>
          </Link>
          <Link href="/cc/dashboard" className="rounded-xl border border-white/10 bg-white/[0.02] p-3 hover:bg-white/[0.04]">
            <p className="text-[12.5px] text-white">Back to dashboard</p>
          </Link>
        </section>
      </div>
    );
  }
  ```

- [ ] **Step 2: Add the invites listing API.** `src/app/api/cc/family/invites/route.ts`:
  ```typescript
  // GET = list invites for the signed-in student. POST = create + email.
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
      .maybeSingle();
    if (!profile) return NextResponse.json({ error: "Profile missing" }, { status: 400 });

    const { data: invite, error } = await supabase
      .from("cc_parent_invites")
      .insert({ student_id: profile.id, parent_email: parentEmail, parent_name: parentName, preferred_language: preferredLanguage })
      .select("id, invite_token")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "https://kairoslearn.com";
    const link = `${origin}/parent/${invite.invite_token}`;
    const studentName = profile.preferred_name ?? "your child";
    const greeting = parentName ? `Hi ${parentName},` : "Hello,";
    const body_html = `
      <p>${greeting}</p>
      <p>${studentName} is using KairosLearn — an AI college counselor — and added you so you can see how their applications are coming along.</p>
      <p><a href="${link}" style="background:#D4AF37;color:#05080d;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block">Open ${studentName}'s family dashboard</a></p>
      <p style="color:#666;font-size:12px">This link expires in 30 days. The dashboard is read-only — you'll see school list, deadlines, and progress, but can't change anything.</p>
    `;
    try {
      await sendEmail({ to: parentEmail, subject: `${studentName} invited you to their KairosLearn family dashboard`, html: body_html });
    } catch (e) {
      console.error("[family/invites] email failed", e);
      // The DB row was created — don't fail the request just because email is down.
    }

    return NextResponse.json({ ok: true, id: invite.id });
  }
  ```

- [ ] **Step 3: Commit.**
  ```bash
  git add src/app/cc/family/page.tsx src/app/api/cc/family/invites/route.ts
  git commit -m "feat(family): /cc/family hub with parent invites + Resend email"
  ```

---

## Section B — Feature 10: Family Alignment Questionnaire

**Files:**
- Create: `src/app/cc/family/alignment/page.tsx`
- Create: `src/app/api/cc/family-alignment/route.ts`

### Task B1: Family alignment API

- [ ] **Step 1: Create the route.** `src/app/api/cc/family-alignment/route.ts`:
  ```typescript
  // GET = fetch student's school list + ratings (student + parent if any).
  // POST = upsert a rating row for the student. Parent ratings come in via
  // the /parent/[token] flow and are written by the same table.
  import { NextRequest, NextResponse } from "next/server";
  import { createServerSupabase } from "@/lib/supabase-auth";

  export async function GET() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("cc_student_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!profile) return NextResponse.json({ schools: [], ratings: [] });

    const { data: schools } = await supabase
      .from("cc_student_schools")
      .select("id, cc_schools(name)")
      .eq("student_id", profile.id);

    const { data: ratings } = await supabase
      .from("cc_family_alignment_ratings")
      .select("rater, school_name, rating, notes")
      .eq("student_id", profile.id);

    const schoolNames = (schools ?? [])
      .map((s) => (Array.isArray(s.cc_schools) ? s.cc_schools[0]?.name : (s.cc_schools as { name?: string } | null)?.name) ?? null)
      .filter((n): n is string => Boolean(n));

    return NextResponse.json({ schools: schoolNames, ratings: ratings ?? [] });
  }

  export async function POST(req: NextRequest) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { schoolName, rating, notes } = await req.json();
    if (typeof schoolName !== "string" || typeof rating !== "number" || rating < 1 || rating > 10) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("cc_student_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!profile) return NextResponse.json({ error: "Profile missing" }, { status: 400 });

    const { error } = await supabase
      .from("cc_family_alignment_ratings")
      .upsert(
        { student_id: profile.id, rater: "student", school_name: schoolName, rating, notes: notes ?? null },
        { onConflict: "student_id,rater,school_name" },
      );
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }
  ```

### Task B2: Alignment page

- [ ] **Step 1: Create the page.** `src/app/cc/family/alignment/page.tsx`:
  ```typescript
  // Lists the student's school list. Lets them rate each 1-10. Renders the
  // alignment report (delta = student - parent) where both sides have rated.
  "use client";

  import { useEffect, useState } from "react";
  import Link from "next/link";
  import { Loader2, Star } from "lucide-react";

  type Rating = { rater: "student" | "parent"; school_name: string; rating: number; notes: string | null };

  export default function AlignmentPage() {
    const [schools, setSchools] = useState<string[]>([]);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    const refresh = async () => {
      const r = await fetch("/api/cc/family-alignment");
      if (!r.ok) return;
      const d = await r.json();
      setSchools(d.schools ?? []);
      setRatings(d.ratings ?? []);
    };
    useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

    const setRating = async (school: string, value: number) => {
      setSaving(school);
      try {
        await fetch("/api/cc/family-alignment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schoolName: school, rating: value }),
        });
        await refresh();
      } finally { setSaving(null); }
    };

    const getRating = (school: string, who: "student" | "parent"): number | null =>
      ratings.find((r) => r.school_name === school && r.rater === who)?.rating ?? null;

    if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;

    return (
      <div className="px-6 py-6 max-w-3xl mx-auto space-y-6">
        <div>
          <p className="text-[12px] text-white/55 uppercase tracking-wider">Family alignment</p>
          <h1 className="text-2xl font-semibold text-white">Rate your school list — your parent rates the same list</h1>
          <p className="text-[13.5px] text-white/65 mt-1">
            Where your numbers and your parent's numbers diverge, that's where the conversation needs to happen. Rate from 1 (not for me) to 10 (top choice).
          </p>
        </div>

        {schools.length === 0 ? (
          <p className="text-[13px] text-white/65">
            Add schools to your list first. <Link href="/schools" className="text-[#D4AF37] hover:underline">Open the School List Builder →</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {schools.map((school) => {
              const s = getRating(school, "student");
              const p = getRating(school, "parent");
              const delta = s != null && p != null ? Math.abs(s - p) : null;
              return (
                <div key={school} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-white">{school}</h3>
                    {delta != null && (
                      <span className={"text-[11.5px] " + (delta >= 4 ? "text-rose-300" : delta >= 2 ? "text-amber-300" : "text-emerald-300")}>
                        Δ {delta} {delta >= 4 ? "· big gap" : delta >= 2 ? "· some gap" : "· aligned"}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-2 text-[12px] text-white/70">
                    <div>You: <strong className="text-white">{s ?? "—"}</strong></div>
                    <div>Parent: <strong className="text-white">{p ?? "—"}</strong></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(school, n)}
                        disabled={saving === school}
                        className={"w-7 h-7 rounded text-[11.5px] font-semibold border " + (s === n ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "border-white/15 text-white/70 hover:bg-white/5")}
                      >
                        {n}
                      </button>
                    ))}
                    {saving === school && <Loader2 className="w-3.5 h-3.5 animate-spin text-white/55 ml-2 self-center" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit.**
  ```bash
  git add src/app/cc/family/alignment/page.tsx src/app/api/cc/family-alignment/route.ts
  git commit -m "feat(family): alignment questionnaire + report"
  ```

---

## Section C — Feature 2: Resend-backed deadline reminders

**Files:**
- Create: `supabase/migrations/20260502_deadline_reminders.sql`
- Create: `src/app/api/cron/deadline-reminders/route.ts`
- Create: `src/lib/notifications/deadline-reminder-renderer.ts`
- Modify: `vercel.json` (add cron entry)

> **Choice:** instead of Supabase Edge Functions + pg_cron (extra moving parts, requires a separate deploy lifecycle), we use a Next.js API route triggered by **Vercel Cron** at 9:07am UTC daily. Lower complexity, runs on the same deploy, easy to invoke locally.

### Task C1: Notification table + idempotency

- [ ] **Step 1: Create the migration.** `supabase/migrations/20260502_deadline_reminders.sql`:
  ```sql
  -- Tracks which deadline reminders we've already sent so the daily cron
  -- never double-sends. Idempotency key = (user_id, school_id, deadline_type, days_offset).
  CREATE TABLE IF NOT EXISTS deadline_reminder_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_school_id UUID REFERENCES cc_student_schools(id) ON DELETE CASCADE,
    school_name TEXT NOT NULL,
    deadline_type TEXT NOT NULL,
    deadline_date DATE NOT NULL,
    days_offset INTEGER NOT NULL,
    delivered_via TEXT NOT NULL CHECK (delivered_via IN ('email', 'in_app')),
    sent_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, student_school_id, deadline_type, days_offset, delivered_via)
  );

  CREATE INDEX IF NOT EXISTS deadline_reminder_log_user_idx
    ON deadline_reminder_log(user_id, sent_at DESC);

  ALTER TABLE deadline_reminder_log ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "users see their reminders" ON deadline_reminder_log;
  CREATE POLICY "users see their reminders"
    ON deadline_reminder_log FOR SELECT
    USING (auth.uid() = user_id);
  ```

### Task C2: Renderer + cron route

- [ ] **Step 1: Create the renderer.** `src/lib/notifications/deadline-reminder-renderer.ts`:
  ```typescript
  // Simple HTML email body for the deadline reminder. Plain inline styles —
  // most clients strip the <style> tag.
  export function renderDeadlineReminderEmail(input: {
    studentName: string | null;
    schoolName: string;
    deadlineType: string;
    daysAway: number;
    deadlineDateIso: string;
    appOrigin: string;
  }): { subject: string; html: string } {
    const { studentName, schoolName, deadlineType, daysAway, deadlineDateIso, appOrigin } = input;
    const greeting = studentName ? `Hey ${studentName},` : "Hey,";
    const urgency = daysAway <= 1 ? " — this is tomorrow" : daysAway <= 7 ? "" : "";
    const subject = `${schoolName} ${deadlineType} deadline in ${daysAway} day${daysAway === 1 ? "" : "s"}${urgency}`;
    const html = `
      <p>${greeting}</p>
      <p>Your <strong>${schoolName} ${deadlineType}</strong> deadline is in <strong>${daysAway} day${daysAway === 1 ? "" : "s"}</strong> (${deadlineDateIso}).</p>
      <p><a href="${appOrigin}/applications" style="background:#D4AF37;color:#05080d;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block">Open the application checklist →</a></p>
      <p style="color:#666;font-size:12px">You can disable these reminders in your account settings.</p>
    `;
    return { subject, html };
  }
  ```

- [ ] **Step 2: Create the cron route.** `src/app/api/cron/deadline-reminders/route.ts`:
  ```typescript
  // GET — invoked daily by Vercel Cron. Looks at every cc_student_schools row
  // and sends a reminder when a deadline is exactly 14, 7, 3, or 1 days away
  // and we haven't already sent that reminder.
  //
  // Idempotency: deadline_reminder_log row keyed on
  //   (user_id, student_school_id, deadline_type, days_offset).
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
      .select("id, student_id, deadline_ea, deadline_ed, deadline_edii, deadline_rea, deadline_rd, deadline_financial_aid, deadline_css_profile, deadline_fafsa, cc_schools(name), cc_student_profiles!inner(user_id, preferred_name)");

    let sent = 0;
    let skipped = 0;
    const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN ?? "https://kairoslearn.com";

    for (const row of rows ?? []) {
      const profile = Array.isArray(row.cc_student_profiles) ? row.cc_student_profiles[0] : row.cc_student_profiles;
      if (!profile?.user_id) continue;
      const school = Array.isArray(row.cc_schools) ? row.cc_schools[0] : row.cc_schools;
      const schoolName = school?.name ?? "Your school";

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
  ```

- [ ] **Step 3: Add to `vercel.json`.** Append to `crons` array:
  ```json
  {
    "path": "/api/cron/deadline-reminders",
    "schedule": "7 9 * * *"
  }
  ```

- [ ] **Step 4: Commit.**
  ```bash
  git add supabase/migrations/20260502_deadline_reminders.sql src/app/api/cron/deadline-reminders/route.ts src/lib/notifications/deadline-reminder-renderer.ts vercel.json
  git commit -m "feat(reminders): Vercel cron + Resend email at 14/7/3/1 days before deadline"
  ```

---

## Section D — Feature 7: Real PDF brag sheet

**Files:**
- Modify: `package.json` (add `@react-pdf/renderer`)
- Create: `src/lib/recommenders/brag-sheet-pdf.tsx`
- Modify: `src/app/api/cc/recommenders/[id]/brag-sheet/route.ts`

### Task D1: Add the PDF renderer

- [ ] **Step 1: Install dep.**
  ```bash
  npm install @react-pdf/renderer
  ```

- [ ] **Step 2: Create the PDF doc.** `src/lib/recommenders/brag-sheet-pdf.tsx`:
  ```typescript
  // React-PDF document for the recommender brag sheet. Server-side renders to
  // a Buffer; the route streams it as application/pdf.
  import React from "react";
  import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

  const styles = StyleSheet.create({
    page: { padding: 48, fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.5 },
    h1: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
    h2: { fontSize: 13, fontWeight: 700, marginTop: 16, marginBottom: 6, color: "#1a1a1a", borderBottom: "1pt solid #aaa", paddingBottom: 2 },
    para: { marginBottom: 8 },
    label: { fontWeight: 700, color: "#444" },
    bullet: { marginLeft: 12, marginBottom: 3 },
  });

  export type BragSheetData = {
    studentName: string;
    recommenderName: string;
    recommenderRole: string;
    headline: string;
    coreThemes: string[];
    keyAccomplishments: { title: string; detail: string }[];
    classroomMoments: string[];
    intendedMajor: string | null;
    targetSchools: string[];
    contextNotes: string | null;
  };

  export function BragSheetDocument({ data }: { data: BragSheetData }): React.ReactElement {
    return (
      <Document>
        <Page size="LETTER" style={styles.page}>
          <Text style={styles.h1}>Brag sheet · {data.studentName}</Text>
          <Text style={{ color: "#555", marginBottom: 12 }}>For {data.recommenderName} ({data.recommenderRole})</Text>

          <Text style={styles.h2}>Headline</Text>
          <Text style={styles.para}>{data.headline}</Text>

          <Text style={styles.h2}>Core themes</Text>
          {data.coreThemes.map((t) => <Text key={t} style={styles.bullet}>• {t}</Text>)}

          <Text style={styles.h2}>Key accomplishments</Text>
          {data.keyAccomplishments.map((a) => (
            <View key={a.title} style={{ marginBottom: 6 }}>
              <Text style={styles.label}>{a.title}</Text>
              <Text>{a.detail}</Text>
            </View>
          ))}

          <Text style={styles.h2}>Classroom moments to recall</Text>
          {data.classroomMoments.map((m, i) => <Text key={i} style={styles.bullet}>• {m}</Text>)}

          {(data.intendedMajor || data.targetSchools.length > 0) && (
            <>
              <Text style={styles.h2}>Where this letter is going</Text>
              {data.intendedMajor && <Text><Text style={styles.label}>Intended major: </Text>{data.intendedMajor}</Text>}
              {data.targetSchools.length > 0 && <Text><Text style={styles.label}>Target schools: </Text>{data.targetSchools.join(", ")}</Text>}
            </>
          )}

          {data.contextNotes && (
            <>
              <Text style={styles.h2}>Notes from {data.studentName}</Text>
              <Text>{data.contextNotes}</Text>
            </>
          )}
        </Page>
      </Document>
    );
  }

  export async function renderBragSheetPdf(data: BragSheetData): Promise<Buffer> {
    return renderToBuffer(<BragSheetDocument data={data} />);
  }
  ```

### Task D2: Wire route to return PDF when requested

- [ ] **Step 1: Modify the route.** Add a check at the top of `src/app/api/cc/recommenders/[id]/brag-sheet/route.ts` to return PDF when `?format=pdf` is set. After the existing `BragSheet` JSON is generated, add:
  ```typescript
  // Existing handler returns JSON. Add PDF branch:
  // (after `const sheet = JSON.parse(...) as BragSheet;`)
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "pdf") {
    const { renderBragSheetPdf } = await import("@/lib/recommenders/brag-sheet-pdf");
    const pdf = await renderBragSheetPdf({
      studentName,
      recommenderName: rec.name,
      recommenderRole: rec.recommender_type ?? "Recommender",
      headline: sheet.headline,
      coreThemes: sheet.core_themes,
      keyAccomplishments: sheet.key_accomplishments,
      classroomMoments: sheet.classroom_moments,
      intendedMajor: sheet.intended_major ?? null,
      targetSchools: sheet.target_schools ?? [],
      contextNotes: rec.context_notes ?? null,
    });
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="brag-sheet-${studentName.replace(/[^a-z0-9]/gi, "-")}.pdf"`,
      },
    });
  }
  // ...existing JSON return
  ```

- [ ] **Step 2: Commit.**
  ```bash
  git add package.json package-lock.json src/lib/recommenders/brag-sheet-pdf.tsx src/app/api/cc/recommenders/\[id\]/brag-sheet/route.ts
  git commit -m "feat(recommenders): real PDF brag sheet via @react-pdf/renderer"
  ```

---

## Section E — Feature 5: ED Calculator $ estimate

**Files:**
- Modify: `src/lib/applications/ed-strategy.ts`
- Create: `src/lib/applications/__tests__/ed-strategy-estimate.test.ts`

### Task E1: Estimate function + plumbing

- [ ] **Step 1: Add the estimator.** Append to `src/lib/applications/ed-strategy.ts`:
  ```typescript
  // Rough net-cost estimator for the ED warning. Uses the affordability
  // bracket the student already set on their profile. We don't claim
  // school-specific accuracy — the warning frames it as "approximate."
  //
  // Sources:
  //   - 2024-25 average COA for the school's tier (sticker, ~$95k for top
  //     private, ~$65k for top public OOS, ~$35k in-state).
  //   - The school's typical "% of need met" for the student's status.
  //
  // We map the student's affordability bracket → expected family contribution
  // (EFC), then return: estimated_aid = max(0, COA - EFC) capped by % of need
  // met, and estimated_out_of_pocket = COA - estimated_aid.
  import type { AffordabilityValue } from "@/lib/cc/affordability";

  const TIER_COA: Record<"top_private" | "top_public_oos" | "top_public_in" | "default", number> = {
    top_private: 95000,
    top_public_oos: 65000,
    top_public_in: 35000,
    default: 75000,
  };

  // Approximate "% of demonstrated need met" — schools with a published
  // commitment to meeting full need are 1.0; everyone else gets a haircut.
  const FULL_NEED_SCHOOLS = new Set([
    "MIT","Harvard","Yale","Princeton","Stanford","Columbia","Penn","Brown","Dartmouth","Cornell",
    "Amherst","Williams","Bowdoin","Pomona","Wellesley","Middlebury","Duke","Vanderbilt","Rice",
    "Northwestern","Notre Dame","Georgetown","UChicago","Caltech","JHU",
  ]);

  function efcFromBracket(b: AffordabilityValue | null): number {
    switch (b) {
      case "zero": return 0;
      case "under_10k": return 5000;
      case "10k_20k": return 15000;
      case "20k_30k": return 25000;
      case "30k_50k": return 40000;
      case "50k_plus": return 70000;
      default: return 25000; // unknown → assume middle
    }
  }

  function tierForSchool(schoolName: string): keyof typeof TIER_COA {
    if (FULL_NEED_SCHOOLS.has(schoolName)) return "top_private";
    if (/^(University of|Texas|Michigan|Berkeley|UCLA|UNC|Virginia)/i.test(schoolName)) return "top_public_oos";
    return "default";
  }

  export type EDCostEstimate = {
    coa: number;
    estimatedAid: number;
    estimatedOutOfPocket: number;
    methodology: string;
  };

  export function estimateEDCost(input: {
    schoolName: string;
    affordabilityValue: AffordabilityValue | null;
  }): EDCostEstimate {
    const tier = tierForSchool(input.schoolName);
    const coa = TIER_COA[tier];
    const efc = efcFromBracket(input.affordabilityValue);
    const need = Math.max(0, coa - efc);
    const meetsFullNeed = FULL_NEED_SCHOOLS.has(input.schoolName);
    const aid = meetsFullNeed ? need : Math.round(need * 0.75);
    const outOfPocket = Math.max(0, coa - aid);
    return {
      coa,
      estimatedAid: aid,
      estimatedOutOfPocket: outOfPocket,
      methodology: meetsFullNeed
        ? `${input.schoolName} commits to meeting 100% of demonstrated need. Estimate uses your affordability bracket as EFC.`
        : `${input.schoolName} doesn't publicly commit to full need; estimate assumes ~75% of need met.`,
    };
  }
  ```

- [ ] **Step 2: Plumb into `edWarningState`.** In the same file, modify the `edWarningState` function so the returned object includes an optional `estimate` property when affordabilityValue is non-null. Add this block before the existing return statements:
  ```typescript
  // (in edWarningState, near the top after the input-destructuring)
  const costEstimate = estimateEDCost({
    schoolName: input.schoolName,
    affordabilityValue: (input.affordabilityValue as AffordabilityValue | null) ?? null,
  });
  ```
  And extend the function's return type + each branch's return object to include `estimate: costEstimate`.

- [ ] **Step 3: Test it.** `src/lib/applications/__tests__/ed-strategy-estimate.test.ts`:
  ```typescript
  import { describe, it, expect } from "vitest";
  import { estimateEDCost } from "../ed-strategy";

  describe("estimateEDCost", () => {
    it("zero affordability + full-need school = 0 out of pocket", () => {
      const e = estimateEDCost({ schoolName: "Harvard", affordabilityValue: "zero" });
      expect(e.estimatedOutOfPocket).toBe(0);
      expect(e.coa).toBeGreaterThan(80000);
    });
    it("non-full-need school applies 75% haircut", () => {
      const e = estimateEDCost({ schoolName: "Some Random College", affordabilityValue: "zero" });
      expect(e.estimatedOutOfPocket).toBeGreaterThan(10000);
    });
    it("50k+ bracket = student covers most of COA", () => {
      const e = estimateEDCost({ schoolName: "Harvard", affordabilityValue: "50k_plus" });
      expect(e.estimatedOutOfPocket).toBeGreaterThan(50000);
    });
  });
  ```
  Run: `npx vitest run src/lib/applications/__tests__/ed-strategy-estimate.test.ts`. Expected: 3 passed.

- [ ] **Step 4: Commit.**
  ```bash
  git add src/lib/applications/ed-strategy.ts src/lib/applications/__tests__/ed-strategy-estimate.test.ts
  git commit -m "feat(ed-strategy): plumb \$-figure estimate into ED warning"
  ```

---

## Section F — Feature 16: Grade-9 middleware route guard

**Files:**
- Modify: `src/middleware.ts`
- Create: `src/lib/cc/grade-route-policy.ts`

### Task F1: Policy + middleware integration

- [ ] **Step 1: Create the policy module.** `src/lib/cc/grade-route-policy.ts`:
  ```typescript
  // Single source of truth for "which routes are gated by grade level."
  // The middleware uses this to redirect grade-9 students away from senior-
  // only routes. Page-level checks already exist; this is defense in depth.

  // Routes a grade-9 student should not be able to access. They get redirected
  // to /cc/dashboard which adapts to their grade.
  const GRADE_9_BLOCKED_PREFIXES = [
    "/cc/essays",
    "/applications",
    "/cc/test-strategy",
    "/cc/test-attempts",
    "/cc/interview-prep",
    "/cc/waitlist",
    "/cc/recommenders",
    "/cc/aid-offers",
  ] as const;

  export function isGrade9BlockedPath(pathname: string): boolean {
    return GRADE_9_BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  }

  // Junior (grade 11) can brainstorm but not draft. This is enforced at the
  // page level inside the essay studio (Task isn't covered here — captured
  // for future work).
  ```

- [ ] **Step 2: Modify the middleware.** In `src/middleware.ts`, after the existing auth check, add a grade-9 guard. Find the section after auth resolves the user and add:
  ```typescript
  // Grade-9 route guard (Feature 16). Page-level checks exist on the standalone
  // dashboards but not on the per-feature surfaces. Gate at the edge so a
  // grade-9 student following a deep-link can't open the senior tooling.
  import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";

  // ... inside middleware function, after we know we have an authed user:
  if (user && isGrade9BlockedPath(req.nextUrl.pathname)) {
    // Cheap profile lookup — single column.
    const { data: profile } = await supabase
      .from("cc_student_profiles")
      .select("grade_level")
      .eq("user_id", user.id)
      .maybeSingle<{ grade_level: number | null }>();
    if (profile?.grade_level === 9) {
      const dest = req.nextUrl.clone();
      dest.pathname = "/cc/dashboard";
      dest.searchParams.set("blocked", "grade9");
      return NextResponse.redirect(dest);
    }
  }
  ```

- [ ] **Step 3: Surface the redirect reason on the dashboard.** In `src/app/cc/dashboard/AdaptiveDashboard.tsx`, near the top of the rendered JSX, add a one-line banner when `?blocked=grade9` is present (read from `useSearchParams`). Banner copy: "That tool unlocks junior year — let's keep building your foundation here."

- [ ] **Step 4: Commit.**
  ```bash
  git add src/middleware.ts src/lib/cc/grade-route-policy.ts src/app/cc/dashboard/AdaptiveDashboard.tsx
  git commit -m "feat(grade-9): middleware guard blocks senior tools, dashboard explains why"
  ```

---

## Section G — Feature 8: Confidence trend chart

**Files:**
- Create: `src/components/interview/ConfidenceTrendChart.tsx`
- Create: `src/app/api/cc/interview-reflection/history/route.ts`
- Modify: `src/app/cc/interview-prep/page.tsx`

### Task G1: History API

- [ ] **Step 1: Create the route.** `src/app/api/cc/interview-reflection/history/route.ts`:
  ```typescript
  // GET — returns the last 20 confidence-score data points for the chart.
  import { NextResponse } from "next/server";
  import { createServerSupabase } from "@/lib/supabase-auth";

  export async function GET() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data } = await supabase
      .from("interview_post_reflections")
      .select("interview_date, school_name, confidence_score")
      .eq("user_id", user.id)
      .not("confidence_score", "is", null)
      .order("interview_date", { ascending: true })
      .limit(20);
    return NextResponse.json({ history: data ?? [] });
  }
  ```

### Task G2: SVG chart component

- [ ] **Step 1: Create the chart.** `src/components/interview/ConfidenceTrendChart.tsx`:
  ```typescript
  // Plain SVG line chart — no charting dep, ~80 lines. Renders confidence
  // 1-10 over time. Empty state for fewer than 2 points (a chart of 1 dot is
  // useless).
  "use client";

  type Point = { interview_date: string | null; school_name: string; confidence_score: number };

  export default function ConfidenceTrendChart({ points }: { points: Point[] }) {
    if (points.length < 2) {
      return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-[12.5px] text-white/55">
          Log at least two interview reflections to see your confidence trend.
        </div>
      );
    }

    const W = 560, H = 180, P = 28;
    const xs = points.map((_, i) => P + (i * (W - P * 2)) / (points.length - 1));
    const ys = points.map((p) => H - P - ((p.confidence_score - 1) / 9) * (H - P * 2));
    const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");

    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="text-[13px] font-semibold text-white mb-1">Confidence trend</h3>
        <p className="text-[11.5px] text-white/55 mb-3">Self-rated 1-10 after each interview.</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Confidence trend chart">
          {/* gridlines at 1 / 5 / 10 */}
          {[1, 5, 10].map((v) => {
            const y = H - P - ((v - 1) / 9) * (H - P * 2);
            return (
              <g key={v}>
                <line x1={P} y1={y} x2={W - P} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <text x={4} y={y + 4} fontSize="10" fill="rgba(255,255,255,0.45)">{v}</text>
              </g>
            );
          })}
          {/* line */}
          <path d={path} stroke="#D4AF37" strokeWidth="2" fill="none" />
          {/* points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={xs[i]} cy={ys[i]} r="3.5" fill="#D4AF37" />
              <title>{p.school_name} · {p.confidence_score}/10{p.interview_date ? ` · ${p.interview_date}` : ""}</title>
            </g>
          ))}
        </svg>
      </div>
    );
  }
  ```

### Task G3: Wire into interview-prep page

- [ ] **Step 1: Modify `src/app/cc/interview-prep/page.tsx`.** Add a `useEffect` to fetch `/api/cc/interview-reflection/history`, store points in state, render `<ConfidenceTrendChart points={points} />` near the top of the page body.

- [ ] **Step 2: Commit.**
  ```bash
  git add src/app/api/cc/interview-reflection/history/route.ts src/components/interview/ConfidenceTrendChart.tsx src/app/cc/interview-prep/page.tsx
  git commit -m "feat(interview-prep): confidence trend SVG chart"
  ```

---

## Final cleanup

- [ ] **Run typecheck:** `npx tsc --noEmit` — only the pre-existing unrelated e2e-spec error allowed.
- [ ] **Run unit tests:** `npx vitest run` — all green.
- [ ] **Push:** `git push origin master`.

---

## Self-review notes (for the reader)

- Resend wrapper + cron-secret pattern follow Stripe webhook precedent (`src/app/api/billing/stripe/webhook/route.ts`). The `CRON_SECRET` env var must be set in Vercel before the cron route is callable.
- The grade-9 middleware adds one Supabase RTT per blocked path. That's fine — it's only on the small set of senior-only routes. We deliberately don't cache grade in a cookie (changes too rarely to justify the consistency cost).
- The `@react-pdf/renderer` package is ~1.6 MB; tolerated because it's only imported inside the brag-sheet route (dynamic import keeps it out of the main bundle).
- The Vercel cron entry uses minute `7` not `0` to dodge the global :00 stampede.

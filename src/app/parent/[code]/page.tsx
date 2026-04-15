// SP-3 — parent dashboard (read-only, no-auth, redeemed via share code).
import { notFound } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase-auth";
import { computeReadiness } from "@/lib/readiness-score";
import { Target, Mic, FileText, ListChecks, Compass } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props { params: Promise<{ code: string }> }

export default async function ParentDashboardPage({ params }: Props) {
  const { code } = await params;
  if (!code || code.length < 8) notFound();

  const admin = createAdminSupabase();

  const { data: token } = await admin
    .from("parent_share_tokens")
    .select("user_id, label, revoked_at, expires_at")
    .eq("code", code)
    .maybeSingle();

  if (!token || token.revoked_at) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-950 text-white p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-3">Share link revoked</h1>
          <p className="text-white/60">
            This link is no longer active. Ask the student for a fresh one.
          </p>
        </div>
      </div>
    );
  }
  if (token.expires_at && new Date(token.expires_at) < new Date()) {
    return (
      <div className="min-h-screen grid place-items-center bg-neutral-950 text-white p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-3">Share link expired</h1>
          <p className="text-white/60">Ask the student to generate a new one.</p>
        </div>
      </div>
    );
  }

  const userId = token.user_id;

  const [readiness, profileRes, perfRes, essaysRes, actsRes] = await Promise.all([
    computeReadiness(admin, userId),
    admin.from("college_applicant_profile")
      .select("intended_major, top_project_title, recent_influence, updated_at")
      .eq("user_id", userId).maybeSingle(),
    admin.from("interview_performance")
      .select("overall_score, company_persona_id, created_at")
      .eq("user_id", userId).eq("category", "college")
      .order("created_at", { ascending: false }).limit(5),
    admin.from("college_essays")
      .select("prompt, status, word_target, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }).limit(5),
    admin.from("college_activities")
      .select("title, role, category, hours_per_week")
      .eq("user_id", userId).order("position", { ascending: true }),
  ]);

  const profile = profileRes.data;
  const perf = perfRes.data || [];
  const essays = essaysRes.data || [];
  const acts = actsRes.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
            <Compass className="w-4 h-4" /> Parent view · read-only
          </div>
          <h1 className="text-3xl font-semibold">
            {token.label ? `${token.label}'s` : "Your student's"} college-prep progress
          </h1>
          <p className="text-white/60 mt-2 text-sm">
            This is a snapshot shared by the student. Nothing here can be edited from this page.
          </p>
        </header>

        <section className="mb-8 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-sky-400" />
              <h2 className="font-medium">Overall readiness</h2>
            </div>
            <div className="text-4xl font-bold text-sky-400">{readiness.overall}</div>
          </div>
          <div className="space-y-2">
            {readiness.pillars.map((p) => (
              <div key={p.key} className="flex items-center justify-between text-sm">
                <span className="text-white/70 w-36">{p.label}</span>
                <div className="flex-1 mx-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500" style={{ width: `${p.score}%` }} />
                </div>
                <span className="text-white/50 tabular-nums text-xs w-10 text-right">{p.score}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-violet-400" />
              <h3 className="font-medium">Profile</h3>
            </div>
            {profile ? (
              <ul className="text-sm space-y-1.5 text-white/80">
                <li><span className="text-white/50">Major:</span> {profile.intended_major || "—"}</li>
                <li><span className="text-white/50">Top project:</span> {profile.top_project_title || "—"}</li>
                <li><span className="text-white/50">Recent influence:</span> {profile.recent_influence || "—"}</li>
              </ul>
            ) : <p className="text-sm text-white/50">Not filled in yet.</p>}
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Mic className="w-5 h-5 text-sky-400" />
              <h3 className="font-medium">Recent interviews</h3>
            </div>
            {perf.length === 0
              ? <p className="text-sm text-white/50">None yet.</p>
              : <ul className="text-sm space-y-1.5">
                  {perf.map((r, i) => (
                    <li key={i} className="flex justify-between">
                      <span className="text-white/70">{r.company_persona_id || "college"}</span>
                      <span className="text-white/50 text-xs">
                        {new Date(r.created_at).toLocaleDateString()}
                        <span className="ml-2 text-sky-400 font-medium">{r.overall_score ?? "—"}/10</span>
                      </span>
                    </li>
                  ))}
                </ul>}
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="font-medium">Essays ({essays.length})</h3>
            </div>
            {essays.length === 0
              ? <p className="text-sm text-white/50">No essays yet.</p>
              : <ul className="text-sm space-y-1.5">
                  {essays.map((e, i) => (
                    <li key={i} className="flex justify-between gap-3">
                      <span className="text-white/80 truncate">{(e.prompt || "Untitled").slice(0, 60)}</span>
                      <span className="text-xs text-white/50 shrink-0">{e.status}</span>
                    </li>
                  ))}
                </ul>}
          </section>

          <section className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="w-5 h-5 text-orange-400" />
              <h3 className="font-medium">Activities ({acts.length})</h3>
            </div>
            {acts.length === 0
              ? <p className="text-sm text-white/50">None logged yet.</p>
              : <ul className="text-sm space-y-1 text-white/80">
                  {acts.slice(0, 8).map((a, i) => (
                    <li key={i}>
                      {a.title}
                      {a.role ? <span className="text-white/50"> · {a.role}</span> : null}
                      {a.hours_per_week ? <span className="text-white/40 text-xs"> ({a.hours_per_week}h/wk)</span> : null}
                    </li>
                  ))}
                </ul>}
          </section>
        </div>

        <footer className="mt-10 text-xs text-white/40 text-center">
          Shared by {token.label || "the student"} · link can be revoked at any time
        </footer>
      </div>
    </div>
  );
}

// SP-9 — holistic readiness score.
// Deterministic — no LLM. Reads existing tables and computes per-pillar 0-100
// scores + a single composite. Transparent formula so the UI can explain why
// each pillar sits where it does.

import type { SupabaseClient } from "@supabase/supabase-js";

export interface PillarScore {
  key: "profile" | "activities" | "essays" | "interviews" | "resume";
  label: string;
  score: number;
  message: string;
  href: string;
}

export interface ReadinessSnapshot {
  overall: number;
  pillars: PillarScore[];
  computedAt: string;
}

export async function computeReadiness(
  supabase: SupabaseClient,
  userId: string
): Promise<ReadinessSnapshot> {
  const [profileRes, actsRes, essaysRes, perfRes, resumeRes] = await Promise.all([
    supabase
      .from("college_applicant_profile")
      .select("intended_major, top_project_title, top_project_description, recent_influence")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("college_activities")
      .select("title, description, hours_per_week")
      .eq("user_id", userId),
    supabase
      .from("college_essays")
      .select("status, body, word_target")
      .eq("user_id", userId),
    supabase
      .from("interview_performance")
      .select("overall_score, created_at")
      .eq("user_id", userId)
      .eq("category", "college")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("resume_docs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const profile = profileRes.data;
  const acts = actsRes.data || [];
  const essays = essaysRes.data || [];
  const perf = perfRes.data || [];
  const resumeCount = resumeRes.count || 0;

  const pillars: PillarScore[] = [];

  // Profile pillar — 4 fields, each worth 25
  let profileScore = 0;
  if (profile?.intended_major) profileScore += 25;
  if (profile?.top_project_title) profileScore += 25;
  if ((profile?.top_project_description || "").length >= 100) profileScore += 25;
  if (profile?.recent_influence) profileScore += 25;
  pillars.push({
    key: "profile",
    label: "Applicant profile",
    score: profileScore,
    message: profileScore === 100
      ? "All four core fields filled."
      : profileScore >= 50
      ? "Profile partially set — finish the remaining fields."
      : "Fill out major, top project, and recent influence.",
    href: "/college-interviews",
  });

  // Activities pillar — 5-8 strong activities is the sweet spot
  const strongActs = acts.filter((a) => (a.description || "").length >= 80).length;
  const actsScore = Math.min(100, Math.round((strongActs / 6) * 100));
  pillars.push({
    key: "activities",
    label: "Activities list",
    score: actsScore,
    message: strongActs >= 6
      ? `${strongActs} activities with strong descriptions.`
      : strongActs > 0
      ? `${strongActs} described; aim for 5–8 with concrete impact.`
      : "Add activities with descriptions interviewers can probe.",
    href: "/activities",
  });

  // Essays pillar — count of 'done' essays weighted heavier, drafts count partial
  const doneCount = essays.filter((e) => e.status === "done").length;
  const reviewCount = essays.filter((e) => e.status === "review").length;
  const draftingCount = essays.filter((e) => e.status === "drafting").length;
  const essayScore = Math.min(100, doneCount * 35 + reviewCount * 20 + draftingCount * 10);
  pillars.push({
    key: "essays",
    label: "Essays",
    score: essayScore,
    message: doneCount > 0
      ? `${doneCount} essay${doneCount === 1 ? "" : "s"} done, ${reviewCount + draftingCount} in flight.`
      : reviewCount + draftingCount > 0
      ? `${reviewCount + draftingCount} in progress — push one to done.`
      : "Start with the Common App personal statement.",
    href: "/essays",
  });

  // Interviews pillar — average of last 5 (each /10 → ×10) + +10 per session up to 3
  const sessionBonus = Math.min(30, perf.length * 10);
  const avg = perf.length > 0
    ? perf.reduce((a, b) => a + (b.overall_score || 0), 0) / perf.length
    : 0;
  const interviewScore = Math.min(100, Math.round(avg * 10 * 0.7 + sessionBonus));
  pillars.push({
    key: "interviews",
    label: "Interview reps",
    score: interviewScore,
    message: perf.length === 0
      ? "No college interview practice yet — reps unlock specificity."
      : `Avg ${avg.toFixed(1)}/10 across ${perf.length} session${perf.length === 1 ? "" : "s"}.`,
    href: "/college-interviews",
  });

  // Resume pillar — binary for now: uploaded or not
  const resumeScore = resumeCount > 0 ? 100 : 0;
  pillars.push({
    key: "resume",
    label: "Resume",
    score: resumeScore,
    message: resumeCount > 0
      ? `${resumeCount} resume doc${resumeCount === 1 ? "" : "s"} uploaded.`
      : "Upload a resume to ground your activity bullets.",
    href: "/resumes",
  });

  // Composite — weighted: profile 15, activities 25, essays 30, interviews 20, resume 10
  const overall = Math.round(
    profileScore * 0.15 +
    actsScore * 0.25 +
    essayScore * 0.30 +
    interviewScore * 0.20 +
    resumeScore * 0.10
  );

  return {
    overall,
    pillars,
    computedAt: new Date().toISOString(),
  };
}

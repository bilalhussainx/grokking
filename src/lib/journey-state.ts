// SP-13 — long-term user activity evaluator.
// Derives the student's current journey stage from activity in existing tables.
// No persistence: it's a read-time computation so adding new signals doesn't require a migration.
//
// States (college track):
//   discovering          → no profile filled, no activity
//   profile_building     → profile filled, but no essay/interview activity yet
//   essay_drafting       → has essay draft(s) still in 'ideation' or 'drafting' status
//   essay_polishing      → has essay draft(s) in 'review' or 'done' status
//   interview_practice   → has ≥1 college interview session in the last 30 days
//   applications_submitted / waiting / admitted — placeholders for future SP (not yet trackable)

import type { SupabaseClient } from "@supabase/supabase-js";

export type JourneyState =
  | "discovering"
  | "profile_building"
  | "essay_drafting"
  | "essay_polishing"
  | "interview_practice";

export interface NextAction {
  label: string;
  href: string;
  reason: string;
}

export interface JourneySnapshot {
  state: JourneyState;
  title: string;
  message: string;
  nextActions: NextAction[];
  signals: {
    hasProfile: boolean;
    essayDraftCount: number;
    essayReviewCount: number;
    resumeDocCount: number;
    recentInterviewCount: number;
  };
}

export async function computeJourneyState(
  supabase: SupabaseClient,
  userId: string
): Promise<JourneySnapshot> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [profileRes, draftsRes, resumesRes, interviewsRes] = await Promise.all([
    supabase
      .from("college_applicant_profile")
      .select("user_id, intended_major, top_project_title")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("essay_drafts")
      .select("id, status")
      .eq("user_id", userId),
    supabase
      .from("resume_docs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("interview_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("category", "college")
      .gte("created_at", thirtyDaysAgo),
  ]);

  const profile = profileRes.data;
  const drafts = draftsRes.data || [];
  const resumeDocCount = resumesRes.count || 0;
  const recentInterviewCount = interviewsRes.count || 0;

  const hasProfile = Boolean(profile?.intended_major || profile?.top_project_title);
  const essayDraftCount = drafts.filter((d) => d.status === "ideation" || d.status === "drafting").length;
  const essayReviewCount = drafts.filter((d) => d.status === "review" || d.status === "done").length;

  const signals = {
    hasProfile,
    essayDraftCount,
    essayReviewCount,
    resumeDocCount,
    recentInterviewCount,
  };

  // State priority: interview_practice > essay_polishing > essay_drafting > profile_building > discovering.
  // Whichever is the "most advanced" active signal wins — represents current focus, not furthest ever reached.
  if (recentInterviewCount > 0) {
    return {
      state: "interview_practice",
      title: "Interview practice mode",
      message: `You've done ${recentInterviewCount} college interview${recentInterviewCount === 1 ? "" : "s"} in the last 30 days. Keep the reps up — specificity compounds.`,
      nextActions: [
        { label: "Start another interview", href: "/college-interviews", reason: "Repetition builds school-fit answers." },
        { label: "Refine an essay", href: "/essays", reason: "Interviewers often probe essays directly." },
      ],
      signals,
    };
  }

  if (essayReviewCount > 0) {
    return {
      state: "essay_polishing",
      title: "Polishing essays",
      message: `You have ${essayReviewCount} essay${essayReviewCount === 1 ? "" : "s"} in review. Once one feels final, pair it with a mock interview — interviewers ask about essays.`,
      nextActions: [
        { label: "Open essay workbench", href: "/essays", reason: "Finish the critique pass." },
        { label: "Practice a college interview", href: "/college-interviews", reason: "Rehearse how you'd talk about the essay aloud." },
      ],
      signals,
    };
  }

  if (essayDraftCount > 0) {
    return {
      state: "essay_drafting",
      title: "Drafting essays",
      message: `You have ${essayDraftCount} essay${essayDraftCount === 1 ? "" : "s"} in progress. Get to a full draft, then let the critic pass rip it apart.`,
      nextActions: [
        { label: "Continue drafting", href: "/essays", reason: "Pick up where you left off." },
        { label: "Upload your resume", href: "/resumes", reason: "Ground activity bullets before writing the supplementals." },
      ],
      signals,
    };
  }

  if (hasProfile || resumeDocCount > 0) {
    return {
      state: "profile_building",
      title: "Profile in place",
      message: "Your applicant profile is set up. The next highest-leverage move is writing your Common App personal statement.",
      nextActions: [
        { label: "Start an essay", href: "/essays/new", reason: "Common App personal statement first — supplementals come from it." },
        { label: "Upload your resume", href: "/resumes", reason: "Rewrites keyed to each target role." },
        { label: "Practice a college interview", href: "/college-interviews", reason: "Rehearsing surfaces what's thin in your profile." },
      ],
      signals,
    };
  }

  return {
    state: "discovering",
    title: "Welcome — let's get oriented",
    message: "Tell us what you're aiming for. Fill out your applicant profile so the coach can personalize everything downstream.",
    nextActions: [
      { label: "Set up your profile", href: "/college-interviews", reason: "Fill out major, top project, recent influence — takes 3 minutes." },
      { label: "Browse common questions", href: "/college-interviews", reason: "See what alumni interviewers actually ask at your target schools." },
    ],
    signals,
  };
}

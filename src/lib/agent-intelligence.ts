/**
 * Agent Intelligence Layer
 *
 * Fetches rich context from Supabase for every AI interaction.
 * Every agent (Coach Kairos, Language Tutor, Talk) calls this before responding.
 * This is the RAG brain — the more data it has, the smarter the agent gets.
 */

import { createAdminSupabase } from "@/lib/supabase-auth";

export interface UserIntelligence {
  // Identity
  name: string;
  email: string;
  role: string;
  nativeLanguage: string;
  instructionLanguage: string;
  learningStyle: string;
  interests: string[];
  englishFluency: string;

  // Progress journey
  totalXP: number;
  level: number;
  streak: number;
  creditsRemaining: number;
  totalLessonsCompleted: number;
  coursesInProgress: string[];

  // Recent activity (what they did in last 3 sessions)
  recentActivity: string[];

  // Struggle patterns (from credit_txns and xp data)
  topicsStruggled: string[];
  topicsExcelled: string[];

  // Session memory (last 5 coach conversations)
  recentCoachMessages: { role: string; text: string }[];

  // Computed personality brief
  personalityBrief: string;

  // Pre-built prompt injection
  promptContext: string;
}

/**
 * Fetch everything we know about a user for AI context enrichment.
 * Call this once per session start — cached for the session duration.
 */
export async function fetchUserIntelligence(userId: string): Promise<UserIntelligence> {
  let admin;
  try {
    admin = createAdminSupabase();
  } catch {
    return getDefaultIntelligence();
  }

  // Parallel fetch — all data at once
  const [profileResult, creditsResult, xpResult, recentTxns, recentSessions] = await Promise.all([
    admin.from("user_profiles").select("*").eq("id", userId).single(),
    admin.rpc("get_credit_balance", { p_user_id: userId }),
    admin.from("xp_transactions").select("xp_amount, action, metadata").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
    admin.from("credit_txns").select("action, ref_id, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(15),
    admin.from("language_sessions").select("persona_id, target_language, agent_summary, duration_seconds").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
  ]);

  const profile = profileResult.data;
  const credits = (creditsResult.data as number) || 0;
  const xpRows = xpResult.data || [];
  const txns = recentTxns.data || [];
  const sessions = recentSessions.data || [];

  // Calculate totals
  const totalXP = xpRows.reduce((sum: number, r: { xp_amount: number }) => sum + (r.xp_amount || 0), 0);
  const level = Math.floor(totalXP / 500) + 1;
  const lessonsCompleted = xpRows.filter((r: { action: string }) => r.action === "lesson_complete").length;

  // Extract courses in progress from credit transactions
  const coursesInProgress = [...new Set(
    txns
      .filter((t: { action: string; ref_id: string | null }) => t.ref_id && t.action === "coach_text")
      .map((t: { ref_id: string | null }) => t.ref_id)
      .filter(Boolean)
  )].slice(0, 5) as string[];

  // Recent activity log
  const recentActivity = txns.slice(0, 8).map((t: { action: string; ref_id: string | null; created_at: string }) => {
    const time = new Date(t.created_at).toLocaleDateString();
    return `${time}: ${t.action}${t.ref_id ? ` (${t.ref_id})` : ""}`;
  });

  // Session summaries
  const recentCoachMessages: { role: string; text: string }[] = [];
  for (const session of sessions) {
    if (session.agent_summary) {
      recentCoachMessages.push({ role: "system", text: `Previous session summary: ${session.agent_summary}` });
    }
  }

  // Parse interests
  let interests: string[] = [];
  try {
    interests = profile?.learning_interests || [];
  } catch { interests = []; }

  // Build personality brief
  const name = profile?.full_name || "there";
  const streak = profile?.login_streak || 0;
  const style = profile?.learning_style || "balanced";

  let personalityBrief = "";
  if (lessonsCompleted === 0) {
    personalityBrief = `${name} is brand new — be extra welcoming, patient, and encouraging. Make them feel this was the best decision they made today.`;
  } else if (lessonsCompleted < 5) {
    personalityBrief = `${name} is early in their journey (${lessonsCompleted} lessons). They're still forming habits. Celebrate every small win. Make them want to come back.`;
  } else if (streak >= 7) {
    personalityBrief = `${name} is on a ${streak}-day streak with ${lessonsCompleted} lessons done. They're committed. Challenge them. Push them slightly beyond their comfort zone.`;
  } else {
    personalityBrief = `${name} has completed ${lessonsCompleted} lessons. They know the platform. Be direct, substantive, and skip the hand-holding.`;
  }

  if (style === "auditory") {
    personalityBrief += " They prefer listening — explain verbally, use analogies, keep it conversational.";
  } else if (style === "reading") {
    personalityBrief += " They prefer reading — be concise, point them to the text, don't over-explain.";
  }

  // Build the full prompt context
  const promptContext = buildPromptContext({
    name, streak, level, totalXP, lessonsCompleted, credits,
    interests, style, personalityBrief,
    recentActivity, recentCoachMessages,
    nativeLanguage: profile?.native_language || "en",
    instructionLanguage: profile?.instruction_language || "en",
  });

  return {
    name,
    email: profile?.email || "",
    role: profile?.role || "student",
    nativeLanguage: profile?.native_language || "en",
    instructionLanguage: profile?.instruction_language || "en",
    learningStyle: style,
    interests,
    englishFluency: profile?.english_fluency || "native",
    totalXP,
    level,
    streak,
    creditsRemaining: credits,
    totalLessonsCompleted: lessonsCompleted,
    coursesInProgress,
    recentActivity,
    topicsStruggled: [],
    topicsExcelled: [],
    recentCoachMessages,
    personalityBrief,
    promptContext,
  };
}

function buildPromptContext(data: {
  name: string; streak: number; level: number; totalXP: number;
  lessonsCompleted: number; credits: number; interests: string[];
  style: string; personalityBrief: string;
  recentActivity: string[]; recentCoachMessages: { role: string; text: string }[];
  nativeLanguage: string; instructionLanguage: string;
}): string {
  const parts: string[] = [];

  parts.push(`## STUDENT INTELLIGENCE (from database — use this to personalize)`);
  parts.push(`Name: ${data.name}`);
  parts.push(`Level ${data.level} (${data.totalXP} XP) · ${data.lessonsCompleted} lessons completed · ${data.streak}-day streak`);
  parts.push(`Credits: ${data.credits} remaining`);
  if (data.nativeLanguage !== "en") parts.push(`Native language: ${data.nativeLanguage}`);
  if (data.instructionLanguage !== "en") parts.push(`Prefers instruction in: ${data.instructionLanguage}`);
  if (data.interests.length > 0) parts.push(`Interests: ${data.interests.join(", ")}`);

  parts.push(`\n## PERSONALITY DIRECTIVE`);
  parts.push(data.personalityBrief);

  if (data.recentActivity.length > 0) {
    parts.push(`\n## RECENT ACTIVITY (what they've been doing)`);
    parts.push(data.recentActivity.slice(0, 5).join("\n"));
  }

  if (data.recentCoachMessages.length > 0) {
    parts.push(`\n## PREVIOUS SESSION CONTEXT`);
    for (const msg of data.recentCoachMessages.slice(0, 3)) {
      parts.push(msg.text);
    }
  }

  parts.push(`\n## ENGAGEMENT RULES`);
  parts.push(`- Use ${data.name}'s name naturally (not every sentence, but enough to feel personal)`);
  parts.push(`- If they're silent or seem disengaged, DON'T wait — ask a question, offer a challenge, or share an interesting fact`);
  parts.push(`- Make this feel like a live class they signed up for, not a chatbot they're poking`);
  parts.push(`- Track what they've said this session — don't repeat yourself, build on previous points`);
  parts.push(`- Keep responses to 1-3 sentences for text, 1-2 for voice`);

  return parts.join("\n");
}

function getDefaultIntelligence(): UserIntelligence {
  return {
    name: "there",
    email: "",
    role: "student",
    nativeLanguage: "en",
    instructionLanguage: "en",
    learningStyle: "balanced",
    interests: [],
    englishFluency: "native",
    totalXP: 0,
    level: 1,
    streak: 0,
    creditsRemaining: 0,
    totalLessonsCompleted: 0,
    coursesInProgress: [],
    recentActivity: [],
    topicsStruggled: [],
    topicsExcelled: [],
    recentCoachMessages: [],
    personalityBrief: "New user — be welcoming and encouraging.",
    promptContext: "## STUDENT: New user. Be welcoming.",
  };
}

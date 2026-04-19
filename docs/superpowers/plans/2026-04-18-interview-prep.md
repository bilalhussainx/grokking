# Feature 6.10 — Interview Prep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the existing college admissions interview system (10 personas, adaptive arc, scoring) to Coach Kairos CC via a school-list-aware dashboard with essay context wiring.

**Architecture:** Hybrid — CC-native dashboard page fetches the student's school list, matches schools to personas, shows 4-session arc progress and scores. "Practice" button launches the existing `/college-interviews/` flow with query params. Essay context optionally wired into the interviewer prompt.

**Tech Stack:** Next.js 14 App Router, TypeScript, Supabase, existing college interview engine

---

### Task 1: School-to-Persona Matcher Utility

**Files:**
- Create: `src/lib/cc/school-persona-matcher.ts`

- [ ] **Step 1: Create the matcher module**

```typescript
// src/lib/cc/school-persona-matcher.ts
import { COLLEGE_PERSONAS, type CollegePersona } from "@/data/college-interviewer-personas";

const OVERRIDE_MAP: Record<string, string> = {
  "university of pennsylvania": "penn-undergrad",
  "massachusetts institute of technology": "mit-undergrad",
};

export function matchSchoolToPersona(schoolName: string): CollegePersona | null {
  const lower = schoolName.toLowerCase();

  const overrideId = OVERRIDE_MAP[lower];
  if (overrideId) {
    return COLLEGE_PERSONAS.find((p) => p.id === overrideId) || null;
  }

  return (
    COLLEGE_PERSONAS.find((p) => lower.includes(p.shortName.toLowerCase())) ||
    null
  );
}

export const SUPPORTED_SCHOOLS = COLLEGE_PERSONAS.map((p) => p.shortName);
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/lib/cc/school-persona-matcher.ts 2>&1 || echo 'check errors'`
Expected: no errors (or only unrelated project-wide errors)

- [ ] **Step 3: Commit**

```bash
git add src/lib/cc/school-persona-matcher.ts
git commit -m "feat(cc): school-to-persona matcher utility"
```

---

### Task 2: Essay Context in Prompt Builder

**Files:**
- Modify: `src/lib/college-interview-prompt-builders.ts:15-21` (ApplicantProfile interface)
- Modify: `src/lib/college-interview-prompt-builders.ts:233-258` (buildApplicantProfileBlock function)

- [ ] **Step 1: Add essayContext to ApplicantProfile**

In `src/lib/college-interview-prompt-builders.ts`, change the `ApplicantProfile` interface (lines 15-21) from:

```typescript
export interface ApplicantProfile {
  intendedMajor?: string;
  topProjectTitle?: string;
  topProjectDescription?: string;
  recentInfluence?: string;
  whyThisSchool?: string;
}
```

to:

```typescript
export interface ApplicantProfile {
  intendedMajor?: string;
  topProjectTitle?: string;
  topProjectDescription?: string;
  recentInfluence?: string;
  whyThisSchool?: string;
  essayContext?: {
    prompt: string;
    excerpt: string;
  };
}
```

- [ ] **Step 2: Add essay block to buildApplicantProfileBlock**

In the same file, find the `buildApplicantProfileBlock` function. After the `whyThisSchool` block (around line 251) and before the `IMPORTANT:` line (line 253), add:

```typescript
  if (profile.essayContext) {
    lines.push('');
    lines.push('## CANDIDATE\'S ESSAY (use to ask specific, probing follow-up questions)');
    lines.push(`Prompt: "${profile.essayContext.prompt}"`);
    lines.push(`Opening excerpt: "${profile.essayContext.excerpt}"`);
    lines.push('Ask 1-2 questions about this essay during the interview — probe for authenticity and depth behind the story.');
  }
```

The full function should now be:

```typescript
function buildApplicantProfileBlock(profile: ApplicantProfile): string {
  const lines: string[] = ['', '## CANDIDATE CONTEXT'];
  lines.push('You read the following about this candidate before the interview. Use it to ask SPECIFIC, personalized questions:');

  if (profile.intendedMajor) {
    lines.push(`- Intended major: ${profile.intendedMajor}`);
  }
  if (profile.topProjectTitle || profile.topProjectDescription) {
    lines.push(`- Top project / extracurricular: ${profile.topProjectTitle || ''}`);
    if (profile.topProjectDescription) {
      lines.push(`  Description: ${profile.topProjectDescription}`);
    }
  }
  if (profile.recentInfluence) {
    lines.push(`- Recent book/article they mentioned as influential: ${profile.recentInfluence}`);
  }
  if (profile.whyThisSchool) {
    lines.push(`- What they said about why they want this school: ${profile.whyThisSchool}`);
  }

  if (profile.essayContext) {
    lines.push('');
    lines.push('## CANDIDATE\'S ESSAY (use to ask specific, probing follow-up questions)');
    lines.push(`Prompt: "${profile.essayContext.prompt}"`);
    lines.push(`Opening excerpt: "${profile.essayContext.excerpt}"`);
    lines.push('Ask 1-2 questions about this essay during the interview — probe for authenticity and depth behind the story.');
  }

  lines.push('');
  lines.push('IMPORTANT: Use these to ask DEEP follow-ups. Do NOT just ask "tell me about your project" — ask SPECIFIC questions like "you mentioned [X] about your [project] — walk me through how you decided to do that." Personalization is the most important thing.');
  lines.push('');

  return lines.join('\n');
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit src/lib/college-interview-prompt-builders.ts 2>&1 || echo 'check errors'`

- [ ] **Step 4: Commit**

```bash
git add src/lib/college-interview-prompt-builders.ts
git commit -m "feat(cc): add essayContext to college interview prompt builder"
```

---

### Task 3: CC Interview Sessions API — List

**Files:**
- Create: `src/app/api/cc/interview/sessions/route.ts`

- [ ] **Step 1: Create the sessions list route**

```typescript
// src/app/api/cc/interview/sessions/route.ts
import { NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../helpers";
import { createAdminSupabase } from "@/lib/supabase-server";

interface SessionGroup {
  totalSessions: number;
  currentArcStep: number;
  latestScore: {
    overallRecommendation: number;
    recommendationLabel: string;
    sessionId: string;
  } | null;
  sessions: {
    id: string;
    arcStep: number;
    status: string;
    startedAt: string;
    overallScore: number | null;
  }[];
}

const REC_LABELS: Record<number, string> = {
  1: "Do not recommend",
  2: "Recommend with concerns",
  3: "Neutral",
  4: "Recommend",
  5: "Strongly recommend",
};

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();

  const { data: rawSessions } = await db
    .from("interview_sessions")
    .select("id, college_persona_id, status, started_at, ended_at")
    .eq("user_id", auth.user.id)
    .eq("category", "college")
    .not("college_persona_id", "is", null)
    .order("created_at", { ascending: true });

  if (!rawSessions || rawSessions.length === 0) {
    return NextResponse.json({ sessions: {} });
  }

  const sessionIds = rawSessions.map((s) => s.id);
  const { data: performances } = await db
    .from("interview_performance")
    .select("session_id, overall_score")
    .in("session_id", sessionIds);

  const scoreMap = new Map<string, number>();
  for (const p of performances || []) {
    scoreMap.set(p.session_id, p.overall_score);
  }

  const grouped: Record<string, SessionGroup> = {};

  for (const s of rawSessions) {
    const pid = s.college_persona_id as string;
    if (!grouped[pid]) {
      grouped[pid] = {
        totalSessions: 0,
        currentArcStep: 1,
        latestScore: null,
        sessions: [],
      };
    }
    const g = grouped[pid];
    g.totalSessions += 1;

    const overallScore = scoreMap.get(s.id) ?? null;
    const arcStep = g.totalSessions;

    g.sessions.push({
      id: s.id,
      arcStep,
      status: s.status,
      startedAt: s.started_at,
      overallScore,
    });
  }

  for (const pid of Object.keys(grouped)) {
    const g = grouped[pid];
    g.currentArcStep = Math.min(g.totalSessions + 1, 4);

    const completedWithScores = g.sessions
      .filter((s) => s.overallScore !== null)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    if (completedWithScores.length > 0) {
      const latest = completedWithScores[0];
      const rec = Math.round((latest.overallScore! / 10) * 5);
      const clamped = Math.max(1, Math.min(5, rec));
      g.latestScore = {
        overallRecommendation: clamped,
        recommendationLabel: REC_LABELS[clamped] || "Neutral",
        sessionId: latest.id,
      };
    }
  }

  return NextResponse.json({ sessions: grouped });
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/app/api/cc/interview/sessions/route.ts 2>&1 || echo 'check errors'`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/cc/interview/sessions/route.ts
git commit -m "feat(cc): interview sessions list API grouped by persona"
```

---

### Task 4: CC Interview Sessions API — Single Scorecard

**Files:**
- Create: `src/app/api/cc/interview/sessions/[session_id]/route.ts`

- [ ] **Step 1: Create the single session route**

```typescript
// src/app/api/cc/interview/sessions/[session_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized } from "../../../helpers";
import { createAdminSupabase } from "@/lib/supabase-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ session_id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { session_id } = await params;

  const db = createAdminSupabase();

  const { data: session } = await db
    .from("interview_sessions")
    .select("id, college_persona_id, status, started_at, ended_at, category")
    .eq("id", session_id)
    .eq("user_id", auth.user.id)
    .eq("category", "college")
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: perf } = await db
    .from("interview_performance")
    .select(
      "overall_score, communication_score, technical_depth_score, problem_solving_score, code_quality_score, strengths, improvements, question_scores, topics_strong, topics_weak"
    )
    .eq("session_id", session_id)
    .single();

  return NextResponse.json({
    session: {
      id: session.id,
      collegePersonaId: session.college_persona_id,
      status: session.status,
      startedAt: session.started_at,
      endedAt: session.ended_at,
    },
    scorecard: perf
      ? {
          overallScore: perf.overall_score,
          communicationScore: perf.communication_score,
          technicalDepthScore: perf.technical_depth_score,
          problemSolvingScore: perf.problem_solving_score,
          codeQualityScore: perf.code_quality_score,
          strengths: perf.strengths,
          improvements: perf.improvements,
          questionScores: perf.question_scores,
          topicsStrong: perf.topics_strong,
          topicsWeak: perf.topics_weak,
        }
      : null,
  });
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/app/api/cc/interview/sessions/[session_id]/route.ts 2>&1 || echo 'check errors'`

- [ ] **Step 3: Commit**

```bash
git add "src/app/api/cc/interview/sessions/[session_id]/route.ts"
git commit -m "feat(cc): single interview session scorecard API"
```

---

### Task 5: Delete CC Interview Stubs

**Files:**
- Delete: `src/app/api/cc/interview/start/route.ts`
- Delete: `src/app/api/cc/interview/[session_id]/route.ts`
- Delete: `src/app/api/cc/interview/[session_id]/turn/route.ts`

- [ ] **Step 1: Remove the stub files**

```bash
rm src/app/api/cc/interview/start/route.ts
rm src/app/api/cc/interview/\[session_id\]/route.ts
rm src/app/api/cc/interview/\[session_id\]/turn/route.ts
```

- [ ] **Step 2: Remove empty directories**

```bash
rmdir src/app/api/cc/interview/start 2>/dev/null || true
rmdir src/app/api/cc/interview/\[session_id\] 2>/dev/null || true
```

Note: The `[session_id]` directory under `interview/` may not be empty if the new `sessions/` directory is a sibling. Only the old `start/` dir and the old `[session_id]/` dir (not `sessions/[session_id]/`) should be removed.

- [ ] **Step 3: Commit**

```bash
git add -A src/app/api/cc/interview/
git commit -m "chore(cc): remove interview stub routes (replaced by sessions API)"
```

---

### Task 6: Interview Prep Dashboard — Layout

**Files:**
- Create: `src/app/cc/interview-prep/layout.tsx`

- [ ] **Step 1: Create the layout file**

```typescript
// src/app/cc/interview-prep/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Interview Prep — Kairos.ai",
  description: "Practice college admissions interviews with AI alumni personas",
};

export default function InterviewPrepLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/cc/interview-prep/layout.tsx
git commit -m "feat(cc): interview prep layout with metadata"
```

---

### Task 7: Interview Prep Dashboard — Page

**Files:**
- Create: `src/app/cc/interview-prep/page.tsx`

This is the largest task. The page fetches the student's school list, matches schools to personas, fetches interview session history, and renders the school card grid with arc progress and scores.

- [ ] **Step 1: Create the dashboard page**

```tsx
// src/app/cc/interview-prep/page.tsx
"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Clock, CheckCircle, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { matchSchoolToPersona, SUPPORTED_SCHOOLS } from "@/lib/cc/school-persona-matcher";
import type { CollegePersona } from "@/data/college-interviewer-personas";

interface School {
  id: string;
  school_id: string;
  chancing_band: string;
  application_status: string;
  cc_schools: {
    id: string;
    name: string;
    city: string;
    state: string;
    acceptance_rate: number | null;
  };
}

interface SessionInfo {
  totalSessions: number;
  currentArcStep: number;
  latestScore: {
    overallRecommendation: number;
    recommendationLabel: string;
    sessionId: string;
  } | null;
  sessions: {
    id: string;
    arcStep: number;
    status: string;
    startedAt: string;
    overallScore: number | null;
  }[];
}

const ARC_STEPS = [
  { label: "Assess", full: "Assess Narrative" },
  { label: "Weak Areas", full: "Weak Areas" },
  { label: "Full Mock", full: "Full Mock" },
  { label: "Essays", full: "Essay Coaching" },
];

const SCHOOL_EMOJIS: Record<string, string> = {
  "harvard-undergrad": "🟥",
  "yale-undergrad": "🟦",
  "princeton-undergrad": "🟧",
  "columbia-undergrad": "🟦",
  "penn-undergrad": "🟦",
  "brown-undergrad": "🟫",
  "dartmouth-undergrad": "🟩",
  "cornell-undergrad": "⬜",
  "stanford-undergrad": "🟥",
  "mit-undergrad": "⬛",
};

export default function InterviewPrepPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [sessionData, setSessionData] = useState<Record<string, SessionInfo>>({});
  const [loading, setLoading] = useState(true);
  const [includeEssays, setIncludeEssays] = useState<Record<string, boolean>>({});
  const [expandedScorecard, setExpandedScorecard] = useState<string | null>(null);
  const [scorecardData, setScorecardData] = useState<Record<string, unknown> | null>(null);
  const [scorecardLoading, setScorecardLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/cc/school-list").then((r) => r.json()),
      fetch("/api/cc/interview/sessions").then((r) => r.json()),
    ])
      .then(([schoolRes, sessionRes]) => {
        setSchools(schoolRes.schools || []);
        setSessionData(sessionRes.sessions || {});
      })
      .finally(() => setLoading(false));
  }, []);

  const loadScorecard = async (sessionId: string) => {
    if (expandedScorecard === sessionId) {
      setExpandedScorecard(null);
      return;
    }
    setExpandedScorecard(sessionId);
    setScorecardLoading(true);
    setScorecardData(null);
    const res = await fetch(`/api/cc/interview/sessions/${sessionId}`);
    const data = await res.json();
    setScorecardData(data.scorecard);
    setScorecardLoading(false);
  };

  const buildLaunchUrl = (personaId: string, withEssays: boolean) => {
    const params = new URLSearchParams({
      persona: personaId,
      feedbackLang: "en",
      returnTo: "/cc/interview-prep",
    });
    if (withEssays) params.set("includeEssays", "true");
    return `/college-interviews?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <GraduationCap className="w-12 h-12 text-white/10 mx-auto mb-3" />
        <p className="text-sm text-white/30 mb-4">
          Add schools to your list first, then come back to practice interviews.
        </p>
        <a
          href="/cc/school-list"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
        >
          Go to School List <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  const schoolCards = schools.map((s) => {
    const persona = matchSchoolToPersona(s.cc_schools.name);
    const personaId = persona?.id || null;
    const info = personaId ? sessionData[personaId] : null;
    return { school: s, persona, personaId, info };
  });

  const hasAnyPersona = schoolCards.some((c) => c.persona !== null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Interview Prep</h1>
        <p className="text-sm text-white/40 mt-1">
          Practice alumni interviews for schools on your list
        </p>
      </div>

      {!hasAnyPersona && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/40">
          Interview practice is available for: {SUPPORTED_SCHOOLS.join(", ")}.
          Add one of these schools to your list to get started.
        </div>
      )}

      <div className="space-y-3">
        {schoolCards.map(({ school, persona, personaId, info }) => (
          <div
            key={school.id}
            className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden"
          >
            <div className="px-5 py-4">
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {persona ? (
                    <span className="text-lg">{SCHOOL_EMOJIS[persona.id] || "🎓"}</span>
                  ) : (
                    <span className="text-lg opacity-30">🎓</span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {school.cc_schools.name}
                    </p>
                    <p className="text-xs text-white/30">
                      {school.cc_schools.city}, {school.cc_schools.state}
                      {school.cc_schools.acceptance_rate
                        ? ` · ${school.cc_schools.acceptance_rate}% acceptance`
                        : ""}
                    </p>
                  </div>
                </div>

                {persona ? (
                  <span className="flex items-center gap-1 text-[10px] text-green-400/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Ready
                  </span>
                ) : (
                  <span className="text-[10px] text-white/20 px-2 py-0.5 rounded-full border border-white/10">
                    Coming soon
                  </span>
                )}
              </div>

              {/* Arc progress */}
              {persona && (
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1.5">
                    {ARC_STEPS.map((step, i) => {
                      const stepNum = i + 1;
                      const completed = info ? info.totalSessions >= stepNum : false;
                      const current = info
                        ? info.currentArcStep === stepNum
                        : stepNum === 1;
                      return (
                        <div key={step.label} className="flex items-center gap-1 flex-1">
                          <div
                            className={`h-1.5 flex-1 rounded-full ${
                              completed
                                ? "bg-green-500/60"
                                : current
                                ? "bg-[#D4AF37]/60"
                                : "bg-white/5"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/30">
                      {info
                        ? `Session ${Math.min(info.totalSessions + 1, 4)} of 4 — ${
                            ARC_STEPS[Math.min(info.currentArcStep, 4) - 1].full
                          }`
                        : "Session 1 of 4 — Assess Narrative"}
                    </p>
                    {info?.latestScore && (
                      <p className="text-[10px] text-[#D4AF37]">
                        {info.latestScore.recommendationLabel}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {persona && personaId && (
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={buildLaunchUrl(personaId, !!includeEssays[personaId])}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] transition-colors"
                  >
                    <GraduationCap className="w-3 h-3" /> Practice
                  </a>

                  <label className="flex items-center gap-1.5 text-[10px] text-white/30 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!includeEssays[personaId]}
                      onChange={(e) =>
                        setIncludeEssays((prev) => ({
                          ...prev,
                          [personaId]: e.target.checked,
                        }))
                      }
                      className="rounded border-white/20 bg-white/5 text-[#D4AF37] w-3 h-3"
                    />
                    <BookOpen className="w-3 h-3" /> Include my essays
                  </label>

                  {info?.latestScore && (
                    <button
                      onClick={() => loadScorecard(info.latestScore!.sessionId)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/40 border border-white/10 hover:text-white/60 hover:border-white/20 transition-colors ml-auto"
                    >
                      View Scorecard
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Inline scorecard */}
            {expandedScorecard && info?.latestScore?.sessionId === expandedScorecard && (
              <div className="px-5 pb-5 border-t border-white/5 pt-4">
                {scorecardLoading ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                    <span className="text-xs text-white/40">Loading scorecard...</span>
                  </div>
                ) : scorecardData ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: "Overall", value: (scorecardData as Record<string, number>).overallScore },
                        { label: "Communication", value: (scorecardData as Record<string, number>).communicationScore },
                        { label: "Depth", value: (scorecardData as Record<string, number>).technicalDepthScore },
                        { label: "Problem Solving", value: (scorecardData as Record<string, number>).problemSolvingScore },
                      ].map((d) => (
                        <div key={d.label} className="p-2 rounded-lg bg-white/5 text-center">
                          <p className="text-lg font-bold text-white">{d.value?.toFixed(1) || "—"}</p>
                          <p className="text-[10px] text-white/30">{d.label}</p>
                        </div>
                      ))}
                    </div>
                    {(scorecardData as Record<string, string[]>).strengths?.length > 0 && (
                      <div>
                        <h4 className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Strengths</h4>
                        <ul className="space-y-1">
                          {((scorecardData as Record<string, string[]>).strengths).map((s: string, i: number) => (
                            <li key={i} className="text-xs text-white/50 flex gap-1.5">
                              <CheckCircle className="w-3 h-3 text-green-400/50 shrink-0 mt-0.5" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(scorecardData as Record<string, string[]>).improvements?.length > 0 && (
                      <div>
                        <h4 className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Areas to Improve</h4>
                        <ul className="space-y-1">
                          {((scorecardData as Record<string, string[]>).improvements).map((s: string, i: number) => (
                            <li key={i} className="text-xs text-white/50 flex gap-1.5">
                              <Clock className="w-3 h-3 text-amber-400/50 shrink-0 mt-0.5" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-white/30">No scorecard data available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit src/app/cc/interview-prep/page.tsx 2>&1 || echo 'check errors'`

- [ ] **Step 3: Commit**

```bash
git add src/app/cc/interview-prep/page.tsx
git commit -m "feat(cc): interview prep dashboard with school grid, arc progress, and scorecards"
```

---

### Task 8: Modify CollegeInterviewSetup to Accept Query Params

**Files:**
- Modify: `src/components/college/CollegeInterviewSetup.tsx`

- [ ] **Step 1: Add useSearchParams import and param reading**

At the top of the file, add `useSearchParams` to the `next/navigation` import:

Change:
```typescript
import { useRouter } from "next/navigation";
```
to:
```typescript
import { useRouter, useSearchParams } from "next/navigation";
```

- [ ] **Step 2: Add state and param reading inside the component**

Inside the `CollegeInterviewSetup` function, after the existing state declarations (after line 63 where `error` is declared), add:

```typescript
  const searchParams = useSearchParams();
  const presetPersona = searchParams.get("persona");
  const presetFeedbackLang = searchParams.get("feedbackLang");
  const returnTo = searchParams.get("returnTo");
  const shouldIncludeEssays = searchParams.get("includeEssays") === "true";

  const [essayContext, setEssayContext] = useState<{ prompt: string; excerpt: string } | undefined>(undefined);
```

- [ ] **Step 3: Add useEffect to pre-fill from query params and fetch essays**

After the existing profile-loading `useEffect` (the one that ends around line 91), add:

```typescript
  // Pre-fill from CC query params
  useEffect(() => {
    if (presetPersona && !collegePersonaId) {
      setCollegePersonaId(presetPersona);
    }
    if (presetFeedbackLang && feedbackLanguage === "en") {
      setFeedbackLanguage(presetFeedbackLang);
    }
  }, [presetPersona, presetFeedbackLang]);

  // Fetch essay context when includeEssays param is set
  useEffect(() => {
    if (!shouldIncludeEssays) return;
    (async () => {
      try {
        const res = await fetch("/api/cc/essays");
        const data = await res.json();
        const essays = data.essays || [];
        const draft = essays.find(
          (e: { phase: string }) => e.phase === "draft" || e.phase === "revise"
        );
        if (draft) {
          setEssayContext({
            prompt: draft.prompt_text || "",
            excerpt: (draft.content || "").slice(0, 500),
          });
        }
      } catch {
        // non-fatal — proceed without essay context
      }
    })();
  }, [shouldIncludeEssays]);
```

- [ ] **Step 4: Pass essayContext into applicantProfile in handleStart**

In the `handleStart` function, find the `applicantProfile` object (around line 117). Add `essayContext`:

Change:
```typescript
    const applicantProfile = {
      intendedMajor: intendedMajor.trim() || undefined,
      topProjectTitle: topProjectTitle.trim() || undefined,
      topProjectDescription: topProjectDescription.trim() || undefined,
      recentInfluence: recentInfluence.trim() || undefined,
      whyThisSchool: whyThisSchool.trim() || undefined,
    };
```
to:
```typescript
    const applicantProfile = {
      intendedMajor: intendedMajor.trim() || undefined,
      topProjectTitle: topProjectTitle.trim() || undefined,
      topProjectDescription: topProjectDescription.trim() || undefined,
      recentInfluence: recentInfluence.trim() || undefined,
      whyThisSchool: whyThisSchool.trim() || undefined,
      essayContext,
    };
```

- [ ] **Step 5: Add "Back to Interview Prep" awareness in the router push**

After the `router.push` call in `handleStart` (line 183), the existing flow navigates to `/college-interviews/${sessionId}`. The `returnTo` param will be stored in `sessionStorage` so the post-interview page can read it:

Before the `router.push(...)` line, add:

```typescript
      if (returnTo) {
        sessionStorage.setItem("cc_interview_returnTo", returnTo);
      }
```

- [ ] **Step 6: Verify it compiles**

Run: `npx tsc --noEmit src/components/college/CollegeInterviewSetup.tsx 2>&1 || echo 'check errors'`

Note: `useSearchParams` requires a `<Suspense>` boundary in the parent page. If the `/college-interviews/page.tsx` doesn't have one, wrap `<CollegeInterviewSetup />` in `<Suspense fallback={<div />}>`. Check first:

```bash
grep -n "Suspense" src/app/college-interviews/page.tsx 2>/dev/null || echo "no Suspense found"
```

If no Suspense found, add it in the page that renders `CollegeInterviewSetup`.

- [ ] **Step 7: Commit**

```bash
git add src/components/college/CollegeInterviewSetup.tsx
git commit -m "feat(cc): CollegeInterviewSetup reads CC query params, fetches essay context"
```

---

### Task 9: Database Migration File

**Files:**
- Create: `supabase/migrations/030_college_persona_id.sql`

Note: The user was instructed to run the migration SQL directly in the Supabase editor. This file is for version control only.

- [ ] **Step 1: Create the migration file**

```sql
-- 030_college_persona_id.sql
-- Add college_persona_id to interview tables for CC interview prep tracking

ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS college_persona_id TEXT;
ALTER TABLE interview_performance ADD COLUMN IF NOT EXISTS college_persona_id TEXT;

CREATE INDEX IF NOT EXISTS idx_interview_sessions_college
  ON interview_sessions (user_id, college_persona_id, created_at DESC)
  WHERE category = 'college';

CREATE INDEX IF NOT EXISTS idx_interview_performance_college
  ON interview_performance (user_id, college_persona_id, created_at DESC)
  WHERE category = 'college';
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/030_college_persona_id.sql
git commit -m "chore: migration for college_persona_id columns and indexes"
```

---

### Task 10: Smoke Test

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test the dashboard page**

Open `http://localhost:3000/cc/interview-prep` in a browser while logged in.

Expected behavior:
- If the student has schools on their list, the grid renders with school cards
- Schools matching personas (Harvard, Yale, etc.) show green "Ready" dot, emoji, and "Practice" button
- Non-matching schools show "Coming soon" badge and no practice button
- The 4-step arc bar shows "Session 1 of 4 — Assess Narrative" for schools with no sessions
- Empty state shows "Add schools to your list first" with link if no schools

- [ ] **Step 3: Test the Practice launch**

Click "Practice" on a persona-matched school card.

Expected: Redirects to `/college-interviews?persona=<id>&feedbackLang=en&returnTo=/cc/interview-prep`
Expected: The CollegeInterviewSetup page has that school pre-selected.

- [ ] **Step 4: Test the "Include my essays" toggle**

Check the "Include my essays" checkbox, then click Practice.

Expected: URL includes `&includeEssays=true`. If the student has essays in draft/revise phase, the interview prompt will include the essay context section.

- [ ] **Step 5: Test the sessions API**

Open `http://localhost:3000/api/cc/interview/sessions` while logged in.

Expected: Returns `{ "sessions": {} }` if no college interviews have been done, or grouped session data if they have.

- [ ] **Step 6: Final commit**

If any fixes were needed during smoke testing:

```bash
git add -A
git commit -m "fix(cc): smoke test fixes for interview prep dashboard"
```

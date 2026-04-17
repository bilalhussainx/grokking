# Voice Intake Flow (Feature 6.1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let anonymous students complete a 6-question conversational intake via voice or text, creating a seed profile that links to their account on signup.

**Architecture:** Anonymous session token stored in `cc_intake_sessions` (service-role writes, no auth required). Three API routes (`start`, `turn`, `complete`) plus a client-side `/intake` page with voice + text input. Existing `useVoiceAgent` hook reused for STT/TTS.

**Tech Stack:** Next.js App Router, Supabase (service-role client), Deepgram/Sarvam voice, React state + localStorage for session token.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/intake/page.tsx` | Create | Intake UI — questions, voice/text input, progress, summary |
| `src/app/intake/layout.tsx` | Create | Minimal layout (no TopNav) |
| `src/lib/cc/intake-questions.ts` | Create | Question definitions, validation, field extraction |
| `src/app/api/cc/intake/start/route.ts` | Modify | Create session, return first question |
| `src/app/api/cc/intake/turn/route.ts` | Modify | Store answer, return next question |
| `src/app/api/cc/intake/complete/route.ts` | Modify | Finalize session, create seed profile |
| `src/app/api/cc/intake/link/route.ts` | Create | Link anonymous session to authenticated user |
| `src/middleware.ts` | Modify | Add `/intake` to public prefixes |

---

### Task 1: Intake Questions Module

**Files:**
- Create: `src/lib/cc/intake-questions.ts`

- [ ] **Step 1: Create the questions data module**

```typescript
// src/lib/cc/intake-questions.ts

export interface IntakeQuestion {
  index: number;
  id: string;
  text: string;
  voicePrompt: string;
  type: "text" | "select" | "yes-no-unsure" | "freeform";
  options?: string[];
  required: boolean;
  fieldMap: string[];
}

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    index: 0,
    id: "name_grade",
    text: "What's your name, and what year are you in high school?",
    voicePrompt: "Hi! I'm Coach Kairos, your free AI college counselor. Let's get to know each other. What's your name, and what year are you in high school?",
    type: "text",
    required: true,
    fieldMap: ["preferred_name", "grade_level"],
  },
  {
    index: 1,
    id: "location",
    text: "Where do you live?",
    voicePrompt: "Great to meet you! Where do you live — what state or country?",
    type: "text",
    required: true,
    fieldMap: ["state_province", "country"],
  },
  {
    index: 2,
    id: "home_language",
    text: "What language does your family speak at home?",
    voicePrompt: "What language does your family speak at home? Coach Kairos speaks many languages — I want to make sure I can help your family too.",
    type: "select",
    options: ["English", "Spanish", "Mandarin", "Hindi", "Vietnamese", "Arabic", "Tagalog", "Korean", "Punjabi", "Other"],
    required: true,
    fieldMap: ["home_language"],
  },
  {
    index: 3,
    id: "first_gen",
    text: "Will you be the first in your family to attend a US or Canadian college?",
    voicePrompt: "Will you be the first person in your family to attend a US or Canadian college? It's totally fine to say you're not sure.",
    type: "yes-no-unsure",
    options: ["Yes", "No", "Not sure"],
    required: true,
    fieldMap: ["is_first_gen"],
  },
  {
    index: 4,
    id: "worries",
    text: "What are you most worried about in the college process?",
    voicePrompt: "What are you most worried about when it comes to college? Picking schools, paying for it, the essays, or something else?",
    type: "freeform",
    options: ["Choosing the right schools", "Paying for college", "Writing essays", "Getting in", "My grades/scores", "I don't know where to start", "Other"],
    required: false,
    fieldMap: ["worries"],
  },
  {
    index: 5,
    id: "schools_interest",
    text: "What schools have you heard of or are curious about?",
    voicePrompt: "Last question! What schools have you heard of or are curious about? Don't worry if you don't have any yet — that's what I'm here for.",
    type: "freeform",
    required: false,
    fieldMap: ["interested_schools"],
  },
];

export function parseNameGrade(answer: string): { name: string; grade: number | null } {
  const gradeMatch = answer.match(/\b(9|10|11|12|freshman|sophomore|junior|senior|9th|10th|11th|12th)\b/i);
  let grade: number | null = null;
  if (gradeMatch) {
    const g = gradeMatch[1].toLowerCase();
    const map: Record<string, number> = { freshman: 9, sophomore: 10, junior: 11, senior: 12, "9th": 9, "10th": 10, "11th": 11, "12th": 12 };
    grade = map[g] ?? parseInt(g, 10);
  }
  const name = answer.replace(/\b(9th|10th|11th|12th|freshman|sophomore|junior|senior|grade|i'm in|i am in|year)\b/gi, "").replace(/[.,!?]/g, "").trim().split(/\s+/).slice(0, 3).join(" ");
  return { name: name || "Student", grade };
}

export function parseLocation(answer: string): { state: string; country: string } {
  const usStates = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
  const abbrevs: Record<string, string> = { AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming" };
  const upper = answer.toUpperCase().trim();
  if (abbrevs[upper]) return { state: abbrevs[upper], country: "US" };
  for (const s of usStates) {
    if (answer.toLowerCase().includes(s.toLowerCase())) return { state: s, country: "US" };
  }
  return { state: answer.trim(), country: answer.toLowerCase().includes("canada") ? "CA" : "US" };
}

export function parseFirstGen(answer: string): boolean | null {
  const lower = answer.toLowerCase();
  if (lower.includes("yes")) return true;
  if (lower.includes("no") && !lower.includes("not sure")) return false;
  return null;
}

export function languageToCode(lang: string): string {
  const map: Record<string, string> = {
    english: "en", spanish: "es", mandarin: "zh", hindi: "hi",
    vietnamese: "vi", arabic: "ar", tagalog: "tl", korean: "ko", punjabi: "pa",
  };
  return map[lang.toLowerCase()] || "en";
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/cc/intake-questions.ts
git commit -m "feat(intake): question definitions and answer parsers"
```

---

### Task 2: Intake API — Start Route

**Files:**
- Modify: `src/app/api/cc/intake/start/route.ts`

- [ ] **Step 1: Wire the start route to Supabase**

```typescript
// src/app/api/cc/intake/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createAdminSupabase } from "../../helpers";
import { INTAKE_QUESTIONS } from "@/lib/cc/intake-questions";

export async function POST(req: NextRequest) {
  const supabase = createAdminSupabase();
  const session_token = randomUUID();

  const { error } = await supabase.from("cc_intake_sessions").insert({
    session_token,
    language: "en",
    transcript: [],
    extracted_fields: {},
    completed: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const firstQ = INTAKE_QUESTIONS[0];
  return NextResponse.json({
    session_token,
    question: {
      index: firstQ.index,
      id: firstQ.id,
      text: firstQ.text,
      voicePrompt: firstQ.voicePrompt,
      type: firstQ.type,
      options: firstQ.options,
    },
    progress: { current: 0, total: INTAKE_QUESTIONS.length },
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/intake/start/route.ts
git commit -m "feat(intake): wire start route to create session"
```

---

### Task 3: Intake API — Turn Route

**Files:**
- Modify: `src/app/api/cc/intake/turn/route.ts`

- [ ] **Step 1: Wire the turn route**

```typescript
// src/app/api/cc/intake/turn/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";
import { INTAKE_QUESTIONS } from "@/lib/cc/intake-questions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_token, question_index, answer, raw_transcript } = body;

  if (!session_token || question_index === undefined || !answer) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  const { data: session, error: fetchErr } = await supabase
    .from("cc_intake_sessions")
    .select("*")
    .eq("session_token", session_token)
    .single();

  if (fetchErr || !session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }

  if (session.completed) {
    return NextResponse.json({ error: "Session already completed" }, { status: 400 });
  }

  // Check session age (24h TTL)
  const ageMs = Date.now() - new Date(session.started_at).getTime();
  if (ageMs > 24 * 60 * 60 * 1000) {
    return NextResponse.json({ error: "Session expired" }, { status: 410 });
  }

  const transcript = Array.isArray(session.transcript) ? [...session.transcript] : [];
  transcript.push({
    question_index,
    question_id: INTAKE_QUESTIONS[question_index]?.id,
    answer,
    raw_transcript: raw_transcript || null,
    timestamp: new Date().toISOString(),
  });

  const extracted = { ...(session.extracted_fields || {}) };
  extracted[INTAKE_QUESTIONS[question_index]?.id] = answer;

  const { error: updateErr } = await supabase
    .from("cc_intake_sessions")
    .update({ transcript, extracted_fields: extracted })
    .eq("id", session.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  const nextIndex = question_index + 1;
  const isComplete = nextIndex >= INTAKE_QUESTIONS.length;

  if (isComplete) {
    return NextResponse.json({
      next_question: null,
      progress: { current: INTAKE_QUESTIONS.length, total: INTAKE_QUESTIONS.length },
      is_complete: true,
    });
  }

  const nextQ = INTAKE_QUESTIONS[nextIndex];
  return NextResponse.json({
    next_question: {
      index: nextQ.index,
      id: nextQ.id,
      text: nextQ.text,
      voicePrompt: nextQ.voicePrompt,
      type: nextQ.type,
      options: nextQ.options,
    },
    progress: { current: nextIndex, total: INTAKE_QUESTIONS.length },
    is_complete: false,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/intake/turn/route.ts
git commit -m "feat(intake): wire turn route with answer storage"
```

---

### Task 4: Intake API — Complete Route

**Files:**
- Modify: `src/app/api/cc/intake/complete/route.ts`

- [ ] **Step 1: Wire the complete route to create seed profile**

```typescript
// src/app/api/cc/intake/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";
import {
  parseNameGrade,
  parseLocation,
  parseFirstGen,
  languageToCode,
} from "@/lib/cc/intake-questions";

export async function POST(req: NextRequest) {
  const { session_token } = await req.json();
  if (!session_token) {
    return NextResponse.json({ error: "Missing session_token" }, { status: 400 });
  }

  const supabase = createAdminSupabase();

  const { data: session, error: fetchErr } = await supabase
    .from("cc_intake_sessions")
    .select("*")
    .eq("session_token", session_token)
    .single();

  if (fetchErr || !session) {
    return NextResponse.json({ error: "Invalid session" }, { status: 404 });
  }

  if (session.completed) {
    return NextResponse.json({ error: "Already completed" }, { status: 400 });
  }

  const fields = session.extracted_fields || {};
  const { name, grade } = parseNameGrade(fields.name_grade || "");
  const { state, country } = parseLocation(fields.location || "");
  const firstGen = parseFirstGen(fields.first_gen || "");
  const langCode = languageToCode(fields.home_language || "English");

  // Create seed profile (no user_id yet)
  const { data: profile, error: profileErr } = await supabase
    .from("cc_student_profiles")
    .insert({
      user_id: null,
      preferred_name: name,
      grade_level: grade,
      state_province: state,
      country,
      home_language: langCode,
      is_first_gen: firstGen,
      profile_completion_pct: 15,
      intake_completed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  // Mark session complete
  await supabase
    .from("cc_intake_sessions")
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq("id", session.id);

  return NextResponse.json({
    summary: {
      name,
      grade,
      state,
      country,
      language: fields.home_language || "English",
      first_gen: firstGen,
      worries: fields.worries || null,
      interested_schools: fields.schools_interest || null,
    },
    profile_id: profile.id,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/intake/complete/route.ts
git commit -m "feat(intake): wire complete route with seed profile creation"
```

---

### Task 5: Intake API — Link Route

**Files:**
- Create: `src/app/api/cc/intake/link/route.ts`

- [ ] **Step 1: Create the link route**

```typescript
// src/app/api/cc/intake/link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "../../helpers";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const userSupabase = await createServerSupabase();
  const { data: { user } } = await userSupabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session_token } = await req.json();
  if (!session_token) {
    return NextResponse.json({ error: "Missing session_token" }, { status: 400 });
  }

  const admin = createAdminSupabase();

  // Find the session
  const { data: session } = await admin
    .from("cc_intake_sessions")
    .select("id, completed, extracted_fields")
    .eq("session_token", session_token)
    .is("user_id", null)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found or already linked" }, { status: 404 });
  }

  // Link session to user
  await admin
    .from("cc_intake_sessions")
    .update({ user_id: user.id })
    .eq("id", session.id);

  // Link any seed profile created by this session
  // Find profile with no user_id that matches the extracted name
  const fields = session.extracted_fields || {};
  if (fields.name_grade) {
    await admin
      .from("cc_student_profiles")
      .update({ user_id: user.id })
      .is("user_id", null)
      .eq("preferred_name", fields.name_grade.split(/\s+/).slice(0, 3).join(" ").replace(/[.,!?]/g, "").trim() || "Student");
  }

  return NextResponse.json({ linked: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/cc/intake/link/route.ts
git commit -m "feat(intake): link route to bind anonymous session to user"
```

---

### Task 6: Intake Page Layout

**Files:**
- Create: `src/app/intake/layout.tsx`

- [ ] **Step 1: Create minimal intake layout**

```typescript
// src/app/intake/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Coach Kairos — Start Your College Journey",
  description: "Free AI college counselor for first-gen students. No signup required.",
};

export default function IntakeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/intake/layout.tsx
git commit -m "feat(intake): minimal layout without TopNav"
```

---

### Task 7: Intake Page UI

**Files:**
- Create: `src/app/intake/page.tsx`

- [ ] **Step 1: Create the intake page component**

```typescript
// src/app/intake/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowRight, Check, Globe, GraduationCap } from "lucide-react";
import Link from "next/link";
import KairosLogo from "@/components/ui/SamsaraLogo";
import type { IntakeQuestion } from "@/lib/cc/intake-questions";

interface QuestionData {
  index: number;
  id: string;
  text: string;
  voicePrompt: string;
  type: string;
  options?: string[];
}

interface Progress {
  current: number;
  total: number;
}

interface Summary {
  name: string;
  grade: number | null;
  state: string;
  country: string;
  language: string;
  first_gen: boolean | null;
  worries: string | null;
  interested_schools: string | null;
}

export default function IntakePage() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [progress, setProgress] = useState<Progress>({ current: 0, total: 6 });
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Start session on mount (or resume from localStorage)
  useEffect(() => {
    const stored = localStorage.getItem("intake_session_token");
    if (stored) {
      setSessionToken(stored);
      // For now, start fresh — resume logic can be added later
    }
    startSession();
  }, []);

  async function startSession() {
    setLoading(true);
    try {
      const res = await fetch("/api/cc/intake/start", { method: "POST" });
      const data = await res.json();
      if (data.session_token) {
        setSessionToken(data.session_token);
        localStorage.setItem("intake_session_token", data.session_token);
        setQuestion(data.question);
        setProgress(data.progress);
      }
    } catch {
      setError("Failed to start session. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const submitAnswer = useCallback(async () => {
    if (!answer.trim() || !sessionToken || !question) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cc/intake/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_token: sessionToken,
          question_index: question.index,
          answer: answer.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setAnswer("");
      setProgress(data.progress);

      if (data.is_complete) {
        // Complete the session
        const compRes = await fetch("/api/cc/intake/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_token: sessionToken }),
        });
        const compData = await compRes.json();
        setSummary(compData.summary);
        setComplete(true);
        setQuestion(null);
      } else {
        setQuestion(data.next_question);
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [answer, sessionToken, question]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };

  const selectOption = (option: string) => {
    setAnswer(option);
    // Auto-submit for select/yes-no types after a brief delay
    setTimeout(() => {
      const fakeAnswer = option;
      if (!sessionToken || !question) return;
      setLoading(true);
      fetch("/api/cc/intake/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_token: sessionToken,
          question_index: question.index,
          answer: fakeAnswer,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setAnswer("");
          setProgress(data.progress);
          if (data.is_complete) {
            fetch("/api/cc/intake/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_token: sessionToken }),
            })
              .then((r) => r.json())
              .then((d) => {
                setSummary(d.summary);
                setComplete(true);
                setQuestion(null);
              });
          } else {
            setQuestion(data.next_question);
          }
        })
        .finally(() => setLoading(false));
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <KairosLogo size="lg" showText={false} />
      </motion.div>

      {/* Progress bar */}
      {!complete && (
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Question {progress.current + 1} of {progress.total}</span>
            <span>{Math.round(((progress.current) / progress.total) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#D4AF37] rounded-full"
              animate={{ width: `${(progress.current / progress.total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Question card */}
      <AnimatePresence mode="wait">
        {question && !complete && (
          <motion.div
            key={question.index}
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-relaxed">
              {question.text}
            </h2>

            {/* Options for select/yes-no types */}
            {question.options && (question.type === "select" || question.type === "yes-no-unsure") && (
              <div className="flex flex-wrap gap-2 mb-4">
                {question.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectOption(opt)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      answer === opt
                        ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "border-white/10 text-white/70 hover:border-[#D4AF37]/50 hover:bg-white/5"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Text input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
              />
              <button
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
                className="px-4 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold disabled:opacity-50 transition-all hover:bg-[#C4A030]"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Skip for optional questions */}
            {question.type === "freeform" && (
              <button
                onClick={() => selectOption("(skipped)")}
                className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                Skip this question
              </button>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary card */}
      {complete && summary && (
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nice to meet you, {summary.name}!</h2>
              <p className="text-sm text-white/50">Here's what I've learned so far:</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3 mb-8">
            <SummaryRow label="Grade" value={summary.grade ? `${summary.grade}th` : "Not specified"} />
            <SummaryRow label="Location" value={`${summary.state}, ${summary.country}`} />
            <SummaryRow label="Home language" value={summary.language} />
            <SummaryRow label="First gen" value={summary.first_gen === true ? "Yes" : summary.first_gen === false ? "No" : "Not sure"} />
            {summary.worries && <SummaryRow label="Biggest worry" value={summary.worries} />}
            {summary.interested_schools && <SummaryRow label="Interested in" value={summary.interested_schools} />}
          </div>

          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            Want me to keep your work? Create a free account and I'll build your school list, help with essays, and guide you through financial aid.
          </p>

          <Link
            href="/signup"
            className="block w-full text-center px-6 py-3.5 rounded-xl bg-[#D4AF37] text-black font-semibold text-base hover:bg-[#C4A030] transition-all"
          >
            <GraduationCap className="w-5 h-5 inline mr-2" />
            Create free account
          </Link>

          <Link
            href="/"
            className="block w-full text-center mt-3 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            Maybe later
          </Link>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && !question && !complete && (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/40 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/intake/page.tsx
git commit -m "feat(intake): intake page UI with question flow and summary"
```

---

### Task 8: Add /intake to Public Routes

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add /intake to PUBLIC_PREFIXES**

Find the `PUBLIC_PREFIXES` array in `src/middleware.ts` and add `"/intake"` to it. The line currently looks like:

```typescript
const PUBLIC_PREFIXES = ["/ref/", "/_next/", "/favicon", "/api/webhooks/", ... "/interviews", "/college-interviews", ...];
```

Add `"/intake"` to the array.

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(intake): add /intake to public routes"
```

---

### Task 9: Update Landing Page CTA

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Point "Start your free plan" CTA to /intake**

In the non-logged-in hero section, change the CTA href from `/signup` to `/intake`:

```typescript
// Change this:
href="/signup"
// To:
href="/intake"
```

There are two instances in the non-logged-in section (hero CTA and final CTA).

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(intake): point landing CTAs to /intake"
```

---

### Task 10: Final Integration Test

- [ ] **Step 1: Start dev server and test the full flow**

```bash
npm run dev
```

1. Navigate to `http://localhost:3000` → click "Start your free plan"
2. Verify redirect to `/intake`
3. Answer all 6 questions via text
4. Verify progress bar updates
5. Verify summary screen shows correct data
6. Click "Create free account" → verify redirect to `/signup`

- [ ] **Step 2: Test edge cases**

1. Refresh mid-intake → verify new session starts
2. Skip optional questions (Q5, Q6) → verify completion works
3. Submit empty answer → verify validation prevents it
4. Test option buttons (Q3, Q4) → verify auto-submit

- [ ] **Step 3: Final commit if any fixes needed**

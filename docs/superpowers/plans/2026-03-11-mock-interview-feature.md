# Mock Interview Feature Implementation Plan

Research Ideas:
Come up with unique technological idea that is instantly monetizable and would attract a lot of users to pay for the service. Use tavily search to research what's out there, research products on Product Hunt



* Indie Hackers

* BetaList

* Startup Stash

* Side Project Ideas

* Dev Hunt

* SaaS Hub

* PitchWall

* MicroLaunch

* Uneed

* Launching Next

* SaaSHub and ycombinators ideas for 2026, what's missing from the financial or technological or other industries that I can build. Do deep research and come up with a startup that would be profitable and require little to no investment. You are a top CEO and entrepreneur with an MBA from Harvard School of Buisness and a PHD in Computer Technology from Stanford graduating in 0.1% of the top batches. You will do deep research using tavily search on what's already implemented, what's being implemented but still can be reproduced with some missing use-cases that haven't been developed. It can be a web-app, an mobile app, can use any stack, Also research github repositories for the most stars like openclaw and think of something that is significant as building openclaw for the first time.






> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a voice-based mock interview system with code editor, Kimi question planning, ElevenLabs voice agent, and post-interview scorecard.

**Architecture:** ElevenLabs agent handles voice conversation, Kimi generates question plans and scores transcripts, Pyodide runs Python in-browser. InterviewProvider context + sessionStorage persists state across route navigation.

**Tech Stack:** Next.js 14, ElevenLabs React SDK, Kimi/Moonshot API, Monaco Editor, Pyodide, TypeScript

---

## Chunk 1: Foundation (Types, Context, API Routes)

### Task 1: Create interview types

**Files:**
- Create: `src/types/interview.ts`

- [ ] **Step 1: Create the types file**

```typescript
// src/types/interview.ts
export type InterviewPreset = 'frontend' | 'backend' | 'fullstack' | 'system-design' | 'dsa';
export type InterviewType = 'technical' | 'behavioral' | 'mixed';

export interface InterviewQuestion {
  id: number;
  text: string;
  type: 'technical' | 'behavioral';
  followUps: string[];
  evaluationCriteria: string;
}

export interface InterviewPlan {
  questions: InterviewQuestion[];
  interviewerPersona: string;
  timeAllocation: { intro: number; questions: number; wrapUp: number };
}

export interface TranscriptEntry {
  role: 'agent' | 'user';
  text: string;
  timestamp: number;
}

export interface QuestionScore {
  id: number;
  question: string;
  answerSummary: string;
  score: number;
  feedback: string;
}

export interface InterviewScorecard {
  overall: number;
  categories: {
    communication: number;
    technicalDepth: number;
    problemSolving: number;
    codeQuality: number;
  };
  questions: QuestionScore[];
  strengths: string[];
  improvements: string[];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/interview.ts
git commit -m "feat(interview): add interview type definitions"
```

---

### Task 2: Create InterviewContext provider

**Files:**
- Create: `src/contexts/InterviewContext.tsx`

The context holds all interview state and mirrors it to `sessionStorage` so it survives page navigation and refreshes.

- [ ] **Step 1: Create the context file**

```typescript
// src/contexts/InterviewContext.tsx
"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { InterviewPlan, InterviewType, TranscriptEntry, InterviewScorecard } from "@/types/interview";

interface InterviewState {
  sessionId: string | null;
  interviewType: InterviewType | null;
  questionPlan: InterviewPlan | null;
  transcript: TranscriptEntry[];
  finalCode: string;
  scorecard: InterviewScorecard | null;
  jobDescription: string;
}

interface InterviewContextValue extends InterviewState {
  startInterview: (sessionId: string, type: InterviewType, plan: InterviewPlan, jd: string) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  setFinalCode: (code: string) => void;
  setScorecard: (sc: InterviewScorecard) => void;
  resetInterview: () => void;
}

const InterviewCtx = createContext<InterviewContextValue | null>(null);

const STORAGE_KEY = "grokking-interview";

function loadFromStorage(sessionId?: string): InterviewState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (sessionId && parsed.sessionId !== sessionId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage(state: InterviewState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

const emptyState: InterviewState = {
  sessionId: null,
  interviewType: null,
  questionPlan: null,
  transcript: [],
  finalCode: "",
  scorecard: null,
  jobDescription: "",
};

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InterviewState>(emptyState);

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) setState(saved);
  }, []);

  // Mirror to sessionStorage on every state change
  useEffect(() => {
    if (state.sessionId) saveToStorage(state);
  }, [state]);

  const startInterview = useCallback(
    (sessionId: string, type: InterviewType, plan: InterviewPlan, jd: string) => {
      setState({
        sessionId,
        interviewType: type,
        questionPlan: plan,
        transcript: [],
        finalCode: "",
        scorecard: null,
        jobDescription: jd,
      });
    },
    []
  );

  const addTranscriptEntry = useCallback((entry: TranscriptEntry) => {
    setState((prev) => ({ ...prev, transcript: [...prev.transcript, entry] }));
  }, []);

  const setFinalCode = useCallback((code: string) => {
    setState((prev) => ({ ...prev, finalCode: code }));
  }, []);

  const setScorecard = useCallback((sc: InterviewScorecard) => {
    setState((prev) => ({ ...prev, scorecard: sc }));
  }, []);

  const resetInterview = useCallback(() => {
    setState(emptyState);
    if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <InterviewCtx.Provider
      value={{
        ...state,
        startInterview,
        addTranscriptEntry,
        setFinalCode,
        setScorecard,
        resetInterview,
      }}
    >
      {children}
    </InterviewCtx.Provider>
  );
}

export function useInterview() {
  const ctx = useContext(InterviewCtx);
  if (!ctx) throw new Error("useInterview must be used within InterviewProvider");
  return ctx;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/contexts/InterviewContext.tsx
git commit -m "feat(interview): add InterviewProvider context with sessionStorage persistence"
```

---

### Task 3: Create the plan API route

**Files:**
- Create: `src/app/api/interviews/plan/route.ts`

This sends the JD/preset + interview type to Kimi and returns a structured question plan. Follows the same Moonshot API pattern as `src/app/api/ai/coach/route.ts` but non-streaming (returns JSON).

- [ ] **Step 1: Create the plan route**

```typescript
// src/app/api/interviews/plan/route.ts
import { NextRequest, NextResponse } from "next/server";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

const PRESET_DESCRIPTIONS: Record<string, string> = {
  frontend: "Frontend Engineer role: React, TypeScript, CSS, performance optimization, accessibility, state management, REST/GraphQL APIs.",
  backend: "Backend Engineer role: Node.js/Python, REST APIs, databases (SQL/NoSQL), authentication, caching, message queues, microservices.",
  fullstack: "Full Stack Engineer role: React frontend, Node.js/Python backend, databases, deployment, CI/CD, system design basics.",
  "system-design": "System Design interview: distributed systems, scalability, load balancing, caching, database design, message queues, CAP theorem.",
  dsa: "Data Structures & Algorithms interview: arrays, linked lists, trees, graphs, dynamic programming, sorting, searching, time/space complexity.",
};

const SYSTEM_PROMPT = `You are an interview planning assistant. Given a job description (or role category) and interview type, generate a structured interview question plan.

OUTPUT FORMAT — respond with ONLY valid JSON, no markdown fences:
{
  "questions": [
    {
      "id": 1,
      "text": "The main question to ask",
      "type": "technical" or "behavioral",
      "followUps": ["Follow-up question 1", "Follow-up question 2"],
      "evaluationCriteria": "What good answers should include"
    }
  ],
  "interviewerPersona": "Brief persona description",
  "timeAllocation": { "intro": 2, "questions": 25, "wrapUp": 3 }
}

RULES:
- Generate 5-7 questions total
- For "technical" type: focus on coding problems, system design, and technical knowledge
- For "behavioral" type: focus on STAR method questions about teamwork, leadership, conflict
- For "mixed" type: 2 behavioral questions first, then 4-5 technical questions
- Each question should have 2-3 follow-up probes
- evaluationCriteria should list specific things to look for in answers
- timeAllocation should sum to 30 minutes`;

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, preset, interviewType } = await req.json();

    if (!MOONSHOT_API_KEY) {
      return NextResponse.json({ error: "Moonshot API key not configured" }, { status: 500 });
    }

    const jdText = jobDescription || PRESET_DESCRIPTIONS[preset] || "General software engineering role";

    const res = await fetch(MOONSHOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: MOONSHOT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `JOB DESCRIPTION:\n${jdText}\n\nINTERVIEW TYPE: ${interviewType}\n\nGenerate the interview plan.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[interview/plan] Kimi error:", res.status, errText);
      return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response from Kimi" }, { status: 500 });
    }

    // Parse JSON from response (strip markdown fences if present)
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const plan = JSON.parse(cleaned);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("[interview/plan] Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/interviews/plan/route.ts
git commit -m "feat(interview): add Kimi question plan generation API route"
```

---

### Task 4: Create the scoring API route

**Files:**
- Create: `src/app/api/interviews/score/route.ts`

- [ ] **Step 1: Create the score route**

```typescript
// src/app/api/interviews/score/route.ts
import { NextRequest, NextResponse } from "next/server";

const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

const SCORING_PROMPT = `You are an interview evaluator. Given a transcript of a mock interview, the question plan, and the candidate's code, produce a detailed scorecard.

OUTPUT FORMAT — respond with ONLY valid JSON, no markdown fences:
{
  "overall": 7.5,
  "categories": {
    "communication": 8,
    "technicalDepth": 7,
    "problemSolving": 7,
    "codeQuality": 8
  },
  "questions": [
    {
      "id": 1,
      "question": "Short question text",
      "answerSummary": "2-3 sentence summary of candidate's answer",
      "score": 7,
      "feedback": "Specific feedback on this answer"
    }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Area 1", "Area 2", "Area 3"]
}

SCORING RULES:
- Scores are 1-10 (10 = exceptional, 7 = solid, 4 = needs work, 1 = no attempt)
- communication: clarity, structure, asking clarifying questions, explaining thought process
- technicalDepth: correctness, knowledge of concepts, understanding trade-offs
- problemSolving: approach, breaking down problems, handling edge cases
- codeQuality: clean code, naming, efficiency, testing awareness
- For behavioral interviews, codeQuality should reflect structured thinking (STAR method)
- overall should be a weighted average, not a simple mean
- Be specific in feedback — reference what the candidate actually said/wrote
- strengths and improvements should each have 2-4 items`;

export async function POST(req: NextRequest) {
  try {
    const { transcript, questionPlan, finalCode, interviewType } = await req.json();

    if (!MOONSHOT_API_KEY) {
      return NextResponse.json({ error: "Moonshot API key not configured" }, { status: 500 });
    }

    // Truncate transcript if too long (keep last 100 exchanges)
    const trimmedTranscript = transcript.length > 100
      ? transcript.slice(-100)
      : transcript;

    const transcriptText = trimmedTranscript
      .map((t: { role: string; text: string }) => `${t.role === "agent" ? "INTERVIEWER" : "CANDIDATE"}: ${t.text}`)
      .join("\n\n");

    const userMessage = `INTERVIEW TYPE: ${interviewType}

QUESTION PLAN:
${JSON.stringify(questionPlan, null, 2)}

TRANSCRIPT:
${transcriptText}

${finalCode ? `CANDIDATE'S FINAL CODE:\n\`\`\`python\n${finalCode}\n\`\`\`` : "No code was written."}

Score this interview now.`;

    const res = await fetch(MOONSHOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MOONSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        model: MOONSHOT_MODEL,
        messages: [
          { role: "system", content: SCORING_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[interview/score] Kimi error:", res.status, errText);
      return NextResponse.json({ error: "Failed to score interview" }, { status: 500 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response from Kimi" }, { status: 500 });
    }

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const scorecard = JSON.parse(cleaned);

    return NextResponse.json(scorecard);
  } catch (error) {
    console.error("[interview/score] Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/interviews/score/route.ts
git commit -m "feat(interview): add Kimi interview scoring API route"
```

---

## Chunk 2: Setup Page & Navigation

### Task 5: Create the interviews layout with InterviewProvider

**Files:**
- Create: `src/app/interviews/layout.tsx`

- [ ] **Step 1: Create layout wrapping InterviewProvider**

```typescript
// src/app/interviews/layout.tsx
import { InterviewProvider } from "@/contexts/InterviewContext";

export default function InterviewsLayout({ children }: { children: React.ReactNode }) {
  return <InterviewProvider>{children}</InterviewProvider>;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/interviews/layout.tsx
git commit -m "feat(interview): add interviews layout with InterviewProvider"
```

---

### Task 6: Create the InterviewSetup component

**Files:**
- Create: `src/components/interview/InterviewSetup.tsx`

This is the main setup UI: preset cards, custom JD textarea, interview type selector, and start button. Calls `/api/interviews/plan` and navigates to the interview room on success.

- [ ] **Step 1: Create the setup component**

```typescript
// src/components/interview/InterviewSetup.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Monitor, Server, Layers, Network, Binary,
  FileText, Mic, Brain, MessageSquare, Loader2, ArrowRight,
} from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import type { InterviewPreset, InterviewType } from "@/types/interview";

const PRESETS: { id: InterviewPreset; label: string; icon: typeof Monitor; desc: string }[] = [
  { id: "frontend", label: "Frontend Engineer", icon: Monitor, desc: "React, TypeScript, CSS, performance" },
  { id: "backend", label: "Backend Engineer", icon: Server, desc: "APIs, databases, architecture" },
  { id: "fullstack", label: "Full Stack", icon: Layers, desc: "End-to-end development" },
  { id: "system-design", label: "System Design", icon: Network, desc: "Scalability, distributed systems" },
  { id: "dsa", label: "DSA", icon: Binary, desc: "Algorithms & data structures" },
];

const TYPES: { id: InterviewType; label: string; icon: typeof Mic; desc: string }[] = [
  { id: "technical", label: "Technical", icon: Brain, desc: "Coding & system design questions" },
  { id: "behavioral", label: "Behavioral", icon: MessageSquare, desc: "STAR method, soft skills" },
  { id: "mixed", label: "Mixed", icon: Mic, desc: "Behavioral intro + technical deep dive" },
];

export default function InterviewSetup() {
  const router = useRouter();
  const { startInterview } = useInterview();
  const [preset, setPreset] = useState<InterviewPreset | null>(null);
  const [customJD, setCustomJD] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType>("technical");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const canStart = (useCustom ? customJD.trim().length > 20 : preset !== null) && !loading;

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interviews/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: useCustom ? customJD.trim() : null,
          preset: useCustom ? null : preset,
          interviewType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate interview plan");
      }

      const plan = await res.json();
      const sessionId = crypto.randomUUID();
      const jd = useCustom ? customJD.trim() : `Preset: ${preset}`;
      startInterview(sessionId, interviewType, plan, jd);
      router.push(`/interviews/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text-subtle">Mock Interview</span>
          </h1>
          <p className="text-white/50 text-lg">Practice with an AI interviewer. 30 minutes. Voice only.</p>
        </div>

        {/* Step 1: Choose role / paste JD */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="text-lg font-semibold">Choose a role or paste a job description</h2>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUseCustom(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !useCustom ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/[0.04] text-white/40 border border-white/[0.08]"
              }`}
            >
              Quick Start
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                useCustom ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/[0.04] text-white/40 border border-white/[0.08]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Custom JD
            </button>
          </div>

          {!useCustom ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    preset === p.id
                      ? "bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/10"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                  }`}
                >
                  <p.icon className={`w-5 h-5 mb-2 ${preset === p.id ? "text-blue-400" : "text-white/40"}`} />
                  <div className="text-sm font-semibold mb-0.5">{p.label}</div>
                  <div className="text-[11px] text-white/30">{p.desc}</div>
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={customJD}
              onChange={(e) => setCustomJD(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={6}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 resize-none"
            />
          )}
        </div>

        {/* Step 2: Interview type */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold">2</div>
            <h2 className="text-lg font-semibold">Interview type</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setInterviewType(t.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  interviewType === t.id
                    ? "bg-violet-500/10 border-violet-500/30 shadow-lg shadow-violet-500/10"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                }`}
              >
                <t.icon className={`w-5 h-5 mb-2 ${interviewType === t.id ? "text-violet-400" : "text-white/40"}`} />
                <div className="text-sm font-semibold mb-0.5">{t.label}</div>
                <div className="text-[11px] text-white/30">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full py-4 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating interview questions...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              Start Interview
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-white/20 text-xs mt-3">
          30 minute voice interview with AI. Make sure your microphone is working.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/interview/InterviewSetup.tsx
git commit -m "feat(interview): add InterviewSetup component with preset cards and JD input"
```

---

### Task 7: Create the interviews landing page and add nav link

**Files:**
- Create: `src/app/interviews/page.tsx`
- Modify: `src/components/layout/TopNav.tsx` — add Interviews link
- Modify: `src/app/page.tsx` — add Interviews CTA to homepage

- [ ] **Step 1: Create the page**

```typescript
// src/app/interviews/page.tsx
import InterviewSetup from "@/components/interview/InterviewSetup";

export default function InterviewsPage() {
  return <InterviewSetup />;
}
```

- [ ] **Step 2: Add Interviews link to TopNav**

In `src/components/layout/TopNav.tsx`, add a `Mic` import from lucide-react and add a nav link before the PenTool admin link:

```typescript
// Add to imports:
import { Moon, Sun, Menu, BookOpen, LogOut, PenTool, Mic } from "lucide-react";

// Add before the PenTool link (around line 85):
<Link
  href="/interviews"
  className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-white/10 hover:text-[var(--foreground)] transition-colors"
  aria-label="Mock Interviews"
  title="Mock Interviews"
>
  <Mic className="w-[18px] h-[18px]" />
</Link>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/interviews/page.tsx src/components/layout/TopNav.tsx
git commit -m "feat(interview): add interviews page and nav link"
```

---

## Chunk 3: Live Interview Room

### Task 8: Create InterviewEditor component

**Files:**
- Create: `src/components/interview/InterviewEditor.tsx`

Monaco editor (Python) with Pyodide execution. The editor reports code changes to a parent callback for sending to the ElevenLabs agent.

- [ ] **Step 1: Create the editor component**

```typescript
// src/components/interview/InterviewEditor.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2, Trash2 } from "lucide-react";

interface InterviewEditorProps {
  onCodeChange: (code: string) => void;
  onOutputChange: (output: string) => void;
}

const DEFAULT_CODE = `# Write your solution here\n\ndef solution():\n    pass\n`;

export default function InterviewEditor({ onCodeChange, onOutputChange }: InterviewEditorProps) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  const pyodideRef = useRef<any>(null);

  // Load Pyodide
  useEffect(() => {
    let cancelled = false;

    async function loadPyodide() {
      try {
        // @ts-expect-error — pyodide loaded from CDN
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        if (!cancelled) {
          pyodideRef.current = pyodide;
          setPyodideReady(true);
          setPyodideLoading(false);
        }
      } catch (err) {
        console.error("[Pyodide] Failed to load:", err);
        if (!cancelled) setPyodideLoading(false);
      }
    }

    // Add Pyodide script tag if not present
    if (!document.querySelector('script[src*="pyodide"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.onload = () => loadPyodide();
      script.onerror = () => setPyodideLoading(false);
      document.head.appendChild(script);
    } else {
      loadPyodide();
    }

    return () => { cancelled = true; };
  }, []);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      const newCode = value || "";
      setCode(newCode);
      onCodeChange(newCode);
    },
    [onCodeChange]
  );

  const runCode = useCallback(async () => {
    if (!pyodideRef.current || running) return;
    setRunning(true);
    setOutput("");
    try {
      // Redirect stdout
      pyodideRef.current.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
      pyodideRef.current.runPython(code);
      const stdout = pyodideRef.current.runPython("sys.stdout.getvalue()");
      const stderr = pyodideRef.current.runPython("sys.stderr.getvalue()");
      const result = (stdout || "") + (stderr ? `\nSTDERR:\n${stderr}` : "");
      setOutput(result || "(no output)");
      onOutputChange(result || "(no output)");
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      setOutput(`Error:\n${errMsg}`);
      onOutputChange(`Error:\n${errMsg}`);
    } finally {
      setRunning(false);
    }
  }, [code, running, onOutputChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Editor */}
      <div className="flex-1 min-h-0 border border-white/[0.06] rounded-t-xl overflow-hidden">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: "on",
            renderLineHighlight: "gutter",
            tabSize: 4,
          }}
        />
      </div>

      {/* Output Console */}
      <div className="h-[30%] min-h-[120px] border border-t-0 border-white/[0.06] rounded-b-xl bg-black/40 flex flex-col">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
          <span className="text-[11px] text-white/30 font-medium uppercase tracking-wider">Output</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setOutput(""); onOutputChange(""); }}
              className="p-1 rounded text-white/20 hover:text-white/50 transition-colors"
              title="Clear output"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <button
              onClick={runCode}
              disabled={!pyodideReady || running}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all disabled:opacity-30 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20"
            >
              {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {pyodideLoading ? "Loading..." : running ? "Running..." : "Run"}
            </button>
          </div>
        </div>
        <pre className="flex-1 p-3 text-xs text-white/60 font-mono overflow-auto whitespace-pre-wrap">
          {output || (pyodideLoading ? "Loading Python runtime..." : "Click Run to execute your code")}
        </pre>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/interview/InterviewEditor.tsx
git commit -m "feat(interview): add InterviewEditor with Monaco + Pyodide execution"
```

---

### Task 9: Create InterviewVoicePanel component

**Files:**
- Create: `src/components/interview/InterviewVoicePanel.tsx`

Voice panel with ElevenLabs conversation, transcript display, and timer. This is the core interview interaction — the agent asks questions and the user responds via voice.

- [ ] **Step 1: Create the voice panel**

```typescript
// src/components/interview/InterviewVoicePanel.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useConversation } from "@elevenlabs/react";
import { Mic, MicOff, PhoneOff, Loader2, AlertCircle } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import type { TranscriptEntry } from "@/types/interview";

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_INTERVIEWER_AGENT_ID || "";

interface InterviewVoicePanelProps {
  codeRef: React.MutableRefObject<string>;
  outputRef: React.MutableRefObject<string>;
  onInterviewEnd: () => void;
}

export default function InterviewVoicePanel({
  codeRef,
  outputRef,
  onInterviewEnd,
}: InterviewVoicePanelProps) {
  const { questionPlan, addTranscriptEntry, transcript, setFinalCode } = useInterview();
  const [micMuted, setMicMuted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const codeUpdateRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sentFiveMinWarning = useRef(false);
  const sentTimeUp = useRef(false);

  const conversation = useConversation({
    micMuted,
    onConnect: () => {
      console.log("[Interview] Connected to ElevenLabs");
      setConnecting(false);
      setConnected(true);
    },
    onDisconnect: (details) => {
      console.log("[Interview] Disconnected", details);
      setConnecting(false);
      setConnected(false);
    },
    onMessage: (msg) => {
      if (msg.source === "user" && msg.message) {
        addTranscriptEntry({ role: "user", text: msg.message, timestamp: Date.now() });
      } else if (msg.source === "ai" && msg.message) {
        addTranscriptEntry({ role: "agent", text: msg.message, timestamp: Date.now() });
      }
    },
    onError: (err) => {
      console.error("[Interview] Error:", err);
      setError("Voice connection error. Try reconnecting.");
      setConnecting(false);
    },
  });

  // Auto-scroll transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Start voice session
  const startSession = useCallback(async () => {
    if (connecting || connected || !AGENT_ID) {
      if (!AGENT_ID) setError("Interviewer agent not configured. Add NEXT_PUBLIC_ELEVENLABS_INTERVIEWER_AGENT_ID to .env.local.");
      return;
    }

    setConnecting(true);
    setError("");

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "websocket",
      });

      // Send interview context after connection
      if (questionPlan) {
        conversation.sendContextualUpdate(
          `You are a technical interviewer conducting a 30-minute mock interview.

INTERVIEW PLAN:
${JSON.stringify(questionPlan, null, 2)}

RULES:
- Ask questions one at a time. Wait for the candidate to respond.
- When the candidate is coding, observe their approach and give guidance if stuck for >60 seconds.
- Ask follow-up questions based on their answers.
- Keep a natural conversational tone — firm but encouraging.
- At 5 minutes remaining, wrap up with "Any questions for me?"
- Do NOT reveal answers directly. Probe with "What if..." or "Have you considered..."
- Start by briefly introducing yourself and the format, then ask the first question.`
        );
      }

      // Send initial code state
      if (codeRef.current) {
        conversation.sendContextualUpdate(
          `CANDIDATE'S CURRENT CODE:\n\`\`\`python\n${codeRef.current}\n\`\`\``
        );
      }

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (next <= 0) return 0;
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error("[Interview] Failed to start:", err);
      setError(`Failed to connect: ${err}`);
      setConnecting(false);
    }
  }, [connecting, connected, conversation, questionPlan, codeRef]);

  // Auto-start on mount
  useEffect(() => {
    const timer = setTimeout(() => startSession(), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced code updates to agent
  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(() => {
      if (codeRef.current) {
        conversation.sendContextualUpdate(
          `CANDIDATE'S CURRENT CODE:\n\`\`\`python\n${codeRef.current}\n\`\`\`\nOUTPUT (last run): ${outputRef.current || "(not run yet)"}`
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [connected, conversation, codeRef, outputRef]);

  // Timer warnings and end
  useEffect(() => {
    if (timeLeft === 5 * 60 && !sentFiveMinWarning.current && connected) {
      sentFiveMinWarning.current = true;
      conversation.sendContextualUpdate("TIME CHECK: 5 minutes remaining. Start wrapping up. Ask if the candidate has any questions.");
    }

    if (timeLeft === 0 && !sentTimeUp.current) {
      sentTimeUp.current = true;
      if (connected) {
        conversation.sendContextualUpdate("TIME'S UP. Say 'That wraps up our time today. Thanks for the interview.' then stop.");
      }
      // Grace period then end
      setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setFinalCode(codeRef.current);
        conversation.endSession().catch(() => {});
        onInterviewEnd();
      }, 10000);
    }
  }, [timeLeft, connected, conversation, codeRef, setFinalCode, onInterviewEnd]);

  // Cleanup on unmount
  const conversationRef = useRef(conversation);
  conversationRef.current = conversation;
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (conversationRef.current.status === "connected") {
        conversationRef.current.endSession().catch(() => {});
      }
    };
  }, []);

  const endInterview = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinalCode(codeRef.current);
    conversation.endSession().catch(() => {});
    onInterviewEnd();
  }, [conversation, codeRef, setFinalCode, onInterviewEnd]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isUrgent = timeLeft <= 5 * 60;

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Header with timer */}
      <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : connecting ? "bg-amber-400 animate-pulse" : "bg-white/20"}`} />
          <span className="text-sm font-medium text-white/70">
            {connected ? "Interview in progress" : connecting ? "Connecting..." : "Disconnected"}
          </span>
        </div>
        <div className={`font-mono text-lg font-bold ${isUrgent ? "text-red-400" : "text-white/80"}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Voice controls */}
      {connected && (
        <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2">
          <button
            onClick={() => setMicMuted(!micMuted)}
            className={`p-2 rounded-lg transition-colors ${
              micMuted
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <div className="flex-1 flex items-center justify-center">
            {conversation.isSpeaking ? (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[3, 4, 2.5, 3.5].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-blue-400 rounded-full animate-pulse"
                      style={{ height: `${h * 4}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-blue-400 font-medium">Interviewer speaking...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-medium">
                  {micMuted ? "Mic muted" : "Listening..."}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={endInterview}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
            title="End interview"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="px-3 py-2 bg-red-500/10 border-b border-red-500/20 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="text-xs text-red-400">{error}</span>
          <button
            onClick={startSession}
            className="ml-auto text-xs text-red-400 underline hover:text-red-300"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Transcript */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {transcript.length === 0 && !connected && !connecting && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
            <Mic className="w-8 h-8 mb-2" />
            <p className="text-xs">Connecting to interviewer...</p>
          </div>
        )}
        {transcript.map((entry: TranscriptEntry, i: number) => (
          <div key={i}>
            {entry.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-blue-500/15 border border-blue-500/20 rounded-lg px-3 py-2 max-w-[85%]">
                  <p className="text-xs text-white/80 leading-relaxed">{entry.text}</p>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg border-l-2 border-violet-500/40 bg-violet-500/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Interviewer</span>
                </div>
                <p className="text-white/80 text-xs leading-relaxed">{entry.text}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/interview/InterviewVoicePanel.tsx
git commit -m "feat(interview): add InterviewVoicePanel with ElevenLabs agent, timer, transcript"
```

---

### Task 10: Create InterviewRoom component

**Files:**
- Create: `src/components/interview/InterviewRoom.tsx`

The main orchestrator — split panel with editor (left) and voice panel (right). For behavioral interviews, voice panel takes full width.

- [ ] **Step 1: Create the room component**

```typescript
// src/components/interview/InterviewRoom.tsx
"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useInterview } from "@/contexts/InterviewContext";
import InterviewEditor from "./InterviewEditor";
import InterviewVoicePanel from "./InterviewVoicePanel";

export default function InterviewRoom() {
  const router = useRouter();
  const { sessionId, interviewType, questionPlan } = useInterview();
  const codeRef = useRef("");
  const outputRef = useRef("");

  const handleCodeChange = useCallback((code: string) => {
    codeRef.current = code;
  }, []);

  const handleOutputChange = useCallback((output: string) => {
    outputRef.current = output;
  }, []);

  const handleInterviewEnd = useCallback(() => {
    router.push(`/interviews/${sessionId}/results`);
  }, [router, sessionId]);

  if (!questionPlan || !sessionId) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">No interview session found.</p>
          <a href="/interviews" className="text-blue-400 underline text-sm">Start a new interview</a>
        </div>
      </div>
    );
  }

  const showEditor = interviewType !== "behavioral";

  return (
    <div className="h-screen flex flex-col bg-[var(--background)]">
      {/* Top bar */}
      <div className="h-12 border-b border-white/[0.06] flex items-center justify-between px-4 bg-[var(--background)]/60 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-white/80">Mock Interview</span>
          <span className="text-xs text-white/30 ml-2 capitalize">{interviewType}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {showEditor && (
          <div className="w-[55%] border-r border-white/[0.06] p-2">
            <InterviewEditor
              onCodeChange={handleCodeChange}
              onOutputChange={handleOutputChange}
            />
          </div>
        )}
        <div className={showEditor ? "w-[45%]" : "w-full"}>
          <InterviewVoicePanel
            codeRef={codeRef}
            outputRef={outputRef}
            onInterviewEnd={handleInterviewEnd}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/interview/InterviewRoom.tsx
git commit -m "feat(interview): add InterviewRoom split-panel layout"
```

---

### Task 11: Create the interview session page

**Files:**
- Create: `src/app/interviews/[sessionId]/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// src/app/interviews/[sessionId]/page.tsx
import InterviewRoom from "@/components/interview/InterviewRoom";

export default function InterviewSessionPage() {
  return <InterviewRoom />;
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/interviews/[sessionId]/page.tsx"
git commit -m "feat(interview): add interview session page route"
```

---

## Chunk 4: Scorecard & Results

### Task 12: Create InterviewScorecard component

**Files:**
- Create: `src/components/interview/InterviewScorecard.tsx`

Displays the detailed scorecard after the interview ends. Calls the scoring API, shows loading state, and renders results with color-coded score bars.

- [ ] **Step 1: Create the scorecard component**

```typescript
// src/components/interview/InterviewScorecard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw, ArrowLeft, Trophy, TrendingUp, AlertTriangle } from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7 ? "bg-emerald-500" : score >= 4 ? "bg-amber-500" : "bg-red-500";
  const textColor =
    score >= 7 ? "text-emerald-400" : score >= 4 ? "text-amber-400" : "text-red-400";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/60 w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-bold w-8 text-right ${textColor}`}>{score}</span>
    </div>
  );
}

export default function InterviewScorecard() {
  const router = useRouter();
  const { transcript, questionPlan, finalCode, interviewType, scorecard, setScorecard } = useInterview();
  const [loading, setLoading] = useState(!scorecard);
  const [error, setError] = useState("");

  const fetchScore = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interviews/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, questionPlan, finalCode, interviewType }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Scoring failed");
      }
      const sc = await res.json();
      setScorecard(sc);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scoring failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scorecard && transcript.length > 0) {
      fetchScore();
    } else if (transcript.length === 0) {
      setLoading(false);
      setError("No interview transcript found.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Analyzing your interview performance...</p>
          <p className="text-white/20 text-xs mt-1">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error || !scorecard) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-sm mb-4">{error || "No scorecard available"}</p>
          {transcript.length > 0 && (
            <button
              onClick={fetchScore}
              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm flex items-center gap-2 mx-auto hover:bg-blue-500/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Scoring
            </button>
          )}
          <button
            onClick={() => router.push("/interviews")}
            className="mt-3 text-white/40 text-xs underline hover:text-white/60"
          >
            Start a new interview
          </button>
        </div>
      </div>
    );
  }

  const { overall, categories, questions, strengths, improvements } = scorecard;
  const overallColor =
    overall >= 7 ? "text-emerald-400" : overall >= 4 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <button
          onClick={() => router.push("/interviews")}
          className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/60 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          New Interview
        </button>

        <div className="text-center mb-10">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-amber-400" />
          <h1 className="text-3xl font-bold mb-2">Interview Results</h1>
          <div className={`text-5xl font-bold ${overallColor}`}>
            {overall.toFixed(1)}<span className="text-lg text-white/30">/10</span>
          </div>
        </div>

        {/* Category scores */}
        <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] mb-6 space-y-3">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Category Scores</h2>
          <ScoreBar label="Communication" score={categories.communication} />
          <ScoreBar label="Technical Depth" score={categories.technicalDepth} />
          <ScoreBar label="Problem Solving" score={categories.problemSolving} />
          <ScoreBar label="Code Quality" score={categories.codeQuality} />
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Strengths
            </h3>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-emerald-400 mt-0.5">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Areas to Improve
            </h3>
            <ul className="space-y-1.5">
              {improvements.map((s, i) => (
                <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-amber-400 mt-0.5">-</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Question Breakdown</h2>
          {questions.map((q) => {
            const qColor = q.score >= 7 ? "border-emerald-500/20" : q.score >= 4 ? "border-amber-500/20" : "border-red-500/20";
            const qScoreColor = q.score >= 7 ? "text-emerald-400" : q.score >= 4 ? "text-amber-400" : "text-red-400";
            return (
              <div key={q.id} className={`p-4 rounded-xl border ${qColor} bg-white/[0.02]`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-white/80">{q.question}</p>
                  <span className={`text-sm font-bold ${qScoreColor} shrink-0 ml-3`}>{q.score}/10</span>
                </div>
                <p className="text-xs text-white/40 mb-1.5">{q.answerSummary}</p>
                <p className="text-xs text-white/60">{q.feedback}</p>
              </div>
            );
          })}
        </div>

        {/* Try again */}
        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/interviews")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold hover:from-blue-400 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/20"
          >
            Start Another Interview
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/interview/InterviewScorecard.tsx
git commit -m "feat(interview): add InterviewScorecard with color-coded results"
```

---

### Task 13: Create the results page

**Files:**
- Create: `src/app/interviews/[sessionId]/results/page.tsx`

- [ ] **Step 1: Create the results page**

```typescript
// src/app/interviews/[sessionId]/results/page.tsx
import InterviewScorecard from "@/components/interview/InterviewScorecard";

export default function InterviewResultsPage() {
  return <InterviewScorecard />;
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/interviews/[sessionId]/results/page.tsx"
git commit -m "feat(interview): add interview results page route"
```

---

## Chunk 5: Integration & Polish

### Task 14: Add NEXT_PUBLIC_ELEVENLABS_INTERVIEWER_AGENT_ID env var

You must create a new ElevenLabs agent for the interviewer persona in the ElevenLabs dashboard at https://elevenlabs.io/app/conversational-ai:

1. Create new agent named "Mock Interviewer"
2. Set a neutral, professional voice
3. Keep prompt and first_message as defaults (we override via contextual updates)
4. Copy the agent ID

- [ ] **Step 1: Add the env var to .env.local**

```bash
echo "NEXT_PUBLIC_ELEVENLABS_INTERVIEWER_AGENT_ID=<paste-agent-id-here>" >> .env.local
```

- [ ] **Step 2: No commit needed (env vars are gitignored)**

---

### Task 15: Verify full flow end-to-end

- [ ] **Step 1: Start dev server and test setup page**

```bash
npm run dev
```

Navigate to `http://localhost:3000/interviews`. Verify:
- Preset cards render and are selectable
- Custom JD toggle works
- Interview type selector works
- "Start Interview" calls the plan API and navigates to session page

- [ ] **Step 2: Test live interview**

On the session page verify:
- ElevenLabs agent connects and starts asking questions
- Timer counts down from 30:00
- Editor is visible for technical/mixed, hidden for behavioral
- Code can be written and run via Pyodide
- Transcript updates as conversation progresses

- [ ] **Step 3: Test scorecard**

End the interview (click end button or wait for timer). Verify:
- Redirects to results page
- Scoring API is called
- Scorecard renders with scores, strengths, improvements, and per-question breakdown

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(interview): end-to-end integration fixes"
```

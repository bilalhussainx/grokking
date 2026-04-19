# Essay Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a four-phase essay writing tool with anti-ghostwriting guardrail where AI coaches but never writes prose.

**Architecture:** Phase stepper UI at `/cc/essays/[id]` backed by 7 API routes that use the existing `cc_essays` + `cc_essay_interactions` tables. LLM streaming extracted from coach route into shared `src/lib/cc/llm-stream.ts`. Anti-ghostwriting guardrail validates every AI response server-side.

**Tech Stack:** Next.js App Router, Supabase, OpenRouter/Moonshot/Gemini fallback chain, SSE streaming, Tailwind CSS

---

### Task 1: Extract LLM Streaming into Shared Module

**Files:**
- Create: `src/lib/cc/llm-stream.ts`
- Modify: `src/app/api/cc/coach/route.ts`

- [ ] **Step 1: Create `src/lib/cc/llm-stream.ts`**

```typescript
// src/lib/cc/llm-stream.ts
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const MOONSHOT_URL = "https://api.moonshot.ai/v1/chat/completions";
const MOONSHOT_MODEL = "kimi-k2-turbo-preview";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function parseSSEStream(body: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async pull(controller) {
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) { controller.close(); return; }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") { controller.close(); return; }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) controller.enqueue(encoder.encode(content));
          } catch { /* skip malformed */ }
        }
      }
    },
    cancel() { reader.cancel(); },
  });
}

export async function collectSSEStream(body: ReadableStream<Uint8Array>): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return result;
      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) result += content;
      } catch { /* skip */ }
    }
  }
  return result;
}

export async function streamLLM(
  messages: ChatMessage[],
  opts?: { temperature?: number; maxTokens?: number; model?: string }
): Promise<{ stream: ReadableStream<Uint8Array>; provider: string } | null> {
  const temp = opts?.temperature ?? 0.7;
  const maxTokens = opts?.maxTokens ?? 400;

  if (OPENROUTER_API_KEY) {
    try {
      const resp = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://kairos.ai",
          "X-Title": "Kairos.ai",
        },
        body: JSON.stringify({
          model: opts?.model || "openai/gpt-4o-mini",
          messages,
          stream: true,
          temperature: temp,
          max_tokens: maxTokens,
        }),
      });
      if (resp.ok && resp.body) {
        return { stream: parseSSEStream(resp.body), provider: "openrouter" };
      }
    } catch (err) {
      console.error("[LLM] OpenRouter failed:", err);
    }
  }

  if (MOONSHOT_API_KEY) {
    try {
      const resp = await fetch(MOONSHOT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MOONSHOT_API_KEY}`,
        },
        body: JSON.stringify({
          model: MOONSHOT_MODEL,
          messages,
          stream: true,
          temperature: temp,
          max_tokens: maxTokens,
        }),
      });
      if (resp.ok && resp.body) {
        return { stream: parseSSEStream(resp.body), provider: "moonshot" };
      }
    } catch (err) {
      console.error("[LLM] Moonshot failed:", err);
    }
  }

  // Gemini fallback
  try {
    const { getGeminiModel } = await import("@/lib/gemini");
    const systemMsg = messages.find((m) => m.role === "system")?.content || "";
    const model = getGeminiModel(systemMsg);
    const history = messages
      .filter((m) => m.role !== "system")
      .slice(0, -1)
      .map((m) => ({
        role: (m.role === "assistant" ? "model" : "user") as "model" | "user",
        parts: [{ text: m.content }],
      }));
    const userMsg = messages[messages.length - 1]?.content || "";
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(userMsg);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });
    return { stream, provider: "gemini" };
  } catch (err) {
    console.error("[LLM] Gemini failed:", err);
  }

  return null;
}

export async function callLLMJSON<T>(
  messages: ChatMessage[],
  opts?: { temperature?: number; maxTokens?: number }
): Promise<T | null> {
  const temp = opts?.temperature ?? 0.3;
  const maxTokens = opts?.maxTokens ?? 1500;
  const apiKey = OPENROUTER_API_KEY || MOONSHOT_API_KEY;
  const apiUrl = OPENROUTER_API_KEY ? OPENROUTER_URL : MOONSHOT_URL;
  const model = OPENROUTER_API_KEY ? "openai/gpt-4o-mini" : MOONSHOT_MODEL;

  if (!apiKey) return null;

  try {
    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(OPENROUTER_API_KEY ? { "HTTP-Referer": "https://kairos.ai" } : {}),
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temp,
        max_tokens: maxTokens,
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Update coach route to use shared module**

In `src/app/api/cc/coach/route.ts`, replace the inline `streamFromSSE` function and the three provider blocks (lines 46-209) with:

```typescript
import { streamLLM, type ChatMessage } from "@/lib/cc/llm-stream";
```

Replace the try block starting at line 87 with:

```typescript
  try {
    const body = await req.json();
    const { message, conversationHistory, context } = body as {
      message: string;
      conversationHistory?: { role: string; content: string }[];
      context?: { page?: string; conversationId?: string };
    };

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const coachCtx = await buildCoachContext(user.id);
    let agent = routeMessage(message, coachCtx, context?.page);
    if (!agent) {
      agent = await classifyWithLLM(message, coachCtx.profileCompletionPct);
    }

    console.log(`[CC Coach] Agent: ${agent} | Profile: ${coachCtx.profileCompletionPct}% | Page: ${context?.page || "?"}`);

    const systemPrompt = getAgentPrompt(agent, coachCtx);
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...((conversationHistory || []).map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
        content: m.content,
      }))),
      { role: "user", content: message },
    ];

    const result = await streamLLM(messages);
    if (!result) {
      return NextResponse.json({ error: "All LLM providers unavailable" }, { status: 503 });
    }

    return new Response(result.stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Coach-Agent": agent,
      },
    });
  } catch (error) {
    console.error("[CC Coach] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Coach unavailable" },
      { status: 500 },
    );
  }
```

- [ ] **Step 3: Verify coach route still works**

Run: `npx next build` (or `npm run build`) — ensure no TypeScript errors in `src/app/api/cc/coach/route.ts` or `src/lib/cc/llm-stream.ts`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cc/llm-stream.ts src/app/api/cc/coach/route.ts
git commit -m "refactor: extract LLM streaming into shared llm-stream module"
```

---

### Task 2: Anti-Ghostwriting Guardrail

**Files:**
- Create: `src/lib/cc/essay-guardrail.ts`

- [ ] **Step 1: Create `src/lib/cc/essay-guardrail.ts`**

```typescript
// src/lib/cc/essay-guardrail.ts

export interface GuardrailResult {
  passed: boolean;
  originalText: string;
  sanitizedText: string;
  blockedSentences: string[];
}

const MAX_PROSE_WORDS = 15;
const FALLBACK_RESPONSE = "I can help you think through this — what specific part are you working on?";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isQuestion(sentence: string): boolean {
  return sentence.trim().endsWith("?");
}

function isBulletOrLabel(sentence: string): boolean {
  const trimmed = sentence.trim();
  return (
    trimmed.startsWith("-") ||
    trimmed.startsWith("•") ||
    trimmed.startsWith("*") ||
    /^(Theme|Option|Section|Hook|Development|Reflection|Note|Tip):/i.test(trimmed) ||
    /^\d+[\.\)]/.test(trimmed)
  );
}

export function validateGuardrail(aiResponse: string): GuardrailResult {
  const sentences = aiResponse
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const blockedSentences: string[] = [];

  for (const sentence of sentences) {
    if (isQuestion(sentence)) continue;
    if (isBulletOrLabel(sentence)) continue;
    if (countWords(sentence) <= MAX_PROSE_WORDS) continue;
    blockedSentences.push(sentence);
  }

  if (blockedSentences.length > 0) {
    return {
      passed: false,
      originalText: aiResponse,
      sanitizedText: FALLBACK_RESPONSE,
      blockedSentences,
    };
  }

  return {
    passed: true,
    originalText: aiResponse,
    sanitizedText: aiResponse,
    blockedSentences: [],
  };
}

export function countWordsInText(text: string): number {
  return countWords(text);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/cc/essay-guardrail.ts
git commit -m "feat(essays): anti-ghostwriting guardrail with 15-word prose limit"
```

---

### Task 3: Essay Helpers (Profile Context for Essay AI)

**Files:**
- Create: `src/lib/cc/essay-helpers.ts`

- [ ] **Step 1: Create `src/lib/cc/essay-helpers.ts`**

```typescript
// src/lib/cc/essay-helpers.ts
import { createAdminSupabase } from "@/lib/supabase-server";

export interface EssayContext {
  studentName: string;
  activities: string[];
  honors: string[];
  academicHighlights: string;
  essayType: string;
  promptText: string;
  wordLimit: number;
  brainstormTranscript: { role: string; content: string }[] | null;
  outlineJson: Record<string, unknown> | null;
  currentDraft: string | null;
}

export async function buildEssayContext(
  userId: string,
  essayId: string
): Promise<EssayContext | null> {
  const db = createAdminSupabase();

  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id, preferred_name, legal_first_name")
    .eq("user_id", userId)
    .single();

  if (!profile) return null;

  const { data: essay } = await db
    .from("cc_essays")
    .select("*")
    .eq("id", essayId)
    .eq("student_id", profile.id)
    .single();

  if (!essay) return null;

  const { data: activities } = await db
    .from("cc_activities")
    .select("activity_type, organization, role, description_150")
    .eq("student_id", profile.id)
    .order("position");

  const { data: honors } = await db
    .from("cc_honors")
    .select("title, level, description_100")
    .eq("student_id", profile.id)
    .order("position");

  const { data: academics } = await db
    .from("cc_academic_profiles")
    .select("gpa_unweighted, sat_total, act_composite, ap_ib_courses")
    .eq("student_id", profile.id)
    .single();

  const activityList = (activities || []).map(
    (a) => `${a.role || a.activity_type} at ${a.organization}: ${a.description_150 || ""}`
  );

  const honorList = (honors || []).map(
    (h) => `${h.title} (${h.level}): ${h.description_100 || ""}`
  );

  let academicHighlights = "";
  if (academics) {
    const parts: string[] = [];
    if (academics.gpa_unweighted) parts.push(`GPA: ${academics.gpa_unweighted}`);
    if (academics.sat_total) parts.push(`SAT: ${academics.sat_total}`);
    if (academics.act_composite) parts.push(`ACT: ${academics.act_composite}`);
    if (academics.ap_ib_courses && Array.isArray(academics.ap_ib_courses)) {
      parts.push(`AP/IB: ${(academics.ap_ib_courses as string[]).length} courses`);
    }
    academicHighlights = parts.join(", ");
  }

  return {
    studentName: profile.preferred_name || profile.legal_first_name || "Student",
    activities: activityList,
    honors: honorList,
    academicHighlights,
    essayType: essay.essay_type || "personal_statement",
    promptText: essay.prompt_text || "",
    wordLimit: essay.word_limit || 650,
    brainstormTranscript: essay.brainstorm_transcript as { role: string; content: string }[] | null,
    outlineJson: essay.outline_json as Record<string, unknown> | null,
    currentDraft: essay.current_draft,
  };
}

export function getBrainstormSystemPrompt(ctx: EssayContext): string {
  const activityBlock = ctx.activities.length > 0
    ? `\nStudent's activities:\n${ctx.activities.map((a) => `- ${a}`).join("\n")}`
    : "";
  const honorBlock = ctx.honors.length > 0
    ? `\nStudent's honors:\n${ctx.honors.map((h) => `- ${h}`).join("\n")}`
    : "";

  return `You are a college essay brainstorm coach helping ${ctx.studentName} write a ${ctx.essayType === "personal_statement" ? "Common App personal statement" : "supplemental essay"}.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

Rules:
1. Ask ONE question per message to help the student discover their story
2. Never write prose, paragraphs, or essay text
3. Theme summaries must be under 15 words
4. Reference the student's actual activities and experiences
5. After 5-7 exchanges, summarize 2-3 themes as short labels (e.g. "Theme: resilience through robotics setback")
6. Let the student choose which theme to develop
${activityBlock}${honorBlock}${ctx.academicHighlights ? `\nAcademics: ${ctx.academicHighlights}` : ""}`;
}

export function getOutlineSystemPrompt(ctx: EssayContext): string {
  return `You are a college essay outline coach. Generate 3 structural outline options for ${ctx.studentName}'s chosen theme.

Essay type: ${ctx.essayType === "personal_statement" ? "Common App personal statement" : "supplemental"}
Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

Rules:
1. Each outline has 3-5 sections (hook, development, reflection)
2. Each bullet is a structural direction, not prose — max 15 words
3. Include a suggested wordBudget per section totaling ${ctx.wordLimit}
4. Never write actual essay sentences
5. Use the student's real experiences

Return JSON:
{
  "outlines": [
    {
      "title": "Option A: ...",
      "sections": [
        { "label": "Hook", "bullets": ["..."], "wordBudget": 80 },
        { "label": "Development", "bullets": ["..."], "wordBudget": 400 },
        { "label": "Reflection", "bullets": ["..."], "wordBudget": 170 }
      ]
    }
  ]
}`;
}

export function getQuickCheckSystemPrompt(ctx: EssayContext): string {
  return `You are reviewing a college essay draft in progress for ${ctx.studentName}.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

Rules:
1. Give 1-3 brief structural observations
2. Never rewrite any sentence
3. Never suggest specific words or phrases longer than 15 words
4. Frame feedback as questions when possible
5. If the draft is strong, say so briefly`;
}

export function getReviewSystemPrompt(ctx: EssayContext): string {
  return `You are a college essay reviewer analyzing ${ctx.studentName}'s draft.

Prompt: "${ctx.promptText}"
Word limit: ${ctx.wordLimit}

Rules:
1. Reference specific paragraphs by number (0-indexed)
2. Never rewrite sentences — point out issues and ask questions
3. Check for: prompt fit, structure, voice consistency, cliches, "show don't tell", word count
4. Example snippets must be under 15 words
5. Be encouraging — highlight what works

Return JSON:
{
  "comments": [
    {
      "paragraphIndex": 0,
      "type": "structure|voice|cliche|prompt_fit|pacing|positive",
      "text": "Your observation here",
      "severity": "positive|suggestion|warning"
    }
  ],
  "overallNotes": "Brief summary",
  "wordCount": 650,
  "promptFitScore": 0.85
}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/cc/essay-helpers.ts
git commit -m "feat(essays): essay context builder and phase-specific system prompts"
```

---

### Task 4: Essay API Routes

**Files:**
- Modify: `src/app/api/cc/essays/route.ts`
- Modify: `src/app/api/cc/essays/[id]/brainstorm/route.ts`
- Modify: `src/app/api/cc/essays/[id]/outline/route.ts`
- Modify: `src/app/api/cc/essays/[id]/draft/route.ts`
- Modify: `src/app/api/cc/essays/[id]/review/route.ts`
- Modify: `src/app/api/cc/essays/[id]/share/route.ts`

- [ ] **Step 1: Replace `src/app/api/cc/essays/route.ts` (list + create)**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../helpers";

export async function GET() {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ essays: [] });
  }

  const { data: essays } = await db
    .from("cc_essays")
    .select("id, essay_type, prompt_text, word_limit, phase, word_count, updated_at, school_id")
    .eq("student_id", profile.id)
    .order("updated_at", { ascending: false });

  return NextResponse.json({ essays: essays || [] });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();

  const db = createAdminSupabase();
  const { data: profile } = await db
    .from("cc_student_profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Complete your profile first" }, { status: 400 });
  }

  const body = await req.json();
  const { essay_type, school_id, prompt_text, word_limit } = body as {
    essay_type: string;
    school_id?: string;
    prompt_text: string;
    word_limit: number;
  };

  if (!essay_type || !prompt_text || !word_limit) {
    return NextResponse.json({ error: "essay_type, prompt_text, and word_limit required" }, { status: 400 });
  }

  const { data: essay, error } = await db
    .from("cc_essays")
    .insert({
      student_id: profile.id,
      essay_type,
      school_id: school_id || null,
      prompt_text,
      word_limit,
      phase: "brainstorm",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create essay" }, { status: 500 });
  }

  return NextResponse.json({ essay });
}
```

- [ ] **Step 2: Replace `src/app/api/cc/essays/[id]/brainstorm/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getBrainstormSystemPrompt } from "@/lib/cc/essay-helpers";
import { streamLLM, collectSSEStream, type ChatMessage } from "@/lib/cc/llm-stream";
import { validateGuardrail } from "@/lib/cc/essay-guardrail";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_brainstorm");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const body = await req.json();
  const { message } = body as { message: string };
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const db = createAdminSupabase();

  // Log student message
  await db.from("cc_essay_interactions").insert({
    essay_id: id,
    turn_type: "student_message",
    content: message,
    word_count: message.split(/\s+/).length,
  });

  // Build conversation from transcript
  const transcript: { role: string; content: string }[] = ctx.brainstormTranscript || [];
  transcript.push({ role: "user", content: message });

  const systemPrompt = getBrainstormSystemPrompt(ctx);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...transcript.map((t) => ({
      role: (t.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
      content: t.content,
    })),
  ];

  const result = await streamLLM(messages, { maxTokens: 300, temperature: 0.7 });
  if (!result) {
    return NextResponse.json({ error: "LLM unavailable" }, { status: 503 });
  }

  // Collect full response for guardrail check and transcript storage
  const [guardStream, returnStream] = result.stream.tee();
  const fullText = await collectSSEStream(guardStream);
  const guardrail = validateGuardrail(fullText);

  // Log AI response
  await db.from("cc_essay_interactions").insert({
    essay_id: id,
    turn_type: guardrail.passed ? "ai_response" : "ai_blocked",
    content: fullText,
    word_count: fullText.split(/\s+/).length,
    was_blocked: !guardrail.passed,
  });

  // Update transcript
  transcript.push({ role: "assistant", content: guardrail.sanitizedText });
  await db
    .from("cc_essays")
    .update({ brainstorm_transcript: transcript, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (!guardrail.passed) {
    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(guardrail.sanitizedText));
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Guardrail-Blocked": "true",
        },
      }
    );
  }

  // Return collected text as stream (since we already consumed the tee'd stream)
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(guardrail.sanitizedText));
        controller.close();
      },
    }),
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }
  );
}
```

- [ ] **Step 3: Replace `src/app/api/cc/essays/[id]/outline/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getOutlineSystemPrompt } from "@/lib/cc/essay-helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json();
  const { action, outline, selectedThemes } = body as {
    action: "generate" | "save";
    outline?: Record<string, unknown>;
    selectedThemes?: string[];
  };

  const db = createAdminSupabase();

  if (action === "save" && outline) {
    const { error } = await db
      .from("cc_essays")
      .update({
        outline_json: outline,
        phase: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to save outline" }, { status: 500 });
    }

    await db.from("cc_essay_interactions").insert({
      essay_id: id,
      turn_type: "outline_save",
      content: JSON.stringify(outline),
    });

    return NextResponse.json({ saved: true });
  }

  // Generate outlines
  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_outline");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  const systemPrompt = getOutlineSystemPrompt(ctx);
  const themesText = selectedThemes?.length
    ? `Student chose these themes: ${selectedThemes.join(", ")}`
    : "Use the brainstorm conversation to identify the best themes.";

  const transcript = ctx.brainstormTranscript || [];
  const brainstormSummary = transcript
    .map((t) => `${t.role}: ${t.content}`)
    .join("\n");

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Brainstorm conversation:\n${brainstormSummary}\n\n${themesText}\n\nGenerate 3 outline options as JSON.`,
    },
  ];

  const result = await callLLMJSON<{ outlines: unknown[] }>(messages, { maxTokens: 1500 });

  if (!result?.outlines) {
    return NextResponse.json({ error: "Failed to generate outlines" }, { status: 500 });
  }

  // Advance phase
  await db
    .from("cc_essays")
    .update({ phase: "outline", updated_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ outlines: result.outlines });
}
```

- [ ] **Step 4: Replace `src/app/api/cc/essays/[id]/draft/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json();
  const { content } = body as { content: string };

  if (content == null) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const db = createAdminSupabase();

  const { error } = await db
    .from("cc_essays")
    .update({
      current_draft: content,
      word_count: wordCount,
      phase: "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }

  return NextResponse.json({ saved: true, word_count: wordCount });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Quick check endpoint
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const { deductCredits, CREDIT_COSTS } = await import("@/lib/credits");
  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_quick_check");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const { buildEssayContext, getQuickCheckSystemPrompt } = await import("@/lib/cc/essay-helpers");
  const { streamLLM, type ChatMessage } = await import("@/lib/cc/llm-stream");

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx || !ctx.currentDraft) {
    return NextResponse.json({ error: "No draft to check" }, { status: 400 });
  }

  const systemPrompt = getQuickCheckSystemPrompt(ctx);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Here is my draft:\n\n${ctx.currentDraft}` },
  ];

  const result = await streamLLM(messages, { maxTokens: 300 });
  if (!result) {
    return NextResponse.json({ error: "LLM unavailable" }, { status: 503 });
  }

  return new Response(result.stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

Wait — the `type` import won't work with dynamic import. Let me fix that:

Actually, the draft route's POST handler uses a dynamic import syntax that won't work for type imports. Let me restructure — use static imports instead:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getQuickCheckSystemPrompt } from "@/lib/cc/essay-helpers";
import { streamLLM, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const body = await req.json();
  const { content } = body as { content: string };

  if (content == null) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const db = createAdminSupabase();

  const { error } = await db
    .from("cc_essays")
    .update({
      current_draft: content,
      word_count: wordCount,
      phase: "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }

  return NextResponse.json({ saved: true, word_count: wordCount });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_quick_check");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx || !ctx.currentDraft) {
    return NextResponse.json({ error: "No draft to check" }, { status: 400 });
  }

  const systemPrompt = getQuickCheckSystemPrompt(ctx);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Here is my draft:\n\n${ctx.currentDraft}` },
  ];

  const result = await streamLLM(messages, { maxTokens: 300 });
  if (!result) {
    return NextResponse.json({ error: "LLM unavailable" }, { status: 503 });
  }

  return new Response(result.stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

- [ ] **Step 5: Replace `src/app/api/cc/essays/[id]/review/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { buildEssayContext, getReviewSystemPrompt } from "@/lib/cc/essay-helpers";
import { callLLMJSON, type ChatMessage } from "@/lib/cc/llm-stream";
import { deductCredits, CREDIT_COSTS } from "@/lib/credits";

interface ReviewComment {
  paragraphIndex: number;
  type: string;
  text: string;
  severity: string;
}

interface ReviewResult {
  comments: ReviewComment[];
  overallNotes: string;
  wordCount: number;
  promptFitScore: number;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const ok = await deductCredits(auth.user.id, CREDIT_COSTS.coach_text, "essay_review");
  if (!ok) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const ctx = await buildEssayContext(auth.user.id, id);
  if (!ctx || !ctx.currentDraft) {
    return NextResponse.json({ error: "No draft to review" }, { status: 400 });
  }

  const db = createAdminSupabase();

  await db.from("cc_essay_interactions").insert({
    essay_id: id,
    turn_type: "review_request",
    content: ctx.currentDraft,
    word_count: ctx.currentDraft.split(/\s+/).length,
  });

  const systemPrompt = getReviewSystemPrompt(ctx);
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Review this draft:\n\n${ctx.currentDraft}` },
  ];

  const review = await callLLMJSON<ReviewResult>(messages, { maxTokens: 2000 });

  if (!review) {
    return NextResponse.json({ error: "Review generation failed" }, { status: 500 });
  }

  // Store review and advance phase
  await db
    .from("cc_essays")
    .update({
      revision_comments: review,
      phase: "revise",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  return NextResponse.json({ review });
}
```

- [ ] **Step 6: Replace `src/app/api/cc/essays/[id]/share/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorized, createAdminSupabase } from "../../../helpers";
import { randomBytes } from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;

  const db = createAdminSupabase();

  // Check if share token already exists
  const { data: essay } = await db
    .from("cc_essays")
    .select("share_token")
    .eq("id", id)
    .single();

  if (!essay) {
    return NextResponse.json({ error: "Essay not found" }, { status: 404 });
  }

  let shareToken = essay.share_token;
  if (!shareToken) {
    shareToken = randomBytes(16).toString("hex");
    await db
      .from("cc_essays")
      .update({ share_token: shareToken })
      .eq("id", id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kairos.ai";
  return NextResponse.json({
    share_token: shareToken,
    share_url: `${baseUrl}/cc/essays/shared/${shareToken}`,
  });
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/api/cc/essays/route.ts src/app/api/cc/essays/\[id\]/brainstorm/route.ts src/app/api/cc/essays/\[id\]/outline/route.ts src/app/api/cc/essays/\[id\]/draft/route.ts src/app/api/cc/essays/\[id\]/review/route.ts src/app/api/cc/essays/\[id\]/share/route.ts
git commit -m "feat(essays): replace all essay API stubs with working routes"
```

---

### Task 5: Essay List Page

**Files:**
- Create: `src/app/cc/essays/page.tsx`
- Create: `src/app/cc/essays/layout.tsx`
- Create: `src/components/cc/essay/EssayCard.tsx`

- [ ] **Step 1: Create `src/app/cc/essays/layout.tsx`**

```typescript
import type { ReactNode } from "react";

export const metadata = {
  title: "Essay Studio — Kairos.ai",
  description: "AI-guided essay writing for college applications",
};

export default function EssayLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Create `src/components/cc/essay/EssayCard.tsx`**

```tsx
"use client";

import Link from "next/link";
import { FileText, Clock } from "lucide-react";

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
  brainstorm: { label: "Brainstorm", color: "bg-purple-500/20 text-purple-300" },
  outline: { label: "Outline", color: "bg-blue-500/20 text-blue-300" },
  draft: { label: "Draft", color: "bg-amber-500/20 text-amber-300" },
  revise: { label: "Revise", color: "bg-green-500/20 text-green-300" },
};

const TYPE_LABELS: Record<string, string> = {
  personal_statement: "Personal Statement",
  supplemental: "Supplemental",
  scholarship: "Scholarship",
};

interface EssayCardProps {
  id: string;
  essayType: string;
  promptText: string;
  phase: string;
  wordCount: number | null;
  wordLimit: number;
  updatedAt: string;
}

export default function EssayCard({
  id,
  essayType,
  promptText,
  phase,
  wordCount,
  wordLimit,
  updatedAt,
}: EssayCardProps) {
  const phaseInfo = PHASE_LABELS[phase] || PHASE_LABELS.brainstorm;
  const typeLabel = TYPE_LABELS[essayType] || essayType;
  const timeAgo = getTimeAgo(updatedAt);

  return (
    <Link
      href={`/cc/essays/${id}`}
      className="block p-5 rounded-2xl border border-white/10 bg-[#141414] hover:border-[#D4AF37]/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/40 uppercase tracking-wide">{typeLabel}</span>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${phaseInfo.color}`}>
          {phaseInfo.label}
        </span>
      </div>

      <p className="text-sm text-white/80 line-clamp-2 mb-3 group-hover:text-white transition-colors">
        {promptText}
      </p>

      <div className="flex items-center justify-between text-[11px] text-white/30">
        <span>
          {wordCount ?? 0} / {wordLimit} words
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </span>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
```

- [ ] **Step 3: Create `src/app/cc/essays/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import EssayCard from "@/components/cc/essay/EssayCard";

interface EssayRow {
  id: string;
  essay_type: string;
  prompt_text: string;
  phase: string;
  word_count: number | null;
  word_limit: number;
  updated_at: string;
}

const COMMON_APP_PROMPTS = [
  "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
  "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
  "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
  "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
  "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
  "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
  "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
];

export default function EssayListPage() {
  const [essays, setEssays] = useState<EssayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [essayType, setEssayType] = useState("personal_statement");
  const [wordLimit, setWordLimit] = useState(650);

  useEffect(() => {
    fetch("/api/cc/essays")
      .then((r) => r.json())
      .then((d) => setEssays(d.essays || []))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    const prompt = selectedPrompt || customPrompt;
    if (!prompt) return;
    setCreating(true);
    const res = await fetch("/api/cc/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        essay_type: essayType,
        prompt_text: prompt,
        word_limit: wordLimit,
      }),
    });
    const data = await res.json();
    if (data.essay) {
      window.location.href = `/cc/essays/${data.essay.id}`;
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Essay Studio</h1>
          <p className="text-sm text-white/40 mt-1">AI-guided essay writing — your words, your story</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Essay
        </button>
      </div>

      {showNewForm && (
        <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-[#141414]">
          <h2 className="text-sm font-semibold text-white mb-4">Start a New Essay</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 block mb-1.5">Essay Type</label>
              <select
                value={essayType}
                onChange={(e) => {
                  setEssayType(e.target.value);
                  if (e.target.value === "personal_statement") setWordLimit(650);
                  else setWordLimit(250);
                }}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              >
                <option value="personal_statement">Common App Personal Statement</option>
                <option value="supplemental">School Supplemental</option>
                <option value="scholarship">Scholarship Essay</option>
              </select>
            </div>

            {essayType === "personal_statement" && (
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Select a Prompt</label>
                <div className="space-y-2">
                  {COMMON_APP_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedPrompt(p); setCustomPrompt(""); }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        selectedPrompt === p
                          ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-white"
                          : "bg-white/5 border border-white/10 text-white/60 hover:text-white/80"
                      }`}
                    >
                      {i + 1}. {p.slice(0, 120)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            {essayType !== "personal_statement" && (
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Essay Prompt</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => { setCustomPrompt(e.target.value); setSelectedPrompt(""); }}
                  placeholder="Paste the essay prompt here..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 resize-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-white/50 block mb-1.5">Word Limit</label>
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={creating || (!selectedPrompt && !customPrompt)}
              className="px-6 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-40 transition-colors"
            >
              {creating ? "Creating..." : "Start Essay"}
            </button>
          </div>
        </div>
      )}

      {essays.length === 0 && !showNewForm ? (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">No essays yet. Click "New Essay" to start.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {essays.map((e) => (
            <EssayCard
              key={e.id}
              id={e.id}
              essayType={e.essay_type}
              promptText={e.prompt_text}
              phase={e.phase}
              wordCount={e.word_count}
              wordLimit={e.word_limit}
              updatedAt={e.updated_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/cc/essays/page.tsx src/app/cc/essays/layout.tsx src/components/cc/essay/EssayCard.tsx
git commit -m "feat(essays): essay list page with creation form and Common App prompts"
```

---

### Task 6: Essay Stepper Component

**Files:**
- Create: `src/components/cc/essay/EssayStepper.tsx`

- [ ] **Step 1: Create `src/components/cc/essay/EssayStepper.tsx`**

```tsx
"use client";

import { Check, MessageCircle, List, PenLine, Eye } from "lucide-react";

const PHASES = [
  { key: "brainstorm", label: "Brainstorm", icon: MessageCircle },
  { key: "outline", label: "Outline", icon: List },
  { key: "draft", label: "Draft", icon: PenLine },
  { key: "revise", label: "Revise", icon: Eye },
] as const;

type Phase = (typeof PHASES)[number]["key"];

const PHASE_ORDER: Phase[] = ["brainstorm", "outline", "draft", "revise"];

interface EssayStepperProps {
  currentPhase: Phase;
  onPhaseClick: (phase: Phase) => void;
}

export default function EssayStepper({ currentPhase, onPhaseClick }: EssayStepperProps) {
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      {PHASES.map((phase, i) => {
        const isActive = phase.key === currentPhase;
        const isCompleted = i < currentIndex;
        const Icon = isCompleted ? Check : phase.icon;

        return (
          <button
            key={phase.key}
            onClick={() => onPhaseClick(phase.key)}
            disabled={i > currentIndex}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                : isCompleted
                  ? "text-white/50 hover:text-white/70 cursor-pointer"
                  : "text-white/20 cursor-not-allowed"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{phase.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/essay/EssayStepper.tsx
git commit -m "feat(essays): phase stepper navigation component"
```

---

### Task 7: Brainstorm Chat Component

**Files:**
- Create: `src/components/cc/essay/BrainstormChat.tsx`

- [ ] **Step 1: Create `src/components/cc/essay/BrainstormChat.tsx`**

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface BrainstormChatProps {
  essayId: string;
  initialTranscript: Message[];
  onAdvanceToOutline: (themes: string[]) => void;
}

export default function BrainstormChat({
  essayId,
  initialTranscript,
  onAdvanceToOutline,
}: BrainstormChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialTranscript);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-start: if no messages, send an empty first message to get AI's opening question
  useEffect(() => {
    if (messages.length === 0) {
      sendMessage("Hi, I'm ready to brainstorm my essay.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (text: string) => {
    if (streaming) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch(`/api/cc/essays/${essayId}/brainstorm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: err.error || "Something went wrong." },
        ]);
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let aiText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiText };
          return updated;
        });
      }

      // Check if AI response contains theme summaries
      if (aiText.toLowerCase().includes("theme:") || aiText.toLowerCase().includes("theme 1")) {
        setShowThemePicker(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  const extractThemes = (): string[] => {
    const lastAi = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAi) return [];
    const themeMatches = lastAi.content.match(/Theme[:\s]*[^.\n]+/gi) || [];
    return themeMatches.map((t) => t.replace(/^Theme[:\s]*/i, "").trim());
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#D4AF37]/20 text-white"
                  : "bg-white/5 text-white/80 border border-white/10"
              }`}
            >
              {msg.content || (
                <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Theme picker */}
      {showThemePicker && (
        <div className="px-4 py-3 border-t border-white/10 bg-white/5">
          <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Select 1-2 themes to develop:
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {extractThemes().map((theme) => (
              <button
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedThemes.includes(theme)
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                    : "bg-white/5 text-white/60 border border-white/10 hover:text-white/80"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
          {selectedThemes.length > 0 && (
            <button
              onClick={() => onAdvanceToOutline(selectedThemes)}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030]"
            >
              Continue to Outline
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-white/10 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts..."
          disabled={streaming}
          className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || streaming}
          className="p-2 rounded-xl bg-[#D4AF37] text-black disabled:opacity-40 hover:bg-[#C4A030] transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/essay/BrainstormChat.tsx
git commit -m "feat(essays): brainstorm chat component with theme extraction"
```

---

### Task 8: Outline Picker Component

**Files:**
- Create: `src/components/cc/essay/OutlinePicker.tsx`

- [ ] **Step 1: Create `src/components/cc/essay/OutlinePicker.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

interface OutlineSection {
  label: string;
  bullets: string[];
  wordBudget: number;
}

interface OutlineOption {
  title: string;
  sections: OutlineSection[];
}

interface OutlinePickerProps {
  essayId: string;
  selectedThemes: string[];
  onOutlineSaved: (outline: OutlineOption) => void;
}

export default function OutlinePicker({
  essayId,
  selectedThemes,
  onOutlineSaved,
}: OutlinePickerProps) {
  const [outlines, setOutlines] = useState<OutlineOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateOutlines = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", selectedThemes }),
      });
      const data = await res.json();
      if (data.outlines) {
        setOutlines(data.outlines);
        setGenerated(true);
      }
    } catch {
      // error handled silently
    } finally {
      setLoading(false);
    }
  };

  const saveOutline = async () => {
    if (selected === null) return;
    setSaving(true);
    const outline = outlines[selected];
    const res = await fetch(`/api/cc/essays/${essayId}/outline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", outline }),
    });
    const data = await res.json();
    if (data.saved) {
      onOutlineSaved(outline);
    }
    setSaving(false);
  };

  if (!generated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-sm text-white/50 mb-2">
          Themes: {selectedThemes.join(", ")}
        </p>
        <button
          onClick={generateOutlines}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Generating outlines..." : "Generate 3 Outline Options"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-xs text-white/40">Pick an outline structure for your essay:</p>

      <div className="grid gap-4">
        {outlines.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selected === i
                ? "border-[#D4AF37]/40 bg-[#D4AF37]/5"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">{opt.title}</h3>
              {selected === i && <Check className="w-4 h-4 text-[#D4AF37]" />}
            </div>
            <div className="space-y-2">
              {opt.sections.map((sec, j) => (
                <div key={j}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/60">{sec.label}</span>
                    <span className="text-[10px] text-white/30">~{sec.wordBudget} words</span>
                  </div>
                  <ul className="ml-3 mt-1 space-y-0.5">
                    {sec.bullets.map((b, k) => (
                      <li key={k} className="text-xs text-white/50">
                        - {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="flex justify-end">
          <button
            onClick={saveOutline}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Use This Outline"}
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/essay/OutlinePicker.tsx
git commit -m "feat(essays): outline picker component with 3-option selection"
```

---

### Task 9: Draft Editor Component

**Files:**
- Create: `src/components/cc/essay/DraftEditor.tsx`

- [ ] **Step 1: Create `src/components/cc/essay/DraftEditor.tsx`**

```tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface OutlineSection {
  label: string;
  bullets: string[];
  wordBudget: number;
}

interface DraftEditorProps {
  essayId: string;
  initialDraft: string;
  wordLimit: number;
  outline: { sections: OutlineSection[] } | null;
  onRequestReview: () => void;
}

export default function DraftEditor({
  essayId,
  initialDraft,
  wordLimit,
  outline,
  onRequestReview,
}: DraftEditorProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [quickCheckNotes, setQuickCheckNotes] = useState("");
  const [checkingDraft, setCheckingDraft] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const countWords = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setWordCount(countWords(draft));
  }, [draft]);

  const saveDraft = useCallback(
    async (content: string) => {
      setSaving(true);
      try {
        await fetch(`/api/cc/essays/${essayId}/draft`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } catch {
        // silent
      } finally {
        setSaving(false);
      }
    },
    [essayId]
  );

  const handleChange = (text: string) => {
    setDraft(text);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(text), 3000);
  };

  const requestQuickCheck = async () => {
    await saveDraft(draft);
    setCheckingDraft(true);
    setQuickCheckNotes("");

    try {
      const res = await fetch(`/api/cc/essays/${essayId}/draft`, {
        method: "POST",
      });
      if (!res.ok || !res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setQuickCheckNotes(text);
      }
    } catch {
      setQuickCheckNotes("Could not get feedback. Try again.");
    } finally {
      setCheckingDraft(false);
    }
  };

  const wordCountColor =
    wordCount > wordLimit
      ? "text-red-400"
      : wordCount > wordLimit * 0.9
        ? "text-amber-400"
        : "text-white/40";

  return (
    <div className="flex h-full">
      {/* Outline sidebar */}
      {outline && (
        <div className="w-56 shrink-0 border-r border-white/10 p-4 overflow-y-auto hidden md:block">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Outline
          </h3>
          {outline.sections.map((sec, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-white/60">{sec.label}</span>
                <span className="text-[10px] text-white/30">~{sec.wordBudget}w</span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {sec.bullets.map((b, j) => (
                  <li key={j} className="text-[11px] text-white/40">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <textarea
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Start writing your essay..."
            className="w-full h-full resize-none bg-transparent text-white text-sm leading-7 placeholder:text-white/20 focus:outline-none"
          />
        </div>

        {/* Bottom bar */}
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-xs font-mono ${wordCountColor}`}>
              {wordCount} / {wordLimit}
            </span>
            {saving && <span className="text-[10px] text-white/20">Saving...</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={requestQuickCheck}
              disabled={checkingDraft || wordCount < 50}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/60 border border-white/10 hover:text-white/80 hover:border-white/20 disabled:opacity-30 transition-colors"
            >
              {checkingDraft ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              Quick Check
            </button>
            <button
              onClick={onRequestReview}
              disabled={wordCount < 100}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] disabled:opacity-40"
            >
              Request Review
            </button>
          </div>
        </div>
      </div>

      {/* Quick check panel */}
      {quickCheckNotes && (
        <div className="w-64 shrink-0 border-l border-white/10 p-4 overflow-y-auto">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            AI Notes
          </h3>
          <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">
            {quickCheckNotes}
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/essay/DraftEditor.tsx
git commit -m "feat(essays): draft editor with auto-save, word count, and quick check"
```

---

### Task 10: Revision Panel Component

**Files:**
- Create: `src/components/cc/essay/RevisionPanel.tsx`

- [ ] **Step 1: Create `src/components/cc/essay/RevisionPanel.tsx`**

```tsx
"use client";

import { AlertTriangle, CheckCircle, MessageCircle } from "lucide-react";

interface ReviewComment {
  paragraphIndex: number;
  type: string;
  text: string;
  severity: string;
}

interface ReviewData {
  comments: ReviewComment[];
  overallNotes: string;
  wordCount: number;
  promptFitScore: number;
}

interface RevisionPanelProps {
  review: ReviewData | null;
  loading: boolean;
}

const SEVERITY_STYLES: Record<string, { icon: typeof CheckCircle; color: string }> = {
  positive: { icon: CheckCircle, color: "text-green-400 border-green-500/20 bg-green-500/5" },
  suggestion: { icon: MessageCircle, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
  warning: { icon: AlertTriangle, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
};

export default function RevisionPanel({ review, loading }: RevisionPanelProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37] mx-auto mb-3" />
          <p className="text-xs text-white/40">Reviewing your essay...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-xs text-white/30">No review yet. Click "Request Review" when ready.</p>
      </div>
    );
  }

  const fitPct = Math.round(review.promptFitScore * 100);

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      {/* Summary bar */}
      <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="text-center">
          <span className="text-lg font-bold text-[#D4AF37]">{fitPct}%</span>
          <p className="text-[10px] text-white/30">Prompt Fit</p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-white">{review.wordCount}</span>
          <p className="text-[10px] text-white/30">Words</p>
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-white">{review.comments.length}</span>
          <p className="text-[10px] text-white/30">Comments</p>
        </div>
      </div>

      {/* Overall notes */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-white/60 leading-relaxed">{review.overallNotes}</p>
      </div>

      {/* Comments */}
      <div className="space-y-2">
        {review.comments.map((comment, i) => {
          const style = SEVERITY_STYLES[comment.severity] || SEVERITY_STYLES.suggestion;
          const Icon = style.icon;
          return (
            <div
              key={i}
              className={`p-3 rounded-xl border ${style.color}`}
            >
              <div className="flex items-start gap-2">
                <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-white/30 uppercase">
                      P{comment.paragraphIndex + 1}
                    </span>
                    <span className="text-[10px] text-white/30">{comment.type}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cc/essay/RevisionPanel.tsx
git commit -m "feat(essays): revision panel with line-level comment display"
```

---

### Task 11: Essay Workspace Page (Main Orchestrator)

**Files:**
- Create: `src/app/cc/essays/[id]/page.tsx`

- [ ] **Step 1: Create `src/app/cc/essays/[id]/page.tsx`**

```tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EssayStepper from "@/components/cc/essay/EssayStepper";
import BrainstormChat from "@/components/cc/essay/BrainstormChat";
import OutlinePicker from "@/components/cc/essay/OutlinePicker";
import DraftEditor from "@/components/cc/essay/DraftEditor";
import RevisionPanel from "@/components/cc/essay/RevisionPanel";

type Phase = "brainstorm" | "outline" | "draft" | "revise";

interface EssayData {
  id: string;
  essay_type: string;
  prompt_text: string;
  word_limit: number;
  phase: Phase;
  brainstorm_transcript: { role: string; content: string }[] | null;
  outline_json: { sections: { label: string; bullets: string[]; wordBudget: number }[] } | null;
  current_draft: string | null;
  revision_comments: {
    comments: { paragraphIndex: number; type: string; text: string; severity: string }[];
    overallNotes: string;
    wordCount: number;
    promptFitScore: number;
  } | null;
}

export default function EssayWorkspace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [essay, setEssay] = useState<EssayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState<Phase>("brainstorm");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/cc/essays`)
      .then((r) => r.json())
      .then((d) => {
        const found = (d.essays || []).find((e: EssayData) => e.id === id);
        if (found) {
          setEssay(found);
          setActivePhase(found.phase as Phase);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdvanceToOutline = (themes: string[]) => {
    setSelectedThemes(themes);
    setActivePhase("outline");
  };

  const handleOutlineSaved = () => {
    setActivePhase("draft");
    // Reload essay data to get updated outline
    fetch(`/api/cc/essays`)
      .then((r) => r.json())
      .then((d) => {
        const found = (d.essays || []).find((e: EssayData) => e.id === id);
        if (found) setEssay(found);
      });
  };

  const handleRequestReview = async () => {
    setReviewLoading(true);
    setActivePhase("revise");
    try {
      const res = await fetch(`/api/cc/essays/${id}/review`, { method: "POST" });
      const data = await res.json();
      if (data.review) {
        setEssay((prev) =>
          prev ? { ...prev, revision_comments: data.review, phase: "revise" } : prev
        );
      }
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (!essay) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-white/40">Essay not found.</p>
        <Link href="/cc/essays" className="text-[#D4AF37] text-sm mt-2 inline-block">
          Back to essays
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/cc/essays" className="text-white/30 hover:text-white/50">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-xs text-white/40 line-clamp-1 max-w-md">
              {essay.prompt_text}
            </p>
          </div>
        </div>
        <EssayStepper currentPhase={activePhase} onPhaseClick={setActivePhase} />
      </div>

      {/* Phase content */}
      <div className="flex-1 overflow-hidden">
        {activePhase === "brainstorm" && (
          <BrainstormChat
            essayId={id}
            initialTranscript={
              (essay.brainstorm_transcript as { role: "user" | "assistant"; content: string }[]) || []
            }
            onAdvanceToOutline={handleAdvanceToOutline}
          />
        )}

        {activePhase === "outline" && (
          <OutlinePicker
            essayId={id}
            selectedThemes={selectedThemes}
            onOutlineSaved={handleOutlineSaved}
          />
        )}

        {activePhase === "draft" && (
          <DraftEditor
            essayId={id}
            initialDraft={essay.current_draft || ""}
            wordLimit={essay.word_limit}
            outline={essay.outline_json}
            onRequestReview={handleRequestReview}
          />
        )}

        {activePhase === "revise" && (
          <div className="flex h-full">
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-xs text-white/40 uppercase tracking-wide mb-3">Your Draft</h3>
                <div className="text-sm text-white/80 leading-7 whitespace-pre-wrap">
                  {essay.current_draft || "No draft yet."}
                </div>
              </div>
            </div>
            <div className="w-80 shrink-0 border-l border-white/10">
              <RevisionPanel
                review={essay.revision_comments}
                loading={reviewLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/cc/essays/\[id\]/page.tsx
git commit -m "feat(essays): essay workspace page with phase orchestration"
```

---

### Task 12: Build Verification

- [ ] **Step 1: Run build**

```bash
npm run build
```

Fix any TypeScript errors.

- [ ] **Step 2: Final commit (if fixes needed)**

```bash
git add -A
git commit -m "fix(essays): build fixes for essay studio"
```

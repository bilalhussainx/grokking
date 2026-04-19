# Feature 6.7 — Essay Studio Design Spec

> **Date:** 2026-04-18
> **Status:** Approved
> **Scope:** AI-guided essay writing tool with anti-ghostwriting guardrail

---

## Goal

Build a four-phase essay writing tool (Brainstorm → Outline → Draft → Revise) where AI acts as a Socratic coach. The AI asks questions, suggests structure, and flags issues but **never writes prose**. Maximum 15-word example snippets in AI responses. Every interaction is audit-logged for anti-ghostwriting compliance.

## Essay Types Supported

- **Common App Personal Statement** — 650-word limit, 7 prompts
- **School Supplementals** — variable word limits, pulled from `cc_schools.essay_prompts`
- **Scholarship Essays** — linked to `cc_scholarships.essay_prompts`

## Existing Infrastructure

### Database (already migrated)

- `cc_essays`: id, student_id, school_id, essay_type, prompt_text, word_limit, phase, brainstorm_transcript, outline_json, current_draft, revision_comments, word_count, share_token, updated_at
- `cc_essay_interactions`: id, essay_id, turn_type, content, word_count, was_blocked, timestamp

### API Stubs (to be replaced)

- `POST /api/cc/essays` — create essay
- `POST /api/cc/essays/[id]/brainstorm` — brainstorm turn
- `POST /api/cc/essays/[id]/outline` — outline generation/save
- `PATCH /api/cc/essays/[id]/draft` — save draft
- `POST /api/cc/essays/[id]/review` — request AI review
- `POST /api/cc/essays/[id]/share` — generate share link

---

## Phase 1 — Brainstorm (Conversational)

### Flow

1. Student creates an essay (picks type + prompt + school if supplemental)
2. AI reads student profile (activities, honors, academics) and opens with a personalized question
3. AI asks 5-7 Socratic questions about the student's life, values, turning points
4. Student responds via text (voice support deferred)
5. After enough material, AI summarizes 2-3 themes found as short labels (e.g., "Theme: resilience through robotics setback")
6. Student picks 1-2 themes to develop
7. Phase advances to Outline

### AI Behavior

- Every AI message must be a question or a theme label
- No prose generation — theme labels max 15 words
- Questions reference student's actual profile data ("You mentioned leading debate team for 3 years — tell me about a moment that tested you")
- Conversation stored in `brainstorm_transcript` as JSON array of `{ role, content, timestamp }`

### Brainstorm System Prompt

```
You are a college essay brainstorm coach. Your job is to help the student discover their unique story through questions — never by writing for them.

Rules:
1. Ask ONE question per message
2. Never write prose, paragraphs, or essay text
3. Theme summaries must be under 15 words
4. Reference the student's actual activities and experiences
5. After 5-7 exchanges, summarize 2-3 themes as short labels
6. Let the student choose which theme to develop

Student profile context will be provided. Use it to ask specific, personal questions.
```

---

## Phase 2 — Outline (Structured)

### Flow

1. Based on chosen theme(s), AI generates 3 outline options
2. Each outline has 3-5 sections: hook, development (1-3 body sections), reflection/conclusion
3. Each section is a bullet point — max 15 words per bullet
4. Student picks one outline or mixes sections from multiple
5. Student can edit bullets before confirming
6. Confirmed outline saved to `outline_json`
7. Phase advances to Draft

### Outline JSON Schema

```json
{
  "sections": [
    {
      "label": "Hook",
      "bullets": ["Open with the moment the robot arm snapped mid-competition"],
      "wordBudget": 80
    },
    {
      "label": "Development",
      "bullets": [
        "Describe the feeling of public failure",
        "How you rallied the team overnight"
      ],
      "wordBudget": 350
    },
    {
      "label": "Reflection",
      "bullets": ["Connect to how you approach challenges now"],
      "wordBudget": 150
    }
  ],
  "totalWordBudget": 650
}
```

### Outline System Prompt

```
You are a college essay outline coach. Generate 3 structural options for the student's chosen theme.

Rules:
1. Each outline has 3-5 sections (hook, development, reflection)
2. Each bullet is a structural direction, not prose — max 15 words
3. Include a suggested word budget per section that totals to the essay word limit
4. Never write actual essay sentences
5. Use the student's real experiences from their profile
```

---

## Phase 3 — Draft (Student Writes, AI Monitors)

### Flow

1. Student sees their confirmed outline as a sidebar guide
2. Main area is a textarea with live word count and section markers
3. Student writes all prose themselves
4. Auto-save fires every 3 seconds (debounced) via `PATCH /api/cc/essays/[id]/draft`
5. Student can request "quick check" at any point — AI gives 1-3 sidebar notes
6. Notes are structural observations, never rewrites: "Your hook is 120 words — consider tightening" or "This paragraph drifts from your theme"

### Quick Check System Prompt

```
You are reviewing a college essay draft in progress. Give 1-3 brief structural observations.

Rules:
1. Comment on structure, pacing, theme consistency, word count distribution
2. Never rewrite any sentence
3. Never suggest specific words or phrases longer than 15 words
4. Frame feedback as questions when possible: "Does this paragraph serve your main theme?"
5. If the draft is strong, say so briefly
```

### UI

- Left: outline sidebar (collapsible) showing section labels + word budgets
- Center: textarea with live word count, target word count, section dividers
- Right: AI notes panel (appears on "Quick Check" request)
- Bottom: phase stepper showing progress

---

## Phase 4 — Revise (AI Feedback)

### Flow

1. Student clicks "Request Review" when draft feels ready
2. AI analyzes the full draft against: prompt fit, structure, voice consistency, cliches, "show don't tell," word count
3. Returns 5-10 line-level comments as a review
4. Each comment references a specific passage (by word range or paragraph number)
5. Student edits draft, can re-request review
6. When satisfied, student marks essay as "done" (phase stays at revise, `status` flag added)

### Review Comment Schema

```json
{
  "comments": [
    {
      "paragraphIndex": 0,
      "type": "structure",
      "text": "Your hook drops the reader into action — strong start.",
      "severity": "positive"
    },
    {
      "paragraphIndex": 2,
      "type": "voice",
      "text": "This paragraph shifts to formal academic tone — does that match your voice elsewhere?",
      "severity": "suggestion"
    },
    {
      "paragraphIndex": 4,
      "type": "cliche",
      "text": "'Changed my life forever' — can you show this with a specific detail instead?",
      "severity": "warning"
    }
  ],
  "overallNotes": "Strong personal voice. Tighten paragraphs 2-3 to stay under 650 words.",
  "wordCount": 672,
  "promptFitScore": 0.85
}
```

### Review System Prompt

```
You are a college essay reviewer. Analyze the draft and provide line-level feedback.

Rules:
1. Reference specific paragraphs by number
2. Never rewrite sentences — point out issues and ask questions
3. Check for: prompt fit, structure, voice consistency, cliches, "show don't tell", word count
4. Example snippets (to illustrate a point) must be under 15 words
5. Be encouraging — highlight what works, not just what needs fixing
6. Return structured JSON with comments array
```

---

## Anti-Ghostwriting Guardrail

### Three-Layer Defense

**Layer 1 — Prompt-level:**
Every system prompt includes the 15-word max rule. AI is instructed to never generate prose, only questions, structural hints, and brief example phrases.

**Layer 2 — Server-side validation (`src/lib/cc/essay-guardrail.ts`):**

Before returning any AI response in brainstorm/outline/review phases:
1. Split response into sentences (by `.`, `!`, `?`)
2. For each sentence that is NOT a question (doesn't end with `?`):
   - Count words
   - If >15 words AND looks like prose (not a bullet/label), flag it
3. If flagged sentences found:
   - Replace the entire AI response with: `"I can help you think through this — what specific part are you working on?"`
   - Log to `cc_essay_interactions` with `was_blocked = true`
   - Return `X-Guardrail-Blocked: true` header

**Layer 3 — Audit trail:**
Every interaction logged to `cc_essay_interactions`:
- `turn_type`: `student_message`, `ai_response`, `ai_blocked`, `draft_save`, `review_request`, `outline_save`, `theme_select`
- `word_count`: word count of the content
- `was_blocked`: whether guardrail triggered

### Guardrail Exceptions

- Questions (ending with `?`) are exempt from the 15-word limit
- Outline bullets are exempt (they're structural, not prose)
- Review comments referencing student's own text are exempt (quoting back)
- The guardrail does NOT apply to the Draft phase — the student is writing, AI only gives short notes

---

## Components

| Component | Path | Purpose |
|-----------|------|---------|
| Essay list page | `src/app/cc/essays/page.tsx` | Grid of essay cards with phase badges, "New Essay" button |
| Essay workspace | `src/app/cc/essays/[id]/page.tsx` | Phase stepper + active phase component |
| EssayStepper | `src/components/cc/essay/EssayStepper.tsx` | Horizontal phase nav (brainstorm → outline → draft → revise) |
| BrainstormChat | `src/components/cc/essay/BrainstormChat.tsx` | Chat UI for brainstorm conversation |
| OutlinePicker | `src/components/cc/essay/OutlinePicker.tsx` | 3-option outline cards with edit capability |
| DraftEditor | `src/components/cc/essay/DraftEditor.tsx` | Textarea + word count + outline sidebar + AI notes |
| RevisionPanel | `src/components/cc/essay/RevisionPanel.tsx` | Line-level comment display alongside draft |
| EssayCard | `src/components/cc/essay/EssayCard.tsx` | Card for essay list showing title, school, phase, word count |
| Guardrail lib | `src/lib/cc/essay-guardrail.ts` | Anti-ghostwriting validation function |
| Essay helpers | `src/lib/cc/essay-helpers.ts` | Profile context builder for essay AI prompts |

## API Routes (replacing stubs)

| Route | Method | Input | Output |
|-------|--------|-------|--------|
| `/api/cc/essays` | GET | — | `{ essays: EssayRow[] }` |
| `/api/cc/essays` | POST | `{ essay_type, school_id?, prompt_text, word_limit }` | `{ essay: EssayRow }` |
| `/api/cc/essays/[id]/brainstorm` | POST | `{ message: string }` | SSE stream (AI question) |
| `/api/cc/essays/[id]/outline` | POST | `{ action: 'generate' \| 'save', outline?: OutlineJSON }` | `{ outlines: OutlineJSON[] }` or `{ saved: true }` |
| `/api/cc/essays/[id]/draft` | PATCH | `{ content: string }` | `{ word_count: number, saved: true }` |
| `/api/cc/essays/[id]/review` | POST | — | SSE stream (review JSON) |
| `/api/cc/essays/[id]/share` | POST | — | `{ share_token: string, share_url: string }` |

## LLM Provider

Uses the same OpenRouter → Moonshot → Gemini fallback chain as Coach Kairos (`src/app/api/cc/coach/route.ts`). Extract the streaming helper into `src/lib/cc/llm-stream.ts` for reuse.

## State Machine

```
brainstorm → outline → draft → revise
     ↑                          |
     └──────────────────────────┘  (student can restart from any phase)
```

Phase transitions:
- brainstorm → outline: student selects theme(s)
- outline → draft: student confirms outline
- draft → revise: student requests first review
- Any phase can go back to brainstorm (resets downstream data with confirmation)

---

## Out of Scope (deferred)

- Voice input during brainstorm (use text for now)
- Collaborative editing (counselor co-edit)
- Essay comparison across schools
- Plagiarism detection
- Common App prompt database auto-sync

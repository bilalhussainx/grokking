# Feature 6.19 — Coach Kairos Router (Minimal v1)

## Summary

A hybrid rule+LLM router at `POST /api/cc/coach` that dispatches user messages to one of three specialized sub-agents: Intake, List Builder, or General Counselor. Rules handle obvious cases instantly; an LLM classifier resolves ambiguous messages.

## Routing Logic

### Layer 1: Deterministic Rules (no LLM call)

| Condition | Agent | Rationale |
|-----------|-------|-----------|
| No `cc_student_profiles` row OR `profile_completion_pct < 30` | `intake` | New user needs onboarding |
| `context.page` is `/intake` | `intake` | User is on intake page |
| `context.page` is `/my-schools` or `/schools` | `list-builder` | User is browsing schools |
| Message matches school-intent keywords | `list-builder` | Explicit school search intent |
| Message matches essay/aid/deadline keywords | `general` | Counseling topics |

**School-intent keywords** (case-insensitive, whole-word or phrase):
`find schools`, `find colleges`, `recommend schools`, `recommend colleges`, `school list`, `college list`, `reach school`, `safety school`, `match school`, `compare schools`, `add school`, `remove school`, `acceptance rate`, `net price`

**Counseling keywords:**
`essay`, `personal statement`, `supplement`, `financial aid`, `FAFSA`, `CSS Profile`, `scholarship`, `deadline`, `application`, `recommendation letter`, `extracurricular`, `activities list`

### Layer 2: LLM Classifier (ambiguous only)

When no rule matches, send to GPT-4o-mini (or Moonshot fallback):

```
Classify this college counseling message into exactly one category.
Categories: intake (profile/onboarding questions), list-builder (school search/comparison), general (essays, aid, deadlines, process, other)
Student profile completion: {pct}%
Message: "{message}"
Reply with only the category name.
```

Temperature: 0, max_tokens: 10. Expected latency: ~150ms.

**Caching:** Store the classified agent per conversation. Once a conversation is classified, subsequent messages in the same conversation use the same agent unless the user explicitly changes topic (detected by a rule match to a different agent).

## Sub-Agent Prompts

### Intake Agent

```
You are Coach Kairos — a warm, encouraging college counselor helping a first-generation student build their profile. You ask one question at a time. You explain jargon simply. You never overwhelm.

Your job right now: help the student fill in their profile. Ask about what's missing.

STUDENT PROFILE (what we know so far):
{profileContext}

WHAT'S MISSING:
{missingFields}

Ask about the next missing field naturally. If the student asks about something else, answer briefly, then gently steer back to profile completion.
```

### List Builder Agent

```
You are Coach Kairos — a data-savvy college counselor helping a student build a balanced school list. You reference real data: acceptance rates, net prices, test policies, deadlines.

STUDENT PROFILE:
{profileContext}

CURRENT SCHOOL LIST ({count} schools):
{schoolList}

BALANCE CHECK:
- Reach schools (accept <20%): {reachCount}
- Match schools (accept 20-50%): {matchCount}
- Safety schools (accept >50%): {safetyCount}

When recommending schools:
- Always explain WHY a school fits (connect to student's profile, interests, budget)
- Reference specific data: "Rice has a $19k net price and 8% acceptance rate"
- Flag imbalances: "You have 5 reach schools but no safeties — let's add 2-3"
- If the student asks about a specific school, pull its data and compare to their profile
```

### General Counselor

```
You are Coach Kairos — a knowledgeable, practical college counselor. You help with essays, financial aid, deadlines, recommendations, activities, and general college process questions.

STUDENT PROFILE:
{profileContext}

SCHOOL LIST SUMMARY:
{schoolListSummary}

UPCOMING DEADLINES:
{deadlines}

Guidelines:
- For essays: ask questions, suggest angles, NEVER write prose for them. Max 15 words of example text.
- For financial aid: explain clearly, reference their specific schools' net prices
- For deadlines: be specific with dates, flag anything within 30 days
- For activities: help them describe impact, not just list duties
```

## Context Builder

`buildCoachContext(userId)` fetches and formats:

1. `cc_student_profiles` → name, grade, GPA, test scores, state, first-gen status, profile completion %
2. `cc_student_schools` joined with `cc_schools` → school list with stats, grouped by chancing band
3. `cc_tasks` where status != 'completed' and due_date within 60 days → upcoming deadlines
4. Missing profile fields (for intake agent)

Returns a `CoachContext` object with `profileContext`, `schoolList`, `deadlines`, `missingFields`, `profileCompletionPct`.

## API Route

`POST /api/cc/coach` (replaces the stub at `src/app/api/cc/coach/route/route.ts`)

**Request:**
```typescript
{
  message: string;
  conversationHistory?: { role: string; content: string }[];
  context?: {
    page?: string;          // current page path
    conversationId?: string; // for agent caching
  };
}
```

**Response:** SSE text stream (same format as existing `/api/ai/coach`).

**Auth:** Required (uses `requireAuth()`). Deducts credits via `deductCredits()`.

**LLM chain:** OpenRouter (GPT-4o-mini) → Moonshot (Kimi K2) → Gemini fallback. Same pattern as existing coach.

## Files

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/cc/coach-router.ts` | Create | `routeMessage()` — rules + LLM classifier |
| `src/lib/cc/coach-agents.ts` | Create | Agent prompts + `buildCoachContext()` |
| `src/app/api/cc/coach/route.ts` | Create (replace stub) | Main endpoint |
| `src/app/api/cc/coach/route/route.ts` | Delete | Old stub |

## Not In Scope

- Conversation persistence (messages stored client-side for v1)
- Agent handoff mid-conversation (user must start new conversation)
- Voice integration (that's the existing `/talk` flow)
- Essay-specific agent (deferred to Phase 2, Feature 6.7)
- Financial aid agent (deferred to Phase 3, Feature 6.11)

# Mock Interview Feature — Design Spec

## Overview

Add a voice-based mock interview system to the Grokking platform. Users paste a job description (or pick a preset category), choose an interview type, and enter a 30-minute voice interview with an AI interviewer. A Python code editor is available during technical interviews. After the interview, a detailed scorecard is generated.

## Requirements Summary

| Requirement | Decision |
|---|---|
| Entry point | Top-level `/interviews` route with nav item |
| Interview start | Paste custom JD **or** pick from presets |
| Interview type | User chooses: Technical, Behavioral, or Mixed |
| Interview mode | Voice only (ElevenLabs agent) |
| Question strategy | Hybrid — Kimi generates plan upfront, adapts follow-ups dynamically |
| Duration | 30 minutes with countdown timer |
| Code editor | Monaco (Python) + Pyodide in-browser execution |
| Agent code awareness | Editor content sent via `sendContextualUpdate` every 3s (debounced) |
| Post-interview | Detailed scorecard — scores per category + per-question feedback |
| Persistence | `InterviewProvider` context + `sessionStorage` backup — no new DB tables for MVP |
| Editor visibility | Show editor for Technical/Mixed, hide for Behavioral (voice panel goes full-width) |

## Architecture: Approach A — ElevenLabs Agent + Kimi Pre-Planning

- **Before interview**: Kimi generates a question plan via API
- **During interview**: ElevenLabs agent runs the voice conversation, receives question plan + live code updates via `sendContextualUpdate`
- **After interview**: Kimi scores the full transcript + code snapshots

## State Management

An `InterviewProvider` context wraps `src/app/interviews/layout.tsx`, holding:
- `questionPlan` — from Kimi planning step
- `transcript` — accumulated `onMessage` entries
- `finalCode` — editor content at interview end
- `scorecard` — scoring results
- `interviewType` — technical | behavioral | mixed
- `sessionId` — client-generated UUID

All state is also mirrored to `sessionStorage` (keyed by `sessionId`) so it survives page refreshes. On mount, each phase checks context first, falls back to `sessionStorage`.

## Types (`src/types/interview.ts`)

```typescript
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

## Flow

### Phase 1: Setup (`/interviews`)

Landing page with:
- **Preset cards**: Frontend Engineer, Backend Engineer, Full Stack, System Design, Data Structures & Algorithms
- **Custom Interview**: Textarea to paste a job description
- **Interview type selector**: Technical / Behavioral / Mixed
- "Start Interview" button

On start:
1. Call `POST /api/interviews/plan` with JD/preset + type
2. Kimi returns question plan JSON
3. Generate a client-side session ID (uuid)
4. Store plan + type + sessionId in `InterviewProvider` context (auto-mirrors to `sessionStorage`)
5. Navigate to `/interviews/[sessionId]`

### Phase 2: Live Interview (`/interviews/[sessionId]`)

**Layout — Split Panel (Technical/Mixed):**
- **Top bar**: Interview title, mic status indicator, 30:00 countdown timer, "End Interview" button
- **Left (55%)**: Monaco editor (Python, top ~70%) + output console (Pyodide, bottom ~30%)
- **Right (45%)**: Voice panel — agent status, audio waveform, scrolling transcript

**Layout — Full Width (Behavioral):**
- **Top bar**: Same as above
- **Full width**: Voice panel with larger waveform, transcript, and no editor

**On mount:**
1. `conversation.startSession({ agentId: AGENT_ID, connectionType: 'websocket' })`
2. `conversation.sendContextualUpdate(interviewerPrompt + questionPlan)`
3. Start 30:00 countdown timer

**During interview:**
- `onMessage` events (where `msg.source` maps to `role` and `msg.message` maps to `text`) accumulate into `transcript[]` array of type `TranscriptEntry`. Transcript is incrementally saved to `sessionStorage` after each message.
- Editor `onChange` → debounce 3s → `sendContextualUpdate("CANDIDATE'S CURRENT CODE:\n```python\n${code}\n```\nOUTPUT (last run): ${lastOutput}")`
- Code execution via Pyodide (in-browser Python, no server)
- At 5:00 remaining: `sendContextualUpdate("TIME CHECK: 5 minutes remaining. Start wrapping up.")`
- At 0:00: `sendContextualUpdate("TIME'S UP. Say 'That wraps up our time today. Thanks for the interview.' then stop.")` → wait 10s grace period → `conversation.endSession()` → navigate to results

### Phase 3: Scorecard (`/interviews/[sessionId]/results`)

On mount:
1. Call `POST /api/interviews/score` with transcript + final code + question plan
2. Display scorecard:
   - **Overall Score** (1-10)
   - **Category scores** (1-10 each): Communication, Technical Depth, Problem Solving, Code Quality
   - **Per-question breakdown**: What was asked, summary of answer, score, feedback
   - **Strengths** list
   - **Areas for improvement** list

## API Routes

### `POST /api/interviews/plan`

**Request:**
```json
{
  "jobDescription": "string (custom JD text, or null if preset)",
  "preset": "frontend | backend | fullstack | system-design | dsa | null",
  "interviewType": "technical | behavioral | mixed"
}
```

**Response (from Kimi):**
```json
{
  "questions": [
    {
      "id": 1,
      "text": "Can you walk me through how you'd design a rate limiter?",
      "type": "technical",
      "followUps": [
        "What data structure would you use?",
        "How would you handle distributed systems?"
      ],
      "evaluationCriteria": "Looks for: sliding window, token bucket, Redis mention"
    }
  ],
  "interviewerPersona": "Senior engineer, friendly but probing",
  "timeAllocation": { "intro": 2, "questions": 25, "wrapUp": 3 }
}
```

**Implementation:** Sends JD/preset + type to Kimi (`kimi-k2-turbo-preview` via Moonshot API) with a system prompt instructing it to generate an interview plan. Non-streaming, returns JSON.

### `POST /api/interviews/score`

**Request:**
```json
{
  "transcript": [{ "role": "agent | user", "text": "string", "timestamp": 0 }],
  "questionPlan": { "...same as plan response" },
  "finalCode": "string",
  "interviewType": "technical | behavioral | mixed"
}
```

**Response (from Kimi):**
```json
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
      "question": "Design a rate limiter",
      "answerSummary": "Candidate proposed token bucket...",
      "score": 7,
      "feedback": "Good high-level thinking, missed distributed edge cases"
    }
  ],
  "strengths": ["Clear communication", "Good use of data structures"],
  "improvements": ["Consider scalability earlier", "Test edge cases in code"]
}
```

## ElevenLabs Agent Integration

Create a **separate ElevenLabs agent** for the interviewer persona in the ElevenLabs dashboard. Add `NEXT_PUBLIC_ELEVENLABS_INTERVIEWER_AGENT_ID` to `.env.local`. The Coach Alex agent (`agent_1001kkfextwsfwfsjz02qqez6tw4`) is configured for warm coaching and must NOT be reused for interviews — the personas conflict.

The interviewer agent should be configured in the dashboard with:
- A neutral, professional voice
- No first message override (handled via contextual update)
- Prompt override allowed (or use contextual updates only if not)

**Initial context sent via `sendContextualUpdate` after connection:**

```
You are a technical interviewer conducting a 30-minute mock interview.

INTERVIEW PLAN:
[Kimi's generated question plan JSON]

RULES:
- Ask questions one at a time. Wait for the candidate to respond.
- When the candidate is coding, observe their approach and give guidance if stuck for >60 seconds.
- Ask follow-up questions based on their answers.
- Keep a natural conversational tone — firm but encouraging.
- At 5 minutes remaining, wrap up with "Any questions for me?"
- Do NOT reveal answers directly. Probe with "What if..." or "Have you considered..."
```

**Code awareness:** Send initial code state after session connects (after the interview plan context). Then debounced (3s) `sendContextualUpdate` on every editor change with current content + last execution output.

## Error Handling & Recovery

| Scenario | Handling |
|---|---|
| **Kimi plan generation fails** | Show error toast on setup page, allow retry. Don't navigate. |
| **ElevenLabs connection drops** | Show "Reconnecting..." banner. Transcript preserved in context + sessionStorage. User can click "Reconnect" to start a new session with existing transcript as context. |
| **Kimi scoring fails** | Results page shows "Scoring failed" with a "Retry" button. Transcript/code are in sessionStorage so nothing is lost. |
| **Pyodide fails to load** | Show loading progress bar. On failure, show "Code execution unavailable" message with retry button. Editor still works for writing — just can't run. |
| **Page refresh mid-interview** | `InterviewProvider` rehydrates from `sessionStorage`. Voice session is lost (must reconnect), but transcript and code are preserved. Show "Session interrupted — reconnect to continue" prompt. |
| **Scoring request too large** | Truncate transcript to last 100 exchanges if over 8,000 tokens. Include a note in the scoring prompt that the transcript was truncated. |

## File Structure

```
src/app/interviews/
  layout.tsx                      — InterviewProvider wrapper
  page.tsx                        — Setup/landing page
  [sessionId]/
    page.tsx                      — Live interview room
    results/page.tsx              — Scorecard page

src/components/interview/
  InterviewSetup.tsx              — JD input + preset cards + type selector
  InterviewRoom.tsx               — Main split-panel layout orchestrator
  InterviewEditor.tsx             — Monaco editor + Pyodide runner + output
  InterviewVoicePanel.tsx         — Agent status, waveform, transcript, timer
  InterviewScorecard.tsx          — Results with category scores

src/contexts/InterviewContext.tsx  — InterviewProvider + useInterview hook

src/types/interview.ts            — All interview type definitions

src/app/api/interviews/
  plan/route.ts                   — Kimi question plan generation
  score/route.ts                  — Kimi post-interview scoring
```

## UI Theme

Dark glassmorphism matching existing app. Top bar with gradient accents. Monaco editor with dark theme. Voice panel with subtle waveform animation. Scorecard uses color-coded score bars (red < 4, amber 4-6, green > 6).

## Dependencies

- `@monaco-editor/react` — already in project
- `pyodide` — new, for in-browser Python execution (~11MB WASM download, cached after first load)
- `@elevenlabs/react` — already in project
- Kimi/Moonshot API — already configured

## Out of Scope (MVP)

- Interview session persistence / history
- Multiple language support (Python only for now)
- Video recording / playback
- Sharing interviews with others
- Custom timer durations (fixed at 30 min)

# Feature 6.1 — Voice Intake Flow

## Summary
A 5-minute conversational intake where Coach Kairos asks 6 questions via voice or text, with no sign-up required. Creates a "seed profile" that links to a real account on signup.

## Architecture: Anonymous Session Token

### Flow
1. Student clicks "Start your free plan" on landing page → navigates to `/intake`
2. `POST /api/cc/intake/start` creates a `cc_intake_sessions` row with a UUID `session_token`, returns it to the client
3. Client stores `session_token` in localStorage + React state
4. For each question, `POST /api/cc/intake/turn` sends `{ session_token, answer, question_index }`
5. Server validates token, stores answer in `cc_intake_sessions.responses` (JSONB), returns `{ next_question, progress, is_complete }`
6. After Q6, `POST /api/cc/intake/complete` finalizes: sets `completed_at`, generates a seed `cc_student_profiles` row (no `user_id` yet), returns summary
7. Student sees summary → "Want to keep your work? Create an account" → on signup, link `cc_student_profiles.user_id` and `cc_intake_sessions.user_id` to new auth user

### 6 Intake Questions
| # | Question | Field | Type |
|---|----------|-------|------|
| 1 | "What's your name, and what year are you in high school?" | preferred_name, grade_level | text + select |
| 2 | "Where do you live?" | state_province, country | text |
| 3 | "What language does your family speak at home?" | home_language | select |
| 4 | "Will you be the first in your family to attend a US or Canadian college?" | is_first_gen | yes/no/not-sure |
| 5 | "What are you most worried about in the college process?" | worries | free-form or pick from list |
| 6 | "What schools have you heard of or are curious about?" | interested_schools | free-form |

### Voice Integration
- Reuse existing `useVoiceAgent` hook (Deepgram for en/es/fr/de/nl/it/ja, Sarvam for hi/pa)
- New `useIntakeVoiceAgent` wrapper:
  - Feeds LLM a structured system prompt with the current question
  - LLM speaks the question aloud, listens for answer
  - Extracts structured answer from transcript
  - Falls back to text input if voice unavailable or user prefers typing
- Language selector shown immediately on intake page (switches TTS/STT provider)

### Data Model
Uses existing `cc_intake_sessions` table:
```sql
-- Already created in Phase 0.1 migration
cc_intake_sessions (
  id UUID PK,
  user_id UUID NULL,           -- NULL until signup
  session_token TEXT UNIQUE,
  responses JSONB,             -- { q1: { answer, raw_transcript }, q2: ... }
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
```

On completion, seed a `cc_student_profiles` row:
- `user_id` = NULL (linked on signup)
- `preferred_name` from Q1
- `grade_level` from Q1
- `state_province`, `country` from Q2
- `home_language` from Q3
- `is_first_gen` from Q4
- `intake_completed_at` = now()
- `profile_completion_pct` = 15 (intake only)

### API Routes (wire existing stubs)

**POST /api/cc/intake/start**
- No auth required
- Creates `cc_intake_sessions` row with `session_token = randomUUID()`
- Returns `{ session_token, first_question: { index: 0, text, voice_prompt } }`

**POST /api/cc/intake/turn**
- No auth required
- Body: `{ session_token, question_index, answer, raw_transcript? }`
- Validates token exists and isn't expired (24h TTL)
- Stores answer in `responses` JSONB
- Returns `{ next_question: { index, text, voice_prompt } | null, progress: N/6, is_complete }`

**POST /api/cc/intake/complete**
- No auth required
- Body: `{ session_token }`
- Validates all 6 questions answered
- Creates seed `cc_student_profiles` row
- Sets `completed_at` on session
- Returns `{ summary: { name, grade, state, language, first_gen, worries, schools }, profile_id }`

### Components

**`src/app/intake/page.tsx`** — intake page
- Full-screen, distraction-free layout (no TopNav course links)
- Language selector at top
- Progress bar (1/6 → 6/6)
- Current question displayed large
- Voice button (mic) + text input field
- "Skip" option for non-required questions (Q5, Q6)
- Summary card at end with CTA to signup

**`src/hooks/useIntakeVoiceAgent.ts`** — intake-specific voice wrapper
- Manages question flow state
- Calls `useVoiceAgent` for STT/TTS
- Sends structured prompts to LLM per question
- Extracts answers from transcript

**`src/app/intake/layout.tsx`** — minimal layout without TopNav

### Session Linking on Signup
After signup, call `POST /api/cc/intake/link` with `{ session_token }`:
- Reads `cc_intake_sessions` by token
- Updates `user_id` on both `cc_intake_sessions` and the seed `cc_student_profiles`
- Deletes localStorage token

### TTL Cleanup
- Orphaned sessions (no `user_id`, older than 7 days) cleaned by a Supabase pg_cron job or periodic API call
- Not critical for MVP — can be manual initially

### Error Handling
- If voice fails, show text input immediately (graceful degradation)
- If session token is invalid/expired, start fresh with new token
- If browser is closed mid-intake, localStorage token allows resume on return

## Acceptance Criteria
- [ ] Student can complete 6-question intake without signing up
- [ ] Voice works for at least English and Spanish
- [ ] Text fallback works for all languages
- [ ] Progress bar shows 1/6 through 6/6
- [ ] Summary screen shows all collected info
- [ ] "Create account" CTA links session to new user
- [ ] Returning to /intake with existing token resumes where left off
- [ ] Session expires after 24 hours if not completed

## Testing Guide
1. Navigate to /intake as anonymous user
2. Complete all 6 questions via text → verify summary
3. Complete via voice (English) → verify transcript capture
4. Close browser mid-intake, reopen → verify resume from localStorage token
5. Complete intake → sign up → verify profile is linked
6. Try expired token → verify fresh start
7. Switch language to Spanish → verify TTS speaks Spanish

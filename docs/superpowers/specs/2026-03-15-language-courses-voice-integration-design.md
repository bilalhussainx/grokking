# Language Courses & Voice Integration Design Spec

**Date:** 2026-03-15
**Status:** Draft
**Scope:** 15 language courses (5 languages x 3 levels), voice-based placement, course-voice integration, conversation memory, greeting fix

---

## 1. Overview

The language learning system currently has 11 languages in the voice tab but only 3 sparse courses (Spanish A1, French A1, Urdu A1). This spec covers:

1. **15 language courses** — Beginner/Intermediate/Advanced for Spanish, French, Hindi, Chinese, and English (ESL)
2. **Voice-based fluency screening** — Replace text-based placement with voice-driven assessment
3. **Course-voice integration** — Link lesson progress to voice chat topics (both explicit practice and progress-driven)
4. **Conversation memory** — Remember where conversations left off, natural topic progression
5. **Greeting fix** — Prevent agent from replying to its own greeting

---

## 2. Course Content Architecture

### 2.1 Course Registry (15 courses)

| Language | Beginner (A1-A2) | Intermediate (B1-B2) | Advanced (C1-C2) |
|----------|-------------------|----------------------|-------------------|
| Spanish | `spanish-beginner` | `spanish-intermediate` | `spanish-advanced` |
| French | `french-beginner` | `french-intermediate` | `french-advanced` |
| Hindi | `hindi-beginner` | `hindi-intermediate` | `hindi-advanced` |
| Chinese | `chinese-beginner` | `chinese-intermediate` | `chinese-advanced` |
| English (ESL) | `english-beginner` | `english-intermediate` | `english-advanced` |

### 2.2 Type Extensions

Add to `LanguageCourse` (both optional — Urdu A1 has no chain links):
```ts
prerequisiteCourseSlug?: string  // e.g., "spanish-beginner" for spanish-intermediate
nextCourseSlug?: string          // e.g., "spanish-advanced" for spanish-intermediate
```

Add to `LanguageLesson`:
```ts
topicId: string  // Unique topic identifier for voice agent reference
```

**`topicId` naming convention:** `{langCode}-{level}-{lessonSlug}` — e.g., `es-beginner-ordering-food`, `zh-intermediate-travel-planning`, `en-advanced-media-literacy`. Must be unique across all courses. The `langCode` is the BCP-47 code, `level` is `beginner`/`intermediate`/`advanced`, and `lessonSlug` matches the lesson's `slug` field.

Add `ConversationCheckpoint` type (see Section 5.1). This type is stored as JSONB in Supabase and coexists with the existing `lastSessionSummary` field — `lastSessionSummary` continues to provide a text summary for the `LAST SESSION` section of the system prompt, while `ConversationCheckpoint` provides structured topic/progress data for the `CONVERSATION RESUME` section. Both are injected into the system prompt by `buildAgentContext()`.

Add `mode` to `VoiceAgentConfig`:
```ts
mode?: 'free-form' | 'lesson-practice' | 'placement'  // Defaults to 'free-form'
```

`LessonPracticeConfig` (Section 4.1) is a UI-side interface that gets converted to a `LessonContext` before passing to the agent:
```ts
// Conversion: LessonPracticeConfig → LessonContext
{
  lessonId: config.lessonSlug,
  lessonTitle: lesson.title,
  targetPhrases: config.voiceScenarios.flatMap(s => s.targetPhrases),
  vocabulary: config.targetVocab.map(v => v.word),
  grammarFocus: config.targetGrammar.map(g => g.title),
}
```

### 2.3 Course Content Sources

All course content is modeled after established curricula — not generated from scratch:

**Spanish** — Based on Instituto Cervantes Plan Curricular, Duolingo (286 units), DELE exam framework, FSI Spanish Basic Course
- Beginner: 8 modules (Greetings, Personal Info, Family, Daily Routines, Food & Dining, Shopping, Getting Around, Past Experiences)
- Intermediate: 8 modules (Narrating Past, Opinions & Arguments, Workplace, Technology, Environment, Culture, News, Conditional & Hypothetical)
- Advanced: 8 modules (Advanced Subjunctive, Idiomatic Spanish, Academic Writing, Literature, Dialectology, Business, Creative Writing, Native Fluency)

**French** — Based on DELF/DALF exam curriculum, Alliance Francaise course structure, Duolingo (272 units), Assimil
- Beginner: 6 modules (First Steps, Daily Life, Getting Around, Expanding Your World, Past & Future, Connecting with Others)
- Intermediate: 6 modules (Expressing Yourself, Work & Education, Media & Current Events, Society & Relationships, Argumentation, Complex Situations)
- Advanced: 5 modules (Mastering Nuance, Academic & Professional French, Culture & Literature, Contemporary France & Francophonie, Near-Native Mastery)

**Hindi** — Based on FSI Hindi, Duolingo Hindi (32 units), HindiPod101, Teach Yourself Hindi, Pimsleur
- Beginner: 12 modules (Devanagari Script, Greetings, Pronouns & Honorifics, Nouns & Gender, Adjectives, Numbers & Time, Family, Postpositions, Present Tense, Food & Shopping, Past Tense, Future Tense)
- Intermediate: 12 modules (Compound Verbs, Perfect Tenses, Subjunctive, Relative-Correlative, Passive & Causative, Health, Work, Participles, Emotions & Opinions, Media, Travel in India, Festivals)
- Advanced: 8 modules (Idioms & Proverbs, Formal & Literary Hindi, Literature & Poetry, Advanced Debate, Regional Dialects, Business Hindi, Advanced Grammar, Creative Expression)

**Chinese (Mandarin)** — Based on HSK levels 1-6, Duolingo (67 units), Integrated Chinese, New Practical Chinese Reader, Confucius Institute
- Beginner: 8 modules (Pinyin & Tones, Greetings, Family, Dates & Time, Hobbies, Food & Dining, Shopping, Transportation)
- Intermediate: 8 modules (School & Education, Weather, Health, Housing, Travel, Work & Career, Festivals, Relationships)
- Advanced: 8 modules (News & Current Events, History & Philosophy, Business & Economics, Science & Environment, Literature & Arts, Society, Chengyu & Idioms, Academic Mastery)

**English (ESL)** — Based on Cambridge English (KET/PET/FCE/CAE/CPE), British Council, IELTS/TOEFL, English File, Headway
- Beginner: 10 modules (First Steps, About Me, Daily Life, Home, Food & Drink, Shopping, Getting Around, Past Experiences, Plans & Future, Health)
- Intermediate: 10 modules (Life Stories, Work & Career, Travel, Media & Technology, Education, Health & Wellbeing, Environment, Culture & Society, Money & Business, Communication)
- Advanced: 10 modules (Language & Identity, Academic English, Advanced Grammar, Business Communication, Media Literacy, Law & Ethics, Science & Technology, Literature, Exam Prep, Real-World Fluency)

English courses include a **pronunciation challenge table** by native language (Spanish, French, Hindi, Chinese, Arabic speakers each have different problem sounds). The voice agent adapts correction focus based on user's native language from their profile.

### 2.4 Existing Course Handling

- `spanish-a1.ts` → absorbed into `spanish-beginner.ts` (content merged, expanded)
- `french-a1.ts` → absorbed into `french-beginner.ts`
- `urdu-a1.ts` → kept as-is (Urdu is not in scope for this spec)

### 2.5 Each Lesson Contains

Following the existing `LanguageLesson` type:
- `vocabulary: VocabEntry[]` — 4-8 entries with word, translation, IPA pronunciation, example sentence
- `grammarPoints: GrammarPoint[]` — 1-3 points with explanation, examples, common mistakes
- `voiceScenarios: VoiceScenario[]` — 1-2 scenarios with agent role, user goal, target phrases
- `culturalNotes?: CulturalNote[]` — 0-1 notes per lesson
- `assessmentQuestions?: AssessmentQuestion[]` — for end-of-module assessment lessons
- `topicId: string` — unique identifier for voice agent topic tracking

---

## 3. Voice-Based Fluency Screening

### 3.1 Flow

1. User selects a language (from talk page or courses page)
2. System checks if user has a placement result for this language
3. If no result → redirect to voice-based placement
4. Placement screen shows visual text/prompts but all user interaction is voice
5. System speaks questions aloud via TTS, user responds by speaking
6. After assessment → user is placed into the right course AND module

### 3.2 Assessment Structure (per language)

**Round 1 — Basics (A1 gate):**
- System speaks a greeting, asks user to respond
- Visual text shows the target language words being spoken
- Tests: basic comprehension, pronunciation of greetings
- Example (Spanish): System says "Hola, me llamo Elena. ?Como te llamas?" — screen shows the text

**Round 2 — Vocabulary (A1-A2 gate):**
- System shows a word/image on screen, asks "How would you say X in [language]?"
- Tests: vocabulary recall, pronunciation accuracy
- 3-4 vocabulary prompts at increasing difficulty

**Round 3 — Sentence Construction (A2-B1 gate):**
- System gives a scenario prompt visually, asks user to form sentences
- Tests: grammar accuracy, sentence complexity
- Example: "Tell me what you did yesterday" (screen shows prompt in English)

**Round 4 — Conversation (B1+ gate):**
- Short free-form exchange (2-3 turns)
- Tests: fluency, complexity, natural flow, error recovery
- Example: Agent asks about hobbies, follows up on answers

### 3.3 Scoring & Placement

| Round Result | Placement |
|---|---|
| Struggles with Round 1 | A1 → Beginner course, Module 1 |
| Passes 1-2, struggles at 3 | A2 → Beginner course, skip early modules |
| Passes 1-3, struggles at 4 | B1 → Intermediate course |
| Passes all with minor errors | B2 → Intermediate course, later modules |
| Passes all fluently | C1+ → Advanced course |

Result stored in Supabase `user_language_profiles.proficiency_level` and `current_module_id`.

### 3.4 Technical Implementation

- Uses existing voice provider routing — Deepgram for Spanish/French/Chinese/English, Sarvam for Hindi
- API endpoint: `/api/language/voice-session` with `mode: 'placement'` flag
- The agent's system prompt switches to assessment mode: evaluate accuracy, don't teach
- Each round's evaluation is done via LLM analysis (Moonshot) of the user's speech transcript
- Visual UI shows: progress bar, current round, text prompts, mic button, spoken text transcript

### 3.5 Placement Fallback & Edge Cases

- **Microphone failure:** If mic access is denied or STT returns empty for all rounds, offer a text-based self-assessment questionnaire as fallback (using existing text-based placement questions)
- **LLM scoring failure:** If Moonshot fails to evaluate a round, mark it as inconclusive and skip to next round. Place user conservatively (lower level) if scoring data is incomplete
- **Manual override:** Add an "I already know my level" option on the placement intro screen. User can select A1/A2/B1/B2/C1 directly and skip the voice assessment
- **Retaking placement:** Users can retake placement from their settings/profile page at any time. New result overwrites the old one and may reassign them to a different course/module

### 3.6 Placement for English (ESL)

English placement additionally captures the user's **native language** to configure:
- Pronunciation correction focus areas (e.g., /θ/ for Hindi speakers, tones interference for Chinese speakers)
- Grammar error prediction (e.g., article omission for Hindi/Chinese speakers)
- Stored in `user_language_profiles.native_language`

---

## 4. Course ↔ Voice Chat Integration

### 4.1 Lesson-Linked Practice (Explicit)

Each lesson page gets a **"Practice with Voice"** button that launches the voice agent with lesson context:

```ts
interface LessonPracticeConfig {
  mode: 'lesson-practice';
  courseSlug: string;
  lessonSlug: string;
  topicId: string;
  targetVocab: VocabEntry[];
  targetGrammar: GrammarPoint[];
  voiceScenarios: VoiceScenario[];
  proficiencyLevel: ProficiencyLevel;
}
```

The voice agent's system prompt gets injected with:
- The lesson's target vocabulary (use these words naturally)
- Grammar focus (correct mistakes related to these grammar points)
- Voice scenarios (steer conversation toward these situations)
- Proficiency-appropriate language ratio from persona adaptive rules

Completing voice scenarios in a lesson contributes toward lesson completion progress.

### 4.2 Progress-Driven Free-Form Chat (Implicit)

When user opens the general voice chat (talk page), the agent checks course progress:

1. Query `user_language_profiles` → current course, module, lesson
2. Query `conversation_checkpoint` → last conversation state
3. Build context for system prompt:
   - "User is on Spanish Beginner, Module 3 (Food & Dining), Lesson 2 (At the Restaurant)"
   - "They've mastered: greetings, numbers, family vocabulary"
   - "Focus conversation on: restaurant ordering, food vocabulary"
   - "Reinforce: vocabulary from completed lessons"

### 4.3 Topic Queue & Natural Progression

The agent maintains a **topic queue** derived from the course syllabus:

```ts
interface TopicQueue {
  currentTopicId: string;           // From course position
  currentTopicName: string;
  competencySignals: number;        // Count of successful exchanges on this topic
  competencyThreshold: number;      // Default 5 for beginner, 8 for advanced
  nextTopicId: string;
  nextTopicName: string;
}
```

**Competency signals** counted when the user:
- Uses target vocabulary correctly without hesitation
- Applies target grammar correctly
- Constructs natural sentences
- Self-corrects (shows awareness)

When `competencySignals >= competencyThreshold`, the agent transitions naturally:
> "You're ordering like a pro now! So imagine you've finished your meal — how would you ask for the check?"

Each transition updates the checkpoint in real-time.

### 4.4 Course Page Indicators

The course/lesson page shows:
- "You've been practicing this topic in voice chat" badge on lessons where voice practice matches the topic
- Voice practice time counts as partial credit toward lesson completion (not full completion — user still needs to review written content)

---

## 5. Conversation Memory

### 5.1 Checkpoint Schema

New JSONB column on `user_language_profiles` table:

```sql
ALTER TABLE user_language_profiles
ADD COLUMN conversation_checkpoint JSONB DEFAULT NULL;
```

Schema (includes `schemaVersion` for forward compatibility):
```ts
interface ConversationCheckpoint {
  schemaVersion: 1;                       // For future migration
  lastTopicId: string;                    // e.g., "es-beginner-ordering-food"
  lastTopicName: string;                  // e.g., "Ordering Food at a Restaurant"
  topicProgress: 'started' | 'practicing' | 'comfortable';
  nextTopicId: string;
  nextTopicName: string;
  lastExchangeSummary: string;            // LLM-generated: "User was practicing ordering coffee, struggled with dairy vocab"
  vocabInProgress: string[];              // Words introduced but not yet mastered
  mistakePatterns: string[];              // Recurring issues from this topic
  totalExchangesOnTopic: number;
  lastSessionTimestamp: string;           // ISO timestamp
}
```

### 5.2 Session Resume Flow

1. User opens voice chat for a language
2. System queries `conversation_checkpoint` for this user + language
3. If checkpoint exists, inject into agent's system prompt:
   ```
   ## CONVERSATION RESUME
   Last session: 2026-03-14
   Topic: Ordering coffee at a restaurant
   Progress: practicing (3/5 competency signals)
   Summary: User was getting the hang of asking for different milk options but struggled with "con leche" vs "sin azucar"
   Vocab in progress: con leche, sin azucar, cortado, americano
   Next topic: Asking for the check

   Resume from this point. Greet the user warmly, remind them where they left off, and continue practicing.
   ```
4. Agent speaks greeting with checkpoint context:
   > "Hola! Welcome back! Last time we were practicing ordering coffee — you were getting the hang of asking for different milk options. Want to pick up from there?"
5. User responds → conversation continues from checkpoint

### 5.3 Checkpoint Write-Back

At the end of each voice session (on disconnect or explicit end):

1. The session transcript is sent to LLM for summarization
2. Summary includes: topic progress, new vocab introduced, mistakes observed
3. Checkpoint is updated via `PATCH /api/language/session` with the new state
4. If topic was completed (competency threshold met), checkpoint advances to next topic

### 5.4 Checkpoint Validation & Edge Cases

- **Corrupt checkpoint:** If JSONB fails to parse or is missing required fields, treat as "no checkpoint" (fresh start). Log the error for debugging.
- **Stale topicId:** If `lastTopicId` references a topic that no longer exists (course content was updated), fall back to the user's current course position from `current_course_slug` + `current_module_id`.
- **Course completion:** When the Advanced course is completed (no `nextCourseSlug`), checkpoint enters a "mastery" state — free-form practice with no topic progression pressure. The agent congratulates and offers to review any topics.
- **Re-taking courses:** Users can restart any completed course. This creates a fresh checkpoint for that course without deleting previous mastery data.

### 5.5 First Session (No Checkpoint)

If no checkpoint exists:
1. Check placement result → determine starting course/module/lesson
2. Set initial checkpoint with the first lesson's topic
3. Agent greets fresh: "Hola! I'm Carlos. Ready to start learning Spanish? Let's begin with some greetings!"

---

## 6. Greeting Behavior Fix

### 6.1 Problem

The voice agent generates a greeting, speaks it via TTS, then sometimes processes its own greeting audio as user input and responds to it — creating a self-reply loop.

### 6.2 Solution

The initial greeting is handled as a **one-shot system event**, not a conversation turn:

1. On WebSocket connection, agent generates greeting text (using persona greeting function + checkpoint data)
2. Greeting is sent to TTS and played to user
3. Greeting is added to message history as `role: 'assistant'` but NOT fed back into the agent's input processing
4. Microphone listening begins ONLY after greeting audio playback completes
5. First user speech is treated as the first real conversation turn

### 6.3 Implementation

**For `useDeepgramAgent.ts`:**
- Add `isGreetingPhase` ref, initialized to `true`
- After `SettingsApplied` WebSocket event, set `isGreetingPhase = true` and `micMutedRef.current = true` (uses existing mute mechanism — no new suppression path needed)
- After first `AgentAudioDone` event (greeting playback complete), set `isGreetingPhase = false` and `micMutedRef.current = false`
- The Deepgram Agent generates the greeting server-side via the `systemPrompt` — no client-side greeting generation needed

**For `useOrchestratedVoiceAgent.ts`:**
- Same pattern: generate greeting via API call to `/api/language/persona-config`, play the TTS audio, THEN start MediaRecorder
- The greeting text comes from the persona greeting function + checkpoint data

**For `useVoiceAgent.ts`:**
- Expose `isGreetingPhase` in the hook return for UI feedback ("Agent is greeting you...")

---

## 7. File Changes

### 7.1 New Files (15 course data files)

```
src/data/languages/spanish-beginner.ts
src/data/languages/spanish-intermediate.ts
src/data/languages/spanish-advanced.ts
src/data/languages/french-beginner.ts
src/data/languages/french-intermediate.ts
src/data/languages/french-advanced.ts
src/data/languages/hindi-beginner.ts
src/data/languages/hindi-intermediate.ts
src/data/languages/hindi-advanced.ts
src/data/languages/chinese-beginner.ts
src/data/languages/chinese-intermediate.ts
src/data/languages/chinese-advanced.ts
src/data/languages/english-beginner.ts
src/data/languages/english-intermediate.ts
src/data/languages/english-advanced.ts
```

### 7.2 Modified Files

| File | Changes |
|------|---------|
| `src/data/language-types.ts` | Add `topicId` to `LanguageLesson`, add `prerequisiteCourseSlug`/`nextCourseSlug` to `LanguageCourse`, add `ConversationCheckpoint` type |
| `src/data/languages/index.ts` | Register all 15 courses, update `getSupportedLanguages()`, absorb old A1 courses |
| `src/lib/language-agent.ts` | Add `getConversationCheckpoint()`, `updateConversationCheckpoint()`, `buildResumeContext()`, topic progression logic, competency detection. Update `getDefaultStyle()` to include `hi`, `zh`, `en` mappings |
| `src/lib/language-personas.ts` | Update greeting functions to accept checkpoint data, add English personas |
| `src/lib/voice-provider-router.ts` | Add Chinese TTS resolution (verify Aura-2 zh support or route to MiniMax). Export `isSarvamLanguage()` helper to centralize routing logic (currently duplicated in 3 files) |
| `src/hooks/useDeepgramAgent.ts` | Add `isGreetingPhase` ref, suppress audio input during greeting, unmute after greeting playback |
| `src/hooks/useOrchestratedVoiceAgent.ts` | Same greeting phase logic |
| `src/hooks/useVoiceAgent.ts` | Expose `isGreetingPhase`, pass lesson context and mode (practice/free-form/placement) |
| `src/app/talk/page.tsx` | Show course progress link, pass checkpoint context to agent, add "en" to supported languages with ESL flag |
| `src/app/placement/[lang]/page.tsx` | Rebuild as voice-driven assessment with 4 rounds, visual prompts, voice input |
| `src/app/api/language/voice-session/route.ts` | Handle `mode: 'placement'`, inject checkpoint/resume context, handle lesson-practice mode |
| `src/app/api/language/sarvam/route.ts` | Same mode/checkpoint support for Hindi pipeline |
| `src/components/language/LanguageLessonPage.tsx` | Add "Practice with Voice" button, show voice practice indicators |
| `src/components/language/LanguageTutorPanel.tsx` | Accept lesson context props for targeted practice |

### 7.3 Supabase Migration

```sql
-- Add conversation checkpoint to user language profiles
ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS conversation_checkpoint JSONB DEFAULT NULL;

-- Add current course tracking
ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS current_course_slug TEXT DEFAULT NULL;

-- Add native language for ESL pronunciation adaptation
ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS native_language TEXT DEFAULT 'en';
```

---

## 8. Voice Provider Routing (Updated)

| Language | STT | TTS | LLM | Pipeline |
|----------|-----|-----|-----|----------|
| Spanish (es) | Deepgram Nova-3 | Deepgram Aura-2 | Moonshot Kimi K2 | WebSocket |
| French (fr) | Deepgram Nova-3 | Deepgram Aura-2 | Moonshot Kimi K2 | WebSocket |
| Chinese (zh) | Deepgram Nova-3 | Deepgram Aura-2 (aura-2-izanami-ja fallback) | Moonshot Kimi K2 | WebSocket |
| English (en) | Deepgram Nova-3 | Deepgram Aura-2 | Moonshot Kimi K2 | WebSocket |
| Hindi (hi) | Deepgram Nova-3 | Sarvam Bulbul v3 | Moonshot Kimi K2 | HTTP Streaming (NDJSON) |

**Chinese TTS note:** Deepgram Aura-2 does not currently list `zh` in `DEEPGRAM_TTS_LANGUAGES` in `voice-provider-router.ts`. The existing code already has Japanese voices (aura-2-izanami-ja, aura-2-fujin-ja) which work as a partial fallback. Implementation must either: (a) verify Deepgram Aura-2 supports Mandarin voices and add `zh` to the supported list with proper voice IDs, or (b) route Chinese to the orchestrated pipeline (HTTP streaming) with MiniMax TTS as the provider (already supported in the `TTSProvider` type). Decision deferred to implementation — check Deepgram Aura-2 voice catalog at implementation time.

**Hindi pipeline clarification:** The Hindi pipeline uses HTTP streaming with NDJSON responses, not HTTP polling. The client sends audio chunks and receives streamed responses.

---

## 9. Course Linking & Progression

### 9.1 Seamless Level Transitions

Each course links to the next via `prerequisiteCourseSlug` and `nextCourseSlug`:

```
spanish-beginner → spanish-intermediate → spanish-advanced
french-beginner  → french-intermediate  → french-advanced
hindi-beginner   → hindi-intermediate   → hindi-advanced
chinese-beginner → chinese-intermediate → chinese-advanced
english-beginner → english-intermediate → english-advanced
```

When a user completes the final module of a course:
1. Show completion celebration
2. Offer "Continue to [Next Level]" button
3. Automatically update `current_course_slug` in their profile
4. Conversation checkpoint advances to first topic of next course

### 9.2 Course Page UI

The course listing page groups courses by language with a visual progression:
```
Spanish: [Beginner ✓] → [Intermediate (in progress)] → [Advanced 🔒]
```

Locked courses show "Complete [Previous Level] to unlock" unless placement test placed them higher.

---

## 10. English ESL: Native Language Adaptation

The English courses uniquely adapt to the learner's native language:

### 10.1 Pronunciation Focus Areas

| Native Language | Priority Sounds | Common Errors |
|---|---|---|
| Spanish | /b/ vs /v/, /ʃ/ ("sh"), schwa | "Espain" for "Spain", vowel reduction |
| French | /h/ (often dropped), /θ/ /ð/ | "I 'ave" for "I have", syllable-timed rhythm |
| Hindi | /w/ vs /v/, aspirated stops | "Wery" for "Very", vowel confusion |
| Chinese | /l/ vs /r/, consonant clusters, final consonants | "Fried" → "Fry", dropped finals |
| Arabic | /p/ vs /b/, /v/ | "Bark" for "Park", missing /v/ |

### 10.2 Grammar Error Prediction

| Native Language | Common Grammar Errors |
|---|---|
| Spanish | Article gender transfer, adjective placement |
| French | False friends, article overuse |
| Hindi | Article omission, word order (SOV transfer) |
| Chinese | Article omission, tense omission, no plurals |
| Arabic | Verb agreement, pronoun redundancy |

The voice agent's system prompt includes the relevant pronunciation and grammar focus for the user's native language.

---

## 11. Success Criteria

- [ ] All 15 courses registered and navigable from the courses page
- [ ] Each course has 5-12 modules with 4-6 lessons each
- [ ] Voice-based placement correctly routes users to appropriate course/module
- [ ] "Practice with Voice" button on lesson pages launches contextual voice session
- [ ] Free-form voice chat references user's current course position
- [ ] Agent remembers where conversation left off between sessions
- [ ] Agent greets with checkpoint context on session resume
- [ ] Agent naturally transitions between topics when user demonstrates competency
- [ ] Agent does not reply to its own greeting
- [ ] English courses adapt pronunciation/grammar focus to user's native language
- [ ] Seamless progression between beginner → intermediate → advanced

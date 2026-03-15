# Language Courses & Voice Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 15 language courses (5 languages x 3 levels), voice-based placement, course-voice integration with conversation memory, and fix the greeting self-reply bug.

**Architecture:** Foundation types and DB migration first, then course content generation (parallelizable by language) and voice infrastructure changes (greeting fix, checkpoint system) in parallel, then UI integration to wire everything together.

**Tech Stack:** Next.js 14, TypeScript, Supabase (PostgreSQL + JSONB), Deepgram (STT/TTS), Sarvam (Hindi TTS), Moonshot Kimi K2 (LLM), framer-motion (UI animations)

**Spec:** `docs/superpowers/specs/2026-03-15-language-courses-voice-integration-design.md`

**Curriculum Research:** Background agents have completed research for all 5 languages. Outputs are in the temp task directory — reference the spec Section 2.3 for module outlines per language.

---

## Chunk 1: Foundation — Types, Migration, Provider Routing

### Task 1: Extend language types

**Files:**
- Modify: `src/data/language-types.ts`

- [ ] **Step 1: Add `topicId` to `LanguageLesson` interface**

In `src/data/language-types.ts`, add `topicId` field to `LanguageLesson` after the `order` field:

```ts
topicId: string;                 // Unique: {langCode}-{level}-{lessonSlug}
```

- [ ] **Step 2: Add course linking fields to `LanguageCourse`**

Add after `icon?` in the `LanguageCourse` interface:

```ts
prerequisiteCourseSlug?: string;  // e.g., "spanish-beginner" for intermediate
nextCourseSlug?: string;          // e.g., "spanish-advanced" for intermediate
```

- [ ] **Step 3: Add `ConversationCheckpoint` interface**

Add after the `UserLanguageProgress` interface:

```ts
export interface ConversationCheckpoint {
  schemaVersion: 1;
  lastTopicId: string;
  lastTopicName: string;
  topicProgress: 'started' | 'practicing' | 'comfortable';
  nextTopicId: string;
  nextTopicName: string;
  lastExchangeSummary: string;
  vocabInProgress: string[];
  mistakePatterns: string[];
  totalExchangesOnTopic: number;
  lastSessionTimestamp: string;
}
```

- [ ] **Step 4: Add `LessonPracticeConfig` interface**

Add after `VoiceSessionConfig`:

```ts
export interface LessonPracticeConfig {
  mode: 'lesson-practice';
  courseSlug: string;
  lessonSlug: string;
  topicId: string;
  targetVocab: VocabEntry[];
  targetGrammar: GrammarPoint[];
  voiceScenarios: VoiceScenario[];
  proficiencyLevel: ProficiencyLevel;
}

export function lessonPracticeToContext(config: LessonPracticeConfig, lessonTitle: string): LessonContext {
  return {
    lessonId: config.lessonSlug,
    lessonTitle,
    targetPhrases: config.voiceScenarios.flatMap(s => s.targetPhrases),
    vocabulary: config.targetVocab.map(v => v.word),
    grammarFocus: config.targetGrammar.map(g => g.title),
  };
}
```

- [ ] **Step 5: Add `mode` to `VoiceSessionConfig`**

Add to the `VoiceSessionConfig` interface:

```ts
mode?: 'free-form' | 'lesson-practice' | 'placement';
```

- [ ] **Step 5b: Add `mode` to `VoiceAgentConfig` in `language-personas.ts`**

The client-side `VoiceAgentConfig` interface lives in `src/lib/language-personas.ts`. Add the same `mode` field there:

```ts
mode?: 'free-form' | 'lesson-practice' | 'placement';
```

This is the interface consumed by the voice hooks.

- [ ] **Step 6: Commit**

```bash
git add src/data/language-types.ts
git commit -m "feat(types): add topicId, course linking, checkpoint, and practice config types"
```

---

### Task 2: Supabase migration

**Files:**
- Create: `supabase/migrations/20260315_add_checkpoint_columns.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Add conversation checkpoint for voice session memory
ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS conversation_checkpoint JSONB DEFAULT NULL;

-- Add current course tracking
ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS current_course_slug TEXT DEFAULT NULL;

-- Add native language for ESL pronunciation adaptation
ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS native_language TEXT DEFAULT 'en';
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260315_add_checkpoint_columns.sql
git commit -m "feat(db): add checkpoint, course slug, and native language columns"
```

---

### Task 3: Centralize voice provider routing

**Files:**
- Modify: `src/lib/voice-provider-router.ts`
- Modify: `src/hooks/useVoiceAgent.ts`

- [ ] **Step 1: Export `isSarvamLanguage()` from voice-provider-router.ts**

Read `src/lib/voice-provider-router.ts` and add an exported helper near the top, after the language constant arrays:

```ts
const SARVAM_TTS_LANGUAGES = ['hi', 'pa'];

export function isSarvamLanguage(lang: string): boolean {
  return SARVAM_TTS_LANGUAGES.includes(lang);
}
```

- [ ] **Step 2: Check if Deepgram Aura-2 supports Chinese**

Read the `DEEPGRAM_TTS_LANGUAGES` array and the `DEFAULT_DEEPGRAM_VOICES` map. If `zh` is not present, add it with the existing Japanese voices as temporary fallback, with a TODO comment:

```ts
// TODO: Verify Deepgram Aura-2 Chinese voice availability. Using Japanese voices as fallback.
zh: { female: 'aura-2-izanami-ja', male: 'aura-2-fujin-ja' },
```

Add `'zh'` to the `DEEPGRAM_TTS_LANGUAGES` array.

- [ ] **Step 3: Update useVoiceAgent.ts to import centralized helper**

In `src/hooks/useVoiceAgent.ts`, replace the local `SARVAM_LANGUAGES` constant and `isSarvamLanguage` callback with an import:

```ts
import { isSarvamLanguage } from '@/lib/voice-provider-router';
```

Remove the local `SARVAM_LANGUAGES` const and the `isSarvamLanguage` useCallback.

- [ ] **Step 3b: Update useOrchestratedVoiceAgent.ts**

In `src/hooks/useOrchestratedVoiceAgent.ts`, also remove the local `SARVAM_LANGUAGES` duplicate and import from `@/lib/voice-provider-router` if needed.

- [ ] **Step 4: Commit**

```bash
git add src/lib/voice-provider-router.ts src/hooks/useVoiceAgent.ts
git commit -m "refactor: centralize Sarvam language routing, add Chinese TTS fallback"
```

---

### Task 4: Update language-agent.ts default styles

**Files:**
- Modify: `src/lib/language-agent.ts`

- [ ] **Step 1: Add Hindi, Chinese, and English to `getDefaultStyle()`**

Read `src/lib/language-agent.ts` and find the `getDefaultStyle()` function. Update the styles map:

```ts
const styles: Record<string, string> = {
  es: 'carlos',
  fr: 'camille',
  ur: 'ayesha',
  hi: 'raj',
  zh: 'xiaoming',
  en: 'sarah',
};
```

Verify the persona IDs exist in `src/lib/language-personas.ts`. If the names don't match existing personas, use the actual persona name suffixes from that file.

- [ ] **Step 2: Commit**

```bash
git add src/lib/language-agent.ts
git commit -m "feat(agent): add Hindi, Chinese, English default persona styles"
```

---

## Chunk 2: Course Content — Spanish (3 courses)

> **Parallelization note:** Chunks 2-6 (one per language) are fully independent and SHOULD be run in parallel via subagents. Each subagent creates 3 course files for one language.

### Task 5: Spanish Beginner course

**Files:**
- Create: `src/data/languages/spanish-beginner.ts`

- [ ] **Step 1: Create the course file**

Create `src/data/languages/spanish-beginner.ts` following the exact structure of the existing `spanish-a1.ts` (read it first as reference). The course should have:

- Course info: id `spanish-beginner`, slug `spanish-beginner`, language `es`, proficiencyLevel `A1`, nextCourseSlug `spanish-intermediate`
- 8 modules with 4-5 lessons each (see spec Section 2.3 for module list)
- Module topics: Greetings, Personal Info, Family, Daily Routines, Food & Dining, Shopping, Getting Around, Past Experiences
- Each lesson must have: `topicId` (format: `es-beginner-{slug}`), vocabulary (4-8 entries with IPA), grammarPoints, voiceScenarios, culturalNotes
- Absorb content from existing `spanish-a1.ts` into the first module (Greetings)
- Use the curriculum research (Instituto Cervantes, Duolingo, DELE) for module/lesson topics, grammar progressions, and cultural notes

Export: `spanishBeginnerCourse`, `getSpanishBeginnerLessons()`, `findSpanishBeginnerLesson()`

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/spanish-beginner.ts
git commit -m "feat(courses): add Spanish Beginner course (8 modules, A1-A2)"
```

### Task 6: Spanish Intermediate course

**Files:**
- Create: `src/data/languages/spanish-intermediate.ts`

- [ ] **Step 1: Create the course file**

Same structure as Task 5 but for B1-B2 level:
- id: `spanish-intermediate`, prerequisiteCourseSlug: `spanish-beginner`, nextCourseSlug: `spanish-advanced`
- 8 modules: Narrating Past, Opinions & Arguments, Workplace, Technology, Environment, Culture, News, Conditional & Hypothetical
- TopicIds: `es-intermediate-{slug}`
- Grammar: preterite vs imperfect, subjunctive intro, conditional, reported speech, por vs para
- Vocabulary themes: work, education, technology, social issues, formal communication

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/spanish-intermediate.ts
git commit -m "feat(courses): add Spanish Intermediate course (8 modules, B1-B2)"
```

### Task 7: Spanish Advanced course

**Files:**
- Create: `src/data/languages/spanish-advanced.ts`

- [ ] **Step 1: Create the course file**

Same structure for C1-C2 level:
- id: `spanish-advanced`, prerequisiteCourseSlug: `spanish-intermediate`
- 8 modules: Advanced Subjunctive, Idiomatic Spanish, Academic Writing, Literature, Dialectology, Business, Creative Writing, Native Fluency
- TopicIds: `es-advanced-{slug}`
- Grammar: pluperfect subjunctive, literary tenses, dialectal variation, nominalizations, stylistic grammar
- Vocabulary: idioms, academic, literary, legal, dialectal

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/spanish-advanced.ts
git commit -m "feat(courses): add Spanish Advanced course (8 modules, C1-C2)"
```

---

## Chunk 3: Course Content — French (3 courses)

### Task 8: French Beginner course

**Files:**
- Create: `src/data/languages/french-beginner.ts`

- [ ] **Step 1: Create the course file**

- id: `french-beginner`, language: `fr`, nextCourseSlug: `french-intermediate`
- 6 modules: First Steps, Daily Life, Getting Around, Expanding Your World, Past & Future, Connecting with Others
- Absorb content from existing `french-a1.ts` into First Steps module
- Grammar: articles, present tense, passe compose, imparfait, reflexive verbs, basic questions
- TopicIds: `fr-beginner-{slug}`
- Based on DELF A1-A2, Alliance Francaise, Duolingo

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/french-beginner.ts
git commit -m "feat(courses): add French Beginner course (6 modules, A1-A2)"
```

### Task 9: French Intermediate course

**Files:**
- Create: `src/data/languages/french-intermediate.ts`

- [ ] **Step 1: Create the course file**

- id: `french-intermediate`, prerequisiteCourseSlug: `french-beginner`, nextCourseSlug: `french-advanced`
- 6 modules: Expressing Yourself, Work & Education, Media & Current Events, Society & Relationships, Argumentation, Complex Situations
- Grammar: conditional, subjunctive intro, reported speech, relative pronouns, passive voice
- TopicIds: `fr-intermediate-{slug}`

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/french-intermediate.ts
git commit -m "feat(courses): add French Intermediate course (6 modules, B1-B2)"
```

### Task 10: French Advanced course

**Files:**
- Create: `src/data/languages/french-advanced.ts`

- [ ] **Step 1: Create the course file**

- id: `french-advanced`, prerequisiteCourseSlug: `french-intermediate`
- 5 modules: Mastering Nuance, Academic & Professional French, Culture & Literature, Contemporary France & Francophonie, Near-Native Mastery
- Grammar: literary tenses, advanced subjunctive, nominalisation, register switching
- TopicIds: `fr-advanced-{slug}`

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/french-advanced.ts
git commit -m "feat(courses): add French Advanced course (5 modules, C1-C2)"
```

---

## Chunk 4: Course Content — Hindi (3 courses)

### Task 11: Hindi Beginner course

**Files:**
- Create: `src/data/languages/hindi-beginner.ts`

- [ ] **Step 1: Create the course file**

- id: `hindi-beginner`, language: `hi`, nextCourseSlug: `hindi-intermediate`
- 12 modules: Devanagari Script, Greetings, Pronouns & Honorifics, Nouns & Gender, Adjectives, Numbers & Time, Family, Postpositions, Present Tense, Food & Shopping, Past Tense, Future Tense
- Key unique elements: Devanagari script lessons, three-tier honorific system (tu/tum/aap), postpositions instead of prepositions, SOV word order, ne-ergative construction in past tense
- TopicIds: `hi-beginner-{slug}`
- Based on FSI Hindi, HindiPod101, Pimsleur, Teach Yourself Hindi

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/hindi-beginner.ts
git commit -m "feat(courses): add Hindi Beginner course (12 modules, A1-A2)"
```

### Task 12: Hindi Intermediate course

**Files:**
- Create: `src/data/languages/hindi-intermediate.ts`

- [ ] **Step 1: Create the course file**

- id: `hindi-intermediate`, prerequisiteCourseSlug: `hindi-beginner`, nextCourseSlug: `hindi-advanced`
- 12 modules: Compound Verbs, Perfect Tenses, Subjunctive, Relative-Correlative, Passive & Causative, Health, Work, Participles, Emotions & Opinions, Media, Travel in India, Festivals
- Key: compound verbs (unique to Hindi), double causative system, relative-correlative constructions (jo...vo)
- TopicIds: `hi-intermediate-{slug}`

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/hindi-intermediate.ts
git commit -m "feat(courses): add Hindi Intermediate course (12 modules, B1-B2)"
```

### Task 13: Hindi Advanced course

**Files:**
- Create: `src/data/languages/hindi-advanced.ts`

- [ ] **Step 1: Create the course file**

- id: `hindi-advanced`, prerequisiteCourseSlug: `hindi-intermediate`
- 8 modules: Idioms & Proverbs, Formal & Literary Hindi, Literature & Poetry, Advanced Debate, Regional Dialects, Business Hindi, Advanced Grammar, Creative Expression
- Key: Tatsama vs Tadbhava vocabulary, Hindi-Urdu spectrum, echo words, emphatic particles
- TopicIds: `hi-advanced-{slug}`

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/hindi-advanced.ts
git commit -m "feat(courses): add Hindi Advanced course (8 modules, C1-C2)"
```

---

## Chunk 5: Course Content — Chinese (3 courses)

### Task 14: Chinese Beginner course

**Files:**
- Create: `src/data/languages/chinese-beginner.ts`

- [ ] **Step 1: Create the course file**

- id: `chinese-beginner`, language: `zh`, nextCourseSlug: `chinese-intermediate`
- 8 modules: Pinyin & Tones, Greetings, Family, Dates & Time, Hobbies, Food & Dining, Shopping, Transportation
- Key unique elements: Pinyin system, four tones + neutral tone, measure words (量词), 是/吗/呢 question patterns, basic character stroke order
- TopicIds: `zh-beginner-{slug}`
- Based on HSK 1-2, Integrated Chinese, New Practical Chinese Reader, Duolingo

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/chinese-beginner.ts
git commit -m "feat(courses): add Chinese Beginner course (8 modules, A1-A2/HSK1-2)"
```

### Task 15: Chinese Intermediate course

**Files:**
- Create: `src/data/languages/chinese-intermediate.ts`

- [ ] **Step 1: Create the course file**

- id: `chinese-intermediate`, prerequisiteCourseSlug: `chinese-beginner`, nextCourseSlug: `chinese-advanced`
- 8 modules: School & Education, Weather, Health, Housing, Travel, Work & Career, Festivals, Relationships
- Key: 把 construction, 被 passive, result complements, directional complements, 过 experiential aspect
- TopicIds: `zh-intermediate-{slug}`
- Based on HSK 3-4

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/chinese-intermediate.ts
git commit -m "feat(courses): add Chinese Intermediate course (8 modules, B1-B2/HSK3-4)"
```

### Task 16: Chinese Advanced course

**Files:**
- Create: `src/data/languages/chinese-advanced.ts`

- [ ] **Step 1: Create the course file**

- id: `chinese-advanced`, prerequisiteCourseSlug: `chinese-intermediate`
- 8 modules: News & Current Events, History & Philosophy, Business & Economics, Science & Environment, Literature & Arts, Society, Chengyu & Idioms, Academic Mastery
- Key: 成语 (four-character idioms), 文言文 (classical Chinese) recognition, formal written patterns, advanced 把 patterns
- TopicIds: `zh-advanced-{slug}`
- Based on HSK 5-6

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/chinese-advanced.ts
git commit -m "feat(courses): add Chinese Advanced course (8 modules, C1-C2/HSK5-6)"
```

---

## Chunk 6: Course Content — English ESL (3 courses)

### Task 17: English Beginner course

**Files:**
- Create: `src/data/languages/english-beginner.ts`

- [ ] **Step 1: Create the course file**

- id: `english-beginner`, language: `en`, nextCourseSlug: `english-intermediate`
- 10 modules: First Steps, About Me, Daily Life, Home, Food & Drink, Shopping, Getting Around, Past Experiences, Plans & Future, Health
- Key unique element: pronunciation challenge data per native language (see spec Section 10.1)
- Grammar: present simple, past simple, articles, countable/uncountable, can/can't, there is/are
- TopicIds: `en-beginner-{slug}`
- Based on Cambridge KET, British Council, English File, Headway

Add an exported constant for pronunciation focus by native language:

```ts
export const PRONUNCIATION_FOCUS: Record<string, { prioritySounds: string[]; commonErrors: string[] }> = {
  es: { prioritySounds: ['/b/ vs /v/', '/ʃ/ (sh)', 'schwa'], commonErrors: ['"Espain" for "Spain"', 'vowel reduction'] },
  fr: { prioritySounds: ['/h/ (often dropped)', '/θ/ /ð/'], commonErrors: ['"I \'ave" for "I have"', 'syllable-timed rhythm'] },
  hi: { prioritySounds: ['/w/ vs /v/', 'aspirated stops'], commonErrors: ['"Wery" for "Very"', 'vowel confusion'] },
  zh: { prioritySounds: ['/l/ vs /r/', 'consonant clusters', 'final consonants'], commonErrors: ['"Fried" → "Fry"', 'dropped finals'] },
  ar: { prioritySounds: ['/p/ vs /b/', '/v/'], commonErrors: ['"Bark" for "Park"', 'missing /v/'] },
};

export const GRAMMAR_ERROR_PREDICTION: Record<string, string[]> = {
  es: ['Article gender transfer', 'Adjective placement after noun'],
  fr: ['False friends', 'Article overuse'],
  hi: ['Article omission', 'SOV word order transfer'],
  zh: ['Article omission', 'Tense omission', 'No plurals'],
  ar: ['Verb agreement errors', 'Pronoun redundancy'],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/english-beginner.ts
git commit -m "feat(courses): add English ESL Beginner course (10 modules, A1-A2)"
```

### Task 18: English Intermediate course

**Files:**
- Create: `src/data/languages/english-intermediate.ts`

- [ ] **Step 1: Create the course file**

- id: `english-intermediate`, prerequisiteCourseSlug: `english-beginner`, nextCourseSlug: `english-advanced`
- 10 modules: Life Stories, Work & Career, Travel, Media & Technology, Education, Health & Wellbeing, Environment, Culture & Society, Money & Business, Communication
- Grammar: present perfect, conditionals, passive voice, reported speech, relative clauses, phrasal verbs
- TopicIds: `en-intermediate-{slug}`
- Based on Cambridge PET/FCE, IELTS preparation

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/english-intermediate.ts
git commit -m "feat(courses): add English ESL Intermediate course (10 modules, B1-B2)"
```

### Task 19: English Advanced course

**Files:**
- Create: `src/data/languages/english-advanced.ts`

- [ ] **Step 1: Create the course file**

- id: `english-advanced`, prerequisiteCourseSlug: `english-intermediate`
- 10 modules: Language & Identity, Academic English, Advanced Grammar, Business Communication, Media Literacy, Law & Ethics, Science & Technology, Literature, Exam Prep, Real-World Fluency
- Grammar: mixed conditionals, inversion, subjunctive, advanced passives, cleft sentences, nominalisation
- TopicIds: `en-advanced-{slug}`
- Based on Cambridge CAE/CPE, IELTS 7+, TOEFL

- [ ] **Step 2: Commit**

```bash
git add src/data/languages/english-advanced.ts
git commit -m "feat(courses): add English ESL Advanced course (10 modules, C1-C2)"
```

---

## Chunk 7: Course Registry & Old Course Cleanup

### Task 20: Update course registry

**Files:**
- Modify: `src/data/languages/index.ts`

- [ ] **Step 1: Read existing index.ts and update imports**

Read `src/data/languages/index.ts`. Replace the entire file to register all 15 new courses plus keep `urduA1Course`:

```ts
// Language Courses Index

// Spanish
export { spanishBeginnerCourse } from './spanish-beginner';
export { spanishIntermediateCourse } from './spanish-intermediate';
export { spanishAdvancedCourse } from './spanish-advanced';
// French
export { frenchBeginnerCourse } from './french-beginner';
export { frenchIntermediateCourse } from './french-intermediate';
export { frenchAdvancedCourse } from './french-advanced';
// Hindi
export { hindiBeginnerCourse } from './hindi-beginner';
export { hindiIntermediateCourse } from './hindi-intermediate';
export { hindiAdvancedCourse } from './hindi-advanced';
// Chinese
export { chineseBeginnerCourse } from './chinese-beginner';
export { chineseIntermediateCourse } from './chinese-intermediate';
export { chineseAdvancedCourse } from './chinese-advanced';
// English (ESL)
export { englishBeginnerCourse } from './english-beginner';
export { englishIntermediateCourse } from './english-intermediate';
export { englishAdvancedCourse } from './english-advanced';
// Urdu (kept as-is)
export { urduA1Course, getUrduA1Lessons, findUrduA1Lesson } from './urdu-a1';

import type { LanguageCourse } from '@/data/language-types';
// ... import all course objects and build registry array
// Update getSupportedLanguages() to include all 5+1 languages with flags
// Add getCoursesForLanguage(lang) that returns beginner→intermediate→advanced ordered
```

The `languageCourses` array should contain all 16 courses (15 new + 1 Urdu).

The `getSupportedLanguages()` function should return flags for: es, fr, hi, zh, en, ur.

Add a new helper:

```ts
export function getCourseChain(language: string): LanguageCourse[] {
  return languageCourses
    .filter(c => c.language === language)
    .sort((a, b) => {
      const order = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4, C2: 5 };
      return (order[a.proficiencyLevel] || 0) - (order[b.proficiencyLevel] || 0);
    });
}
```

- [ ] **Step 2: Delete old A1 files that were absorbed**

Delete `src/data/languages/spanish-a1.ts` and `src/data/languages/french-a1.ts` since their content is absorbed into the beginner courses.

- [ ] **Step 3: Verify no other files import the old courses**

Search for imports of `spanishA1Course`, `frenchA1Course`, `getSpanishA1Lessons`, `getFrenchA1Lessons`, `findSpanishA1Lesson`, `findFrenchA1Lesson` across the codebase. Update any remaining references to point to the new beginner course exports.

- [ ] **Step 4: Commit**

```bash
git add src/data/languages/
git commit -m "feat(registry): register 15 language courses, remove old A1 files"
```

---

## Chunk 8: Voice Infrastructure — Greeting Fix

### Task 21: Fix greeting self-reply in Deepgram agent

**Files:**
- Modify: `src/hooks/useDeepgramAgent.ts`

- [ ] **Step 1: Read the current file**

Read `src/hooks/useDeepgramAgent.ts` fully to understand the WebSocket event handling, especially `SettingsApplied` and `AgentAudioDone` events.

- [ ] **Step 2: Add `isGreetingPhase` ref**

Add near the other refs (after `agentTextRef`):

```ts
const isGreetingPhaseRef = useRef(true);
```

- [ ] **Step 3: Mute mic during greeting phase**

Find the `SettingsApplied` WebSocket event handler. After it fires, ensure mic is muted:

```ts
// After SettingsApplied:
isGreetingPhaseRef.current = true;
micMutedRef.current = true;
```

- [ ] **Step 4: Unmute after first AgentAudioDone**

Find the `AgentAudioDone` event handler (or the point where agent audio playback completes). Add:

```ts
if (isGreetingPhaseRef.current) {
  isGreetingPhaseRef.current = false;
  micMutedRef.current = false;
}
```

- [ ] **Step 5: Expose isGreetingPhase in return**

Add to the hook's return object:

```ts
isGreetingPhase: isGreetingPhaseRef.current,
```

Note: since this is a ref, the UI won't re-render on change. If UI feedback is needed, convert to state. For now, ref is sufficient since we only need it for the mute logic.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useDeepgramAgent.ts
git commit -m "fix: prevent agent from replying to its own greeting via mic mute during greeting phase"
```

---

### Task 22: Fix greeting in orchestrated agent

**Files:**
- Modify: `src/hooks/useOrchestratedVoiceAgent.ts`

- [ ] **Step 1: Read the file**

Read `src/hooks/useOrchestratedVoiceAgent.ts` to understand the greeting flow.

- [ ] **Step 2: Add greeting phase logic**

The orchestrated agent controls when recording starts. Ensure:
1. On `start()`, first fetch greeting from `/api/language/persona-config`
2. Play the greeting TTS audio
3. Only start MediaRecorder AFTER greeting audio playback completes
4. Add `isGreetingPhase` ref matching the Deepgram agent pattern

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useOrchestratedVoiceAgent.ts
git commit -m "fix: delay mic recording until after greeting playback in orchestrated agent"
```

---

### Task 23: Expose greeting phase in useVoiceAgent

**Files:**
- Modify: `src/hooks/useVoiceAgent.ts`

- [ ] **Step 1: Add isGreetingPhase to the hook interface and return**

In `VoiceAgentHook` interface, add:

```ts
isGreetingPhase: boolean;
```

In the return object, add:

```ts
isGreetingPhase: activeAgent.isGreetingPhase || false,
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useVoiceAgent.ts
git commit -m "feat: expose isGreetingPhase from voice agent hook"
```

---

## Chunk 9: Voice Infrastructure — Conversation Memory

### Task 24: Add checkpoint functions to language-agent.ts

**Files:**
- Modify: `src/lib/language-agent.ts`

- [ ] **Step 1: Read the current file**

Read `src/lib/language-agent.ts` fully.

- [ ] **Step 2: Add `getConversationCheckpoint()` function**

First, add `ConversationCheckpoint` to the imports from `@/data/language-types` at the top of the file.

Add after the existing database fetch functions:

```ts
export async function getConversationCheckpoint(
  userId: string,
  targetLanguage: string
): Promise<ConversationCheckpoint | null> {
  const { data, error } = await supabase
    .from('user_language_profiles')
    .select('conversation_checkpoint')
    .eq('user_id', userId)
    .eq('target_language', targetLanguage)
    .single();

  if (error || !data?.conversation_checkpoint) return null;

  const checkpoint = data.conversation_checkpoint as ConversationCheckpoint;

  // Validate checkpoint
  if (!checkpoint.schemaVersion || !checkpoint.lastTopicId) {
    console.warn('[language-agent] Invalid checkpoint, treating as fresh start');
    return null;
  }

  return checkpoint;
}
```

- [ ] **Step 3: Add `updateConversationCheckpoint()` function**

```ts
export async function updateConversationCheckpoint(
  userId: string,
  targetLanguage: string,
  checkpoint: ConversationCheckpoint
): Promise<void> {
  await supabase
    .from('user_language_profiles')
    .update({ conversation_checkpoint: checkpoint })
    .eq('user_id', userId)
    .eq('target_language', targetLanguage);
}
```

- [ ] **Step 4: Add `buildResumeContext()` function**

```ts
export function buildResumeContext(checkpoint: ConversationCheckpoint): string {
  return `
## CONVERSATION RESUME
Last session: ${checkpoint.lastSessionTimestamp}
Topic: ${checkpoint.lastTopicName}
Progress: ${checkpoint.topicProgress} (${checkpoint.totalExchangesOnTopic} exchanges)
Summary: ${checkpoint.lastExchangeSummary}
Vocab in progress: ${checkpoint.vocabInProgress.join(', ') || 'None'}
Mistake patterns: ${checkpoint.mistakePatterns.join(', ') || 'None'}
Next topic: ${checkpoint.nextTopicName}

Resume from this point. Greet the user warmly, remind them where they left off, and continue practicing the current topic.`;
}
```

- [ ] **Step 5: Integrate checkpoint into `buildAgentContext()`**

Modify the `buildAgentContext()` function to also fetch and include the checkpoint:

```ts
// Add to the parallel fetch:
const checkpoint = await getConversationCheckpoint(userId, targetLanguage);

// In buildSystemPrompt, add checkpoint context after the LAST SESSION section:
if (checkpoint) {
  parts.push(buildResumeContext(checkpoint));
}
```

- [ ] **Step 6: Add `summarizeAndUpdateCheckpoint()` for session end**

```ts
export async function summarizeAndUpdateCheckpoint(
  userId: string,
  targetLanguage: string,
  transcript: TranscriptEntry[],
  currentCheckpoint: ConversationCheckpoint | null,
  currentTopicId: string,
  currentTopicName: string,
  nextTopicId: string,
  nextTopicName: string
): Promise<void> {
  // Use LLM to summarize the session
  const transcriptText = transcript.map(t => `${t.role}: ${t.text}`).join('\n');

  const summary = await generateWithMoonshot([
    {
      role: 'system',
      content: 'Summarize this language practice session in 1-2 sentences. Focus on what the student practiced, what they struggled with, and what vocabulary was used. Return ONLY the summary text.',
    },
    { role: 'user', content: transcriptText.slice(-3000) },
  ], { temperature: 0.3, maxTokens: 200 });

  const exchangeCount = transcript.filter(t => t.role === 'user').length;
  const totalExchanges = (currentCheckpoint?.totalExchangesOnTopic || 0) + exchangeCount;

  // Determine topic progress
  let topicProgress: 'started' | 'practicing' | 'comfortable' = 'started';
  if (totalExchanges >= 8) topicProgress = 'comfortable';
  else if (totalExchanges >= 3) topicProgress = 'practicing';

  const newCheckpoint: ConversationCheckpoint = {
    schemaVersion: 1,
    lastTopicId: currentTopicId,
    lastTopicName: currentTopicName,
    topicProgress,
    nextTopicId,
    nextTopicName,
    lastExchangeSummary: summary,
    vocabInProgress: currentCheckpoint?.vocabInProgress || [],
    mistakePatterns: currentCheckpoint?.mistakePatterns || [],
    totalExchangesOnTopic: totalExchanges,
    lastSessionTimestamp: new Date().toISOString(),
  };

  await updateConversationCheckpoint(userId, targetLanguage, newCheckpoint);
}
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/language-agent.ts
git commit -m "feat(memory): add conversation checkpoint CRUD and resume context builder"
```

---

### Task 25: Update voice-session API to support modes and checkpoints

**Files:**
- Modify: `src/app/api/language/voice-session/route.ts`

- [ ] **Step 1: Read the current route**

Read `src/app/api/language/voice-session/route.ts`.

- [ ] **Step 2: Add mode handling**

The route should accept a `mode` parameter in the request body (`'free-form' | 'lesson-practice' | 'placement'`).

For `placement` mode: use a placement-specific system prompt that tells the agent to evaluate, not teach.

For `lesson-practice` mode: inject the lesson context (target vocab, grammar, scenarios) into the system prompt.

For `free-form` mode (default): use the existing behavior plus checkpoint resume context.

- [ ] **Step 3: Inject checkpoint context for free-form mode**

When mode is `free-form`, call `getConversationCheckpoint()` and include `buildResumeContext()` in the system prompt passed to Deepgram.

If no checkpoint exists but the user has a `current_course_slug`, create an initial checkpoint from their course position (first lesson of current module). This handles the "first session" path from spec Section 5.5.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/language/voice-session/route.ts
git commit -m "feat(api): add mode and checkpoint support to voice-session route"
```

---

### Task 26: Add checkpoint save endpoint

**Files:**
- Modify: `src/app/api/language/session/route.ts` (or create if it doesn't exist)

- [ ] **Step 1: Check if the session route exists**

Read `src/app/api/language/session/` to see if a POST route already exists for saving sessions.

- [ ] **Step 2: Add PATCH handler for checkpoint updates**

Add a PATCH handler that accepts:
```ts
{
  userId: string;
  targetLanguage: string;
  transcript: TranscriptEntry[];
  currentTopicId: string;
  currentTopicName: string;
  nextTopicId: string;
  nextTopicName: string;
}
```

Calls `summarizeAndUpdateCheckpoint()` from language-agent.ts.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/language/session/
git commit -m "feat(api): add checkpoint update endpoint for session end"
```

---

### Task 26b: Update Sarvam API route for modes and checkpoints

**Files:**
- Modify: `src/app/api/language/sarvam/route.ts`

- [ ] **Step 1: Read the current Sarvam route**

Read `src/app/api/language/sarvam/route.ts`.

- [ ] **Step 2: Add mode and checkpoint support**

Mirror the changes from Task 25: accept `mode` parameter, inject checkpoint context for free-form mode, use placement system prompt for placement mode, and pass lesson context for lesson-practice mode. This ensures Hindi voice sessions have the same mode/checkpoint functionality as the Deepgram pipeline.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/language/sarvam/route.ts
git commit -m "feat(api): add mode and checkpoint support to Sarvam route for Hindi"
```

---

### Task 26c: Add topic progression logic (competency-based transitions)

**Files:**
- Modify: `src/lib/language-agent.ts`

- [ ] **Step 1: Add competency signal detection to `analyzeUserTurn()`**

Extend the existing `analyzeUserTurn()` function to also count competency signals. When the LLM analysis returns `estimatedProficiencySignal: 'at_level'` or `'above_level'`, and `vocabUsedCorrectly` is non-empty, increment the competency count.

- [ ] **Step 2: Add topic transition instructions to system prompt**

In `buildSystemPrompt()`, when a checkpoint exists and `totalExchangesOnTopic` is approaching the threshold (e.g., >= competencyThreshold - 2), add instructions to the system prompt:

```ts
if (checkpoint && checkpoint.totalExchangesOnTopic >= threshold - 2) {
  parts.push(`
## TOPIC TRANSITION READINESS
The student has practiced "${checkpoint.lastTopicName}" extensively (${checkpoint.totalExchangesOnTopic} exchanges).
If they demonstrate comfort in the next few exchanges, naturally transition to the next topic: "${checkpoint.nextTopicName}".
Transition smoothly — don't announce a topic change, weave it into conversation.
`);
}
```

- [ ] **Step 3: Add mid-session checkpoint update function**

```ts
export async function advanceTopicCheckpoint(
  userId: string,
  targetLanguage: string,
  newTopicId: string,
  newTopicName: string,
  nextTopicId: string,
  nextTopicName: string
): Promise<void> {
  const checkpoint: ConversationCheckpoint = {
    schemaVersion: 1,
    lastTopicId: newTopicId,
    lastTopicName: newTopicName,
    topicProgress: 'started',
    nextTopicId,
    nextTopicName,
    lastExchangeSummary: '',
    vocabInProgress: [],
    mistakePatterns: [],
    totalExchangesOnTopic: 0,
    lastSessionTimestamp: new Date().toISOString(),
  };
  await updateConversationCheckpoint(userId, targetLanguage, checkpoint);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/language-agent.ts
git commit -m "feat(agent): add competency-based topic progression and mid-session checkpoint updates"
```

---

## Chunk 10: Voice-Based Placement

### Task 27: Rebuild placement page as voice-driven assessment

**Files:**
- Modify: `src/app/placement/[lang]/page.tsx`

- [ ] **Step 1: Read the current placement page**

Read `src/app/placement/[lang]/page.tsx`.

- [ ] **Step 2: Define voice placement questions for all 5 languages**

Create placement question data for `es`, `fr`, `hi`, `zh`, `en`. Each language needs 4 rounds:

- Round 1 (A1): System speaks greeting, user responds. Visual text shows target language.
- Round 2 (A1-A2): System shows vocabulary prompts, user speaks translations.
- Round 3 (A2-B1): System shows scenario, user constructs sentences.
- Round 4 (B1+): Free conversation (2-3 turns).

All questions have `type: 'voice'`. Keep visual text/prompts on screen.

- [ ] **Step 3: Rebuild the component**

Replace the current text-input-based UI with:

1. **Intro screen**: Keep existing design but update description to mention voice assessment. Add "I already know my level" button (manual override — dropdown with A1/A2/B1/B2/C1).
2. **Assessment screen**: Shows visual text prompt + mic button. Uses `useVoiceAgent` with `mode: 'placement'` to capture user speech.
3. **Round progression**: After each round, the user's spoken response is sent to the LLM (via `/api/language/voice-session`) for evaluation. Progress bar shows current round.
4. **Results screen**: Shows assessed level + recommended course with "Start Course" button that links to the correct course slug.

- [ ] **Step 4: Handle placement fallback**

If mic access is denied or STT returns empty:
- Show "Voice assessment unavailable" message
- Fall back to text-based self-assessment (existing questions)
- Add "I already know my level" manual override

- [ ] **Step 5: For English placement, add native language selector**

When `lang === 'en'`, show a native language selector before starting the assessment. Store the selection in the user's profile via API call.

- [ ] **Step 6: Commit**

```bash
git add src/app/placement/
git commit -m "feat(placement): rebuild as voice-driven assessment with 4 rounds and fallback"
```

---

## Chunk 11: UI Integration — Talk Page & Lesson Pages

### Task 28: Update talk page with course progress context

**Files:**
- Modify: `src/app/talk/page.tsx`

- [ ] **Step 1: Read the current talk page**

Read `src/app/talk/page.tsx`.

- [ ] **Step 2: Add course progress display**

After the user selects a language and before starting the conversation, fetch the user's course progress for that language. Show a small indicator:
- "Spanish Beginner - Module 3" or "No course started — take placement test"
- Link to the course page

- [ ] **Step 3: Pass checkpoint context to voice agent**

When calling `agent.start()`, include the user's checkpoint data. The API route (Task 25) handles injecting it into the system prompt.

For the `startConversation` function, fetch the user's proficiency level from their profile instead of hardcoding `"A1"`.

- [ ] **Step 4: Save checkpoint on session end**

When `endConversation()` is called, send the accumulated messages to the checkpoint save endpoint (Task 26) before resetting state.

- [ ] **Step 5: Commit**

```bash
git add src/app/talk/page.tsx
git commit -m "feat(talk): show course progress, pass checkpoint context, save on session end"
```

---

### Task 29: Add "Practice with Voice" to lesson pages

**Files:**
- Modify: `src/components/language/LanguageLessonPage.tsx`
- Modify: `src/components/language/LanguageTutorPanel.tsx`

- [ ] **Step 1: Read both components**

Read `src/components/language/LanguageLessonPage.tsx` and `src/components/language/LanguageTutorPanel.tsx`.

- [ ] **Step 2: Add "Practice with Voice" button to LanguageLessonPage**

After the lesson content section, add a button that:
1. Builds a `LessonPracticeConfig` from the current lesson's data
2. Converts it to `LessonContext` using `lessonPracticeToContext()`
3. Opens the `LanguageTutorPanel` with this context

```tsx
<button
  onClick={() => startVoicePractice()}
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
>
  <Mic className="w-4 h-4" />
  Practice with Voice
</button>
```

- [ ] **Step 3: Update LanguageTutorPanel to accept lesson context**

Ensure the panel accepts optional `lessonContext` props and passes them through to the voice agent:

```ts
interface LanguageTutorPanelProps {
  language: string;
  languageName: string;
  lessonTitle: string;
  proficiencyLevel: string;
  targetPhrases?: string[];
  lessonContext?: LessonContext;  // NEW
  mode?: 'free-form' | 'lesson-practice';  // NEW
}
```

- [ ] **Step 4: Add voice practice badge**

Show a small badge on lessons where the user's conversation checkpoint `lastTopicId` matches the lesson's `topicId`:

```tsx
{checkpoint?.lastTopicId === lesson.topicId && (
  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
    Practiced in voice chat
  </span>
)}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/language/LanguageLessonPage.tsx src/components/language/LanguageTutorPanel.tsx
git commit -m "feat(lessons): add Practice with Voice button and voice practice badges"
```

---

### Task 30: Update persona greeting functions for checkpoint context

**Files:**
- Modify: `src/lib/language-personas.ts`

- [ ] **Step 1: Read the personas file**

Read `src/lib/language-personas.ts`, focusing on the greeting functions and persona definitions.

- [ ] **Step 2: Update greeting function signature**

The greeting functions should accept an optional checkpoint parameter:

```ts
greeting: (userName?: string, proficiencyLevel?: ProficiencyLevel, checkpoint?: ConversationCheckpoint) => string;
```

When a checkpoint exists, the greeting should reference the last topic:
```ts
if (checkpoint) {
  return `Hola ${userName || ''}! Welcome back! Last time we were practicing ${checkpoint.lastTopicName}. Want to continue?`;
}
// ... existing greeting logic for new users
```

- [ ] **Step 3: Add English personas**

Add 3 English personas (strict, conversational, patient) following the existing pattern:
- Professor James (strict) — British English
- Sarah (conversational) — American English
- Grandma Betty (patient) — warm, encouraging

Each needs: id, name, language `'en'`, systemPrompt, adaptiveRules, defaultVoice (Deepgram Aura-2 English voices), greeting function.

- [ ] **Step 4: Commit**

```bash
git add src/lib/language-personas.ts
git commit -m "feat(personas): add checkpoint-aware greetings and English personas"
```

---

### Task 30b: Course completion transitions and course listing page

**Files:**
- Modify: `src/components/language/LanguageLessonPage.tsx` (or course page component)
- Check: `src/app/courses/` directory for listing page

- [ ] **Step 1: Add course completion detection**

In the lesson page, after the user completes the final lesson of the final module, check if `nextCourseSlug` exists on the current course. If yes, show a completion celebration and "Continue to [Next Level]" button. If no `nextCourseSlug` (Advanced course), show a mastery celebration.

```tsx
{isLastLesson && !nextLesson && (
  <div className="p-8 rounded-xl bg-slate-900 border border-emerald-500/30 text-center">
    <h2 className="text-2xl font-bold text-emerald-400 mb-4">Course Complete!</h2>
    {course.nextCourseSlug ? (
      <Link href={`/course/${course.nextCourseSlug}`}
        className="px-6 py-3 rounded-lg bg-indigo-500 text-white font-medium">
        Continue to {nextCourseTitle}
      </Link>
    ) : (
      <p className="text-slate-400">You've reached mastery level! Keep practicing in voice chat.</p>
    )}
  </div>
)}
```

- [ ] **Step 2: Update course listing page with chain visualization**

In the courses listing page, group courses by language and show progression chains:

```tsx
{Object.entries(coursesByLanguage).map(([lang, courses]) => (
  <div key={lang} className="flex items-center gap-2">
    {courses.map((course, i) => (
      <>
        <CourseCard
          course={course}
          status={getStatus(course)} // 'completed' | 'in-progress' | 'locked'
          locked={isLocked(course)}  // true if prerequisite not completed
        />
        {i < courses.length - 1 && <ArrowRight className="w-4 h-4 text-slate-600" />}
      </>
    ))}
  </div>
))}
```

Locked courses show "Complete [Previous Level] to unlock" unless placement placed the user at a higher level.

- [ ] **Step 3: Commit**

```bash
git add src/components/language/ src/app/courses/
git commit -m "feat(courses): add completion transitions and chain visualization on listing page"
```

---

## Chunk 12: Final Integration & Verification

### Task 31: Build verification

**Files:** None (verification only)

- [ ] **Step 1: Run TypeScript compiler**

```bash
cd C:/Users/bilal/Downloads/grokking && npx tsc --noEmit
```

Fix any type errors. Common issues:
- Missing `topicId` on existing Urdu A1 lessons — add it
- Import path mismatches for renamed courses
- Missing exports in index.ts

- [ ] **Step 2: Run the dev server**

```bash
npm run dev
```

Verify no build errors.

- [ ] **Step 3: Spot-check course pages**

Navigate to:
- `/course/spanish-beginner/greetings` — verify lesson loads
- `/course/chinese-beginner/pinyin-tones` — verify lesson loads
- `/course/english-beginner/first-steps` — verify lesson loads
- `/talk?lang=es` — verify voice chat starts

- [ ] **Step 4: Verify placement page**

Navigate to `/placement/es` — verify the voice assessment UI loads.

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve build errors from course integration"
```

---

## Task Dependency Graph

```
Task 1 (types) ─────────────────────────────────────────────────────┐
Task 2 (migration) ─────────────────────────────────────────────────┤
Task 3 (provider routing) ──────────────────────────────────────────┤
Task 4 (agent defaults) ───────────────────────────────────────────┤
                                                                    ▼
┌─ Tasks 5-7 (Spanish courses) ──┐     ┌─ Tasks 21-22 (greeting fix)──┐
├─ Tasks 8-10 (French courses) ──┤     │           ▼                   │
├─ Tasks 11-13 (Hindi courses) ──┤     ├─ Task 23 (greeting hook) ────┤
├─ Tasks 14-16 (Chinese courses) ┤     ├─ Task 24 (checkpoint CRUD) ──┤
└─ Tasks 17-19 (English courses) ┘     │           ▼                   │
            │                           ├─ Tasks 25-26 (API endpoints) ┤
            │                           ├─ Task 26b (Sarvam API) ──────┤
            ▼                           └─ Task 26c (topic progression)┘
    Task 20 (registry) ────────────────────────────┤
                                                    ▼
                            ┌─ Task 27 (placement page) ───┐
                            ├─ Task 28 (talk page) ─────────┤
                            ├─ Task 29 (lesson pages) ──────┤
                            ├─ Task 30 (persona greetings) ─┤
                            └─ Task 30b (course completion) ┘
                                        │
                                        ▼
                              Task 31 (verification)
```

**Parallelization opportunities:**
- Tasks 5-19 (all course content) can run in 5 parallel subagents (one per language)
- Tasks 21-26c (voice infrastructure) can run in parallel with course content, BUT:
  - Tasks 21-22 must complete before Task 23 (hook depends on underlying agents)
  - Tasks 24-25 must complete before Task 26 (checkpoint API depends on CRUD functions)
- Tasks 27-30b (UI integration) depend on both course content AND voice infrastructure being done

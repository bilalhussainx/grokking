# Language Learning Voice Agent — Design Specification

**Date:** 2026-03-14
**Status:** Draft
**Author:** Claude + Bilal
**Platform:** Grokking (grokking.dev)

---

## 1. Overview

### Mission

Build an AI-powered language learning system for the Grokking platform that provides real-time voice conversation practice, structured A1→C2 curriculum, and persistent per-user memory — making Grokking a universal learning hub beyond tech courses.

### What We're Building (Phase 1)

- **Self-hosted voice pipeline** (Faster-Whisper STT + Kokoro TTS + Ollama Kimi) running on a GPU VPS
- **RAG language agent** with persistent per-user memory (mistakes, vocabulary, proficiency tracking)
- **Culturally authentic persona roster** (3 teaching styles per language) with adaptive proficiency behavior
- **A1→C2 structured courses** with grammar, vocabulary, voice scenarios, and cultural content
- **Placement test** (voice + text) to assess starting level
- **Hub homepage** with separate Tech and Languages sections
- **Translation widget** on CS courses (floating, bottom-left)
- **Language tutor panel** on language courses (replaces Coach Alex panel)

### What We're NOT Building Yet

- P2P voice calls between friends (Phase 2)
- Call analyzer / passive meeting listener (Phase 2)
- Mobile app (Phase 3)
- Phone call integration via PSTN (Phase 3)
- Personalized dashboard homepage (Phase 2 — start with hub)

### Competitive Positioning

| Feature | Grokking | Fluently | Duolingo |
|---|---|---|---|
| Languages | 8+ | English only | 36+ |
| Structured curriculum (A1→C2) | Yes | No | Yes |
| Voice conversation practice | Yes | Yes | Limited |
| Persistent memory / RAG | Yes | No | No |
| Adaptive personas | 3 styles/lang | Generic AI | No AI tutor |
| Spaced repetition | Yes (SM-2) | No | Yes |
| Deep feedback + exercises | Yes | Shallow | Gamified |
| P2P practice calls | Phase 2 | No | No |
| Integrated with CS courses | Yes | No | No |
| Self-hosted (cost control) | Yes | On-device | Cloud |
| Call analyzer | Phase 2 | Yes | No |

---

## 2. Voice Provider Architecture

### Three-Tier Provider Strategy

Self-hosted is the **primary tier**, with cloud APIs as overflow and premium fallback.

#### Tier 1 — Self-Hosted (Default, ~$0/min marginal cost)

| Component | Model | VRAM | Notes |
|---|---|---|---|
| STT | Faster-Whisper large-v3-turbo | ~6GB | 99+ languages, MIT license |
| TTS | Kokoro-82M | <1GB | 8 languages, Apache 2.0, #1 quality |
| LLM | Ollama + Kimi | ~8-12GB | Live translation + conversation |
| **Total** | | **~16-20GB** | **Fits on 24GB RTX 3090** |

**Kokoro-supported languages (Tier 1 TTS):** English, Spanish, French, Hindi, Portuguese, Mandarin Chinese, Japanese, Italian.

#### Tier 2 — Overflow (Languages Kokoro doesn't cover)

| Language Group | STT | TTS | Cost/min |
|---|---|---|---|
| Urdu | Faster-Whisper (local) | Sarvam Bulbul v3 (API) | ~$0.02 |
| Punjabi | Sarvam Saaras v3 (API) | Sarvam Bulbul v3 (API) | ~$0.04 |
| Arabic | Faster-Whisper (local) | MiniMax 2.6 Turbo (API) | ~$0.03 |

#### Tier 3 — Premium/Burst (When VPS at capacity)

| Component | Provider | Cost |
|---|---|---|
| STT | Deepgram Nova-3 | $0.0077/min |
| TTS | MiniMax 2.6 Turbo | $30/1M chars |
| LLM | Kimi K2 API / Gemini Flash | ~$0.14-0.40/1M tokens |

### Provider Routing Table

| Language | STT | TTS | LLM | Cost/min |
|---|---|---|---|---|
| English | Faster-Whisper (local) | Kokoro (local) | Ollama Kimi (local) | ~$0 |
| Spanish | Faster-Whisper (local) | Kokoro (local) | Ollama Kimi (local) | ~$0 |
| French | Faster-Whisper (local) | Kokoro (local) | Ollama Kimi (local) | ~$0 |
| Portuguese | Faster-Whisper (local) | Kokoro (local) | Ollama Kimi (local) | ~$0 |
| Hindi | Faster-Whisper (local) | Kokoro (local) | Ollama Kimi (local) | ~$0 |
| Mandarin | Faster-Whisper (local) | Kokoro (local) | Ollama Kimi (local) | ~$0 |
| Japanese | Faster-Whisper (local) | Kokoro (local) | Ollama Kimi (local) | ~$0 |
| Italian | Faster-Whisper (local) | Kokoro (local) | Ollama Kimi (local) | ~$0 |
| Urdu | Faster-Whisper (local) | Sarvam (API) | Ollama Kimi (local) | ~$0.02 |
| Punjabi | Sarvam STT (API) | Sarvam (API) | Ollama Kimi (local) | ~$0.04 |
| Arabic | Faster-Whisper (local) | MiniMax (API) | Ollama Kimi (local) | ~$0.03 |

### VPS Infrastructure

**Hardware:** RunPod RTX 3090 (~$161/mo) or Vast.ai (~$80/mo), 24GB VRAM.

**Docker Compose stack:**

```yaml
services:
  whisper:
    image: faster-whisper-server
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
    ports:
      - "8001:8001"

  kokoro:
    image: kokoro-tts-server
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
    ports:
      - "8002:8002"

  ollama:
    image: ollama/ollama
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama

  relay:
    image: node:20-alpine
    ports:
      - "8080:8080"
    depends_on:
      - whisper
      - kokoro
      - ollama
```

### Voice Pipeline (WebSocket-based)

```
User's browser
    ↕ WebSocket (audio chunks, 16kHz PCM mono)
VPS WebSocket Relay Server (Node.js)
    ↓ audio chunks
Faster-Whisper (local) → transcribed text
    ↓
Ollama Kimi (local) → response text + structured metadata
    ↓
Kokoro-82M (local) → audio response (24kHz PCM)
    ↓ audio chunks
    ↕ WebSocket back to browser
User hears response
```

### WebRTC-Ready Architecture (Phase 2 Preparation)

All voice streams go through a `VoiceSession` abstraction:

- **Phase 1:** `VoiceSession` connects user ↔ AI agent (via VPS WebSocket)
- **Phase 2:** `VoiceSession` connects user ↔ user (same WebRTC transport, swap AI for peer)

The VPS WebSocket relay is designed to be replaceable with a WebRTC signaling server. The `useLocalVoiceAgent` hook shares the same interface as `useDeepgramAgent`:

```typescript
interface VoiceAgentHook {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  micMuted: boolean;
  error: string;
  start: (config?: VoiceAgentConfig) => Promise<void>;
  stop: () => void;
  toggleMic: () => void;
  sendPromptUpdate: (prompt: string) => void;
}

function useVoiceAgent(tier: 'local' | 'deepgram'): VoiceAgentHook {
  switch(tier) {
    case 'local': return useLocalVoiceAgent();
    case 'deepgram': return useDeepgramAgent();
  }
}
```

### Provider Router Interface

```typescript
interface VoiceProvider {
  id: string;
  type: 'stt' | 'tts';
  supportedLanguages: string[];  // BCP-47 codes
  streamingSupported: boolean;
  connect(config: VoiceConfig): Promise<VoiceStream>;
}

interface VoiceProviderRouter {
  getSTTProvider(language: string): VoiceProvider;
  getTTSProvider(language: string): VoiceProvider;
  getFallbackProvider(type: 'stt' | 'tts'): VoiceProvider;
  getHealthStatus(): Promise<TierHealth>;
}
```

### Credit Costs

| Action | Credits | Est. real cost |
|---|---|---|
| Voice conversation (per min) | 3 | ~$0.00-0.04 |
| Placement test (one-time) | 5 | ~$0.06 |
| Text translation (per request) | 1 | ~$0.004 |
| Lesson content TTS (per lesson) | 2 | ~$0.02 |

### Cost Comparison

| Scenario (100 users, 30min/day) | Self-Hosted | Cloud APIs Only |
|---|---|---|
| 8 Kokoro languages | ~$80-161/mo (VPS) | ~$3,600-7,200/mo |
| + Urdu/Punjabi (20% of users) | ~$100-180/mo | ~$4,300-8,600/mo |
| **Savings** | **95%+** | — |

---

## 3. Language Tutor Agent System

### Persona Roster

Three teaching styles per language, each culturally authentic. Each persona adapts its intensity based on the user's proficiency level.

| Style | Approach | Best For |
|---|---|---|
| **Strict Teacher** | Grammar-focused, corrects every mistake, formal speech | A1-B1, structure-seekers |
| **Conversation Partner** | Casual, natural flow, corrects only when meaning breaks | B1-C2, confidence builders |
| **Patient Guide** | Slow-paced, repeats often, native language scaffolding | A1-A2, anxious beginners |

**Example personas per language:**

| Language | Strict Teacher | Conversation Partner | Patient Guide |
|---|---|---|---|
| Spanish | Profesora Elena (Peninsular) | Carlos (Mexican, casual) | Ana (Colombian, warm) |
| French | Professeur Laurent (Parisian) | Camille (Quebecois, friendly) | Sophie (gentle, visual) |
| Urdu | Ustaad Rashid (formal Lahori) | Ayesha (modern Karachi) | Nani Amira (grandmotherly) |
| Mandarin | Teacher Wei (Beijing standard) | Mei (Taiwanese, relaxed) | Uncle Chen (patient, stories) |
| Hindi | Pandit Sharma (classical) | Priya (Mumbai casual) | Dadi Sunita (storyteller) |
| Portuguese | Professor Rodrigo (Lisbon) | Luana (Rio, energetic) | Tia Maria (patient aunt) |
| Arabic | Ustaz Khalid (Modern Standard) | Nour (Egyptian casual) | Mama Fatima (gentle) |
| Japanese | Tanaka-sensei (formal Tokyo) | Yuki (Osaka, friendly) | Obaa-chan Hanako (grandma) |

### Adaptive Behavior by Proficiency

```
A1-A2 (Beginner):
  - 70% native language, 30% target language
  - Translate every new phrase immediately
  - Short sentences, basic vocabulary
  - Celebrate small wins frequently
  - Speak slowly, repeat key phrases

B1-B2 (Intermediate):
  - 30% native language, 70% target language
  - Translate only when user is stuck (3+ second pause)
  - Introduce idioms, cultural context
  - Correct grammar inline
  - Normal conversation speed

C1-C2 (Advanced):
  - 5% native language, 95% target language
  - Native-speed conversation
  - Discuss complex topics (politics, philosophy, technical)
  - Correct only nuanced errors (register, formality, regional)
  - Challenge with debates, presentations, storytelling
```

### Persona Data Structure

Extends the existing pattern from `src/lib/voice-personas.ts`:

```typescript
interface LanguagePersona {
  id: string;
  name: string;
  language: string;
  style: 'strict' | 'conversational' | 'patient';
  culturalBackground: string;
  systemPrompt: string;
  adaptiveRules: AdaptiveRule[];
  defaultVoice: {
    provider: 'kokoro' | 'sarvam' | 'minimax';
    voiceId: string;
  };
  greeting: (level: ProficiencyLevel, userName?: string) => string;
}

interface AdaptiveRule {
  levelRange: [ProficiencyLevel, ProficiencyLevel];
  nativeLanguageRatio: number;     // 0.0 - 1.0
  correctionIntensity: 'every' | 'meaning-breaking' | 'nuanced';
  speechSpeed: 'slow' | 'normal' | 'native';
  vocabularyComplexity: 'basic' | 'intermediate' | 'advanced';
}
```

### Placement Test

1. User selects target language + native language
2. Agent asks 10-15 graduated questions via **both voice and text**
3. Starts simple ("How do you say hello?") → complex ("Explain the difference between ser and estar")
4. Scores responses → assigns A1-C2 level
5. Recommends a persona + starting module
6. Results stored in `placement_results` table
7. Cost: 5 credits (one-time per language)

---

## 4. RAG Agent with Per-User Memory

### Architecture

Every conversation builds on the last. The agent remembers what the user struggles with, what they've mastered, and adapts accordingly.

```
User speaks → STT → User Message
                        ↓
              ┌─────────────────────┐
              │   RAG Context Build │
              │                     │
              │ 1. User profile     │ ← Supabase: proficiency, native lang, goals
              │ 2. Learning history │ ← Supabase: completed lessons, scores
              │ 3. Mistake patterns │ ← pgvector: recurring errors, weak areas
              │ 4. Vocab mastery    │ ← Supabase: spaced repetition state
              │ 5. Session context  │ ← In-memory: current conversation
              │ 6. Lesson context   │ ← Current lesson's vocab, grammar, scenario
              └─────────────────────┘
                        ↓
              Ollama Kimi (local LLM)
              System prompt: persona + adaptive rules + RAG context
                        ↓
              Agent Response → TTS → Audio to user
                        ↓
              ┌─────────────────────┐
              │   Memory Write-back │
              │                     │
              │ • New mistakes      │ → pgvector (with embeddings)
              │ • Mastered phrases  │ → vocab_mastery table
              │ • Proficiency shift │ → user_language_profiles
              │ • Session summary   │ → language_sessions
              └─────────────────────┘
```

### RAG Context Builder

```typescript
async function buildAgentContext(
  userId: string,
  language: string,
  lessonContext?: LessonContext
) {
  const [profile, recentMistakes, dueVocab, lastSessions] = await Promise.all([
    getUserLanguageProfile(userId, language),
    getRecentMistakes(userId, language, 10),       // pgvector similarity search
    getDueVocabulary(userId, language, 15),         // SM-2 spaced repetition
    getRecentSessions(userId, language, 3),         // last 3 session summaries
  ]);

  return {
    systemPromptContext: `
      Student profile: ${profile.proficiencyLevel} level,
      native ${profile.nativeLanguage} speaker.
      Goals: ${profile.learningGoals.join(', ')}.
      Weak areas: ${profile.weakAreas.join(', ')}.
      Strong areas: ${profile.strongAreas.join(', ')}.

      Last session: ${lastSessions[0]?.agentSummary || 'First session'}.

      Recurring mistakes to watch for:
      ${recentMistakes.map(m => `- ${m.description}`).join('\n')}

      Vocabulary due for review (weave naturally into conversation):
      ${dueVocab.map(v => `- ${v.word} (mastery: ${v.masteryLevel}/5)`).join('\n')}
    `,
    lessonContext,
    profile,
  };
}
```

### Structured Output per Turn

The LLM produces both a conversational response AND structured metadata on each turn. The response streams to the user immediately; metadata is extracted via a parallel structured output call:

```typescript
interface AgentTurnMetadata {
  mistakesDetected: {
    type: 'grammar' | 'pronunciation' | 'vocabulary' | 'cultural';
    utterance: string;
    correction: string;
    explanation: string;
  }[];
  vocabUsedCorrectly: string[];
  vocabUsedIncorrectly: string[];
  estimatedProficiencySignal: 'below_level' | 'at_level' | 'above_level';
  suggestedNextTopics: string[];
}
```

### Memory Write-back

After each turn:
1. **Mistakes** → Upsert into `mistake_patterns` (increment frequency if existing, create if new). Generate embedding via Ollama embedding model for pgvector.
2. **Vocabulary** → Update `vocab_mastery` using SM-2 algorithm. Correct usage → increase interval. Incorrect → reset interval.
3. **Proficiency signals** → Accumulate over session. If 5+ consecutive "above_level" signals → suggest level-up assessment.
4. **Session summary** → Generated by LLM at session end, stored in `language_sessions`.

### Vector Search for Mistake Patterns

Using Supabase pgvector for similarity search:

```sql
-- Find similar mistakes to provide targeted feedback
select * from mistake_patterns
where user_id = $1
  and target_language = $2
  and resolved = false
order by embedding <=> $3  -- cosine similarity to current mistake
limit 5;
```

### SM-2 Spaced Repetition for Vocabulary

```typescript
function updateSM2(vocab: VocabMastery, quality: 0 | 1 | 2 | 3 | 4 | 5): VocabMastery {
  // quality: 0=complete blackout, 5=perfect recall
  let { easeFactor, intervalDays, masteryLevel } = vocab;

  if (quality >= 3) {
    // Correct
    if (masteryLevel === 0) intervalDays = 1;
    else if (masteryLevel === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
    masteryLevel = Math.min(5, masteryLevel + 1);
  } else {
    // Incorrect — reset
    masteryLevel = 0;
    intervalDays = 1;
  }

  easeFactor = Math.max(1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return {
    ...vocab,
    easeFactor,
    intervalDays,
    masteryLevel,
    nextReviewAt: addDays(new Date(), intervalDays),
    lastReviewedAt: new Date(),
    timesCorrect: vocab.timesCorrect + (quality >= 3 ? 1 : 0),
    timesIncorrect: vocab.timesIncorrect + (quality < 3 ? 1 : 0),
  };
}
```

### Key Differentiator vs Fluently

Fluently has no persistent memory — each session starts fresh. Our agent says: "Last week you kept mixing up ser and estar when talking about locations — let's practice that today." This is something no competitor does.

---

## 5. Course Content Structure (A1→C2)

### Framework

Each language follows the Common European Framework of Reference (CEFR). 6 levels, each with 4-6 modules, each module with 5-8 lessons.

```
Spanish (example)
├── A1 - Beginner
│   ├── Module 1: First Words (greetings, numbers, alphabet)
│   ├── Module 2: About Me (introductions, family, age)
│   ├── Module 3: Daily Life (food, time, weather)
│   ├── Module 4: Getting Around (directions, transport, shopping)
│   └── Module 5: A1 Assessment
├── A2 - Elementary
│   ├── Module 1: Past & Future (tenses, storytelling)
│   ├── Module 2: At Work (workplace vocab, email, phone calls)
│   ├── Module 3: Health & Body (doctor visits, emergencies)
│   ├── Module 4: Culture & Customs (holidays, etiquette)
│   └── Module 5: A2 Assessment
├── B1 - Intermediate
│   ├── Opinions, debates, news, travel, relationships
├── B2 - Upper Intermediate
│   ├── Idioms, humor, professional writing, regional dialects
├── C1 - Advanced
│   ├── Literature, politics, philosophy, negotiation
└── C2 - Mastery
    └── Native-level fluency, academic discourse, poetry
```

### Lesson Data Structure

Extends the existing `Lesson` type from `src/data/types.ts`:

```typescript
interface LanguageLesson extends Lesson {
  // Existing fields
  id: string;
  slug: string;
  title: string;
  content: string;                  // Markdown: grammar notes, cultural context, examples

  // Language-specific fields
  targetLanguage: string;           // BCP-47 code
  proficiencyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  vocabulary: VocabEntry[];
  grammarPoints: string[];
  voiceScenarios: VoiceScenario[];
  culturalNotes?: string;
}

interface VocabEntry {
  word: string;                     // target language
  translation: string;              // user's native language (dynamically swapped)
  pronunciation: string;            // IPA or phonetic
  audioKey?: string;                // pre-generated TTS clip ID
  exampleSentence: string;
  exampleTranslation: string;
}

interface VoiceScenario {
  id: string;
  title: string;                    // "Ordering at a restaurant"
  situation: string;                // context prompt for the agent
  agentRole: string;                // "You are a waiter in Madrid..."
  userGoal: string;                 // "Order a meal and ask for the bill"
  targetPhrases: string[];          // phrases the user should try to use
  successCriteria: string[];        // what "passing" looks like
}
```

### Content Generation Strategy

- **Phase 1:** Hardcode A1-A2 for 3 priority languages (Spanish, French, Urdu) — 6 course sets
- **Phase 2:** Use existing MCP course generation pipeline (Tavily + Kimi K2) for B1+ levels and additional languages
- **Storage:** `generated_courses` table (same JSONB structure as existing CS generated courses)

### Assessment

Final module of each level is an assessment:
- 5 text questions + 5 voice scenarios
- Graded by the LLM against `successCriteria`
- Pass → unlock next level + 10 credits reward
- Fail → suggest review modules (no hard gating)

---

## 6. UI Integration

### Hub Homepage (Phase 1)

The home page becomes a learning hub with category cards. Replaces the current course-only layout.

```
┌─────────────────────────────────────────┐
│  Grokking — Master Anything             │
│                                         │
│  ┌───────────┐  ┌───────────┐  ┌──────┐│
│  │ 💻 Tech    │  │ 🌍 Languages│  │ 📊  ││
│  │ 12 courses │  │ 8+ langs   │  │Soon ││
│  └───────────┘  └───────────┘  └──────┘│
│                                         │
│  Popular: Python · Spanish · React · .. │
└─────────────────────────────────────────┘
```

**Evolves to Personalized Dashboard (Phase 2):**

```
┌─────────────────────────────────────────┐
│  Welcome back, Bilal                    │
│                                         │
│  Continue Learning                      │
│  ┌─────────────────┐ ┌───────────────┐ │
│  │ React Dev → L4  │ │ Spanish → A2  │ │
│  │ ████░░ 60%      │ │ ██░░░░ 30%    │ │
│  └─────────────────┘ └───────────────┘ │
│                                         │
│  Quick Actions                          │
│  🎤 Talk to Tutor  📞 Call Friend      │
│  💻 Code Coach     📝 Write Essay       │
│                                         │
│  💻 Tech Courses    🌍 Language Courses │
└─────────────────────────────────────────┘
```

### Routing Structure

```
/                           → Hub homepage (Phase 1) / Dashboard (Phase 2)
/courses/tech               → Tech course grid (existing, renamed)
/courses/languages          → Language course grid (new)
/course/[slug]/[lesson]     → Lesson page (works for both types)
/practice                   → Quick voice practice (pick language, start talking)
/placement/[lang]           → Placement test for a language
```

### Language Course Lesson Page

On language course pages, the right panel becomes the **Language Tutor** (replaces Coach Alex):

```
┌──────────┬──────────────────┬─────────────┐
│ Sidebar  │ Lesson Content   │ Lang Tutor  │
│ (modules)│ - Grammar notes  │ 🎤 Voice    │
│          │ - Vocab list     │ - Persona   │
│          │ - Cultural notes │ - Chat      │
│          │ - Examples       │ - Scenarios │
│          │                  │ - Vocab Due │
└──────────┴──────────────────┴─────────────┘
```

### Translation Widget on CS Courses

Floating `🌐` button in bottom-left (opposite Coach Alex FAB in bottom-right). Available on ALL non-language course pages.

```
Collapsed: Small pill → "🌐 Translate"
Expanded:
┌──────────────────────────┐
│ 🌐 Translate         ✕  │
│ From: English  To: Urdu ▾│
│                          │
│ [Select text or type..] │
│                          │
│ 🎤  Translation + 🔊    │
└──────────────────────────┘
```

Features:
- Select text on lesson page → auto-populates widget
- Type or speak → get translation + audio pronunciation
- Language pair saved per user (persisted in localStorage)
- Uses same VoiceProviderRouter for TTS playback
- Ollama Kimi handles translation (no separate translation API)
- Cost: 1 credit per request

---

## 7. Database Schema

### New Tables

```sql
-- Enable pgvector extension
create extension if not exists vector;

-- User language profiles (one per user per language)
create table user_language_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  target_language text not null,
  native_language text not null,
  proficiency_level text not null default 'A1',
  current_module_id text,
  preferred_persona_id text,
  learning_goals text[] default '{}',
  weak_areas text[] default '{}',
  strong_areas text[] default '{}',
  total_practice_minutes int default 0,
  streak_days int default 0,
  last_session_summary text,
  last_practiced_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, target_language)
);

-- Vocabulary mastery (SM-2 spaced repetition)
create table vocab_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  word text not null,
  translation text not null,
  target_language text not null,
  times_correct int default 0,
  times_incorrect int default 0,
  mastery_level int default 0,
  ease_factor float default 2.5,
  interval_days int default 1,
  next_review_at timestamptz default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, word, target_language)
);

-- Mistake patterns (with pgvector for RAG retrieval)
create table mistake_patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  target_language text not null,
  category text not null,
  description text not null,
  examples text[] default '{}',
  corrections text[] default '{}',
  frequency int default 1,
  embedding vector(1536),
  resolved boolean default false,
  last_occurred_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Session history
create table language_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  target_language text not null,
  persona_id text not null,
  scenario text,
  lesson_id text,
  duration_seconds int,
  transcript jsonb,
  mistakes_found jsonb default '[]',
  new_vocab jsonb default '[]',
  proficiency_delta float default 0,
  agent_summary text,
  created_at timestamptz default now()
);

-- Placement test results
create table placement_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  target_language text not null,
  assessed_level text not null,
  text_score float,
  voice_score float,
  details jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index mistake_embedding_idx on mistake_patterns
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index vocab_due_idx on vocab_mastery
  (user_id, target_language, next_review_at);
create index lang_profile_idx on user_language_profiles
  (user_id, target_language);
create index lang_session_idx on language_sessions
  (user_id, target_language, created_at desc);
```

### Existing Tables Modified

```sql
-- Add language preferences to user_profiles
alter table user_profiles add column native_language text default 'en';
alter table user_profiles add column translate_to text;  -- preferred translation target
```

---

## 8. Phase Breakdown

### Phase 1: Language Agent MVP (This Spec)

**Infrastructure:**
- [ ] VPS provisioning (Docker Compose: Faster-Whisper + Kokoro + Ollama)
- [ ] WebSocket relay server on VPS
- [ ] VoiceProviderRouter with tier fallback logic
- [ ] Health monitoring endpoint

**Voice Agent:**
- [ ] `useLocalVoiceAgent` hook (mirrors `useDeepgramAgent` interface)
- [ ] `useVoiceAgent` factory hook (picks local vs deepgram)
- [ ] Audio capture + streaming (16kHz PCM mono, AudioWorklet)
- [ ] Audio playback + barge-in support

**RAG Memory System:**
- [ ] Database schema (all new tables + pgvector)
- [ ] `buildAgentContext()` — parallel RAG fetch
- [ ] `AgentTurnMetadata` extraction (structured output)
- [ ] Memory write-back (mistakes, vocab, proficiency, session summary)
- [ ] SM-2 spaced repetition engine for vocabulary
- [ ] pgvector similarity search for mistake patterns

**Personas:**
- [ ] 3 personas × 3 priority languages (Spanish, French, Urdu) = 9 personas
- [ ] Adaptive behavior rules per proficiency level
- [ ] Persona data in `src/lib/language-personas.ts`

**Courses:**
- [ ] A1-A2 courses for Spanish, French, Urdu (hardcoded)
- [ ] `LanguageLesson` type extending existing `Lesson`
- [ ] Voice scenarios per lesson
- [ ] Vocabulary entries per lesson

**Placement Test:**
- [ ] 10-15 graduated questions (voice + text)
- [ ] Scoring logic → A1-C2 assignment
- [ ] `/placement/[lang]` route

**UI:**
- [ ] Hub homepage (`/` with Tech + Languages cards)
- [ ] `/courses/languages` grid page
- [ ] Language tutor panel (right side, replaces Coach Alex on language courses)
- [ ] Translation widget (floating, bottom-left on CS courses)
- [ ] Persona selector in tutor panel
- [ ] Voice practice quick-start (`/practice`)

**Integration:**
- [ ] Credit deduction for voice/translation actions
- [ ] Ollama Kimi for live translation (primary)
- [ ] Kimi K2 API fallback when Ollama overloaded
- [ ] Sarvam API integration for Urdu/Punjabi TTS+STT
- [ ] MiniMax API integration for Arabic TTS

### Phase 2: P2P + Call Analyzer + Dashboard

- [ ] WebRTC peer-to-peer voice calls between friends
- [ ] Friend system (add/accept/block)
- [ ] Call analyzer (Fluently-style passive meeting listener)
- [ ] Post-call feedback reports
- [ ] Push notifications for call invites
- [ ] Personalized dashboard homepage
- [ ] B1-B2 courses for priority languages
- [ ] Additional languages (Arabic, Hindi, Mandarin, Portuguese, Punjabi courses)
- [ ] Course generation pipeline for new languages

### Phase 3: Scale + Mobile

- [ ] Mobile app (React Native / Expo)
- [ ] Phone call integration (PSTN via Twilio/WebRTC gateway)
- [ ] C1-C2 courses for all languages
- [ ] Self-hosted scaling (multiple VPS nodes, load balancing)
- [ ] Classroom mode for language classes
- [ ] Leaderboards, challenges, social features

---

## 9. Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Primary STT | Faster-Whisper (self-hosted) | 99+ languages, MIT, free at scale |
| Primary TTS | Kokoro-82M (self-hosted) | #1 quality, 82M params, Apache 2.0, free |
| Primary LLM | Ollama + Kimi (self-hosted) | Live translation, cheapest, local |
| Urdu/Punjabi TTS+STT | Sarvam AI (API) | Only provider with quality South Asian voice |
| Arabic TTS | MiniMax 2.6 Turbo (API) | $30/1M chars, 6-10x cheaper than ElevenLabs |
| Fallback LLM | Kimi K2 API | Already integrated, cheap |
| Vector DB | Supabase pgvector | Already on Supabase, no new infra |
| Spaced repetition | SM-2 algorithm | Proven, simple, effective |
| Voice transport | WebSocket (Phase 1) → WebRTC (Phase 2) | WebSocket simpler now, WebRTC needed for P2P |
| Course framework | CEFR A1→C2 | Industry standard, universally understood |
| Persona system | Extends existing voice-personas.ts pattern | Consistent with Coach Alex / interview personas |
| Hosting | RunPod/Vast.ai RTX 3090 | 24GB VRAM fits full stack, ~$80-161/mo |

---

## 10. Risk Mitigations

| Risk | Mitigation |
|---|---|
| VPS downtime | Auto-fallback to Tier 2/3 cloud APIs. Health check every 30s. |
| Kokoro quality insufficient for a language | Per-language quality gate during development. Swap to MiniMax for that language. |
| Ollama Kimi too slow for real-time conversation | Stream responses. Fallback to Kimi K2 API. Benchmark latency during VPS setup. |
| 24GB VRAM insufficient for all 3 models | Kokoro is <1GB, Whisper ~6GB. If Kimi model is too large, use smaller quantized version (Q4). |
| Sarvam AI unavailable/deprecated | iFlytek as backup for Urdu/Hindi. ElevenLabs v3 as premium fallback. |
| Content generation bottleneck (A1-A2 courses) | Start with 1 language (Spanish), validate, then parallelize. Use Kimi K2 to assist content creation. |
| Users overwhelmed by placement test | Make it optional. Default to A1 if skipped. Allow manual level selection. |

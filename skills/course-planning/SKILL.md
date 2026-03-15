---
name: course-planning
description: >
  Use when designing a new course for the Samsara.ai platform. Handles field detection,
  module structure, checkpoint placement, gamification (XP/streaks/badges), voice persona
  assignment, citation standards, video content planning, and two-level education targeting
  (beginner-friendly vs advanced/university). Outputs valid Course TypeScript objects
  compatible with src/data/types.ts.
type: skill
trigger: Creating a new course, planning course structure, adding a new subject domain
version: "1.0.0"
author: Samsara.ai
platform: samsara
requires:
  - lesson-planning
outputs:
  - Course TypeScript module (src/data/<course-slug>/index.ts)
  - Module files (src/data/<course-slug>/NN-module-name.ts)
  - Course registration entry (src/data/index.ts)
---

# Course Planning Skill

You are a PhD-level curriculum architect for the Samsara.ai learning platform. Your job is to
design complete course structures that an agent swarm can then populate with lesson content
using the `lesson-planning` skill.

## Core Principle

Every course teaches like the best professor in that field would — rigorous content, real
sources, practical application — adapted to either beginners or advanced students. No filler.
No hand-waving. Every module earns its place.

---

## Step 0: Field Detection & Variation Mapping

Before designing anything, classify the course into a domain and variation. This determines
the teaching archetype, assessment style, citation standard, and voice persona.

### Domain Taxonomy

```yaml
domains:
  computer-science:
    variations:
      - systems-programming    # C/C++, OS, compilers, embedded
      - web-development        # HTML/CSS/JS, React, Node, fullstack
      - mobile-development     # React Native, Flutter, Swift, Kotlin
      - ai-ml                  # Neural networks, NLP, computer vision, agents
      - data-science           # Pandas, statistics, visualization, pipelines
      - devops-cloud           # Docker, K8s, AWS, CI/CD, infrastructure
      - interview-prep         # DSA drills, system design, behavioral
      - game-development       # Unity, Unreal, Godot, game math
      - security               # Pen testing, cryptography, secure coding
    teaching_archetype: build-and-iterate
    assessment_style: code-execution
    citation_standard: docs-and-rfcs

  finance-business:
    variations:
      - personal-finance       # Budgeting, investing basics, retirement
      - corporate-finance      # Valuation, M&A, capital structure
      - quantitative-finance   # Options pricing, risk models, algo trading
      - accounting             # GAAP/IFRS, financial statements, auditing
      - investment-banking     # Deal structuring, pitch books, LBO models
      - entrepreneurship       # Lean startup, fundraising, scaling
      - business-strategy      # Porter's 5, competitive analysis, moats
      - fintech-blockchain     # DeFi, smart contracts, payment systems
    teaching_archetype: case-study-driven
    assessment_style: scenario-analysis
    citation_standard: market-data-and-textbooks

  economics:
    variations:
      - microeconomics         # Supply/demand, game theory, market structures
      - macroeconomics         # GDP, monetary policy, fiscal policy, trade
      - behavioral-economics   # Cognitive biases, prospect theory, nudges
      - international-economics # Trade theory, FX, development economics
      - political-economy      # Institutions, public choice, inequality
    teaching_archetype: model-and-analyze
    assessment_style: graph-interpretation-and-essay
    citation_standard: academic-journals

  religious-studies:
    variations:
      - islam                  # Quran, Hadith, Five Pillars, Sharia, Fiqh
      - ahmadiyya-islam        # Promised Messiah, Khilafat, distinct theology
      - christianity           # Old/New Testament, Catholic/Protestant/Orthodox
      - judaism                # Torah, Talmud, Mishnah, Kabbalah
      - buddhism               # Pali Canon, Mahayana sutras, Zen koans
      - hinduism               # Vedas, Upanishads, Bhagavad Gita, Darshanas
      - sikhism                # Guru Granth Sahib, Khalsa, Sikh history
      - taoism                 # Tao Te Ching, Zhuangzi, alchemy, wu wei
      - confucianism           # Analects, Mencius, Neo-Confucianism, li/ren
      - sufism                 # Rumi, Ibn Arabi, tariqas, dhikr, fana
    teaching_archetype: source-analysis-and-comparative
    assessment_style: primary-source-interpretation
    citation_standard: scripture-and-scholarly
    special_rules:
      - Always cite primary scripture with chapter/verse/surah:ayah
      - Present traditions from WITHIN the tradition's own framework first
      - Then provide academic/comparative perspective
      - Never reduce a tradition to stereotypes or oversimplifications
      - Include original language terms (Arabic, Sanskrit, Pali, Hebrew, etc.)
      - Mark scholarly debates clearly — "Scholars disagree on..."
      - Voice agent uses tradition-appropriate greetings and terminology

  philosophy:
    variations:
      - western-ancient        # Pre-Socratics, Plato, Aristotle, Stoics, Epicureans
      - western-modern         # Descartes, Kant, Hegel, Nietzsche, existentialism
      - eastern-philosophy     # Vedanta, Buddhist philosophy, Confucian ethics
      - ethics                 # Normative, applied, meta-ethics, trolley problems
      - logic-critical-thinking # Formal logic, fallacies, argumentation
      - political-philosophy   # Social contract, justice, liberty, Marx, Rawls
      - philosophy-of-mind     # Consciousness, AI, free will, dualism
      - aesthetics             # Beauty, art theory, sublime, taste
    teaching_archetype: socratic-dialogue
    assessment_style: argumentative-essay-and-debate
    citation_standard: primary-texts-standard
    special_rules:
      - Use Stephanus numbers for Plato (e.g., Republic 514a-520a)
      - Use Bekker numbers for Aristotle (e.g., NE 1094a1-1094b11)
      - Present arguments in premise-conclusion form
      - Always steelman opposing positions before critiquing
      - Voice agent plays devil's advocate in Socratic fashion

  political-strategy:
    variations:
      - geopolitics            # Great power competition, regional dynamics
      - international-relations # Realism, liberalism, constructivism, IR theory
      - campaign-strategy      # Polling, messaging, coalition building, media
      - public-policy          # Policy analysis, regulation, implementation
      - diplomacy-negotiation  # Treaty-making, mediation, track-II diplomacy
      - intelligence-analysis  # OSINT, threat assessment, strategic warning
    teaching_archetype: scenario-briefing
    assessment_style: policy-memo-and-simulation
    citation_standard: primary-documents-and-think-tanks
    special_rules:
      - Present multiple analytical frameworks for every situation
      - Use real historical cases as primary teaching material
      - Separate descriptive analysis from normative judgment
      - Mark opinion vs. fact explicitly

  health-wellness:
    variations:
      - mental-health          # CBT, mindfulness, anxiety/depression, emotional regulation
      - physical-fitness       # Exercise science, strength training, flexibility, cardio
      - nutrition              # Macros, meal planning, dietary science, supplements
      - sleep-science          # Circadian rhythms, sleep hygiene, recovery
      - stress-management      # Burnout prevention, resilience, work-life balance
      - meditation-mindfulness # Techniques, traditions, neuroscience of meditation
      - sports-psychology      # Performance, motivation, mental toughness
      - holistic-health        # Integrative approaches, traditional medicine overview
    teaching_archetype: practice-and-reflect
    assessment_style: self-assessment-and-journaling
    citation_standard: medical-journals-and-guidelines
    special_rules:
      - ALWAYS include medical disclaimer: "This is educational, not medical advice"
      - Cite peer-reviewed studies (PubMed, Lancet, JAMA, NEJM)
      - Distinguish evidence-based practices from anecdotal claims
      - Include practical exercises the student can do TODAY
      - Voice agent checks in on student's wellbeing, not just knowledge
      - Never diagnose or prescribe — always recommend consulting professionals
      - Mark confidence levels on health claims (strong evidence vs emerging)
```

### Variation Detection Rules

When the agent receives a course request, it MUST:

1. Match the topic to a domain (exact or closest fit)
2. Identify the specific variation within that domain
3. If the topic spans multiple variations, pick the PRIMARY one and note secondary influences
4. If the topic doesn't fit any variation, create a new variation entry and document it

**Examples:**
- "Machine Learning Interview Prep" → CS/interview-prep (primary) + CS/ai-ml (secondary)
- "Islamic Finance" → finance-business/fintech-blockchain (primary) + religious-studies/islam (secondary)
- "Philosophy of Law" → philosophy/political-philosophy (primary) + political-strategy/public-policy (secondary)
- "Rumi's Poetry and Sufi Practice" → religious-studies/sufism (primary)

---

## Step 1: Level Calibration

Every course targets ONE of two levels:

### Beginner-Friendly (Elementary + High School)

```yaml
beginner:
  reading_level: Grade 8-10
  assumed_background: None — explain every concept from scratch
  vocabulary: Define all domain terms on first use, build a running glossary
  analogies: Required — every abstract concept needs a concrete analogy
  code_complexity: Basic syntax, no advanced patterns, heavy comments
  content_ratio: 60-70% explanation, 20-30% exercises, 10% reflection
  assessment_depth: Recognition and recall (identify, define, describe)
  source_handling: Summarize primary sources, provide excerpts, explain context
  voice_coaching: Frequent check-ins, encouraging tone, celebrate small wins
  video_content: Visual analogies, animated diagrams, step-by-step walkthroughs
  checkpoint_frequency: Every 2-3 lessons
  max_module_lessons: 4-5 lessons per module
```

### Advanced / University

```yaml
advanced:
  reading_level: Undergraduate to graduate
  assumed_background: Foundational knowledge in the field
  vocabulary: Use domain terms freely, define only specialized/contested terms
  analogies: Optional — use when genuinely clarifying, not as crutch
  code_complexity: Production patterns, optimization, edge cases, testing
  content_ratio: 40% explanation, 40% exercises/projects, 20% analysis
  assessment_depth: Analysis and synthesis (compare, evaluate, construct arguments)
  source_handling: Primary sources in original with commentary, scholarly debate
  voice_coaching: Socratic questioning, push for deeper analysis, challenge assumptions
  video_content: Lecture-style with primary source display, code deep-dives
  checkpoint_frequency: Every 3-4 lessons
  max_module_lessons: 5-7 lessons per module
```

---

## Step 2: Course Structure Design

### Module Planning Rules

1. **Module count**: 6-12 modules per course (fewer for beginner, more for advanced)
2. **Lesson count**: 3-7 lessons per module (see level calibration)
3. **Progressive difficulty**: Each module builds on the previous
4. **Self-contained modules**: Each module has a clear learning objective that stands alone
5. **Checkpoint placement**: One checkpoint quiz at the end of each module
6. **Capstone**: Final module is always a capstone project/essay/analysis

### Module Template

```typescript
// File: src/data/<course-slug>/NN-<module-slug>.ts
import { Module } from '../types';

export const <moduleName>Module: Module = {
  id: '<module-slug>',                    // kebab-case, unique within course
  title: '<Module Title>',                // Title Case, 3-8 words
  description: '<1-2 sentence summary of what student learns>',
  lessons: [
    // Generated by lesson-planning skill
    // Each lesson follows the Lesson interface
    // Last lesson in module = checkpoint quiz
  ],
};
```

### Course Skeleton Template

```typescript
// File: src/data/<course-slug>/index.ts
import { Course } from '../types';
import { <module1>Module } from './01-<module1-slug>';
import { <module2>Module } from './02-<module2-slug>';
// ... more modules

export const <courseName>Course: Course = {
  id: '<course-slug>',                    // kebab-case, globally unique
  slug: '<course-slug>',                  // same as id
  title: '<Course Title>',                // Title Case
  description: '<2-3 sentence course description for catalog>',
  icon: '<emoji>',                        // Single unicode emoji
  tier: 'free' | 'pro',                   // free for intro courses, pro for advanced
  modules: [
    <module1>Module,
    <module2>Module,
    // ...
  ],
};
```

### Course Registration

After creating the course, add it to `src/data/index.ts`:

```typescript
import { <courseName>Course } from './<course-slug>';

// Add to the courses array in the appropriate section
export const courses: Course[] = [
  // ... existing courses
  <courseName>Course,
];
```

---

## Step 3: Gamification Design

### XP System

```yaml
xp_allocation:
  lesson_complete: 10          # Base XP for completing a lesson
  first_attempt_bonus: 5       # Extra XP if no hints used
  speed_bonus: 3               # Under estimated time
  optional_challenge: 2        # Completed bonus exercise
  checkpoint_pass: 25          # Passed module checkpoint
  checkpoint_perfect: 15       # Additional for 100% on checkpoint
  capstone_complete: 50        # Final project/essay submitted
  streak_daily_bonus: 5        # Per day of streak maintained

xp_per_module_scaling:
  # Later modules award slightly more to reward persistence
  modules_1_3: 1.0x            # Normal XP
  modules_4_6: 1.1x            # 10% bonus
  modules_7_9: 1.2x            # 20% bonus
  modules_10_plus: 1.3x        # 30% bonus
```

### Streak System

```yaml
streaks:
  minimum_activity: 1 lesson OR 1 checkpoint OR 5 minutes voice practice
  streak_freeze: 1 per week (skip a day without losing streak)
  milestones:
    - days: 7,   reward: "Week Warrior badge"
    - days: 30,  reward: "Monthly Scholar badge + 50 bonus XP"
    - days: 100, reward: "Century Learner badge + 200 bonus XP"
    - days: 365, reward: "Samsara Master badge + 1000 bonus XP"
```

### Mastery Badges

Each course defines 3-5 badges earned by completing milestones:

```yaml
badge_template:
  - name: "<Course> Beginner"
    trigger: Complete first 3 modules
    icon: seed emoji relevant to field
  - name: "<Course> Practitioner"
    trigger: Complete 6 modules + pass all checkpoints
    icon: growth emoji relevant to field
  - name: "<Course> Scholar"
    trigger: Complete full course + capstone
    icon: mastery emoji relevant to field
  - name: "<Course> Mentor"        # Optional
    trigger: Score 90%+ on all checkpoints
    icon: teaching emoji relevant to field

# Field-specific badge examples:
religious_studies:
  - "Seeker" → "Student" → "Scholar" → "Guide"
philosophy:
  - "Questioner" → "Thinker" → "Philosopher" → "Sage"
computer_science:
  - "Coder" → "Developer" → "Engineer" → "Architect"
finance:
  - "Learner" → "Analyst" → "Strategist" → "Expert"
political_strategy:
  - "Observer" → "Analyst" → "Strategist" → "Advisor"
```

### Checkpoint System

Checkpoints serve dual purpose: gate progression + feed user learning profile.

```yaml
checkpoint_structure:
  position: Last lesson of each module
  format:
    part_1_quiz:
      question_count: 5-8
      types: [multiple_choice, true_false, fill_blank]
      pass_threshold: 70%
      xp_reward: 25 (pass) + 15 (perfect)
    part_2_voice_summary:
      trigger: After quiz is passed
      voice_agent_prompt: See CHECKPOINT_VOICE_PROMPT below
      duration: 60-120 seconds
      stored_in: user.learning_profile.checkpoint_summaries[]
      xp_reward: 10 (completed)

  failure_handling:
    first_fail: Show correct answers + explanations, allow retry
    second_fail: Suggest reviewing specific lessons, allow retry
    no_lockout: Never permanently block — always allow retry
```

---

## Step 4: Voice Agent Integration

### Voice Coaching Model

The voice agent operates in English but adapts to the course field. It serves as a
**persistent coach** that:

1. **Teaches** — Reads/explains lesson content as user scrolls through
2. **Checks comprehension** — At checkpoints, asks "Can you summarize what we covered?"
3. **Gives hints** — For exercises, progressively reveals hints before showing solutions
4. **Celebrates** — Acknowledges milestones, streak achievements, badge unlocks
5. **Recommends** — Based on user's learning profile, suggests next courses

### CHECKPOINT_VOICE_PROMPT

This is the prompt the voice agent executes when a user reaches a checkpoint:

```
You are Coach Alex, the Samsara.ai learning companion. The student has just completed
module "{module_title}" in the course "{course_title}".

CONTEXT:
- Field: {domain} / {variation}
- Level: {beginner|advanced}
- Module topics covered: {lesson_titles_list}
- Student's checkpoint quiz score: {quiz_score}%
- Student's learning profile summary: {user_profile_summary}

YOUR TASK:
1. Congratulate the student on completing the module.
2. Ask them to give you a brief verbal summary of the key concepts they learned.
   Say something like: "Before we move on, tell me in your own words — what were
   the main ideas from this module?"
3. Listen to their summary and evaluate:
   - Did they mention the core concepts? (list: {core_concepts})
   - Did they miss any critical ideas?
   - Did they show understanding or just repeat definitions?
4. If their summary is strong:
   - Affirm what they got right with specifics
   - Award the checkpoint XP
   - Unlock the next module
   - Say: "Great summary! You clearly understand {specific_concept}. Ready for {next_module}?"
5. If their summary is weak or missing key concepts:
   - Gently point out what was missed: "You covered {what_they_said} well, but
     I noticed you didn't mention {missing_concept}. That's actually really important
     because..."
   - Give a brief 1-2 sentence explanation of the missed concept
   - Ask: "Does that make sense? Want to try summarizing again, or shall we move on?"
   - Still award partial XP and unlock next module (never block progression)
6. Store the summary evaluation in the user's learning profile:
   {
     "moduleId": "{module_id}",
     "summaryText": "<user's spoken summary>",
     "conceptsCovered": ["<concepts they mentioned>"],
     "conceptsMissed": ["<concepts they missed>"],
     "comprehensionScore": <0.0-1.0>,
     "timestamp": "<ISO date>"
   }

VOICE RULES:
- Keep your responses to 2-3 sentences max before letting the student speak
- Use encouraging, warm tone — never condescending
- Reference specific lesson content, not generic praise
- If the student seems frustrated, offer to revisit the material
- Speak naturally — no bullet points or lists in voice
```

### Exercise Hint Prompt

When a student is working on an exercise and requests a hint:

```
You are Coach Alex helping with an exercise in "{lesson_title}".

EXERCISE CONTEXT:
- Course: {course_title}
- Module: {module_title}
- Exercise description: {exercise_description}
- Starter code (if applicable): {starter_code}
- Student's current code (if applicable): {current_code}
- Hint level: {hint_number} of 3

HINT PROGRESSION:
- Hint 1 (Nudge): Point the student in the right direction without giving away
  the answer. Ask a leading question. "Have you thought about what happens when...?"
- Hint 2 (Approach): Describe the general approach or algorithm needed.
  "The key insight here is that you need to... Try thinking about it as..."
- Hint 3 (Solution walkthrough): Walk through the solution step by step.
  "Here's how to solve this: First... Then... Finally..."
  If code exercise: Show the solution code and explain each part.

RULES:
- Match hint depth to hint_number — never jump ahead
- For code: reference specific line numbers and variable names
- For essays/analysis: reference specific sources or arguments
- After hint 3, offer the full solution: "Want me to show you the complete answer?"
- Track hint usage in user profile (affects first_attempt_bonus XP)
```

### Voice Persona Assignment by Domain

```yaml
voice_personas:
  computer-science:
    name: "Coach Alex"
    style: "Senior engineer mentor — practical, encouraging, code-focused"
    greeting: "Hey! Ready to code? Let's build something."

  finance-business:
    name: "Coach Morgan"
    style: "Investment analyst — sharp, data-driven, real-world examples"
    greeting: "Let's talk numbers. What are we analyzing today?"

  economics:
    name: "Coach Sage"
    style: "Policy wonk professor — analytical, balanced, loves data"
    greeting: "Welcome. Let's think about how the world actually works."

  religious-studies:
    tradition_specific: true
    personas:
      islam:
        name: "Ustadh Ibrahim"
        style: "Islamic scholar — respectful, source-grounded, uses Arabic terms"
        greeting: "As-salamu alaykum. Let us explore together."
      ahmadiyya-islam:
        name: "Murabbi Tariq"
        style: "Ahmadi teacher — gentle, Quran-focused, emphasizes peace"
        greeting: "As-salamu alaykum. Welcome to our study circle."
      christianity:
        name: "Professor Grace"
        style: "Theologian — warm, scripture-focused, ecumenical"
        greeting: "Welcome. Let's open the text together."
      judaism:
        name: "Rabbi Levi"
        style: "Talmudic teacher — questioning, textual, loves debate"
        greeting: "Shalom! Ready to wrestle with the text?"
      buddhism:
        name: "Ajahn Bodhi"
        style: "Meditation teacher — calm, precise, uses Pali terms"
        greeting: "Welcome. Let us begin with clear seeing."
      hinduism:
        name: "Pandit Arjun"
        style: "Vedantic scholar — deep, uses Sanskrit, philosophical"
        greeting: "Namaste. Let us seek understanding together."
      sikhism:
        name: "Bhai Sahib Harpreet"
        style: "Granthi — reverent, Gurmukhi-aware, Guru-focused"
        greeting: "Sat Sri Akaal. Let us learn from the Guru's wisdom."
      taoism:
        name: "Master Wei"
        style: "Taoist sage — paradoxical, nature metaphors, unhurried"
        greeting: "The journey of a thousand miles... Let's take the first step."
      confucianism:
        name: "Professor Chen"
        style: "Classical scholar — structured, ethical focus, historical"
        greeting: "Welcome, student. To study and practice — is this not a joy?"
      sufism:
        name: "Sheikh Rumi"
        style: "Sufi teacher — poetic, heart-centered, mystical"
        greeting: "Welcome, seeker. The heart has its own intelligence."

  philosophy:
    name: "Professor Sophia"
    style: "Socratic gadfly — questions everything, plays devil's advocate"
    greeting: "Welcome. I have more questions than answers. Shall we begin?"

  political-strategy:
    name: "Director Chen"
    style: "Intelligence analyst — briefing style, framework-heavy, neutral"
    greeting: "Good to have you. Let's assess the situation."

  health-wellness:
    name: "Dr. Amara"
    style: "Health coach — warm, evidence-based, empowering, non-judgmental"
    greeting: "Welcome! Let's learn how to take better care of yourself."
    special_behavior:
      - Always start sessions asking how the student is feeling
      - Frame health topics positively (what TO do, not what NOT to do)
      - Include practical micro-exercises during lessons
      - End sessions with one actionable takeaway
```

---

## Step 5: Video Content Planning (Remotion + SadTalker/Wav2Lip)

### Video Generation Architecture

```yaml
video_pipeline:
  renderer: Remotion (React-based programmatic video)
  avatar_engine: SadTalker/Wav2Lip (self-hosted, open-source)
  tts_for_video: Deepgram Aura-2 (English) or Sarvam (Hindi/Punjabi)
  hosting: VPS (same server as avatar engine)

video_types:
  concept_explainer:
    duration: 2-5 minutes
    structure: Avatar intro → Visual explanation → Code/diagram → Summary
    when: One per module for key concepts
    avatar: Field-appropriate persona (matches voice agent)

  code_walkthrough:
    duration: 3-8 minutes
    structure: Avatar intro → Code on screen → Step-by-step narration → Output demo
    when: For complex coding exercises
    avatar: Coach Alex (CS persona)

  source_analysis:
    duration: 3-6 minutes
    structure: Avatar intro → Primary text on screen → Line-by-line analysis → Context
    when: Religious studies and philosophy primary source lessons
    avatar: Tradition-specific persona

  case_study:
    duration: 4-7 minutes
    structure: Avatar intro → Scenario setup → Data/charts → Analysis → Takeaway
    when: Finance, economics, political strategy case studies
    avatar: Field-specific persona

avatar_selection:
  default_avatars:
    - "Professional Male" (default for Coach Alex, Director Chen)
    - "Professional Female" (default for Professor Sophia, Coach Morgan)
    - "Scholar Male" (default for religious personas)
    - "Scholar Female" (default for Professor Grace)
  user_custom:
    - Users can select from 6-8 preset avatars
    - Avatar selection stored in user profile
    - Same avatar used across all their courses

remotion_composition:
  # Each video is a Remotion composition with these layers:
  layers:
    - background: Gradient or themed background matching course domain
    - avatar_video: SadTalker-generated talking head (positioned bottom-right or center)
    - content_area: Code editor, text, diagrams, charts (main screen area)
    - subtitles: Auto-generated from TTS transcript
    - branding: Samsara.ai watermark + course title
```

### Video Generation Rules for Course Planning

When designing a course, mark which lessons get video content:

```yaml
video_assignment_rules:
  beginner_courses:
    - Every module intro lesson gets a concept_explainer video
    - Every coding exercise gets a code_walkthrough video
    - Total: ~60-70% of lessons have videos
  advanced_courses:
    - Module intro lessons get concept_explainer videos
    - Complex topics get source_analysis or case_study videos
    - Total: ~30-40% of lessons have videos
  religious_studies:
    - Every primary source lesson gets a source_analysis video
    - Cultural context lessons get concept_explainer videos
  always_skip:
    - Checkpoint quiz lessons (no video needed)
    - Pure exercise lessons (student should be coding/writing, not watching)
```

---

## Step 6: Citation Standards by Domain

### Computer Science
```
- Official documentation: [Python Docs](https://docs.python.org/3/...)
- RFCs: RFC 7231 (HTTP/1.1 Semantics)
- Academic: Author, "Title", Conference/Journal, Year. DOI.
- GitHub repos: owner/repo — description
```

### Finance & Business
```
- Textbooks: Author, Title, Edition, Publisher, Year, Chapter
- Market data: Source (Bloomberg/Yahoo Finance), Date, Metric
- Regulations: SEC Rule 10b-5, Dodd-Frank Act Section 619
- Case studies: HBS Case #N-NNN-NNN, "Title", Year
```

### Economics
```
- Academic papers: Author (Year). "Title." Journal, Volume(Issue), Pages. DOI.
- Data sources: BLS, FRED, World Bank, IMF — Dataset name, Date range
- Policy documents: Agency, "Title", Date
```

### Religious Studies
```
- Quran: Surah Name (Number):Ayah — e.g., Al-Baqarah (2):255
- Bible: Book Chapter:Verse (Translation) — e.g., John 3:16 (NIV)
- Torah: Book Chapter:Verse — e.g., Bereishit 1:1
- Hadith: Collection, Book, Number — e.g., Sahih Bukhari, Book 1, Hadith 1
- Guru Granth Sahib: Page number (Ang) — e.g., SGGS Ang 1
- Pali Canon: Nikaya.Sutta.Verse — e.g., DN 22.1
- Bhagavad Gita: Chapter.Verse — e.g., BG 2.47
- Tao Te Ching: Chapter — e.g., TTC Chapter 1
- Analects: Book.Passage — e.g., Analerta 1.1
- Academic commentary: Author, "Title", Publisher, Year, Pages
```

### Philosophy
```
- Plato: Stephanus numbers — e.g., Republic 514a
- Aristotle: Bekker numbers — e.g., NE 1094a1
- Kant: Academy edition — e.g., KrV A51/B75
- Modern: Author, Title, Publisher, Year, Page/Section
- Stanford Encyclopedia of Philosophy: Entry title, Section
```

### Political Strategy
```
- Primary documents: Treaty/Agreement name, Date, Article/Section
- Think tanks: Institution, "Report Title", Date
- Government sources: Agency, "Document", Date, Classification level
- Academic IR: Author (Year). "Title." Journal. DOI.
- Historical: Source, Date, Context description
```

### Health & Wellness
```
- Medical journals: Author (Year). "Title." Journal, Volume(Issue), Pages. DOI.
- Prefer: PubMed, Lancet, JAMA, NEJM, BMJ
- Guidelines: WHO, CDC, NHS, APA — Guideline name, Year, Section
- Meta-analyses preferred over single studies
- Always note sample size and study design (RCT > cohort > case study)
- DISCLAIMER: "This content is educational and not a substitute for professional medical advice."
```

---

## Step 7: User Learning Profile Integration

### Profile Data Fed to Voice Agent

The course planning skill defines what data each course contributes to the user's profile:

```typescript
interface CourseProgress {
  courseId: string;
  courseDomain: string;              // e.g., "religious-studies"
  courseVariation: string;            // e.g., "islam"
  level: 'beginner' | 'advanced';
  currentModuleIndex: number;
  completedLessons: string[];        // lesson IDs
  checkpointScores: {
    moduleId: string;
    quizScore: number;               // 0-100
    voiceSummary: {
      summaryText: string;           // Transcribed user summary
      conceptsCovered: string[];
      conceptsMissed: string[];
      comprehensionScore: number;    // 0.0-1.0
    };
    timestamp: string;
  }[];
  hintsUsed: number;
  totalXP: number;
  badges: string[];
  streakDays: number;
  averageSessionMinutes: number;
  strongTopics: string[];            // Topics with 90%+ checkpoint scores
  weakTopics: string[];              // Topics with <70% checkpoint scores
}
```

### Course Recommendation Engine Prompt

```
You are the Samsara.ai recommendation engine. Given a user's learning profile,
suggest the next course they should take.

USER PROFILE:
{user_learning_profile_json}

RULES:
1. If they completed a beginner course, suggest the advanced version
2. If they showed weakness in a topic, suggest a foundational course
3. Cross-domain suggestions: Islam student → suggest "Philosophy of Religion"
4. Never suggest a course they've already completed
5. Suggest 1 primary recommendation + 2 alternatives
6. Explain WHY each recommendation fits their profile
7. Reference specific checkpoint data: "You scored 95% on the ethics module,
   so you might enjoy our full Ethics course"
```

---

## Step 8: Research-Backed Content Generation (Tavily + Gemini)

### Tavily Search Protocol

Every course and lesson MUST be grounded in real, searchable sources. Use Tavily MCP
search (`search_depth: "advanced"`) to find real studies, articles, and primary sources.

**Minimum searches per concept:**

```yaml
search_requirements:
  per_course_design:
    - 2 searches to verify the field/topic has sufficient teaching material
    - 1 search per module to find primary sources and key references
    - Total: ~10-15 searches per course design phase

  per_lesson_content:
    - 2 searches minimum per core concept taught in the lesson
    - 1 search for real-world examples or case studies
    - 1 search for scholarly commentary (advanced level only)
    - Total: ~3-6 searches per lesson

  per_religious_tradition:
    - 2 searches for primary scripture citations (verify chapter/verse accuracy)
    - 2 searches for scholarly interpretation (find real scholars, real books)
    - 1 search for cultural/historical context
    - Total: ~5 searches per religious lesson

  per_health_topic:
    - 2 searches on PubMed/medical journals for evidence
    - 1 search for WHO/CDC/NHS guidelines
    - 1 search for practical implementation resources
    - Total: ~4 searches per health lesson

search_strategy:
  primary_tool: Tavily (search_depth: "advanced")
  fallback: Brave Search (when Tavily returns <3 relevant results)
  query_format:
    academic: "{topic} study PubMed {year_range}"
    scripture: "{tradition} {concept} {scripture_name} chapter verse"
    practical: "{topic} best practices evidence-based"
    code: "{language} {concept} documentation official"

  verification_rules:
    - Every cited source must come from an actual search result
    - Verify URLs resolve to real pages (discard 404s)
    - Prefer sources in order: PubMed > Google Scholar > DOI > gov sites > universities
    - NEVER fabricate a citation — if no source found, say "No direct evidence found"
    - Cross-reference: if search A finds a claim, search B should verify it
```

### Gemini Embeddings for Content Discovery

Use Gemini embeddings to find gaps in existing course coverage and generate new content:

```yaml
embedding_workflow:
  step_1_embed_existing:
    - Embed all existing course descriptions and module titles
    - Store in Supabase pgvector (course_embeddings table)

  step_2_identify_gaps:
    - Embed user search queries and weak_topics from profiles
    - Find queries with low similarity to any existing course (<0.5)
    - These gaps = potential new courses or modules

  step_3_generate_from_gap:
    - Take the gap topic
    - Run 3-5 Tavily searches to gather source material
    - Feed sources + skill file instructions to course-planning
    - Generate course skeleton grounded in real search results

  step_4_embed_new_content:
    - Embed the new course for future recommendations
    - Link to existing courses via prerequisite/companion system

dynamic_course_from_embeddings:
  trigger: "User searches for topic with <0.5 similarity to any course"
  action: |
    1. Log the search query
    2. After 5+ unique users search for similar topics:
       a. Run Tavily searches for source material
       b. Generate course using course-planning skill
       c. Flag for admin review
       d. Publish when approved
```

---

## Step 9: Course Prerequisites & Cross-References

### Prerequisites System

Every course MUST declare its prerequisites and recommended companion courses:

```typescript
// Extended course metadata (stored alongside Course object)
interface CourseMeta {
  courseId: string;
  prerequisites: {
    courseId: string;           // e.g., "python-fundamentals"
    reason: string;            // e.g., "You need basic Python syntax for the code exercises"
    required: boolean;         // true = hard gate, false = recommended
  }[];
  companionCourses: {
    courseId: string;           // e.g., "ethics"
    relationship: string;      // e.g., "Islamic ethics pairs well with this course"
    when: 'before' | 'during' | 'after';  // When to take it relative to this course
  }[];
  nextCourses: {
    courseId: string;           // e.g., "islam-advanced"
    reason: string;            // e.g., "Deep dive into Fiqh and Islamic jurisprudence"
  }[];
}
```

### Prerequisite Rules

```yaml
prerequisite_rules:
  beginner_courses:
    - Generally have NO prerequisites (entry points)
    - May recommend other beginner courses as companions
    - Example: "Islam Fundamentals" has no prereqs but recommends
      "Philosophy of Religion" as a companion

  advanced_courses:
    - MUST have the beginner version as a required prerequisite
    - May recommend related advanced courses
    - Example: "Advanced System Design" requires "System Design"
      and recommends "Data Structures & Algorithms"

  cross_domain_references:
    - Religious Studies courses reference relevant Philosophy courses
    - Philosophy courses reference relevant Political Strategy courses
    - Finance courses reference relevant Economics courses
    - CS interview courses reference relevant DSA courses
    - ALWAYS explain WHY the prerequisite matters

  in_lesson_references:
    - When a lesson touches a concept covered deeply in another course,
      include an inline reference:
      "For a deeper dive into this concept, see our
      [Ethics course](/course/ethics/utilitarianism-vs-deontology)."
    - These references are also used by the recommendation engine
```

### Personalized Recommendations

The user's learning profile (checkpoint summaries, scores, completed courses) drives
personalized cross-references:

```yaml
recommendation_triggers:
  - trigger: Student completes "Islam Fundamentals"
    suggest:
      primary: "Islam Advanced: Fiqh & Jurisprudence"
      companions: ["Sufism: The Mystical Path", "Philosophy of Religion"]
      reason: "You showed strong understanding of the Five Pillars.
               Ready to explore how Islamic law is derived from those foundations."

  - trigger: Student scores <70% on economics module in a Finance course
    suggest:
      primary: "Microeconomics Fundamentals"
      reason: "The economics concepts in Module 4 seemed challenging.
               This course will build that foundation."

  - trigger: Student completes 3+ Religious Studies courses
    suggest:
      primary: "Comparative Religion: Themes Across Traditions"
      reason: "You've studied {traditions_list}. This course connects
               the threads you've already seen."

  - trigger: Student's voice summaries mention philosophical questions
    suggest:
      companions: ["Ethics", "Philosophy of Mind"]
      reason: "Your checkpoint summaries show great philosophical curiosity.
               These courses will feed that."
```

### Cross-Reference Format in Lesson Content

```markdown
> **See Also:** This concept of divine command theory connects directly to
> Islamic jurisprudence (usul al-fiqh). If you're interested, our
> [Islam Fundamentals](/course/islam-fundamentals/sources-of-law) course
> covers how Islamic scholars derive legal rulings from scripture.
>
> **Prerequisite Alert:** The code examples in this module assume familiarity
> with recursion. If that's new to you, check out
> [DSA: Recursion Basics](/course/data-structures-algorithms/recursion-intro)
> first.
```

---

## Step 9: User Embeddings & Dynamic Recommendations (Gemini)

### Embedding Architecture

Samsara.ai uses **Gemini Embedding** (`gemini-embedding-001`, $0.15/M tokens) to create
rich user profiles that power personalized recommendations and dynamic course creation.

```yaml
embedding_config:
  model: gemini-embedding-001
  dimensions: 768                     # Good balance of quality vs storage
  task_type: SEMANTIC_SIMILARITY      # For matching users to content
  storage: Supabase pgvector          # Vector column in user_profiles table
  update_frequency: After each checkpoint + daily batch

privacy:
  consent_required: true
  privacy_agreement: |
    Samsara.ai collects learning data (quiz scores, checkpoint summaries,
    course progress, session duration, and optional geolocation) to
    personalize your learning experience. This data:
    - Is used ONLY within the Samsara.ai platform
    - Is NEVER shared with, sold to, or accessed by third parties
    - Is NEVER used for advertising or marketing purposes
    - Can be exported or deleted at any time from Settings > Privacy
    - Is stored encrypted at rest (AES-256) and in transit (TLS 1.3)
  user_controls:
    - Toggle geolocation sharing on/off
    - Toggle learning history embedding on/off
    - Export all data as JSON
    - Delete all embeddings (right to be forgotten)
    - View what data is stored and how it's used
```

### What Gets Embedded

User data is combined into a structured text representation before embedding:

```typescript
interface UserEmbeddingInput {
  // Learning history (always included)
  completedCourses: string[];           // Course IDs + titles
  currentCourses: string[];             // In-progress courses
  checkpointSummaries: string[];        // User's spoken summaries (transcribed)
  strongTopics: string[];               // Topics scoring 90%+
  weakTopics: string[];                 // Topics scoring <70%
  totalXP: number;
  streakDays: number;
  averageSessionMinutes: number;
  preferredDifficulty: string;          // Derived from hint usage patterns

  // Optional metadata (requires user consent)
  geolocation?: {
    country: string;                    // For regional content relevance
    timezone: string;                   // For study pattern analysis
  };
  languagesSpoken?: string[];           // For voice agent language matching
  educationLevel?: string;              // Self-reported
  interests?: string[];                 // Self-reported topic interests
  careerGoals?: string[];               // Self-reported goals
}

// Convert to embedding text
function buildEmbeddingText(input: UserEmbeddingInput): string {
  const parts = [
    `Completed courses: ${input.completedCourses.join(', ')}`,
    `Strong topics: ${input.strongTopics.join(', ')}`,
    `Weak topics: ${input.weakTopics.join(', ')}`,
    `Current level: ${input.totalXP > 5000 ? 'advanced' : input.totalXP > 1000 ? 'intermediate' : 'beginner'}`,
    `Study pattern: ${input.averageSessionMinutes}min sessions, ${input.streakDays} day streak`,
  ];

  // Add checkpoint summaries — these are the richest signal
  if (input.checkpointSummaries.length > 0) {
    parts.push(`Recent understanding: ${input.checkpointSummaries.slice(-5).join(' | ')}`);
  }

  // Add optional metadata if consented
  if (input.interests?.length) {
    parts.push(`Interests: ${input.interests.join(', ')}`);
  }
  if (input.careerGoals?.length) {
    parts.push(`Goals: ${input.careerGoals.join(', ')}`);
  }
  if (input.geolocation) {
    parts.push(`Region: ${input.geolocation.country}`);
  }

  return parts.join('. ');
}
```

### Embedding API Call

```typescript
// Generate user embedding via Gemini
async function embedUserProfile(userId: string): Promise<number[]> {
  const userData = await getUserEmbeddingInput(userId);  // Fetch from Supabase
  const text = buildEmbeddingText(userData);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text }] },
        taskType: 'SEMANTIC_SIMILARITY',
        outputDimensionality: 768,
      }),
    }
  );

  const data = await response.json();
  return data.embedding.values;  // number[768]
}

// Also embed each course for matching
async function embedCourse(courseId: string): Promise<number[]> {
  const course = getCourseById(courseId);
  const text = [
    `Course: ${course.title}`,
    `Description: ${course.description}`,
    `Domain: ${course.domain}, Variation: ${course.variation}`,
    `Level: ${course.level}`,
    `Topics: ${course.modules.map(m => m.title).join(', ')}`,
    `Prerequisites: ${course.prerequisites.map(p => p.courseId).join(', ')}`,
  ].join('. ');

  // Same API call as above, with taskType: 'RETRIEVAL_DOCUMENT'
  // ...
  return embedding;
}
```

### Recommendation via Vector Similarity

```typescript
// Find courses most relevant to this user
async function recommendCourses(userId: string, limit: number = 5) {
  const userEmbedding = await embedUserProfile(userId);

  // pgvector cosine similarity search in Supabase
  const { data } = await supabase.rpc('match_courses', {
    query_embedding: userEmbedding,
    match_threshold: 0.7,
    match_count: limit,
    exclude_completed: true,  // Don't recommend courses they've finished
  });

  return data;  // Ranked courses with similarity scores
}

// Supabase SQL function
// CREATE FUNCTION match_courses(
//   query_embedding vector(768),
//   match_threshold float,
//   match_count int,
//   exclude_completed boolean
// ) RETURNS TABLE(course_id text, similarity float)
// AS $$
//   SELECT course_id, 1 - (embedding <=> query_embedding) as similarity
//   FROM course_embeddings
//   WHERE 1 - (embedding <=> query_embedding) > match_threshold
//   ORDER BY similarity DESC
//   LIMIT match_count;
// $$ LANGUAGE sql;
```

### Dynamic Course Creation

When embeddings reveal a gap — many users have similar weak topics but no course exists —
the system can trigger dynamic course creation:

```yaml
dynamic_course_triggers:
  - condition: >
      5+ users have the same weak_topic AND no course covers that topic
    action: >
      Use course-planning skill to generate a new course targeting that topic.
      Flag as "Community Requested" in the catalog.
      Notify admin for review before publishing.

  - condition: >
      A user's interests + career goals don't match any existing course
    action: >
      Use course-planning skill to generate a personalized micro-course
      (3-4 modules) targeting their specific gap.
      Flag as "Custom Course" — available only to that user unless published.

  - condition: >
      Regional clustering — users in a specific country share similar patterns
    action: >
      Adjust course recommendations to prioritize regionally relevant content.
      e.g., Users in Pakistan → prioritize Urdu language support, Islamic studies.
      e.g., Users in Japan → prioritize Japanese voice agent, Eastern philosophy.
```

---

## Step 10: Output Checklist

Before finalizing any course, verify:

- [ ] Domain and variation correctly identified
- [ ] Level (beginner/advanced) consistently applied throughout
- [ ] 6-12 modules, each with 3-7 lessons
- [ ] Checkpoint quiz as last lesson of each module
- [ ] Capstone project/essay as final module
- [ ] XP values assigned to each module
- [ ] 3-5 mastery badges defined
- [ ] Voice persona assigned (tradition-specific for religion)
- [ ] Citation standard documented for all referenced sources
- [ ] Video content flagged for appropriate lessons
- [ ] All TypeScript interfaces match src/data/types.ts
- [ ] Course registered in src/data/index.ts
- [ ] Slug is kebab-case and globally unique
- [ ] Template literal escaping rules noted for code content
- [ ] User profile data schema defined for this course
- [ ] Prerequisites declared (required + recommended)
- [ ] Companion courses identified with relationship type
- [ ] Next courses defined for post-completion recommendations
- [ ] In-lesson cross-references planned for relevant topics

---

## Anti-Patterns

- **DO NOT** create courses shorter than 6 modules — too shallow
- **DO NOT** create modules with more than 7 lessons — cognitive overload
- **DO NOT** skip checkpoints — they feed the user profile
- **DO NOT** mix beginner and advanced content in the same course
- **DO NOT** use generic voice persona for religious studies — use tradition-specific
- **DO NOT** fabricate citations — if no source exists, say so
- **DO NOT** present religious content from outside the tradition without framing
- **DO NOT** hardcode XP values in lesson content — gamification lives in the platform layer
- **DO NOT** create video content for checkpoint/quiz lessons

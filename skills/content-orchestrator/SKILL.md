---
name: content-orchestrator
description: >
  Master orchestration skill for creating high-quality Samsara.ai course content.
  Chains all other skills (course-planning, lesson-planning, video-generation,
  content-embedding) into an executable pipeline focused on QUALITY over quantity.
  Generates prompt chains and scripts that agents execute sequentially.
  Prioritizes depth, learning goals, and user-friendly progression.
type: skill
trigger: Creating a new course end-to-end, orchestrating the full content pipeline, setting up A/B testing
version: "1.0.0"
author: Samsara.ai
platform: samsara
orchestrates:
  - course-planning
  - lesson-planning
  - video-generation
  - content-embedding
outputs:
  - Executable prompt chain (sequential steps for agents)
  - Quality gate criteria at each step
  - A/B testing configuration
  - Complete course ready for platform
---

# Content Orchestrator Skill

You are the Samsara.ai content director. Your job is NOT to generate lots of courses.
Your job is to make every single course the best learning experience possible.

## Core Principle

**One excellent course beats ten mediocre ones.** Every lesson should feel like it was
written by the best teacher in that field, personally for this student. We measure
success by learning outcomes, not content volume.

---

## Philosophy: Quality-First Content

```yaml
quality_manifesto:
  depth_over_breadth:
    - Teach fewer concepts but teach them completely
    - Every concept gets: explanation + example + exercise + reflection
    - If a topic deserves 3 lessons, give it 3 lessons — don't compress into 1
    - Better to have a 6-module course that's excellent than 12 modules that skim

  original_content:
    - Every lesson must teach something YOU can't easily find on the first Google result
    - Add insight, not just information — "here's what most tutorials miss"
    - Connect ideas across lessons — each lesson should reference and build on prior ones
    - Include the "why" behind every "what" — context makes knowledge stick

  student_centered:
    - The student should never feel lost or stupid
    - Every checkpoint is a celebration, not a test
    - Hints exist to help, not to shame
    - Voice coach is a supportive mentor, never a gatekeeper
    - Progression should feel natural — "I'm ready for the next step"

  checkpoints_are_encouragement:
    - Checkpoints exist to REINFORCE learning, not to BLOCK progress
    - Early-stage (A/B testing): pass threshold is 50%, generous partial credit
    - Voice summaries are conversational check-ins, not oral exams
    - Failed checkpoints offer review + retry, never lockout
    - XP is earned for ATTEMPTING, not just for being perfect
```

---

## The Prompt Chain

This is the exact sequence of prompts an agent (or agent swarm) executes to create
one complete, high-quality course. Each step has a quality gate.

### CHAIN OVERVIEW

```
Step 1: UNDERSTAND (what are we teaching and why?)
    ↓ Quality Gate: Learning goals are specific and measurable
Step 2: RESEARCH (find the best sources, not just any sources)
    ↓ Quality Gate: 3+ authoritative sources per module
Step 3: OUTLINE (design the learning journey, not just the content)
    ↓ Quality Gate: Each module has clear input→output transformation
Step 4: WRITE (create deep, original lesson content)
    ↓ Quality Gate: Every lesson teaches ONE concept completely
Step 5: EXERCISE (design exercises that prove understanding)
    ↓ Quality Gate: Exercises test comprehension, not memorization
Step 6: CHECKPOINT (create encouraging, not punishing, assessments)
    ↓ Quality Gate: Checkpoints reinforce, never gatekeep
Step 7: VOICE (add coaching that feels personal)
    ↓ Quality Gate: Voice interactions feel human, not robotic
Step 8: VIDEO (create videos only where they add real value)
    ↓ Quality Gate: Video explains what text cannot
Step 9: EMBED (make the course discoverable and connected)
    ↓ Quality Gate: Cross-references and recommendations are relevant
Step 10: REVIEW (read the whole course as a student would)
    ↓ Quality Gate: You'd be proud to show this to a PhD in the field
```

---

### Step 1: UNDERSTAND

**Prompt for agent:**

```
You are designing a course for Samsara.ai. Before writing a single word of content,
answer these questions thoroughly:

1. WHO is the student?
   - What do they already know? (prerequisites)
   - What frustrates them about existing resources on this topic?
   - What would make them say "finally, someone explained this properly"?

2. WHAT will they be able to DO after this course?
   - List 5-7 specific, measurable learning outcomes
   - NOT "understand X" — instead "explain X to someone else" or "apply X to solve Y"
   - Each outcome maps to a module

3. WHY does this course need to exist?
   - What gap does it fill that existing free resources don't?
   - What's the unique angle or insight we bring?
   - Why would someone choose THIS over a YouTube playlist?

4. HOW should it feel?
   - What's the emotional journey? (confused→curious→capable→confident)
   - Where will students struggle? Plan for those moments.
   - What's the "aha moment" in each module?

OUTPUT FORMAT:
```yaml
course_understanding:
  title: "<course title>"
  student_profile:
    knows: ["<what they already know>"]
    struggles_with: ["<common frustrations>"]
    wants: ["<what they hope to gain>"]
  learning_outcomes:
    - outcome: "<specific measurable outcome>"
      maps_to_module: "<module title>"
      evidence: "<how we'll know they achieved this>"
  unique_value:
    gap_filled: "<what's missing from existing resources>"
    our_angle: "<our unique perspective or approach>"
  emotional_arc:
    start: "<how student feels at start>"
    middle: "<the productive struggle>"
    end: "<how student feels at completion>"
  aha_moments:
    - module: "<module>"
      moment: "<the insight that clicks>"
```
```

**Quality Gate:** Do NOT proceed unless:
- [ ] At least 5 specific, measurable learning outcomes listed
- [ ] Each outcome uses an action verb (explain, build, analyze, compare, design)
- [ ] Unique value proposition is genuinely unique, not generic
- [ ] "Aha moments" are specific, not vague

---

### Step 2: RESEARCH

**Prompt for agent:**

```
You have the course understanding from Step 1. Now find the BEST sources — not
just any sources. Quality of sources directly determines quality of content.

FOR EACH MODULE, run these Tavily searches:

Search 1 (Authoritative): "{topic} {field} authoritative reference textbook"
Search 2 (Practical): "{topic} real-world example case study application"
Search 3 (Insight): "{topic} common misconception what most people get wrong"

For religious/philosophy topics, add:
Search 4 (Primary): "{tradition} {concept} primary scripture original text"
Search 5 (Scholarly): "{tradition} {concept} peer-reviewed academic analysis"

EVALUATION CRITERIA for each source:
- Is this from a recognized authority? (university, established publisher, peer-reviewed)
- Does this contain specific data/quotes/evidence, not just opinions?
- Is this still accurate? (check publication date)
- Would a PhD in this field respect this source?

REJECT sources that are:
- Blog posts without citations
- Wikipedia (use it to FIND sources, not AS a source)
- SEO content farms
- Outdated (>10 years for science/tech, >20 for humanities)

OUTPUT: Research dossier with source quality ratings (A/B/C):
- A: Primary source, peer-reviewed, or authoritative textbook
- B: Reputable secondary source, well-cited article
- C: Useful for examples but not citation-worthy

Minimum requirement: 3 A-rated sources per module.
```

**Quality Gate:** Do NOT proceed unless:
- [ ] 3+ A-rated sources per module
- [ ] No unverified or fabricated citations
- [ ] Primary sources found for religion/philosophy modules
- [ ] Sources cover both theory AND practical application

---

### Step 3: OUTLINE

**Prompt for agent:**

```
Using the understanding (Step 1) and research (Step 2), design the learning journey.

Read: skills/course-planning/SKILL.md — follow the domain taxonomy and structure rules.

KEY PRINCIPLE: Design for the TRANSFORMATION, not the CONTENT.

For each module, define:
```yaml
module_design:
  title: "<module title>"
  input_state: "Student knows/can do X at the START of this module"
  output_state: "Student knows/can do Y at the END of this module"
  transformation: "The key shift in understanding that happens"
  aha_moment: "The specific moment of clarity"
  lessons:
    - title: "<lesson title>"
      purpose: "WHY this lesson exists (not just what it covers)"
      concept: "ONE concept this lesson teaches completely"
      builds_on: "Which prior lesson this depends on"
      leads_to: "What this enables in future lessons"
    - title: "Module Checkpoint"
      purpose: "Celebrate progress and reinforce learning"
      checkpoint_tone: "encouraging"  # ALWAYS encouraging
```

STRUCTURE RULES:
- 6-10 modules (fewer = deeper)
- 3-5 lessons per module (not counting checkpoint)
- Each lesson teaches ONE concept COMPLETELY
- Lessons build on each other — no standalone random topics
- Every module ends with a checkpoint (celebration, not test)
- Final module is always a capstone (apply everything)
```

**Quality Gate:** Do NOT proceed unless:
- [ ] Every module has clear input→output state transformation
- [ ] No module is "miscellaneous" or "other topics"
- [ ] Lessons within a module build sequentially (not random order)
- [ ] Checkpoint is framed as encouragement, not evaluation

---

### Step 4: WRITE

**Prompt for agent:**

```
Now write the actual lesson content. This is where quality matters most.

Read: skills/lesson-planning/SKILL.md — follow the template for your domain.

FOR EACH LESSON:

1. Open with WHY this matters (2-3 sentences connecting to the student's goals)

2. Teach the concept using this structure:
   - Concrete example FIRST (show, don't tell)
   - Then the general principle (extract the pattern from the example)
   - Then a second example (confirm the pattern)
   - Then edge cases or nuance (deepen understanding)

3. Close with CONNECTION to what's next

WRITING QUALITY CHECKLIST:
- Read your lesson aloud. Does it sound like a great teacher talking?
- Remove every sentence that doesn't teach something new
- Is there a single paragraph that could be deleted without losing meaning? Delete it.
- Does the analogy actually clarify, or just add words?
- Are the code examples the SIMPLEST version that demonstrates the concept?
- Would you be embarrassed if an expert in this field read this? Fix anything sloppy.

ORIGINALITY CHECK:
- Does this lesson add insight beyond what Google's first result offers?
- Is there a "most tutorials get this wrong" or "here's what's actually happening" moment?
- Does it connect this concept to the broader course narrative?

VOICE MARKERS (add these for voice coaching):
<!-- voice:section_check concept="<specific concept to verify>" -->
<!-- voice:key_insight insight="<the ONE thing to remember>" -->
<!-- voice:exercise_intro difficulty="<easy|medium|hard>" hints_available="<0-3>" -->

TEMPLATE LITERAL ESCAPING:
- Python f-strings: \${var} not ${var}
- C# interpolation: \${var} not ${var}
- Nested backticks: \` not `
- Verify: grep -n '\$\{' <file> | grep -v '\\$\{' | grep -v 'import'
```

**Quality Gate:** Do NOT proceed unless:
- [ ] Every lesson teaches ONE concept completely (not partially)
- [ ] Every lesson has a concrete example before the abstraction
- [ ] Voice markers are present and specific (not generic)
- [ ] Template literals are escaped (zero grep violations)
- [ ] You'd be proud to show this to a PhD in the field

---

### Step 5: EXERCISE

**Prompt for agent:**

```
Design exercises that prove UNDERSTANDING, not memorization.

BAD exercise: "What are the five pillars of Islam?" (memorization)
GOOD exercise: "Explain how the five pillars work together as a system — what
happens to the whole if one pillar is missing?" (understanding)

BAD exercise: "Write a function that reverses a string." (mechanical)
GOOD exercise: "This function works but is O(n²). Why? Fix it to O(n)." (understanding)

FOR EACH EXERCISE:
1. State what understanding it tests (mapped to the lesson's concept)
2. Provide a clear prompt
3. For code: include starter code with meaningful TODO comments
4. For code: include solution code that's clean and well-commented
5. For essays/analysis: provide a rubric (what makes a strong vs weak response)

HINT DESIGN (3 levels):
- Hint 1 (Direction): A question that points the right way.
  "What happens when you call this function with an empty list?"
- Hint 2 (Approach): The general strategy without the answer.
  "Think about using a dictionary to track what you've already seen."
- Hint 3 (Walkthrough): Step-by-step solution explanation.
  "Here's the approach: First... Then... Finally..."

NEVER design exercises that:
- Require knowledge not taught in the lesson
- Have ambiguous or trick answers
- Can only be solved by memorizing the lesson text
- Make the student feel stupid for not getting it immediately
```

**Quality Gate:** Do NOT proceed unless:
- [ ] Every exercise tests understanding, not recall
- [ ] Hints are genuinely helpful, not condescending
- [ ] Solutions are clean and well-explained
- [ ] Difficulty is appropriate for the level (beginner/advanced)

---

### Step 6: CHECKPOINT

**Prompt for agent:**

```
Design checkpoints that REINFORCE and CELEBRATE, never punish or gatekeep.

Read the CHECKPOINT_VOICE_PROMPT in skills/course-planning/SKILL.md.

CHECKPOINT PHILOSOPHY:
- The student has already done the hard work of completing the module
- The checkpoint is a victory lap, not a final exam
- Getting questions wrong is a LEARNING OPPORTUNITY, not a failure
- The voice summary is a CONVERSATION, not an oral exam

A/B TESTING PHASE CONFIGURATION:
During early launch, checkpoints are EXTRA lenient:

```yaml
ab_testing_phase:
  # Phase 1: Soft launch (first 3 months)
  pass_threshold: 50%          # Very lenient — we want people to progress
  retry_unlimited: true         # No limit on retries
  show_answers_on_fail: true    # Immediately show correct answers
  xp_for_attempting: 10         # XP just for trying, even if failed
  xp_for_passing: 25            # Normal checkpoint XP
  voice_summary_required: false # Optional during A/B — don't block progression
  voice_summary_xp: 10          # Bonus XP for doing the voice summary

  # Phase 2: Established (after A/B testing)
  pass_threshold: 60%           # Still lenient — not 70% or 80%
  retry_unlimited: true         # Still unlimited
  show_answers_on_fail: true    # Always helpful
  xp_for_attempting: 5
  xp_for_passing: 25
  voice_summary_required: true  # Now expected as part of the flow
  voice_summary_xp: 10

  # NEVER do this:
  never:
    - Lock students out of content
    - Require 100% to progress
    - Penalize for wrong answers (only reward for right ones)
    - Make voice summary feel like an exam
    - Show a "FAILED" message — use "Let's review" instead
```

QUIZ DESIGN:
- 5-6 questions per checkpoint (not 10 — respect their time)
- Mix: 3 multiple choice + 1 true/false + 1 short answer
- Questions test the MODULE'S KEY CONCEPTS, not trivia
- Wrong answer options should be plausible but clearly wrong on reflection
- After each wrong answer, show a 1-sentence explanation

VOICE SUMMARY DESIGN:
- Coach says: "Nice work finishing this module! Before we continue — can you
  tell me in your own words what the main ideas were?"
- NOT: "Recite what you learned." NOT: "Quiz time."
- If student's summary is weak: "That's a good start! You mentioned X, which is
  great. One thing I'd add is Y — that's a really important part because..."
- ALWAYS end with encouragement and unlock the next module
```

**Quality Gate:** Do NOT proceed unless:
- [ ] Pass threshold is 50% (A/B phase) or 60% (established)
- [ ] No lockout language — always "Let's review" not "Failed"
- [ ] Voice summary framed as conversation, not examination
- [ ] XP awarded for attempting, not just for perfection

---

### Step 7: VOICE

**Prompt for agent:**

```
Add voice coaching that feels like a real mentor sitting next to you.

Read: Voice persona assignment in skills/course-planning/SKILL.md.
Read: Voice stages in skills/lesson-planning/SKILL.md.

KEY PRINCIPLE: The voice coach knows you, builds on your history, and
genuinely cares about your progress.

PERSONALIZATION using user data:
- Reference the student's checkpoint summaries from prior modules
- Acknowledge their streak: "Day 12 — you're on a roll!"
- Note their strengths: "You really nailed the recursion module"
- Gently address weaknesses: "I noticed the sorting concepts were tricky —
  let's make sure we've got a solid foundation before moving on"

VOICE COACH BEHAVIORS:
```yaml
lesson_start:
  prompt: >
    Greet the student by referencing their progress.
    "Welcome back! You've completed {completed_lessons} lessons in this course.
    Today we're looking at {lesson_title} — this builds on {previous_concept}."
  duration: 10-15 seconds
  tone: warm, encouraging

scroll_check:
  prompt: >
    After a major section, casually ask if it makes sense.
    "Quick thought — does the {concept} part click? No worries if not,
    we can go over it again."
  frequency: Every 2-3 sections (NOT every section)
  tone: casual, non-pressuring

exercise_support:
  prompt: >
    When student starts an exercise, frame it positively.
    "Alright, time to try it yourself. Remember what we just covered about
    {concept}. Give it a shot — I'm here if you need a nudge."
  on_hint_request: Follow hint progression (3 levels)
  on_struggle: >
    "No rush. This one takes a minute to think through. The key thing to
    consider is {hint_without_giving_away}."
  on_completion: >
    If solved alone: "Nicely done! You've got {concept} down."
    If used hints: "You got there — that's what matters."
    If viewed solution: "Smart to study the solution. The key part is {key_part}."

checkpoint_celebration:
  prompt: CHECKPOINT_VOICE_PROMPT from course-planning skill
  tone: celebratory, NEVER evaluative
```
```

**Quality Gate:** Do NOT proceed unless:
- [ ] Voice interactions reference student's actual history (not generic)
- [ ] Tone is consistently encouraging
- [ ] Scroll checks are infrequent (every 2-3 sections, not every heading)
- [ ] Exercise support has all three paths (solve alone / hints / view solution)

---

### Step 8: VIDEO

**Prompt for agent:**

```
Create videos ONLY where they add value that text cannot provide.

Read: skills/video-generation/SKILL.md

WHEN TO CREATE A VIDEO:
- A concept is fundamentally visual (data structures, architecture diagrams)
- Code walkthrough needs to show execution flow step-by-step
- A primary source needs dramatic reading with context
- A case study needs data visualization

WHEN NOT TO CREATE A VIDEO:
- The text explanation is already clear and complete
- The lesson is mostly an exercise (student should be doing, not watching)
- The content is simple definitions or lists
- A checkpoint quiz

For each video, use Moonshot API for narration (NOT Claude — saves subscription costs):
- Generate narration script: conversational, 3-5 minutes
- Generate TTS audio: Deepgram (7 langs) or Sarvam (Hindi/Punjabi)
- Generate avatar: SadTalker on VPS
- Compose with Remotion: domain-themed layers + subtitles

QUALITY CHECK: Watch the video yourself (or read the narration).
Does it EXPLAIN or just REPEAT the text? If it repeats, rewrite.
```

**Quality Gate:** Do NOT proceed unless:
- [ ] Video adds genuine value beyond the text
- [ ] Narration explains, never just reads the lesson
- [ ] Duration is 3-5 minutes (not longer)
- [ ] Avatar quality is acceptable (lip sync, resolution)

---

### Step 9: EMBED

**Prompt for agent:**

```
Make the course discoverable and connected.

Read: skills/content-embedding/SKILL.md

1. Embed the course metadata (Gemini embedding-001, 768 dims)
2. Embed each lesson (chunked if >1500 chars)
3. Set up cross-references:
   - Which existing courses are prerequisites?
   - Which courses complement this one?
   - Where should this course appear in recommendations?
4. Run a test search: "I want to learn {topic}" — does this course rank highly?
5. Check for content overlap: does any lesson duplicate existing content?
```

**Quality Gate:** Do NOT proceed unless:
- [ ] Course embedding stored in pgvector
- [ ] All lessons embedded
- [ ] Prerequisites and companions defined
- [ ] Search test returns this course for relevant queries

---

### Step 10: REVIEW

**Prompt for agent:**

```
The final quality check. Read the ENTIRE course as a student would.

REVIEW CHECKLIST:
1. Read every lesson in order. Is the flow natural? Does each lesson build
   on the previous? Is there ever a moment where you think "wait, where did
   this come from?"

2. Try every exercise. Are the instructions clear? Is the difficulty appropriate?
   Do the hints actually help? Is the solution well-explained?

3. Take every checkpoint quiz. Are the questions testing the RIGHT things?
   Is the pass threshold fair? Do the explanations for wrong answers teach?

4. Read the voice coaching prompts. Would these feel natural spoken aloud?
   Are they specific to the content, not generic "good job" filler?

5. Watch any generated videos. Do they EXPLAIN or just repeat?

6. Check all citations. Are they real? Do the URLs work?

7. THE EXPERT TEST: Would a PhD in this field say "this is accurate,
   well-structured, and does the topic justice"?

8. THE STUDENT TEST: Would a beginner say "finally, I understand this"?

9. THE COMPETITOR TEST: Is this better than what's freely available on
   YouTube, Khan Academy, or Coursera for this topic?

If ANY answer is "no," go back to the relevant step and fix it.
```

**Quality Gate (FINAL):**
- [ ] Flow is natural — no jarring transitions
- [ ] Exercises are clear and appropriately difficult
- [ ] Checkpoints are encouraging, not punishing
- [ ] Citations are real and URLs work
- [ ] Expert test: accurate and rigorous
- [ ] Student test: clear and approachable
- [ ] Competitor test: genuinely better than free alternatives

---

## Executable Script: Full Pipeline

```bash
#!/bin/bash
# scripts/create-course.sh
# Usage: ./scripts/create-course.sh <domain> <variation> <level> "<title>"

DOMAIN=$1
VARIATION=$2
LEVEL=$3
TITLE=$4

echo "=== Samsara.ai Course Creation Pipeline ==="
echo "Domain: $DOMAIN | Variation: $VARIATION | Level: $LEVEL"
echo "Title: $TITLE"
echo ""

# Step 1: Understanding phase (agent generates course_understanding.yaml)
echo "[Step 1/10] Understanding the course..."
# Agent reads this skill file, executes Step 1 prompt, outputs YAML

# Step 2: Research phase (agent runs Tavily searches)
echo "[Step 2/10] Researching sources..."
# Agent runs 3+ Tavily searches per module, outputs research_dossier.json

# Step 3: Outline phase (agent reads course-planning skill)
echo "[Step 3/10] Designing the learning journey..."
# Agent reads skills/course-planning/SKILL.md, outputs course_outline.yaml

# Step 4: Write phase (parallel agents, one per module)
echo "[Step 4/10] Writing lesson content..."
# Agent swarm: each agent reads skills/lesson-planning/SKILL.md
# Each outputs src/data/<slug>/NN-<module>.ts

# Step 5: Exercise phase
echo "[Step 5/10] Designing exercises..."
# Integrated into Step 4 (exercises are part of lessons)

# Step 6: Checkpoint phase
echo "[Step 6/10] Creating checkpoints..."
# Agent generates checkpoint lessons with A/B testing config

# Step 7: Voice phase
echo "[Step 7/10] Adding voice coaching..."
# Agent adds <!-- voice: --> markers and persona prompts

# Step 8: Video phase
echo "[Step 8/10] Generating videos..."
# Agent reads skills/video-generation/SKILL.md
# Runs: Moonshot narration → TTS → SadTalker → Remotion

# Step 9: Embed phase
echo "[Step 9/10] Embedding content..."
# Agent reads skills/content-embedding/SKILL.md
# Embeds course + lessons in pgvector

# Step 10: Review phase
echo "[Step 10/10] Quality review..."
# Agent reads entire course, runs quality checklist

echo "=== Course creation complete ==="
echo "Output: src/data/$DOMAIN-$VARIATION/"
echo "Register: Add import to src/data/index.ts"
```

---

## A/B Testing Configuration

During early launch, use these settings:

```typescript
// src/lib/ab-testing.ts

export const AB_CONFIG = {
  // Phase 1: Soft launch (first 3 months)
  phase: 'soft_launch' as const,

  checkpoints: {
    pass_threshold: 50,           // Very lenient
    xp_for_attempting: 10,        // Reward effort
    xp_for_passing: 25,
    voice_summary_optional: true, // Don't block on voice
    show_answers_immediately: true,
    retry_unlimited: true,
    failure_message: "Let's review a couple things!", // NEVER "Failed"
  },

  courses: {
    show_only_curated: true,      // Only show hand-picked best courses
    curated_course_ids: [
      // Start with your BEST courses — quality over quantity
      // Add courses here only after they pass the Step 10 review
    ],
    hide_auto_generated: true,    // Don't show mass-generated content yet
  },

  recommendations: {
    enabled: false,               // Turn on after enough user data
    min_users_for_embedding: 50,  // Need 50 users before embeddings are useful
  },

  gamification: {
    xp_visible: true,
    streaks_visible: true,
    badges_visible: true,
    leaderboards_visible: false,  // Too competitive for early stage
  },
};
```

---

## Which Courses to Build First

Build your BEST 5 courses first. Quality benchmark, not volume play.

```yaml
launch_courses:
  priority_1:
    - "Python Fundamentals" (CS, already exists, polish it)
    - "Islam: Foundations & Practice" (Religious Studies, unique offering)
  priority_2:
    - "Stoic Philosophy for Modern Life" (Philosophy, broad appeal)
    - "Personal Finance Essentials" (Finance, practical value)
  priority_3:
    - "Mental Health & Resilience" (Health, growing demand)

  each_course_must:
    - Pass all 10 steps of this orchestrator
    - Have zero fabricated citations
    - Feel genuinely better than free alternatives
    - Be reviewed by someone with domain expertise (even informally)
    - Be added to curated_course_ids only after review
```

---

## Anti-Patterns

- **DO NOT** prioritize quantity over quality — one great course > ten mediocre ones
- **DO NOT** auto-publish courses without Step 10 review
- **DO NOT** use "FAILED" language anywhere — always "Let's review"
- **DO NOT** require voice summaries during A/B testing phase
- **DO NOT** show auto-generated courses alongside curated ones during launch
- **DO NOT** enable leaderboards before you have 100+ active users
- **DO NOT** skip the competitor test — if free resources are better, yours isn't ready

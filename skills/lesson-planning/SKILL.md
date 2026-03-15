---
name: lesson-planning
description: >
  Use when generating individual lesson content for a Samsara.ai course. Handles field-specific
  lesson templates (code-based, case-study, source-analysis, strategic), assessment design,
  gamification hooks (XP/checkpoints), voice coaching integration, checkpoint summary evaluation,
  video content scripting, multi-level adaptation (beginner vs advanced), and template literal
  escaping. Outputs valid Lesson TypeScript objects compatible with src/data/types.ts.
type: skill
trigger: Generating lesson content, filling a course skeleton with lessons, creating exercises
version: "1.0.0"
author: Samsara.ai
platform: samsara
depends_on:
  - course-planning  # Receives module context and field classification from course skill
outputs:
  - Lesson objects within Module files (src/data/<course-slug>/NN-module.ts)
  - Voice scenario definitions (embedded in lesson metadata)
  - Video scripts (for Remotion pipeline)
---

# Lesson Planning Skill

You are a PhD-level content creator for the Samsara.ai learning platform. Given a module
context from the `course-planning` skill, you generate individual lesson content that is
rigorous, engaging, and properly structured for the platform's TypeScript data model.

## Core Principle

Every lesson teaches ONE clear concept and gives the student a way to prove they understood
it. No lesson exists without purpose. No exercise exists without learning value.

---

## Step 0: Receive Module Context

Before generating any lesson, you MUST receive this context from the course-planning skill:

```yaml
module_context:
  course_id: string           # e.g., "islam-fundamentals"
  course_title: string        # e.g., "Islam: Foundations & Practice"
  domain: string              # e.g., "religious-studies"
  variation: string           # e.g., "islam"
  level: beginner | advanced
  module_id: string           # e.g., "pillars-of-islam"
  module_title: string        # e.g., "The Five Pillars"
  module_index: number        # 0-based position in course
  module_description: string
  lesson_titles: string[]     # Planned lesson titles for this module
  lesson_index: number        # Which lesson you're generating (0-based)
  is_checkpoint: boolean      # True if this is the module's checkpoint lesson
  voice_persona: string       # e.g., "Ustadh Ibrahim"
  citation_standard: string   # e.g., "scripture-and-scholarly"
  has_video: boolean          # Whether this lesson gets a Remotion video
  previous_lessons_summary: string  # What was covered in prior lessons
```

If you don't have this context, STOP and ask for it. Never generate a lesson blind.

---

## Step 1: Select Lesson Template

Based on the domain, select the appropriate lesson template:

### Template A: Code-Based (Computer Science)

```markdown
## {Lesson Title}

### What You'll Learn
- Bullet 1: Core concept
- Bullet 2: Practical skill
- Bullet 3: When to use it

### Concept Explanation
{2-4 paragraphs explaining the concept with analogies for beginners,
or technical depth for advanced}

### How It Works
{Code example with line-by-line comments}

```{language}
// Example code demonstrating the concept
// Every line that isn't obvious gets a comment
```

### Common Patterns
{2-3 real-world usage patterns}

### Watch Out For
{Common mistakes and gotchas — 2-3 items}

### Try It Yourself
{Exercise description — what the student needs to build/fix/complete}
```

**TypeScript output for code lessons:**

```typescript
{
  id: '<lesson-slug>',
  slug: '<lesson-slug>',
  title: '<Lesson Title>',
  content: `## What You'll Learn...`,  // Full markdown content
  starterCode: `
    // TODO: Implement the function
    // Hint: Think about...
    function solve(input) {
      // Your code here
    }

    // Test cases — do not modify
    console.log(solve("test") === "expected");  // true
    console.log(solve("edge") === "expected");  // true
  `,
  solutionCode: `
    function solve(input) {
      // Complete working solution
      return result;
    }

    // Test cases
    console.log(solve("test") === "expected");  // true
    console.log(solve("edge") === "expected");  // true
  `,
}
```

### Template B: Case Study (Finance, Business, Economics)

```markdown
## {Lesson Title}

### The Situation
{Real-world scenario or historical case — 2-3 paragraphs}
{Include specific numbers, dates, companies, or economies}

### Key Concepts
{3-5 concepts this case illustrates, each with definition and relevance}

### Analysis Framework
{Step-by-step framework for analyzing this type of situation}
{Include formulas, models, or decision trees where applicable}

### The Data
{Tables, charts descriptions, or financial statements}
{Use markdown tables for structured data}

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Revenue | $X | $Y | $Z |

### What Actually Happened
{Real outcome — what decisions were made and why}
{Cite sources: annual reports, news articles, academic analysis}

### Your Analysis
{Exercise: Apply the framework to a similar scenario}
{Provide a new case for the student to analyze}

### Key Takeaways
{3-4 bullet points summarizing lessons learned}
```

### Template C: Source Analysis (Religious Studies, Philosophy)

```markdown
## {Lesson Title}

### Historical Context
{When was this text written? By whom? In what circumstances?}
{2-3 paragraphs setting the scene}

### The Primary Source
{Direct quotation from scripture/philosophical text}
{Include original language terms in parentheses where important}

> **{Source Citation}**
> "{Quoted text — exact translation with translator credited}"
>
> Original: {transliterated original language text if applicable}

### Key Concepts
{3-5 concepts from this passage, each explained}

**{Concept 1 — Original Term}** ({transliteration}):
{Definition and significance within the tradition}

**{Concept 2 — Original Term}** ({transliteration}):
{Definition and significance within the tradition}

### Scholarly Interpretation
{2-3 different scholarly views on this passage}
{Present the tradition's own interpretation FIRST, then academic perspectives}

> **Within the tradition:** {How believers/practitioners understand this}
> **Academic perspective:** {How scholars analyze this — Author (Year)}

### Comparative Note
{How does this concept appear in other traditions? Brief comparison.}
{Only include if genuinely illuminating, not forced}

### Reflection Questions
1. {Question requiring textual analysis}
2. {Question requiring personal reflection}
3. {Question requiring comparison with another concept from the course}

### Deeper Reading
- {Primary source, full text reference}
- {Scholarly commentary — Author, Title, Year, Pages}
- {Accessible introduction for further study}
```

### Template D: Strategic Analysis (Political Strategy)

```markdown
## {Lesson Title}

### Situation Briefing
{Describe the geopolitical/strategic scenario}
{Include: actors, interests, constraints, timeline}
{Use real historical or current examples}

### Analytical Frameworks
{2-3 frameworks applicable to this situation}
{e.g., Realist analysis, Liberal Institutionalist view, Constructivist lens}

#### Framework 1: {Name}
{How this framework explains the situation}
{Strengths and blind spots of this lens}

#### Framework 2: {Name}
{Alternative explanation}
{Where it agrees/disagrees with Framework 1}

### Key Decision Points
{What choices did/do the actors face?}
{Map out decision tree or stakeholder matrix}

### Historical Precedent
{1-2 historical parallels with outcomes}
{Cite: Document, Date, Analyst/Scholar}

### Policy Exercise
{Student writes a 1-page policy memo or strategic assessment}
{Provide: audience, format, constraints, key question to answer}

### Intelligence Assessment
{Rate confidence levels: High/Moderate/Low for key judgments}
{Model real intelligence community analytical standards}
```

### Template E: Checkpoint Quiz (All Domains)

```markdown
## Module Checkpoint: {Module Title}

### Review
{1-2 paragraph summary of what was covered in this module}

### Quiz
{5-8 questions — mix of types}

**Question 1:** {Multiple choice}
A) ...
B) ...
C) ...
D) ...

**Question 2:** {True/False with explanation required}
Statement: "..."
True or False? Explain your reasoning.

**Question 3:** {Fill in the blank}
"{Sentence with _____ for key term}"

**Question 4:** {Short answer — 2-3 sentences}
{Question requiring synthesis of multiple lessons}

**Question 5:** {Application}
{Scenario-based question requiring application of learned concepts}

### Voice Summary
After completing the quiz, your voice coach will ask you to
summarize what you learned in this module in your own words.
This helps reinforce your understanding and personalizes your
learning path.
```

---

## Step 2: Content Generation Rules

### For ALL Domains

1. **One concept per lesson** — If you're covering two distinct ideas, split into two lessons
2. **Show before tell** — Lead with an example, then explain the theory
3. **Active voice** — "The function returns X" not "X is returned by the function"
4. **No filler paragraphs** — Every paragraph teaches something or sets up an exercise
5. **Consistent terminology** — Use the same term for the same concept throughout
6. **Progressive disclosure** — Introduce complexity gradually within a lesson

### Level-Specific Rules

**Beginner-Friendly:**
```yaml
rules:
  - Start every concept with a real-world analogy
  - Define ALL domain terms on first use (bold + parenthetical definition)
  - Use short paragraphs (3-4 sentences max)
  - Include "In Plain English" callouts for complex ideas
  - Code examples: max 15-20 lines, heavily commented
  - Exercises: guided, with clear expected output
  - Provide 1 worked example before asking student to try
  - Reading level: Grade 8-10
  - Estimated lesson time: 10-15 minutes
```

**Advanced / University:**
```yaml
rules:
  - Lead with the concept, use analogies only when genuinely clarifying
  - Define only specialized/contested terms
  - Longer paragraphs acceptable for complex arguments
  - Include "Deep Dive" callouts for advanced subtopics
  - Code examples: production-quality, include edge cases and tests
  - Exercises: open-ended, require design decisions
  - Reference primary sources and scholarly debate
  - Reading level: Undergraduate+
  - Estimated lesson time: 20-30 minutes
```

---

## Step 3: Voice Coaching Integration

### Lesson-Level Voice Behavior

The voice agent (Coach Alex or domain-specific persona) is active throughout lesson
navigation. Here's how it behaves at each lesson stage:

```yaml
voice_stages:
  lesson_start:
    trigger: User opens a new lesson
    action: >
      Greet briefly and state what they'll learn.
      "Alright, this lesson covers {concept}. By the end you'll be able to {skill}."
    duration: 10-15 seconds

  scroll_checkpoints:
    trigger: User scrolls past a major section heading
    action: >
      Briefly ask if the previous section made sense.
      "Quick check — did the part about {previous_section_concept} click?
      Any questions before we move on?"
    duration: 5-10 seconds
    frequency: Every 2-3 sections (not every heading — that's annoying)

  exercise_start:
    trigger: User reaches the exercise section
    action: >
      Encourage and frame the exercise.
      "Time to try it yourself. Read the instructions and give it a shot.
      I'm here if you need a hint."
    duration: 5-10 seconds

  hint_request:
    trigger: User clicks hint button or says "I need help"
    action: Execute hint progression (see HINT_PROMPT in course-planning skill)
    duration: 15-30 seconds per hint

  exercise_complete:
    trigger: User submits correct solution or views solution
    action: >
      If solved independently: "Nice work! You nailed it."
      If used hints: "You got there — that's what matters. The key insight was {insight}."
      If viewed solution: "No shame in studying the solution. Make sure you understand
      WHY it works, not just WHAT it does. The key part is {key_part}."
    duration: 10-15 seconds

  lesson_complete:
    trigger: User finishes last section of lesson
    action: >
      Summarize and preview next lesson.
      "Good work on {lesson_title}. The main takeaway is {key_takeaway}.
      Next up: {next_lesson_title}, where we'll {preview}."
    duration: 10-15 seconds

  checkpoint_reached:
    trigger: User opens the checkpoint quiz lesson
    action: Execute CHECKPOINT_VOICE_PROMPT from course-planning skill
    duration: 60-120 seconds (including student's spoken summary)
```

### Voice-Aware Content Markers

When writing lesson content, include markers that the voice agent uses to know what to say:

```markdown
<!-- voice:section_check concept="recursion base case" -->
## Base Cases

A recursive function needs a **base case** — the condition that stops it
from calling itself forever...

<!-- voice:exercise_intro difficulty="medium" hints_available="3" -->
### Try It Yourself
Write a recursive function that...

<!-- voice:key_insight insight="Every recursive problem has overlapping subproblems" -->
### Why This Matters
The reason recursion connects to dynamic programming is...
```

These HTML comments are invisible to the rendered content but parsed by the voice agent
to know WHEN to speak and WHAT to reference.

---

## Step 4: Assessment Design

### Assessment Types by Domain

```yaml
assessments:
  computer-science:
    primary: code_execution
    formats:
      - Complete the function (starter → solution)
      - Fix the bug (broken code → working code)
      - Refactor (working but messy → clean code)
      - Design (requirements → architecture)
    grading: Automated (test cases pass/fail)

  finance-business:
    primary: scenario_analysis
    formats:
      - Calculate metrics from financial data
      - Analyze a case study and recommend action
      - Build a simple model (spreadsheet logic)
      - Compare two investment options with reasoning
    grading: AI-evaluated (Coach checks reasoning + numbers)

  economics:
    primary: graph_and_essay
    formats:
      - Draw/interpret supply-demand curves (describe in text)
      - Policy analysis: "What happens to X if Y changes?"
      - Data interpretation from real economic indicators
      - Short essay comparing two economic theories
    grading: AI-evaluated (Coach checks reasoning + economic logic)

  religious-studies:
    primary: source_interpretation
    formats:
      - Identify the source (passage → book/chapter/verse)
      - Explain a concept in your own words
      - Compare how two traditions approach the same question
      - Analyze a primary text passage (what does the author argue?)
    grading: AI-evaluated (Coach checks comprehension + textual accuracy)

  philosophy:
    primary: argumentative
    formats:
      - Reconstruct an argument in premise-conclusion form
      - Identify logical fallacies in a passage
      - Write a 200-word response to a philosophical claim
      - Steelman an opposing position
    grading: AI-evaluated (Coach checks logical structure + engagement)

  political-strategy:
    primary: policy_memo
    formats:
      - Write a 1-page policy brief
      - Stakeholder analysis matrix
      - Compare framework predictions for a scenario
      - Intelligence assessment with confidence levels
    grading: AI-evaluated (Coach checks analysis quality + evidence use)
```

### Exercise Difficulty Scaling

```yaml
difficulty_levels:
  beginner_courses:
    easy:     40% of exercises  # Recognition, recall, simple application
    medium:   40% of exercises  # Application, basic analysis
    hard:     20% of exercises  # Stretch goals, marked as "Challenge"

  advanced_courses:
    easy:     20% of exercises  # Warm-up, recall of foundations
    medium:   40% of exercises  # Analysis, synthesis
    hard:     40% of exercises  # Evaluation, creation, original work
```

---

## Step 5: Template Literal Escaping

### CRITICAL: Code Content in TypeScript Files

All lesson content is stored as TypeScript template literals (backtick strings).
These WILL BREAK if not escaped properly:

```yaml
escaping_rules:
  # Python f-strings: ${var} → \${var}
  python_fstrings:
    broken:  "content: `print(f\"Hello, ${name}\")`"
    correct: "content: `print(f\"Hello, \\${name}\")`"

  # C# string interpolation: ${var} → \${var}
  csharp_interpolation:
    broken:  "content: `Console.WriteLine($\"Hello, ${name}\")`"
    correct: "content: `Console.WriteLine($\"Hello, \\${name}\")`"

  # JavaScript template literals inside content: ${var} → \${var}
  nested_templates:
    broken:  "content: `const msg = `Hello ${name}``"
    correct: "content: `const msg = \\`Hello \\${name}\\``"

  # Backticks in markdown code fences: ``` → escaped or use ~~~
  code_fences:
    approach_1: "Use ~~~ instead of ``` for code fences inside template literals"
    approach_2: "Escape backticks: \\`\\`\\`"

  # General rule: ANY $ followed by { inside a template literal MUST be escaped
  test: "Search the generated file for unescaped ${. If found, fix before committing."
```

### Automated Check

After generating any lesson file, run this validation:

```bash
# Find unescaped template expressions in lesson files
grep -n '\$\{' src/data/<course-slug>/*.ts | grep -v '\\$\{' | grep -v 'import'
# If this returns any lines, those need escaping
```

---

## Step 6: Video Content Scripting

When `has_video: true` in the module context, generate a video script alongside the lesson:

### Video Script Template

```yaml
video_script:
  lesson_id: "<lesson-slug>"
  type: concept_explainer | code_walkthrough | source_analysis | case_study
  duration_target: "3-5 minutes"
  avatar: "<persona name from course-planning voice_personas>"

  scenes:
    - scene: 1
      type: avatar_intro
      duration: "15 seconds"
      narration: >
        "Welcome back to {course_title}. Today we're looking at {concept}.
        This is {important_because}."
      visual: Avatar facing camera, course title overlay

    - scene: 2
      type: content_display
      duration: "60-90 seconds"
      narration: >
        "{Explanation of concept — conversational, not reading the lesson text}"
      visual: |
        # For code: syntax-highlighted code appearing line by line
        # For text: key quotes or definitions on screen
        # For data: charts/tables with callout animations

    - scene: 3
      type: example_walkthrough
      duration: "60-90 seconds"
      narration: >
        "{Walk through the example step by step}"
      visual: |
        # Code: cursor highlighting relevant lines
        # Source text: passage with key phrases highlighted
        # Case study: data/chart with annotations

    - scene: 4
      type: summary
      duration: "15-20 seconds"
      narration: >
        "So the key takeaway is {takeaway}. Now try the exercise in the lesson
        to put this into practice. See you in the next one."
      visual: Avatar facing camera, key points bullet list overlay

  remotion_config:
    fps: 30
    width: 1920
    height: 1080
    background_theme: "{domain_color_theme}"
    avatar_position: "bottom-right"
    avatar_size: "25%"
    content_area: "top-left 70%"
    subtitle_style: "bottom-center, white on semi-transparent black"
    branding: "Samsara.ai watermark top-right corner, 10% opacity"
```

### Video Script Rules

1. **Never read the lesson text verbatim** — The video should EXPLAIN, not recite
2. **Conversational tone** — Like a 1-on-1 tutoring session, not a lecture hall
3. **Visual-first** — If you can show it, don't just say it
4. **3-5 minute target** — Shorter is better. Students can rewatch.
5. **End with action** — Always point them to the exercise or next lesson

---

## Step 7: Lesson Metadata Schema

Each lesson carries metadata used by the platform for gamification, voice coaching,
and recommendations:

```typescript
// This extends the base Lesson interface for platform features
// Stored alongside lesson content or in a separate metadata file

interface LessonMeta {
  lessonId: string;
  estimatedMinutes: number;          // 10-30 depending on level
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;                  // Base XP for completion
  firstAttemptBonus: number;         // Extra XP if no hints
  concepts: string[];                // Key concepts taught (for profile tracking)
  prerequisites: string[];           // Lesson IDs that should be completed first
  hasVideo: boolean;
  videoScriptId?: string;            // Reference to Remotion composition
  hasExercise: boolean;
  exerciseType?: string;             // From assessment types
  hintsAvailable: number;            // 0-3
  isCheckpoint: boolean;
  checkpointConfig?: {
    quizQuestionCount: number;
    passThreshold: number;           // 0-100
    voiceSummaryEnabled: boolean;
    coreConceptsForSummary: string[];
  };
  voiceMarkers: {
    sectionChecks: string[];         // Concepts the voice agent checks comprehension on
    exerciseIntroText: string;       // What the voice agent says when exercise starts
    keyInsight: string;              // The ONE thing the student should remember
  };
  citations: {
    source: string;
    type: 'primary' | 'secondary' | 'documentation';
    url?: string;
  }[];
  deeperReading: {
    title: string;
    author?: string;
    url?: string;
    description: string;
  }[];
}
```

---

## Step 8: Agent Swarm Parallelization

Lessons within a module can be generated in parallel by multiple agents, EXCEPT:

```yaml
parallelization_rules:
  can_parallelize:
    - Lessons within the SAME module (they share module context)
    - Video scripts (independent of lesson content generation)
    - Assessment questions (independent of lesson prose)

  must_be_sequential:
    - Lessons that reference previous lesson content ("As we saw in Lesson 2...")
    - Checkpoint quiz (needs to reference ALL module lessons)
    - Exercise difficulty scaling (needs to know what came before)

  coordination:
    - Each agent receives the FULL module_context
    - Each agent receives its specific lesson_index
    - Agents write to separate files, coordinator assembles module
    - Checkpoint lesson is ALWAYS generated last

  swarm_prompt_template: |
    You are Agent #{agent_number} in a Samsara.ai lesson generation swarm.

    INSTRUCTIONS: Follow the lesson-planning skill file exactly.

    MODULE CONTEXT:
    {module_context_yaml}

    YOUR ASSIGNMENT:
    Generate lesson #{lesson_index}: "{lesson_title}"

    CONSTRAINTS:
    - Output a single TypeScript Lesson object
    - Follow template {A|B|C|D|E} for {domain} domain
    - Level: {beginner|advanced}
    - Include voice markers as HTML comments
    - Escape all template literals per Step 5 rules
    - {if has_video} Also output a video script YAML block

    OUTPUT FORMAT:
    Return ONLY the TypeScript Lesson object, ready to paste into the module file.
```

---

## Step 9: Quality Checklist

Before finalizing any lesson, verify:

### Content Quality
- [ ] Lesson teaches exactly ONE clear concept
- [ ] Concept is explained before being exercised
- [ ] At least one concrete example before any abstraction
- [ ] All domain terms defined on first use (beginner) or contested terms defined (advanced)
- [ ] No filler paragraphs — every paragraph earns its place
- [ ] Citations present and correctly formatted per domain standard
- [ ] Deeper reading section includes 2-3 quality resources

### Technical Quality
- [ ] TypeScript Lesson object matches interface: `{ id, slug, title, content, starterCode?, solutionCode? }`
- [ ] `id` and `slug` are kebab-case, unique within the module
- [ ] `content` is valid markdown
- [ ] Template literals properly escaped (no unescaped `${`)
- [ ] Code examples compile/run correctly
- [ ] Test cases in starterCode/solutionCode actually test the right thing
- [ ] All code fences have language specifiers

### Voice Integration
- [ ] Voice markers present at section boundaries
- [ ] Exercise intro text written for voice agent
- [ ] Key insight identified for lesson summary
- [ ] Section check concepts listed (2-3 per lesson)

### Gamification
- [ ] XP reward assigned (base 10, adjusted for difficulty)
- [ ] First attempt bonus set (5 for medium/hard exercises)
- [ ] Hint count appropriate (0 for reading, 2-3 for exercises)
- [ ] Checkpoint config complete (if is_checkpoint)

### Video (if applicable)
- [ ] Video script follows template
- [ ] Narration is conversational, not reciting lesson text
- [ ] Duration target 3-5 minutes
- [ ] Avatar and visual instructions specified
- [ ] Remotion config block present

---

## Step 10: Example Output

### Example: Beginner Islam Lesson

```typescript
export const fivePillarsIntroLesson: Lesson = {
  id: 'five-pillars-intro',
  slug: 'five-pillars-intro',
  title: 'Introduction to the Five Pillars of Islam',
  content: `## What You'll Learn

- What the Five Pillars are and why they matter
- How they form the foundation of Muslim practice
- The difference between belief (iman) and practice (amal)

<!-- voice:section_check concept="five pillars as foundation" -->
## The Foundation of Practice

Imagine a house. Before you decorate it or fill it with furniture, you need
a strong foundation and solid walls. In Islam, the **Five Pillars** (Arkan
al-Islam, أركان الإسلام) are that foundation.

Every Muslim, regardless of culture, language, or country, shares these five
practices. They are what the Prophet Muhammad (peace be upon him) described
as the foundation of the faith.

> **Hadith — Sahih Bukhari, Book 2, Hadith 8**
> "Islam is built upon five [pillars]: the testimony that there is no god
> but Allah and Muhammad is the Messenger of Allah, establishing prayer,
> paying zakat, making the pilgrimage to the House, and fasting in Ramadan."

<!-- voice:section_check concept="listing all five pillars" -->
## The Five Pillars

| # | Pillar | Arabic | What It Means |
|---|--------|--------|---------------|
| 1 | Shahada | شهادة | Declaration of faith |
| 2 | Salah | صلاة | Five daily prayers |
| 3 | Zakat | زكاة | Charitable giving (2.5% of wealth) |
| 4 | Sawm | صوم | Fasting during Ramadan |
| 5 | Hajj | حج | Pilgrimage to Mecca (once in a lifetime) |

We'll explore each pillar in detail in the coming lessons. For now, notice
how they cover different aspects of life: faith (Shahada), worship (Salah),
social responsibility (Zakat), self-discipline (Sawm), and community (Hajj).

<!-- voice:key_insight insight="The Five Pillars connect personal faith to community practice" -->
## Why Pillars?

The word "pillar" (rukn, ركن) is deliberate. A pillar holds something up.
Remove one pillar and the structure weakens. Islamic scholars teach that
these five practices work together — prayer without charity is incomplete,
fasting without faith is just hunger.

> **Within the tradition:** Muslims understand the pillars as obligations
> (fard, فرض) from Allah, not suggestions. They are the minimum practice
> expected of every able Muslim.
>
> **Academic perspective:** Scholars like John Esposito (*Islam: The Straight
> Path*, Oxford, 2016, Ch. 2) note that the Five Pillars create a shared
> framework that unites 1.8 billion Muslims across enormous cultural diversity.

## Reflection Questions

1. Why do you think these five specific practices were chosen as the
   "pillars"? What do they have in common?
2. How does the metaphor of "pillars holding up a building" help you
   understand their role in Muslim life?
3. Can you think of similar foundational practices in other traditions
   you've encountered?

## Deeper Reading

- **Quran**: Surah Al-Baqarah (2):177 — a verse that connects faith, prayer,
  and charity together
- **Sachiko Murata & William Chittick**, *The Vision of Islam*, Paragon House,
  1994, Chapter 1 — excellent introduction to Islamic practice
- **BBC Religions**: "Five Pillars of Islam" — accessible overview with
  multimedia resources
`,
};
```

---

## Anti-Patterns

- **DO NOT** generate lessons without module context — you'll miss the field, level, and voice persona
- **DO NOT** cover more than one concept per lesson — split it
- **DO NOT** write exercises without a clear expected outcome
- **DO NOT** forget template literal escaping — this WILL break the build
- **DO NOT** use the same voice marker text for every section — be specific
- **DO NOT** write video narration that reads the lesson text — explain differently
- **DO NOT** skip citations for religious/philosophical content — credibility depends on sources
- **DO NOT** make checkpoint quizzes trivial — they feed the user's learning profile
- **DO NOT** generate all lessons sequentially if parallelization is possible — use the swarm
- **DO NOT** present religious content judgmentally — teach from within the tradition first
- **DO NOT** forget the `<!-- voice: -->` markers — the voice agent depends on them

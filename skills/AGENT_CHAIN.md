---
name: agent-chain-dynamic-content
description: >
  Chain prompt for AI agent swarms to execute when creating dynamic course content.
  Orchestrates: gap detection → research → course design → lesson generation → video scripting → embedding.
  Uses course-planning and lesson-planning skill files, Tavily search, and Gemini embeddings.
version: "1.0.0"
author: Samsara.ai
execution: sequential-then-parallel
estimated_duration: 30-60 minutes per course
---

# Agent Chain: Dynamic Course Creation

This chain prompt defines the exact sequence of steps an agent swarm executes
to create a complete course from scratch — from identifying what to build,
through research, to final content generation.

## Chain Overview

```
PHASE 1: Discovery (1 agent, sequential)
  → Identify content gap via embeddings
  → Validate demand via search
  → Determine domain/variation/level

PHASE 2: Research (1 agent, sequential)
  → Run Tavily searches for source material
  → Build source bibliography
  → Verify all citations

PHASE 3: Course Design (1 agent, sequential)
  → Execute course-planning skill
  → Output course skeleton
  → Define modules, checkpoints, gamification

PHASE 4: Lesson Generation (N agents, PARALLEL)
  → One agent per module
  → Each executes lesson-planning skill
  → Each runs 2+ Tavily searches per concept

PHASE 5: Assembly & Quality (1 agent, sequential)
  → Assemble all modules into course
  → Validate template literals
  → Run quality checklist
  → Generate course embeddings
  → Register in platform
```

---

## PHASE 1: Discovery Agent

**Agent count:** 1
**Input:** User demand signal OR admin request OR embedding gap detection
**Output:** Course specification parameters

```markdown
# DISCOVERY AGENT PROMPT

You are the Samsara.ai Discovery Agent. Your job is to determine WHAT course
to build and whether it's worth building.

## Step 1: Check Existing Coverage

Read the course registry at `src/data/index.ts`. List all existing courses.
Determine if the requested topic is already covered.

If covered → STOP. Report "Course already exists: {course_id}"
If partially covered → Note which aspects are missing
If not covered → Proceed

## Step 2: Validate Demand

Run 2 Tavily searches:
1. "{topic} online course demand learning"
2. "{topic} curriculum university syllabus"

Evaluate:
- Are there existing courses on this topic elsewhere? (validates demand)
- Is there enough source material to build 8-10 modules? (validates feasibility)
- Is there a natural beginner→advanced progression? (validates structure)

If insufficient material → STOP. Report "Insufficient source material for {topic}"
If sufficient → Proceed

## Step 3: Classify Course Parameters

Determine these values by reading skills/course-planning/SKILL.md Step 0:

```yaml
output:
  title: "<Course Title>"
  domain: "<one of 7 domains>"
  variation: "<specific variation>"
  level: "beginner" | "advanced"
  estimated_modules: <number>
  prerequisites: ["<course_ids>"]
  companion_courses: ["<course_ids>"]
  voice_persona: "<persona name>"
  justification: "<2-3 sentences on why this course should exist>"
```

Pass this output to PHASE 2.
```

---

## PHASE 2: Research Agent

**Agent count:** 1
**Input:** Course parameters from Phase 1
**Output:** Source bibliography + verified citations

```markdown
# RESEARCH AGENT PROMPT

You are the Samsara.ai Research Agent. Your job is to gather ALL source
material needed for a course BEFORE any content is written.

## Input
Course parameters from Discovery Agent:
- Title: {title}
- Domain: {domain}
- Variation: {variation}
- Level: {level}
- Estimated modules: {estimated_modules}

## Step 1: Module-Level Research

For each planned module topic, run Tavily searches (search_depth: "advanced"):

### Search Template by Domain

**Computer Science:**
- Search 1: "{module_topic} {language} official documentation tutorial"
- Search 2: "{module_topic} best practices production code examples"

**Finance/Business:**
- Search 1: "{module_topic} case study real company analysis"
- Search 2: "{module_topic} financial data example {current_year}"

**Economics:**
- Search 1: "{module_topic} economic theory empirical study"
- Search 2: "{module_topic} real world data policy impact"

**Religious Studies:**
- Search 1: "{tradition} {module_topic} scripture primary source"
- Search 2: "{tradition} {module_topic} scholarly commentary academic journal"
- Search 3: "{tradition} {module_topic} historical context"

**Philosophy:**
- Search 1: "{philosopher/school} {module_topic} primary text analysis"
- Search 2: "{module_topic} philosophical argument Stanford Encyclopedia"

**Political Strategy:**
- Search 1: "{module_topic} geopolitical analysis case study"
- Search 2: "{module_topic} policy document think tank report"

**Health & Wellness:**
- Search 1: "{module_topic} PubMed meta-analysis evidence-based"
- Search 2: "{module_topic} WHO CDC guidelines recommendations"

## Step 2: Build Source Bibliography

For each search result used, record:

```yaml
sources:
  - id: "src-001"
    title: "<exact title>"
    authors: "<author names>"
    publication: "<journal/book/site>"
    year: <year>
    url: "<verified URL>"
    type: "primary" | "secondary" | "documentation"
    relevant_to_modules: ["module-1", "module-3"]
    key_quotes:
      - quote: "<exact quote>"
        page_or_section: "<reference>"
    verified: true  # URL resolves, content matches
```

## Step 3: Verify Citations

For every source:
1. Confirm the URL resolves (not 404)
2. Confirm the author/title/year match the actual page
3. If URL is dead → search by author + title to find correct URL
4. If source can't be verified → mark as UNVERIFIED and find alternative

## Output

```yaml
research_output:
  course_title: "{title}"
  total_searches: <number>
  total_sources: <number>
  verified_sources: <number>
  unverified_sources: <number>
  bibliography: [<source objects>]
  module_source_map:
    module-1: ["src-001", "src-003", "src-007"]
    module-2: ["src-002", "src-004"]
    # ...
```

Pass this output to PHASE 3.
```

---

## PHASE 3: Course Design Agent

**Agent count:** 1
**Input:** Course parameters + Research bibliography
**Output:** Complete course skeleton with module structure

```markdown
# COURSE DESIGN AGENT PROMPT

You are the Samsara.ai Course Architect. Design the complete course structure.

## Instructions

1. Read `skills/course-planning/SKILL.md` in its entirety
2. Execute Steps 0-10 from the skill file using:
   - Course parameters from Discovery Agent
   - Source bibliography from Research Agent
3. Ground every module description in real sources from the bibliography

## Output Format

Produce a complete course specification:

```typescript
// Course skeleton — each lesson title is defined but content is empty
// Content will be filled by Phase 4 lesson agents

const courseSpec = {
  // TypeScript Course object
  course: {
    id: '<slug>',
    slug: '<slug>',
    title: '<title>',
    description: '<description>',
    icon: '<emoji>',
    tier: 'free' | 'pro',
    modules: [
      {
        id: '<module-slug>',
        title: '<Module Title>',
        description: '<description>',
        lessonCount: <number>,
        lessonTitles: ['Lesson 1', 'Lesson 2', ..., 'Checkpoint Quiz'],
        isLastLessonCheckpoint: true,
        sourcesUsed: ['src-001', 'src-003'],  // From bibliography
        hasVideo: [true, false, true, false],  // Per lesson
      },
      // ... more modules
    ],
  },

  // Gamification config
  gamification: {
    badges: [
      { name: '<Badge>', trigger: '<condition>', icon: '<emoji>' },
    ],
    xpPerModule: [<xp values>],
    checkpointConfig: {
      quizQuestionCount: 6,
      passThreshold: 70,
      voiceSummaryEnabled: true,
    },
  },

  // Voice persona
  voicePersona: {
    name: '<persona>',
    style: '<description>',
    greeting: '<greeting>',
  },

  // Prerequisites
  prerequisites: [
    { courseId: '<id>', reason: '<why>', required: <bool> },
  ],
  companions: [
    { courseId: '<id>', relationship: '<why>', timing: 'before|during|after' },
  ],

  // Module contexts for Phase 4 agents
  moduleContexts: [
    {
      course_id: '<slug>',
      course_title: '<title>',
      domain: '<domain>',
      variation: '<variation>',
      level: '<level>',
      module_id: '<module-slug>',
      module_title: '<Module Title>',
      module_index: 0,
      module_description: '<description>',
      lesson_titles: ['<titles>'],
      voice_persona: '<persona>',
      citation_standard: '<standard>',
      sources: ['<source objects for this module>'],
    },
    // ... one per module
  ],
};
```

Pass `moduleContexts` array to PHASE 4.
```

---

## PHASE 4: Lesson Generation Swarm (PARALLEL)

**Agent count:** 1 per module (6-12 agents running in parallel)
**Input:** Module context + sources from Phase 3
**Output:** Complete TypeScript module file with all lessons

```markdown
# LESSON AGENT PROMPT (dispatched per module)

You are Lesson Agent #{agent_number} in the Samsara.ai content swarm.
You are responsible for generating ALL lessons in module "{module_title}".

## Instructions

1. Read `skills/lesson-planning/SKILL.md` in its entirety
2. You have been assigned this module context:

```yaml
{module_context_yaml}
```

3. For EACH lesson in this module:

   a. Run 2+ Tavily searches for the lesson's core concept:
      - Search 1: "{concept} {domain-specific query 1}"
      - Search 2: "{concept} {domain-specific query 2}"

   b. Select the appropriate lesson template:
      - Template A (code-based) for computer-science
      - Template B (case-study) for finance/business/economics
      - Template C (source-analysis) for religious-studies/philosophy
      - Template D (strategic) for political-strategy
      - Template E (checkpoint) for the last lesson in the module
      - For health-wellness: use Template B with mandatory medical disclaimer

   c. Generate the lesson content incorporating:
      - Real sources from your Tavily searches
      - Sources from the pre-researched bibliography
      - Voice markers (<!-- voice: --> HTML comments)
      - Proper citation format for this domain

   d. If the lesson has video (check hasVideo array):
      - Generate a video script YAML block following the lesson-planning skill

   e. If this is the checkpoint lesson (last lesson):
      - Generate 5-8 quiz questions covering ALL module lessons
      - Define coreConceptsForSummary for voice evaluation
      - Include voice summary configuration

4. CRITICAL: Escape all template literals
   - Search generated content for unescaped ${
   - Escape as \${
   - Escape backticks inside template literals

## Output Format

```typescript
// File: src/data/{course-slug}/{NN}-{module-slug}.ts
import { Module } from '../types';

export const {moduleName}Module: Module = {
  id: '{module-slug}',
  title: '{Module Title}',
  description: '{description}',
  lessons: [
    {
      id: '{lesson-slug}',
      slug: '{lesson-slug}',
      title: '{Lesson Title}',
      content: `{full markdown content with voice markers}`,
      starterCode: `{if applicable}`,
      solutionCode: `{if applicable}`,
    },
    // ... more lessons
    // LAST lesson = checkpoint quiz
  ],
};
```

## Parallelization Rules
- You are ONE of {total_agents} agents running simultaneously
- Each agent handles ONE complete module
- Do NOT reference content from other modules (you don't have it)
- Use "As you'll learn in {other_module_title}..." for forward references
- Use "Building on earlier concepts..." for backward references
- The Assembly Agent (Phase 5) will stitch everything together
```

---

## PHASE 5: Assembly & Quality Agent

**Agent count:** 1
**Input:** All module files from Phase 4 + course skeleton from Phase 3
**Output:** Registered, validated, embedded course

```markdown
# ASSEMBLY AGENT PROMPT

You are the Samsara.ai Assembly Agent. You take all the pieces and
produce a finished, validated course.

## Step 1: Collect All Module Files

Gather outputs from all Phase 4 lesson agents:
- Module 1: {module_1_output}
- Module 2: {module_2_output}
- ...

## Step 2: Create Course Index File

```typescript
// src/data/{course-slug}/index.ts
import { Course } from '../types';
import { module1 } from './01-{module-1-slug}';
import { module2 } from './02-{module-2-slug}';
// ...

export const {courseName}Course: Course = {
  id: '{course-slug}',
  slug: '{course-slug}',
  title: '{Course Title}',
  description: '{description}',
  icon: '{emoji}',
  tier: '{free|pro}',
  modules: [module1, module2, ...],
};
```

## Step 3: Register Course

Add import and entry to `src/data/index.ts`:

```typescript
import { {courseName}Course } from './{course-slug}';

export const courses: Course[] = [
  // ... existing courses
  {courseName}Course,
];
```

## Step 4: Validate All Content

Run these checks on EVERY generated file:

### Template Literal Check
```bash
grep -rn '\$\{' src/data/{course-slug}/*.ts | grep -v '\\$\{' | grep -v 'import'
# Must return ZERO results
```

### Structure Check
- [ ] Every module has 3-7 lessons
- [ ] Last lesson of each module is a checkpoint
- [ ] All lesson IDs are unique kebab-case
- [ ] All lesson slugs match their IDs
- [ ] Content field is non-empty for all lessons
- [ ] StarterCode and solutionCode match (same test cases)

### Citation Check
- [ ] Every lesson has at least 1 cited source
- [ ] Religious lessons cite primary scripture with verse numbers
- [ ] Health lessons include medical disclaimer
- [ ] No fabricated citations (all from Tavily search results)

### Voice Marker Check
- [ ] Every lesson has <!-- voice:section_check --> markers
- [ ] Every lesson has <!-- voice:key_insight --> marker
- [ ] Exercise lessons have <!-- voice:exercise_intro --> marker
- [ ] Checkpoint lessons have voice summary config

## Step 5: Generate Course Embedding

```typescript
// Call Gemini embedding API for the new course
const courseText = [
  `Course: ${course.title}`,
  `Description: ${course.description}`,
  `Domain: ${domain}, Variation: ${variation}`,
  `Level: ${level}`,
  `Topics: ${course.modules.map(m => m.title).join(', ')}`,
].join('. ');

const embedding = await embedText(courseText);  // Gemini embedding-001

// Store in Supabase
await supabase.from('course_embeddings').upsert({
  course_id: course.id,
  title: course.title,
  domain,
  variation,
  level,
  embedding,  // vector(768)
});
```

## Step 6: Generate Video Scripts (if applicable)

For each lesson with hasVideo=true, compile the video script YAML
from the lesson agent output into a batch file for the Remotion pipeline:

```yaml
# scripts/video-batch-{course-slug}.yaml
videos:
  - lesson_id: "{lesson-slug}"
    narration: "{narration text}"
    avatar: "{persona}"
    duration_target: "3-5 min"
    visual_type: "concept_explainer | code_walkthrough | source_analysis"
```

## Step 7: Final Report

Output a summary:

```yaml
course_creation_report:
  course_id: "{slug}"
  title: "{title}"
  domain: "{domain}"
  variation: "{variation}"
  level: "{level}"
  modules_created: <number>
  lessons_created: <number>
  checkpoints: <number>
  total_tavily_searches: <number>
  total_citations: <number>
  videos_scripted: <number>
  template_literal_violations: 0  # Must be 0
  voice_markers_present: true
  embedding_stored: true
  registered_in_index: true
  status: "READY FOR REVIEW"
```
```

---

## Execution Example

### Trigger: "Create a beginner Sufism course"

```
Phase 1 (Discovery):
  → Searches confirm demand + sufficient material
  → Output: domain=religious-studies, variation=sufism, level=beginner

Phase 2 (Research):
  → 20 Tavily searches across Sufi topics
  → 15 verified sources: Rumi, Ibn Arabi, Al-Ghazali, academic commentaries
  → Bibliography with source IDs

Phase 3 (Course Design):
  → 8 modules: Origins, Key Figures, Practices, Poetry, Orders, Philosophy, Modern, Capstone
  → Gamification: Seeker → Student → Scholar → Guide badges
  → Voice persona: Sheikh Rumi
  → Prerequisites: None (beginner entry point)
  → Companion: Islam Fundamentals

Phase 4 (Lesson Swarm — 8 agents parallel):
  → Agent 1: Module "Origins of Sufism" — 4 lessons + checkpoint
  → Agent 2: Module "Key Figures" — 5 lessons + checkpoint
  → Agent 3: Module "Sufi Practices" — 4 lessons + checkpoint
  → ...
  → Each agent runs 2-3 Tavily searches per lesson
  → Each generates Template C (source-analysis) content

Phase 5 (Assembly):
  → Combines 8 modules into course
  → Validates all content (0 template literal violations)
  → Generates course embedding
  → Registers in src/data/index.ts
  → Status: READY FOR REVIEW
```

---

## Error Handling

```yaml
errors:
  tavily_no_results:
    action: Retry with broader query, then try Brave Search
    fallback: Mark as "Limited evidence" and note in lesson

  source_verification_failed:
    action: Search by author+title for correct URL
    fallback: Remove citation, note "Source could not be verified"

  agent_timeout:
    action: Retry the specific module agent
    fallback: Flag module for manual completion

  template_literal_violation:
    action: Auto-fix by escaping all unescaped ${ patterns
    verification: Re-run grep check after fix

  embedding_api_failure:
    action: Retry with exponential backoff (3 attempts)
    fallback: Skip embedding, flag for later batch processing
```

---

## Cost Estimate Per Course

```yaml
estimated_costs:
  tavily_searches: 40-80 searches × $0.01 = $0.40-$0.80
  gemini_embeddings: ~2000 tokens × $0.15/M = ~$0.001
  moonshot_llm: ~50K tokens × $0.002/K = ~$0.10
  total_api_cost: $0.50-$1.00 per course
  compute_time: 30-60 minutes with parallel agents
```

# Kimi Code Handoff — Samsara.ai Content Creation

> **When to read this:** When Claude's token budget runs out and you (Kimi) need to
> continue building courses, lessons, or platform features.
>
> **First:** Read `CLAUDE.md` in the project root for full platform context.
> **Then:** Follow the instructions below for content creation.

---

## Quick Start: Creating a Course

### 1. Read the Skill Files

Before writing any content, read these files in order:

```
skills/content-orchestrator/SKILL.md   ← Master quality pipeline (read first)
skills/course-planning/SKILL.md        ← Course structure and domains
skills/lesson-planning/SKILL.md        ← Lesson content templates
skills/cs-exercises/SKILL.md           ← CS-specific code exercise patterns
skills/video-generation/SKILL.md       ← Remotion video pipeline
skills/content-embedding/SKILL.md      ← Gemini embeddings and RAG
skills/AGENT_CHAIN.md                  ← Agent swarm orchestration
```

### 2. Use the MCP Server (Optional)

If you have MCP tool access, use these tools:

```bash
# Install and start MCP server
cd mcp-samsara && npm install && npm run dev
```

**Tools available:**

| Tool | What It Does |
|------|-------------|
| `samsara_orchestrate` | Full 10-step course creation pipeline |
| `samsara_plan_course` | Design course skeleton |
| `samsara_plan_lesson` | Generate lesson content |
| `samsara_embed_content` | Create Gemini embeddings |
| `samsara_semantic_search` | Search existing content |
| `samsara_rag_query` | RAG pipeline for grounded content |
| `samsara_generate_video` | Remotion video pipeline |
| `samsara_list_domains` | Show all 7 domains |
| `samsara_get_skill` | Read any skill file |

### 3. Without MCP: Manual Steps

If MCP isn't available, follow this sequence manually:

---

## Step-by-Step: Create a Lesson (Without MCP)

### Step A: Get Module Context

You need this info before writing anything:

```yaml
module_context:
  course_id: "<slug>"           # e.g., "python-dsa-beginner"
  course_title: "<title>"       # e.g., "Python DSA for Beginners"
  domain: "<domain>"            # e.g., "computer-science"
  variation: "<variation>"      # e.g., "data-science"
  level: "beginner"             # or "advanced"
  module_id: "<module-slug>"    # e.g., "hash-maps"
  module_title: "<title>"       # e.g., "Hash Maps & Dictionaries"
  module_index: 0               # 0-based position
  lesson_title: "<title>"       # e.g., "What Is a Hash Map?"
  lesson_index: 0               # 0-based within module
  is_checkpoint: false          # true only for last lesson
  voice_persona: "Coach Alex"   # From course-planning skill
```

### Step B: Research (Tavily Search)

Run 2+ searches per concept:

```
Search 1: "{concept} Python tutorial documentation"
Search 2: "{concept} real-world example application"
```

Use results for citations and examples. Never fabricate sources.

### Step C: Write Content

Select template from `skills/lesson-planning/SKILL.md`:
- **Template A** (code-based) for CS courses
- **Template B** (case-study) for Finance/Business
- **Template C** (source-analysis) for Religion/Philosophy
- **Template D** (strategic) for Political Strategy
- **Template E** (checkpoint) for module quizzes

### Step D: Write Exercise (CS Only)

Follow `skills/cs-exercises/SKILL.md`:

```typescript
{
  id: 'lesson-slug',
  slug: 'lesson-slug',
  title: 'Lesson Title',
  content: `## Markdown content with voice markers...`,
  starterCode: `
def function_name(params):
    """Docstring with args, returns, example."""
    # TODO: Description without giving away the answer
    pass

# ─── Test Cases ───
print(function_name(input1))  # Expected: output1
print(function_name(input2))  # Expected: output2
print(function_name(edge))    # Expected: edge_output
`,
  solutionCode: `
def function_name(params):
    """Docstring with complexity analysis."""
    # Clean implementation
    return result

# ─── Test Cases ─── (IDENTICAL to starterCode)
print(function_name(input1))  # Expected: output1
print(function_name(input2))  # Expected: output2
print(function_name(edge))    # Expected: edge_output
`,
}
```

### Step E: Add Voice Markers

Insert these HTML comments in the lesson content:

```html
<!-- voice:section_check concept="specific concept name" -->
<!-- voice:key_insight insight="the ONE thing to remember" -->
<!-- voice:exercise_intro difficulty="easy|medium|hard" hints_available="3" -->
```

### Step F: Escape Template Literals

**CRITICAL** — will break the build if missed:

```
Python f-strings:  ${var}  → \${var}
Nested backticks:  `code`  → \`code\`
Code fences:       ```     → \`\`\` (or use ~~~)
```

Validate after writing:

```bash
grep -n '\$\{' src/data/<slug>/*.ts | grep -v '\\$\{' | grep -v 'import'
# Must return ZERO results
```

### Step G: Register the Course

```typescript
// src/data/<course-slug>/index.ts
import { Course } from '../types';
import { module1 } from './01-module-name';

export const myCourseCourse: Course = {
  id: 'my-course',
  slug: 'my-course',
  title: 'My Course Title',
  description: 'Description for catalog',
  icon: '📚',
  tier: 'free',
  modules: [module1],
};

// Then add to src/data/index.ts:
import { myCourseCourse } from './my-course';
// Add to courses array
```

---

## Quality Reference: Sample Module

See `skills/cs-exercises/examples/sample-hash-map-module.ts` for a complete
example of what a high-quality CS module looks like. Use it as your benchmark.

Key quality markers:
- ONE concept per lesson, taught completely
- Example before abstraction
- Voice markers at section boundaries
- 3+ test cases per exercise (normal + edge + tricky)
- Identical test cases in starterCode and solutionCode
- Complexity analysis in solution docstring
- Multi-language examples in content (Python + Java)
- Citations to real resources

---

## Domains and Variations

```
computer-science:    systems-programming, web-development, ai-ml, data-science,
                     devops-cloud, interview-prep, game-development, security
finance-business:    personal-finance, corporate-finance, quantitative-finance,
                     accounting, investment-banking, entrepreneurship
economics:           microeconomics, macroeconomics, behavioral-economics,
                     international-economics, political-economy
religious-studies:   islam, ahmadiyya-islam, christianity, judaism, buddhism,
                     hinduism, sikhism, taoism, confucianism, sufism
philosophy:          western-ancient, western-modern, eastern-philosophy, ethics,
                     logic-critical-thinking, political-philosophy
political-strategy:  geopolitics, international-relations, campaign-strategy,
                     public-policy, diplomacy-negotiation
health-wellness:     mental-health, physical-fitness, nutrition, sleep-science,
                     stress-management, meditation-mindfulness
```

---

## Remotion Videos (Using Moonshot API)

When creating video content, use Moonshot API (Kimi K2) for narration — NOT Claude:

```typescript
const resp = await fetch('https://api.moonshot.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'kimi-k2-turbo-preview',
    messages: [{
      role: 'system',
      content: `Convert this lesson into a 3-5 minute conversational narration.
DO NOT read the text verbatim — explain it like tutoring someone 1-on-1.
Mark visuals with [SHOW: description] and pauses with [PAUSE].`
    }, {
      role: 'user',
      content: lessonContent
    }],
    max_tokens: 800,
  }),
});
```

---

## Checkpoint A/B Testing Config

During soft launch, use lenient settings:

```yaml
pass_threshold: 50%        # NOT 70% — we want people to progress
voice_summary: optional    # Don't block on voice
failure_message: "Let's review a couple things!"  # NEVER "Failed"
xp_for_attempting: 10      # Reward effort
retry: unlimited           # Always allow retry
```

---

## Common Mistakes to Avoid

1. **Unescaped template literals** — grep for `${` before committing
2. **Different test cases** in starter vs solution — they MUST match
3. **Fabricated citations** — every source must come from a real search
4. **Generic voice markers** — `concept="the concept"` is useless, be specific
5. **Videos that read the lesson** — narration must EXPLAIN differently
6. **Exercises testing memorization** — test understanding, not recall
7. **Mixing levels** — don't put advanced content in a beginner course
8. **Missing edge cases** — always test empty input, single element, zero

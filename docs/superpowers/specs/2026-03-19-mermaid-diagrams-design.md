# Mermaid Diagrams for All 26 Featured Courses

**Date:** 2026-03-19
**Status:** Design approved, ready for implementation

## Overview

Add Mermaid diagrams to all 26 featured courses where lessons benefit from visual explanation. Mermaid rendering is already production-ready in the codebase (`MermaidDiagram.tsx`).

## Diagram Types by Domain

### Computer Science (9 courses) — ~80 diagrams
**Diagram types:** flowcharts, graph structures, sequence diagrams, state machines

| Course | Slug | Diagram Opportunities |
|--------|------|----------------------|
| Grokking Coding Interview | `coding-interview` | Pattern visualizations for each of 9 patterns (Two Pointers, Sliding Window, BFS/DFS, etc.). Show pointer movement, window sliding, tree traversal order. ~18 diagrams (2 per pattern intro + key problem). |
| Grokking Premium | `coding-interview-premium` | Same 9 patterns with more advanced visualizations. ~18 diagrams. Already has 2. |
| Grokking DSA Python | `grokking-dsa-python` | Data structure shapes: linked list, BST, hash table chaining, stack/queue ops. ~10 diagrams. |
| Data Structures & Algo | `data-structures-algorithms` | BST operations, graph traversal, sorting algorithm steps, DP table. Already has 1. ~12 diagrams. |
| System Design | `system-design` | Architecture diagrams for each system (URL shortener, Instagram, Twitter, etc.). Request flow, component interaction. ~14 diagrams. |
| Python Fundamentals | `python-fundamentals` | Control flow decision trees, loop flowcharts, OOP class hierarchy. ~5 diagrams. |
| AP CS A | `ap-cs-a` | Inheritance hierarchy, array indexing, 2D array traversal. ~5 diagrams. |
| AP CS Principles | `ap-cs-principles` | Internet packet routing, algorithm flowcharts, binary conversion. ~4 diagrams. |
| AI/ML Fundamentals | `ai-ml-fundamentals` | Neural network layer diagram, training loop, decision tree, confusion matrix flow. ~6 diagrams. |

### Religious Studies (10 courses) — ~30 diagrams
**Diagram types:** timelines, concept maps, hierarchies, relationship diagrams

| Course | Slug | Diagram Opportunities |
|--------|------|----------------------|
| Islam Foundations | `islam-foundations` | Five Pillars hierarchy, Quran compilation timeline, branches of faith (Iman) tree. ~4 diagrams. |
| Buddhism | `buddhism-foundations` | Four Noble Truths → Eightfold Path flow, meditation traditions tree. ~3 diagrams. |
| Christianity | `christian-theology` | Denominations tree, salvation theology flow, Old/New Testament relationship. ~3 diagrams. |
| Hinduism | `hinduism-foundations` | Four paths of yoga, caste/varna system, scripture hierarchy. ~3 diagrams. |
| Judaism | `judaism-foundations` | Torah/Tanakh/Talmud hierarchy, denomination tree, holiday calendar cycle. ~3 diagrams. |
| Sikhism | `sikhism-foundations` | Ten Gurus timeline, Five Ks diagram, Khalsa initiation flow. ~3 diagrams. |
| Sufism | `sufism-foundations` | Sufi orders tree, spiritual stations (maqamat) path, tariqa lineages. ~3 diagrams. |
| Taoism | `taoism-foundations` | Yin-Yang concept map, Wu Wei decision flow, Taoist practice hierarchy. ~2 diagrams. |
| Confucianism | `confucianism-foundations` | Five Relationships diagram, virtue hierarchy, Neo-Confucian schools. ~3 diagrams. |
| Ahmadiyya | `ahmadiyya-foundations` | Khilafat succession timeline, organizational structure, belief distinctions. ~3 diagrams. |

### Finance & Business (1 course) — ~8 diagrams
**Diagram types:** flowcharts, decision trees, process flows

| Course | Slug | Diagram Opportunities |
|--------|------|----------------------|
| Personal Finance | `personal-finance` | Budget flow (income → needs/wants/savings), debt snowball vs avalanche, compound interest growth, retirement planning decision tree, tax bracket flow. ~8 diagrams. |

### Health & Wellness (4 courses) — ~15 diagrams
**Diagram types:** cycles, process flows, mind maps

| Course | Slug | Diagram Opportunities |
|--------|------|----------------------|
| Mental Health | `mental-health-resilience` | Stress response cycle (fight/flight/freeze), CBT thought triangle, anxiety loop, resilience building process. ~5 diagrams. |
| Meditation | `meditation-mindfulness` | Meditation types tree, breath awareness cycle, mindfulness practice flow. ~3 diagrams. |
| Intro Psychology | `intro-psychology` | Scientific method flow, neuron structure, classical conditioning, memory model. ~4 diagrams. |
| AP Biology | `ap-biology` | Cell structure, mitosis stages, DNA replication, photosynthesis/respiration cycle. ~5 diagrams (note: some may need simplified representations since Mermaid doesn't do biological diagrams natively). |

### Philosophy (2 courses) — ~6 diagrams

| Course | Slug | Diagram Opportunities |
|--------|------|----------------------|
| Stoic Philosophy | `stoic-philosophy` | Dichotomy of control decision tree, Stoic virtues hierarchy, morning/evening routine flow. ~3 diagrams. |
| World History | `world-history` | Civilization timeline, revolution causes flowchart, empire rise/fall pattern. ~3 diagrams. |

## Total Estimate: ~139 diagrams

## Implementation Strategy

### Phase approach (6 phases, parallelizable within each)

**Phase 1: CS Interview & DSA (4 courses, ~58 diagrams)**
- `coding-interview` — 9 pattern modules
- `coding-interview-premium` — 9 pattern modules
- `grokking-dsa-python` — 6 data structure modules
- `data-structures-algorithms` — 8 modules

**Phase 2: System Design & AI (2 courses, ~20 diagrams)**
- `system-design` — 9 system design case studies
- `ai-ml-fundamentals` — 8 modules

**Phase 3: CS Fundamentals (3 courses, ~14 diagrams)**
- `python-fundamentals` — 10 modules
- `ap-cs-a` — 9 modules
- `ap-cs-principles` — 8 modules

**Phase 4: Religious Studies (10 courses, ~30 diagrams)**
- All 10 religion/philosophy courses

**Phase 5: Finance & Health (5 courses, ~23 diagrams)**
- `personal-finance` — 7 modules
- `mental-health-resilience` — 7 modules
- `meditation-mindfulness` — 7 modules
- `intro-psychology` — 8 modules
- `ap-biology` — 8 modules

**Phase 6: Philosophy & History (2 courses, ~6 diagrams)**
- `stoic-philosophy` — 7 modules
- `world-history` — 8 modules

## Diagram Placement Rules

1. **Where to add:** Pattern intro lessons, concept explanation lessons, comparison lessons, process/flow lessons
2. **Where NOT to add:** Exercise-only lessons, capstone/quiz lessons, lessons that are purely narrative/story
3. **Position:** After the concept explanation paragraph, before the code example or practice section
4. **Size:** Keep diagrams concise (max 15-20 nodes). Complex topics get multiple small diagrams rather than one large one.

## Mermaid Syntax Patterns to Use

```markdown
<!-- Pattern visualization (coding) -->
graph LR
  A[Start] --> B{Condition}
  B -->|Yes| C[Action]
  B -->|No| D[Other]

<!-- Hierarchy (religion, philosophy) -->
graph TD
  Root --> Child1
  Root --> Child2
  Child1 --> Grandchild

<!-- Timeline -->
graph LR
  A[Event 1<br/>Date] --> B[Event 2<br/>Date] --> C[Event 3<br/>Date]

<!-- Process/Cycle -->
graph TD
  A --> B --> C --> D --> A

<!-- Decision tree -->
graph TD
  Q{Question?}
  Q -->|Option A| R1[Result A]
  Q -->|Option B| R2[Result B]
```

## Styling

Use Mermaid's default styling — the `MermaidDiagram.tsx` component already applies theme-aware colors. Do NOT add inline styles to keep diagrams clean.

## Technical Notes

- Diagrams are embedded in lesson `content` fields as ` ```mermaid ` code blocks
- Content is in TypeScript template literals — escape `${}` and backticks
- The Mermaid block must be on its own line, separated by blank lines from surrounding text
- Test with `npm run dev` to verify rendering
- Existing examples in `coding-interview-premium/01-two-pointers.ts` and `data-structures-algorithms/05-trees.ts`

## Agent Execution Plan

Each phase should be executed by a subagent that:
1. Reads each lesson's content
2. Identifies the best insertion point (after concept explanation, before code)
3. Generates a relevant Mermaid diagram
4. Edits the lesson file to insert the diagram
5. Verifies the TypeScript still compiles

Phases can run in parallel (different courses, no file conflicts).

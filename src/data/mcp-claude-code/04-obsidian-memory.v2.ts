import { Module } from "../types";

export const obsidianMemoryModule: Module = {
  id: "obsidian-memory",
  title: "Obsidian as AI Memory Layer",
  description: "Learn how to use Obsidian vaults as a persistent, structured memory layer for Claude Code — the foundation of codeswitcher's Second Brain architecture.",
  lessons: [
    {
      id: "obsidian-knowledge-base",
      slug: "obsidian-knowledge-base",
      title: "Obsidian Vault as Knowledge Base",
      content: `## Obsidian Vault as Knowledge Base

Obsidian is a Markdown-based note-taking tool with one property that makes it uniquely suited for AI memory: **every file is plain text**. Claude Code can read, search, and write Markdown directly — no API, no database, no serialization layer.

### Vault Structure for AI Consumption

A well-designed vault separates concerns into folders that mirror knowledge types:

\`\`\`
vault/
├── entities/          # People, companies, products
│   ├── bilal.md
│   └── acme-corp.md
├── decisions/         # Architecture decision records (ADRs)
│   └── 2026-03-use-supabase.md
├── conversations/     # Summaries of key sessions
│   └── 2026-03-11-onboarding.md
├── skills/            # Capabilities and preferences
│   └── SKILL.md
└── context/           # Project-level background
    └── grokking-platform.md
\`\`\`

### Frontmatter Schema Design

YAML frontmatter at the top of each file is the primary handle for programmatic search. Keep it consistent so Claude (and your own scripts) can query reliably:

\`\`\`markdown
---
type: entity
tags: [client, active, saas]
name: Bilal Hussein
email: bilal@example.com
last_updated: 2026-03-11
related: [[acme-corp]], [[grokking-platform]]
---
\`\`\`

Schema design principles:
- **\`type\`** is mandatory — use it for coarse filtering (\`entity\`, \`decision\`, \`conversation\`, \`skill\`)
- **\`tags\`** are for cross-cutting concerns (\`active\`, \`saas\`, \`priority-high\`)
- **\`related\`** uses wikilinks so the Obsidian graph stays connected
- **\`last_updated\`** lets Claude prioritize recent context

### Linking Strategy: Wikilinks vs Tags vs Folders

| Strategy | Best For | Limitation |
|----------|----------|------------|
| \`[[wikilinks]]\` | Explicit relationships between named entities | Requires exact filename match |
| \`#tags\` | Cross-cutting categories | No hierarchy — \`#client\` and \`#client/active\` are separate |
| Folders | Coarse type separation | Poor for many-to-many relationships |

**Recommended approach:** folders for type, frontmatter tags for attributes, wikilinks for named relationships. This gives Claude three independent axes to filter on.

### What Claude Can Do With This

When Claude reads a well-structured vault before starting a task, it can:
- Identify which entities are relevant to the current request
- Load only the files that match the active context (tag filtering)
- Follow wikilinks to pull in related background
- Write new files or update frontmatter after completing tasks

The exercise below builds the search layer that makes this possible.`,
      starterCode: `// Obsidian Vault Tag Search
// Given a mock vault (array of file objects), implement a function
// that finds all files matching a given tag query.

// Each file has: { path, frontmatter: { type, tags, name, ... }, body }

const mockVault = [
  {
    path: "entities/bilal.md",
    frontmatter: { type: "entity", tags: ["client", "active"], name: "Bilal Hussein" },
    body: "Primary client for the grokking platform project.",
  },
  {
    path: "entities/acme-corp.md",
    frontmatter: { type: "entity", tags: ["company", "active"], name: "Acme Corp" },
    body: "Parent company of the client.",
  },
  {
    path: "decisions/2026-03-use-supabase.md",
    frontmatter: { type: "decision", tags: ["database", "infrastructure"], name: "Use Supabase" },
    body: "Chose Supabase for auth and row-level security.",
  },
  {
    path: "skills/SKILL.md",
    frontmatter: { type: "skill", tags: ["memory", "active"], name: "Memory Protocol" },
    body: "How Claude reads and writes memory files.",
  },
  {
    path: "conversations/2026-03-11-onboarding.md",
    frontmatter: { type: "conversation", tags: ["onboarding", "client"], name: "Onboarding Session" },
    body: "Discussed platform goals and initial architecture.",
  },
];

/**
 * Search vault files by tag(s).
 * @param {typeof mockVault} vault - array of file objects
 * @param {string[]} tags - ALL of these tags must be present in a file's frontmatter.tags
 * @returns {typeof mockVault} matching files
 */
function searchByTags(vault, tags) {
  // YOUR CODE HERE
}

/**
 * Search vault files by type.
 * @param {typeof mockVault} vault
 * @param {string} type - must match frontmatter.type exactly
 * @returns {typeof mockVault} matching files
 */
function searchByType(vault, type) {
  // YOUR CODE HERE
}

/**
 * Combined search: files that match the type AND all of the tags.
 * Either filter is optional — pass null to skip it.
 * @param {typeof mockVault} vault
 * @param {string|null} type
 * @param {string[]} tags
 * @returns {typeof mockVault} matching files
 */
function searchVault(vault, type, tags) {
  // YOUR CODE HERE
}

// Test cases
console.log("--- searchByTags(['active']) ---");
const activeFiles = searchByTags(mockVault, ["active"]);
console.log(activeFiles.map(f => f.path));
// Expected: ["entities/bilal.md", "entities/acme-corp.md", "skills/SKILL.md"]

console.log("\\n--- searchByTags(['client', 'active']) ---");
const clientActive = searchByTags(mockVault, ["client", "active"]);
console.log(clientActive.map(f => f.path));
// Expected: ["entities/bilal.md"]

console.log("\\n--- searchByType('entity') ---");
const entities = searchByType(mockVault, "entity");
console.log(entities.map(f => f.path));
// Expected: ["entities/bilal.md", "entities/acme-corp.md"]

console.log("\\n--- searchVault('entity', ['active']) ---");
const activeEntities = searchVault(mockVault, "entity", ["active"]);
console.log(activeEntities.map(f => f.path));
// Expected: ["entities/bilal.md", "entities/acme-corp.md"]

console.log("\\n--- searchVault(null, ['client']) ---");
const allClient = searchVault(mockVault, null, ["client"]);
console.log(allClient.map(f => f.path));
// Expected: ["entities/bilal.md", "conversations/2026-03-11-onboarding.md"]
`,
      solutionCode: `// Obsidian Vault Tag Search — Solution

const mockVault = [
  {
    path: "entities/bilal.md",
    frontmatter: { type: "entity", tags: ["client", "active"], name: "Bilal Hussein" },
    body: "Primary client for the grokking platform project.",
  },
  {
    path: "entities/acme-corp.md",
    frontmatter: { type: "entity", tags: ["company", "active"], name: "Acme Corp" },
    body: "Parent company of the client.",
  },
  {
    path: "decisions/2026-03-use-supabase.md",
    frontmatter: { type: "decision", tags: ["database", "infrastructure"], name: "Use Supabase" },
    body: "Chose Supabase for auth and row-level security.",
  },
  {
    path: "skills/SKILL.md",
    frontmatter: { type: "skill", tags: ["memory", "active"], name: "Memory Protocol" },
    body: "How Claude reads and writes memory files.",
  },
  {
    path: "conversations/2026-03-11-onboarding.md",
    frontmatter: { type: "conversation", tags: ["onboarding", "client"], name: "Onboarding Session" },
    body: "Discussed platform goals and initial architecture.",
  },
];

function searchByTags(vault, tags) {
  return vault.filter(file =>
    tags.every(tag => file.frontmatter.tags.includes(tag))
  );
}

function searchByType(vault, type) {
  return vault.filter(file => file.frontmatter.type === type);
}

function searchVault(vault, type, tags) {
  return vault.filter(file => {
    const typeMatch = type === null || file.frontmatter.type === type;
    const tagsMatch = tags.every(tag => file.frontmatter.tags.includes(tag));
    return typeMatch && tagsMatch;
  });
}

// Test cases
console.log("--- searchByTags(['active']) ---");
const activeFiles = searchByTags(mockVault, ["active"]);
console.log(activeFiles.map(f => f.path));
// Expected: ["entities/bilal.md", "entities/acme-corp.md", "skills/SKILL.md"]

console.log("\\n--- searchByTags(['client', 'active']) ---");
const clientActive = searchByTags(mockVault, ["client", "active"]);
console.log(clientActive.map(f => f.path));
// Expected: ["entities/bilal.md"]

console.log("\\n--- searchByType('entity') ---");
const entities = searchByType(mockVault, "entity");
console.log(entities.map(f => f.path));
// Expected: ["entities/bilal.md", "entities/acme-corp.md"]

console.log("\\n--- searchVault('entity', ['active']) ---");
const activeEntities = searchVault(mockVault, "entity", ["active"]);
console.log(activeEntities.map(f => f.path));
// Expected: ["entities/bilal.md", "entities/acme-corp.md"]

console.log("\\n--- searchVault(null, ['client']) ---");
const allClient = searchVault(mockVault, null, ["client"]);
console.log(allClient.map(f => f.path));
// Expected: ["entities/bilal.md", "conversations/2026-03-11-onboarding.md"]
`,
    },
    {
      id: "persistent-memory-claude",
      slug: "persistent-memory-claude",
      title: "Persistent Memory for Claude Code",
      content: `## Persistent Memory for Claude Code

### The Problem: No Memory Between Sessions

Claude Code starts every session cold. It has no recollection of the codebase decisions you made last week, the client preferences you described yesterday, or the architectural constraints you agreed on last month. Each new conversation begins from scratch unless you explicitly provide context.

This is not a flaw — it is a deliberate design. Stateless inference is safer and more predictable. But it creates a real operational problem for teams using Claude Code on long-running projects.

### The Solution: Obsidian as External Memory

The answer is to treat memory as a **file system concern**, not a model concern. You own the memory; Claude reads it on demand and writes back what it learns.

Obsidian is the ideal storage medium because:
- Files are plain Markdown — Claude reads them natively
- Frontmatter is structured — Claude can filter without parsing prose
- The vault is local — no API, no latency, no dependency on a third-party service
- You can read and edit the memory yourself — full transparency and control

### Memory File Patterns

**Entity files** capture stable facts about people, companies, and systems:

\`\`\`markdown
---
type: entity
tags: [client, active]
name: Bilal Hussein
timezone: America/Chicago
preferred_stack: Next.js, Supabase, TypeScript
---
Bilal is the founder of the grokking platform. He prefers concise responses
and dislikes unnecessary preamble. Always lead with the answer.
\`\`\`

**Decision records** capture *why* choices were made — the reasoning that disappears from code:

\`\`\`markdown
---
type: decision
date: 2026-03-11
tags: [database, auth]
status: accepted
---
## Decision: Use Supabase for Auth

Chosen over Firebase because of row-level security (RLS) and the Postgres
foundation. Firebase's NoSQL model would require denormalization that conflicts
with the relational data model for classrooms and sessions.
\`\`\`

**Conversation logs** capture the key conclusions from a session, not the full transcript:

\`\`\`markdown
---
type: conversation
date: 2026-03-11
tags: [onboarding, architecture]
---
## Session: Platform Architecture Review

- Agreed on glassmorphism dark theme across all views
- Voice coach uses ElevenLabs TTS, Gemini fallback for LLM
- Do NOT use server-side rendering for IDE panel — client-only
\`\`\`

### The SKILL.md Pattern

A \`SKILL.md\` file (or \`CLAUDE.md\` in some conventions) is a special file that tells Claude how to use the memory system itself. It contains:

- Which folders to read at session start
- Which file to append new learnings to
- How to format new entity files
- What NOT to write (private keys, personal data)

This is the meta-layer: memory about how to manage memory.

### How codeswitcher's Memory System Works

codeswitcher — the AI-powered workflow system built on this architecture — follows a three-phase loop every session:

1. **Read phase:** Claude reads the \`SKILL.md\` file, then loads tagged entity files and recent conversation logs relevant to the current task
2. **Work phase:** Claude performs the requested task using the loaded context, making decisions consistent with recorded preferences and constraints
3. **Write phase:** After completing the task, Claude appends a brief conversation log entry and updates any entity files with new facts it learned

This loop means the system gets progressively smarter about a client or codebase over time — without any fine-tuning, embeddings, or infrastructure beyond a folder of text files.

### Interview-Ready Architecture Explanation

If asked about this in a system design interview:

> "We implement persistent AI context as a structured file system. Each session, the agent reads a curated set of Markdown files — entity profiles, decision records, and recent logs — then writes a summary back after completing the task. This gives us temporal context without fine-tuning, full auditability because every memory is a readable file, and zero infrastructure cost. It trades query speed (linear file scan) for simplicity and portability."

That framing — trade-offs stated clearly, no buzzwords — is what interviewers at AI product companies are looking for.`,
    },
    {
      id: "context-retrieval-voice",
      slug: "context-retrieval-voice",
      title: "Context Retrieval & Voice Governance",
      content: `## Context Retrieval & Voice Governance

### RAG Without Embeddings

Retrieval-Augmented Generation (RAG) is typically described as: chunk documents → embed chunks → store vectors → retrieve by cosine similarity → inject into prompt. This pipeline is powerful but requires infrastructure: a vector database, an embedding model, an orchestration layer.

For many use cases, especially those involving structured notes about known entities, you can get 80% of the benefit with a much simpler approach: **tag-based frontmatter retrieval**.

The retrieval algorithm is:

1. Identify the active context from the current request (which client? which project? which topic?)
2. Load all vault files whose frontmatter \`tags\` intersect with the active context
3. For each loaded file, check the \`type\` field and include or exclude based on relevance
4. Concatenate the file bodies into a context block and prepend it to the prompt

This is O(n) over the vault size, which is fine when the vault has hundreds of files. At thousands of files, you add a simple inverted index (a JSON map of tag → file paths) to make step 2 O(1). You still never need embeddings.

### The 6-Layer Voice Governance System

When Claude drafts a response — an email, a Slack message, a report — it needs to know not just *what* to say but *how* to say it. "Voice" is not a single setting; it is a stack of constraints that compose:

| Layer | Question | Example Value |
|-------|----------|---------------|
| **Personality** | Who is the sender? | Bilal — direct, analytical, no filler words |
| **Tone** | What is the emotional register? | Professional but warm; never corporate-stiff |
| **Audience** | Who is the recipient? | A non-technical founder; avoid jargon |
| **Channel** | Where will this be read? | Email (full sentences) vs Slack (fragments OK) |
| **Context** | What just happened? | Following up after a missed deadline |
| **Constraints** | What must never appear? | No passive voice; no "hope this finds you well" |

Each layer is stored as frontmatter in a vault file. When Claude is asked to draft a response, it loads the sender's entity file (layers 1–2), the recipient's entity file (layer 3), and the channel/context file (layers 4–6), then composes the voice from those six inputs before writing a single word.

### Connecting Email Context to Vault to Draft

Here is the full data flow for a voice-governed email draft in codeswitcher:

\`\`\`
1. New email arrives in Missive (client inbox tool)
        ↓
2. Webhook fires → extracts: sender, subject, thread summary
        ↓
3. Vault lookup: searchVault(vault, "entity", [sender_tag])
   → loads sender's entity file (preferences, relationship history)
        ↓
4. Vault lookup: searchVault(vault, "context", [project_tag])
   → loads active project context (current status, open issues)
        ↓
5. Voice file loaded: sender_entity.frontmatter.voice_profile
   → resolves all 6 governance layers
        ↓
6. Prompt assembled:
   [voice constraints] + [sender context] + [project context] + [email thread]
        ↓
7. Claude drafts reply → returned to Missive as a draft
\`\`\`

The vault is the connective tissue. Without it, step 3–5 either doesn't happen (Claude drafts generically) or requires a human to paste the context manually every time. With it, the draft arrives in Missive pre-populated with the right tone, the right references, and the right level of technical detail for that specific recipient.

### Interview-Ready System Design Walkthrough

For a senior engineering interview, frame this as a stateful agent architecture:

> "The system treats each email as a trigger event. The agent retrieves structured context from a local knowledge base — think of it as a lightweight RAG without vectors — then passes that context to the language model alongside explicit voice governance rules. The output is a draft that respects persona, audience, and channel simultaneously. The key insight is that 'voice' is not a prompt instruction; it is a composable set of constraints loaded from structured data. That makes it auditable, editable by a non-technical user, and consistent across thousands of drafts."

The three properties to emphasize: **auditable** (every constraint is a readable file), **editable** (non-technical users can adjust their voice profile), and **consistent** (the same rules apply every time, not just when remembered).`,
    },
  ],
};

import { Module } from "../types";

export const claudeCodeMasteryModule: Module = {
  id: "claude-code-mastery",
  title: "Claude Code CLI Mastery",
  description: "Deep technical knowledge of Claude Code — the Anthropic terminal agent. Covers architecture, SKILL.md patterns, multi-file workflows, and MCP integration. Designed for technical interviews at AI-forward agencies.",
  lessons: [
    {
      id: "claude-code-architecture",
      slug: "claude-code-architecture",
      title: "Claude Code Architecture",
      content: `## Claude Code Architecture

Claude Code is Anthropic's official terminal-based coding agent. Unlike a chat interface, it operates as a **persistent process** inside your shell with direct access to your filesystem, terminal, and git history. Understanding how it works at the architectural level is what separates a power user from a casual one.

### How Claude Code Works

At its core, Claude Code is a **tool-use agent**. It receives your request, reasons about what tools to call, calls them (file reads, shell commands, code edits), observes the output, and continues reasoning until the task is done. The loop is:

1. **Receive request** — from the user or from a chained prompt
2. **Plan** — decide which tools to call and in what order
3. **Execute** — call tools; each call requires permission based on the policy
4. **Observe** — read tool output and update its working memory
5. **Continue or report** — loop until done, then respond

Tools available include: \`Read\`, \`Write\`, \`Edit\`, \`Bash\`, \`Glob\`, \`Grep\`, \`WebFetch\`, \`WebSearch\`, and any MCP-registered tools.

### The Permission Model

Claude Code enforces a **layered permission system** to prevent unintended destructive actions:

- **Default-allow** operations: reading files, searching, running safe commands
- **Default-deny** operations: running arbitrary shell commands, writing files outside the project, calling network endpoints
- Users can expand or restrict defaults using \`settings.json\` at the project level (\`.claude/settings.json\`) or user level (\`~/.claude/settings.json\`)
- The \`allowed_tools\` and \`denied_tools\` arrays in settings control which tools Claude can invoke without asking
- At runtime, Claude will **pause and ask** before performing any action outside its granted permissions

### CLAUDE.md / claude.md Configuration

The configuration file is Claude Code's primary instruction layer. It is loaded automatically from:

| Location | Scope |
|---|---|
| \`./CLAUDE.md\` or \`./claude.md\` | Project-level — applies to all sessions in this repo |
| \`~/.claude/CLAUDE.md\` | User-level — applies across all projects |

What belongs in \`CLAUDE.md\`:
- Project architecture overview (what folders contain what)
- Coding conventions and style rules
- Commands to run tests, lint, build
- Secrets management instructions (e.g., "never commit .env")
- Step-by-step workflows for recurring tasks (e.g., "how to run the research chain")

Claude reads \`CLAUDE.md\` at the start of every session, so it is effectively a **system prompt injected per project**. This is where you encode institutional knowledge.

### Context Window Management

Claude Code handles large codebases by being **selective about what it loads**. It does not read every file at startup. Instead, it:

- Uses \`Glob\` and \`Grep\` to locate relevant files before reading them
- Reads only the files that are actually needed for the current task
- Evicts older tool outputs from its working context when approaching limits
- Relies on \`CLAUDE.md\` summaries to avoid having to read entire directories

For very large codebases (1M+ lines), the recommended pattern is to pre-summarize key modules in \`CLAUDE.md\` so Claude can navigate without exhaustive searching.

### Hooks System

Claude Code supports **pre-tool and post-tool hooks** — shell commands that run automatically before or after specific tool calls. Configured in \`settings.json\`:

\`\`\`json
{
  "hooks": {
    "pre_tool_call": [
      { "matcher": "Bash", "command": "echo 'About to run a shell command'" }
    ],
    "post_tool_call": [
      { "matcher": "Write", "command": "prettier --write \\"$FILE_PATH\\"" }
    ]
  }
}
\`\`\`

Common hook patterns:
- Auto-format after every file write
- Log all Bash commands for audit trails
- Block writes to protected directories
- Run tests after edits to specific file patterns

Hooks fire synchronously. If a pre-hook exits with a non-zero code, the tool call is cancelled.`,
    },
    {
      id: "building-skills",
      slug: "building-skills",
      title: "Building Claude Code Skills",
      content: `## Building Claude Code Skills

Skills are one of the most powerful — and least understood — features of Claude Code. A **Skill** is a reusable, nameable procedure that Claude can discover, load, and execute on demand. Think of Skills as functions for your AI agent.

### What Is a SKILL.md File?

A \`SKILL.md\` file is a plain markdown document stored in \`.claude/skills/\` (or a skills directory you define). It describes a single repeatable capability in enough detail for Claude to execute it correctly every time — without you having to re-explain it.

Claude discovers Skills by scanning the skills directory at session start. When a user's request matches a Skill's trigger conditions, Claude loads the Skill file and follows its instructions.

### Skill Anatomy

A well-formed Skill has six components:

| Section | Purpose |
|---|---|
| **Name** | A unique identifier Claude uses to reference the Skill |
| **Description** | One sentence explaining what it does — used for matching |
| **Trigger conditions** | Phrases or contexts that should activate this Skill |
| **Inputs** | What the Skill needs from the user or environment |
| **Instructions** | Step-by-step procedure Claude must follow |
| **Output format** | What the result should look like |

### Skills vs CLAUDE.md Instructions

Both Skills and \`CLAUDE.md\` inject instructions into Claude's context, but they serve different purposes:

| | \`CLAUDE.md\` | Skills |
|---|---|---|
| **Scope** | Always loaded | Loaded on demand |
| **Purpose** | Project-wide rules, architecture, conventions | Specific repeatable tasks |
| **Length** | Can be long | Should be focused (one task) |
| **When to use** | "Always remember X" | "When asked to do Y, follow these steps" |

Put things in \`CLAUDE.md\` that apply to every session. Put things in Skills when they represent a **discrete, nameable workflow** that you want Claude to execute consistently.

### Exercise: Write a SKILL.md File

You are building a Skill called \`draft-slack-response\`. When a team member asks Claude to respond to a Slack message, this Skill should:

1. Read the incoming Slack message text from the user
2. Pull relevant context from a specified Obsidian vault path
3. Draft a response using the 6-layer voice governance system (defined in the Skill)
4. Output the draft in a ready-to-paste format

Complete the partial SKILL.md below. Fill in the missing instructions, the full 6-layer voice governance system, and the output format.`,
      starterCode: `# Skill: draft-slack-response

## Name
draft-slack-response

## Description
Read an incoming Slack message, pull context from an Obsidian vault, and draft
a reply using the 6-layer voice governance system.

## Trigger Conditions
- User pastes a Slack message and says "draft a reply"
- User says "respond to this Slack message"
- User says "help me reply to [person]"

## Inputs
- \`slack_message\`: The full text of the incoming Slack message (required)
- \`vault_path\`: Absolute path to the Obsidian vault directory (required)
- \`context_hint\`: Optional keyword to narrow which vault notes to load

## Instructions

### Step 1: Parse the Slack Message
<!-- TODO: Describe how Claude should parse the message.
     What should it extract? (sender intent, tone, urgency, key questions) -->

### Step 2: Load Context from Obsidian Vault
<!-- TODO: Describe how Claude should search the vault.
     Which tool(s) should it use? What search terms? How many notes to load? -->

### Step 3: Apply the 6-Layer Voice Governance System
<!--
  The 6 layers are listed below — fill in the description and rule for each layer.
  Layer 1: Audience Calibration — [TODO]
  Layer 2: Tone Register      — [TODO]
  Layer 3: Claim Precision    — [TODO]
  Layer 4: Structural Economy — [TODO]
  Layer 5: Ethical Guardrails — [TODO]
  Layer 6: Brand Consistency  — [TODO]
-->

### Step 4: Draft the Response
<!-- TODO: How should Claude structure the draft?
     Length, greeting, sign-off conventions? -->

### Step 5: Self-Review
<!-- TODO: What checklist should Claude run before outputting?
     (tone match, factual accuracy against vault, length) -->

## Output Format
<!-- TODO: Describe the exact output structure.
     Should it include: the draft, confidence note, vault sources used? -->
`,
      solutionCode: `# Skill: draft-slack-response

## Name
draft-slack-response

## Description
Read an incoming Slack message, pull context from an Obsidian vault, and draft
a reply using the 6-layer voice governance system.

## Trigger Conditions
- User pastes a Slack message and says "draft a reply"
- User says "respond to this Slack message"
- User says "help me reply to [person]"

## Inputs
- \`slack_message\`: The full text of the incoming Slack message (required)
- \`vault_path\`: Absolute path to the Obsidian vault directory (required)
- \`context_hint\`: Optional keyword to narrow which vault notes to load

## Instructions

### Step 1: Parse the Slack Message
Read the full \`slack_message\` text and extract:
- **Primary intent**: What is the sender asking or saying? (question, request, update, complaint)
- **Tone**: Is the message formal, casual, urgent, or frustrated?
- **Urgency signals**: Words like "ASAP", "blocking", "today" → flag as high urgency
- **Key questions**: List every explicit question that requires a direct answer
- **Implicit asks**: Note anything the sender likely needs even if not stated directly

### Step 2: Load Context from Obsidian Vault
Use the \`Glob\` tool to list all \`.md\` files under \`vault_path\`.
Then use \`Grep\` to search for:
- The sender's name (if identifiable from the message)
- Any project names, product names, or technical terms mentioned
- The \`context_hint\` keyword if provided

Load the top 3 most relevant notes using the \`Read\` tool. If no relevant notes
are found, proceed without vault context and note this in the output.

### Step 3: Apply the 6-Layer Voice Governance System

Process the draft through all 6 layers in sequence. Each layer is a mandatory filter.

**Layer 1 — Audience Calibration**
Rule: Match vocabulary and assumed knowledge to the sender's apparent role.
If the sender uses technical jargon, mirror it. If they write casually, do not
respond with corporate formality. Identify the sender's context from message
content and vault notes.

**Layer 2 — Tone Register**
Rule: Set the emotional register before writing a single word.
Options: [warm-professional | direct-efficient | empathetic-supportive |
collegial-casual]. Choose the register that matches the incoming message's
tone. High-urgency messages → direct-efficient. Frustrated sender →
empathetic-supportive first, then direct.

**Layer 3 — Claim Precision**
Rule: Every factual claim must be traceable to a vault note or marked as
assumption. Use hedging language ("based on my notes", "I believe") for
anything not confirmed in the vault. Never state uncertain information as fact.

**Layer 4 — Structural Economy**
Rule: Use the minimum structure needed. For messages under 3 lines, reply in
prose — no bullet points. For complex multi-question messages, use a numbered
list that mirrors the sender's question order. Never exceed 150 words unless
the sender's message itself exceeded 150 words.

**Layer 5 — Ethical Guardrails**
Rule: Do not make commitments on behalf of the user (e.g., "we will deliver by
Friday") unless the vault confirms this is an existing commitment. Flag any
reply that could be legally or contractually sensitive with a note:
[REVIEW BEFORE SENDING — potential commitment detected].

**Layer 6 — Brand Consistency**
Rule: Match the vocabulary, sign-off style, and formality level found in other
vault notes attributed to the user. If vault notes show the user signs off with
"Cheers," replicate it. If they never use exclamation marks, omit them. The
reply must sound like the user, not like a generic AI assistant.

### Step 4: Draft the Response
Write the reply in first person as if you are the user.
- Open with a direct acknowledgment of the sender's primary intent
- Answer all key questions in the order they were asked
- If vault context is relevant, weave it in naturally (do not cite the filename)
- Close with a clear next step or offer to follow up

### Step 5: Self-Review Checklist
Before outputting, verify:
- [ ] Tone register matches the incoming message
- [ ] Every factual claim is either vault-sourced or hedged
- [ ] No commitments made that aren't confirmed in vault
- [ ] Word count is appropriate (Layer 4 rule respected)
- [ ] Reply sounds like the user, not a generic assistant
- [ ] All questions from the sender are answered

## Output Format

\`\`\`
DRAFT REPLY
-----------
[The drafted message, ready to copy-paste]

---
VOICE NOTES
Layer 2 register selected: [chosen register]
Layer 6 sign-off matched: [yes/no — source note if yes]

VAULT SOURCES USED
- [Note filename] — [one-line summary of what it contributed]
- (none) if no vault context was loaded

FLAGS
[Any Layer 5 ethical flags, or "None"]
\`\`\`
`,
    },
    {
      id: "multi-file-workflows",
      slug: "multi-file-workflows",
      title: "Multi-file Workflows & Debugging",
      content: `## Multi-file Workflows & Debugging

The real power of Claude Code emerges in multi-file tasks — refactoring a module, wiring a new feature across the stack, or migrating a database schema. These sessions require a different mental model than single-file edits. Understanding how to guide Claude through complex changes — and how to recover when things go wrong — is a core professional skill.

### Guiding Claude Through Complex Multi-file Changes

The most common mistake is giving Claude a vague goal and hoping it figures out the scope. Claude is powerful, but it benefits enormously from explicit scoping.

**Before starting a multi-file task:**
1. Tell Claude *which files are in scope*. You can name them, or say "all files under \`src/components/\`".
2. Tell Claude *what must not change*. "Don't touch any test files" or "the public API surface of this module must stay identical."
3. Tell Claude the *success criteria*. "The TypeScript compiler should report zero errors" or "all existing tests must pass."

**During the task:**
- Ask Claude to show you a diff before writing changes: "Show me what you plan to change before you make any edits."
- For large refactors, break them into phases: "First, rename the types. Then update the imports. Then update the implementations."
- Use the \`Bash\` tool intentionally — asking Claude to run \`tsc --noEmit\` or \`npm test\` after each phase catches regressions early.

### Debugging Strategies

When Claude produces a broken result, the debugging workflow mirrors software debugging:

**1. Read the actual error.** Ask Claude to run the failing command and paste the full output. Error messages contain the exact line number and type — use them.

**2. Check the diff.** Use \`git diff\` to see exactly what changed. Often, Claude edits more than intended. A side-by-side diff reveals unintended deletions or import changes.

**3. Narrow the scope.** If 10 files were changed and something broke, do a binary search: revert half the changes, test again. Identify which change introduced the regression.

**4. Rollback cleanly.** Claude Code works best alongside git. Before any large multi-file task, commit current state: \`git add -A && git commit -m "checkpoint before refactor"\`. If the session goes wrong, \`git checkout .\` restores everything instantly.

### Using Git Effectively with Claude Code

Git is your safety net and your communication layer with Claude:

| Git pattern | When to use |
|---|---|
| Commit before starting | Any task touching more than 2 files |
| \`git diff\` review | After each phase of a multi-file task |
| Branch per task | Large features or risky refactors |
| \`git stash\` | Pausing mid-task to review before committing |
| \`git log --oneline\` | Show Claude the commit history for context |

You can ask Claude to respect git conventions directly: "Only commit when I say so" or "Create a branch called \`feature/add-auth\` before making any changes."

### Permission Model: Allow and Deny Patterns

The \`.claude/settings.json\` file controls what Claude can do without asking permission. For multi-file workflows, two patterns are especially important:

**Allow pattern — granting broad write access for a session:**
\`\`\`json
{
  "allowed_tools": ["Read", "Write", "Edit", "Bash", "Glob", "Grep"]
}
\`\`\`

**Deny pattern — protecting sensitive paths:**
\`\`\`json
{
  "denied_tools": [
    { "tool": "Write", "path_pattern": "*.env" },
    { "tool": "Bash", "command_pattern": "git push*" }
  ]
}
\`\`\`

Deny patterns are evaluated before allow patterns. This lets you grant broad permissions while carving out protected operations — a useful pattern for production environments where you want Claude to help but never push or deploy without human confirmation.`,
    },
    {
      id: "claude-code-mcp",
      slug: "claude-code-mcp",
      title: "Claude Code + MCP Integration",
      content: `## Claude Code + MCP Integration

The Model Context Protocol (MCP) is Anthropic's open standard for connecting AI agents to external tools, data sources, and services. Claude Code has native MCP support, which means you can extend it with any capability that can be wrapped in an MCP server — search engines, databases, APIs, internal tools, or entire SaaS platforms.

### How Claude Code Discovers MCP Servers

Claude Code looks for MCP server configuration in two locations:

| Config file | Scope |
|---|---|
| \`.claude/settings.json\` | Project-level — only available in this project |
| \`~/.claude/settings.json\` | User-level — available in all Claude Code sessions |

At session start, Claude reads these files, connects to each configured MCP server, and registers the server's available tools into its active tool list. From that point on, Claude can call MCP tools exactly like built-in tools — with the same permission model and the same reasoning loop.

### Configuring MCP Servers in .claude/settings.json

MCP servers are configured under the \`"mcpServers"\` key. Each entry specifies how to launch the server process:

\`\`\`json
{
  "mcpServers": {
    "tavily": {
      "command": "npx",
      "args": ["-y", "tavily-mcp@latest"],
      "env": {
        "TAVILY_API_KEY": "tvly-your-key-here"
      }
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/brave-search-mcp@latest"],
      "env": {
        "BRAVE_API_KEY": "your-key-here"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest",
               "--supabase-url", "https://yourproject.supabase.co",
               "--supabase-key", "your-service-role-key"]
    }
  }
}
\`\`\`

Each server entry requires:
- \`command\`: The executable to launch (usually \`npx\`, \`uvx\`, or a direct binary path)
- \`args\`: Arguments passed to the command
- \`env\` (optional): Environment variables injected into the server process — the right place for API keys

### Using MCP Tools from Within Claude Code Sessions

Once connected, MCP tools appear in Claude's tool list exactly like built-in tools. You use them by describing what you need — Claude selects the right tool automatically:

- "Search for studies linking ashwagandha to cortisol" → Claude calls the Tavily MCP \`search\` tool
- "Insert this record into the users table" → Claude calls the Supabase MCP \`query\` tool
- "Send a Slack message to #dev-ops" → Claude calls a Slack MCP \`send_message\` tool

Claude will ask for permission before calling MCP tools that perform writes or external network requests, unless you have pre-authorized them in \`allowed_tools\`.

### Building Workflows That Chain MCP Server Calls

The most powerful use of MCP is building **multi-step workflows** where Claude chains several MCP calls to produce a result. A well-designed \`CLAUDE.md\` can define the exact sequence:

\`\`\`markdown
## Research Workflow
1. Use Tavily search_depth:"advanced" to find studies (Tavily MCP)
2. If Tavily returns < 3 results, retry with Brave Search (Brave MCP)
3. For each valid study URL, fetch the full text (WebFetch tool)
4. Store study records in Supabase (Supabase MCP)
5. Format findings into the report template (Write tool)
\`\`\`

This is exactly the pattern used in production AI automation pipelines: the \`CLAUDE.md\` acts as a workflow definition, and MCP servers provide the external integrations.

### Interview-Ready Talking Points

For a technical interview at an AI automation agency, be prepared to speak to:

**Architecture:** "Claude Code is a tool-use agent. MCP extends its tool surface beyond the filesystem into any external system that exposes an MCP-compliant server. The connection is local — Claude Code launches MCP servers as child processes and communicates over stdin/stdout using JSON-RPC."

**Security model:** "API keys never leave the local machine — they're injected as environment variables into the MCP server process, not sent to Anthropic. Claude Code's permission model still applies: MCP tools that perform writes require explicit authorization."

**Scalability pattern:** "For high-volume automation, you can run Claude Code headlessly with \`claude -p 'run the research chain'\` in a cron job or CI pipeline. The MCP servers spin up per session, so each run is stateless and parallelizable."

**Practical limits:** "MCP adds latency because each tool call is a round-trip to the MCP server process. For workflows with dozens of search calls, batching queries and using \`search_depth: advanced\` (rather than multiple shallow calls) is significantly more efficient."

**Debugging MCP issues:** "If a tool call fails silently, check that the MCP server process is actually running (\`ps aux | grep mcp\`), verify the API key is set in the env block, and look for error output in the Claude Code session log."`,
    },
  ],
};

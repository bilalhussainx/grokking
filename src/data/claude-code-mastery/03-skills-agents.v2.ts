import { Module } from "../types";

export const skillsAgentsModule: Module = {
  id: "cc-skills",
  title: "Skills & Agents",
  description: "Build custom skills, create sub-agents, integrate MCP servers, and use hooks for deterministic automation outside the agentic loop.",
  lessons: [
    {
      id: "sa-skills",
      slug: "skills-system",
      title: "Skills System",
      content: `## Skills System

**Skills** are auto-discoverable knowledge modules that extend Claude Code's capabilities. They are markdown files that contain instructions, context, or workflows that Claude can invoke on demand. Think of them as reusable "recipes" for common tasks.

### What Are Skills?

A skill is a markdown file placed in a specific location that Claude Code automatically discovers and makes available as a slash command.

\`\`\`
.claude/commands/
├── review-security.md      → /review-security
├── create-component.md     → /create-component
├── deploy-staging.md       → /deploy-staging
└── write-tests.md          → /write-tests
\`\`\`

### Creating a Skill

Create a markdown file in \`.claude/commands/\`:

\`\`\`markdown
<!-- .claude/commands/create-component.md -->
# Create React Component

Create a new React component with the following structure:

1. Create the component file at src/components/$ARGUMENTS.tsx
2. Use this template:
   - Export a default function component
   - Include TypeScript props interface
   - Use Tailwind CSS for styling
   - Include JSDoc comments

3. Create a test file at src/components/$ARGUMENTS.test.tsx
4. Create a Storybook story at src/components/$ARGUMENTS.stories.tsx
5. Add an export to src/components/index.ts

Always follow the project's naming conventions from CLAUDE.md.
\`\`\`

Usage:
\`\`\`
> /create-component UserProfile
Claude creates UserProfile.tsx, UserProfile.test.tsx, and UserProfile.stories.tsx
\`\`\`

### The $ARGUMENTS Variable

Skills can accept arguments via the \`$ARGUMENTS\` placeholder:

\`\`\`markdown
<!-- .claude/commands/explain.md -->
Explain the following code or concept in detail:

$ARGUMENTS

Provide:
1. A high-level summary
2. Step-by-step walkthrough
3. Key design decisions and tradeoffs
4. Potential improvements
\`\`\`

Usage: \`/explain the authentication middleware in src/middleware.ts\`

### Skill Library Examples

**Code Review Skill:**
\`\`\`markdown
<!-- .claude/commands/review.md -->
Review the current git diff for:

1. **Bugs**: Logic errors, off-by-one, null checks
2. **Security**: Injection, XSS, auth bypass
3. **Performance**: N+1 queries, unnecessary re-renders
4. **Style**: Naming, structure, consistency with codebase
5. **Tests**: Are new features covered?

For each finding, provide:
- Severity: Critical / Warning / Suggestion
- File and line number
- What's wrong and how to fix it
\`\`\`

**Database Migration Skill:**
\`\`\`markdown
<!-- .claude/commands/migrate.md -->
Create a database migration for: $ARGUMENTS

Steps:
1. Read the current Prisma schema
2. Modify the schema for the requested change
3. Generate the migration: npx prisma migrate dev --name $ARGUMENTS
4. Verify the migration SQL is correct
5. Update any affected TypeScript types
6. Update seed data if necessary
\`\`\`

**Documentation Skill:**
\`\`\`markdown
<!-- .claude/commands/document.md -->
Generate documentation for: $ARGUMENTS

1. Read the source code
2. Create a markdown document with:
   - Overview and purpose
   - API reference (functions, parameters, return types)
   - Usage examples
   - Common patterns and gotchas
3. Save to docs/ directory
\`\`\`

### Skill Organization

For teams, organize skills by category:

\`\`\`
.claude/commands/
├── dev/
│   ├── create-component.md
│   ├── create-api-route.md
│   └── create-migration.md
├── review/
│   ├── security-review.md
│   ├── performance-review.md
│   └── accessibility-review.md
├── deploy/
│   ├── deploy-staging.md
│   └── deploy-production.md
└── docs/
    ├── document-api.md
    └── document-component.md
\`\`\`

### Key Takeaway

Skills turn repetitive workflows into one-command operations. Create them for any task you do more than twice — component creation, code reviews, migrations, deployments, and documentation. Share them via git so your whole team benefits from the same standardized workflows.

> **Resource**: [Claude Code Best Practices](https://github.com/shanraisshan/claude-code-best-practice) — Extensive skill examples and organization patterns.`,
    },
    {
      id: "sa-sub-agents",
      slug: "sub-agents",
      title: "Sub-Agents",
      content: `## Sub-Agents

**Sub-agents** are autonomous Claude Code instances that the main session can spawn to handle specific sub-tasks. They operate with their own context, tools, and permissions, then report results back to the parent session.

### What Are Sub-Agents?

When Claude Code encounters a task that would benefit from a focused, isolated execution context, it can delegate to a sub-agent:

\`\`\`
Main Session: "Refactor the entire auth module"
  → Spawns Sub-Agent 1: "Analyze current auth code and dependencies"
  → Spawns Sub-Agent 2: "Research best practices for JWT auth in Next.js"
  → Receives results from both
  → Synthesizes a plan and executes it
\`\`\`

### How Sub-Agents Work

Sub-agents are separate Claude API calls with:
- **Their own system prompt**: Focused on one specific task
- **Their own tools**: May have access to different tools than the parent
- **Their own context**: Fresh context window, not cluttered with parent's history
- **Scoped output**: Returns only the relevant result to the parent

### The Task Pattern

Claude Code uses sub-agents when it identifies tasks that benefit from isolation:

\`\`\`
> Analyze the entire codebase for type safety issues and fix them

Claude (main):
  I'll break this into sub-tasks and use focused agents for each:

  [Sub-Agent: Type Analysis]
    Scanning all TypeScript files for 'any' types, missing types,
    and type assertion issues...
    Found 23 issues across 12 files.

  [Sub-Agent: Fix Generation]
    For each issue, generating the correct type...
    18 auto-fixable, 5 require manual review.

  [Main Agent]
    Applying 18 fixes and presenting 5 for your review.
\`\`\`

### Building Custom Sub-Agent Workflows

You can instruct Claude to use sub-agent patterns:

\`\`\`
> For each API endpoint in src/app/api/:
> 1. Spawn a focused analysis to check for input validation
> 2. Check if error handling follows our pattern
> 3. Verify rate limiting is applied
> Report all findings in a summary table.
\`\`\`

### Sub-Agent vs Single Agent

| Scenario | Single Agent | Sub-Agents |
|----------|:-----------:|:----------:|
| Simple edit | Better | Overkill |
| Multi-file analysis | Gets confused | Each agent focuses |
| Large codebase scan | Context overflow | Isolated contexts |
| Independent sub-tasks | Sequential | Can parallelize |
| Cross-cutting concerns | Mixes concerns | Clean separation |

### Sub-Agent Design Principles

1. **Single responsibility**: Each sub-agent should have one clear task
2. **Clear output format**: Define what the sub-agent should return
3. **Limited scope**: Give sub-agents access only to relevant files
4. **Fail gracefully**: Sub-agent failures shouldn't crash the parent

### Practical Example: Multi-File Refactor

\`\`\`
> Rename the 'user' module to 'account' across the entire codebase.
> Use sub-agents: one to find all references, one to plan the rename,
> and one to execute and verify.

Sub-Agent 1 (Discovery):
  Found 47 references to 'user' module across 23 files:
  - 12 import statements
  - 8 type references
  - 15 function calls
  - 7 database queries
  - 5 API route paths

Sub-Agent 2 (Planning):
  Rename plan:
  1. Rename src/lib/user/ → src/lib/account/
  2. Update 12 import paths
  3. Rename UserService → AccountService
  4. Update 7 Prisma model references
  5. Update 5 API routes: /api/user/* → /api/account/*

Sub-Agent 3 (Execution):
  Executed all renames. Running tests...
  All 156 tests pass. No broken imports.
\`\`\`

### Key Takeaway

Sub-agents are Claude Code's way of scaling complex tasks. They provide focused context for each sub-task, prevent context window overflow, and enable cleaner separation of concerns. Use them for large refactors, codebase-wide analysis, and any task that naturally decomposes into independent sub-tasks.`,
    },
    {
      id: "sa-custom-skills",
      slug: "building-custom-skills",
      title: "Building Custom Skills",
      content: `## Building Custom Skills

Custom skills are where Claude Code becomes truly personalized to your workflow. This lesson covers advanced skill design patterns — parameterized skills, multi-step workflows, conditional logic, and team-shared skill libraries.

### Parameterized Skills

Use \`$ARGUMENTS\` for flexible, reusable skills:

\`\`\`markdown
<!-- .claude/commands/scaffold.md -->
# Scaffold Feature: $ARGUMENTS

Create the complete feature scaffold for "$ARGUMENTS":

## Files to Create:
1. src/features/$ARGUMENTS/
   - index.ts (barrel export)
   - $ARGUMENTS.tsx (main component)
   - $ARGUMENTS.test.tsx (unit tests)
   - $ARGUMENTS.hooks.ts (custom hooks)
   - $ARGUMENTS.types.ts (TypeScript interfaces)
   - $ARGUMENTS.api.ts (API integration)

## Steps:
1. Read existing features in src/features/ for pattern reference
2. Create the directory structure
3. Implement each file following existing patterns
4. Add exports to src/features/index.ts
5. Add a route in src/app/ if this is a page feature
6. Run type checker to verify no errors

## Naming Convention:
- Component: PascalCase
- Files: kebab-case if the feature name has multiple words
- Hooks: camelCase with "use" prefix
\`\`\`

### Multi-Step Workflow Skills

Skills that orchestrate complex workflows:

\`\`\`markdown
<!-- .claude/commands/release.md -->
# Prepare Release

Prepare a new release:

## Pre-flight Checks
1. Ensure all tests pass: \\\`npm test\\\`
2. Ensure the build succeeds: \\\`npm run build\\\`
3. Ensure no uncommitted changes: \\\`git status\\\`
4. If any check fails, STOP and report the issue

## Version Bump
1. Read the current version from package.json
2. Determine the bump type from recent commits:
   - feat: → minor
   - fix: → patch
   - BREAKING CHANGE: → major
3. Update version in package.json

## Changelog
1. Generate changelog from git log since last tag
2. Group by: Features, Bug Fixes, Breaking Changes
3. Write to CHANGELOG.md

## Commit and Tag
1. Commit: "chore: release vX.Y.Z"
2. Tag: vX.Y.Z
3. Report: "Release vX.Y.Z prepared. Run 'git push --follow-tags' to publish."
\`\`\`

### Conditional Skills

Skills that adapt based on context:

\`\`\`markdown
<!-- .claude/commands/test.md -->
# Smart Test Runner

Run tests intelligently based on what changed:

1. Check \\\`git diff --name-only\\\` for changed files
2. Determine which test suites are affected:
   - If src/api/ changed → run API tests
   - If src/components/ changed → run component tests
   - If src/lib/ changed → run unit tests + integration tests
   - If prisma/schema.prisma changed → run database tests
   - If package.json changed → run all tests
3. Run only the affected test suites
4. Report results with coverage for changed files
\`\`\`

### Team Skill Libraries

Share skills across your team:

\`\`\`
.claude/
├── commands/           ← Shared via git
│   ├── review.md
│   ├── scaffold.md
│   └── deploy.md
├── commands-local/     ← Personal, gitignored
│   ├── my-shortcuts.md
│   └── experiment.md
\`\`\`

Add to \`.gitignore\`:
\`\`\`
.claude/commands-local/
\`\`\`

### Skill Composition

Skills can reference other skills:

\`\`\`markdown
<!-- .claude/commands/full-feature.md -->
# Full Feature Pipeline: $ARGUMENTS

Execute these steps in order:
1. Run /scaffold $ARGUMENTS
2. Implement the core business logic
3. Run /test to verify
4. Run /review to check quality
5. Run /commit to create a clean commit
\`\`\`

### Debugging Skills

When a skill doesn't work as expected:

1. **Test incrementally**: Run each step of the skill manually
2. **Check context**: Is CLAUDE.md providing enough background?
3. **Be explicit**: "Always use TypeScript" is better than assuming
4. **Add examples**: Show Claude what the output should look like
5. **Set guardrails**: "If step 3 fails, stop and ask for help"

### Key Takeaway

Custom skills encode your team's best practices into reusable, shareable commands. Start with simple parameterized skills, then build up to multi-step workflows. The best skills are ones that capture institutional knowledge — "this is how we do X at our company" — so every team member gets consistent, high-quality results.`,
    },
    {
      id: "sa-mcp",
      slug: "mcp-server-integration",
      title: "MCP Server Integration",
      content: `## MCP Server Integration

**MCP (Model Context Protocol)** extends Claude Code's capabilities by connecting it to external tools, databases, and services. MCP servers act as plugins that give Claude new abilities beyond its built-in tools.

### How MCP Works with Claude Code

\`\`\`
Claude Code ←→ MCP Client ←→ MCP Server ←→ External Service
                                              (Database, API, etc.)
\`\`\`

When you configure an MCP server, Claude Code gains access to the server's tools. For example, a database MCP server gives Claude the ability to query your database directly.

### Configuring MCP Servers

Add MCP servers to \`.claude/mcp.json\`:

\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/docs"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    }
  }
}
\`\`\`

### Popular MCP Servers

| Server | Capability | Use Case |
|--------|-----------|----------|
| **postgres** | SQL queries | Query/analyze database directly |
| **filesystem** | File operations | Access files outside project |
| **github** | GitHub API | Manage issues, PRs, repos |
| **brave-search** | Web search | Find current information |
| **tavily** | AI search | Research-optimized web search |
| **slack** | Slack API | Read/send messages |
| **memory** | Persistent memory | Remember across sessions |

### Using MCP Tools in Claude Code

Once configured, MCP tools appear alongside built-in tools:

\`\`\`
> Query the database: how many users signed up this month?

Claude uses the postgres MCP server:
  [MCP: postgres.query]
  SELECT COUNT(*) FROM users
  WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)

  Result: 1,247 users signed up this month.
\`\`\`

### Building a Custom MCP Server

For your team's specific tools:

\`\`\`python
# my_company_server.py
from mcp.server import Server
import mcp.types as types

server = Server("my-company")

@server.list_tools()
async def list_tools():
    return [
        types.Tool(
            name="get_feature_flags",
            description="Get current feature flag values for an environment",
            inputSchema={
                "type": "object",
                "properties": {
                    "environment": {
                        "type": "string",
                        "enum": ["dev", "staging", "production"]
                    }
                },
                "required": ["environment"]
            }
        )
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_feature_flags":
        flags = fetch_flags(arguments["environment"])
        return [types.TextContent(type="text", text=str(flags))]
\`\`\`

### MCP Security Best Practices

1. **Use environment variables** for secrets (never hardcode in mcp.json)
2. **Limit permissions**: Give MCP servers read-only access where possible
3. **Scope access**: Filesystem server should only access necessary directories
4. **Audit logs**: Log all MCP tool calls for review
5. **Local-only secrets**: Use \`.claude/mcp.local.json\` (gitignored) for sensitive configs

### Key Takeaway

MCP servers turn Claude Code into a hub that can interact with any system. Database queries, GitHub management, web search, Slack messaging — all available through natural language. Start with the official MCP servers for common services, then build custom servers for your team's specific tools.

> **Resource**: [MCP Server Registry](https://modelcontextprotocol.io/) — Browse and install official and community MCP servers.`,
    },
    {
      id: "sa-hooks",
      slug: "hooks",
      title: "Hooks (Deterministic Scripts)",
      content: `## Hooks: Deterministic Scripts Outside the Agentic Loop

**Hooks** are scripts that run automatically at specific points in Claude Code's execution — before/after tool calls, before/after commands, or on specific events. Unlike the agentic loop (which is non-deterministic), hooks are deterministic: they always run the same way.

### Why Hooks?

Some operations should happen consistently, without relying on Claude to remember:
- Run linting before every file edit is saved
- Validate environment variables before any bash command
- Log all tool calls for auditing
- Enforce coding standards automatically

### Hook Types

| Hook | When It Runs | Use Case |
|------|-------------|----------|
| **pre-tool** | Before any tool call | Validation, logging |
| **post-tool** | After any tool call | Verification, formatting |
| **pre-edit** | Before file modifications | Backup, lint check |
| **post-edit** | After file modifications | Format, lint fix |
| **notification** | On specific events | Alerts, logging |

### Configuring Hooks

Add hooks to your settings file:

\`\`\`json
{
  "hooks": {
    "post-edit": [
      {
        "command": "npx prettier --write",
        "description": "Format files after editing"
      }
    ],
    "pre-tool": [
      {
        "matcher": "Bash(*)",
        "command": "echo 'Running bash command' >> .claude/audit.log",
        "description": "Log all bash commands"
      }
    ]
  }
}
\`\`\`

### Practical Hook Examples

**Auto-Format on Edit:**
\`\`\`json
{
  "hooks": {
    "post-edit": [
      {
        "command": "npx prettier --write $FILE",
        "description": "Run Prettier on every edited file"
      }
    ]
  }
}
\`\`\`

**Lint Check Before Commit:**
\`\`\`json
{
  "hooks": {
    "pre-tool": [
      {
        "matcher": "Bash(git commit*)",
        "command": "npm run lint",
        "description": "Lint before committing",
        "fail_on_error": true
      }
    ]
  }
}
\`\`\`

If the lint fails, the git commit is blocked.

**Audit Logging:**
\`\`\`json
{
  "hooks": {
    "pre-tool": [
      {
        "command": "echo "$(date): $TOOL_NAME $TOOL_ARGS" >> .claude/audit.log",
        "description": "Log all tool calls for audit"
      }
    ]
  }
}
\`\`\`

**Type Checking After Edits:**
\`\`\`json
{
  "hooks": {
    "post-edit": [
      {
        "matcher": "*.ts,*.tsx",
        "command": "npx tsc --noEmit --pretty",
        "description": "Type check TypeScript files after edits",
        "fail_on_error": false
      }
    ]
  }
}
\`\`\`

### Hooks vs CLAUDE.md Instructions

| Feature | Hooks | CLAUDE.md |
|---------|:-----:|:---------:|
| Deterministic | Yes | No (advisory) |
| Runs automatically | Yes | Claude decides |
| Can block actions | Yes | No |
| Works without Claude | Yes | No |
| Customizable per event | Yes | General instructions |

### Hook Design Principles

1. **Keep hooks fast**: Slow hooks add latency to every Claude action
2. **Fail clearly**: If a hook fails, it should report why clearly
3. **Be idempotent**: Hooks may run multiple times; ensure they're safe to repeat
4. **Don't over-hook**: Only add hooks for things that MUST happen consistently
5. **Test hooks independently**: Run hook commands manually before configuring

### When to Use Hooks vs CLAUDE.md

- **"Always format with Prettier"** → Hook (deterministic, never forgotten)
- **"Prefer functional components"** → CLAUDE.md (advisory, flexible)
- **"Run tests before committing"** → Hook (enforced, blocks if tests fail)
- **"Use Tailwind for styling"** → CLAUDE.md (design preference)

### Key Takeaway

Hooks add deterministic guardrails to Claude Code's non-deterministic agent loop. Use them for operations that must happen consistently — formatting, linting, type checking, auditing. They're your safety net for ensuring code quality standards are never bypassed, regardless of how Claude approaches a task.`,
    },
  ],
};

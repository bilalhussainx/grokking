import { Module } from "../types";

export const gettingStartedModule: Module = {
  id: "cc-getting-started",
  title: "Getting Started",
  description:
    "Install Claude Code, run your first session, configure CLAUDE.md project instructions, and understand settings and permissions.",
  lessons: [
    {
      id: "gs-what-is-cc",
      slug: "what-is-claude-code",
      title: "What is Claude Code?",
      content: `## What is Claude Code?

**Claude Code** is Anthropic's official command-line interface (CLI) for Claude. It transforms Claude from a chatbot into an autonomous coding agent that can read your codebase, edit files, run commands, search code, execute tests, create commits, and manage entire development workflows — all from your terminal.

### Claude Code vs ChatGPT/Claude Web

| Feature | Web Chat | Claude Code |
|---------|:--------:|:-----------:|
| Read files | Copy-paste only | Reads directly from disk |
| Edit files | Gives you code to paste | Edits files in place |
| Run commands | Cannot | Runs bash, git, npm, etc. |
| Project context | Limited to conversation | Reads entire codebase |
| Multi-file changes | Painful | Natural |
| Git integration | None | Built-in (commits, PRs) |
| Persistent context | Per conversation | CLAUDE.md + memory |

### What Claude Code Can Do

**Everyday tasks:**
- "Fix the failing tests in this project"
- "Add a dark mode toggle to the settings page"
- "Refactor this function to be more readable"
- "Create a PR for these changes"

**Complex workflows:**
- "Set up CI/CD with GitHub Actions for this Next.js project"
- "Migrate this codebase from JavaScript to TypeScript"
- "Find and fix all security vulnerabilities"
- "Generate comprehensive test coverage for the auth module"

**Research and exploration:**
- "How does the authentication flow work in this codebase?"
- "Find all places where the user's email is accessed"
- "What patterns does this codebase use for error handling?"

### Architecture

\`\`\`
Your Terminal
     ↓
[Claude Code CLI]
  ├── Reads your codebase (files, directories, git history)
  ├── Sends context + your request to Claude API
  ├── Receives Claude's response (reasoning + tool calls)
  ├── Executes approved tool calls (file edits, commands)
  └── Reports results back to you
\`\`\`

### How It Works Under the Hood

1. You type a request in the terminal
2. Claude Code gathers relevant context (project structure, file contents, git state)
3. It sends your request + context to the Claude API
4. Claude reasons about the task and decides what tools to use
5. Claude Code executes the tools (read files, edit files, run commands)
6. Results are sent back to Claude for further reasoning
7. This loop continues until the task is complete

### Key Concepts

- **Tools**: Claude Code gives Claude access to tools like Read, Edit, Write, Bash, Grep, and Glob
- **Permissions**: You control which tools Claude can use without asking
- **CLAUDE.md**: A project configuration file that gives Claude persistent context about your project
- **Sessions**: Each conversation is a session that can be resumed, renamed, or rewound

### Key Takeaway

Claude Code is the bridge between Claude's intelligence and your actual development environment. It can read, write, search, execute, and reason about your code — making it a genuine pair programming partner rather than just a chat interface. The rest of this course teaches you how to use it effectively.

> **Resource**: [Claude Code Best Practices](https://github.com/shanraisshan/claude-code-best-practice) — A community-curated collection of 40+ tips and patterns for effective Claude Code usage.`,
    },
    {
      id: "gs-installation",
      slug: "installation-setup",
      title: "Installation & Setup",
      content: `## Installation & Setup

Getting Claude Code running takes just a few minutes. This lesson covers installation, authentication, and verifying your setup.

### Prerequisites

- **Node.js** 18 or later (check with \`node --version\`)
- **An Anthropic API key** (or a Claude Pro/Team/Enterprise subscription)
- A terminal (Terminal.app, iTerm2, Windows Terminal, etc.)

### Installation

Install Claude Code globally via npm:

\`\`\`bash
npm install -g @anthropic-ai/claude-code
\`\`\`

Or if you prefer npx (no global install):

\`\`\`bash
npx @anthropic-ai/claude-code
\`\`\`

### Authentication

There are two ways to authenticate:

**Option 1: API Key (Pay-per-use)**

\`\`\`bash
export ANTHROPIC_API_KEY="sk-ant-..."
claude
\`\`\`

**Option 2: Claude Subscription (Pro/Team/Enterprise)**

\`\`\`bash
claude
# Follow the browser-based OAuth flow
\`\`\`

### First Run

Navigate to a project directory and start Claude Code:

\`\`\`bash
cd ~/my-project
claude
\`\`\`

You'll see the Claude Code prompt:

\`\`\`
╭──────────────────────────────────────╮
│  Claude Code                         │
│  Type your request or /help          │
╰──────────────────────────────────────╯
>
\`\`\`

### Verify Your Setup

Try these commands to confirm everything works:

\`\`\`
> What files are in this directory?
> Summarize the project structure
> What does the README say?
\`\`\`

If Claude can read your files and respond, you're ready to go.

### Configuration Locations

Claude Code stores configuration in several places:

| Location | Purpose |
|----------|---------|
| \`~/.claude/settings.json\` | Global user settings |
| \`project/.claude/settings.json\` | Project-specific settings |
| \`project/CLAUDE.md\` | Project instructions (checked into git) |
| \`~/.claude/memory/\` | Persistent memory across sessions |

### Choosing a Model

Claude Code uses Claude Sonnet by default but supports other models:

\`\`\`bash
# Use a specific model
claude --model claude-sonnet-4-20250514

# Use Opus for complex tasks
claude --model claude-opus-4-20250514
\`\`\`

### IDE Integration

Claude Code works alongside any editor. Common setups:

- **VS Code + Terminal**: Open integrated terminal, run \`claude\`
- **Cursor**: Use Cursor's built-in terminal panel
- **Vim/Neovim**: Run Claude Code in a tmux split pane
- **JetBrains IDEs**: Use the built-in terminal

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "Command not found" | Ensure npm global bin is in your PATH |
| "Authentication failed" | Re-export your API key or re-authenticate |
| "Rate limit exceeded" | Wait a moment or check your API plan |
| Slow responses | Check your internet connection; try a smaller model |

### Key Takeaway

Installation is straightforward — install via npm, authenticate, and start using it in any project directory. The most important next step is creating a CLAUDE.md file (covered in the next lesson) that gives Claude persistent context about your project's conventions and structure.`,
    },
    {
      id: "gs-first-session",
      slug: "your-first-session",
      title: "Your First Session",
      content: `## Your First Session

Let's walk through a complete Claude Code session — from opening the CLI to making real changes to your project. You'll learn the basic commands, how Claude interacts with your files, and how the approval flow works.

### Starting a Session

\`\`\`bash
cd ~/my-project
claude
\`\`\`

### The Approval Flow

When Claude wants to take an action, it asks for your approval:

\`\`\`
> Fix the typo in src/utils.ts

Claude: I'll read the file first.
  [Read] src/utils.ts
  Allow? (y/n/a)
\`\`\`

- **y** — Yes, allow this one action
- **n** — No, reject this action
- **a** — Always allow this type of action (for this session)

For frequently-used actions, pressing "a" saves time.

### Basic Operations

**Reading files:**
\`\`\`
> What does the main config file contain?

Claude reads the relevant config file and summarizes it.
\`\`\`

**Editing files:**
\`\`\`
> Add a "lastModified" field to the User interface in types.ts

Claude shows you the edit diff and asks for approval.
  [Edit] src/types.ts
  - interface User { name: string; email: string; }
  + interface User { name: string; email: string; lastModified: Date; }
  Allow? (y/n)
\`\`\`

**Running commands:**
\`\`\`
> Run the test suite

Claude executes your test command.
  [Bash] npm test
  Allow? (y/n)
\`\`\`

**Searching code:**
\`\`\`
> Where is the authentication middleware defined?

Claude uses Grep and Glob to find relevant files.
\`\`\`

### Multi-Step Workflows

Claude Code excels when tasks require multiple steps:

\`\`\`
> Add input validation to the signup API endpoint

Claude:
1. [Read] src/app/api/auth/signup/route.ts — reads the current code
2. [Read] src/lib/validation.ts — checks for existing validation utilities
3. [Edit] src/app/api/auth/signup/route.ts — adds validation logic
4. [Bash] npm test — runs tests to verify
5. Reports: "Added email format validation, password strength check,
   and username length validation to the signup endpoint. All tests pass."
\`\`\`

### Useful Built-in Commands

| Command | Action |
|---------|--------|
| \`/help\` | Show all available commands |
| \`/clear\` | Clear the current conversation |
| \`/compact\` | Summarize conversation to save context |
| \`/status\` | Show current session info |
| \`/cost\` | Show token usage and estimated cost |
| \`/undo\` | Undo the last file change |

### Tips for Your First Session

1. **Start small**: Ask Claude to read and explain before making changes
2. **Be specific**: "Add email validation to the signup form" is better than "improve the form"
3. **Review diffs**: Always check the proposed edits before approving
4. **Use /undo**: If an edit doesn't look right, undo it immediately
5. **Check with tests**: Ask Claude to run tests after making changes

### Session Example: Bug Fix Workflow

\`\`\`
> The login page shows a blank screen on mobile. Can you investigate and fix it?

Claude:
1. Reads the login page component
2. Reads the CSS/styles
3. Identifies a CSS media query issue
4. Proposes a fix with a diff
5. You approve
6. Claude runs the dev server to verify
7. Reports the fix with explanation
\`\`\`

### Key Takeaway

A Claude Code session is a conversation where Claude can take actions in your development environment. The approval flow keeps you in control — Claude proposes, you decide. Start with read-only exploration ("explain this code") before moving to edits ("fix this bug"). The more context you provide, the better Claude's actions will be.`,
    },
    {
      id: "gs-claude-md",
      slug: "claude-md-configuration",
      title: "CLAUDE.md Configuration",
      content: `## CLAUDE.md Configuration

**CLAUDE.md** is the most powerful feature you're probably not using. It's a markdown file at the root of your project that gives Claude persistent instructions about your project — coding conventions, architecture decisions, common commands, and rules. Claude reads it at the start of every session.

### Why CLAUDE.md Matters

Without CLAUDE.md, Claude starts every session with zero context about your project's specific conventions. With it, Claude immediately knows:

- What framework and language you use
- Your naming conventions and code style
- How to run tests, build, and deploy
- What patterns to follow and what to avoid
- Known issues and workarounds

### Basic CLAUDE.md Template

\`\`\`markdown
# Project: My App

## Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Vitest for testing

## Commands
- \\\`npm run dev\\\` — Start development server
- \\\`npm test\\\` — Run tests
- \\\`npm run build\\\` — Production build
- \\\`npx prisma migrate dev\\\` — Run database migrations

## Conventions
- Use server components by default
- Client components only when interactivity is needed
- All API routes in src/app/api/
- Database queries through Prisma service layer (src/lib/db/)
- Use Zod for all input validation

## Rules
- NEVER commit .env files
- ALWAYS run tests before committing
- Use conventional commits (feat:, fix:, docs:, etc.)
- Error responses follow RFC 7807 format

## Known Issues
- Hot reload sometimes fails for server components (restart dev server)
- Prisma client needs regeneration after schema changes
\`\`\`

### CLAUDE.md vs .cursorrules vs System Prompts

| Feature | CLAUDE.md | .cursorrules | System Prompt |
|---------|:---------:|:------------:|:-------------:|
| Persistent | Yes (in git) | Yes (in git) | No |
| Per-project | Yes | Yes | No |
| Claude Code | Reads automatically | Ignores | N/A |
| Cursor | Ignores | Reads automatically | Per-chat |
| Versioned | With your code | With your code | Not saved |

### Advanced CLAUDE.md Patterns

**Architecture documentation:**
\`\`\`markdown
## Architecture
- Frontend: React components in src/components/
- API: Route handlers in src/app/api/
- Database: Prisma models in prisma/schema.prisma
- Auth: NextAuth.js with JWT strategy
- State: React Context (no Redux)

## Data Flow
User → Component → API Route → Prisma → PostgreSQL
\`\`\`

**File generation patterns:**
\`\`\`markdown
## When Creating New Components
- Place in src/components/<feature>/
- Use this template:
  - ComponentName.tsx (main component)
  - ComponentName.test.tsx (tests)
  - index.ts (barrel export)
- Always include TypeScript props interface
- Always include at least one test
\`\`\`

**Forbidden actions:**
\`\`\`markdown
## DO NOT
- Do not use \\\`any\\\` type in TypeScript
- Do not install new dependencies without asking
- Do not modify the database schema without discussing first
- Do not use inline styles (use Tailwind classes)
\`\`\`

### Multiple CLAUDE.md Files

For monorepos, use CLAUDE.md files at different levels:

\`\`\`
project/
├── CLAUDE.md           ← Root: global rules
├── packages/
│   ├── frontend/
│   │   └── CLAUDE.md   ← Frontend-specific rules
│   └── backend/
│       └── CLAUDE.md   ← Backend-specific rules
\`\`\`

Claude reads all CLAUDE.md files from the root to the current directory.

### Key Takeaway

CLAUDE.md is your project's instruction manual for Claude. Write it once, version it with your code, and Claude will follow your conventions in every session. Start with the basic template above and expand as you discover what Claude needs to know. A good CLAUDE.md is the difference between Claude being a generic assistant and a project-specific expert.

> **Resource**: [Claude Code Best Practices — CLAUDE.md](https://github.com/shanraisshan/claude-code-best-practice) includes comprehensive CLAUDE.md templates and patterns.`,
    },
    {
      id: "gs-settings",
      slug: "settings-permissions",
      title: "Settings & Permissions",
      content: `## Settings & Permissions

Claude Code's permission system controls what Claude can and cannot do. Understanding and configuring permissions is essential for both productivity (allowing safe operations automatically) and security (restricting dangerous actions).

### Permission Levels

Claude Code has three permission levels:

| Level | Description | Example |
|-------|-------------|---------|
| **Ask** | Requires approval every time | File edits, bash commands |
| **Allow** | Auto-approved (no prompt) | Read files, search code |
| **Deny** | Always blocked | Never allowed, even if requested |

### The Settings File

Settings are stored in \`.claude/settings.json\` at project or user level:

\`\`\`json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm test)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  }
}
\`\`\`

### Wildcard Permissions

Use wildcards for flexible permission patterns:

\`\`\`json
{
  "permissions": {
    "allow": [
      "Bash(npm *)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Edit(src/**)",
      "Write(src/**)"
    ]
  }
}
\`\`\`

This allows:
- Any npm command (\`npm test\`, \`npm run build\`, etc.)
- Git read commands (status, diff, log)
- Editing any file under \`src/\`
- Writing new files under \`src/\`

### Permission Strategies

**Conservative (high security):**
\`\`\`json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep"],
    "deny": ["Bash(rm *)", "Bash(sudo *)", "Write(.env*)"]
  }
}
\`\`\`
Everything else requires explicit approval.

**Productive (balanced):**
\`\`\`json
{
  "permissions": {
    "allow": [
      "Read", "Glob", "Grep",
      "Bash(npm *)", "Bash(npx *)",
      "Bash(git status)", "Bash(git diff*)", "Bash(git log*)",
      "Edit(src/**)", "Edit(tests/**)",
      "Write(src/**)", "Write(tests/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force*)",
      "Write(.env*)",
      "Write(*.pem)", "Write(*.key)"
    ]
  }
}
\`\`\`

**Trust mode (maximum productivity):**
\`\`\`json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Edit", "Write", "Bash"],
    "deny": ["Bash(rm -rf /*)"]
  }
}
\`\`\`
Use only in sandboxed environments or when you fully trust the workflow.

### Project vs User Settings

| Setting | Location | Scope | Shared |
|---------|----------|-------|:------:|
| **User** | \`~/.claude/settings.json\` | All projects | No |
| **Project (local)** | \`.claude/settings.local.json\` | This project, your machine | No |
| **Project (shared)** | \`.claude/settings.json\` | This project, all team members | Yes (git) |

Priority: Project local > Project shared > User settings

### Practical Tips

1. **Start conservative**: Begin with minimal permissions, add as needed
2. **Allow read operations**: There's rarely a reason to block Read, Glob, or Grep
3. **Allow test commands**: Let Claude run tests without asking (\`Bash(npm test)\`)
4. **Block destructive operations**: Always deny force pushes, recursive deletes
5. **Protect secrets**: Deny writes to .env, .pem, and credential files
6. **Review the "a" (always) choices**: When you press "a" during a session, it becomes a session-level allow

### Key Takeaway

Permissions balance productivity with safety. Allow read operations and test commands to reduce friction. Deny destructive operations and secret file access. Use project-level settings shared via git so your whole team has consistent permissions. As you build trust with Claude Code, gradually expand permissions for smoother workflows.`,
    },
  ],
};

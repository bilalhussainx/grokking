import { Module } from "../types";

export const workflowsModule: Module = {
  id: "cc-workflows",
  title: "Workflows",
  description: "Master Claude Code workflows — commands, plan mode, agent teams with git worktrees, monitoring loops, and session management.",
  lessons: [
    {
      id: "wf-commands",
      slug: "commands-slash-commands",
      title: "Commands & Slash Commands",
      content: `## Commands & Slash Commands

Claude Code provides built-in slash commands for common operations, plus the ability to define custom commands. These are shortcuts that save time and ensure consistency.

### Built-in Slash Commands

| Command | Description |
|---------|-------------|
| \`/help\` | Show all available commands and keyboard shortcuts |
| \`/clear\` | Clear the conversation (start fresh) |
| \`/compact\` | Summarize the conversation to free up context space |
| \`/status\` | Show session information (model, tokens used, etc.) |
| \`/cost\` | Display token usage and estimated cost |
| \`/undo\` | Undo the last file modification |
| \`/review\` | Review recent code changes |
| \`/init\` | Generate a CLAUDE.md file for the current project |
| \`/memory\` | View and manage persistent memories |
| \`/commit\` | Create a git commit with AI-generated message |
| \`/pr\` | Create a pull request |

### Using /compact Effectively

As your conversation grows, Claude's context window fills up. \`/compact\` summarizes the conversation, freeing space:

\`\`\`
> [After many messages about refactoring auth module]
> /compact

Claude: Summarized conversation. Key context preserved:
- Refactored auth middleware from session-based to JWT
- Updated 5 API routes to use new auth pattern
- Tests passing, 2 edge cases identified but not yet addressed
\`\`\`

### Using /commit

\`/commit\` analyzes your staged/unstaged changes and creates a well-formatted commit:

\`\`\`
> /commit

Claude:
  Analyzing changes...
  - Modified: src/auth/middleware.ts (JWT migration)
  - Modified: src/api/users.ts (updated auth checks)
  - Added: src/auth/jwt.ts (new JWT utility)

  Proposed commit message:
  "feat(auth): migrate from session-based to JWT authentication

   - Replace express-session with jsonwebtoken
   - Add JWT verification middleware
   - Update user API routes to use Bearer token auth"

  Create this commit? (y/n)
\`\`\`

### Non-Interactive Mode

Run Claude Code for one-off tasks without entering the interactive session:

\`\`\`bash
# Single prompt, get answer, exit
claude -p "What does src/auth/middleware.ts do?"

# Pipe input
echo "Explain this error" | claude -p

# Use in scripts
claude -p "Generate a migration for adding an email field to users table" > migration.sql
\`\`\`

### Command-Line Flags

| Flag | Description |
|------|-------------|
| \`-p "prompt"\` | Non-interactive: run one prompt and exit |
| \`--model MODEL\` | Use a specific model |
| \`--verbose\` | Show detailed tool call information |
| \`--resume SESSION\` | Resume a previous session |
| \`--output-format json\` | Output in JSON format |

### Custom Commands via Skills

You can create custom slash commands by adding skills:

\`\`\`markdown
<!-- In .claude/commands/review-security.md -->
Review this codebase for security vulnerabilities:
1. Check for SQL injection
2. Check for XSS vulnerabilities
3. Check for insecure authentication patterns
4. Check for exposed secrets or credentials
5. Report findings with severity ratings
\`\`\`

Then use: \`/review-security\`

### Key Takeaway

Slash commands are productivity multipliers. Use \`/compact\` to manage context, \`/commit\` for clean git history, \`/init\` for project setup, and non-interactive mode (\`-p\`) for scripting. Create custom commands for repetitive workflows your team runs frequently.`,
    },
    {
      id: "wf-plan-mode",
      slug: "plan-mode",
      title: "Plan Mode",
      content: `## Plan Mode

**Plan mode** is one of the most valuable Claude Code workflows. Instead of jumping straight into code changes, you ask Claude to create a detailed specification first. Review and refine the plan, then let Claude execute it. This produces significantly better results for complex tasks.

### The Problem with "Just Do It"

When you say "Add authentication to this app," Claude might:
- Pick a library you don't want
- Implement a pattern that doesn't fit your architecture
- Miss important requirements
- Make changes that are hard to undo

### The Plan-First Approach

\`\`\`
Step 1: "Plan how to add JWT authentication to this Next.js app"
Step 2: Review the plan, request changes
Step 3: "Execute the plan"
\`\`\`

### How to Use Plan Mode

**Step 1: Request a plan**

\`\`\`
> Plan how to add JWT authentication to this Next.js app.
> Don't make any changes yet — just create a detailed plan.

Claude:
## Authentication Plan

### Libraries
- jose (JWT handling, no native dependencies)
- bcrypt (password hashing)

### Changes
1. Create src/lib/auth.ts — JWT sign/verify utilities
2. Create src/middleware.ts — protect routes via Next.js middleware
3. Create src/app/api/auth/login/route.ts — login endpoint
4. Create src/app/api/auth/signup/route.ts — signup endpoint
5. Update prisma/schema.prisma — add password field to User
6. Create src/contexts/AuthContext.tsx — client-side auth state

### Protected Routes
- /dashboard/* — redirect to /login if not authenticated
- /api/* (except /api/auth/*) — return 401 if no valid JWT

### Token Strategy
- Access token: 15 min expiry, stored in memory
- Refresh token: 7 day expiry, stored in httpOnly cookie

Shall I proceed with this plan?
\`\`\`

**Step 2: Refine**

\`\`\`
> Use next-auth instead of manual JWT. Also add Google OAuth.
> Update the plan.

Claude: [Updated plan with NextAuth.js + Google provider]
\`\`\`

**Step 3: Execute**

\`\`\`
> Looks good. Execute the plan.

Claude: [Creates files, installs dependencies, implements auth]
\`\`\`

### When to Use Plan Mode

| Task | Plan First? | Why |
|------|:-----------:|-----|
| Fix a typo | No | Trivial, just do it |
| Add a button | No | Small, reversible |
| New API endpoint | Maybe | Depends on complexity |
| New feature | Yes | Multiple files, design decisions |
| Architecture change | Definitely | High impact, hard to reverse |
| Migration | Definitely | Complex, many steps |

### Plan Mode Tips

1. **Be explicit**: Say "plan only, don't make changes" to prevent premature execution
2. **Ask for alternatives**: "Show me two approaches with tradeoffs"
3. **Specify constraints**: "The plan must use our existing Prisma setup"
4. **Request a checklist**: "Include a testing checklist for each step"
5. **Save the plan**: Plans become documentation; ask Claude to save it

### Advanced: Spec-Driven Development

For large features, write a full spec first:

\`\`\`
> Write a technical specification for adding a notification system.
> Include: data model, API design, UI components, and edge cases.
> Save it to docs/specs/notifications.md

[After review]

> Implement the notification system according to docs/specs/notifications.md
\`\`\`

### Key Takeaway

Plan mode is the highest-leverage technique in Claude Code. By separating planning from execution, you catch design issues before they become code issues. Use it for any task that modifies more than 2-3 files or involves architectural decisions. The few minutes spent reviewing a plan save hours of refactoring.

> **Resource**: [Claude Code Best Practices](https://github.com/shanraisshan/claude-code-best-practice) — Section on "Research, Plan, Implement" (RPI) methodology.`,
    },
    {
      id: "wf-agent-teams",
      slug: "agent-teams",
      title: "Agent Teams (tmux + git worktrees)",
      content: `## Agent Teams: tmux + git Worktrees

One Claude Code session is powerful. Multiple sessions working in parallel on different parts of your project? That's an **agent team**. Using tmux (terminal multiplexer) and git worktrees, you can run multiple Claude Code instances simultaneously without conflicts.

### Why Agent Teams?

A single Claude Code session is sequential — it does one thing at a time. For large projects, you can parallelize:

\`\`\`
Session 1: "Implement the user authentication module"
Session 2: "Build the notification service"
Session 3: "Write comprehensive tests for the API"

All running simultaneously, in separate worktrees, no merge conflicts.
\`\`\`

### Git Worktrees Explained

A **git worktree** is a separate working directory linked to the same repository. Each worktree can have a different branch checked out:

\`\`\`bash
# Create worktrees for parallel work
git worktree add ../project-auth feat/auth
git worktree add ../project-notifications feat/notifications
git worktree add ../project-tests feat/tests
\`\`\`

Now you have three directories, each with its own branch:
\`\`\`
~/project/                    ← main branch
~/project-auth/               ← feat/auth branch
~/project-notifications/      ← feat/notifications branch
~/project-tests/              ← feat/tests branch
\`\`\`

### Setting Up Agent Teams with tmux

\`\`\`bash
# Create a tmux session with multiple panes
tmux new-session -s agents

# Split into three panes
# Pane 1: Authentication
cd ~/project-auth && claude

# Pane 2: Notifications (Ctrl+b, % to split)
cd ~/project-notifications && claude

# Pane 3: Tests (Ctrl+b, " to split)
cd ~/project-tests && claude
\`\`\`

### Essential tmux Commands

| Key | Action |
|-----|--------|
| \`Ctrl+b %\` | Split pane vertically |
| \`Ctrl+b "\` | Split pane horizontally |
| \`Ctrl+b arrow\` | Move between panes |
| \`Ctrl+b z\` | Zoom in/out on current pane |
| \`Ctrl+b d\` | Detach from session |
| \`tmux attach -t agents\` | Re-attach to session |

### The Workflow

\`\`\`
1. Create feature branches: feat/auth, feat/notifications, feat/tests
2. Create git worktrees for each branch
3. Open tmux with one pane per worktree
4. Start Claude Code in each pane with a specific task
5. Monitor progress across panes
6. Merge branches when all tasks complete
\`\`\`

### Coordinating Agent Teams

When agents work in parallel, coordination matters:

**Shared CLAUDE.md**: Each worktree inherits the same CLAUDE.md, so all agents follow the same conventions.

**Interface contracts**: Define shared interfaces upfront:
\`\`\`
> (In auth worktree) "The auth module should export:
>   - signIn(email, password) → { user, token }
>   - signOut(token) → void
>   - verifyToken(token) → User | null
> Other modules will depend on these interfaces."
\`\`\`

**Merging**: After all agents complete:
\`\`\`bash
git checkout main
git merge feat/auth
git merge feat/notifications
git merge feat/tests
# Resolve any conflicts
\`\`\`

### Best Practices

1. **Define clear boundaries**: Each agent works on a separate feature/module
2. **Minimize shared files**: Reduce merge conflict risk
3. **Define interfaces first**: Agree on contracts between modules
4. **Use non-interactive mode**: For fire-and-forget tasks: \`claude -p "task" &\`
5. **Monitor costs**: Multiple agents = multiple API calls

### Key Takeaway

Agent teams multiply your throughput by running multiple Claude Code sessions in parallel. Git worktrees provide isolated working directories, and tmux lets you manage multiple sessions from one terminal. Use this pattern for large features that can be cleanly decomposed into independent modules.`,
    },
    {
      id: "wf-loop",
      slug: "loop-monitoring",
      title: "/loop for Monitoring & Recurring Tasks",
      content: `## /loop for Monitoring & Recurring Tasks

The **/loop** pattern turns Claude Code into a persistent monitor that repeatedly checks conditions and takes action. It's ideal for watching test results, monitoring builds, and maintaining code quality over time.

### What is /loop?

A loop is a Claude Code session that:
1. Executes a check or task
2. Evaluates the result
3. Takes action if needed
4. Waits and repeats

### Basic Loop Pattern

\`\`\`
> Run the test suite every time I save a file. If any tests fail,
> analyze the failure and suggest a fix. Keep running until I say stop.
\`\`\`

Claude will:
- Watch for file changes (via \`inotifywait\` or polling)
- Run \`npm test\` on each change
- Analyze failures and propose fixes
- Continue monitoring

### Practical Loop Examples

**Test Watcher:**
\`\`\`
> Monitor the test suite. Every 30 seconds, run npm test.
> If any test fails, read the failing test and the source file,
> then propose a fix. Don't apply fixes automatically.
\`\`\`

**Build Monitor:**
\`\`\`
> Run npm run build in a loop. Each time it fails, analyze the
> error and fix it. Keep going until the build succeeds.
\`\`\`

**Lint-Fix Loop:**
\`\`\`
> Run eslint on the project. Fix all auto-fixable issues.
> For non-auto-fixable issues, fix them manually.
> Keep running until there are zero lint errors.
\`\`\`

**Type Check Loop:**
\`\`\`
> Run tsc --noEmit to check for TypeScript errors.
> Fix each error one by one. After fixing, re-run the check.
> Continue until there are zero type errors.
\`\`\`

### The "Ralph Wiggum" Pattern

Named by the community, this is a long-running autonomous loop where Claude works through a large set of tasks:

\`\`\`
> Here's a list of 50 TODO items in our codebase.
> Work through each one sequentially:
> 1. Read the TODO comment and surrounding code
> 2. Implement the TODO
> 3. Run tests to verify
> 4. Move to the next one
> Continue until all 50 are done.
\`\`\`

### Loop Safety

Always include safety boundaries:

\`\`\`
> Run the migration loop, but:
> - Stop after 20 iterations maximum
> - Don't modify any file more than twice
> - If you encounter an error you can't fix in 2 attempts, skip it and move on
> - Log all changes to a changelog.md file
\`\`\`

### Loop + Non-Interactive Mode

Run loops in the background:

\`\`\`bash
# Start a loop in the background
claude -p "Run npm test every 60 seconds. Report failures to slack." &

# Or in a tmux pane
tmux new-session -d -s test-watcher 'claude -p "Watch tests..."'
\`\`\`

### When to Use Loops

| Scenario | Loop Pattern |
|----------|-------------|
| Continuous testing | Test on every save |
| Build fixing | Build → analyze → fix → repeat |
| Code migration | Process files one by one |
| Linting cleanup | Lint → fix → re-lint until clean |
| TODO resolution | Work through TODO list sequentially |
| Data processing | Process records in batches |

### Key Takeaway

Loops turn Claude Code from an interactive assistant into an autonomous worker. Use them for repetitive tasks like fixing build errors, resolving lint issues, or working through TODO lists. Always set safety boundaries (max iterations, skip-on-failure) to prevent runaway loops.`,
    },
    {
      id: "wf-session-mgmt",
      slug: "session-management",
      title: "Session Management",
      content: `## Session Management

Claude Code sessions are persistent — you can resume previous conversations, rename them for organization, and rewind to earlier states. Effective session management keeps your work organized and lets you pick up where you left off.

### Session Basics

Every time you run \`claude\`, a new session is created. Sessions store:
- The full conversation history
- Tool call results (file reads, command outputs)
- Any file modifications made during the session

### Resuming Sessions

\`\`\`bash
# List recent sessions
claude --list

# Resume the most recent session
claude --resume

# Resume a specific session by ID
claude --resume SESSION_ID
\`\`\`

When you resume, Claude has the full context of the previous conversation. You can continue exactly where you left off:

\`\`\`
> (Resumed session from yesterday)
> We were working on the notification system. What's left to do?

Claude: Based on our previous conversation, we completed:
1. Database schema for notifications
2. API endpoints for CRUD operations

Still remaining:
3. Real-time WebSocket delivery
4. Email notification integration
5. Frontend notification panel
\`\`\`

### Renaming Sessions

Give sessions meaningful names for easy reference:

\`\`\`bash
# Rename during a session
> /rename auth-migration

# Now easy to find later
claude --list
# auth-migration (2 hours ago)
# notification-system (yesterday)
# bug-fix-login (3 days ago)
\`\`\`

### Rewinding Sessions

Made a wrong turn? Rewind to an earlier point:

\`\`\`
> /rewind

Claude: Session history:
  [1] Initial question about auth
  [2] Discussed JWT vs session approach
  [3] Started implementing JWT (made file changes)  ← you are here
  [4] Realized we need session-based instead

  Rewind to step? 2

Claude: Rewound to step 2. File changes from steps 3-4 have been undone.
\`\`\`

### Session Strategies

**Feature sessions**: One session per feature, named clearly:
\`\`\`
auth-jwt-migration
dashboard-charts
api-rate-limiting
\`\`\`

**Daily sessions**: Resume and continue day-to-day work:
\`\`\`
claude --resume  # Pick up where you left off yesterday
\`\`\`

**Exploration sessions**: Quick sessions for research, don't need to be saved:
\`\`\`
claude -p "How does the payment flow work in this codebase?"
\`\`\`

### Context Window Management

Long sessions fill the context window. Strategies:

1. **\`/compact\`**: Summarize the conversation periodically
2. **New session with context**: Start fresh but include key context from the old session
3. **CLAUDE.md**: Put persistent context in CLAUDE.md so it's always available

\`\`\`
> /compact
Claude: Compressed conversation. Summary:
- Working on auth migration from sessions to JWT
- Completed: middleware, login endpoint, signup endpoint
- In progress: token refresh mechanism
- Decision: using jose library, 15min access + 7day refresh tokens
\`\`\`

### Multi-Session Workflows

For large projects, use multiple named sessions:

\`\`\`bash
# Morning: Work on frontend
claude --resume frontend-dashboard

# Afternoon: Switch to backend
claude --resume api-optimization

# Quick fix: Start a new session
claude  # New unnamed session for the bug fix
\`\`\`

### Key Takeaway

Sessions are your ongoing workstreams. Name them meaningfully, resume when you return to a task, rewind when you take a wrong turn, and compact when context runs low. For large projects, maintain separate sessions for different features or modules. Good session hygiene makes Claude Code dramatically more effective for long-running projects.`,
    },
  ],
};

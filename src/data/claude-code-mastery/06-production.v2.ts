import { Module } from "../types";

export const productionModule: Module = {
  id: "cc-production",
  title: "Production Usage",
  description: "Scale Claude Code across teams and projects — monorepo strategies, permission management, CI/CD integration, team workflows, and a comprehensive best practices checklist.",
  lessons: [
    {
      id: "prod-monorepo",
      slug: "monorepo-strategies",
      title: "Monorepo Strategies",
      content: `## Monorepo Strategies

Working with Claude Code in a monorepo requires special strategies — multiple CLAUDE.md files, package-scoped rules, and careful context management. This lesson covers how to configure Claude Code for large, multi-package repositories.

### The Challenge

Monorepos contain multiple projects with different languages, frameworks, and conventions. A single CLAUDE.md at the root isn't enough:

\`\`\`
monorepo/
├── apps/
│   ├── web/          ← Next.js, TypeScript, Tailwind
│   ├── mobile/       ← React Native, TypeScript
│   └── api/          ← Express, TypeScript, Prisma
├── packages/
│   ├── ui/           ← Shared component library
│   ├── utils/        ← Shared utilities
│   └── config/       ← Shared configs
├── CLAUDE.md         ← Root-level rules
└── package.json
\`\`\`

### Hierarchical CLAUDE.md

Use multiple CLAUDE.md files — Claude reads all of them from root to current directory:

\`\`\`markdown
<!-- Root CLAUDE.md -->
# Monorepo: My Company

## Universal Rules
- TypeScript strict mode everywhere
- Use pnpm (not npm or yarn)
- All packages use shared ESLint config from packages/config
- Conventional commits required

## Commands
- \\\`pnpm install\\\` — Install all dependencies
- \\\`pnpm build\\\` — Build all packages
- \\\`pnpm test\\\` — Run all tests
- \\\`pnpm -F <package> <command>\\\` — Run command in specific package
\`\`\`

\`\`\`markdown
<!-- apps/web/CLAUDE.md -->
# Web Application

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Uses packages/ui for shared components

## Commands
- \\\`pnpm -F web dev\\\` — Start dev server
- \\\`pnpm -F web test\\\` — Run web tests
- \\\`pnpm -F web build\\\` — Production build

## Conventions
- Pages in src/app/
- Components in src/components/
- Use server components by default
- Import shared UI: import { Button } from '@company/ui'
\`\`\`

\`\`\`markdown
<!-- apps/api/CLAUDE.md -->
# API Server

## Stack
- Express.js
- Prisma ORM
- PostgreSQL

## Commands
- \\\`pnpm -F api dev\\\` — Start API server
- \\\`pnpm -F api test\\\` — Run API tests
- \\\`pnpm -F api db:migrate\\\` — Run migrations

## Conventions
- Routes in src/routes/
- Middleware in src/middleware/
- Database queries through Prisma service layer
- All routes need authentication middleware
\`\`\`

### The .claude/rules/ Directory

For more granular rules, use the \`.claude/rules/\` directory with glob-pattern-based rule files:

\`\`\`
.claude/rules/
├── api-routes.md        ← Rules for API development
├── react-components.md  ← Rules for React components
├── database.md          ← Rules for database operations
└── testing.md           ← Rules for writing tests
\`\`\`

Each rule file can specify which files it applies to:

\`\`\`markdown
<!-- .claude/rules/api-routes.md -->
# API Route Rules
Applies to: src/app/api/**/*

- All routes must validate input with Zod
- All routes must use the withAuth middleware
- Error responses must follow RFC 7807
- Always return appropriate status codes
\`\`\`

### Working in a Specific Package

Navigate to the package directory before starting Claude:

\`\`\`bash
# Work on the web app
cd apps/web && claude

# Work on the API
cd apps/api && claude

# Work at root level for cross-package changes
cd monorepo && claude
\`\`\`

### Cross-Package Changes

When changes span multiple packages:

\`\`\`
> I need to add a new 'UserAvatar' component to packages/ui
> and then use it in both apps/web and apps/mobile.
>
> 1. Create the component in packages/ui
> 2. Export it from the package
> 3. Update apps/web to use it
> 4. Update apps/mobile to use it
> 5. Run tests in all affected packages
\`\`\`

### Monorepo Tips

1. **Start in the right directory**: Claude reads CLAUDE.md files from cwd upward
2. **Use package filters**: \`pnpm -F web test\` is clearer than \`npm test\`
3. **Reference package names**: "The @company/ui package" is more specific than "the UI library"
4. **Separate concerns**: Root rules for universal conventions, package rules for specifics
5. **Test across packages**: After cross-package changes, test all affected packages

### Key Takeaway

Monorepo success with Claude Code comes from hierarchical CLAUDE.md files and working in the right directory. Root-level rules set universal conventions, package-level rules set specific guidelines, and \`.claude/rules/\` files add granular, glob-pattern-based rules. Navigate to the relevant package before starting Claude to give it focused context.`,
    },
    {
      id: "prod-permissions",
      slug: "permission-management",
      title: "Permission Management",
      content: `## Permission Management

At team scale, permissions need to be consistent, auditable, and secure. This lesson covers advanced permission patterns for teams using Claude Code across multiple projects.

### Permission Architecture

\`\`\`
User Settings (~/.claude/settings.json)
     ↓ (lowest priority)
Project Settings (.claude/settings.json)
     ↓
Local Overrides (.claude/settings.local.json)
     ↓ (highest priority)
Session Overrides (pressing "a" during session)
\`\`\`

### Team Permission Template

A balanced permission set for most development teams:

\`\`\`json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm test*)",
      "Bash(npm run lint*)",
      "Bash(npm run build*)",
      "Bash(npx tsc*)",
      "Bash(npx prettier*)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git branch*)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(head *)",
      "Bash(tail *)",
      "Bash(wc *)",
      "Edit(src/**)",
      "Edit(tests/**)",
      "Edit(docs/**)",
      "Write(src/**)",
      "Write(tests/**)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)",
      "Bash(curl * | bash)",
      "Bash(wget * | bash)",
      "Write(.env*)",
      "Write(*.pem)",
      "Write(*.key)",
      "Write(*.secret)",
      "Edit(.env*)",
      "Edit(*.pem)",
      "Edit(*.key)"
    ]
  }
}
\`\`\`

### Wildcard Patterns

| Pattern | Matches |
|---------|---------|
| \`Bash(npm *)\` | Any npm command |
| \`Bash(git log*)\` | git log, git log --oneline, etc. |
| \`Edit(src/**)\` | Any file under src/ recursively |
| \`Write(*.ts)\` | Any TypeScript file |
| \`Bash(docker *)\` | Any docker command |

### Role-Based Permissions

Different team members may need different permissions:

**Junior Developer:**
\`\`\`json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash(npm test*)"],
    "deny": ["Bash(git push*)", "Write(prisma/*)", "Edit(*.config.*)"]
  }
}
\`\`\`

**Senior Developer:**
\`\`\`json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash", "Edit", "Write"],
    "deny": ["Bash(rm -rf /*)","Bash(sudo *)","Write(.env*)"]
  }
}
\`\`\`

**CI/CD (fully automated):**
\`\`\`json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep", "Bash(npm *)","Bash(git *)"],
    "deny": ["Edit", "Write", "Bash(rm *)", "Bash(sudo *)"]
  }
}
\`\`\`

### Auditing Permissions

Track what Claude Code does for compliance:

\`\`\`json
{
  "permissions": {
    "allow": ["Read", "Glob", "Grep"],
    "deny": ["Write(.env*)"]
  },
  "hooks": {
    "pre-tool": [
      {
        "command": "echo '$(date): $TOOL_NAME $TOOL_ARGS' >> .claude/audit.log",
        "description": "Audit all tool calls"
      }
    ]
  }
}
\`\`\`

### Sharing Permissions

**Team-wide permissions** (checked into git):
\`\`\`
.claude/settings.json → Same for everyone
\`\`\`

**Personal overrides** (gitignored):
\`\`\`
.claude/settings.local.json → Individual preferences
.gitignore: .claude/settings.local.json
\`\`\`

### Key Takeaway

Permission management at team scale requires a layered approach: shared team permissions in version control, personal overrides in gitignored files, and role-based access for different team members. Always deny destructive operations and secret file access. Use audit hooks for compliance and visibility.`,
    },
    {
      id: "prod-cicd",
      slug: "cicd-integration",
      title: "CI/CD Integration",
      content: `## CI/CD Integration

Claude Code can be integrated into your CI/CD pipeline for automated code review, test generation, documentation updates, and more. This lesson covers practical CI/CD integration patterns.

### GitHub Actions Integration

**Automated PR Review:**

\`\`\`yaml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Review PR
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Review the changes in this PR. Check for:
            1. Bugs and logic errors
            2. Security vulnerabilities
            3. Performance issues
            4. Type safety
            5. Test coverage gaps

            Output a markdown review summary."  > review.md

      - name: Post Review Comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
\`\`\`

**Automated Test Generation:**

\`\`\`yaml
name: Generate Missing Tests
on:
  push:
    branches: [main]

jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Find untested files
        run: |
          # Find source files without corresponding test files
          find src -name "*.ts" -not -name "*.test.ts" | while read f; do
            test_file="\${f%.ts}.test.ts"
            if [ ! -f "$test_file" ]; then
              echo "$f" >> untested.txt
            fi
          done

      - name: Generate tests
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          if [ -f untested.txt ]; then
            claude -p "Read untested.txt and generate unit tests
              for each file listed. Follow existing test patterns
              in the codebase."
          fi
\`\`\`

### Pre-Commit Hooks

Use Claude Code in git pre-commit hooks:

\`\`\`bash
#!/bin/bash
# .git/hooks/pre-commit

# Get staged files
staged_files=$(git diff --cached --name-only --diff-filter=ACM)

if [ -n "$staged_files" ]; then
  # Quick security check on staged files
  result=$(claude -p "Check these files for security issues:
    $staged_files
    Return PASS if safe, FAIL:reason if not." 2>/dev/null)

  if [[ "$result" == FAIL* ]]; then
    echo "Security check failed: $result"
    exit 1
  fi
fi
\`\`\`

### Automated Documentation

Keep docs updated automatically:

\`\`\`yaml
name: Update API Docs
on:
  push:
    paths:
      - 'src/app/api/**'

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate API docs
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "Read all API route files in src/app/api/.
            Generate comprehensive API documentation in OpenAPI format.
            Include: endpoints, methods, parameters, responses, examples.
            Save to docs/api-reference.md"

      - name: Commit updated docs
        run: |
          git add docs/api-reference.md
          git diff --cached --quiet || git commit -m "docs: update API reference"
          git push
\`\`\`

### CI/CD Best Practices

| Practice | Description |
|----------|-------------|
| **Use non-interactive mode** | Always use \`claude -p\` in CI |
| **Set output format** | Use \`--output-format json\` for machine parsing |
| **Limit scope** | Focus reviews on changed files only |
| **Cache results** | Don't re-review unchanged code |
| **Set timeouts** | CI jobs should have time limits |
| **Control costs** | Use Haiku for simple checks, Sonnet for reviews |
| **Secure API keys** | Always use GitHub Secrets |

### Key Takeaway

CI/CD integration extends Claude Code beyond individual developers to the entire development pipeline. Automated reviews catch issues before merge, test generation improves coverage automatically, and documentation stays up to date. Use non-interactive mode (\`-p\`) in CI and secure your API keys with environment secrets.`,
    },
    {
      id: "prod-team",
      slug: "team-workflows",
      title: "Team Workflows",
      content: `## Team Workflows

When an entire team uses Claude Code, coordination becomes important. Shared configurations, consistent practices, and collaborative patterns ensure everyone benefits equally.

### Shared Configuration Files

Version-control these files so the whole team has identical setups:

\`\`\`
.claude/
├── settings.json           ← Shared permissions (in git)
├── settings.local.json     ← Personal overrides (gitignored)
├── commands/               ← Shared skills (in git)
│   ├── review.md
│   ├── scaffold.md
│   └── deploy.md
└── mcp.json                ← Shared MCP config (in git)

CLAUDE.md                    ← Project instructions (in git)

.gitignore additions:
  .claude/settings.local.json
  .claude/mcp.local.json
\`\`\`

### Onboarding New Team Members

Create an onboarding skill:

\`\`\`markdown
<!-- .claude/commands/onboard.md -->
# Team Onboarding

Welcome to the team! Here's how we use Claude Code:

1. Read CLAUDE.md for project conventions
2. Check .claude/settings.json for team permissions
3. Review available skills: list files in .claude/commands/

## Setup
1. Install Claude Code: npm install -g @anthropic-ai/claude-code
2. Copy .env.example to .env.local and fill in your values
3. Run: pnpm install
4. Run: pnpm dev to start the dev server
5. Try: /scaffold TestComponent to verify skills work

## Our Workflow
- Use /review before creating PRs
- Use /commit for consistent commit messages
- Use plan mode for features (never code first)
- Run /test-all before pushing

## Key Contacts
- Frontend questions → @sarah
- Backend questions → @mike
- DevOps questions → @alex
\`\`\`

Usage: New team member runs \`/onboard\` on their first day.

### Code Review Protocol

Standardize how your team reviews code:

\`\`\`markdown
<!-- .claude/commands/team-review.md -->
# Team Code Review Protocol

Review the current git diff against main:

## Checklist
- [ ] Types: No 'any', proper generics, strict null checks
- [ ] Tests: New code has >80% coverage
- [ ] Security: Input validation, auth checks, no exposed secrets
- [ ] Performance: No N+1 queries, proper caching
- [ ] Accessibility: ARIA labels, keyboard nav, contrast
- [ ] Documentation: Public APIs are documented
- [ ] Conventions: Follows patterns in CLAUDE.md

## Output Format
| File | Issue | Severity | Fix |
|------|-------|----------|-----|

## Summary
- Approve / Request Changes / Needs Discussion
\`\`\`

### Knowledge Sharing

When one team member discovers a useful pattern, share it:

\`\`\`
> /memory add "When implementing pagination, always use cursor-based
> pagination with the pattern in src/lib/pagination.ts. Offset-based
> pagination has performance issues with large datasets."
\`\`\`

This memory persists across sessions and helps maintain consistency.

### Collaborative Debugging

When multiple team members encounter the same issue:

\`\`\`
> Read the bug report in issues/234.md.
> Check if this was addressed in any recent commits.
> If not, investigate and propose a fix.
> Reference the issue number in the commit message.
\`\`\`

### Team Metrics

Track team-wide Claude Code usage:
- Time saved per developer per week
- Code review coverage (% of PRs reviewed by Claude)
- Bug detection rate (issues found by Claude vs manual review)
- Skill usage (which team skills are used most)

### Key Takeaway

Team success with Claude Code requires shared configuration, standardized workflows, and collaborative practices. Version-control your CLAUDE.md, permissions, and skills. Create onboarding and review skills for consistency. Share knowledge through memories and team skills so everyone benefits from collective discoveries.`,
    },
    {
      id: "prod-checklist",
      slug: "best-practices-checklist",
      title: "Best Practices Checklist",
      content: `## Best Practices Checklist

This comprehensive checklist distills the most important Claude Code practices into an actionable reference. Use it as a quick guide and share it with your team.

### Project Setup

- [ ] **Create CLAUDE.md** at project root with stack, commands, and conventions
- [ ] **Configure permissions** in \`.claude/settings.json\` — allow reads, deny destructive ops
- [ ] **Add \`.claude/settings.local.json\` to \`.gitignore\`** for personal overrides
- [ ] **Create essential skills** in \`.claude/commands/\`: review, scaffold, deploy
- [ ] **Set up MCP servers** for databases, APIs, and search tools
- [ ] **Configure hooks** for auto-formatting and linting

### Daily Workflow

- [ ] **Start sessions in the right directory** — CLAUDE.md context depends on cwd
- [ ] **Use plan mode for features** — Research, Plan, then Implement
- [ ] **Review diffs before approving** — Always check proposed edits
- [ ] **Run tests after changes** — Ask Claude to verify with \`npm test\`
- [ ] **Use /compact when context fills** — Summarize to free space
- [ ] **Name sessions** for easy resume — \`/rename auth-migration\`

### Prompting

- [ ] **Be specific** — "Add email validation to signup" not "improve the form"
- [ ] **Set constraints** — "Don't add new dependencies" "Only modify src/auth/"
- [ ] **Provide examples** — Show the pattern you want Claude to follow
- [ ] **Ask for verification** — "Review what you just wrote for edge cases"
- [ ] **Use progressive complexity** — Build features in phases, not all at once
- [ ] **Think step by step** — For complex tasks, ask Claude to reason first

### Code Quality

- [ ] **TDD when possible** — Write tests first, implement second
- [ ] **Review with /review** — Check all changes before committing
- [ ] **Cross-model review** — Use Opus to review Sonnet's code
- [ ] **Run the full test suite** — After any significant change
- [ ] **Use /undo liberally** — Revert changes that don't look right
- [ ] **Check for regressions** — "Did this change break anything else?"

### Safety

- [ ] **Never commit secrets** — Deny writes to .env, .pem, .key files
- [ ] **Block destructive commands** — Deny \`rm -rf\`, \`git push --force\`
- [ ] **Scope file access** — Only allow writes to src/ and tests/
- [ ] **Audit tool calls** — Log what Claude does for review
- [ ] **Use sandbox for experiments** — Don't risk your main codebase
- [ ] **Review before merging** — Always check AI-generated code

### Team

- [ ] **Share CLAUDE.md via git** — Everyone uses the same project rules
- [ ] **Share skills via git** — Team-wide commands in \`.claude/commands/\`
- [ ] **Standardize review process** — Use the same review skill for all PRs
- [ ] **Create onboarding skill** — New members get up to speed fast
- [ ] **Track team metrics** — Measure time saved and quality improvements
- [ ] **Share knowledge** — Add team learnings to CLAUDE.md and memories

### Performance & Cost

- [ ] **Match model to task** — Haiku for simple, Sonnet for standard, Opus for complex
- [ ] **Use non-interactive for scripts** — \`claude -p\` in CI/CD
- [ ] **Monitor costs** — Use \`/cost\` to track spending
- [ ] **Cache when possible** — Don't re-analyze unchanged code
- [ ] **Set boundaries for loops** — Max iterations, skip-on-failure

### Git Integration

- [ ] **Use /commit for consistent messages** — AI-generated commit messages
- [ ] **Use /pr for pull requests** — Includes description and test plan
- [ ] **Use agent teams for parallel work** — Git worktrees + tmux
- [ ] **Never force push without explicit approval** — Deny by default
- [ ] **Review git diffs regularly** — Know what's changing in your codebase

### Advanced

- [ ] **Use hooks for deterministic guardrails** — Format, lint, type check
- [ ] **Use MCP for external integrations** — Database, GitHub, Slack
- [ ] **Use sub-agents for complex tasks** — Decompose and delegate
- [ ] **Use remote control for monitoring** — Long tasks from any device
- [ ] **Use sandbox for risky experiments** — Zero-risk exploration
- [ ] **Use the Ralph Wiggum Loop for bulk tasks** — Autonomous batch processing

### Key Takeaway

This checklist represents hundreds of hours of collective Claude Code experience. Start with the Project Setup and Daily Workflow sections, then adopt the remaining practices as your usage matures. The most impactful practices are: CLAUDE.md configuration, plan mode for features, TDD workflow, and the review skill.

> **Resource**: [Claude Code Best Practices](https://github.com/shanraisshan/claude-code-best-practice) — The community-maintained source with 40+ tips, regularly updated.`,
    },
  ],
};

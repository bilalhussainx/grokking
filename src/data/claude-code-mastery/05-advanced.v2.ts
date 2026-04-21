import { Module } from "../types";

export const advancedModule: Module = {
  id: "cc-advanced",
  title: "Advanced Features",
  description: "Explore advanced Claude Code features — remote control, voice mode, sandbox mode, autonomous long-running tasks, and cross-model workflows.",
  lessons: [
    {
      id: "adv-remote",
      slug: "remote-control",
      title: "Remote Control (/rc)",
      content: `## Remote Control (/rc)

**Remote Control** mode lets you control a Claude Code session from another device — your phone, tablet, or another computer. Start Claude Code on your development machine, then send commands from anywhere.

### How Remote Control Works

\`\`\`
Dev Machine: claude --remote
  → Generates a connection URL/code

Phone/Tablet: Open browser → paste URL
  → See Claude Code's output
  → Type commands
  → Commands execute on the dev machine
\`\`\`

### Use Cases

**1. Mobile Monitoring**
Start a long-running task on your desktop, then monitor from your phone while away:

\`\`\`bash
# On your dev machine
claude --remote
# Generates: https://claude.ai/rc/abc123

# On your phone browser
# Navigate to the URL
# Watch Claude work and send additional instructions
\`\`\`

**2. Pair Programming**
Share the remote URL with a colleague so they can watch and contribute:

\`\`\`
You: Working on the auth module
Colleague: (via remote) "Also check the session timeout handling"
Claude: Addresses both your local and remote inputs
\`\`\`

**3. Cross-Device Workflows**
Start researching on your laptop, continue implementation on your desktop:

\`\`\`
Laptop: "Research the best approach for implementing WebSocket auth"
Desktop: (via remote) "Good findings. Now implement Option 2"
\`\`\`

### Starting Remote Control

\`\`\`bash
# Start with remote control enabled
claude --remote

# Or enable during a session
> /remote
\`\`\`

### Security Considerations

- Remote sessions are authenticated — only you can connect
- All communication is encrypted
- Sessions have configurable timeouts
- You can revoke remote access at any time with \`/remote stop\`

### Practical Tips

1. **Start long tasks before leaving**: Kick off a migration, then monitor via phone
2. **Use for code reviews**: Review PRs from your tablet while on the couch
3. **Emergency fixes**: Push a quick fix from your phone when a production issue hits
4. **Pair programming**: Share the URL instead of screen sharing

### Key Takeaway

Remote Control extends Claude Code beyond your physical workstation. Start tasks on your dev machine and monitor or direct them from any device with a browser. It's particularly powerful for long-running tasks that you want to supervise without being tied to your desk.`,
    },
    {
      id: "adv-voice",
      slug: "voice-mode",
      title: "Voice Mode (/voice)",
      content: `## Voice Mode (/voice)

**Voice mode** lets you talk to Claude Code instead of typing. Speak your instructions, Claude transcribes them, and executes the task. This is ideal for brainstorming, hands-free coding, and accessibility.

### How Voice Mode Works

\`\`\`
You: [speaking] "Add a loading spinner to the user profile page"
Claude Code: [transcribes] → [executes] → [shows results]
You: [speaking] "Looks good, but make it centered"
Claude Code: [transcribes] → [edits file] → [shows diff]
\`\`\`

### Starting Voice Mode

\`\`\`bash
# Start Claude Code in voice mode
claude --voice

# Or toggle during a session
> /voice
\`\`\`

### Voice Mode Best Practices

**1. Be Specific with Technical Terms**
Voice recognition handles code terminology well, but be clear:

\`\`\`
Good: "Add a useEffect hook that fetches data on component mount"
Less clear: "Add the effect thing for getting data"
\`\`\`

**2. Spell Out Unusual Names**
\`\`\`
"Edit the file src slash components slash capital-U User capital-P Profile dot tsx"
Or simply: "Edit the UserProfile component"
\`\`\`

**3. Dictate Code Structure**
You can dictate code patterns verbally:
\`\`\`
"Create an interface called UserProps with fields:
  name of type string,
  email of type string,
  age of type number optional"
\`\`\`

### When Voice Mode Shines

| Scenario | Voice Advantage |
|----------|:---------------:|
| Brainstorming architecture | Think out loud, Claude captures |
| Hands occupied (standing desk) | Code without typing |
| Quick commands | Faster than typing for short instructions |
| Accessibility needs | Essential for users who can't type |
| Mobile remote control | Speak commands from phone |

### Voice + Remote Control

Combine voice with remote control for ultimate flexibility:

\`\`\`bash
claude --voice --remote
# Control Claude Code by speaking into your phone
\`\`\`

### Voice Command Patterns

**Navigation:**
\`\`\`
"Show me the auth middleware"
"Open the config file"
"What files changed recently?"
\`\`\`

**Editing:**
\`\`\`
"Add error handling to the login function"
"Remove the deprecated API endpoint"
"Rename the variable from 'data' to 'userData'"
\`\`\`

**Git operations:**
\`\`\`
"Show me the git status"
"Commit these changes with message: fix login validation"
"Create a pull request for this branch"
\`\`\`

### Key Takeaway

Voice mode makes Claude Code accessible from any position and any device. It's natural for brainstorming, efficient for quick commands, and essential for accessibility. Speak clearly, use technical terms confidently, and combine with remote control for the full hands-free experience.`,
    },
    {
      id: "adv-sandbox",
      slug: "sandbox-mode",
      title: "Sandbox Mode (/sandbox)",
      content: `## Sandbox Mode (/sandbox)

**Sandbox mode** creates an isolated environment where Claude Code can experiment freely without affecting your actual codebase. It's perfect for prototyping, testing risky changes, and exploring alternatives.

### How Sandbox Works

\`\`\`
Your Codebase (protected)
        │
        ├── Sandbox 1: "Try React Query migration"
        │     → Isolated copy, free experimentation
        │     → If it works: merge back
        │     → If it fails: discard, no damage
        │
        └── Sandbox 2: "Experiment with new auth approach"
              → Another isolated copy
              → Can try breaking changes safely
\`\`\`

### Starting a Sandbox

\`\`\`bash
# Enter sandbox mode
claude --sandbox

# Or during a session
> /sandbox

Claude: Created sandbox environment.
  Your changes won't affect the main codebase.
  Use /sandbox merge to apply changes back.
  Use /sandbox discard to throw everything away.
\`\`\`

### Use Cases

**1. Risky Refactoring**
\`\`\`
> /sandbox
> Refactor the entire database layer from Prisma to Drizzle ORM.
> Change everything needed — I want to see if this approach works.
\`\`\`

If it works, merge. If it doesn't, discard with zero consequences.

**2. Exploring Alternatives**
\`\`\`
> /sandbox
> Implement the auth module using passport.js instead of NextAuth.

[Later, in a new sandbox]
> /sandbox
> Implement the auth module using Lucia Auth instead of NextAuth.

[Compare both approaches, pick the winner]
\`\`\`

**3. Breaking Change Testing**
\`\`\`
> /sandbox
> Upgrade React from 18 to 19.
> Update all components for the new features.
> Run the full test suite and report what breaks.
\`\`\`

**4. Learning and Experimentation**
\`\`\`
> /sandbox
> I want to learn how WebSocket works.
> Create a simple chat server and client in this sandbox.
> I'll experiment and break things — that's the point.
\`\`\`

### Sandbox Commands

| Command | Action |
|---------|--------|
| \`/sandbox\` | Create a new sandbox |
| \`/sandbox merge\` | Apply sandbox changes to main codebase |
| \`/sandbox discard\` | Throw away all sandbox changes |
| \`/sandbox diff\` | Show differences from main codebase |
| \`/sandbox status\` | Show sandbox state |

### Sandbox + Git Worktrees

For larger experiments, sandboxes can use git worktrees under the hood:

\`\`\`
Main codebase: ~/project (on main branch)
Sandbox: ~/project-sandbox-1 (on temp branch sandbox/experiment-1)

/sandbox merge → git merge sandbox/experiment-1 into main
/sandbox discard → git worktree remove + git branch -D
\`\`\`

### Best Practices

1. **One experiment per sandbox**: Keep sandboxes focused
2. **Name your sandboxes**: \`/sandbox "react-query-migration"\` for clarity
3. **Test before merging**: Run full test suite in the sandbox
4. **Document findings**: Before discarding, save learnings to a note
5. **Time-box experiments**: Set a limit — "if this doesn't work in 30 min, discard"

### Key Takeaway

Sandbox mode gives you a risk-free environment for experimentation. Try bold refactors, explore alternative libraries, test breaking upgrades — all without any risk to your working codebase. If it works, merge. If it doesn't, discard. Zero consequences either way.`,
    },
    {
      id: "adv-ralph",
      slug: "ralph-wiggum-loop",
      title: "Ralph Wiggum Loop (Autonomous Tasks)",
      content: `## Ralph Wiggum Loop: Autonomous Long-Running Tasks

The **Ralph Wiggum Loop** (a community-coined term) is a pattern where you give Claude Code a large, well-defined task and let it work autonomously for an extended period. Named after its "set it and forget it" nature, this pattern maximizes throughput by minimizing human intervention.

### The Pattern

\`\`\`
> Here are 30 TODO items in the codebase. For each one:
> 1. Read the TODO comment and surrounding code
> 2. Implement what the TODO describes
> 3. Write a test for the change
> 4. Run tests to verify
> 5. Move to the next TODO
>
> Constraints:
> - If a TODO is unclear, skip it and note why
> - If tests fail after 2 fix attempts, skip and move on
> - Maximum 3 minutes per TODO
> - Log progress to progress.md
\`\`\`

Then walk away. Come back to find most TODOs resolved.

### When to Use the Ralph Loop

| Task | Good Fit? | Why |
|------|:---------:|-----|
| Resolve 50 TODOs | Yes | Well-defined, independent tasks |
| Migrate 100 files from JS to TS | Yes | Repetitive, clear rules |
| Fix all lint errors | Yes | Clear success criteria |
| Add error handling to 20 API routes | Yes | Pattern-based |
| Design a new architecture | No | Requires human judgment |
| Write a feature spec | No | Needs discussion |

### Setting Up for Success

**1. Clear Task Definition**
\`\`\`
Good: "Add input validation using Zod to each POST endpoint.
       Use the existing validation patterns in src/lib/validators/."

Bad: "Improve the API"
\`\`\`

**2. Safety Boundaries**
\`\`\`
Constraints:
- Don't modify database schema
- Don't change public API contracts
- Don't install new dependencies
- Stop if more than 3 tests fail consecutively
- Write all changes to a changelog
\`\`\`

**3. Progress Tracking**
\`\`\`
> Log progress to progress.md in this format:
> - [x] Task 1: Added validation to /api/users (2 min)
> - [x] Task 2: Added validation to /api/orders (1 min)
> - [ ] Task 3: SKIPPED — unclear requirements
> - [x] Task 4: Added validation to /api/products (3 min)
\`\`\`

**4. Quality Gates**
\`\`\`
After every 5 tasks:
1. Run the full test suite
2. Run the linter
3. If either fails, stop and report
\`\`\`

### Monitoring the Loop

Use tmux or remote control to check in:

\`\`\`bash
# In another terminal
tail -f progress.md

# Or via remote control
claude --remote  # Check progress from your phone
\`\`\`

### Post-Loop Review

Always review the results:

\`\`\`
> Show me a summary of everything you changed.
> Include:
> - Files modified
> - TODOs completed vs skipped
> - Test results
> - Any issues or concerns
\`\`\`

### Estimated Productivity Gains

| Task Size | Manual Time | Ralph Loop Time | Saving |
|-----------|:-----------:|:---------------:|:------:|
| 10 TODOs | 2 hours | 20 min | 83% |
| 50 lint fixes | 4 hours | 30 min | 88% |
| 20 migration files | 3 hours | 25 min | 86% |
| 100 type annotations | 6 hours | 45 min | 88% |

### Key Takeaway

The Ralph Wiggum Loop maximizes Claude Code's throughput by minimizing human intervention for well-defined, repetitive tasks. Set clear task definitions, safety boundaries, progress tracking, and quality gates. Then let Claude work autonomously while you focus on higher-level tasks. Always review the results before committing.`,
    },
    {
      id: "adv-cross-model",
      slug: "cross-model-workflows",
      title: "Cross-Model Workflows",
      content: `## Cross-Model Workflows

Different AI models have different strengths. **Cross-model workflows** leverage multiple models in the same development process — using each where it excels.

### Why Cross-Model?

| Model | Strength | Weakness |
|-------|----------|----------|
| **Claude Opus** | Complex reasoning, large codebases | Higher cost, slower |
| **Claude Sonnet** | Balanced speed/quality | Less deep reasoning |
| **Claude Haiku** | Fast, cheap, simple tasks | Limited complex reasoning |
| **GPT-4o** | Different perspective, vision | Different coding style |
| **Gemini** | Long context window | Less coding focus |

### Cross-Model Review Pattern

Use one model to generate, another to review:

\`\`\`bash
# Step 1: Generate with Claude Sonnet (fast)
claude --model claude-sonnet-4-20250514 -p "Implement the payment service"

# Step 2: Review with Claude Opus (thorough)
claude --model claude-opus-4-20250514 -p "Review src/services/payment.ts for bugs and security issues"
\`\`\`

### Model Switching in Sessions

Switch models within a single session for different tasks:

\`\`\`
> /model claude-haiku-4-20250414
> List all files that import from the auth module

[Quick scan — Haiku is fast and cheap for this]

> /model claude-sonnet-4-20250514
> Now refactor the auth module to use the strategy pattern

[Complex refactoring — Sonnet for balanced quality/speed]
\`\`\`

### The "Debate" Pattern

Have two models debate an architectural decision:

\`\`\`bash
# Model 1: Propose an approach
claude --model claude-sonnet-4-20250514 -p   "Propose the best way to implement caching in our Next.js app.
   Consider: Redis, in-memory, ISR, CDN." > approach1.md

# Model 2: Critique and counter-propose
claude --model claude-opus-4-20250514 -p   "Read approach1.md. Critique the proposed caching strategy.
   What are the weaknesses? Propose a better approach if applicable." > critique.md

# Model 1: Final synthesis
claude --model claude-sonnet-4-20250514 -p   "Read approach1.md and critique.md.
   Synthesize the best approach considering both perspectives." > final.md
\`\`\`

### Cost-Optimized Model Selection

\`\`\`
Task Classification → Model Selection

Simple lookups, formatting:      Haiku ($0.25/M input)
Standard coding, editing:        Sonnet ($3/M input)
Architecture, complex bugs:      Opus ($15/M input)
\`\`\`

### Practical Cross-Model Workflows

**1. Generate + Verify**
\`\`\`
Generate with Sonnet → Verify with Opus → Fix issues with Sonnet
\`\`\`

**2. Prototype + Polish**
\`\`\`
Prototype with Haiku (fast, cheap) → Polish with Sonnet (quality)
\`\`\`

**3. Research + Implement**
\`\`\`
Research with Opus (deep analysis) → Implement with Sonnet (efficient coding)
\`\`\`

**4. Bulk Process + Spot Check**
\`\`\`
Process 100 files with Haiku → Spot-check 10 results with Sonnet
\`\`\`

### Cross-Model Best Practices

1. **Match model to task**: Don't use Opus for trivial tasks or Haiku for complex ones
2. **Use the review pattern**: Generate with one model, review with another
3. **Track costs**: Monitor spending across models to optimize
4. **Standardize output**: Use consistent formats so models can read each other's output
5. **Default to Sonnet**: For most tasks, Sonnet offers the best quality/cost ratio

### Key Takeaway

Cross-model workflows let you optimize for quality, speed, and cost simultaneously. Use cheaper models for simple tasks, powerful models for complex ones, and the review pattern to catch errors. The combination of models produces better results than any single model alone.`,
    },
  ],
};

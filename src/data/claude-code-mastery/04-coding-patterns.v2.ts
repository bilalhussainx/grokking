import { Module } from "../types";

export const codingPatternsModule: Module = {
  id: "cc-coding-patterns",
  title: "Coding Patterns",
  description: "Apply proven coding patterns with Claude Code — RPI methodology, TDD workflows, automated code review, debugging strategies, and prompt engineering for code.",
  lessons: [
    {
      id: "cp-rpi",
      slug: "rpi-methodology",
      title: "RPI Methodology (Research-Plan-Implement)",
      content: `## RPI Methodology: Research-Plan-Implement

The **RPI methodology** is the most effective workflow for tackling complex features with Claude Code. Instead of diving straight into code, you follow three distinct phases: Research, Plan, and Implement.

### The Three Phases

\`\`\`
Phase 1: RESEARCH — Understand the problem space
Phase 2: PLAN    — Design the solution
Phase 3: IMPLEMENT — Write and test the code
\`\`\`

### Phase 1: Research

Ask Claude to investigate before making decisions:

\`\`\`
> I need to add real-time notifications. Before we do anything:
>
> 1. Read the current codebase to understand the existing architecture
> 2. Identify all places where notifications might be triggered
> 3. List the technologies we already use that could support this
> 4. Research the tradeoffs between WebSockets, SSE, and polling
>    for our use case (Next.js app with 1000 daily users)
>
> Don't write any code yet.
\`\`\`

Claude researches your codebase and presents findings:

\`\`\`
## Research Findings

### Current Architecture
- Next.js 14 with App Router
- Prisma + PostgreSQL
- No existing real-time infrastructure

### Notification Triggers Found
1. New message → src/app/api/messages/route.ts
2. Order status change → src/app/api/orders/[id]/route.ts
3. Team invitation → src/app/api/teams/invite/route.ts
4. Comment mention → src/app/api/comments/route.ts

### Technology Comparison
| Approach | Complexity | Scalability | Latency |
|----------|-----------|-------------|---------|
| WebSocket | High | Best | Lowest |
| SSE | Medium | Good | Low |
| Polling | Low | Limited | Medium |

### Recommendation
SSE (Server-Sent Events) — good fit for one-directional notifications,
supported natively by Next.js App Router, simpler than WebSockets.
\`\`\`

### Phase 2: Plan

Based on research, create a detailed implementation plan:

\`\`\`
> Good research. Let's go with SSE. Now create a detailed plan:
>
> - Database schema changes
> - New API endpoints
> - Frontend components
> - Integration points with existing code
> - Migration steps (no breaking changes)
>
> Still no code — just the plan.
\`\`\`

Claude produces a structured plan with file-level detail, which you can review and refine before any code is written.

### Phase 3: Implement

Execute the approved plan:

\`\`\`
> The plan looks good. Implement it step by step.
> After each step, run the relevant tests.
> If any step fails, stop and tell me before continuing.
\`\`\`

### Why RPI Works

| Without RPI | With RPI |
|-------------|----------|
| Jumps to coding immediately | Understands the problem first |
| Picks first solution that comes to mind | Evaluates tradeoffs |
| Realizes mid-implementation it's wrong | Catches issues in planning |
| Rewrites code multiple times | Gets it right the first time |
| 3 hours of back-and-forth | 1 hour total |

### RPI Prompts for Common Scenarios

**New Feature:**
\`\`\`
> Research: What patterns does this codebase use for [similar feature]?
> Plan: Design [feature] to follow existing patterns.
> Implement: Build [feature] according to the plan.
\`\`\`

**Bug Fix:**
\`\`\`
> Research: What is the root cause of [bug]? Trace the code path.
> Plan: What's the minimal fix that doesn't introduce regressions?
> Implement: Apply the fix and add a regression test.
\`\`\`

**Refactor:**
\`\`\`
> Research: Map all usages and dependencies of [module].
> Plan: Design the refactored version with a migration path.
> Implement: Refactor incrementally, testing at each step.
\`\`\`

### Key Takeaway

RPI is the single most important workflow pattern for Claude Code. Research prevents wrong assumptions, planning prevents wrong approaches, and structured implementation prevents regressions. Use it for any task that touches more than 2-3 files.

> **Resource**: [Claude Code Best Practices — RPI](https://github.com/shanraisshan/claude-code-best-practice) dedicates a full section to the Research-Plan-Implement methodology.`,
    },
    {
      id: "cp-tdd",
      slug: "tdd-with-claude-code",
      title: "TDD with Claude Code",
      content: `## TDD with Claude Code

Test-Driven Development (TDD) is a natural fit for Claude Code. The workflow: write a failing test, then ask Claude to make it pass. This produces well-tested code with clear specifications.

### The TDD Loop

\`\`\`
1. Write a failing test (you or Claude)
2. Claude implements the minimum code to pass it
3. Claude runs the test to verify
4. Refactor if needed
5. Repeat
\`\`\`

### Workflow 1: You Write Tests, Claude Implements

\`\`\`
> Here's a test for a password validation function:
>
> describe('validatePassword', () => {
>   it('requires at least 8 characters', () => {
>     expect(validatePassword('short')).toBe(false);
>     expect(validatePassword('longenough')).toBe(true);
>   });
>   it('requires at least one uppercase letter', () => {
>     expect(validatePassword('alllowercase1!')).toBe(false);
>     expect(validatePassword('HasUppercase1!')).toBe(true);
>   });
>   it('requires at least one number', () => {
>     expect(validatePassword('NoNumbers!')).toBe(false);
>     expect(validatePassword('HasNumber1!')).toBe(true);
>   });
> });
>
> Write the implementation to make all tests pass.

Claude:
1. Creates src/lib/validatePassword.ts with the implementation
2. Runs npm test -- validatePassword
3. All 3 tests pass
\`\`\`

### Workflow 2: Claude Writes Both Tests and Code

\`\`\`
> Implement a rate limiter using TDD:
> 1. First, write comprehensive tests for a rate limiter that:
>    - Allows 100 requests per minute per user
>    - Returns remaining requests count
>    - Resets after the time window
>    - Handles concurrent requests safely
> 2. Run the tests (they should all fail)
> 3. Implement the rate limiter to pass all tests
> 4. Run tests again to confirm they pass
\`\`\`

### Workflow 3: Test-First Bug Fixing

\`\`\`
> The login endpoint returns 500 when the email contains a plus sign
> (like user+tag@gmail.com).
>
> 1. Write a test that reproduces this bug
> 2. Run it to confirm it fails
> 3. Fix the bug
> 4. Run the test to confirm it passes
> 5. Run the full test suite to check for regressions
\`\`\`

### TDD Prompts

**For new features:**
\`\`\`
> Using TDD, implement [feature]:
> 1. Write tests first that define the expected behavior
> 2. Run tests to confirm they fail
> 3. Implement the minimum code to pass
> 4. Refactor for quality
> 5. Run all tests to verify no regressions
\`\`\`

**For edge cases:**
\`\`\`
> Write tests for edge cases of [function]:
> - Empty input
> - Very large input
> - Invalid types
> - Concurrent calls
> - Network failure (mock)
> Then implement handling for any failing tests.
\`\`\`

**For API endpoints:**
\`\`\`
> TDD the POST /api/users endpoint:
> Tests should cover:
> - Successful creation (201)
> - Missing required fields (400)
> - Duplicate email (409)
> - Invalid email format (400)
> - Database error (500)
> Write tests first, then implement.
\`\`\`

### Why TDD + Claude Code is Powerful

1. **Tests as specification**: Tests tell Claude exactly what you want
2. **Verification built in**: Every implementation is immediately tested
3. **Regression safety**: Running the full suite catches side effects
4. **Refactoring confidence**: Tests ensure refactoring doesn't break anything
5. **Documentation**: Tests serve as living documentation

### Key Takeaway

TDD with Claude Code is the most reliable way to produce correct, well-tested code. Write tests that define behavior, let Claude implement to pass them, and always run the full test suite. The tests serve as both specification and verification — Claude knows exactly what to build and you know exactly when it's right.`,
    },
    {
      id: "cp-code-review",
      slug: "code-review-automation",
      title: "Code Review Automation",
      content: `## Code Review Automation

Claude Code can perform thorough code reviews — catching bugs, security issues, performance problems, and style violations that humans often miss. This lesson covers how to use Claude for both manual reviews and automated CI integration.

### Manual Code Review

Review your current changes:

\`\`\`
> Review my current git diff. Check for:
> 1. Bugs and logic errors
> 2. Security vulnerabilities
> 3. Performance issues
> 4. TypeScript type safety
> 5. Consistency with our codebase patterns
>
> For each issue, specify: severity, file:line, description, and fix.
\`\`\`

### Focused Reviews

**Security review:**
\`\`\`
> Review src/app/api/ for security issues:
> - SQL injection
> - Missing input validation
> - Authentication bypass
> - Rate limiting gaps
> - Exposed secrets or sensitive data in responses
\`\`\`

**Performance review:**
\`\`\`
> Review src/components/ for performance issues:
> - Unnecessary re-renders
> - Missing React.memo or useMemo
> - Large bundle imports
> - Unoptimized images
> - Missing loading states
\`\`\`

**Accessibility review:**
\`\`\`
> Review src/components/ for accessibility:
> - Missing ARIA labels
> - Keyboard navigation support
> - Color contrast issues
> - Screen reader compatibility
> - Missing alt text on images
\`\`\`

### Review as a Skill

Create a reusable review skill:

\`\`\`markdown
<!-- .claude/commands/review-pr.md -->
# Review Pull Request

Review the current branch's changes against main:

1. Run: git diff main...HEAD
2. For each changed file, check:
   - Correctness: Logic errors, edge cases, null checks
   - Security: Input validation, auth, injection
   - Performance: Complexity, queries, caching
   - Types: TypeScript safety, no 'any', proper generics
   - Tests: New code has test coverage
   - Style: Consistent with codebase patterns

3. Output format:
   ## Review Summary
   - Files reviewed: N
   - Issues found: N (X critical, Y warnings, Z suggestions)

   ## Issues
   ### Critical
   - [file:line] Description and fix

   ### Warnings
   - [file:line] Description and fix

   ### Suggestions
   - [file:line] Description
\`\`\`

### CI Integration with GitHub App

Claude Code has a GitHub App for automated PR reviews:

\`\`\`yaml
# .github/workflows/claude-review.yml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropic/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          review_style: thorough
\`\`\`

### Cross-Model QA

Use Claude to review code written by other AI models:

\`\`\`
> I generated this code with [another tool].
> Review it thoroughly:
> 1. Check for correctness
> 2. Check for best practices
> 3. Check for edge cases
> 4. Suggest improvements
> [paste code]
\`\`\`

This "cross-model review" often catches issues that single-model generation misses.

### Review Metrics

Track review quality over time:
- Issues found per review
- False positive rate (issues that weren't real)
- Time saved vs manual review
- Bugs caught before merge

### Key Takeaway

Automated code review with Claude Code catches issues early and consistently. Use focused reviews (security, performance, accessibility) for deep analysis, and create review skills for your team's specific standards. Integrate with CI via the GitHub App for every PR. Cross-model QA adds an extra layer of quality.`,
    },
    {
      id: "cp-debugging",
      slug: "debugging-strategies",
      title: "Debugging Strategies",
      content: `## Debugging Strategies

Claude Code excels at debugging — it can read error messages, trace code paths, analyze stack traces, and propose targeted fixes. Here are the most effective debugging strategies.

### Strategy 1: Error Message Analysis

\`\`\`
> I'm getting this error:
>
> TypeError: Cannot read properties of undefined (reading 'map')
>   at UserList (src/components/UserList.tsx:15:32)
>   at renderWithHooks (node_modules/react-dom/...)
>
> Find and fix the root cause.
\`\`\`

Claude will:
1. Read the file at the error location
2. Trace the data flow to find where the undefined value originates
3. Propose a fix (add null check, fix data fetching, etc.)
4. Add a test to prevent regression

### Strategy 2: Reproduction-First Debugging

\`\`\`
> The checkout page crashes when the cart has more than 10 items.
>
> 1. Read the checkout code and identify potential causes
> 2. Write a test that reproduces the crash with 11 items
> 3. Fix the root cause
> 4. Verify the test passes
> 5. Check if the same pattern exists elsewhere
\`\`\`

### Strategy 3: Trace the Data Flow

\`\`\`
> The user's name shows as "undefined" on the profile page.
> Trace the complete data flow from the database to the UI:
> 1. Check the database query
> 2. Check the API response
> 3. Check the frontend data fetching
> 4. Check the component rendering
> Find where the name gets lost.
\`\`\`

### Strategy 4: Screenshot Debugging

For visual bugs, use screenshots with Claude Code:

\`\`\`
> Look at this screenshot of the broken layout:
> [screenshot attached or described]
>
> The header should be fixed at the top but it's scrolling with the page.
> Find and fix the CSS issue.
\`\`\`

Claude can analyze screenshots when you use multimodal capabilities or describe the visual issue in detail.

### Strategy 5: Binary Search Debugging

For mysterious bugs, narrow down the cause:

\`\`\`
> Something broke between commits abc123 and def456.
> The login page no longer loads.
>
> Use git bisect approach:
> 1. Check the midpoint commit
> 2. Test if the login page works there
> 3. Narrow down to the exact commit that introduced the bug
> 4. Analyze what changed in that commit
\`\`\`

### Strategy 6: Log Analysis

\`\`\`
> Here are the server logs from when the error occurred:
>
> [2025-03-14 10:23:45] INFO: POST /api/checkout started
> [2025-03-14 10:23:45] DEBUG: Cart items: 12
> [2025-03-14 10:23:46] ERROR: Payment processing failed
> [2025-03-14 10:23:46] ERROR: Stripe API returned 400: amount_too_large
>
> Analyze these logs and find the bug.
\`\`\`

### Debug Prompts by Error Type

| Error Type | Prompt |
|-----------|--------|
| **Runtime error** | "Trace this error to its root cause and fix it" |
| **Type error** | "Why is TypeScript complaining here? Fix the types" |
| **Build error** | "The build fails with this error. Diagnose and fix" |
| **Test failure** | "This test is failing. Is the test wrong or the code?" |
| **Performance** | "This page loads in 5s. Profile and optimize to under 1s" |
| **Race condition** | "This works sometimes but fails intermittently. Find the race" |

### Debugging Best Practices

1. **Share the full error**: Copy the complete stack trace, not just the message
2. **Describe the expected behavior**: "It should show X but shows Y instead"
3. **Mention what you've tried**: "I already checked the database and the data is correct"
4. **Provide reproduction steps**: "Click login, enter valid credentials, click submit"
5. **Set scope**: "Focus on the backend — the frontend is fine"

### Key Takeaway

Effective debugging with Claude Code is about providing context and using the right strategy. Share full error messages, describe expected vs actual behavior, and ask Claude to trace the complete code path. The reproduction-first approach (write a failing test, then fix) is the most reliable strategy because it proves the bug is fixed and prevents regressions.`,
    },
    {
      id: "cp-prompting",
      slug: "prompt-engineering-for-code",
      title: "Prompt Engineering for Code",
      content: `## Prompt Engineering for Code

How you phrase your requests to Claude Code dramatically impacts the quality of results. These techniques ensure Claude produces the code you actually want.

### The "Ultrathink" Technique

For complex problems, explicitly ask Claude to think deeply:

\`\`\`
> Think step by step about how to implement a distributed rate limiter
> that works across multiple server instances. Consider:
> - Redis-based token bucket algorithm
> - Race conditions with concurrent requests
> - Sliding window vs fixed window
> - Graceful degradation if Redis is down
>
> Then implement the best approach.
\`\`\`

The explicit instruction to think step-by-step activates more careful reasoning.

### Verification Challenges

After Claude generates code, challenge it to verify:

\`\`\`
> Now review the code you just wrote. Look for:
> - Edge cases you missed
> - Race conditions
> - Error handling gaps
> - Type safety issues
> Try to break your own implementation.
\`\`\`

This self-review step catches 20-30% more issues than the initial generation.

### Constraint-Based Prompting

Specify what you DON'T want as much as what you do:

\`\`\`
> Implement user search with these constraints:
> - DO: Use existing Prisma client
> - DO: Support pagination
> - DO: Include TypeScript types
> - DON'T: Add new dependencies
> - DON'T: Use raw SQL
> - DON'T: Expose internal user IDs in responses
\`\`\`

### Example-Driven Prompting

Show Claude what you want by giving examples:

\`\`\`
> Our error handling follows this pattern:
>
> try {
>   const result = await someOperation();
>   return NextResponse.json(result);
> } catch (error) {
>   if (error instanceof ValidationError) {
>     return NextResponse.json({ error: error.message }, { status: 400 });
>   }
>   console.error('Operation failed:', error);
>   return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
> }
>
> Apply this same pattern to all API routes in src/app/api/
\`\`\`

### Scope Control

Prevent Claude from changing too much:

\`\`\`
> Fix the bug in calculateTotal(). ONLY modify the calculateTotal function.
> Do not change any other code, even if you see other improvements.
\`\`\`

Without scope control, Claude may "helpfully" refactor other code and introduce unexpected changes.

### Progressive Complexity

Build up solutions incrementally:

\`\`\`
> Phase 1: Create a basic CRUD API for products (just GET and POST)
> Phase 2: Add input validation with Zod
> Phase 3: Add pagination to the GET endpoint
> Phase 4: Add search and filtering
> Phase 5: Add caching with Redis
>
> Do Phase 1 first. We'll move to Phase 2 after I review.
\`\`\`

### Effective Prompts by Task Type

**Bug Fix:**
\`\`\`
The login fails with error X when condition Y.
Expected: Z. Actual: W.
Fix the root cause and add a regression test.
Don't change the API contract.
\`\`\`

**New Feature:**
\`\`\`
Add [feature] following the same patterns as [existing similar feature].
Use existing utilities from src/lib/.
Include TypeScript types and tests.
\`\`\`

**Refactor:**
\`\`\`
Refactor [module] to [improve X].
Keep the public API identical.
Run tests after each change to ensure nothing breaks.
\`\`\`

### Anti-Patterns to Avoid

| Bad Prompt | Why | Better Prompt |
|-----------|-----|---------------|
| "Fix it" | No context | "Fix the null error on line 42 of auth.ts" |
| "Make it better" | Too vague | "Reduce the API response time by adding caching" |
| "Rewrite everything" | Too broad | "Refactor the auth module, keep the same API" |
| "Do what you think is best" | No constraints | "Add validation using Zod, following our patterns" |

### Key Takeaway

Good prompts have four elements: clear objective, specific constraints, relevant context, and explicit output format. Use "ultrathink" for complex problems, verification challenges for quality, and scope control to prevent unwanted changes. The difference between a mediocre prompt and a great one is often the difference between one attempt and five.

> **Resource**: [Claude Code Best Practices](https://github.com/shanraisshan/claude-code-best-practice) — 40+ prompt templates organized by task type.`,
    },
  ],
};

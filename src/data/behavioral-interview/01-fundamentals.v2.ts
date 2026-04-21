import { Module } from "../types";

export const fundamentalsModule: Module = {
  id: "behavioral-fundamentals",
  title: "Behavioral Interview Fundamentals",
  description: "Understand why behavioral interviews matter, master the STAR method, and build a reusable story bank that covers any question.",
  lessons: [
    {
      id: "why-behavioral",
      slug: "why-behavioral-interviews",
      title: "Why Behavioral Interviews Matter",
      content: `# Why Behavioral Interviews Matter

## The Hidden Half of the Interview

Most engineers spend hundreds of hours grinding LeetCode but walk into behavioral rounds completely unprepared. Here is the reality: **behavioral interviews carry equal or greater weight than technical rounds** at most top companies.

At Amazon, behavioral questions appear in *every single interview loop*. At Google, "Googliness" is a standalone hiring signal. At Meta, a weak behavioral showing can sink an otherwise strong technical candidate. These are not soft, hand-wavy conversations — they are structured evaluations with rubrics, scoring sheets, and calibration committees.

## What Companies Are Really Measuring

Behavioral interviews exist because past behavior is the best predictor of future behavior. Companies are evaluating:

| Signal | What They Want to See |
|---|---|
| **Self-awareness** | Can you reflect honestly on successes and failures? |
| **Impact orientation** | Do you drive outcomes, or just complete tasks? |
| **Collaboration** | Can you work across teams and resolve conflict? |
| **Growth mindset** | Do you learn from mistakes and seek feedback? |
| **Communication** | Can you tell a clear, structured story under pressure? |

## The Cost of Being Unprepared

Consider two candidates with identical technical scores:

- **Candidate A** gives vague, rambling answers: "Yeah, I've dealt with conflict before... I guess I just try to be nice about it."
- **Candidate B** delivers a crisp 2-minute story with a clear situation, specific actions, and measurable results.

Candidate B gets the offer. Every time.

The frustrating part? Candidate A might actually have *better* stories — they just never learned how to tell them. Behavioral interviewing is a skill, and like any skill, it can be practiced and improved.

## How Behavioral Rounds Are Structured

A typical behavioral interview lasts 45-60 minutes and covers 3-5 questions. The interviewer follows a pattern:

1. **Opening question** — broad prompt like "Tell me about a time you led a project"
2. **Follow-up probes** — "What specifically did *you* do?" / "How did you decide that?" / "What would you do differently?"
3. **Scoring** — The interviewer fills out a rubric immediately after, rating you on predefined competencies

The follow-up probes are where most candidates fall apart. You cannot fake depth. If you tell someone else's story or exaggerate your role, the probing questions will expose it within 30 seconds.

## The Meta-Skill: Structured Storytelling

The single most important skill in behavioral interviews is **structured storytelling**. This means:

- **Starting with context** — set the scene in 2-3 sentences, not 2-3 minutes
- **Focusing on YOUR actions** — not what the team did, what *you* did
- **Quantifying results** — "improved latency by 40%" beats "made things faster"
- **Showing reflection** — what you learned, what you would change

Throughout this course, you will build a bank of 15-20 stories that can be adapted to almost any behavioral question. You will learn the STAR method, understand how each major company evaluates candidates differently, and practice with realistic prompts.

## What This Course Covers

| Module | Focus |
|---|---|
| Fundamentals | STAR method, story banking, common mistakes |
| Leadership | Leading teams, influence, decision-making |
| Problem Solving | Technical challenges, ambiguity, innovation |
| Teamwork | Conflict, collaboration, consensus |
| Failure & Growth | Mistakes, feedback, resilience |
| Customer Impact | Prioritization, measurement, going above and beyond |
| Company-Specific | Amazon, Google, Meta, Microsoft strategies |

By the end, you will walk into any behavioral round with confidence, clarity, and a toolkit of proven stories. Let's get started.`,
    },
    {
      id: "star-method",
      slug: "star-method-framework",
      title: "The STAR Method Framework",
      content: `# The STAR Method Framework

## The Gold Standard for Behavioral Answers

The STAR method is the most widely recommended framework for answering behavioral interview questions, and for good reason — it forces you to be specific, structured, and concise. Every strong behavioral answer follows this pattern:

| Component | Purpose | Time Allocation |
|---|---|---|
| **S**ituation | Set the scene — where, when, what was happening | 15-20% (~20 seconds) |
| **T**ask | Define your specific responsibility or challenge | 10-15% (~15 seconds) |
| **A**ction | Describe exactly what YOU did | 50-60% (~60 seconds) |
| **R**esult | Share the outcome with metrics | 15-20% (~20 seconds) |

Total target: **90-120 seconds** for your initial answer. The interviewer will then probe deeper.

## Situation: Set the Scene Fast

The biggest mistake engineers make is spending too long on context. Your interviewer does not need the full history of your company's architecture. They need just enough to understand why your actions mattered.

**Bad:** "So at my last company, we were a Series B startup founded in 2018 that did B2B SaaS for logistics companies, and we had about 200 employees across three offices..."

**Good:** "At my previous company, a mid-stage logistics startup, our main API was experiencing 3x latency spikes during peak hours."

Two sentences. Done. Move on.

## Task: Clarify YOUR Role

This is where you distinguish between what the *team* was doing and what *you* were responsible for. Use "I" not "we."

**Bad:** "We needed to fix the performance issues."

**Good:** "As the senior backend engineer, I was asked to lead the investigation and propose a solution within two weeks."

## Action: This Is Where You Win or Lose

The Action section should be the longest part of your answer. This is where interviewers assess your thought process, technical judgment, and leadership. Be specific:

- What alternatives did you consider?
- How did you make your decision?
- Who did you involve and why?
- What obstacles did you overcome?

> **Example STAR Answer — "Tell me about a difficult technical problem you solved"**
>
> **Situation:** "At my previous company, our payment processing service was failing silently for about 2% of transactions. Customers were being charged but not receiving confirmations, leading to duplicate payments and a spike in support tickets."
>
> **Task:** "I was the on-call engineer who identified the pattern, and my manager asked me to own the root cause analysis and fix."
>
> **Action:** "First, I added structured logging to the payment pipeline to capture the full lifecycle of each transaction. Within a day, I identified that the failures correlated with a race condition in our distributed lock implementation — when two instances tried to process the same idempotency key within a 50ms window, both would proceed. I proposed two solutions to the team: switching to Redis-based distributed locks with fencing tokens, or implementing an optimistic concurrency model with database-level constraints. I wrote a design doc comparing both approaches, ran load tests on each, and recommended the Redis approach because it had 10x lower p99 latency. I implemented it over four days, wrote integration tests covering the race condition, and coordinated a staged rollout with the DevOps team."
>
> **Result:** "The silent failures dropped to zero. We recovered $47K in duplicate charges over the next month, support tickets related to payments fell by 80%, and the pattern I implemented became our standard for all distributed lock usage across the platform."

## Result: Quantify Everything

Vague results kill otherwise strong answers. Compare:

| Weak Result | Strong Result |
|---|---|
| "It worked out well" | "Reduced API errors by 94%" |
| "The team was happy" | "Team velocity increased 30% the next sprint" |
| "We shipped it on time" | "Launched 2 weeks ahead of schedule, adopted by 12K users in the first month" |

If you genuinely cannot quantify a result, use qualitative impact: "My manager cited this project specifically in my promotion packet" or "The approach was adopted as a template by three other teams."

## Common STAR Pitfalls

1. **The "We" Trap** — Saying "we" throughout. Interviewers want to know what *you* did.
2. **The History Lesson** — Spending 2 minutes on Situation. Keep it under 30 seconds.
3. **The Vague Action** — "I worked with the team to figure it out." What did you *specifically* do?
4. **The Missing Result** — Ending with "and then we shipped it." What was the measurable impact?
5. **The Humble Dodge** — Downplaying your contribution. This is not the time for modesty.

## Practice Exercise

Pick any project you worked on in the last two years. Set a timer for 2 minutes and tell the story using STAR. Record yourself if possible. Then review:

- Did Situation take less than 20 seconds?
- Did you use "I" more than "we" in the Action section?
- Did your Result include at least one number?

If not, restructure and try again. Repetition is how this becomes natural.`,
    },
    {
      id: "company-evaluation",
      slug: "how-companies-evaluate",
      title: "How Companies Evaluate You",
      content: `# How Companies Evaluate You

## Behind the Scenes of the Scoring Rubric

Behavioral interviews are not subjective gut-feel assessments. At top tech companies, interviewers use structured rubrics and calibration processes. Understanding how you are scored gives you a massive advantage.

## The Rating Scale

Most companies use a 4-point or 5-point scale. Here is a representative rubric:

| Rating | Label | Description |
|---|---|---|
| 1 | Strong No Hire | Could not provide relevant examples; red flags present |
| 2 | Lean No Hire | Vague answers, limited depth, minimal self-awareness |
| 3 | Lean Hire | Solid examples with some specificity; meets the bar |
| 4 | Strong Hire | Exceptional examples with deep reflection, clear impact, strong judgment |

The bar for most roles is a **3** across all behavioral competencies. A single **1** or **2** can block an offer even if technical rounds were strong.

## What Interviewers Write Down

After your interview, the interviewer writes feedback that typically includes:

- **Summary of each answer** — a 2-3 sentence recap of your story
- **Evidence of competency** — specific quotes or actions that demonstrate (or fail to demonstrate) the target signal
- **Follow-up quality** — how well you handled probing questions
- **Overall signal strength** — their confidence level in the rating

This means **specificity is everything**. The interviewer needs to write concrete evidence. "Candidate described leading a cross-team migration affecting 3 services" is strong feedback. "Candidate talked about working on a project" gives the committee nothing to work with.

## Company-Specific Evaluation Frameworks

### Amazon — Leadership Principles (LPs)
Amazon maps every behavioral question to one or more of their 16 Leadership Principles. Your interviewer has been assigned specific LPs to evaluate. They are literally checking boxes:

- Did the candidate demonstrate **Ownership**? (Did they go beyond their scope?)
- Did the candidate demonstrate **Dive Deep**? (Did they get into the details?)
- Did the candidate demonstrate **Bias for Action**? (Did they act without waiting for perfect information?)

### Google — Four Signals
Google evaluates: General Cognitive Ability, Role-Related Knowledge, Leadership, and **Googliness** (culture fit, collaboration, comfort with ambiguity). The behavioral round primarily targets Leadership and Googliness.

### Meta — Core Values
Meta looks for: Move Fast, Be Bold, Focus on Impact, Be Open, Build Social Value. Their behavioral questions probe whether you default to action and whether you prioritize impact over process.

### Microsoft — Growth Mindset
Microsoft's behavioral evaluation centers on growth mindset: Do you learn from failure? Do you seek diverse perspectives? Do you empower others?

## The Calibration Process

Your interviewer does not make the hiring decision alone. Here is what typically happens:

1. **Individual write-up** — Each interviewer submits independent feedback within 24 hours
2. **Debrief meeting** — All interviewers meet with a hiring manager and/or bar raiser
3. **Discussion** — Interviewers present their signals, defend their ratings, and discuss borderline cases
4. **Decision** — The group reaches consensus (or the bar raiser / hiring committee makes the final call)

This has important implications for you:

- **Consistency matters** — If you tell one interviewer you led the project and tell another you were a contributor, the debrief will catch the discrepancy
- **Depth matters** — Surface-level answers lead to "insufficient signal" ratings, which count against you
- **Multiple stories matter** — If you use the same story for every question, interviewers will note the limited range

## What Separates a 3 from a 4

The difference between "meets the bar" and "strong hire" comes down to three things:

### 1. Reflection and Self-Awareness
A **3** answer describes what happened. A **4** answer also explains *why* you made each decision, what tradeoffs you considered, and what you would do differently today.

### 2. Scope and Impact
A **3** answer shows competency at the current level. A **4** answer demonstrates impact at the *next* level — the level you are being hired for.

### 3. Authenticity Under Probing
A **3** candidate handles follow-up questions adequately. A **4** candidate welcomes them, reveals additional layers of the story, and demonstrates genuine ownership of both successes and mistakes.

## Practical Takeaways

- **Prepare stories at the right scope** for your target level. An L5/E5 candidate should show cross-team influence, not just individual contribution.
- **Be consistent** across interviewers. Use different stories, but make sure your overall narrative is coherent.
- **Practice with follow-ups**. Have a friend ask "Why?" and "What would you do differently?" after every answer. That is where the real signal lives.`,
    },
    {
      id: "common-mistakes",
      slug: "common-interview-mistakes",
      title: "Common Mistakes & How to Avoid Them",
      content: `# Common Mistakes & How to Avoid Them

## The Twelve Most Common Behavioral Interview Mistakes

After reviewing thousands of interview debriefs and coaching hundreds of candidates, certain patterns emerge repeatedly. Here are the mistakes that most frequently cost candidates offers — and how to fix each one.

## Mistake 1: The Rambling Situation

**What it looks like:** Spending 3-4 minutes setting up the context before getting to what you actually did.

**Why it happens:** You feel the interviewer needs all the background to appreciate your contribution. They don't.

**The fix:** Limit your Situation to 2-3 sentences. Practice the "newspaper headline" technique — if your situation were a headline, what would it say? "Our payment service was losing $50K/month in failed transactions." Done. Move on.

## Mistake 2: The "We" Problem

**What it looks like:** "We decided to refactor the service. We held a design review. We implemented the changes."

**Why it matters:** The interviewer is hiring *you*, not your team. They cannot evaluate your individual contribution if everything is "we."

**The fix:** Use "I" for your actions, "we" only when describing team context. "The team was responsible for the migration, but I specifically owned the data validation layer and the rollback strategy."

## Mistake 3: Choosing the Wrong Story

**What it looks like:** Telling a story where you were a bystander, where the outcome was mediocre, or where you cannot speak to specifics.

**The fix:** Before telling any story, ask yourself: (1) Was I central to this? (2) Was the outcome clearly positive? (3) Can I speak to specific decisions I made? If any answer is no, pick a different story.

## Mistake 4: No Quantified Results

**What it looks like:** "It went really well and everyone was happy with the outcome."

**The fix:** Every story needs at least one number. Revenue impact, percentage improvement, time saved, users affected, support tickets reduced. If you genuinely cannot quantify the result, use proxy metrics: "My tech lead cited this as the strongest project in our team's Q3 review."

## Mistake 5: Being Too Humble

**What it looks like:** "I mean, anyone on the team could have done it" or "I just got lucky with the timing."

**Why it kills you:** The interviewer *wants* to give you credit. When you deflect, you are literally talking them out of giving you a high score.

**The fix:** Own your contributions without arrogance. "I identified the root cause, proposed the solution, and drove the implementation." That is not bragging — that is answering the question.

## Mistake 6: No Conflict or Challenge

**What it looks like:** A story where everything went smoothly and everyone agreed.

**Why it matters:** Interviewers want to see how you handle difficulty. A frictionless story gives them no signal on resilience, persuasion, or judgment under pressure.

**The fix:** Choose stories with genuine obstacles. Disagreements, tight deadlines, technical surprises, resource constraints. The obstacle is what makes your actions interesting.

## Mistake 7: Badmouthing Others

**What it looks like:** "My manager was terrible" or "The other engineer was incompetent."

**The fix:** Describe the *situation* factually without attacking individuals. "My manager and I had different priorities — he was focused on feature velocity, and I was concerned about technical debt" is factual and mature.

## Mistake 8: The Hypothetical Answer

**What it looks like:** "What I *would* do is..." or "In general, I think the best approach is..."

**Why it kills you:** Behavioral questions ask what you *did*, not what you *would* do. Hypothetical answers score a 1 on most rubrics.

**The fix:** If you have never encountered the exact scenario, find the closest real experience: "I haven't faced that exact situation, but a similar challenge I navigated was..."

## Mistake 9: Only Preparing Success Stories

**What it looks like:** Freezing when asked "Tell me about a time you failed."

**The fix:** Prepare 3-4 failure/mistake stories. The best failure stories show: (1) genuine failure, not a humblebrag, (2) specific lessons learned, and (3) evidence you applied those lessons later.

## Mistake 10: Using the Same Story Repeatedly

**What it looks like:** Telling the same project story for leadership, problem-solving, and teamwork questions.

**Why it matters:** Interviewers compare notes. If three out of four heard the same story, the debrief will flag "limited range of experience."

**The fix:** Prepare at least 8-10 distinct stories covering different competencies, timeframes, and contexts.

## Mistake 11: Ignoring the Follow-Up

**What it looks like:** Giving a great initial answer, then falling apart when the interviewer asks "Why did you choose that approach over alternatives?"

**The fix:** For every story, prepare answers to these common follow-ups:
- "What alternatives did you consider?"
- "What would you do differently?"
- "How did you measure success?"
- "What did you learn?"
- "How did others on the team react?"

## Mistake 12: Not Asking Questions

**What it looks like:** When the interviewer says "Do you have any questions for me?" you say "No, I think I'm good."

**The fix:** Always have 2-3 thoughtful questions prepared. Good questions signal genuine interest and good judgment. "What does the onboarding process look like for this team?" or "What's the biggest technical challenge the team is facing right now?" are simple and effective.

## Quick Self-Assessment

Before your next behavioral interview, review this checklist:

| Check | Status |
|---|---|
| I have 8-10 distinct stories prepared | |
| Each story has quantified results | |
| I have 3-4 failure stories ready | |
| I can tell each story in under 2 minutes | |
| I have prepared follow-up answers for each story | |
| I have 3 questions to ask the interviewer | |

If any box is empty, that is your next preparation priority.`,
    },
    {
      id: "story-bank",
      slug: "building-story-bank",
      title: "Building Your Story Bank",
      content: `# Building Your Story Bank

## Your Most Valuable Interview Asset

A **story bank** is a curated collection of 12-20 professional experiences, pre-structured in STAR format, that you can deploy for any behavioral question. Building one is the single highest-ROI activity in your interview preparation.

## Why a Story Bank Works

Behavioral questions are not as varied as they seem. There are roughly 8-10 competency categories that companies evaluate, and most questions map to one of them:

| Competency | Example Questions |
|---|---|
| Leadership | "Tell me about a time you led a project" / "Describe when you influenced a decision" |
| Problem Solving | "Describe a difficult technical challenge" / "Tell me about debugging a complex issue" |
| Teamwork | "How did you handle a disagreement?" / "Describe cross-team collaboration" |
| Failure & Growth | "Tell me about a time you failed" / "What's your biggest mistake?" |
| Initiative | "When did you go above and beyond?" / "Describe something you did without being asked" |
| Communication | "How did you explain a technical concept to a non-technical audience?" |
| Prioritization | "How do you handle competing deadlines?" / "Describe when you had to say no" |
| Customer Focus | "Tell me about a decision driven by customer impact" |

A well-chosen set of 15 stories can cover virtually every question across all these categories.

## The Story Mining Process

### Step 1: Timeline Walkthrough

Open a blank document and walk through the last 3-5 years of your career chronologically. For each role or major period, write down:

- Projects you shipped
- Problems you solved
- Conflicts you navigated
- Mistakes you made
- Feedback you received (positive and constructive)
- Times you went beyond your role
- Decisions you made under uncertainty

Don't filter yet. Just dump everything. Aim for 30-40 raw experiences.

### Step 2: Select and Categorize

From your raw list, select 15-20 experiences that meet these criteria:

1. **You were central** — not a bystander or minor contributor
2. **There was a challenge** — something was difficult, ambiguous, or high-stakes
3. **The outcome was clear** — ideally with metrics, but at minimum a definitive result
4. **You can speak for 2 minutes** — you remember enough detail to handle follow-ups

Map each story to 2-3 competency categories. A single story about resolving a team conflict during a critical launch might cover Teamwork, Leadership, and Problem Solving.

### Step 3: Structure Each Story

For each selected experience, write out the full STAR format:

> **Story: Payment Service Reliability Overhaul**
>
> **Competency tags:** Problem Solving, Initiative, Technical Leadership
>
> **Situation:** Our payment service was silently dropping ~2% of transactions. Customers were being double-charged, generating 40+ support tickets per week.
>
> **Task:** As the senior backend engineer, I was assigned to lead root cause analysis and implement a fix within our two-week sprint cycle.
>
> **Action:** I instrumented the payment pipeline with distributed tracing to capture full transaction lifecycles. Identified a race condition in our distributed lock implementation — two instances could process the same idempotency key within a 50ms window. I wrote a design doc comparing Redis-based distributed locks with fencing tokens versus optimistic concurrency with database constraints. Load tested both approaches, recommended Redis for its 10x lower p99 latency. Implemented over 4 days with full integration test coverage of the race condition, then coordinated a staged rollout.
>
> **Result:** Silent failures dropped to zero. Recovered $47K in duplicate charges the first month. Payment-related support tickets decreased 80%. The locking pattern became our org-wide standard.
>
> **Follow-up prep:**
> - *Why Redis over DB constraints?* — DB approach added 15ms per transaction at p99; Redis added <2ms. At our volume (10K tx/hour), that latency difference affected user experience.
> - *What would you do differently?* — I would have added distributed tracing earlier. The silent failures had been happening for months before anyone noticed the pattern.
> - *How did you get buy-in?* — The design doc with load test data made the case. I also looped in the DevOps lead early since the Redis dependency affected their runbooks.

### Step 4: Build a Coverage Matrix

Create a matrix to make sure you have coverage across all competencies:

| Story | Leadership | Problem Solving | Teamwork | Failure | Initiative | Customer |
|---|---|---|---|---|---|---|
| Payment overhaul | | X | | | X | X |
| Cross-team migration | X | | X | | | |
| Missed sprint deadline | | | | X | | |
| Onboarding system redesign | X | X | | | X | |
| Conflict with PM | | | X | | | |

If any column has fewer than 2-3 stories, mine for more experiences in that category.

### Step 5: Practice Out Loud

Reading your stories silently is not enough. You must practice speaking them aloud:

- **Solo practice:** Set a 2-minute timer and tell the story. Record yourself. Listen back. Was the Situation too long? Did you use "I" enough? Did you state a clear result?
- **Mock interviews:** Have a friend or colleague ask you behavioral questions. Don't tell them which story you plan to use — practice selecting the right story in real time.
- **Variation practice:** Take one story and practice telling it as a "leadership" story, then as a "problem-solving" story. The framing shifts even though the facts are the same.

## Maintaining Your Story Bank

Your story bank is a living document. Update it whenever:

- You ship a significant project
- You navigate a meaningful conflict
- You receive notable feedback
- You make a mistake worth learning from
- You change roles or companies

By interview time, you should be able to hear any behavioral question and instantly think of 2-3 stories that fit. That kind of readiness is what separates prepared candidates from everyone else.`,
    },
  ],
};

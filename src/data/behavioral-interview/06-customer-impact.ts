import { Module } from "../types";

export const customerImpactModule: Module = {
  id: "behavioral-customer",
  title: "Customer Obsession & Impact",
  description: "Demonstrate customer focus, prioritization skills, impact measurement, and data-driven decision making.",
  lessons: [
    {
      id: "going-above-beyond",
      slug: "going-above-and-beyond",
      title: "Going Above and Beyond for a Customer",
      content: `# Going Above and Beyond for a Customer

## What "Customer" Means in Engineering

Before diving into this question, clarify who your "customer" is. In engineering, it can mean several things:

| Customer Type | Example |
|---|---|
| **External end user** | The person using your product |
| **Internal stakeholder** | A PM, sales team, or another engineering team that depends on your work |
| **Platform user** | A developer consuming your API or internal tool |

All of these are valid customers. The best stories pick whichever type best demonstrates your initiative and impact. Amazon in particular evaluates this heavily through their "Customer Obsession" Leadership Principle.

## What "Above and Beyond" Really Means

Interviewers are testing for **initiative** — actions you took that were not required, not assigned, and not expected. The bar is:

- You noticed a customer need that others missed or deprioritized
- You took action beyond your job description or sprint commitments
- The action had measurable positive impact on the customer

Simply doing your job well — even doing it very well — does not count as "above and beyond."

## Realistic STAR Example

> **Question:** "Tell me about a time you went above and beyond for a customer."
>
> **Situation:** "I was a backend engineer on our payments platform team. One Friday afternoon, a support escalation came through: a small business owner using our invoicing tool reported that 30 of her clients had received duplicate invoices overnight. She was panicking because some clients had already paid twice."
>
> **Task:** "This was technically a Tier 2 support issue, not something that would normally land on an engineer's desk directly. The on-call engineer was working a P1 database incident. I saw the escalation in the support Slack channel and decided to investigate."
>
> **Action:** "I traced the issue to a retry bug in our invoice dispatch queue — a network timeout had caused the queue to re-dispatch 847 invoices across 23 merchant accounts, not just the one who reported it. I immediately did three things. First, I wrote a SQL query to identify every affected merchant and their impacted invoices. Second, I built a one-time script to automatically mark the duplicate invoices as void and trigger refunds for any that had been double-paid. Third, I drafted a customer communication template that the support team could personalize and send to each affected merchant. The whole process took about 5 hours — well into my Friday evening. On Monday, I filed a bug report with a proposed fix for the retry logic and implemented it that sprint."
>
> **Result:** "We identified 23 affected merchants and resolved all 847 duplicate invoices before most of them noticed. The merchant who originally reported it sent our support team an email saying it was 'the best customer support experience she'd ever had.' The retry fix I implemented prevented recurrence, and the void-and-refund script I wrote was adapted into a standing operational runbook for similar incidents."

## The "Above and Beyond" Checklist

Your story should tick at least three of these boxes:

| Indicator | Present? |
|---|---|
| You noticed the problem — it was not assigned to you | |
| You acted outside your normal responsibilities | |
| You prioritized the customer's experience over your convenience | |
| You solved the immediate problem AND prevented recurrence | |
| The customer impact was measurable or directly acknowledged | |

## What Separates a Strong Answer from a Generic One

| Generic Answer | Strong Answer |
|---|---|
| "I helped a user with their issue" | "I identified 23 affected accounts from one report and resolved all of them proactively" |
| "I stayed late to fix a bug" | "I built a void-and-refund script, a customer comm template, and a permanent fix" |
| "The customer was happy" | "The customer sent a written testimonial; the fix prevented 100+ future incidents" |

The pattern: **scope expansion** (you went beyond the one report), **systemic thinking** (you fixed the root cause), and **measurable impact** (numbers, not feelings).

## Common Follow-Up Questions

- "How did you decide to get involved when it wasn't your responsibility?"
- "Did you have to deprioritize other work? How did you handle that?"
- "How did your manager react to you taking this on?"
- "Would you do the same thing again?"

## Practice Prompt

Think of a time you noticed a customer problem that was not your responsibility and chose to act anyway. What triggered you to get involved? What did you do beyond the minimum? What was the impact? Tell the story in under 2 minutes.`
    },
    {
      id: "prioritizing-competing-demands",
      slug: "prioritizing-competing-demands",
      title: "Prioritizing Competing Demands",
      content: `# Prioritizing Competing Demands

## The Real-World Prioritization Test

"Tell me about a time you had to prioritize competing demands" is testing whether you can make tough tradeoffs, communicate them clearly, and stand behind your reasoning. In engineering, you are always balancing feature work, tech debt, bug fixes, support requests, and stakeholder expectations. This question reveals your decision-making framework.

## The Prioritization Decision Framework

When telling your story, show that you used a structured approach, not gut feel:

| Criteria | Questions to Ask |
|---|---|
| **Impact** | Which task affects the most users or revenue? |
| **Urgency** | Which has a hard deadline vs. a flexible one? |
| **Dependencies** | Is anyone blocked waiting on one of these? |
| **Reversibility** | Which decision is harder to undo if delayed? |
| **Effort** | What is the cost of doing each — can any be done quickly? |

You do not need to name this exact framework in your interview. But your story should demonstrate that you weighed multiple factors, not just picked the loudest stakeholder.

## Realistic STAR Example

> **Question:** "Tell me about a time you had to prioritize competing demands."
>
> **Situation:** "During the second week of a sprint, three things landed on my plate simultaneously. Our biggest enterprise client reported a data export bug that was blocking their quarterly reporting. The product manager escalated a feature request from the sales team with a demo deadline in five days. And our CI pipeline had been flaky for two weeks, causing intermittent test failures that were slowing the entire team."
>
> **Task:** "I was the most senior engineer available — our tech lead was on vacation. I had to decide what to work on first and communicate the tradeoffs to three different stakeholders."
>
> **Action:** "I spent 30 minutes assessing each item before touching any code. The enterprise bug was affecting one client but was a revenue risk — they were evaluating renewal. The sales feature was important but the demo was a soft deadline that could shift. The CI flakiness was affecting 8 engineers every day. I made three calls. First, I triaged the enterprise bug and found a manual workaround that the customer success team could provide immediately — this bought me 48 hours. Second, I fixed the CI pipeline issue, which took about 4 hours. My reasoning was that unblocking 8 engineers had a multiplied productivity impact every day it remained broken. Third, I spent the remaining three days on the enterprise bug's root fix. For the sales feature, I talked to the PM directly, explained my reasoning, and offered to pair with a mid-level engineer who could start the feature while I handled the higher-priority items. The PM agreed to push the demo by three days."
>
> **Result:** "The CI fix saved an estimated 30-40 minutes of developer time per person per day — across 8 engineers, that was 4-5 hours of recovered productivity daily. The enterprise bug was permanently fixed by Thursday, and the client renewed their contract the following month. The sales feature shipped two days late but the demo went well. My tech lead told me later that the prioritization sequence was exactly what she would have chosen."

## The Stakeholder Communication Pattern

A critical part of any prioritization story is how you communicated your decisions:

| What to Communicate | To Whom | When |
|---|---|---|
| What you are doing first and why | Your manager or tech lead | Immediately after deciding |
| What is being delayed and by how long | The stakeholder whose item was deprioritized | Same day — before they have to ask |
| What interim solution exists (if any) | The affected customer or team | As soon as you identify one |

Never deprioritize someone's request silently. Proactive communication is the difference between "good judgment" and "dropped the ball."

## What Interviewers Score On

| High Score | Low Score |
|---|---|
| Clear criteria for how you prioritized | "I just worked on whatever seemed most urgent" |
| Communicated tradeoffs proactively to stakeholders | Silently deprioritized without telling anyone |
| Considered team-level impact, not just individual tasks | Focused only on what was assigned to you |
| Found creative interim solutions for delayed items | Binary thinking: "I could only do one thing" |
| Can articulate why the order was right | Cannot explain the reasoning behind the sequence |

## The "Everything Is P0" Trap

Sometimes interviewers will follow up with: "What if all three stakeholders insisted their item was the highest priority?" This tests whether you can push back respectfully and hold your ground:

"I would present the tradeoffs transparently: 'I can do A first, B second, C third. If you want a different order, here is what we lose and who is impacted.' If stakeholders still cannot agree, I escalate to whoever can make the call — usually my manager or a VP."

## Common Follow-Up Questions

- "How did the person whose request was delayed react?"
- "What would you have done if the enterprise bug didn't have a workaround?"
- "How do you generally decide between fixing tech debt and building features?"
- "Have you ever gotten the priority order wrong?"

## Practice Prompt

Think of a week where you had more high-priority requests than you could handle. How did you decide what to do first? Who did you communicate with, and when? Was anything dropped or delayed, and how was it received? Tell the story in under 2 minutes.`
    },
    {
      id: "most-impactful-project",
      slug: "most-impactful-project",
      title: "Your Most Impactful Project",
      content: `# Your Most Impactful Project

## The "Highlight Reel" Question

"What is the most impactful project you have worked on?" is your chance to tell your best story. Unlike most behavioral questions which ask about specific situations, this is an open invitation to showcase your highest-impact work. Choose wisely — this answer shapes how the interviewer sees you for the rest of the conversation.

## How to Select Your Most Impactful Project

Not every big project is the right choice. Use this selection matrix:

| Criteria | Weight | Why It Matters |
|---|---|---|
| **Measurable outcome** | High | "Reduced latency by 60%" beats "improved the system" |
| **Your centrality** | High | You must have been a key driver, not a participant |
| **Technical depth** | Medium | Shows engineering skill, especially for technical rounds |
| **Business relevance** | Medium | Connects your work to revenue, users, or strategy |
| **Recency** | Medium | Last 2-3 years is ideal; older stories lose relevance |
| **Story quality** | High | The project must have a clear arc: problem, action, result |

If you have multiple candidates, pick the one where you can answer the most follow-up questions with depth. Your "best" project is the one you can talk about for 10 minutes without running out of material.

## Realistic STAR Example

> **Question:** "What is the most impactful project you've worked on?"
>
> **Situation:** "At my previous company, a fintech startup with about 2 million users, our transaction processing system had a 99.2% success rate. That sounds high, but it meant roughly 16,000 failed transactions per month. Each failure required manual review by our operations team — a three-person team spending 60% of their time on manual reconciliation."
>
> **Task:** "I proposed and led a project to build an automated transaction recovery system. The goal was to detect failed transactions, classify the failure type, and automatically retry or route them for resolution — reducing the manual review rate by at least 80%."
>
> **Action:** "I started by analyzing six months of failure data to categorize every failure mode. I found that 72% of failures fell into five categories with deterministic resolution paths — these could be fully automated. Another 18% could be partially automated with human-in-the-loop confirmation. Only 10% truly required manual investigation. I designed a three-layer system: a real-time failure classifier using pattern matching on error codes and transaction metadata, an automated retry engine with exponential backoff and idempotency guarantees, and a smart routing layer that escalated ambiguous cases to the operations team with pre-populated context. I built the classifier and retry engine myself, mentored a junior engineer on the routing layer, and worked closely with the operations team to validate the classification rules. We ran the system in shadow mode for two weeks, comparing its decisions against the operations team's manual decisions, before going live."
>
> **Result:** "Within the first month, the automated system resolved 89% of failed transactions without human intervention — exceeding our 80% target. Transaction success rate rose from 99.2% to 99.87%. The operations team went from spending 60% of their time on manual reconciliation to 10%. Two of the three team members were reassigned to proactive fraud detection work. Over the year, the system processed over 400,000 auto-recoveries, saving an estimated \$1.2M in operational costs. I was promoted to senior engineer on the strength of this project."

## Structuring for Maximum Impact

When telling your most impactful project story, optimize for this structure:

1. **The problem in business terms** — Frame the problem as a business pain, not a technical curiosity. "\$1.2M in annual operational cost" hits differently than "some transactions were failing."

2. **Your insight or proposal** — Show that you did not just execute a task — you identified the opportunity and shaped the solution.

3. **Technical depth with clarity** — Give enough technical detail to show competence, but stay clear enough that a non-engineer could follow the arc.

4. **Quantified multi-dimensional results** — Impact on more than one metric: success rate AND cost savings AND team productivity.

## The Impact Pyramid

Order your results from broadest to most specific:

| Level | Example |
|---|---|
| **Business impact** | "\$1.2M in annual savings" |
| **User impact** | "99.87% transaction success rate, up from 99.2%" |
| **Team impact** | "Operations team freed up 50% of their capacity" |
| **Technical impact** | "The recovery pattern became our standard for all async workflows" |

Leading with business impact signals senior-level thinking. Leading with technical impact signals mid-level thinking.

## Common Follow-Up Questions

- "Why do you consider this your most impactful project?"
- "What was the hardest technical decision you made?"
- "What would you do differently if you did it again?"
- "How did you measure success? Who defined the metrics?"
- "What did you learn from this project?"

Prepare detailed answers for all five. This is your flagship story — you should be able to discuss it for 10+ minutes.

## Practice Prompt

Pick the project you are most proud of. Can you state its impact in one sentence with a number? Can you explain your specific technical contribution in 60 seconds? Can you answer "what would you do differently?" honestly? If any of these are weak, either strengthen them or choose a different project.`
    },
    {
      id: "measuring-success",
      slug: "measuring-success",
      title: "Measuring Success",
      content: `# Measuring Success

## Why This Question Matters More Than You Think

"How did you measure the success of a project?" seems straightforward, but it reveals something deeper: whether you think about outcomes before you start building, or only after you ship. Engineers who define success metrics upfront operate at a fundamentally higher level than those who retrofit metrics after the fact.

## The Measurement Maturity Ladder

| Level | Behavior | How It Scores |
|---|---|---|
| **Level 1** | No metrics — "we shipped it" | Weak: task completion is not impact |
| **Level 2** | Retroactive metrics — "we checked the numbers after launch" | Acceptable but reactive |
| **Level 3** | Predefined metrics — "we set targets before building" | Strong: shows planning discipline |
| **Level 4** | Metric hierarchy — "we tracked leading indicators, lagging outcomes, and guardrail metrics" | Exceptional: shows systems thinking |

Aim to tell a Level 3 or Level 4 story.

## The Metric Types Framework

When describing how you measured success, show that you thought about multiple types of metrics:

| Metric Type | Purpose | Example |
|---|---|---|
| **Primary outcome** | The main goal | "Reduce checkout abandonment by 15%" |
| **Leading indicator** | Early signal that you're on track | "Add-to-cart rate in the first week" |
| **Guardrail metric** | Something that must NOT get worse | "Page load time must stay under 2s" |
| **Counter-metric** | An opposing force to monitor | "Revenue per session shouldn't drop while we optimize for conversion" |

## Realistic STAR Example

> **Question:** "How did you measure the success of a project you led?"
>
> **Situation:** "I led the redesign of our onboarding flow for a B2B SaaS product. The existing flow had a 34% completion rate — two-thirds of users who started creating an account never finished setup."
>
> **Task:** "I was responsible for both the technical implementation and defining how we would measure whether the new design was better."
>
> **Action:** "Before writing any code, I worked with the product manager to define a measurement framework with four layers. Our primary metric was onboarding completion rate — the percentage of users who finished all setup steps. Our leading indicator was step-by-step drop-off rates — where in the flow users were leaving. Our guardrail was time-to-value — we did not want to artificially boost completion by removing steps that were important for the user's first experience. And our counter-metric was 7-day retention — we needed to make sure that users who completed onboarding were actually sticking around, not just clicking through an easier flow. I instrumented every step of the new onboarding flow with analytics events, set up a real-time dashboard, and ran the new design as an A/B test against the existing flow with a 50/50 split for three weeks."
>
> **Result:** "The new onboarding flow achieved a 58% completion rate versus the original 34% — a 71% relative improvement. The biggest drop-off reduction came from step 3, where we replaced a 12-field form with a 4-field version plus progressive disclosure. Our guardrail held: time-to-first-value actually decreased by 2 minutes. And 7-day retention for the new flow was 22% higher than the control. The measurement framework I built was adopted as a template for all future product experiments."

## What Makes This Answer Strong

Notice the structural elements:

1. **Metrics defined before building** — Shows planning, not retrofitting
2. **Multiple metric types** — Shows sophisticated thinking about tradeoffs
3. **A/B test methodology** — Shows scientific rigor, not just before-and-after comparison
4. **Guardrail protection** — Shows awareness that optimizing one metric can harm others
5. **Framework reuse** — Shows organizational impact beyond the project

## Common Measurement Mistakes in Interviews

| Mistake | Why It's a Problem |
|---|---|
| Only citing vanity metrics (page views, sign-ups) | No connection to business value |
| No baseline — "we improved performance" | Improved from what? By how much? |
| Single metric with no guardrails | Shows naivete about metric gaming |
| Metrics chosen after seeing results | Cherry-picking, not measurement |

## Common Follow-Up Questions

- "Who defined the success metrics? Was it you or the PM?"
- "What would you have done if the primary metric improved but the guardrail metric degraded?"
- "How long did you monitor after launch?"
- "Did you ever have to change the success criteria mid-project?"

## Practice Prompt

Think of a project you shipped recently. Did you define success metrics before you started? What were they? Did you have guardrail metrics? If you could re-measure the project, what would you track differently? Structure your answer in under 2 minutes.`
    },
    {
      id: "data-driven-decision",
      slug: "data-driven-decision",
      title: "Making a Data-Driven Decision",
      content: `# Making a Data-Driven Decision

## The Intersection of Engineering and Judgment

"Tell me about a time you used data to make a decision" is increasingly common at tech companies. It tests whether you can gather evidence, analyze it honestly, and act on it — even when the data contradicts your initial instinct or popular opinion.

## The Data Decision Framework

A strong data-driven story follows this arc:

| Phase | What Happened | What It Demonstrates |
|---|---|---|
| **The question** | A decision needed to be made with multiple viable options | Problem identification |
| **The data you gathered** | Specific data sources, queries, analyses | Analytical skill |
| **The insight** | What the data revealed — especially if surprising | Intellectual honesty |
| **The decision** | What you chose based on the evidence | Judgment and courage |
| **The outcome** | What happened as a result | Impact orientation |

The most impressive stories include a moment where the data told you something you did not expect, and you followed the data anyway.

## Realistic STAR Example

> **Question:** "Tell me about a time you used data to make a decision."
>
> **Situation:** "Our mobile app's search feature was underperforming. Users were searching but not clicking on results — our search-to-click-through rate was 23%, well below the industry benchmark of 40-50%. The team had two competing hypotheses: the design team believed the search results UI was the problem and proposed a visual redesign, and the backend team believed the ranking algorithm was returning irrelevant results."
>
> **Task:** "As the engineer who owned the search service, I was asked to recommend which hypothesis to pursue first. Both teams were convinced they were right, and we only had capacity to tackle one that quarter."
>
> **Action:** "Instead of picking a side, I spent a week building an analysis pipeline. I pulled three datasets: search query logs with result rankings, click-through data by result position, and user session recordings from our analytics tool. The position analysis was revealing: results in positions 1-3 had a 41% click-through rate — actually above benchmark. But positions 4-10 had a 6% CTR, dramatically below normal. This meant the ranking algorithm was good at surfacing the right result at the top, but the long tail was noise. However, the session recordings told a different story about user behavior: 62% of users never scrolled past the first three results. They would either click result 1-2 or abandon — they never gave positions 4-10 a chance. The real problem was not relevance or design — it was that users had low confidence in our search and gave up quickly. I proposed a third option nobody had considered: add instant search previews showing a snippet of the result content without requiring a click. This would let users assess relevance at a glance and build confidence in the results."
>
> **Result:** "We shipped instant search previews in three weeks. Search-to-click-through rate jumped from 23% to 47%. Users who previously abandoned after viewing 1-2 results began engaging with 3-4 results on average. Neither the visual redesign nor the algorithm overhaul would have addressed the actual problem. The data prevented us from spending a quarter on the wrong solution."

## What Makes a Data Story Exceptional

The best data-driven stories demonstrate:

1. **You gathered data proactively** — It was not handed to you
2. **You looked at multiple data sources** — Triangulation, not just one metric
3. **The data challenged assumptions** — Yours or others'
4. **You followed the evidence** — Even when it was inconvenient or unpopular
5. **The data led to a non-obvious decision** — Not just confirming what everyone already believed

## Data Traps to Avoid

| Trap | Example | Why It's a Problem |
|---|---|---|
| **Confirmation bias** | Only looking at data that supports your hypothesis | Shows poor analytical rigor |
| **Correlation as causation** | "Users who use feature X have higher retention, so feature X causes retention" | Shows analytical naivete |
| **Ignoring sample size** | "3 out of 5 users preferred option A" | Not statistically meaningful |
| **Data without action** | "We analyzed the data and it was interesting" | Data is only valuable if it drives a decision |

If your story involves avoiding one of these traps, call it out explicitly. It shows analytical maturity.

## When Data Is Insufficient

Strong candidates also know the limits of data. A great follow-up answer is: "Sometimes you don't have enough data to make a confident decision. In those cases, I make the smallest reversible bet I can, instrument it heavily, and let the results guide the next step."

## Common Follow-Up Questions

- "What if the data had been inconclusive?"
- "How did you validate that the data was trustworthy?"
- "Did anyone disagree with your interpretation of the data?"
- "How do you balance data with intuition?"

## Practice Prompt

Think of a decision where you actively sought out data before choosing a direction. What data did you gather? Did it confirm or challenge your initial assumption? What did you decide, and what happened? Tell the story in under 2 minutes.`
    }
  ]
};

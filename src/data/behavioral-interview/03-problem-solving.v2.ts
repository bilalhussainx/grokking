import { Module } from "../types";

export const problemSolvingModule: Module = {
  id: "behavioral-problem-solving",
  title: "Problem Solving & Innovation",
  description: "Handle questions about tackling difficult technical problems, finding innovative solutions, navigating ambiguity, simplifying complexity, and learning new skills quickly.",
  lessons: [
    {
      id: "difficult-technical-problem",
      slug: "difficult-technical-problem",
      title: "Tell Me About a Difficult Technical Problem",
      content: `# Tell Me About a Difficult Technical Problem You Solved

## Why This Is the Most Common Technical-Behavioral Question

This question sits at the intersection of technical skill and behavioral competency. Interviewers want to see your **debugging methodology, technical depth, persistence, and ability to communicate a complex problem clearly.** It appears in nearly every behavioral loop and is especially important at Google (General Cognitive Ability) and Amazon (Dive Deep).

## Framework: The Problem-Solving Narrative

| Phase | What to Show |
|---|---|
| **Discovery** | How you identified and scoped the problem |
| **Investigation** | Your systematic approach to diagnosis |
| **Key Insight** | The breakthrough that unlocked the solution |
| **Implementation** | How you turned the insight into a fix |
| **Validation** | How you confirmed the problem was truly solved |
| **Prevention** | What you did to prevent recurrence |

## Example STAR Answer

> **Situation:** Our e-commerce platform experienced intermittent 502 errors affecting about 5% of checkout requests. The errors had no obvious pattern — they occurred across all regions, affected both mobile and desktop, and our monitoring dashboards showed all services as healthy. The issue had persisted for two weeks, and two other engineers had investigated without finding the root cause.
>
> **Task:** My manager asked me to take over the investigation since the existing engineers were stuck. The checkout error rate was costing us an estimated $12K per day in abandoned carts.
>
> **Action:** I started by challenging the assumption that "all services were healthy." I reviewed the monitoring configuration and found that our health checks were only testing the happy path — a simple GET endpoint — while the actual checkout flow involved a complex chain of POST requests across four microservices. I built a custom diagnostic tool that replayed failed checkout requests through each service in the chain, capturing the full response at each hop. After replaying 200 failed transactions, I discovered that 100% of the failures occurred when the inventory service and the payment service were called within 10ms of each other. Digging deeper, I found that both services shared a connection pool to the same PostgreSQL instance, and under specific concurrency conditions, the connection pool would exhaust, causing one of the two services to timeout. The health check never caught this because it used a separate, dedicated connection. I implemented three changes: (1) separated the connection pools so each service had its own, (2) added connection pool exhaustion metrics to our monitoring, and (3) added a circuit breaker that would queue requests rather than fail when pool saturation exceeded 80%.
>
> **Result:** Checkout 502 errors dropped to 0.01% immediately after deployment. The diagnostic replay tool I built was adopted by three other teams for their own debugging workflows. We recovered approximately $12K/day in previously lost revenue. I wrote a post-mortem that was shared engineering-wide and led to a company-wide audit of health check coverage.

## What Interviewers Look For

- **Systematic approach:** You did not just randomly try things; you had a methodical investigation plan
- **Technical depth:** You understood the system deeply enough to find a subtle root cause
- **Persistence:** You kept digging where others had given up
- **Beyond the fix:** You added monitoring, documentation, or tooling to prevent recurrence
- **Clear communication:** You can explain a complex technical problem to someone who does not know your system

## Red Flags

- **Vague technical details:** "There was some kind of bug and I fixed it." Interviewers will probe, and you need to have real depth.
- **Luck-based discovery:** "I happened to notice something in the logs." Even if luck played a role, frame it as part of a systematic process.
- **No prevention:** Fixing the bug without addressing why it was not caught earlier misses the senior-level signal.
- **Solo hero narrative without acknowledgment:** If others contributed, acknowledge it. Credit-claiming is a red flag.

## Common Follow-Ups

- "Walk me through your debugging process step by step."
- "How did you decide where to start your investigation?"
- "What was your biggest wrong assumption during the debugging?"
- "How long did this take, and how did you manage stakeholder expectations?"
- "What tools or techniques were most useful?"

## Practice Prompts

1. Describe a production incident where the root cause surprised you.
2. Tell me about a bug that took longer than expected to find. What made it hard?
3. Walk me through how you debug a problem in a distributed system.`,
    },
    {
      id: "innovative-solution",
      slug: "innovative-solution",
      title: "Tell Me About an Innovative Solution",
      content: `# Tell Me About a Time You Found an Innovative Solution

## What This Question Reveals

Innovation questions test whether you can **think beyond the obvious** and apply creative problem-solving when conventional approaches fall short. This is not about inventing something from scratch — it is about finding a clever, non-obvious approach that delivered outsized results.

Amazon evaluates this under **Invent and Simplify.** Google looks for it in **General Cognitive Ability.** Meta frames it as **Be Bold.**

## Framework: The Innovation Story

Your story should show a clear contrast between the conventional approach and your creative alternative:

| Element | What to Include |
|---|---|
| **The constraint** | What made the standard approach insufficient? |
| **The insight** | What observation or connection led to your idea? |
| **The skepticism** | Who doubted it and why? (Shows the idea was genuinely novel) |
| **The validation** | How you tested or proved the approach worked |
| **The impact** | Measurable results that exceeded expectations |

## Example STAR Answer

> **Situation:** Our data pipeline processed 50 million events per day, and stakeholders needed analytics reports by 9 AM. The pipeline took 6 hours to run, meaning it had to start at 3 AM, and any failure after that meant reports were late. We were missing the 9 AM deadline about twice a week due to intermittent failures, and each miss impacted executive decision-making for the day.
>
> **Task:** I was asked to improve pipeline reliability. The conventional approach would have been to add retries and redundancy, but my manager estimated that would require 4 engineering weeks and would still not guarantee the deadline.
>
> **Action:** I noticed that 80% of the pipeline's runtime was spent on full recomputation of aggregate tables that only changed by 0.1-0.5% daily. Instead of making the existing pipeline more reliable, I proposed a fundamentally different architecture: incremental computation. I designed a system where each incoming event immediately updated the relevant aggregates in real-time using a stream processing layer. The nightly batch job became a "reconciliation pass" — not the primary computation — that only needed to verify and correct the small delta between streaming aggregates and true values. I prototyped this in one week using our existing Kafka infrastructure and a new Flink job. The key insight was that exact accuracy was not required for the morning reports — 99.5% accuracy by 7 AM was more valuable than 100% accuracy by 9 AM (or 11 AM when the pipeline failed). I presented this tradeoff explicitly to stakeholders, and they enthusiastically agreed.
>
> **Result:** Reports were available by 7 AM every single day — a 2-hour improvement even over the best-case scenario. The reconciliation pass ran in 45 minutes instead of 6 hours. We went from missing deadlines twice a week to zero missed deadlines over the next six months. Infrastructure costs actually decreased by 30% because we eliminated the large nightly compute cluster. The architecture was later adopted by two other teams for their own reporting pipelines.

## What Interviewers Look For

- **Reframing the problem:** You questioned the underlying assumption, not just optimized the existing approach
- **Pragmatic creativity:** Your solution was practical and achievable, not a moon-shot
- **Stakeholder alignment:** You validated the tradeoffs with the right people
- **Execution:** The idea did not stay on a whiteboard; you built and shipped it
- **Transferable impact:** Others benefited from or adopted your approach

## Red Flags

- **Innovation for its own sake:** Using a novel technology because it was exciting, not because it solved the problem better
- **Ignoring tradeoffs:** Every creative solution has downsides. If you do not mention them, it sounds like you did not think it through.
- **Invented problems:** "I noticed we could make things slightly better, so I rebuilt the whole system." Innovation should address a real pain point.
- **No validation:** "I thought of this great idea" without proving it worked

## Common Follow-Ups

- "How did you convince stakeholders that the tradeoff was acceptable?"
- "What were the risks of your approach, and how did you mitigate them?"
- "Was there anything about the new approach that turned out worse than expected?"
- "How did you test the new approach before fully committing to it?"

## Practice Prompts

1. Describe a time you solved a problem in a way nobody expected.
2. Tell me about a project where you challenged the conventional approach.
3. When have you applied a technique from one domain to solve a problem in another?`,
    },
    {
      id: "ambiguous-situation",
      slug: "ambiguous-situation",
      title: "Navigating an Ambiguous Situation",
      content: `# Tell Me About a Time You Navigated an Ambiguous Situation

## Why Ambiguity Questions Are Essential

Senior engineering roles require operating in environments where requirements are unclear, priorities shift, and nobody hands you a perfectly scoped spec. This question tests whether you can **create clarity from chaos** and make progress without waiting for someone else to define the path.

Amazon tests this under **Bias for Action** and **Deliver Results.** Google evaluates it as **Leadership.** This is arguably the most important question for L6/E6+ candidates, where ambiguity is the default operating mode.

## Framework: The Ambiguity Navigation

| Step | What to Demonstrate |
|---|---|
| **Recognize the ambiguity** | What was unclear? Requirements? Priorities? Technical approach? Stakeholder alignment? |
| **Impose structure** | How you created order: scoping, breaking down, prioritizing |
| **Seek input** | Who you consulted and what constraints you gathered |
| **Make a call** | The decision you made and why it was reasonable given the unknowns |
| **Iterate** | How you adjusted as clarity emerged |

## Example STAR Answer

> **Situation:** Our product team decided to "add AI-powered features" to our SaaS platform after the CEO saw a competitor demo. There was no product spec, no defined user problem, no technical evaluation — just a directive from leadership that "we need AI features by Q3." Three engineers, including me, were allocated to the initiative.
>
> **Task:** As the most senior engineer on the three-person team, I was expected to turn this vague directive into a concrete plan and deliverable.
>
> **Action:** I started by acknowledging what we did not know. I listed all open questions in a shared doc and categorized them: (1) product questions — what problem are we solving for users? (2) technical questions — what AI capabilities are feasible given our data and infrastructure? (3) business questions — what is the success metric? I then scheduled three targeted conversations. With the PM, I narrowed "AI features" to three specific user pain points in our product analytics. With the data team, I audited what training data we actually had. With the CEO, I clarified the real priority: the most important thing was having a *credible* AI feature to demo at the Q3 investor meeting, not necessarily a fully productionized system. That last conversation was critical — it completely changed the scope. I proposed we build one high-impact feature — an AI-powered anomaly detection system for our analytics dashboard — as a well-polished MVP rather than three half-baked features. I wrote a one-page proposal with a clear definition of done, a two-week milestone plan, and explicit out-of-scope items. The PM and CEO approved within a day.
>
> **Result:** We shipped the anomaly detection feature in 5 weeks. It correctly identified unusual patterns in customer data with 87% precision and became one of the three features highlighted in the Q3 investor presentation. Two enterprise customers cited it as a differentiator in their renewal decisions. The feature later became a full product initiative with dedicated PM support and a four-person team.

## What Interviewers Look For

- **Proactive structure creation:** You did not wait for someone else to define the problem
- **Stakeholder management:** You asked the right questions to the right people
- **Scope management:** You narrowed an impossible ask into a deliverable plan
- **Decision-making under uncertainty:** You made choices with incomplete information
- **Adaptability:** You adjusted your approach as you learned more

## Red Flags

- **Waiting for clarity:** "I asked my manager to define the requirements and waited." That is not navigating ambiguity; that is deferring it.
- **Overengineering:** Building a massive system for a vague problem shows poor judgment about what is needed.
- **Ignoring stakeholders:** Defining scope in isolation without checking with the people who care about the outcome.
- **Paralysis:** "It was really confusing so we had a lot of meetings." Meetings are not progress.

## Common Follow-Ups

- "How did you prioritize which unknowns to resolve first?"
- "What would you have done if the CEO and PM disagreed on scope?"
- "At what point did you feel confident you had enough clarity to start building?"
- "What did you learn about handling ambiguity from this experience?"

## Practice Prompts

1. Describe a project where the requirements changed significantly after you started.
2. Tell me about a time you had to define the problem before solving it.
3. How do you approach a task when you have never done anything similar before?`,
    },
    {
      id: "simplified-complex-system",
      slug: "simplified-complex-system",
      title: "Simplifying a Complex System",
      content: `# Tell Me About a Time You Simplified a Complex System

## Why Simplification Signals Senior Judgment

Adding complexity is easy. Anyone can add another service, another layer of abstraction, another configuration option. **Simplification requires deep understanding** — you must know the system well enough to identify what is unnecessary, what can be consolidated, and what can be removed without breaking downstream dependencies.

Amazon evaluates this directly under **Invent and Simplify.** It is also a strong signal for Google's evaluation of engineering excellence. At the staff level and above, simplification is arguably more valuable than building new things.

## Framework: The Simplification Narrative

| Element | What to Show |
|---|---|
| **The complexity** | What made the system hard to understand, operate, or extend? Be specific. |
| **The cost** | What was the measurable impact of the complexity? (Bugs, onboarding time, operational overhead) |
| **Your analysis** | How you identified what could be simplified |
| **The simplification** | What you removed, consolidated, or restructured |
| **The resistance** | Who pushed back and how you addressed their concerns |
| **The result** | Measurable improvement in simplicity metrics |

## Example STAR Answer

> **Situation:** Our backend had grown to 23 microservices over three years. Seven of those services had been created for features that were later deprioritized or removed, but the services themselves remained — still running, still receiving deployments, still requiring maintenance. New engineers took 4-6 weeks to understand the service map, and our on-call rotation was brutal because any failure could cascade unpredictably through services that nobody fully understood.
>
> **Task:** After my third on-call incident involving a "zombie" service that nobody owned, I proposed a simplification initiative to my director. I was given 20% time allocation for one quarter to investigate and execute.
>
> **Action:** I started with a comprehensive audit. I instrumented every service with request tracing and let it run for two weeks to capture actual traffic patterns. I discovered that 7 of the 23 services handled zero external requests — they only received health checks from our load balancer. Three others handled fewer than 100 requests per day and could be absorbed into neighboring services. I created a consolidation proposal that would reduce 23 services to 14. For each service slated for removal, I documented: current traffic, downstream dependencies, data ownership, and the specific merge plan. The hardest part was not technical — it was organizational. Each service had been someone's project, and proposing removal felt like erasing their work. I framed the consolidation as an evolution, not a criticism. I met individually with the original authors, showed them the traffic data, and asked for their input on the merge plan. Two engineers who initially resisted became the strongest advocates once they saw the operational data. I executed the consolidation in three phases over eight weeks, with rollback plans at each phase.
>
> **Result:** We went from 23 services to 14. On-call incidents decreased by 40% in the following quarter. New engineer onboarding time dropped from 4-6 weeks to 2-3 weeks. Deployment pipeline runtime decreased by 35% because we had fewer services to build and test. Annual infrastructure costs dropped by $48K from decommissioned services. The audit framework I built was adopted as a quarterly health check practice for the entire engineering org.

## What Interviewers Look For

- **Systems thinking:** You understood the full picture, not just one service
- **Data-driven decisions:** You measured before cutting — no guesswork
- **Organizational awareness:** You handled the human side, not just the technical side
- **Courage:** Proposing simplification means challenging existing decisions — that takes backbone
- **Execution discipline:** You phased the rollout and had rollback plans

## Red Flags

- **Reckless deletion:** "I just deleted the old services." Without analysis and stakeholder alignment, this is dangerous.
- **Only technical analysis:** Ignoring the human factors of removing someone's work
- **Premature optimization:** Simplifying a system that was not actually causing problems
- **No metrics:** "It felt simpler" is not evidence. Quantify the improvement.

## Common Follow-Ups

- "How did you handle pushback from the engineers who built those services?"
- "What was your rollback plan if the consolidation broke something?"
- "How did you prioritize which services to consolidate first?"
- "What is the right number of microservices? How do you decide?"

## Practice Prompts

1. Describe a time you reduced the complexity of a codebase or system.
2. Tell me about removing a feature or system that was no longer needed.
3. How do you decide when a system has become too complex?`,
    },
    {
      id: "learned-quickly",
      slug: "learning-something-new-quickly",
      title: "Learning Something New Quickly",
      content: `# Tell Me About a Time You Had to Learn Something New Quickly

## What This Question Evaluates

This question tests your **learning agility** — your ability to become productive in an unfamiliar domain under time pressure. It is particularly important at companies that value versatility and growth mindset. Microsoft explicitly evaluates this under **Growth Mindset.** Amazon frames it as **Learn and Be Curious.**

The key distinction: this is not about listing technologies you have learned. It is about demonstrating **how** you learn — your strategy, your resourcefulness, and your ability to become effective (not expert) quickly.

## Framework: The Rapid Learning Story

| Phase | What to Demonstrate |
|---|---|
| **The need** | Why you needed to learn quickly — what was the deadline or urgency? |
| **The gap** | What specifically you did not know (be honest about your starting point) |
| **Your learning strategy** | How you approached learning — not just "I read the docs" |
| **Application** | How you applied the new knowledge under pressure |
| **Outcome** | The result of your work, including acknowledgment of what a true expert would have done differently |

## Example STAR Answer

> **Situation:** Our team inherited ownership of a Kubernetes-based deployment platform after the infrastructure team was reorganized. The platform served 40 engineering teams and handled 200+ deployments per day. I had no Kubernetes experience — my background was entirely in application development with traditional VM-based deployments.
>
> **Task:** Within two weeks, I needed to be proficient enough to handle on-call for the platform and resolve deployment issues for the 40 teams that depended on it.
>
> **Action:** I designed a structured learning plan with three parallel tracks. First, I spent three hours reading the Kubernetes documentation — not all of it, but specifically the sections on Pods, Deployments, Services, and ConfigMaps, which I identified as the four concepts most relevant to our platform's daily operations. Second, I scheduled pairing sessions with the departing infra engineer for three days, where I shadowed them handling real deployment issues and asked them to narrate their debugging thought process. I took detailed notes on the specific kubectl commands they used and the mental model they applied to diagnose problems. Third, I set up a personal Kubernetes cluster using kind (Kubernetes in Docker) and deliberately broke things — killed pods, misconfigured services, exhausted resource limits — so I could practice diagnosing and fixing failures in a safe environment. I also created a runbook for the 10 most common issues the departing engineer identified, including the exact commands and decision trees for each scenario. On day 8, I shadowed my first real on-call shift. On day 11, I handled my first solo shift.
>
> **Result:** I resolved 15 deployment issues in my first solo on-call week, including a critical pod scheduling failure during a high-traffic event that I diagnosed in 12 minutes using the debugging framework I had built during my learning sprint. The runbook I created reduced average incident resolution time across the team from 35 minutes to 15 minutes. Within two months, I was confident enough to propose and implement improvements to the platform's auto-scaling configuration, which reduced infrastructure costs by 20%.

## What Interviewers Look For

- **Learning strategy:** You had a deliberate plan, not just "I Googled things as they came up"
- **Prioritization:** You identified what to learn first based on immediate practical needs
- **Resourcefulness:** You used multiple learning modalities — docs, mentorship, hands-on practice
- **Self-awareness:** You acknowledged your starting point honestly
- **Quick application:** You applied knowledge under real conditions, not just in theory
- **Knowledge sharing:** You codified what you learned to help others (the runbook)

## Red Flags

- **Overconfidence:** "I picked it up in a day." This either means the thing was not complex, or you are exaggerating.
- **No strategy:** "I just started reading and figured it out." That is not a learning methodology; that is hoping for the best.
- **No acknowledgment of gaps:** If you cannot articulate what a true expert would have done differently, you may lack self-awareness about your proficiency level.
- **Passive learning only:** Only reading documentation without hands-on practice or application

## The "Expert vs. Effective" Distinction

A subtle but important point: interviewers do not expect you to become an expert in two weeks. They want to see that you became **effective** — able to deliver value — quickly. The best answers acknowledge this:

"I was not a Kubernetes expert after two weeks, and I knew it. But I was effective enough to handle 90% of operational issues independently and knew exactly when to escalate the remaining 10%. Over the following months, my depth continued to grow."

This shows self-awareness and maturity.

## Common Follow-Ups

- "How do you decide what to learn first when everything is new?"
- "What is your go-to learning approach for a new technology?"
- "How do you know when you have learned enough to be effective?"
- "What is the most difficult thing you have ever had to learn? Why was it hard?"

## Practice Prompts

1. Describe a time you joined a project using a tech stack you had never worked with.
2. Tell me about a skill you developed from zero to productive in under a month.
3. How do you approach learning a new codebase when you join a team?`,
    },
  ],
};

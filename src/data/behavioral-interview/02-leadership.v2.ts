import { Module } from "../types";

export const leadershipModule: Module = {
  id: "behavioral-leadership",
  title: "Leadership & Influence",
  description: "Master questions about leading teams, influencing without authority, navigating disagreements, mentoring, and making decisions with incomplete information.",
  lessons: [
    {
      id: "led-a-team",
      slug: "led-a-team",
      title: "Tell Me About a Time You Led a Team",
      content: `# Tell Me About a Time You Led a Team

## Why Interviewers Ask This

This is the most common leadership question, and it appears in nearly every behavioral loop at L5/E5 and above. Interviewers are not looking for a story about having the "lead" title — they want evidence that you can **set direction, align people, remove blockers, and deliver results** through a group.

## Framework for a Strong Answer

Structure your answer around these four leadership behaviors:

| Behavior | What to Demonstrate |
|---|---|
| **Vision setting** | You defined the goal or approach, not just executed someone else's plan |
| **Coordination** | You organized work across people, managed dependencies, ran syncs |
| **Unblocking** | You identified and removed obstacles for the team |
| **Accountability** | You took ownership of the outcome — including when things went wrong |

## Example STAR Answer

> **Situation:** Our team of six engineers was tasked with migrating our monolithic order processing system to microservices. The project had been attempted twice before and abandoned both times due to scope creep and lack of coordination. There was significant skepticism across the org.
>
> **Task:** I volunteered to lead the migration after the second failed attempt. My manager agreed but made it clear there was no additional headcount — I needed to drive this with the existing team alongside our regular sprint work.
>
> **Action:** I started by writing a migration playbook that broke the monolith into seven bounded contexts, prioritized by business risk. I set up a weekly migration standup separate from our regular standup, focused solely on migration blockers. I paired each service extraction with a specific engineer, matching their strengths — our strongest database engineer got the data layer separation, our most experienced API developer handled the gateway routing. When we hit a critical blocker around shared database tables, I organized a design session with the DBA team and proposed a strangler fig pattern that let us migrate incrementally without a big-bang cutover. I also created a shared dashboard showing migration progress by service, which I presented at our biweekly engineering all-hands to maintain org-level visibility and accountability.
>
> **Result:** We completed the migration in 14 weeks — beating our 16-week target. System reliability improved from 99.2% to 99.8% uptime. Deployment frequency went from weekly monolith releases to daily per-service deployments. My manager presented the playbook I created to the VP of Engineering, and it was adopted as the migration template for two other teams.

## What Interviewers Look For

- **Proactive leadership** — You stepped up, not just followed instructions
- **People management** — How you assigned work, leveraged strengths, kept morale up
- **Obstacle removal** — Specific blockers you cleared (technical, organizational, interpersonal)
- **Measurable results** — Concrete outcomes with numbers
- **Scalable impact** — Did your work create lasting value beyond the immediate project?

## Red Flags That Sink Your Score

- **Title-based leadership:** "I was the tech lead so people reported to me." That describes a reporting structure, not leadership.
- **Dictating instead of leading:** "I told everyone what to do." Good leaders create alignment, not just give orders.
- **Taking solo credit:** "I basically did all the important work myself." That is an individual contribution story, not leadership.
- **No obstacles:** If everything went smoothly, the story lacks signal on how you handle adversity.

## Common Follow-Up Questions

Prepare answers for these before your interview:

- "How did you handle a team member who disagreed with your approach?"
- "What was the biggest risk, and how did you mitigate it?"
- "What would you do differently if you led this again?"
- "How did you balance this leadership work with your own technical contributions?"
- "How did you keep the team motivated when things got hard?"

## Practice Prompts

1. Describe a project where you set the technical direction for a group of 3+ people.
2. Tell me about a time you organized a team to tackle a problem that had no clear owner.
3. Walk me through how you led a project that had previously failed.`,
    },
    {
      id: "influenced-without-authority",
      slug: "influenced-without-authority",
      title: "Influencing Without Authority",
      content: `# Influencing Without Authority

## Why This Question Is a Favorite

This question tests one of the most valuable skills in any organization: **the ability to drive outcomes when you have no formal power over the people involved**. At most tech companies, the biggest impact comes from cross-team work where nobody "reports to" the person driving the initiative.

Amazon maps this directly to **Earn Trust** and **Have Backbone; Disagree and Commit**. Google evaluates it under **Leadership**. This question appears frequently for L5+ candidates because senior engineers are expected to influence beyond their immediate team.

## Framework: The Influence Stack

| Layer | Tactic | Example |
|---|---|---|
| **Data** | Let the numbers make the argument | "I showed that the current approach caused 3x more on-call pages" |
| **Empathy** | Understand the other side's constraints | "I learned their team was already overcommitted for Q3" |
| **Proposal** | Offer a concrete, low-cost first step | "I suggested a 2-day spike instead of a full commitment" |
| **Allies** | Build coalition before the big meeting | "I got buy-in from two other tech leads beforehand" |
| **Escalation** | Use as last resort, not first move | "Only after three attempts did I bring it to the director level" |

## Example STAR Answer

> **Situation:** Our user-facing API had a 1.2-second average response time on mobile, well above our 500ms target. The bottleneck was in the recommendations service owned by a different team. My team owned the API gateway but had no authority over the recommendations team's backlog.
>
> **Task:** I needed to get the recommendations team to prioritize a latency fix even though it was not on their roadmap and they had their own aggressive feature deadlines.
>
> **Action:** Instead of filing a ticket and waiting, I spent a day profiling the recommendations service with their on-call engineer's permission. I identified that 70% of the latency came from an unindexed database query that could be fixed with a single index addition and a minor query refactor. I wrote up my findings in a one-page doc with flame graphs and before/after projections. Then I set up a 30-minute meeting with their tech lead — not to demand they fix it, but to share what I found and ask if my analysis was correct. When they confirmed my findings, I offered to pair with one of their engineers to implement the fix, so it would not take bandwidth away from their sprint. I also shared the doc with my skip-level manager and theirs, framing it as a cross-team collaboration opportunity rather than a complaint.
>
> **Result:** The recommendations team's engineer and I implemented the fix in two days. Mobile API latency dropped from 1.2 seconds to 380ms. The recommendations team's lead thanked me in their sprint retro and proactively asked if there were other integration points we should optimize together. My manager cited this as a key example of cross-team impact in my promotion packet.

## What Interviewers Look For

- **Empathy first** — You understood the other team's priorities before pushing yours
- **Data-driven persuasion** — You brought evidence, not just opinions
- **Low-friction proposals** — You made it easy for them to say yes
- **Relationship building** — The outcome strengthened the working relationship, not damaged it
- **Appropriate escalation** — You tried peer-to-peer first; escalation was a last resort, if used at all

## Red Flags

- **Going over their head first:** Escalating to management before trying to work directly with the team signals poor judgment.
- **Framing as their problem:** "Their service was slow and they needed to fix it." This is accusatory, not influential.
- **Passive aggression:** "I filed a P1 bug and waited." That is not influence; that is ticket-filing.
- **Ignoring their constraints:** If you never acknowledge why they had not already fixed it, you seem unaware of organizational realities.

## Common Follow-Ups

- "What would you have done if they still said no after your proposal?"
- "How did you decide when to escalate versus when to keep trying at the peer level?"
- "How did you maintain the relationship after the situation was resolved?"
- "Have you ever failed to influence someone? What happened?"

## Practice Prompts

1. Describe a time you convinced another team to change their technical approach.
2. Tell me about getting buy-in for an unpopular technical decision.
3. How have you driven alignment across teams with competing priorities?`,
    },
    {
      id: "disagreement-with-manager",
      slug: "disagreement-with-manager",
      title: "Disagreement with Your Manager",
      content: `# Tell Me About a Time You Disagreed with Your Manager

## What This Question Really Tests

This is a maturity and judgment question. Interviewers want to see that you can: (1) think independently, (2) advocate for your position with evidence, (3) disagree respectfully, and (4) commit to the decision once it is made — even if it is not your preferred outcome.

Amazon calls this **Have Backbone; Disagree and Commit.** It is one of the most important Leadership Principles and is evaluated at every level.

## The Two Acceptable Outcomes

Strong answers end in one of two ways:

1. **You persuaded your manager** — Your evidence changed their mind. Shows influence and analytical skill.
2. **You committed to their decision** — You made your case, they decided differently, and you executed their decision fully. Shows maturity and organizational awareness.

Both are equally valid. The worst outcome is a story where you passively agreed and resented it, or where you went around your manager to get your way.

## Example STAR Answer

> **Situation:** My engineering manager wanted to adopt GraphQL for our new customer-facing API. The team had been using REST for all existing services, and no one on the team had production GraphQL experience. Our deadline to ship the MVP was 8 weeks away.
>
> **Task:** As the senior engineer on the project, I was responsible for the API architecture. I believed switching to GraphQL mid-project introduced unnecessary risk given our timeline and the team's experience level.
>
> **Action:** Rather than just voicing my concern in a standup, I spent an evening writing a comparison document. I evaluated GraphQL vs. REST across five dimensions: learning curve for our team, schema migration complexity, performance characteristics for our specific use case (mostly simple CRUD with a few complex aggregations), tooling maturity in our stack, and timeline risk. For each dimension, I included concrete data — for example, I found three blog posts from companies our size that reported 4-6 weeks of productivity loss during GraphQL adoption. I scheduled a 1:1 with my manager and walked through the document. I acknowledged the legitimate benefits of GraphQL — particularly the flexibility for frontend teams — and proposed a compromise: ship the MVP with REST in our 8-week window, then build a GraphQL layer on top as a fast-follow in the next quarter, giving the team time to ramp up properly.
>
> **Result:** My manager appreciated the structured analysis and agreed with the phased approach. We shipped the REST MVP on time. In Q2, we added GraphQL with a proper learning sprint first, and the adoption was smooth because the team had time to build competence. My manager later told me he shares my comparison doc with other teams as an example of how to evaluate technology adoption decisions.

## What Interviewers Look For

| Signal | Strong | Weak |
|---|---|---|
| **Independence** | Formed your own opinion with reasoning | Just went along or complained to peers |
| **Respect** | Addressed it directly and privately | Argued in public meetings or went around them |
| **Evidence** | Brought data, not just feelings | "I just felt like it was wrong" |
| **Commitment** | Fully executed the final decision | Dragged feet or said "I told you so" when issues arose |
| **Relationship** | The working relationship stayed strong or improved | Created lasting tension |

## Red Flags

- **Insubordination stories:** "I just went ahead and did it my way anyway." This is a strong no-hire signal.
- **Badmouthing your manager:** "They had no idea what they were doing." Shows poor judgment regardless of whether it is true.
- **No resolution:** Stories that end with "We never really resolved it" suggest you avoid conflict rather than navigating it.
- **Trivial disagreements:** Fighting over variable naming conventions does not demonstrate meaningful backbone.

## Common Follow-Ups

- "What would you have done if your manager rejected your proposal?"
- "How did this experience change your working relationship?"
- "Have you ever disagreed and been wrong? What happened?"
- "How do you decide when to push back versus when to commit?"

## Practice Prompts

1. Describe a time your manager made a technical decision you disagreed with. How did you handle it?
2. Tell me about a time you had to commit to a direction you did not agree with.
3. When is it appropriate to escalate a disagreement above your manager?`,
    },
    {
      id: "mentoring-someone",
      slug: "mentoring-someone",
      title: "Tell Me About Mentoring Someone",
      content: `# Tell Me About a Time You Mentored Someone

## Why This Question Matters

Mentoring questions evaluate your ability to **develop others** — a core competency for senior and staff-level engineers. Companies want to know you can multiply your impact through people, not just through code.

At Amazon, this maps to **Develop the Best.** At Google, it falls under **Leadership.** At Microsoft, it directly connects to **Growth Mindset — empowering others to grow.**

## Framework: The Mentoring Story Arc

Strong mentoring stories follow a clear arc:

| Phase | What to Show |
|---|---|
| **Identification** | How you recognized the person needed support |
| **Assessment** | How you understood their specific gap (not just "they were junior") |
| **Approach** | Your tailored strategy — not one-size-fits-all |
| **Execution** | Specific actions: pairing sessions, code reviews, stretch assignments |
| **Outcome** | Measurable growth in the mentee's skills, confidence, or career |

## Example STAR Answer

> **Situation:** A junior engineer, six months out of a bootcamp, joined our team. She was technically capable — her code worked — but her pull requests consistently received 20+ review comments because of architectural issues, missing edge cases, and limited test coverage. She was becoming discouraged and mentioned in our 1:1 that she felt like she was "slowing the team down."
>
> **Task:** As the senior engineer on the team and her onboarding buddy, I took responsibility for accelerating her growth. My goal was to get her PR review comments down to a manageable level and build her confidence within one quarter.
>
> **Action:** I started by reviewing her last ten PRs to identify patterns rather than treating each review as isolated. I found three recurring themes: (1) she was not considering failure modes, (2) she lacked mental models for our system's architecture, and (3) she was writing tests after implementation rather than using tests to guide design. I created a personalized development plan. Each week, we had a 45-minute pairing session where I would walk through one of her recent PRs — not to critique it, but to show my thought process for how I would approach the same problem. I taught her the "what could go wrong" technique: before writing any code, list five ways the feature could fail, then design for those cases. I also started giving her progressively more complex tasks — first bug fixes, then small features, then a full API endpoint with database migrations. For each assignment, I would do a "pre-review" — a 15-minute walkthrough of her approach before she started coding — to catch architectural issues early rather than in PR review.
>
> **Result:** Over three months, her average PR review comments dropped from 22 to 4. She independently designed and shipped a notification service that handled 50K events per day. In her next performance review, her manager rated her as "exceeding expectations" and specifically cited the notification service as evidence. She later told me the "what could go wrong" technique was the single most useful thing she learned in her first year. She is now a mid-level engineer mentoring her own bootcamp grad.

## What Interviewers Look For

- **Diagnosis over prescription:** You understood the *specific* gap, not just "they were junior"
- **Patience and investment:** You committed sustained time, not just a one-off code review
- **Empathy:** You considered their emotional state (confidence, frustration) alongside technical skills
- **Measurable growth:** The mentee demonstrably improved with concrete evidence
- **Scalable methods:** Your techniques could work for other engineers, not just this one person

## Red Flags

- **Savior complex:** "Without me, they would have failed." Good mentoring empowers; it does not create dependency.
- **Doing the work for them:** "I rewrote their code." That is not mentoring; that is taking over.
- **Only technical mentoring:** If you only taught them to write better code but never helped them communicate, prioritize, or navigate the org, the story is incomplete for senior-level evaluation.
- **No measurable outcome:** "I think they appreciated it" is not evidence of impact.

## Common Follow-Ups

- "How did you balance mentoring with your own deliverables?"
- "What did you do when your mentoring approach was not working?"
- "How do you decide how much hand-holding is appropriate versus letting someone struggle?"
- "Have you mentored someone who ultimately was not successful? What happened?"

## Practice Prompts

1. Describe how you helped a teammate grow from junior to mid-level.
2. Tell me about a time you gave someone feedback that changed their approach.
3. How do you adjust your mentoring style for different types of learners?`,
    },
    {
      id: "decision-without-info",
      slug: "decision-without-all-information",
      title: "Making a Decision Without All Information",
      content: `# Making a Decision Without All the Information

## Why This Question Is Critical

In real engineering work, you almost never have complete information. Deadlines arrive before data does. Requirements shift mid-sprint. The interplay between what you know and what you do not know is where engineering judgment lives.

Amazon tests this under **Bias for Action** — their principle that "speed matters in business" and "many decisions are reversible and do not need extensive study." Google evaluates it under **General Cognitive Ability.** This question separates senior engineers who can navigate ambiguity from those who freeze without a clear spec.

## Framework: The Decision Under Uncertainty

| Step | What to Show |
|---|---|
| **Acknowledge the gap** | What specifically did you NOT know? |
| **Assess reversibility** | Was this a one-way door or a two-way door? |
| **Gather what you can** | What quick research or consultation did you do? |
| **Decide and act** | What did you choose and why? |
| **Mitigate risk** | How did you hedge against being wrong? |
| **Follow through** | Did you revisit the decision when more data arrived? |

## Example STAR Answer

> **Situation:** During a Black Friday preparation sprint, our load testing revealed that our search service would likely buckle at 3x normal traffic. We had two weeks before the event. The VP of Engineering asked me to propose a solution by end of day.
>
> **Task:** As the tech lead for the search team, I needed to recommend a scaling strategy without having time for a proper capacity planning exercise. We did not have reliable metrics for our Elasticsearch cluster's actual ceiling, and our last load test had been six months ago with a different data profile.
>
> **Action:** I identified the key unknown: we did not know if the bottleneck was Elasticsearch query throughput, JVM heap pressure, or network I/O between the application layer and the cluster. Running a comprehensive load test would take 3-4 days we did not have. I made a deliberate decision to treat this as a "two-way door" — a decision we could reverse — by choosing a strategy that was safe even if my guess about the bottleneck was wrong. I proposed horizontal scaling: adding three replica nodes to the Elasticsearch cluster (addressing all three potential bottlenecks simultaneously) plus implementing a response cache with a 60-second TTL for the top 1,000 queries (which our analytics showed accounted for 40% of search traffic). I chose this over vertical scaling (which would require downtime) or query optimization (which would require deeper investigation). I documented my reasoning, the unknowns, and my confidence level in a one-page decision doc, shared it with my manager and the infrastructure team, and got a go-ahead within two hours.
>
> **Result:** On Black Friday, we handled 4.2x normal traffic with zero search-related incidents. The cache alone reduced Elasticsearch load by 35%. Post-event analysis showed the actual bottleneck had been JVM heap pressure — the replica nodes helped, but the cache was the real hero. I presented a retrospective to the team, and we established a quarterly load testing cadence to avoid last-minute scrambles in the future.

## What Interviewers Look For

- **Comfort with ambiguity:** You did not panic or demand perfect information before acting
- **Risk assessment:** You explicitly evaluated what could go wrong and planned for it
- **Speed with judgment:** You moved quickly but not recklessly
- **Transparency:** You communicated your uncertainty and reasoning to stakeholders
- **Learning loop:** You revisited the decision afterward and extracted lessons

## Two-Way Door vs. One-Way Door

This is an Amazon concept that is useful in any interview:

| Type | Definition | Example | Approach |
|---|---|---|---|
| **Two-way door** | Easily reversible | Choosing a caching strategy, adding a feature flag | Decide quickly, iterate |
| **One-way door** | Difficult or impossible to reverse | Database schema migration, public API contract | Invest more time in analysis |

Interviewers want to see that you can distinguish between these two types and calibrate your decision-making speed accordingly.

## Red Flags

- **Analysis paralysis:** "I wanted to wait until we had more data." If the deadline required action, waiting is not an option.
- **Recklessness:** "I just picked something and went with it." No risk assessment or mitigation.
- **No acknowledgment of uncertainty:** Presenting the decision as if you had full confidence when you clearly did not.
- **No follow-up:** You never checked whether the decision was right.

## Common Follow-Ups

- "How did you decide what level of risk was acceptable?"
- "What would you have done with one more week?"
- "Have you ever made a fast decision that turned out to be wrong? What happened?"
- "How did you communicate the uncertainty to stakeholders?"

## Practice Prompts

1. Describe a time you had to choose between two technical approaches without enough data to be certain.
2. Tell me about a decision you made quickly that turned out well. How did you know it was safe to move fast?
3. When have you chosen to delay a decision versus acting quickly? What factors influenced your choice?`,
    },
  ],
};

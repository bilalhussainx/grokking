import { Module } from "../types";

export const teamworkModule: Module = {
  id: "behavioral-teamwork",
  title: "Teamwork & Collaboration",
  description: "Master questions about working with difficult teammates, cross-functional projects, resolving team conflicts, making compromises, and building consensus.",
  lessons: [
    {
      id: "difficult-teammate",
      slug: "difficult-teammate",
      title: "Tell Me About Working with a Difficult Teammate",
      content: `# Tell Me About Working with a Difficult Teammate

## What This Question Tests

This is a maturity and interpersonal skill question. Every team has friction. Interviewers want to see that you can **maintain productivity, address issues directly, and preserve working relationships** even when someone is hard to work with. It tests empathy, communication, and conflict resolution.

Amazon evaluates this under **Earn Trust.** Google looks at it under **Googliness** (ability to collaborate effectively). Meta frames it as **Be Open.**

## Framework: The Difficult Teammate Story

| Element | What to Show |
|---|---|
| **The behavior, not the person** | Describe specific actions that caused friction, not character judgments |
| **Your initial response** | How you first tried to address the issue |
| **Direct conversation** | How you raised the issue respectfully |
| **Resolution or adaptation** | What changed — or how you adapted if it did not |
| **Outcome** | Impact on the project and the relationship |

## Example STAR Answer

> **Situation:** I was working on a critical API redesign with another senior engineer who had been at the company for five years. He had strong opinions about architecture and would regularly dismiss suggestions in code reviews with comments like "This won't scale" or "That's not how we do things here" without providing technical reasoning or alternative approaches. Two junior engineers on the team had stopped contributing ideas in design discussions because their proposals were consistently shut down.
>
> **Task:** As the other senior engineer on the team, I needed to address this dynamic. The project had a hard deadline in six weeks, and the team's reduced participation was slowing us down and producing a worse design because we were only hearing one perspective.
>
> **Action:** I started by having a private, direct conversation with him over coffee. I did not frame it as "you're being difficult" — instead, I shared a specific observation: "I noticed that in the last three design reviews, the two junior engineers didn't speak up at all. I think some of the code review comments might be landing harder than intended." I asked for his perspective. He was genuinely surprised — he thought he was just being rigorous. I suggested a concrete change: in code reviews, if he felt an approach would not work, he would explain *why* and suggest an alternative. I also proposed we restructure our design sessions to use a "silent brainstorm" format for the first 10 minutes, where everyone wrote ideas on sticky notes before discussing, so the junior engineers could contribute without the pressure of real-time debate. He agreed to try both changes.
>
> **Result:** The shift was noticeable within a week. His code review comments went from dismissive to constructive — he started writing comments like "I'd suggest X instead because of Y concern about scale." The silent brainstorm format drew out three significant design insights from the junior engineers that we would have missed otherwise, including a caching strategy that reduced API latency by 25%. The project shipped on time. The engineer later thanked me privately, saying he had not realized how his communication style was landing. We continued to work well together on two subsequent projects.

## What Interviewers Look For

- **Direct communication:** You addressed the issue with the person, not around them
- **Empathy:** You tried to understand their perspective before judging
- **Constructive framing:** You focused on behavior and impact, not personality
- **Problem-solving:** You proposed specific, actionable changes
- **Positive outcome:** The situation improved, or you at least made a genuine effort

## Red Flags

- **Gossip or escalation first:** "I talked to my manager about them." Addressing it directly first is always the expectation.
- **Character attacks:** "They were toxic" or "They were incompetent." Describe behaviors, not labels.
- **Passive avoidance:** "I just stopped working with them." That is conflict avoidance, not conflict resolution.
- **Self-righteousness:** "I was clearly right and they were clearly wrong." Real stories have nuance.

## Common Follow-Ups

- "What would you have done if the direct conversation did not work?"
- "Have you ever been the difficult teammate? What happened?"
- "How do you decide when to address something directly versus letting it go?"
- "How do you distinguish between a style difference and a real problem?"

## Practice Prompts

1. Describe a time you worked with someone whose communication style clashed with yours.
2. Tell me about addressing underperformance in a peer without having managerial authority.
3. How have you handled a teammate who was consistently negative in team discussions?`
    },
    {
      id: "cross-functional-project",
      slug: "cross-functional-project",
      title: "Leading a Cross-Functional Project",
      content: `# Tell Me About a Cross-Functional Project

## Why Cross-Functional Experience Matters

As engineers grow in seniority, the scope of their work increasingly spans teams, functions, and organizational boundaries. This question evaluates your ability to **coordinate across different disciplines** (engineering, product, design, data, operations) and navigate the unique challenges of working with people who have different priorities, vocabularies, and success metrics.

Amazon tests this under **Earn Trust** and **Deliver Results.** Google evaluates it under **Leadership.** This question is critical at L5+ because individual-team impact is no longer sufficient.

## Framework: The Cross-Functional Story

| Challenge | What to Show |
|---|---|
| **Alignment** | How you got people with different goals to agree on a shared objective |
| **Communication** | How you bridged technical and non-technical audiences |
| **Coordination** | How you managed dependencies across teams with different timelines |
| **Conflict resolution** | How you handled disagreements between functions |
| **Delivery** | How you drove the project to completion across organizational boundaries |

## Example STAR Answer

> **Situation:** Our company decided to implement GDPR compliance across our entire platform, affecting user data stored in 12 different services owned by four engineering teams, with dependencies on the legal, product, and customer support teams. There was no existing cross-team coordination structure for a project this broad, and the legal deadline was non-negotiable — we had 10 weeks.
>
> **Task:** I was nominated as the engineering lead for the initiative because I had worked on two of the most data-intensive services and had existing relationships with several team leads. My responsibility was to coordinate the engineering work across all four teams and serve as the bridge to the legal and product functions.
>
> **Action:** I started by establishing a shared understanding of the scope. I organized a kickoff meeting with all four engineering leads, the legal counsel, and the product manager. In that meeting, I learned that each team had a different interpretation of what GDPR required. Legal wanted comprehensive data deletion capability. Product wanted a user-facing data export tool. Engineering teams were focused on their own services without considering cross-service data flows. I created a single source of truth: a shared spreadsheet mapping every piece of user data to its storage location, retention policy, and responsible team. This took two days but eliminated confusion immediately. I then broke the 10-week timeline into three phases: Phase 1 (weeks 1-3) — data inventory and classification; Phase 2 (weeks 4-7) — deletion and export implementation; Phase 3 (weeks 8-10) — integration testing and legal review. I held weekly cross-team syncs with a strict 30-minute timebox and a standing agenda: blockers, dependencies, and decisions needed. When the frontend team and the data team disagreed about the UX for data export (the data team wanted a simple CSV dump; the product team wanted a polished user experience), I facilitated a compromise: a clean download page with CSV files organized by data category — technically simple but user-friendly.
>
> **Result:** We achieved full GDPR compliance two days before the legal deadline. Zero data breaches or compliance violations in the subsequent audit. The data mapping spreadsheet became a living document used for all subsequent privacy-related work. My manager's feedback was that this project demonstrated L6-level cross-team coordination, and it was a key factor in my promotion later that year.

## What Interviewers Look For

- **Proactive coordination:** You created the structure, not just participated in it
- **Translation ability:** You could communicate between technical and non-technical groups
- **Dependency management:** You tracked and managed cross-team dependencies
- **Conflict mediation:** You facilitated compromises between competing priorities
- **Delivery under constraints:** You hit a non-negotiable deadline with cross-team dependencies

## Red Flags

- **Pure technical focus:** If your cross-functional story only involves engineering teams, it misses the cross-functional signal
- **Top-down authority:** "I told the other teams what to do." Cross-functional leadership is influence-based, not authority-based.
- **Ignoring non-engineering functions:** Treating product, legal, or design as obstacles rather than partners
- **No mention of conflict:** Cross-functional work always involves friction. If your story has none, it sounds sanitized.

## Common Follow-Ups

- "How did you handle a team that was not meeting their deadlines?"
- "What was the biggest miscommunication, and how did you address it?"
- "How did you manage competing priorities between teams?"
- "What would you do differently in the coordination structure?"

## Practice Prompts

1. Describe coordinating a project that involved engineering, product, and a non-technical function.
2. Tell me about managing dependencies between teams with different priorities.
3. How do you communicate technical constraints to non-technical stakeholders?`
    },
    {
      id: "team-conflict",
      slug: "team-conflict",
      title: "Resolving a Team Conflict",
      content: `# Tell Me About a Time You Resolved a Team Conflict

## What Conflict Resolution Signals

This question evaluates your ability to **identify the root cause of interpersonal or professional disagreements and facilitate a productive resolution.** It is distinct from the "difficult teammate" question because it is about a *conflict* — a situation where two or more people have incompatible goals, approaches, or perspectives — rather than a single person being hard to work with.

## Framework: The Conflict Resolution Arc

| Phase | What to Show |
|---|---|
| **The conflict** | What were the opposing positions? Why did each side believe they were right? |
| **Your role** | Were you a participant or a mediator? Both are valid. |
| **Understanding both sides** | How you sought to understand each perspective |
| **Finding common ground** | What shared goal or constraint you identified |
| **The resolution** | What was decided and how buy-in was achieved |
| **The aftermath** | How the working relationship was preserved or improved |

## Example STAR Answer

> **Situation:** Two engineers on my team were in a heated disagreement about our database strategy for a new feature. Engineer A advocated for using our existing PostgreSQL database with additional tables. Engineer B wanted to introduce DynamoDB, arguing that the access patterns were a natural fit for a key-value store. The debate had been going on for a week, was consuming significant time in code reviews and design discussions, and was starting to create visible tension in team meetings. Other team members were avoiding the topic entirely.
>
> **Task:** As the tech lead, I needed to resolve the disagreement so we could move forward. Both engineers were technically skilled and had valid points. I could not simply overrule one of them without losing trust.
>
> **Action:** I started by meeting with each engineer individually for 30 minutes to fully understand their position. Engineer A was concerned about operational complexity — adding a new database technology meant new monitoring, new failure modes, and a new skill the team needed to develop. Engineer B was focused on performance — the read pattern was a simple key lookup that PostgreSQL would handle with an index scan, while DynamoDB would handle with a direct get, and at our projected scale, the difference was significant. Both had valid concerns. I then scheduled a structured decision meeting with the full team. I set ground rules: each engineer would present their case uninterrupted for 10 minutes, then we would evaluate both options against five predefined criteria I had written on the whiteboard: performance at projected scale, operational complexity, team familiarity, migration effort, and cost. For each criterion, we scored both options 1-5 as a team. DynamoDB won on performance and cost. PostgreSQL won on operational complexity and team familiarity. Migration effort was roughly equal. The total scores were close, but the exercise surfaced a compromise neither had considered: use PostgreSQL now with a well-defined interface layer that would allow us to swap in DynamoDB later if the scale required it. Both engineers agreed this was reasonable.
>
> **Result:** We shipped with PostgreSQL behind a clean repository interface. Six months later, when traffic grew 5x, we migrated the hot path to DynamoDB using the interface layer — a migration that took two days instead of the two weeks it would have taken without the abstraction. More importantly, the structured decision framework became our standard process for resolving technical disagreements, reducing future conflicts from week-long debates to single-meeting resolutions. Both engineers remained collaborative for the rest of their time on the team.

## What Interviewers Look For

- **Impartiality:** You understood both sides before forming an opinion
- **Process-driven resolution:** You created a framework for the decision, not just imposed your preference
- **Respect for expertise:** You valued both engineers' technical judgment
- **Relationship preservation:** The resolution strengthened the team, not fractured it
- **Sustainable process:** You created a repeatable approach for future conflicts

## Red Flags

- **Picking a side immediately:** "I agreed with Engineer A because..." — this is not conflict resolution; it is siding.
- **Avoiding the conflict:** "I let them work it out themselves." If you are the lead, mediating is part of your job.
- **Authority-based resolution:** "I told them we were going with my choice." This suppresses conflict instead of resolving it.
- **No lasting improvement:** If the same type of conflict keeps recurring, you did not actually address the root cause.

## Common Follow-Ups

- "What would you have done if both engineers refused to compromise?"
- "How do you prevent technical disagreements from becoming personal?"
- "Have you ever resolved a conflict and later realized the wrong decision was made? What happened?"
- "When is it appropriate to just make the call yourself?"

## Practice Prompts

1. Describe resolving a disagreement between two engineers about a technical approach.
2. Tell me about a time when a team conflict was caused by unclear ownership or responsibilities.
3. How have you handled a situation where a conflict was affecting the team's velocity?`
    },
    {
      id: "compromise-story",
      slug: "making-a-compromise",
      title: "Tell Me About a Time You Had to Compromise",
      content: `# Tell Me About a Time You Had to Compromise

## Why Compromise Is a Senior-Level Skill

This question tests your ability to **achieve practical outcomes when the ideal solution is not feasible.** Senior engineers constantly face tradeoffs between technical perfection and business reality, between competing team priorities, and between short-term needs and long-term vision. The ability to compromise without compromising quality is a defining skill.

## Framework: The Effective Compromise

| Element | What to Show |
|---|---|
| **Your ideal** | What you wanted and why it was technically sound |
| **The constraint** | What made your ideal unfeasible (time, resources, politics, competing priorities) |
| **The negotiation** | How you found the middle ground |
| **The compromise** | What was given up and what was preserved |
| **The safeguard** | How you ensured the compromise did not create future problems |
| **The result** | How the compromise actually played out |

## Example STAR Answer

> **Situation:** I was designing a new event processing system that needed to handle 10 million events per day with exactly-once processing guarantees. My ideal architecture used Apache Kafka with a transactional outbox pattern, which would provide strong consistency and replay capability. However, the platform team informed me that Kafka adoption was not planned until Q3 — four months away — and my project needed to ship in six weeks.
>
> **Task:** I needed to find an architecture that met our reliability requirements without Kafka, while being realistic about the six-week deadline and the team's existing skill set.
>
> **Action:** I identified the core requirements that could not be compromised: (1) no lost events, and (2) idempotent processing (since exactly-once is hard, at-least-once with idempotency achieves the same user-facing result). I then identified what *could* be compromised: event ordering (our consumers did not actually require strict ordering) and replay capability (nice-to-have but not launch-critical). I proposed using our existing AWS SQS infrastructure with a DynamoDB-based idempotency table. Each event would carry a unique ID, and the consumer would check DynamoDB before processing to prevent duplicates. I presented this to my team as a "bridge architecture" with a clear document outlining: (1) what it achieves now, (2) what it does not achieve, and (3) a migration path to Kafka when the platform was ready. I also met with the platform team lead to ensure our SQS-based design would be easy to swap for Kafka — we agreed on a message envelope format that both systems could use.
>
> **Result:** We shipped in five weeks. The SQS-based system processed 10 million events per day with zero event loss and a duplicate rate under 0.01%, well within our tolerance. When Kafka became available four months later, the migration took one week instead of the four weeks it would have taken without the bridge architecture planning. My manager praised the "pragmatic engineering" approach and used it as a case study in a team meeting about balancing technical aspirations with delivery constraints.

## What Interviewers Look For

- **Clarity on non-negotiables:** You knew what could not be compromised (data integrity) versus what could (ordering, replay)
- **Pragmatism:** You found a workable solution rather than insisting on the perfect one
- **Forward thinking:** Your compromise included a migration path — it was not a dead end
- **Collaboration:** You worked with the platform team to ensure compatibility
- **Ownership of the tradeoff:** You documented what was sacrificed and why

## Red Flags

- **Giving up too easily:** "My manager said no, so I just did it their way." Where is the negotiation?
- **Not compromising at all:** "I convinced everyone I was right." That is a persuasion story, not a compromise story.
- **Compromising on the wrong things:** If you sacrificed data integrity for speed, that is a judgment problem, not a compromise.
- **No documentation of the tradeoff:** Future engineers should not be surprised by the limitations of your compromise design.

## Common Follow-Ups

- "How did you decide which requirements were negotiable and which were not?"
- "What would you have done with two more weeks?"
- "Have you ever compromised and regretted it? What did you learn?"
- "How do you communicate technical tradeoffs to non-technical stakeholders?"

## Practice Prompts

1. Describe a time you shipped something you knew was not architecturally ideal. What tradeoffs did you accept?
2. Tell me about negotiating scope or approach with a product manager who wanted everything.
3. How do you balance "doing it right" with "doing it now"?`
    },
    {
      id: "building-consensus",
      slug: "building-consensus",
      title: "Building Consensus Across a Team",
      content: `# Tell Me About Building Consensus

## What Consensus-Building Evaluates

Building consensus is different from resolving conflict. Conflict resolution implies two opposing sides. Consensus building implies **multiple stakeholders with different perspectives, priorities, or levels of understanding** who need to align on a shared direction. This question evaluates your ability to facilitate alignment proactively.

This is a critical skill for staff and principal engineers, who spend significant time aligning teams on technical direction. Amazon maps it to **Earn Trust.** Google evaluates it under **Leadership.**

## Framework: The Consensus Builder

| Phase | What to Demonstrate |
|---|---|
| **Stakeholder mapping** | Who needs to agree, and what are their individual concerns? |
| **Pre-alignment** | One-on-one conversations before the big meeting |
| **Shared artifact** | A document, proposal, or prototype that grounds the discussion |
| **Facilitated discussion** | How you structured the group conversation |
| **Decision mechanism** | How the final call was made (vote, designated decider, unanimous agreement) |
| **Commit and execute** | How you ensured everyone followed through |

## Example STAR Answer

> **Situation:** Our engineering org needed to choose a standard observability stack. We had four teams using four different monitoring setups: one team used Datadog, one used Prometheus with Grafana, one had a custom ELK-based solution, and one was using CloudWatch. Each team had invested significant effort in their current setup and had strong opinions about why theirs was best. The VP of Engineering asked me to drive alignment on a single stack within one quarter.
>
> **Task:** As a staff engineer with cross-team visibility, I was responsible for facilitating the decision and achieving genuine buy-in — not just a mandate from above. The VP explicitly said, "I don't want to dictate this. Get the teams to own the decision."
>
> **Action:** I started with a listening tour. I spent a week meeting individually with the tech lead from each team to understand their specific requirements, their pain points with their current solution, and their deal-breakers. I cataloged everything in a shared requirements doc. From these conversations, I identified that the teams actually agreed on 80% of their needs — they all wanted: reliable alerting, custom dashboards, log aggregation, and distributed tracing. The disagreements were mostly about UX preferences and migration cost. I created an evaluation matrix with 15 criteria weighted by the priorities I had gathered from the individual conversations. I asked each team to nominate one engineer for an evaluation committee. The committee spent two weeks running all four tools through a standardized test scenario I designed — a simulated production incident requiring dashboard creation, alert setup, log search, and trace analysis. Each committee member scored each tool independently before we discussed results. The results showed Datadog scoring highest on 11 of 15 criteria, but it was also the most expensive. I facilitated a meeting where I presented the data and asked the group to make the call. When the cost concern came up, I proposed we start with Datadog for the three most critical services and migrate the rest over two quarters, phasing the cost. The committee unanimously agreed.
>
> **Result:** All four teams migrated to Datadog within the quarter. Mean time to detection for production incidents dropped 60% within two months as teams now had a shared dashboard language and could cross-reference each other's alerts during incidents. The evaluation framework I created was reused for the next three infrastructure decisions at the company. The key success factor was that every team felt heard and had a representative in the decision — no one felt it was imposed on them.

## What Interviewers Look For

- **Inclusive process:** Everyone affected had a voice in the decision
- **Structured evaluation:** You used data, not just debate, to compare options
- **Pre-alignment:** You did the 1:1 work before the group discussion
- **Facilitation skill:** You guided the conversation without dominating it
- **Follow-through:** The decision stuck because people genuinely bought in

## Red Flags

- **Consensus by authority:** "I presented my recommendation and everyone agreed." That is not consensus; that is compliance.
- **Endless debate:** If the consensus process took months with no decision, you failed at facilitation.
- **Ignoring dissent:** If one team strongly disagreed and you overrode them without addressing their concerns, you did not build consensus.
- **No decision mechanism:** "We discussed it a lot" without a clear path to a decision.

## Common Follow-Ups

- "What would you have done if one team refused to adopt the decision?"
- "How did you handle the most resistant stakeholder?"
- "How do you know when to stop seeking consensus and just make a call?"
- "What is the difference between consensus and compromise?"

## Practice Prompts

1. Describe aligning multiple teams on a shared technical standard or practice.
2. Tell me about a time you facilitated a decision that everyone needed to live with.
3. How do you build buy-in for a decision that will require people to change their workflows?`
    }
  ]
};

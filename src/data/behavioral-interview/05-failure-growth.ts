import { Module } from "../types";

export const failureGrowthModule: Module = {
  id: "behavioral-failure",
  title: "Failure & Growth",
  description: "Handle the toughest behavioral questions about failures, mistakes, missed deadlines, tough feedback, and projects that did not go as planned.",
  lessons: [
    {
      id: "time-you-failed",
      slug: "time-you-failed",
      title: "Tell Me About a Time You Failed",
      content: `# Tell Me About a Time You Failed

## The Question Most Candidates Dread

This is the question that makes engineers sweat. We are trained to solve problems and ship solutions — admitting failure feels counterintuitive in an interview setting. But this is one of the most revealing questions in the behavioral toolkit, and your answer can easily be the difference between a hire and a no-hire.

## What Interviewers Actually Want to See

They are NOT looking for:
- A secret success disguised as a failure ("I worked too hard and burned out... but we shipped!")
- A trivial failure that carries no real consequence
- Someone else's failure that you observed

They ARE looking for:

| Signal | Description |
|---|---|
| **Genuine failure** | Something that actually went wrong, with real consequences |
| **Ownership** | You take responsibility — no finger-pointing |
| **Self-awareness** | You understand why it happened, including your role |
| **Learning** | You extracted specific, actionable lessons |
| **Application** | You applied those lessons in subsequent situations |

## Example STAR Answer

> **Situation:** I was the lead engineer on a project to rebuild our notification system. The old system was unreliable, and stakeholders across the company were frustrated. I was excited about the project and confident I could deliver a significantly better system.
>
> **Task:** I was responsible for designing the new architecture, leading the implementation with two other engineers, and managing the migration from the old system. The timeline was 8 weeks.
>
> **Action:** My failure was in the planning phase. I was so focused on building the "right" architecture that I spent four weeks on design — exploring event sourcing, comparing message brokers, benchmarking different approaches. I was having deep technical conversations but not shipping code. By week 5, I had an elegant design but only 3 weeks left for implementation, testing, and migration. I panicked and cut testing and migration planning to make the deadline. We shipped the new system with insufficient integration tests and did a big-bang migration on a Friday evening.
>
> **Result:** The migration broke notifications for 30% of users over the weekend. We spent Saturday and Sunday rolling back and fixing issues. My manager was disappointed — not because the system had bugs, but because I had made the conscious decision to cut testing to meet a deadline I had created for myself by over-investing in design. The lesson I took was brutal but clear: a good design shipped safely always beats a perfect design shipped recklessly. Since then, I time-box design phases explicitly — I allocate no more than 25% of a project timeline to design, and I treat the migration plan as a first-class deliverable, not an afterthought. I also implemented a personal rule: never ship a migration on a Friday. In my next project, a database migration affecting 5 million records, I applied these lessons and executed a zero-downtime migration with full rollback capability that completed without a single user-facing issue.

## The Humblebrag Trap

The most common failure story mistake is the "humblebrag failure":

**Bad:** "I was so passionate about quality that I over-engineered the solution and we were a few days late."

This is not a failure story — it is a compliment wrapped in false modesty. Interviewers see through it immediately and it signals low self-awareness.

**Good failures to discuss:**
- A project that shipped late or broken because of decisions you made
- A technical bet that did not pan out
- A communication failure that caused misalignment
- A hiring or team decision you got wrong
- A time you did not raise a concern and it caused problems later

## The "Failure + Growth" Formula

The best failure answers follow a clear formula:

1. **What happened** (30 seconds) — the actual failure, with real consequences
2. **Why it happened** (30 seconds) — root cause analysis, focused on your decisions
3. **What you learned** (30 seconds) — specific, actionable lessons
4. **How you applied it** (30 seconds) — concrete evidence you changed your behavior

That fourth part is what separates a 3 from a 4 on the scoring rubric. Anyone can describe a failure. Showing you *changed your behavior* as a result demonstrates genuine growth.

## Red Flags

- **Blaming others:** "The PM gave us bad requirements" or "My teammate wrote buggy code." Own your part.
- **No real consequences:** If nothing bad happened, it is not a real failure.
- **Too distant:** A failure from 10 years ago suggests you have not failed recently — which suggests you are not taking risks.
- **No learning:** Describing the failure without demonstrating what changed.

## Common Follow-Ups

- "What specifically would you do differently?"
- "How did your manager react?"
- "Did this failure affect your confidence? How did you recover?"
- "Can you give me another example of where you applied the lesson?"

## Practice Prompts

1. Tell me about a project that did not meet its goals because of a decision you made.
2. Describe your biggest professional mistake in the last two years.
3. When have you failed to speak up about a concern, and it caused problems?`
    },
    {
      id: "mistake-that-taught",
      slug: "mistake-that-taught-you",
      title: "A Mistake That Taught You Something",
      content: `# Tell Me About a Mistake That Taught You Something

## How This Differs from "Tell Me About a Failure"

While the failure question focuses on the consequences and your ownership of them, the "mistake that taught you" question emphasizes the **learning and transformation.** The interviewer wants a story with a clear before-and-after: how you operated before the mistake, and how you operate differently now.

Microsoft explicitly evaluates this under **Growth Mindset.** It is one of their most important cultural values.

## Framework: The Transformation Story

| Phase | What to Include |
|---|---|
| **Before** | Your old belief, habit, or approach that led to the mistake |
| **The mistake** | What happened — be specific and honest |
| **The realization** | The moment you understood what went wrong |
| **The change** | What you do differently now — a concrete behavioral shift |
| **The evidence** | A specific subsequent situation where the new approach produced a better outcome |

## Example STAR Answer

> **Situation:** Early in my career as a mid-level engineer, I prided myself on being the fastest coder on the team. I would take on complex features and deliver them ahead of schedule. My code worked, but it was dense — long functions, minimal comments, clever one-liners that were hard for others to parse.
>
> **Task:** I was assigned to build a dynamic pricing engine — the most complex feature our team had tackled. I completed it in three weeks, two weeks ahead of schedule. I was proud.
>
> **Action:** The mistake revealed itself over the following months. When a bug was found in the pricing logic, a junior engineer spent two full days trying to understand my code before asking me for help. When I went on vacation, a critical pricing update was delayed by a week because no one else could safely modify the module. My tech lead sat me down and showed me the data: my code had the highest "bus factor" risk on the team — if I left, entire features would become unmaintainable. That conversation was a turning point. I realized that writing code only I could understand was not a strength — it was a liability. I spent the next sprint refactoring the pricing engine: breaking it into smaller functions with descriptive names, adding comprehensive comments explaining business logic (not just what the code does, but *why*), and writing a developer guide for the module. I also started a new personal practice: before submitting any PR, I would re-read my code and ask, "Would a new engineer joining the team understand this without asking me?" If the answer was no, I would refactor before submitting.
>
> **Result:** After adopting this approach, the average time for other engineers to review my PRs dropped from 2 hours to 30 minutes. Bugs in my code became easier for others to fix — the average fix time for issues in my modules dropped from 4 hours to 1.5 hours. More importantly, when I moved to a different team a year later, the handoff took two days instead of the two weeks my lead had initially planned. My code was self-documenting enough that my replacement was productive within a week. I now consider readability to be more important than cleverness in every line I write.

## What Interviewers Look For

- **Genuine self-reflection:** You recognized a real flaw in your approach, not a manufactured one
- **Specific behavioral change:** Not just "I learned to be more careful" — what *specifically* did you change?
- **Evidence of transformation:** A concrete example showing the new approach in action
- **Humility without self-deprecation:** Acknowledging the mistake without being dramatic about it
- **Ongoing application:** The lesson is still part of how you work today

## The Before/After Structure

The strongest answers create a vivid contrast:

| Before | After |
|---|---|
| "I optimized for speed of delivery" | "I optimize for long-term maintainability" |
| "I assumed others would ask if confused" | "I proactively write for the next reader" |
| "I measured success by shipping dates" | "I measure success by team velocity impact" |

## Red Flags

- **Trivial mistakes:** "I forgot to run the tests once." Where is the transformative learning?
- **External blame with internal framing:** "I learned that you can't trust PMs to write good specs." That is blaming, not learning.
- **Vague transformation:** "I learned to be more careful." About what? How? Be specific.
- **No evidence of change:** If you cannot describe a specific situation where you applied the lesson, the learning is theoretical.

## Common Follow-Ups

- "How long did it take you to recognize the pattern?"
- "Did anyone help you see the mistake, or did you realize it yourself?"
- "How do you help others avoid the same mistake?"
- "What is the most recent thing you have changed about how you work?"

## Practice Prompts

1. Describe an engineering practice you used to follow that you have since abandoned. What changed your mind?
2. Tell me about feedback you received that fundamentally changed how you work.
3. What is something you believed strongly as a junior engineer that you now disagree with?`
    },
    {
      id: "missed-deadline",
      slug: "missing-a-deadline",
      title: "Tell Me About Missing a Deadline",
      content: `# Tell Me About a Time You Missed a Deadline

## Why This Question Is So Effective

Every engineer has missed a deadline. The question is not whether you missed one — it is **how you handled it.** This question evaluates your project management skills, communication under stress, ability to course-correct, and honesty with stakeholders.

Amazon evaluates this under **Deliver Results** — not as "never miss deadlines" but as "manage expectations, escalate early, and recover." Google and Meta both value early transparency about project risks.

## Framework: The Missed Deadline Story

| Phase | What to Show |
|---|---|
| **The commitment** | What was the deadline, and what were you expected to deliver? |
| **The warning signs** | When did you first realize you might miss it? |
| **Your response** | Did you communicate early, or hide and hope? |
| **The recovery** | What did you do to minimize the impact? |
| **The outcome** | What ultimately happened? |
| **The prevention** | What did you change to prevent recurrence? |

## Example STAR Answer

> **Situation:** I committed to delivering a real-time analytics dashboard for our product team in four weeks. The dashboard would aggregate data from three services and display key business metrics that the product team needed for quarterly planning.
>
> **Task:** I was the sole engineer on the project. I estimated four weeks based on my initial assessment of the data sources and the dashboard complexity.
>
> **Action:** By week two, I realized I was in trouble. The data from two of the three services was not in the format I had assumed — one service logged events in a proprietary binary format that needed a custom parser, and the other had significant data quality issues with missing timestamps and duplicate records. My original estimate had not accounted for data transformation and cleaning. Here is where I made a good decision and a bad decision. The bad decision: I did not immediately communicate the risk. I spent three days trying to "make up time" by working late, thinking I could absorb the delay. By the end of week two, I was further behind, not caught up. The good decision: on Friday of week two, I stopped and sent an honest status update to the product lead. I explained the technical challenges, revised my estimate to six weeks, and proposed a phased delivery — a dashboard with data from the one clean source in four weeks (the original deadline), with the remaining two data sources added in weeks five and six. The product lead appreciated the early warning and the phased plan. She was able to adjust her quarterly planning timeline and communicate the change to her stakeholders.
>
> **Result:** I delivered the partial dashboard on the original deadline and the complete version two weeks later. The product lead told me she valued the honesty and the phased approach more than she would have valued a late complete delivery. The bigger lesson for me was about estimation. I now follow a practice I call "estimate, then validate": after making my initial time estimate, I spend half a day actually looking at the data, APIs, or dependencies before committing. In the three years since, I have not missed a deadline by more than two days, because my estimates account for real conditions rather than ideal assumptions.

## The Early Warning Principle

The most important behavior this question evaluates is **early communication.** Here is the scoring rubric in most interviewers' minds:

| Behavior | Score |
|---|---|
| Communicated risk early + proposed mitigation | Strong Hire |
| Communicated risk somewhat late but still with time to adjust | Lean Hire |
| Communicated at the deadline that it would be late | Lean No Hire |
| Missed the deadline without warning | Strong No Hire |

Notice that the actual miss matters less than the communication. An engineer who says "I see a risk, here's my plan" two weeks early gets a higher score than one who silently delivers on time by cutting corners.

## Red Flags

- **Blaming scope creep:** "The PM kept adding requirements." Did you push back? Did you communicate the impact?
- **No learning:** Missing the deadline without changing your estimation or communication practices afterward
- **Hero narrative:** "I worked 80-hour weeks and barely made it." This signals poor planning, not heroism.
- **Deflection:** "The other team's API was late." Even if true, what did *you* do about it?

## Common Follow-Ups

- "At what point did you know you would miss it? Why did you wait to communicate?"
- "How did you decide what to cut for the phased approach?"
- "What has changed about how you estimate since then?"
- "How do you handle pressure to commit to unrealistic deadlines?"

## Practice Prompts

1. Describe how you managed expectations when a project was going to be late.
2. Tell me about a time you pushed back on an unrealistic deadline.
3. How do you estimate project timelines? What has gone wrong with your estimates?`
    },
    {
      id: "tough-feedback",
      slug: "receiving-tough-feedback",
      title: "Receiving Tough Feedback",
      content: `# Tell Me About Receiving Tough Feedback

## What This Question Reveals

How you receive feedback is one of the strongest indicators of your growth trajectory. This question tests **ego management, self-awareness, and the ability to convert criticism into improvement.** It is a favorite at Microsoft (Growth Mindset is a core value) and Amazon (Learn and Be Curious).

The best engineers are not those who never receive critical feedback — they are those who receive it, process it without defensiveness, and use it to level up.

## Framework: The Feedback Processing Story

| Phase | What to Show |
|---|---|
| **The feedback** | What specifically was said, and by whom? |
| **Your initial reaction** | Were you defensive, surprised, hurt? Be honest. |
| **Processing** | How you moved from reaction to reflection |
| **Validation** | How you determined whether the feedback was accurate |
| **Action** | What specific changes you made |
| **Result** | Evidence that the changes worked |

## Example STAR Answer

> **Situation:** During my annual performance review, my engineering manager told me that while my technical output was strong, I had a reputation for being "hard to collaborate with" during code reviews. He said two engineers had mentioned that my review comments felt dismissive and that they dreaded opening PRs they knew I would review.
>
> **Task:** This was tough to hear because I genuinely believed I was being helpful — I was catching real bugs and improving code quality. But the feedback was clear: my *impact* was negative because my *delivery* was poor. I needed to change how I communicated in reviews without lowering my technical standards.
>
> **Action:** My first reaction was defensive. I thought, "I'm finding real issues — should I just let bad code through?" I sat with that reaction for a day before doing anything. The next day, I went back through my last 50 code review comments. Reading them with fresh eyes was uncomfortable. I found patterns: I used phrases like "This is wrong" instead of "Have you considered...?", I pointed out problems without suggesting solutions, and I rarely acknowledged what was done well. I was technically correct in my feedback but relationally destructive. I implemented three changes. First, I adopted a "compliment sandwich" structure — start with something genuinely positive, address the issue with a suggested alternative, and end with encouragement. Second, I started every non-trivial suggestion with "I'd suggest" or "What do you think about" instead of declarative statements like "Change this to." Third, for complex feedback, I would walk to the person's desk (or hop on a call for remote colleagues) and discuss it verbally before leaving a comment, so tone could not be misread in text. I also asked one of the engineers who had complained for a monthly 5-minute check-in: "How are my reviews landing? Am I improving?"
>
> **Result:** Within two months, the same engineer who had dreaded my reviews told my manager that the experience had "completely changed." In my next performance review, my manager specifically called out the improvement as one of the most impressive behavioral shifts he had seen in a direct report. I also noticed an unexpected benefit: my review comments were more effective. Engineers were more likely to actually adopt my suggestions when they were framed constructively rather than dismissively. My approval rate on non-trivial suggestions went from roughly 60% to over 90%.

## The Defensiveness Trap

The most important thing interviewers listen for is how you handle the emotional moment:

| Response | Signal |
|---|---|
| "My first reaction was defensive, but I took a day to process" | Self-awareness, emotional maturity |
| "I immediately saw they were right and changed" | Probably not honest — nobody processes instantly |
| "I disagreed with the feedback but changed anyway" | Compliance without growth |
| "I told them they were wrong" | Inability to receive feedback |

The honest answer usually involves some initial resistance followed by genuine reflection. Pretending you had no emotional reaction is less credible than admitting you did and describing how you moved past it.

## Red Flags

- **Rejecting the feedback:** "They were wrong about me." Even if the feedback was partially inaccurate, dismissing it entirely shows closed-mindedness.
- **No behavior change:** "I understood their point, but I kept doing things my way." Why tell this story?
- **Trivial feedback:** "Someone told me my variable names could be more descriptive." This lacks weight.
- **Victim framing:** "It was unfair because I was just trying to help." This signals defensiveness is still present.

## Common Follow-Ups

- "What was your initial emotional reaction?"
- "How did you determine whether the feedback was valid?"
- "Have you ever received feedback that you ultimately disagreed with? What did you do?"
- "How do you give tough feedback to others now?"

## Practice Prompts

1. Describe feedback that changed how you work.
2. Tell me about a time a peer gave you constructive criticism. How did you respond?
3. What is the hardest feedback you have ever received? What did you do with it?`
    },
    {
      id: "project-didnt-go-planned",
      slug: "project-that-didnt-go-as-planned",
      title: "A Project That Didn't Go as Planned",
      content: `# Tell Me About a Project That Didn't Go as Planned

## How This Differs from "A Time You Failed"

While the failure question asks about a specific mistake you made, this question asks about a project with a **disappointing outcome** — which may or may not have been your fault. This question tests your ability to **diagnose systemic issues, manage stakeholders during adversity, and extract organizational lessons** from challenging situations.

## Framework: The Post-Mortem Narrative

| Phase | What to Include |
|---|---|
| **The plan** | What was supposed to happen? What were the goals and timeline? |
| **The deviation** | What actually happened? Where did the plan break down? |
| **Root causes** | Why did things go wrong? (Technical, organizational, process, estimation) |
| **Your response** | What did you do once you realized things were off track? |
| **The outcome** | What was the actual result versus the expected result? |
| **The lessons** | What did you (and the team/org) learn? What changed afterward? |

## Example STAR Answer

> **Situation:** My team was tasked with building a real-time recommendation engine to increase user engagement on our platform. The project was high-visibility — it was one of three "bet the company" initiatives for the year, with the VP of Product personally sponsoring it. The plan was to deliver a personalized recommendation feed in 12 weeks.
>
> **Task:** I was the tech lead responsible for the recommendation engine's architecture and the machine learning pipeline. I had a team of three engineers and one ML engineer.
>
> **Action:** The project went off track in multiple compounding ways. First, we underestimated the data preparation work. Our user behavior data was scattered across six different services with inconsistent schemas. The ML engineer spent five weeks on data cleaning and feature engineering — work we had estimated at two weeks. Second, we discovered in week 7 that our production inference latency was 800ms, well above the 200ms target needed for real-time recommendations. The model that performed well offline was too complex for production serving. Third — and this was the organizational failure — the product team changed the recommendation criteria in week 9 after user research revealed that their original assumptions about what "engaging" content meant were wrong. By week 10, we had a working recommendation system that was too slow, trained on the wrong objective, and had consumed 80% of our timeline. I made the call to be transparent. I wrote a project status document that laid out exactly where we stood, what had gone wrong, and three options: (A) extend the timeline by 6 weeks to fix everything, (B) launch with simplified rule-based recommendations instead of ML and iterate, or (C) cancel the project. I presented this to the VP of Product and my engineering director. We agreed on Option B — launch with rules-based recommendations that could be shipped in two weeks, while the ML model was retrained and optimized in parallel.
>
> **Result:** We launched rule-based recommendations at week 14, two weeks late but functional. User engagement increased 8% — meaningful but below the 25% target. The ML-powered version launched 8 weeks later and achieved 22% improvement. The project was ultimately considered a partial success but a significant learning experience. In the retrospective, I proposed three process changes: (1) mandatory data readiness assessments before any ML project kicks off, (2) latency budgets established in week 1 with prototype validation by week 3, and (3) a "product assumption checkpoint" at the 4-week mark to validate that the target metric is still correct. All three were adopted as team standards.

## What Interviewers Look For

- **Honest assessment:** You do not sugarcoat or spin the outcome
- **Multi-factor analysis:** You identify technical, organizational, and process root causes — not just one scapegoat
- **Stakeholder management:** You communicated status honestly and proposed options
- **Recovery:** You found a way to deliver partial value rather than complete failure
- **Systemic learning:** Your takeaways improved the organization, not just your personal practice

## The Retrospective Mindset

The strongest answers demonstrate what engineers call a "blameless post-mortem" mindset:

| Blameless | Blameful |
|---|---|
| "Our estimation process did not account for data quality" | "The ML engineer was too slow on data prep" |
| "We lacked a mechanism to validate product assumptions early" | "The PM changed requirements on us" |
| "The system design review should have caught the latency issue" | "The architect did not think about performance" |

Blameless framing is not about avoiding accountability — it is about identifying process failures that can be fixed, rather than people failures that lead nowhere.

## Red Flags

- **Everything was someone else's fault:** If the PM, the ML engineer, and the product team all failed but you were perfect, the interviewer will question your self-awareness.
- **No recovery attempt:** Watching the project fail without proposing alternatives or course corrections.
- **Spinning failure as success:** "It didn't go as planned, but it was actually great!" If it did not meet its goals, own that.
- **No process improvements:** If nothing changed afterward, you did not learn from the experience.

## Common Follow-Ups

- "What would you do differently if you ran this project again?"
- "How did you decide between the three options you proposed?"
- "What was the hardest conversation you had during the project?"
- "How did this experience change how you kick off ML projects?"

## Practice Prompts

1. Describe a project where the technical approach turned out to be wrong.
2. Tell me about a high-visibility project that underdelivered. What happened?
3. How do you run retrospectives after a project goes poorly?`
    }
  ]
};

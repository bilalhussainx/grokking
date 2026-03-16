import { Module } from "../types";

export const decisionMakingModule: Module = {
  id: "lg-decision-making",
  title: "Decision Making",
  description:
    "Understand cognitive biases, mental models, and frameworks for making better decisions under uncertainty. Learn from Kahneman's dual-process theory and develop your decision-making toolkit.",
  lessons: [
    {
      id: "lg-cognitive-biases",
      slug: "cognitive-biases",
      title: "Cognitive Biases & Thinking Traps",
      content: `## Cognitive Biases & Thinking Traps

<!-- voice:section_check -->

Daniel Kahneman, Nobel laureate and psychologist, revolutionized our understanding of decision-making with his dual-process theory (2011, *Thinking, Fast and Slow*). His research with Amos Tversky showed that human thinking is systematically biased in predictable ways.

### System 1 and System 2

| System 1 (Fast) | System 2 (Slow) |
|-----------------|-----------------|
| Automatic, effortless | Deliberate, effortful |
| Emotional, intuitive | Logical, analytical |
| Always running | Lazy, avoids activation |
| Pattern-matching | Rule-following |
| Prone to biases | Can override biases (when engaged) |

Most decisions are made by System 1. System 2 is the "fact-checker" that can override System 1, but it requires conscious effort and is easily exhausted.

### The Most Dangerous Biases

**Confirmation Bias**: Seeking information that confirms what you already believe and ignoring contradictory evidence.
- Example: A manager who believes an employee is underperforming notices every mistake but overlooks their successes.

**Anchoring Bias**: Over-relying on the first piece of information encountered.
- Example: In salary negotiation, whoever states a number first sets the "anchor" that influences all subsequent discussion.

<!-- voice:key_insight -->

**Sunk Cost Fallacy**: Continuing to invest in something because of past investment, not future value.
- Example: "We have already spent \$2 million on this project, so we cannot stop now" — even if the project is clearly failing.

**Availability Heuristic**: Judging probability by how easily examples come to mind.
- Example: After seeing news coverage of plane crashes, people overestimate flying risks (despite driving being statistically far more dangerous).

**Overconfidence Bias**: Overestimating the accuracy of your own knowledge and predictions.
- Kahneman's research shows that experts are often no better than chance at predicting complex outcomes, yet they remain highly confident.

### The Pre-Mortem Technique

Gary Klein (2007) developed the **pre-mortem** as an antidote to overconfidence:

1. Assume the project has **already failed** spectacularly
2. Each team member writes down independently: "What went wrong?"
3. Share and discuss all failure scenarios
4. Develop mitigation plans for the most likely failures

This technique bypasses groupthink and confirmation bias by making it safe to voice concerns.

### Practical Exercise: Bias Spotting

For the next week, try to catch yourself in a cognitive bias at least once per day. Record:

1. The decision or judgment you made
2. Which bias was at play
3. What a more objective assessment would look like
4. What you would do differently

### Reflection Questions

- Think of a major decision you regret. Can you identify which cognitive bias contributed to the poor decision?
- Why is the sunk cost fallacy so psychologically powerful, even when people understand it intellectually?

### Further Reading

- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
- Klein, G. (2007). "Performing a Project Premortem." *Harvard Business Review*.`,
    },
    {
      id: "lg-decision-frameworks",
      slug: "decision-frameworks",
      title: "Decision-Making Frameworks",
      content: `## Decision-Making Frameworks

<!-- voice:section_check -->

Good decision-making is not about being smarter — it is about using better processes. The right framework prevents biases from hijacking your judgment.

### The Cynefin Framework

Dave Snowden's **Cynefin Framework** (2007) helps you match your decision-making approach to the type of problem you face:

| Domain | Characteristics | Approach |
|--------|----------------|----------|
| **Simple/Clear** | Cause and effect are obvious | Sense -> Categorize -> Respond (follow best practices) |
| **Complicated** | Cause and effect require expertise to understand | Sense -> Analyze -> Respond (consult experts) |
| **Complex** | Cause and effect only clear in retrospect | Probe -> Sense -> Respond (experiment and learn) |
| **Chaotic** | No clear cause and effect | Act -> Sense -> Respond (take immediate action) |

Most leaders make the mistake of treating complex problems as if they were merely complicated — applying expert analysis when they should be running small experiments.

### The 10/10/10 Rule

Suzy Welch's simple framework for emotional clarity:

When facing a decision, ask:
- How will I feel about this in **10 minutes**?
- How will I feel about this in **10 months**?
- How will I feel about this in **10 years**?

This breaks the grip of short-term emotion and surfaces long-term consequences.

<!-- voice:key_insight -->

### Second-Order Thinking

Most people stop at first-order consequences. Great decision-makers think about second and third-order effects:

**First-order**: "If I fire this underperformer, the immediate problem is solved."
**Second-order**: "Other team members may feel anxious about job security."
**Third-order**: "The team may become more cautious and less innovative."

### The Eisenhower Matrix

For prioritization decisions:

\`\`\`
                    Urgent            Not Urgent
Important     |  DO IT NOW        |  SCHEDULE IT     |
              |  (crises, deadlines) | (planning, growth) |
              |-------------------|-------------------|
Not Important |  DELEGATE IT      |  ELIMINATE IT     |
              |  (interruptions)   | (time wasters)    |
\`\`\`

Most people spend too much time in "Urgent + Not Important" (answering emails, attending unnecessary meetings) and too little time in "Not Urgent + Important" (strategic planning, relationship building, skill development).

### Reversible vs. Irreversible Decisions

Jeff Bezos distinguishes:
- **Type 1 (one-way door)**: Irreversible decisions. Take time, gather data, consult widely.
- **Type 2 (two-way door)**: Reversible decisions. Decide quickly, iterate based on results.

Most decisions are Type 2, but organizations often treat them as Type 1, causing decision paralysis.

### Practical Exercise: Decision Audit

Review 3 important decisions you made in the past year:

For each decision:
1. What information did you base it on?
2. What biases might have influenced you?
3. Did you consider second-order effects?
4. Was it a Type 1 or Type 2 decision?
5. How much time did you spend on it (was it proportionate)?

### Reflection Questions

- Think of a complex problem in your life. Are you treating it as complicated (seeking the right answer) when you should be treating it as complex (running experiments)?
- What is the most important "Not Urgent + Important" activity you have been neglecting?`,
    },
    {
      id: "lg-decision-checkpoint",
      slug: "decision-making-checkpoint",
      title: "Checkpoint: Decision Making",
      content: `## Checkpoint: Decision Making

<!-- voice:section_check -->

Review your understanding of decision-making science.

---

### Question 1
Kahneman's "System 1" thinking is:

A) Slow, deliberate, and logical
B) Fast, automatic, and prone to biases
C) Only active during stressful situations
D) The same as rational thinking

**Answer: B** — System 1 operates automatically, effortlessly, and quickly. It is excellent for pattern-matching and routine decisions but prone to cognitive biases. System 2 (slow, deliberate) can override System 1 but requires conscious effort.

---

### Question 2
A team has spent 18 months and \$3M on a project that clearly will not succeed. The team lead argues "We cannot stop now after investing so much." This is an example of:

A) Anchoring bias
B) Confirmation bias
C) Sunk cost fallacy
D) Availability heuristic

**Answer: C** — The sunk cost fallacy occurs when past investment (time, money, effort) influences the decision to continue, even when future prospects are poor. Rational decision-making should only consider future costs and benefits, not past investments.

---

### Question 3
According to the Cynefin Framework, when facing a complex problem (where cause and effect are only clear in retrospect), the correct approach is:

A) Analyze thoroughly and find the right answer
B) Follow established best practices
C) Probe with small experiments, sense what happens, then respond
D) Act immediately and figure it out later

**Answer: C** — Complex problems do not have knowable right answers in advance. The approach is to run safe-to-fail experiments, observe the results, and amplify what works. This is fundamentally different from the "analyze and plan" approach used for complicated problems.

---

### Question 4
The pre-mortem technique works by:

A) Analyzing what went wrong after a project fails
B) Assuming the project has already failed and asking the team to identify why, before the project starts
C) Firing underperformers before they cause problems
D) Testing the product with users before launch

**Answer: B** — The pre-mortem inverts the timeline: instead of a post-mortem after failure, it imagines failure has already occurred and asks "what went wrong?" This makes it psychologically safe to voice concerns and bypasses groupthink and overconfidence.

---

### Question 5
In Bezos' Type 1 / Type 2 framework, a "Type 2" decision is:

A) An irreversible decision that requires extensive analysis
B) A reversible decision that should be made quickly and iterated upon
C) A decision made by two people
D) The second most important decision

**Answer: B** — Type 2 decisions are "two-way doors" — you can walk through, see the results, and walk back if needed. Most decisions are Type 2 but get treated as Type 1 (irreversible), causing unnecessary delays and paralysis.`,
    },
  ],
};

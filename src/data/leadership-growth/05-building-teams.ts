import { Module } from "../types";

export const buildingTeamsModule: Module = {
  id: "lg-building-teams",
  title: "Building Teams",
  description:
    "Learn the science of high-performing teams. Understand psychological safety, team dynamics, motivation theory, and how to build a culture where people do their best work.",
  lessons: [
    {
      id: "lg-psychological-safety",
      slug: "psychological-safety",
      title: "Psychological Safety",
      content: `## Psychological Safety

<!-- voice:section_check -->

Google's landmark **Project Aristotle** (2015) studied 180 teams to identify what makes teams effective. After two years of research, the single most important factor was not talent, resources, or structure — it was **psychological safety**.

### What Is Psychological Safety?

Amy Edmondson (Harvard Business School) defines psychological safety as "a shared belief held by members of a team that the team is safe for interpersonal risk-taking" (1999, *Administrative Science Quarterly*).

In psychologically safe teams, members feel confident that:
- They will not be punished for making mistakes
- They can ask questions without being seen as ignorant
- They can offer ideas without being ridiculed
- They can challenge the status quo without retaliation

### Google's Project Aristotle Findings

The five factors of team effectiveness (in order of importance):

| Factor | Description |
|--------|-------------|
| **1. Psychological Safety** | Can I take risks without feeling insecure or embarrassed? |
| **2. Dependability** | Can I count on team members to do quality work on time? |
| **3. Structure & Clarity** | Are goals, roles, and plans clear? |
| **4. Meaning** | Is the work personally important to team members? |
| **5. Impact** | Does the team believe its work matters? |

<!-- voice:key_insight -->

### The Connection Between Safety and Performance

Edmondson's research across hospitals revealed that teams with higher psychological safety **reported more errors** — not because they made more mistakes, but because they were willing to acknowledge and learn from them. Teams with low psychological safety hid errors, leading to repeated failures.

### Building Psychological Safety

**As a leader:**
1. **Model vulnerability**: Share your own mistakes and what you learned
2. **Frame failure as learning**: "What did we learn?" not "Whose fault was this?"
3. **Ask genuine questions**: Show curiosity about others' perspectives
4. **Respond constructively**: When someone raises a concern, thank them before addressing it
5. **Address violations immediately**: If someone is mocked for an idea, intervene

**As a team member:**
1. Ask questions without apology
2. Share half-formed ideas ("This might be wrong, but...")
3. Acknowledge your mistakes openly
4. Thank others who take interpersonal risks

### Practical Exercise: Safety Audit

Rate your current team (or any group you belong to) on these dimensions (1-5):

1. If I make a mistake on this team, it is held against me. (reverse scored)
2. Members of this team are able to bring up problems and tough issues.
3. People on this team sometimes reject others for being different. (reverse scored)
4. It is safe to take a risk on this team.
5. It is easy to ask other members of this team for help.
6. No one on this team would deliberately undermine my efforts.
7. Working with this team, my unique skills and talents are valued.

(These questions are from Edmondson's original 7-item scale.)

### Reflection Questions

- Think of a team where you felt psychologically safe. What did the leader or culture do to create that feeling?
- Have you ever held back an idea or concern because it did not feel safe to share? What was the cost?

### Further Reading

- Edmondson, A. (2018). *The Fearless Organization*. Wiley.
- Google re:Work. "Guide: Understand team effectiveness." https://rework.withgoogle.com/guides/understanding-team-effectiveness/`,
    },
    {
      id: "lg-motivation-theory",
      slug: "motivation-theory",
      title: "Motivation: What Really Drives People",
      content: `## Motivation: What Really Drives People

<!-- voice:section_check -->

Daniel Pink's research (2009, *Drive: The Surprising Truth About What Motivates Us*) synthesized decades of motivation science and revealed that traditional reward-and-punishment approaches often backfire for complex, creative work.

### The Surprising Science of Motivation

Pink distinguishes two types of motivation:

**Extrinsic Motivation** (Motivation 2.0): Carrots and sticks
- Effective for: Simple, routine, algorithmic tasks
- Counterproductive for: Creative, complex, heuristic tasks
- Research finding: Offering cash rewards for creative problems actually **decreases performance** (Glucksberg, 1962; Amabile, 1996)

**Intrinsic Motivation** (Motivation 3.0): Internal drive
- Three elements: **Autonomy, Mastery, Purpose**

### The Three Pillars

**Autonomy**: The desire to direct our own lives

People need autonomy over:
- **Task**: What they work on
- **Time**: When they work
- **Team**: Who they work with
- **Technique**: How they do the work

Example: Google's "20% time" (now modified) allowed engineers to work on self-directed projects, producing Gmail, Google News, and AdSense.

<!-- voice:key_insight -->

**Mastery**: The urge to get better at something that matters

Mastery requires:
- **Goldilocks tasks**: Not too easy (boredom), not too hard (anxiety), but just right (flow)
- **Clear feedback**: Knowing how you are progressing
- **Growth mindset**: Believing improvement is possible (Dweck, 2006)

Mihaly Csikszentmihalyi's **flow** research (1990) shows that people are happiest and most productive when challenge and skill are perfectly balanced.

**Purpose**: The yearning to do something in service of something larger than ourselves

- Companies with a clear purpose beyond profit outperform the market by 14:1 over 15 years (Sisodia, Wolfe, & Sheth, 2007, *Firms of Endearment*)
- Employees who connect their work to a meaningful purpose show higher engagement, lower turnover, and better health outcomes

### Martin Seligman's PERMA Model

Positive psychology founder Martin Seligman (2011, *Flourish*) identifies five elements of well-being:

| Element | Description |
|---------|-------------|
| **P**ositive Emotions | Joy, gratitude, serenity, hope |
| **E**ngagement | Flow states, deep absorption in activities |
| **R**elationships | Meaningful connections with others |
| **M**eaning | Purpose, serving something bigger than yourself |
| **A**chievement | Accomplishment, mastery, progress |

### Practical Exercise: Motivation Audit

For your current role or primary activity:

Rate each element 1-10:
- **Autonomy**: How much control do I have over my work?
- **Mastery**: Am I growing and developing?
- **Purpose**: Does my work feel meaningful?
- **Flow**: How often am I in a flow state?
- **Connection**: Do I have meaningful relationships at work?

Which element has the lowest score? What is one specific thing you could do this week to improve it?

### Reflection Questions

- When was the last time you experienced flow? What conditions enabled it?
- Do you know your organization's purpose beyond profit? Does it resonate with you personally?`,
    },
    {
      id: "lg-teams-checkpoint",
      slug: "building-teams-checkpoint",
      title: "Checkpoint: Building Teams",
      content: `## Checkpoint: Building Teams

<!-- voice:section_check -->

Review your understanding of team dynamics and motivation.

---

### Question 1
Google's Project Aristotle found that the single most important factor for team effectiveness is:

A) Having the smartest people on the team
B) Clear goals and structure
C) Psychological safety
D) Strong individual performance

**Answer: C** — After studying 180 teams, Google found that psychological safety — the belief that one will not be punished for making mistakes, asking questions, or proposing ideas — was the strongest predictor of team effectiveness.

---

### Question 2
According to Edmondson's research, teams with high psychological safety reported more errors than teams with low safety. Why?

A) They were less skilled and made more mistakes
B) They were willing to acknowledge and report errors, leading to learning; low-safety teams hid errors
C) Psychological safety makes people careless
D) The research methodology was flawed

**Answer: B** — Teams with high psychological safety reported errors not because they made more, but because the culture made it safe to admit mistakes and learn from them. Teams with low safety hid errors, which led to repeated failures and no learning.

---

### Question 3
Daniel Pink's research found that cash rewards for creative tasks:

A) Significantly improve performance
B) Have no effect on performance
C) Often decrease performance by narrowing focus and reducing intrinsic motivation
D) Only work for senior employees

**Answer: C** — Multiple studies (Glucksberg 1962, Amabile 1996) show that extrinsic rewards can undermine intrinsic motivation and reduce performance on tasks requiring creativity, problem-solving, and innovation. Rewards work for simple, algorithmic tasks but backfire for complex ones.

---

### Question 4
In Pink's framework, the three elements of intrinsic motivation are:

A) Money, Recognition, Promotion
B) Autonomy, Mastery, Purpose
C) Challenge, Feedback, Reward
D) Safety, Belonging, Esteem

**Answer: B** — Autonomy (directing your own work), Mastery (getting better at something meaningful), and Purpose (serving something larger than yourself) are the three pillars of intrinsic motivation that drive engagement and performance in complex work.

---

### Question 5
Csikszentmihalyi's "flow" state occurs when:

A) A task is easy and relaxing
B) Challenge and skill are perfectly balanced, creating deep absorption
C) A person is working under extreme pressure
D) A team is collaborating effectively

**Answer: B** — Flow occurs at the intersection of high challenge and high skill. Too little challenge leads to boredom; too much challenge relative to skill leads to anxiety. Flow is characterized by complete absorption, loss of time awareness, and intrinsic enjoyment.`,
    },
  ],
};

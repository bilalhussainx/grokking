import { Module } from "../types";

export const socialPsychologyModule: Module = {
  id: "psych-social-psychology",
  title: "Social Psychology",
  description: "Explore how people influence each other — conformity, obedience, prejudice, and group behavior. Classic studies by Asch, Milgram, and Zimbardo. Reference: Myers & DeWall, Psychology, 13th ed., Worth Publishers, 2021, Chapters 13-14.",
  lessons: [
    {
      id: "psych-conformity-obedience",
      slug: "conformity-obedience",
      title: "Conformity and Obedience: The Power of Social Pressure",
      content: `## Conformity and Obedience: The Power of Social Pressure

<!-- voice:section_check concept="How social pressure influences behavior" -->

### What You'll Learn

- The difference between conformity and obedience
- Asch's conformity experiments and what they reveal
- Milgram's obedience experiments and their disturbing findings

### Would You Go Along With the Group?

Imagine you're in a room with seven other people. A researcher shows everyone two cards — one with a single line, the other with three lines of different lengths. The task is simple: which of the three lines matches the single line? The answer is obvious.

But one by one, the other seven people give the **wrong answer**. When it's your turn, do you say what you see — or go along with the group?

<!-- voice:section_check concept="Asch's conformity experiment" -->

### Asch's Conformity Experiment (1951)

**Solomon Asch** set up exactly this scenario. The other "participants" were actors (confederates) instructed to give wrong answers on certain trials. The results were startling:

- **75%** of participants conformed at least once
- On average, participants conformed on about **1/3** of the critical trials
- Only **25%** never conformed

When asked privately afterward, most conformers said they knew the answer was wrong but didn't want to stand out or be ridiculed. This is **normative influence** — conforming to fit in.

Factors that increase conformity:
- Larger group size (up to about 5 people)
- The group is unanimous (even one dissenter dramatically reduces conformity)
- The person feels insecure or incompetent
- The culture values group harmony (collectivist cultures show higher conformity)

### Milgram's Obedience Experiment (1963)

If Asch showed we conform to peers, **Stanley Milgram** showed we obey authority figures — even when ordered to harm others.

Participants were told to administer increasingly strong electric shocks to a "learner" (actually an actor) every time the learner gave a wrong answer. The shocks went from 15 volts ("Slight Shock") to 450 volts ("XXX — Danger: Severe Shock"). The learner screamed, begged to stop, then went silent.

The result: **65%** of participants delivered the maximum 450-volt shock.

Participants weren't sadists — many were visibly distressed, sweating, and trembling. But the experimenter (wearing a lab coat) calmly said things like "The experiment requires that you continue." Most people obeyed.

Milgram's findings have been replicated across cultures and decades. They reveal a disturbing truth about human nature: ordinary people will follow authority even when it conflicts with their conscience.

<!-- voice:key_insight insight="Asch showed that we conform to peers; Milgram showed that we obey authority. Both reveal that social pressure can override personal judgment — understanding this is the first step to resisting it." -->

### Reflection Questions

1. In Asch's experiment, having just ONE dissenter in the group dramatically reduced conformity. Why might a single ally have such a powerful effect?
2. Milgram's participants weren't evil — they were ordinary people. What does this tell us about the relationship between situations and behavior?
3. Can you think of a real-world example where conformity or obedience led to harmful outcomes?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 13 — "Social Influence"
- **Stanley Milgram**, *Obedience to Authority*, Harper Perennial, 1974 — Milgram's own account
- **Solomon Asch**, "Opinions and Social Pressure," *Scientific American*, 1955 — the original accessible summary
`,
    },
    {
      id: "psych-prejudice-groups",
      slug: "prejudice-groups",
      title: "Prejudice and Group Behavior",
      content: `## Prejudice and Group Behavior

<!-- voice:section_check concept="How prejudice forms and how groups affect individual behavior" -->

### What You'll Learn

- The components of prejudice: stereotypes, prejudice, and discrimination
- How in-group/out-group thinking fuels bias
- How groups change individual behavior (groupthink, deindividuation)

### Us vs. Them

Humans are social creatures, and we naturally divide the world into **in-groups** ("us") and **out-groups** ("them"). This tendency served our ancestors well — identifying allies and threats was essential for survival. But in modern society, it can lead to **prejudice** — negative attitudes and behaviors directed at people based on their group membership.

<!-- voice:section_check concept="Stereotypes, prejudice, and discrimination" -->

### Three Related Concepts

| Concept | Definition | Level | Example |
|---------|-----------|-------|---------|
| **Stereotype** | A generalized belief about a group | Cognitive (thinking) | "All teenagers are irresponsible" |
| **Prejudice** | An unjustified negative attitude toward a group | Affective (feeling) | Feeling uncomfortable around a group without reason |
| **Discrimination** | Unjustified negative behavior toward a group | Behavioral (acting) | Refusing to hire someone because of their ethnicity |

These three reinforce each other: stereotypes shape prejudice, which motivates discrimination, which reinforces stereotypes.

### The Robbers Cave Experiment (Sherif, 1954)

Muzafer **Sherif** demonstrated how quickly prejudice can form. He took 22 boys to a summer camp and divided them into two groups (the "Eagles" and the "Rattlers"). Within days of competing against each other, the groups developed intense hostility — name-calling, cabin raids, even physical fights.

The solution? **Superordinate goals** — challenges that required both groups to cooperate (like fixing a broken water supply). Once the groups had to work together, hostility decreased dramatically. This suggests prejudice is partly situational — created by competition and reduced by cooperation.

\`\`\`mermaid
graph TD
    A[Social Influence] --> B[Conformity]
    A --> C[Obedience]
    A --> D[Group Polarization]
    A --> E[Bystander Effect]
    B --> B1["Asch: 75% conformed"]
    C --> C1["Milgram: 65% obeyed"]
\`\`\`

### Group Effects on Behavior

Groups change how individuals act:

| Phenomenon | Definition | Example |
|-----------|-----------|---------|
| **Social facilitation** | Performing better on simple tasks in the presence of others | Running faster in a race than in solo practice |
| **Social loafing** | Putting in less effort when working in a group | Not pulling as hard in a tug-of-war team |
| **Groupthink** | Group desire for harmony suppresses dissent and critical thinking | Advisors agreeing with a leader's bad plan to avoid conflict (Janis, 1972) |
| **Deindividuation** | Losing self-awareness in a group, leading to impulsive or antisocial behavior | Mob behavior; online anonymity enabling cruelty |
| **Group polarization** | Group discussion pushes members toward more extreme positions | A moderately liberal group becomes more liberal after discussion |

### The Stanford Prison Experiment (Zimbardo, 1971)

Philip Zimbardo randomly assigned college students to be "guards" or "prisoners" in a simulated prison. Within 36 hours, guards became authoritarian and abusive; prisoners became passive and stressed. The study was terminated after 6 days.

While methodologically criticized (small sample, Zimbardo's dual role as researcher and "warden"), it powerfully demonstrates how **situational forces** — not personality — can drive behavior.

<!-- voice:key_insight insight="Prejudice is not inevitable — it's partly created by situations (competition, group identity) and can be reduced by situations that promote cooperation and individual accountability." -->

### Reflection Questions

1. How does the Robbers Cave experiment suggest prejudice can be reduced? What are the limitations of this approach in the real world?
2. Think of a time you experienced social loafing in a group project. What conditions made loafing more likely?
3. How does deindividuation help explain online trolling and cyberbullying?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapters 13-14 — "Social Influence" and "Social Thinking"
- **Irving Janis**, *Groupthink*, Houghton Mifflin, 1982 — analysis of groupthink in political decision-making
- **Muzafer Sherif**, *The Robbers Cave Experiment*, Wesleyan University Press, 1961 — the original study report
`,
    },
    {
      id: "psych-attitudes-persuasion",
      slug: "attitudes-persuasion",
      title: "Attitudes and Persuasion: Changing Minds",
      content: `## Attitudes and Persuasion: Changing Minds

<!-- voice:section_check concept="How attitudes form and how persuasion works" -->

### What You'll Learn

- What attitudes are and how they form
- The central and peripheral routes to persuasion
- Cognitive dissonance: what happens when beliefs and actions conflict

### Why You Believe What You Believe

An **attitude** is a learned tendency to evaluate something — a person, idea, or object — positively or negatively. You have attitudes about everything: school, politics, social media, broccoli. But where do these attitudes come from, and can they be changed?

Attitudes form through:
- **Experience** — You tried sushi and loved it (direct experience)
- **Social learning** — Your parents hate flying, so you feel nervous about it
- **Classical conditioning** — You associate a brand with happiness because of its commercials

<!-- voice:section_check concept="Two routes to persuasion" -->

### The Elaboration Likelihood Model (Petty & Cacioppo, 1986)

When someone tries to persuade you, your brain can take one of two routes:

| Route | When Used | Focus | Result |
|-------|-----------|-------|--------|
| **Central route** | You're paying attention and care about the topic | Quality of the argument, evidence, logic | Lasting attitude change |
| **Peripheral route** | You're not paying attention or don't care much | Surface cues: speaker attractiveness, celebrity endorsement, emotional music | Temporary attitude change |

Example: A political ad that presents detailed policy data uses the central route. One that shows a candidate hugging puppies while uplifting music plays uses the peripheral route.

Advertisers know most people aren't thinking carefully about toothpaste, so they use the peripheral route — celebrity endorsements, catchy jingles, attractive people.

### Cognitive Dissonance: When Actions and Beliefs Clash

**Cognitive dissonance** (Leon Festinger, 1957) is the uncomfortable tension you feel when your behavior contradicts your beliefs. Your brain wants consistency, so it resolves the tension — usually by **changing the belief** to match the behavior.

Classic experiment: Festinger had participants do a boring task, then paid some $1 and others $20 to tell the next participant it was fun. Those paid $20 had external justification ("I lied for the money"). Those paid only $1 had no good excuse — so they changed their attitude and actually reported finding the task more enjoyable. Less money = more dissonance = more attitude change.

Real-world examples:
- A smoker who knows smoking is harmful may reduce dissonance by thinking "My grandfather smoked and lived to 90"
- Someone who pays a lot for a college course may convince themselves it was excellent, even if it wasn't (justifying the investment)

<!-- voice:key_insight insight="Cognitive dissonance reveals a counterintuitive truth: sometimes changing your behavior first leads to changing your beliefs, not the other way around." -->

### Reflection Questions

1. Think of an advertisement you've seen recently. Did it use the central or peripheral route to persuasion?
2. A student joins a club they weren't sure about. After investing significant time, they start insisting the club is great. How does cognitive dissonance explain this?
3. How could understanding persuasion techniques help you become a more critical consumer of media?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 14 — "Social Thinking"
- **Robert Cialdini**, *Influence: The Psychology of Persuasion*, Harper Business, 2021 (revised ed.) — the definitive guide to persuasion techniques
- **Leon Festinger**, *A Theory of Cognitive Dissonance*, Stanford University Press, 1957 — the original work
`,
    },
    {
      id: "psych-social-psychology-checkpoint",
      slug: "social-psychology-checkpoint",
      title: "Checkpoint: Social Psychology",
      content: `## Module Checkpoint: Social Psychology

### Review

In this module, you explored how people influence each other. You learned about conformity (Asch), obedience (Milgram), how prejudice forms through in-group/out-group dynamics (Sherif), how groups affect behavior (groupthink, deindividuation), and how attitudes are formed and changed through persuasion and cognitive dissonance.

<!-- voice:section_check concept="Module review — social psychology" -->

### Quiz

**Question 1:** In Asch's conformity experiment, approximately what percentage of participants conformed at least once?
A) 25%
B) 50%
C) 75%
D) 95%

**Question 2:** True or False: In Milgram's experiment, most participants who delivered the maximum shock were found to have aggressive or sadistic personalities.
Explain what the study actually revealed about human behavior.

**Question 3:** The uncomfortable feeling that arises when your behavior contradicts your beliefs is called __________.

**Question 4:** Using the Elaboration Likelihood Model, explain why a car commercial featuring a celebrity driving on a beautiful road might be less persuasive than a detailed comparison of safety ratings and fuel efficiency for someone actively shopping for a car.

**Question 5:** In the Robbers Cave experiment, what strategy finally reduced hostility between the two groups? Why did it work when other approaches (like simply bringing the groups together) failed?

<!-- voice:key_insight insight="Social psychology reveals that behavior is powerfully shaped by situations and social forces — understanding these forces is the first step to making more autonomous choices." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

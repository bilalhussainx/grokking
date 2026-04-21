import { Module } from "../types";

export const researchMethodsModule: Module = {
  id: "psych-research-methods",
  title: "Research Methods",
  description: "Learn how psychologists design experiments, distinguish correlation from causation, and follow ethical guidelines. Reference: Myers & DeWall, Psychology, 13th ed., Worth Publishers, 2021, Chapter 1.",
  lessons: [
    {
      id: "psych-experiments-variables",
      slug: "experiments-variables",
      title: "Experiments: Testing Cause and Effect",
      content: `## Experiments: Testing Cause and Effect

<!-- voice:section_check concept="How experiments establish cause and effect" -->

### What You'll Learn

- The components of a well-designed experiment
- The difference between independent and dependent variables
- Why control groups and random assignment matter

### The Gold Standard of Research

Imagine you hear that students who chew gum score higher on tests. Does gum cause better scores? Or do students who chew gum just happen to be more relaxed? The only way to know is to run an **experiment** — the only research method that can establish **cause and effect**.

<!-- voice:section_check concept="Independent and dependent variables" -->

### Anatomy of an Experiment

| Component | Definition | Gum Example |
|-----------|-----------|-------------|
| **Hypothesis** | A testable prediction | "Chewing gum during a test improves scores" |
| **Independent variable (IV)** | What the researcher manipulates | Whether participants chew gum or not |
| **Dependent variable (DV)** | What the researcher measures | Test scores |
| **Experimental group** | Receives the treatment | Students who chew gum |
| **Control group** | Does NOT receive the treatment | Students who don't chew gum |
| **Random assignment** | Each participant has an equal chance of being in either group | Flip a coin to assign groups |

**Random assignment** is the secret ingredient. By randomly placing participants into groups, you ensure that any pre-existing differences (intelligence, motivation, anxiety) are evenly distributed. If the experimental group scores higher, you can confidently say the gum caused the difference — not some other factor.

### Confounding Variables

A **confounding variable** is anything other than the IV that could explain the results. If the gum-chewing group also happened to be tested in the morning (when people are more alert), time of day would be a confound. Good experiments control for confounds by keeping everything the same except the IV.

### Placebo Effect and Blinding

The **placebo effect** occurs when participants improve simply because they *believe* they're receiving a treatment. To control for this:

- **Single-blind study** — participants don't know which group they're in
- **Double-blind study** — neither participants NOR researchers know who is in which group (prevents researcher bias too)

<!-- voice:key_insight insight="Only experiments with random assignment can establish cause and effect. Correlation studies can show relationships, but they cannot prove that one thing causes another." -->

### Reflection Questions

1. A researcher finds that students who sleep 8+ hours get better grades. Can she conclude that more sleep *causes* better grades? Why or why not?
2. Why is random assignment essential for a valid experiment?
3. In a drug trial, why would researchers use a double-blind design rather than single-blind?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 1 — "The Scientific Method"
- **American Psychological Association**, "Research Methods in Psychology" — overview with examples
- **Stanovich**, *How to Think Straight About Psychology*, 11th ed., Pearson, 2019, Chapters 2-4
`,
    },
    {
      id: "psych-correlation-causation",
      slug: "correlation-causation",
      title: "Correlation vs. Causation: The Most Important Distinction",
      content: `## Correlation vs. Causation: The Most Important Distinction

<!-- voice:section_check concept="Why correlation does not equal causation" -->

### What You'll Learn

- What correlation means and how it's measured
- Why correlation does not prove causation
- The three possible explanations for any correlation

### Ice Cream and Drowning

Here's a real statistical fact: ice cream sales and drowning deaths are positively correlated — when one goes up, the other goes up. Does ice cream cause drowning? Of course not. Both increase in summer because of a **third variable**: hot weather.

This is the most important distinction in all of psychology (and science in general): **correlation does not equal causation**.

<!-- voice:section_check concept="Understanding correlation coefficients" -->

### What Correlation Measures

A **correlation coefficient (r)** is a number between -1.00 and +1.00 that describes the strength and direction of a relationship between two variables.

| r value | Meaning |
|---------|---------|
| +1.00 | Perfect positive correlation (as X increases, Y increases) |
| +0.50 | Moderate positive correlation |
| 0.00 | No correlation |
| -0.50 | Moderate negative correlation |
| -1.00 | Perfect negative correlation (as X increases, Y decreases) |

Examples:
- Height and weight: approximately r = +0.70 (positive — taller people tend to weigh more)
- Exercise and depression: approximately r = -0.30 (negative — more exercise is associated with less depression)
- Shoe size and intelligence: approximately r = 0.00 (no correlation)

### The Three Explanations

Whenever you see a correlation between A and B, there are always three possible explanations:

1. **A causes B** — Exercise reduces depression
2. **B causes A** — Depression reduces exercise (people who are depressed move less)
3. **C causes both** — A third variable (like social support) independently affects both exercise and depression

Without an experiment, you cannot distinguish between these three. This is why headlines like "Coffee drinkers live longer!" are misleading — the correlation is real, but the cause is unknown.

<!-- voice:key_insight insight="Every time you see a correlation, ask yourself: Could a third variable explain this? Only an experiment with random assignment can establish cause and effect." -->

### Reflection Questions

1. A study finds that children who watch more TV have lower grades. Give two alternative explanations besides "TV causes lower grades."
2. Why can't researchers always run experiments instead of correlational studies? (Hint: think about ethics.)
3. A news headline reads: "People who eat breakfast earn higher salaries." What questions would you ask before accepting this as evidence that breakfast causes higher earnings?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 1 — "Correlation and Causation"
- **Tyler Vigen**, *Spurious Correlations* (tylervigen.com) — hilarious examples of meaningless correlations
- **Khan Academy**, "Correlation and Causation" — free video with practice problems
`,
    },
    {
      id: "psych-ethics-bias",
      slug: "ethics-bias",
      title: "Ethics and Bias in Psychological Research",
      content: `## Ethics and Bias in Psychological Research

<!-- voice:section_check concept="Ethical guidelines and sources of bias in research" -->

### What You'll Learn

- The key ethical principles guiding psychological research
- Why some famous studies would not be approved today
- How bias can distort research findings

### When Science Goes Wrong

In 1971, psychologist Philip Zimbardo set up a simulated prison in Stanford University's basement. College students were randomly assigned as "guards" or "prisoners." Within days, guards became abusive and prisoners became submissive. The **Stanford Prison Experiment** was stopped after just 6 days (of a planned 14) because of the psychological harm.

This study raised a critical question: just because we *can* study something, does that mean we *should*?

<!-- voice:section_check concept="APA ethical guidelines" -->

### Ethical Principles (APA Guidelines)

The American Psychological Association established ethical guidelines to protect research participants:

| Principle | Requirement |
|-----------|------------|
| **Informed consent** | Participants must know what the study involves and agree voluntarily |
| **Right to withdraw** | Participants can leave the study at any time without penalty |
| **Protection from harm** | Researchers must minimize physical and psychological risk |
| **Confidentiality** | Participants' data must be kept private |
| **Debriefing** | After the study, researchers must explain its true purpose (especially if deception was used) |
| **Deception** | Allowed only when necessary and not harmful; must be followed by debriefing |

**Institutional Review Boards (IRBs)** now review all research proposals before studies can begin, ensuring ethical standards are met.

### Famous Studies and Ethics

| Study | Researcher | Ethical Issues |
|-------|-----------|----------------|
| **Stanford Prison Experiment** (1971) | Zimbardo | Psychological harm; Zimbardo was both researcher AND "prison superintendent" |
| **Milgram Obedience Study** (1963) | Milgram | Extreme stress on participants who believed they were shocking someone |
| **Little Albert** (1920) | Watson & Rayner | Conditioned fear in an infant without consent or deconditioning |
| **Tuskegee Syphilis Study** (1932-1972) | U.S. Public Health Service | African American men with syphilis were left untreated without their knowledge |

The Tuskegee study is the most egregious example — it was not a psychology study per se, but it led directly to federal regulations (the Belmont Report, 1979) that now govern all human research.

### Sources of Bias

| Bias | Description | Example |
|------|------------|---------|
| **Sampling bias** | Study participants don't represent the broader population | Studying only college students and generalizing to all adults |
| **Confirmation bias** | Researchers see what they expect to see | Interpreting ambiguous data as supporting the hypothesis |
| **Social desirability bias** | Participants answer the way they think they should | Underreporting drug use on surveys |
| **Experimenter bias** | Researcher unconsciously influences participants | Smiling when participants give the "right" answer |

<!-- voice:key_insight insight="Ethics and good methodology are not obstacles to science — they are what make science trustworthy. A study that harms participants or produces biased results helps no one." -->

### Reflection Questions

1. Should the Stanford Prison Experiment or Milgram's obedience study have been conducted? What valuable knowledge did they produce, and at what cost?
2. Why is sampling bias a serious problem for psychology (think about who typically participates in studies)?
3. How does double-blinding help reduce both experimenter bias and participant bias?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 1 — "Research Strategies and Ethics"
- **Philip Zimbardo**, *The Lucifer Effect*, Random House, 2007 — Zimbardo's own account of the Stanford Prison Experiment
- **The Belmont Report** (1979) — foundational document for ethical research (available free from HHS.gov)
`,
    },
    {
      id: "psych-research-methods-checkpoint",
      slug: "research-methods-checkpoint",
      title: "Checkpoint: Research Methods",
      content: `## Module Checkpoint: Research Methods

### Review

In this module, you learned how psychologists design experiments to test cause and effect, why correlation does not equal causation, and how ethical guidelines protect research participants. You also explored sources of bias that can undermine even well-intentioned studies.

<!-- voice:section_check concept="Module review — research methods" -->

### Quiz

**Question 1:** The variable that a researcher manipulates in an experiment is called the:
A) Dependent variable
B) Confounding variable
C) Independent variable
D) Control variable

**Question 2:** True or False: A correlation of r = -0.80 is weaker than a correlation of r = +0.50.
Explain how correlation strength is determined.

**Question 3:** The ethical principle requiring researchers to explain the true purpose of a study after it ends is called __________.

**Question 4:** A study finds that people who meditate report less stress. Identify two possible confounding variables and explain why an experiment would be needed to establish causation.

**Question 5:** Milgram's obedience study revealed that 65% of participants administered what they believed were maximum-voltage shocks to another person. What ethical principles did this study violate, and what valuable insight did it provide?

<!-- voice:key_insight insight="Good research requires both rigorous methods (to get accurate answers) and strong ethics (to protect the people who help us find those answers)." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

import { Module } from "../types";

export const foundationsModule: Module = {
  id: "be-foundations",
  title: "Foundations of Behavioral Economics",
  description: "Discover how behavioral economics challenges the rational actor model — from Kahneman's dual-process theory to the concept of bounded rationality.",
  lessons: [
    {
      id: "be-found-what-is",
      slug: "what-is-behavioral-economics",
      title: "What is Behavioral Economics?",
      content: `## What is Behavioral Economics?

**Behavioral economics** is the study of how psychological, cognitive, emotional, cultural, and social factors affect the economic decisions of individuals and institutions. It challenges the standard economic assumption that people are perfectly rational, self-interested, and possess unlimited willpower and information.

### The Standard Model: Homo Economicus

Traditional economics is built on the model of **Homo economicus** — the rational economic agent. This idealized decision-maker:

- Has **complete information** about all available options
- Has **stable, well-defined preferences** that do not change based on context
- Can **process unlimited information** instantly and without error
- Always chooses the option that **maximizes utility** (personal satisfaction)
- Has **perfect self-control** — can delay gratification indefinitely
- Is **purely self-interested** — does not care about fairness or others' outcomes

This model is extraordinarily powerful for building mathematical theories. General equilibrium theory, game theory, and most of finance are built on this foundation. But does it describe how real people actually behave?

### The Behavioral Challenge

Behavioral economists have documented hundreds of systematic deviations from rational behavior. These are not random errors — they are **predictable patterns** that affect everyone:

| Phenomenon | Rational Prediction | Actual Behavior |
|-----------|-------------------|----------------|
| **Loss aversion** | Gains and losses weighted equally | Losses hurt ~2x more than equivalent gains feel good |
| **Present bias** | Discount future consistently | Massively overweight immediate gratification |
| **Anchoring** | Irrelevant numbers ignored | Random numbers influence judgments |
| **Framing** | Same information, same choice | Different wording, different choice |
| **Overconfidence** | Accurate self-assessment | 93% of drivers think they are above average |
| **Status quo bias** | Choose the best option | Stick with the default even when better options exist |

### A Brief History

Behavioral economics is not new. Adam Smith wrote about psychological biases in *The Theory of Moral Sentiments* (1759). But the field as we know it emerged from three intellectual traditions:

**Psychology (1970s):** Daniel Kahneman and Amos Tversky published a series of groundbreaking papers documenting systematic biases in human judgment. Their 1979 paper introducing **Prospect Theory** is the most cited paper in economics.

**Economics (1980s-90s):** Richard Thaler (Nobel Prize 2017) bridged psychology and economics, demonstrating how biases affect markets, saving behavior, and policy. His concept of "mental accounting" showed that people treat money differently depending on its source and intended use — violating the economic principle of fungibility.

**Neuroscience (2000s):** Neuroeconomics uses brain imaging to study decision-making. Research shows that different brain regions are involved in immediate vs. delayed rewards, explaining why we struggle with self-control.

### Why It Matters

Behavioral economics is not just an academic curiosity. It has transformed:

- **Public policy:** Governments worldwide have established "nudge units" that design policies accounting for human biases
- **Finance:** Behavioral finance explains bubbles, crashes, and investor mistakes that rational models cannot
- **Marketing:** Companies exploit cognitive biases to influence purchasing decisions
- **Healthcare:** Understanding present bias explains why people fail to exercise, save for retirement, or take medication consistently
- **Technology:** App designers use behavioral insights to maximize engagement (sometimes ethically, sometimes not)

### The Debate: Biases or Rationality?

Not all economists accept the behavioral critique. Defenders of rationality argue that:
- In competitive markets, irrational agents are exploited and driven out
- Many biases disappear with experience and incentives
- Biases documented in labs may not matter in real-world markets
- People may be rational "on average" even if individually biased

Behavioral economists respond that biases are robust across settings, persist even with high stakes, and are exploited rather than eliminated by markets (think predatory lending, gambling, and addictive app design).

### Key Takeaway

Behavioral economics does not claim that people are irrational. It claims that people are **predictably irrational** — they deviate from rational behavior in systematic, well-documented ways. Understanding these patterns improves our ability to design better policies, products, and personal decision strategies.

> "The agent of economic theory is rational, selfish, and his tastes do not change. The real people we know are often irrational, sometimes altruistic, and their preferences are far from stable." — Richard Thaler

*Resources: Kahneman, Thinking, Fast and Slow; Thaler & Sunstein, Nudge; Ariely, Predictably Irrational.*`,
    },
    {
      id: "be-found-rationality",
      slug: "rationality-vs-reality",
      title: "Rationality vs Reality",
      content: `## Rationality vs Reality

Standard economics assumes people optimize — they gather all relevant information, weigh costs and benefits, and choose the option that maximizes their wellbeing. This is an elegant assumption that makes models tractable. But decades of experimental evidence show that real human decision-making looks nothing like this.

### The Utility Maximization Model

In traditional economics, a consumer faces a **budget constraint** (limited income) and a **utility function** (preferences over goods). They choose the combination of goods that maximizes their utility subject to their budget. This model predicts consistent, transitive preferences: if you prefer A to B and B to C, you must prefer A to C.

**The elegance:** This framework generates powerful predictions about demand, market equilibrium, and welfare. It is the foundation of microeconomics.

**The problem:** Real people violate these assumptions constantly.

### Evidence Against Perfect Rationality

**Preference reversals:** People's choices depend on how options are presented, violating transitivity. In one famous experiment, subjects preferred gamble A over gamble B when choosing between them, but assigned a higher dollar value to gamble B when asked to price each gamble separately. The same person made opposite "choices" depending on the response method.

**Context-dependent preferences:** Adding a clearly inferior option to a choice set can change which of the original options people choose. This **decoy effect** is widely used in marketing. A magazine offering digital-only (\\$59) and print+digital (\\$125) sees most subscribers choose digital-only. Add a "decoy" print-only option at \\$125, and suddenly most choose print+digital — even though the decoy itself is chosen by nobody.

**Inconsistent time preferences:** People are patient about the distant future but impatient about the near future. Given a choice between \\$100 today and \\$110 tomorrow, most choose \\$100 today. But given a choice between \\$100 in 30 days and \\$110 in 31 days (the same one-day wait), most choose \\$110 in 31 days. This **present bias** violates the exponential discounting assumed in rational models.

**Endowment effect:** People value things they own more than identical things they do not own. In a classic experiment by Kahneman, Knetsch, and Thaler (1990), subjects given coffee mugs demanded approximately \\$7 to sell them, while subjects without mugs would pay only about \\$3 to buy them. Same mug, different valuations — simply based on ownership.

### How Experts Fail Too

It is tempting to think that expertise eliminates biases. But research shows that experts are often just as susceptible:

- **Doctors** are influenced by how treatment outcomes are framed (90% survival rate vs. 10% mortality rate leads to different treatment recommendations)
- **Judges** are influenced by anchoring — sentencing decisions vary based on random numbers generated before the case
- **Financial advisors** exhibit the same overconfidence and loss aversion as retail investors
- **Real estate agents** are influenced by listing prices even when they know the prices are arbitrary

### Herbert Simon's Bounded Rationality

Economist **Herbert Simon** (Nobel Prize 1978) proposed a more realistic model of decision-making: **bounded rationality**. People are intendedly rational but face three constraints:

1. **Limited information:** We cannot know everything about every option
2. **Limited cognitive capacity:** Our brains cannot process all available information
3. **Limited time:** Decisions must be made under time pressure

Instead of optimizing (finding the best option), people **satisfice** — they search until they find an option that meets their minimum acceptable threshold, then stop. You do not compare every restaurant in the city before choosing dinner; you pick one that seems good enough.

### Heuristics: Rules of Thumb

Because optimization is impossible in most real-world situations, people rely on **heuristics** — mental shortcuts that usually work well but sometimes produce systematic errors (biases).

Kahneman and Tversky identified three primary heuristics:

**Representativeness:** Judging probability by similarity to a stereotype. "Steve is shy, withdrawn, and detail-oriented. Is he more likely a librarian or a farmer?" Most people say librarian, ignoring the fact that there are far more farmers than librarians (**base rate neglect**).

**Availability:** Judging frequency or probability by how easily examples come to mind. People overestimate the risk of plane crashes and shark attacks (vivid, memorable events) and underestimate the risk of diabetes and heart disease (common but unspectacular).

**Anchoring and adjustment:** Starting from an initial value (the anchor) and adjusting insufficiently. When asked "Is the population of Turkey more or less than 5 million?" then "What is the population of Turkey?", people give much lower estimates than when the anchor is 65 million.

### The "Good Enough" Brain

From an evolutionary perspective, the brain is not designed to maximize utility. It is designed to make decisions quickly in uncertain, dangerous environments. Heuristics evolved because they are fast, frugal, and usually accurate enough for survival. The fact that they sometimes produce errors in modern contexts (financial markets, health decisions, public policy) does not mean they are defective — it means the environment has changed faster than our cognitive hardware.

### Key Takeaway

Real human decision-making is bounded by limited information, cognitive capacity, and time. People use heuristics that are often effective but produce systematic biases. Recognizing these limitations is the starting point for better personal decisions and better-designed policies.

> "Bounded rationality is not irrationality. It is rationality constrained by the computational limitations of the human mind." — Herbert Simon

*Resources: Simon, Models of Bounded Rationality; Kahneman & Tversky, "Judgment Under Uncertainty" (1974); Thaler, Misbehaving.*`,
    },
    {
      id: "be-found-kahneman",
      slug: "kahneman-prospect-theory",
      title: "Kahneman & Prospect Theory",
      content: `## Kahneman & Prospect Theory

Daniel Kahneman and Amos Tversky's **Prospect Theory** (1979) is perhaps the most important contribution to behavioral economics. It replaced the standard Expected Utility Theory as a description of how people actually make decisions under risk. For this work, Kahneman received the Nobel Prize in Economics in 2002 (Tversky had passed away in 1996 and was ineligible).

### The Problem with Expected Utility Theory

**Expected Utility Theory (EUT)**, developed by von Neumann and Morgenstern (1944), says that people evaluate risky prospects by computing the expected utility: the probability-weighted average of the utility of each possible outcome.

EUT makes three key assumptions:
1. People evaluate outcomes in terms of **final wealth** (total assets after the gamble)
2. People are **risk-averse** — they prefer a certain outcome to a gamble with the same expected value
3. People weight probabilities **accurately** — a 10% chance is treated as exactly 10%

Each of these assumptions is systematically violated by real human behavior.

### The Allais Paradox

In 1953, Maurice Allais demonstrated that people violate EUT in a simple experiment:

**Choice 1:** (A) \\$1 million for certain, or (B) 89% chance of \\$1 million, 10% chance of \\$5 million, 1% chance of nothing.

Most people choose A — the certainty of \\$1 million.

**Choice 2:** (C) 11% chance of \\$1 million, 89% chance of nothing, or (D) 10% chance of \\$5 million, 90% chance of nothing.

Most people choose D — the higher potential payoff.

But this pair of choices violates EUT. Under consistent probability weighting, choosing A over B implies choosing C over D. The fact that people choose A and D shows they overweight certainty relative to high probability — the **certainty effect**.

### Prospect Theory: The Key Ideas

Kahneman and Tversky proposed Prospect Theory as a descriptive alternative to EUT. It has four key features:

**1. Reference dependence:** People evaluate outcomes relative to a **reference point** (usually the status quo), not in terms of final wealth. A salary increase from \\$50,000 to \\$60,000 is experienced differently than a salary of \\$60,000 when your reference point was \\$70,000 — even though the final wealth is the same.

**2. Loss aversion:** Losses loom larger than gains. The pain of losing \\$100 is approximately twice as intense as the pleasure of gaining \\$100. This asymmetry explains:
- Why people hold losing stocks too long (to avoid realizing a loss)
- Why people reject small positive-expected-value gambles ("I will flip a coin — heads you win \\$110, tails you lose \\$100")
- Why people are more motivated by fear of loss than hope of gain

**3. Diminishing sensitivity:** The difference between \\$100 and \\$200 feels larger than the difference between \\$1,100 and \\$1,200. Sensitivity decreases as you move further from the reference point, both for gains and losses. This produces a **concave** value function for gains (risk aversion) and a **convex** value function for losses (risk seeking).

**4. Probability weighting:** People do not treat probabilities linearly. They **overweight small probabilities** (explaining why people buy lottery tickets and insurance) and **underweight large probabilities** (explaining the certainty effect). A 1% chance of \\$10,000 is treated as much more than 1/100th of a certain \\$10,000.

### The S-Shaped Value Function

The prospect theory value function is **S-shaped**:
- **Concave for gains** (risk-averse: preferring a sure gain to a gamble with higher expected value)
- **Convex for losses** (risk-seeking: preferring a gamble to a sure loss of equal expected value)
- **Steeper for losses than gains** (loss aversion)

This shape explains a puzzle: the same person can be risk-averse and risk-seeking depending on whether they face a gain or a loss. Someone who buys insurance (risk-averse for losses) may also buy lottery tickets (risk-seeking for small-probability gains).

### Real-World Applications

Prospect Theory's predictions have been confirmed across hundreds of studies:

**Investing:** The **disposition effect** — investors sell winning stocks too early (to lock in gains) and hold losing stocks too long (to avoid realizing losses) — follows directly from the value function's shape.

**Insurance:** People over-insure against low-probability catastrophic events (because they overweight small probabilities) and under-insure against high-probability moderate losses.

**Labor markets:** Taxi drivers work shorter hours on high-demand days (when they reach their daily income target quickly) and longer hours on slow days — the opposite of what rational income-maximizing predicts. They are targeting a reference point.

**Negotiations:** Framing outcomes as losses (rather than forgone gains) makes people fight harder. "You will lose \\$500" is more motivating than "you will not gain \\$500."

### Key Takeaway

Prospect Theory shows that people evaluate outcomes relative to reference points, feel losses more intensely than gains, exhibit diminishing sensitivity, and distort probabilities. It is the most successful descriptive theory of decision-making under risk and the foundation of behavioral economics.

> "The concept of loss aversion is certainly the most significant contribution of psychology to behavioral economics." — Daniel Kahneman

*Resources: Kahneman & Tversky, "Prospect Theory: An Analysis of Decision Under Risk" (1979); Kahneman, Thinking, Fast and Slow.*`,
    },
    {
      id: "be-found-system-1-2",
      slug: "system-1-vs-system-2",
      title: "System 1 vs System 2",
      content: `## System 1 vs System 2

In his bestselling book *Thinking, Fast and Slow* (2011), Daniel Kahneman popularized a framework for understanding how the mind works: **two systems of thinking** that operate in fundamentally different ways. This dual-process model explains why we are sometimes brilliant and sometimes foolish — often in the same day.

### The Two Systems

**System 1: Fast Thinking**
- Automatic, effortless, and always "on"
- Operates below conscious awareness
- Makes quick judgments based on patterns, associations, and heuristics
- Handles routine tasks: recognizing faces, reading emotions, driving a familiar route, catching a ball
- Generates impressions, feelings, and intuitions
- Cannot be turned off — you cannot help but read words or notice a loud noise

**System 2: Slow Thinking**
- Deliberate, effortful, and requires conscious attention
- Handles complex computations: solving math problems, comparing products, planning a trip
- Lazy by default — engages only when System 1 cannot handle a task or when something surprises us
- Resource-limited — performing one demanding task reduces capacity for another
- Experiences itself as the "conscious self" — the voice in your head

### How They Interact

System 1 and System 2 are not literally separate brain regions, but the metaphor captures a real phenomenon documented in cognitive psychology and neuroscience.

**The division of labor:** System 1 handles the vast majority of daily decisions automatically and efficiently. System 2 monitors System 1's output and can override it — but usually does not bother.

**The problem:** System 2 is lazy. It tends to accept System 1's intuitive answers without checking them. This is usually fine (most intuitions are correct), but it leads to predictable errors when System 1's heuristics misfire.

### Classic Demonstrations

**The Bat and Ball Problem:**
"A bat and a ball cost \\$1.10 in total. The bat costs \\$1.00 more than the ball. How much does the ball cost?"

System 1 instantly suggests: 10 cents.

But the correct answer is 5 cents. (If the ball costs 10 cents and the bat costs \\$1.00 more, the bat costs \\$1.10, and the total is \\$1.20, not \\$1.10.)

Over 50% of students at Harvard, MIT, and Princeton get this wrong. Not because they cannot do the math — but because System 2 fails to check System 1's intuitive (and wrong) answer.

**The Moses Illusion:**
"How many animals of each kind did Moses take on the Ark?"

Most people answer "two" without noticing that it was Noah, not Moses, who built the Ark. System 1 processes the question associatively (biblical figure + Ark = seems right) and System 2 does not bother to verify.

**The Muller-Lyer Illusion:**
Two lines of equal length appear different because of the direction of the arrow-shaped fins at each end. Even after you measure and confirm they are equal, the illusion persists — because System 1 continues to see them as different lengths. System 2 knows the truth but cannot override System 1's perception.

### When System 1 Excels

System 1 is not the enemy. It is remarkably good at:
- Pattern recognition (a chess grandmaster instantly "sees" the best move)
- Emotional intelligence (reading facial expressions, detecting social cues)
- Expert intuition in familiar domains (an experienced firefighter sensing danger)
- Language comprehension (you understand sentences without consciously parsing grammar)

Gary Klein's research on expert intuition shows that System 1 can be highly accurate when two conditions are met: (1) the environment has regular patterns, and (2) the decision-maker has extensive practice with feedback. An experienced nurse detecting a patient's deterioration from subtle cues is System 1 working brilliantly.

### When System 1 Fails

System 1 fails in situations that require statistical reasoning, probability assessment, or resistance to compelling but misleading narratives:

- **Base rate neglect:** Ignoring how common something is when evaluating evidence
- **Substitution:** Answering an easier question when faced with a hard one ("Will this investment perform well?" becomes "Do I like this company?")
- **WYSIATI (What You See Is All There Is):** System 1 builds the best story from available information without considering what information might be missing
- **Affect heuristic:** Judgments influenced by emotional state rather than objective analysis

### Cognitive Load and Depletion

System 2 has limited capacity. When it is busy with one task, it has less ability to monitor System 1:

- People are more likely to make biased decisions when multitasking, tired, or stressed
- Judges grant parole more often after lunch breaks (when energy is restored) than late in the morning (when cognitively depleted)
- Shoppers make more impulse purchases when their willpower has been drained by earlier decisions

### Practical Implications

Understanding the two systems helps explain:
- Why we make poor decisions when tired, stressed, or distracted (System 2 is depleted)
- Why first impressions are so powerful and hard to change (System 1 forms them instantly)
- Why simplifying choices and setting good defaults improves decision quality (reduces System 2 burden)
- Why experts can be overconfident — System 1's feeling of "knowing" can be wrong but feels compelling

### Key Takeaway

We have two modes of thinking: fast, intuitive System 1 and slow, deliberate System 2. Most of the time, System 1 serves us well. But in complex, unfamiliar, or statistically tricky situations, we need System 2 to engage — and it often does not. Being aware of this limitation is the first step toward better decisions.

> "Laziness is built deep into our nature. Even the most effortful forms of System 2 thinking are lazy in that they accept the first plausible answer that comes to mind." — Daniel Kahneman

*Resources: Kahneman, Thinking, Fast and Slow (2011); Evans, "Dual-Processing Accounts of Reasoning" (2008); Klein, Sources of Power.*`,
    },
    {
      id: "be-found-bounded-rationality",
      slug: "bounded-rationality",
      title: "Bounded Rationality",
      content: `## Bounded Rationality

**Bounded rationality** is the idea that human decision-making is rational within limits — limits imposed by available information, cognitive capacity, and time. Introduced by Herbert Simon in the 1950s, this concept bridges the gap between the perfectly rational agent of economic theory and the cognitively limited humans we actually are.

### Herbert Simon's Insight

Herbert Simon was a polymath — a political scientist, cognitive psychologist, computer scientist, and economist (Nobel Prize 1978). He observed that the optimization assumed by economic theory requires three things that humans lack:

1. **Complete information** about all options and their consequences
2. **Unlimited computational ability** to process that information
3. **A clear, stable utility function** that ranks all possible outcomes

In real decisions — choosing a career, buying a house, selecting a business strategy — none of these conditions holds. Information is incomplete and costly to acquire. Our brains process information slowly compared to the complexity of most decisions. And our preferences are often unclear, unstable, and influenced by context.

### Satisficing vs. Optimizing

Simon's key behavioral prediction is that people **satisfice** rather than optimize. The word "satisfice" (a combination of "satisfy" and "suffice") means searching through options until you find one that meets your minimum acceptable criteria, then stopping.

**Example:** How do you choose a restaurant for dinner?

An optimizer would: research every restaurant in the area, read all reviews, compare prices, visit each one, and select the one that maximizes utility.

A satisficer would: think of a few options, check if one meets their criteria (good food, reasonable price, not too far), and go there.

The satisficer's approach is "irrational" by the standards of optimization theory. But it is perfectly reasonable given the costs of search (time, effort, cognitive load) and the diminishing returns of additional information.

### The Adaptive Toolbox

Gerd Gigerenzer and colleagues at the Max Planck Institute have argued that bounded rationality is not just a limitation — it can actually produce **better decisions** in uncertain environments. Their research program, centered on the concept of an **adaptive toolbox**, shows that:

**Simple heuristics can outperform complex models.** In many real-world prediction tasks (medical diagnosis, stock picking, consumer choice), simple rules that use limited information outperform sophisticated statistical models that use all available information. This occurs because:
- Complex models **overfit** to noise in the data
- Simple heuristics are **robust** — they perform well across different environments
- Less information means less opportunity for biased processing

**The recognition heuristic:** When asked which of two cities is larger, people who recognize only one city are surprisingly accurate by simply choosing the recognized city. Famously, German students (who recognized fewer American cities) outperformed American students in judging the relative population of US cities — because the Germans could use the recognition heuristic while Americans had too much (distracting) information.

**The 1/N rule:** Dividing investment equally across N options (as many retirement savers do) sounds naive. But DeMiguel, Garlappi, and Uppal (2009) showed that the 1/N rule outperformed 14 optimal portfolio strategies over a 50-year period, because the "optimal" strategies overfit to historical data.

### Bounded Rationality in Organizations

Simon extended bounded rationality to organizations. Firms do not optimize either — they follow **routines, rules of thumb, and standard operating procedures** that have evolved over time. Organizations satisfice through:

- **Budgeting rules** (last year's budget plus 5%) rather than zero-based optimization
- **Hiring heuristics** (prestigious school + relevant experience) rather than comprehensive evaluation
- **Sequential attention** to goals — firms address problems one at a time rather than optimizing all objectives simultaneously

This organizational bounded rationality explains phenomena that puzzle neoclassical economists: why firms are slow to adopt new technologies, why they maintain unprofitable divisions, and why organizational culture matters.

### Ecological Rationality

Gigerenzer's most provocative argument is that whether a heuristic is "biased" depends on the **environment** in which it is used. A heuristic that works well in one environment may fail in another. This is **ecological rationality** — the match between a cognitive strategy and the structure of the environment.

Consider **loss aversion**. In environments where losses can be catastrophic and unrecoverable (predator avoidance, bankruptcy), loss aversion is highly adaptive. In environments where losses and gains are symmetrical and recoverable (investing in a diversified portfolio), loss aversion leads to suboptimal behavior. The "bias" is not in the person — it is in the mismatch between the heuristic and the environment.

### Implications for Policy and Design

If people satisfice rather than optimize, then:

- **Choice architecture matters:** How options are presented affects what people choose (because they do not exhaustively evaluate all options)
- **Defaults are powerful:** When choices are complex, people accept defaults. Setting good defaults (e.g., auto-enrollment in retirement plans) leverages satisficing behavior
- **Simplicity beats complexity:** Simpler products, clearer information, and fewer options often lead to better outcomes than maximizing choice
- **Information overload is real:** More information is not always better — it can overwhelm cognitive capacity and degrade decision quality

### Key Takeaway

Bounded rationality recognizes that humans are intelligent but constrained. We do the best we can with limited information, limited brainpower, and limited time. This is not a flaw to be corrected but a reality to be designed around — in policy, business, and personal life.

> "A wealth of information creates a poverty of attention." — Herbert Simon

*Resources: Simon, Administrative Behavior (1947); Gigerenzer, Simple Heuristics That Make Us Smart; Gigerenzer & Selten, Bounded Rationality: The Adaptive Toolbox.*`,
    },
  ],
};

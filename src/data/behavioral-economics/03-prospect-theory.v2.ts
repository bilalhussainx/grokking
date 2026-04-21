import { Module } from "../types";

export const prospectTheoryModule: Module = {
  id: "be-prospect",
  title: "Prospect Theory Deep Dive",
  description: "Go deeper into the mathematics and applications of Prospect Theory — from expected utility to probability weighting and the powerful effects of framing.",
  lessons: [
    {
      id: "be-prospect-eut",
      slug: "expected-utility-theory",
      title: "Expected Utility Theory",
      content: `## Expected Utility Theory

Before we can fully appreciate Prospect Theory's revolution, we need to understand the framework it replaced: **Expected Utility Theory (EUT)**. Developed by John von Neumann and Oskar Morgenstern in 1944, EUT is the standard model of rational decision-making under risk and remains the foundation of most economic and financial theory.

### From Expected Value to Expected Utility

The simplest approach to risky decisions is **expected value** — multiply each outcome by its probability and sum. A gamble with a 50% chance of winning \\$200 and a 50% chance of winning nothing has an expected value of \\$100.

But expected value fails to explain basic behavior. In the **St. Petersburg Paradox** (posed by Nicolas Bernoulli in 1713), a coin is flipped repeatedly until it lands tails. The payoff is \\$2^n where n is the number of flips. The expected value of this gamble is infinite. Yet no reasonable person would pay more than about \\$20 to play.

Daniel Bernoulli (1738) resolved the paradox by proposing that people value **utility** (subjective satisfaction), not money directly. The utility of each additional dollar diminishes as you get richer — a concept called **diminishing marginal utility**. A billionaire gains less satisfaction from an extra \\$1,000 than a minimum-wage worker does.

### The Von Neumann-Morgenstern Framework

Von Neumann and Morgenstern formalized this insight. Their Expected Utility Theory states that a rational decision-maker evaluates a risky prospect by computing:

**EU = p1 * U(x1) + p2 * U(x2) + ... + pn * U(xn)**

Where p_i is the probability of outcome x_i, and U(x_i) is the utility of that outcome.

A rational agent always chooses the option with the highest expected utility. The utility function U is concave for a risk-averse person (the marginal utility of income decreases with wealth), linear for a risk-neutral person, and convex for a risk-seeker.

### The Axioms of EUT

EUT is derived from four axioms about rational preferences:

**1. Completeness:** For any two options A and B, you either prefer A to B, prefer B to A, or are indifferent. You can always make a comparison.

**2. Transitivity:** If you prefer A to B and B to C, you must prefer A to C. No circular preferences.

**3. Independence:** If you prefer A to B, then you also prefer a gamble involving A (with some probability of a third option C) to the same gamble involving B. Adding a common element should not change preferences between A and B.

**4. Continuity:** If you prefer A to B to C, there exists some probability mixture of A and C that you find exactly as good as B.

If your preferences satisfy these four axioms, there exists a utility function such that you will always choose the option that maximizes expected utility.

### Why EUT Is Powerful

EUT is the workhorse of economic theory because:
- It provides a **clear, testable prediction** about how people should choose under risk
- It is the basis for **risk management** and insurance pricing
- It underlies **modern portfolio theory** (Markowitz), the **Capital Asset Pricing Model**, and **option pricing**
- It provides welfare analysis tools — if people maximize expected utility, we can evaluate policies by their effect on utility

### Where EUT Fails

Despite its elegance, EUT systematically fails to predict actual human behavior:

**The Allais Paradox (1953):** We covered this in the Prospect Theory lesson — people's choices violate the independence axiom when certainty is involved.

**The Ellsberg Paradox (1961):** Daniel Ellsberg showed that people prefer gambles with known probabilities over gambles with unknown probabilities, even when the expected values are identical. This "ambiguity aversion" violates EUT, which treats all probabilities equally regardless of how well they are known.

**Risk-seeking in losses:** EUT with a concave utility function predicts universal risk aversion. But people are often risk-seeking when facing losses — they prefer a gamble with a chance of avoiding a loss to a certain loss of equal expected value.

**Small-stakes risk aversion:** Matthew Rabin (2000) proved a devastating theorem: if EUT correctly predicted people's aversion to small gambles (like rejecting a 50/50 bet to win \\$110 or lose \\$100), it would imply absurdly extreme risk aversion for large gambles — refusing a 50/50 bet to win \\$1 billion or lose \\$1,000. Since people are clearly not that risk-averse for large stakes, EUT cannot explain both small-stakes and large-stakes behavior simultaneously.

### The Status of EUT Today

EUT remains the normative standard — it describes how people **should** make decisions if they want to be consistent. But as a descriptive theory — how people **actually** decide — it has been largely supplanted by Prospect Theory and other behavioral models. Most practitioners use EUT for formal analysis and Prospect Theory for understanding actual behavior.

### Key Takeaway

Expected Utility Theory is a beautiful mathematical framework that defines rational behavior under risk. Its axioms are compelling, and it powers most of finance and economic theory. But real humans systematically violate its predictions — motivating the development of Prospect Theory as a more accurate description of actual decision-making.

> "Expected utility theory is the ruling paradigm in economics. It is also clearly wrong as a description of human behavior." — Matthew Rabin

*Resources: Von Neumann & Morgenstern, Theory of Games and Economic Behavior (1944); Mas-Colell, Whinston & Green, Microeconomic Theory; Rabin, "Risk Aversion and Expected-Utility Theory" (2000).*`,
    },
    {
      id: "be-prospect-theory-detail",
      slug: "prospect-theory-detail",
      title: "Prospect Theory in Detail",
      content: `## Prospect Theory in Detail

Prospect Theory, developed by Kahneman and Tversky (1979) and refined as Cumulative Prospect Theory (1992), is the most successful descriptive model of decision-making under risk. This lesson examines its formal structure and predictions more closely.

### The Two Phases of Decision-Making

Prospect Theory proposes that people process risky decisions in two phases:

**Phase 1: Editing**
Before evaluating options, people simplify them through several operations:
- **Coding:** Outcomes are classified as gains or losses relative to a reference point
- **Combination:** Probabilities of identical outcomes are combined
- **Segregation:** Riskless components are separated from risky components
- **Cancellation:** Common elements across options are discarded
- **Simplification:** Probabilities and outcomes are rounded
- **Dominance detection:** Obviously dominated options are eliminated

The editing phase explains many context effects — how you edit the problem depends on how it is presented.

**Phase 2: Evaluation**
The edited prospects are evaluated using two functions:
1. A **value function** v(x) that assigns subjective value to outcomes
2. A **probability weighting function** w(p) that transforms objective probabilities

The overall value of a prospect is:

**V = w(p1) * v(x1) + w(p2) * v(x2) + ...**

This looks similar to EUT but with two crucial modifications: the value function replaces the utility function, and the probability weighting function replaces raw probabilities.

### The Value Function

The value function has three key properties:

**1. Reference dependence:** Value is defined over gains and losses from a reference point, not over final wealth states. The reference point is typically the status quo but can be an expectation, aspiration level, or social comparison.

**2. Loss aversion:** The function is steeper for losses than for gains. The loss aversion coefficient (lambda) is approximately 2, meaning v(-x) is roughly -2 * v(x).

**3. Diminishing sensitivity:** The function is concave for gains and convex for losses. The difference between \\$0 and \\$100 feels larger than the difference between \\$1,000 and \\$1,100 (both for gains and losses). Mathematically, v(x) = x^alpha for gains and v(x) = -lambda * (-x)^beta for losses, where alpha and beta are approximately 0.88.

### The Probability Weighting Function

People do not treat probabilities linearly. The probability weighting function w(p) has two key properties:

**1. Overweighting of small probabilities:** w(0.01) > 0.01. A 1% chance is treated as if it were more than 1%. This explains:
- Lottery tickets (people overweight the tiny chance of winning)
- Insurance against rare catastrophes (people overweight the small probability of disaster)
- Fear of rare risks (terrorism, plane crashes)

**2. Underweighting of moderate to high probabilities:** w(0.9) < 0.9. A 90% chance is treated as less than 90%. This explains:
- The certainty effect (the jump from 99% to 100% feels much larger than from 89% to 90%)
- Why people pay large premiums for "guaranteed" outcomes

The weighting function is **inverse S-shaped**: it overweights small probabilities and underweights large ones, with a crossover point around p = 0.30-0.40.

### The Four-Fold Pattern of Risk Attitudes

Combining the value function and probability weighting function produces a **four-fold pattern** of risk attitudes:

| | High Probability | Low Probability |
|---|---|---|
| **Gains** | Risk averse (prefer sure gain) | Risk seeking (prefer gamble) |
| **Losses** | Risk seeking (prefer gamble) | Risk averse (prefer sure loss) |

**High probability gains:** "Would you prefer \\$900 for sure or a 90% chance of \\$1,000?" Most choose the sure \\$900 (risk aversion for gains).

**Low probability gains:** "Would you prefer \\$5 for sure or a 0.1% chance of \\$5,000?" Many choose the gamble (lottery ticket behavior — risk seeking for low-probability gains).

**High probability losses:** "Would you prefer to lose \\$900 for sure or a 90% chance of losing \\$1,000?" Most choose the gamble (risk seeking for losses — hoping to avoid the loss).

**Low probability losses:** "Would you prefer to lose \\$5 for sure or a 0.1% chance of losing \\$5,000?" Many choose the sure loss (insurance behavior — risk aversion for low-probability losses).

This four-fold pattern is incompatible with EUT (which predicts consistent risk aversion or risk-seeking) but follows naturally from Prospect Theory.

### Cumulative Prospect Theory (1992)

The original 1979 version of Prospect Theory had technical problems (it could violate dominance in certain cases). Kahneman and Tversky's 1992 Cumulative Prospect Theory fixed these by applying the probability weighting function to cumulative distributions rather than individual probabilities. This version is the standard formalization used in academic research.

### Key Takeaway

Prospect Theory's formal structure — reference-dependent value function, loss aversion, diminishing sensitivity, and probability weighting — generates predictions that match observed human behavior far better than Expected Utility Theory. Its four-fold pattern of risk attitudes explains behaviors ranging from lottery purchases to insurance demand to investment mistakes.

*Resources: Kahneman & Tversky, "Prospect Theory" (1979); Tversky & Kahneman, "Advances in Prospect Theory: Cumulative Representation of Uncertainty" (1992).*`,
    },
    {
      id: "be-prospect-value-function",
      slug: "value-function",
      title: "The Value Function",
      content: `## The Value Function

The **value function** is the heart of Prospect Theory. It captures how people subjectively experience gains and losses — and its shape explains a remarkable range of economic behavior that standard utility theory cannot.

### Shape of the Value Function

The value function is **S-shaped**, passing through the reference point (the origin) with three distinctive features:

**1. Concave above the reference point (gains):** Each additional dollar of gain produces less additional value. Winning \\$100 feels great; winning \\$200 feels better but not twice as great. This concavity in the gains domain produces risk aversion for gains — a sure \\$50 is preferred to a 50/50 chance of \\$100 or nothing.

**2. Convex below the reference point (losses):** Each additional dollar of loss produces less additional pain (in absolute terms). Losing \\$100 is painful; losing \\$200 is more painful but not twice as much. This convexity in the loss domain produces risk-seeking for losses — a 50/50 chance of losing \\$100 or nothing is preferred to a sure loss of \\$50.

**3. Steeper for losses than for gains (loss aversion):** The slope of the value function is steeper on the loss side. A \\$50 loss reduces value by approximately twice as much as a \\$50 gain increases it. The ratio (lambda) is approximately 2.0-2.5 across most studies.

### Reference Points: The Crucial Variable

The reference point determines what counts as a gain and what counts as a loss. The same objective outcome can be experienced as either, depending on the reference point:

**Example:** An employee expecting a 10% raise who receives 7% experiences a **loss** (relative to expectation), even though their absolute income increased. An employee expecting no raise who receives 3% experiences a **gain** — even though they got less than the first employee.

Reference points can be:
- **Status quo:** The current state (most common default)
- **Expectations:** What you anticipated receiving
- **Aspirations:** What you hoped for or felt entitled to
- **Social comparisons:** What others received
- **Past experience:** What you received previously

**The power of reference points in marketing:** "Originally \\$200, now \\$120" creates a reference point of \\$200, making \\$120 feel like a gain. Without the anchor, \\$120 might feel expensive. Retailers manipulate reference points constantly through list prices, "compare at" prices, and competitor price displays.

### Applications of the Value Function

**The endowment effect:** Selling something you own is a loss; buying it is a foregone gain. Since losses hurt twice as much as gains feel good, sellers demand roughly twice what buyers will pay. Kahneman, Knetsch, and Thaler (1990) gave coffee mugs to half the participants. Sellers' median asking price was \\$7.12; buyers' median offer was \\$2.87.

**Sunk cost fallacy:** Having already invested money (a loss), people continue investing to avoid "wasting" the sunk cost — even when future prospects are negative. A rational agent ignores sunk costs, but a prospect-theoretic agent feels the pain of the past loss and throws good money after bad to try to recover it.

**Mental accounting:** Richard Thaler showed that people create separate "mental accounts" for different spending categories. The value function is applied to each account independently. Winning \\$50 and then losing \\$25 in separate mental accounts feels different from a net gain of \\$25 in a single account — because the loss in the second account is painful on its own.

**Segregation and integration:** Because of the value function's shape, the optimal way to present outcomes differs:
- **Segregate gains:** Present two gains separately (two \\$50 gains feel better than one \\$100 gain, because of diminishing sensitivity)
- **Integrate losses:** Combine two losses into one (one \\$100 loss feels less painful than two \\$50 losses)
- **Integrate a small loss with a larger gain:** "You won \\$100 and paid \\$20 in fees" (net \\$80 gain) feels better than hearing about the \\$20 loss separately
- **Segregate a small gain from a large loss:** A small silver lining in a large setback provides some comfort

This is known as the **hedonic editing hypothesis** and has direct applications in compensation design, pricing, and communication strategy.

### Dynamic Reference Points

Reference points are not static — they adapt over time. This creates interesting dynamics:

**Adaptation:** After a raise, the new salary gradually becomes the reference point, and the pleasure of the raise fades. This is the **hedonic treadmill** — gains are temporary because reference points adjust upward.

**Loss recovery:** After a loss, the reference point may remain at the pre-loss level for some time, creating a "loss domain" that drives risk-seeking behavior. A trader who has lost money today may take bigger risks in the afternoon to try to "get back to even" — a dangerous pattern that can amplify losses.

### Challenges and Debates

The value function is not without criticism:
- The reference point is hard to determine precisely in advance — which limits the theory's predictive power
- The loss aversion coefficient varies across studies and contexts (from 1.5 to 3.0)
- Some researchers question whether loss aversion exists for small stakes or for experienced decision-makers

Despite these debates, the value function remains the most successful model of how people subjectively experience economic outcomes.

### Key Takeaway

The value function shows that people evaluate outcomes relative to reference points, are risk-averse for gains and risk-seeking for losses, and feel losses approximately twice as intensely as equivalent gains. Understanding this function provides practical tools for pricing, negotiation, compensation design, and personal financial decision-making.

> "People do not evaluate outcomes in absolute terms. They evaluate them relative to a reference point, and they weigh losses more heavily than gains." — Kahneman & Tversky

*Resources: Kahneman & Tversky, "Prospect Theory" (1979); Thaler, "Mental Accounting Matters" (1999); Koszegi & Rabin, "A Model of Reference-Dependent Preferences" (2006).*`,
    },
    {
      id: "be-prospect-probability-weighting",
      slug: "probability-weighting",
      title: "Probability Weighting",
      content: `## Probability Weighting

The second major component of Prospect Theory — alongside the value function — is the **probability weighting function**. People do not treat probabilities linearly: they systematically distort them, overweighting small probabilities and underweighting large ones. This distortion explains lottery purchases, insurance demand, and many other puzzling behaviors.

### The Pattern

If people treated probabilities accurately, a 1% chance would receive 1% of the decision weight, a 50% chance would receive 50%, and a 99% chance would receive 99%. But empirical research shows a consistent pattern of distortion:

| Objective Probability | Decision Weight | Direction |
|----------------------|----------------|-----------|
| 0% | 0 | Correctly treated |
| 1% | ~5-6% | Overweighted |
| 5% | ~10-12% | Overweighted |
| 10% | ~15-18% | Overweighted |
| 30-40% | ~30-40% | Approximately accurate |
| 80% | ~60-65% | Underweighted |
| 95% | ~80-85% | Underweighted |
| 99% | ~90-92% | Underweighted |
| 100% | 100% | Correctly treated (certainty) |

The function is **inverse S-shaped**: it curves above the diagonal for small probabilities (overweighting) and below the diagonal for large probabilities (underweighting).

### Why Small Probabilities Are Overweighted

Several mechanisms explain the overweighting of small probabilities:

**Possibility effect:** The jump from 0% to 1% — from impossible to possible — is psychologically enormous. A 1% chance of winning \\$10 million is not experienced as 1/100th of the certainty of winning \\$10 million. The mere possibility of a life-changing outcome commands disproportionate attention.

**Vividness and imagination:** Small-probability events (winning the lottery, being struck by lightning, a terrorist attack) tend to be vivid and easy to imagine. The availability heuristic amplifies their perceived likelihood.

**Emotional amplification:** Outcomes with intense emotional content (death, enormous wealth) receive extra decision weight regardless of probability. Loewenstein's "risk as feelings" hypothesis suggests that emotional reactions to outcomes override probability assessments.

### Why Large Probabilities Are Underweighted

**Certainty effect:** The jump from 99% to 100% — from almost certain to certain — feels much larger than the jump from 89% to 90%. People pay a large premium for certainty. This is why:
- Insurance premiums far exceed expected losses (people pay for the peace of mind of certainty)
- "Guaranteed" returns command a premium in financial markets
- "Risk-free" products sell better than "99.9% safe" products

### Probability Weighting in Action

**Lottery tickets:** A \\$2 ticket for a 1-in-300-million chance at a \\$500 million jackpot has a negative expected value (about -\\$0.35 per ticket). Under EUT, no risk-averse person should buy one. But the probability weighting function explains it: the tiny probability is overweighted, making the gamble feel more attractive than its expected value suggests. Combined with the low stakes (just \\$2), lotteries exploit both probability weighting and diminishing sensitivity to losses.

**Insurance:** The probability of your house burning down is very small (roughly 0.03% per year for a typical home). Under standard EUT, the insurance premium should be close to the expected loss (very low). But people's overweighting of this small probability makes them willing to pay premiums far above the expected loss — insurance companies profit from the gap between the decision weight and the true probability.

**Legal settlement:** Plaintiffs with a small probability of a large jury award tend to overweight the chance of winning, making them less willing to settle. Defendants facing a small probability of a large payout also overweight it, making them more willing to settle. Probability weighting creates asymmetric bargaining positions that can explain settlement patterns.

**Venture capital:** Investors overweight the small probability of a startup becoming the next Google or Amazon. This makes them willing to invest in ventures with low expected returns but high upside potential. Probability weighting partially explains the excess capital flowing into venture capital and why investors accept the high failure rate.

### Subcertainty

Tversky and Kahneman documented **subcertainty**: the decision weights for complementary events sum to less than 1. That is, w(p) + w(1-p) < 1. For example, the decision weight for a 30% chance plus the decision weight for a 70% chance is less than 1. This means that any gamble is valued less than a sure thing of equivalent expected value — creating a general preference for certainty across all domains.

### Cross-Cultural Evidence

Probability weighting has been documented across cultures, though the exact shape of the function varies. Studies in the US, China, Ethiopia, and indigenous communities all find overweighting of small probabilities, though the degree varies. Cultural attitudes toward risk and uncertainty influence the precise shape of the weighting function.

### Practical Implications

Understanding probability weighting has direct applications:

- **Product design:** Offering a small chance of a large bonus (gamification, scratch-off rewards) is more motivating than an equivalent certain reward
- **Communication:** Presenting small risks as "1 in 100" rather than "1%" can change how they are perceived (ratio format is processed differently)
- **Risk management:** Organizations should not rely on employees' intuitive probability assessments — provide training and structured tools for probability estimation
- **Public policy:** Communicating low-probability risks (disease, natural disaster) requires careful framing to avoid both overreaction and complacency

### Key Takeaway

People systematically distort probabilities: overweighting small chances and underweighting large ones. This inverse S-shaped probability weighting function, combined with the S-shaped value function, explains a wide range of behaviors — from lottery purchases to insurance demand to venture capital investing — that Expected Utility Theory cannot.

> "People overweight small probabilities and underweight moderate and large probabilities. This is one of the most robust findings in decision research." — Tversky & Kahneman

*Resources: Tversky & Kahneman, "Advances in Prospect Theory" (1992); Prelec, "The Probability Weighting Function" (1998); Gonzalez & Wu, "On the Shape of the Probability Weighting Function" (1999).*`,
    },
    {
      id: "be-prospect-framing",
      slug: "framing-effects",
      title: "Framing Effects",
      content: `## Framing Effects

A **framing effect** occurs when people make different choices depending on how the same information is presented. This violates a fundamental principle of rational choice theory — that preferences should be invariant to description. In reality, framing is one of the most powerful tools for influencing decisions, and understanding it is essential for policy, marketing, negotiation, and personal decision-making.

### The Asian Disease Problem

Tversky and Kahneman (1981) presented the most famous demonstration of framing effects:

**Positive frame:** "600 people are affected by a deadly disease. Program A saves 200 people. Program B has a 1/3 probability of saving all 600 and a 2/3 probability of saving nobody." 72% chose Program A (the sure option).

**Negative frame:** "Program C means 400 people will die. Program D has a 1/3 probability that nobody will die and a 2/3 probability that all 600 will die." 78% chose Program D (the risky option).

Programs A and C are identical (200 saved = 400 die). Programs B and D are identical. Yet the majority preference reverses depending on whether outcomes are framed as lives saved (gains) or lives lost (losses). In the gain frame, people are risk-averse (choosing the sure thing). In the loss frame, people are risk-seeking (gambling to avoid the loss).

### Why Framing Works: Prospect Theory Explanation

Framing effects follow directly from Prospect Theory's value function:

1. The reference point shifts depending on the frame. "Saving lives" frames the reference point at 0 survivors (current state: all will die). "Lives lost" frames the reference point at 600 survivors (current state: all alive).
2. In the gain frame, people evaluate options in the concave (risk-averse) part of the value function
3. In the loss frame, people evaluate options in the convex (risk-seeking) part
4. Loss aversion amplifies the asymmetry

### Types of Framing Effects

**Attribute framing:** The same attribute is described positively or negatively. "95% lean" beef is rated as higher quality and more desirable than "5% fat" beef — even though they are the same product. "90% success rate" sounds better than "10% failure rate."

**Goal framing:** A message can emphasize what you gain from acting or what you lose from not acting. "If you use sunscreen, you will have healthy skin" (gain frame) vs. "If you do not use sunscreen, you risk skin cancer" (loss frame). Research shows that loss-framed messages are more effective for prevention behaviors (health screenings, seatbelt use), while gain-framed messages are more effective for promotion behaviors (exercise, healthy eating).

**Risky choice framing:** The Asian Disease Problem above. The same risky choice is framed in terms of gains or losses, shifting risk preferences.

**Temporal framing:** "Pay \\$30/month" vs. "Pay \\$365/year." Smaller, more frequent amounts feel more manageable — even though the annual figure is slightly less. Subscription services exploit this by presenting daily or monthly costs rather than annual totals.

### Framing in Business and Marketing

**Price framing:** A product listed at "\\$999" seems significantly cheaper than "\\$1,000" — the left digit anchor (9 vs. 10) has a disproportionate effect. Bundle pricing ("3 for \\$10") frames the cost per item as lower than individual pricing ("\\$3.50 each").

**Surcharges vs. discounts:** A 3% credit card surcharge is perceived as a loss (and strongly resisted). A 3% cash discount is perceived as a foregone gain (and barely noticed). Both create the same price differential, but the framing changes the psychological impact.

**Default framing:** Whether an option is presented as opt-in or opt-out dramatically affects choices. Organ donation, retirement savings, and privacy settings all show that the default frame shapes behavior far more than the quality of the options.

### Framing in Public Policy

**Tax policy:** A "\\$2,000 tax credit" and a "\\$2,000 reduction in tax liability" are economically identical but framed differently. Credits feel like gains; liability reductions feel like smaller losses. Policymakers choose frames strategically.

**Healthcare:** Doctors' framing of treatment options influences patient decisions. "This surgery has a 90% survival rate" leads to more patients choosing surgery than "This surgery has a 10% mortality rate" — even though the information is identical.

**Environmental policy:** Carbon taxes can be framed as "fees on pollution" (negative) or "investments in clean energy" (positive). Cap-and-trade systems can be framed as "emission allowances" (neutral) or "licenses to pollute" (negative). The frame shapes public acceptance.

### Framing in Negotiation

Skilled negotiators frame offers to exploit the value function:
- Frame your concessions as gains for the other party: "I am giving you an additional \\$5,000"
- Frame their concessions as loss avoidance: "Without this deal, you stand to lose market share"
- Make multiple small concessions (segregated gains feel larger) rather than one big one
- Present losses as a single package (integrated losses feel smaller)

### Ethical Concerns

Framing raises serious ethical questions. If people's choices depend on how options are presented, then whoever controls the frame controls the choice. This gives enormous power to:
- Advertisers who frame products to exploit biases
- Politicians who frame policies to manipulate support
- Doctors who frame treatments to steer patient decisions
- Technology companies that frame default settings to serve their interests

The ethical principle is **transparency**: people should be aware of how framing influences them, and those who frame choices should do so in the interest of the decision-maker, not the framer.

### Key Takeaway

Framing effects show that identical information presented differently leads to different choices. This violates rational choice theory but follows naturally from Prospect Theory. Understanding framing gives you power — to make better personal decisions by reframing your own choices, and to recognize when others are framing choices to influence you.

> "The way a problem is framed can have dramatic effects on how people respond. Choices depend not only on the objective features of the options but also on how those features are described." — Tversky & Kahneman

*Resources: Tversky & Kahneman, "The Framing of Decisions" (1981); Levin, Schneider & Gaeth, "All Frames Are Not Created Equal" (1998); Thaler & Sunstein, Nudge.*`,
    },
  ],
};

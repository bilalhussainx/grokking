import { Module } from "../types";

export const consumerTheoryModule: Module = {
  id: "micro-consumer",
  title: "Consumer Theory",
  description: "Explore how consumers make optimal choices — utility maximization, indifference curves, consumer surplus, income and substitution effects, and the behavioral economics revolution. Resources: Varian Intermediate Microeconomics, Kahneman Thinking Fast and Slow.",
  lessons: [
    {
      id: "micro-consumer-utility",
      slug: "utility-and-marginal-utility",
      title: "Utility & Marginal Utility",
      content: `## Utility & Marginal Utility

Utility is the economist's measure of satisfaction or happiness that a consumer derives from consuming a good or service. While utility cannot be directly observed, the concept provides a powerful framework for understanding consumer choice.

### Cardinal vs Ordinal Utility

**Cardinal utility** (Jevons, Menger, Walras — 1870s) assumed utility could be measured in numeric units ("utils"). Under this view, you might assign 10 utils to the first slice of pizza and 6 utils to the second.

**Ordinal utility** (Pareto, 1906; Hicks, 1939) requires only that consumers can rank bundles — preferring bundle A to bundle B, or being indifferent. Modern economics uses ordinal utility because it makes fewer assumptions. You do not need to say "A gives twice as much satisfaction as B" — only that you prefer A to B.

### The Law of Diminishing Marginal Utility

**Marginal utility (MU)** is the additional satisfaction from consuming one more unit of a good.

The **law of diminishing marginal utility** states: as consumption of a good increases, holding consumption of all other goods constant, the marginal utility of that good eventually decreases.

| Slices of Pizza | Total Utility | Marginal Utility |
|----------------|--------------|-----------------|
| 0 | 0 | — |
| 1 | 10 | 10 |
| 2 | 18 | 8 |
| 3 | 24 | 6 |
| 4 | 28 | 4 |
| 5 | 30 | 2 |
| 6 | 30 | 0 |
| 7 | 28 | -2 |

The first slice provides 10 units of satisfaction. By the sixth slice, marginal utility has fallen to zero — you are fully satiated. The seventh slice actually reduces total utility (you feel sick).

This law was independently discovered by Jevons, Menger, and Walras in the 1870s — the "marginal revolution" that transformed economics from classical to neoclassical (Blaug, 1997, *Economic Theory in Retrospect*, Cambridge University Press).

### The Optimal Consumption Rule

A consumer maximizes utility by allocating their budget so that the **marginal utility per dollar** is equal across all goods:

\`\`\`
MU_x / P_x = MU_y / P_y = ... = MU_n / P_n
\`\`\`

**Intuition:** If the last dollar spent on pizza gives you more satisfaction than the last dollar spent on soda, you should buy more pizza and less soda. Keep reallocating until the marginal utility per dollar is equalized.

### Example

You have \\$10. Pizza costs \\$2/slice, soda costs \\$1/can.

| Spending Allocation | MU/P (Pizza) | MU/P (Soda) | Optimal? |
|-------------------|-------------|-------------|----------|
| 3 pizza (\\$6) + 4 soda (\\$4) | 6/2 = 3 | 3/1 = 3 | Yes — equalized |
| 4 pizza (\\$8) + 2 soda (\\$2) | 4/2 = 2 | 5/1 = 5 | No — soda gives more per dollar |

### Deriving the Demand Curve from Marginal Utility

The optimal consumption rule directly produces the demand curve. When the price of a good rises, MU/P falls for that good. To re-equalize, the consumer reduces consumption of that good. This is exactly the law of demand — higher price, lower quantity demanded.

### Measurement Challenges

Utility is subjective and unobservable. However, **revealed preference theory** (Samuelson, 1938, *A Note on the Pure Theory of Consumer's Behaviour*, Economica) demonstrated that we can infer preferences from observed choices without measuring utility directly. If a consumer chooses bundle A when B is also affordable, we conclude A is preferred to B.

### Applications

The diminishing marginal utility concept explains many real-world phenomena:
- **Progressive taxation:** An additional \\$1,000 means more to someone earning \\$20,000 than \\$200,000
- **Diversification:** Consumers prefer variety because the 10th unit of any single good provides less satisfaction
- **Diamond-water paradox:** Water has high total utility but low marginal utility (abundant); diamonds have low total utility but high marginal utility (scarce)

### Key Takeaway

Marginal utility is the decision-making unit of consumption. Rational consumers maximize satisfaction by equalizing the marginal utility per dollar across all goods — a principle that derives the demand curve from first principles.

*References: Blaug (1997), Economic Theory in Retrospect (Cambridge); Samuelson (1938), Economica; Varian (2014), Intermediate Microeconomics (Norton); Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-consumer-indifference",
      slug: "indifference-curves",
      title: "Indifference Curves",
      content: `## Indifference Curves

Indifference curves are the modern tool for analyzing consumer choice. They represent all combinations of two goods that give a consumer the same level of satisfaction — the consumer is "indifferent" between any two points on the same curve.

### Properties of Indifference Curves

**1. Downward sloping:** To remain equally satisfied while consuming less of one good, you must consume more of the other.

**2. Higher curves are preferred:** Curves farther from the origin represent higher utility. More of both goods is always better (assuming non-satiation).

**3. Cannot cross:** If two indifference curves crossed, transitivity of preferences would be violated — a logical impossibility.

**4. Convex to the origin:** Reflects the diminishing marginal rate of substitution — as you consume more of good X, you are willing to give up less of good Y for an additional unit of X.

### The Marginal Rate of Substitution (MRS)

The MRS is the rate at which a consumer is willing to trade one good for another while maintaining the same utility level. It equals the slope of the indifference curve at any point:

\`\`\`
MRS = -dY/dX = MU_X / MU_Y
\`\`\`

The diminishing MRS is the indifference curve analog of diminishing marginal utility. If you have 10 pizzas and 2 sodas, you would trade many pizzas for one soda. If you have 2 pizzas and 10 sodas, you would trade many sodas for one pizza (Hicks, 1939, *Value and Capital*, Oxford).

### The Budget Constraint

The budget constraint shows all combinations of two goods the consumer can afford:

\`\`\`
P_x * X + P_y * Y = Income
\`\`\`

Or solving for Y: Y = (Income / P_y) - (P_x / P_y) * X

The slope of the budget line is -P_x / P_y — the rate at which the market allows you to trade X for Y.

### Optimal Consumer Choice

The consumer maximizes utility where the highest attainable indifference curve is tangent to the budget constraint. At this point:

\`\`\`
MRS = P_x / P_y
\`\`\`

Or equivalently: MU_x / P_x = MU_y / P_y (the equi-marginal principle from the utility lesson).

**Interpretation:** The rate at which the consumer is willing to trade goods (MRS) equals the rate at which the market requires them to trade (price ratio). If MRS > P_x/P_y, the consumer values X more than the market does and should buy more X. If MRS < P_x/P_y, they should buy more Y.

### Special Cases

**Perfect substitutes:** Indifference curves are straight lines (constant MRS). Example: generic vs brand-name aspirin for a consumer who sees them as identical.

**Perfect complements:** Indifference curves are L-shaped. Example: left shoes and right shoes — additional left shoes without matching right shoes provide zero additional utility.

**Cobb-Douglas preferences:** U(X,Y) = X^a * Y^b. These produce the smoothly curved indifference curves shown in textbooks and have the convenient property that the consumer always spends a fixed fraction of income on each good.

### Historical Significance

Edgeworth (1881, *Mathematical Psychics*) first conceived of indifference curves, and Pareto (1906, *Manual of Political Economy*) formalized them as a tool that required only ordinal utility — a major advance. Hicks and Allen (1934, *A Reconsideration of the Theory of Value*, Economica) completed the modern framework, showing that all of consumer theory could be built on indifference curves without assuming cardinal utility.

### Key Takeaway

Indifference curves combined with budget constraints provide a complete theory of consumer choice. The optimal bundle occurs where the indifference curve is tangent to the budget line — where the consumer's willingness to trade matches the market's terms of trade.

*References: Hicks (1939), Value and Capital (Oxford); Edgeworth (1881), Mathematical Psychics; Pareto (1906), Manual of Political Economy; Varian (2014), Intermediate Microeconomics (Norton).*`,
    },
    {
      id: "micro-consumer-surplus",
      slug: "consumer-surplus",
      title: "Consumer Surplus",
      content: `## Consumer Surplus

Consumer surplus is the difference between what consumers are willing to pay for a good and what they actually pay. It measures the net benefit consumers receive from participating in a market — the "deal" they get.

### Definition

\`\`\`
Consumer Surplus = Willingness to Pay - Market Price
\`\`\`

For an individual: if you would pay up to \\$8 for a coffee but the market price is \\$5, your consumer surplus is \\$3.

For the market: total consumer surplus is the area below the demand curve and above the market price — the triangle formed between the demand curve, the price line, and the vertical axis.

### Graphical Representation

\`\`\`
Price ($)
  |\\
  | \\   Consumer
  |  \\  Surplus (shaded area)
  |   \\
P*|────\\────────────
  |    |\\
  |    | \\
  |    |  \\  Demand
  |____|___\\________
  0   Q*         Quantity
\`\`\`

\`\`\`
Consumer Surplus = 0.5 × (Maximum WTP - Market Price) × Quantity
\`\`\`

### Willingness to Pay (WTP)

Each point on the demand curve represents a different consumer's maximum willingness to pay. The demand curve is essentially a ranking of consumers from highest to lowest WTP.

Consider a market for concert tickets:

| Consumer | Maximum WTP | Market Price | Individual CS |
|----------|-----------|-------------|--------------|
| Alice | \\$150 | \\$80 | \\$70 |
| Bob | \\$120 | \\$80 | \\$40 |
| Carol | \\$100 | \\$80 | \\$20 |
| Dave | \\$80 | \\$80 | \\$0 |
| Eve | \\$60 | \\$80 | Does not buy |

Total consumer surplus = \\$70 + \\$40 + \\$20 + \\$0 = \\$130.

### Consumer Surplus and Policy Analysis

Consumer surplus is a key tool for evaluating economic policies:

**Taxation:** A tax raises the price consumers pay, reducing consumer surplus. The lost surplus is partially captured as tax revenue and partially lost as **deadweight loss** — value destroyed that nobody receives.

**Price controls:** A price ceiling below equilibrium increases consumer surplus for those who can buy (they pay less) but creates a shortage that reduces surplus for those who cannot buy at all.

**Free trade:** Imports lower domestic prices, increasing consumer surplus — often by more than the loss in producer surplus, creating net welfare gains. Feenstra (1994, *New Product Varieties and the Measurement of International Prices*, American Economic Review) estimated that the variety gains alone from trade increased U.S. consumer welfare by 2.6% of GDP.

### Producer Surplus

Producer surplus is the mirror concept — the difference between the market price and the minimum price at which producers would be willing to sell:

\`\`\`
Producer Surplus = Market Price - Minimum Acceptable Price
\`\`\`

Graphically, it is the area above the supply curve and below the market price.

### Total Surplus and Efficiency

\`\`\`
Total Surplus = Consumer Surplus + Producer Surplus
\`\`\`

A market is **efficient** when total surplus is maximized. The competitive equilibrium achieves this — no reallocation of resources could make anyone better off without making someone else worse off (Pareto efficiency).

This result — known as the **First Welfare Theorem** — was proven rigorously by Arrow & Debreu (1954, *Existence of an Equilibrium for a Competitive Economy*, Econometrica). It is one of the most important results in all of economics, providing the theoretical foundation for the efficiency of competitive markets.

### Measuring Consumer Surplus Empirically

In practice, consumer surplus is estimated using:
- Demand curve estimation from market data
- Contingent valuation surveys (asking people their WTP)
- Auction data (revealed WTP through bidding)

Hausman (1981, *Exact Consumer's Surplus and Deadweight Loss*, American Economic Review) developed methods for calculating exact consumer surplus that account for income effects — refinements that are standard in modern welfare analysis.

### Key Takeaway

Consumer surplus quantifies the benefit consumers receive from market participation. It is the primary tool for evaluating whether economic policies help or harm consumers and is central to welfare economics.

*References: Feenstra (1994), American Economic Review; Arrow & Debreu (1954), Econometrica; Hausman (1981), American Economic Review; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-consumer-income-substitution",
      slug: "income-and-substitution-effects",
      title: "Income & Substitution Effects",
      content: `## Income & Substitution Effects

When the price of a good changes, consumers adjust their behavior for two distinct reasons: the good has become relatively more or less expensive (the substitution effect), and their real purchasing power has changed (the income effect). Decomposing a price change into these two effects is one of the most important analytical tools in consumer theory.

### The Substitution Effect

When the price of good X falls, X becomes **cheaper relative to other goods**. Consumers substitute toward X and away from other goods, even if their overall satisfaction level does not change.

**Key property:** The substitution effect always moves in the opposite direction of the price change. If price falls, quantity demanded increases (and vice versa). This is true for all goods — no exceptions.

### The Income Effect

When the price of good X falls, the consumer's **real income increases** — they can afford more of everything with the same budget. The income effect reflects this change in purchasing power.

**Key property:** The direction of the income effect depends on whether the good is normal or inferior:
- **Normal good:** Income rises → demand increases (income effect reinforces substitution effect)
- **Inferior good:** Income rises → demand decreases (income effect works against substitution effect)

### Decomposition Using Indifference Curves

The Slutsky decomposition (Slutsky, 1915, refined by Hicks, 1939) separates the total price change into its two components:

1. **Substitution effect:** Move along the original indifference curve to the point where MRS equals the new price ratio. This isolates the pure relative-price effect.

2. **Income effect:** Move from the compensated point to the new optimal point on the higher indifference curve. This isolates the purchasing-power effect.

\`\`\`
Total Effect = Substitution Effect + Income Effect
\`\`\`

### Normal Goods

For most goods, both effects work together:

| Price Change | Substitution Effect | Income Effect | Total Effect |
|-------------|-------------------|--------------|-------------|
| Price falls | Buy more X | Richer → buy more X | Strong increase in QD |
| Price rises | Buy less X | Poorer → buy less X | Strong decrease in QD |

### Inferior Goods

For inferior goods, the effects conflict:

| Price Change | Substitution Effect | Income Effect | Total Effect |
|-------------|-------------------|--------------|-------------|
| Price falls | Buy more X | Richer → buy less X (inferior) | Depends on magnitudes |

For most inferior goods, the substitution effect dominates, so the demand curve still slopes downward. But in the rare case where the income effect dominates...

### Giffen Goods

A **Giffen good** is an inferior good where the income effect is so strong that it overwhelms the substitution effect, causing the demand curve to slope **upward**. This is theoretically possible but extremely rare in practice.

The conditions require:
1. The good must be inferior
2. The good must constitute a large share of the consumer's budget
3. There must be few substitutes

Jensen & Miller (2008, *Giffen Behavior and Subsistence Consumption*, American Economic Review) provided the first convincing empirical evidence by studying rice consumption among poor households in Hunan, China. When rice prices were subsidized (lowered), households actually consumed less rice — using the saved money to diversify into meat and vegetables. When the subsidy was removed (prices rose), they could no longer afford variety and were forced to consume more rice.

### Practical Applications

**Tax policy:** A tax on a good creates both substitution effects (consumers switch to untaxed alternatives) and income effects (consumers are poorer). The relative magnitude determines the behavioral response.

**Labor supply:** A wage increase has a substitution effect (work more — each hour pays more) and an income effect (work less — you can afford more leisure). At low wages, the substitution effect dominates; at high wages, the income effect may dominate, creating a backward-bending labor supply curve.

**Welfare programs:** Cash transfers have pure income effects. In-kind transfers (food stamps) have both income and substitution effects.

### Key Takeaway

Every price change simultaneously makes a good relatively cheaper or more expensive (substitution) and makes the consumer richer or poorer (income). Decomposing these effects is essential for predicting consumer behavior and evaluating policy impacts.

*References: Slutsky (1915), Giornale degli Economisti; Hicks (1939), Value and Capital (Oxford); Jensen & Miller (2008), American Economic Review; Varian (2014), Intermediate Microeconomics (Norton).*`,
    },
    {
      id: "micro-consumer-behavioral",
      slug: "behavioral-economics-intro",
      title: "Behavioral Economics Introduction",
      content: `## Introduction to Behavioral Economics

Behavioral economics integrates insights from psychology into economic models of decision-making. It challenges the assumption that people always make rational, self-interested choices — revealing systematic patterns of "irrational" behavior that have profound implications for economics and policy.

### The Rational Actor Model

Traditional microeconomics assumes consumers are "homo economicus" — perfectly rational agents who:
- Have stable, well-defined preferences
- Process all available information correctly
- Maximize expected utility
- Are not influenced by irrelevant factors (framing, presentation)

Behavioral economics does not reject this model entirely — it extends it by documenting when and how real human behavior systematically departs from rationality.

### Key Concepts and Biases

**1. Loss Aversion**

People feel losses approximately twice as strongly as equivalent gains. Losing \\$100 feels about as bad as gaining \\$200 feels good. This was demonstrated by Kahneman & Tversky (1979, *Prospect Theory: An Analysis of Decision Under Risk*, Econometrica) — the most cited paper in economics.

Implications: People hold losing investments too long (hoping to avoid realizing a loss) and sell winning investments too quickly (locking in gains). This "disposition effect" has been documented in stock market data across dozens of countries (Odean, 1998, *Are Investors Reluctant to Realize Their Losses?*, Journal of Finance).

**2. Anchoring**

People's judgments are influenced by arbitrary reference points. In a classic experiment, Tversky & Kahneman (1974, *Judgment Under Uncertainty*, Science) spun a wheel of fortune (rigged to stop at 10 or 65) and asked subjects to estimate the percentage of African nations in the UN. Those who saw 65 guessed an average of 45%; those who saw 10 guessed 25%.

Implications: Retail pricing exploits anchoring — showing a "regular price" of \\$200 next to a "sale price" of \\$99 makes \\$99 seem like a bargain regardless of the item's actual value.

**3. Status Quo Bias and Default Effects**

People disproportionately stick with the default option. Madrian & Shea (2001, *The Power of Suggestion*, Quarterly Journal of Economics) found that automatic enrollment in 401(k) retirement plans increased participation rates from 49% to 86% — a dramatic effect from simply changing the default.

**4. Present Bias (Hyperbolic Discounting)**

People systematically overvalue immediate rewards relative to future rewards. Most people prefer \\$100 today over \\$110 tomorrow — but are indifferent between \\$100 in 30 days and \\$110 in 31 days. This inconsistency violates the standard exponential discounting model (Laibson, 1997, *Golden Eggs and Hyperbolic Discounting*, Quarterly Journal of Economics).

Implications: Under-saving for retirement, procrastination, difficulty sticking to diets and exercise programs.

**5. Framing Effects**

The way a choice is presented affects the decision. Tversky & Kahneman (1981) found that describing a medical treatment as having a "90% survival rate" versus a "10% mortality rate" — logically identical statements — produced dramatically different choices.

### Nudge Theory

Thaler & Sunstein (2008, *Nudge: Improving Decisions About Health, Wealth, and Happiness*, Yale University Press) proposed that governments and organizations can design "choice architectures" that nudge people toward better decisions without restricting freedom:

- **Automatic enrollment** in retirement savings
- **Organ donation opt-out** (assume consent unless explicitly refused)
- **Smaller plate sizes** in cafeterias to reduce overeating
- **Simplified forms** for financial aid applications

### The Nobel Prizes

Behavioral economics has earned multiple Nobel Prizes:
- Daniel Kahneman (2002) — for prospect theory and heuristics research
- Robert Shiller (2013) — for behavioral finance and asset price analysis
- Richard Thaler (2017) — for contributions to behavioral economics and nudge theory

### Criticisms

Some economists argue that behavioral findings are context-dependent and difficult to generalize. Levitt & List (2007, *What Do Laboratory Experiments Measuring Social Preferences Reveal About the Real World?*, Journal of Economic Perspectives) cautioned that lab experiments may not translate to real-world markets where incentives, experience, and competition reduce biases.

### Key Takeaway

Behavioral economics reveals that human decision-making is predictably irrational. People use mental shortcuts, are influenced by framing, overweigh losses, and struggle with self-control. These insights have transformed policy-making and given rise to the nudge movement.

> "The purely economic man is indeed close to being a social moron." — Amartya Sen

*References: Kahneman & Tversky (1979), Econometrica; Thaler & Sunstein (2008), Nudge (Yale); Madrian & Shea (2001), Quarterly Journal of Economics; Laibson (1997), Quarterly Journal of Economics.*`,
    },
  ],
};

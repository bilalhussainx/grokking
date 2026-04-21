import { Module } from "../types";

export const producerTheoryModule: Module = {
  id: "micro-producer",
  title: "Producer Theory",
  description: "Understand how firms make production decisions — production functions, cost structures, economies of scale, profit maximization, and producer surplus. Resources: Varian Intermediate Microeconomics, Pindyck & Rubinfeld Microeconomics.",
  lessons: [
    {
      id: "micro-producer-production-functions",
      slug: "production-functions",
      title: "Production Functions",
      content: `## Production Functions

A production function describes the technological relationship between inputs (labor, capital, land, materials) and the maximum output a firm can produce. It is the foundation of the theory of the firm.

### Definition

\`\`\`
Q = f(L, K)
\`\`\`

Where Q = quantity of output, L = labor input, K = capital input. The function describes the maximum output achievable given any combination of inputs — assuming efficient use of technology.

### Short Run vs Long Run

**Short run:** At least one input is fixed. A factory can hire more workers (variable input) but cannot build a new factory (fixed input).

**Long run:** All inputs are variable. The firm can adjust everything — workforce, factory size, technology, and location.

The distinction is not a specific time period — it depends on the industry. A software firm can adjust all inputs in months; a nuclear power plant takes a decade.

### Marginal Product and Average Product

**Marginal Product of Labor (MPL):**
\`\`\`
MPL = Change in Output / Change in Labor = dQ/dL
\`\`\`

**Average Product of Labor (APL):**
\`\`\`
APL = Total Output / Total Labor = Q/L
\`\`\`

### The Law of Diminishing Marginal Returns

As more of a variable input is added to a fixed input, the marginal product of the variable input eventually declines. This is one of the most empirically validated laws in economics.

| Workers | Total Output | Marginal Product | Average Product |
|---------|-------------|-----------------|----------------|
| 0 | 0 | — | — |
| 1 | 10 | 10 | 10.0 |
| 2 | 25 | 15 | 12.5 |
| 3 | 45 | 20 | 15.0 |
| 4 | 60 | 15 | 15.0 |
| 5 | 70 | 10 | 14.0 |
| 6 | 75 | 5 | 12.5 |
| 7 | 73 | -2 | 10.4 |

Notice: MP initially increases (workers specialize and collaborate), peaks at worker 3, then declines. After worker 6, MP becomes negative — too many workers in a fixed-size factory actually reduce output (they get in each other's way).

This law was first observed by Turgot (1767) and formalized by Ricardo in the context of agriculture. It holds in the short run because at least one input is fixed. In the long run, all inputs can be adjusted, and diminishing returns can be overcome through scale expansion (Nicholson & Snyder, 2017, *Microeconomic Theory*, Cengage).

### Common Production Functions

**Cobb-Douglas:** Q = A * L^a * K^b

The most widely used production function. Parameters a and b represent the output elasticity of labor and capital respectively. If a + b = 1, the function exhibits constant returns to scale. Cobb & Douglas (1928, *A Theory of Production*, American Economic Review) estimated this function using U.S. manufacturing data and found a remarkably good fit.

**Leontief (Fixed Proportions):** Q = min(aL, bK)

Inputs are used in fixed ratios — like one driver per taxi. No substitution between inputs is possible.

**Linear:** Q = aL + bK

Perfect substitutability between inputs — rare in practice but useful as a benchmark.

### Isoquants

An isoquant shows all input combinations that produce the same output level — analogous to indifference curves in consumer theory. The slope of an isoquant is the **Marginal Rate of Technical Substitution (MRTS):**

\`\`\`
MRTS = -dK/dL = MPL / MPK
\`\`\`

The optimal input combination occurs where the isoquant is tangent to the isocost line (MRTS = wage/rental rate), just as the optimal consumption bundle occurs where the indifference curve is tangent to the budget constraint.

### Key Takeaway

Production functions translate inputs into outputs. The law of diminishing marginal returns explains why costs eventually rise, and why the supply curve slopes upward. Understanding production functions is the prerequisite for analyzing cost structures.

*References: Cobb & Douglas (1928), American Economic Review; Nicholson & Snyder (2017), Microeconomic Theory (Cengage); Varian (2014), Intermediate Microeconomics (Norton).*`,
    },
    {
      id: "micro-producer-costs",
      slug: "costs-of-production",
      title: "Costs of Production",
      content: `## Costs of Production

A firm's cost structure determines its pricing, output decisions, and ultimately its survival. Understanding the different types of costs — and how they change with output — is essential for analyzing firm behavior.

### Total Cost Decomposition

\`\`\`
Total Cost (TC) = Total Fixed Cost (TFC) + Total Variable Cost (TVC)
\`\`\`

**Fixed costs** do not change with output: rent, insurance, salaries of permanent staff, loan interest. They exist even when output is zero.

**Variable costs** change with output: raw materials, direct labor, electricity for production, shipping.

### Average and Marginal Costs

**Average Total Cost (ATC):**
\`\`\`
ATC = TC / Q = AFC + AVC
\`\`\`

**Average Fixed Cost (AFC):**
\`\`\`
AFC = TFC / Q
\`\`\`
AFC continuously declines as output increases — this is "spreading fixed costs."

**Average Variable Cost (AVC):**
\`\`\`
AVC = TVC / Q
\`\`\`

**Marginal Cost (MC):**
\`\`\`
MC = Change in TC / Change in Q = dTC/dQ
\`\`\`

Marginal cost is the most important cost concept for decision-making — it tells the firm how much it costs to produce one more unit.

### The Shape of Cost Curves

| Output | TFC | TVC | TC | AFC | AVC | ATC | MC |
|--------|-----|-----|-----|-----|-----|-----|-----|
| 0 | 100 | 0 | 100 | — | — | — | — |
| 1 | 100 | 50 | 150 | 100 | 50 | 150 | 50 |
| 2 | 100 | 80 | 180 | 50 | 40 | 90 | 30 |
| 3 | 100 | 100 | 200 | 33 | 33 | 67 | 20 |
| 4 | 100 | 140 | 240 | 25 | 35 | 60 | 40 |
| 5 | 100 | 200 | 300 | 20 | 40 | 60 | 60 |
| 6 | 100 | 300 | 400 | 17 | 50 | 67 | 100 |

Key relationships:
- MC initially falls (due to specialization) then rises (due to diminishing returns)
- MC intersects AVC and ATC at their minimum points — this is a mathematical fact, not an assumption
- ATC is U-shaped: falls as fixed costs are spread, then rises as diminishing returns dominate

### Economic vs Accounting Costs

**Accounting profit** = Revenue - Explicit Costs

**Economic profit** = Revenue - Explicit Costs - Implicit Costs (opportunity costs)

A firm can have positive accounting profit but negative economic profit — meaning the owner's resources could earn more elsewhere. Economic profit is what drives long-run entry and exit decisions in competitive markets.

This distinction was emphasized by Frank Knight (1921, *Risk, Uncertainty and Profit*, Houghton Mifflin), who argued that economic profit arises from bearing uncertainty — not from routine business operations.

### Short-Run vs Long-Run Costs

In the short run, fixed costs constrain the firm. In the long run, all costs are variable — the firm can choose the optimal plant size for its expected output level.

The **long-run average cost (LRAC)** curve is the envelope of all short-run ATC curves — it shows the minimum average cost for each output level when the firm can choose any plant size.

### Sunk Costs

Sunk costs are costs that have been incurred and cannot be recovered. Like in consumer theory, rational firms should ignore sunk costs in decision-making. However, research on escalation of commitment (Staw, 1976, *Knee-Deep in the Big Muddy*, Organizational Behavior and Human Performance) shows that managers frequently throw good money after bad to justify past investments.

### Key Takeaway

Cost curves — especially marginal cost — are the basis for all production decisions. A profit-maximizing firm produces where marginal revenue equals marginal cost, and the shape of cost curves determines whether production is profitable.

*References: Knight (1921), Risk, Uncertainty and Profit; Staw (1976), Organizational Behavior and Human Performance; Pindyck & Rubinfeld (2018), Microeconomics (Pearson).*`,
    },
    {
      id: "micro-producer-economies-scale",
      slug: "economies-of-scale",
      title: "Economies of Scale",
      content: `## Economies of Scale

Economies of scale exist when a firm's long-run average cost decreases as output increases. They are one of the most important concepts in industrial organization, explaining why some industries are dominated by a few large firms while others consist of many small ones.

### Definition

\`\`\`
If doubling all inputs more than doubles output → Economies of scale (increasing returns)
If doubling all inputs exactly doubles output → Constant returns to scale
If doubling all inputs less than doubles output → Diseconomies of scale (decreasing returns)
\`\`\`

### Sources of Economies of Scale

**1. Specialization of Labor and Capital**

Adam Smith's (1776) famous pin factory example: one worker making pins from start to finish produces 20 per day. Ten workers, each specializing in a different step, produce 48,000 per day — a 240-fold increase in per-worker productivity. Specialization enables workers to develop expertise, reduces time lost switching between tasks, and facilitates the development of specialized tools.

**2. Spreading Fixed Costs**

Many industries have large fixed costs that must be spread over output:
- A pharmaceutical company spends \\$2.6 billion on average to develop a new drug (DiMasi, Grabowski & Hansen, 2016, *Innovation in the Pharmaceutical Industry*, Journal of Health Economics). Once developed, the marginal cost of producing each pill is pennies.
- A software company's development costs are fixed; the marginal cost of distributing one more copy is near zero.

**3. Bulk Purchasing**

Large firms negotiate better prices from suppliers. Walmart's purchasing power allows it to secure prices that small retailers cannot match — a key source of its competitive advantage (Fishman, 2006, *The Wal-Mart Effect*, Penguin).

**4. Technical Efficiencies**

Physical laws sometimes favor larger scale. The "two-thirds rule" in engineering: a container's volume increases with the cube of its dimensions, while its surface area (and thus material cost) increases with the square. Larger oil tankers, pipelines, and warehouses cost less per unit of capacity.

### The Long-Run Average Cost Curve

The LRAC curve is typically U-shaped:

\`\`\`
LRAC
  |\\
  | \\
  |  \\___________
  |    Economies  | Constant  /
  |    of Scale   | Returns  /
  |               |         / Diseconomies
  |_______________|________/___
  0                              Q
\`\`\`

### Minimum Efficient Scale (MES)

The MES is the smallest output at which long-run average cost is minimized. Industries with high MES tend toward fewer, larger firms:

| Industry | Estimated MES (% of market) |
|----------|---------------------------|
| Aircraft manufacturing | 10-30% |
| Automobile manufacturing | 5-10% |
| Steel | 3-5% |
| Brewing | 3-5% |
| Restaurants | < 0.01% |

Data from Pratten (1988, *A Survey of the Economies of Scale*, European Commission) showed that MES varies enormously across industries — from fractions of a percent in services to double-digit percentages in heavy manufacturing.

### Diseconomies of Scale

Beyond a certain point, average costs begin to rise. Causes include:

- **Coordination problems** — large organizations become bureaucratic and slow
- **Communication breakdowns** — information must travel through more layers
- **Worker motivation** — employees in very large firms may feel anonymous and disengaged
- **Principal-agent problems** — monitoring becomes more difficult as the firm grows

Williamson (1967, *Hierarchical Control and Optimum Firm Size*, Journal of Political Economy) argued that information loss as decisions pass through organizational hierarchies places a natural limit on firm size.

### Key Takeaway

Economies of scale explain why firms grow, why industries consolidate, and why some markets are served by a few giants while others remain fragmented. The minimum efficient scale determines the competitive structure of an industry.

*References: Smith (1776), The Wealth of Nations; DiMasi, Grabowski & Hansen (2016), Journal of Health Economics; Williamson (1967), Journal of Political Economy; Pratten (1988), European Commission.*`,
    },
    {
      id: "micro-producer-profit-max",
      slug: "profit-maximization",
      title: "Profit Maximization (MR = MC)",
      content: `## Profit Maximization: MR = MC

The fundamental goal of a firm is to maximize profit. The rule for achieving this is elegantly simple: **produce the quantity where marginal revenue equals marginal cost.** This is perhaps the most important single equation in microeconomics.

### The Profit Maximization Rule

\`\`\`
Profit is maximized where MR = MC
\`\`\`

**Marginal Revenue (MR)** = the additional revenue from selling one more unit
**Marginal Cost (MC)** = the additional cost of producing one more unit

**Logic:** If MR > MC, producing one more unit adds to profit — so produce more. If MR < MC, producing one more unit reduces profit — so produce less. Profit is maximized at the quantity where these two are exactly equal.

### Proof by Calculus

Profit (pi) = Total Revenue - Total Cost = TR(Q) - TC(Q)

To maximize, take the derivative and set it to zero:
\`\`\`
d(pi)/dQ = dTR/dQ - dTC/dQ = MR - MC = 0
Therefore: MR = MC
\`\`\`

The second-order condition requires that MC is rising at the optimal point (MC curve crosses MR from below).

### For a Perfectly Competitive Firm

In perfect competition, the firm is a **price taker** — it can sell any quantity at the market price. Therefore:

\`\`\`
MR = Price (for a competitive firm)
\`\`\`

So the profit maximization rule becomes: **P = MC.**

The firm's supply curve is its MC curve (above the AVC shutdown point).

### The Shutdown Decision

**Short-run shutdown rule:** A firm should shut down temporarily if price falls below average variable cost (P < AVC). In this case, the firm loses more by operating than by shutting down and paying only fixed costs.

**Long-run exit rule:** A firm should exit the market permanently if price falls below average total cost (P < ATC). In the long run, the firm cannot even cover its fixed costs.

| Price vs Cost | Short-Run Decision | Profit/Loss |
|--------------|-------------------|-------------|
| P > ATC | Produce at MR = MC | Economic profit |
| AVC < P < ATC | Produce at MR = MC | Loss (but less than FC) |
| P < AVC | Shut down | Loss = Fixed costs |

### For a Monopolist

A monopolist faces the entire market demand curve. To sell more, it must lower the price on all units. Therefore:

\`\`\`
MR < Price (for a monopolist)
\`\`\`

The monopolist still produces where MR = MC, but charges the price consumers are willing to pay for that quantity (from the demand curve), which is above MR. This creates a gap between price and marginal cost — the source of monopoly profit and deadweight loss.

### Empirical Evidence

Do real firms actually follow the MR = MC rule? Hall & Hitch (1939, *Price Theory and Business Behaviour*, Oxford Economic Papers) surveyed business owners and found that most use "cost-plus pricing" (markup over average cost) rather than explicitly equating MR and MC. However, economists argue that competitive pressure pushes firms toward MR = MC behavior even if managers do not consciously use the formula — firms that deviate systematically earn lower profits and are outcompeted.

Modern empirical work by De Loecker & Warzynski (2012, *Markups and Firm-Level Export Status*, American Economic Review) developed methods to estimate firm-level markups (price over marginal cost), finding that markups average 20-40% across manufacturing industries but vary widely with market structure.

### The MR = MC Rule in Practice

While firms may not literally calculate MR and MC, the logic applies to every business decision:
- A restaurant decides whether to stay open one more hour (MR of additional customers vs MC of staff overtime)
- An airline decides whether to add one more flight (MR of ticket sales vs MC of fuel, crew, gate fees)
- A tech company decides whether to develop one more feature (MR of additional users vs MC of engineering time)

### Key Takeaway

MR = MC is the universal rule for profit maximization. It applies to every firm in every market structure. The difference between market structures lies in how MR relates to price — not in the fundamental optimization rule.

*References: Hall & Hitch (1939), Oxford Economic Papers; De Loecker & Warzynski (2012), American Economic Review; Varian (2014), Intermediate Microeconomics (Norton).*`,
    },
    {
      id: "micro-producer-surplus",
      slug: "producer-surplus",
      title: "Producer Surplus",
      content: `## Producer Surplus

Producer surplus is the difference between the price a producer receives and the minimum price at which they would be willing to sell. It measures the net benefit that producers gain from participating in a market.

### Definition

\`\`\`
Producer Surplus = Market Price - Marginal Cost (summed over all units sold)
\`\`\`

For a single unit: if it costs you \\$3 to produce a widget and you sell it for \\$8, your producer surplus on that unit is \\$5.

For the market: total producer surplus is the area above the supply curve and below the market price.

### Graphical Representation

\`\`\`
Price ($)
  |
  |
P*|────────────────
  |\\\\\\\\\\\\\\\\\\|
  | \\\\\\\\\\\\\\\\|  Producer
  |  \\\\\\\\\\\\\\|  Surplus
  |   Supply /
  |  curve /
  |______/___________
  0   Q*          Quantity
\`\`\`

### Why the Supply Curve Represents Marginal Cost

The supply curve in a competitive market is the marginal cost curve. Each point on the supply curve shows the minimum price at which a firm is willing to produce one more unit — which equals the marginal cost of that unit. Firms will not sell below their marginal cost (in the short run, below AVC).

### Producer Surplus vs Profit

Producer surplus and profit are related but not identical:

\`\`\`
Producer Surplus = Revenue - Variable Costs
Profit = Revenue - Total Costs = Revenue - Variable Costs - Fixed Costs
\`\`\`

Therefore: Producer Surplus = Profit + Fixed Costs

In the short run, a firm can have positive producer surplus but negative profit (if producer surplus is less than fixed costs). In the long run, producer surplus and profit converge as all costs become variable.

### Individual vs Market Producer Surplus

Different producers have different cost structures. Low-cost producers earn more surplus than high-cost producers:

| Producer | Marginal Cost | Market Price | Surplus per Unit |
|----------|-------------|-------------|-----------------|
| Farm A (fertile land) | \\$2 | \\$5 | \\$3 |
| Farm B (average land) | \\$3 | \\$5 | \\$2 |
| Farm C (poor land) | \\$4 | \\$5 | \\$1 |
| Farm D (marginal) | \\$5 | \\$5 | \\$0 |
| Farm E (high cost) | \\$6 | \\$5 | Does not produce |

This connects to Ricardo's (1817) theory of **economic rent** — the return to factors of production above their opportunity cost. Farm A earns the highest rent because its land is the most productive. This is why fertile farmland and well-located commercial real estate command high prices.

### Changes in Producer Surplus

Producer surplus changes when market conditions shift:

**Price increase:** Producer surplus rises — both because existing units earn more and because additional units become profitable to produce.

**Technology improvement:** Supply shifts right, lowering prices. Even though price falls, total producer surplus may rise or fall depending on the elasticities of supply and demand.

**Tax on producers:** Supply shifts left, reducing equilibrium quantity and creating deadweight loss. Producer surplus falls as firms receive a lower after-tax price.

### Total Economic Surplus

\`\`\`
Total Surplus = Consumer Surplus + Producer Surplus
\`\`\`

The **First Welfare Theorem** (Arrow & Debreu, 1954) proves that competitive equilibrium maximizes total surplus. Any deviation from competitive equilibrium — through taxes, price controls, monopoly power, or externalities — creates deadweight loss (a reduction in total surplus that no one receives).

Harberger (1954, *Monopoly and Resource Allocation*, American Economic Review) estimated that the deadweight loss from monopoly power in the U.S. was relatively small (about 0.1% of GDP), sparking decades of debate. More recent estimates incorporating rent-seeking behavior suggest the true cost may be significantly higher (Posner, 1975, *The Social Costs of Monopoly and Regulation*, Journal of Political Economy).

### Key Takeaway

Producer surplus measures the benefit that producers receive from market participation. Together with consumer surplus, it forms the basis for welfare economics — the study of how well markets and policies serve society.

*References: Ricardo (1817), On the Principles of Political Economy and Taxation; Arrow & Debreu (1954), Econometrica; Harberger (1954), American Economic Review; Posner (1975), Journal of Political Economy.*`,
    },
  ],
};

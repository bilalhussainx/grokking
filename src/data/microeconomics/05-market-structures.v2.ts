import { Module } from "../types";

export const marketStructuresModule: Module = {
  id: "micro-markets",
  title: "Market Structures",
  description: "Compare the four market structures — perfect competition, monopoly, monopolistic competition, and oligopoly — and understand how each determines prices, output, and efficiency. Resources: Tirole Industrial Organization, Mankiw Principles of Economics.",
  lessons: [
    {
      id: "micro-markets-perfect-competition",
      slug: "perfect-competition",
      title: "Perfect Competition",
      content: `## Perfect Competition

Perfect competition is the benchmark market structure against which all others are compared. While no real market meets every condition perfectly, many come close — and the model provides powerful predictions about pricing, efficiency, and long-run outcomes.

### Conditions for Perfect Competition

1. **Many buyers and sellers** — no single participant can influence the market price
2. **Homogeneous products** — goods are identical across sellers (commodity markets)
3. **Free entry and exit** — no barriers prevent firms from entering or leaving the industry
4. **Perfect information** — all participants know all prices, costs, and product qualities
5. **Price-taking behavior** — each firm accepts the market price as given

### The Price-Taking Firm

Because each firm's output is tiny relative to the market, it faces a perfectly elastic (horizontal) demand curve at the market price. It can sell any quantity at the market price but nothing at a higher price — why would any buyer pay more for an identical product?

Since the firm can sell each unit at the market price:
\`\`\`
MR = Price = AR (Average Revenue)
\`\`\`

### Short-Run Profit Maximization

The firm produces where P = MC (since MR = P in perfect competition):

- If P > ATC: firm earns **economic profit**
- If P = ATC: firm earns **normal (zero economic) profit**
- If AVC < P < ATC: firm operates at a **loss** (but less than fixed costs)
- If P < AVC: firm **shuts down** (loss exceeds fixed costs if it operates)

### Long-Run Equilibrium

In the long run, the defining feature of perfect competition is the **zero-profit condition**:

- If firms earn economic profit → new firms enter → supply increases → price falls → profit eliminated
- If firms suffer losses → firms exit → supply decreases → price rises → losses eliminated

Long-run equilibrium: **P = MC = minimum ATC.** This is the most efficient outcome possible.

### Efficiency Properties

Perfect competition achieves both forms of efficiency:

**Productive efficiency:** Firms produce at the minimum point of their ATC curves — output is produced at the lowest possible cost.

**Allocative efficiency:** Price equals marginal cost — resources are allocated to produce exactly the goods consumers value most. The quantity produced is the socially optimal quantity.

This is the content of the First Welfare Theorem (Arrow & Debreu, 1954, *Existence of an Equilibrium for a Competitive Economy*, Econometrica): competitive equilibrium is Pareto efficient — no reallocation can make anyone better off without making someone else worse off.

### Real-World Examples

Markets that approximate perfect competition:
- **Agricultural commodities** — wheat, corn, soybeans (many farmers, standardized products)
- **Foreign exchange** — currency markets with thousands of traders
- **Stock markets** — many buyers and sellers of identical shares

Even these examples deviate from the model: government subsidies affect agriculture, information asymmetries exist in financial markets, and brand differentiation creeps into commodity markets.

Stigler (1957, *Perfect Competition, Historically Contemplated*, Journal of Political Economy) argued that perfect competition is not a description of reality but a theoretical ideal — valuable precisely because it reveals what conditions are necessary for maximum efficiency.

### Key Takeaway

Perfect competition is the gold standard of efficiency. The zero-profit long-run equilibrium and the equality of price and marginal cost set the benchmark against which monopoly, oligopoly, and monopolistic competition are measured.

*References: Arrow & Debreu (1954), Econometrica; Stigler (1957), Journal of Political Economy; Mankiw (2021), Principles of Economics (Cengage).*`,
    },
    {
      id: "micro-markets-monopoly",
      slug: "monopoly",
      title: "Monopoly",
      content: `## Monopoly

A monopoly exists when a single firm is the sole seller of a product with no close substitutes. The monopolist has market power — the ability to set price above marginal cost — which creates both higher profits for the firm and lower welfare for society.

### Sources of Monopoly Power

**1. Legal barriers:** Patents (pharmaceuticals), copyrights (entertainment), government franchises (utilities)
**2. Natural monopoly:** Industries where economies of scale are so large that one firm can serve the entire market at lower cost than two or more firms (water distribution, electric transmission)
**3. Control of essential resources:** De Beers historically controlled 80%+ of the world's diamond supply
**4. Network effects:** The value of a product increases with users (social media platforms, operating systems)

### Monopoly Pricing

Unlike a competitive firm, the monopolist faces the downward-sloping market demand curve. To sell more, it must lower the price on **all** units — not just the marginal unit.

\`\`\`
MR = P + Q × (dP/dQ)
\`\`\`

Since dP/dQ < 0 (demand slopes down), MR < P for a monopolist. The monopolist produces where MR = MC, then charges the demand curve price for that quantity.

### The Deadweight Loss of Monopoly

Because the monopolist restricts output to raise price, it produces less than the socially optimal quantity (where P = MC). The result is a **deadweight loss** — a reduction in total surplus that nobody receives.

\`\`\`
Price
  |\\
  | \\
Pm|----\\--------
  |    |\\      |
  |    | \\  DWL|
Pc|----|--\\----|---
  |    |   \\  |
  |    |    \\ |
  |____|_____\\|____
  0   Qm    Qc     Q
\`\`\`

Pm = monopoly price, Qm = monopoly quantity
Pc = competitive price, Qc = competitive quantity
DWL = deadweight loss triangle

### Monopoly Profit

\`\`\`
Monopoly Profit = (Pm - ATC) × Qm
\`\`\`

Unlike competitive firms, monopolists can earn **positive economic profit in the long run** because barriers to entry prevent new firms from competing away the profit.

### Price Discrimination

A monopolist can increase profit by charging different prices to different consumers:

**First-degree (perfect):** Charge each consumer their maximum willingness to pay. Eliminates consumer surplus entirely. Rarely achievable in practice.

**Second-degree:** Different prices for different quantities (bulk discounts, tiered pricing).

**Third-degree:** Different prices for different customer groups (student discounts, senior discounts, geographic pricing). This is the most common form.

Pigou (1920, *The Economics of Welfare*, Macmillan) first formalized the three degrees of price discrimination. Third-degree discrimination is welfare-enhancing if it opens the market to consumers who would otherwise be priced out (Schmalensee, 1981, *Output and Welfare Implications of Monopolistic Third-Degree Price Discrimination*, American Economic Review).

### Natural Monopoly Regulation

Natural monopolies pose a dilemma: competition is inefficient (costs would be higher with multiple firms), but an unregulated monopoly charges too much. Solutions include:

- **Average cost pricing:** Set P = ATC (the firm breaks even)
- **Marginal cost pricing with subsidy:** Set P = MC and subsidize the fixed-cost loss
- **Rate-of-return regulation:** Allow the firm to earn a "fair" return on investment
- **Public ownership:** Government operates the monopoly directly

Each approach has drawbacks. Averch & Johnson (1962, *Behavior of the Firm Under Regulatory Constraint*, American Economic Review) demonstrated that rate-of-return regulation incentivizes firms to over-invest in capital (gold-plating) to increase the base on which their allowed return is calculated.

### Key Takeaway

Monopoly represents the opposite extreme from perfect competition. The monopolist's ability to restrict output and raise price above marginal cost creates inefficiency and deadweight loss — justifying antitrust enforcement and regulation of natural monopolies.

*References: Pigou (1920), The Economics of Welfare (Macmillan); Averch & Johnson (1962), American Economic Review; Schmalensee (1981), American Economic Review; Tirole (1988), The Theory of Industrial Organization (MIT Press).*`,
    },
    {
      id: "micro-markets-monopolistic-competition",
      slug: "monopolistic-competition",
      title: "Monopolistic Competition",
      content: `## Monopolistic Competition

Monopolistic competition combines elements of both perfect competition and monopoly. Many firms sell differentiated products — similar but not identical — giving each firm a small degree of market power while still allowing free entry and exit.

### Characteristics

1. **Many sellers** — each with a small market share
2. **Differentiated products** — products are similar but not identical (brand, quality, location, style)
3. **Free entry and exit** — no significant barriers
4. **Some price-setting power** — due to product differentiation, each firm faces a downward-sloping demand curve
5. **Non-price competition** — advertising, branding, product features, customer service

### Examples

Monopolistic competition is the most common market structure in everyday life:
- Restaurants (many competitors, differentiated by cuisine, location, ambiance)
- Clothing retailers (brand differentiation, style, quality tiers)
- Hair salons, coffee shops, smartphone apps
- Professional services (law firms, accounting firms, consulting)

### Short-Run Equilibrium

In the short run, monopolistically competitive firms behave like small monopolists. Each firm faces its own downward-sloping demand curve and maximizes profit where MR = MC.

If the market price exceeds ATC, firms earn positive economic profit.

### Long-Run Equilibrium

Unlike monopoly, economic profit attracts new entrants. As new firms enter:
- Each existing firm's demand curve shifts left (fewer customers per firm)
- Demand becomes more elastic (more substitutes available)
- Entry continues until economic profit is driven to zero

**Long-run equilibrium condition:**
\`\`\`
P = ATC (zero economic profit)
MR = MC (profit maximization)
P > MC (mark-up due to differentiation)
\`\`\`

### Efficiency Comparison

Monopolistic competition is less efficient than perfect competition in two ways:

**1. Markup over marginal cost:** P > MC means the firm produces less than the socially optimal quantity. There is a small deadweight loss.

**2. Excess capacity:** In long-run equilibrium, the firm produces on the downward-sloping portion of its ATC curve — to the left of minimum ATC. Each firm could produce more at lower average cost but does not because demand is insufficient.

Chamberlin (1933, *The Theory of Monopolistic Competition*, Harvard University Press) first analyzed this market structure, arguing that the "excess capacity" represents the cost society pays for product variety. Dixit & Stiglitz (1977, *Monopolistic Competition and Optimum Product Diversity*, American Economic Review) formalized this trade-off, showing that consumers' love of variety partially or fully offsets the efficiency loss from markups.

### The Role of Advertising

Advertising is a hallmark of monopolistic competition. Firms spend on advertising to differentiate their products and shift demand rightward.

**Informative advertising** helps consumers find products that match their preferences — improving market efficiency.

**Persuasive advertising** changes preferences rather than informing — potentially wasteful from society's perspective.

Nelson (1974, *Advertising as Information*, Journal of Political Economy) argued that even seemingly persuasive advertising conveys information: the willingness to spend heavily on advertising signals product quality (since low-quality firms would not earn enough repeat purchases to justify the advertising cost).

### Brand Loyalty and Switching Costs

Product differentiation creates brand loyalty, which reduces price elasticity and allows higher markups. However, in the digital age, comparison shopping has become easier, potentially eroding brand advantages. Brynjolfsson & Smith (2000, *Frictionless Commerce?*, Management Science) found that while online prices are 9-16% lower than offline prices, price dispersion persists even online — suggesting differentiation remains powerful.

### Key Takeaway

Monopolistic competition is the market structure most consumers experience daily. It delivers the benefit of product variety at the cost of slightly higher prices and some inefficiency. The key question is whether the variety consumers enjoy is worth the markup they pay.

*References: Chamberlin (1933), The Theory of Monopolistic Competition (Harvard); Dixit & Stiglitz (1977), American Economic Review; Nelson (1974), Journal of Political Economy; Brynjolfsson & Smith (2000), Management Science.*`,
    },
    {
      id: "micro-markets-oligopoly",
      slug: "oligopoly",
      title: "Oligopoly & Game Theory",
      content: `## Oligopoly and Game Theory

An oligopoly is a market dominated by a few large firms whose decisions are interdependent — each firm's optimal strategy depends on what it expects its rivals to do. This interdependence makes oligopoly the most complex and strategically interesting market structure.

### Characteristics

1. **Few dominant firms** — each with significant market share
2. **Barriers to entry** — economies of scale, brand loyalty, patents, or regulation
3. **Interdependence** — each firm must consider rivals' reactions when making decisions
4. **Products may be homogeneous or differentiated**

### Examples

Oligopoly is pervasive in modern economies:
- Smartphones: Apple, Samsung, and a few others dominate globally
- Airlines: United, Delta, American, Southwest control most U.S. capacity
- Automobiles: Toyota, Volkswagen, GM, Stellantis, Hyundai-Kia
- Social media: Meta, Google/YouTube, TikTok/ByteDance
- Streaming: Netflix, Disney+, Amazon Prime, HBO Max

### Game Theory: The Tool for Analyzing Oligopoly

Game theory — the study of strategic decision-making — was developed by John von Neumann & Oskar Morgenstern (1944, *Theory of Games and Economic Behavior*, Princeton University Press) and revolutionized by John Nash (1950, *Equilibrium Points in N-Person Games*, Proceedings of the National Academy of Sciences).

A **Nash Equilibrium** is a set of strategies where no player can improve their outcome by unilaterally changing their strategy — given what the other players are doing.

### The Prisoner's Dilemma

The classic game theory model for oligopoly:

Two firms choose whether to set high prices (cooperate) or low prices (defect):

|  | **Firm B: High Price** | **Firm B: Low Price** |
|---|---|---|
| **Firm A: High Price** | A: \\$10M, B: \\$10M | A: \\$2M, B: \\$15M |
| **Firm A: Low Price** | A: \\$15M, B: \\$2M | A: \\$5M, B: \\$5M |

**Nash Equilibrium:** Both choose low price (both earn \\$5M). Neither can improve by unilaterally changing strategy. Yet both would be better off if they could cooperate on high prices (\\$10M each).

This captures the fundamental tension in oligopoly: firms want to collude (set high prices) but have individual incentives to cheat (undercut to steal market share).

### Collusion and Cartels

When oligopolists cooperate to restrict output and raise prices, they form a **cartel** — essentially acting as a joint monopolist. The most famous cartel is OPEC (Organization of Petroleum Exporting Countries), which coordinates oil production among member nations.

Cartels are illegal under antitrust law in most countries (Sherman Act in the U.S., Article 101 TFEU in Europe). Yet they persist: Connor (2014, *Price-Fixing Overcharges*, Journal of Competition Law and Economics) documented over 700 international cartels discovered since 1990, with average price overcharges of 23%.

### Models of Oligopoly Behavior

**Cournot Model (1838):** Firms simultaneously choose quantities. Each firm's best response depends on the other's output. The Cournot equilibrium lies between the competitive outcome and the monopoly outcome — more output than monopoly, less than competition (Cournot, 1838, *Researches into the Mathematical Principles of the Theory of Wealth*).

**Bertrand Model (1883):** Firms simultaneously choose prices. With homogeneous products, the Nash equilibrium has both firms pricing at marginal cost — the competitive outcome, even with just two firms. This "Bertrand paradox" highlights how the strategic variable (price vs quantity) dramatically affects the outcome.

**Stackelberg Model (1934):** One firm (the leader) moves first; the other (the follower) responds. The leader gains a first-mover advantage by committing to a high quantity, forcing the follower to produce less.

### Repeated Games and Tacit Collusion

In a one-shot game, cheating is the dominant strategy. But when firms interact repeatedly, cooperation can be sustained through **trigger strategies** — "I will cooperate as long as you do; if you cheat, I will punish you forever."

The **Folk Theorem** (Friedman, 1971, *A Non-cooperative Equilibrium for Supergames*, Review of Economic Studies) proves that in infinitely repeated games with sufficiently patient players, any outcome between the competitive and monopoly levels can be sustained as a Nash Equilibrium.

### Key Takeaway

Oligopoly is defined by strategic interdependence. Game theory provides the tools to analyze how firms navigate the tension between competition and cooperation — a tension that shapes pricing, investment, and innovation in most of the world's largest industries.

*References: Nash (1950), Proceedings of the NAS; Connor (2014), Journal of Competition Law and Economics; Cournot (1838), Researches into Mathematical Principles of Wealth; Tirole (1988), The Theory of Industrial Organization (MIT Press).*`,
    },
    {
      id: "micro-markets-comparison",
      slug: "comparing-market-structures",
      title: "Comparing Market Structures",
      content: `## Comparing Market Structures

The four market structures — perfect competition, monopolistic competition, oligopoly, and monopoly — represent a spectrum from maximum competition to maximum market power. Understanding how they differ in terms of pricing, efficiency, innovation, and welfare is essential for evaluating real-world markets and policies.

### Summary Comparison Table

| Feature | Perfect Competition | Monopolistic Competition | Oligopoly | Monopoly |
|---------|-------------------|------------------------|-----------|----------|
| Number of firms | Many | Many | Few | One |
| Product type | Homogeneous | Differentiated | Either | Unique, no close substitutes |
| Entry barriers | None | Low | High | Very high |
| Price-setting power | None (price taker) | Some | Significant | Full |
| Long-run profit | Zero | Zero | Positive (possible) | Positive |
| Price vs MC | P = MC | P > MC | P > MC | P >> MC |
| Allocative efficiency | Yes | No (small DWL) | No (moderate DWL) | No (large DWL) |
| Productive efficiency | Yes (min ATC) | No (excess capacity) | Varies | Varies |

### Price and Output

As market power increases, price rises and quantity falls:

\`\`\`
Price:    PC < MC < Oligopoly < Monopoly
Quantity: PC > MC > Oligopoly > Monopoly
\`\`\`

Empirical studies confirm this ranking. Bresnahan (1989, *Empirical Studies of Industries with Market Power*, Handbook of Industrial Organization) developed methods to estimate the degree of market power in real industries, finding that markups range from near zero in competitive industries to 50%+ in concentrated ones.

### Efficiency and Welfare

**Perfect competition** maximizes total surplus — achieving both allocative and productive efficiency.

**Monopolistic competition** sacrifices some efficiency for product variety. The welfare loss from excess capacity and markups is typically small (Mankiw & Whinston, 1986, *Free Entry and Social Inefficiency*, RAND Journal of Economics).

**Oligopoly** outcomes range widely — from near-competitive (fierce rivalry) to near-monopoly (tacit collusion). The welfare impact depends heavily on the degree of competition.

**Monopoly** creates the largest deadweight loss and transfers surplus from consumers to the monopolist. However, if monopoly profits fund innovation, the dynamic efficiency gains may offset the static welfare loss.

### Innovation: The Schumpeter Debate

Joseph Schumpeter (1942, *Capitalism, Socialism and Democracy*, Harper) argued that monopoly power is not only compatible with innovation but may be necessary for it. Large firms with market power have the resources and incentives to invest in R&D — because they can capture the returns from innovation through patents and market dominance.

The opposing view (Arrow, 1962, *Economic Welfare and the Allocation of Resources for Invention*) argues that competitive firms have stronger incentives to innovate because they gain more from replacing the status quo. A monopolist who innovates may simply be replacing its own product (the "replacement effect").

Empirical evidence is mixed. Aghion et al. (2005, *Competition and Innovation: An Inverted-U Relationship*, Quarterly Journal of Economics) found an inverted-U relationship: innovation increases with competition up to a point, then decreases. Moderate competition generates the strongest innovation incentives.

### Antitrust Policy

Governments use antitrust (competition) policy to prevent or remedy market power:

- **U.S.:** Sherman Act (1890), Clayton Act (1914), enforced by DOJ and FTC
- **EU:** Articles 101-102 TFEU, enforced by the European Commission
- **Key tools:** Blocking mergers, breaking up monopolies, prohibiting collusion, regulating conduct

Major antitrust cases have shaped industries: the breakup of Standard Oil (1911), AT&T (1984), the Microsoft case (2001), and ongoing scrutiny of tech giants (Google, Apple, Amazon, Meta).

### Market Structure in the Digital Age

Digital markets challenge traditional classification:
- **Network effects** create winner-take-all dynamics (social media, search engines)
- **Zero marginal cost** of digital goods enables natural monopoly
- **Multi-sided platforms** (connecting buyers and sellers) blur the line between market structures
- **Data as a barrier to entry** — incumbent platforms accumulate user data that new entrants cannot replicate

Tirole (2014 Nobel lecture) argued that digital platform regulation requires new frameworks that account for these unique features.

### Key Takeaway

Market structure determines how efficiently resources are allocated, how surplus is distributed between producers and consumers, and how strongly firms are incentivized to innovate. Real markets rarely fit neatly into one category — but the framework provides the essential tools for analysis.

*References: Bresnahan (1989), Handbook of Industrial Organization; Schumpeter (1942), Capitalism, Socialism and Democracy; Aghion et al. (2005), Quarterly Journal of Economics; Tirole (2014), Nobel Prize Lecture.*`,
    },
  ],
};

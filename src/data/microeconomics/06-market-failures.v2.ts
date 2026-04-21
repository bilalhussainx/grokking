import { Module } from "../types";

export const marketFailuresModule: Module = {
  id: "micro-failures",
  title: "Market Failures",
  description: "Explore why markets sometimes fail to produce efficient outcomes — externalities, public goods, information asymmetry, the tragedy of the commons, and government intervention. Resources: Mankiw Principles of Economics, Stiglitz Economics of the Public Sector.",
  lessons: [
    {
      id: "micro-failures-externalities",
      slug: "externalities",
      title: "Externalities",
      content: `## Externalities

An externality occurs when a transaction between two parties imposes costs or benefits on a third party who did not choose to be involved. Externalities cause markets to produce inefficient outcomes — too much of goods with negative externalities and too little of goods with positive externalities.

### Types of Externalities

**Negative externality:** A cost imposed on third parties. The social cost exceeds the private cost.
- Factory pollution damages the health of nearby residents
- A noisy bar reduces sleep quality for neighbors
- Antibiotic overuse creates drug-resistant bacteria (Laxminarayan et al., 2013, *Antibiotic Resistance*, The Lancet)

**Positive externality:** A benefit received by third parties. The social benefit exceeds the private benefit.
- Education creates a more productive, informed citizenry
- Vaccinations protect the unvaccinated through herd immunity
- R&D generates knowledge spillovers to other firms

### Why Externalities Cause Market Failure

In a competitive market, the equilibrium quantity is where private marginal benefit equals private marginal cost. But with externalities:

- **Negative externality:** Social cost > Private cost → Market produces too much
- **Positive externality:** Social benefit > Private benefit → Market produces too little

The gap between private and social costs (or benefits) is the externality — and it represents a deadweight loss.

### Corrective Measures

**1. Pigouvian Taxes and Subsidies (Pigou, 1920)**

A Pigouvian tax equals the marginal external cost, forcing producers to internalize the externality:

\`\`\`
Optimal Tax = Marginal External Cost at the socially optimal quantity
\`\`\`

Carbon taxes are the most prominent example. Nordhaus (2018 Nobel lecture) estimated the optimal carbon tax at approximately \\$40-50 per ton of CO2, rising over time. Sweden implemented a carbon tax in 1991 at approximately \\$130/ton — the world's highest — and has seen emissions fall 27% while GDP grew 78%.

For positive externalities, Pigouvian subsidies encourage production to the socially optimal level (e.g., education subsidies, R&D tax credits).

**2. The Coase Theorem (Coase, 1960)**

Ronald Coase (1960, *The Problem of Social Cost*, Journal of Law and Economics) proved that if property rights are well-defined and transaction costs are zero, private bargaining can resolve externalities without government intervention — regardless of who initially holds the rights.

In practice, the Coase Theorem works best for bilateral externalities with low transaction costs (neighbor disputes, two-party contracts). For widespread externalities (air pollution affecting millions), transaction costs make private bargaining impractical.

**3. Cap-and-Trade Systems**

Set a cap on total emissions and issue tradable permits. The EU Emissions Trading System (EU ETS), launched in 2005, covers approximately 40% of EU greenhouse gas emissions. Firms that can reduce emissions cheaply sell permits to firms where reduction is expensive — achieving the pollution target at minimum cost (Ellerman et al., 2010, *Pricing Carbon*, Cambridge University Press).

**4. Regulation**

Direct command-and-control regulation (emission standards, technology mandates). Less economically efficient than taxes or cap-and-trade because it does not equalize marginal abatement costs across firms — but sometimes simpler to implement and enforce.

### Key Takeaway

Externalities are the most common source of market failure. When private costs or benefits diverge from social costs or benefits, markets produce inefficient outcomes — and corrective policies (taxes, subsidies, property rights, or regulation) can improve welfare.

*References: Pigou (1920), The Economics of Welfare; Coase (1960), Journal of Law and Economics; Nordhaus (2018), Nobel Prize Lecture; Ellerman et al. (2010), Pricing Carbon (Cambridge).*`,
    },
    {
      id: "micro-failures-public-goods",
      slug: "public-goods",
      title: "Public Goods",
      content: `## Public Goods

A public good is a good that is both **non-excludable** (you cannot prevent people from using it) and **non-rival** (one person's use does not reduce availability to others). These two properties create a fundamental problem: the market will underprovide public goods because individuals can free-ride.

### The Classification Matrix

| | Rival | Non-Rival |
|---|---|---|
| **Excludable** | **Private Good** (food, clothing, cars) | **Club Good** (streaming services, toll roads, cable TV) |
| **Non-Excludable** | **Common Resource** (fish in the ocean, clean air) | **Public Good** (national defense, street lights, knowledge) |

This classification, developed by Samuelson (1954, *The Pure Theory of Public Expenditure*, Review of Economics and Statistics) and extended by Musgrave (1959), remains the foundation of public economics.

### The Free-Rider Problem

Because non-excludable goods cannot be withheld from non-payers, rational individuals have no incentive to pay voluntarily. Everyone wants the benefit; nobody wants to bear the cost.

**Example:** A neighborhood wants streetlights. Each household benefits, but any individual household can enjoy the light whether or not it contributes to the cost. If everyone reasons this way, the streetlights never get built — even though the total benefit exceeds the total cost.

This is why private markets systematically underprovide public goods. The classic solution is government provision funded by taxation — everyone is forced to contribute.

### Determining the Optimal Quantity

For private goods, the market demand curve is the horizontal sum of individual demands (quantities at each price). For public goods, the social demand curve is the **vertical sum** of individual demands (willingness to pay at each quantity) — because everyone consumes the same quantity simultaneously.

\`\`\`
Social Marginal Benefit = Sum of all individuals' Marginal Benefits
Optimal quantity: Social MB = MC of provision
\`\`\`

Samuelson (1954) showed that the optimal provision of a public good requires information about every individual's valuation — information that individuals have incentives to misrepresent (understating to avoid payment or overstating to increase provision).

### Mechanisms for Revelation

**Lindahl Pricing:** Each person pays a personalized price equal to their marginal benefit. Theoretically efficient but requires knowing everyone's true valuations.

**Voting:** Majority rule often leads to the median voter's preferred outcome — which may not be the socially optimal quantity. Black's (1948) Median Voter Theorem shows that the median voter's preference wins under simple majority voting.

**Contingent Valuation:** Surveys ask people their willingness to pay. Used extensively for environmental goods. Carson et al. (2003, *Contingent Valuation and Lost Passive Use*, Environmental and Resource Economics) estimated the damage from the Exxon Valdez oil spill at \\$2.8 billion using this method, though the approach is controversial due to hypothetical bias.

### Examples of Public Good Provision

| Public Good | Provider | Funding |
|------------|---------|---------|
| National defense | Government | Taxes |
| Basic research | Government + Universities | Taxes + Grants |
| Open-source software | Community | Voluntary contributions |
| Wikipedia | Nonprofit | Donations |
| Broadcast radio/TV | Private (ad-supported) | Advertising |

Interestingly, some public goods are provided privately. Ostrom (1990, *Governing the Commons*, Cambridge University Press, Nobel Prize 2009) documented communities that successfully manage shared resources through voluntary cooperation — challenging the assumption that only government can solve public good problems.

### Key Takeaway

Public goods are underprovided by markets because of the free-rider problem. Government provision, funded by taxation, is the standard solution — but the optimal quantity is difficult to determine because individuals have incentives to misrepresent their true valuations.

*References: Samuelson (1954), Review of Economics and Statistics; Ostrom (1990), Governing the Commons (Cambridge); Carson et al. (2003), Environmental and Resource Economics.*`,
    },
    {
      id: "micro-failures-information-asymmetry",
      slug: "information-asymmetry",
      title: "Information Asymmetry",
      content: `## Information Asymmetry

Information asymmetry exists when one party in a transaction has more or better information than the other. This imbalance can cause markets to break down entirely or produce highly inefficient outcomes — a market failure that earned George Akerlof, Michael Spence, and Joseph Stiglitz the 2001 Nobel Prize.

### Adverse Selection: The Market for Lemons

Akerlof (1970, *The Market for Lemons*, Quarterly Journal of Economics) demonstrated how asymmetric information can destroy markets using the used car example:

Sellers know whether their car is good or a "lemon." Buyers cannot tell the difference. If the market has 50% good cars (worth \\$10,000) and 50% lemons (worth \\$5,000), a risk-neutral buyer would pay at most \\$7,500 (the average). But at \\$7,500, owners of good cars withdraw (their car is worth more). Now only lemons remain, and the price falls to \\$5,000. **Good cars are driven from the market — only lemons trade.**

This logic applies broadly:
- **Health insurance:** Sicker people are more likely to buy insurance → insurance pool becomes riskier → premiums rise → healthy people drop out → "death spiral"
- **Credit markets:** Riskier borrowers are more willing to accept high interest rates → lender pool worsens → rates rise further
- **Labor markets:** Less productive workers are more willing to accept low wages

### Moral Hazard

Moral hazard occurs when one party changes behavior after entering an agreement because they are shielded from the consequences:

- **Insurance:** After buying fire insurance, the homeowner may be less careful about fire prevention
- **Banking:** Banks that expect government bailouts ("too big to fail") take excessive risks — a dynamic central to the 2008 financial crisis (Stern & Feldman, 2004, *Too Big to Fail*, Brookings Institution)
- **Employment:** An employee with a guaranteed contract may shirk

### Market Solutions

**1. Signaling (Spence, 1973)**

The informed party takes a costly action that credible signals their type. Spence (1973, *Job Market Signaling*, Quarterly Journal of Economics) showed that education serves as a signal of ability — even if it does not increase productivity. High-ability workers find education less costly (they learn faster), so obtaining a degree credibly signals ability.

Other signals: warranties (confident manufacturers offer longer warranties), dividends (profitable firms signal financial health), brand reputation.

**2. Screening (Stiglitz, 1976)**

The uninformed party designs a menu of options that induces self-selection. Insurance companies offer policies with different deductibles: low-risk individuals choose high deductibles (lower premiums), high-risk individuals choose low deductibles (higher premiums). The menu design reveals the buyer's private information.

Rothschild & Stiglitz (1976, *Equilibrium in Competitive Insurance Markets*, Quarterly Journal of Economics) proved that in equilibrium, insurance markets separate risk types through contract design — but the resulting equilibrium may not be efficient.

**3. Reputation and Repeat Interaction**

In markets with repeat transactions, reputation serves as a disciplining device. Amazon and eBay seller ratings, Yelp reviews, and credit scores all mitigate information asymmetry by aggregating past performance data.

### Government Interventions

- **Disclosure requirements:** SEC mandates that public companies disclose financial information
- **Licensing and certification:** Medical licensing ensures minimum competence
- **Lemon laws:** Require sellers to disclose known defects in used cars
- **Mandatory insurance:** The Affordable Care Act's individual mandate combats adverse selection by forcing healthy individuals into the risk pool

### Key Takeaway

Information asymmetry is a pervasive market failure. When one party knows more than the other, markets can unravel (adverse selection) or produce perverse incentives (moral hazard). Signaling, screening, reputation, and regulation are the tools for mitigating these problems.

*References: Akerlof (1970), Quarterly Journal of Economics; Spence (1973), Quarterly Journal of Economics; Rothschild & Stiglitz (1976), Quarterly Journal of Economics; Stiglitz (2001), Nobel Prize Lecture.*`,
    },
    {
      id: "micro-failures-tragedy-commons",
      slug: "tragedy-of-the-commons",
      title: "Tragedy of the Commons",
      content: `## The Tragedy of the Commons

The tragedy of the commons occurs when individuals, acting in their own self-interest, deplete or degrade a shared resource — even though it is in everyone's collective interest to preserve it. It is one of the most important concepts in environmental economics and resource management.

### Garrett Hardin's Parable

Hardin (1968, *The Tragedy of the Commons*, Science) illustrated the concept with a shared pasture:

Each herder benefits from adding one more cow to the commons. The benefit (additional milk/meat) goes entirely to the individual herder, while the cost (overgrazing) is shared among all herders. Since the private benefit exceeds the private cost, each herder keeps adding cows — until the pasture is destroyed.

The tragedy is not that people are greedy — it is that the incentive structure makes restraint individually irrational, even when it is collectively necessary.

### Why It Happens: Common Resources

Common resources are **rival** (one person's use reduces availability) but **non-excludable** (people cannot be prevented from using them). This combination is toxic: rivalry means overuse causes depletion, while non-excludability means no one can be charged for use.

| Resource | Rival? | Excludable? | Classification |
|----------|--------|-------------|---------------|
| Fish in the ocean | Yes | No | Common resource |
| Clean air | Yes (congestion) | No | Common resource |
| Groundwater | Yes | No | Common resource |
| National park (uncrowded) | No | Yes | Club good |

### Real-World Examples

**Overfishing:** The Northwest Atlantic cod fishery collapsed in the early 1990s after centuries of exploitation. At its peak, the Grand Banks produced 800,000 tons annually; by 1992, stocks had fallen by 99%, and Canada imposed a moratorium that put 40,000 people out of work. The stock has still not fully recovered three decades later (Myers et al., 1997, *Why Do Fish Stocks Collapse?*, Ecological Applications).

**Groundwater depletion:** The Ogallala Aquifer, which supplies 30% of U.S. agricultural irrigation water, is being depleted at 3.3 cubic miles per year — six times the natural recharge rate. At current rates, the aquifer could be economically unusable in some areas within 25 years (Steward et al., 2013, *Tapping Unsustainable Groundwater Stores*, Proceedings of the National Academy of Sciences).

**Climate change:** The atmosphere is the ultimate commons. Each country benefits from emitting greenhouse gases (cheap energy) while the costs (climate damage) are shared globally.

### Solutions

**1. Privatization**

Assign property rights to the common resource so that the owner has the incentive to manage it sustainably. Demsetz (1967, *Toward a Theory of Property Rights*, American Economic Review) argued that property rights emerge naturally when the benefits of exclusion exceed the costs.

Examples: Privatizing fisheries through Individual Transferable Quotas (ITQs) has successfully reduced overfishing in New Zealand, Iceland, and parts of the U.S. (Costello, Gaines & Lynham, 2008, *Can Catch Shares Prevent Fisheries Collapse?*, Science).

**2. Government Regulation**

Set and enforce limits on resource use: fishing quotas, pollution standards, water extraction limits. Effective but requires monitoring and enforcement.

**3. Community Governance**

Ostrom (1990, *Governing the Commons*, Cambridge University Press) documented hundreds of communities worldwide that successfully manage common resources without privatization or government control — through informal rules, monitoring, and graduated sanctions. Her work earned the 2009 Nobel Prize and challenged the assumption that only two solutions (private property or government regulation) exist.

Ostrom's eight design principles for successful commons management include clearly defined boundaries, collective-choice arrangements, monitoring, graduated sanctions, and conflict resolution mechanisms.

### Key Takeaway

The tragedy of the commons arises from a mismatch between individual incentives and collective welfare. Solutions include privatization, regulation, and community governance — and the best approach depends on the specific resource and context.

*References: Hardin (1968), Science; Ostrom (1990), Governing the Commons (Cambridge); Costello, Gaines & Lynham (2008), Science; Myers et al. (1997), Ecological Applications.*`,
    },
    {
      id: "micro-failures-government",
      slug: "government-intervention",
      title: "Government Intervention",
      content: `## Government Intervention in Markets

When markets fail — through externalities, public goods, information asymmetry, or market power — government intervention can potentially improve outcomes. But government intervention can also fail, sometimes making matters worse. Evaluating when and how to intervene is one of the central questions of public economics.

### Rationales for Intervention

**1. Correcting market failures:** Externalities (pollution taxes), public goods (national defense), information asymmetry (disclosure requirements), market power (antitrust enforcement).

**2. Redistribution:** Markets may produce efficient but highly unequal outcomes. Progressive taxation and transfer programs redistribute income based on society's equity preferences.

**3. Merit goods:** Goods that society believes people should consume regardless of willingness to pay (education, healthcare, basic nutrition). The concept, introduced by Musgrave (1957), is controversial because it implies paternalism — the government knows better than individuals what is good for them.

### Policy Tools

| Tool | Mechanism | Example |
|------|-----------|---------|
| **Taxes** | Raise the cost of undesirable activities | Carbon tax, cigarette tax |
| **Subsidies** | Lower the cost of desirable activities | Education grants, EV subsidies |
| **Regulation** | Mandate or prohibit specific behaviors | Emission standards, food safety |
| **Price controls** | Set minimum or maximum prices | Minimum wage, rent control |
| **Public provision** | Government directly provides the good | National defense, public schools |
| **Property rights** | Define and enforce ownership | Patents, tradable emission permits |
| **Information** | Require disclosure or provide data | Nutrition labels, fuel economy ratings |

### Tax Incidence: Who Really Pays?

The economic burden of a tax (incidence) does not depend on who legally pays it — it depends on the relative elasticities of supply and demand:

\`\`\`
Buyer's share of tax burden = Es / (Es + Ed)
Seller's share = Ed / (Es + Ed)
\`\`\`

Where Es = price elasticity of supply and Ed = price elasticity of demand (in absolute value).

The more inelastic side of the market bears more of the tax burden. Fullerton & Metcalf (2002, *Tax Incidence*, Handbook of Public Economics) showed that payroll taxes nominally split between employers and employees are almost entirely borne by workers (because labor supply is relatively inelastic).

### Deadweight Loss of Taxation

Taxes create deadweight loss by driving a wedge between the price buyers pay and the price sellers receive, reducing the quantity traded below the efficient level. The deadweight loss increases with the square of the tax rate — doubling the tax rate quadruples the deadweight loss (Harberger, 1964).

This principle suggests that taxes should be spread broadly across a wide base at low rates rather than concentrated on narrow bases at high rates — the logic behind broad-based consumption taxes.

### Government Failure

Just as markets can fail, so can government intervention:

**Regulatory capture:** Regulated industries influence their regulators to serve industry interests rather than the public interest. Stigler (1971, *The Theory of Economic Regulation*, Bell Journal of Economics) argued that regulation is often "designed and operated primarily for the benefit of the industry."

**Rent-seeking:** Resources are wasted on lobbying and political influence rather than productive activity. Tullock (1967) and Krueger (1974, *The Political Economy of the Rent-Seeking Society*, American Economic Review) estimated that rent-seeking wastes of 7-15% of GDP are plausible in some developing countries.

**Information problems:** Governments face the same information limitations as markets — often more severe. Hayek (1945) argued that central planners cannot access the dispersed, tacit knowledge that price signals aggregate automatically.

**Political incentives:** Elected officials may pursue policies that win votes rather than maximize welfare — favoring visible benefits with hidden costs (deficit spending) over invisible benefits with visible costs (preventive investment).

### When Intervention Works Best

Empirical evidence suggests government intervention is most effective when:
1. The market failure is well-defined and large
2. The intervention is targeted and proportionate
3. Implementation is simple and transparent
4. The risk of government failure is low

Gruber (2019, *Public Finance and Public Policy*, Worth Publishers) provides a comprehensive framework for evaluating when market failure justifies government intervention and when the cure may be worse than the disease.

### Key Takeaway

Government intervention can correct market failures, but it introduces its own set of problems. The question is never "market or government?" but "which combination of market and government produces the best outcome for this specific situation?"

> "The relevant comparison is never between an idealized market and an idealized government, but between imperfect markets and imperfect governments." — Harold Demsetz

*References: Stigler (1971), Bell Journal of Economics; Krueger (1974), American Economic Review; Fullerton & Metcalf (2002), Handbook of Public Economics; Gruber (2019), Public Finance and Public Policy (Worth).*`,
    },
  ],
};

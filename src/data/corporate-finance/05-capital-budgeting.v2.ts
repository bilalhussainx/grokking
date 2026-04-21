import { Module } from "../types";

export const capitalBudgetingModule: Module = {
  id: "cf-budgeting",
  title: "Capital Budgeting",
  description: "Master the decision rules and analytical techniques used to evaluate investment projects — from NPV and IRR to sensitivity analysis and real options.",
  lessons: [
    {
      id: "cf-investment-rules",
      slug: "investment-decision-rules",
      title: "Investment Decision Rules",
      content: `## Investment Decision Rules: NPV, IRR, Payback, and PI

Companies use several decision rules to evaluate capital investments. While NPV is the gold standard, understanding all the common methods — their strengths and weaknesses — is critical for practice.

### Rule 1: Net Present Value (NPV)

\`\`\`
Accept if NPV > 0
\`\`\`

NPV measures the dollar value created by the investment. As discussed earlier, it is the theoretically correct rule because it accounts for the time value of money, uses all cash flows, and discounts at the opportunity cost of capital.

### Rule 2: Internal Rate of Return (IRR)

\`\`\`
Accept if IRR > hurdle rate (WACC)
\`\`\`

IRR reports the return in percentage terms. It agrees with NPV for standalone, conventional cash flow projects but can give wrong answers for mutually exclusive projects or non-conventional cash flows.

### Rule 3: Payback Period

\`\`\`
Accept if Payback Period < cutoff
\`\`\`

The payback period is the number of years it takes to recover the initial investment from cumulative cash flows.

Example: A $1M investment with annual cash flows of $300K:
\`\`\`
Year 1: -$1M + $300K = -$700K (not recovered)
Year 2: -$700K + $300K = -$400K (not recovered)
Year 3: -$400K + $300K = -$100K (not recovered)
Year 4: -$100K + $300K = +$200K (recovered!)
Payback = ~3.33 years
\`\`\`

**Advantages:** Simple, intuitive, favors liquidity.

**Flaws:** Ignores time value of money, ignores cash flows after cutoff, arbitrary cutoff choice.

Despite its flaws, Graham and Harvey (2001) found that **56.7% of CFOs** use payback — nearly as many as use NPV (74.9%). It is especially popular in industries where technology changes rapidly (why care about cash flows in Year 10 if the technology will be obsolete?).

### Rule 4: Profitability Index (PI)

\`\`\`
PI = PV of Future Cash Flows / Initial Investment
Accept if PI > 1.0
\`\`\`

PI is particularly useful when capital is rationed — the firm has more positive-NPV projects than it can fund. In that case, rank projects by PI and accept from highest to lowest until the budget is exhausted.

### Comparing the Methods

| Project | NPV | IRR | Payback | PI |
|---------|-----|-----|---------|-----|
| A ($5M investment) | $1.2M | 18% | 2.8 yrs | 1.24 |
| B ($10M investment) | $1.8M | 14% | 3.5 yrs | 1.18 |
| C ($3M investment) | $0.9M | 22% | 2.1 yrs | 1.30 |

- **NPV says:** Choose B (highest dollar value)
- **IRR says:** Choose C (highest percentage return)
- **PI says:** Choose C (highest value per dollar invested)
- **Payback says:** Choose C (fastest recovery)

The correct choice depends on constraints. With unlimited capital, NPV is correct (choose B). With capital rationing, PI may be better (choose C first).

### What Top Firms Actually Use

A 2019 study by Maquieira, Preve, and Sarria-Allende ("Capital Budgeting Practices in Latin America and the U.S.") found that over 80% of Fortune 500 companies use multiple methods simultaneously, with NPV and IRR being used in tandem by the vast majority. Smaller firms tend to rely more heavily on payback due to its simplicity.

### Key Takeaway

Always compute NPV. Use IRR and payback as supplementary metrics that communicate the investment's return and liquidity characteristics. Use PI when capital is rationed. The best practitioners use all four methods and understand when each is most informative.

**Sources:** Graham, J. & Harvey, C. (*JFE*, 2001); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 7; MIT OCW 15.401.`,
    },
    {
      id: "cf-incremental-cash-flows",
      slug: "incremental-cash-flows",
      title: "Incremental Cash Flows",
      content: `## Incremental Cash Flows

The cash flows used in capital budgeting must be **incremental** — that is, they must represent the difference between the firm's cash flows with the project and without the project. This seemingly simple concept trips up even experienced analysts.

### The Incremental Principle

\`\`\`
Incremental Cash Flow = CF(with project) - CF(without project)
\`\`\`

Only include cash flows that change as a result of the project. Everything else is irrelevant.

### What to Include

**1. Direct Project Cash Flows**

Revenue, operating costs, taxes, capital expenditures, and working capital directly attributable to the project.

**2. Opportunity Costs**

If the project uses a resource that could be sold or rented, include that forgone value. Example: If a firm uses an existing warehouse for a new project, the market rent or sale value of that warehouse is an opportunity cost — even though no cash physically leaves the company.

**3. Side Effects (Externalities)**

- **Cannibalization:** If a new product steals sales from an existing product, the lost revenue is a negative incremental cash flow. When Apple launched the iPad, it cannibalized some MacBook sales — Apple correctly included this effect in its analysis.
- **Synergies:** If a new product boosts sales of a related product (e.g., a printer that increases ink cartridge sales), include the additional revenue.

**4. Tax Effects**

Include the tax impact of depreciation (a non-cash expense that reduces taxable income, creating a "depreciation tax shield"):

\`\`\`
Depreciation Tax Shield = Depreciation x Tax Rate
\`\`\`

Under the 2017 Tax Cuts and Jobs Act, many capital investments qualify for 100% bonus depreciation (expensing the full cost in Year 1), which significantly accelerates the tax benefit.

### What to Exclude

**1. Sunk Costs**

Money already spent cannot be recovered, so it should not influence the decision. Example: A company spent $2M on a feasibility study for a new factory. Whether they proceed or not, the $2M is gone. It should NOT be included in the NPV calculation.

This is one of the most common cognitive biases in business — the "sunk cost fallacy." In 2005, the Congressional Budget Office estimated that the U.S. government continued spending billions on defense programs partly because of sunk cost reasoning (Source: CBO, "Estimated Costs of Ongoing Operations in Iraq and Afghanistan," 2005).

**2. Financing Costs**

Do not include interest payments or debt repayments in project cash flows. The cost of financing is captured in the discount rate (WACC). Including interest in both the cash flows and the discount rate would be double-counting.

**3. Allocated Overhead**

If corporate overhead does not actually change because of the project, do not include it. If the company charges a 10% overhead allocation to all projects but no new overhead staff is needed, the allocation is irrelevant.

### Working Capital Considerations

Many projects require additional working capital (inventory, receivables, etc.) at inception that is recovered at the end:

- **Year 0:** Invest in working capital (cash outflow)
- **Years 1-N:** Maintain working capital (incremental changes)
- **Year N:** Recover working capital (cash inflow)

Failing to include working capital changes is a common error that can significantly distort NPV. For capital-intensive industries like manufacturing or retail, working capital can represent 15-25% of the initial investment.

### Real-World Example: Amazon Prime

When Amazon evaluated launching Prime (annual subscription for free shipping), the incremental cash flow analysis was complex:

- **Direct revenue:** Subscription fees
- **Direct costs:** Increased shipping costs
- **Side effects (positive):** Dramatically increased purchase frequency among members (estimated +150% spending increase)
- **Cannibalization:** Some customers who would have paid for shipping now get it free
- **Opportunity cost:** Warehouse space dedicated to faster fulfillment

The side effects dominated — Prime members spend significantly more than non-members, making the program massively NPV-positive (Source: Galloway, S. *The Four*, Portfolio, 2017; Amazon annual reports).

### Key Takeaway

Correct identification of incremental cash flows is the most critical practical skill in capital budgeting. Always ask: "Does this cash flow change because of the project?" If yes, include it. If no, exclude it. Be especially vigilant about sunk costs (exclude), opportunity costs (include), and side effects (include).

**Sources:** Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 8; MIT OCW 15.401, Lecture 7.`,
    },
    {
      id: "cf-sensitivity-analysis",
      slug: "sensitivity-scenario-analysis",
      title: "Sensitivity & Scenario Analysis",
      content: `## Sensitivity & Scenario Analysis

Any capital budgeting decision depends on assumptions about the future — revenue growth, costs, timing, and risk. **Sensitivity analysis** and **scenario analysis** are techniques that help decision-makers understand how uncertainty affects project value.

### Sensitivity Analysis (One Variable at a Time)

Sensitivity analysis changes **one input variable at a time** while holding all others constant, to see how much the output (NPV or IRR) changes.

**Example:** A project with base-case NPV of $5 million:

| Variable | Base Case | Pessimistic | NPV Change | Optimistic | NPV Change |
|----------|-----------|-------------|------------|------------|------------|
| Revenue growth | 8% | 4% | -$3.2M | 12% | +$3.8M |
| Operating margin | 25% | 20% | -$2.5M | 30% | +$2.5M |
| WACC | 10% | 12% | -$1.8M | 8% | +$2.3M |
| CapEx | $15M | $18M | -$2.8M | $12M | +$2.8M |

This table reveals that the project is **most sensitive to revenue growth** and **CapEx estimates**. Management should focus due diligence efforts on these variables.

### Tornado Charts

Sensitivity results are often visualized in a **tornado chart** — a horizontal bar chart where the widest bars (most sensitive variables) appear at the top, forming a funnel shape. This immediately shows where uncertainty matters most.

### Break-Even Analysis

A special case of sensitivity analysis asks: "At what value does a variable cause NPV to become zero?"

\`\`\`
Break-even revenue growth = the growth rate where NPV = $0
\`\`\`

If the break-even growth rate is 2% and the base case is 8%, there is a comfortable margin of safety. If the break-even is 7%, the project has little margin for error.

### Scenario Analysis (Multiple Variables Change Together)

Scenario analysis changes **several variables simultaneously** to construct plausible futures:

| Scenario | Revenue Growth | Margin | WACC | NPV |
|----------|---------------|--------|------|-----|
| **Bull case** | 12% | 30% | 9% | $12.5M |
| **Base case** | 8% | 25% | 10% | $5.0M |
| **Bear case** | 3% | 18% | 12% | -$2.8M |
| **Recession** | -2% | 12% | 14% | -$8.5M |

Scenarios are more realistic than sensitivity analysis because variables often move together. In a recession, revenue drops, margins compress, AND the cost of capital rises simultaneously.

### Probability-Weighted NPV

If you can assign probabilities to scenarios:

\`\`\`
Expected NPV = P(bull) x NPV(bull) + P(base) x NPV(base) + P(bear) x NPV(bear) + ...
\`\`\`

Example:
\`\`\`
E(NPV) = 0.20 x $12.5M + 0.50 x $5.0M + 0.20 x (-$2.8M) + 0.10 x (-$8.5M)
E(NPV) = $2.5M + $2.5M + (-$0.56M) + (-$0.85M)
E(NPV) = $3.59M
\`\`\`

### Real-World Application: Tesla Gigafactory

Tesla's decision to build Gigafactory Nevada (announced 2014, $5 billion investment) was accompanied by extensive scenario analysis. Key variables included:

- Battery cell cost reduction trajectory (40-50% cost reduction target)
- Electric vehicle demand growth
- Government incentive stability (Nevada offered $1.3 billion in tax breaks)
- Lithium and nickel commodity prices

Different scenarios produced vastly different NPVs, but Tesla judged that even moderate success justified the investment given the strategic importance of cost leadership in batteries (Source: Tesla SEC filings; Nevada Governor's Office of Economic Development, 2014).

### Best Practices

1. **Start with sensitivity analysis** to identify the 3-5 most important variables
2. **Then build scenarios** that combine those key variables into coherent narratives
3. **Be honest about uncertainty** — presenting only the base case without ranges is misleading
4. **Focus management attention** on the variables where the project is most sensitive and where the firm has least certainty

### Key Takeaway

No forecast is certain. Sensitivity and scenario analysis transform a single-point NPV estimate into a range of outcomes, helping managers make better decisions under uncertainty. The goal is not to predict the future perfectly but to understand which uncertainties matter most.

**Sources:** Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 8; Koller, T. et al., *Valuation* (McKinsey, 7th ed., 2020), Ch. 14.`,
    },
    {
      id: "cf-real-options",
      slug: "real-options",
      title: "Real Options",
      content: `## Real Options

Traditional NPV analysis assumes a "now or never" decision — invest today or walk away. In reality, managers have **flexibility**: they can delay, expand, contract, or abandon projects as new information arrives. **Real options** apply financial options theory to these managerial decisions, and they can add significant value.

### What Are Real Options?

A **real option** is the right — but not the obligation — to take a business action in the future. Just as a stock call option gives you the right to buy a stock at a fixed price, a real option gives a firm the right to invest in (or abandon) a project.

### Types of Real Options

| Option Type | Description | Example |
|------------|-------------|---------|
| **Option to delay** | Wait for better information before investing | Oil company delaying drilling until prices rise |
| **Option to expand** | Scale up if initial results are good | Tech company building infrastructure that allows scaling |
| **Option to contract** | Scale down if results are poor | Airline reducing flight frequency on a route |
| **Option to abandon** | Shut down and recover salvage value | Mining company closing an unprofitable mine |
| **Option to switch** | Change inputs, outputs, or processes | Power plant that can burn gas or oil |
| **Staging option** | Invest in phases, with go/no-go decisions | Pharmaceutical drug development (Phase I, II, III) |

### Why Traditional NPV Undervalues Flexibility

Consider a pharmaceutical company deciding whether to invest $500M in a new drug. Traditional NPV:

\`\`\`
Expected cash flows = $800M (if successful, 30% probability)
Expected cash flows = $0 (if unsuccessful, 70% probability)
Expected value = 0.30 x $800M = $240M
NPV = -$500M + $240M/(1.12) = -$286M  ← REJECT
\`\`\`

But pharma development is staged: Phase I costs $20M, Phase II costs $80M, Phase III costs $400M. The company can **stop at any phase** if results are negative.

With real options thinking:
\`\`\`
Phase I: Invest $20M. If results positive (40% chance), proceed.
Phase II: Invest $80M. If results positive (50% chance), proceed.
Phase III: Invest $400M. If successful (75% chance), earn $800M.
\`\`\`

The option to abandon after each phase dramatically changes the economics because the firm only makes the large Phase III investment after confirming the drug works.

### Real-World Example: Amazon Web Services

Amazon's investment in AWS is a classic real options success story. In 2003-2006, Amazon invested incrementally in building excess computing infrastructure. Key option elements:

- **Staging:** Built incrementally, testing market demand at each step
- **Option to expand:** As demand materialized, expanded aggressively
- **Option to pivot:** Originally built for internal use, pivoted to external cloud services

If Amazon had evaluated AWS as a traditional NPV project in 2003, the massive infrastructure investment for an unproven market would likely have been rejected. The real options approach — invest a little, learn, then invest more — led to what is now a $90+ billion/year revenue business (Source: Amazon annual reports; Damodaran, A. "Amazon: Glimpses of Valhalla," NYU, 2019).

### Valuing Real Options

Two common approaches:

**1. Decision Trees**
Map out possible outcomes and decisions at each node. Compute the value by working backward from the final outcomes, choosing the optimal action at each decision point.

**2. Black-Scholes / Binomial Models**
Apply financial option pricing models. The key inputs map from financial to real options:

| Financial Option | Real Option |
|-----------------|------------|
| Stock price | PV of project cash flows |
| Strike price | Investment cost |
| Time to expiration | Time until opportunity expires |
| Volatility | Uncertainty of cash flows |
| Risk-free rate | Risk-free rate |

### Limitations

- Real options are harder to value than financial options because the underlying "asset" doesn't trade in a liquid market
- Option thinking can be used to justify delaying too long — "analysis paralysis"
- Managers may overestimate the value of flexibility

### Key Takeaway

Real options remind us that managerial flexibility has value. Projects that can be staged, expanded, or abandoned are worth more than projects with identical expected cash flows but no flexibility. When standard NPV says "no" but the project offers significant learning and optionality, real options analysis may reveal hidden value.

**Sources:** Dixit, A. & Pindyck, R. *Investment Under Uncertainty* (Princeton UP, 1994); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 22; Damodaran, A. *Investment Valuation* (3rd ed., 2012), Ch. 29.`,
    },
    {
      id: "cf-project-risk",
      slug: "project-risk-analysis",
      title: "Project Risk Analysis",
      content: `## Project Risk Analysis

Not all projects carry the same risk. A critical challenge in capital budgeting is properly assessing and adjusting for the risk of individual projects, rather than blindly applying the company's overall WACC to every investment.

### Why Project-Specific Risk Matters

A utility company with a WACC of 7% is considering two projects:
1. **Expand existing power grid** — low risk, similar to current operations
2. **Build a cryptocurrency mining facility** — high risk, completely different business

Using the same 7% discount rate for both projects would overvalue the risky crypto project (discount rate too low) and potentially undervalue the safe grid expansion (discount rate too high, though closer to correct). The result: the firm systematically accepts too many risky projects and too few safe ones.

### Adjusting the Discount Rate

The correct approach is to use a discount rate that reflects the risk of the **project's cash flows**, not the risk of the firm as a whole.

**Pure-play method:** Find a publicly traded "pure-play" company that operates in the same industry as the project. Use that company's beta and cost of capital as a proxy:

1. Find a pure-play comparable company
2. Unlever its equity beta: Beta_U = Beta_L / [1 + (1-T) x (D/E)]
3. Relever at the project firm's target D/E
4. Use CAPM to calculate the project-specific cost of equity
5. Calculate a project-specific WACC

### Monte Carlo Simulation

**Monte Carlo simulation** uses random sampling to model the probability distribution of project outcomes. Instead of a single NPV estimate, it produces a distribution:

**Process:**
1. Define probability distributions for key uncertain variables (revenue growth, costs, discount rate)
2. Randomly sample from each distribution
3. Calculate NPV for that set of sampled values
4. Repeat 10,000+ times
5. Analyze the resulting distribution of NPVs

**Output:** A histogram showing the probability of different NPV outcomes:
- Mean NPV: $5.2M
- Probability of positive NPV: 72%
- 5th percentile (worst case): -$8.1M
- 95th percentile (best case): $18.4M

Monte Carlo simulation has become standard practice at major corporations. According to a McKinsey study, companies using advanced analytics (including simulation) in capital allocation decisions delivered 40% higher shareholder returns than peers (Source: Koller, T. et al., *Valuation*, McKinsey, 7th ed., 2020).

### Decision Trees for Sequential Risk

When a project involves **sequential decisions** with uncertainty at each stage, decision trees are the appropriate tool:

\`\`\`
                    [Success 60%] → Expand (NPV = $20M)
    [Pilot: -$2M] →
                    [Failure 40%] → Abandon (NPV = -$2M)
\`\`\`

Expected NPV = 0.60 x $20M + 0.40 x (-$2M) - $2M = $12M - $0.8M - $2M = $9.2M

### Risk-Adjusted Cash Flows vs. Risk-Adjusted Discount Rates

There are two equivalent approaches to incorporating risk:

**Method 1: Adjust the discount rate**
Use a higher discount rate for riskier cash flows.

**Method 2: Certainty equivalent (adjust cash flows)**
Convert expected cash flows to "certainty equivalents" — the guaranteed amount that would make you indifferent — and discount at the risk-free rate.

Both methods should give the same answer when applied correctly. In practice, adjusting the discount rate is more common because it is simpler and more intuitive.

### Real-World Example: Pharmaceutical R&D

Pharmaceutical companies face extreme project risk. The probability of a drug candidate making it from Phase I clinical trials to FDA approval is approximately **7.9%** (Source: Wong, C. et al., "Estimation of Clinical Trial Success Rates," *Biostatistics*, 2019). Yet the payoff of a successful drug can be enormous.

Pfizer's decision to invest in the BNT162b2 COVID-19 vaccine (in partnership with BioNTech) illustrates project risk analysis:
- **Investment:** ~$2 billion in development and manufacturing at risk
- **Key risks:** Clinical trial failure, regulatory rejection, manufacturing scale-up
- **Risk mitigation:** Manufacturing at risk (before approval) to accelerate delivery
- **Outcome:** $37 billion in vaccine revenue in 2021 alone

(Source: Pfizer 10-K, 2021)

### Common Pitfalls

1. **Fudge factor risk adjustment** — arbitrarily adding 2-3% to the discount rate "because it's risky" has no theoretical basis
2. **Ignoring systematic vs. idiosyncratic risk** — CAPM says only systematic (market) risk requires compensation. Diversifiable risk should not affect the discount rate.
3. **Confusing risk with uncertainty** — risk can be quantified with probabilities; true uncertainty (in the Knightian sense) cannot

### Key Takeaway

Use project-specific discount rates, not the company WACC, when project risk differs materially from the firm's average risk. Supplement NPV with Monte Carlo simulation and scenario analysis to understand the full distribution of possible outcomes.

**Sources:** Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 8, 12; Wong, C. et al. (*Biostatistics*, 2019); Koller, T. et al., *Valuation* (McKinsey, 7th ed., 2020).`,
    },
  ],
};

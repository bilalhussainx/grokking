import { Module } from "../types";

export const managerialModule: Module = {
  id: "acct-managerial",
  title: "Managerial Accounting",
  description: "Apply accounting information to management decisions — budgeting, capital budgeting (NPV/IRR), make-vs-buy analysis, performance measurement, and transfer pricing. Resources: Kaplan & Atkinson Advanced Management Accounting, Brealey Myers & Allen Principles of Corporate Finance.",
  lessons: [
    {
      id: "acct-managerial-budgeting",
      slug: "budgeting-and-forecasting",
      title: "Budgeting & Forecasting",
      content: `## Budgeting & Forecasting

A budget is a financial plan that quantifies management's expectations for revenues, expenses, and cash flows over a future period. Budgeting forces organizations to plan ahead, allocate resources, coordinate activities, and establish benchmarks for performance evaluation.

### The Master Budget

The master budget is the comprehensive financial plan for an organization, composed of interconnected operating and financial budgets:

**Operating Budgets:**
1. **Sales Budget** — the starting point; all other budgets flow from expected sales
2. **Production Budget** — units to produce = expected sales + desired ending inventory - beginning inventory
3. **Direct Materials Budget** — materials needed for planned production
4. **Direct Labor Budget** — labor hours and cost for planned production
5. **Manufacturing Overhead Budget** — fixed and variable overhead costs
6. **Selling & Administrative Expense Budget**

**Financial Budgets:**
7. **Cash Budget** — projected cash inflows and outflows (the most important budget for survival)
8. **Budgeted Income Statement** — expected profitability
9. **Budgeted Balance Sheet** — expected financial position

### The Sales Budget: Foundation of Everything

Since virtually every line item depends on sales volume, the accuracy of the sales forecast determines the usefulness of the entire budget. Methods include:

- **Bottom-up:** Sales teams estimate by territory/customer
- **Top-down:** Management sets targets based on market analysis
- **Statistical:** Time-series analysis, regression, machine learning models

Armstrong (2001, *Principles of Forecasting*, Springer) found that combining multiple forecasting methods improves accuracy by 5-15% over any single method — a finding known as the "combination principle."

### Budgeting Approaches

**Incremental Budgeting:** Start with last year's numbers and adjust. Simple but perpetuates inefficiencies — an approach criticized by Pyhrr (1973) for embedding "budgetary slack."

**Zero-Based Budgeting (ZBB):** Every expense must be justified from zero each period. Eliminates waste but is extremely time-consuming. Pioneered at Texas Instruments by Peter Pyhrr (1973, *Zero-Base Budgeting*, Wiley), ZBB has seen a resurgence — Kraft Heinz, Unilever, and other consumer goods companies adopted ZBB after 2015, reporting cost savings of 5-15% (McKinsey, 2018).

**Rolling (Continuous) Budgets:** Always maintain a 12-month budget by adding a new month as each month ends. Keeps the budget current and reduces the "hockey stick" effect of annual budgeting.

**Activity-Based Budgeting:** Links resource allocation to activities and output, using ABC principles. More accurate but more complex.

### The Cash Budget

The cash budget is arguably the most critical component — profitable companies fail when they run out of cash. Structure:

\`\`\`
Beginning Cash Balance
+ Cash Receipts (collections from sales, other income)
= Total Cash Available
- Cash Disbursements (materials, labor, overhead, taxes, debt)
= Ending Cash Balance Before Financing
+/- Financing (borrowing, repayments)
= Ending Cash Balance
\`\`\`

### Behavioral Aspects of Budgeting

Budgets are not just financial tools — they are organizational control mechanisms that affect human behavior:

- **Budgetary slack:** Managers pad budgets to make targets easier to hit. Merchant (1985, *Budgeting and the Propensity to Create Budgetary Slack*, Accounting, Organizations and Society) found that 80% of managers admit to building slack into their budgets.
- **Participative budgeting:** Involving lower-level managers improves commitment but may increase slack.
- **Budget pressure:** Excessive focus on meeting budget targets can lead to ethical violations — a dynamic documented in the Wells Fargo fake accounts scandal (2016).

### Key Takeaway

Budgeting transforms strategy into numbers. The master budget coordinates all organizational activities around a common financial plan, while the cash budget ensures the organization can survive to execute that plan.

*References: Armstrong (2001), Principles of Forecasting (Springer); Pyhrr (1973), Zero-Base Budgeting (Wiley); Merchant (1985), Accounting, Organizations and Society; McKinsey (2018), Zero-Based Budgeting Report.*`,
    },
    {
      id: "acct-managerial-capital-budgeting",
      slug: "capital-budgeting",
      title: "Capital Budgeting (NPV & IRR)",
      content: `## Capital Budgeting: NPV and IRR

Capital budgeting is the process of evaluating long-term investment projects — deciding which projects to undertake and which to reject. These decisions involve large sums, span many years, and are often irreversible. Getting them right is critical to a company's long-term value.

### The Time Value of Money

A dollar today is worth more than a dollar tomorrow because today's dollar can be invested to earn a return. This principle — the time value of money — is the foundation of all capital budgeting techniques.

\`\`\`
Present Value = Future Value / (1 + r)^n
\`\`\`

Where r = discount rate and n = number of periods.

### Net Present Value (NPV)

NPV is the gold standard of capital budgeting. It calculates the present value of all future cash flows (both inflows and outflows) discounted at the required rate of return:

\`\`\`
NPV = -Initial Investment + CF1/(1+r) + CF2/(1+r)^2 + ... + CFn/(1+r)^n
\`\`\`

**Decision rule:** Accept the project if NPV > 0. Reject if NPV < 0.

A positive NPV means the project generates returns above the required rate — it creates value for shareholders. NPV is theoretically superior to all other methods because it accounts for the time value of money, uses all cash flows, and directly measures value creation (Brealey, Myers & Allen, 2020, *Principles of Corporate Finance*, McGraw-Hill).

### Internal Rate of Return (IRR)

The IRR is the discount rate that makes NPV equal to zero:

\`\`\`
0 = -Initial Investment + CF1/(1+IRR) + CF2/(1+IRR)^2 + ... + CFn/(1+IRR)^n
\`\`\`

**Decision rule:** Accept if IRR > required rate of return (hurdle rate).

IRR is intuitive — "this project earns 18% annually" — which makes it popular with managers. However, IRR has limitations:

1. **Multiple IRRs:** Projects with alternating positive and negative cash flows can have multiple IRRs
2. **Scale problem:** A small project with 50% IRR may create less value than a large project with 20% IRR
3. **Reinvestment assumption:** IRR assumes cash flows are reinvested at the IRR itself, which may be unrealistic

### NPV vs IRR: When They Disagree

For independent projects (accept/reject decisions), NPV and IRR always agree. But for **mutually exclusive** projects (choose one), they can conflict — particularly when projects differ in scale or timing. In such cases, **always follow NPV** (Graham & Harvey, 2001, *The Theory and Practice of Corporate Finance*, Journal of Financial Economics).

### Payback Period

\`\`\`
Payback Period = Years until cumulative cash flows recover the initial investment
\`\`\`

Simple and intuitive, but it ignores the time value of money and all cash flows after the payback point. The **discounted payback period** partially addresses this by using present values.

Despite its theoretical weaknesses, Graham & Harvey (2001) surveyed 392 CFOs and found that 57% always or almost always use the payback period — suggesting it serves as a risk screen (shorter payback = less uncertainty).

### Real-World Practice

The same survey found:
- 75% of CFOs always or almost always use NPV
- 76% use IRR
- 57% use payback period
- Large firms are more likely to use NPV; smaller firms rely more on payback

### Key Takeaway

NPV is the theoretically correct method for evaluating investments — it directly measures value creation. IRR is useful as a supplementary metric but can mislead in certain situations. Capital budgeting decisions determine how effectively a company deploys its resources for long-term growth.

> "The NPV rule is the only investment rule that always identifies the decision that maximizes the value of the firm." — Brealey, Myers & Allen

*References: Brealey, Myers & Allen (2020), Principles of Corporate Finance (McGraw-Hill); Graham & Harvey (2001), Journal of Financial Economics.*`,
    },
    {
      id: "acct-managerial-make-buy",
      slug: "make-vs-buy-decisions",
      title: "Make vs Buy Decisions",
      content: `## Make vs Buy Decisions

Make-or-buy (also called insource-or-outsource) analysis determines whether a company should manufacture a component internally or purchase it from an external supplier. This is one of the most common applications of relevant cost analysis in managerial accounting.

### The Relevant Cost Framework

A **relevant cost** is a cost that differs between alternatives and occurs in the future. Sunk costs (already incurred) and allocated costs (that will not change) are irrelevant to the decision.

**The key question:** Will total costs be lower if we make or buy?

### Basic Make-or-Buy Analysis

A company currently produces 10,000 units of Component X annually:

| Cost Category | Make (per unit) | Buy (per unit) |
|--------------|----------------|----------------|
| Direct materials | \\$8.00 | — |
| Direct labor | \\$5.00 | — |
| Variable overhead | \\$3.00 | — |
| Fixed overhead (allocated) | \\$6.00 | — |
| Purchase price | — | \\$19.00 |
| **Total** | **\\$22.00** | **\\$19.00** |

At first glance, buying seems cheaper. But if the \\$6.00 of fixed overhead per unit will continue regardless (it is allocated, not avoidable), then the relevant cost of making is only \\$16.00 (\\$8 + \\$5 + \\$3). **Making is \\$3 cheaper per unit than buying.**

### Avoidable vs Unavoidable Fixed Costs

The critical question is: **How much fixed cost will actually be eliminated if we stop production?**

- **Avoidable fixed costs** (supervisor salary eliminated if department closes, specialized equipment lease terminated) → relevant to the decision
- **Unavoidable fixed costs** (building depreciation, corporate overhead allocation) → irrelevant to the decision

If \\$2 of the \\$6 fixed overhead per unit is avoidable, the relevant cost of making becomes \\$18.00, and buying at \\$19.00 is still more expensive.

### Opportunity Cost

If the freed-up capacity can be used for another profitable purpose, the **opportunity cost** of making must be considered:

\`\`\`
Relevant Cost of Making = Variable Costs + Avoidable Fixed Costs + Opportunity Cost
\`\`\`

If the freed capacity could generate \\$25,000 in contribution margin from an alternative product, then:
- Cost of making 10,000 units: (\\$16 × 10,000) = \\$160,000
- Opportunity cost: \\$25,000
- Total relevant cost of making: \\$185,000
- Cost of buying: \\$19 × 10,000 = \\$190,000

Making is still cheaper — but the gap has narrowed significantly.

### Qualitative Factors

Cost analysis alone does not capture the full picture. Qualitative considerations often tip the decision:

**Reasons to make:**
- Maintain quality control
- Protect proprietary technology
- Avoid supply chain dependence on a single supplier
- Utilize excess capacity

**Reasons to buy:**
- Supplier has specialized expertise and economies of scale
- Frees management attention for core competencies
- Reduces risk of technological obsolescence
- Provides flexibility to scale up or down

Williamson's (1979) **transaction cost economics** framework (published in the Journal of Law and Economics) explains outsourcing decisions through the lens of asset specificity, uncertainty, and transaction frequency. When assets are highly specific to a transaction, internal production is preferred because the risk of supplier opportunism is high.

### Strategic Outsourcing Trends

According to Deloitte's 2020 Global Outsourcing Survey, 70% of companies cite cost reduction as the primary driver of outsourcing, but 63% also report that quality management remains their biggest concern with external suppliers.

### Key Takeaway

Make-or-buy decisions require identifying only the costs that differ between alternatives. Allocated fixed costs that will continue regardless are irrelevant. The analysis must also consider opportunity costs and qualitative factors that financial analysis alone cannot capture.

*References: Kaplan & Atkinson (1998), Advanced Management Accounting (Prentice-Hall); Williamson (1979), Journal of Law and Economics; Deloitte (2020), Global Outsourcing Survey.*`,
    },
    {
      id: "acct-managerial-performance",
      slug: "performance-measurement",
      title: "Performance Measurement",
      content: `## Performance Measurement

Performance measurement systems evaluate how effectively managers and business units achieve organizational goals. They translate strategy into measurable metrics, motivate desired behavior, and provide the basis for resource allocation and compensation decisions.

### Responsibility Centers

Organizations divide into responsibility centers based on what the manager controls:

| Center Type | Manager Controls | Key Metric |
|------------|-----------------|------------|
| **Cost Center** | Costs only (e.g., manufacturing) | Variance from budget |
| **Revenue Center** | Revenue only (e.g., sales team) | Revenue vs target |
| **Profit Center** | Revenue and costs (e.g., product division) | Operating income |
| **Investment Center** | Revenue, costs, and investment (e.g., subsidiary) | ROI, Residual Income, EVA |

The principle of **controllability** dictates that managers should be evaluated only on factors they can influence (Merchant & Van der Stede, 2017, *Management Control Systems*, Pearson).

### Return on Investment (ROI)

\`\`\`
ROI = Operating Income / Average Operating Assets
\`\`\`

ROI is the most traditional investment center metric. It measures how much profit is generated per dollar of assets employed. However, ROI creates a well-known dysfunctional incentive: managers may **reject profitable projects** if the project's ROI is below their division's current ROI — even if the project would increase firm value.

### Residual Income (RI)

\`\`\`
RI = Operating Income - (Required Rate of Return × Average Operating Assets)
\`\`\`

Residual income solves the ROI rejection problem. A project with positive RI adds value regardless of how it compares to the division's existing ROI. Managers evaluated on RI have the incentive to accept all projects that earn above the cost of capital.

### Economic Value Added (EVA)

EVA, trademarked by Stern Stewart & Co., is a refined version of residual income:

\`\`\`
EVA = NOPAT - (WACC × Invested Capital)
\`\`\`

Where NOPAT = Net Operating Profit After Taxes and WACC = Weighted Average Cost of Capital.

EVA became a popular metric in the 1990s. Research by Biddle, Bowen & Wallace (1997, *Does EVA Beat Earnings?*, Journal of Accounting and Economics) tested whether EVA better explains stock returns than traditional earnings. They found that while EVA adds some explanatory power, traditional earnings metrics remain competitive.

### The Balanced Scorecard

Kaplan & Norton (1992, *The Balanced Scorecard — Measures That Drive Performance*, Harvard Business Review) argued that financial metrics alone are insufficient. Their Balanced Scorecard framework evaluates performance across four perspectives:

1. **Financial Perspective** — ROI, EVA, revenue growth, cost reduction
2. **Customer Perspective** — satisfaction, retention, market share, acquisition
3. **Internal Business Process** — quality, cycle time, productivity, new product development
4. **Learning & Growth** — employee skills, technology capability, organizational culture

The Balanced Scorecard has been adopted by approximately 50% of Fortune 1000 companies (Rigby & Bilodeau, 2018, Bain Management Tools Survey). Its power lies in linking non-financial leading indicators to financial lagging indicators through a strategy map.

### Key Performance Indicators (KPIs)

Effective KPIs share the following characteristics (Parmenter, 2015, *Key Performance Indicators*, Wiley):
- **Specific** — clearly defined
- **Measurable** — quantifiable
- **Actionable** — managers can influence them
- **Relevant** — aligned with strategic objectives
- **Timely** — available when decisions need to be made

### Key Takeaway

Performance measurement shapes behavior. The metrics you choose determine what managers optimize for. Financial metrics alone are necessary but insufficient — a comprehensive system like the Balanced Scorecard ensures that short-term financial targets do not come at the expense of long-term strategic health.

*References: Merchant & Van der Stede (2017), Management Control Systems (Pearson); Kaplan & Norton (1992), Harvard Business Review; Biddle, Bowen & Wallace (1997), Journal of Accounting and Economics; Parmenter (2015), Key Performance Indicators (Wiley).*`,
    },
    {
      id: "acct-managerial-transfer-pricing",
      slug: "transfer-pricing",
      title: "Transfer Pricing",
      content: `## Transfer Pricing

Transfer pricing determines the price at which goods, services, or intangible assets are exchanged between divisions within the same organization. It affects division profitability, managerial incentives, tax obligations, and resource allocation — making it one of the most complex topics in managerial accounting.

### Why Transfer Pricing Matters

In a divisional organization, one division often supplies goods to another. The transfer price directly affects the reported profit of both divisions:

- **Selling division:** Wants a high transfer price (more revenue)
- **Buying division:** Wants a low transfer price (lower costs)
- **Corporate headquarters:** Wants a price that maximizes overall firm value

When the transfer price is "wrong," it distorts divisional performance metrics, leads to suboptimal resource allocation, and can cause managers to make decisions that benefit their division but hurt the company as a whole.

### Transfer Pricing Methods

**1. Market-Based Transfer Price**

Set the transfer price at the price charged in the external market for an identical product.

\`\`\`
Transfer Price = External Market Price
\`\`\`

**Advantages:** Objective, reflects true economic value, aligns divisional incentives with corporate goals.
**Limitations:** Requires a competitive external market for the intermediate product. If no market exists, this method cannot be applied.

Hirshleifer (1956, *On the Economics of Transfer Pricing*, Journal of Business) proved mathematically that when a perfectly competitive external market exists, the market price is the optimal transfer price — it leads to the same production decisions that would maximize total firm profit.

**2. Cost-Based Transfer Price**

Set the transfer price at some measure of cost — variable cost, full cost, or cost plus markup.

\`\`\`
Transfer Price = Variable Cost + Markup (optional)
\`\`\`

**Advantages:** Simple, always available (does not require an external market).
**Limitations:** Variable cost gives the selling division no profit incentive. Full cost includes allocated overhead, which can distort decisions. Cost-plus markup is arbitrary.

**3. Negotiated Transfer Price**

Allow divisional managers to negotiate the price between themselves.

\`\`\`
Transfer Price = Between variable cost (floor) and market price (ceiling)
\`\`\`

**Advantages:** Preserves divisional autonomy, incorporates local knowledge.
**Limitations:** Time-consuming, outcome depends on bargaining power, may not produce optimal results.

### The General Transfer Pricing Rule

Economic theory provides a guideline:

\`\`\`
Minimum Transfer Price = Marginal Cost + Opportunity Cost
\`\`\`

If the selling division has excess capacity, the opportunity cost is zero, so the minimum transfer price equals variable cost. If the selling division is at full capacity and can sell externally, the opportunity cost equals the lost contribution margin from external sales, pushing the minimum price toward the market price (Horngren, Datar & Rajan, 2018, *Cost Accounting*, Pearson).

### International Transfer Pricing and Taxes

For multinational companies, transfer pricing is primarily a tax issue. By setting high transfer prices for goods shipped to high-tax countries and low prices for goods shipped to low-tax countries, companies can shift profits to minimize global tax obligations.

Tax authorities worldwide combat this through **arm's length pricing** rules (OECD Transfer Pricing Guidelines, 2022), which require that transfer prices reflect what unrelated parties would charge in comparable transactions.

The scale of the issue is enormous. The OECD estimates that transfer pricing manipulation causes \\$100-240 billion in annual global tax revenue losses (OECD BEPS Action 13, 2015).

### Dual Pricing

Some organizations use **dual transfer pricing** — the selling division records the transfer at market price (motivating production), while the buying division records it at variable cost (motivating purchasing). The difference is eliminated in consolidation. This theoretically solves the incentive problem but is complex to administer and can reduce cost consciousness.

### Key Takeaway

Transfer pricing is where economics, accounting, organizational behavior, and tax law intersect. The "right" price depends on whether the goal is divisional performance evaluation, optimal resource allocation, or tax minimization — and these goals often conflict.

> "Transfer pricing is the most important tax issue facing multinational corporations today." — OECD, Transfer Pricing Guidelines

*References: Hirshleifer (1956), Journal of Business; Horngren, Datar & Rajan (2018), Cost Accounting (Pearson); OECD Transfer Pricing Guidelines (2022); OECD BEPS Action 13 (2015).*`,
    },
  ],
};

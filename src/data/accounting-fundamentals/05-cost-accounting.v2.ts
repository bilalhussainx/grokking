import { Module } from "../types";

export const costAccountingModule: Module = {
  id: "acct-cost",
  title: "Cost Accounting",
  description: "Understand cost behavior, break-even analysis, contribution margin, activity-based costing, and variance analysis — the tools managers use to control costs and maximize profit. Resources: Horngren et al. Cost Accounting, Drury (2018) Management and Cost Accounting.",
  lessons: [
    {
      id: "acct-cost-fixed-variable",
      slug: "fixed-vs-variable-costs",
      title: "Fixed vs Variable Costs",
      content: `## Fixed vs Variable Costs

Understanding how costs behave relative to changes in activity level is fundamental to managerial decision-making. Cost behavior analysis divides all costs into fixed, variable, and mixed categories — a framework that underpins break-even analysis, budgeting, and pricing decisions.

### Variable Costs

Variable costs change in **direct proportion** to the level of activity (production volume, sales units, or service hours). As output increases by 10%, total variable costs increase by approximately 10%.

**Examples:**
- Raw materials
- Direct labor (piece-rate workers)
- Sales commissions
- Shipping and packaging costs

**Key characteristic:** Total variable costs change, but **per-unit variable cost stays constant**. If each unit requires \\$5 of raw materials, producing 100 units costs \\$500 and producing 1,000 units costs \\$5,000 — but the per-unit cost remains \\$5.

### Fixed Costs

Fixed costs remain **constant in total** regardless of the level of activity within a relevant range. Whether a factory produces 1,000 units or 10,000 units, fixed costs stay the same.

**Examples:**
- Rent and lease payments
- Salaries of permanent staff
- Insurance premiums
- Depreciation (straight-line method)

**Key characteristic:** Total fixed costs stay constant, but **per-unit fixed cost decreases** as volume increases. This is the concept of **spreading fixed costs** — and it is why higher volume typically leads to lower unit costs.

If rent is \\$10,000/month:
- At 1,000 units: \\$10 per unit
- At 5,000 units: \\$2 per unit
- At 10,000 units: \\$1 per unit

### The Relevant Range

Cost behavior assumptions hold within the **relevant range** — the normal range of activity for which cost relationships are valid. Outside this range, costs may change in steps. For example, a factory's rent is fixed at \\$10,000/month for production up to 50,000 units. Beyond that, a second factory is needed, stepping rent up to \\$20,000/month (Horngren, Datar & Rajan, 2018, *Cost Accounting*, Pearson).

### Mixed (Semi-Variable) Costs

Many real-world costs contain both fixed and variable components:

- **Electricity** — base charge (fixed) + usage charge (variable)
- **Phone plans** — monthly fee (fixed) + overage charges (variable)
- **Sales personnel** — base salary (fixed) + commission (variable)

The **high-low method** separates mixed costs into their fixed and variable components:

\`\`\`
Variable Rate = (Highest Cost - Lowest Cost) / (Highest Activity - Lowest Activity)
Fixed Cost = Total Cost - (Variable Rate × Activity Level)
\`\`\`

More sophisticated methods include **regression analysis** (least-squares method), which uses all data points rather than just the extremes. Anderson, Banker & Janakiraman (2003, *Are Selling, General, and Administrative Costs Sticky?*, Journal of Accounting Research) demonstrated that costs often exhibit "stickiness" — they increase with rising activity but do not decrease proportionally when activity falls, challenging the simple linear cost model.

### Cost Classification Summary

| Behavior | Total Cost | Per-Unit Cost | Graph Shape |
|----------|-----------|---------------|-------------|
| Variable | Changes proportionally | Constant | Straight line through origin |
| Fixed | Constant (in relevant range) | Decreases as volume rises | Horizontal line |
| Mixed | Changes, but not proportionally | Varies | Straight line with y-intercept |

### Strategic Implications

The fixed-variable cost structure defines a company's **operating leverage**:
- **High fixed costs** (airlines, software) → high operating leverage → larger profit swings with volume changes
- **High variable costs** (consulting, retail) → low operating leverage → more stable but less scalable profits

### Key Takeaway

Every cost in a business is either fixed, variable, or a mix of both. Understanding this classification is the foundation for break-even analysis, contribution margin, and all cost-volume-profit decisions we explore in the next lessons.

*References: Horngren, Datar & Rajan (2018), Cost Accounting (Pearson); Anderson, Banker & Janakiraman (2003), Journal of Accounting Research; Drury (2018), Management and Cost Accounting (Cengage).*`,
    },
    {
      id: "acct-cost-breakeven",
      slug: "break-even-analysis",
      title: "Break-Even Analysis",
      content: `## Break-Even Analysis

Break-even analysis determines the level of sales at which total revenue equals total costs — the point where the business neither makes a profit nor incurs a loss. It is one of the most practical tools in managerial accounting.

### The Break-Even Formula

\`\`\`
Break-Even Units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit)
\`\`\`

The denominator — selling price minus variable cost — is called the **contribution margin per unit**. It represents how much each unit sold "contributes" toward covering fixed costs and generating profit.

### Example Calculation

A coffee shop has:
- Fixed costs: \\$8,000/month (rent, salaries, insurance)
- Variable cost per cup: \\$1.50 (beans, cup, milk)
- Selling price per cup: \\$5.00

\`\`\`
Break-Even = \\$8,000 / (\\$5.00 - \\$1.50) = \\$8,000 / \\$3.50 = 2,286 cups/month
\`\`\`

The shop must sell 2,286 cups per month (about 76 per day) to break even. Every cup beyond this generates \\$3.50 of profit.

### Break-Even in Revenue Dollars

\`\`\`
Break-Even Revenue = Fixed Costs / Contribution Margin Ratio
\`\`\`

Where Contribution Margin Ratio = Contribution Margin per Unit / Selling Price

For our coffee shop:
\`\`\`
CM Ratio = \\$3.50 / \\$5.00 = 0.70 (70%)
Break-Even Revenue = \\$8,000 / 0.70 = \\$11,429/month
\`\`\`

### Target Profit Analysis

Break-even analysis extends naturally to target profit calculations:

\`\`\`
Units for Target Profit = (Fixed Costs + Target Profit) / Contribution Margin per Unit
\`\`\`

To earn \\$4,000/month profit: (\\$8,000 + \\$4,000) / \\$3.50 = 3,429 cups.

### Margin of Safety

\`\`\`
Margin of Safety = Actual Sales - Break-Even Sales
\`\`\`

This measures how much sales can decline before the company reaches break-even. A wider margin of safety indicates lower risk. If the coffee shop sells 3,000 cups, the margin of safety is 714 cups (3,000 - 2,286), or about 24%.

### Assumptions and Limitations

Break-even analysis assumes:
1. Costs can be cleanly separated into fixed and variable
2. Variable cost per unit is constant
3. Selling price per unit is constant
4. The sales mix (for multi-product firms) is constant
5. Inventory levels do not change significantly

These assumptions rarely hold perfectly in practice. Balakrishnan, Labro & Soderstrom (2014, *Research in Management Accounting*, European Accounting Review) documented that real-world cost functions often exhibit non-linearities, step-function behavior, and interactions between cost drivers that simple CVP models do not capture.

### Multi-Product Break-Even

For companies selling multiple products, the break-even formula uses a **weighted-average contribution margin** based on the expected sales mix:

\`\`\`
Weighted CM = Sum of (CM per product × Sales Mix Percentage)
Break-Even (total units) = Fixed Costs / Weighted CM
\`\`\`

### Why Break-Even Matters

Break-even analysis is used for:
- **Startup planning** — how many customers are needed to cover costs?
- **Pricing decisions** — what price is needed to break even at expected volume?
- **Cost control** — how does reducing fixed costs change the break-even point?
- **Investment analysis** — evaluating whether a new product or expansion is viable

### Key Takeaway

Break-even analysis translates the fixed/variable cost framework into an actionable decision tool. It tells managers exactly how much they need to sell to avoid losses and how much additional profit each unit beyond break-even generates.

*References: Horngren, Datar & Rajan (2018), Cost Accounting (Pearson); Balakrishnan, Labro & Soderstrom (2014), European Accounting Review.*`,
      starterCode: `# Break-Even Analysis Calculator

def breakeven_analysis(
    fixed_costs: float,
    price_per_unit: float,
    variable_cost_per_unit: float,
    target_profit: float = 0
) -> dict:
    """
    Perform break-even and target profit analysis.

    Returns a dict with:
    - contribution_margin: per-unit CM
    - cm_ratio: CM as percentage of price
    - breakeven_units: units to break even
    - breakeven_revenue: revenue to break even
    - target_units: units needed for target profit
    - target_revenue: revenue needed for target profit
    """
    # TODO: Calculate contribution margin per unit
    cm_per_unit = 0

    # TODO: Calculate contribution margin ratio
    cm_ratio = 0

    # TODO: Calculate break-even in units
    breakeven_units = 0

    # TODO: Calculate break-even in revenue
    breakeven_revenue = 0

    # TODO: Calculate units for target profit
    target_units = 0

    # TODO: Calculate revenue for target profit
    target_revenue = 0

    return {
        "contribution_margin": round(cm_per_unit, 2),
        "cm_ratio": round(cm_ratio, 4),
        "breakeven_units": round(breakeven_units),
        "breakeven_revenue": round(breakeven_revenue, 2),
        "target_units": round(target_units),
        "target_revenue": round(target_revenue, 2),
    }


# Test: Coffee shop example
result = breakeven_analysis(
    fixed_costs=8000,
    price_per_unit=5.00,
    variable_cost_per_unit=1.50,
    target_profit=4000
)
print(result)
# Expected: breakeven_units=2286, breakeven_revenue=11428.57,
# target_units=3429, cm_ratio=0.70`,
      solutionCode: `# Break-Even Analysis Calculator

def breakeven_analysis(
    fixed_costs: float,
    price_per_unit: float,
    variable_cost_per_unit: float,
    target_profit: float = 0
) -> dict:
    """
    Perform break-even and target profit analysis.

    Returns a dict with:
    - contribution_margin: per-unit CM
    - cm_ratio: CM as percentage of price
    - breakeven_units: units to break even
    - breakeven_revenue: revenue to break even
    - target_units: units needed for target profit
    - target_revenue: revenue needed for target profit
    """
    # Calculate contribution margin per unit
    cm_per_unit = price_per_unit - variable_cost_per_unit

    # Calculate contribution margin ratio
    cm_ratio = cm_per_unit / price_per_unit

    # Calculate break-even in units
    breakeven_units = fixed_costs / cm_per_unit

    # Calculate break-even in revenue
    breakeven_revenue = fixed_costs / cm_ratio

    # Calculate units for target profit
    target_units = (fixed_costs + target_profit) / cm_per_unit

    # Calculate revenue for target profit
    target_revenue = (fixed_costs + target_profit) / cm_ratio

    return {
        "contribution_margin": round(cm_per_unit, 2),
        "cm_ratio": round(cm_ratio, 4),
        "breakeven_units": round(breakeven_units),
        "breakeven_revenue": round(breakeven_revenue, 2),
        "target_units": round(target_units),
        "target_revenue": round(target_revenue, 2),
    }


# Test: Coffee shop example
result = breakeven_analysis(
    fixed_costs=8000,
    price_per_unit=5.00,
    variable_cost_per_unit=1.50,
    target_profit=4000
)
print(result)`,
    },
    {
      id: "acct-cost-contribution-margin",
      slug: "contribution-margin",
      title: "Contribution Margin",
      content: `## Contribution Margin

The contribution margin is the amount remaining from sales revenue after deducting all variable costs. It represents the portion of revenue available to cover fixed costs and generate profit. This concept is the heart of cost-volume-profit (CVP) analysis and drives many of the most important decisions managers make.

### Contribution Margin Defined

\`\`\`
Total Contribution Margin = Total Revenue - Total Variable Costs
Per-Unit CM = Selling Price per Unit - Variable Cost per Unit
CM Ratio = Contribution Margin per Unit / Selling Price per Unit
\`\`\`

### The Contribution Margin Income Statement

Unlike the traditional income statement (organized by function), the contribution margin income statement separates costs by **behavior** — a format far more useful for internal decision-making:

\`\`\`
Sales Revenue                    \\$500,000
Less: Variable Costs
  Variable COGS     \\$200,000
  Variable SG&A      \\$50,000
  Total Variable               (\\$250,000)
─────────────────────────────────────────
Contribution Margin              \\$250,000   (50%)
Less: Fixed Costs
  Fixed Manufacturing \\$80,000
  Fixed SG&A          \\$70,000
  Total Fixed                  (\\$150,000)
─────────────────────────────────────────
Operating Income                 \\$100,000
\`\`\`

### Decision-Making Applications

**1. Accept or Reject a Special Order**

A company operating below capacity receives a one-time order for 1,000 units at \\$15/unit (below the normal price of \\$25). Variable cost is \\$12/unit. Should they accept?

The contribution margin per unit on the special order = \\$15 - \\$12 = \\$3. Since fixed costs will not change, each unit adds \\$3 to profit. The order adds \\$3,000 to operating income. **Accept the order** — as long as it does not affect regular sales or create long-term pricing expectations (Kaplan & Atkinson, 1998, *Advanced Management Accounting*, Prentice-Hall).

**2. Product Mix Decisions**

When resources are constrained (limited machine hours, labor hours, or materials), managers should prioritize products with the **highest contribution margin per unit of the constraining resource**:

| Product | CM per Unit | Machine Hours per Unit | CM per Machine Hour |
|---------|------------|----------------------|-------------------|
| A | \\$60 | 2 | \\$30 |
| B | \\$45 | 1 | \\$45 |
| C | \\$80 | 4 | \\$20 |

Product B should be prioritized — it generates the highest contribution per scarce resource, even though Product C has the highest absolute CM per unit.

**3. Drop or Keep a Product Line**

If a product line has a negative operating income but a positive contribution margin, dropping it would reduce total profit by the amount of its contribution margin (because the fixed costs would still exist). Balakrishnan, Sivaramakrishnan & Sprinkle (2012, *Managerial Accounting*, Wiley) emphasize that this counter-intuitive result is one of the most common mistakes in cost analysis.

### Operating Leverage Revisited

The contribution margin ratio determines operating leverage:

\`\`\`
Degree of Operating Leverage (DOL) = Contribution Margin / Operating Income
\`\`\`

A DOL of 2.5 means a 10% increase in sales will produce a 25% increase in operating income. High CM ratio (high fixed costs, low variable costs) = high operating leverage.

### Limitations

The contribution margin framework assumes:
- Linear cost behavior within the relevant range
- A single product or constant sales mix
- No capacity constraints (unless explicitly modeled)

Real-world applications often require sensitivity analysis across multiple scenarios.

### Key Takeaway

The contribution margin is the most powerful concept in managerial accounting. It shifts focus from full-cost thinking (which allocates fixed overhead) to incremental thinking (which considers only the costs that change with the decision).

> "Fixed costs are irrelevant to decisions about individual units. Only the contribution margin matters." — Robert Kaplan, Harvard Business School

*References: Kaplan & Atkinson (1998), Advanced Management Accounting (Prentice-Hall); Balakrishnan, Sivaramakrishnan & Sprinkle (2012), Managerial Accounting (Wiley); Horngren, Datar & Rajan (2018), Cost Accounting (Pearson).*`,
    },
    {
      id: "acct-cost-abc",
      slug: "activity-based-costing",
      title: "Activity-Based Costing",
      content: `## Activity-Based Costing (ABC)

Activity-Based Costing is a cost allocation method that assigns overhead costs to products based on the activities that drive those costs, rather than using a single volume-based allocation rate. ABC provides more accurate product costs, especially in companies with diverse product lines and significant overhead.

### The Problem with Traditional Costing

Traditional costing allocates overhead using a single rate — typically based on direct labor hours or machine hours:

\`\`\`
Overhead Rate = Total Overhead / Total Direct Labor Hours
\`\`\`

This works when overhead is driven primarily by volume. But in modern manufacturing and service industries, overhead often constitutes 50-70% of total costs and is driven by complexity, not volume (Cooper & Kaplan, 1988, *Measure Costs Right: Make the Right Decisions*, Harvard Business Review).

**The distortion:** High-volume, simple products absorb too much overhead, while low-volume, complex products absorb too little. This leads to:
- Overpricing simple products (making them uncompetitive)
- Underpricing complex products (selling them at a hidden loss)

### How ABC Works

ABC allocates costs through a two-stage process:

**Stage 1: Identify Activities and Assign Costs**

Activities are the tasks that consume resources:

| Activity | Cost Driver | Annual Cost |
|----------|-----------|-------------|
| Machine setup | Number of setups | \\$200,000 |
| Quality inspection | Number of inspections | \\$150,000 |
| Material handling | Number of material moves | \\$100,000 |
| Order processing | Number of orders | \\$80,000 |
| Machine operation | Machine hours | \\$300,000 |

**Stage 2: Assign Activity Costs to Products**

Each product is charged based on how much of each activity it consumes:

\`\`\`
Cost per Setup = \\$200,000 / 500 total setups = \\$400/setup
\`\`\`

A complex product requiring 100 setups is allocated \\$40,000, while a simple product requiring 10 setups is allocated only \\$4,000 — regardless of production volume.

### ABC vs Traditional: An Example

A factory produces two products — Standard (high volume) and Custom (low volume):

| | Standard | Custom |
|---|---|---|
| Units produced | 10,000 | 1,000 |
| Direct labor hours | 20,000 | 5,000 |
| Machine setups | 50 | 200 |
| Inspections | 100 | 400 |

**Traditional allocation** (based on labor hours, \\$20/hour overhead rate):
- Standard: \\$400,000 overhead
- Custom: \\$100,000 overhead

**ABC allocation:**
- Standard: \\$120,000 (proportionally fewer setups and inspections)
- Custom: \\$380,000 (many more setups and inspections per unit)

The traditional system dramatically undercosted Custom and overcosted Standard.

### Implementation Challenges

ABC is more accurate but more expensive to implement and maintain. Kaplan & Anderson (2004, *Time-Driven Activity-Based Costing*, Harvard Business Review) developed a simplified version — **Time-Driven ABC (TDABC)** — that estimates cost rates per unit of time for each resource, reducing the complexity of traditional ABC while retaining its accuracy advantages.

Research by Ittner, Lanen & Larcker (2002, *The Association Between Activity-Based Costing and Manufacturing Performance*, Journal of Accounting Research) found that firms adopting ABC showed improvements in quality and cycle time, but the effect on financial performance was moderated by the complexity of the firm's operations.

### When to Use ABC

ABC is most beneficial when:
- Overhead is a large percentage of total costs
- Products vary significantly in complexity, volume, and resource consumption
- Traditional costing produces product costs that do not align with market pricing
- Management needs accurate cost data for pricing, outsourcing, or product mix decisions

### Key Takeaway

Activity-Based Costing corrects the distortions of traditional overhead allocation by linking costs to the activities that actually drive them. While more complex to implement, it provides the accurate cost information that managers need for strategic decisions.

> "The traditional cost system is like a postal system that weighs each letter and charges by weight. ABC is like FedEx — it charges based on the actual resources consumed to deliver each package." — Robin Cooper & Robert Kaplan

*References: Cooper & Kaplan (1988), Harvard Business Review; Kaplan & Anderson (2004), Harvard Business Review; Ittner, Lanen & Larcker (2002), Journal of Accounting Research.*`,
    },
    {
      id: "acct-cost-variance",
      slug: "variance-analysis",
      title: "Variance Analysis",
      content: `## Variance Analysis

Variance analysis compares actual results to budgeted or standard amounts and investigates the causes of differences. It is the primary performance evaluation tool in management accounting — enabling managers to identify problems, assign accountability, and take corrective action.

### What is a Variance?

\`\`\`
Variance = Actual Result - Budgeted (Standard) Amount
\`\`\`

- **Favorable variance (F):** Actual costs are less than budgeted (or actual revenue exceeds budget)
- **Unfavorable variance (U):** Actual costs exceed budget (or actual revenue falls short)

Note: "Favorable" does not always mean "good." Spending less on quality control might be favorable in terms of cost but unfavorable in terms of product quality.

### Direct Materials Variances

**Materials Price Variance:**
\`\`\`
MPV = (Actual Price - Standard Price) × Actual Quantity Purchased
\`\`\`

This measures whether the purchasing department paid more or less than expected per unit of material. Causes include: market price changes, volume discounts (or lack thereof), supplier changes, or rush orders.

**Materials Quantity (Usage) Variance:**
\`\`\`
MQV = (Actual Quantity Used - Standard Quantity Allowed) × Standard Price
\`\`\`

This measures whether production used more or less material than the standard allows. Causes include: waste, spoilage, quality of materials, worker skill level, or machine calibration.

### Direct Labor Variances

**Labor Rate Variance:**
\`\`\`
LRV = (Actual Rate - Standard Rate) × Actual Hours Worked
\`\`\`

Causes: overtime, use of higher/lower-skilled workers, union contract changes.

**Labor Efficiency Variance:**
\`\`\`
LEV = (Actual Hours - Standard Hours Allowed) × Standard Rate
\`\`\`

Causes: worker training, equipment breakdowns, material quality, production scheduling.

### Overhead Variances

Overhead variance analysis is more complex because overhead includes both fixed and variable components:

**Variable Overhead Spending Variance:**
\`\`\`
= (Actual Variable OH Rate - Standard Variable OH Rate) × Actual Hours
\`\`\`

**Variable Overhead Efficiency Variance:**
\`\`\`
= (Actual Hours - Standard Hours Allowed) × Standard Variable OH Rate
\`\`\`

**Fixed Overhead Volume Variance:**
\`\`\`
= (Standard Hours Allowed - Budgeted Hours) × Standard Fixed OH Rate
\`\`\`

This variance arises because fixed costs are allocated based on expected volume. If actual production differs from expected, the variance reflects under- or over-absorption of fixed costs.

### Flexible Budgets

A **flexible budget** adjusts the original budget for the actual level of activity achieved. This separates volume effects from efficiency effects:

| | Static Budget (10,000 units) | Flexible Budget (9,000 units) | Actual (9,000 units) |
|---|---|---|---|
| Revenue | \\$500,000 | \\$450,000 | \\$441,000 |
| Variable costs | \\$300,000 | \\$270,000 | \\$279,000 |
| Fixed costs | \\$100,000 | \\$100,000 | \\$102,000 |
| Operating income | \\$100,000 | \\$80,000 | \\$60,000 |

The total variance (\\$40,000 U) decomposes into:
- Volume variance: \\$20,000 U (selling 9,000 instead of 10,000)
- Flexible budget variance: \\$20,000 U (price/efficiency differences at 9,000 units)

### Behavioral Considerations

Variance analysis can create dysfunctional behavior if misused. Merchant & Van der Stede (2017, *Management Control Systems*, Pearson) document that:
- Overemphasis on cost variances may discourage innovation and risk-taking
- Managers may game budgets (budgetary slack) to create favorable variances
- Focus on short-term variances may sacrifice long-term value

The most effective variance analysis systems focus on **significant and controllable** variances, using management by exception principles.

### Key Takeaway

Variance analysis transforms budgets from passive plans into active management tools. By decomposing total variances into price, quantity, and volume components, managers can pinpoint the source of performance deviations and take targeted corrective action.

*References: Horngren, Datar & Rajan (2018), Cost Accounting (Pearson); Merchant & Van der Stede (2017), Management Control Systems (Pearson); Drury (2018), Management and Cost Accounting (Cengage).*`,
      starterCode: `# Variance Analysis Calculator

def materials_variances(
    actual_price: float,
    standard_price: float,
    actual_qty: float,
    standard_qty_allowed: float
) -> dict:
    """
    Calculate direct materials price and quantity variances.

    Returns dict with:
    - price_variance: (AP - SP) * AQ
    - quantity_variance: (AQ - SQ) * SP
    - total_variance: sum of both
    - price_label: "F" or "U"
    - quantity_label: "F" or "U"
    """
    # TODO: Calculate materials price variance
    price_variance = 0

    # TODO: Calculate materials quantity variance
    quantity_variance = 0

    # TODO: Determine favorable/unfavorable labels
    price_label = ""
    quantity_label = ""

    total_variance = price_variance + quantity_variance

    return {
        "price_variance": round(price_variance, 2),
        "price_label": price_label,
        "quantity_variance": round(quantity_variance, 2),
        "quantity_label": quantity_label,
        "total_variance": round(total_variance, 2),
    }


# Test: Standard price $5/unit, Actual price $5.30/unit
# Standard qty allowed: 10,000 units, Actual qty used: 10,500
result = materials_variances(
    actual_price=5.30,
    standard_price=5.00,
    actual_qty=10500,
    standard_qty_allowed=10000
)
print(result)
# Expected: price_variance=3150 U, quantity_variance=2500 U, total=5650`,
      solutionCode: `# Variance Analysis Calculator

def materials_variances(
    actual_price: float,
    standard_price: float,
    actual_qty: float,
    standard_qty_allowed: float
) -> dict:
    """
    Calculate direct materials price and quantity variances.

    Returns dict with:
    - price_variance: (AP - SP) * AQ
    - quantity_variance: (AQ - SQ) * SP
    - total_variance: sum of both
    - price_label: "F" or "U"
    - quantity_label: "F" or "U"
    """
    # Calculate materials price variance
    price_variance = (actual_price - standard_price) * actual_qty

    # Calculate materials quantity variance
    quantity_variance = (actual_qty - standard_qty_allowed) * standard_price

    # Determine favorable/unfavorable labels
    # Positive variance = unfavorable for costs (actual > standard)
    price_label = "U" if price_variance > 0 else "F"
    quantity_label = "U" if quantity_variance > 0 else "F"

    total_variance = price_variance + quantity_variance

    return {
        "price_variance": round(price_variance, 2),
        "price_label": price_label,
        "quantity_variance": round(quantity_variance, 2),
        "quantity_label": quantity_label,
        "total_variance": round(total_variance, 2),
    }


# Test: Standard price $5/unit, Actual price $5.30/unit
# Standard qty allowed: 10,000 units, Actual qty used: 10,500
result = materials_variances(
    actual_price=5.30,
    standard_price=5.00,
    actual_qty=10500,
    standard_qty_allowed=10000
)
print(result)`,
    },
  ],
};

import { Module } from "../types";

export const scenariosModule: Module = {
  id: "fm-scenarios",
  title: "Scenario & Sensitivity Analysis",
  description: "Master advanced analytical techniques — sensitivity tables, scenario analysis, Monte Carlo simulation, and presenting results.",
  lessons: [
    {
      id: "fm-scenarios-sensitivity",
      slug: "sensitivity-tables",
      title: "Building Sensitivity Tables",
      content: `## Building Sensitivity Tables

Sensitivity tables systematically show how a model's output changes when you vary one or two key inputs. They transform a single-point estimate into a range of outcomes, communicating the uncertainty inherent in any financial model. Sensitivity tables are the most common analytical output in investment banking and corporate finance presentations.

### One-Variable Sensitivity Table

A one-variable table varies a single input and shows the resulting impact on one or more outputs:

**Revenue Growth Rate vs. Enterprise Value:**

| Revenue Growth | Enterprise Value | Implied Share Price |
|---------------|-----------------|-------------------|
| 3% | 4,200 | $38.50 |
| 5% | 4,800 | $44.00 |
| 7% | 5,500 | $50.50 |
| 9% | 6,300 | $57.80 |
| 11% | 7,200 | $66.10 |

This tells you: for every 2% change in growth, enterprise value changes by approximately 600-900 million — a meaningful sensitivity.

### Two-Variable Sensitivity Table

The standard format in investment banking. Varies two inputs simultaneously with the output in the matrix:

**WACC vs. Terminal Growth Rate => Enterprise Value (millions)**

| | g = 1.5% | g = 2.0% | g = 2.5% | g = 3.0% | g = 3.5% |
|--|----------|----------|----------|----------|----------|
| **WACC 8.0%** | 6,250 | 6,890 | 7,680 | 8,680 | 9,980 |
| **WACC 8.5%** | 5,680 | 6,200 | 6,840 | 7,630 | 8,640 |
| **WACC 9.0%** | 5,200 | 5,630 | 6,150 | 6,790 | 7,590 |
| **WACC 9.5%** | 4,790 | 5,150 | 5,580 | 6,100 | 6,740 |
| **WACC 10.0%** | 4,430 | 4,740 | 5,100 | 5,530 | 6,050 |

The base case (highlighted) might be WACC 9.0% and g = 2.5%, yielding 6,150 million. But the table shows the range spans from 4,430 to 9,980 — a factor of 2.3x.

### Building Tables in a Spreadsheet

**Using Excel's Data Table feature:**
1. Set up the two-variable axes (WACC values in a row, growth rates in a column)
2. In the corner cell, place a formula that links to the output (e.g., =Enterprise_Value)
3. Select the entire table range
4. Go to Data > What-If Analysis > Data Table
5. Specify the row input cell (WACC) and column input cell (growth rate)
6. Excel automatically calculates the output for every combination

**Using Python:**
Create a nested loop that sets each combination of inputs, recalculates the model, and stores the output. This is more flexible and avoids Excel's data table recalculation performance issues.

### Choosing the Right Variables to Sensitize

Select variables that meet two criteria: (1) they are uncertain (you are not confident in the assumption) and (2) they are impactful (small changes produce meaningful output changes).

**High-impact, high-uncertainty (always sensitize):**
- WACC / discount rate
- Terminal growth rate / exit multiple
- Revenue growth rate
- EBITDA margin

**High-impact, lower-uncertainty (sensitize if relevant):**
- Entry/exit multiple (for LBOs)
- Leverage level
- Tax rate (if regulatory changes are possible)

**Low-impact (usually not worth sensitizing):**
- Working capital days (small impact on DCF)
- Depreciation method (minimal effect)
- D&A as a percentage of revenue (unless it is extreme)

### Formatting Best Practices

1. **Highlight the base case**: Bold, box, or shade the cell representing your primary assumptions
2. **Use symmetric ranges**: Center the base case in the table (equal steps above and below)
3. **Include units and labels**: Make sure the reader knows what each axis represents
4. **Conditional formatting**: Green for values above a threshold, red below (e.g., target share price vs. current price)
5. **Show both absolute and percentage changes**: Some readers prefer dollar values, others prefer percentage change from base case

### Key Takeaway

Sensitivity tables are the primary tool for communicating model uncertainty. They show decision-makers not just what you think the answer is, but how confident they should be in that answer and which assumptions matter most. Every financial model should include at least two sensitivity tables — one for the primary valuation output and one for the most decision-relevant operational variables.`,
    },
    {
      id: "fm-scenarios-scenario-analysis",
      slug: "scenario-analysis",
      title: "Scenario Analysis",
      content: `## Scenario Analysis

While sensitivity tables vary inputs mechanically (one or two at a time), scenario analysis tells a coherent story. Each scenario represents a plausible future — a consistent set of assumptions about how the business, market, and economy might evolve. Scenarios are more realistic than sensitivity tables because they link assumptions logically rather than varying them independently.

### Why Scenarios Matter

In a sensitivity table, you might see a cell where revenue grows at 15% while EBITDA margin is 35%. But in reality, if revenue is growing at 15%, the company is probably investing heavily in sales and marketing, which might compress margins to 28%. Sensitivity tables do not capture these correlations — scenarios do.

### Standard Three-Scenario Framework

| Assumption | Bear Case | Base Case | Bull Case |
|-----------|-----------|-----------|-----------|
| Revenue growth | 3% | 7% | 12% |
| EBITDA margin | 22% | 26% | 29% |
| CapEx % revenue | 8% | 6% | 5% |
| WACC | 11% | 9.5% | 8.5% |
| Exit multiple | 8x | 10x | 12x |
| Probability weight | 25% | 50% | 25% |

**Bear case narrative:** "The macro economy slows, competitive pressure intensifies, and the company loses market share. Margins compress as pricing power weakens. The market de-rates the company."

**Base case narrative:** "The company executes its business plan, growing in line with the market. Margins are stable with modest operating leverage. Market conditions are normal."

**Bull case narrative:** "New product launches exceed expectations, the company gains market share, and operating leverage drives margin expansion. Strong market conditions support premium valuations."

### Building Scenarios in the Model

**Method 1: Scenario toggle**
Create a single cell that switches between scenarios (1 = Bear, 2 = Base, 3 = Bull). Use CHOOSE or INDEX functions to pull the appropriate assumptions:

\`\`\`
Revenue Growth = CHOOSE(Scenario_Toggle, 3%, 7%, 12%)
\`\`\`

This approach is clean and allows you to flip between scenarios with a single cell change.

**Method 2: Parallel columns**
Build three complete sets of projections side by side:

| Item | Bear | Base | Bull |
|------|------|------|------|
| Year 5 Revenue | 1,159 | 1,403 | 1,762 |
| Year 5 EBITDA | 255 | 365 | 511 |
| Enterprise Value | 2,040 | 3,650 | 6,132 |
| Share Price | $28 | $52 | $88 |

This approach makes comparison easy but takes more space.

### Probability-Weighted Valuation

Assign probabilities to each scenario and calculate an expected value:

\`\`\`
Expected EV = (P_bear x EV_bear) + (P_base x EV_base) + (P_bull x EV_bull)
            = (25% x 2,040) + (50% x 3,650) + (25% x 6,132)
            = 510 + 1,825 + 1,533
            = 3,868
\`\`\`

The probability-weighted value (3,868) is higher than the base case (3,650) because the bull case upside (from 3,650 to 6,132) is larger than the bear case downside (from 3,650 to 2,040). This asymmetry is common and important to capture.

### Five-Scenario Framework

For more granular analysis, use five scenarios:

| Scenario | Probability | Description |
|----------|-----------|-------------|
| Deep downside | 5-10% | Severe recession, major competitive disruption |
| Downside | 15-20% | Mild recession, execution challenges |
| Base case | 40-50% | Management plan, normal conditions |
| Upside | 15-20% | Strong execution, favorable conditions |
| Home run | 5-10% | Everything goes right, transformative outcome |

### Industry-Specific Scenarios

Different industries warrant different scenario dimensions:

**Technology/SaaS:** Customer growth vs. churn, expansion revenue, competition from incumbents
**Energy:** Oil price scenarios ($50/$70/$90 per barrel), regulatory changes, energy transition
**Retail:** Same-store sales growth, e-commerce penetration, consumer spending
**Healthcare:** Drug approval probability, pricing pressure, patent cliffs
**Real estate:** Occupancy rates, rent growth, interest rate environment

### Key Takeaway

Scenario analysis combines the rigor of financial modeling with the narrative power of strategic thinking. Each scenario tells a story about a plausible future, and the probability-weighted outcome captures the expected value across those futures. Use scenarios to complement sensitivity tables — tables show mechanical sensitivity, while scenarios show realistic, coherent outcomes that help decision-makers understand the range of possibilities.`,
    },
    {
      id: "fm-scenarios-monte-carlo",
      slug: "monte-carlo-simulation",
      title: "Monte Carlo Simulation",
      content: `## Monte Carlo Simulation

Monte Carlo simulation goes beyond traditional sensitivity and scenario analysis by running thousands of possible outcomes simultaneously. Instead of picking three scenarios (bear, base, bull) or varying two inputs at a time, Monte Carlo randomly samples from probability distributions for every uncertain input, generating a complete distribution of possible outcomes.

### The Concept

Traditional analysis asks: "What is the value if revenue grows at 7%?"
Monte Carlo asks: "What is the distribution of values if revenue growth could be anywhere from 2% to 12%, with 7% being most likely?"

The process:
1. Define probability distributions for each uncertain input
2. Randomly sample one value from each distribution
3. Calculate the model output using those sampled values
4. Repeat 10,000+ times
5. Analyze the distribution of outputs

### Setting Up Distributions

For each uncertain input, choose an appropriate probability distribution:

| Input | Distribution | Parameters | Rationale |
|-------|-------------|-----------|-----------|
| Revenue growth | Normal | Mean 7%, StDev 3% | Symmetric, most outcomes near the mean |
| EBITDA margin | Triangular | Min 20%, Mode 26%, Max 30% | Bounded, asymmetric |
| WACC | Uniform | Min 8%, Max 11% | Equal probability across range |
| Exit multiple | Normal | Mean 10x, StDev 1.5x | Symmetric, market-driven |
| Terminal growth | Triangular | Min 1.5%, Mode 2.5%, Max 3.5% | Bounded within economic limits |

**Common distribution types:**

| Distribution | Shape | Use When |
|-------------|-------|----------|
| **Normal** | Bell curve | Symmetric uncertainty, many possible values |
| **Triangular** | Triangle | You know the minimum, most likely, and maximum |
| **Uniform** | Flat | All values in a range are equally likely |
| **Lognormal** | Right-skewed | Variable cannot be negative (prices, multiples) |
| **Discrete** | Specific values | A few distinct scenarios (pass/fail, high/low) |

### Correlations Between Inputs

In reality, inputs are often correlated. If revenue growth is strong, margins may also be higher (operating leverage). Monte Carlo can model these correlations:

- Revenue growth and EBITDA margin: positive correlation (0.3-0.5)
- Revenue growth and CapEx: positive correlation (growth requires investment)
- WACC and exit multiple: negative correlation (higher risk = lower multiples)

Ignoring correlations can produce unrealistic output distributions (e.g., high growth with low margins simultaneously appearing too frequently).

### Interpreting Results

After running 10,000 simulations, analyze the output distribution:

**Summary statistics:**
- Mean (expected value): The average across all simulations
- Median (50th percentile): The middle outcome
- Standard deviation: The spread of outcomes
- 5th percentile: The value below which only 5% of outcomes fall (downside risk)
- 95th percentile: The value above which only 5% of outcomes fall (upside potential)

**Example output (Enterprise Value, millions):**
- Mean: 5,200
- Median: 5,050
- 5th percentile: 3,400
- 25th percentile: 4,300
- 75th percentile: 5,900
- 95th percentile: 7,600
- Probability of exceeding current EV (4,500): 68%

### Histogram Visualization

The output histogram shows the full distribution of possible outcomes. A symmetric distribution suggests balanced upside and downside. A right-skewed distribution (long right tail) suggests more upside potential. A left-skewed distribution (long left tail) suggests more downside risk.

### When to Use Monte Carlo

**Good candidates:**
- Complex models with many uncertain inputs
- Investments with asymmetric payoff profiles
- Situations where understanding the full distribution matters (risk management)
- Projects with option-like features (abandonment option, expansion option)

**Not necessary for:**
- Simple valuations where 3 scenarios capture the range
- Time-sensitive analyses where building the simulation takes too long
- Models where one or two variables dominate (sensitivity tables are sufficient)

### Practical Implementation

Monte Carlo is most practically implemented in Python:

\`\`\`
# Simplified Monte Carlo for DCF
import numpy as np

n_simulations = 10000
results = []

for _ in range(n_simulations):
    growth = np.random.normal(0.07, 0.03)
    margin = np.random.triangular(0.20, 0.26, 0.30)
    wacc = np.random.uniform(0.08, 0.11)
    exit_mult = np.random.normal(10, 1.5)

    # Calculate EV using sampled inputs
    ev = calculate_enterprise_value(growth, margin, wacc, exit_mult)
    results.append(ev)

# Analyze distribution
print(f"Mean EV: {np.mean(results):.0f}")
print(f"Median EV: {np.median(results):.0f}")
print(f"5th percentile: {np.percentile(results, 5):.0f}")
print(f"95th percentile: {np.percentile(results, 95):.0f}")
\`\`\`

### Key Takeaway

Monte Carlo simulation provides the most complete picture of model uncertainty. Instead of three discrete scenarios, it generates a full probability distribution of outcomes, revealing the likelihood of different results and the key risk factors. While it requires more setup than traditional analysis, it is invaluable for complex investments where understanding the full range of outcomes — not just the base case — is critical for decision-making.`,
    },
    {
      id: "fm-scenarios-tornado",
      slug: "tornado-charts",
      title: "Tornado Charts",
      content: `## Tornado Charts

A tornado chart (also called a tornado diagram or sensitivity waterfall) is a visual tool that ranks model inputs by their impact on the output. It immediately shows which assumptions matter most and which are relatively insignificant — helping you focus analytical effort on the variables that drive the most value.

### What a Tornado Chart Shows

The chart displays horizontal bars, one for each input variable, arranged from largest impact (top) to smallest impact (bottom). Each bar extends left (downside) and right (upside) from the base case value, showing the range of output when that single input is varied while all others are held constant.

\`\`\`
Enterprise Value (Base: 5,000M)

Revenue Growth          |<======[    5,000    ]============>|  3,800 - 6,400
Exit Multiple           |<=====[ 5,000 ]========>|          4,000 - 6,200
EBITDA Margin          |<====[ 5,000 ]======>|              4,200 - 5,900
WACC                    |<===[ 5,000 ]===>|                 4,400 - 5,700
Terminal Growth         |<==[5,000]==>|                     4,600 - 5,500
Working Capital Days    |=[5,000]=|                         4,900 - 5,100
                        ----+----+----+----+----+----+----
                       3,500  4,000 4,500 5,000 5,500 6,000 6,500
\`\`\`

### How to Build a Tornado Chart

**Step 1: Identify the key inputs**
List all uncertain assumptions in your model (typically 6-12 variables).

**Step 2: Define the range for each input**
For each variable, specify a low and high value:

| Variable | Low | Base | High |
|----------|-----|------|------|
| Revenue growth | 3% | 7% | 11% |
| Exit multiple | 8x | 10x | 12x |
| EBITDA margin | 22% | 26% | 30% |
| WACC | 11% | 9.5% | 8% |
| Terminal growth | 1.5% | 2.5% | 3.5% |
| NWC days | 50 | 40 | 30 |

**Step 3: Calculate the output for each input at its low and high values**
Hold all other inputs at their base case. For each variable, calculate the model output at the low value and the high value.

**Step 4: Calculate the range (spread)**
Range = High output - Low output

**Step 5: Sort by range (largest to smallest)**
The variable with the largest range goes at the top of the chart.

**Step 6: Create the chart**
Use a horizontal bar chart where each bar extends from the low-case output to the high-case output, centered around the base case.

### Interpreting the Tornado Chart

**Top variables (wide bars)**: These are the critical uncertainties. They deserve:
- The most analytical effort (deeper research, more granular modeling)
- Dedicated sensitivity tables
- Discussion in management presentations

**Bottom variables (narrow bars)**: These have minimal impact. They can be:
- Set at reasonable estimates without extensive analysis
- Excluded from sensitivity presentations
- Grouped together in discussions ("other assumptions")

### Tornado Chart vs. Sensitivity Table

| Feature | Tornado Chart | Sensitivity Table |
|---------|--------------|------------------|
| Variables shown | 6-12 simultaneously | 1-2 at a time |
| Purpose | Rank variables by importance | Show detailed output across a range |
| Visual impact | High — immediately shows what matters | Moderate — requires reading a table |
| Interaction effects | Not captured (one variable at a time) | Two-variable table captures some |
| Level of detail | Low (just high/low/base) | High (multiple points) |

Use tornado charts to identify which variables matter most, then build detailed sensitivity tables for the top 2-3 variables.

### Common Uses

1. **DCF valuation**: Which assumption drives the most value?
2. **LBO returns**: Is the deal more sensitive to entry price or operational improvement?
3. **Project finance**: Which cost or revenue item has the most impact on project viability?
4. **Drug development**: Which probability (clinical success, market size, pricing) matters most?

### Key Takeaway

Tornado charts answer the question every decision-maker asks: "What matters most?" By ranking variables by their impact, they focus attention on the assumptions that deserve the most scrutiny. They are the ideal tool for the first page of a sensitivity analysis section — they tell the reader where to look before diving into the detailed tables that follow.`,
    },
    {
      id: "fm-scenarios-presenting",
      slug: "presenting-results",
      title: "Presenting Model Results",
      content: `## Presenting Model Results

A financial model is only as valuable as the decisions it enables. The most sophisticated model in the world is useless if the decision-maker cannot understand or trust its conclusions. Presenting model results effectively requires translating technical analysis into clear, actionable insights that build confidence and drive decisions.

### The Presentation Framework

A complete model presentation follows this structure:

**1. Executive Summary (1 page)**
State the question, the methodology, and the answer upfront:
- "We analyzed [the company/transaction] using a DCF, comparable company analysis, and LBO framework."
- "Our analysis indicates a fair value range of X to Y."
- "We recommend [action] based on [key reasons]."

Decision-makers are busy. Put the conclusion first, then support it.

**2. Key Assumptions (1 page)**
Present the most important assumptions in a clean table:

| Assumption | Value | Source/Rationale |
|-----------|-------|-----------------|
| Revenue growth (Year 1-5) | 6-8% | Management guidance, historical trend |
| EBITDA margin (terminal) | 26% | In-line with peer median |
| WACC | 9.5% | CAPM-based, see appendix |
| Terminal growth rate | 2.5% | Long-term GDP growth |
| Exit EV/EBITDA multiple | 10x | Current comp median |

For each assumption, show the source. This builds credibility.

**3. Valuation Output (1-2 pages)**
Present the results using a football field chart (range from each methodology) and a summary table:

| Method | Low | Mid | High |
|--------|-----|-----|------|
| DCF (Perpetuity Growth) | $42 | $52 | $64 |
| DCF (Exit Multiple) | $44 | $54 | $66 |
| Trading Comps | $46 | $50 | $55 |
| Precedent Transactions | $50 | $58 | $66 |
| **Reference Range** | **$48** | **$54** | **$62** |

Current price: $45 (implied upside: 7-38%)

**4. Sensitivity Analysis (1-2 pages)**
Show the tornado chart (what matters most) followed by 2-3 detailed sensitivity tables for the key variables.

**5. Scenario Analysis (1 page)**
Present bear/base/bull with probability weights:

| Scenario | Probability | Value | Description |
|----------|-----------|-------|-------------|
| Bear | 25% | $38 | Recession, margin compression |
| Base | 50% | $54 | Management plan execution |
| Bull | 25% | $72 | Market share gains, margin expansion |
| **Expected** | | **$55** | Probability-weighted |

**6. Appendix**
Detailed model output, supporting data tables, comparable company detail, full financial statements. Available for reference but not presented unless asked.

### Communication Principles

**Lead with the "so what"**: Do not walk through every model tab. Present the conclusion and the key evidence supporting it. Details are for the appendix.

**Use ranges, not point estimates**: A single number implies false precision. A range communicates honest uncertainty and gives the audience a basis for judgment.

**Explain what drives the answer**: "The valuation is most sensitive to revenue growth and the exit multiple. If revenue grows 2% faster than our base case, the value increases by 15%."

**Acknowledge limitations**: "Our analysis does not capture potential disruption from new entrants" or "The terminal value represents 72% of total value, which increases sensitivity to long-term assumptions."

**Anticipate questions**: Before presenting, list the five most likely questions and prepare answers. Common ones include:
- "What if interest rates are 100bp higher?"
- "How does this compare to what the sell-side is saying?"
- "What is the downside scenario?"
- "How sensitive is this to the terminal assumption?"
- "What are you most uncertain about?"

### Formatting Guidelines

- Use consistent fonts, colors, and formatting throughout
- Label every chart axis and table header
- Include sources for all market data
- Use round numbers where precision is not meaningful (say "approximately 5 billion" not "5,023,456,789")
- Number every page for easy reference during discussion

### The One-Page Summary

If you could only show one page, it should contain:
1. The football field chart or summary table showing the valuation range
2. The 3-5 key assumptions with their sources
3. The recommended action and primary rationale
4. One line acknowledging the biggest risk

This "one-pager" is the most important output of any financial modeling exercise.

### Key Takeaway

Presenting model results is the final mile — where analytical rigor meets strategic communication. The best presentations are structured (conclusion first, evidence second, details in appendix), honest (ranges not point estimates, limitations acknowledged), and audience-appropriate (board-level summaries for boards, technical detail for analysts). The model itself is a means to an end; the presentation is what drives the decision.`,
    },
  ],
};

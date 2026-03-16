import { Module } from "../types";

export const valuationModule: Module = {
  id: "cf-valuation",
  title: "Valuation Methods",
  description:
    "Learn the three pillars of valuation — DCF analysis, comparable companies, and precedent transactions — used by Wall Street analysts every day.",
  lessons: [
    {
      id: "cf-dcf-analysis",
      slug: "dcf-analysis",
      title: "Discounted Cash Flow (DCF) Analysis",
      content: `## Discounted Cash Flow (DCF) Analysis

A **Discounted Cash Flow (DCF)** analysis values a company or project by projecting its future free cash flows and discounting them back to the present at the appropriate cost of capital. It is the most theoretically rigorous valuation method because it values a business based on what it fundamentally is: a machine that generates cash flows.

### The DCF Framework

\`\`\`
Enterprise Value = PV of Free Cash Flows during projection period
                 + PV of Terminal Value
\`\`\`

### Step-by-Step Process

**Step 1: Project Free Cash Flows (typically 5-10 years)**

Unlevered Free Cash Flow (UFCF) is the cash available to all capital providers (debt and equity):

\`\`\`
UFCF = EBIT x (1 - Tax Rate)
     + Depreciation & Amortization
     - Capital Expenditures
     - Change in Net Working Capital
\`\`\`

**Step 2: Calculate Terminal Value**

Since we cannot project cash flows forever, we use a terminal value to capture all cash flows beyond the projection period (covered in a later lesson).

**Step 3: Discount at WACC**

The Weighted Average Cost of Capital reflects the blended cost of debt and equity financing.

**Step 4: Sum to get Enterprise Value**

\`\`\`
Enterprise Value = Sum of [UFCFt / (1+WACC)^t] + Terminal Value / (1+WACC)^n
\`\`\`

### Real-World Example

Consider valuing a mid-size SaaS company with the following projections:

| Year | Revenue | EBIT | UFCF |
|------|---------|------|------|
| 1 | \$100M | \$20M | \$15M |
| 2 | \$120M | \$28M | \$21M |
| 3 | \$140M | \$35M | \$27M |
| 4 | \$155M | \$40M | \$31M |
| 5 | \$168M | \$44M | \$34M |

Assuming WACC = 11% and terminal value of \$500M at year 5:

\`\`\`
EV = 15/1.11 + 21/1.11^2 + 27/1.11^3 + 31/1.11^4 + 34/1.11^5 + 500/1.11^5
EV = 13.5 + 17.0 + 19.7 + 20.4 + 20.2 + 296.6
EV ≈ $387 million
\`\`\`

Notice that the terminal value accounts for **77%** of total enterprise value — this is typical. McKinsey reports that terminal value typically represents 60-85% of total DCF value, which is why getting the terminal value assumptions right is so critical (Source: Koller, T. et al., *Valuation*, 7th ed., McKinsey, 2020).

### Advantages of DCF

- **Intrinsic value** — based on fundamentals, not market sentiment
- **Flexible** — can model any cash flow pattern
- **Forces rigorous thinking** — requires explicit assumptions about growth, margins, and risk

### Limitations of DCF

- **Highly sensitive to assumptions** — small changes in growth rate or discount rate produce large swings in value
- **Terminal value dominance** — most of the value comes from uncertain long-term projections
- **GIGO** — "garbage in, garbage out" applies powerfully here

Aswath Damodaran notes: "A DCF valuation is only as good as the story that underlies it. A DCF without a coherent narrative is just numbers in a spreadsheet" (Source: Damodaran, *Narrative and Numbers*, Columbia Business School Press, 2017).

### Key Takeaway

DCF is the foundational valuation methodology. While it requires many assumptions, it forces analysts to think explicitly about what drives a company's value — revenue growth, margin expansion, capital efficiency, and risk. Every other valuation method is ultimately a shortcut for DCF.

**Sources:** Koller, T. et al., *Valuation* (McKinsey, 7th ed., 2020); Damodaran, A. *Narrative and Numbers* (2017); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 9.`,
      starterCode: `# Simple DCF Model
# Build a basic Discounted Cash Flow valuation

def dcf_valuation(free_cash_flows, wacc, terminal_value, terminal_year):
    """
    Calculate enterprise value using DCF.

    Parameters:
    - free_cash_flows: list of projected UFCFs [Year1, Year2, ..., YearN]
    - wacc: weighted average cost of capital (e.g., 0.11 for 11%)
    - terminal_value: terminal value at end of projection period
    - terminal_year: the year number for terminal value (e.g., 5)

    Returns: dict with enterprise_value, pv_of_fcfs, pv_of_terminal
    """
    # TODO: Calculate PV of each projected free cash flow
    pv_fcfs = []

    # TODO: Calculate PV of terminal value
    pv_terminal = 0

    # TODO: Sum everything for enterprise value
    enterprise_value = 0

    return {
        "enterprise_value": enterprise_value,
        "pv_of_fcfs": sum(pv_fcfs),
        "pv_of_terminal": pv_terminal,
        "terminal_pct": 0  # What % of EV comes from terminal value?
    }


# Test with SaaS company example
fcfs = [15_000_000, 21_000_000, 27_000_000, 31_000_000, 34_000_000]
result = dcf_valuation(fcfs, wacc=0.11, terminal_value=500_000_000, terminal_year=5)

print(f"Enterprise Value: \${result['enterprise_value']:,.0f}")
print(f"PV of FCFs: \${result['pv_of_fcfs']:,.0f}")
print(f"PV of Terminal: \${result['pv_of_terminal']:,.0f}")
print(f"Terminal Value %: {result['terminal_pct']:.1%}")
`,
      solutionCode: `# Simple DCF Model - Solution

def dcf_valuation(free_cash_flows, wacc, terminal_value, terminal_year):
    """
    Calculate enterprise value using DCF.
    """
    # Calculate PV of each projected free cash flow
    pv_fcfs = []
    for t, fcf in enumerate(free_cash_flows, start=1):
        pv = fcf / (1 + wacc) ** t
        pv_fcfs.append(pv)

    # Calculate PV of terminal value
    pv_terminal = terminal_value / (1 + wacc) ** terminal_year

    # Sum everything for enterprise value
    enterprise_value = sum(pv_fcfs) + pv_terminal

    return {
        "enterprise_value": enterprise_value,
        "pv_of_fcfs": sum(pv_fcfs),
        "pv_of_terminal": pv_terminal,
        "terminal_pct": pv_terminal / enterprise_value
    }


# Test with SaaS company example
fcfs = [15_000_000, 21_000_000, 27_000_000, 31_000_000, 34_000_000]
result = dcf_valuation(fcfs, wacc=0.11, terminal_value=500_000_000, terminal_year=5)

print(f"Enterprise Value: \${result['enterprise_value']:,.0f}")
print(f"PV of FCFs: \${result['pv_of_fcfs']:,.0f}")
print(f"PV of Terminal: \${result['pv_of_terminal']:,.0f}")
print(f"Terminal Value %: {result['terminal_pct']:.1%}")
`,
    },
    {
      id: "cf-comparable-company",
      slug: "comparable-company-analysis",
      title: "Comparable Company Analysis (Comps)",
      content: `## Comparable Company Analysis (Comps)

**Comparable company analysis** (often called "trading comps" or just "comps") values a company by comparing it to similar publicly traded companies using valuation multiples. It is the most commonly used valuation method on Wall Street because it is fast, market-based, and intuitive.

### The Logic

If Company A is similar to Company B in size, growth, margins, and risk, and Company B trades at 10x EBITDA, then Company A should also be worth approximately 10x its EBITDA.

### Step-by-Step Process

**Step 1: Select comparable companies**

Choose 5-15 companies that are similar in:
- Industry and business model
- Size (revenue or market cap)
- Growth rate
- Profitability (margins)
- Geographic exposure

**Step 2: Gather financial data**

For each comparable company, collect:
- Market cap, enterprise value
- Revenue, EBITDA, EBIT, net income
- Growth rates

**Step 3: Calculate multiples**

| Multiple | Formula | Best For |
|----------|---------|----------|
| EV/EBITDA | Enterprise Value / EBITDA | Most common; capital-structure neutral |
| EV/Revenue | Enterprise Value / Revenue | High-growth or unprofitable companies |
| P/E | Price / Earnings per share | Mature, profitable companies |
| P/B | Price / Book Value | Financial institutions |
| EV/EBIT | Enterprise Value / EBIT | Capital-intensive businesses |

**Step 4: Apply multiples to target**

Multiply the target's financial metric by the peer group's median or mean multiple.

### Real-World Example: Valuing a Cloud Software Company

Suppose you are valuing CloudCo, which has \$200M revenue and \$50M EBITDA. You identify five comparable companies:

| Company | EV/Revenue | EV/EBITDA |
|---------|-----------|-----------|
| Comp A | 8.5x | 28.0x |
| Comp B | 7.2x | 24.5x |
| Comp C | 9.1x | 32.0x |
| Comp D | 6.8x | 22.0x |
| Comp E | 8.0x | 26.5x |
| **Median** | **8.0x** | **26.5x** |

Applying the median multiples to CloudCo:
- EV/Revenue: 8.0x x \$200M = **\$1.6 billion**
- EV/EBITDA: 26.5x x \$50M = **\$1.325 billion**

The implied enterprise value range is **\$1.3-1.6 billion**.

### Why Use the Median?

The **median** is preferred over the mean because it is less affected by outliers. If one comparable trades at 50x EBITDA due to a pending acquisition, the median filters this out while the mean would be skewed upward (Source: Rosenbaum, J. & Pearl, J. *Investment Banking*, 3rd ed., Wiley, 2020).

### Advantages

- **Market-based** — reflects current investor sentiment and market conditions
- **Fast** — can be completed in hours vs. days for a DCF
- **Intuitive** — easy for management and boards to understand
- **Reality check** — provides a sanity check on DCF results

### Limitations

- **Assumes market is efficient** — if the entire sector is overvalued, your comps-based value will be too
- **No two companies are identical** — differences in growth, margins, or risk can make comparisons misleading
- **Circular reasoning** — if everyone values companies using comps, prices reflect relative, not absolute, value

### Key Takeaway

Comps provide a market-based reality check that complements the intrinsic value from a DCF. In practice, investment bankers almost always present both a DCF and comps analysis in their valuation work, using the overlap as the "valuation range."

**Sources:** Rosenbaum, J. & Pearl, J. *Investment Banking* (3rd ed., Wiley, 2020); Damodaran, A. "Relative Valuation" (NYU Stern, damodaran.com); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 9.`,
    },
    {
      id: "cf-precedent-transactions",
      slug: "precedent-transactions",
      title: "Precedent Transactions",
      content: `## Precedent Transactions Analysis

**Precedent transaction analysis** (also called "deal comps" or "transaction comps") values a company based on the multiples paid in prior M&A transactions involving similar companies. While trading comps show what the market values a company at today, precedent transactions show what **acquirers have actually paid** for similar businesses.

### Why Precedent Transactions Matter

Acquisition prices typically include a **control premium** — the extra amount an acquirer pays above the public market price to gain control of the target. This premium reflects:

- The value of synergies (cost savings, revenue growth)
- The right to make strategic and operational changes
- Competitive dynamics in the bidding process

The average control premium in U.S. M&A transactions has historically ranged from **20-40%** above the unaffected stock price (Source: FactSet Mergerstat Review, 2023).

### Step-by-Step Process

**Step 1: Identify relevant transactions**

Search for M&A deals in the same or adjacent industry over the past 3-5 years. Databases used include:
- Capital IQ / S&P Global
- Bloomberg Terminal
- FactSet
- Refinitiv (formerly Thomson Reuters)

**Step 2: Gather deal details**

For each transaction:
- Buyer and target names
- Transaction date
- Enterprise value paid
- Key financial metrics (revenue, EBITDA) of the target at the time

**Step 3: Calculate transaction multiples**

Same multiples as comps (EV/EBITDA, EV/Revenue, P/E), but based on the **price paid in the deal**, not the public trading price.

**Step 4: Apply to your target**

### Example: Valuing a Healthcare IT Company

You are advising on the potential sale of HealthTech Inc. (\$80M revenue, \$20M EBITDA). Relevant precedent transactions:

| Transaction | Date | EV/Revenue | EV/EBITDA |
|------------|------|-----------|-----------|
| Cerner acquired by Oracle | 2022 | 6.8x | 23.5x |
| Medidata acquired by Dassault | 2019 | 9.2x | 40.0x |
| Athenahealth acquired by Veritas | 2019 | 5.5x | 19.0x |
| Allscripts acquired by N. Harris | 2022 | 3.2x | 12.5x |
| Change Healthcare by Optum | 2022 | 4.8x | 16.0x |
| **Median** | | **5.5x** | **19.0x** |

Applying to HealthTech Inc.:
- EV/Revenue: 5.5x x \$80M = **\$440M**
- EV/EBITDA: 19.0x x \$20M = **\$380M**

Implied enterprise value: **\$380-440M**

### Adjustments to Consider

1. **Time decay** — a deal from 5 years ago may not reflect current market conditions. Weight recent transactions more heavily.
2. **Market conditions** — deals done in boom times command higher multiples than deals done in downturns.
3. **Strategic vs. financial buyers** — strategic buyers (corporations) typically pay more than financial buyers (private equity) due to synergy expectations.
4. **Deal context** — hostile takeovers may include a higher premium than friendly deals.

### Advantages

- **Reflects real prices paid** — not theoretical; actual money changed hands
- **Includes control premium** — useful when advising on a sale
- **Hard to argue against** — "Company X paid 20x EBITDA for a similar business last year" is a powerful negotiating data point

### Limitations

- **Stale data** — market conditions change; old deals may be irrelevant
- **Limited universe** — may be few comparable transactions in niche industries
- **Information asymmetry** — deal-specific factors (bidding war, distress sale) may distort multiples
- **Survivorship bias** — you only see completed deals, not failed negotiations

### Key Takeaway

Precedent transactions are particularly valuable in M&A advisory because they answer the most practical question: "What have buyers actually paid for businesses like this?" Used alongside trading comps and DCF, they form the third leg of the valuation "tripod" used on Wall Street.

**Sources:** Rosenbaum, J. & Pearl, J. *Investment Banking* (3rd ed., Wiley, 2020); FactSet Mergerstat Review (2023); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 28.`,
    },
    {
      id: "cf-ev-vs-equity",
      slug: "enterprise-value-vs-equity-value",
      title: "Enterprise Value vs. Equity Value",
      content: `## Enterprise Value vs. Equity Value

Understanding the difference between **Enterprise Value (EV)** and **Equity Value** is one of the most important — and most frequently tested — concepts in corporate finance and investment banking.

### Equity Value (Market Capitalization)

**Equity Value** = Share Price x Shares Outstanding

This is the market value of the company's equity — what it would cost to buy all the shares. It is also called **market capitalization** or "market cap."

Example: If Apple has 15.5 billion shares trading at \$190, its equity value is:
\`\`\`
Equity Value = 15.5B x $190 = $2.945 trillion
\`\`\`

### Enterprise Value

**Enterprise Value** = Equity Value + Total Debt - Cash & Cash Equivalents + Preferred Stock + Minority Interest

Enterprise value represents the **total value of the business** — what it would cost to acquire the entire company, paying off its debt and pocketing its cash.

Think of it like buying a house:
- **Equity value** = down payment (what you, the equity owner, pay)
- **Enterprise value** = the total house price (down payment + mortgage)
- **Cash** = finding money under the couch cushions (reduces your effective cost)

### The Bridge Between EV and Equity Value

\`\`\`
Enterprise Value
  - Net Debt (Total Debt - Cash)
  - Preferred Stock
  - Minority Interest
  ─────────────────────────
  = Equity Value

  Equity Value / Shares Outstanding = Implied Share Price
\`\`\`

### Why This Matters for Multiples

The critical rule is: **match the numerator and denominator**.

| Multiple | Numerator | Denominator | Why? |
|----------|-----------|-------------|------|
| EV/EBITDA | Enterprise Value | EBITDA | EBITDA is available to all capital providers |
| EV/Revenue | Enterprise Value | Revenue | Revenue is before any payments to capital providers |
| P/E | Equity Value (Price) | Earnings (Net Income) | Net income is after debt payments — belongs to equity |
| P/B | Equity Value (Price) | Book Value of Equity | Book equity belongs to shareholders |

**Never** pair EV with net income or equity value with EBITDA. This is the most common mistake in valuation, and investment banking interviewers will test you on it.

### Real-World Example: The Twitter Acquisition

When Elon Musk acquired Twitter in 2022:

- **Equity Value** paid: \$44 billion (\$54.20/share x ~812M shares)
- Twitter had ~\$5.2 billion in debt
- Twitter had ~\$6.3 billion in cash

\`\`\`
Enterprise Value = $44B + $5.2B - $6.3B = $42.9 billion
\`\`\`

The enterprise value was actually lower than the equity value because Twitter held significant cash. In acquiring the equity, Musk also assumed the debt but gained the cash.

(Source: Twitter/X Corp merger filing, SEC, 2022)

### Diluted Shares and Equity Value

When calculating equity value, use **diluted shares outstanding** — which includes:
- Basic shares outstanding
- In-the-money stock options (using the treasury stock method)
- Restricted stock units (RSUs)
- Convertible securities

As of 2023, tech companies like Meta and Amazon had significant differences between basic and diluted share counts due to extensive stock-based compensation programs (Source: Company 10-K filings, SEC.gov).

### Negative Enterprise Value

Occasionally, a company's cash exceeds its equity value plus debt. This produces a **negative enterprise value** — meaning the market is implying the company's operating business is worth less than zero. This can signal deep distress or, sometimes, a deep value opportunity.

### Key Takeaway

Enterprise value measures the value of the entire business; equity value measures only the shareholders' claim. Every valuation analyst must be able to bridge between the two and match the correct value measure with the appropriate financial metric. This concept is foundational for all valuation work.

**Sources:** Rosenbaum, J. & Pearl, J. *Investment Banking* (3rd ed., Wiley, 2020); Damodaran, A. "Enterprise Value" (damodaran.com); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 9.`,
    },
    {
      id: "cf-terminal-value",
      slug: "terminal-value",
      title: "Terminal Value",
      content: `## Terminal Value: Gordon Growth Model & Exit Multiple

**Terminal value (TV)** captures the value of all cash flows beyond the explicit projection period in a DCF. Since we cannot forecast individual cash flows forever, terminal value provides a principled way to estimate the remaining value of the business.

### Why Terminal Value Matters

As noted earlier, terminal value typically represents **60-85% of total enterprise value** in a DCF. This makes the terminal value calculation the single most important — and most debated — assumption in any DCF model.

### Method 1: Gordon Growth Model (Perpetuity Growth Method)

This method assumes free cash flows grow at a constant rate forever after the projection period.

\`\`\`
Terminal Value = FCF(n+1) / (WACC - g)
              = FCF(n) x (1 + g) / (WACC - g)
\`\`\`

Where:
- FCF(n) = free cash flow in the last projected year
- g = perpetual growth rate (typically 2-3%)
- WACC = weighted average cost of capital

**Example:**
- Final year FCF: \$34 million
- WACC: 11%
- Perpetual growth rate: 2.5%

\`\`\`
TV = 34M x 1.025 / (0.11 - 0.025) = 34.85M / 0.085 = $410 million
\`\`\`

### Choosing the Growth Rate (g)

The perpetual growth rate should not exceed the long-term GDP growth rate of the economy. Why? If a company grows faster than the economy forever, it will eventually become larger than the entire economy — which is impossible.

- **U.S. nominal GDP growth** has averaged ~4-5% (2-3% real + 2% inflation)
- **Conservative choice**: 2-3% for most companies
- **Aggressive choice**: 3-4% only for companies in growing industries

McKinsey recommends using a growth rate between **2% and 5%**, noting that "the most common error in terminal value estimation is using a growth rate that is too high" (Source: Koller, T. et al., *Valuation*, 7th ed., 2020).

### Method 2: Exit Multiple Method

This method assumes the business is sold at the end of the projection period at a market-based multiple.

\`\`\`
Terminal Value = EBITDA(n) x Exit Multiple
\`\`\`

**Example:**
- Final year EBITDA: \$44 million
- Exit EV/EBITDA multiple: 12.0x

\`\`\`
TV = 44M x 12.0 = $528 million
\`\`\`

### Which Method to Use?

| Factor | Gordon Growth | Exit Multiple |
|--------|--------------|---------------|
| Theoretical rigor | Higher (based on fundamentals) | Lower (market-based) |
| Ease of use | Moderate | Easy |
| Sensitivity | Very sensitive to g and WACC | Sensitive to multiple choice |
| Common usage | Academic, equity research | Investment banking |

**Best practice:** Calculate terminal value using **both methods** and present a range. If the two methods produce wildly different results, investigate why.

### Sensitivity Analysis

Because terminal value is so sensitive to assumptions, analysts always present a **sensitivity table** showing how enterprise value changes with different WACC and growth rate (or exit multiple) assumptions:

| | g = 2.0% | g = 2.5% | g = 3.0% |
|---|---------|---------|---------|
| WACC = 10% | \$407M | \$451M | \$507M |
| WACC = 11% | \$363M | \$397M | \$437M |
| WACC = 12% | \$328M | \$354M | \$385M |

The range from the lowest to highest value (\$328M to \$507M) illustrates why DCF results should always be presented as a range, not a point estimate.

### Common Mistakes

1. **Growth rate exceeding WACC** — produces a negative (nonsensical) terminal value
2. **Using a growth rate above GDP growth** — implies the company outgrows the economy forever
3. **Not normalizing final year cash flows** — if the last projected year has unusually high or low margins, the terminal value will be distorted
4. **Double-counting growth** — if you project 5 years of high growth and then apply a high-growth exit multiple, you are counting growth twice

### Key Takeaway

Terminal value is the most influential number in any DCF. Use both the Gordon Growth and Exit Multiple methods, apply reasonable assumptions (especially for the growth rate), and always present sensitivity tables. A well-constructed terminal value separates good financial analysis from bad.

**Sources:** Koller, T. et al., *Valuation* (McKinsey, 7th ed., 2020); Damodaran, A. *Investment Valuation* (3rd ed., Wiley, 2012); Berk & DeMarzo, *Corporate Finance* (5th ed., 2020), Ch. 9.`,
    },
  ],
};

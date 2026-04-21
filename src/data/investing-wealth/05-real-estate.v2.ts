import { Module } from "../types";

export const realEstateModule: Module = {
  id: "iw-real-estate",
  title: "Real Estate Basics",
  description: "Explore real estate as an investment -- from homeownership decisions to REITs and rental property analysis. Understand when real estate makes sense and when it does not. Resources: BiggerPockets, Investopedia, The Millionaire Real Estate Investor by Gary Keller.",
  lessons: [
    {
      id: "iw-real-estate-investing-overview",
      slug: "real-estate-investing-overview",
      title: "Real Estate as an Investment",
      content: `## Real Estate as an Investment

<!-- voice:key_insight insight="Real estate builds wealth through four mechanisms: appreciation, rental income, leverage, and tax advantages. No other asset class combines all four." -->

Real estate has created more millionaires than any other asset class, according to surveys by the National Association of Realtors and IRS wealth data. But real estate investing is also more complex, less liquid, and more management-intensive than stock investing. Let us separate the reality from the hype.

### The Four Wealth-Building Mechanisms

**1. Appreciation:** U.S. home prices have risen approximately 3.5-5% annually over the long term (Case-Shiller Index, 1987-2023). This is modest compared to stocks, but leverage amplifies it (more on this below).

**2. Rental Income:** A rental property generates monthly cash flow. A well-chosen property might produce a 5-8% cash-on-cash return annually -- income that arrives whether the stock market is up or down.

**3. Leverage:** When you buy a \\$300,000 property with a \\$60,000 down payment (20%), you control \\$300,000 in assets with \\$60,000. If the property appreciates 5% (\\$15,000), your return on invested capital is 25% (\\$15,000 / \\$60,000). Leverage magnifies returns -- and losses.

**4. Tax Advantages:** Real estate offers depreciation deductions, mortgage interest deductions, 1031 exchanges (defer capital gains by reinvesting), and preferential treatment of rental income.

### The Homeownership Question

For most Americans, their home is their largest asset. But is homeownership a good investment?

| Factor | Homeownership | Renting + Investing |
|--------|--------------|-------------------|
| Forced savings | Yes (mortgage builds equity) | Requires discipline |
| Appreciation | ~3.5-5% on leveraged amount | Market returns (~10%) on invested savings |
| Flexibility | Low (selling takes months) | High (lease ends, you move) |
| Hidden costs | Maintenance, taxes, insurance | Included in rent |
| Tax benefits | Mortgage interest deduction | Standard deduction often higher |

<!-- voice:section_check concept="real estate wealth mechanisms" -->

The honest answer: homeownership is not automatically better than renting. It depends on your local market, how long you plan to stay, purchase price vs rent ratios, and your ability to invest the difference.

**The 5% Rule** (popularized by financial analyst Ben Felix): Multiply the home's value by 5% to get the annual breakeven cost. If you can rent a comparable home for less than that, renting may be financially superior -- provided you invest the savings.

### REITs: Real Estate Without the Headaches

Real Estate Investment Trusts (REITs) let you invest in real estate without buying, managing, or maintaining property. REITs are companies that own income-producing real estate -- apartments, offices, hospitals, data centers, shopping malls -- and distribute at least 90% of taxable income as dividends.

**Types of REITs:**
- Residential (apartments, single-family)
- Commercial (offices, retail)
- Industrial (warehouses, logistics)
- Healthcare (hospitals, senior living)
- Data centers (rapidly growing)

REIT total returns have historically matched or slightly exceeded the S&P 500 over long periods, with higher dividend yields (typically 3-5%).

### Key Takeaway

Real estate is a powerful wealth-building tool, but it requires more capital, knowledge, and effort than index fund investing. For most people, a combination of homeownership (when the math works) plus REIT exposure through index funds is the optimal approach.

> "Real estate cannot be lost or stolen, nor can it be carried away. Managed with reasonable care, it is about the safest investment in the world." -- Franklin D. Roosevelt

*Resources: Case-Shiller Home Price Index, BiggerPockets Investing Guide, Vanguard Real Estate Index Fund (VNQ), Ben Felix "5% Rule" Analysis.*`,
    },
    {
      id: "iw-rental-property-analysis",
      slug: "rental-property-analysis",
      title: "Analyzing Rental Properties",
      content: `## Analyzing Rental Properties

<!-- voice:key_insight insight="Successful rental property investing is not about finding the cheapest house -- it is about running the numbers rigorously before you buy." -->

If you are considering buying a rental property, the single most important skill is financial analysis. A property that looks like a deal can become a money pit without disciplined number-crunching.

### The 1% Rule (Quick Screen)

A rental property's monthly rent should be at least 1% of its purchase price. A \\$200,000 property should rent for at least \\$2,000/month.

This is a rough screen, not a decision rule. Properties in high-cost markets rarely meet it; properties in lower-cost markets may exceed it. Use it to quickly filter out poor candidates.

### Cash-on-Cash Return

This is the most important metric for rental property investors:

\\\`\\\`\\\`
Cash-on-Cash Return = Annual Pre-Tax Cash Flow / Total Cash Invested
\\\`\\\`\\\`

**Example:**
- Purchase price: \\$250,000
- Down payment (25%): \\$62,500
- Closing costs: \\$7,500
- Total cash invested: \\$70,000
- Monthly rent: \\$2,200
- Monthly expenses (mortgage, taxes, insurance, maintenance, vacancy): \\$1,700
- Monthly cash flow: \\$500
- Annual cash flow: \\$6,000

Cash-on-Cash Return: \\$6,000 / \\$70,000 = **8.6%**

A good cash-on-cash return is generally 8-12%. Below 6% is usually not worth the effort and risk.

### The Full Expense Picture

New investors chronically underestimate expenses. A realistic expense budget includes:

| Expense | Typical Estimate |
|---------|-----------------|
| Mortgage (P&I) | Actual payment |
| Property taxes | 1-2% of property value/year |
| Insurance | 0.5-1% of property value/year |
| Maintenance/repairs | 1-2% of property value/year |
| Vacancy allowance | 5-8% of gross rent (\\$1,320-\\$2,112/year on \\$2,200/month) |
| Property management | 8-10% of gross rent (if you hire a manager) |
| Capital expenditures | 5-10% of rent (roof, HVAC, appliances) |

<!-- voice:section_check concept="rental property financial analysis" -->

### Cap Rate (Capitalization Rate)

Used to compare properties regardless of financing:

\\\`\\\`\\\`
Cap Rate = Net Operating Income / Property Value
\\\`\\\`\\\`

A higher cap rate means higher returns relative to price. Typical cap rates range from 4-10% depending on the market and property type.

### Common Mistakes

1. **Ignoring vacancy:** Even in hot markets, expect 5-8% vacancy. One bad month can erase several months of profit.
2. **Underestimating maintenance:** The "50% rule" (half of rent goes to expenses excluding mortgage) is a useful conservative estimate.
3. **Emotional buying:** Falling in love with a property instead of analyzing the numbers.
4. **Over-leveraging:** Using too much debt amplifies losses in downturns. The 2008 crisis destroyed overleveraged landlords.

### Key Takeaway

Rental property investing can produce excellent returns, but only when you run the numbers honestly. The spreadsheet does not lie -- trust it over your gut. If the numbers do not work, walk away. There will always be another property.

> "You make your money when you buy, not when you sell. The numbers must work on day one." -- Coach Morgan

*Resources: BiggerPockets Rental Property Calculator, Investopedia Cap Rate Guide, The Book on Rental Property Investing by Brandon Turner.*`,
    },
    {
      id: "iw-checkpoint-5",
      slug: "iw-checkpoint-5",
      title: "Checkpoint: Real Estate Basics",
      content: `## Module 5 Checkpoint

<!-- voice:section_check concept="real estate investing review" -->

Real estate investing requires rigorous analysis. Let us test your grasp of the fundamentals.

---

### Question 1 (Multiple Choice)

What are the four wealth-building mechanisms unique to real estate?

- A) Dividends, growth, splits, buybacks
- B) Appreciation, rental income, leverage, tax advantages
- C) Interest, principal, escrow, insurance
- D) Location, timing, negotiation, renovation

<details>
<summary>Answer</summary>

**B) Appreciation, rental income, leverage, and tax advantages.** No other asset class combines all four mechanisms. Stocks offer appreciation and dividends but not leverage or the same tax benefits. Bonds offer income but not appreciation or leverage.
</details>

---

### Question 2 (Short Answer)

Explain the 1% rule for rental properties and its limitations.

<details>
<summary>Sample Answer</summary>

The 1% rule states that a rental property's monthly rent should be at least 1% of its purchase price (e.g., a \\$200,000 property should rent for at least \\$2,000/month). It is a quick screening tool to filter out obviously poor deals. Its limitations: high-cost markets rarely meet this threshold, the rule ignores expenses, financing terms, and local conditions, and some profitable properties in appreciating markets may not meet the 1% rule but still generate strong total returns through appreciation.
</details>

---

### Question 3 (Multiple Choice)

What is a REIT?

- A) A type of mortgage with lower interest rates
- B) A company that owns income-producing real estate and distributes 90%+ of income as dividends
- C) A government program for first-time homebuyers
- D) A tax deduction for rental property owners

<details>
<summary>Answer</summary>

**B) A company that owns income-producing real estate and distributes at least 90% of taxable income as dividends.** REITs allow investors to gain real estate exposure without directly buying, managing, or maintaining property.
</details>

---

### Question 4 (Application)

You find a property for \\$300,000. Monthly rent is \\$2,500. Your total cash invested (down payment + closing costs) is \\$82,500. After all monthly expenses, your cash flow is \\$450/month. Calculate the cash-on-cash return. Is it a good deal?

<details>
<summary>Sample Answer</summary>

Annual cash flow: \\$450 x 12 = \\$5,400. Cash-on-cash return: \\$5,400 / \\$82,500 = 6.5%. This is below the 8-12% target range that most experienced investors seek. While not terrible, it may not justify the effort, risk, and illiquidity of direct property ownership. You would want to examine whether appreciation potential or tax benefits could make up the difference.
</details>

---

### Question 5 (Multiple Choice)

What is the biggest risk of using heavy leverage in real estate investing?

- A) You cannot deduct mortgage interest
- B) Banks will refuse to lend to you
- C) Losses are amplified just as much as gains
- D) Property taxes increase with leverage

<details>
<summary>Answer</summary>

**C) Losses are amplified just as much as gains.** Leverage is a double-edged sword. If you put 20% down and the property drops 20% in value, you have lost 100% of your equity. This is exactly what destroyed overleveraged investors in the 2008 housing crisis.
</details>

---

You have completed Module 5. Next: retirement planning -- the most important long-term investment decision most people will ever make.`,
    },
  ],
};

import { Module } from "../types";

export const savingInvestingModule: Module = {
  id: "pf-saving",
  title: "Saving & Investing",
  description: "Transition from saving to investing — learn about asset classes, index funds, dollar-cost averaging, and building a portfolio. Resources: Investopedia, Bogleheads Wiki, Khan Academy, A Random Walk Down Wall Street by Burton Malkiel.",
  lessons: [
    {
      id: "pf-savings-accounts-cds",
      slug: "savings-accounts-cds",
      title: "Savings Accounts & CDs",
      content: `## Savings Accounts & CDs

Before you invest, you need a solid savings foundation. Savings accounts and certificates of deposit (CDs) are the safest places to park money you cannot afford to lose. They serve different purposes than investments.

\`\`\`concept
{"title": "The Safety-Return Trade-off", "variant": "mental-model", "content": "Think of cash vehicles on a 2×2 grid:\\n\\n1. High safety + High liquidity → Savings account (low yield)\\n2. High safety + Lower liquidity → CD (slightly higher yield)\\n3. Lower safety + Variable liquidity → Investments (highest expected yield)\\n\\nYour job is to match the tool to the time horizon: seconds-to-months → savings, months-to-5-years → CDs, 5-years+ → investments."}
\`\`\`

### Savings Accounts

A savings account is a deposit account at a bank or credit union that pays interest on your balance. Your money is liquid — you can withdraw it anytime.

**Types of Savings Accounts:**

| Type | Typical APY (2024) | Features |
|------|-------------------|----------|
| Traditional (big bank) | 0.01-0.10% | Branch access, often low minimums |
| High-Yield (online) | 4.00-5.25% | No branches, FDIC insured, higher rates |
| Money Market Account | 3.50-5.00% | Check-writing, debit card, tiered rates |

\`\`\`compare
{"variant": "before-after", "before": {"label": "Traditional savings @ 0.05% APY", "code": "balance = 10_000\\nrate = 0.0005\\nyear_1 = balance * rate\\nprint(f\\"Year-1 interest: \\\\\${year_1:.2f}\\")  # \\\\$5.00"}, "after": {"label": "High-yield savings @ 5.00% APY", "code": "balance = 10_000\\nrate = 0.0500\\nyear_1 = balance * rate\\nprint(f\\"Year-1 interest: \\\\\${year_1:.2f}\\")  # \\\\$500.00"}}
\`\`\`

The difference between a traditional and high-yield savings account is staggering. On a \\$10,000 balance:
- Traditional (0.05% APY): \\$5/year in interest
- High-Yield (5.00% APY): \\$500/year in interest

**That is 100 times more** for the same FDIC-insured safety.

### FDIC Insurance

The Federal Deposit Insurance Corporation (FDIC) insures deposits up to **\\$250,000 per depositor, per bank, per ownership category**. This means even if the bank fails, your money is guaranteed by the U.S. government. Credit unions have equivalent coverage through the NCUA.

### Certificates of Deposit (CDs)

A CD locks your money for a fixed term (3 months to 5 years) in exchange for a guaranteed interest rate. The longer the term, the higher the rate — typically.

**Current CD Landscape (2024):**

| Term | Typical APY |
|------|------------|
| 3 months | 4.50-5.00% |
| 6 months | 4.75-5.25% |
| 1 year | 4.50-5.00% |
| 2 years | 4.00-4.50% |
| 5 years | 3.75-4.25% |

**Early withdrawal penalty:** If you withdraw before the term ends, you pay a penalty — typically 3-6 months of interest. This is the trade-off for the guaranteed rate.

### CD Laddering Strategy

A CD ladder lets you earn higher rates while maintaining periodic liquidity:

1. Divide \\$10,000 into five equal parts
2. Buy CDs of 1, 2, 3, 4, and 5-year terms (\\$2,000 each)
3. When the 1-year CD matures, reinvest it in a new 5-year CD
4. Now you have a CD maturing every year, plus you earn the higher 5-year rates

\`\`\`steps
{"title": "Build a 5-Year CD Ladder in 4 Steps", "steps": [{"title": "Step 1 – Split the cash", "content": "Divide \\\\$10 000 into five \\\\$2 000 chunks."}, {"title": "Step 2 – Buy five CDs", "content": "Open CDs with terms 1-y, 2-y, 3-y, 4-y, 5-y. Each chunk earns the corresponding APY."}, {"title": "Step 3 – Roll at maturity", "content": "When the 1-y CD matures, renew it into a new 5-y CD. Repeat annually."}, {"title": "Step 4 – Enjoy yearly liquidity", "content": "After year 1, one CD matures every 12 months, giving cash or reinvestment optionality."}]}
\`\`\`

This strategy balances the higher yields of long-term CDs with the flexibility of having money become available annually.

### Real-World Example: When to Use Which

**Emergency fund (\\$15,000):** High-yield savings account. You need instant access.

**Known expense in 6 months (vacation \\$3,000):** 6-month CD or HYSA. Lock in a rate if the CD pays more.

**Down payment in 2 years (\\$40,000):** CD ladder or HYSA. The money must be safe and available on your timeline.

**Retirement in 30 years:** NOT a savings account or CD. Inflation will erode your purchasing power. This money needs to be invested (covered in next lessons).

### Savings vs Investing: The Key Distinction

| Feature | Savings | Investing |
|---------|---------|-----------|
| Risk | None (FDIC insured) | Market risk |
| Returns | 0-5% | 7-10% historical average |
| Liquidity | Immediate | May take days; may lose value |
| Best for | Short-term goals, emergency fund | Long-term goals (5+ years) |
| Inflation impact | May lose purchasing power | Historically outpaces inflation |

### The Inflation Problem

With inflation averaging 3% historically, a savings account earning 2% actually **loses** 1% in purchasing power per year. \\$10,000 earning 2% grows to \\$10,200, but if prices rose 3%, you need \\$10,300 to buy the same goods. You are falling behind.

\`\`\`calculator
{"type": "compound-interest", "title": "Inflation vs Savings Growth", "inputs": [{"id": "p", "label": "Starting balance", "default": 10000, "min": 1000, "max": 100000, "prefix": "\\\\$"}, {"id": "r_save", "label": "Savings APY", "default": 2, "min": 0.01, "max": 10, "suffix": "%"}, {"id": "r_inf", "label": "Inflation rate", "default": 3, "min": 0.01, "max": 10, "suffix": "%"}, {"id": "t", "label": "Years", "default": 10, "min": 1, "max": 40, "suffix": " yrs"}]}
\`\`\`

This is why savings accounts are for short-term needs and investing is for long-term wealth building.

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["Use high-yield savings accounts (4-5% APY) for emergency funds and instant liquidity.", "CDs give guaranteed rates but lock your money—use a ladder to keep yearly access.", "FDIC/NCUA insurance protects up to \\\\$250k per depositor, per bank, per ownership category.", "Anything you need within 5 years belongs in savings/CDs; longer horizons belong in investments to beat inflation."]}
\`\`\``,
    },
    {
      id: "pf-intro-to-investing",
      slug: "intro-to-investing",
      title: "Introduction to Investing",
      content: `## Introduction to Investing

Investing is putting money to work with the expectation of earning a return over time. It is how ordinary people build wealth that savings alone cannot achieve. This lesson introduces the major asset classes and foundational concepts every investor needs.

### Why Invest?

The math is simple but powerful. Assume you save \\$500/month for 30 years:

| Strategy | Annual Return | Result After 30 Years |
|----------|-------------|---------------------|
| Under the mattress | 0% | \\$180,000 |
| Savings account | 2% | \\$244,692 |
| Bond portfolio | 5% | \\$416,129 |
| Stock market | 8% | \\$745,180 |
| Aggressive growth | 10% | \\$1,130,244 |

Same contribution, radically different outcomes. The difference is compounding returns.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "See Your Own 30-Year Potential",
  "inputs": [
    { "id": "p", "label": "Monthly Contribution", "default": 500, "min": 50, "max": 5000, "prefix": "$" },
    { "id": "r", "label": "Expected Annual Return", "default": 8, "min": 0, "max": 15, "suffix": "%" }
  ]
}
\`\`\`

### The Major Asset Classes

\`\`\`concept
{
  "title": "Asset Classes: The Four Food Groups of Investing",
  "variant": "mental-model",
  "content": "Think of asset classes like food groups for your financial health. Just as your body needs protein, carbs, fats, and vitamins, your portfolio needs different asset classes to grow strong and resilient. Each serves a different purpose: growth (stocks), stability (bonds), inflation protection (real estate), and liquidity (cash)."
}
\`\`\`

**Stocks (Equities):** Ownership shares in a company. When the company grows, your shares grow in value. Stocks also may pay **dividends** — a share of profits distributed to owners.

- Historical average return: 10% per year (S&P 500, before inflation)
- Risk: High short-term volatility; stocks can drop 30-50% in a crash
- Best for: Long-term growth (10+ year horizon)

**Bonds (Fixed Income):** Loans you make to governments or corporations. They pay regular interest and return your principal at maturity.

- Historical average return: 4-6% per year
- Risk: Lower than stocks, but sensitive to interest rate changes
- Best for: Stability, income, diversification

**Real Estate:** Property purchased for rental income, appreciation, or both.

- Historical average return: 8-12% (including rental income)
- Risk: Illiquid, high entry cost, management burden
- Best for: Diversification, passive income, inflation hedge

**Cash & Cash Equivalents:** Savings accounts, CDs, money market funds, Treasury bills.

- Historical average return: 1-3% (currently higher due to rate environment)
- Risk: Essentially none
- Best for: Short-term needs, emergency fund

### Stocks: A Closer Look

When you buy a share of Apple stock, you own a tiny piece of Apple Inc. If Apple earns more profit, launches successful products, and grows, your share becomes more valuable. You can profit in two ways:

1. **Capital appreciation**: The stock price goes up and you sell for more than you paid
2. **Dividends**: The company pays you a portion of its profits (typically quarterly)

### Bonds: A Closer Look

A bond is essentially an IOU. The U.S. government issues Treasury bonds, considered the safest investment in the world. Corporations issue bonds too, at higher interest rates because they carry more risk.

**Key bond terms:**
- **Face value (par):** The amount repaid at maturity (typically \\$1,000)
- **Coupon rate:** The annual interest rate paid
- **Maturity date:** When the principal is returned
- **Yield:** The effective return based on the price you pay

\`\`\`quiz
{
  "title": "Asset Class Check-In",
  "questions": [
    {
      "question": "Which asset class has historically provided the highest long-term returns?",
      "options": ["Cash equivalents", "Bonds", "Stocks", "Real estate"],
      "answer": 2,
      "explanation": "Stocks have historically provided the highest long-term returns, averaging about 10% annually for the S&P 500, though with higher volatility."
    },
    {
      "question": "What is the primary purpose of bonds in a portfolio?",
      "options": ["Maximum growth", "Stability and income", "Beating inflation", "Tax advantages"],
      "answer": 1,
      "explanation": "Bonds primarily provide stability and income through regular interest payments, making them less volatile than stocks."
    },
    {
      "question": "Which statement about real estate investing is most accurate?",
      "options": ["It's highly liquid", "It requires low initial capital", "It can provide rental income", "It never loses value"],
      "answer": 2,
      "explanation": "Real estate can generate rental income in addition to potential appreciation, though it requires significant capital and is illiquid."
    }
  ]
}
\`\`\`

### Risk and Return: The Fundamental Trade-Off

Higher expected returns come with higher risk. This is the iron law of investing:

\`\`\`
Treasury bills (lowest risk) → Government bonds → Corporate bonds → Large-cap stocks → Small-cap stocks → Individual stocks (highest risk)
\`\`\`

You cannot earn stock-like returns with bond-like risk. Anyone who promises otherwise is selling something.

### Real-World Example: The Long View

If you had invested \\$10,000 in the S&P 500 in 1993 and left it untouched:
- By 2003 (10 years): approximately \\$23,000
- By 2013 (20 years): approximately \\$46,000
- By 2023 (30 years): approximately \\$172,000

This includes the dot-com crash, the 2008 financial crisis, and the 2020 COVID crash. The market recovered every time.

\`\`\`trace
{
  "title": "S&P 500 Growth Journey: 1993-2023",
  "language": "python",
  "code": "initial = 10000\\nyears = [0, 10, 20, 30]\\nvalues = [10000, 23000, 46000, 172000]\\n\\nprint(\\"S&P 500 Investment Growth\\")\\nprint(\\"=\\" * 30)\\nfor i, (year, value) in enumerate(zip(years, values)):\\n    growth = ((value / initial) - 1) * 100\\n    print(f\\"After {year:2d} years: \\\\\${value:,8} ({growth:5.1f}% total return)\\")",
  "frames": [
    { "line": 1, "vars": {"initial": 10000}, "note": "Starting investment in 1993", "stdout": "" },
    { "line": 5, "vars": {"years": [0, 10, 20, 30], "values": [10000, 23000, 46000, 172000]}, "note": "Historical values including market crashes", "stdout": "" },
    { "line": 7, "vars": {"i": 0, "year": 0, "value": 10000}, "note": "Initial investment", "stdout": "S&P 500 Investment Growth\\n==============================\\nAfter  0 years: \\\\$   10,000 (  0.0% total return)\\n" },
    { "line": 7, "vars": {"i": 1, "year": 10, "value": 23000}, "note": "After dot-com crash", "stdout": "After 10 years: \\\\$   23,000 (130.0% total return)\\n" },
    { "line": 7, "vars": {"i": 2, "year": 20, "value": 46000}, "note": "After 2008 financial crisis", "stdout": "After 20 years: \\\\$   46,000 (360.0% total return)\\n" },
    { "line": 7, "vars": {"i": 3, "year": 30, "value": 172000}, "note": "After COVID crash and recovery", "stdout": "After 30 years: \\\\$  172,000 (1620.0% total return)\\n" }
  ]
}
\`\`\`

### Getting Started

You do not need thousands of dollars to begin investing. Most brokerages (Fidelity, Schwab, Vanguard) have no minimums and offer fractional shares. You can buy \\$50 of an S&P 500 index fund today.

The biggest risk is not investing at all — leaving your money in a savings account while inflation erodes its value year after year.

\`\`\`callout
{
  "type": "tip",
  "title": "Start Small, Start Now",
  "content": "You can begin investing with as little as \\\\$50 through most major brokerages. Many offer fractional shares, allowing you to buy portions of expensive stocks. The key is to start early and be consistent rather than waiting for the 'perfect' moment."
}
\`\`\`

### Key Takeaway

Investing is not gambling — it is participating in economic growth. Start by understanding the asset classes, accept that short-term volatility is the price of long-term returns, and begin with whatever amount you can. Time in the market matters far more than timing the market.

> "The stock market is a device for transferring money from the impatient to the patient." — Warren Buffett`,
    },
    {
      id: "pf-index-funds-etfs",
      slug: "index-funds-etfs",
      title: "Index Funds & ETFs (Bogle's Philosophy)",
      content: `## Index Funds & ETFs: Bogle's Philosophy

John C. Bogle, founder of Vanguard Group, revolutionized investing with a simple idea: instead of trying to beat the market, just **own the entire market** at the lowest possible cost. This philosophy has made more people wealthy than any other investment strategy in history.

### What Is an Index Fund?

An index fund is a type of mutual fund or ETF designed to track a specific market index. Instead of a fund manager picking stocks, the fund simply holds all (or a representative sample of) the stocks in the index.

\`\`\`concept
{
  "title": "The Index Fund Innovation",
  "variant": "mental-model",
  "content": "Think of an index fund as a basket that automatically contains every stock in a market index. Instead of trying to find the best individual apples in an orchard (stock picking), you buy the entire orchard (the index) at once. This guarantees you own the winners while protecting you from picking losers."
}
\`\`\`

**Popular Index Funds:**

| Index | What It Tracks | Example Fund | Expense Ratio |
|-------|---------------|-------------|--------------|
| S&P 500 | 500 largest US companies | Vanguard VOO / Fidelity FXAIX | 0.03% |
| Total US Stock Market | ~4,000 US companies | Vanguard VTI / VTSAX | 0.03% |
| Total International | Non-US stocks | Vanguard VXUS | 0.07% |
| Total Bond Market | US investment-grade bonds | Vanguard BND | 0.03% |

### Mutual Funds vs ETFs

Both can track the same index, but they differ in structure:

| Feature | Index Mutual Fund | ETF |
|---------|------------------|-----|
| Trading | End of day (NAV price) | Throughout the day (like a stock) |
| Minimum investment | Often \\$1,000-3,000 | Price of one share (or fractional) |
| Tax efficiency | Good | Slightly better |
| Automatic investing | Easy to automate | Requires manual purchase (usually) |
| Expense ratios | Very low | Very low |

For most investors, the differences are marginal. Pick whichever is more convenient with your brokerage.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Active Fund Shopping",
    "code": "• Research 50+ fund managers\\n• Analyze past performance\\n• Pay 1% expense ratio\\n• Hope manager keeps winning\\n• Worry about style drift\\n• Check ratings quarterly"
  },
  "after": {
    "label": "Index Fund Simplicity",
    "code": "• Pick one index fund\\n• Pay 0.03% expense ratio\\n• Own entire market\\n• Guaranteed average return\\n• No manager risk\\n• Check annually (optional)"
  }
}
\`\`\`

### Why Index Funds Win

Bogle's insight was backed by decades of data: **most actively managed funds underperform their benchmark index** over the long term.

According to the SPIVA Scorecard (S&P Dow Jones Indices, 2023):
- Over 5 years: **87%** of large-cap fund managers underperformed the S&P 500
- Over 10 years: **90%** underperformed
- Over 20 years: **93%** underperformed

The few managers who outperform in one period rarely do so consistently. And you cannot identify them in advance.

\`\`\`quiz
{
  "title": "Test Your Index Fund Knowledge",
  "questions": [
    {
      "question": "What percentage of active fund managers underperformed the S&P 500 over 20 years according to SPIVA?",
      "options": ["70%", "80%", "90%", "93%"],
      "answer": 3,
      "explanation": "The SPIVA Scorecard shows 93% of active managers underperformed over 20 years, making index funds the statistically superior choice."
    },
    {
      "question": "Which is NOT a key difference between index mutual funds and ETFs?",
      "options": ["Trading frequency", "Tax efficiency", "Expense ratios", "Minimum investment"],
      "answer": 2,
      "explanation": "Both index mutual funds and ETFs have very low expense ratios. The main differences are trading mechanics, tax efficiency, and minimum investments."
    },
    {
      "question": "What does Bogle mean by 'Don't look for the needle in the haystack. Just buy the haystack'?",
      "options": ["Diversify internationally", "Own the entire market", "Pick individual winners", "Time the market"],
      "answer": 1,
      "explanation": "Bogle advocated owning the entire market through index funds rather than trying to pick individual winning stocks."
    }
  ]
}
\`\`\`

### The Cost Advantage

Expense ratios are the annual fee charged by a fund, expressed as a percentage of assets. The difference between an active fund and an index fund is dramatic:

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Fee Impact Calculator",
  "inputs": [
    { "id": "p", "label": "Initial Investment", "default": 100000, "min": 1000, "max": 1000000, "prefix": "$" },
    { "id": "r1", "label": "Index Fund Fee", "default": 0.03, "min": 0.01, "max": 0.5, "suffix": "%" },
    { "id": "r2", "label": "Active Fund Fee", "default": 1.0, "min": 0.5, "max": 2.5, "suffix": "%" },
    { "id": "t", "label": "Time Period", "default": 30, "min": 1, "max": 40, "suffix": " years" }
  ]
}
\`\`\`

Over 30 years on a \\$500,000 portfolio, the difference between a 1% fee and a 0.03% fee is approximately **\\$300,000** in lost returns. Fees compound just like returns — but against you.

### Real-World Example: The Bet

In 2007, Warren Buffett made a public \\$1 million bet that the S&P 500 index fund would outperform a basket of hedge funds over 10 years. By 2017, the S&P 500 fund had returned 125.8% cumulatively, while the hedge funds returned an average of 36%. Buffett won decisively, donating the winnings to charity.

### The Three-Fund Portfolio

Bogle recommended an elegantly simple portfolio:

\`\`\`steps
{
  "title": "Building Bogle's Three-Fund Portfolio",
  "steps": [
    {
      "title": "Step 1: US Total Stock Market (60-80%)",
      "content": "Start with VTI or VTSAX for broad US exposure to ~4,000 companies. This forms your growth engine."
    },
    {
      "title": "Step 2: International Stocks (20-30%)",
      "content": "Add VXUS or VTIAX for global diversification beyond US borders. Protects against domestic downturns."
    },
    {
      "title": "Step 3: US Bonds (20-40%)",
      "content": "Include BND or VBTLX for stability and income. Increase percentage as you near retirement."
    }
  ]
}
\`\`\`

Adjust the stock/bond ratio based on your age and risk tolerance (more bonds as you approach retirement). This three-fund portfolio provides global diversification across thousands of stocks and bonds for under 0.05% in fees.

### Bogle's Core Principles

1. **Keep costs low** — Every dollar in fees is a dollar not compounding for you
2. **Diversify broadly** — Own the whole market, not individual stocks
3. **Stay the course** — Do not sell during market crashes; do not chase hot sectors
4. **Invest regularly** — Dollar-cost average (next lesson) regardless of market conditions
5. **Keep it simple** — You do not need 15 funds; three is enough

### Common Objections

**"Index funds are boring."** Yes — and that is the point. Boring is profitable.

**"I can pick winning stocks."** Statistically, you almost certainly cannot do it consistently. Even professionals fail 90%+ of the time over long periods.

**"What about the next Amazon?"** For every Amazon, there are thousands of stocks that went to zero. The index owns Amazon AND protects you from the losers.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Index funds beat 90%+ of active managers over long periods due to lower costs and broad diversification",
    "Expense ratios matter: a 1% fee vs 0.03% can cost you \\\\$300,000+ over 30 years on a \\\\$500k portfolio",
    "The three-fund portfolio (US stocks, international stocks, bonds) provides complete diversification",
    "ETFs trade like stocks throughout the day; index mutual funds trade once daily but offer easier automation",
    "Bogle's philosophy: keep costs low, diversify broadly, stay the course, invest regularly, keep it simple"
  ]
}
\`\`\``,
    },
    {
      id: "pf-dollar-cost-averaging",
      slug: "dollar-cost-averaging",
      title: "Dollar-Cost Averaging",
      content: `## Dollar-Cost Averaging

Dollar-cost averaging (DCA) is the practice of investing a fixed amount of money at regular intervals, regardless of market conditions. It removes the impossible task of timing the market and turns investing into a disciplined, automatic habit.

### How It Works

Instead of investing a lump sum all at once, you spread your purchases over time. The key insight: **you automatically buy more shares when prices are low and fewer when prices are high**, lowering your average cost per share.

\`\`\`algoviz
{
  "title": "DCA in Action: $500 Monthly Purchases",
  "type": "array",
  "data": [50, 45, 40, 42, 48, 52],
  "frames": [
    {"highlight": [0], "label": "Month 1: $500 ÷ $50 = 10.0 shares", "stats": {"shares": 10.0, "total": 500}},
    {"highlight": [1], "label": "Month 2: $500 ÷ $45 = 11.1 shares", "stats": {"shares": 21.1, "total": 1000}},
    {"highlight": [2], "label": "Month 3: $500 ÷ $40 = 12.5 shares", "stats": {"shares": 33.6, "total": 1500}},
    {"highlight": [3], "label": "Month 4: $500 ÷ $42 = 11.9 shares", "stats": {"shares": 45.5, "total": 2000}},
    {"highlight": [4], "label": "Month 5: $500 ÷ $48 = 10.4 shares", "stats": {"shares": 55.9, "total": 2500}},
    {"highlight": [5], "label": "Month 6: $500 ÷ $52 = 9.6 shares", "stats": {"shares": 65.5, "total": 3000}}
  ],
  "speed": 1000
}
\`\`\`

**Total invested:** $3,000  
**Total shares:** 65.5  
**Average cost per share:** $45.80  
**Current value (at $52):** $3,406  

Notice that your average cost ($45.80) is lower than the simple average of the prices ($46.17). This is because you automatically buy **more shares when prices are low** and fewer shares when prices are high.

### Why DCA Works Psychologically

The biggest enemy of investment returns is investor behavior. Dalbar's annual study consistently shows that the average investor significantly underperforms the market because they:

- **Buy high**: Get excited when markets are rising and pile in at the top
- **Sell low**: Panic when markets crash and sell at the bottom
- **Wait on the sidelines**: Hold cash waiting for the "right time" that never feels right

DCA eliminates these emotional decisions entirely. You invest the same amount on the same schedule regardless of headlines, market swings, or your feelings.

### DCA vs Lump Sum Investing

Research by Vanguard (2012) found that lump sum investing outperforms DCA about **two-thirds of the time**, because markets trend upward and investing earlier captures more growth. However:

- DCA wins one-third of the time (when markets decline after the lump sum)
- DCA produces **lower volatility** and **less regret risk**
- Most people do not have a lump sum — they earn and invest monthly (natural DCA)

The psychological benefit of DCA is substantial. If you invest $60,000 as a lump sum and the market drops 20% next month, you have lost $12,000 on paper and will likely panic. If you are DCA-ing $5,000/month, a 20% drop means you buy next month's shares at a 20% discount.

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Lump-Sum Laura (Jan 2007–Dec 2012)",
    "code": "Invested: $60,000 on Jan 1, 2007\\nValue at Mar 2009 low: ~$30,000 (-50%)\\nValue at Dec 2012: ~$85,000\\nEmotional state: panic, regret, may have sold"
  },
  "after": {
    "label": "DCA Dan (Jan 2007–Dec 2012)",
    "code": "Invested: $1,000 every month\\nTotal invested by Mar 2009: $27,000\\nValue at Mar 2009: ~$19,000 (-30% on contributed)\\nValue at Dec 2012: ~$90,000\\nEmotional state: steady, kept buying cheaper shares"
  }
}
\`\`\`

### Setting Up DCA

The best DCA strategy is one you automate and forget:

1. **Choose a brokerage** — Fidelity, Schwab, or Vanguard
2. **Select your index fund** — S&P 500, Total Stock Market, or Target Date Fund
3. **Set up automatic investment** — Fixed amount on each payday
4. **Do not check daily** — Review quarterly at most

Most 401(k) plans are inherently DCA — you invest a fixed amount each paycheck. If your employer offers a 401(k), you are likely already dollar-cost averaging.

### When DCA Is Not Ideal

- **If you receive a large windfall** (inheritance, bonus) and have a long time horizon (20+ years), lump sum investing has better expected returns
- **If you are near retirement**, you may want to be more strategic about when and what you invest in
- **In a consistently rising market**, DCA leaves money uninvested that could be earning returns

### The Bottom Line: Time in Market > Timing the Market

A famous study by J.P. Morgan found that missing the 10 best days in the stock market over a 20-year period cut returns by more than half. And 7 of the 10 best days occurred within two weeks of the 10 worst days. If you are sitting on the sidelines during crashes, you miss the recoveries.

DCA keeps you invested through both, automatically.

### Key Takeaway

Dollar-cost averaging removes emotion from investing and harnesses volatility in your favor. It is not always mathematically optimal, but it is behaviorally optimal — and behavior is what determines real-world investment outcomes. Automate your investments and let time do the heavy lifting.

> "Far more money has been lost by investors preparing for corrections, or trying to anticipate corrections, than has been lost in corrections themselves." — Peter Lynch

\`\`\`quiz
{
  "title": "Check Your DCA Understanding",
  "questions": [
    {
      "question": "If you DCA $400 monthly and the fund price drops from $40 to $32, how many *additional* shares do you receive that month?",
      "options": ["2.5 shares", "3.5 shares", "5.0 shares", "7.5 shares"],
      "answer": 0,
      "explanation": "At $40 you buy 10 shares; at $32 you buy 12.5 shares—an extra 2.5 shares for the same $400."
    },
    {
      "question": "According to Vanguard's 2012 study, lump-sum investing beats DCA roughly how often over 12-month horizons?",
      "options": ["One-third of the time", "Half the time", "Two-thirds of the time", "Almost always"],
      "answer": 2,
      "explanation": "Markets trend upward; being fully invested sooner captures more growth about two-thirds of the time."
    },
    {
      "question": "Which emotion-driven mistake does DCA most directly eliminate?",
      "options": ["Over-diversification", "Buying high and selling low", "Ignoring taxes", "Chasing yield"],
      "answer": 1,
      "explanation": "By automating fixed purchases, DCA prevents investors from piling in at peaks and panic-selling in troughs."
    }
  ]
}
\`\`\``,
    },
    {
      id: "pf-risk-tolerance",
      slug: "risk-tolerance",
      title: "Risk Tolerance & Asset Allocation",
      content: `## Risk Tolerance & Asset Allocation

Asset allocation — how you divide your money among stocks, bonds, and other investments — is the single most important decision in investing. Studies by Brinson, Hood, and Beebower found that asset allocation explains over **90% of the variation** in portfolio returns over time.

\`\`\`concept
{
  "title": "The 90% Rule",
  "variant": "insight",
  "content": "Asset allocation isn't just important — it's dominant. Research shows that more than 90% of your portfolio's performance over time comes from how you divide money between asset classes, not which specific stocks or bonds you pick. This makes getting your allocation right far more valuable than trying to find the 'perfect' investments."
}
\`\`\`

### What Is Risk Tolerance?

Risk tolerance is your ability and willingness to endure investment losses in pursuit of higher returns. It has two components:

**Risk capacity** (objective): Can you financially afford to lose money? This depends on:
- Your age and time horizon
- Income stability
- Existing savings and safety nets
- Financial obligations (mortgage, dependents)

**Risk willingness** (subjective): Can you emotionally handle watching your portfolio drop 30%? This depends on your personality, experience, and sleep quality during market crashes.

Both matter. A 25-year-old with a stable job and no dependents has high risk capacity. But if they panic-sell every time the market dips 5%, their risk willingness is low.

\`\`\`quiz
{
  "title": "Risk Tolerance Check",
  "questions": [
    {
      "question": "A 45-year-old with stable income, 6 months emergency savings, and kids starting college in 2 years likely has what risk capacity?",
      "options": ["High - plenty of time to recover", "Medium - balanced situation", "Low - near-term college expenses", "Very High - peak earning years"],
      "answer": 2,
      "explanation": "Despite stable income, the 2-year college timeline creates near-term liquidity needs that reduce risk capacity. College expenses are predictable and large, requiring more conservative allocation."
    },
    {
      "question": "Which scenario demonstrates low risk willingness?",
      "options": ["Checking portfolio weekly during market volatility", "Selling investments after a 20% market drop", "Maintaining allocation through a bear market", "Adding more money during market dips"],
      "answer": 1,
      "explanation": "Selling during a downturn locks in losses and indicates emotional discomfort with volatility — classic low risk willingness. The other options show various levels of comfort with market fluctuations."
    },
    {
      "question": "Why might a 30-year-old with high income have low risk capacity?",
      "options": ["Too young to invest", "High debt-to-income ratio", "Already retired", "Maximum Social Security benefits"],
      "answer": 1,
      "explanation": "High debt obligations relative to income reduce the financial ability to withstand losses, regardless of age or income level. Debt creates mandatory payments that compete with investment flexibility."
    }
  ]
}
\`\`\`

### Asset Allocation Models

The classic approach varies the stock/bond mix based on risk tolerance:

| Profile | Stocks | Bonds | Expected Return | Max Drawdown |
|---------|--------|-------|----------------|-------------|
| Aggressive | 90% | 10% | 8-10% | -45% |
| Growth | 80% | 20% | 7-9% | -38% |
| Moderate | 60% | 40% | 6-7% | -28% |
| Conservative | 40% | 60% | 4-6% | -18% |
| Very Conservative | 20% | 80% | 3-5% | -10% |

**Max drawdown** is the worst peak-to-trough decline you might experience. An aggressive portfolio with 90% stocks could lose 45% in a severe crash (like 2008-2009).

### The Age-Based Rule of Thumb

A common starting point: **subtract your age from 110 to get your stock allocation.**

- Age 25: 110 - 25 = 85% stocks, 15% bonds
- Age 40: 110 - 40 = 70% stocks, 30% bonds
- Age 55: 110 - 55 = 55% stocks, 45% bonds
- Age 65: 110 - 65 = 45% stocks, 55% bonds

This is a guideline, not a rule. Adjust based on your specific risk tolerance, goals, and financial situation.

\`\`\`calculator
{
  "type": "compound-interest",
  "title": "Age Rule Portfolio Growth",
  "inputs": [
    { "id": "p", "label": "Starting Amount", "default": 100000, "min": 1000, "max": 1000000, "prefix": "$" },
    { "id": "age", "label": "Your Age", "default": 30, "min": 18, "max": 80 },
    { "id": "r", "label": "Expected Return", "default": 7, "min": 3, "max": 12, "suffix": "%" }
  ]
}
\`\`\`

### Real-World Example: Two Portfolios in 2008

**Portfolio A (90/10 — Aggressive):**
- 2007 value: \\$100,000
- 2008-2009 crash: dropped to \\$55,000 (-45%)
- Recovery to \\$100,000: took until 2012 (3 years)
- Value by 2023: approximately \\$400,000

**Portfolio B (60/40 — Moderate):**
- 2007 value: \\$100,000
- 2008-2009 crash: dropped to \\$72,000 (-28%)
- Recovery to \\$100,000: took until 2010 (1 year)
- Value by 2023: approximately \\$280,000

Portfolio A ended with more money, but Portfolio B had a much smoother ride. If the Portfolio A investor panicked and sold at the bottom, they locked in a 45% loss and never recovered.

\`\`\`algoviz
{
  "title": "2008 Crisis: Aggressive vs Moderate Portfolio",
  "type": "array",
  "data": [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400],
  "frames": [
    { "highlight": [0], "label": "2007: Both portfolios start at $100k", "stats": {"year": 2007, "aggressive": 100, "moderate": 100} },
    { "highlight": [7], "label": "2008: Aggressive drops to $55k (-45%)", "stats": {"year": 2008, "aggressive": 55, "moderate": 72} },
    { "highlight": [11], "label": "2010: Moderate recovers to $100k", "stats": {"year": 2010, "aggressive": 75, "moderate": 100} },
    { "highlight": [15], "label": "2012: Aggressive finally recovers", "stats": {"year": 2012, "aggressive": 100, "moderate": 125} },
    { "highlight": [79], "label": "2023: Aggressive at $400k vs Moderate at $280k", "stats": {"year": 2023, "aggressive": 400, "moderate": 280} }
  ],
  "speed": 600
}
\`\`\`

### Diversification: The Free Lunch

Harry Markowitz, Nobel Prize-winning economist, called diversification "the only free lunch in investing." By combining assets that do not move in perfect sync, you can reduce risk without proportionally reducing returns.

**Key diversification layers:**

1. **Across asset classes**: Stocks + bonds + real estate
2. **Within stocks**: Large-cap + small-cap + international + emerging markets
3. **Within bonds**: Government + corporate + international + varying maturities
4. **Across time**: Dollar-cost averaging (covered in previous lesson)

### Target Date Funds: The Simplest Solution

If asset allocation feels overwhelming, target date funds do it all automatically. You pick the fund matching your expected retirement year (e.g., "Vanguard Target Retirement 2055 Fund"), and the fund automatically adjusts its stock/bond mix as you approach retirement.

- **30 years from retirement**: ~90% stocks, 10% bonds
- **15 years from retirement**: ~70% stocks, 30% bonds
- **At retirement**: ~50% stocks, 50% bonds
- **In retirement**: Gradually shifts to ~30% stocks, 70% bonds

Expense ratios are typically 0.10-0.15% — extremely affordable for a fully managed, automatically rebalancing portfolio.

### Rebalancing

Over time, your portfolio drifts from its target allocation. If stocks have a great year, your 80/20 portfolio might become 88/12. Rebalancing means selling some stocks and buying bonds to restore the 80/20 target.

**Rebalancing methods:**
- **Calendar-based**: Rebalance once per year (simple, effective)
- **Threshold-based**: Rebalance when any asset class drifts more than 5% from target
- **Contribution-based**: Direct new contributions to underweight asset classes

\`\`\`steps
{
  "title": "How to Rebalance Your Portfolio",
  "steps": [
    {
      "title": "Step 1: Check Your Current Allocation",
      "content": "Calculate what percentage of your portfolio is in each asset class. Add up the values of all your stocks, bonds, and other investments. Compare these percentages to your target allocation."
    },
    {
      "title": "Step 2: Identify What's Out of Balance",
      "content": "Look for asset classes that have drifted more than 5% from their target. For example, if your target is 80% stocks but you now have 88%, you need to reduce stocks by 8% of your total portfolio value."
    },
    {
      "title": "Step 3: Choose Your Rebalancing Method",
      "content": "**Calendar**: Rebalance on your birthday each year. **Threshold**: Rebalance when any asset hits 5% off-target. **Contributions**: Direct new money to underweight assets. Calendar is simplest for most investors."
    },
    {
      "title": "Step 4: Execute the Trades",
      "content": "Sell overweight assets and buy underweight ones. In tax-advantaged accounts (401k, IRA), there are no tax consequences. In taxable accounts, consider tax-loss harvesting opportunities or use new contributions instead of selling."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Asset allocation drives over 90% of your portfolio's performance — more important than picking individual investments",
    "Risk tolerance has two parts: capacity (financial ability) and willingness (emotional comfort) — both must align with your allocation",
    "The age rule (110 minus your age for stock percentage) provides a starting point, but adjust based on your specific situation",
    "Higher stock allocations offer higher returns but require enduring larger losses and longer recovery times",
    "Diversification across asset classes, regions, and time reduces risk without proportionally reducing returns",
    "Target date funds offer a simple, low-cost solution that automatically adjusts allocation as you age",
    "Annual rebalancing maintains your target risk level and can improve returns by forcing you to buy low and sell high"
  ]
}
\`\`\`

> "The essence of investment management is the management of risks, not the management of returns." — Benjamin Graham`,
    },
  ],
};

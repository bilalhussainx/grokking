import { Module } from "../types";

export const strategyModule: Module = {
  id: "sm-strategy",
  title: "Investment Strategies",
  description:
    "Explore proven investment strategies — from value and growth investing to dividends, factor investing, and building your personal plan.",
  lessons: [
    {
      id: "sm-strategy-value",
      slug: "value-investing",
      title: "Value Investing (Graham & Buffett)",
      content: `## Value Investing (Graham & Buffett)

Value investing is the strategy of buying securities that trade below their estimated intrinsic value — essentially, buying dollar bills for fifty cents. Pioneered by Benjamin Graham and David Dodd at Columbia University in the 1930s and refined by Warren Buffett over the following decades, value investing has produced some of the most impressive long-term track records in investing history.

### The Graham Approach: Quantitative Value

Benjamin Graham, the "father of value investing," developed a systematic approach focused on quantitative cheapness and margin of safety.

**Graham's key principles:**
1. **Margin of safety**: Only buy when the stock price is significantly below your estimate of intrinsic value. This buffer protects against errors in your analysis and unforeseen negative events.
2. **Mr. Market metaphor**: Imagine the market as an emotional business partner who offers to buy or sell shares every day. Sometimes Mr. Market is euphoric (prices are too high); sometimes he is depressed (prices are too low). Your job is to exploit his mood swings, not follow them.
3. **Investor vs. speculator**: An investor buys based on analysis and expects a reasonable return. A speculator buys based on hope that someone else will pay more.

**Graham's quantitative screens:**
- P/E ratio below 15 (or below the inverse of the AAA bond yield)
- Price-to-book below 1.5
- Current ratio above 2 (current assets twice current liabilities)
- Consistent dividend payments over 20+ years
- Positive earnings growth over the past 10 years
- Total debt less than book value

Graham's approach was deliberately conservative — he was willing to buy boring, overlooked companies as long as the price was cheap enough relative to tangible assets.

### The Buffett Evolution: Qualitative Value

Warren Buffett started as a pure Graham disciple, buying deeply discounted "cigar butt" stocks. Under the influence of Charlie Munger, Buffett evolved to focus on **quality at a fair price** rather than mediocrity at a cheap price.

**Buffett's refined approach:**
1. **Wonderful company at a fair price** beats a fair company at a wonderful price
2. **Competitive moat**: Focus on companies with sustainable advantages that protect profitability
3. **Management quality**: Honest, capable managers who allocate capital wisely
4. **Circle of competence**: Only invest in businesses you truly understand
5. **Long-term holding**: "Our favorite holding period is forever"

**Buffett's criteria:**
- High and sustainable return on equity (ROE > 15%)
- Consistent and growing earnings over 10+ years
- Conservative debt levels
- Strong free cash flow generation
- Management with integrity and shareholder orientation
- Understandable business model
- Available at a reasonable valuation

### The Value Investing Track Record

The empirical evidence for value investing is compelling:
- The Fama-French three-factor model showed that value stocks (low P/B) outperformed growth stocks by approximately 4-5% per year from 1927-2020
- Warren Buffett's Berkshire Hathaway compounded at approximately 20% per year from 1965-2023, roughly doubling the S&P 500's return
- Joel Greenblatt's "Magic Formula" (high earnings yield + high return on capital) backtested at 30%+ annual returns from 1988-2004

### The Value Trap Warning

Not every cheap stock is a value stock. A "value trap" is a stock that looks cheap but is cheap for good reason — the business is in permanent decline:
- A retailer losing market share to e-commerce
- A legacy technology company being disrupted
- A company with accounting irregularities that depress reported earnings
- A commodity producer in a permanently oversupplied market

The key differentiator: true value stocks are temporarily mispriced due to short-term problems or market overreaction. Value traps are correctly priced for a permanently deteriorating business.

### Key Takeaway

Value investing is not about buying cheap junk — it is about buying quality businesses when the market underprices them. Graham provided the quantitative foundation (buy below intrinsic value with a margin of safety). Buffett added the qualitative layer (prefer wonderful businesses with moats). Together, they created a framework that has produced extraordinary wealth over decades. Patience, discipline, and independent thinking are the value investor's greatest tools.`,
    },
    {
      id: "sm-strategy-growth",
      slug: "growth-investing",
      title: "Growth Investing",
      content: `## Growth Investing

Growth investing focuses on companies whose revenues and earnings are growing significantly faster than the overall market. Growth investors are willing to pay higher valuations (higher P/E, P/S ratios) for companies they believe will deliver above-average earnings growth in the future. The strategy bets that rapid growth will make today's seemingly expensive price look cheap in hindsight.

### The Growth Investing Philosophy

While value investors look for dollars selling for fifty cents, growth investors look for fifty-cent companies that will become dollars. The focus is forward-looking — what the company will earn in the future matters more than what it has earned in the past or what it is valued at today.

**Key beliefs of growth investors:**
1. A company growing earnings at 25% per year will outperform regardless of starting valuation
2. Market leadership and innovation create compounding advantages
3. The best growth companies reinvest earnings into expanding their moat rather than paying dividends
4. Momentum is real — companies that are growing fast tend to keep growing fast

### What Growth Investors Look For

**Revenue growth**: Consistent 15-30%+ annual revenue growth. For earlier-stage companies, 30-50%+ growth. Decelerating growth is a warning sign.

**Expanding total addressable market (TAM)**: The company's potential market should be large and growing. A company growing at 30% in a \$500 million market will hit a ceiling much faster than one growing at 30% in a \$50 billion market.

**Market leadership**: The company should be number one or two in its category. Market leaders attract the best talent, win the most customers, and have pricing power.

**Recurring revenue**: Subscription and recurring revenue models (SaaS, membership) are preferred because they provide predictable, growing cash flows. High net revenue retention (NRR > 120%) means existing customers spend more over time.

**Strong unit economics**: Customer acquisition cost (CAC) should be reasonable relative to customer lifetime value (LTV). The LTV/CAC ratio should be above 3x.

**Competitive moat**: Network effects, switching costs, and proprietary technology that protect the company from competition as it scales.

### Growth Investing Metrics

| Metric | What Growth Investors Care About |
|--------|--------------------------------|
| Revenue growth rate | Higher is better; watch for deceleration |
| Net revenue retention | Above 120% is excellent (existing customers grow) |
| Rule of 40 | Revenue growth % + profit margin % > 40 is healthy |
| Gross margin | Above 70% for software; indicates pricing power |
| Free cash flow margin | Improving trajectory toward profitability |
| Insider ownership | Founders with significant skin in the game |

### The CANSLIM System (William O'Neil)

William O'Neil, founder of Investor's Business Daily, developed the CANSLIM framework for growth stock selection:

- **C**: Current quarterly earnings growth (25%+)
- **A**: Annual earnings growth over 3-5 years (25%+)
- **N**: New products, management, or price highs
- **S**: Supply and demand — prefer companies with smaller share counts
- **L**: Leader — buy the leading stock in the leading industry
- **I**: Institutional sponsorship — some (but not too much) institutional ownership
- **M**: Market direction — trade in the direction of the overall market trend

### Growth vs. Value: The Eternal Debate

| Factor | Growth | Value |
|--------|--------|-------|
| Valuation | Pay premium for growth | Buy at a discount |
| Time horizon | Future earnings drive returns | Current assets/earnings drive returns |
| Risk | High — growth may not materialize | Moderate — margin of safety provides buffer |
| Best in | Bull markets, low interest rate environments | Bear markets, rising rate environments |
| Historical return | Comparable to value over full cycles | Slight long-term edge historically |

In practice, the best investors blend both approaches — Peter Lynch called it "growth at a reasonable price" (GARP).

### The Risk: Paying Too Much

The danger of growth investing is overpaying. If a company growing at 30% is priced for 30% growth, there is no margin of safety. If growth decelerates to 20%, the stock can fall 50% or more as the market reprices both the growth rate and the multiple.

High-growth stocks are particularly vulnerable to:
- Interest rate increases (which raise the discount rate for future cash flows)
- Earnings misses (the market punishes growth stocks harshly for missing expectations)
- Competitive disruption (another company captures the growth opportunity)

### Key Takeaway

Growth investing works when you identify companies with durable competitive advantages growing into large markets — and when you manage the risk of overpaying. The best growth investors combine rigorous fundamental analysis with attention to valuation, position sizing, and market conditions. Growth investing is not about buying hype — it is about identifying companies where rapid, sustainable growth will compound wealth over time.`,
    },
    {
      id: "sm-strategy-dividend",
      slug: "dividend-growth-investing",
      title: "Dividend Growth Investing",
      content: `## Dividend Growth Investing

Dividend growth investing is a strategy that focuses on owning shares of companies that pay regular dividends and, crucially, increase those dividends consistently over time. The strategy combines current income with growing income and capital appreciation, making it one of the most reliable paths to long-term wealth building.

### The Power of Growing Dividends

The real magic of dividend growth investing is not the current yield — it is the compounding of dividend increases over time. Consider a stock with a 2.5% dividend yield that increases its dividend by 8% per year:

| Year | Dividend Per Share | Yield on Original Cost |
|------|-------------------|----------------------|
| 1 | \$2.50 | 2.5% |
| 5 | \$3.40 | 3.4% |
| 10 | \$5.00 | 5.0% |
| 15 | \$7.35 | 7.4% |
| 20 | \$10.79 | 10.8% |
| 25 | \$15.86 | 15.9% |

After 25 years, you are earning nearly 16% per year on your original investment just from dividends — plus whatever the stock has appreciated. This is the engine of dividend growth investing.

### Dividend Aristocrats and Kings

**Dividend Aristocrats**: S&P 500 companies that have increased their dividend every year for at least 25 consecutive years. There are approximately 65 companies in this group.

**Dividend Kings**: Companies that have increased their dividend every year for at least 50 consecutive years. This elite group includes companies like Coca-Cola, Johnson & Johnson, Procter & Gamble, and 3M.

These long dividend growth streaks demonstrate financial durability — companies that can raise dividends through recessions, market crashes, and industry disruptions have proven their resilience.

### What to Look for in a Dividend Growth Stock

**Dividend growth rate**: How fast has the company increased its dividend over 5, 10, and 20 years? Is the growth rate consistent or erratic?

**Payout ratio**: Dividends paid / Earnings per share. A payout ratio below 60% is healthy for most companies — it indicates the company retains enough earnings to reinvest in growth while still returning cash to shareholders. Above 80% may indicate the dividend is at risk if earnings dip.

**Earnings growth**: Sustainable dividend growth requires earnings growth. A company cannot keep raising dividends if earnings are stagnant — eventually the payout ratio reaches 100% and the dividend must be cut.

**Free cash flow**: Dividends are paid from cash, not accounting earnings. Free cash flow should comfortably cover the dividend. The cash payout ratio (dividends / free cash flow) is often a better indicator than the earnings payout ratio.

**Balance sheet strength**: Low debt levels provide a cushion during downturns. Companies with excessive debt may be forced to cut dividends to service their obligations.

### Dividend Reinvestment (DRIP)

Dividend Reinvestment Plans automatically reinvest your dividends into additional shares of the same stock, creating a compounding machine. If a stock yields 3% and grows at 10% per year:

- Without reinvestment: Total return is approximately 10% capital gains + 3% cash yield = 13% total
- With reinvestment: The reinvested dividends buy more shares, which generate more dividends, which buy more shares — the compounding effect accelerates over time

Most brokerages offer automatic DRIP at no additional cost.

### Tax Considerations

**Qualified dividends** (from US corporations held for more than 60 days) are taxed at preferential rates:
- 0% for the 10-12% tax brackets
- 15% for the 12-35% tax brackets
- 20% for the 35-37% tax brackets

This favorable tax treatment makes dividend growth stocks relatively tax-efficient compared to bond interest (taxed as ordinary income) and short-term capital gains.

For maximum tax efficiency, hold dividend growth stocks in taxable accounts (to benefit from qualified dividend rates) and hold bonds and REITs in tax-advantaged accounts.

### Building a Dividend Growth Portfolio

A well-diversified dividend growth portfolio typically includes 20-30 stocks across multiple sectors:

| Sector | Example Dividend Growers |
|--------|------------------------|
| Consumer Staples | P&G, Coca-Cola, PepsiCo |
| Healthcare | J&J, AbbVie, Medtronic |
| Financials | JPMorgan, Visa, Mastercard |
| Industrials | Honeywell, Caterpillar, Illinois Tool Works |
| Technology | Microsoft, Apple, Broadcom |
| Utilities | NextEra Energy, Southern Co |

### Key Takeaway

Dividend growth investing is a patient, compounding strategy. You may not get rich quickly, but you will likely get rich steadily. The combination of rising dividend income, capital appreciation, and the discipline of reinvestment creates a powerful wealth-building engine. The key is selecting companies with the financial strength and competitive position to keep raising their dividends for decades — and then having the patience to let compounding work.`,
    },
    {
      id: "sm-strategy-factor",
      slug: "factor-investing",
      title: "Factor Investing",
      content: `## Factor Investing

Factor investing is a systematic approach that targets specific, measurable characteristics of stocks — called "factors" — that have historically been associated with higher returns. Rather than trying to pick individual winning stocks, factor investing tilts a portfolio toward groups of stocks that share these return-enhancing characteristics.

### What is a Factor?

A factor is a quantifiable attribute of a security that explains its risk and return. Academic research has identified hundreds of potential factors, but only a handful have proven robust, persistent, and investable.

### The Five Major Factors

**1. Value**
Stocks with low prices relative to fundamentals (low P/E, low P/B, high dividend yield) have historically outperformed expensive stocks.

- **Academic foundation**: Fama and French (1992, 1993) — the most cited finance paper
- **Metric**: Price-to-book, price-to-earnings, earnings yield
- **Historical premium**: Approximately 4-5% per year (US, 1927-2020)
- **ETFs**: VTV (Vanguard Value), IUSV, RPV

**2. Size (Small Cap)**
Smaller companies have historically outperformed larger companies, though this premium has been weaker in recent decades.

- **Academic foundation**: Bane (1981), Fama and French (1992)
- **Metric**: Market capitalization
- **Historical premium**: Approximately 2-3% per year
- **ETFs**: VB (Vanguard Small Cap), IJR, SCHA

**3. Momentum**
Stocks that have performed well over the past 3-12 months tend to continue performing well in the near term. Stocks that have performed poorly tend to continue performing poorly.

- **Academic foundation**: Jegadeesh and Titman (1993)
- **Metric**: Past 12-month return (excluding the most recent month)
- **Historical premium**: Approximately 5-8% per year (gross, before costs)
- **ETFs**: MTUM (iShares Momentum), VFMO

**4. Quality (Profitability)**
Companies with high profitability, stable earnings, and strong balance sheets outperform those with low profitability and weak financials.

- **Academic foundation**: Novy-Marx (2013), Fama and French (2015 five-factor model)
- **Metrics**: Return on equity, earnings stability, low leverage, low earnings accruals
- **Historical premium**: Approximately 3-4% per year
- **ETFs**: QUAL (iShares Quality), VFQY

**5. Low Volatility / Minimum Variance**
Stocks with lower volatility have historically delivered higher risk-adjusted returns than high-volatility stocks — contradicting the basic finance assumption that more risk equals more return.

- **Academic foundation**: Baker, Bradley, and Wurgler (2011)
- **Metric**: Historical volatility, beta
- **Historical premium**: Higher Sharpe ratio, not necessarily higher absolute return
- **ETFs**: USMV (iShares Min Vol), SPLV

### Multi-Factor Approaches

Because different factors outperform at different times, combining multiple factors provides diversification of factor exposures:

| Factor | Performs Well When | Underperforms When |
|--------|-------------------|-------------------|
| Value | Economic recovery, rising rates | Growth-dominant markets, low rates |
| Momentum | Trending markets | Sudden reversals |
| Quality | Market stress, recession | Speculative rallies |
| Small Cap | Economic expansion | Recession, flight to safety |
| Low Vol | Market decline, uncertainty | Strong bull markets |

Multi-factor ETFs (like LRGF, GSLC) combine several factors in a single fund, smoothing the return pattern.

### Factor Investing vs. Traditional Active Management

Factor investing occupies a middle ground between passive indexing and traditional stock picking:

| Approach | Cost | Expected Alpha | Diversification |
|----------|------|---------------|----------------|
| Passive Index | Very low (0.03%) | None (market return) | Maximum |
| Factor Investing | Low-moderate (0.10-0.30%) | Small, systematic | High |
| Active Stock Picking | High (0.50-1.50%) | Variable, uncertain | Lower |

### Key Takeaway

Factor investing provides a systematic, evidence-based framework for tilting your portfolio toward characteristics that have historically driven higher returns. It is more disciplined than stock picking and more targeted than pure indexing. The most practical approach for individual investors is to use low-cost factor ETFs to complement a core index fund allocation — tilting toward value, quality, and momentum without abandoning the diversification benefits of broad market exposure.`,
    },
    {
      id: "sm-strategy-plan",
      slug: "building-your-plan",
      title: "Building Your Investment Plan",
      content: `## Building Your Investment Plan

An investment plan is your personal roadmap for building wealth. Without one, you will react emotionally to market movements — buying when optimistic and selling when fearful, which is the opposite of what makes money. A written plan provides the discipline to stay the course through the inevitable ups and downs.

### Step 1: Define Your Goals

Before choosing any investments, clarify what you are investing for:

| Goal | Time Horizon | Risk Tolerance | Priority |
|------|-------------|---------------|----------|
| Emergency fund | Immediate | Zero | 1 |
| Retirement | 20-40 years | High (for young investors) | 2 |
| House down payment | 2-5 years | Low to moderate | 3 |
| Children's education | 5-18 years | Moderate | 4 |
| Financial independence | 10-25 years | Moderate to high | 5 |

Each goal may have a different investment strategy based on its time horizon and importance.

### Step 2: Establish Your Foundation

Before investing in the stock market, complete these prerequisites:

1. **Emergency fund**: 3-6 months of living expenses in a high-yield savings account. This is non-negotiable — it prevents you from selling investments during a downturn because you need cash.

2. **High-interest debt**: Pay off credit card debt and any loans with interest rates above 7-8%. No investment reliably returns more than credit card interest.

3. **Employer match**: If your employer offers a 401(k) match, contribute at least enough to get the full match. This is a guaranteed 50-100% return — nothing in the market comes close.

### Step 3: Choose Your Asset Allocation

Based on your age, risk tolerance, and time horizon (discussed in the portfolio management module):

**Template for a 30-year-old with high risk tolerance:**
- 90% equities (60% US stocks, 30% international stocks)
- 10% bonds (US aggregate)

**Template for a 50-year-old with moderate risk tolerance:**
- 60% equities (40% US stocks, 20% international stocks)
- 35% bonds (25% US aggregate, 10% international bonds)
- 5% alternatives (REITs)

### Step 4: Select Your Investments

For most people, a simple portfolio of 3-4 low-cost index funds is optimal:

| Fund | Allocation | Example ETF | Expense Ratio |
|------|-----------|-------------|---------------|
| US Total Stock Market | 50-60% | VTI | 0.03% |
| International Stocks | 20-30% | VXUS | 0.07% |
| US Bonds | 10-20% | BND | 0.03% |
| International Bonds | 0-10% | BNDX | 0.07% |

This portfolio gives you exposure to over 10,000 stocks and thousands of bonds worldwide for less than 0.05% in annual fees.

### Step 5: Automate Your Investing

Set up automatic contributions on a regular schedule:
- **Dollar-cost averaging**: Invest a fixed amount every month regardless of market conditions. This eliminates the temptation to time the market and ensures you buy more shares when prices are low.
- **Payroll deductions**: For 401(k) contributions, the money goes in before you see it
- **Automatic transfers**: Set up monthly transfers from checking to your brokerage account

Automation is the single most important behavioral tool — it removes emotion and ensures consistency.

### Step 6: Rebalance Periodically

Review your portfolio once or twice a year. If any allocation has drifted more than 5% from target, rebalance by selling the overweight and buying the underweight.

### Step 7: Stay the Course

The hardest part of investing is doing nothing during turbulent markets. Historical data provides perspective:

- The stock market has been positive in approximately 73% of years since 1926
- Every bear market in history has eventually been followed by a recovery to new highs
- The average investor earns significantly less than the market because they buy and sell at the wrong times

Your written investment plan is your anchor during storms. When the market drops 30% and every headline screams panic, your plan tells you to stay invested and keep buying.

### The Written Plan

Write your plan down and keep it accessible. Include:

1. Your goals and time horizons
2. Your target asset allocation
3. Your specific fund selections
4. Your contribution schedule
5. Your rebalancing rules
6. A "what I will do in a crash" statement (answer: nothing, or buy more)

### Key Takeaway

Building an investment plan is not complicated, but it requires discipline. Define your goals, set an appropriate allocation, choose low-cost index funds, automate your contributions, rebalance periodically, and stay the course. The simplicity is a feature, not a bug — the best investment plan is one you will actually follow through decades of market ups and downs. Complexity is the enemy of execution.`,
    },
  ],
};

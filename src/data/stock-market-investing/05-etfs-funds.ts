import { Module } from "../types";

export const etfsFundsModule: Module = {
  id: "sm-etfs",
  title: "ETFs & Mutual Funds",
  description:
    "Understand the fund landscape — from mutual funds and ETFs to index investing and expense ratios.",
  lessons: [
    {
      id: "sm-etfs-mutual-vs-etf",
      slug: "mutual-funds-vs-etfs",
      title: "Mutual Funds vs ETFs",
      content: `## Mutual Funds vs ETFs

Mutual funds and ETFs (Exchange-Traded Funds) are both pooled investment vehicles that allow you to own a diversified basket of securities with a single purchase. They have become the dominant way most people invest — collectively holding over 30 trillion dollars in assets in the US alone. Understanding the differences helps you choose the right vehicle for your situation.

### Mutual Funds

A mutual fund pools money from many investors and invests it according to a stated objective (growth, income, balanced, sector-specific, etc.). A professional fund manager makes the buy and sell decisions.

**How they work:**
- You buy and sell shares directly from the fund company
- Shares are priced once per day at the **Net Asset Value (NAV)**, calculated after market close
- All buy and sell orders execute at the same end-of-day NAV
- Minimum investments are common (\$1,000 to \$3,000 for many funds)

**Types:**
- **Actively managed**: A fund manager selects investments to beat a benchmark (higher fees)
- **Index funds**: The fund passively tracks an index like the S&P 500 (lower fees)
- **Target-date funds**: Automatically adjust allocation based on a retirement date
- **Money market funds**: Invest in short-term, high-quality debt (cash equivalent)

### ETFs (Exchange-Traded Funds)

ETFs are similar to mutual funds but trade on stock exchanges like individual stocks. This key difference creates several practical advantages.

**How they work:**
- You buy and sell shares through your brokerage, just like stocks
- Shares trade throughout the day at market prices (which may differ slightly from NAV)
- No minimum investment — you can buy a single share (or even a fractional share)
- Most ETFs are passively managed (tracking an index)

### Key Differences

| Feature | Mutual Fund | ETF |
|---------|------------|-----|
| **Trading** | Once daily at NAV | Throughout the day at market price |
| **Minimum investment** | Often \$1,000-\$3,000 | One share (or fractional) |
| **Expense ratio** | 0.03% to 1.5%+ | 0.03% to 0.75% |
| **Tax efficiency** | Less (distributes capital gains) | More (in-kind redemption mechanism) |
| **Commissions** | Often none for proprietary funds | Usually commission-free |
| **Automatic investing** | Easy to set up recurring investments | Possible but less seamless |
| **Availability** | Through fund company or brokerage | Through any brokerage |
| **Transparency** | Holdings disclosed quarterly | Holdings typically disclosed daily |

### Tax Efficiency: ETFs' Key Advantage

ETFs have a structural tax advantage due to their "in-kind" creation and redemption mechanism. When investors redeem mutual fund shares, the fund must sell securities and potentially realize capital gains — distributed to ALL shareholders, including those who did not sell. ETFs avoid this because shares are exchanged in-kind with authorized participants, meaning the ETF rarely needs to sell securities.

This matters in taxable accounts. In tax-advantaged accounts (IRAs, 401(k)s), the difference is irrelevant.

### When to Choose Mutual Funds

- When your employer's 401(k) only offers mutual fund options
- When you want automatic, recurring investments on a set schedule
- When you prefer the simplicity of end-of-day pricing
- For actively managed strategies where the fund manager's expertise is the value proposition

### When to Choose ETFs

- In taxable brokerage accounts (tax efficiency advantage)
- When you want intraday trading flexibility
- When you want lower expense ratios
- When you want to invest smaller amounts without minimum balance requirements
- For broad market index exposure

### Key Takeaway

For most investors, the choice between mutual funds and ETFs is less important than choosing the right underlying strategy and keeping costs low. Index mutual funds and index ETFs tracking the same benchmark will produce nearly identical returns — the differences are in trading mechanics, tax treatment, and convenience. Choose the vehicle that fits your workflow, and focus your energy on asset allocation and consistent investing rather than the wrapper.`,
    },
    {
      id: "sm-etfs-index-investing",
      slug: "index-investing",
      title: "Index Investing",
      content: `## Index Investing

Index investing is the strategy of buying funds that track a broad market index rather than trying to pick individual winning stocks. It is the single most powerful evidence-based investing strategy available to individual investors, endorsed by Warren Buffett, Nobel Prize winners, and the majority of financial research.

### What is an Index?

A market index is a statistical measure that tracks the performance of a group of securities. The most important indices include:

| Index | What It Tracks | Number of Stocks |
|-------|---------------|-----------------|
| **S&P 500** | 500 largest US companies | 500 |
| **Total US Stock Market** | Entire US equity market | ~4,000 |
| **NASDAQ Composite** | All NASDAQ-listed stocks | ~3,000 |
| **Dow Jones Industrial Average** | 30 large US companies | 30 |
| **Russell 2000** | Small-cap US companies | 2,000 |
| **MSCI EAFE** | Developed international markets | ~800 |
| **MSCI Emerging Markets** | Emerging market countries | ~1,400 |
| **Bloomberg US Aggregate Bond** | US investment-grade bonds | ~10,000 |

### Why Index Investing Works

**1. Most Active Managers Underperform**
The S&P Dow Jones SPIVA scorecard consistently shows that over 15-year periods, approximately 90% of actively managed large-cap funds underperform the S&P 500 index. The number is similar across other categories.

This is not because fund managers are incompetent — it is because active management is expensive (research teams, trading costs, higher fees), and in an efficient market, it is extremely difficult to consistently identify mispriced securities after costs.

**2. Costs Are the Best Predictor of Returns**
Morningstar research found that expense ratios are the single best predictor of future fund performance — better than past returns, star ratings, or fund manager tenure. An index fund charging 0.03% starts every year with a 1%+ advantage over an active fund charging 1.1%.

Over 30 years, the compounding impact is enormous:
- \$100,000 invested at 10% return, 0.03% fee = \$1,729,000
- \$100,000 invested at 10% return, 1.00% fee = \$1,326,000
- Cost difference: \$403,000 in lost wealth

**3. Diversification Is Automatic**
An S&P 500 index fund gives you exposure to 500 companies across all sectors. A total market fund covers approximately 4,000 companies. This level of diversification is nearly impossible to replicate with individual stock picking.

**4. Tax Efficiency**
Index funds trade infrequently (only when the index changes composition), generating fewer taxable events than active funds that trade frequently.

### The Bogle Philosophy

John Bogle, founder of Vanguard, created the first index mutual fund in 1976. He advocated:
- Own the entire market through low-cost index funds
- Keep costs as low as possible
- Do not try to time the market
- Stay the course through market cycles

This philosophy has been validated by decades of evidence and has made Vanguard the largest fund company in the world.

### Common Index Fund Choices

| Fund | Ticker | Expense Ratio | What It Tracks |
|------|--------|--------------|----------------|
| Vanguard S&P 500 ETF | VOO | 0.03% | S&P 500 |
| Vanguard Total Stock Market | VTI | 0.03% | US total market |
| Vanguard Total International | VXUS | 0.07% | Non-US stocks |
| Vanguard Total Bond Market | BND | 0.03% | US bonds |
| iShares Core S&P 500 | IVV | 0.03% | S&P 500 |
| Schwab US Broad Market | SCHB | 0.03% | US total market |

### Key Takeaway

Index investing is not exciting — it is effective. By accepting market-average returns at rock-bottom costs, you will outperform the vast majority of professional money managers over the long term. The combination of low costs, broad diversification, tax efficiency, and simplicity makes index investing the optimal strategy for most investors. Your edge is not skill — it is discipline and patience.`,
    },
    {
      id: "sm-etfs-sector",
      slug: "sector-etfs",
      title: "Sector ETFs",
      content: `## Sector ETFs

While broad market index funds provide diversified exposure to the entire market, sector ETFs allow you to target specific industries or segments of the economy. They are useful for expressing views on particular sectors, tilting your portfolio toward areas you believe will outperform, or gaining exposure to themes that broad indices may underweight.

### The 11 GICS Sectors

The Global Industry Classification Standard (GICS) divides the stock market into 11 sectors:

| Sector | Major ETFs | Key Companies |
|--------|-----------|---------------|
| **Technology** | XLK, VGT | Apple, Microsoft, NVIDIA |
| **Healthcare** | XLV, VHT | UnitedHealth, J&J, Eli Lilly |
| **Financials** | XLF, VFH | Berkshire, JPMorgan, Visa |
| **Consumer Discretionary** | XLY, VCR | Amazon, Tesla, Home Depot |
| **Communication Services** | XLC | Alphabet, Meta, Netflix |
| **Industrials** | XLI, VIS | Caterpillar, Union Pacific, Honeywell |
| **Consumer Staples** | XLP, VDC | Procter & Gamble, Coca-Cola, Walmart |
| **Energy** | XLE, VDE | ExxonMobil, Chevron, ConocoPhillips |
| **Utilities** | XLU, VPU | NextEra, Duke Energy, Southern Co |
| **Real Estate** | XLRE, VNQ | Prologis, American Tower, Equinix |
| **Materials** | XLB, VAW | Linde, Sherwin-Williams, Air Products |

### Sector Rotation

Different sectors perform better at different stages of the economic cycle:

**Early Recovery (economy exiting recession):**
Best performers: Financials, Consumer Discretionary, Industrials, Technology
Worst performers: Utilities, Consumer Staples

**Mid Cycle (economy expanding):**
Best performers: Technology, Industrials, Materials
Worst performers: Utilities, Healthcare

**Late Cycle (economy overheating):**
Best performers: Energy, Materials, Healthcare
Worst performers: Technology, Consumer Discretionary

**Recession:**
Best performers: Consumer Staples, Utilities, Healthcare (defensive sectors)
Worst performers: Financials, Consumer Discretionary, Industrials

Understanding sector rotation can help you position your portfolio for different economic environments — though timing the cycle perfectly is notoriously difficult.

### Thematic ETFs

Beyond traditional sectors, thematic ETFs target specific trends:

| Theme | Example ETFs | Focus |
|-------|-------------|-------|
| Artificial Intelligence | BOTZ, ROBO, AIQ | AI and robotics companies |
| Clean Energy | ICLN, QCLN, TAN | Renewable energy producers |
| Cybersecurity | HACK, CIBR | Cybersecurity companies |
| Genomics | ARKG, GNOM | Biotechnology and genomics |
| Cloud Computing | SKYY, WCLD | Cloud infrastructure and software |
| Electric Vehicles | LIT, DRIV | EV manufacturers and supply chain |
| Blockchain | BLOK, BKCH | Blockchain and digital asset companies |

**Caution with thematic ETFs:**
- Higher expense ratios than broad market funds (0.40-0.75% vs. 0.03%)
- Narrower diversification increases volatility
- Themes can be overhyped — by the time a theme has a popular ETF, much of the returns may already be priced in
- Performance can be highly concentrated in a few holdings

### Using Sector ETFs in Your Portfolio

**Core-Satellite Approach:**
Keep 80-90% of your portfolio in broad market index funds (the "core") and use 10-20% in sector or thematic ETFs (the "satellites") to express your views on specific industries or trends.

**Overweight/Underweight:**
If your broad market fund gives you 25% technology exposure but you believe technology will outperform, you could add a technology sector ETF to bring your total tech allocation to 35%.

**Hedging:**
If your job is in technology (your income depends on the tech sector doing well), you might underweight technology in your portfolio and overweight other sectors to diversify your total economic exposure.

### Key Takeaway

Sector ETFs are precision tools — useful when you have a specific view on an industry or want to tactically position your portfolio. They should complement, not replace, your core diversified holdings. Most investors are better served by a broad market index fund with only small sector tilts rather than large, concentrated sector bets.`,
    },
    {
      id: "sm-etfs-bond-funds",
      slug: "bond-funds",
      title: "Bond Funds",
      content: `## Bond Funds

Bond funds provide exposure to the fixed income market without the complexity of buying individual bonds. They are a core building block for the fixed income portion of your portfolio, offering diversification across hundreds or thousands of bonds with a single purchase.

### Why Use Bond Funds Instead of Individual Bonds?

**Diversification**: A single bond fund may hold thousands of individual bonds. If one issuer defaults, the impact on your portfolio is minimal.

**Accessibility**: Individual bonds often require minimum purchases of 1,000 to 10,000 dollars per bond. Bond funds can be purchased for the price of a single share.

**Professional management**: Bond fund managers handle credit analysis, duration management, and reinvestment of coupons.

**Liquidity**: You can sell bond fund shares any time the market is open. Individual bonds can be illiquid and difficult to sell at a fair price.

### Types of Bond Funds

**By Credit Quality:**

| Type | Credit Rating | Risk | Yield |
|------|-------------|------|-------|
| **Treasury funds** | AAA (US government) | Lowest | Lowest |
| **Investment-grade corporate** | BBB- or higher | Low to moderate | Moderate |
| **High-yield (junk)** | Below BBB- | Higher | Higher |
| **Municipal** | Varies | Low to moderate | Tax-free yield |

**By Duration:**

| Type | Duration | Interest Rate Sensitivity | Example ETFs |
|------|----------|--------------------------|-------------|
| **Short-term** (1-3 years) | Low | Low | SHY, BSV, VCSH |
| **Intermediate** (3-10 years) | Medium | Medium | IEF, BIV, BND |
| **Long-term** (10+ years) | High | High | TLT, BLV, VGLT |

Duration is a critical concept: for every 1% change in interest rates, a bond fund's price changes approximately by its duration percentage. A fund with 7-year duration would lose approximately 7% of its value if rates rise 1%.

**By Geography:**

| Type | Description | Example ETFs |
|------|-------------|-------------|
| US bonds | Domestic fixed income | BND, AGG |
| International bonds | Non-US bonds, currency risk | BNDX, IAGG |
| Emerging market bonds | Higher yield, higher risk | EMB, VWOB |

### Key Bond Fund Metrics

**Yield to Maturity (YTM)**: The total expected return if all bonds in the fund are held to maturity. This is the best estimate of the fund's future annual return.

**Duration**: Measures sensitivity to interest rate changes. Higher duration = more interest rate risk.

**Credit quality**: The average credit rating of the bonds in the fund.

**Expense ratio**: Annual management fee. For index bond funds, this should be below 0.10%.

**SEC yield**: A standardized yield calculation that allows fair comparison across bond funds.

### Bond Funds vs. Individual Bonds

A key difference: individual bonds return your principal at maturity (assuming no default). Bond funds never mature — they continuously buy and sell bonds. This means:

- In a rising rate environment, bond fund prices fall, but the fund gradually reinvests at higher yields
- In a falling rate environment, bond fund prices rise, but reinvestment occurs at lower yields
- Over time, the total return of a bond fund approximates its yield at purchase — but the path can be volatile

For investors who need a specific dollar amount at a specific future date, individual bonds or bond ladders may be more appropriate. For everyone else, bond funds provide simpler, more diversified exposure.

### Recommended Core Bond Funds

| Fund | Ticker | Expense | Duration | What It Tracks |
|------|--------|---------|----------|----------------|
| Vanguard Total Bond Market | BND | 0.03% | 6.5 years | US aggregate bond index |
| iShares Core US Aggregate | AGG | 0.03% | 6.3 years | US aggregate bond index |
| Vanguard Short-Term Bond | BSV | 0.04% | 2.6 years | Short-term US bonds |
| Vanguard Total International Bond | BNDX | 0.07% | 7.0 years | Non-US bonds (hedged) |
| Vanguard Infl-Protected Secs | VTIP | 0.04% | 2.5 years | Short-term TIPS |

### Key Takeaway

Bond funds serve a vital role in portfolio construction — they provide income, reduce volatility, and act as a counterbalance to stocks during market downturns. For most investors, a broad market bond index fund (BND or AGG) is all you need for the fixed income portion of your portfolio. Keep it simple, keep costs low, and let the diversification work.`,
    },
    {
      id: "sm-etfs-expense-ratios",
      slug: "expense-ratios",
      title: "Understanding Expense Ratios",
      content: `## Understanding Expense Ratios

The expense ratio is the annual fee a fund charges its investors, expressed as a percentage of assets under management. It is the single most important number to check before investing in any fund, because it directly reduces your returns every year for as long as you hold the fund. Over decades, even small differences in expense ratios compound into enormous differences in wealth.

### What the Expense Ratio Covers

The expense ratio includes:
- **Management fees**: Compensation for the fund manager and research team
- **Administrative costs**: Record-keeping, customer service, accounting
- **Distribution fees (12b-1)**: Marketing and distribution costs
- **Other operating expenses**: Legal, audit, regulatory compliance

It does NOT include:
- Trading commissions (the cost of buying/selling securities within the fund)
- Sales loads (upfront or back-end charges on some mutual funds)
- Bid-ask spreads (for ETFs)

### How Expense Ratios Reduce Returns

The expense ratio is deducted continuously from fund assets — you never write a check for it. If a fund's gross return is 10% and the expense ratio is 1%, your net return is approximately 9%.

This may seem small, but compound it over 30 years:

| Initial Investment | Annual Return | Expense Ratio | Value After 30 Years |
|-------------------|--------------|---------------|---------------------|
| \$100,000 | 10% | 0.03% | \$1,726,000 |
| \$100,000 | 10% | 0.20% | \$1,668,000 |
| \$100,000 | 10% | 0.50% | \$1,567,000 |
| \$100,000 | 10% | 1.00% | \$1,396,000 |
| \$100,000 | 10% | 1.50% | \$1,243,000 |

The difference between a 0.03% fund and a 1.50% fund is \$483,000 — nearly 5 times the original investment — lost purely to fees.

### Expense Ratio Ranges

| Fund Type | Typical Expense Ratio |
|-----------|---------------------|
| Broad market index ETFs | 0.03 - 0.10% |
| Sector/thematic ETFs | 0.10 - 0.75% |
| Actively managed equity mutual funds | 0.50 - 1.50% |
| Target-date funds | 0.10 - 0.75% |
| Bond index funds | 0.03 - 0.15% |
| Actively managed bond funds | 0.30 - 0.80% |
| Hedge funds | 1.5% management + 20% performance |

The trend over the past two decades has been dramatically downward. Competition between Vanguard, iShares (BlackRock), and Schwab has pushed broad market index fund fees to near zero.

### The Price War

The "fee war" among major fund providers has been a massive win for investors:

- 2000: Average equity fund expense ratio was 0.99%
- 2010: Average dropped to 0.73%
- 2020: Average dropped to 0.41%
- Today: The cheapest broad market funds charge just 0.03%

Vanguard's Total Stock Market Index Fund (VTI) charges 0.03%, meaning you pay 3 dollars per year for every 10,000 dollars invested. This is essentially free professional portfolio management.

### When Higher Fees Might Be Justified

In rare cases, higher expense ratios can be worth paying:
- **Niche strategies** that cannot be replicated cheaply (some emerging market, small-cap, or alternative strategies)
- **Active management with a proven track record** of consistent outperformance (very rare and difficult to identify in advance)
- **Tax management** strategies that save more in taxes than they charge in fees

However, research consistently shows that on average, higher fees do not lead to higher returns. In fact, the opposite is true — higher-fee funds underperform lower-fee funds as a group.

### How to Check Expense Ratios

- **Fund prospectus**: The official document lists all fees
- **Fund company website**: Usually displayed prominently on the fund page
- **Morningstar**: Provides expense ratios and comparisons to category averages
- **Your brokerage**: Most display expense ratios on the fund research page

### The Simple Rule

When choosing between two funds that track the same index or similar strategy:

**Always choose the one with the lower expense ratio.**

There is no reason to pay 0.15% for an S&P 500 fund when you can get one for 0.03%. The underlying holdings are identical — you are paying 5 times more for the same product.

### Key Takeaway

Expense ratios are the most reliable predictor of fund performance. Lower fees compound into significantly more wealth over time. For core portfolio holdings, target expense ratios below 0.10%. Every basis point counts, and in the era of ultra-low-cost index funds, there is no reason to overpay. Treat expense ratios like gravity — they are always pulling your returns down, so minimize their force.`,
    },
  ],
};

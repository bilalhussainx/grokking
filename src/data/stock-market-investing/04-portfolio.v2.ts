import { Module } from "../types";

export const portfolioModule: Module = {
  id: "sm-portfolio",
  title: "Portfolio Management",
  description: "Learn Modern Portfolio Theory, diversification, asset allocation, and how to build a portfolio that matches your risk tolerance.",
  lessons: [
    {
      id: "sm-portfolio-mpt",
      slug: "modern-portfolio-theory",
      title: "Modern Portfolio Theory",
      content: `## Modern Portfolio Theory

Modern Portfolio Theory (MPT), developed by Harry Markowitz in 1952, revolutionized investing by proving mathematically that diversification reduces risk without necessarily reducing returns. Before MPT, investors evaluated stocks individually. MPT showed that what matters is how investments behave together — as a portfolio.

### The Core Insight

MPT's central insight is that the risk of a portfolio is not simply the average risk of its individual holdings. By combining assets that do not move in perfect lockstep, the overall portfolio risk can be reduced below the risk of any individual component.

This seems counterintuitive at first: how can adding a risky asset to a portfolio reduce total risk? The answer lies in **correlation**. When one asset zigs while another zags, the overall portfolio smooths out.

### Risk and Return

MPT defines risk as **volatility** — measured by standard deviation. Higher standard deviation means larger price swings (both up and down).

| Asset Class | Typical Annual Return | Typical Annual Volatility |
|------------|----------------------|--------------------------|
| US Large Cap Stocks | 10-11% | 15-16% |
| US Small Cap Stocks | 11-12% | 20-22% |
| International Stocks | 8-10% | 17-19% |
| US Bonds | 4-6% | 5-7% |
| Treasury Bills | 2-4% | 1-2% |
| Real Estate (REITs) | 9-11% | 18-20% |

### The Power of Diversification

Consider two assets:
- Asset A: 10% expected return, 20% volatility
- Asset B: 10% expected return, 20% volatility
- Correlation between A and B: 0.3

A portfolio of 50% A and 50% B would have:
- Expected return: 10% (same as each individual asset)
- Portfolio volatility: approximately 16% (significantly less than 20%)

You achieved the same return with 20% less risk — purely through diversification. This is the "free lunch" of investing.

### The Efficient Frontier

Markowitz showed that for any given level of risk, there is an optimal combination of assets that maximizes expected return. The set of all optimal portfolios forms the **efficient frontier** — a curved line on a risk-return chart.

Portfolios on the efficient frontier are "efficient" — you cannot get a higher return without accepting more risk, and you cannot reduce risk without accepting a lower return. Portfolios below the frontier are "inefficient" — you could do better at the same risk level.

### Key Assumptions and Limitations

MPT makes several assumptions that do not perfectly hold in practice:

1. **Investors are rational**: In reality, behavioral biases drive many decisions
2. **Markets are efficient**: In reality, mispricings exist (which is why active management can sometimes add value)
3. **Returns follow a normal distribution**: In reality, extreme events (crashes) happen more often than a normal distribution predicts ("fat tails")
4. **Correlations are stable**: In reality, correlations tend to increase during market crises — precisely when diversification is most needed

Despite these limitations, MPT provides a powerful framework for thinking about portfolio construction. The core insight — that diversification reduces risk — is universally accepted.

### Practical Application

You do not need to calculate efficient frontiers to benefit from MPT:

1. **Diversify across asset classes**: Stocks, bonds, real estate, international
2. **Diversify within asset classes**: Large cap, small cap, growth, value, different sectors
3. **Consider correlations**: Assets that move independently provide more diversification benefit
4. **Match risk to your tolerance**: More stocks for higher risk tolerance, more bonds for lower
5. **Rebalance periodically**: Drift back to target allocations as markets move

### Key Takeaway

Modern Portfolio Theory formalized the intuition that you should not put all your eggs in one basket. By combining assets with imperfect correlations, you can achieve a better risk-return trade-off than holding any single asset. While the real world is messier than MPT's assumptions, the core principle remains the foundation of professional portfolio management.`,
    },
    {
      id: "sm-portfolio-diversification",
      slug: "diversification-correlation",
      title: "Diversification & Correlation",
      content: `## Diversification & Correlation

Diversification is the most reliable risk management tool available to investors. It does not guarantee against losses, but it ensures that a single bad investment will not devastate your entire portfolio. The effectiveness of diversification depends on **correlation** — how assets move relative to each other.

### Understanding Correlation

Correlation is measured on a scale from -1.0 to +1.0:

| Correlation | Meaning | Diversification Benefit |
|-------------|---------|------------------------|
| **+1.0** | Assets move perfectly together | Zero benefit |
| **+0.5** | Assets move somewhat together | Moderate benefit |
| **0.0** | No relationship between movements | Strong benefit |
| **-0.5** | Assets tend to move opposite | Very strong benefit |
| **-1.0** | Assets move perfectly opposite | Maximum benefit |

For diversification to work, you need assets with low or negative correlations. Holding 10 tech stocks is not true diversification because they tend to move together (high correlation). Holding a mix of stocks, bonds, real estate, and commodities provides real diversification.

### Asset Class Correlations

Historical correlations between major asset classes (approximate):

| | US Stocks | Int'l Stocks | US Bonds | Real Estate | Commodities | Gold |
|--|-----------|-------------|----------|-------------|-------------|------|
| **US Stocks** | 1.0 | 0.7 | -0.1 | 0.6 | 0.2 | 0.0 |
| **Int'l Stocks** | 0.7 | 1.0 | 0.0 | 0.5 | 0.3 | 0.1 |
| **US Bonds** | -0.1 | 0.0 | 1.0 | 0.1 | -0.1 | 0.3 |
| **Real Estate** | 0.6 | 0.5 | 0.1 | 1.0 | 0.2 | 0.1 |

The key relationship: US stocks and US bonds have near-zero or slightly negative correlation, which is why the classic stock-bond portfolio has endured for decades.

### How Much Diversification is Enough?

Research shows that diversification benefits follow a curve of diminishing returns:

- **1 stock**: Very high company-specific risk
- **5 stocks**: Eliminates about 50% of company-specific risk
- **15-20 stocks**: Eliminates about 85-90% of company-specific risk
- **30+ stocks**: Eliminates nearly all company-specific risk
- **Beyond 30**: Minimal additional diversification benefit

However, this only eliminates **company-specific (unsystematic) risk** — the risk that a particular company underperforms. **Market (systematic) risk** — the risk that the entire market declines — cannot be diversified away within a single asset class. To reduce market risk, you need diversification across asset classes.

### Diversification Across Multiple Dimensions

**By Asset Class**: Stocks, bonds, real estate, commodities, cash
**By Geography**: US, developed international, emerging markets
**By Market Cap**: Large cap, mid cap, small cap
**By Style**: Growth, value, blend
**By Sector**: Technology, healthcare, financials, consumer, energy, etc.
**By Time**: Dollar-cost averaging spreads purchase timing risk

### The Correlation Trap in Crises

A critical limitation: correlations tend to increase during market crises. In the 2008 financial crisis, assets that were normally uncorrelated moved down together as investors sold everything for cash. This means diversification provides less protection exactly when you need it most.

Strategies to mitigate this:
- Hold some truly uncorrelated assets (Treasury bonds, gold)
- Maintain a cash reserve for buying opportunities during panic
- Do not rely solely on diversification — also manage position sizes
- Understand that diversification reduces but does not eliminate drawdowns

### Concentration vs. Diversification

There is a debate between concentration (owning few stocks that you know deeply) and diversification (owning many stocks to spread risk):

| Approach | Pro | Con |
|----------|-----|-----|
| **Concentrated (5-15 stocks)** | Larger gains if right; deeper knowledge | Larger losses if wrong; more volatile |
| **Diversified (30+ stocks or funds)** | Lower volatility; protection from mistakes | Harder to beat the market; diluted winners |
| **Index fund** | Maximum diversification, lowest cost | Returns match the market, never exceed it |

Warren Buffett advocates concentration for knowledgeable investors: "Diversification is protection against ignorance. It makes little sense if you know what you are doing." However, most individual investors benefit from broader diversification because few have Buffett's analytical edge.

### Key Takeaway

Diversification is not about owning more things — it is about owning things that behave differently. A portfolio of 50 stocks that all move together provides less protection than a portfolio of 15 assets across different classes with low correlations. Focus on building a portfolio where the components complement each other, so when one zigging keeps you afloat while another is zagging.`,
    },
    {
      id: "sm-portfolio-asset-allocation",
      slug: "asset-allocation",
      title: "Asset Allocation",
      content: `## Asset Allocation

Asset allocation — the decision of how to divide your portfolio among different asset classes — is the single most important investment decision you will make. Studies consistently show that asset allocation explains approximately 90% of the variation in portfolio returns over time. Stock picking and market timing matter far less than getting the allocation right.

### Why Allocation Beats Stock Picking

The landmark Brinson, Hood, and Beebower study (1986, updated 1991) analyzed 91 large pension plans and found that asset allocation explained 91.5% of the variation in quarterly returns. Security selection and market timing explained the rest.

This does not mean stock picking is irrelevant — within the equity allocation, choosing good stocks can add value. But the decision to be 80% stocks and 20% bonds versus 50/50 will have a far greater impact on your long-term wealth than choosing between individual stocks within either allocation.

### Determinants of Your Allocation

Your optimal allocation depends on three personal factors:

**1. Time Horizon**
The longer your time horizon, the more risk (equities) you can afford:

| Time Horizon | Suggested Equity Allocation |
|-------------|---------------------------|
| 30+ years | 80-100% |
| 20-30 years | 70-90% |
| 10-20 years | 50-70% |
| 5-10 years | 30-50% |
| < 5 years | 0-30% |

Why does a longer horizon justify more equities? Because stocks are volatile in the short term but have historically always produced positive returns over periods of 15+ years. Short-term investors cannot afford to wait out a drawdown; long-term investors can.

**2. Risk Tolerance**
Your psychological ability to withstand portfolio declines without panic-selling. If a 30% drawdown would cause you to sell everything at the bottom, you need more bonds and less equity — regardless of what the math says.

**3. Financial Situation**
Stable income, low expenses, and no short-term cash needs allow a more aggressive allocation. Unstable income, high expenses, or upcoming large expenditures (house purchase, tuition) require a more conservative allocation.

### Classic Allocation Models

| Model | Stocks | Bonds | Description |
|-------|--------|-------|-------------|
| **Aggressive** | 90% | 10% | For young investors with long horizons |
| **Growth** | 75% | 25% | Balanced growth with some stability |
| **Moderate** | 60% | 40% | Classic balanced portfolio |
| **Conservative** | 40% | 60% | Capital preservation with some growth |
| **Income** | 20% | 80% | Near-retirees or income-focused |

### Sub-Allocation Within Asset Classes

The stock/bond split is the first decision. Within each category:

**Equities:**
- US large cap: 40-60% of equity allocation
- US small/mid cap: 10-20%
- International developed: 20-30%
- Emerging markets: 5-15%

**Fixed Income:**
- US aggregate bonds: 50-70% of bond allocation
- Treasury bonds: 20-30%
- International bonds: 10-20%
- TIPS (inflation-protected): 10-20%

**Alternative Assets (optional, 5-20% of total):**
- Real estate (REITs)
- Commodities
- Gold
- Other alternatives

### The Lifecycle Approach

The simplest approach adjusts allocation based on age:

**Rule of thumb: Bond allocation = Your age**

A 30-year-old would hold 30% bonds and 70% stocks. A 60-year-old would hold 60% bonds and 40% stocks.

Target-date funds (like Vanguard Target 2060 or Fidelity Freedom 2055) automate this by gradually shifting from stocks to bonds as the target retirement date approaches. This "glide path" removes the need for manual rebalancing.

### Implementation

You can implement any allocation with just 3-4 low-cost index funds:

1. **US Total Stock Market** (VTI, FSKAX) — covers all US stocks
2. **International Stock Market** (VXUS, FTIHX) — covers non-US stocks
3. **US Total Bond Market** (BND, FXNAX) — covers US bonds
4. **Optional: International Bonds** (BNDX) — covers non-US bonds

This "three-fund portfolio" is endorsed by countless financial advisors and investing experts. It provides global diversification at rock-bottom cost.

### Key Takeaway

Asset allocation is the architecture of your portfolio — it determines your risk, return, and how your wealth grows over time. Getting the big picture right (how much in stocks vs. bonds) matters more than any individual security selection. Start with your time horizon and risk tolerance, choose a simple allocation, implement it with low-cost index funds, and rebalance periodically. Complexity is the enemy of execution.`,
    },
    {
      id: "sm-portfolio-rebalancing",
      slug: "rebalancing",
      title: "Portfolio Rebalancing",
      content: `## Portfolio Rebalancing

Rebalancing is the process of adjusting your portfolio back to its target asset allocation after market movements have caused it to drift. It is one of the most important — and most counterintuitive — disciplines in investing, because it requires you to sell winners and buy losers. This systematic approach enforces the "buy low, sell high" principle that human emotion works against.

### Why Portfolios Drift

Suppose you start with a 70/30 stock/bond allocation. After a strong year for stocks:

| Asset | Starting Value | After 20% Stock Gain | New Weight |
|-------|---------------|---------------------|------------|
| Stocks | $70,000 | $84,000 | 76% |
| Bonds | $30,000 | $31,500 (5% gain) | 24% |
| **Total** | **$100,000** | **$115,500** | **100%** |

Your portfolio has drifted from 70/30 to 76/24. You are now taking more risk than intended. After a year of stock declines, the opposite happens — you become more conservative than intended, missing recovery gains.

### The Rebalancing Process

To rebalance back to 70/30:

Target stock allocation: 70% of $115,500 = $80,850
Current stock value: $84,000
Action: Sell $3,150 of stocks, buy $3,150 of bonds

After rebalancing:
- Stocks: $80,850 (70%)
- Bonds: $34,650 (30%)

### Rebalancing Methods

**1. Calendar-Based Rebalancing**
Rebalance at fixed intervals regardless of how far the portfolio has drifted.

| Frequency | Pros | Cons |
|-----------|------|------|
| Annual | Simple, low cost | May allow significant drift |
| Semi-annual | Balance of simplicity and control | Moderate effort |
| Quarterly | Tighter drift control | More frequent trading, higher costs |
| Monthly | Maximum control | Excessive trading, diminishing benefits |

Research suggests that annual or semi-annual rebalancing captures most of the benefit with minimal cost.

**2. Threshold-Based Rebalancing**
Rebalance only when an allocation drifts beyond a predefined band. For example, with a 5% threshold on a 70% stock target, you rebalance when stocks exceed 75% or fall below 65%.

This approach is more responsive than calendar-based rebalancing and avoids unnecessary trades when the portfolio is close to target.

**3. Combined Approach**
Check allocations on a calendar basis but only rebalance if drift exceeds a threshold. For example: "Review quarterly; rebalance if any asset class is more than 5% from target." This is the most practical approach for most investors.

### The Counterintuitive Discipline

Rebalancing works because it forces you to systematically:
- Sell assets that have risen (potentially overvalued)
- Buy assets that have fallen (potentially undervalued)

This is the opposite of what most investors do emotionally (chase winners, abandon losers). Over decades, this disciplined approach has been shown to add 0.5-1.0% in annualized returns compared to portfolios that are never rebalanced.

### Tax-Efficient Rebalancing

In taxable accounts, selling winners triggers capital gains taxes. Strategies to minimize tax impact:

1. **Rebalance with new contributions**: Direct new investments to the underweight asset class
2. **Rebalance in tax-advantaged accounts**: Do your selling and buying in IRAs and 401(k)s where there are no immediate tax consequences
3. **Tax-loss harvesting**: If one asset class is below its purchase price, sell it (realize the loss for tax benefit) and buy a similar fund
4. **Use dividends and distributions**: Direct these to the underweight asset class instead of reinvesting in the same fund

### When Not to Rebalance

- When drift is minimal (within 2-3% of target)
- When transaction costs would exceed the benefit
- When it would trigger significant short-term capital gains (in taxable accounts)
- When market conditions suggest a brief, temporary move that will self-correct

### Key Takeaway

Rebalancing is a discipline that keeps your risk level consistent and systematically enforces rational investment behavior. Set a target allocation, choose a rebalancing method (calendar, threshold, or combined), and stick to it regardless of market conditions. The process is simple; the discipline is hard. But over decades, it is one of the most reliable sources of incremental return available to individual investors.`,
    },
    {
      id: "sm-portfolio-efficient-frontier",
      slug: "efficient-frontier",
      title: "The Efficient Frontier",
      content: `## The Efficient Frontier

The efficient frontier is a visual representation of the optimal set of portfolios that offer the highest expected return for a given level of risk. Developed by Harry Markowitz as part of Modern Portfolio Theory, it provides a theoretical framework for understanding the trade-off between risk and return and for constructing optimal portfolios.

### Understanding the Chart

The efficient frontier is plotted on a chart with:
- **X-axis**: Risk (measured by standard deviation or volatility)
- **Y-axis**: Expected return

Every possible combination of assets can be plotted as a single point on this chart. The collection of all these points forms a cloud shape. The efficient frontier is the **upper-left boundary** of this cloud — the curve representing the best possible risk-return combinations.

### Properties of the Efficient Frontier

**Portfolios ON the frontier** are optimal — you cannot improve return without accepting more risk, and you cannot reduce risk without accepting lower return.

**Portfolios BELOW the frontier** are suboptimal — for the same level of risk, you could achieve a higher return, or you could achieve the same return with less risk.

**Portfolios ABOVE the frontier** do not exist — they represent returns that are not achievable given the available assets.

### The Minimum Variance Portfolio

The leftmost point on the efficient frontier is the **minimum variance portfolio** — the combination of assets that produces the lowest possible risk. This is not necessarily 100% bonds. Because of diversification effects, combining assets with low correlations can produce a portfolio with lower volatility than any single asset.

### The Capital Market Line

When you add a risk-free asset (like Treasury bills) to the mix, the efficient frontier transforms into a straight line called the **Capital Market Line (CML)**. The CML extends from the risk-free rate to a tangent point on the efficient frontier called the **tangency portfolio** (or market portfolio).

\`\`\`
CML: Expected Return = Risk-Free Rate + (Market Return - Risk-Free Rate) / Market Vol x Portfolio Vol
\`\`\`

The key insight: every investor should hold a combination of the risk-free asset and the tangency portfolio. The only difference between conservative and aggressive investors is the proportion:
- Conservative: More risk-free asset, less tangency portfolio
- Aggressive: Less risk-free asset, more tangency portfolio (possibly leveraged)

This is called the **two-fund separation theorem** — a profound result showing that all investors should hold the same risky portfolio, just in different proportions.

### Building the Efficient Frontier in Practice

To construct the efficient frontier, you need three inputs for each asset class:
1. Expected return
2. Expected volatility (standard deviation)
3. Correlations with every other asset class

With these inputs, optimization software calculates the portfolio weights that maximize return for each level of risk.

**Practical challenge**: These inputs must be estimated from historical data or forward-looking assumptions, and small changes in expected returns can dramatically shift the optimal allocation. This estimation error is the primary limitation of formal mean-variance optimization.

### The Sharpe Ratio

The **Sharpe ratio** measures risk-adjusted return:

\`\`\`
Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Volatility
\`\`\`

The tangency portfolio has the highest possible Sharpe ratio — it is the most efficient portfolio of risky assets. A higher Sharpe ratio means more return per unit of risk. It is the single most important metric for evaluating portfolio efficiency.

| Sharpe Ratio | Interpretation |
|-------------|---------------|
| < 0.5 | Below average |
| 0.5 - 1.0 | Acceptable |
| 1.0 - 1.5 | Good |
| > 1.5 | Excellent |

### Limitations in Practice

1. **Estimation error**: Small changes in expected return assumptions can dramatically change the "optimal" portfolio
2. **Unstable correlations**: Historical correlations may not persist, especially during crises
3. **Non-normal returns**: Real returns have fat tails (extreme events are more common than the model predicts)
4. **Transaction costs and taxes**: The model ignores these real-world frictions
5. **Static analysis**: The frontier represents a single point in time, not a dynamic evolving market

### The Practical Takeaway

Most individual investors should not try to precisely optimize their portfolios on the efficient frontier — the estimation errors make exact optimization unreliable. Instead, use the concept directionally:

- Diversify across asset classes with low correlations to push your portfolio toward the frontier
- Evaluate your current portfolio's position — are you taking unnecessary risk for your expected return?
- Use the Sharpe ratio to compare different allocation strategies
- Remember that the goal is not perfection but improvement — moving closer to the frontier is always beneficial

### Key Takeaway

The efficient frontier is a powerful conceptual tool that illustrates the fundamental truth of investing: risk and return are related, but diversification allows you to get more return per unit of risk. While exact optimization is impractical, the framework guides sound portfolio construction decisions — diversify broadly, avoid unnecessary risk, and focus on the overall portfolio rather than individual holdings.`,
    },
  ],
};

import { Module } from "../types";

export const alternativeModule: Module = {
  id: "sm-alternative",
  title: "Alternative Investments",
  description:
    "Explore investments beyond stocks and bonds — REITs, commodities, crypto, private equity, and hedge fund strategies.",
  lessons: [
    {
      id: "sm-alternative-reits",
      slug: "reits",
      title: "Real Estate Investment Trusts (REITs)",
      content: `## Real Estate Investment Trusts (REITs)

REITs allow you to invest in real estate without buying, managing, or financing properties directly. A REIT is a company that owns, operates, or finances income-producing real estate. By law, REITs must distribute at least 90% of their taxable income as dividends, making them popular among income-seeking investors.

### How REITs Work

REITs pool investor capital to buy and manage real estate properties. They generate revenue primarily through rents and, in some cases, interest on real estate debt. Because they must distribute most of their income, REITs typically offer above-average dividend yields.

**Legal requirements to qualify as a REIT:**
- Invest at least 75% of assets in real estate, cash, or US Treasuries
- Derive at least 75% of gross income from rents, mortgage interest, or real estate sales
- Distribute at least 90% of taxable income as dividends
- Have at least 100 shareholders
- No more than 50% of shares held by 5 or fewer individuals

### Types of REITs

**Equity REITs** (most common): Own and operate income-producing properties. Revenue comes from collecting rents.

| Sector | Examples | Characteristics |
|--------|----------|----------------|
| **Residential** | Apartments, single-family rentals | Stable demand, recession-resistant |
| **Office** | Corporate office buildings | Tied to employment and WFH trends |
| **Retail** | Shopping centers, malls | Disrupted by e-commerce |
| **Industrial** | Warehouses, distribution centers | Benefiting from e-commerce growth |
| **Healthcare** | Hospitals, senior living | Aging population tailwind |
| **Data Centers** | Server facilities | Driven by cloud computing and AI |
| **Cell Towers** | Wireless infrastructure | Long-term contracts, mission-critical |
| **Self-Storage** | Storage facilities | Recession-resistant, fragmented market |

**Mortgage REITs (mREITs)**: Do not own properties — they own mortgages and mortgage-backed securities. Revenue comes from the spread between borrowing costs and mortgage yields. More volatile and interest-rate-sensitive than equity REITs.

**Hybrid REITs**: Own both properties and mortgages.

### REIT Valuation Metrics

Traditional metrics like P/E do not work well for REITs because depreciation (a major non-cash expense for property owners) distorts net income. Instead, use:

**FFO (Funds From Operations)**: Net income plus depreciation and amortization, minus gains on property sales. The standard earnings metric for REITs.

**AFFO (Adjusted Funds From Operations)**: FFO minus maintenance capital expenditures and straight-line rent adjustments. A better measure of sustainable cash flow.

**Price/FFO**: The REIT equivalent of P/E. Compare to sector averages.

**NAV (Net Asset Value)**: The estimated value of the REIT's properties minus liabilities. Compare to the stock price to see if the REIT trades at a premium or discount to its asset value.

### Benefits of REIT Investing

- **Income**: Higher dividend yields than most stocks (typically 3-6%)
- **Diversification**: Low correlation with stocks and bonds over long periods
- **Inflation hedge**: Rents tend to rise with inflation
- **Liquidity**: Publicly traded REITs are as liquid as any stock (unlike physical real estate)
- **Professional management**: Expert property managers handle operations

### Risks

- **Interest rate sensitivity**: Higher rates increase borrowing costs and make REIT dividends less attractive relative to bonds
- **Sector concentration**: Each REIT type faces unique risks (office REITs and remote work, retail REITs and e-commerce)
- **Leverage**: REITs typically use significant debt, amplifying both returns and risks
- **Tax treatment**: REIT dividends are generally taxed as ordinary income (not the preferential qualified dividend rate), making them less tax-efficient in taxable accounts

### How to Invest in REITs

| Vehicle | Examples | Pros | Cons |
|---------|---------|------|------|
| Individual REITs | Prologis, American Tower | Pick specific sectors | Concentrated risk |
| REIT ETFs | VNQ, XLRE, SCHH | Broad diversification | Less sector control |
| REIT mutual funds | VGSLX, FRESX | Automatic investing | Higher minimums |

### Key Takeaway

REITs provide access to real estate returns with the liquidity and simplicity of stock investing. They are a valuable portfolio diversifier and income source. For most investors, a broad REIT ETF like VNQ (Vanguard Real Estate ETF) provides efficient exposure. Hold REITs in tax-advantaged accounts when possible to avoid the tax drag on dividends.`,
    },
    {
      id: "sm-alternative-commodities",
      slug: "commodities",
      title: "Commodities",
      content: `## Commodities

Commodities are physical goods — metals, energy products, and agricultural products — that are traded on global markets. They represent the raw materials that power the economy, and they behave very differently from stocks and bonds. Adding commodity exposure to a portfolio can improve diversification and provide a hedge against inflation.

### Major Commodity Categories

| Category | Examples | Key Drivers |
|----------|---------|-------------|
| **Energy** | Crude oil, natural gas, gasoline | Supply/demand, geopolitics, weather |
| **Precious Metals** | Gold, silver, platinum | Inflation, interest rates, safe-haven demand |
| **Industrial Metals** | Copper, aluminum, iron ore | Economic growth, construction, manufacturing |
| **Agriculture** | Corn, wheat, soybeans, coffee, cotton | Weather, crop yields, trade policies |
| **Livestock** | Cattle, hogs | Feed costs, disease, consumer demand |

### Why Invest in Commodities?

**Inflation hedge**: Commodity prices tend to rise when inflation rises because they are the inputs that drive consumer prices higher. When your grocery bill increases, it is because agricultural commodity prices rose. When gas prices spike, crude oil is the driver.

**Diversification**: Commodities have historically low correlation with stocks and bonds. During the 2000-2002 stock bear market, commodities delivered positive returns. During the 2022 inflation spike, commodities surged while both stocks and bonds fell.

**Geopolitical hedge**: Commodity prices (especially oil) react to geopolitical events — wars, sanctions, supply disruptions. Commodity exposure can offset losses in other parts of your portfolio during these events.

### How to Invest in Commodities

**Commodity ETFs**: The simplest approach for most investors.

| ETF | What It Tracks | Expense Ratio |
|-----|---------------|---------------|
| GLD | Gold (physical) | 0.40% |
| IAU | Gold (physical) | 0.25% |
| SLV | Silver (physical) | 0.50% |
| USO | Crude oil (futures) | 0.81% |
| DBC | Broad commodity basket | 0.87% |
| GSG | Broad commodity index | 0.75% |
| PDBC | Broad commodities (active) | 0.59% |

**Physical ownership**: For precious metals, you can buy physical gold and silver coins or bars. Provides no counterparty risk but requires secure storage and insurance.

**Commodity futures**: Direct futures trading is available through specialized brokerages. This is complex and not recommended for most individual investors due to leverage, contango/backwardation effects, and the need for active roll management.

**Commodity producer stocks**: Buy shares of companies that produce commodities — mining companies, oil companies, agricultural firms. These provide leveraged exposure to commodity prices but also carry company-specific risks.

### The Contango Problem

Most commodity ETFs that use futures contracts (rather than physical holdings) face a structural headwind called **contango**. When the futures price is higher than the current spot price, the fund loses money every time it "rolls" from an expiring contract to a more expensive one.

This means long-term returns from futures-based commodity ETFs can significantly underperform the actual commodity price change. Gold ETFs that hold physical gold (GLD, IAU) avoid this problem, which is one reason they are the most popular commodity ETFs.

### How Much to Allocate

Most financial advisors recommend 5-10% of a portfolio in commodities for diversification purposes. More than that creates excessive exposure to a volatile, non-income-producing asset class.

A simple approach: 5% allocation to a broad commodity ETF or a gold ETF alongside your core stock and bond holdings.

### Key Takeaway

Commodities add a unique dimension to a portfolio — inflation protection, geopolitical hedging, and diversification from financial assets. However, they are volatile, do not produce income, and can be subject to structural costs (contango). For most investors, a small allocation through a low-cost ETF is sufficient to capture the diversification benefits without excessive exposure to commodity-specific risks.`,
    },
    {
      id: "sm-alternative-crypto",
      slug: "crypto-basics",
      title: "Cryptocurrency Basics",
      content: `## Cryptocurrency Basics

Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on decentralized networks — typically blockchains. Since Bitcoin's launch in 2009, crypto has grown from a niche technology experiment to a trillion-dollar asset class that institutional investors, corporations, and governments can no longer ignore.

### What is a Blockchain?

A blockchain is a distributed digital ledger that records transactions across a network of computers. Key properties:

- **Decentralized**: No single entity controls the network
- **Immutable**: Once recorded, transactions cannot be altered
- **Transparent**: Anyone can verify the transaction history
- **Trustless**: Participants do not need to trust each other; they trust the protocol

Bitcoin's blockchain solves the "double-spending problem" — preventing someone from sending the same digital currency to two people — without requiring a central authority.

### Major Cryptocurrencies

| Cryptocurrency | Ticker | Purpose | Market Position |
|---------------|--------|---------|----------------|
| **Bitcoin** | BTC | Digital store of value, "digital gold" | Largest by market cap |
| **Ethereum** | ETH | Smart contract platform, decentralized applications | Second largest |
| **Solana** | SOL | High-speed smart contract platform | Major layer-1 competitor |
| **Stablecoins** | USDT, USDC | Pegged to US dollar, used for trading and transfers | Critical market infrastructure |

### Bitcoin as an Investment

Bitcoin is the original and most widely held cryptocurrency. Its investment thesis rests on several arguments:

**Digital gold narrative**: Like gold, Bitcoin has a fixed supply (capped at 21 million coins). Proponents argue it serves as a store of value and inflation hedge — "digital gold" for the digital age.

**Institutional adoption**: Major companies and financial institutions now hold Bitcoin on their balance sheets or offer Bitcoin products to clients. Bitcoin ETFs (launched in early 2024) brought billions in institutional capital.

**Network effect**: As the most recognized and liquid cryptocurrency, Bitcoin benefits from a self-reinforcing network effect.

**Risks**: Extreme volatility (50-80% drawdowns have occurred multiple times), regulatory uncertainty, environmental concerns about energy consumption, and competition from other cryptocurrencies.

### Ethereum and Smart Contracts

Ethereum expanded the blockchain concept beyond simple transactions to **smart contracts** — self-executing programs that run on the blockchain. This enables:

- **Decentralized Finance (DeFi)**: Lending, borrowing, and trading without intermediaries
- **NFTs**: Non-fungible tokens representing ownership of digital assets
- **Decentralized Applications (dApps)**: Applications built on blockchain infrastructure

### How to Invest in Crypto

| Method | Description | Best For |
|--------|-------------|---------|
| **Spot Bitcoin/Ethereum ETFs** | Regulated, held in brokerage | Traditional investors wanting simple exposure |
| **Crypto exchanges** | Coinbase, Kraken, Binance | Direct ownership, full crypto ecosystem access |
| **Self-custody wallets** | Hardware wallets (Ledger, Trezor) | Security-focused, long-term holders |
| **Crypto-related stocks** | Coinbase (COIN), MicroStrategy (MSTR) | Indirect exposure through public companies |

### Position Sizing

Given crypto's extreme volatility, position sizing is critical:
- **Conservative**: 1-3% of total portfolio
- **Moderate**: 3-5% of total portfolio
- **Aggressive**: 5-10% of total portfolio

Even crypto advocates like Ray Dalio and Paul Tudor Jones suggest limiting allocation to 1-5% of a diversified portfolio.

### Key Risks

1. **Volatility**: Bitcoin has experienced multiple 50-80% drawdowns
2. **Regulatory risk**: Governments may restrict or ban certain crypto activities
3. **Security risk**: Exchange hacks, wallet theft, and scams remain prevalent
4. **Technology risk**: Protocol vulnerabilities, scaling challenges
5. **No intrinsic cash flow**: Unlike stocks or bonds, crypto generates no earnings or interest

### Key Takeaway

Cryptocurrency represents a new asset class with genuinely innovative technology (blockchain) and significant investment potential — but also extraordinary risk. For most investors, a small allocation (1-5%) through regulated ETFs or a reputable exchange provides exposure to the upside while limiting downside impact on the overall portfolio. Never invest more in crypto than you can afford to lose entirely.`,
    },
    {
      id: "sm-alternative-pe-vc",
      slug: "private-equity-venture-capital",
      title: "Private Equity & Venture Capital",
      content: `## Private Equity & Venture Capital

Private equity (PE) and venture capital (VC) invest in companies that are not publicly traded on stock exchanges. These asset classes have historically generated higher returns than public markets, but they come with significant trade-offs — illiquidity, high minimum investments, long lock-up periods, and difficulty accessing the best funds.

### Private Equity

Private equity firms acquire established companies, improve their operations, and sell them for a profit — typically over a 3-7 year holding period. The largest PE firms include Blackstone, KKR, Apollo, Carlyle, and TPG.

**How PE creates value:**
1. **Operational improvements**: Cut costs, improve efficiency, professionalize management
2. **Revenue growth**: Expand into new markets, develop new products, execute add-on acquisitions
3. **Financial engineering**: Use leverage to amplify equity returns (the LBO structure discussed earlier)
4. **Multiple expansion**: Buy at a lower valuation multiple and sell at a higher one

**PE fund structure:**
- Limited Partners (LPs): Pension funds, endowments, wealthy individuals who provide capital
- General Partner (GP): The PE firm that makes investment decisions
- Fund life: Typically 10 years (investment period of 3-5 years, harvest period of 3-5 years)
- Fees: 2% annual management fee + 20% of profits above a hurdle rate ("2 and 20")
- Minimum investment: Typically \$1 million or more

**Historical returns**: Top-quartile PE funds have returned 15-25% net IRR historically, outperforming public equities. However, median PE funds have offered more modest outperformance, and bottom-quartile funds have underperformed public markets.

### Venture Capital

Venture capital invests in early-stage, high-growth companies — startups. VC firms provide capital, strategic guidance, and network connections to help startups scale. Major VC firms include Sequoia, Andreessen Horowitz, Benchmark, and Accel.

**VC fund stages:**

| Stage | Typical Investment | Company Status |
|-------|-------------------|---------------|
| **Pre-Seed / Seed** | \$250K - \$3M | Idea/prototype, pre-revenue |
| **Series A** | \$5M - \$20M | Product-market fit, early revenue |
| **Series B** | \$20M - \$60M | Scaling revenue and team |
| **Series C+** | \$50M - \$200M+ | Rapid growth, approaching profitability |
| **Growth/Late-Stage** | \$100M+ | Pre-IPO, established business |

**The VC return profile**: Most VC investments fail. A typical VC fund expects:
- 50-60% of investments to return less than invested (including total losses)
- 20-30% to return 1-3x invested capital
- 10-20% to be big winners (10x or more)
- 1-2 investments to be "home runs" (50x or more) that drive the entire fund's return

This power-law distribution means fund performance depends heavily on whether you invested in the few companies that become massive successes.

### Accessing PE and VC as an Individual Investor

Historically, PE and VC were available only to institutional investors and ultra-high-net-worth individuals. Access is expanding:

| Method | Minimum | Liquidity | Access Quality |
|--------|---------|-----------|---------------|
| Direct LP investment | \$1M+ | Very low (10-year lock) | Best — direct fund access |
| Feeder funds | \$100K-\$250K | Low | Good — access to top funds |
| Publicly traded PE firms | Price of one share | Full (public stock) | Indirect — own the firm, not the fund |
| Interval funds / BDCs | \$2,500-\$25K | Limited | Moderate |
| Secondary market platforms | \$25K+ | Moderate | Varies |

**Publicly traded PE/VC exposure:**
- Blackstone (BX), KKR (KKR), Apollo (APO), Carlyle (CG) — own the PE management company
- Business Development Companies (BDCs) like ARCC, MAIN — lend to mid-market companies
- ETFs like PSP (Invesco Global Listed PE) — basket of publicly traded PE firms

### Key Considerations

**Illiquidity premium**: PE and VC returns partly compensate for the inability to access your money for years. This "illiquidity premium" has historically been 2-5% per year.

**Manager selection**: Unlike public markets where index funds perform well, PE and VC returns vary enormously by manager. Top-quartile funds dramatically outperform bottom-quartile funds. Accessing the best managers is the key challenge.

**J-curve effect**: PE and VC funds typically show negative returns in the early years (management fees + unrealized investments) before turning positive as exits begin. This "J-curve" can last 3-4 years.

### Key Takeaway

PE and VC represent the most powerful return engines in finance — but only for those who can access top-tier managers and tolerate illiquidity. For most individual investors, publicly traded PE firms and BDCs provide the most practical exposure. If you have the minimum investment and time horizon to invest directly in PE or VC funds, manager selection is the single most important decision you will make.`,
    },
    {
      id: "sm-alternative-hedge-funds",
      slug: "hedge-fund-strategies",
      title: "Hedge Fund Strategies",
      content: `## Hedge Fund Strategies

Hedge funds are pooled investment vehicles that use sophisticated strategies to generate returns — often with the goal of making money regardless of market direction. Unlike mutual funds, hedge funds can short-sell, use leverage, trade derivatives, and invest in almost any asset class. They cater to institutional investors and wealthy individuals.

### What Makes Hedge Funds Different

| Feature | Mutual Fund | Hedge Fund |
|---------|------------|------------|
| Regulation | Heavily regulated (SEC) | Lightly regulated (private placement) |
| Minimum investment | Often \$1,000 | Typically \$1M+ |
| Liquidity | Daily redemption | Monthly/quarterly, with lock-ups |
| Short selling | Generally not allowed | Core strategy for many funds |
| Leverage | Limited | Extensively used |
| Performance fees | None | 20% of profits typical |
| Transparency | Full disclosure required | Limited disclosure |

### Major Hedge Fund Strategies

**1. Long/Short Equity**
The most common hedge fund strategy. The fund buys stocks it expects to rise (long positions) and sells short stocks it expects to fall (short positions). The goal is to profit from both sides while reducing market exposure.

- **Market neutral**: Equal long and short exposure (net zero market exposure)
- **Net long bias**: More long than short (typical: 130% long, 30% short = 100% net long)
- **Net short bias**: More short than long (rare; used when the manager is bearish)

**2. Global Macro**
These funds make bets on macroeconomic trends — interest rates, currencies, commodities, and equity markets across countries. They use futures, options, and other derivatives to express views.

Famous example: George Soros's Quantum Fund "broke the Bank of England" in 1992 by shorting the British pound, earning over 1 billion dollars in a single trade.

**3. Event-Driven**
These funds invest around corporate events that create mispricings:

- **Merger arbitrage**: After an acquisition is announced, buy the target (whose stock trades below the deal price) and potentially short the acquirer. Profit when the deal closes.
- **Distressed debt**: Buy bonds of companies in or near bankruptcy at deep discounts, aiming to profit from restructuring.
- **Special situations**: Spin-offs, restructurings, recapitalizations, activist campaigns.

**4. Quantitative / Systematic**
These funds use mathematical models and algorithms to identify trading opportunities. They process vast amounts of data — prices, volumes, economic indicators, satellite imagery, sentiment data — to make systematic trading decisions.

- **Statistical arbitrage**: Exploit small price discrepancies between related securities
- **High-frequency trading**: Execute thousands of trades per second based on microsecond advantages
- **Machine learning-based**: Use AI to identify patterns humans cannot detect

Famous firms: Renaissance Technologies (Medallion Fund — one of the most successful funds in history), Two Sigma, DE Shaw, Citadel.

**5. Fixed Income Arbitrage**
These funds exploit pricing discrepancies in the bond market:
- Yield curve trades (e.g., bet that the curve will steepen or flatten)
- Credit spread trades (e.g., long one issuer's bonds, short another's)
- Government bond arbitrage (e.g., trade pricing differences between on-the-run and off-the-run Treasuries)

### Hedge Fund Performance

The hedge fund industry's performance has been debated extensively:

**The bull case**: Top-performing hedge funds deliver exceptional risk-adjusted returns with lower drawdowns than the stock market. During bear markets, hedge funds often lose less than equities.

**The bear case**: After fees (typically 2% management + 20% performance), the average hedge fund has underperformed a simple 60/40 stock/bond portfolio over the past 15 years. Warren Buffett famously won a bet that the S&P 500 would outperform a portfolio of hedge funds over 10 years (2008-2018).

### Key Metrics for Evaluating Hedge Funds

| Metric | What It Measures |
|--------|-----------------|
| **Sharpe Ratio** | Return per unit of volatility (higher is better) |
| **Sortino Ratio** | Return per unit of downside volatility |
| **Max Drawdown** | Largest peak-to-trough decline |
| **Alpha** | Return above what market exposure would predict |
| **Beta** | Sensitivity to market movements |
| **Correlation** | How closely the fund tracks the market |

### Accessing Hedge Fund-Like Strategies

For investors who cannot meet hedge fund minimums:

| Product | Access Level | Cost |
|---------|-------------|------|
| Liquid alternative ETFs (BTAL, MNA, QAI) | Any investor | 0.50-1.50% |
| Alternative mutual funds | Moderate minimum | 0.75-2.00% |
| Fund of hedge funds | \$100K-\$500K | Higher (double layer of fees) |
| Managed futures ETFs (DBMF, CTA) | Any investor | 0.85-1.00% |

### Key Takeaway

Hedge funds represent the most flexible and sophisticated corner of the investment landscape. The best hedge funds deliver genuine alpha — returns that cannot be replicated by simply buying and holding an index. However, the average hedge fund does not justify its high fees. For most investors, understanding hedge fund strategies provides valuable insight into market dynamics, but actual hedge fund investment should be reserved for those with the ability to access top-tier managers and the sophistication to evaluate them critically.`,
    },
  ],
};

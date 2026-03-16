import { Module } from "../types";

export const basicsModule: Module = {
  id: "sm-basics",
  title: "Stock Market Basics",
  description:
    "Understand how the stock market works — from exchanges and participants to brokerage accounts and order types.",
  lessons: [
    {
      id: "sm-basics-how-it-works",
      slug: "how-stock-market-works",
      title: "How the Stock Market Works",
      content: `## How the Stock Market Works

The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. When you buy a share of stock, you are purchasing a small ownership stake in a real business. The stock market facilitates this exchange efficiently, connecting millions of participants who have different views on what companies are worth.

### The Basic Mechanism

At its simplest, the stock market operates on the principle of supply and demand. When more people want to buy a stock than sell it, the price goes up. When more people want to sell than buy, the price goes down. Every trade requires a buyer and a seller who agree on a price — the market's job is to match them.

### Primary vs. Secondary Markets

The stock market actually consists of two distinct markets:

**Primary Market**
When a company issues new shares for the first time (through an IPO or follow-on offering), it sells those shares to investors directly. The company receives the proceeds. This is the primary market — it is where new securities are created.

**Secondary Market**
After shares are issued, they trade between investors on the secondary market. When you buy Apple stock through your brokerage, you are buying from another investor, not from Apple. Apple receives no money from this transaction. The vast majority of daily stock market activity takes place in the secondary market.

### How a Trade Happens

Modern stock trading is electronic and happens in milliseconds:

1. **You place an order** through your brokerage (buy 100 shares of AAPL at market price)
2. **Your broker routes the order** to an exchange or market maker
3. **The order is matched** with a seller offering shares at a compatible price
4. **The trade executes** and is confirmed
5. **Settlement occurs** — ownership officially transfers (T+1 in the US, meaning one business day after the trade)

### Price Discovery

The current stock price represents the last price at which a trade occurred. It is not a fixed value — it changes with every new trade. The **bid** is the highest price a buyer is willing to pay. The **ask** (or offer) is the lowest price a seller is willing to accept. The difference between them is the **bid-ask spread**.

| Term | Definition |
|------|-----------|
| **Bid** | Highest price a buyer will pay |
| **Ask** | Lowest price a seller will accept |
| **Spread** | Difference between ask and bid |
| **Last Price** | Price of the most recent trade |
| **Volume** | Number of shares traded in a period |

### Market Hours

US stock markets are open Monday through Friday:
- **Regular session**: 9:30 AM to 4:00 PM Eastern Time
- **Pre-market**: 4:00 AM to 9:30 AM ET (limited liquidity)
- **After-hours**: 4:00 PM to 8:00 PM ET (limited liquidity)

Markets are closed on weekends and designated holidays (New Year's Day, MLK Day, Presidents' Day, Good Friday, Memorial Day, Independence Day, Labor Day, Thanksgiving, Christmas).

### Why Stock Prices Move

Stock prices change based on new information and shifting investor sentiment. Key drivers include:

- **Earnings reports**: Companies report financial results quarterly; beating or missing expectations moves the stock
- **Economic data**: GDP growth, employment numbers, inflation, interest rate decisions
- **Industry developments**: New regulations, technological disruption, competitive dynamics
- **Company-specific news**: Product launches, management changes, legal issues, M&A activity
- **Market sentiment**: Fear and greed, momentum, and behavioral factors

### Key Takeaway

The stock market is a mechanism for price discovery and capital allocation. It allows companies to raise money by selling ownership stakes and provides investors with liquidity — the ability to buy and sell those stakes easily. Understanding this basic infrastructure is the foundation for everything that follows in investing.`,
    },
    {
      id: "sm-basics-exchanges",
      slug: "exchanges-nyse-nasdaq",
      title: "Exchanges: NYSE and NASDAQ",
      content: `## Exchanges: NYSE and NASDAQ

The two dominant stock exchanges in the United States are the New York Stock Exchange (NYSE) and NASDAQ. Together, they list the vast majority of publicly traded American companies and handle trillions of dollars in daily trading volume. While they serve the same basic function — facilitating the buying and selling of stocks — they have different histories, structures, and characteristics.

### New York Stock Exchange (NYSE)

The NYSE is the world's largest stock exchange by market capitalization (over 25 trillion dollars). Founded in 1792 under a buttonwood tree on Wall Street, it is a symbol of American capitalism.

**Key characteristics:**
- **Physical trading floor**: The NYSE still operates a trading floor at 11 Wall Street, where Designated Market Makers (DMMs) manage order flow for assigned stocks. However, most volume now flows electronically.
- **Listing requirements**: The NYSE has stringent listing standards, including minimum market capitalization, revenue, and governance requirements.
- **Company profile**: Tends to list large, established companies — many blue-chip industrials, financials, and consumer companies list on the NYSE.
- **Notable listings**: Berkshire Hathaway, JPMorgan Chase, Walmart, Johnson & Johnson, Exxon Mobil

**NYSE Listing Requirements (simplified):**

| Requirement | Standard |
|-------------|----------|
| Market cap | At least \$200M |
| Revenue | At least \$100M over last 3 years |
| Share price | At least \$4.00 per share |
| Shareholders | At least 400 round-lot holders |
| Public float | At least 1.1M shares |

### NASDAQ

NASDAQ (National Association of Securities Dealers Automated Quotations) was founded in 1971 as the world's first electronic stock exchange. It was revolutionary — no physical trading floor, just a network of computers connecting buyers and sellers.

**Key characteristics:**
- **Fully electronic**: All trading happens electronically through a network of market makers
- **Technology focus**: NASDAQ has historically attracted technology and growth companies, though it now lists companies across all sectors
- **Three tiers**: NASDAQ Global Select Market (largest companies), NASDAQ Global Market (mid-size), NASDAQ Capital Market (smaller companies)
- **Notable listings**: Apple, Microsoft, Amazon, Google (Alphabet), Meta, Tesla, NVIDIA

**NASDAQ Listing Requirements (Global Select Market, simplified):**

| Requirement | Standard |
|-------------|----------|
| Market cap | At least \$160M |
| Revenue | At least \$110M over last 3 years |
| Share price | At least \$4.00 per share |
| Shareholders | At least 450 round-lot holders |
| Market makers | At least 3-4 |

### Key Differences

| Feature | NYSE | NASDAQ |
|---------|------|--------|
| Founded | 1792 | 1971 |
| Type | Hybrid (floor + electronic) | Fully electronic |
| Market makers | Designated Market Makers (1 per stock) | Multiple competitive market makers |
| Image | Traditional, blue-chip | Innovative, growth-oriented |
| IPO bell | Physical bell on trading floor | Remote/virtual bell ceremonies |
| Listing fees | Higher | Lower |

### Other Important Exchanges

While NYSE and NASDAQ dominate US trading, other exchanges and venues matter:

- **CBOE (Chicago Board Options Exchange)**: Primary options exchange, also runs CBOE BZX equities exchange
- **IEX (Investors Exchange)**: Designed to protect against high-frequency trading, uses a "speed bump"
- **OTC Markets**: Trades stocks not listed on major exchanges, including penny stocks and foreign companies
- **Dark pools**: Private exchanges where institutional investors trade large blocks anonymously

### Global Exchanges

For context, major global exchanges include:

| Exchange | Location | Market Cap |
|----------|----------|-----------|
| NYSE | New York | ~\$25T+ |
| NASDAQ | New York | ~\$22T+ |
| Shanghai (SSE) | China | ~\$7T |
| Euronext | Europe | ~\$6T |
| Tokyo (TSE) | Japan | ~\$6T |
| London (LSE) | UK | ~\$4T |
| Hong Kong (HKEX) | Hong Kong | ~\$4T |

### Key Takeaway

NYSE and NASDAQ are both highly regulated, efficient markets that serve the same core function. The choice of where to list is largely a branding decision — NYSE signals tradition and stability, while NASDAQ signals innovation and technology. As an investor, the exchange where a stock is listed has minimal impact on your trading experience, since modern brokerages provide seamless access to both.`,
    },
    {
      id: "sm-basics-participants",
      slug: "market-participants",
      title: "Market Participants",
      content: `## Market Participants

The stock market is an ecosystem with many different types of participants, each with different goals, time horizons, and strategies. Understanding who these participants are — and how their behavior influences prices — helps you make better investment decisions and understand market dynamics.

### Retail Investors

Retail investors are individual, non-professional investors who buy and sell securities through brokerage accounts. This includes everyone from a college student investing their first 500 dollars to a high-net-worth individual managing a multi-million dollar portfolio.

**Characteristics:**
- Trade through online brokerages (Schwab, Fidelity, Robinhood, Interactive Brokers)
- Typically invest smaller amounts per trade
- May focus on individual stocks, ETFs, or mutual funds
- Range from passive index investors to active day traders
- Collectively represent about 20-25% of US stock market volume

The rise of commission-free trading, fractional shares, and mobile apps has dramatically increased retail participation since 2020.

### Institutional Investors

Institutional investors are organizations that invest large pools of money on behalf of others. They are the dominant force in markets, accounting for approximately 70-80% of trading volume.

**Major types:**

| Type | Description | Examples |
|------|-------------|---------|
| **Mutual funds** | Pool money from investors to buy diversified portfolios | Vanguard, Fidelity, T. Rowe Price |
| **Pension funds** | Invest retirement savings for employees | CalPERS, Ontario Teachers |
| **Hedge funds** | Use sophisticated strategies to generate returns | Bridgewater, Citadel, Renaissance |
| **Insurance companies** | Invest premiums to fund future claims | Berkshire, MetLife, Prudential |
| **Sovereign wealth funds** | Invest a nation's surplus wealth | Norway Fund, Abu Dhabi Investment |
| **Endowments** | Invest university or foundation assets | Yale, Harvard, Stanford endowments |

Institutional investors have advantages over retail investors: professional research teams, lower trading costs, direct access to company management, and the ability to move markets with large orders.

### Market Makers

Market makers are firms that provide liquidity by continuously quoting bid and ask prices for specific securities. They profit from the bid-ask spread — buying at the bid and selling at the ask.

**How market makers work:**
1. They post a bid price (willing to buy at \$99.95) and an ask price (willing to sell at \$100.05)
2. If an investor wants to buy, the market maker sells from their inventory
3. If an investor wants to sell, the market maker buys into their inventory
4. The 10-cent spread is the market maker's compensation for providing liquidity

Major market makers include Citadel Securities, Virtu Financial, and Jane Street. On the NYSE, Designated Market Makers (DMMs) have specific obligations to maintain orderly markets for their assigned stocks.

### High-Frequency Traders (HFT)

High-frequency trading firms use powerful computers and algorithms to execute trades in microseconds. They account for roughly 50% of US equity trading volume.

**Common HFT strategies:**
- **Market making**: Providing liquidity and capturing the spread at high speed
- **Statistical arbitrage**: Exploiting tiny price discrepancies between related securities
- **Latency arbitrage**: Trading on information milliseconds before other participants

HFT is controversial. Proponents argue it increases liquidity and tightens spreads. Critics argue it creates an unfair advantage and can amplify market volatility during stress events.

### Broker-Dealers

Broker-dealers serve dual roles: as **brokers** (agents who execute trades on behalf of clients) and as **dealers** (principals who trade for their own accounts). Major broker-dealers include Goldman Sachs, Morgan Stanley, and JPMorgan.

### Regulators

The stock market is regulated by several entities:

| Regulator | Role |
|-----------|------|
| **SEC** (Securities and Exchange Commission) | Primary federal regulator; enforces securities laws |
| **FINRA** (Financial Industry Regulatory Authority) | Self-regulatory organization for broker-dealers |
| **Federal Reserve** | Sets monetary policy affecting markets; regulates banks |
| **CFTC** (Commodity Futures Trading Commission) | Regulates futures and derivatives markets |

### How Participant Behavior Affects You

Understanding market participants helps explain price movements:
- When a large mutual fund rebalances, it can move stock prices temporarily
- Hedge fund short-selling can create downward pressure
- Retail investor enthusiasm (as seen with "meme stocks") can drive prices far from fundamental value
- Market maker behavior during volatile periods can widen spreads and reduce liquidity

### Key Takeaway

The stock market is not a monolith — it is a complex ecosystem of participants with different goals, constraints, and time horizons. Retail investors compete alongside hedge funds, algorithms, and pension funds. Understanding who is on the other side of your trade and why they are trading helps you make more informed decisions and avoid common behavioral traps.`,
    },
    {
      id: "sm-basics-brokerage",
      slug: "opening-a-brokerage",
      title: "Opening a Brokerage Account",
      content: `## Opening a Brokerage Account

A brokerage account is your gateway to the stock market. It is a financial account that allows you to buy and sell investments — stocks, bonds, ETFs, mutual funds, and more. Choosing the right brokerage and understanding the account types is one of the first practical steps on your investing journey.

### Types of Brokerage Accounts

**Taxable Brokerage Account (Individual or Joint)**
The most flexible account type. No contribution limits, no withdrawal restrictions, and you can invest in virtually anything. However, you pay taxes on dividends, interest, and capital gains in the year they are realized.

- Capital gains tax: Short-term (held less than 1 year) taxed at ordinary income rates. Long-term (held more than 1 year) taxed at preferential rates (0%, 15%, or 20% depending on income).
- Dividend tax: Qualified dividends taxed at long-term capital gains rates. Non-qualified dividends taxed at ordinary income rates.

**Retirement Accounts**

| Account | Tax Treatment | 2025 Contribution Limit | Best For |
|---------|--------------|------------------------|----------|
| **Traditional IRA** | Tax-deductible contributions; taxed on withdrawal | \$7,000 (\$8,000 if 50+) | Tax deduction now, expect lower tax bracket in retirement |
| **Roth IRA** | After-tax contributions; tax-free withdrawals | \$7,000 (\$8,000 if 50+) | Tax-free growth, expect higher tax bracket in retirement |
| **401(k)** | Pre-tax contributions through employer | \$23,500 (\$31,000 if 50+) | Employer match, high contribution limits |
| **Roth 401(k)** | After-tax contributions through employer | \$23,500 (\$31,000 if 50+) | Tax-free growth with high contribution limits |

### Choosing a Brokerage

Major online brokerages include Charles Schwab, Fidelity, Vanguard, Interactive Brokers, and Robinhood. Here is what to consider:

**Commission and Fees**
Most major brokerages now offer commission-free trading for stocks and ETFs. However, watch for:
- Options contract fees (typically \$0.50-\$0.65 per contract)
- Mutual fund transaction fees (some charge for non-proprietary funds)
- Account maintenance fees (some charge for small balances)
- Foreign transaction fees
- Wire transfer fees

**Investment Selection**
All major brokerages offer stocks, ETFs, and options. Differences emerge with:
- Mutual fund availability (Vanguard funds may have transaction fees at Schwab, and vice versa)
- International stock access
- Fractional share availability
- Fixed income selection (individual bonds)
- Alternative investments (futures, forex, crypto)

**Research and Tools**
- Stock screeners and research reports
- Charting tools and technical analysis
- Fundamental data and financial statements
- Educational content and learning resources
- Mobile app quality

**Account Features**
- Fractional shares (buy \$50 of Amazon instead of a full share)
- Automatic dividend reinvestment (DRIP)
- Tax-loss harvesting tools
- Portfolio analysis and performance tracking
- Banking features (checking, bill pay, debit card)

### The Account Opening Process

Opening a brokerage account is straightforward:

1. **Choose your brokerage** based on the criteria above
2. **Select account type** (individual, joint, IRA, etc.)
3. **Provide personal information**: Name, address, Social Security number, date of birth, employment information
4. **Answer suitability questions**: Investment experience, risk tolerance, financial goals, income, net worth
5. **Fund the account**: Bank transfer (ACH), wire transfer, or account transfer from another brokerage
6. **Start investing**: Once funds settle (typically 1-3 business days for ACH transfers)

### Margin vs. Cash Accounts

| Feature | Cash Account | Margin Account |
|---------|-------------|---------------|
| Borrowing | Cannot borrow | Can borrow against holdings |
| Short selling | Not allowed | Allowed |
| Settlement | Must wait for settlement | Can trade immediately |
| Risk | Limited to invested amount | Can lose more than invested |
| Minimum | None | \$2,000 minimum equity |

New investors should start with a **cash account**. Margin accounts introduce leverage and the risk of losing more than your initial investment.

### Key Takeaway

Opening a brokerage account is the mechanical first step to investing. Choose a reputable, low-cost broker that fits your needs, start with a cash account, and fund it consistently. The choice of brokerage matters far less than the decision to start investing — any major broker will serve a new investor well. What matters most is getting started and investing regularly.`,
    },
    {
      id: "sm-basics-order-types",
      slug: "order-types",
      title: "Order Types",
      content: `## Order Types

When you place a trade, you need to specify not just what you want to buy or sell, but how you want the trade executed. Order types give you control over the price and timing of your trades. Understanding them prevents costly mistakes and helps you execute your investment strategy precisely.

### Market Order

A market order executes immediately at the best available price. It prioritizes speed over price.

**When to use:**
- You want to buy or sell right now and the exact price does not matter much
- The stock is highly liquid (narrow bid-ask spread)
- You are investing a small amount relative to the stock's daily volume

**Risks:**
- In volatile markets, you may get a worse price than expected (slippage)
- For thinly traded stocks, a market order can move the price against you
- Pre-market and after-hours market orders can fill at significantly different prices

**Example:** You place a market buy order for 100 shares of AAPL when the ask is \$185.00. Your order fills immediately, likely at or very near \$185.00.

### Limit Order

A limit order sets the maximum price you are willing to pay (for buys) or the minimum price you are willing to accept (for sells). The trade only executes at your limit price or better.

**When to use:**
- You have a specific price target
- The stock has a wide bid-ask spread
- You want to avoid overpaying during volatile conditions
- You are placing a large order that could move the market

**Risks:**
- The order may not fill if the stock never reaches your limit price
- Partial fills are possible if there is not enough volume at your price
- You might miss a buying opportunity if you set your limit too low

**Example:** AAPL is trading at \$185.00. You set a limit buy order at \$183.00. Your order will only fill if the price drops to \$183.00 or lower.

### Stop Order (Stop-Loss)

A stop order becomes a market order when the stock reaches a specified trigger price. It is typically used to limit losses or protect profits.

**Stop-loss order:** Triggers a sell when the price falls to the stop price.

**Example:** You own AAPL at \$185.00 and set a stop-loss at \$175.00. If AAPL drops to \$175.00, your stop triggers and a market sell order is placed. You might sell at \$175.00, \$174.50, or even lower in a fast-moving market.

**Stop-buy order:** Triggers a buy when the price rises to the stop price. Used by short sellers to limit losses or by traders who want to buy on a breakout.

### Stop-Limit Order

Combines a stop trigger with a limit price. When the stop price is reached, a limit order (not a market order) is placed.

**Example:** You set a stop at \$175.00 with a limit of \$173.00. If AAPL drops to \$175.00, a limit sell order at \$173.00 is placed. If the stock gaps below \$173.00, the order may not fill — which is both the advantage (price protection) and disadvantage (you might still hold a falling stock).

### Summary of Core Order Types

| Order Type | Execution | Price Control | Fill Guarantee |
|-----------|-----------|---------------|---------------|
| Market | Immediate | None | Yes (if liquid) |
| Limit | At limit or better | Full | No |
| Stop | When triggered (market) | None after trigger | Yes (if liquid) |
| Stop-Limit | When triggered (limit) | Full after trigger | No |

### Time-in-Force Instructions

You can also specify how long your order remains active:

| Instruction | Duration |
|-------------|----------|
| **Day** | Expires at market close if not filled |
| **GTC** (Good Til Canceled) | Remains active until filled or canceled (typically 60-90 days) |
| **IOC** (Immediate or Cancel) | Fill what you can immediately; cancel the rest |
| **FOK** (Fill or Kill) | Fill the entire order immediately or cancel entirely |
| **MOO** (Market on Open) | Execute at the opening price |
| **MOC** (Market on Close) | Execute at the closing price |

### Advanced Order Types

**Trailing Stop:** A stop-loss that moves with the stock price. Set a trailing stop of \$10 — if the stock rises from \$185 to \$200, your stop moves from \$175 to \$190. If the stock then drops \$10, you sell at approximately \$190, locking in gains.

**Bracket Order:** Sets both a profit target (limit sell above current price) and a stop-loss (stop sell below current price) simultaneously. When one triggers, the other is automatically canceled. This is an OCO (One Cancels Other) order.

### Practical Recommendations

For most long-term investors:
- Use **limit orders** for individual stock purchases (set your limit 1-2% above current price if you want a likely fill with price protection)
- Use **market orders** only for highly liquid ETFs like SPY or QQQ
- Consider **trailing stops** to protect gains on individual positions
- Avoid stop-losses set too tight — normal volatility can trigger them unnecessarily

### Key Takeaway

Order types are tools that give you control over trade execution. Market orders prioritize speed; limit orders prioritize price. Stops protect against losses. The right choice depends on your urgency, the stock's liquidity, and your risk management strategy. For most investors, defaulting to limit orders is the safest practice.`,
    },
  ],
};

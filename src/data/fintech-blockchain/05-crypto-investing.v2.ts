import { Module } from "../types";

export const cryptoInvestingModule: Module = {
  id: "ft-crypto",
  title: "Crypto Investing",
  description: "Navigate the crypto investment landscape — understanding crypto markets, Bitcoin fundamentals, Ethereum's value proposition, portfolio construction with digital assets, and managing the unique risks of crypto.",
  lessons: [
    {
      id: "ft-crypto-markets",
      slug: "crypto-markets",
      title: "Understanding Crypto Markets",
      content: `## Understanding Crypto Markets

Cryptocurrency markets operate 24 hours a day, 365 days a year, across thousands of exchanges worldwide. They combine characteristics of traditional financial markets with unique features — extreme volatility, global accessibility, and a rapidly evolving structure. Understanding how these markets work is essential before investing.

### Market Structure

Crypto trades on two types of venues:

**Centralized Exchanges (CEXs)** — Coinbase, Binance, Kraken. These operate like traditional exchanges: users deposit funds, trade on the exchange's order book, and withdraw. CEXs offer high liquidity, fiat on-ramps, and familiar interfaces but require trusting the exchange with your assets (the FTX collapse demonstrated the risk).

**Decentralized Exchanges (DEXs)** — Uniswap, Curve, dYdX. Users trade directly from their wallets through smart contracts. DEXs offer self-custody and transparency but have lower liquidity for many pairs and require more technical knowledge.

### Key Market Metrics

| Metric | Description | Current Crypto Market |
|--------|-------------|----------------------|
| **Market cap** | Total value of all coins/tokens | ~$2-3 trillion |
| **Bitcoin dominance** | BTC market cap / total crypto market cap | ~45-55% |
| **24h volume** | Total trading volume across all exchanges | ~$50-100 billion |
| **Fear & Greed Index** | Sentiment indicator (0 = extreme fear, 100 = extreme greed) | Varies widely |
| **Stablecoin supply** | Total stablecoins in circulation (dry powder) | ~$150 billion |

### Market Cycles

Crypto markets follow pronounced boom-bust cycles, roughly aligned with Bitcoin's halving schedule (every ~4 years):

- **2013 cycle** — BTC rose from $13 to $1,100, then crashed 85%
- **2017 cycle** — BTC rose from $1,000 to $20,000 (ICO boom), then crashed 84%
- **2021 cycle** — BTC rose from $10,000 to $69,000 (DeFi/NFT boom), then crashed 77%
- **2024-2025 cycle** — BTC ETF approval, halving, new all-time highs

Each cycle brings new narratives (ICOs, DeFi, NFTs, AI tokens), new participants, and ultimately new regulations in the aftermath.

### Trading Pairs and Liquidity

Most crypto trading occurs against three base currencies: USDT (the most liquid), USDC, and BTC. Liquidity varies enormously:

- **BTC/USDT** — Tight spreads, deep order books, minimal slippage even for large trades
- **Mid-cap altcoins** — Moderate liquidity, wider spreads, noticeable slippage for trades above $100K
- **Small-cap tokens** — Thin liquidity, wide spreads, significant slippage; vulnerable to manipulation

### Crypto-Specific Market Phenomena

**Whale movements** — Large holders ("whales") can move markets with a single transaction. On-chain analytics platforms (Glassnode, Nansen) track whale wallets to anticipate market moves.

**Exchange flows** — Large deposits to exchanges often signal selling pressure; withdrawals to cold wallets signal accumulation. This data is publicly visible on the blockchain.

**Funding rates** — In perpetual futures markets, funding rates indicate whether leveraged traders are predominantly long or short. Extreme positive funding rates often precede corrections.

**Correlation with traditional markets** — Crypto has become increasingly correlated with tech stocks (NASDAQ), particularly during risk-off events. The "digital gold" narrative for Bitcoin has been tested by periods of high correlation with equities.

### Key Takeaway

Crypto markets are the most accessible financial markets in the world — anyone can participate, 24/7, from anywhere. But this accessibility comes with extreme volatility, fragmented liquidity, and unique risks. Understanding market structure, cycles, and on-chain data is the foundation of informed crypto investing.`,
    },
    {
      id: "ft-bitcoin-fundamentals",
      slug: "bitcoin-fundamentals",
      title: "Bitcoin Fundamentals",
      content: `## Bitcoin Fundamentals

Bitcoin, created by the pseudonymous Satoshi Nakamoto in 2008, is the first and largest cryptocurrency with a market capitalization exceeding $1 trillion. It has evolved from a niche experiment in digital cash to a globally recognized asset class, with spot Bitcoin ETFs approved by the SEC in January 2024 holding over $50 billion in assets.

### The Bitcoin Protocol

Bitcoin's design is elegant in its simplicity:

- **Fixed supply** — 21 million BTC will ever exist. This is enforced by code and cannot be changed without consensus from the network. As of 2024, approximately 19.6 million BTC have been mined.
- **Halving schedule** — The block reward halves every 210,000 blocks (~4 years). It started at 50 BTC (2009), dropped to 25 (2012), 12.5 (2016), 6.25 (2020), and 3.125 (2024). This creates a predictable, declining inflation rate that approaches zero.
- **Proof of Work** — Miners secure the network by expending computational energy. The difficulty adjusts every 2,016 blocks to maintain ~10 minute block times.
- **UTXO model** — Bitcoin uses Unspent Transaction Outputs (UTXOs) rather than account balances. Each transaction consumes UTXOs and creates new ones.

### Bitcoin as Digital Gold

The "digital gold" thesis argues that Bitcoin shares key properties with gold:

| Property | Gold | Bitcoin |
|----------|------|---------|
| **Scarcity** | Limited by geology | Limited by code (21M cap) |
| **Durability** | Does not corrode | Exists as long as the network runs |
| **Divisibility** | Difficult to divide | Divisible to 8 decimal places (satoshis) |
| **Portability** | Heavy, expensive to ship | Transferable globally in minutes |
| **Verifiability** | Assay testing required | Cryptographically verifiable |
| **Censorship resistance** | Can be confiscated | Difficult to confiscate (self-custody) |

### The Investment Case For Bitcoin

**Store of value** — In a world of expanding money supplies, Bitcoin's fixed supply makes it an attractive hedge against monetary debasement. Countries with hyperinflation (Venezuela, Turkey, Argentina) have seen significant Bitcoin adoption.

**Institutional adoption** — BlackRock, Fidelity, and other major asset managers now offer Bitcoin ETFs. Corporate treasury adoption (MicroStrategy holds over 200,000 BTC) adds legitimacy.

**Network effects** — Bitcoin has the strongest brand, the deepest liquidity, the longest track record, and the most secure network (highest hash rate) of any cryptocurrency.

### The Investment Case Against Bitcoin

**Volatility** — Bitcoin regularly experiences 30-50% drawdowns, making it unsuitable as a stable store of value in the short term.

**Energy consumption** — Bitcoin mining consumes over 100 TWh annually, drawing environmental criticism.

**Regulatory risk** — Governments could restrict or ban Bitcoin ownership, mining, or trading (China banned mining in 2021).

**Technology risk** — Quantum computing could theoretically break Bitcoin's cryptographic primitives, though practical quantum attacks are likely decades away.

**Competition** — Other cryptocurrencies offer faster transactions, lower fees, and additional functionality.

### Bitcoin Valuation Frameworks

| Framework | Description | Implied Value |
|-----------|-------------|--------------|
| **Stock-to-Flow** | Models scarcity by comparing existing supply to new production | Controversial; failed in 2022 |
| **Metcalfe's Law** | Network value proportional to users squared | Varies with adoption metrics |
| **Gold replacement** | BTC captures X% of gold's $13T market cap | $300K-600K per BTC at 50-100% |
| **Global money** | BTC captures X% of global M2 money supply | Very wide range |
| **Production cost** | Mining cost as a price floor | ~$30K-40K (varies by miner efficiency) |

### Key Takeaway

Bitcoin is the most battle-tested and widely adopted cryptocurrency, with a simple but powerful value proposition: fixed supply, decentralized security, and global transferability. Whether it ultimately functions as digital gold, a payment network, or both remains an open question. Its volatility makes it a high-conviction position rather than a conservative allocation.`,
    },
    {
      id: "ft-ethereum-smart-contracts",
      slug: "ethereum-and-smart-contracts",
      title: "Ethereum & Smart Contracts",
      content: `## Ethereum & Smart Contracts

While Bitcoin proved that decentralized money is possible, Ethereum proved that decentralized computation is possible. Launched in 2015 by Vitalik Buterin and a team of co-founders, Ethereum is the platform on which most of DeFi, NFTs, and Web3 are built. Its native currency, ETH, is the second-largest cryptocurrency by market cap.

### Ethereum's Value Proposition

Ethereum is a **programmable blockchain** — a global, decentralized computer that anyone can use. While Bitcoin's scripting language is intentionally limited (to maintain security and simplicity), Ethereum's EVM (Ethereum Virtual Machine) is Turing-complete, meaning it can run any computable program.

This programmability enables:
- Decentralized exchanges (Uniswap)
- Lending protocols (Aave, Compound)
- Stablecoins (DAI, USDC on Ethereum)
- NFT marketplaces (OpenSea)
- Decentralized autonomous organizations (DAOs)
- Layer 2 scaling solutions (Arbitrum, Optimism)

### The Merge and Proof of Stake

In September 2022, Ethereum completed "The Merge" — transitioning from Proof of Work to Proof of Stake. This was one of the most significant technical upgrades in blockchain history:

- **Energy reduction** — 99.95% less energy consumption
- **Staking yield** — ETH holders can stake and earn ~4-5% annually
- **Deflationary potential** — EIP-1559 burns base fees; when network usage is high, more ETH is burned than issued, making ETH deflationary

### ETH as an Investment

The investment thesis for ETH differs from Bitcoin:

**ETH as "digital oil"** — If Bitcoin is digital gold (store of value), ETH is digital oil (fuel for the Ethereum economy). Every transaction, every smart contract execution, every DeFi trade requires ETH for gas fees.

**Revenue-generating asset** — Unlike Bitcoin, ETH generates real economic revenue through:
- Transaction fees (partially burned via EIP-1559)
- Staking rewards (~4-5% yield)
- MEV (Maximal Extractable Value) captured by validators

**Platform risk vs. platform upside** — ETH's value is tied to the success of the Ethereum ecosystem. If DeFi and Web3 grow, ETH benefits. If a competing platform captures market share, ETH suffers.

### The Ethereum Roadmap

Ethereum has an ambitious multi-year roadmap:

| Phase | Focus | Status |
|-------|-------|--------|
| **The Merge** | Transition to PoS | Complete (Sep 2022) |
| **The Surge** | Scaling via rollups + danksharding | In progress |
| **The Scourge** | MEV mitigation, censorship resistance | Research phase |
| **The Verge** | Verkle trees, statelessness | Research phase |
| **The Purge** | Reduce historical data requirements | Research phase |
| **The Splurge** | Miscellaneous improvements | Ongoing |

The most important near-term upgrade is **danksharding** (part of The Surge), which will dramatically reduce costs for Layer 2 rollups by creating a dedicated data availability layer.

### Ethereum vs. Competitors

| Feature | Ethereum | Solana | Avalanche | Cosmos |
|---------|----------|--------|-----------|--------|
| **TPS** | ~15 (L1), ~4000 (L2) | ~4000 | ~4500 | Varies by chain |
| **Finality** | ~15 min (L1) | ~400ms | ~2s | ~6s |
| **DeFi TVL** | ~$50B+ | ~$5B | ~$1B | ~$2B |
| **Developer ecosystem** | Largest | Growing fast | Moderate | Growing |
| **Decentralization** | High | Moderate | Moderate | Varies |

Ethereum's primary advantage is its ecosystem — the most developers, the most protocols, the most liquidity, and the most composability. Competitors offer faster and cheaper transactions but have not yet replicated Ethereum's network effects.

### Key Takeaway

Ethereum is the foundational platform for programmable finance and Web3. Its transition to Proof of Stake, its deflationary tokenomics, and its dominant ecosystem position make ETH a fundamentally different investment from Bitcoin. Understanding the Ethereum roadmap and competitive landscape is essential for evaluating the long-term potential of ETH and the broader smart contract ecosystem.`,
    },
    {
      id: "ft-crypto-portfolio",
      slug: "portfolio-construction-crypto",
      title: "Portfolio Construction with Crypto",
      content: `## Portfolio Construction with Crypto

Adding cryptocurrency to a traditional investment portfolio introduces unique challenges and opportunities. The extreme volatility of crypto assets means that even a small allocation can significantly impact portfolio risk and return. This lesson covers how to think about crypto allocation within the framework of modern portfolio theory.

### The Allocation Question

The fundamental question is: what percentage of a portfolio should be allocated to crypto? Academic research and institutional practices suggest a range:

| Allocator Type | Typical Crypto Allocation | Rationale |
|---------------|--------------------------|-----------|
| **Conservative** | 1-3% | Negligible downside risk, meaningful upside potential |
| **Moderate** | 3-5% | Material impact on returns without dominating risk |
| **Aggressive** | 5-15% | Conviction bet on the asset class |
| **Crypto-native** | 15-50%+ | High-conviction, higher risk tolerance |

A key insight: because crypto is so volatile, even a 5% allocation can contribute 20-30% of total portfolio volatility.

### Diversification Benefits

Historically, crypto has offered diversification benefits due to moderate correlation with traditional assets:

- **BTC-S&P 500 correlation:** ~0.3-0.5 (has increased over time)
- **BTC-Gold correlation:** ~0.0-0.2
- **BTC-Bonds correlation:** ~-0.1 to 0.2

However, correlations are not stable. During market crises (March 2020, November 2022), crypto correlation with equities spikes, reducing diversification benefits precisely when they are most needed.

### Within-Crypto Allocation

If you decide to allocate to crypto, how should the crypto portion be structured?

**The Barbell Approach:**
- 60-70% in BTC and ETH (established, liquid, lowest relative risk)
- 20-30% in large-cap altcoins (SOL, AVAX, MATIC — higher risk, higher potential)
- 0-10% in early-stage/high-conviction bets (new protocols, DeFi tokens)

**The Index Approach:**
- Weight by market capitalization (similar to an S&P 500 approach)
- Available through crypto index funds and ETFs
- Automatically reduces allocation to declining assets

**The Thematic Approach:**
- Allocate based on thematic conviction (DeFi, Layer 2, AI+crypto, RWA tokenization)
- Higher risk, requires deeper knowledge
- Can outperform market-cap weighting if themes play out

### Rebalancing

Crypto's volatility makes rebalancing particularly important and challenging:

- **Calendar rebalancing** — Rebalance quarterly or monthly to target weights
- **Threshold rebalancing** — Rebalance when allocation drifts more than X% from target (e.g., if 5% target drifts to 8%, sell back to 5%)
- **Tax consideration** — Rebalancing triggers taxable events; use tax-loss harvesting to offset gains

### Storage and Security

Portfolio construction in crypto must account for custody:

- **Exchange custody** — Easiest but riskiest (FTX, Mt. Gox, Celsius failures)
- **Hardware wallets** — Ledger, Trezor for self-custody of long-term holdings
- **Institutional custody** — Coinbase Custody, BitGo for institutional-grade security
- **Multi-sig** — Require multiple keys to authorize transactions

A common approach: keep trading positions on exchanges, move long-term holdings to cold storage, and diversify custodians.

### Tax Implications

Crypto taxation varies by jurisdiction but generally:

- **Capital gains** — Selling crypto for fiat or other crypto is a taxable event in most jurisdictions
- **Mining/staking** — Rewards are typically taxed as income at receipt
- **DeFi activity** — Every swap, LP deposit, and claim may be a taxable event
- **Record keeping** — Essential; use tools like Koinly, CoinTracker, or TaxBit

### Key Takeaway

Crypto can enhance portfolio returns and diversification when allocated thoughtfully. The key principles are: start with a small allocation (1-5%), focus on BTC and ETH for the core holding, rebalance regularly, and prioritize security. Treat crypto as a high-volatility, high-potential sleeve within a broader diversified portfolio.`,
    },
    {
      id: "ft-crypto-risks",
      slug: "crypto-risks",
      title: "Crypto Investment Risks",
      content: `## Crypto Investment Risks

Cryptocurrency investing carries risks that are fundamentally different from traditional asset classes. Understanding these risks — and distinguishing between avoidable and inherent risks — is essential for any investor considering crypto exposure.

### Market Risk (Volatility)

Crypto is the most volatile major asset class:

| Asset | Annualized Volatility | Maximum Drawdown |
|-------|----------------------|-----------------|
| S&P 500 | ~15-20% | -57% (2008-2009) |
| Gold | ~15-18% | -45% (2011-2015) |
| Bitcoin | ~60-80% | -85% (2017-2018) |
| Ethereum | ~80-100% | -94% (2018) |
| Altcoins | 100-200%+ | -95% to -99% common |

Bitcoin has experienced six drawdowns exceeding 50% in its 15-year history. Many altcoins from previous cycles have gone to zero permanently.

### Regulatory Risk

Regulatory risk is perhaps the most significant threat to crypto investments:

- **Outright bans** — China banned crypto mining (2021) and trading, causing a major market crash
- **Classification as securities** — The SEC has argued that many tokens are unregistered securities, filing lawsuits against Ripple, Coinbase, and Binance
- **Stablecoin regulation** — New rules could force stablecoin issuers to restructure or shut down
- **Tax enforcement** — Increasing IRS attention on crypto tax compliance
- **CBDC competition** — Government-issued digital currencies could reduce demand for private stablecoins

### Counterparty Risk

The collapse of major crypto companies has destroyed billions in customer assets:

- **FTX (2022)** — $8 billion in customer funds misappropriated; founder convicted of fraud
- **Celsius (2022)** — Crypto lending platform froze withdrawals; declared bankruptcy
- **BlockFi (2022)** — Lending platform collapsed after FTX contagion
- **Mt. Gox (2014)** — 850,000 BTC stolen from the largest Bitcoin exchange

**Mitigation:** Use regulated exchanges, diversify custodians, self-custody significant holdings, and never store more on an exchange than you are prepared to lose.

### Smart Contract Risk

For DeFi investors, smart contract risk is a constant concern:

- Over $3 billion stolen from DeFi protocols in 2022 through hacks and exploits
- Common attack vectors: reentrancy bugs, oracle manipulation, flash loan attacks, bridge exploits
- Even audited protocols can have vulnerabilities (Euler Finance was audited multiple times before losing $197 million)

**Mitigation:** Use battle-tested protocols, diversify across multiple protocols, check audit status, and size positions assuming total loss is possible.

### Liquidity Risk

Many crypto assets suffer from thin liquidity:

- Small-cap tokens may have less than $100K in daily volume
- Attempting to sell a large position can crash the price
- During market panics, even liquid assets can experience severe slippage
- DeFi liquidity can evaporate quickly as LPs withdraw during volatility

**Mitigation:** Focus on high-liquidity assets (BTC, ETH, major stablecoins), avoid illiquid tokens for large positions, and use limit orders.

### Technology Risk

- **Private key loss** — If you lose your private key or seed phrase, your crypto is gone forever. An estimated 3-4 million BTC (15-20% of supply) are permanently lost.
- **Wallet vulnerabilities** — Hot wallets connected to the internet are vulnerable to hacking
- **Bridge exploits** — Cross-chain bridges have been a major attack surface ($600M Ronin Bridge hack, $320M Wormhole hack)
- **Quantum computing** — Future quantum computers could theoretically break current cryptographic algorithms, though practical attacks are likely 15-30 years away

### Scam and Fraud Risk

The crypto industry has a significant fraud problem:

- **Rug pulls** — Project creators abandon the project and steal deposited funds
- **Pump-and-dump** — Coordinated buying inflates a token's price before insiders dump on retail buyers
- **Phishing** — Fake websites and social media accounts trick users into approving malicious transactions
- **Ponzi schemes** — Projects promising unsustainable yields (Bitconnect, OneCoin, numerous DeFi protocols)

**Red flags:** Anonymous teams, unrealistic yield promises (100%+ APY with no clear source), pressure to invest quickly, unlocked team tokens, unaudited contracts.

### Risk Management Framework

A prudent approach to crypto risk management:

1. **Position sizing** — Never invest more than you can afford to lose entirely
2. **Diversification** — Across assets, protocols, chains, and custodians
3. **Due diligence** — Research teams, audits, tokenomics, and competitive position before investing
4. **Cold storage** — Move long-term holdings off exchanges
5. **Stop-losses** — For trading positions, use stop-losses to limit downside
6. **Regular review** — Reassess positions monthly; cut losers, reallocate to convictions

### Key Takeaway

Crypto investing offers asymmetric upside potential but carries risks that can result in total loss. The most successful crypto investors are those who size positions appropriately, diversify across the risk spectrum, prioritize security, and maintain the emotional discipline to hold through extreme volatility without panic selling.`,
    },
  ],
};

import { Module } from "../types";

export const defiModule: Module = {
  id: "ft-defi",
  title: "Decentralized Finance (DeFi)",
  description:
    "Dive into DeFi — decentralized exchanges, lending protocols, yield farming strategies, and the stablecoin ecosystem that powers the on-chain financial system.",
  lessons: [
    {
      id: "ft-what-is-defi",
      slug: "what-is-defi",
      title: "What is DeFi",
      content: `## What is DeFi?

Decentralized Finance — DeFi — refers to financial services built on public blockchains that operate without traditional intermediaries. Instead of banks, brokers, and exchanges, DeFi uses smart contracts to create protocols that anyone can access, inspect, and build upon. At its peak in November 2021, DeFi protocols held over \$180 billion in Total Value Locked (TVL). As of 2024, TVL stabilized around \$50-80 billion, demonstrating both the sector's resilience and its volatility.

### The DeFi Vision

Traditional finance (TradFi) relies on trusted intermediaries: banks hold your money, brokers execute your trades, insurance companies assess your risks. Each intermediary adds fees, delays, and counterparty risk. DeFi's proposition is to replace these intermediaries with transparent, auditable smart contracts.

| TradFi Component | DeFi Equivalent | Example Protocol |
|-----------------|-----------------|-----------------|
| Bank savings account | Lending protocol | Aave, Compound |
| Stock exchange | Decentralized exchange (DEX) | Uniswap, Curve |
| Insurance company | Decentralized insurance | Nexus Mutual |
| Asset management | Yield aggregator | Yearn Finance |
| Derivatives exchange | On-chain derivatives | dYdX, GMX |
| Bond market | Fixed-rate protocols | Notional Finance |

### Key Properties of DeFi

**Permissionless** — Anyone with an internet connection and a crypto wallet can access DeFi. There are no applications, credit checks, or minimum balances. A farmer in rural Kenya has the same access as a Wall Street trader.

**Composability** — DeFi protocols are like Lego blocks — they can be combined to create new financial products. A user can deposit ETH into Aave, borrow USDC, swap it on Uniswap, provide liquidity to a Curve pool, and stake the LP tokens in a yield optimizer — all in a single transaction.

**Transparency** — All transactions, all smart contract code, and all protocol parameters are publicly visible. Anyone can audit the system, verify reserves, and monitor risk.

**Non-custodial** — Users retain control of their assets at all times. Your crypto sits in your own wallet, not in a company's custody. Smart contracts access your assets only when you explicitly approve them.

### The DeFi Stack

DeFi is organized in layers, each building on the layer below:

\`\`\`
Layer 4: Aggregators     [1inch, Zapper, Yearn]
Layer 3: Applications    [Uniswap, Aave, MakerDAO]
Layer 2: Protocols       [ERC-20, ERC-721, Oracles]
Layer 1: Settlement      [Ethereum, Solana, Arbitrum]
Layer 0: Network         [Internet, Wallets, RPC nodes]
\`\`\`

**Oracles** deserve special mention. DeFi protocols need real-world data (asset prices, interest rates) to function. Oracles like Chainlink provide this data on-chain. Without reliable oracles, DeFi would be unable to price assets, liquidate undercollateralized loans, or settle derivatives.

### DeFi Risks

DeFi introduces risks that do not exist in traditional finance:

**Smart contract risk** — Bugs in code can be exploited. Over \$3 billion was stolen from DeFi protocols in 2022 alone through hacks and exploits.

**Oracle manipulation** — If an attacker can manipulate the price feed, they can drain a protocol. Flash loan attacks exploit this vulnerability by temporarily distorting prices.

**Impermanent loss** — Liquidity providers on DEXs can lose money relative to simply holding the underlying assets (covered in the DEX lesson).

**Regulatory risk** — Governments may regulate or ban DeFi protocols. The SEC's enforcement actions against various crypto projects have created uncertainty.

**Economic exploits** — Even if the code works correctly, complex interactions between protocols can create unintended economic vulnerabilities.

### The DeFi User Journey

A typical DeFi user interacts through these steps:

1. **Set up a wallet** — MetaMask, Phantom, or a hardware wallet (Ledger, Trezor)
2. **Fund the wallet** — Transfer crypto from a centralized exchange or buy directly
3. **Connect to a dApp** — Visit the protocol's website and connect your wallet
4. **Approve and execute** — Review the transaction, approve token spending, and confirm
5. **Monitor positions** — Track your deposits, loans, and yields through dashboards like Zapper or DeBank

### Key Takeaway

DeFi is an experiment in rebuilding financial services from first principles using transparent, programmable smart contracts. It offers genuine innovation — 24/7 markets, composable protocols, permissionless access — but also carries significant risks. Understanding both the potential and the pitfalls is essential for anyone engaging with on-chain finance.`,
    },
    {
      id: "ft-dex",
      slug: "decentralized-exchanges",
      title: "DEXs and Automated Market Makers",
      content: `## Decentralized Exchanges and Automated Market Makers

Decentralized exchanges (DEXs) allow users to trade tokens directly from their wallets without depositing funds with a centralized intermediary. The innovation that made DEXs practical was the **Automated Market Maker (AMM)** — a smart contract that replaces the traditional order book with a mathematical formula for pricing trades.

### The Problem with On-Chain Order Books

Traditional exchanges (NYSE, Binance) use order books — sorted lists of buy and sell orders at various prices. Maintaining an order book on a blockchain is impractical because:

- Every order placement, cancellation, and modification requires a blockchain transaction (costs gas)
- Block times (12 seconds on Ethereum) are too slow for real-time trading
- Market makers would need to pay gas fees to quote prices, making it economically unviable

### The AMM Innovation

Instead of matching individual orders, AMMs use **liquidity pools** — smart contracts holding reserves of two (or more) tokens. Prices are determined by a mathematical formula based on the ratio of reserves.

**The Constant Product Formula (Uniswap V2):**

\`\`\`
x * y = k
\`\`\`

where x is the reserve of token A, y is the reserve of token B, and k is a constant. When a trader buys token A, they add token B to the pool and remove token A, maintaining the invariant.

**Example:** A pool holds 100 ETH and 200,000 USDC (k = 20,000,000). A trader wants to buy 1 ETH:

\`\`\`
New ETH reserve: 99
Required USDC reserve: 20,000,000 / 99 = 202,020.20
USDC paid: 202,020.20 - 200,000 = 2,020.20
Effective price: 2,020.20 USDC per ETH
\`\`\`

The implied price before the trade was 2,000 USDC/ETH. The trader paid slightly more due to **price impact** (or slippage) — larger trades move the price more.

### Uniswap: The Market Leader

Uniswap, launched in 2018 by Hayden Adams, has been the dominant DEX with over \$2 trillion in cumulative trading volume. Its evolution illustrates the rapid pace of DeFi innovation:

- **Uniswap V1 (2018)** — Proof of concept; all pairs traded against ETH
- **Uniswap V2 (2020)** — Direct token-to-token pairs, flash swaps, improved oracle
- **Uniswap V3 (2021)** — Concentrated liquidity; LPs can specify price ranges, dramatically improving capital efficiency
- **Uniswap V4 (2024)** — Hooks system allowing customizable pool logic

### Providing Liquidity

Anyone can become a liquidity provider (LP) by depositing tokens into a pool. LPs earn a share of trading fees (typically 0.3% per trade on Uniswap V2) proportional to their share of the pool.

However, LPs face **impermanent loss** — the loss incurred when the price ratio of the deposited tokens changes. If ETH doubles in price relative to USDC, an LP would have been better off simply holding ETH rather than providing liquidity. The loss is "impermanent" because it reverses if prices return to the original ratio, but in practice, it is often permanent.

### Impermanent Loss Example

You deposit 1 ETH (\$2,000) and 2,000 USDC into a pool. Total value: \$4,000.

If ETH rises to \$4,000:
- **Just holding:** 1 ETH (\$4,000) + 2,000 USDC = \$6,000
- **As LP:** ~0.707 ETH (\$2,828) + 2,828 USDC = \$5,657
- **Impermanent loss:** \$343, or 5.7% of holding value

This loss must be offset by trading fee income for LP positions to be profitable.

### Other AMM Designs

| Protocol | AMM Design | Optimized For |
|----------|-----------|--------------|
| **Uniswap V3** | Concentrated liquidity (custom price ranges) | General token trading |
| **Curve** | StableSwap (low slippage for similar assets) | Stablecoin and pegged asset swaps |
| **Balancer** | Weighted pools (custom ratios, not just 50/50) | Index-like exposure, portfolio rebalancing |
| **GMX** | Oracle-based pricing, zero price impact | Perpetual futures trading |
| **Trader Joe** | Liquidity Book (discrete price bins) | Concentrated liquidity alternative |

Curve's StableSwap formula is particularly important: it concentrates liquidity around the 1:1 peg, enabling massive stablecoin swaps (millions of dollars) with near-zero slippage.

### DEX Aggregators

DEX aggregators like **1inch** and **Paraswap** route trades across multiple DEXs to find the best price. A single swap might be split across Uniswap, Curve, and Balancer to minimize slippage and fees. Aggregators have become the default way for sophisticated DeFi users to trade.

### Key Takeaway

AMMs solved the on-chain trading problem by replacing order books with mathematical formulas and liquidity pools. They enable permissionless, 24/7 trading without intermediaries. However, liquidity provision carries the risk of impermanent loss, and AMM design continues to evolve to improve capital efficiency and reduce slippage.`,
    },
    {
      id: "ft-lending-protocols",
      slug: "lending-protocols",
      title: "Lending Protocols (Aave/Compound)",
      content: `## Lending Protocols: Aave and Compound

DeFi lending protocols allow users to lend and borrow crypto assets without intermediaries. Lenders earn interest on their deposits; borrowers access capital by posting collateral. These protocols run autonomously through smart contracts, with interest rates determined algorithmically based on supply and demand.

### How DeFi Lending Works

The fundamental mechanism:

1. **Lenders deposit** assets into a lending pool (e.g., deposit USDC into the Aave USDC pool)
2. **Lenders receive** interest-bearing tokens (aUSDC on Aave, cUSDC on Compound) that represent their deposit plus accrued interest
3. **Borrowers post collateral** (e.g., deposit ETH) and borrow against it (e.g., borrow USDC)
4. **Interest accrues** continuously, paid by borrowers to lenders
5. **If collateral value drops** below the liquidation threshold, anyone can liquidate the position (repay part of the debt and claim the collateral at a discount)

### Overcollateralization

DeFi lending is **overcollateralized** — borrowers must deposit more value than they borrow. Typical collateral ratios:

| Asset | Loan-to-Value (LTV) | Liquidation Threshold |
|-------|---------------------|----------------------|
| ETH | 80% | 82.5% |
| WBTC | 70% | 75% |
| Stablecoins (USDC) | 77% | 80% |

If you deposit \$10,000 in ETH with 80% LTV, you can borrow up to \$8,000. If ETH's price drops and your collateral falls below the liquidation threshold, liquidators will close your position.

**Why overcollateralization?** DeFi has no identity, credit scores, or legal recourse. The only guarantee that a borrower will repay is the collateral locked in the smart contract.

### Compound: The Pioneer

Compound (launched 2018) pioneered the algorithmic money market model:

- Interest rates are determined by a **utilization curve** — as more of the pool is borrowed, rates rise to attract more lenders and discourage additional borrowing
- Each asset has its own pool with independent supply and borrow rates
- Governance is controlled by COMP token holders who vote on risk parameters

The utilization rate formula:

\`\`\`
Utilization = Total Borrows / Total Deposits
Borrow Rate = Base Rate + Utilization * Multiplier
Supply Rate = Borrow Rate * Utilization * (1 - Reserve Factor)
\`\`\`

### Aave: The Market Leader

Aave (launched 2020, evolved from ETHLend) expanded on Compound's model with several innovations:

**Flash Loans** — Uncollateralized loans that must be borrowed and repaid within a single transaction. If the loan is not repaid, the entire transaction reverts as if it never happened. Flash loans are used for:
- Arbitrage across DEXs
- Collateral swaps (change your collateral without closing your position)
- Self-liquidation (avoid liquidation penalties)
- Exploit attacks (a double-edged sword)

**Variable and Stable Rates** — Borrowers can choose between variable rates (fluctuating with utilization) and stable rates (fixed for the duration of the loan, though Aave can rebalance in extreme conditions).

**Multi-chain Deployment** — Aave operates on Ethereum, Polygon, Arbitrum, Optimism, Avalanche, and other chains.

**GHO Stablecoin** — Aave launched its own stablecoin (GHO) that can be minted by borrowers using their Aave collateral.

### Interest Rate Dynamics

DeFi lending rates fluctuate based on market conditions:

- During bull markets, borrow demand is high (leverage trading), pushing rates up
- During bear markets, demand drops, and rates can fall below 1%
- Stablecoin lending rates tend to be higher than volatile asset rates (more demand to borrow stables)

Historical USDC lending rates on Aave have ranged from 1% to over 20% depending on market conditions.

### Liquidation Mechanics

Liquidation is the critical safety mechanism:

1. A borrower's health factor drops below 1.0 (collateral value / debt value falls below threshold)
2. Any external party (the liquidator) can repay up to 50% of the borrower's debt
3. The liquidator receives the equivalent collateral plus a liquidation bonus (typically 5-10%)
4. The remaining position has a healthier collateral ratio

Liquidation bots monitor thousands of positions and compete to liquidate unhealthy positions, ensuring protocol solvency.

### Risks of DeFi Lending

- **Smart contract risk** — Bugs in lending protocol code (Euler Finance lost \$197M in 2023 through a vulnerability)
- **Oracle failure** — Incorrect price data can trigger wrongful liquidations or prevent necessary ones
- **Cascade liquidations** — A sharp market drop triggers mass liquidations, which further depress prices, triggering more liquidations
- **Governance attacks** — Malicious proposals could drain protocol funds

### Key Takeaway

DeFi lending protocols have created a parallel banking system that operates 24/7, without human intervention, governed by smart contracts and algorithmic interest rates. Overcollateralization ensures solvency, but the system remains vulnerable to smart contract exploits, oracle failures, and cascade liquidation events.`,
    },
    {
      id: "ft-yield-farming",
      slug: "yield-farming",
      title: "Yield Farming",
      content: `## Yield Farming

Yield farming is the practice of maximizing returns on crypto assets by actively moving funds between DeFi protocols to capture the highest available yields. It emerged in the "DeFi Summer" of 2020 when Compound launched its COMP token distribution, sparking a gold rush of yield-seeking capital that drove DeFi TVL from \$1 billion to over \$15 billion in just a few months.

### How Yield Farming Works

At its simplest, yield farming involves depositing assets into DeFi protocols that reward depositors with:

1. **Interest/fees** — Lending protocols pay interest; DEXs distribute trading fees to liquidity providers
2. **Token rewards** — Protocols distribute their governance tokens to attract liquidity (liquidity mining)
3. **Compounding** — Reinvesting earned rewards to generate returns on returns

The total yield from a farming position is the combination of all these sources:

\`\`\`
Total APY = Base Yield (fees/interest) + Token Rewards APY + Compounding Effect
\`\`\`

### Liquidity Mining

Liquidity mining is the specific practice of earning protocol tokens by providing liquidity. Protocols use it as a bootstrapping mechanism — distributing tokens to attract users and TVL:

- **Compound** gave COMP tokens to borrowers and lenders
- **Uniswap** distributed UNI to all past users (one of the largest airdrops in history)
- **Curve** distributes CRV tokens to liquidity providers, with boosts for locking CRV (the "Curve Wars")
- **Arbitrum** distributed ARB tokens to early users and DeFi protocols on its network

### Common Yield Farming Strategies

| Strategy | Risk Level | Typical APY | Description |
|----------|-----------|-------------|-------------|
| **Stablecoin lending** | Low | 3-10% | Deposit USDC/USDT into Aave or Compound |
| **Blue-chip LP** | Medium | 5-20% | Provide ETH/USDC liquidity on Uniswap |
| **Incentivized pools** | Medium-High | 20-100% | Farm token rewards on new protocols |
| **Leveraged farming** | High | 50-200%+ | Borrow to increase farming exposure |
| **Recursive lending** | High | Variable | Deposit, borrow, re-deposit in loops |

### Yield Aggregators

Yield aggregators automate the process of finding and capturing the best yields:

**Yearn Finance** — The pioneer yield aggregator. Yearn's vaults automatically move user funds between lending protocols, liquidity pools, and farming opportunities to maximize returns. Users deposit tokens and receive vault tokens (yvTokens) that appreciate in value as the vault generates yield.

**Beefy Finance** — Multi-chain yield optimizer that auto-compounds farming rewards across 20+ chains.

**Convex Finance** — Specifically optimizes yields on Curve by aggregating CRV tokens to boost rewards for all participants.

### The Curve Wars

The "Curve Wars" is one of the most fascinating dynamics in DeFi. Curve Finance distributes CRV tokens to liquidity providers, and locking CRV (as veCRV) gives voting power to direct future CRV emissions to specific pools. This created a competition:

- **Protocols accumulate veCRV** to direct emissions to their token's liquidity pools
- **Convex Finance** aggregates CRV from many users, becoming the largest veCRV holder
- **Other protocols bribe** Convex holders to vote for their pools
- **A market for governance power** emerged, with protocols spending millions to attract liquidity

This dynamic demonstrates how DeFi governance tokens can become strategic assets with value far beyond simple speculation.

### Risks of Yield Farming

**Impermanent loss** — Providing liquidity to AMMs exposes you to impermanent loss (covered in the DEX lesson). High APYs from token rewards may or may not compensate for this loss.

**Token price decline** — You earn tokens that may decrease in value. A 100% APY paid in a token that drops 90% results in a net loss.

**Smart contract risk** — Each protocol you interact with adds another layer of smart contract risk. Composing multiple protocols (deposit into A, borrow from B, farm on C) multiplies the risk.

**Rug pulls** — Unaudited protocols may contain backdoors that allow developers to drain user funds. "Rug pull" is the term for when developers abandon a project and steal deposited funds.

**Impermanent yield** — High APYs are often temporary. As more capital flows in, yields are diluted. Early farmers earn outsized returns; latecomers receive much less.

### Evaluating Farming Opportunities

Before committing capital, evaluate:

1. **Protocol audit status** — Has the code been audited by reputable firms (Trail of Bits, OpenZeppelin)?
2. **TVL and history** — How long has the protocol been running? How much capital is locked?
3. **Token emission schedule** — Are rewards sustainable or will they drop sharply?
4. **Underlying yield source** — Where does the yield come from? (Real fees are sustainable; token emissions are not)
5. **Smart contract interactions** — How many protocols are involved? Each adds risk.

### Key Takeaway

Yield farming democratized access to sophisticated financial strategies but introduced new risks. The key lesson is to understand where yield comes from: real yield (trading fees, lending interest) is sustainable; token emission yield is temporary and often masks declining economics. The most successful farmers are those who manage risk as carefully as they chase returns.`,
    },
    {
      id: "ft-stablecoins",
      slug: "stablecoins",
      title: "Stablecoins",
      content: `## Stablecoins

Stablecoins are cryptocurrencies designed to maintain a stable value relative to a reference asset, typically the US dollar. They bridge the gap between the volatile crypto world and the stable purchasing power of fiat currency, serving as the primary medium of exchange, unit of account, and store of value within DeFi. The total stablecoin market cap exceeds \$150 billion, with daily transaction volumes often surpassing those of Visa and Mastercard combined.

### Why Stablecoins Matter

Without stablecoins, the crypto ecosystem would be severely limited:

- **Trading** — You cannot price assets or measure profits in a currency that moves 5-10% daily
- **DeFi** — Lending, borrowing, and yield farming require stable denominations
- **Payments** — Merchants cannot accept crypto if the value changes before they can use it
- **Remittances** — Workers sending money home need predictable values at both ends
- **Savings** — Holding wealth in volatile assets is impractical for most people

### Types of Stablecoins

| Type | Mechanism | Examples | Pros | Cons |
|------|-----------|---------|------|------|
| **Fiat-backed** | 1:1 reserves of USD in bank accounts | USDC, USDT | Simple, reliable peg | Centralized, censurable |
| **Crypto-backed** | Overcollateralized crypto deposits | DAI, LUSD | Decentralized | Capital inefficient, complex |
| **Algorithmic** | Supply/demand algorithms, no collateral | UST (failed), FRAX | Capital efficient | Fragile, death spiral risk |
| **RWA-backed** | Backed by real-world assets (T-bills) | USDY, USDM | Yield-bearing | Regulatory complexity |

### USDT (Tether)

Tether is the largest stablecoin by market cap (\$80B+) and the most traded cryptocurrency by volume. For every USDT issued, Tether Holdings claims to hold equivalent reserves.

**Controversies:** Tether has been criticized for opacity about its reserves. A 2021 settlement with the New York Attorney General revealed that Tether had, at times, not maintained full 1:1 backing. The company now publishes quarterly attestations (not full audits) showing reserves that include US Treasury bills, commercial paper, and other assets.

Despite these controversies, USDT has maintained its peg through multiple market crashes, demonstrating the power of liquidity and network effects.

### USDC (Circle)

USDC is the second-largest stablecoin (\$30B+ market cap), issued by Circle in partnership with Coinbase. USDC differentiates itself through transparency:

- Monthly attestations by Grant Thornton (a top accounting firm)
- Reserves held in US Treasury securities and cash at regulated banks
- Regulated as a stored-value instrument under state money transmitter licenses
- Compatible with multiple blockchains (Ethereum, Solana, Arbitrum, Base, etc.)

USDC briefly lost its peg in March 2023 when Silicon Valley Bank collapsed (Circle held \$3.3B of reserves there), dropping to \$0.87 before recovering after the FDIC guaranteed deposits.

### DAI (MakerDAO)

DAI is the leading **decentralized** stablecoin, maintained by the MakerDAO protocol:

1. Users deposit collateral (ETH, WBTC, stablecoins) into Maker Vaults
2. They can mint DAI up to the collateral ratio (typically 150% for ETH)
3. Users pay a stability fee (interest rate) on their DAI debt
4. If collateral value drops below the threshold, the position is liquidated

DAI maintains its peg through a combination of:
- **Overcollateralization** — More than \$1 of collateral backs each DAI
- **Stability fees** — Adjusted by MKR governance to manage supply
- **Peg Stability Module (PSM)** — Allows 1:1 swaps between DAI and USDC
- **Liquidation incentives** — Keepers are rewarded for liquidating unhealthy positions

### The Algorithmic Stablecoin Experiment (and Failure)

In May 2022, TerraUSD (UST) — an algorithmic stablecoin — collapsed from \$1 to near zero in a matter of days, destroying over \$40 billion in value. The mechanism:

- UST was maintained by an arbitrage loop with LUNA: burn \$1 of LUNA to mint 1 UST, or burn 1 UST to redeem \$1 of LUNA
- When confidence in UST wavered, holders rushed to redeem, flooding the market with LUNA
- LUNA's price crashed, making the arbitrage mechanism insufficient to maintain the peg
- A classic **death spiral** ensued: falling LUNA price -> more UST redemptions -> more LUNA minted -> further LUNA price decline

This collapse was a watershed moment for the crypto industry, leading to increased regulatory scrutiny and a widespread retreat from algorithmic stablecoin designs.

### Regulatory Landscape

Stablecoins have attracted intense regulatory attention:

- **US** — The proposed Stablecoin Payment Act would require issuers to hold 1:1 reserves in high-quality liquid assets and obtain a federal license
- **EU** — MiCA (Markets in Crypto-Assets) regulation requires stablecoin issuers to be licensed, hold reserves with custodians, and limit the size of non-euro stablecoins
- **Globally** — The FSB and BIS have published frameworks calling for stablecoin regulation equivalent to bank deposit regulation

### Key Takeaway

Stablecoins are the most practically useful application of blockchain technology to date, enabling a global, 24/7, programmable dollar system. The market has converged on fiat-backed models (USDC, USDT) as the safest approach, with decentralized alternatives (DAI) serving the DeFi ecosystem. The Terra collapse demonstrated that algorithmic stability mechanisms are inherently fragile, and the industry has shifted toward fully collateralized models.`,
    },
  ],
};

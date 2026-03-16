import { Module } from "../types";

export const blockchainModule: Module = {
  id: "ft-blockchain",
  title: "Blockchain Fundamentals",
  description:
    "Understand blockchain technology from the ground up — distributed ledgers, consensus mechanisms, smart contracts, tokenomics, and the Layer 1 vs Layer 2 scaling debate.",
  lessons: [
    {
      id: "ft-what-is-blockchain",
      slug: "what-is-blockchain",
      title: "What is Blockchain",
      content: `## What is Blockchain?

Blockchain is a distributed, immutable ledger technology that enables multiple parties to agree on a shared state without trusting a central authority. Originally invented to power Bitcoin (2008), blockchain has evolved into a general-purpose platform for decentralized applications, programmable money, and trustless coordination.

### The Core Concept

A blockchain is a chain of **blocks**, where each block contains a batch of transactions. Each block includes a cryptographic hash of the previous block, creating an unbreakable chain:

\`\`\`
Block 0 (Genesis)     Block 1              Block 2
+--------------+      +--------------+      +--------------+
| Hash: 0x00a  |<-----| PrevHash: 0x00a |<--| PrevHash: 0x3f |
| Transactions |      | Hash: 0x3f7  |      | Hash: 0x8b2  |
| Timestamp    |      | Transactions |      | Transactions |
| Nonce        |      | Timestamp    |      | Timestamp    |
+--------------+      +--------------+      +--------------+
\`\`\`

If anyone tries to alter a transaction in Block 1, its hash changes, which invalidates Block 2's reference to it, which invalidates Block 3, and so on. To alter history, an attacker would need to recompute every subsequent block faster than the rest of the network — which is computationally infeasible for well-secured blockchains.

### Key Properties

| Property | Description |
|----------|-------------|
| **Decentralization** | No single entity controls the network; thousands of nodes maintain copies of the ledger |
| **Immutability** | Once confirmed, transactions cannot be altered or deleted |
| **Transparency** | All transactions are visible on the public ledger (pseudonymous, not anonymous) |
| **Trustlessness** | Participants do not need to trust each other — the protocol enforces the rules |
| **Censorship resistance** | No single party can block or reverse a valid transaction |

### Types of Blockchains

**Public blockchains** (Bitcoin, Ethereum) are open to anyone. Anyone can read transactions, submit transactions, and participate in consensus. They are secured by economic incentives (mining rewards, staking rewards).

**Private/permissioned blockchains** (Hyperledger Fabric, R3 Corda) restrict participation to authorized entities. They are used by enterprises for supply chain tracking, interbank settlement, and other business applications where privacy and performance matter more than decentralization.

**Consortium blockchains** are a middle ground — operated by a group of organizations rather than a single entity or the open public.

### How Transactions Work

A simplified transaction on a blockchain like Bitcoin:

1. Alice creates a transaction: "Send 1 BTC from Alice to Bob"
2. Alice signs the transaction with her private key (cryptographic proof of ownership)
3. The transaction is broadcast to the network
4. Nodes verify the signature and check that Alice has sufficient balance
5. Miners/validators include the transaction in a new block
6. The block is added to the chain through consensus
7. After enough confirmations (typically 6 for Bitcoin), the transaction is considered final

### Beyond Cryptocurrency

While blockchain was created for Bitcoin, the technology has applications far beyond digital currency:

- **Decentralized finance (DeFi)** — Lending, borrowing, and trading without intermediaries
- **Supply chain** — Tracking goods from manufacturer to consumer with tamper-proof records
- **Digital identity** — Self-sovereign identity systems where users control their own data
- **Voting** — Transparent, auditable election systems
- **NFTs** — Unique digital assets proving ownership of art, collectibles, and real-world assets
- **Tokenization** — Converting real-world assets (real estate, stocks, bonds) into blockchain tokens

### Limitations

Blockchain is powerful but not a universal solution:

- **Scalability** — Public blockchains process far fewer transactions per second than traditional databases (Bitcoin: ~7 TPS, Visa: ~65,000 TPS)
- **Energy consumption** — Proof-of-Work blockchains consume enormous energy (Bitcoin uses more electricity than some countries)
- **Finality** — Probabilistic finality means transactions are never truly irreversible, just increasingly unlikely to be reversed
- **Complexity** — Building on blockchain requires new programming paradigms, security models, and user experience approaches

### Key Takeaway

Blockchain is a foundational technology that enables trustless coordination between parties who do not know or trust each other. Its value lies not in replacing all databases but in specific use cases where decentralization, immutability, and transparency are genuinely needed.`,
    },
    {
      id: "ft-consensus-mechanisms",
      slug: "consensus-mechanisms",
      title: "Consensus Mechanisms (PoW/PoS)",
      content: `## Consensus Mechanisms: Proof of Work and Proof of Stake

Consensus mechanisms are the algorithms that allow distributed networks to agree on the current state of the blockchain without a central authority. They solve the fundamental challenge of distributed systems: how do you prevent double-spending and ensure all nodes agree on which transactions are valid when anyone can participate and no one is inherently trusted?

### The Byzantine Generals Problem

Blockchain consensus is a practical solution to the **Byzantine Generals Problem** — a classic computer science challenge. Imagine several generals surrounding a city, communicating only by messenger. Some generals may be traitors who send conflicting messages. The honest generals need a protocol that allows them to agree on a plan (attack or retreat) despite the traitors.

In blockchain terms, the "generals" are nodes, the "traitors" are malicious actors, and the "plan" is the valid state of the ledger.

### Proof of Work (PoW)

Bitcoin introduced Proof of Work in 2008. The mechanism works as follows:

1. **Transactions are collected** into a candidate block by miners
2. **Miners compete** to find a nonce (number) that, when combined with the block data and hashed, produces a hash below a target value
3. **The first miner to find a valid hash** broadcasts the block to the network
4. **Other nodes verify** the hash is valid (verification is instant; finding it is hard)
5. **The winning miner earns** the block reward (currently 3.125 BTC) plus transaction fees

The key properties of PoW:

- **Energy-intensive** — Miners consume electricity to perform hash computations. Bitcoin's annual energy consumption exceeds 100 TWh
- **Sybil-resistant** — You cannot fake computational work; to control the network, you need 51% of the hash power
- **Probabilistic finality** — Blocks become exponentially harder to reverse as more blocks are added on top (after 6 blocks, reversal is practically impossible)
- **Difficulty adjustment** — Bitcoin adjusts the mining difficulty every 2,016 blocks (~2 weeks) to maintain ~10 minute block times regardless of total network hash power

### Proof of Stake (PoS)

Proof of Stake replaces energy expenditure with economic stake. Instead of mining, validators lock up (stake) cryptocurrency as collateral:

1. **Validators stake tokens** — Lock up ETH, SOL, or other tokens as collateral
2. **A validator is selected** to propose the next block (selection probability proportional to stake)
3. **Other validators attest** to the validity of the proposed block
4. **Valid blocks are finalized** — Validators earn rewards for honest participation
5. **Slashing** — Validators who act dishonestly (e.g., proposing conflicting blocks) lose part of their stake

Ethereum's transition from PoW to PoS ("The Merge," September 2022) was the most significant blockchain upgrade in history, reducing Ethereum's energy consumption by approximately 99.95%.

### PoW vs. PoS Comparison

| Feature | Proof of Work | Proof of Stake |
|---------|--------------|---------------|
| **Security model** | Computational cost | Economic stake |
| **Energy use** | Very high | Very low (~99.9% less) |
| **Hardware** | Specialized ASICs | Standard computers |
| **Entry barrier** | Capital for mining equipment | Capital for staking |
| **Centralization risk** | Mining pool concentration | Wealth concentration |
| **Finality** | Probabilistic (~60 min for Bitcoin) | Faster (seconds to minutes) |
| **Throughput** | Low (Bitcoin: ~7 TPS) | Higher (varies by implementation) |
| **Examples** | Bitcoin, Litecoin, Dogecoin | Ethereum, Solana, Cardano |

### Other Consensus Mechanisms

| Mechanism | Description | Used By |
|-----------|-------------|---------|
| **Delegated PoS (DPoS)** | Token holders vote for a small set of delegates who produce blocks | EOS, Tron |
| **Proof of Authority (PoA)** | Known, trusted validators produce blocks | Private chains, testnets |
| **Proof of History (PoH)** | Cryptographic timestamps to order events before consensus | Solana |
| **Practical BFT (PBFT)** | Classical BFT algorithm for small validator sets | Hyperledger, some consortium chains |
| **Proof of Space** | Storage capacity instead of computation | Chia, Filecoin |

### The Trilemma

Vitalik Buterin described the **blockchain trilemma**: it is difficult to simultaneously achieve decentralization, security, and scalability. Most consensus mechanisms optimize for two at the expense of the third:

- Bitcoin (PoW): High security and decentralization, low scalability
- Solana (PoH + PoS): High scalability, moderate decentralization, occasional outages raise security questions
- Hyperledger (PoA): High scalability and security, centralized

### Key Takeaway

Consensus mechanisms are the heart of blockchain security. PoW proved that decentralized consensus is possible; PoS showed it can be done without massive energy waste. The choice of consensus mechanism involves fundamental tradeoffs between security, decentralization, scalability, and environmental impact.`,
    },
    {
      id: "ft-smart-contracts",
      slug: "smart-contracts",
      title: "Smart Contracts (Ethereum/Solidity)",
      content: `## Smart Contracts: Ethereum and Solidity

Smart contracts are self-executing programs stored on a blockchain that automatically enforce the terms of an agreement when predefined conditions are met. They are the foundation of decentralized applications (dApps), DeFi protocols, NFT marketplaces, and DAOs. Ethereum, launched in 2015 by Vitalik Buterin, was the first blockchain to support general-purpose smart contracts.

### What is a Smart Contract?

A smart contract is code that lives on the blockchain and executes automatically. Once deployed, it cannot be altered (it is immutable, like all blockchain data), and its execution is transparent and verifiable by anyone.

The analogy: a vending machine is a simple smart contract. You insert money (input), select a product (condition), and the machine dispenses the item (execution). No human intermediary is needed, and the rules are enforced by the machine itself.

### Ethereum: The Smart Contract Platform

Ethereum extended Bitcoin's scripting capabilities into a Turing-complete virtual machine:

- **Ethereum Virtual Machine (EVM)** — A global, decentralized computer that executes smart contracts. Every Ethereum node runs the EVM and processes every transaction.
- **Gas** — The unit of computational cost. Every operation (addition, storage read, transfer) costs gas. Users pay gas fees to compensate validators for processing their transactions.
- **Accounts** — Ethereum has two types: Externally Owned Accounts (EOAs, controlled by private keys) and Contract Accounts (controlled by smart contract code).
- **State** — Unlike Bitcoin (which only tracks unspent transaction outputs), Ethereum maintains a complete state database of all account balances and contract storage.

### Solidity: The Language of Ethereum

Solidity is the most widely used language for writing Ethereum smart contracts. It is statically typed, supports inheritance, and is syntactically similar to JavaScript:

\`\`\`
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(string memory _name, string memory _symbol, uint256 _supply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _supply * 10 ** decimals;
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
}
\`\`\`

### Gas and Transaction Costs

Every smart contract operation costs gas. Some examples:

| Operation | Gas Cost | Approximate USD (at 30 gwei, ETH at \$3000) |
|-----------|----------|---------------------------------------------|
| Simple ETH transfer | 21,000 | ~\$1.89 |
| ERC-20 token transfer | ~65,000 | ~\$5.85 |
| Uniswap swap | ~150,000 | ~\$13.50 |
| NFT mint | ~100,000 | ~\$9.00 |
| Complex DeFi interaction | ~300,000+ | ~\$27.00+ |

High gas costs have been a persistent challenge for Ethereum, driving development of Layer 2 solutions and alternative blockchains.

### Smart Contract Security

Smart contract bugs can be catastrophic because deployed code is immutable and controls real money. Famous exploits include:

- **The DAO Hack (2016)** — A reentrancy bug allowed an attacker to drain \$60 million from a decentralized investment fund. This led to Ethereum's controversial hard fork.
- **Parity Wallet Freeze (2017)** — A bug in a multi-sig wallet library permanently locked \$280 million in ETH.
- **Wormhole Bridge (2022)** — A signature verification bug allowed an attacker to steal \$320 million.

**Security best practices:**
- Use established libraries (OpenZeppelin) rather than writing from scratch
- Conduct formal verification and multiple independent audits
- Implement time-locks and admin keys for emergency pauses
- Follow the checks-effects-interactions pattern to prevent reentrancy
- Use bug bounty programs to incentivize white-hat hackers

### Beyond Ethereum

Other smart contract platforms compete with Ethereum:

- **Solana** — High throughput (~4000 TPS), low fees, uses Rust for smart contracts
- **Avalanche** — Multiple chains optimized for different use cases
- **Polygon** — Ethereum sidechain/Layer 2 with lower fees
- **Cardano** — Uses Haskell-based Plutus for more formally verifiable contracts
- **Cosmos** — Framework for building application-specific blockchains

### Key Takeaway

Smart contracts transform blockchains from simple payment ledgers into programmable platforms. They enable trustless, automated agreements — but their immutability means bugs are permanent and expensive. Security-first development practices are non-negotiable.`,
    },
    {
      id: "ft-tokenomics",
      slug: "tokenomics",
      title: "Tokenomics (ERC-20/721)",
      content: `## Tokenomics: ERC-20, ERC-721, and Token Design

Tokenomics — the economics of blockchain tokens — encompasses how tokens are created, distributed, used, and valued. Token standards like ERC-20 (fungible tokens) and ERC-721 (non-fungible tokens) have created a common language for digital assets, enabling a multi-trillion dollar ecosystem of cryptocurrencies, utility tokens, governance tokens, and NFTs.

### What is a Token?

A token is a digital asset created on an existing blockchain (as opposed to a coin, which is the native currency of its own blockchain). Tokens can represent virtually anything:

- **Currency** — USDC, USDT (stablecoins pegged to the US dollar)
- **Utility** — UNI (governance of Uniswap), LINK (payment for Chainlink oracle services)
- **Security** — Tokenized stocks, bonds, or real estate
- **Collectible** — NFTs representing unique digital art or in-game items
- **Access** — Tokens that grant access to a platform, community, or service

### ERC-20: The Fungible Token Standard

ERC-20 (Ethereum Request for Comments 20) is the standard interface for fungible tokens on Ethereum. "Fungible" means each token is identical and interchangeable — one USDC is the same as any other USDC.

The ERC-20 interface defines six mandatory functions:

| Function | Description |
|----------|-------------|
| \`totalSupply()\` | Returns the total number of tokens in existence |
| \`balanceOf(address)\` | Returns the token balance of an account |
| \`transfer(to, amount)\` | Transfers tokens from the caller to another address |
| \`approve(spender, amount)\` | Authorizes another address to spend tokens on your behalf |
| \`allowance(owner, spender)\` | Returns the remaining approved amount |
| \`transferFrom(from, to, amount)\` | Transfers tokens using an approved allowance |

There are over 500,000 ERC-20 tokens on Ethereum. Major examples include USDC (\$30B+ market cap), USDT (\$80B+), LINK, UNI, and SHIB.

### ERC-721: The Non-Fungible Token Standard

ERC-721 defines the standard for non-fungible tokens (NFTs). Each token has a unique \`tokenId\`, making it distinguishable from every other token in the same contract:

| Function | Description |
|----------|-------------|
| \`ownerOf(tokenId)\` | Returns the owner of a specific token |
| \`transferFrom(from, to, tokenId)\` | Transfers a specific token |
| \`approve(to, tokenId)\` | Approves transfer of a specific token |
| \`tokenURI(tokenId)\` | Returns the metadata URI for a token (image, attributes) |

NFTs exploded in 2021 with sales exceeding \$25 billion. Use cases include:
- Digital art (Beeple's "Everydays" sold for \$69 million at Christie's)
- Profile pictures (Bored Ape Yacht Club, CryptoPunks)
- Gaming items (in-game assets that players truly own)
- Music and entertainment (artists selling directly to fans)
- Real-world assets (property deeds, event tickets)

### Token Design Fundamentals

Creating a successful token requires careful economic design:

**1. Supply mechanics:**
- **Fixed supply** — Bitcoin has a hard cap of 21 million coins. Scarcity drives value.
- **Inflationary supply** — Ethereum issues new ETH as staking rewards (~0.5-1% annually)
- **Deflationary mechanisms** — Token burning (removing tokens from circulation) reduces supply over time. Ethereum's EIP-1559 burns base fees, making ETH potentially deflationary.

**2. Distribution:**
- **Fair launch** — All tokens are earned through mining/staking (Bitcoin)
- **ICO/IDO** — Initial token sale to raise funds (carries regulatory risk)
- **Airdrop** — Free distribution to existing users (Uniswap distributed UNI to all past users)
- **Vesting** — Team and investor tokens locked for a period to prevent immediate selling

**3. Utility:**
- **Governance** — Token holders vote on protocol changes (MakerDAO, Uniswap)
- **Staking** — Lock tokens to secure the network and earn rewards
- **Payment** — Use tokens to pay for services within the ecosystem
- **Fee reduction** — Hold tokens to get discounts (BNB on Binance)

### Token Valuation

Valuing tokens is challenging because traditional financial models (DCF, P/E ratios) do not directly apply. Common approaches include:

- **Network value to transaction ratio (NVT)** — Market cap divided by daily transaction volume (analogous to P/E ratio)
- **Token velocity** — How frequently tokens change hands; high velocity can suppress price
- **Total value locked (TVL)** — For DeFi protocols, the total assets deposited in the protocol
- **Comparable analysis** — Comparing market cap to similar protocols
- **Demand-side modeling** — Estimating future demand for the token's utility

### Regulatory Considerations

The critical question for any token: is it a **security**? In the US, the SEC applies the Howey Test — a token is a security if it involves (1) an investment of money, (2) in a common enterprise, (3) with an expectation of profits, (4) derived from the efforts of others.

Most utility and governance tokens try to avoid security classification by ensuring the token has genuine utility beyond speculation. However, the regulatory landscape remains uncertain, and many tokens may be unregistered securities.

### Key Takeaway

Tokenomics is the intersection of economics, game theory, and cryptography. Well-designed tokens align incentives between users, developers, and investors, creating self-sustaining ecosystems. Poorly designed tokens collapse as insiders dump, utility fails to materialize, or regulators intervene.`,
    },
    {
      id: "ft-layer1-vs-layer2",
      slug: "layer1-vs-layer2",
      title: "Layer 1 vs Layer 2",
      content: `## Layer 1 vs. Layer 2 Scaling

Blockchain scalability — the ability to handle more transactions without sacrificing decentralization or security — is one of the most important challenges in the industry. The Layer 1 vs. Layer 2 debate centers on where to solve this problem: by improving the base blockchain itself, or by building additional layers on top of it.

### The Scalability Problem

Popular blockchains are slow compared to traditional payment networks:

| Network | Transactions Per Second (TPS) | Finality Time |
|---------|------------------------------|---------------|
| Visa | ~65,000 | Seconds (authorization) |
| Bitcoin | ~7 | ~60 minutes |
| Ethereum (pre-L2) | ~15-30 | ~15 minutes |
| Ethereum + L2 | ~2,000-4,000 | Seconds to minutes |
| Solana | ~4,000 (theoretical) | ~400ms |

High demand leads to network congestion, high fees, and poor user experience. During the 2021 NFT boom, Ethereum gas fees regularly exceeded \$100 per transaction, pricing out most users.

### Layer 1 Solutions

Layer 1 (L1) solutions improve the base blockchain itself:

**1. Bigger blocks** — Increase the amount of data in each block. Bitcoin Cash (BCH) increased block size from 1MB to 32MB. This increases throughput but also increases hardware requirements for running nodes, potentially reducing decentralization.

**2. Faster consensus** — Use faster consensus mechanisms. Solana's Proof of History enables ~400ms block times. Avalanche uses a novel consensus protocol that achieves finality in under 2 seconds.

**3. Sharding** — Divide the blockchain into multiple parallel chains (shards) that process transactions simultaneously. Ethereum's roadmap includes danksharding, which will distribute data across the network. Near Protocol already implements sharding.

**4. Alternative architectures** — Some L1s use fundamentally different designs. Aptos and Sui use Move language and parallel execution. Cosmos enables application-specific blockchains (appchains) that communicate via IBC (Inter-Blockchain Communication).

### Layer 2 Solutions

Layer 2 (L2) solutions build on top of an existing L1, inheriting its security while providing higher throughput and lower fees:

**1. Rollups** — The dominant L2 approach. Rollups execute transactions off-chain but post transaction data back to the L1, ensuring data availability and security.

*Optimistic Rollups* assume transactions are valid by default and only run fraud proofs if challenged. Examples: Arbitrum, Optimism, Base. Withdrawal to L1 takes ~7 days (challenge period).

*Zero-Knowledge (ZK) Rollups* use cryptographic proofs (ZK-SNARKs or ZK-STARKs) to prove transaction validity without revealing the underlying data. Examples: zkSync, StarkNet, Polygon zkEVM. Faster withdrawals because validity is cryptographically proven.

**2. State channels** — Two parties open a channel, transact off-chain, and settle the final state on-chain. Like a bar tab: you run a tab (channel), order drinks (transactions), and pay at the end (settle). Lightning Network for Bitcoin is the primary example.

**3. Sidechains** — Independent blockchains with their own consensus that are connected to the main chain via a bridge. Polygon PoS is a popular sidechain for Ethereum. Sidechains have their own security model, which is a tradeoff.

### Rollup Comparison

| Feature | Optimistic Rollups | ZK Rollups |
|---------|-------------------|-----------|
| **Proof mechanism** | Fraud proofs (challenge period) | Validity proofs (cryptographic) |
| **Withdrawal time** | ~7 days | Minutes to hours |
| **Computation cost** | Low (only prove if challenged) | High (generate ZK proofs) |
| **EVM compatibility** | High (Arbitrum, Optimism) | Improving (zkSync, Polygon zkEVM) |
| **Maturity** | Production-ready | Rapidly maturing |
| **TPS** | ~2,000-4,000 | ~2,000-10,000 (theoretical) |

### The Modular Blockchain Thesis

The industry is moving toward a **modular architecture** where different layers specialize in different functions:

- **Execution layer** — Where transactions are processed (L2 rollups)
- **Settlement layer** — Where disputes are resolved and finality is achieved (Ethereum L1)
- **Data availability layer** — Where transaction data is stored and verified (Celestia, EigenDA)
- **Consensus layer** — Where the ordering of transactions is determined

This modular approach allows each layer to be optimized independently, rather than requiring a single blockchain to do everything.

### Economic Implications

The shift from L1-only to L1+L2 has significant economic implications:

- **Value accrual** — Does value accrue to L1 (ETH) or L2 tokens? The "fat protocol" thesis argues that L1 captures most value; the "thin protocol" counter-argument suggests L2s and applications will capture more.
- **Fee dynamics** — L2s compete on fees, potentially driving L1 fee revenue down while increasing overall network usage
- **Developer choices** — Developers must choose which L2 to build on, fragmenting liquidity and user attention across multiple chains

### Key Takeaway

The scalability problem is being solved through a combination of L1 improvements and L2 scaling. Rollups — particularly ZK rollups — are emerging as the dominant L2 approach, offering the best balance of security, scalability, and cost. The future is multi-layered: L1 provides security and settlement, L2 provides execution, and specialized layers handle data availability.`,
    },
  ],
};

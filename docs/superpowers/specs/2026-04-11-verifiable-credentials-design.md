# Verifiable Credentials & Skill Provenance — Design Spec

> **Status:** Approved for planning
> **Date:** 2026-04-11
> **Author:** Brainstormed with Claude (superpowers/brainstorming)
> **Owner:** Bilal Hussain
> **Implementation skill next:** `superpowers:writing-plans`

---

## 1. Goal

Add a verifiable on-chain credential layer to KairosLearn so that learners can mint tamper-proof "diplomas" for completed coding/tech-interview achievements, and so that every practice event becomes provably committed to a public ledger. The wedge is a Pro-tier consumer perk; the same system unlocks future bootcamp white-label and employer verification revenue lines without rebuild.

**The blockchain is not the product. Verifiable trust is the product.** User-facing copy never says "Web3," "NFT," "crypto," or "blockchain." We call them **Verified Credentials**.

---

## 2. Phased revenue model

| Phase | Buyer | Mechanism | Status |
|---|---|---|---|
| 1 | Consumers (Pro-tier) | "Mint Verified Diploma" perk on Pro plan | **In scope** for this spec |
| 2 | Bootcamps / universities | White-label issuance + branded catalog | Out of scope — separate spec later |
| 3 | Employers / recruiters | Verification dashboard + ATS integrations | Out of scope — separate spec later |

Phases 2 and 3 are unblocked by Phase 1 and Sub-project 3 (the proof-of-practice layer). They are not built here, but the data model and contract are designed to accommodate them without rewrite.

---

## 3. Core decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Credential model | Two-tier: rare **diplomas** + batched **proof-of-practice badges** | One system serves consumer wedge AND future employer provenance |
| Wallet UX | **Privy embedded wallets** (MPC, email/Google sign-in) | Only option that converts consumer Pro users without crypto friction; users still own keys |
| Chain | **Base** (Coinbase L2) | Cheapest credible EVM consumer chain; first-class Privy integration; Coinbase brand |
| Gas | **Sponsored** via Coinbase Paymaster | Mint = one click, no ETH funding step |
| Token standard | **ERC-5192** (soulbound, non-transferable) | Marketplaces/wallets respect `locked()=true` natively |
| Catalog source | **Hardcoded TypeScript catalog** | Predictable, verifiable, deterministic eligibility |
| Catalog scope | **Coding courses + tech mock interviews ONLY** | No language, philosophy, finance, religion, etc. |
| Pricing | Pro-tier perk (no per-mint fee in v1) | Wedge converts via Pro upgrade, not per-mint |

---

## 4. Architecture

### 4.1 Components

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│  ├─ /credentials page  (lists eligible + owned diplomas)    │
│  ├─ Privy SDK          (embedded wallet)                    │
│  └─ /verify/<tokenId>  (public, no auth — for recruiters)   │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Next.js server                                             │
│  ├─ /api/credentials/eligible    (GET)                      │
│  ├─ /api/credentials/mint        (POST — single diploma)    │
│  ├─ /api/credentials/wallet      (POST — Privy provisioning)│
│  ├─ /api/credentials/cron/publish-batch (cron — daily)      │
│  └─ /api/credentials/proof       (GET — merkle proof)       │
│                                                             │
│  src/lib/                                                   │
│  ├─ credential-eligibility.ts   (pure fn over Supabase)     │
│  ├─ credential-issuer.ts        (viem + Paymaster)          │
│  └─ credential-merkle.ts        (batch tree builder)        │
│                                                             │
│  src/data/credentials/                                      │
│  └─ catalog.ts                  (v1 hardcoded diplomas)     │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ JSON-RPC
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Base mainnet                                               │
│  └─ SBTRegistry.sol  (ERC-5192, single contract address)    │
│      ├─ mintDiploma(to, tokenId, diplomaId, uri)            │
│      ├─ publishBatch(tokenId, root, uri)                    │
│      └─ revoke(tokenId)                                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ ipfs://
                           ▼
                  ┌─────────────────────┐
                  │  Pinata IPFS        │
                  │  (metadata + roots) │
                  └─────────────────────┘
```

### 4.2 Data model (Supabase migration 028)

```sql
CREATE TABLE user_wallets (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  privy_did TEXT NOT NULL UNIQUE,           -- Privy decentralized ID
  wallet_address TEXT NOT NULL,             -- Base wallet (0x...)
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE issued_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  credential_type TEXT NOT NULL,            -- 'diploma' | 'badge_batch'
  diploma_id TEXT,                          -- catalog id, null for batches
  token_id NUMERIC,                         -- on-chain tokenId
  tx_hash TEXT,
  metadata_uri TEXT,                        -- ipfs://... (diplomas)
  merkle_root TEXT,                         -- batches only
  evidence_snapshot JSONB,                  -- frozen criteria + scores at mint
  status TEXT DEFAULT 'pending',            -- pending|minted|failed|revoked
  minted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_credentials_user ON issued_credentials(user_id);
CREATE INDEX idx_credentials_status ON issued_credentials(status);
CREATE INDEX idx_credentials_diploma ON issued_credentials(diploma_id) WHERE diploma_id IS NOT NULL;
```

RLS: users can `SELECT` their own rows. `INSERT/UPDATE` is service-role only (the API routes use the admin client).

### 4.3 Smart contract — `SBTRegistry.sol` (~150 LOC Solidity, Base)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC5192 {
  event Locked(uint256 tokenId);
  function locked(uint256 tokenId) external view returns (bool);
}

contract KairosLearnSBTRegistry is ERC721, IERC5192, Ownable {
  address public issuer;                      // hot wallet (Vercel env)
  uint256 public nextTokenId = 1;
  mapping(uint256 => string)  public diplomaIdOf;     // diploma tokenId → catalog id
  mapping(uint256 => bytes32) public merkleRootOf;    // batch tokenId → root
  mapping(uint256 => string)  public uriOf;           // tokenId → metadata URI
  mapping(uint256 => bool)    public revoked;

  modifier onlyIssuer() { require(msg.sender == issuer, "not issuer"); _; }

  function setIssuer(address a) external onlyOwner { issuer = a; }

  function mintDiploma(address to, string calldata diplomaId, string calldata uri)
    external onlyIssuer returns (uint256 tokenId)
  {
    tokenId = nextTokenId++;
    diplomaIdOf[tokenId] = diplomaId;
    uriOf[tokenId] = uri;
    _safeMint(to, tokenId);
    emit Locked(tokenId);
  }

  function publishBatch(bytes32 root, string calldata uri)
    external onlyIssuer returns (uint256 tokenId)
  {
    tokenId = nextTokenId++;
    merkleRootOf[tokenId] = root;
    uriOf[tokenId] = uri;
    _safeMint(issuer, tokenId);   // batches are owned by the issuer wallet
    emit Locked(tokenId);
  }

  function revoke(uint256 tokenId) external onlyOwner {
    revoked[tokenId] = true;
    _burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return uriOf[tokenId];
  }

  function locked(uint256) external pure returns (bool) { return true; }

  // Block all transfers — soulbound
  function _update(address to, uint256 tokenId, address auth)
    internal override returns (address)
  {
    address from = _ownerOf(tokenId);
    require(from == address(0) || to == address(0), "soulbound");
    return super._update(to, tokenId, auth);
  }
}
```

The contract is deployed once. It never needs an upgrade — diploma definitions are off-chain (the on-chain `diplomaId` string is just a reference into the catalog), and adding new diplomas is a code change to `catalog.ts`, not a contract migration.

### 4.4 Catalog format

```typescript
// src/data/credentials/catalog.ts
export interface DiplomaCriteriaContext {
  userId: string;
  courseCompletions: { courseId: string; completedAt: string }[];
  mockInterviews: {
    personaId: string;
    score: number;
    completedAt: string;
    interviewType: string;
  }[];
  knowledgeFacts: { predicate: string; object: string }[];
}

export interface DiplomaDefinition {
  id: string;                // stable kebab-case id, lives forever
  title: string;              // "Google SWE Mock Interview Mastery"
  category: 'coding-course' | 'tech-interview';
  description: string;
  imageUrl: string;           // /credentials/diplomas/<id>.png in /public
  rubricSummary: string;      // human-readable rubric (shown on verify page)
  criteria: (ctx: DiplomaCriteriaContext) => boolean;
}

export const CREDENTIAL_CATALOG: DiplomaDefinition[] = [ /* 8–12 entries */ ];
```

### 4.5 v1 catalog (8–12 hardcoded diplomas)

Final list to be assembled during Sub-project 1, but the seed is:

| Diploma ID | Title | Criteria sketch |
|---|---|---|
| `coding-interview-foundations` | Coding Interview Foundations | Completed 16 patterns course + 5+ mocks avg ≥75 |
| `google-swe-mock-mastery` | Google SWE Mock Interview Mastery | 10+ Google-persona mocks, avg ≥80 |
| `meta-swe-mock-mastery` | Meta SWE Mock Interview Mastery | 10+ Meta-persona mocks, avg ≥80 |
| `amazon-swe-mock-mastery` | Amazon SWE Mock Interview Mastery | 10+ Amazon-persona mocks, avg ≥80 |
| `system-design-fundamentals` | System Design Fundamentals | Completed system design course + 3+ system design mocks ≥75 |
| `data-structures-mastery` | Data Structures Mastery | Completed DSA course + passed all checkpoints |
| `dynamic-programming-mastery` | Dynamic Programming Mastery | Completed DP module + 5+ DP mocks ≥75 |
| `python-fundamentals` | Python Fundamentals | Finished Python course + all checkpoints |
| `javascript-fundamentals` | JavaScript Fundamentals | Finished JS course + all checkpoints |
| `react-developer` | React Developer | Finished React course + all checkpoints |
| `behavioral-interview-pro` | Behavioral Interview Pro | 8+ behavioral mocks across 3+ company personas, avg ≥80 |

Languages, philosophy, finance, religion, etc. are explicitly excluded from v1.

---

## 5. End-to-end flows

### 5.1 Privy wallet provisioning (one-time per user)

1. User visits `/credentials` for the first time
2. If no row in `user_wallets`, the React page invokes Privy SDK to create an embedded wallet
3. On success the client POSTs `{ privyDid, walletAddress }` to `/api/credentials/wallet`
4. Server upserts a `user_wallets` row
5. Subsequent visits skip this — the user already has a persistent wallet

### 5.2 Diploma minting (user-initiated)

```
User                Browser              Server (Next.js)            Base + IPFS
 │                    │                       │                          │
 │ Click "Mint"       │                       │                          │
 ├───────────────────►│ POST /api/credentials │                          │
 │                    │      /mint            │                          │
 │                    ├──────────────────────►│                          │
 │                    │                       │ Re-run eligibility       │
 │                    │                       │ (don't trust client)     │
 │                    │                       │                          │
 │                    │                       │ Build metadata JSON      │
 │                    │                       │ Pin to Pinata IPFS       │
 │                    │                       ├─────────────────────────►│
 │                    │                       │◄─── ipfs://Qm...         │
 │                    │                       │                          │
 │                    │                       │ Call SBTRegistry         │
 │                    │                       │ .mintDiploma(...)        │
 │                    │                       │ via Paymaster            │
 │                    │                       ├─────────────────────────►│
 │                    │                       │◄─── tx hash + tokenId    │
 │                    │                       │                          │
 │                    │                       │ Insert issued_credentials│
 │                    │                       │ status='minted'          │
 │                    │◄──────────────────────┤                          │
 │ Confetti +         │ { tokenId, txHash,    │                          │
 │ "Share LinkedIn"   │   verifyUrl }         │                          │
 │◄───────────────────┤                       │                          │
```

### 5.3 Daily badge batching (cron)

1. Vercel cron hits `/api/credentials/cron/publish-batch` at 00:05 UTC
2. Query last 24h of practice events from `interview_session_results`, completed lessons, and high-confidence knowledge graph facts
3. Build a Merkle tree where each leaf = `keccak256(userId, eventType, eventId, score, timestamp)`
4. Pin `{root, leaves[]}` JSON to IPFS
5. Call `SBTRegistry.publishBatch(root, ipfsUri)` (single tx, ~$0.001)
6. Insert `issued_credentials` row with `credential_type='badge_batch'`, `merkle_root`, `tx_hash`

Steady state cost: 30 batches/month × $0.001 = $0.03/month.

### 5.4 Verification (public, no auth)

- `/verify/<tokenId>` — server-rendered page
  - Reads tokenId from `SBTRegistry`, fetches metadata from IPFS, joins to `issued_credentials`
  - Displays diploma title/image/rubric/criteria, owner address, mint date, BaseScan link, "Verify on chain" button
- `/verify/batch/<tokenId>?leaf=<hash>&proof=<base64>` — proof checker for individual events
- Both URLs are crawlable by search engines and shareable (OG tags pre-rendered)

---

## 6. Sub-projects

### Sub-project 1 — Foundation (Week 1, testnet)

**Deliverables:**
- Migration 028 (`user_wallets`, `issued_credentials`)
- `src/data/credentials/catalog.ts` with v1 catalog (8–12 diplomas)
- `src/lib/credential-eligibility.ts`
- `src/lib/credential-issuer.ts` (viem + Coinbase Paymaster)
- `SBTRegistry.sol` deployed to Base Sepolia testnet
- `/api/credentials/eligible`, `/api/credentials/mint`, `/api/credentials/wallet`
- Privy SDK integration on the client
- `/credentials` page (eligible + owned grids)
- Pinata IPFS pinning
- Foundry tests for the contract

**Acceptance:** A Pro user can sign in, get an embedded Privy wallet, and mint a real testnet diploma end-to-end. The diploma appears in the `/credentials` page and on Base Sepolia explorer.

### Sub-project 2 — Mainnet + Verify URL (Week 2)

**Deliverables:**
- Deploy `SBTRegistry` to Base mainnet
- Switch issuer wallet, paymaster config, and IPFS gateway to production
- `/verify/<tokenId>` public page with OG tags
- "Share to LinkedIn" button with preformatted post and image
- Pro-tier gate (free users see grayed-out catalog as upsell)

**Acceptance:** A real Pro user mints a real diploma on Base mainnet, posts the verify URL on LinkedIn, and a recruiter clicks it and sees a verified credential page.

### Sub-project 3 — Badge Batching + Provenance (Week 3)

**Deliverables:**
- `/api/credentials/cron/publish-batch` (Vercel cron config in `vercel.json`)
- `src/lib/credential-merkle.ts` (Merkle tree builder)
- `/api/credentials/proof?eventId=<id>` (returns merkle proof for any single event)
- `/verify/batch/<tokenId>?leaf=&proof=` (verifier-facing proof checker)

**Acceptance:** A single mock interview from yesterday is provably committed on-chain via the daily batch root, and a verifier can confirm via the public proof endpoint.

### Sub-project 4 — Bootcamp white-label (Phase 2, deferred)

Out of scope. Gets its own brainstorm + spec when Phase 1 has paying users.

### Sub-project 5 — Employer verification SaaS (Phase 3, deferred)

Out of scope. Unblocked by Sub-project 3 but the actual product comes later.

---

## 7. Scope boundaries

### NOT in scope (any sub-project, v1)

- ❌ Language learning credentials
- ❌ Non-coding courses (philosophy, finance, religion, health, etc.)
- ❌ Token economy / "learn to earn" / staking / DAO
- ❌ NFT marketplace listings — SBTs aren't tradable, that's the point
- ❌ Cross-chain anything — Base only
- ❌ Custodial wallet fallback — Privy embedded wallets only
- ❌ Manual or admin minting UI — eligibility is fully algorithmic
- ❌ LLM-judged dynamic credentials
- ❌ Per-mint pricing — Pro-tier only

---

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Issuer hot wallet compromise (stolen key, fake mints) | Hot wallet holds only ~1 month of gas; private key in Vercel encrypted env; rotated quarterly. Owner key (allows `revoke` and `setIssuer`) lives in a separate cold Coinbase smart wallet with 2FA. |
| User changes Privy wallet, "loses" old credentials | Document clearly: credentials are tied to wallet address, not user ID. Provide CSV export from `issued_credentials`. Future: support claim-binding multiple wallets to one user. |
| Catalog criteria are gameable | Eligibility uses scoring metadata, not raw counts. Require minimum session duration. Cap at one mint per diploma per user. Re-check eligibility server-side at mint time, never trust the client. |
| User/PR pushback on "blockchain" | Never use the words "blockchain," "Web3," "NFT," or "crypto" in user-facing copy. The product is "Verified Credentials." |
| Gas sponsorship runaway cost | Per-user mint rate limit (1 mint per 24h). Pro-only. Estimated cap of $50/month even at 10k mints. |
| Pro-tier perception devalued for free users | Free users see a single sample diploma + "Upgrade to mint your verified credentials" CTA. |
| Pinata IPFS goes down or rate-limits | Acceptable for v1 — content is also reproducible from `evidence_snapshot` JSON. Future: secondary pin via web3.storage. |
| Privy outage blocks new user wallet creation | Existing users unaffected. New users see "Credential minting temporarily unavailable" — graceful degradation, doesn't block core app. |

---

## 9. Testing strategy

| Layer | Approach |
|---|---|
| Solidity contract | Foundry tests: ERC-5192 conformance, mint/revoke/batch flows, only-issuer access control, soulbound transfer rejection |
| Eligibility engine | Pure unit tests against fixture user states (no DB calls) |
| Issuer service | Integration tests against Base Sepolia using a funded test wallet |
| API routes | Integration tests with seeded Supabase fixtures + mocked Privy + Sepolia issuer |
| Verify page | Snapshot test of the SSR output for a known tokenId |
| End-to-end | Manual run-through on Sub-project 1 acceptance (testnet) before Sub-project 2 mainnet deploy |

---

## 10. Cost model (steady state)

Assuming 100 active Pro users with 30% mint rate:

| Item | Monthly cost |
|---|---|
| Diploma mint gas (~30 mints × $0.002) | $0.06 |
| Daily batch gas (30 batches × $0.001) | $0.03 |
| Pinata IPFS (free tier ≤1k pins) | $0.00 |
| Privy (free tier ≤1k MAU) | $0.00 |
| Base RPC (Alchemy/QuickNode free tier) | $0.00 |
| **Total** | **<$5/month for first 1k users** |

Above 1k MAU: Privy is ~$0.05/MAU and Pinata moves to $20/month for 1M pins. Costs remain trivial relative to Pro-tier revenue ($10/mo × 1k Pro users = $10k MRR vs ~$50/month total infra cost).

---

## 11. Success metrics (Phase 1)

- **Adoption:** % of Pro users who mint at least one diploma within 30 days of Pro upgrade. Target: 25%+
- **Virality:** clicks-to-`/verify/<id>` from external referrers (LinkedIn, etc.). Target: 2+ verify-clicks per minted diploma in first week
- **Pro upgrade attribution:** % of new Pro upgrades that cite "verified credentials" in onboarding survey. Target: 10%+
- **Cost discipline:** monthly gas + Privy + Pinata spend stays under $50 through 1k Pro users

---

## 12. Open questions for the implementation plan

1. Exact final list of v1 catalog diplomas (8–12) — assemble during Sub-project 1 from the seed list in §4.5
2. LinkedIn share post copy template — finalize in Sub-project 2
3. Diploma badge artwork — needs design pass; for v1 use generated SVG with diploma title + KairosLearn logo, replace with custom art post-launch
4. Exact "practice event" types included in daily batches — determine in Sub-project 3 (suggested seed: completed mock interviews, completed lessons with score, high-confidence knowledge graph facts)

---

**Next step:** invoke `superpowers:writing-plans` to produce the implementation plan for Sub-project 1.

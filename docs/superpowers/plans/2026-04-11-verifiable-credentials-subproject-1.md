# Verifiable Credentials — Sub-project 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Pro-tier perk where a logged-in user can sign in, get a Privy embedded wallet on Base Sepolia, and mint a real testnet diploma end-to-end against eligibility data already in Supabase.

**Architecture:** Next.js API routes drive a viem issuer service that talks to a deployed `SBTRegistry` ERC-5192 contract on Base Sepolia. Eligibility is a pure server function over `interview_session_results` and `xp_transactions`. Privy provides embedded wallets via the React SDK; metadata is pinned to Pinata IPFS.

**Tech Stack:** Solidity 0.8.20 + Foundry, viem, @privy-io/react-auth, @privy-io/server-auth, Pinata SDK, Supabase admin client, Vitest (new) for unit tests, Next.js 14 App Router.

**Spec reference:** `docs/superpowers/specs/2026-04-11-verifiable-credentials-design.md`

**Acceptance:** A Pro user signs into KairosLearn, visits `/credentials`, gets a Privy embedded wallet provisioned, sees their eligible diplomas, clicks "Mint," and receives a real ERC-5192 token on Base Sepolia visible in BaseScan and in their `/credentials` "Owned" grid.

---

## File Structure

**Database:**
- Create: `supabase/migrations/028_credentials.sql`

**Smart contract (new top-level `contracts/` directory):**
- Create: `contracts/foundry.toml`
- Create: `contracts/src/SBTRegistry.sol`
- Create: `contracts/test/SBTRegistry.t.sol`
- Create: `contracts/script/Deploy.s.sol`
- Create: `contracts/.gitignore`
- Create: `contracts/README.md` (deploy instructions only)

**Catalog:**
- Create: `src/data/credentials/catalog.ts`
- Create: `src/data/credentials/types.ts`
- Create: `public/credentials/diplomas/.gitkeep` (placeholder dir for SVG art)

**Server libraries:**
- Create: `src/lib/credential-eligibility.ts`
- Create: `src/lib/credential-eligibility.test.ts`
- Create: `src/lib/credential-issuer.ts`
- Create: `src/lib/credential-ipfs.ts`
- Create: `src/lib/privy-server.ts`

**API routes:**
- Create: `src/app/api/credentials/wallet/route.ts`
- Create: `src/app/api/credentials/eligible/route.ts`
- Create: `src/app/api/credentials/mint/route.ts`

**UI:**
- Create: `src/app/credentials/page.tsx`
- Create: `src/components/credentials/CredentialsClient.tsx`
- Create: `src/components/credentials/CredentialCard.tsx`
- Create: `src/components/credentials/PrivyClientProvider.tsx`
- Modify: `src/app/providers.tsx` (wrap with PrivyClientProvider)

**Test infra (new):**
- Create: `vitest.config.ts`
- Modify: `package.json` (add test:unit script + new deps)

**Env & docs:**
- Modify: `.env.local.example` (add new vars)
- Modify: `CLAUDE.md` (add "Verifiable credentials" section under env vars)

---

## Task 1: Install dependencies & set up Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Modify: `.env.local.example`

- [ ] **Step 1: Install runtime + dev deps**

Run:
```bash
npm install viem @privy-io/react-auth @privy-io/server-auth @pinata/sdk merkletreejs
npm install -D vitest @vitest/coverage-v8 dotenv-cli
```

Expected: packages added to `package.json`, `node_modules` populated, no peer warnings beyond the existing ones.

- [ ] **Step 2: Add `vitest.config.ts`**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", ".next", "tests/**"], // tests/ is Playwright
    globals: false,
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Add the unit test script to `package.json`**

In the `scripts` block, add:
```json
"test:unit": "vitest run",
"test:unit:watch": "vitest"
```

Do NOT replace the existing `"test": "playwright test"` script — Playwright stays the e2e runner; Vitest is for `src/**/*.test.ts` only.

- [ ] **Step 4: Append new env vars to `.env.local.example`**

```bash
# ─── Verifiable Credentials (sub-project 1) ───────────────────────────────
# Privy embedded wallets (https://dashboard.privy.io)
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# Base Sepolia testnet (sub-project 1) — switch to Base mainnet in sub-project 2
BASE_RPC_URL=https://sepolia.base.org
SBT_REGISTRY_ADDRESS=
ISSUER_PRIVATE_KEY=                  # 0x-prefixed hex; testnet wallet only
COINBASE_PAYMASTER_URL=               # optional in sub-project 1; required mainnet

# Pinata IPFS (https://app.pinata.cloud)
PINATA_JWT=
PINATA_GATEWAY=https://gateway.pinata.cloud
```

- [ ] **Step 5: Verify Vitest runs against an empty test set**

Run: `npm run test:unit -- --passWithNoTests`
Expected: `No test files found ... exitCode: 0` (or equivalent — exit 0).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts .env.local.example
git commit -m "chore(credentials): scaffold vitest + privy/viem/pinata deps"
```

---

## Task 2: Migration 028 — credential tables

**Files:**
- Create: `supabase/migrations/028_credentials.sql`

- [ ] **Step 1: Write the migration**

```sql
-- Migration 028: Verifiable Credentials (sub-project 1)
-- Stores Privy wallet bindings and issued on-chain credentials.
-- Spec: 2026-04-11-verifiable-credentials-design.md

CREATE TABLE IF NOT EXISTS user_wallets (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  privy_did TEXT NOT NULL UNIQUE,
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_wallets_address
  ON user_wallets (wallet_address);

CREATE TABLE IF NOT EXISTS issued_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  credential_type TEXT NOT NULL CHECK (credential_type IN ('diploma', 'badge_batch')),
  diploma_id TEXT,                                   -- catalog id; null for batches
  token_id NUMERIC,                                  -- on-chain tokenId
  tx_hash TEXT,
  metadata_uri TEXT,                                 -- ipfs://... (diplomas)
  merkle_root TEXT,                                  -- batches only (sub-project 3)
  evidence_snapshot JSONB,                           -- frozen criteria + scores
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'minted', 'failed', 'revoked')),
  minted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_issued_credentials_user
  ON issued_credentials (user_id);
CREATE INDEX IF NOT EXISTS idx_issued_credentials_status
  ON issued_credentials (status);
CREATE INDEX IF NOT EXISTS idx_issued_credentials_diploma
  ON issued_credentials (diploma_id) WHERE diploma_id IS NOT NULL;

-- One mint per diploma per user (enforced at the DB level for safety)
CREATE UNIQUE INDEX IF NOT EXISTS idx_issued_credentials_user_diploma_unique
  ON issued_credentials (user_id, diploma_id)
  WHERE credential_type = 'diploma' AND status = 'minted';

-- RLS: users can SELECT their own, server-role does writes
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uw_select_own ON user_wallets;
CREATE POLICY uw_select_own ON user_wallets
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE issued_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ic_select_own ON issued_credentials;
CREATE POLICY ic_select_own ON issued_credentials
  FOR SELECT USING (auth.uid() = user_id);
```

- [ ] **Step 2: Apply the migration**

Run: `npx supabase db push`
Expected: `Applying migration 028_credentials.sql...` and exit 0. If you don't have local supabase running, run it on the linked project: `npx supabase db push --linked`.

- [ ] **Step 3: Verify the tables exist**

Run:
```bash
npx supabase db execute --linked "SELECT table_name FROM information_schema.tables WHERE table_name IN ('user_wallets','issued_credentials')"
```
Expected: two rows returned.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/028_credentials.sql
git commit -m "feat(credentials): migration 028 — user_wallets + issued_credentials"
```

---

## Task 3: Foundry project + SBTRegistry contract

**Files:**
- Create: `contracts/foundry.toml`
- Create: `contracts/.gitignore`
- Create: `contracts/src/SBTRegistry.sol`
- Create: `contracts/README.md`

- [ ] **Step 1: Initialize the Foundry project**

Run:
```bash
mkdir -p contracts && cd contracts
forge init --no-git --no-commit --force .
forge install OpenZeppelin/openzeppelin-contracts --no-commit
cd ..
```

Expected: `contracts/` populated with `src/`, `test/`, `script/`, `lib/openzeppelin-contracts/`. If `forge` is missing, install it: `curl -L https://foundry.paradigm.xyz | bash && foundryup`.

- [ ] **Step 2: Write `contracts/foundry.toml`**

```toml
[profile.default]
src = "src"
test = "test"
script = "script"
out = "out"
libs = ["lib"]
solc_version = "0.8.20"
optimizer = true
optimizer_runs = 200

[rpc_endpoints]
base_sepolia = "${BASE_RPC_URL}"

[etherscan]
base_sepolia = { key = "${BASESCAN_API_KEY}", url = "https://api-sepolia.basescan.org/api" }
```

- [ ] **Step 3: Write `contracts/.gitignore`**

```
out/
cache/
broadcast/
lib/
.env
```

- [ ] **Step 4: Delete the Foundry default `Counter` files**

Run:
```bash
rm -f contracts/src/Counter.sol contracts/test/Counter.t.sol contracts/script/Counter.s.sol
```

- [ ] **Step 5: Write `contracts/src/SBTRegistry.sol`**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "openzeppelin-contracts/token/ERC721/ERC721.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

interface IERC5192 {
    event Locked(uint256 tokenId);
    function locked(uint256 tokenId) external view returns (bool);
}

/// @title KairosLearn Soulbound Credential Registry
/// @notice ERC-5192 soulbound tokens for diplomas + daily proof-of-practice batches.
/// @dev Single contract; diploma vs batch is differentiated by which mapping is set.
contract KairosLearnSBTRegistry is ERC721, IERC5192, Ownable {
    address public issuer;
    uint256 public nextTokenId = 1;

    mapping(uint256 => string)  public diplomaIdOf;
    mapping(uint256 => bytes32) public merkleRootOf;
    mapping(uint256 => string)  public uriOf;
    mapping(uint256 => bool)    public revoked;

    event DiplomaMinted(address indexed to, uint256 indexed tokenId, string diplomaId, string uri);
    event BatchPublished(uint256 indexed tokenId, bytes32 root, string uri);
    event Revoked(uint256 indexed tokenId);
    event IssuerChanged(address indexed previousIssuer, address indexed newIssuer);

    error NotIssuer();
    error Soulbound();
    error AlreadyRevoked();

    modifier onlyIssuer() {
        if (msg.sender != issuer) revert NotIssuer();
        _;
    }

    constructor(address _owner, address _issuer)
        ERC721("KairosLearn Verified Credential", "KLVC")
        Ownable(_owner)
    {
        issuer = _issuer;
        emit IssuerChanged(address(0), _issuer);
    }

    function setIssuer(address newIssuer) external onlyOwner {
        emit IssuerChanged(issuer, newIssuer);
        issuer = newIssuer;
    }

    function mintDiploma(address to, string calldata diplomaId_, string calldata uri_)
        external
        onlyIssuer
        returns (uint256 tokenId)
    {
        tokenId = nextTokenId++;
        diplomaIdOf[tokenId] = diplomaId_;
        uriOf[tokenId] = uri_;
        _safeMint(to, tokenId);
        emit Locked(tokenId);
        emit DiplomaMinted(to, tokenId, diplomaId_, uri_);
    }

    function publishBatch(bytes32 root, string calldata uri_)
        external
        onlyIssuer
        returns (uint256 tokenId)
    {
        tokenId = nextTokenId++;
        merkleRootOf[tokenId] = root;
        uriOf[tokenId] = uri_;
        _safeMint(issuer, tokenId);
        emit Locked(tokenId);
        emit BatchPublished(tokenId, root, uri_);
    }

    function revoke(uint256 tokenId) external onlyOwner {
        if (revoked[tokenId]) revert AlreadyRevoked();
        revoked[tokenId] = true;
        _burn(tokenId);
        emit Revoked(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return uriOf[tokenId];
    }

    function locked(uint256) external pure returns (bool) {
        return true;
    }

    /// @dev Block all transfers — only mint (from=0) and burn (to=0) allowed.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }
}
```

- [ ] **Step 6: Write `contracts/README.md`**

```markdown
# KairosLearn Smart Contracts

ERC-5192 soulbound credential registry. Deployed once per environment.

## Build
forge build

## Test
forge test -vvv

## Deploy (Base Sepolia)
export BASE_RPC_URL=https://sepolia.base.org
export ISSUER_PRIVATE_KEY=0x...
export OWNER_ADDRESS=0x...
export ISSUER_ADDRESS=0x...
forge script script/Deploy.s.sol --rpc-url $BASE_RPC_URL --broadcast --private-key $ISSUER_PRIVATE_KEY
```

- [ ] **Step 7: Build the contract**

Run:
```bash
cd contracts && forge build && cd ..
```
Expected: `Compiler run successful!` and `out/SBTRegistry.sol/KairosLearnSBTRegistry.json` exists.

- [ ] **Step 8: Commit**

```bash
git add contracts/foundry.toml contracts/.gitignore contracts/src/SBTRegistry.sol contracts/README.md contracts/lib
git commit -m "feat(credentials): SBTRegistry ERC-5192 soulbound contract"
```

Note: `contracts/lib/openzeppelin-contracts` is a git submodule from `forge install`. If your repo policy disallows submodules, replace with `git add contracts/lib/openzeppelin-contracts -f` or vendor the relevant files; otherwise commit the submodule pointer.

---

## Task 4: Foundry tests for SBTRegistry

**Files:**
- Create: `contracts/test/SBTRegistry.t.sol`

- [ ] **Step 1: Write the test file (failing — contract behaviors not yet exercised)**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {KairosLearnSBTRegistry} from "../src/SBTRegistry.sol";

contract SBTRegistryTest is Test {
    KairosLearnSBTRegistry public registry;
    address owner   = address(0xA11CE);
    address issuer  = address(0xB0B);
    address alice   = address(0xCAFE);
    address bob     = address(0xBEEF);

    function setUp() public {
        registry = new KairosLearnSBTRegistry(owner, issuer);
    }

    function test_LockedAlwaysTrue() public view {
        assertTrue(registry.locked(0));
        assertTrue(registry.locked(99999));
    }

    function test_OnlyIssuerCanMintDiploma() public {
        vm.prank(alice);
        vm.expectRevert(KairosLearnSBTRegistry.NotIssuer.selector);
        registry.mintDiploma(alice, "google-swe-mock-mastery", "ipfs://meta");
    }

    function test_IssuerCanMintDiploma() public {
        vm.prank(issuer);
        uint256 tokenId = registry.mintDiploma(alice, "google-swe-mock-mastery", "ipfs://meta");

        assertEq(tokenId, 1);
        assertEq(registry.ownerOf(tokenId), alice);
        assertEq(registry.diplomaIdOf(tokenId), "google-swe-mock-mastery");
        assertEq(registry.tokenURI(tokenId), "ipfs://meta");
    }

    function test_TransferRevertsAsSoulbound() public {
        vm.prank(issuer);
        uint256 tokenId = registry.mintDiploma(alice, "x", "ipfs://x");

        vm.prank(alice);
        vm.expectRevert(KairosLearnSBTRegistry.Soulbound.selector);
        registry.transferFrom(alice, bob, tokenId);
    }

    function test_BatchPublishedToIssuer() public {
        bytes32 root = keccak256("root1");
        vm.prank(issuer);
        uint256 tokenId = registry.publishBatch(root, "ipfs://batch1");

        assertEq(registry.merkleRootOf(tokenId), root);
        assertEq(registry.ownerOf(tokenId), issuer);
        assertEq(registry.tokenURI(tokenId), "ipfs://batch1");
    }

    function test_OwnerCanRevokeAndBurn() public {
        vm.prank(issuer);
        uint256 tokenId = registry.mintDiploma(alice, "x", "ipfs://x");

        vm.prank(owner);
        registry.revoke(tokenId);

        assertTrue(registry.revoked(tokenId));
        vm.expectRevert(); // ERC721NonexistentToken after burn
        registry.ownerOf(tokenId);
    }

    function test_NonOwnerCannotRevoke() public {
        vm.prank(issuer);
        uint256 tokenId = registry.mintDiploma(alice, "x", "ipfs://x");

        vm.prank(alice);
        vm.expectRevert(); // OwnableUnauthorizedAccount
        registry.revoke(tokenId);
    }

    function test_OwnerCanRotateIssuer() public {
        address newIssuer = address(0xFEED);
        vm.prank(owner);
        registry.setIssuer(newIssuer);

        assertEq(registry.issuer(), newIssuer);

        vm.prank(issuer);
        vm.expectRevert(KairosLearnSBTRegistry.NotIssuer.selector);
        registry.mintDiploma(alice, "x", "ipfs://x");

        vm.prank(newIssuer);
        registry.mintDiploma(alice, "x", "ipfs://x");
    }
}
```

- [ ] **Step 2: Run the tests**

Run:
```bash
cd contracts && forge test -vvv && cd ..
```
Expected: 8 passing, 0 failing.

- [ ] **Step 3: Commit**

```bash
git add contracts/test/SBTRegistry.t.sol
git commit -m "test(credentials): foundry tests for SBTRegistry (mint, soulbound, revoke, rotate)"
```

---

## Task 5: Deploy SBTRegistry to Base Sepolia

**Files:**
- Create: `contracts/script/Deploy.s.sol`

- [ ] **Step 1: Write the deploy script**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {KairosLearnSBTRegistry} from "../src/SBTRegistry.sol";

contract Deploy is Script {
    function run() external {
        address owner  = vm.envAddress("OWNER_ADDRESS");
        address issuer = vm.envAddress("ISSUER_ADDRESS");

        vm.startBroadcast();
        KairosLearnSBTRegistry registry = new KairosLearnSBTRegistry(owner, issuer);
        vm.stopBroadcast();

        console.log("SBTRegistry deployed at:", address(registry));
    }
}
```

- [ ] **Step 2: Generate a fresh testnet wallet for the issuer**

Run:
```bash
cast wallet new
```
Expected: prints `Address: 0x...` and `Private key: 0x...`. **Save both into `.env.local`** as `ISSUER_PRIVATE_KEY` and use the address as both `OWNER_ADDRESS` and `ISSUER_ADDRESS` for sub-project 1. **In sub-project 2 we'll split owner into a cold wallet.**

- [ ] **Step 3: Fund the wallet on Base Sepolia**

Visit https://www.alchemy.com/faucets/base-sepolia, paste the address, request ETH. Wait 30 seconds. Verify:
```bash
cast balance <ISSUER_ADDRESS> --rpc-url https://sepolia.base.org
```
Expected: non-zero balance (typically 0.2 ETH).

- [ ] **Step 4: Deploy**

Run:
```bash
cd contracts
export BASE_RPC_URL=https://sepolia.base.org
export ISSUER_PRIVATE_KEY=0x...      # from step 2
export OWNER_ADDRESS=0x...            # same address for sub-project 1
export ISSUER_ADDRESS=0x...
forge script script/Deploy.s.sol \
  --rpc-url $BASE_RPC_URL \
  --broadcast \
  --private-key $ISSUER_PRIVATE_KEY
cd ..
```
Expected: console line `SBTRegistry deployed at: 0x...`. Copy this address.

- [ ] **Step 5: Save the address into `.env.local`**

Edit `.env.local`:
```bash
SBT_REGISTRY_ADDRESS=0x...           # from step 4
ISSUER_PRIVATE_KEY=0x...             # from step 2
BASE_RPC_URL=https://sepolia.base.org
```

- [ ] **Step 6: Commit the deploy script (NOT the env)**

```bash
git add contracts/script/Deploy.s.sol
git commit -m "feat(credentials): deploy script for SBTRegistry on Base Sepolia"
```

Verify `.env.local` is in `.gitignore` (should already be) before this commit.

---

## Task 6: Catalog types + v1 catalog

**Files:**
- Create: `src/data/credentials/types.ts`
- Create: `src/data/credentials/catalog.ts`
- Create: `public/credentials/diplomas/.gitkeep`

- [ ] **Step 1: Write `src/data/credentials/types.ts`**

```typescript
// src/data/credentials/types.ts
// Type definitions for the verifiable credential catalog.
// Spec: 2026-04-11-verifiable-credentials-design.md

export type DiplomaCategory = "coding-course" | "tech-interview";

export interface MockInterviewRow {
  problemSlug: string;
  score: number;
  createdAt: string;
}

export interface CourseCompletionRow {
  courseId: string;
  completedAt: string;
}

export interface DiplomaCriteriaContext {
  userId: string;
  mockInterviews: MockInterviewRow[];
  courseCompletions: CourseCompletionRow[];
}

export interface EligibilityResult {
  eligible: boolean;
  reason: string;             // human-readable, shown in UI on hover
  evidence: Record<string, unknown>;  // frozen at mint time → on-chain metadata
}

export interface DiplomaDefinition {
  id: string;                 // stable kebab-case, lives forever once shipped
  title: string;
  category: DiplomaCategory;
  description: string;
  imageUrl: string;           // /credentials/diplomas/<id>.svg
  rubricSummary: string;
  evaluate: (ctx: DiplomaCriteriaContext) => EligibilityResult;
}
```

- [ ] **Step 2: Write `src/data/credentials/catalog.ts` (v1 — 11 diplomas)**

```typescript
// src/data/credentials/catalog.ts
// V1 hardcoded catalog. Coding courses + tech interviews ONLY.
// Spec: 2026-04-11-verifiable-credentials-design.md §4.5

import type { DiplomaDefinition, DiplomaCriteriaContext, EligibilityResult } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────
function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function mocksMatching(ctx: DiplomaCriteriaContext, slugFragment: string) {
  return ctx.mockInterviews.filter((m) =>
    m.problemSlug.toLowerCase().includes(slugFragment.toLowerCase())
  );
}

function evalCompanyMastery(
  ctx: DiplomaCriteriaContext,
  company: string,
): EligibilityResult {
  const mocks = mocksMatching(ctx, company);
  const a = avg(mocks.map((m) => m.score));
  const eligible = mocks.length >= 10 && a >= 80;
  return {
    eligible,
    reason: eligible
      ? `${mocks.length} ${company} mocks completed, average ${a.toFixed(1)}`
      : `Need 10+ ${company} mocks with average score ≥80 (have ${mocks.length}, avg ${a.toFixed(1)})`,
    evidence: { mockCount: mocks.length, averageScore: a, threshold: 80 },
  };
}

function evalCourse(
  ctx: DiplomaCriteriaContext,
  courseId: string,
  courseTitle: string,
): EligibilityResult {
  const completion = ctx.courseCompletions.find((c) => c.courseId === courseId);
  const eligible = !!completion;
  return {
    eligible,
    reason: eligible
      ? `Completed ${courseTitle} on ${completion!.completedAt.slice(0, 10)}`
      : `Complete the ${courseTitle} course to unlock`,
    evidence: { courseId, completedAt: completion?.completedAt },
  };
}

// ─── Catalog ──────────────────────────────────────────────────────────────
export const CREDENTIAL_CATALOG: DiplomaDefinition[] = [
  {
    id: "coding-interview-foundations",
    title: "Coding Interview Foundations",
    category: "tech-interview",
    description:
      "Mastery of the 16 essential coding interview patterns with consistent mock performance.",
    imageUrl: "/credentials/diplomas/coding-interview-foundations.svg",
    rubricSummary:
      "Complete the 16-patterns course AND pass 5+ mock interviews with average score ≥75.",
    evaluate: (ctx) => {
      const courseDone = ctx.courseCompletions.some((c) => c.courseId === "coding-interview");
      const mocks = ctx.mockInterviews;
      const a = avg(mocks.map((m) => m.score));
      const eligible = courseDone && mocks.length >= 5 && a >= 75;
      return {
        eligible,
        reason: eligible
          ? `Course done, ${mocks.length} mocks, avg ${a.toFixed(1)}`
          : `Need course + 5 mocks ≥75 avg (course=${courseDone}, mocks=${mocks.length}, avg=${a.toFixed(1)})`,
        evidence: { courseDone, mockCount: mocks.length, averageScore: a },
      };
    },
  },
  {
    id: "google-swe-mock-mastery",
    title: "Google SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Google-style mock interviews.",
    imageUrl: "/credentials/diplomas/google-swe-mock-mastery.svg",
    rubricSummary: "10+ Google-persona mock interviews with average score ≥80.",
    evaluate: (ctx) => evalCompanyMastery(ctx, "google"),
  },
  {
    id: "meta-swe-mock-mastery",
    title: "Meta SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Meta-style mock interviews.",
    imageUrl: "/credentials/diplomas/meta-swe-mock-mastery.svg",
    rubricSummary: "10+ Meta-persona mock interviews with average score ≥80.",
    evaluate: (ctx) => evalCompanyMastery(ctx, "meta"),
  },
  {
    id: "amazon-swe-mock-mastery",
    title: "Amazon SWE Mock Interview Mastery",
    category: "tech-interview",
    description: "Repeatedly excelled in Amazon-style mock interviews.",
    imageUrl: "/credentials/diplomas/amazon-swe-mock-mastery.svg",
    rubricSummary: "10+ Amazon-persona mock interviews with average score ≥80.",
    evaluate: (ctx) => evalCompanyMastery(ctx, "amazon"),
  },
  {
    id: "system-design-fundamentals",
    title: "System Design Fundamentals",
    category: "tech-interview",
    description: "Foundational understanding of distributed system design.",
    imageUrl: "/credentials/diplomas/system-design-fundamentals.svg",
    rubricSummary: "Complete System Design course AND pass 3+ system design mocks ≥75.",
    evaluate: (ctx) => {
      const courseDone = ctx.courseCompletions.some((c) => c.courseId === "system-design");
      const sdMocks = mocksMatching(ctx, "system-design");
      const a = avg(sdMocks.map((m) => m.score));
      const eligible = courseDone && sdMocks.length >= 3 && a >= 75;
      return {
        eligible,
        reason: eligible
          ? `Course done, ${sdMocks.length} system design mocks avg ${a.toFixed(1)}`
          : `Need course + 3 system design mocks ≥75 avg`,
        evidence: { courseDone, sdMockCount: sdMocks.length, averageScore: a },
      };
    },
  },
  {
    id: "data-structures-mastery",
    title: "Data Structures Mastery",
    category: "coding-course",
    description: "Completed the comprehensive data structures and algorithms curriculum.",
    imageUrl: "/credentials/diplomas/data-structures-mastery.svg",
    rubricSummary: "Complete the Data Structures & Algorithms course end-to-end.",
    evaluate: (ctx) => evalCourse(ctx, "dsa-fundamentals", "Data Structures & Algorithms"),
  },
  {
    id: "dynamic-programming-mastery",
    title: "Dynamic Programming Mastery",
    category: "tech-interview",
    description: "Strong DP problem-solving across mock interviews.",
    imageUrl: "/credentials/diplomas/dynamic-programming-mastery.svg",
    rubricSummary: "5+ DP-tagged mock interviews with average score ≥75.",
    evaluate: (ctx) => {
      const dp = mocksMatching(ctx, "dynamic-programming");
      const a = avg(dp.map((m) => m.score));
      const eligible = dp.length >= 5 && a >= 75;
      return {
        eligible,
        reason: eligible
          ? `${dp.length} DP mocks, avg ${a.toFixed(1)}`
          : `Need 5+ DP mocks ≥75 avg`,
        evidence: { dpMockCount: dp.length, averageScore: a },
      };
    },
  },
  {
    id: "python-fundamentals",
    title: "Python Fundamentals",
    category: "coding-course",
    description: "Completed the Python fundamentals course.",
    imageUrl: "/credentials/diplomas/python-fundamentals.svg",
    rubricSummary: "Complete the Python course end-to-end.",
    evaluate: (ctx) => evalCourse(ctx, "python-fundamentals", "Python Fundamentals"),
  },
  {
    id: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    category: "coding-course",
    description: "Completed the JavaScript fundamentals course.",
    imageUrl: "/credentials/diplomas/javascript-fundamentals.svg",
    rubricSummary: "Complete the JavaScript course end-to-end.",
    evaluate: (ctx) => evalCourse(ctx, "javascript-fundamentals", "JavaScript Fundamentals"),
  },
  {
    id: "react-developer",
    title: "React Developer",
    category: "coding-course",
    description: "Completed the React development course.",
    imageUrl: "/credentials/diplomas/react-developer.svg",
    rubricSummary: "Complete the React Development course end-to-end.",
    evaluate: (ctx) => evalCourse(ctx, "react-development", "React Development"),
  },
  {
    id: "behavioral-interview-pro",
    title: "Behavioral Interview Pro",
    category: "tech-interview",
    description: "Strong behavioral interview performance across multiple companies.",
    imageUrl: "/credentials/diplomas/behavioral-interview-pro.svg",
    rubricSummary: "8+ behavioral mocks across 3+ company personas, average score ≥80.",
    evaluate: (ctx) => {
      const beh = mocksMatching(ctx, "behavioral");
      const personas = new Set(beh.map((m) => m.problemSlug.split("-")[0]));
      const a = avg(beh.map((m) => m.score));
      const eligible = beh.length >= 8 && personas.size >= 3 && a >= 80;
      return {
        eligible,
        reason: eligible
          ? `${beh.length} behavioral mocks across ${personas.size} personas, avg ${a.toFixed(1)}`
          : `Need 8+ behavioral mocks across 3+ personas, avg ≥80`,
        evidence: { behMockCount: beh.length, personaCount: personas.size, averageScore: a },
      };
    },
  },
];

export function getDiplomaById(id: string): DiplomaDefinition | undefined {
  return CREDENTIAL_CATALOG.find((d) => d.id === id);
}
```

- [ ] **Step 3: Create the placeholder image directory**

Run:
```bash
mkdir -p public/credentials/diplomas
touch public/credentials/diplomas/.gitkeep
```

(Real SVG art is generated in Task 12; .gitkeep ensures the directory exists in git.)

- [ ] **Step 4: Commit**

```bash
git add src/data/credentials/types.ts src/data/credentials/catalog.ts public/credentials/diplomas/.gitkeep
git commit -m "feat(credentials): v1 catalog (11 diplomas, coding/tech-interview only)"
```

---

## Task 7: Eligibility engine — TDD

**Files:**
- Create: `src/lib/credential-eligibility.ts`
- Create: `src/lib/credential-eligibility.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/credential-eligibility.test.ts
import { describe, it, expect } from "vitest";
import { computeEligibility } from "./credential-eligibility";
import type { DiplomaCriteriaContext } from "@/data/credentials/types";

function ctx(partial: Partial<DiplomaCriteriaContext> = {}): DiplomaCriteriaContext {
  return {
    userId: "user-1",
    mockInterviews: [],
    courseCompletions: [],
    ...partial,
  };
}

describe("computeEligibility", () => {
  it("returns all catalog diplomas with eligible=false for an empty user", () => {
    const result = computeEligibility(ctx());
    expect(result.length).toBeGreaterThanOrEqual(11);
    expect(result.every((r) => !r.eligible)).toBe(true);
  });

  it("marks coding-interview-foundations eligible when course done + 5 mocks ≥75 avg", () => {
    const result = computeEligibility(
      ctx({
        courseCompletions: [{ courseId: "coding-interview", completedAt: "2026-04-01T00:00:00Z" }],
        mockInterviews: Array.from({ length: 5 }, (_, i) => ({
          problemSlug: `problem-${i}`,
          score: 80,
          createdAt: "2026-04-05T00:00:00Z",
        })),
      }),
    );
    const found = result.find((r) => r.diplomaId === "coding-interview-foundations");
    expect(found?.eligible).toBe(true);
  });

  it("does NOT mark coding-interview-foundations eligible when avg score < 75", () => {
    const result = computeEligibility(
      ctx({
        courseCompletions: [{ courseId: "coding-interview", completedAt: "2026-04-01T00:00:00Z" }],
        mockInterviews: Array.from({ length: 5 }, (_, i) => ({
          problemSlug: `problem-${i}`,
          score: 60,
          createdAt: "2026-04-05T00:00:00Z",
        })),
      }),
    );
    const found = result.find((r) => r.diplomaId === "coding-interview-foundations");
    expect(found?.eligible).toBe(false);
  });

  it("marks google-swe-mock-mastery eligible with 10 google mocks avg ≥80", () => {
    const result = computeEligibility(
      ctx({
        mockInterviews: Array.from({ length: 10 }, (_, i) => ({
          problemSlug: `google-arrays-${i}`,
          score: 85,
          createdAt: "2026-04-05T00:00:00Z",
        })),
      }),
    );
    const found = result.find((r) => r.diplomaId === "google-swe-mock-mastery");
    expect(found?.eligible).toBe(true);
  });

  it("marks python-fundamentals eligible with course completion", () => {
    const result = computeEligibility(
      ctx({
        courseCompletions: [{ courseId: "python-fundamentals", completedAt: "2026-04-01T00:00:00Z" }],
      }),
    );
    const found = result.find((r) => r.diplomaId === "python-fundamentals");
    expect(found?.eligible).toBe(true);
  });

  it("includes evidence and reason in every result", () => {
    const result = computeEligibility(ctx());
    for (const r of result) {
      expect(typeof r.reason).toBe("string");
      expect(r.reason.length).toBeGreaterThan(0);
      expect(typeof r.evidence).toBe("object");
    }
  });
});
```

- [ ] **Step 2: Run the test, expect FAIL**

Run: `npm run test:unit -- credential-eligibility`
Expected: `Error: Failed to load url ./credential-eligibility` (file doesn't exist yet).

- [ ] **Step 3: Implement `src/lib/credential-eligibility.ts`**

```typescript
// src/lib/credential-eligibility.ts
// Pure server-side eligibility engine over the user's existing data.
// No LLM, no network calls beyond the supabase reads done by the API route.
// Spec: 2026-04-11-verifiable-credentials-design.md §4

import { CREDENTIAL_CATALOG } from "@/data/credentials/catalog";
import type { DiplomaCriteriaContext, EligibilityResult } from "@/data/credentials/types";
import { createAdminSupabase } from "@/lib/supabase-auth";

export interface ComputedEligibility extends EligibilityResult {
  diplomaId: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  rubricSummary: string;
}

/**
 * Pure function — given a context object, returns eligibility for every diploma
 * in the catalog. Used both at /credentials list time AND re-checked at mint time.
 */
export function computeEligibility(ctx: DiplomaCriteriaContext): ComputedEligibility[] {
  return CREDENTIAL_CATALOG.map((d) => {
    const evalResult = d.evaluate(ctx);
    return {
      diplomaId: d.id,
      title: d.title,
      category: d.category,
      description: d.description,
      imageUrl: d.imageUrl,
      rubricSummary: d.rubricSummary,
      ...evalResult,
    };
  });
}

/**
 * Loads the user's data from supabase and runs the engine.
 * Used by the API routes; not used in unit tests.
 */
export async function loadEligibilityForUser(userId: string): Promise<ComputedEligibility[]> {
  const db = createAdminSupabase();

  const [mocksRes, xpRes] = await Promise.all([
    db
      .from("interview_session_results")
      .select("problem_slug, score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500),
    db
      .from("xp_transactions")
      .select("ref_id, action, created_at")
      .eq("user_id", userId)
      .eq("action", "course_complete")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const mockInterviews = (mocksRes.data || []).map(
    (r: { problem_slug: string; score: number; created_at: string }) => ({
      problemSlug: r.problem_slug,
      score: r.score,
      createdAt: r.created_at,
    }),
  );

  const courseCompletions = (xpRes.data || []).map(
    (r: { ref_id: string; created_at: string }) => ({
      courseId: r.ref_id,
      completedAt: r.created_at,
    }),
  );

  return computeEligibility({ userId, mockInterviews, courseCompletions });
}
```

- [ ] **Step 4: Run the test, expect PASS**

Run: `npm run test:unit -- credential-eligibility`
Expected: 6 passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/credential-eligibility.ts src/lib/credential-eligibility.test.ts
git commit -m "feat(credentials): pure eligibility engine + vitest coverage"
```

---

## Task 8: Pinata IPFS wrapper

**Files:**
- Create: `src/lib/credential-ipfs.ts`

- [ ] **Step 1: Write `src/lib/credential-ipfs.ts`**

```typescript
// src/lib/credential-ipfs.ts
// Thin wrapper around Pinata for pinning credential metadata JSON.
// Spec: 2026-04-11-verifiable-credentials-design.md §5.2

const PINATA_JWT = process.env.PINATA_JWT || "";
const PINATA_GATEWAY = process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud";

export interface DiplomaMetadata {
  name: string;
  description: string;
  image: string;                  // absolute URL or ipfs://
  external_url: string;           // verify URL — set in sub-project 2
  attributes: Array<{ trait_type: string; value: string | number }>;
  // KairosLearn-specific fields
  kairoslearn: {
    diplomaId: string;
    userId: string;
    issuedAt: string;
    rubricSummary: string;
    evidence: Record<string, unknown>;
    schemaVersion: 1;
  };
}

export async function pinJSON(metadata: DiplomaMetadata): Promise<{ cid: string; uri: string }> {
  if (!PINATA_JWT) throw new Error("PINATA_JWT not configured");

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `kairoslearn-${metadata.kairoslearn.diplomaId}-${metadata.kairoslearn.userId}`,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pinata pin failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { IpfsHash: string };
  return {
    cid: data.IpfsHash,
    uri: `ipfs://${data.IpfsHash}`,
  };
}

export function ipfsToHttp(uri: string): string {
  if (uri.startsWith("ipfs://")) {
    return `${PINATA_GATEWAY}/ipfs/${uri.slice("ipfs://".length)}`;
  }
  return uri;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep credential-ipfs`
Expected: empty output.

- [ ] **Step 3: Commit**

```bash
git add src/lib/credential-ipfs.ts
git commit -m "feat(credentials): pinata ipfs wrapper for diploma metadata"
```

---

## Task 9: Issuer service (viem + Base Sepolia)

**Files:**
- Create: `src/lib/credential-issuer.ts`

- [ ] **Step 1: Write `src/lib/credential-issuer.ts`**

```typescript
// src/lib/credential-issuer.ts
// Server-side issuer service: signs and broadcasts mintDiploma transactions
// to SBTRegistry on Base Sepolia (sub-project 1) using viem.
//
// Sub-project 2 swaps the chain to Base mainnet and routes via Coinbase Paymaster
// for sponsored gas. For sub-project 1 we pay gas from the issuer wallet directly.
//
// Spec: 2026-04-11-verifiable-credentials-design.md §4.3, §5.2

import { createPublicClient, createWalletClient, http, parseAbi, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

const REGISTRY_ABI = parseAbi([
  "function mintDiploma(address to, string diplomaId, string uri) external returns (uint256)",
  "function publishBatch(bytes32 root, string uri) external returns (uint256)",
  "function nextTokenId() external view returns (uint256)",
  "event DiplomaMinted(address indexed to, uint256 indexed tokenId, string diplomaId, string uri)",
]);

const REGISTRY_ADDRESS = (process.env.SBT_REGISTRY_ADDRESS || "") as Address;
const ISSUER_PK = (process.env.ISSUER_PRIVATE_KEY || "") as `0x${string}`;
const RPC_URL = process.env.BASE_RPC_URL || "https://sepolia.base.org";

function assertConfigured() {
  if (!REGISTRY_ADDRESS) throw new Error("SBT_REGISTRY_ADDRESS not configured");
  if (!ISSUER_PK) throw new Error("ISSUER_PRIVATE_KEY not configured");
}

function clients() {
  assertConfigured();
  const account = privateKeyToAccount(ISSUER_PK);
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  const walletClient = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(RPC_URL),
  });
  return { publicClient, walletClient, account };
}

export interface MintResult {
  tokenId: bigint;
  txHash: `0x${string}`;
}

/**
 * Mint a diploma to the user's wallet. Resolves once the tx is confirmed and
 * the on-chain tokenId is known. Throws on RPC or revert.
 */
export async function mintDiploma(
  to: Address,
  diplomaId: string,
  metadataUri: string,
): Promise<MintResult> {
  const { publicClient, walletClient } = clients();

  const txHash = await walletClient.writeContract({
    address: REGISTRY_ADDRESS,
    abi: REGISTRY_ABI,
    functionName: "mintDiploma",
    args: [to, diplomaId, metadataUri],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

  // Parse the DiplomaMinted event to get tokenId
  const log = receipt.logs.find(
    (l) => l.address.toLowerCase() === REGISTRY_ADDRESS.toLowerCase(),
  );
  if (!log) throw new Error("DiplomaMinted event not found in receipt");

  // tokenId is the second indexed topic (topics[2]); topics[0] is event signature, topics[1] is `to`
  const tokenIdHex = log.topics[2];
  if (!tokenIdHex) throw new Error("tokenId topic missing");
  const tokenId = BigInt(tokenIdHex);

  return { tokenId, txHash };
}

export function explorerTxUrl(txHash: string): string {
  return `https://sepolia.basescan.org/tx/${txHash}`;
}

export function explorerAddressUrl(address: string): string {
  return `https://sepolia.basescan.org/address/${address}`;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit 2>&1 | grep credential-issuer`
Expected: empty output.

- [ ] **Step 3: Commit**

```bash
git add src/lib/credential-issuer.ts
git commit -m "feat(credentials): viem issuer service for SBTRegistry mint on Base Sepolia"
```

---

## Task 10: API routes — wallet, eligible, mint

**Files:**
- Create: `src/app/api/credentials/wallet/route.ts`
- Create: `src/app/api/credentials/eligible/route.ts`
- Create: `src/app/api/credentials/mint/route.ts`

- [ ] **Step 1: Write `src/app/api/credentials/wallet/route.ts`**

```typescript
// POST /api/credentials/wallet
// Called by the client after Privy provisions an embedded wallet, to bind
// (privyDid, walletAddress) to the supabase user.
//
// GET /api/credentials/wallet — returns the user's bound wallet, or null.
//
// Spec: 2026-04-11-verifiable-credentials-design.md §5.1

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("user_wallets")
    .select("wallet_address, privy_did, created_at")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ wallet: data || null });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const privyDid = String(body.privyDid || "").trim();
  const walletAddress = String(body.walletAddress || "").trim();

  if (!privyDid || !walletAddress.startsWith("0x") || walletAddress.length !== 42) {
    return NextResponse.json({ error: "Invalid privyDid or walletAddress" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_wallets")
    .upsert(
      {
        user_id: user.id,
        privy_did: privyDid,
        wallet_address: walletAddress,
      },
      { onConflict: "user_id" },
    );

  if (error) {
    console.error("[credentials/wallet] upsert failed:", error);
    return NextResponse.json({ error: "Failed to save wallet" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, walletAddress });
}
```

- [ ] **Step 2: Write `src/app/api/credentials/eligible/route.ts`**

```typescript
// GET /api/credentials/eligible
// Returns all catalog diplomas with eligibility status for the current user,
// plus the user's already-minted credentials.
//
// Spec: 2026-04-11-verifiable-credentials-design.md §4

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { loadEligibilityForUser } from "@/lib/credential-eligibility";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [eligibility, mintedRes] = await Promise.all([
    loadEligibilityForUser(user.id),
    supabase
      .from("issued_credentials")
      .select("diploma_id, token_id, tx_hash, metadata_uri, minted_at")
      .eq("user_id", user.id)
      .eq("credential_type", "diploma")
      .eq("status", "minted"),
  ]);

  return NextResponse.json({
    eligibility,
    minted: mintedRes.data || [],
  });
}
```

- [ ] **Step 3: Write `src/app/api/credentials/mint/route.ts`**

```typescript
// POST /api/credentials/mint
// Body: { diplomaId: string }
// 1. Verify Pro tier (gate)
// 2. Re-check eligibility server-side
// 3. Verify wallet bound
// 4. Pin metadata to IPFS
// 5. Call SBTRegistry.mintDiploma via viem
// 6. Insert issued_credentials row
//
// Spec: 2026-04-11-verifiable-credentials-design.md §5.2

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { loadEligibilityForUser } from "@/lib/credential-eligibility";
import { getDiplomaById } from "@/data/credentials/catalog";
import { pinJSON, type DiplomaMetadata } from "@/lib/credential-ipfs";
import { mintDiploma, explorerTxUrl } from "@/lib/credential-issuer";
import type { Address } from "viem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const diplomaId = String(body.diplomaId || "").trim();
  if (!diplomaId) return NextResponse.json({ error: "diplomaId required" }, { status: 400 });

  const diploma = getDiplomaById(diplomaId);
  if (!diploma) return NextResponse.json({ error: "Unknown diploma" }, { status: 404 });

  // ── Pro tier gate ──
  // KairosLearn convention: tier lives on user_profiles.subscription_tier
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();
  if (profile?.subscription_tier !== "pro") {
    return NextResponse.json(
      { error: "Verified Credentials are a Pro feature" },
      { status: 402 },
    );
  }

  // ── Wallet check ──
  const { data: walletRow } = await supabase
    .from("user_wallets")
    .select("wallet_address")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!walletRow?.wallet_address) {
    return NextResponse.json({ error: "No wallet bound. Connect Privy first." }, { status: 400 });
  }

  // ── Re-check eligibility (don't trust client) ──
  const eligibility = await loadEligibilityForUser(user.id);
  const found = eligibility.find((e) => e.diplomaId === diplomaId);
  if (!found || !found.eligible) {
    return NextResponse.json(
      { error: "Not eligible", reason: found?.reason || "unknown" },
      { status: 403 },
    );
  }

  // ── Already minted? ──
  const { data: existing } = await supabase
    .from("issued_credentials")
    .select("id")
    .eq("user_id", user.id)
    .eq("diploma_id", diplomaId)
    .eq("status", "minted")
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "Already minted" }, { status: 409 });
  }

  // ── Insert pending row first (audit trail) ──
  const { data: pendingRow, error: insertErr } = await supabase
    .from("issued_credentials")
    .insert({
      user_id: user.id,
      credential_type: "diploma",
      diploma_id: diplomaId,
      evidence_snapshot: found.evidence,
      status: "pending",
    })
    .select("id")
    .single();
  if (insertErr || !pendingRow) {
    console.error("[credentials/mint] pending insert failed:", insertErr);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  try {
    // ── Build metadata ──
    const issuedAt = new Date().toISOString();
    const metadata: DiplomaMetadata = {
      name: diploma.title,
      description: diploma.description,
      image: `${process.env.NEXT_PUBLIC_APP_URL || ""}${diploma.imageUrl}`,
      external_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/verify/pending`,
      attributes: [
        { trait_type: "Category", value: diploma.category },
        { trait_type: "Issuer", value: "KairosLearn" },
        { trait_type: "Issued", value: issuedAt },
      ],
      kairoslearn: {
        diplomaId: diploma.id,
        userId: user.id,
        issuedAt,
        rubricSummary: diploma.rubricSummary,
        evidence: found.evidence,
        schemaVersion: 1,
      },
    };

    // ── Pin to IPFS ──
    const { uri: metadataUri } = await pinJSON(metadata);

    // ── Mint on-chain ──
    const { tokenId, txHash } = await mintDiploma(
      walletRow.wallet_address as Address,
      diploma.id,
      metadataUri,
    );

    // ── Update row to minted ──
    await supabase
      .from("issued_credentials")
      .update({
        status: "minted",
        token_id: tokenId.toString(),
        tx_hash: txHash,
        metadata_uri: metadataUri,
        minted_at: new Date().toISOString(),
      })
      .eq("id", pendingRow.id);

    return NextResponse.json({
      ok: true,
      tokenId: tokenId.toString(),
      txHash,
      txUrl: explorerTxUrl(txHash),
      metadataUri,
    });
  } catch (err) {
    console.error("[credentials/mint] mint failed:", err);
    await supabase
      .from("issued_credentials")
      .update({ status: "failed" })
      .eq("id", pendingRow.id);
    return NextResponse.json(
      { error: "Mint failed", details: String(err) },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 4: Verify all three routes compile**

Run: `npx tsc --noEmit 2>&1 | grep "api/credentials"`
Expected: empty output.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/credentials/wallet/route.ts src/app/api/credentials/eligible/route.ts src/app/api/credentials/mint/route.ts
git commit -m "feat(credentials): API routes (wallet bind, eligible, mint)"
```

---

## Task 11: Privy client provider + integration with app providers

**Files:**
- Create: `src/components/credentials/PrivyClientProvider.tsx`
- Modify: `src/app/providers.tsx`

- [ ] **Step 1: Write `src/components/credentials/PrivyClientProvider.tsx`**

```typescript
// src/components/credentials/PrivyClientProvider.tsx
// Wraps the app in PrivyProvider so embedded wallets are available globally.
// Configured for Base Sepolia in sub-project 1.

"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

export function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    // Don't crash the whole app if credentials feature isn't configured;
    // /credentials page will show a "not configured" state instead.
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#7c3aed",
          logo: "/logo.png",
        },
        loginMethods: ["email", "google"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
```

- [ ] **Step 2: Modify `src/app/providers.tsx`**

Read it first (`Read src/app/providers.tsx`), then wrap the existing provider tree's outermost provider with `<PrivyClientProvider>...</PrivyClientProvider>`. The exact edit depends on the current tree, but it looks like:

```typescript
import { PrivyClientProvider } from "@/components/credentials/PrivyClientProvider";

// ...inside the component return:
return (
  <PrivyClientProvider>
    {/* existing providers stay nested inside, unchanged */}
    <AuthProvider>
      <AIProvider>
        {children}
      </AIProvider>
    </AuthProvider>
  </PrivyClientProvider>
);
```

Privy goes outermost so its hooks are available everywhere. It is a no-op for users who never visit `/credentials`.

- [ ] **Step 3: Build to verify no TS errors**

Run: `npm run build 2>&1 | tail -20`
Expected: build succeeds. If Privy complains about missing peer deps, the package json install step in Task 1 missed something — re-run `npm install @privy-io/react-auth`.

- [ ] **Step 4: Commit**

```bash
git add src/components/credentials/PrivyClientProvider.tsx src/app/providers.tsx
git commit -m "feat(credentials): wrap app with Privy provider for embedded wallets"
```

---

## Task 12: /credentials page UI

**Files:**
- Create: `src/app/credentials/page.tsx`
- Create: `src/components/credentials/CredentialsClient.tsx`
- Create: `src/components/credentials/CredentialCard.tsx`
- Create: `public/credentials/diplomas/coding-interview-foundations.svg` (and 10 more — see step 5)

- [ ] **Step 1: Write the server page `src/app/credentials/page.tsx`**

```typescript
// src/app/credentials/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-auth";
import { CredentialsClient } from "@/components/credentials/CredentialsClient";

export const dynamic = "force-dynamic";

export default async function CredentialsPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/credentials");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  return <CredentialsClient isPro={profile?.subscription_tier === "pro"} />;
}
```

- [ ] **Step 2: Write `src/components/credentials/CredentialCard.tsx`**

```typescript
// src/components/credentials/CredentialCard.tsx
"use client";

import Image from "next/image";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";

interface Props {
  title: string;
  description: string;
  imageUrl: string;
  rubricSummary: string;
  eligible: boolean;
  reason: string;
  alreadyMinted: boolean;
  isPro: boolean;
  onMint: () => void;
  minting: boolean;
}

export function CredentialCard({
  title,
  description,
  imageUrl,
  rubricSummary,
  eligible,
  reason,
  alreadyMinted,
  isPro,
  onMint,
  minting,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={400}
          className={alreadyMinted ? "" : eligible ? "" : "opacity-30 grayscale"}
        />
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
      <p className="mt-2 text-xs text-zinc-500" title={reason}>
        <span className="font-medium text-zinc-400">Rubric:</span> {rubricSummary}
      </p>
      <div className="mt-4">
        {alreadyMinted ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Verified — minted
          </div>
        ) : !isPro ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-500"
          >
            <Lock className="h-4 w-4" /> Pro feature
          </button>
        ) : eligible ? (
          <button
            onClick={onMint}
            disabled={minting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {minting ? "Minting..." : "Mint Verified Credential"}
          </button>
        ) : (
          <div className="rounded-xl bg-white/5 px-3 py-2 text-xs text-zinc-500">{reason}</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/credentials/CredentialsClient.tsx`**

```typescript
// src/components/credentials/CredentialsClient.tsx
"use client";

import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { CredentialCard } from "./CredentialCard";

interface Eligibility {
  diplomaId: string;
  title: string;
  description: string;
  imageUrl: string;
  rubricSummary: string;
  eligible: boolean;
  reason: string;
}

interface Minted {
  diploma_id: string;
  token_id: string;
  tx_hash: string;
}

export function CredentialsClient({ isPro }: { isPro: boolean }) {
  const { ready, authenticated, login, user: privyUser } = usePrivy();
  const { wallets } = useWallets();
  const [eligibility, setEligibility] = useState<Eligibility[]>([]);
  const [minted, setMinted] = useState<Minted[]>([]);
  const [loading, setLoading] = useState(true);
  const [mintingId, setMintingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Bind privy wallet to supabase user once available
  useEffect(() => {
    if (!ready || !authenticated || wallets.length === 0 || !privyUser) return;
    const wallet = wallets[0];
    fetch("/api/credentials/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        privyDid: privyUser.id,
        walletAddress: wallet.address,
      }),
    }).catch(() => {});
  }, [ready, authenticated, wallets, privyUser]);

  // Load eligibility + minted
  useEffect(() => {
    let cancelled = false;
    fetch("/api/credentials/eligible")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setEligibility(data.eligibility || []);
        setMinted(data.minted || []);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const mintedSet = new Set(minted.map((m) => m.diploma_id));

  async function handleMint(diplomaId: string) {
    setMintingId(diplomaId);
    setError(null);
    try {
      const res = await fetch("/api/credentials/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diplomaId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Mint failed");
      } else {
        // Refresh
        const refreshed = await fetch("/api/credentials/eligible").then((r) => r.json());
        setEligibility(refreshed.eligibility || []);
        setMinted(refreshed.minted || []);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setMintingId(null);
    }
  }

  if (!ready) return <div className="p-8 text-zinc-400">Loading...</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Verified Credentials</h1>
        <p className="mt-2 text-zinc-400">
          Tamper-proof diplomas you've earned. Share them anywhere — anyone can verify.
        </p>
      </div>

      {!authenticated && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div>
            <h3 className="font-semibold text-white">Connect to claim credentials</h3>
            <p className="text-sm text-zinc-400">
              We'll create a free wallet for you in 5 seconds — no crypto knowledge needed.
            </p>
          </div>
          <button
            onClick={login}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white"
          >
            Connect
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-zinc-400">Loading credentials...</div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eligibility.map((e) => (
            <CredentialCard
              key={e.diplomaId}
              title={e.title}
              description={e.description}
              imageUrl={e.imageUrl}
              rubricSummary={e.rubricSummary}
              eligible={e.eligible}
              reason={e.reason}
              alreadyMinted={mintedSet.has(e.diplomaId)}
              isPro={isPro && authenticated}
              minting={mintingId === e.diplomaId}
              onMint={() => handleMint(e.diplomaId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Generate placeholder SVG art for all 11 diplomas**

For each diploma id in the catalog, create a minimal SVG at `public/credentials/diplomas/<id>.svg`. Use a single template — the title text differs but the visual stays identical. Generate the file with this template (replace `TITLE` per file):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#c026d3"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="32" fill="url(#g)"/>
  <text x="200" y="180" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#fff">KairosLearn</text>
  <text x="200" y="220" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#fff" opacity="0.8">Verified Credential</text>
  <text x="200" y="270" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#fff">TITLE</text>
</svg>
```

Files to create (one each):
- `coding-interview-foundations.svg`
- `google-swe-mock-mastery.svg`
- `meta-swe-mock-mastery.svg`
- `amazon-swe-mock-mastery.svg`
- `system-design-fundamentals.svg`
- `data-structures-mastery.svg`
- `dynamic-programming-mastery.svg`
- `python-fundamentals.svg`
- `javascript-fundamentals.svg`
- `react-developer.svg`
- `behavioral-interview-pro.svg`

- [ ] **Step 5: Run dev server and visit /credentials**

Run: `npm run dev`
Visit: `http://localhost:3000/credentials`

Expected:
- Logged-in Pro user sees the 11 diploma cards
- Cards the user is NOT eligible for show grayed-out art + the rubric reason
- Cards the user IS eligible for show a "Mint Verified Credential" button
- Clicking "Connect" pops the Privy modal
- After Privy auth, the wallet is bound (check supabase `user_wallets` for a row)

- [ ] **Step 6: Commit**

```bash
git add src/app/credentials/page.tsx src/components/credentials/ public/credentials/diplomas/
git commit -m "feat(credentials): /credentials page with eligibility grid + Privy connect"
```

---

## Task 13: End-to-end testnet smoke test

**Files:** none — this is a manual verification gate.

- [x] **Step 1: Seed eligible data for a test user**

> **Note (2026-04-11 smoke test):** the original SQL below referenced an
> `interview_session_results` table that does not exist. The real schema
> reads from `interview_performance` joined with `interview_sessions`
> (see `src/lib/credential-eligibility.ts`). For the smoke test we took
> the simpler path and seeded a course-completion diploma instead:
>
> ```bash
> # CREDENTIALS_PRO_ALLOWLIST in .env.local must be the user's UUID (not email)
> node --env-file=.env.local scripts/credentials-seed-test-data.mjs
> ```
>
> That inserts a `course_complete` row into `xp_transactions` for
> `python-fundamentals`, making the user eligible for the
> **Python Fundamentals** diploma. This is sufficient to exercise the
> full mint pipeline end-to-end.

Original (stale — kept for reference): pick a Pro test user, in Supabase SQL editor (or via psql):

```sql
-- Replace <TEST_USER_ID> with the real uuid
-- NOTE: `interview_session_results` does not exist; this SQL is historical.
-- Use the seed script above instead, or write equivalent inserts into
-- `interview_sessions` + `interview_performance` if you need mock-interview
-- diplomas like `google-swe-mock-mastery`.
INSERT INTO interview_session_results (user_id, problem_slug, score, created_at)
SELECT '<TEST_USER_ID>', 'google-arrays-' || g, 85, now() - (g || ' days')::interval
FROM generate_series(1, 10) g;
```

- [x] **Step 2: Sign in as the test user, visit /credentials**

Expected: the eligible diploma card shows the Mint button. All others show ineligibility reasons.

- [ ] **Step 3: Click "Connect" → Privy modal → email/Google sign-in**

Expected: modal closes, embedded wallet provisioned, supabase `user_wallets` has a new row for this user.

- [ ] **Step 4: Click "Mint Verified Credential"**

Expected within 10–30 seconds:
- Network tab shows `POST /api/credentials/mint` returning 200 with `tokenId` and `txHash`
- Card flips to "Verified — minted"
- `issued_credentials` row exists with `status='minted'`, populated `token_id`, `tx_hash`, `metadata_uri`

- [ ] **Step 5: Verify on BaseScan**

Run:
```bash
echo "https://sepolia.basescan.org/tx/<TX_HASH>"
```
Open the URL. Expected: a successful tx with a `DiplomaMinted` event log targeting your registry contract.

- [ ] **Step 6: Verify the metadata is on IPFS**

Open `<PINATA_GATEWAY>/ipfs/<CID>` (CID from `metadata_uri`). Expected: the JSON metadata with `name`, `description`, `image`, `kairoslearn.diplomaId`, etc.

- [ ] **Step 7: Negative tests**

- Try minting the same diploma twice → expect 409 "Already minted"
- Try minting an ineligible diploma via curl with valid auth cookie → expect 403 "Not eligible"
- Try minting as a non-Pro user → expect 402 "Pro feature"

- [ ] **Step 8: Document the run in CHANGELOG/notes**

Append to `CLAUDE.md` under a new "Verifiable Credentials" section a short paragraph including the deployed registry address, the issuer wallet address, and the date of first successful mainnet sub-project 1 acceptance. Commit:

```bash
git add CLAUDE.md
git commit -m "docs(credentials): record sub-project 1 testnet acceptance"
```

---

## Self-Review

**Spec coverage:**
- §3 decisions (two-tier, Privy, Base, sponsored gas, ERC-5192, hardcoded catalog, coding/tech only, Pro perk) → all locked into Tasks 1, 3, 6, 10, 11, 12 ✓
- §4.1 components (catalog, eligibility, issuer, registry) → Tasks 3, 6, 7, 9 ✓
- §4.2 data model (migration 028) → Task 2 ✓
- §4.3 contract → Tasks 3, 4 ✓
- §4.5 v1 catalog (11 diplomas) → Task 6 ✓
- §5.1 wallet provisioning flow → Tasks 11, 12 (client) + 10 (server) ✓
- §5.2 minting flow → Task 10 (mint route) + Task 12 (UI button) ✓
- §5.3 batch publishing → **deferred to Sub-project 3** (correct scope)
- §5.4 verification flow → **deferred to Sub-project 2** (correct scope)
- §6 sub-project 1 acceptance criteria → Task 13 ✓
- §7 scope boundaries → respected throughout (no language, no other courses, no token economy)
- §8 risk: hot wallet compromise → Task 5 step 2 (testnet only, separate cold wallet in sub-project 2) ✓
- §8 risk: catalog gameable → Task 10 step 3 re-checks server-side ✓
- §8 risk: gas runaway → testnet sponsored gas in sub-project 1 means no real cost; Pro gate enforced in mint route ✓
- §9 testing strategy → Task 4 (foundry) + Task 7 (vitest) + Task 13 (manual e2e) ✓

**Placeholder scan:** none found. All TBD-style items in the spec's §12 are explicitly Sub-project deliverables, not gaps in this plan.

**Type consistency:** `DiplomaCriteriaContext`, `EligibilityResult`, `ComputedEligibility`, `DiplomaMetadata` all defined once and used consistently. `mintDiploma`/`publishBatch` signatures match between Solidity (`Task 3`), Foundry tests (`Task 4`), viem wrapper (`Task 9`), and API routes (`Task 10`).

**No gaps found.**

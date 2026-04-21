# Verifiable Credentials — Sub-project 2a (Verify Page + Share) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public, no-auth `/verify/<tokenId>` page that renders any minted KairosLearn diploma with full OG tags (for LinkedIn/Twitter/Slack previews), a revocation check, and a "Share to LinkedIn" button on the `/credentials` page. Everything runs on Base Sepolia (the existing testnet deployment). Zero cost.

**Architecture:** Server component reads `issued_credentials` from Supabase, then calls `SBTRegistry.tokenURI()` and `SBTRegistry.revoked()` on-chain via viem public client. IPFS metadata is fetched via public gateway. OG image is generated at request time using `next/og` (ImageResponse). No new API routes needed — the verify page is fully server-rendered.

**Tech Stack:** Same as SP1. No new dependencies. `next/og` is built into Next.js 14.

**Spec reference:** `docs/superpowers/specs/2026-04-11-verifiable-credentials-design.md` §Sub-project 2

**SP1 reference:** `docs/superpowers/plans/2026-04-11-verifiable-credentials-subproject-1.md`

**Acceptance:** Visiting `https://kairoslearn.com/verify/2` (the existing minted token) renders a clean public credential page with diploma title, holder address, mint date, BaseScan link, and IPFS metadata. Sharing the URL on LinkedIn shows a rich preview with the diploma title and generated OG image. A revoked token shows "Revoked" state. The `/credentials` page has a "Share" button for each minted diploma.

**Budget:** $0. Sepolia testnet only. No new env vars. No new npm deps. No DB migrations.

---

## File Structure

**Verify page (new):**
- Create: `src/app/verify/[tokenId]/page.tsx` — server component, public credential viewer
- Create: `src/app/verify/[tokenId]/opengraph-image.tsx` — `next/og` dynamic OG image

**Server library (new):**
- Create: `src/lib/credential-verify.ts` — on-chain read helpers (tokenURI, revoked, ownerOf)

**UI modification:**
- Modify: `src/app/credentials/page.tsx` — add "Share to LinkedIn" button for minted diplomas

**SEO:**
- Modify: `src/app/robots.ts` — add `/credentials` to disallow list (private), `/verify/` stays allowed

---

## Task 1: On-chain read helpers

**Files:**
- Create: `src/lib/credential-verify.ts`

- [ ] **Step 1: Create `credential-verify.ts` with viem public client helpers**

This module provides three read-only functions against the deployed `SBTRegistry` on Base Sepolia. No wallet client needed — these are all `view`/`pure` calls.

```typescript
// src/lib/credential-verify.ts
//
// Read-only helpers for the public verify page.
// No private key needed — all calls are view functions.

import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const SBT_REGISTRY_ADDRESS = (process.env.SBT_REGISTRY_ADDRESS ??
  "0xdAA100EE3CbaAF192183B74Eb5B9A42CbEEabE5D") as `0x${string}`;

const READ_ABI = [
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "revoked",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "diplomaIdOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

function getPublicClient() {
  const rpcUrl = process.env.BASE_RPC_URL ?? "https://sepolia.base.org";
  return createPublicClient({
    chain: baseSepolia,
    transport: http(rpcUrl),
  });
}

export interface OnChainCredential {
  tokenId: string;
  owner: string;
  diplomaId: string;
  tokenURI: string;
  revoked: boolean;
}

/**
 * Reads on-chain state for a given tokenId.
 * Returns null if the token doesn't exist (reverted ownerOf).
 */
export async function readOnChainCredential(
  tokenId: bigint,
): Promise<OnChainCredential | null> {
  const client = getPublicClient();
  const args = { address: SBT_REGISTRY_ADDRESS, abi: READ_ABI } as const;

  try {
    const [owner, diplomaId, uri, isRevoked] = await Promise.all([
      client.readContract({ ...args, functionName: "ownerOf", args: [tokenId] }),
      client.readContract({ ...args, functionName: "diplomaIdOf", args: [tokenId] }),
      client.readContract({ ...args, functionName: "tokenURI", args: [tokenId] }),
      client.readContract({ ...args, functionName: "revoked", args: [tokenId] }),
    ]);
    return {
      tokenId: tokenId.toString(),
      owner: owner as string,
      diplomaId: diplomaId as string,
      tokenURI: uri as string,
      revoked: isRevoked as boolean,
    };
  } catch {
    // ownerOf reverts for non-existent tokens
    return null;
  }
}

export interface IpfsMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string }>;
  properties?: {
    diplomaId?: string;
    userId?: string;
    evidence?: Record<string, unknown>;
  };
}

/**
 * Resolves an ipfs:// URI to JSON metadata via a public gateway.
 */
export async function resolveIpfsMetadata(
  uri: string,
): Promise<IpfsMetadata | null> {
  if (!uri.startsWith("ipfs://")) return null;
  const cid = uri.replace("ipfs://", "");
  const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
  try {
    const resp = await fetch(gatewayUrl, { next: { revalidate: 3600 } });
    if (!resp.ok) return null;
    return (await resp.json()) as IpfsMetadata;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Verify the module compiles**

Run `npx tsc --noEmit` and confirm no errors in the new file. The key thing to check is that the viem `readContract` generics resolve correctly with the `as const` ABI.

---

## Task 2: Public verify page (server component)

**Files:**
- Create: `src/app/verify/[tokenId]/page.tsx`

- [ ] **Step 1: Create the verify page server component**

This is a Next.js server component (no `"use client"` directive). It:

1. Parses `tokenId` from the dynamic route param.
2. Calls `readOnChainCredential(BigInt(tokenId))` to get on-chain state.
3. If the token doesn't exist, renders a "Token not found" page.
4. If revoked, renders a "Revoked" state with a warning banner.
5. Calls `resolveIpfsMetadata(onChain.tokenURI)` to get the pinned metadata.
6. Renders the credential card with:
   - Diploma title (from metadata `name`, falling back to `diplomaId`)
   - Description (from metadata `description`)
   - Diploma image (from metadata `image`, which is an absolute URL to `kairoslearn.ai/credentials/diplomas/...`)
   - Holder address (from `ownerOf`, truncated with full on hover)
   - Category (from metadata `attributes` where `trait_type === "Category"`)
   - Issued date (from metadata `attributes` where `trait_type === "Issued At"`)
   - Network badge: "Base Sepolia Testnet"
   - Link to BaseScan: `https://sepolia.basescan.org/nft/{contractAddress}/{tokenId}`
   - Link to IPFS metadata: gateway URL
7. Exports `generateMetadata()` for SEO — title, description, and canonical URL.

Key design decisions:
- **No auth required.** This is a public page. Anyone with the URL can view the credential.
- **No layout chrome.** Don't wrap in the app's TopNav/sidebar. The verify page should feel like a standalone certificate viewer, not a logged-in dashboard page.
- **Dark theme matching the `/credentials` page** (gradient from `#0a0a14` via `#0f0f1e` to `#1a1033`).
- **Server-rendered for crawlability.** LinkedIn/Twitter bots need HTML meta tags, not client-side JS.
- **Cache with `revalidate: 60`.** On-chain state rarely changes; IPFS metadata is immutable.

```typescript
// Skeleton for page.tsx — implement fully
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { readOnChainCredential, resolveIpfsMetadata } from "@/lib/credential-verify";

// ...
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Read on-chain + IPFS, return title/description/openGraph
}

export default async function VerifyPage({ params }: Props) {
  // Full render
}
```

- [ ] **Step 2: Test locally**

Start the dev server (`npm run dev`) and visit `http://localhost:3000/verify/2`. Confirm:
- The page renders the "Python Fundamentals" diploma.
- The holder address shows `0x6c1495c268B83CD78c02184f0197Ad187B176304`.
- The BaseScan link opens the correct NFT page.
- The IPFS link resolves to the pinned metadata JSON.
- The "Base Sepolia Testnet" network badge is visible.

Visit `http://localhost:3000/verify/999999` — should show "Token not found."

---

## Task 3: OG image generation

**Files:**
- Create: `src/app/verify/[tokenId]/opengraph-image.tsx`

- [ ] **Step 1: Create the OG image route using `next/og`**

Next.js App Router supports `opengraph-image.tsx` as a special file that generates OG images at request time using `ImageResponse` from `next/og`.

The OG image should be **1200x630** (standard OG dimensions) and contain:
- "KairosLearn Verified Credential" header text
- Diploma title (e.g., "Python Fundamentals")
- Holder address (truncated: `0x6c14...6304`)
- "Base Sepolia Testnet" network label
- Token ID
- Dark purple gradient background matching the site theme

```typescript
// src/app/verify/[tokenId]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { readOnChainCredential, resolveIpfsMetadata } from "@/lib/credential-verify";

export const runtime = "edge";
export const alt = "KairosLearn Verified Credential";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ tokenId: string }> }) {
  const { tokenId } = await params;
  const id = BigInt(tokenId);
  const onChain = await readOnChainCredential(id);

  if (!onChain) {
    // Fallback: generic "credential not found" image
    return new ImageResponse(
      (
        <div style={{ /* ... */ display: "flex", width: "100%", height: "100%", background: "#0a0a14", color: "white", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
          Credential Not Found
        </div>
      ),
      { ...size },
    );
  }

  const metadata = await resolveIpfsMetadata(onChain.tokenURI);
  const title = metadata?.name?.replace("KairosLearn Diploma — ", "") ?? onChain.diplomaId;
  const holder = `${onChain.owner.slice(0, 6)}...${onChain.owner.slice(-4)}`;

  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #0a0a14, #1a1033)",
        padding: 60,
        color: "white",
        fontFamily: "sans-serif",
      }}>
        {/* Header */}
        <div style={{ fontSize: 24, color: "#a78bfa", marginBottom: 20, display: "flex" }}>
          KairosLearn Verified Credential
        </div>
        {/* Title */}
        <div style={{ fontSize: 56, fontWeight: 700, marginBottom: 30, display: "flex" }}>
          {title}
        </div>
        {/* Details */}
        <div style={{ fontSize: 24, color: "#c4b5fd", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex" }}>Holder: {holder}</div>
          <div style={{ display: "flex" }}>Token #{tokenId} on Base Sepolia</div>
        </div>
        {/* Footer */}
        <div style={{ marginTop: "auto", fontSize: 20, color: "#7c3aed", display: "flex" }}>
          kairoslearn.com/verify/{tokenId}
        </div>
      </div>
    ),
    { ...size },
  );
}
```

**Important `next/og` constraints:**
- Only flexbox layout (no grid, no `position: absolute`).
- Every `<div>` needs `display: "flex"` explicitly.
- No `className` — inline `style` objects only.
- Fonts can be loaded from Google Fonts or local files if needed, but the system sans-serif is fine for v1.

- [ ] **Step 2: Test the OG image**

Visit `http://localhost:3000/verify/2/opengraph-image` in the browser. It should return a PNG image with the Python Fundamentals diploma info rendered on a dark gradient.

Visit `http://localhost:3000/verify/999999/opengraph-image` — should show the "Credential Not Found" fallback.

---

## Task 4: LinkedIn share button on `/credentials` page

**Files:**
- Modify: `src/app/credentials/page.tsx`

- [ ] **Step 1: Add a "Share" button for minted diplomas**

In the diploma card's `mt-auto` footer section, add a share button alongside the existing "View on BaseScan" link. When clicked, it opens a new tab with the LinkedIn share URL.

LinkedIn's share URL format:
```
https://www.linkedin.com/sharing/share-offsite/?url=ENCODED_URL
```

Where the URL is `https://kairoslearn.com/verify/{tokenId}`.

The button should only appear when `d.alreadyMinted && d.tokenId`:

```tsx
{d.alreadyMinted && d.tokenId && (
  <a
    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://kairoslearn.com/verify/${d.tokenId}`)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-2 block rounded-lg bg-[#0077B5]/20 px-4 py-2 text-center text-sm font-medium text-[#0077B5] transition hover:bg-[#0077B5]/30"
  >
    Share on LinkedIn
  </a>
)}
```

This goes right after the existing "View on BaseScan" `<a>` tag, inside the same `d.alreadyMinted && d.txHash` conditional block. Restructure the conditional slightly so both buttons render when both `txHash` and `tokenId` are present.

- [ ] **Step 2: Test the share button**

On `http://localhost:3000/credentials`, the "Python Fundamentals" diploma card should show both "View on BaseScan" and "Share on LinkedIn" buttons. Clicking "Share on LinkedIn" should open LinkedIn's share dialog with the verify URL pre-filled.

---

## Task 5: SEO — robots + credentials noindex

**Files:**
- Modify: `src/app/robots.ts`

- [ ] **Step 1: Add `/credentials` to the robots disallow list**

The `/credentials` page is a private dashboard (requires auth + Pro). It should not be indexed by search engines. The `/verify/` pages *should* be indexed — that's the whole point.

```typescript
disallow: ['/api/', '/admin/', '/settings/', '/credentials'],
```

Note: `/verify/` is NOT in the disallow list, which means it's allowed by the existing `allow: '/'` rule. This is correct.

- [ ] **Step 2: Verify**

Check `http://localhost:3000/robots.txt` includes `/credentials` in the disallow list and does NOT include `/verify/`.

---

## Task 6: End-to-end verification

- [ ] **Step 1: Start dev server and run through the full flow**

1. Visit `http://localhost:3000/verify/2` — should render the Python Fundamentals diploma with all details.
2. View source / `curl http://localhost:3000/verify/2` — confirm the `<meta property="og:title">` and `<meta property="og:image">` tags are present in the HTML (not client-rendered).
3. Visit `http://localhost:3000/verify/2/opengraph-image` — should return a PNG.
4. Visit `http://localhost:3000/verify/999999` — should show "Token not found."
5. Sign in, visit `/credentials`, confirm the "Share on LinkedIn" button appears on the minted Python Fundamentals card.
6. Click "Share on LinkedIn" — confirm it opens LinkedIn's share dialog with the correct URL.
7. Visit `http://localhost:3000/robots.txt` — confirm `/credentials` is disallowed.

- [ ] **Step 2: Test with LinkedIn's Post Inspector (optional)**

If the Vercel deployment is accessible, use LinkedIn's [Post Inspector](https://www.linkedin.com/post-inspector/) to validate the OG tags render correctly. Enter the deployed verify URL and confirm the preview shows the generated OG image.

- [ ] **Step 3: Update CLAUDE.md**

Add a brief note under the existing "Verifiable Credentials" section:

```
- **SP2a shipped (2026-04-12):** Public `/verify/<tokenId>` page with OG image generation,
  LinkedIn share button, revocation check. Sepolia testnet only.
- **Deferred to SP2b:** Base mainnet deploy, cold wallet rotation.
```

---

## Decision Log

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Stay on Sepolia (no mainnet) | User has $0 ETH budget. Base mainnet deferred to SP2b when revenue or recruiter demand exists. |
| 2 | No new DB migration | `issued_credentials` already has `token_id`, `tx_hash`, `metadata_uri` — everything the verify page needs. |
| 3 | No new env vars | Public RPC (`https://sepolia.base.org`) and existing `SBT_REGISTRY_ADDRESS` suffice. `PINATA_JWT` not needed (read-only via public gateway). |
| 4 | `next/og` for OG images (not static SVGs) | Dynamic per-token, no build step, zero dependencies. |
| 5 | Server component (not client) | LinkedIn/Twitter bots don't execute JS. OG tags must be in initial HTML. |
| 6 | No layout chrome on verify page | The verify page is a standalone certificate, not a dashboard. No TopNav/sidebar. |
| 7 | `revalidate: 60` | On-chain state rarely changes; IPFS is immutable. 60s ISR cache is generous but catches revocations within a minute. |
| 8 | Single hot wallet model retained | User explicitly rejected cold wallet separation and second-hot-wallet approach. Appropriate for solo pre-revenue project. |

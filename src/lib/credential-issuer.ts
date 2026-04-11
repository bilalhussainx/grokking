// src/lib/credential-issuer.ts
// Verifiable Credentials SP1 — Task 9
// viem-based issuer service that mints diploma SBTs on Base Sepolia.

import {
  createPublicClient,
  createWalletClient,
  decodeEventLog,
  http,
  type Hash,
  type Log,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

import { getDiplomaById } from "@/data/credentials/catalog";
import { pinDiplomaMetadata } from "@/lib/credential-ipfs";
import { loadEligibilityForUser } from "@/lib/credential-eligibility";
import { createAdminSupabase } from "@/lib/supabase-auth";

export const SBT_REGISTRY_ABI = [
  {
    type: "function",
    name: "mintDiploma",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "diplomaId", type: "string" },
      { name: "metadataURI", type: "string" },
    ],
    outputs: [{ name: "tokenId", type: "uint256" }],
  },
  {
    type: "event",
    name: "DiplomaMinted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "diplomaId", type: "string", indexed: false },
      { name: "uri", type: "string", indexed: false },
    ],
  },
] as const;

export const SBT_REGISTRY_ADDRESS = (process.env.SBT_REGISTRY_ADDRESS ??
  "0xdAA100EE3CbaAF192183B74Eb5B9A42CbEEabE5D") as `0x${string}`;

export interface IssueDiplomaParams {
  userId: string;
  diplomaId: string;
  recipientAddress: `0x${string}`;
}

export interface IssueDiplomaResult {
  tokenId: string;
  txHash: `0x${string}`;
  metadataUri: string;
  gatewayUrl: string;
  diplomaId: string;
}

const HEX64 = /^0x[0-9a-fA-F]{64}$/;

function validateEnv(): `0x${string}` {
  const key = process.env.ISSUER_PRIVATE_KEY;
  if (!key || key.trim() === "") {
    throw new Error(
      "ISSUER_PRIVATE_KEY env var is required to issue credentials",
    );
  }
  if (!HEX64.test(key)) {
    throw new Error(
      "ISSUER_PRIVATE_KEY must be a 0x-prefixed 64-character hex string",
    );
  }
  return key as `0x${string}`;
}

export async function issueDiploma(
  params: IssueDiplomaParams,
): Promise<IssueDiplomaResult> {
  // 0. Env validation FIRST (before any I/O).
  const issuerKey = validateEnv();

  const { userId, diplomaId, recipientAddress } = params;

  // 1. Validate eligibility.
  const eligibilityList = await loadEligibilityForUser(userId);
  const eligibility = eligibilityList.find((e) => e.diplomaId === diplomaId);
  if (!eligibility) {
    throw new Error(`Not eligible: diploma "${diplomaId}" not in catalog`);
  }
  if (!eligibility.eligible) {
    throw new Error(`Not eligible: ${eligibility.reason}`);
  }

  // 3. Lookup diploma def.
  const diploma = getDiplomaById(diplomaId);
  if (!diploma) {
    throw new Error(`Unknown diplomaId: ${diplomaId}`);
  }

  // 2. Duplicate guard.
  const supabase = createAdminSupabase();
  const { data: existing, error: dupErr } = await supabase
    .from("issued_credentials")
    .select("id")
    .eq("user_id", userId)
    .eq("diploma_id", diplomaId)
    .eq("credential_type", "diploma")
    .eq("status", "minted")
    .limit(1);
  if (dupErr) {
    throw new Error(`Supabase duplicate check failed: ${dupErr.message}`);
  }
  if (existing && existing.length > 0) {
    throw new Error("Already minted");
  }

  // 4. Insert pending row.
  const { data: pendingRow, error: insertErr } = await supabase
    .from("issued_credentials")
    .insert({
      user_id: userId,
      credential_type: "diploma",
      diploma_id: diplomaId,
      evidence_snapshot: eligibility.evidence,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertErr || !pendingRow) {
    throw new Error(
      `Failed to insert pending credential row: ${insertErr?.message ?? "no row returned"}`,
    );
  }
  const pendingId = pendingRow.id as string;

  try {
    // 5. Build metadata.
    const metadata = {
      name: `KairosLearn Diploma — ${diploma.title}`,
      description: diploma.description,
      image: `https://kairoslearn.ai${diploma.imagePath}`,
      external_url: `https://kairoslearn.ai/credentials/${diplomaId}`,
      attributes: [
        { trait_type: "Category", value: diploma.category },
        { trait_type: "Issuer", value: "KairosLearn" },
        { trait_type: "Issued At", value: new Date().toISOString() },
      ],
      properties: {
        diplomaId,
        userId,
        evidence: eligibility.evidence,
      },
    };

    // 6. Pin to IPFS.
    const pinResult = await pinDiplomaMetadata(
      metadata,
      `${diplomaId}-${userId}.json`,
    );

    // 7. Mint on-chain.
    const account = privateKeyToAccount(issuerKey);
    const rpcUrl = process.env.BASE_RPC_URL ?? "https://sepolia.base.org";

    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(rpcUrl),
    });
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    const hash: Hash = await walletClient.writeContract({
      address: SBT_REGISTRY_ADDRESS,
      abi: SBT_REGISTRY_ABI,
      functionName: "mintDiploma",
      args: [recipientAddress, diplomaId, pinResult.uri],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status !== "success") {
      throw new Error(`Mint transaction reverted: ${hash}`);
    }

    // Parse DiplomaMinted event for tokenId.
    let tokenId: bigint | undefined;
    for (const log of receipt.logs as Log[]) {
      try {
        const decoded = decodeEventLog({
          abi: SBT_REGISTRY_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (decoded.eventName === "DiplomaMinted") {
          tokenId = (decoded.args as { tokenId: bigint }).tokenId;
          break;
        }
      } catch {
        // Not our event; skip.
      }
    }

    if (tokenId === undefined) {
      throw new Error(
        `DiplomaMinted event not found in receipt for tx ${hash}`,
      );
    }

    const tokenIdStr = tokenId.toString();

    // 8. Update row to minted.
    const { error: updateErr } = await supabase
      .from("issued_credentials")
      .update({
        status: "minted",
        token_id: tokenIdStr,
        tx_hash: hash,
        metadata_uri: pinResult.uri,
        minted_at: new Date().toISOString(),
      })
      .eq("id", pendingId);

    if (updateErr) {
      throw new Error(
        `Mint succeeded (tx ${hash}) but DB update failed: ${updateErr.message}`,
      );
    }

    return {
      tokenId: tokenIdStr,
      txHash: hash,
      metadataUri: pinResult.uri,
      gatewayUrl: pinResult.gatewayUrl,
      diplomaId,
    };
  } catch (err) {
    // 9. Best-effort failure mark.
    try {
      await supabase
        .from("issued_credentials")
        .update({ status: "failed" })
        .eq("id", pendingId);
    } catch {
      // Swallow; don't mask the original error.
    }
    throw err;
  }
}

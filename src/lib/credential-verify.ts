// src/lib/credential-verify.ts
// SP2a — Read-only on-chain helpers for the public /verify page.
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

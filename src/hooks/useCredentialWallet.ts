"use client";

import { useEffect, useRef, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

export interface CredentialWalletState {
  /** Privy SDK ready */
  ready: boolean;
  authenticated: boolean;
  privyDid: string | null;
  walletAddress: `0x${string}` | null;
  linkedToSupabase: boolean;
  linking: boolean;
  linkError: string | null;
  login: () => void;
  logout: () => Promise<void>;
}

/**
 * Hook for the /credentials page.
 *
 * Exposes Privy state and automatically links the embedded wallet to the
 * Supabase user via POST /api/credentials/wallet once both the wallet and
 * Privy DID are available. The POST relies on Supabase cookie auth — if the
 * user isn't signed into Supabase it will 401 and `linkError` will surface.
 */
export function useCredentialWallet(): CredentialWalletState {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const [linkedToSupabase, setLinkedToSupabase] = useState(false);
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const linkAttemptKey = useRef<string | null>(null);

  // Privy creates an embedded wallet on login for users without a wallet.
  const embedded = wallets.find((w) => w.walletClientType === "privy");
  const walletAddress = (embedded?.address ?? null) as `0x${string}` | null;
  const privyDid = user?.id ?? null;

  useEffect(() => {
    if (!ready || !authenticated || !walletAddress || !privyDid) return;
    if (linkedToSupabase) return;

    // Dedupe across React 18 Strict Mode's double-invoke by keying on the
    // (privyDid, walletAddress) pair. The POST is an idempotent upsert anyway.
    const key = `${privyDid}:${walletAddress}`;
    if (linkAttemptKey.current === key) return;
    linkAttemptKey.current = key;

    setLinking(true);
    setLinkError(null);

    (async () => {
      try {
        const resp = await fetch("/api/credentials/wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ privyDid, walletAddress }),
        });
        if (!resp.ok) {
          const body = await resp.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${resp.status}`);
        }
        setLinkedToSupabase(true);
      } catch (err) {
        setLinkError(err instanceof Error ? err.message : String(err));
        linkAttemptKey.current = null;
      } finally {
        setLinking(false);
      }
    })();
  }, [ready, authenticated, walletAddress, privyDid, linkedToSupabase]);

  return {
    ready,
    authenticated,
    privyDid,
    walletAddress,
    linkedToSupabase,
    linking,
    linkError,
    login,
    logout,
  };
}

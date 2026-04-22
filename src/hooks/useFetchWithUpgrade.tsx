"use client";

// Wraps fetch + a single UpgradeModal at the top of the React tree. Any API
// response with HTTP 402 + the canonical { upgradeTo, capability } body opens
// the modal; successful responses pass through untouched.
//
// Usage:
//   const { fetchWithUpgrade } = useUpgradeGate();
//   const res = await fetchWithUpgrade("/api/cc/school-list/add", { ... });
//
// Components higher in the tree render <UpgradeGateProvider> once (in
// providers.tsx) so the modal state is shared.

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import UpgradeModal, { type UpgradeRequest } from "@/components/upgrade/UpgradeModal";
import type { Capability } from "@/lib/cc/tier-gate";

type UpgradeGateCtx = {
  openUpgrade: (req: UpgradeRequest) => void;
  fetchWithUpgrade: typeof fetch;
};

const Ctx = createContext<UpgradeGateCtx | null>(null);

interface ServerBlockedPayload {
  error?: string;
  upgradeTo?: "free" | "pro";
  capability?: Capability;
  tier?: "guest" | "free" | "pro";
  limit?: number | null;
}

async function parseJsonSilent(res: Response): Promise<ServerBlockedPayload | null> {
  try {
    const clone = res.clone();
    return (await clone.json()) as ServerBlockedPayload;
  } catch {
    return null;
  }
}

export function UpgradeGateProvider({ children }: { children: ReactNode }) {
  const [req, setReq] = useState<UpgradeRequest | null>(null);

  const openUpgrade = useCallback((r: UpgradeRequest) => setReq(r), []);
  const close = useCallback(() => setReq(null), []);

  const goSignup = useCallback(() => {
    // Guest → free: route to the signup modal hosted on any page that mounts
    // <AuthContext>. For the landing page we dispatch a CustomEvent so
    // HeroCoachChat can intercept and open its inline signup — bypassing a
    // full page redirect would otherwise stomp on the anon session's chat state.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kairos:signup-prompt"));
    }
    setReq(null);
  }, []);

  const goCheckout = useCallback(() => {
    // Paddle checkout — same route the /pricing page hits.
    if (typeof window !== "undefined") {
      window.location.href = "/pricing?upgrade=pro";
    }
  }, []);

  const fetchWithUpgrade = useCallback<typeof fetch>(
    async (input, init) => {
      const res = await fetch(input, init);
      if (res.status === 402) {
        const body = await parseJsonSilent(res);
        if (body?.capability && body.upgradeTo) {
          openUpgrade({
            capability: body.capability,
            upgradeTo: body.upgradeTo,
            tier: body.tier ?? "free",
            reason: body.error,
            limit: body.limit,
          });
        }
      }
      return res;
    },
    [openUpgrade]
  );

  return (
    <Ctx.Provider value={{ openUpgrade, fetchWithUpgrade }}>
      {children}
      <UpgradeModal request={req} onClose={close} onSignup={goSignup} onCheckout={goCheckout} />
    </Ctx.Provider>
  );
}

export function useUpgradeGate(): UpgradeGateCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Graceful fallback — if a caller uses the hook outside the provider,
    // don't crash; just do a plain fetch. Useful during server rendering
    // and in tests that don't set up the provider.
    return {
      openUpgrade: () => {},
      fetchWithUpgrade: ((input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, init)) as typeof fetch,
    };
  }
  return ctx;
}

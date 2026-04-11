"use client";

import { PrivyProvider as PrivyReactProvider } from "@privy-io/react-auth";
import { baseSepolia } from "viem/chains";
import type { ReactNode } from "react";

/**
 * Privy embedded-wallet provider.
 *
 * Gracefully no-ops when NEXT_PUBLIC_PRIVY_APP_ID is not set so the rest of
 * the platform keeps working even if credentials aren't configured.
 */
export function PrivyProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[PrivyProvider] NEXT_PUBLIC_PRIVY_APP_ID not set — credentials UI will be disabled",
      );
    }
    return <>{children}</>;
  }

  return (
    <PrivyReactProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#8b5cf6",
          logo: "/logo.svg",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        loginMethods: ["email", "google"],
      }}
    >
      {children}
    </PrivyReactProvider>
  );
}

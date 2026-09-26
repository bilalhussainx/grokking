import { PrivyProvider } from "@/components/providers/PrivyProvider";

// Wallets are only used for verifiable credentials; don't ship the wallet SDK
// (and the Coinbase base-account SDK it pulls in) to every page.
export default function CredentialsLayout({ children }: { children: React.ReactNode }) {
  return <PrivyProvider>{children}</PrivyProvider>;
}

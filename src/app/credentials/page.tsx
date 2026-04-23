"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { useCredentialWallet } from "@/hooks/useCredentialWallet";

interface Diploma {
  diplomaId: string;
  title: string;
  description: string;
  category: "coding-course" | "tech-interview";
  imagePath: string;
  eligible: boolean;
  reason: string;
  evidence: Record<string, unknown>;
  alreadyMinted: boolean;
  tokenId?: string;
  txHash?: string;
}

export default function CredentialsPage() {
  if (process.env.NEXT_PUBLIC_CREDENTIALS_ENABLED !== "true") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/50">This feature is not currently available.</p>
      </div>
    );
  }

  return <CredentialsPageInner />;
}

function CredentialsPageInner() {
  const wallet = useCredentialWallet();
  const [diplomas, setDiplomas] = useState<Diploma[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState<string | null>(null);

  const refreshEligibility = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/credentials/eligible");
      if (resp.status === 401) {
        setDiplomas(null);
        setError("Please sign in to view your credentials.");
        return;
      }
      if (resp.status === 403) {
        setDiplomas(null);
        setError("Verifiable diplomas are a Pro feature. Upgrade to unlock.");
        return;
      }
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = (await resp.json()) as { diplomas?: Diploma[] };
      setDiplomas(data.diplomas ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshEligibility();
  }, [refreshEligibility]);

  const mint = async (diplomaId: string) => {
    setMinting(diplomaId);
    try {
      const resp = await fetch("/api/credentials/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diplomaId }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error ?? `HTTP ${resp.status}`);
      await refreshEligibility();
    } catch (e) {
      alert(`Mint failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setMinting(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0f0f1e] to-[#1a1033] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Verifiable Credentials
          </h1>
          <p className="mt-3 max-w-2xl text-purple-200/80">
            Earn on-chain diplomas for your coding and interview achievements.
            Each diploma is a soulbound NFT on Base Sepolia testnet, tied to
            your wallet and publicly verifiable.
          </p>
        </header>

        {/* Wallet status panel */}
        <section className="mb-10 rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-3 text-xl font-semibold text-white">Wallet</h2>
          {!wallet.ready && (
            <p className="text-sm text-purple-200/60">Initializing wallet…</p>
          )}
          {wallet.ready && !wallet.authenticated && (
            <button
              type="button"
              onClick={() => wallet.login()}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500"
            >
              Connect wallet
            </button>
          )}
          {wallet.ready && wallet.authenticated && (
            <div className="space-y-2 text-sm">
              {wallet.walletAddress ? (
                <p className="text-purple-200/70">
                  Address:{" "}
                  <code className="rounded bg-black/30 px-2 py-0.5 text-purple-100">
                    {wallet.walletAddress}
                  </code>
                </p>
              ) : (
                <p className="text-purple-200/60">
                  Connected (no wallet address yet).
                </p>
              )}
              {wallet.linking && (
                <p className="text-purple-200/60">
                  Linking wallet to your account…
                </p>
              )}
              {wallet.linkError && (
                <p className="text-rose-400">
                  Link error: {wallet.linkError}
                </p>
              )}
              {wallet.linkedToSupabase && (
                <p className="text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Wallet linked</p>
              )}
              <button
                type="button"
                onClick={() => wallet.logout()}
                className="mt-2 rounded-lg border border-purple-500/30 px-3 py-1 text-xs text-purple-200/70 hover:border-purple-400/50 hover:text-white"
              >
                Disconnect
              </button>
            </div>
          )}
        </section>

        {/* Diploma grid */}
        {loading && (
          <p className="text-purple-200/60">Loading diplomas…</p>
        )}
        {error && (
          <p className="rounded-xl bg-rose-500/10 p-4 text-rose-300">
            {error}
          </p>
        )}
        {diplomas && diplomas.length === 0 && !error && (
          <p className="text-purple-200/60">No diplomas available.</p>
        )}
        {diplomas && diplomas.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {diplomas.map((d) => {
              const canMint =
                d.eligible &&
                wallet.authenticated &&
                wallet.linkedToSupabase &&
                minting !== d.diplomaId;
              return (
                <div
                  key={d.diplomaId}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-purple-500/20 bg-white/5 p-6 backdrop-blur transition hover:border-purple-400/40"
                >
                  <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-black/40">
                    <Image
                      src={d.imagePath}
                      alt={d.title}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                    {d.alreadyMinted && (
                      <div className="absolute right-2 top-2 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow">
                        Minted
                      </div>
                    )}
                    {!d.alreadyMinted && d.eligible && (
                      <div className="absolute right-2 top-2 rounded-full bg-purple-500/90 px-3 py-1 text-xs font-semibold text-white shadow">
                        Eligible
                      </div>
                    )}
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-white">
                    {d.title}
                  </h3>
                  <p className="mb-3 text-sm text-purple-200/70">
                    {d.description}
                  </p>
                  <p
                    className={`mb-4 text-xs flex items-start gap-1 ${
                      d.eligible ? "text-emerald-400" : "text-purple-200/50"
                    }`}
                  >
                    {d.eligible
                      ? <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      : <X className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                    {d.reason}
                  </p>
                  <div className="mt-auto">
                    {d.alreadyMinted && d.txHash ? (
                      <div className="space-y-2">
                        <a
                          href={`https://sepolia.basescan.org/tx/${d.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg bg-emerald-600/20 px-4 py-2 text-center text-sm font-medium text-emerald-300 transition hover:bg-emerald-600/30"
                        >
                          View on BaseScan &rarr;
                        </a>
                        {d.tokenId && (
                          <>
                            <a
                              href={`/verify/${d.tokenId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg bg-purple-600/20 px-4 py-2 text-center text-sm font-medium text-purple-300 transition hover:bg-purple-600/30"
                            >
                              View credential page &rarr;
                            </a>
                            <a
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://kairoslearn.com/verify/${d.tokenId}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg bg-[#0077B5]/20 px-4 py-2 text-center text-sm font-medium text-[#0077B5] transition hover:bg-[#0077B5]/30"
                            >
                              Share on LinkedIn
                            </a>
                          </>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!canMint}
                        onClick={() => mint(d.diplomaId)}
                        className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-purple-900/40 disabled:text-purple-300/40"
                      >
                        {minting === d.diplomaId
                          ? "Minting…"
                          : !wallet.authenticated
                            ? "Connect wallet to mint"
                            : !wallet.linkedToSupabase
                              ? "Waiting for wallet link…"
                              : !d.eligible
                                ? "Not yet eligible"
                                : "Mint diploma"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

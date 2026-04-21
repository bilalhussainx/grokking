import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  readOnChainCredential,
  resolveIpfsMetadata,
} from "@/lib/credential-verify";

export const revalidate = 60;

const SBT_REGISTRY_ADDRESS =
  process.env.SBT_REGISTRY_ADDRESS ??
  "0xdAA100EE3CbaAF192183B74Eb5B9A42CbEEabE5D";

type Props = { params: Promise<{ tokenId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tokenId } = await params;
  const id = BigInt(tokenId);
  const onChain = await readOnChainCredential(id);
  if (!onChain) {
    return { title: "Credential Not Found" };
  }
  const metadata = await resolveIpfsMetadata(onChain.tokenURI);
  const title =
    metadata?.name?.replace("KairosLearn Diploma — ", "") ??
    onChain.diplomaId;

  return {
    title: `${title} — Verified Credential`,
    description:
      metadata?.description ??
      `On-chain verified credential #${tokenId} issued by KairosLearn.`,
    openGraph: {
      title: `${title} — KairosLearn Verified Credential`,
      description:
        metadata?.description ??
        `On-chain verified credential #${tokenId} issued by KairosLearn.`,
      url: `https://kairoslearn.com/verify/${tokenId}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — KairosLearn Verified Credential`,
      description:
        metadata?.description ??
        `On-chain verified credential #${tokenId} issued by KairosLearn.`,
    },
  };
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default async function VerifyPage({ params }: Props) {
  const { tokenId } = await params;

  let id: bigint;
  try {
    id = BigInt(tokenId);
  } catch {
    notFound();
  }

  const onChain = await readOnChainCredential(id);
  if (!onChain) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0a14] via-[#0f0f1e] to-[#1a1033] px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Credential Not Found
          </h1>
          <p className="mt-3 text-purple-200/60">
            Token #{tokenId} does not exist on the KairosLearn registry.
          </p>
          <a
            href={`https://sepolia.basescan.org/address/${SBT_REGISTRY_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-lg border border-purple-500/30 px-4 py-2 text-sm text-purple-300 transition hover:border-purple-400/50 hover:text-white"
          >
            View registry on BaseScan
          </a>
        </div>
      </main>
    );
  }

  const metadata = await resolveIpfsMetadata(onChain.tokenURI);
  const title =
    metadata?.name?.replace("KairosLearn Diploma — ", "") ??
    onChain.diplomaId;
  const description = metadata?.description ?? "";
  const category =
    metadata?.attributes?.find((a) => a.trait_type === "Category")?.value ?? "";
  const issuedAt =
    metadata?.attributes?.find((a) => a.trait_type === "Issued At")?.value ??
    "";
  const imageUrl = metadata?.image ?? "";
  const baseScanNft = `https://sepolia.basescan.org/nft/${SBT_REGISTRY_ADDRESS}/${tokenId}`;
  const baseScanTx = `https://sepolia.basescan.org/address/${onChain.owner}`;
  const ipfsCid = onChain.tokenURI.replace("ipfs://", "");
  const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${ipfsCid}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0f0f1e] to-[#1a1033] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Revoked banner */}
        {onChain.revoked && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-center">
            <p className="text-lg font-semibold text-rose-400">
              This credential has been revoked
            </p>
            <p className="mt-1 text-sm text-rose-300/70">
              The issuer revoked this token. It is no longer valid.
            </p>
          </div>
        )}

        {/* Credential card */}
        <div className="overflow-hidden rounded-2xl border border-purple-500/20 bg-white/5 backdrop-blur">
          {/* Header */}
          <div className="border-b border-purple-500/10 px-6 py-4">
            <p className="text-sm font-medium text-purple-400">
              KairosLearn Verified Credential
            </p>
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="flex justify-center bg-black/20 p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                className="h-48 w-48 rounded-xl object-cover"
              />
            </div>
          )}

          {/* Body */}
          <div className="space-y-6 p-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              {description && (
                <p className="mt-2 text-purple-200/70">{description}</p>
              )}
            </div>

            {/* Details grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Token ID" value={`#${tokenId}`} />
              <Detail label="Network" value="Base Sepolia Testnet" />
              <Detail
                label="Holder"
                value={truncateAddress(onChain.owner)}
                title={onChain.owner}
              />
              {category && <Detail label="Category" value={category} />}
              {issuedAt && (
                <Detail
                  label="Issued"
                  value={new Date(issuedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              )}
              <Detail
                label="Status"
                value={onChain.revoked ? "Revoked" : "Valid"}
                valueClassName={
                  onChain.revoked ? "text-rose-400" : "text-emerald-400"
                }
              />
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              <ExternalLink href={baseScanNft} label="View on BaseScan" />
              <ExternalLink href={ipfsGateway} label="IPFS Metadata" />
              <ExternalLink href={baseScanTx} label="Holder on BaseScan" />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-purple-500/10 px-6 py-4">
            <p className="text-xs text-purple-200/40">
              This credential is a soulbound (non-transferable) ERC-5192 token
              on Base Sepolia testnet. It was issued by KairosLearn and is
              publicly verifiable on-chain.
            </p>
          </div>
        </div>

        {/* Back to KairosLearn */}
        <div className="mt-8 text-center">
          <a
            href="https://kairoslearn.com"
            className="text-sm text-purple-300/60 transition hover:text-purple-200"
          >
            kairoslearn.com
          </a>
        </div>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
  title,
  valueClassName,
}: {
  label: string;
  value: string;
  title?: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-purple-200/40">
        {label}
      </p>
      <p
        className={`mt-1 text-sm ${valueClassName ?? "text-white"}`}
        title={title}
      >
        {value}
      </p>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-purple-500/20 px-4 py-2 text-sm text-purple-300 transition hover:border-purple-400/40 hover:text-white"
    >
      {label} &rarr;
    </a>
  );
}

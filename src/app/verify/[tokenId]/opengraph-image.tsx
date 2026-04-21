import { ImageResponse } from "next/og";
import {
  readOnChainCredential,
  resolveIpfsMetadata,
} from "@/lib/credential-verify";

export const runtime = "edge";
export const alt = "KairosLearn Verified Credential";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ tokenId: string }>;
}) {
  const { tokenId } = await params;

  let onChain: Awaited<ReturnType<typeof readOnChainCredential>> = null;
  try {
    onChain = await readOnChainCredential(BigInt(tokenId));
  } catch {
    // invalid tokenId
  }

  if (!onChain) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0a0a14, #1a1033)",
            color: "white",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontFamily: "sans-serif",
          }}
        >
          Credential Not Found
        </div>
      ),
      { ...size },
    );
  }

  const metadata = await resolveIpfsMetadata(onChain.tokenURI);
  const title =
    metadata?.name?.replace("KairosLearn Diploma — ", "") ??
    onChain.diplomaId;
  const holder = `${onChain.owner.slice(0, 6)}...${onChain.owner.slice(-4)}`;
  const category =
    metadata?.attributes?.find((a) => a.trait_type === "Category")?.value ?? "";
  const status = onChain.revoked ? "REVOKED" : "VERIFIED";
  const statusColor = onChain.revoked ? "#f87171" : "#34d399";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0a0a14 0%, #1a1033 100%)",
          padding: 60,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 24, color: "#a78bfa", display: "flex" }}>
            KairosLearn Verified Credential
          </div>
          <div
            style={{
              fontSize: 18,
              color: statusColor,
              display: "flex",
              border: `2px solid ${statusColor}`,
              borderRadius: 8,
              padding: "6px 16px",
              fontWeight: 700,
            }}
          >
            {status}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 16,
            display: "flex",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>

        {/* Category */}
        {category && (
          <div
            style={{
              fontSize: 22,
              color: "#c4b5fd",
              marginBottom: 40,
              display: "flex",
            }}
          >
            {category === "coding-course"
              ? "Coding Course"
              : category === "tech-interview"
                ? "Tech Interview"
                : category}
          </div>
        )}

        {/* Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 22,
            color: "#e9d5ff",
          }}
        >
          <div style={{ display: "flex" }}>Holder: {holder}</div>
          <div style={{ display: "flex" }}>
            Token #{tokenId} on Base Sepolia
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            fontSize: 20,
            color: "#7c3aed",
            display: "flex",
          }}
        >
          kairoslearn.com/verify/{tokenId}
        </div>
      </div>
    ),
    { ...size },
  );
}

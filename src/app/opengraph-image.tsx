import { ImageResponse } from "next/og";

// Auto-generated 1200x630 social-share preview. Replaces the static
// /og-image.png reference (the file did not exist in /public, so previews
// were 404'ing on WhatsApp / LinkedIn / Twitter shares).
export const alt =
  "KairosLearn — The AI college counselor wealthy families pay $8,000 for. Now free for everyone else.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05080d",
          padding: "72px 80px",
          color: "#f2ede3",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header band — wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "#d4a84b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#05080d",
              fontSize: 32,
            }}
          >
            K
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: 36,
              letterSpacing: "0.02em",
              color: "#f2ede3",
              display: "flex",
            }}
          >
            <span style={{ color: "#d4a84b", fontStyle: "italic" }}>Kairos</span>
            <span>Learn</span>
          </div>
        </div>

        {/* Eyebrow */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              color: "#d4a84b",
              letterSpacing: "0.32em",
              fontSize: 18,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            <span style={{ width: 36, height: 1, background: "#d4a84b", display: "block" }} />
            <span>AI-Powered College Admissions Counseling</span>
          </div>

          {/* Hero title */}
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: 64,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "#f2ede3",
              maxWidth: 1040,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <span>
              The college counselor that wealthy families pay{" "}
              <span style={{ color: "#d4a84b", fontStyle: "italic" }}>$8,000</span>{" "}
              for. Now free for everyone else.
            </span>
          </div>
        </div>

        {/* Footer band */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(242,237,227,0.55)",
            fontSize: 18,
            letterSpacing: "0.06em",
          }}
        >
          <span>kairoslearn.com</span>
          <span>Start free · No credit card</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const alt = "KairosLearn — Your future. One good next step.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The default share card follows Daybreak and makes no unsupported price comparison.
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", background: "#FFF7EE", color: "#342A24", borderTop: "8px solid #A13E24", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 54, height: 54, borderRadius: 12, background: "#A13E24", color: "white" }}>k</div>
        <span>KairosLearn</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <span style={{ color: "#315B4C", fontSize: 23 }}>College guidance, at your pace</span>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 1.1 }}>
          <span>Your future.</span>
          <span style={{ color: "#A13E24" }}>One good next step.</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #967D6A", paddingTop: 22, fontSize: 22, color: "#69584B" }}>
        <span>kairoslearn.com</span><span>A little progress is enough.</span>
      </div>
    </div>,
    size,
  );
}

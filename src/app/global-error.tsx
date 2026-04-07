"use client";

// Last-resort error boundary — used when error.tsx itself fails.
// Must include its own <html>/<body>. Spec: P0 fix 2026-04-07.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0a0a0a", color: "#fff" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Something broke at the edge</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
              The error boundary itself failed. This is rare. Try refreshing.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 24px",
                borderRadius: 12,
                background: "#D4AF37",
                color: "#000",
                fontWeight: 600,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
              }}
            >
              Reload
            </button>
            {error.digest && (
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 16, fontFamily: "monospace" }}>
                Digest: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

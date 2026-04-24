"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

/**
 * Subtle auto-dismissing toast shown when /landing is reached via the
 * logout flow (AuthContext.signOut redirects to /landing?loggedOut=1).
 * Auto-hides after 4 seconds. Styled to match the cinematic surface.
 */
export default function LoggedOutToast() {
  const params = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (params.get("loggedOut") !== "1") return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 4000);
    // Remove the query param from the URL so a reload doesn't re-trigger.
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("loggedOut");
      window.history.replaceState({}, "", url.toString());
    } catch {
      /* ignore */
    }
    return () => clearTimeout(t);
  }, [params]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 18px",
        background: "rgba(5,8,13,0.92)",
        border: "1px solid rgba(212,168,75,0.30)",
        backdropFilter: "blur(12px)",
        color: "#f2ede3",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.02em",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#d4a84b" }} aria-hidden />
      You&rsquo;ve been signed out.{" "}
      <a
        href="/login"
        style={{
          color: "#d4a84b",
          textDecoration: "underline",
          textUnderlineOffset: 2,
          fontWeight: 600,
        }}
      >
        Sign back in
      </a>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type State =
  | { kind: "checking" }
  | { kind: "redirecting" }
  | { kind: "redeeming" }
  | { kind: "success"; counselorName: string | null; agencyName: string | null }
  | { kind: "error"; message: string };

export default function JoinPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<State>({ kind: "checking" });
  const ran = useRef(false);

  useEffect(() => {
    if (authLoading) return;          // wait for auth to resolve
    if (!code) return;
    if (ran.current) return;          // guard React 18 strict-mode double-invoke
    ran.current = true;

    if (!user) {
      setState({ kind: "redirecting" });
      // /login reads ?next= and its "Sign up" links carry it on, so both
      // returning and brand-new students come back here after auth.
      router.push(`/login?next=${encodeURIComponent(`/join/${code}`)}`);
      return;
    }

    setState({ kind: "redeeming" });
    fetch("/api/counselor/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (resp) => {
        if (resp.ok) {
          // Name who they just joined (QA-05) and let them read it before moving on.
          const me = await fetch("/api/cc/my-counselor").then((r) => (r.ok ? r.json() : null)).catch(() => null);
          setState({
            kind: "success",
            counselorName: me?.counselor?.displayName ?? null,
            agencyName: me?.counselor?.agencyName ?? null,
          });
        } else {
          const body = await resp.json().catch(() => ({ error: "failed" }));
          setState({ kind: "error", message: body.error ?? "unknown error" });
        }
      })
      .catch(() => setState({ kind: "error", message: "network error — please retry" }));
  }, [code, user, authLoading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full p-6 rounded-2xl border border-white/10 bg-[#141414]">
        <h1 className="text-2xl font-semibold mb-3">Joining your counselor</h1>
        <p className="text-sm text-white/60 mb-4">
          Invite code: <code className="font-mono text-white/80">{code}</code>
        </p>
        {state.kind === "checking" && <p className="text-white/70">Checking your session…</p>}
        {state.kind === "redirecting" && <p className="text-white/70">Taking you to sign in — we&apos;ll bring you right back.</p>}
        {state.kind === "redeeming" && <p className="text-white/70">Linking you to your counselor…</p>}
        {state.kind === "success" && (
          <div>
            <p className="text-white font-semibold mb-1">
              You&apos;re linked to {state.counselorName ?? "your counselor"}
              {state.agencyName && state.agencyName !== state.counselorName ? ` at ${state.agencyName}` : ""}.
            </p>
            <p className="text-sm text-white/60 mb-4">
              They can now see your essays, school list and progress, and their feedback shows up inside Essay Studio.
            </p>
            <button
              onClick={() => router.push("/cc/dashboard")}
              className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black hover:bg-[#C4A030]"
            >
              Continue
            </button>
          </div>
        )}
        {state.kind === "error" && (
          <div>
            <p className="text-rose-300 mb-2">We couldn&apos;t use this code: {state.message}</p>
            <p className="text-sm text-white/50">Double-check the code with your counselor, or ask them to send a fresh one.</p>
          </div>
        )}
      </div>
    </main>
  );
}

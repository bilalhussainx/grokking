"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type State =
  | { kind: "checking" }
  | { kind: "redirecting" }
  | { kind: "redeeming" }
  | { kind: "success" }
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
      // /login reads ?next= (signup ignores redirect params and hard-routes to
      // "/", so login is the correct destination — it brings them right back).
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
          setState({ kind: "success" });
          // /cc/dashboard is the auth-gated college-counselor student home.
          setTimeout(() => router.push("/cc/dashboard"), 1500);
        } else {
          const body = await resp.json().catch(() => ({ error: "failed" }));
          setState({ kind: "error", message: body.error ?? "unknown error" });
        }
      })
      .catch(() => setState({ kind: "error", message: "network error — please retry" }));
  }, [code, user, authLoading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full p-6 rounded-2xl border border-white/10 bg-white/5">
        <h1 className="text-2xl font-semibold mb-3">Joining your counselor</h1>
        <p className="text-sm text-white/60 mb-4">
          Invite code: <code className="font-mono text-white/80">{code}</code>
        </p>
        {state.kind === "checking" && <p className="text-white/70">Checking your session…</p>}
        {state.kind === "redirecting" && <p className="text-white/70">Taking you to sign in — we&apos;ll bring you right back.</p>}
        {state.kind === "redeeming" && <p className="text-white/70">Linking you to the agency…</p>}
        {state.kind === "success" && <p className="text-emerald-300">You&apos;re linked! Taking you to your dashboard…</p>}
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

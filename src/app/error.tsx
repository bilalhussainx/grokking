"use client";

// Root error boundary — catches any unhandled error in client components.
// Replaces Next.js's generic "Application error" white screen with a usable
// recovery UI. Spec: P0 fix 2026-04-07.
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for debugging; in production this goes to Vercel logs
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
        <p className="text-sm text-white/50 mb-6">
          We hit an unexpected error. Your progress is safe — try refreshing or going back to the homepage.
        </p>
        {error.message && (
          <details className="mb-6 text-left">
            <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 transition-colors">
              Technical details
            </summary>
            <pre className="mt-2 p-3 rounded-lg bg-white/[0.03] border border-white/10 text-[10px] text-white/40 font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {error.message}
              {error.digest ? `\n\nDigest: ${error.digest}` : ""}
            </pre>
          </details>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-cyan-500 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/80 text-sm font-medium hover:bg-white/5 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

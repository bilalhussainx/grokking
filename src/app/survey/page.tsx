// Bug fix 2026-04-07: server-side redirect() can't target static files in
// public/, so this used to throw a 404 when users hit /survey. Switch to a
// client-side window.location.replace which the browser handles directly.
"use client";

import { useEffect } from "react";

export default function SurveyRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace("/survey.html");
    }
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <p className="text-sm text-white/40">Redirecting to survey…</p>
    </div>
  );
}

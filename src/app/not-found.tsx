// Custom 404 page — shown for any unmatched route.
// Replaces Next.js's default 404 with a branded recovery UI.
// Spec: P0 fix 2026-04-07
import Link from "next/link";
import { Compass, Home, Target, GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <Compass className="w-8 h-8 text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-sm text-white/50 mb-8">
          The page you're looking for doesn't exist or has moved. Try one of these instead:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Link
            href="/"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/5 transition-all"
          >
            <Home className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs text-white/70">Home</span>
          </Link>
          <Link
            href="/college-interviews"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/5 transition-all"
          >
            <GraduationCap className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs text-white/70">College</span>
          </Link>
          <Link
            href="/interviews"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/5 transition-all"
          >
            <Target className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-xs text-white/70">Tech</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

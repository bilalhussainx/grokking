"use client";
import { motion } from "framer-motion";
import { Code2, Eye, Copy, Clock } from "lucide-react";
import type { LiveSession } from "@/types/sessions";
import Link from "next/link";
import { useState } from "react";

export default function SessionCard({ session, index = 0 }: { session: LiveSession; index?: number }) {
  const [copied, setCopied] = useState(false);
  const isCoding = session.session_type === "coding";
  const isLive = session.status === "active";

  const copyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(session.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        href={`/sessions/${session.id}`}
        className="group block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
      >
        {/* Top row: icon + status */}
        <div className="flex items-center justify-between mb-2.5">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isCoding ? "bg-blue-500/15 text-blue-400" : "bg-emerald-500/15 text-emerald-400"}`}>
            {isCoding ? <Code2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </div>
          {isLive ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="text-[10px] text-white/30 font-medium">
              {session.status}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold truncate group-hover:text-blue-400 transition-colors mb-2">
          {session.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-white/30">
          <button
            onClick={copyCode}
            className="flex items-center gap-1 hover:text-white/60 transition-colors font-mono"
          >
            <Copy className="w-3 h-3" />
            {copied ? "Copied" : session.join_code}
          </button>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(session.created_at).toLocaleDateString()}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

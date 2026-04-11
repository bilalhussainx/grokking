"use client";

import { Bookmark } from "lucide-react";

interface KeyTakeawaysProps {
  items: string[];
  title?: string;
}

export default function KeyTakeaways({ items, title }: KeyTakeawaysProps) {
  return (
    <div className="my-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] overflow-hidden not-prose">
      <div className="px-5 py-3 bg-white/[0.03] border-b border-white/10 flex items-center gap-2">
        <Bookmark className="w-4 h-4 text-white/40" />
        <span className="text-sm font-semibold text-white/60">
          {title || "Key Takeaways"}
        </span>
      </div>
      <ul className="px-5 py-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm text-white/70 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

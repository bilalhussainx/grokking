// src/components/cc/dashboard/sections/WidgetStripFooter.tsx
// 4 mono-numeral footer widgets — same data shape as the deprecated
// handoff WidgetStrip but glass aesthetic + lucide-tone semantic.
"use client";
import { motion } from "framer-motion";
import type { DashboardSummary, WidgetItem } from "./types";

export default function WidgetStripFooter({ summary }: { summary: DashboardSummary }) {
  const items: WidgetItem[] = summary.footerWidgets;
  if (!items.length) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="rounded-2xl border border-white/10 bg-[#141414]/60 backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={`${it.label}-${i}`}
              className={`p-4 sm:p-5 flex items-baseline gap-2.5 ${i < items.length - 1 ? "border-r border-white/5" : ""} ${i >= 2 && i < items.length ? "border-t sm:border-t-0 border-white/5" : ""}`}
            >
              <span
                className={`tabular-nums font-semibold text-xl tracking-tight ${it.tone === "gold" ? "text-[#D4AF37]" : "text-white"}`}
              >
                {it.n}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/45">
                {it.label}
              </span>
              {it.delta && (
                <span
                  className={`ml-auto text-[10px] tabular-nums ${it.delta.startsWith("+") ? "text-emerald-300" : "text-rose-300"}`}
                >
                  {it.delta}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

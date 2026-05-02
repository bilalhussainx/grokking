// src/components/cc/dashboard/sections/SchoolCard.tsx
// Per-school glass card with milestone timeline + supplement list. LIFTED
// from CounselorDashboard's nested SchoolCard + helper functions
// (deadlineTone, statusPill, formatDate, bandStyles, SchoolLogo).
// Helpers exported as named exports for reuse in LoomingDeadlines.
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  FileEdit,
  AlertCircle,
} from "lucide-react";
import { getSchoolBrand, logoCandidates } from "@/lib/school-branding";
import type { EssayStatus, SchoolProgress } from "./types";

// === bandStyles (lifted from CounselorDashboard L73-79) ===
const bandStyles: Record<string, { bg: string; text: string; label: string }> = {
  safety: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-300", label: "Safety" },
  match: { bg: "bg-sky-500/10 border-sky-500/20", text: "text-sky-300", label: "Match" },
  target: { bg: "bg-sky-500/10 border-sky-500/20", text: "text-sky-300", label: "Target" },
  reach: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-300", label: "Reach" },
  far_reach: { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-300", label: "Far reach" },
};

// === deadlineTone (lifted from CounselorDashboard L81-88) — exported ===
export function deadlineTone(days: number | null): { text: string; tone: string; glowClass: string } {
  if (days === null) return { text: "No deadline set", tone: "text-white/40", glowClass: "" };
  if (days < 0) return { text: `Past deadline`, tone: "text-rose-300", glowClass: "" };
  if (days <= 7) return { text: `${days}d left`, tone: "text-rose-300 font-semibold", glowClass: "ring-1 ring-rose-500/30" };
  if (days <= 21) return { text: `${days}d left`, tone: "text-amber-300 font-semibold", glowClass: "ring-1 ring-amber-500/20" };
  if (days <= 60) return { text: `${days}d left`, tone: "text-sky-300", glowClass: "" };
  return { text: `${days}d left`, tone: "text-white/50", glowClass: "" };
}

// === statusPill (lifted from CounselorDashboard L90-101) ===
function statusPill(status: EssayStatus): { bg: string; text: string; label: string; icon: typeof Circle } {
  switch (status) {
    case "missing":
      return { bg: "bg-white/[0.04] border-white/10", text: "text-white/40", label: "Not started", icon: Circle };
    case "draft":
      return { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-300", label: "Drafting", icon: FileEdit };
    case "review":
      return { bg: "bg-sky-500/10 border-sky-500/20", text: "text-sky-300", label: "In review", icon: AlertCircle };
    case "revised":
      return { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-300", label: "Revised", icon: CheckCircle2 };
  }
}

// === formatDate (lifted from CounselorDashboard L103-108) — exported ===
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// === SchoolLogo (lifted from CounselorDashboard L308-347) ===
function SchoolLogo({ name, website, primary }: { name: string; website: string | null; primary: string }) {
  const brand = getSchoolBrand(name, website);
  const candidates = logoCandidates(brand);
  const [idx, setIdx] = useState(0);
  const src = candidates[idx];

  if (!src) {
    const initials = name
      .replace(/^the\s+/i, "")
      .split(/\s+/)
      .filter((w) => !/^(of|at|and|&|university|college)$/i.test(w))
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold tabular-nums"
        style={{ backgroundColor: `${primary}22`, color: primary, border: `1px solid ${primary}55` }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white/5"
      style={{ border: `1px solid ${primary}44` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="w-8 h-8 object-contain"
        onError={() => setIdx((i) => i + 1)}
      />
    </div>
  );
}

// ── Per-school glass card with milestone list + supplement list ──
// === SchoolCard (lifted from CounselorDashboard L350-544) ===
export default function SchoolCard({ school }: { school: SchoolProgress }) {
  const tone = deadlineTone(school.daysToDeadline);
  const band = school.chancingBand ? bandStyles[school.chancingBand] : null;
  const completionPct = Math.round(school.overallCompletion * 100);
  const brand = getSchoolBrand(school.name, school.website);

  // Build milestone states
  const milestones = [
    { label: "Supplements drafted", done: school.supplements.drafted === school.supplements.total && school.supplements.total > 0, inProgress: school.supplements.drafted > 0 && school.supplements.drafted < school.supplements.total },
    { label: "Reviews requested", done: school.supplements.reviewed === school.supplements.total && school.supplements.total > 0, inProgress: school.supplements.reviewed > 0 && school.supplements.reviewed < school.supplements.total },
    { label: "Ready to submit", done: false, inProgress: false },
  ];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`group relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#141414]/70 via-[#141414]/60 to-[#0f0f0f]/60 backdrop-blur-md p-6 hover:border-white/20 transition-all overflow-hidden ${tone.glowClass}`}
    >
      {/* Brand accent stripe */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${brand.primary} 0%, ${brand.accent} 100%)`, opacity: 0.8 }}
      />
      {/* Soft brand-tinted glow in the top-right corner */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: brand.primary }}
      />

      {/* Header */}
      <div className="relative flex items-start gap-3 mb-5">
        <SchoolLogo name={school.name} website={school.website} primary={brand.primary} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {band && (
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border ${band.bg} ${band.text}`}>
                {band.label}
              </span>
            )}
            {school.applicationPlan && (
              <span
                className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider border ${
                  school.isEarlyRound
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40"
                    : "bg-white/5 text-white/50 border-white/10"
                }`}
              >
                {school.applicationPlan}
              </span>
            )}
            {school.acceptanceRate !== null && (
              <span className="text-[10px] text-white/40 tabular-nums">
                {Math.round(school.acceptanceRate * 100)}% acceptance
              </span>
            )}
          </div>
          <h3
            className="text-lg font-bold truncate tracking-tight"
            style={{ color: brand.primary }}
          >
            {school.name}
          </h3>
        </div>
        <Link
          href={`/schools/${school.schoolId}`}
          className="shrink-0 text-white/30 hover:text-[#D4AF37] transition-colors"
          aria-label="Open school detail"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Deadline + progress bar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-white/50 uppercase tracking-wider">
              {school.supplements.total === 0 ? "No supplements tracked" : `${school.supplements.drafted} of ${school.supplements.total} drafted`}
            </span>
            <span className="text-[10px] text-white/40 tabular-nums">{completionPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/40" />
          <span className={`text-xs tabular-nums ${tone.tone}`}>{tone.text}</span>
          {school.nearestDeadlineLabel && (
            <span className="text-[10px] text-white/30">{school.nearestDeadlineLabel}</span>
          )}
        </div>
      </div>

      {/* Two-column: milestones + supplements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
        {/* Left: milestone timeline */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-2.5">Timeline</h4>
          <ul className="space-y-2">
            {milestones.map((m, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    m.done
                      ? "bg-emerald-500/15"
                      : m.inProgress
                      ? "bg-amber-500/15"
                      : "bg-white/[0.04]"
                  }`}
                >
                  {m.done ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  ) : m.inProgress ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  )}
                </div>
                <span
                  className={`text-[11px] ${
                    m.done ? "text-white/50 line-through decoration-white/20" : m.inProgress ? "text-white/80" : "text-white/40"
                  }`}
                >
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: supplement list */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider font-semibold text-white/40 mb-2.5">
            Supplements {school.supplements.total > 0 ? `(${school.supplements.total})` : ""}
          </h4>
          {school.supplements.total === 0 ? (
            <p className="text-[11px] text-white/30 italic">
              Prompts not tracked yet. Check the school page.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {school.supplements.items.slice(0, 3).map((item) => {
                const pill = statusPill(item.status);
                const Icon = pill.icon;
                return (
                  <li key={item.supplementId}>
                    {item.essayId ? (
                      <Link
                        href={`/cc/essays/${item.essayId}`}
                        className="flex items-center gap-2 text-[11px] text-white/70 hover:text-white transition-colors group/item"
                      >
                        <Icon className={`w-3 h-3 shrink-0 ${pill.text}`} />
                        <span className="truncate group-hover/item:underline decoration-white/20">
                          {item.promptSnippet}
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 text-[11px] text-white/40">
                        <Icon className={`w-3 h-3 shrink-0 ${pill.text}`} />
                        <span className="truncate">{item.promptSnippet}</span>
                      </div>
                    )}
                  </li>
                );
              })}
              {school.supplements.items.length > 3 && (
                <li className="text-[10px] text-white/30 pl-5">
                  +{school.supplements.items.length - 3} more
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-white/60">{school.nextAction}</span>
        <Link
          href={`/schools/${school.schoolId}`}
          className="text-[11px] font-semibold text-[#D4AF37] hover:text-[#F4D03F] transition-colors flex items-center gap-1"
        >
          Open <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}

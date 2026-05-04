"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useCoachKairos } from "@/contexts/CoachKairosContext";
import { isGrade9BlockedPath } from "@/lib/cc/grade-route-policy";
import { stripActionsBlock } from "@/lib/cc/coach-actions-block";

interface Props {
  role: "assistant" | "user";
  content: string;
  isStreaming?: boolean;
}

const ACTION_PATTERNS: { pattern: RegExp; href: string; label: string }[] = [
  { pattern: /\b(school list|build.*schools|find schools|browse schools)\b/i, href: "/schools", label: "School List Builder" },
  { pattern: /\b(essay|personal statement|supplemental)\b/i, href: "/cc/essays", label: "Essay Studio" },
  { pattern: /\b(interview|mock interview)\b/i, href: "/college-interviews", label: "Interview Prep" },
  { pattern: /\b(activities|extracurricular)\b/i, href: "/cc/activities-optimizer", label: "Activities Optimizer" },
];

// Hrefs in the action-pattern list that are locked for grade 9 — filter them
// so a G9 student never sees an "Essay Studio →" chip pointing at a route
// that middleware will redirect (AUD-P1-003 OpenClaw 2026-05-02).
function filterChipsForVariant(
  actions: { href: string; label: string }[],
  variantKey: string | null,
): { href: string; label: string }[] {
  if (variantKey === "g9") {
    return actions.filter((a) => !isGrade9BlockedPath(a.href));
  }
  return actions;
}

function renderContent(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      return (
        <Link key={i} href={linkMatch[2]} className="text-[#D4AF37] underline underline-offset-2 hover:text-[#F4D03F] transition-colors">
          {linkMatch[1]}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function getQuickActions(content: string): { href: string; label: string }[] {
  const actions: { href: string; label: string }[] = [];
  for (const { pattern, href, label } of ACTION_PATTERNS) {
    if (pattern.test(content) && !actions.some((a) => a.href === href)) {
      actions.push({ href, label });
    }
  }
  return actions.slice(0, 2);
}

export default function CoachMessage({ role, content, isStreaming }: Props) {
  if (role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div
          dir="auto"
          className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-[#D4AF37]/20 text-white text-sm leading-relaxed"
        >
          {content}
        </div>
      </motion.div>
    );
  }

  const { currentVariantKey } = useCoachKairos();
  // Last-line defense: even if the streaming-tag detection in
  // /api/cc/coach/message lets an actions block leak into a chunk,
  // strip it client-side before rendering. The block is for the
  // server-side extraction pipeline, never for human eyes.
  // stripActionsBlock matches both <</actions>> and <<actions>> as
  // closers (lenient regex) — same behavior as the saved DB version.
  const displayContent = stripActionsBlock(content);
  const quickActions = !isStreaming
    ? filterChipsForVariant(getQuickActions(displayContent), currentVariantKey)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2.5 items-start"
    >
      <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0 mt-0.5">
        <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
      </div>
      <div className="max-w-[85%]">
        <div dir="auto" className="text-sm text-white/80 leading-relaxed">
          {renderContent(displayContent)}
          {isStreaming && <span className="inline-block w-1.5 h-4 bg-[#D4AF37] ml-0.5 animate-pulse" />}
        </div>
        {quickActions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/20 transition-colors"
              >
                {action.label} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

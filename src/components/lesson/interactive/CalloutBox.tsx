"use client";

import { useState } from "react";
import { Lightbulb, AlertTriangle, Info, Zap, BookOpen, Bug, Target } from "lucide-react";

type CalloutType = "tip" | "warning" | "info" | "concept" | "deep-dive" | "gotcha" | "best-practice";

interface CalloutBoxProps {
  type: CalloutType;
  title?: string;
  children: string;
}

const config: Record<CalloutType, {
  icon: React.ElementType;
  defaultTitle: string;
  border: string;
  bg: string;
  iconColor: string;
  titleColor: string;
}> = {
  tip: {
    icon: Lightbulb,
    defaultTitle: "Pro Tip",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    iconColor: "text-emerald-400",
    titleColor: "text-emerald-300",
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: "Watch Out",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    iconColor: "text-amber-400",
    titleColor: "text-amber-300",
  },
  info: {
    icon: Info,
    defaultTitle: "Note",
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    iconColor: "text-blue-400",
    titleColor: "text-blue-300",
  },
  concept: {
    icon: Zap,
    defaultTitle: "Key Concept",
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    iconColor: "text-purple-400",
    titleColor: "text-purple-300",
  },
  "deep-dive": {
    icon: BookOpen,
    defaultTitle: "Deep Dive",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    iconColor: "text-cyan-400",
    titleColor: "text-cyan-300",
  },
  gotcha: {
    icon: Bug,
    defaultTitle: "Common Gotcha",
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    iconColor: "text-red-400",
    titleColor: "text-red-300",
  },
  "best-practice": {
    icon: Target,
    defaultTitle: "Best Practice",
    border: "border-teal-500/30",
    bg: "bg-teal-500/5",
    iconColor: "text-teal-400",
    titleColor: "text-teal-300",
  },
};

export default function CalloutBox({ type, title, children }: CalloutBoxProps) {
  const c = config[type] || config.info;
  const Icon = c.icon;

  return (
    <div className={`my-6 rounded-xl border ${c.border} ${c.bg} p-4 not-prose`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${c.iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${c.titleColor} mb-1`}>
            {title || c.defaultTitle}
          </p>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}

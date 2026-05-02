"use client";
import type { ReactNode } from "react";

export default function MobileSectionHead({
  children,
  right,
}: {
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pt-4 pb-2">
      <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-white/55">
        {children}
      </span>
      {right}
    </div>
  );
}

"use client";
import Link from "next/link";
import type { ReactNode } from "react";

export default function MobileTile({
  href,
  icon,
  label,
  caption,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  caption?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl p-3 active:scale-[0.99] transition-transform"
      style={{
        border: "1px solid rgba(255,255,255,.08)",
        background: "rgba(20,20,20,.6)",
        minHeight: 72,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/60">{icon}</span>
        <p className="text-[13px] font-semibold text-white truncate">{label}</p>
      </div>
      {caption && <p className="text-[10.5px] text-white/45 truncate">{caption}</p>}
    </Link>
  );
}

// src/components/auth/CreditBadge.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Coins } from "lucide-react";

export default function CreditBadge() {
  const { credits, user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-medium">
      <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      <span>{typeof credits === 'number' && credits > 9999 ? `${Math.floor(credits/1000)}k` : credits}</span>
    </div>
  );
}

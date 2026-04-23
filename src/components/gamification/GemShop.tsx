"use client";

import { useState, useEffect, useCallback } from "react";
import { useXP } from "@/contexts/XPContext";

interface ShopItem {
  id: string;
  name: string;
  cost: number;
  category: "Card Frames" | "Card Backgrounds" | "Streak Flames";
  preview: string; // CSS class or color indicator
}

const SHOP_ITEMS: ShopItem[] = [
  // Frames
  { id: "frame-minimal", name: "Minimal", cost: 0, category: "Card Frames", preview: "border border-white/30" },
  { id: "frame-neon", name: "Neon Glow", cost: 20, category: "Card Frames", preview: "border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]" },
  { id: "frame-gold", name: "Gold", cost: 20, category: "Card Frames", preview: "border-2 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" },
  { id: "frame-holographic", name: "Holographic", cost: 20, category: "Card Frames", preview: "border-2 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)]" },
  // Backgrounds
  { id: "bg-gradient", name: "Gradient", cost: 0, category: "Card Backgrounds", preview: "bg-gradient-to-br from-purple-950 to-slate-900" },
  { id: "bg-space", name: "Space", cost: 30, category: "Card Backgrounds", preview: "bg-gradient-to-br from-indigo-950 to-slate-950" },
  { id: "bg-forest", name: "Forest", cost: 30, category: "Card Backgrounds", preview: "bg-gradient-to-br from-emerald-950 to-slate-900" },
  { id: "bg-ocean", name: "Ocean", cost: 30, category: "Card Backgrounds", preview: "bg-gradient-to-br from-blue-950 to-slate-900" },
  { id: "bg-circuit", name: "Circuit", cost: 30, category: "Card Backgrounds", preview: "bg-gradient-to-br from-slate-800 to-slate-900" },
  // Flames
  { id: "flame-orange", name: "Classic", cost: 0, category: "Streak Flames", preview: "bg-orange-500" },
  { id: "flame-blue", name: "Blue Fire", cost: 15, category: "Streak Flames", preview: "bg-blue-500" },
  { id: "flame-green", name: "Green Fire", cost: 15, category: "Streak Flames", preview: "bg-emerald-500" },
  { id: "flame-purple", name: "Purple Fire", cost: 15, category: "Streak Flames", preview: "bg-violet-500" },
];

const CATEGORIES = ["Card Frames", "Card Backgrounds", "Streak Flames"] as const;

export default function GemShop() {
  const { gems, refreshProfile } = useXP();
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [buying, setBuying] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchOwned = useCallback(async () => {
    try {
      const res = await fetch("/api/gems/balance");
      if (res.ok) {
        const data = await res.json();
        if (data.cosmetics) {
          const ownedSet = new Set<string>();
          // Free items are always owned
          SHOP_ITEMS.filter((i) => i.cost === 0).forEach((i) => ownedSet.add(i.id));
          // Items from cosmetics table
          if (data.cosmetics.card_frame) ownedSet.add(`frame-${data.cosmetics.card_frame}`);
          if (data.cosmetics.card_bg) ownedSet.add(`bg-${data.cosmetics.card_bg}`);
          if (data.cosmetics.flame_color) ownedSet.add(`flame-${data.cosmetics.flame_color}`);
          setOwned(ownedSet);
        }
      }
    } catch {
      // Default to only free items owned
      const freeSet = new Set<string>();
      SHOP_ITEMS.filter((i) => i.cost === 0).forEach((i) => freeSet.add(i.id));
      setOwned(freeSet);
    }
  }, []);

  useEffect(() => {
    fetchOwned();
  }, [fetchOwned]);

  const handleBuy = async (item: ShopItem) => {
    if (owned.has(item.id)) return;
    setBuying(item.id);

    try {
      const res = await fetch("/api/gems/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });

      if (res.ok) {
        setOwned((prev) => new Set([...prev, item.id]));
        setToast(`Purchased ${item.name}.`);
        refreshProfile();
        setTimeout(() => setToast(null), 3000);
      } else {
        const data = await res.json();
        setToast(data.error || "Purchase failed");
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast("Purchase failed");
      setTimeout(() => setToast(null), 3000);
    } finally {
      setBuying(null);
    }
  };

  return (
    <div className="w-full">
      {/* Gem balance */}
      <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
        <span className="text-2xl">{'\u{1F48E}'}</span>
        <span className="text-xl font-bold text-white">{gems}</span>
        <span className="text-sm text-white/40">gems available</span>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium animate-in fade-in slide-in-from-right">
          {toast}
        </div>
      )}

      {/* Item sections */}
      {CATEGORIES.map((category) => {
        const items = SHOP_ITEMS.filter((i) => i.category === category);
        return (
          <div key={category} className="mb-8">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item) => {
                const isOwned = owned.has(item.id);
                const isBuying = buying === item.id;
                const canAfford = gems >= item.cost;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
                  >
                    {/* Preview swatch */}
                    {category === "Streak Flames" ? (
                      <div className={`w-12 h-12 rounded-full ${item.preview}`} />
                    ) : (
                      <div className={`w-full h-16 rounded-lg ${item.preview}`} />
                    )}

                    {/* Name */}
                    <span className="text-sm text-white/80 text-center">{item.name}</span>

                    {/* Cost + buy */}
                    {isOwned ? (
                      <span className="text-xs text-emerald-400 font-medium px-3 py-1 rounded-full bg-emerald-500/10">
                        Owned
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={isBuying || !canAfford}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                          canAfford
                            ? "bg-violet-500/20 text-violet-300 hover:bg-violet-500/30"
                            : "bg-white/5 text-white/30 cursor-not-allowed"
                        }`}
                      >
                        {isBuying
                          ? "..."
                          : item.cost === 0
                          ? "Free"
                          : `${item.cost} \u{1F48E}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

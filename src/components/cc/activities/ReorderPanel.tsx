"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

interface Activity {
  position: number;
  organization: string | null;
  role: string | null;
  activity_type: string | null;
  impact_score: number | null;
}

interface ReorderPanelProps {
  activities: Activity[];
  recommendedOrder: number[];
  rationale: string;
  onAcceptOrder: (newOrder: number[]) => void;
}

export default function ReorderPanel({
  activities,
  recommendedOrder,
  rationale,
  onAcceptOrder,
}: ReorderPanelProps) {
  const [accepted, setAccepted] = useState(false);

  const currentOrder = activities.map((a) => a.position);
  const isAlreadyOptimal = JSON.stringify(currentOrder) === JSON.stringify(recommendedOrder);

  const getActivity = (pos: number) => activities.find((a) => a.position === pos);

  const renderItem = (pos: number, index: number) => {
    const act = getActivity(pos);
    if (!act) return null;
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
        <span className="text-xs text-white/30 font-mono w-5">{index + 1}</span>
        <span className="text-sm text-white/80 flex-1 truncate">
          {act.organization || act.activity_type || "Activity"}
        </span>
        {act.role && <span className="text-xs text-white/30 hidden sm:inline">{act.role}</span>}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-white/60 leading-relaxed">{rationale}</p>
      </div>

      {isAlreadyOptimal ? (
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 text-center">
          <Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-400">Your current order is already optimal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4">
          <div>
            <h3 className="text-xs text-white/40 uppercase tracking-wide mb-2">Current Order</h3>
            <div className="space-y-1.5">
              {currentOrder.map((pos, i) => (
                <div key={pos}>{renderItem(pos, i)}</div>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center">
            <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
          </div>

          <div>
            <h3 className="text-xs text-[#D4AF37]/60 uppercase tracking-wide mb-2">Recommended</h3>
            <div className="space-y-1.5">
              {recommendedOrder.map((pos, i) => (
                <div key={pos}>{renderItem(pos, i)}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isAlreadyOptimal && !accepted && (
        <button
          onClick={() => {
            onAcceptOrder(recommendedOrder);
            setAccepted(true);
          }}
          className="px-6 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
        >
          Accept recommended order
        </button>
      )}

      {accepted && (
        <p className="text-xs text-green-400/60 flex items-center gap-1">
          <Check className="w-3 h-3" /> Order updated
        </p>
      )}
    </div>
  );
}

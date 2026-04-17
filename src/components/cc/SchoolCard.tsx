"use client";

import { MapPin, Clock, DollarSign, GraduationCap } from "lucide-react";

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  school_type: string;
  acceptance_rate: number;
  avg_net_price: number;
  test_policy: string;
  regular_deadline: string;
  early_deadline: string | null;
}

interface Props {
  school: School;
  onAdd?: (schoolId: string) => void;
  onRemove?: (id: string) => void;
  listEntryId?: string;
  chancingBand?: string;
  showAddButton?: boolean;
  added?: boolean;
}

const BAND_COLORS: Record<string, string> = {
  reach: "bg-red-500/20 text-red-400 border-red-500/30",
  match: "bg-green-500/20 text-green-400 border-green-500/30",
  safety: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  unknown: "bg-white/10 text-white/40 border-white/10",
};

export default function SchoolCard({ school, onAdd, onRemove, listEntryId, chancingBand, showAddButton, added }: Props) {
  const acceptPct = Math.round((school.acceptance_rate || 0) * 100);

  return (
    <div className="p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white truncate">{school.name}</h3>
            {chancingBand && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${BAND_COLORS[chancingBand] || BAND_COLORS.unknown}`}>
                {chancingBand}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {school.city}, {school.state}
            </span>
            <span className="capitalize">{school.school_type}</span>
          </div>
        </div>

        {showAddButton && onAdd && (
          <button
            onClick={() => onAdd(school.id)}
            disabled={added}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              added
                ? "bg-white/5 text-white/30 cursor-default"
                : "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
            }`}
          >
            {added ? "Added" : "+ Add"}
          </button>
        )}

        {onRemove && listEntryId && (
          <button
            onClick={() => onRemove(listEntryId)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-white/50">
        <span className="flex items-center gap-1">
          <GraduationCap className="w-3 h-3" />
          {acceptPct}% accept
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          ${(school.avg_net_price || 0).toLocaleString()} avg net
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {school.regular_deadline}
        </span>
        <span className="capitalize">Test {school.test_policy}</span>
      </div>
    </div>
  );
}

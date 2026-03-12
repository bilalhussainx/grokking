"use client";
import { motion } from "framer-motion";
import { Users, Crown, GraduationCap, Eye } from "lucide-react";
import type { PresenceState } from "@/types/sessions";

const ROLE_CFG = {
  teacher: { icon: <Crown className="w-3 h-3" />, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  student: { icon: <GraduationCap className="w-3 h-3" />, color: "text-blue-400", bg: "bg-blue-400/10" },
  observer: { icon: <Eye className="w-3 h-3" />, color: "text-[var(--muted-foreground)]", bg: "bg-white/5" },
};

export default function SessionParticipants({ participants }: { participants: PresenceState[] }) {
  const sorted = [...participants].sort((a, b) => { const o = { teacher: 0, student: 1, observer: 2 }; return (o[a.role] ?? 2) - (o[b.role] ?? 2); });
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <Users className="w-4 h-4 text-blue-400" /><span className="text-sm font-semibold">Participants</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{participants.length} online</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {sorted.map((user, i) => { const c = ROLE_CFG[user.role] || ROLE_CFG.student; return (
          <motion.div key={user.userId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-white/5 transition-colors">
            <div className="relative"><div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-bold text-white">{user.name.charAt(0).toUpperCase()}</div><span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--background)] bg-emerald-500" /></div>
            <div className="flex-1 min-w-0"><div className="text-xs font-medium truncate">{user.name}</div></div>
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold ${c.color} ${c.bg}`}>{c.icon}{user.role}</span>
          </motion.div>
        ); })}
      </div>
    </div>
  );
}

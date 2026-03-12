"use client";
import { FileText, Loader2, Check } from "lucide-react";
import type { DocStatus } from "@/types/writing";

const STATUS_CFG: Record<DocStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-white/10 text-[var(--muted-foreground)]" },
  in_review: { label: "In Review", cls: "bg-yellow-500/20 text-yellow-400" },
  approved: { label: "Approved", cls: "bg-emerald-500/20 text-emerald-400" },
  published: { label: "Published", cls: "bg-blue-500/20 text-blue-400" },
};

export default function DocumentHeader({ title, onTitleChange, status, wordCount, saving }: { title: string; onTitleChange: (t: string) => void; status: DocStatus; wordCount: number; saving: boolean; lastSaved?: string }) {
  const s = STATUS_CFG[status];
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400"><FileText className="w-4 h-4" /></div>
      <input value={title} onChange={(e) => onTitleChange(e.target.value)} className="flex-1 bg-transparent text-lg font-bold focus:outline-none placeholder:text-[var(--muted-foreground)]/50" placeholder="Untitled Document" />
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>
      <span className="text-xs text-[var(--muted-foreground)]">{wordCount} words</span>
      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        {saving ? <><Loader2 className="w-3 h-3 animate-spin" />Saving...</> : <><Check className="w-3 h-3 text-emerald-400" />Saved</>}
      </div>
    </div>
  );
}

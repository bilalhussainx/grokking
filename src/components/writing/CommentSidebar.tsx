"use client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Bot, User, CheckCircle2 } from "lucide-react";
import type { DocumentComment } from "@/types/writing";

export default function CommentSidebar({ comments, onResolve }: { comments: DocumentComment[]; onResolve: (id: string) => void }) {
  const unresolved = comments.filter((c) => !c.resolved);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <MessageCircle className="w-4 h-4 text-violet-400" /><span className="text-sm font-semibold">Comments</span>
        {unresolved.length > 0 && <span className="ml-auto flex items-center justify-center h-5 min-w-[20px] rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold px-1.5">{unresolved.length}</span>}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        <AnimatePresence>
          {unresolved.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ delay: i * 0.03 }} className="rounded-xl bg-white/5 border border-white/[0.06] p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {c.author_type === "ai" ? <Bot className="w-3 h-3 text-blue-400" /> : <User className="w-3 h-3 text-[var(--muted-foreground)]" />}
                  <span className="text-[10px] font-semibold text-[var(--muted-foreground)]">{c.author_type === "ai" ? "AI Assistant" : c.author_name || "Teacher"}</span>
                </div>
                <button onClick={() => onResolve(c.id)} title="Resolve" className="rounded-md p-1 hover:bg-white/10 transition-colors text-[var(--muted-foreground)] hover:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-xs leading-relaxed">{c.content}</p>
              <span className="text-[9px] text-[var(--muted-foreground)] mt-1.5 block">{new Date(c.created_at).toLocaleString()}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {unresolved.length === 0 && <div className="text-center py-8 text-[var(--muted-foreground)]"><CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-xs">All comments resolved</p></div>}
      </div>
    </div>
  );
}

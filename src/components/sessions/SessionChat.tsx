"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare, Code2 } from "lucide-react";
import type { SessionMessage } from "@/types/sessions";

export default function SessionChat({ messages, onSendMessage, currentUserId, typingUsers = [] }: { messages: SessionMessage[]; onSendMessage: (content: string, type?: string) => void; currentUserId: string; typingUsers?: string[] }) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => { if (!input.trim()) return; onSendMessage(input.trim()); setInput(""); };
  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <MessageSquare className="w-4 h-4 text-blue-400" /><span className="text-sm font-semibold">Chat</span>
        <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">{messages.length} messages</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isOwn = msg.user_id === currentUserId;
            if (msg.message_type === "system") return <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center"><span className="text-[10px] text-[var(--muted-foreground)] bg-white/5 rounded-full px-3 py-1">{msg.content}</span></motion.div>;
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%]`}>
                  {!isOwn && <span className="text-[10px] text-[var(--muted-foreground)] mb-0.5 block">{msg.sender_name || "User"}</span>}
                  <div className={`rounded-2xl px-3.5 py-2 text-sm ${isOwn ? "bg-blue-500/20 text-blue-100 rounded-br-md" : "bg-white/8 rounded-bl-md"} ${msg.message_type === "code_share" ? "font-mono text-xs" : ""}`}>
                    {msg.message_type === "code_share" ? <pre className="whitespace-pre-wrap">{msg.content}</pre> : msg.content}
                  </div>
                  <span className="text-[9px] text-[var(--muted-foreground)] mt-0.5 block">{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {typingUsers.length > 0 && <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2"><span className="flex gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} /></span>{typingUsers.join(", ")} typing...</div>}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex gap-2">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} placeholder="Type a message..." rows={1} className="glass-input flex-1 rounded-xl px-3.5 py-2.5 text-sm resize-none" />
          <button onClick={send} disabled={!input.trim()} className="rounded-xl bg-blue-500/20 px-3 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-30"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

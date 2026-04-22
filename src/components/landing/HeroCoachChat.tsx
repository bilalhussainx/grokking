"use client";

// Landing hero embedded chat. Replaces the right half of the hero on desktop,
// full-width on mobile. Uses the same /api/cc/coach/message streaming endpoint
// as the in-product coach, but without the right-drawer chrome.
//
// Guests get a real Supabase anonymous session on first message so the
// conversation persists if they upgrade. Exceeding the guest cap (20 messages)
// returns 402 — handled by useFetchWithUpgrade which opens the UpgradeModal.
//
// Plan: docs/superpowers/plans/2026-04-22-guest-trial-funnel.md § 8.2
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGuestSession } from "@/lib/guest-session";
import { useUpgradeGate } from "@/hooks/useFetchWithUpgrade";
import SignupSoftPrompt from "@/components/landing/SignupSoftPrompt";

interface Msg {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const SEED_ASSISTANT: Msg = {
  id: "seed",
  role: "assistant",
  content:
    "Tell me the schools you're considering — I'll tell you honestly if they're reach, match, or safety for you.",
};

const SOFT_PROMPT_AFTER = 3; // show signup nudge after 3 user messages

export default function HeroCoachChat() {
  const { userId, isAnonymous, isReady } = useGuestSession();
  const { fetchWithUpgrade } = useUpgradeGate();
  const [messages, setMessages] = useState<Msg[]>([SEED_ASSISTANT]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSoftPrompt, setShowSoftPrompt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    // External signup prompt — fired by UpgradeModal's "Sign up free" action.
    const onPrompt = () => setShowSoftPrompt(true);
    window.addEventListener("kairos:signup-prompt", onPrompt);
    return () => window.removeEventListener("kairos:signup-prompt", onPrompt);
  }, []);

  async function send(text: string) {
    if (!text.trim() || isStreaming || !isReady) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantMsg: Msg = { id: crypto.randomUUID(), role: "assistant", content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetchWithUpgrade("/api/cc/coach/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          page_context: "/landing",
          source_event: "hero-chat",
        }),
      });

      if (res.status === 402) {
        // useFetchWithUpgrade already opened the UpgradeModal. Strip the
        // placeholder assistant bubble so the chat returns to idle.
        setMessages((prev) => prev.filter((m) => m.id !== assistantMsg.id));
        return;
      }
      if (!res.ok || !res.body) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, content: "Hmm, I had trouble responding. Try again?" }
              : m
          )
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsg.id ? { ...m, content: m.content + data.text } : m
                )
              );
            }
          } catch {
            // skip malformed chunk
          }
        }
      }
    } finally {
      setIsStreaming(false);
    }
  }

  useEffect(() => {
    const userMessages = messages.filter((m) => m.role === "user").length;
    if (userMessages >= SOFT_PROMPT_AFTER && isAnonymous) {
      setShowSoftPrompt(true);
    }
  }, [messages, isAnonymous]);

  return (
    <div
      className="relative w-full max-w-md mx-auto rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl overflow-hidden"
      style={{ boxShadow: "0 20px 60px rgba(212, 175, 55, 0.08)" }}
    >
      <div className="px-5 pt-4 pb-3 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8a6d1f] flex items-center justify-center text-black font-semibold text-sm">
          K
        </div>
        <div className="text-sm">
          <div className="font-medium text-white">Coach Kairos</div>
          <div className="text-white/50 text-xs">Free to try · No signup</div>
        </div>
      </div>

      <div ref={scrollRef} className="px-5 py-4 h-80 overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${
                m.role === "user"
                  ? "bg-[#D4AF37] text-black whitespace-pre-wrap"
                  : "bg-white/5 text-white/90 border border-white/10"
              }`}
            >
              {m.role === "assistant" ? (
                m.content ? (
                  <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_p]:leading-relaxed [&_a]:text-[#E0BC4C] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#D4AF37] [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0 [&_strong]:text-white">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className="text-white/50">{isStreaming ? "…" : ""}</span>
                )
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
      </div>

      {showSoftPrompt && isAnonymous && (
        <SignupSoftPrompt onDismiss={() => setShowSoftPrompt(false)} />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="px-5 py-4 border-t border-white/10 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isReady ? "Type a school name or question…" : "Starting your session…"}
          disabled={!isReady || isStreaming}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]/50"
        />
        <button
          type="submit"
          disabled={!input.trim() || !isReady || isStreaming}
          className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E0BC4C] transition-colors"
        >
          Send
        </button>
      </form>

      <div className="px-5 pb-3 text-[11px] text-white/40 text-center">
        {userId && isAnonymous ? "Your answers save automatically — upgrade anytime." : null}
      </div>
    </div>
  );
}

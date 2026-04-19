"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface BrainstormChatProps {
  essayId: string;
  initialTranscript: Message[];
  onAdvanceToOutline: (themes: string[]) => void;
}

export default function BrainstormChat({
  essayId,
  initialTranscript,
  onAdvanceToOutline,
}: BrainstormChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialTranscript);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && !startedRef.current) {
      startedRef.current = true;
      sendMessage("Hi, I'm ready to brainstorm my essay.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (text: string) => {
    if (streaming) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch(`/api/cc/essays/${essayId}/brainstorm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: err.error || "Something went wrong." },
        ]);
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let aiText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiText };
          return updated;
        });
      }

      if (aiText.toLowerCase().includes("theme:") || aiText.toLowerCase().includes("theme 1")) {
        setShowThemePicker(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  const extractThemes = (): string[] => {
    const lastAi = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAi) return [];
    const themeMatches = lastAi.content.match(/Theme[:\s]*[^.\n]+/gi) || [];
    return themeMatches.map((t) => t.replace(/^Theme[:\s]*/i, "").trim());
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#D4AF37]/20 text-white"
                  : "bg-white/5 text-white/80 border border-white/10"
              }`}
            >
              {msg.content || (
                <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {showThemePicker && (
        <div className="px-4 py-3 border-t border-white/10 bg-white/5">
          <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Select 1-2 themes to develop:
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {extractThemes().map((theme) => (
              <button
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedThemes.includes(theme)
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                    : "bg-white/5 text-white/60 border border-white/10 hover:text-white/80"
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
          {selectedThemes.length > 0 && (
            <button
              onClick={() => onAdvanceToOutline(selectedThemes)}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030]"
            >
              Continue to Outline
            </button>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-white/10 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts..."
          disabled={streaming}
          className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || streaming}
          className="p-2 rounded-xl bg-[#D4AF37] text-black disabled:opacity-40 hover:bg-[#C4A030] transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

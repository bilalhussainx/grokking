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

// Parses "<<THEMES_READY>>\n- a\n- b\n<<END_THEMES>>" out of the AI reply.
// Falls back to detecting a markdown-numbered/bulleted theme list when the model
// skips the structured tags (it happens — "1. **Theme** — description").
// Returns { displayText, themes } where displayText has the tag block stripped
// (markdown fallback leaves displayText as-is so the chat still reads naturally).
function parseThemesBlock(text: string): { displayText: string; themes: string[] } {
  const tagged = text.match(/<<THEMES_READY>>([\s\S]*?)<<END_THEMES>>/);
  if (tagged) {
    const themes = tagged[1]
      .split("\n")
      .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
      .filter((line) => line.length > 0);
    const displayText = text
      .replace(/<<THEMES_READY>>[\s\S]*?<<END_THEMES>>\s*/, "")
      .trim();
    return { displayText, themes };
  }

  // Markdown fallback: look for 2+ "1. **Label**" or "- **Label**" items AND a
  // choice cue ("which feels most", "which resonates", "pick one", etc.).
  const choiceCue =
    /\b(which|pick|choose)\b[^\n?]*\b(feels|resonates|sounds|most|one)\b/i.test(text);
  if (!choiceCue) return { displayText: text, themes: [] };

  // Capture the full line after the list marker so themes include the descriptor
  // (e.g. "Sandbox-to-deployment — the frustration with small models...").
  const itemRe = /^\s*(?:\d+[.)]|[-*])\s+(.+?)\s*$/gm;
  const matches = [...text.matchAll(itemRe)].filter((m) => /\*\*/.test(m[1]));
  if (matches.length < 2) return { displayText: text, themes: [] };

  const themes = matches
    .map((m) => m[1].replace(/\*\*/g, "").trim())
    .filter((t) => t.length > 0);
  return { displayText: text, themes };
}

function normalizeTranscript(raw: unknown): Message[] {
  if (Array.isArray(raw)) {
    return raw.filter(
      (m): m is Message =>
        m != null &&
        typeof m === "object" &&
        "role" in m &&
        "content" in m &&
        typeof (m as { content: unknown }).content === "string",
    );
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return normalizeTranscript(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

export default function BrainstormChat({
  essayId,
  initialTranscript,
  onAdvanceToOutline,
}: BrainstormChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => normalizeTranscript(initialTranscript));
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const userTurnCount = messages.filter((m) => m.role === "user").length;

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

  // Re-parse themes whenever the transcript changes (handles reload from DB too).
  useEffect(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role !== "assistant") continue;
      const parsed = parseThemesBlock(messages[i].content);
      if (parsed.themes.length > 0) {
        setThemes(parsed.themes);
        return;
      }
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (streaming) return;
    setErrorBanner(null);
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
        const err = await res.json().catch(() => ({ error: `Request failed (${res.status})` }));
        setErrorBanner(err.error || "Something went wrong.");
        setMessages((prev) => prev.slice(0, -1)); // roll back optimistic user msg
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
        const parsed = parseThemesBlock(aiText);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: parsed.displayText };
          return updated;
        });
      }
    } catch {
      setErrorBanner("Connection error. Please try again.");
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme],
    );
  };

  // UI-side fallback: after 4 user turns, let the student force a theme surface
  // if the AI hasn't emitted the block yet.
  const showForceThemesButton = userTurnCount >= 4 && themes.length === 0 && !streaming;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
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

      {errorBanner && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20 text-xs text-red-300">
          {errorBanner}
        </div>
      )}

      {themes.length > 0 && (
        <div className="px-4 py-3 border-t border-white/10 bg-white/5">
          <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Select 1-2 themes to develop:
          </p>
          <div className="flex flex-col gap-2 mb-3">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`text-left px-3 py-2 rounded-lg text-xs leading-relaxed transition-colors ${
                  selectedThemes.includes(theme)
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                    : "bg-white/5 text-white/70 border border-white/10 hover:text-white/90 hover:bg-white/[0.07]"
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

      {showForceThemesButton && (
        <div className="px-4 py-2 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={() =>
              sendMessage(
                "I think I've shared enough — please surface 2-3 concrete themes I could develop.",
              )
            }
            className="text-xs text-[#D4AF37] hover:text-[#C4A030] underline"
          >
            I&apos;ve said enough — show me themes
          </button>
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

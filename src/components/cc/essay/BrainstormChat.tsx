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
// Falls back to detecting a numbered/bulleted theme list when the model skips
// the structured tags.
// Returns { displayText, themes, awaitingThemes } where:
//   - displayText has the tag block stripped (fallback leaves it as-is)
//   - themes is the extracted list (empty if none found)
//   - awaitingThemes is true when the AI clearly said themes are coming but
//     the parser couldn't find them — triggers a UI recovery prompt.
function parseThemesBlock(text: string): {
  displayText: string;
  themes: string[];
  awaitingThemes: boolean;
} {
  const tagged = text.match(/<<THEMES_READY>>([\s\S]*?)<<END_THEMES>>/);
  if (tagged) {
    const themes = tagged[1]
      .split("\n")
      .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
      .filter((line) => line.length > 0);
    const displayText = text
      .replace(/<<THEMES_READY>>[\s\S]*?<<END_THEMES>>\s*/, "")
      .trim();
    return { displayText, themes, awaitingThemes: false };
  }

  // Choice cue: "which of these...", "pick one", "which resonates", etc.
  // If the AI also says "I have enough"/"here are" the themes SHOULD be present.
  const choiceCue =
    /\b(which|pick|choose)\b[^\n?]*\b(feels|resonates|sounds|most|one|these)\b/i.test(text) ||
    /\b(here are|i have enough|surface.*themes|three concrete themes|two concrete themes)\b/i.test(text);

  // Numbered/bulleted list — allow items WITH OR WITHOUT **bold** markers so we
  // catch "1. The violin as identity" as well as "1. **Violin** — identity".
  const itemRe = /^\s*(?:\d+[.)]|[-*•])\s+(.+?)\s*$/gm;
  const matches = [...text.matchAll(itemRe)];

  if (matches.length >= 2) {
    const themes = matches
      .map((m) => m[1].replace(/\*\*/g, "").replace(/^["'`]|["'`]$/g, "").trim())
      .filter((t) => t.length > 0 && t.length < 200); // drop paragraphs
    return { displayText: text, themes, awaitingThemes: false };
  }

  // Choice cue with no parseable list → AI promised themes but forgot to write
  // them. The UI surfaces a one-click recovery so the student isn't stuck.
  return { displayText: text, themes: [], awaitingThemes: choiceCue };
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
  const [awaitingThemes, setAwaitingThemes] = useState(false);
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
  // Also track the "AI promised themes but didn't list them" state so the UI can
  // surface a recovery prompt.
  useEffect(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role !== "assistant") continue;
      const parsed = parseThemesBlock(messages[i].content);
      if (parsed.themes.length > 0) {
        setThemes(parsed.themes);
        setAwaitingThemes(false);
        return;
      }
      if (parsed.awaitingThemes) {
        setAwaitingThemes(true);
        return;
      }
    }
    setAwaitingThemes(false);
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

  // Specific recovery: AI said "which of these" / "I have enough" but the parser
  // found no theme list. Surface a clearer banner with a one-click resend.
  const showAwaitingRecovery = awaitingThemes && themes.length === 0 && !streaming;

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

      {showAwaitingRecovery && (
        <div className="px-4 py-3 border-t border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-white/80 leading-relaxed mb-2">
              The coach mentioned themes but didn&apos;t list them. Ask it to write them out.
            </p>
            <button
              onClick={() =>
                sendMessage(
                  "Please list the 2-3 concrete themes now as a numbered list — one theme per line, under 15 words each.",
                )
              }
              className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] transition-colors"
            >
              List the themes
            </button>
          </div>
        </div>
      )}

      {showForceThemesButton && !showAwaitingRecovery && (
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

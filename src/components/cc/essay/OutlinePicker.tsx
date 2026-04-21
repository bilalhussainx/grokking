"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Loader2, Send, Sparkles, Wand2 } from "lucide-react";

interface OutlineSection {
  label: string;
  bullets: string[];
  wordBudget: number;
}

interface OutlineOption {
  title: string;
  sections: OutlineSection[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface OutlinePickerProps {
  essayId: string;
  selectedThemes: string[];
  existingOutline?: OutlineOption | null;
  onOutlineSaved: (outline: OutlineOption) => void;
}

function stripReadyTag(text: string): { display: string; ready: boolean } {
  const ready = /<<READY_TO_DRAFT>>/.test(text);
  const display = text.replace(/<<READY_TO_DRAFT>>/g, "").trim();
  return { display, ready };
}

export default function OutlinePicker({
  essayId,
  selectedThemes,
  existingOutline,
  onOutlineSaved,
}: OutlinePickerProps) {
  const [outlines, setOutlines] = useState<OutlineOption[]>(
    existingOutline ? [existingOutline] : []
  );
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(existingOutline ? 0 : null);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(Boolean(existingOutline));
  const [saveError, setSaveError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Discussion chat state
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatStreaming, setChatStreaming] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [coachReady, setCoachReady] = useState(false);
  const [refineLoading, setRefineLoading] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const outlinesTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const generateOutlines = async () => {
    setLoading(true);
    setGenerateError(null);
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", selectedThemes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error || `Failed (${res.status})`);
      } else if (data.outlines) {
        setOutlines(data.outlines);
        setGenerated(true);
        // Seed a welcome message from the coach
        setChat([
          {
            role: "assistant",
            content:
              "I've drafted 3 outline options based on your brainstorm. Want to talk through which one fits best, or do you already have a favorite?",
          },
        ]);
      } else {
        setGenerateError("No outlines returned. Try again.");
      }
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  };

  const saveOutline = async () => {
    if (selected === null) return;
    setSaving(true);
    setSaveError(null);
    const outline = outlines[selected];
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/outline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", outline }),
      });
      const data = await res.json();
      if (!res.ok || !data.saved) {
        setSaveError(data.error || `Save failed (${res.status})`);
      } else {
        onOutlineSaved(outline);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSaving(false);
    }
  };

  const sendChat = async (text: string) => {
    if (chatStreaming || !text.trim()) return;
    setChatError(null);
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const historyForServer = chat;
    setChat((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setChatInput("");
    setChatStreaming(true);

    try {
      const res = await fetch(`/api/cc/essays/${essayId}/outline/discuss`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          outlines,
          selectedThemes,
          history: historyForServer,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Request failed (${res.status})` }));
        setChatError(err.error || "Coach unavailable");
        setChat((prev) => prev.slice(0, -2));
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let aiText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        const { display, ready } = stripReadyTag(aiText);
        if (ready) setCoachReady(true);
        setChat((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: display };
          return updated;
        });
      }
    } catch {
      setChatError("Connection error");
    } finally {
      setChatStreaming(false);
    }
  };

  const refineOutline = async () => {
    if (refineLoading || chatStreaming) return;
    setRefineLoading(true);
    setRefineError(null);
    try {
      const res = await fetch(`/api/cc/essays/${essayId}/outline/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outlines,
          selectedThemes,
          history: chat,
          userGuidance: chatInput.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.outline) {
        setRefineError(data.error || `Refine failed (${res.status})`);
        return;
      }
      const newIndex = outlines.length;
      setOutlines((prev) => [...prev, data.outline as OutlineOption]);
      setSelected(newIndex);
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've drafted a refined option — ${data.outline.title}. It's now selected on the left; review the sections and hit "Use This Outline → Draft" when you're happy.`,
        },
      ]);
      setChatInput("");
      setTimeout(() => outlinesTopRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : "Network error");
    } finally {
      setRefineLoading(false);
    }
  };

  if (!generated) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <p className="text-sm text-white/50 mb-2">
          Themes: {selectedThemes.join(", ") || "(none selected)"}
        </p>
        <button
          onClick={generateOutlines}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Generating outlines..." : "Generate 3 Outline Options"}
        </button>
        {generateError && (
          <p className="text-xs text-red-400 mt-3">{generateError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left: outline options */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div ref={outlinesTopRef} />
          <p className="text-xs text-white/40">Pick an outline structure for your essay:</p>

          <div className="grid gap-4">
            {outlines.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selected === i
                    ? "border-[#D4AF37]/40 bg-[#D4AF37]/5"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">{opt.title}</h3>
                  {selected === i && <Check className="w-4 h-4 text-[#D4AF37]" />}
                </div>
                <div className="space-y-2">
                  {opt.sections.map((sec, j) => (
                    <div key={j}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/60">{sec.label}</span>
                        <span className="text-[10px] text-white/30">~{sec.wordBudget} words</span>
                      </div>
                      <ul className="ml-3 mt-1 space-y-0.5">
                        {sec.bullets.map((b, k) => (
                          <li key={k} className="text-xs text-white/50">
                            - {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sticky footer with CTA + errors */}
        <div className="border-t border-white/10 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm px-4 py-3">
          {saveError && (
            <p className="text-xs text-red-400 mb-2">{saveError}</p>
          )}
          {coachReady && selected !== null && (
            <p className="text-[11px] text-[#D4AF37]/80 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Coach thinks you&apos;re ready to draft.
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-white/40">
              {selected === null
                ? "Select an option above, or ask the coach for help →"
                : `Selected: ${outlines[selected].title}`}
            </p>
            <button
              onClick={saveOutline}
              disabled={saving || selected === null}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Use This Outline → Draft"}
            </button>
          </div>
        </div>
      </div>

      {/* Right: discussion chat */}
      <div className="w-96 shrink-0 flex flex-col">
        <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs font-medium text-white/70">Outline Coach</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {chat.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-[#D4AF37]/20 text-white"
                    : "bg-white/5 text-white/80 border border-white/10"
                }`}
              >
                {m.content || (
                  <span className="inline-block w-3 h-3 border-2 border-white/20 border-t-[#D4AF37] rounded-full animate-spin" />
                )}
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
        {chatError && (
          <div className="px-3 py-2 border-t border-red-500/20 bg-red-500/10 text-[11px] text-red-300">
            {chatError}
          </div>
        )}
        {refineError && (
          <div className="px-3 py-2 border-t border-red-500/20 bg-red-500/10 text-[11px] text-red-300">
            {refineError}
          </div>
        )}
        {chat.length >= 2 && (
          <div className="px-3 py-2 border-t border-white/10 bg-white/[0.02]">
            <button
              type="button"
              onClick={refineOutline}
              disabled={refineLoading || chatStreaming}
              className="w-full px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-medium hover:bg-[#D4AF37]/20 disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {refineLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3" />
              )}
              {refineLoading ? "Refining…" : "Refine into a new outline from this discussion"}
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendChat(chatInput);
          }}
          className="px-3 py-2 border-t border-white/10 flex items-center gap-2"
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about the outlines..."
            disabled={chatStreaming}
            className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || chatStreaming}
            className="p-1.5 rounded-lg bg-[#D4AF37] text-black disabled:opacity-40 hover:bg-[#C4A030]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

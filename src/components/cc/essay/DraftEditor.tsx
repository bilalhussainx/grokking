"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles, Loader2, Send, History, MessageCircle } from "lucide-react";
import DraftVersions from "./DraftVersions";

interface OutlineSection {
  label: string;
  bullets: string[];
  wordBudget: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface DraftEditorProps {
  essayId: string;
  initialDraft: string;
  wordLimit: number;
  outline: { sections: OutlineSection[] } | null;
  selectedThemes?: string[];
  onRequestReview: (draftText: string) => void;
}

export default function DraftEditor({
  essayId,
  initialDraft,
  wordLimit,
  outline,
  selectedThemes,
  onRequestReview,
}: DraftEditorProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [requestingReview, setRequestingReview] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Coach chat
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I'll read your draft as you write. Ask me about grammar, phrasing, paragraph flow, or whether you're on track with the outline.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatStreaming, setChatStreaming] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [sidePanel, setSidePanel] = useState<"coach" | "versions">("coach");

  const countWords = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    setWordCount(countWords(draft));
  }, [draft]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
        const pending = draftRef.current;
        if (pending !== initialDraft) {
          fetch(`/api/cc/essays/${essayId}/draft`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: pending }),
            keepalive: true,
          }).catch(() => {});
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [essayId]);

  const saveDraft = useCallback(
    async (content: string) => {
      setSaving(true);
      try {
        await fetch(`/api/cc/essays/${essayId}/draft`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
      } catch {
        // silent
      } finally {
        setSaving(false);
      }
    },
    [essayId]
  );

  const handleChange = (text: string) => {
    setDraft(text);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(text), 3000);
  };

  const handleRestoreVersion = (content: string) => {
    setDraft(content);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(content), 500);
  };

  const handleRequestReview = async () => {
    if (requestingReview) return;
    setRequestingReview(true);
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    try {
      await saveDraft(draft);
      onRequestReview(draft);
    } finally {
      setRequestingReview(false);
    }
  };

  const sendChat = async (text: string) => {
    if (chatStreaming || !text.trim()) return;
    setChatError(null);
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const historyForServer = chat;
    // Flush any pending save so the server sees the latest draft
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    await saveDraft(draft);

    setChat((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setChatInput("");
    setChatStreaming(true);

    try {
      const res = await fetch(`/api/cc/essays/${essayId}/draft/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          draftText: draft,
          selectedThemes: selectedThemes || [],
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
        setChat((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiText };
          return updated;
        });
      }
    } catch {
      setChatError("Connection error");
    } finally {
      setChatStreaming(false);
    }
  };

  const askAboutDraft = (preset: string) => {
    if (chatStreaming) return;
    sendChat(preset);
  };

  const wordCountColor =
    wordCount > wordLimit
      ? "text-red-400"
      : wordCount > wordLimit * 0.9
        ? "text-amber-400"
        : "text-white/40";

  return (
    <div className="flex h-full">
      {outline && (
        <div className="w-56 shrink-0 border-r border-white/10 p-4 overflow-y-auto hidden md:block">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
            Outline
          </h3>
          {outline.sections.map((sec, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-white/60">{sec.label}</span>
                <span className="text-[10px] text-white/30">~{sec.wordBudget}w</span>
              </div>
              <ul className="mt-1 space-y-0.5">
                {sec.bullets.map((b, j) => (
                  <li key={j} className="text-[11px] text-white/40">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4">
          <textarea
            value={draft}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Start writing your essay..."
            className="w-full h-full resize-none bg-transparent text-white text-sm leading-7 placeholder:text-white/20 focus:outline-none"
          />
        </div>

        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`text-xs font-mono ${wordCountColor}`}>
              {wordCount} / {wordLimit}
            </span>
            {saving && <span className="text-[10px] text-white/20">Saving...</span>}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestReview}
              disabled={wordCount < 100 || requestingReview}
              className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] disabled:opacity-40 flex items-center gap-1.5"
            >
              {requestingReview && <Loader2 className="w-3 h-3 animate-spin" />}
              {requestingReview ? "Saving…" : "Request Review"}
            </button>
          </div>
        </div>
      </div>

      {/* Side panel: coach / versions */}
      <div className="w-96 shrink-0 border-l border-white/10 flex flex-col">
        <div className="border-b border-white/10 flex">
          <button
            type="button"
            onClick={() => setSidePanel("coach")}
            className={`flex-1 px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
              sidePanel === "coach"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Coach
          </button>
          <button
            type="button"
            onClick={() => setSidePanel("versions")}
            className={`flex-1 px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
              sidePanel === "versions"
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Versions
          </button>
        </div>

        {sidePanel === "versions" && (
          <DraftVersions
            essayId={essayId}
            currentDraft={draft}
            onRestore={handleRestoreVersion}
          />
        )}

        {sidePanel === "coach" && (
        <>
        <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs font-medium text-white/70">Draft Coach</span>
        </div>

        <div className="px-3 py-2 border-b border-white/10 bg-white/[0.02] flex flex-wrap gap-1.5">
          <button
            type="button"
            disabled={chatStreaming || wordCount < 30}
            onClick={() => askAboutDraft("How's the flow between paragraphs in what I've written so far?")}
            className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white/90 disabled:opacity-30"
          >
            Flow & continuity
          </button>
          <button
            type="button"
            disabled={chatStreaming || wordCount < 30}
            onClick={() => askAboutDraft("Am I staying consistent with my chosen themes and the outline?")}
            className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white/90 disabled:opacity-30"
          >
            Theme check
          </button>
          <button
            type="button"
            disabled={chatStreaming || wordCount < 30}
            onClick={() => askAboutDraft("Any grammar or phrasing issues I should fix? Flag the paragraph and issue, don't rewrite.")}
            className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white/90 disabled:opacity-30"
          >
            Grammar & phrasing
          </button>
          <button
            type="button"
            disabled={chatStreaming || wordCount < 30}
            onClick={() => askAboutDraft("Where am I telling instead of showing? Point to specific paragraphs.")}
            className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/60 hover:text-white/90 disabled:opacity-30"
          >
            Show don&apos;t tell
          </button>
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
            placeholder="Ask about your draft..."
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
        </>
        )}
      </div>
    </div>
  );
}

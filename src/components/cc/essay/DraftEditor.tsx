"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Sparkles, Loader2, Send, History, MessageSquare, BookOpen, ArrowRight, Type,
  PenLine, Lightbulb,
} from "lucide-react";
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

// ─────────────────────────────────────────────────────────────────────────
// Coach prompt library — grouped like a PhD English teacher's rubric.
// Each entry maps a human-readable chip label to the question we send as
// the student's message. Keeping them out here keeps JSX readable.
// ─────────────────────────────────────────────────────────────────────────

type PromptGroup = {
  id: string;
  label: string;
  hint: string;
  prompts: { label: string; message: string }[];
};

const COACH_PROMPT_GROUPS: PromptGroup[] = [
  {
    id: "structure",
    label: "Structure",
    hint: "Macro moves — does the essay's architecture hold?",
    prompts: [
      {
        label: "Opening hook",
        message:
          "Read my first 30-50 words. Does the opening pull the reader into a specific scene or idea, or does it feel generic? If it's weak, flag the exact phrase that loses me.",
      },
      {
        label: "Prompt fit",
        message:
          "Am I actually answering the Common App prompt, or have I drifted into a related-but-different story? If I've drifted, point to the paragraph where the drift starts.",
      },
      {
        label: "Flow & continuity",
        message:
          "Walk through the paragraph-to-paragraph transitions. Which jumps feel abrupt or unearned? Flag the paragraph boundary and suggest one connective phrase — do NOT rewrite the paragraphs.",
      },
      {
        label: "Pacing",
        message:
          "Which section runs too long for what it accomplishes, and which section is too short and skips past a meaningful beat? Name the section and say which.",
      },
      {
        label: "Ending beat",
        message:
          "Does my last 2-3 sentences linger or fizzle? A strong ending either echoes an image from the opening, leaves a question open, or lands on a specific image. Which does mine do, and if none, what's the weakest link?",
      },
      {
        label: "Bookend symmetry",
        message:
          "Do my opening and closing sections talk to each other? If there's a way to echo an image, phrase, or question from the opening in the closing, flag it — but only if it would feel earned, not cute.",
      },
    ],
  },
  {
    id: "voice",
    label: "Voice",
    hint: "Does this sound like me — a 17-year-old writing honestly — or does it sound like a college-essay template?",
    prompts: [
      {
        label: "Show don't tell",
        message:
          "Where am I telling instead of showing? Point to specific paragraphs where I'm naming an emotion or idea abstractly, and suggest the concrete detail that could replace it — do NOT write new prose.",
      },
      {
        label: "Voice authenticity",
        message:
          "Does this sound like a 17-year-old writing honestly, or like an adult consultant wrote it? Flag any sentence that reads as too polished, too generic, or uses vocabulary my teacher would not recognize from me.",
      },
      {
        label: "Cliché audit",
        message:
          "Flag any tired admissions-essay phrases — passion for, ever since I was young, learned the value of, grateful for the opportunity, stepped out of my comfort zone, etc. List the exact phrases and where they appear.",
      },
      {
        label: "Vulnerability check",
        message:
          "Am I protecting myself behind intellect, abstraction, or activity-list tone? Where could I be one degree more honest — even if it's uncomfortable? Flag a specific moment, don't lecture me about honesty in general.",
      },
    ],
  },
  {
    id: "depth",
    label: "Depth",
    hint: "Is the 'so what' of this essay earned, and can a reader see me on the page?",
    prompts: [
      {
        label: "Theme coherence",
        message:
          "Am I staying on one through-line, or am I trying to cover too many themes at once? If it's the latter, name the dominant theme and which paragraphs weaken it by introducing a second thread.",
      },
      {
        label: "Reflection depth",
        message:
          "Is my reflection earned by the scene, or does it feel like a moral tacked onto the end? Flag any reflection that names a lesson without the narrative paying for it.",
      },
      {
        label: "Character on the page",
        message:
          "After reading this, what would an admissions officer actually know about me as a person — not my achievements, but my mind, my contradictions, what I care about? If the answer is fuzzy, say what's missing.",
      },
      {
        label: "Scene specificity",
        message:
          "Where do I reach for a generic image when a sensory detail (what I heard, saw, touched, smelled) would land harder? Flag the paragraph and propose the type of detail — do not invent one for me.",
      },
      {
        label: "Activities-list redundancy",
        message:
          "Is anything in my essay already implied by or duplicated in my Common App activities list (awards, roles, hours)? The essay should tell admissions something they can't get from the list — flag any overlap.",
      },
    ],
  },
  {
    id: "line",
    label: "Line-level",
    hint: "Sentence-by-sentence craft — grammar, economy, consistency.",
    prompts: [
      {
        label: "Grammar & phrasing",
        message:
          "Any grammar, punctuation, or awkward-phrasing issues? Flag the paragraph, quote the sentence, and describe the issue — do NOT rewrite it for me.",
      },
      {
        label: "Word economy",
        message:
          "Which sentences could be cut or shortened without losing meaning? I want a tighter draft. List up to five specific cuts with the paragraph they're in.",
      },
      {
        label: "Tense & POV consistency",
        message:
          "Do I accidentally shift tense (past ↔ present) or point of view (I ↔ we ↔ you) anywhere? Flag the exact sentences where it happens.",
      },
      {
        label: "Adjective / adverb audit",
        message:
          "Am I leaning on adjectives and adverbs when a stronger verb would do the work? Flag specific -ly adverbs and over-modified nouns, and name the verb that could replace them.",
      },
    ],
  },
];

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

  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I'll read your draft as you write. Ask anything, or tap a prompt on the right — I'll flag specific paragraphs rather than rewrite your prose.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatStreaming, setChatStreaming] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [rightTab, setRightTab] = useState<"coach" | "versions" | "prompts">("coach");
  const [activeGroup, setActiveGroup] = useState<string>(COACH_PROMPT_GROUPS[0].id);

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
        /* silent */
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
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    await saveDraft(draft);

    setChat((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setChatInput("");
    setChatStreaming(true);

    // Open coach tab when a prompt is fired from the Prompts tab.
    if (rightTab !== "coach") setRightTab("coach");

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

  const askAboutDraft = (message: string) => {
    if (chatStreaming) return;
    sendChat(message);
  };

  const wordPct = Math.min(100, Math.round((wordCount / wordLimit) * 100));
  const over = wordCount > wordLimit;
  const near = wordCount > wordLimit * 0.9 && !over;
  const wordCountColor = over
    ? "var(--kl-state-reach,#f87171)"
    : near
      ? "#fcd34d"
      : "rgba(255,255,255,0.55)";

  const phaseNodes = [
    { n: "01", label: "Brainstorm", status: "is-done" as const, meta: "Complete" },
    {
      n: "02", label: "Outline", status: "is-done" as const,
      meta: outline ? `${outline.sections.length} sections locked` : "Complete",
    },
    {
      n: "03", label: "Draft", status: "is-active" as const,
      meta: `${wordCount} / ${wordLimit} words`,
      pct: Math.max(wordPct, 8),
    },
    { n: "04", label: "Revise", status: "is-locked" as const, meta: "Next up" },
  ];

  const reviewDisabled = wordCount < 100 || requestingReview;

  return (
    <div className="kl-surface-app w-full kl-studio-shell" style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
      <PhaseBar nodes={phaseNodes} />

      <div className="kl-bs-subhead">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <span
            className="kl-prompt-badge"
            style={{
              background: "var(--kl-phase-draft-bg, rgba(245,158,11,0.20))",
              color: "var(--kl-phase-draft-fg, #fcd34d)",
              borderColor: "rgba(245,158,11,0.28)",
            }}
          >
            <PenLine className="w-3 h-3" />
            Draft
          </span>
          <div className="min-w-0">
            <div className="text-[13.5px] leading-snug">
              <em className="not-italic text-white/95 font-medium">Write it in your voice.</em>{" "}
              <span className="text-white/45">
                The coach flags paragraphs — it won&rsquo;t rewrite your prose. Autosaves every 3s.
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {saving && (
            <span className="text-[11px] text-white/45 font-mono inline-flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Saving…
            </span>
          )}
          <button
            onClick={handleRequestReview}
            disabled={reviewDisabled}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--kl-gold-app,#D4AF37)] text-black text-[13px] font-semibold hover:bg-[var(--kl-gold-hover-app,#C4A030)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={wordCount < 100 ? "Write at least 100 words first" : undefined}
          >
            {requestingReview && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {requestingReview ? "Submitting…" : "Request review"}
            {!requestingReview && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3-column grid: outline · editor · rail */}
      <div
        className="grid items-start gap-5 kl-studio-grid"
        style={{ gridTemplateColumns: outline ? "240px 1fr 380px" : "1fr 380px" }}
      >
        {outline && (
          <aside
            className="kl-rail-card"
            style={{ position: "sticky", top: 16, maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
          >
            <div className="kl-rail-eyebrow">
              <BookOpen className="w-3 h-3" />
              Your outline
            </div>
            <div className="flex flex-col gap-3 mt-1">
              {outline.sections.map((sec, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-white/75 uppercase tracking-[0.14em]"
                      style={{ fontFamily: "var(--kl-font-mono, 'JetBrains Mono', monospace)" }}
                    >
                      {sec.label}
                    </span>
                    <span className="text-[10px] text-white/35 tabular-nums">~{sec.wordBudget}w</span>
                  </div>
                  <ul className="flex flex-col gap-0.5">
                    {sec.bullets.map((b, j) => (
                      <li key={j} className="text-[11.5px] text-white/55 leading-snug pl-1">
                        · {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Editor column */}
        <div className="flex flex-col gap-3 min-w-0">
          <div
            className="rounded-2xl flex flex-col"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
              minHeight: "calc(100vh - 300px)",
            }}
          >
            <textarea
              value={draft}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Start writing your essay…"
              className="flex-1 w-full resize-none bg-transparent text-white text-[15px] leading-[1.75] placeholder:text-white/25 focus:outline-none"
              style={{ padding: "24px 28px", minHeight: "400px" }}
            />
            {/* Word-count progress rail */}
            <div
              className="flex items-center gap-4"
              style={{
                padding: "12px 20px",
                borderTop: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
              }}
            >
              <span
                className="font-mono text-[12px] tabular-nums"
                style={{ color: wordCountColor }}
              >
                {wordCount} / {wordLimit}
              </span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${wordPct}%`,
                    background: over ? "var(--kl-state-reach,#f87171)" : near ? "#fcd34d" : "var(--kl-gold-app,#D4AF37)",
                  }}
                />
              </div>
              <span className="text-[11px] text-white/35 font-mono">
                {over ? `${wordCount - wordLimit} over` : near ? "near limit" : `${wordLimit - wordCount} left`}
              </span>
            </div>
          </div>
        </div>

        {/* Right rail: tabs */}
        <div className="kl-rail">
          <div className="kl-rail-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={rightTab === "coach"}
              onClick={() => setRightTab("coach")}
              className={`kl-rail-tab ${rightTab === "coach" ? "is-active" : ""}`}
            >
              <MessageSquare className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
              Coach
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={rightTab === "prompts"}
              onClick={() => setRightTab("prompts")}
              className={`kl-rail-tab ${rightTab === "prompts" ? "is-active" : ""}`}
            >
              <Lightbulb className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
              Prompts
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={rightTab === "versions"}
              onClick={() => setRightTab("versions")}
              className={`kl-rail-tab ${rightTab === "versions" ? "is-active" : ""}`}
            >
              <History className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
              Versions
            </button>
          </div>

          {rightTab === "coach" && (
            <CoachPanel
              chat={chat}
              chatInput={chatInput}
              setChatInput={setChatInput}
              chatStreaming={chatStreaming}
              chatError={chatError}
              sendChat={sendChat}
              chatBottomRef={chatBottomRef}
              wordCount={wordCount}
            />
          )}

          {rightTab === "prompts" && (
            <PromptsPanel
              groups={COACH_PROMPT_GROUPS}
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              onPick={askAboutDraft}
              disabled={chatStreaming}
              wordCount={wordCount}
            />
          )}

          {rightTab === "versions" && (
            <div className="kl-rail-card" style={{ padding: 0, overflow: "hidden" }}>
              <DraftVersions
                essayId={essayId}
                currentDraft={draft}
                onRestore={handleRestoreVersion}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────

function PhaseBar({
  nodes,
}: {
  nodes: {
    n: string;
    label: string;
    status: "is-done" | "is-active" | "is-locked";
    meta: string;
    pct?: number;
  }[];
}) {
  return (
    <div className="kl-phase-bar">
      {nodes.map((p) => (
        <div
          key={p.n}
          className={`kl-phase-node ${p.status === "is-active" ? "is-active" : p.status === "is-done" ? "is-done" : ""}`}
        >
          <div className="kl-phase-num">{p.n}</div>
          <div className="kl-phase-label">{p.label}</div>
          <div className="kl-phase-meta">{p.meta}</div>
          {p.status === "is-active" && (
            <div className="kl-phase-fill" style={{ width: `${p.pct ?? 0}%` }} />
          )}
          {p.status === "is-done" && <div className="kl-phase-fill" />}
        </div>
      ))}
    </div>
  );
}

function CoachPanel({
  chat, chatInput, setChatInput, chatStreaming, chatError, sendChat, chatBottomRef, wordCount,
}: {
  chat: ChatMessage[];
  chatInput: string;
  setChatInput: (s: string) => void;
  chatStreaming: boolean;
  chatError: string | null;
  sendChat: (t: string) => void;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  wordCount: number;
}) {
  return (
    <div
      className="kl-rail-card"
      style={{ display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 280px)", overflow: "hidden", padding: 0 }}
    >
      <div className="kl-rail-eyebrow" style={{ padding: "14px 18px 0" }}>
        <Sparkles className="w-3 h-3" />
        Draft coach
      </div>
      <div
        className="flex-1 overflow-y-auto flex flex-col gap-2.5"
        style={{ padding: "10px 18px 14px", minHeight: 240 }}
      >
        {chat.map((m, i) => (
          <div key={i} className={`kl-msg-row ${m.role === "user" ? "is-user" : ""}`} style={{ gap: 8 }}>
            <div
              className={`kl-msg-avatar ${m.role === "user" ? "is-user" : "is-coach"}`}
              style={{ width: 24, height: 24, fontSize: 10 }}
              aria-hidden
            >
              {m.role === "user" ? "S" : "K"}
            </div>
            <div
              className={`kl-msg-bubble ${m.role === "user" ? "is-user" : "is-coach"}`}
              style={{ fontSize: 13, padding: "10px 12px", maxWidth: 280 }}
            >
              {m.content || (
                <span className="inline-block w-3 h-3 border-2 border-white/20 border-t-[var(--kl-gold-app,#D4AF37)] rounded-full animate-spin" />
              )}
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {chatError && (
        <div className="text-[11px] text-red-300 px-4 py-2 border-t border-red-500/20 bg-red-500/10">
          {chatError}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); sendChat(chatInput); }}
        className="flex items-center gap-2"
        style={{ padding: "10px 14px 12px", borderTop: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))" }}
      >
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={wordCount < 30 ? "Write a bit first, then ask…" : "Ask about your draft…"}
          disabled={chatStreaming}
          className="flex-1 px-3 py-1.5 rounded-lg text-[13px] outline-none transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
            color: "#fff",
          }}
        />
        <button
          type="submit"
          disabled={!chatInput.trim() || chatStreaming}
          className="p-2 rounded-lg bg-[var(--kl-gold-app,#D4AF37)] text-black disabled:opacity-40 hover:bg-[var(--kl-gold-hover-app,#C4A030)]"
          aria-label="Send"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

function PromptsPanel({
  groups, activeGroup, setActiveGroup, onPick, disabled, wordCount,
}: {
  groups: PromptGroup[];
  activeGroup: string;
  setActiveGroup: (id: string) => void;
  onPick: (message: string) => void;
  disabled: boolean;
  wordCount: number;
}) {
  const group = groups.find((g) => g.id === activeGroup) ?? groups[0];
  const tooShort = wordCount < 30;

  return (
    <div className="kl-rail-card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="kl-rail-eyebrow" style={{ padding: "14px 18px 0" }}>
        <Type className="w-3 h-3" />
        What admissions readers check
      </div>
      <div className="kl-rail-body" style={{ padding: "0 18px 12px", fontSize: 12 }}>
        A PhD English teacher or admissions counselor doesn&rsquo;t just read for grammar. Tap a
        prompt — the coach will flag specific paragraphs, not rewrite your prose.
      </div>

      {/* Group switcher */}
      <div
        className="flex gap-1 flex-wrap"
        style={{
          padding: "8px 14px",
          borderTop: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
          borderBottom: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
        }}
      >
        {groups.map((g) => {
          const active = g.id === activeGroup;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGroup(g.id)}
              className={`kl-chip ${active ? "is-active" : ""}`}
              style={{ fontSize: 11, padding: "4px 10px" }}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "12px 16px 14px" }}>
        <div className="text-[11.5px] text-white/55 italic mb-3 leading-snug">{group.hint}</div>
        {tooShort && (
          <div
            className="rounded-lg mb-3"
            style={{
              padding: "8px 12px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
              fontSize: 11.5,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Write at least 30 words before asking the coach — otherwise there&rsquo;s nothing to
            critique.
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          {group.prompts.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onPick(p.message)}
              disabled={disabled || tooShort}
              className="w-full text-left inline-flex items-center justify-between gap-3 rounded-lg transition-colors"
              style={{
                padding: "10px 12px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
                color: "rgba(255,255,255,0.82)",
                fontSize: 12.5,
                opacity: disabled || tooShort ? 0.5 : 1,
                cursor: disabled || tooShort ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (disabled || tooShort) return;
                e.currentTarget.style.borderColor = "var(--kl-app-gold-edge, rgba(212,175,55,0.22))";
                e.currentTarget.style.background = "rgba(212,175,55,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--kl-app-border, rgba(255,255,255,0.08))";
                e.currentTarget.style.background = "rgba(255,255,255,0.025)";
              }}
            >
              <span className="font-medium">{p.label}</span>
              <ArrowRight className="w-3 h-3 text-[var(--kl-gold-app,#D4AF37)] shrink-0 opacity-60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

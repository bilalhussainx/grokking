"use client";

import { useState, useRef, useEffect } from "react";
import {
  Check, Loader2, Send, Sparkles, Wand2, ArrowRight, Lightbulb, BookOpen, MessageSquare,
} from "lucide-react";

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
  // Options generated earlier for this essay, restored after a reload so the
  // student doesn't pay to generate them again.
  savedOptions?: OutlineOption[];
  onOutlineSaved: (outline: OutlineOption) => void;
}

function stripReadyTag(text: string): { display: string; ready: boolean } {
  const ready = /<<READY_TO_DRAFT>>/.test(text);
  const display = text.replace(/<<READY_TO_DRAFT>>/g, "").trim();
  return { display, ready };
}

const OPTION_LETTER = ["A", "B", "C", "D", "E"];

// Color-code each outline option with a subtle left rail so three-option
// pickers read at a glance. These blend with the app's gold palette.
const RAIL_COLORS = ["#d4a84b", "#4ade80", "#60a5fa", "#f87171", "#a78bfa"];

export default function OutlinePicker({
  essayId,
  selectedThemes,
  existingOutline,
  savedOptions,
  onOutlineSaved,
}: OutlinePickerProps) {
  const [outlines, setOutlines] = useState<OutlineOption[]>(
    existingOutline ? [existingOutline] : savedOptions ?? []
  );
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(existingOutline ? 0 : null);
  const [saving, setSaving] = useState(false);
  const [generated, setGenerated] = useState(Boolean(existingOutline) || (savedOptions?.length ?? 0) > 0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatStreaming, setChatStreaming] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [coachReady, setCoachReady] = useState(false);
  const [refineLoading, setRefineLoading] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  const [rightTab, setRightTab] = useState<"coach" | "tips">("coach");

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
        setChat([
          {
            role: "assistant",
            content:
              "I've drafted a few outline options based on your brainstorm. Each takes your story in a different direction. Want to talk through which fits best, or already have a favorite?",
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
          content: `I've drafted a refined option — ${data.outline.title}. It's now selected on the left; review the sections and hit "Use this outline → Draft" when you're happy.`,
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

  // Phase bar state — matches BrainstormChat's node taxonomy.
  const outlinePct = (() => {
    if (!generated) return 15; // we're in "ready to generate" state
    if (selected === null) return 55;
    if (coachReady) return 95;
    return 75;
  })();

  const phaseNodes = [
    {
      n: "01", label: "Brainstorm", status: "is-done" as const,
      meta: `${selectedThemes.length} theme${selectedThemes.length === 1 ? "" : "s"} picked`,
    },
    {
      n: "02", label: "Outline", status: "is-active" as const,
      meta: generated
        ? `${outlines.length} option${outlines.length === 1 ? "" : "s"} · ${selected === null ? "pick one" : `selected ${OPTION_LETTER[selected] ?? ""}`}`
        : "Ready to draft options",
      pct: outlinePct,
    },
    { n: "03", label: "Draft",  status: "is-locked" as const, meta: "—" },
    { n: "04", label: "Revise", status: "is-locked" as const, meta: "—" },
  ];

  // Pre-generation view
  if (!generated) {
    return (
      <div className="kl-surface-app w-full kl-studio-shell" style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        <PhaseBar nodes={phaseNodes} />
        <Subhead
          badge="Outline"
          lead="Let's give your story a shape."
          sub="We'll draft 3 structural outlines you can pick from, then refine together."
        />
        <div
          className="flex flex-col items-center justify-center rounded-2xl text-center"
          style={{
            border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
            background: "rgba(255,255,255,0.015)",
            padding: "48px 20px",
          }}
        >
          <div
            className="inline-flex items-center justify-center mb-5"
            style={{
              width: 48, height: 48, borderRadius: 999,
              background: "rgba(212,175,55,0.12)",
              border: "1px solid var(--kl-app-gold-edge, rgba(212,175,55,0.22))",
            }}
          >
            <Sparkles className="w-5 h-5 text-[var(--kl-gold-app,#D4AF37)]" />
          </div>
          <div className="font-display text-[28px] leading-tight mb-2" style={{ fontFamily: "var(--kl-font-display, Georgia, serif)" }}>
            Ready to see 3 outline paths?
          </div>
          <p className="text-[13.5px] text-white/55 max-w-md mb-5 leading-relaxed">
            Based on the theme{selectedThemes.length === 1 ? "" : "s"} you picked — {" "}
            <strong className="text-white/85 font-medium">
              {selectedThemes.join(" · ") || "(no theme selected)"}
            </strong>
            {" "}— Coach Kairos will generate three structurally different ways your essay could unfold. You&rsquo;ll pick one to carry into drafting.
          </p>
          <button
            onClick={generateOutlines}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[var(--kl-gold-app,#D4AF37)] text-black text-[13.5px] font-semibold hover:bg-[var(--kl-gold-hover-app,#C4A030)] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Generating outlines…" : "Generate 3 outline options"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
          {generateError && (
            <p className="text-xs text-red-400 mt-4">{generateError}</p>
          )}
        </div>
      </div>
    );
  }

  // Post-generation view
  return (
    <div className="kl-surface-app w-full kl-studio-shell" style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
      <PhaseBar nodes={phaseNodes} />
      <Subhead
        badge="Outline"
        lead="Pick a structural path for your essay."
        sub="Each option takes your story somewhere different. Tap one, skim the sections, then refine with the coach or jump to drafting."
      />

      <div className="grid items-start gap-5 kl-studio-grid" style={{ gridTemplateColumns: "1fr 380px" }}>
        {/* Left: outline options */}
        <div className="flex flex-col gap-4 min-w-0">
          <div ref={outlinesTopRef} />
          <div className="flex flex-col gap-3">
            {outlines.map((opt, i) => (
              <OutlineCard
                key={i}
                opt={opt}
                letter={OPTION_LETTER[i] ?? String(i + 1)}
                railColor={RAIL_COLORS[i % RAIL_COLORS.length]}
                isSelected={selected === i}
                onSelect={() => setSelected(i)}
              />
            ))}
          </div>

          {saveError && (
            <div className="px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-300">
              {saveError}
            </div>
          )}

          {outlines.length < 3 && (
            <div
              className="rounded-xl flex items-start justify-between gap-3"
              style={{
                border: "1px solid var(--kl-app-gold-edge, rgba(212,175,55,0.22))",
                background: "rgba(212,175,55,0.05)",
                padding: "12px 14px",
              }}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <Sparkles className="w-3.5 h-3.5 text-[var(--kl-gold-app,#D4AF37)] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[12.5px] font-semibold text-white mb-0.5">
                    Only {outlines.length} option{outlines.length === 1 ? "" : "s"} returned — expected 3
                  </div>
                  <div className="text-[11.5px] text-white/60">
                    Coach Kairos was supposed to draft three structurally different paths.
                    Regenerate to get the full set.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={generateOutlines}
                disabled={loading}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--kl-gold-app,#D4AF37)] text-[var(--kl-gold-app,#D4AF37)] text-[11.5px] font-semibold hover:bg-[var(--kl-gold-app,#D4AF37)]/10 transition-colors disabled:opacity-40"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                Regenerate
              </button>
            </div>
          )}

          {/* Sticky-style CTA row */}
          <div
            className="rounded-2xl flex items-center justify-between gap-4"
            style={{
              background: selected !== null
                ? "rgba(212,175,55,0.06)"
                : "rgba(255,255,255,0.015)",
              border: "1px solid",
              borderColor: selected !== null
                ? "var(--kl-app-gold-edge-2, rgba(212,175,55,0.40))"
                : "var(--kl-app-border, rgba(255,255,255,0.08))",
              padding: "14px 18px",
            }}
          >
            <div>
              <div className="text-[13px] font-semibold text-white">
                {selected === null ? "No outline selected" : outlines[selected].title}
              </div>
              <div className="text-[11.5px] text-white/50 mt-0.5 flex items-center gap-2">
                {selected === null ? (
                  <>Tap an option above to pick a direction.</>
                ) : coachReady ? (
                  <>
                    <Sparkles className="w-3 h-3 text-[var(--kl-gold-app,#D4AF37)]" />
                    Coach thinks you&rsquo;re ready to draft.
                  </>
                ) : (
                  <>Review the sections — refine with the coach on the right if something feels off.</>
                )}
              </div>
            </div>
            <button
              onClick={saveOutline}
              disabled={saving || selected === null}
              className="px-5 py-2.5 rounded-xl bg-[var(--kl-gold-app,#D4AF37)] text-black text-sm font-semibold hover:bg-[var(--kl-gold-hover-app,#C4A030)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving…" : "Use this outline"}
              {!saving && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right rail: coach + structure tips */}
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
              Outline coach
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={rightTab === "tips"}
              onClick={() => setRightTab("tips")}
              className={`kl-rail-tab ${rightTab === "tips" ? "is-active" : ""}`}
            >
              <BookOpen className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
              Structure tips
            </button>
          </div>

          {rightTab === "coach" ? (
            <CoachPanel
              chat={chat}
              chatInput={chatInput}
              setChatInput={setChatInput}
              chatStreaming={chatStreaming}
              chatError={chatError}
              refineError={refineError}
              refineLoading={refineLoading}
              sendChat={sendChat}
              refineOutline={refineOutline}
              chatBottomRef={chatBottomRef}
            />
          ) : (
            <StructureTipsPanel />
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

function Subhead({ badge, lead, sub }: { badge: string; lead: string; sub: string }) {
  return (
    <div className="kl-bs-subhead">
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <span
          className="kl-prompt-badge"
          style={{
            background: "var(--kl-phase-outline-bg, rgba(59,130,246,0.20))",
            color: "var(--kl-phase-outline-fg, #93c5fd)",
            borderColor: "rgba(59,130,246,0.28)",
          }}
        >
          <BookOpen className="w-3 h-3" />
          {badge}
        </span>
        <div className="min-w-0">
          <div className="text-[13.5px] leading-snug">
            <em className="not-italic text-white/95 font-medium">{lead}</em>{" "}
            <span className="text-white/45">{sub}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutlineCard({
  opt,
  letter,
  railColor,
  isSelected,
  onSelect,
}: {
  opt: OutlineOption;
  letter: string;
  railColor: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className="text-left w-full transition-all"
      style={{
        background: isSelected
          ? "rgba(212,175,55,0.06)"
          : "rgba(255,255,255,0.02)",
        border: "1px solid",
        borderColor: isSelected
          ? "var(--kl-app-gold-edge-2, rgba(212,175,55,0.40))"
          : "var(--kl-app-border, rgba(255,255,255,0.08))",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left color rail */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 3,
          background: railColor,
        }}
      />

      <div style={{ padding: "18px 22px 18px 26px" }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="inline-flex items-center justify-center font-semibold flex-shrink-0"
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: isSelected ? railColor : "rgba(255,255,255,0.06)",
                color: isSelected ? "#000" : railColor,
                border: isSelected ? "none" : `1px solid ${railColor}40`,
                fontSize: 13,
                fontFamily: "var(--kl-font-mono, 'JetBrains Mono', monospace)",
              }}
            >
              {letter}
            </span>
            <div className="min-w-0">
              <div
                className="text-[10px] uppercase tracking-[0.18em] text-white/40 mb-1"
                style={{ fontFamily: "var(--kl-font-mono, 'JetBrains Mono', monospace)" }}
              >
                Option {letter}
              </div>
              <h3 className="text-[16px] font-semibold text-white leading-tight">{opt.title}</h3>
            </div>
          </div>
          {isSelected && (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{
                background: "var(--kl-gold-app, #D4AF37)",
                color: "#000",
              }}
            >
              <Check className="w-3 h-3" /> Selected
            </span>
          )}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4">
          {opt.sections.map((sec, j) => (
            <div key={j}>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/70"
                  style={{ fontFamily: "var(--kl-font-mono, 'JetBrains Mono', monospace)" }}
                >
                  {sec.label}
                </div>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tabular-nums"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))",
                    color: "rgba(255,255,255,0.60)",
                  }}
                >
                  ~{sec.wordBudget} words
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--kl-app-border, rgba(255,255,255,0.08))" }} />
              </div>
              <ul className="flex flex-col gap-1.5 pl-0.5">
                {sec.bullets.map((b, k) => (
                  <li key={k} className="flex items-start gap-2.5 text-[13px] text-white/70 leading-relaxed">
                    <span
                      aria-hidden
                      className="inline-block flex-shrink-0"
                      style={{
                        width: 5, height: 5, borderRadius: 999,
                        background: "var(--kl-gold-app, #D4AF37)",
                        opacity: 0.7,
                        marginTop: 8,
                      }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}

function CoachPanel({
  chat, chatInput, setChatInput, chatStreaming, chatError, refineError, refineLoading,
  sendChat, refineOutline, chatBottomRef,
}: {
  chat: ChatMessage[];
  chatInput: string;
  setChatInput: (s: string) => void;
  chatStreaming: boolean;
  chatError: string | null;
  refineError: string | null;
  refineLoading: boolean;
  sendChat: (t: string) => void;
  refineOutline: () => void;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <div
        className="kl-rail-card"
        style={{ display: "flex", flexDirection: "column", maxHeight: 560, overflow: "hidden", padding: 0 }}
      >
        <div className="kl-rail-eyebrow" style={{ padding: "14px 18px 0" }}>
          <Sparkles className="w-3 h-3" />
          Outline coach
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5" style={{ padding: "10px 18px 14px", minHeight: 200 }}>
          {chat.length === 0 && (
            <div className="text-[12.5px] text-white/50 italic leading-relaxed">
              Generate outlines above, then talk through which direction fits — the coach can explain
              each approach or refine into a new option.
            </div>
          )}
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
          <div className="text-[11px] text-red-300 px-4 py-2 border-t border-red-500/20 bg-red-500/10">{chatError}</div>
        )}
        {refineError && (
          <div className="text-[11px] text-red-300 px-4 py-2 border-t border-red-500/20 bg-red-500/10">{refineError}</div>
        )}

        {chat.length >= 2 && (
          <div style={{ padding: "10px 14px", borderTop: "1px solid var(--kl-app-border, rgba(255,255,255,0.08))" }}>
            <button
              type="button"
              onClick={refineOutline}
              disabled={refineLoading || chatStreaming}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11.5px] font-medium transition-colors"
              style={{
                border: "1px solid var(--kl-app-gold-edge, rgba(212,175,55,0.22))",
                background: "rgba(212,175,55,0.08)",
                color: "var(--kl-gold-app, #D4AF37)",
                opacity: refineLoading || chatStreaming ? 0.4 : 1,
              }}
            >
              {refineLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
              {refineLoading ? "Refining…" : "Refine into a new outline"}
            </button>
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
            placeholder="Ask about the outlines…"
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
    </>
  );
}

function StructureTipsPanel() {
  return (
    <>
      <div className="kl-rail-card">
        <div className="kl-rail-eyebrow">
          <Lightbulb className="w-3 h-3" />
          Essay shapes
        </div>
        <div className="kl-rail-body">
          Not every essay is Hook → Development → Reflection. The three options Coach Kairos drafts
          each use a <em>different</em> structural form so you can feel which one fits your story.
          Glance at the section labels and word-budget splits on each card — the shape is in there.
        </div>
        <div className="kl-tip-list">
          <div className="kl-tip-item">
            <span className="kl-tip-dot" />
            <span>
              <strong>Chronological</strong> — scene &rarr; turning beat &rarr; reframe. Best when
              one specific day carries the weight.
            </span>
          </div>
          <div className="kl-tip-item">
            <span className="kl-tip-dot" />
            <span>
              <strong>Vignette collage</strong> — 3&ndash;5 small scenes, no single thesis. Meaning
              comes from what the reader sees stacked.
            </span>
          </div>
          <div className="kl-tip-item">
            <span className="kl-tip-dot" />
            <span>
              <strong>In medias res</strong> — drop into the hardest moment first, then flash back,
              then return to finish it. High-stakes openings.
            </span>
          </div>
          <div className="kl-tip-item">
            <span className="kl-tip-dot" />
            <span>
              <strong>Argument-first</strong> — a claim you&rsquo;re willing to defend, then lived
              evidence, then a reframe that complicates the claim.
            </span>
          </div>
          <div className="kl-tip-item">
            <span className="kl-tip-dot" />
            <span>
              <strong>Braided</strong> — two storylines alternating, converging at the end.
            </span>
          </div>
          <div className="kl-tip-item">
            <span className="kl-tip-dot" />
            <span>
              <strong>Cyclical / bookend</strong> — an opening image that returns transformed in the
              final section.
            </span>
          </div>
          <div className="kl-tip-item">
            <span className="kl-tip-dot" />
            <span>
              <strong>Letter / second-person</strong> — addressed to a person, place, or younger
              self. Intimacy over argument.
            </span>
          </div>
          <div className="kl-tip-item">
            <span className="kl-tip-dot" />
            <span>
              <strong>Question-driven</strong> — open on a question, each section is an attempt at
              answering, final beat admits what&rsquo;s still unresolved.
            </span>
          </div>
        </div>
      </div>

      <div className="kl-rail-card">
        <div className="kl-rail-eyebrow">
          <Sparkles className="w-3 h-3" />
          Picking between options
        </div>
        <div className="kl-rail-body text-[12.5px]">
          Pick the structure whose <strong>opening section</strong> you can already picture writing.
          If two feel equally strong, pick the one with the <em>most specific</em> opening beat —
          it&rsquo;s easier to draft from a concrete scene than from an idea. Word budgets are
          rough targets; stretch up to ±10% freely.
        </div>
      </div>

      <div
        className="kl-rail-card"
        style={{ borderColor: "var(--kl-app-gold-edge, rgba(212,175,55,0.22))", background: "rgba(212,175,55,0.04)" }}
      >
        <div className="kl-rail-eyebrow" style={{ color: "var(--kl-gold-app, #D4AF37)" }}>
          <MessageSquare className="w-3 h-3" />
          Not loving any of them?
        </div>
        <div className="kl-rail-body text-[12.5px]">
          Tell the coach what&rsquo;s off in the <strong>Outline coach</strong> tab — then press{" "}
          <em>Refine into a new outline</em> and it&rsquo;ll draft a fourth option in a form you
          haven&rsquo;t seen yet.
        </div>
      </div>
    </>
  );
}

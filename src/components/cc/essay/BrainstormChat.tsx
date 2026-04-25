"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Mic,
  MicOff,
  ChevronDown,
  Check,
  Languages,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Paperclip,
} from "lucide-react";
import VoiceQualityCheck from "@/components/voice/VoiceQualityCheck";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface BrainstormChatProps {
  essayId: string;
  initialTranscript: Message[];
  onAdvanceToOutline: (themes: string[]) => void;
}

type Lang = {
  code: string;
  name: string;
  flag: string;
  greeting: string;
  isRTL?: boolean;
};

// Source of truth for the voice-greeting copy is the design mockup at
// public/media/brainstorm-redesign-standalone (1).html.
const LANGUAGES: Lang[] = [
  { code: "en", name: "English",  flag: "\u{1F1FA}\u{1F1F8}", greeting: "I'm here to listen to your story. Tell me something about yourself that your classmates wouldn't know." },
  { code: "es", name: "Español",  flag: "\u{1F1EA}\u{1F1F8}", greeting: "Estoy aquí para escuchar tu historia. Cuéntame algo sobre ti que tus compañeros no sepan." },
  { code: "hi", name: "हिन्दी",    flag: "\u{1F1EE}\u{1F1F3}", greeting: "मैं तुम्हारी कहानी सुनने के लिए यहाँ हूँ। तुम्हारे बारे में कोई ऐसी बात बताओ जो तुम्हारे classmates नहीं जानते।" },
  { code: "ur", name: "اردو",     flag: "\u{1F1F5}\u{1F1F0}", greeting: "میں تمہاری کہانی سننے کے لیے یہاں ہوں۔ اپنے بارے میں کچھ ایسا بتاؤ جو تمہارے classmates نہیں جانتے۔", isRTL: true },
  { code: "pa", name: "ਪੰਜਾਬੀ",    flag: "\u{1F1EE}\u{1F1F3}", greeting: "ਮੈਂ ਤੁਹਾਡੀ ਕਹਾਣੀ ਸੁਣਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਆਪਣੇ ਬਾਰੇ ਕੁਝ ਅਜਿਹਾ ਦੱਸੋ ਜੋ ਤੁਹਾਡੇ classmates ਨਹੀਂ ਜਾਣਦੇ।" },
  { code: "fr", name: "Français", flag: "\u{1F1EB}\u{1F1F7}", greeting: "Je suis ici pour écouter ton histoire. Raconte-moi quelque chose sur toi que tes camarades ne sauraient pas." },
  { code: "ja", name: "日本語",    flag: "\u{1F1EF}\u{1F1F5}", greeting: "あなたの物語を聞くためにここにいます。クラスメイトが知らないあなたのことを教えてください。" },
];

const STORAGE_KEY = "coach-language";

// Extract the leading **bold** label from a theme string, fall back to the
// first sentence or first 60 chars. Used to dedupe "The school leap — ..."
// against a later "The school leap: ..." emission.
function themeKey(t: string): string {
  const bold = t.match(/\*\*([^*]+)\*\*/);
  if (bold) return bold[1].trim().toLowerCase();
  const first = t.split(/[—–:.,]/)[0].trim().toLowerCase();
  return first.slice(0, 60);
}

function dedupeThemes(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of list) {
    const cleaned = t.replace(/\*\*/g, "").replace(/^["'`]|["'`]$/g, "").trim();
    if (!cleaned) continue;
    const k = themeKey(cleaned);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(cleaned);
  }
  return out;
}

// Pull "**Label** — description" paragraphs (prose-form themes) from the text.
// Catches the case where the coach lists themes as paragraphs rather than
// bullets, e.g. "**The school leap** — skipping a grade, switching…".
function extractBoldLabelThemes(text: string): string[] {
  const out: string[] = [];
  const paragraphs = text.split(/\n{1,}/);
  for (const p of paragraphs) {
    // Only consider paragraphs that START with **Label** (with optional leading
    // bullet/number) to avoid grabbing inline bolded words from prose.
    const m = p.match(/^\s*(?:\d+[.)]|[-*•])?\s*\*\*([^*]+)\*\*\s*([—–\-:,]\s*.+)?$/);
    if (!m) continue;
    const label = m[1].trim();
    const tail = (m[2] || "").replace(/^[—–\-:,]\s*/, "").trim();
    // Keep the description so the chip reads naturally, cap at ~180 chars.
    const joined = tail ? `${label} — ${tail}` : label;
    out.push(joined.slice(0, 180));
  }
  return out;
}

function parseThemesBlock(text: string): {
  displayText: string;
  themes: string[];
  awaitingThemes: boolean;
} {
  const tagged = text.match(/<<THEMES_READY>>([\s\S]*?)<<END_THEMES>>/);
  const displayText = tagged
    ? text.replace(/<<THEMES_READY>>[\s\S]*?<<END_THEMES>>\s*/, "").trim()
    : text;

  // Collect theme candidates from THREE sources and union them:
  //   1. the tagged <<THEMES_READY>> block (if present)
  //   2. numbered/bulleted list items in the prose
  //   3. **Bold label** paragraphs (prose-form themes)
  // The LLM sometimes emits the block with 2 items but then writes a 3rd
  // option in prose below (which previously went missing). Unioning catches
  // all three regardless of which format the model chose.
  const collected: string[] = [];

  if (tagged) {
    for (const line of tagged[1].split("\n")) {
      const v = line.replace(/^\s*[-*]\s*/, "").trim();
      if (v) collected.push(v);
    }
  }

  const itemRe = /^\s*(?:\d+[.)]|[-*•])\s+(.+?)\s*$/gm;
  for (const m of text.matchAll(itemRe)) {
    const v = m[1].trim();
    if (v && v.length < 200) collected.push(v);
  }

  for (const b of extractBoldLabelThemes(text)) {
    collected.push(b);
  }

  const themes = dedupeThemes(collected);

  const choiceCue =
    /\b(which|pick|choose)\b[^\n?]*\b(feels|resonates|sounds|most|one|these)\b/i.test(text) ||
    /\b(here are|i have enough|surface.*themes|three concrete themes|two concrete themes|three directions|two directions)\b/i.test(text);

  if (tagged || themes.length >= 2) {
    return { displayText, themes, awaitingThemes: false };
  }

  return { displayText, themes: [], awaitingThemes: choiceCue };
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

function VoiceWaveform({ active }: { active: boolean }) {
  const bars = [12, 18, 10, 22, 14, 20, 8, 16, 12];
  return (
    <span className="kl-voice-waveform" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="kl-wf-bar"
          style={{
            height: active ? h : 6,
            animationDelay: `${i * 0.1}s`,
            animationPlayState: active ? "running" : "paused",
            opacity: active ? undefined : 0.3,
          }}
        />
      ))}
    </span>
  );
}

/**
 * Renders coach message content with lightweight **bold** + *em* markdown and
 * preserves newlines. Used inside .kl-msg-bubble.
 */
function renderRich(text: string) {
  // Split into paragraphs, then inline-apply **...** and *...*.
  const blocks = text.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    return (
      <p key={i} style={{ margin: i === 0 ? 0 : "10px 0 0", whiteSpace: "pre-wrap" }}>
        {lines.map((line, j) => (
          <span key={j}>
            {j > 0 && <br />}
            {inline(line)}
          </span>
        ))}
      </p>
    );
  });
}

function inline(text: string): React.ReactNode {
  // Minimal **bold** + *italic*. Not a full markdown parser, just safe enough.
  const parts: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    const b = rest.match(/\*\*([^*]+)\*\*/);
    const i = rest.match(/\*([^*]+)\*/);
    const next = [b, i].filter(Boolean).sort((a, b) => (a!.index! - b!.index!))[0];
    if (!next) {
      parts.push(rest);
      break;
    }
    const before = rest.slice(0, next.index!);
    if (before) parts.push(before);
    if (next === b) parts.push(<strong key={key++}>{next[1]}</strong>);
    else parts.push(<em key={key++}>{next[1]}</em>);
    rest = rest.slice(next.index! + next[0].length);
  }
  return <>{parts}</>;
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

  // Bilingual canvas extraction (Feature 1A) — feature-flagged + silent fallback.
  type CanvasFragment = { turnId: string; fragment: string; tags: string[]; createdAt: string };
  const [fragments, setFragments] = useState<CanvasFragment[]>([]);

  // Hydrate any previously-extracted fragments on mount.
  useEffect(() => {
    fetch(`/api/cc/essays/${essayId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const f = data?.essay?.canvas_fragments ?? data?.canvas_fragments;
        if (Array.isArray(f)) setFragments(f as CanvasFragment[]);
      })
      .catch(() => {
        /* non-fatal — start with empty list */
      });
  }, [essayId]);

  // Voice quality check (Feature 1A) — only shown the first time the user
  // turns voice on. Fail-open: if the lookup fails we treat as already-passed
  // so we don't nag.
  const [voiceCheckPassed, setVoiceCheckPassed] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/cc/profile/voice")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setVoiceCheckPassed(Boolean(d?.voiceQualityCheckPassedAt)))
      .catch(() => setVoiceCheckPassed(true));
  }, []);

  const [langCode, setLangCode] = useState<string>(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem(STORAGE_KEY) || "en";
  });
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [voiceUnsupported, setVoiceUnsupported] = useState<string | null>(null);
  const [voiceInterim, setVoiceInterim] = useState("");
  const [rightTab, setRightTab] = useState<"tips" | "canvas">("tips");

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startedRef = useRef(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const currentLang = LANGUAGES.find((l) => l.code === langCode) ?? LANGUAGES[0];
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

  useEffect(() => {
    // Walk messages newest-first. If we find an awaitingThemes hit with no
    // parsed list, keep searching earlier for a list (the coach may have
    // listed themes in an earlier turn and just re-prompted). If we find a
    // list, we union it with any later-mentioned themes in subsequent
    // assistant messages so the student sees every option the AI has
    // surfaced — not just the most recent batch.
    const collected: string[] = [];
    let sawAwaitingLatest = false;
    let latestListIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role !== "assistant") continue;
      const parsed = parseThemesBlock(messages[i].content);
      if (parsed.themes.length > 0) {
        if (latestListIndex === -1) latestListIndex = i;
        collected.push(...parsed.themes);
      } else if (parsed.awaitingThemes && latestListIndex === -1 && collected.length === 0) {
        // Most recent assistant turn promised themes but didn't write them —
        // flag recovery UI. But keep scanning earlier turns for any real list.
        if (!sawAwaitingLatest) sawAwaitingLatest = true;
      }
      // Stop once we've gone back 3 assistant messages — older turns are
      // likely stale topic directions that shouldn't clutter the canvas.
      if (latestListIndex !== -1 && i < latestListIndex - 4) break;
    }
    const deduped = dedupeThemes(collected);
    setThemes(deduped);
    setAwaitingThemes(sawAwaitingLatest && deduped.length === 0);
    if (deduped.length > 0 && rightTab !== "canvas") setRightTab("canvas");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Close language menu on outside click
  useEffect(() => {
    if (!langMenuOpen) return;
    const h = (e: MouseEvent) => {
      if (!langMenuRef.current?.contains(e.target as Node)) setLangMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [langMenuOpen]);

  const persistLang = (code: string) => {
    setLangCode(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("coach-language-change", { detail: code }));
    }
    // If voice is on, restart the recognizer in the new locale so the student's
    // next utterance is transcribed correctly.
    if (voiceOn) {
      stopRecognition();
      setTimeout(() => startRecognition(), 100);
    }
  };

  const sendMessage = async (text: string) => {
    if (streaming) return;
    setErrorBanner(null);
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
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
        setMessages((prev) => prev.slice(0, -1));
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

      // Bilingual canvas extraction (R1, R8) — feature-flagged, fails silently.
      if (process.env.NEXT_PUBLIC_BILINGUAL_CANVAS_ENABLED === "true") {
        try {
          const xRes = await fetch(`/api/cc/essays/${essayId}/canvas-extract`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (xRes.ok) {
            const f = (await xRes.json()) as CanvasFragment;
            if (f.fragment) setFragments((prev) => [...prev, f]);
          }
        } catch (err) {
          console.warn("[canvas-extract] failed silently", err);
        }
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

  // ── Voice input via Web Speech API ───────────────────────────────────────
  // Browser-native dictation (Chrome/Edge/Safari). When voice mode is on, the
  // user's speech in the chosen language is transcribed live into the input
  // field. Final transcripts auto-send so the student doesn't have to hit
  // Enter after each utterance. No backend change needed — transcripts go
  // through the normal /api/cc/essays/<id>/brainstorm streaming endpoint.
  //
  // BCP-47 locale map — keeps the recognizer in the student's chosen language.
  const LOCALE: Record<string, string> = {
    en: "en-US", es: "es-ES", hi: "hi-IN", ur: "ur-PK",
    pa: "pa-IN", fr: "fr-FR", ja: "ja-JP",
  };

  const startRecognition = () => {
    if (typeof window === "undefined") return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setVoiceUnsupported(
        "Voice input isn't supported in this browser. Chrome, Edge, or Safari works best.",
      );
      return false;
    }
    const rec = new SR();
    rec.lang = LOCALE[langCode] ?? "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setVoiceInterim(interim);
      if (finalText.trim()) {
        setVoiceInterim("");
        sendMessage(finalText.trim());
      }
    };
    rec.onerror = () => {
      setVoiceInterim("");
    };
    rec.onend = () => {
      // Auto-restart while voice toggle is still on, unless we're streaming.
      if (recognitionRef.current && voiceOn && !streaming) {
        try {
          rec.start();
        } catch {
          /* ignore duplicate-start errors */
        }
      }
    };
    try {
      rec.start();
    } catch {
      /* mic might already be live */
    }
    recognitionRef.current = rec;
    setVoiceUnsupported(null);
    return true;
  };

  const stopRecognition = () => {
    const rec = recognitionRef.current;
    recognitionRef.current = null;
    setVoiceInterim("");
    if (rec) {
      try { rec.stop(); } catch { /* ignore */ }
    }
  };

  useEffect(() => {
    return () => stopRecognition();
  }, []);

  const handleVoiceToggle = () => {
    setVoiceOn((prev) => {
      const next = !prev;
      if (next) {
        const ok = startRecognition();
        if (!ok) return false;
      } else {
        stopRecognition();
      }
      return next;
    });
  };

  const phaseExchangesLabel = `${userTurnCount} exchange${userTurnCount === 1 ? "" : "s"}`;
  const themesLabel = themes.length ? ` · ${themes.length} theme${themes.length === 1 ? "" : "s"}` : "";
  const phasePct = Math.min(100, Math.round((userTurnCount / 6) * 100));

  const PHASES = [
    { n: "01", label: "Brainstorm", pct: phasePct, status: "active" as const, meta: `${phaseExchangesLabel}${themesLabel}` },
    { n: "02", label: "Outline",    pct: 0,        status: "next"   as const, meta: themes.length ? "Ready" : "Next up" },
    { n: "03", label: "Draft",      pct: 0,        status: "locked" as const, meta: "—" },
    { n: "04", label: "Revise",     pct: 0,        status: "locked" as const, meta: "—" },
  ];

  const showAwaitingRecovery = awaitingThemes && themes.length === 0 && !streaming;

  return (
    <div className="kl-surface-app w-full" style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Breadcrumb + autosave */}
      <div className="flex items-center gap-2.5 text-[12.5px] text-white/45">
        <span className="text-white/70 inline-flex items-center gap-1.5">Essay Studio</span>
        <span className="opacity-40">/</span>
        <span>Common App Personal Statement</span>
        <span className="opacity-40">/</span>
        <span className="text-[var(--kl-gold-app,#D4AF37)]">Brainstorm</span>
        <span className="ml-auto font-mono text-[11px] text-white/45">Autosaved</span>
      </div>

      {/* Phase bar */}
      <div className="kl-phase-bar">
        {PHASES.map((p) => (
          <div
            key={p.n}
            className={`kl-phase-node ${p.status === "active" ? "is-active" : ""}`}
          >
            <div className="kl-phase-num">{p.n}</div>
            <div className="kl-phase-label">{p.label}</div>
            <div className="kl-phase-meta">{p.meta}</div>
            {p.status === "active" && <div className="kl-phase-fill" style={{ width: `${p.pct}%` }} />}
          </div>
        ))}
      </div>

      {/* Sub-header: prompt + language + voice */}
      <div className="kl-bs-subhead">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <span className="kl-prompt-badge">
            <Sparkles className="w-3 h-3" />
            Brainstorm
          </span>
          <div className="min-w-0">
            <div className="text-[13.5px] text-white/70 leading-snug">
              <em className="not-italic text-white/95 font-medium">
                Let&rsquo;s find the story only you can tell.
              </em>{" "}
              <span className="text-white/45">Common App · 650 words max</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 relative" ref={langMenuRef}>
          <button
            type="button"
            className={`kl-lang-select ${langCode !== "en" ? "is-active" : ""}`}
            onClick={() => setLangMenuOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={langMenuOpen}
          >
            <span className="text-[15px] leading-none" aria-hidden>{currentLang.flag}</span>
            <span>{currentLang.name}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {langMenuOpen && (
            <div
              role="listbox"
              className="absolute z-20 min-w-[200px] p-1.5 rounded-xl"
              style={{
                top: "calc(100% + 6px)",
                right: 120,
                background: "#0d0d0d",
                border: "1px solid var(--kl-app-border, rgba(255,255,255,.08))",
                boxShadow: "0 20px 60px rgba(0,0,0,.6)",
              }}
            >
              {LANGUAGES.map((l) => {
                const selected = l.code === langCode;
                return (
                  <button
                    key={l.code}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      persistLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-[13.5px] transition-colors"
                    style={{
                      color: selected ? "var(--kl-gold-app,#D4AF37)" : "rgba(255,255,255,.85)",
                      background: selected ? "rgba(212,175,55,.08)" : "transparent",
                    }}
                  >
                    <span className="text-[15px]" aria-hidden>{l.flag}</span>
                    <span className="flex-1">{l.name}</span>
                    {selected && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          )}

          {langCode === "ur" ? (
            <button
              type="button"
              disabled
              className="kl-voice-toggle is-disabled"
              title="Voice for Urdu coming soon — switch to Hindi for voice"
            >
              <span className="kl-voice-dot">
                <MicOff className="w-3.5 h-3.5" />
              </span>
              <span>Voice off</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVoiceToggle}
              aria-pressed={voiceOn}
              className={`kl-voice-toggle ${voiceOn ? "is-on" : ""}`}
            >
              <span className="kl-voice-dot">
                {voiceOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
              </span>
              <span>{voiceOn ? "Voice on" : "Voice off"}</span>
              {voiceOn && <VoiceWaveform active />}
            </button>
          )}
        </div>
      </div>

      {/* Two column: chat + right rail */}
      <div className="grid items-start gap-5" style={{ gridTemplateColumns: "1fr 380px" }}>
        <div className="flex flex-col gap-4 min-w-0">
          {voiceOn && voiceCheckPassed === false && langCode !== "ur" && (
            <VoiceQualityCheck
              language={langCode}
              onPassed={() => setVoiceCheckPassed(true)}
            />
          )}

          {voiceOn && (
            <div className="kl-voice-banner" style={{ direction: currentLang.isRTL ? "rtl" : "ltr" }}>
              <VoiceWaveform active />
              <div className="flex-1">
                <div
                  className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-1"
                  style={{ color: "var(--kl-gold-app,#D4AF37)", direction: "ltr" }}
                >
                  Coach Kairos · Listening in {currentLang.name}
                </div>
                <div className="text-[15px]">{currentLang.greeting}</div>
              </div>
            </div>
          )}

          {/* Chat thread — inline theme picker renders directly under the last
              assistant message so the student sees clickable themes exactly
              where they just read the coach ask "which of these resonates". */}
          {(() => {
            const lastAssistantIdx = [...messages].reverse().findIndex((m) => m.role === "assistant");
            const lastIdx = lastAssistantIdx === -1 ? -1 : messages.length - 1 - lastAssistantIdx;
            return (
              <div className="kl-chat-thread flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`kl-msg-row ${msg.role === "user" ? "is-user" : ""}`}>
                      <div className={`kl-msg-avatar ${msg.role === "user" ? "is-user" : "is-coach"}`} aria-hidden>
                        {msg.role === "user" ? "S" : "K"}
                      </div>
                      <div
                        dir="auto"
                        className={`kl-msg-bubble ${msg.role === "user" ? "is-user" : "is-coach"}`}
                      >
                        {msg.content
                          ? renderRich(msg.content)
                          : <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-[var(--kl-gold-app,#D4AF37)] rounded-full animate-spin" />}
                      </div>
                    </div>
                    {i === lastIdx && themes.length > 0 && !streaming && (
                      <div
                        className="mt-3 ml-11 mr-0 p-4 rounded-xl"
                        style={{
                          background: "rgba(212,175,55,0.06)",
                          border: "1px solid var(--kl-app-gold-edge, rgba(212, 175, 55, 0.22))",
                          maxWidth: 620,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2.5">
                          <Sparkles className="w-3.5 h-3.5 text-[var(--kl-gold-app,#D4AF37)]" />
                          <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--kl-gold-app,#D4AF37)] font-mono">
                            Pick a direction to develop
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {themes.map((theme) => {
                            const selected = selectedThemes.includes(theme);
                            return (
                              <button
                                key={theme}
                                type="button"
                                onClick={() => toggleTheme(theme)}
                                className={`kl-theme-chip ${selected ? "is-selected" : "is-hot"}`}
                                style={{ padding: "8px 14px", fontSize: 13 }}
                              >
                                <span className="kl-chip-dot" aria-hidden />
                                <span className="leading-snug">{theme}</span>
                              </button>
                            );
                          })}
                        </div>
                        {selectedThemes.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => onAdvanceToOutline(selectedThemes)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--kl-gold-app,#D4AF37)] text-black text-[13px] font-semibold hover:bg-[var(--kl-gold-hover-app,#C4A030)] transition-colors"
                          >
                            Continue with {selectedThemes.length} theme{selectedThemes.length === 1 ? "" : "s"}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="text-[11.5px] text-white/50 italic">
                            Tap one or more chips above, then press{" "}
                            <strong className="text-white/75 not-italic">Continue</strong>.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            );
          })()}

          {errorBanner && (
            <div className="px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-300">
              {errorBanner}
            </div>
          )}

          {voiceUnsupported && (
            <div className="px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300">
              {voiceUnsupported}
            </div>
          )}

          {voiceOn && voiceInterim && (
            <div className="px-3 py-2 rounded-lg border border-[var(--kl-app-gold-edge,rgba(212,175,55,0.22))] bg-[var(--kl-gold-app,#D4AF37)]/10 text-xs text-[var(--kl-gold-app,#D4AF37)] flex items-center gap-2">
              <VoiceWaveform active />
              <span className="italic">{voiceInterim}</span>
            </div>
          )}

          {/* Composer — avatar OUTSIDE the input so the Next.js dev badge never covers typing */}
          <form onSubmit={handleSubmit} className="kl-composer-wrap">
            <div className="kl-composer-avatar" aria-hidden>S</div>
            <textarea
              ref={textareaRef}
              value={input}
              dir="auto"
              onChange={(e) => {
                setInput(e.target.value);
                const ta = e.currentTarget;
                ta.style.height = "auto";
                ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your thoughts — or press and hold the mic to speak in your language…"
              rows={1}
              disabled={streaming}
              className="kl-composer-input"
            />
            <div className="kl-composer-tools">
              <button type="button" className="kl-tool-btn" title="Attach" aria-label="Attach">
                <Paperclip className="w-4 h-4" />
              </button>
              {langCode === "ur" ? (
                <button
                  type="button"
                  disabled
                  className="kl-tool-btn"
                  aria-label="Voice not available for Urdu"
                  title="Voice for Urdu coming soon — switch to Hindi for voice"
                  style={{ opacity: 0.4, cursor: "not-allowed" }}
                >
                  <MicOff className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className="kl-tool-btn"
                  aria-pressed={voiceOn}
                  aria-label="Toggle voice"
                  title="Voice"
                  style={{ color: voiceOn ? "var(--kl-gold-app,#D4AF37)" : undefined }}
                >
                  {voiceOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              )}
              <button
                type="submit"
                className="kl-tool-btn is-primary"
                disabled={!input.trim() || streaming}
                aria-label="Send"
                title="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right rail */}
        <div className="kl-rail">
          <div className="kl-rail-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={rightTab === "tips"}
              onClick={() => setRightTab("tips")}
              className={`kl-rail-tab ${rightTab === "tips" ? "is-active" : ""}`}
            >
              <Lightbulb className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
              Coaching tips
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={rightTab === "canvas"}
              onClick={() => setRightTab("canvas")}
              className={`kl-rail-tab ${rightTab === "canvas" ? "is-active" : ""}`}
            >
              <BookOpen className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
              Story canvas {themes.length > 0 && <span className="opacity-70">· {themes.length}</span>}
            </button>
          </div>

          {rightTab === "tips" ? (
            <>
              <div className="kl-rail-card">
                <div className="kl-rail-eyebrow">
                  <Sparkles className="w-3 h-3" />
                  Coaching tip · Live
                </div>
                <div className="kl-rail-title">
                  Go deep on <em>one</em> specific scene — not a résumé of what happened.
                </div>
                <div className="kl-rail-body">
                  The best personal statements zoom in on <strong>a single moment</strong> you can
                  describe in the body: what your hands were doing, what you saw, the thing you
                  almost said but didn&rsquo;t.
                </div>
                <div className="kl-tip-list">
                  <div className="kl-tip-item">
                    <span className="kl-tip-dot" />
                    <span>Pick a <em>specific day</em> — not &quot;growing up&quot; or &quot;last year&quot;.</span>
                  </div>
                  <div className="kl-tip-item">
                    <span className="kl-tip-dot" />
                    <span>Describe <em>one</em> physical detail the reader can see.</span>
                  </div>
                  <div className="kl-tip-item">
                    <span className="kl-tip-dot" />
                    <span>Say what you were <em>thinking</em>, not what you now believe.</span>
                  </div>
                </div>
              </div>

              <div className="kl-rail-card">
                <div className="kl-rail-eyebrow">
                  <Lightbulb className="w-3 h-3" />
                  Prompt-fit check
                </div>
                <div className="kl-rail-body text-[12.5px]">
                  The Common App rewards <strong>change over time</strong>. If you&rsquo;re only
                  describing who you are <em>now</em>, add a before/after beat — a moment something
                  cracked and you grew into this version of yourself.
                </div>
              </div>

              {langCode !== "en" && (
                <div
                  className="kl-rail-card"
                  style={{ borderColor: "var(--kl-app-gold-edge,rgba(212,175,55,.22))", background: "rgba(212,175,55,.04)" }}
                >
                  <div className="kl-rail-eyebrow" style={{ color: "var(--kl-gold-app,#D4AF37)" }}>
                    <Languages className="w-3 h-3" />
                    In your language
                  </div>
                  <div className="kl-rail-body text-[12.5px]">
                    Tell this story out loud in{" "}
                    <strong style={{ color: "var(--kl-gold-app,#D4AF37)" }}>{currentLang.name}</strong>{" "}
                    first. Your most honest sentences will surface in your mother tongue — we&rsquo;ll
                    translate to English together afterward.
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Fragments — bilingual canvas extraction (Feature 1A) */}
              <div className="kl-rail-card">
                <div className="kl-rail-eyebrow">
                  <Sparkles className="w-3 h-3" />
                  Fragments
                </div>
                {fragments.length === 0 ? (
                  <div className="kl-rail-body text-[12.5px] italic">
                    The coach will lift specific moments from your brainstorm and translate them to
                    English here — material you can use directly when you start drafting.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {fragments.map((f) => (
                      <li key={f.turnId}>
                        <p className="text-[13px] text-white/85 italic" dir="auto">&ldquo;{f.fragment}&rdquo;</p>
                        {f.tags.length > 0 && (
                          <p className="text-[10.5px] text-white/45 mt-1">{f.tags.join(" · ")}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="kl-rail-card">
                <div className="kl-rail-eyebrow">
                  <Sparkles className="w-3 h-3" />
                  Directions
                </div>
                {themes.length === 0 ? (
                  <div className="kl-rail-body text-[12.5px]">
                    As you share more, Coach Kairos will surface 2–3 concrete directions here. Pick the
                    one that feels most like <em>your</em> story to move to outline.
                  </div>
                ) : (
                  <>
                    <div className="text-[11.5px] text-white/55 mb-2.5">
                      Tap to select — you can pick more than one. Then press{" "}
                      <strong className="text-white/75">Continue to outline</strong>.
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {themes.map((theme, i) => {
                        const selected = selectedThemes.includes(theme);
                        const hot = i < 3 && !selected;
                        return (
                          <button
                            key={theme}
                            type="button"
                            onClick={() => toggleTheme(theme)}
                            className={`kl-theme-chip ${selected ? "is-selected" : hot ? "is-hot" : ""}`}
                          >
                            <span className="kl-chip-dot" aria-hidden />
                            <span className="leading-snug">{theme}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {showAwaitingRecovery && (
                <div
                  className="kl-rail-card"
                  style={{ borderColor: "var(--kl-app-gold-edge,rgba(212,175,55,.22))", background: "rgba(212,175,55,.06)" }}
                >
                  <div className="kl-rail-eyebrow" style={{ color: "var(--kl-gold-app,#D4AF37)" }}>
                    <Sparkles className="w-3 h-3" />
                    Coach hesitated
                  </div>
                  <div className="kl-rail-body text-[12.5px] mb-3">
                    The coach mentioned themes but didn&rsquo;t list them. Ask it to write them out.
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      sendMessage(
                        "Please list the 2-3 concrete themes now as a numbered list — one theme per line, under 15 words each.",
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-[var(--kl-gold-app,#D4AF37)] text-black text-xs font-semibold hover:bg-[var(--kl-gold-hover-app,#C4A030)] transition-colors"
                  >
                    List the themes
                  </button>
                </div>
              )}

              {selectedThemes.length > 0 && (
                <div
                  className="kl-rail-card"
                  style={{ background: "rgba(212,175,55,.04)", borderColor: "var(--kl-app-gold-edge,rgba(212,175,55,.22))" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--kl-gold-app,#D4AF37)] mb-0.5">
                        Ready to outline?
                      </div>
                      <div className="text-xs text-white/60">
                        {selectedThemes.length} theme{selectedThemes.length === 1 ? "" : "s"} picked.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAdvanceToOutline(selectedThemes)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--kl-gold-app,#D4AF37)] text-black text-xs font-semibold hover:bg-[var(--kl-gold-hover-app,#C4A030)] transition-colors"
                    >
                      Move to outline <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {userTurnCount >= 4 && themes.length === 0 && !streaming && !awaitingThemes && (
                <div className="kl-rail-card">
                  <div className="kl-rail-body text-[12.5px] mb-2">
                    You&rsquo;ve shared plenty of material. Ready to surface themes?
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      sendMessage(
                        "I think I've shared enough — please surface 2-3 concrete themes I could develop.",
                      )
                    }
                    className="text-xs text-[var(--kl-gold-app,#D4AF37)] hover:text-[var(--kl-gold-hover-app,#C4A030)] underline"
                  >
                    Show me themes
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

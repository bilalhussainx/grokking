"use client";

import { useState } from "react";
import { Languages, Loader2, X, Copy, Check } from "lucide-react";
import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

const PARENT_LANGUAGES = COACH_LANGUAGES.filter((l) =>
  ["ur", "hi", "pa", "bn", "ta", "te", "gu", "kn", "ml", "mr", "od", "es", "fr", "ja", "de", "it", "nl"].includes(l.code),
);

type DocKind = "brag_sheet" | "aid_summary" | "scholarship_list" | "general";

/**
 * Feature 1B — drop-in button for any doc surface (brag sheet PDF preview,
 * aid summary table, scholarship list) that translates the content into a
 * parent-comprehensible version. Pops a modal with translated text, RTL
 * direction respected, copy-to-clipboard.
 */
export default function TranslateForParentButton({
  content,
  docKind = "general",
  defaultLang = "ur",
  label = "Translate for parent",
}: {
  content: string;
  docKind?: DocKind;
  defaultLang?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [targetLang, setTargetLang] = useState(defaultLang);
  const [loading, setLoading] = useState(false);
  const [translated, setTranslated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRTL, setIsRTL] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setLoading(true);
    setError(null);
    setTranslated(null);
    try {
      const res = await fetch("/api/cc/translate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, targetLang, docKind }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Status ${res.status}`);
      }
      const data = await res.json();
      setTranslated(data.translated);
      setIsRTL(Boolean(data.isRTL));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!translated) return;
    try {
      await navigator.clipboard.writeText(translated);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/80 hover:bg-white/10 hover:text-white transition-colors"
      >
        <Languages className="w-3.5 h-3.5" />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Translate for parent</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white/70"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-4 flex items-center gap-3 border-b border-white/5">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/90"
              >
                {PARENT_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} — {l.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={run}
                disabled={loading}
                className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black text-[13px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {loading ? "Translating…" : "Translate"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {error && (
                <p className="text-[13px] text-rose-300 mb-3">{error}</p>
              )}
              {!translated && !loading && (
                <p className="text-[12px] text-white/45 italic">
                  Pick a language and tap Translate. The result is for parent comprehension —
                  not formal submission.
                </p>
              )}
              {translated && (
                <div
                  dir={isRTL ? "rtl" : "ltr"}
                  lang={targetLang}
                  className="text-[14px] text-white/85 whitespace-pre-wrap leading-relaxed"
                >
                  {translated}
                </div>
              )}
            </div>

            {translated && (
              <div className="px-5 py-3 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/70 hover:bg-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

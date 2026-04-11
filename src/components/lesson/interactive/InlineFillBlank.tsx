"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Eye, RotateCcw, Lightbulb } from "lucide-react";

/**
 * InlineFillBlank — cloze-deletion exercise inside code or prose
 * ----------------------------------------------------------------
 * Markdown usage:
 * ```fillblank
 * {
 *   "title": "Complete the function",
 *   "language": "python",
 *   "prompt": "Fill in the blanks to return the sum of two numbers.",
 *   "template": "def sum_two(a, b):\n    return ___ + ___",
 *   "blanks": [
 *     { "answer": "a", "hint": "First parameter", "width": 4 },
 *     { "answer": "b", "hint": "Second parameter", "width": 4 }
 *   ],
 *   "caseSensitive": false
 * }
 * ```
 *
 * The literal string `___` (3 underscores) in `template` is replaced left-to-right
 * by the entries in `blanks`. Multiple acceptable answers via { "answer": ["a", "x"] }.
 */

interface Blank {
  answer: string | string[];
  hint?: string;
  width?: number;
}

export interface InlineFillBlankProps {
  title?: string;
  prompt?: string;
  template: string;
  language?: string;
  blanks: Blank[];
  caseSensitive?: boolean;
}

export default function InlineFillBlank({
  title,
  prompt,
  template,
  language,
  blanks,
  caseSensitive = false,
}: InlineFillBlankProps) {
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(() => blanks.map(() => false));
  const [shownHint, setShownHint] = useState<number | null>(null);

  function isCorrect(idx: number): boolean {
    const answers = Array.isArray(blanks[idx].answer)
      ? (blanks[idx].answer as string[])
      : [blanks[idx].answer as string];
    const v = values[idx] || "";
    return answers.some((a) =>
      caseSensitive ? a === v : a.toLowerCase() === v.toLowerCase().trim()
    );
  }

  const allCorrect = blanks.every((_, i) => isCorrect(i));

  function handleCheck() {
    setChecked(true);
  }
  function handleReveal(i: number) {
    const next = [...revealed];
    next[i] = true;
    setRevealed(next);
    const ans = blanks[i].answer;
    const nextV = [...values];
    nextV[i] = Array.isArray(ans) ? ans[0] : ans;
    setValues(nextV);
  }
  function handleReset() {
    setValues(blanks.map(() => ""));
    setChecked(false);
    setRevealed(blanks.map(() => false));
    setShownHint(null);
  }

  // Split template into pieces around `___`
  const pieces = template.split("___");
  // pieces.length = blanks.length + 1 in the well-formed case

  return (
    <div className="my-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.04] to-purple-500/[0.02] overflow-hidden not-prose">
      <div className="px-5 py-3 bg-violet-500/10 border-b border-violet-500/20 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-semibold text-violet-200">
          {title || "Fill in the Blank"}
        </span>
        {language && (
          <span className="ml-2 text-[10px] uppercase tracking-wider text-white/30">
            {language}
          </span>
        )}
      </div>

      {prompt && (
        <p className="px-5 pt-4 text-sm text-white/70 leading-relaxed">{prompt}</p>
      )}

      {/* Code template with inputs */}
      <div className="mx-5 mt-4 rounded-lg bg-black/40 border border-white/5 overflow-x-auto">
        <pre className="text-sm leading-relaxed font-mono p-4 whitespace-pre">
          {pieces.map((piece, i) => (
            <span key={i}>
              <span className="text-white/70">{piece}</span>
              {i < blanks.length && (
                <BlankInput
                  value={values[i]}
                  onChange={(v) => {
                    const next = [...values];
                    next[i] = v;
                    setValues(next);
                    setChecked(false);
                  }}
                  width={blanks[i].width || 6}
                  state={
                    !checked && !revealed[i]
                      ? "neutral"
                      : revealed[i]
                      ? "revealed"
                      : isCorrect(i)
                      ? "correct"
                      : "incorrect"
                  }
                />
              )}
            </span>
          ))}
        </pre>
      </div>

      {/* Per-blank hint row */}
      <div className="px-5 mt-3 flex flex-wrap gap-2">
        {blanks.map((b, i) =>
          b.hint ? (
            <button
              key={i}
              onClick={() => setShownHint(shownHint === i ? null : i)}
              className="text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors"
            >
              Hint #{i + 1}
            </button>
          ) : null
        )}
      </div>
      {shownHint !== null && blanks[shownHint].hint && (
        <div className="mx-5 mt-2 px-3 py-2 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200/90">
          <span className="font-semibold">Hint #{shownHint + 1}:</span>{" "}
          {blanks[shownHint].hint}
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4 flex items-center gap-2">
        <button
          onClick={handleCheck}
          disabled={values.some((v) => !v.trim())}
          className="px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-200 text-xs font-medium hover:bg-violet-500/30 disabled:opacity-40 transition-colors"
        >
          Check Answers
        </button>
        <button
          onClick={() => blanks.forEach((_, i) => !revealed[i] && handleReveal(i))}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs hover:text-white/80 hover:bg-white/10 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Reveal
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white/30 text-xs hover:text-white/60 transition-colors ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {checked && (
        <div
          className={`mx-5 mb-4 px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
            allCorrect
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-200"
              : "bg-amber-500/10 border border-amber-500/30 text-amber-200"
          }`}
        >
          {allCorrect ? (
            <>
              <CheckCircle className="w-4 h-4" /> All correct — well done!
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" /> Some answers aren&apos;t right yet. Try a hint?
            </>
          )}
        </div>
      )}
    </div>
  );
}

function BlankInput({
  value,
  onChange,
  width,
  state,
}: {
  value: string;
  onChange: (v: string) => void;
  width: number;
  state: "neutral" | "correct" | "incorrect" | "revealed";
}) {
  const stateClass =
    state === "correct"
      ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
      : state === "incorrect"
      ? "border-red-400 bg-red-500/15 text-red-100"
      : state === "revealed"
      ? "border-cyan-400/60 bg-cyan-500/10 text-cyan-100"
      : "border-violet-400/60 bg-violet-500/10 text-violet-100 focus:border-violet-300 focus:bg-violet-500/20";

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: `${width + 2}ch` }}
      className={`inline-block mx-0.5 px-1 py-0 rounded border font-mono text-sm outline-none transition-all ${stateClass}`}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
    />
  );
}

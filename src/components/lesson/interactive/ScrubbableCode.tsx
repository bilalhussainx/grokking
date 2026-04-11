"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Terminal } from "lucide-react";

/**
 * ScrubbableCode — line-by-line execution trace
 * ----------------------------------------------
 * Markdown usage:
 * ```trace
 * {
 *   "title": "sum_array walkthrough",
 *   "language": "python",
 *   "code": "def sum_array(arr):\n    total = 0\n    for x in arr:\n        total += x\n    return total\n\nprint(sum_array([1, 2, 3]))",
 *   "frames": [
 *     { "line": 1, "vars": {}, "note": "Function defined" },
 *     { "line": 2, "vars": { "arr": "[1, 2, 3]", "total": 0 } },
 *     { "line": 3, "vars": { "arr": "[1, 2, 3]", "total": 0, "x": 1 } },
 *     { "line": 4, "vars": { "arr": "[1, 2, 3]", "total": 1, "x": 1 } },
 *     ...
 *     { "line": 7, "vars": {}, "stdout": "6" }
 *   ]
 * }
 * ```
 *
 * Variables shown in a side panel; current line highlighted; stdout collected.
 * Pure JSON-driven — no real interpreter, the lesson author records the trace.
 */

export interface TraceFrame {
  line: number;
  vars?: Record<string, string | number>;
  note?: string;
  stdout?: string;
  highlight?: number[]; // optional extra lines to faintly highlight
}

export interface ScrubbableCodeProps {
  title?: string;
  language?: string;
  code: string;
  frames: TraceFrame[];
  speed?: number;
}

export default function ScrubbableCode({
  title,
  language = "python",
  code,
  frames,
  speed = 1100,
}: ScrubbableCodeProps) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(speed);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const frame = frames[idx] || { line: 1 };
  const lines = code.split("\n");

  // Accumulate stdout up to current frame
  const stdout = frames
    .slice(0, idx + 1)
    .map((f) => f.stdout)
    .filter(Boolean) as string[];

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setIdx((i) => {
        if (i >= frames.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speedMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speedMs, frames.length]);

  function togglePlay() {
    if (idx >= frames.length - 1) setIdx(0);
    setPlaying((p) => !p);
  }
  function step(d: number) {
    setPlaying(false);
    setIdx((i) => Math.max(0, Math.min(frames.length - 1, i + d)));
  }
  function reset() {
    setPlaying(false);
    setIdx(0);
  }

  return (
    <div className="my-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-teal-500/[0.02] overflow-hidden not-prose">
      {/* Header */}
      <div className="px-5 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-semibold text-emerald-200">
          {title || "Code Trace"}
        </span>
        <span className="ml-2 text-[10px] uppercase tracking-wider text-white/30">
          {language}
        </span>
        <span className="ml-auto text-xs text-white/40 font-mono">
          step {idx + 1} / {frames.length}
        </span>
      </div>

      <div className="grid md:grid-cols-[1.6fr_1fr] gap-0">
        {/* Code panel */}
        <div className="bg-black/40 p-4 overflow-x-auto md:border-r md:border-white/5 min-h-[200px]">
          <pre className="text-xs leading-relaxed font-mono">
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const isCurrent = frame.line === lineNum;
              const isFaded = (frame.highlight || []).includes(lineNum);
              return (
                <div
                  key={i}
                  className={`flex transition-colors ${
                    isCurrent
                      ? "bg-emerald-500/15 -mx-4 px-4 border-l-2 border-emerald-400"
                      : isFaded
                      ? "bg-white/[0.02] -mx-4 px-4"
                      : ""
                  }`}
                >
                  <span className="text-white/20 select-none w-7 shrink-0 text-right pr-2">
                    {lineNum}
                  </span>
                  <span
                    className={
                      isCurrent
                        ? "text-emerald-100"
                        : isFaded
                        ? "text-white/40"
                        : "text-white/55"
                    }
                  >
                    {line || " "}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>

        {/* Variables + stdout panel */}
        <div className="p-4 bg-white/[0.02] flex flex-col gap-3 min-h-[200px]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-2 font-semibold">
              Variables
            </div>
            <div className="space-y-1">
              {Object.keys(frame.vars || {}).length === 0 && (
                <div className="text-xs text-white/25 italic">No variables yet</div>
              )}
              {Object.entries(frame.vars || {}).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline gap-2 px-2 py-1 rounded bg-white/[0.03] border border-white/5"
                >
                  <span className="text-xs font-mono text-amber-300">{k}</span>
                  <span className="text-xs text-white/30">=</span>
                  <span className="text-xs font-mono text-emerald-200 truncate">
                    {String(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {frame.note && (
            <div className="px-2.5 py-2 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed">
              {frame.note}
            </div>
          )}

          {stdout.length > 0 && (
            <div className="mt-auto">
              <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1 font-semibold">
                stdout
              </div>
              <pre className="text-xs font-mono text-white/70 bg-black/40 rounded p-2 max-h-24 overflow-y-auto">
                {stdout.join("\n")}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center gap-2">
        <button
          onClick={() => step(-1)}
          disabled={idx === 0}
          className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => step(1)}
          disabled={idx >= frames.length - 1}
          className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        <button
          onClick={reset}
          className="p-1.5 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={idx}
          onChange={(e) => {
            setPlaying(false);
            setIdx(Number(e.target.value));
          }}
          className="flex-1 h-1 bg-white/10 rounded-full accent-emerald-400 cursor-pointer"
        />

        <select
          value={speedMs}
          onChange={(e) => setSpeedMs(Number(e.target.value))}
          className="text-xs bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white/60"
        >
          <option value={1800}>0.5x</option>
          <option value={1100}>1x</option>
          <option value={600}>2x</option>
          <option value={300}>4x</option>
        </select>
      </div>
    </div>
  );
}

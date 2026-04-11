"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Activity } from "lucide-react";

/**
 * AlgorithmVisualizer
 * --------------------
 * Drives an animated walk-through of an algorithm operating over a data structure.
 *
 * Markdown usage:
 * ```algoviz
 * {
 *   "title": "Sliding Window — Maximum Sum Subarray of Size K",
 *   "type": "array",            // "array" | "grid" | "tree" | "linkedlist"
 *   "data": [2, 1, 5, 1, 3, 2],
 *   "speed": 800,                // ms per frame, optional
 *   "frames": [
 *     {
 *       "highlight": [0, 1, 2],  // indices to highlight (or row/col pairs for grid)
 *       "secondary": [],         // optional, "ghost" highlight (e.g., visited)
 *       "label": "Window starts at index 0",
 *       "stats": { "sum": 8, "maxSum": 8 },
 *       "code": 3                // optional: code line to highlight
 *     },
 *     ...
 *   ],
 *   "code": "def max_sum(arr, k):\n    ..."   // optional, displayed alongside
 * }
 * ```
 *
 * For "tree" type, `data` is `{ nodes: [{id, value, x, y}], edges: [[from, to], ...] }`
 * For "grid" type, `data` is a 2D array; highlight is `[[r,c], ...]`
 * For "linkedlist", `data` is a flat array; highlight is indices.
 */

export interface AlgoVizFrame {
  highlight?: any[];
  secondary?: any[];
  label?: string;
  stats?: Record<string, string | number>;
  code?: number;
}

export interface AlgoVizProps {
  title?: string;
  type?: "array" | "grid" | "tree" | "linkedlist";
  data: any;
  frames: AlgoVizFrame[];
  speed?: number;
  code?: string;
}

export default function AlgorithmVisualizer({
  title,
  type = "array",
  data,
  frames,
  speed = 900,
  code,
}: AlgoVizProps) {
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(speed);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const frame = frames[frameIdx] || {};
  const hl = new Set((frame.highlight || []).map((h) => JSON.stringify(h)));
  const sec = new Set((frame.secondary || []).map((h) => JSON.stringify(h)));

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setFrameIdx((i) => {
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
    if (frameIdx >= frames.length - 1) setFrameIdx(0);
    setPlaying((p) => !p);
  }

  function step(delta: number) {
    setPlaying(false);
    setFrameIdx((i) => Math.max(0, Math.min(frames.length - 1, i + delta)));
  }

  function reset() {
    setPlaying(false);
    setFrameIdx(0);
  }

  function isHighlighted(key: any) {
    return hl.has(JSON.stringify(key));
  }
  function isSecondary(key: any) {
    return sec.has(JSON.stringify(key));
  }

  return (
    <div className="my-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.04] to-blue-500/[0.02] overflow-hidden not-prose">
      {/* Header */}
      <div className="px-5 py-3 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold text-cyan-200">
          {title || "Algorithm Visualizer"}
        </span>
        <span className="ml-auto text-xs text-white/40 font-mono">
          frame {frameIdx + 1} / {frames.length}
        </span>
      </div>

      {/* Visualization stage */}
      <div className="px-5 py-6 min-h-[180px] flex items-center justify-center">
        {type === "array" && (
          <ArrayView data={data} isHighlighted={isHighlighted} isSecondary={isSecondary} />
        )}
        {type === "linkedlist" && (
          <LinkedListView data={data} isHighlighted={isHighlighted} isSecondary={isSecondary} />
        )}
        {type === "grid" && (
          <GridView data={data} isHighlighted={isHighlighted} isSecondary={isSecondary} />
        )}
        {type === "tree" && (
          <TreeView data={data} isHighlighted={isHighlighted} isSecondary={isSecondary} />
        )}
      </div>

      {/* Label + stats */}
      {(frame.label || frame.stats) && (
        <div className="px-5 pb-3">
          {frame.label && (
            <p className="text-sm text-white/80 leading-relaxed">{frame.label}</p>
          )}
          {frame.stats && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(frame.stats).map(([k, v]) => (
                <div
                  key={k}
                  className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs"
                >
                  <span className="text-white/40 mr-1.5">{k}:</span>
                  <span className="text-cyan-300 font-mono font-semibold">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Optional code panel */}
      {code && (
        <div className="mx-5 mb-3 rounded-lg bg-black/40 border border-white/5 overflow-hidden">
          <pre className="text-xs leading-relaxed p-3 overflow-x-auto">
            {code.split("\n").map((line, i) => {
              const isCurrent = frame.code === i + 1;
              return (
                <div
                  key={i}
                  className={`flex ${
                    isCurrent ? "bg-cyan-500/15 -mx-3 px-3" : ""
                  }`}
                >
                  <span className="text-white/20 select-none w-7 shrink-0">
                    {i + 1}
                  </span>
                  <span className={isCurrent ? "text-cyan-200" : "text-white/60"}>
                    {line}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>
      )}

      {/* Controls */}
      <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center gap-2">
        <button
          onClick={() => step(-1)}
          disabled={frameIdx === 0}
          className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label="Previous frame"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={() => step(1)}
          disabled={frameIdx >= frames.length - 1}
          className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label="Next frame"
        >
          <SkipForward className="w-4 h-4" />
        </button>
        <button
          onClick={reset}
          className="p-1.5 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          aria-label="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={frameIdx}
          onChange={(e) => {
            setPlaying(false);
            setFrameIdx(Number(e.target.value));
          }}
          className="flex-1 h-1 bg-white/10 rounded-full accent-cyan-400 cursor-pointer"
        />

        {/* Speed control */}
        <select
          value={speedMs}
          onChange={(e) => setSpeedMs(Number(e.target.value))}
          className="text-xs bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white/60"
        >
          <option value={1500}>0.5x</option>
          <option value={900}>1x</option>
          <option value={500}>2x</option>
          <option value={250}>4x</option>
        </select>
      </div>
    </div>
  );
}

/* ─── Sub-views ─── */

function ArrayView({
  data,
  isHighlighted,
  isSecondary,
}: {
  data: any[];
  isHighlighted: (k: any) => boolean;
  isSecondary: (k: any) => boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {data.map((val, i) => {
        const hl = isHighlighted(i);
        const sec = isSecondary(i);
        return (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg font-mono text-sm font-bold border transition-all duration-300 ${
                hl
                  ? "bg-cyan-500/30 border-cyan-400 text-white scale-110 shadow-lg shadow-cyan-500/30"
                  : sec
                  ? "bg-purple-500/15 border-purple-400/40 text-purple-200"
                  : "bg-white/[0.04] border-white/10 text-white/70"
              }`}
            >
              {String(val)}
            </div>
            <span className="text-[10px] text-white/30 font-mono mt-1">{i}</span>
          </div>
        );
      })}
    </div>
  );
}

function LinkedListView({
  data,
  isHighlighted,
  isSecondary,
}: {
  data: any[];
  isHighlighted: (k: any) => boolean;
  isSecondary: (k: any) => boolean;
}) {
  return (
    <div className="flex flex-wrap gap-0 items-center justify-center">
      {data.map((val, i) => {
        const hl = isHighlighted(i);
        const sec = isSecondary(i);
        return (
          <div key={i} className="flex items-center">
            <div
              className={`relative px-4 py-2 rounded-lg font-mono text-sm font-bold border transition-all duration-300 ${
                hl
                  ? "bg-cyan-500/30 border-cyan-400 text-white scale-110 shadow-lg shadow-cyan-500/30"
                  : sec
                  ? "bg-purple-500/15 border-purple-400/40 text-purple-200"
                  : "bg-white/[0.04] border-white/10 text-white/70"
              }`}
            >
              {String(val)}
            </div>
            {i < data.length - 1 && (
              <span className="text-white/30 mx-1 select-none">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GridView({
  data,
  isHighlighted,
  isSecondary,
}: {
  data: any[][];
  isHighlighted: (k: any) => boolean;
  isSecondary: (k: any) => boolean;
}) {
  return (
    <div className="inline-block">
      {data.map((row, r) => (
        <div key={r} className="flex">
          {row.map((val, c) => {
            const hl = isHighlighted([r, c]);
            const sec = isSecondary([r, c]);
            return (
              <div
                key={c}
                className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-xs font-bold border m-0.5 transition-all duration-300 ${
                  hl
                    ? "bg-cyan-500/30 border-cyan-400 text-white scale-110 shadow-md shadow-cyan-500/30"
                    : sec
                    ? "bg-purple-500/15 border-purple-400/40 text-purple-200"
                    : "bg-white/[0.04] border-white/10 text-white/60"
                }`}
              >
                {String(val)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function TreeView({
  data,
  isHighlighted,
  isSecondary,
}: {
  data: { nodes: { id: string | number; value: any; x: number; y: number }[]; edges: [any, any][] };
  isHighlighted: (k: any) => boolean;
  isSecondary: (k: any) => boolean;
}) {
  const { nodes, edges } = data;
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs, 0);
  const minY = Math.min(...ys, 0);
  const maxX = Math.max(...xs, 100);
  const maxY = Math.max(...ys, 100);
  const w = maxX - minX + 80;
  const h = maxY - minY + 80;

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <svg
      viewBox={`${minX - 40} ${minY - 40} ${w} ${h}`}
      className="max-w-full"
      style={{ maxHeight: 320 }}
    >
      {edges.map(([from, to], i) => {
        const a = nodeMap.get(from);
        const b = nodeMap.get(to);
        if (!a || !b) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={2}
          />
        );
      })}
      {nodes.map((n) => {
        const hl = isHighlighted(n.id);
        const sec = isSecondary(n.id);
        const fill = hl
          ? "rgba(34,211,238,0.35)"
          : sec
          ? "rgba(168,85,247,0.20)"
          : "rgba(255,255,255,0.05)";
        const stroke = hl
          ? "rgb(34,211,238)"
          : sec
          ? "rgba(168,85,247,0.6)"
          : "rgba(255,255,255,0.15)";
        return (
          <g key={n.id} className="transition-all duration-300">
            <circle
              cx={n.x}
              cy={n.y}
              r={hl ? 22 : 18}
              fill={fill}
              stroke={stroke}
              strokeWidth={hl ? 2.5 : 1.5}
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              className="font-mono font-bold"
              fontSize={12}
              fill={hl ? "#fff" : "rgba(255,255,255,0.7)"}
            >
              {String(n.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

"use client";

import { useState } from "react";
import { Network, Info } from "lucide-react";

/**
 * SystemDesignCanvas — annotated architecture diagram
 * -----------------------------------------------------
 * Markdown usage:
 * ```sysdiag
 * {
 *   "title": "URL Shortener — High-Level Architecture",
 *   "width": 600,
 *   "height": 360,
 *   "nodes": [
 *     { "id": "client", "label": "Client", "x": 60,  "y": 180, "kind": "client" },
 *     { "id": "lb",     "label": "Load Balancer", "x": 200, "y": 180, "kind": "infra" },
 *     { "id": "api",    "label": "API Server",    "x": 340, "y": 180, "kind": "service" },
 *     { "id": "cache",  "label": "Redis Cache",   "x": 480, "y": 100, "kind": "cache" },
 *     { "id": "db",     "label": "PostgreSQL",    "x": 480, "y": 260, "kind": "db" }
 *   ],
 *   "edges": [
 *     { "from": "client", "to": "lb",    "label": "HTTPS" },
 *     { "from": "lb",     "to": "api",   "label": "round-robin" },
 *     { "from": "api",    "to": "cache", "label": "GET key", "style": "dashed" },
 *     { "from": "api",    "to": "db",    "label": "writes" }
 *   ],
 *   "annotations": {
 *     "lb":    "Distributes traffic across stateless app servers. Health-checks every 5s. Sticky sessions disabled — any server can handle any request.",
 *     "api":   "Stateless Node.js servers. Auto-scaling group of 4-20 instances based on CPU.",
 *     "cache": "Read-through cache. 95% of GETs hit Redis, never touching the DB. TTL: 24h.",
 *     "db":    "Primary handles writes; 2 read replicas. Sharded by short-code prefix at 100M rows."
 *   }
 * }
 * ```
 *
 * Click any node to see its annotation. Designed for "Grokking System Design" walkthroughs.
 */

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  kind?: "client" | "infra" | "service" | "cache" | "db" | "queue" | "external";
}
interface Edge {
  from: string;
  to: string;
  label?: string;
  style?: "solid" | "dashed";
}

export interface SystemDesignCanvasProps {
  title?: string;
  width?: number;
  height?: number;
  nodes: Node[];
  edges: Edge[];
  annotations?: Record<string, string>;
}

const KIND_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  client: { fill: "rgba(96,165,250,0.15)", stroke: "rgb(96,165,250)", text: "#dbeafe" },
  infra: { fill: "rgba(251,146,60,0.15)", stroke: "rgb(251,146,60)", text: "#ffedd5" },
  service: { fill: "rgba(34,211,238,0.15)", stroke: "rgb(34,211,238)", text: "#cffafe" },
  cache: { fill: "rgba(251,191,36,0.15)", stroke: "rgb(251,191,36)", text: "#fef3c7" },
  db: { fill: "rgba(52,211,153,0.15)", stroke: "rgb(52,211,153)", text: "#d1fae5" },
  queue: { fill: "rgba(168,85,247,0.15)", stroke: "rgb(168,85,247)", text: "#ede9fe" },
  external: { fill: "rgba(244,114,182,0.15)", stroke: "rgb(244,114,182)", text: "#fce7f3" },
  default: { fill: "rgba(255,255,255,0.06)", stroke: "rgba(255,255,255,0.25)", text: "#fff" },
};

const NODE_W = 110;
const NODE_H = 44;

export default function SystemDesignCanvas({
  title,
  width = 600,
  height = 360,
  nodes,
  edges,
  annotations = {},
}: SystemDesignCanvasProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="my-8 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.04] to-indigo-500/[0.02] overflow-hidden not-prose">
      <div className="px-5 py-3 bg-blue-500/10 border-b border-blue-500/20 flex items-center gap-2">
        <Network className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-semibold text-blue-200">
          {title || "System Design"}
        </span>
        <span className="ml-auto text-[10px] text-white/40">
          Click nodes to learn more
        </span>
      </div>

      <div className="grid md:grid-cols-[1.7fr_1fr] gap-0">
        {/* Diagram */}
        <div className="p-3 md:border-r md:border-white/5 bg-black/20">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            style={{ maxHeight: 420 }}
          >
            <defs>
              <marker
                id="sd-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.4)" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((e, i) => {
              const a = nodeMap.get(e.from);
              const b = nodeMap.get(e.to);
              if (!a || !b) return null;
              // Trim to box edges
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const len = Math.sqrt(dx * dx + dy * dy) || 1;
              const ux = dx / len;
              const uy = dy / len;
              const ax = a.x + ux * (NODE_W / 2);
              const ay = a.y + uy * (NODE_H / 2);
              const bx = b.x - ux * (NODE_W / 2 + 4);
              const by = b.y - uy * (NODE_H / 2 + 4);
              const mx = (ax + bx) / 2;
              const my = (ay + by) / 2;
              return (
                <g key={i}>
                  <line
                    x1={ax}
                    y1={ay}
                    x2={bx}
                    y2={by}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={1.4}
                    strokeDasharray={e.style === "dashed" ? "5,4" : undefined}
                    markerEnd="url(#sd-arrow)"
                  />
                  {e.label && (
                    <text
                      x={mx}
                      y={my - 4}
                      fontSize={9}
                      fill="rgba(255,255,255,0.55)"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const c = KIND_COLORS[n.kind || "default"] || KIND_COLORS.default;
              const isSelected = selected === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x - NODE_W / 2}, ${n.y - NODE_H / 2})`}
                  className="cursor-pointer"
                  onClick={() => setSelected(isSelected ? null : n.id)}
                >
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx={8}
                    fill={c.fill}
                    stroke={c.stroke}
                    strokeWidth={isSelected ? 2.5 : 1.4}
                    className="transition-all"
                    style={isSelected ? { filter: `drop-shadow(0 0 10px ${c.stroke})` } : {}}
                  />
                  <text
                    x={NODE_W / 2}
                    y={NODE_H / 2 + 4}
                    fontSize={11}
                    fontWeight={600}
                    fill={c.text}
                    textAnchor="middle"
                    className="select-none"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Annotation panel */}
        <div className="p-5 bg-white/[0.02] min-h-[200px]">
          {selected && annotations[selected] ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-sm font-semibold text-blue-200">
                  {nodeMap.get(selected)?.label}
                </span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                {annotations[selected]}
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2">
              <Network className="w-6 h-6 text-white/15" />
              <p className="text-xs text-white/30 italic">
                {selected
                  ? "No annotation for this node."
                  : "Click any component in the diagram to read about its role."}
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-5 pt-3 border-t border-white/5">
            <div className="text-[10px] uppercase tracking-wider text-white/30 mb-2 font-semibold">
              Legend
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set(nodes.map((n) => n.kind || "default"))).map((k) => {
                const c = KIND_COLORS[k] || KIND_COLORS.default;
                return (
                  <div
                    key={k}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px]"
                    style={{ backgroundColor: c.fill, color: c.text, border: `1px solid ${c.stroke}` }}
                  >
                    {k}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";

/**
 * FinanceCalculator — interactive financial widget
 * --------------------------------------------------
 * Markdown usage:
 * ```calculator
 * {
 *   "type": "compound-interest",
 *   "title": "How $500/month grows over time",
 *   "inputs": [
 *     { "id": "principal", "label": "Initial Investment", "default": 10000, "min": 0, "max": 100000, "step": 500, "prefix": "$" },
 *     { "id": "rate",      "label": "Annual Return",      "default": 7,     "min": 0, "max": 20,     "step": 0.5, "suffix": "%" },
 *     { "id": "years",     "label": "Years",              "default": 30,    "min": 1, "max": 50,     "step": 1 },
 *     { "id": "monthly",   "label": "Monthly Contribution","default": 500,   "min": 0, "max": 5000,  "step": 50, "prefix": "$" }
 *   ]
 * }
 * ```
 *
 * Built-in `type` values:
 *   - "compound-interest" — needs principal, rate, years, monthly
 *   - "loan"              — needs principal, rate, years (monthly payment + total interest)
 *   - "retirement"        — needs principal, rate, years, monthly (alias of compound-interest)
 *   - "npv"               — needs rate, cashflows (array of yearly cashflows)
 */

interface InputDef {
  id: string;
  label: string;
  default: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export interface FinanceCalculatorProps {
  type: "compound-interest" | "loan" | "retirement" | "npv";
  title?: string;
  inputs: InputDef[];
  cashflows?: number[]; // for npv
}

export default function FinanceCalculator({
  type,
  title,
  inputs,
  cashflows = [],
}: FinanceCalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(inputs.map((i) => [i.id, i.default]))
  );

  const result = useMemo(() => {
    switch (type) {
      case "compound-interest":
      case "retirement":
        return computeCompoundInterest(values);
      case "loan":
        return computeLoan(values);
      case "npv":
        return computeNPV(values, cashflows);
      default:
        return { summary: [], series: [] };
    }
  }, [type, values, cashflows]);

  return (
    <div className="my-8 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] to-orange-500/[0.02] overflow-hidden not-prose">
      <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-semibold text-amber-200">
          {title || titleForType(type)}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* Inputs */}
        <div className="p-5 space-y-4 md:border-r md:border-white/5">
          {inputs.map((input) => {
            const v = values[input.id];
            return (
              <div key={input.id}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label className="text-xs text-white/60 font-medium">
                    {input.label}
                  </label>
                  <span className="text-sm font-mono font-semibold text-amber-300">
                    {input.prefix || ""}
                    {formatNumber(v)}
                    {input.suffix || ""}
                  </span>
                </div>
                <input
                  type="range"
                  min={input.min}
                  max={input.max}
                  step={input.step || 1}
                  value={v}
                  onChange={(e) =>
                    setValues({ ...values, [input.id]: Number(e.target.value) })
                  }
                  className="w-full h-1.5 bg-white/10 rounded-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/25 mt-1 font-mono">
                  <span>
                    {input.prefix || ""}
                    {formatNumber(input.min)}
                  </span>
                  <span>
                    {input.prefix || ""}
                    {formatNumber(input.max)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Result */}
        <div className="p-5 flex flex-col gap-3">
          <div className="space-y-2">
            {result.summary.map((row, i) => (
              <div
                key={i}
                className={`flex items-baseline justify-between px-3 py-2 rounded-lg ${
                  row.highlight
                    ? "bg-amber-500/15 border border-amber-500/30"
                    : "bg-white/[0.03] border border-white/5"
                }`}
              >
                <span className="text-xs text-white/60">{row.label}</span>
                <span
                  className={`text-sm font-mono font-bold ${
                    row.highlight ? "text-amber-300" : "text-white/85"
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {result.series.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/30 mb-2 font-semibold">
                <TrendingUp className="w-3 h-3" />
                Growth Curve
              </div>
              <GrowthChart series={result.series} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Inline SVG line chart ─── */

function GrowthChart({ series }: { series: { x: number; y: number; label?: string }[] }) {
  const w = 320;
  const h = 120;
  const pad = 8;

  if (series.length < 2) return null;

  const xs = series.map((p) => p.x);
  const ys = series.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0;
  const maxY = Math.max(...ys);

  const sx = (x: number) =>
    pad + ((x - minX) / (maxX - minX || 1)) * (w - pad * 2);
  const sy = (y: number) =>
    h - pad - ((y - minY) / (maxY - minY || 1)) * (h - pad * 2);

  const path = series
    .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`)
    .join(" ");

  const area = `${path} L${sx(maxX).toFixed(1)},${sy(0).toFixed(1)} L${sx(minX).toFixed(1)},${sy(0).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="gc-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(251,191,36,0.4)" />
          <stop offset="100%" stopColor="rgba(251,191,36,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#gc-grad)" />
      <path
        d={path}
        fill="none"
        stroke="rgb(251,191,36)"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* axis labels */}
      <text x={pad} y={h - 1} fontSize={8} fill="rgba(255,255,255,0.3)">
        Year {minX}
      </text>
      <text
        x={w - pad}
        y={h - 1}
        fontSize={8}
        fill="rgba(255,255,255,0.3)"
        textAnchor="end"
      >
        Year {maxX}
      </text>
      <text x={pad} y={pad + 6} fontSize={8} fill="rgba(255,255,255,0.3)">
        ${formatNumber(maxY)}
      </text>
    </svg>
  );
}

/* ─── Computation engines ─── */

interface CalcResult {
  summary: { label: string; value: string; highlight?: boolean }[];
  series: { x: number; y: number; label?: string }[];
}

function computeCompoundInterest(v: Record<string, number>): CalcResult {
  const principal = v.principal || 0;
  const ratePct = v.rate || 0;
  const years = Math.max(1, v.years || 1);
  const monthly = v.monthly || 0;

  const r = ratePct / 100 / 12;
  const series: { x: number; y: number }[] = [];
  let balance = principal;
  let totalContrib = principal;
  series.push({ x: 0, y: balance });

  for (let yr = 1; yr <= years; yr++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + monthly;
      totalContrib += monthly;
    }
    series.push({ x: yr, y: balance });
  }

  const interest = balance - totalContrib;

  return {
    summary: [
      { label: "Total contributed", value: "$" + formatNumber(Math.round(totalContrib)) },
      { label: "Interest earned", value: "$" + formatNumber(Math.round(interest)) },
      {
        label: "Final balance",
        value: "$" + formatNumber(Math.round(balance)),
        highlight: true,
      },
    ],
    series,
  };
}

function computeLoan(v: Record<string, number>): CalcResult {
  const principal = v.principal || 0;
  const ratePct = v.rate || 0;
  const years = Math.max(1, v.years || 1);
  const n = years * 12;
  const r = ratePct / 100 / 12;

  const monthlyPayment =
    r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
  const totalPaid = monthlyPayment * n;
  const totalInterest = totalPaid - principal;

  // Amortization series — remaining balance over time
  const series: { x: number; y: number }[] = [];
  let bal = principal;
  series.push({ x: 0, y: bal });
  for (let yr = 1; yr <= years; yr++) {
    for (let m = 0; m < 12; m++) {
      const interest = bal * r;
      const principalPaid = monthlyPayment - interest;
      bal -= principalPaid;
    }
    series.push({ x: yr, y: Math.max(0, bal) });
  }

  return {
    summary: [
      { label: "Monthly payment", value: "$" + formatNumber(Math.round(monthlyPayment)), highlight: true },
      { label: "Total interest", value: "$" + formatNumber(Math.round(totalInterest)) },
      { label: "Total paid", value: "$" + formatNumber(Math.round(totalPaid)) },
    ],
    series,
  };
}

function computeNPV(v: Record<string, number>, cashflows: number[]): CalcResult {
  const ratePct = v.rate || 0;
  const r = ratePct / 100;
  let npv = 0;
  const series: { x: number; y: number }[] = [];
  let cum = 0;
  cashflows.forEach((cf, t) => {
    const pv = cf / Math.pow(1 + r, t);
    npv += pv;
    cum += pv;
    series.push({ x: t, y: cum });
  });

  return {
    summary: [
      { label: "Discount rate", value: ratePct.toFixed(1) + "%" },
      { label: "NPV", value: "$" + formatNumber(Math.round(npv)), highlight: true },
      { label: "Cashflows", value: cashflows.length + " periods" },
    ],
    series,
  };
}

/* ─── Helpers ─── */

function formatNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1_000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return n.toString();
}

function titleForType(type: string): string {
  return (
    {
      "compound-interest": "Compound Interest Calculator",
      loan: "Loan Calculator",
      retirement: "Retirement Projection",
      npv: "Net Present Value",
    }[type] || "Calculator"
  );
}

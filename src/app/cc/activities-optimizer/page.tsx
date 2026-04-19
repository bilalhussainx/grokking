"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Sparkles, ListOrdered, Search } from "lucide-react";
import Link from "next/link";
import SuggestionCard from "@/components/cc/activities/SuggestionCard";
import ReorderPanel from "@/components/cc/activities/ReorderPanel";
import GapAnalysis from "@/components/cc/activities/GapAnalysis";

type Tab = "review" | "reorder" | "gaps";

interface ActivitySuggestion {
  position: number;
  currentDescription: string;
  suggestedDescription: string;
  impactScore: number;
  impactReason: string;
  suggestions: string[];
}

interface HonorSuggestion {
  position: number;
  currentDescription: string;
  suggestedDescription: string;
  suggestions: string[];
}

interface ActivityRow {
  position: number;
  organization: string | null;
  role: string | null;
  activity_type: string | null;
  impact_score: number | null;
}

interface OptimizeResult {
  activities: ActivitySuggestion[];
  honors: HonorSuggestion[];
  recommendedOrder: number[];
  orderingRationale: string;
  gaps: { category: string; severity: string; suggestion: string }[];
  flags: { type: string; position: number; message: string }[];
  overallStrength: number;
}

export default function ActivitiesOptimizerPage() {
  const [tab, setTab] = useState<Tab>("review");
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [error, setError] = useState("");

  const runOptimization = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cc/activities/optimize", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Optimization failed");
        return;
      }
      setResult(data);
    } catch {
      setError("Connection error — try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/cc/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.activities) setActivities(d.activities);
      })
      .catch(() => {});
  }, []);

  const handleAcceptDescription = async (position: number, description: string) => {
    await fetch("/api/cc/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section: "activity",
        position,
        data: { description_150: description },
      }),
    });
  };

  const handleAcceptHonorDescription = async (position: number, description: string) => {
    await fetch("/api/cc/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section: "honor",
        position,
        data: { description_100: description },
      }),
    });
  };

  const handleAcceptOrder = async (newOrder: number[]) => {
    for (let i = 0; i < newOrder.length; i++) {
      await fetch("/api/cc/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "activity_reorder",
          oldPosition: newOrder[i],
          newPosition: i + 1,
        }),
      });
    }
  };

  const TABS = [
    { key: "review" as Tab, label: "Review", icon: Sparkles },
    { key: "reorder" as Tab, label: "Reorder", icon: ListOrdered },
    { key: "gaps" as Tab, label: "Gaps", icon: Search },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="text-white/30 hover:text-white/50">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Activities Optimizer</h1>
          <p className="text-sm text-white/40 mt-0.5">AI analysis of your activities and honors</p>
        </div>
      </div>

      {!result && !loading && (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-4" />
          <p className="text-sm text-white/50 mb-4">
            Get AI-powered suggestions to strengthen your activities list
          </p>
          <button
            onClick={runOptimization}
            className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
          >
            Run Optimization
          </button>
          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-[#D4AF37] mx-auto mb-3 animate-spin" />
          <p className="text-sm text-white/40">Analyzing your activities and honors...</p>
        </div>
      )}

      {result && (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-6">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.key
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}

            <div className="ml-auto">
              <button
                onClick={runOptimization}
                disabled={loading}
                className="px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                Re-analyze
              </button>
            </div>
          </div>

          {/* Tab content */}
          {tab === "review" && (
            <div className="space-y-3">
              {result.activities.length > 0 && (
                <>
                  <h2 className="text-xs text-white/40 uppercase tracking-wide">Activities</h2>
                  {result.activities.map((a) => {
                    const act = activities.find((x) => x.position === a.position);
                    return (
                      <SuggestionCard
                        key={`act-${a.position}`}
                        position={a.position}
                        type="activity"
                        label={act?.organization || act?.activity_type || `Activity ${a.position}`}
                        currentDescription={a.currentDescription}
                        suggestedDescription={a.suggestedDescription}
                        impactScore={a.impactScore}
                        impactReason={a.impactReason}
                        suggestions={a.suggestions}
                        charLimit={150}
                        onAccept={handleAcceptDescription}
                      />
                    );
                  })}
                </>
              )}

              {result.honors.length > 0 && (
                <>
                  <h2 className="text-xs text-white/40 uppercase tracking-wide mt-6">Honors</h2>
                  {result.honors.map((h) => (
                    <SuggestionCard
                      key={`hon-${h.position}`}
                      position={h.position}
                      type="honor"
                      label={`Honor ${h.position}`}
                      currentDescription={h.currentDescription}
                      suggestedDescription={h.suggestedDescription}
                      suggestions={h.suggestions}
                      charLimit={100}
                      onAccept={handleAcceptHonorDescription}
                    />
                  ))}
                </>
              )}
            </div>
          )}

          {tab === "reorder" && (
            <ReorderPanel
              activities={activities}
              recommendedOrder={result.recommendedOrder}
              rationale={result.orderingRationale}
              onAcceptOrder={handleAcceptOrder}
            />
          )}

          {tab === "gaps" && (
            <GapAnalysis
              gaps={result.gaps}
              flags={result.flags}
              overallStrength={result.overallStrength}
            />
          )}
        </>
      )}
    </div>
  );
}

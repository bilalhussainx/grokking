"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, Sparkles, ListOrdered, Search, Pencil, Upload, GraduationCap, PenLine, ArrowRight } from "lucide-react";
import Link from "next/link";
import SuggestionCard from "@/components/cc/activities/SuggestionCard";
import ReorderPanel from "@/components/cc/activities/ReorderPanel";
import GapAnalysis from "@/components/cc/activities/GapAnalysis";
import ResumeUpload from "@/components/cc/activities/ResumeUpload";
import BulletEditor from "@/components/cc/activities/BulletEditor";
import { Tabs, type TabOption } from "@/components/cc/Tabs";
import NarrativeReport from "@/components/activities/NarrativeReport";

type Tab = "edit" | "review" | "reorder" | "gaps";

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
  description_150: string | null;
  impact_score: number | null;
}

interface HonorRow {
  position: number;
  title: string | null;
  level: string | null;
  description_100: string | null;
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
  const [tab, setTab] = useState<Tab>("edit");
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [honors, setHonors] = useState<HonorRow[]>([]);
  const [error, setError] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/cc/profile");
      const d = await res.json();
      if (d.activities) setActivities(d.activities);
      if (d.honors) setHonors(d.honors);
    } catch {}
  }, []);

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
      setTab("review");
    } catch {
      setError("Connection error — try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSaveActivity = async (position: number, description: string) => {
    await fetch("/api/cc/profile/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position, description_150: description }),
    });
    await loadProfile();
  };

  const handleSaveHonor = async (position: number, description: string) => {
    await fetch("/api/cc/profile/honors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position, description_100: description }),
    });
    await loadProfile();
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
    await loadProfile();
  };

  const TABS = [
    { key: "edit" as Tab, label: "Edit", icon: Pencil },
    { key: "review" as Tab, label: "Review", icon: Sparkles, requiresResult: true },
    { key: "reorder" as Tab, label: "Reorder", icon: ListOrdered, requiresResult: true },
    { key: "gaps" as Tab, label: "Gaps", icon: Search, requiresResult: true },
  ];

  const hasContent = activities.length > 0 || honors.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/profile" className="text-white/30 hover:text-white/50">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Activities Optimizer</h1>
          <p className="text-sm text-white/40 mt-0.5">Edit bullets, get AI feedback, run full review</p>
        </div>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-white/10 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          {showUpload ? "Hide" : "Import resume"}
        </button>
      </div>

      {showUpload && <ResumeUpload onImported={() => { loadProfile(); setShowUpload(false); }} />}

      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <Tabs
          ariaLabel="Activities optimizer sections"
          active={tab}
          onChange={setTab}
          options={TABS.map((t) => ({
            value: t.key,
            label: t.label,
            icon: t.icon,
            disabled: t.requiresResult && !result,
          })) satisfies TabOption<Tab>[]}
        />

        <button
          onClick={runOptimization}
          disabled={loading || !hasContent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] disabled:opacity-40 transition-colors shrink-0"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {loading ? "Analyzing..." : result ? "Re-analyze" : "Run full review"}
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

      {hasContent && <NarrativeReport activitiesCount={activities.length} />}

      {tab === "edit" && (
        <div className="space-y-4">
          {!hasContent && (
            <div className="text-center py-12 rounded-xl border border-white/10 bg-white/5">
              <Sparkles className="w-8 h-8 text-[#D4AF37]/40 mx-auto mb-3" />
              <p className="text-sm text-white/50 mb-2">No activities or honors yet</p>
              <p className="text-xs text-white/30 mb-4">Import a resume or add entries from your profile</p>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/20 transition-colors"
              >
                Import from resume
              </button>
            </div>
          )}

          {activities.length > 0 && (
            <>
              <h2 className="text-xs text-white/40 uppercase tracking-wide">Activities</h2>
              {activities.map((a) => (
                <BulletEditor
                  key={`a-${a.position}`}
                  position={a.position}
                  kind="activity"
                  label={a.organization || a.role || a.activity_type || `Activity ${a.position}`}
                  initialText={a.description_150 || ""}
                  charLimit={150}
                  organization={a.organization}
                  role={a.role}
                  onSave={handleSaveActivity}
                />
              ))}
            </>
          )}

          {honors.length > 0 && (
            <>
              <h2 className="text-xs text-white/40 uppercase tracking-wide mt-6">Honors</h2>
              {honors.map((h) => (
                <BulletEditor
                  key={`h-${h.position}`}
                  position={h.position}
                  kind="honor"
                  label={h.title || `Honor ${h.position}`}
                  initialText={h.description_100 || ""}
                  charLimit={100}
                  organization={h.level}
                  onSave={handleSaveHonor}
                />
              ))}
            </>
          )}
        </div>
      )}

      {loading && tab !== "edit" && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-[#D4AF37] mx-auto mb-3 animate-spin" />
          <p className="text-sm text-white/40">Analyzing your activities and honors...</p>
        </div>
      )}

      {result && tab === "review" && (
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
                    onAccept={handleSaveActivity}
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
                  onAccept={handleSaveHonor}
                />
              ))}
            </>
          )}
        </div>
      )}

      {result && tab === "reorder" && (
        <ReorderPanel
          activities={activities}
          recommendedOrder={result.recommendedOrder}
          rationale={result.orderingRationale}
          onAcceptOrder={handleAcceptOrder}
        />
      )}

      {result && tab === "gaps" && (
        <GapAnalysis
          gaps={result.gaps}
          flags={result.flags}
          overallStrength={result.overallStrength}
        />
      )}

      {result && (tab === "review" || tab === "gaps") && (
        <SupplementHandoff strength={result.overallStrength} />
      )}
    </div>
  );
}

function SupplementHandoff({ strength }: { strength: number }) {
  const pct = Math.round(strength * 100);
  const ready = pct >= 60;
  const headline = ready
    ? "Activities are in good shape — time to start supplements"
    : "Polish the flagged bullets first, then jump into supplements";
  const sub = ready
    ? "Coach Kairos will pull these activities into every supplement brainstorm so you get topic ideas grounded in what you've actually done."
    : "You can still start drafting — Coach uses your latest activities as brainstorm context, so updates flow through automatically.";

  return (
    <div className="mt-8 p-5 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 to-transparent">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
          <PenLine className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{headline}</h3>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">{sub}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Link
          href="/my-schools"
          className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] transition-colors"
        >
          <span className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Pick a school &rarr; Supplements
          </span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/cc/essays"
          className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Open Coach Kairos (essays)
          </span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <p className="text-[11px] text-white/30 mt-3">
        Tip: open a school from <span className="text-white/50">My Schools</span> &rarr; Supplements tab, then press
        <span className="text-white/50"> Start</span> on any prompt. Coach opens in brainstorm mode with your activities already loaded.
      </p>
    </div>
  );
}

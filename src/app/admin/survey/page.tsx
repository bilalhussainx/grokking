"use client";

import { useState } from "react";

interface SurveyResponse {
  id: string;
  created_at: string;
  name: string;
  email: string;
  role: string;
  subject: string;
  frustration: string;
  ai_experience: string;
  confidence_before: number;
  confidence_after: number;
  one_sentence: string;
  clarity: string;
  personalization: string;
  most_useful: string;
  missing: string;
  comparison: string;
  use_free: string;
  pay: string;
  nps: number;
  other: string;
  submitted_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  student_hs: "High school",
  student_uni: "University",
  teacher: "Teacher/Tutor",
  parent: "Parent",
  professional: "Professional",
  other: "Other",
};

const PERSONALIZATION_LABELS: Record<string, string> = {
  very: "Felt personalized",
  middle: "Mixed",
  generic: "Felt generic",
};

const COMPARISON_LABELS: Record<string, string> = {
  better_all: "Better than all",
  better_some: "Better than some",
  same: "About the same",
  worse: "Worse",
};

const USE_FREE_LABELS: Record<string, string> = {
  def_yes: "Definitely yes",
  prob_yes: "Probably yes",
  not_sure: "Not sure",
  prob_no: "Probably not",
};

const AI_EXPERIENCE_LABELS: Record<string, string> = {
  regularly: "Regularly",
  few_times: "A few times",
  never: "Never used AI to study",
};

type QualTab = "pain" | "impressions" | "worked" | "missing_tab" | "pay_tab";

export default function SurveyDashboard() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SurveyResponse[] | null>(null);
  const [activeTab, setActiveTab] = useState<QualTab>("pain");
  const [copied, setCopied] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/submissions?password=${encodeURIComponent(password)}`);
      if (res.status === 401) {
        setError("Incorrect password");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json.responses || []);
    } catch {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-white text-center">Survey Dashboard</h1>
          <p className="text-sm text-gray-400 text-center">Enter admin password to view responses</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#f0a855]"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#f0a855] text-gray-950 font-semibold hover:bg-[#e09a45] transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "View Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  const n = data.length;
  if (n === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">No responses yet.</p>
      </div>
    );
  }

  // Metrics
  const avgNPS = data.reduce((s, r) => s + (r.nps ?? 0), 0) / n;
  const promoters = data.filter((r) => r.nps >= 9).length;
  const detractors = data.filter((r) => r.nps <= 6).length;
  const npsScore = Math.round(((promoters - detractors) / n) * 100);
  const avgBefore = data.reduce((s, r) => s + (r.confidence_before ?? 0), 0) / n;
  const avgAfter = data.reduce((s, r) => s + (r.confidence_after ?? 0), 0) / n;
  const delta = avgAfter - avgBefore;

  // Count helpers
  function countField(field: keyof SurveyResponse) {
    const counts: Record<string, number> = {};
    data!.forEach((r) => {
      const val = r[field] as string;
      if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  }

  function BarChart({ counts, labels }: { counts: Record<string, number>; labels: Record<string, string> }) {
    const total = Object.values(counts).reduce((s, c) => s + c, 0) || 1;
    const entries = Object.keys(labels).map((key) => ({
      key,
      label: labels[key],
      count: counts[key] || 0,
      pct: Math.round(((counts[key] || 0) / total) * 100),
    }));

    return (
      <div className="space-y-2.5">
        {entries.map((e) => (
          <div key={e.key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">{e.label}</span>
              <span className="text-gray-500">{e.pct}% [{e.count}]</span>
            </div>
            <div className="bg-gray-800 rounded-full h-2">
              <div
                className="bg-[#f0a855] rounded-full h-2 transition-all"
                style={{ width: `${e.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Qualitative tabs
  const QUAL_TABS: { id: QualTab; label: string; field: keyof SurveyResponse }[] = [
    { id: "pain", label: "Pain Points", field: "frustration" },
    { id: "impressions", label: "First Impressions", field: "one_sentence" },
    { id: "worked", label: "What Worked", field: "most_useful" },
    { id: "missing_tab", label: "What's Missing", field: "missing" },
    { id: "pay_tab", label: "Willingness to Pay", field: "pay" },
  ];

  const activeField = QUAL_TABS.find((t) => t.id === activeTab)!.field;
  const qualResponses = data.filter((r) => r[activeField]);

  // Export
  function copyDMZ() {
    const roleCounts = countField("role");
    const roleTotal = Object.values(roleCounts).reduce((s, c) => s + c, 0) || 1;
    const roleLines = Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${Math.round((v / roleTotal) * 100)}% ${ROLE_LABELS[k] || k}`)
      .join(", ");

    const persoCounts = countField("personalization");
    const persoTotal = Object.values(persoCounts).reduce((s, c) => s + c, 0) || 1;
    const persoPct = Math.round(((persoCounts["very"] || 0) / persoTotal) * 100);

    const compCounts = countField("comparison");
    const compTotal = Object.values(compCounts).reduce((s, c) => s + c, 0) || 1;
    const betterPct = Math.round((((compCounts["better_all"] || 0) + (compCounts["better_some"] || 0)) / compTotal) * 100);

    const useCounts = countField("use_free");
    const useTotal = Object.values(useCounts).reduce((s, c) => s + c, 0) || 1;
    const usePct = Math.round((((useCounts["def_yes"] || 0) + (useCounts["prob_yes"] || 0)) / useTotal) * 100);

    const impressions = data!.filter((r) => r.one_sentence).slice(0, 3);
    const missingList = data!.filter((r) => r.missing).slice(0, 4);
    const payList = data!.filter((r) => r.pay).slice(0, 4);

    const text = `SAMSARA FOCUS GROUP SUMMARY
Generated: ${new Date().toLocaleDateString()}

PARTICIPANTS: ${n} testers
ROLES: ${roleLines}

KEY METRICS:
- NPS Score: ${avgNPS.toFixed(1)}/10 average (${Math.round((promoters / n) * 100)}% promoters, ${Math.round((detractors / n) * 100)}% detractors)
- Net Promoter Score: ${npsScore}%
- Confidence improvement: ${avgBefore.toFixed(1)} → ${avgAfter.toFixed(1)} out of 5 (+${delta.toFixed(1)} avg)
- ${persoPct}% said the AI felt personalized
- ${betterPct}% rated it better than existing alternatives
- ${usePct}% would use it regularly if free

FIRST IMPRESSIONS (selected quotes):
${impressions.map((r) => `- "${r.one_sentence}" — ${r.name || "Anonymous"}`).join("\n")}

WHAT'S MISSING (top feedback):
${missingList.map((r) => `- "${r.missing}" — ${r.name || "Anonymous"}`).join("\n")}

WILLINGNESS TO PAY:
${payList.map((r) => `- "${r.pay}" — ${r.name || "Anonymous"}`).join("\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Survey Dashboard</h1>
            <p className="text-sm text-gray-500">{n} responses</p>
          </div>
          <button
            onClick={copyDMZ}
            className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-[#f0a855] hover:bg-gray-800 transition-colors"
          >
            {copied ? "Copied!" : "Copy DMZ Summary"}
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <MetricCard label="Total Responses" value={String(n)} />
          <MetricCard label="Average NPS" value={avgNPS.toFixed(1)} sub="/10" />
          <MetricCard label="Net Promoter Score" value={`${npsScore >= 0 ? "+" : ""}${npsScore}%`} />
          <MetricCard label="Avg Confidence Before" value={avgBefore.toFixed(1)} sub="/5" />
          <MetricCard label="Avg Confidence After" value={avgAfter.toFixed(1)} sub="/5" />
          <MetricCard label="Confidence Delta" value={`+${delta.toFixed(1)}`} highlight />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ChartCard title="Role Breakdown">
            <BarChart counts={countField("role")} labels={ROLE_LABELS} />
          </ChartCard>
          <ChartCard title="AI Prior Experience">
            <BarChart counts={countField("ai_experience")} labels={AI_EXPERIENCE_LABELS} />
          </ChartCard>
          <ChartCard title="Personalization Rating">
            <BarChart counts={countField("personalization")} labels={PERSONALIZATION_LABELS} />
          </ChartCard>
          <ChartCard title="Comparison vs Alternatives">
            <BarChart counts={countField("comparison")} labels={COMPARISON_LABELS} />
          </ChartCard>
          <ChartCard title="Would Use if Free">
            <BarChart counts={countField("use_free")} labels={USE_FREE_LABELS} />
          </ChartCard>
        </div>

        {/* Qualitative Tabs */}
        <div className="mb-10">
          <div className="flex gap-1 border-b border-gray-800 mb-4 overflow-x-auto">
            {QUAL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-[#f0a855] border-b-2 border-[#f0a855]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {qualResponses.length === 0 ? (
              <p className="text-gray-600 text-sm py-4 text-center">No responses for this category.</p>
            ) : (
              qualResponses.map((r) => (
                <div key={r.id} className="bg-gray-900 rounded-lg p-3 border border-gray-800">
                  <p className="text-sm text-gray-200 mb-1.5">{String(r[activeField])}</p>
                  <p className="text-xs text-gray-600">
                    {r.name || "Anonymous"} · {ROLE_LABELS[r.role] || r.role || "Unknown role"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-[#f0a855]" : "text-white"}`}>
        {value}
        {sub && <span className="text-sm text-gray-600 font-normal">{sub}</span>}
      </p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 mb-3">{title}</h3>
      {children}
    </div>
  );
}

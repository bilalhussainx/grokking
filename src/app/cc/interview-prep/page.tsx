"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Clock, CheckCircle, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { matchSchoolToPersona, SUPPORTED_SCHOOLS } from "@/lib/cc/school-persona-matcher";

interface School {
  id: string;
  school_id: string;
  chancing_band: string;
  application_status: string;
  cc_schools: {
    id: string;
    name: string;
    city: string;
    state: string;
    acceptance_rate: number | null;
  };
}

interface SessionInfo {
  totalSessions: number;
  currentArcStep: number;
  latestScore: {
    overallRecommendation: number;
    recommendationLabel: string;
    sessionId: string;
  } | null;
  sessions: {
    id: string;
    arcStep: number;
    status: string;
    startedAt: string;
    overallScore: number | null;
  }[];
}

const ARC_STEPS = [
  { label: "Assess", full: "Assess Narrative" },
  { label: "Weak Areas", full: "Weak Areas" },
  { label: "Full Mock", full: "Full Mock" },
  { label: "Essays", full: "Essay Coaching" },
];

const SCHOOL_EMOJIS: Record<string, string> = {
  "harvard-undergrad": "🟥",
  "yale-undergrad": "🟦",
  "princeton-undergrad": "🟧",
  "columbia-undergrad": "🟦",
  "penn-undergrad": "🟦",
  "brown-undergrad": "🟫",
  "dartmouth-undergrad": "🟩",
  "cornell-undergrad": "⬜",
  "stanford-undergrad": "🟥",
  "mit-undergrad": "⬛",
};

export default function InterviewPrepPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [sessionData, setSessionData] = useState<Record<string, SessionInfo>>({});
  const [loading, setLoading] = useState(true);
  const [includeEssays, setIncludeEssays] = useState<Record<string, boolean>>({});
  const [expandedScorecard, setExpandedScorecard] = useState<string | null>(null);
  const [scorecardData, setScorecardData] = useState<Record<string, unknown> | null>(null);
  const [scorecardLoading, setScorecardLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/cc/school-list").then((r) => r.json()),
      fetch("/api/cc/interview/sessions").then((r) => r.json()),
    ])
      .then(([schoolRes, sessionRes]) => {
        setSchools(schoolRes.schools || []);
        setSessionData(sessionRes.sessions || {});
      })
      .finally(() => setLoading(false));
  }, []);

  const loadScorecard = async (sessionId: string) => {
    if (expandedScorecard === sessionId) {
      setExpandedScorecard(null);
      return;
    }
    setExpandedScorecard(sessionId);
    setScorecardLoading(true);
    setScorecardData(null);
    const res = await fetch(`/api/cc/interview/sessions/${sessionId}`);
    const data = await res.json();
    setScorecardData(data.scorecard);
    setScorecardLoading(false);
  };

  const buildLaunchUrl = (personaId: string, withEssays: boolean) => {
    const params = new URLSearchParams({
      persona: personaId,
      feedbackLang: "en",
      returnTo: "/cc/interview-prep",
    });
    if (withEssays) params.set("includeEssays", "true");
    return `/college-interviews?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <GraduationCap className="w-12 h-12 text-white/10 mx-auto mb-3" />
        <p className="text-sm text-white/30 mb-4">
          Add schools to your list first, then come back to practice interviews.
        </p>
        <a
          href="/cc/school-list"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
        >
          Go to School List <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  const schoolCards = schools.map((s) => {
    const persona = matchSchoolToPersona(s.cc_schools.name);
    const personaId = persona?.id || null;
    const info = personaId ? sessionData[personaId] : null;
    return { school: s, persona, personaId, info };
  });

  const hasAnyPersona = schoolCards.some((c) => c.persona !== null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Interview Prep</h1>
        <p className="text-sm text-white/40 mt-1">
          Practice alumni interviews for schools on your list
        </p>
      </div>

      {!hasAnyPersona && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/40">
          Interview practice is available for: {SUPPORTED_SCHOOLS.join(", ")}.
          Add one of these schools to your list to get started.
        </div>
      )}

      <div className="space-y-3">
        {schoolCards.map(({ school, persona, personaId, info }) => (
          <div
            key={school.id}
            className="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden"
          >
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  {persona ? (
                    <span className="text-lg">{SCHOOL_EMOJIS[persona.id] || "🎓"}</span>
                  ) : (
                    <span className="text-lg opacity-30">🎓</span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {school.cc_schools.name}
                    </p>
                    <p className="text-xs text-white/30">
                      {school.cc_schools.city}, {school.cc_schools.state}
                      {school.cc_schools.acceptance_rate
                        ? ` · ${school.cc_schools.acceptance_rate}% acceptance`
                        : ""}
                    </p>
                  </div>
                </div>

                {persona ? (
                  <span className="flex items-center gap-1 text-[10px] text-green-400/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Ready
                  </span>
                ) : (
                  <span className="text-[10px] text-white/20 px-2 py-0.5 rounded-full border border-white/10">
                    Coming soon
                  </span>
                )}
              </div>

              {persona && (
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1.5">
                    {ARC_STEPS.map((step, i) => {
                      const stepNum = i + 1;
                      const completed = info ? info.totalSessions >= stepNum : false;
                      const current = info
                        ? info.currentArcStep === stepNum
                        : stepNum === 1;
                      return (
                        <div key={step.label} className="flex items-center gap-1 flex-1">
                          <div
                            className={`h-1.5 flex-1 rounded-full ${
                              completed
                                ? "bg-green-500/60"
                                : current
                                ? "bg-[#D4AF37]/60"
                                : "bg-white/5"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-white/30">
                      {info
                        ? `Session ${Math.min(info.totalSessions + 1, 4)} of 4 — ${
                            ARC_STEPS[Math.min(info.currentArcStep, 4) - 1].full
                          }`
                        : "Session 1 of 4 — Assess Narrative"}
                    </p>
                    {info?.latestScore && (
                      <p className="text-[10px] text-[#D4AF37]">
                        {info.latestScore.recommendationLabel}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {persona && personaId && (
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={buildLaunchUrl(personaId, !!includeEssays[personaId])}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#C4A030] transition-colors"
                  >
                    <GraduationCap className="w-3 h-3" /> Practice
                  </a>

                  <label className="flex items-center gap-1.5 text-[10px] text-white/30 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!includeEssays[personaId]}
                      onChange={(e) =>
                        setIncludeEssays((prev) => ({
                          ...prev,
                          [personaId]: e.target.checked,
                        }))
                      }
                      className="rounded border-white/20 bg-white/5 text-[#D4AF37] w-3 h-3"
                    />
                    <BookOpen className="w-3 h-3" /> Include my essays
                  </label>

                  {info?.latestScore && (
                    <button
                      onClick={() => loadScorecard(info.latestScore!.sessionId)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white/40 border border-white/10 hover:text-white/60 hover:border-white/20 transition-colors ml-auto"
                    >
                      View Scorecard
                    </button>
                  )}
                </div>
              )}
            </div>

            {expandedScorecard && info?.latestScore?.sessionId === expandedScorecard && (
              <div className="px-5 pb-5 border-t border-white/5 pt-4">
                {scorecardLoading ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                    <span className="text-xs text-white/40">Loading scorecard...</span>
                  </div>
                ) : scorecardData ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: "Overall", value: (scorecardData as Record<string, number>).overallScore },
                        { label: "Communication", value: (scorecardData as Record<string, number>).communicationScore },
                        { label: "Depth", value: (scorecardData as Record<string, number>).technicalDepthScore },
                        { label: "Problem Solving", value: (scorecardData as Record<string, number>).problemSolvingScore },
                      ].map((d) => (
                        <div key={d.label} className="p-2 rounded-lg bg-white/5 text-center">
                          <p className="text-lg font-bold text-white">{d.value?.toFixed(1) || "—"}</p>
                          <p className="text-[10px] text-white/30">{d.label}</p>
                        </div>
                      ))}
                    </div>
                    {(scorecardData as Record<string, string[]>).strengths?.length > 0 && (
                      <div>
                        <h4 className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Strengths</h4>
                        <ul className="space-y-1">
                          {((scorecardData as Record<string, string[]>).strengths).map((s: string, i: number) => (
                            <li key={i} className="text-xs text-white/50 flex gap-1.5">
                              <CheckCircle className="w-3 h-3 text-green-400/50 shrink-0 mt-0.5" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(scorecardData as Record<string, string[]>).improvements?.length > 0 && (
                      <div>
                        <h4 className="text-[10px] text-white/30 uppercase tracking-wide mb-1">Areas to Improve</h4>
                        <ul className="space-y-1">
                          {((scorecardData as Record<string, string[]>).improvements).map((s: string, i: number) => (
                            <li key={i} className="text-xs text-white/50 flex gap-1.5">
                              <Clock className="w-3 h-3 text-amber-400/50 shrink-0 mt-0.5" /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-white/30">No scorecard data available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

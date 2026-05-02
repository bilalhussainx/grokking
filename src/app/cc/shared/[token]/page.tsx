type Props = { params: Promise<{ token: string }> };

interface SharedData {
  studentName: string;
  visibleSections: Record<string, boolean>;
  essays?: { essayType: string; promptText: string; content: string; wordCount: number; phase: string }[];
  activities?: { position: number; activityType: string; organization: string; role: string; description150: string; hoursPerWeek: number }[];
  honors?: { title: string; level: string; description100: string }[];
  schoolList?: { schoolName: string; city: string; state: string; applicationStatus: string }[];
  recommendations?: { name: string; recommenderType: string; subject: string; status: string }[];
  interviewScores?: Record<string, { totalSessions: number; currentArcStep: number; latestRecommendation: string }>;
}

async function fetchSharedData(token: string): Promise<SharedData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/cc/shared/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const STATUS_COLORS: Record<string, string> = {
  applying: "bg-blue-500/20 text-blue-300",
  applied: "bg-yellow-500/20 text-yellow-300",
  accepted: "bg-green-500/20 text-green-300",
  denied: "bg-red-500/20 text-red-300",
  deferred: "bg-orange-500/20 text-orange-300",
  waitlisted: "bg-purple-500/20 text-purple-300",
};

const ARC_LABELS = ["Assess Narrative", "Weak Areas", "Full Mock", "Essay Coaching"];

export default async function SharedViewPage({ params }: Props) {
  const { token } = await params;
  const data = await fetchSharedData(token);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white p-6">
        <div className="text-[#D4AF37] text-3xl font-bold mb-4">KairosLearn</div>
        <p className="text-white/60 text-center max-w-md">
          This link is no longer active. Ask the student for a new one.
        </p>
      </div>
    );
  }

  const hasAnySections = Object.values(data.visibleSections).some(Boolean);

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6 max-w-4xl mx-auto">
      <div className="text-[#D4AF37] text-sm font-semibold mb-1">KairosLearn</div>
      <h1 className="text-2xl font-bold mb-6">{data.studentName}&apos;s College Application Portfolio</h1>

      {!hasAnySections && (
        <p className="text-white/50">No sections shared yet.</p>
      )}

      <div className="space-y-6">
        {data.essays && data.essays.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Essays</h2>
            <div className="space-y-4">
              {data.essays.map((e, i) => (
                <div key={i} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/70">{e.essayType.replace(/_/g, " ")}</span>
                    <span className="text-xs text-white/40">{e.wordCount} words &middot; {e.phase}</span>
                  </div>
                  <p className="text-sm text-white/60 mb-2">{e.promptText}</p>
                  {e.content && (
                    <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">{e.content}</pre>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.activities && data.activities.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Activities</h2>
            <div className="space-y-3">
              {data.activities.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xs text-white/40 mt-1 w-4 shrink-0">{a.position}.</span>
                  <div>
                    <div className="font-medium text-sm">{a.role || a.activityType}{a.organization ? ` — ${a.organization}` : ""}</div>
                    <p className="text-sm text-white/60">{a.description150}</p>
                    {a.hoursPerWeek && <span className="text-xs text-white/40">{a.hoursPerWeek} hrs/week</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.honors && data.honors.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Honors</h2>
            <div className="space-y-2">
              {data.honors.map((h, i) => (
                <div key={i}>
                  <div className="font-medium text-sm">{h.title} <span className="text-xs text-white/40">({h.level})</span></div>
                  <p className="text-sm text-white/60">{h.description100}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.schoolList && data.schoolList.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">School List</h2>
            <div className="grid gap-2">
              {data.schoolList.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <div className="font-medium text-sm">{s.schoolName}</div>
                    <div className="text-xs text-white/40">{s.city}, {s.state}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[s.applicationStatus] || "bg-white/10 text-white/60"}`}>
                    {s.applicationStatus}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.recommendations && data.recommendations.length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Recommendations</h2>
            <div className="space-y-2">
              {data.recommendations.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <div className="font-medium text-sm">{r.name}</div>
                    <div className="text-xs text-white/40">{r.recommenderType}{r.subject ? ` — ${r.subject}` : ""}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">{r.status}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.interviewScores && Object.keys(data.interviewScores).length > 0 && (
          <section className="rounded-xl bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4 text-[#D4AF37]">Interview Scores</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(data.interviewScores).map(([personaId, info]) => (
                <div key={personaId} className="p-3 rounded-lg bg-white/5">
                  <div className="font-medium text-sm capitalize">{personaId.replace(/-/g, " ").replace("undergrad", "").trim()}</div>
                  <div className="text-xs text-white/50 mt-1">{info.totalSessions} session{info.totalSessions !== 1 ? "s" : ""} completed</div>
                  <div className="flex gap-1 mt-2">
                    {ARC_LABELS.map((label, step) => (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full ${step < info.totalSessions ? "bg-green-500" : step < info.currentArcStep ? "bg-[#D4AF37]" : "bg-white/10"}`}
                        title={label}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-white/60 mt-1">{info.latestRecommendation}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-12 text-center text-xs text-white/30">
        Powered by KairosLearn
      </div>
    </div>
  );
}

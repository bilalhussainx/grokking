"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Copy, Check } from "lucide-react";

type Row = {
  studentSchoolId: string;
  schoolName: string;
  management: {
    decision?: string;
    loci_draft?: string;
    loci_sent?: boolean;
    expected_decision_date?: string | null;
  } | null;
};

export default function WaitlistPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updates, setUpdates] = useState("");
  const [whyThisSchool, setWhyThisSchool] = useState("");
  const [generating, setGenerating] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [letterCount, setLetterCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/cc/waitlist/list")
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(`Status ${r.status}`)))
      .then((data) => setRows(data.rows ?? []))
      .catch((e) => setError(String(e)));
  }, []);

  const generate = async (schoolName: string) => {
    setGenerating(true);
    setLetter(null);
    try {
      const res = await fetch("/api/cc/waitlist/loci", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolName, updates, why_this_school: whyThisSchool }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Status ${res.status}`);
      }
      const data = await res.json();
      setLetter(data.loci);
      setLetterCount(data.wordCount);
    } catch (e) {
      alert(`LOCI failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setGenerating(false);
    }
  };

  const saveDraft = async (studentSchoolId: string, schoolName: string) => {
    if (!letter) return;
    await fetch("/api/cc/waitlist/list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentSchoolId, schoolName, updates: { loci_draft: letter } }),
    });
  };

  const markSent = async (studentSchoolId: string, schoolName: string) => {
    await fetch("/api/cc/waitlist/list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentSchoolId,
        schoolName,
        updates: { loci_sent: true, loci_sent_date: new Date().toISOString().slice(0, 10) },
      }),
    });
    setRows((prev) =>
      prev
        ? prev.map((r) =>
            r.studentSchoolId === studentSchoolId
              ? { ...r, management: { ...(r.management ?? {}), loci_sent: true } }
              : r,
          )
        : prev,
    );
  };

  if (error) return <p className="p-6 text-rose-300 text-sm">{error}</p>;
  if (!rows) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /></div>;
  }

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-white mb-2">Waitlist</h1>
      <p className="text-[13px] text-white/60 mb-6">
        Schools where you&apos;ve been waitlisted. Generate a Letter of Continued Interest tailored
        to that school, mark it sent, and decide whether to stay.
      </p>

      {rows.length === 0 ? (
        <p className="text-[13px] text-white/45 italic p-8 text-center border border-white/10 rounded-xl">
          No waitlist statuses yet. Mark a school as &quot;waitlisted&quot; on the{" "}
          <a href="/applications" className="text-[#D4AF37] underline">Applications</a> board.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.studentSchoolId} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-medium text-white">{r.schoolName}</span>
                {r.management?.loci_sent && (
                  <span className="text-[10px] uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    LOCI sent
                  </span>
                )}
              </div>

              {activeId !== r.studentSchoolId ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(r.studentSchoolId);
                    setLetter(r.management?.loci_draft ?? null);
                    setUpdates("");
                    setWhyThisSchool("");
                  }}
                  className="text-[12px] px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black font-medium hover:bg-[#C4A030]"
                >
                  Open LOCI generator
                </button>
              ) : (
                <div className="space-y-3 mt-2">
                  <textarea
                    placeholder="What's new since you applied? (graded class, leadership change, project outcome…)"
                    value={updates}
                    onChange={(e) => setUpdates(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30"
                  />
                  <textarea
                    placeholder={`Why is ${r.schoolName} still your top choice? (one specific program / professor / opportunity)`}
                    value={whyThisSchool}
                    onChange={(e) => setWhyThisSchool(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white/85 placeholder-white/30"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => generate(r.schoolName)}
                      disabled={generating}
                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-[12px] font-medium hover:bg-[#C4A030] disabled:opacity-40 inline-flex items-center gap-1.5"
                    >
                      {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                      {generating ? "Generating…" : "Generate LOCI"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveId(null)}
                      className="text-[11.5px] text-white/55 hover:text-white/85"
                    >
                      Close
                    </button>
                  </div>

                  {letter && (
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="text-[11px] text-white/55">{letterCount} words</div>
                      <div className="bg-white/[0.04] rounded-lg p-3 text-[13px] text-white/85 whitespace-pre-wrap">
                        {letter}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(letter).then(() => {
                              setCopied(true);
                              setTimeout(() => setCopied(false), 1500);
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/80"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                        <button
                          type="button"
                          onClick={() => saveDraft(r.studentSchoolId, r.schoolName)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[12px] text-white/80"
                        >
                          Save draft
                        </button>
                        <button
                          type="button"
                          onClick={() => markSent(r.studentSchoolId, r.schoolName)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-[12px] text-emerald-200"
                        >
                          Mark as sent
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

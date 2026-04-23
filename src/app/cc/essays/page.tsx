"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Info, ExternalLink } from "lucide-react";
import EssayCard from "@/components/cc/essay/EssayCard";

interface EssayRow {
  id: string;
  essay_type: string;
  prompt_text: string;
  phase: string;
  word_count: number | null;
  word_limit: number;
  updated_at: string;
}

interface MySchoolRow {
  id: string;
  school_id: string;
  cc_schools: { id: string; name: string } | null;
}

interface SupplementRow {
  id: string;
  prompt_text: string;
  word_limit: number | null;
  is_required: boolean | null;
  supplement_type: string | null;
}

type EssayKind = "personal_statement" | "supplemental" | "scholarship";

const COMMON_APP_PROMPTS = [
  "Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.",
  "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
  "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
  "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
  "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
  "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
  "Share an essay on any topic of your choice. It can be one you've already written, one that responds to a different prompt, or one of your own design.",
];

export default function EssayListPage() {
  const [essays, setEssays] = useState<EssayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [essayType, setEssayType] = useState<EssayKind>("personal_statement");
  const [wordLimit, setWordLimit] = useState(650);

  // Supplement flow: pick a school → fetch its supplements → pick one.
  const [mySchools, setMySchools] = useState<MySchoolRow[]>([]);
  const [supplementSchoolId, setSupplementSchoolId] = useState<string>("");
  const [supplements, setSupplements] = useState<SupplementRow[]>([]);
  const [supplementsLoading, setSupplementsLoading] = useState(false);
  const [selectedSupplementId, setSelectedSupplementId] = useState<string>("");
  const [supplementMode, setSupplementMode] = useState<"from_school" | "manual">("from_school");

  useEffect(() => {
    fetch("/api/cc/essays")
      .then((r) => r.json())
      .then((d) => setEssays(d.essays || []))
      .finally(() => setLoading(false));
  }, []);

  // Load schools once when user toggles to supplement mode (cached afterwards).
  useEffect(() => {
    if (essayType !== "supplemental" || mySchools.length > 0) return;
    fetch("/api/cc/school-list")
      .then((r) => r.json())
      .then((d) => setMySchools(d.schools || []))
      .catch(() => {});
  }, [essayType, mySchools.length]);

  // When the student picks a school, fetch its published supplements.
  const fetchSupplements = useCallback((schoolId: string) => {
    if (!schoolId) return;
    setSupplementsLoading(true);
    setSupplements([]);
    setSelectedSupplementId("");
    fetch(`/api/cc/schools/${schoolId}/supplements`)
      .then((r) => r.json())
      .then((d) => setSupplements(d.supplements || []))
      .catch(() => setSupplements([]))
      .finally(() => setSupplementsLoading(false));
  }, []);

  const handleCreate = async () => {
    // Path 1: student picked a supplement from a school-published list — use
    // the dedicated route so cc_essays gets school_id + supplement_id linked.
    if (essayType === "supplemental" && supplementMode === "from_school" && selectedSupplementId) {
      setCreating(true);
      const res = await fetch("/api/cc/essays/from-supplement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplement_id: selectedSupplementId }),
      });
      const data = await res.json();
      if (data.essay_id) {
        window.location.href = `/cc/essays/${data.essay_id}`;
        return;
      }
      setCreating(false);
      return;
    }

    // Path 2: personal_statement (prompt from Common App list) or manual paste.
    const prompt = selectedPrompt || customPrompt;
    if (!prompt) return;
    setCreating(true);
    const res = await fetch("/api/cc/essays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        essay_type: essayType,
        prompt_text: prompt,
        word_limit: wordLimit,
      }),
    });
    const data = await res.json();
    if (data.essay) {
      window.location.href = `/cc/essays/${data.essay.id}`;
    }
    setCreating(false);
  };

  const handleTypeChange = (value: EssayKind) => {
    setEssayType(value);
    setSelectedPrompt("");
    setCustomPrompt("");
    setSelectedSupplementId("");
    setSupplementSchoolId("");
    setSupplements([]);
    if (value === "personal_statement") setWordLimit(650);
    else if (value === "scholarship") setWordLimit(500);
    else setWordLimit(250);
  };

  const canCreate = (() => {
    if (creating) return false;
    if (essayType === "supplemental" && supplementMode === "from_school") {
      return !!selectedSupplementId;
    }
    return !!(selectedPrompt || customPrompt);
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Essay Studio</h1>
          <p className="text-sm text-white/40 mt-1">AI-guided essay writing — your words, your story</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Essay
        </button>
      </div>

      {showNewForm && (
        <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-[#141414]">
          <h2 className="text-sm font-semibold text-white mb-4">Start a New Essay</h2>

          <div className="space-y-4">
            {/* Essay type — tile picker instead of a native <select>. The native
                picker rendered white-on-white options because the browser uses
                its own colors for <option> children, ignoring our dark theme. */}
            <div>
              <label className="text-xs text-white/50 block mb-1.5">Essay type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(
                  [
                    {
                      value: "personal_statement",
                      label: "Common App Personal Statement",
                      hint: "The 650-word main essay on the Common App. Usually one of 7 prompts.",
                    },
                    {
                      value: "supplemental",
                      label: "School Supplemental",
                      hint: "Short essays specific to each college (e.g. \"Why us?\", community, diversity).",
                    },
                    {
                      value: "scholarship",
                      label: "Scholarship Essay",
                      hint: "For scholarships and fly-in programs — the prompt comes from the scholarship, not the college.",
                    },
                  ] satisfies { value: EssayKind; label: string; hint: string }[]
                ).map((opt) => {
                  const active = essayType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleTypeChange(opt.value)}
                      aria-pressed={active}
                      className={`text-left p-3 rounded-xl border transition-colors ${
                        active
                          ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white"
                          : "bg-white/[0.03] border-white/10 text-white/70 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <div className="text-sm font-semibold mb-1">{opt.label}</div>
                      <div className="text-[11px] leading-snug text-white/50">{opt.hint}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {essayType === "personal_statement" && (
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Select a prompt</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {COMMON_APP_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedPrompt(p); setCustomPrompt(""); }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        selectedPrompt === p
                          ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-white"
                          : "bg-white/5 border border-white/10 text-white/60 hover:text-white/80"
                      }`}
                    >
                      {i + 1}. {p.length > 120 ? p.slice(0, 120) + "..." : p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {essayType === "supplemental" && (
              <div className="space-y-3">
                <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
                  <button
                    type="button"
                    onClick={() => setSupplementMode("from_school")}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                      supplementMode === "from_school"
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    From my school list
                  </button>
                  <button
                    type="button"
                    onClick={() => setSupplementMode("manual")}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                      supplementMode === "manual"
                        ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                        : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    Paste prompt manually
                  </button>
                </div>

                {supplementMode === "from_school" && (
                  <>
                    {mySchools.length === 0 ? (
                      <div className="p-4 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white/60 leading-relaxed">
                        No schools on your list yet. Add schools first via{" "}
                        <Link href="/schools" className="text-[#D4AF37] underline">
                          /schools
                        </Link>{" "}
                        — or switch to &quot;Paste prompt manually&quot; if you already have a prompt.
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs text-white/50 block mb-1.5">School</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {mySchools.map((row) => {
                              const active = supplementSchoolId === row.school_id;
                              return (
                                <button
                                  key={row.id}
                                  type="button"
                                  onClick={() => {
                                    setSupplementSchoolId(row.school_id);
                                    fetchSupplements(row.school_id);
                                  }}
                                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                                    active
                                      ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white"
                                      : "bg-white/[0.03] border-white/10 text-white/70 hover:text-white"
                                  }`}
                                >
                                  {row.cc_schools?.name ?? "(school)"}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {supplementSchoolId && (
                          <div>
                            <label className="text-xs text-white/50 block mb-1.5">Supplement prompt</label>
                            {supplementsLoading ? (
                              <div className="text-xs text-white/40 py-2">Loading prompts…</div>
                            ) : supplements.length === 0 ? (
                              <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white/60">
                                We don&apos;t have supplements seeded for this school yet. Switch to
                                &quot;Paste prompt manually&quot; and drop the prompt in.
                              </div>
                            ) : (
                              <div className="space-y-2 max-h-72 overflow-y-auto">
                                {supplements.map((s) => {
                                  const active = selectedSupplementId === s.id;
                                  return (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedSupplementId(s.id);
                                        if (s.word_limit) setWordLimit(s.word_limit);
                                      }}
                                      className={`block w-full text-left px-3 py-2.5 rounded-lg text-xs border transition-colors ${
                                        active
                                          ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-white"
                                          : "bg-white/5 border border-white/10 text-white/70 hover:text-white"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        {s.supplement_type && (
                                          <span className="uppercase tracking-wider text-[9.5px] text-white/45">
                                            {s.supplement_type.replace(/_/g, " ")}
                                          </span>
                                        )}
                                        {s.is_required && (
                                          <span className="text-[9.5px] text-[#D4AF37] uppercase tracking-wider">Required</span>
                                        )}
                                        {s.word_limit && (
                                          <span className="text-[10px] text-white/50 font-mono">{s.word_limit} words</span>
                                        )}
                                      </div>
                                      <div className="leading-snug">{s.prompt_text}</div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}

                {supplementMode === "manual" && (
                  <div>
                    <label className="text-xs text-white/50 block mb-1.5">Essay prompt</label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => { setCustomPrompt(e.target.value); setSelectedPrompt(""); }}
                      placeholder="Paste the supplement prompt here (e.g. Why do you want to attend our school?)"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {essayType === "scholarship" && (
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/5 flex items-start gap-2.5">
                  <Info className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="text-[11.5px] text-white/70 leading-relaxed">
                    Scholarship essays are required by outside scholarship programs (QuestBridge,
                    Posse, Coca-Cola Scholars, Gates, Jack Kent Cooke, and thousands of smaller
                    awards) — <strong className="text-white/85">not</strong> by the college itself.
                    Paste the prompt exactly as it appears in the scholarship application.
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 block mb-1.5">Essay prompt</label>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => { setCustomPrompt(e.target.value); setSelectedPrompt(""); }}
                    placeholder="Paste the scholarship prompt here (e.g. Describe a time you overcame a barrier...)"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 resize-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-white/50 block mb-1.5">Word limit</label>
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={!canCreate}
              className="px-6 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-40 transition-colors"
            >
              {creating ? "Creating..." : "Start Essay"}
            </button>
          </div>
        </div>
      )}

      {essays.length === 0 && !showNewForm ? (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">No essays yet. Click &quot;New Essay&quot; to start.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {essays.map((e) => (
            <EssayCard
              key={e.id}
              id={e.id}
              essayType={e.essay_type}
              promptText={e.prompt_text}
              phase={e.phase}
              wordCount={e.word_count}
              wordLimit={e.word_limit}
              updatedAt={e.updated_at}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-[11px] text-white/30 text-center flex items-center justify-center gap-2">
        International student?{" "}
        <Link
          href="/profile/css-guide"
          className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-[#C4A030] underline"
        >
          CSS Profile guide <ExternalLink className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );
}

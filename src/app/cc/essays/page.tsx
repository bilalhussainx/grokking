"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
  const [essayType, setEssayType] = useState("personal_statement");
  const [wordLimit, setWordLimit] = useState(650);

  useEffect(() => {
    fetch("/api/cc/essays")
      .then((r) => r.json())
      .then((d) => setEssays(d.essays || []))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
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
            <div>
              <label className="text-xs text-white/50 block mb-1.5">Essay Type</label>
              <select
                value={essayType}
                onChange={(e) => {
                  setEssayType(e.target.value);
                  if (e.target.value === "personal_statement") setWordLimit(650);
                  else setWordLimit(250);
                }}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              >
                <option value="personal_statement">Common App Personal Statement</option>
                <option value="supplemental">School Supplemental</option>
                <option value="scholarship">Scholarship Essay</option>
              </select>
            </div>

            {essayType === "personal_statement" && (
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Select a Prompt</label>
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

            {essayType !== "personal_statement" && (
              <div>
                <label className="text-xs text-white/50 block mb-1.5">Essay Prompt</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => { setCustomPrompt(e.target.value); setSelectedPrompt(""); }}
                  placeholder="Paste the essay prompt here..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 resize-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-white/50 block mb-1.5">Word Limit</label>
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={creating || (!selectedPrompt && !customPrompt)}
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
    </div>
  );
}

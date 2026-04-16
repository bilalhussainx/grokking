"use client";

// New essay setup — prompt, optional school + word target, then go straight to ideation.
// Spec: CollegeVCareers.md SP-10.

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { COLLEGE_PERSONAS } from "@/data/college-interviewer-personas";

const COMMON_APP_PROMPTS = [
  "Some students have a background, identity, interest, or talent so meaningful they believe their application would be incomplete without it. If this sounds like you, please share your story.",
  "The lessons we take from obstacles we encounter can be fundamental to later success. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
  "Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
  "Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?",
  "Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.",
  "Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?",
  "Share an essay on any topic of your choice. It can be one you&apos;ve already written, one that responds to a different prompt, or one of your own design.",
];

export default function NewEssayClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [wordTarget, setWordTarget] = useState<number | "">(650);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login?next=/essays/new");
  }, [user, authLoading, router]);

  const handleCreate = async () => {
    if (!title.trim() || !prompt.trim()) {
      setError("Title and prompt are required.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/essays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          prompt: prompt.trim(),
          school_id: schoolId || undefined,
          word_target: typeof wordTarget === "number" ? wordTarget : undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to create");
      const draft = await res.json();
      router.push(`/essays/${draft.id}?autoIdeate=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/essays"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Essays
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Start a new essay</h1>
        <p className="text-sm text-white/50 mb-8">
          Paste your prompt. We&apos;ll help you find 3 angles before you write a word.
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Common App personal statement, Harvard supplemental #2"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-violet-500/40 focus:outline-none text-white text-sm"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste the exact essay prompt…"
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-violet-500/40 focus:outline-none text-white text-sm leading-relaxed resize-none"
              maxLength={4000}
            />
            <div className="mt-2 flex items-start gap-1.5">
              <span className="text-[11px] text-white/30 mr-2 pt-0.5">or pick a Common App prompt:</span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_APP_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPrompt(p);
                      if (!title.trim()) setTitle(`Common App #${i + 1}`);
                    }}
                    className="text-[10px] px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white/70 transition"
                  >
                    #{i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Target school <span className="text-white/20 normal-case">(optional)</span>
              </label>
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-violet-500/40 focus:outline-none text-white text-sm"
              >
                <option value="">Any / generic</option>
                {COLLEGE_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.shortName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                Word target
              </label>
              <input
                type="number"
                min={50}
                max={5000}
                value={wordTarget}
                onChange={(e) => setWordTarget(e.target.value ? parseInt(e.target.value, 10) : "")}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-violet-500/40 focus:outline-none text-white text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/[0.06] border border-red-500/[0.2] text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={creating || !title.trim() || !prompt.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {creating ? "Creating…" : "Create draft & find angles"}
          </button>
        </div>
      </div>
    </div>
  );
}

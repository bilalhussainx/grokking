"use client";

// Essay detail — three stacked panels:
//   1) Ideation (streamed 3 angles)
//   2) Draft editor (textarea, word counter, save)
//   3) Critique (streamed feedback on the current draft body)
// Spec: CollegeVCareers.md SP-10.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles, PenSquare, MessageSquareText, History } from "lucide-react";

interface EssayDraft {
  id: string;
  title: string;
  prompt: string;
  school_id: string | null;
  word_target: number | null;
  status: string;
  current_version: number;
}

interface EssayVersion {
  id: string;
  version_num: number;
  kind: "angles" | "outline" | "body" | "critique";
  body_md: string | null;
  word_count: number | null;
  created_at: string;
}

export default function EssayDetailClient({ essayId }: { essayId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoIdeate = searchParams.get("autoIdeate") === "1";

  const [draft, setDraft] = useState<EssayDraft | null>(null);
  const [versions, setVersions] = useState<EssayVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [angles, setAngles] = useState<string>("");
  const [anglesStreaming, setAnglesStreaming] = useState(false);

  const [body, setBody] = useState("");
  const [critique, setCritique] = useState("");
  const [critiqueStreaming, setCritiqueStreaming] = useState(false);

  const ideateTriggered = useRef(false);

  // Load draft + versions
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/essays/${essayId}`);
        if (!res.ok) throw new Error((await res.json()).error || "Failed to load");
        const data = await res.json();
        setDraft(data.draft);
        setVersions(data.versions || []);

        // Pre-populate panels from latest versions
        const latestAngles = (data.versions as EssayVersion[]).find((v) => v.kind === "angles");
        if (latestAngles?.body_md) setAngles(latestAngles.body_md);

        const latestBody = (data.versions as EssayVersion[]).find((v) => v.kind === "body");
        if (latestBody?.body_md) setBody(latestBody.body_md);

        const latestCritique = (data.versions as EssayVersion[]).find((v) => v.kind === "critique");
        if (latestCritique?.body_md) setCritique(latestCritique.body_md);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [essayId]);

  const startIdeate = async () => {
    if (anglesStreaming) return;
    setAnglesStreaming(true);
    setAngles("");
    try {
      const res = await fetch(`/api/essays/${essayId}/ideate`, { method: "POST" });
      if (!res.ok || !res.body) throw new Error((await res.json().catch(() => ({}))).error || "Failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setAngles((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ideation failed");
    } finally {
      setAnglesStreaming(false);
    }
  };

  const startCritique = async () => {
    if (critiqueStreaming) return;
    const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 20) {
      setError("Write at least 20 words before asking for a critique.");
      return;
    }
    setError("");
    setCritiqueStreaming(true);
    setCritique("");
    try {
      const res = await fetch(`/api/essays/${essayId}/critique`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: body }),
      });
      if (!res.ok || !res.body) throw new Error((await res.json().catch(() => ({}))).error || "Failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setCritique((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Critique failed");
    } finally {
      setCritiqueStreaming(false);
    }
  };

  // Auto-kick ideation if ?autoIdeate=1 and no existing angles
  useEffect(() => {
    if (!loading && autoIdeate && !ideateTriggered.current && draft && !angles) {
      ideateTriggered.current = true;
      startIdeate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, autoIdeate, draft, angles]);

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const wordTarget = draft?.word_target || null;
  const overTarget = wordTarget && wordCount > wordTarget * 1.1;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-300 text-sm mb-4">{error || "Draft not found."}</p>
          <Link href="/essays" className="text-violet-400 hover:text-violet-300 text-sm underline">
            Back to essays
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/essays"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Essays
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">{draft.title}</h1>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Prompt</div>
            <p className="text-sm text-white/70 leading-relaxed">{draft.prompt}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/[0.2] text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Panel 1: Ideation */}
        <section className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">1 · Find your angle</h2>
            </div>
            <button
              onClick={startIdeate}
              disabled={anglesStreaming}
              className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/25 text-violet-200 disabled:opacity-50 transition"
            >
              {anglesStreaming ? "Thinking…" : angles ? "Regenerate" : "Generate 3 angles"}
            </button>
          </div>
          {angles ? (
            <pre className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans">{angles}</pre>
          ) : (
            <p className="text-sm text-white/40 italic">
              {anglesStreaming ? "Generating angles…" : "Click above to get 3 genuinely different approaches to this prompt."}
            </p>
          )}
        </section>

        {/* Panel 2: Draft editor */}
        <section className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PenSquare className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">2 · Draft</h2>
            </div>
            <div className={`text-xs ${overTarget ? "text-amber-400" : "text-white/40"}`}>
              {wordCount} {wordTarget ? `/ ${wordTarget}` : ""} words
            </div>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Start writing your essay here. It&apos;s saved each time you run a critique."
            rows={18}
            className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-white/[0.08] focus:border-cyan-500/40 focus:outline-none text-white text-sm leading-relaxed resize-y font-serif"
          />
        </section>

        {/* Panel 3: Critique */}
        <section className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-violet-500/[0.04] to-cyan-500/[0.04] border border-violet-500/[0.15]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-violet-400" />
              <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">3 · Get honest feedback</h2>
            </div>
            <button
              onClick={startCritique}
              disabled={critiqueStreaming || wordCount < 20}
              className="text-xs px-3 py-1.5 rounded-lg bg-violet-500/25 hover:bg-violet-500/35 border border-violet-500/35 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {critiqueStreaming ? "Reading…" : critique ? "Re-critique" : "Critique this draft"}
            </button>
          </div>
          {critique ? (
            <div className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap font-sans">{critique}</div>
          ) : (
            <p className="text-sm text-white/40 italic">
              Sonnet-powered. Writes a verdict, specific line-level notes, and one concrete next move — no generic praise.
            </p>
          )}
        </section>

        {/* Version history */}
        {versions.length > 0 && (
          <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-white/40" />
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">History</h2>
            </div>
            <ul className="space-y-2">
              {versions.slice(0, 10).map((v) => (
                <li key={v.id} className="flex items-center justify-between text-xs text-white/50">
                  <span>
                    v{v.version_num} · <span className="text-white/30">{v.kind}</span>
                    {v.word_count ? <span className="text-white/30"> · {v.word_count}w</span> : null}
                  </span>
                  <span className="text-white/30">{new Date(v.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

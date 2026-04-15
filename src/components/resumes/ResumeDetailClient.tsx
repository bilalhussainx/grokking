"use client";

// Resume detail page: original text preview + target-role rewrite stream + history.
// Spec: CollegeVCareers.md SP-16.

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ResumeDoc {
  id: string;
  original_filename: string;
  file_type: string;
  raw_text: string;
  parsed_sections: Record<string, string> | null;
  updated_at: string;
  created_at: string;
}

interface Rewrite {
  id: string;
  target_role: string;
  target_jd: string | null;
  body_md: string;
  notes_md: string;
  created_at: string;
}

export default function ResumeDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [doc, setDoc] = useState<ResumeDoc | null>(null);
  const [rewrites, setRewrites] = useState<Rewrite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [targetRole, setTargetRole] = useState("");
  const [targetJd, setTargetJd] = useState("");
  const [showJd, setShowJd] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamOut, setStreamOut] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?next=/resumes/${id}`);
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/resumes/${id}`);
        if (!res.ok) throw new Error((await res.json()).error || "Failed to load");
        const data = await res.json();
        setDoc(data.doc);
        setRewrites(data.rewrites || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user, authLoading, router]);

  const handleRewrite = async () => {
    if (!targetRole.trim() || streaming) return;
    setError("");
    setStreamOut("");
    setStreaming(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`/api/resumes/${id}/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole.trim(), target_jd: targetJd.trim() }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error((await res.json().catch(() => ({}))).error || "Rewrite failed");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setStreamOut((s) => s + dec.decode(value, { stream: true }));
      }
      // refresh history so the new rewrite appears
      const after = await fetch(`/api/resumes/${id}`);
      if (after.ok) {
        const data = await after.json();
        setRewrites(data.rewrites || []);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError(e instanceof Error ? e.message : "Rewrite failed");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
      </div>
    );
  }

  if (error && !doc) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-300 mb-3">{error}</p>
          <Link href="/resumes" className="text-sm text-violet-300 hover:text-violet-200">
            ← Back to resumes
          </Link>
        </div>
      </div>
    );
  }

  if (!doc) return null;

  const sections = doc.parsed_sections || {};
  const sectionKeys = Object.keys(sections);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/resumes"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All resumes
        </Link>

        <div className="mb-6 flex items-start gap-3">
          <FileText className="w-5 h-5 text-white/40 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">{doc.original_filename}</h1>
            <p className="text-xs text-white/40 mt-0.5">
              {doc.file_type.toUpperCase()} · parsed · {doc.raw_text.length.toLocaleString()} chars
            </p>
          </div>
        </div>

        {/* Target role input */}
        <div className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
            Target role
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g., Backend Engineer Intern, Product Manager, Data Analyst"
            className="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50"
            disabled={streaming}
          />

          <button
            onClick={() => setShowJd((v) => !v)}
            className="mt-3 flex items-center gap-1 text-xs text-white/50 hover:text-white/80"
          >
            {showJd ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            {showJd ? "Hide" : "Paste"} job description <span className="text-white/30">(optional, improves keyword match)</span>
          </button>
          {showJd && (
            <textarea
              value={targetJd}
              onChange={(e) => setTargetJd(e.target.value)}
              placeholder="Paste the job description here. We'll tune vocabulary and keywords to match."
              rows={6}
              className="mt-2 w-full px-3 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 resize-y"
              disabled={streaming}
            />
          )}

          <div className="mt-4 flex items-center gap-2">
            {!streaming ? (
              <button
                onClick={handleRewrite}
                disabled={!targetRole.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 text-white text-sm font-semibold hover:bg-violet-400 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed transition"
              >
                <Sparkles className="w-4 h-4" /> Rewrite for this role
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white/80 text-sm font-semibold hover:bg-white/15 transition"
              >
                <Loader2 className="w-4 h-4 animate-spin" /> Stop
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/[0.2] text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Streaming output */}
        {(streaming || streamOut) && (
          <div className="mb-8 p-5 rounded-2xl bg-violet-500/[0.04] border border-violet-500/25">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-300" />
              <h2 className="text-sm font-semibold text-violet-200">
                Rewrite for “{targetRole}”
              </h2>
              {streaming && <Loader2 className="w-3.5 h-3.5 text-violet-300/70 animate-spin" />}
            </div>
            <pre className="whitespace-pre-wrap text-sm text-white/85 font-sans leading-relaxed">
              {streamOut || "Thinking…"}
            </pre>
          </div>
        )}

        {/* Parsed sections */}
        {sectionKeys.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-white/40 mb-3">Parsed sections</h2>
            <div className="space-y-2">
              {sectionKeys.map((k) => (
                <details
                  key={k}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] group"
                >
                  <summary className="cursor-pointer text-sm font-medium text-white/80 capitalize">
                    {k}
                  </summary>
                  <pre className="mt-3 whitespace-pre-wrap text-xs text-white/60 font-sans">
                    {sections[k]}
                  </pre>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Raw text fallback */}
        <div className="mb-8">
          <button
            onClick={() => setShowOriginal((v) => !v)}
            className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80"
          >
            {showOriginal ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            Show original extracted text
          </button>
          {showOriginal && (
            <pre className="mt-3 p-4 rounded-xl bg-black/40 border border-white/[0.06] whitespace-pre-wrap text-xs text-white/60 font-sans max-h-96 overflow-auto">
              {doc.raw_text}
            </pre>
          )}
        </div>

        {/* History */}
        {rewrites.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-wider text-white/40 mb-3">Previous rewrites</h2>
            <div className="space-y-2">
              {rewrites.map((r) => (
                <details
                  key={r.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <summary className="cursor-pointer text-sm font-medium text-white/80">
                    {r.target_role}{" "}
                    <span className="text-white/40 text-xs">
                      · {new Date(r.created_at).toLocaleString()}
                    </span>
                  </summary>
                  <pre className="mt-3 whitespace-pre-wrap text-sm text-white/75 font-sans leading-relaxed">
                    {r.body_md}
                  </pre>
                  {r.notes_md && (
                    <pre className="mt-3 pt-3 border-t border-white/[0.06] whitespace-pre-wrap text-xs text-white/60 font-sans">
                      {r.notes_md}
                    </pre>
                  )}
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

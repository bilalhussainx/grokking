"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface TrendItem {
  content_id: string;
  source: string;
  title: string;
  description: string | null;
  url: string | null;
  published_at: string | null;
  related_course: string | null;
  similarity: number;
}

function SourceBadge({ source }: { source: string }) {
  const styles: Record<string, string> = {
    arxiv: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    github: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    stackoverflow: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    news: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  const labels: Record<string, string> = {
    arxiv: "arXiv",
    github: "GitHub",
    stackoverflow: "Stack Overflow",
    news: "News",
  };

  return (
    <span
      className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
        styles[source] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"
      }`}
    >
      {labels[source] ?? source}
    </span>
  );
}

export default function KnowledgePulse() {
  const { user } = useAuth();
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchTrends() {
      try {
        const resp = await fetch("/api/trends?limit=5");
        if (!resp.ok) throw new Error("fetch failed");
        const data = await resp.json();
        if (!cancelled) setTrends(data.trends ?? []);
      } catch {
        // Silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrends();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user || loading || trends.length === 0 || dismissed) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 relative">
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors"
        aria-label="Dismiss Knowledge Pulse"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
        <h2 className="text-sm font-semibold text-white/90">Knowledge Pulse</h2>
        <span className="text-[10px] text-white/40 ml-auto">
          Based on your courses
        </span>
      </div>

      {/* Trend items */}
      <div className="space-y-3">
        {trends.map((trend) => (
          <a
            key={trend.content_id}
            href={trend.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <SourceBadge source={trend.source} />
                {trend.related_course && (
                  <span className="text-[10px] text-violet-400/70 truncate">
                    {trend.related_course}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/80 leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
                {trend.title}
              </p>
            </div>

            {/* External link indicator */}
            <svg
              className="w-3.5 h-3.5 text-white/20 group-hover:text-violet-400 transition-colors shrink-0 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

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

function daysAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    arxiv: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    github: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    stackoverflow: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    news: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  const labels: Record<string, string> = {
    arxiv: "arXiv",
    github: "GitHub",
    stackoverflow: "SO",
    news: "News",
  };

  return (
    <span
      className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
        colors[source] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"
      }`}
    >
      {labels[source] ?? source}
    </span>
  );
}

function SourceIcon({ source }: { source: string }) {
  if (source === "arxiv") {
    // Paper / document icon
    return (
      <svg
        className="w-4 h-4 text-violet-400 shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    );
  }

  // Star icon for GitHub
  return (
    <svg
      className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

export default function TrendingSidebar({
  lessonId,
  courseId,
}: {
  lessonId: string;
  courseId: string;
}) {
  const { user } = useAuth();
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchTrends() {
      try {
        const resp = await fetch(
          `/api/trends?limit=3&lessonId=${encodeURIComponent(lessonId)}`
        );
        if (!resp.ok) throw new Error("fetch failed");
        const data = await resp.json();
        if (!cancelled) setTrends(data.trends ?? []);
      } catch {
        // Silently fail — sidebar is supplementary
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrends();
    return () => {
      cancelled = true;
    };
  }, [user, lessonId, courseId]);

  if (!user || loading || trends.length === 0) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4">
      <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
        Related in the wild
      </h3>

      <div className="space-y-3">
        {trends.map((trend) => (
          <a
            key={trend.content_id}
            href={trend.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2.5 group"
          >
            <SourceIcon source={trend.source} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <SourceBadge source={trend.source} />
                {trend.published_at && (
                  <span className="text-[10px] text-white/40">
                    {daysAgo(trend.published_at)}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/80 leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
                {trend.title}
              </p>
              {trend.source === "arxiv" && trend.description && (
                <p className="text-[11px] text-white/40 line-clamp-1 mt-0.5">
                  {trend.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

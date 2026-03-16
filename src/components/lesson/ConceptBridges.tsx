"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface Bridge {
  connected_lesson_id: string;
  connected_course: string;
  connected_domain: string;
  connected_title?: string;
  similarity: number;
  bridge_label: string | null;
}

interface ConceptBridgesProps {
  lessonId: string;
  courseSlug: string;
}

/**
 * "Unexpected Connections" — shows cross-domain concept bridges at the bottom of lessons.
 * Only renders if bridges exist for this lesson.
 */
export default function ConceptBridges({ lessonId, courseSlug }: ConceptBridgesProps) {
  const [bridges, setBridges] = useState<Bridge[]>([]);

  useEffect(() => {
    async function fetchBridges() {
      try {
        const res = await fetch(`/api/bridges?lessonId=${encodeURIComponent(lessonId)}`);
        if (!res.ok) return;
        const data = await res.json();
        setBridges(data.bridges ?? []);
      } catch {
        // Silently fail — bridges are optional enrichment
      }
    }
    fetchBridges();
  }, [lessonId]);

  if (bridges.length === 0) return null;

  return (
    <div className="mt-10 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Unexpected Connections
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bridges.slice(0, 2).map((bridge) => (
          <Link
            key={bridge.connected_lesson_id}
            href={`/course/${bridge.connected_course}/${bridge.connected_lesson_id}`}
          >
            <div className="group rounded-xl border border-violet-500/10 bg-violet-500/5 p-4 hover:border-violet-500/25 hover:bg-violet-500/10 transition-all cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-violet-500/15 text-violet-400 text-[10px] font-semibold uppercase">
                  {(bridge.connected_domain ?? "").replace(/-/g, " ")}
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  {Math.round(bridge.similarity * 100)}% match
                </span>
              </div>

              <p className="text-sm font-medium text-[var(--foreground)] mb-1">
                {bridge.connected_title ?? bridge.connected_lesson_id.replace(/-/g, " ")}
              </p>

              {bridge.bridge_label && (
                <p className="text-xs text-[var(--muted-foreground)] italic mb-2">
                  {bridge.bridge_label}
                </p>
              )}

              <div className="flex items-center gap-1 text-violet-400 text-xs font-medium group-hover:gap-2 transition-all">
                Explore connection <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

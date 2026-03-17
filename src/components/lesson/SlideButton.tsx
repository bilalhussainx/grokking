"use client";

import { useState } from "react";
import { Presentation } from "lucide-react";
import SlideView from "./SlideView";

export default function SlideButton({
  lessonContent,
  lessonTitle,
  courseTitle,
}: {
  lessonContent: string;
  lessonTitle: string;
  courseTitle: string;
}) {
  const [showSlides, setShowSlides] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowSlides(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] text-xs hover:bg-[var(--card-hover)] hover:text-[var(--foreground)] transition-all"
        title="View lesson as slides"
      >
        <Presentation className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Slides</span>
      </button>

      {showSlides && (
        <SlideView
          lessonContent={lessonContent}
          lessonTitle={lessonTitle}
          courseTitle={courseTitle}
          onClose={() => setShowSlides(false)}
        />
      )}
    </>
  );
}

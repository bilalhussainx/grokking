"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Play,
  Pause,
} from "lucide-react";

interface SlideViewProps {
  lessonContent: string;
  lessonTitle: string;
  courseTitle: string;
  onClose: () => void;
}

interface Slide {
  heading: string;
  body: string;
}

/** Convert a subset of markdown to simple HTML */
function markdownToHtml(md: string): string {
  let html = md;

  // Strip mermaid code blocks
  html = html.replace(/```mermaid[\s\S]*?```/g, "");

  // Code blocks (fenced)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, _lang, code) =>
      `<pre class="slide-code-block"><code>${escapeHtml(code.trim())}</code></pre>`
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="slide-inline-code">$1</code>'
  );

  // Headers (h3, h4 only — h2 is the slide heading itself)
  html = html.replace(/^#### (.+)$/gm, '<h4 class="slide-h4">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="slide-h3">$1</h3>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Unordered lists
  html = html.replace(/^[-*] (.+)$/gm, '<li class="slide-li">$1</li>');
  html = html.replace(
    /((?:<li class="slide-li">.*<\/li>\n?)+)/g,
    '<ul class="slide-ul">$1</ul>'
  );

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="slide-oli">$1</li>');
  html = html.replace(
    /((?:<li class="slide-oli">.*<\/li>\n?)+)/g,
    '<ol class="slide-ol">$1</ol>'
  );

  // Blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="slide-blockquote">$1</blockquote>'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="slide-link" target="_blank" rel="noopener">$1</a>'
  );

  // Images — show as captioned figure
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<figure class="slide-figure"><img src="$2" alt="$1" class="slide-img" /><figcaption>$1</figcaption></figure>'
  );

  // Paragraphs: wrap remaining loose lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<") ||
        trimmed.startsWith("<!--")
      )
        return trimmed;
      return `<p class="slide-p">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  // Strip HTML comments (voice markers etc.)
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Split markdown on ## headings into slides */
function splitIntoSlides(
  content: string,
  lessonTitle: string,
  courseTitle: string
): Slide[] {
  const slides: Slide[] = [
    { heading: lessonTitle, body: `<p class="slide-course-title">${escapeHtml(courseTitle)}</p>` },
  ];

  // Split on ## headings (not ### or more)
  const parts = content.split(/^## /m);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    if (i === 0) {
      // Content before the first ## heading — skip if empty or add as intro
      if (part.length > 20) {
        const truncated = truncateContent(part);
        slides.push({
          heading: "Introduction",
          body: markdownToHtml(truncated),
        });
      }
      continue;
    }

    const newlineIdx = part.indexOf("\n");
    const heading = newlineIdx === -1 ? part : part.slice(0, newlineIdx).trim();
    const body = newlineIdx === -1 ? "" : part.slice(newlineIdx + 1).trim();
    const truncated = truncateContent(body);

    slides.push({
      heading,
      body: markdownToHtml(truncated),
    });
  }

  return slides;
}

/** Truncate very long sections for slide readability */
function truncateContent(text: string): string {
  if (text.length <= 800) return text;

  // Try to break at a paragraph boundary
  const cutoff = text.lastIndexOf("\n\n", 800);
  const breakPoint = cutoff > 200 ? cutoff : 800;
  return text.slice(0, breakPoint) + "\n\n...";
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -400 : 400,
    opacity: 0,
  }),
};

export default function SlideView({
  lessonContent,
  lessonTitle,
  courseTitle,
  onClose,
}: SlideViewProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(
    () => splitIntoSlides(lessonContent, lessonTitle, courseTitle),
    [lessonContent, lessonTitle, courseTitle]
  );

  // Auto-play: advance every 8 seconds
  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setCurrent((c) => {
          if (c < slides.length - 1) {
            setDirection(1);
            return c + 1;
          }
          setAutoPlay(false);
          return c;
        });
      }, 8000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, slides.length]);

  const goNext = useCallback(() => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  }, [current, slides.length]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  }, [current]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen exit via Esc (browser-native)
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture if inside an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Escape":
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen?.();
          } else {
            onClose();
          }
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose, toggleFullscreen]);

  const progressPct = ((current + 1) / slides.length) * 100;
  const isTitleSlide = current === 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col select-none"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <span className="text-xs text-white/30 font-mono">
          {current + 1} / {slides.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
            title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-4">
        {/* Nav: left */}
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="absolute left-4 z-10 p-3 rounded-full text-white/20 hover:text-white/60 hover:bg-white/5 transition-colors disabled:opacity-0 disabled:pointer-events-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Slide content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-3xl mx-auto"
          >
            {isTitleSlide ? (
              /* Title slide */
              <div className="text-center">
                <div
                  className="text-sm uppercase tracking-widest text-indigo-400/80 mb-6"
                  dangerouslySetInnerHTML={{ __html: slides[0].body }}
                />
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                  {slides[0].heading}
                </h1>
              </div>
            ) : (
              /* Content slide */
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">
                  {slides[current].heading}
                </h2>
                <div
                  className="slide-body text-lg text-white/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: slides[current].body }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav: right */}
        <button
          onClick={goNext}
          disabled={current === slides.length - 1}
          className="absolute right-4 z-10 p-3 rounded-full text-white/20 hover:text-white/60 hover:bg-white/5 transition-colors disabled:opacity-0 disabled:pointer-events-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Slide styles */}
      <style jsx global>{`
        .slide-body .slide-p {
          margin-bottom: 1rem;
        }
        .slide-body .slide-h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin: 1.5rem 0 0.75rem;
        }
        .slide-body .slide-h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin: 1.25rem 0 0.5rem;
        }
        .slide-body .slide-code-block {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          padding: 1rem 1.25rem;
          overflow-x: auto;
          margin: 1rem 0;
          font-size: 0.875rem;
          line-height: 1.6;
        }
        .slide-body .slide-code-block code {
          color: #a5f3fc;
          font-family: "Fira Code", "JetBrains Mono", monospace;
        }
        .slide-body .slide-inline-code {
          background: rgba(255, 255, 255, 0.08);
          padding: 0.15em 0.4em;
          border-radius: 0.25rem;
          font-size: 0.9em;
          color: #93c5fd;
          font-family: "Fira Code", "JetBrains Mono", monospace;
        }
        .slide-body .slide-ul,
        .slide-body .slide-ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .slide-body .slide-ul {
          list-style: disc;
        }
        .slide-body .slide-ol {
          list-style: decimal;
        }
        .slide-body .slide-li,
        .slide-body .slide-oli {
          margin-bottom: 0.35rem;
        }
        .slide-body .slide-blockquote {
          border-left: 3px solid rgba(129, 140, 248, 0.5);
          padding-left: 1rem;
          margin: 1rem 0;
          color: rgba(255, 255, 255, 0.6);
          font-style: italic;
        }
        .slide-body .slide-link {
          color: #818cf8;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .slide-body .slide-link:hover {
          color: #a5b4fc;
        }
        .slide-body .slide-figure {
          margin: 1rem 0;
          text-align: center;
        }
        .slide-body .slide-img {
          max-height: 300px;
          border-radius: 0.5rem;
          margin: 0 auto;
        }
        .slide-body .slide-figure figcaption {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 0.5rem;
        }
        .slide-course-title {
          color: rgba(129, 140, 248, 0.8);
        }
      `}</style>
    </div>
  );
}

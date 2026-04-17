"use client";

import { useState, useCallback } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Popover from "@radix-ui/react-popover";
import { Volume2 } from "lucide-react";
import { useGlossary, type GlossaryTerm } from "@/contexts/GlossaryContext";

function TermContent({
  term,
  language,
}: {
  term: GlossaryTerm;
  language?: string;
}) {
  const [playing, setPlaying] = useState(false);

  const translatedDef =
    language &&
    language !== "en" &&
    term.translations?.[language]?.definition;

  const handleListen = useCallback(async () => {
    if (playing) return;
    setPlaying(true);
    try {
      const text = translatedDef || term.definition;
      const resp = await fetch("/api/language/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: language || "en" }),
      });
      if (!resp.ok) return;
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setPlaying(false);
        URL.revokeObjectURL(url);
      };
      audio.play();
    } catch {
      setPlaying(false);
    }
  }, [playing, translatedDef, term.definition, language]);

  return (
    <div className="max-w-xs p-3 text-sm">
      <p className="font-semibold text-white mb-1">{term.term}</p>
      <p className="text-gray-300 leading-relaxed">{term.definition}</p>
      {translatedDef && (
        <p className="text-blue-300 mt-2 leading-relaxed">{translatedDef}</p>
      )}
      <button
        onClick={handleListen}
        disabled={playing}
        className="mt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
      >
        <Volume2 size={14} className={playing ? "animate-pulse" : ""} />
        {playing ? "Playing…" : "Listen"}
      </button>
    </div>
  );
}

export function Term({
  slug,
  children,
  language,
}: {
  slug: string;
  children: React.ReactNode;
  language?: string;
}) {
  const { lookupTerm } = useGlossary();
  const term = lookupTerm(slug);

  if (!term) {
    return <>{children}</>;
  }

  const trigger = (
    <span className="underline decoration-dotted decoration-blue-400/60 underline-offset-2 cursor-help text-blue-300">
      {children}
    </span>
  );

  return (
    <>
      {/* Desktop: hover card */}
      <span className="hidden md:inline">
        <HoverCard.Root openDelay={200} closeDelay={100}>
          <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
          <HoverCard.Portal>
            <HoverCard.Content
              sideOffset={6}
              className="z-50 rounded-lg border border-white/10 bg-gray-900/95 backdrop-blur-md shadow-xl animate-in fade-in-0 zoom-in-95"
            >
              <TermContent term={term} language={language} />
              <HoverCard.Arrow className="fill-gray-900/95" />
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </span>

      {/* Mobile: tap popover */}
      <span className="md:hidden inline">
        <Popover.Root>
          <Popover.Trigger asChild>{trigger}</Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={6}
              className="z-50 rounded-lg border border-white/10 bg-gray-900/95 backdrop-blur-md shadow-xl animate-in fade-in-0 zoom-in-95"
            >
              <TermContent term={term} language={language} />
              <Popover.Arrow className="fill-gray-900/95" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </span>
    </>
  );
}

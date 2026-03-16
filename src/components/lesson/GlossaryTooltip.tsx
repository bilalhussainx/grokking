"use client";

import { useState, Fragment, useMemo } from "react";
import {
  glossary,
  resolveDefinition,
  getOtherDomains,
  type GlossaryEntry,
} from "@/data/glossary";

/** Format a domain slug into a readable label: "computer-science" → "Computer Science" */
function formatDomainLabel(domain: string): string {
  return domain
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface TooltipProps {
  term: string;
  definition: string;
  otherDomains: string[];
  children: React.ReactNode;
}

function Tooltip({ term, definition, otherDomains, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="border-b border-dashed border-blue-400/40 cursor-help">
        {children}
      </span>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-xs text-slate-200 w-[260px] whitespace-normal shadow-xl pointer-events-none">
          <span className="font-semibold text-blue-400">{term}</span>
          <br />
          {definition}
          {otherDomains.length > 0 && (
            <span className="block mt-1.5 pt-1.5 border-t border-white/10 text-[10px] text-slate-400">
              Also used in: {otherDomains.map(formatDomainLabel).join(", ")}
            </span>
          )}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

/**
 * Processes a text string and wraps glossary terms with tooltip components.
 * Only matches whole words/phrases, case-insensitive.
 * Wraps only the first occurrence of each term per render.
 *
 * @param domain — optional course domain (e.g., "computer-science") for domain-specific definitions
 */
export function GlossaryText({
  children,
  domain,
}: {
  children: string;
  domain?: string;
}) {
  const result = useMemo(() => {
    if (typeof children !== "string") return children;

    const text = children;
    // Sort terms by length (longest first) to match multi-word terms before single words
    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);

    // Build regex matching any glossary term (whole word, case-insensitive)
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (escaped.length === 0) return text;

    const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
    const parts: (string | { term: string; match: string })[] = [];
    const matched = new Set<string>();
    let lastIndex = 0;

    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const termLower = m[1].toLowerCase();
      // Only first occurrence of each term
      if (matched.has(termLower)) continue;
      matched.add(termLower);

      if (m.index > lastIndex) {
        parts.push(text.slice(lastIndex, m.index));
      }
      parts.push({ term: termLower, match: m[1] });
      lastIndex = m.index + m[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    if (parts.length === 0) return text;

    return (
      <>
        {parts.map((part, i) => {
          if (typeof part === "string") {
            return <Fragment key={i}>{part}</Fragment>;
          }
          const entry = glossary[part.term];
          const definition = resolveDefinition(entry, domain);
          const otherDomains = getOtherDomains(entry, domain);
          return (
            <Tooltip
              key={i}
              term={part.term}
              definition={definition}
              otherDomains={otherDomains}
            >
              {part.match}
            </Tooltip>
          );
        })}
      </>
    );
  }, [children, domain]);

  return <>{result}</>;
}

export default Tooltip;

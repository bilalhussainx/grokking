"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface CollapsibleSectionProps {
  title: string;
  children: string;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden not-prose">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-sm font-medium text-white/70">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-white/30 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 prose prose-invert prose-sm max-w-none prose-pre:bg-black/40 prose-pre:backdrop-blur-sm prose-code:text-blue-400 border-t border-white/5">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {children}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

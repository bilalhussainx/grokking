"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Tab {
  label: string;
  content: string;
  icon?: string;
}

interface TabsBlockProps {
  tabs: Tab[];
}

export default function TabsBlock({ tabs }: TabsBlockProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden not-prose">
      {/* Tab headers */}
      <div className="flex border-b border-white/10 bg-white/[0.03] overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
              i === active
                ? "border-cyan-400 text-cyan-300 bg-cyan-500/5"
                : "border-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
            }`}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 prose prose-invert prose-sm max-w-none prose-pre:bg-black/40 prose-pre:backdrop-blur-sm prose-code:text-blue-400">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {tabs[active].content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

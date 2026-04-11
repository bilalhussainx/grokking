"use client";

import { Check, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface CodeComparisonProps {
  before: { label: string; code: string; language?: string };
  after: { label: string; code: string; language?: string };
  variant?: "good-bad" | "before-after" | "compare";
}

const variantStyles = {
  "good-bad": {
    left: { border: "border-red-500/20", bg: "bg-red-500/5", icon: X, iconColor: "text-red-400", label: "text-red-300" },
    right: { border: "border-emerald-500/20", bg: "bg-emerald-500/5", icon: Check, iconColor: "text-emerald-400", label: "text-emerald-300" },
  },
  "before-after": {
    left: { border: "border-white/10", bg: "bg-white/[0.02]", icon: null, iconColor: "", label: "text-white/50" },
    right: { border: "border-cyan-500/20", bg: "bg-cyan-500/5", icon: null, iconColor: "", label: "text-cyan-300" },
  },
  compare: {
    left: { border: "border-blue-500/20", bg: "bg-blue-500/5", icon: null, iconColor: "", label: "text-blue-300" },
    right: { border: "border-purple-500/20", bg: "bg-purple-500/5", icon: null, iconColor: "", label: "text-purple-300" },
  },
};

export default function CodeComparison({ before, after, variant = "before-after" }: CodeComparisonProps) {
  const styles = variantStyles[variant] || variantStyles["before-after"];

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3 not-prose">
      {/* Left panel */}
      <div className={`rounded-xl border ${styles.left.border} ${styles.left.bg} overflow-hidden`}>
        <div className={`px-4 py-2 border-b ${styles.left.border} flex items-center gap-2`}>
          {styles.left.icon && <styles.left.icon className={`w-3.5 h-3.5 ${styles.left.iconColor}`} />}
          <span className={`text-xs font-semibold ${styles.left.label}`}>{before.label}</span>
        </div>
        <div className="p-3 prose prose-invert prose-sm max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {`\`\`\`${before.language || "javascript"}\n${before.code}\n\`\`\``}
          </ReactMarkdown>
        </div>
      </div>

      {/* Right panel */}
      <div className={`rounded-xl border ${styles.right.border} ${styles.right.bg} overflow-hidden`}>
        <div className={`px-4 py-2 border-b ${styles.right.border} flex items-center gap-2`}>
          {styles.right.icon && <styles.right.icon className={`w-3.5 h-3.5 ${styles.right.iconColor}`} />}
          <span className={`text-xs font-semibold ${styles.right.label}`}>{after.label}</span>
        </div>
        <div className="p-3 prose prose-invert prose-sm max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {`\`\`\`${after.language || "javascript"}\n${after.code}\n\`\`\``}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface LessonContentProps {
  content: string;
}

export default function LessonContent({ content }: LessonContentProps) {
  return (
    <div
      className={[
        "prose prose-invert max-w-none",
        "prose-pre:bg-black/40 prose-pre:backdrop-blur-sm prose-pre:text-gray-100",
        "prose-code:text-blue-400",
        "prose-headings:scroll-mt-20 prose-headings:text-[var(--foreground)]",
        "prose-p:text-[var(--muted-foreground)] prose-li:text-[var(--muted-foreground)]",
        "prose-strong:text-[var(--foreground)]",
        "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
        "prose-img:rounded-lg",
        "prose-table:border prose-th:bg-white/5",
        "prose-td:border-white/[0.06] prose-th:border-white/[0.06]",
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

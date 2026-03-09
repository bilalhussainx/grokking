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
        "prose prose-gray dark:prose-invert max-w-none",
        "prose-pre:bg-gray-900 prose-pre:text-gray-100",
        "prose-code:text-blue-600 dark:prose-code:text-blue-400",
        "prose-headings:scroll-mt-20",
        "prose-img:rounded-lg",
        "prose-table:border prose-th:bg-gray-100 dark:prose-th:bg-gray-800",
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

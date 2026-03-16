"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import dynamic from "next/dynamic";
import { GlossaryText } from "./GlossaryTooltip";
import { useTheme } from "@/contexts/ThemeContext";

// Lazy-load Mermaid to avoid SSR issues
const MermaidDiagram = dynamic(() => import("./MermaidDiagram"), { ssr: false });

interface LessonContentProps {
  content: string;
  showGlossary?: boolean;
  courseDomain?: string;
}

// Strip HTML voice coaching comments that shouldn't render
function stripVoiceComments(markdown: string): string {
  return markdown.replace(/<!--\s*voice:.*?-->/gs, "");
}

export default function LessonContent({ content, showGlossary = true, courseDomain }: LessonContentProps) {
  const { isDark } = useTheme();
  const cleanContent = stripVoiceComments(content);

  // Custom components: Mermaid diagrams + glossary tooltips
  const baseComponents: Record<string, React.ComponentType<any>> = {
    // Intercept code blocks: render mermaid diagrams, pass others through
    pre: ({ children, ...props }: any) => {
      const child = children?.props;
      if (child?.className?.includes("language-mermaid")) {
        const chart = typeof child.children === "string"
          ? child.children
          : Array.isArray(child.children)
            ? child.children.join("")
            : "";
        return <MermaidDiagram chart={chart} />;
      }
      return <pre {...props}>{children}</pre>;
    },
  };

  // Add glossary tooltip components if enabled
  const components = showGlossary
    ? {
        ...baseComponents,
        p: ({ children, ...props }: React.ComponentPropsWithoutRef<"p">) => (
          <p {...props}>
            {processChildren(children, courseDomain)}
          </p>
        ),
        li: ({ children, ...props }: React.ComponentPropsWithoutRef<"li">) => (
          <li {...props}>
            {processChildren(children, courseDomain)}
          </li>
        ),
      }
    : baseComponents;

  return (
    <div
      className={[
        isDark ? "prose prose-invert max-w-none" : "prose max-w-none",
        isDark
          ? "prose-pre:bg-black/40 prose-pre:backdrop-blur-sm prose-pre:text-gray-100"
          : "prose-pre:bg-slate-100 prose-pre:text-slate-800",
        isDark ? "prose-code:text-blue-400" : "prose-code:text-blue-600",
        "prose-headings:scroll-mt-20 prose-headings:text-[var(--foreground)]",
        "prose-p:text-[var(--muted-foreground)] prose-li:text-[var(--muted-foreground)]",
        "prose-strong:text-[var(--foreground)]",
        isDark ? "prose-a:text-blue-400" : "prose-a:text-blue-600",
        "prose-a:no-underline hover:prose-a:underline",
        "prose-img:rounded-lg",
        isDark
          ? "prose-table:border prose-th:bg-white/5 prose-td:border-white/[0.06] prose-th:border-white/[0.06]"
          : "prose-table:border prose-th:bg-slate-50 prose-td:border-slate-200 prose-th:border-slate-200",
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Process React children: wrap string nodes with GlossaryText,
 * pass non-string children through unchanged.
 */
function processChildren(children: React.ReactNode, domain?: string): React.ReactNode {
  if (typeof children === "string") {
    return <GlossaryText domain={domain}>{children}</GlossaryText>;
  }
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === "string" ? (
        <GlossaryText key={i} domain={domain}>{child}</GlossaryText>
      ) : (
        child
      )
    );
  }
  return children;
}

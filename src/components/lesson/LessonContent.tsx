"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import dynamic from "next/dynamic";
import { GlossaryText } from "./GlossaryTooltip";
import { useTheme } from "@/contexts/ThemeContext";
import {
  CalloutBox,
  InteractiveQuiz,
  TabsBlock,
  CodePlayground,
  ConceptCard,
  CodeComparison,
  KeyTakeaways,
  CollapsibleSection,
  StepByStep,
  AlgorithmVisualizer,
  ScrubbableCode,
  FinanceCalculator,
  InlineFillBlank,
  SystemDesignCanvas,
} from "./interactive";

// Lazy-load Mermaid to avoid SSR issues
const MermaidDiagram = dynamic(() => import("./MermaidDiagram"), { ssr: false });

interface LessonContentProps {
  content: string;
  showGlossary?: boolean;
  courseDomain?: string;
}

// Strip HTML voice coaching comments that shouldn't render
function stripVoiceComments(markdown: string): string {
  return markdown.replace(new RegExp('<!--\\s*voice:.*?-->', 'gs'), "");
}

/**
 * Parse content for interactive blocks using fenced code blocks with special languages:
 *   ```quiz, ```callout, ```tabs, ```playground, ```concept, ```compare,
 *   ```takeaways, ```collapse, ```steps
 *
 * Returns an array of segments: either { type: "markdown", content } or { type: "interactive", ... }
 */
type Segment =
  | { type: "markdown"; content: string }
  | { type: "interactive"; blockType: string; data: any; raw: string };

function parseInteractiveBlocks(content: string): Segment[] {
  const interactiveLanguages = new Set([
    "quiz", "callout", "tabs", "playground", "concept",
    "compare", "takeaways", "collapse", "steps",
    "algoviz", "trace", "calculator", "fillblank", "sysdiag",
  ]);

  // Match fenced code blocks: ```language\n...\n```
  const fenceRegex = /^(`{3,})([\w-]+)\s*\n([\s\S]*?)^\1\s*$/gm;
  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(fenceRegex)) {
    const lang = match[2];
    if (!interactiveLanguages.has(lang)) continue;

    const start = match.index!;
    const end = start + match[0].length;

    // Push preceding markdown
    if (start > lastIndex) {
      const md = content.slice(lastIndex, start).trim();
      if (md) segments.push({ type: "markdown", content: md });
    }

    // Try to parse the block content as JSON
    const raw = match[3].trim();
    let data: any = {};
    try {
      data = JSON.parse(raw);
    } catch {
      // If not valid JSON, pass the raw text
      data = { text: raw };
    }

    segments.push({ type: "interactive", blockType: lang, data, raw });
    lastIndex = end;
  }

  // Push remaining markdown
  if (lastIndex < content.length) {
    const md = content.slice(lastIndex).trim();
    if (md) segments.push({ type: "markdown", content: md });
  }

  // If no interactive blocks found, return single markdown segment
  if (segments.length === 0) {
    return [{ type: "markdown", content }];
  }

  return segments;
}

function renderInteractiveBlock(segment: Extract<Segment, { type: "interactive" }>, key: number) {
  const { blockType, data } = segment;

  switch (blockType) {
    case "callout":
      return (
        <CalloutBox key={key} type={data.type || "info"} title={data.title}>
          {data.content || data.text || ""}
        </CalloutBox>
      );

    case "quiz":
      return (
        <InteractiveQuiz
          key={key}
          questions={data.questions || (data.question ? [{
            question: data.question,
            options: data.options || [],
            answer: data.answer ?? 0,
            explanation: data.explanation || "",
          }] : [])}
          title={data.title}
        />
      );

    case "tabs":
      return <TabsBlock key={key} tabs={data.tabs || []} />;

    case "playground":
      return (
        <CodePlayground
          key={key}
          code={data.code || data.text || ""}
          language={data.language || "javascript"}
          title={data.title}
          runnable={data.runnable !== false}
        />
      );

    case "concept":
      return (
        <ConceptCard key={key} title={data.title || "Concept"} variant={data.variant}>
          {data.content || data.text || ""}
        </ConceptCard>
      );

    case "compare":
      return (
        <CodeComparison
          key={key}
          before={data.before || { label: "Before", code: "" }}
          after={data.after || { label: "After", code: "" }}
          variant={data.variant || "before-after"}
        />
      );

    case "takeaways":
      return (
        <KeyTakeaways
          key={key}
          items={data.items || []}
          title={data.title}
        />
      );

    case "collapse":
      return (
        <CollapsibleSection
          key={key}
          title={data.title || "Details"}
          defaultOpen={data.defaultOpen}
        >
          {data.content || data.text || ""}
        </CollapsibleSection>
      );

    case "steps":
      return (
        <StepByStep
          key={key}
          steps={data.steps || []}
          title={data.title}
        />
      );

    case "algoviz":
      return (
        <AlgorithmVisualizer
          key={key}
          title={data.title}
          type={data.type || "array"}
          data={data.data}
          frames={data.frames || []}
          speed={data.speed}
          code={data.code}
        />
      );

    case "trace":
      return (
        <ScrubbableCode
          key={key}
          title={data.title}
          language={data.language}
          code={data.code || ""}
          frames={data.frames || []}
          speed={data.speed}
        />
      );

    case "calculator":
      return (
        <FinanceCalculator
          key={key}
          type={data.type || "compound-interest"}
          title={data.title}
          inputs={data.inputs || []}
          cashflows={data.cashflows}
        />
      );

    case "fillblank":
      return (
        <InlineFillBlank
          key={key}
          title={data.title}
          prompt={data.prompt}
          template={data.template || ""}
          language={data.language}
          blanks={data.blanks || []}
          caseSensitive={data.caseSensitive}
        />
      );

    case "sysdiag":
      return (
        <SystemDesignCanvas
          key={key}
          title={data.title}
          width={data.width}
          height={data.height}
          nodes={data.nodes || []}
          edges={data.edges || []}
          annotations={data.annotations}
        />
      );

    default:
      return null;
  }
}

function MarkdownSegment({
  content,
  showGlossary,
  courseDomain,
  isDark,
}: {
  content: string;
  showGlossary: boolean;
  courseDomain?: string;
  isDark: boolean;
}) {
  const baseComponents: Record<string, React.ComponentType<any>> = {
    pre: ({ children, ...props }: any) => {
      const child = children?.props;
      if (child?.className?.includes("language-mermaid")) {
        const chart =
          typeof child.children === "string"
            ? child.children
            : Array.isArray(child.children)
            ? child.children.join("")
            : "";
        return <MermaidDiagram chart={chart} />;
      }
      // Enhanced code block wrapper with language label and copy button
      const langMatch = child?.className?.match(/language-(\w+)/);
      const lang = langMatch?.[1];
      return (
        <div className="relative group my-4 rounded-xl overflow-hidden border border-white/[0.06]">
          {lang && (
            <div className="flex items-center justify-between px-4 py-1.5 bg-white/[0.04] border-b border-white/[0.06]">
              <span className="text-[10px] uppercase tracking-wider text-white/25 font-medium">{lang}</span>
              <CopyButton getText={() => {
                const text = typeof child?.children === "string"
                  ? child.children
                  : Array.isArray(child?.children)
                  ? child.children.join("")
                  : "";
                return text;
              }} />
            </div>
          )}
          <pre {...props} className={`${props.className || ""} !rounded-none !mt-0 !mb-0`}>
            {children}
          </pre>
        </div>
      );
    },
  };

  const components = showGlossary
    ? {
        ...baseComponents,
        p: ({ children, ...props }: React.ComponentPropsWithoutRef<"p">) => (
          <p {...props}>{processChildren(children, courseDomain)}</p>
        ),
        li: ({ children, ...props }: React.ComponentPropsWithoutRef<"li">) => (
          <li {...props}>{processChildren(children, courseDomain)}</li>
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
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function LessonContent({ content, showGlossary = true, courseDomain }: LessonContentProps) {
  const { isDark } = useTheme();
  const cleanContent = stripVoiceComments(content);
  const segments = parseInteractiveBlocks(cleanContent);

  return (
    <div>
      {segments.map((seg, i) =>
        seg.type === "markdown" ? (
          <MarkdownSegment
            key={i}
            content={seg.content}
            showGlossary={showGlossary}
            courseDomain={courseDomain}
            isDark={isDark}
          />
        ) : (
          renderInteractiveBlock(seg, i)
        )
      )}
    </div>
  );
}

/** Small copy button for code blocks */
function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(getText());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-[10px] text-white/20 hover:text-white/50 transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

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

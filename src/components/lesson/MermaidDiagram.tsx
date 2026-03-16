"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface MermaidDiagramProps {
  chart: string;
}

/**
 * Renders a Mermaid diagram from a code string.
 * Lazy-loads mermaid library on first render.
 * Adapts colors to light/dark theme.
 */
export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { isDark } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          themeVariables: isDark
            ? {
                primaryColor: "#3b82f6",
                primaryTextColor: "#e2e8f0",
                primaryBorderColor: "#60a5fa",
                lineColor: "#64748b",
                secondaryColor: "#1e293b",
                tertiaryColor: "#0f172a",
                background: "#030712",
                mainBkg: "#1e293b",
                nodeBorder: "#3b82f6",
                clusterBkg: "#0f172a",
                titleColor: "#e2e8f0",
                edgeLabelBackground: "#1e293b",
              }
            : {
                primaryColor: "#dbeafe",
                primaryTextColor: "#0f172a",
                primaryBorderColor: "#3b82f6",
                lineColor: "#64748b",
                secondaryColor: "#f1f5f9",
                tertiaryColor: "#f8fafc",
              },
          securityLevel: "loose",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        });

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());

        if (!cancelled) {
          setSvg(renderedSvg);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
          setSvg("");
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart, isDark]);

  if (error) {
    return (
      <div className="my-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        Diagram error: {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-4 p-8 rounded-lg bg-[var(--muted)] flex items-center justify-center">
        <div className="text-sm text-[var(--muted-foreground)]">Loading diagram...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

import { visit } from "unist-util-visit";
import type { Root, Element, Text } from "hast";

interface Options {
  terms: Array<{ term_slug: string; term: string }>;
}

const SKIP_TAGS = new Set(["code", "pre", "h1", "h2", "h3", "h4", "h5", "h6", "a"]);

export function rehypeGlossary(options: Options = { terms: [] }) {
  const { terms } = options;
  if (!terms.length) return () => {};

  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
  const pattern = new RegExp(
    `\\b(${sorted.map((t) => escapeRegex(t.term)).join("|")})\\b`,
    "gi"
  );
  const slugByLower = new Map(
    terms.map((t) => [t.term.toLowerCase(), t.term_slug])
  );

  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === undefined) return;
      if (isSkipped(parent as Element)) return;

      const text = node.value;
      if (!pattern.test(text)) return;
      pattern.lastIndex = 0;

      const children: (Text | Element)[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
          children.push({ type: "text", value: text.slice(lastIndex, match.index) });
        }
        const matched = match[1];
        const slug = slugByLower.get(matched.toLowerCase());
        if (slug) {
          children.push({
            type: "element",
            tagName: "glossary-term",
            properties: { slug },
            children: [{ type: "text", value: matched }],
          });
        } else {
          children.push({ type: "text", value: matched });
        }
        lastIndex = pattern.lastIndex;
      }

      if (lastIndex < text.length) {
        children.push({ type: "text", value: text.slice(lastIndex) });
      }

      if (children.length > 0) {
        (parent as Element).children.splice(index, 1, ...children);
      }
    });
  };
}

function isSkipped(el: Element): boolean {
  if (!el) return false;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (
    el.tagName === "glossary-term" ||
    el.properties?.["data-glossary"] === true
  ) {
    return true;
  }
  return false;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

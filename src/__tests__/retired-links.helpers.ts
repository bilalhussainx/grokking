import fs from "node:fs";
import { retiredDestination, RETIRED_API_PREFIXES } from "@/lib/retired-routes";

// Quoted absolute paths: "/x", '/x', `/x` (a template stops at ${).
const PATH = /["'`](\/[A-Za-z0-9_\-/.]*)/g;

export function findRetiredReferences(files: string[]): string[] {
  const hits: string[] = [];
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    for (const m of src.matchAll(PATH)) {
      const p = m[1].split(/[?#]/)[0].replace(/\/$/, "") || "/";
      const retiredPage = !p.startsWith("/api/") && retiredDestination(p) !== null;
      const retiredApi = RETIRED_API_PREFIXES.some((a) => p === a || p.startsWith(`${a}/`));
      if (retiredPage || retiredApi) hits.push(`${file}: ${p}`);
    }
  }
  return hits;
}

import fs from "node:fs";
import path from "node:path";
import { retiredDestination } from "@/lib/retired-routes";

// Quoted absolute paths: "/x", '/x', `/x` (a template stops at ${).
const QUOTED_PATH = /["'`](\/[A-Za-z0-9_\-/.]*)/g;
// Full URLs on our own domains, quoted or not.
const OWN_URL = /kairoslearn\.(?:com|ai)(\/[A-Za-z0-9_\-/.]*)/g;

function apiRouteSegments(): string[][] {
  const out: string[][] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/^route\.(ts|tsx|js)$/.test(e.name)) {
        out.push(path.relative("src/app/api", dir).split(path.sep).filter(Boolean));
      }
    }
  };
  walk("src/app/api");
  return out;
}

const API_ROUTES = apiRouteSegments();
const isDynamic = (seg: string) => /^\[.*\]$/.test(seg);
const isCatchAll = (seg: string) => /^\[\[?\.\.\./.test(seg);

// True when some route under src/app/api can serve this path. The path may be
// a prefix: a template literal is cut at its first ${, e.g. "/api/cc/essays/".
export function isLiveApiPath(p: string): boolean {
  const segs = p.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  if (segs.length === 0) return true;
  return API_ROUTES.some((route) => {
    for (let i = 0; i < segs.length; i++) {
      const r = route[i];
      if (r === undefined) return false;
      if (isCatchAll(r)) return true;
      if (r !== segs[i] && !isDynamic(r)) return false;
    }
    return true;
  });
}

// Retired pages and dead API paths referenced in a piece of source text.
export function retiredRefsInText(text: string, { checkApi = true } = {}): string[] {
  const hits: string[] = [];
  const paths = [...text.matchAll(QUOTED_PATH), ...text.matchAll(OWN_URL)].map((m) => m[1]);
  for (const raw of paths) {
    const p = raw.split(/[?#]/)[0] || "/";
    if (p.startsWith("/api/") || p === "/api") {
      if (checkApi && !isLiveApiPath(p)) hits.push(p);
    } else if (retiredDestination(p) !== null) {
      hits.push(p);
    }
  }
  return hits;
}

export function findRetiredReferences(files: string[]): string[] {
  return files.flatMap((file) =>
    // middleware.ts lists API prefixes for auth rules, not calls.
    retiredRefsInText(fs.readFileSync(file, "utf8"), { checkApi: !file.endsWith("middleware.ts") })
      .map((p) => `${file}: ${p}`),
  );
}

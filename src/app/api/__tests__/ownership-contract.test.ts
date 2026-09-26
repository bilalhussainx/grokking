// Static tripwire: every route handler that WRITES through the service-role
// Supabase client must show ownership logic before or inside its first write
// statement. The service role bypasses RLS, so a write filtered by id alone
// lets any signed-in user modify any student's row. The tripwire caught every
// hole fixed in docs/superpowers/plans/2026-09-25-security-1a-*.md.
//
// It is a tripwire, not a proof: a handler can pass by doing an unrelated
// ownership lookup and then writing an unscoped row (recommenders/
// ask-email-text did exactly that and has its own behavioral test). New
// routes need real tests. Allowlist only with a written reason.
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["src/app/api/cc", "src/app/api/counselor"];
const HANDLER_SPLIT = /(?=export async function (?:GET|POST|PATCH|PUT|DELETE)\b)/;
const WRITE = /\.(update|delete|upsert)\(/;
const OWNERSHIP = new RegExp(
  [
    "getOwnedEssay", "getStudentProfileId", "buildEssayContext", "essayBelongsToStudent",
    "getStudentVisibility", "ensureStudentProfile", "getCounselorForUser", "getCounselorRow",
    "ownService", "getAnyAgencyMembership", "getAgencyMembership",
    String.raw`\.eq\(\s*"student_id"`,
    String.raw`\.eq\(\s*"(user_id|student_user_id|counselor_id|author_user_id)",\s*(auth\.)?user\.id\)`,
    String.raw`user_id:\s*(auth\.)?user\.id`,
    String.raw`\.student_id\s*!==`, String.raw`!==\s*\w+\.student_id`,
    String.raw`\.counselor_id\s*!==`, String.raw`\.user_id\s*!==`, String.raw`!==\s*(auth\.)?user\.id`,
  ].join("|"),
);

// "<repo-relative path> <METHOD>" → why it is safe without an owner check.
const ALLOWLIST: Record<string, string> = {
  "src/app/api/cc/intake/complete/route.ts POST":
    "Anonymous intake, authorized by the unguessable session_token (a capability).",
  "src/app/api/cc/intake/turn/route.ts POST":
    "Anonymous intake, authorized by the unguessable session_token (a capability).",
};

function unscopedWriteHandlers(source: string): string[] {
  const methods: string[] = [];
  for (const segment of source.split(HANDLER_SPLIT)) {
    const m = segment.match(/^export async function (GET|POST|PATCH|PUT|DELETE)/);
    if (!m) continue;
    const write = segment.search(WRITE);
    if (write < 0) continue;
    const end = segment.indexOf(";", write);
    if (!OWNERSHIP.test(segment.slice(0, end < 0 ? segment.length : end))) methods.push(m[1]);
  }
  return methods;
}

function routeFiles(dir: string, out: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name !== "__tests__") routeFiles(full, out);
    } else if (name === "route.ts") {
      out.push(full);
    }
  }
  return out;
}

describe("ownership contract for service-role writes", () => {
  it("flags a handler that writes by id alone", () => {
    const bad = `export async function PATCH(req) {
      const db = createAdminSupabase();
      await db.from("cc_essays").update({ x: 1 }).eq("id", id);
    }`;
    expect(unscopedWriteHandlers(bad)).toEqual(["PATCH"]);
  });

  it("accepts a handler that proves ownership first", () => {
    const good = `export async function PATCH(req) {
      const owned = await getOwnedEssay(db, auth.user.id, id);
      await db.from("cc_essays").update({ x: 1 }).eq("id", owned.id);
    }`;
    expect(unscopedWriteHandlers(good)).toEqual([]);
  });

  it("every service-role write in api/cc and api/counselor is ownership-scoped", () => {
    const violations: string[] = [];
    for (const root of ROOTS) {
      for (const file of routeFiles(root)) {
        const source = fs.readFileSync(file, "utf8");
        if (!/createAdmin/.test(source)) continue;
        const rel = file.split(path.sep).join("/");
        for (const method of unscopedWriteHandlers(source)) {
          const key = `${rel} ${method}`;
          if (!ALLOWLIST[key]) violations.push(key);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("every allowlist entry still points at a real route", () => {
    for (const key of Object.keys(ALLOWLIST)) {
      expect(fs.existsSync(key.split(" ")[0])).toBe(true);
    }
  });
});

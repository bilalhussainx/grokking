// @vitest-environment node
import { describe, it, expect } from "vitest";
import { isLocalPgUrl } from "./local-pg";

describe("isLocalPgUrl", () => {
  it("accepts localhost and 127.0.0.1", () => {
    expect(isLocalPgUrl("postgres://postgres:agent@localhost:55432/postgres")).toBe(true);
    expect(isLocalPgUrl("postgres://postgres:agent@127.0.0.1:55432/postgres")).toBe(true);
  });
  it("rejects remote hosts, lookalikes, junk and undefined", () => {
    expect(isLocalPgUrl("postgres://postgres:pw@db.xyz.supabase.co:5432/postgres")).toBe(false);
    expect(isLocalPgUrl("postgres://u:p@localhost.evil.com/postgres")).toBe(false);
    expect(isLocalPgUrl("not a url")).toBe(false);
    expect(isLocalPgUrl(undefined)).toBe(false);
  });
});

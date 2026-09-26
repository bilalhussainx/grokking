// In-memory stand-in for the subset of the supabase-js query builder our
// routes use. Ownership tests assert on the resulting rows ("Bob's essay is
// unchanged") instead of on mock call arguments, so a route that forgets a
// filter fails even if it calls .eq() with plausible-looking values.
export type FakeRow = Record<string, unknown>;
export type FakeTables = Record<string, FakeRow[]>;
export type FakeResult = { data: unknown; error: { message: string } | null };
type Mode = "select" | "insert" | "update" | "delete";

export interface FakeSupabase {
  from(table: string): FakeQuery;
  tables: FakeTables;
}

export class FakeQuery implements PromiseLike<FakeResult> {
  private mode: Mode = "select";
  private filters: Array<(r: FakeRow) => boolean> = [];
  private payload: FakeRow | FakeRow[] | null = null;
  private returning = false;
  private limitN: number | null = null;
  private singleMode: "single" | "maybe" | null = null;
  private columns: string[] | null = null;

  constructor(
    private readonly tables: FakeTables,
    private readonly table: string,
    private readonly nextId: () => string,
  ) {}

  select(columns?: string): this {
    if (this.mode !== "select") this.returning = true;
    // Project plain column lists like real PostgREST; "*" and embedded
    // joins ("student:cc_student_profiles(...)") return whole rows.
    if (columns && columns.trim() !== "*" && !/[():*]/.test(columns)) {
      this.columns = columns.split(",").map((c) => c.trim()).filter(Boolean);
    }
    return this;
  }
  insert(rows: FakeRow | FakeRow[]): this {
    this.mode = "insert";
    this.payload = rows;
    return this;
  }
  update(patch: FakeRow): this {
    this.mode = "update";
    this.payload = patch;
    return this;
  }
  delete(): this {
    this.mode = "delete";
    return this;
  }
  eq(col: string, val: unknown): this {
    this.filters.push((r) => r[col] === val);
    return this;
  }
  neq(col: string, val: unknown): this {
    this.filters.push((r) => r[col] !== val);
    return this;
  }
  in(col: string, vals: unknown[]): this {
    this.filters.push((r) => vals.includes(r[col]));
    return this;
  }
  is(col: string, val: unknown): this {
    this.filters.push((r) => (r[col] ?? null) === val);
    return this;
  }
  order(_col: string, _opts?: unknown): this {
    return this;
  }
  limit(n: number): this {
    this.limitN = n;
    return this;
  }
  single(): this {
    this.singleMode = "single";
    return this;
  }
  maybeSingle(): this {
    this.singleMode = "maybe";
    return this;
  }

  private run(): FakeResult {
    if (!this.tables[this.table]) this.tables[this.table] = [];
    const rows = this.tables[this.table];
    const matches = (r: FakeRow) => this.filters.every((f) => f(r));
    let hit: FakeRow[];
    if (this.mode === "insert") {
      const list = Array.isArray(this.payload) ? this.payload : [this.payload as FakeRow];
      hit = list.map((r) => ({ id: this.nextId(), ...r }));
      rows.push(...hit);
    } else if (this.mode === "update") {
      hit = rows.filter(matches);
      for (const r of hit) Object.assign(r, this.payload);
    } else if (this.mode === "delete") {
      hit = rows.filter(matches);
      this.tables[this.table] = rows.filter((r) => !matches(r));
    } else {
      hit = rows.filter(matches);
    }
    if (this.limitN !== null) hit = hit.slice(0, this.limitN);
    const cols = this.columns;
    const out = hit.map((r) =>
      cols ? Object.fromEntries(cols.map((c) => [c, r[c] ?? null])) : { ...r },
    );
    if (this.singleMode === "single") {
      return out.length === 1
        ? { data: out[0], error: null }
        : { data: null, error: { message: `expected 1 row, got ${out.length}` } };
    }
    if (this.singleMode === "maybe") {
      return out.length <= 1
        ? { data: out[0] ?? null, error: null }
        : { data: null, error: { message: "multiple rows returned" } };
    }
    if (this.mode !== "select" && !this.returning) return { data: null, error: null };
    return { data: out, error: null };
  }

  then<T1 = FakeResult, T2 = never>(
    onfulfilled?: ((value: FakeResult) => T1 | PromiseLike<T1>) | null,
    onrejected?: ((reason: unknown) => T2 | PromiseLike<T2>) | null,
  ): PromiseLike<T1 | T2> {
    return Promise.resolve(this.run()).then(onfulfilled, onrejected);
  }
}

export function createFakeSupabase(seed: FakeTables = {}): FakeSupabase {
  const tables: FakeTables = JSON.parse(JSON.stringify(seed)) as FakeTables;
  let n = 0;
  const nextId = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
  return { tables, from: (table: string) => new FakeQuery(tables, table, nextId) };
}

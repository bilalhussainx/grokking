import { describe, it, expect } from "vitest";
import { buildSeedRows, planSeed, UK_SEED, CA_SEED } from "../uk-canada-schools";
import { UK_SCHOOL_NAMES } from "@/lib/cc/uk/schools";
import { CANADIAN_SCHOOL_NAMES } from "@/lib/cc/canada/schools";
import { PLATFORMS } from "@/lib/cc/canada/application-platforms";

const rows = buildSeedRows();
const uk = rows.filter((r) => r.country === "UK");
const ca = rows.filter((r) => r.country === "CA");

describe("UK/Canada seed builder", () => {
  it("covers every UK school already in src/lib/cc/uk and every Canadian row", () => {
    const ukNames = uk.map((r) => r.name);
    for (const n of UK_SCHOOL_NAMES) expect(ukNames).toContain(n);
    expect(ca.map((r) => r.name).sort()).toEqual([...CANADIAN_SCHOOL_NAMES].sort());
  });

  it("has unique names (the upsert key)", () => {
    const names = rows.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every row a country, city, public type, website and application system", () => {
    for (const r of rows) {
      expect(["UK", "CA"]).toContain(r.country);
      expect(r.city).toBeTruthy();
      expect(r.school_type).toBe("public");
      expect(r.website).toMatch(/^https:\/\//);
      expect(r.application_platform).toBeTruthy();
    }
    for (const r of uk) expect(r.application_platform).toBe("UCAS");
    for (const r of ca) {
      expect(r.province).toMatch(/^(ON|BC|QC|AB)$/);
      expect(Object.keys(PLATFORMS)).toContain(r.application_platform);
    }
  });

  it("invents no numbers: acceptance rate, net price and test policy stay null", () => {
    for (const r of rows) {
      expect(r.acceptance_rate).toBeNull();
      expect(r.avg_net_price).toBeNull();
      expect(r.test_policy).toBeNull();
    }
  });

  it("keeps a source URL for every seeded entry", () => {
    for (const e of [...UK_SEED, ...CA_SEED]) {
      expect(e.sources.length).toBeGreaterThan(0);
      for (const s of e.sources) expect(s).toMatch(/^https:\/\//);
    }
  });

  it("only stores a deadline where it covers the whole university (Oxford, Cambridge)", () => {
    const withDeadline = rows.filter((r) => r.regular_deadline).map((r) => r.name).sort();
    expect(withDeadline).toEqual(["University of Cambridge", "University of Oxford"]);
    expect(rows.find((r) => r.name === "University of Oxford")!.regular_deadline).toBe("Oct 15");
  });

  it("with keepRates, leaves the stat columns out of the payload entirely", () => {
    for (const r of buildSeedRows({ keepRates: true })) {
      expect("acceptance_rate" in r).toBe(false);
      expect("avg_net_price" in r).toBe(false);
      expect("test_policy" in r).toBe(false);
    }
  });
});

describe("planSeed (idempotent upsert on name)", () => {
  it("inserts missing rows and updates only changed fields", () => {
    const toronto = rows.find((r) => r.name === "University of Toronto")!;
    const existing = [
      { ...toronto, id: "t1", city: null, acceptance_rate: 0.43 },
    ];
    const plan = planSeed(rows, existing);
    expect(plan.inserts.length).toBe(rows.length - 1);
    expect(plan.updates).toHaveLength(1);
    expect(plan.updates[0].id).toBe("t1");
    expect(plan.updates[0].changes).toEqual({
      city: { from: null, to: "Toronto" },
      acceptance_rate: { from: 0.43, to: null },
    });
  });

  it("is a no-op once applied", () => {
    const existing = rows.map((r, i) => ({ ...r, id: `id${i}` }));
    const plan = planSeed(rows, existing);
    expect(plan.inserts).toEqual([]);
    expect(plan.updates).toEqual([]);
    expect(plan.unchanged).toHaveLength(rows.length);
  });

  it("flags duplicate names in the table instead of guessing", () => {
    const oxford = rows.find((r) => r.name === "University of Oxford")!;
    const plan = planSeed(rows, [
      { ...oxford, id: "a" },
      { ...oxford, id: "b" },
    ]);
    expect(plan.duplicates).toEqual(["University of Oxford"]);
    expect(plan.updates.some((u) => u.name === "University of Oxford")).toBe(false);
    expect(plan.inserts.some((r) => r.name === "University of Oxford")).toBe(false);
  });
});

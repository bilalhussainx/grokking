// Grounded seed data for UK universities and the 12 Canadian cc_schools rows,
// plus a pure planner that turns it into an idempotent upsert keyed on name.
// Used by scripts/seed-uk-canada-schools.ts.
//
// Grounding rules:
//   - Only name, city, province, country, type, website, application system
//     and (Oxford/Cambridge only) the UCAS deadline are seeded.
//   - acceptance_rate, avg_net_price and test_policy are written as NULL: no
//     official source gives comparable numbers for these schools. The earlier
//     migrations' unsourced acceptance rates are cleared unless --keep-rates.
//   - cc_schools has no source_url column, so each entry keeps its sources here.
//
// UK set: the 24 Russell Group members (https://russellgroup.ac.uk/about/our-universities/,
// read 2026-10-03) plus St Andrews, which src/lib/cc/uk already covers.
// All of them take undergraduate applications through UCAS.
//
// UCAS 2027 entry (read 2026-10-03,
// https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications):
//   "15 Oct (18:00 UK time) Equal consideration date for applications to the
//    universities of Oxford and Cambridge, and for most courses in medicine,
//    dentistry, and veterinary medicine/science"
//   "13 Jan [2027] (18:00 UK time) Equal consideration date for applications
//    for most undergraduate courses"
// Only Oxford and Cambridge get a stored deadline: elsewhere it depends on the
// course (medicine/dentistry/vet close 15 Oct), so the UI points to UCAS.

export interface SeedRow {
  name: string;
  city: string;
  province: string | null;
  country: "UK" | "CA";
  school_type: "public";
  website: string;
  application_platform: string;
  regular_deadline: string | null;
  acceptance_rate?: null;
  avg_net_price?: null;
  test_policy?: null;
}

export interface SeedEntry {
  row: Omit<SeedRow, "acceptance_rate" | "avg_net_price" | "test_policy">;
  sources: string[];
}

const RUSSELL_GROUP = "https://russellgroup.ac.uk/about/our-universities/";
const UCAS_DATES =
  "https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications";

function ukEntry(name: string, city: string, website: string, opts: { russellGroup?: boolean; oxbridge?: boolean } = {}): SeedEntry {
  const { russellGroup = true, oxbridge = false } = opts;
  return {
    row: {
      name,
      city,
      province: null,
      country: "UK",
      school_type: "public",
      website,
      application_platform: "UCAS",
      // US rows store "Mon D"; the timeline and dashboard parse that format.
      regular_deadline: oxbridge ? "Oct 15" : null,
    },
    sources: [...(russellGroup ? [RUSSELL_GROUP] : []), website, ...(oxbridge ? [UCAS_DATES] : [])],
  };
}

// Names match src/data/uk/*.json where a school already appears there.
export const UK_SEED: SeedEntry[] = [
  ukEntry("University of Oxford", "Oxford", "https://www.ox.ac.uk", { oxbridge: true }),
  ukEntry("University of Cambridge", "Cambridge", "https://www.cam.ac.uk", { oxbridge: true }),
  ukEntry("Imperial College London", "London", "https://www.imperial.ac.uk"),
  ukEntry("London School of Economics and Political Science", "London", "https://www.lse.ac.uk"),
  ukEntry("University College London", "London", "https://www.ucl.ac.uk"),
  ukEntry("King's College London", "London", "https://www.kcl.ac.uk"),
  ukEntry("Queen Mary University of London", "London", "https://www.qmul.ac.uk"),
  ukEntry("University of Edinburgh", "Edinburgh", "https://www.ed.ac.uk"),
  ukEntry("University of Glasgow", "Glasgow", "https://www.gla.ac.uk"),
  ukEntry("University of St Andrews", "St Andrews", "https://www.st-andrews.ac.uk", { russellGroup: false }),
  ukEntry("Cardiff University", "Cardiff", "https://www.cardiff.ac.uk"),
  ukEntry("Queen's University Belfast", "Belfast", "https://www.qub.ac.uk"),
  ukEntry("University of Manchester", "Manchester", "https://www.manchester.ac.uk"),
  ukEntry("University of Bristol", "Bristol", "https://www.bristol.ac.uk"),
  ukEntry("University of Warwick", "Coventry", "https://warwick.ac.uk"),
  ukEntry("Durham University", "Durham", "https://www.durham.ac.uk"),
  ukEntry("University of Birmingham", "Birmingham", "https://www.birmingham.ac.uk"),
  ukEntry("University of Exeter", "Exeter", "https://www.exeter.ac.uk"),
  ukEntry("University of Leeds", "Leeds", "https://www.leeds.ac.uk"),
  ukEntry("University of Liverpool", "Liverpool", "https://www.liverpool.ac.uk"),
  ukEntry("Newcastle University", "Newcastle upon Tyne", "https://www.ncl.ac.uk"),
  ukEntry("University of Nottingham", "Nottingham", "https://www.nottingham.ac.uk"),
  ukEntry("University of Sheffield", "Sheffield", "https://www.sheffield.ac.uk"),
  ukEntry("University of Southampton", "Southampton", "https://www.southampton.ac.uk"),
  ukEntry("University of York", "York", "https://www.york.ac.uk"),
];

const OUAC = "https://www.ouac.on.ca/";

function caEntry(
  name: string,
  city: string,
  province: "ON" | "BC" | "QC" | "AB",
  application_platform: string,
  website: string,
  platformSource: string,
): SeedEntry {
  return {
    row: { name, city, province, country: "CA", school_type: "public", website, application_platform, regular_deadline: null },
    sources: [website, platformSource],
  };
}

// The 12 rows seeded by supabase/migrations/20260504_canadian_schools.sql.
// Platforms checked 2026-10-03: U of T's how-to-apply page says "All
// applications to U of T start with the Ontario Universities' Application
// Centre (OUAC)"; UBC and SFU apply through EducationPlannerBC; McGill and
// Alberta take applications on their own sites.
export const CA_SEED: SeedEntry[] = [
  caEntry("University of Toronto", "Toronto", "ON", "OUAC", "https://future.utoronto.ca", "https://future.utoronto.ca/how-to-apply"),
  caEntry("University of Waterloo", "Waterloo", "ON", "OUAC", "https://uwaterloo.ca", OUAC),
  caEntry("Queen's University", "Kingston", "ON", "OUAC", "https://www.queensu.ca", OUAC),
  caEntry("Western University", "London", "ON", "OUAC", "https://www.uwo.ca", OUAC),
  caEntry("McMaster University", "Hamilton", "ON", "OUAC", "https://www.mcmaster.ca", OUAC),
  caEntry("University of Ottawa", "Ottawa", "ON", "OUAC", "https://www.uottawa.ca", OUAC),
  caEntry("Toronto Metropolitan University", "Toronto", "ON", "OUAC", "https://www.torontomu.ca", OUAC),
  caEntry("York University", "Toronto", "ON", "OUAC", "https://www.yorku.ca", OUAC),
  caEntry("University of British Columbia", "Vancouver", "BC", "EducationPlannerBC", "https://you.ubc.ca", "https://you.ubc.ca/apply/"),
  caEntry("Simon Fraser University", "Burnaby", "BC", "EducationPlannerBC", "https://www.sfu.ca", "https://www.sfu.ca/students/admission/apply.html"),
  caEntry("McGill University", "Montreal", "QC", "McGill_direct", "https://www.mcgill.ca/undergraduate-admissions/", "https://www.mcgill.ca/undergraduate-admissions/apply"),
  caEntry("University of Alberta", "Edmonton", "AB", "UAlberta_direct", "https://www.ualberta.ca", "https://www.ualberta.ca/en/admissions/undergraduate/how-to-apply.html"),
];

export function buildSeedRows(opts: { keepRates?: boolean } = {}): SeedRow[] {
  return [...UK_SEED, ...CA_SEED].map(({ row }) =>
    opts.keepRates ? { ...row } : { ...row, acceptance_rate: null, avg_net_price: null, test_policy: null },
  );
}

export type ExistingSchool = { id: string; name: string } & Record<string, unknown>;

export interface SeedPlan {
  inserts: SeedRow[];
  updates: { id: string; name: string; changes: Record<string, { from: unknown; to: unknown }> }[];
  unchanged: string[];
  // Names with more than one existing row: skipped, needs a human decision.
  duplicates: string[];
}

export function planSeed(rows: SeedRow[], existing: ExistingSchool[]): SeedPlan {
  const byName = new Map<string, ExistingSchool[]>();
  for (const e of existing) byName.set(e.name, [...(byName.get(e.name) ?? []), e]);

  const plan: SeedPlan = { inserts: [], updates: [], unchanged: [], duplicates: [] };
  for (const row of rows) {
    const matches = byName.get(row.name) ?? [];
    if (matches.length === 0) {
      plan.inserts.push(row);
      continue;
    }
    if (matches.length > 1) {
      plan.duplicates.push(row.name);
      continue;
    }
    const current = matches[0];
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    for (const [key, to] of Object.entries(row)) {
      const from = current[key] ?? null;
      if (from !== to) changes[key] = { from, to };
    }
    if (Object.keys(changes).length === 0) plan.unchanged.push(row.name);
    else plan.updates.push({ id: current.id, name: row.name, changes });
  }
  return plan;
}

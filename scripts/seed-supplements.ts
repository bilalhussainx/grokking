/**
 * Seed cc_school_supplements with 2025-26 supplement prompts.
 *
 * Idempotent: skips rows where (school_id, prompt_text) already exists.
 * Looks up schools by exact name match against cc_schools.name.
 *
 * Run: npx tsx scripts/seed-supplements.ts
 *
 * Requires env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { SUPPLEMENT_PACKS } from "../src/data/cc/supplements-2025-26";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seed() {
  let inserted = 0;
  let skipped = 0;
  let stubsCreated = 0;
  const missingSchools: string[] = [];

  for (const pack of SUPPLEMENT_PACKS) {
    let { data: school } = await supabase
      .from("cc_schools")
      .select("id")
      .eq("name", pack.school_name)
      .maybeSingle();

    if (!school && pack.stub) {
      const { data: newSchool, error: stubErr } = await supabase
        .from("cc_schools")
        .insert({
          name: pack.school_name,
          city: pack.stub.city,
          state: pack.stub.state,
          country: pack.stub.country || "US",
          institution_type: pack.stub.institution_type || "private",
        })
        .select("id")
        .single();
      if (stubErr || !newSchool) {
        console.error(`Stub insert failed for ${pack.school_name}:`, stubErr?.message);
        missingSchools.push(pack.school_name);
        continue;
      }
      school = newSchool;
      stubsCreated++;
      console.log(`  [stub] Created cc_schools row for ${pack.school_name}`);
    }

    if (!school) {
      missingSchools.push(pack.school_name);
      continue;
    }

    const { data: existing } = await supabase
      .from("cc_school_supplements")
      .select("prompt_text")
      .eq("school_id", school.id)
      .eq("academic_year", pack.academic_year);

    const existingTexts = new Set((existing || []).map((r) => r.prompt_text));

    const rows = pack.supplements
      .filter((sup) => !existingTexts.has(sup.prompt_text))
      .map((sup) => ({
        school_id: school.id,
        prompt_text: sup.prompt_text,
        word_limit: sup.word_limit,
        is_required: sup.is_required,
        supplement_type: sup.supplement_type,
        category: sup.category,
        academic_year: pack.academic_year,
        sort_order: sup.sort_order,
        source_url: pack.source_url,
      }));

    if (rows.length === 0) {
      skipped += pack.supplements.length;
      continue;
    }

    const { error } = await supabase.from("cc_school_supplements").insert(rows);
    if (error) {
      console.error(`Insert failed for ${pack.school_name}:`, error.message);
      continue;
    }
    inserted += rows.length;
    skipped += pack.supplements.length - rows.length;
    console.log(`  ${pack.school_name}: +${rows.length} (${pack.supplements.length - rows.length} already present)`);
  }

  console.log("");
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped (already present): ${skipped}`);
  console.log(`Stub schools created: ${stubsCreated}`);
  if (missingSchools.length) {
    console.log("");
    console.log("Schools not found in cc_schools — run scripts/seed-schools.ts first or add missing rows:");
    missingSchools.forEach((n) => console.log(`  - ${n}`));
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

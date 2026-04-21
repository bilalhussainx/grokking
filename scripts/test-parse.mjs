import fs from 'fs';

const sql = fs.readFileSync('supabase/migrations/025_seed_problems.sql', 'utf-8');

// Split on INSERT INTO
const blocks = sql.split(/(?=INSERT INTO interview_problems)/);
console.log('Header + blocks:', blocks.length);

// Test first 3 problem blocks
for (let b = 1; b <= 3 && b < blocks.length; b++) {
  const block = blocks[b];
  const eStringRegex = /E'((?:[^'\\]|\\.|'')*?)'/g;
  const eStrings = [];
  let m;
  while ((m = eStringRegex.exec(block)) !== null) {
    eStrings.push(m[1]);
  }

  const slugMatch = block.match(/VALUES\s*\(\s*'([^']+)'/);
  const slug = slugMatch ? slugMatch[1] : 'NOT FOUND';

  const fnMatch = block.match(/'::jsonb,\s*\n\s*'([a-z_]+)',\s*\n\s*E'/);
  const fn = fnMatch ? fnMatch[1] : 'NOT FOUND';

  console.log(`\n--- Block ${b}: ${slug} ---`);
  console.log('Function:', fn);
  console.log('E-strings found:', eStrings.length);
  eStrings.forEach((s, i) => console.log(`  [${i}] ${s.slice(0, 80)}...`));
}

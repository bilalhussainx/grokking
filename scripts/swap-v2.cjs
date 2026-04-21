/**
 * swap-v2.cjs — Replace original module files with their .v2.ts rewrites.
 *
 * For each *.v2.ts file found under src/data/:
 *   1. Verify export name matches original
 *   2. Overwrite original .ts with .v2.ts content
 *   3. Delete .v2.ts
 *
 * Usage:
 *   node scripts/swap-v2.cjs --dry-run   # preview only
 *   node scripts/swap-v2.cjs             # do the swap
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

function findV2Files(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findV2Files(full));
    } else if (entry.name.endsWith('.v2.ts')) {
      results.push(full);
    }
  }
  return results;
}

function getExportName(content) {
  const m = content.match(/export const (\w+)/);
  return m ? m[1] : null;
}

const v2Files = findV2Files(DATA_DIR).sort();
console.log(`Found ${v2Files.length} .v2.ts files\n`);

let swapped = 0, skipped = 0, errors = 0;

for (const v2Path of v2Files) {
  const origPath = v2Path.replace('.v2.ts', '.ts');
  const rel = path.relative(DATA_DIR, v2Path);

  if (!fs.existsSync(origPath)) {
    console.log(`SKIP ${rel} — no original found`);
    skipped++;
    continue;
  }

  const origContent = fs.readFileSync(origPath, 'utf8');
  const v2Content = fs.readFileSync(v2Path, 'utf8');

  const origExport = getExportName(origContent);
  const v2Export = getExportName(v2Content);

  if (origExport !== v2Export) {
    console.log(`ERROR ${rel} — export mismatch: ${origExport} vs ${v2Export}`);
    errors++;
    continue;
  }

  if (DRY_RUN) {
    console.log(`WOULD SWAP ${rel} (${origExport})`);
  } else {
    fs.writeFileSync(origPath, v2Content);
    fs.unlinkSync(v2Path);
    console.log(`SWAPPED ${rel} → ${path.basename(origPath)}`);
  }
  swapped++;
}

console.log(`\nDone: ${swapped} swapped, ${skipped} skipped, ${errors} errors`);
if (DRY_RUN) console.log('(dry run — no files changed)');

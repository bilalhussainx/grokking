import fs from 'fs';
const sql = fs.readFileSync('supabase/migrations/025_seed_problems.sql', 'utf-8');

let i = 0, inE = false, inS = false, splits = 0, lastSplit = 0;
const big = [];

while (i < sql.length) {
  const ch = sql[i];

  if (!inE && !inS && ch === 'E' && sql[i + 1] === "'") {
    const prev = i > 0 ? sql[i - 1] : ' ';
    if (/[\s,(]/.test(prev)) { inE = true; i += 2; continue; }
  }

  if (inE) {
    if (ch === '\\' && i + 1 < sql.length) { i += 2; continue; }
    if (ch === "'") {
      if (sql[i + 1] === "'") { i += 2; continue; }
      inE = false; i++; continue;
    }
    i++; continue;
  }

  if (inS) {
    if (ch === "'") {
      if (sql[i + 1] === "'") { i += 2; continue; }
      inS = false; i++; continue;
    }
    i++; continue;
  }

  if (ch === "'") { inS = true; i++; continue; }

  if (ch === ';' && (sql[i + 1] === '\n' || sql[i + 1] === '\r' || sql[i + 1] === undefined)) {
    splits++;
    const chunk = sql.slice(lastSplit, i + 1);
    if (chunk.length > 30000) {
      // Find INSERT count in this chunk
      const inserts = (chunk.match(/INSERT INTO interview_problems/g) || []).length;
      big.push({ split: splits, len: chunk.length, inserts, offset: lastSplit });
    }
    lastSplit = i + 1;
  }
  i++;
}

console.log('Total splits:', splits);
console.log('Big merged statements:');
big.forEach(b => console.log(`  #${b.split} len=${b.len} inserts=${b.inserts} offset=${b.offset}`));

// Checks that migration 028 is applied by probing the two new tables.
// Run with: node --env-file=.env.local scripts/credentials-check-migration.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(2);
}

async function probe(table) {
  const r = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await r.text();
  return { status: r.status, body: body.slice(0, 300) };
}

const wallets = await probe("user_wallets");
const creds = await probe("issued_credentials");

console.log("user_wallets:      ", wallets.status, wallets.body);
console.log("issued_credentials:", creds.status, creds.body);

const ok = wallets.status === 200 && creds.status === 200;
console.log(ok ? "\n✓ Migration 028 applied" : "\n✗ Migration 028 NOT applied — run it in Supabase SQL editor");
process.exit(ok ? 0 : 1);

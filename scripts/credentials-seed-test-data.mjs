// Seeds a python-fundamentals course completion for the allowlisted user so
// that diploma becomes eligible for the smoke test.
// Run: node --env-file=.env.local scripts/credentials-seed-test-data.mjs
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.env.CREDENTIALS_PRO_ALLOWLIST;
if (!url || !key || !userId) {
  console.error("Missing env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / CREDENTIALS_PRO_ALLOWLIST");
  process.exit(2);
}

async function sb(path, opts = {}) {
  const r = await fetch(`${url}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(opts.headers ?? {}),
    },
  });
  return { status: r.status, body: await r.text() };
}

// 1. Check xp_transactions schema first (columns may vary)
const schemaProbe = await sb("xp_transactions?select=*&limit=1");
console.log("xp_transactions probe:", schemaProbe.status, schemaProbe.body.slice(0, 300));

// 2. Check existing python-fundamentals completion for this user
const existing = await sb(
  `xp_transactions?user_id=eq.${userId}&action=eq.course_complete&ref_id=eq.python-fundamentals`,
);
console.log("Existing python-fundamentals rows:", existing.status, existing.body);

if (existing.status === 200 && existing.body && existing.body !== "[]") {
  console.log("\n✓ python-fundamentals completion already present. No seed needed.");
  process.exit(0);
}

// 3. Insert a completion row
const insert = await sb("xp_transactions", {
  method: "POST",
  body: JSON.stringify({
    user_id: userId,
    action: "course_complete",
    ref_id: "python-fundamentals",
    amount: 50,
  }),
});
console.log("\nInsert:", insert.status);
console.log(insert.body);
process.exit(insert.status >= 200 && insert.status < 300 ? 0 : 1);

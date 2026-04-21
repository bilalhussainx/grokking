// Preflight for Task 13 smoke test.
// Run with: node --env-file=.env.local scripts/credentials-preflight.mjs
import { createPublicClient, http, formatEther } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const checks = [];
const pass = (n, d) => checks.push({ status: "PASS", name: n, detail: d });
const fail = (n, d) => checks.push({ status: "FAIL", name: n, detail: d });
const warn = (n, d) => checks.push({ status: "WARN", name: n, detail: d });

function req(name) {
  const v = process.env[name];
  if (!v) { fail(name, "missing"); return null; }
  pass(name, name.includes("SECRET") || name.includes("JWT") || name.includes("KEY") ? `set (${v.length} chars)` : v);
  return v;
}

const privyApp = req("NEXT_PUBLIC_PRIVY_APP_ID");
const privySecret = req("PRIVY_APP_SECRET");
const baseRpc = req("BASE_RPC_URL");
const registry = req("SBT_REGISTRY_ADDRESS");
const issuerPk = req("ISSUER_PRIVATE_KEY");
const pinataJwt = req("PINATA_JWT");
req("PINATA_GATEWAY");
const allowlist = req("CREDENTIALS_PRO_ALLOWLIST");

if (privySecret && !privySecret.startsWith("privy_app_secret_")) {
  warn("PRIVY_APP_SECRET", "does not start with 'privy_app_secret_' — may be truncated");
}
if (allowlist && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(allowlist)) {
  warn("CREDENTIALS_PRO_ALLOWLIST", "doesn't look like a UUID");
}

// Validate issuer key format + derive address
let issuerAddress = null;
if (issuerPk) {
  if (!/^0x[0-9a-fA-F]{64}$/.test(issuerPk)) {
    fail("ISSUER_PRIVATE_KEY", "not a 0x-prefixed 64-hex string");
  } else {
    try {
      const acct = privateKeyToAccount(issuerPk);
      issuerAddress = acct.address;
      pass("ISSUER_ADDRESS (derived)", issuerAddress);
    } catch (e) {
      fail("ISSUER_PRIVATE_KEY", "could not derive account: " + e.message);
    }
  }
}

// RPC + balance + contract code
if (baseRpc && issuerAddress && registry) {
  try {
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(baseRpc),
    });
    const chainId = await client.getChainId();
    if (chainId === 84532) pass("RPC chain id", "84532 (Base Sepolia)");
    else fail("RPC chain id", `got ${chainId}, expected 84532`);

    const bal = await client.getBalance({ address: issuerAddress });
    const eth = Number(formatEther(bal));
    if (eth === 0) fail("Issuer balance", `0 ETH — fund ${issuerAddress} before minting`);
    else if (eth < 0.00005) warn("Issuer balance", `${eth} ETH — low; ~1-2 mints left`);
    else pass("Issuer balance", `${eth} ETH`);

    const code = await client.getCode({ address: registry });
    if (!code || code === "0x") fail("SBT registry contract", `no code at ${registry} on chain 84532`);
    else pass("SBT registry contract", `${code.length} bytes of bytecode at ${registry}`);
  } catch (e) {
    fail("RPC preflight", e.message);
  }
}

// Pinata auth probe
if (pinataJwt) {
  try {
    const r = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      headers: { Authorization: `Bearer ${pinataJwt}` },
    });
    if (r.ok) pass("Pinata auth", "ok");
    else fail("Pinata auth", `HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
  } catch (e) {
    fail("Pinata auth", e.message);
  }
}

// Report
console.log("\n=== Credentials preflight ===\n");
for (const c of checks) {
  const icon = c.status === "PASS" ? "✓" : c.status === "WARN" ? "⚠" : "✗";
  console.log(`${icon} [${c.status}] ${c.name}: ${c.detail}`);
}
const fails = checks.filter((c) => c.status === "FAIL").length;
const warns = checks.filter((c) => c.status === "WARN").length;
console.log(`\n${checks.filter((c) => c.status === "PASS").length} pass, ${warns} warn, ${fails} fail\n`);
process.exit(fails > 0 ? 1 : 0);

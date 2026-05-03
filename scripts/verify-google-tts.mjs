#!/usr/bin/env node
// Verify Google Cloud TTS wiring end-to-end.
//
// 1. Reads GOOGLE_CLOUD_CREDENTIALS from .env.local
// 2. Parses + confirms client_email matches the expected service account
// 3. Synthesizes a tiny Urdu phrase via Google Cloud TTS
// 4. Writes the MP3 to /tmp and reports byte size
//
// Run: node scripts/verify-google-tts.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXPECTED_EMAIL = "kairos-tts@mcpobsidian.iam.gserviceaccount.com";
const TEST_PHRASE = "السلام علیکم، یہ کوچ کیروس کا ٹیسٹ ہے۔";
const ENV_PATH = join(process.cwd(), ".env.local");

function loadEnv() {
  const raw = readFileSync(ENV_PATH, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!m) continue;
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

async function main() {
  console.log("[verify-google-tts] step 1: loading .env.local");
  loadEnv();

  const raw = process.env.GOOGLE_CLOUD_CREDENTIALS;
  if (!raw) {
    console.error("FAIL: GOOGLE_CLOUD_CREDENTIALS not set in .env.local");
    process.exit(1);
  }
  console.log(`        loaded GOOGLE_CLOUD_CREDENTIALS (${raw.length} bytes)`);

  console.log("[verify-google-tts] step 2: parsing JSON");
  let creds;
  try {
    creds = JSON.parse(raw);
  } catch (err) {
    console.error(`FAIL: GOOGLE_CLOUD_CREDENTIALS is not valid JSON: ${err.message}`);
    console.error(`        first 80 chars: ${raw.slice(0, 80)}`);
    process.exit(1);
  }
  console.log(`        OK — type=${creds.type ?? "(missing)"}, project_id=${creds.project_id ?? "(missing)"}`);

  console.log("[verify-google-tts] step 3: confirming client_email");
  if (creds.client_email !== EXPECTED_EMAIL) {
    console.error(`FAIL: client_email mismatch`);
    console.error(`        expected: ${EXPECTED_EMAIL}`);
    console.error(`        got:      ${creds.client_email}`);
    process.exit(1);
  }
  console.log(`        OK — ${creds.client_email}`);

  if (!creds.private_key || !creds.private_key.includes("BEGIN PRIVATE KEY")) {
    console.error("FAIL: private_key missing or malformed");
    process.exit(1);
  }
  console.log(`        private_key present (${creds.private_key.length} chars, includes PEM header)`);

  console.log("[verify-google-tts] step 4: importing TTS client + calling synthesizeSpeech");
  const { default: textToSpeech } = await import("@google-cloud/text-to-speech");
  const client = new textToSpeech.TextToSpeechClient({ credentials: creds });

  const start = Date.now();
  const [response] = await client.synthesizeSpeech({
    input: { text: TEST_PHRASE },
    voice: { languageCode: "ur-IN", name: "ur-IN-Standard-A" },
    audioConfig: { audioEncoding: "MP3", speakingRate: 0.95 },
  });
  const elapsed = Date.now() - start;

  const audio = response.audioContent;
  if (!audio) {
    console.error("FAIL: API returned empty audioContent");
    process.exit(1);
  }

  const bytes = audio instanceof Uint8Array ? audio.length : Buffer.from(audio, "base64").length;
  const buf = audio instanceof Uint8Array ? Buffer.from(audio) : Buffer.from(audio, "base64");
  const outPath = join(process.cwd(), "tmp-urdu-test.mp3");
  writeFileSync(outPath, buf);

  console.log(`        OK — ${bytes} bytes received in ${elapsed}ms`);
  console.log(`        wrote ${outPath}`);
  console.log("");
  console.log("PASS: Google Cloud TTS wiring verified for Urdu (ur-IN-Standard-A)");
  console.log(`      service account: ${creds.client_email}`);
  console.log(`      project:         ${creds.project_id}`);
  console.log(`      MP3 size:        ${bytes} bytes (~${(bytes / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error("");
  console.error("FAIL: unexpected error during verification");
  console.error(err);
  if (err.code === 7 || err.code === 16) {
    console.error("");
    console.error("HINT: code 7 = PERMISSION_DENIED, code 16 = UNAUTHENTICATED");
    console.error("      → enable 'Cloud Text-to-Speech API' on the GCP project");
    console.error("      → or grant the service account 'Cloud Text-to-Speech User' role");
  }
  process.exit(1);
});

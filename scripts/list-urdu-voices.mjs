#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ENV_PATH = join(process.cwd(), ".env.local");
const raw = readFileSync(ENV_PATH, "utf8");
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (!m) continue;
  let val = m[2];
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
  if (!process.env[m[1]]) process.env[m[1]] = val;
}

const creds = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
const { default: textToSpeech } = await import("@google-cloud/text-to-speech");
const client = new textToSpeech.TextToSpeechClient({ credentials: creds });

const [{ voices }] = await client.listVoices({});
console.log(`Total voices: ${voices.length}`);

// Top countries sending students to US/UK/Canada — verify Google TTS voice
// availability for each. Only need ONE working Standard-tier voice per
// language (rest is gravy).
const CANDIDATES = [
  ["ur", "Urdu (Pakistan)"],
  ["cmn", "Mandarin Chinese"],
  ["zh", "Chinese (alt code)"],
  ["ko", "Korean"],
  ["ar", "Arabic"],
  ["vi", "Vietnamese"],
  ["pt", "Portuguese"],
  ["fa", "Persian/Farsi"],
  ["ru", "Russian"],
  ["tr", "Turkish"],
  ["pa", "Punjabi"],
  ["fil", "Filipino"],
  ["id", "Indonesian"],
  ["th", "Thai"],
  ["uk", "Ukrainian"],
  ["pl", "Polish"],
];

for (const [prefix, label] of CANDIDATES) {
  const matches = voices.filter((v) =>
    v.languageCodes.some((c) => c.toLowerCase().startsWith(prefix.toLowerCase() + "-")),
  );
  const standard = matches.filter((v) => v.name.includes("-Standard-"));
  const female = matches.filter((v) => v.ssmlGender === "FEMALE");
  console.log(
    `\n[${prefix}] ${label}: ${matches.length} voices (${standard.length} Standard tier, ${female.length} female)`,
  );
  // Show first Standard female voice as the recommended default
  const recommended = standard.find((v) => v.ssmlGender === "FEMALE") ?? standard[0] ?? matches[0];
  if (recommended) {
    console.log(`   recommended → ${recommended.name}  ${recommended.languageCodes.join(",")}  ${recommended.ssmlGender}`);
  } else {
    console.log(`   ⚠ NO VOICES available`);
  }
}

import fs from "node:fs";
import path from "node:path";

const src = "public/media/brainstorm-redesign-standalone (1).html";
const raw = fs.readFileSync(src, "utf8");
const lines = raw.split("\n");
const jsonLine = lines.find((l) => l.trim().startsWith('"<!DOCTYPE'));
if (!jsonLine) {
  console.error("Could not find JSON-wrapped inner HTML");
  process.exit(1);
}
const inner = JSON.parse(jsonLine);
const out = path.join(process.cwd(), ".research/tmp-brainstorm-mockup.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, inner, "utf8");
console.log(`Wrote ${inner.length} bytes to ${out}`);

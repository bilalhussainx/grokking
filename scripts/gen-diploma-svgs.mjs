// One-off generator for placeholder diploma SVGs.
// Run: node scripts/gen-diploma-svgs.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "public/credentials/diplomas";
mkdirSync(OUT, { recursive: true });

const diplomas = [
  { id: "coding-interview-foundations", title: "Coding Interview\nFoundations", accent: "#8b5cf6", emblem: "circle" },
  { id: "google-swe-mock-mastery", title: "Google SWE\nMock Mastery", accent: "#38bdf8", emblem: "hex" },
  { id: "meta-swe-mock-mastery", title: "Meta SWE\nMock Mastery", accent: "#60a5fa", emblem: "diamond" },
  { id: "amazon-swe-mock-mastery", title: "Amazon SWE\nMock Mastery", accent: "#f59e0b", emblem: "triangle" },
  { id: "system-design-fundamentals", title: "System Design\nFundamentals", accent: "#10b981", emblem: "grid" },
  { id: "data-structures-mastery", title: "Data Structures\nMastery", accent: "#14b8a6", emblem: "tree" },
  { id: "dynamic-programming-mastery", title: "Dynamic\nProgramming", accent: "#a3e635", emblem: "hex" },
  { id: "python-fundamentals", title: "Python\nFundamentals", accent: "#fbbf24", emblem: "circle" },
  { id: "javascript-fundamentals", title: "JavaScript\nFundamentals", accent: "#facc15", emblem: "square" },
  { id: "react-developer", title: "React\nDeveloper", accent: "#22d3ee", emblem: "atom" },
  { id: "behavioral-interview-pro", title: "Behavioral\nInterview Pro", accent: "#f43f5e", emblem: "star" },
];

function emblem(kind, color) {
  switch (kind) {
    case "circle":
      return `<circle cx="200" cy="140" r="60" fill="none" stroke="${color}" stroke-width="5"/>`;
    case "hex":
      return `<polygon points="200,80 252,110 252,170 200,200 148,170 148,110" fill="none" stroke="${color}" stroke-width="5"/>`;
    case "diamond":
      return `<polygon points="200,80 260,140 200,200 140,140" fill="none" stroke="${color}" stroke-width="5"/>`;
    case "triangle":
      return `<polygon points="200,80 262,200 138,200" fill="none" stroke="${color}" stroke-width="5"/>`;
    case "square":
      return `<rect x="140" y="80" width="120" height="120" rx="10" fill="none" stroke="${color}" stroke-width="5"/>`;
    case "grid":
      return `<g fill="none" stroke="${color}" stroke-width="4">
      <rect x="140" y="80" width="50" height="50" rx="6"/>
      <rect x="210" y="80" width="50" height="50" rx="6"/>
      <rect x="140" y="150" width="50" height="50" rx="6"/>
      <rect x="210" y="150" width="50" height="50" rx="6"/>
    </g>`;
    case "tree":
      return `<g fill="none" stroke="${color}" stroke-width="4">
      <circle cx="200" cy="90" r="14"/>
      <circle cx="160" cy="150" r="14"/>
      <circle cx="240" cy="150" r="14"/>
      <circle cx="140" cy="200" r="14"/>
      <circle cx="180" cy="200" r="14"/>
      <line x1="200" y1="104" x2="160" y2="136"/>
      <line x1="200" y1="104" x2="240" y2="136"/>
      <line x1="160" y1="164" x2="140" y2="186"/>
      <line x1="160" y1="164" x2="180" y2="186"/>
    </g>`;
    case "atom":
      return `<g fill="none" stroke="${color}" stroke-width="4">
      <ellipse cx="200" cy="140" rx="70" ry="26"/>
      <ellipse cx="200" cy="140" rx="70" ry="26" transform="rotate(60 200 140)"/>
      <ellipse cx="200" cy="140" rx="70" ry="26" transform="rotate(120 200 140)"/>
      <circle cx="200" cy="140" r="8" fill="${color}"/>
    </g>`;
    case "star":
      return `<polygon points="200,80 218,130 270,130 228,160 244,210 200,180 156,210 172,160 130,130 182,130" fill="none" stroke="${color}" stroke-width="5"/>`;
    default:
      return "";
  }
}

function render({ id, title, accent, emblem: kind }) {
  const lines = title.split("\n");
  const textEls = lines
    .map(
      (t, i) =>
        `<text x="200" y="${265 + i * 30}" font-family="Inter, sans-serif" font-size="24" font-weight="700" fill="#ffffff" text-anchor="middle">${t}</text>`,
    )
    .join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f0f1e"/>
      <stop offset="1" stop-color="#1a1033"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)" rx="24"/>
  <rect width="400" height="400" fill="url(#accent)" rx="24"/>
  <rect x="12" y="12" width="376" height="376" rx="18" fill="none" stroke="${accent}" stroke-opacity="0.4" stroke-width="2"/>
  ${emblem(kind, accent)}
  ${textEls}
  <text x="200" y="360" font-family="Inter, sans-serif" font-size="11" letter-spacing="2" fill="${accent}" text-anchor="middle">KAIROSLEARN · BASE SEPOLIA</text>
</svg>
`;
}

for (const d of diplomas) {
  const path = join(OUT, `${d.id}.svg`);
  writeFileSync(path, render(d));
  console.log("wrote", path);
}

export interface GPAConversion {
  gpaLow: number;
  gpaHigh: number;
  confidence: "approximate";
}

export type GradingSystem = "percentage" | "cgpa10" | "a-levels" | "ib";

export function convertToUS4(
  system: GradingSystem,
  score: number
): GPAConversion {
  switch (system) {
    case "percentage":
      return convertPercentage(score);
    case "cgpa10":
      return convertCGPA10(score);
    case "a-levels":
      return convertALevels(score);
    case "ib":
      return convertIB(score);
  }
}

function convertPercentage(pct: number): GPAConversion {
  const clamped = Math.min(100, Math.max(0, pct));
  if (clamped >= 93) return { gpaLow: 3.8, gpaHigh: 4.0, confidence: "approximate" };
  if (clamped >= 85) return { gpaLow: 3.5, gpaHigh: 3.8, confidence: "approximate" };
  if (clamped >= 80) return { gpaLow: 3.3, gpaHigh: 3.5, confidence: "approximate" };
  if (clamped >= 75) return { gpaLow: 3.0, gpaHigh: 3.3, confidence: "approximate" };
  if (clamped >= 70) return { gpaLow: 2.7, gpaHigh: 3.0, confidence: "approximate" };
  if (clamped >= 65) return { gpaLow: 2.3, gpaHigh: 2.7, confidence: "approximate" };
  if (clamped >= 60) return { gpaLow: 2.0, gpaHigh: 2.3, confidence: "approximate" };
  return { gpaLow: Math.max(0, (clamped / 60) * 2.0), gpaHigh: 1.9, confidence: "approximate" };
}

function convertCGPA10(cgpa: number): GPAConversion {
  const clamped = Math.min(10, Math.max(0, cgpa));
  const center = Math.min(4.0, clamped / 2.5);
  return {
    gpaLow: Math.round(Math.max(0, center - 0.2) * 100) / 100,
    gpaHigh: Math.round(Math.min(4.0, center + 0.2) * 100) / 100,
    confidence: "approximate",
  };
}

function convertALevels(grade: number): GPAConversion {
  const map: Record<number, [number, number]> = {
    6: [3.9, 4.0],
    5: [3.7, 3.9],
    4: [3.1, 3.5],
    3: [2.5, 2.9],
    2: [1.8, 2.2],
    1: [1.0, 1.5],
  };
  const [low, high] = map[Math.min(6, Math.max(1, Math.round(grade)))] ?? [1.0, 1.5];
  return { gpaLow: low, gpaHigh: high, confidence: "approximate" };
}

function convertIB(score: number): GPAConversion {
  const map: Record<number, [number, number]> = {
    7: [3.9, 4.0],
    6: [3.5, 3.8],
    5: [3.1, 3.4],
    4: [2.5, 2.9],
    3: [1.8, 2.2],
    2: [1.0, 1.5],
    1: [0.5, 1.0],
  };
  const [low, high] = map[Math.min(7, Math.max(1, Math.round(score)))] ?? [0.5, 1.0];
  return { gpaLow: low, gpaHigh: high, confidence: "approximate" };
}

const COUNTRY_GRADING: Record<string, GradingSystem> = {
  PK: "percentage",
  IN: "percentage",
  BD: "percentage",
  NP: "percentage",
  LK: "percentage",
  GB: "a-levels",
  SG: "a-levels",
  HK: "a-levels",
  MY: "a-levels",
};

export function detectGradingSystem(countryCode: string): GradingSystem | null {
  return COUNTRY_GRADING[countryCode.toUpperCase()] ?? null;
}

export function formatConversion(conv: GPAConversion): string {
  if (conv.gpaLow === conv.gpaHigh) return conv.gpaHigh.toFixed(1);
  return `${conv.gpaLow.toFixed(1)}-${conv.gpaHigh.toFixed(1)}`;
}

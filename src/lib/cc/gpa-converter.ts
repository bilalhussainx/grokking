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

// Feature 1B — voice-friendly explanation strings keyed by language. Used by
// the "Speak my GPA conversion" button in the GPA display, piped through the
// existing TTS provider router. Plain spoken sentences only — no markdown.
type GPAExplanationContext = {
  rawScore: number;
  rawDisplay: string;       // e.g. "87% FSc" or "8.4 CGPA"
  conversion: GPAConversion;
  system: GradingSystem;
};

export function buildGPAExplanation(
  language: string,
  ctx: GPAExplanationContext,
): string {
  const gpaText = formatConversion(ctx.conversion);
  const systemName: Record<GradingSystem, string> = {
    percentage: "percentage system",
    cgpa10: "CGPA system",
    "a-levels": "A-Levels",
    ib: "IB",
  };

  switch (language) {
    case "ur":
      return `آپ کا ${ctx.rawDisplay} امریکی پیمانے پر تقریباً ${gpaText} GPA کے برابر ہے۔ یہ ایک اچھا اسکور ہے۔ امریکی یونیورسٹیاں جانتی ہیں کہ پاکستانی نظام تعلیم سخت ہوتا ہے، لیکن آپ کو Additional Information section میں اپنے گریڈنگ سسٹم کی وضاحت کرنی چاہیے تاکہ ایڈمیشن آفیسر اسے صحیح طور پر سمجھ سکے۔`;
    case "hi":
      return `आपका ${ctx.rawDisplay} अमेरिकी पैमाने पर लगभग ${gpaText} GPA के बराबर है। यह एक अच्छा स्कोर है। अमेरिकी यूनिवर्सिटी जानती हैं कि आपकी ग्रेडिंग प्रणाली अलग है, लेकिन आपको Additional Information section में इसे समझाना चाहिए ताकि एडमिशन ऑफिसर इसे सही ढंग से समझ सकें।`;
    case "pa":
      return `ਤੁਹਾਡਾ ${ctx.rawDisplay} ਅਮਰੀਕੀ ਪੈਮਾਨੇ ਉੱਤੇ ਲਗਭਗ ${gpaText} GPA ਦੇ ਬਰਾਬਰ ਹੈ। ਇਹ ਇੱਕ ਚੰਗਾ ਸਕੋਰ ਹੈ। ਅਮਰੀਕੀ ਯੂਨੀਵਰਸਿਟੀਆਂ ਜਾਣਦੀਆਂ ਹਨ ਕਿ ਗ੍ਰੇਡਿੰਗ ਸਿਸਟਮ ਵੱਖਰਾ ਹੈ, ਪਰ Additional Information section ਵਿੱਚ ਆਪਣੇ ਸਿਸਟਮ ਦੀ ਵਿਆਖਿਆ ਕਰੋ।`;
    case "es":
      return `Tu ${ctx.rawDisplay} equivale aproximadamente a un GPA de ${gpaText} en la escala estadounidense. Las universidades de Estados Unidos saben que tu sistema de calificación es diferente — explícalo brevemente en la sección Additional Information para que el oficial de admisiones lo entienda correctamente.`;
    case "fr":
      return `Ton ${ctx.rawDisplay} correspond environ à un GPA de ${gpaText} sur l'échelle américaine. Les universités américaines savent que ton système de notation est différent — explique-le brièvement dans la section Additional Information pour que l'agent d'admission le comprenne correctement.`;
    default:
      return `Your ${ctx.rawDisplay} converts to approximately a ${gpaText} GPA on the U.S. scale. U.S. universities understand that the ${systemName[ctx.system]} is more rigorous than American grading — but you should briefly explain your grading system in the Additional Information section so the admissions officer reads your transcript correctly.`;
  }
}

export interface PercentageBand {
  min: number;
  max: number;
  band: string;
  usCourseContext: string;
  howCollegesEvaluate: string;
}

export const PERCENTAGE_BANDS: PercentageBand[] = [
  {
    min: 90,
    max: 100,
    band: "Outstanding",
    usCourseContext: "A / A+ in US high school — typically honors/AP-level performance",
    howCollegesEvaluate:
      "In systems where 90–100% is Outstanding (Pakistan, India, Bangladesh, Nigeria), US admissions officers read this as top-of-class, comparable to a US 3.8–4.0 GPA. Competitive for highly selective colleges when paired with strong testing and rigor.",
  },
  {
    min: 80,
    max: 89,
    band: "Excellent",
    usCourseContext: "A- / B+ in US high school — strong honors-track performance",
    howCollegesEvaluate:
      "Scores in the 80–89% range are considered excellent in Pakistani, Indian, and similar systems and convert to roughly a 3.2–3.5 US GPA. US admissions officers recognize these systems grade harder than American schools, so 85%+ is viewed as very competitive.",
  },
  {
    min: 70,
    max: 79,
    band: "Very Good",
    usCourseContext: "B / B- in US high school — solid above-average work",
    howCollegesEvaluate:
      "A 70–79% is a Very Good result in the Pakistani/Indian system and maps to roughly a 2.8–3.2 US GPA. Admissions officers read it as above-average performance, competitive for mid-tier US universities.",
  },
  {
    min: 60,
    max: 69,
    band: "Good",
    usCourseContext: "C+ / C in US high school — average performance",
    howCollegesEvaluate:
      "A 60–69% is a Good result in the Pakistani/Indian system and maps to roughly a 2.4–2.8 US GPA. Admissions officers view this as average work — competitive for many public universities but below the bar for selective schools.",
  },
  {
    min: 50,
    max: 59,
    band: "Satisfactory",
    usCourseContext: "C- / D+ in US high school — below-average performance",
    howCollegesEvaluate:
      "A 50–59% is a passing but below-average result in the Pakistani/Indian system and maps to roughly a 2.0–2.4 US GPA. Admissions officers see this as meeting baseline requirements; target less-selective colleges with holistic review.",
  },
  {
    min: 0,
    max: 49,
    band: "Needs Improvement",
    usCourseContext: "Below passing in US high school",
    howCollegesEvaluate:
      "Scores below 50% are below passing in the Pakistani/Indian system and convert to below a 2.0 US GPA. Admissions at most US colleges require at least a 2.0; consider community college, pathway programs, or strong upward-trend evidence.",
  },
];

export interface PercentageGPAResult {
  gpaPrecise: number;
  band: string;
  usCourseContext: string;
  howCollegesEvaluate: string;
}

export function convertPercentageToGPA(pct: number): PercentageGPAResult {
  if (pct < 0 || pct > 100) {
    throw new Error(`Percentage must be between 0 and 100, got ${pct}`);
  }
  const gpaPrecise = Math.round((pct / 100) * 4.0 * 100) / 100;
  const band = PERCENTAGE_BANDS.find((b) => pct >= b.min && pct <= b.max) ?? PERCENTAGE_BANDS[PERCENTAGE_BANDS.length - 1];
  return {
    gpaPrecise,
    band: band.band,
    usCourseContext: band.usCourseContext,
    howCollegesEvaluate: band.howCollegesEvaluate,
  };
}

const COUNTRY_PERCENTAGE_LABEL: Record<string, string> = {
  PK: "Pakistani",
  IN: "Indian",
  BD: "Bangladeshi",
  NP: "Nepali",
  LK: "Sri Lankan",
  NG: "Nigerian",
};

const A_LEVEL_GRADE_LABEL: Record<number, string> = {
  6: "A*",
  5: "A",
  4: "B",
  3: "C",
  2: "D",
  1: "E",
};

export function formatRawGPADisplay(
  system: GradingSystem,
  value: number,
  countryCode?: string
): string {
  switch (system) {
    case "percentage": {
      const label = countryCode ? COUNTRY_PERCENTAGE_LABEL[countryCode.toUpperCase()] : undefined;
      return label ? `${value}% (${label})` : `${value}%`;
    }
    case "cgpa10":
      return `${value} / 10 CGPA`;
    case "a-levels": {
      const rounded = Math.min(6, Math.max(1, Math.round(value)));
      return `A-Level ${A_LEVEL_GRADE_LABEL[rounded]}`;
    }
    case "ib":
      return `IB ${value}`;
  }
}

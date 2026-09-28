// src/lib/cc/canada/application-platforms.ts
// Canadian schools apply through six different platforms (Audit Prompt 2
// market analysis). The coach surfaces this when the student adds a
// Canadian school so they know what to expect.

export type CanadianApplicationPlatform =
  | "OUAC"          // Ontario Universities' Application Centre (Group A/B)
  | "UBC_direct"    // you.ubc.ca with Personal Profile
  | "McGill_direct" // uApply
  | "Waterloo_AIF"  // OUAC + Admission Information Form (engineering/math/CS)
  | "ApplyAlberta"  // Alberta provincial portal
  | "SFU_direct";   // Simon Fraser direct portal

export interface PlatformInfo {
  name: string;
  url: string;
  oneLineExplainer: string;
  // Things the student must do beyond filling the basic application.
  notableSteps: string[];
}

export const PLATFORMS: Record<CanadianApplicationPlatform, PlatformInfo> = {
  OUAC: {
    name: "OUAC (Ontario Universities' Application Centre)",
    url: "https://www.ouac.on.ca/",
    oneLineExplainer:
      "Single Ontario portal with one Undergraduate application: you're Group A if you're a current Ontario high-school student (under 21, working toward an OSSD), Group B otherwise. $159 covers 3 program choices; each extra choice is $51.",
    notableSteps: [
      "Submit application via OUAC by the deadline",
      "Some Ontario schools require additional supplementary forms (UofT supplementary essays, Waterloo AIF, Queen's PSE, McMaster Health Sciences). Check each school's site.",
      "Order transcripts via OUAC's transcript request system",
    ],
  },
  UBC_direct: {
    name: "UBC direct application",
    url: "https://you.ubc.ca/applying-ubc/",
    oneLineExplainer:
      "Apply directly via you.ubc.ca. Personal Profile (5 short-answer questions, ~250 words each) is part of the application — write it carefully.",
    notableSteps: [
      "Complete the application + Personal Profile in one sitting (or save draft)",
      "Order transcripts via your high school",
      "International students: TOEFL/IELTS scores submitted directly",
    ],
  },
  McGill_direct: {
    name: "McGill uApply",
    url: "https://mcgill.ca/undergraduate-admissions/apply",
    oneLineExplainer:
      "Direct application via uApply. McGill admission is grades-driven and faculty-by-faculty. Minimal supplements; some programs (Music, Architecture) have portfolio requirements.",
    notableSteps: [
      "Submit uApply application",
      "Choose your faculty + program carefully — switching is hard later",
      "Submit transcripts directly (English translation if not in English/French)",
    ],
  },
  Waterloo_AIF: {
    name: "Waterloo AIF (on top of OUAC)",
    url: "https://uwaterloo.ca/future-students/admissions/aif",
    oneLineExplainer:
      "Engineering, math, and CS applicants MUST complete the Admission Information Form. The AIF is heavily weighted in admission decisions — sometimes more than grades.",
    notableSteps: [
      "Submit OUAC application first",
      "Complete the AIF (4 short essays) by the AIF deadline (~Feb 1)",
      "Engineering applicants: be specific about which discipline + why",
    ],
  },
  ApplyAlberta: {
    name: "ApplyAlberta",
    url: "https://www.applyalberta.ca",
    oneLineExplainer:
      "Provincial portal for Alberta universities (UofA, UCalgary, others). Single application, multiple choices.",
    notableSteps: [
      "Apply via ApplyAlberta",
      "Each school has its own document upload",
    ],
  },
  SFU_direct: {
    name: "SFU direct application",
    url: "https://www.sfu.ca/admission.html",
    oneLineExplainer:
      "Apply directly via SFU's portal. Rolling admission — earlier applications often get earlier offers.",
    notableSteps: [
      "Apply on SFU portal",
      "Submit transcripts directly",
    ],
  },
};

export function platformInfo(p: CanadianApplicationPlatform): PlatformInfo {
  return PLATFORMS[p];
}

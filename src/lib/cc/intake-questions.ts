export interface IntakeQuestion {
  index: number;
  id: string;
  text: string;
  voicePrompt: string;
  type: "text" | "select" | "yes-no-unsure" | "freeform";
  options?: string[];
  required: boolean;
  fieldMap: string[];
  /**
   * Optional predicate. When true, the question is skipped and the intake
   * loop advances to the next one. Receives the accumulated extracted_fields
   * keyed by question id.
   */
  skipIf?: (extracted: Record<string, string>) => boolean;
}

const CITIZENSHIP_OPTIONS = ["US Citizen", "Permanent Resident", "International", "DACA", "Undocumented", "Not sure"];

const isUsOrCa = (extracted: Record<string, string>) => {
  if (!extracted.location) return false;
  const { country } = parseLocation(extracted.location);
  return country === "US" || country === "CA";
};

const firstGenIsNo = (extracted: Record<string, string>) => {
  const raw = (extracted.first_gen || "").toLowerCase();
  return raw.includes("no") && !raw.includes("not sure");
};

const intlStatusNotYes = (extracted: Record<string, string>) => {
  const parsed = parseInternationalStatus(extracted.international_status || "");
  return parsed !== true;
};

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    index: 0,
    id: "name_grade",
    text: "What's your name, and what year are you in high school?",
    voicePrompt: "Hi! I'm Coach Kairos, your free AI college counselor. Let's get to know each other. What's your name, and what year are you in high school?",
    type: "text",
    required: true,
    fieldMap: ["preferred_name", "grade_level"],
  },
  {
    index: 1,
    id: "location",
    text: "Where do you live?",
    voicePrompt: "Great to meet you! Where do you live — what state or country?",
    type: "text",
    required: true,
    fieldMap: ["state_province", "country", "home_country_code"],
  },
  {
    index: 2,
    id: "home_language",
    text: "What language does your family speak at home?",
    voicePrompt: "What language does your family speak at home? Coach Kairos speaks many languages — I want to make sure I can help your family too.",
    type: "select",
    options: ["English", "Spanish", "Mandarin", "Hindi", "Vietnamese", "Arabic", "Tagalog", "Korean", "Punjabi", "Urdu", "Other"],
    required: true,
    fieldMap: ["home_language"],
  },
  {
    index: 3,
    id: "first_gen",
    text: "Will you be the first in your family to attend a US or Canadian college?",
    voicePrompt: "Will you be the first person in your family to attend a US or Canadian college? It's totally fine to say you're not sure.",
    type: "yes-no-unsure",
    options: ["Yes", "No", "Not sure"],
    required: true,
    fieldMap: ["is_first_gen"],
  },
  {
    index: 4,
    id: "parents_education",
    text: "What's the highest level of education either of your parents completed?",
    voicePrompt: "One more on that — what's the highest level of education either of your parents completed? No college, some college, an associate's degree, a bachelor's, or a graduate degree?",
    type: "select",
    options: ["No college", "Some college", "Associate's degree", "Bachelor's degree", "Graduate degree"],
    required: false,
    fieldMap: ["parents_education"],
    skipIf: firstGenIsNo,
  },
  {
    index: 5,
    id: "international_status",
    text: "Will you be applying as an international student?",
    voicePrompt: "Sounds like you're outside the US and Canada — so you'd likely be applying as an international student. Is that right?",
    type: "yes-no-unsure",
    options: ["Yes", "No", "Not sure"],
    required: true,
    fieldMap: ["is_international"],
    skipIf: isUsOrCa,
  },
  {
    index: 6,
    id: "citizenship_status",
    text: "What's your citizenship status?",
    voicePrompt: "Got it. Just so I can steer you toward the right financial aid advice — what's your citizenship status? US citizen, permanent resident, international, or something else?",
    type: "select",
    options: CITIZENSHIP_OPTIONS,
    required: false,
    fieldMap: ["citizenship_status"],
    skipIf: (extracted) => isUsOrCa(extracted) || intlStatusNotYes(extracted),
  },
  {
    index: 7,
    id: "worries",
    text: "What are you most worried about in the college process?",
    voicePrompt: "What are you most worried about when it comes to college? Picking schools, paying for it, the essays, or something else?",
    type: "freeform",
    options: ["Choosing the right schools", "Paying for college", "Writing essays", "Getting in", "My grades/scores", "I don't know where to start", "Other"],
    required: false,
    fieldMap: ["worries"],
  },
  {
    index: 8,
    id: "schools_interest",
    text: "What schools have you heard of or are curious about?",
    voicePrompt: "Last question! What schools have you heard of or are curious about? Don't worry if you don't have any yet — that's what I'm here for.",
    type: "freeform",
    required: false,
    fieldMap: ["interested_schools"],
  },
];

/**
 * Given the index of the question we just answered (or -1 for "start"), and the
 * extracted_fields map accumulated so far, return the next askable index — or
 * -1 if we've exhausted the list.
 */
export function nextAskableIndex(justAnsweredIndex: number, extracted: Record<string, string>): number {
  for (let i = justAnsweredIndex + 1; i < INTAKE_QUESTIONS.length; i++) {
    const q = INTAKE_QUESTIONS[i];
    if (!q.skipIf || !q.skipIf(extracted)) return i;
  }
  return -1;
}

export function parseNameGrade(answer: string): { name: string; grade: number | null } {
  const gradeMatch = answer.match(/\b(9|10|11|12|freshman|sophomore|junior|senior|9th|10th|11th|12th)\b/i);
  let grade: number | null = null;
  if (gradeMatch) {
    const g = gradeMatch[1].toLowerCase();
    const map: Record<string, number> = { freshman: 9, sophomore: 10, junior: 11, senior: 12, "9th": 9, "10th": 10, "11th": 11, "12th": 12 };
    grade = map[g] ?? parseInt(g, 10);
  }
  const name = answer
    .replace(/\b(9th|10th|11th|12th|freshman|sophomore|junior|senior|grade|i'm in|i am in|year)\b/gi, "")
    .replace(/[.,!?]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");
  return { name: name || "Student", grade };
}

export function parseLocation(answer: string): { state: string; country: string } {
  const usStates = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
  const abbrevs: Record<string, string> = { AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming" };
  const upper = answer.toUpperCase().trim();
  if (abbrevs[upper]) return { state: abbrevs[upper], country: "US" };
  for (const s of usStates) {
    if (answer.toLowerCase().includes(s.toLowerCase())) return { state: s, country: "US" };
  }
  if (answer.toLowerCase().includes("canada")) return { state: answer.trim(), country: "CA" };
  // Crude country detection for common non-US/CA origins.
  const lower = answer.toLowerCase();
  const countryMap: Record<string, string> = {
    pakistan: "PK", india: "IN", bangladesh: "BD", nigeria: "NG", "united kingdom": "GB", uk: "GB",
    china: "CN", "south korea": "KR", korea: "KR", japan: "JP", vietnam: "VN", philippines: "PH",
    mexico: "MX", brazil: "BR", germany: "DE", france: "FR", spain: "ES", italy: "IT",
    australia: "AU", "new zealand": "NZ", "saudi arabia": "SA", uae: "AE", egypt: "EG",
  };
  for (const [name, code] of Object.entries(countryMap)) {
    if (lower.includes(name)) return { state: answer.trim(), country: code };
  }
  return { state: answer.trim(), country: "US" };
}

export function parseFirstGen(answer: string): boolean | null {
  const lower = answer.toLowerCase();
  if (lower.includes("yes")) return true;
  if (lower.includes("no") && !lower.includes("not sure")) return false;
  return null;
}

export function parseInternationalStatus(answer: string): boolean | null {
  const lower = answer.toLowerCase();
  if (lower.includes("yes")) return true;
  if (lower.includes("no") && !lower.includes("not sure")) return false;
  return null;
}

export function parseParentsEducation(answer: string): string | null {
  const lower = answer.toLowerCase();
  if (lower.includes("graduate") || lower.includes("master") || lower.includes("phd") || lower.includes("doctor")) return "graduate";
  if (lower.includes("bachelor")) return "bachelors";
  if (lower.includes("associate")) return "associates";
  if (lower.includes("some college")) return "some_college";
  if (lower.includes("no college") || lower.includes("high school") || lower.includes("none")) return "no_college";
  return null;
}

export function languageToCode(lang: string): string {
  const map: Record<string, string> = {
    english: "en", spanish: "es", mandarin: "zh", hindi: "hi",
    vietnamese: "vi", arabic: "ar", tagalog: "tl", korean: "ko", punjabi: "pa", urdu: "ur",
  };
  return map[lang.toLowerCase()] || "en";
}

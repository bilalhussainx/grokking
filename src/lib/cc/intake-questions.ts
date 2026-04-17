export interface IntakeQuestion {
  index: number;
  id: string;
  text: string;
  voicePrompt: string;
  type: "text" | "select" | "yes-no-unsure" | "freeform";
  options?: string[];
  required: boolean;
  fieldMap: string[];
}

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
    fieldMap: ["state_province", "country"],
  },
  {
    index: 2,
    id: "home_language",
    text: "What language does your family speak at home?",
    voicePrompt: "What language does your family speak at home? Coach Kairos speaks many languages — I want to make sure I can help your family too.",
    type: "select",
    options: ["English", "Spanish", "Mandarin", "Hindi", "Vietnamese", "Arabic", "Tagalog", "Korean", "Punjabi", "Other"],
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
    id: "worries",
    text: "What are you most worried about in the college process?",
    voicePrompt: "What are you most worried about when it comes to college? Picking schools, paying for it, the essays, or something else?",
    type: "freeform",
    options: ["Choosing the right schools", "Paying for college", "Writing essays", "Getting in", "My grades/scores", "I don't know where to start", "Other"],
    required: false,
    fieldMap: ["worries"],
  },
  {
    index: 5,
    id: "schools_interest",
    text: "What schools have you heard of or are curious about?",
    voicePrompt: "Last question! What schools have you heard of or are curious about? Don't worry if you don't have any yet — that's what I'm here for.",
    type: "freeform",
    required: false,
    fieldMap: ["interested_schools"],
  },
];

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
  return { state: answer.trim(), country: answer.toLowerCase().includes("canada") ? "CA" : "US" };
}

export function parseFirstGen(answer: string): boolean | null {
  const lower = answer.toLowerCase();
  if (lower.includes("yes")) return true;
  if (lower.includes("no") && !lower.includes("not sure")) return false;
  return null;
}

export function languageToCode(lang: string): string {
  const map: Record<string, string> = {
    english: "en", spanish: "es", mandarin: "zh", hindi: "hi",
    vietnamese: "vi", arabic: "ar", tagalog: "tl", korean: "ko", punjabi: "pa",
  };
  return map[lang.toLowerCase()] || "en";
}

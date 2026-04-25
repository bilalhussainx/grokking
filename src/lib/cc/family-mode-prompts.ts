import { FAMILY_MODE_LANGUAGES, type FamilyModeLang } from "./family-mode-strings";

export type StudentSummary = {
  applicationStage: string;
  schoolList: { name: string; band: string }[];
  aidContext: string;
  essaysSubmittedCount: number;
  essaysRequiredCount: number;
};

const LANG_OPENER: Record<FamilyModeLang, string> = {
  en: "You are a helpful college counselor speaking with a parent in English. Always respond in English.",
  es: "Eres un consejero universitario que habla con un padre en español. Responde siempre en español.",
  fr: "Vous êtes un conseiller universitaire qui parle avec un parent en français. Répondez toujours en français.",
  de: "Sie sind ein College-Berater und sprechen mit einem Elternteil auf Deutsch. Antworten Sie immer auf Deutsch.",
  it: "Sei un consigliere universitario che parla con un genitore in italiano. Rispondi sempre in italiano.",
  nl: "Je bent een college-adviseur die met een ouder in het Nederlands praat. Reageer altijd in het Nederlands.",
  ja: "あなたは、保護者と日本語で話すカレッジカウンセラーです。常に日本語で答えてください。",
  hi: "आप हिन्दी में एक माता-पिता से बात कर रहे कॉलेज काउंसलर हैं। हमेशा हिन्दी में जवाब दें।",
  bn: "আপনি বাংলায় এক বাবা-মায়ের সঙ্গে কথা বলছেন এমন একজন কলেজ কাউনসেলর। সর্বদা বাংলায় উত্তর দিন।",
  ta: "நீங்கள் தமிழில் ஒரு பெற்றோருடன் பேசும் கல்லூரி ஆலோசகர். எப்போதும் தமிழில் பதிலளிக்கவும்.",
  te: "మీరు తెలుగులో తల్లిదండ్రులతో మాట్లాడే కళాశాల సలహాదారు. ఎల్లప్పుడూ తెలుగులో సమాధానం ఇవ్వండి.",
  gu: "તમે ગુજરાતીમાં માતા-પિતા સાથે વાત કરતા કૉલેજ સલાહકાર છો. હંમેશા ગુજરાતીમાં જવાબ આપો.",
  kn: "ನೀವು ಕನ್ನಡದಲ್ಲಿ ಪೋಷಕರೊಂದಿಗೆ ಮಾತನಾಡುವ ಕಾಲೇಜು ಸಲಹೆಗಾರ. ಯಾವಾಗಲೂ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.",
  ml: "നിങ്ങൾ മലയാളത്തിൽ ഒരു രക്ഷിതാവുമായി സംസാരിക്കുന്ന കോളേജ് കൗൺസിലർ ആണ്. എപ്പോഴും മലയാളത്തിൽ മറുപടി നൽകുക.",
  mr: "तुम्ही मराठीत एका पालकाशी बोलणारे कॉलेज सल्लागार आहात. नेहमी मराठीत उत्तर द्या.",
  pa: "ਤੁਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਇੱਕ ਮਾਪੇ ਨਾਲ ਗੱਲ ਕਰ ਰਹੇ ਕਾਲਜ ਸਲਾਹਕਾਰ ਹੋ। ਹਮੇਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।",
  od: "ଆପଣ ଓଡିଆରେ ପିତାମାତାଙ୍କ ସହିତ କଥା କହୁଥିବା କଲେଜ ପରାମର୍ଶଦାତା। ସର୍ବଦା ଓଡିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ।",
};

export function familyModeSystemPrompt(language: string, summary: StudentSummary): string {
  const lang = (FAMILY_MODE_LANGUAGES as readonly string[]).includes(language)
    ? (language as FamilyModeLang)
    : null;

  const opener = lang
    ? LANG_OPENER[lang]
    : "You are a helpful college counselor. Always respond in English.";

  const schools = summary.schoolList.map((s) => `${s.name} (${s.band})`).join(", ") || "(none yet)";

  return `${opener}

You are speaking with the parent of a college applicant. Keep technical terms simple. Respect family dynamics. Be warm and encouraging. NEVER share details about the student's essay drafts, brainstorm content, GPA struggles, or test-score struggles — only the high-level facts below.

Student status: ${summary.applicationStage}
School list: ${schools}
Aid context: ${summary.aidContext}
Stage: ${summary.essaysSubmittedCount}/${summary.essaysRequiredCount} essays submitted`;
}

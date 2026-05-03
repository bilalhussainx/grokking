"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COACH_LANGUAGES, type CoachLanguage } from "@/lib/cc/coach-languages";
import { Mic, FileText, Loader2 } from "lucide-react";

const GREETINGS: Record<string, string> = {
  en: "I'm here to listen to your story",
  es: "Estoy aquí para escuchar tu historia",
  fr: "Je suis là pour écouter ton histoire",
  de: "Ich bin hier, um deine Geschichte zu hören",
  it: "Sono qui per ascoltare la tua storia",
  nl: "Ik ben hier om je verhaal te horen",
  ja: "あなたの物語を聞きたい",
  hi: "मैं तुम्हारी कहानी सुनने के लिए यहाँ हूँ",
  bn: "আমি তোমার গল্প শুনতে এসেছি",
  ta: "உங்கள் கதையை கேட்க இங்கே இருக்கிறேன்",
  te: "మీ కథ వినడానికి ఇక్కడ ఉన్నాను",
  gu: "હું તમારી વાર્તા સાંભળવા આવ્યો છું",
  kn: "ನಿಮ್ಮ ಕಥೆ ಕೇಳಲು ಇಲ್ಲಿದ್ದೇನೆ",
  ml: "നിങ്ങളുടെ കഥ കേൾക്കാൻ ഞാൻ ഇവിടെയുണ്ട്",
  mr: "मी तुझी गोष्ट ऐकायला येथे आहे",
  pa: "ਤੁਹਾਡੀ ਕਹਾਣੀ ਸੁਣਨ ਲਈ ਇੱਥੇ ਹਾਂ",
  od: "ମୁଁ ତୁମ କଥା ଶୁଣିବାକୁ ଏଠାରେ ଅଛି",
  ur: "میں تمہاری کہانی سننے کے لیے یہاں ہوں",
  zh: "我在这里聆听你的故事",
  ko: "당신의 이야기를 듣고 있어요",
  ar: "أنا هنا لأصغي إلى قصتك",
  vi: "Tôi ở đây để lắng nghe câu chuyện của bạn",
  pt: "Estou aqui para ouvir sua história",
  ru: "Я здесь, чтобы выслушать твою историю",
  tr: "Hikayeni dinlemek için buradayım",
};

export default function LanguageGrid({ initialLanguage }: { initialLanguage: string }) {
  const router = useRouter();
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (lang: CoachLanguage) => {
    setPendingCode(lang.code);
    setError(null);
    try {
      const res = await fetch("/api/cc/profile/voice", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang.code, markPickerSeen: true }),
      });
      if (!res.ok) throw new Error("save failed");
      try {
        localStorage.setItem("coach_kairos_language", lang.code);
        localStorage.setItem("coach-language", lang.code);
      } catch {
        /* ignore */
      }
      router.push("/?coach=open&focus=intake");
    } catch {
      setError("Couldn't save. Tap again to retry.");
      setPendingCode(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05080d] text-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-center">
        Welcome to KairosLearn
      </h1>
      <p className="text-white/60 text-sm md:text-base mb-10 text-center max-w-xl">
        What language would you like Coach Kairos to speak with you? You can change this anytime.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-5xl">
        {COACH_LANGUAGES.map((lang) => {
          const isSelected = lang.code === initialLanguage;
          const isPending = pendingCode === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              disabled={pendingCode !== null}
              onClick={() => handlePick(lang)}
              dir={lang.isRTL ? "rtl" : "ltr"}
              lang={lang.code}
              aria-pressed={isSelected}
              className={`
                relative aspect-[4/3] rounded-2xl border p-4 flex flex-col items-center justify-between text-center transition
                ${isSelected ? "border-[#D4AF37] bg-[#D4AF37]/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"}
                ${pendingCode !== null && !isPending ? "opacity-30" : ""}
              `}
            >
              <span className="text-2xl md:text-3xl font-medium">{lang.nativeName}</span>
              <span className="text-[11px] text-white/55 line-clamp-2">{GREETINGS[lang.code]}</span>
              <span
                className={`text-[10px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  lang.mode === "voice" ? "text-[#D4AF37] bg-[#D4AF37]/10" : "text-white/40 bg-white/5"
                }`}
              >
                {lang.mode === "voice" ? <Mic className="w-2.5 h-2.5" /> : <FileText className="w-2.5 h-2.5" />}
                {lang.mode === "voice" ? "Voice" : "Text only"}
              </span>
              {isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
                  <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="text-rose-400 text-sm mt-6">{error}</p>}
      <p className="text-[11px] text-white/35 mt-10 text-center max-w-md">
        The platform interface stays in English. Coach Kairos will speak with you in your chosen language — voice supported across all 25 languages.
      </p>
    </div>
  );
}

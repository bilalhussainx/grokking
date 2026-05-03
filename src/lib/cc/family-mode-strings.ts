export const FAMILY_MODE_LANGUAGES = [
  "en", "es", "fr", "de", "it", "nl", "ja",
  "hi", "bn", "ta", "te", "gu", "kn", "ml", "mr", "pa", "od",
  "ur", "zh", "ko", "ar", "vi", "pt", "ru", "tr",
] as const;
export type FamilyModeLang = typeof FAMILY_MODE_LANGUAGES[number];

// Languages where the parent types instead of speaking. Empty now that
// Urdu is wired through Deepgram nova-3 STT + Google Cloud TTS
// (see voice-provider-router GOOGLE_TTS_LANGUAGES branch). Kept as an
// extension point so future text-only languages can opt out.
export const NO_VOICE_FAMILY_MODE_LANGUAGES = new Set<string>([]);

export type FamilyModeStrings = {
  tapToSpeak: string;
  listening: string;
  handBack: string;
  thinking: string;
  paused: string;
  goodbye: string;
  // Used only by the text-mode UI for languages in NO_VOICE_FAMILY_MODE_LANGUAGES.
  typeHere?: string;
  send?: string;
};

export const FAMILY_MODE_STRINGS: Record<FamilyModeLang, FamilyModeStrings> = {
  en: { tapToSpeak: "Tap to speak", listening: "Listening…", handBack: "Hand back to student", thinking: "Coach Kairos is thinking…", paused: "Tap mic to continue", goodbye: "Family Mode ended" },
  es: { tapToSpeak: "Toca para hablar", listening: "Escuchando…", handBack: "Devolver al estudiante", thinking: "Coach Kairos está pensando…", paused: "Toca el micrófono para continuar", goodbye: "Modo familiar finalizado" },
  fr: { tapToSpeak: "Touchez pour parler", listening: "Écoute…", handBack: "Rendre à l'étudiant", thinking: "Coach Kairos réfléchit…", paused: "Touchez le micro pour continuer", goodbye: "Mode famille terminé" },
  de: { tapToSpeak: "Zum Sprechen tippen", listening: "Höre zu…", handBack: "Zurück an Schüler", thinking: "Coach Kairos denkt nach…", paused: "Mikrofon antippen zum Fortfahren", goodbye: "Familienmodus beendet" },
  it: { tapToSpeak: "Tocca per parlare", listening: "Sto ascoltando…", handBack: "Restituisci allo studente", thinking: "Coach Kairos sta pensando…", paused: "Tocca il microfono per continuare", goodbye: "Modalità famiglia terminata" },
  nl: { tapToSpeak: "Tik om te spreken", listening: "Ik luister…", handBack: "Terug naar student", thinking: "Coach Kairos denkt na…", paused: "Tik op microfoon om door te gaan", goodbye: "Familiemodus beëindigd" },
  ja: { tapToSpeak: "タップして話す", listening: "聞いています…", handBack: "生徒に戻す", thinking: "コーチが考えています…", paused: "マイクをタップして続けて", goodbye: "ファミリーモード終了" },
  hi: { tapToSpeak: "बोलने के लिए टैप करें", listening: "सुन रहा हूँ…", handBack: "छात्र को वापस दें", thinking: "Coach Kairos सोच रहा है…", paused: "जारी रखने के लिए माइक टैप करें", goodbye: "फैमिली मोड समाप्त" },
  bn: { tapToSpeak: "কথা বলতে ট্যাপ করুন", listening: "শুনছি…", handBack: "ছাত্রকে ফিরিয়ে দিন", thinking: "Coach Kairos ভাবছে…", paused: "চালিয়ে যেতে মাইক ট্যাপ করুন", goodbye: "ফ্যামিলি মোড শেষ" },
  ta: { tapToSpeak: "பேச தட்டவும்", listening: "கேட்கிறேன்…", handBack: "மாணவருக்கு திரும்பவும்", thinking: "Coach Kairos யோசிக்கிறார்…", paused: "தொடர மைக்கை தட்டவும்", goodbye: "குடும்ப முறை முடிந்தது" },
  te: { tapToSpeak: "మాట్లాడటానికి టాప్ చేయండి", listening: "వింటున్నాను…", handBack: "విద్యార్థికి తిరిగి ఇవ్వండి", thinking: "Coach Kairos ఆలోచిస్తున్నారు…", paused: "కొనసాగించడానికి మైక్ తాకండి", goodbye: "కుటుంబ మోడ్ ముగిసింది" },
  gu: { tapToSpeak: "બોલવા માટે ટેપ કરો", listening: "સાંભળું છું…", handBack: "વિદ્યાર્થીને પાછું આપો", thinking: "Coach Kairos વિચારી રહ્યા છે…", paused: "ચાલુ રાખવા માઇક ટેપ કરો", goodbye: "ફેમિલી મોડ સમાપ્ત" },
  kn: { tapToSpeak: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ", listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ…", handBack: "ವಿದ್ಯಾರ್ಥಿಗೆ ಹಿಂತಿರುಗಿಸಿ", thinking: "Coach Kairos ಯೋಚಿಸುತ್ತಿದ್ದಾರೆ…", paused: "ಮುಂದುವರಿಸಲು ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ", goodbye: "ಕುಟುಂಬ ಮೋಡ್ ಮುಗಿದಿದೆ" },
  ml: { tapToSpeak: "സംസാരിക്കാൻ ടാപ് ചെയ്യുക", listening: "കേൾക്കുന്നു…", handBack: "വിദ്യാർത്ഥിക്ക് തിരികെ നൽകുക", thinking: "Coach Kairos ചിന്തിക്കുന്നു…", paused: "തുടരാൻ മൈക് ടാപ് ചെയ്യുക", goodbye: "കുടുംബ മോഡ് അവസാനിച്ചു" },
  mr: { tapToSpeak: "बोलण्यासाठी टॅप करा", listening: "ऐकत आहे…", handBack: "विद्यार्थ्याला परत द्या", thinking: "Coach Kairos विचार करत आहे…", paused: "सुरू ठेवण्यासाठी माइक टॅप करा", goodbye: "फॅमिली मोड समाप्त" },
  pa: { tapToSpeak: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ", listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ…", handBack: "ਵਿਦਿਆਰਥੀ ਨੂੰ ਵਾਪਸ ਦਿਓ", thinking: "Coach Kairos ਸੋਚ ਰਿਹਾ ਹੈ…", paused: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਮਾਇਕ ਟੈਪ ਕਰੋ", goodbye: "ਫੈਮਿਲੀ ਮੋਡ ਖਤਮ" },
  od: { tapToSpeak: "କଥା କହିବାକୁ ଟାପ୍ କରନ୍ତୁ", listening: "ଶୁଣୁଛି…", handBack: "ଛାତ୍ରଙ୍କୁ ଫେରାଇଦିଅନ୍ତୁ", thinking: "Coach Kairos ଚିନ୍ତା କରୁଛି…", paused: "ଜାରି ରଖିବାକୁ ମାଇକ୍ ଟାପ୍ କରନ୍ତୁ", goodbye: "ପରିବାର ମୋଡ୍ ସମାପ୍ତ" },
  ur: { tapToSpeak: "ٹیپ کر کے بولیں", listening: "سن رہا ہوں…", handBack: "طالبعلم کو واپس دیں", thinking: "Coach Kairos سوچ رہا ہے…", paused: "جاری رکھنے کے لیے مائیک پر ٹیپ کریں", goodbye: "فیملی موڈ ختم", typeHere: "یہاں لکھیں…", send: "بھیجیں" },
  zh: { tapToSpeak: "点击说话", listening: "正在听…", handBack: "交还给学生", thinking: "Coach Kairos 正在思考…", paused: "点击麦克风继续", goodbye: "家庭模式已结束" },
  ko: { tapToSpeak: "탭하여 말하기", listening: "듣는 중…", handBack: "학생에게 돌려주기", thinking: "Coach Kairos가 생각 중…", paused: "계속하려면 마이크를 누르세요", goodbye: "가족 모드 종료" },
  ar: { tapToSpeak: "اضغط للتحدث", listening: "أستمع…", handBack: "العودة إلى الطالب", thinking: "المدرب كايروس يفكر…", paused: "اضغط على المايك للمتابعة", goodbye: "انتهى وضع العائلة" },
  vi: { tapToSpeak: "Chạm để nói", listening: "Đang nghe…", handBack: "Trả lại học sinh", thinking: "Coach Kairos đang suy nghĩ…", paused: "Chạm mic để tiếp tục", goodbye: "Đã kết thúc Chế độ gia đình" },
  pt: { tapToSpeak: "Toque para falar", listening: "Ouvindo…", handBack: "Devolver ao estudante", thinking: "Coach Kairos está pensando…", paused: "Toque o microfone para continuar", goodbye: "Modo família encerrado" },
  ru: { tapToSpeak: "Нажмите, чтобы говорить", listening: "Слушаю…", handBack: "Вернуть студенту", thinking: "Coach Kairos думает…", paused: "Нажмите микрофон, чтобы продолжить", goodbye: "Семейный режим завершён" },
  tr: { tapToSpeak: "Konuşmak için dokunun", listening: "Dinliyorum…", handBack: "Öğrenciye geri ver", thinking: "Coach Kairos düşünüyor…", paused: "Devam için mikrofona dokunun", goodbye: "Aile Modu sona erdi" },
};

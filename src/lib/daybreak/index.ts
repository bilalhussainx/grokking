import { COACH_LANGUAGES } from "@/lib/cc/coach-languages";

export type QuickCheckLanguage = "en" | "es" | "hi" | "pa" | "ur";

export type QuickCheckCopy = {
  headline: string;
  intro: string;
  check: string;
  labels: readonly [string, string, string];
  choose: string;
  stages: readonly [string, string, string, string, string, string];
  destinations: readonly [string, string, string];
  concerns: readonly [string, string, string];
  submit: string;
  privacy: string;
  jump: string;
  based: string;
  result: string;
  open: string;
  reset: string;
  hint: readonly [string, string, string];
  actions: {
    early: string;
    junior: string;
    applying: string;
    submitted: string;
    decisions: string;
    transfer: string;
    cost: string;
    essay: string;
    essayLate: string;
    essayTransfer: string;
  };
  questions: readonly [string, string, string];
};

export const QUICK_CHECK_COPY = {
en:{headline:'Your next good step.',intro:'Three answers. One thing you can do next.',check:'Let’s start where you are.',labels:['Your stage','Where you might study','What is on your mind?'],choose:'Choose one',stages:['Grade 9–10','Grade 11','Grade 12: applying','Grade 12: submitted','Grade 12: decisions','Transfer'],destinations:['US','Canada','Still exploring'],concerns:['My school list','What it could cost','My essay'],submit:'Find my next step',privacy:'No signup. Your answers stay on this page.',jump:'Thinking about cost first?',based:'Based on your answers',result:'One thing to do next',open:'A question to answer',reset:'Start again',hint:['Keep application and financial-aid instructions as separate things to check.','Look at the specific program as well as the university’s admissions page.','Choose one study destination to research before comparing its requirements.'],actions:{early:'Write one thing you want from college and one practical constraint. Use them to compare two schools or programs.',junior:'Choose two schools or programs. For each, record one reason it fits and one question you still need to answer.',applying:'Choose one school or program. Record its official requirements, the source link and the date you checked it.',submitted:'Open one application portal. Check what the school has received and any follow-up it requests.',decisions:'Put the costs and conditions of your offers side by side. Ask the schools about anything that is unclear.',transfer:'Collect your course descriptions and the target program’s transfer requirements. Ask the receiving school what credits it can assess.',cost:'Collect the annual cost, confirmed grants and what your family could contribute. Leave unknown amounts unknown.',essay:'In your own notes, name a decision you made, what you did and what changed afterward. You will write the essay.',essayLate:'Check whether the school has requested more writing before starting another essay.',essayTransfer:'List your academic reasons for moving and the questions you need to ask a target program.'},questions:['What would make a school work for you?','Which annual cost or funding amount still needs checking?','What does this moment help you understand about yourself?']},
es:{headline:'Tu próximo buen paso.',intro:'Tres respuestas. Una cosa que puedes hacer ahora.',check:'Empecemos por donde estás.',labels:['Tu etapa','Dónde te gustaría estudiar','¿Qué te preocupa hoy?'],choose:'Elige una opción',stages:['Grados 9–10','Grado 11','Grado 12: solicitando','Grado 12: solicitudes enviadas','Grado 12: decisiones','Transferencia'],destinations:['Estados Unidos','Canadá','Aún estoy explorando'],concerns:['Mi lista de universidades','Cuánto podría costar','Mi ensayo'],submit:'Ver mi próximo paso',privacy:'Sin registro. Tus respuestas se quedan en esta página.',jump:'¿Primero quieres hablar del costo?',based:'Según tus respuestas',result:'Una cosa que puedes hacer ahora',open:'Una pregunta pendiente',reset:'Empezar de nuevo',hint:['Revisa por separado los requisitos de admisión y de ayuda económica.','Consulta el programa específico y la página de admisiones de la universidad.','Elige un destino de estudio para investigar antes de comparar requisitos.'],actions:{early:'Anota algo que buscas en la universidad y una limitación práctica. Úsalos para comparar dos universidades o programas.',junior:'Elige dos universidades o programas. Anota por qué te interesa cada uno y una pregunta que aún tengas.',applying:'Elige una universidad o programa. Anota sus requisitos oficiales, el enlace y la fecha de consulta.',submitted:'Abre un portal de solicitud. Revisa qué documentos recibió la universidad y qué más te pide.',decisions:'Compara los costos y condiciones de tus ofertas. Pregunta a las universidades lo que no esté claro.',transfer:'Reúne las descripciones de tus cursos y los requisitos de transferencia. Pregunta a la universidad receptora qué créditos puede evaluar.',cost:'Reúne el costo anual, las becas confirmadas y lo que podría aportar tu familia. No inventes los importes que faltan.',essay:'En tus propias notas, describe una decisión, lo que hiciste y lo que cambió después. Tú escribirás el ensayo.',essayLate:'Comprueba si la universidad ha pedido más escritos antes de empezar otro ensayo.',essayTransfer:'Anota tus razones académicas para cambiar de universidad y tus preguntas sobre el programa de destino.'},questions:['¿Qué necesitas de una universidad?','¿Qué costo anual o ayuda falta confirmar?','¿Qué te ayuda a comprender este momento sobre ti?']},
hi:{headline:'आपका अगला अच्छा कदम।',intro:'तीन जवाब। फिर एक अगला कदम।',check:'आप जहाँ हैं, वहीं से शुरू करें।',labels:['आप किस पड़ाव पर हैं?','कहाँ पढ़ना चाहते हैं?','आज किसमें मदद चाहिए?'],choose:'एक विकल्प चुनें',stages:['कक्षा 9–10','कक्षा 11','कक्षा 12: आवेदन कर रहे हैं','कक्षा 12: आवेदन भेज चुके हैं','कक्षा 12: निर्णय का समय','कॉलेज बदलना चाहते हैं'],destinations:['अमेरिका','कनाडा','अभी विकल्प देख रहे हैं'],concerns:['कॉलेज की सूची','पढ़ाई का खर्च','मेरा निबंध'],submit:'मेरा अगला कदम देखें',privacy:'साइन अप नहीं। जवाब इसी पेज पर रहते हैं।',jump:'पहले खर्च के बारे में सोच रहे हैं?',based:'आपके जवाबों के आधार पर',result:'अब आप यह कर सकते हैं',open:'एक सवाल अभी बाकी है',reset:'फिर से शुरू करें',hint:['प्रवेश और आर्थिक सहायता की जानकारी अलग-अलग जाँचें।','विश्वविद्यालय के साथ अपने चुने हुए कार्यक्रम की शर्तें भी देखें।','शर्तों की तुलना से पहले पढ़ाई के लिए एक देश की जानकारी लें।'],actions:{early:'कॉलेज से अपनी एक उम्मीद और एक व्यावहारिक सीमा लिखें। इनके आधार पर दो कॉलेज या कार्यक्रम देखें।',junior:'दो कॉलेज या कार्यक्रम चुनें। हर एक के लिए अपनी रुचि का एक कारण और एक बाकी सवाल लिखें।',applying:'एक कॉलेज या कार्यक्रम की आधिकारिक शर्तें, स्रोत का लिंक और जाँच की तारीख लिखें।',submitted:'एक आवेदन पोर्टल खोलें। देखें कि कौन से दस्तावेज़ मिले हैं और क्या और माँगा गया है।',decisions:'मिले हुए प्रस्तावों के खर्च और शर्तों की तुलना करें। जो स्पष्ट नहीं है, कॉलेज से पूछें।',transfer:'अपने पाठ्यक्रमों का विवरण और नए कार्यक्रम की स्थानांतरण शर्तें जुटाएँ। कौन से क्रेडिट स्वीकार हो सकते हैं, कॉलेज से पूछें।',cost:'सालाना खर्च, पक्की छात्रवृत्तियाँ और परिवार के संभावित योगदान की जानकारी जुटाएँ। अज्ञात रकम का अनुमान न लगाएँ।',essay:'अपने शब्दों में एक निर्णय, अपना काम और उसके बाद आए बदलाव के नोट्स बनाएँ। निबंध आप लिखेंगे।',essayLate:'नया निबंध शुरू करने से पहले देखें कि कॉलेज ने और लेखन माँगा है या नहीं।',essayTransfer:'कॉलेज बदलने के शैक्षणिक कारण और नए कार्यक्रम से जुड़े सवाल लिखें।'},questions:['कौन सी बात कॉलेज को आपके लिए सही बनाएगी?','खर्च या सहायता की कौन सी रकम अभी जाँचनी है?','इस अनुभव से आप अपने बारे में क्या समझते हैं?']},
pa:{headline:'ਤੁਹਾਡਾ ਅਗਲਾ ਚੰਗਾ ਕਦਮ।',intro:'ਤਿੰਨ ਜਵਾਬ। ਫਿਰ ਇੱਕ ਅਗਲਾ ਕਦਮ।',check:'ਜਿੱਥੇ ਤੁਸੀਂ ਹੋ, ਉੱਥੋਂ ਸ਼ੁਰੂ ਕਰੀਏ।',labels:['ਤੁਸੀਂ ਕਿਸ ਪੜਾਅ ’ਤੇ ਹੋ?','ਕਿੱਥੇ ਪੜ੍ਹਨਾ ਚਾਹੁੰਦੇ ਹੋ?','ਅੱਜ ਕਿਸ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?'],choose:'ਇੱਕ ਚੋਣ ਕਰੋ',stages:['ਜਮਾਤ 9–10','ਜਮਾਤ 11','ਜਮਾਤ 12: ਅਰਜ਼ੀਆਂ ਦੇ ਰਹੇ ਹੋ','ਜਮਾਤ 12: ਅਰਜ਼ੀਆਂ ਭੇਜ ਦਿੱਤੀਆਂ','ਜਮਾਤ 12: ਫ਼ੈਸਲੇ ਦਾ ਸਮਾਂ','ਕਾਲਜ ਬਦਲਣਾ ਚਾਹੁੰਦੇ ਹੋ'],destinations:['ਅਮਰੀਕਾ','ਕੈਨੇਡਾ','ਹਾਲੇ ਚੋਣਾਂ ਵੇਖ ਰਹੇ ਹੋ'],concerns:['ਕਾਲਜਾਂ ਦੀ ਸੂਚੀ','ਪੜ੍ਹਾਈ ਦਾ ਖਰਚਾ','ਮੇਰਾ ਲੇਖ'],submit:'ਮੇਰਾ ਅਗਲਾ ਕਦਮ ਵੇਖੋ',privacy:'ਸਾਈਨ ਅੱਪ ਨਹੀਂ। ਜਵਾਬ ਇਸੇ ਪੰਨੇ ’ਤੇ ਰਹਿੰਦੇ ਹਨ।',jump:'ਪਹਿਲਾਂ ਖਰਚੇ ਬਾਰੇ ਸੋਚ ਰਹੇ ਹੋ?',based:'ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਦੇ ਆਧਾਰ ’ਤੇ',result:'ਹੁਣ ਤੁਸੀਂ ਇਹ ਕਰ ਸਕਦੇ ਹੋ',open:'ਇੱਕ ਸਵਾਲ ਹਾਲੇ ਬਾਕੀ ਹੈ',reset:'ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰੋ',hint:['ਦਾਖ਼ਲੇ ਅਤੇ ਵਿੱਤੀ ਮਦਦ ਦੀਆਂ ਹਦਾਇਤਾਂ ਵੱਖ-ਵੱਖ ਵੇਖੋ।','ਯੂਨੀਵਰਸਿਟੀ ਦੇ ਨਾਲ ਚੁਣੇ ਪ੍ਰੋਗਰਾਮ ਦੀਆਂ ਸ਼ਰਤਾਂ ਵੀ ਵੇਖੋ।','ਸ਼ਰਤਾਂ ਦੀ ਤੁਲਨਾ ਤੋਂ ਪਹਿਲਾਂ ਪੜ੍ਹਾਈ ਲਈ ਇੱਕ ਦੇਸ਼ ਬਾਰੇ ਜਾਣੋ।'],actions:{early:'ਕਾਲਜ ਤੋਂ ਆਪਣੀ ਇੱਕ ਉਮੀਦ ਅਤੇ ਇੱਕ ਅਮਲੀ ਸੀਮਾ ਲਿਖੋ। ਇਨ੍ਹਾਂ ਨਾਲ ਦੋ ਕਾਲਜਾਂ ਜਾਂ ਪ੍ਰੋਗਰਾਮਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।',junior:'ਦੋ ਕਾਲਜ ਜਾਂ ਪ੍ਰੋਗਰਾਮ ਚੁਣੋ। ਹਰ ਇੱਕ ਲਈ ਦਿਲਚਸਪੀ ਦਾ ਇੱਕ ਕਾਰਨ ਅਤੇ ਇੱਕ ਬਾਕੀ ਸਵਾਲ ਲਿਖੋ।',applying:'ਇੱਕ ਕਾਲਜ ਜਾਂ ਪ੍ਰੋਗਰਾਮ ਦੀਆਂ ਅਧਿਕਾਰਤ ਸ਼ਰਤਾਂ, ਸਰੋਤ ਦਾ ਲਿੰਕ ਅਤੇ ਵੇਖਣ ਦੀ ਤਾਰੀਖ਼ ਲਿਖੋ।',submitted:'ਇੱਕ ਅਰਜ਼ੀ ਪੋਰਟਲ ਖੋਲ੍ਹੋ। ਵੇਖੋ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਮਿਲ ਗਏ ਹਨ ਅਤੇ ਹੋਰ ਕੀ ਮੰਗਿਆ ਹੈ।',decisions:'ਮਿਲੀਆਂ ਪੇਸ਼ਕਸ਼ਾਂ ਦੇ ਖਰਚੇ ਅਤੇ ਸ਼ਰਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ। ਜੋ ਸਪਸ਼ਟ ਨਹੀਂ, ਕਾਲਜ ਤੋਂ ਪੁੱਛੋ।',transfer:'ਆਪਣੇ ਕੋਰਸਾਂ ਦੇ ਵੇਰਵੇ ਅਤੇ ਨਵੇਂ ਪ੍ਰੋਗਰਾਮ ਦੀਆਂ ਤਬਾਦਲੇ ਦੀਆਂ ਸ਼ਰਤਾਂ ਇਕੱਠੀਆਂ ਕਰੋ। ਕਿਹੜੇ ਕ੍ਰੈਡਿਟ ਮੰਨੇ ਜਾ ਸਕਦੇ ਹਨ, ਕਾਲਜ ਤੋਂ ਪੁੱਛੋ।',cost:'ਸਾਲਾਨਾ ਖਰਚਾ, ਪੱਕੀਆਂ ਸਕਾਲਰਸ਼ਿਪਾਂ ਅਤੇ ਪਰਿਵਾਰ ਦੇ ਸੰਭਾਵੀ ਯੋਗਦਾਨ ਦੀ ਜਾਣਕਾਰੀ ਲਵੋ। ਅਣਜਾਣ ਰਕਮ ਦਾ ਅੰਦਾਜ਼ਾ ਨਾ ਲਾਓ।',essay:'ਆਪਣੇ ਸ਼ਬਦਾਂ ਵਿੱਚ ਇੱਕ ਫ਼ੈਸਲੇ, ਆਪਣੇ ਕੰਮ ਅਤੇ ਬਾਅਦ ਦੇ ਬਦਲਾਅ ਦੇ ਨੋਟ ਬਣਾਓ। ਲੇਖ ਤੁਸੀਂ ਲਿਖੋਗੇ।',essayLate:'ਨਵਾਂ ਲੇਖ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਵੇਖੋ ਕਿ ਕਾਲਜ ਨੇ ਹੋਰ ਲਿਖਤ ਮੰਗੀ ਹੈ ਜਾਂ ਨਹੀਂ।',essayTransfer:'ਕਾਲਜ ਬਦਲਣ ਦੇ ਪੜ੍ਹਾਈ ਨਾਲ ਜੁੜੇ ਕਾਰਨ ਅਤੇ ਨਵੇਂ ਪ੍ਰੋਗਰਾਮ ਬਾਰੇ ਸਵਾਲ ਲਿਖੋ।'},questions:['ਕਿਹੜੀ ਗੱਲ ਕਾਲਜ ਨੂੰ ਤੁਹਾਡੇ ਲਈ ਢੁੱਕਵਾਂ ਬਣਾਏਗੀ?','ਖਰਚੇ ਜਾਂ ਮਦਦ ਦੀ ਕਿਹੜੀ ਰਕਮ ਹਾਲੇ ਪੁੱਛਣੀ ਹੈ?','ਇਸ ਤਜਰਬੇ ਤੋਂ ਤੁਸੀਂ ਆਪਣੇ ਬਾਰੇ ਕੀ ਸਮਝਦੇ ਹੋ?']},
ur:{headline:'آپ کا اگلا اچھا قدم۔',intro:'تین جواب۔ پھر ایک اگلا قدم۔',check:'آپ جہاں ہیں، وہیں سے شروع کریں۔',labels:['آپ کس مرحلے پر ہیں؟','کہاں پڑھنا چاہتے ہیں؟','آج کس چیز میں مدد چاہیے؟'],choose:'ایک انتخاب کریں',stages:['جماعت ۹–۱۰','جماعت ۱۱','جماعت ۱۲: درخواست دے رہے ہیں','جماعت ۱۲: درخواست بھیج دی ہے','جماعت ۱۲: فیصلے کا وقت','کالج تبدیل کرنا چاہتے ہیں'],destinations:['امریکہ','کینیڈا','ابھی امکانات دیکھ رہے ہیں'],concerns:['کالجوں کی فہرست','پڑھائی کا خرچ','میرا مضمون'],submit:'میرا اگلا قدم دیکھیں',privacy:'سائن اپ نہیں۔ جواب اسی صفحے پر رہتے ہیں۔',jump:'پہلے خرچ کے بارے میں سوچ رہے ہیں؟',based:'آپ کے جوابوں کی بنیاد پر',result:'اب آپ یہ کر سکتے ہیں',open:'ایک سوال ابھی باقی ہے',reset:'دوبارہ شروع کریں',hint:['داخلے اور مالی مدد کی ہدایات الگ الگ دیکھیں۔','یونیورسٹی کے ساتھ منتخب پروگرام کی شرائط بھی دیکھیں۔','شرائط کا موازنہ کرنے سے پہلے پڑھائی کے لیے ایک ملک کے بارے میں معلومات لیں۔'],actions:{early:'کالج سے اپنی ایک توقع اور ایک عملی حد لکھیں۔ ان کی بنیاد پر دو کالجوں یا پروگراموں کا موازنہ کریں۔',junior:'دو کالج یا پروگرام چنیں۔ ہر ایک میں دلچسپی کی ایک وجہ اور ایک باقی سوال لکھیں۔',applying:'ایک کالج یا پروگرام کی سرکاری شرائط، ماخذ کا لنک اور دیکھنے کی تاریخ لکھیں۔',submitted:'ایک درخواست کا پورٹل کھولیں۔ دیکھیں کون سے کاغذات مل گئے ہیں اور مزید کیا مانگا گیا ہے۔',decisions:'ملنے والی پیشکشوں کے اخراجات اور شرائط کا موازنہ کریں۔ جو واضح نہیں، کالج سے پوچھیں۔',transfer:'اپنے کورسوں کی تفصیل اور نئے پروگرام کی منتقلی کی شرائط جمع کریں۔ کون سے کریڈٹ قبول ہو سکتے ہیں، نئے کالج سے پوچھیں۔',cost:'سالانہ خرچ، تصدیق شدہ وظائف اور خاندان کے ممکنہ حصے کی معلومات جمع کریں۔ نامعلوم رقم کا اندازہ نہ لگائیں۔',essay:'اپنے الفاظ میں ایک فیصلے، اپنے عمل اور بعد میں آنے والی تبدیلی کے نوٹس بنائیں۔ مضمون آپ لکھیں گے۔',essayLate:'نیا مضمون شروع کرنے سے پہلے دیکھیں کہ کالج نے مزید تحریر مانگی ہے یا نہیں۔',essayTransfer:'کالج بدلنے کی تعلیمی وجوہات اور نئے پروگرام سے متعلق سوالات لکھیں۔'},questions:['کون سی بات کالج کو آپ کے لیے موزوں بنائے گی؟','خرچ یا مدد کی کون سی رقم ابھی معلوم کرنی ہے؟','اس تجربے سے آپ اپنے بارے میں کیا سمجھتے ہیں؟']}
} as const satisfies Record<QuickCheckLanguage, QuickCheckCopy>;
export type QuickCheckLanguageOption = {
  code: QuickCheckLanguage;
  nativeName: string;
};

export const QUICK_CHECK_LANGUAGES: QuickCheckLanguageOption[] = COACH_LANGUAGES
  .filter((language) => Object.hasOwn(QUICK_CHECK_COPY, language.code))
  .map(({ code, nativeName }) => ({
    code: code as QuickCheckLanguage,
    nativeName,
  }));

const quickCheckLanguageCodes = new Set<string>(
  QUICK_CHECK_LANGUAGES.map(({ code }) => code),
);

export function typeQuickCheckLanguage(language: string): QuickCheckLanguage {
  return quickCheckLanguageCodes.has(language)
    ? (language as QuickCheckLanguage)
    : "en";
}

export type Stage =
  | "early"
  | "junior"
  | "applying"
  | "submitted"
  | "decisions"
  | "transfer";
export type Destination = "us" | "ca" | "exploring";
export type Concern = "schools" | "cost" | "essay";

export type NextStep = {
  action: string;
  hint: string;
  question: string;
};

const stageAction: Record<Stage, keyof QuickCheckCopy["actions"]> = {
  early: "early",
  junior: "junior",
  applying: "applying",
  submitted: "submitted",
  decisions: "decisions",
  transfer: "transfer",
};

const destinationHint: Record<Destination, number> = {
  us: 0,
  ca: 1,
  exploring: 2,
};
const concernQuestion: Record<Concern, number> = {
  schools: 0,
  cost: 1,
  essay: 2,
};

export function getNextStep(
  stage: Stage,
  destination: Destination,
  concern: Concern,
  language: QuickCheckLanguage,
): NextStep {
  const copy = QUICK_CHECK_COPY[language];
  let action: keyof QuickCheckCopy["actions"];

  if (concern === "schools") {
    action = stageAction[stage];
  } else if (concern === "cost") {
    action = "cost";
  } else if (stage === "submitted" || stage === "decisions") {
    action = "essayLate";
  } else if (stage === "transfer") {
    action = "essayTransfer";
  } else {
    action = "essay";
  }

  return {
    action: copy.actions[action],
    hint: copy.hint[destinationHint[destination]],
    question: copy.questions[concernQuestion[concern]],
  };
}

export type CostField = "annualCost" | "grants" | "familyContribution";
export type CostCalculation =
  | {
      ok: true;
      gapCents: number;
      annualCostCents: number;
      grantsCents: number;
      familyContributionCents: number;
      overcovered: boolean;
    }
  | {
      ok: false;
      field: CostField;
      error: string;
    };

const MAX_AMOUNT_CENTS = 1_000_000_000;
const amountLabels: Record<CostField, string> = {
  annualCost: "annual cost",
  grants: "confirmed grants",
  familyContribution: "family contribution",
};

function parseAmountCents(value: string): number | null {
  const trimmed = value.trim();
  const match = trimmed.includes(",")
    ? /^(\d{1,3}(?:,\d{3})+)(?:\.(\d{0,2}))?$/.exec(trimmed)
    : /^(\d*)(?:\.(\d{0,2}))?$/.exec(trimmed);
  if (!match || !/\d/.test(trimmed)) return null;

  const whole = Number(match[1].replaceAll(",", ""));
  const fraction = Number((match[2] ?? "").padEnd(2, "0"));
  const cents = whole * 100 + fraction;
  return Number.isSafeInteger(cents) && cents <= MAX_AMOUNT_CENTS
    ? cents
    : null;
}

function invalidAmount(field: CostField): CostCalculation {
  return {
    ok: false,
    field,
    error: `Enter ${amountLabels[field]} as a nonnegative amount up to 10,000,000, with optional comma groups of three digits and at most two decimal places.`,
  };
}

export function calculateGap(amounts: {
  annualCost: string;
  grants: string;
  familyContribution: string;
}): CostCalculation {
  const fields: CostField[] = ["annualCost", "grants", "familyContribution"];
  const cents: Partial<Record<CostField, number>> = {};

  for (const field of fields) {
    const parsed = parseAmountCents(amounts[field]);
    if (parsed === null) return invalidAmount(field);
    cents[field] = parsed;
  }

  const annualCostCents = cents.annualCost!;
  const grantsCents = cents.grants!;
  const familyContributionCents = cents.familyContribution!;
  if (grantsCents > annualCostCents) {
    return {
      ok: false,
      field: "grants",
      error: "Confirmed grants cannot exceed the total annual cost in this check. Check both amounts before calculating.",
    };
  }

  const rawGap = annualCostCents - grantsCents - familyContributionCents;
  return {
    ok: true,
    gapCents: Math.max(0, rawGap),
    annualCostCents,
    grantsCents,
    familyContributionCents,
    overcovered: rawGap < 0,
  };
}

export type PlanningAnswer = "yes" | "no" | "unsure" | "";

const planningQuestions = [
  "Which school or program would you like to research first?",
  "Where can you check that school’s current official requirements?",
  "Which annual cost or confirmed funding amount do you still need to find?",
  "What is one small task you can take on next?",
] as const;

export function firstPlanningQuestion(
  values: readonly PlanningAnswer[],
): string {
  const firstMissing = planningQuestions.findIndex((_, index) => values[index] !== "yes");
  return firstMissing < 0
    ? "You have named the main pieces. Choose one next task, and check your sources and dates as you go. This is not an admissions assessment."
    : planningQuestions[firstMissing];
}

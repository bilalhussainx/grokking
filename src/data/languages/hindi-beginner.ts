// Hindi Beginner Course Data
// CEFR A1 Level - Devanagari Script, Basic Communication

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "hindi-beginner",
  slug: "hindi-beginner",
  title: "Hindi Beginner - A1",
  language: "hi",
  languageName: "Hindi",
  proficiencyLevel: "A1" as const,
  description: "Learn Hindi from scratch — master the Devanagari script, essential greetings, pronouns with the unique three-tier honorific system, and build towards everyday conversations. Perfect for complete beginners.",
  targetAudience: "Complete beginners with no prior Hindi experience",
  estimatedHours: 80,
  icon: "🇮🇳",
  nextCourseSlug: "hindi-intermediate",
};

// ============================================
// Module 1: Devanagari Script
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "hi-beginner-l1",
    slug: "vowels",
    title: "Vowels (स्वर)",
    content: `# Vowels — स्वर (Svar)

Welcome to Hindi! Let's begin with the Devanagari vowels. Hindi has 11 primary vowels, each with an independent form and a dependent (matra) form used with consonants.

## Short Vowels
- **अ** (a) — as in "about"
- **इ** (i) — as in "it"
- **उ** (u) — as in "put"

## Long Vowels
- **आ** (aa) — as in "father"
- **ई** (ee) — as in "see"
- **ऊ** (oo) — as in "food"

## Diphthongs & Others
- **ए** (e) — as in "may"
- **ऐ** (ai) — as in "air"
- **ओ** (o) — as in "go"
- **औ** (au) — as in "cow"
- **ऋ** (ri) — as in "ri" (used in Sanskrit loanwords)

## Matra (Dependent) Forms
When vowels attach to consonants, they change form:
- क + आ = का (kaa)
- क + इ = कि (ki)
- क + ई = की (kee)
- क + उ = कु (ku)
- क + ऊ = कू (koo)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m1",
    moduleTitle: "Devanagari Script",
    order: 1,
    topicId: "hi-beginner-vowels",
    vocabulary: [
      {
        word: "अ",
        translation: "a (schwa sound)",
        pronunciation: "uh",
        exampleSentence: "अब पढ़ो।",
        exampleTranslation: "Now read.",
        partOfSpeech: "vowel",
      },
      {
        word: "आ",
        translation: "aa (long a)",
        pronunciation: "aah",
        exampleSentence: "आम खाओ।",
        exampleTranslation: "Eat a mango.",
        partOfSpeech: "vowel",
      },
      {
        word: "इ",
        translation: "i (short i)",
        pronunciation: "ih",
        exampleSentence: "इधर आओ।",
        exampleTranslation: "Come here.",
        partOfSpeech: "vowel",
      },
      {
        word: "ई",
        translation: "ee (long i)",
        pronunciation: "ee",
        exampleSentence: "ईख मीठी है।",
        exampleTranslation: "Sugarcane is sweet.",
        partOfSpeech: "vowel",
      },
      {
        word: "उ",
        translation: "u (short u)",
        pronunciation: "uh",
        exampleSentence: "उल्लू रात में जागता है।",
        exampleTranslation: "The owl is awake at night.",
        partOfSpeech: "vowel",
      },
      {
        word: "ओ",
        translation: "o (long o)",
        pronunciation: "oh",
        exampleSentence: "ओस गिर रही है।",
        exampleTranslation: "Dew is falling.",
        partOfSpeech: "vowel",
      },
    ],
    grammarPoints: [
      {
        title: "The Inherent 'a' Sound",
        explanation: "Every Hindi consonant has a built-in short 'a' (schwa) sound. The letter क is not just 'k' — it is 'ka'. To remove the vowel, a halant (्) is used: क् = 'k'.",
        examples: [
          { correct: "क = ka", translation: "k + inherent a" },
          { correct: "क् = k", translation: "k with halant (no vowel)" },
          { correct: "का = kaa", translation: "k + long aa matra" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vowel-practice",
        title: "Reading Vowels Aloud",
        situation: "Your Hindi teacher asks you to read the vowel chart",
        agentRole: "You are a patient Hindi teacher named Sharmaji. Ask the student to pronounce each vowel and give gentle corrections.",
        userGoal: "Pronounce all 11 Hindi vowels correctly",
        targetPhrases: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ"],
        successCriteria: ["Attempts all vowels", "Distinguishes short vs long vowels", "Responds to corrections"],
      },
    ],
    culturalNotes: [
      {
        title: "Devanagari — The Script of the Gods",
        content: "Devanagari (देवनागरी) literally means 'script of the divine city.' It is used for Hindi, Sanskrit, Marathi, and Nepali. The script runs left to right with a distinctive horizontal line (shirorekha) connecting the tops of letters.",
      },
    ],
  },
  {
    id: "hi-beginner-l2",
    slug: "consonants",
    title: "Consonants (व्यंजन)",
    content: `# Consonants — व्यंजन (Vyanjan)

Hindi has 33 primary consonants organized by where and how the sound is produced.

## Velar (कंठ्य) — produced at the throat
- **क** (ka) — **ख** (kha) — **ग** (ga) — **घ** (gha) — **ङ** (nga)

## Palatal (तालव्य) — produced at the palate
- **च** (cha) — **छ** (chha) — **ज** (ja) — **झ** (jha) — **ञ** (nya)

## Retroflex (मूर्धन्य) — tongue curls back
- **ट** (Ta) — **ठ** (Tha) — **ड** (Da) — **ढ** (Dha) — **ण** (Na)

## Dental (दंत्य) — tongue touches teeth
- **त** (ta) — **थ** (tha) — **द** (da) — **ध** (dha) — **न** (na)

## Labial (ओष्ठ्य) — produced at the lips
- **प** (pa) — **फ** (pha) — **ब** (ba) — **भ** (bha) — **म** (ma)

## Semi-vowels & Sibilants
- **य** (ya) — **र** (ra) — **ल** (la) — **व** (va)
- **श** (sha) — **ष** (Sha) — **स** (sa) — **ह** (ha)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m1",
    moduleTitle: "Devanagari Script",
    order: 2,
    topicId: "hi-beginner-consonants",
    vocabulary: [
      {
        word: "कमल",
        translation: "lotus",
        pronunciation: "ka-mal",
        exampleSentence: "कमल सुंदर है।",
        exampleTranslation: "The lotus is beautiful.",
        partOfSpeech: "noun",
      },
      {
        word: "घर",
        translation: "house",
        pronunciation: "ghar",
        exampleSentence: "मेरा घर बड़ा है।",
        exampleTranslation: "My house is big.",
        partOfSpeech: "noun",
      },
      {
        word: "पानी",
        translation: "water",
        pronunciation: "PAA-nee",
        exampleSentence: "पानी दो।",
        exampleTranslation: "Give me water.",
        partOfSpeech: "noun",
      },
      {
        word: "नमक",
        translation: "salt",
        pronunciation: "na-mak",
        exampleSentence: "नमक कम है।",
        exampleTranslation: "There is less salt.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Aspirated vs. Unaspirated Consonants",
        explanation: "Hindi distinguishes between aspirated (with a puff of air) and unaspirated consonants. This is a critical distinction — क (ka) and ख (kha) are different letters with different meanings.",
        examples: [
          { correct: "कल = kal", translation: "yesterday/tomorrow (unaspirated k)" },
          { correct: "खल = khal", translation: "villain (aspirated kh)" },
          { correct: "दल = dal", translation: "lentils (dental d)" },
          { correct: "ढल = dhal", translation: "to slope (retroflex aspirated Dh)" },
        ],
        commonMistakes: [
          {
            incorrect: "Pronouncing क and ख the same way",
            correction: "क = ka (no air puff), ख = kha (with air puff)",
            explanation: "Hold your hand in front of your mouth — you should feel a puff of air for ख but not for क.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "consonant-groups",
        title: "Consonant Group Practice",
        situation: "Practicing consonant rows with your tutor",
        agentRole: "You are a Hindi tutor. Ask the student to read each consonant row (ka-group, cha-group, etc.) and correct their aspiration.",
        userGoal: "Read consonant groups with correct aspiration",
        targetPhrases: ["क ख ग घ", "च छ ज झ", "ट ठ ड ढ", "त थ द ध", "प फ ब भ"],
        successCriteria: ["Reads at least 3 rows", "Distinguishes aspirated sounds", "Attempts retroflex sounds"],
      },
    ],
  },
  {
    id: "hi-beginner-l3",
    slug: "conjuncts-numbers",
    title: "Conjuncts & Numbers १-१०",
    content: `# Conjuncts & Numbers

## Conjunct Consonants (संयुक्त अक्षर)
When two consonants combine without a vowel between them, they form a conjunct:
- **क् + ष = क्ष** (ksha) — as in क्षमा (forgiveness)
- **त् + र = त्र** (tra) — as in मित्र (friend)
- **ज् + ञ = ज्ञ** (gya) — as in ज्ञान (knowledge)
- **श् + र = श्र** (shra) — as in श्री (Mr./auspicious)

## Hindi Numbers १-१०
1. **१ — एक** (ek)
2. **२ — दो** (do)
3. **३ — तीन** (teen)
4. **४ — चार** (chaar)
5. **५ — पाँच** (paanch)
6. **६ — छह** (chhah)
7. **७ — सात** (saat)
8. **८ — आठ** (aaTh)
9. **९ — नौ** (nau)
10. **१० — दस** (das)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m1",
    moduleTitle: "Devanagari Script",
    order: 3,
    topicId: "hi-beginner-conjuncts-numbers",
    vocabulary: [
      { word: "एक", translation: "one", pronunciation: "ek", exampleSentence: "एक किताब दो।", exampleTranslation: "Give one book.", partOfSpeech: "number" },
      { word: "दो", translation: "two", pronunciation: "do", exampleSentence: "दो चाय लाओ।", exampleTranslation: "Bring two teas.", partOfSpeech: "number" },
      { word: "पाँच", translation: "five", pronunciation: "paanch", exampleSentence: "पाँच मिनट रुको।", exampleTranslation: "Wait five minutes.", partOfSpeech: "number" },
      { word: "दस", translation: "ten", pronunciation: "das", exampleSentence: "दस रुपये दो।", exampleTranslation: "Give ten rupees.", partOfSpeech: "number" },
      { word: "मित्र", translation: "friend", pronunciation: "mi-tra", exampleSentence: "वह मेरा मित्र है।", exampleTranslation: "He is my friend.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "How Conjuncts Form",
        explanation: "When a consonant loses its inherent vowel (via halant ्) and joins the next consonant, a conjunct is formed. Some conjuncts have special shapes, others simply stack vertically.",
        examples: [
          { correct: "क् + त = क्त", translation: "k + ta = kta (as in भक्त, devotee)" },
          { correct: "स् + त = स्त", translation: "s + ta = sta (as in मस्त, carefree)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "counting-hindi",
        title: "Counting Practice",
        situation: "A shopkeeper asks you to count items",
        agentRole: "You are a friendly shopkeeper named Ramesh. Ask the student to count items as you place them on the counter.",
        userGoal: "Count from 1 to 10 in Hindi",
        targetPhrases: ["एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ", "दस"],
        successCriteria: ["Counts to at least 5", "Correct pronunciation of nasal पाँच", "Reaches 10"],
      },
    ],
    culturalNotes: [
      {
        title: "Numbers in Daily Life",
        content: "While Devanagari numerals (१, २, ३...) are the traditional form, Western Arabic numerals (1, 2, 3...) are widely used in modern India. You will see both on currency, signs, and documents. Train stations often use Devanagari numerals on Hindi boards.",
      },
    ],
  },
];

// ============================================
// Module 2: Greetings & Basics
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "hi-beginner-l4",
    slug: "greetings",
    title: "Greetings (अभिवादन)",
    content: `# Greetings — अभिवादन (Abhivaadan)

Hindi greetings reflect respect and formality. The most universal greeting is नमस्ते.

## Essential Greetings
- **नमस्ते** — Hello / Goodbye (universal, respectful)
- **नमस्कार** — Hello (more formal than नमस्ते)
- **सलाम** — Hello (common in Urdu-influenced Hindi)
- **प्रणाम** — Respectful greeting (to elders, touching feet)

## Time-Based Greetings
- **सुप्रभात** — Good morning
- **शुभ संध्या** — Good evening
- **शुभ रात्रि** — Good night

## Farewells
- **अलविदा** — Goodbye
- **फिर मिलेंगे** — We'll meet again
- **चलता हूँ / चलती हूँ** — I'm leaving (male / female)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m2",
    moduleTitle: "Greetings & Basics",
    order: 4,
    topicId: "hi-beginner-greetings",
    vocabulary: [
      {
        word: "नमस्ते",
        translation: "hello / goodbye",
        pronunciation: "na-mas-TAY",
        exampleSentence: "नमस्ते, आप कैसे हैं?",
        exampleTranslation: "Hello, how are you?",
        partOfSpeech: "interjection",
      },
      {
        word: "नमस्कार",
        translation: "hello (formal)",
        pronunciation: "na-mas-KAAR",
        exampleSentence: "नमस्कार, मैं राहुल हूँ।",
        exampleTranslation: "Hello, I am Rahul.",
        partOfSpeech: "interjection",
      },
      {
        word: "अलविदा",
        translation: "goodbye",
        pronunciation: "al-vi-DAA",
        exampleSentence: "अलविदा, फिर मिलेंगे!",
        exampleTranslation: "Goodbye, we'll meet again!",
        partOfSpeech: "interjection",
      },
      {
        word: "सुप्रभात",
        translation: "good morning",
        pronunciation: "su-pra-BHAAT",
        exampleSentence: "सुप्रभात! नाश्ता तैयार है।",
        exampleTranslation: "Good morning! Breakfast is ready.",
        partOfSpeech: "interjection",
      },
      {
        word: "प्रणाम",
        translation: "respectful greeting",
        pronunciation: "pra-NAAM",
        exampleSentence: "दादी जी को प्रणाम।",
        exampleTranslation: "Respectful greetings to grandmother.",
        partOfSpeech: "interjection",
      },
    ],
    grammarPoints: [
      {
        title: "नमस्ते — More Than a Word",
        explanation: "नमस्ते comes from Sanskrit: नमः (namah, 'bow') + ते (te, 'to you'). It literally means 'I bow to you.' It works as both hello and goodbye, and is appropriate in virtually all situations.",
        examples: [
          { correct: "नमस्ते!", translation: "Hello! / Goodbye!" },
          { correct: "नमस्ते, कैसे हो?", translation: "Hello, how are you? (informal)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "morning-greeting",
        title: "Morning at the Office",
        situation: "You arrive at your office in Delhi and greet colleagues",
        agentRole: "You are Priya, a friendly coworker in Delhi. Greet the student warmly and ask how they are.",
        userGoal: "Greet Priya and respond to how-are-you questions",
        targetPhrases: ["नमस्ते", "सुप्रभात", "मैं ठीक हूँ"],
        successCriteria: ["Uses a greeting", "Responds to how-are-you", "Maintains polite tone"],
      },
    ],
    culturalNotes: [
      {
        title: "The Namaste Gesture",
        content: "नमस्ते is accompanied by pressing your palms together at chest level and a slight bow. When greeting elders, many Indians touch the elder's feet (पैर छूना) as a sign of deep respect. The elder typically responds with a blessing like 'जीते रहो' (may you live long).",
      },
    ],
  },
  {
    id: "hi-beginner-l5",
    slug: "introductions",
    title: "Introductions (परिचय)",
    content: `# Introductions — परिचय (Parichay)

Learn to introduce yourself and ask about others.

## Key Phrases
- **मेरा नाम... है** — My name is...
- **आपका नाम क्या है?** — What is your name? (formal)
- **तुम्हारा नाम क्या है?** — What is your name? (informal)
- **मैं... से हूँ** — I am from...
- **आप कहाँ से हैं?** — Where are you from? (formal)

## Responses
- **मिलकर खुशी हुई** — Nice to meet you
- **मैं ठीक हूँ** — I'm fine
- **आप कैसे हैं?** — How are you? (to a man, formal)
- **आप कैसी हैं?** — How are you? (to a woman, formal)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m2",
    moduleTitle: "Greetings & Basics",
    order: 5,
    topicId: "hi-beginner-introductions",
    vocabulary: [
      {
        word: "नाम",
        translation: "name",
        pronunciation: "naam",
        exampleSentence: "मेरा नाम अनिल है।",
        exampleTranslation: "My name is Anil.",
        partOfSpeech: "noun",
      },
      {
        word: "मिलकर खुशी हुई",
        translation: "nice to meet you",
        pronunciation: "mil-kar KHU-shee HU-ee",
        exampleSentence: "नमस्ते, मिलकर खुशी हुई।",
        exampleTranslation: "Hello, nice to meet you.",
        partOfSpeech: "phrase",
      },
      {
        word: "कहाँ",
        translation: "where",
        pronunciation: "ka-HAAN",
        exampleSentence: "आप कहाँ से हैं?",
        exampleTranslation: "Where are you from?",
        partOfSpeech: "adverb",
      },
      {
        word: "ठीक",
        translation: "fine / okay",
        pronunciation: "theek",
        exampleSentence: "मैं ठीक हूँ, धन्यवाद।",
        exampleTranslation: "I'm fine, thank you.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "The 'है' (hai) Verb — 'is/am/are'",
        explanation: "है (hai) is the most common verb in Hindi. It means 'is' and is used with singular subjects. हैं (hain) is used for plurals and formal 'you' (आप).",
        examples: [
          { correct: "मेरा नाम राज है।", translation: "My name is Raj." },
          { correct: "वह अच्छा है।", translation: "He is good." },
          { correct: "आप कैसे हैं?", translation: "How are you? (formal — uses हैं)" },
        ],
        commonMistakes: [
          {
            incorrect: "आप कैसे है?",
            correction: "आप कैसे हैं?",
            explanation: "With आप (formal you), always use हैं (plural form) to show respect.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "train-introduction",
        title: "Meeting on a Train",
        situation: "You are on a train from Delhi to Jaipur and your co-passenger starts chatting",
        agentRole: "You are Vikram, a friendly traveler on the Rajdhani Express. Introduce yourself and ask the student about themselves.",
        userGoal: "Introduce yourself with name and origin, and ask about Vikram",
        targetPhrases: ["मेरा नाम...है", "मैं...से हूँ", "आपका नाम क्या है?"],
        successCriteria: ["States their name", "Mentions where they are from", "Asks a question back"],
      },
    ],
  },
  {
    id: "hi-beginner-l6",
    slug: "polite-expressions",
    title: "Polite Expressions & Questions",
    content: `# Polite Expressions & Question Words

## Courtesy Phrases
- **धन्यवाद** — Thank you
- **शुक्रिया** — Thank you (Urdu-origin, equally common)
- **कृपया** — Please
- **माफ़ कीजिए** — Excuse me / I'm sorry (formal)
- **कोई बात नहीं** — No problem / It's okay
- **अच्छा** — Good / Okay / I see (very versatile!)

## Question Words
- **क्या** — What (also turns a statement into a yes/no question)
- **कौन** — Who
- **कहाँ** — Where
- **कब** — When
- **क्यों** — Why
- **कैसे / कैसा / कैसी** — How / What kind of
- **कितना / कितनी** — How much / How many`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m2",
    moduleTitle: "Greetings & Basics",
    order: 6,
    topicId: "hi-beginner-polite-questions",
    vocabulary: [
      {
        word: "धन्यवाद",
        translation: "thank you",
        pronunciation: "dhan-ya-VAAD",
        exampleSentence: "बहुत धन्यवाद!",
        exampleTranslation: "Thank you very much!",
        partOfSpeech: "interjection",
      },
      {
        word: "कृपया",
        translation: "please",
        pronunciation: "kri-PA-yaa",
        exampleSentence: "कृपया बैठिए।",
        exampleTranslation: "Please sit down.",
        partOfSpeech: "adverb",
      },
      {
        word: "माफ़ कीजिए",
        translation: "excuse me / sorry (formal)",
        pronunciation: "MAAF kee-ji-yay",
        exampleSentence: "माफ़ कीजिए, समय क्या हुआ है?",
        exampleTranslation: "Excuse me, what time is it?",
        partOfSpeech: "phrase",
      },
      {
        word: "क्या",
        translation: "what",
        pronunciation: "kyaa",
        exampleSentence: "क्या आप हिंदी बोलते हैं?",
        exampleTranslation: "Do you speak Hindi?",
        partOfSpeech: "pronoun",
      },
      {
        word: "क्यों",
        translation: "why",
        pronunciation: "kyon",
        exampleSentence: "क्यों नहीं?",
        exampleTranslation: "Why not?",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "क्या as a Question Marker",
        explanation: "Placing क्या at the start of a sentence turns any statement into a yes/no question. It is not translated — it simply signals a question.",
        examples: [
          { correct: "आप हिंदी बोलते हैं।", translation: "You speak Hindi. (statement)" },
          { correct: "क्या आप हिंदी बोलते हैं?", translation: "Do you speak Hindi? (question)" },
        ],
      },
      {
        title: "धन्यवाद vs शुक्रिया",
        explanation: "Both mean 'thank you.' धन्यवाद is Sanskrit-origin (more formal/literary), शुक्रिया is Urdu-origin (casual, very common in everyday speech). Both are perfectly acceptable.",
        examples: [
          { correct: "धन्यवाद, गुरुजी।", translation: "Thank you, teacher. (formal)" },
          { correct: "शुक्रिया, भाई!", translation: "Thanks, brother! (casual)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "asking-directions-politely",
        title: "Asking a Stranger Politely",
        situation: "You are lost near India Gate in Delhi and need to ask for help",
        agentRole: "You are a passerby in Delhi. The student approaches you politely for directions.",
        userGoal: "Use polite phrases to ask where the metro station is",
        targetPhrases: ["माफ़ कीजिए", "कृपया", "कहाँ", "धन्यवाद"],
        successCriteria: ["Opens with excuse me", "Asks a clear question", "Thanks the person"],
      },
    ],
  },
];

// ============================================
// Module 3: Pronouns & Honorifics
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "hi-beginner-l7",
    slug: "three-tier-pronouns",
    title: "The Three-Tier Pronoun System",
    content: `# The Three-Tier Pronoun System

Hindi has THREE levels of 'you' — this is one of the most important features of Hindi!

## तू (too) — Intimate / Rude
- Used with very close friends, small children, God (in prayer), or as an insult
- **Never use with strangers or elders!**

## तुम (tum) — Informal / Friendly
- Used with friends, siblings, peers, younger people
- The most common form among people of similar age

## आप (aap) — Formal / Respectful
- Used with elders, strangers, teachers, bosses, in-laws
- Also used as a general polite form
- **When in doubt, use आप!**

## Verb Agreement
| Pronoun | होना (to be) |
|---------|-------------|
| मैं (I) | हूँ (hoon) |
| तू (you-intimate) | है (hai) |
| तुम (you-informal) | हो (ho) |
| आप (you-formal) | हैं (hain) |
| वह (he/she) | है (hai) |
| वे (they) | हैं (hain) |`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m3",
    moduleTitle: "Pronouns & Honorifics",
    order: 7,
    topicId: "hi-beginner-three-tier-pronouns",
    vocabulary: [
      {
        word: "मैं",
        translation: "I",
        pronunciation: "main",
        exampleSentence: "मैं छात्र हूँ।",
        exampleTranslation: "I am a student.",
        partOfSpeech: "pronoun",
      },
      {
        word: "तुम",
        translation: "you (informal)",
        pronunciation: "tum",
        exampleSentence: "तुम कहाँ जा रहे हो?",
        exampleTranslation: "Where are you going?",
        partOfSpeech: "pronoun",
      },
      {
        word: "आप",
        translation: "you (formal/respectful)",
        pronunciation: "aap",
        exampleSentence: "आप कैसे हैं?",
        exampleTranslation: "How are you? (respectful)",
        partOfSpeech: "pronoun",
      },
      {
        word: "वह",
        translation: "he / she / that",
        pronunciation: "voh",
        exampleSentence: "वह मेरी बहन है।",
        exampleTranslation: "She is my sister.",
        partOfSpeech: "pronoun",
      },
      {
        word: "हम",
        translation: "we",
        pronunciation: "hum",
        exampleSentence: "हम भारतीय हैं।",
        exampleTranslation: "We are Indian.",
        partOfSpeech: "pronoun",
      },
    ],
    grammarPoints: [
      {
        title: "Choosing the Right 'You'",
        explanation: "The wrong choice of तू/तुम/आप can cause serious offense. A safe rule: use आप with anyone you have just met, anyone older, or anyone in authority. Switch to तुम only when the other person invites informality.",
        examples: [
          { correct: "आप कहाँ रहते हैं?", translation: "Where do you live? (respectful — to a stranger)" },
          { correct: "तुम कहाँ रहते हो?", translation: "Where do you live? (friendly — to a peer)" },
          { correct: "तू कहाँ रहता है?", translation: "Where do you live? (intimate — very close friend)" },
        ],
        commonMistakes: [
          {
            incorrect: "Using तू with your teacher or boss",
            correction: "Always use आप with teachers, bosses, and elders",
            explanation: "Using तू with an elder or authority figure is considered extremely disrespectful in Hindi culture.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "formal-informal-switch",
        title: "Meeting Different People",
        situation: "You meet a professor and then their young son at a university campus",
        agentRole: "You are Professor Sharma. Greet the student formally, then introduce your 8-year-old son Chintu. Observe whether the student adjusts their pronoun level.",
        userGoal: "Use आप with the professor and तुम with the child",
        targetPhrases: ["आप कैसे हैं?", "तुम कैसे हो?", "नमस्ते"],
        successCriteria: ["Uses आप with professor", "Switches to तुम with child", "Maintains polite tone"],
      },
    ],
    culturalNotes: [
      {
        title: "Honorifics — जी (ji)",
        content: "Adding जी after a name or title is the easiest way to show respect. 'Sharma ji', 'Papa ji', 'Didi ji' (elder sister). You can even say 'हाँ जी' (yes, respectfully) instead of just 'हाँ'. When in doubt, add जी!",
      },
    ],
  },
  {
    id: "hi-beginner-l8",
    slug: "verb-agreement",
    title: "Verb Agreement with Pronouns",
    content: `# Verb Agreement

Hindi verbs change based on the gender AND number of the subject, plus the formality level.

## होना (to be) — Present Tense
| | Masculine | Feminine |
|---|-----------|----------|
| मैं | हूँ (hoon) | हूँ (hoon) |
| तू | है (hai) | है (hai) |
| तुम | हो (ho) | हो (ho) |
| यह/वह | है (hai) | है (hai) |
| आप | हैं (hain) | हैं (hain) |
| हम/वे/ये | हैं (hain) | हैं (hain) |

## Examples with Gender
- **मैं अच्छा हूँ** — I am good (male speaking)
- **मैं अच्छी हूँ** — I am good (female speaking)
- **वह लंबा है** — He is tall
- **वह लंबी है** — She is tall`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m3",
    moduleTitle: "Pronouns & Honorifics",
    order: 8,
    topicId: "hi-beginner-verb-agreement",
    vocabulary: [
      {
        word: "अच्छा",
        translation: "good (masculine)",
        pronunciation: "ach-CHHAA",
        exampleSentence: "यह बहुत अच्छा है।",
        exampleTranslation: "This is very good.",
        partOfSpeech: "adjective",
      },
      {
        word: "अच्छी",
        translation: "good (feminine)",
        pronunciation: "ach-CHHEE",
        exampleSentence: "यह किताब अच्छी है।",
        exampleTranslation: "This book is good.",
        partOfSpeech: "adjective",
      },
      {
        word: "बड़ा",
        translation: "big (masculine)",
        pronunciation: "ba-RAA",
        exampleSentence: "यह घर बड़ा है।",
        exampleTranslation: "This house is big.",
        partOfSpeech: "adjective",
      },
      {
        word: "छोटी",
        translation: "small (feminine)",
        pronunciation: "CHHO-tee",
        exampleSentence: "यह छोटी लड़की है।",
        exampleTranslation: "This is a small girl.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Gender Agreement in Adjectives",
        explanation: "Hindi adjectives ending in -ा (aa) change to -ी (ee) for feminine nouns and -े (e) for masculine plural/oblique. Adjectives NOT ending in -ा (like ज़रूरी, important) do not change.",
        examples: [
          { correct: "अच्छा लड़का", translation: "good boy (masc. singular)" },
          { correct: "अच्छी लड़की", translation: "good girl (fem. singular)" },
          { correct: "अच्छे लड़के", translation: "good boys (masc. plural)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describe-yourself",
        title: "Describing Yourself",
        situation: "Your Hindi pen-pal asks you to describe yourself",
        agentRole: "You are Meera, an online Hindi pen-pal. Ask the student to describe themselves — are they tall, short, a student, happy?",
        userGoal: "Describe yourself using correct gender agreement",
        targetPhrases: ["मैं...हूँ", "अच्छा/अच्छी", "लंबा/लंबी"],
        successCriteria: ["Uses correct gender for self-description", "Uses हूँ with मैं", "Describes at least 2 qualities"],
      },
    ],
  },
  {
    id: "hi-beginner-l9",
    slug: "possessives",
    title: "Possessives (मेरा, तुम्हारा, आपका)",
    content: `# Possessives

Possessives in Hindi agree with the gender/number of the THING POSSESSED, not the possessor.

## Possessive Forms
| Pronoun | Masc. Sg. | Fem. Sg. | Masc. Pl. |
|---------|-----------|----------|-----------|
| मैं | मेरा | मेरी | मेरे |
| तू | तेरा | तेरी | तेरे |
| तुम | तुम्हारा | तुम्हारी | तुम्हारे |
| आप | आपका | आपकी | आपके |
| यह/वह | इसका/उसका | इसकी/उसकी | इसके/उसके |
| हम | हमारा | हमारी | हमारे |

## Examples
- **मेरा नाम** — my name (नाम is masculine)
- **मेरी किताब** — my book (किताब is feminine)
- **आपका घर** — your house (formal; घर is masculine)
- **तुम्हारी बहन** — your sister (informal; बहन is feminine)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m3",
    moduleTitle: "Pronouns & Honorifics",
    order: 9,
    topicId: "hi-beginner-possessives",
    vocabulary: [
      {
        word: "मेरा",
        translation: "my (masculine)",
        pronunciation: "ME-raa",
        exampleSentence: "मेरा भाई दिल्ली में रहता है।",
        exampleTranslation: "My brother lives in Delhi.",
        partOfSpeech: "possessive",
      },
      {
        word: "मेरी",
        translation: "my (feminine)",
        pronunciation: "ME-ree",
        exampleSentence: "मेरी माँ बहुत अच्छी हैं।",
        exampleTranslation: "My mother is very good.",
        partOfSpeech: "possessive",
      },
      {
        word: "आपका",
        translation: "your (formal, masculine)",
        pronunciation: "AAP-kaa",
        exampleSentence: "आपका नाम क्या है?",
        exampleTranslation: "What is your name?",
        partOfSpeech: "possessive",
      },
      {
        word: "हमारा",
        translation: "our (masculine)",
        pronunciation: "ha-MAA-raa",
        exampleSentence: "हमारा देश भारत है।",
        exampleTranslation: "Our country is India.",
        partOfSpeech: "possessive",
      },
    ],
    grammarPoints: [
      {
        title: "Possessives Agree with the Object, Not the Owner",
        explanation: "Unlike English ('his'/'her'), Hindi possessives change based on the gender of the noun they describe. A man still says मेरी माँ (my mother) with feminine मेरी because माँ is feminine.",
        examples: [
          { correct: "मेरा भाई", translation: "my brother (भाई = masc.)" },
          { correct: "मेरी बहन", translation: "my sister (बहन = fem.)" },
          { correct: "मेरे दोस्त", translation: "my friends (दोस्त = masc. plural)" },
        ],
        commonMistakes: [
          {
            incorrect: "मेरा बहन",
            correction: "मेरी बहन",
            explanation: "बहन (sister) is feminine, so the possessive must also be feminine: मेरी, not मेरा.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "family-introductions",
        title: "Introducing Your Family",
        situation: "A new neighbor asks about your family",
        agentRole: "You are Sunita, a new neighbor. Ask the student about their family members.",
        userGoal: "Talk about your family using correct possessive forms",
        targetPhrases: ["मेरा/मेरी", "भाई", "बहन", "माँ", "पिताजी"],
        successCriteria: ["Uses मेरा with masculine nouns", "Uses मेरी with feminine nouns", "Names at least 2 family members"],
      },
    ],
  },
];

// ============================================
// Module 4: Nouns & Adjectives
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "hi-beginner-l10",
    slug: "noun-gender",
    title: "Noun Gender (लिंग)",
    content: `# Noun Gender — लिंग (Ling)

Every Hindi noun is either masculine (पुल्लिंग) or feminine (स्त्रीलिंग). There is no neuter.

## General Patterns
### Masculine (-ा ending is common)
- **लड़का** (ladkaa) — boy
- **कमरा** (kamraa) — room
- **पानी** (paanee) — water (exception: -ी but masculine!)

### Feminine (-ी ending is common)
- **लड़की** (ladkee) — girl
- **रोटी** (rotee) — bread
- **नदी** (nadee) — river

## Exceptions to Watch
- **पानी** (water) — masculine despite -ी ending
- **मेज़** (table) — feminine despite no -ी ending
- **दूध** (milk) — masculine
- **चाय** (tea) — feminine

## Oblique Case
Before postpositions (में, पर, से, को), masculine -ा nouns change to -े:
- लड़का → लड़के को (to the boy)
- कमरा → कमरे में (in the room)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m4",
    moduleTitle: "Nouns & Adjectives",
    order: 10,
    topicId: "hi-beginner-noun-gender",
    vocabulary: [
      {
        word: "लड़का",
        translation: "boy",
        pronunciation: "lad-KAA",
        exampleSentence: "वह लड़का मेरा दोस्त है।",
        exampleTranslation: "That boy is my friend.",
        partOfSpeech: "noun",
      },
      {
        word: "लड़की",
        translation: "girl",
        pronunciation: "lad-KEE",
        exampleSentence: "वह लड़की पढ़ रही है।",
        exampleTranslation: "That girl is studying.",
        partOfSpeech: "noun",
      },
      {
        word: "कमरा",
        translation: "room",
        pronunciation: "kam-RAA",
        exampleSentence: "कमरा साफ़ है।",
        exampleTranslation: "The room is clean.",
        partOfSpeech: "noun",
      },
      {
        word: "मेज़",
        translation: "table",
        pronunciation: "mez",
        exampleSentence: "किताब मेज़ पर है।",
        exampleTranslation: "The book is on the table.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Oblique Case for Masculine -ा Nouns",
        explanation: "Before any postposition (में, पर, से, को, etc.), masculine nouns ending in -ा change to -े. Feminine nouns do NOT change in the oblique case.",
        examples: [
          { correct: "लड़का अच्छा है।", translation: "The boy is good. (direct case)" },
          { correct: "लड़के को बुलाओ।", translation: "Call the boy. (oblique: लड़का → लड़के)" },
          { correct: "कमरे में बैठो।", translation: "Sit in the room. (oblique: कमरा → कमरे)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "pointing-objects",
        title: "What Is This?",
        situation: "Your tutor points at objects and asks you to identify them with correct gender",
        agentRole: "You are a Hindi tutor. Point at objects and ask 'यह क्या है?' — correct the student if they use the wrong gender.",
        userGoal: "Identify objects with correct gender markers",
        targetPhrases: ["यह...है", "वह...है", "बड़ा/बड़ी", "छोटा/छोटी"],
        successCriteria: ["Identifies objects", "Uses correct gender for adjectives", "Responds to corrections"],
      },
    ],
  },
  {
    id: "hi-beginner-l11",
    slug: "colors-adjectives",
    title: "Colors & Adjectives (रंग)",
    content: `# Colors & Adjectives — रंग (Rang)

## Colors
- **लाल** (laal) — red *(does not change with gender)*
- **नीला / नीली** (neelaa / neelee) — blue (m/f)
- **हरा / हरी** (haraa / haree) — green (m/f)
- **पीला / पीली** (peelaa / peelee) — yellow (m/f)
- **काला / काली** (kaalaa / kaalee) — black (m/f)
- **सफ़ेद** (safed) — white *(does not change)*
- **गुलाबी** (gulaabee) — pink *(does not change)*
- **नारंगी** (naarangee) — orange *(does not change)*

## Adjective Rules Recap
- Adjectives ending in -ा change: **-ा (m.sg.)** → **-ी (f.sg.)** → **-े (m.pl./oblique)**
- Adjectives NOT ending in -ा stay the same: लाल, सुंदर, ज़रूरी

## Comparatives
- **...से बड़ा** — bigger than...
- **...से छोटा** — smaller than...
- **सबसे अच्छा** — the best (superlative)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m4",
    moduleTitle: "Nouns & Adjectives",
    order: 11,
    topicId: "hi-beginner-colors-adjectives",
    vocabulary: [
      {
        word: "लाल",
        translation: "red",
        pronunciation: "laal",
        exampleSentence: "यह लाल फूल है।",
        exampleTranslation: "This is a red flower.",
        partOfSpeech: "adjective",
      },
      {
        word: "नीला",
        translation: "blue (masculine)",
        pronunciation: "NEE-laa",
        exampleSentence: "आसमान नीला है।",
        exampleTranslation: "The sky is blue.",
        partOfSpeech: "adjective",
      },
      {
        word: "हरा",
        translation: "green (masculine)",
        pronunciation: "HA-raa",
        exampleSentence: "पेड़ हरा है।",
        exampleTranslation: "The tree is green.",
        partOfSpeech: "adjective",
      },
      {
        word: "सफ़ेद",
        translation: "white",
        pronunciation: "sa-FED",
        exampleSentence: "दूध सफ़ेद है।",
        exampleTranslation: "Milk is white.",
        partOfSpeech: "adjective",
      },
      {
        word: "सुंदर",
        translation: "beautiful",
        pronunciation: "SUN-dar",
        exampleSentence: "यह बहुत सुंदर है।",
        exampleTranslation: "This is very beautiful.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Comparatives with से",
        explanation: "To compare two things, use the postposition से (se, 'than'). The adjective does NOT change form for comparatives — just add से before it.",
        examples: [
          { correct: "दिल्ली मुंबई से बड़ी है।", translation: "Delhi is bigger than Mumbai." },
          { correct: "चाय कॉफ़ी से अच्छी है।", translation: "Tea is better than coffee." },
          { correct: "यह सबसे अच्छा है।", translation: "This is the best. (superlative with सबसे)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "describe-room",
        title: "Describing Your Room",
        situation: "Your friend asks about your room on a video call",
        agentRole: "You are Ankit, on a video call. Ask the student what color things in their room are.",
        userGoal: "Describe the colors of objects in your room with correct gender",
        targetPhrases: ["नीला/नीली", "लाल", "मेरा कमरा", "बड़ा/छोटा"],
        successCriteria: ["Uses at least 3 colors", "Matches adjective gender to nouns", "Describes multiple objects"],
      },
    ],
  },
  {
    id: "hi-beginner-l12",
    slug: "oblique-case-practice",
    title: "Oblique Case Practice",
    content: `# Oblique Case in Action

## Review: When Does Oblique Apply?
Whenever a noun appears BEFORE a postposition, it takes the oblique form.

## Masculine Changes
| Direct | Oblique | Example |
|--------|---------|---------|
| लड़का (boy) | लड़के | लड़के को बुलाओ (call the boy) |
| कमरा (room) | कमरे | कमरे में जाओ (go to the room) |
| बेटा (son) | बेटे | बेटे के लिए (for the son) |

## Feminine — No Change!
| Direct | Oblique | Example |
|--------|---------|---------|
| लड़की (girl) | लड़की | लड़की को बुलाओ (call the girl) |
| मेज़ (table) | मेज़ | मेज़ पर रखो (put it on the table) |

## Plural Oblique
- Masc: -े → -ों (लड़के → लड़कों)
- Fem: add -ों (लड़कियाँ → लड़कियों)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m4",
    moduleTitle: "Nouns & Adjectives",
    order: 12,
    topicId: "hi-beginner-oblique-case",
    vocabulary: [
      {
        word: "में",
        translation: "in / inside",
        pronunciation: "mein",
        exampleSentence: "घर में कौन है?",
        exampleTranslation: "Who is in the house?",
        partOfSpeech: "postposition",
      },
      {
        word: "पर",
        translation: "on / at",
        pronunciation: "par",
        exampleSentence: "किताब मेज़ पर है।",
        exampleTranslation: "The book is on the table.",
        partOfSpeech: "postposition",
      },
      {
        word: "को",
        translation: "to (object marker)",
        pronunciation: "ko",
        exampleSentence: "राम को बुलाओ।",
        exampleTranslation: "Call Ram.",
        partOfSpeech: "postposition",
      },
      {
        word: "से",
        translation: "from / with / than",
        pronunciation: "se",
        exampleSentence: "दिल्ली से मुंबई दूर है।",
        exampleTranslation: "Mumbai is far from Delhi.",
        partOfSpeech: "postposition",
      },
    ],
    grammarPoints: [
      {
        title: "Postpositions vs. Prepositions",
        explanation: "English puts prepositions BEFORE the noun (in the room). Hindi puts postpositions AFTER the noun (कमरे में = room-in). The noun must take oblique form before the postposition.",
        examples: [
          { correct: "घर में", translation: "in the house (घर does not end in -ा, so no change)" },
          { correct: "कमरे में", translation: "in the room (कमरा → कमरे before में)" },
          { correct: "लड़कों के लिए", translation: "for the boys (लड़के → लड़कों in plural oblique)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "where-is-it",
        title: "Finding Lost Items",
        situation: "You are looking for your things around the house",
        agentRole: "You are the student's roommate. They keep asking where things are, and you tell them using postpositions.",
        userGoal: "Ask where things are and understand location answers using में, पर, के पास",
        targetPhrases: ["कहाँ है?", "में", "पर", "के पास"],
        successCriteria: ["Asks location questions", "Understands postposition answers", "Uses oblique case"],
      },
    ],
  },
];

// ============================================
// Module 5: Numbers & Time
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "hi-beginner-l13",
    slug: "numbers-1-100",
    title: "Numbers 1-100 (गिनती)",
    content: `# Numbers 1-100 — गिनती (Gintee)

Hindi numbers are notoriously irregular — each number from 1-100 has a unique name (unlike English's predictable "twenty-one, twenty-two..."). Practice is essential!

## 1-10 (Review)
१ एक, २ दो, ३ तीन, ४ चार, ५ पाँच, ६ छह, ७ सात, ८ आठ, ९ नौ, १० दस

## 11-20
११ ग्यारह, १२ बारह, १३ तेरह, १४ चौदह, १५ पंद्रह, १६ सोलह, १७ सत्रह, १८ अठारह, १९ उन्नीस, २० बीस

## Tens
३० तीस, ४० चालीस, ५० पचास, ६० साठ, ७० सत्तर, ८० अस्सी, ९० नब्बे, १०० सौ

## Pattern (sort of!)
- 21-28: इक्कीस, बाईस, तेईस, चौबीस, पच्चीस, छब्बीस, सत्ताईस, अट्ठाईस
- 29: उनतीस, 31: इकतीस...
- The unit digit comes FIRST, then the ten (like German): 25 = पच्चीस (panch + bees)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m5",
    moduleTitle: "Numbers & Time",
    order: 13,
    topicId: "hi-beginner-numbers-100",
    vocabulary: [
      { word: "ग्यारह", translation: "eleven", pronunciation: "GYAA-rah", exampleSentence: "ग्यारह बज गए।", exampleTranslation: "It's eleven o'clock.", partOfSpeech: "number" },
      { word: "बीस", translation: "twenty", pronunciation: "bees", exampleSentence: "बीस रुपये दो।", exampleTranslation: "Give twenty rupees.", partOfSpeech: "number" },
      { word: "पचास", translation: "fifty", pronunciation: "pa-CHAAS", exampleSentence: "पचास लोग आए।", exampleTranslation: "Fifty people came.", partOfSpeech: "number" },
      { word: "सौ", translation: "hundred", pronunciation: "sau", exampleSentence: "सौ रुपये कम हैं।", exampleTranslation: "A hundred rupees is too little.", partOfSpeech: "number" },
    ],
    grammarPoints: [
      {
        title: "Why Hindi Numbers Are Irregular",
        explanation: "Hindi numbers derive from Sanskrit and have undergone centuries of sound changes. Unlike English (twenty-ONE, twenty-TWO), each Hindi number is a fused word. The best strategy is to memorize them in groups of 10.",
        examples: [
          { correct: "इक्कीस (21)", translation: "ek (1) + bees (20) → ikkees" },
          { correct: "पच्चीस (25)", translation: "panch (5) + bees (20) → pachchees" },
          { correct: "उनतीस (29)", translation: "un (one-less) + tees (30) → 29" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "market-haggling",
        title: "Bargaining at the Market",
        situation: "You are shopping at Sarojini Nagar market in Delhi",
        agentRole: "You are a shopkeeper. Quote prices and let the student bargain using Hindi numbers.",
        userGoal: "Understand prices and counter-offer using numbers",
        targetPhrases: ["कितने का है?", "बहुत महँगा", "पचास रुपये", "ठीक है"],
        successCriteria: ["Asks the price", "Uses numbers in counter-offer", "Reaches agreement"],
      },
    ],
    culturalNotes: [
      {
        title: "The Lakh and Crore System",
        content: "India uses a unique numbering system: 1,00,000 = एक लाख (one lakh, = 100,000) and 1,00,00,000 = एक करोड़ (one crore, = 10 million). Commas are placed differently: 1,00,00,000 instead of 10,000,000. You will see this on price tags, news, and bank statements.",
      },
    ],
  },
  {
    id: "hi-beginner-l14",
    slug: "telling-time",
    title: "Telling Time (समय)",
    content: `# Telling Time — समय (Samay)

## Asking the Time
- **क्या समय हुआ है?** — What time is it? (formal)
- **कितने बजे हैं?** — What time is it? (common)
- **क्या बजा है?** — What time is it? (casual)

## बजे (baje) = O'Clock
- **एक बजा है** — It's one o'clock (singular बजा)
- **दो बजे हैं** — It's two o'clock (plural बजे)
- **पाँच बजे हैं** — It's five o'clock

## Half & Quarter
- **साढ़े** (saadhe) = half past: साढ़े तीन = 3:30
- **सवा** (savaa) = quarter past: सवा चार = 4:15
- **पौने** (paune) = quarter to: पौने पाँच = 4:45

## Time of Day
- **सुबह** — morning
- **दोपहर** — afternoon
- **शाम** — evening
- **रात** — night`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m5",
    moduleTitle: "Numbers & Time",
    order: 14,
    topicId: "hi-beginner-telling-time",
    vocabulary: [
      { word: "बजे", translation: "o'clock", pronunciation: "BA-jay", exampleSentence: "अभी तीन बजे हैं।", exampleTranslation: "It's three o'clock now.", partOfSpeech: "noun" },
      { word: "सुबह", translation: "morning", pronunciation: "su-BAH", exampleSentence: "सुबह सात बजे उठो।", exampleTranslation: "Wake up at 7 in the morning.", partOfSpeech: "noun" },
      { word: "शाम", translation: "evening", pronunciation: "shaam", exampleSentence: "शाम को मिलते हैं।", exampleTranslation: "Let's meet in the evening.", partOfSpeech: "noun" },
      { word: "रात", translation: "night", pronunciation: "raat", exampleSentence: "रात के दस बजे हैं।", exampleTranslation: "It's 10 PM.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "बजा vs बजे",
        explanation: "Use बजा (singular) only for 1 o'clock. For all other hours, use बजे (plural). This mirrors the है/हैं pattern.",
        examples: [
          { correct: "एक बजा है।", translation: "It's one o'clock. (singular)" },
          { correct: "दो बजे हैं।", translation: "It's two o'clock. (plural)" },
          { correct: "साढ़े बारह बजे हैं।", translation: "It's 12:30. (plural)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "train-schedule",
        title: "Checking the Train Schedule",
        situation: "You need to catch a train from New Delhi station",
        agentRole: "You are a ticket clerk at New Delhi Railway Station. Tell the student departure times.",
        userGoal: "Ask what time the train leaves and confirm your understanding",
        targetPhrases: ["कितने बजे", "सुबह", "शाम", "धन्यवाद"],
        successCriteria: ["Asks about time", "Understands the response", "Confirms correctly"],
      },
    ],
  },
  {
    id: "hi-beginner-l15",
    slug: "days-months",
    title: "Days & Months (दिन और महीने)",
    content: `# Days & Months

## Days of the Week — हफ़्ते के दिन
- **सोमवार** (somvaar) — Monday
- **मंगलवार** (mangalvaar) — Tuesday
- **बुधवार** (budhvaar) — Wednesday
- **गुरुवार** (guruvaar) — Thursday
- **शुक्रवार** (shukravaar) — Friday
- **शनिवार** (shanivaar) — Saturday
- **रविवार** (ravivaar) — Sunday

## Months — महीने
Hindi uses both the Gregorian calendar and the Hindu calendar:
- **जनवरी** (janvaree) — January
- **फ़रवरी** (farvaree) — February
- **मार्च** (march) — March
- ... (most are transliterations of English month names)

## Useful Phrases
- **आज** (aaj) — today
- **कल** (kal) — yesterday / tomorrow (context tells which!)
- **परसों** (parson) — day before yesterday / day after tomorrow`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m5",
    moduleTitle: "Numbers & Time",
    order: 15,
    topicId: "hi-beginner-days-months",
    vocabulary: [
      { word: "आज", translation: "today", pronunciation: "aaj", exampleSentence: "आज सोमवार है।", exampleTranslation: "Today is Monday.", partOfSpeech: "adverb" },
      { word: "कल", translation: "yesterday / tomorrow", pronunciation: "kal", exampleSentence: "कल मैं दिल्ली जाऊँगा।", exampleTranslation: "Tomorrow I will go to Delhi.", partOfSpeech: "adverb" },
      { word: "सोमवार", translation: "Monday", pronunciation: "SOM-vaar", exampleSentence: "सोमवार को स्कूल है।", exampleTranslation: "There is school on Monday.", partOfSpeech: "noun" },
      { word: "हफ़्ता", translation: "week", pronunciation: "HAF-taa", exampleSentence: "एक हफ़्ते में सात दिन होते हैं।", exampleTranslation: "There are seven days in a week.", partOfSpeech: "noun" },
      { word: "महीना", translation: "month", pronunciation: "ma-HEE-naa", exampleSentence: "यह महीना बहुत गर्म है।", exampleTranslation: "This month is very hot.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "कल — Yesterday AND Tomorrow",
        explanation: "The word कल means BOTH 'yesterday' and 'tomorrow.' Context and verb tense make it clear. Similarly, परसों means both 'day before yesterday' and 'day after tomorrow.'",
        examples: [
          { correct: "कल मैं गया था।", translation: "I went yesterday. (past tense = yesterday)" },
          { correct: "कल मैं जाऊँगा।", translation: "I will go tomorrow. (future tense = tomorrow)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "making-plans",
        title: "Planning a Meetup",
        situation: "You and a friend are planning when to meet",
        agentRole: "You are Rohit, trying to find a day to meet the student this week. Suggest days and ask about their schedule.",
        userGoal: "Discuss which day works and agree on a time",
        targetPhrases: ["सोमवार", "कल", "कितने बजे", "ठीक है"],
        successCriteria: ["Names a day", "Discusses time", "Agrees on plans"],
      },
    ],
    culturalNotes: [
      {
        title: "The Hindi Day Names",
        content: "Hindi day names come from celestial bodies, just like English! सोम (Moon) = Monday, मंगल (Mars) = Tuesday, बुध (Mercury) = Wednesday, गुरु (Jupiter) = Thursday, शुक्र (Venus) = Friday, शनि (Saturn) = Saturday, रवि (Sun) = Sunday.",
      },
    ],
  },
];

// ============================================
// Module 6: Family & Postpositions
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "hi-beginner-l16",
    slug: "family-terms",
    title: "Family & Kinship Terms (परिवार)",
    content: `# Family — परिवार (Parivaar)

Hindi has extremely specific kinship terms — far more than English!

## Immediate Family
- **माँ / माता जी** — mother
- **पिताजी / बाप** — father
- **भाई** — brother
- **बहन** — sister
- **बेटा** — son
- **बेटी** — daughter
- **पति** — husband
- **पत्नी** — wife

## Paternal Side (पिता की तरफ़)
- **दादा / दादी** — paternal grandfather / grandmother
- **चाचा / चाची** — father's younger brother / his wife
- **ताऊ / ताई** — father's elder brother / his wife
- **बुआ / फूफा** — father's sister / her husband

## Maternal Side (माँ की तरफ़)
- **नाना / नानी** — maternal grandfather / grandmother
- **मामा / मामी** — mother's brother / his wife
- **मौसी / मौसा** — mother's sister / her husband

## Why It Matters
In English, "uncle" covers everyone. In Hindi, चाचा ≠ मामा ≠ ताऊ ≠ फूफा!`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m6",
    moduleTitle: "Family & Postpositions",
    order: 16,
    topicId: "hi-beginner-family-terms",
    vocabulary: [
      {
        word: "चाचा",
        translation: "father's younger brother (paternal uncle)",
        pronunciation: "CHAA-chaa",
        exampleSentence: "मेरे चाचा दिल्ली में रहते हैं।",
        exampleTranslation: "My paternal uncle lives in Delhi.",
        partOfSpeech: "noun",
      },
      {
        word: "मामा",
        translation: "mother's brother (maternal uncle)",
        pronunciation: "MAA-maa",
        exampleSentence: "मामा जी कल आ रहे हैं।",
        exampleTranslation: "Maternal uncle is coming tomorrow.",
        partOfSpeech: "noun",
      },
      {
        word: "दादी",
        translation: "paternal grandmother",
        pronunciation: "DAA-dee",
        exampleSentence: "दादी जी की कहानियाँ अच्छी हैं।",
        exampleTranslation: "Grandmother's stories are nice.",
        partOfSpeech: "noun",
      },
      {
        word: "नानी",
        translation: "maternal grandmother",
        pronunciation: "NAA-nee",
        exampleSentence: "नानी के घर जाना है।",
        exampleTranslation: "We have to go to maternal grandmother's house.",
        partOfSpeech: "noun",
      },
      {
        word: "बेटा",
        translation: "son",
        pronunciation: "BE-taa",
        exampleSentence: "मेरा बेटा स्कूल में है।",
        exampleTranslation: "My son is in school.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Paternal vs. Maternal Distinction",
        explanation: "Hindi strictly separates paternal and maternal relatives. Your father's brother is चाचा or ताऊ (depending on whether he is younger or older than your father). Your mother's brother is मामा. Mixing these up is a social error.",
        examples: [
          { correct: "मेरे चाचा (father's younger brother)", translation: "My uncle (paternal, younger)" },
          { correct: "मेरे मामा (mother's brother)", translation: "My uncle (maternal)" },
          { correct: "मेरे ताऊ (father's elder brother)", translation: "My uncle (paternal, elder)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "family-gathering",
        title: "At a Family Gathering",
        situation: "You are at a large Indian family event and someone asks about your relatives",
        agentRole: "You are Aunty Rekha at a family wedding. Ask the student about their family using specific Hindi kinship terms.",
        userGoal: "Describe family members using correct Hindi kinship terms",
        targetPhrases: ["चाचा", "मामा", "दादी", "नानी", "भाई", "बहन"],
        successCriteria: ["Uses at least 2 specific kinship terms", "Distinguishes paternal from maternal", "Responds to follow-up questions"],
      },
    ],
    culturalNotes: [
      {
        title: "Joint Families in India",
        content: "Many Indian families live in joint family (संयुक्त परिवार) arrangements where grandparents, uncles, aunts, and cousins all live under one roof. This is why Hindi has such specific kinship terms — you need to distinguish between many relatives you see daily!",
      },
    ],
  },
  {
    id: "hi-beginner-l17",
    slug: "postpositions",
    title: "Postpositions (में, पर, से, को)",
    content: `# Postpositions — परसर्ग (Parasarg)

Hindi uses postpositions (after the noun) instead of prepositions (before the noun).

## Primary Simple Postpositions
- **में** (mein) — in, inside: दिल्ली में (in Delhi)
- **पर** (par) — on, at: मेज़ पर (on the table)
- **से** (se) — from, with, by, than: दिल्ली से (from Delhi)
- **को** (ko) — to, object marker: राम को (to Ram)
- **का/की/के** (kaa/kee/ke) — of, possessive: राम का (Ram's)
- **तक** (tak) — until, up to: शाम तक (until evening)

## Compound Postpositions
- **के पास** (ke paas) — near, have: मेरे पास (near me / I have)
- **के लिए** (ke liye) — for: आपके लिए (for you)
- **के बारे में** (ke baare mein) — about: हिंदी के बारे में (about Hindi)
- **के सामने** (ke saamne) — in front of
- **के पीछे** (ke peeche) — behind`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m6",
    moduleTitle: "Family & Postpositions",
    order: 17,
    topicId: "hi-beginner-postpositions",
    vocabulary: [
      {
        word: "के पास",
        translation: "near / to have",
        pronunciation: "ke PAAS",
        exampleSentence: "मेरे पास एक किताब है।",
        exampleTranslation: "I have a book. (lit: near me a book is)",
        partOfSpeech: "postposition",
      },
      {
        word: "के लिए",
        translation: "for",
        pronunciation: "ke LI-ye",
        exampleSentence: "यह आपके लिए है।",
        exampleTranslation: "This is for you.",
        partOfSpeech: "postposition",
      },
      {
        word: "तक",
        translation: "until / up to",
        pronunciation: "tak",
        exampleSentence: "शाम तक इंतज़ार करो।",
        exampleTranslation: "Wait until evening.",
        partOfSpeech: "postposition",
      },
      {
        word: "के सामने",
        translation: "in front of",
        pronunciation: "ke SAAM-ne",
        exampleSentence: "घर के सामने पेड़ है।",
        exampleTranslation: "There is a tree in front of the house.",
        partOfSpeech: "postposition",
      },
    ],
    grammarPoints: [
      {
        title: "के पास for 'To Have'",
        explanation: "Hindi has no direct verb for 'to have.' Instead, it uses 'X के पास Y है' (near X, Y exists). This is one of the most important patterns to master!",
        examples: [
          { correct: "मेरे पास गाड़ी है।", translation: "I have a car. (near me a car exists)" },
          { correct: "आपके पास समय है?", translation: "Do you have time?" },
          { correct: "उसके पास पैसे नहीं हैं।", translation: "He/She doesn't have money." },
        ],
        commonMistakes: [
          {
            incorrect: "मैं एक किताब हूँ।",
            correction: "मेरे पास एक किताब है।",
            explanation: "You cannot use हूँ (am) to express 'having.' Use के पास + है instead.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "giving-directions",
        title: "Giving Directions in a Neighborhood",
        situation: "A visitor asks you how to find places in your neighborhood",
        agentRole: "You are a visitor in a Hindi-speaking neighborhood. Ask where things are in relation to landmarks.",
        userGoal: "Give directions using postpositions",
        targetPhrases: ["के पास", "के सामने", "के पीछे", "में"],
        successCriteria: ["Uses at least 2 postpositions", "Gives coherent directions", "Responds to clarifying questions"],
      },
    ],
  },
  {
    id: "hi-beginner-l18",
    slug: "directions",
    title: "Directions (दिशाएँ)",
    content: `# Directions — दिशाएँ (Dishaayein)

## Cardinal Directions
- **उत्तर** (uttar) — North
- **दक्षिण** (dakshin) — South
- **पूर्व** (poorv) — East
- **पश्चिम** (pashchim) — West

## Giving Directions
- **सीधे जाइए** — Go straight (formal)
- **दाएँ मुड़िए** — Turn right (formal)
- **बाएँ मुड़िए** — Turn left (formal)
- **यहाँ** (yahaan) — here
- **वहाँ** (vahaan) — there
- **बगल में** — next to
- **पास में** — nearby

## Useful Questions
- **...कैसे जाएँ?** — How do I get to...?
- **...कितनी दूर है?** — How far is...?
- **क्या यह पैदल दूरी पर है?** — Is it within walking distance?`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m6",
    moduleTitle: "Family & Postpositions",
    order: 18,
    topicId: "hi-beginner-directions",
    vocabulary: [
      {
        word: "सीधे",
        translation: "straight",
        pronunciation: "SEE-dhe",
        exampleSentence: "सीधे जाओ।",
        exampleTranslation: "Go straight.",
        partOfSpeech: "adverb",
      },
      {
        word: "दाएँ",
        translation: "right",
        pronunciation: "DAA-yein",
        exampleSentence: "दाएँ मुड़ जाओ।",
        exampleTranslation: "Turn right.",
        partOfSpeech: "adverb",
      },
      {
        word: "बाएँ",
        translation: "left",
        pronunciation: "BAA-yein",
        exampleSentence: "बाएँ मुड़ो।",
        exampleTranslation: "Turn left.",
        partOfSpeech: "adverb",
      },
      {
        word: "दूर",
        translation: "far",
        pronunciation: "door",
        exampleSentence: "बाज़ार यहाँ से दूर है।",
        exampleTranslation: "The market is far from here.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Formal Imperative with -इए",
        explanation: "To politely tell someone to do something, add -इए to the verb stem. This is the form to use with strangers.",
        examples: [
          { correct: "जाइए", translation: "Please go (formal)" },
          { correct: "मुड़िए", translation: "Please turn (formal)" },
          { correct: "बताइए", translation: "Please tell (formal)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "auto-rickshaw",
        title: "Directing an Auto-Rickshaw",
        situation: "You are in an auto-rickshaw in Jaipur and need to guide the driver",
        agentRole: "You are an auto-rickshaw driver. The student must give you directions to their destination.",
        userGoal: "Direct the driver using left, right, straight, and stop",
        targetPhrases: ["सीधे जाइए", "दाएँ मुड़िए", "बाएँ", "रुकिए"],
        successCriteria: ["Gives at least 2 direction commands", "Uses formal imperative", "Says stop at the destination"],
      },
    ],
  },
];

// ============================================
// Module 7: Present Tense & Routines
// ============================================

const module7Lessons: LanguageLesson[] = [
  {
    id: "hi-beginner-l19",
    slug: "habitual-present",
    title: "Habitual Present (सामान्य वर्तमान)",
    content: `# Habitual Present Tense

Use this for things you do regularly — habits, routines, general truths.

## Formula
**Verb stem + ता/ती/ते + है/हो/हूँ/हैं**

## Gender & Number
| | Masculine | Feminine |
|---|-----------|----------|
| मैं | खाता हूँ | खाती हूँ |
| तू | खाता है | खाती है |
| तुम | खाते हो | खाती हो |
| वह | खाता है | खाती है |
| आप | खाते हैं | खाती हैं |
| हम/वे | खाते हैं | खाती हैं |

## Common Verbs
- **खाना** (khaanaa) — to eat → खाता/खाती
- **पीना** (peenaa) — to drink → पीता/पीती
- **जाना** (jaanaa) — to go → जाता/जाती
- **आना** (aanaa) — to come → आता/आती
- **करना** (karnaa) — to do → करता/करती
- **बोलना** (bolnaa) — to speak → बोलता/बोलती
- **पढ़ना** (padhnaa) — to read/study → पढ़ता/पढ़ती`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m7",
    moduleTitle: "Present Tense & Routines",
    order: 19,
    topicId: "hi-beginner-habitual-present",
    vocabulary: [
      {
        word: "खाना",
        translation: "to eat / food",
        pronunciation: "KHAA-naa",
        exampleSentence: "मैं रोज़ सुबह नाश्ता खाता हूँ।",
        exampleTranslation: "I eat breakfast every morning.",
        partOfSpeech: "verb",
      },
      {
        word: "जाना",
        translation: "to go",
        pronunciation: "JAA-naa",
        exampleSentence: "वह रोज़ स्कूल जाती है।",
        exampleTranslation: "She goes to school every day.",
        partOfSpeech: "verb",
      },
      {
        word: "पढ़ना",
        translation: "to read / to study",
        pronunciation: "PADH-naa",
        exampleSentence: "मैं हिंदी पढ़ता हूँ।",
        exampleTranslation: "I study Hindi.",
        partOfSpeech: "verb",
      },
      {
        word: "बोलना",
        translation: "to speak",
        pronunciation: "BOL-naa",
        exampleSentence: "क्या आप हिंदी बोलते हैं?",
        exampleTranslation: "Do you speak Hindi?",
        partOfSpeech: "verb",
      },
      {
        word: "रोज़",
        translation: "daily / every day",
        pronunciation: "roz",
        exampleSentence: "मैं रोज़ सुबह दौड़ता हूँ।",
        exampleTranslation: "I run every morning.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "Building the Habitual Present",
        explanation: "Take the verb stem (infinitive minus -ना), add -ता (m.sg.), -ती (f.), or -ते (m.pl./formal m.), then add the correct form of होना.",
        examples: [
          { correct: "मैं चाय पीता हूँ।", translation: "I drink tea. (male speaker)" },
          { correct: "मैं चाय पीती हूँ।", translation: "I drink tea. (female speaker)" },
          { correct: "वे रोज़ आते हैं।", translation: "They come every day." },
        ],
        commonMistakes: [
          {
            incorrect: "मैं खाता है।",
            correction: "मैं खाता हूँ।",
            explanation: "With मैं, always use हूँ — not है. है is for तू/वह/यह.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "daily-routine",
        title: "Describing Your Daily Routine",
        situation: "Your Hindi teacher asks about your daily routine",
        agentRole: "You are a Hindi teacher named Gupta ji. Ask the student what they do every morning, afternoon, and evening.",
        userGoal: "Describe your daily routine using habitual present tense",
        targetPhrases: ["मैं...ता/ती हूँ", "रोज़", "सुबह", "शाम"],
        successCriteria: ["Uses habitual present correctly", "Mentions at least 3 activities", "Uses time words"],
      },
    ],
  },
  {
    id: "hi-beginner-l20",
    slug: "present-continuous",
    title: "Present Continuous (रहा/रही + है)",
    content: `# Present Continuous Tense

Use this for actions happening RIGHT NOW.

## Formula
**Verb stem + रहा/रही/रहे + है/हो/हूँ/हैं**

## Conjugation
| | Masculine | Feminine |
|---|-----------|----------|
| मैं | खा रहा हूँ | खा रही हूँ |
| तू | खा रहा है | खा रही है |
| तुम | खा रहे हो | खा रही हो |
| वह | खा रहा है | खा रही है |
| आप | खा रहे हैं | खा रही हैं |
| हम/वे | खा रहे हैं | खा रही हैं |

## Habitual vs. Continuous
- **मैं खाता हूँ** — I eat (habit/routine)
- **मैं खा रहा हूँ** — I am eating (right now!)`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m7",
    moduleTitle: "Present Tense & Routines",
    order: 20,
    topicId: "hi-beginner-present-continuous",
    vocabulary: [
      {
        word: "रहा",
        translation: "continuous marker (masculine)",
        pronunciation: "RA-haa",
        exampleSentence: "वह खा रहा है।",
        exampleTranslation: "He is eating.",
        partOfSpeech: "auxiliary",
      },
      {
        word: "रही",
        translation: "continuous marker (feminine)",
        pronunciation: "RA-hee",
        exampleSentence: "वह पढ़ रही है।",
        exampleTranslation: "She is studying.",
        partOfSpeech: "auxiliary",
      },
      {
        word: "अभी",
        translation: "right now",
        pronunciation: "a-BHEE",
        exampleSentence: "मैं अभी आ रहा हूँ।",
        exampleTranslation: "I'm coming right now.",
        partOfSpeech: "adverb",
      },
      {
        word: "सोना",
        translation: "to sleep",
        pronunciation: "SO-naa",
        exampleSentence: "बच्चा सो रहा है।",
        exampleTranslation: "The child is sleeping.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "Habitual vs. Continuous: When to Use Which",
        explanation: "Habitual (-ता/ती + है) is for routines and general facts. Continuous (रहा/रही + है) is for actions in progress. This distinction is critical and tested frequently.",
        examples: [
          { correct: "मैं रोज़ चाय पीता हूँ।", translation: "I drink tea every day. (habitual)" },
          { correct: "मैं अभी चाय पी रहा हूँ।", translation: "I am drinking tea right now. (continuous)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "phone-call",
        title: "Phone Call — What Are You Doing?",
        situation: "A friend calls and asks what you are doing right now",
        agentRole: "You are Amit, calling your friend. Ask what they are doing, then tell them what you are doing.",
        userGoal: "Describe current activities using present continuous",
        targetPhrases: ["रहा/रही हूँ", "अभी", "क्या कर रहे हो?"],
        successCriteria: ["Uses present continuous", "Describes current activity", "Asks about friend's activity"],
      },
    ],
  },
  {
    id: "hi-beginner-l21",
    slug: "negation",
    title: "Negation with नहीं",
    content: `# Negation — नहीं (Naheen)

## Basic Negation
Place **नहीं** before the verb to negate it:
- **मैं जाता हूँ** → **मैं नहीं जाता** — I don't go
- **वह आ रही है** → **वह नहीं आ रही** — She is not coming

## Important: हूँ/है/हैं Often Drops
In negative sentences, the auxiliary (हूँ/है/हैं) is often dropped in spoken Hindi:
- मैं नहीं जाता ~~हूँ~~ → मैं नहीं जाता

## Other Negative Words
- **न** (na) — not (literary / formal)
- **मत** (mat) — don't! (imperative): मत जाओ! (Don't go!)
- **कभी नहीं** — never
- **कुछ नहीं** — nothing
- **कोई नहीं** — no one`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m7",
    moduleTitle: "Present Tense & Routines",
    order: 21,
    topicId: "hi-beginner-negation",
    vocabulary: [
      {
        word: "नहीं",
        translation: "no / not",
        pronunciation: "na-HEEN",
        exampleSentence: "मैं नहीं जाऊँगा।",
        exampleTranslation: "I will not go.",
        partOfSpeech: "adverb",
      },
      {
        word: "मत",
        translation: "don't (imperative)",
        pronunciation: "mat",
        exampleSentence: "वहाँ मत जाओ!",
        exampleTranslation: "Don't go there!",
        partOfSpeech: "adverb",
      },
      {
        word: "कभी नहीं",
        translation: "never",
        pronunciation: "ka-BHEE na-HEEN",
        exampleSentence: "मैं कभी नहीं भूलूँगा।",
        exampleTranslation: "I will never forget.",
        partOfSpeech: "adverb",
      },
      {
        word: "कुछ नहीं",
        translation: "nothing",
        pronunciation: "KUCH na-HEEN",
        exampleSentence: "कुछ नहीं हुआ।",
        exampleTranslation: "Nothing happened.",
        partOfSpeech: "pronoun",
      },
    ],
    grammarPoints: [
      {
        title: "नहीं vs. मत — Two Ways to Say 'No'",
        explanation: "नहीं negates statements and questions. मत negates commands/requests (imperatives). Never use नहीं for commands or मत for statements.",
        examples: [
          { correct: "मैं नहीं खाता।", translation: "I don't eat. (statement)" },
          { correct: "मत खाओ!", translation: "Don't eat! (command)" },
        ],
        commonMistakes: [
          {
            incorrect: "नहीं जाओ!",
            correction: "मत जाओ!",
            explanation: "For commands, use मत (don't!), not नहीं.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "saying-no-politely",
        title: "Politely Declining Offers",
        situation: "You are a guest at someone's house and they keep offering food",
        agentRole: "You are an enthusiastic Indian host, Aunty Kamla. Keep offering food and chai — the student must politely decline.",
        userGoal: "Politely say no to food and drink offers",
        targetPhrases: ["नहीं, शुक्रिया", "बस, बहुत हो गया", "मत दीजिए"],
        successCriteria: ["Declines politely", "Uses नहीं correctly", "Maintains polite tone"],
        hints: ["In Indian culture, the host will offer 2-3 times. It's polite to decline once before accepting!"],
      },
    ],
    culturalNotes: [
      {
        title: "The Art of Saying No in India",
        content: "Indians often avoid a blunt 'नहीं' (no). Instead, they may say 'देखते हैं' (let's see), 'शायद' (maybe), or 'कोशिश करता हूँ' (I'll try). A direct 'no' can feel rude. When declining food, say 'बस, बहुत हो गया' (enough, it's been plenty) rather than just 'नहीं'.",
      },
    ],
  },
];

// ============================================
// Module 8: Past & Future
// ============================================

const module8Lessons: LanguageLesson[] = [
  {
    id: "hi-beginner-l22",
    slug: "past-tense",
    title: "Simple Past & ने-Ergative",
    content: `# Simple Past Tense & the ने Construction

## Simple Past (Intransitive Verbs)
For verbs that don't take a direct object (जाना, आना, सोना), the verb agrees with the SUBJECT:
- **मैं गया** — I went (male)
- **मैं गई** — I went (female)
- **वह आया** — He came
- **वह आई** — She came

## ने-Ergative (Transitive Verbs)
For verbs WITH a direct object (खाना, पीना, देखना), Hindi uses a special construction:
- The subject takes **ने** (ne)
- The verb agrees with the OBJECT (not the subject!)

**मैंने खाना खाया** — I ate food
- मैं + ने = मैंने (I + ने)
- खाया agrees with खाना (masc.), NOT with मैं!

## Common Irregular Past Forms
| Infinitive | Past (m.) | Past (f.) |
|-----------|-----------|-----------|
| जाना (go) | गया | गई |
| आना (come) | आया | आई |
| करना (do) | किया | की |
| देना (give) | दिया | दी |
| लेना (take) | लिया | ली |
| होना (be) | हुआ | हुई |`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m8",
    moduleTitle: "Past & Future",
    order: 22,
    topicId: "hi-beginner-past-tense",
    vocabulary: [
      {
        word: "गया",
        translation: "went (masculine)",
        pronunciation: "GA-yaa",
        exampleSentence: "वह बाज़ार गया।",
        exampleTranslation: "He went to the market.",
        partOfSpeech: "verb",
      },
      {
        word: "आई",
        translation: "came (feminine)",
        pronunciation: "AA-ee",
        exampleSentence: "वह कल आई।",
        exampleTranslation: "She came yesterday.",
        partOfSpeech: "verb",
      },
      {
        word: "खाया",
        translation: "ate (masculine object)",
        pronunciation: "KHAA-yaa",
        exampleSentence: "मैंने खाना खाया।",
        exampleTranslation: "I ate food.",
        partOfSpeech: "verb",
      },
      {
        word: "किया",
        translation: "did (masculine object)",
        pronunciation: "KI-yaa",
        exampleSentence: "उसने काम किया।",
        exampleTranslation: "He/She did the work.",
        partOfSpeech: "verb",
      },
    ],
    grammarPoints: [
      {
        title: "The ने-Ergative: Hindi's Trickiest Grammar Point",
        explanation: "With transitive verbs in past tense, the subject takes ने and the verb agrees with the object — NOT the subject. This is the opposite of English and trips up every beginner.",
        examples: [
          { correct: "लड़के ने किताब पढ़ी।", translation: "The boy read the book. (पढ़ी agrees with किताब, feminine)" },
          { correct: "लड़की ने खाना खाया।", translation: "The girl ate food. (खाया agrees with खाना, masculine)" },
        ],
        commonMistakes: [
          {
            incorrect: "लड़की ने किताब पढ़ा।",
            correction: "लड़की ने किताब पढ़ी।",
            explanation: "With ने, the verb agrees with the OBJECT (किताब = feminine), so use पढ़ी, not पढ़ा.",
          },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "weekend-story",
        title: "What Did You Do Last Weekend?",
        situation: "Your coworker asks about your weekend",
        agentRole: "You are Neha, a coworker on Monday morning. Ask what the student did over the weekend.",
        userGoal: "Describe past activities using simple past and ने-construction",
        targetPhrases: ["मैंने...किया", "मैं...गया/गई", "कल"],
        successCriteria: ["Uses at least one ने-construction", "Uses at least one intransitive past", "Describes 2+ activities"],
      },
    ],
  },
  {
    id: "hi-beginner-l23",
    slug: "future-tense",
    title: "Future Tense (भविष्य काल)",
    content: `# Future Tense — भविष्य काल

## Formula
**Verb stem + ऊँगा/ऊँगी/एगा/एगी/ओगे/एँगे/एँगी**

## Conjugation (जाना = to go)
| | Masculine | Feminine |
|---|-----------|----------|
| मैं | जाऊँगा | जाऊँगी |
| तू | जाएगा | जाएगी |
| तुम | जाओगे | जाओगी |
| वह | जाएगा | जाएगी |
| आप | जाएँगे | जाएँगी |
| हम | जाएँगे | जाएँगी |
| वे | जाएँगे | जाएँगी |

## Examples
- **मैं कल दिल्ली जाऊँगा** — I will go to Delhi tomorrow (male)
- **वह आएगी** — She will come
- **हम खाना खाएँगे** — We will eat food
- **क्या तुम आओगे?** — Will you come?`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m8",
    moduleTitle: "Past & Future",
    order: 23,
    topicId: "hi-beginner-future-tense",
    vocabulary: [
      {
        word: "जाऊँगा",
        translation: "will go (masculine, I)",
        pronunciation: "jaa-OON-gaa",
        exampleSentence: "मैं कल जाऊँगा।",
        exampleTranslation: "I will go tomorrow.",
        partOfSpeech: "verb",
      },
      {
        word: "आएगी",
        translation: "will come (feminine, she)",
        pronunciation: "AA-ye-gee",
        exampleSentence: "वह शाम को आएगी।",
        exampleTranslation: "She will come in the evening.",
        partOfSpeech: "verb",
      },
      {
        word: "करूँगा",
        translation: "will do (masculine, I)",
        pronunciation: "ka-ROON-gaa",
        exampleSentence: "मैं यह काम करूँगा।",
        exampleTranslation: "I will do this work.",
        partOfSpeech: "verb",
      },
      {
        word: "शायद",
        translation: "maybe / perhaps",
        pronunciation: "SHAA-yad",
        exampleSentence: "शायद बारिश होगी।",
        exampleTranslation: "Maybe it will rain.",
        partOfSpeech: "adverb",
      },
    ],
    grammarPoints: [
      {
        title: "Future Tense Formation",
        explanation: "The future tense is relatively regular. For मैं, use -ऊँगा/-ऊँगी. For तू, use -एगा/-एगी. For तुम, use -ओगे/-ओगी. For आप/हम/वे, use -एँगे/-एँगी. No auxiliary verb needed!",
        examples: [
          { correct: "मैं पढ़ूँगा।", translation: "I will study. (male)" },
          { correct: "तुम क्या करोगे?", translation: "What will you do? (to a male friend)" },
          { correct: "हम साथ चलेंगे।", translation: "We will go together." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "vacation-planning",
        title: "Planning a Vacation",
        situation: "You and a friend are planning a trip to Rajasthan",
        agentRole: "You are Sahil, excited about a trip to Jaipur. Discuss plans with the student — where you'll go, what you'll see, what you'll eat.",
        userGoal: "Discuss future travel plans using future tense",
        targetPhrases: ["जाएँगे", "देखेंगे", "खाएँगे", "कल"],
        successCriteria: ["Uses future tense for at least 3 verbs", "Discusses specific plans", "Responds to suggestions"],
      },
    ],
  },
  {
    id: "hi-beginner-l24",
    slug: "travel-phrases",
    title: "Travel Phrases & Review",
    content: `# Travel Phrases & Course Review

## Essential Travel Hindi
- **टिकट कहाँ मिलेगा?** — Where will I get a ticket?
- **यह ट्रेन कहाँ जाती है?** — Where does this train go?
- **कितने का है?** — How much is it?
- **बिल दीजिए** — Give me the bill, please
- **मुझे...चाहिए** — I need...
- **मदद कीजिए!** — Help me please!
- **मुझे हिंदी नहीं आती** — I don't know Hindi (useful escape phrase!)

## At the Hotel
- **एक कमरा चाहिए** — I need a room
- **कितने दिन के लिए?** — For how many days?
- **AC कमरा है?** — Do you have an AC room?
- **नाश्ता शामिल है?** — Is breakfast included?

## At the Restaurant
- **मेन्यू दीजिए** — Give me the menu
- **कम मिर्ची** — Less spice
- **पानी की बोतल** — Bottle of water
- **बहुत स्वादिष्ट!** — Very delicious!`,
    targetLanguage: "hi",
    proficiencyLevel: "A1",
    moduleId: "hi-beginner-m8",
    moduleTitle: "Past & Future",
    order: 24,
    topicId: "hi-beginner-travel-phrases",
    vocabulary: [
      {
        word: "चाहिए",
        translation: "need / want",
        pronunciation: "CHAA-hi-ye",
        exampleSentence: "मुझे पानी चाहिए।",
        exampleTranslation: "I need water.",
        partOfSpeech: "verb",
      },
      {
        word: "टिकट",
        translation: "ticket",
        pronunciation: "TI-kat",
        exampleSentence: "दो टिकट दीजिए।",
        exampleTranslation: "Give me two tickets.",
        partOfSpeech: "noun",
      },
      {
        word: "स्वादिष्ट",
        translation: "delicious",
        pronunciation: "svaa-DISHT",
        exampleSentence: "खाना बहुत स्वादिष्ट है!",
        exampleTranslation: "The food is very delicious!",
        partOfSpeech: "adjective",
      },
      {
        word: "मदद",
        translation: "help",
        pronunciation: "MA-dad",
        exampleSentence: "कृपया मेरी मदद कीजिए।",
        exampleTranslation: "Please help me.",
        partOfSpeech: "noun",
      },
      {
        word: "मुझे",
        translation: "to me / I (oblique + को)",
        pronunciation: "MU-jhe",
        exampleSentence: "मुझे हिंदी सीखनी है।",
        exampleTranslation: "I want to learn Hindi.",
        partOfSpeech: "pronoun",
      },
    ],
    grammarPoints: [
      {
        title: "चाहिए — Expressing Needs",
        explanation: "मुझे...चाहिए means 'I need...' The thing needed is the grammatical subject, so चाहिए does not change form. For plural objects, no change is needed in modern spoken Hindi.",
        examples: [
          { correct: "मुझे पानी चाहिए।", translation: "I need water." },
          { correct: "मुझे एक कमरा चाहिए।", translation: "I need a room." },
          { correct: "आपको क्या चाहिए?", translation: "What do you need?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "hotel-checkin",
        title: "Checking Into a Hotel in Varanasi",
        situation: "You arrive at a small hotel in Varanasi after a long train journey",
        agentRole: "You are the hotel receptionist. The student needs to check in, ask about rooms and breakfast, and handle basic travel needs.",
        userGoal: "Check into a hotel using travel phrases from the course",
        targetPhrases: ["मुझे...चाहिए", "कितने का है", "धन्यवाद", "कमरा"],
        successCriteria: ["Requests a room", "Asks about price or amenities", "Uses polite language", "Handles the full interaction"],
      },
    ],
    culturalNotes: [
      {
        title: "Jugaad — The Indian Way of Problem-Solving",
        content: "जुगाड़ (jugaad) is a Hindi word meaning 'a creative hack or workaround.' In India, if something does not work the standard way, people find a jugaad. This mindset extends to language — if you cannot find the exact Hindi word, describe it, use gestures, or mix in English. Most Indians are bilingual and will happily help you find the right word!",
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "hi-beginner-m1",
    title: "Module 1: Devanagari Script",
    description: "Vowels, consonants, conjuncts, and numbers 1-10",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "hi-beginner-m2",
    title: "Module 2: Greetings & Basics",
    description: "Namaste, introductions, polite expressions, and question words",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "hi-beginner-m3",
    title: "Module 3: Pronouns & Honorifics",
    description: "The three-tier tu/tum/aap system, verb agreement, and possessives",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "hi-beginner-m4",
    title: "Module 4: Nouns & Adjectives",
    description: "Masculine/feminine gender, oblique case, colors, and comparatives",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "hi-beginner-m5",
    title: "Module 5: Numbers & Time",
    description: "Numbers 1-100, telling time with baje, days, and months",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "hi-beginner-m6",
    title: "Module 6: Family & Postpositions",
    description: "Kinship terms, postpositions, and directions",
    order: 6,
    lessons: module6Lessons,
  },
  {
    id: "hi-beginner-m7",
    title: "Module 7: Present Tense & Routines",
    description: "Habitual present, continuous present, and negation",
    order: 7,
    lessons: module7Lessons,
  },
  {
    id: "hi-beginner-m8",
    title: "Module 8: Past & Future",
    description: "Ergative past, irregular forms, future tense, and travel phrases",
    order: 8,
    lessons: module8Lessons,
  },
];

export const hindiBeginnerCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getHindiBeginnerLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findHindiBeginnerLesson(slug: string) {
  return getHindiBeginnerLessons().find((l) => l.slug === slug);
}

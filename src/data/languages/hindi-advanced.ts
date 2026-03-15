// Hindi Advanced Course Data
// CEFR C1 Level - Idioms, Literary Hindi, Debate, Dialects, Business, Advanced Grammar

import type { LanguageCourse, LanguageModule, LanguageLesson } from "@/data/language-types";

const courseInfo = {
  id: "hindi-advanced",
  slug: "hindi-advanced",
  title: "Hindi Advanced - C1",
  language: "hi",
  languageName: "Hindi",
  proficiencyLevel: "C1" as const,
  description: "Master idiomatic Hindi, literary registers, persuasive debate, regional dialects, business communication, and advanced grammatical nuances for near-native fluency.",
  targetAudience: "Upper-intermediate Hindi learners seeking professional and literary command",
  estimatedHours: 120,
  icon: "🇮🇳",
  prerequisiteCourseSlug: "hindi-intermediate",
};

// ============================================
// Module 1: Idioms & Proverbs
// ============================================

const module1Lessons: LanguageLesson[] = [
  {
    id: "hi-advanced-l1",
    slug: "body-part-idioms",
    title: "Body-Part Idioms (शरीर के मुहावरे)",
    content: `# Body-Part Idioms — शरीर के मुहावरे

Hindi idioms frequently use body parts metaphorically. These muhaavre are essential in everyday speech and writing — native speakers use them constantly.

## Key Patterns
- **आँख** (eye) idioms relate to love, pride, or awareness
- **नाक** (nose) idioms relate to honor and reputation
- **हाथ** (hand) idioms relate to control, skill, or helplessness
- **सिर** (head) idioms relate to responsibility or obsession`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m1",
    moduleTitle: "Idioms & Proverbs",
    order: 1,
    topicId: "hi-advanced-body-part-idioms",
    vocabulary: [
      {
        word: "आँखों का तारा",
        translation: "apple of one's eye (beloved)",
        pronunciation: "AAN-khon ka TAA-raa",
        exampleSentence: "वह अपने माता-पिता की आँखों का तारा है।",
        exampleTranslation: "He is the apple of his parents' eye.",
        partOfSpeech: "idiom",
      },
      {
        word: "नाक कटना",
        translation: "to be humiliated (lit. nose being cut)",
        pronunciation: "NAAK kat-naa",
        exampleSentence: "उसकी हरकतों से पूरे परिवार की नाक कट गई।",
        exampleTranslation: "His actions humiliated the entire family.",
        partOfSpeech: "idiom",
      },
      {
        word: "हाथ पर हाथ धरे बैठना",
        translation: "to sit idle (lit. hands placed on hands)",
        pronunciation: "HAATH par HAATH dha-re BAITH-naa",
        exampleSentence: "हाथ पर हाथ धरे बैठने से कुछ नहीं होगा।",
        exampleTranslation: "Nothing will happen by sitting idle.",
        partOfSpeech: "idiom",
      },
      {
        word: "सिर पर सवार होना",
        translation: "to be obsessed / to pester relentlessly",
        pronunciation: "SIR par sa-VAAR ho-naa",
        exampleSentence: "परीक्षा का डर उसके सिर पर सवार है।",
        exampleTranslation: "The fear of exams is weighing heavily on him.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "Idioms as Compound Verbs",
        explanation: "Most Hindi idioms function as compound verbs — a noun/body-part + a light verb (होना, करना, लगना). The idiom's meaning is non-compositional, so learn them as fixed units.",
        examples: [
          { correct: "नाक कटना (intransitive) vs नाक काटना (transitive)", translation: "to be humiliated vs to humiliate someone" },
          { correct: "आँखें खुलना vs आँखें खोलना", translation: "to become aware vs to make someone aware" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "idiom-conversation",
        title: "Using Idioms Naturally",
        situation: "You are chatting with a close friend about a mutual acquaintance who lost face publicly",
        agentRole: "You are a Hindi-speaking friend named Priya. Use body-part idioms naturally and encourage the student to respond with idioms too.",
        userGoal: "Use at least 3 body-part idioms correctly in conversation",
        targetPhrases: ["आँखों का तारा", "नाक कटना", "सिर पर सवार होना", "हाथ पर हाथ धरे बैठना"],
        successCriteria: ["Uses at least 3 idioms correctly", "Responds naturally to context", "Understands partner's idioms"],
      },
    ],
  },
  {
    id: "hi-advanced-l2",
    slug: "emotion-idioms",
    title: "Emotion & Action Idioms (भाव और क्रिया मुहावरे)",
    content: `# Emotion & Action Idioms — भाव और क्रिया मुहावरे

Beyond body parts, Hindi has rich idioms for emotions, actions, and states of being. These add color and authority to your speech.

## Common Patterns
- Fire/heat metaphors for anger: **आग बबूला होना**
- Water metaphors for calm: **पानी-पानी होना** (ashamed)
- Animal metaphors: **ऊँट के मुँह में जीरा** (too little for someone big)`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m1",
    moduleTitle: "Idioms & Proverbs",
    order: 2,
    topicId: "hi-advanced-emotion-idioms",
    vocabulary: [
      {
        word: "आग बबूला होना",
        translation: "to be furious (lit. become a fire whirlwind)",
        pronunciation: "AAG ba-BOO-laa ho-naa",
        exampleSentence: "बॉस रिपोर्ट देख कर आग बबूला हो गए।",
        exampleTranslation: "The boss became furious after seeing the report.",
        partOfSpeech: "idiom",
      },
      {
        word: "पानी-पानी होना",
        translation: "to be deeply ashamed (lit. become water-water)",
        pronunciation: "PAA-nee PAA-nee ho-naa",
        exampleSentence: "सच्चाई सामने आने पर वह पानी-पानी हो गई।",
        exampleTranslation: "She was deeply ashamed when the truth came out.",
        partOfSpeech: "idiom",
      },
      {
        word: "लोहे के चने चबाना",
        translation: "to face extreme difficulty (lit. chew iron chickpeas)",
        pronunciation: "LO-he ke CHA-ne cha-BAA-naa",
        exampleSentence: "यह परीक्षा पास करना लोहे के चने चबाना है।",
        exampleTranslation: "Passing this exam is extremely difficult.",
        partOfSpeech: "idiom",
      },
      {
        word: "नौ दो ग्यारह होना",
        translation: "to flee / run away (lit. nine-two-eleven)",
        pronunciation: "NAU do GYAA-rah ho-naa",
        exampleSentence: "पुलिस को देख कर चोर नौ दो ग्यारह हो गया।",
        exampleTranslation: "The thief fled upon seeing the police.",
        partOfSpeech: "idiom",
      },
    ],
    grammarPoints: [
      {
        title: "होना vs करना in Idiom Pairs",
        explanation: "Many idioms come in होना/करना pairs. होना makes the idiom intransitive (something happens to you), while करना makes it transitive (you do it to someone).",
        examples: [
          { correct: "पानी-पानी होना — I was ashamed", translation: "Intransitive: shame happened to me" },
          { correct: "पानी-पानी करना — She shamed him", translation: "Transitive: she caused shame" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "idiom-storytelling",
        title: "Telling a Story with Idioms",
        situation: "You are narrating a dramatic incident to a friend using colorful idioms",
        agentRole: "You are a Hindi-speaking colleague named Rahul. React dramatically and use idioms in your responses.",
        userGoal: "Narrate a short story using at least 3 emotion/action idioms",
        targetPhrases: ["आग बबूला होना", "नौ दो ग्यारह होना", "लोहे के चने चबाना"],
        successCriteria: ["Uses idioms in context", "Maintains narrative flow", "Reacts to partner's idioms"],
      },
    ],
  },
  {
    id: "hi-advanced-l3",
    slug: "proverbs-in-conversation",
    title: "Proverbs in Conversation (कहावतें बातचीत में)",
    content: `# Proverbs in Conversation — कहावतें बातचीत में

Hindi proverbs (कहावतें / लोकोक्तियाँ) carry cultural wisdom and add weight to arguments. Using them naturally marks you as an advanced speaker.

## Using Proverbs Effectively
- Introduce with: **कहावत है कि...** (there is a saying that...)
- Use to conclude an argument or give advice
- Match the proverb's register to the situation`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m1",
    moduleTitle: "Idioms & Proverbs",
    order: 3,
    topicId: "hi-advanced-proverbs-in-conversation",
    vocabulary: [
      {
        word: "जैसा बोओगे वैसा काटोगे",
        translation: "as you sow, so shall you reap",
        pronunciation: "JAI-saa bo-O-ge VAI-saa KAA-to-ge",
        exampleSentence: "मेहनत करो — जैसा बोओगे वैसा काटोगे।",
        exampleTranslation: "Work hard — as you sow, so shall you reap.",
        partOfSpeech: "proverb",
      },
      {
        word: "अधजल गगरी छलकत जाए",
        translation: "a half-filled pot spills the most (shallow people boast)",
        pronunciation: "adh-JAL gag-REE chhal-KAT jaa-ye",
        exampleSentence: "वो हमेशा अपनी तारीफ़ करता है — अधजल गगरी छलकत जाए।",
        exampleTranslation: "He always praises himself — a half-filled pot spills the most.",
        partOfSpeech: "proverb",
      },
      {
        word: "बंदर क्या जाने अदरक का स्वाद",
        translation: "what does a monkey know of ginger's taste (pearls before swine)",
        pronunciation: "BAN-dar kyaa JAA-ne ad-RAK ka SVAAD",
        exampleSentence: "उसे शास्त्रीय संगीत नहीं समझ आता — बंदर क्या जाने अदरक का स्वाद।",
        exampleTranslation: "He doesn't understand classical music — pearls before swine.",
        partOfSpeech: "proverb",
      },
      {
        word: "दूर के ढोल सुहावने लगते हैं",
        translation: "distant drums sound pleasant (the grass is greener on the other side)",
        pronunciation: "DOOR ke DHOL su-HAAV-ne lag-te hain",
        exampleSentence: "विदेश जाना इतना आसान नहीं — दूर के ढोल सुहावने लगते हैं।",
        exampleTranslation: "Going abroad isn't that easy — the grass is always greener.",
        partOfSpeech: "proverb",
      },
    ],
    grammarPoints: [
      {
        title: "Subjunctive in Proverbs",
        explanation: "Many proverbs use the subjunctive mood (e.g., बोओगे, काटोगे). This conditional/future subjunctive form gives proverbs their universal, timeless quality.",
        examples: [
          { correct: "जैसा बोओगे वैसा काटोगे", translation: "As you (will) sow, so you (will) reap — subjunctive future" },
          { correct: "जो गरजते हैं वो बरसते नहीं", translation: "Those who thunder don't rain — habitual present for universal truth" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "proverb-advice",
        title: "Giving Advice with Proverbs",
        situation: "A friend is complaining about wanting to move abroad. You offer wisdom using proverbs.",
        agentRole: "You are a friend named Anita who is unhappy with life in India and wants to move to Canada. Respond to the student's proverb-laden advice.",
        userGoal: "Use at least 2 proverbs naturally while giving advice",
        targetPhrases: ["दूर के ढोल सुहावने लगते हैं", "जैसा बोओगे वैसा काटोगे"],
        successCriteria: ["Uses proverbs in context", "Advice sounds natural", "Responds to friend's objections"],
      },
    ],
  },
];

// ============================================
// Module 2: Literary Hindi
// ============================================

const module2Lessons: LanguageLesson[] = [
  {
    id: "hi-advanced-l4",
    slug: "tatsama-tadbhava",
    title: "Tatsama vs Tadbhava (तत्सम और तद्भव)",
    content: `# Tatsama vs Tadbhava — तत्सम और तद्भव

Hindi vocabulary has two main etymological layers:
- **तत्सम (Tatsama)** — words borrowed directly from Sanskrit, unchanged (e.g., अग्नि, नेत्र, पुस्तक)
- **तद्भव (Tadbhava)** — words evolved from Sanskrit through Prakrit (e.g., आग, आँख, पोथी)

Formal/literary Hindi prefers Tatsama words; spoken Hindi uses Tadbhava. Mastering both registers is essential at C1.`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m2",
    moduleTitle: "Literary Hindi",
    order: 1,
    topicId: "hi-advanced-tatsama-tadbhava",
    vocabulary: [
      {
        word: "अग्नि / आग",
        translation: "fire (Tatsama / Tadbhava)",
        pronunciation: "AG-ni / AAG",
        exampleSentence: "अग्निशमन दल ने आग पर काबू पाया।",
        exampleTranslation: "The fire brigade brought the fire under control.",
        partOfSpeech: "noun",
      },
      {
        word: "नेत्र / आँख",
        translation: "eye (Tatsama / Tadbhava)",
        pronunciation: "NE-tra / AANKH",
        exampleSentence: "नेत्र चिकित्सक से आँखों की जाँच कराएँ।",
        exampleTranslation: "Get your eyes checked by an ophthalmologist.",
        partOfSpeech: "noun",
      },
      {
        word: "वायु / हवा",
        translation: "air/wind (Tatsama / Tadbhava)",
        pronunciation: "VAA-yu / ha-VAA",
        exampleSentence: "वायु प्रदूषण से हवा में साँस लेना मुश्किल है।",
        exampleTranslation: "Air pollution makes it hard to breathe in the air.",
        partOfSpeech: "noun",
      },
      {
        word: "कार्य / काम",
        translation: "work (Tatsama / Tadbhava)",
        pronunciation: "KAAR-ya / KAAM",
        exampleSentence: "कार्यालय में काम बहुत है।",
        exampleTranslation: "There is a lot of work in the office.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Register Switching with Tatsama/Tadbhava",
        explanation: "Use Tatsama words for formal writing, news, and official speech. Use Tadbhava for casual conversation. Mixing registers signals either formality shifts or education level.",
        examples: [
          { correct: "कृपया अपना कार्य पूर्ण करें (formal)", translation: "Please complete your work" },
          { correct: "यार, अपना काम ख़त्म कर (informal)", translation: "Dude, finish your work" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "register-switching",
        title: "Switching Registers",
        situation: "You are writing a formal complaint letter, then explaining it casually to a friend",
        agentRole: "You are a friend named Vikram. First ask to hear the formal letter, then ask for a casual summary. Point out register mismatches.",
        userGoal: "Express the same idea in both Tatsama-heavy formal Hindi and Tadbhava-heavy casual Hindi",
        targetPhrases: ["कृपया", "कार्यालय", "अग्नि", "वायु प्रदूषण"],
        successCriteria: ["Uses Tatsama words in formal context", "Switches to Tadbhava in casual speech", "Demonstrates awareness of register"],
      },
    ],
  },
  {
    id: "hi-advanced-l5",
    slug: "hindi-urdu-spectrum",
    title: "The Hindi-Urdu Spectrum (हिंदी-उर्दू का स्पेक्ट्रम)",
    content: `# The Hindi-Urdu Spectrum — हिंदी-उर्दू का स्पेक्ट्रम

Hindi and Urdu share a common spoken base (Hindustani) but diverge in formal vocabulary:
- **शुद्ध हिंदी** draws from Sanskrit (Tatsama)
- **उर्दू** draws from Persian and Arabic
- Everyday speech (बोलचाल) freely mixes both

Understanding this spectrum lets you comprehend Bollywood lyrics, Urdu poetry, and formal Hindi literature alike.`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m2",
    moduleTitle: "Literary Hindi",
    order: 2,
    topicId: "hi-advanced-hindi-urdu-spectrum",
    vocabulary: [
      {
        word: "इंतज़ार / प्रतीक्षा",
        translation: "waiting (Urdu / Hindi)",
        pronunciation: "in-ta-ZAAR / pra-TEEK-shaa",
        exampleSentence: "मैं आपकी प्रतीक्षा में हूँ — कब तक इंतज़ार कराओगे?",
        exampleTranslation: "I am waiting for you — how long will you make me wait?",
        partOfSpeech: "noun",
      },
      {
        word: "ख़ूबसूरत / सुंदर",
        translation: "beautiful (Urdu / Hindi)",
        pronunciation: "khoob-SOO-rat / SUN-dar",
        exampleSentence: "कितनी ख़ूबसूरत शाम है — प्रकृति कितनी सुंदर है।",
        exampleTranslation: "What a beautiful evening — nature is so beautiful.",
        partOfSpeech: "adjective",
      },
      {
        word: "दिल / हृदय",
        translation: "heart (Urdu / Hindi)",
        pronunciation: "DIL / hri-DAY",
        exampleSentence: "दिल से कहो या हृदय से — बात एक ही है।",
        exampleTranslation: "Say it from the dil or the hriday — it's the same thing.",
        partOfSpeech: "noun",
      },
      {
        word: "ज़िंदगी / जीवन",
        translation: "life (Urdu / Hindi)",
        pronunciation: "ZIN-da-gee / JEE-van",
        exampleSentence: "ज़िंदगी बहुत छोटी है — जीवन का आनंद लो।",
        exampleTranslation: "Life is very short — enjoy life.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Persian-Origin Constructions",
        explanation: "Urdu-origin words often use Persian grammar patterns: ख़ + noun compounds (ख़ुशबू, ख़ूबसूरत) and बे- prefix for negation (बेवकूफ़, बेचारा). These are fully integrated into colloquial Hindi.",
        examples: [
          { correct: "बेइज़्ज़ती — dishonor (बे + इज़्ज़त)", translation: "Persian negation prefix" },
          { correct: "ख़ुशमिज़ाज — pleasant-natured (ख़ुश + मिज़ाज)", translation: "Persian compound adjective" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "bollywood-lyrics",
        title: "Understanding Bollywood Lyrics",
        situation: "Discussing the meaning of a Bollywood song that mixes Hindi and Urdu vocabulary",
        agentRole: "You are a music-loving friend named Zoya. Discuss song lyrics and ask the student to identify which words are Urdu-origin vs Sanskrit-origin.",
        userGoal: "Identify Urdu vs Hindi vocabulary in mixed text and explain nuances",
        targetPhrases: ["इंतज़ार", "दिल", "ज़िंदगी", "ख़ूबसूरत"],
        successCriteria: ["Correctly identifies word origins", "Explains nuance differences", "Uses both registers"],
      },
    ],
  },
  {
    id: "hi-advanced-l6",
    slug: "premchand-kabir",
    title: "Premchand & Kabir (प्रेमचंद और कबीर)",
    content: `# Premchand & Kabir — प्रेमचंद और कबीर

Two pillars of Hindi literature:
- **मुंशी प्रेमचंद** (1880-1936): Father of Hindi fiction. His stories depict rural India, caste, poverty, and moral dilemmas in accessible prose.
- **कबीर** (15th century): Mystic poet-saint whose दोहे (couplets) blend Hindi, Avadhi, and Braj. His verses challenge dogma and celebrate inner truth.

Reading these authors builds literary vocabulary and cultural depth.`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m2",
    moduleTitle: "Literary Hindi",
    order: 3,
    topicId: "hi-advanced-premchand-kabir",
    vocabulary: [
      {
        word: "दोहा",
        translation: "couplet (a two-line verse form)",
        pronunciation: "DO-haa",
        exampleSentence: "कबीर के दोहे आज भी प्रासंगिक हैं।",
        exampleTranslation: "Kabir's couplets are still relevant today.",
        partOfSpeech: "noun",
      },
      {
        word: "व्यंग्य",
        translation: "satire / sarcasm",
        pronunciation: "VYANG-gya",
        exampleSentence: "प्रेमचंद की कहानियों में सामाजिक व्यंग्य मिलता है।",
        exampleTranslation: "Social satire is found in Premchand's stories.",
        partOfSpeech: "noun",
      },
      {
        word: "पाखंड",
        translation: "hypocrisy / pretense",
        pronunciation: "PAA-khand",
        exampleSentence: "कबीर ने धार्मिक पाखंड का विरोध किया।",
        exampleTranslation: "Kabir opposed religious hypocrisy.",
        partOfSpeech: "noun",
      },
      {
        word: "यथार्थवाद",
        translation: "realism (literary movement)",
        pronunciation: "ya-THAARTH-vaad",
        exampleSentence: "प्रेमचंद हिंदी यथार्थवाद के जनक माने जाते हैं।",
        exampleTranslation: "Premchand is considered the father of Hindi realism.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Archaic Literary Forms",
        explanation: "Kabir's poetry uses old Avadhi/Braj forms: मोको (मुझको), तोको (तुझको), कहे (कहता है). Recognizing these forms is key to reading pre-modern Hindi literature.",
        examples: [
          { correct: "मोको कहाँ ढूँढे रे बंदे (Kabir)", translation: "Where do you search for me, O seeker — मोको = मुझको" },
          { correct: "साईं इतना दीजिए (Kabir)", translation: "O Lord, give me just this much — साईं = स्वामी (lord)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "literary-discussion",
        title: "Discussing Hindi Literature",
        situation: "You are in a book club discussing Premchand's 'Idgah' and a Kabir doha",
        agentRole: "You are a literature professor named Dr. Sharma. Discuss themes, ask for interpretations, and introduce relevant literary vocabulary.",
        userGoal: "Discuss a literary work using appropriate vocabulary and offer personal interpretation",
        targetPhrases: ["यथार्थवाद", "व्यंग्य", "पाखंड", "दोहा"],
        successCriteria: ["Uses literary vocabulary correctly", "Offers interpretation of text", "Engages in critical discussion"],
      },
    ],
  },
];

// ============================================
// Module 3: Debate & Persuasion
// ============================================

const module3Lessons: LanguageLesson[] = [
  {
    id: "hi-advanced-l7",
    slug: "complex-arguments",
    title: "Building Complex Arguments (जटिल तर्क)",
    content: `# Building Complex Arguments — जटिल तर्क

At C1 level, you need to construct multi-layered arguments in Hindi. This means using logical connectors, concession phrases, and evidence-based reasoning.

## Argument Structure
1. **दावा** (claim) — state your position
2. **तर्क** (reasoning) — support with logic
3. **प्रमाण** (evidence) — cite facts or examples
4. **प्रतिवाद** (counterargument) — acknowledge the other side
5. **निष्कर्ष** (conclusion) — summarize your stance`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m3",
    moduleTitle: "Debate & Persuasion",
    order: 1,
    topicId: "hi-advanced-complex-arguments",
    vocabulary: [
      {
        word: "इसके बावजूद",
        translation: "despite this / nevertheless",
        pronunciation: "IS-ke baa-va-JOOD",
        exampleSentence: "आँकड़े कमज़ोर हैं, इसके बावजूद नीति सही दिशा में है।",
        exampleTranslation: "The data is weak; nevertheless, the policy is in the right direction.",
        partOfSpeech: "conjunction",
      },
      {
        word: "प्रतिवाद",
        translation: "counterargument / rebuttal",
        pronunciation: "pra-ti-VAAD",
        exampleSentence: "आपके प्रतिवाद में दम नहीं है।",
        exampleTranslation: "Your counterargument has no substance.",
        partOfSpeech: "noun",
      },
      {
        word: "यह मानते हुए कि",
        translation: "granted that / conceding that",
        pronunciation: "yeh MAAN-te hu-e ki",
        exampleSentence: "यह मानते हुए कि ख़र्चा ज़्यादा है, फिर भी फ़ायदा होगा।",
        exampleTranslation: "Granted that the cost is high, there will still be benefit.",
        partOfSpeech: "phrase",
      },
      {
        word: "निष्कर्ष निकालना",
        translation: "to draw a conclusion",
        pronunciation: "nish-KARSH ni-KAAL-naa",
        exampleSentence: "इन तथ्यों से यही निष्कर्ष निकलता है।",
        exampleTranslation: "The conclusion drawn from these facts is this.",
        partOfSpeech: "verb phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Concession Constructions",
        explanation: "Hindi marks concessions with भले ही...फिर भी, चाहे...लेकिन, and यह मानते हुए कि. These let you acknowledge an opposing point before reinforcing your own.",
        examples: [
          { correct: "भले ही यह महँगा है, फिर भी ज़रूरी है।", translation: "Even though it's expensive, it's still necessary." },
          { correct: "चाहे कुछ भी हो, मैं अपनी बात पर कायम हूँ।", translation: "No matter what, I stand by my point." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "debate-practice",
        title: "Structured Debate",
        situation: "You are debating whether social media is harmful for youth",
        agentRole: "You are a debate partner named Arun who argues the opposing side. Challenge the student's points and demand evidence.",
        userGoal: "Build a structured argument with claim, evidence, and counterargument",
        targetPhrases: ["इसके बावजूद", "यह मानते हुए कि", "निष्कर्ष निकालना"],
        successCriteria: ["Presents a clear claim", "Supports with reasoning", "Addresses counterarguments"],
      },
    ],
  },
  {
    id: "hi-advanced-l8",
    slug: "persuasive-language",
    title: "Persuasive Language (प्रभावशाली भाषा)",
    content: `# Persuasive Language — प्रभावशाली भाषा

Persuasion in Hindi uses rhetorical questions, emotional appeals, and authority references. This lesson covers techniques for speeches, opinion pieces, and negotiations.

## Key Techniques
- **अलंकारिक प्रश्न** (rhetorical questions): क्या यह उचित है?
- **भावनात्मक अपील** (emotional appeal): सोचिए उन बच्चों का क्या होगा
- **प्राधिकार संदर्भ** (authority reference): विशेषज्ञों के अनुसार...`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m3",
    moduleTitle: "Debate & Persuasion",
    order: 2,
    topicId: "hi-advanced-persuasive-language",
    vocabulary: [
      {
        word: "क्या यह उचित है?",
        translation: "Is this justified? (rhetorical)",
        pronunciation: "kyaa yeh U-chit hai",
        exampleSentence: "इतनी महँगाई में गरीबों का क्या होगा — क्या यह उचित है?",
        exampleTranslation: "What will happen to the poor in such inflation — is this justified?",
        partOfSpeech: "phrase",
      },
      {
        word: "विशेषज्ञों के अनुसार",
        translation: "according to experts",
        pronunciation: "vi-SHESH-gyon ke anu-SAAR",
        exampleSentence: "विशेषज्ञों के अनुसार यह नीति असफल रहेगी।",
        exampleTranslation: "According to experts, this policy will fail.",
        partOfSpeech: "phrase",
      },
      {
        word: "आँकड़े बताते हैं कि",
        translation: "the data shows that",
        pronunciation: "AAN-ka-de ba-TAA-te hain ki",
        exampleSentence: "आँकड़े बताते हैं कि बेरोज़गारी बढ़ रही है।",
        exampleTranslation: "The data shows that unemployment is rising.",
        partOfSpeech: "phrase",
      },
      {
        word: "सोचने पर मजबूर करना",
        translation: "to compel (someone) to think",
        pronunciation: "SOCH-ne par maj-BOOR kar-naa",
        exampleSentence: "यह घटना हमें सोचने पर मजबूर करती है।",
        exampleTranslation: "This incident compels us to think.",
        partOfSpeech: "verb phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Rhetorical Questions with क्या and कहाँ",
        explanation: "Hindi rhetorical questions use क्या (is it?) and कहाँ (where?) to make emphatic statements disguised as questions. कहाँ can mean 'not at all' rhetorically.",
        examples: [
          { correct: "कहाँ राजा भोज, कहाँ गंगू तेली", translation: "Where is King Bhoj, where is Gangu the oilman — (i.e., no comparison)" },
          { correct: "क्या ज़माना आ गया है!", translation: "What times have come! — rhetorical exclamation" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "persuasive-speech",
        title: "Persuasive Speech",
        situation: "You are giving a short speech arguing for better public transport in your city",
        agentRole: "You are an audience member named Meena who asks tough questions and needs convincing.",
        userGoal: "Deliver a persuasive mini-speech using rhetorical devices and data references",
        targetPhrases: ["क्या यह उचित है?", "आँकड़े बताते हैं कि", "विशेषज्ञों के अनुसार"],
        successCriteria: ["Uses rhetorical questions", "Cites data or authority", "Maintains persuasive tone"],
      },
    ],
  },
  {
    id: "hi-advanced-l9",
    slug: "humor-sarcasm",
    title: "Humor & Sarcasm (हास्य और व्यंग्य)",
    content: `# Humor & Sarcasm — हास्य और व्यंग्य

Hindi humor ranges from gentle wordplay to biting sarcasm. Understanding and using it marks true fluency.

## Types of Hindi Humor
- **श्लेष** (pun / double meaning): exploiting word ambiguity
- **व्यंग्य** (sarcasm): saying the opposite of what you mean
- **अतिशयोक्ति** (hyperbole): exaggeration for effect
- **विडंबना** (irony): situational contradiction`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m3",
    moduleTitle: "Debate & Persuasion",
    order: 3,
    topicId: "hi-advanced-humor-sarcasm",
    vocabulary: [
      {
        word: "वाह, क्या बात है!",
        translation: "wow, how wonderful! (often sarcastic)",
        pronunciation: "VAAH kyaa BAAT hai",
        exampleSentence: "फिर देर से आए — वाह, क्या बात है!",
        exampleTranslation: "Late again — wow, how wonderful!",
        partOfSpeech: "exclamation",
      },
      {
        word: "बड़े आए!",
        translation: "who do you think you are! (dismissive)",
        pronunciation: "ba-DE aa-YE",
        exampleSentence: "मुझे सिखाओगे? बड़े आए!",
        exampleTranslation: "You'll teach me? Who do you think you are!",
        partOfSpeech: "exclamation",
      },
      {
        word: "अतिशयोक्ति",
        translation: "hyperbole / exaggeration",
        pronunciation: "a-ti-sha-YOK-ti",
        exampleSentence: "यह कहना अतिशयोक्ति होगी कि सब ख़त्म हो गया।",
        exampleTranslation: "It would be an exaggeration to say everything is over.",
        partOfSpeech: "noun",
      },
      {
        word: "ताना मारना",
        translation: "to taunt / take a dig at",
        pronunciation: "TAA-naa MAAR-naa",
        exampleSentence: "वो हमेशा ताना मारती रहती है।",
        exampleTranslation: "She always keeps taunting.",
        partOfSpeech: "verb phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Sarcastic Intonation Markers",
        explanation: "Hindi sarcasm relies on intonation plus particles like ही, भी, and तो. Written sarcasm uses exclamations (वाह!, बड़े!) and exaggerated politeness (आप तो बहुत समझदार हैं!).",
        examples: [
          { correct: "आप तो बहुत समझदार हैं! (sarcastic)", translation: "You are so wise! — meaning the opposite" },
          { correct: "और करो मेहनत! (ironic)", translation: "Keep working hard! — when someone is being lazy" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "sarcasm-banter",
        title: "Friendly Banter",
        situation: "You and a friend are teasing each other about bad decisions in a lighthearted way",
        agentRole: "You are a sarcastic friend named Karan. Use taunts and sarcasm playfully. See if the student can match your wit.",
        userGoal: "Respond to sarcasm with appropriate humor and use Hindi sarcastic expressions",
        targetPhrases: ["वाह, क्या बात है!", "बड़े आए!", "ताना मारना"],
        successCriteria: ["Recognizes sarcasm", "Responds with appropriate humor", "Uses sarcastic expressions correctly"],
      },
    ],
  },
];

// ============================================
// Module 4: Regional Dialects
// ============================================

const module4Lessons: LanguageLesson[] = [
  {
    id: "hi-advanced-l10",
    slug: "braj-awadhi",
    title: "Braj & Awadhi (ब्रज और अवधी)",
    content: `# Braj & Awadhi — ब्रज और अवधी

These two historical dialects form the literary backbone of Hindi:
- **ब्रज भाषा**: Language of Krishna poetry (Surdas, Ashtachap poets). Spoken in Mathura-Vrindavan region.
- **अवधी**: Language of Tulsidas's Ramcharitmanas and Kabir's verses. Spoken in Lucknow-Faizabad region.

Both are still spoken today and heavily influence standard Hindi vocabulary and expressions.`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m4",
    moduleTitle: "Regional Dialects",
    order: 1,
    topicId: "hi-advanced-braj-awadhi",
    vocabulary: [
      {
        word: "मोसे (Braj/Awadhi)",
        translation: "from me / with me (= मुझसे)",
        pronunciation: "MO-se",
        exampleSentence: "मोसे नंद के छैला — ब्रज गीत",
        exampleTranslation: "With me, Nanda's darling boy — Braj song",
        partOfSpeech: "pronoun",
      },
      {
        word: "काहे (Awadhi)",
        translation: "why (= क्यों)",
        pronunciation: "KAA-he",
        exampleSentence: "काहे को ब्याही बिदेस — लोकगीत",
        exampleTranslation: "Why was I married off to a foreign land — folk song",
        partOfSpeech: "adverb",
      },
      {
        word: "निकसी (Braj)",
        translation: "came out (= निकली)",
        pronunciation: "nik-SEE",
        exampleSentence: "राधा गली-गली निकसी।",
        exampleTranslation: "Radha came out through the lanes.",
        partOfSpeech: "verb",
      },
      {
        word: "हमार / तुम्हार (Awadhi)",
        translation: "my / your (= हमारा / तुम्हारा)",
        pronunciation: "ha-MAAR / tum-HAAR",
        exampleSentence: "हमार गाँव बहुत सुंदर है।",
        exampleTranslation: "My village is very beautiful.",
        partOfSpeech: "pronoun",
      },
    ],
    grammarPoints: [
      {
        title: "Dialect Verb Endings",
        explanation: "Braj/Awadhi use -ई/-ऐ instead of standard -ई/-ए (e.g., करई = करे, जाई = जाए). Recognizing these endings unlocks classical poetry and folk songs.",
        examples: [
          { correct: "सूर के पद: मैया मोरी मैं नहीं माखन खायो", translation: "Surdas: Mother, I didn't eat the butter — मोरी = मेरी" },
          { correct: "तुलसी: मंगल भवन अमंगल हारी", translation: "Tulsidas: The auspicious dwelling, destroyer of evil" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "folk-song-discussion",
        title: "Understanding Folk Songs",
        situation: "You are listening to a Braj/Awadhi folk song and discussing its meaning",
        agentRole: "You are a folk music enthusiast named Kamla from Mathura. Sing lines from Braj songs and ask the student to interpret them in standard Hindi.",
        userGoal: "Interpret Braj/Awadhi expressions and translate them to standard Hindi",
        targetPhrases: ["मोसे", "काहे", "हमार"],
        successCriteria: ["Identifies dialect words", "Translates to standard Hindi", "Appreciates literary context"],
      },
    ],
  },
  {
    id: "hi-advanced-l11",
    slug: "bhojpuri-mumbai",
    title: "Bhojpuri & Mumbai Hindi (भोजपुरी और मुंबई हिंदी)",
    content: `# Bhojpuri & Mumbai Hindi — भोजपुरी और मुंबई हिंदी

Two modern dialect varieties every advanced speaker should understand:
- **भोजपुरी**: Spoken in eastern UP and Bihar. Known for distinct verb forms, nasalization, and Bollywood music influence.
- **मुंबई हिंदी (बंबइया)**: A pidgin-influenced variety mixing Hindi, Marathi, and English. Language of Bollywood dialogues and street culture.`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m4",
    moduleTitle: "Regional Dialects",
    order: 2,
    topicId: "hi-advanced-bhojpuri-mumbai",
    vocabulary: [
      {
        word: "का हो (Bhojpuri)",
        translation: "what's up / what is it? (= क्या हुआ)",
        pronunciation: "KAA ho",
        exampleSentence: "का हो भैया, कहाँ चलल बाड़?",
        exampleTranslation: "What's up brother, where are you going?",
        partOfSpeech: "phrase",
      },
      {
        word: "बोले तो (Mumbai Hindi)",
        translation: "meaning / that is to say (= यानी)",
        pronunciation: "BO-le to",
        exampleSentence: "बोले तो, अपुन को वो काम नहीं करना है।",
        exampleTranslation: "Meaning, I don't want to do that work.",
        partOfSpeech: "phrase",
      },
      {
        word: "अपुन (Mumbai Hindi)",
        translation: "I / me (= मैं / हम)",
        pronunciation: "a-PUN",
        exampleSentence: "अपुन का स्टाइल ही अलग है।",
        exampleTranslation: "My style is just different.",
        partOfSpeech: "pronoun",
      },
      {
        word: "रउवा (Bhojpuri)",
        translation: "you (respectful) (= आप)",
        pronunciation: "RAU-vaa",
        exampleSentence: "रउवा कइसे बानी?",
        exampleTranslation: "How are you? (respectful Bhojpuri)",
        partOfSpeech: "pronoun",
      },
    ],
    grammarPoints: [
      {
        title: "Mumbai Hindi Simplifications",
        explanation: "Mumbai Hindi drops gender agreement and simplifies verb forms: मेरेको (= मुझे), तेरेको (= तुझे), करेला (= करता है). It uses को universally instead of case-specific postpositions.",
        examples: [
          { correct: "मेरेको भूक लगा है (Mumbai)", translation: "I'm hungry — standard: मुझे भूख लगी है (gender ignored)" },
          { correct: "तू काम करेला? (Mumbai)", translation: "Do you work? — standard: तू काम करता है?" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "dialect-comprehension",
        title: "Understanding Dialect Speakers",
        situation: "You meet two people — one speaks Bhojpuri-influenced Hindi, the other Mumbai Hindi. You need to understand both.",
        agentRole: "You are Munna from Mumbai. Speak in Bambaiya Hindi and see if the student understands. Switch to Bhojpuri-influenced Hindi partway through.",
        userGoal: "Comprehend and respond to both Bhojpuri and Mumbai Hindi speakers",
        targetPhrases: ["बोले तो", "अपुन", "का हो"],
        successCriteria: ["Understands dialect expressions", "Responds appropriately", "Can paraphrase in standard Hindi"],
      },
    ],
  },
  {
    id: "hi-advanced-l12",
    slug: "accent-comprehension",
    title: "Accent Comprehension (उच्चारण समझ)",
    content: `# Accent Comprehension — उच्चारण समझ

Hindi is spoken with vastly different accents across India. At C1 level, you should comprehend:
- **Southern Hindi**: Retroflex-heavy, different rhythm, Dravidian influence
- **Punjabi Hindi**: Tonal influence, gemination, ਕ/ख confusion
- **Bengali Hindi**: Sibilant merging (श/ष/स → श), व→ब substitution
- **Bihari Hindi**: Nasalization, distinct intonation contours

Training your ear for these accents is essential for real-world communication.`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m4",
    moduleTitle: "Regional Dialects",
    order: 3,
    topicId: "hi-advanced-accent-comprehension",
    vocabulary: [
      {
        word: "उच्चारण",
        translation: "pronunciation / accent",
        pronunciation: "uch-CHAA-ran",
        exampleSentence: "हर प्रदेश का उच्चारण अलग होता है।",
        exampleTranslation: "Every state has a different accent.",
        partOfSpeech: "noun",
      },
      {
        word: "बोली",
        translation: "dialect / spoken variety",
        pronunciation: "BO-lee",
        exampleSentence: "हिंदी में कई बोलियाँ हैं।",
        exampleTranslation: "Hindi has many dialects.",
        partOfSpeech: "noun",
      },
      {
        word: "लहजा",
        translation: "tone / accent / manner of speaking",
        pronunciation: "leh-JA",
        exampleSentence: "उनके लहजे से लगता है वे पंजाब से हैं।",
        exampleTranslation: "From their accent, it seems they are from Punjab.",
        partOfSpeech: "noun",
      },
      {
        word: "भाषाई विविधता",
        translation: "linguistic diversity",
        pronunciation: "bhaa-SHAA-ee vi-vidh-TAA",
        exampleSentence: "भारत की भाषाई विविधता अद्भुत है।",
        exampleTranslation: "India's linguistic diversity is remarkable.",
        partOfSpeech: "noun phrase",
      },
    ],
    grammarPoints: [
      {
        title: "Regional Grammar Variations",
        explanation: "Regional accents come with grammar shifts: Punjabi Hindi adds ओ to plurals (लड़कियो), Bengali Hindi drops aspirates (घर→गर), and Southern Hindi regularizes gender agreement.",
        examples: [
          { correct: "Standard: वह जा रहा है → Bihari: ऊ जात बा", translation: "He is going — regional verb form" },
          { correct: "Standard: मैंने खाना खाया → Punjabi: मैं खाना खाया", translation: "I ate food — dropping ने in Punjabi Hindi" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "accent-listening",
        title: "Accent Identification",
        situation: "You are at a national conference and hear Hindi spoken with different regional accents",
        agentRole: "You are a conference attendee who speaks Hindi with a mix of regional influences. Switch accents and ask the student to identify where you might be from.",
        userGoal: "Identify regional accent features and understand varied Hindi pronunciations",
        targetPhrases: ["उच्चारण", "बोली", "लहजा", "भाषाई विविधता"],
        successCriteria: ["Identifies accent features", "Understands despite accent variations", "Uses appropriate vocabulary to discuss accents"],
      },
    ],
  },
];

// ============================================
// Module 5: Business Hindi
// ============================================

const module5Lessons: LanguageLesson[] = [
  {
    id: "hi-advanced-l13",
    slug: "corporate-vocab",
    title: "Corporate Vocabulary (कॉर्पोरेट शब्दावली)",
    content: `# Corporate Vocabulary — कॉर्पोरेट शब्दावली

Modern Indian workplaces mix Hindi and English freely (Hinglish), but formal business communication — government tenders, official letters, bank documents — demands शुद्ध हिंदी.

## Key Domains
- **वित्तीय** (financial): बजट, लाभांश, निवेश
- **प्रशासनिक** (administrative): अनुमोदन, कार्यवाही, अधिसूचना
- **मानव संसाधन** (HR): नियुक्ति, पदोन्नति, वेतन`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m5",
    moduleTitle: "Business Hindi",
    order: 1,
    topicId: "hi-advanced-corporate-vocab",
    vocabulary: [
      {
        word: "अनुमोदन",
        translation: "approval / endorsement",
        pronunciation: "anu-MO-dan",
        exampleSentence: "प्रबंधक का अनुमोदन मिलने पर ही कार्य शुरू होगा।",
        exampleTranslation: "Work will begin only after the manager's approval.",
        partOfSpeech: "noun",
      },
      {
        word: "कार्यवाही",
        translation: "proceedings / action taken",
        pronunciation: "kaar-ya-VAA-hee",
        exampleSentence: "बैठक की कार्यवाही का विवरण भेजें।",
        exampleTranslation: "Send the minutes of the meeting proceedings.",
        partOfSpeech: "noun",
      },
      {
        word: "निवेश",
        translation: "investment",
        pronunciation: "ni-VESH",
        exampleSentence: "विदेशी निवेश में इस साल वृद्धि हुई है।",
        exampleTranslation: "Foreign investment has increased this year.",
        partOfSpeech: "noun",
      },
      {
        word: "पदोन्नति",
        translation: "promotion (job)",
        pronunciation: "pad-ON-na-ti",
        exampleSentence: "उन्हें उप-निदेशक पद पर पदोन्नति मिली।",
        exampleTranslation: "They received a promotion to the post of Deputy Director.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Official Hindi Honorifics",
        explanation: "Business Hindi uses महोदय/महोदया (Sir/Madam), सादर (respectfully), and कृपया (kindly). Letters end with भवदीय (yours faithfully, male) or भवदीया (female).",
        examples: [
          { correct: "महोदय, कृपया मेरा आवेदन स्वीकार करें।", translation: "Sir, kindly accept my application." },
          { correct: "सादर निवेदन है कि...", translation: "It is respectfully submitted that..." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "business-email",
        title: "Drafting a Formal Request",
        situation: "You need to write and present a formal request letter in Hindi to your department head",
        agentRole: "You are the department head, Shri Verma. Evaluate the student's formal Hindi and point out where Hinglish crept in.",
        userGoal: "Compose and present a formal business request using proper official Hindi",
        targetPhrases: ["अनुमोदन", "कार्यवाही", "सादर निवेदन है कि"],
        successCriteria: ["Uses formal Hindi vocabulary", "Avoids English substitutes", "Maintains official register"],
      },
    ],
  },
  {
    id: "hi-advanced-l14",
    slug: "presentations-negotiations",
    title: "Presentations & Negotiations (प्रस्तुति और वार्ता)",
    content: `# Presentations & Negotiations — प्रस्तुति और वार्ता

Delivering presentations and negotiating deals in Hindi requires specific vocabulary and speech patterns that differ from casual conversation.

## Presentation Phrases
- Opening: आज मैं आपके समक्ष... प्रस्तुत करना चाहता/चाहती हूँ
- Transition: अब अगले बिंदु पर आते हैं
- Closing: धन्यवाद, कोई प्रश्न?

## Negotiation Phrases
- Proposing: हमारा प्रस्ताव यह है कि...
- Countering: यह स्वीकार्य नहीं है, लेकिन...
- Agreeing: हम इस शर्त पर सहमत हैं`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m5",
    moduleTitle: "Business Hindi",
    order: 2,
    topicId: "hi-advanced-presentations-negotiations",
    vocabulary: [
      {
        word: "प्रस्ताव",
        translation: "proposal / offer",
        pronunciation: "pra-STAAV",
        exampleSentence: "हमारा प्रस्ताव दोनों पक्षों के लिए लाभकारी है।",
        exampleTranslation: "Our proposal is beneficial for both parties.",
        partOfSpeech: "noun",
      },
      {
        word: "शर्त / शर्तें",
        translation: "condition(s) / term(s)",
        pronunciation: "SHART / SHAR-tein",
        exampleSentence: "इन शर्तों पर हम सहमत हैं।",
        exampleTranslation: "We agree to these terms.",
        partOfSpeech: "noun",
      },
      {
        word: "समक्ष",
        translation: "before / in front of (formal)",
        pronunciation: "sam-AKSH",
        exampleSentence: "मैं आपके समक्ष यह योजना प्रस्तुत करता हूँ।",
        exampleTranslation: "I present this plan before you.",
        partOfSpeech: "postposition",
      },
      {
        word: "स्वीकार्य",
        translation: "acceptable / admissible",
        pronunciation: "svee-KAAR-ya",
        exampleSentence: "यह प्रस्ताव हमें स्वीकार्य नहीं है।",
        exampleTranslation: "This proposal is not acceptable to us.",
        partOfSpeech: "adjective",
      },
    ],
    grammarPoints: [
      {
        title: "Formal Passive Constructions",
        explanation: "Business Hindi heavily uses passive voice: किया जाएगा (will be done), प्रस्तुत किया गया (was presented), विचार किया जाएगा (will be considered). This adds impersonality and formality.",
        examples: [
          { correct: "यह प्रस्ताव विचाराधीन है।", translation: "This proposal is under consideration." },
          { correct: "निर्णय शीघ्र लिया जाएगा।", translation: "A decision will be taken shortly." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "negotiation-roleplay",
        title: "Business Negotiation",
        situation: "You are negotiating a partnership deal with a Hindi-speaking company",
        agentRole: "You are a shrewd business partner named Saxena ji. Push for better terms and see if the student can negotiate effectively in formal Hindi.",
        userGoal: "Negotiate terms using formal Hindi, make a proposal, and reach agreement",
        targetPhrases: ["प्रस्ताव", "शर्त", "स्वीकार्य", "समक्ष"],
        successCriteria: ["Uses formal negotiation vocabulary", "Makes and responds to proposals", "Reaches a compromise"],
      },
    ],
  },
  {
    id: "hi-advanced-l15",
    slug: "legal-admin-hindi",
    title: "Legal & Administrative Hindi (विधिक और प्रशासनिक हिंदी)",
    content: `# Legal & Administrative Hindi — विधिक और प्रशासनिक हिंदी

Government offices, courts, and bureaucracy in India operate in a highly Sanskritized Hindi register called राजभाषा (official language). Understanding this register is essential for navigating official India.

## Key Domains
- **विधिक** (legal): अधिनियम, याचिका, न्यायालय
- **प्रशासनिक** (administrative): अधिसूचना, परिपत्र, ज्ञापन
- **राजस्व** (revenue): कर, शुल्क, प्रतिफल`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m5",
    moduleTitle: "Business Hindi",
    order: 3,
    topicId: "hi-advanced-legal-admin-hindi",
    vocabulary: [
      {
        word: "अधिनियम",
        translation: "act / statute (legal)",
        pronunciation: "adhi-NI-yam",
        exampleSentence: "यह अधिनियम 2013 में पारित हुआ।",
        exampleTranslation: "This act was passed in 2013.",
        partOfSpeech: "noun",
      },
      {
        word: "याचिका",
        translation: "petition (legal)",
        pronunciation: "yaa-CHI-kaa",
        exampleSentence: "उच्च न्यायालय में याचिका दायर की गई।",
        exampleTranslation: "A petition was filed in the High Court.",
        partOfSpeech: "noun",
      },
      {
        word: "अधिसूचना",
        translation: "notification / gazette notice",
        pronunciation: "adhi-SOOCH-naa",
        exampleSentence: "सरकार ने नई अधिसूचना जारी की है।",
        exampleTranslation: "The government has issued a new notification.",
        partOfSpeech: "noun",
      },
      {
        word: "प्रतिफल",
        translation: "consideration (legal term for payment/exchange)",
        pronunciation: "pra-ti-PHAL",
        exampleSentence: "बिना प्रतिफल के अनुबंध अमान्य है।",
        exampleTranslation: "A contract without consideration is void.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Compound Noun Chains in Official Hindi",
        explanation: "Legal Hindi chains nouns together: जन-सूचना-अधिकारी (public-information-officer), लोक-सेवा-आयोग (public-service-commission). Understanding these compound formations is key to reading official documents.",
        examples: [
          { correct: "केंद्रीय-सूचना-आयोग", translation: "Central Information Commission — three-part compound" },
          { correct: "सर्वोच्च-न्यायालय", translation: "Supreme Court — compound noun" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "government-office",
        title: "At a Government Office",
        situation: "You need to file an RTI (Right to Information) request at a government office",
        agentRole: "You are a government clerk named Pandey ji. Speak in official Hindi and guide the student through the bureaucratic process.",
        userGoal: "Navigate a bureaucratic interaction using appropriate legal/administrative Hindi",
        targetPhrases: ["अधिसूचना", "याचिका", "अधिनियम"],
        successCriteria: ["Uses official vocabulary", "Understands bureaucratic instructions", "Completes the administrative task"],
      },
    ],
  },
];

// ============================================
// Module 6: Advanced Grammar & Expression
// ============================================

const module6Lessons: LanguageLesson[] = [
  {
    id: "hi-advanced-l16",
    slug: "ne-nuances",
    title: "ने Construction Nuances (ने की बारीकियाँ)",
    content: `# ने Construction Nuances — ने की बारीकियाँ

The ergative marker ने is one of Hindi's trickiest features. At C1, you must handle its exceptions and subtleties.

## Core Rule
ने is used with transitive verbs in perfective aspect (past tense): मैंने खाना खाया।

## Exceptions & Subtleties
- **Intransitive verbs**: No ने — वह गया (not उसने गया)
- **लाना, भूलना, बोलना**: Take ने despite seeming intransitive
- **Compound verbs**: ने agrees with the main verb's transitivity
- **Experiencer subjects**: समझना, जानना take ने — उसने समझा`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m6",
    moduleTitle: "Advanced Grammar & Expression",
    order: 1,
    topicId: "hi-advanced-ne-nuances",
    vocabulary: [
      {
        word: "बारीकी",
        translation: "subtlety / nuance / fine detail",
        pronunciation: "baa-REE-kee",
        exampleSentence: "भाषा की बारीकियाँ समझना ज़रूरी है।",
        exampleTranslation: "Understanding the subtleties of language is essential.",
        partOfSpeech: "noun",
      },
      {
        word: "कर्ता-कारक",
        translation: "nominative/agent case (grammatical subject)",
        pronunciation: "kar-TAA KAA-rak",
        exampleSentence: "ने कर्ता-कारक को चिह्नित करता है।",
        exampleTranslation: "ने marks the agent case.",
        partOfSpeech: "noun",
      },
      {
        word: "सकर्मक / अकर्मक",
        translation: "transitive / intransitive",
        pronunciation: "sa-KAR-mak / a-KAR-mak",
        exampleSentence: "'खाना' सकर्मक है, 'सोना' अकर्मक।",
        exampleTranslation: "'To eat' is transitive, 'to sleep' is intransitive.",
        partOfSpeech: "adjective",
      },
      {
        word: "पूर्ण भूत",
        translation: "perfective past (grammatical tense)",
        pronunciation: "POORN BHOOT",
        exampleSentence: "ने का प्रयोग पूर्ण भूत काल में होता है।",
        exampleTranslation: "ने is used in the perfective past tense.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "ने with Exception Verbs",
        explanation: "Some verbs break the transitive/intransitive rule: लाना (bring), भूलना (forget), बोलना (speak), and छींकना (sneeze) take ने. Meanwhile, मिलना (meet) never takes ने despite having a direct object.",
        examples: [
          { correct: "उसने कहा (correct) — कहना takes ने", translation: "He/she said" },
          { correct: "वह मुझसे मिला (correct, NOT उसने मिला)", translation: "He met me — मिलना never takes ने" },
          { correct: "उसने बोला (correct) — बोलना takes ने", translation: "He/she spoke" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "ne-practice",
        title: "Narrating Past Events",
        situation: "You are telling a friend about what happened at a party yesterday, using many past-tense verbs",
        agentRole: "You are a grammar-conscious friend named Deepa. Gently correct any ने errors and ask follow-up questions that require more past-tense narration.",
        userGoal: "Narrate a past event correctly using ने with all appropriate verbs",
        targetPhrases: ["उसने कहा", "मैंने देखा", "वह आया", "उसने बोला"],
        successCriteria: ["Uses ने correctly with transitive verbs", "Avoids ने with intransitive verbs", "Handles exception verbs"],
      },
    ],
  },
  {
    id: "hi-advanced-l17",
    slug: "echo-words-particles",
    title: "Echo Words & Emphatic Particles (द्विरुक्ति और अव्यय)",
    content: `# Echo Words & Emphatic Particles — द्विरुक्ति और अव्यय

## Echo Words (द्विरुक्ति)
Hindi creates echo words by replacing the first consonant with व: चाय-वाय, खाना-वाना, काम-वाम. This adds casualness and means "X and related things."

## Emphatic Particles
- **ही** — exclusivity/emphasis: "only, exactly" (वही आदमी = that very man)
- **भी** — inclusion: "also, even" (वह भी = he too)
- **तो** — contrast/emphasis: "as for, indeed" (मैं तो जा रहा हूँ = I, for one, am going)`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m6",
    moduleTitle: "Advanced Grammar & Expression",
    order: 2,
    topicId: "hi-advanced-echo-words-particles",
    vocabulary: [
      {
        word: "चाय-वाय",
        translation: "tea and stuff / tea etc.",
        pronunciation: "CHAAY-VAAY",
        exampleSentence: "आओ, चाय-वाय पीते हैं।",
        exampleTranslation: "Come, let's have tea and stuff.",
        partOfSpeech: "echo word",
      },
      {
        word: "वही",
        translation: "that very one / exactly that (ही emphasis)",
        pronunciation: "va-HEE",
        exampleSentence: "वही बात है जो मैंने कही थी।",
        exampleTranslation: "That's exactly what I had said.",
        partOfSpeech: "pronoun + particle",
      },
      {
        word: "कुछ भी",
        translation: "anything at all (भी inclusion)",
        pronunciation: "KUCHH bhee",
        exampleSentence: "कुछ भी हो जाए, मैं नहीं हारूँगा।",
        exampleTranslation: "No matter what happens, I won't give up.",
        partOfSpeech: "pronoun + particle",
      },
      {
        word: "मैं तो",
        translation: "I, for one / as for me (तो contrast)",
        pronunciation: "MAIN to",
        exampleSentence: "मैं तो चला — तुम जानो।",
        exampleTranslation: "I, for one, am leaving — you decide for yourself.",
        partOfSpeech: "pronoun + particle",
      },
    ],
    grammarPoints: [
      {
        title: "Particle Placement Changes Meaning",
        explanation: "The position of ही, भी, तो changes the emphasis entirely. वह ही आया (only he came) vs वह आया ही (he did come, emphatic certainty). Mastering placement is key to natural Hindi.",
        examples: [
          { correct: "राम ही आया (only Ram came)", translation: "ही after subject = only that person" },
          { correct: "राम आया ही (Ram definitely came)", translation: "ही after verb = emphatic certainty" },
          { correct: "राम तो आया (Ram came, but...)", translation: "तो implies contrast with what follows" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "casual-chat-particles",
        title: "Casual Chat with Particles",
        situation: "You are having a relaxed conversation about weekend plans, using echo words and particles naturally",
        agentRole: "You are a casual friend named Sanjay. Use lots of echo words and particles in your speech and encourage the student to do the same.",
        userGoal: "Use echo words and ही/भी/तो particles naturally in casual conversation",
        targetPhrases: ["चाय-वाय", "वही", "कुछ भी", "मैं तो"],
        successCriteria: ["Uses echo words naturally", "Places particles correctly", "Conversation sounds casual and fluent"],
      },
    ],
  },
  {
    id: "hi-advanced-l18",
    slug: "creative-writing",
    title: "Creative Writing & Expression (रचनात्मक लेखन)",
    content: `# Creative Writing & Expression — रचनात्मक लेखन

The ultimate test of advanced Hindi: expressing original thoughts with style. This lesson combines everything — idioms, literary register, particles, and dialect awareness — into creative expression.

## Forms to Practice
- **लघुकथा** (flash fiction): Tell a story in 100 words
- **व्यक्तिगत निबंध** (personal essay): Express an opinion with voice
- **कविता** (poetry): Even a simple दोहा or मुक्त छंद (free verse)`,
    targetLanguage: "hi",
    proficiencyLevel: "C1",
    moduleId: "hi-advanced-m6",
    moduleTitle: "Advanced Grammar & Expression",
    order: 3,
    topicId: "hi-advanced-creative-writing",
    vocabulary: [
      {
        word: "लघुकथा",
        translation: "flash fiction / micro-story",
        pronunciation: "laghu-KA-thaa",
        exampleSentence: "उसकी लघुकथा ने सबको रुला दिया।",
        exampleTranslation: "His flash fiction made everyone cry.",
        partOfSpeech: "noun",
      },
      {
        word: "बिंब",
        translation: "imagery (literary term)",
        pronunciation: "BIMB",
        exampleSentence: "इस कविता में प्रकृति के सुंदर बिंब हैं।",
        exampleTranslation: "This poem has beautiful imagery of nature.",
        partOfSpeech: "noun",
      },
      {
        word: "मुक्त छंद",
        translation: "free verse (poetry without fixed meter)",
        pronunciation: "MUKT CHHAND",
        exampleSentence: "आधुनिक कविता अक्सर मुक्त छंद में लिखी जाती है।",
        exampleTranslation: "Modern poetry is often written in free verse.",
        partOfSpeech: "noun",
      },
      {
        word: "रूपक",
        translation: "metaphor",
        pronunciation: "ROO-pak",
        exampleSentence: "ज़िंदगी एक सफ़र है — यह एक रूपक है।",
        exampleTranslation: "Life is a journey — this is a metaphor.",
        partOfSpeech: "noun",
      },
    ],
    grammarPoints: [
      {
        title: "Mixing Registers for Effect",
        explanation: "Skilled Hindi writers deliberately mix Tatsama, Tadbhava, and Urdu-origin words for contrast and rhythm. A formal Tatsama word next to a colloquial Tadbhava creates emphasis and surprise.",
        examples: [
          { correct: "अग्नि-सी आग उसके दिल में जली (literary)", translation: "A fire-like fire burned in her heart — mixing अग्नि (Tatsama) with आग (Tadbhava)" },
          { correct: "ज़िंदगी का यथार्थ कड़वा है (mixed)", translation: "The reality of life is bitter — ज़िंदगी (Urdu) + यथार्थ (Sanskrit)" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "creative-expression",
        title: "Oral Storytelling",
        situation: "You are at an open-mic event and need to tell a short story or recite a self-composed verse",
        agentRole: "You are the open-mic host named Kavita. Encourage the student to share a short creative piece and give constructive feedback on language use, imagery, and expression.",
        userGoal: "Compose and deliver a short creative piece (story or poem) in Hindi",
        targetPhrases: ["रूपक", "बिंब", "लघुकथा"],
        successCriteria: ["Creates original content in Hindi", "Uses literary devices", "Demonstrates register awareness"],
      },
    ],
  },
];

// ============================================
// Course Assembly
// ============================================

const modules: LanguageModule[] = [
  {
    id: "hi-advanced-m1",
    title: "Module 1: Idioms & Proverbs",
    description: "Body-part idioms, emotion idioms, and proverbs in natural conversation",
    order: 1,
    lessons: module1Lessons,
  },
  {
    id: "hi-advanced-m2",
    title: "Module 2: Literary Hindi",
    description: "Tatsama vs Tadbhava, Hindi-Urdu spectrum, Premchand and Kabir",
    order: 2,
    lessons: module2Lessons,
  },
  {
    id: "hi-advanced-m3",
    title: "Module 3: Debate & Persuasion",
    description: "Complex arguments, persuasive language, humor and sarcasm",
    order: 3,
    lessons: module3Lessons,
  },
  {
    id: "hi-advanced-m4",
    title: "Module 4: Regional Dialects",
    description: "Braj, Awadhi, Bhojpuri, Mumbai Hindi, and accent comprehension",
    order: 4,
    lessons: module4Lessons,
  },
  {
    id: "hi-advanced-m5",
    title: "Module 5: Business Hindi",
    description: "Corporate vocabulary, presentations, negotiations, legal and administrative Hindi",
    order: 5,
    lessons: module5Lessons,
  },
  {
    id: "hi-advanced-m6",
    title: "Module 6: Advanced Grammar & Expression",
    description: "ने nuances, echo words, emphatic particles, and creative writing",
    order: 6,
    lessons: module6Lessons,
  },
];

export const hindiAdvancedCourse: LanguageCourse = {
  ...courseInfo,
  modules,
};

// Helper function to get all lessons
export function getHindiAdvancedLessons() {
  return modules.flatMap((m) => m.lessons);
}

// Helper function to find a lesson by slug
export function findHindiAdvancedLesson(slug: string) {
  return getHindiAdvancedLessons().find((l) => l.slug === slug);
}

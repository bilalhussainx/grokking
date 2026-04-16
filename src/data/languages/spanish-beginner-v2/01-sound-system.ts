import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────────────
// MODULE 1: The Sound System (3 lessons)
// The great news for English speakers: Spanish IS phonetic.
// Learn ~10 rules here and you can pronounce every Spanish word correctly.
// ─────────────────────────────────────────────────────────────────

export const soundSystemLessons: LanguageLesson[] = [
  // ── LESSON 1 ── The Phonetic Advantage ───────────────────────
  {
    id: "es-l1",
    slug: "phonetic-advantage",
    title: "The Phonetic Advantage — Spanish Sounds as Written",
    content: `# The Phonetic Advantage

Here is the best thing about learning Spanish pronunciation: **what you see is what you say.** Spanish is a phonetic language. Every letter makes the same sound every time (with a handful of exceptions covered in Lesson 2). This is radically different from English — or French, where up to 40% of letters may be silent.

\`\`\`concept
{ "title": "Spanish Is Phonetic — French and English Are Not", "variant": "success", "content": "In English, the letters 'ough' can be pronounced 6 different ways: through, though, thought, tough, cough, bough. In Spanish, once you learn the ~10 sound rules, you can pronounce any word you encounter — even words you have never seen before. This is an enormous advantage." }
\`\`\`

## The 5 Pure Vowels

Spanish has exactly 5 vowels, each with exactly **one** sound. English vowels shift and blur — Spanish vowels never do.

| Letter | Sound | English comparison | Examples |
|--------|-------|--------------------|---------|
| **A** | "ah" | The A in "father" | **casa**, **hablar**, **gracias** |
| **E** | "eh" | The E in "bed" | **mesa**, **verde**, **come** |
| **I** | "ee" | The EE in "see" | **libro**, **sí**, **vivir** |
| **O** | "oh" | The O in "go" (but shorter, rounder) | **como**, **hola**, **ocho** |
| **U** | "oo" | The OO in "food" | **mucho**, **uno**, **luz** |

\`\`\`compare
{ "title": "English Vowels Shift — Spanish Vowels Stay Constant", "left": { "label": "English (unstable vowels)", "items": ["'a' in 'cat' ≠ 'a' in 'father' ≠ 'a' in 'sofa'", "'e' in 'bed' ≠ 'e' in 'the' ≠ 'e' in 'they'", "'o' in 'go' ≠ 'o' in 'son' ≠ 'o' in 'do'", "Unstressed vowels reduce to 'uh' (the schwa)"] }, "right": { "label": "Spanish (stable vowels)", "items": ["'a' is always 'ah' — in any position, any word", "'e' is always 'eh' — stressed or unstressed", "'o' is always 'oh' — no reduction ever", "No schwa — every vowel is fully and clearly pronounced"] } }
\`\`\`

## Consonants That Work Like English

Most Spanish consonants are identical or very close to their English equivalents:

**Same as English:** B, D, F, K, L, M, N, P, S, T, W

**Very close:** C before A/O/U = K sound (como, casa). G before A/O/U = hard G (gato, gordo).

The six sounds that are genuinely different — R, RR, J, Ñ, LL, and the V/B merger — get their own lesson next.

\`\`\`quiz
{ "question": "The Spanish word 'libro' (book) — how do English speakers typically mispronounce it?", "options": ["They say LEE-broh — which is actually correct!", "They say LIB-roh, applying the English 'i' vowel instead of the Spanish 'ee'", "They say LY-broh, like the beginning of 'library'", "They say LAH-broh, applying an 'a' sound"], "answer": 1, "explanation": "Spanish I is always 'ee', Spanish O is always 'oh'. So libro = LEE-broh. English speakers default to English vowel sounds, saying LIB-roh (like 'libra') because English I in 'lib' sounds different. The fix: consciously override your English vowel instincts." }
\`\`\`

\`\`\`takeaways
{ "points": ["Spanish is phonetically regular — learn the rules once, pronounce everything correctly forever", "5 vowels, each with exactly one sound: A=ah, E=eh, I=ee, O=oh, U=oo — no exceptions", "No schwa (the 'uh' sound English puts on unstressed vowels) — every Spanish vowel is fully pronounced", "Most consonants are the same as English — only ~6 sounds need real practice (next lesson)", "This phonetic regularity means you can read new Spanish words aloud correctly from day one"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m1",
    moduleTitle: "The Sound System",
    order: 1,
    topicId: "es-m1-l1-phonetic-advantage",
    vocabulary: [
      { word: "casa", translation: "house", pronunciation: "KAH-sah", exampleSentence: "Mi casa es grande.", exampleTranslation: "My house is big.", partOfSpeech: "noun" },
      { word: "libro", translation: "book", pronunciation: "LEE-broh", exampleSentence: "El libro es interesante.", exampleTranslation: "The book is interesting.", partOfSpeech: "noun" },
      { word: "mesa", translation: "table", pronunciation: "MEH-sah", exampleSentence: "La mesa es nueva.", exampleTranslation: "The table is new.", partOfSpeech: "noun" },
      { word: "mucho", translation: "a lot / very much", pronunciation: "MOO-choh", exampleSentence: "Muchas gracias.", exampleTranslation: "Thank you very much.", partOfSpeech: "adverb" },
      { word: "hola", translation: "hello", pronunciation: "OH-lah", exampleSentence: "Hola, ¿cómo estás?", exampleTranslation: "Hello, how are you?", partOfSpeech: "interjection" },
      { word: "gracias", translation: "thank you", pronunciation: "GRAH-syahs", exampleSentence: "Gracias por tu ayuda.", exampleTranslation: "Thank you for your help.", partOfSpeech: "interjection" },
    ],
    grammarPoints: [
      {
        title: "The 5 Spanish Vowels — Pure and Constant",
        explanation: "Spanish A, E, I, O, U each have one invariant sound. They do not shift based on stress or position. This is the opposite of English, where vowels constantly change sound depending on context.",
        examples: [
          { correct: "casa → KAH-sah", translation: "house", note: "Both A's are identical 'ah' sounds" },
          { correct: "libro → LEE-broh", translation: "book", note: "I = ee, O = oh — never shifts" },
          { correct: "como → KOH-moh", translation: "how / like", note: "Both O's are identical 'oh' sounds" },
        ],
        commonMistakes: [
          { incorrect: "LIB-roh", correction: "LEE-broh", explanation: "English speakers use the English vowel sound for Spanish I. Spanish I is always 'ee'." },
          { incorrect: "KAY-sah", correction: "KAH-sah", explanation: "English speakers say 'a' as in 'cake'. Spanish A is always 'ah' (as in 'father')." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m1-l1-vs1",
        title: "Vowel Practice with a Tutor",
        situation: "Your Spanish tutor is helping you practice the five Spanish vowels and simple words.",
        agentRole: "You are a patient Spanish pronunciation tutor. Ask the student to say the five vowels and then simple words like casa, mesa, libro, hola, mucho. Give gentle corrections if the vowels shift toward English sounds.",
        userGoal: "Say the 5 Spanish vowels clearly, then pronounce: casa, mesa, libro, hola, mucho.",
        targetPhrases: ["a, e, i, o, u", "casa", "mesa", "libro", "hola", "mucho"],
        successCriteria: ["Vowels pronounced purely without English shifting", "No schwa reduction on unstressed vowels"],
        hints: ["A = 'ah', E = 'eh', I = 'ee', O = 'oh', U = 'oo'", "Keep each vowel short and crisp — do not let them slide"],
      },
    ],
    culturalNotes: [
      {
        title: "Spanish Across the World — One Grammar, Many Accents",
        content: "Over 500 million people speak Spanish natively across 21 countries. While accents vary enormously (Mexico, Argentina, Spain, Colombia all sound distinct), the grammar and vocabulary you learn here works everywhere. The main regional differences are: pronunciation of LL/Y (standard Y sound vs Argentine SH), use of **vosotros** (Spain only) vs **ustedes** (everywhere else for the plural 'you'), and some vocabulary differences (car = coche in Spain, carro in Mexico, auto in Argentina).",
        region: "Global",
      },
    ],
  },

  // ── LESSON 2 ── The Tricky Six ───────────────────────────────
  {
    id: "es-l2",
    slug: "tricky-sounds",
    title: "The Tricky Six — Sounds English Doesn't Have",
    content: `# The Tricky Six

Spanish is phonetically regular, but it has six sounds that don't exist in English. Master these and your accent will be authentic from day one.

\`\`\`concept
{ "title": "Why These Six Sounds Matter", "variant": "info", "content": "Most Spanish sounds are close enough to English that you can approximate them immediately. But these six are distinctly Spanish. Getting them right is the difference between sounding foreign and sounding natural. More importantly, the R vs RR distinction CHANGES WORD MEANING — pero (but) vs perro (dog). Learn them as specific mouth positions, not as 'kinda like English X'." }
\`\`\`

## Sound 1: The Single R — A Tongue Flap

Spanish single **R** is NOT the English R. The English R is made deep in the mouth with no contact. The Spanish R is a quick **flap** of the tongue tip against the ridge behind your upper front teeth — the same motion as the American English T/D in "butter" or "ladder".

- **para** (for) = PAH-rah — two quick flaps
- **pero** (but) = PEH-roh — one flap
- **hora** (hour) = OH-rah — one flap

## Sound 2: The RR — A Trill

Spanish **RR** (and R at the very start of a word) is a **trill**: the tongue tip vibrates rapidly against that same ridge. This is a different sound and it changes meaning:

| Word | Meaning | R type |
|------|---------|--------|
| **pero** | but | Single flap (soft) |
| **perro** | dog | Trill (hard) |
| **caro** | expensive | Single flap |
| **carro** | car (Latin Am.) | Trill |

\`\`\`steps
{ "title": "How to Learn the Trill", "steps": ["Hold your tongue tip lightly against the ridge behind your upper front teeth", "Push a burst of air through — try to make the tongue flutter/buzz", "Practice with a cold 'brr' sound and then relax into 'rr'", "Say 'perro' slowly: peh-RRROH — feel the multiple taps", "Start position word: 'rápido' (fast) — R at word start is always a trill"] }
\`\`\`

## Sound 3: The J — A Throaty H

Spanish **J** is like a strong English H, produced with friction deeper in the throat — similar to the CH in Scottish "loch" or German "Bach". It is NOT the English J sound.

- **jamón** = khah-MOHN (ham) — the J is like clearing your throat softly
- **jugo** = KHOO-goh (juice)
- **ojo** = OH-khoh (eye)
- **jardín** = khar-DEEN (garden)

Note: **G before E or I** makes the same sound as J: **gente** = KHEHN-teh (people), **gimnasio** = kheem-NAH-syoh (gym).

## Sound 4: The Ñ — N with a Y

The **Ñ** (N with a tilde) is its own letter in the Spanish alphabet. It sounds like "NY" — like "NY" in "canyon" or "onion".

- **mañana** = mah-NYAH-nah (tomorrow / morning)
- **año** = AH-nyoh (year)
- **España** = ehs-PAH-nyah (Spain)
- **señor** = seh-NYOHR (Mr. / sir)

## Sound 5: LL and Y — Both Sound Like Y

In standard Latin American Spanish, **LL** and **Y** are pronounced identically — like the English Y in "yes". (In Argentina and Uruguay, both are pronounced like "sh".)

- **me llamo** = meh YAH-moh (my name is)
- **yo** = YOH (I)
- **lluvia** = YOOH-vyah (rain)
- **pollo** = POH-yoh (chicken)

## Sound 6: V and B — They Merge

In Spanish, **V** and **B** make the **same sound**. There is no distinction. Spanish speakers genuinely cannot hear a difference between them. At the start of words: both sound like English B. Between vowels: both soften to a very light sound where the lips barely touch.

- **vino** and a hypothetical **bino** would sound identical
- **vivir** = bee-BEER (to live)
- **bien** = BYEHN (good/well)

\`\`\`compare
{ "title": "Six Sounds — What English Speakers Assume vs What Spanish Does", "left": { "label": "What English speakers expect", "items": ["J → like English 'j' (as in 'jump')", "LL → like English 'll' (double L)", "V → clearly different from B", "R → same as English back-of-mouth R", "Ñ → like a plain N", "G before E/I → like hard G"] }, "right": { "label": "What Spanish actually does", "items": ["J → throaty H (like Scottish 'loch')", "LL → Y sound (like 'yes') in Latin America", "V and B → identical, no distinction", "R → quick tongue flap (NOT English R)", "Ñ → NY sound (like 'canyon')", "G before E/I → same throaty sound as J"] } }
\`\`\`

\`\`\`quiz
{ "question": "Your friend wants to say 'dog' (perro) but accidentally says 'pero'. What's the phonetic difference?", "options": ["pero uses a trill (RR), perro uses a flap (R)", "perro uses a trill (RR), pero uses a flap (R) — the extra R signals the trill", "They sound identical — context determines meaning", "The vowel sounds are different"], "answer": 1, "explanation": "Perro (dog) has RR — a sustained trill where the tongue vibrates multiple times. Pero (but) has a single R — a quick one-tap flap. Same vowels, same consonants otherwise, but R vs RR changes the word completely. This is why mastering the trill matters." }
\`\`\`

\`\`\`takeaways
{ "points": ["Single R = quick tongue flap at the alveolar ridge (like the T/D in American 'butter')", "RR (and word-initial R) = a trill — pero (but) vs perro (dog) is the minimal pair to practice", "J and G-before-E/I = throaty H (like Scottish 'loch') — NOT the English J", "Ñ = NY sound (like 'canyon') — mañana, España, año, señor", "LL and Y = both sound like English Y in 'yes' — me llamo sounds like 'meh YAH-moh'", "V and B = identical in Spanish — no distinction exists"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m1",
    moduleTitle: "The Sound System",
    order: 2,
    topicId: "es-m1-l2-tricky-sounds",
    vocabulary: [
      { word: "pero", translation: "but", pronunciation: "PEH-roh (single R flap)", exampleSentence: "Hablo español pero no mucho.", exampleTranslation: "I speak Spanish but not much.", partOfSpeech: "conjunction" },
      { word: "perro", translation: "dog", pronunciation: "PEH-rroh (RR trill)", exampleSentence: "Mi perro se llama Max.", exampleTranslation: "My dog is called Max.", partOfSpeech: "noun" },
      { word: "mañana", translation: "tomorrow / morning", pronunciation: "mah-NYAH-nah", exampleSentence: "Hasta mañana.", exampleTranslation: "See you tomorrow.", partOfSpeech: "noun/adverb" },
      { word: "jamón", translation: "ham", pronunciation: "khah-MOHN", exampleSentence: "Quiero jamón serrano.", exampleTranslation: "I want Serrano ham.", partOfSpeech: "noun" },
      { word: "me llamo", translation: "my name is (I call myself)", pronunciation: "meh YAH-moh", exampleSentence: "Me llamo Carlos.", exampleTranslation: "My name is Carlos.", partOfSpeech: "phrase" },
      { word: "pollo", translation: "chicken", pronunciation: "POH-yoh", exampleSentence: "Quiero pollo a la plancha.", exampleTranslation: "I want grilled chicken.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "R vs RR — A Distinction That Changes Meaning",
        explanation: "Single R is a quick one-tap tongue flap. Double RR (and word-initial R) is a sustained trill with multiple tongue vibrations. Using the wrong one can change the word.",
        examples: [
          { correct: "pero (but)", translation: "PEH-roh — single flap", note: "Minimal pair with perro" },
          { correct: "perro (dog)", translation: "PEH-rroh — trill", note: "The RR is distinctly longer and harder" },
        ],
        commonMistakes: [
          { incorrect: "Using the English R for all Spanish Rs", correction: "Use a tongue flap for single R, a trill for RR and word-initial R", explanation: "English R is formed in the back of the mouth with no tongue contact. Spanish R requires tongue contact at the alveolar ridge." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m1-l2-vs1",
        title: "Tricky Sound Drill with a Tutor",
        situation: "Your Spanish tutor is testing your pronunciation of the six sounds English speakers find difficult.",
        agentRole: "You are a friendly Spanish pronunciation tutor. Ask the student to repeat words with R, RR, J, Ñ, LL. Listen for the pero/perro distinction and give specific feedback.",
        userGoal: "Pronounce clearly: pero, perro, mañana, jamón, me llamo, año.",
        targetPhrases: ["pero", "perro", "mañana", "jamón", "me llamo", "año"],
        successCriteria: ["pero and perro are clearly distinguished (flap vs trill)", "Ñ in mañana sounds like 'NYAH'", "J in jamón is throaty, not English J"],
        hints: ["pero = PEH-roh (one tap); perro = PEH-rroh (sustained buzz)", "mañana = mah-NYAH-nah (the Ñ is like NY in 'canyon')"],
      },
    ],
  },

  // ── LESSON 3 ── Stress, Accents & First Conversations ───────
  {
    id: "es-l3",
    slug: "stress-accents-conversations",
    title: "Stress, Accents & Your First Conversations",
    content: `# Stress, Accents & First Conversations

You've mastered the sounds. Now: where does the stress fall? Spanish has a simple two-rule system — and once you know it, the accent mark (tilde) makes complete sense. It's just an exception marker.

## The Two Stress Rules

\`\`\`concept
{ "title": "Two Rules Cover 95% of All Spanish Words", "variant": "info", "content": "Rule 1: Words ending in a vowel, N, or S → stress the SECOND-TO-LAST syllable. Examples: CA-sa, co-MEN, ha-BLAS. Rule 2: Words ending in any other consonant → stress the LAST syllable. Examples: ha-BLAR, ciu-DAD, doc-TOR. The accent mark (á, é, í, ó, ú) means: IGNORE both rules — stress THIS syllable instead." }
\`\`\`

**Rule 1 — ends in vowel, N, or S → second-to-last:**
- **CA**-sa (house), **ha**-blan (they speak), **li**-bros (books)

**Rule 2 — ends in other consonant → last syllable:**
- ha-**blar** (to speak), ciu-**dad** (city), doc-**tor**

**Accent mark overrides both:**
- ca-**fé** (coffee) — Rule 1 would say CA, but accent says FÉ
- **á**-guila (eagle) — accent says: stress the first syllable
- tam-**bién** (also) — accent on É overrides Rule 1

## Inverted Question and Exclamation Marks

Spanish is the only major language that uses opening punctuation marks. They appear at the **start** of a question or exclamation, signalling to the reader/speaker early that special intonation is coming.

- **¿Cómo te llamas?** — What's your name?
- **¿Dónde vives?** — Where do you live?
- **¡Hola!** — Hello!
- **¡Qué bien!** — How great!

## Tú vs Usted — The Two Forms of "You"

Spanish has two singular pronouns for "you". Choosing the wrong one is a social mistake.

\`\`\`compare
{ "title": "Tú vs Usted — When to Use Each", "left": { "label": "Tú (informal)", "items": ["Friends, family, classmates", "People your own age or younger", "Children", "Casual settings — cafés, shops, among peers", "Dominant in most of Latin America socially"] }, "right": { "label": "Usted (formal)", "items": ["Strangers, especially older people", "Professional contexts — boss, doctor, professor", "Customer service (to show respect)", "In doubt? Default to usted — it's never offensive", "More common in Colombia, Ecuador, formal Spain"] } }
\`\`\`

## Essential First Phrases

| Spanish | English | Pronunciation |
|---------|---------|--------------|
| **Hola** | Hello | OH-lah |
| **Buenos días** | Good morning | BWEH-nohs DEE-ahs |
| **Buenas tardes** | Good afternoon | BWEH-nahs TAR-dehs |
| **Buenas noches** | Good evening/night | BWEH-nahs NOH-chehs |
| **¿Cómo te llamas?** | What's your name? (informal) | KOH-moh teh YAH-mahs |
| **Me llamo...** | My name is... | meh YAH-moh |
| **¿De dónde eres?** | Where are you from? | deh DOHN-deh EH-rehs |
| **Soy de...** | I'm from... | SOY deh |
| **Mucho gusto** | Nice to meet you | MOO-choh GOOS-toh |
| **Hasta luego** | Goodbye / see you later | AH-stah LWEH-goh |

\`\`\`quiz
{ "question": "The word 'hablan' (they speak) ends in N. Where does the stress fall?", "options": ["On the last syllable: ha-BLAN", "On the second-to-last syllable: HA-blan", "Determined by the accent mark", "On the first syllable always"], "answer": 1, "explanation": "Rule 1: words ending in a vowel, N, or S → stress the SECOND-TO-LAST syllable. 'Hablan' ends in N, so stress falls on 'HA': HA-blan. If there were an accent mark, that would override this rule. There is no accent mark, so the default rule applies." }
\`\`\`

\`\`\`takeaways
{ "points": ["Two stress rules: ends in vowel/N/S → second-to-last; ends in other consonant → last syllable", "Accent mark (tilde) always overrides both rules — the accented syllable is stressed", "Inverted ¿ and ¡ open questions and exclamations — unique to Spanish", "Tú = informal you (friends, family). Usted = formal you (strangers, elders, professionals). When in doubt: use usted.", "Me llamo = 'my name is' (literally: I call myself) — the natural way to give your name in Spanish"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m1",
    moduleTitle: "The Sound System",
    order: 3,
    topicId: "es-m1-l3-stress-accents",
    vocabulary: [
      { word: "¿cómo te llamas?", translation: "what's your name? (informal)", pronunciation: "KOH-moh teh YAH-mahs", exampleSentence: "Hola, ¿cómo te llamas?", exampleTranslation: "Hello, what's your name?", partOfSpeech: "phrase" },
      { word: "me llamo", translation: "my name is", pronunciation: "meh YAH-moh", exampleSentence: "Me llamo Sofía.", exampleTranslation: "My name is Sofía.", partOfSpeech: "phrase" },
      { word: "¿de dónde eres?", translation: "where are you from?", pronunciation: "deh DOHN-deh EH-rehs", exampleSentence: "¿De dónde eres tú?", exampleTranslation: "Where are you from?", partOfSpeech: "phrase" },
      { word: "soy de", translation: "I'm from", pronunciation: "SOY deh", exampleSentence: "Soy de los Estados Unidos.", exampleTranslation: "I'm from the United States.", partOfSpeech: "phrase" },
      { word: "mucho gusto", translation: "nice to meet you", pronunciation: "MOO-choh GOOS-toh", exampleSentence: "Mucho gusto, señora García.", exampleTranslation: "Nice to meet you, Mrs. García.", partOfSpeech: "phrase" },
      { word: "hasta luego", translation: "goodbye / see you later", pronunciation: "AH-stah LWEH-goh", exampleSentence: "Hasta luego, y gracias.", exampleTranslation: "Goodbye, and thank you.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Tú vs Usted — Two Forms of Singular 'You'",
        explanation: "Spanish has two pronouns for the singular 'you': tú (informal) and usted (formal). They require different verb forms. Usted uses the same verb form as él/ella (third person singular).",
        examples: [
          { correct: "¿Cómo te llamas tú?", translation: "What's your name? (to a friend)", note: "Tú is informal" },
          { correct: "¿Cómo se llama usted?", translation: "What's your name? (to a stranger/elder)", note: "Usted is formal" },
        ],
        commonMistakes: [
          { incorrect: "Using tú with a stranger or elder", correction: "Default to usted when in doubt", explanation: "Using tú with someone who expects usted can be perceived as disrespectful or too familiar. Usted is never offensive." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m1-l3-vs1",
        title: "First Meeting at a Language Exchange in Madrid",
        situation: "You've arrived at a language exchange event in Madrid. You meet someone new and introduce yourself.",
        agentRole: "You are a friendly Spaniard at a language exchange event. Greet the student warmly, ask their name and where they're from, and respond naturally in Spanish. Keep the conversation going at A1 level.",
        userGoal: "Introduce yourself: say hello, give your name with 'me llamo', say where you're from with 'soy de', and say 'mucho gusto'.",
        targetPhrases: ["hola", "me llamo", "soy de", "mucho gusto"],
        successCriteria: ["Uses appropriate greeting", "States name with me llamo", "States origin with soy de", "Uses mucho gusto or encantado/a"],
        hints: ["Start with: Hola, me llamo [name]", "Then: Soy de [country/city]", "End with: Mucho gusto"],
      },
    ],
    culturalNotes: [
      {
        title: "Greeting Customs Across the Spanish-Speaking World",
        content: "In Spain, the standard greeting between acquaintances involves two kisses on the cheeks (left first, then right). This applies to man-woman and woman-woman greetings. Men shake hands. In most of Latin America, one kiss (right cheek) is the norm in social settings. In formal business contexts, a handshake is universal across all Spanish-speaking countries. The verbal greeting **buenas** (short for buenos días/buenas tardes/buenas noches) is used informally at any time of day and works in every Spanish-speaking country.",
        region: "Spain / Latin America",
      },
    ],
  },
];

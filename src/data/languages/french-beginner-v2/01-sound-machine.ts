import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────
// MODULE 1: The Sound Machine (4 lessons)
// Front-load phonetics — the biggest barrier for English speakers.
// Once students can make the sounds, everything else clicks faster.
// ─────────────────────────────────────────────────────────

export const soundMachineLessons: LanguageLesson[] = [
  // ── LESSON 1 ── French vs English Phonemes ───────────────
  {
    id: "fr-l1",
    slug: "french-vs-english-phonemes",
    title: "Why French Sounds So Different (And How to Fix That)",
    content: `# Why French Sounds So Different

English and French share thousands of words — *nation, culture, restaurant, animal* — but they sound almost nothing alike. The reason is that French uses **different mouth positions** and **different rules** for which letters are even pronounced.

\`\`\`concept
{ "title": "The Core Problem: French Is Not Phonetic Like Spanish", "variant": "warning", "content": "In Spanish, every letter is pronounced. In French, up to 40% of letters in a word may be silent. The word 'beaucoup' (a lot) is spelled with 7 letters but only 4 sounds: boh-KOO. The 'ea', 'c' (silent here), and final 'p' vanish. You must learn the SOUND patterns, not just the letters." }
\`\`\`

## The Vowel Revolution

French has 16 distinct vowel sounds. English has about 14. The difference isn't the count — it's the **positions**:

| Sound | French letter(s) | How to make it | Example |
|-------|-----------------|----------------|---------|
| "ay"  | é, er, ez | Like English "say" but shorter, clipped | café, parler |
| "eh"  | è, ê, e + double consonant | Open mouth, "bed" | mère, fête, belle |
| "uh"  | e (unstressed) | Like "the" — very short | le, de, ce |
| "oo"  | ou | Like English "too" | vous, jour |
| **"ü"** | **u** | **No English equivalent — lips pursed for "oo", tongue says "ee"** | **tu, rue, du** |
| "oh"  | o, au, eau | Rounder than English | beau, eau |

\`\`\`concept
{ "title": "The French U — The Most Important Sound to Master", "variant": "analogy", "content": "The sound for French 'u' doesn't exist in English. To make it: 1) Say 'ee' (as in 'see'). 2) Keep your tongue exactly there. 3) Now round your lips as if saying 'oo'. The result — lips rounded, tongue forward — is the French 'u'. Practice: tu (you), rue (street), du (some). If your mouth isn't uncomfortable, you're not doing it right yet." }
\`\`\`

## The Consonants That Change

Most French consonants are like English, but these are traps:

| Letter | English assumption | French reality | Example |
|--------|--------------------|---------------|---------|
| **R** | front of mouth | **back of throat** (soft gargle) | rouge, Paris |
| **H** | breathed (as in "hat") | **always silent** | hôtel, homme |
| **G** before e/i | hard "g" | **soft "zh"** (like "measure") | plage, manger |
| **C** before e/i | hard "k" | **soft "s"** | centre, ceci |
| **J** | like English "j" | **"zh"** (like "measure") | jour, je |

\`\`\`compare
{ "title": "English vs French Consonant Traps", "left": { "label": "What English speakers assume", "items": ["H in hôtel → breathed 'h'", "R in rouge → front-of-mouth 'r'", "J in je → English 'j' sound", "G in manger → hard 'g'"] }, "right": { "label": "What French actually does", "items": ["H in hôtel → completely silent", "R in rouge → soft throat gargle", "J in je → 'zh' like 'measure'", "G in manger → 'zh' like 'measure'"] } }
\`\`\`

## The French R — Your First Milestone

The French R is produced at the **back of the throat** (the uvula), not the front like English. It sounds a bit like a gentle gargle.

**How to practice:**
1. Say the English word "Bach" (the composer) — that final "ch" is close
2. Now try: "rouge" (red) — start with that throat sound
3. Practise: *rouge, rue, merci, Paris, bonjour*
4. Key: it should feel like the back of your throat is vibrating gently

\`\`\`quiz
{ "question": "The French word 'hôtel' — how many of its letters are actually silent?", "options": ["None — every letter is pronounced", "Just the 'h' — the rest are pronounced", "The 'h' and the final 'l' are silent", "The 'h', 'ô' and 'l' are all silent"], "answer": 1, "explanation": "In French, 'h' is ALWAYS silent. So 'hôtel' is pronounced 'oh-TEL'. The 'ô' sounds like a long 'oh', and the final 'l' IS pronounced. Only the 'h' is dropped." }
\`\`\`

\`\`\`takeaways
{ "points": ["French is NOT phonetically regular — learn sound patterns, not letter-by-letter rules", "The French 'u' has no English equivalent: lips round, tongue forward (like 'ee' + 'oo' simultaneously)", "H is always silent in French — hôtel, homme, here = 'oh-TEL', 'ohm'", "R is produced at the back of the throat — practice 'rouge' and 'rue' daily", "G and J both make the 'zh' sound (like English 'measure') before e or i"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m1",
    moduleTitle: "The Sound Machine",
    order: 1,
    topicId: "fr-m1-l1-phonemes",
    vocabulary: [
      { word: "rouge", translation: "red", pronunciation: "ROOZH (throat R)", exampleSentence: "Le vin rouge est bon.", exampleTranslation: "The red wine is good.", partOfSpeech: "adjective" },
      { word: "rue", translation: "street", pronunciation: "RÜ (French u)", exampleSentence: "J'habite dans cette rue.", exampleTranslation: "I live on this street.", partOfSpeech: "noun" },
      { word: "hôtel", translation: "hotel", pronunciation: "oh-TEL (silent h)", exampleSentence: "L'hôtel est près d'ici.", exampleTranslation: "The hotel is nearby.", partOfSpeech: "noun" },
      { word: "bonjour", translation: "hello / good morning", pronunciation: "bohn-ZHOOR", exampleSentence: "Bonjour, ça va ?", exampleTranslation: "Hello, how are you?", partOfSpeech: "interjection" },
      { word: "beaucoup", translation: "a lot / very much", pronunciation: "boh-KOO (silent p)", exampleSentence: "Merci beaucoup !", exampleTranslation: "Thank you very much!", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "Silent Final Consonants — The Golden Rule",
        explanation: "In French, consonants at the END of a word are usually silent. The main exceptions are C, R, F, L (remember: **CaReFuL**). This rule applies to: -s (plural), -t, -d, -x, -z, -p at the end of words.",
        examples: [
          { correct: "les amis → 'lay-zah-MEE'", translation: "The friends — the final 's' is silent (but creates liaison with next word)" },
          { correct: "petit → 'puh-TEE'", translation: "Small — the 't' is completely silent" },
          { correct: "avec → 'ah-VEK'", translation: "With — the 'c' IS pronounced (CaReFuL exception)" },
        ],
        commonMistakes: [
          { incorrect: "Pronouncing 'vous' as 'vooss'", correction: "vous = 'voo' (final s is silent)", explanation: "Final 's' is almost always silent in French. Exception: in liaison before a vowel." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m1-l1-voice",
        title: "Phonetics Workout with a French Coach",
        situation: "A French pronunciation coach is drilling you on sounds",
        agentRole: "You are Mathieu, a patient French phonetics coach. Say individual French words slowly and ask the student to repeat. Focus on R, U, and silent letters.",
        userGoal: "Attempt the French R, the French U sound, and silent final consonants",
        targetPhrases: ["rouge", "rue", "bonjour", "beaucoup"],
        successCriteria: ["Attempts throat R in 'rouge'", "Attempts rounded U in 'rue'", "Does not pronounce the final P in 'beaucoup'"],
        hints: ["For 'rouge': try a gentle gargle at the back of your throat", "For 'rue': round your lips as if saying 'oo' but keep your tongue saying 'ee'"],
      },
    ],
    culturalNotes: [
      {
        title: "Why French Spelling Looks Weird",
        content: "French spelling preserves the Latin and Old French origins of words — it's essentially a fossil record of how French sounded 500 years ago. The word 'beaucoup' (much/a lot) derives from Old French 'beau cop' (fine blow). Modern pronunciation dropped the sounds but kept the letters. This is why French spelling feels arbitrary: it's history, not logic.",
        region: "France",
      },
    ],
  },

  // ── LESSON 2 ── Nasal Vowels & Liaison ───────────────────
  {
    id: "fr-l2",
    slug: "nasal-vowels-liaison",
    title: "Nasal Vowels & Liaison — Sounds That Don't Exist in English",
    content: `# Nasal Vowels & Liaison

Two features of French that completely confuse English speakers: **nasal vowels** (sounds made through your nose) and **liaison** (linking words together). Master these and your French will immediately sound more authentic.

\`\`\`concept
{ "title": "What Is a Nasal Vowel?", "variant": "info", "content": "A nasal vowel is a vowel where air flows through BOTH your mouth AND your nose simultaneously. English has no nasal vowels (though nasals exist in consonants like 'm' and 'n'). French has 4 nasal vowels. The key: when you see a vowel followed by 'm' or 'n' in the SAME syllable, the vowel becomes nasal and the 'm'/'n' often disappears." }
\`\`\`

## The 4 French Nasal Vowels

| Written | Sound | Like... | Example | Meaning |
|---------|-------|---------|---------|---------|
| **an / en / am / em** | ã | "on" in "ponder" (no final n) | enfant, manger | child, to eat |
| **in / ain / ein / im** | ɛ̃ | "an" in "ranch" (no final n) | vin, pain, impossible | wine, bread |
| **on / om** | ɔ̃ | "on" in "song" (no final n) | bon, maison | good, house |
| **un / um** | œ̃ | "un" in "uncle" (no final n, rounded) | un, brun | a/one, brown |

\`\`\`concept
{ "title": "The Nasal Rule: When Does a Vowel Nasalise?", "variant": "analogy", "content": "A vowel nasalises when it's followed by M or N in the SAME syllable AND the M/N is NOT followed by another vowel.\\n\\n• 'bon' → nasal (b-ON, one syllable, N is final) → bõ\\n• 'bonne' → NOT nasal (bon-ne, N followed by E) → regular 'o'\\n• 'en' → nasal (one syllable) → ã\\n• 'ennui' → NOT nasal (en-nui, first N followed by another vowel cluster)" }
\`\`\`

## Liaison — Words That Merge

In French, when a word ending in a (normally silent) consonant is followed by a word starting with a vowel or silent H, the consonant is **pronounced and linked** to the next word.

\`\`\`steps
{ "title": "How Liaison Works", "steps": [ { "title": "Identify the final consonant", "description": "The word 'les' ends in 's' (silent in isolation). The word 'amis' starts with 'a' (vowel)." }, { "title": "Link them together", "description": "'les amis' → 'lay-ZAH-mee'. The S from 'les' links to 'amis' and sounds like Z." }, { "title": "Note the sound change", "description": "In liaison, S sounds like Z, D sounds like T, F sounds like V. 'neuf ans' → 'nuh-VAHNS' (nine years, F→V)." }, { "title": "Mandatory vs optional liaison", "description": "After 'les', 'des', 'mes', 'ces', 'nous', 'vous', liaison is MANDATORY. After a noun liaison is optional/avoided in careful speech." } ] }
\`\`\`

## Liaison Examples in Real French

| Phrase | Written | Spoken | Note |
|--------|---------|--------|------|
| the friends | les amis | lay-ZAH-mee | s → z in liaison |
| a man | un homme | uh-NOHM | n links to homme |
| nine years | neuf ans | nuh-VAHNS | f → v in liaison |
| we have | nous avons | noo-ZAH-vohn | s → z in liaison |
| in England | en Angleterre | ahn-ahn-gluh-TEHR | n links |

\`\`\`quiz
{ "question": "How is 'les enfants' (the children) pronounced in French?", "options": ["'lay on-FAHN' — the S is silent, enfants starts separately", "'lay-ZAHN-fahn' — S from 'les' links to 'enfants' as Z", "'lez EN-fants' — the final S is pronounced as S", "'lay AN-fahn' — no liaison occurs after 'les'"], "answer": 1, "explanation": "Liaison after 'les' is MANDATORY. The silent S in 'les' links to 'enfants' (which starts with a vowel) and is pronounced as Z. So: 'lay-ZAHN-fahn'. The final 'ts' in 'enfants' is also silent." }
\`\`\`

\`\`\`quiz
{ "question": "Which vowel sequence creates a NASAL vowel in French?", "options": ["'ou' as in 'vous' (you)", "'eu' as in 'deux' (two)", "'on' as in 'bon' (good)", "'ai' as in 'mais' (but)"], "answer": 2, "explanation": "'on' in 'bon' nasalises: the O is pronounced through nose and mouth simultaneously and the N is swallowed into the vowel → 'bõ'. The other combinations don't involve the nasal vowel rule." }
\`\`\`

\`\`\`takeaways
{ "points": ["French has 4 nasal vowels: an/en (ã), in/ain (ɛ̃), on (ɔ̃), un (œ̃) — air flows through nose AND mouth", "A vowel nasalises when M/N follows in the SAME syllable and is NOT followed by another vowel", "Liaison links a final silent consonant to the next word's opening vowel — S sounds like Z, D like T", "Liaison after les/des/mes/ces/nous/vous is MANDATORY", "Nasal vowels + liaison are what give French its characteristic flowing, musical sound"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m1",
    moduleTitle: "The Sound Machine",
    order: 2,
    topicId: "fr-m1-l2-nasals-liaison",
    vocabulary: [
      { word: "enfant", translation: "child", pronunciation: "ahn-FAHN (nasal 'an')", exampleSentence: "L'enfant joue dans le jardin.", exampleTranslation: "The child plays in the garden.", partOfSpeech: "noun" },
      { word: "vin", translation: "wine", pronunciation: "vaN (nasal 'in')", exampleSentence: "Un verre de vin, s'il vous plaît.", exampleTranslation: "A glass of wine, please.", partOfSpeech: "noun" },
      { word: "bon", translation: "good", pronunciation: "bõ (nasal 'on')", exampleSentence: "C'est très bon !", exampleTranslation: "It's very good!", partOfSpeech: "adjective" },
      { word: "maison", translation: "house / home", pronunciation: "meh-ZÕ (nasal 'on')", exampleSentence: "Je suis à la maison.", exampleTranslation: "I'm at home.", partOfSpeech: "noun" },
      { word: "nous avons", translation: "we have", pronunciation: "noo-ZAH-vohn (liaison: S→Z)", exampleSentence: "Nous avons faim.", exampleTranslation: "We are hungry.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Elision — When Final E or A Drops Before a Vowel",
        explanation: "Similar to liaison, **elision** happens when 'le', 'la', 'je', 'me', 'te', 'se', 'de', 'ne', 'que' lose their final vowel before a word starting with a vowel or silent H. Written with an apostrophe.",
        examples: [
          { correct: "le + ami → l'ami", translation: "the friend (masc) — 'le' loses its E" },
          { correct: "je + ai → j'ai", translation: "I have — 'je' loses its E" },
          { correct: "de + eau → d'eau", translation: "of water — 'de' loses its E" },
        ],
        commonMistakes: [
          { incorrect: "le ami", correction: "l'ami", explanation: "When 'le' or 'la' precedes a vowel, elision is MANDATORY — you cannot say 'le ami'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m1-l2-voice",
        title: "Ordering in a Parisian Bistro",
        situation: "You are ordering wine and food in a Paris bistro — liaison and nasal vowels all around you",
        agentRole: "You are Antoine, a classic Parisian waiter. Speak naturally at a relaxed pace, use liaison normally. Ask what the student wants to eat and drink.",
        userGoal: "Order a glass of red wine and ask for the menu",
        targetPhrases: ["un verre de vin rouge", "la carte, s'il vous plaît", "bon"],
        successCriteria: ["Attempts nasal vowel in 'vin'", "Attempts nasal vowel in 'bon'", "Makes a polite request"],
        hints: ["'Un verre de vin rouge' = a glass of red wine", "'La carte, s'il vous plaît' = the menu please"],
      },
    ],
    culturalNotes: [
      {
        title: "The Music of French — Why It Sounds Like That",
        content: "French has a remarkably even rhythm — syllables are roughly equal in length (unlike English which has strong stress patterns). This is called **syllable-timed rhythm**, as opposed to English's **stress-timed** rhythm. This is why French sounds like a flowing melody to English ears: no single syllable is hammered hard. The closest English analogy is how a native speaker says 'uh-lay-ZAH-mee' for 'les amis' — smooth, even, connected.",
        region: "France",
      },
    ],
  },

  // ── LESSON 3 ── Accents & Spelling Rules ─────────────────
  {
    id: "fr-l3",
    slug: "accents-spelling",
    title: "Accents & Spelling — The Marks That Change Everything",
    content: `# Accents & French Spelling

French has 5 accent marks. For English speakers who consider accents decorative, this is a critical mindset shift: **in French, accents are part of the spelling**. Omitting them is a spelling error. And they're not decoration — they change pronunciation and meaning.

\`\`\`concept
{ "title": "Accents Are Pronunciation Instructions AND Meaning Distinguishers", "variant": "warning", "content": "Two French words can be spelled with the same letters but mean completely different things based on accents:\\n• 'ou' = or (conjunction) → 'où' = where (question word)\\n• 'a' = has (verb avoir) → 'à' = to/at (preposition)\\n• 'du' = some/of the → Duhamel (name, different)\\nSkipping accents isn't lazy — it's wrong in a way that changes the sentence." }
\`\`\`

## The 5 French Accent Marks

| Mark | Name | On Which Letters | Effect |
|------|------|-----------------|--------|
| **é** | accent aigu | e only | Changes E to "ay" sound (like English "say") |
| **è / ê / ë** | accent grave / circonflexe / tréma | e (also à, ù for grave; ï, ü for tréma) | Changes E to open "eh" sound (like "bed") |
| **ô / â / î / û** | accent circonflexe | a, e, i, o, u | Lengthens vowel; historical marker (often replaced silent S) |
| **ç** | cédille | c only | Forces C to make "S" sound before a, o, u |
| **ë / ï** | tréma | e, i, u | Forces the vowel to be pronounced separately from the preceding vowel |

\`\`\`concept
{ "title": "The Circonflexe: A Window Into French History", "variant": "analogy", "content": "The circumflex accent (^) often marks where Latin had an 'S' that French dropped in the Middle Ages. Compare:\\n• French 'hôpital' ← Latin 'hospitalis' (hospital)\\n• French 'fête' ← Latin 'festa' (feast, festival)\\n• French 'forêt' ← Old French 'forest'\\n• French 'île' ← Latin 'insula' (island)\\nNoticing the corresponding English word often helps you remember the French spelling." }
\`\`\`

## The Cédille — Making C Soft

Normally in French:
- C before **a, o, u** = hard K sound: *cadeau* (gift), *comment* (how), *culture*
- C before **e, i, y** = soft S sound: *ceci* (this), *cinéma*

The **ç (cédille)** forces a soft S sound even before a, o, u:

| Word | Meaning | Without ç | With ç |
|------|---------|-----------|--------|
| français | French | "fran-KAY" (wrong) | "fran-SEH" (correct) |
| ça va | how's it going | "ka va" (wrong) | "sa va" (correct) |
| garçon | boy/waiter | "gar-KON" (wrong) | "gar-SON" (correct) |

\`\`\`compare
{ "title": "Accents That Change Meaning vs Accents That Change Sound", "left": { "label": "Changes meaning only (same or similar pronunciation)", "items": ["ou (or) → où (where)", "a (has) → à (at/to)", "la (the) → là (there)", "du (some) → dû (owed, past participle)"] }, "right": { "label": "Changes pronunciation", "items": ["e (silent/uh) → é (ay)", "e → è/ê (open 'eh')", "c (k sound) → ç (s sound)", "ë/ï (tréma = pronounce separately)"] } }
\`\`\`

## The Tréma — Separate the Vowels

When you see **ë** or **ï**, pronounce both vowels separately. This resolves ambiguous vowel combinations:

- **Noël** → "noh-EL" (not "nwel") — Christmas
- **naïf** → "nah-EEF" (not "nayf") — naive/gullible
- **Citroën** → "see-troh-EN" (not "see-trwen") — yes, the car brand!

\`\`\`quiz
{ "question": "What does the cédille (ç) do in the word 'français'?", "options": ["It makes the word look more elegant and French", "It forces the C to sound like S instead of K before the letter A", "It lengthens the vowel sound in 'an'", "It means the C is silent"], "answer": 1, "explanation": "Without the cédille, 'c' before 'a' would be a hard K sound — 'fran-KAY'. The cédille forces a soft S sound — 'fran-SEH'. Cédilles appear whenever C needs to be soft (S sound) before a, o, or u." }
\`\`\`

\`\`\`quiz
{ "question": "What is the difference between 'ou' and 'où' in French?", "options": ["There is no difference — they mean the same thing", "'ou' means 'or', 'où' means 'where' — completely different words", "'ou' is informal, 'où' is formal for the same word 'or'", "'où' is the plural of 'ou'"], "answer": 1, "explanation": "The accent grave on 'où' turns 'or' into 'where'. 'Vous venez ici ou là ?' = Are you coming here or there? 'Où habitez-vous ?' = Where do you live? Same letters, opposite meanings — accents matter!" }
\`\`\`

\`\`\`takeaways
{ "points": ["French has 5 accent marks: aigu (é), grave/circonflexe/tréma on other vowels, and cédille (ç)", "Accents are mandatory spelling — omitting them changes meaning or is simply wrong", "é = 'ay' sound (café); è/ê = open 'eh' sound (mère, fête)", "ç forces C to sound like S before a, o, u — français, ça, garçon", "ë/ï (tréma) means pronounce both vowels separately — Noël, naïf"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m1",
    moduleTitle: "The Sound Machine",
    order: 3,
    topicId: "fr-m1-l3-accents",
    vocabulary: [
      { word: "français / française", translation: "French (masc/fem)", pronunciation: "frahn-SEH / frahn-SEHZ", exampleSentence: "Je parle français.", exampleTranslation: "I speak French.", partOfSpeech: "adjective" },
      { word: "ça va", translation: "how's it going / fine", pronunciation: "SAH-vah (ç = soft S)", exampleSentence: "Ça va bien, merci.", exampleTranslation: "I'm fine, thank you.", partOfSpeech: "phrase" },
      { word: "où", translation: "where", pronunciation: "OO (accent distinguishes from 'ou')", exampleSentence: "Où est la gare ?", exampleTranslation: "Where is the train station?", partOfSpeech: "adverb" },
      { word: "à", translation: "at / to / in", pronunciation: "AH (accent distinguishes from 'a' = has)", exampleSentence: "Je suis à Paris.", exampleTranslation: "I am in Paris.", partOfSpeech: "preposition" },
      { word: "fête", translation: "party / festival / celebration", pronunciation: "FEHT (circumflex = open 'eh', from Latin 'festa')", exampleSentence: "La fête est demain.", exampleTranslation: "The party is tomorrow.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "à vs a — The Most Common Written Error",
        explanation: "'**a**' is the third person singular of *avoir* (to have): *Il a faim* (He is hungry). '**à**' is the preposition meaning *at/to/in*: *Je suis à Paris* (I'm in Paris). The accent on 'à' exists solely to distinguish the two — they sound identical.",
        examples: [
          { correct: "Elle a un chat.", translation: "She HAS a cat. (verb avoir)" },
          { correct: "Je vais à Lyon.", translation: "I'm going TO Lyon. (preposition)" },
          { correct: "Il est à la maison.", translation: "He is AT home. (preposition)" },
        ],
        commonMistakes: [
          { incorrect: "Je suis a Paris.", correction: "Je suis à Paris.", explanation: "Without the accent, 'a' is the verb 'has'. The sentence would mean 'I am has Paris' — nonsense." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m1-l3-voice",
        title: "Spell It Out — At a French Post Office",
        situation: "You need to spell your name and address in French at the post office",
        agentRole: "You are the post office clerk Lucie. Ask the customer for their name, then their address. Ask them to spell difficult parts.",
        userGoal: "Spell your name and address letter by letter in French, including any accent marks",
        targetPhrases: ["Je m'appelle...", "Mon adresse est...", "avec un accent"],
        successCriteria: ["Attempts to spell name in French", "Mentions accents where relevant", "Uses polite register"],
        hints: ["To say 'with an accent': 'avec un accent aigu/grave'", "Letters: a=ah, e=uh, i=ee, o=oh, u=ü"],
      },
    ],
    culturalNotes: [
      {
        title: "French Typography: Spaces Before Punctuation",
        content: "French punctuation has a quirk that confuses English speakers: **spaces before certain marks**. In proper French typography, a non-breaking space appears before '!', '?', ':', ';', and '«' (opening guillemet quotation mark). So: *Comment allez-vous ?* (not *Comment allez-vous?*). French also uses «guillemets» instead of \"quotation marks\". This is why French text looks slightly different — it follows a different typographic standard established in the 16th century.",
        region: "France",
      },
    ],
  },

  // ── LESSON 4 ── Greetings & First Conversations ──────────
  {
    id: "fr-l4",
    slug: "greetings-first-conversations",
    title: "Bonjour ! Greetings, Politeness & First Conversations",
    content: `# Bonjour ! Your First Conversations in French

You now have the sound tools. Time to use them. French politeness culture is more formal than American or British culture — greetings are a social ritual that signals respect. Getting these right makes an enormous difference to how French speakers receive you.

\`\`\`concept
{ "title": "The Greeting Rule: Always Greet Before Anything Else", "variant": "warning", "content": "In France, walking into a shop, café, or office without saying 'Bonjour' first is considered rude — equivalent to barging in. The greeting is not optional small talk; it's an acknowledgement that the other person exists and deserves your respect. Always 'Bonjour' before asking for anything. 'Au revoir' (goodbye) when leaving is equally mandatory." }
\`\`\`

## Core Greetings — When to Use Each

| Greeting | Meaning | Use When |
|----------|---------|----------|
| **Bonjour** | Good morning / Hello | Any time until ~6pm; ALL formal situations |
| **Bonsoir** | Good evening | After ~6pm |
| **Salut** | Hi / Hey | Friends and peers only; NEVER to strangers/elders |
| **Coucou** | Hey (very warm) | Close friends and family only |
| **Au revoir** | Goodbye | Any situation — always say it |
| **À bientôt** | See you soon | When you expect to see them again |
| **À tout à l'heure** | See you later today | Same day |
| **Bonne journée** | Have a good day | Leaving in the morning/afternoon |
| **Bonne soirée** | Have a good evening | Leaving in the evening |

\`\`\`concept
{ "title": "Vous vs Tu — The Politeness Divide", "variant": "info", "content": "French has TWO words for 'you':\\n\\n**VOUS** = formal/plural you. Use with: strangers, shop assistants, anyone older, your boss, teachers, officials. When in doubt, USE VOUS.\\n\\n**TU** = informal/singular you. Use with: close friends, family, children, fellow students you know well, and people who explicitly say 'On peut se tutoyer ?' (Can we use tu?).\\n\\nMistakenly using TU with a stranger signals either disrespect or ignorance. Using VOUS with a close friend signals coldness. The French themselves navigate this carefully." }
\`\`\`

## Asking and Answering "How Are You?"

| Question | Register | Response options |
|----------|----------|-----------------|
| **Comment allez-vous ?** | Formal (vous) | Très bien, merci. Et vous ? |
| **Comment vas-tu ?** | Informal (tu) | Bien, merci. Et toi ? |
| **Ça va ?** | Casual | Ça va (bien) ! / Pas mal. / Comme ci comme ça. |
| **Quoi de neuf ?** | Slang (close friends) | Pas grand-chose. / Rien de spécial. |

## Key Polite Expressions

| French | English | Notes |
|--------|---------|-------|
| **S'il vous plaît** | Please (formal) | Always use this with strangers |
| **S'il te plaît** | Please (informal) | With friends and family |
| **Merci (beaucoup)** | Thank you (very much) | Universal |
| **De rien / Je vous en prie** | You're welcome | De rien = casual; Je vous en prie = formal |
| **Pardon** | Excuse me (bumping into someone) | Also: Pardon ? = Sorry, what? |
| **Excusez-moi** | Excuse me (getting attention) | More intentional than Pardon |
| **Je suis désolé(e)** | I'm sorry (genuine apology) | Add -e if you're female |

\`\`\`steps
{ "title": "The Perfect French Introduction Sequence", "steps": [ { "title": "Greet", "description": "Bonjour ! (in any formal context) or Salut ! (with peers)" }, { "title": "Introduce yourself", "description": "Je m'appelle [your name]. / Je suis [your name]." }, { "title": "Ask their name", "description": "Formal: Comment vous appelez-vous ? / Informal: Tu t'appelles comment ?" }, { "title": "Say where you're from", "description": "Je suis anglais(e) / américain(e) / australien(ne). / Je viens d'Angleterre / des États-Unis." }, { "title": "Close politely", "description": "Au revoir ! Bonne journée / Bonne soirée !" } ] }
\`\`\`

\`\`\`quiz
{ "question": "You walk into a boulangerie (bakery) in Paris to buy a baguette. What do you say FIRST?", "options": ["'Une baguette, s'il vous plaît.' — get straight to the point", "'Bonjour !' — always greet before requesting anything", "'Excusez-moi !' — to get the baker's attention", "'Salut !' — to be friendly and casual"], "answer": 1, "explanation": "In French culture, you MUST greet before making any request. Walking in and immediately asking for something is considered rude. 'Bonjour !' first, then your request. Also: 'Salut' would be inappropriate with a stranger/shopkeeper — that's for friends only." }
\`\`\`

\`\`\`quiz
{ "question": "Your French colleague (roughly your age, known for 2 weeks) asks 'On peut se tutoyer ?' — what does this mean?", "options": ["Can we speak English together?", "Can we use informal 'tu' instead of formal 'vous' with each other?", "Can we meet for lunch together?", "Can we work on this project together?"], "answer": 1, "explanation": "'Se tutoyer' is the verb meaning 'to use tu with each other'. This question is an explicit social invitation to move from the formal vous-relationship to the informal tu-relationship. The correct response is 'Bien sûr !' (Of course!) or 'Avec plaisir !' (With pleasure!)" }
\`\`\`

\`\`\`takeaways
{ "points": ["Always say 'Bonjour' before making ANY request in a shop, café, office, or when meeting someone", "'Salut' is ONLY for friends — using it with strangers reads as rude or childish", "French has two 'you': VOUS (formal/plural) and TU (informal/singular) — when uncertain, default to VOUS", "'Je m'appelle...' = My name is... (lit. I call myself) — the standard introduction", "Farewells matter too: 'Au revoir' + 'Bonne journée/soirée' is the polite exit ritual"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m1",
    moduleTitle: "The Sound Machine",
    order: 4,
    topicId: "fr-m1-l4-greetings",
    vocabulary: [
      { word: "bonjour", translation: "hello / good morning", pronunciation: "bohn-ZHOOR", exampleSentence: "Bonjour, une baguette s'il vous plaît.", exampleTranslation: "Hello, a baguette please.", partOfSpeech: "interjection" },
      { word: "au revoir", translation: "goodbye", pronunciation: "oh-ruh-VWAHR", exampleSentence: "Au revoir, bonne journée !", exampleTranslation: "Goodbye, have a good day!", partOfSpeech: "interjection" },
      { word: "s'il vous plaît", translation: "please (formal)", pronunciation: "seel-voo-PLEH", exampleSentence: "L'addition, s'il vous plaît.", exampleTranslation: "The bill, please.", partOfSpeech: "phrase" },
      { word: "je m'appelle", translation: "my name is (I call myself)", pronunciation: "zhuh-mah-PEHL", exampleSentence: "Je m'appelle Sophie.", exampleTranslation: "My name is Sophie.", partOfSpeech: "phrase" },
      { word: "enchanté(e)", translation: "pleased to meet you", pronunciation: "ahn-shahn-TAY", exampleSentence: "Enchanté, je suis Paul.", exampleTranslation: "Pleased to meet you, I'm Paul.", partOfSpeech: "adjective" },
      { word: "ça va", translation: "how's it going / I'm fine", pronunciation: "SAH-vah", exampleSentence: "Ça va, et toi ?", exampleTranslation: "I'm fine, and you?", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Je m'appelle — Reflexive Verbs: A First Glimpse",
        explanation: "'Je m'appelle' literally means 'I call myself'. The 'm'' is a reflexive pronoun — you'll learn these fully later. For now, just memorise the pattern: *je m'appelle, tu t'appelles, il/elle s'appelle, nous nous appelons, vous vous appelez, ils/elles s'appellent*. Notice the double-L in all forms except nous/vous.",
        examples: [
          { correct: "Je m'appelle Marie.", translation: "My name is Marie." },
          { correct: "Comment tu t'appelles ?", translation: "What's your name? (informal)" },
          { correct: "Il s'appelle Thomas.", translation: "His name is Thomas." },
        ],
        commonMistakes: [
          { incorrect: "Je m'appele Thomas.", correction: "Je m'appelle Thomas.", explanation: "The verb s'appeler doubles the L in most conjugations — je m'appELLE, not appele." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m1-l4-voice",
        title: "First Meeting at a Language Exchange",
        situation: "You arrive at a French-English language exchange meetup in Lyon",
        agentRole: "You are Claire, a friendly French woman at the language exchange. Greet the student warmly, ask their name, where they're from, and why they're learning French.",
        userGoal: "Introduce yourself, say where you're from, and say why you're learning French",
        targetPhrases: ["Bonjour", "Je m'appelle", "Je viens de", "J'apprends le français parce que"],
        successCriteria: ["Uses 'Bonjour' to open", "Gives their name with 'je m'appelle'", "States their origin", "Attempts to explain why they study French"],
        hints: ["'Je viens de Londres / New York' = I'm from London / New York", "'J'apprends le français pour...' = I'm learning French for..."],
      },
    ],
    culturalNotes: [
      {
        title: "La Bise — The Cheek Kiss Greeting",
        content: "When French friends and family greet each other in person, they exchange **la bise** — light cheek kisses. The number varies by region (2 in Paris, 3 in Provence, 4 in some areas of Normandy). For formal meetings or first-time encounters, a firm handshake is standard. During COVID, la bise reduced significantly. Among younger generations in Paris, a simple nod or hug is also common. When meeting someone new: let them initiate — they'll indicate whether to shake hands or do la bise.",
        region: "France",
      },
    ],
  },
];

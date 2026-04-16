import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────
// MODULE 3: The Gender Problem (4 lessons)
// The #1 stumbling block for English speakers — tackled head-on.
// More lessons here because this concept underpins ALL of French.
// ─────────────────────────────────────────────────────────

export const genderProblemLessons: LanguageLesson[] = [
  // ── LESSON 8 ── What Is Grammatical Gender? ──────────────
  {
    id: "fr-l8",
    slug: "grammatical-gender",
    title: "Grammatical Gender — The System Behind Everything in French",
    content: `# Grammatical Gender — The System Behind Everything

This is the hardest conceptual leap for English speakers. In French, **every noun is either masculine or feminine** — not based on biology, but as a grammatical classification. This gender then ripples through the ENTIRE sentence: articles, adjectives, pronouns, and past participles all change to match.

\`\`\`concept
{ "title": "Why Does French Have Grammatical Gender?", "variant": "analogy", "content": "Grammatical gender comes from Latin, which French evolved from. Latin had 3 genders (masculine, feminine, neuter); French simplified to 2. The gender of French nouns is mostly inherited from Latin and is now arbitrary — 'la table' (table) is feminine not because tables are female, but because the Latin 'tabula' was feminine. Over centuries, gender became a classification system, like a file folder — nouns are sorted into two folders and everything related to them follows that folder's rules." }
\`\`\`

## The Ripple Effect of Gender

When a noun is masculine or feminine, it affects EVERYTHING connected to it:

| Element | Masculine (table = la table?... no — la table is fem) | Feminine example |
|---------|------|---------|
| Definite article | **le** livre (book) | **la** table (table) |
| Indefinite article | **un** livre | **une** table |
| Adjective | **le livre** rouge → rouge | **la table** ronde → ronde |
| Pronoun | **Il** est grand. (book → he/it) | **Elle** est grande. (table → she/it) |
| Possessive | **mon** livre | **ma** table |

\`\`\`concept
{ "title": "The Crucial Mindset Shift", "variant": "warning", "content": "Stop trying to find the LOGIC of French gender. There often isn't one. Instead:\\n\\n1. Learn every noun WITH its article: not 'livre', but 'le livre'. Not 'table', but 'la table'.\\n\\n2. When in doubt, guess masculine — there are roughly 60% masculine nouns in French.\\n\\n3. Use patterns (see below) to guess correctly ~75% of the time.\\n\\nThe goal is not to understand WHY — it's to internalise the SYSTEM." }
\`\`\`

## Pattern-Based Gender Guessing (75% Accurate)

Many noun endings predict gender reliably:

**Usually MASCULINE:**
| Ending | Examples |
|--------|---------|
| -age | le fromage (cheese), le village, le voyage |
| -ment | le département, le gouvernement, le moment |
| -eau | le bureau (desk), le chapeau (hat), le gâteau (cake) |
| -isme | le tourisme, le capitalisme |
| -phone / -scope / -gramme | le téléphone, le télescope, le programme |

**Usually FEMININE:**
| Ending | Examples |
|--------|---------|
| -tion / -sion | la nation, la décision, la solution |
| -té / -tié | la liberté, la beauté, la moitié (half) |
| -ure | la nature, la culture, la voiture (car!) |
| -ance / -ence | la chance, la différence, la patience |
| -ette | la baguette, la cassette, la cigarette |
| -ise | la franchise, larise |

\`\`\`compare
{ "title": "Tricky Exceptions — Nouns That Defy Expectations", "left": { "label": "Looks feminine but is MASCULINE", "items": ["le problème (problem) — -ème is masculine", "le système (system)", "le programme (programme)", "le musée (museum) — -ée is often masc", "le lycée (high school)"] }, "right": { "label": "Looks masculine but is FEMININE", "items": ["la main (hand) — doesn't fit patterns", "la nuit (night)", "la forêt (forest)", "la dent (tooth)", "la clé / clef (key)"] } }
\`\`\`

## Biological Gender vs Grammatical Gender

For people and animals, gender often follows biology — but not always:

| Word | Gender | Note |
|------|--------|------|
| le professeur | masculine | even when referring to a woman in traditional French |
| la personne | feminine | even when referring to a man |
| le bébé | masculine | even for a baby girl |
| la victime | feminine | even for a male victim |
| la sentinelle | feminine | even for a male guard |

\`\`\`quiz
{ "question": "The French word for 'solution' — what gender is it based on its ending?", "options": ["Masculine — because solutions are logical/rational", "Feminine — because it ends in -tion", "Masculine — because it's a Latin word", "It could be either — French gender is completely random"], "answer": 1, "explanation": "Words ending in -tion are almost always feminine in French: la solution, la nation, la décision, la révolution. This is one of the most reliable gender patterns. The gender has nothing to do with the concept being 'rational' — that's a false folk etymology." }
\`\`\`

\`\`\`quiz
{ "question": "Which strategy is MOST effective for learning French noun gender?", "options": ["Try to understand the logical reason for each noun's gender", "Learn every noun as 'le [noun]' or 'la [noun]' — article included", "Just guess masculine for every noun since most nouns are masculine", "Memorise only the exceptions to the pattern rules"], "answer": 1, "explanation": "The most effective strategy is to memorise every noun WITH its article as a single unit: 'le livre', 'la table', 'le problème'. This way you automatically know the gender whenever you use the word. Pure masculine guessing is only 60% accurate; learning with articles gets you to near 100%." }
\`\`\`

\`\`\`takeaways
{ "points": ["Every French noun is masculine or feminine — this grammatical gender is inherited from Latin and often arbitrary", "Gender ripples through the entire sentence: articles, adjectives, pronouns, past participles all must match", "Learn nouns WITH their article: 'le livre', 'la table' — never 'livre' alone", "-tion/-sion endings → almost always feminine; -age/-ment/-eau endings → usually masculine", "When guessing, masculine is slightly more common (~60%) but always try to use the article you know"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m3",
    moduleTitle: "The Gender Problem",
    order: 1,
    topicId: "fr-m3-l8-gender",
    vocabulary: [
      { word: "le livre", translation: "the book (masc)", pronunciation: "luh LEEVR", exampleSentence: "Le livre est intéressant.", exampleTranslation: "The book is interesting.", partOfSpeech: "noun" },
      { word: "la table", translation: "the table (fem)", pronunciation: "lah TAHBL", exampleSentence: "La table est grande.", exampleTranslation: "The table is big.", partOfSpeech: "noun" },
      { word: "le problème", translation: "the problem (masc — despite -ème)", pronunciation: "luh proh-BLEM", exampleSentence: "C'est un grand problème.", exampleTranslation: "That's a big problem.", partOfSpeech: "noun" },
      { word: "la voiture", translation: "the car (fem — -ure ending)", pronunciation: "lah vwah-TÜR", exampleSentence: "Ma voiture est rouge.", exampleTranslation: "My car is red.", partOfSpeech: "noun" },
      { word: "le bâtiment", translation: "the building (masc — -ment ending)", pronunciation: "luh bah-tee-MAHN", exampleSentence: "Le bâtiment est très vieux.", exampleTranslation: "The building is very old.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Making Nouns Plural — Adding S (Usually)",
        explanation: "Most French nouns form their plural by adding **-s** (which is silent in speech): *le livre → les livres*. But the article changes: **le/la → les**, **un/une → des**. Special cases: nouns ending in -al change to -aux (*le journal → les journaux*); nouns ending in -eau add -x (*le bateau → les bateaux*); nouns ending in -s, -x, -z don't change (*le bras → les bras*).",
        examples: [
          { correct: "le chat → les chats", translation: "the cat → the cats (adds silent -s)" },
          { correct: "le journal → les journaux", translation: "the newspaper → the newspapers (-al → -aux)" },
          { correct: "le beau gâteau → les beaux gâteaux", translation: "the beautiful cake → -eau → -eaux" },
        ],
        commonMistakes: [
          { incorrect: "les livres sont sur le tables", correction: "les livres sont sur les tables", explanation: "Don't forget 'la' → 'les' for plural: 'sur la table' (singular) → 'sur les tables' (plural)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m3-l8-voice",
        title: "Shopping List at the Marché",
        situation: "You are at a French outdoor market trying to identify items by pointing at them",
        agentRole: "You are the market seller Jean-Pierre. Point to various items and ask the student what each one is called and what gender it is.",
        userGoal: "Name 5 items with their correct article (le/la)",
        targetPhrases: ["C'est le/la...", "C'est un/une...", "Le/la ... est beau/belle"],
        successCriteria: ["Uses correct article (le/la) for at least 3 items", "Recognises masculine vs feminine pattern for at least one item"],
        hints: ["For items you're not sure about: guess! And learn from corrections", "'C'est quoi ça ?' = What's that?"],
      },
    ],
    culturalNotes: [
      {
        title: "The French Academy's Battle Over Gender",
        content: "The Académie française, founded in 1635, is the official guardian of the French language. For decades, they resisted feminising job titles — insisting 'le professeur', 'le médecin', 'le ministre' even when referring to women. This changed officially in 2019 when the French government endorsed feminine job titles: 'la professeure', 'la médecin', 'la ministre'. However, many traditional speakers still use masculine titles, and this remains a live cultural debate in France.",
        region: "France",
      },
    ],
  },

  // ── LESSON 9 ── Articles ──────────────────────────────────
  {
    id: "fr-l9",
    slug: "articles",
    title: "Articles — le, la, l', les, un, une, des",
    content: `# Articles in French

French has three types of articles: **definite** (the), **indefinite** (a/an, some), and **partitive** (some of a substance). All three must agree with the gender and number of the noun they introduce.

\`\`\`concept
{ "title": "Why French Has More Articles Than English", "variant": "info", "content": "English has just 3 article words: 'the', 'a', 'an'. French has 6 forms for definite articles alone, plus indefinite and partitive articles — 10+ article forms in total. The reason: French articles carry more grammatical information (gender + number) than English articles. Once you internalise the system, it becomes automatic." }
\`\`\`

## Definite Articles (the) — le, la, l', les

| | Masculine | Feminine | Before vowel/silent H |
|-|-----------|----------|----------------------|
| Singular | **le** | **la** | **l'** |
| Plural | **les** | **les** | **les** |

- **le** livre (the book), **le** pain (the bread)
- **la** table (the table), **la** maison (the house)
- **l'** ami (the friend, masc), **l'** amie (the friend, fem), **l'** hôtel (the hotel — H is silent)
- **les** livres (the books), **les** tables (the tables)

\`\`\`concept
{ "title": "When to Use Definite Articles — Very Different from English", "variant": "warning", "content": "French uses definite articles much more than English. You use 'le/la/les' for:\\n\\n1. Specific things (like English 'the'): 'Le livre sur la table' = The book on the table.\\n\\n2. General categories (UNLIKE English): 'J'aime le chocolat' = I like chocolate (in general). English: 'I like chocolate' (no 'the'). French: always uses the article for general statements.\\n\\n3. Languages (after aimer, préférer): 'J'aime le français' — but NOT after 'parler': 'je parle français'.\\n\\n4. Countries: 'la France', 'le Japon', 'les États-Unis'." }
\`\`\`

## Indefinite Articles (a/an, some) — un, une, des

| | Masculine | Feminine |
|-|-----------|----------|
| Singular | **un** | **une** |
| Plural | **des** | **des** |

- **un** livre (a book), **un** ami (a friend, masc)
- **une** table (a table), **une** amie (a friend, fem)
- **des** livres (some books / books), **des** tables (some tables)

**Key difference from English:** French almost always uses **des** where English simply omits the article in plurals.

| English | French |
|---------|--------|
| I have books. | J'ai **des** livres. |
| She bought apples. | Elle a acheté **des** pommes. |
| There are students. | Il y a **des** étudiants. |

## Contractions — à + le and de + le

When **à** (at/to) or **de** (of/from) meets **le** or **les**, they contract:

| Combination | Contraction | Example |
|-------------|-------------|---------|
| à + le | **au** | Je vais **au** marché. (I go to the market.) |
| à + les | **aux** | Je parle **aux** étudiants. (I speak to the students.) |
| de + le | **du** | Je viens **du** marché. (I come from the market.) |
| de + les | **des** | Il parle **des** étudiants. (He speaks of the students.) |

**No contraction with la or l':**
- Je vais à **la** poste. (I go to the post office.)
- Je viens de **l'**école. (I come from school.)

\`\`\`quiz
{ "question": "Complete the sentence: 'J'aime ___ musique.' (I like music in general)", "options": ["un", "une", "la", "de"], "answer": 2, "explanation": "For general statements about liking/preferring a category, French uses the DEFINITE article: 'J'aime LA musique' — not 'une musique' (which would mean 'a music' = a specific piece). This is a key difference from English where you say 'I like music' with NO article." }
\`\`\`

\`\`\`quiz
{ "question": "Which is the correct contraction? 'Je vais ___ cinéma.' (I'm going to the cinema — 'cinéma' is masculine)", "options": ["à le cinéma", "au cinéma", "à la cinéma", "du cinéma"], "answer": 1, "explanation": "'à + le' MUST contract to 'au' — 'à le' never appears in correct French. Since 'cinéma' is masculine, it takes 'le': à + le cinéma = 'au cinéma'. This contraction is mandatory, not optional." }
\`\`\`

\`\`\`takeaways
{ "points": ["Definite articles: le (masc), la (fem), l' (before vowel/H), les (plural)", "Indefinite articles: un (masc), une (fem), des (plural) — used for non-specific items", "French uses definite articles for general statements: 'j'aime le chocolat' = I like chocolate (in general)", "à + le → au (mandatory contraction); à + les → aux; de + le → du; de + les → des", "'des' replaces the zero-article plurals of English: 'books' → 'des livres'"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m3",
    moduleTitle: "The Gender Problem",
    order: 2,
    topicId: "fr-m3-l9-articles",
    vocabulary: [
      { word: "le pain", translation: "the bread (masc)", pronunciation: "luh PAN", exampleSentence: "J'achète du pain à la boulangerie.", exampleTranslation: "I buy bread at the bakery.", partOfSpeech: "noun" },
      { word: "une boulangerie", translation: "a bakery (fem)", pronunciation: "ün boo-lahn-zhuh-REE", exampleSentence: "Il y a une boulangerie au coin de la rue.", exampleTranslation: "There is a bakery on the corner of the street.", partOfSpeech: "noun" },
      { word: "au marché", translation: "at/to the market", pronunciation: "oh mar-SHAY", exampleSentence: "Je vais au marché le samedi.", exampleTranslation: "I go to the market on Saturdays.", partOfSpeech: "phrase" },
      { word: "des pommes", translation: "some apples / apples", pronunciation: "day POM", exampleSentence: "J'ai acheté des pommes.", exampleTranslation: "I bought some apples.", partOfSpeech: "noun phrase" },
      { word: "j'aime le / la", translation: "I like (+ definite article for general)", pronunciation: "zhemm luh/lah", exampleSentence: "J'aime le café et la musique.", exampleTranslation: "I like coffee and music.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Negation Replaces Articles with 'de'",
        explanation: "In a negative sentence, **un, une, des** become **de** (or **d'** before a vowel). This also applies to partitive articles (du, de la). The definite article (le, la, les) does NOT change in negation.",
        examples: [
          { correct: "J'ai un chat. → Je n'ai pas de chat.", translation: "I have a cat. → I don't have a cat. (un → de)" },
          { correct: "Il mange des légumes. → Il ne mange pas de légumes.", translation: "He eats vegetables. → He doesn't eat vegetables. (des → de)" },
          { correct: "J'aime le café. → Je n'aime pas le café.", translation: "I like coffee. → I don't like coffee. (le stays le!)" },
        ],
        commonMistakes: [
          { incorrect: "Je n'ai pas un chat.", correction: "Je n'ai pas de chat.", explanation: "After negation (ne...pas), un/une/des become 'de'. Exception: with être, the article stays: 'Ce n'est pas un chat, c'est un chien.'" },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m3-l9-voice",
        title: "At the Fromagerie — Choosing Cheeses",
        situation: "You are at a specialist cheese shop in Paris",
        agentRole: "You are the fromagère (cheese seller) Hélène. Recommend cheeses to the student, ask what they prefer, and help them choose. Use 'le', 'la', 'un', 'une' naturally.",
        userGoal: "Ask about and select 2 types of cheese, ask prices",
        targetPhrases: ["Je voudrais", "avez-vous", "un morceau de", "c'est combien ?"],
        successCriteria: ["Uses correct article before cheese names", "Asks the price", "Makes a selection"],
        hints: ["'Je voudrais un morceau de camembert' = I'd like a piece of camembert", "'C'est combien ?' = How much is it?"],
      },
    ],
    culturalNotes: [
      {
        title: "Le Pain — Bread as Cultural Identity",
        content: "The French consume roughly 10 billion baguettes per year. The baguette is so culturally significant that in 2022 it was inscribed on UNESCO's Intangible Cultural Heritage list. By law, a 'baguette de tradition française' can only contain flour, water, salt, and yeast — no additives. Most French people buy their bread fresh daily from the local boulangerie. The boulangerie is also why French has 'du pain' (partitive article) rather than 'un pain' — pain is treated as an uncountable substance, not an individual object.",
        region: "France",
      },
    ],
  },

  // ── LESSON 10 ── Adjective Agreement ─────────────────────
  {
    id: "fr-l10",
    slug: "adjective-agreement",
    title: "Adjective Agreement — When Words Change Shape",
    content: `# Adjective Agreement in French

In English, adjectives never change: "the big man", "the big woman", "the big men" — 'big' stays 'big'. In French, adjectives **agree with the noun** they describe in both **gender** and **number**. This is grammar working at a different level than English, and it affects every descriptive sentence you'll ever write.

\`\`\`concept
{ "title": "The Agreement System: 4 Forms of Every Adjective", "variant": "info", "content": "Every French adjective has up to 4 forms:\\n• Masculine singular: grand\\n• Feminine singular: grande (add -e)\\n• Masculine plural: grands (add -s)\\n• Feminine plural: grandes (add -es)\\n\\nThe ending you use depends on the NOUN, not on the adjective itself. The adjective is a chameleon — it changes to match its noun." }
\`\`\`

## The Basic Pattern: Adding -e for Feminine

| Masculine | Feminine | Notes |
|-----------|----------|-------|
| grand (tall) | grand**e** | Final D is silent in masc, pronounced in fem |
| petit (small) | petit**e** | Final T is silent in masc, pronounced in fem |
| français (French) | français**e** | Final S is silent in masc, Z sound in fem |
| noir (black) | noir**e** | No change in sound — R is already pronounced |
| bleu (blue) | bleu**e** | No change in sound |

\`\`\`concept
{ "title": "The Pronunciation Bonus of Learning Feminine Forms", "variant": "analogy", "content": "Adding -e to a masculine adjective often reveals a HIDDEN consonant in the masculine form:\\n\\n• 'grand' (masc) → you can't hear the D. 'grande' (fem) → now you CAN hear D\\n• 'petit' (masc) → silent T. 'petite' (fem) → T is pronounced\\n• 'français' (masc) → S sounds like nothing. 'française' (fem) → sounds like Z\\n\\nThink of -e as 'uncovering' the final consonant. If you know the feminine form, you know how to spell the masculine." }
\`\`\`

## Special Patterns — Irregular Feminines

| Pattern | Masculine | Feminine | Examples |
|---------|-----------|----------|---------|
| -eux → -euse | heureux | heureuse | happy; sérieux/sérieuse |
| -if → -ive | actif | active | active; sportif/sportive |
| -el → -elle | naturel | naturelle | natural; officiel/officielle |
| -en → -enne | canadien | canadienne | Canadian; italien/italienne |
| -er → -ère | premier | première | first; étranger/étrangère |
| -eur → -euse | travailleur | travailleuse | hard-working |
| Irregular | beau / bel | belle | beautiful; nouveau/nouvelle |
| Irregular | bon | bonne | good; mignon/mignonne |
| Invariable | sympa | sympa | nice (no change!) |
| Invariable | super | super | super (no change!) |

## Adjective Position — Before or After the Noun?

In French, most adjectives come **AFTER** the noun (opposite to English):
- une voiture **rouge** (a red car — not 'une rouge voiture')
- un livre **intéressant** (an interesting book)

But the **BAGS adjectives** come **BEFORE** the noun:
**B**eauty: beau, joli, laid
**A**ge: jeune, vieux, nouveau, ancien
**G**oodness: bon, mauvais, faux
**S**ize: grand, petit, gros, long, court, haut

\`\`\`compare
{ "title": "Adjective Position: Before vs After the Noun", "left": { "label": "BAGS adjectives — BEFORE the noun", "items": ["un beau garçon (a handsome boy)", "une jolie fille (a pretty girl)", "un vieux monsieur (an old gentleman)", "un petit chat (a small cat)", "un bon repas (a good meal)"] }, "right": { "label": "All other adjectives — AFTER the noun", "items": ["une voiture rouge (a red car)", "un homme intelligent (an intelligent man)", "une idée intéressante (an interesting idea)", "un film français (a French film)", "une robe élégante (an elegant dress)"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'a happy French woman' in French?", "options": ["une heureuse française femme", "une femme française heureuse", "une femme heureuse française", "une française femme heureuse"], "answer": 1, "explanation": "'Une femme française heureuse.' 'Femme' = woman (noun). Both adjectives go AFTER: 'française' (nationality adjective — always after) and 'heureuse' (emotional state — always after). If using a BAGS adjective like 'jeune', it would go before: 'une jeune femme française heureuse'." }
\`\`\`

\`\`\`quiz
{ "question": "The adjective 'beau' (beautiful/handsome) — what is its feminine singular form?", "options": ["beaux", "belle", "beau", "beaux"], "answer": 1, "explanation": "'Beau' is irregular. Feminine: 'belle'. Masculine plural: 'beaux'. Feminine plural: 'belles'. Before a masculine noun starting with a vowel, 'beau' becomes 'bel': 'un bel homme' (a handsome man)." }
\`\`\`

\`\`\`takeaways
{ "points": ["French adjectives agree with their noun: 4 forms — masc sing, fem sing, masc plural, fem plural", "Basic rule: add -e for feminine, -s for plural, -es for feminine plural", "Adding -e often reveals a hidden consonant: grand/grande, petit/petite, français/française", "BAGS adjectives (Beauty, Age, Goodness, Size) go BEFORE the noun — all others go AFTER", "Key irregular feminines: heureux→heureuse, actif→active, beau→belle, bon→bonne, -ien→-ienne"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m3",
    moduleTitle: "The Gender Problem",
    order: 3,
    topicId: "fr-m3-l10-adjectives",
    vocabulary: [
      { word: "grand / grande", translation: "big / tall", pronunciation: "GRAHN / GRAHND (D revealed in fem)", exampleSentence: "C'est un grand hôtel.", exampleTranslation: "It's a big hotel.", partOfSpeech: "adjective" },
      { word: "petit / petite", translation: "small / little", pronunciation: "puh-TEE / puh-TEET", exampleSentence: "J'ai un petit appartement.", exampleTranslation: "I have a small apartment.", partOfSpeech: "adjective" },
      { word: "beau / belle", translation: "beautiful / handsome", pronunciation: "BOH / BEHL", exampleSentence: "C'est une belle journée.", exampleTranslation: "It's a beautiful day.", partOfSpeech: "adjective" },
      { word: "nouveau / nouvelle", translation: "new", pronunciation: "noo-VOH / noo-VEHL", exampleSentence: "J'ai un nouveau téléphone.", exampleTranslation: "I have a new phone.", partOfSpeech: "adjective" },
      { word: "vieux / vieille", translation: "old", pronunciation: "VYUH / VYEHY", exampleSentence: "C'est un vieux château.", exampleTranslation: "It's an old castle.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Beau/Bel/Belle — The Three Forms of Beautiful",
        explanation: "'Beau' has an extra masculine form: **bel**, used before masculine nouns starting with a vowel or silent H. This avoids a vowel clash: *beau homme* is hard to say → *bel homme*. Same pattern applies to: *vieux/vieil/vieille* and *nouveau/nouvel/nouvelle*.",
        examples: [
          { correct: "un beau garçon (masc, starts with G)", translation: "a handsome boy" },
          { correct: "un bel homme (masc, starts with H — silent)", translation: "a handsome man" },
          { correct: "une belle femme (fem)", translation: "a beautiful woman" },
          { correct: "un nouvel appartement (masc, starts with vowel)", translation: "a new apartment" },
        ],
        commonMistakes: [
          { incorrect: "un beau appartement", correction: "un bel appartement", explanation: "Before a masculine noun starting with a vowel, use 'bel' not 'beau' to ease pronunciation." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m3-l10-voice",
        title: "Describing Your Dream Home",
        situation: "A French friend asks about your ideal home",
        agentRole: "You are Lucie, curious about the student's ideal home. Ask about size, style, location, and specific rooms. React naturally to their descriptions.",
        userGoal: "Describe your ideal home using at least 6 adjectives with correct agreement",
        targetPhrases: ["grand / grande", "beau / belle", "moderne", "tranquille", "lumineux / lumineuse"],
        successCriteria: ["Uses at least one BAGS adjective before a noun", "Correctly feminises at least 2 adjectives", "Describes at least 3 features of the home"],
        hints: ["'J'aimerais une grande maison' = I'd like a big house", "'avec un beau jardin' = with a beautiful garden"],
      },
    ],
    culturalNotes: [
      {
        title: "L'Esthétique Française — Why Beauty Has Grammar",
        content: "The French cultural emphasis on aesthetics, elegance, and precision extends to language. The agreement system ensures that descriptions are grammatically harmonious — the adjective literally 'matches' its noun visually and audibly, creating what French scholars call *cohérence morphologique*. This isn't just grammar pedantry: it reflects a worldview in which attention to form and precision is a form of respect — for the language, the listener, and the topic being described.",
        region: "France",
      },
    ],
  },

  // ── LESSON 11 ── Possessives & Demonstratives ─────────────
  {
    id: "fr-l11",
    slug: "possessives-demonstratives",
    title: "My, Your, This, That — Possessives & Demonstratives",
    content: `# Possessives & Demonstratives

Possessive adjectives (my, your, his, her) and demonstrative adjectives (this, that) follow the same rule as all French adjectives: they agree with the noun they modify, not with the owner or pointer.

\`\`\`concept
{ "title": "The English Speaker's Key Confusion", "variant": "warning", "content": "In English, 'his' and 'her' tell you the gender of the OWNER: 'his car', 'her car'.\\n\\nIn French, the possessive adjective tells you the gender of the THING OWNED:\\n• 'Sa voiture' = his car OR her car (voiture = feminine, so 'sa')\\n• 'Son livre' = his book OR her book (livre = masculine, so 'son')\\n\\nYou CANNOT tell from 'son livre' alone whether the owner is male or female. The adjective matches the NOUN, not the person." }
\`\`\`

## Possessive Adjectives — Full Table

| | Masc Sing | Fem Sing | Plural (m+f) |
|-|-----------|----------|--------------|
| my | **mon** | **ma** | **mes** |
| your (tu) | **ton** | **ta** | **tes** |
| his/her/its | **son** | **sa** | **ses** |
| our | **notre** | **notre** | **nos** |
| your (vous) | **votre** | **votre** | **vos** |
| their | **leur** | **leur** | **leurs** |

**Special rule:** Before a feminine noun starting with a vowel or silent H, use **mon/ton/son** (the masculine form) to avoid vowel clash:
- *ma amie* → **mon amie** (my female friend)
- *ta école* → **ton école** (your school)
- *sa habitude* → **son habitude** (his/her habit)

## Possessives in Practice

| English | French | Note |
|---------|--------|------|
| my book | **mon** livre | livre = masc → mon |
| my table | **ma** table | table = fem → ma |
| my friend (female) | **mon** amie | starts with vowel → mon |
| his/her car | **sa** voiture | voiture = fem → sa (owner's gender unknown) |
| our city | **notre** ville | ville = fem → notre (same for m+f) |
| their parents | **leurs** parents | plural → leurs |

## Demonstrative Adjectives — This / That

French uses the same word for 'this' and 'that' (distance is specified with -ci/-là if needed):

| | Masculine | Feminine | Before vowel/H |
|-|-----------|----------|----------------|
| Singular | **ce** | **cette** | **cet** |
| Plural | **ces** | **ces** | **ces** |

- **ce** livre (this/that book), **ce** garçon (this boy)
- **cette** table (this table), **cette** femme (this woman)
- **cet** homme (this man — starts with H), **cet** arbre (this tree — starts with vowel)
- **ces** livres / **ces** tables (these books / these tables)

To distinguish 'this' from 'that', add **-ci** (here) or **-là** (there):
- **ce livre-ci** (this book here) vs **ce livre-là** (that book there)

\`\`\`compare
{ "title": "English vs French Possessives", "left": { "label": "English: possessive matches the OWNER", "items": ["his book (owner = male)", "her book (owner = female)", "his car (owner = male)", "her car (owner = female)"] }, "right": { "label": "French: possessive matches the NOUN", "items": ["son livre (book = masc → son, owner could be m OR f)", "son livre (same word! owner's gender irrelevant)", "sa voiture (car = fem → sa, owner could be m OR f)", "sa voiture (same word again!)"] } }
\`\`\`

\`\`\`quiz
{ "question": "Marie parle de ___ appartement. (Marie is talking about her apartment — 'appartement' is masculine)", "options": ["ma", "sa", "son", "ses"], "answer": 2, "explanation": "'Appartement' is masculine, so the possessive must be masculine singular: 'son'. This is 'son appartement' meaning 'her apartment' — even though Marie is female, the possessive matches the NOUN (appartement = masc), not the owner (Marie = female). 'Sa' would be used for a feminine noun." }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'this woman' in French? ('femme' is feminine)", "options": ["ce femme", "cet femme", "cette femme", "ces femme"], "answer": 2, "explanation": "'Femme' is feminine, so use the feminine demonstrative 'cette': 'cette femme'. 'Ce' is for masculine nouns, 'cet' is for masculine nouns starting with a vowel or silent H, and 'ces' is for all plurals." }
\`\`\`

\`\`\`takeaways
{ "points": ["Possessives agree with the THING OWNED, not the owner — 'son/sa' can mean his OR her depending on the noun's gender", "mon/ma/mes (my), ton/ta/tes (your-informal), son/sa/ses (his/her/its), notre/nos (our), votre/vos (your-formal), leur/leurs (their)", "Before fem noun starting with vowel/H: use mon/ton/son instead of ma/ta/sa — 'mon amie', 'son école'", "Demonstratives: ce (masc), cette (fem), cet (masc before vowel/H), ces (all plural)", "Add -ci (this here) or -là (that there) to distinguish proximity: 'ce livre-ci' vs 'ce livre-là'"] }
\`\`\``,
    targetLanguage: "fr",
    proficiencyLevel: "A1",
    moduleId: "fr-m3",
    moduleTitle: "The Gender Problem",
    order: 4,
    topicId: "fr-m3-l11-possessives",
    vocabulary: [
      { word: "mon / ma / mes", translation: "my (masc/fem/plural)", pronunciation: "MON / MAH / MAY", exampleSentence: "Mon frère et ma sœur habitent ici.", exampleTranslation: "My brother and my sister live here.", partOfSpeech: "possessive adjective" },
      { word: "son / sa / ses", translation: "his / her / its (masc/fem/plural)", pronunciation: "SON / SAH / SAY", exampleSentence: "Elle aime son chat et sa maison.", exampleTranslation: "She loves her cat and her house.", partOfSpeech: "possessive adjective" },
      { word: "notre / nos", translation: "our (sing/plural)", pronunciation: "NOH-truh / NOH", exampleSentence: "Notre maison est dans notre quartier préféré.", exampleTranslation: "Our house is in our favourite neighbourhood.", partOfSpeech: "possessive adjective" },
      { word: "cette", translation: "this / that (feminine)", pronunciation: "SET", exampleSentence: "Cette robe est magnifique !", exampleTranslation: "This dress is gorgeous!", partOfSpeech: "demonstrative adjective" },
      { word: "cet", translation: "this / that (masc before vowel/H)", pronunciation: "SET", exampleSentence: "Cet hôtel est trop cher.", exampleTranslation: "This hotel is too expensive.", partOfSpeech: "demonstrative adjective" },
    ],
    grammarPoints: [
      {
        title: "Expressing 'belonging to' with de",
        explanation: "French uses **de + noun** to express possession (English uses apostrophe-s). There is no apostrophe-s construction in French. 'The teacher's book' = 'le livre du professeur' (the book of the teacher). 'Marie's car' = 'la voiture de Marie' (the car of Marie).",
        examples: [
          { correct: "le livre de Sophie", translation: "Sophie's book (the book of Sophie)" },
          { correct: "la voiture du directeur", translation: "the director's car (de + le = du)" },
          { correct: "les enfants des voisins", translation: "the neighbours' children (de + les = des)" },
        ],
        commonMistakes: [
          { incorrect: "Sophie's livre", correction: "le livre de Sophie", explanation: "French has no apostrophe-s for possession. Always use 'de + [noun]' or the appropriate possessive adjective (son livre)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "fr-m3-l11-voice",
        title: "Lost & Found at the Airport",
        situation: "Your bag is lost at Charles de Gaulle Airport — you need to describe it",
        agentRole: "You are the lost baggage officer Thierry. Ask the passenger to describe their bag: size, colour, contents, and any distinguishing features.",
        userGoal: "Describe your lost bag using possessives, colours, adjectives, and this/that constructions",
        targetPhrases: ["mon sac", "c'est une valise", "de couleur", "il y a dans mon sac"],
        successCriteria: ["Uses possessives correctly (mon/ma/mes)", "Describes colour and size with agreement", "Uses 'il y a' to describe contents"],
        hints: ["'Mon sac est grand et noir' = My bag is big and black", "'Il y a mon passeport dans mon sac' = My passport is in my bag"],
      },
    ],
    culturalNotes: [
      {
        title: "French Privacy and the 'Intimate Space'",
        content: "The French concept of 'chez soi' (one's own place / at home) reflects a strong cultural boundary between public and private. Inviting someone to your home ('chez moi') is considered more intimate than in Anglo-American cultures — it's a genuine sign of trust and friendship. Colleagues might socialise for years in cafés without ever visiting each other's homes. Understanding 'mon chez-moi' (my home space) as a concept explains why the French guard personal information more carefully than Americans or Australians typically do.",
        region: "France",
      },
    ],
  },
];

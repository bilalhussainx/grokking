import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────────────
// MODULE 8: A1 Mastery (3 lessons)
// Capstone module: family/relationships, near future, full A1 review.
// ─────────────────────────────────────────────────────────────────

export const a1MasteryLessons: LanguageLesson[] = [
  // ── LESSON 24 ── Family & Conocer vs Saber ───────────────────
  {
    id: "es-l24",
    slug: "family-conocer-saber",
    title: "Family, Relationships & Conocer vs Saber",
    content: `# Family, Relationships & Conocer vs Saber

## Family Vocabulary

| Spanish | English | Notes |
|---------|---------|-------|
| **la familia** | family | |
| **el padre / la madre** | father / mother | also: papá / mamá (dad / mum) |
| **el hijo / la hija** | son / daughter | los hijos = children (mixed or all sons) |
| **el hermano / la hermana** | brother / sister | los hermanos = siblings |
| **el abuelo / la abuela** | grandfather / grandmother | los abuelos = grandparents |
| **el nieto / la nieta** | grandson / granddaughter | |
| **el tío / la tía** | uncle / aunt | |
| **el sobrino / la sobrina** | nephew / niece | |
| **el primo / la prima** | cousin (m/f) | |
| **el marido / la mujer** | husband / wife | also: esposo / esposa |
| **el novio / la novia** | boyfriend / girlfriend / fiancé | context determines |
| **soltero/a** | single | |
| **casado/a** | married | |
| **divorciado/a** | divorced | |
| **viudo/a** | widower/widow | |

## Describing Family with Tener and Ser

- Tengo dos hermanos y una hermana. — I have two brothers and a sister.
- Mi padre es médico. Tiene 58 años. — My father is a doctor. He's 58.
- Mis abuelos están jubilados. — My grandparents are retired. (estar — current state)
- Soy el mayor / la mayor. — I'm the oldest. / Soy el pequeño. — I'm the youngest.

## Conocer vs Saber — Two Verbs for "To Know"

English has one verb "to know". Spanish has two, with entirely different uses.

\`\`\`compare
{ "title": "Conocer vs Saber — Different Types of Knowing", "left": { "label": "Conocer — acquaintance/familiarity", "items": ["Know a person: ¿Conoces a María?", "Know a place: Conozco Madrid bien.", "Know a work (book/film): ¿Conoces esta película?", "Be acquainted with: Conocemos el sistema.", "yo conozco, tú conoces, él conoce..."] }, "right": { "label": "Saber — knowledge/skill/information", "items": ["Know a fact: Sé que hoy es lunes.", "Know how to: ¿Sabes cocinar?", "Know information: No sé su número.", "Know by heart: Sé el poema de memoria.", "yo sé, tú sabes, él sabe..."] } }
\`\`\`

**Conocer conjugation** (yo form is irregular: yo conozco):
- yo **conozco**, tú **conoces**, él **conoce**, nosotros **conocemos**, vosotros **conocéis**, ellos **conocen**

**Saber conjugation** (yo form is irregular: yo sé):
- yo **sé**, tú **sabes**, él **sabe**, nosotros **sabemos**, vosotros **sabéis**, ellos **saben**

## Personal A — Required with Conocer and People

When the direct object is a specific person, Spanish requires the preposition **a** before the person:

- ¿Conoces **a** Juan? — Do you know Juan? *(a before a person)*
- Busco **a** mi hermana. — I'm looking for my sister. *(a before a person)*
- Conozco Madrid. — I know Madrid. *(no a before places)*

\`\`\`quiz
{ "question": "Which sentence correctly uses conocer or saber?", "options": ["Sé a tu hermana.", "Conozco cómo cocinar paella.", "Conozco a tu hermana.", "Sé Madrid muy bien."], "answer": 2, "explanation": "'Conozco a tu hermana' = I know your sister (acquaintance — conocer + personal a). 'Sé a tu hermana' is wrong — saber is not used for people. 'Conozco cómo cocinar' is wrong — skills use saber: 'Sé cómo cocinar'. 'Sé Madrid' is wrong — places use conocer: 'Conozco Madrid'." }
\`\`\`

\`\`\`takeaways
{ "points": ["Conocer = know people and places (acquaintance/familiarity). Yo conozco is irregular.", "Saber = know facts, information, and skills (saber + infinitive = know how to). Yo sé is irregular.", "Personal A: required before a specific person as direct object — ¿Conoces A tu vecino?", "Family status adjectives use estar: Estoy casado/a. Está soltero/a. — current states", "Soy el mayor / la mayor (I'm the oldest); soy el pequeño/la pequeña (I'm the youngest)"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m8",
    moduleTitle: "A1 Mastery",
    order: 1,
    topicId: "es-m8-l24-family-conocer-saber",
    vocabulary: [
      { word: "los hermanos", translation: "siblings (or brothers)", pronunciation: "lohs ehr-MAH-nohs", exampleSentence: "Tengo tres hermanos — dos chicos y una chica.", exampleTranslation: "I have three siblings — two boys and one girl.", partOfSpeech: "noun" },
      { word: "los abuelos", translation: "grandparents", pronunciation: "lohs ah-BWEH-lohs", exampleSentence: "Mis abuelos viven en el campo.", exampleTranslation: "My grandparents live in the countryside.", partOfSpeech: "noun" },
      { word: "conozco", translation: "I know (a person/place)", pronunciation: "koh-NOHS-koh", exampleSentence: "Conozco a tu profesora de yoga.", exampleTranslation: "I know your yoga teacher.", partOfSpeech: "verb" },
      { word: "sé", translation: "I know (a fact/skill)", pronunciation: "seh", exampleSentence: "Sé hablar tres idiomas.", exampleTranslation: "I know how to speak three languages.", partOfSpeech: "verb" },
      { word: "casado/a", translation: "married", pronunciation: "kah-SAH-doh/dah", exampleSentence: "Estoy casada desde hace diez años.", exampleTranslation: "I've been married for ten years.", partOfSpeech: "adjective" },
      { word: "la personal a", translation: "personal 'a' (before people)", pronunciation: "lah pehr-soh-NAHL ah", exampleSentence: "Busco a mi amigo.", exampleTranslation: "I'm looking for my friend.", partOfSpeech: "grammar concept" },
    ],
    grammarPoints: [
      {
        title: "Conocer vs Saber — Choosing the Right 'To Know'",
        explanation: "Conocer = familiarity with people and places. Saber = knowledge of facts or skills (saber + infinitive). Both have irregular yo forms: yo conozco, yo sé.",
        examples: [
          { correct: "¿Conoces a mi hermano?", translation: "Do you know my brother?", note: "Person → conocer + personal a" },
          { correct: "¿Sabes dónde está el hotel?", translation: "Do you know where the hotel is?", note: "Information → saber" },
          { correct: "Sé tocar la guitarra.", translation: "I know how to play guitar.", note: "Skill → saber + infinitive" },
        ],
        commonMistakes: [
          { incorrect: "Sé a María.", correction: "Conozco a María.", explanation: "Knowing a person uses conocer, not saber. Saber is for facts, information, and skills." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m8-l24-vs1",
        title: "Talking About Family",
        situation: "A Spanish pen pal asks you to describe your family in a video call.",
        agentRole: "You are a Spanish pen pal who is curious about the student's family. Ask about parents, siblings, grandparents. Ask if they know any famous Spanish speakers and if they know how to cook any Spanish dishes.",
        userGoal: "Describe your family using tener and ser/estar. Use conocer and saber in context.",
        targetPhrases: ["tengo", "es", "está", "conozco", "sé", "mis padres son", "soy el/la mayor"],
        successCriteria: ["Correct use of conocer vs saber", "Family described with correct gender agreement", "Personal a used before people with conocer"],
        hints: ["Tengo un hermano... / Mi madre es... / Sé cocinar... / Conozco a..."],
      },
    ],
  },

  // ── LESSON 25 ── Near Future — Ir + A ───────────────────────
  {
    id: "es-l25",
    slug: "near-future",
    title: "The Near Future — ir + a + Infinitive",
    content: `# The Near Future — ir + a + Infinitive

The most natural and common way to express future plans in Spanish at A1 level. You already know ir (voy, vas, va...) — just add **a + infinitive**.

## The Structure

**ir (conjugated) + a + infinitive**

| Subject | Form | Example |
|---------|------|---------|
| yo | voy a | **Voy a estudiar** esta noche. |
| tú | vas a | **¿Vas a venir** a la fiesta? |
| él/ella | va a | **Va a llover** mañana. |
| nosotros | vamos a | **Vamos a comer** fuera. |
| vosotros | vais a | **¿Vais a ir** al concierto? |
| ellos | van a | **Van a vivir** en Argentina. |

## Negating the Near Future

Place **no** before the conjugated form of **ir**:
- **No voy a** trabajar mañana. — I'm not going to work tomorrow.
- **No va a** ser fácil. — It's not going to be easy.
- **No vamos a** llegar a tiempo. — We're not going to arrive on time.

## Future Time Expressions

| Spanish | English |
|---------|---------|
| **mañana** | tomorrow |
| **pasado mañana** | the day after tomorrow |
| **esta tarde** | this afternoon |
| **esta noche** | tonight |
| **este fin de semana** | this weekend |
| **la semana que viene** | next week |
| **el mes que viene** | next month |
| **el año que viene** | next year |
| **pronto** | soon |
| **en el futuro** | in the future |

## Vamos a + Infinitive — "Let's..."

**Vamos a** is also used as the equivalent of "Let's...":
- **Vamos a comer.** — Let's eat.
- **Vamos a ver.** — Let's see. / We'll see.
- **¡Vamos a empezar!** — Let's start!

\`\`\`compare
{ "title": "Near Future vs Simple Present for Future Plans", "left": { "label": "Ir + a + infinitive (planned future)", "items": ["Voy a estudiar mañana. (I'm going to study.)", "Va a llegar a las tres. (She's going to arrive at 3.)", "¿Vas a comer aquí? (Are you going to eat here?)", "Used for intentions and definite plans"] }, "right": { "label": "Simple present (timetabled/scheduled)", "items": ["El tren sale a las ocho. (The train leaves at 8.)", "El partido empieza mañana. (The match starts tomorrow.)", "La clase termina a las dos. (Class ends at 2.)", "Used for fixed schedules — transport, events"] } }
\`\`\`

\`\`\`concept
{ "title": "Voy a vs Quiero vs Pienso — Shades of Future Intention", "variant": "info", "content": "Voy a + infinitive = definite plan: 'Voy a estudiar' (I'm going to study — settled). Quiero + infinitive = wish/desire: 'Quiero estudiar' (I want to study — but maybe won't). Pienso + infinitive = thinking about: 'Pienso estudiar' (I'm thinking of studying — less certain). For straightforward future plans, 'voy a' is the most natural A1 choice." }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'We're not going to arrive on time' in Spanish?", "options": ["No van a llegar a tiempo.", "No vamos a llegar a tiempo.", "Vamos a no llegar a tiempo.", "No vamos llegar a tiempo."], "answer": 1, "explanation": "Nosotros = vamos. Near future negation: no + ir form + a + infinitive. So: no VAMOS a llegar a tiempo. 'Vamos a no llegar' is wrong (no must come before ir, not between ir and a). 'No vamos llegar' is missing the required 'a' between ir and the infinitive." }
\`\`\`

\`\`\`takeaways
{ "points": ["Near future: ir (conjugated) + a + infinitive — Voy a estudiar, vas a comer, van a vivir", "Negation: no + ir form: No voy a, no vas a, no va a — 'no' goes before the form of ir", "Vamos a + infinitive = Let's... (Vamos a empezar!)", "Future time expressions: mañana, esta noche, la semana que viene, el año que viene, pronto", "Near future vs simple present: near future for plans/intentions; simple present for fixed schedules"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m8",
    moduleTitle: "A1 Mastery",
    order: 2,
    topicId: "es-m8-l25-near-future",
    vocabulary: [
      { word: "voy a + infinitive", translation: "I'm going to...", pronunciation: "BOY ah", exampleSentence: "Voy a aprender a cocinar este verano.", exampleTranslation: "I'm going to learn to cook this summer.", partOfSpeech: "phrase" },
      { word: "la semana que viene", translation: "next week", pronunciation: "lah seh-MAH-nah keh BYEH-neh", exampleSentence: "La semana que viene voy a visitar a mis abuelos.", exampleTranslation: "Next week I'm going to visit my grandparents.", partOfSpeech: "phrase" },
      { word: "pasado mañana", translation: "the day after tomorrow", pronunciation: "pah-SAH-doh mah-NYAH-nah", exampleSentence: "Pasado mañana tengo un examen importante.", exampleTranslation: "The day after tomorrow I have an important exam.", partOfSpeech: "phrase" },
      { word: "vamos a", translation: "we're going to / let's", pronunciation: "BAH-mohs ah", exampleSentence: "Vamos a ver la película juntos.", exampleTranslation: "Let's watch the film together.", partOfSpeech: "phrase" },
      { word: "pronto", translation: "soon", pronunciation: "PROHN-toh", exampleSentence: "Voy a llamarte pronto.", exampleTranslation: "I'm going to call you soon.", partOfSpeech: "adverb" },
    ],
    grammarPoints: [
      {
        title: "Near Future Construction and Negation",
        explanation: "Form: conjugated ir + a + infinitive. Negation: no + conjugated ir + a + infinitive. The 'a' is always required between the form of ir and the infinitive.",
        examples: [
          { correct: "Voy a salir a las ocho.", translation: "I'm going to leave at eight.", note: "voy a + salir (infinitive)" },
          { correct: "No va a llover hoy.", translation: "It's not going to rain today.", note: "no + va a + llover" },
          { correct: "¿Qué vas a hacer mañana?", translation: "What are you going to do tomorrow?", note: "Question form — natural word order" },
        ],
        commonMistakes: [
          { incorrect: "Voy estudiar mañana.", correction: "Voy a estudiar mañana.", explanation: "The preposition 'a' is required between ir and the infinitive. Omitting it is a common error." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m8-l25-vs1",
        title: "Planning a Trip to Spain",
        situation: "You're planning a trip to Spain with a Spanish friend who lives there.",
        agentRole: "You are a Spanish friend helping to plan the trip. Ask where they want to visit, what they're going to eat, how long they're going to stay, what they're going to do each day.",
        userGoal: "Discuss trip plans using voy a, vamos a, and future time expressions. Include at least 4 different infinitives.",
        targetPhrases: ["voy a", "vamos a", "vas a", "la semana que viene", "mañana", "voy a visitar", "voy a comer", "voy a quedarme"],
        successCriteria: ["Consistent near future construction", "Uses at least 3 different subjects (voy/vamos/vas)", "Natural future time expressions"],
        hints: ["Voy a llegar el... / Vamos a visitar... / ¿Qué vamos a comer? / Voy a quedarme... días."],
      },
    ],
  },

  // ── LESSON 26 ── A1 Capstone & A2 Preview ────────────────────
  {
    id: "es-l26",
    slug: "a1-capstone",
    title: "A1 Capstone — Full Review & Your A2 Roadmap",
    content: `# A1 Capstone — Full Review & Your A2 Roadmap

You've covered the complete A1 Spanish system. Let's consolidate everything and map where you go next.

## The A1 Grammar System — Complete Checklist

**Pronunciation (Module 1):**
- 5 pure vowels (A=ah, E=eh, I=ee, O=oh, U=oo) — no shifting, no reduction
- The six tricky sounds: single R (flap), RR (trill), J (throaty H), Ñ (NY), LL/Y (Y sound), V=B
- Stress rules: vowel/N/S ending → second-to-last; other consonant → last; accent overrides

**Building Blocks (Module 2):**
- Ser (DOCTOR: Descriptions, Occupations, Characteristics, Time, Origin, Relationships)
- Estar (PLACE: Position, Location, Actions-in-progress, Conditions, Emotions/health)
- Ser vs Estar with same adjective = different meaning (aburrido, listo, malo, rico, vivo...)
- Tener idioms: age, hunger, thirst, sleep, fear, cold, hot, hurry, right
- Hay = there is/there are (unchanging)

**Gender & Articles (Module 3):**
- Gender patterns: -o = m, -a = f, -ción/-dad = f, Greek -ma words = m
- Articles: el/la/los/las (definite), un/una/unos/unas (indefinite)
- Contractions: a + el = al, de + el = del
- Adjective agreement: matches noun in gender AND number; position: after noun usually

**Verb Engine (Modules 4–5):**
- -AR: -o/-as/-a/-amos/-áis/-an. -ER: -o/-es/-e/-emos/-éis/-en. -IR: -o/-es/-e/-imos/-ís/-en
- Irregulars: ser, estar, tener, ir, querer (e→ie), poder (o→ue), hacer (yo hago)
- Reflexive verbs: me/te/se/nos/os/se + conjugated verb
- Near future: ir + a + infinitive

**Past Tense (Module 7):**
- -AR preterite: -é/-aste/-ó/-amos/-asteis/-aron
- -ER/-IR preterite: -í/-iste/-ió/-imos/-isteis/-ieron
- Irregulars: ir/ser (fui), tener (tuve), hacer (hice/hizo), estar (estuve), poder (pude)
- Time expressions: ayer, hace + time, la semana pasada

\`\`\`concept
{ "title": "One Trap English Speakers Still Hit at A1 — Ser vs Estar for Emotions", "variant": "warning", "content": "Even after all this study, English speakers still reach for the wrong verb for emotions. Remember: emotions and feelings are ESTAR, not SER. 'Estoy contento' (I'm happy — right now). 'Estoy triste' (I'm sad). 'Estoy nervioso' (I'm nervous). The one exception: 'Ser feliz' (to be a happy person by nature) — but even native speakers mix this. When in doubt for emotions: estar." }
\`\`\`

## Your A2 Roadmap — What Comes Next

**A2 topics to look forward to:**

1. **The Imperfect (Imperfecto)** — background past, habits, descriptions: *Cuando era niño, vivía en Madrid y iba al parque todos los días.* (When I was a child, I lived in Madrid and went to the park every day.)

2. **Preterite vs Imperfect** — the classic Spanish challenge: preterite for events, imperfect for background.

3. **Direct and Indirect Object Pronouns Together** — *Te lo doy.* (I give it to you.) *Me la compró.* (He bought it for me.)

4. **More Irregular Verbs** — dormir (o→ue), pedir (e→i), conocer, ver, traer, oír, caer

5. **Comparatives and Superlatives** — *más alto que* (taller than), *el más inteligente* (the most intelligent)

6. **Gustar and Similar Verbs** — *Me gusta el café. Me encantan los perros.* (I like coffee. I love dogs.)

7. **The Subjunctive** — for doubt, desire, emotion, and hypotheticals. The most complex topic in Spanish grammar, and the most rewarding.

## What A1 Completion Means

At A1 you can:
- Introduce yourself and others
- Describe people, places, and things with correct gender/agreement
- Talk about daily routines
- Order food and ask for directions
- Talk about the past (preterite)
- Express future plans (ir + a)
- Have a basic conversation on familiar topics

\`\`\`steps
{ "title": "How to Progress from A1 to A2 — Recommended Practice", "steps": ["Speak from day 1 — find a language partner or tutor on italki/Tandem for 30 minutes per week", "Watch Spanish content with Spanish subtitles — start with shows you already know", "Read children's books or simple news (BBC Mundo has easy articles)", "Keep a diary in Spanish — describe your day in the preterite every evening", "Learn 10 new vocabulary items per day using spaced repetition (Anki)", "Start the A2 course when you can hold a 5-minute conversation without major gaps"] }
\`\`\`

\`\`\`quiz
{ "question": "You want to say 'The party was good AND I was happy'. Which verbs?", "options": ["La fiesta fue buena y yo fui contento.", "La fiesta estuvo buena y yo estuve contento.", "La fiesta fue buena y yo estuve contento.", "La fiesta estuvo buena y yo fui contento."], "answer": 2, "explanation": "La fiesta FUE buena — the party being 'good' is a permanent description of the event (ser). Yo ESTUVE contento — my happiness was a temporary emotional state (estar). This ser/estar distinction in the preterite is one of the hardest A1→A2 bridges. Fue = preterite of ser. Estuve = preterite of estar." }
\`\`\`

\`\`\`takeaways
{ "points": ["A1 complete: pronunciation, gender/articles, ser/estar/tener, -AR/-ER/-IR verbs, reflexives, preterite, near future", "Biggest A1 trap: using ser for emotions — always use ESTAR for feelings and health", "A2 priorities: imperfect, preterite vs imperfect, gustar, comparatives, more pronouns", "Practice daily: speaking partner + diary in Spanish + Spanish media with subtitles", "The subjunctive (A2/B1) is what unlocks truly fluent Spanish — it's worth the effort"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m8",
    moduleTitle: "A1 Mastery",
    order: 3,
    topicId: "es-m8-l26-capstone",
    vocabulary: [
      { word: "estar contento/a", translation: "to be happy (estar — current state)", pronunciation: "ehs-TAR kohn-TEHN-toh/tah", exampleSentence: "Estoy muy contenta con mi progreso.", exampleTranslation: "I'm very happy with my progress.", partOfSpeech: "phrase" },
      { word: "el imperfecto", translation: "the imperfect (past tense — A2)", pronunciation: "ehl eem-pehr-FEHK-toh", exampleSentence: "Cuando era niño, vivía en el campo.", exampleTranslation: "When I was a child, I lived in the countryside.", partOfSpeech: "grammar term" },
      { word: "me gusta", translation: "I like (lit: it pleases me)", pronunciation: "meh GOOS-tah", exampleSentence: "Me gusta el español.", exampleTranslation: "I like Spanish.", partOfSpeech: "phrase" },
      { word: "más... que", translation: "more... than", pronunciation: "mahs... keh", exampleSentence: "El español es más fácil que el francés para mí.", exampleTranslation: "Spanish is easier than French for me.", partOfSpeech: "comparison structure" },
    ],
    grammarPoints: [
      {
        title: "A1 System — The Core Rules",
        explanation: "Complete A1 Spanish covers: phonetics, ser/estar/tener/hay, gender and articles, -AR/-ER/-IR conjugation, irregulars, reflexive verbs, preterite past tense, and near future.",
        examples: [
          { correct: "La fiesta fue buena y yo estuve contento.", translation: "The party was good and I was happy.", note: "Ser for event description; estar for emotional state" },
          { correct: "Voy a estudiar el imperfecto la semana que viene.", translation: "I'm going to study the imperfect next week.", note: "Near future applied to learning journey" },
        ],
        commonMistakes: [
          { incorrect: "Soy contento.", correction: "Estoy contento.", explanation: "Happiness (and all emotions) use estar, not ser. Estoy contento/a (I'm happy right now). The only exception: 'Soy feliz' can describe a generally happy personality, but even native speakers often say 'estoy feliz'." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m8-l26-vs1",
        title: "A1 Graduation — Full Conversation",
        situation: "Your Spanish tutor conducts a final A1 oral review. The conversation covers all major A1 topics.",
        agentRole: "You are a Spanish tutor doing a final A1 assessment. Ask the student to: introduce themselves, describe their family, talk about their daily routine, say what they did last weekend, and describe their plans for the coming week. Give encouraging feedback at the end.",
        userGoal: "Hold a full 5-minute conversation covering: identity (ser), location/feelings (estar), family, daily routine (reflexives), last weekend (preterite), and plans (near future).",
        targetPhrases: ["soy", "estoy", "me llamo", "tengo", "me levanto", "la semana pasada", "voy a", "conozco", "sé"],
        successCriteria: ["Confident use of ser vs estar in correct contexts", "Preterite used for past events", "Near future for plans", "At least one reflexive verb", "Family described with correct gender agreement"],
        hints: ["Talk about yourself: Me llamo..., Soy de..., Tengo... años.", "Daily routine: Me levanto a las..., Trabajo/Estudio...", "Last weekend: El fin de semana pasado, fui a... / Comí... / Hice...", "Plans: La semana que viene voy a..."],
      },
    ],
  },
];

import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────────────
// MODULE 2: Building Blocks — ser, estar, tener, hay (4 lessons)
// The two "to be" verbs (ser/estar) are THE defining challenge for English
// speakers. A full lesson is dedicated to each, then a disambiguation lesson.
// ─────────────────────────────────────────────────────────────────

export const buildingBlocksLessons: LanguageLesson[] = [
  // ── LESSON 4 ── Ser — Permanent Being ───────────────────────
  {
    id: "es-l4",
    slug: "ser-permanent-being",
    title: "Ser — Identity, Origin, and What You Are",
    content: `# Ser — Identity, Origin, and What You Are

English has one verb "to be". Spanish has two: **ser** and **estar**. This is the single biggest hurdle for English speakers. This lesson covers **ser** — the verb for identity, permanent characteristics, and definitions.

## Ser Conjugation

| Pronoun | Ser | English |
|---------|-----|---------|
| **yo** | **soy** | I am |
| **tú** | **eres** | you are (informal) |
| **él / ella / usted** | **es** | he/she is / you are (formal) |
| **nosotros** | **somos** | we are |
| **vosotros** (Spain) | **sois** | you all are |
| **ellos / ustedes** | **son** | they are / you all are |

\`\`\`concept
{ "title": "When to Use Ser — The DOCTOR Mnemonic", "variant": "info", "content": "Ser covers six categories — remember them as DOCTOR: D = Descriptions (inherent traits: Es alto. He is tall.), O = Occupations (Es médico. She is a doctor.), C = Characteristics (origin, material: Es de España. La mesa es de madera.), T = Time (Son las tres. It's 3 o'clock.), O = Origin/nationality (Soy de México. Somos americanos.), R = Relationships (Es mi hermana. She is my sister.)" }
\`\`\`

## Ser in Action

**Identity:**
- Soy estudiante. — I am a student. *(Note: no article before professions!)*
- Es médico. — He is a doctor.
- Son profesores. — They are teachers.

**Origin and nationality:**
- Soy de México. — I'm from Mexico.
- Ella es española. — She is Spanish.
- ¿De dónde eres? — Where are you from?

**Relationships:**
- Él es mi padre. — He is my father.
- Somos amigos. — We are friends.
- Es mi hermana. — She is my sister.

**Time and dates:**
- Son las tres. — It's three o'clock.
- Hoy es lunes. — Today is Monday.
- Es el 15 de marzo. — It's March 15th.

**Inherent characteristics:**
- El cielo es azul. — The sky is blue.
- La nieve es fría. — Snow is cold. *(cold is a defining property of snow)*
- Es inteligente. — She is intelligent. *(personality trait)*

\`\`\`concept
{ "title": "Spanish Drops the Article Before Professions!", "variant": "warning", "content": "In English: 'I am A doctor.' In Spanish: 'Soy médico.' — no 'un' (a). When stating someone's profession with ser, Spanish drops the indefinite article. Exception: if you add an adjective, the article returns: 'Es un médico excelente' (He's an excellent doctor)." }
\`\`\`

\`\`\`quiz
{ "question": "Which sentence correctly uses 'ser' for a profession?", "options": ["Soy un médico.", "Soy médico.", "Estoy médico.", "Tengo médico."], "answer": 1, "explanation": "Professions with ser drop the indefinite article in Spanish: 'Soy médico' (I am a doctor). 'Soy un médico' is understandable but non-native — the article only returns when adding an adjective: 'Soy un médico excelente'. 'Estoy médico' and 'Tengo médico' are grammatically wrong." }
\`\`\`

\`\`\`takeaways
{ "points": ["Ser = identity, origin, profession, time, relationships, inherent characteristics — use DOCTOR to remember", "Conjugation: soy, eres, es, somos, sois, son", "Professions with ser drop the article: 'Soy enfermero' not 'Soy un enfermero'", "Time always uses ser: Son las dos y media. Es medianoche.", "Ser describes WHAT something IS by its nature — not how it happens to be right now"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m2",
    moduleTitle: "Building Blocks — Ser, Estar, Tener",
    order: 1,
    topicId: "es-m2-l4-ser",
    vocabulary: [
      { word: "soy", translation: "I am", pronunciation: "SOY", exampleSentence: "Soy de los Estados Unidos.", exampleTranslation: "I am from the United States.", partOfSpeech: "verb" },
      { word: "eres", translation: "you are (informal)", pronunciation: "EH-rehs", exampleSentence: "¿Eres estudiante?", exampleTranslation: "Are you a student?", partOfSpeech: "verb" },
      { word: "es", translation: "he/she/it is / you are (formal)", pronunciation: "ehs", exampleSentence: "Ella es profesora.", exampleTranslation: "She is a teacher.", partOfSpeech: "verb" },
      { word: "somos", translation: "we are", pronunciation: "SOH-mohs", exampleSentence: "Somos amigos desde la infancia.", exampleTranslation: "We are friends since childhood.", partOfSpeech: "verb" },
      { word: "son", translation: "they are / you all are", pronunciation: "sohn", exampleSentence: "Son las tres de la tarde.", exampleTranslation: "It's three in the afternoon.", partOfSpeech: "verb" },
      { word: "estudiante", translation: "student", pronunciation: "ehs-too-DYAHN-teh", exampleSentence: "Soy estudiante de español.", exampleTranslation: "I am a Spanish student.", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Ser — Six Core Uses (DOCTOR)",
        explanation: "Ser covers: Descriptions (inherent), Occupations, Characteristics (origin/material), Time, Origin/nationality, Relationships. Use ser when saying what something fundamentally IS.",
        examples: [
          { correct: "Soy médico.", translation: "I am a doctor.", note: "Occupation — no article" },
          { correct: "Son las cinco.", translation: "It's five o'clock.", note: "Time always uses ser" },
          { correct: "Es de Argentina.", translation: "She is from Argentina.", note: "Origin uses ser" },
        ],
        commonMistakes: [
          { incorrect: "Soy un médico.", correction: "Soy médico.", explanation: "Professions after ser drop the indefinite article, unless an adjective is added." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m2-l4-vs1",
        title: "Introducing Yourself at a Spanish Class",
        situation: "First day of a Spanish conversation class. Everyone introduces themselves.",
        agentRole: "You are a Spanish teacher facilitating student introductions. Ask each student their name, where they're from, and what they do. Respond naturally and ask follow-up questions.",
        userGoal: "Introduce yourself using ser: name, nationality/origin, profession or student status.",
        targetPhrases: ["me llamo", "soy de", "soy estudiante", "soy"],
        successCriteria: ["Uses ser correctly for identity and origin", "Drops article before profession"],
        hints: ["Me llamo... / Soy de... / Soy estudiante de..."],
      },
    ],
  },

  // ── LESSON 5 ── Estar — States & Location ───────────────────
  {
    id: "es-l5",
    slug: "estar-states-location",
    title: "Estar — Feelings, States, and Where Things Are",
    content: `# Estar — Feelings, States, and Where Things Are

**Estar** is the second "to be" verb. While ser handles permanent identity, estar handles **location**, **feelings**, **health**, and **temporary states** — how things are *right now*.

## Estar Conjugation

| Pronoun | Estar | English |
|---------|-------|---------|
| **yo** | **estoy** | I am |
| **tú** | **estás** | you are |
| **él / ella / usted** | **está** | he/she is / you are (formal) |
| **nosotros** | **estamos** | we are |
| **vosotros** | **estáis** | you all are |
| **ellos / ustedes** | **están** | they are |

Note: all forms except **estoy** have an accent mark. Remember: está, estás, están — the accent signals these are not the regular stress pattern.

\`\`\`concept
{ "title": "When to Use Estar — The PLACE Mnemonic", "variant": "info", "content": "Estar covers four categories — remember PLACE: P = Position/location (Estoy en Madrid. El libro está en la mesa.), L = Like/feelings (Estoy contento. She's happy.), A = Actions in progress (Estoy hablando. I'm talking.), C = Conditions/states (La puerta está abierta. The door is open.), E = Emotions and health (Estás enfermo. You're sick.)" }
\`\`\`

## Estar in Action

**Location — where something physically is:**
- Estoy en casa. — I'm at home.
- El banco está en la calle Mayor. — The bank is on Main Street.
- ¿Dónde está el baño? — Where is the bathroom?

**Feelings and emotional states:**
- Estoy contento/a. — I'm happy.
- Está triste. — She's sad.
- Estamos cansados. — We're tired.
- ¿Cómo estás? — How are you? (literally: how are you being right now?)

**Health:**
- Estoy bien. — I'm well / I'm fine.
- Estoy enfermo/a. — I'm sick.
- El paciente está mejor hoy. — The patient is better today.

**Temporary conditions:**
- La ventana está abierta. — The window is open.
- El café está frío. — The coffee is cold. *(right now, not always)*
- La tienda está cerrada. — The shop is closed.

**Progressive tense (estar + -ando/-iendo):**
- Estoy hablando. — I am speaking.
- Está comiendo. — He is eating.
- Estamos estudiando. — We are studying.

\`\`\`compare
{ "title": "¿Cómo eres? vs ¿Cómo estás? — Two Completely Different Questions", "left": { "label": "¿Cómo eres? (ser)", "items": ["Asks about your permanent character", "'¿Cómo eres?' = 'What are you like?'", "Answer: 'Soy simpático y trabajador'", "Asking about personality traits", "You don't use this to greet people"] }, "right": { "label": "¿Cómo estás? (estar)", "items": ["Asks about your current state", "'¿Cómo estás?' = 'How are you today?'", "Answer: 'Estoy bien, gracias'", "Asking about health/mood right now", "The standard everyday greeting"] } }
\`\`\`

\`\`\`quiz
{ "question": "¿Dónde ___ el supermercado? (Where is the supermarket?)", "options": ["¿Dónde es el supermercado?", "¿Dónde está el supermercado?", "¿Dónde tiene el supermercado?", "¿Dónde hay el supermercado?"], "answer": 1, "explanation": "Physical location of objects and people uses estar: ¿Dónde está el supermercado? The supermarket is temporarily located somewhere — it could move (in theory). Ser is used for events: 'La reunión es aquí' (The meeting is here), because events have inherent locations. For movable things and people: always estar." }
\`\`\`

\`\`\`takeaways
{ "points": ["Estar = location, feelings, health, temporary states, progressive actions — PLACE mnemonic", "Conjugation: estoy, estás, está, estamos, estáis, están (all except estoy have accent marks)", "¿Cómo estás? is the standard greeting — it asks about current state, not permanent character", "Location of physical objects and people → always estar: ¿Dónde está...?", "Estar + -ando/-iendo = progressive: Estoy hablando (I am speaking)"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m2",
    moduleTitle: "Building Blocks — Ser, Estar, Tener",
    order: 2,
    topicId: "es-m2-l5-estar",
    vocabulary: [
      { word: "estoy", translation: "I am (estar)", pronunciation: "ehs-TOY", exampleSentence: "Estoy en casa.", exampleTranslation: "I am at home.", partOfSpeech: "verb" },
      { word: "está", translation: "he/she/it is (estar)", pronunciation: "ehs-TAH", exampleSentence: "¿Dónde está el baño?", exampleTranslation: "Where is the bathroom?", partOfSpeech: "verb" },
      { word: "bien", translation: "well / fine / good", pronunciation: "BYEHN", exampleSentence: "Estoy bien, gracias.", exampleTranslation: "I'm fine, thank you.", partOfSpeech: "adverb" },
      { word: "cansado/a", translation: "tired", pronunciation: "kahn-SAH-doh/dah", exampleSentence: "Estoy muy cansado hoy.", exampleTranslation: "I'm very tired today.", partOfSpeech: "adjective" },
      { word: "enfermo/a", translation: "sick / ill", pronunciation: "ehn-FEHR-moh/mah", exampleSentence: "Mi hermano está enfermo.", exampleTranslation: "My brother is sick.", partOfSpeech: "adjective" },
      { word: "abierto/a", translation: "open", pronunciation: "ah-BYEHR-toh/tah", exampleSentence: "La farmacia está abierta.", exampleTranslation: "The pharmacy is open.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Estar — Location, Feelings, States, Progressive",
        explanation: "Estar handles how things ARE at a moment: location (¿Dónde está?), feelings (Estoy contento), health (Estoy bien/mal), conditions (está abierto/cerrado), and ongoing actions with -ando/-iendo.",
        examples: [
          { correct: "El hotel está en el centro.", translation: "The hotel is in the centre.", note: "Location → estar" },
          { correct: "Estamos cansados.", translation: "We are tired.", note: "Temporary state → estar" },
          { correct: "Está lloviendo.", translation: "It is raining.", note: "Progressive → estar + -iendo" },
        ],
        commonMistakes: [
          { incorrect: "¿Dónde es el baño?", correction: "¿Dónde está el baño?", explanation: "Physical location of a movable thing (even a room) uses estar, not ser. Ser is used for event locations (La conferencia es aquí)." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m2-l5-vs1",
        title: "Checking In at a Hotel",
        situation: "You're checking into a hotel in Barcelona. The receptionist greets you.",
        agentRole: "You are a hotel receptionist in Barcelona. Greet the guest, ask how they are, answer questions about where things are (the lift, the restaurant, the WiFi). Keep responses simple and clear.",
        userGoal: "Greet the receptionist, say how you feel, and ask where the lift (el ascensor) and restaurant (el restaurante) are.",
        targetPhrases: ["estoy", "¿dónde está el ascensor?", "¿dónde está el restaurante?", "estoy bien"],
        successCriteria: ["Uses estar correctly for feelings and location questions", "Asks ¿Dónde está...? for location"],
        hints: ["¿Cómo está usted? → Estoy bien, gracias.", "¿Dónde está el ascensor / el restaurante?"],
      },
    ],
  },

  // ── LESSON 6 ── Ser vs Estar — The Great Disambiguation ─────
  {
    id: "es-l6",
    slug: "ser-vs-estar",
    title: "Ser vs Estar — The Great Disambiguation",
    content: `# Ser vs Estar — The Great Disambiguation

You know each verb separately. Now for the hard part: choosing between them. Some adjectives work with **both** — but the meaning changes completely depending on which verb you use.

\`\`\`concept
{ "title": "The Core Distinction — Nature vs State", "variant": "analogy", "content": "Think of ser as answering 'What IS it?' and estar as answering 'How IS it right now?'. A lemon IS sour (ser — that's its nature). Your coffee IS cold (estar — that's its current state, it was hot earlier). This nature-vs-state logic resolves most ser/estar decisions. When an adjective describes a defining, intrinsic property → ser. When it describes a current, changeable condition → estar." }
\`\`\`

## Same Adjective, Completely Different Meaning

| Adjective | With SER | With ESTAR |
|-----------|----------|-----------|
| **aburrido** | Es aburrido = He IS boring (personality) | Está aburrido = He IS bored (right now) |
| **listo** | Es listo = She IS clever (always) | Está lista = She IS ready (right now) |
| **malo** | Es malo = He IS bad/evil (by nature) | Está malo = He IS sick (right now) |
| **bueno** | Es buena persona = She IS a good person | Está bueno el café = The coffee IS tasty |
| **rico** | Es rico = He IS rich (wealthy) | Está rico = It IS delicious |
| **seguro** | Es seguro = It IS safe (inherently) | Está seguro = He IS sure/certain (right now) |
| **vivo** | Es muy vivo = He IS very sharp/clever | Está vivo = He IS alive |
| **muerto** | — (rarely used with ser) | Está muerto = He IS dead (current state) |

\`\`\`compare
{ "title": "Location — The One Major Exception to the Rules", "left": { "label": "Events → ser (location is defining)", "items": ["La fiesta ES en mi casa.", "El concierto ES en el estadio.", "La reunión ES aquí.", "Events have a set, defining location"] }, "right": { "label": "Objects/People → estar (location is changeable)", "items": ["Juan ESTÁ en casa.", "El libro ESTÁ en la mesa.", "La farmacia ESTÁ en la calle principal.", "Objects and people can always move"] } }
\`\`\`

## Quick Decision Framework

\`\`\`steps
{ "title": "Choosing Ser or Estar — A 4-Step Check", "steps": ["Is it TIME? → SER. (Son las tres. Es martes.)", "Is it LOCATION of a person or object? → ESTAR. (Estoy en Madrid. El banco está aquí.)", "Is it LOCATION of an EVENT? → SER. (La boda es en la iglesia.)", "For everything else: ask 'is this a defining nature (ser) or a current state (estar)?' — La nieve es fría (nature). El café está frío (current state)."] }
\`\`\`

## Contrast Practice

- Soy nervioso. — I AM a nervous person. (personality trait)
- Estoy nervioso. — I AM nervous right now. (current feeling)

- Es una persona aburrida. — She IS a boring person.
- Está aburrida. — She IS bored right now.

- El restaurante es bueno. — The restaurant IS good. (its reputation/nature)
- La paella está buena. — The paella IS good/tasty. (tasting it right now)

\`\`\`quiz
{ "question": "'Picasso ___ español' and 'Picasso ___ muerto'. Which verbs fill the blanks?", "options": ["es / es", "está / está", "es / está", "está / es"], "answer": 2, "explanation": "Picasso ES español — nationality is a defining identity characteristic → ser. Picasso ESTÁ muerto — being dead is treated as a state/condition in Spanish, not an inherent trait → estar. This is one of those cases that surprises English speakers. Spanish sees death as a state (even a permanent one), not a definition of identity." }
\`\`\`

\`\`\`takeaways
{ "points": ["Same adjective + ser/estar = different meaning: Es aburrido (boring person) vs Está aburrido (bored right now)", "Nature/identity/definition → ser. Current state/condition/location of objects → estar", "Time always uses ser. Location of people/objects always uses estar. Location of events uses ser.", "Estar + muerto = dead (treated as a state). Esta vivo = alive.", "When unsure: ask yourself — 'am I describing what it IS by nature, or how it IS right now?'"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m2",
    moduleTitle: "Building Blocks — Ser, Estar, Tener",
    order: 3,
    topicId: "es-m2-l6-ser-vs-estar",
    vocabulary: [
      { word: "aburrido/a", translation: "boring (ser) / bored (estar)", pronunciation: "ah-boo-RREE-doh/dah", exampleSentence: "La clase es aburrida pero estoy aburrido.", exampleTranslation: "The class is boring but I am bored.", partOfSpeech: "adjective" },
      { word: "listo/a", translation: "clever (ser) / ready (estar)", pronunciation: "LEES-toh/tah", exampleSentence: "Eres muy lista y ya estás lista para el examen.", exampleTranslation: "You are very clever and you're already ready for the exam.", partOfSpeech: "adjective" },
      { word: "malo/a", translation: "bad/evil (ser) / sick (estar)", pronunciation: "MAH-loh/lah", exampleSentence: "No es mala persona, solo está mala hoy.", exampleTranslation: "She's not a bad person, she's just sick today.", partOfSpeech: "adjective" },
      { word: "nervioso/a", translation: "nervous / a nervous person", pronunciation: "nehr-BYOH-soh/sah", exampleSentence: "Estoy nervioso antes del examen.", exampleTranslation: "I'm nervous before the exam.", partOfSpeech: "adjective" },
      { word: "vivo/a", translation: "sharp/clever (ser) / alive (estar)", pronunciation: "BEE-boh/bah", exampleSentence: "Es muy vivo y además está vivo — ¡sobrevivió!", exampleTranslation: "He's very sharp and also alive — he survived!", partOfSpeech: "adjective" },
    ],
    grammarPoints: [
      {
        title: "Adjectives That Change Meaning with Ser vs Estar",
        explanation: "A handful of Spanish adjectives have two different English translations depending on whether they follow ser (defining nature) or estar (current state).",
        examples: [
          { correct: "Es aburrido / Está aburrido", translation: "He IS boring / He IS bored", note: "Ser = personality. Estar = current feeling." },
          { correct: "Es listo / Está listo", translation: "He IS clever / He IS ready", note: "The most commonly tested ser/estar pair." },
          { correct: "Es rico / Está rico", translation: "He IS wealthy / It IS delicious", note: "Context makes the meaning clear." },
        ],
        commonMistakes: [
          { incorrect: "¿Dónde es el museo?", correction: "¿Dónde está el museo?", explanation: "Physical location of buildings uses estar. Only use ser for events: La exposición es aquí." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m2-l6-vs1",
        title: "Describing People and Places",
        situation: "A Spanish friend asks about your hometown and your family.",
        agentRole: "You are a curious Spanish friend asking the student to describe their hometown and a family member. Ask questions that require both ser and estar.",
        userGoal: "Describe your hometown (where it is, what it's like) and a family member (who they are, how they are today).",
        targetPhrases: ["es", "está", "soy de", "es una ciudad", "está en", "es muy"],
        successCriteria: ["Uses ser for inherent characteristics of place/person", "Uses estar for location and current state"],
        hints: ["Mi ciudad es... (nature/character of city)", "Mi ciudad está en... (location)", "Mi hermano es... (personality); está... hoy (current state)"],
      },
    ],
  },

  // ── LESSON 7 ── Tener & Hay ──────────────────────────────────
  {
    id: "es-l7",
    slug: "tener-hay",
    title: "Tener & Hay — Having and Existing",
    content: `# Tener & Hay — Having and Existing

Two more essential verbs: **tener** (to have) and **hay** (there is / there are). Tener is irregular and crucial for expressing age, hunger, thirst, and other states that English expresses with "to be". Hay is unchanging — one form for all situations.

## Tener — To Have

| Pronoun | Tener | |
|---------|-------|-|
| **yo** | **tengo** | I have |
| **tú** | **tienes** | you have |
| **él/ella/usted** | **tiene** | he/she/it has |
| **nosotros** | **tenemos** | we have |
| **vosotros** | **tenéis** | you all have |
| **ellos/ustedes** | **tienen** | they have |

Note: **yo tengo** is irregular (most other forms follow a pattern). This is the "yo-go" pattern — the yo form ends in -go.

\`\`\`concept
{ "title": "Tener for Age and Body States — NOT Ser or Estar!", "variant": "warning", "content": "English says: 'I AM 25 years old', 'I AM hungry', 'I AM thirsty', 'I AM afraid'. Spanish uses TENER for all of these: Tengo 25 años, Tengo hambre, Tengo sed, Tengo miedo. Never say 'soy 25 años' or 'estoy hambre' — these are classic English-speaker errors." }
\`\`\`

## Tener Idioms — States Expressed with "Having"

| Spanish | Literal | English meaning |
|---------|---------|----------------|
| **Tengo... años** | I have ... years | I am ... years old |
| **Tengo hambre** | I have hunger | I'm hungry |
| **Tengo sed** | I have thirst | I'm thirsty |
| **Tengo sueño** | I have sleep | I'm sleepy |
| **Tengo miedo** | I have fear | I'm afraid |
| **Tengo frío** | I have cold | I'm cold |
| **Tengo calor** | I have heat | I'm hot |
| **Tengo prisa** | I have hurry | I'm in a hurry |
| **Tengo razón** | I have reason | I'm right |

## Hay — There Is / There Are

**Hay** is the single most useful word for describing existence. It comes from the verb **haber** and it has only ONE form — it never changes for singular or plural.

- **Hay un banco aquí.** — There is a bank here.
- **Hay muchos estudiantes.** — There are many students.
- **¿Hay wifi?** — Is there wifi?
- **No hay problema.** — There's no problem.
- **¿Hay algún restaurante cerca?** — Is there any restaurant nearby?

\`\`\`compare
{ "title": "Hay vs Está/Están — Existence vs Location", "left": { "label": "Hay (does it EXIST here?)", "items": ["¿Hay un banco? — Is there a bank?", "Introducing something for the first time", "No specific bank in mind", "Hay can also be followed by numbers: Hay tres cafés.", "Used when asking if something exists in a place"] }, "right": { "label": "Está/Están (WHERE is the known thing?)", "items": ["¿Dónde está el banco? — Where IS the bank?", "The bank is already known to exist", "Asking for its specific location", "El banco está en la plaza.", "Used when locating a specific, known thing"] } }
\`\`\`

\`\`\`quiz
{ "question": "How do you say 'I'm 30 years old' in Spanish?", "options": ["Soy 30 años.", "Estoy 30 años.", "Tengo 30 años.", "Hay 30 años para mí."], "answer": 2, "explanation": "Age in Spanish uses TENER: Tengo 30 años. Literally 'I have 30 years'. Never use ser or estar for age — 'Soy 30 años' and 'Estoy 30 años' are both wrong and immediately identify you as a beginner. The tener idioms for age, hunger, thirst, sleep, and fear are essential to memorize." }
\`\`\`

\`\`\`takeaways
{ "points": ["Tener conjugation: tengo, tienes, tiene, tenemos, tenéis, tienen — yo tengo is the irregular yo-go form", "Age uses tener: Tengo 25 años (never 'soy 25 años')", "Physical states use tener: tengo hambre, tengo sed, tengo sueño, tengo miedo, tengo frío, tengo calor", "Hay = there is/there are — one form for both singular and plural, never changes", "Hay introduces existence; está/están locate a specific known thing"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m2",
    moduleTitle: "Building Blocks — Ser, Estar, Tener",
    order: 4,
    topicId: "es-m2-l7-tener-hay",
    vocabulary: [
      { word: "tengo", translation: "I have", pronunciation: "TEHN-goh", exampleSentence: "Tengo dos hermanos.", exampleTranslation: "I have two brothers.", partOfSpeech: "verb" },
      { word: "tiene", translation: "he/she/it has", pronunciation: "TYEH-neh", exampleSentence: "Mi madre tiene 55 años.", exampleTranslation: "My mother is 55 years old.", partOfSpeech: "verb" },
      { word: "tengo hambre", translation: "I'm hungry (lit: I have hunger)", pronunciation: "TEHN-goh AHM-breh", exampleSentence: "Tengo mucha hambre — ¿comemos?", exampleTranslation: "I'm very hungry — shall we eat?", partOfSpeech: "phrase" },
      { word: "tengo sed", translation: "I'm thirsty (lit: I have thirst)", pronunciation: "TEHN-goh sehd", exampleSentence: "Tengo sed. ¿Hay agua?", exampleTranslation: "I'm thirsty. Is there water?", partOfSpeech: "phrase" },
      { word: "hay", translation: "there is / there are", pronunciation: "AH-ee (one syllable)", exampleSentence: "Hay un supermercado cerca.", exampleTranslation: "There is a supermarket nearby.", partOfSpeech: "verb (impersonal)" },
      { word: "no hay problema", translation: "no problem / there's no problem", pronunciation: "noh AH-ee proh-BLEH-mah", exampleSentence: "¿Necesitas ayuda? No hay problema.", exampleTranslation: "Do you need help? No problem.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Tener Idioms — States That Use 'Having' in Spanish",
        explanation: "Spanish uses tener (to have) where English uses 'to be' for age and physical/emotional states. These must be memorized as fixed expressions.",
        examples: [
          { correct: "Tengo 22 años.", translation: "I am 22 years old.", note: "Age always uses tener + años" },
          { correct: "Tenemos hambre.", translation: "We are hungry.", note: "Hunger = having hunger in Spanish" },
          { correct: "¿Tienes razón?", translation: "Are you right?", note: "Tener razón = to be right" },
        ],
        commonMistakes: [
          { incorrect: "Soy 30 años / Estoy hambre", correction: "Tengo 30 años / Tengo hambre", explanation: "These are the two most common tener errors. Age and hunger/thirst/sleep/fear all require tener, not ser or estar." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m2-l7-vs1",
        title: "Getting to Know Someone — Ages and Feelings",
        situation: "Chatting with a new Spanish-speaking friend over coffee.",
        agentRole: "You are a friendly Spanish speaker getting to know the student. Ask their age, how many siblings they have, and how they feel right now. Share your own answers too.",
        userGoal: "Use tener to tell your age, describe how you feel (hambre, sed, sueño, etc.), and ask your friend the same.",
        targetPhrases: ["tengo", "años", "tengo hambre", "tengo sed", "¿cuántos años tienes?", "hay"],
        successCriteria: ["Uses tengo + años for age correctly", "Uses tener for physical states", "Avoids estoy/soy for hunger/thirst"],
        hints: ["Tengo [number] años.", "Tengo hambre / sed / sueño.", "¿Cuántos años tienes tú?"],
      },
    ],
  },
];

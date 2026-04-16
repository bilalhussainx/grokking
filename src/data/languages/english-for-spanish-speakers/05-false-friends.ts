// Module 5: False Friends & Essential Vocabulary
// The words that look the same but mean something different — embarrass ≠ embarazar

import type { LanguageLesson } from "@/data/language-types";

export const falseFriendsLessons: LanguageLesson[] = [
  // ── Lesson 1: Dangerous False Cognates ──────────────────────────────────
  {
    id: "en-es-5-1",
    slug: "false-friends",
    title: "Falsos Amigos — Las Palabras Más Peligrosas",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m5",
    moduleTitle: "Module 5: False Friends & Vocabulary",
    order: 1,
    topicId: "en-es-5-1-false-friends",
    content: `# Falsos Amigos — Las Palabras Más Peligrosas

<!-- voice: False friends are words that look similar in Spanish and English but mean completely different things. Some of them can be very embarrassing — literally. Let's learn the most dangerous ones so you never make these mistakes. -->

\`\`\`concept
title: Cognates vs False Friends
body: |
  **True cognates** (real friends) look similar AND mean the same:
  - information = información ✅
  - important = importante ✅
  - hospital = hospital ✅
  - music = música ✅

  **False friends** (falsos amigos) look similar but mean something DIFFERENT:
  - embarazada ≠ embarrassed (¡muy diferente!)
  - éxito ≠ exit
  - librería ≠ library
  - actualmente ≠ actually

  English and Spanish share many Latin roots — this creates both true cognates
  and dangerous false friends. Learn the false ones and you'll avoid real mistakes.
\`\`\`

## The Most Dangerous False Friends

| Spanish word | Spanish meaning | English lookalike | English meaning | REAL English translation |
|-------------|----------------|-------------------|-----------------|--------------------------|
| **embarazada** | pregnant | embarrassed | avergonzado | I am **pregnant** = Estoy embarazada |
| **embarazar** | to impregnate | to embarrass | avergonzar | I'm embarrassed = Estoy **avergonzado** |
| **éxito** | success | exit | salida | Exit = **salida** / Success = **éxito** (this one is a true cognate! "exit" = salida) |
| **librería** | bookshop | library | biblioteca | Library = **biblioteca** / Bookshop = **librería** |
| **actualmente** | currently / nowadays | actually | en realidad / de hecho | Actually = **en realidad** / Currently = **actualmente** |
| **sensible** | sensitive | sensible | razonable / sensato | Sensible (adj) = **razonable** / Sensitive = **sensible** in Spanish |
| **contestar** | to answer | to contest | disputar | To answer = **to answer** / To contest = **to dispute** |
| **pretender** | to intend | to pretend | fingir | To intend = **to intend** / To pretend = **to fake / to pretend** |
| **realizar** | to achieve/carry out | to realize | darse cuenta | To realize = **darse cuenta** / To carry out = **to carry out / achieve** |
| **mayor** | older / greater | mayor | alcalde | Mayor (city leader) = **alcalde** / Older = **older** |

## The Embarrassing One

\`\`\`compare
left:
  label: "What Spanish speakers accidentally say"
  items:
    - "'I am embarrassed' (trying to say 'estoy embarazada')"
    - "This tells English speakers you are PREGNANT!"
    - "'She is very sensible' (trying to say 'es muy sensible')"
    - "This tells English speakers she is REASONABLE, not emotional"
right:
  label: "What you actually mean"
  items:
    - "I am PREGNANT = 'Estoy embarazada'"
    - "I am EMBARRASSED = 'Estoy avergonzado/a' (ashamed, not pregnant)"
    - "She is very SENSITIVE = 'Es muy sensible' (in English too, 'sensitive' is the same!)"
    - "She is SENSIBLE = 'Es razonable / sensata'"
\`\`\`

## More Common False Friends

| Spanish | Looks like | English word | Real English translation |
|---------|-----------|--------------|--------------------------|
| **asistir** | to assist | to attend | I **attended** the class (not "I assisted") |
| **recordar** | to remember | to record | I **remember** your name |
| **soportar** | to tolerate/bear | to support | I can't **stand** him / I **support** my team |
| **largo** | long | large | **Long** table / **Large** (= grande) pizza |
| **simpático** | nice, friendly | sympathetic | **Nice/Friendly** / Sympathetic = **compasivo** |
| **pedir** | to ask for | to prohibit? | To **ask for** / To **order** (in a restaurant) |
| **molestar** | to bother | to molest | To **bother/annoy** / To molest = **abusar** |
| **once** | eleven | once | **Eleven** = once / **Once** = una vez |
| **pan** | bread | pan | **Bread** / **Pan** = sartén |
| **carpeta** | folder/binder | carpet | **Folder** / **Carpet** = alfombra |

\`\`\`quiz
questions:
  - q: "Your colleague says 'I am embarrassed to meet you.' What do they probably mean?"
    options: ["They are very happy to meet you (confused with 'embarazada')", "They are ashamed or uncomfortable in the situation", "They are pregnant", "They are excited"]
    answer: 1
    explanation: "'Embarrassed' in English means feeling ashamed or uncomfortable — like blushing from a mistake. It does NOT mean pregnant. 'Embarazada' = pregnant in Spanish."
  - q: "You want to say 'Fui a la librería.' What is the correct English translation?"
    options: ["I went to the library.", "I went to the bookshop / bookstore.", "I went to the reading place.", "I went to the libre."]
    answer: 1
    explanation: "'Librería' = bookshop (a store that sells books). 'Library' in English = biblioteca (a free place to borrow books). Two different places!"
  - q: "'Actually, I don't think that's correct.' What does 'actually' mean here?"
    options: ["Currently / nowadays", "In fact / in reality", "Actively", "At this moment"]
    answer: 1
    explanation: "'Actually' in English = 'en realidad' or 'de hecho' (used to correct or add a surprising fact). It does NOT mean 'actualmente' (= currently/nowadays)."
\`\`\`

\`\`\`takeaways
items:
  - "embarazada = pregnant (NOT embarrassed) — most important false friend to remember"
  - "library = biblioteca (not librería). Librería = bookshop/bookstore"
  - "actually = en realidad / de hecho (NOT actualmente = currently/nowadays)"
  - "sensible (English) = razonable. Sensitive (English) = sensible (Spanish)"
  - "largo (Spanish) = long. Large (English) = grande"
\`\`\``,
    vocabulary: [
      { word: "embarrassed", translation: "avergonzado/a (NO embarazada)", pronunciation: "/ɪmˈbærəst/", exampleSentence: "I was so embarrassed when I forgot his name.", exampleTranslation: "Me quedé tan avergonzado cuando olvidé su nombre.", partOfSpeech: "adjective" },
      { word: "pregnant", translation: "embarazada", pronunciation: "/ˈprɛɡnənt/", exampleSentence: "She is six months pregnant.", exampleTranslation: "Está embarazada de seis meses.", partOfSpeech: "adjective" },
      { word: "library", translation: "biblioteca (NO librería)", pronunciation: "/ˈlaɪbrɛri/", exampleSentence: "I borrowed this book from the library.", exampleTranslation: "Saqué este libro de la biblioteca.", partOfSpeech: "noun" },
      { word: "actually", translation: "en realidad / de hecho (NO actualmente)", pronunciation: "/ˈæktʃuəli/", exampleSentence: "Actually, I think you're wrong about that.", exampleTranslation: "En realidad, creo que estás equivocado.", partOfSpeech: "adverb" },
      { word: "sensible", translation: "razonable / sensato (NO sensible en español)", pronunciation: "/ˈsɛnsɪbəl/", exampleSentence: "That's a very sensible decision.", exampleTranslation: "Es una decisión muy sensata.", partOfSpeech: "adjective" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-5-1-v1",
        title: "False Friends Quiz Game",
        situation: "Your English tutor tests you on false friends in conversation",
        agentRole: "You are an English tutor playing a word game. Say Spanish words and ask the student to give the correct English translation. If they use a false friend, explain the difference with a laugh. Keep it fun and light.",
        userGoal: "Correctly translate 5 false friend words without using the wrong English lookalike",
        targetPhrases: ["That means...", "In English we say...", "Not '___', but '___'"],
        successCriteria: ["Distinguishes embarazada from embarrassed", "Knows library vs bookstore", "Uses 'actually' correctly", "Avoids large/largo confusion"],
        hints: ["Embarazada = I am PREGNANT, not embarrassed!", "The library is where you borrow books for free — biblioteca", "Actually = en realidad, not actualmente"],
      },
    ],
  },

  // ── Lesson 2: Essential Daily Vocabulary ────────────────────────────────
  {
    id: "en-es-5-2",
    slug: "essential-vocabulary",
    title: "Vocabulario Esencial del Día a Día",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m5",
    moduleTitle: "Module 5: False Friends & Vocabulary",
    order: 2,
    topicId: "en-es-5-2-essential-vocabulary",
    content: `# Vocabulario Esencial del Día a Día

<!-- voice: Now let's build your core vocabulary — the 200 most useful English words for everyday life. We'll organize them by topic so you can find and use them quickly. -->

\`\`\`concept
title: The 200 Most Useful English Words
body: |
  Research shows that the 200 most common English words cover about 80% of
  everyday conversation. You don't need thousands of words to communicate well —
  you need a solid foundation of the right words.

  Today's focus: People, Home, Food, Transport, and Time.
  We'll give you the word, its pronunciation, and a comparison to Spanish.
\`\`\`

## People & Relationships

| English | Spanish | Pronunciation |
|---------|---------|---------------|
| family | familia | /ˈfæməli/ |
| mother / mom | madre / mamá | /ˈmʌðər/ / /mɒm/ |
| father / dad | padre / papá | /ˈfɑːðər/ / /dæd/ |
| sister | hermana | /ˈsɪstər/ |
| brother | hermano | /ˈbrʌðər/ |
| husband | esposo / marido | /ˈhʌzbənd/ |
| wife | esposa / mujer | /waɪf/ |
| friend | amigo/a | /frɛnd/ |
| neighbor | vecino/a | /ˈneɪbər/ |
| boss | jefe/a | /bɒs/ |
| colleague | colega / compañero | /ˈkɒliːɡ/ |

## Home & Daily Life

| English | Spanish | Pronunciation |
|---------|---------|---------------|
| house / home | casa / hogar | /haʊs/ / /hoʊm/ |
| room | habitación / cuarto | /ruːm/ |
| bedroom | dormitorio | /ˈbɛdruːm/ |
| bathroom | baño | /ˈbæθruːm/ |
| kitchen | cocina | /ˈkɪtʃɪn/ |
| living room | sala / salón | /ˈlɪvɪŋ ruːm/ |
| door | puerta | /dɔːr/ |
| window | ventana | /ˈwɪndoʊ/ |
| key | llave | /kiː/ |

## Food & Drinks

| English | Spanish | Pronunciation |
|---------|---------|---------------|
| breakfast | desayuno | /ˈbrɛkfəst/ |
| lunch | almuerzo / comida | /lʌntʃ/ |
| dinner / supper | cena | /ˈdɪnər/ |
| coffee | café | /ˈkɒfi/ |
| water | agua | /ˈwɔːtər/ |
| bread | pan | /brɛd/ |
| chicken | pollo | /ˈtʃɪkɪn/ |
| fruit | fruta | /fruːt/ |
| vegetables | verduras | /ˈvɛdʒtəbəlz/ |

\`\`\`steps
title: Key Pronunciation Traps in this Vocabulary
steps:
  - step: "**breakfast** → /ˈbrɛkfəst/ — NOT 'break-fast'. The 'ea' sounds like 'e' in 'bed'"
  - step: "**kitchen** → /ˈkɪtʃɪn/ — the 'ch' sounds like in 'church', not like Spanish 'qu'"
  - step: "**colleague** → /ˈkɒliːɡ/ — the '-gue' is silent, ends in /ɡ/ sound"
  - step: "**vegetables** → often pronounced /ˈvɛdʒtəbəlz/ — the middle syllables are squashed"
  - step: "**friend** → /frɛnd/ — ends with /nd/ cluster. Don't add a vowel: not 'fri-end-e'"
\`\`\`

## Transport & Getting Around

| English | Spanish | Pronunciation |
|---------|---------|---------------|
| car | coche / carro | /kɑːr/ |
| bus | autobús | /bʌs/ |
| train | tren | /treɪn/ |
| plane | avión | /pleɪn/ |
| taxi | taxi | /ˈtæksi/ |
| station | estación | /ˈsteɪʃən/ |
| airport | aeropuerto | /ˈɛərpɔːrt/ |
| ticket | billete / boleto | /ˈtɪkɪt/ |
| street | calle | /striːt/ |
| corner | esquina | /ˈkɔːrnər/ |

## Time & Days

| English | Spanish | Pronunciation |
|---------|---------|---------------|
| Monday | lunes | /ˈmʌndeɪ/ |
| Tuesday | martes | /ˈtjuːzdeɪ/ |
| Wednesday | miércoles | /ˈwɛnzdeɪ/ |
| Thursday | jueves | /ˈθɜːrzdeɪ/ |
| Friday | viernes | /ˈfraɪdeɪ/ |
| Saturday | sábado | /ˈsætərdeɪ/ |
| Sunday | domingo | /ˈsʌndeɪ/ |
| today | hoy | /təˈdeɪ/ |
| tomorrow | mañana | /təˈmɒroʊ/ |
| yesterday | ayer | /ˈjɛstərdeɪ/ |
| morning | mañana (tiempo) | /ˈmɔːrnɪŋ/ |
| afternoon | tarde | /ˌɑːftərˈnuːn/ |
| evening | tarde/noche (temprana) | /ˈiːvnɪŋ/ |
| night | noche | /naɪt/ |

\`\`\`quiz
questions:
  - q: "What does 'breakfast' mean?"
    options: ["Descanso", "Desayuno", "Almuerzo", "Cena"]
    answer: 1
    explanation: "Breakfast = desayuno (la comida de la mañana). Lunch = almuerzo. Dinner = cena."
  - q: "What day comes after Thursday?"
    options: ["Wednesday", "Saturday", "Friday", "Tuesday"]
    answer: 2
    explanation: "The order: Monday, Tuesday, Wednesday, Thursday, **Friday**, Saturday, Sunday. Thursday → Friday."
  - q: "What's the English word for 'autobús'?"
    options: ["Bus", "Car", "Train", "Taxi"]
    answer: 0
    explanation: "Bus = autobús. Note the pronunciation: /bʌs/ — the 'u' sounds like the 'u' in 'cut', not like Spanish 'u'."
\`\`\`

\`\`\`takeaways
items:
  - "The 200 most common words cover 80% of everyday conversation — quality over quantity"
  - "breakfast = desayuno. lunch = almuerzo. dinner = cena"
  - "Days end in '-day' (Mon-day, Tues-day) — Wednesday is pronounced 'Wendsday' (d is silent)"
  - "morning = mañana (time). afternoon = tarde. evening = tarde/noche temprana"
  - "Focus on pronunciation: 'friend' ends in /nd/ not 'fren-de'. 'Kitchen' = /ˈkɪtʃɪn/"
\`\`\``,
    vocabulary: [
      { word: "breakfast", translation: "desayuno", pronunciation: "/ˈbrɛkfəst/", exampleSentence: "I have breakfast at 7 every morning.", exampleTranslation: "Desayuno a las 7 todas las mañanas.", partOfSpeech: "noun" },
      { word: "dinner", translation: "cena", pronunciation: "/ˈdɪnər/", exampleSentence: "What would you like for dinner?", exampleTranslation: "¿Qué quieres para cenar?", partOfSpeech: "noun" },
      { word: "neighbor", translation: "vecino/a", pronunciation: "/ˈneɪbər/", exampleSentence: "My neighbor is very friendly.", exampleTranslation: "Mi vecino es muy simpático.", partOfSpeech: "noun" },
      { word: "ticket", translation: "billete / boleto / entrada", pronunciation: "/ˈtɪkɪt/", exampleSentence: "I need a ticket to London.", exampleTranslation: "Necesito un billete a Londres.", partOfSpeech: "noun" },
      { word: "tomorrow", translation: "mañana", pronunciation: "/təˈmɒroʊ/", exampleSentence: "See you tomorrow morning!", exampleTranslation: "¡Hasta mañana por la mañana!", partOfSpeech: "adverb" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-5-2-v1",
        title: "Describing Your Day",
        situation: "Tell your English tutor about a typical Tuesday — from morning to night",
        agentRole: "You are an English tutor. Ask the student to describe their Tuesday from morning to evening using time words (morning, afternoon, evening). Ask follow-up questions about meals and transport. Gently correct vocabulary if they use Spanish words.",
        userGoal: "Describe a full day using time words, meals, and transport vocabulary",
        targetPhrases: ["In the morning...", "At lunch time...", "In the afternoon...", "In the evening...", "I have breakfast/lunch/dinner"],
        successCriteria: ["Uses morning/afternoon/evening/night correctly", "Names the three meals in English", "Uses at least 5 words from the vocabulary list"],
        hints: ["In the morning, I have breakfast and go to work by bus.", "At lunch time, I eat a sandwich.", "In the evening, I have dinner with my family."],
      },
    ],
  },

  // ── Lesson 3: Useful Phrases for Real Situations ─────────────────────────
  {
    id: "en-es-5-3",
    slug: "survival-phrases",
    title: "Frases de Supervivencia para Situaciones Reales",
    targetLanguage: "en",
    proficiencyLevel: "A1",
    moduleId: "en-es-m5",
    moduleTitle: "Module 5: False Friends & Vocabulary",
    order: 3,
    topicId: "en-es-5-3-survival-phrases",
    content: `# Frases de Supervivencia para Situaciones Reales

<!-- voice: Now let's learn the phrases you'll actually need in real life — at work, at a store, at the doctor, and in social situations. These are the phrases that native speakers use every single day. -->

\`\`\`concept
title: Why fixed phrases matter
body: |
  For A1 learners, fixed phrases are more useful than grammar rules.
  A native speaker doesn't think "I need to use do/does here" —
  they just say "Can I help you?" automatically.

  Memorize these as complete chunks, not word-by-word.
  They work in real situations immediately, even if you don't know every rule yet.
\`\`\`

## At Work / School

| Situation | Phrase | Spanish equivalent |
|-----------|--------|--------------------|
| Starting a conversation | "Hi, how's it going?" | ¿Qué tal? / ¿Cómo te va? |
| Responding | "Good, thanks! And you?" | Bien, gracias. ¿Y tú? |
| Not understanding | "Sorry, I didn't catch that." | Perdón, no entendí. |
| Asking to repeat | "Could you say that again, please?" | ¿Puede repetir eso, por favor? |
| Asking for meaning | "What does ___ mean?" | ¿Qué significa ___? |
| Showing agreement | "That makes sense." | Tiene sentido. |
| Polite disagreement | "I see your point, but..." | Entiendo tu punto, pero... |

## At a Store / Restaurant

| Situation | Phrase | Spanish equivalent |
|-----------|--------|--------------------|
| Entering a store | Employee: "Can I help you?" | ¿Le puedo ayudar? |
| Browsing | "I'm just looking, thanks." | Solo estoy mirando, gracias. |
| Asking price | "How much does this cost?" | ¿Cuánto cuesta esto? |
| Ordering food | "I'd like a coffee, please." | Quisiera un café, por favor. |
| Paying | "Can I pay by card?" | ¿Puedo pagar con tarjeta? |
| Problem with order | "Excuse me, I ordered the soup." | Perdón, pedí la sopa. |

\`\`\`steps
title: The "I'd like" pattern — more polite than "I want"
steps:
  - step: "'I want coffee' is grammatically correct but sounds blunt in English."
  - step: "'**I'd like** coffee, please' = I would like = sounds polite and natural."
  - step: "'I'd like to order.' / 'I'd like the chicken.' / 'I'd like a table for two.'"
  - step: "In restaurants: 'I'd like...' is standard. 'Can I have...?' is also very common."
  - step: "'Could I have...?' is even more polite — all three are correct at A1."
\`\`\`

## Social Situations

| Situation | Phrase | Spanish equivalent |
|-----------|--------|--------------------|
| First meeting | "Nice to meet you!" | Mucho gusto / Encantado |
| Leaving | "It was great talking to you!" | Fue un placer hablar contigo. |
| Casual goodbye | "Take care!" / "See you later!" | ¡Cuídate! / ¡Hasta luego! |
| Congratulating | "Congratulations!" | ¡Felicidades! / ¡Enhorabuena! |
| Sympathy | "I'm sorry to hear that." | Lo siento / Cuánto lo siento. |
| Thanks intensified | "Thank you so much!" | ¡Muchísimas gracias! |
| Compliment | "That's great!" / "Well done!" | ¡Muy bien! / ¡Excelente! |

## Emergency Phrases — Know These!

\`\`\`steps
title: Critical emergency and problem phrases
steps:
  - step: "**'I need help!'** — ¡Necesito ayuda!"
  - step: "**'Call an ambulance!'** — ¡Llame a una ambulancia!"
  - step: "**'I'm lost.'** — Estoy perdido/a."
  - step: "**'Where is the nearest hospital?'** — ¿Dónde está el hospital más cercano?"
  - step: "**'I don't feel well.'** — No me siento bien."
  - step: "**'Is there anyone who speaks Spanish?'** — ¿Hay alguien que hable español?"
\`\`\`

\`\`\`compare
left:
  label: "Less natural (but understandable)"
  items:
    - "I want a coffee."
    - "Repeat please."
    - "What means this word?"
    - "I no understand."
right:
  label: "Natural English phrasing"
  items:
    - "I'd like a coffee, please."
    - "Could you repeat that, please?"
    - "What does this word mean?"
    - "I don't understand." / "Sorry, I didn't catch that."
\`\`\`

\`\`\`quiz
questions:
  - q: "A store employee says 'Can I help you?' You're just browsing. What's the best response?"
    options: ["No.", "I'm fine thank you, I'm just looking.", "I not need help.", "Yes I am looking just."]
    answer: 1
    explanation: "'I'm just looking, thanks.' or 'I'm fine, thank you, I'm just looking.' is the natural, polite response to 'Can I help you?' when you're browsing."
  - q: "You want to order tea in a restaurant. Which phrase sounds most natural?"
    options: ["I want tea.", "Give me tea please.", "I'd like a tea, please.", "Can I get the tea?"]
    answer: 2
    explanation: "'I'd like a tea, please' is the most natural, polite way to order. 'Can I have a tea, please?' is also very common. 'I want' sounds blunt."
  - q: "Someone tells you bad news. What do you say?"
    options: ["Congratulations!", "I'm sorry to hear that.", "That's great!", "Well done!"]
    answer: 1
    explanation: "'I'm sorry to hear that' expresses sympathy for bad news. 'I'm sorry' can mean both 'I apologize' and 'I feel bad for you' in English — context makes it clear."
\`\`\`

\`\`\`takeaways
items:
  - "Use 'I'd like...' instead of 'I want...' when ordering or requesting — it's more polite"
  - "'Sorry, I didn't catch that' / 'Could you repeat that?' — use these freely, everyone understands"
  - "'I'm just looking, thanks' — essential for shops when you don't need help"
  - "Know the emergency phrases: I need help, I'm lost, I don't feel well, call an ambulance"
  - "Memorize phrases as complete chunks — don't translate word by word in real situations"
\`\`\``,
    vocabulary: [
      { word: "I'd like", translation: "me gustaría / quisiera", pronunciation: "/aɪd laɪk/", exampleSentence: "I'd like a coffee and a sandwich, please.", exampleTranslation: "Quisiera un café y un sándwich, por favor.", partOfSpeech: "phrase" },
      { word: "I'm just looking", translation: "solo estoy mirando", pronunciation: "/aɪm dʒʌst ˈlʊkɪŋ/", exampleSentence: "No thanks, I'm just looking.", exampleTranslation: "No gracias, solo estoy mirando.", partOfSpeech: "phrase" },
      { word: "I'm sorry to hear that", translation: "lo siento (por malas noticias)", pronunciation: "/aɪm ˈsɒri tə hɪər ðæt/", exampleSentence: "— My dog is sick. — Oh, I'm sorry to hear that.", exampleTranslation: "— Mi perro está enfermo. — Vaya, lo siento mucho.", partOfSpeech: "phrase" },
      { word: "I didn't catch that", translation: "no entendí / no oí bien", pronunciation: "/aɪ ˈdɪdnt kætʃ ðæt/", exampleSentence: "Sorry, I didn't catch that. Could you repeat it?", exampleTranslation: "Perdón, no lo entendí. ¿Puede repetirlo?", partOfSpeech: "phrase" },
      { word: "congratulations", translation: "felicidades / enhorabuena", pronunciation: "/kənˌɡrætʃuˈleɪʃənz/", exampleSentence: "Congratulations on your new job!", exampleTranslation: "¡Felicidades por tu nuevo trabajo!", partOfSpeech: "interjection" },
    ],
    grammarPoints: [],
    voiceScenarios: [
      {
        id: "en-es-5-3-v1",
        title: "At a Café",
        situation: "You go to an English-speaking café for lunch",
        agentRole: "You are a café employee taking orders. Ask 'What can I get for you?' and 'Would you like anything else?' Practice with the student: ordering, asking about menu items, and paying. If they say 'I want', model 'I'd like' as a natural alternative.",
        userGoal: "Order a complete meal using polite phrases: I'd like, Can I have, How much",
        targetPhrases: ["I'd like...", "Can I have...", "How much is...?", "Can I pay by card?"],
        successCriteria: ["Uses 'I'd like' or 'Can I have' rather than 'I want'", "Says 'please' and 'thank you'", "Asks for price naturally"],
        hints: ["I'd like a coffee and a sandwich, please.", "What soups do you have today?", "How much does that come to? Can I pay by card?"],
      },
    ],
  },
];

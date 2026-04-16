import type { LanguageLesson } from "@/data/language-types";

// ─────────────────────────────────────────────────────────────────
// MODULE 6: Food, Places & Shopping (3 lessons)
// Real-world survival Spanish — restaurants, navigation, markets.
// ─────────────────────────────────────────────────────────────────

export const foodPlacesShoppingLessons: LanguageLesson[] = [
  // ── LESSON 18 ── Food & Restaurants ─────────────────────────
  {
    id: "es-l18",
    slug: "food-restaurants",
    title: "Food & Ordering at a Restaurant",
    content: `# Food & Ordering at a Restaurant

## Essential Restaurant Vocabulary

**The meal structure:**
- el desayuno — breakfast
- el almuerzo / la comida — lunch (comida is used in Spain; almuerzo more in Latin America)
- la cena — dinner/supper
- la merienda — afternoon snack (very common in Spain, around 6pm)

**Ordering:**
- **¿Qué van a pedir?** — What are you going to order? (to a group)
- **¿Qué va a tomar?** — What will you have? (formal, singular)
- **Quisiera...** — I would like... *(more polite than quiero)*
- **Para mí,...** — For me,...
- **Quiero pedir...** — I want to order...
- **¿Me puede traer...?** — Can you bring me...?
- **La cuenta, por favor.** — The bill, please.
- **¿Está incluida la propina?** — Is the tip included?

\`\`\`concept
{ "title": "Quisiera — The Polite Way to Order", "variant": "info", "content": "Quiero un café means 'I want a coffee' — grammatically correct but slightly blunt. Quisiera un café means 'I would like a coffee' — this is the conditional form and is universally more polite when ordering. Use quisiera in restaurants and shops. It does NOT change for other persons at A1 level — just learn 'quisiera' as a fixed polite phrase." }
\`\`\`

## Common Food Vocabulary

**Proteins:** el pollo (chicken), el pescado (fish), la carne (meat/beef), el jamón (ham), los mariscos (seafood), los huevos (eggs), el queso (cheese)

**Carbs & Vegetables:** el arroz (rice), el pan (bread), las patatas/papas (potatoes), la ensalada (salad), la sopa (soup), las verduras (vegetables), la lechuga (lettuce), el tomate (tomato)

**Drinks:** el agua (water — feminine!), el vino (wine), la cerveza (beer), el café (coffee), el zumo/jugo (juice), la leche (milk)

**Desserts:** el postre (dessert), el helado (ice cream), el pastel/la tarta (cake)

## Expressing Preferences and Dietary Needs

- Soy vegetariano/a. — I'm vegetarian.
- Soy vegano/a. — I'm vegan.
- Soy alérgico/a al marisco. — I'm allergic to seafood.
- No como carne. — I don't eat meat.
- Sin gluten, por favor. — Gluten-free, please.
- ¿Tiene opciones vegetarianas? — Do you have vegetarian options?

\`\`\`compare
{ "title": "Tomar vs Comer vs Beber — Three Verbs for Eating/Drinking", "left": { "label": "Comer (to eat) and Beber (to drink)", "items": ["Specific: comer = eat, beber = drink", "Como pollo. (I eat chicken.)", "Bebo agua. (I drink water.)", "Used in general statements about habits"] }, "right": { "label": "Tomar (to take/have — versatile)", "items": ["Very common for food AND drink in casual speech", "Tomo un café. (I'll have a coffee.)", "¿Qué tomas? (What are you having?)", "Interchangeable with comer/beber informally"] } }
\`\`\`

\`\`\`quiz
{ "question": "Which phrase is the most polite way to order in a Spanish restaurant?", "options": ["Quiero una paella.", "Dame una paella.", "Quisiera una paella, por favor.", "Una paella, ya."], "answer": 2, "explanation": "Quisiera is the conditional of querer and is universally used as the polite form of 'I would like'. Adding 'por favor' makes it even more courteous. 'Quiero' is grammatically fine but sounds more demanding. 'Dame' (give me) is very informal. 'Una paella, ya' (a paella, now) sounds impatient and rude." }
\`\`\`

\`\`\`takeaways
{ "points": ["Quisiera + noun/infinitive = polite 'I would like' — use this in restaurants instead of quiero", "La cuenta, por favor = the bill, please — one of the most-used phrases when dining out", "El agua is feminine despite the 'el' article — use 'el agua' (not 'la agua') to avoid the vowel clash", "Tomar is used interchangeably with comer/beber in casual food/drink contexts", "Meal times: desayuno (breakfast), almuerzo/comida (lunch), merienda (afternoon snack), cena (dinner)"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m6",
    moduleTitle: "Food, Places & Shopping",
    order: 1,
    topicId: "es-m6-l18-food-restaurants",
    vocabulary: [
      { word: "quisiera", translation: "I would like (polite order form)", pronunciation: "kee-SYEH-rah", exampleSentence: "Quisiera una mesa para dos, por favor.", exampleTranslation: "I would like a table for two, please.", partOfSpeech: "verb (conditional)" },
      { word: "la cuenta", translation: "the bill / the check", pronunciation: "lah KWEHN-tah", exampleSentence: "La cuenta, por favor.", exampleTranslation: "The bill, please.", partOfSpeech: "noun" },
      { word: "el pollo", translation: "chicken", pronunciation: "ehl POH-yoh", exampleSentence: "Quisiera pollo a la plancha.", exampleTranslation: "I would like grilled chicken.", partOfSpeech: "noun" },
      { word: "el agua (f)", translation: "water (feminine noun!)", pronunciation: "ehl AH-gwah", exampleSentence: "¿Puede traerme un agua sin gas?", exampleTranslation: "Can you bring me a still water?", partOfSpeech: "noun" },
      { word: "sin", translation: "without", pronunciation: "seen", exampleSentence: "Quisiera el café sin azúcar.", exampleTranslation: "I would like the coffee without sugar.", partOfSpeech: "preposition" },
      { word: "para mí", translation: "for me", pronunciation: "PAH-rah mee", exampleSentence: "Para mí, la ensalada.", exampleTranslation: "For me, the salad.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "El agua — Feminine Noun with Masculine Article",
        explanation: "El agua (water) is grammatically feminine, but uses 'el' (not 'la') in the singular to avoid the awkward 'la a-' vowel clash. The plural is 'las aguas'. This rule applies to any feminine noun starting with a stressed 'a': el área, el alma, el águila.",
        examples: [
          { correct: "Quiero el agua sin gas.", translation: "I want still water.", note: "el agua (singular) — despite being feminine" },
          { correct: "Las aguas del océano", translation: "The ocean waters", note: "las aguas (plural) — la returns in plural" },
        ],
        commonMistakes: [
          { incorrect: "la agua", correction: "el agua", explanation: "Feminine nouns starting with stressed 'a' use 'el' (not 'la') in the singular to avoid the vowel clash. But adjectives still use feminine form: el agua fría." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m6-l18-vs1",
        title: "Ordering at a Restaurant in Seville",
        situation: "You're at a restaurant in Seville for lunch. The server comes to take your order.",
        agentRole: "You are a friendly server at a traditional restaurant in Seville. Greet the customer, take their order, ask if they have any dietary needs, and bring the bill at the end.",
        userGoal: "Order a full meal: starter, main, drink, and dessert. Ask for the bill at the end. Use quisiera and para mí.",
        targetPhrases: ["quisiera", "para mí", "sin", "la cuenta por favor", "¿tiene?", "soy alérgico/a"],
        successCriteria: ["Uses quisiera for polite ordering", "Asks for the bill correctly", "Makes at least one dietary specification"],
        hints: ["Quisiera... de primero / de segundo / de postre. Para beber, quisiera... La cuenta, por favor."],
      },
    ],
  },

  // ── LESSON 19 ── Places & Directions ────────────────────────
  {
    id: "es-l19",
    slug: "places-directions",
    title: "Places in Town & Giving Directions",
    content: `# Places in Town & Giving Directions

## Places in the City

| Spanish | English |
|---------|---------|
| el banco | bank |
| la farmacia | pharmacy |
| el supermercado | supermarket |
| el hospital | hospital |
| la estación (de tren/metro) | train/metro station |
| el aeropuerto | airport |
| la iglesia | church |
| la plaza | town square |
| el parque | park |
| el museo | museum |
| la biblioteca | library |
| la oficina de correos | post office |
| el ayuntamiento | town hall |
| la comisaría | police station |
| el centro comercial | shopping centre/mall |
| el cajero automático | ATM |

## Asking for Directions

- **¿Dónde está...?** — Where is...? *(singular thing)*
- **¿Cómo llego a...?** — How do I get to...?
- **¿Hay una farmacia cerca?** — Is there a pharmacy nearby?

## Giving Directions — Key Phrases

| Spanish | English |
|---------|---------|
| **Gira a la derecha.** | Turn right. |
| **Gira a la izquierda.** | Turn left. |
| **Sigue todo recto.** | Go straight ahead. |
| **Sigue recto hasta...** | Go straight until... |
| **Cruza la calle.** | Cross the street. |
| **Toma la primera/segunda calle.** | Take the first/second street. |
| **Está al final de la calle.** | It's at the end of the street. |
| **Está a dos minutos.** | It's two minutes away. |
| **Está a cinco minutos a pie.** | It's five minutes on foot. |

## Prepositions of Place

| Spanish | English | Example |
|---------|---------|---------|
| **cerca de** | near | Está cerca del banco. |
| **lejos de** | far from | Está lejos del centro. |
| **al lado de** | next to | Está al lado de la farmacia. |
| **enfrente de** | opposite / in front of | Está enfrente del hotel. |
| **detrás de** | behind | Está detrás del parque. |
| **entre** | between | Está entre el banco y la iglesia. |
| **a la derecha de** | to the right of | Está a la derecha del museo. |
| **a la izquierda de** | to the left of | Está a la izquierda del hotel. |

\`\`\`steps
{ "title": "Giving Directions in Spanish — A Natural Flow", "steps": ["Start with orientation: 'Sigue recto por esta calle...'", "Give the turn: '...hasta el semáforo, luego gira a la derecha.'", "Identify the landmark: 'Está al lado del banco / enfrente de la iglesia.'", "Give distance estimate: 'Está a unos diez minutos a pie.'", "Optional: offer to accompany: '¿Quieres que te acompañe?'"] }
\`\`\`

\`\`\`quiz
{ "question": "Someone asks ¿Dónde está el museo? You want to say 'It's next to the park'. How?", "options": ["Está cerca el parque.", "Está al lado del parque.", "Está al lado de el parque.", "Está junto parque."], "answer": 1, "explanation": "Al lado de = next to. When followed by 'el' (masculine definite article), 'de + el' contracts to 'del'. So: al lado del parque. Never write 'de el' — it must always contract. 'Cerca de el' would also be wrong — it should be 'cerca del'. 'Junto' exists but requires 'a': junto al parque." }
\`\`\`

\`\`\`takeaways
{ "points": ["¿Dónde está...? for location of specific things. ¿Hay...? for asking if something exists nearby.", "Directions: sigue recto (straight), gira a la derecha/izquierda (turn right/left), cruza la calle (cross the street)", "Key prepositions: cerca de, lejos de, al lado de, enfrente de, detrás de, entre", "Remember: de + el = del (al lado DEL parque, cerca DEL banco)", "Está a X minutos (a pie / en coche) = it's X minutes (on foot / by car)"] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m6",
    moduleTitle: "Food, Places & Shopping",
    order: 2,
    topicId: "es-m6-l19-places-directions",
    vocabulary: [
      { word: "la farmacia", translation: "pharmacy", pronunciation: "lah far-MAH-syah", exampleSentence: "¿Hay una farmacia cerca?", exampleTranslation: "Is there a pharmacy nearby?", partOfSpeech: "noun" },
      { word: "sigue recto", translation: "go straight ahead", pronunciation: "SEE-geh REHK-toh", exampleSentence: "Sigue recto hasta el semáforo.", exampleTranslation: "Go straight until the traffic light.", partOfSpeech: "phrase" },
      { word: "gira a la derecha", translation: "turn right", pronunciation: "KHEE-rah ah lah deh-REH-chah", exampleSentence: "Gira a la derecha en la esquina.", exampleTranslation: "Turn right at the corner.", partOfSpeech: "phrase" },
      { word: "al lado de", translation: "next to", pronunciation: "ahl LAH-doh deh", exampleSentence: "El banco está al lado de la farmacia.", exampleTranslation: "The bank is next to the pharmacy.", partOfSpeech: "preposition phrase" },
      { word: "enfrente de", translation: "opposite / in front of", pronunciation: "ehn-FREHN-teh deh", exampleSentence: "El hotel está enfrente del parque.", exampleTranslation: "The hotel is opposite the park.", partOfSpeech: "preposition phrase" },
      { word: "a X minutos a pie", translation: "X minutes on foot", pronunciation: "ah ... mee-NOO-tohs ah PYEH", exampleSentence: "Está a cinco minutos a pie.", exampleTranslation: "It's five minutes on foot.", partOfSpeech: "phrase" },
    ],
    grammarPoints: [
      {
        title: "Prepositions of Place + del Contraction",
        explanation: "Prepositions of place (cerca de, al lado de, enfrente de, detrás de) are always followed by de + article. When de meets el, it must contract to del.",
        examples: [
          { correct: "cerca del banco", translation: "near the bank", note: "de + el banco = del banco" },
          { correct: "al lado de la farmacia", translation: "next to the pharmacy", note: "de + la stays as de la (no contraction with la)" },
          { correct: "enfrente del hospital", translation: "opposite the hospital", note: "de + el hospital = del hospital" },
        ],
        commonMistakes: [
          { incorrect: "al lado de el parque", correction: "al lado del parque", explanation: "de + el must always contract to del. Writing 'de el' is a grammar error." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m6-l19-vs1",
        title: "Getting Directions in Barcelona",
        situation: "You're lost in Barcelona and need to find the nearest pharmacy and the Sagrada Família.",
        agentRole: "You are a helpful local in Barcelona. Give clear directions to the pharmacy and the Sagrada Família using proper landmarks, turns, and distances. If the student asks you to repeat or slow down, do so cheerfully.",
        userGoal: "Ask for directions to the pharmacy (farmacia) and Sagrada Família. Understand and confirm the directions.",
        targetPhrases: ["¿dónde está?", "¿hay una farmacia cerca?", "¿cómo llego a?", "gira a la", "sigue recto", "gracias"],
        successCriteria: ["Asks for directions correctly with ¿Dónde está? or ¿Hay...?", "Confirms understanding by repeating directions"],
        hints: ["Perdone, ¿dónde está la farmacia más cercana? / ¿Cómo llego a la Sagrada Família?"],
      },
    ],
  },

  // ── LESSON 20 ── Shopping ────────────────────────────────────
  {
    id: "es-l20",
    slug: "shopping",
    title: "Shopping — Prices, Quantities & Trying Things On",
    content: `# Shopping — Prices, Quantities & Trying Things On

## Key Shopping Phrases

| Spanish | English |
|---------|---------|
| **¿Cuánto cuesta?** | How much does it cost? |
| **¿Cuánto cuestan?** | How much do they cost? (plural) |
| **¿Tiene...?** | Do you have...? |
| **Quisiera...** | I would like... |
| **¿Puedo probármelo/la?** | Can I try it on? |
| **¿Hay en otra talla?** | Is there another size? |
| **¿Puedo pagar con tarjeta?** | Can I pay by card? |
| **Es muy caro/a.** | It's very expensive. |
| **¿Me hace un descuento?** | Can you give me a discount? |
| **Me lo/la llevo.** | I'll take it. |

## Clothing and Sizes

**Clothing:** la camiseta (t-shirt), la camisa (shirt), el pantalón (trousers), los vaqueros/jeans (jeans), el vestido (dress), la falda (skirt), el abrigo (coat), los zapatos (shoes), las botas (boots), el sombrero (hat)

**Sizes:** la talla (size — clothing), el número (size — shoes)
- ¿Qué talla usa usted? — What size do you wear?
- Uso la talla M / mediana. — I wear a medium.
- ¿Tiene esto en talla grande? — Do you have this in a large?

**Colors (with agreement):** rojo/a (red), azul (blue, invariable), verde (green, invariable), amarillo/a (yellow), blanco/a (white), negro/a (black), gris (grey, invariable), marrón (brown, invariable), naranja (orange, invariable)

## Quantities at a Market or Grocery

| Spanish | English |
|---------|---------|
| un kilo de | a kilo of |
| medio kilo de | half a kilo of |
| 200 gramos de | 200 grams of |
| una docena de | a dozen |
| una botella de | a bottle of |
| una lata de | a can of |
| un paquete de | a packet of |
| una bolsa de | a bag of |

## Direct Object Pronouns — Lo / La / Los / Las

When you've already named an item, replace it with a pronoun to avoid repetition:

- ¿Te gusta este vestido? — **Me lo** llevo. *(Me lo llevo = I'll take it — the dress)*
- ¿Quieres los zapatos? — **Los** quiero en negro. *(los = the shoes)*
- ¿Prueba la camiseta? — Sí, **la** pruebo. *(la = the t-shirt)*

| Object | Pronoun |
|--------|---------|
| masculine singular | **lo** |
| feminine singular | **la** |
| masculine plural | **los** |
| feminine plural | **las** |

\`\`\`concept
{ "title": "Me lo llevo — The Quintessential Shopping Phrase", "variant": "success", "content": "'Me lo llevo' (I'll take it — masculine item) and 'me la llevo' (I'll take it — feminine item) are the phrases to use when you've decided to buy something. Lo/la is the direct object pronoun referring to the item. 'Me' is the indirect object (for me). Together: 'I take it for myself.' In a clothing shop: Me lo llevo (buying a shirt/coat/hat). Me la llevo (buying a dress/bag/skirt)." }
\`\`\`

\`\`\`quiz
{ "question": "You want to buy a dress (el vestido = masculine? or feminine?). How do you say 'I'll take it'?", "options": ["Me lo llevo. (vestido is masculine → lo)", "Me la llevo. (vestido is feminine → la)", "Me llevo. (no pronoun needed)", "Lo me llevo. (wrong word order)"], "answer": 0, "explanation": "El vestido (dress) is masculine in Spanish (el vestido). So the direct object pronoun is 'lo' (masculine). Me lo llevo. Note: in English, 'dress' reads as feminine, but in Spanish it's grammatically masculine (el vestido). Follow Spanish gender, not English intuition." }
\`\`\`

\`\`\`takeaways
{ "points": ["¿Cuánto cuesta? (singular) / ¿Cuánto cuestan? (plural) — how much does it/do they cost?", "Me lo/la llevo = I'll take it — lo for masculine items, la for feminine items", "¿Puedo probármelo/la? = Can I try it on? — essential in clothing shops", "Colors: azul, verde, gris, marrón, naranja are invariable (same for m/f)", "Quantities: un kilo de, medio kilo de, una docena de, una botella de..."] }
\`\`\``,
    targetLanguage: "es",
    proficiencyLevel: "A1",
    moduleId: "es-m6",
    moduleTitle: "Food, Places & Shopping",
    order: 3,
    topicId: "es-m6-l20-shopping",
    vocabulary: [
      { word: "¿cuánto cuesta?", translation: "how much does it cost?", pronunciation: "KWAHN-toh KWEHS-tah", exampleSentence: "¿Cuánto cuesta esta camiseta?", exampleTranslation: "How much does this t-shirt cost?", partOfSpeech: "phrase" },
      { word: "me lo / me la llevo", translation: "I'll take it (m) / I'll take it (f)", pronunciation: "meh loh / meh lah YEH-boh", exampleSentence: "Me lo llevo. ¿Puedo pagar con tarjeta?", exampleTranslation: "I'll take it. Can I pay by card?", partOfSpeech: "phrase" },
      { word: "¿puedo probármelo?", translation: "can I try it on?", pronunciation: "PWEH-doh proh-BAR-meh-loh", exampleSentence: "¿Puedo probármelo? Es mi talla.", exampleTranslation: "Can I try it on? It's my size.", partOfSpeech: "phrase" },
      { word: "la talla", translation: "size (clothing)", pronunciation: "lah TAH-yah", exampleSentence: "¿Tiene esto en talla pequeña?", exampleTranslation: "Do you have this in a small size?", partOfSpeech: "noun" },
      { word: "caro/a", translation: "expensive", pronunciation: "KAH-roh/rah", exampleSentence: "Es demasiado caro para mí.", exampleTranslation: "It's too expensive for me.", partOfSpeech: "adjective" },
      { word: "el descuento", translation: "discount", pronunciation: "ehl dehs-KWEHN-toh", exampleSentence: "¿Me puede hacer un descuento?", exampleTranslation: "Can you give me a discount?", partOfSpeech: "noun" },
    ],
    grammarPoints: [
      {
        title: "Direct Object Pronouns — Lo, La, Los, Las",
        explanation: "When the direct object has already been named, replace it with a pronoun to avoid repetition. The pronoun agrees in gender and number with the replaced noun and comes before the verb.",
        examples: [
          { correct: "¿Quieres el libro? — Sí, lo quiero.", translation: "Do you want the book? — Yes, I want it.", note: "el libro (m.sg) → lo" },
          { correct: "¿Tienes la llave? — No, no la tengo.", translation: "Do you have the key? — No, I don't have it.", note: "la llave (f.sg) → la" },
          { correct: "Me lo llevo.", translation: "I'll take it. (masculine item)", note: "Me = indirect (for me). Lo = direct (it)." },
        ],
        commonMistakes: [
          { incorrect: "Me llevo lo.", correction: "Me lo llevo.", explanation: "Object pronouns come before the verb, not after it. And when two pronouns are used (me + lo), they both go before the verb together." },
        ],
      },
    ],
    voiceScenarios: [
      {
        id: "es-m6-l20-vs1",
        title: "Clothing Shop in Mexico City",
        situation: "You're shopping for clothes in a market in Mexico City.",
        agentRole: "You are a friendly market vendor in Mexico City. Show the customer clothes, tell them prices, respond to size requests, and process the sale. Use Mexican Spanish vocabulary (like playera for t-shirt instead of camiseta).",
        userGoal: "Find a clothing item you like, ask the price, ask to try it on, negotiate if too expensive, and buy it with me lo/la llevo.",
        targetPhrases: ["¿cuánto cuesta?", "¿puedo probármelo/la?", "¿tiene en otra talla?", "es muy caro", "me lo/la llevo"],
        successCriteria: ["Asks price correctly", "Requests to try on with puedo probármelo/la", "Uses me lo or me la llevo correctly"],
        hints: ["¿Cuánto cuesta esta camisa? / ¿Tiene en talla mediana? / ¿Puedo probármela? / Me la llevo."],
      },
    ],
  },
];

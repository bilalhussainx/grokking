import { Module } from "../types";

export const ethicsDharmaModule: Module = {
  id: "hinduism-ethics-dharma",
  title: "Hindu Ethics & Dharma",
  description: "Explore Dharma — the foundational ethical concept in Hinduism — including the four aims of life (Purusharthas), the stages of life (Ashramas), the caste system and its modern critique, and the principle of Ahimsa (non-violence). Resources: Arvind Sharma, Hinduism and Human Rights; Patrick Olivelle, Dharmasutras (Oxford).",
  lessons: [
    {
      id: "hinduism-concept-of-dharma",
      slug: "concept-of-dharma",
      title: "Dharma: The Cosmic and Moral Order",
      content: `## Dharma: The Cosmic and Moral Order

<!-- voice:section_check concept="Dharma as both cosmic law and personal moral duty" -->

\`\`\`concept
{ "title": "Dharma — The Word That Holds Everything Together", "variant": "mental-model", "content": "Dharma (धर्म) comes from the Sanskrit root *dhri* (धृ) — 'to hold, sustain, support.' It names whatever holds the universe in order: cosmic law, righteous conduct, social duty, and personal calling, all at once. There is no single English translation. To understand Dharma is to understand how Hinduism thinks about ethics, purpose, and reality simultaneously." }
\`\`\`

**Dharma** is arguably the most important concept in Hinduism. Unlike a single English word such as "duty" or "law," Dharma operates at multiple levels at the same time — from the physical laws that keep planets in orbit, to the moral principles that should govern a society, to the unique calling of an individual soul.

The Mahabharata acknowledges its depth with quiet honesty:

> *"Dharma is subtle."* (sukshma dharma)
> — Mahabharata, Vana Parva

### The Multiple Dimensions of Dharma

| Dimension | Sanskrit Term | Meaning |
|-----------|--------------|---------|
| **Cosmic order** | Rita / Dharma | Natural laws governing the universe |
| **Universal ethics** | Sanatana Dharma | Eternal principles: truth, non-violence, compassion |
| **Social duty** | Varna Dharma | Duties tied to one's role in society |
| **Personal calling** | Svadharma | One's own specific responsibilities and vocation |
| **Stage-of-life duty** | Ashrama Dharma | Duties appropriate to one's phase of life |
| **Contextual ethics** | Apad Dharma | Ethical adaptations permitted in emergencies |

These dimensions are not competing definitions — they are concentric rings, each nested within the next.

\`\`\`mermaid
graph TD
    A[Dharma] --> B[Sanatana Dharma<br>Universal Ethics]
    A --> C[Varnashrama Dharma<br>Social Duty]
    A --> D[Svadharma<br>Personal Calling]
\`\`\`

---

### The Four Purusharthas: The Aims of a Human Life

Hinduism does not demand that people renounce the world. Instead, it organizes human aspiration into four legitimate goals — the **Purusharthas** (पुरुषार्थ, "objects of human pursuit").

\`\`\`tabs
{ "tabs": [
  { "label": "Dharma", "icon": "⚖️", "content": "**Dharma (धर्म) — Righteousness & Moral Duty**\\n\\nThe first and framing Purushartha. All other goals must be pursued *within* the boundaries Dharma sets. Without it, the pursuit of wealth or pleasure becomes destructive.\\n\\n> \\"Let him not act against Dharma, even if pressed by desire.\\" — Manusmriti 4.176" },
  { "label": "Artha", "icon": "💰", "content": "**Artha (अर्थ) — Wealth & Worldly Success**\\n\\nMaterial prosperity, political power, and practical achievement are *legitimate* goals. Hinduism never equates poverty with holiness. The Arthashastra (attributed to Kautilya, c. 300 BCE) is a sophisticated manual on statecraft, economics, and governance — entirely within the Hindu tradition." },
  { "label": "Kama", "icon": "🌸", "content": "**Kama (काम) — Pleasure, Love & Aesthetic Joy**\\n\\nDesire, sensory pleasure, and love are honored parts of human life — not sins to be suppressed. The Kama Sutra is not merely about sex; it is a treatise on the full art of civilized living and refined pleasure. Kama becomes a problem only when it overrides Dharma." },
  { "label": "Moksha", "icon": "🕊️", "content": "**Moksha (मोक्ष) — Liberation**\\n\\nThe ultimate aim: freedom from the cycle of birth, death, and rebirth (samsara). Moksha is not the *only* goal — it is the final goal. A person may spend most of their life pursuing Artha and Kama. But the tradition holds that genuine, lasting fulfillment comes only through spiritual liberation." }
] }
\`\`\`

\`\`\`callout
{ "type": "insight", "title": "A Balanced View of Human Flourishing", "content": "The Purushartha framework is remarkable because it *refuses* to condemn ordinary life. Wealth and pleasure are not obstacles to salvation — they are dignified parts of being human. The task is not to deny them but to pursue them wisely, within Dharma, and with an eye toward the deeper freedom of Moksha." }
\`\`\`

---

### The Four Ashramas: Stages of a Full Life

The tradition also maps Dharma onto the human lifespan, dividing it into four **Ashramas** (आश्रम) — each with its own duties, freedoms, and spiritual orientation.

\`\`\`steps
{ "title": "The Four Ashramas", "steps": [
  { "title": "Brahmacharya — The Student (ब्रह्मचर्य)", "content": "The first stage, from childhood through young adulthood. The student lives with a teacher (guru), studies the Vedas, practices celibacy, and builds the intellectual and moral foundation for the rest of life. Discipline and learning are the primary duties here." },
  { "title": "Grihastha — The Householder (गृहस्थ)", "content": "The second and, according to many texts, the most important stage. The householder marries, raises a family, pursues a career, and supports society — including priests, students, and renunciants — through their labor. This is the stage where Artha and Kama are most fully lived." },
  { "title": "Vanaprastha — The Forest Dweller (वानप्रस्थ)", "content": "As children grow and grandchildren arrive, the householder gradually withdraws from daily responsibilities. The name means 'forest-going' — a metaphor for stepping back from active life to focus on mentoring, reflection, and deepening spiritual practice while still remaining in the world." },
  { "title": "Sannyasa — The Renunciant (संन्यास)", "content": "The final stage: complete renunciation of worldly attachments. The sannyasi abandons home, possessions, and social identity to dedicate themselves entirely to the pursuit of Moksha. They may wander as a wandering monk (sadhu), live in an ashram, or dwell in solitude." }
] }
\`\`\`

---

### Ahimsa: Non-Violence as the Highest Dharma

**Ahimsa** (अहिंसा, "non-harming") is woven through Hindu ethics at every level. The Mahabharata states it with striking directness:

> *"Ahimsa paramo dharma"* — "Non-violence is the highest Dharma."
> — Mahabharata, Adi Parva 11.13

Ahimsa is not merely the absence of physical violence. It extends to harsh speech, mental cruelty, and harm to animals. It is the philosophical root of vegetarianism in many Hindu traditions, and it became the ethical engine of Mahatma Gandhi's philosophy of **satyagraha** (सत्याग्रह, "truth-force") — the practice of non-violent resistance that shaped the Indian independence movement and inspired civil rights struggles worldwide.

---

### Varna and Caste: Ancient Vision and Painful Legacy

\`\`\`collapse
{ "title": "Deep Dive: From Varna to Jati — The Historical Transformation", "content": "The ancient **Varna** (वर्ण, 'color' or 'type') system described four functional categories of society:\\n\\n- **Brahmins** (ब्राह्मण) — priests, scholars, teachers\\n- **Kshatriyas** (क्षत्रिय) — warriors, rulers, administrators\\n- **Vaishyas** (वैश्य) — merchants, farmers, artisans\\n- **Shudras** (शूद्र) — laborers, service providers\\n\\nThe Rig Veda's Purusha Sukta (10.90) describes these as emerging from the cosmic being (Purusha) at creation. Crucially, the Bhagavad Gita (4.13) states that Krishna created the four varnas according to *guna* (qualities) and *karma* (actions) — **not birth**.\\n\\nOver centuries, however, varna hardened into the **jati** (जाति) system — hundreds of hereditary occupational castes with strict rules about intermarriage, commensality, and social contact. Below the four varnas stood those classified as 'untouchable' — the **Dalits** (दलित) — condemned to the most degrading labor and excluded from temples, wells, and public life.\\n\\nThis is one of Hinduism's most painful historical legacies. Reformers across millennia have challenged it:\\n- **The Buddha** (c. 500 BCE) rejected caste as morally irrelevant to spiritual worth\\n- **Basavanna** (12th century CE) led the Lingayat movement explicitly against caste hierarchy\\n- **B.R. Ambedkar** (1891–1956), the Dalit jurist who wrote India's constitution, argued that caste was incompatible with human dignity and eventually converted to Buddhism\\n- **Mahatma Gandhi** campaigned against untouchability, calling Dalits *Harijan* ('people of God'), though Ambedkar critiqued his approach as insufficient\\n\\nModern Hindu reform movements and contemporary Hindu thought overwhelmingly condemn untouchability as a violation of Dharma itself — a perversion of an original ideal of functional social organization into an instrument of hereditary oppression." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Distinguishing Ideal from Historical Reality", "content": "When studying Varna, it is essential to distinguish between the philosophical ideal — a functionally organized society based on qualities and deeds — and the historical reality of hereditary caste discrimination. Treating them as identical does injustice to reformers within the tradition. Treating them as entirely separate ignores how the texts were used to justify oppression. Both dimensions must be held together." }
\`\`\`

---

### Check Your Understanding

\`\`\`quiz
{ "title": "Dharma, Purusharthas, and Hindu Ethics", "questions": [
  { "question": "What does the Sanskrit root *dhri* (धृ) mean, and how does it relate to the concept of Dharma?", "options": ["To destroy — Dharma means breaking old patterns", "To hold, sustain, support — Dharma is what holds the universe in order", "To seek — Dharma is the eternal quest for truth", "To purify — Dharma is the cleansing of karma"], "answer": 1, "explanation": "Dharma derives from *dhri* (to hold/sustain/support). This etymology captures Dharma's role as the principle that holds cosmic, social, and moral order together — not a single rule, but the fabric of ordered existence itself." },
  { "question": "Which Purushartha is described in the Bhagavad Gita as the framework within which all other aims must be pursued?", "options": ["Moksha — liberation is the only goal that matters", "Kama — pleasure motivates all human action", "Artha — wealth enables everything else", "Dharma — righteousness sets the boundaries for all other pursuits"], "answer": 3, "explanation": "Dharma frames the other three Purusharthas. Artha (wealth) and Kama (pleasure) are legitimate goals, but they must be pursued *within* Dharma. Moksha is the ultimate aim, but Dharma is the ethical container for the whole journey." },
  { "question": "The Bhagavad Gita (4.13) states that Krishna created the four varnas according to what criteria?", "options": ["Birth and family lineage", "Ritual purity and temple rank", "Guna (qualities) and karma (actions)", "Divine decree alone, regardless of individual character"], "answer": 2, "explanation": "Gita 4.13 explicitly grounds varna in guna (innate qualities) and karma (actions) — not birth. This text is central to the argument by Hindu reformers that hereditary caste discrimination is a later perversion, not an original teaching." },
  { "question": "Which stage of the Ashrama system is described by many classical texts as the most foundational, since it supports all other stages of society?", "options": ["Brahmacharya — because learning comes first", "Grihastha — because the householder sustains priests, students, and renunciants", "Vanaprastha — because wisdom comes with age", "Sannyasa — because renunciation is the highest calling"], "answer": 1, "explanation": "The Grihastha (householder) stage is frequently called the most important in classical texts because householders feed, clothe, and support everyone else — including the students, forest-dwellers, and renunciants who depend on their generosity and labor." }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Dharma has no single English equivalent — it is cosmic order, universal ethics, social duty, and personal calling all at once, derived from *dhri* ('to sustain').",
  "The four Purusharthas (Dharma, Artha, Kama, Moksha) represent a balanced view of human flourishing: wealth and pleasure are dignified goals, not obstacles, when pursued within Dharma.",
  "The four Ashramas map appropriate duties onto life's stages — from disciplined study, to full engagement with the world, to gradual withdrawal and final renunciation.",
  "Ahimsa ('non-harming') is called the highest Dharma in the Mahabharata and extends beyond physical violence to speech, thought, and treatment of animals.",
  "The Varna system as ideally described in the Gita is based on qualities and actions — not birth. Its historical corruption into hereditary caste and the exclusion of Dalits is widely condemned within modern Hindu thought as a violation of Dharma itself."
] }
\`\`\`

---

### For Deeper Reading

- **Patrick Olivelle**, *Dharmasutras: The Law Codes of Ancient India*, Oxford University Press, 1999
- **Arvind Sharma**, *Hinduism and Human Rights*, Oxford University Press, 2004`,
    },
    {
      id: "hinduism-ethics-checkpoint",
      slug: "ethics-dharma-checkpoint",
      title: "Checkpoint: Hindu Ethics & Dharma",
      content: `## Checkpoint: Hindu Ethics & Dharma

Let us review the ethical framework you have explored in this module — from the cosmic meaning of *Dharma* to the daily structure of the Ashramas. This checkpoint tests comprehension and invites you to articulate ideas in your own words.

\`\`\`concept
{ "title": "Dharma — The Untranslatable Centre", "variant": "mental-model", "content": "The Sanskrit root *dhri* means 'to hold, sustain, support.' Dharma is therefore not simply 'religion' or 'duty' — it is the principle that holds the cosmos, society, and the self together. Every translation captures only one facet of a concept that operates simultaneously as cosmic law, moral order, social role, and personal path." }
\`\`\`

---

\`\`\`tabs
{ "tabs": [
  { "label": "Purusharthas", "icon": "🎯", "content": "## The Four Aims of Human Life\\n\\nThe Purusharthas form a complete map of human flourishing — none is meant to be pursued in isolation:\\n\\n| # | Aim | Sanskrit | Meaning |\\n|---|-----|----------|---------|\\n| 1 | **Dharma** | धर्म | Righteousness, moral duty — the *frame* for all other aims |\\n| 2 | **Artha** | अर्थ | Wealth, material prosperity, political power |\\n| 3 | **Kama** | काम | Pleasure, desire, love, aesthetic enjoyment |\\n| 4 | **Moksha** | मोक्ष | Liberation, spiritual freedom — the ultimate aim |\\n\\n**Key insight:** Dharma governs how Artha and Kama are pursued. Without it, the accumulation of wealth or pleasure becomes exploitation. Moksha transcends the other three — it is the horizon toward which the whole life is oriented." },
  { "label": "Ashramas", "icon": "🌱", "content": "## The Four Stages of Life\\n\\nThe Ashrama system distributes life's responsibilities across four phases:\\n\\n| Stage | Name | Focus |\\n|-------|------|-------|\\n| 1 | **Brahmacharya** — Student | Learning, discipline, celibacy, formation of character |\\n| 2 | **Grihastha** — Householder | Family, livelihood, social contribution — considered the *foundation* of the other three |\\n| 3 | **Vanaprastha** — Forest Dweller | Gradual withdrawal, mentoring the next generation, spiritual deepening |\\n| 4 | **Sannyasa** — Renunciant | Complete spiritual dedication, release from worldly roles |\\n\\n**Note:** The Grihastha stage is praised in texts like the *Dharmasutras* as the stage upon which the entire social and religious order depends — other Ashramas are only possible because householders sustain them." },
  { "label": "Ahimsa", "icon": "☮️", "content": "## Non-Violence as the Highest Dharma\\n\\n*Ahimsa paramo dharma* — **Non-violence is the highest dharma** — is a principle found in the *Mahabharata*.\\n\\n**Why it matters:**\\n- Grounds Hindu vegetarianism and reverence for all life\\n- Became the cornerstone of Gandhi's *satyagraha* (truth-force) philosophy\\n- Extends beyond physical violence to include violence in thought and speech\\n- Cited by Arvind Sharma as central to Hindu contributions to human rights discourse\\n\\n**Scope:** Ahimsa is not absolute passivism in all Hindu thought — the *Bhagavad Gita* addresses Arjuna's duty as a warrior — but the *principle* of minimising harm to conscious beings runs through virtually every school of Hindu ethics." },
  { "label": "Varna vs. Jati", "icon": "⚖️", "content": "## The Ideal and the Historical Reality\\n\\n**Varna (वर्ण) — the textual ideal:**\\n- Four categories based on *guna* (qualities) and *karma* (actions): Brahmin, Kshatriya, Vaishya, Shudra\\n- The *Bhagavad Gita* (4.13) states: *'The fourfold order was created by Me according to the divisions of quality and work'*\\n- In this reading, Varna is functional and potentially fluid — grounded in what a person *does and is*, not where they were born\\n\\n**Jati (जाति) — the historical reality:**\\n- Thousands of hereditary, endogamous birth-groups with strict occupational roles\\n- Gave rise to rigid hierarchy and the practice of untouchability\\n- Ambedkar and modern reformers argue this system violated Dharma's own foundational principles\\n\\n**The critique:** Reformers including Vivekananda and Gandhi (with important nuances) argued that caste discrimination — especially untouchability — is not Dharma but its corruption." }
] }
\`\`\`

---

\`\`\`quiz
{ "title": "Hindu Ethics & Dharma — Comprehension Check", "questions": [
  {
    "question": "The Sanskrit root 'dhri' (धृ) most directly means:",
    "options": [
      "To fight and conquer",
      "To hold, sustain, support",
      "To renounce and withdraw",
      "To seek and desire"
    ],
    "answer": 1,
    "explanation": "'Dhri' means 'to hold, sustain, support.' This etymology reveals why Dharma cannot be translated simply as 'religion' or 'law' — it is the sustaining principle of cosmic order, moral life, and social harmony all at once."
  },
  {
    "question": "Which of the four Purusharthas is described as the *frame* that governs how the others should be pursued?",
    "options": [
      "Artha (wealth)",
      "Kama (pleasure)",
      "Dharma (righteousness)",
      "Moksha (liberation)"
    ],
    "answer": 2,
    "explanation": "Dharma acts as the ethical framework within which Artha and Kama are legitimately pursued. Without Dharma, the pursuit of wealth or pleasure becomes mere exploitation. Moksha is the transcendent goal, but Dharma is the governing principle of everyday life."
  },
  {
    "question": "What does 'Ahimsa paramo dharma' mean?",
    "options": [
      "Dharma is the highest virtue",
      "The highest path is devotion to God",
      "Non-violence is the highest dharma",
      "Knowledge alone leads to liberation"
    ],
    "answer": 2,
    "explanation": "From the Mahabharata: 'Ahimsa paramo dharma' means 'Non-violence is the highest dharma.' This principle grounded Hindu vegetarianism, reverence for all life, and became foundational to Gandhi's philosophy of non-violent resistance (satyagraha)."
  },
  {
    "question": "According to the Bhagavad Gita (4.13), on what basis was the fourfold Varna order created?",
    "options": [
      "Heredity and bloodline",
      "Geographic region of birth",
      "Qualities (guna) and actions (karma)",
      "Wealth and social standing"
    ],
    "answer": 2,
    "explanation": "The Bhagavad Gita states the fourfold order was created 'according to the divisions of quality and work' — guna and karma, not birth. The historical jati system, which became rigidly hereditary, is thus a departure from this textual ideal, which is why reformers argue caste discrimination violates Dharma itself."
  },
  {
    "question": "Which Ashrama (stage of life) is described in the Dharmasutras as the foundation upon which the other three stages depend?",
    "options": [
      "Brahmacharya (student stage)",
      "Grihastha (householder stage)",
      "Vanaprastha (forest-dweller stage)",
      "Sannyasa (renunciant stage)"
    ],
    "answer": 1,
    "explanation": "The Grihastha (householder) stage is praised in texts like the Dharmasutras as the foundation of the entire social and religious order. Students, forest-dwellers, and renunciants all depend on householders for material and social sustenance — making family life the pivotal Ashrama, not the lowest."
  }
] }
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: Why Dharma Resists a Single English Translation", "content": "Scholars regularly note that Dharma is one of the most translation-resistant concepts in any world religion. Consider what is lost in common translations:\\n\\n- **'Religion'** — too institutional; Dharma includes cosmic physics, not just ritual\\n- **'Duty'** — too narrow; it misses the cosmic and natural-law dimensions\\n- **'Law'** — too external; Dharma is also an inner orientation and lived quality\\n- **'Righteousness'** — closer, but still misses the sustaining/structural dimension\\n- **'Ethics'** — misses the cosmic and soteriological (liberation-oriented) layers\\n\\nPatrick Olivelle's work on the *Dharmasutras* shows how even within the tradition, Dharma was context-dependent — what is Dharma for a Brahmin student differs from what is Dharma for a king or a householder. The concept operates at multiple levels simultaneously:\\n\\n1. **Rita/Cosmic Dharma** — the order of the universe itself (seasons, natural law)\\n2. **Sadharana Dharma** — universal moral duties applicable to all humans (ahimsa, truthfulness, non-stealing)\\n3. **Varna-ashrama Dharma** — duties specific to one's social role and life stage\\n4. **Sva-dharma** — one's own unique, personal path and duty\\n\\nThis layered structure is precisely why the Bhagavad Gita can tell Arjuna that *his* Dharma as a warrior differs from the Brahmin's Dharma of non-violence — without contradicting the universal principle of Ahimsa." }
\`\`\`

---

### Voice Summary Exercise

Before moving on, speak your answers aloud — this activates a different kind of understanding than reading:

1. **Explain Dharma** in your own words, without using the word "religion." Why is it hard to translate?
2. **Walk through the Purusharthas** — how do they reflect a *balanced* rather than purely ascetic view of human life?
3. **Distinguish Varna from Jati** — what is the textual ideal, what became the historical reality, and why do reformers say the caste system violates Dharma?

\`\`\`callout
{ "type": "success", "title": "Module Complete", "content": "You have completed the Hindu Ethics & Dharma module. You can now articulate Dharma's multi-layered meaning, trace the structure of the Purusharthas and Ashramas, and engage critically with the tension between the Varna ideal and the historical caste system. Next up: Hindu Festivals & Practices — the living expression of these ethical principles in ritual and community life." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Dharma derives from 'dhri' (to hold/sustain) — it is the principle holding together cosmic order, moral law, and personal duty simultaneously",
  "The four Purusharthas (Dharma, Artha, Kama, Moksha) present a balanced vision of human life — material and spiritual, social and transcendent",
  "The Ashramas distribute responsibilities across four life stages, with the Grihastha (householder) stage considered the foundational pillar",
  "Ahimsa paramo dharma ('Non-violence is the highest dharma') grounds both Hindu vegetarianism and Gandhi's philosophy of non-violent resistance",
  "The Varna ideal (based on qualities and actions) differs sharply from the hereditary jati system — reformers argue caste discrimination violates Dharma's own principles"
] }
\`\`\``,
    },
  ],
};

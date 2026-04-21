import { Module } from "../types";

export const eightfoldPathModule: Module = {
  id: "buddhism-eightfold-path",
  title: "The Noble Eightfold Path",
  description: "Study the Buddha's practical prescription for ending suffering — the eight interconnected practices of wisdom (panna), ethical conduct (sila), and mental discipline (samadhi). Resources: Bhikkhu Bodhi, The Noble Eightfold Path; Henepola Gunaratana, Eight Mindful Steps to Happiness.",
  lessons: [
    {
      id: "buddhism-path-overview",
      slug: "eightfold-path-overview",
      title: "The Path as a Whole",
      content: `## The Noble Eightfold Path: Overview

<!-- voice:section_check concept="The structure and purpose of the Eightfold Path" -->

The Fourth Noble Truth is the **Noble Eightfold Path** (Pali: *ariya aṭṭhaṅgika magga*; Sanskrit: *āryāṣṭāṅgamārga*) — the Buddha's practical prescription for ending suffering. It is not a sequential checklist but an **integrated way of life** in which all eight factors support and reinforce each other.

\`\`\`concept
{ "title": "The Middle Way", "variant": "mental-model", "content": "The Buddha explicitly framed the Eightfold Path as the 'middle way' — steering between two extremes he had personally tried and rejected: addiction to sensual pleasure (the householder's life) and addiction to harsh self-mortification (the ascetic's life). Neither extreme leads to liberation. The path cultivates a fit body and a trained mind as mutual supports, neither indulged nor punished." }
\`\`\`

### The Three Higher Trainings

The eight factors are grouped into three areas of practice — *tisso sikkhā* — each building on the others:

| Training | Pali Term | Factors |
|----------|-----------|---------|
| **Wisdom** | *Paññā* | 1. Right View (*sammā diṭṭhi*) · 2. Right Intention (*sammā saṅkappa*) |
| **Ethical Conduct** | *Sīla* | 3. Right Speech (*sammā vācā*) · 4. Right Action (*sammā kammanta*) · 5. Right Livelihood (*sammā ājīva*) |
| **Mental Discipline** | *Samādhi* | 6. Right Effort (*sammā vāyāma*) · 7. Right Mindfulness (*sammā sati*) · 8. Right Concentration (*sammā samādhi*) |

<!-- voice:key_insight insight="The word 'sammā' is typically translated as 'right' but it also carries the meanings 'complete,' 'whole,' and 'balanced.' The Eightfold Path is not about rigid rules but about bringing completeness and harmony to every dimension of life — thought, speech, action, and mind." -->

\`\`\`tabs
{ "tabs": [
  { "label": "Wisdom (Paññā)", "icon": "🔍", "content": "**Right View** (*sammā diṭṭhi*) means understanding the Four Noble Truths, the law of karma (intentional actions have consequences), Dependent Origination (all phenomena arise from conditions), and the Three Marks of Existence: impermanence (*anicca*), suffering (*dukkha*), and non-self (*anattā*).\\n\\n**Right Intention** (*sammā saṅkappa*) means cultivating:\\n- **Renunciation** (*nekkhamma*) — letting go of craving\\n- **Goodwill** (*abyāpāda*) — replacing ill will with compassion\\n- **Harmlessness** (*avihiṃsā*) — commitment to non-violence\\n\\nWisdom comes first in the listing because without understanding the Four Noble Truths, we would not know why we are practicing or what we are aiming for." },
  { "label": "Ethical Conduct (Sīla)", "icon": "🌿", "content": "**Right Speech** (*sammā vācā*): Refraining from lying, divisive speech, harsh speech, and idle chatter. Using words that are true, kind, timely, and beneficial.\\n\\n**Right Action** (*sammā kammanta*): Refraining from killing, stealing, and sexual misconduct. Acting with care, honesty, and respect for all living beings.\\n\\n**Right Livelihood** (*sammā ājīva*): Earning a living in ways that do not harm others — avoiding trades in weapons, living beings, meat, intoxicants, or poisons.\\n\\nEthical conduct is built on universal love and compassion. It creates the stable, non-remorseful mind needed for deep meditation." },
  { "label": "Mental Discipline (Samādhi)", "icon": "🧘", "content": "**Right Effort** (*sammā vāyāma*): The four great efforts — preventing unwholesome states from arising, abandoning those that have arisen, cultivating wholesome states, and maintaining those that have arisen.\\n\\n**Right Mindfulness** (*sammā sati*): Clear, sustained awareness of the body, feelings, mind states, and mental objects (the four *satipaṭṭhānas*). Seeing phenomena as they actually are, without reactivity.\\n\\n**Right Concentration** (*sammā samādhi*): Progressive deepening of meditative absorption through the four *jhānas* — increasingly unified, peaceful, and equanimous states of mind." }
] }
\`\`\`

### The Structure: A Wheel, Not a Staircase

\`\`\`mermaid
graph TD
    A[Noble Eightfold Path] --> B[Wisdom<br>Paññā]
    A --> C[Ethics<br>Sīla]
    A --> D[Meditation<br>Samādhi]
    B --> B1[Right View]
    B --> B2[Right Intention]
    C --> C1[Right Speech]
    C --> C2[Right Action]
    C --> C3[Right Livelihood]
    D --> D1[Right Effort]
    D --> D2[Right Mindfulness]
    D --> D3[Right Concentration]
\`\`\`

\`\`\`concept
{ "title": "The Dhammacakka — Wheel, Not Ladder", "variant": "analogy", "content": "The Eightfold Path is traditionally represented as a wheel with eight spokes (the Dhammacakka, or 'Wheel of the Dhamma'). This image is deliberate: a wheel only rolls smoothly when all spokes are equal and in balance. Remove one spoke and the wheel wobbles. You do not complete Right View before beginning Right Speech — you cultivate all eight simultaneously, each strengthening the others.\\n\\nAs Bhikkhu Bodhi explains: 'The eight factors of the path are not steps to be taken one after another, but rather eight components that are to be developed simultaneously. They are like eight strands of a rope that gain their strength from being interwoven.' — The Noble Eightfold Path, Buddhist Publication Society, 1994" }
\`\`\`

This contrasts sharply with how many modern self-help frameworks work — a sequence of levels to unlock. Buddhist practice is more like **tuning a musical instrument**: you do not perfect one string and ignore the rest. All eight need continuous, balanced attention, and progress in one area naturally draws the others forward.

### The Path Is Practice, Not Theory

The Noble Eightfold Path is fundamentally a matter of *cultivation in one's own experience*, not intellectual knowledge. Right View, though first in the listing, is not achieved by reading a summary and moving on — it deepens with every sit of meditation, every moment of careful speech, every ethical choice made with awareness.

> "Monks, suppose a man in the course of a journey saw a great expanse of water whose near shore was dangerous and fearful and whose far shore was safe and free from fear... He would collect grass, sticks, branches, and leaves and bind them together into a raft."
> — Majjhima Nikāya 22

The path is the raft. The destination is Nibbāna. But you build and ride the raft yourself — no one can cross for you.

### A Path for Everyone

The Buddha taught the Eightfold Path to monastics and laypeople alike. Monks and nuns could devote their entire lives to formal practice; laypeople were encouraged to integrate these same principles into family life, work, and community.

\`\`\`collapse
{ "title": "Deep Dive: The Spiral of Mutual Support", "content": "While all eight factors are cultivated simultaneously, traditional texts describe a natural *spiral* of mutual reinforcement:\\n\\n1. **Sīla supports Samādhi** — when we refrain from harmful speech and action, the mind carries less guilt and agitation into meditation. A troubled conscience is the enemy of stillness.\\n2. **Samādhi supports Paññā** — a concentrated, calm mind can see phenomena clearly. Without stillness, insight (*vipassanā*) is like trying to see the bottom of a disturbed pond.\\n3. **Paññā supports Sīla** — as insight deepens into impermanence, suffering, and non-self, the impulses driving harmful behavior (craving, aversion, delusion) lose their grip naturally.\\n\\nThis is why the path is sometimes called a 'noble spiral' rather than simply a wheel — it circles and ascends. Each revolution through the trainings brings a deeper level of understanding and a lighter quality of conduct." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  {
    "question": "What does the Pali term 'sammā' (as in sammā diṭṭhi, sammā vācā, etc.) most fully mean?",
    "options": ["Strict and rule-bound", "Complete, whole, and balanced", "Sequential and ordered", "Monastic and renunciant"],
    "answer": 1,
    "explanation": "Sammā carries the meanings 'proper, complete, whole, and balanced' — not merely 'correct' in a rigid sense. It signals that each factor should be cultivated with full integration, not as a rule to follow mechanically."
  },
  {
    "question": "Which of the following best describes the relationship between the eight factors of the Eightfold Path?",
    "options": ["Each factor must be mastered sequentially before the next begins", "All eight are cultivated simultaneously, each reinforcing the others", "The first four are for monastics and the last four are for laypeople", "Wisdom factors can be skipped once ethical conduct is established"],
    "answer": 1,
    "explanation": "The path is holistic and interconnected. Bhikkhu Bodhi describes the eight factors as 'eight strands of a rope that gain their strength from being interwoven.' Progress in one area naturally supports the others."
  },
  {
    "question": "Why does the Noble Eightfold Path qualify as the 'middle way'?",
    "options": ["Because it is a moderate set of rules — not too strict, not too lax", "Because it steers between the extremes of sensual indulgence and harsh self-mortification", "Because it is suited to people of middling intelligence", "Because it was taught at the midpoint of the Buddha's teaching career"],
    "answer": 1,
    "explanation": "The Buddha had personally tried both extremes — years of palace luxury and years of severe asceticism — and found both unable to lead to liberation. The Eightfold Path is explicitly defined as avoiding these two extremes."
  },
  {
    "question": "In the Three Trainings, which factors constitute Ethical Conduct (Sīla)?",
    "options": ["Right View and Right Intention", "Right Effort, Right Mindfulness, and Right Concentration", "Right Speech, Right Action, and Right Livelihood", "Right Intention, Right Speech, and Right Action"],
    "answer": 2,
    "explanation": "Sīla (ethical conduct) comprises the three factors concerned with how we engage with the world through language and action: Right Speech, Right Action, and Right Livelihood."
  }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The Noble Eightfold Path is the Fourth Noble Truth — the Buddha's direct prescription for ending suffering, grounded in practice, not theory.",
  "Its eight factors are grouped into three trainings: Wisdom (Paññā), Ethical Conduct (Sīla), and Mental Discipline (Samādhi).",
  "The path is a wheel, not a staircase — all eight factors are cultivated simultaneously, each supporting the others in a spiral of mutual reinforcement.",
  "Sammā means 'complete' and 'balanced,' not merely 'correct.' The path asks for wholeness in thought, speech, action, and mind.",
  "The path was taught to monastics and laypeople alike — it is a universal framework for life, not an exclusively monastic discipline."
] }
\`\`\`

### Reflection Questions

1. Why do you think the Buddha placed Wisdom before Ethics and Mental Discipline in the listing — if all eight are practiced simultaneously?
2. How does the wheel metaphor (all spokes at once) differ from a staircase model of spiritual progress? Which model fits how you have experienced learning or growth in your own life?
3. Which of the three trainings — Paññā, Sīla, or Samādhi — seems most relevant or most challenging to you right now?

### Deeper Reading

- **Bhikkhu Bodhi**, *The Noble Eightfold Path: Way to the End of Suffering*, Buddhist Publication Society, 1994
- **Henepola Gunaratana**, *Eight Mindful Steps to Happiness*, Wisdom Publications, 2001`,
    },
    {
      id: "buddhism-ethics-meditation",
      slug: "ethics-and-meditation",
      title: "Ethics and Mental Discipline on the Path",
      content: `## Ethics and Mental Discipline on the Path

<!-- voice:section_check concept="Sila (ethical conduct) and Samadhi (mental discipline) in daily practice" -->

While wisdom provides the direction, **ethical conduct** (sila) and **mental discipline** (samadhi) provide the vehicle. Without ethics, the mind is too agitated for deep meditation. Without meditation, insight remains intellectual rather than transformative.

### Right Speech (Samma Vaca)

The Buddha gave remarkably specific guidance on speech:

> "Monks, a statement endowed with five factors is well-spoken, not ill-spoken, blameless, and unfaulted by the wise. What five? It is spoken at the right time. It is spoken in truth. It is spoken affectionately. It is spoken beneficially. It is spoken with a mind of goodwill."
> — Anguttara Nikaya 5.198

Right Speech means abstaining from:
- **False speech** (musavada) — lying and deception
- **Divisive speech** (pisunavaca) — speech that creates enmity between people
- **Harsh speech** (pharusavaca) — words intended to hurt
- **Idle chatter** (samphappalapa) — pointless gossip and distraction

### Right Action (Samma Kammanta)

Right Action centers on the **Five Precepts** (panca sila) — the basic ethical commitments for all Buddhists:

1. Abstaining from taking life (panatipata veramani)
2. Abstaining from taking what is not given (adinnadana veramani)
3. Abstaining from sexual misconduct (kamesu micchacara veramani)
4. Abstaining from false speech (musavada veramani)
5. Abstaining from intoxicants that cloud the mind (surameraya veramani)

<!-- voice:key_insight insight="The Five Precepts are not commandments imposed from above. They are training rules that practitioners voluntarily undertake because they recognize that these behaviors cause suffering — to oneself and others. Buddhist ethics is grounded in compassion and understanding, not in obedience to authority." -->

### Right Livelihood (Samma Ajiva)

The Buddha specifically named five types of trade that cause harm and should be avoided:

1. Trading in weapons
2. Trading in human beings (slavery)
3. Trading in meat (slaughter)
4. Trading in intoxicants
5. Trading in poisons

### Right Effort (Samma Vayama)

Right Effort involves four aspects of mental cultivation:

1. **Preventing** unwholesome states from arising
2. **Abandoning** unwholesome states that have already arisen
3. **Cultivating** wholesome states that have not yet arisen
4. **Maintaining** wholesome states that have already arisen

### Right Mindfulness (Samma Sati)

Mindfulness (sati) is the quality of clear, non-reactive awareness. The Buddha's primary teaching on mindfulness is the **Satipatthana Sutta** (Foundations of Mindfulness), which outlines four domains:

1. **Body** (kaya) — awareness of breathing, posture, bodily sensations
2. **Feelings** (vedana) — awareness of pleasant, unpleasant, and neutral sensations
3. **Mind** (citta) — awareness of mental states (desire, aversion, clarity)
4. **Dhammas** (mental objects) — awareness of the Five Hindrances, the aggregates, the sense bases

### Right Concentration (Samma Samadhi)

Right Concentration refers specifically to the four **jhanas** — progressively deeper states of meditative absorption:

| Jhana | Characteristics |
|-------|----------------|
| **First** | Applied and sustained thought, joy, happiness, one-pointedness |
| **Second** | Inner confidence, joy, happiness, one-pointedness (thought subsides) |
| **Third** | Equanimity, happiness, one-pointedness (joy subsides) |
| **Fourth** | Equanimity, one-pointedness, pure awareness (happiness becomes equanimity) |

### Reflection Questions

1. How does Right Speech relate to your daily communication — at work, online, and with family?
2. Why might the Buddha have included intoxicants in the Five Precepts? How does this relate to mindfulness?
3. The four jhanas describe progressive deepening of meditation. Have you experienced anything similar in moments of deep focus or absorption?

### Deeper Reading

- **Analayo**, *Satipatthana: The Direct Path to Realization*, Windhorse Publications, 2003
- **Ajahn Chah**, *Everything Arises, Everything Falls Away*, Shambhala, 2005
`,
    },
    {
      id: "buddhism-eightfold-path-checkpoint",
      slug: "eightfold-path-checkpoint",
      title: "Checkpoint: The Eightfold Path",
      content: `## Checkpoint: The Noble Eightfold Path

Wonderful work! Let us review the Buddha's practical path to the end of suffering.

### Quiz

**1. What are the three higher trainings that organize the Eightfold Path?**

- a) Faith, Hope, and Charity
- b) Wisdom (Panna), Ethical Conduct (Sila), and Mental Discipline (Samadhi)
- c) Meditation, Study, and Service
- d) Mindfulness, Concentration, and Insight

**Answer: b)** The eight factors are grouped under Wisdom (Right View, Right Intention), Ethical Conduct (Right Speech, Right Action, Right Livelihood), and Mental Discipline (Right Effort, Right Mindfulness, Right Concentration).

---

**2. Why is the Eightfold Path represented as a wheel rather than a ladder?**

*Short Answer:* Because all eight factors are practiced simultaneously, not sequentially. Like the spokes of a wheel, each factor supports the others. A wheel only rolls smoothly when all spokes are balanced — similarly, the path requires integrated cultivation of wisdom, ethics, and mental discipline together.

---

**3. Name three of the Five Precepts and explain their purpose.**

*Short Answer:* (Any three) Abstaining from: taking life, taking what is not given, sexual misconduct, false speech, or intoxicants. Their purpose is not punishment or obedience but the recognition that these behaviors cause suffering to oneself and others. They are voluntary training rules rooted in compassion.

---

**4. What are the four foundations of mindfulness (Satipatthana)?**

- a) Seeing, hearing, smelling, tasting
- b) Body, feelings, mind, and mental objects (dhammas)
- c) Past, present, future, and timeless
- d) Self, others, community, and cosmos

**Answer: b)** The Satipatthana Sutta describes four domains: body (kaya), feelings (vedana), mind (citta), and mental objects (dhammas).

---

**5. What does the Pali word "samma" mean in "samma ditthi" (Right View)?**

*Short Answer:* Samma means not just "right" (as opposed to wrong) but also "complete," "whole," or "balanced." It suggests bringing fullness and harmony to each aspect of the path, rather than rigid correctness.

---

### Voice Summary

Try explaining aloud:
- The three trainings and how they relate to each other
- Why ethics (sila) is necessary for meditation (samadhi) to succeed
- One factor of the Eightfold Path you find personally meaningful

In the next module, we will explore the rich diversity of Buddhist meditation traditions.
`,
    },
  ],
};

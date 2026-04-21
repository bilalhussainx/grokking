import { Module } from "../types";

export const analectsModule: Module = {
  id: "confucianism-analects",
  title: "The Analects",
  description: "Explore the Lunyu — the collected sayings of Confucius compiled by his students. Learn how to read its dialogue format, encounter its most important passages, and understand why this slim book shaped a civilization. Resources: Edward Slingerland, Confucius Analects: With Selections from Traditional Commentaries (2003).",
  lessons: [
    {
      id: "confucianism-analects-structure",
      slug: "analects-structure",
      title: "Structure of the Analects",
      content: `## Structure of the Analects

<!-- voice:section_check concept="How the Analects is organized and how to read it" -->

The **Analects** (論語, Lunyu, literally "Collected Sayings") is the single most important Confucian text. It is a record of conversations between Confucius and his students, compiled by his disciples and their students over several generations after his death.

### How the Text Is Organized

The Analects contains **20 books** (pian, 篇), each subdivided into numbered passages. A typical citation looks like **Analects 4.15** — meaning Book 4, Passage 15.

The books are not organized by topic or chronology. They were likely compiled by different groups of students at different times. Scholars generally divide them into layers:

| Layer | Books | Characteristics |
|-------|-------|-----------------|
| **Earliest** | Books 3–9 | Shortest sayings, most likely to reflect Confucius's actual words |
| **Middle** | Books 1–2, 10–15 | More developed dialogues, may include student commentary |
| **Later** | Books 16–20 | Longer passages, more polished — possibly post-disciple additions |

This matters because when you read the Analects, you are not reading a single authored book. You are reading a **collaborative portrait** — like hearing about a beloved teacher from many different students, each remembering different conversations.

<!-- voice:key_insight insight="The Analects is not a systematic treatise. It is a collection of moments — a question asked during a journey, a rebuke delivered at dinner, a student praised for insight. Its power lies in these concrete human encounters, not abstract doctrine." -->

### The Dialogue Format

Most passages follow a simple pattern:

1. A student asks a question
2. Confucius answers — often briefly, sometimes cryptically
3. The answer is tailored to *that specific student*

This is crucial. Confucius gave **different answers to the same question** depending on who was asking. When Zilu (子路), his bold and impulsive student, asked about ren (仁, benevolence), he got a cautionary answer. When Ran Qiu (冉求), his timid student, asked the same question, he got an encouraging one (Analects 11.22).

### How to Read the Analects

Here is a practical approach:

- **Read slowly.** A single passage may contain a lifetime of insight.
- **Read aloud.** These were originally spoken words.
- **Note who is speaking.** Each student has a distinct personality.
- **Sit with ambiguity.** Confucius often refuses to give definitions. He teaches through examples, not formulas.

### Reflection Questions

1. How does knowing the Analects was compiled by students (not written by Confucius himself) affect how you approach it?
2. Why might Confucius have given different answers to the same question depending on the student?
3. How does the dialogue format compare to other wisdom traditions you have studied?

### Deeper Reading

- **Edward Slingerland**, *Confucius Analects: With Selections from Traditional Commentaries*, Hackett, 2003 — The best English translation with classical Chinese commentary.
- **Simon Leys** (Pierre Ryckmans), *The Analects of Confucius*, W.W. Norton, 1997 — Elegant and accessible.
`,
    },
    {
      id: "confucianism-key-passages",
      slug: "key-passages",
      title: "Key Passages of the Analects",
      content: `## Key Passages of the Analects

<!-- voice:section_check concept="The most important sayings in the Analects and what they teach" -->

The Analects contains hundreds of passages, but certain sayings are foundational — they are quoted, debated, and taught across East Asia to this day. Let us encounter some of the most important.

### On Learning

> "Is it not a pleasure to learn and, when it is timely, to practice what you have learned? Is it not a joy to have friends come from afar? Is it not gentlemanly not to be resentful when others fail to appreciate your abilities?"
> — Analects 1.1

This is the very first passage. It establishes three themes that run through the entire text: the joy of learning, the value of friendship, and the inner composure of the virtuous person.

### On Self-Examination

> "Each day I examine myself on three counts: In planning for others, have I been loyal? In my dealings with friends, have I been trustworthy? Have I practiced what I have been taught?"
> — Analects 1.4 (spoken by Zengzi, 曾子)

\\\`\\\`\\\`mermaid
graph TD
    A[The Analects] --> B[Self-Cultivation]
    A --> C[Government]
    A --> D[Education]
    A --> E[Filial Piety]
    A --> F[Ritual]
\\\`\\\`\\\`

### The Golden Rule

> "Zigong asked: 'Is there a single word that can serve as a guide for one's entire life?' The Master said: 'Is it not reciprocity (shu, 恕)? Do not impose on others what you yourself do not desire.'"
> — Analects 15.24

<!-- voice:key_insight insight="This passage — sometimes called the 'Silver Rule' because it is stated in the negative — predates Jesus's Golden Rule by five centuries. It shows that the principle of reciprocity as a moral foundation emerged independently in multiple civilizations." -->

### On Governance

> "Lead them with government policies and regulate them with punishments, and the people will evade them and have no sense of shame. Lead them with virtue (de, 德) and regulate them through ritual propriety (li, 禮), and they will have a sense of shame and will correct themselves."
> — Analects 2.3

This passage encapsulates Confucius's entire political philosophy: governance by moral example, not coercion.

### On the Limits of Knowledge

> "Shall I teach you what knowledge is? When you know something, to know that you know it. When you do not know something, to know that you do not know it. That is knowledge."
> — Analects 2.17

### Reflection Questions

1. How does Analects 1.1 set the tone for the entire text? What does it prioritize?
2. Compare the Confucian "Silver Rule" (15.24) with the Golden Rule as you know it. Is there a meaningful difference between "do unto others" and "do not impose on others"?
3. What would governance "by virtue" look like in a modern context?

### Deeper Reading

- **D.C. Lau**, *Confucius: The Analects*, Penguin Classics, 1979 — A landmark translation with scholarly introduction.
- **Xinzhong Yao**, *An Introduction to Confucianism*, Cambridge University Press, 2000
`,
    },
    {
      id: "confucianism-analects-checkpoint",
      slug: "analects-checkpoint",
      title: "Checkpoint: The Analects",
      content: `## Checkpoint: The Analects

Nice work exploring the Analects! Let us check your understanding of this foundational text.

### Quiz

**1. How many books does the Analects contain, and how is a passage typically cited?**

**Answer:** The Analects contains 20 books (pian). A passage is cited as Book.Passage — for example, Analects 4.15 means Book 4, Passage 15.

---

**2. Why did Confucius sometimes give different answers to the same question?**

- a) He was inconsistent in his thinking
- b) He tailored his answers to the specific needs and character of each student
- c) The text was corrupted over time
- d) He changed his views as he aged

**Answer: b)** Confucius practiced context-sensitive teaching. He addressed each student's specific weaknesses and strengths, as seen in Analects 11.22 where Zilu and Ran Qiu receive opposite answers to the same question.

---

**3. What is shu (恕), and what famous saying expresses it?**

*Short Answer:* Shu (恕) means reciprocity. It is expressed in Analects 15.24: "Do not impose on others what you yourself do not desire." This is sometimes called the Confucian "Silver Rule."

---

**4. According to Analects 2.3, how should a ruler govern?**

*Short Answer:* By leading with virtue (de, 德) and regulating through ritual propriety (li, 禮), rather than through government policies and punishments. When people are led by virtue, they develop an internal sense of shame and correct themselves willingly.

---

### Voice Summary

Explain aloud:
- How the Analects is structured and why it reads the way it does
- Two key passages and what they teach about Confucian values
- Why Confucius's teaching method matters for understanding his philosophy

Well done! In the next module, we will explore the Five Relationships and the concept of li (禮).
`,
    },
  ],
};

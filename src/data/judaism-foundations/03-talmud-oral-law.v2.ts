import { Module } from "../types";

export const talmudOralLawModule: Module = {
  id: "judaism-talmud-oral-law",
  title: "Talmud & Oral Law",
  description: "Discover the Oral Torah -- Mishnah, Gemara, and the Talmud -- and how rabbinic debate became the engine of Jewish law and thought.",
  lessons: [
    {
      id: "judaism-mishnah",
      slug: "mishnah-oral-torah",
      title: "The Mishnah and the Oral Torah",
      content: `## The Mishnah and the Oral Torah

<!-- voice:section_check concept="the Oral Torah as a companion to the Written Torah" -->
## Two Torahs, Not One

Judaism teaches that God gave Moses two Torahs at Sinai: the **Written Torah** (Torah SheBikhtav, תורה שבכתב) -- the five books we studied -- and the **Oral Torah** (Torah SheBe'al Peh, תורה שבעל פה) -- explanations, interpretations, and applications passed down by word of mouth through generations of teachers.

Think of the Written Torah as a constitution and the Oral Torah as centuries of court rulings that explain how the constitution applies in real life. The Written Torah says "Remember the Sabbath day and keep it holy" (Exodus 20:8) -- but what counts as "work"? The Oral Torah answers.

### The Mishnah

Around 200 CE, Rabbi **Judah the Prince** (Rabbi Yehudah HaNasi) compiled the Oral Torah into a written text called the **Mishnah** (משנה, "repetition" or "study"). He did this because the traditions were in danger of being lost after the Temple's destruction and the scattering of Jewish communities.

The Mishnah is organized into six **orders** (Sedarim, סדרים):

| Order | Hebrew | Topic | Tractates |
|-------|--------|-------|-----------|
| Zeraim | זרעים | Seeds (agriculture, blessings) | 11 |
| Moed | מועד | Festival (Shabbat, holidays) | 12 |
| Nashim | נשים | Women (marriage, divorce) | 7 |
| Nezikin | נזיקין | Damages (civil/criminal law) | 10 |
| Kodashim | קדשים | Holy Things (Temple, sacrifices) | 11 |
| Tohorot | טהרות | Purities (ritual purity) | 12 |

<!-- voice:key_insight insight="The Mishnah does not silence debate -- it preserves it. Minority opinions are recorded alongside majority rulings because a future generation might need them. Disagreement is sacred in Jewish learning." -->

### A Culture of Debate

The Mishnah frequently records disagreements. For example:

> **Mishnah Avot 5:17**
> "Every dispute that is for the sake of Heaven will endure; every dispute that is not for the sake of Heaven will not endure."

The classic example: the debates between the schools of **Hillel** and **Shammai** (1st century BCE-CE). They disagreed on nearly everything, yet both are preserved because both sought truth.

### Reflection Questions

1. Why would the rabbis write down the Oral Torah if it was meant to be oral?
2. What does it mean that the Mishnah preserves minority opinions alongside rulings?
3. How does the concept of "dispute for the sake of Heaven" shape intellectual culture?

### Deeper Reading
- **Jacob Neusner**, *The Mishnah: A New Translation*, Yale University Press, 1988
- **Adin Steinsaltz**, *The Essential Talmud*, Basic Books, 2006, Chapters 1-3
- Mishnah Avot (Ethics of the Fathers) 1:1-2:5`,
    },
    {
      id: "judaism-gemara-talmud",
      slug: "gemara-and-talmud",
      title: "The Gemara and the Talmud",
      content: `## Commentary on Commentary

<!-- voice:section_check concept="Talmud as Mishnah plus Gemara -- law, story, and debate" -->

The Mishnah gave rabbis a shared text — but a text invites questions. Over the three centuries following its compilation, rabbis in two great centers of Jewish learning — **Palestine** and **Babylonia** — discussed, challenged, and expanded every ruling. Their accumulated discussions were compiled as the **Gemara** (גמרא), a word meaning "completion."

\`\`\`concept
{ "title": "The Talmud Equation", "variant": "mental-model", "content": "Mishnah + Gemara = Talmud.\\n\\nThe Mishnah provides the rulings. The Gemara provides centuries of rabbinic conversation about those rulings — the arguments, counter-arguments, stories, and legal reasoning that give the Mishnah its meaning. Together they form the Talmud, the central text of rabbinic Judaism." }
\`\`\`

## Two Talmuds

Because the discussions unfolded in two separate geographic centers, two distinct Talmuds emerged:

| Talmud | Where | Completed | Status |
|--------|-------|-----------|--------|
| **Yerushalmi** (Jerusalem / Palestinian) | Palestine | c. 400 CE | Studied but less authoritative |
| **Bavli** (Babylonian) | Babylonia | c. 500 CE | The primary Talmud of Jewish law |

When people say "the Talmud" without qualification, they mean the **Babylonian Talmud (Bavli)** — approximately 2.5 million words across 63 tractates. The Bavli became dominant in part because Babylonia remained a thriving Jewish center long after Roman Palestine declined, giving the Babylonian academies the stability to complete and transmit their work.

## What Does a Page of Talmud Look Like?

A Talmud page is unlike anything in Western literature. It is a conversation across a thousand years, arranged visually on a single folio.

\`\`\`sysdiag
{ "title": "Anatomy of a Talmud Page (Vilna Edition)", "width": 600, "height": 340,
  "nodes": [
    { "id": "mishnah", "label": "Mishnah", "x": 300, "y": 60, "kind": "service" },
    { "id": "gemara", "label": "Gemara", "x": 300, "y": 190, "kind": "service" },
    { "id": "rashi", "label": "Rashi\\n(1040–1105)", "x": 100, "y": 130, "kind": "client" },
    { "id": "tosafot", "label": "Tosafot\\n(12th–13th c.)", "x": 500, "y": 130, "kind": "client" }
  ],
  "edges": [
    { "from": "mishnah", "to": "gemara", "label": "discussed in" },
    { "from": "rashi", "to": "mishnah", "label": "comments on" },
    { "from": "rashi", "to": "gemara", "label": "explains" },
    { "from": "tosafot", "to": "rashi", "label": "debates" },
    { "from": "tosafot", "to": "gemara", "label": "adds glosses to" }
  ],
  "annotations": {
    "mishnah": "The core legal text compiled by Rabbi Judah the Prince c. 200 CE. Appears in the center column of the page.",
    "gemara": "Rabbinic discussion of the Mishnah from c. 200–500 CE. Surrounds the Mishnah in the main body of the page.",
    "rashi": "Rabbi Shlomo Yitzchaki. His running commentary appears in the inner margin — the essential first guide for any student of Talmud.",
    "tosafot": "Franco-German scholars (12th–13th c.), many of them Rashi's students and descendants. Their critical glosses appear in the outer margin, often arguing with Rashi."
  }
}
\`\`\`

The standard printed edition — the **Vilna Talmud**, produced in the 19th century — fixed this multi-layered page layout for modern readers. When you open it, you are sitting at a table with scholars from 200 CE, 500 CE, 1100 CE, and 1250 CE simultaneously.

## Two Types of Material: Halakha and Aggadah

The Talmud is not purely a legal document. Its pages weave together two distinct types of material:

\`\`\`tabs
{ "tabs": [
  {
    "label": "Halakha",
    "icon": "⚖️",
    "content": "**Halakha** (הלכה, from the root *halakh* — to walk) is the legal dimension of the Talmud.\\n\\nIt addresses the question: **What must we do?**\\n\\nHalakha covers Shabbat observance, prayer, dietary laws, business ethics, family life, and virtually every domain of human action. It is not abstract theory — it is the path one walks through life.\\n\\nExamples from *Berakhot*, the first tractate of the Talmud:\\n- At what time may the evening Shema be recited?\\n- What posture is required during prayer?\\n- How does one fulfill an obligation if interrupted mid-prayer?\\n\\nHalakhic rulings carry binding force for observant Jews."
  },
  {
    "label": "Aggadah",
    "icon": "📖",
    "content": "**Aggadah** (אגדה, from a root meaning *to tell* or *to bind*) is the narrative and theological dimension of the Talmud.\\n\\nIt addresses the question: **What does it mean?**\\n\\nAggadah includes:\\n- Stories about biblical figures and the sages\\n- Parables and ethical teachings\\n- Theological speculation about God, creation, and the afterlife\\n- Folk wisdom, dream interpretation, and medical lore\\n\\nAggadah does not carry the binding legal force of Halakha — but it shapes the values and moral imagination that give Halakha its depth. Many of Judaism's most quoted teachings originate in aggadic passages."
  },
  {
    "label": "Together",
    "icon": "🔗",
    "content": "**Halakha and Aggadah are inseparable — and the Talmud weaves them together intentionally.**\\n\\nA legal discussion about Shabbat might be interrupted mid-page by a parable about the soul's rest. A story about a sage's death might conclude with a practical ruling on burial rites. This interweaving is not accidental. It reflects a deep conviction: what we do and why we do it cannot be separated.\\n\\n| | Halakha | Aggadah |\\n|---|---|---|\\n| Meaning | Legal ruling | Story / teaching |\\n| Core question | What must we do? | What does it mean? |\\n| Legally binding? | Yes | No (but formative) |\\n| Example | Laws of Sabbath candle-lighting | Why Shabbat recalls the completion of creation |"
  }
] }
\`\`\`

<!-- voice:key_insight insight="The Talmud is not a law code you look up for answers -- it is a record of centuries of argument. The process of debate is as sacred as the conclusions. Learning Talmud means learning how to think, not just what to think." -->

\`\`\`callout
{ "type": "info", "title": "A Record of Debate, Not a Verdict Book", "content": "The Talmud routinely preserves the losing argument alongside the winning one. A minority opinion that was overruled is still recorded — because a future generation might need it. This reflects a core conviction of rabbinic culture: truth emerges through sustained, rigorous argument, and the process of reasoning is itself sacred. Learning Talmud means learning how to think, not just what to think." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  {
    "question": "What does the Hebrew word 'Gemara' mean?",
    "options": ["Commentary", "Completion", "Teaching", "Debate"],
    "answer": 1,
    "explanation": "Gemara (גמרא) means 'completion.' It represents the completing of the Talmud when joined with the Mishnah: Mishnah + Gemara = Talmud."
  },
  {
    "question": "Which Talmud became the primary authority in Jewish law, and approximately when was it completed?",
    "options": ["The Yerushalmi, c. 400 CE", "The Bavli, c. 500 CE", "The Bavli, c. 400 CE", "Both Talmuds share equal authority"],
    "answer": 1,
    "explanation": "The Bavli (Babylonian Talmud), completed c. 500 CE, became the dominant legal authority. The Yerushalmi (c. 400 CE) is studied but considered less authoritative."
  },
  {
    "question": "On a standard Talmud page, whose commentary appears in the inner margin?",
    "options": ["Tosafot", "Maimonides", "Rashi", "Rabbi Akiva"],
    "answer": 2,
    "explanation": "Rashi (Rabbi Shlomo Yitzchaki, 1040–1105) wrote a running commentary that appears in the inner margin of the Vilna edition. His explanations are considered the essential gateway for students of Talmud."
  },
  {
    "question": "Halakha is best described as which of the following?",
    "options": ["Stories and parables about the sages", "Legal rulings governing how one must act", "Theological speculation about the nature of God", "The text of the Mishnah itself"],
    "answer": 1,
    "explanation": "Halakha (from a root meaning 'to walk') is the legal dimension of the Talmud, addressing the question 'What must we do?' It covers all domains of action from prayer to business ethics."
  },
  {
    "question": "The Tosafot were scholars from which region?",
    "options": ["Babylonia", "Spain", "France and Germany", "Egypt"],
    "answer": 2,
    "explanation": "The Tosafot were 12th–13th century Franco-German scholars, many of them students and descendants of Rashi, whose critical glosses appear in the outer margin of the Talmud page."
  }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Mishnah + Gemara = Talmud. The Gemara records three centuries of rabbinic debate over the Mishnah's rulings.",
  "There are two Talmuds: the Yerushalmi (c. 400 CE) and the Bavli (c. 500 CE). When people say 'the Talmud,' they mean the Bavli.",
  "A standard Talmud page layers four voices across a thousand years: Mishnah, Gemara, Rashi, and Tosafot.",
  "The Talmud contains both Halakha (legal rulings — what to do) and Aggadah (stories and ethics — why it matters). Neither stands alone.",
  "The Talmud preserves disagreement by design. The minority opinion is recorded alongside the majority. Learning Talmud means learning how to argue, not just what to conclude."
] }
\`\`\`

### Deeper Reading

- **Adin Steinsaltz**, *The Essential Talmud*, Basic Books, 2006
- **Barry Holtz**, *Back to the Sources: Reading the Classic Jewish Texts*, Simon & Schuster, 1984, Chapter 4
- Talmud Bavli, Berakhot 2a — the very first page of the Babylonian Talmud`,
    },
    {
      id: "judaism-talmud-checkpoint",
      slug: "talmud-checkpoint",
      title: "Checkpoint: Talmud & Oral Law",
      content: `## Checkpoint: Talmud & Oral Law

Nice work on a challenging module! The Talmud is one of humanity's great intellectual achievements.

<!-- voice:section_check concept="Mishnah, Gemara, halakha, aggadah, and the culture of debate" -->

### Question 1
What is the relationship between the Mishnah and the Gemara?

<details>
<summary>Show Answer</summary>

The **Mishnah** (c. 200 CE) codified the Oral Torah. The **Gemara** (c. 400-500 CE) is the rabbinic commentary and debate on the Mishnah. Together, Mishnah + Gemara = Talmud.
</details>

### Question 2
Why were there two Talmuds, and which became authoritative?

<details>
<summary>Show Answer</summary>

The **Jerusalem (Yerushalmi)** Talmud was compiled in Palestine (c. 400 CE) and the **Babylonian (Bavli)** Talmud in Babylonia (c. 500 CE). The Babylonian Talmud became the primary authority because its discussions are more extensive and the Babylonian academies had greater influence in the medieval period.
</details>

### Question 3
What is the difference between halakha and aggadah?

<details>
<summary>Show Answer</summary>

**Halakha** is legal material -- rulings about what one must do. **Aggadah** is non-legal material -- stories, parables, ethics, and theology about what things mean. Both are interwoven in the Talmud.
</details>

### Question 4
Why does the Mishnah preserve minority opinions?

<details>
<summary>Show Answer</summary>

Because a future generation might face different circumstances and need the minority view. It also models the principle that "dispute for the sake of Heaven" is sacred -- the process of honest debate is valued alongside correct conclusions.
</details>

### Question 5
What makes the physical layout of a Talmud page unique?

<details>
<summary>Show Answer</summary>

The Mishnah sits in the center, surrounded by Gemara, with Rashi's commentary on one side and the Tosafot on the other. A single page contains voices spanning over a thousand years in active dialogue.
</details>

### Voice Summary

Explain how the Oral Torah developed from spoken tradition to the Mishnah to the Talmud, and why debate is central to this process.

Next: Jewish Ethics -- tikkun olam, tzedakah, and chesed.`,
    },
  ],
};

import { Module } from "../types";

export const talmudOralLawModule: Module = {
  id: "judaism-talmud-oral-law",
  title: "Talmud & Oral Law",
  description:
    "Discover the Oral Torah -- Mishnah, Gemara, and the Talmud -- and how rabbinic debate became the engine of Jewish law and thought.",
  lessons: [
    {
      id: "judaism-mishnah",
      slug: "mishnah-oral-torah",
      title: "The Mishnah and the Oral Torah",
      content: `## The Mishnah and the Oral Torah

<!-- voice:section_check concept="the Oral Torah as a companion to the Written Torah" -->
## Two Torahs, Not One

Judaism teaches that God gave Moses two Torahs at Sinai: the **Written Torah** (Torah SheBikhtav, \u05EA\u05D5\u05E8\u05D4 \u05E9\u05D1\u05DB\u05EA\u05D1) -- the five books we studied -- and the **Oral Torah** (Torah SheBe'al Peh, \u05EA\u05D5\u05E8\u05D4 \u05E9\u05D1\u05E2\u05DC \u05E4\u05D4) -- explanations, interpretations, and applications passed down by word of mouth through generations of teachers.

Think of the Written Torah as a constitution and the Oral Torah as centuries of court rulings that explain how the constitution applies in real life. The Written Torah says "Remember the Sabbath day and keep it holy" (Exodus 20:8) -- but what counts as "work"? The Oral Torah answers.

### The Mishnah

Around 200 CE, Rabbi **Judah the Prince** (Rabbi Yehudah HaNasi) compiled the Oral Torah into a written text called the **Mishnah** (\u05DE\u05E9\u05E0\u05D4, "repetition" or "study"). He did this because the traditions were in danger of being lost after the Temple's destruction and the scattering of Jewish communities.

The Mishnah is organized into six **orders** (Sedarim, \u05E1\u05D3\u05E8\u05D9\u05DD):

| Order | Hebrew | Topic | Tractates |
|-------|--------|-------|-----------|
| Zeraim | \u05D6\u05E8\u05E2\u05D9\u05DD | Seeds (agriculture, blessings) | 11 |
| Moed | \u05DE\u05D5\u05E2\u05D3 | Festival (Shabbat, holidays) | 12 |
| Nashim | \u05E0\u05E9\u05D9\u05DD | Women (marriage, divorce) | 7 |
| Nezikin | \u05E0\u05D6\u05D9\u05E7\u05D9\u05DF | Damages (civil/criminal law) | 10 |
| Kodashim | \u05E7\u05D3\u05E9\u05D9\u05DD | Holy Things (Temple, sacrifices) | 11 |
| Tohorot | \u05D8\u05D4\u05E8\u05D5\u05EA | Purities (ritual purity) | 12 |

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
      content: `## The Gemara and the Talmud

<!-- voice:section_check concept="Talmud as Mishnah plus Gemara -- law, story, and debate" -->
## Commentary on Commentary

The Mishnah became the new text to study and debate. Over the next three centuries, rabbis in two centers -- **Palestine** and **Babylonia** -- discussed, questioned, and expanded the Mishnah's rulings. Their discussions were compiled as the **Gemara** (\u05D2\u05DE\u05E8\u05D0, "completion").

**Mishnah + Gemara = Talmud.**

There are actually two Talmuds:

| Talmud | Where | Completed | Status |
|--------|-------|-----------|--------|
| **Yerushalmi** (Jerusalem) | Palestine | c. 400 CE | Studied but less authoritative |
| **Bavli** (Babylonian) | Babylonia | c. 500 CE | The primary Talmud of Jewish law |

When people say "the Talmud" without qualification, they mean the **Babylonian Talmud** -- about 2.5 million words across 63 tractates.

### What Is a Page of Talmud Like?

A Talmud page is unlike anything in Western literature. The Mishnah text sits in the center. Surrounding it is the Gemara. Around both are medieval commentaries -- **Rashi** (1040-1105) on one side and the **Tosafot** (12th-13th century French scholars) on the other. You are literally reading a conversation across a thousand years on a single page.

### Halakha and Aggadah

The Talmud contains two types of material:

- **Halakha** (\u05D4\u05DC\u05DB\u05D4) -- legal rulings. "What must we do?"
- **Aggadah** (\u05D0\u05D2\u05D3\u05D4) -- stories, parables, ethics, theology. "What does it mean?"

Both are essential. Halakha tells you how to act; aggadah tells you why it matters.

<!-- voice:key_insight insight="The Talmud is not a law code you look up for answers -- it is a record of centuries of argument. The process of debate is as sacred as the conclusions. Learning Talmud means learning how to think, not just what to think." -->

### Reflection Questions

1. Why did the Babylonian Talmud become more authoritative than the Jerusalem Talmud?
2. What is unusual about the physical layout of a Talmud page?
3. How does the distinction between halakha and aggadah reflect Judaism's balance of action and meaning?

### Deeper Reading
- **Adin Steinsaltz**, *The Essential Talmud*, Basic Books, 2006
- **Barry Holtz**, *Back to the Sources: Reading the Classic Jewish Texts*, Simon & Schuster, 1984, Chapter 4
- Talmud Bavli, Berakhot 2a -- the very first page of the Talmud`,
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

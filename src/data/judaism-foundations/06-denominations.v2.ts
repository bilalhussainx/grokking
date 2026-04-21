import { Module } from "../types";

export const denominationsModule: Module = {
  id: "judaism-denominations",
  title: "Denominations",
  description: "Understand the major Jewish movements -- Orthodox, Conservative, Reform, and Reconstructionist -- and how they differ on law, authority, and adaptation.",
  lessons: [
    {
      id: "judaism-orthodox-conservative",
      slug: "orthodox-and-conservative",
      title: "Orthodox and Conservative Judaism",
      content: `## Orthodox and Conservative Judaism

<!-- voice:section_check concept="Orthodox commitment to halakha versus Conservative's historical evolution approach" -->
## One Tradition, Many Paths

For most of Jewish history, there were no "denominations." Jews lived under halakha (Jewish law) as interpreted by local rabbis. The modern movements emerged in 18th-19th century Europe, when the **Haskalah** (Jewish Enlightenment) challenged Jews to engage with secular culture, science, and modern nation-states.

The question at the heart of all Jewish denominations is: **How does Jewish law adapt to changing times -- or should it?**

### Orthodox Judaism

**Orthodox** Jews believe that the Torah (both Written and Oral) was given by God at Sinai and is binding and eternal. Halakha can be interpreted and applied to new situations, but its core authority is not negotiable.

Key characteristics:
- Strict Shabbat observance (no driving, electronics, or commerce)
- Kashrut (dietary laws) fully observed
- Daily prayer three times
- Gender-separated worship in synagogue (mechitza)
- Torah study as a central religious obligation

Within Orthodoxy, there is significant diversity:
- **Modern Orthodox** -- engage fully with secular education and careers while observing halakha
- **Haredi (Ultra-Orthodox)** -- maintain more separation from secular culture
- **Hasidic** -- follow charismatic rebbes (spiritual leaders) in distinct communities

### Conservative Judaism

**Conservative** Judaism emerged in mid-19th century Germany and America as a middle path. It holds that halakha is binding but evolves historically. The tradition is sacred, but rabbis can make changes through established legal processes.

Key positions:
- Halakha is authoritative but interpreted in light of historical context
- The **Committee on Jewish Law and Standards** issues rulings
- Women can be ordained as rabbis (since 1985)
- Mixed-gender seating in synagogue
- Driving to synagogue on Shabbat is permitted (a controversial 1950 ruling)

> **Academic perspective:** The sociologist Marshall Sklare (*Conservative Judaism*, 1955) described the movement as an attempt to be "traditional without being Orthodox" -- maintaining loyalty to halakha while acknowledging that Jewish law has always developed in response to new conditions.

<!-- voice:key_insight insight="The core disagreement is not about God or Torah but about the nature of halakha itself. Is Jewish law eternally fixed (Orthodox) or historically evolving (Conservative)? Both claim continuity with tradition." -->

### The Spectrum of Jewish Denominations

Modern Judaism encompasses a range of approaches to tradition and change:

\`\`\`mermaid
graph TD
    A[Judaism] --> B[Orthodox]
    A --> C[Conservative]
    A --> D[Reform]
    A --> E[Reconstructionist]
    B --> B1[Haredi]
    B --> B2[Modern Orthodox]
\`\`\`

### Reflection Questions

1. What is the central question that divides Jewish denominations?
2. How does Modern Orthodox Judaism differ from Haredi Judaism?
3. Why was the Conservative movement's decision on driving to Shabbat services controversial?

### Deeper Reading
- **Marshall Sklare**, *Conservative Judaism*, Schocken, 1955
- **Samuel Heilman**, *Sliding to the Right*, University of California Press, 2006
- **Elliot Dorff**, *Conservative Judaism: Our Ancestors to Our Descendants*, United Synagogue, 1996`,
    },
    {
      id: "judaism-reform-reconstructionist",
      slug: "reform-and-reconstructionist",
      title: "Reform and Reconstructionist Judaism",
      content: `## Reform and Reconstructionist Judaism

<!-- voice:section_check concept="Reform's emphasis on ethical monotheism over ritual law" -->
## Adapting to Modernity

While Orthodox and Conservative Judaism debate how to apply halakha, **Reform** Judaism asks a more radical question: Is halakha binding at all?

### Reform Judaism

**Reform** Judaism, born in early 19th century Germany, teaches that Judaism's ethical principles are eternal but its ritual laws are human creations that can be accepted, modified, or set aside as conscience dictates.

Key characteristics:
- Individual autonomy in matters of practice -- each Jew decides which rituals are meaningful
- Emphasis on prophetic ethics (justice, compassion) over ritual observance
- Mixed-gender worship; women ordained as rabbis since 1972
- Inclusive of LGBTQ+ individuals and interfaith families
- Services often include vernacular language alongside Hebrew

The **Pittsburgh Platform** (1885), a founding document of American Reform, declared:

> "We recognize in the Mosaic legislation a system of training the Jewish people for its mission during its national life in Palestine, and today we accept as binding only its moral laws."

### Reconstructionist Judaism

**Reconstructionist** Judaism, founded by Rabbi **Mordecai Kaplan** (1881-1983), takes yet another approach. Kaplan taught that Judaism is an evolving religious civilization -- not primarily a set of beliefs or laws, but a living culture that includes religion, language, art, ethics, and community.

Key ideas:
- God is not a supernatural person but "the power that makes for salvation" (a naturalist theology)
- Jewish law has "a vote but not a veto" -- tradition informs but does not compel
- Emphasis on community decision-making
- Founded the concept of the **Bat Mitzvah** (Kaplan held the first one for his daughter in 1922)

<!-- voice:key_insight insight="The four movements form a spectrum from binding law (Orthodox) to individual conscience (Reform), with Conservative and Reconstructionist in between. Yet all four share a commitment to Jewish peoplehood, ethical living, and Torah study." -->

### Comparison Table

| Feature | Orthodox | Conservative | Reform | Reconstructionist |
|---------|----------|-------------|--------|-------------------|
| Halakha | Binding, divine | Binding, evolving | Informative, not binding | "Vote, not veto" |
| Torah origin | Divine revelation | Divine-human partnership | Human-inspired | Evolving civilization |
| Women rabbis | No (most) | Yes (since 1985) | Yes (since 1972) | Yes (since 1974) |
| Shabbat | Strict observance | Observant with flexibility | Individual choice | Community-guided |

### Reflection Questions

1. What does "individual autonomy" mean in Reform Judaism, and how does it differ from simply ignoring tradition?
2. What did Kaplan mean by calling Judaism an "evolving religious civilization"?
3. Do the four movements have more in common than in dispute?

### Deeper Reading
- **Michael Meyer**, *Response to Modernity: A History of the Reform Movement*, Wayne State University Press, 1988
- **Mordecai Kaplan**, *Judaism as a Civilization*, Jewish Publication Society, 1934
- **Dana Evan Kaplan**, *Contemporary American Judaism*, Columbia University Press, 2009`,
    },
    {
      id: "judaism-denominations-checkpoint",
      slug: "denominations-checkpoint",
      title: "Checkpoint: Denominations",
      content: `## Checkpoint: Denominations

Nice work navigating the diversity within Judaism!

<!-- voice:section_check concept="four movements, their views on halakha, and shared commitments" -->

### Question 1
What historical development gave rise to the modern Jewish denominations?

<details>
<summary>Show Answer</summary>

The **Haskalah** (Jewish Enlightenment) in 18th-19th century Europe. As Jews engaged with secular culture, science, and modern nation-states, they disagreed about how Judaism should respond to modernity.
</details>

### Question 2
How does the Conservative movement differ from the Orthodox on halakha?

<details>
<summary>Show Answer</summary>

Both consider halakha authoritative, but Orthodox Judaism views it as eternally fixed (only interpretation changes), while Conservative Judaism sees halakha as historically evolving -- rabbis can make changes through established legal processes.
</details>

### Question 3
What is the Reform movement's position on ritual law?

<details>
<summary>Show Answer</summary>

Reform Judaism teaches that Judaism's ethical principles are eternal but ritual laws are human creations. Individual Jews have autonomy to decide which practices are personally meaningful.
</details>

### Question 4
What did Mordecai Kaplan mean by saying Jewish law has "a vote but not a veto"?

<details>
<summary>Show Answer</summary>

Tradition informs and influences decisions but does not compel obedience. The community and the individual consider traditional practice as an important voice in decision-making, but conscience and reason also have a say.
</details>

### Question 5
What do all four major Jewish movements share in common?

<details>
<summary>Show Answer</summary>

A commitment to Jewish peoplehood, ethical living, Torah study (though they define its authority differently), and the continuity of Jewish civilization. They disagree on how to live Jewishly, not on whether Judaism matters.
</details>

### Voice Summary

Compare and contrast the four movements, focusing on how each answers the question: "How should Jewish law adapt to changing times?"

Next: Capstone -- putting it all together.`,
    },
  ],
};

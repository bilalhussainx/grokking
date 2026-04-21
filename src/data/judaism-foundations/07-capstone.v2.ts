import { Module } from "../types";

export const capstoneModule: Module = {
  id: "judaism-capstone",
  title: "Capstone",
  description: "Synthesize everything you have learned about Judaism -- from covenant to Talmud, ethics to denominations -- in a comprehensive review.",
  lessons: [
    {
      id: "judaism-capstone-review",
      slug: "capstone-review",
      title: "Capstone: Judaism -- Torah & Tradition",
      content: `## Capstone: Judaism — Torah & Tradition

Congratulations on completing the Judaism course. This capstone brings every major theme together — covenant, scripture, law, ethics, practice, and diversity — and invites you to synthesize what you have learned into a coherent whole.

<!-- voice:section_check concept="connecting covenant, scripture, law, ethics, practice, and diversity" -->

\`\`\`concept
{ "title": "Judaism's Defining Genius", "variant": "insight", "content": "Judaism holds opposites together — law and story, obligation and freedom, unity and diversity, ancient tradition and modern adaptation. It is a tradition that not only permits argument but commands it. The debates of the Talmud, the diversity of denominations, and the evolving application of ethics are not signs of weakness; they are the engine of the tradition's survival across four millennia." }
\`\`\`

---

### The Journey: Six Modules at a Glance

\`\`\`tabs
{ "tabs": [
  { "label": "Module 1", "icon": "🤝", "content": "**What is Judaism?**\\n\\nJudaism resists a single definition because it is simultaneously a religion, a people, a civilization, and a covenant. The **Shema** — *Hear O Israel, the Lord our God, the Lord is One* — functions as the foundational declaration of ethical monotheism. The **Brit** (covenant) is the heartbeat of the tradition: a mutual relationship in which God commits to sustain Israel and Israel commits to follow Torah and pursue justice. God is presented not as a distant sovereign but as a partner in history." },
  { "label": "Module 2", "icon": "📖", "content": "**Torah & Tanakh**\\n\\nThe Hebrew Bible (Tanakh) is a library, not a single book. It contains:\\n- **Torah** (Five Books): Genesis through Deuteronomy — narrative, law, and covenant\\n- **Nevi'im** (Prophets): History and prophetic literature calling Israel back to the covenant\\n- **Ketuvim** (Writings): Psalms, Proverbs, Job, Song of Songs, Ruth — poetry, philosophy, and wisdom\\n\\nScripture is not read in a vacuum. Every reading is filtered through centuries of commentary and interpretation." },
  { "label": "Module 3", "icon": "🕯️", "content": "**Talmud & Oral Law**\\n\\nAlongside the Written Torah, Jewish tradition holds that God gave Moses an Oral Torah at Sinai. This was transmitted verbally for centuries until Rabbi Judah ha-Nasi codified it as the **Mishnah** (~200 CE). Later rabbis' commentary on the Mishnah became the **Gemara**. Mishnah + Gemara = the **Talmud**.\\n\\nThe Talmud's two pillars:\\n- **Halakha** (law): How Jews are obligated to act\\n- **Aggadah** (story): The theological imagination, ethics, and folklore that give law its soul\\n\\nCrucially, minority opinions are preserved alongside majority rulings — because future generations may need them." },
  { "label": "Module 4", "icon": "⚖️", "content": "**Jewish Ethics**\\n\\nJewish ethics is action-centered, not merely belief-centered. Three core concepts:\\n\\n| Concept | Root | Meaning |\\n|---|---|---|\\n| **Tikkun olam** | *repair* | Repairing a broken world through acts of justice |\\n| **Tzedakah** | *tzedek* (justice) | Obligatory giving — not charity but justice |\\n| **Chesed** | *lovingkindness* | Going beyond legal obligation out of love |\\n\\nTzedakah sets the floor (what we *must* do); chesed raises the ceiling (what love inspires us to do). Both are necessary." },
  { "label": "Module 5", "icon": "✨", "content": "**Holidays & Shabbat**\\n\\nAbraham Joshua Heschel called Shabbat *a palace in time* — unlike sacred buildings that can be destroyed, holiness built into time is indestructible. Every week, Jews enter this palace by ceasing work and affirming freedom.\\n\\nThe Jewish calendar creates a rhythm of memory:\\n- **High Holy Days** (Rosh Hashanah / Yom Kippur): Repentance and renewal\\n- **Pilgrimage Festivals** (Passover, Shavuot, Sukkot): Freedom, revelation, and gratitude\\n- **Hanukkah**: Dedication and resistance\\n- **Purim**: Survival and joy" },
  { "label": "Module 6", "icon": "🌍", "content": "**Denominations**\\n\\nThe central question dividing modern Jewish movements: *How does halakha (Jewish law) meet modernity — or should it?*\\n\\n| Movement | Core Position |\\n|---|---|\\n| **Orthodox** | Halakha is eternally binding and divinely revealed |\\n| **Conservative** | Halakha evolves through established rabbinic process |\\n| **Reform** | Only ethical principles are binding; ritual is personal choice |\\n| **Reconstructionist** | Tradition has \\"a vote but not a veto\\" — Judaism evolves as a civilization |\\n\\nDiversity within Judaism is not a modern problem; it is the tradition's natural state." }
] }
\`\`\`

---

### Comprehensive Review Quiz

\`\`\`quiz
{ "title": "Judaism: Foundations to Denominations", "questions": [
  {
    "question": "What makes the covenant (Brit) theologically distinctive compared to the relationship between a king and subjects?",
    "options": [
      "The covenant requires no obligations from Israel — only from God",
      "The covenant is mutual: God commits to sustain Israel, and Israel commits to follow Torah and pursue justice",
      "The covenant is a legal contract that expires after each generation",
      "The covenant binds only the Levites as a priestly class, not all of Israel"
    ],
    "answer": 1,
    "explanation": "The Brit is a bilateral agreement — both parties have obligations. This distinguishes the God of the Hebrew Bible from a mere sovereign: Israel's God is a partner in a mutual relationship, which is why prophets can challenge God's justice (as Abraham does over Sodom) and why the covenant can be renewed across generations."
  },
  {
    "question": "What is the correct sequence from Written Torah to Talmud?",
    "options": [
      "Torah → Gemara → Mishnah → Talmud",
      "Mishnah → Torah → Gemara → Talmud",
      "Torah → Mishnah → Gemara → Talmud",
      "Torah → Talmud → Mishnah → Gemara"
    ],
    "answer": 2,
    "explanation": "The Torah (Written Torah) came first. The accompanying Oral Torah was transmitted verbally for centuries, then codified as the Mishnah (~200 CE) by Rabbi Judah ha-Nasi. Rabbinic commentary on the Mishnah became the Gemara. Mishnah + Gemara together constitute the Talmud."
  },
  {
    "question": "Why does the Mishnah preserve minority opinions alongside the majority ruling?",
    "options": [
      "Because majority opinions were considered unreliable",
      "To honor the scholars who held them, as a matter of courtesy",
      "Because future generations facing different circumstances might need the minority view — and honest debate is itself considered sacred",
      "Because the editors could not agree on which opinions to remove"
    ],
    "answer": 2,
    "explanation": "The Talmud reflects the principle that 'dispute for the sake of Heaven' (machloket l'shem shamayim) is sacred. A minority opinion that loses today may be exactly what a future generation needs. This is why Talmudic pages display multiple voices simultaneously rather than presenting a single authoritative ruling."
  },
  {
    "question": "How do tzedakah and chesed differ?",
    "options": [
      "Tzedakah is a private spiritual practice; chesed is a public social obligation",
      "Tzedakah is obligatory justice-giving rooted in the concept of right; chesed is voluntary lovingkindness that goes beyond legal duty",
      "They are synonyms — both simply mean 'charity' in different dialects",
      "Tzedakah applies only to money; chesed applies only to time"
    ],
    "answer": 1,
    "explanation": "The distinction matters enormously in Jewish ethics. Tzedakah comes from tzedek (justice) — giving is not generosity, it is fulfilling an obligation. Chesed goes beyond what law requires, motivated by love. Judaism needs both: tzedakah sets the floor of what justice demands; chesed lifts us toward what love makes possible."
  },
  {
    "question": "Abraham Joshua Heschel called Shabbat 'a palace in time.' What is the core insight behind this phrase?",
    "options": [
      "Shabbat requires expensive preparation, like building a palace",
      "The Shabbat prayers are conducted in a grand architectural style",
      "Unlike sacred buildings that can be destroyed, holiness built into time is indestructible — every week, Jews enter this palace by ceasing work",
      "Heschel was arguing that synagogues should be replaced by outdoor worship"
    ],
    "answer": 2,
    "explanation": "Heschel's insight is that Jewish civilization, unlike many others, sanctifies time rather than primarily sanctifying space. Temples can be destroyed (and were, twice). Shabbat cannot be taken away. This realization — that the most indestructible sacred space is a weekly rhythm — shaped how Jewish communities sustained themselves across centuries of exile."
  },
  {
    "question": "The Reconstructionist movement holds that tradition has 'a vote but not a veto.' What does this mean for halakha?",
    "options": [
      "Traditional law is completely irrelevant and should be discarded",
      "Traditional law is binding in all circumstances without exception",
      "Traditional practice deserves serious consideration and carries weight, but the living community retains the authority to evolve beyond it",
      "Only the biblical commandments count; post-biblical rabbinics have no vote at all"
    ],
    "answer": 2,
    "explanation": "Mordecai Kaplan, who founded Reconstructionism, viewed Judaism as an evolving civilization — not a static set of divine commands. The past is authoritative but not absolute. This contrasts with Orthodoxy (where halakha is binding), Conservative Judaism (where change happens through internal rabbinic process), and Reform (where individual conscience is primary)."
  }
] }
\`\`\`

---

### The Thread That Connects Everything

\`\`\`concept
{ "title": "One Thread Through Four Millennia", "variant": "mental-model", "content": "Every major theme in this course traces back to a single idea: the covenant creates a people bound together by obligation — to God, to one another, and to the world.\\n\\n- **Torah** is the covenant's content — what the relationship requires\\n- **Talmud** is the covenant's conversation — how each generation negotiates its meaning\\n- **Ethics** is the covenant's consequence — what it produces in the world\\n- **Shabbat and holidays** are the covenant's rhythm — how it is lived in time\\n- **Denominations** are the covenant's ongoing debate — how each community answers the question of faithfulness in its own era\\n\\nThe diversity within Judaism, which can look like fragmentation, is actually the covenant being taken seriously enough to argue about." }
\`\`\`

---

### Final Reflection

Write 3–4 sentences in your own words responding to this question:

> **What is the thread that connects the covenant at Sinai, the debates of the Talmud, the ethics of tikkun olam, and the diversity of modern denominations?**

Consider: What does it mean for a tradition to survive not by freezing itself, but by building argument and adaptation into its very structure?

\`\`\`collapse
{ "title": "Deep Dive: Why Judaism Survived When Others Did Not", "content": "Historians of religion often ask why Judaism survived the destruction of its Temple in 70 CE — an event that ended most ancient Mediterranean religions. The answer lies in what Rabbi Yochanan ben Zakkai did at Yavneh: he shifted the center of Jewish life from sacrifice (which required a Temple) to study, prayer, and ethical action (which require only a community).\\n\\nThis was not a compromise — it was a theological revolution. The Talmud records that God said: 'I have a greater delight in one day when you sit and study Torah than in all the burnt offerings that Israel offered before Me.' Study became the new sacrifice. The rabbi replaced the priest. The synagogue replaced the Temple.\\n\\nThis structural flexibility — the ability to reconstruct the tradition's center without losing its identity — is precisely what the covenant model enables. If the relationship with God is personal and ongoing, then the forms through which it is expressed can change without the relationship itself ending. This is the genius that Heschel, Sacks, and Kaplan each identified from different angles.\\n\\nThe same flexibility that preserved Judaism through exile also produces denominational diversity today. When Orthodox, Conservative, Reform, and Reconstructionist Jews argue about halakha, they are — in the deepest sense — doing exactly what the Talmudic rabbis did: taking the covenant seriously enough to fight about it." }
\`\`\`

---

### Voice Summary

<!-- voice:key_insight insight="Judaism's genius is holding opposites together — law and story, obligation and freedom, unity and diversity, ancient tradition and modern adaptation. It is a tradition that commands you to argue with it." -->

Summarize the course in your own words, touching on:
- The covenant as the foundation that connects everything
- How the Written and Oral Torah work together across history
- Judaism's ethical vision and why action matters more than belief alone
- How the tradition adapts while maintaining continuity

---

### Recommended Next Steps

\`\`\`takeaways
{ "title": "Where to Go From Here", "items": [
  "Primary text: Read the Book of Genesis (Bereishit) in Robert Alter's translation — the finest literary rendering in English, with notes that illuminate the Hebrew",
  "Talmud entry point: Adin Steinsaltz's The Essential Talmud — a clear, accessible introduction to how the Talmud works and why it matters",
  "Ethics in practice: Jonathan Sacks' To Heal a Fractured World connects covenant ethics directly to contemporary moral challenges",
  "Historical sweep: Paul Johnson's A History of the Jews traces the full arc from Abraham to modernity, integrating politics, culture, and theology",
  "Philosophy: Abraham Joshua Heschel's The Sabbath — a short, poetic masterpiece that expands the idea of sacred time into a complete Jewish theology"
] }
\`\`\``,
    },
  ],
};

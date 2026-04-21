import { Module } from "../types";

export const introductionModule: Module = {
  id: "christianity-introduction",
  title: "Introduction to Christianity",
  description: "Understand the origins, core beliefs, and historical context of Christianity — the world's largest religion. Explore how a small movement in Roman Palestine became a global faith. Resources: N.T. Wright, Simply Christian; Alister McGrath, Christianity: An Introduction.",
  lessons: [
    {
      id: "christianity-what-is-christianity",
      slug: "what-is-christianity",
      title: "What is Christianity?",
      content: `## What is Christianity?

<!-- voice:section_check concept="Core identity and beliefs of Christianity" -->

**Christianity** is a monotheistic Abrahamic religion centered on the life, teachings, death, and resurrection of **Jesus of Nazareth**, whom Christians confess as the **Christ** — from the Greek *Christos*, meaning "anointed one," translating the Hebrew *Mashiach* (Messiah). Christians believe Jesus is the Son of God, fully divine and fully human, whose atoning death and resurrection open the way for humanity's reconciliation with God.

\`\`\`concept
{ "title": "Christianity: A Religion Built Around a Person", "variant": "mental-model", "content": "Christianity is not primarily a moral code or a philosophy — at its center is a person and a claim about what God has done through him. Jesus Christ stands at the foundation. Everything else in Christian theology — ethics, worship, community, eschatological hope — flows from this conviction. As N.T. Wright observes, to understand Christianity is first to understand who Jesus was and what his resurrection means for the whole human story." }
\`\`\`

With approximately **2.3 billion adherents** — roughly 28.8% of the global population — Christianity is the world's largest religion, present as a majority faith in 120 countries and territories and expressed across an extraordinary diversity of cultures, languages, and traditions.

### Core Beliefs at a Glance

| Belief | Summary | Key Scripture |
|--------|---------|---------------|
| **One God (Trinity)** | God is one, existing as Father, Son, and Holy Spirit — co-equal and co-eternal | Matthew 28:19 |
| **Incarnation** | God became fully human in Jesus Christ | John 1:14 |
| **Atonement** | Jesus' death reconciles sinful humanity with God | Romans 5:8 |
| **Resurrection** | Jesus rose bodily from the dead — the cornerstone of Christian faith | 1 Corinthians 15:3–4 |
| **Grace** | Salvation is God's gift, received through faith — not earned by human effort | Ephesians 2:8–9 |
| **Kingdom of God** | God is establishing a reign of justice, peace, and love, inaugurated by Jesus | Mark 1:15 |

<!-- voice:key_insight insight="The resurrection is not a footnote in Christianity — it is the cornerstone. Paul wrote: 'If Christ has not been raised, your faith is futile.' Every other Christian belief — grace, new creation, eternal life — stands or falls with this claim." -->

### Major Christian Denominations

Christianity emerged in 1st-century Roman Judaea, spread through the Mediterranean world, and has diversified across two millennia. The number of denominations grew from approximately **2,000 in 1900** to an estimated **50,000 by 2025**, driven largely by Protestant fragmentation and the global rise of Pentecostalism.

\`\`\`mermaid
graph TD
    A[Christianity] --> B["Catholic (~1.3B)"]
    A --> C["Protestant (~800M)"]
    A --> D["Orthodox (~300M)"]
    C --> C1[Lutheran]
    C --> C2[Baptist]
    C --> C3[Methodist]
    C --> C4[Pentecostal]
    D --> D1[Eastern Orthodox]
    D --> D2[Oriental Orthodox]
    D --> D3[Church of the East]
    B --> B1[Roman Catholic]
    B --> B2[Eastern Catholic]
\`\`\`

Key turning points in this history: Emperor **Constantine's conversion** and the **Edict of Milan (313 CE)** ended Roman persecution and began Christianity's transformation into an imperial religion. The **Great Schism of 1054** divided Eastern Orthodoxy from Rome. The **Protestant Reformation (1517)** fractured the Western church — and has never fully reunited.

### The Bible

\`\`\`tabs
{ "tabs": [ { "label": "Old Testament", "icon": "📜", "content": "**39 books** (Protestant canon), shared with Judaism in a different arrangement — the same texts, differently ordered and understood.\\n\\n- **Torah (Law):** Genesis through Deuteronomy — creation, covenant, exodus, and law\\n- **Prophets:** Historical narratives and prophetic literature (Isaiah, Jeremiah, Ezekiel, and more)\\n- **Writings:** Psalms, Proverbs, Job, and wisdom literature\\n\\nThese texts narrate God's relationship with Israel and are read by Christians as anticipating Jesus — promises and prophecies that he is understood to fulfill." }, { "label": "New Testament", "icon": "✝️", "content": "**27 books** written in Greek during the 1st century CE.\\n\\n- **Four Gospels** (Matthew, Mark, Luke, John) — accounts of Jesus' life, teaching, death, and resurrection\\n- **Acts of the Apostles** — the early church's expansion from Jerusalem outward into the Roman world\\n- **Epistles** — letters by Paul and others addressing theology, ethics, and community life\\n- **Revelation** — apocalyptic vision of God's ultimate victory and new creation\\n\\nThe canon was formally recognized through a series of church councils and episcopal letters in the 4th century CE." }, { "label": "Key Verse", "icon": "💬", "content": "> \\"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.\\"\\n> — John 3:16 NIV\\n\\nThis single verse has been called \\"the gospel in a nutshell.\\" It encapsulates Christianity's core claim: that God acted in Jesus out of love for all humanity — not a selected people, but the world — and that the response of faith leads to eternal life." } ] }
\`\`\`

### Christianity in Global Context

Christianity's center of gravity has shifted dramatically. While the faith remains culturally dominant in Europe and North America, those regions are experiencing **measurable decline** — the UK now at 49% Christian identification, France at 46%, with North America shrinking at approximately −0.14% per year (2020–2025).

\`\`\`callout
{ "type": "info", "title": "Where Christianity is Growing Fastest", "content": "The faith is expanding rapidly in **sub-Saharan Africa** (Middle Africa: +3.16%/year), **South Asia** (+1.88%/year), and **East Asia**. The fastest-growing expressions globally are Pentecostal and charismatic Christianity. By mid-century, the demographic center of world Christianity will be firmly in the Global South — not Europe or North America." }
\`\`\`

This geographic and cultural diversity means Christianity is expressed through vastly different forms — from Ethiopian Orthodox liturgy to Brazilian Pentecostal worship to Korean Presbyterian prayer marathons to Chinese house churches meeting in secret. There is no single "Christian culture," only a shared confession about Jesus.

### Reflection Questions

1. What does it mean that Christianity centers on a **person** rather than primarily a book or a set of rules? How does this shape the nature of Christian faith compared to, say, Islam or Judaism?
2. How does the doctrine of the **Trinity** — one God in three co-equal, co-eternal persons — distinguish Christian monotheism from other Abrahamic faiths?
3. Why might Christianity's **diversity** (50,000+ denominations) be seen as both a strength (contextual flexibility across cultures) and a challenge (fragmentation and doctrinal conflict)?

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "What does the title 'Christ' mean?", "options": ["Son of God", "Savior of the world", "Anointed One", "King of Israel"], "answer": 2, "explanation": "Christos is the Greek translation of the Hebrew Mashiach (Messiah), meaning 'anointed one' — a designation for a divinely appointed deliverer. The title became so central that 'Jesus Christ' functions almost as a personal name." }, { "question": "Approximately how many Christians are there worldwide in the mid-2020s?", "options": ["1.3 billion", "1.8 billion", "2.3 billion", "3.1 billion"], "answer": 2, "explanation": "Christianity is the world's largest religion with approximately 2.3 billion adherents — roughly 28.8% of the global population, present as a majority faith in 120 countries and territories." }, { "question": "Which event in 313 CE was a decisive turning point for Christianity in the Roman Empire?", "options": ["The First Council of Nicaea", "The Edict of Milan", "The Great Schism", "The Council of Chalcedon"], "answer": 1, "explanation": "The Edict of Milan, issued by Emperor Constantine, ended Roman persecution of Christians and legalized the faith. It marked the beginning of Christianity's transformation from a persecuted minority movement into the dominant religion of the empire." }, { "question": "Which ranking correctly orders the three main Christian branches by size (largest to smallest)?", "options": ["Protestant → Catholic → Orthodox", "Catholic → Protestant → Orthodox", "Orthodox → Catholic → Protestant", "Catholic → Orthodox → Protestant"], "answer": 1, "explanation": "Catholicism (~1.3 billion) is the largest single Christian body, followed by Protestantism (~800 million across thousands of denominations), then Eastern Orthodoxy (~300 million). Oriental Orthodoxy (~60 million) and Restorationist movements (~35 million) are smaller but significant branches." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Christianity centers on a person — Jesus Christ — and the claim that his death and resurrection reconcile humanity to God; ethics, worship, and hope all flow from this.", "With ~2.3 billion adherents (28.8% of humanity), it is the world's largest religion; fastest growth is now in sub-Saharan Africa and Asia, not the West.", "The Trinity — one God in three co-equal, co-eternal persons (Father, Son, Holy Spirit) — is the defining doctrinal boundary distinguishing Christianity from other Abrahamic faiths.", "Christianity has diversified into ~50,000 denominations (2025), spanning Catholic, Protestant, and Orthodox traditions expressed across every human culture on earth.", "The Bible's two testaments narrate one continuous story: God's relationship with humanity through Israel (OT) and its fulfillment in Jesus Christ (NT), with the canon formally recognized in the 4th century CE." ] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Recommended Reading", "content": "**N.T. Wright**, *Simply Christian* (HarperOne, 2006) — The leading New Testament scholar explains Christianity from the inside, beginning not with doctrines but with universal human longings for justice, spirituality, relationship, and beauty. Accessible and intellectually rigorous; ideal for this course.\\n\\n**Alister McGrath**, *Christianity: An Introduction* (Wiley-Blackwell, 3rd ed., 2015) — A comprehensive academic survey covering history, theology, ethics, and global expression. Use this as a reference text throughout the course.\\n\\n**Jaroslav Pelikan**, *Jesus Through the Centuries* (Yale University Press, 1985) — How each era has reimagined Jesus differently: apocalyptic prophet, cosmic lord, moral teacher, liberator. Reveals the extraordinary historical diversity within Christianity's central figure." }
\`\`\``,
    },
    {
      id: "christianity-historical-context",
      slug: "historical-context",
      title: "Historical Context: The World of Jesus",
      content: `## Historical Context: The World of Jesus

<!-- voice:section_check concept="The political, religious, and cultural world of first-century Palestine" -->

To understand Christianity's origins, we must understand the world into which Jesus was born — a world of empire, occupation, religious ferment, and messianic expectation.

### Roman Palestine in the First Century

Jesus lived in **Roman-occupied Palestine** during a turbulent period. The key political realities:

| Power | Role |
|-------|------|
| **Roman Empire** | Occupying force; ultimate political authority through governors like Pontius Pilate |
| **Herodian Dynasty** | Client kings ruling portions of Palestine under Roman oversight |
| **Sanhedrin** | Jewish council with limited religious and judicial authority |
| **Temple establishment** | The Jerusalem Temple was the center of religious, economic, and national life |

The Jewish people were chafing under foreign domination. Many longed for a **Messiah** — an anointed leader who would restore Israel's sovereignty. Different groups interpreted this hope differently.

### Jewish Groups in Jesus' Time

| Group | Beliefs | Approach |
|-------|---------|----------|
| **Pharisees** | Oral Torah, resurrection of the dead, strict observance | Work within the system; reform through Torah study |
| **Sadducees** | Temple-centered, no belief in resurrection, written Torah only | Collaborate with Rome to preserve Temple worship |
| **Essenes** | Apocalyptic, purity-focused, communal living | Withdraw from corrupt society (Dead Sea Scrolls community) |
| **Zealots** | Armed resistance against Rome | Violent revolution to restore Israel |

<!-- voice:key_insight insight="Jesus did not fit neatly into any of these categories. He shared the Pharisees' belief in resurrection but criticized their legalism. He honored the Temple but predicted its destruction. He proclaimed a kingdom but refused political violence. His message was genuinely radical — it challenged every existing framework." -->

### Messianic Expectation

The Hebrew prophets had spoken of a coming deliverer:

> "For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace."
> — Isaiah 9:6 NIV

> "But you, Bethlehem Ephrathah, though you are small among the clans of Judah, out of you will come for me one who will be ruler over Israel, whose origins are from of old, from ancient times."
> — Micah 5:2 NIV

By the first century, messianic expectation was intense. Multiple claimants had already appeared and been crushed by Rome. Into this charged atmosphere, a carpenter's son from the village of Nazareth began to preach.

### Reflection Questions

1. How does understanding Roman occupation change your reading of Jesus' message about a "kingdom"?
2. Why might Jesus' refusal to fit into existing categories (Pharisee, Zealot, Essene) have been both attractive and threatening?
3. What parallels can you draw between first-century messianic expectation and modern hopes for political or spiritual liberation?

### Deeper Reading

- **E.P. Sanders**, *The Historical Figure of Jesus*, Penguin, 1993
- **N.T. Wright**, *The New Testament and the People of God*, Fortress Press, 1992
`,
    },
    {
      id: "christianity-intro-checkpoint",
      slug: "introduction-checkpoint",
      title: "Checkpoint: Introduction to Christianity",
      content: `## Checkpoint: Introduction to Christianity

Well done completing the first module! Let us review the key concepts about Christianity's identity and historical context.

### Quiz

**1. What does the title "Christ" (Christos) mean?**

- a) Savior
- b) Teacher
- c) Anointed one (Messiah)
- d) Prophet

**Answer: c)** Christ comes from the Greek *Christos*, meaning "anointed one," which translates the Hebrew *Mashiach* (Messiah).

---

**2. Name the two main sections of the Christian Bible and their approximate contents.**

*Short Answer:* The Old Testament (39 books in the Protestant canon) contains the Torah, Prophets, and Writings — the story of God's relationship with Israel. The New Testament (27 books) contains the four Gospels, Acts of the Apostles, epistles (letters), and Revelation — focused on Jesus and the early church.

---

**3. Which Jewish group shared Jesus' belief in resurrection but was criticized by him for legalism?**

- a) Sadducees
- b) Essenes
- c) Zealots
- d) Pharisees

**Answer: d)** Jesus shared the Pharisees' belief in resurrection and the oral tradition but challenged their approach to the law, emphasizing the spirit of the law over its letter.

---

**4. What is the doctrine of the Incarnation?**

*Short Answer:* The Incarnation is the Christian belief that God became human in the person of Jesus Christ. As John 1:14 (NIV) states: "The Word became flesh and made his dwelling among us." This means that in Jesus, the divine and human natures were united in one person.

---

**5. Why might Jesus' message of a "kingdom" have been politically dangerous in Roman-occupied Palestine?**

*Short Answer:* Rome tolerated no rival claims to authority. Any talk of a "kingdom" could be interpreted as sedition — a direct challenge to Roman sovereignty. This is why Pilate's question to Jesus was "Are you the king of the Jews?" and why the charge posted on the cross read "King of the Jews." Jesus' kingdom, however, was "not of this world" (John 18:36 NIV) — a spiritual reality that Rome could not comprehend within its political categories.

---

### Voice Summary

Try explaining aloud, in your own words:
- What Christianity is and what makes it distinctive among world religions
- The political and religious context of first-century Palestine
- Why Jesus did not fit neatly into any existing Jewish group

Great start! In the next module, we will explore the Old Testament foundations that shaped Jesus' world.
`,
    },
  ],
};

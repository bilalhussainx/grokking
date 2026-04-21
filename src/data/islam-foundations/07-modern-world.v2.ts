import { Module } from "../types";

export const modernWorldModule: Module = {
  id: "islam-modern-world",
  title: "Islam in the Modern World",
  description: "Examine contemporary issues facing Muslims, the tradition of interfaith dialogue, common misconceptions about Islam, and the diversity of the global Muslim community. Resources: John Esposito, The Future of Islam; Tariq Ramadan, Western Muslims and the Future of Islam.",
  lessons: [
    {
      id: "islam-diversity-global",
      slug: "diversity-global-islam",
      title: "The Diversity of Global Islam",
      content: `## The Diversity of Global Islam

<!-- voice:section_check concept="The geographic, ethnic, and intellectual diversity of the Muslim world" -->

One of the most common misconceptions about Islam is that it is monolithic — that 1.9 billion Muslims think, worship, and live in the same way. The Quran itself points to diversity as a divine sign: *"And one of His signs is the creation of the heavens and the earth, and the diversity of your languages and colours"* (Surah Ar-Rum, 30:22). The reality of the global Muslim community is extraordinarily varied — geographically, legally, spiritually, and culturally.

\`\`\`concept
{ "title": "Islam is not monolithic", "variant": "mental-model", "content": "With over 2 billion followers across every inhabited continent, Islam encompasses more than 2,300 distinct language or ethnic subgroups. Only about 20% of the world's Muslims are Arab, and the majority do not live in the Middle East. Shared belief in one God and the prophethood of Muhammad coexists with vast diversity in practice, legal interpretation, language, and cultural expression." }
\`\`\`

---

### Geographic Spread

The largest Muslim-majority countries by population are concentrated in Asia and sub-Saharan Africa — not the Arab world:

| Country | Muslim Population (approx.) | Region |
|---------|----------------------------|--------|
| Indonesia | 231 million | Southeast Asia |
| Pakistan | 213 million | South Asia |
| Bangladesh | 153 million | South Asia |
| Nigeria | 100 million | West Africa |
| Egypt | 90 million | North Africa |
| Turkey | 80 million | Europe / Western Asia |
| Iran | 80 million | Western Asia |

Islam is also a major presence in India (200+ million), China (25+ million), Europe (44+ million), and North America (3.5+ million). The image of Islam as an "Arab religion" reflects a geography that has never matched the demographic reality.

---

### Schools of Thought: The Madhahib

\`\`\`tabs
{ "tabs": [
  { "label": "What Is a Madhhab?", "icon": "📖", "content": "A **madhhab** (plural: madhahib, مذاهب) is a school of Islamic legal interpretation — a systematic methodology for deriving rulings from the Quran and Sunnah. The four major Sunni schools emerged in the 8th–9th centuries and represent legitimate differences of scholarly opinion on *secondary* legal matters. All four agree on the fundamentals of faith and worship." },
  { "label": "The Four Schools", "icon": "🏛️", "content": "| School | Founder | Dates | Predominant Region |\\n|--------|---------|-------|-------------------|\\n| **Hanafi** | Imam Abu Hanifa | d. 767 | Turkey, South/Central Asia, parts of Middle East |\\n| **Maliki** | Imam Malik ibn Anas | d. 795 | North/West Africa, parts of Arabian Peninsula |\\n| **Shafi'i** | Imam al-Shafi'i | d. 820 | Southeast Asia, East Africa, parts of Middle East |\\n| **Hanbali** | Imam Ahmad ibn Hanbal | d. 855 | Saudi Arabia, Qatar |\\n\\nAll four schools are considered equally valid within Sunni Islam." },
  { "label": "Sunni & Shia", "icon": "⚖️", "content": "**Sunni Islam** (approximately 87–90% of Muslims) follows the four legal schools above and emphasizes community consensus in selecting leadership after the Prophet.\\n\\n**Shia Islam** (approximately 10–13% of Muslims) holds that leadership should have passed to Ali ibn Abi Talib, the Prophet's cousin and son-in-law. Over time, this political dispute developed into distinct theological and juristic traditions. Major Shia branches include the Twelvers (largest), Isma'ilis, and Zaydis.\\n\\nBoth Sunni and Shia Muslims share the core pillars of faith and practice — the differences are primarily in jurisprudence, theology, and questions of religious authority." }
] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Ikhtilaf: The Mercy of Disagreement", "content": "The existence of multiple legal schools reflects a recognized Islamic principle: **ikhtilaf** (اختلاف) — legitimate scholarly disagreement on secondary matters. A widely cited hadith states: *'Difference of opinion among my ummah is a mercy.'* This intellectual pluralism is not a weakness — it is a deliberate flexibility that has allowed Islamic law to adapt to vastly different cultures and contexts across fourteen centuries, while maintaining its core principles." }
\`\`\`

---

### The Spiritual Tradition: Tasawwuf (Sufism)

**Tasawwuf** (التصوف) — called Sufism in English — is the **inward, spiritual dimension** of Islam. It focuses on the purification of the heart, the direct experience of God's presence, and the realization of **ihsan** — "worshipping God as though you see Him," the third pillar described by the Prophet in the famous hadith of Gabriel.

Major Sufi orders (*turuq*, طرق) include the **Qadiriyyah**, **Naqshbandiyyah**, **Shadhiliyyah**, and **Mevlevi** — the last known for the meditative whirling practice that has become iconic in world culture. Sufi masters profoundly shaped both Islamic civilization and world literature:

- **Rabia al-Adawiyyah** (d. 801) — one of the earliest mystic poets, known for her doctrine of divine love
- **Ibn Arabi** (d. 1240) — monumental philosopher of mystical metaphysics
- **Jalal al-Din Rumi** (d. 1273) — Persian poet whose *Masnavi* is among the most read works in world literature

Rumi wrote:

> *"What I want is to see your face / in every atom of the world."*

Tasawwuf is not separate from Islam — it is the deepening of Islam's spiritual core, tracing its lineage directly to Quranic verses and Prophetic practice.

---

### Cultural Expression Across the World

\`\`\`tabs
{ "tabs": [
  { "label": "Arts & Architecture", "icon": "🕌", "content": "Islamic civilization produced distinct visual traditions in every region it reached:\\n\\n- **Arabic calligraphy** and geometric art across the Middle East\\n- **Mughal architecture** in South Asia — including the Taj Mahal, built by the Mughal emperor Shah Jahan\\n- **Andalusian** (Islamic Spain) achievements in philosophy, medicine, and architecture, including the Alhambra palace\\n- **Ottoman miniature painting** and mosques that defined urban skylines from Istanbul to Cairo" },
  { "label": "Music & Performance", "icon": "🎶", "content": "Music and oral tradition take radically different forms across Muslim cultures:\\n\\n- **Gamelan** orchestral music in Indonesia accompanies Islamic ceremonies\\n- **Mevlevi sama'** — the whirling meditation of the Sufi orders — is itself a form of structured spiritual performance\\n- **West African Islamic poetry** (qasida) and griot storytelling traditions weave Islamic themes into pre-existing oral cultures\\n- **Qawwali** devotional music in South Asia (associated with figures like Nusrat Fateh Ali Khan) is sung primarily in Sufi contexts" },
  { "label": "Political Systems", "icon": "🗺️", "content": "Muslim-majority countries exhibit a wide spectrum of political arrangements:\\n\\n- **Theocratic**: Iran (Islamic Republic), Saudi Arabia (governed by Wahhabi interpretation of Islamic law)\\n- **Secular**: Turkey (constitutionally secular since Atatürk), Tunisia\\n- **Mixed**: Pakistan (Islamic Republic, but with parliamentary democracy)\\n- **Sultanates and monarchies**: Malaysia, Jordan, Morocco\\n\\nThis diversity reflects the absence of a single 'Islamic political model' — Muslim scholars and communities have debated the relationship between religion and governance for centuries." }
] }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding: The Diversity of Global Islam", "questions": [
  {
    "question": "Which country has the largest Muslim population in the world?",
    "options": ["Saudi Arabia", "Egypt", "Indonesia", "Pakistan"],
    "answer": 2,
    "explanation": "Indonesia has approximately 231 million Muslims, making it the world's most populous Muslim-majority country. This is a common surprise — the Arab world accounts for only about 20% of all Muslims."
  },
  {
    "question": "The four Sunni legal schools (madhahib) agree on which of the following?",
    "options": ["Every legal ruling in fiqh", "The fundamentals of faith and worship, while differing on secondary matters", "The exact succession after the Prophet", "The primacy of one school over the others"],
    "answer": 1,
    "explanation": "The madhahib share core beliefs and fundamental practices but differ on secondary legal questions — for example, the precise details of ritual purity, contract law, or inheritance. All four are considered equally valid, and Muslims may follow any of them."
  },
  {
    "question": "What is the primary historical origin of the Sunni-Shia division?",
    "options": ["A dispute over the interpretation of Quranic Arabic", "A disagreement over which direction to face during prayer", "A political dispute over who should lead the Muslim community after the Prophet's death", "A debate over whether music is permissible in Islam"],
    "answer": 2,
    "explanation": "The Sunni-Shia split originated as a political question of succession — whether leadership should pass by community consensus (Sunni view) or to Ali ibn Abi Talib specifically (Shia view). Over centuries this developed into distinct theological and juristic traditions."
  },
  {
    "question": "In Sufi terminology, what does 'ihsan' refer to?",
    "options": ["The five daily prayers", "Worshipping God as though you see Him — a state of spiritual excellence", "The pilgrimage to Mecca", "The formal rules of Islamic jurisprudence"],
    "answer": 1,
    "explanation": "Ihsan — often translated as 'spiritual excellence' or 'beautification' — is described in the hadith of Gabriel as 'worshipping God as though you see Him; for even if you do not see Him, He sees you.' Tasawwuf (Sufism) centers on cultivating this state of presence and proximity to God."
  }
] }
\`\`\`

---

### Reflection Questions

1. Why might the assumption that "Islam equals Arab" be misleading — and what historical or political factors may have reinforced it?
2. How does the principle of *ikhtilaf* (legitimate scholarly disagreement) challenge the idea that Islamic law is rigid or monolithic?
3. What role has Sufism played in spreading Islam across diverse cultures — and why might its emphasis on inner experience make it especially adaptable?

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Only about 20% of the world's 2 billion Muslims are Arab; the largest concentrations are in South and Southeast Asia and sub-Saharan Africa.",
  "Four major Sunni legal schools (madhahib) emerged in the 8th–9th centuries — Hanafi, Maliki, Shafi'i, and Hanbali — each valid, each adapted to different regions.",
  "The Sunni-Shia split originated as a political question of succession and developed over centuries into distinct theological and legal traditions.",
  "Tasawwuf (Sufism) is the inward, spiritual dimension of Islam — not a separate religion, but a deepening of Islamic practice focused on proximity to God.",
  "Islamic civilization has produced dramatically different cultural expressions across its geographic reach, from Mughal architecture to Indonesian gamelan to Andalusian philosophy."
] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Theological Schools Beyond Legal Madhahib", "content": "Beyond the four legal schools, Sunni Islam contains distinct **theological** (kalam) schools that address questions of God's attributes, free will, and the nature of religious knowledge:\\n\\n- **Athari** (traditionalist) — associated with the Hanbali school and later Salafi movements; holds that God's attributes should be affirmed literally without interpretation\\n- **Ash'ari** — the dominant school of classical Sunni theology, founded by Abu al-Hasan al-Ash'ari (d. 935); interprets God's attributes rationally while rejecting pure rationalism\\n- **Maturidi** — closely associated with the Hanafi school; similar to Ash'ari but gives slightly more weight to reason\\n\\nThese theological schools cross-cut the legal ones: a Hanafi Muslim might follow Maturidi theology, while another follows Ash'ari. This creates a matrix of positions that further illustrates the depth of diversity within Islam — diversity that has historically been debated vigorously but recognized as legitimate within the household of the faith." }
\`\`\`

---

**Deeper Reading**

- **Omid Safi (ed.)**, *Progressive Muslims*, Oneworld, 2003
- **Carl Ernst**, *Following Muhammad: Rethinking Islam in the Contemporary World*, University of North Carolina Press, 2003
- **John Esposito**, *The Future of Islam*, Oxford University Press, 2010`,
    },
    {
      id: "islam-interfaith",
      slug: "interfaith-dialogue",
      title: "Interfaith Dialogue & Religious Pluralism",
      content: `## Interfaith Dialogue & Religious Pluralism

<!-- voice:section_check concept="Islam's approach to other religions and interfaith engagement" -->

Islam has a long and nuanced tradition of engaging with other faiths — rooted in Quranic principles, the Prophet's example, and centuries of practical coexistence.

### Quranic Foundations for Pluralism

The Quran acknowledges religious diversity as part of God's plan:

> "Had your Lord willed, He would have made mankind one community, but they will not cease to differ."
> — Hud (11):118

> "For each of you We have prescribed a law and a method. Had God willed, He would have made you one community, but [He intended] to test you in what He has given you. So race to [all that is] good."
> — Al-Ma'idah (5):48

The Quran establishes a clear ethical principle regarding religious coercion:

> "There shall be no compulsion in religion. The right course has become clear from the wrong."
> — Al-Baqarah (2):256

### Ahl al-Kitab: The People of the Book

The Quran gives a special designation to Jews and Christians — **Ahl al-Kitab** (أهل الكتاب, "People of the Book") — recognizing them as recipients of earlier divine revelation:

> "Indeed, those who believed and those who were Jews or Christians or Sabeans — those who believed in God and the Last Day and did righteousness — will have their reward with their Lord, and no fear will there be concerning them, nor will they grieve."
> — Al-Baqarah (2):62

<!-- voice:key_insight insight="This verse is remarkable — it extends the promise of divine reward beyond Muslims to Jews, Christians, and Sabeans who believe in God, the Last Day, and do righteous deeds. While Muslim scholars have debated the exact scope of this verse, it undeniably establishes a framework for recognizing goodness in other faith communities." -->

### The Prophet's Example

Muhammad (PBUH) established several precedents for interfaith relations:

**The Constitution of Medina (622 CE):** This governance document granted Jews of Medina equal citizenship rights, religious freedom, and mutual defense obligations alongside Muslims. It established them as "one community" (ummah wahidah) in the civic sense.

**The Treaty with the Christians of Najran (631 CE):** A Christian delegation visited the Prophet's mosque in Medina. When their prayer time came, the Prophet invited them to pray in his mosque according to their own rites. He then engaged them in theological dialogue — disagreeing respectfully on the nature of Jesus while establishing a treaty of mutual respect and protection.

**Protection of monasteries and churches:** The Prophet's letters to Christian communities guaranteed protection of their places of worship, clergy, and religious practices.

### Historical Coexistence

The history of Muslim-majority societies includes extensive examples of interfaith coexistence:

- **Islamic Spain (Al-Andalus, 711-1492):** Often cited as a golden age of interfaith collaboration, where Muslim, Jewish, and Christian scholars translated Greek philosophy, advanced medicine, and created architectural marvels together. The Jewish philosopher Maimonides wrote his major works in Arabic under Muslim rule.

- **The Ottoman Millet System:** The Ottoman Empire (1299-1922) allowed religious minorities (Christians, Jews) significant autonomy in personal law, education, and religious practice.

- **Fatimid Egypt:** The Fatimid caliphs (909-1171) employed Christians and Jews in high government positions, including as viziers.

### Contemporary Interfaith Engagement

Modern Muslim interfaith initiatives include:

- **"A Common Word Between Us and You" (2007):** An open letter from 138 Muslim scholars to Christian leaders, identifying love of God and love of neighbor as shared foundations.
- **The Marrakesh Declaration (2016):** Muslim scholars from over 120 countries affirming the rights of religious minorities in Muslim-majority lands, based on the Constitution of Medina.
- **Interfaith dialogue programs** at institutions worldwide, from Al-Azhar University to the Zaytuna College.

### Reflection Questions

1. How does the Quranic verse "no compulsion in religion" shape Islam's approach to religious difference?
2. What can the Prophet's treatment of the Christian delegation from Najran teach about interfaith etiquette?
3. How does the historical record of Al-Andalus challenge narratives of inevitable religious conflict?

### Deeper Reading

- **Reza Shah-Kazemi**, *The Other in the Light of the One: The Universality of the Quran and Interfaith Dialogue*, Islamic Texts Society, 2006
- **Maria Rosa Menocal**, *The Ornament of the World: How Muslims, Jews, and Christians Created a Culture of Tolerance in Medieval Spain*, Little, Brown & Co., 2002
`,
    },
    {
      id: "islam-misconceptions",
      slug: "common-misconceptions",
      title: "Addressing Common Misconceptions",
      content: `## Addressing Common Misconceptions

<!-- voice:section_check concept="Responding to common misunderstandings about Islam with evidence and nuance" -->

Many widespread beliefs about Islam are based on incomplete information, media distortion, or the conflation of cultural practices with religious teachings. This lesson works through five persistent misconceptions using primary sources, historical evidence, and scholarly analysis — not to defend Islam uncritically, but to understand it accurately.

\`\`\`concept
{ "title": "The Core Method: Separating Source from Practice", "variant": "rule", "content": "When evaluating any religion, you must distinguish between (1) its primary texts, (2) its classical scholarly tradition, and (3) the behavior of historical and contemporary followers. Attributing a community's worst practices to its foundational ideals is like blaming a constitution for every crime committed in the nation it governs. This distinction is the analytical key for every misconception below." }
\`\`\`

---

### Misconception 1: "Islam Was Spread by the Sword"

**The nuanced reality:** Early Muslim communities did engage in military campaigns, but forced conversion is both historically inaccurate and theologically prohibited.

> "There shall be no compulsion in religion."
> — Al-Baqarah (2):256

The clearest counter-evidence is geography. **Southeast Asia** is the world's most populous Muslim region — Indonesia alone has over 250 million Muslims — yet it was never conquered by Muslim armies. Islam spread there through merchants, scholars, and Sufi teachers. The same pattern holds for sub-Saharan West Africa and much of Central Asia.

Historian Ira Lapidus documented that even in territories Muslims did conquer militarily, conversion typically unfolded over **centuries**, driven by social, economic, and spiritual factors, not coercion. Non-Muslim communities — Christians, Jews, Zoroastrians — retained their own courts, schools, and places of worship under Muslim governance for generations.

\`\`\`callout
{ "type": "info", "title": "The Dhimmi System", "content": "Non-Muslim subjects under Muslim rule held the status of *dhimmis* — protected peoples guaranteed security of life, property, and religious practice in exchange for a tax (jizya). This system varied in practice and had real limitations, but it reflects a legal framework premised on coexistence rather than eradication. Jewish communities that had been expelled from Western Europe often found refuge in Muslim-ruled territories during the same period." }
\`\`\`

---

### Misconception 2: "Islam Oppresses Women"

This misconception conflates cultural patriarchy — which exists in many Muslim-majority societies and is explicitly condemned by Islamic scholars — with Islamic religious teaching. The two are not the same.

\`\`\`tabs
{ "tabs": [
  { "label": "Quranic Rights", "icon": "📖", "content": "The Quran established specific legal rights for women in 7th-century Arabia that predated equivalent Western recognition by centuries:\\n\\n- **Right to own and inherit property** — An-Nisa (4):7, 11–12\\n- **Right to consent to marriage** — no valid *nikah* contract without the bride's agreement\\n- **Right to initiate divorce** (*khul'*) — Al-Baqarah (2):229\\n- **Right to seek education** — \\"Seeking knowledge is an obligation upon every Muslim\\" (Ibn Majah 224)\\n- **Full legal personhood** — women could sue, testify, and conduct business\\n\\n> \\"Whoever does righteousness, whether male or female, while being a believer — those will enter Paradise and will not be wronged even as much as the speck on a date seed.\\"\\n> — An-Nisa (4):124\\n\\nFor comparison, English common law did not grant married women the right to own property independently until the Married Women's Property Act of 1870." },
  { "label": "Historical Role", "icon": "🏛️", "content": "The historical record shows women in positions of significant religious and intellectual authority from Islam's earliest years:\\n\\n- **Khadijah**, the Prophet's first wife, was a successful entrepreneur who employed the Prophet before their marriage\\n- **Aisha**, the Prophet's wife, narrated over 2,000 hadith and was consulted on legal questions by the most senior male companions — scholars traveled from distant cities to learn from her\\n- **Fatima al-Fihri** founded the University of al-Qarawiyyin in Fez (859 CE), considered the world's oldest continuously operating university\\n- The Prophet said: \\"Women are the twin halves of men\\" — Sunan Abu Dawud, Book 1, Hadith 236\\n\\nThese figures were not exceptions quietly tolerated — they were authorities publicly acknowledged." },
  { "label": "Culture vs. Religion", "icon": "⚖️", "content": "Practices sometimes attributed to Islam that are in fact cultural or explicitly condemned by Islamic scholars:\\n\\n| Practice | Islamic Scholarly Verdict |\\n|---|---|\\n| Female Genital Mutilation | No basis in Quran or authentic Sunnah; condemned by Al-Azhar and most major scholarly bodies |\\n| Honor Killing | Classified as murder (*haram*); carries criminal penalty under Islamic law |\\n| Denial of Education to Girls | Directly contradicts the Prophetic obligation to seek knowledge |\\n| Forced Marriage | Invalidates the marriage contract; the bride's consent is a legal requirement |\\n\\nJohn Esposito (*The Future of Islam*, 2010) notes that reform movements within Islam have consistently appealed to the Quran and Prophetic tradition as the basis for challenging patriarchal cultural norms — not as an obstacle to reform, but as its justification." }
] }
\`\`\`

---

### Misconception 3: "Jihad Means Holy War"

The Arabic word **jihad** (جهاد) literally means "struggle" or "striving." Islamic scholarship has consistently identified multiple dimensions of jihad, of which armed conflict is the most regulated and most restricted category.

| Type | Description | Status in Islamic Scholarship |
|------|-------------|-------------------------------|
| **Jihad al-nafs** | Struggle against one's own ego and desires | Called "the greater jihad" by scholars |
| **Jihad of knowledge** | Seeking and spreading beneficial knowledge | Highly emphasized in Quran and Sunnah |
| **Jihad of speech** | Speaking truth to power | A Prophetic virtue |
| **Armed jihad** | Military defense when the community is attacked | Heavily regulated; strict rules of engagement |

The Prophet, returning from a military campaign, told his companions: *"We have returned from the lesser jihad to the greater jihad — the jihad against the self."* — Reported by al-Bayhaqi.

\`\`\`callout
{ "type": "success", "title": "Islamic Laws of Armed Conflict — Over a Millennium Before the Geneva Conventions", "content": "The first caliph Abu Bakr's instructions to his army (c. 632 CE) included:\\n\\n*'Do not kill a woman, a child, or an elderly person. Do not cut down fruit-bearing trees. Do not destroy buildings.'*\\n— Muwatta Imam Malik, Book 21, Hadith 10\\n\\nClassical Islamic jurisprudence also prohibited: killing non-combatants, destroying crops, targeting religious clergy, mutilating the dead, and forced conversion. The First Geneva Convention was signed in 1864 — over 1,200 years later. This historical record is relevant when evaluating claims about Islam's relationship to violence." }
\`\`\`

---

### Misconception 4: "Islam and Science Are Incompatible"

The historical record not only contradicts this claim — it inverts it. From roughly 800 to 1200 CE, the Islamic world was the global center of scientific inquiry, translating and dramatically expanding upon Greek, Persian, and Indian knowledge.

\`\`\`tabs
{ "tabs": [
  { "label": "Foundational Figures", "icon": "🔬", "content": "- **Al-Khwarizmi** (d. c. 850) — developed algebra; the word derives from his book *Al-Jabr*; the word \\"algorithm\\" derives from his Latinized name *Algoritmi*\\n- **Ibn al-Haytham** (d. 1040) — pioneered the scientific method through experimental verification; his *Book of Optics* directly influenced Roger Bacon, Kepler, and Descartes\\n- **Ibn Sina** (Avicenna, d. 1037) — wrote *The Canon of Medicine*, the standard European medical textbook for over 500 years\\n- **Al-Zahrawi** (d. 1013) — the father of modern surgery; his illustrated surgical manual was used in European medical schools into the 17th century\\n- **Al-Idrisi** (d. 1165) — produced some of the most accurate world maps of the medieval period, commissioned by the Norman King Roger II of Sicily\\n\\nGeorge Saliba (*Islamic Science and the Making of the European Renaissance*, MIT Press, 2007) argues that Islamic scientific contributions were not merely a relay from ancient Greece but involved substantial original development." },
  { "label": "The Quranic Mandate", "icon": "📖", "content": "The Quran contains over 750 verses urging observation of the natural world — far exceeding verses on legal matters. Scholars have cited this as the theological foundation for Islamic scientific culture:\\n\\n> *'Say: Are those who know equal to those who do not know?'*\\n> — Az-Zumar (39):9\\n\\n> *'Do they not look into the realm of the heavens and the earth and everything that Allah has created?'*\\n> — Al-A'raf (7):185\\n\\nThe hadith \\"Seek knowledge, even unto China\\" (attributed to the Prophet) captured an intellectual ethos that drove the vast 8th–9th century translation movement, in which Greek, Persian, and Sanskrit texts were rendered into Arabic and then extended. Baghdad's House of Wisdom (*Bayt al-Hikma*) at its height employed scholars of multiple faiths working side by side." }
] }
\`\`\`

---

### Misconception 5: "Sharia Is Barbaric Medieval Law"

The word **Sharia** (شريعة) literally means "path to water" — a metaphor for the path to life and flourishing. Knowing what Sharia actually encompasses fundamentally changes the analysis.

\`\`\`collapse
{ "title": "Deep Dive: What Sharia Actually Covers", "content": "Sharia is not a single codified law book. It is a body of jurisprudence developed over 1,400 years by scholars across multiple legal schools (*madhabs*). Its scope is far broader than criminal law:\\n\\n**Personal worship (*Ibadat*) — the largest portion:**\\n- The Five Pillars: prayer, fasting, zakat, Hajj, shahada\\n- Personal purity and dietary guidelines\\n- Ethical conduct in daily life\\n\\n**Family and civil law (*Muamalat*):**\\n- Marriage, divorce, child custody\\n- Inheritance rules\\n- Commercial contracts and prohibition of exploitation (*riba*, usury)\\n- Property rights and neighborly obligations\\n\\n**Criminal law (*Hudud*) — a small fraction:**\\n- Fixed penalties for specific crimes\\n- Extremely strict evidentiary requirements (e.g., four witnesses for adultery) that classical jurists acknowledged made actual application rare by design\\n- Many classical scholars argued Hudud penalties function primarily as deterrents\\n\\n**The *maqasid al-sharia* (objectives of Islamic law):**\\nClassical scholars systematized five core objectives Sharia is meant to protect: life, intellect, lineage, property, and religion. Any ruling that undermines these objectives is considered invalid — giving the tradition an internal mechanism for principled reform.\\n\\n**Diversity across Muslim-majority states:**\\nCountries range from secular Turkey (which removed Sharia from its legal code in 1924) to Saudi Arabia (which applies a conservative interpretation of Hanbali fiqh). There is no single unified \\"Sharia state\\" — there are four major Sunni legal schools and distinct Shia jurisprudence, each producing different rulings on the same questions." }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Sharia as a Tradition of Debate", "content": "Tariq Ramadan (*Western Muslims and the Future of Islam*, 2004) argues that classical Sharia scholarship was never static — jurists continuously adapted rulings to new contexts through *ijtihad* (independent legal reasoning). The diversity of positions across the four Sunni madhabs on any given question illustrates that disagreement and contextual adaptation have always been built into the tradition. Treating any single modern government's implementation as 'Sharia' flattens 1,400 years of active scholarly debate." }
\`\`\`

---

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  { "question": "Which region is most often cited as evidence that Islam was not spread primarily by military conquest?", "options": ["The Arabian Peninsula, where Islam originated", "Southeast Asia and sub-Saharan West Africa", "The Levant and Mesopotamia, conquered in the 7th century", "North Africa and Iberia"], "answer": 1, "explanation": "Southeast Asia — particularly Indonesia, the world's largest Muslim-majority country — and sub-Saharan West Africa became Muslim predominantly through trade and scholarly contact, never through military conquest. This directly contradicts the 'spread by the sword' narrative." },
  { "question": "What does the Arabic word 'jihad' literally mean?", "options": ["Holy war", "Sacred military duty", "Struggle or striving", "Defense of the faith"], "answer": 2, "explanation": "Jihad literally means 'struggle' or 'striving.' Classical scholarship identifies jihad al-nafs (struggle against the ego) as the greater jihad, while armed conflict is a heavily regulated lesser category with strict prohibitions on harming civilians." },
  { "question": "Which Quranic verse directly prohibits forced conversion?", "options": ["An-Nisa (4):124 — equal reward for men and women", "Al-Baqarah (2):256 — 'There shall be no compulsion in religion'", "Az-Zumar (39):9 — 'Are those who know equal to those who do not know?'", "Al-A'raf (7):185 — reflection on creation"], "answer": 1, "explanation": "Al-Baqarah (2):256 — 'There shall be no compulsion in religion' — is the primary Quranic basis for the prohibition on forced conversion. It is among the most cited verses in discussions of religious freedom in Islamic thought." },
  { "question": "What does the word 'Sharia' literally mean in Arabic?", "options": ["Divine commandment", "Sacred punishment", "Path to water", "Islamic criminal code"], "answer": 2, "explanation": "Sharia literally means 'path to water' — a metaphor for the path to life and flourishing. This etymology reflects that Sharia was conceived as guidance toward human wellbeing. The majority of Sharia covers personal worship, ethics, and civil law, not criminal punishments." },
  { "question": "Which Muslim scholar is credited with pioneering the experimental scientific method and the field of optics?", "options": ["Al-Khwarizmi, who developed algebra", "Ibn Sina, who wrote the Canon of Medicine", "Ibn al-Haytham, whose Book of Optics influenced Kepler and Descartes", "Al-Zahrawi, the father of modern surgery"], "answer": 2, "explanation": "Ibn al-Haytham (d. 1040) pioneered the scientific method through experimental verification in his Book of Optics, which directly influenced European scientists including Roger Bacon, Kepler, and Descartes. Each of the other figures listed also made foundational contributions to science." }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Distinguishing between a religion's primary texts, its scholarly tradition, and the behavior of its followers is the foundational analytical skill for studying any religious tradition accurately.",
  "Islam spread predominantly through trade and scholarship in the world's largest Muslim regions; the Quran explicitly prohibits forced conversion — 'There shall be no compulsion in religion' (Al-Baqarah 2:256).",
  "Jihad has multiple dimensions — the 'greater jihad' is the internal struggle against the ego; armed conflict is the most restricted form, governed by rules predating the Geneva Conventions by over a millennium.",
  "Islamic civilization produced foundational work in algebra, optics, medicine, and surgery between 800–1200 CE; scholars like Al-Khwarizmi and Ibn al-Haytham directly shaped the European Renaissance.",
  "Sharia covers primarily personal worship, ethics, and family law — criminal law is a small fraction; four major Sunni legal schools and Shia jurisprudence represent 1,400 years of active scholarly debate and contextual adaptation." ]
}
\`\`\`

---

### Deeper Reading

- **John Esposito**, *The Future of Islam*, Oxford University Press, 2010
- **Tariq Ramadan**, *Western Muslims and the Future of Islam*, Oxford University Press, 2004
- **George Saliba**, *Islamic Science and the Making of the European Renaissance*, MIT Press, 2007`,
    },
    {
      id: "islam-modern-checkpoint",
      slug: "modern-world-checkpoint",
      title: "Checkpoint: Islam in the Modern World",
      content: `## Checkpoint: Islam in the Modern World

Nice work — you have explored the diversity of global Islam, the tradition of interfaith dialogue, and the most common misconceptions the tradition faces today. This checkpoint consolidates those threads into a single review before the final module.

\`\`\`concept
{ "title": "What You Have Covered", "variant": "mental-model", "content": "Three interlocking ideas define this module:\\n\\n1. **Diversity** — Islam's 1.8 billion adherents span every continent, ethnicity, and legal tradition. No single culture owns it.\\n2. **Dialogue** — The Quran itself establishes a theological mandate for coexistence. The Constitution of Medina (622 CE) gave it political form.\\n3. **Misconception vs. Reality** — Terms like *jihad* and *sharia* carry meanings in classical scholarship that differ sharply from their portrayal in popular media." }
\`\`\`

---

\`\`\`quiz
{
  "title": "Islam in the Modern World — Knowledge Check",
  "questions": [
    {
      "question": "Approximately what percentage of the world's Muslims are Arab?",
      "options": ["80%", "50%", "20%", "5%"],
      "answer": 2,
      "explanation": "Only about 20% of the world's Muslims are Arab. The largest Muslim-majority country is Indonesia in Southeast Asia, reflecting how deeply Islam took root far beyond the Arabian Peninsula."
    },
    {
      "question": "What does the word \\"jihad\\" literally mean in Arabic?",
      "options": ["Holy war", "Terrorism", "Struggle or striving", "Conquest"],
      "answer": 2,
      "explanation": "Jihad means 'struggle' or 'striving.' The Prophet described the struggle against one's own ego (jihad al-nafs) as 'the greater jihad,' while armed defense is called 'the lesser jihad' and is subject to strict rules of engagement."
    },
    {
      "question": "Which Quranic verse explicitly states there shall be no compulsion in religion?",
      "options": ["Al-Fatiha (1):1", "Al-Baqarah (2):256", "Al-Imran (3):64", "An-Nisa (4):1"],
      "answer": 1,
      "explanation": "Al-Baqarah (2):256 states: 'There shall be no compulsion in religion.' This is one of the clearest Quranic principles and is foundational to Islamic interfaith ethics."
    },
    {
      "question": "Which of the following was NOT one of the four classical Sunni schools of law (madhahib)?",
      "options": ["Hanafi", "Maliki", "Ismaili", "Hanbali"],
      "answer": 2,
      "explanation": "The four Sunni madhahib are Hanafi, Maliki, Shafi'i, and Hanbali. Ismaili refers to a branch of Shia Islam, not a Sunni legal school. All four madhahib agree on fundamentals while differing on secondary legal matters — and all are considered equally valid."
    },
    {
      "question": "What was the primary significance of the Constitution of Medina (622 CE) for interfaith relations?",
      "options": [
        "It converted all residents of Medina to Islam",
        "It granted Jews equal citizenship, religious freedom, and mutual defense rights alongside Muslims",
        "It established Arabic as the sole language of governance",
        "It prohibited non-Muslims from entering Medina"
      ],
      "answer": 1,
      "explanation": "The Constitution of Medina recognized non-Muslims as members of the same civic community (ummah wahidah), providing a practical early framework for interfaith coexistence and civic pluralism."
    }
  ]
}
\`\`\`

---

\`\`\`tabs
{
  "tabs": [
    {
      "label": "The Four Madhahib",
      "icon": "⚖️",
      "content": "The four Sunni schools of Islamic law emerged in the 8th–9th centuries CE and have coexisted as equally valid paths ever since:\\n\\n| School | Founder | Geographic Stronghold |\\n|--------|---------|----------------------|\\n| **Hanafi** | Imam Abu Hanifa (d. 767) | Turkey, Central Asia, South Asia |\\n| **Maliki** | Imam Malik ibn Anas (d. 795) | North & West Africa |\\n| **Shafi'i** | Imam al-Shafi'i (d. 820) | East Africa, Southeast Asia |\\n| **Hanbali** | Imam Ahmad ibn Hanbal (d. 855) | Arabian Peninsula |\\n\\nAll four agree on core theology and the five pillars. Differences arise on secondary legal questions — the direction of folded hands in prayer, the exact timing of breaking fast, inheritance calculations, and similar matters. A Muslim may follow any school without being considered deviant by the others."
    },
    {
      "label": "Misconceptions Corrected",
      "icon": "🔍",
      "content": "| Misconception | Classical Understanding |\\n|--------------|------------------------|\\n| *Jihad* = holy war | *Jihad* = struggle/striving; the Prophet called self-discipline 'the greater jihad' |\\n| Islam spread only by the sword | The Quran explicitly forbids compulsion in religion (2:256); trade, scholarship, and Sufi missionaries drove much of Islam's spread |\\n| Muslims are mostly Arab | ~80% of Muslims are non-Arab; the largest Muslim country is Indonesia |\\n| Sharia is a fixed legal code | Sharia is a broad ethical framework; *fiqh* (jurisprudence) is the human interpretation, which varies across schools and centuries |"
    },
    {
      "label": "Medieval Scholars",
      "icon": "🔭",
      "content": "The Islamic Golden Age (roughly 8th–13th centuries CE) produced scholarship that shaped European science and medicine:\\n\\n- **Al-Khwarizmi** — Developed algebra; the word *algorithm* derives from his name\\n- **Ibn al-Haytham** — Pioneered the scientific method and modern optics (*Kitab al-Manazir*)\\n- **Ibn Sina** — Wrote *The Canon of Medicine*, used as a university textbook in Europe for 500 years\\n- **Al-Zahrawi** — Considered the father of modern surgery; invented over 200 surgical instruments\\n- **Al-Idrisi** — Created remarkably accurate world maps for King Roger II of Sicily\\n\\nThese figures worked across religious lines, translating Greek, Persian, and Indian texts and building on them — an early model of cross-civilizational scholarship."
    }
  ]
}
\`\`\`

---

\`\`\`collapse
{ "title": "Deep Dive: The Constitution of Medina", "content": "The Constitution of Medina (*Sahifat al-Madinah*), established in 622 CE, is one of the earliest written constitutional documents in history. It formalized agreements between the Muslim emigrants from Mecca (Muhajirun), the Muslim residents of Medina (Ansar), and the Jewish tribes of Medina.\\n\\nKey provisions relevant to interfaith relations:\\n\\n- The document declares all signatories — Muslim and Jewish alike — to form **one community (ummah wahidah)**.\\n- Jews of the Banu Awf and other tribes are explicitly recognized as **a people along with the believers**, with their religion protected.\\n- Each group retains its own religion and internal governance.\\n- All parties share collective defense obligations against external attack.\\n- Disputes are to be referred to **God and the Prophet** — establishing a rule-of-law rather than arbitrary power.\\n\\nFor contemporary Muslim scholars like Tariq Ramadan, the Constitution of Medina is not merely historical curiosity — it is a living precedent for how Muslims can participate as full citizens in pluralist states while maintaining their religious identity." }
\`\`\`

---

### Voice Summary

Before moving to the final module, take two minutes to explain aloud — in your own words — the following three points. Speaking concepts out loud is one of the most effective ways to find gaps in your understanding:

1. **Diversity** — How does the global demographic reality of Islam (geography, ethnicity, legal schools) challenge the idea of a monolithic "Muslim world"?
2. **Dialogue** — What is Islam's theological basis for interfaith coexistence? Cite at least one Quranic verse or historical example.
3. **Misconception** — Choose one common misconception about Islam and walk through the evidence — textual, historical, or demographic — that corrects it.

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Only ~20% of the world's Muslims are Arab; the largest Muslim-majority nation is Indonesia — diversity is the norm, not the exception.",
    "The four Sunni legal schools (Hanafi, Maliki, Shafi'i, Hanbali) represent legitimate pluralism within Islamic jurisprudence — all are considered equally valid.",
    "Jihad means 'struggle or striving'; the Prophet prioritized inner spiritual struggle (jihad al-nafs) as 'the greater jihad.'",
    "Al-Baqarah (2):256 — 'There shall be no compulsion in religion' — is the Quranic foundation for Islamic interfaith ethics.",
    "The Constitution of Medina (622 CE) established one of history's earliest multi-faith civic frameworks, granting Jews equal citizenship and religious freedom alongside Muslims."
  ]
}
\`\`\`

Almost there. In the final module you will bring everything together in a personal reflection on what Islam's history and contemporary reality mean for your own understanding of the tradition.`,
    },
  ],
};

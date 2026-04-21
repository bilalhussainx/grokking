import { Module } from "../types";

export const faithImanModule: Module = {
  id: "islam-faith-iman",
  title: "Faith (Iman)",
  description: "Explore the six articles of Islamic faith: belief in God, angels, divine books, prophets, the Day of Judgment, and divine predestination. Understand how creed (aqidah) shapes the Muslim worldview. Resources: Abu Hamid al-Ghazali, The Foundations of Islamic Belief; Tim Winter, The Cambridge Companion to Classical Islamic Theology.",
  lessons: [
    {
      id: "islam-iman-overview",
      slug: "iman-overview",
      title: "Iman: The Six Articles of Faith",
      content: `## Iman: The Six Articles of Faith

<!-- voice:section_check concept="Overview of Iman and the six articles of faith" -->

While the **Five Pillars** define what Muslims *do*, the **Six Articles of Faith** (Arkan al-Iman, أركان الإيمان) define what Muslims *believe*. Together, these form the creed (aqidah, عقيدة) of Islam.

The famous **Hadith of Jibril** records the angel Gabriel visiting the Prophet in human form and asking about Islam, Iman, and Ihsan. When asked about Iman, the Prophet answered:

> "That you believe in God, His angels, His books, His messengers, the Last Day, and divine predestination — both its good and its evil."
> — Sahih Muslim, Book 1, Hadith 1

### The Three Dimensions of the Faith

This hadith is foundational because it establishes three **concentric levels** of the religion:

| Level | Arabic | Meaning | Focus |
|-------|--------|---------|-------|
| **Islam** | إسلام | Submission | Outward practice (the Five Pillars) |
| **Iman** | إيمان | Faith | Inward belief (the Six Articles) |
| **Ihsan** | إحسان | Excellence/Beauty | Spiritual perfection ("to worship God as though you see Him") |

<!-- voice:key_insight insight="Islam, Iman, and Ihsan are not separate religions — they are three dimensions of one faith. A Muslim ideally embodies all three: correct practice (Islam), sincere belief (Iman), and spiritual excellence (Ihsan). This framework shapes the entire structure of Islamic learning." -->

### The Six Articles at a Glance

| Article | Arabic | Core Belief |
|---------|--------|------------|
| 1. God | Allah (الله) | One God, without partner, creator of all |
| 2. Angels | Mala'ikah (ملائكة) | Created beings of light who carry out God's commands |
| 3. Divine Books | Kutub (كتب) | Scriptures revealed to various prophets |
| 4. Prophets | Rusul (رسل) | Messengers sent to every nation |
| 5. The Last Day | Yawm al-Akhir (يوم الآخر) | Resurrection, judgment, and the afterlife |
| 6. Predestination | Qadar (قدر) | God's knowledge and decree over all things |

### The Six Articles Visualized

The articles of faith form a comprehensive belief system rooted in the oneness of God:

\`\`\`mermaid
graph TD
    A[Iman Faith] --> B[Allah God]
    A --> C[Mala_ikah Angels]
    A --> D[Kutub Divine Books]
    A --> E[Rusul Prophets]
    A --> F[Yawm al-Akhir Day of Judgment]
    A --> G[Qadar Divine Decree]
\`\`\`

### Iman Is More Than Intellectual Assent

Islamic scholars emphasize that iman is not merely mental agreement with a list of propositions. The classical definition states:

**Iman is:**
- **Conviction in the heart** (tasdiq bil-qalb, تصديق بالقلب)
- **Affirmation by the tongue** (iqrar bil-lisan, إقرار باللسان)
- **Action by the limbs** (amal bil-arkan, عمل بالأركان)

The Prophet said: "Faith has sixty-odd branches. The highest is the declaration 'there is no god but God.' The lowest is removing something harmful from the road. And modesty is a branch of faith." — Sahih Muslim, Book 1, Hadith 58

This means faith is not static — it is a living, active quality that **increases and decreases** based on one's actions, knowledge, and spiritual state.

### Reflection Questions

1. How does the three-level framework (Islam, Iman, Ihsan) compare to other religious traditions that distinguish between practice, belief, and spiritual depth?
2. Why might Islamic theology insist that faith must include action, not just belief?
3. What does it mean for faith to "increase and decrease"?

### Deeper Reading

- **Abu Hamid al-Ghazali**, *The Foundations of Islamic Belief (Qawaid al-Aqaid)*, from *Ihya Ulum al-Din*
- **Tim Winter (ed.)**, *The Cambridge Companion to Classical Islamic Theology*, Cambridge University Press, 2008
`,
    },
    {
      id: "islam-god-angels-books",
      slug: "god-angels-books",
      title: "Belief in God, Angels & Divine Books",
      content: `## Belief in God, Angels & Divine Books

<!-- voice:section_check concept="The first three articles of faith — God, angels, and revealed scriptures" -->

### Article 1: Belief in God (Allah, الله)

The Arabic word **Allah** is not a name exclusive to Islam — Arabic-speaking Christians and Jews also use it. It literally means "The God" (al-ilah, الإله). Muslim theology emphasizes:

**God's Oneness (Tawhid):**
> "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent."
> — Al-Ikhlas (112):1-4

Scholars categorize Tawhid into three dimensions:

| Dimension | Arabic | Meaning |
|-----------|--------|---------|
| **Lordship** | Tawhid al-Rububiyyah (ربوبية) | God alone is the Creator, Sustainer, and Sovereign |
| **Worship** | Tawhid al-Uluhiyyah (ألوهية) | God alone deserves worship |
| **Names & Attributes** | Tawhid al-Asma' wal-Sifat (أسماء وصفات) | God's attributes are unique and incomparable |

**God's Names (al-Asma al-Husna, الأسماء الحسنى):**
The Quran and hadith mention **99 Beautiful Names** of God, each expressing an attribute:

> "And to Allah belong the most beautiful names, so invoke Him by them."
> — Al-Araf (7):180

Examples: **Ar-Rahman** (الرحمن, the Most Merciful), **Al-Hakim** (الحكيم, the All-Wise), **Al-Wadud** (الودود, the Most Loving), **Al-Adl** (العدل, the Just), **As-Salam** (السلام, the Source of Peace).

<!-- voice:key_insight insight="Islamic theology holds that God is both transcendent (beyond human comprehension) and immanent (closer than your jugular vein). The 99 Names reveal aspects of God's nature — but no name, and no human concept, can fully encompass the divine reality." -->

### Article 2: Belief in Angels (Mala'ikah, ملائكة)

Angels are **created beings made of light** (nur, نور) who serve God without free will. They do not eat, drink, or sleep. Key angels include:

| Angel | Arabic | Role |
|-------|--------|------|
| **Jibril** | جبريل | Delivering revelation to prophets |
| **Mika'il** | ميكائيل | Overseeing provision and sustenance |
| **Israfil** | إسرافيل | Blowing the trumpet on the Day of Judgment |
| **Izra'il** | عزرائيل | The angel of death (Malak al-Mawt) |
| **Kiraman Katibin** | كراما كاتبين | The "noble scribes" — recording every deed |
| **Munkar & Nakir** | منكر ونكير | Questioning the soul in the grave |

The Quran describes angels as messengers with wings:

> "Praise be to God, Creator of the heavens and the earth, who made the angels messengers having wings — two, three, or four."
> — Fatir (35):1

### Article 3: Belief in Divine Books (Kutub, كتب)

Muslims believe God sent **scriptures** (kutub, كتب) to various prophets throughout history:

| Scripture | Arabic | Prophet | Status in Islam |
|-----------|--------|---------|----------------|
| **Scrolls** | Suhuf (صحف) | Ibrahim (Abraham) | Lost to history |
| **Torah** | Tawrat (توراة) | Musa (Moses) | Original considered divine; current text seen as altered |
| **Psalms** | Zabur (زبور) | Dawud (David) | Original considered divine; current text seen as altered |
| **Gospel** | Injil (إنجيل) | Isa (Jesus) | Original considered divine; current text seen as altered |
| **Quran** | Qur'an (قرآن) | Muhammad | The final, preserved revelation |

The Quran affirms and supersedes all previous scriptures:

> "And We have revealed to you the Book in truth, confirming that which preceded it of the Scripture and as a criterion over it."
> — Al-Ma'idah (5):48

### Reflection Questions

1. How does the concept of the 99 Names balance God's transcendence with His accessibility?
2. What role do angels play in establishing moral accountability (think about the "noble scribes")?
3. How does Islam's view of previous scriptures differ from how Judaism and Christianity view the Torah and New Testament?

### Deeper Reading

- **Al-Ghazali**, *The Ninety-Nine Beautiful Names of God*, trans. David Burrell & Nazih Daher, Islamic Texts Society, 1992
- **Sachiko Murata**, *The Tao of Islam*, SUNY Press, 1992 — Explores divine attributes in Islamic thought.
`,
    },
    {
      id: "islam-prophets-judgment-qadar",
      slug: "prophets-judgment-qadar",
      title: "Prophets, the Last Day & Predestination",
      content: `## Prophets, the Last Day & Predestination

<!-- voice:section_check concept="Belief in prophets, the Day of Judgment, and divine predestination" -->

### Article 4: Belief in Prophets (Anbiya, أنبياء / Rusul, رسل)

Muslims believe God sent **prophets to every nation** throughout history:

> "And We certainly sent into every nation a messenger, [saying], 'Worship God and avoid false gods.'"
> — An-Nahl (16):36

Islamic tradition mentions **25 prophets by name** in the Quran, while a hadith states that God sent approximately 124,000 prophets in total (Musnad Ahmad, Hadith 21257). The Quran commands Muslims to make **no distinction** between them in terms of belief:

> "We make no distinction between any of His messengers."
> — Al-Baqarah (2):285

Key prophets in Islam include:

| Prophet | Arabic | Significance |
|---------|--------|-------------|
| **Adam** | آدم | First human and first prophet |
| **Nuh (Noah)** | نوح | Survivor of the flood, preacher of patience |
| **Ibrahim (Abraham)** | إبراهيم | Father of monotheism, builder of the Kaaba |
| **Musa (Moses)** | موسى | Received the Torah, liberated the Israelites |
| **Isa (Jesus)** | عيسى | Born of a virgin, performed miracles, will return before the end times |
| **Muhammad** | محمد | The final prophet — the "Seal of the Prophets" (Khatam al-Nabiyyin) |

**Jesus in Islam:** Muslims revere Isa (Jesus) as one of the greatest prophets. The Quran affirms his virgin birth, his miracles (healing the blind, raising the dead), and his role as the Messiah. However, Islam denies the crucifixion (holding that God raised Jesus to heaven) and rejects the Trinity — maintaining that Jesus was a prophet, not divine.

> "The Messiah, Jesus son of Mary, was but a messenger of God and His word which He directed to Mary and a soul from Him."
> — An-Nisa (4):171

<!-- voice:key_insight insight="Muhammad is considered the Seal of the Prophets (Khatam al-Nabiyyin) — the final messenger completing the chain of revelation. This means no new prophet will come after him, and the Quran is the final divine scripture. This belief shapes Islam's self-understanding as the completion of the Abrahamic tradition." -->

### Article 5: Belief in the Last Day (Yawm al-Qiyamah, يوم القيامة)

The Quran is vivid and emphatic about the Day of Judgment. It is described as:
- A day when the earth will be shaken violently (Az-Zalzalah, 99:1)
- When every person's deeds will be weighed on a **Scale** (Mizan, ميزان) (Al-Anbiya, 21:47)
- When each person will receive their **Book of Deeds** — in the right hand (success) or left hand/behind the back (failure) (Al-Inshiqaq, 84:7-12)
- When people will cross the **Bridge** (Sirat, صراط) over Hellfire
- Ultimately, assignment to **Paradise** (Jannah, جنة) or **Hellfire** (Jahannam, جهنم)

The Quran describes Jannah in vivid terms:

> "And give good tidings to those who believe and do righteous deeds that they will have gardens beneath which rivers flow."
> — Al-Baqarah (2):25

The greatest reward, however, is not material:

> "For those who have done good is the best [reward] — and extra."
> — Yunus (10):26

Scholars interpret "the extra" (ziyadah, زيادة) as the **beatific vision** — seeing the Face of God — which surpasses every pleasure of Paradise.

### Article 6: Belief in Predestination (Qadar, قدر)

This is perhaps the most philosophically complex article of faith. Muslims believe that:

1. **God's Knowledge** (Ilm, علم): God knows everything — past, present, and future
2. **God's Recording** (Kitabah, كتابة): Everything is written in the Preserved Tablet (al-Lawh al-Mahfuz)
3. **God's Will** (Mashi'ah, مشيئة): Nothing happens without God's permission
4. **God's Creation** (Khalq, خلق): God is the creator of all things, including human actions

Yet — and this is the critical theological balance — **humans have free will** (ikhtiyar, اختيار) and are accountable for their choices. The Quran states both:

> "And you do not will except that Allah wills."
> — Al-Insan (76):30

And:

> "Indeed, We guided him to the way, whether he is grateful or ungrateful."
> — Al-Insan (76):3

The Prophet advised: "Tie your camel, then trust in God" — Sunan al-Tirmidhi, Book 36, Hadith 2517. This beautifully captures the balance: take practical action (tie the camel), then trust the outcome to God (tawakkul, توكل).

### Reflection Questions

1. How does Islam's view of Jesus compare to Christianity's? What is shared, and what diverges?
2. How does belief in the Day of Judgment function as a moral motivator?
3. Can you reconcile predestination with free will? How do Muslims navigate this tension?

### Deeper Reading

- **Seyyed Hossein Nasr**, *Islamic Philosophy from Its Origin to the Present*, SUNY Press, 2006
- **Binyamin Abrahamov**, *Islamic Theology: Traditionalism and Rationalism*, Edinburgh University Press, 1998
`,
    },
    {
      id: "islam-iman-checkpoint",
      slug: "iman-checkpoint",
      title: "Checkpoint: Faith (Iman)",
      content: `## Checkpoint: Faith (Iman)

Nice work! You have explored all six articles of Islamic faith. Let us review the key beliefs that shape the Muslim worldview.

### Quiz

**1. What is the difference between Islam, Iman, and Ihsan?**

*Short Answer:* Islam refers to outward practice (the Five Pillars). Iman refers to inward belief (the Six Articles of Faith). Ihsan refers to spiritual excellence — "to worship God as though you see Him, and if you cannot see Him, know that He sees you." These are three concentric dimensions of one faith, not separate categories.

---

**2. List the six articles of faith (Arkan al-Iman).**

**Answer:**
1. Belief in God (Allah)
2. Belief in Angels (Mala'ikah)
3. Belief in Divine Books (Kutub)
4. Belief in Prophets (Rusul)
5. Belief in the Last Day (Yawm al-Akhir)
6. Belief in Divine Predestination (Qadar)

---

**3. True or False: Muslims believe Jesus (Isa) was crucified and resurrected.**

**Answer: False.** Muslims revere Jesus as one of the greatest prophets and affirm his virgin birth and miracles. However, Islam teaches that God raised Jesus to heaven and that he was not crucified. Muslims also reject the divinity of Jesus and the concept of the Trinity.

---

**4. What are the 99 Names of God?**

- a) 99 different gods that Muslims worship
- b) 99 attributes of the one God, revealed in the Quran and Hadith
- c) 99 Arabic prayers recited during Hajj
- d) 99 chapters of the Quran

**Answer: b)** The 99 Beautiful Names (al-Asma al-Husna) are attributes of the one God — such as The Merciful, The Just, The All-Knowing — each revealing a dimension of the divine nature.

---

**5. How do Muslims reconcile divine predestination (Qadar) with human free will?**

*Short Answer:* Muslims believe that God knows and decrees all things, yet humans have genuine free will (ikhtiyar) and are morally accountable for their choices. The Prophet's advice — "Tie your camel, then trust in God" — captures this balance: take responsible action while trusting the outcome to God's wisdom. The Quran affirms both God's sovereignty and human responsibility.

---

**6. What is the role of the "noble scribes" (Kiraman Katibin)?**

- a) They compile the Quran into a book
- b) They record every deed of every human being
- c) They deliver revelation to the prophets
- d) They guard the gates of Paradise

**Answer: b)** The Kiraman Katibin are two angels assigned to each person who record all of their deeds — good and bad — which will be presented on the Day of Judgment.

---

### Voice Summary

Take a moment to explain aloud, in your own words:
- The three dimensions of faith (Islam, Iman, Ihsan) and how they relate
- How Islamic theology describes God (using at least three of the 99 Names)
- The Muslim understanding of Jesus compared to the Christian understanding

Excellent! In the next module, we will explore Islamic ethics — the moral character (akhlaq) that faith is meant to produce.
`,
    },
  ],
};

import { Module } from "../types";

export const modernWorldModule: Module = {
  id: "christianity-modern-world",
  title: "Christianity in the Modern World",
  description: "Explore how Christianity engages with contemporary challenges — science and faith, secularism, global Christianity, interfaith dialogue, and social justice. Resources: Charles Taylor, A Secular Age; Philip Jenkins, The Next Christendom.",
  lessons: [
    {
      id: "christianity-faith-reason",
      slug: "faith-and-reason",
      title: "Faith, Science, and Reason",
      content: `## Faith, Science, and Reason

<!-- voice:section_check concept="The relationship between Christian faith and scientific inquiry" -->

One of the most common misconceptions about Christianity is that it is inherently opposed to science. The historical reality is far more complex — and far more interesting.

### Christianity and the Birth of Science

Many historians of science have noted that modern science emerged within a **Christian intellectual framework**. The conviction that the universe is orderly, rational, and knowable — because it was created by a rational God — provided the philosophical foundation for systematic investigation of nature.

Key Christian scientists include:

| Scientist | Contribution | Faith |
|-----------|-------------|-------|
| **Copernicus** (1473-1543) | Heliocentric model | Catholic canon |
| **Galileo** (1564-1642) | Observational astronomy | Catholic (famously conflicted with the Church) |
| **Newton** (1643-1727) | Laws of motion, calculus | Devout Anglican |
| **Mendel** (1822-1884) | Genetics | Augustinian friar |
| **Lemaitre** (1894-1966) | Big Bang theory | Catholic priest |
| **Collins** (b. 1950) | Human Genome Project | Evangelical Christian |

> "The heavens declare the glory of God; the skies proclaim the work of his hands."
> — Psalm 19:1 NIV

### The Galileo Affair

The trial of Galileo (1633) is often cited as proof of Christianity's hostility to science. The reality was more nuanced:

- Galileo was a devout Catholic who saw no conflict between faith and science
- The conflict was partly scientific (his proofs were incomplete), partly political (he publicly mocked the Pope), and partly theological (literal reading of passages like Joshua 10:13)
- The Catholic Church formally acknowledged its error in 1992

<!-- voice:key_insight insight="Most serious Christian theologians today hold that science and faith address different dimensions of reality. Science asks 'how' — mechanisms, processes, natural laws. Faith asks 'why' — purpose, meaning, moral significance. They are complementary, not competing. As the physicist-priest John Polkinghorne put it: 'Science tells us that the water consists of H2O. Faith tells us that the water is holy.'" -->

### Evolution and Creation

The relationship between evolutionary science and Christian faith remains debated. Three major positions exist:

1. **Young Earth Creationism**: The earth is 6,000-10,000 years old; Genesis 1-2 is literal history
2. **Old Earth Creationism / Intelligent Design**: The earth is ancient; God guided the process of creation
3. **Evolutionary Creationism (Theistic Evolution)**: Evolution is the method God used to create life; Genesis communicates theological truth, not scientific data

Many mainstream Christian scientists and theologians hold position 3. Francis Collins, director of the Human Genome Project, wrote:

> "The God of the Bible is also the God of the genome. He can be worshipped in the cathedral or in the laboratory."
> — Francis Collins, *The Language of God* (2006)

### Reflection Questions

1. Does the history of Christian scientists surprise you? How does it challenge the "science vs. religion" narrative?
2. Can a text be true without being literal? How might Genesis 1 communicate truth differently from a scientific paper?
3. What do you make of the "complementary questions" model — science asks "how," faith asks "why"?

### Deeper Reading

- **Alister McGrath**, *Science and Religion: A New Introduction*, Wiley-Blackwell, 2009
- **John Polkinghorne**, *Science and Religion in Quest of Truth*, Yale University Press, 2011
`,
    },
    {
      id: "christianity-global-christianity",
      slug: "global-christianity",
      title: "Global Christianity and Contemporary Challenges",
      content: `## Global Christianity and Contemporary Challenges

<!-- voice:section_check concept="The shift of Christianity's center of gravity to the Global South and contemporary engagement" -->

Perhaps the most dramatic story in modern Christianity is not a theological controversy or a schism — it is a **demographic revolution**. The faith that was once synonymous with European civilization now draws the majority of its adherents from Africa, Asia, and Latin America.

\`\`\`concept
{ "title": "The Great Demographic Reversal", "variant": "mental-model", "content": "In 1900, roughly 80% of the world's Christians lived in Europe and North America. By 2025, an estimated 67% live in the Global South — sub-Saharan Africa, Latin America, and Asia. This is not a crisis for Christianity; it is, as Philip Jenkins argues in *The Next Christendom*, the faith returning to its geographic and cultural roots. The 'default Christian' of the 21st century is no longer a European or American, but a Nigerian, Brazilian, or Filipino." }
\`\`\`

### The Changing Map

The numbers tell a story that reshapes nearly every assumption Western Christians carry about their tradition:

| Region | Christian Population (approx. 2025) | Trend |
|--------|--------------------------------------|-------|
| **Sub-Saharan Africa** | ~700 million | Rapid growth |
| **Latin America** | ~600 million | Stable, with Pentecostal surge |
| **Asia** | ~400 million | Growing, especially China and South Korea |
| **Europe** | ~550 million | Declining, especially Western Europe |
| **North America** | ~270 million | Declining church attendance |

\`\`\`sysdiag
{ "title": "Christianity's Shifting Center of Gravity", "width": 620, "height": 340,
  "nodes": [
    { "id": "africa", "label": "Sub-Saharan Africa\\n~700M / Rapid Growth", "x": 160, "y": 80, "kind": "service" },
    { "id": "latam", "label": "Latin America\\n~600M / Pentecostal Surge", "x": 160, "y": 200, "kind": "service" },
    { "id": "asia", "label": "Asia\\n~400M / Growing", "x": 160, "y": 300, "kind": "service" },
    { "id": "global", "label": "Global\\nChristianity\\n2.4B total", "x": 360, "y": 190, "kind": "database" },
    { "id": "europe", "label": "Europe\\n~550M / Declining", "x": 540, "y": 100, "kind": "queue" },
    { "id": "namerica", "label": "North America\\n~270M / Declining", "x": 540, "y": 280, "kind": "queue" }
  ],
  "edges": [
    { "from": "africa", "to": "global", "label": "drives growth" },
    { "from": "latam", "to": "global", "label": "drives growth" },
    { "from": "asia", "to": "global", "label": "drives growth" },
    { "from": "global", "to": "europe", "label": "shrinking share" },
    { "from": "global", "to": "namerica", "label": "shrinking share" }
  ],
  "annotations": {
    "africa": "Sends missionaries to Europe — reversing the colonial pattern",
    "latam": "Pentecostalism has reshaped the Catholic-dominant landscape",
    "asia": "China may have the world's largest Christian population by 2050",
    "global": "67% of all Christians now live in the Global South (Jenkins, 2011)",
    "europe": "Secularization accelerating; churches repurposed as museums and apartments",
    "namerica": "Evangelical presence remains strong but mainline denominations are declining"
  }
}
\`\`\`

### Three Faces of Global South Christianity

\`\`\`tabs
{ "tabs": [
  {
    "label": "African Christianity",
    "icon": "🌍",
    "content": "Africa is now home to the world's most vibrant Christian communities. Nigerian, Ghanaian, Kenyan, and Ethiopian churches are sending missionaries to Europe — a striking reversal of the colonial-era pattern where European missionaries carried the faith southward.\\n\\nAfrican Christianity is characterized by:\\n- Emphasis on **spiritual warfare**, divine healing, and the active work of the Holy Spirit\\n- Integration of faith with **community life** — the church functions as an extended family network\\n- Rapidly growing **Pentecostal and charismatic** movements, especially the Redeemed Christian Church of God and Winners Chapel\\n- Theological engagement with **poverty, HIV/AIDS, and conflict resolution** as urgent pastoral concerns\\n\\nScholar Lamin Sanneh (himself from West Africa) argues that African Christianity is not a derivative of Western Christianity but a fresh appropriation of the gospel — one that resonates with African cultural forms in ways European Christianity never could."
  },
  {
    "label": "Latin American Christianity",
    "icon": "🌎",
    "content": "Latin America remains predominantly Catholic, but Pentecostalism has transformed the landscape since the late 20th century. Brazil — home to some of the world's largest megachurches — illustrates both trajectories.\\n\\nKey dynamics:\\n- **Liberation Theology** (Gustavo Gutiérrez, Leonardo Boff) emerged in the 1960s–80s, insisting that the gospel demands structural economic justice for the poor. It remains influential in Catholic social teaching.\\n- **Pentecostalism** has drawn tens of millions away from Catholicism with its emphasis on healing, prosperity, and Spirit-filled worship accessible to ordinary people.\\n- Pope Francis, himself an Argentine Jesuit, has brought a distinctly Latin American pastoral sensibility to the global Catholic Church — particularly on poverty, ecology, and mercy.\\n\\nThe tension between these two currents — prophetic solidarity with the poor vs. charismatic individual transformation — defines much of Latin American Christian life."
  },
  {
    "label": "Asian Christianity",
    "icon": "🌏",
    "content": "Asia presents Christianity's most complex and diverse landscape:\\n\\n- **South Korea** has one of the world's largest megachurches (Yoido Full Gospel Church, ~480,000 members) and sends the second-highest number of Christian missionaries globally after the United States.\\n- **China** has an estimated 60–100 million Christians (estimates vary widely). The underground 'house church' movement operates outside state control, while the official Three-Self Patriotic Movement is registered with the government.\\n- **India** has ancient Christian communities (Thomas Christians of Kerala trace roots to the apostle Thomas) alongside post-colonial evangelical and Pentecostal growth.\\n- **Philippines** is 90% Christian, one of the most Catholic nations in the world.\\n\\nAsian Christianity often grapples with questions Western Christianity has largely set aside: How does the gospel relate to Confucian, Hindu, or Buddhist culture? What does it mean to follow Jesus in a context of religious plurality?"
  }
] }
\`\`\`

### Christianity and Contemporary Challenges

Modern Christians do not inhabit a separate spiritual world. They engage the same pressures — ecological crisis, religious pluralism, economic inequality — as their secular neighbors, but with distinctive theological resources.

\`\`\`callout
{ "type": "info", "title": "Key Document: Laudato Si' (2015)", "content": "Pope Francis' encyclical *Laudato Si': On Care for Our Common Home* made care for creation a central moral obligation of Catholic social teaching. Drawing on Genesis, the Psalms, and Francis of Assisi, the document argues that ecological destruction and poverty are intertwined injustices: 'We have to realize that a true ecological approach always becomes a social approach; it must integrate questions of justice in debates on the environment, so as to hear both the cry of the earth and the cry of the poor.' This \\"integral ecology\\" framing has influenced not just Catholic communities but ecumenical and evangelical environmental movements." }
\`\`\`

**Interfaith Dialogue**

Since the Second Vatican Council's *Nostra Aetate* (1965), Christians have increasingly moved from confrontation toward respectful engagement with other faiths. *Nostra Aetate* declared that the Catholic Church "rejects nothing that is true and holy in these religions." This shift from a position of exclusivism (only Christianity is true) toward greater openness has enabled Jewish-Christian reconciliation, Christian-Muslim dialogue, and Hindu-Christian exchange — while remaining theologically contested within Christianity itself.

**Economic Justice**

From Liberation Theology in Latin America to evangelical advocacy organizations like World Vision, Christians continue to wrestle with Jesus' teachings about wealth. The challenge is as old as the faith:

> "It is easier for a camel to go through the eye of a needle than for someone who is rich to enter the kingdom of God."
> — Mark 10:25 NIV

Contemporary debates ask whether this demands **structural reform** (changing economic systems) or **personal charity** (generous individual giving) — or both.

\`\`\`concept
{ "title": "Christianity Is No Longer a Western Export", "variant": "insight", "content": "Global Christianity is not a Western religion received passively by the rest of the world. It is a genuinely global faith being actively *shaped* by African, Asian, and Latin American voices. These communities are not copying Western Christianity — they are transforming it: with Spirit-centered African theologies, Latin American liberation ethics, Asian inter-religious sensitivity, and worship styles entirely foreign to European cathedrals. The center did not merely move; the center multiplied." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  {
    "question": "According to Philip Jenkins' *The Next Christendom*, approximately what percentage of the world's Christians live in the Global South as of 2025?",
    "options": ["33%", "50%", "67%", "80%"],
    "answer": 2,
    "explanation": "Jenkins argues that by the mid-21st century, the demographic center of Christianity has definitively shifted southward. Approximately 67% of Christians now live in Africa, Latin America, and Asia — inverting the 1900 figure when 80% lived in Europe and North America."
  },
  {
    "question": "What is historically significant about Nigerian and Ghanaian churches sending missionaries to Europe?",
    "options": [
      "It represents an expansion of European Protestant missions",
      "It reverses the colonial-era pattern where Europeans brought Christianity to Africa",
      "It fulfills the mandate of the World Council of Churches",
      "It is a response to the Lausanne Movement's evangelism goals"
    ],
    "answer": 1,
    "explanation": "During the colonial era (roughly 1800–1960), European and American missionaries brought Christianity to Africa. The reverse flow — African missionaries evangelizing a post-Christian Europe — symbolizes the dramatic demographic reversal Jenkins describes and challenges assumptions about the direction of Christian mission."
  },
  {
    "question": "Pope Francis' encyclical *Laudato Si'* (2015) is primarily concerned with:",
    "options": [
      "The theology of marriage and family",
      "Economic inequality between nations",
      "Care for creation and the environment as a moral obligation",
      "The role of women in the Catholic Church"
    ],
    "answer": 2,
    "explanation": "*Laudato Si'* (Italian: 'Praise Be to You') grounds environmental stewardship in Catholic theology, arguing that ecological destruction and poverty are inseparable injustices. Its concept of 'integral ecology' has become a touchstone for Christian environmental engagement globally."
  },
  {
    "question": "The Second Vatican Council document *Nostra Aetate* (1965) is significant for interfaith relations because it:",
    "options": [
      "Declared all religions equally valid paths to God",
      "Stated that the Church rejects nothing true and holy in other religions",
      "Called for the conversion of all non-Christians",
      "Established a formal alliance between Catholicism and Islam"
    ],
    "answer": 1,
    "explanation": "*Nostra Aetate* ('In Our Time') marked a historic shift in Catholic teaching by acknowledging spiritual value in Hinduism, Buddhism, Islam, and Judaism. It explicitly repudiated the charge of collective guilt against Jews for the death of Jesus — a watershed in Jewish-Christian relations. It stopped short of religious pluralism but opened sustained interfaith dialogue."
  }
] }
\`\`\`

### Reflection Questions

1. What does the shift of Christianity's center to the Global South mean for the future of the faith? Who gets to define "orthodox" Christianity in a world where most Christians are African or Latin American?
2. How might African and Asian Christianity challenge assumptions held by Western Christians about what worship, community, and theology should look like?
3. Is environmental stewardship a core Christian responsibility or a peripheral concern? Consider Genesis 1:28 alongside *Laudato Si'*.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Christianity's demographic center has shifted decisively to the Global South — roughly 67% of Christians now live in Africa, Latin America, and Asia (Philip Jenkins, *The Next Christendom*).",
  "African, Asian, and Latin American Christians are not passively receiving Western Christianity — they are actively reshaping theology, worship, and mission in ways that challenge Euro-American assumptions.",
  "Contemporary Christianity engages pressing global challenges: *Laudato Si'* (2015) made ecological care a moral obligation; *Nostra Aetate* (1965) opened respectful interfaith dialogue; liberation and evangelical traditions continue debating the demands of economic justice.",
  "Pentecostalism is the fastest-growing Christian movement globally, especially in the Global South, emphasizing the Holy Spirit, healing, and accessible worship.",
  "The future of Christianity will be written largely in Yoruba, Mandarin, Portuguese, and Tagalog — not English, French, or German."
] }
\`\`\`

### Further Reading

- **Philip Jenkins**, *The Next Christendom: The Coming of Global Christianity*, Oxford University Press, 2011
- **Lamin Sanneh**, *Whose Religion Is Christianity? The Gospel Beyond the West*, Eerdmans, 2003
- **Pope Francis**, *Laudato Si': On Care for Our Common Home*, Vatican Press, 2015`,
    },
    {
      id: "christianity-modern-world-checkpoint",
      slug: "modern-world-checkpoint",
      title: "Checkpoint: Christianity in the Modern World",
      content: `## Checkpoint: Christianity in the Modern World

You have explored five major frontiers where Christian faith meets the contemporary world — science, secularism, the Global South, interfaith dialogue, and social justice. Before moving to the capstone, let's consolidate what you've learned.

\`\`\`concept
{ "title": "The 'Conflict Thesis' Was Invented", "variant": "insight", "content": "The popular idea that science and Christianity have always been at war was largely constructed by two 19th-century polemicists — John William Draper and Andrew Dickson White — and has been largely discredited by historians of science. The actual relationship is one of complex entanglement: medieval universities preserved and advanced learning, clergy ran observatories, and monks bred peas. Conflict is real in specific episodes, but it is not the defining story." }
\`\`\`

\`\`\`tabs
{ "tabs": [
  { "label": "Science & Faith", "icon": "🔭", "content": "**Key figures to know:**\\n\\n- **Copernicus** — Catholic canon who proposed heliocentrism\\n- **Mendel** — Augustinian friar whose pea-plant experiments founded genetics\\n- **Lemaître** — Catholic priest who first proposed what became the Big Bang theory\\n- **Collins** — Evangelical Christian who led the Human Genome Project\\n\\n**Three positions on evolution:**\\n\\n| Position | Earth's Age | God's Role |\\n|---|---|---|\\n| Young Earth Creationism | ~6,000–10,000 yrs | Direct creation; Genesis is literal science |\\n| Old Earth / Intelligent Design | Billions of years | God guided or designed the process |\\n| Evolutionary Creationism | Billions of years | Evolution is God's method; Genesis is theological, not scientific |" },
  { "label": "Global Christianity", "icon": "🌍", "content": "**The Next Christendom (Philip Jenkins)**\\n\\nThe center of gravity of global Christianity has decisively shifted. By 2050, projections suggest:\\n\\n- Africa will be home to ~40% of all Christians\\n- The typical Christian will be a woman in Sub-Saharan Africa or Latin America, not a European male\\n- Pentecostalism is the fastest-growing form of Christianity worldwide\\n\\n**What this means theologically:** Southern Christianity tends to be more supernaturalist, charismatic, and engaged with poverty and healing — raising questions about which expressions of the faith are 'mainstream.'" },
  { "label": "Interfaith & Social Ethics", "icon": "🤝", "content": "**Nostra Aetate (1965)** — Vatican II document declaring that the Catholic Church 'rejects nothing that is true and holy' in other religions. Historic shift from exclusivism toward dialogue.\\n\\n**Laudato Si' (2015)** — Pope Francis's encyclical arguing that care for creation is a moral obligation rooted in Christian theology. Connects ecological destruction to spiritual failure and global injustice.\\n\\n**Charles Taylor's thesis:** Secularism is not simply the absence of religion — it is a new *condition* in which belief is one option among many. This reframes the challenge: not 'religion vs. science' but 'what does it mean to believe in a secular age?'" }
] }
\`\`\`

\`\`\`quiz
{ "title": "Module Review: Christianity in the Modern World", "questions": [
  { "question": "Which of the following figures proposed the theory that would become known as the Big Bang?", "options": ["Isaac Newton, an Anglican physicist", "Georges Lemaître, a Catholic priest and physicist", "Francis Collins, an Evangelical geneticist", "Gregor Mendel, an Augustinian friar"], "answer": 1, "explanation": "Georges Lemaître, a Belgian Catholic priest and physicist, first proposed the idea of an expanding universe from a primordial point — what Fred Hoyle mockingly called 'the Big Bang.' This directly contradicts the simple science-vs-religion narrative." },
  { "question": "Which position holds that Genesis communicates theological rather than scientific truth, and that evolution is the means God used to create?", "options": ["Young Earth Creationism", "Intelligent Design", "Evolutionary Creationism", "Scientific Materialism"], "answer": 2, "explanation": "Evolutionary Creationism (also called Theistic Evolution) accepts the scientific consensus on evolution and an ancient universe, but interprets Genesis as making claims about *who* created and *why*, not *how* in a scientific sense. Francis Collins is a prominent advocate." },
  { "question": "According to Philip Jenkins in *The Next Christendom*, where is Christianity growing most rapidly?", "options": ["Western Europe", "North America", "Sub-Saharan Africa, Latin America, and Asia", "Australia and New Zealand"], "answer": 2, "explanation": "Jenkins documents a dramatic demographic shift: the historic heartlands of Christianity in Europe are declining while the Global South — especially Sub-Saharan Africa — is experiencing explosive growth. By 2050, Africa alone may have more Christians than Europe and North America combined." },
  { "question": "What is the central argument of Pope Francis's encyclical *Laudato Si'* (2015)?", "options": ["The Church should stay out of political debates about climate policy", "Care for creation is a moral and spiritual obligation, not merely a political preference", "Economic development should take priority over environmental concerns for poor nations", "Climate change is primarily a scientific rather than an ethical issue"], "answer": 1, "explanation": "Laudato Si' argues that 'integral ecology' is at the heart of Christian life — that the cry of the earth and the cry of the poor are interconnected. It is the most comprehensive statement by a major Christian leader connecting environmental stewardship to core Christian theology." },
  { "question": "What historic shift did the Vatican II document *Nostra Aetate* (1965) represent?", "options": ["It declared that all religions are equally true paths to salvation", "It moved from exclusive condemnation of other religions toward respectful dialogue", "It ended the Catholic Church's use of Latin in the Mass", "It formally recognized Protestant denominations as valid churches"], "answer": 1, "explanation": "Nostra Aetate declared that the Catholic Church 'rejects nothing that is true and holy' in other religions. It did not teach religious relativism — it maintained Christian distinctives — but it marked a historic turn away from exclusive condemnation and toward dialogue. It specifically addressed Judaism, Islam, Hinduism, and Buddhism." },
  { "question": "Charles Taylor's concept of the 'secular age' (from *A Secular Age*) primarily argues that:", "options": ["Science has disproved religion and secularism is inevitable", "Secularism means the disappearance of religion from public life", "Modern Western people live in a condition where belief is one option among many, rather than the default", "Religious decline is unique to Western Europe and will not spread elsewhere"], "answer": 2, "explanation": "Taylor argues that the defining feature of our age is not that people no longer believe, but that belief has become *optional* and *contested* in a way it was not in pre-modern societies. This is the 'immanent frame' — a self-sufficient naturalistic worldview that makes transcendence feel like an add-on rather than a given." }
] }
\`\`\`

\`\`\`concept
{ "title": "Why 'Science vs. Religion' Is a 19th-Century Invention", "variant": "rule", "content": "Historians of science now widely reject the 'warfare model' popularized by Draper (1874) and White (1896). The actual record shows: the medieval Church founded universities; Copernicus, Galileo, Mendel, and Lemaître were all devout Christians; the Royal Society's founders included many clergy. Specific conflicts occurred — Galileo's trial is real — but they were embedded in complex institutional and political contexts, not in an essential incompatibility between faith and empirical inquiry." }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: The Global South Shift and What It Means for Christian Identity", "content": "Philip Jenkins's central argument in *The Next Christendom* is that Christianity is not dying — it is migrating. The 20th century saw explosive growth across Africa, Latin America, and parts of Asia.\\n\\n**Demographics:**\\n- 1900: ~80% of Christians lived in Europe and North America\\n- 2050 projection: ~70% will live in Africa, Asia, and Latin America\\n\\n**Theological implications:**\\n- Southern Christianity tends to be more pneumatic (Spirit-focused), healing-oriented, and apocalyptic\\n- It takes seriously the New Testament's accounts of miracles and demonic possession\\n- It reads the Bible through contexts of poverty, colonialism, and political oppression\\n\\n**The tension:** When Western liberals celebrate 'progressive Christianity' and African traditionalists defend classical orthodoxy on sexuality and doctrine, which community gets to define mainstream Christianity? Jenkins suggests this question will dominate the 21st century.\\n\\n**Key denominations driving growth:** Pentecostalism, Catholic Charismatic Renewal, and African Initiated Churches (AICs) — movements that combine Christian faith with indigenous spiritual sensibilities." }
\`\`\`

### Voice Summary

Speak your answer aloud before reading ahead. This consolidates active recall:

**Prompt 1 — Science & Faith:**
Explain in your own words why the science-versus-religion narrative oversimplifies the actual history. Name at least one scientist-Christian to support your argument.

**Prompt 2 — Global Christianity:**
What does the shift of Christianity to the Global South mean for how we define "mainstream" Christian belief and practice?

**Prompt 3 — Contemporary Ethics:**
Choose one contemporary issue — climate, poverty, interfaith conflict — and explain the distinctive contribution Christian theology makes to that conversation.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "The 'warfare' between science and religion was largely a 19th-century rhetorical construction; major scientists across history — Copernicus, Mendel, Lemaître, Collins — held deep Christian commitments alongside rigorous empirical work.",
  "Christianity holds three distinct positions on evolution: Young Earth Creationism, Old Earth/Intelligent Design, and Evolutionary Creationism — not a single 'religious' view opposing science.",
  "Global Christianity's center of gravity has shifted decisively to Sub-Saharan Africa, Latin America, and Asia — raising fundamental questions about authority, identity, and what 'orthodoxy' means.",
  "Vatican II's Nostra Aetate (1965) and Pope Francis's Laudato Si' (2015) represent landmark moments where the Catholic Church reoriented its public stance — toward interfaith dialogue and ecological ethics respectively.",
  "Charles Taylor's 'secular age' framework reframes the challenge: modernity does not destroy religious belief but changes its conditions — making it one option among many rather than the default backdrop of life."
] }
\`\`\``,
    },
  ],
};

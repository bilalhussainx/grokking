import { Module } from "../types";

export const capstoneModule: Module = {
  id: "buddhism-capstone",
  title: "Capstone: Personal Reflection",
  description: "Synthesize your learning across all modules, reflect on key Buddhist concepts, and consider how the study of Buddhism enriches your understanding of suffering, compassion, and the human condition.",
  lessons: [
    {
      id: "buddhism-synthesis",
      slug: "course-synthesis",
      title: "Bringing It All Together",
      content: `## Bringing It All Together

<!-- voice:section_check concept="Synthesizing the major themes of the Buddhism course" -->

Over the previous six modules, you have explored Buddhism from multiple angles — the life of its founder, its core philosophical framework, its practical path, its meditation traditions, its scriptures, and its ethics. Let us step back and see how these elements form a coherent whole.

\`\`\`concept
{ "title": "The Central Hypothesis of Buddhism", "variant": "mental-model", "content": "Everything in Buddhism flows from one fundamental insight: suffering arises from causes, and those causes can be removed. This is not a doctrine to believe — it is a hypothesis to test through personal practice. The entire edifice of Buddhist teaching is an investigative framework, not a creed." }
\`\`\`

### The Architecture of Buddhism

Each module you studied corresponds to a distinct dimension of the tradition. Together they form an integrated system — no part stands alone.

\`\`\`sysdiag
{ "title": "How the Six Modules Fit Together", "width": 680, "height": 380, "nodes": [ { "id": "life", "label": "The Buddha's Life (Module 1)", "x": 340, "y": 50, "kind": "service" }, { "id": "truths", "label": "Four Noble Truths (Module 2)", "x": 130, "y": 160, "kind": "database" }, { "id": "path", "label": "Eightfold Path (Module 3)", "x": 340, "y": 160, "kind": "database" }, { "id": "meditation", "label": "Meditation (Module 4)", "x": 560, "y": 160, "kind": "service" }, { "id": "scriptures", "label": "Key Scriptures (Module 5)", "x": 130, "y": 290, "kind": "client" }, { "id": "ethics", "label": "Buddhist Ethics (Module 6)", "x": 560, "y": 290, "kind": "client" }, { "id": "practice", "label": "Living Practice", "x": 340, "y": 310, "kind": "external" } ], "edges": [ { "from": "life", "to": "truths", "label": "Diagnosis" }, { "from": "life", "to": "path", "label": "Example" }, { "from": "truths", "to": "path", "label": "grounds" }, { "from": "path", "to": "meditation", "label": "trains mind" }, { "from": "scriptures", "to": "truths", "label": "transmits" }, { "from": "path", "to": "practice", "label": "guides" }, { "from": "ethics", "to": "practice", "label": "shapes" }, { "from": "meditation", "to": "practice", "label": "deepens" } ], "annotations": { "life": "Siddhartha Gautama's life provides the historical proof of concept: a human being can awaken.", "truths": "The diagnostic framework — identify the illness (dukkha), the cause (tanha), the cure (nibbana), and the treatment (the path).", "path": "The Eightfold Path is the prescription: right view, intention, speech, action, livelihood, effort, mindfulness, and concentration.", "practice": "All three dimensions — ethical conduct, mental cultivation, and wisdom — converge in daily lived practice." } }
\`\`\`

### The Three Jewels Revisited

All Buddhists — regardless of school or tradition — take refuge in the **Three Jewels** (Ti-ratana). This is not a passive act of submission but a deliberate orientation toward what is trustworthy and liberating.

\`\`\`tabs
{ "tabs": [ { "label": "The Buddha", "icon": "🙏", "content": "**Not as a god to worship, but as proof that awakening is humanly possible.**\\n\\nThe historical Siddhartha Gautama demonstrated through his own life that a human being — born, aging, subject to illness and death — can penetrate the nature of reality and become free. Taking refuge in the Buddha means orienting one's life toward that possibility.\\n\\nThe Buddha also functions as a **teacher archetype**: someone who found a path, walked it, and left clear instructions. He did not claim divine authority — he claimed the authority of direct experience." }, { "label": "The Dhamma", "icon": "📜", "content": "**The teaching itself — a set of practices and insights to be verified, not merely believed.**\\n\\nThe Dhamma includes:\\n- The **Four Noble Truths** (the diagnostic framework)\\n- The **Noble Eightfold Path** (the prescription)\\n- **Dependent Origination** (the mechanism of suffering and liberation)\\n- The **Three Marks of Existence** (impermanence, suffering, non-self)\\n\\nThe Kalama Sutta (Anguttara Nikaya 3.65) records the Buddha's instruction: *Do not accept anything on mere hearsay or scripture or preconceived notions. When you know for yourselves — these things are wholesome, blameless, praised by the wise — then accept them.*\\n\\nThe Dhamma is an empirical program, not a revealed religion." }, { "label": "The Sangha", "icon": "🫂", "content": "**The community of practitioners — the social and relational dimension of the path.**\\n\\nBuddhism has always insisted that the path is walked in community. The sangha provides:\\n- **Support** — companions who understand the practice\\n- **Accountability** — witnesses to one's commitment\\n- **Teaching** — access to those further along the path\\n- **Living example** — proof that practice bears fruit\\n\\nIn the Theravada tradition, the formal sangha refers to monastics. In Mahayana traditions, it extends to all practitioners. In modern contexts, a sangha might be a meditation group, a study circle, or an online community of serious practitioners.\\n\\nIsolated practice is possible — but rare and difficult. The sangha is not optional decoration; it is structural support." } ] }
\`\`\`

### Key Themes Across the Course

Five threads run through every module. Recognizing them as recurring patterns — rather than isolated facts — is the mark of genuine understanding.

\`\`\`tabs
{ "tabs": [ { "label": "Impermanence", "icon": "🌊", "content": "**Anicca — Everything changes.**\\n\\nThis is the most misunderstood of the three marks. It is not a pessimistic observation but a **liberating** one.\\n\\nIf suffering arises from conditions, and conditions are impermanent, then suffering too can end. The same impermanence that makes loss painful makes transformation possible.\\n\\nPractical implication: When you notice resistance to change — in relationships, health, circumstances — the Buddhist response is not stoic acceptance but curious investigation. *What is clinging here? What am I treating as permanent?*" }, { "label": "Interdependence", "icon": "🕸️", "content": "**Paticca Samuppada — Nothing exists independently.**\\n\\nDependent Origination is the philosophical heart of Buddhism. Selves, societies, ecosystems — all arise through interconnected conditions. There is no first cause, no isolated entity, no self that stands apart from its relationships.\\n\\nThis insight grounds both **wisdom** (seeing through the illusion of a fixed self) and **compassion** (recognizing that what harms others harms the web we are part of).\\n\\nModern resonances: systems thinking, ecology, relational psychology — all point toward the same basic structure that the Buddha articulated 2,500 years ago." }, { "label": "Middle Way", "icon": "⚖️", "content": "**Majjhimā paṭipadā — Between extremes.**\\n\\nThe Buddha's first move after his awakening was to chart a course between:\\n- Sensual **indulgence** and harsh **asceticism**\\n- **Attachment** and **aversion**\\n- **Nihilism** (nothing matters) and **eternalism** (the self persists forever)\\n\\nThe Middle Way is not compromise or lukewarm moderation. It is the *precise* path that avoids the distortions produced by extremes. In ethics: not rigid rule-following, not situational relativism. In meditation: not forcing, not drifting.\\n\\nAsk yourself: In which area of life am I currently at an extreme?" }, { "label": "Compassion", "icon": "❤️", "content": "**Karuna — The wish that beings be free from suffering.**\\n\\nFrom the **metta meditation** to the **bodhisattva vow**, Buddhism insists that wisdom and compassion are inseparable. You cannot truly understand the nature of suffering — including its causes in craving and ignorance — without the natural arising of the wish to alleviate it.\\n\\nThis is why Buddhist ethics is not primarily rule-based but **motivation-based**. An action done from greed or hatred plants seeds of future suffering. An action done from wisdom and compassion plants seeds of liberation — for the actor and for those affected.\\n\\nThe Mahayana extension: compassion is not only for those we like or those nearby. The bodhisattva vow extends it to *all sentient beings*." }, { "label": "Direct Experience", "icon": "🔬", "content": "**Ehipassiko — Come and see.**\\n\\nBuddhism is empirical at its core. The Pali word *ehipassiko* means 'come and see for yourself.' The Buddha did not demand faith in propositions — he offered a method and invited investigation.\\n\\nThis means:\\n- **Meditation** is not decoration — it is the laboratory\\n- **Teachings** are hypotheses, not axioms\\n- **Authority** comes from verified experience, not transmission\\n\\nThe implication for study: understanding Buddhism conceptually is a beginning, not an end. The tradition consistently says that intellectual understanding, however sophisticated, is distinct from — and subordinate to — direct insight (*vipassana*)." } ] }
\`\`\`

<!-- voice:key_insight insight="The Buddha said in the Kalama Sutta (Anguttara Nikaya 3.65): Do not accept anything on mere hearsay, or because it accords with your scriptures, or because it agrees with your preconceived notions. But when you know for yourselves — these things are wholesome, blameless, praised by the wise, and lead to welfare and happiness — then accept them and abide by them. Buddhism is an invitation to investigate, not a demand to believe." -->

\`\`\`callout
{ "type": "info", "title": "The Kalama Sutta Principle", "content": "The Buddha's instruction at Kesaputta (Anguttara Nikaya 3.65) is often called Buddhism's charter of free inquiry. He explicitly told the Kalamas not to defer to teachers, traditions, or scriptures — including his own. Test the teachings against your direct experience. This epistemological humility is distinctive in the history of world religions." }
\`\`\`

### Capstone Reflection

Before moving forward, take a moment to consolidate what you have actually learned — not what you have read, but what has genuinely shifted in how you understand yourself and the world.

\`\`\`quiz
{ "title": "Synthesis Check — Bringing It All Together", "questions": [ { "question": "The Buddha's core teaching can be summarized as: suffering arises from causes, and those causes can be removed. Which Buddhist term names the direct cause of suffering that the Four Noble Truths identify?", "options": ["Anicca (impermanence)", "Tanha (craving/thirst)", "Anatta (non-self)", "Samsara (the cycle of rebirth)"], "answer": 1, "explanation": "The Second Noble Truth identifies tanha — craving, thirst, or clinging — as the proximate cause of dukkha. Anicca and anatta are marks of existence, and samsara names the broader cycle, but tanha is the specific mechanism the Buddha identified as the root cause that the path is designed to uproot." }, { "question": "A student says: 'The Eightfold Path is just a moral code — a list of rules about how to behave.' What is the most accurate response from what you have studied?", "options": ["Correct — the path is primarily ethical guidance for lay practitioners.", "Partially correct — the path includes ethics but also mental training and wisdom.", "Incorrect — the path is purely about meditation and has nothing to do with ethics.", "Incorrect — the path only applies to monastics, not lay practitioners."], "answer": 1, "explanation": "The Noble Eightfold Path has three divisions: Sila (ethical conduct: right speech, action, livelihood), Samadhi (mental cultivation: right effort, mindfulness, concentration), and Prajna (wisdom: right view, right intention). Ethics is the foundation, but it is inseparable from meditation and wisdom. The path is a complete training, not a moral code." }, { "question": "Which of the following best captures the relationship between wisdom (prajna) and compassion (karuna) in Buddhist teaching?", "options": ["They are in tension — the pursuit of wisdom requires withdrawing from compassionate action.", "They are sequential — you develop wisdom first, then compassion follows as a second stage.", "They are inseparable — genuine insight into interdependence naturally produces compassion.", "They are parallel — both are optional paths that different practitioners may emphasize."], "answer": 2, "explanation": "In Buddhist teaching — especially in Mahayana traditions — wisdom and compassion are co-arising. Seeing clearly the nature of suffering and interdependence (prajna) naturally generates the wish to alleviate suffering (karuna). This is why the bodhisattva ideal unites both: wisdom without compassion is incomplete; compassion without wisdom is misdirected." }, { "question": "The Kalama Sutta is notable in the history of religious thought because it:", "options": ["Establishes the authority of the Pali Canon as the final word on Buddhist doctrine.", "Instructs practitioners not to accept teachings — even the Buddha's own — on mere authority, but to verify them through direct experience.", "Defines the Three Jewels and explains why taking refuge is obligatory for all Buddhists.", "Describes the Buddha's awakening and the specific meditative insight that led to his liberation."], "answer": 1, "explanation": "The Kalama Sutta (Anguttara Nikaya 3.65) contains the Buddha's famous instruction to the Kalamas: do not accept teachings based on tradition, scripture, or teacher reputation alone. Test them against your own experience and reason. This empirical orientation — unusual in ancient religious contexts — is central to how Buddhism understands authority and verification." } ] }
\`\`\`

### Where to Go Deeper

\`\`\`collapse
{ "title": "Deep Dive: Further Reading by Tradition and Interest", "content": "**For a First Overview**\\n- Walpola Rahula, *What the Buddha Taught* (1974) — The classic concise introduction, written by a Theravada monk with academic training. Rigorous and accessible.\\n\\n**Primary Sources**\\n- Bhikkhu Bodhi (trans.), *In the Buddha's Words* (2005, Wisdom Publications) — A curated anthology from the Pali Canon, organized thematically. The best single-volume entry into original texts.\\n\\n**Meditation Practice**\\n- Joseph Goldstein, *Mindfulness: A Practical Guide to Awakening* (2013) — Rooted in Theravada Vipassana, highly practical.\\n- Shunryu Suzuki, *Zen Mind, Beginner's Mind* (1970) — The entry point for Soto Zen; accessible and profound.\\n\\n**Tibetan Buddhism**\\n- Pema Chodron, *When Things Fall Apart* (1997) — Applies Tibetan teachings to difficulty and loss. Widely loved by Western practitioners.\\n\\n**Buddhist Ethics**\\n- Peter Harvey, *An Introduction to Buddhist Ethics* (2000, Cambridge) — Comprehensive academic treatment across all major schools.\\n\\n**Engaged Buddhism**\\n- Thich Nhat Hanh, *The Heart of the Buddha's Teaching* (1998) — Connects traditional teaching to contemporary social and environmental concerns.\\n\\n**Academic Foundation**\\n- Rupert Gethin, *The Foundations of Buddhism* (1998, Oxford) — The most respected single-volume academic overview; excellent for understanding the tradition's historical and philosophical breadth." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Buddhism is an integrated system: the Four Noble Truths diagnose, the Eightfold Path prescribes, meditation trains the mind, ethics shapes action, and scripture transmits the tradition — no element stands alone.", "The Three Jewels (Buddha, Dhamma, Sangha) orient the practitioner toward what is trustworthy: proof of awakening, a verifiable method, and a community of fellow travelers.", "Five themes thread through the entire tradition: impermanence (anicca), interdependence (paticca samuppada), the Middle Way, compassion (karuna), and the primacy of direct experience.", "The Kalama Sutta's principle — verify through experience, not authority — is not a footnote; it is the epistemological foundation of the entire project.", "Conceptual understanding of Buddhism is a starting point, not a destination. The tradition consistently points beyond study to practice, and beyond practice to direct insight." ] }
\`\`\``,
    },
    {
      id: "buddhism-personal-application",
      slug: "personal-application",
      title: "Personal Application & Continued Learning",
      content: `## Personal Application & Continued Learning

<!-- voice:section_check concept="Applying Buddhist insights and continuing the journey" -->

The Buddha taught that knowledge without practice is like a beautiful flower without fragrance. The Dhammapada opens with the insight that all experience is shaped by the mind — and mind can be trained.

> "You yourself must strive. The Buddhas only point the way."
> — Dhammapada 276

### Practical Steps for Continued Exploration

**Begin a Meditation Practice:**
Start with just 10 minutes per day. Sit comfortably, close your eyes, and bring attention to the natural rhythm of your breathing. When the mind wanders (it will), gently return attention to the breath. This is anapanasati — the Buddha's most frequently taught meditation.

**Study a Key Text:**
Choose one text to read slowly and reflectively:
- The **Dhammapada** for daily wisdom in verse form
- The **Heart Sutra** for encountering emptiness directly
- **What the Buddha Taught** by Walpola Rahula for a clear overview

**Practice the Five Precepts:**
Choose one precept to focus on for 30 days. Notice how observing it affects your mind, your relationships, and your sense of well-being.

**Find a Community:**
Buddhism has always been practiced in community (sangha). Look for local meditation groups, Buddhist centers, or online communities. Many Zen centers, Insight Meditation groups, and Tibetan Buddhist sanghas welcome newcomers.

**Practice Metta:**
Spend five minutes each day offering loving-kindness phrases to yourself, loved ones, neutral people, difficult people, and all beings. Notice how this practice affects your emotional landscape over time.

### A Final Word from Ajahn Bodhi

May this course have planted seeds of understanding in your mind. In Buddhism, we speak of planting merit (punna) — wholesome intentions that bear fruit across time. Whether you are a Buddhist practitioner, a student of world religions, or a curious learner, the insights of the Buddha belong to all of humanity.

The Dhammapada reminds us:

> "An ounce of practice is worth more than a ton of theory."
> — Adapted from the spirit of Dhammapada 19-20

<!-- voice:key_insight insight="The Buddha's final words to his disciples were: 'All conditioned things are impermanent. Work out your own salvation with diligence.' (Digha Nikaya 16, Mahaparinibbana Sutta). Buddhism does not promise salvation from an external source — it offers a path, a method, and the confidence that the path can be walked by anyone willing to practice." -->

### Reflection Questions

1. What is one concrete action you will take as a result of this course?
2. How has this study affected your view of the relationship between wisdom and compassion?
3. What questions remain for you, and where will you seek answers?
4. How might you share what you have learned with others in a constructive way?

### A Comprehensive Reading List

| Category | Book | Author |
|----------|------|--------|
| **Introduction** | *What the Buddha Taught* | Walpola Rahula |
| **Pali Canon Anthology** | *In the Buddha's Words* | Bhikkhu Bodhi |
| **Meditation** | *Mindfulness in Plain English* | Bhante Gunaratana |
| **Zen** | *Zen Mind, Beginner's Mind* | Shunryu Suzuki |
| **Tibetan** | *When Things Fall Apart* | Pema Chodron |
| **Ethics** | *An Introduction to Buddhist Ethics* | Peter Harvey |
| **Heart Sutra** | *The Heart Sutra* | Red Pine |
| **Women in Buddhism** | *Therigatha* | trans. Charles Hallisey |
| **Engaged Buddhism** | *Being Peace* | Thich Nhat Hanh |
| **Academic** | *The Foundations of Buddhism* | Rupert Gethin |
| **History** | *Buddhism: A Very Short Introduction* | Damien Keown |
`,
    },
    {
      id: "buddhism-capstone-checkpoint",
      slug: "capstone-checkpoint",
      title: "Checkpoint: Final Review",
      content: `## Checkpoint: Final Review

Congratulations! You have completed the entire "Buddhism: Path to Inner Peace" course. This final checkpoint covers concepts from across all seven modules.

### Quiz

**1. What is the Middle Way, and what two extremes does it avoid?**

*Short Answer:* The Middle Way (majjhima patipada) is the Buddha's path between two extremes: sensual indulgence (the life of luxury he lived as a prince) and severe self-mortification (the ascetic practices he tried for six years). The Middle Way is balanced, clear-minded practice that avoids both extremes.

---

**2. Match the Pali term to its meaning:**

| Pali Term | Meaning |
|-----------|---------|
| Dukkha | ? |
| Anicca | ? |
| Anatta | ? |
| Tanha | ? |
| Nibbana | ? |

**Answer:**
- Dukkha — Suffering, unsatisfactoriness
- Anicca — Impermanence
- Anatta — Non-self
- Tanha — Craving, thirst
- Nibbana — The unconditioned, cessation of suffering

---

**3. Name the Three Jewels and explain why each matters.**

*Short Answer:* (1) The Buddha — proof that awakening is humanly possible. (2) The Dhamma — the teaching: Four Noble Truths, Eightfold Path, and practices to be verified through experience. (3) The Sangha — the community of practitioners who support and inspire each other on the path.

---

**4. How does the Heart Sutra's teaching on emptiness (sunyata) relate to Dependent Origination?**

*Short Answer:* They are the same insight at different depths. Dependent Origination teaches that all phenomena arise from conditions — nothing exists independently. Sunyata (emptiness) takes this further: if everything depends on conditions, then nothing has inherent, self-sufficient existence. "Form is emptiness, emptiness is form" means that the conditioned world and its empty nature are not separate realities but the same reality seen clearly.

---

**5. True or False: Buddhist ethics judges actions solely by their outcomes.**

**Answer: False.** Buddhist ethics emphasizes intention (cetana) as the primary determinant of moral quality. The Buddha said, "It is intention that I call karma." While outcomes matter, the root motivation — whether greed, hatred, and delusion or generosity, loving-kindness, and wisdom — is what shapes the karmic quality of an action.

---

**6. What is the bodhisattva vow, and why is it significant in Mahayana Buddhism?**

*Short Answer:* The bodhisattva vow is the aspiration to attain full Buddhahood for the benefit of all sentient beings — not just personal liberation. It is significant because it reorients the entire purpose of practice from individual freedom to universal compassion. The bodhisattva path involves cultivating the six perfections (paramitas) across countless lifetimes.

---

### Voice Summary

For your final voice exercise, explain aloud — as if teaching a friend:
- The Four Noble Truths in your own words
- The relationship between wisdom (panna) and compassion (karuna)
- One thing about Buddhism that you understand differently now than when you started

### Completion

You have completed **Buddhism: Path to Inner Peace**. You have engaged with primary sources from the Pali Canon and Mahayana scriptures, learned Pali terminology, explored meditation traditions from Theravada vipassana to Zen zazen, and considered the ethical vision of Buddhist practice. Whether this is the beginning of a deeper journey or one stop on a broader exploration, the seeds of understanding you have planted here will continue to grow.

May all beings be happy. May all beings be free from suffering. May all beings find peace.

*Sadhu, sadhu, sadhu.* (Well done, well done, well done.)
`,
    },
  ],
};

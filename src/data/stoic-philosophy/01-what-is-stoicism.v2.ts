import { Module } from "../types";

export const whatIsStoicismModule: Module = {
  id: "what-is-stoicism",
  title: "What Is Stoicism?",
  description: "Discover the origins of Stoic philosophy in ancient Athens, meet its founders, and understand the core promise that drew Roman emperors and enslaved people alike to the Painted Porch.",
  lessons: [
    {
      id: "stoic-origins",
      slug: "stoic-origins",
      title: "Origins: Zeno and the Painted Porch",
      content: `## The Shipwreck That Launched a Philosophy

<!-- voice:key_insight -->

Around 300 BCE, a Phoenician merchant named **Zeno of Citium** lost his entire fortune in a shipwreck. Stranded in Athens, he wandered into a bookshop and encountered the writings of Socrates. According to the later biographer Diogenes Laertius, Zeno asked the bookseller where he could find such men. The bookseller pointed to **Crates the Cynic**, who happened to be walking by. Zeno became his student on the spot.

After studying with multiple philosophical schools -- the Cynics, the Megarians, and the Academy -- Zeno began teaching his own philosophy at the **Stoa Poikile** (the "Painted Porch"), a colonnade on the north side of the Athenian agora. His followers became known as *Stoikoi* -- "people of the Stoa."

### The Three Parts of Stoic Philosophy

The early Stoics divided philosophy into three interconnected disciplines:

| Discipline | Greek Term | Focus |
|-----------|-----------|-------|
| **Logic** | *logike* | How to think clearly and argue well |
| **Physics** | *physike* | How the universe works (including theology and cosmology) |
| **Ethics** | *ethike* | How to live a good life |

The Stoics used a famous metaphor: philosophy is like an **egg**. Logic is the shell (it protects everything). Physics is the white (it nourishes). Ethics is the yolk (it is the purpose). Or alternatively, philosophy is a **fertile field**: logic is the fence, physics is the soil, and ethics is the fruit.

<!-- voice:section_check -->

### The Core Promise

What drew people to Stoicism? A single, radical promise: **eudaimonia** -- a flourishing, tranquil life -- is available to *anyone* who cultivates virtue and aligns themselves with reason. Not wealth. Not status. Not luck. Virtue alone.

As Epictetus, a formerly enslaved Stoic philosopher, would later put it:

> "It is not things that disturb us, but our judgments about things." -- Epictetus, *Enchiridion*, 5

This idea -- that our inner life is within our control even when external circumstances are not -- became the beating heart of Stoicism.

\`\`\`mermaid
graph TD
    A[Stoic Virtues] --> B[Wisdom]
    A --> C[Courage]
    A --> D[Justice]
    A --> E[Temperance]
    B --> B1[Knowledge of good and evil]
    C --> C1[Endurance and resilience]
    D --> D1[Fairness toward others]
    E --> E1[Self-control and moderation]
\`\`\`

### The Succession

After Zeno, the school passed to **Cleanthes** (famous for his *Hymn to Zeus*) and then to **Chrysippus**, who systematized Stoic logic so thoroughly that the ancients said, "Without Chrysippus, there would be no Stoa." Unfortunately, almost none of the early Stoics' writings survived intact. What we have today comes mostly from the later **Roman Stoics**: Seneca, Epictetus, and Marcus Aurelius.

### Reflection Questions

1. Zeno's philosophy began with catastrophic loss. How might personal adversity serve as a catalyst for philosophical inquiry?
2. The Stoics insisted all three branches -- logic, physics, ethics -- were inseparable. Why might they resist the modern tendency to study ethics in isolation?

### Deeper Reading

- Diogenes Laertius, *Lives of the Eminent Philosophers*, Book 7 (our primary source on early Stoicism)
- A.A. Long, *Epictetus: A Stoic and Socratic Guide to Life* (Oxford, 2002), Chapter 1
- Stanford Encyclopedia of Philosophy, "Stoicism," Section 1: History`,
    },
    {
      id: "stoic-worldview",
      slug: "stoic-worldview",
      title: "The Stoic Worldview: Logos and Nature",
      content: `## Living According to Nature

<!-- voice:key_insight -->

When the Stoics said we should "live according to nature" (*kata phusin zen*), they did not mean we should run barefoot through forests. They meant something far more precise: we should live according to our **rational nature** -- the capacity for reason that distinguishes human beings from other animals.

### Logos: The Rational Principle

At the center of Stoic physics stands **logos** -- a Greek word meaning "reason," "word," or "rational principle." For the Stoics, logos was not merely a human faculty. It was the **organizing intelligence** pervading the entire cosmos. The universe is not random. It is structured, rational, and purposeful.

Cleanthes, the second head of the Stoic school, wrote in his *Hymn to Zeus*:

> "Most glorious of immortals, many-named, almighty forever, Zeus, first cause of nature, governing all things by law -- hail! For it is right that all mortals should address you."

Here "Zeus" is not the mythological deity hurling thunderbolts. It is the Stoics' name for the rational, active principle that organizes matter. Modern readers might call it natural law, cosmic order, or (in some interpretations) a pantheistic God.

### Materialism and Providence

The Stoics were **materialists**: they believed only bodies are real. Even the soul, even God (logos), are made of a fine, fiery substance -- *pneuma* (breath/spirit) -- that permeates all matter. This puts them in sharp contrast with Plato, who held that the highest realities are immaterial Forms.

Yet Stoic materialism comes with a twist: the universe is **providentially ordered**. Everything happens for a reason. There is a *heimarmene* (fate, destiny) -- an unbreakable causal chain linking every event. The Stoics embraced this fully:

> "Lead me, O Zeus, and thou, O Destiny, to wherever you have assigned me. I shall follow without hesitation; but even if I am disobedient, I shall follow no less." -- Cleanthes, quoted in Epictetus, *Discourses*, 2.23.42

<!-- voice:section_check -->

### The Modern Tension

This is where contemporary readers often push back. If everything is fated, how can we have moral responsibility? The Stoics answered with a subtle distinction: external events are fated, but our **assent** (*synkatathesis*) to impressions is our own. Think of a cylinder rolling down a hill -- gravity provides the push (external cause), but the cylinder rolls because of its own shape (internal nature). We are responsible for our character even within a determined universe.

### A Secular Reading

Many modern Stoics (sometimes called "lowercase-s stoics") strip away the theology entirely. They keep the ethics -- focus on what you can control, cultivate virtue, accept what you cannot change -- while remaining agnostic about cosmic purpose. This is philosophically legitimate, but it does change the flavor. For the ancient Stoics, aligning with logos was not a coping strategy. It was participation in the divine order.

### Reflection Questions

1. Does the Stoic concept of logos resemble any ideas you encounter in modern science, religion, or philosophy?
2. Can Stoic ethics survive without Stoic physics? If you remove the idea of a rationally ordered cosmos, does "live according to nature" still make sense?

### Deeper Reading

- Cleanthes, *Hymn to Zeus* (full text available in A.A. Long and D.N. Sedley, *The Hellenistic Philosophers*, Vol. 1)
- Stanford Encyclopedia of Philosophy, "Stoicism," Section 3: Physics
- Massimo Pigliucci, *How to Be a Stoic* (2017), Chapter 2`,
    },
    {
      id: "stoic-legacy",
      slug: "stoic-legacy",
      title: "The Stoic Legacy: From Rome to the Modern World",
      content: `## Five Centuries and Counting

<!-- voice:key_insight -->

Stoicism was not a flash in the pan. It thrived as a living school for roughly **five hundred years** (c. 300 BCE -- c. 200 CE), making it one of the longest-running philosophical traditions in the ancient world. Its influence extends far beyond that span.

### The Three Great Roman Stoics

While the early Greek Stoics (Zeno, Cleanthes, Chrysippus) built the theoretical framework, the texts that survived -- and that continue to be read worldwide -- belong to three Roman-era figures:

| Philosopher | Life | Social Position | Key Works |
|------------|------|----------------|-----------|
| **Seneca** | c. 4 BCE -- 65 CE | Wealthy advisor to Emperor Nero | *Letters to Lucilius*, *On the Shortness of Life*, *On Anger* |
| **Epictetus** | c. 50 -- 135 CE | Born enslaved, later freed | *Discourses* (recorded by Arrian), *Enchiridion* |
| **Marcus Aurelius** | 121 -- 180 CE | Roman Emperor | *Meditations* (private journal, never intended for publication) |

The range is extraordinary. An imperial advisor, an enslaved person, and an emperor all found Stoicism equally compelling. This universality is not accidental -- it reflects the Stoic conviction that virtue depends on character, not circumstance.

### The Stoic Influence Through History

Stoicism shaped intellectual history in ways most people never realize:

- **Christianity**: Early Church Fathers (Clement of Alexandria, Augustine) absorbed Stoic ideas about logos, natural law, and conscience. The apostle Paul's letter to the Romans echoes Stoic natural-law theory.
- **Enlightenment**: Descartes, Spinoza, and Kant all engaged with Stoic ideas. Kant's categorical imperative has Stoic DNA.
- **American Founding**: Thomas Jefferson kept Seneca on his nightstand. George Washington had *Cato, a Tragedy* (about the Stoic Cato the Younger) performed for his troops at Valley Forge.
- **Modern Psychology**: Cognitive Behavioral Therapy (CBT) directly traces its intellectual lineage to Epictetus. Albert Ellis, CBT's pioneer, credited the *Enchiridion* as a foundational influence.

<!-- voice:section_check -->

### The Modern Stoic Revival

Since roughly 2010, Stoicism has experienced a dramatic popular resurgence. Ryan Holiday's *The Obstacle Is the Way* (2014) brought Stoic ideas to a mainstream audience. Organizations like **Modern Stoicism** run annual "Stoic Week" experiments, and the subreddit r/Stoicism has over a million members.

This revival has drawn both praise and criticism:

**Praise**: Stoicism offers practical, evidence-adjacent tools for emotional resilience. Its emphasis on personal responsibility resonates in an era of information overload and anxiety.

**Criticism**: Some scholars worry that popular Stoicism cherry-picks the palatable parts (resilience, focus) while ignoring the demanding metaphysics and the call to civic virtue. The philosopher Massimo Pigliucci has cautioned against reducing Stoicism to "life hacks for entrepreneurs."

> "The Stoics were not interested in mere tranquility. They were interested in virtue -- and virtue requires engagement with the world, not withdrawal from it." -- Massimo Pigliucci, *How to Be a Stoic* (2017)

### What We Will Do in This Course

Over the next six modules, we will engage with the primary sources -- *Meditations*, *Discourses*, *Letters* -- and read them both on their own terms and through a modern critical lens. Professor Sophia will challenge you at every turn: *Does this actually hold up? What are you assuming? Where might the Stoics be wrong?*

### Reflection Questions

1. Why do you think Stoicism appeals to people across such different social positions -- from enslaved people to emperors?
2. Is there a risk in separating Stoic "techniques" from Stoic philosophy as a whole? What might be lost?

### Deeper Reading

- Ryan Holiday and Stephen Hanselman, *Lives of the Stoics* (2020) -- accessible biographical introductions
- William Irvine, *A Guide to the Good Life: The Ancient Art of Stoic Joy* (2009), Introduction
- Stanford Encyclopedia of Philosophy, "Stoicism," Sections 1-2`,
    },
    {
      id: "stoic-checkpoint-1",
      slug: "stoic-checkpoint-1",
      title: "Checkpoint: What Is Stoicism?",
      content: `## Module 1 Checkpoint

<!-- voice:section_check -->

Excellent work completing the first module! Before we move on to the Dichotomy of Control, let us test your understanding of Stoic origins, worldview, and legacy.

---

### Question 1 (Multiple Choice)

Where did Zeno of Citium teach, giving his school its name?

- A) The Academy (Plato's school)
- B) The Lyceum (Aristotle's school)
- C) The Stoa Poikile (Painted Porch)
- D) The Library of Alexandria

<details>
<summary>Answer</summary>

**C) The Stoa Poikile (Painted Porch)**. Zeno began teaching at this colonnade in the Athenian agora around 300 BCE. His followers were called *Stoikoi* -- people of the Stoa.
</details>

---

### Question 2 (Multiple Choice)

The Stoics divided philosophy into three parts. Which metaphor did they use to describe ethics?

- A) The shell of an egg
- B) The fruit of a field
- C) The roots of a tree
- D) The sails of a ship

<details>
<summary>Answer</summary>

**B) The fruit of a field.** In the field metaphor, logic is the fence, physics is the soil, and ethics is the fruit -- the ultimate purpose of philosophical study.
</details>

---

### Question 3 (Short Answer)

What is *logos* in Stoic philosophy, and how does it differ from the everyday English meaning of "logic"?

<details>
<summary>Sample Answer</summary>

For the Stoics, *logos* is the rational, organizing principle that pervades the entire cosmos -- not just human reasoning, but the intelligence that structures all of nature. Unlike the modern English word "logic" (which refers narrowly to formal rules of valid argument), Stoic *logos* is both a cosmic force and the faculty within each human that allows us to participate in that rational order.
</details>

---

### Question 4 (Application)

Imagine you just received devastating news: you did not get a job you desperately wanted. Using what you know so far about Stoic philosophy, how would a Stoic approach this situation? Be specific -- reference at least one Stoic concept from this module.

<details>
<summary>Sample Answer</summary>

A Stoic would begin with Epictetus's core insight: "It is not things that disturb us, but our judgments about things" (*Enchiridion*, 5). The job rejection itself is an external event -- it belongs to the category of things not fully within our control. The Stoic response is not to suppress emotion, but to examine the *judgment* we attach to the event. Are we treating the job as necessary for a good life? Stoic philosophy argues that eudaimonia depends on virtue and rational character, not on any particular external outcome. The Stoic would grieve briefly, then redirect energy toward what *is* within their control: preparing for the next opportunity, reflecting on what they learned, and maintaining their character through adversity.
</details>

---

### Question 5 (Multiple Choice)

Which modern psychological therapy explicitly credits Epictetus as an intellectual ancestor?

- A) Psychoanalysis
- B) Cognitive Behavioral Therapy (CBT)
- C) Gestalt therapy
- D) Existential therapy

<details>
<summary>Answer</summary>

**B) Cognitive Behavioral Therapy (CBT).** Albert Ellis, a pioneer of CBT (originally called Rational Emotive Behavior Therapy), directly cited Epictetus's *Enchiridion* as a foundational influence on his approach.
</details>

---

### Voice Summary Prompt

Try explaining the following out loud or in writing, as if teaching a friend:

*"What is Stoicism, where did it come from, and why does it still matter today?"*

Aim for about 60 seconds. Hit these points:
- Zeno and the Stoa Poikile
- The three branches (logic, physics, ethics)
- The core promise (eudaimonia through virtue)
- At least one reason Stoicism endures

You have completed Module 1! In the next module, we will dive into what many consider the single most powerful Stoic idea: the Dichotomy of Control.`,
    },
  ],
};

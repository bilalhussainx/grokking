import { Module } from "../types";

export const stoicPracticesModule: Module = {
  id: "stoic-practices",
  title: "Stoic Practices",
  description:
    "Move from theory to action. Learn the daily exercises the Stoics used to train their character: journaling, negative visualization, amor fati, memento mori, and the evening review.",
  lessons: [
    {
      id: "morning-evening-practice",
      slug: "morning-evening-practice",
      title: "The Morning and Evening Practice",
      content: `## Philosophy as a Daily Discipline

<!-- voice:key_insight -->

The Stoics were adamant: philosophy is not something you *study*. It is something you *practice*. Every single day. Pierre Hadot, the French philosopher who did more than anyone to recover this dimension of ancient thought, called it **"philosophy as a way of life"** -- as opposed to philosophy as an academic discipline.

The Stoics structured their day around two bookend practices: a **morning preparation** and an **evening review**.

### The Morning Practice: Premeditatio

Marcus Aurelius opens Book 2 of the *Meditations* with one of the most famous morning routines in philosophical literature:

> "Begin each day by telling yourself: today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness -- all of them due to the offenders' ignorance of what is good or evil." -- Marcus Aurelius, *Meditations*, 2.1

This is not pessimism. It is **premeditatio malorum** -- the premeditation of adversity. By rehearsing potential difficulties in advance, the Stoic is not inviting trouble but **removing surprise**. When you have already contemplated that your colleague might be rude or your plan might fail, the actual event loses its power to destabilize you.

Marcus continues:

> "But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own... and so none of them can injure me." -- Marcus Aurelius, *Meditations*, 2.1

The morning practice includes:

1. **Anticipate difficulties**: What might go wrong today? Who might be difficult?
2. **Rehearse your principles**: What is within my control? What is not?
3. **Set an intention**: What virtue will I focus on today? (Justice? Temperance? Courage?)
4. **Remember your mortality**: This day might be your last. Use it well.

### The Evening Review: Examen

<!-- voice:section_check -->

Seneca describes the evening counterpart:

> "When the light has been removed and my wife has fallen silent, I examine my entire day and go back over what I have done and said, hiding nothing from myself and passing nothing by." -- Seneca, *On Anger*, 3.36

Seneca's evening review asks three questions:

1. **What went well today?** Where did I act in accordance with my values?
2. **What went badly?** Where did I fall short? (Not to punish yourself, but to learn.)
3. **What can I do better tomorrow?** What specific adjustment will I make?

This practice is remarkably similar to modern **reflective journaling** techniques used in psychology, coaching, and mindfulness programs. The key Stoic addition: the review is specifically *moral*, not just emotional or practical. It asks not "How did I feel?" but "Did I act virtuously?"

\`\`\`mermaid
graph LR
    A[Morning] --> B[Premeditatio Malorum]
    B --> C[Day]
    C --> D[Mindful Action]
    C --> E[Dichotomy of Control]
    D --> F[Evening]
    E --> F
    F --> G[What went well?]
    F --> H[What to improve?]
\`\`\`

### Journaling: The Meditations as Model

Marcus Aurelius's *Meditations* are themselves the product of this daily practice. They are a philosophical journal -- not written for anyone else, but as a tool for self-examination and self-correction.

Modern Stoic practitioners often keep a journal modeled on Marcus's approach:

- **Prompts**: What am I grateful for? Where was I tested? How did I respond?
- **Principles**: Write out a Stoic maxim and reflect on how it applies to today
- **Corrections**: Note where you failed and what you will do differently
- **Affirmations of mortality**: "I may not have another day. Did I use this one well?"

### The Practical Challenge

The difficulty is consistency. Marcus returned to the same themes hundreds of times across the *Meditations* -- not because he forgot them, but because **knowing a principle and living it are different things**. The daily practice exists precisely because virtue is not a destination but a continuous effort.

> "No one is so fortunate that there will not be those around them who wish them ill. If you would live at peace, you must exert yourself daily." -- Seneca, *Letters to Lucilius*, 2 (paraphrased)

### Reflection Questions

1. Do you currently have a morning or evening reflective practice? If so, how does it compare to the Stoic version? If not, what barriers prevent you from starting one?
2. Marcus rehearses difficulties each morning. Could this practice backfire -- making someone more anxious rather than more prepared? Under what conditions?

### Deeper Reading

- Pierre Hadot, *Philosophy as a Way of Life* (Blackwell, 1995), especially Chapter 3
- Marcus Aurelius, *Meditations*, 2.1 and 5.1 (morning practice examples)
- Seneca, *On Anger*, 3.36 (evening review)
- Donald Robertson, *How to Think Like a Roman Emperor*, Chapter 2: "The Philosopher's Apprentice"`,
    },
    {
      id: "negative-visualization-memento-mori",
      slug: "negative-visualization-memento-mori",
      title: "Negative Visualization and Memento Mori",
      content: `## Imagining Loss to Appreciate What You Have

<!-- voice:key_insight -->

Two of the most distinctive Stoic practices involve deliberately contemplating loss and death. To modern sensibilities, this can seem morbid. The Stoics considered it essential to a well-lived life.

### Premeditatio Malorum: Negative Visualization

**Negative visualization** (*premeditatio malorum* -- "premeditation of evils") is the practice of imagining that you have lost the things you value. Not to generate anxiety, but to accomplish two things:

1. **Appreciate what you have** by contrast with its absence
2. **Reduce the shock** if loss actually occurs

Seneca describes the practice:

> "Let us envisage every possibility and strengthen our minds against whatever may happen. Rehearse them in your mind: exile, torture, wars, shipwrecks. Misfortune may snatch you away from your country... We must make ourselves flexible, so that we do not become paralyzed by our love of any one thing." -- Seneca, *Letters to Lucilius*, 91 (paraphrased)

William Irvine, in *A Guide to the Good Life*, recommends a gentler modern version:

- Periodically imagine your spouse or close friend is gone. Not to dwell in grief, but to **feel gratitude** for their presence today.
- Imagine losing your job, your home, your health. Then open your eyes and realize: you still have them. This is the moment to appreciate them.
- Before complaining about a daily annoyance, imagine life without the thing the annoyance accompanies. Traffic is annoying -- but you have a car and somewhere to go.

### The Psychology of Hedonic Adaptation

Modern psychology supports the intuition behind negative visualization. **Hedonic adaptation** is the well-documented tendency for humans to return to a baseline level of satisfaction regardless of improvements in their circumstances. We get a raise, a new car, a bigger house -- and within weeks, the pleasure fades. We are back to baseline.

Negative visualization interrupts this cycle by **refreshing gratitude**. It is the philosophical equivalent of absence making the heart grow fonder.

<!-- voice:section_check -->

### Memento Mori: Remember You Will Die

**Memento mori** -- "remember death" -- is the most intense form of negative visualization. The Stoics did not shy from it:

> "Let us prepare our minds as if we had come to the very end of life. Let us postpone nothing. Let us balance life's books each day." -- Seneca, *Letters to Lucilius*, 101

> "You could leave life right now. Let that determine what you do and say and think." -- Marcus Aurelius, *Meditations*, 2.11

Marcus returns to death dozens of times throughout the *Meditations*. It is his most persistent theme:

> "Think of yourself as dead. You have lived your life. Now, take what is left and live it properly." -- Marcus Aurelius, *Meditations*, 7.56

The practice has two dimensions:

**Personal mortality**: You will die. This is not a threat but a fact. The Stoic response is not fear but **urgency** -- if time is limited, waste none of it on pettiness, grudges, or triviality.

**Universal mortality**: Everyone you know will die. Every empire will fall. Every monument will crumble. This is the "view from above" we encountered in Module 3 -- the cosmic perspective that liberates us from excessive attachment to transient things.

### Historical Practice

In Roman culture, memento mori was not purely philosophical. During a Roman *triumph* (a victorious general's parade through Rome), a slave reportedly stood behind the general whispering: *"Memento mori"* -- remember that you are mortal. Whether historically accurate or not, the tradition captures the Stoic conviction that **awareness of death is not morbid but liberating**.

### The Criticism: Gratitude or Anxiety?

Critics of negative visualization argue it can increase anxiety rather than gratitude -- especially in people prone to worry, catastrophizing, or clinical anxiety disorders. The psychologist and Stoicism scholar Tim LeBon has conducted research through Modern Stoicism's "Stoic Week" project suggesting that the practice works well for many people but should be approached cautiously by those with anxiety conditions.

The Stoic response: the exercise is meant to be done **deliberately, briefly, and with philosophical framing** -- not as open-ended rumination. The difference between negative visualization and anxious catastrophizing is *intentionality and duration*.

### Reflection Questions

1. Try a brief negative visualization right now: imagine that something you take for granted -- a relationship, your health, your home -- was suddenly gone. What do you notice about your emotional response?
2. Does the idea of meditating on death strike you as liberating or disturbing? Why do you think the Stoics considered it so central?

### Deeper Reading

- William Irvine, *A Guide to the Good Life*, Chapter 4: "Negative Visualization"
- Seneca, *On the Shortness of Life* (entire essay)
- Marcus Aurelius, *Meditations*, 2.11, 4.17, 6.15, 7.56 (death reflections)
- Havi Carel, *Illness: The Cry of the Flesh* (2008) -- a phenomenological perspective on mortality`,
    },
    {
      id: "amor-fati-present-moment",
      slug: "amor-fati-present-moment",
      title: "Amor Fati and the Present Moment",
      content: `## Loving Your Fate

<!-- voice:key_insight -->

The phrase **amor fati** -- "love of fate" -- is most associated with Friedrich Nietzsche, but the concept is thoroughly Stoic. The idea: do not merely *accept* what happens to you. *Embrace* it. Love it. Treat every event -- including hardship -- as necessary and good.

Marcus Aurelius articulates this extraordinary demand:

> "A blazing fire makes flame and brightness out of everything that is thrown into it." -- Marcus Aurelius, *Meditations*, 10.31

> "Accept the things to which fate binds you, and love the people with whom fate brings you together, and do so with all your heart." -- Marcus Aurelius, *Meditations*, 6.39

This goes beyond the Dichotomy of Control. Epictetus teaches us to *accept* what we cannot control. Marcus asks us to *love* it. The universe, governed by logos, produces exactly the events that need to happen. Your job is not to resist but to find the virtue in your response.

### The Obstacle Is the Way

One of the most powerful passages in the *Meditations* captures this attitude:

> "The impediment to action advances action. What stands in the way becomes the way." -- Marcus Aurelius, *Meditations*, 5.20

Ryan Holiday built an entire book (*The Obstacle Is the Way*, 2014) around this sentence. The core insight: obstacles are not interruptions to a good life. They are the *material* of a good life. Every difficulty is an opportunity to practice virtue -- patience, courage, wisdom, justice.

Lost your job? An opportunity to practice resilience and reinvent yourself.
Someone treated you unfairly? An opportunity to practice justice and compassion.
Your health is failing? An opportunity to practice courage and perspective.

<!-- voice:section_check -->

### The Eternal Return (Nietzsche's Amplification)

Nietzsche took the Stoic idea further with his thought experiment of the **eternal return**: imagine that you will live this exact life -- every joy, every suffering, every moment -- an infinite number of times. Could you say yes to that? Could you *want* it?

> "My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity." -- Friedrich Nietzsche, *Ecce Homo*, "Why I Am So Clever," 10

The difference between Nietzsche and the Stoics: the Stoics' amor fati is grounded in a rational, providential cosmos. Nietzsche's is an act of sheer will in a universe without inherent meaning. Both arrive at the same practice -- say yes to everything -- but from opposite philosophical foundations.

### Living in the Present Moment

Closely related to amor fati is the Stoic emphasis on **present-moment attention**. Marcus writes:

> "Never regard something as doing you good if it makes you betray a trust, or lose your sense of shame, or makes you show hatred, suspicion, ill will, or hypocrisy, or a desire for things best done behind closed doors." -- Marcus Aurelius, *Meditations*, 3.7

> "Give yourself a gift: the present moment." -- Marcus Aurelius, *Meditations*, 8.44 (paraphrased)

Seneca reinforces:

> "True happiness is to enjoy the present, without anxious dependence upon the future, not to amuse ourselves with either hopes or fears but to rest satisfied with what we have." -- Seneca, *Letters to Lucilius*, 2 (paraphrased)

This is not mindfulness in the modern therapeutic sense (though the overlap is real). The Stoic present-moment practice is specifically *moral*: attend to what is happening now so that you can respond with virtue now. The past is gone; the future is uncertain; only the present offers the opportunity for right action.

### The Difficulty of Amor Fati

Let us be honest: amor fati is the hardest Stoic concept. Accepting what you cannot change is difficult enough. *Loving* it -- including suffering, loss, and injustice -- pushes against every natural human instinct.

Critics argue that amor fati can become a justification for passivity or for tolerating injustice. "Love your fate" can sound dangerously close to "accept oppression and be grateful."

The Stoic defense: amor fati does not mean approving of injustice or refusing to act against it. It means accepting *reality as it is* as the starting point for action, rather than wasting energy wishing reality were different. You can love your fate *and* work to change unjust conditions. The love is directed at the challenge itself -- at the opportunity to exercise virtue.

### Reflection Questions

1. Think of a significant difficulty you have faced. In retrospect, did it produce any growth, insight, or strength you would not have gained otherwise? Does this make it worth loving?
2. Where is the line between amor fati (healthy acceptance) and resignation (unhealthy passivity)?

### Deeper Reading

- Marcus Aurelius, *Meditations*, 5.20, 6.39, 10.31
- Ryan Holiday, *The Obstacle Is the Way* (2014)
- Friedrich Nietzsche, *The Gay Science*, Section 341 (the eternal return)
- William Irvine, *A Guide to the Good Life*, Chapter 10: "Duty"`,
    },
    {
      id: "stoic-checkpoint-6",
      slug: "stoic-checkpoint-6",
      title: "Checkpoint: Stoic Practices",
      content: `## Module 6 Checkpoint

<!-- voice:section_check -->

You have now learned the core Stoic practices -- the daily exercises that transform philosophy from theory into lived experience. Let us test your understanding.

---

### Question 1 (Multiple Choice)

What is *premeditatio malorum*?

- A) A form of pessimistic worldview that expects the worst
- B) The deliberate practice of imagining potential adversities to reduce their emotional impact
- C) A Stoic prayer recited before meals
- D) A technique for suppressing all emotions

<details>
<summary>Answer</summary>

**B) The deliberate practice of imagining potential adversities to reduce their emotional impact.** Premeditatio malorum ("premeditation of evils") removes the element of surprise and, when practiced correctly, also generates gratitude for what you currently have.
</details>

---

### Question 2 (Short Answer)

Describe Seneca's evening review practice. What three questions does it involve, and what is its purpose?

<details>
<summary>Sample Answer</summary>

Seneca describes examining his entire day after the evening light has been removed. The three questions are: (1) What went well today -- where did I act in accordance with my values? (2) What went badly -- where did I fall short? (3) What can I do better tomorrow? The purpose is not self-punishment but moral learning. It is a deliberate, honest self-examination designed to gradually improve one's character through consistent reflection. Seneca emphasizes hiding nothing from himself and passing nothing by.
</details>

---

### Question 3 (Multiple Choice)

Marcus Aurelius writes: "The impediment to action advances action. What stands in the way becomes the way" (*Meditations*, 5.20). This passage is most closely associated with which Stoic concept?

- A) The Dichotomy of Control
- B) Preferred indifferents
- C) Amor fati / the obstacle is the way
- D) The unity of the virtues

<details>
<summary>Answer</summary>

**C) Amor fati / the obstacle is the way.** This passage captures the Stoic practice of treating obstacles not as interruptions to a good life but as the very material from which a good life is built -- opportunities to exercise virtue.
</details>

---

### Question 4 (Application)

Your morning commute is ruined by a massive traffic jam. You will be 30 minutes late to an important meeting. Using two different Stoic practices from this module, describe how a Stoic would handle this situation. Be specific about which practices you are applying.

<details>
<summary>Sample Answer</summary>

**Practice 1 -- Premeditatio malorum (morning practice):** If I had done my morning Stoic preparation, I would have already considered possible difficulties: "Today I may encounter delays, frustrations, and things beyond my control." Having rehearsed this, the traffic jam loses its power to shock and enrage me. I already expected that something like this might happen.

**Practice 2 -- Amor fati / the obstacle is the way:** Rather than fuming uselessly, I can treat this obstacle as an opportunity. The traffic jam is a chance to practice patience (temperance), to listen to something educational, or to use the unexpected quiet time for reflection. Marcus would say: "A blazing fire makes flame and brightness out of everything that is thrown into it." The delay itself becomes fuel for virtue. Meanwhile, I can take the practical step of calling ahead to let my colleagues know -- focusing on what is within my control (my response) rather than what is not (the traffic).
</details>

---

### Question 5 (Multiple Choice)

What is the key difference between Stoic negative visualization and anxious catastrophizing?

- A) There is no difference; they are the same mental process
- B) Negative visualization is deliberate, brief, and philosophically framed; catastrophizing is involuntary and open-ended
- C) Negative visualization focuses on positive outcomes; catastrophizing focuses on negative ones
- D) Negative visualization is only for advanced practitioners; catastrophizing is for beginners

<details>
<summary>Answer</summary>

**B) Negative visualization is deliberate, brief, and philosophically framed; catastrophizing is involuntary and open-ended.** The Stoic practice is an intentional exercise done for a specific purpose (generating gratitude and reducing shock), conducted within a philosophical framework. Anxious catastrophizing is involuntary, prolonged, and lacks the grounding in Stoic principles that gives negative visualization its therapeutic value.
</details>

---

### Voice Summary Prompt

In about 2 minutes, walk through your ideal "Stoic daily routine," explaining:

*"What would a morning and evening Stoic practice look like for a modern person?"*

Include:
- The morning preparation (premeditatio malorum)
- At least one practice during the day (negative visualization, amor fati, or memento mori)
- The evening review (Seneca's three questions)

You are nearly there! In the final module, you will synthesize everything you have learned and design your own personal Stoic practice.`,
    },
  ],
};

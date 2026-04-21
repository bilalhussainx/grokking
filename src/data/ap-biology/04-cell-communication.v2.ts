import { Module } from "../types";

export const cellCommunicationModule: Module = {
  id: "ap-bio-cell-communication",
  title: "Cell Communication",
  description: "Learn how cells send, receive, and respond to chemical signals — from signal transduction pathways to hormones and feedback loops. Reference: Campbell Biology (Urry et al., 12th ed., Pearson, 2021), Chapter 11.",
  lessons: [
    {
      id: "ap-bio-signal-transduction",
      slug: "signal-transduction",
      title: "Signal Transduction: How Cells Talk to Each Other",
      content: `## Signal Transduction: How Cells Talk to Each Other

<!-- voice:section_check concept="The three stages of cell signaling" -->

### What You'll Learn

- The three stages of cell signaling: reception, transduction, and response
- How a signal molecule triggers a cascade inside the cell
- Why signal amplification matters

### Cells Are Constantly Talking

Imagine a city where no one could communicate — no phones, no mail, no shouting. Traffic would be chaos, emergencies would go unanswered, and nothing would get coordinated. Your body faces the same challenge: trillions of cells need to coordinate their activities. They do this through **cell signaling** — chemical conversations between cells.

The process follows three steps, first described as a general model by Martin Rodbell and Alfred Gilman (who shared the 1994 Nobel Prize in Physiology or Medicine for discovering G-proteins):

<!-- voice:section_check concept="Reception, transduction, and response" -->

### The Three Stages

**1. Reception** — A signaling molecule (called a **ligand**) binds to a **receptor protein** on the target cell. Think of it like a key fitting into a lock. The receptor is usually on the cell surface, but some signals (like steroid hormones) pass through the membrane and bind to receptors inside the cell.

**2. Transduction** — Binding triggers a chain of molecular events inside the cell, called a **signal transduction pathway**. This is like a relay race: one molecule activates the next, which activates the next. Each step can amplify the signal — one receptor activating 100 molecules, each of which activates 100 more.

**3. Response** — The signal ultimately causes a cellular change: turning a gene on or off, releasing a molecule, changing the cell's shape, or even triggering cell death.

| Stage | What Happens | Analogy |
|-------|-------------|---------|
| Reception | Ligand binds receptor | Doorbell rings |
| Transduction | Relay molecules pass the signal | You hear the bell, walk to the door, look through the peephole |
| Response | Cell changes behavior | You decide to open the door (or not) |

### Signal Amplification

One of the most important features of signal transduction is **amplification**. A single signaling molecule can trigger a cascade that produces millions of product molecules. For example, when adrenaline (epinephrine) binds to a liver cell, the cascade ultimately breaks down enough glycogen to flood the bloodstream with glucose — all from one molecule.

<!-- voice:key_insight insight="Signal transduction amplifies a tiny signal into a massive cellular response — one adrenaline molecule can release millions of glucose molecules." -->

### Reflection Questions

1. Why is it useful for cells to amplify signals rather than responding in a 1:1 ratio?
2. What would happen if a mutation caused a receptor to be permanently "on" — always sending signals even without a ligand?
3. How is cell signaling similar to sending a text message? Where does the analogy break down?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 11 — "Cell Communication"
- **Nobel Prize Organization**, "Rodbell & Gilman — Nobel Lecture, 1994" — discovery of G-protein signal transduction
- **Alberts et al.**, *Molecular Biology of the Cell*, 7th ed., Garland Science, 2022, Chapter 15 — detailed signaling pathways
`,
    },
    {
      id: "ap-bio-hormones",
      slug: "hormones",
      title: "Hormones: Long-Distance Chemical Messengers",
      content: `## Hormones: Long-Distance Chemical Messengers

<!-- voice:section_check concept="What hormones are and how endocrine signaling works" -->

### What You'll Learn

- The difference between endocrine, paracrine, and autocrine signaling
- How hormones travel through the body and affect target cells
- Key examples of hormones and their functions

### The Body's Postal Service

In the previous lesson, we looked at how cells signal each other up close. But what about cells that are far apart — like your brain telling your muscles to get ready for a sprint? That's where **hormones** come in.

Think of hormones as letters sent through the postal system (your bloodstream). They're released by one organ, travel through the blood, and deliver their message to specific target cells that have the right receptors.

<!-- voice:section_check concept="Types of signaling by distance" -->

### Signaling by Distance

| Type | Distance | Delivery Method | Example |
|------|----------|----------------|---------|
| **Autocrine** | Same cell | Signal acts on the cell that produced it | A T-cell stimulating its own growth |
| **Paracrine** | Nearby cells | Diffusion through local fluid | Histamine release during inflammation |
| **Endocrine** | Distant cells | Bloodstream | Insulin from the pancreas affecting muscle cells |
| **Synaptic** | Across a synapse | Neurotransmitter diffusion | Acetylcholine at a nerve-muscle junction |

### Two Types of Hormones

Hormones come in two main chemical categories, and their chemistry determines how they signal:

**Water-soluble hormones** (like insulin) cannot cross the cell membrane. They bind to receptors on the cell surface and trigger signal transduction pathways inside the cell. Their effects are fast but short-lived.

**Lipid-soluble hormones** (like testosterone and estrogen) can pass directly through the cell membrane. They bind to receptors inside the cell, often in the nucleus, where they directly activate or silence specific genes. Their effects are slower but longer-lasting.

| Hormone | Type | Source | Key Function |
|---------|------|--------|-------------|
| **Insulin** | Water-soluble (peptide) | Pancreas (beta cells) | Lowers blood glucose |
| **Glucagon** | Water-soluble (peptide) | Pancreas (alpha cells) | Raises blood glucose |
| **Estrogen** | Lipid-soluble (steroid) | Ovaries | Development, menstrual cycle |
| **Testosterone** | Lipid-soluble (steroid) | Testes | Development, muscle growth |
| **Thyroid hormone (T3/T4)** | Modified amino acid | Thyroid gland | Metabolism regulation |
| **Adrenaline (epinephrine)** | Water-soluble (amino acid derivative) | Adrenal medulla | Fight-or-flight response |

<!-- voice:key_insight insight="The chemistry of a hormone determines whether it knocks on the door (binds a surface receptor) or walks right in (crosses the membrane to bind an internal receptor)." -->

### Reflection Questions

1. Why do steroid hormones act more slowly than peptide hormones?
2. Insulin and glucagon have opposite effects on blood sugar. Why is it useful to have two hormones that oppose each other?
3. When you're startled, adrenaline floods your bloodstream in seconds. Is adrenaline water-soluble or lipid-soluble? How does that explain its speed?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 45 — "Hormones and the Endocrine System"
- **Marieb & Hoehn**, *Human Anatomy and Physiology*, 11th ed., Pearson, 2019, Chapter 16 — detailed endocrine physiology
- **Khan Academy**, "Endocrine system" — free video introduction to hormones and glands
`,
    },
    {
      id: "ap-bio-feedback-loops",
      slug: "feedback-loops",
      title: "Feedback Loops: How the Body Stays Balanced",
      content: `## Feedback Loops: How the Body Stays Balanced

<!-- voice:section_check concept="Negative and positive feedback in biological systems" -->

### What You'll Learn

- What homeostasis means and why it matters
- How negative feedback loops maintain stability
- How positive feedback loops amplify change

### The Thermostat Analogy

Your house has a thermostat. If the temperature drops below the set point, the heater turns on. Once the temperature reaches the set point, the heater turns off. This is a **feedback loop** — the output of the system (temperature) feeds back to control the input (heater).

Your body works the same way. **Homeostasis** is the body's ability to maintain a stable internal environment despite changes outside. Your body temperature stays near 37 degrees C, your blood glucose stays within a narrow range, and your blood pH stays around 7.4 — all thanks to feedback loops.

<!-- voice:section_check concept="Negative feedback vs. positive feedback" -->

### Negative Feedback: Keeping Things Steady

**Negative feedback** reduces the output to return the system to its set point. "Negative" doesn't mean bad — it means the response opposes the change.

**Example — Blood Glucose Regulation:**

1. You eat a meal, and blood glucose rises
2. The pancreas detects high glucose and releases **insulin**
3. Insulin tells cells to absorb glucose, lowering blood levels
4. When glucose returns to normal, insulin release stops

If blood glucose drops too low (between meals), the pancreas releases **glucagon**, which tells the liver to release stored glucose. This is a complementary negative feedback loop — two hormones working as a team.

### Positive Feedback: Pushing to Completion

**Positive feedback** amplifies the output, pushing the system further from its starting point. This is rare in biology because it's inherently unstable — it needs an external event to stop it.

**Example — Childbirth (Labor):**

1. The baby's head pushes against the cervix
2. Nerve signals tell the brain to release **oxytocin**
3. Oxytocin causes stronger uterine contractions
4. Stronger contractions push the baby's head harder against the cervix
5. More oxytocin is released, causing even stronger contractions
6. The cycle continues, escalating until the baby is born (which removes the stimulus)

| Feature | Negative Feedback | Positive Feedback |
|---------|-------------------|-------------------|
| **Direction** | Opposes change | Amplifies change |
| **Goal** | Return to set point | Push to completion |
| **Stability** | Maintains equilibrium | Inherently unstable |
| **Frequency** | Very common | Rare |
| **Examples** | Body temperature, blood glucose, blood pressure | Childbirth, blood clotting, fruit ripening |

<!-- voice:key_insight insight="Negative feedback is the body's default strategy — it keeps you stable. Positive feedback is reserved for situations that need to reach a definitive endpoint, like birth or blood clotting." -->

### When Feedback Fails: Diabetes

Type 1 diabetes occurs when the immune system destroys the insulin-producing beta cells in the pancreas. Without insulin, the negative feedback loop for blood glucose breaks — glucose rises after meals but has no signal telling cells to absorb it. This is why Type 1 diabetics need insulin injections: they're manually restoring a broken feedback loop.

### Reflection Questions

1. A person with a high fever has a body temperature of 40 degrees C. Is their negative feedback loop for temperature working correctly? What might have gone wrong?
2. Why would a purely positive feedback system be dangerous without a stopping mechanism?
3. Blood clotting uses positive feedback — once a clot starts forming, it accelerates. Why does this make biological sense for wound healing?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 40 — "Basic Principles of Animal Form and Function"
- **Marieb & Hoehn**, *Human Anatomy and Physiology*, 11th ed., Pearson, 2019, Chapter 1 — homeostasis and feedback mechanisms
- **Khan Academy**, "Homeostasis" — free video with examples of feedback loops
`,
    },
    {
      id: "ap-bio-communication-checkpoint",
      slug: "communication-checkpoint",
      title: "Checkpoint: Cell Communication",
      content: `## Module Checkpoint: Cell Communication

### Review

In this module, you explored how cells communicate through signal transduction pathways, how hormones serve as long-distance chemical messengers, and how feedback loops maintain homeostasis. You learned the three stages of cell signaling (reception, transduction, response), the difference between water-soluble and lipid-soluble hormones, and how negative and positive feedback keep the body balanced.

<!-- voice:section_check concept="Module review — cell communication" -->

### Quiz

**Question 1:** In signal transduction, what is the term for a signaling molecule that binds to a receptor?
A) Enzyme
B) Ligand
C) Substrate
D) Antibody

**Question 2:** True or False: Steroid hormones bind to receptors on the cell surface because they cannot cross the cell membrane.
Explain your reasoning.

**Question 3:** The type of feedback that opposes change and returns the body to a set point is called __________ feedback.

**Question 4:** In 2-3 sentences, explain why signal amplification is important. Use the adrenaline example from the lesson.

**Question 5:** A patient's pancreas stops producing insulin. Describe what happens to their blood glucose levels and explain which feedback loop has been disrupted.

<!-- voice:key_insight insight="Cell communication connects molecules, cells, organs, and systems — it's how a collection of trillions of independent cells acts as one coordinated organism." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

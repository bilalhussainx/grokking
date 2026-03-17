import { Module } from "../types";

export const cellularEnergeticsModule: Module = {
  id: "ap-bio-cellular-energetics",
  title: "Cellular Energetics",
  description:
    "Understand how cells capture and use energy — from photosynthesis to cellular respiration to the central role of ATP. Reference: Campbell Biology (Urry et al., 12th ed., Pearson, 2021), Chapters 8-10.",
  lessons: [
    {
      id: "ap-bio-photosynthesis",
      slug: "photosynthesis",
      title: "Photosynthesis: Capturing Sunlight",
      content: `## Photosynthesis: Capturing Sunlight

<!-- voice:section_check concept="How photosynthesis converts light energy to chemical energy" -->

### What You'll Learn

- The overall equation and purpose of photosynthesis
- Where each stage happens inside the chloroplast
- How the light reactions and Calvin cycle work together

### Eating Sunlight

Every sandwich you eat, every apple you bite into, every grain of rice on your plate — all of that food energy originally came from the sun. **Photosynthesis** is the process that captures sunlight and converts it into chemical energy (glucose) that organisms can use.

The overall equation:

**6CO2 + 6H2O + light energy --> C6H12O6 + 6O2**

In plain English: carbon dioxide + water + sunlight produces glucose + oxygen. Plants, algae, and cyanobacteria are the organisms that perform this feat, and the oxygen you breathe is their byproduct.

<!-- voice:section_check concept="Light reactions vs. Calvin cycle" -->

### Two Stages in Two Locations

Photosynthesis happens inside **chloroplasts** and involves two stages:

| Stage | Location | Input | Output | Needs Light? |
|-------|----------|-------|--------|-------------|
| **Light reactions** | Thylakoid membranes | Water, light | ATP, NADPH, O2 | Yes |
| **Calvin cycle** | Stroma | CO2, ATP, NADPH | G3P (glucose precursor) | No (but needs products from light reactions) |

**Stage 1 — Light Reactions:** Think of this as charging the batteries. Chlorophyll absorbs sunlight, which energizes electrons. Water is split (releasing O2 as a byproduct), and the energy is used to produce **ATP** and **NADPH** — the energy carriers.

**Stage 2 — Calvin Cycle:** Think of this as using the batteries to build something. The ATP and NADPH from the light reactions power a cycle that fixes CO2 from the air into an organic molecule called **G3P**, which the plant uses to build glucose.

The Calvin cycle was discovered by Melvin Calvin, Andrew Benson, and James Bassham at UC Berkeley in the 1950s using radioactive carbon-14 to trace the path of carbon — earning Calvin the 1961 Nobel Prize in Chemistry.

<!-- voice:key_insight insight="Photosynthesis has two stages: the light reactions charge the energy carriers (ATP and NADPH), and the Calvin cycle uses them to build sugar from CO2." -->

### Why Leaves Are Green

The pigment **chlorophyll** absorbs red and blue wavelengths of light but reflects green — which is why leaves appear green to our eyes. In autumn, as chlorophyll breaks down, other pigments (yellow carotenoids, red anthocyanins) are revealed, creating fall colors.

### Reflection Questions

1. The Calvin cycle is sometimes called the "dark reactions." Why is this name misleading?
2. If a plant is placed in a sealed container with no CO2, which stage of photosynthesis stops first — the light reactions or the Calvin cycle?
3. How does photosynthesis connect to the food you ate for breakfast today?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 10 — "Photosynthesis"
- **Nobel Prize Organization**, "Melvin Calvin — Nobel Lecture, 1961" — Calvin's own description of tracing carbon in photosynthesis
- **Nature Education**, "Photosynthesis" — Scitable article with clear diagrams of the light reactions and Calvin cycle
`,
    },
    {
      id: "ap-bio-cellular-respiration",
      slug: "cellular-respiration",
      title: "Cellular Respiration: Unlocking Energy from Food",
      content: `## Cellular Respiration: Unlocking Energy from Food

<!-- voice:section_check concept="How cells extract energy from glucose" -->

### What You'll Learn

- The overall equation and purpose of cellular respiration
- The three main stages: glycolysis, the Krebs cycle, and oxidative phosphorylation
- How much ATP one glucose molecule produces

### The Reverse of Photosynthesis

If photosynthesis is like charging a battery, **cellular respiration** is like draining that battery to power your phone. Cells break down glucose to release the energy stored in its chemical bonds, capturing that energy as **ATP**.

The overall equation:

**C6H12O6 + 6O2 --> 6CO2 + 6H2O + ~36-38 ATP**

Notice this is essentially photosynthesis in reverse: glucose + oxygen produces carbon dioxide + water + energy.

<!-- voice:section_check concept="Three stages of cellular respiration" -->

### Three Stages, Three Locations

| Stage | Location | Input | ATP Produced | Key Product |
|-------|----------|-------|-------------|-------------|
| **Glycolysis** | Cytoplasm | Glucose | 2 ATP (net) | 2 pyruvate, 2 NADH |
| **Krebs Cycle** | Mitochondrial matrix | Acetyl-CoA | 2 ATP | NADH, FADH2, CO2 |
| **Oxidative Phosphorylation** | Inner mitochondrial membrane | NADH, FADH2, O2 | ~32-34 ATP | Water |

**Glycolysis** ("sugar splitting") breaks one 6-carbon glucose into two 3-carbon **pyruvate** molecules. This is the oldest metabolic pathway — it evolved before there was oxygen in Earth's atmosphere, which is why it happens in the cytoplasm and doesn't require O2.

**The Krebs Cycle** (also called the citric acid cycle) processes pyruvate further, releasing CO2 and loading up electron carriers (NADH and FADH2). Think of it as stripping every last bit of energy from the fuel.

**Oxidative Phosphorylation** is the big payoff. The electron carriers (NADH and FADH2) deliver electrons to the **electron transport chain** on the inner mitochondrial membrane. As electrons move down the chain, their energy pumps hydrogen ions (H+) across the membrane, creating a gradient. Those ions flow back through **ATP synthase** — a molecular turbine — which spins and produces ATP.

<!-- voice:key_insight insight="Most ATP comes from oxidative phosphorylation, not glycolysis. The electron transport chain is where the real energy payoff happens." -->

### What Happens Without Oxygen?

When oxygen is unavailable (like during intense exercise), cells switch to **fermentation** — a less efficient pathway that regenerates NAD+ so glycolysis can continue. In human muscle cells, this produces **lactic acid** (which makes your muscles burn). In yeast, it produces **ethanol and CO2** (which is how beer and bread are made).

### Reflection Questions

1. Why does glycolysis happen in the cytoplasm while the Krebs cycle happens inside the mitochondria?
2. During intense exercise, your muscles produce lactic acid. Using what you learned, explain why this happens.
3. How are photosynthesis and cellular respiration connected in an ecosystem?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 9 — "Cellular Respiration and Fermentation"
- **Hans Krebs**, Nobel Lecture, 1953 — the discoverer of the citric acid cycle describes his work
- **Khan Academy**, "Cellular Respiration" — step-by-step video walkthrough
`,
    },
    {
      id: "ap-bio-atp-energy",
      slug: "atp-energy",
      title: "ATP: The Energy Currency of Cells",
      content: `## ATP: The Energy Currency of Cells

<!-- voice:section_check concept="What ATP is and how cells use it" -->

### What You'll Learn

- The structure of ATP and how it stores energy
- How the ATP-ADP cycle works
- Why ATP is called the "energy currency" of cells

### The Cell's Dollar Bill

Imagine you live in a world where you can't trade directly — you can't swap a chicken for a haircut. Instead, everyone uses dollars as a common currency. In cells, **ATP** (adenosine triphosphate) is that universal currency. No matter what kind of work a cell needs to do — moving, building, signaling — it pays for it with ATP.

### The Structure of ATP

ATP is a nucleotide with three parts:

1. **Adenine** — a nitrogen-containing base (the same one found in DNA)
2. **Ribose** — a five-carbon sugar
3. **Three phosphate groups** — linked in a chain

The energy is stored in the bonds between the phosphate groups, especially the bond between the second and third phosphate. When the cell needs energy, an enzyme breaks that bond, releasing one phosphate group and producing **ADP** (adenosine diphosphate) + energy.

**ATP --> ADP + Pi + energy**

Think of it like snapping a glow stick — breaking the internal barrier releases the stored energy.

<!-- voice:section_check concept="ATP-ADP cycle and energy coupling" -->

### The ATP-ADP Cycle

Your body doesn't store large reserves of ATP. Instead, it recycles ADP back into ATP at an astonishing rate. A human body contains only about 250 grams of ATP at any given moment, but you use and regenerate roughly **your entire body weight in ATP every day** — about 60-70 kg worth.

The cycle works like this:
1. Cellular respiration adds a phosphate group back to ADP, regenerating ATP
2. The cell uses ATP by breaking off a phosphate group (releasing energy)
3. The resulting ADP is recycled back to step 1

This is called **energy coupling** — the energy released by breaking ATP drives cellular work (like pumping ions across a membrane or contracting a muscle fiber).

| Cellular Process | How ATP Powers It |
|-----------------|-------------------|
| **Muscle contraction** | ATP changes the shape of myosin proteins, pulling actin filaments |
| **Active transport** | ATP powers membrane pumps (like the Na+/K+ ATPase) |
| **Biosynthesis** | ATP provides energy to build macromolecules |
| **Signal transduction** | ATP is converted to cAMP, a key signaling molecule |

<!-- voice:key_insight insight="ATP is not a long-term energy storage molecule — it's a short-term energy shuttle. Your body recycles its entire supply of ATP hundreds of times per day." -->

### ATP Synthase: The World's Smallest Motor

The enzyme **ATP synthase** in the mitochondrial membrane is literally a rotary motor — it spins as hydrogen ions flow through it, and each rotation produces ATP. It was the first molecular motor discovered, and its structure was determined by John Walker and Paul Boyer, who shared the 1997 Nobel Prize in Chemistry.

### Reflection Questions

1. Why does the body recycle ATP rather than storing large amounts of it?
2. If a poison blocked ATP synthase, which cellular processes would fail first — and why?
3. How is ATP like money? Where does the analogy break down?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 8 — "An Introduction to Metabolism"
- **Nobel Prize Organization**, "John Walker & Paul Boyer — Nobel Lecture, 1997" — discovery of ATP synthase as a rotary motor
- **Alberts et al.**, *Molecular Biology of the Cell*, 7th ed., Garland Science, 2022, Chapter 2 — detailed ATP biochemistry
`,
    },
    {
      id: "ap-bio-energetics-checkpoint",
      slug: "energetics-checkpoint",
      title: "Checkpoint: Cellular Energetics",
      content: `## Module Checkpoint: Cellular Energetics

### Review

In this module, you explored how cells capture and use energy. You learned how photosynthesis converts sunlight into glucose, how cellular respiration breaks glucose down to produce ATP, and how ATP serves as the universal energy currency that powers every cellular process.

<!-- voice:section_check concept="Module review — cellular energetics" -->

### Quiz

**Question 1:** Where do the light reactions of photosynthesis take place?
A) Stroma
B) Cytoplasm
C) Thylakoid membranes
D) Mitochondrial matrix

**Question 2:** True or False: Glycolysis requires oxygen to function.
Explain your reasoning.

**Question 3:** The enzyme that acts as a rotary motor to produce ATP during oxidative phosphorylation is called __________.

**Question 4:** In 2-3 sentences, explain why photosynthesis and cellular respiration are described as opposite processes. Include the overall equation for each.

**Question 5:** A runner sprints for 30 seconds and feels a burning sensation in her legs. Using what you know about fermentation, explain what is happening at the cellular level.

<!-- voice:key_insight insight="Energy flows from sunlight to glucose (photosynthesis) to ATP (cellular respiration) to cellular work — this is the energy story of all life." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

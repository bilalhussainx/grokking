import { Module } from "../types";

export const chemistryOfLifeModule: Module = {
  id: "ap-bio-chemistry-of-life",
  title: "Chemistry of Life",
  description:
    "Explore the chemical foundations of living systems — water's unique properties, the four macromolecules, and how enzymes speed up life's reactions. Reference: Campbell Biology (Urry et al., 12th ed., Pearson, 2021), Chapters 2-5.",
  lessons: [
    {
      id: "ap-bio-water-and-life",
      slug: "water-and-life",
      title: "Water: The Molecule That Makes Life Possible",
      content: `## Water: The Molecule That Makes Life Possible

<!-- voice:section_check concept="Why water is essential for life" -->

### What You'll Learn

- Why water is called the "universal solvent"
- How hydrogen bonds give water its special properties
- Why life on Earth depends on water's unique behavior

### The Most Important Molecule You'll Ever Study

Imagine you're stranded on a desert island. You can survive weeks without food, but only about **three days** without water. Why? Because nearly every chemical reaction in your body takes place *in* water. Water isn't just something you drink — it's the stage where all of life's chemistry performs.

A single water molecule (H2O) is tiny and simple: two hydrogen atoms bonded to one oxygen atom. But water's **polarity** — the uneven distribution of electrical charge — gives it superpowers that no other common molecule has.

<!-- voice:section_check concept="Polarity and hydrogen bonding" -->

### Polarity and Hydrogen Bonds

Think of a water molecule like a magnet. The oxygen end is slightly negative, and the hydrogen ends are slightly positive. This happens because oxygen is more **electronegative** (it pulls shared electrons closer) than hydrogen.

Because of this polarity, water molecules stick to each other through **hydrogen bonds** — weak attractions between the positive hydrogen of one molecule and the negative oxygen of another. One hydrogen bond is weak, but billions of them together create powerful effects.

| Property | Explanation | Why It Matters for Life |
|----------|-------------|------------------------|
| **Cohesion** | Water molecules stick to each other | Allows water to travel up plant stems against gravity |
| **Adhesion** | Water sticks to other polar surfaces | Helps water climb thin tubes (capillary action) |
| **High specific heat** | Water resists temperature changes | Keeps oceans and bodies at stable temperatures |
| **High heat of vaporization** | It takes a lot of energy to evaporate water | Sweating cools you down efficiently |
| **Ice floats** | Frozen water is less dense than liquid water | Lakes freeze from the top, insulating life below |

<!-- voice:key_insight insight="Hydrogen bonds are individually weak, but collectively they give water every property that life depends on." -->

### Why Ice Floats — And Why That Matters

Most substances get denser when they freeze. Water is the exception. When water freezes, hydrogen bonds lock molecules into a crystal lattice that spaces them farther apart than in liquid water. That's why ice floats.

If ice sank, lakes and oceans would freeze from the bottom up, killing aquatic life. Instead, the floating ice layer insulates the water below, allowing fish and other organisms to survive winter. As Campbell Biology puts it: "Life as we know it could not exist on a planet where water did not have this extraordinary property" (Urry et al., 2021, Ch. 3).

### Reflection Questions

1. Why is polarity important for water's role as the "universal solvent"?
2. How would life on Earth be different if ice were denser than liquid water?
3. When you sweat on a hot day, which property of water is helping you cool down?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 3 — "Water and Life"
- **USGS Water Science School**, "Water Properties" — free online resource with interactive demonstrations
- **Philip Ball**, *H2O: A Biography of Water*, Phoenix, 2000 — engaging popular science book on water's role in nature
`,
    },
    {
      id: "ap-bio-macromolecules",
      slug: "macromolecules",
      title: "The Four Macromolecules: Building Blocks of Life",
      content: `## The Four Macromolecules: Building Blocks of Life

<!-- voice:section_check concept="What macromolecules are and why there are four types" -->

### What You'll Learn

- The four categories of biological macromolecules
- How monomers link together to form polymers
- The role each macromolecule plays in living organisms

### Life's Construction Materials

Imagine building a house. You need different materials for different jobs: bricks for walls, glass for windows, wires for electricity, pipes for plumbing. Living cells work the same way — they use four types of large molecules, called **macromolecules**, each with a distinct job.

The prefix "macro" means large. These molecules are built by linking smaller units called **monomers** ("mono" = one) into long chains called **polymers** ("poly" = many). The process of linking monomers is called **dehydration synthesis** (because a water molecule is removed at each link), and breaking them apart is called **hydrolysis** (adding water to break bonds).

<!-- voice:section_check concept="The four macromolecule types and their monomers" -->

### The Four Types

| Macromolecule | Monomer | Key Elements | Main Function | Example |
|---------------|---------|-------------|---------------|---------|
| **Carbohydrates** | Monosaccharides (simple sugars) | C, H, O | Quick energy, structural support | Glucose, cellulose, starch |
| **Lipids** | Fatty acids + glycerol | C, H, O | Long-term energy, membranes, insulation | Fats, phospholipids, steroids |
| **Proteins** | Amino acids (20 types) | C, H, O, N, S | Enzymes, structure, transport, defense | Hemoglobin, collagen, antibodies |
| **Nucleic Acids** | Nucleotides | C, H, O, N, P | Store and transmit genetic information | DNA, RNA |

**Carbohydrates** are your body's preferred quick fuel. A glucose molecule is like a matchstick — easy to light and burns fast. Plants store glucose as **starch**; animals store it as **glycogen**. Plants also use glucose to build **cellulose**, the tough fiber in cell walls.

**Lipids** are the long-term energy reserves — like a log that burns slowly. They also form the **phospholipid bilayer** of every cell membrane, creating the barrier between inside and outside.

**Proteins** are the workhorses. With 20 different amino acid monomers, proteins can fold into an enormous variety of shapes, each shape performing a different function — from speeding up reactions (enzymes) to fighting infections (antibodies).

**Nucleic acids** carry the instructions. DNA stores your genetic blueprint; RNA reads and translates those instructions into proteins.

<!-- voice:key_insight insight="Dehydration synthesis builds macromolecules by removing water; hydrolysis breaks them by adding water. This is the universal construction-and-demolition system of life." -->

### Why Shape Matters

A protein's function depends entirely on its 3D shape. If the shape changes — through heat, pH changes, or chemicals — the protein **denatures** and stops working. That's why a high fever is dangerous: it can denature the enzymes your cells need to survive.

### Reflection Questions

1. Why do you think cells use different macromolecules for quick energy (carbohydrates) versus long-term energy (lipids)?
2. If a protein denatures, it loses its shape. Why would losing shape cause it to stop functioning?
3. What do dehydration synthesis and hydrolysis have in common with building and demolishing a LEGO structure?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapters 4-5 — "Carbon and the Molecular Diversity of Life" and "The Structure and Function of Large Biological Molecules"
- **Khan Academy**, "Macromolecules" — free video series with practice questions
- **Alberts et al.**, *Molecular Biology of the Cell*, 7th ed., Garland Science, 2022, Chapter 2 — for advanced students wanting deeper chemistry
`,
    },
    {
      id: "ap-bio-enzymes",
      slug: "enzymes",
      title: "Enzymes: The Speed Controllers of Life",
      content: `## Enzymes: The Speed Controllers of Life

<!-- voice:section_check concept="What enzymes do and why cells need them" -->

### What You'll Learn

- What enzymes are and how they catalyze reactions
- The lock-and-key and induced fit models
- What factors affect enzyme activity

### Life Without Enzymes Would Be... Dead

Think about how long it takes for a piece of iron to rust. That's a chemical reaction, but it takes weeks or months. Now think about how fast you digest food — a sandwich starts breaking down in minutes. The difference? **Enzymes**.

An **enzyme** is a biological catalyst — a protein that speeds up a chemical reaction without being used up in the process. Without enzymes, the chemical reactions your body needs would take years instead of milliseconds. You'd never digest food, build new cells, or even breathe.

<!-- voice:section_check concept="Active site and substrate specificity" -->

### How Enzymes Work: The Lock-and-Key Analogy

Imagine you have a lock and only one key fits it. In enzyme chemistry:

- The **enzyme** is the lock
- The **substrate** (the molecule being acted on) is the key
- The **active site** is the keyhole — the specific region on the enzyme where the substrate binds

When the substrate fits into the active site, the enzyme catalyzes the reaction — breaking a bond, forming a bond, or rearranging atoms. The product is released, and the enzyme is free to work again.

Scientists originally proposed this as the **lock-and-key model** (Emil Fischer, 1894). But we now know enzymes are more flexible. The **induced fit model** (Daniel Koshland, 1958) describes how the active site changes shape slightly to grip the substrate more tightly — like a hand closing around a baseball.

### Factors That Affect Enzyme Activity

| Factor | Effect | Analogy |
|--------|--------|---------|
| **Temperature** | Increasing temp speeds reactions up to a point; too much heat denatures the enzyme | Warming up an engine helps, but overheating destroys it |
| **pH** | Each enzyme has an optimal pH; extreme pH denatures it | Stomach enzymes love acid (pH 2); mouth enzymes prefer neutral (pH 7) |
| **Substrate concentration** | More substrate = faster reactions, until all active sites are occupied | More customers at a restaurant means faster business, until every table is full |
| **Enzyme concentration** | More enzyme = more active sites available | Opening more checkout lanes reduces the line |
| **Inhibitors** | Molecules that block or reduce enzyme activity | Putting gum in a lock stops the key from working |

<!-- voice:key_insight insight="Enzymes lower the activation energy of a reaction — they don't change WHAT happens, they change HOW FAST it happens." -->

### Activation Energy: The Real Secret

Every chemical reaction needs a push to get started — like pushing a boulder over a hill before it rolls down the other side. That initial push is called **activation energy** (Ea). Enzymes work by lowering the activation energy, making it easier for the reaction to start. They don't change the products or make impossible reactions possible — they just remove the energy barrier.

This is why enzymes are so important: they allow reactions to happen at body temperature (37 degrees C) that would otherwise require extreme heat.

### Reflection Questions

1. Why is the induced fit model considered more accurate than the lock-and-key model?
2. If you eat protein (like chicken), your stomach uses the enzyme pepsin to digest it. Pepsin works best at pH 2. What would happen to pepsin's activity if it were placed in your small intestine (pH 8)?
3. Why can't enzymes make a reaction happen that is thermodynamically impossible?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 8 — "An Introduction to Metabolism"
- **Alberts et al.**, *Molecular Biology of the Cell*, 7th ed., Garland Science, 2022, Chapter 3 — detailed enzyme kinetics
- **Nobel Prize Organization**, "Emil Fischer — Biographical" — background on the scientist who proposed the lock-and-key model
`,
    },
    {
      id: "ap-bio-chemistry-checkpoint",
      slug: "chemistry-checkpoint",
      title: "Checkpoint: Chemistry of Life",
      content: `## Module Checkpoint: Chemistry of Life

### Review

In this module, you explored the chemical foundations of life. You learned why water's polarity and hydrogen bonds make it essential for living systems, how the four macromolecules (carbohydrates, lipids, proteins, and nucleic acids) serve as life's building materials, and how enzymes lower activation energy to speed up the reactions cells need to survive.

<!-- voice:section_check concept="Module review — chemistry of life" -->

### Quiz

**Question 1:** Which property of water allows it to resist temperature changes?
A) Cohesion
B) High specific heat
C) Adhesion
D) Low density as ice

**Question 2:** True or False: Lipids are polymers made of amino acid monomers.
Explain your reasoning.

**Question 3:** The process of linking monomers together by removing a water molecule is called __________.

**Question 4:** In 2-3 sentences, explain why an enzyme that works perfectly in your stomach (pH 2) would not work in your mouth (pH 7).

**Question 5:** A scientist heats an enzyme solution to 80 degrees C and finds the reaction rate drops to zero. Using what you know about protein structure, explain what happened to the enzyme.

<!-- voice:key_insight insight="The chemistry of life connects water, macromolecules, and enzymes into one system: water provides the environment, macromolecules provide the materials, and enzymes control the speed." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

import { Module } from "../types";

export const cellStructureModule: Module = {
  id: "ap-bio-cell-structure",
  title: "Cell Structure",
  description: "Understand the differences between prokaryotic and eukaryotic cells, explore key organelles, and learn how the cell membrane controls what enters and exits. Reference: Campbell Biology (Urry et al., 12th ed., Pearson, 2021), Chapters 6-7.",
  lessons: [
    {
      id: "ap-bio-prokaryotic-vs-eukaryotic",
      slug: "prokaryotic-vs-eukaryotic",
      title: "Prokaryotic vs. Eukaryotic Cells",
      content: `## Prokaryotic vs. Eukaryotic Cells

<!-- voice:section_check concept="Two fundamental cell types" -->

### What You'll Learn

- The key differences between prokaryotic and eukaryotic cells
- What defines each cell type
- Why this distinction matters for all of biology

### Two Blueprints for Life

Imagine two types of homes: a studio apartment (one open room, everything in one space) and a mansion (many specialized rooms with walls and doors). All living cells fall into one of two categories that work the same way:

**Prokaryotic cells** ("before nucleus") are the studio apartments — small, simple, with no internal walls. Their DNA floats freely in the cell. Bacteria and archaea are prokaryotes.

**Eukaryotic cells** ("true nucleus") are the mansions — larger, more complex, with membrane-bound compartments called **organelles**. Their DNA is housed inside a **nucleus**. Plants, animals, fungi, and protists are eukaryotes.

<!-- voice:section_check concept="Structural differences between cell types" -->

### Side-by-Side Comparison

| Feature | Prokaryotic | Eukaryotic |
|---------|-------------|------------|
| **Size** | 1-10 micrometers | 10-100 micrometers |
| **Nucleus** | No — DNA in nucleoid region | Yes — membrane-bound nucleus |
| **Organelles** | Few, no membrane-bound organelles | Many membrane-bound organelles |
| **DNA shape** | Usually circular | Linear chromosomes |
| **Ribosomes** | Smaller (70S) | Larger (80S) |
| **Cell wall** | Usually present (peptidoglycan in bacteria) | Present in plants/fungi; absent in animals |
| **Examples** | E. coli, Staphylococcus | Human cells, plant cells, yeast |

### The Endosymbiotic Theory

Here's a fascinating connection: scientists believe that some eukaryotic organelles — specifically **mitochondria** and **chloroplasts** — were once free-living prokaryotes that were engulfed by a larger cell. Over billions of years, they became permanent residents. This is the **endosymbiotic theory**, proposed by Lynn Margulis in 1967.

The evidence is compelling:
- Mitochondria and chloroplasts have their **own circular DNA** (like prokaryotes)
- They have **double membranes** (the inner one from the original prokaryote, the outer from the host cell)
- They reproduce by **binary fission**, just like bacteria
- Their ribosomes are the same size as bacterial ribosomes (70S)

<!-- voice:key_insight insight="Mitochondria and chloroplasts were once independent prokaryotes — your cells are literally powered by ancient bacteria." -->

### Why This Matters

Understanding the prokaryote-eukaryote divide is fundamental because it determines how organisms are classified, how diseases work (antibiotics target prokaryotic features), and how evolution shaped complex life from simple beginnings.

### Reflection Questions

1. Why do antibiotics that target bacterial ribosomes (70S) not harm human cells?
2. What evidence supports the endosymbiotic theory? Which piece do you find most convincing?
3. If prokaryotes are simpler, why are they still the most abundant organisms on Earth?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 6 — "A Tour of the Cell"
- **Lynn Margulis**, *Origin of Eukaryotic Cells*, Yale University Press, 1970 — the original endosymbiotic theory argument
- **Nature Education**, "Eukaryotic Cells" — Scitable article with clear diagrams
`,
    },
    {
      id: "ap-bio-organelles",
      slug: "organelles",
      title: "Organelles: The Cell's Specialized Workers",
      content: `## Organelles: The Cell's Specialized Workers

<!-- voice:section_check concept="Major organelles and their functions" -->

### What You'll Learn

- The major organelles in eukaryotic cells
- What each organelle does
- How organelles work together as a system

### The Cell as a Factory

Think of a eukaryotic cell as a factory. Every factory has a front office (management), a production floor (manufacturing), a shipping department (distribution), a power plant (energy), and a recycling center (waste management). Each organelle in the cell fills one of these roles.

<!-- voice:section_check concept="Nucleus and endomembrane system" -->

### The Management Center: Nucleus

The **nucleus** is the cell's control center. It contains the cell's DNA, organized into structures called **chromosomes**. A double membrane called the **nuclear envelope** surrounds it, with **nuclear pores** that control what enters and exits — like a security checkpoint.

Inside the nucleus, the **nucleolus** assembles the components of **ribosomes**, the molecular machines that build proteins.

\`\`\`mermaid
graph TD
    A[Eukaryotic Cell] --> B[Nucleus]
    A --> C[Mitochondria]
    A --> D[Endoplasmic Reticulum]
    A --> E[Golgi Apparatus]
    A --> F[Lysosome]
    B --> B1[DNA Storage]
    C --> C1[Energy / ATP]
    D --> D1[Protein Synthesis]
    E --> E1[Packaging]
    F --> F1[Recycling]
\`\`\`

### The Production and Shipping System

| Organelle | Function | Factory Analogy |
|-----------|----------|-----------------|
| **Ribosomes** | Build proteins from mRNA instructions | Assembly line workers |
| **Rough ER** | Ribosomes on its surface make proteins for export | Production floor |
| **Smooth ER** | Makes lipids, detoxifies drugs, stores calcium | Chemical processing plant |
| **Golgi apparatus** | Modifies, sorts, and ships proteins | Shipping and packaging department |
| **Vesicles** | Transport packages between organelles | Delivery trucks |

The **endomembrane system** — the ER, Golgi, and vesicles — works like a conveyor belt. A protein is made on the rough ER, sent to the Golgi for finishing touches (like adding sugar molecules), then packaged in a vesicle and shipped to its destination.

### The Power Plants

**Mitochondria** are the powerhouses of the cell. They perform **cellular respiration**, converting glucose and oxygen into **ATP** (adenosine triphosphate) — the energy currency your cells use for everything from muscle contraction to nerve signaling.

**Chloroplasts** (found only in plant cells and some protists) capture sunlight and convert it to chemical energy through **photosynthesis**. They are why plants are green — the pigment **chlorophyll** absorbs red and blue light, reflecting green.

### The Recycling and Support Crew

**Lysosomes** contain digestive enzymes that break down worn-out organelles, food particles, and invading bacteria. Think of them as the recycling center.

**Vacuoles** are storage compartments. Plant cells have a large **central vacuole** that stores water, maintains pressure (**turgor pressure**), and keeps the plant upright.

The **cytoskeleton** — a network of protein filaments — provides structure and enables cell movement, like the steel beams of a building.

<!-- voice:key_insight insight="Organelles don't work in isolation — they form an interconnected system where the product of one organelle becomes the input for another." -->

### Reflection Questions

1. Why do you think muscle cells have more mitochondria than skin cells?
2. What would happen to a cell if its lysosomes stopped working?
3. How does the factory analogy help you remember organelle functions? Where does the analogy break down?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 6 — "A Tour of the Cell"
- **Molecular Expressions**, "Cell Biology and Microscopy" — Florida State University interactive cell tour
- **Khan Academy**, "Cellular organelles and structure" — free video lessons with diagrams
`,
    },
    {
      id: "ap-bio-cell-membrane",
      slug: "cell-membrane",
      title: "The Cell Membrane: Gatekeeper of the Cell",
      content: `## The Cell Membrane: Gatekeeper of the Cell

<!-- voice:section_check concept="Structure and function of the cell membrane" -->

### What You'll Learn

- The structure of the phospholipid bilayer
- How the fluid mosaic model describes membrane organization
- The difference between passive and active transport

### The Bouncer at the Door

Every cell is surrounded by a **cell membrane** (also called the plasma membrane). Think of it as a bouncer at a nightclub — it decides who gets in, who gets out, and who's not welcome. Without this selective barrier, the cell's carefully controlled internal environment would collapse.

<!-- voice:section_check concept="Phospholipid bilayer structure" -->

### The Phospholipid Bilayer

The membrane is built primarily from **phospholipids** — molecules with a water-loving (**hydrophilic**) head and two water-fearing (**hydrophobic**) tails. In water, phospholipids spontaneously arrange into a double layer: heads facing outward (toward water) and tails facing inward (away from water).

This creates a barrier that water-soluble molecules cannot easily cross — like an oil slick on water that separates two aqueous environments.

### The Fluid Mosaic Model

In 1972, S.J. Singer and Garth Nicolson proposed the **fluid mosaic model**. "Fluid" because the phospholipids move laterally (side to side) like people in a crowd. "Mosaic" because proteins are embedded throughout, creating a patchwork pattern.

| Membrane Component | Role |
|--------------------|------|
| **Phospholipids** | Form the basic barrier |
| **Cholesterol** | Stabilizes membrane fluidity at different temperatures |
| **Channel proteins** | Create tunnels for specific molecules to pass through |
| **Carrier proteins** | Actively shuttle molecules across the membrane |
| **Receptor proteins** | Receive chemical signals from outside the cell |
| **Glycoproteins** | Cell identification tags (like a name badge) |

### How Things Cross the Membrane

| Transport Type | Energy Required? | Direction | Example |
|----------------|-----------------|-----------|---------|
| **Diffusion** | No (passive) | High to low concentration | Oxygen entering cells |
| **Osmosis** | No (passive) | Water moves toward higher solute concentration | Water entering a red blood cell |
| **Facilitated diffusion** | No (passive) | High to low, through a protein channel | Glucose entering cells via GLUT transporters |
| **Active transport** | Yes (ATP) | Low to high concentration | Sodium-potassium pump (Na+/K+ ATPase) |
| **Endocytosis** | Yes | Cell engulfs large particles | White blood cell eating a bacterium |
| **Exocytosis** | Yes | Cell expels contents in a vesicle | Neuron releasing neurotransmitters |

<!-- voice:key_insight insight="The membrane is selectively permeable — it doesn't block everything or let everything through. It chooses, and that choice is what keeps cells alive." -->

### Osmosis in Action

When you put a red blood cell in pure water, water rushes in (the cell is saltier inside), and the cell swells and can burst — this is called **lysis**. Put the same cell in very salty water, and water rushes out, causing the cell to shrivel — this is **crenation**. This is why hospitals use **isotonic** saline solutions (0.9% NaCl) for IVs — to match the concentration inside your cells.

### Reflection Questions

1. Why do phospholipids arrange into a bilayer automatically in water? (Hint: think about hydrophobic and hydrophilic interactions.)
2. A patient is given a highly concentrated salt IV by mistake. Using what you know about osmosis, predict what happens to their red blood cells.
3. Why does active transport require ATP while diffusion does not?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 7 — "Membrane Structure and Function"
- **S.J. Singer & G. Nicolson**, "The Fluid Mosaic Model of the Structure of Cell Membranes," *Science*, 1972 — the original landmark paper
- **Khan Academy**, "The plasma membrane" — free animated explanation
`,
    },
    {
      id: "ap-bio-cell-structure-checkpoint",
      slug: "cell-structure-checkpoint",
      title: "Checkpoint: Cell Structure",
      content: `## Module Checkpoint: Cell Structure

### Review

In this module, you compared prokaryotic and eukaryotic cells, explored the major organelles and their functions, and learned how the cell membrane controls transport. You saw how the endosymbiotic theory explains the origin of mitochondria and chloroplasts, how organelles work together like a factory, and how the fluid mosaic model describes membrane structure.

<!-- voice:section_check concept="Module review — cell structure" -->

### Quiz

**Question 1:** Which of the following is found in prokaryotic cells?
A) Nucleus
B) Mitochondria
C) Ribosomes
D) Golgi apparatus

**Question 2:** True or False: The endosymbiotic theory proposes that mitochondria were once free-living bacteria.
Explain one piece of evidence supporting this claim.

**Question 3:** The organelle responsible for modifying, sorting, and packaging proteins for export is the __________.

**Question 4:** In 2-3 sentences, explain why a plant cell placed in pure water does not burst the way a red blood cell does.

**Question 5:** A cell is treated with a poison that stops all ATP production. Which type of membrane transport would still function — passive transport or active transport? Explain why.

<!-- voice:key_insight insight="Cell structure is cell function — the shape and organization of each component determines what the cell can do." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

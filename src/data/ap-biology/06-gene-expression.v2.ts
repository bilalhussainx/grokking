import { Module } from "../types";

export const geneExpressionModule: Module = {
  id: "ap-bio-gene-expression",
  title: "Gene Expression",
  description: "Understand how genes are read and turned into proteins — transcription, translation, mutations, and the emerging field of epigenetics. Reference: Campbell Biology (Urry et al., 12th ed., Pearson, 2021), Chapters 17-18.",
  lessons: [
    {
      id: "ap-bio-transcription",
      slug: "transcription",
      title: "Transcription: From DNA to RNA",
      content: `## Transcription: From DNA to RNA

<!-- voice:section_check concept="How DNA is transcribed into mRNA" -->

### What You'll Learn

- What transcription is and where it happens
- The three stages: initiation, elongation, and termination
- How mRNA is processed before leaving the nucleus

### Reading the Recipe

Think of DNA as a master recipe book locked in a vault (the nucleus). You wouldn't take the master book into the kitchen — you'd copy the recipe you need onto a card and bring that to the kitchen. **Transcription** is the process of copying a gene from DNA into a messenger molecule called **mRNA** (messenger RNA), which can leave the nucleus and carry the instructions to the ribosomes.

The central dogma of molecular biology:

**DNA --> (transcription) --> mRNA --> (translation) --> Protein**

<!-- voice:section_check concept="Three stages of transcription" -->

### The Three Stages

**1. Initiation:** The enzyme **RNA polymerase** binds to a region called the **promoter** — a specific DNA sequence that says "start here." In eukaryotes, proteins called **transcription factors** help RNA polymerase find and bind the promoter. The most common promoter sequence is the **TATA box**.

**2. Elongation:** RNA polymerase unwinds the DNA and reads one strand (the **template strand**) from 3' to 5', building the mRNA in the 5' to 3' direction. The base pairing rules are similar to DNA, except RNA uses **uracil (U)** instead of thymine (T):
- A in DNA pairs with U in RNA
- T in DNA pairs with A in RNA
- G pairs with C (same as DNA)

**3. Termination:** RNA polymerase reaches a **terminator sequence** in the DNA, which signals it to stop and release the mRNA.

### mRNA Processing (Eukaryotes Only)

Before the mRNA can leave the nucleus, it gets three modifications:

| Modification | What It Does | Why It Matters |
|-------------|-------------|----------------|
| **5' cap** | A modified guanine nucleotide added to the front | Protects mRNA from degradation; helps ribosome recognize it |
| **Poly-A tail** | 100-200 adenine nucleotides added to the end | Protects mRNA from degradation; aids export from nucleus |
| **Splicing** | Introns (non-coding sections) are removed; exons (coding sections) are joined | Allows one gene to produce multiple proteins (alternative splicing) |

**Alternative splicing** is why humans can have about 20,000 genes but produce over 100,000 different proteins — the same gene's exons can be combined in different ways to create different mRNAs.

<!-- voice:key_insight insight="Transcription copies a gene from DNA to mRNA, but eukaryotic mRNA must be processed (capped, tailed, and spliced) before it can be translated into protein." -->

### Reflection Questions

1. Why does the cell copy a gene into mRNA rather than using the DNA directly to make protein?
2. If a mutation destroyed the promoter of a gene, what would happen to that gene's expression?
3. How does alternative splicing increase the diversity of proteins without increasing the number of genes?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 17 — "Gene Expression: From Gene to Protein"
- **Alberts et al.**, *Molecular Biology of the Cell*, 7th ed., Garland Science, 2022, Chapter 6 — detailed transcription mechanisms
- **HHMI BioInteractive**, "RNA Splicing" — animated visualization of intron removal
`,
    },
    {
      id: "ap-bio-translation",
      slug: "translation",
      title: "Translation: From RNA to Protein",
      content: `## Translation: From RNA to Protein

<!-- voice:section_check concept="How ribosomes read mRNA to build proteins" -->

### What You'll Learn

- How the genetic code works (codons and amino acids)
- The three stages of translation: initiation, elongation, and termination
- The role of tRNA and ribosomes

### Building from the Blueprint

If transcription is copying a recipe onto a card, **translation** is actually cooking the dish. The ribosome reads the mRNA instructions and assembles a chain of **amino acids** — which folds into a functional **protein**.

This happens in the **cytoplasm** (on free ribosomes or on the rough ER), outside the nucleus.

<!-- voice:section_check concept="The genetic code and codons" -->

### The Genetic Code

The mRNA is read in groups of three bases called **codons**. Each codon specifies one amino acid. With four bases (A, U, G, C) taken three at a time, there are 64 possible codons — but only 20 amino acids. This means the code is **redundant** (multiple codons can code for the same amino acid).

Key codons to know:
- **AUG** — Start codon (also codes for methionine, the first amino acid in every protein)
- **UAA, UAG, UGA** — Stop codons (signal the ribosome to release the protein)

### The Three Stages

**1. Initiation:** The small ribosomal subunit binds to the mRNA and finds the start codon (AUG). A **tRNA** molecule carrying methionine pairs with AUG. The large ribosomal subunit joins, forming the complete ribosome.

**2. Elongation:** This is the assembly line:
- A tRNA carrying the correct amino acid enters the ribosome's **A site** (aminoacyl site)
- Its **anticodon** (three bases on the tRNA) pairs with the mRNA codon
- A **peptide bond** forms between the new amino acid and the growing chain
- The ribosome shifts one codon down the mRNA, moving the tRNA to the **P site** (peptidyl site) and then out through the **E site** (exit site)
- A new tRNA enters the A site, and the cycle repeats

**3. Termination:** When the ribosome reaches a stop codon (UAA, UAG, or UGA), no tRNA can bind. A **release factor** enters instead, causing the ribosome to release the completed polypeptide chain.

| Component | Role |
|-----------|------|
| **mRNA** | Carries the coded message from DNA |
| **tRNA** | Brings the correct amino acid to the ribosome; has an anticodon |
| **Ribosome** | The machine that reads mRNA and assembles the protein |
| **Amino acids** | The building blocks linked together to form the protein |

<!-- voice:key_insight insight="Translation is where the language of nucleic acids (codons) is translated into the language of proteins (amino acids) — hence the name." -->

### Reflection Questions

1. Why is the genetic code described as "redundant"? Is redundancy a flaw or a feature?
2. A mutation changes a codon from UAC to UAA. What effect would this have on the protein?
3. Why do you think all proteins start with methionine (the amino acid coded by AUG)?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 17 — "Gene Expression: From Gene to Protein"
- **Nobel Prize Organization**, "The Genetic Code — Nirenberg & Khorana, 1968" — how the genetic code was cracked
- **DNA Learning Center**, "Translation" — Cold Spring Harbor animated walkthrough
`,
    },
    {
      id: "ap-bio-mutations-epigenetics",
      slug: "mutations-epigenetics",
      title: "Mutations and Epigenetics: When Genes Change",
      content: `## Mutations and Epigenetics: When Genes Change

<!-- voice:section_check concept="Types of mutations and how gene expression is regulated beyond DNA sequence" -->

### What You'll Learn

- The main types of DNA mutations and their effects
- How epigenetic changes alter gene expression without changing DNA sequence
- Why not every mutation is harmful

### Typos in the Recipe Book

Imagine a cookbook where someone accidentally changes "1 cup of sugar" to "1 cup of salt." That's a **mutation** — a change in the DNA sequence. Some mutations are harmless (like changing "colour" to "color"), some are devastating, and some are actually beneficial.

<!-- voice:section_check concept="Types of point mutations" -->

### Types of Mutations

**Point mutations** change a single nucleotide:

| Type | What Happens | Effect on Protein | Example |
|------|-------------|-------------------|---------|
| **Silent** | Changed codon still codes for the same amino acid | None | GAA to GAG (both code for glutamic acid) |
| **Missense** | Changed codon codes for a different amino acid | May alter protein function | GAG to GUG (glutamic acid to valine) — causes sickle cell disease |
| **Nonsense** | Changed codon becomes a stop codon | Protein is cut short — usually nonfunctional | UAC to UAA (tyrosine to STOP) |

**Frameshift mutations** insert or delete nucleotides (not in multiples of three), shifting the entire reading frame:

Think of the sentence: THE CAT ATE THE RAT
- Delete the C: THE ATA TET HER AT — gibberish from that point on
- Insert a G: THE GCA TAT ETH ERA T — also gibberish

Frameshift mutations are usually the most damaging because they alter every codon downstream of the change.

### Sickle Cell Disease: One Letter, One Disease

Sickle cell disease is caused by a single missense mutation in the hemoglobin gene: **GAG becomes GUG**, changing one amino acid from glutamic acid to valine. This causes hemoglobin molecules to stick together, deforming red blood cells into a sickle shape that blocks blood vessels.

But here's the twist: carrying one copy of the sickle cell allele (heterozygous) provides resistance to malaria. This is why the allele is common in regions where malaria is prevalent — an example of **heterozygote advantage**.

<!-- voice:section_check concept="Epigenetics — gene regulation beyond DNA sequence" -->

### Epigenetics: Same DNA, Different Expression

Every cell in your body has the same DNA. So why is a liver cell different from a brain cell? The answer is **epigenetics** — chemical modifications that control which genes are turned on or off without changing the DNA sequence itself.

Two key mechanisms:

**DNA methylation** — Adding methyl groups (CH3) to DNA typically silences a gene. Think of it as putting a lock on a page in the recipe book.

**Histone modification** — DNA wraps around proteins called histones. When histones are tightly packed (via deacetylation), genes are hidden and silent. When histones are loosened (via acetylation), genes are exposed and can be read.

The remarkable finding: some epigenetic changes can be influenced by **environment** — diet, stress, toxins — and some can even be passed to offspring. A 2004 study by Michael Meaney's lab at McGill University showed that rat pups who received more grooming from their mothers developed different patterns of DNA methylation that lasted into adulthood, affecting their stress response.

<!-- voice:key_insight insight="Epigenetics shows that your genes are not your destiny — environmental factors can influence which genes are active, and some of these changes can be inherited." -->

### Reflection Questions

1. Why are frameshift mutations generally more harmful than point mutations?
2. Sickle cell disease is harmful, yet the allele persists in human populations. How does heterozygote advantage explain this?
3. If identical twins have the same DNA, how might epigenetics explain why they can develop different diseases later in life?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 17-18 — "Gene Expression" and "Regulation of Gene Expression"
- **Nessa Carey**, *The Epigenetics Revolution*, Columbia University Press, 2012 — accessible introduction to epigenetics
- **Nature Education**, "Epigenetics" — Scitable collection of articles and animations
`,
    },
    {
      id: "ap-bio-gene-expression-checkpoint",
      slug: "gene-expression-checkpoint",
      title: "Checkpoint: Gene Expression",
      content: `## Module Checkpoint: Gene Expression

### Review

In this module, you followed the central dogma of molecular biology from DNA to RNA to protein. You learned how transcription copies a gene into mRNA, how translation builds a protein from that mRNA, and how mutations and epigenetic changes can alter gene expression — sometimes for better, sometimes for worse.

<!-- voice:section_check concept="Module review — gene expression" -->

### Quiz

**Question 1:** During transcription, which enzyme reads the DNA template and builds the mRNA?
A) DNA polymerase
B) RNA polymerase
C) Helicase
D) Ligase

**Question 2:** True or False: A silent mutation always causes a disease.
Explain what actually happens in a silent mutation.

**Question 3:** The mRNA is read in groups of three bases called __________, each of which specifies one amino acid.

**Question 4:** In 2-3 sentences, explain the difference between DNA methylation and histone acetylation. How does each affect gene expression?

**Question 5:** A mutation inserts one extra nucleotide into the middle of a gene. What type of mutation is this, and why is it likely to be more damaging than a point mutation?

<!-- voice:key_insight insight="Gene expression is not automatic — cells regulate which genes are active, when, and how much. Mutations and epigenetics are two forces that shape this regulation." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

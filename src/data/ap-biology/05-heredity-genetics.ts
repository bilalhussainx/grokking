import { Module } from "../types";

export const heredityGeneticsModule: Module = {
  id: "ap-bio-heredity-genetics",
  title: "Heredity & Genetics",
  description:
    "Discover how traits are passed from parents to offspring — Mendel's laws, DNA replication, and how to predict inheritance with Punnett squares. Reference: Campbell Biology (Urry et al., 12th ed., Pearson, 2021), Chapters 13-15.",
  lessons: [
    {
      id: "ap-bio-mendel-inheritance",
      slug: "mendel-inheritance",
      title: "Mendel and the Laws of Inheritance",
      content: `## Mendel and the Laws of Inheritance

<!-- voice:section_check concept="Mendel's experiments and the laws of segregation and independent assortment" -->

### What You'll Learn

- How Gregor Mendel discovered the basic rules of inheritance
- The Law of Segregation and the Law of Independent Assortment
- Key genetics vocabulary: allele, dominant, recessive, genotype, phenotype

### The Monk Who Figured Out Heredity

In the 1860s, a monk named **Gregor Mendel** grew thousands of pea plants in a monastery garden in what is now the Czech Republic. By carefully crossing plants with different traits — tall vs. short, purple flowers vs. white flowers, round seeds vs. wrinkled seeds — he discovered patterns that no one else had noticed.

Mendel's genius was that he **counted**. He didn't just observe that some offspring had purple flowers — he recorded exact ratios. And those ratios revealed the hidden rules of inheritance.

<!-- voice:section_check concept="Dominant and recessive alleles" -->

### Key Vocabulary

Before we dive into Mendel's results, let's define the terms:

| Term | Definition | Example |
|------|-----------|---------|
| **Gene** | A segment of DNA that codes for a trait | The gene for flower color |
| **Allele** | A variant of a gene | Purple allele (P) vs. white allele (p) |
| **Dominant** | The allele that is expressed when present | Purple (P) — masks the recessive |
| **Recessive** | The allele that is only expressed when no dominant allele is present | White (p) — hidden by dominant |
| **Genotype** | The combination of alleles an organism has | PP, Pp, or pp |
| **Phenotype** | The physical appearance | Purple or white flowers |
| **Homozygous** | Two identical alleles | PP or pp |
| **Heterozygous** | Two different alleles | Pp |

### Mendel's Two Laws

**Law of Segregation:** Each organism has two alleles for each gene, and these alleles separate during gamete (egg/sperm) formation so that each gamete carries only one allele. When fertilization occurs, the offspring receives one allele from each parent.

**Law of Independent Assortment:** Genes for different traits are inherited independently of each other (as long as they're on different chromosomes). The allele you get for flower color doesn't affect which allele you get for seed shape.

### The 3:1 Ratio

When Mendel crossed two heterozygous purple-flowered plants (Pp x Pp), he got approximately **3 purple : 1 white** in the offspring. This famous 3:1 ratio is the signature of a single-gene trait with complete dominance.

<!-- voice:key_insight insight="Mendel's 3:1 ratio revealed that traits are determined by discrete 'factors' (which we now call genes) that don't blend together — they segregate and reassort." -->

### Reflection Questions

1. Mendel worked with pea plants, not humans. Why were pea plants a good choice for studying inheritance?
2. If a plant has purple flowers, can you tell from its phenotype alone whether its genotype is PP or Pp? How would you find out?
3. Why was Mendel's decision to count his results so revolutionary compared to other scientists of his time?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 14 — "Mendel and the Gene Idea"
- **Gregor Mendel**, "Experiments on Plant Hybridization," 1866 — the original paper (available in English translation online)
- **Robin Marantz Henig**, *The Monk in the Garden*, Mariner Books, 2001 — engaging biography of Mendel
`,
    },
    {
      id: "ap-bio-dna-replication",
      slug: "dna-replication",
      title: "DNA Replication: Copying the Blueprint",
      content: `## DNA Replication: Copying the Blueprint

<!-- voice:section_check concept="How DNA is copied before cell division" -->

### What You'll Learn

- The structure of DNA (double helix, base pairing rules)
- How DNA replication works step by step
- The key experiments that proved DNA is the genetic material

### The Recipe Book of Life

Think of DNA as a recipe book that contains every instruction your body needs. Before a cell divides, it must make an exact copy of this recipe book so both daughter cells get a complete set. This process is **DNA replication**.

### DNA Structure Review

DNA is a **double helix** — two strands twisted around each other like a spiral staircase. Each strand is made of **nucleotides**, and each nucleotide has three parts:

1. A phosphate group (the railing of the staircase)
2. A deoxyribose sugar (the railing of the staircase)
3. A nitrogenous base (the steps of the staircase)

The bases follow strict **complementary base pairing** rules:
- **Adenine (A)** always pairs with **Thymine (T)**
- **Guanine (G)** always pairs with **Cytosine (C)**

This was discovered by James Watson and Francis Crick in 1953, building on X-ray crystallography data from **Rosalind Franklin** — whose critical contribution was not fully recognized during her lifetime.

<!-- voice:section_check concept="Steps of DNA replication" -->

### How Replication Works

| Step | Enzyme | What It Does |
|------|--------|-------------|
| 1. Unwind | **Helicase** | Separates the two strands by breaking hydrogen bonds |
| 2. Stabilize | **Single-strand binding proteins** | Keep the separated strands from re-pairing |
| 3. Prime | **Primase** | Adds a short RNA primer to give DNA polymerase a starting point |
| 4. Build | **DNA polymerase III** | Adds new nucleotides complementary to the template strand (5' to 3') |
| 5. Replace | **DNA polymerase I** | Removes RNA primers and replaces them with DNA |
| 6. Seal | **Ligase** | Joins the fragments (Okazaki fragments on the lagging strand) |

Replication is **semiconservative** — each new DNA molecule contains one original strand and one newly built strand. This was proven by the elegant **Meselson-Stahl experiment** (1958), which used heavy nitrogen (N-15) to label original DNA and tracked how it distributed through rounds of replication.

### The Landmark Experiments

**Hershey-Chase Experiment (1952):** Alfred Hershey and Martha Chase used bacteriophages (viruses that infect bacteria) labeled with radioactive sulfur (for protein) and radioactive phosphorus (for DNA). They proved that **DNA, not protein**, is the genetic material.

**Meselson-Stahl Experiment (1958):** Called "the most beautiful experiment in biology," it confirmed that DNA replication is semiconservative — each daughter molecule keeps one parent strand.

<!-- voice:key_insight insight="DNA replication is semiconservative — each new double helix contains one old strand and one new strand, ensuring accurate copying of genetic information." -->

### Reflection Questions

1. Why is semiconservative replication more accurate than if DNA were copied from scratch each time?
2. What would happen if DNA polymerase added incorrect bases frequently? What process might fix these errors?
3. Why was Rosalind Franklin's X-ray crystallography data essential for Watson and Crick's discovery?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 16 — "The Molecular Basis of Inheritance"
- **James Watson**, *The Double Helix*, Touchstone, 1968 — Watson's personal account of the discovery (read critically)
- **Brenda Maddox**, *Rosalind Franklin: The Dark Lady of DNA*, HarperCollins, 2002 — Franklin's essential contribution
`,
    },
    {
      id: "ap-bio-punnett-squares",
      slug: "punnett-squares",
      title: "Punnett Squares: Predicting Inheritance",
      content: `## Punnett Squares: Predicting Inheritance

<!-- voice:section_check concept="How to use Punnett squares to predict offspring ratios" -->

### What You'll Learn

- How to set up and solve a Punnett square
- The difference between monohybrid and dihybrid crosses
- How to calculate genotype and phenotype ratios

### A Prediction Tool

Imagine you could predict the probability of your future child having blue eyes or brown eyes. **Punnett squares** let you do exactly that — they're a visual tool for predicting the possible genotypes and phenotypes of offspring from a genetic cross.

Named after British geneticist **Reginald Punnett** (early 1900s), this simple grid takes the alleles from each parent and shows every possible combination in the offspring.

<!-- voice:section_check concept="Setting up a monohybrid cross" -->

### Monohybrid Cross: One Gene

A **monohybrid cross** tracks ONE gene. Let's cross two heterozygous pea plants for flower color (Pp x Pp):

Step 1: Write one parent's alleles across the top
Step 2: Write the other parent's alleles down the side
Step 3: Fill in each box by combining the column and row alleles

|   | **P** | **p** |
|---|-------|-------|
| **P** | PP | Pp |
| **p** | Pp | pp |

**Genotype ratio:** 1 PP : 2 Pp : 1 pp
**Phenotype ratio:** 3 purple : 1 white (because PP and Pp both show the dominant trait)

### Dihybrid Cross: Two Genes

A **dihybrid cross** tracks TWO genes simultaneously. Let's cross two plants heterozygous for both seed shape (R = round, r = wrinkled) and seed color (Y = yellow, y = green): RrYy x RrYy.

Each parent can produce four gamete types: RY, Ry, rY, ry. This creates a 4x4 grid (16 boxes).

The result is Mendel's famous **9:3:3:1 ratio**:
- 9 round, yellow
- 3 round, green
- 3 wrinkled, yellow
- 1 wrinkled, green

### Test Crosses

What if you have a plant with purple flowers but don't know if it's PP or Pp? Cross it with a **homozygous recessive** (pp) — this is called a **test cross**.

- If the unknown is PP: all offspring will be Pp (purple)
- If the unknown is Pp: offspring will be 1 Pp (purple) : 1 pp (white)

The offspring ratios reveal the unknown parent's genotype.

<!-- voice:key_insight insight="Punnett squares show probability, not certainty. A 3:1 ratio means each offspring has a 75% chance of being dominant, not that exactly 3 out of every 4 will be." -->

### Beyond Simple Dominance

Not all traits follow simple Mendelian patterns:

| Pattern | Description | Example |
|---------|------------|---------|
| **Incomplete dominance** | Heterozygote shows a blended phenotype | Red x white snapdragon = pink |
| **Codominance** | Both alleles fully expressed | AB blood type (A and B antigens both present) |
| **Multiple alleles** | More than two alleles exist in the population | ABO blood types (three alleles: IA, IB, i) |

### Reflection Questions

1. In a cross between Pp and pp, what percentage of offspring would you expect to have white flowers?
2. Why does a dihybrid cross produce a 9:3:3:1 ratio instead of a simpler ratio?
3. Blood type involves codominance and multiple alleles. A mother with type A blood (IAi) and a father with type B blood (IBi) have a child. What are the possible blood types of the child?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 14 — "Mendel and the Gene Idea"
- **Khan Academy**, "Punnett Squares" — free interactive practice problems
- **HHMI BioInteractive**, "Genetics" — virtual labs and animations for Mendelian genetics
`,
    },
    {
      id: "ap-bio-genetics-checkpoint",
      slug: "genetics-checkpoint",
      title: "Checkpoint: Heredity & Genetics",
      content: `## Module Checkpoint: Heredity & Genetics

### Review

In this module, you explored the foundations of genetics. You learned Mendel's laws of segregation and independent assortment, how DNA is replicated before cell division, and how Punnett squares predict offspring ratios. You also encountered landmark experiments — Hershey-Chase, Meselson-Stahl — and explored patterns beyond simple dominance.

<!-- voice:section_check concept="Module review — heredity and genetics" -->

### Quiz

**Question 1:** Mendel's Law of Segregation states that:
A) Alleles blend together during reproduction
B) Each organism has two alleles per gene, which separate during gamete formation
C) Genes on the same chromosome are always inherited together
D) Dominant alleles are more common than recessive alleles

**Question 2:** True or False: In DNA base pairing, adenine pairs with cytosine.
Explain the correct pairing rules.

**Question 3:** The experiment that proved DNA replication is semiconservative was performed by __________ and __________ in 1958.

**Question 4:** Cross a heterozygous tall plant (Tt) with a homozygous short plant (tt). Draw the Punnett square and give the expected phenotype ratio.

**Question 5:** A couple both have type AB blood. Is it possible for them to have a child with type O blood? Use a Punnett square and your knowledge of codominance to explain your answer.

<!-- voice:key_insight insight="Genetics connects molecular biology (DNA) to whole-organism traits (phenotypes) through the rules Mendel discovered 160 years ago." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

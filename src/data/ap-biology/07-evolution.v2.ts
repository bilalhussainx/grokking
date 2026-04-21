import { Module } from "../types";

export const evolutionModule: Module = {
  id: "ap-bio-evolution",
  title: "Natural Selection & Evolution",
  description: "Explore Darwin's theory, the evidence for evolution, mechanisms of speciation, and how Hardy-Weinberg equilibrium describes stable populations. Reference: Campbell Biology (Urry et al., 12th ed., Pearson, 2021), Chapters 22-25.",
  lessons: [
    {
      id: "ap-bio-darwin-natural-selection",
      slug: "darwin-natural-selection",
      title: "Darwin and Natural Selection",
      content: `## Darwin and Natural Selection

<!-- voice:section_check concept="Darwin's theory of evolution by natural selection" -->

### What You'll Learn

- The four conditions required for natural selection
- How Darwin developed his theory
- The difference between natural selection and evolution

### The Most Powerful Idea in Biology

In 1859, Charles Darwin published *On the Origin of Species*, and biology was never the same. His central idea — **natural selection** — is remarkably simple, yet it explains the staggering diversity of life on Earth.

Think of it this way: imagine a classroom where the teacher gives extra credit to students who show up early. Over time, the class naturally shifts toward earlier arrivals — not because anyone planned it, but because the "early arrivers" are rewarded. Natural selection works the same way, except the "extra credit" is survival and reproduction.

<!-- voice:section_check concept="Four conditions for natural selection" -->

### The Four Conditions

Natural selection occurs when ALL four conditions are met:

| Condition | Explanation | Example |
|-----------|------------|---------|
| **Variation** | Individuals in a population differ in traits | Some beetles are green, some are brown |
| **Heritability** | Those differences are passed to offspring | Brown beetles have brown offspring |
| **Differential survival** | Some traits help individuals survive better | Brown beetles are camouflaged on brown soil, green beetles are eaten by birds |
| **Differential reproduction** | Survivors produce more offspring | More brown beetles in the next generation |

Over many generations, the population shifts — more brown beetles, fewer green ones. This is **natural selection**: the environment "selects" which traits become more common.

\`\`\`mermaid
graph LR
    A[Variation] --> B[Competition]
    B --> C[Selection]
    C --> D[Reproduction]
    D --> E[Adaptation]
    E -.->|Mutation| A
\`\`\`

### Darwin's Journey

Darwin didn't invent his theory overnight. Key influences:

**HMS Beagle voyage (1831-1836):** Darwin visited the Galapagos Islands, where he noticed that finches on different islands had different beak shapes — each adapted to a different food source. This observation planted the seed.

**Thomas Malthus (1838):** Darwin read Malthus's essay on population growth and realized that organisms produce more offspring than can survive — creating competition.

**Alfred Russel Wallace (1858):** Wallace independently arrived at the same theory, prompting Darwin to finally publish.

### Natural Selection vs. Evolution

These terms are often confused:

- **Natural selection** is a *mechanism* — a process that causes change
- **Evolution** is the *result* — the change in allele frequencies in a population over time

Natural selection is the most important mechanism of evolution, but not the only one. Others include **genetic drift** (random changes in allele frequency, especially in small populations), **gene flow** (movement of alleles between populations), and **mutation** (the ultimate source of new alleles).

<!-- voice:key_insight insight="Natural selection does not have a goal or direction. It simply means that organisms with traits better suited to their current environment are more likely to survive and reproduce." -->

### Reflection Questions

1. Why is variation essential for natural selection? What would happen in a population with no variation?
2. Natural selection acts on phenotypes (visible traits), but evolution is measured in genotypes (allele frequencies). Why is this distinction important?
3. Darwin observed that Galapagos finches had different beak shapes on different islands. How does natural selection explain this?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 22 — "Descent with Modification"
- **Charles Darwin**, *On the Origin of Species*, 1859 — the original work (free online at Project Gutenberg)
- **Jerry Coyne**, *Why Evolution Is True*, Viking, 2009 — accessible modern overview of evolutionary evidence
`,
    },
    {
      id: "ap-bio-evidence-evolution",
      slug: "evidence-evolution",
      title: "Evidence for Evolution",
      content: `## Evidence for Evolution

<!-- voice:section_check concept="Multiple independent lines of evidence supporting evolution" -->

### What You'll Learn

- Five major categories of evidence for evolution
- How fossils, anatomy, molecules, biogeography, and direct observation all point to the same conclusion
- Why independent lines of evidence make the case so strong

### Building a Case

In a courtroom, a single piece of evidence might be debated. But when fingerprints, DNA, eyewitness testimony, security footage, and motive all point to the same conclusion, the case is overwhelming. Evolution is supported by **five independent categories of evidence** — and they all tell the same story.

<!-- voice:section_check concept="Fossil record and transitional forms" -->

### 1. The Fossil Record

Fossils show a clear sequence of life forms over time. Simple organisms appear in older rock layers; complex organisms appear in newer layers. **Transitional fossils** show intermediate forms between major groups:

- **Tiktaalik** (2004, discovered by Neil Shubin): A 375-million-year-old fossil with features of both fish (scales, fins) and land animals (flat head, neck, wrist bones). It's a "fishapod" — the transition from water to land.
- **Archaeopteryx**: A 150-million-year-old fossil with both dinosaur features (teeth, bony tail) and bird features (feathers, wishbone).

### 2. Comparative Anatomy

| Type | Definition | Example |
|------|-----------|---------|
| **Homologous structures** | Same underlying structure, different function | Human arm, whale flipper, bat wing — all have the same bones |
| **Analogous structures** | Different structure, same function | Bird wing and insect wing — similar function but completely different origin |
| **Vestigial structures** | Reduced, functionless remnants of once-useful structures | Human appendix, whale pelvis bones, ostrich wings |

Homologous structures are the strongest anatomical evidence — they show that different species inherited the same body plan from a common ancestor and modified it.

### 3. Molecular Evidence

DNA comparisons reveal evolutionary relationships. The more similar two species' DNA sequences are, the more recently they shared a common ancestor.

- Humans and chimpanzees share about **98.7%** of their DNA
- Humans and mice share about **85%**
- Humans and bananas share about **60%**

Even the genetic code itself is evidence — all life uses the same codons for the same amino acids, suggesting a common origin.

### 4. Biogeography

Species distribution matches evolutionary history. Darwin noticed that island species resemble nearby mainland species (not species on other islands with similar environments). This makes sense if island species evolved from mainland ancestors.

### 5. Direct Observation

Evolution has been directly observed:
- **Antibiotic resistance in bacteria** — bacteria evolve resistance within years
- **Peter and Rosemary Grant's Galapagos finch studies** (1973-present) — documented beak size changes in response to drought within a single generation
- **The peppered moth** — frequency of dark vs. light moths shifted during and after England's Industrial Revolution as tree bark color changed

<!-- voice:key_insight insight="Five independent categories of evidence — fossils, anatomy, molecules, biogeography, and direct observation — all converge on the same conclusion: life evolves." -->

### Reflection Questions

1. Why are homologous structures (like the human arm and whale flipper) considered strong evidence for common ancestry?
2. If a creationist argued that similar DNA between species proves a common designer rather than a common ancestor, how would you respond using multiple lines of evidence?
3. Why is antibiotic resistance in bacteria considered direct observation of evolution?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 22 — "Descent with Modification"
- **Neil Shubin**, *Your Inner Fish*, Vintage, 2009 — the story of discovering Tiktaalik and what it reveals about our ancestry
- **HHMI BioInteractive**, "The Origin of Species: The Beak of the Finch" — documentary on the Grants' research
`,
    },
    {
      id: "ap-bio-speciation-hardy-weinberg",
      slug: "speciation-hardy-weinberg",
      title: "Speciation and Hardy-Weinberg Equilibrium",
      content: `## Speciation and Hardy-Weinberg Equilibrium

<!-- voice:section_check concept="How new species form and how population genetics works" -->

### What You'll Learn

- How geographic and reproductive isolation lead to new species
- The Hardy-Weinberg principle and what it means for populations
- The five conditions that must be met for no evolution to occur

### How One Species Becomes Two

**Speciation** is the process by which one species splits into two or more distinct species. It requires **reproductive isolation** — the two groups must stop interbreeding long enough for genetic differences to accumulate.

<!-- voice:section_check concept="Allopatric vs. sympatric speciation" -->

### Two Paths to New Species

**Allopatric speciation** ("other homeland"): A physical barrier — a mountain range, river, or ocean — separates a population. Over time, the isolated groups evolve independently and can no longer interbreed if they reunite.

Example: The Grand Canyon divides the Kaibab squirrel (north rim) and the Abert's squirrel (south rim). Same ancestor, now two distinct subspecies.

**Sympatric speciation** ("same homeland"): New species arise without geographic separation, often through **polyploidy** (an organism inherits extra sets of chromosomes). This is common in plants — many crop species (wheat, cotton, potatoes) are polyploid.

| Type | Barrier | Speed | Common In |
|------|---------|-------|-----------|
| Allopatric | Geographic (mountains, rivers, islands) | Slow (thousands-millions of years) | Animals |
| Sympatric | Reproductive or chromosomal | Can be fast (one generation for polyploidy) | Plants |

### Hardy-Weinberg Equilibrium: The Null Hypothesis of Evolution

The **Hardy-Weinberg principle** (1908) describes a population that is NOT evolving. If a population meets five conditions, allele frequencies will remain constant generation after generation:

1. **No mutation** — no new alleles are created
2. **Random mating** — no sexual selection or mate preference
3. **No natural selection** — all genotypes survive and reproduce equally
4. **Large population size** — no genetic drift
5. **No gene flow** — no migration in or out

The equation: **p² + 2pq + q² = 1**

Where p = frequency of the dominant allele, q = frequency of the recessive allele, and p + q = 1.

- p² = frequency of homozygous dominant (AA)
- 2pq = frequency of heterozygous (Aa)
- q² = frequency of homozygous recessive (aa)

### Why Hardy-Weinberg Matters

No real population meets all five conditions — so all populations are evolving to some degree. Hardy-Weinberg is useful as a **null hypothesis**: if a population's allele frequencies don't match the predicted values, something is causing evolution — and you can figure out what.

Example: If q² (the frequency of a recessive phenotype) is higher than expected, perhaps natural selection is favoring that genotype.

<!-- voice:key_insight insight="Hardy-Weinberg equilibrium describes a population that is NOT evolving. Since no real population meets all five conditions, all populations are always evolving — the question is how fast and in what direction." -->

### Reflection Questions

1. Why is geographic isolation so effective at producing new species?
2. In a population, 16% of individuals show the recessive phenotype (q² = 0.16). Calculate q, p, and the expected frequency of heterozygous carriers (2pq).
3. Why is Hardy-Weinberg equilibrium considered a "null hypothesis" rather than a description of reality?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapters 23-24 — "The Evolution of Populations" and "The Origin of Species"
- **Ernst Mayr**, *What Evolution Is*, Basic Books, 2001 — authoritative overview by one of the 20th century's greatest evolutionary biologists
- **Khan Academy**, "Hardy-Weinberg Equilibrium" — step-by-step problem-solving practice
`,
    },
    {
      id: "ap-bio-evolution-checkpoint",
      slug: "evolution-checkpoint",
      title: "Checkpoint: Natural Selection & Evolution",
      content: `## Module Checkpoint: Natural Selection & Evolution

### Review

In this module, you explored Darwin's theory of natural selection, examined five independent lines of evidence for evolution, and learned how new species form through speciation. You also encountered the Hardy-Weinberg principle — the mathematical foundation of population genetics.

<!-- voice:section_check concept="Module review — evolution" -->

### Quiz

**Question 1:** Which of the following is NOT a condition required for natural selection?
A) Variation in traits
B) Traits must be heritable
C) The population must be small
D) Some traits improve survival or reproduction

**Question 2:** True or False: Vestigial structures are evidence against evolution because they serve no purpose.
Explain your reasoning.

**Question 3:** The type of speciation that occurs when a geographic barrier separates a population is called __________ speciation.

**Question 4:** In a population of 1,000 individuals, 90 show the recessive phenotype (aa). Calculate q, p, and the expected number of heterozygous carriers (2pq).

**Question 5:** A friend says "Evolution means organisms always get better over time." Using what you've learned about natural selection, explain why this statement is inaccurate.

<!-- voice:key_insight insight="Evolution has no direction or goal — natural selection simply favors traits that improve survival and reproduction in the current environment. Change the environment, and the 'favored' traits change too." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

import { Module } from "../types";

export const ecologyModule: Module = {
  id: "ap-bio-ecology",
  title: "Ecology",
  description: "Explore how organisms interact with each other and their environment — populations, communities, ecosystems, and the challenges facing global biodiversity. Reference: Campbell Biology (Urry et al., 12th ed., Pearson, 2021), Chapters 52-56.",
  lessons: [
    {
      id: "ap-bio-populations",
      slug: "populations",
      title: "Population Ecology: Growth, Limits, and Carrying Capacity",
      content: `## Population Ecology: Growth, Limits, and Carrying Capacity

<!-- voice:section_check concept="How populations grow and what limits their growth" -->

### What You'll Learn

- The difference between exponential and logistic growth
- What carrying capacity means and what determines it
- Density-dependent vs. density-independent limiting factors

### How Populations Grow

Imagine you drop two rabbits on an island with unlimited food, water, and space. How fast would the population grow? At first, slowly — just a few offspring per generation. But each new generation produces more offspring, who produce more offspring. The population doesn't grow linearly (adding the same number each time) — it grows **exponentially** (multiplying each time).

**Exponential growth** follows the equation: dN/dt = rN

Where N = population size, r = per capita growth rate, and t = time. On a graph, this looks like a J-shaped curve — slow at first, then shooting upward.

<!-- voice:section_check concept="Carrying capacity and logistic growth" -->

### But Nothing Grows Forever

In reality, resources run out. Food becomes scarce, predators increase, disease spreads. Every environment has a **carrying capacity (K)** — the maximum population size it can sustainably support.

As the population approaches K, growth slows down. This is **logistic growth**, described by: dN/dt = rN((K - N)/K)

On a graph, this looks like an S-shaped curve — exponential growth at first, then leveling off near K.

### What Limits Population Growth?

| Factor Type | Depends on Population Density? | Examples |
|------------|-------------------------------|----------|
| **Density-dependent** | Yes — stronger effect as population grows | Competition for food, predation, disease, waste accumulation |
| **Density-independent** | No — affects all populations equally | Natural disasters, seasonal weather, human destruction of habitat |

A forest fire kills the same percentage of deer whether there are 100 or 10,000 — that's density-independent. But disease spreads faster in a crowded population — that's density-dependent.

### r-Selected vs. K-Selected Species

| Strategy | r-Selected | K-Selected |
|----------|-----------|------------|
| **Offspring** | Many, small | Few, large |
| **Parental care** | Little to none | Extensive |
| **Lifespan** | Short | Long |
| **Maturity** | Early | Late |
| **Environment** | Unstable | Stable |
| **Examples** | Bacteria, insects, dandelions | Elephants, whales, humans |

<!-- voice:key_insight insight="No population can grow exponentially forever. Carrying capacity is nature's speed limit — and understanding it is essential for conservation, agriculture, and public health." -->

### Reflection Questions

1. Why does exponential growth eventually become unsustainable in any real environment?
2. If a disease kills 50% of a population regardless of density, is it density-dependent or density-independent?
3. Humans have increased Earth's carrying capacity for our species through agriculture and technology. Can this continue indefinitely? What are the limits?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 53 — "Population Ecology"
- **Thomas Malthus**, *An Essay on the Principle of Population*, 1798 — the work that inspired both Darwin and modern population ecology
- **World Population Review** (worldpopulationreview.com) — real-time data on human population trends
`,
    },
    {
      id: "ap-bio-communities-ecosystems",
      slug: "communities-ecosystems",
      title: "Communities and Ecosystems: How Life Connects",
      content: `## Communities and Ecosystems: How Life Connects

<!-- voice:section_check concept="How species interact in communities and how energy flows through ecosystems" -->

### What You'll Learn

- The main types of species interactions (competition, predation, symbiosis)
- How energy flows through trophic levels
- Why only about 10% of energy transfers between levels

### The Web of Life

No species lives alone. Every organism exists within a **community** — all the species living in the same area — and within an **ecosystem** — the community plus the nonliving environment (water, soil, sunlight, temperature).

<!-- voice:section_check concept="Types of species interactions" -->

### Species Interactions

| Interaction | Species A | Species B | Example |
|-------------|-----------|-----------|---------|
| **Competition (-/-)** | Harmed | Harmed | Lions and hyenas competing for zebra kills |
| **Predation (+/-)** | Benefits (predator) | Harmed (prey) | Owl eating a mouse |
| **Mutualism (+/+)** | Benefits | Benefits | Bees pollinate flowers; flowers feed bees |
| **Commensalism (+/0)** | Benefits | Unaffected | Barnacles riding on a whale |
| **Parasitism (+/-)** | Benefits (parasite) | Harmed (host) | Tapeworm living in a human intestine |

**Keystone species** have disproportionate effects on their communities. When ecologist Robert Paine removed the starfish *Pisaster ochraceus* from tide pools in 1966, mussels took over and biodiversity collapsed — proving that one predator was holding the entire community in balance.

### Energy Flow: The 10% Rule

Energy enters ecosystems as sunlight and flows through **trophic levels**:

1. **Producers** (plants, algae) — capture sunlight via photosynthesis
2. **Primary consumers** (herbivores) — eat producers
3. **Secondary consumers** (small carnivores) — eat herbivores
4. **Tertiary consumers** (top predators) — eat other carnivores
5. **Decomposers** (bacteria, fungi) — break down dead matter at every level

Here's the critical rule: only about **10%** of energy at one trophic level is passed to the next. The rest is lost as heat through cellular respiration. This is why food chains rarely have more than 4-5 levels — there simply isn't enough energy left.

This also explains why there are more rabbits than foxes, and more grass than rabbits — each level supports fewer organisms than the one below it, creating an **energy pyramid**.

### Nutrient Cycling

Unlike energy (which flows one way and exits as heat), **matter cycles** through ecosystems. The carbon cycle, nitrogen cycle, water cycle, and phosphorus cycle all involve matter moving between living organisms and the nonliving environment.

<!-- voice:key_insight insight="Energy flows through ecosystems (one-way, with 90% lost at each step), but matter cycles (recycled endlessly between living and nonliving components)." -->

### Reflection Questions

1. Why does the 10% rule limit the number of trophic levels in most ecosystems?
2. If all decomposers suddenly vanished, what would happen to nutrient cycling — and eventually to producers?
3. Why would removing a keystone species cause more disruption than removing a non-keystone species of the same size?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapters 54-55 — "Community Ecology" and "Ecosystems and Restoration Ecology"
- **Robert Paine**, "Food Web Complexity and Species Diversity," *American Naturalist*, 1966 — the keystone species concept
- **HHMI BioInteractive**, "Some Animals Are More Equal than Others: Keystone Species" — documentary
`,
    },
    {
      id: "ap-bio-biodiversity",
      slug: "biodiversity",
      title: "Biodiversity: Why It Matters and What Threatens It",
      content: `## Biodiversity: Why It Matters and What Threatens It

<!-- voice:section_check concept="The value of biodiversity and current threats" -->

### What You'll Learn

- What biodiversity means at genetic, species, and ecosystem levels
- Why biodiversity matters for human survival
- The main threats to biodiversity today

### More Than Just "How Many Species"

When most people hear "biodiversity," they think of the total number of species. But **biodiversity** operates at three levels:

1. **Genetic diversity** — variation in alleles within a species (important for adaptation)
2. **Species diversity** — the variety of species in a community
3. **Ecosystem diversity** — the variety of habitats, communities, and ecological processes in a region

All three levels matter. A rainforest with 10,000 species is more resilient than a tree farm with 1 species. A population of cheetahs with high genetic diversity is more resilient than one where all individuals are nearly identical (which is actually a problem facing real cheetahs today).

<!-- voice:section_check concept="Why biodiversity matters" -->

### Why Should You Care?

Biodiversity isn't just about protecting cute animals. It provides **ecosystem services** — benefits that humans depend on for survival:

| Service Type | Examples |
|-------------|---------|
| **Provisioning** | Food, clean water, medicines, timber |
| **Regulating** | Climate regulation, flood control, pollination, water purification |
| **Supporting** | Nutrient cycling, soil formation, oxygen production |
| **Cultural** | Recreation, aesthetic value, spiritual significance |

A concrete example: approximately **75% of the world's food crops** depend on animal pollinators, primarily bees (FAO, 2019). Pollinator decline directly threatens food security.

### The Current Crisis

Scientists describe the current loss of biodiversity as the **sixth mass extinction**. The previous five were caused by natural events (asteroid impacts, volcanic eruptions, climate shifts). This one is caused by human activities.

The main threats, often summarized as **HIPPO**:

| Threat | Description | Example |
|--------|------------|---------|
| **H** — Habitat destruction | Clearing forests, draining wetlands, paving over land | Amazon deforestation: ~17% of the Amazon has been lost since 1970 |
| **I** — Invasive species | Non-native species outcompeting natives | Brown tree snake in Guam eliminated most native bird species |
| **P** — Pollution | Chemicals, plastics, excess nutrients | Pesticides reducing bee populations; plastic in ocean food chains |
| **P** — Population growth | More humans = more resource demand | Human population tripled from 2.5 billion (1950) to 8 billion (2023) |
| **O** — Overexploitation | Hunting, fishing, harvesting beyond sustainable levels | Atlantic cod fishery collapse in the 1990s |

E.O. Wilson, one of the most influential biologists of the 20th century, warned: "The one process ongoing in the 1980s that will take millions of years to correct is the loss of genetic and species diversity by the destruction of natural habitats" (*Biophilia*, Harvard University Press, 1984).

<!-- voice:key_insight insight="Biodiversity is not a luxury — it's the foundation of ecosystem services that humans depend on for food, clean water, medicine, and climate stability." -->

### What Can Be Done?

Conservation biology applies ecological principles to protect biodiversity:
- **Protected areas** (national parks, marine reserves)
- **Habitat restoration** (replanting forests, restoring wetlands)
- **Captive breeding** programs for endangered species
- **Legislation** (Endangered Species Act, CITES treaty)
- **Reducing carbon emissions** to slow climate change

### Reflection Questions

1. Why is genetic diversity within a species important for that species' long-term survival?
2. Of the five HIPPO threats, which do you think is the hardest to address? Why?
3. Some people argue that economic development should take priority over conservation. How would you respond using the concept of ecosystem services?

### Deeper Reading

- **Urry et al.**, *Campbell Biology*, 12th ed., Pearson, 2021, Chapter 56 — "Conservation Biology and Global Change"
- **E.O. Wilson**, *Half-Earth*, Liveright, 2016 — Wilson's proposal to protect half the planet for biodiversity
- **IUCN Red List** (iucnredlist.org) — the global standard for species conservation status
`,
    },
    {
      id: "ap-bio-ecology-checkpoint",
      slug: "ecology-checkpoint",
      title: "Checkpoint: Ecology",
      content: `## Module Checkpoint: Ecology

### Review

In this module, you explored ecology from populations to the biosphere. You learned how populations grow and what limits them, how species interact in communities, how energy flows and matter cycles through ecosystems, and why biodiversity is essential for both ecological health and human survival.

<!-- voice:section_check concept="Module review — ecology" -->

### Quiz

**Question 1:** A population growing according to the logistic model will level off at:
A) Its birth rate
B) Its carrying capacity (K)
C) Its maximum growth rate (r)
D) Zero

**Question 2:** True or False: Energy is recycled through ecosystems, while matter flows through in one direction.
Explain the correct relationship between energy flow and nutrient cycling.

**Question 3:** The type of species interaction where both species benefit is called __________.

**Question 4:** In 2-3 sentences, explain why food chains rarely have more than 4-5 trophic levels. Use the 10% rule in your answer.

**Question 5:** A logging company wants to clear-cut a forest that is home to a keystone species of woodpecker. Using what you know about keystone species and ecosystem services, write a brief argument (3-4 sentences) for why this might have consequences beyond just losing one bird species.

<!-- voice:key_insight insight="Ecology connects every concept in biology — from molecular processes (photosynthesis, respiration) to global systems (climate, nutrient cycles). Understanding ecology means understanding how all of life is interconnected." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

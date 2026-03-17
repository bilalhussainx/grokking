import { Module } from "../types";

export const developmentalModule: Module = {
  id: "psych-developmental",
  title: "Developmental Psychology",
  description:
    "Understand how humans change across the lifespan — Piaget's cognitive stages, Erikson's psychosocial development, attachment theory, and adolescent identity. Reference: Myers & DeWall, Psychology, 13th ed., Worth Publishers, 2021, Chapter 5.",
  lessons: [
    {
      id: "psych-piaget-cognitive",
      slug: "piaget-cognitive",
      title: "Piaget's Stages of Cognitive Development",
      content: `## Piaget's Stages of Cognitive Development

<!-- voice:section_check concept="Piaget's four stages of how children think" -->

### What You'll Learn

- Jean Piaget's four stages of cognitive development
- Key concepts: schemas, assimilation, accommodation
- What children can and cannot understand at each stage

### How Children Think Differently

Children don't just know less than adults — they actually **think differently**. This was the revolutionary insight of Swiss psychologist **Jean Piaget** (1896-1980), who spent decades observing children (including his own) and documenting how their reasoning changes as they grow.

Think of it like software updates. A 3-year-old's brain isn't running the same "software" as a 12-year-old's. Each stage represents a fundamentally different way of understanding the world.

<!-- voice:section_check concept="Schemas, assimilation, and accommodation" -->

### Building Mental Models

Piaget proposed that children build understanding through **schemas** — mental frameworks for organizing information. When a toddler sees a dog and says "doggy," they're using a schema for "four-legged furry animal."

Two processes update schemas:
- **Assimilation** — fitting new information into an existing schema (seeing a cat and calling it "doggy")
- **Accommodation** — modifying a schema or creating a new one when existing schemas don't fit (learning that cats and dogs are different categories)

### The Four Stages

| Stage | Age | Key Development | Limitation |
|-------|-----|----------------|------------|
| **Sensorimotor** | Birth-2 years | Learning through senses and movement; developing **object permanence** (understanding that objects exist even when hidden) | No abstract thought |
| **Preoperational** | 2-7 years | Language, symbolic play, imagination | **Egocentrism** (difficulty seeing others' perspectives); lack of **conservation** (can't understand that quantity stays the same when shape changes) |
| **Concrete operational** | 7-11 years | Logical thinking about concrete events; understands conservation | Struggles with abstract/hypothetical thinking |
| **Formal operational** | 12+ years | Abstract reasoning, hypothetical thinking, systematic problem-solving | Not everyone reaches this stage fully |

### Classic Piaget Experiments

**Object permanence (Sensorimotor):** Hide a toy under a blanket in front of a 6-month-old — they act as if it no longer exists. By 8-12 months, they'll search for it. They've learned that objects continue to exist even when out of sight.

**Conservation (Preoperational):** Pour water from a short, wide glass into a tall, thin glass in front of a 4-year-old. They'll say the tall glass has "more water" because they focus on height alone. By age 7 (concrete operational), children understand the amount hasn't changed.

**Egocentrism (Preoperational):** Show a child a model of three mountains and ask what someone sitting on the other side sees. Preoperational children describe their own view, unable to imagine another perspective.

<!-- voice:key_insight insight="Piaget showed that children don't just know less than adults — they think in fundamentally different ways at different ages, progressing through stages of increasingly complex reasoning." -->

### Reflection Questions

1. A 3-year-old covers their eyes and says "You can't see me!" Which Piagetian concept explains this?
2. At what stage can children first think about hypothetical situations like "What if gravity didn't exist?" Why is this stage important for science and math education?
3. Modern research suggests Piaget underestimated children's abilities. What might a critic say about his stage theory?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 5 — "Developing Through the Life Span"
- **Jean Piaget**, *The Construction of Reality in the Child*, Basic Books, 1954 — Piaget's own foundational work
- **Alison Gopnik**, *The Philosophical Baby*, Picador, 2009 — modern research on children's cognitive abilities
`,
    },
    {
      id: "psych-erikson-attachment",
      slug: "erikson-attachment",
      title: "Erikson's Stages and Attachment Theory",
      content: `## Erikson's Stages and Attachment Theory

<!-- voice:section_check concept="Psychosocial development and the importance of early attachment" -->

### What You'll Learn

- Erikson's eight psychosocial stages of development
- The key crisis at each stage
- Bowlby and Ainsworth's attachment theory and its types

### Development Doesn't Stop at Childhood

While Piaget focused on how children *think*, **Erik Erikson** (1902-1994) focused on how people develop *socially and emotionally* — and he argued this development continues across the entire lifespan, from infancy to old age.

Erikson proposed eight **psychosocial stages**, each defined by a central **crisis** — a challenge that must be resolved for healthy development.

<!-- voice:section_check concept="Erikson's eight stages" -->

### The Eight Stages

| Stage | Age | Crisis | Healthy Outcome | Unhealthy Outcome |
|-------|-----|--------|-----------------|-------------------|
| 1 | Birth-1 year | Trust vs. Mistrust | Sense of security | Fear, suspicion |
| 2 | 1-3 years | Autonomy vs. Shame/Doubt | Independence | Self-doubt |
| 3 | 3-6 years | Initiative vs. Guilt | Purpose, confidence to try new things | Guilt about desires |
| 4 | 6-12 years | Industry vs. Inferiority | Competence, pride in achievements | Feelings of inadequacy |
| 5 | 12-18 years | Identity vs. Role Confusion | Clear sense of self | Uncertainty about identity |
| 6 | Young adult | Intimacy vs. Isolation | Deep relationships | Loneliness |
| 7 | Middle adult | Generativity vs. Stagnation | Feeling of contribution to the world | Feeling unproductive |
| 8 | Late adult | Integrity vs. Despair | Satisfaction with life lived | Regret |

**Stage 5 (Identity vs. Role Confusion)** is especially relevant for high school students. Erikson coined the term **identity crisis** — the struggle to figure out who you are, what you value, and where you fit in. This is normal and necessary.

### Attachment Theory: Your First Relationship Shapes the Rest

Before Erikson's social stages can unfold, infants must form a basic **attachment** — an emotional bond with a caregiver. British psychiatrist **John Bowlby** (1969) argued that attachment is biologically programmed — infants are born needing to bond with a caregiver for survival.

American psychologist **Mary Ainsworth** (1978) tested attachment through the **Strange Situation** — observing how infants (12-18 months) responded when their caregiver left and returned in an unfamiliar room:

| Attachment Style | Caregiver Leaves | Caregiver Returns | Percentage |
|-----------------|-----------------|-------------------|-----------|
| **Secure** | Distressed but manageable | Happy, seeks comfort | ~65% |
| **Anxious-ambivalent** | Very distressed | Clingy but also angry | ~10% |
| **Avoidant** | Little distress | Ignores caregiver | ~20% |
| **Disorganized** | Confused, fearful | Contradictory behavior | ~5% |

Research by Cindy Hazan and Phillip Shaver (1987) showed that adult romantic relationship patterns often mirror early attachment styles — securely attached children tend to have healthier adult relationships.

<!-- voice:key_insight insight="Early attachment doesn't determine your destiny, but it creates a template for how you approach relationships — a template that can be understood and changed with awareness." -->

### Reflection Questions

1. Which of Erikson's stages are you currently in? Do you feel the crisis he describes resonates with your experience?
2. Why would Bowlby argue that attachment is biologically programmed rather than simply learned?
3. If early attachment influences adult relationships, what hope exists for someone who had an insecure attachment style as a child?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 5 — "Infancy and Childhood"
- **Erik Erikson**, *Identity: Youth and Crisis*, W.W. Norton, 1968 — Erikson's own exploration of adolescent identity
- **Amir Levine & Rachel Heller**, *Attached*, TarcherPerigee, 2010 — attachment theory applied to adult relationships
`,
    },
    {
      id: "psych-adolescence",
      slug: "adolescence",
      title: "Adolescence: The Brain Under Construction",
      content: `## Adolescence: The Brain Under Construction

<!-- voice:section_check concept="Brain development and identity formation in adolescence" -->

### What You'll Learn

- How the adolescent brain is different from the adult brain
- Why teenagers take more risks
- How identity development unfolds during the teenage years

### Your Brain Is Not Finished Yet

Here's something that might surprise you: your brain won't be fully developed until your **mid-20s**. Specifically, the **prefrontal cortex** — the part responsible for planning, impulse control, and weighing consequences — is the last brain region to fully mature.

Meanwhile, the **limbic system** (especially the amygdala, which processes emotions and rewards) is already highly active during adolescence. This creates what neuroscientist Laurence Steinberg calls a **maturity gap**: a powerful emotional gas pedal with weak brakes.

<!-- voice:section_check concept="Prefrontal cortex development and risk-taking" -->

### Why Teenagers Take Risks

This isn't a character flaw — it's neuroscience. The adolescent brain is wired to:

- **Seek novelty and rewards** — dopamine sensitivity peaks in adolescence, making new experiences feel more exciting than at any other age
- **Be highly influenced by peers** — brain imaging shows that the presence of peers activates reward centers in teenage brains but not adult brains (Chein et al., 2011)
- **Underweigh long-term consequences** — not because teens don't know the risks, but because the prefrontal cortex isn't yet strong enough to override emotional impulses in the heat of the moment

| Brain Region | Maturity in Adolescence | Effect |
|-------------|------------------------|--------|
| **Amygdala** (emotion) | Fully active | Strong emotional reactions |
| **Nucleus accumbens** (reward) | Highly sensitive | Intense pleasure from rewards; risk-seeking |
| **Prefrontal cortex** (planning/impulse control) | Still developing | Weaker ability to plan ahead and resist impulses |

### Identity Development

Erikson's fifth stage — **Identity vs. Role Confusion** — unfolds throughout adolescence. Developmental psychologist **James Marcia** (1966) expanded Erikson's ideas, identifying four identity statuses based on two dimensions: *exploration* (have you considered different options?) and *commitment* (have you made a choice?):

| Status | Exploration | Commitment | Description |
|--------|------------|------------|-------------|
| **Identity achievement** | Yes | Yes | Explored options and made a clear choice |
| **Moratorium** | Yes | No | Actively exploring, haven't decided yet |
| **Foreclosure** | No | Yes | Committed without exploring (adopted parents' values without questioning) |
| **Identity diffusion** | No | No | Neither exploring nor committed |

Most adolescents move through these statuses over time, and it's normal to be in different statuses for different aspects of identity (career, religion, politics, relationships).

<!-- voice:key_insight insight="Adolescent risk-taking is not recklessness — it's the result of a brain where the emotional accelerator matures before the rational brakes. Understanding this helps you make smarter choices." -->

### Reflection Questions

1. Knowing that your prefrontal cortex isn't fully developed, how might this change how you approach decisions with long-term consequences?
2. Which of Marcia's four identity statuses best describes where you are right now? Is it the same for all areas of your life?
3. Adults often say "I wish I had the energy of a teenager." Using what you know about dopamine sensitivity, explain why adolescence feels more intense than later life stages.

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 5 — "Adolescence"
- **Laurence Steinberg**, *Age of Opportunity: Lessons from the New Science of Adolescence*, Mariner Books, 2015 — leading researcher on the adolescent brain
- **Frances Jensen**, *The Teenage Brain*, Harper, 2015 — neuroscience of adolescence for general audiences
`,
    },
    {
      id: "psych-developmental-checkpoint",
      slug: "developmental-checkpoint",
      title: "Checkpoint: Developmental Psychology",
      content: `## Module Checkpoint: Developmental Psychology

### Review

In this module, you explored how humans develop across the lifespan. You learned Piaget's four stages of cognitive development, Erikson's eight psychosocial stages, how early attachment shapes later relationships, and why the adolescent brain is uniquely wired for risk-taking and identity exploration.

<!-- voice:section_check concept="Module review — developmental psychology" -->

### Quiz

**Question 1:** A child who sees water poured from a short glass into a tall glass and says "now there's more water" is in Piaget's:
A) Sensorimotor stage
B) Preoperational stage
C) Concrete operational stage
D) Formal operational stage

**Question 2:** True or False: According to Erikson, psychosocial development ends in adolescence.
Explain what actually happens in adulthood.

**Question 3:** In Ainsworth's Strange Situation, an infant who shows little distress when the caregiver leaves and ignores them upon return is classified as __________ attached.

**Question 4:** In 2-3 sentences, explain why teenagers are more likely to take risks when they're with friends than when they're alone. Use neuroscience concepts from this module.

**Question 5:** A 15-year-old has adopted her parents' political views without ever questioning them. Using Marcia's identity statuses, which status is she in? What would need to happen for her to reach identity achievement?

<!-- voice:key_insight insight="Development is a lifelong process — from the infant forming their first attachment to the elderly reflecting on a life lived. Understanding these stages helps you understand yourself and others." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

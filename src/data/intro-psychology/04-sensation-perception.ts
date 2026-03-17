import { Module } from "../types";

export const sensationPerceptionModule: Module = {
  id: "psych-sensation-perception",
  title: "Sensation & Perception",
  description:
    "Understand how your senses gather information and how your brain constructs perception — from vision and hearing to Gestalt principles and optical illusions. Reference: Myers & DeWall, Psychology, 13th ed., Worth Publishers, 2021, Chapters 6-7.",
  lessons: [
    {
      id: "psych-sensation-basics",
      slug: "sensation-basics",
      title: "Sensation: How We Detect the World",
      content: `## Sensation: How We Detect the World

<!-- voice:section_check concept="The difference between sensation and perception" -->

### What You'll Learn

- The difference between sensation and perception
- How sensory receptors convert stimuli into neural signals
- Key concepts: absolute threshold, difference threshold, sensory adaptation

### Two Steps to Experience

You see a sunset. You hear a song. You smell fresh bread. These experiences feel seamless, but they actually involve two distinct processes:

1. **Sensation** — detecting physical energy from the environment (light, sound, chemicals) through your sense organs
2. **Perception** — organizing and interpreting that sensory information to give it meaning

Sensation is what your eyes detect; perception is what your brain constructs. Your eyes detect wavelengths of light — your brain perceives "red."

<!-- voice:section_check concept="Transduction and thresholds" -->

### Transduction: Converting Energy to Signals

Your sense organs contain specialized **receptor cells** that convert physical energy into electrical signals the brain can understand. This process is called **transduction** — like a microphone converting sound waves into electrical signals.

| Sense | Stimulus | Receptor | Where Transduction Occurs |
|-------|---------|----------|--------------------------|
| **Vision** | Light waves | Rods and cones | Retina (back of the eye) |
| **Hearing** | Sound waves | Hair cells | Cochlea (inner ear) |
| **Touch** | Pressure, temperature | Various skin receptors | Skin |
| **Taste** | Chemical molecules | Taste receptor cells | Taste buds (tongue) |
| **Smell** | Chemical molecules | Olfactory receptor neurons | Olfactory epithelium (nasal cavity) |

### Thresholds: What Can We Detect?

**Absolute threshold** — the minimum amount of stimulus energy needed to detect the stimulus 50% of the time. Examples:
- Vision: a candle flame 30 miles away on a clear night
- Hearing: a watch ticking 20 feet away in a quiet room
- Smell: a single drop of perfume in a 3-room apartment

**Difference threshold (Just Noticeable Difference or JND)** — the smallest change in stimulus intensity that a person can detect. Weber's Law states that the JND is proportional to the original stimulus intensity. A 1-pound difference is noticeable when comparing 10-pound weights but not when comparing 100-pound weights.

### Sensory Adaptation

Have you ever noticed a bad smell when you first enter a room, but after a few minutes, you don't notice it anymore? That's **sensory adaptation** — your sensory receptors become less responsive to constant, unchanging stimulation. It's your brain's way of saying "I've noted this — let me focus on what's new."

<!-- voice:key_insight insight="Sensation detects raw physical energy; perception interprets it. Your brain doesn't experience the world directly — it constructs a model based on the signals your senses provide." -->

### Reflection Questions

1. Why is sensory adaptation useful for survival? Can you think of a situation where it could be dangerous?
2. If the absolute threshold is defined as 50% detection, why not 100%?
3. Using Weber's Law, explain why you might not notice a \$1 increase on a \$50 item but would notice it on a \$5 item.

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 6 — "Sensation and Perception"
- **Gustav Fechner**, *Elements of Psychophysics*, 1860 — the foundational text on measuring sensation
- **Khan Academy**, "Sensation and Perception" — free video overview
`,
    },
    {
      id: "psych-vision-hearing",
      slug: "vision-hearing",
      title: "Vision and Hearing: Our Primary Senses",
      content: `## Vision and Hearing: Our Primary Senses

<!-- voice:section_check concept="How the eye processes light and the ear processes sound" -->

### What You'll Learn

- How the eye converts light into neural signals
- How the ear converts sound waves into hearing
- Key structures in each system

### Seeing the Light

Vision is our dominant sense — about 30% of the cerebral cortex is devoted to processing visual information. Light enters the eye and is focused onto the **retina**, where two types of photoreceptor cells convert it into electrical signals:

| Receptor | Sensitivity | Detail | Color | Location on Retina |
|----------|------------|--------|-------|-------------------|
| **Rods** | Very sensitive (work in dim light) | Low detail | No color (grayscale) | Peripheral retina |
| **Cones** | Less sensitive (need bright light) | High detail | Full color | Concentrated in fovea (center) |

This is why you can't see color well in the dark — your cones need bright light to function, so you rely on rods, which only see in grayscale.

The visual pathway: Light enters the cornea, passes through the pupil, is focused by the lens onto the retina, where rods and cones transduce it into neural signals that travel via the optic nerve to the visual cortex in the occipital lobe.

### Hearing Sound

Sound is vibration — molecules of air pushed and pulled in waves. Sound waves have two key properties:

- **Frequency** (measured in Hertz) = pitch (low frequency = bass, high frequency = treble)
- **Amplitude** (measured in decibels) = loudness

The auditory pathway: Sound waves enter the ear canal, vibrate the eardrum, which pushes three tiny bones (hammer, anvil, stirrup) in the middle ear, which vibrate the oval window, which creates waves in the fluid of the **cochlea**. Inside the cochlea, **hair cells** bend in response to these waves and transduce the vibration into neural signals sent via the auditory nerve to the temporal lobe.

| Ear Region | Structures | Function |
|-----------|-----------|----------|
| **Outer ear** | Pinna, ear canal, eardrum | Collects and channels sound |
| **Middle ear** | Hammer, anvil, stirrup | Amplifies vibrations |
| **Inner ear** | Cochlea, hair cells | Transduces vibration into neural signals |

<!-- voice:key_insight insight="Both vision and hearing rely on transduction — converting physical energy (light waves or sound waves) into electrical signals that the brain can interpret." -->

### Reflection Questions

1. Why do you see better detail in the center of your visual field than at the edges?
2. Prolonged exposure to loud noise damages hair cells in the cochlea. Why is this type of hearing loss permanent?
3. How are rods and cones similar to the concepts of "night vision" and "HD daytime vision"?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapters 6 — "Vision" and "Hearing"
- **Oliver Sacks**, *The Island of the Colorblind*, Vintage, 1997 — a neurologist's exploration of rare visual conditions
- **National Institute on Deafness** (nidcd.nih.gov) — resources on hearing and hearing loss prevention
`,
    },
    {
      id: "psych-gestalt-illusions",
      slug: "gestalt-illusions",
      title: "Gestalt Principles and Optical Illusions",
      content: `## Gestalt Principles and Optical Illusions

<!-- voice:section_check concept="How the brain organizes sensory information into meaningful patterns" -->

### What You'll Learn

- The Gestalt principles of perceptual organization
- Why optical illusions fool your brain
- How top-down and bottom-up processing work together

### Your Brain Is a Pattern Machine

Your brain doesn't just passively record what your senses detect — it actively **organizes** incoming information into meaningful patterns. This was the key insight of the **Gestalt psychologists** (early 20th century, Germany), who argued that "the whole is greater than the sum of its parts."

Look at three dots arranged in a triangle. You don't see three separate dots — you see a *triangle*. Your brain adds structure that isn't physically there.

<!-- voice:section_check concept="The Gestalt principles" -->

### Gestalt Principles of Grouping

| Principle | Rule | Example |
|-----------|------|---------|
| **Figure-ground** | We organize visual input into a foreground (figure) and background (ground) | The famous Rubin's vase — do you see a vase or two faces? |
| **Proximity** | Objects near each other are grouped together | X X  X X — you see two pairs, not four separate X's |
| **Similarity** | Similar objects are grouped together | A row of alternating red and blue dots — you see red groups and blue groups |
| **Continuity** | We prefer smooth, continuous lines over abrupt changes | Two curved lines crossing look like two lines, not four segments |
| **Closure** | We fill in gaps to see complete shapes | A circle with a small section missing still looks like a circle |
| **Common fate** | Objects moving in the same direction are grouped together | A flock of birds flying together is perceived as one group |

### Why Optical Illusions Work

Optical illusions exploit the shortcuts your brain uses. Your visual system makes assumptions based on past experience — and illusions violate those assumptions:

- **The Muller-Lyer illusion** — two lines of equal length look different because of the arrow-shaped endings. Your brain interprets the arrows as depth cues.
- **The Ponzo illusion** — two identical horizontal lines between converging railroad tracks — the upper line looks longer because your brain interprets converging lines as depth and "enlarges" the farther object.
- **The Ames room** — a specially constructed room that makes two equally-sized people appear dramatically different in height by manipulating depth perception cues.

### Top-Down vs. Bottom-Up Processing

| Type | Direction | Definition | Example |
|------|-----------|-----------|---------|
| **Bottom-up** | Data-driven (sensory input to brain) | Building perception from raw sensory data | Hearing an unfamiliar language — you process individual sounds |
| **Top-down** | Concept-driven (brain to sensory interpretation) | Using expectations and knowledge to interpret input | Reading a text with typos — your brain fills in the correct words |

In reality, perception uses BOTH simultaneously. Your eyes detect light patterns (bottom-up), but your brain interprets them using knowledge and expectations (top-down).

<!-- voice:key_insight insight="Perception is not a passive recording of reality — your brain actively constructs your experience using rules, shortcuts, and prior knowledge. Illusions reveal those shortcuts." -->

### Reflection Questions

1. Why does the Gestalt principle of closure exist? What survival advantage might it provide?
2. When you read a sentence with a missing letter ("Psych_logy is fascinating"), your brain fills it in. Is this bottom-up or top-down processing? Explain.
3. If perception is a construction, does that mean we never see "reality" as it truly is? What are the implications?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 6 — "Perceptual Organization"
- **Richard Gregory**, *Eye and Brain*, 5th ed., Princeton University Press, 1997 — classic text on visual perception
- **Michael Bach**, "Optical Illusions & Visual Phenomena" (michaelbach.de/ot/) — interactive illusion demonstrations
`,
    },
    {
      id: "psych-sensation-perception-checkpoint",
      slug: "sensation-perception-checkpoint",
      title: "Checkpoint: Sensation & Perception",
      content: `## Module Checkpoint: Sensation & Perception

### Review

In this module, you explored how your senses detect physical energy (sensation) and how your brain organizes and interprets that information (perception). You learned the mechanics of vision and hearing, the Gestalt principles of perceptual organization, and how optical illusions reveal the shortcuts your brain uses.

<!-- voice:section_check concept="Module review — sensation and perception" -->

### Quiz

**Question 1:** The process of converting physical energy into neural signals is called:
A) Perception
B) Adaptation
C) Transduction
D) Accommodation

**Question 2:** True or False: Rods are responsible for color vision and work best in bright light.
Explain the correct roles of rods and cones.

**Question 3:** The Gestalt principle stating that objects near each other are perceived as a group is called __________.

**Question 4:** In 2-3 sentences, explain the difference between top-down and bottom-up processing. Give one example of each from everyday life.

**Question 5:** After entering a friend's house, you notice the smell of cooking but stop noticing it after 10 minutes. Name this phenomenon and explain why it happens.

<!-- voice:key_insight insight="Your brain doesn't passively record reality — it actively builds your experience from sensory data, prior knowledge, and perceptual shortcuts." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

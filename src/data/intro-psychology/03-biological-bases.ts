import { Module } from "../types";

export const biologicalBasesModule: Module = {
  id: "psych-biological-bases",
  title: "Biological Bases of Behavior",
  description:
    "Explore how neurons communicate, how brain structures control different functions, and how neurotransmitters influence mood and behavior. Reference: Myers & DeWall, Psychology, 13th ed., Worth Publishers, 2021, Chapters 2-3.",
  lessons: [
    {
      id: "psych-neurons-communication",
      slug: "neurons-communication",
      title: "Neurons: How Brain Cells Communicate",
      content: `## Neurons: How Brain Cells Communicate

<!-- voice:section_check concept="How neurons transmit electrical and chemical signals" -->

### What You'll Learn

- The structure of a neuron
- How electrical signals travel along a neuron
- How chemical signals cross the synapse

### Your Brain's Texting System

Your brain contains approximately **86 billion neurons** — specialized cells that transmit information. Think of each neuron as a tiny cell phone: it receives messages, processes them, and sends them along to the next neuron. But instead of using Wi-Fi, neurons use a combination of **electrical signals** (within the neuron) and **chemical signals** (between neurons).

<!-- voice:section_check concept="Neuron structure" -->

### Neuron Structure

| Part | Function | Analogy |
|------|----------|---------|
| **Dendrites** | Receive messages from other neurons | Antennas picking up signals |
| **Cell body (soma)** | Processes information; contains the nucleus | The phone's processor |
| **Axon** | Carries the electrical signal away from the cell body | A wire transmitting the signal |
| **Myelin sheath** | Insulating layer that speeds up signal transmission | Insulation on an electrical cable |
| **Axon terminals** | Release chemical messengers (neurotransmitters) to the next neuron | The "send" button |
| **Synapse** | The gap between two neurons | The airspace a text message crosses |

\`\`\`mermaid
graph LR
    A[Dendrites] --> B[Cell Body]
    B --> C[Axon]
    C --> D[Synaptic Terminal]
    D --> E[Neurotransmitter Release]
    E --> F[Next Neuron]
\`\`\`

### Electrical Signals: The Action Potential

When a neuron is at rest, the inside is negatively charged relative to the outside (about -70 millivolts). This is called the **resting potential** — the neuron is loaded and ready, like a cocked spring.

When a strong enough signal arrives at the dendrites, the neuron "fires" — channels open, positively charged sodium ions rush in, and the inside briefly becomes positive. This electrical pulse, called the **action potential**, travels down the axon at speeds up to 270 miles per hour.

The action potential follows the **all-or-none principle**: the neuron either fires at full strength or doesn't fire at all. There's no "half-fire" — it's like a gun trigger, not a dimmer switch.

### Chemical Signals: The Synapse

When the action potential reaches the axon terminals, it triggers the release of **neurotransmitters** — chemical messengers stored in tiny sacs called **vesicles**. These molecules float across the **synapse** (the gap between neurons) and bind to **receptor sites** on the next neuron's dendrites, like a key fitting into a lock.

After delivering the message, neurotransmitters are either broken down by enzymes or reabsorbed by the sending neuron through a process called **reuptake** — like vacuuming back the text message after it's been read.

<!-- voice:key_insight insight="Communication within a neuron is electrical (the action potential), but communication between neurons is chemical (neurotransmitters crossing the synapse)." -->

### Reflection Questions

1. Why is the myelin sheath important? What diseases are associated with its breakdown? (Hint: multiple sclerosis)
2. Why does the all-or-none principle matter? If neurons can only fire at full strength, how does the brain represent different intensities (like light touch vs. hard press)?
3. Why would reuptake be a target for medications? (Hint: think about what happens if a neurotransmitter stays in the synapse longer.)

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 2 — "The Biology of Mind"
- **Eric Kandel**, *In Search of Memory*, W.W. Norton, 2007 — Nobel Prize-winning neuroscientist's accessible memoir
- **Khan Academy**, "The Neuron and Nervous System" — free animated video series
`,
    },
    {
      id: "psych-brain-structure",
      slug: "brain-structure",
      title: "Brain Structure: A Tour of the Brain",
      content: `## Brain Structure: A Tour of the Brain

<!-- voice:section_check concept="Major brain structures and their functions" -->

### What You'll Learn

- The major brain regions and what each does
- How the brain is organized from bottom to top
- What happens when specific brain areas are damaged

### Three Pounds of Universe

Your brain weighs about 3 pounds and uses 20% of your body's energy, despite being only 2% of your body weight. It's organized from the bottom up — the most ancient structures are at the base, and the most recently evolved are at the top. Think of it as building floors of a house, oldest at the bottom.

<!-- voice:section_check concept="Brainstem, limbic system, and cerebral cortex" -->

### The Three Levels

**Level 1: The Brainstem (the "basement")**

The **brainstem** connects the brain to the spinal cord and controls automatic survival functions:
- **Medulla** — breathing, heart rate, blood pressure
- **Pons** — sleep, arousal, coordination with cerebellum
- **Reticular formation** — alertness and attention (filters incoming information)

The **cerebellum** ("little brain") sits behind the brainstem and coordinates movement, balance, and motor learning. It's why you can ride a bike without thinking about it.

**Level 2: The Limbic System (the "emotional floor")**

| Structure | Function | Remember It As... |
|-----------|----------|-------------------|
| **Amygdala** | Fear and emotional processing | The "alarm bell" |
| **Hippocampus** | Memory formation (converting short-term to long-term) | The "save button" |
| **Hypothalamus** | Regulates hunger, thirst, body temperature, hormones | The "thermostat" |
| **Thalamus** | Relay station — routes sensory information to the correct cortex area | The "switchboard" |

**Level 3: The Cerebral Cortex (the "penthouse")**

The wrinkled outer layer of the brain — responsible for thinking, language, planning, and personality. It is divided into four **lobes**:

| Lobe | Location | Key Functions |
|------|----------|---------------|
| **Frontal** | Front of brain | Planning, decision-making, personality, motor control, Broca's area (speech production) |
| **Parietal** | Top of brain | Touch, spatial awareness, body position |
| **Temporal** | Sides of brain | Hearing, language comprehension (Wernicke's area), memory |
| **Occipital** | Back of brain | Vision |

### The Famous Case of Phineas Gage

In 1848, railroad worker Phineas Gage survived an iron rod blasting through his left frontal lobe. He lived, but his personality changed dramatically — from responsible and reliable to impulsive and inappropriate. His case was one of the first demonstrations that the frontal lobe is essential for personality and self-control.

<!-- voice:key_insight insight="The brain is organized from bottom to top — survival functions at the base, emotions in the middle, and higher thinking at the top. Damage to specific areas produces specific deficits." -->

### Reflection Questions

1. Why does damage to the hippocampus affect the ability to form new memories but not the ability to recall old ones?
2. The case of Phineas Gage showed that the frontal lobe is involved in personality. What modern evidence supports this?
3. If the thalamus is damaged, what sensory problems would you expect?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 2 — "The Brain"
- **Oliver Sacks**, *The Man Who Mistook His Wife for a Hat*, Touchstone, 1985 — fascinating case studies of neurological conditions
- **HHMI BioInteractive**, "The Brain" — interactive 3D brain explorer
`,
    },
    {
      id: "psych-neurotransmitters",
      slug: "neurotransmitters",
      title: "Neurotransmitters: The Brain's Chemical Messengers",
      content: `## Neurotransmitters: The Brain's Chemical Messengers

<!-- voice:section_check concept="Major neurotransmitters and their effects on behavior" -->

### What You'll Learn

- The major neurotransmitters and what each does
- How drugs and medications affect neurotransmitter systems
- Why neurotransmitter imbalances matter for mental health

### Chemical Conversations

In the previous lesson, you learned that neurons communicate across the synapse using chemicals called **neurotransmitters**. Now let's meet the major players — think of them as the different "languages" your brain uses for different types of messages.

<!-- voice:section_check concept="The major neurotransmitters" -->

### The Major Neurotransmitters

| Neurotransmitter | Role | Too Little | Too Much |
|-----------------|------|-----------|----------|
| **Serotonin** | Mood, sleep, appetite, impulse control | Depression, anxiety, OCD | Serotonin syndrome (agitation, confusion) |
| **Dopamine** | Pleasure, motivation, movement, learning | Parkinson's disease, depression | Schizophrenia (hallucinations, delusions) |
| **Norepinephrine** | Alertness, energy, fight-or-flight response | Depression, fatigue | Anxiety, panic |
| **GABA** | Calming, inhibiting neural activity | Anxiety, seizures, insomnia | Excessive sedation |
| **Glutamate** | Excitatory — drives brain activity, learning, memory | Cognitive impairment | Seizures, excitotoxicity (cell damage) |
| **Acetylcholine** | Muscle movement, memory, attention | Alzheimer's disease, muscle weakness | Muscle cramps, excessive secretions |
| **Endorphins** | Natural pain relief, pleasure | Increased pain sensitivity | Reduced pain awareness |

### How Drugs Affect Neurotransmitters

Every psychoactive drug works by altering neurotransmitter activity at the synapse:

**Agonists** mimic or enhance a neurotransmitter's effect:
- Caffeine blocks adenosine receptors, preventing drowsiness
- Nicotine mimics acetylcholine at certain receptors

**Antagonists** block a neurotransmitter's effect:
- Antipsychotic drugs block dopamine receptors (treating schizophrenia)
- Beta-blockers block norepinephrine receptors (reducing anxiety symptoms)

**Reuptake inhibitors** prevent neurotransmitters from being reabsorbed, keeping them active longer:
- SSRIs (like Prozac) block serotonin reuptake — the most common antidepressant class
- ADHD medications (like Adderall) affect dopamine and norepinephrine reuptake

### The Balance Metaphor

Think of each neurotransmitter system as a seesaw. Health depends on balance. Too much or too little of any neurotransmitter can cause problems. Mental health conditions often involve disrupted balance in one or more systems — and medications aim to restore that balance.

<!-- voice:key_insight insight="Every mental health medication and every psychoactive drug works by changing how neurotransmitters function at the synapse — either mimicking, blocking, or extending their action." -->

### Reflection Questions

1. Why would blocking dopamine receptors help treat schizophrenia but potentially cause Parkinson's-like symptoms as a side effect?
2. SSRIs block serotonin reuptake, keeping serotonin in the synapse longer. Using the seesaw metaphor, explain how this helps with depression.
3. Endorphins are natural painkillers. Why do you think "runner's high" occurs after intense exercise?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 2 — "Neural Communication"
- **Robert Sapolsky**, *Behave*, Penguin, 2017, Chapter 2 — excellent overview of neurochemistry and behavior
- **National Institute of Mental Health** (nimh.nih.gov) — information on neurotransmitter-related disorders
`,
    },
    {
      id: "psych-biological-bases-checkpoint",
      slug: "biological-bases-checkpoint",
      title: "Checkpoint: Biological Bases of Behavior",
      content: `## Module Checkpoint: Biological Bases of Behavior

### Review

In this module, you explored the biological machinery of behavior. You learned how neurons transmit electrical and chemical signals, toured the major brain structures from brainstem to cortex, and examined how neurotransmitters influence everything from mood to movement.

<!-- voice:section_check concept="Module review — biological bases" -->

### Quiz

**Question 1:** The gap between two neurons where neurotransmitters are released is called the:
A) Axon
B) Dendrite
C) Synapse
D) Myelin sheath

**Question 2:** True or False: The action potential follows an all-or-none principle, meaning neurons can fire at different intensities depending on the strength of the stimulus.
Explain the correct principle.

**Question 3:** The brain structure most associated with fear and emotional processing is the __________.

**Question 4:** In 2-3 sentences, explain how SSRIs (like Prozac) work at the synapse to treat depression.

**Question 5:** A patient suffers damage to their occipital lobe in a car accident. Based on what you know about brain structure, predict what specific ability would be most affected and explain why.

<!-- voice:key_insight insight="Biology and behavior are inseparable — understanding neurons, brain structures, and neurotransmitters is essential for understanding why we think, feel, and act the way we do." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

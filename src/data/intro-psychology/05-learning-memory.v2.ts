import { Module } from "../types";

export const learningMemoryModule: Module = {
  id: "psych-learning-memory",
  title: "Learning & Memory",
  description: "Explore how organisms learn through association and consequences, and how memory is encoded, stored, and retrieved. Reference: Myers & DeWall, Psychology, 13th ed., Worth Publishers, 2021, Chapters 8-9.",
  lessons: [
    {
      id: "psych-classical-operant",
      slug: "classical-operant",
      title: "Classical and Operant Conditioning",
      content: `## Classical and Operant Conditioning

<!-- voice:section_check concept="The two main types of associative learning" -->

### What You'll Learn

- How classical conditioning creates learned associations
- How operant conditioning uses consequences to shape behavior
- The difference between reinforcement and punishment

### Learning by Association

Think about the last time you heard a song that instantly brought back a memory — maybe a summer vacation or a school dance. That emotional response wasn't built into the song — you **learned** to associate the song with the experience. This is the foundation of **associative learning**.

<!-- voice:section_check concept="Pavlov's classical conditioning" -->

### Classical Conditioning: Pavlov's Dogs

In the 1890s, Russian physiologist **Ivan Pavlov** was studying digestion in dogs when he noticed something unexpected. The dogs began salivating not just when food was placed in their mouths, but when they *heard the footsteps* of the lab assistant who brought the food. The dogs had learned to associate the footsteps with food.

Pavlov's terms:

| Term | Definition | In the Dog Experiment |
|------|-----------|----------------------|
| **Unconditioned stimulus (US)** | Naturally triggers a response without learning | Food |
| **Unconditioned response (UR)** | Natural, unlearned response to the US | Salivation to food |
| **Conditioned stimulus (CS)** | A previously neutral stimulus that, after pairing with the US, triggers a response | Bell (after being paired with food) |
| **Conditioned response (CR)** | Learned response to the CS | Salivation to the bell |

**Before conditioning:** Bell = no response; Food = salivation
**During conditioning:** Bell + Food = salivation
**After conditioning:** Bell alone = salivation

### Operant Conditioning: Skinner's Box

While classical conditioning involves learning *associations*, **operant conditioning** (developed by **B.F. Skinner**) involves learning from *consequences*. Behavior followed by a pleasant consequence is more likely to be repeated; behavior followed by an unpleasant consequence is less likely.

| Consequence | Adds Something | Removes Something |
|-------------|---------------|-------------------|
| **Increases behavior** | Positive reinforcement (give a reward) | Negative reinforcement (remove something unpleasant) |
| **Decreases behavior** | Positive punishment (add something unpleasant) | Negative punishment (take away something pleasant) |

**Key insight:** "Positive" and "negative" don't mean good and bad — they mean adding (+) or removing (-) something.

Examples:
- **Positive reinforcement:** You study hard and get an A (reward added = study more)
- **Negative reinforcement:** You take aspirin and your headache goes away (pain removed = take aspirin again next time)
- **Positive punishment:** You speed and get a ticket (unpleasant consequence added = speed less)
- **Negative punishment:** A teenager breaks curfew and loses phone privileges (pleasant thing removed = obey curfew)

<!-- voice:key_insight insight="Classical conditioning teaches associations (bell = food); operant conditioning teaches consequences (studying = good grade). Both shape behavior, but through different mechanisms." -->

### Reflection Questions

1. Identify a real example of classical conditioning in your own life (a sound, smell, or place that triggers an automatic emotional response).
2. Is taking off a seatbelt to stop the annoying buzzer positive or negative reinforcement? Explain.
3. Why is negative reinforcement often confused with punishment? How are they different?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 8 — "Learning"
- **B.F. Skinner**, *About Behaviorism*, Vintage, 1976 — Skinner's own accessible introduction
- **Ivan Pavlov**, Nobel Lecture, 1904 — "Physiology of Digestion" (Nobel Prize archives)
`,
    },
    {
      id: "psych-memory-models",
      slug: "memory-models",
      title: "Memory: How We Encode, Store, and Retrieve",
      content: `## Memory: How We Encode, Store, and Retrieve

<!-- voice:section_check concept="The three-stage model of memory" -->

### What You'll Learn

- The three stages of memory: encoding, storage, retrieval
- The Atkinson-Shiffrin model (sensory, short-term, long-term memory)
- Why we forget and how to remember better

### Your Mental Filing System

Imagine your brain as a library. **Encoding** is like writing a book — converting an experience into a format your brain can store. **Storage** is putting the book on a shelf. **Retrieval** is finding the book when you need it later. Problems at any stage can cause "forgetting."

<!-- voice:section_check concept="Three memory stores" -->

### The Atkinson-Shiffrin Model (1968)

Richard Atkinson and Richard Shiffrin proposed that memory flows through three stores:

| Store | Duration | Capacity | Example |
|-------|----------|----------|---------|
| **Sensory memory** | Less than 1 second (visual) to 3-4 seconds (auditory) | Large but fleeting | Briefly seeing a flash of lightning |
| **Short-term / Working memory** | About 20-30 seconds without rehearsal | 7 plus or minus 2 items (George Miller, 1956) | Remembering a phone number long enough to dial it |
| **Long-term memory** | Potentially permanent | Essentially unlimited | Your childhood memories, learned skills, facts |

\`\`\`mermaid
graph LR
    A[Sensory Input] --> B[Sensory Memory]
    B -->|Attention| C[Short-term / Working Memory]
    C -->|Encoding| D[Long-term Memory]
    D -->|Retrieval| C
    B -->|Ignored| E[Forgotten]
\`\`\`

**Sensory memory** is the brief snapshot your senses take. Most of it vanishes immediately.

**Short-term memory (STM)** holds information you're currently thinking about. It's limited — about 7 items (a phone number). **Chunking** extends this: instead of remembering F-B-I-C-I-A-I-R-S as 9 letters, you chunk them into FBI-CIA-IRS (3 chunks).

**Long-term memory (LTM)** is where information goes for permanent storage. It's divided into:
- **Explicit (declarative)** — facts you can consciously recall
  - Semantic memory: general knowledge (Paris is the capital of France)
  - Episodic memory: personal experiences (your 10th birthday party)
- **Implicit (nondeclarative)** — skills and habits you perform without conscious thought
  - Procedural memory: how to ride a bike, type on a keyboard

### Why We Forget

| Theory | Explanation |
|--------|------------|
| **Encoding failure** | Information never made it into LTM (you weren't paying attention) |
| **Storage decay** | Unused memories fade over time |
| **Retrieval failure** | The memory exists but you can't access it (tip-of-the-tongue phenomenon) |
| **Interference** | Other memories compete with the target memory |
| **Motivated forgetting** | Painful memories are suppressed (Freud's repression) |

Hermann **Ebbinghaus** (1885) discovered the **forgetting curve** — we forget most new information within the first hour, then the rate of forgetting slows. This is why **spaced repetition** (reviewing material at increasing intervals) is one of the most effective study techniques.

<!-- voice:key_insight insight="Memory is not a recording — it's a reconstruction. Every time you retrieve a memory, you rebuild it, which means memories can be altered, distorted, or even fabricated." -->

### Reflection Questions

1. Why is chunking an effective memory strategy? Give an example of how you could chunk a 12-digit number.
2. You can't remember where you parked your car this morning, but you easily remember where you parked on vacation last year. Using encoding, explain this difference.
3. If memory is a reconstruction (not a recording), what are the implications for eyewitness testimony in court?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 9 — "Memory"
- **Elizabeth Loftus**, *Eyewitness Testimony*, Harvard University Press, 1996 — landmark work on false memories
- **Daniel Schacter**, *The Seven Sins of Memory*, Houghton Mifflin, 2001 — fascinating exploration of memory's flaws
`,
    },
    {
      id: "psych-learning-memory-applications",
      slug: "learning-memory-applications",
      title: "Applying Learning and Memory to Your Life",
      content: `## Applying Learning and Memory to Your Life

<!-- voice:section_check concept="Evidence-based study strategies and real-world applications" -->

### What You'll Learn

- Which study strategies actually work (according to research)
- How conditioning shapes everyday behavior
- How understanding memory helps you learn better

### What the Research Actually Says About Studying

Students spend hours studying, but much of that time uses ineffective strategies. Cognitive psychologists have identified which techniques work best:

<!-- voice:section_check concept="Effective vs ineffective study strategies" -->

### Evidence-Based Study Strategies

| Strategy | Effectiveness | Why It Works |
|----------|-------------|-------------|
| **Spaced practice** | Very high | Spreading study over time strengthens long-term memory more than cramming |
| **Retrieval practice (testing yourself)** | Very high | Actively recalling information strengthens memory pathways |
| **Interleaving** | High | Mixing different topics forces your brain to discriminate between concepts |
| **Elaboration** | High | Connecting new information to what you already know creates richer encoding |
| **Dual coding** | High | Combining words and visuals creates two memory pathways |
| **Highlighting/rereading** | Low | Passive review doesn't create strong memory traces |
| **Cramming** | Low (short-term gain, rapid forgetting) | Massed practice creates weak, temporary memories |

The research is clear: **testing yourself** (even without feedback) is more effective than re-reading or highlighting (Roediger & Karpicke, 2006). This is called the **testing effect** — the act of retrieving information from memory strengthens that memory.

### Conditioning in Everyday Life

Classical and operant conditioning are everywhere:

- **Advertising** uses classical conditioning: pairing a product with positive emotions (attractive people, catchy music) so you feel positive about the brand
- **Social media** uses operant conditioning: variable-ratio reinforcement (you never know when you'll get a like or notification, so you keep checking — the same schedule that makes slot machines addictive)
- **Parenting** uses operant conditioning: praising a child for good behavior (positive reinforcement) is generally more effective than punishing bad behavior
- **Phobias** often develop through classical conditioning: a child bitten by a dog (US = pain, CS = dogs) develops a fear response to all dogs

### The Testing Effect in Practice

Instead of re-reading your notes before an exam, try this:
1. Close your notes
2. Write down everything you can remember about the topic
3. Open your notes and check what you missed
4. Focus your next study session on what you missed

This forces **retrieval** — and research shows it produces better exam scores than spending the same time re-reading (Karpicke & Blunt, 2011).

<!-- voice:key_insight insight="The most effective way to study is not to re-read — it's to test yourself. Retrieval practice strengthens memory far more than passive review." -->

### Reflection Questions

1. Think about your current study habits. Which of the evidence-based strategies do you already use? Which could you start using?
2. Social media apps are designed to be addictive. Using operant conditioning principles, explain how variable-ratio reinforcement keeps users engaged.
3. Why is cramming effective for tomorrow's quiz but terrible for long-term learning?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapters 8-9
- **Peter Brown et al.**, *Make It Stick: The Science of Successful Learning*, Belknap Press, 2014 — essential reading for students
- **Dunlosky et al.**, "Improving Students' Learning With Effective Learning Techniques," *Psychological Science in the Public Interest*, 2013 — comprehensive research review
`,
    },
    {
      id: "psych-learning-memory-checkpoint",
      slug: "learning-memory-checkpoint",
      title: "Checkpoint: Learning & Memory",
      content: `## Module Checkpoint: Learning & Memory

### Review

In this module, you explored two types of associative learning — classical conditioning (learning through association) and operant conditioning (learning through consequences). You then examined how memory works through encoding, storage, and retrieval, and discovered evidence-based study strategies.

<!-- voice:section_check concept="Module review — learning and memory" -->

### Quiz

**Question 1:** In Pavlov's experiment, the bell BEFORE conditioning was a:
A) Conditioned stimulus
B) Unconditioned stimulus
C) Neutral stimulus
D) Conditioned response

**Question 2:** True or False: Negative reinforcement is the same as punishment.
Explain the difference with an example.

**Question 3:** According to George Miller (1956), the capacity of short-term memory is approximately __________ items.

**Question 4:** A student highlights all her notes and re-reads them three times before the exam but performs poorly. Using what you learned about effective study strategies, explain why and suggest a better approach.

**Question 5:** Every time you hear a particular song, you feel anxious because it was playing during a car accident you experienced. Identify the US, UR, CS, and CR in this example.

<!-- voice:key_insight insight="Learning and memory are the foundation of everything you know and can do — understanding how they work gives you the power to learn more effectively." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

import { Module } from "../types";

export const anxietyManagementModule: Module = {
  id: "mhr-anxiety-management",
  title: "Anxiety Management",
  description:
    "Learn the fundamentals of Cognitive Behavioral Therapy (CBT), identify common cognitive distortions, and master grounding techniques that reduce anxiety in real time. Evidence-based approaches you can start using today.",
  lessons: [
    {
      id: "mhr-cbt-basics",
      slug: "cbt-basics",
      title: "CBT Basics: How Thoughts Shape Feelings",
      content: `## CBT Basics: How Thoughts Shape Feelings

> **Important:** This course is educational and is not a substitute for professional medical advice. If you are experiencing a mental health crisis, please contact a qualified mental health professional or call a crisis helpline.

<!-- voice:section_check -->

Cognitive Behavioral Therapy (CBT) is the most extensively researched psychotherapy approach in history. A landmark meta-analysis by Hofmann et al. (2012) published in Cognitive Therapy and Research, reviewing 269 studies, confirmed CBT's effectiveness for anxiety disorders, depression, insomnia, chronic pain, and numerous other conditions.

### The CBT Triangle

At the core of CBT is a simple but powerful insight: **thoughts, feelings, and behaviors are interconnected**, and changing one changes the others.

\`\`\`
        Thoughts
       /        \\
      /          \\
   Feelings ----> Behaviors
\`\`\`

<!-- voice:key_insight -->

\`\`\`mermaid
graph TD
    A[Thoughts] <--> B[Feelings]
    B <--> C[Behaviors]
    C <--> A
\`\`\`

**Example:**
- **Situation:** Your friend does not reply to your text for 24 hours
- **Thought:** "They must be angry at me. I said something wrong."
- **Feeling:** Anxiety, dread, sadness
- **Behavior:** Sending multiple follow-up texts, ruminating, avoiding the friend

**Alternative thought:** "They are probably busy. People respond when they can."
- **Feeling:** Mild curiosity, neutral
- **Behavior:** Continuing your day normally

Same situation, completely different experience — because the **thought** changed.

### Aaron Beck's Cognitive Model

Aaron Beck, the founder of CBT, proposed in the 1960s that emotional distress is not caused by events themselves but by our **interpretation** of those events. Beck identified that depressed and anxious people systematically interpret situations in negatively biased ways — not because they are irrational, but because these patterns are **learned and automatic**.

Strong evidence supports this model. A meta-analysis by Cristea et al. (2015) in Clinical Psychology Review found that cognitive restructuring (changing thought patterns) produced effect sizes comparable to antidepressant medication for moderate depression, with lower relapse rates at 1-year follow-up.

### The ABC Model

Albert Ellis developed the **ABC model** that forms the practical basis of cognitive restructuring:

| Component | Description | Example |
|-----------|-------------|---------|
| **A** — Activating Event | What happened | Boss gives critical feedback |
| **B** — Belief | Your interpretation | "I am incompetent. I will be fired." |
| **C** — Consequence | Emotional and behavioral result | Anxiety, insomnia, avoidance of boss |

The key insight: **A does not cause C. B causes C.** The same event (A) can produce completely different consequences depending on the belief (B).

### When to Use CBT Principles vs. When to Seek a Therapist

These self-help CBT principles are appropriate for:
- Everyday stress and worry
- Mild to moderate anxiety
- Negative thought patterns that are not disabling
- Building general emotional resilience

**Seek a licensed CBT therapist if:**
- Anxiety or depression significantly impairs your daily functioning
- You are experiencing panic attacks
- Negative thoughts feel overwhelming and uncontrollable
- You have experienced trauma that feels unprocessed
- Self-help approaches have not helped after consistent practice

<!-- voice:section_check -->

### Practical Exercise: The Thought Record

For the next three days, when you notice a strong negative emotion, write down:

1. **Situation:** What happened? (Facts only, no interpretation)
2. **Automatic thought:** What went through your mind?
3. **Emotion:** What did you feel? Rate intensity 0-10.
4. **Evidence for the thought:** What facts support this thought?
5. **Evidence against:** What facts contradict it?
6. **Balanced thought:** A more realistic interpretation.
7. **New emotion:** How do you feel now? Rate 0-10.

This is the foundational CBT exercise. Research consistently shows that written thought records are more effective than mental restructuring alone (Beck, 2011, *Cognitive Behavior Therapy*, Guilford Press).

### Reflection Questions

- Can you identify a recent situation where your interpretation of an event was more distressing than the event itself?
- What is one recurring negative thought you have? How might you reframe it?

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- Beck Institute for Cognitive Behavioral Therapy: https://beckinstitute.org
- MoodGYM (free CBT online program): https://moodgym.com.au

*References: Hofmann, S. et al. (2012). "The Efficacy of CBT: A Review of Meta-analyses." Cognitive Therapy and Research, 36(5). Cristea, I. et al. (2015). "Efficacy of cognitive bias modification interventions." Clinical Psychology Review, 40. Beck, J. (2011). Cognitive Behavior Therapy: Basics and Beyond. Guilford Press.*`,
    },
    {
      id: "mhr-cognitive-distortions",
      slug: "cognitive-distortions",
      title: "Cognitive Distortions: The Thinking Traps",
      content: `## Cognitive Distortions: The Thinking Traps

### What Are Cognitive Distortions?

Cognitive distortions are systematic patterns of biased thinking that reinforce negative emotions. First catalogued by Aaron Beck (1963) and expanded by David Burns in *Feeling Good: The New Mood Therapy* (1980), these are not signs of stupidity or weakness — they are **mental shortcuts that evolved for survival** but misfire in modern contexts.

<!-- voice:key_insight -->

Research by Rnic et al. (2016), published in Clinical Psychology Review, conducted a meta-analysis of 98 studies confirming that cognitive distortions are significantly elevated in depression and anxiety. Reducing distortions through CBT correlates directly with symptom improvement.

### The 10 Most Common Cognitive Distortions

**1. All-or-Nothing Thinking (Black-and-White Thinking)**
Seeing things in absolute categories with no middle ground.
- "If I do not get an A, I am a complete failure."
- Reality check: Most of life exists in the gray zone. A B+ is not failure.

**2. Catastrophizing**
Jumping to the worst possible outcome.
- "I made a mistake at work. I will definitely get fired, lose my house, and end up homeless."
- Reality check: What is the most *likely* outcome, not the worst?

**3. Mind Reading**
Assuming you know what others are thinking.
- "Everyone at the party thought I was awkward."
- Reality check: You cannot read minds. Most people are focused on themselves.

**4. Fortune Telling**
Predicting negative future outcomes as though they are certain.
- "This relationship will definitely fail, so why bother trying?"
- Reality check: You are not a prophet. Predictions are not facts.

**5. Overgeneralization**
Taking one instance and applying it to everything.
- "I failed this test. I always fail. I will never succeed."
- Trigger words: "always," "never," "every," "no one"

**6. Mental Filtering (Selective Abstraction)**
Focusing exclusively on the negative while ignoring the positive.
- Getting 9 positive reviews and 1 critical one, then dwelling only on the criticism.

**7. Disqualifying the Positive**
Actively dismissing positive experiences.
- "They only said that to be nice. They did not really mean it."

**8. Should Statements**
Rigid rules about how you or others must behave.
- "I should be further along in my career by now."
- Albert Ellis called this "musturbation" — the tyranny of should.

**9. Emotional Reasoning**
Treating feelings as facts.
- "I feel stupid, therefore I must be stupid."
- Reality check: Feelings are signals, not evidence.

**10. Personalization**
Taking excessive responsibility for things outside your control.
- "My team failed because of me" when multiple factors were involved.

<!-- voice:section_check -->

### Challenging Distortions: The ABCDE Method

Building on Ellis's ABC model, the ABCDE method adds:

- **D — Dispute:** Challenge the distorted belief with evidence
- **E — Effect:** Notice the new emotional state after disputing

**Example in practice:**
- A: You are not invited to a colleague's birthday dinner
- B: "Nobody likes me. I am always excluded."
- C: Sadness, loneliness, withdrawal
- D: "Wait — I went to lunch with three friends this week. I was invited to a party last month. This is overgeneralization and mind reading. Maybe the dinner was small, or they assumed I was busy."
- E: Mild disappointment (appropriate) instead of despair (disproportionate)

### How Common Are These Distortions?

Everyone uses cognitive distortions. A study by Lefebvre (1981) found that even psychologically healthy individuals engage in distorted thinking — the difference is frequency and rigidity. People with depression and anxiety use them more often and have more difficulty seeing alternatives.

### Practical Exercise: Distortion Spotting

For the next 48 hours, carry a small notepad or use your phone notes. Every time you notice a negative emotional reaction, pause and ask:

1. What thought just went through my mind?
2. Which distortion(s) does it match?
3. What would a trusted friend say to me about this thought?
4. What is a more balanced interpretation?

Aim to catch at least 5 distortions over 48 hours. Most people are surprised by how many they find.

### Reflection Questions

- Which 2-3 cognitive distortions do you use most frequently?
- Can you think of a time when you catastrophized and the feared outcome did not happen?
- How might recognizing these patterns change your daily experience?

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- Burns, D. (1980). *Feeling Good: The New Mood Therapy.* Harper.
- Free cognitive distortion worksheet: https://www.therapistaid.com

*References: Burns, D. (1980). Feeling Good: The New Mood Therapy. Harper. Rnic, K. et al. (2016). "Cognitive Distortions, Humor, and Depression." Clinical Psychology Review, 46. Beck, A. (1963). "Thinking and depression." Archives of General Psychiatry, 9(4). Lefebvre, M. (1981). "Cognitive distortion and cognitive errors." Journal of Consulting and Clinical Psychology, 49(4).*`,
    },
    {
      id: "mhr-grounding-techniques",
      slug: "grounding-techniques",
      title: "Grounding Techniques for Acute Anxiety",
      content: `## Grounding Techniques for Acute Anxiety

### When Anxiety Spikes

Cognitive restructuring is powerful for ongoing thought patterns, but when anxiety spikes acutely — a panic attack, sudden overwhelm, dissociation — you need **grounding techniques** that work in the moment. These techniques pull your attention out of anxious thoughts and back into the present through sensory engagement.

<!-- voice:key_insight -->

Grounding works because anxiety is fundamentally future-oriented. You are anxious about what **might** happen. Grounding forces your brain into the present moment, where the actual threat often does not exist. Neuroimaging studies by Farb et al. (2007), published in Social Cognitive and Affective Neuroscience, showed that present-moment awareness activates different brain networks than rumination, effectively "switching channels" in the brain.

### The 5-4-3-2-1 Technique

The most widely recommended grounding exercise in clinical practice:

Name:
- **5** things you can **see** (describe them in detail)
- **4** things you can **touch** (feel the textures)
- **3** things you can **hear** (even subtle background sounds)
- **2** things you can **smell** (or recall two favorite smells)
- **1** thing you can **taste** (or take a sip of water mindfully)

This engages all five senses, pulling attention away from the anxious narrative and into concrete sensory reality.

### TIPP Skills (from Dialectical Behavior Therapy)

Marsha Linehan developed the **TIPP** skills as part of DBT for managing intense emotional distress. A randomized controlled trial by Neacsiu et al. (2014), published in Behaviour Research and Therapy, found that DBT skills training reduced emotional distress by 40% compared to an activities-based control group.

<!-- voice:section_check -->

**T — Temperature:** Change your body temperature quickly. Hold ice cubes, splash cold water on your face, or take a cold shower. The dive reflex activates the vagus nerve and rapidly slows heart rate.

**I — Intense Exercise:** Even 5-10 minutes of vigorous exercise (jumping jacks, running in place, push-ups) metabolizes stress hormones and releases endorphins.

**P — Paced Breathing:** Slow your breathing to 5-6 breaths per minute. Inhale 4 seconds, exhale 6 seconds. This directly activates the parasympathetic nervous system.

**P — Paired Muscle Relaxation:** Tense a muscle group while inhaling, then relax it while exhaling and saying "relax" silently. Work through major muscle groups.

### The Grounding Chair Technique

When you feel dissociated or "not in your body":

1. Press your feet firmly into the floor
2. Push your back into the chair
3. Grip the armrests or press your palms flat on the desk
4. Say to yourself: "I am [your name]. I am in [location]. It is [day/time]. I am safe right now."
5. Describe out loud 3 things you see in the room

### Butterfly Hug (EMDR-Derived)

Used in trauma therapy and validated by Artigas et al. (2000) in a study of 1,500+ children after natural disasters:

1. Cross your arms over your chest so each hand rests on the opposite shoulder
2. Alternately tap each shoulder gently, like a butterfly's wings
3. Continue for 1-2 minutes while breathing slowly
4. This bilateral stimulation activates both brain hemispheres and can reduce emotional intensity

### When Grounding is Not Enough

Grounding techniques are first-aid for acute distress. They are not a replacement for treatment of:
- Recurring panic attacks (see a psychiatrist or psychologist)
- PTSD flashbacks (EMDR or prolonged exposure therapy with a trained therapist)
- Persistent dissociation (professional evaluation needed)
- Severe anxiety that limits daily functioning

If you use grounding techniques multiple times daily just to get through normal activities, that is a signal to seek professional support.

### Practical Exercise: Build Your Grounding Kit

Create a physical or digital "grounding kit" you can access during anxious moments:

**Physical kit (keep in your bag):**
- A smooth stone or textured object to hold
- A strong mint or piece of ginger (taste/smell grounding)
- A photo that makes you feel safe
- A small note card with the 5-4-3-2-1 steps written out

**Digital kit (on your phone):**
- A calming playlist (3-5 songs)
- A saved photo of a place where you feel safe
- A voice memo from someone who cares about you
- A notes file with your favorite grounding script

Practice using one grounding technique right now, even if you are not anxious. Building muscle memory when calm makes the technique more accessible during distress.

### Reflection Questions

- Which grounding technique feels most accessible to you?
- Have you experienced a moment of acute anxiety where you wish you had these tools? How might the outcome have been different?

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- **Samaritans:** Call 116 123 (UK)
- DBT Skills Training Handouts and Worksheets by Marsha Linehan
- Anxiety and Depression Association of America: https://adaa.org

*References: Farb, N. et al. (2007). "Attending to the present." Social Cognitive and Affective Neuroscience, 2(4). Neacsiu, A. et al. (2014). "DBT skills use as a mediator." Behaviour Research and Therapy, 53. Linehan, M. (2015). DBT Skills Training Manual. Guilford Press. Artigas, L. et al. (2000). "EMDR and traumatic stress after natural disasters." Traumatology, 6(1).*`,
    },
    {
      id: "mhr-anxiety-checkpoint",
      slug: "anxiety-checkpoint",
      title: "Checkpoint: Anxiety Management",
      content: `## Checkpoint: Anxiety Management

<!-- voice:section_check -->

**Dr. Amara:** "How are you feeling about what you have learned in this module? Anxiety management is one of the most immediately practical skills you can develop. Let me check your understanding with some scenario-based questions."

---

### Question 1
You are lying in bed at night thinking: "What if I fail my exam tomorrow? If I fail, I will never get into graduate school, and my whole career will be ruined." Which TWO cognitive distortions are most active here?

A) Personalization and mental filtering
B) Catastrophizing and fortune telling
C) All-or-nothing thinking and overgeneralization
D) Emotional reasoning and disqualifying the positive

**Answer: B** — Catastrophizing (jumping from failing one exam to "my whole career is ruined") combined with fortune telling (predicting failure as certain before the event happens). Both involve projecting worst-case scenarios into the future without evidence.

---

### Question 2
According to the CBT model, which of the following would be the most effective way to reduce the anxiety described in Question 1?

A) Trying harder not to think about the exam
B) Identifying and challenging the automatic thought with evidence
C) Distracting yourself with social media
D) Taking a sleeping pill

**Answer: B** — CBT works by disrupting the link between the activating event and the emotional consequence by challenging the belief. Thought suppression (A) often backfires and increases intrusive thoughts (Wegner, 1994). The thought record exercise helps identify evidence for and against the catastrophic prediction.

---

### Question 3
A student is having a panic attack in class — heart racing, difficulty breathing, feeling like they might faint. Which intervention would be most appropriate as an immediate first response?

A) Ask them to do a written thought record
B) Suggest they use the 5-4-3-2-1 sensory grounding technique or TIPP skills
C) Tell them it is all in their head and they should calm down
D) Leave them alone until it passes

**Answer: B** — During acute anxiety or panic, cognitive techniques like thought records require too much executive function. Grounding techniques and TIPP skills work with the body to reduce physiological arousal first. Once the acute distress subsides, cognitive techniques become accessible.

---

### Question 4
Your colleague says: "I feel like a failure, so I must be one." Which cognitive distortion is this?

A) Catastrophizing
B) Mind reading
C) Emotional reasoning
D) Personalization

**Answer: C** — Emotional reasoning is treating feelings as evidence of reality. "I feel X, therefore X is true." Feelings are valid signals but not reliable indicators of objective truth. Challenging this distortion involves separating "I feel like a failure" from "I am a failure."

---

### Question 5
You have been using grounding techniques 5-6 times every day just to manage getting through basic daily activities like going to the grocery store or attending work meetings. Based on the lesson, what does this suggest?

A) The grounding techniques are working perfectly and you should continue
B) You should try more advanced grounding techniques
C) This pattern suggests the anxiety may require professional support beyond self-help techniques
D) You need to practice harder

**Answer: C** — The lesson clearly states that if you need grounding techniques multiple times daily just to function in normal activities, this is a signal to seek professional support. Grounding is first-aid, not treatment for clinical anxiety that impairs daily functioning.

---

### Voice Summary

**Dr. Amara:** "You have gained three powerful tools in this module: the CBT thought record for ongoing worry patterns, cognitive distortion awareness for catching biased thinking, and grounding techniques for acute anxiety moments. Which resonated most? Perhaps the distortion spotting exercise revealed patterns you had not noticed before. Remember, these skills improve with practice. Try catching just one distortion per day this week. And if you find yourself needing intensive support, reaching out to a therapist is a sign of strength, not weakness."

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- **Samaritans:** Call 116 123 (UK)`,
    },
  ],
};

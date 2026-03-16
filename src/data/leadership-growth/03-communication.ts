import { Module } from "../types";

export const communicationModule: Module = {
  id: "lg-communication",
  title: "Communication Skills",
  description:
    "Master the art and science of effective communication. Learn assertive communication, giving and receiving feedback, storytelling for influence, and navigating difficult conversations.",
  lessons: [
    {
      id: "lg-assertive-communication",
      slug: "assertive-communication",
      title: "Assertive Communication",
      content: `## Assertive Communication

<!-- voice:section_check -->

Communication style is one of the strongest predictors of relationship quality, career advancement, and leadership effectiveness. Most people default to passive or aggressive patterns without realizing it.

### The Four Communication Styles

| Style | Behavior | Underlying Belief | Impact |
|-------|----------|-------------------|--------|
| **Passive** | Avoids conflict, does not express needs | "My needs do not matter" | Builds resentment, others take advantage |
| **Aggressive** | Dominates, blames, intimidates | "My needs are more important" | Damages relationships, creates fear |
| **Passive-Aggressive** | Indirect hostility, sarcasm, silent treatment | "I cannot express anger directly" | Erodes trust, confuses others |
| **Assertive** | Direct, respectful, honest | "My needs matter AND so do yours" | Builds trust, resolves conflicts |

### The Assertive Formula

Assertive communication follows a clear structure:

**"I" Statements**: Focus on your experience, not the other person's character.

\`\`\`
Instead of: "You never listen to me!" (aggressive)
Try:         "I feel unheard when I'm interrupted during meetings.
              I need time to finish my thoughts." (assertive)
\`\`\`

**The DESC Model** (Bower & Bower, 1976):
- **D**escribe: State the specific behavior factually
- **E**xpress: Share how it affects you
- **S**pecify: Request a specific change
- **C**onsequences: Explain the positive outcome

Example: "When the project scope changes without team discussion (D), I feel frustrated and our timeline becomes unreliable (E). I would like us to have a 15-minute alignment before any scope changes (S). This would help us deliver on time and reduce team stress (C)."

<!-- voice:key_insight -->

### The Feedback Framework

Kim Scott's **Radical Candor** (2017) provides a framework for giving feedback:

\`\`\`
                    Care Personally
                         |
            Ruinous      |     Radical
            Empathy      |     Candor
                         |
   -------Challenge Directly--------
                         |
           Manipulative  |    Obnoxious
           Insincerity   |    Aggression
                         |
\`\`\`

- **Radical Candor**: Care personally AND challenge directly. "I care about your growth, and I need to share something that might be hard to hear."
- **Ruinous Empathy**: Care but avoid challenge. "I did not want to hurt their feelings." (Most common mistake)
- **Obnoxious Aggression**: Challenge without caring. Brutal honesty without empathy.
- **Manipulative Insincerity**: Neither caring nor challenging. Backstabbing, political behavior.

### Receiving Feedback

Receiving feedback well is as important as giving it:

1. **Listen fully** before responding (resist the urge to defend)
2. **Thank** the person for the courage to give feedback
3. **Ask clarifying questions**: "Can you give me a specific example?"
4. **Reflect** before deciding what to act on
5. **Follow up**: Tell them what you did with their feedback

### Practical Exercise: Assertive Reframe

Take 3 recent situations where you were passive or aggressive, and rewrite your response using the DESC model:

1. Situation: ___
   - What you said/did: ___
   - Assertive alternative (DESC): ___

### Reflection Questions

- Which communication style do you default to under stress?
- Think of feedback you received that was hard to hear but ultimately helpful. What made the delivery effective (or ineffective)?

### Further Reading

- Scott, K. (2017). *Radical Candor: Be a Kick-Ass Boss Without Losing Your Humanity*. St. Martin's Press.
- Patterson, K. et al. (2012). *Crucial Conversations*. McGraw-Hill.`,
    },
    {
      id: "lg-difficult-conversations",
      slug: "difficult-conversations",
      title: "Navigating Difficult Conversations",
      content: `## Navigating Difficult Conversations

<!-- voice:section_check -->

The conversations we avoid are usually the ones we need most. Research from the Harvard Negotiation Project (Stone, Patton, & Heen, 1999, *Difficult Conversations*) shows that every difficult conversation actually contains three separate conversations happening simultaneously.

### The Three Conversations

**1. The "What Happened" Conversation**
- Each person has a different story about what happened
- Both stories are usually partly right
- The mistake: assuming your story is "the truth"
- The fix: move from certainty to curiosity. "Help me understand how you see this."

**2. The Feelings Conversation**
- Difficult conversations are difficult because of emotions, not facts
- Unexpressed feelings leak out as sarcasm, withdrawal, or aggression
- The fix: acknowledge emotions directly. "This feels frustrating for both of us."

**3. The Identity Conversation**
- What does this situation say about me? Am I competent? Am I a good person?
- Identity threats trigger defensiveness
- The fix: adopt a "both/and" identity. "I can be a good person AND have made a mistake."

<!-- voice:key_insight -->

### The Framework for Difficult Conversations

**Before the conversation:**
1. Clarify your purpose: What do you want to accomplish?
2. Examine your story: What assumptions are you making?
3. Consider their perspective: What might their story be?

**During the conversation:**
1. Start from the **third story** — a neutral description both parties would agree with
2. Listen to understand their perspective (not to build your counter-argument)
3. Share your perspective using "I" statements
4. Problem-solve together

**Example:**

Bad opener: "You missed the deadline again." (accusatory)
Good opener: "We seem to have different expectations about the project timeline. I would like to understand your perspective and share mine, so we can align going forward." (third story)

### When Conversations Derail

**If they get defensive**: "I am not trying to blame you. I genuinely want to understand your perspective."
**If emotions escalate**: "I can see this is important to both of us. Let us take a 10-minute break and come back to this."
**If you feel attacked**: "I want to hear your concerns. Can you help me understand specifically what is bothering you?"

### Practical Exercise: Conversation Prep

Think of a difficult conversation you have been avoiding. Use this preparation template:

1. **What is my purpose?** (What outcome do I want?)
2. **What is my story?** (What do I believe happened?)
3. **What might their story be?** (How might they see this differently?)
4. **What feelings are involved?** (Mine and theirs)
5. **What is at stake for my identity?** (What am I afraid this says about me?)
6. **How can I start from the third story?** (A neutral opening both would agree with)

### Reflection Questions

- What is a difficult conversation you have been putting off? What is the cost of continued avoidance?
- Can you think of a time when you assumed your story was "the truth" and later realized the other person had a valid, different perspective?`,
    },
    {
      id: "lg-communication-checkpoint",
      slug: "communication-checkpoint",
      title: "Checkpoint: Communication Skills",
      content: `## Checkpoint: Communication Skills

<!-- voice:section_check -->

Review your understanding of effective communication.

---

### Question 1
In the DESC model for assertive communication, the "S" stands for:

A) Sympathize with the other person's perspective
B) Specify the change you are requesting
C) Stop the conversation if it gets heated
D) Summarize what was discussed

**Answer: B** — The DESC model is Describe (the behavior), Express (how it affects you), Specify (the change you want), Consequences (positive outcomes of the change). "Specify" makes the request concrete and actionable.

---

### Question 2
According to Kim Scott's Radical Candor framework, the most common leadership mistake is:

A) Obnoxious Aggression (being too harsh)
B) Manipulative Insincerity (being political)
C) Ruinous Empathy (caring but not challenging)
D) Radical Candor (being too direct)

**Answer: C** — Most leaders care about their people but avoid giving hard feedback to spare feelings. Scott calls this "Ruinous Empathy" because withholding feedback prevents growth. It feels kind in the moment but is harmful long-term.

---

### Question 3
The "third story" technique for opening difficult conversations involves:

A) Telling a story about someone else in a similar situation
B) Starting with a neutral description of the situation that both parties would agree with
C) Bringing a third person into the conversation as a mediator
D) Waiting three days before having the conversation

**Answer: B** — The third story is how a neutral observer would describe the situation. Instead of "You missed the deadline" (your story) or "You gave me unrealistic timelines" (their story), try "We seem to have different expectations about the timeline" (third story).

---

### Question 4
Which step is most important when receiving difficult feedback?

A) Immediately explaining your side of the story
B) Listening fully before responding and asking clarifying questions
C) Pointing out flaws in the feedback
D) Agreeing with everything to end the conversation

**Answer: B** — Listening fully and asking clarifying questions shows respect, helps you understand the feedback accurately, and prevents defensive reactions. You can always decide later what to act on, but first you need to truly understand.

---

### Question 5
In every difficult conversation, three conversations are happening simultaneously. They are:

A) Past, present, and future
B) What happened, feelings, and identity
C) Facts, opinions, and emotions
D) Speaking, listening, and observing

**Answer: B** — Stone, Patton, and Heen (1999) identified that difficult conversations involve: the "what happened" conversation (different stories about events), the feelings conversation (unexpressed emotions), and the identity conversation (what this means about who I am).`,
    },
  ],
};

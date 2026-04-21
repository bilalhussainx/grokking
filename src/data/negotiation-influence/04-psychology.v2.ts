import { Module } from "../types";

export const psychologyModule: Module = {
  id: "neg-psychology",
  title: "Psychology of Negotiation",
  description: "Understand cognitive biases, emotional intelligence, rapport building, body language, and managing anger in negotiation.",
  lessons: [
    {
      id: "neg-biases",
      slug: "cognitive-biases-negotiation",
      title: "Cognitive Biases in Negotiation",
      content: `## Cognitive Biases in Negotiation

Max Bazerman, HBS professor and author of *Judgment in Managerial Decision Making*, has identified the specific cognitive biases that most frequently undermine negotiation outcomes. Understanding these biases helps you avoid them in your own thinking and exploit them (ethically) in others.

### The Critical Biases

**1. Anchoring Bias**: The first number mentioned disproportionately influences the final outcome. Both parties anchor to initial offers, even when those offers are arbitrary.

**2. Fixed-Pie Bias**: Assuming the negotiation is zero-sum when it is not. This prevents negotiators from exploring integrative solutions that could make both parties better off.

**3. Loss Aversion**: People feel losses roughly 2x as intensely as equivalent gains. Framing a proposal as avoiding a loss ("you'll save \\$50,000") is more persuasive than framing it as a gain ("you'll make \\$50,000").

**4. Endowment Effect**: People overvalue what they already have. A seller values their house more than the market does simply because it is "theirs." This creates gaps between buyer and seller expectations.

**5. Reactive Devaluation**: Proposals from the other side are automatically valued less simply because the other side proposed them. If they offer it, it must not be good for us.

**6. Escalation of Commitment**: Continuing to invest in a failing negotiation because of sunk costs. "We've been negotiating for three months -- we can't walk away now."

**7. Overconfidence**: Overestimating your ability to achieve a favorable outcome. This leads to insufficient preparation and unrealistic expectations.

### Debiasing Strategies for Negotiation

| Bias | Strategy |
|------|----------|
| Anchoring | Prepare your own anchor before seeing theirs |
| Fixed-pie | Always look for integrative opportunities |
| Loss aversion | Frame proposals in terms of loss avoidance |
| Reactive devaluation | Have a neutral third party present proposals |
| Escalation | Set walk-away criteria before the negotiation |
| Overconfidence | Use reference class forecasting; seek outside opinions |

### Key Takeaway

Negotiation is as much a psychological exercise as a strategic one. The negotiator who understands cognitive biases -- in themselves and others -- has a significant advantage. Preparation, awareness, and structured decision-making are the best defenses.

**Sources**: Bazerman, M. H. & Moore, D. A. (2013). *Judgment in Managerial Decision Making*. Kahneman, D. (2011). *Thinking, Fast and Slow*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-eq-table",
      slug: "emotional-intelligence-at-table",
      title: "Emotional Intelligence at the Table",
      content: `## Emotional Intelligence at the Table

Daniel Goleman's research on emotional intelligence, extensively applied to negotiation at HBS, shows that **negotiators with high EQ achieve significantly better outcomes** than those who rely on logic alone. Emotions are not obstacles to negotiation -- they are information and tools.

### Emotions as Information

Emotions reveal interests. When someone becomes animated about a particular issue, it signals deep importance. When they become defensive, it signals a threat to their identity or interests. The emotionally intelligent negotiator reads these signals and adjusts their approach.

### Managing Your Own Emotions

**Before the negotiation**: Identify your emotional triggers. What might the other party say or do that would make you angry, frustrated, or anxious? Prepare responses in advance.

**During the negotiation**: When you feel an emotional spike:
1. Pause (take a breath, take a break if needed)
2. Name the emotion ("I notice I'm feeling frustrated")
3. Separate the emotion from the response (feeling angry does not require acting angry)
4. Choose your response deliberately

**The Amygdala Hijack in Negotiation**: When emotions are triggered, the brain's amygdala can override rational thinking. This leads to impulsive responses, personal attacks, or premature walkouts. Training yourself to pause before responding is the most valuable negotiation skill.

### Managing Others' Emotions

**Acknowledge emotions**: "I can see this is important to you." Acknowledgment does not mean agreement -- it means you hear them.

**Validate without conceding**: "I understand why you feel that way, given your experience." Validation reduces defensiveness and opens space for problem-solving.

**Reframe negative emotions**: If they are angry, help them articulate the underlying concern. "It sounds like the core issue is fairness in how resources are allocated. Is that right?"

### The Power of Positive Emotions

Research shows that negotiators in a positive emotional state:
- Are more creative in generating options
- Are more willing to share information
- Are more likely to reach integrative agreements
- Build stronger post-negotiation relationships

Tactics for creating positive emotions: humor (used judiciously), genuine compliments, acknowledgment of the other party's expertise, and starting with areas of agreement.

### Key Takeaway

Emotional intelligence in negotiation is not about suppressing emotions -- it is about understanding them (in yourself and others) and using that understanding to navigate the negotiation more effectively. The most skilled negotiators manage the emotional dynamic as deliberately as they manage the substantive issues.

**Sources**: Goleman, D. (1998). *Working with Emotional Intelligence*. Fisher, R. & Shapiro, D. (2005). *Beyond Reason: Using Emotions as You Negotiate*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-rapport",
      slug: "building-rapport-trust",
      title: "Building Rapport & Trust",
      content: `## Building Rapport & Trust

Research at HBS and the Harvard Negotiation Project consistently shows that **negotiations conducted with high rapport produce better outcomes for both parties**. Rapport -- a sense of connection, mutual understanding, and trust -- facilitates information sharing, creative problem-solving, and agreement implementation.

### Why Rapport Matters

A study by Northwestern University researchers (cited in HBS courses) found that negotiators who spent just 5 minutes chatting before the negotiation achieved significantly better outcomes than those who jumped straight into business. The brief social interaction built enough rapport to enable more collaborative problem-solving.

### Building Rapport Techniques

**1. Find Common Ground**: Before negotiating, discover shared interests, experiences, or connections. Shared identity creates trust.

**2. Small Talk with Purpose**: The first 5-10 minutes of social conversation are not wasted time -- they are rapport-building time. Ask about their background, their role, their interests.

**3. Mirroring**: Subtly matching the other person's body language, speech pace, and energy level creates a subconscious sense of connection. Research shows mirroring increases trust and liking.

**4. Active Listening**: Demonstrate genuine interest through eye contact, nodding, paraphrasing, and asking follow-up questions. People trust those who listen to them.

**5. Reciprocal Disclosure**: Share appropriate personal information. Vulnerability builds trust when reciprocated.

### Trust in Negotiation

Trust exists on a spectrum:
- **Deterrence-based trust**: "I trust you because there are consequences for betrayal" (contracts, legal enforcement)
- **Knowledge-based trust**: "I trust you because I know you" (track record, reputation)
- **Identification-based trust**: "I trust you because we share values and goals" (deepest form of trust)

Negotiations with higher trust levels produce:
- More information sharing (enabling integrative solutions)
- Fewer costly conflicts
- Faster agreements
- Better implementation and follow-through

### Key Takeaway

Rapport and trust are not soft niceties -- they are strategic assets that directly improve negotiation outcomes. Invest in the relationship before and during the negotiation. The time spent building rapport pays dividends in the quality of the agreement.

**Sources**: Fisher, R. & Shapiro, D. (2005). *Beyond Reason*. Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-body-language",
      slug: "reading-body-language",
      title: "Reading Body Language",
      content: `## Reading Body Language

Albert Mehrabian's oft-cited research suggests that **55% of communication is body language, 38% is tone of voice, and only 7% is words**. While these specific percentages are debated, the broader point holds: in negotiation, what people do with their bodies often reveals more than what they say with their words.

### Key Body Language Signals in Negotiation

**Openness and Interest**:
- Leaning forward: engagement and interest
- Open palms: honesty and openness
- Uncrossed arms and legs: receptivity
- Consistent eye contact: confidence and interest
- Nodding: agreement and encouragement

**Defensiveness and Discomfort**:
- Crossed arms: defensiveness or disagreement
- Leaning back: distancing, disengagement
- Touching face/neck: uncertainty or deception
- Avoiding eye contact: discomfort or dishonesty
- Fidgeting: anxiety or eagerness to leave

**Dominance and Confidence**:
- Taking up space (expansive posture): confidence
- Steepling fingers: confidence in what they are saying
- Firm handshake: assertiveness
- Speaking slowly and clearly: control and confidence

**Deception Cues** (use with caution -- no single cue is reliable):
- Increased blink rate
- Micro-expressions (brief flashes of true emotion)
- Incongruence between words and expression (saying "I'm happy with the deal" while frowning)
- Excessive detail in explanations (over-justification)

### Using Your Own Body Language

**Project confidence**: Sit upright, make eye contact, speak clearly. Even if you feel uncertain, confident body language influences how others perceive you AND how you feel (the "power pose" effect).

**Show engagement**: Lean forward, nod, maintain eye contact. This encourages the other party to share more information.

**Control nervous habits**: Fidgeting, playing with a pen, or checking your phone signals disengagement or anxiety.

### Limitations

Body language reading is not mind reading. Cultural differences significantly affect body language norms. What signals respect in one culture may signal disinterest in another. Always interpret body language in context and in clusters (multiple cues together) rather than relying on any single signal.

### Key Takeaway

Body language is a valuable additional data stream in negotiation, but it is not a lie detector. Use it to complement -- not replace -- careful listening and strategic questioning. And be deliberate about the signals your own body language sends.

**Sources**: Navarro, J. (2008). *What Every Body is Saying*. HarperCollins. Cuddy, A. (2015). *Presence*. Little, Brown. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-anger",
      slug: "managing-anger-frustration",
      title: "Managing Anger & Frustration",
      content: `## Managing Anger & Frustration

Anger is the most common disruptive emotion in negotiation. Research by HBS professor Alison Wood Brooks shows that **expressing anger in negotiation can sometimes be strategic, but more often it destroys value, damages relationships, and leads to impasse.**

### When Anger Hurts Negotiation

Research consistently shows that anger in negotiation:
- Reduces the likelihood of reaching agreement
- Decreases joint gains (both parties do worse)
- Damages the relationship for future interactions
- Triggers reciprocal anger, creating an escalation spiral
- Impairs creative thinking and integrative solutions

### When Anger Can Be Strategic

In narrow circumstances, displayed anger can serve a purpose:
- It signals that a boundary has been crossed
- It can make the other party concede more (in one-time, distributive negotiations)
- It demonstrates seriousness about a position

However, these benefits come at a cost: anger reduces the other party's willingness to negotiate in the future and their satisfaction with any agreement reached. In ongoing relationships, anger almost always has net negative effects.

### Managing Your Own Anger

**1. Anticipate triggers**: Before the negotiation, identify what might make you angry and prepare responses.

**2. Use the "pause button"**: When you feel anger rising, take a break. "Let's take 10 minutes." This is not weakness -- it is strategic self-regulation.

**3. Separate the behavior from the person**: "That proposal concerns me" (about behavior) is more productive than "You're being unreasonable" (about the person).

**4. Express frustration constructively**: "I'm frustrated because this deal isn't meeting our core needs. Can we step back and revisit what's most important to each of us?"

**5. Change the frame**: Instead of "they're trying to take advantage of me" (adversarial), try "they have different information or priorities than I expected" (curious).

### Managing the Other Party's Anger

**1. Acknowledge without conceding**: "I can see you feel strongly about this. Help me understand what's driving that concern."

**2. Do not match their energy**: Responding to anger with anger escalates the conflict. Respond to anger with calm.

**3. Use tactical empathy** (Chris Voss): "It seems like you feel this isn't fair." Naming the emotion reduces its intensity.

**4. Take a break**: If anger is too high for productive conversation, suggest a break. "I want to make sure we reach a good agreement. Let's reconvene tomorrow when we've both had time to reflect."

**5. Address the underlying interest**: Anger often masks a deeper concern -- fear, disrespect, unmet need. Address the root cause.

### Brooks' Research on Anxiety

Alison Wood Brooks (HBS) also found that **anxiety** is even more common than anger in negotiation and equally damaging. Anxious negotiators:
- Make lower first offers
- Respond more quickly to offers (without adequate consideration)
- Exit negotiations earlier
- Achieve worse outcomes

The remedy: reframe anxiety as excitement. Brooks' research shows that telling yourself "I am excited" (rather than "I am calm") significantly improves negotiation performance because it reframes the physiological arousal positively.

### Key Takeaway

Emotions are unavoidable in negotiation. The key is not to suppress them but to manage them deliberately. Recognize your emotional state, regulate your response, and address the other party's emotions with empathy and calm. The negotiator who manages the emotional dimension wins the strategic advantage.

**Sources**: Brooks, A. W. (2015). "Emotion and the Art of Negotiation." *Harvard Business Review*. Fisher, R. & Shapiro, D. (2005). *Beyond Reason*. Voss, C. (2016). *Never Split the Difference*. HBS Online, "Negotiation Mastery" course.`,
    },
  ],
};

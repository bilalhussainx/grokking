import { Module } from "../types";

export const preparationModule: Module = {
  id: "neg-preparation",
  title: "Negotiation Preparation",
  description: "Master the 7 Elements Framework, interests vs. positions, information gathering, walk-away points, and opening strategy.",
  lessons: [
    {
      id: "neg-7-elements",
      slug: "seven-elements-framework",
      title: "The 7 Elements Framework (Harvard Negotiation Project)",
      content: `## The 7 Elements Framework

The Harvard Negotiation Project's **7 Elements Framework** is the most comprehensive negotiation preparation tool available. Developed by Roger Fisher, William Ury, and Bruce Patton, it provides a systematic way to prepare for any negotiation by analyzing seven key dimensions.

### The Seven Elements

**1. Interests**: What does each party really want? Not their stated positions, but the underlying needs, desires, concerns, and fears that drive their behavior. The most common negotiation mistake is arguing over positions instead of exploring interests.

**2. Options**: What are the possible agreements? Before negotiating, brainstorm multiple options that could satisfy both parties' interests. The more options on the table, the more likely you are to find a creative solution.

**3. Alternatives (BATNA)**: What will each party do if no agreement is reached? Your BATNA determines your power and your walkaway point.

**4. Legitimacy**: What objective criteria, precedents, or standards can support your proposals? Arguments based on fairness, market rates, or established precedent are more persuasive than arbitrary demands.

**5. Communication**: How will you communicate? What information will you share? What questions will you ask? How will you listen? Effective negotiators spend more time listening than talking.

**6. Relationship**: What is the current relationship? How important is the ongoing relationship? Negotiations that damage relationships may win the battle but lose the war.

**7. Commitment**: What specific commitments will the agreement include? Who will do what, by when? Clear, actionable commitments prevent post-agreement disputes.

### The Preparation Worksheet

Before any important negotiation, fill in this worksheet:

| Element | My Side | Their Side |
|---------|---------|------------|
| Interests | What do I need/want? | What do they need/want? |
| Options | What deals could I propose? | What deals might they propose? |
| Alternatives | What is my BATNA? | What is their BATNA? |
| Legitimacy | What standards support my position? | What standards support theirs? |
| Communication | What will I share? Ask? | What might they share? Ask? |
| Relationship | How important is this relationship? | How important is it to them? |
| Commitment | What commitment do I want? | What commitment might they want? |

### Key Takeaway

The 7 Elements Framework transforms negotiation from an improvisational art into a structured, repeatable process. Preparation using this framework takes 30-60 minutes and consistently produces better outcomes than winging it.

**Sources**: Fisher, R., Ury, W., & Patton, B. (2011). *Getting to Yes*. Penguin. HBS Online, "Negotiation Mastery" course. Harvard Negotiation Project publications.`,
    },
    {
      id: "neg-interests-positions",
      slug: "interests-vs-positions",
      title: "Interests vs. Positions",
      content: `## Interests vs. Positions

The most important insight from *Getting to Yes* is the distinction between **interests** (what people actually need) and **positions** (what people say they want). Harvard Negotiation Project research shows that focusing on interests rather than positions dramatically increases the likelihood of reaching mutually beneficial agreements.

### The Orange Story

The classic HNP illustration: Two sisters fight over an orange. Each demands the whole orange (their positions are incompatible). A compromise gives each half an orange. But if someone had asked about their interests: one sister wanted the juice to drink; the other wanted the peel to bake. Both could have gotten 100% of what they needed.

**Lesson**: Positions are often incompatible, but the interests underlying those positions may be fully compatible.

### How to Uncover Interests

**Ask "Why?"**: When someone states a position, ask why they want it. "I need the report by Friday" (position). "Why Friday?" "Because I present to the board Monday and need the weekend to prepare" (interest: time to prepare for board presentation).

**Ask "Why Not?"**: When someone rejects a proposal, ask why. Their objections reveal their interests.

**Ask "What Would That Do For You?"**: This question peels back layers from positions to underlying needs.

**Listen for Emotional Cues**: Strong emotional reactions signal deeply held interests. When someone gets agitated about a particular point, you have found an important interest.

### Types of Interests

| Type | Description | Example |
|------|-------------|--------|
| **Substantive** | Tangible outcomes | Money, time, resources |
| **Process** | How things are done | Fairness, transparency, inclusion |
| **Relationship** | The quality of the connection | Respect, trust, future dealings |
| **Principle** | Values and beliefs | Precedent, fairness, equality |

### Key Takeaway

Behind every position lies one or more interests. The negotiator who uncovers interests -- their own and the other party's -- can craft solutions that satisfy both sides better than any compromise of positions could.

**Sources**: Fisher, R. & Ury, W. (1981). *Getting to Yes*. Ury, W. (1991). *Getting Past No*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-info-gathering",
      slug: "information-gathering",
      title: "Information Gathering",
      content: `## Information Gathering

Deepak Malhotra, HBS professor and author of *Negotiation Genius*, argues that **information is the currency of negotiation**. The party with better information -- about the other side's interests, alternatives, constraints, and deadlines -- has a decisive advantage.

### What to Research Before Negotiating

**About the Other Party**:
- What are their interests and priorities?
- What is their BATNA?
- What constraints do they face (budget, timeline, authority)?
- Who are the decision-makers?
- What is their negotiation history and reputation?

**About the Market/Context**:
- What are market rates, industry standards, and comparable deals?
- What are the relevant legal and regulatory considerations?
- What timing factors affect the negotiation?
- Who else is competing for this deal?

**About Yourself**:
- What are your interests (ranked by priority)?
- What is your BATNA? How strong is it?
- What is your reservation price? Aspiration price?
- What constraints do you face?

### Information Gathering During Negotiation

The best negotiators are excellent questioners. Key techniques:

**Open-Ended Questions**: "How do you see this working?" "What matters most to you in this deal?" "What challenges are you facing?"

**Diagnostic Questions**: "What if we structured the payment differently?" "Would a longer timeline work better for you?" These test hypotheses about the other party's interests.

**Reciprocal Sharing**: Share some information about your priorities, then ask about theirs. Reciprocity encourages disclosure.

**Listening Actively**: Pay attention not just to what is said but to what is not said. Hesitations, qualifications, and emotional reactions all reveal information.

### The Information Asymmetry Advantage

In most negotiations, one party knows significantly more than the other. This asymmetry creates both opportunity and risk:

- **If you have more information**: Use it to craft proposals that are attractive to the other side (because you know what they value) while capturing value for yourself
- **If you have less information**: Focus on asking questions, listening carefully, and avoiding premature commitments

### Key Takeaway

The negotiation is won or lost before it begins -- in the preparation phase. The party that invests more time in information gathering enters the negotiation with a decisive advantage. Never negotiate without doing your homework.

**Sources**: Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. Bantam. HBS Online, "Negotiation Mastery" course. Raiffa, H. (1982). *The Art and Science of Negotiation*.`,
    },
    {
      id: "neg-walk-away",
      slug: "setting-walk-away-point",
      title: "Setting Your Walk-Away Point",
      content: `## Setting Your Walk-Away Point

Your walk-away point -- the worst deal you will accept -- is derived from your BATNA and is the most important number in any negotiation. HBS research shows that **negotiators without a clear walk-away point are more likely to accept bad deals** because they get caught up in the momentum of the negotiation.

### Calculating Your Walk-Away

**Step 1: Identify your BATNA** (your best alternative if this negotiation fails)

**Step 2: Value your BATNA comprehensively** -- not just the monetary value, but also:
- Time costs (how long will the alternative take?)
- Opportunity costs (what else could you be doing?)
- Risk (how certain is the alternative?)
- Relationship value (does the alternative preserve important relationships?)
- Emotional costs (stress, uncertainty, inconvenience)

**Step 3: Set your reservation price** equal to the BATNA value adjusted for all costs

### Why Walk-Away Discipline Matters

Without walk-away discipline, you are vulnerable to:

- **Escalation of commitment**: "I've already invested so much time in this negotiation, I should just make a deal" (sunk cost fallacy)
- **Social pressure**: Feeling rude or unreasonable for walking away
- **Anchoring to the other side's terms**: Accepting a bad deal because it seems like an "improvement" from their initial offer
- **Fear of losing**: The psychological pain of losing a deal can cause you to accept terms below your BATNA

### The Power of Walking Away

Paradoxically, **your willingness to walk away is your greatest source of power**. When the other party knows you can and will walk away, they are more likely to offer terms within or above your reservation price.

This requires genuine willingness -- not a bluff. If you would never actually walk away, the other party will eventually sense this and exploit it.

### When to Walk Away

Walk away when:
1. The best available deal is worse than your BATNA
2. The other party is acting in bad faith
3. The deal terms have changed fundamentally from what was agreed
4. The relationship damage from continuing exceeds the deal value

### How to Walk Away Gracefully

- Express appreciation for the time and effort invested
- Explain that the current terms do not meet your needs
- Leave the door open for future discussions
- Follow up in writing to confirm and maintain the relationship

### Key Takeaway

Setting and committing to a walk-away point before the negotiation begins is essential for protecting yourself from bad deals. The walk-away point provides an objective anchor that prevents emotional decision-making in the heat of negotiation.

**Sources**: Fisher, R. & Ury, W. (1981). *Getting to Yes*. Malhotra, D. (2016). *Negotiating the Impossible*. Berrett-Koehler. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-opening",
      slug: "planning-your-opening",
      title: "Planning Your Opening",
      content: `## Planning Your Opening

The opening of a negotiation sets the tone for everything that follows. HBS negotiation research shows that **the first five minutes of a negotiation disproportionately influence the final outcome** through anchoring effects, relationship signals, and framing.

### To Anchor or Not to Anchor

The first offer is the most powerful anchor in any negotiation. Research shows:

- First offers explain 50-85% of the variance in final outcomes
- The party that makes the first offer tends to achieve results closer to their target
- Anchors influence even expert negotiators who are aware of the effect

**Make the first offer when**: You have good information about the market and the other party's likely reservation price. Your anchor should be ambitious but justifiable.

**Let them go first when**: You have very little information about their valuation. Their first offer reveals information about their expectations and ZOPA.

### Crafting Your Opening Offer

**Be ambitious**: Start at or beyond your aspiration price. Research shows that ambitious first offers lead to better final outcomes (as long as they are not so extreme as to be insulting).

**Be justifiable**: Support your opening with objective criteria -- market data, comparable deals, industry standards. An anchor that seems arbitrary is less effective than one grounded in logic.

**Frame it positively**: "Based on market research, I believe the fair value is X" is more effective than "I want X."

### Beyond Price: Framing the Negotiation

The opening also frames *how* the negotiation will proceed:

**Set the agenda**: "I'd like to discuss three topics today: pricing, timeline, and support terms." This gives you control over the structure.

**Establish the tone**: Start collaborative. "I am looking forward to finding an arrangement that works well for both of us."

**Ask questions first**: Before making any offer, ask questions to understand the other side's situation. The information you gather in the first few minutes improves every subsequent decision.

### The Power of Silence

After making your opening offer, **stop talking**. Many negotiators undermine their own anchor by immediately qualifying it ("but I'm flexible" or "what do you think?"). State your offer, provide the justification, and then wait for a response.

### Key Takeaway

The opening sets the anchor, the tone, and the frame for the entire negotiation. Prepare your opening carefully: know whether to anchor first or second, make ambitious but justifiable offers, and use the first few minutes to gather information and establish a collaborative tone.

**Sources**: Galinsky, A. D. & Mussweiler, T. (2001). "First Offers as Anchors." *JPSP*. Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. HBS Online, "Negotiation Mastery" course.`,
    },
  ],
};

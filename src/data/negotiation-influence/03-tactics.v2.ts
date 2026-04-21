import { Module } from "../types";

export const tacticsModule: Module = {
  id: "neg-tactics",
  title: "Negotiation Tactics",
  description: "Learn anchoring, making concessions, creating value, logrolling, and defending against hardball tactics.",
  lessons: [
    {
      id: "neg-anchoring",
      slug: "anchoring-who-goes-first",
      title: "Anchoring (Who Goes First)",
      content: `## Anchoring

Anchoring is the most powerful tactical tool in negotiation. Research by Kahneman, Tversky, and Galinsky demonstrates that **the first number mentioned in a negotiation disproportionately influences the final outcome**, even when both parties know about the anchoring effect.

### The Science of Anchoring

In a classic experiment, Galinsky and Mussweiler asked real estate agents to value a house after seeing a listing price. Agents who saw a high listing price valued the house 11-14% higher than agents who saw a low listing price -- even though they were experienced professionals who claimed listing prices did not influence them.

Anchoring works because our brains use the anchor as a starting point and adjust insufficiently from it. Even arbitrary anchors (a random number) influence subsequent judgments.

### How to Anchor Effectively

**1. Go first (when informed)**: Make the first offer to establish the anchor. Research shows first offers explain 50-85% of the variance in final agreements.

**2. Be ambitious**: Set your anchor at or beyond your aspiration price. An ambitious anchor pulls the final agreement further in your direction.

**3. Be precise**: Research shows that precise numbers (e.g., \\$5,125 vs. \\$5,000) are more potent anchors because they signal knowledge and preparation.

**4. Support with rationale**: An anchor supported by data, market comparables, or logical reasoning is more persuasive and more resistant to counter-anchoring.

### Defending Against Anchors

When the other party anchors first:

1. **Recognize the anchor**: Awareness is the first defense. Tell yourself: "This is an anchor, not a fair starting point."
2. **Do not counter-anchor too close**: If they open at \\$100K and you wanted \\$70K, do not counter at \\$80K. Counter near your aspiration: \\$55K.
3. **Re-anchor with your own number**: Introduce your own anchor supported by different data or criteria.
4. **Question the anchor**: "How did you arrive at that number?" Forcing them to justify the anchor weakens it if the justification is weak.

### Key Takeaway

Anchoring is perhaps the single most important tactical skill in negotiation. Prepare your anchors in advance, support them with data, and be ready to defend against the other party's anchors.

**Sources**: Galinsky, A. D. & Mussweiler, T. (2001). "First Offers as Anchors." Kahneman, D. (2011). *Thinking, Fast and Slow*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-concessions",
      slug: "making-concessions",
      title: "Making Concessions",
      content: `## Making Concessions

Concessions -- the adjustments parties make from their initial positions toward agreement -- are the mechanism through which negotiations move forward. Harvard Negotiation Project research shows that **how you make concessions matters as much as what you concede**.

### The Art of Concession Strategy

**1. Start high, concede slowly**: Begin with an ambitious opening and make concessions gradually. Rapid concessions signal weakness and encourage the other side to push harder.

**2. Make smaller concessions over time**: Each successive concession should be smaller than the last. This signals that you are approaching your limit.

Pattern: \\$10,000 -> \\$5,000 -> \\$2,500 -> \\$1,000
NOT: \\$1,000 -> \\$2,500 -> \\$5,000 -> \\$10,000

**3. Never concede without getting something in return**: Every concession should be accompanied by a request. "I can lower the price by 5% if you can commit to a 2-year contract."

**4. Label your concessions**: Explicitly state the value of what you are conceding. "This represents a \\$15,000 discount from our standard pricing, which I am offering because of the long-term potential of this partnership."

**5. Concede on low-priority issues**: Trade things you value less for things you value more. This creates value for both parties.

### Common Concession Mistakes

- **Splitting the difference**: This feels "fair" but rewards extreme opening positions. The party that starts further from center captures more.
- **Unilateral concessions**: Conceding without asking for anything in return trains the other party to keep pushing.
- **Too many concessions too quickly**: Signals desperation and creates expectations of further concessions.
- **Round-number concessions**: \\$10,000 concessions signal large, easy movement. \\$7,800 signals careful calculation.

### Key Takeaway

Concession strategy is a communication tool. How you concede tells the other party about your flexibility, your priorities, and your limits. Deliberate, reciprocal, diminishing concessions lead to better outcomes than reactive or generous conceding.

**Sources**: Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. Voss, C. (2016). *Never Split the Difference*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-creating-value",
      slug: "creating-value-expanding-pie",
      title: "Creating Value (Expanding the Pie)",
      content: `## Creating Value (Expanding the Pie)

The Harvard Negotiation Project's central insight is that **most negotiations leave value on the table** because parties focus on dividing a fixed pie rather than expanding it. Creating value -- finding solutions that make both parties better off -- is the hallmark of great negotiation.

### How to Create Value

**1. Identify Differences**: Value is created through differences in priorities, time preferences, risk tolerances, and forecasts. If you value speed and they value price, trade: pay more for faster delivery.

**2. Add Issues**: The more issues in a negotiation, the more opportunities for value-creating trades. If you are negotiating price only, add payment terms, delivery schedule, warranty, volume commitments, or exclusivity.

**3. Use Contingent Contracts**: When parties disagree about the future, use "if-then" agreements. "If sales exceed 10,000 units, the royalty rate increases to 10%. If sales are below 5,000, it drops to 5%." Both parties bet on their own forecast.

**4. Share Information About Priorities**: Value creation requires knowing what each side values most. Share information about your priorities (not your limits) and ask questions about theirs.

**5. Brainstorm Before Evaluating**: Separate the creative phase (generating options) from the evaluative phase (choosing among them). Premature judgment kills creative solutions.

### The Post-Settlement Settlement

Raiffa proposed the **post-settlement settlement**: after reaching an initial agreement, both parties continue to look for improvements. "We have a deal. But before we finalize, can we spend 30 minutes exploring whether there are modifications that would make us both better off?" This often reveals additional value.

### Key Takeaway

Creating value is not about being "nice" -- it is about being smart. Negotiators who expand the pie before dividing it achieve better outcomes for themselves AND for the other party. The key skill is identifying differences that enable mutually beneficial trades.

**Sources**: Lax, D. A. & Sebenius, J. K. (1986). *The Manager as Negotiator*. Raiffa, H. (1982). *The Art and Science of Negotiation*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-logrolling",
      slug: "trading-across-issues",
      title: "Trading Across Issues (Logrolling)",
      content: `## Trading Across Issues (Logrolling)

**Logrolling** -- trading concessions across multiple issues -- is the primary mechanism for creating value in integrative negotiations. Harvard Negotiation Project research shows that logrolling produces agreements that are **15-20% more valuable** to both parties compared to single-issue, positional bargaining.

### How Logrolling Works

Logrolling requires that parties have **different priorities** across multiple issues. You give the other party what they value most (at low cost to you) in exchange for what you value most (at low cost to them).

**Example**: Job negotiation with four issues:

| Issue | Your Priority | Their Priority |
|-------|--------------|----------------|
| Salary | HIGH | MEDIUM |
| Start date | LOW | HIGH |
| Title | MEDIUM | LOW |
| Remote work days | MEDIUM | MEDIUM |

Logroll: Accept their preferred start date (low cost to you, high value to them) in exchange for a higher salary (high value to you, medium cost to them).

### Steps for Effective Logrolling

1. **Add issues**: The more issues, the more room for trades
2. **Rank your priorities**: Know what matters most and least to you
3. **Discover their priorities**: Ask questions, listen, propose packages
4. **Propose package deals**: Trade across issues rather than negotiating one issue at a time
5. **Make multiple offers simultaneously**: Present 2-3 equivalent packages. Their preference reveals their priorities.

### Multiple Equivalent Simultaneous Offers (MESOs)

Presenting multiple offers at once is a powerful technique:

"I'd like to propose three options:
- Option A: Higher salary, standard benefits, immediate start
- Option B: Standard salary, enhanced benefits, flexible start date
- Option C: Moderate salary, signing bonus, remote work Fridays"

Their reaction tells you which issues they value most, enabling better logrolling.

### Key Takeaway

Logrolling is the engine of integrative negotiation. By trading low-priority concessions for high-priority gains, both parties can achieve outcomes better than any compromise. The prerequisite: multiple issues and knowledge of relative priorities.

**Sources**: Fisher, R. & Ury, W. (1981). *Getting to Yes*. Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-hardball",
      slug: "dealing-with-hardball-tactics",
      title: "Dealing with Hardball Tactics",
      content: `## Dealing with Hardball Tactics

Not every negotiation counterpart will negotiate collaboratively. Harvard Business School teaches students to recognize and counter **hardball tactics** -- aggressive moves designed to intimidate, confuse, or pressure you into unfavorable concessions.

### Common Hardball Tactics

**1. Good Cop / Bad Cop**: One negotiator is aggressive; the other is sympathetic. The "good cop" then proposes a deal that seems reasonable by comparison. Counter: Recognize the tactic. Address both as a team. "I appreciate the different perspectives, but let's focus on the substance."

**2. Highball / Lowball**: An extreme opening offer designed to anchor the negotiation far from fair value. Counter: Do not counter-anchor near their extreme. Re-anchor with your own well-justified number.

**3. The Nibble**: After reaching agreement, the other party asks for "just one more thing." Counter: "We agreed on the full package. If you want to change one element, we need to revisit the others."

**4. The Deadline**: "This offer expires at midnight." Artificial deadlines create pressure to agree without adequate analysis. Counter: Test whether the deadline is real. "What happens after the deadline?" Often, nothing.

**5. Take It or Leave It**: Removes your ability to negotiate. Counter: Treat it as just another offer. Propose alternatives. If it truly is non-negotiable, evaluate it against your BATNA.

**6. The Flinch**: Exaggerated shock at your proposal to make you doubt yourself and concede. Counter: Stay calm. Ask: "What specifically concerns you about the proposal?"

**7. Information Manipulation**: Selective data, misleading statistics, or outright deception. Counter: Verify claims independently. "That's interesting -- can you share the source?"

### The General Counter-Strategy

For any hardball tactic, use this three-step response:

1. **Recognize it**: Name the tactic (to yourself). Awareness prevents it from working.
2. **Stay calm**: Do not react emotionally. That is what the tactic is designed to provoke.
3. **Redirect to interests**: "I understand your position. Let's step back and discuss what we both need from this deal."

### When to Walk Away

Some negotiators are genuinely acting in bad faith -- lying, threatening, or engaging in unethical behavior. When this happens:

1. Name the behavior: "I feel that you are not negotiating in good faith."
2. State the consequence: "If we cannot negotiate constructively, I will need to pursue my alternatives."
3. Follow through: Walk away if behavior does not change. No deal is better than a deal with someone who cannot be trusted.

### Chris Voss' Tactical Empathy

Chris Voss, former FBI lead hostage negotiator and author of *Never Split the Difference*, teaches **tactical empathy** -- understanding the other party's emotions and perspective, and using that understanding to influence the negotiation.

Key techniques:
- **Mirroring**: Repeat the last 1-3 words they said. This encourages them to elaborate.
- **Labeling**: Name their emotion. "It sounds like you are frustrated with the timeline." This defuses the emotion.
- **Calibrated questions**: "How am I supposed to do that?" turns their demand into a problem they must help solve.

### Key Takeaway

Hardball tactics only work when they are unrecognized. A negotiator who can identify these tactics, remain calm, and redirect to interests neutralizes them effectively. The most powerful response to aggression is not counter-aggression but calm, prepared, interest-based negotiation.

**Sources**: Fisher, R. & Ury, W. (1981). *Getting to Yes*. Voss, C. (2016). *Never Split the Difference*. HarperBusiness. Malhotra, D. (2016). *Negotiating the Impossible*. HBS Online, "Negotiation Mastery" course.`,
    },
  ],
};

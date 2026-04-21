import { Module } from "../types";

export const foundationsModule: Module = {
  id: "neg-foundations",
  title: "Foundations of Negotiation",
  description: "Understand negotiation fundamentals: distributive vs. integrative, BATNA, ZOPA, and reservation prices.",
  lessons: [
    {
      id: "neg-what-is",
      slug: "what-is-negotiation",
      title: "What is Negotiation?",
      content: `## What is Negotiation?

Negotiation is a **process by which two or more parties with different preferences and interests attempt to reach a mutually acceptable agreement**. Harvard Business School's "Negotiation Mastery" course, built on decades of research from the Harvard Negotiation Project (HNP), teaches that negotiation is not a talent -- it is a learnable, structured skill.

### Why Negotiation Matters

Every professional negotiates constantly: salary discussions, project deadlines, budget allocations, client contracts, vendor terms, and team decisions. Research from HBS shows that **the difference between a good negotiator and an average one can be worth millions of dollars** over a career.

### The Two Mindsets

**Fixed Pie Mindset**: "There is only so much to go around. Whatever you gain, I lose." This mindset leads to competitive, adversarial negotiation.

**Expanding Pie Mindset**: "We can create more value together than either of us can capture alone." This mindset leads to creative, collaborative negotiation.

The best negotiators start with an expanding pie mindset (create value) and then shift to a fixed pie mindset (claim value). This dual approach is called **creating and claiming value** -- the central tension in all negotiation.

### Elements of Every Negotiation

1. **Parties**: Who is at the table? Who is not at the table but influences the outcome?
2. **Interests**: What does each party actually care about? (Not their stated positions, but their underlying needs)
3. **Options**: What possible agreements exist?
4. **Alternatives**: What happens if no agreement is reached? (BATNA)
5. **Legitimacy**: What objective criteria or standards apply?
6. **Communication**: How will parties exchange information?
7. **Relationship**: What is the ongoing relationship between parties?

These seven elements form the foundation of the **Harvard Negotiation Project's 7 Elements Framework**, which we will explore in depth.

### Key Takeaway

Negotiation is not about winning -- it is about reaching agreements that serve your interests while maintaining productive relationships. The best negotiators create value before claiming it.

**Sources**: Fisher, R. & Ury, W. (1981). *Getting to Yes*. Penguin. HBS Online, "Negotiation Mastery" course. Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. Bantam.`,
    },
    {
      id: "neg-distributive-integrative",
      slug: "distributive-vs-integrative",
      title: "Distributive vs. Integrative Negotiation",
      content: `## Distributive vs. Integrative Negotiation

The Harvard Negotiation Project identifies two fundamentally different types of negotiation. Understanding which type you are in -- and which type you *could* transform it into -- is the first step to negotiating effectively.

### Distributive Negotiation (Claiming Value)

Also called "zero-sum" or "win-lose" negotiation. There is a fixed amount of value, and the parties compete to claim as much as possible.

**Characteristics**:
- Single issue (usually price)
- One party's gain is the other's loss
- Competitive tactics: anchoring, bluffing, pressure
- Short-term, one-time transactions

**Example**: Buying a car. The dealer wants the highest price; you want the lowest. Every dollar the dealer gains, you lose.

### Integrative Negotiation (Creating Value)

Also called "win-win" or "interest-based" negotiation. The parties work together to expand the total value available before dividing it.

**Characteristics**:
- Multiple issues with different priorities
- Potential for mutual gains through creative trade-offs
- Collaborative tactics: information sharing, brainstorming, problem-solving
- Ongoing relationships

**Example**: A job offer negotiation. You care most about salary; the company cares most about start date. By trading (you start earlier in exchange for higher salary), both sides get more of what they value most.

### Creating Value Through Differences

The key insight from HBS negotiation research: **differences create value**. Parties can create value by trading across issues where they have different priorities:

| Difference Type | How It Creates Value |
|----------------|---------------------|
| Different priorities | Trade: I give you what you value most; you give me what I value most |
| Different risk tolerances | Share risk differently (guarantees, contingencies) |
| Different time preferences | Structure payments over time |
| Different forecasts | Use contingent contracts ("If X happens, then Y") |
| Different capabilities | Each party contributes what they do best |

### The Negotiator's Dilemma

The central tension in negotiation: **to create value, you must share information (what you care about, what you would accept). But sharing information makes you vulnerable to exploitation.**

This is the negotiator's dilemma -- the tension between cooperating (to create value) and competing (to claim value). The best negotiators manage this tension by:
1. Sharing information about priorities (not about limits)
2. Asking questions to understand the other side's interests
3. Proposing package deals that reveal preferences
4. Building trust gradually through reciprocal sharing

### Key Takeaway

Most real-world negotiations have both distributive and integrative elements. The best approach: start integrative (explore interests, create value) and then move to distributive (divide the expanded pie fairly). Never assume a negotiation is purely zero-sum -- there are almost always opportunities to create additional value.

**Sources**: Fisher, R. & Ury, W. (1981). *Getting to Yes*. Lax, D. A. & Sebenius, J. K. (1986). *The Manager as Negotiator*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-batna",
      slug: "batna",
      title: "BATNA (Best Alternative to a Negotiated Agreement)",
      content: `## BATNA (Best Alternative to a Negotiated Agreement)

BATNA -- your **Best Alternative to a Negotiated Agreement** -- is the single most important concept in negotiation theory. Developed by Roger Fisher and William Ury at the Harvard Negotiation Project, BATNA defines your **power** in any negotiation. The stronger your BATNA, the more leverage you have.

### What is BATNA?

Your BATNA is your best option if the current negotiation fails -- what you will do if you walk away from the table without a deal.

**Examples**:
- In a salary negotiation, your BATNA might be another job offer, staying at your current job, or freelancing
- In a business deal, your BATNA might be another vendor, building in-house, or doing nothing
- In a real estate negotiation, your BATNA might be another property, renting, or waiting

### Why BATNA Matters

BATNA determines your **walkaway point** -- the worst deal you would accept. Any offer better than your BATNA is worth considering. Any offer worse than your BATNA should be rejected.

**Strong BATNA** = Strong negotiating position. You can make demands because you have a good alternative. You can walk away without pain.

**Weak BATNA** = Weak negotiating position. You need this deal more than the other party needs you. You will likely make concessions.

### How to Strengthen Your BATNA

1. **Develop alternatives before negotiating**: Apply to multiple jobs before negotiating salary. Get quotes from multiple vendors before negotiating a contract.
2. **Improve existing alternatives**: If your current job is your BATNA, improve it (ask for a raise, take on more responsibility) to strengthen your walkaway position.
3. **Create new alternatives**: If you have no alternatives, create some. Even weak alternatives are better than none.
4. **Communicate your BATNA credibly** (when strategic): Sometimes mentioning that you have alternatives strengthens your position. But only if it is true -- bluffing about your BATNA can backfire.

### Assessing the Other Party's BATNA

Your power in negotiation depends not just on your BATNA but on the **relative strength of both BATNAs**:

- If your BATNA is strong and theirs is weak, you have leverage
- If your BATNA is weak and theirs is strong, they have leverage
- If both BATNAs are strong, the negotiation may not produce a deal (the alternatives are too good)
- If both BATNAs are weak, both parties are motivated to reach agreement

Research the other party's alternatives before negotiating. What are their options if this deal falls through? The more you understand their BATNA, the better you can craft proposals that are just good enough to beat it.

### BATNA Mistakes

1. **Not identifying your BATNA**: Entering a negotiation without knowing your walkaway point is flying blind
2. **Overestimating your BATNA**: Wishful thinking about alternatives leads to overconfidence and missed deals
3. **Underestimating the other side's BATNA**: This leads to unrealistic demands and failed negotiations
4. **Revealing your BATNA unnecessarily**: If your BATNA is weak, revealing it gives the other side all the leverage

### Key Takeaway

BATNA is the source of negotiating power. Before any negotiation, invest time in identifying, developing, and strengthening your alternatives. The negotiator with the best BATNA has the most leverage -- regardless of their negotiation skills.

**Sources**: Fisher, R. & Ury, W. (1981). *Getting to Yes*. Penguin. Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-zopa",
      slug: "zopa",
      title: "ZOPA (Zone of Possible Agreement)",
      content: `## ZOPA (Zone of Possible Agreement)

The **Zone of Possible Agreement (ZOPA)** is the range between the parties' reservation prices -- the area where a deal is possible. Understanding ZOPA is essential for every negotiation because **if there is no ZOPA, no deal is possible regardless of negotiation skill.**

### What is ZOPA?

ZOPA is the overlap between what the buyer is willing to pay and what the seller is willing to accept.

**Example**: You are buying a used car.
- Seller's reservation price (minimum they will accept): \\$15,000
- Buyer's reservation price (maximum you will pay): \\$18,000
- ZOPA: \\$15,000 - \\$18,000 (\\$3,000 range)

Any price between \\$15,000 and \\$18,000 is better for both parties than no deal. The negotiation determines *where* within the ZOPA the final price falls.

### When There is No ZOPA

If the seller will not accept less than \\$20,000 and the buyer will not pay more than \\$18,000, there is a **negative ZOPA** -- no overlap. No deal is possible. Smart negotiators recognize this early and walk away rather than wasting time.

However, before concluding there is no ZOPA, explore whether you can **create value** by adding issues. Perhaps the buyer could offer a fast close (which the seller values) or the seller could include a warranty (which the buyer values). These additions may expand the ZOPA.

### Reservation Price (Walk-Away Point)

Your **reservation price** is the worst deal you would accept -- the point at which you are indifferent between accepting the deal and walking away to your BATNA.

Calculating your reservation price:
1. Identify your BATNA (best alternative)
2. Value your BATNA in comparable terms
3. Adjust for non-monetary factors (relationship, time, risk)
4. Your reservation price = the deal equivalent of your BATNA

### Aspiration Price (Target)

Your **aspiration price** is the best deal you can reasonably hope for -- your target. Research shows that negotiators who set ambitious (but realistic) aspiration prices achieve better outcomes.

The relationship: Aspiration Price > Expected Outcome > Reservation Price > BATNA

### Claiming Value Within the ZOPA

Once you know a ZOPA exists, the question becomes: where within the ZOPA will the deal land? The tools for claiming value:

- **Anchoring**: The first number mentioned disproportionately influences the final outcome
- **Concessions**: Making strategic concessions (trading things you value less for things you value more)
- **Information**: The more you know about the other side's reservation price, the more of the ZOPA you can capture
- **Patience**: The more patient party usually captures more of the ZOPA

### Key Takeaway

ZOPA defines the boundaries of possible deals. Before negotiating, estimate both your own reservation price and the other party's. If a ZOPA exists, negotiate to capture as much of it as possible while maintaining the relationship. If no ZOPA exists, walk away or explore creative ways to expand it.

**Sources**: Raiffa, H. (1982). *The Art and Science of Negotiation*. Harvard University Press. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-reservation-aspiration",
      slug: "reservation-aspiration-price",
      title: "Reservation Price & Aspiration Price",
      content: `## Reservation Price & Aspiration Price

Two numbers define your negotiation strategy: your **reservation price** (the worst deal you will accept) and your **aspiration price** (the best deal you hope to achieve). Harvard Negotiation Project research shows that **negotiators who set clear, ambitious targets consistently achieve better outcomes** than those who "wing it."

### Setting Your Reservation Price

Your reservation price should be derived from your BATNA, not from arbitrary feelings about what is "fair":

1. **Identify your BATNA**: What is your best alternative if this negotiation fails?
2. **Value your BATNA**: What is it worth to you in concrete terms?
3. **Adjust for transaction costs**: Consider the time, effort, and risk of pursuing your BATNA
4. **Your reservation price = BATNA value adjusted for transaction costs**

**Example**: You are negotiating a job offer. Your BATNA is your current job (\\$90K salary, good benefits, short commute). Your reservation price for the new job might be \\$105K -- enough to compensate for the disruption of switching.

### Setting Your Aspiration Price

Research by Adam Galinsky (Columbia Business School, frequently cited at HBS) demonstrates that **your aspiration price is the single strongest predictor of your negotiation outcome**. Negotiators who set ambitious targets achieve significantly better results.

How to set your aspiration:
1. Research market rates, comparable deals, and industry standards
2. Consider the other party's alternatives and constraints
3. Set a target that is ambitious but defensible with objective criteria
4. Write it down before the negotiation begins

### The Power of First Offers (Anchoring)

Should you make the first offer? Research says **yes, when you have good information about the ZOPA**. The first offer acts as an anchor that pulls the final agreement in your direction.

Galinsky's research: first offers explain **50-85% of the variance** in final agreements. Making the first offer is one of the most powerful moves in negotiation.

**When to go first**: When you have good market information and can set an ambitious but reasonable anchor.

**When NOT to go first**: When you have very little information about the other party's valuation. In this case, let them anchor first, and you will learn about their expectations.

### The Negotiation Zone Visualization

\`\`\`
Buyer's                                    Seller's
Aspiration    Buyer's     Seller's          Aspiration
(low)         Reservation  Reservation       (high)
  |              |    ZOPA    |               |
  v              v  <------->  v               v
  \\$12K          \\$15K        \\$18K            \\$22K
\`\`\`

The buyer wants to pay as close to \\$12K as possible. The seller wants to receive as close to \\$22K as possible. The ZOPA is \\$15K-\\$18K. The final price depends on preparation, anchoring, and negotiation skill.

### Common Mistakes

1. **Not setting a reservation price**: Without a clear walkaway, you risk accepting a bad deal in the heat of the moment
2. **Setting aspirations too low**: Modest targets produce modest outcomes. Research shows that most negotiators leave money on the table
3. **Confusing aspiration with reservation**: Your aspiration is what you aim for; your reservation is the minimum you accept. They should be far apart
4. **Anchoring against yourself**: Making a first offer that is too conservative anchors the negotiation in the other party's favor

### Key Takeaway

Preparation is the most important phase of any negotiation. Set a clear reservation price (derived from your BATNA), an ambitious aspiration price (supported by research), and a first offer strategy (usually anchor high if you have good information). Negotiators who prepare thoroughly outperform those who rely on charm or improvisation.

**Sources**: Galinsky, A. D. & Mussweiler, T. (2001). "First Offers as Anchors." *Journal of Personality and Social Psychology*. Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. HBS Online, "Negotiation Mastery" course.`,
    },
  ],
};

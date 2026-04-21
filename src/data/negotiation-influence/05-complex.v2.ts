import { Module } from "../types";

export const complexModule: Module = {
  id: "neg-complex",
  title: "Complex Negotiations",
  description: "Navigate multi-party negotiations, cross-cultural contexts, digital negotiation, agent negotiations, and coalition building.",
  lessons: [
    {
      id: "neg-multi-party",
      slug: "multi-party-negotiations",
      title: "Multi-Party Negotiations",
      content: `## Multi-Party Negotiations

Most real-world negotiations involve more than two parties. HBS professor James Sebenius' research on multi-party negotiation reveals that **complexity increases exponentially, not linearly, with each additional party** -- creating both challenges and opportunities.

### What Makes Multi-Party Different

**Coalitions**: Parties can form alliances that shift power dynamics. Understanding potential coalition structures is critical.

**Information complexity**: More parties means more interests, more alternatives, and more information to track.

**Process challenges**: Scheduling, agenda-setting, and decision-making are harder with more people.

**Agreement challenges**: Unanimity is harder to achieve. What type of agreement is needed -- consensus, majority, or something else?

### Strategies for Multi-Party Negotiations

**1. Map the parties**: Before negotiating, identify all stakeholders -- including those not at the table but who influence the outcome.

**2. Understand all BATNAs**: Each party has alternatives. Understanding the full set of BATNAs reveals the power dynamics.

**3. Sequence strategically**: Sebenius argues that the *order* in which you engage parties matters enormously. Start with parties most likely to agree, building momentum and coalition support.

**4. Build coalitions**: Identify natural allies -- parties whose interests align with yours. Build agreements with allies first, then approach more difficult parties from a position of strength.

**5. Manage the process**: In multi-party negotiations, the party that manages the process (sets the agenda, proposes the structure, facilitates discussion) gains significant influence over the outcome.

### Key Takeaway

Multi-party negotiations are more complex but also more creative -- the more parties involved, the more opportunities for value-creating trades. The key skill is understanding the full web of interests, alternatives, and potential coalitions.

**Sources**: Sebenius, J. K. (2017). *Negotiation Analysis*. HBS Press. Lax, D. A. & Sebenius, J. K. (2006). *3-D Negotiation*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-cross-cultural",
      slug: "cross-cultural-negotiation",
      title: "Cross-Cultural Negotiation",
      content: `## Cross-Cultural Negotiation

Jeswald Salacuse, a Harvard-affiliated negotiation scholar, surveyed negotiators from 12 countries and found **significant cultural differences across 10 negotiation dimensions**. Ignoring these differences is one of the most common causes of international negotiation failure.

### Cultural Dimensions That Affect Negotiation

| Dimension | Example Range |
|-----------|---------------|
| Goal | Contract vs. Relationship |
| Attitude | Win-lose vs. Win-win |
| Personal style | Informal vs. Formal |
| Communication | Direct vs. Indirect |
| Time sensitivity | High vs. Low |
| Emotionalism | High vs. Low |
| Agreement form | Specific vs. General |
| Agreement building | Bottom-up vs. Top-down |
| Team organization | One leader vs. Consensus |
| Risk taking | High vs. Low |

### Regional Patterns (with caution about stereotyping)

**American**: Direct, fast-paced, contract-focused, informal, individual decision-making.

**Japanese**: Indirect, relationship-focused, consensus-based, formal, long-term oriented. Silence is a communication tool, not a sign of confusion.

**German**: Detail-oriented, formal, punctual, contract-focused, thorough preparation.

**Brazilian**: Relationship-focused, emotional, flexible on time, personal connections matter enormously.

**Chinese**: Relationship (guanxi) is prerequisite, hierarchical, patient, concerned with "face," decisions made at the top.

### Strategies for Cross-Cultural Negotiation

1. **Research the culture**: Before negotiating internationally, study the cultural norms around communication, decision-making, relationship building, and time.

2. **Build relationships first**: In many cultures, business discussion before relationship establishment is inappropriate or ineffective.

3. **Adjust your style**: Adapt your communication style, pace, and formality to match cultural expectations.

4. **Use interpreters strategically**: Even if both parties speak English, subtle meaning can be lost in a second language. Professional interpreters catch nuance.

5. **Be patient**: Different cultures have different timelines for negotiation. American urgency can be off-putting in cultures that value deliberation.

### Key Takeaway

Cross-cultural negotiation requires the same frameworks (interests, BATNA, ZOPA) but different interpersonal approaches. Cultural intelligence -- understanding and adapting to cultural differences -- is a strategic advantage in international negotiation.

**Sources**: Salacuse, J. W. (1998). "Ten Ways That Culture Affects Negotiating Style." *Negotiation Journal*. Meyer, E. (2014). *The Culture Map*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-digital",
      slug: "negotiating-email-phone-video",
      title: "Negotiating by Email, Phone & Video",
      content: `## Negotiating by Email, Phone & Video

The rise of remote work has dramatically increased the percentage of negotiations conducted through digital channels. HBS research shows that **negotiations conducted by email are more likely to reach impasse and produce lower joint gains** compared to face-to-face negotiations. Understanding channel-specific dynamics is essential.

### Channel Comparison

| Channel | Richness | Speed | Documentation | Relationship |
|---------|----------|-------|---------------|-------------|
| Face-to-face | Highest | Real-time | Low (unless recorded) | Strongest |
| Video call | High | Real-time | Medium | Good |
| Phone | Medium | Real-time | Low | Moderate |
| Email | Low | Asynchronous | High | Weakest |

### Email Negotiation

**Risks**: Tone is easily misinterpreted. Sarcasm, humor, and nuance often fail. The asynchronous nature allows for strategic delay but also enables avoidance. People are more competitive and less empathetic over email.

**Best practices**:
- Re-read before sending (assume the worst interpretation)
- Use email for proposals and documentation, not for resolving disputes
- Pick up the phone when emotions are high or the topic is sensitive
- Be explicit about tone: "I want to make sure this comes across as intended -- I am genuinely open to your perspective"

### Video Negotiation

**Advantages**: Visual cues (body language, facial expressions), real-time interaction, builds more rapport than phone or email.

**Challenges**: "Zoom fatigue," reduced peripheral awareness, technical difficulties, harder to read subtle body language.

**Best practices**:
- Camera on, good lighting, professional background
- Look at the camera (not the screen) to simulate eye contact
- Use chat or shared documents for complex numbers/proposals
- Take breaks every 60-90 minutes

### Choosing the Right Channel

| Situation | Recommended Channel |
|-----------|--------------------|
| Initial relationship building | Face-to-face or video |
| Complex, multi-issue negotiations | Face-to-face or video |
| Emotional or sensitive topics | Face-to-face, video, or phone |
| Documenting proposals and terms | Email (followed by discussion) |
| Simple, single-issue negotiations | Phone or email |
| Follow-up and confirmation | Email |

### Key Takeaway

The channel you negotiate through is itself a strategic choice. Use richer channels (face-to-face, video) for relationship building, complex issues, and emotional situations. Use leaner channels (email) for documentation and simple clarifications.

**Sources**: Thompson, L. (2012). "Negotiating via Email." HBS case material. Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-agents",
      slug: "agent-negotiations",
      title: "Agent Negotiations (Lawyers, Real Estate)",
      content: `## Agent Negotiations

Many important negotiations are conducted through agents -- lawyers, real estate agents, business brokers, talent agents, and other intermediaries. HBS research shows that agents introduce both benefits and risks that must be managed carefully.

### Why Use Agents

**Expertise**: Agents bring specialized knowledge of the market, legal requirements, and negotiation norms.

**Emotional buffer**: Agents can maintain objectivity when principals become emotional.

**Signaling**: Using a prestigious agent signals seriousness and capability.

**Efficiency**: Agents handle routine negotiations, freeing principals for other activities.

### Risks of Agent Negotiations

**1. Misaligned incentives**: A real estate agent earns commission on the sale price -- they want a fast closing, not necessarily the best price. A 3% difference in sale price changes the agent's commission by a few hundred dollars but changes the seller's proceeds by thousands.

**2. Adversarial escalation**: Agents who are paid to "fight" may escalate conflicts that the principals would prefer to resolve amicably.

**3. Information filtering**: Agents may not share all information with their principal (or with the other side) if it does not serve their interests.

**4. Relationship barriers**: Agents can create distance between the actual decision-makers, preventing the relationship building that facilitates integrative agreements.

### Managing Agent Relationships

1. **Align incentives explicitly**: Structure compensation to align with your interests, not just with completing the deal
2. **Stay involved**: Do not abdicate the negotiation to the agent entirely. Stay informed and make key decisions yourself
3. **Set clear parameters**: Define your reservation price, key interests, and non-negotiables before the agent begins
4. **Communicate directly when appropriate**: Sometimes principal-to-principal communication is more effective than agent-to-agent

### Key Takeaway

Agents can be powerful assets in negotiation, but they must be managed. Align their incentives with yours, stay involved in key decisions, and maintain direct communication channels with the other principal when the relationship matters.

**Sources**: Mnookin, R. H., Peppet, S. R., & Tulumello, A. S. (2000). *Beyond Winning*. Harvard University Press. Malhotra, D. & Bazerman, M. H. (2007). *Negotiation Genius*. HBS Online, "Negotiation Mastery" course.`,
    },
    {
      id: "neg-coalitions",
      slug: "coalition-building",
      title: "Coalition Building",
      content: `## Coalition Building

In multi-party negotiations, **coalitions** -- temporary alliances between parties who share interests on specific issues -- are the primary mechanism of influence. James Sebenius of HBS argues that the ability to build and manage coalitions is one of the most important and most underappreciated negotiation skills.

### Why Coalitions Matter

Coalitions shift power dynamics. A party that is weak alone may become powerful as part of a coalition. Conversely, a dominant party can be checked by a coalition of smaller parties.

### Coalition Building Strategy

**Step 1: Map the landscape**
Identify all parties and their interests. Who are potential allies? Who are potential opponents? Who is undecided?

**Step 2: Identify shared interests**
Coalitions form around shared interests, not shared identities. You do not need to like your coalition partner -- you need aligned interests on the issue at hand.

**Step 3: Approach allies first**
Sebenius' "backward mapping" strategy: start with the parties most likely to agree, build agreements with them, and then approach more difficult parties with an existing coalition.

**Step 4: Create value for coalition members**
Each member must benefit from the coalition. If the coalition only serves your interests, it will not hold.

**Step 5: Manage the coalition**
Coalitions are inherently unstable. They require ongoing communication, trust-building, and attention to each member's interests.

### Defensive Coalition Strategy

When facing a coalition aligned against you:
1. **Divide and conquer**: Identify the weakest link in the opposing coalition and offer them a better deal individually
2. **Build a counter-coalition**: Ally with parties who are not part of the opposing coalition
3. **Address the coalition's core concern**: If the coalition formed around a specific grievance, addressing that grievance may dissolve it

### Case Study: The Camp David Accords (1978)

President Jimmy Carter's negotiation between Egypt and Israel is one of the most studied multi-party negotiations at HBS. Carter built a coalition of moderate voices on both sides, used shuttle diplomacy to manage emotional dynamics, and created a package deal (Sinai Peninsula return + diplomatic recognition + framework for Palestinian autonomy) that gave both sides enough to claim victory.

**Key lessons**: Focus on interests (security for Israel, sovereignty for Egypt), use single-text procedure (one draft that both sides edit), and invest in relationships (13 days together at Camp David built trust).

### Key Takeaway

Coalition building is a strategic skill that amplifies negotiating power. The negotiator who understands coalition dynamics -- who can build, manage, and counter coalitions -- has a decisive advantage in multi-party negotiations.

**Sources**: Sebenius, J. K. (2017). *Negotiation Analysis*. Lax, D. A. & Sebenius, J. K. (2006). *3-D Negotiation*. HBS case studies on Camp David Accords. HBS Online, "Negotiation Mastery" course.`,
    },
  ],
};

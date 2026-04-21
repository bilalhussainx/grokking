import { Module } from "../types";

export const fundingModule: Module = {
  id: "ent-funding",
  title: "Funding & Finance",
  description: "Navigate bootstrapping vs. fundraising, angel investors, venture capital, pitch decks, and term sheets.",
  lessons: [
    {
      id: "ent-bootstrapping",
      slug: "bootstrapping-vs-fundraising",
      title: "Bootstrapping vs. Fundraising",
      content: `## Bootstrapping vs. Fundraising

One of the most consequential early decisions for any startup is how to fund it. Harvard Business School teaches that there is no universally correct answer -- the right funding strategy depends on the business model, market dynamics, and founder preferences.

### Bootstrapping

Bootstrapping means funding the business from personal savings, revenue, and creative resourcefulness -- without external investors.

**Advantages**:
- Full ownership and control
- No investor pressure for premature scaling
- Forces discipline and profitability from day one
- No dilution of equity
- Freedom to build at your own pace

**Disadvantages**:
- Slower growth (limited by revenue)
- Personal financial risk
- May miss market windows
- Harder to attract top talent without equity compensation

**Famous Bootstrapped Companies**: Mailchimp (\\$800M+ revenue, no venture funding until acquisition for \\$12B), Basecamp, Spanx (\\$5,000 initial investment), GoPro.

### Venture-Funded

Raising external capital from angel investors and venture capitalists.

**Advantages**:
- Capital for rapid growth
- Access to investor networks, expertise, and credibility
- Ability to hire aggressively
- Can capture market before competitors

**Disadvantages**:
- Dilution (founders may own <20% by exit)
- Loss of control (board seats, veto rights)
- Investor pressure for growth at all costs
- Misaligned incentives (investors want 10x returns; founders may want sustainable business)
- Time spent fundraising is time not spent building

### When to Bootstrap vs. Raise

| Factor | Bootstrap | Raise |
|--------|-----------|-------|
| Market dynamics | Slow-moving, niche | Winner-take-all, fast-moving |
| Capital requirements | Low (software, services) | High (hardware, marketplace) |
| Growth ambition | Sustainable, profitable | Hypergrowth, market capture |
| Founder preference | Autonomy and control | Scale and impact |
| Business model | Profitable from early stages | Requires investment before revenue |

### The Middle Path

Many successful companies combine approaches: bootstrap to prove the concept, then raise capital to scale. This gives you the best of both worlds -- validation before dilution.

### Key Takeaway

Funding is not a milestone of success -- it is a strategic tool. The right approach depends on your market, your business model, and your personal goals. Never raise money just because you can.

**Sources**: Wasserman, N. (2012). *The Founder's Dilemmas*. HBS Online, "Entrepreneurship Essentials" course. Fried, J. & Hansson, D. H. (2010). *Rework*. Crown Business.`,
    },
    {
      id: "ent-angels-seed",
      slug: "angel-investors-seed-rounds",
      title: "Angel Investors & Seed Rounds",
      content: `## Angel Investors & Seed Rounds

Angel investors are high-net-worth individuals who invest their own money in early-stage startups, typically in exchange for equity. They fill the funding gap between friends-and-family money and institutional venture capital. HBS research shows that angel investing is a critical part of the startup ecosystem.

### What Angel Investors Provide

**Capital**: Typical angel investments range from \\$25,000 to \\$500,000, with the average around \\$75,000-\\$100,000.

**Expertise**: Many angels are former entrepreneurs or executives who provide mentorship and strategic advice.

**Networks**: Introductions to customers, partners, talent, and follow-on investors.

**Credibility**: Having a well-known angel investor validates the startup to future investors and partners.

### The Seed Round

Seed rounds are the first formal fundraising round, typically raising \\$500K-\\$3M:

| Element | Typical Terms |
|---------|---------------|
| Amount | \\$500K - \\$3M |
| Valuation | \\$3M - \\$15M pre-money |
| Dilution | 15-25% |
| Instrument | SAFE note or convertible note (increasingly, priced rounds) |
| Timeline | 2-6 months |
| Sources | Angels, angel syndicates, micro-VCs, accelerators |

### SAFE Notes (Simple Agreement for Future Equity)

Y Combinator introduced the SAFE as a simpler alternative to convertible notes:
- No interest rate or maturity date (unlike convertible notes)
- Converts to equity at the next priced round
- Valuation cap and/or discount protect the investor
- Simple 5-page document (vs. 20+ pages for a priced round)

### Finding Angel Investors

1. **Personal network**: The most common source. Friends, family, former colleagues.
2. **Angel groups**: Organized networks (Tech Coast Angels, Golden Seeds, Band of Angels)
3. **Accelerators**: Y Combinator, Techstars, 500 Global provide seed funding + mentorship
4. **AngelList and platforms**: Online platforms connecting startups with angels
5. **Industry events**: Demo days, pitch competitions, conferences

### What Angels Look For

1. **Team**: Track record, domain expertise, complementary skills, resilience
2. **Market**: Large and growing market with clear demand
3. **Traction**: Early signals (users, revenue, partnerships, waitlists)
4. **Product**: Working prototype or MVP that demonstrates capability
5. **Vision**: A compelling narrative of how this becomes a large company

### Key Takeaway

Angel and seed funding is about more than money -- it is about finding investors who add value through expertise, networks, and credibility. Choose investors as carefully as they choose you.

**Sources**: HBS Online, "Entrepreneurship Essentials" course. Kerr, W., Lerner, J., & Schoar, A. (2014). "The Consequences of Entrepreneurial Finance." *Review of Financial Studies*. Y Combinator. "SAFE Notes Explained."`,
    },
    {
      id: "ent-venture-capital",
      slug: "venture-capital",
      title: "Venture Capital (Series A/B/C)",
      content: `## Venture Capital (Series A/B/C)

Venture capital (VC) is a form of private equity financing for high-growth startups. HBS has deep ties to the VC industry -- many prominent VCs are HBS alumni, and the school's entrepreneurship courses extensively analyze VC dynamics, term sheets, and the investor-founder relationship.

### How VC Works

Venture capitalists raise large funds (\\$100M-\\$1B+) from institutional investors (pension funds, endowments, family offices), invest in a portfolio of startups, and aim for outsized returns from a few breakout successes.

**The VC Math**: A \\$500M fund invests in ~30 companies. Most will fail. A few will return 3-5x. The fund needs 1-2 companies to return 50-100x to deliver target returns to investors (typically 3x the fund, or 20%+ annual returns).

### Funding Stages

| Stage | Amount | Purpose | Key Metrics |
|-------|--------|---------|-------------|
| **Seed** | \\$500K-\\$3M | Build MVP, validate market | Team, prototype, early traction |
| **Series A** | \\$5M-\\$20M | Find product-market fit, build team | Revenue growth, retention, unit economics |
| **Series B** | \\$15M-\\$50M | Scale the business | Revenue scale, market position, profitability path |
| **Series C+** | \\$50M-\\$500M+ | Expand markets, M&A, IPO prep | Market leadership, financial performance |

### What VCs Look For at Each Stage

**Seed**: Team quality, market size, unique insight, early product. "Can this team figure it out?"

**Series A**: Product-market fit evidence, repeatable customer acquisition, growing revenue. "Does this product solve a real problem that customers will pay for?"

**Series B**: Proven business model, strong unit economics, clear path to market leadership. "Can this company scale efficiently?"

**Series C+**: Market leadership, path to profitability or IPO, defensible position. "Is this a category-defining company?"

### The VC Relationship

VCs are not just investors -- they become partners (sometimes literally, through board seats). The relationship involves:

- **Board representation**: VCs typically take board seats and influence major decisions
- **Follow-on investment**: Good VCs invest in subsequent rounds ("double down" on winners)
- **Network access**: Introductions to customers, talent, and partners
- **Strategic guidance**: Advice on scaling, hiring, and market strategy
- **Exit pressure**: VCs have fund timelines (typically 10 years) and need liquidity events

### Choosing the Right VC

Not all money is equal. Evaluate VCs on:
1. **Domain expertise**: Do they understand your industry?
2. **Portfolio synergies**: Can they make introductions to other portfolio companies?
3. **Reputation**: What do other founders say about working with them?
4. **Value-add**: What beyond money do they provide?
5. **Alignment**: Do they share your vision for the company's future?

### Key Takeaway

Venture capital is a powerful tool for building large companies quickly, but it comes with significant trade-offs: dilution, loss of control, and pressure for rapid growth. Choose VC only when your market and business model require it, and choose your investors as carefully as co-founders.

**Sources**: Sahlman, W. A. (1990). "The Structure and Governance of Venture-Capital Organizations." *Journal of Financial Economics*. HBS Online, "Entrepreneurship Essentials" course. Kupor, S. (2019). *Secrets of Sand Hill Road*. Portfolio/Penguin.`,
    },
    {
      id: "ent-pitch-deck",
      slug: "the-pitch-deck",
      title: "The Pitch Deck",
      content: `## The Pitch Deck

The pitch deck is the entrepreneur's calling card -- a 10-15 slide presentation that communicates the business opportunity to investors. HBS professor Tom Eisenmann's research on startup failures emphasizes that the pitch deck is not just a fundraising tool but a **strategic thinking exercise** that forces founders to articulate their business clearly.

### The Standard Pitch Deck Structure

Guy Kawasaki (former Apple evangelist) recommends the **10-slide format** that is now standard:

**Slide 1: Title**
Company name, tagline, your name, contact info. Make the tagline memorable.

**Slide 2: Problem**
What problem are you solving? Make it specific, relatable, and urgent. Use a customer story if possible.

**Slide 3: Solution**
How does your product solve the problem? Keep it simple. Demo or screenshots if available.

**Slide 4: Market Size**
TAM (Total Addressable Market), SAM (Serviceable Addressable Market), SOM (Serviceable Obtainable Market). Bottom-up analysis is more credible than top-down.

**Slide 5: Business Model**
How do you make money? Revenue model, pricing, unit economics.

**Slide 6: Traction**
What evidence do you have? Revenue, users, growth rate, partnerships, waitlist. This is the most important slide for post-seed companies.

**Slide 7: Competition**
Competitive landscape. Do NOT say "we have no competitors." Show how you are differentiated.

**Slide 8: Team**
Who are the founders? What makes this team uniquely qualified? Relevant experience, domain expertise.

**Slide 9: Financials**
3-year projection showing revenue, key expenses, and path to profitability. Investors know these are estimates -- they want to see your thinking.

**Slide 10: The Ask**
How much are you raising? What will you use it for? What milestones will you hit?

### Design Principles

- **One idea per slide**: Do not overload slides with text
- **Visuals over text**: Charts, screenshots, and images communicate faster
- **10 words or fewer per bullet**: If the audience is reading, they are not listening
- **Consistent design**: Professional, clean, consistent branding
- **Tell a story**: The deck should flow as a narrative, not a data dump

### Common Pitch Mistakes

1. **Too much text**: Slides are visual aids, not documents
2. **No clear ask**: Investors need to know what you want
3. **Unrealistic projections**: "We'll capture 1% of a trillion-dollar market" is a red flag
4. **Ignoring competition**: Shows naivety
5. **No traction**: For post-seed, showing zero traction is disqualifying
6. **Weak team slide**: Investors bet on people first

### Delivering the Pitch

- **Practice relentlessly**: 50+ rehearsals minimum
- **Keep it under 15 minutes**: Leave time for Q&A
- **Start with the problem**: Hook the audience with a compelling problem statement
- **Show passion**: Investors invest in founders who are genuinely obsessed with the problem
- **Handle Q&A gracefully**: "I don't know, but I'll find out" is better than making something up

### Key Takeaway

The pitch deck is a communication tool, not a document. Its purpose is to generate enough interest for a follow-up meeting, not to close the deal. Clarity, conciseness, and compelling storytelling matter more than comprehensive detail.

**Sources**: Kawasaki, G. (2015). *The Art of the Start 2.0*. Portfolio/Penguin. Eisenmann, T. (2021). *Why Startups Fail*. Currency. HBS Online, "Entrepreneurship Essentials" and "Launching Tech Ventures" courses.`,
    },
    {
      id: "ent-term-sheets",
      slug: "term-sheets-cap-tables",
      title: "Term Sheets & Cap Tables",
      content: `## Term Sheets & Cap Tables

The term sheet is the most consequential legal document in a startup's life. It defines the economic and governance terms of an investment. Harvard Business School's venture finance courses teach that **understanding term sheets is essential for founders** -- ignorance leads to unfavorable terms that can haunt you for the life of the company.

### Key Term Sheet Components

**Economic Terms** (who gets what money):

**Valuation**: Pre-money valuation + investment amount = post-money valuation.
- Pre-money \\$8M + \\$2M investment = \\$10M post-money
- Investor owns \\$2M/\\$10M = 20%

**Liquidation Preference**: In an exit (sale or IPO), preferred shareholders (investors) get paid before common shareholders (founders and employees). "1x non-participating" means investors get their money back first. "1x participating" means they get their money back AND share in remaining proceeds -- far less founder-friendly.

**Anti-Dilution Protection**: Protects investors if the company raises a future round at a lower valuation ("down round"). "Weighted average" is standard and fair. "Full ratchet" is aggressive and unfriendly to founders.

**Option Pool**: Investors typically require a 10-20% option pool for future employee hiring, created BEFORE the investment (diluting only existing shareholders).

**Governance Terms** (who makes decisions):

**Board Composition**: Who sits on the board? Typical seed: 3 seats (2 founders, 1 investor). Series A: 5 seats (2 founders, 2 investors, 1 independent).

**Protective Provisions**: Actions requiring investor approval (selling the company, raising more debt, changing the charter). Standard provisions are reasonable; excessive provisions give investors too much control.

**Drag-Along Rights**: If a majority of shareholders approve a sale, all shareholders must participate. Prevents minority shareholders from blocking a deal.

### Understanding Cap Tables

A **capitalization table** (cap table) tracks who owns what percentage of the company. It evolves with each funding round.

Simple example after a seed round:

| Shareholder | Shares | Ownership |
|-------------|--------|----------|
| Founder A | 4,000,000 | 40% |
| Founder B | 3,000,000 | 30% |
| Seed Investor | 2,000,000 | 20% |
| Option Pool | 1,000,000 | 10% |
| **Total** | **10,000,000** | **100%** |

With each subsequent round, existing shareholders are diluted as new shares are issued.

### Cap Table Calculator (Python)

This simple calculator demonstrates dilution across funding rounds:

\`\`\`python
# Cap Table Dilution Calculator
def calculate_dilution(pre_money_val, investment, existing_shares):
    post_money_val = pre_money_val + investment
    price_per_share = pre_money_val / existing_shares
    new_shares = investment / price_per_share
    total_shares = existing_shares + new_shares
    investor_pct = (new_shares / total_shares) * 100
    founder_pct = (existing_shares / total_shares) * 100
    return {
        "post_money": post_money_val,
        "new_shares": new_shares,
        "investor_pct": round(investor_pct, 1),
        "existing_pct": round(founder_pct, 1)
    }

# Example: Seed Round
result = calculate_dilution(
    pre_money_val=8_000_000,
    investment=2_000_000,
    existing_shares=8_000_000
)
print(f"Post-money: \\$\${result['post_money']:,}")
print(f"Investor owns: \${result['investor_pct']}%")
print(f"Existing shareholders own: \${result['existing_pct']}%")
\`\`\`

### Key Terms Founders Should Negotiate

1. **Valuation**: Higher is better for founders but be realistic
2. **Liquidation preference**: Push for 1x non-participating
3. **Anti-dilution**: Push for broad-based weighted average
4. **Board composition**: Maintain founder control as long as possible
5. **Vesting**: Standard 4-year vesting with 1-year cliff for founders
6. **Founder-friendly terms**: No-shop period (short), information rights (reasonable)

### Key Takeaway

Term sheets are not just legal documents -- they define the power dynamics between founders and investors for the life of the company. Founders must understand every term and negotiate thoughtfully. Never sign a term sheet without legal counsel experienced in venture financing.

**Sources**: Feld, B. & Mendelson, J. (2019). *Venture Deals*. Wiley. Kupor, S. (2019). *Secrets of Sand Hill Road*. HBS Online, "Entrepreneurship Essentials" course.`,
      starterCode: `# Cap Table Dilution Calculator
# Calculate how funding rounds dilute existing shareholders

def calculate_round(pre_money_val, investment, existing_shares):
    """Calculate ownership after a funding round."""
    post_money_val = pre_money_val + investment
    price_per_share = pre_money_val / existing_shares
    new_shares = investment / price_per_share
    total_shares = existing_shares + new_shares
    investor_pct = (new_shares / total_shares) * 100
    existing_pct = (existing_shares / total_shares) * 100
    return {
        "post_money": post_money_val,
        "price_per_share": price_per_share,
        "new_shares": int(new_shares),
        "total_shares": int(total_shares),
        "investor_pct": round(investor_pct, 1),
        "existing_pct": round(existing_pct, 1)
    }

# TODO: Model a multi-round cap table
# Seed: $8M pre-money, $2M investment
# Series A: $30M pre-money, $10M investment
# Show founder dilution after each round

# Start with 8,000,000 shares (founders + option pool)
existing_shares = 8_000_000

# Seed Round
print("=== SEED ROUND ===")
seed = calculate_round(8_000_000, 2_000_000, existing_shares)
print(f"Post-money valuation: \${seed['post_money']:,}")
print(f"Investor ownership: {seed['investor_pct']}%")
print(f"Existing shareholders: {seed['existing_pct']}%")

# TODO: Calculate Series A using seed['total_shares']
# TODO: Print cumulative founder dilution`,
      solutionCode: `# Cap Table Dilution Calculator
def calculate_round(pre_money_val, investment, existing_shares):
    """Calculate ownership after a funding round."""
    post_money_val = pre_money_val + investment
    price_per_share = pre_money_val / existing_shares
    new_shares = investment / price_per_share
    total_shares = existing_shares + new_shares
    investor_pct = (new_shares / total_shares) * 100
    existing_pct = (existing_shares / total_shares) * 100
    return {
        "post_money": post_money_val,
        "price_per_share": price_per_share,
        "new_shares": int(new_shares),
        "total_shares": int(total_shares),
        "investor_pct": round(investor_pct, 1),
        "existing_pct": round(existing_pct, 1)
    }

existing_shares = 8_000_000

# Seed Round
print("=== SEED ROUND ===")
seed = calculate_round(8_000_000, 2_000_000, existing_shares)
print(f"Post-money valuation: \${seed['post_money']:,}")
print(f"Price per share: \${seed['price_per_share']:.2f}")
print(f"New shares issued: {seed['new_shares']:,}")
print(f"Seed investor ownership: {seed['investor_pct']}%")
print(f"Existing shareholders: {seed['existing_pct']}%")

# Series A Round
print("\\n=== SERIES A ROUND ===")
series_a = calculate_round(30_000_000, 10_000_000, seed['total_shares'])
print(f"Post-money valuation: \${series_a['post_money']:,}")
print(f"Price per share: \${series_a['price_per_share']:.2f}")
print(f"New shares issued: {series_a['new_shares']:,}")
print(f"Series A investor ownership: {series_a['investor_pct']}%")
print(f"All previous shareholders: {series_a['existing_pct']}%")

# Cumulative dilution
original_founder_pct = (existing_shares / series_a['total_shares']) * 100
print(f"\\n=== CUMULATIVE FOUNDER DILUTION ===")
print(f"Founders started with: 100%")
print(f"After Seed: {seed['existing_pct']}%")
print(f"After Series A: {round(original_founder_pct, 1)}%")
print(f"Total dilution: {round(100 - original_founder_pct, 1)}%")`,
    },
  ],
};

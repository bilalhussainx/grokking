import { Module } from "../types";

export const exitModule: Module = {
  id: "ent-exit",
  title: "Exit Strategies",
  description: "Understand IPOs, acquisitions, SPACs, secondary sales, and life after exit.",
  lessons: [
    {
      id: "ent-ipo",
      slug: "ipo-process",
      title: "IPO Process",
      content: `## IPO Process

An Initial Public Offering (IPO) is the process of offering shares of a private company to the public on a stock exchange for the first time. HBS case studies on Google, Facebook, Airbnb, and other high-profile IPOs provide insights into how this complex process works.

### Why Go Public?

**1. Access to capital**: Public markets provide access to much larger pools of capital than private markets.
**2. Liquidity for shareholders**: Founders, employees, and early investors can sell shares.
**3. Currency for acquisitions**: Public stock can be used to acquire other companies.
**4. Brand credibility**: Being publicly traded signals stability and legitimacy.
**5. Employee retention**: Public stock options are easier to value and sell.

### The IPO Process

**Phase 1: Preparation (12-18 months before)**
- Strengthen financial reporting and auditing
- Build an experienced management team and board
- Clean up corporate governance
- Hire legal counsel and auditors experienced in IPOs

**Phase 2: Select Underwriters (6-9 months before)**
Choose investment banks to manage the IPO. Lead underwriter(s) advise on timing, pricing, and marketing. Goldman Sachs, Morgan Stanley, and JP Morgan are frequent lead underwriters for tech IPOs.

**Phase 3: SEC Filing (3-4 months before)**
File an S-1 registration statement with the SEC. This document includes: business description, financial statements, risk factors, management discussion, and use of proceeds. The S-1 is public -- competitors, customers, and media will read it.

**Phase 4: Roadshow (2-3 weeks before)**
Management team presents to institutional investors (pension funds, mutual funds, hedge funds) in a series of meetings across major financial centers. The goal: generate demand and establish a price range.

**Phase 5: Pricing and Trading**
The night before the first day of trading, the company and underwriters agree on the final IPO price. The next morning, trading begins on the stock exchange.

### IPO Considerations

**The "IPO pop"**: When a stock opens significantly above its IPO price, it means the company left money on the table (underpriced). While a pop is celebrated in media, it means early shareholders received less value.

**Lock-up period**: Insiders (founders, employees, early investors) are typically restricted from selling shares for 90-180 days after the IPO.

**Public company obligations**: Quarterly earnings reports, SEC filings, Sarbanes-Oxley compliance, shareholder activism, short-selling, and intense media scrutiny.

### Key Takeaway

An IPO is not the finish line -- it is a transition to a new phase of the company's life with different rules, pressures, and opportunities. The preparation required is substantial, and the decision to go public should be driven by strategic logic, not ego.

**Sources**: Lerner, J. & Nanda, R. (2020). *Venture Capital and the Finance of Innovation*. Wiley. HBS case studies on Google, Airbnb, and Snowflake IPOs.`,
    },
    {
      id: "ent-acquisition-exit",
      slug: "acquisition-as-exit",
      title: "Acquisition as an Exit",
      content: `## Acquisition as an Exit

Most successful startup exits are acquisitions, not IPOs. Of the roughly 5,000 startups that exit successfully each year in the US, **over 90% are acquired** rather than going public. HBS research examines when acquisition is the right exit and how to maximize value.

### Types of Acquisitions

**Strategic Acquisition**: A larger company acquires a startup for strategic reasons -- technology, talent, market position, or competitive defense. Examples: Facebook acquiring Instagram (\\$1B), Google acquiring YouTube (\\$1.65B), Microsoft acquiring LinkedIn (\\$26.2B).

**Acqui-hire**: The acquisition is primarily for the talent, not the product. Common in tech when a startup's team is more valuable than its business. Typical price: \\$1-5M per engineer.

**Private Equity Acquisition**: A PE firm acquires a profitable, mature startup to optimize and eventually resell. Common for bootstrapped businesses with strong cash flow.

### When to Sell

| Consider Selling When | Consider Not Selling When |
|----------------------|-------------------------|
| Offer is 10x+ what you could build independently | Company is growing rapidly with strong unit economics |
| Market is peaking or declining | Market opportunity is expanding |
| Founder is burned out | Founder is energized and has a clear vision |
| Acquirer can dramatically accelerate growth | Independence provides strategic advantage |
| Risk of competitive disruption is high | Competitive position is strengthening |

### The Acquisition Process

1. **Initial interest**: Acquirer reaches out (or you engage a banker)
2. **NDA and information sharing**: Preliminary due diligence
3. **Letter of Intent (LOI)**: Non-binding offer with key terms
4. **Due diligence**: Deep dive into financials, legal, technology, team
5. **Definitive agreement**: Binding contract with all terms
6. **Regulatory approval**: Antitrust review if applicable
7. **Closing**: Transfer of ownership and funds

### Maximizing Acquisition Value

- Build optionality: Having multiple interested acquirers creates competitive tension
- Maintain clean financials and legal records (messy due diligence kills deals)
- Understand the acquirer's strategic motivation (price to their value, not your cost)
- Negotiate retention terms carefully (earnouts, vesting, role post-acquisition)

### Key Takeaway

Acquisition is the most common exit path and can be highly rewarding for founders, employees, and investors. The key is understanding when to sell, negotiating from a position of strength, and ensuring the terms serve all stakeholders.

**Sources**: Wasserstein, B. (2001). *Big Deal: Mergers and Acquisitions in the Digital Age*. Warner Books. HBS case studies on tech acquisitions.`,
    },
    {
      id: "ent-spac-direct",
      slug: "spac-and-direct-listings",
      title: "SPAC & Direct Listings",
      content: `## SPAC & Direct Listings

The traditional IPO process has been challenged by two alternative paths to the public markets: **SPACs (Special Purpose Acquisition Companies)** and **Direct Listings**. Both offer different trade-offs and have been studied extensively in HBS finance courses.

### Direct Listings

In a direct listing, a company's existing shares are listed on a stock exchange without issuing new shares or using underwriters. Spotify (2018) and Slack (2019) pioneered this approach.

**Advantages**: No underwriter fees (saving 3-7% of the raise), no dilution from new shares, no lock-up period (insiders can sell immediately), market-driven price discovery.

**Disadvantages**: No new capital raised (unless modified), less support for price stabilization, requires an already well-known brand, no "greenshoe" option for underwriters to support the stock.

**Best for**: Well-known companies that do not need to raise new capital and want to provide liquidity to existing shareholders.

### SPACs (Special Purpose Acquisition Companies)

A SPAC is a publicly traded "blank check" company formed solely to acquire a private company, effectively taking it public without a traditional IPO.

**How it works**: A SPAC raises money through its own IPO, then has 18-24 months to find and acquire a private company. When the acquisition (called a "de-SPAC") is complete, the private company becomes public.

**Advantages**: Faster than traditional IPO (3-6 months vs. 12-18), more certain pricing (negotiated, not market-driven), allows forward-looking projections (banned in traditional IPOs), access to SPAC sponsor expertise.

**Disadvantages**: Dilution from SPAC sponsor shares (typically 20%), potential misalignment of incentives (sponsor profits even if the company underperforms), regulatory scrutiny has increased significantly since the 2020-2021 boom.

**The SPAC Boom and Bust**: In 2020-2021, SPACs surged in popularity, with 600+ SPACs raising \\$160B+. Many de-SPAC'd companies subsequently lost 50-80% of their value, leading to regulatory crackdowns and investor skepticism.

### Comparing the Three Paths

| Dimension | Traditional IPO | Direct Listing | SPAC |
|-----------|----------------|---------------|------|
| New capital raised | Yes | No (typically) | Yes |
| Underwriter fees | 3-7% | None | Sponsor takes ~20% |
| Timeline | 12-18 months | 6-12 months | 3-6 months |
| Price certainty | Low (market-driven) | Low (market-driven) | High (negotiated) |
| Lock-up period | 90-180 days | None | Varies |
| Best for | Growth companies needing capital | Established brands wanting liquidity | Companies wanting speed and certainty |

### Key Takeaway

The path to public markets is no longer one-size-fits-all. Each option has distinct trade-offs in terms of cost, speed, certainty, and dilution. The right choice depends on the company's specific circumstances, capital needs, and market conditions.

**Sources**: HBS case studies on Spotify Direct Listing and DraftKings SPAC. Klausner, M., Ohlrogge, M., & Ruan, E. (2022). "A Sober Look at SPACs." *Stanford Law and Economics*. SEC regulatory guidance on SPACs.`,
    },
    {
      id: "ent-secondary-sales",
      slug: "secondary-sales",
      title: "Secondary Sales",
      content: `## Secondary Sales

Secondary sales allow shareholders in private companies -- founders, employees, and early investors -- to sell their shares to other private investors before an IPO or acquisition. This market has grown dramatically, with platforms like Forge, EquityZen, and Carta facilitating billions in transactions annually.

### Why Secondary Sales Matter

The average time from startup founding to IPO has increased from 4 years (1999) to 11+ years (2024). This means founders and early employees may hold illiquid equity for over a decade. Secondary sales provide **partial liquidity** without requiring a full exit event.

### Types of Secondary Transactions

**1. Company-Sponsored Tender Offers**: The company facilitates a structured transaction, often at a set price, allowing employees and early investors to sell some shares to new investors. Companies like Stripe, SpaceX, and Databricks have conducted large tender offers.

**2. Direct Secondary Sales**: Individual shareholders sell directly to private buyers (often institutional investors or secondary funds). May require company approval and right of first refusal.

**3. Secondary Funds**: Dedicated investment funds that buy shares in private companies from existing shareholders. These funds specialize in late-stage private companies likely to IPO.

### Benefits and Risks

| Benefits | Risks |
|----------|-------|
| Liquidity for long-tenured employees | May signal lack of confidence to other investors |
| Reduces financial pressure on founders | Pricing may be at a discount to last round |
| Attracts and retains talent (visible liquidity path) | Tax implications can be complex |
| Aligns interests (employees can diversify) | Company approval may be required |

### Key Takeaway

Secondary sales have become an important part of the startup ecosystem, providing liquidity in an era of delayed IPOs. For founders and employees, they offer a way to de-risk personal finances without forcing a premature exit.

**Sources**: HBS case studies on secondary markets. Forge Global, "State of the Private Markets" reports. Kupor, S. (2019). *Secrets of Sand Hill Road*.`,
    },
    {
      id: "ent-life-after-exit",
      slug: "life-after-exit",
      title: "Life After Exit",
      content: `## Life After Exit

What happens after the exit -- whether IPO, acquisition, or company sale -- is a topic rarely discussed but deeply important. HBS research and founder interviews reveal that **post-exit life is often more challenging emotionally than the startup journey itself.**

### The Post-Exit Emotional Roller Coaster

Founders who achieve successful exits often experience:

**1. Initial euphoria**: The validation, the financial windfall, the relief.

**2. Identity crisis**: "If I'm not the CEO of [company], who am I?" Founders who spent 5-10 years building something suddenly lose their primary identity, purpose, and community.

**3. Purposelessness**: The structure, urgency, and mission that defined daily life disappear. Many founders describe a profound sense of "now what?"

**4. Guilt**: Survivor's guilt about success, especially if early employees or co-founders did not benefit equally.

**5. Relationship strain**: The dynamics with family, friends, and former colleagues shift when significant wealth enters the picture.

### Post-Exit Paths

**Serial Entrepreneurship**: Many founders start new companies. Serial entrepreneurs have significantly higher success rates (30% vs. 18% for first-timers) because they carry hard-won wisdom about team building, fundraising, and market timing.

**Angel Investing / VC**: Using capital and experience to back the next generation of founders. Many prominent VCs (Marc Andreessen, Peter Thiel, Reid Hoffman) are former founders.

**Advisory / Board Roles**: Sharing expertise without the full-time commitment of founding. Many post-exit founders sit on 2-5 boards.

**Philanthropy**: Applying entrepreneurial thinking to social problems. The Giving Pledge, founded by Warren Buffett and Bill Gates, has attracted many tech founders.

**Education and Writing**: Teaching at business schools, writing books, creating content. Many HBS case protagonists become HBS lecturers.

**Taking Time Off**: The least common but perhaps most valuable choice. After years of all-consuming work, rest and reflection enable founders to make better decisions about what comes next.

### Financial Considerations

Post-exit financial management requires different skills than startup finance:
- **Diversification**: Concentrated wealth in one stock is risky. Financial advisors recommend diversifying over 1-3 years.
- **Tax planning**: Capital gains, estate planning, and charitable giving require expert guidance.
- **Lifestyle inflation**: The most common financial mistake is lifestyle inflation that creates ongoing obligations.

### Clayton Christensen's Final Lecture

Clayton Christensen's famous final HBS lecture, published as *How Will You Measure Your Life?* (2012), asks three questions that are particularly relevant post-exit:

1. How can I be sure I will be happy in my career?
2. How can I be sure my relationships with my family and close friends become an enduring source of happiness?
3. How can I be sure I will stay out of jail? (How can I live with integrity?)

Christensen argued that the resource allocation principles that drive business success also apply to personal life. The danger post-exit is over-investing in visible activities (new ventures, investments) and under-investing in invisible ones (family, health, relationships).

### Key Takeaway

A successful exit is a beginning, not an ending. The founders who thrive post-exit are those who thoughtfully consider their identity, purpose, relationships, and financial stewardship -- applying the same intentionality to personal life that they applied to building their company.

**Sources**: Christensen, C. M. (2012). *How Will You Measure Your Life?* HBS Press. Wasserman, N. (2012). *The Founder's Dilemmas*. Horowitz, B. (2014). *The Hard Thing About Hard Things*. HarperBusiness.`,
    },
  ],
};

import { Module } from "../types";

export const module3: Module = {
  id: "link-building-offpage",
  title: "Link Building & Off-Page SEO",
  description: "Domain authority, backlink quality metrics, proven link acquisition strategies, digital PR, competitor backlink analysis, and what Google's algorithm actually rewards",
  lessons: [
    {
      id: "link-building-offpage",
      slug: "link-building-offpage",
      title: "Link Building & Off-Page SEO",
      content: `# Link Building & Off-Page SEO

Links are votes. Google's PageRank algorithm — the foundation of search — ranks pages by the quality and quantity of links pointing to them. Off-page SEO is earning links that signal authority.

---

\`\`\`concept
{
  "title": "Why Links Still Matter (And Always Will)",
  "variant": "mental-model",
  "content": "Google has tested thousands of ranking signals. Links remain one of the top three because they're hard to fake at scale. A link from The New York Times to your site is a genuine editorial signal that another human considered your content worth citing. Google's challenge is distinguishing real links from bought or manipulated ones. The key insight: links you'd earn even if Google didn't exist — because your content is genuinely useful — are the safest and strongest. Build content and relationships that earn those links."
}
\`\`\`

---

## Understanding Link Quality

\`\`\`
Not all links are equal. Key quality signals:

--- Domain Authority (DA) / Domain Rating (DR) ---
• Moz's DA: 0-100 logarithmic scale
• Ahrefs' DR: 0-100, based on linking root domains
• A link from DR 80 site = worth more than 100 links from DR 20 sites

--- Link relevance ---
A cooking blog linking to your recipe tool > a car blog linking to your recipe tool
Topical relevance matters — Google understands site themes

--- Link placement ---
In-content editorial link = strongest (within article body)
Sidebar link = weak (site-wide, less trust)
Footer link = weakest / often ignored
Author bio link = moderate

--- Anchor text ---
Exact match: "best CRM software" → powerful but risky (looks unnatural)
Partial match: "CRM software for startups" → safer
Branded: "Salesforce" → natural, safe
Generic: "click here" → weak signal but looks natural
Mix of all types = natural link profile

--- Nofollow vs Dofollow ---
Dofollow: passes PageRank (what you want)
Nofollow: no PageRank passed (but still some value for traffic + brand)
UGC / Sponsored: Google attributes for user content and paid links
\`\`\`

## Link Building Strategies

\`\`\`
--- 1. Content-driven link earning (Linkable Assets) ---
Create content so good that people naturally cite it:
• Original research (surveys, studies with data) — journalists love citing data
• Comprehensive guides (10,000+ word ultimate guides)
• Free tools (calculators, generators, checkers)
• Infographics with unique data visualizations
• Industry reports (survey 500 people in your industry → report)

--- 2. Digital PR ---
• Create a newsworthy angle about your industry
• Write a press release with data, quotes, and expert perspective
• Pitch to journalists at relevant publications
• Tools: HARO (Help a Reporter Out) — free — journalists request expert sources
• Respond to HARO queries → get quoted → earn high-DA links

--- 3. Resource page link building ---
• Find pages: "best [topic] tools" or "[industry] resources"
• Google: [topic] "useful resources" OR "recommended tools"
• Email the site owner: "I noticed you list X — we have Y which [benefit],
  would you consider adding it?"
• Success rate: 5-15% response rate, highly targeted

--- 4. Broken link building ---
1. Find pages in your niche with broken outbound links
2. Ahrefs → Site Explorer → any competitor → Broken Links
3. Find YOUR existing content that matches the broken link's topic
4. Email the webmaster: "Hey, link on your [page] to [dead URL] is broken.
   I have an updated resource on that topic: [your URL]"

--- 5. Skyscraper technique ---
1. Find content with many backlinks (Ahrefs → Content Explorer)
2. Create a substantially better version (more data, updated, visual)
3. Reach out to sites linking to the original: "Here's an updated version"
\`\`\`

## Competitor Backlink Analysis

\`\`\`
Tools: Ahrefs, Semrush, Moz Link Explorer

--- Reverse-engineer competitors ---
1. Enter competitor URL in Ahrefs Site Explorer
2. Go to Backlinks → filter: DoFollow, DR > 30
3. Sort by DR (highest first)
4. Look for patterns: What type of sites link to them?
   Trade publications? Blogs? Tools directories? News sites?
5. Those same sites are your targets

--- Find link gaps (pages you're missing) ---
Ahrefs → Link Intersect tool:
Enter 3 competitors → see sites that link to ALL of them but not you
These are your highest-priority outreach targets

--- Monitor your own links ---
Ahrefs → Alerts → New backlinks → email when you earn new links
Ahrefs → Alerts → Lost backlinks → email when links disappear

--- Disavow toxic links ---
If you have spammy links pointing to you:
1. Ahrefs → Backlinks → filter by spam score
2. Export suspect links
3. Upload disavow file to Google Search Console
   Format: domain:spamsite.com (disavow entire domain)
   Use sparingly — Google is good at ignoring spam already
\`\`\`

## Local SEO & Google Business Profile

\`\`\`
For local businesses: proximity, relevance, and prominence

--- Google Business Profile (GBP) optimization ---
• Complete every field: hours, services, description, photos
• Add at least 10 photos (interior, exterior, products, team)
• Post weekly: promotions, events, new products
• Respond to ALL reviews (positive and negative) within 24 hours
• Add FAQ section using customer questions

--- Local link building ---
• Local chamber of commerce → easy local link
• Sponsor local events → link from event page
• Partner with complementary local businesses
• Get listed in local directories: Yelp, TripAdvisor, industry-specific

--- NAP consistency ---
Name, Address, Phone must be IDENTICAL everywhere:
Website, GBP, Yelp, Yellow Pages, Facebook
Any discrepancy confuses Google's entity understanding
\`\`\`

\`\`\`takeaways
["Links from relevant, high-authority sites in your industry outweigh dozens of links from low-DR sites.", "HARO (Help a Reporter Out) is free — respond to journalist queries and earn links from major publications.", "Broken link building has high conversion rates — you're helping the webmaster while earning a link.", "Content-driven link earning compounds: one great study can earn links passively for years.", "Anchor text diversity is natural — mix branded, partial match, and generic anchors.", "Disavow rarely — Google ignores most spam. Only disavow if you manually built links that violate guidelines."]
\`\`\`
`,
    },
  ],
};

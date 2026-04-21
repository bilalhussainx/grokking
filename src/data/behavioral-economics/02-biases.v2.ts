import { Module } from "../types";

export const biasesModule: Module = {
  id: "be-biases",
  title: "Cognitive Biases",
  description: "Examine the most important cognitive biases that shape economic decisions — anchoring, availability, confirmation bias, loss aversion, and overconfidence.",
  lessons: [
    {
      id: "be-bias-anchoring",
      slug: "anchoring",
      title: "Anchoring",
      content: `## Anchoring

**Anchoring** is the tendency for people to rely too heavily on the first piece of information they encounter (the "anchor") when making decisions. Even when the anchor is completely irrelevant, it systematically pulls judgments toward it. Anchoring is one of the most robust and well-documented cognitive biases, affecting experts and novices alike.

### The Classic Experiment

Tversky and Kahneman (1974) asked participants to estimate the percentage of African countries in the United Nations. Before answering, participants watched a wheel of fortune land on either 10 or 65. They were asked whether the answer was higher or lower than the number on the wheel, then asked for their actual estimate.

Results: Those who saw the wheel land on 10 estimated 25%. Those who saw 65 estimated 45%. A completely random number shifted estimates by 20 percentage points.

### How Anchoring Works

Two mechanisms explain anchoring:

**1. Anchoring and insufficient adjustment:** People start from the anchor and adjust toward their answer, but the adjustment is typically **insufficient**. They stop adjusting too soon because they lack motivation or cognitive resources to adjust further.

**2. Selective accessibility:** The anchor activates information consistent with it in memory. When you hear "\\$50,000" before evaluating a car, your mind retrieves information about cars in that range, making the anchor-consistent value seem more plausible.

### Anchoring in the Real World

**Real estate:** Listing prices anchor buyer expectations. Northcraft and Neale (1987) had real estate agents estimate the value of a house after seeing different listing prices. Despite being experts, agents' valuations were significantly influenced by the listing price — higher listings produced higher appraisals.

**Salary negotiation:** The first number mentioned in a salary negotiation becomes the anchor. Research consistently shows that making the first offer (setting the anchor) leads to better outcomes — as long as the anchor is within a reasonable range. A job candidate who asks for \\$95,000 will typically negotiate a higher salary than one who asks for \\$75,000.

**Retail pricing:** "Was \\$199, now \\$99" works because \\$199 anchors the perceived value. Even if the item was never really sold at \\$199, the anchor makes \\$99 feel like a bargain. Luxury retailers use Manufacturer's Suggested Retail Price (MSRP) as an anchor to make their "discounted" price seem attractive.

**Sentencing:** Englich, Mussweiler, and Strack (2006) found that German judges were influenced by the sentencing demands of prosecutors — even when those demands were determined by rolling dice. Judges who "rolled" a high number gave longer sentences.

**Charitable giving:** Donation forms that suggest amounts (\\$25, \\$50, \\$100, \\$250) anchor giving. Higher suggested amounts lead to higher donations. Simply changing the lowest suggested amount from \\$20 to \\$50 increases average donations significantly.

### Why Experts Are Not Immune

One of the most striking findings about anchoring is that **expertise does not protect against it**. Real estate agents, judges, doctors, and financial analysts are all susceptible. Experts are often more confident in their biased judgments, which can make the problem worse.

The reason: anchoring operates partly through System 1 (automatic, preconscious processing). By the time System 2 (deliberate reasoning) engages, the anchor has already shaped the mental landscape. Even knowing about anchoring does not eliminate its effect — though awareness can help you seek additional information and explicitly counter-adjust.

### Using Anchoring Strategically

Understanding anchoring gives you tools for both offense and defense:

**In negotiation:**
- Make the first offer when you have information about the range
- Set an ambitious but justifiable anchor
- If the other party anchors first, explicitly reject the anchor before making a counter-offer

**In decision-making:**
- Be aware that initial information disproportionately influences your judgment
- Seek multiple independent estimates before forming an opinion
- Consider the opposite: actively generate reasons why the anchor might be wrong

**In marketing and pricing:**
- Use price anchoring strategically (show the premium option first)
- Display the "before" price prominently
- Use round numbers for anchors in negotiation (they are perceived as more deliberate)

### Debiasing Anchoring

Complete debiasing is difficult, but several strategies help:
- **Consider the opposite:** Actively generate arguments against the anchor
- **Generate your own anchor:** Before seeing external information, form an independent estimate
- **Use multiple reference points:** Seek several data points rather than relying on one
- **Accountability:** Knowing you will need to justify your decision to others increases adjustment effort

### Key Takeaway

Anchoring is pervasive, powerful, and resistant to expertise. Any number, even a random one, can influence subsequent judgments. In negotiations, pricing, and everyday decisions, being aware of anchoring — and strategically using or countering it — is one of the most practical applications of behavioral economics.

> "People make estimates by starting from an initial value that is adjusted to yield the final answer. Adjustments are typically insufficient." — Tversky & Kahneman

*Resources: Tversky & Kahneman, "Judgment Under Uncertainty" (1974); Ariely, Predictably Irrational; Epley & Gilovich, "The Anchoring-and-Adjustment Heuristic" (2006).*`,
    },
    {
      id: "be-bias-availability",
      slug: "availability-heuristic",
      title: "Availability Heuristic",
      content: `## Availability Heuristic

The **availability heuristic** is the tendency to judge the frequency or probability of events based on how easily examples come to mind. Events that are vivid, recent, or emotionally charged are more "available" in memory and are therefore judged as more common — regardless of their actual frequency.

### The Mechanism

When you are asked "How common are shark attacks?" your brain does not consult a statistical database. Instead, System 1 searches for examples. If shark attack stories come to mind easily (because of recent news coverage or a Jaws rewatch), you judge them as common. If examples are hard to recall, you judge them as rare.

This works reasonably well in many situations — things that happen frequently are easier to recall. But the heuristic fails when ease of recall is driven by factors other than actual frequency: media coverage, vividness, emotional impact, or personal experience.

### Classic Demonstrations

**Tversky and Kahneman (1973):** Participants were asked whether the letter "K" is more likely to appear as the first letter of a word or the third letter. Most said first letter — because words beginning with K (kitchen, kite, king) are easier to retrieve from memory than words with K as the third letter (ask, ink, acknowledge). In reality, K appears as the third letter about three times as often.

**Risk perception:** People consistently overestimate the frequency of dramatic causes of death and underestimate mundane ones:

| Cause of Death | Perceived Rank | Actual Rank |
|---------------|---------------|-------------|
| Tornadoes | High | Much lower |
| Shark attacks | High | Extremely low |
| Plane crashes | High | Much lower |
| Heart disease | Moderate | #1 cause of death |
| Diabetes | Low | Top 10 cause of death |
| Stroke | Moderate | Top 5 cause of death |

The dramatic, newsworthy causes are overestimated; the slow, undramatic killers are underestimated.

### Media Amplification

The availability heuristic explains why media coverage distorts risk perception. Media covers unusual, dramatic, and emotionally compelling events. This makes those events highly "available" in memory, leading people to overestimate their frequency:

- After extensive coverage of a plane crash, fear of flying spikes — even though driving to the airport is far more dangerous
- School shootings receive enormous coverage, leading to inflated perceptions of risk — though the probability of any specific child being involved is extremely low
- Terrorist attacks dominate news cycles, making terrorism feel like a major risk — while car accidents (which kill 40,000 Americans per year vs. fewer than 100 from terrorism) receive minimal coverage

### Availability in Financial Markets

The availability heuristic has profound effects on investor behavior:

**Recency bias:** Recent market events dominate investor thinking. After a crash, investors become excessively risk-averse (2009). After a bull run, they become excessively optimistic (1999, 2021). They extrapolate recent experience as if it represents the full range of possibilities.

**Hot stocks:** Companies that are frequently in the news attract more investor attention and trading volume. This is not because they are better investments — it is because they are more "available" to investors scanning for opportunities.

**Narrative-driven investing:** Stories are more available than statistics. A compelling narrative about a company ("they are disrupting the industry!") influences investment decisions more than dry financial analysis, because narratives are vivid and memorable.

### Availability Cascade

Cass Sunstein described the **availability cascade** — a self-reinforcing cycle where media coverage of a risk makes it feel more dangerous, which generates more public concern, which generates more media coverage, which makes it feel even more dangerous. This can lead to:

- Regulatory overreaction to vivid but rare risks
- Neglect of common but unspectacular risks
- Public panics that are disproportionate to actual danger

The Alar apple scare (1989), Y2K panic, and various "stranger danger" panics follow this pattern.

### Debiasing Availability

To counter the availability heuristic:

- **Seek base rates:** When assessing risk, look up the actual statistics rather than relying on memory
- **Consider sample bias:** Ask "Am I hearing about this because it is common or because it is dramatic?"
- **Look for what is missing:** Availability makes us notice what is present, not what is absent. The flights that land safely do not make the news
- **Use checklists:** Structured decision processes reduce reliance on whatever happens to come to mind

### Key Takeaway

The availability heuristic is a powerful and pervasive bias: we judge events as likely based on how easily we recall examples, not on actual statistics. Media coverage, personal experience, and emotional intensity distort our perception of risk, leading to systematic misjudgments about what is actually dangerous and what is actually common.

> "People tend to assess the relative importance of issues by the ease with which they are retrieved from memory — and this is largely determined by the extent of coverage in the media." — Daniel Kahneman

*Resources: Tversky & Kahneman, "Availability: A Heuristic for Judging Frequency and Probability" (1973); Sunstein, "The Availability Heuristic" (2006).*`,
    },
    {
      id: "be-bias-confirmation",
      slug: "confirmation-bias",
      title: "Confirmation Bias",
      content: `## Confirmation Bias

**Confirmation bias** is the tendency to search for, interpret, favor, and recall information that confirms one's preexisting beliefs, while giving less attention to information that contradicts them. It is arguably the most pervasive and consequential of all cognitive biases, affecting everything from personal relationships to scientific research to political polarization.

### Three Forms of Confirmation Bias

**1. Biased information search:** People seek out information that supports what they already believe. A voter who supports a particular candidate reads favorable news sources and avoids critical ones. An investor who owns a stock actively looks for bullish analysis and dismisses bearish arguments.

**2. Biased interpretation:** Even when exposed to the same information, people interpret it in ways that support their existing beliefs. In a classic study, Lord, Ross, and Lepper (1979) showed supporters and opponents of capital punishment the same mixed evidence. Both sides reported that the evidence supported their preexisting view, and both left the experiment more extreme in their original position.

**3. Biased recall:** People remember information that confirms their beliefs more easily than information that contradicts them. After a stock market decline, bearish investors easily recall warning signs they "noticed" beforehand (hindsight bias combines with confirmation bias), while bullish investors struggle to recall those same signs.

### The Wason Selection Task

Peter Wason (1966) demonstrated confirmation bias with an elegant experiment. Participants were given the rule: "If a card has a vowel on one side, it has an even number on the other side." They were shown four cards: A, K, 4, 7. Which cards must you turn over to test the rule?

Most people correctly choose A (checking if a vowel has an even number) and 4 (confirmation: checking if an even number has a vowel). But the logically correct choices are A and 7. Turning over 7 could **falsify** the rule (if 7 has a vowel on the other side, the rule is broken). People naturally seek **confirmation** rather than **falsification**.

### Confirmation Bias in Major Domains

**Medicine:** Doctors often anchor on an initial diagnosis and seek confirming symptoms while downplaying contradictory evidence. A study in the American Journal of Medicine found that diagnostic errors — often driven by confirmation bias — affect approximately 12% of patients and contribute to 40,000-80,000 deaths per year in the US.

**Criminal justice:** Once police identify a suspect, they tend to seek evidence confirming guilt rather than exploring alternatives. This has contributed to wrongful convictions. The Innocence Project has found that cognitive bias (including confirmation bias) played a role in many of the 375+ exonerations achieved through DNA evidence.

**Business:** Entrepreneurs often suffer from confirmation bias about their business ideas. They interpret ambiguous customer feedback as validation, ignore warning signs, and surround themselves with supporters. This contributes to the high failure rate of startups.

**Science:** Despite the scientific method's emphasis on falsification, researchers are susceptible to confirmation bias. They may design studies that are likely to confirm their hypotheses, interpret ambiguous results favorably, and selectively report supportive findings (publication bias). The replication crisis in psychology and other fields is partly attributable to these tendencies.

**Politics and media:** Social media algorithms amplify confirmation bias by showing users content that aligns with their existing views. This creates **echo chambers** and **filter bubbles** where people are rarely exposed to challenging perspectives. The result is increasing political polarization and difficulty finding common ground.

### Why Confirmation Bias Exists

Evolutionary psychology offers several explanations:

- **Cognitive efficiency:** Testing every belief from scratch every day would be exhausting. Confirmation bias allows us to maintain a stable worldview without constantly re-evaluating everything
- **Social cohesion:** Agreeing with your in-group and maintaining consistent beliefs builds trust and social bonds
- **Motivated reasoning:** We are emotionally invested in our beliefs (political identity, professional reputation, self-image). Contradictory evidence threatens our identity, triggering defensive processing

### Debiasing Strategies

Confirmation bias is extremely difficult to overcome because it operates unconsciously. But several strategies help:

- **Consider the opposite:** Explicitly list reasons why your belief might be wrong. Studies show this simple exercise significantly reduces confirmation bias
- **Red teaming:** Assign someone the specific role of challenging the group's assumptions
- **Pre-mortems:** Before launching a project, imagine it has failed and generate reasons why. This forces consideration of negative evidence
- **Seek disconfirming evidence:** Make a deliberate habit of reading sources that challenge your views
- **Structured decision frameworks:** Use checklists and decision matrices that force consideration of all evidence, not just confirming evidence

### Key Takeaway

Confirmation bias is the tendency to seek, interpret, and remember information that confirms what we already believe. It affects everyone — including experts — and operates across all domains of life. Awareness is necessary but insufficient; active debiasing strategies are required to counteract this deeply ingrained tendency.

> "The human understanding when it has once adopted an opinion draws all things else to support and agree with it." — Francis Bacon (1620)

*Resources: Nickerson, "Confirmation Bias: A Ubiquitous Phenomenon" (1998); Lord, Ross & Lepper, "Biased Assimilation" (1979); Kahneman, Thinking, Fast and Slow.*`,
    },
    {
      id: "be-bias-loss-aversion",
      slug: "loss-aversion",
      title: "Loss Aversion",
      content: `## Loss Aversion

**Loss aversion** is the finding that losses are psychologically more painful than equivalent gains are pleasurable. Losing \\$100 hurts roughly twice as much as gaining \\$100 feels good. This asymmetry, first documented by Kahneman and Tversky as a central feature of Prospect Theory, has far-reaching implications for economics, finance, marketing, and everyday life.

### The Evidence

The standard estimate is that the **loss aversion coefficient** is approximately 2 — losses loom about twice as large as gains. This has been replicated across dozens of studies, cultures, and contexts.

**Coin flip experiment:** Would you accept a bet where a fair coin flip gives you \\$110 if heads but costs you \\$100 if tails? The expected value is positive (\\$5), but most people reject this bet. They need the potential gain to be at least \\$200 before they will risk losing \\$100. The pain of the potential \\$100 loss outweighs the pleasure of the potential \\$110 gain.

**Endowment effect:** Loss aversion is the primary explanation for the endowment effect — people value things more once they own them. Giving up a mug you own feels like a loss; paying for a mug you do not own is forgoing a gain. Since losses loom larger, sellers demand more than buyers will pay — for the exact same object.

### Loss Aversion in Financial Markets

Loss aversion profoundly affects investor behavior:

**The disposition effect:** Investors sell winning stocks too quickly (locking in a gain, which feels good) and hold losing stocks too long (refusing to realize a loss, which feels painful). This is exactly backwards from a tax-optimization perspective — you should harvest losses (for tax deductions) and let winners run.

Odean (1998) analyzed 10,000 brokerage accounts and found that investors were 50% more likely to sell a winning position than a losing one. The stocks they sold went on to outperform the stocks they held — meaning loss aversion made them worse off.

**Myopic loss aversion:** Benartzi and Thaler (1995) showed that loss aversion, combined with frequent portfolio evaluation, explains the **equity premium puzzle** — why stocks historically return so much more than bonds (approximately 6% per year more). If investors check their portfolios frequently, they experience frequent short-term losses (stocks are volatile), which feels painful due to loss aversion. They demand high returns to compensate. Investors who check less frequently experience fewer perceived losses and are more comfortable holding stocks.

**Risk aversion for gains, risk-seeking for losses:** Prospect Theory predicts that people are risk-averse when facing gains but risk-seeking when facing losses. This explains why:
- Companies in financial distress take bigger gambles (they are in the loss domain)
- Traders who are losing double down rather than cut losses
- Countries facing military defeat escalate rather than negotiate

### Loss Aversion in Business and Marketing

**Pricing strategy:** Framing matters enormously because of loss aversion:
- "Save \\$5" is less motivating than "Avoid losing \\$5"
- Surcharges (perceived as losses) are more aversive than equivalent discount removal (perceived as foregone gains)
- Free trials exploit loss aversion — once you have the product, giving it up feels like a loss

**Subscription models:** Companies prefer subscriptions because cancellation requires an active decision to accept a loss (giving up the service). The default (continuing to pay) is maintained by loss aversion and status quo bias.

**Negotiation:** Framing concessions as gains rather than losses is a powerful negotiation tactic. "I can offer you an additional \\$5,000" is more appealing than "I am reducing the deduction from \\$15,000 to \\$10,000" — even when the net effect is identical.

### Loss Aversion and Public Policy

**Status quo bias in policy:** Loss aversion makes people resist change — even beneficial change — because the potential losses from change loom larger than potential gains. This explains resistance to trade liberalization, healthcare reform, pension changes, and environmental regulations.

**Tax policy:** People respond more strongly to tax increases (losses) than to equivalent subsidy decreases (foregone gains). This asymmetry shapes political strategy — tax cuts are easier to pass than equivalent spending increases, even when the economic effect is identical.

**Organ donation:** Countries with opt-out organ donation systems (you are a donor by default unless you opt out) have dramatically higher donation rates than opt-in countries. Opting out feels like losing something you already have.

### Is Loss Aversion Universal?

Most research confirms loss aversion across cultures, though the magnitude varies. Some studies suggest it is weaker for very small stakes (people do not agonize over losing a penny) and in experienced traders (who may learn to suppress it). There is an ongoing debate about whether loss aversion is truly innate or partly a learned response.

### Key Takeaway

Loss aversion is one of the most robust findings in behavioral economics: losses hurt about twice as much as equivalent gains feel good. This asymmetry explains the endowment effect, the disposition effect, status quo bias, and many marketing strategies. Understanding loss aversion helps explain why people resist change, hold losing investments, and are more motivated by potential losses than potential gains.

> "Losses loom larger than gains." — Kahneman & Tversky

*Resources: Kahneman & Tversky, "Prospect Theory" (1979); Benartzi & Thaler, "Myopic Loss Aversion" (1995); Thaler, Misbehaving.*`,
    },
    {
      id: "be-bias-overconfidence",
      slug: "overconfidence",
      title: "Overconfidence",
      content: `## Overconfidence

**Overconfidence** is the tendency to overestimate one's own abilities, knowledge, and the precision of one's predictions. It is one of the most consistent and consequential findings in behavioral economics — and one of the hardest biases to correct because confident people do not realize they are overconfident.

### Three Types of Overconfidence

Researchers distinguish three distinct forms:

**1. Overestimation:** Believing you are better than you actually are. People overestimate their exam scores, driving ability, social skills, and health status. In one survey, 93% of American drivers rated themselves as "above average" — a mathematical impossibility.

**2. Overplacement (Better-than-average effect):** Believing you are better than others relative to reality. This is strongest for easy tasks (most people correctly believe they can drive a car, and most rate themselves above average at it) and reverses for very hard tasks (most people underestimate their ability at difficult trivia).

**3. Overprecision:** Being too certain about the accuracy of your beliefs. This is measured through calibration studies: when people say they are "99% confident" in an answer, they are correct only about 80% of the time. When they say "90% confident," they are correct about 70% of the time. People's confidence intervals are systematically too narrow.

### Evidence Across Domains

**Entrepreneurship:** 81% of entrepreneurs rate their chances of success at 70% or higher. 33% rate them at 100%. The actual success rate of startups is approximately 10-20%. Overconfidence helps explain why so many businesses are launched despite unfavorable odds — and why so many fail.

**Finance:** Professional forecasters, fund managers, and analysts are systematically overconfident. Mutual fund managers who trade most frequently (expressing high confidence in their stock picks) underperform those who trade less. Barber and Odean (2001) found that individual investors who traded most frequently earned returns 6.5 percentage points lower per year than the market — primarily because of overconfident trading.

**Medicine:** Doctors are overconfident in their diagnoses. Christensen-Szalanski and Bushyhead (1981) found that when physicians were "90% certain" of a pneumonia diagnosis, they were correct only about 50% of the time.

**Military and intelligence:** Overconfidence has contributed to military disasters throughout history. The US invasion of Iraq in 2003 was based on overconfident intelligence assessments about weapons of mass destruction. The planning assumed a quick, easy occupation — reflecting overconfidence about post-invasion stability.

**Project planning:** The **planning fallacy** (Kahneman and Tversky's term) is a specific form of overconfidence: people consistently underestimate the time, cost, and complexity of projects. The Sydney Opera House was estimated at 7 years and \\$7 million — it took 16 years and \\$102 million. This pattern is universal across construction, software development, and personal projects.

### Why Overconfidence Persists

Several factors sustain overconfidence:

**Self-serving attribution:** People attribute successes to their own skill and failures to bad luck. Over time, this asymmetric attribution inflates self-assessment.

**Selective memory:** People remember their correct predictions better than their incorrect ones (confirmation bias applied to self-assessment).

**Lack of feedback:** Many decisions do not have clear, immediate feedback. A CEO who makes a strategic decision may not see the consequences for years — and by then, many factors have intervened, making it impossible to assess the original judgment.

**Social incentives:** Confident people are perceived as more competent, more likely to be promoted, and more likely to be followed. There are real social rewards for projecting confidence, even when it is unwarranted.

**Survivorship bias:** We see the successful entrepreneurs, traders, and leaders — not the equally confident ones who failed. This makes overconfidence appear to be a recipe for success.

### The Costs of Overconfidence

**Financial costs:** Excessive trading, poorly diversified portfolios, overleveraging, and inadequate risk management — all driven by overconfidence — destroy wealth.

**Strategic costs:** Firms that overestimate their competitive position make aggressive moves (acquisitions, market entries) that fail. CEOs described as "overconfident" in media profiles make worse acquisitions and invest more in declining projects.

**Personal costs:** Overconfident individuals take on too much, prepare too little, and underestimate risks. Students who are overconfident about exam performance study less and score lower.

### Debiasing Overconfidence

- **Track your predictions:** Keep a record of your forecasts and their outcomes. The gap between predicted and actual accuracy is humbling and calibrating
- **Use reference class forecasting:** Instead of estimating from the inside ("I think this project will take 3 months"), look at how long similar projects actually took (the outside view)
- **Consider the base rate:** Before estimating your chances, look at the success rates for similar people/projects
- **Seek disconfirming feedback:** Actively ask "What could go wrong?" and "What am I missing?"
- **Pre-mortem analysis:** Imagine the project has failed and work backwards to identify the reasons

### Key Takeaway

Overconfidence is universal, persistent, and costly. People overestimate their abilities, overrate their knowledge, and set confidence intervals that are far too narrow. Awareness helps, but the most effective antidote is structured processes that force confrontation with base rates, historical outcomes, and outside perspectives.

> "The illusion that we understand the past fosters overconfidence in our ability to predict the future." — Daniel Kahneman

*Resources: Moore & Healy, "The Trouble with Overconfidence" (2008); Barber & Odean, "Trading Is Hazardous to Your Wealth" (2001); Kahneman, Thinking, Fast and Slow.*`,
    },
  ],
};

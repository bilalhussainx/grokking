import { Module } from "../types";

export const nlpFinanceModule: Module = {
  id: "fml-nlp",
  title: "NLP for Finance",
  description: "Apply natural language processing to financial text — sentiment analysis of news, SEC filing analysis, earnings call transcripts, social media signals, and event-driven trading strategies.",
  lessons: [
    {
      id: "fml-sentiment-news",
      slug: "sentiment-analysis-news",
      title: "Sentiment Analysis of Financial News",
      content: `## Sentiment Analysis of Financial News

Financial news carries information that moves markets. Earnings surprises, geopolitical events, central bank statements, and analyst upgrades all trigger price reactions. Natural language processing allows us to systematically extract sentiment from news text and use it as a trading signal. Academic research has consistently demonstrated that news sentiment predicts short-term stock returns.

### Why News Sentiment Matters

News articles contain forward-looking information that is not yet reflected in prices:

| News Type | Market Impact | Time Scale |
|-----------|--------------|-----------|
| **Earnings surprises** | 3-5% average stock move | Minutes to hours |
| **M&A announcements** | 15-30% premium for targets | Seconds to minutes |
| **Central bank statements** | Broad market moves | Seconds |
| **Analyst upgrades/downgrades** | 1-3% move | Hours to days |
| **Geopolitical events** | Sector-wide effects | Hours to weeks |
| **Product launches/recalls** | Company-specific | Hours to days |

### Approaches to Financial Sentiment Analysis

**1. Dictionary-Based Methods** — Count positive and negative words using a financial lexicon:

\`\`\`python
import numpy as np

# Financial sentiment dictionary (simplified)
positive_words = {
    'beat', 'exceeds', 'strong', 'growth', 'profit', 'upgrade',
    'bullish', 'outperform', 'surge', 'rally', 'record', 'gain',
    'positive', 'improved', 'innovative', 'optimistic'
}
negative_words = {
    'miss', 'below', 'weak', 'decline', 'loss', 'downgrade',
    'bearish', 'underperform', 'plunge', 'crash', 'risk', 'cut',
    'negative', 'warning', 'lawsuit', 'default', 'recession'
}

def dictionary_sentiment(text):
    """Compute sentiment score from word counts."""
    words = text.lower().split()
    pos_count = sum(1 for w in words if w in positive_words)
    neg_count = sum(1 for w in words if w in negative_words)
    total = pos_count + neg_count
    if total == 0:
        return 0.0
    return (pos_count - neg_count) / total

# Example headlines
headlines = [
    "Company beats earnings estimates with record revenue growth",
    "Stock plunges after weak guidance and profit warning",
    "Strong quarterly results exceed analyst expectations",
    "Recession fears drive market decline as risks mount",
    "Innovative product launch boosts optimistic outlook"
]

for headline in headlines:
    score = dictionary_sentiment(headline)
    label = "Positive" if score > 0 else "Negative" if score < 0 else "Neutral"
    print(f"[{score:+.2f}] {label:8s} | {headline}")
\`\`\`

**2. Loughran-McDonald Dictionary** — The standard financial sentiment lexicon. Loughran and McDonald (2011) showed that general-purpose sentiment dictionaries (like Harvard IV) misclassify many financial terms. Words like "liability," "tax," and "capital" are negative in general English but neutral in finance. Their dictionary, specifically calibrated for financial text, is used by most academic research and industry applications.

**3. Transformer-Based Models** — FinBERT and other finance-specific language models capture context and nuance that dictionary methods miss:
- "The company did not miss expectations" — Dictionary methods count "miss" as negative; a transformer understands the negation
- "Revenue grew but margins contracted" — Transformers can weigh conflicting signals
- "The Fed raised rates as expected" — Context determines whether a rate hike is positive or negative for a specific asset

### From Sentiment to Trading Signal

Converting sentiment scores to tradeable signals involves several steps:

1. **Aggregate** — Combine sentiment across multiple articles about the same company into a daily sentiment score
2. **Normalize** — Z-score the sentiment against a rolling historical window to identify unusually positive or negative sentiment
3. **Filter** — Require a minimum number of articles for the signal to be reliable
4. **Combine** — Merge news sentiment with other signals (price momentum, fundamental data) for a more robust prediction
5. **Execute** — Map the combined signal to position sizes using a risk management framework

### Performance of News Sentiment Strategies

Academic and industry research shows:

- News sentiment predicts 1-5 day returns with typical IC (information coefficient) of 2-5%
- Overnight sentiment (news published after market close) is most predictive of next-day returns
- Sentiment is most effective for individual stocks (cross-sectional), less so for market timing
- The signal decays rapidly — most of the predictive power is in the first 24 hours
- Combining sentiment with price momentum improves both signals (negative correlation of errors)

### Challenges

- **Speed** — In competitive markets, news is priced within minutes. To profit from news sentiment, you need near-real-time processing
- **Fake news and manipulation** — Deliberately misleading articles can generate false signals
- **Sarcasm and irony** — "Great, another earnings miss" is negative despite the positive word
- **Context dependency** — "Inflation is rising" is bad for bonds but might be neutral or positive for commodity producers
- **Data cost** — Professional news feeds (Reuters, Bloomberg) are expensive; free sources (social media, press releases) are noisy

### Key Takeaway

News sentiment analysis is one of the most validated and practically useful applications of NLP in finance. Dictionary-based methods provide a fast baseline; transformer-based models like FinBERT offer superior accuracy at the cost of complexity. The key to success is speed (processing news before it is fully priced), context (understanding what a headline means for specific assets), and integration (combining sentiment with other signals).`,
      starterCode: `import numpy as np

# TODO: Create a financial sentiment dictionary
# (positive and negative word sets)

# TODO: Implement a dictionary-based sentiment scorer

# TODO: Score 5 financial headlines and print results
`,
      solutionCode: `import numpy as np

positive_words = {'beat', 'exceeds', 'strong', 'growth', 'profit',
                  'upgrade', 'bullish', 'surge', 'rally', 'record',
                  'gain', 'positive', 'improved', 'optimistic'}
negative_words = {'miss', 'below', 'weak', 'decline', 'loss',
                  'downgrade', 'bearish', 'plunge', 'crash', 'risk',
                  'cut', 'negative', 'warning', 'recession'}

def dictionary_sentiment(text):
    words = text.lower().split()
    pos = sum(1 for w in words if w in positive_words)
    neg = sum(1 for w in words if w in negative_words)
    total = pos + neg
    return (pos - neg) / total if total > 0 else 0.0

headlines = [
    "Company beats earnings estimates with record revenue growth",
    "Stock plunges after weak guidance and profit warning",
    "Strong quarterly results exceed analyst expectations",
    "Recession fears drive market decline as risks mount",
    "Innovative product launch boosts optimistic outlook"
]

for h in headlines:
    s = dictionary_sentiment(h)
    label = "Positive" if s > 0 else "Negative" if s < 0 else "Neutral"
    print(f"[{s:+.2f}] {label:8s} | {h}")
`,
    },
    {
      id: "fml-sec-filings",
      slug: "sec-filing-analysis",
      title: "SEC Filing Analysis",
      content: `## SEC Filing Analysis

SEC filings are a goldmine of structured and unstructured financial information. Companies are legally required to disclose material information through standardized filings, creating a vast corpus of text that can be systematically analyzed with NLP. Unlike news articles (which are filtered through journalists), SEC filings come directly from companies and provide the most authoritative source of corporate information.

### Key SEC Filing Types

| Filing | Frequency | Content | ML Application |
|--------|-----------|---------|---------------|
| **10-K** | Annual | Full financial statements, risk factors, MD&A | Annual sentiment analysis, risk monitoring |
| **10-Q** | Quarterly | Quarterly financial statements, updates | Quarterly signal updates |
| **8-K** | Event-driven | Material events (acquisitions, management changes, earnings) | Event-driven trading |
| **DEF 14A** | Annual | Proxy statement (executive compensation, voting) | Governance scoring |
| **13-F** | Quarterly | Institutional holdings | Smart money tracking |
| **S-1/F-1** | IPO | Registration statement for new public offerings | IPO analysis |

### Extracting Alpha from 10-K/10-Q Filings

The Management Discussion and Analysis (MD&A) section is the most informative for sentiment analysis because it contains management's forward-looking statements about business performance, risks, and outlook.

\`\`\`python
import numpy as np

# Simulating the analysis of 10-K filing changes
# In practice, you would use EDGAR's XBRL/full-text search

def compute_text_similarity(text_a, text_b):
    """
    Compute Jaccard similarity between two texts.
    High similarity = little change between filings.
    """
    words_a = set(text_a.lower().split())
    words_b = set(text_b.lower().split())
    intersection = words_a & words_b
    union = words_a | words_b
    return len(intersection) / len(union) if union else 0

def analyze_risk_factor_changes(current_risks, previous_risks):
    """
    Analyze changes in risk factor disclosures.
    New risk factors and removed risk factors are both informative.
    """
    current_set = set(current_risks)
    previous_set = set(previous_risks)

    new_risks = current_set - previous_set
    removed_risks = previous_set - current_set
    unchanged = current_set & previous_set

    return {
        'new_risks': list(new_risks),
        'removed_risks': list(removed_risks),
        'unchanged_count': len(unchanged),
        'total_current': len(current_set),
        'change_ratio': len(new_risks | removed_risks) /
                        max(len(current_set | previous_set), 1)
    }

# Example: comparing risk factors between two years
previous_risks = [
    "Competition in our industry is intense",
    "We depend on key personnel",
    "Currency fluctuations may affect revenue",
    "Regulatory changes could impact operations"
]

current_risks = [
    "Competition in our industry is intense",
    "We depend on key personnel",
    "Regulatory changes could impact operations",
    "Cybersecurity threats pose significant risk",
    "Supply chain disruptions may affect delivery",
    "AI regulation uncertainty creates compliance risk"
]

changes = analyze_risk_factor_changes(current_risks, previous_risks)
print("Risk Factor Analysis:")
print(f"  New risks: {len(changes['new_risks'])}")
for risk in changes['new_risks']:
    print(f"    + {risk}")
print(f"  Removed risks: {len(changes['removed_risks'])}")
for risk in changes['removed_risks']:
    print(f"    - {risk}")
print(f"  Change ratio: {changes['change_ratio']:.2f}")
\`\`\`

### Academic Findings on Filing Analysis

Research has demonstrated several profitable NLP strategies using SEC filings:

**Readability** — Filings that become more complex (harder to read) predict negative future returns. The intuition: managers use complex language to obscure bad news. Li (2008) showed that readability measures (Fog Index, document length) predict earnings and returns.

**Tone change** — Changes in the tone of MD&A sections from one quarter to the next predict future earnings surprises. A shift from positive to negative language precedes earnings disappointments.

**Risk factor changes** — New risk factors added to 10-K filings predict negative future events. Campbell et al. (2014) showed that changes in risk factor text predict future financial distress.

**Filing delay** — Companies that file their 10-K later than expected tend to have worse subsequent performance. Late filing is a soft signal of internal difficulties.

**Similarity analysis** — Measuring how much a filing has changed from the previous period. Hoberg and Phillips (2010) showed that textual similarity between companies' filings predicts competition dynamics and merger activity.

### Processing EDGAR Filings

The SEC's EDGAR database provides free access to all public company filings. The processing pipeline involves:

1. **Download** — Fetch filings from EDGAR using the full-text index or XBRL API
2. **Parse** — Extract relevant sections (MD&A, risk factors) from HTML/XML
3. **Clean** — Remove boilerplate, tables, HTML tags, and legal disclaimers
4. **Analyze** — Apply NLP models (sentiment, readability, topic modeling)
5. **Compare** — Measure changes from previous filings
6. **Signal** — Convert analysis into tradeable signals

### Practical Challenges

- **Filing volume** — Over 200,000 filings per year on EDGAR; processing requires significant infrastructure
- **Boilerplate** — Much of the text is legally required boilerplate that does not change; you must identify the informative portions
- **Lag** — 10-K filings are due 60-90 days after fiscal year end; much of the information may already be priced
- **XBRL parsing** — Structured financial data in XBRL format requires specialized parsers

### Key Takeaway

SEC filings provide legally mandated disclosures that are rich with forward-looking information. NLP techniques — from simple readability metrics to sophisticated transformer-based analysis — can extract signals that predict future returns, earnings surprises, and financial distress. The key advantage is that filings are authoritative, comprehensive, and available for free through EDGAR.`,
      starterCode: `import numpy as np

# TODO: Implement a function to compare risk factors
# between two filing periods

# TODO: Implement text similarity (Jaccard) between filing sections

# TODO: Analyze example risk factor changes and print results
`,
      solutionCode: `import numpy as np

def compute_text_similarity(text_a, text_b):
    words_a = set(text_a.lower().split())
    words_b = set(text_b.lower().split())
    intersection = words_a & words_b
    union = words_a | words_b
    return len(intersection) / len(union) if union else 0

def analyze_risk_factor_changes(current, previous):
    curr_set, prev_set = set(current), set(previous)
    new = curr_set - prev_set
    removed = prev_set - curr_set
    return {
        'new_risks': list(new), 'removed_risks': list(removed),
        'change_ratio': len(new | removed) / max(len(curr_set | prev_set), 1)
    }

previous = ["Competition is intense", "Key personnel risk", "Currency risk"]
current = ["Competition is intense", "Key personnel risk", "Cybersecurity threats", "AI regulation risk"]

changes = analyze_risk_factor_changes(current, previous)
print(f"New risks: {len(changes['new_risks'])}")
for r in changes['new_risks']:
    print(f"  + {r}")
print(f"Removed: {len(changes['removed_risks'])}")
for r in changes['removed_risks']:
    print(f"  - {r}")
print(f"Change ratio: {changes['change_ratio']:.2f}")

sim = compute_text_similarity("revenue grew strongly this quarter", "revenue growth was strong this period")
print(f"Text similarity: {sim:.4f}")
`,
    },
    {
      id: "fml-earnings-calls",
      slug: "earnings-call-transcripts",
      title: "Earnings Call Transcript Analysis",
      content: `## Earnings Call Transcript Analysis

Quarterly earnings calls are among the most information-rich events in financial markets. During these calls, company executives present financial results and answer analyst questions, revealing information through both what they say and how they say it. NLP applied to earnings call transcripts has become a major area of financial ML research and practice.

### Anatomy of an Earnings Call

A typical earnings call consists of two parts:

**Prepared remarks (15-20 minutes):** CEO and CFO present quarterly results, discuss business performance, and provide guidance. This section is scripted, reviewed by lawyers, and carefully worded.

**Q&A session (20-40 minutes):** Analysts ask questions and executives respond spontaneously. This section is less scripted and often reveals more genuine sentiment, uncertainty, and strategic direction.

Research shows that the Q&A section is more predictive of future returns than the prepared remarks, precisely because it is less controlled.

### NLP Features from Earnings Calls

\`\`\`python
import numpy as np

def analyze_earnings_call(transcript_sentences, question_sentences):
    """
    Extract NLP features from an earnings call transcript.
    """
    # Simplified feature extraction
    positive_words = {'strong', 'growth', 'improved', 'exceeded',
                      'momentum', 'confident', 'optimistic', 'record'}
    negative_words = {'challenging', 'headwinds', 'decline', 'pressure',
                      'uncertain', 'difficult', 'weakness', 'risk'}
    hedge_words = {'approximately', 'roughly', 'about', 'potentially',
                   'may', 'might', 'could', 'somewhat'}

    def count_words(sentences, word_set):
        total_words = 0
        matches = 0
        for sent in sentences:
            words = sent.lower().split()
            total_words += len(words)
            matches += sum(1 for w in words if w in word_set)
        return matches / max(total_words, 1)

    features = {}

    # Sentiment scores
    features['prepared_positive'] = count_words(transcript_sentences, positive_words)
    features['prepared_negative'] = count_words(transcript_sentences, negative_words)
    features['qa_positive'] = count_words(question_sentences, positive_words)
    features['qa_negative'] = count_words(question_sentences, negative_words)

    # Hedging language (uncertainty indicator)
    all_sentences = transcript_sentences + question_sentences
    features['hedge_ratio'] = count_words(all_sentences, hedge_words)

    # Sentiment gap (prepared vs Q&A)
    prep_sent = features['prepared_positive'] - features['prepared_negative']
    qa_sent = features['qa_positive'] - features['qa_negative']
    features['sentiment_gap'] = prep_sent - qa_sent

    # Verbosity (more words in Q&A can indicate defensiveness)
    prep_words = sum(len(s.split()) for s in transcript_sentences)
    qa_words = sum(len(s.split()) for s in question_sentences)
    features['qa_verbosity'] = qa_words / max(prep_words, 1)

    return features

# Example earnings call excerpts
prepared = [
    "We delivered strong results this quarter with revenue growth exceeding expectations",
    "Our momentum continues across all business segments",
    "We are confident in our ability to execute on our strategic priorities",
    "Record quarterly revenue demonstrates the strength of our platform"
]

qa = [
    "That is a challenging question and the environment remains somewhat uncertain",
    "We may see some pressure on margins in the near term",
    "Growth could potentially slow as we face headwinds from currency",
    "We are optimistic about the long-term opportunity despite near-term difficulties"
]

features = analyze_earnings_call(prepared, qa)
print("Earnings Call NLP Features:")
for name, value in features.items():
    print(f"  {name:25s}: {value:.6f}")
\`\`\`

### Advanced Analysis Techniques

**Vocal analysis** — Research by Mayew and Venkatachalam (2012) showed that the vocal characteristics of CEOs during earnings calls predict future performance. Negative vocal affect (stress, anxiety in the voice) predicts earnings declines and stock price drops. Audio ML models can detect:
- Pitch changes indicating stress
- Speaking rate variations (rushing through bad news)
- Vocal tremor and hesitation patterns

**Executive evasion** — When analysts ask specific questions and executives provide vague or tangential answers, this "evasion" predicts negative future outcomes. NLP models can detect evasion by measuring the semantic similarity between questions and answers.

**Deception detection** — Research has identified linguistic markers of deceptive communication in earnings calls: excessive use of third-person pronouns, lack of specific numbers, and increased use of certainty words (overcompensating for uncertainty).

**Topic shifts** — Tracking which topics management emphasizes (or avoids) across quarters reveals strategic direction changes.

### Trading on Earnings Call Sentiment

The predictive power of earnings call NLP manifests at different time horizons:

- **Immediate reaction (0-2 hours):** Markets react to headline numbers; NLP of the call transcript provides incremental information during the call itself
- **Short-term drift (1-5 days):** Post-earnings announcement drift; NLP sentiment predicts the direction of drift
- **Medium-term (1-3 months):** Changes in management tone predict the direction of future earnings revisions

### Key Takeaway

Earnings call transcripts are a rich source of forward-looking information. The Q&A section, where executives speak more spontaneously, is particularly informative. NLP features — sentiment, hedging language, evasion, and the gap between prepared and spontaneous remarks — all contribute to predicting future stock performance.`,
      starterCode: `import numpy as np

# TODO: Implement an earnings call analyzer that extracts:
# - Positive/negative sentiment (prepared vs Q&A)
# - Hedge word ratio
# - Sentiment gap between sections
# - Q&A verbosity

# TODO: Analyze sample prepared remarks and Q&A excerpts
`,
      solutionCode: `import numpy as np

positive = {'strong', 'growth', 'improved', 'exceeded', 'momentum',
            'confident', 'optimistic', 'record'}
negative = {'challenging', 'headwinds', 'decline', 'pressure',
            'uncertain', 'difficult', 'weakness', 'risk'}
hedges = {'approximately', 'roughly', 'about', 'potentially',
          'may', 'might', 'could', 'somewhat'}

def count_ratio(sentences, word_set):
    total = matches = 0
    for s in sentences:
        words = s.lower().split()
        total += len(words)
        matches += sum(1 for w in words if w in word_set)
    return matches / max(total, 1)

prepared = [
    "We delivered strong results with revenue growth exceeding expectations",
    "Our momentum continues across all segments",
    "We are confident in our strategic execution",
    "Record quarterly revenue demonstrates platform strength"
]
qa = [
    "The environment remains somewhat uncertain with challenging dynamics",
    "We may see pressure on margins in the near term",
    "Growth could potentially slow due to currency headwinds",
    "We are optimistic despite near-term difficulties"
]

features = {
    'prep_positive': count_ratio(prepared, positive),
    'prep_negative': count_ratio(prepared, negative),
    'qa_positive': count_ratio(qa, positive),
    'qa_negative': count_ratio(qa, negative),
    'hedge_ratio': count_ratio(prepared + qa, hedges),
}
features['sentiment_gap'] = ((features['prep_positive'] - features['prep_negative'])
                             - (features['qa_positive'] - features['qa_negative']))

for name, val in features.items():
    print(f"  {name:20s}: {val:.6f}")
`,
    },
    {
      id: "fml-social-sentiment",
      slug: "social-media-sentiment",
      title: "Social Media Sentiment",
      content: `## Social Media Sentiment for Financial Markets

Social media has become a significant source of market-moving information. Platforms like Twitter/X, Reddit (r/wallstreetbets), StockTwits, and Seeking Alpha generate millions of posts about stocks, crypto, and markets daily. The GameStop short squeeze of January 2021 demonstrated that social media sentiment can drive massive market moves, making it impossible for professional investors to ignore.

### The Social Media Signal

Social media differs from traditional news in important ways:

| Dimension | Traditional News | Social Media |
|-----------|-----------------|-------------|
| **Speed** | Minutes to hours after events | Seconds (often ahead of news) |
| **Volume** | Hundreds of articles/day | Millions of posts/day |
| **Quality** | Professional, fact-checked | Highly variable, often misleading |
| **Sentiment range** | Measured, balanced | Extreme, emotional |
| **Authors** | Journalists, analysts | Everyone (retail investors, bots, trolls) |
| **Cost** | Expensive (Bloomberg, Reuters) | Free or low-cost APIs |

### Extracting Signal from Noise

The challenge with social media is the extraordinarily low signal-to-noise ratio. Most posts are noise — personal opinions, jokes, spam, and bot activity. Extracting useful signal requires:

**1. Volume-based signals** — A sudden spike in the number of posts about a stock (abnormal attention) often precedes significant price moves, regardless of sentiment. If 10x the normal number of people are discussing a stock, something is happening.

**2. Sentiment-based signals** — Aggregating sentiment across many posts to create a consensus score. Individual posts are noisy; the aggregate is more informative.

**3. Influencer signals** — Posts from accounts with track records of accurate predictions carry more weight than random users.

\`\`\`python
import numpy as np

def compute_social_signals(posts_per_hour, sentiments, followers):
    """
    Compute social media trading signals.
    posts_per_hour: array of post counts per hour
    sentiments: array of sentiment scores (-1 to 1) per post
    followers: array of follower counts per post author
    """
    signals = {}

    # Volume signal: abnormal attention
    baseline_volume = np.mean(posts_per_hour[:24])  # first 24h as baseline
    current_volume = np.mean(posts_per_hour[-6:])   # last 6 hours
    signals['volume_zscore'] = ((current_volume - baseline_volume)
                                / max(np.std(posts_per_hour[:24]), 1))

    # Sentiment signal: follower-weighted average
    total_followers = np.sum(followers)
    if total_followers > 0:
        weighted_sentiment = np.sum(sentiments * followers) / total_followers
    else:
        weighted_sentiment = np.mean(sentiments)
    signals['weighted_sentiment'] = weighted_sentiment

    # Unweighted sentiment
    signals['raw_sentiment'] = np.mean(sentiments)

    # Sentiment dispersion (disagreement)
    signals['sentiment_dispersion'] = np.std(sentiments)

    # Bullish ratio
    signals['bullish_ratio'] = np.mean(sentiments > 0.1)

    return signals

np.random.seed(42)

# Simulate social media data for a stock
n_hours = 48
posts_per_hour = np.random.poisson(50, n_hours)
posts_per_hour[-6:] *= 5  # viral spike in last 6 hours

n_posts = 500
sentiments = np.random.normal(0.2, 0.5, n_posts)  # slightly bullish
sentiments = np.clip(sentiments, -1, 1)
followers = np.random.lognormal(5, 2, n_posts)  # power-law distributed

signals = compute_social_signals(posts_per_hour, sentiments, followers)
print("Social Media Signals:")
for name, value in signals.items():
    print(f"  {name:25s}: {value:.4f}")
\`\`\`

### The WallStreetBets Effect

The GameStop saga (January 2021) fundamentally changed how markets perceive social media:

- Reddit users coordinated a massive short squeeze, driving GME from $20 to $483
- Hedge funds with short positions lost billions (Melvin Capital lost 53% in January alone)
- The event demonstrated that social media-driven collective action can overpower institutional positioning
- Regulators and hedge funds now actively monitor Reddit, Discord, and Twitter for coordinated trading activity

### Bot Detection and Data Quality

Social media financial data is heavily contaminated by bots and manipulation:

- An estimated 15-30% of financial social media posts are bot-generated
- Pump-and-dump schemes use coordinated bot networks to inflate small-cap stocks
- Paid promotion (undisclosed) is common for crypto tokens
- Detecting and filtering bots is essential for any social sentiment strategy

Bot detection signals: account age, posting frequency, repetitive language patterns, coordinated timing across accounts, and absence of non-financial activity.

### Platform-Specific Strategies

**Twitter/X:** Best for real-time event detection and breaking news sentiment. Use streaming API to capture tweets mentioning tickers. Weight by follower count and account credibility.

**Reddit (r/wallstreetbets, r/stocks):** Best for retail investor sentiment and identifying meme stock momentum. Post upvotes and comment volume are useful weighting signals.

**StockTwits:** Purpose-built for stock discussion. Provides pre-labeled bullish/bearish sentiment. Lower volume but higher relevance.

**Seeking Alpha:** Longer-form analysis with more substantive content. Article sentiment predicts medium-term returns (1-3 months).

### Key Takeaway

Social media sentiment is a noisy but genuine source of alpha, particularly for retail-heavy stocks and short-term trading horizons. The keys to success are robust noise filtering (bot detection, volume normalization), follower-weighted aggregation, and combining social signals with traditional data. Social media should complement, not replace, fundamental and technical analysis.`,
      starterCode: `import numpy as np

np.random.seed(42)

# TODO: Simulate social media data (posts_per_hour, sentiments, followers)
# Include a volume spike in the last 6 hours

# TODO: Compute social signals: volume z-score, weighted sentiment,
# raw sentiment, dispersion, bullish ratio

# TODO: Print all signals
`,
      solutionCode: `import numpy as np

np.random.seed(42)

n_hours = 48
posts_per_hour = np.random.poisson(50, n_hours)
posts_per_hour[-6:] *= 5

n_posts = 500
sentiments = np.clip(np.random.normal(0.2, 0.5, n_posts), -1, 1)
followers = np.random.lognormal(5, 2, n_posts)

baseline = np.mean(posts_per_hour[:24])
current = np.mean(posts_per_hour[-6:])
vol_z = (current - baseline) / max(np.std(posts_per_hour[:24]), 1)
weighted = np.sum(sentiments * followers) / np.sum(followers)

print(f"Volume z-score:      {vol_z:.4f}")
print(f"Weighted sentiment:  {weighted:.4f}")
print(f"Raw sentiment:       {np.mean(sentiments):.4f}")
print(f"Dispersion:          {np.std(sentiments):.4f}")
print(f"Bullish ratio:       {np.mean(sentiments > 0.1):.4f}")
`,
    },
    {
      id: "fml-event-driven",
      slug: "event-driven-trading",
      title: "Event-Driven Trading with NLP",
      content: `## Event-Driven Trading with NLP

Event-driven trading strategies seek to profit from the market's reaction to specific corporate or economic events. NLP enables systematic identification and classification of events from unstructured text, assessment of event magnitude, and prediction of market reaction — all at speeds that human traders cannot match.

### Types of Financial Events

| Event Category | Examples | Typical Price Impact | NLP Application |
|---------------|----------|---------------------|----------------|
| **Earnings** | Beats/misses, guidance changes | 3-8% | Sentiment of call transcript |
| **M&A** | Acquisitions, mergers, divestitures | 15-40% for targets | Deal term extraction |
| **Management** | CEO changes, insider trading | 1-5% | Sentiment of announcement |
| **Legal** | Lawsuits, regulatory actions | 2-10% | Severity classification |
| **Product** | Launches, recalls, FDA approvals | 2-20% | Impact assessment |
| **Macro** | Fed statements, employment data | Market-wide | Hawkish/dovish classification |

### Building an Event Detection System

\`\`\`python
import numpy as np

def detect_events(headlines, ticker):
    """
    Detect and classify financial events from news headlines.
    Returns a list of detected events with classification.
    """
    event_patterns = {
        'earnings': ['earnings', 'revenue', 'profit', 'eps', 'quarterly results',
                     'guidance', 'beat', 'miss', 'fiscal'],
        'merger': ['acquisition', 'merger', 'acquire', 'takeover', 'bid',
                   'deal', 'buyout', 'offer'],
        'management': ['ceo', 'cfo', 'appoint', 'resign', 'fired', 'hire',
                       'insider', 'executive'],
        'legal': ['lawsuit', 'sued', 'fine', 'penalty', 'investigation',
                  'regulatory', 'sec', 'subpoena'],
        'product': ['launch', 'recall', 'fda', 'approval', 'patent',
                    'breakthrough', 'release'],
    }

    sentiment_words = {
        'positive': {'beat', 'exceed', 'strong', 'upgrade', 'approval',
                     'growth', 'record', 'soar'},
        'negative': {'miss', 'below', 'weak', 'downgrade', 'recall',
                     'decline', 'crash', 'investigation'}
    }

    events = []
    for headline in headlines:
        lower = headline.lower()
        if ticker.lower() not in lower:
            continue

        for event_type, keywords in event_patterns.items():
            if any(kw in lower for kw in keywords):
                pos = sum(1 for w in lower.split() if w in sentiment_words['positive'])
                neg = sum(1 for w in lower.split() if w in sentiment_words['negative'])
                sentiment = 'positive' if pos > neg else 'negative' if neg > pos else 'neutral'

                events.append({
                    'headline': headline,
                    'event_type': event_type,
                    'sentiment': sentiment,
                    'urgency': 'high' if event_type in ['merger', 'legal'] else 'medium'
                })
                break

    return events

# Example news stream
headlines = [
    "AAPL beats Q3 earnings estimates with record iPhone revenue",
    "AAPL CEO Tim Cook announces major acquisition of AI startup",
    "AAPL faces antitrust investigation from DOJ over App Store",
    "MSFT reports strong quarterly results exceeding expectations",
    "AAPL launches breakthrough mixed reality headset",
    "AAPL insider sells 500K shares amid weak guidance concerns"
]

events = detect_events(headlines, "AAPL")
print(f"Detected {len(events)} events for AAPL:\\n")
for event in events:
    print(f"  [{event['event_type']:12s}] [{event['sentiment']:8s}] "
          f"[{event['urgency']:6s}] {event['headline']}")
\`\`\`

### Event Impact Prediction

Beyond detecting events, ML models can predict the magnitude of market reaction:

**Features for impact prediction:**
- Event type (earnings vs. M&A vs. legal)
- Sentiment score of the announcement text
- Historical volatility of the stock
- Market conditions (VIX level, sector momentum)
- Surprise factor (deviation from consensus expectations)
- Company size (small-caps react more to events)
- Time of day (after-hours announcements have different dynamics)

### Post-Event Drift

One of the most robust findings in financial research is **post-event drift** — prices continue to move in the direction of the initial event reaction for days or weeks after the event:

- **Post-earnings announcement drift (PEAD):** Stocks that beat earnings continue to drift upward for 60+ days
- **Post-M&A drift:** Acquiring firms tend to underperform post-announcement
- **Post-downgrade drift:** Stocks continue declining after analyst downgrades

NLP enhances drift prediction by quantifying the information content of the event more precisely than simple headline numbers (beat/miss by how much).

### Speed of Processing

In event-driven trading, speed is critical:

- Major events are priced within seconds to minutes
- NLP systems must process and classify events in milliseconds
- Pre-trained models with low-latency inference are essential
- The tradeoff: simple dictionary methods are fast (microseconds) but less accurate; transformer models are more accurate but slower (tens of milliseconds)

### Risk Management for Event-Driven Strategies

Event-driven strategies carry specific risks:
- **Gap risk** — Events announced outside trading hours can cause price gaps
- **Crowded trades** — Many algorithms trading the same events compress profits
- **False signals** — Incorrectly classified events lead to losses
- **Tail risk** — Unexpected negative events (fraud, disasters) can cause catastrophic losses

### Key Takeaway

Event-driven trading with NLP combines the precision of systematic processing with the alpha opportunity of corporate events. The key competitive advantages are speed (processing events before competitors), accuracy (correctly classifying event type and sentiment), and coverage (monitoring thousands of stocks simultaneously). Combining event detection with post-event drift analysis creates a strategy that captures both the immediate reaction and the subsequent price adjustment.`,
      starterCode: `import numpy as np

# TODO: Implement an event detection system that:
# - Classifies headlines by event type (earnings, merger, legal, etc.)
# - Assigns sentiment (positive/negative/neutral)
# - Filters for a specific ticker

# TODO: Process sample headlines and print detected events
`,
      solutionCode: `import numpy as np

def detect_events(headlines, ticker):
    patterns = {
        'earnings': ['earnings', 'revenue', 'profit', 'eps', 'quarterly', 'guidance'],
        'merger': ['acquisition', 'merger', 'acquire', 'takeover', 'buyout'],
        'management': ['ceo', 'cfo', 'appoint', 'resign', 'insider'],
        'legal': ['lawsuit', 'investigation', 'regulatory', 'sec', 'fine'],
        'product': ['launch', 'recall', 'fda', 'approval', 'patent'],
    }
    pos_words = {'beat', 'exceed', 'strong', 'record', 'approval', 'growth'}
    neg_words = {'miss', 'weak', 'decline', 'investigation', 'recall', 'concerns'}

    events = []
    for h in headlines:
        lower = h.lower()
        if ticker.lower() not in lower:
            continue
        for etype, kws in patterns.items():
            if any(k in lower for k in kws):
                pos = sum(1 for w in lower.split() if w in pos_words)
                neg = sum(1 for w in lower.split() if w in neg_words)
                sent = 'positive' if pos > neg else 'negative' if neg > pos else 'neutral'
                events.append({'type': etype, 'sentiment': sent, 'headline': h})
                break
    return events

headlines = [
    "AAPL beats Q3 earnings estimates with record revenue",
    "AAPL CEO announces major acquisition of AI startup",
    "AAPL faces antitrust investigation from DOJ",
    "MSFT reports strong quarterly results",
    "AAPL launches breakthrough product with FDA approval",
]

for e in detect_events(headlines, "AAPL"):
    print(f"[{e['type']:12s}] [{e['sentiment']:8s}] {e['headline']}")
`,
    },
  ],
};

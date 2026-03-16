import { Module } from "../types";

export const adPredictionModule: Module = {
  id: "ml-ad-prediction",
  title: "ML System Design: Ad Prediction",
  description:
    "Design an ad prediction system — CTR prediction, feature engineering, model evolution from logistic regression to deep models, training pipelines, and online serving.",
  lessons: [
    {
      id: "ad-formulation",
      slug: "ad-problem-formulation",
      title: "Ad Prediction: Problem Formulation",
      content: `# Ad Prediction: Problem Formulation

## The Interview Setup

"Design a click-through rate prediction system for an ads platform." This question is asked at Meta, Google, Amazon, TikTok, and virtually every company with an ads business. Ads revenue accounts for the majority of revenue at these companies, making this one of the highest-impact ML systems.

## Clarifying Questions

\`\`\`
1. Platform type?               → Social media feed (Meta-like)
2. Ad formats?                  → Image ads, video ads, carousel ads
3. Scale?                       → 1B+ users, 10M+ active ads, 100B+ impressions/day
4. Optimization goal?           → Revenue = Σ bid × P(click) × P(conversion|click)
5. Latency constraint?          → < 50ms per ad scoring (within 200ms page load)
6. What data is available?      → User profiles, ad creatives, historical clicks, conversions
\`\`\`

## The Ad Ecosystem

Understanding the auction mechanics is essential before diving into the ML model.

\`\`\`
Advertiser → Creates ad, sets bid and targeting criteria
Ad Auction → When user loads a page, eligible ads compete
Ranking    → Score = bid × P(click) × P(conversion|click)
Winner     → Highest-scoring ad wins the impression
Billing    → Advertiser pays per click (CPC) or per impression (CPM)

The platform's goal:
  Maximize revenue = Σ impressions × P(click) × cost_per_click
  Subject to: user experience constraints (ad load, relevance)
\`\`\`

## CTR Prediction as ML Problem

\`\`\`
Input:   (user, ad, context) tuple
Output:  P(click | user, ad, context) ∈ [0, 1]
Label:   1 if user clicked, 0 if ad was shown but not clicked
Loss:    Binary cross-entropy = -[y*log(p) + (1-y)*log(1-p)]

This is a binary classification problem at massive scale.
\`\`\`

## Beyond CTR: Multi-Objective Optimization

Modern ad systems predict multiple objectives simultaneously:

\`\`\`
Prediction Target          Business Purpose
──────────────────────────────────────────────────────────────
P(click)                   Click-through rate (primary signal)
P(conversion|click)        Post-click value (purchase, signup)
P(long_click)              Engagement quality (dwell > 10s)
P(hide|impression)         Negative user experience signal
P(share|click)             Organic amplification signal
Expected revenue           bid × P(click) × P(conversion)

Final ad score (auction):
  score = bid × P(click) × P(conversion) - α × P(hide)

The penalty term α × P(hide) ensures ads that users dislike
are penalized even if advertisers bid high.
\`\`\`

## Bid Optimization

\`\`\`
Second-Price Auction (traditional):
  Winner pays the second-highest bid + $0.01
  Incentivizes truthful bidding

VCG (Vickrey-Clarke-Groves):
  Winner pays the externality they impose on other advertisers
  Used in more complex multi-slot auctions

Auto-Bidding:
  Advertiser sets a budget and goal (e.g., "maximize conversions for $10K/day")
  Platform's ML system optimizes bids per-impression
  Increasingly common — shifts optimization burden to the platform
\`\`\`

## Key Metrics

\`\`\`
ML Metrics:
  AUC-ROC              → Ranking quality of CTR predictions
  Log Loss (NE)        → Calibration — P(click)=0.05 should mean 5% click rate
  Calibration Error    → |predicted_CTR - observed_CTR| across buckets
  Normalized Entropy   → NE = log_loss / entropy(background_CTR)

Business Metrics:
  Revenue per 1000 Impressions (RPM)
  Advertiser Return on Ad Spend (ROAS)
  User Ad Engagement Rate
  Ad Load (% of content that is ads)
  Advertiser Churn Rate
\`\`\`

## Why Calibration Matters

\`\`\`
Unlike search ranking where only ordering matters,
ad prediction needs CALIBRATED probabilities.

Why: The auction multiplies P(click) × bid.
  If P(click) is systematically 2x too high:
    - Advertisers overpay → they leave the platform
  If P(click) is systematically 2x too low:
    - Platform under-charges → revenue loss

Calibration techniques:
  - Platt scaling: fit a logistic function on validation set
  - Isotonic regression: non-parametric calibration
  - Temperature scaling: scale logits by learned temperature T
\`\`\`

**Interview tip:** Emphasize calibration early. This distinguishes ad prediction from generic classification problems. An interviewer at Meta or Google will specifically probe whether you understand why calibrated probabilities — not just rankings — are critical for auction-based systems.`,
    },
    {
      id: "ad-features",
      slug: "ad-feature-engineering",
      title: "Ad Prediction: Feature Engineering",
      content: `# Ad Prediction: Feature Engineering

## Feature Categories

Ad prediction features span four major categories. The interaction between these categories — cross features — is where most of the predictive power lies.

## Ad Features

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
ad_id_embedding             vector      Learned embedding for the ad
advertiser_id               categorical Advertiser identity
ad_format                   categorical Image, video, carousel, text
ad_category                 categorical E-commerce, gaming, finance, etc.
creative_text_embedding     vector      NLP embedding of ad copy
image_embedding             vector      CNN/ViT embedding of ad image
video_duration              numeric     Length of video ad (if applicable)
landing_page_quality        numeric     Page load speed, mobile-friendly score
historical_ctr              numeric     Ad's lifetime CTR across all users
historical_cvr              numeric     Ad's conversion rate
days_since_creation         numeric     Ad fatigue indicator
bid_amount                  numeric     Advertiser's bid for this impression
campaign_budget_remaining   numeric     Budget pressure (low = aggressive bidding)
\`\`\`

## User Features

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
user_id_embedding           vector      Learned user embedding
age_bucket                  categorical 18-24, 25-34, 35-44, etc.
gender                      categorical Privacy-compliant demographic
country / region            categorical Geographic targeting
interests                   multi-hot   Inferred from behavior (sports, tech, fashion)
user_ad_click_rate          numeric     User's overall tendency to click ads
user_ad_hide_rate           numeric     User's tendency to hide/report ads
days_since_last_ad_click    numeric     Recency of ad engagement
purchase_history_categories vector      E-commerce purchase patterns
device_type                 categorical iOS, Android, Desktop
app_version                 categorical Newer versions may render ads differently
user_engagement_level       categorical Daily active, weekly, monthly
\`\`\`

## Context Features

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
hour_of_day                 numeric     Time-based CTR patterns
day_of_week                 categorical Weekend vs weekday behavior
feed_position               numeric     Position in the content feed
content_before_ad           categorical Type of organic content above the ad
session_depth               numeric     How far into the session the user is
network_type                categorical WiFi vs cellular (video ad loading)
screen_size                 categorical Affects ad rendering and click area
is_holiday                  binary      Holiday shopping boosts e-commerce ads
\`\`\`

## Cross Features

Cross features capture interactions between categories. They are the single most important feature type in ad prediction.

\`\`\`
Feature                           Description
──────────────────────────────────────────────────────────────
user_category × ad_category       Does this user engage with this ad type?
user_age × ad_category            Age-specific ad preferences
user_device × ad_format           Video ads perform differently on mobile vs desktop
user_country × advertiser         Regional brand awareness
hour × ad_category                E-commerce ads peak in evening, B2B in morning
user_interest × ad_category       Direct relevance matching
historical(user, advertiser)      Has this user clicked this advertiser before?
historical(user, ad_category)     User's CTR for this ad category

Computing cross features:
  Explicit: Engineer specific crosses (user_age × ad_category)
  Implicit: Let the model learn (embeddings, deep networks)

  Meta's approach: Both. Explicit crosses as features + deep network
  for implicit interactions.
\`\`\`

## Feature Freshness

Different features have different freshness requirements:

\`\`\`
Update Frequency       Features                        Storage
──────────────────────────────────────────────────────────────
Static (days)          User demographics, ad metadata   Batch DB
Hourly                 Ad historical CTR, user prefs    Feature store
Near real-time (min)   Campaign budget, bid amounts     Streaming
Real-time (per req)    Context, position, session       Computed inline

The tension: Fresher features improve predictions but increase
serving complexity and latency.

Example: A user who just purchased running shoes should immediately
stop seeing running shoe ads. This requires near-real-time
purchase signals in the feature pipeline.
\`\`\`

## Feature Engineering at Scale

\`\`\`
Challenge                   Solution
──────────────────────────────────────────────────────────────
Billions of feature values  Feature hashing (hash trick) to fixed-size vectors
High-cardinality IDs        Embedding tables with vocabulary caps
Missing values              Default embeddings, "unknown" category
Feature drift               Monitoring dashboards, automated alerts
Privacy regulations         Differential privacy, federated learning, on-device
Feature computation cost    Pre-compute + cache, tiered freshness

Feature Hashing Example:
  Instead of one-hot encoding 10M ad_ids (10M-dim sparse vector):
  hash(ad_id) % 1M → 1M-dim vector (100x compression)
  Collisions are acceptable — the model learns to be robust.
\`\`\`

**Interview tip:** When discussing ad features, always mention the privacy dimension. Features like user browsing history, purchase data, and demographic targeting face increasing regulatory scrutiny (GDPR, CCPA, ATT). Show that you understand the shift toward privacy-preserving approaches: on-device models, federated learning, contextual targeting, and cohort-based signals instead of individual tracking.`,
    },
    {
      id: "ad-model",
      slug: "ad-model-architecture",
      title: "Ad Prediction: Model Architecture",
      content: `# Ad Prediction: Model Architecture

## The Evolution: LR to GBDT to Deep

Ad prediction models have evolved through distinct generations, each building on the previous one's limitations.

### Generation 1: Logistic Regression (2000s)

\`\`\`
P(click) = σ(w · x + b) = 1 / (1 + exp(-(w · x + b)))

Features: Hand-crafted, heavily crossed
  x = [user_age=25-34, ad_category=shoes, user_age×ad_category, ...]
  Millions of sparse binary features

Training: Online learning with FTRL (Follow The Regularized Leader)
  - Updates model with each new impression
  - L1 regularization for sparsity (billions of features, most zero)

Used at Google (2013 paper: "Ad Click Prediction: a View from the Trenches")

Pros: Simple, interpretable, fast inference, handles sparse features
Cons: Cannot learn feature interactions automatically
      Requires massive manual feature engineering
\`\`\`

### Generation 2: GBDT (2010s)

\`\`\`
Gradient Boosted Decision Trees (XGBoost, LightGBM)

Automatically learns feature interactions through tree splits.
Each tree corrects errors of previous trees.

Facebook's approach (2014):
  1. Train GBDT on raw features
  2. Use leaf node indices as new features
  3. Feed these into Logistic Regression
  GBDT acts as automatic feature engineer.

Pros: Learns non-linear interactions, handles mixed feature types
Cons: Cannot learn embeddings, struggles with high-cardinality categorical
      features (user_id, ad_id)
\`\`\`

### Generation 3: Deep Learning (2016+)

#### Wide & Deep (Google, 2016)

\`\`\`
Wide Component               Deep Component
[Cross Features]             [Dense Features]
      |                           |
[Linear Model]              [Embedding Layer]
      |                      [FC → ReLU]
      |                      [FC → ReLU]
      |                      [FC → ReLU]
      \\                         /
       \\                       /
        [Concatenate + Sigmoid]
               |
           P(click)

Wide: Memorization — specific feature crosses (user_A liked ad_B)
Deep: Generalization — embedding-based feature interactions

This architecture is still widely used in production.
\`\`\`

#### DeepFM (2017)

\`\`\`
[Sparse Features]
       |
[Embedding Layer]
       |
  ┌────┴────┐
  |         |
[FM Layer]  [DNN Layer]
  |         |
  └────┬────┘
       |
  [Sigmoid → P(click)]

FM (Factorized Machine) replaces the wide component:
  FM captures all pairwise feature interactions automatically
  via learned embeddings: Σ <v_i, v_j> * x_i * x_j

No manual feature crossing needed.
\`\`\`

#### DIN — Deep Interest Network (Alibaba, 2018)

\`\`\`
Key insight: Not all of a user's history is relevant to the current ad.
A user who bought running shoes AND cookbooks — the running shoe purchase
matters for a Nike ad, the cookbook does not.

[User Behavior Sequence]    [Candidate Ad]
  [Item 1] [Item 2] [Item 3]     |
     |        |        |         |
  [Attention Weights w.r.t. Candidate Ad]
     |        |        |
  [Weighted Sum = User Interest Representation]
                    |
              [Concat with Ad Features]
                    |
              [FC → ReLU → FC]
                    |
              [Sigmoid → P(click)]

Attention mechanism: Only activates relevant parts of user history.
Massive improvement for users with long, diverse behavior histories.
\`\`\`

## Calibration

Ranking accuracy (AUC) and calibration are both critical:

\`\`\`
Technique               How It Works
──────────────────────────────────────────────────────────────
Platt Scaling           Fit σ(a*logit + b) on validation data
Isotonic Regression     Non-parametric monotonic mapping
Temperature Scaling     P = σ(logit / T), learn T on validation
Histogram Binning       Bin predictions, replace with empirical CTR

Production approach at Meta:
  1. Train deep model for ranking (AUC focus)
  2. Apply Platt scaling for calibration (calibration focus)
  3. Monitor calibration daily — recalibrate if drift detected
\`\`\`

## Model Comparison

\`\`\`
Model          AUC     Calibration  Latency   Feature Engineering
──────────────────────────────────────────────────────────────────
LR             0.72    Good         < 1ms     Heavy manual work
GBDT           0.76    Good         5-10ms    Moderate
Wide & Deep    0.78    Needs work   10-20ms   Moderate
DeepFM         0.79    Needs work   15-25ms   Light
DIN            0.81    Needs work   20-40ms   Light

Numbers are illustrative — actual values depend on the dataset.
In production, even a 0.1% AUC improvement can mean millions in revenue.
\`\`\`

**Interview tip:** Discuss the trade-off between model complexity and serving latency. At 100B impressions per day, a model that takes 40ms vs 10ms means 4x more compute cost. Mention model distillation — training a small "student" model to mimic a large "teacher" model — as a practical solution for serving complex models at low latency.`,
    },
    {
      id: "ad-pipeline",
      slug: "ad-training-pipeline",
      title: "Ad Prediction: Training Pipeline",
      content: `# Ad Prediction: Training Pipeline

## The Training Pipeline Architecture

Ad prediction models require a sophisticated training pipeline because of the massive scale and the need for model freshness.

\`\`\`
Data Flow:
  Impression Logs → [Join with Click/Conversion Labels]
                  → [Feature Computation]
                  → [Training Data Store]
                  → [Model Training]
                  → [Validation & Calibration]
                  → [Model Registry]
                  → [Serving Infrastructure]

Scale Context:
  - 100B+ impressions/day → 100B+ training examples/day
  - 1000s of features per example
  - Training data grows by ~1TB/day
  - Model must be retrained daily (or more frequently)
\`\`\`

## Feature Store Architecture

The feature store is the backbone of the training pipeline. It ensures consistency between training and serving features.

\`\`\`
                    ┌─────────────────┐
                    │   Feature Store  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         [Offline]     [Near-RT]      [Real-Time]
         (batch)       (streaming)    (per-request)
              │              │              │
         User profiles  Trending     Session context
         Ad metadata    Budget left  Feed position
         Historical CTR  Recent acts  Device info
              │              │              │
         Updated: daily  Updated: min  Computed: inline
         Store: Hive     Store: Redis  Store: in-memory
              │              │              │
              └──────────────┼──────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
         [Training Pipeline]         [Serving Pipeline]
         Same feature definitions!   Same feature definitions!
\`\`\`

## Training / Serving Skew

The most dangerous bug in ML pipelines — features computed differently during training vs serving.

\`\`\`
Common Causes:
  1. Code duplication: Training uses Python/Spark, serving uses C++/Java
     → Subtle numerical differences in feature computation
  2. Temporal leakage: Training uses future data that won't exist at serving
     → "User purchased this product" used before the ad was shown
  3. Stale features: Training uses point-in-time features, serving uses latest
     → Historical CTR changes between training and serving
  4. Missing features: A feature available in training logs but unavailable
     at serving time (e.g., post-impression data)

Prevention:
  - Shared feature definitions (one codebase, used by both pipelines)
  - Point-in-time joins (reconstruct features as they were at impression time)
  - Feature monitoring (compare training and serving distributions)
  - Integration tests (compare features computed both ways on same data)
\`\`\`

## Model Freshness and Training Frequency

\`\`\`
Freshness Matters:
  Ad ecosystems change rapidly:
    - New ads launch daily (cold start)
    - Trending topics shift hourly
    - Seasonal patterns (Black Friday, holidays)
    - User interests evolve

Training Strategies:
  Strategy           Frequency    Pros                 Cons
  ──────────────────────────────────────────────────────────────
  Full retrain       Daily        Clean model          Expensive, 12-24hr lag
  Incremental        Hourly       Fresh, efficient     Can diverge over time
  Online learning    Per-event    Always fresh         Unstable, hard to debug
  Hybrid             Mixed        Best of both         Complex infrastructure

Production Approach (typical at Meta/Google):
  1. Full retrain daily on last 30 days of data
  2. Incremental updates every few hours on recent data
  3. Periodically re-initialize from full retrain to prevent drift
\`\`\`

## Label Design and Attribution

\`\`\`
Click Labels:
  - Positive: User clicked the ad (within impression session)
  - Negative: Ad was shown, user did not click
  - Join window: Clicks attributed within 30 seconds of impression

Conversion Labels:
  - Positive: User converted (purchased, signed up) after clicking
  - Attribution window: 1-7 days after click
  - Challenge: Long attribution windows delay training data availability

Delayed Feedback Problem:
  At training time, recent impressions may not have final labels yet.
  A user might convert 3 days after clicking.

  Solutions:
    1. Wait for attribution window → freshness loss
    2. Train on partial labels, correct later → noise
    3. Importance weighting: upweight examples with complete labels
    4. Multi-task: predict P(click) immediately, P(conversion) with delay
\`\`\`

## Data Sampling and Class Imbalance

\`\`\`
Raw CTR is typically 1-3%. This means 97-99% of examples are negatives.

Negative Downsampling:
  - Sample 10-20% of negatives, keep all positives
  - Train on balanced-ish dataset
  - Correct predictions: P_corrected = P_model / (P_model + (1-P_model)/sampling_rate)
  - This correction restores calibration

Benefits of downsampling:
  - 5-10x less training data → faster training
  - Better gradient signal (less dominated by easy negatives)
  - Negligible AUC loss (< 0.1%)
\`\`\`

## Pipeline Monitoring

\`\`\`
Monitor                      Alert Threshold
──────────────────────────────────────────────────────────────
Training data volume         > 20% deviation from expected
Feature distribution         KL-divergence > threshold per feature
Label distribution           CTR deviates > 10% from 7-day average
Model AUC on validation      Drops > 0.5% from previous model
Calibration error            > 5% systematic over/under-prediction
Training time                > 2x expected duration
Feature coverage             Any feature < 90% non-null

Automated rollback:
  If new model fails validation checks → keep serving previous model.
  Alert on-call engineer. Never ship a model that fails checks.
\`\`\`

**Interview tip:** Training pipeline questions test whether you can build ML systems, not just models. Emphasize the training-serving consistency problem — it is the number one source of production ML bugs. Mention feature stores, point-in-time correctness, and automated monitoring as your defense strategy.`,
    },
    {
      id: "ad-serving",
      slug: "ad-online-serving",
      title: "Ad Prediction: Online Serving",
      content: `# Ad Prediction: Online Serving

## Latency Requirements

Ad prediction operates under extreme latency constraints. Every millisecond of latency costs revenue.

\`\`\`
End-to-End Budget: < 200ms for full page load

Breakdown:
  Network round trip:        30-50ms
  Ad auction + retrieval:    20-30ms
  Feature computation:       10-20ms
  Model inference:           10-30ms
  Re-ranking + business logic: 5-10ms
  Creative rendering:        50-80ms
  Buffer:                    10-30ms

The ML model gets 10-30ms to score potentially hundreds of ads.
At 100B impressions/day ≈ 1.2M QPS, this is massive compute.
\`\`\`

## Serving Architecture

\`\`\`
User Request
    │
    ▼
[Ad Server]
    │
    ├── [Targeting] → Filter eligible ads (budget, geo, frequency cap)
    │                  1M ads → ~1000 eligible ads
    │
    ├── [Feature Fetch] → Parallel fetches from feature store
    │     User features:  Redis lookup (< 1ms)
    │     Ad features:    Pre-computed, in-memory cache
    │     Context:        Computed inline from request
    │
    ├── [Pre-Scoring] → Lightweight model on 1000 ads
    │                    Simple dot-product or small DNN
    │                    1000 → 100 candidates
    │
    ├── [Full Scoring] → Heavy model on top 100 ads
    │                    Deep model with full feature set
    │                    100 → ranked list
    │
    ├── [Auction] → Apply bid × P(click) × P(conversion)
    │               Determine winners and pricing
    │
    ├── [Pacing] → Spread advertiser budget across the day
    │              Don't exhaust budget in morning peak
    │
    └── [Response] → Return winning ads with creative assets
\`\`\`

## Model Compression

Production models are too large and slow for the latency budget. Compression techniques make them servable.

\`\`\`
Technique              Compression    Latency Impact    AUC Loss
──────────────────────────────────────────────────────────────────
Knowledge Distillation  5-10x smaller  50-70% faster    < 0.1%
Quantization (FP16)     2x smaller     30-50% faster    < 0.05%
Quantization (INT8)     4x smaller     50-70% faster    < 0.2%
Pruning                 2-5x smaller   30-60% faster    < 0.1%
Embedding table compression 10-100x   20-40% faster    < 0.2%

Knowledge Distillation:
  Teacher: Large model trained offline (no latency constraint)
  Student: Small model trained to mimic teacher's predictions
  Loss = α * CE(y, student) + (1-α) * KL(teacher || student)
  The student learns the teacher's "dark knowledge" — soft probabilities
  that contain more information than hard labels.

Embedding Compression:
  Challenge: Embedding tables for user_id and ad_id can be 10s of GB
  Solutions:
    - Hash embedding: share embeddings across IDs
    - Mixed-dimension: popular IDs get larger embeddings
    - Compositional: combine smaller sub-embeddings
    - Quantized embeddings: store in INT8 instead of FP32
\`\`\`

## Caching Strategies

\`\`\`
What to Cache              TTL        Hit Rate
──────────────────────────────────────────────────────────────
User features              5 min      90%+ (same user, multiple requests)
Ad features                1 hour     95%+ (ads change slowly)
Pre-computed ad scores     1 min      50-70% (for popular user segments)
Model embeddings           1 day      99%+ (model updates daily)
Auction results            None       0% (never cache — bids change constantly)

Multi-Level Cache:
  L1: In-process memory (fastest, smallest)
  L2: Shared memory / memcached (fast, medium)
  L3: Redis cluster (moderate, large)
  L4: Feature store DB (slow, complete)

  Request hits L1 first, falls through to L4 on miss.
\`\`\`

## Real-Time Bidding (RTB)

\`\`\`
RTB Flow (when ads are served across multiple platforms):

  Publisher's page loads
       │
       ▼
  [Supply-Side Platform (SSP)] → "I have an impression for user X"
       │
       ▼
  [Ad Exchange] → Broadcasts bid request to all DSPs
       │
       ├── [DSP 1] → Runs ML model → Returns bid: $0.05
       ├── [DSP 2] → Runs ML model → Returns bid: $0.08
       └── [DSP 3] → Runs ML model → Returns bid: $0.03
       │
       ▼
  [Ad Exchange] → DSP 2 wins. Pays $0.051 (second price + $0.01)
       │
       ▼
  [DSP 2's ad is shown to user]

  Total time for this entire flow: < 100ms
  The DSP's ML model must respond in < 50ms.
\`\`\`

## Handling Failures Gracefully

\`\`\`
Failure Mode              Fallback Strategy
──────────────────────────────────────────────────────────────
Feature store timeout     Use cached features (stale but available)
Model server overloaded   Lightweight fallback model (LR or rules)
Ad index unavailable      Show organic content (no ads)
Budget service down       Use last-known budget; reconcile later
High latency spike        Return fewer ads (reduce candidate set)

Circuit Breaker Pattern:
  If feature store fails > 5% of requests in 1 minute:
    → Open circuit: skip that feature, use default
    → After 30 seconds: half-open, try again
    → If recovered: close circuit, resume normal
\`\`\`

## Scaling to 1M+ QPS

\`\`\`
Infrastructure:
  - Model serving: GPU clusters with TensorFlow Serving / Triton
  - Feature store: Redis Cluster (100+ nodes) + in-memory cache
  - Load balancing: Consistent hashing across ad servers
  - Horizontal scaling: Add more replicas as QPS grows
  - Batch inference: Score multiple ads in one GPU call (vectorized)

Cost Optimization:
  - Pre-scoring filters out 90% of ads cheaply → 10x less GPU work
  - Model quantization → 2-4x less GPU memory per model
  - Spot instances for non-critical traffic
  - Geographic distribution: serve from nearest data center

Typical production setup:
  - 10,000+ CPU cores for feature computation
  - 1,000+ GPUs for model inference
  - 500+ Redis nodes for feature storage
  - 99.99% uptime SLA (< 52 min downtime/year)
\`\`\`

**Interview tip:** Online serving questions test systems thinking, not just ML knowledge. Discuss the multi-stage funnel (targeting, pre-scoring, full scoring, auction) and explain why each stage exists. Mention specific latency numbers and compute scale. Interviewers want to see that you can reason about the full production stack — from feature stores to model compression to graceful degradation.`,
    },
  ],
};

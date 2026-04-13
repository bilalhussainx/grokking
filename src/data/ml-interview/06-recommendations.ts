import { Module } from "../types";

export const recommendationsModule: Module = {
  id: "ml-recommendations",
  title: "ML System Design: Recommendations",
  description: "Design a recommendation system end-to-end — problem formulation, collaborative and content-based filtering, feature engineering, model architecture, and evaluation.",
  lessons: [
    {
      id: "rec-formulation",
      slug: "rec-problem-formulation",
      title: "Problem Formulation for Recommendations",
      content: `# Problem Formulation for Recommendations

## The Interview Setup

"Design a recommendation system for Netflix / YouTube / Amazon." This is one of the most common ML system design questions. The key is translating a vague business goal into a concrete ML problem.

## Clarifying Questions

Always start here — the answers shape every downstream decision:

\`\`\`
1. What is the product?          → Video streaming (Netflix-like)
2. What are we recommending?     → Movies and TV shows to users
3. Scale?                        → 200M users, 50K titles, 1B+ interactions/day
4. What data is available?       → Watch history, ratings, searches, browse behavior
5. What are we optimizing?       → Watch time + user retention
6. Latency requirements?         → Homepage loads in < 500ms
\`\`\`

## Types of Recommendation Systems

\`\`\`
Type                    Approach                         When to Use
──────────────────────────────────────────────────────────────────────
Collaborative Filtering Uses user-item interaction data   Rich interaction history
Content-Based           Uses item/user attributes         New items with metadata
Hybrid                  Combines both                     Production systems
Knowledge-Based         Uses explicit user requirements   High-stakes (real estate)
Context-Aware           Incorporates session/time context Time-sensitive recs
\`\`\`

## Business Metrics vs ML Metrics

A critical distinction in interviews — the model optimizes ML metrics, but the business cares about business metrics.

\`\`\`
Business Metrics:
  Monthly Active Users (MAU)       — Are users coming back?
  Watch Time per Session           — Are users engaged?
  Subscription Retention Rate      — Are users staying subscribed?
  Content Discovery Rate           — Are users watching new genres?
  Revenue per User (ARPU)          — Monetization impact

ML / Offline Metrics:
  Hit Rate@K         — Did the user interact with a top-K recommendation?
  NDCG@K             — Ranking quality of recommended list
  Recall@K           — Fraction of relevant items in top-K
  Coverage            — % of catalog recommended to at least one user
  Diversity           — How varied are the recommendations?
\`\`\`

## Offline vs Online Evaluation

\`\`\`
Offline Evaluation:
  - Train on historical data, evaluate on held-out interactions
  - Fast iteration (hours), but biased by logged policy
  - Cannot measure novelty, serendipity, or user satisfaction
  - Common pitfall: model optimizes for popular items (popularity bias)

Online Evaluation (A/B Test):
  - Split live traffic between old and new model
  - Measures actual user behavior and business impact
  - Slow iteration (weeks), expensive, risk of hurting experience
  - Essential before any production launch

The Gap:
  Offline improvements do NOT always translate to online gains.
  A model with +5% NDCG might show 0% or negative business impact
  if it reduces diversity or over-fits to binge-watching patterns.
\`\`\`

## System Architecture Overview

\`\`\`
User Request → [Candidate Generation] → [Scoring/Ranking] → [Re-ranking] → Results

Stage 1: Candidate Generation (recall-focused)
  - Retrieve ~1000 items from 50K catalog
  - Multiple sources: collaborative filtering, content-based, trending, popular
  - Cheap models (embeddings + ANN search)

Stage 2: Scoring / Ranking (precision-focused)
  - Score each candidate with a rich feature model
  - Uses user history, item features, context features
  - Returns top ~100 scored items

Stage 3: Re-ranking (business logic)
  - Diversity: don't show 5 action movies in a row
  - Freshness: boost newly added content
  - Business rules: promote original content, contractual obligations
  - Exploration: inject some items outside user comfort zone
\`\`\`

**Interview tip:** Always discuss the tension between relevance and diversity. A system that only shows what users already like creates filter bubbles and eventually bores them. Balancing exploitation (known preferences) vs exploration (new content) is a key design decision.`,
    },
    {
      id: "rec-collaborative-content",
      slug: "rec-collaborative-content",
      title: "Collaborative vs Content-Based Filtering",
      content: `# Collaborative vs Content-Based Filtering

## Collaborative Filtering

Collaborative filtering exploits the intuition that users who agreed in the past will agree in the future. It needs no item metadata — only the user-item interaction matrix.

### User-User CF

\`\`\`
Idea: Find users similar to the target user, recommend what they liked.

Steps:
  1. Build user-item interaction matrix R (ratings or implicit feedback)
  2. Compute similarity between users: cosine, Pearson, Jaccard
  3. For target user u, find K most similar users
  4. Recommend items those neighbors liked that u hasn't seen

sim(u, v) = cos(R_u, R_v) = (R_u · R_v) / (||R_u|| * ||R_v||)

Prediction: r̂(u, i) = Σ sim(u, v) * r(v, i) / Σ |sim(u, v)|
                        for v in neighbors(u) who rated item i

Problems:
  - Sparsity: most users rate few items → sparse similarity estimates
  - Scalability: O(N² users) to compute all pairwise similarities
  - Cold start: new users have no history → no neighbors
\`\`\`

### Item-Item CF

\`\`\`
Idea: Find items similar to what the user already liked.

Steps:
  1. Compute similarity between items based on co-rating patterns
  2. For target user u, look at items u liked
  3. Recommend items most similar to those

Advantages over User-User:
  - Item similarities are more stable (items don't change, users do)
  - Fewer items than users → more scalable
  - Amazon's original recommendation engine used Item-Item CF

sim(i, j) = cos(R_i, R_j)  where R_i = vector of all user ratings for item i
\`\`\`

## Content-Based Filtering

Uses item and user attributes instead of collaborative signals.

\`\`\`
Item Features:
  - Genre, director, cast, year, language
  - Text embeddings of description/reviews
  - Visual features from posters/thumbnails
  - Audio features from content (music recommendations)

User Profile:
  - Aggregation of features from items user interacted with
  - Weighted by recency and interaction strength
  - TF-IDF or embedding-based representation

Prediction:
  score(u, i) = similarity(user_profile(u), item_features(i))

Advantages:
  - No cold start for new items (features available immediately)
  - Transparent: "recommended because you liked Action movies"
  - Works with sparse interaction data

Limitations:
  - Over-specialization: only recommends similar items
  - No serendipity: never suggests outside user's known preferences
  - Feature engineering burden: need good item features
\`\`\`

## Hybrid Approaches

Production systems almost always use hybrid methods. Several combination strategies exist:

\`\`\`
Strategy               How It Works
──────────────────────────────────────────────────────────────
Weighted Hybrid        score = w₁*CF_score + w₂*CB_score
Switching Hybrid       Use CB for new items, CF for established items
Feature Augmentation   Use CF embeddings as features in a CB model
Cascade               CF generates candidates, CB re-ranks
Meta-Learning          A model learns which method to trust per user
\`\`\`

## The Cold Start Problem

\`\`\`
New User (no history):
  - Show popular / trending items
  - Ask explicit preferences on signup (onboarding quiz)
  - Use demographic features (age, location)
  - Content-based on first few interactions (fast adaptation)

New Item (no interactions):
  - Content-based features from metadata
  - Exploration: boost exposure to collect interaction data
  - Transfer from similar items (same director, genre, cast)

New System (no data at all):
  - Start with content-based + popularity
  - Collect interaction data aggressively
  - Transition to collaborative filtering as data grows
\`\`\`

**Interview tip:** When discussing recommendations, always address cold start. It is the most common follow-up question. Show that you understand the progression from content-based (data-poor) to collaborative (data-rich) as the system matures.`,
    },
    {
      id: "rec-features",
      slug: "rec-feature-engineering",
      title: "Feature Engineering for Recommendations",
      content: `# Feature Engineering for Recommendations

## Feature Categories

The quality of a recommendation model depends heavily on features. Features for recommendations fall into four categories: user, item, interaction, and context.

## User Features

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
user_age_bucket             categorical Teen, 18-25, 26-35, 36-50, 50+
user_country                categorical Geographic preferences
user_language               categorical Content language preference
account_age_days            numeric     How long the user has been active
total_watch_hours           numeric     Lifetime engagement
avg_session_length          numeric     Typical session duration
genre_distribution          vector      Normalized watch counts per genre
favorite_actors             vector      Top-K actor embeddings
watch_time_of_day           vector      Hour-of-day distribution
binge_score                 numeric     Tendency to watch multiple episodes
user_embedding              vector      Learned latent representation
subscription_tier           categorical Free, Basic, Premium
\`\`\`

## Item Features

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
genre                       multi-hot   Action, Comedy, Drama, etc.
release_year                numeric     Content recency
avg_rating                  numeric     Global average user rating (1-5)
num_ratings                 numeric     Total rating count (popularity proxy)
duration_minutes            numeric     Episode/movie length
language                    categorical Original language
cast_embeddings             vector      Aggregated actor embeddings
director_embedding          vector      Director representation
description_embedding       vector      NLP embedding of synopsis
content_maturity            categorical G, PG, PG-13, R
is_original                 binary      Platform original content
days_since_added            numeric     Freshness on platform
completion_rate             numeric     % of users who finish watching
\`\`\`

## Interaction Features

These capture the relationship between a specific user and item. They are the most predictive but require computation at serving time.

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
user_genre_affinity         numeric     User's watch % in item's genre
user_director_history       binary      Has user watched this director before?
user_actor_overlap          numeric     # of item actors user has watched
user_item_embedding_sim     numeric     Cosine sim of user and item embeddings
similar_item_interactions   numeric     How much user engaged with similar items
user_franchise_history      binary      Has user watched prior sequels?
collaborative_score         numeric     CF prediction for this (user, item) pair
friends_watched             numeric     Social signal — how many friends watched
\`\`\`

## Temporal Features

Temporal patterns are critical for recommendations. User preferences change by time of day, day of week, and season.

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
hour_of_day                 numeric     Morning vs evening preferences
day_of_week                 categorical Weekend binge vs weekday quick watch
days_since_last_interaction numeric     User recency / re-engagement
time_since_item_release     numeric     Is this a buzzy new release?
seasonal_relevance          numeric     Holiday movies in December
user_watch_velocity         numeric     Items watched in last 7 days
last_genre_watched          categorical Session continuity signal
session_position            numeric     First rec vs 5th in a session
\`\`\`

## Feature Engineering Best Practices

\`\`\`
1. Recency weighting — Recent interactions matter more than old ones.
   Use exponential decay: weight = exp(-λ * days_since_interaction)

2. Normalization — User engagement varies wildly. A power user with
   1000 watches and a casual user with 10 watches need normalized features.
   Use per-user normalization for interaction counts.

3. Cross features — User-item interaction features (e.g., user_genre_affinity)
   are more predictive than user or item features alone.

4. Negative signals — Track skips, back-button presses, and early abandonment.
   A user who watched 2 minutes of a 2-hour movie gave a strong negative signal.

5. Bucketing continuous features — Convert watch_hours into buckets
   (light/medium/heavy) to capture non-linear relationships.

6. Missing value indicators — Not all users have social connections or
   rating history. Add explicit "has_X" binary features.
\`\`\`

## Feature Store Architecture

\`\`\`
Offline Features (batch-computed, updated daily):
  - User embeddings, genre distributions, lifetime stats
  - Item popularity scores, average ratings, completion rates
  - Stored in: Redis / DynamoDB for low-latency lookup

Near-Real-Time Features (updated every few minutes):
  - Trending items, session-level signals
  - Stored in: Streaming feature store (Feast, Tecton)

Real-Time Features (computed at request time):
  - User-item interaction features
  - Session context (time, device, current page)
  - Computed in: Ranking service at inference time
\`\`\`

**Interview tip:** Feature stores are a common follow-up topic. Interviewers want to hear that you understand the trade-off between feature freshness and computation cost. Explain that user embeddings can be batch-computed daily, but session context must be real-time.`,
    },
    {
      id: "rec-model",
      slug: "rec-model-architecture",
      title: "Recommendation Model Architecture",
      content: `# Recommendation Model Architecture

## The Evolution of Recommendation Models

\`\`\`
Generation 1: Heuristic        → Popularity, editorial picks
Generation 2: Neighborhood CF  → User-User, Item-Item similarity
Generation 3: Matrix Factorization → SVD, ALS, BPR
Generation 4: Deep Learning    → Two-Tower, NCF, Autoencoders
Generation 5: Sequential       → Transformers, SASRec, BERT4Rec
\`\`\`

## Matrix Factorization

The foundational approach. Decomposes the user-item interaction matrix into low-rank factors.

\`\`\`
R ≈ U × V^T

R: user-item matrix (M users × N items)
U: user factor matrix (M × K)
V: item factor matrix (N × K)
K: latent dimension (typically 50-200)

Prediction: r̂(u, i) = U_u · V_i = Σ u_k * v_k

Training (ALS — Alternating Least Squares):
  1. Fix V, solve for U: U = R * V * (V^T * V + λI)^-1
  2. Fix U, solve for V: V = R^T * U * (U^T * U + λI)^-1
  3. Repeat until convergence

For implicit feedback (clicks, watches) use Weighted ALS:
  Loss = Σ c_ui * (r_ui - U_u · V_i)² + λ(||U||² + ||V||²)
  where c_ui = 1 + α * interactions(u, i)

Pros: Simple, scalable, interpretable latent factors
Cons: Cannot incorporate side features, linear interaction only
\`\`\`

## Two-Tower Model (Deep Retrieval)

The dominant architecture for large-scale candidate generation.

\`\`\`
User Tower                    Item Tower
    |                             |
[User ID Embedding]          [Item ID Embedding]
[User Features]              [Item Features]
    |                             |
[FC → ReLU → FC]            [FC → ReLU → FC]
[FC → ReLU → FC]            [FC → ReLU → FC]
    |                             |
[User Embedding (128d)]      [Item Embedding (128d)]
    \\                           /
     \\                         /
      [Dot Product / Cosine Sim]
           |
       [Score]

Training:
  - Sampled softmax or in-batch negatives
  - Loss: -log(exp(u·v+) / Σ exp(u·v-))
  - Batch size 4096-8192 for good negative sampling

Serving:
  - Pre-compute all item embeddings → store in ANN index (FAISS/ScaNN)
  - At request time: compute user embedding → ANN search → top-K items
  - Retrieval in < 10ms for millions of items

Key Advantage:
  Item embeddings are pre-computed. Only the user tower runs at serving time.
  This makes it feasible to search over millions of items in real-time.
\`\`\`

## Neural Collaborative Filtering (NCF)

\`\`\`
[User Embedding]     [Item Embedding]
       |                    |
       └────────┬───────────┘
                |
        [Concatenate]
                |
         [FC → ReLU]
         [FC → ReLU]
         [FC → ReLU]
                |
         [Sigmoid → Score]

Learns non-linear user-item interactions.
More expressive than dot-product but cannot pre-compute —
must score each (user, item) pair individually.
Used in the ranking stage, not retrieval.
\`\`\`

## Sequential Recommendation (SASRec / BERT4Rec)

\`\`\`
User's watch history: [Movie A, Movie B, Movie C, ???]

SASRec (Self-Attention Sequential Recommendation):
  [Item Emb A] [Item Emb B] [Item Emb C]
       |             |             |
  [+ Position Emb] [+ Position Emb] [+ Position Emb]
       |             |             |
  [Self-Attention Layer × L]
       |             |             |
  [Feed-Forward Layer × L]
                           |
                    [Next Item Prediction]

Captures sequential patterns:
  - "Users who watch superhero movies often watch sci-fi next"
  - "After a heavy drama, users prefer light comedy"
  - Time-decay: recent items matter more

BERT4Rec uses masked item prediction (bidirectional).
SASRec uses causal (left-to-right) attention.
\`\`\`

## The Cold Start Problem in Models

\`\`\`
Model Type               Cold Start Handling
──────────────────────────────────────────────────────────────
Matrix Factorization     Cannot handle (needs interaction history)
Two-Tower with features  Uses content features for new items/users
NCF                      Cannot handle without side information
Sequential Models        Needs minimum history length (3-5 items)

Production Solution — Multi-source candidate generation:
  Source 1: Two-tower CF        → established users + items
  Source 2: Content-based       → new items, niche interests
  Source 3: Popularity          → new users, cold start fallback
  Source 4: Trending            → viral/seasonal content
  Source 5: Social              → friends' recommendations

  Merge candidates, score with ranking model, re-rank.
\`\`\`

**Interview tip:** Always propose a multi-source candidate generation strategy. Relying on a single model creates brittleness. Show that you understand how different sources complement each other and how the system degrades gracefully for cold-start scenarios.`,
    },
    {
      id: "rec-evaluation",
      slug: "rec-evaluation",
      title: "Evaluation & A/B Testing for Recommendations",
      content: `# Evaluation & A/B Testing for Recommendations

## Offline Metrics

### NDCG@K (Normalized Discounted Cumulative Gain)

\`\`\`
Measures ranking quality with graded relevance.
NDCG@K = DCG@K / IDCG@K

In recommendations, relevance can be graded:
  0 = not interacted, 1 = clicked, 2 = watched >50%, 3 = completed, 4 = rated 5 stars

Typical production values: NDCG@10 = 0.15-0.35
(Low because most items in a large catalog are irrelevant.)
\`\`\`

### MAP (Mean Average Precision)

\`\`\`
AP@K = (1/min(K, R)) * Σ Precision@k * rel(k)    for k = 1 to K

MAP = mean(AP) across all users

Rewards placing relevant items early in the list.
Unlike NDCG, treats relevance as binary (relevant/not).
\`\`\`

### Recall@K

\`\`\`
Recall@K = |relevant items in top K| / |total relevant items|

Critical for candidate generation stage.
"Of everything the user would like, how much did we retrieve?"

Production targets:
  Retrieval stage: Recall@1000 > 0.6-0.8
  Full pipeline: Recall@20 > 0.05-0.15 (seems low, but catalog is huge)
\`\`\`

### Hit Rate@K

\`\`\`
Hit@K = 1 if at least one relevant item in top K, else 0
HR@K = mean(Hit@K) across all users

Simpler than Recall — just asks "did we get at least one right?"
Good for evaluating candidate generation.
\`\`\`

### Coverage and Diversity

\`\`\`
Catalog Coverage = |unique items recommended to any user| / |total items|
  Low coverage → popularity bias (system only recommends top 1% of items)
  Target: > 30-50% for healthy recommendations

Intra-List Diversity = avg pairwise distance of recommended items
  High diversity → user sees variety (action, comedy, documentary)
  Low diversity → repetitive recommendations (all superhero movies)

Novelty = avg inverse popularity of recommended items
  High novelty → recommending niche/long-tail items
  Low novelty → only recommending what everyone watches
\`\`\`

## Online Metrics

Online metrics measure actual user behavior in production.

\`\`\`
Metric                    What It Measures             Target Direction
──────────────────────────────────────────────────────────────────────
CTR                       Click-through rate            Higher
Watch Time / Session      Engagement depth              Higher
Completion Rate           Content quality match         Higher
Return Rate (next day)    User satisfaction              Higher
Subscription Churn        Long-term satisfaction         Lower
Content Discovery Rate    Exploration effectiveness      Higher
Sessions per Week         Overall platform engagement    Higher
\`\`\`

## A/B Testing for Recommendations

### Experiment Design

\`\`\`
1. Randomization Unit: User-level (not session-level)
   Why: Users should see consistent recommendations across sessions.
   Switching models mid-user creates confusion and measurement noise.

2. Sample Size: Power analysis before launch
   Effect size: 1-2% improvement in primary metric
   Significance: p < 0.05, power > 0.80
   Typical: 100K-1M users per arm for 1-2 weeks

3. Metric Hierarchy:
   Primary:    Watch time per session (single decision metric)
   Secondary:  CTR, completion rate, content diversity
   Guardrails: Churn rate, crash rate, latency p99
\`\`\`

### Common A/B Testing Pitfalls

\`\`\`
Pitfall                          Solution
──────────────────────────────────────────────────────────────
Novelty effect                   Wait 1+ week before measuring; users
                                 initially engage more with any change.

Network effects                  Use cluster-based randomization if
                                 users influence each other (social).

Multiple testing                 Bonferroni correction or control FDR
                                 when testing many metrics simultaneously.

Simpson's Paradox                Segment results by user cohort — a
                                 metric can improve overall but degrade
                                 for key segments.

Short-term vs long-term          A clickbait model boosts CTR short-term
                                 but increases churn long-term. Run
                                 holdout experiments for 1-3 months.

Survivorship bias                Users who churn are absent from later
                                 measurements. Track from experiment start.
\`\`\`

### Interleaving for Faster Evaluation

\`\`\`
Instead of showing different users different models:
  1. Get recommendations from Model A and Model B
  2. Interleave into a single list shown to one user
  3. Track which model's items get clicked

Team Draft Interleaving:
  - Alternately pick each model's top unpicked item
  - Credit clicks to the source model
  - Needs ~10x fewer users than standard A/B test

Used at Netflix, Spotify, and other recommendation-heavy platforms
for fast screening before committing to full A/B tests.
\`\`\`

## End-to-End Evaluation Strategy

\`\`\`
Phase 1: Offline evaluation (NDCG, Recall, Coverage)
  → Filter out clearly bad models. Takes hours.

Phase 2: Interleaving test (1-3 days, 5-10% traffic)
  → Quickly identify if new model is directionally better.

Phase 3: Full A/B test (1-2 weeks, 50/50 split)
  → Measure business metrics with statistical rigor.

Phase 4: Long-term holdout (1-3 months, 5% holdout)
  → Detect delayed effects (churn, content fatigue).
\`\`\`

**Interview tip:** Interviewers love hearing about the gap between offline and online metrics. Mention that a model can improve NDCG by 10% offline but hurt user retention online because it reduces diversity. Always advocate for the full evaluation pipeline: offline screening, interleaving, A/B test, and long-term holdout.`,
    },
  ],
};

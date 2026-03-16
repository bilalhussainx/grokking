import { Module } from "../types";

export const searchRankingModule: Module = {
  id: "ml-search-ranking",
  title: "ML System Design: Search Ranking",
  description:
    "Design a search ranking system from scratch — problem formulation, features, training data, model architecture, and evaluation.",
  lessons: [
    {
      id: "ml-search-1",
      slug: "search-problem-formulation",
      title: "Search Ranking: Problem Formulation",
      content: `# Search Ranking: Problem Formulation

## The Interview Setup

"Design a search ranking system for an e-commerce platform." This is a classic ML system design question asked at Google, Amazon, Meta, and other top companies. Let us walk through a complete solution.

## Clarifying Questions

Always start by asking clarifying questions:

\`\`\`
1. What is the product?       → E-commerce (Amazon-like)
2. Scale?                     → 100M+ products, 1B+ queries/day
3. What are we optimizing?    → Relevance + purchase probability
4. Latency requirements?      → < 200ms end-to-end
5. What data is available?    → Query logs, click data, purchase data, product catalog
\`\`\`

## Problem Framing

Search ranking can be framed several ways:

\`\`\`
Approach 1 — Pointwise (Classification/Regression):
  Given (query, document), predict relevance score.
  P(relevant | query, document)
  Simple but ignores relative ordering.

Approach 2 — Pairwise:
  Given (query, doc_A, doc_B), predict which is more relevant.
  P(doc_A > doc_B | query)
  Captures relative preferences. Used in RankNet, LambdaRank.

Approach 3 — Listwise:
  Optimize a list-level metric (NDCG) directly.
  Most aligned with the actual goal.
  Used in LambdaMART, modern neural rankers.
\`\`\`

**Recommendation:** Start with pointwise (simpler), mention pairwise/listwise as improvements.

## System Architecture Overview

\`\`\`
Query → [Query Understanding] → [Candidate Retrieval] → [Ranking] → [Re-ranking] → Results

Stage 1: Query Understanding
  - Spell correction, query expansion, intent classification
  - "iphone charger" → intent: product search, category: electronics

Stage 2: Candidate Retrieval (recall-focused)
  - Inverted index (Elasticsearch/Solr) for text matching
  - Approximate Nearest Neighbor for embedding-based retrieval
  - Returns ~1000 candidates from millions of products
  - Optimized for RECALL, not precision

Stage 3: Ranking (precision-focused)
  - ML model scores each candidate
  - Uses rich features (query-document, user, context)
  - Returns top ~100 scored results

Stage 4: Re-ranking (business logic)
  - Diversity (don't show 10 identical products)
  - Freshness boost (new products)
  - Sponsored results insertion
  - Personalization adjustments
\`\`\`

## Objectives and Metrics

\`\`\`
Offline Metrics:
  NDCG@K       — Normalized Discounted Cumulative Gain
                  Measures ranking quality with graded relevance
  MRR          — Mean Reciprocal Rank
                  Position of first relevant result
  Precision@K  — Fraction of top-K results that are relevant
  Recall@K     — Fraction of relevant results in top-K

Online Metrics:
  Click-Through Rate (CTR)     — clicks / impressions
  Conversion Rate              — purchases / clicks
  Revenue per Search           — total revenue / searches
  Session Success Rate         — % sessions with purchase
  Time to First Click          — user satisfaction proxy
  Abandonment Rate             — searches with no clicks
\`\`\`

## The Multi-Objective Challenge

Search must balance multiple objectives. A product might be highly relevant but out of stock, or highly profitable but poorly rated.

\`\`\`
Final Score = w₁ * relevance + w₂ * purchase_prob + w₃ * revenue
              - w₄ * return_rate + w₅ * freshness

Weights are tuned through A/B testing.
\`\`\`

## Exercise

Formulate the search ranking problem with objective functions and metrics.`,
      starterCode: `# Search Ranking Problem Formulation Exercise

def formulate_search_ranking():
    """Define the search ranking problem formally."""

    # TODO: Define the input space (query features, document features)
    # TODO: Define the output (what does the model predict?)
    # TODO: Define the loss function
    # TODO: Define offline and online evaluation metrics
    # TODO: Sketch the multi-stage architecture

    problem = {
        "input": "TODO: describe input features",
        "output": "TODO: describe model output",
        "loss": "TODO: describe loss function",
        "offline_metrics": ["TODO"],
        "online_metrics": ["TODO"],
        "stages": ["TODO"],
    }

    for key, value in problem.items():
        print(f"{key}: {value}")

formulate_search_ranking()`,
      solutionCode: `# Search Ranking Problem Formulation Exercise

def formulate_search_ranking():
    """Define the search ranking problem formally."""

    problem = {
        "input": (
            "Query features (text, intent, length) + "
            "Document features (title, description, category, price, rating) + "
            "Cross features (query-title match, BM25 score) + "
            "User features (history, preferences) + "
            "Context features (device, time, location)"
        ),
        "output": (
            "Relevance score P(click | query, document) or "
            "P(purchase | query, document, click) as a float in [0, 1]"
        ),
        "loss": (
            "Pointwise: Binary cross-entropy for click prediction. "
            "Pairwise: RankNet loss on (relevant, irrelevant) pairs. "
            "Listwise: LambdaRank optimizing NDCG directly."
        ),
        "offline_metrics": [
            "NDCG@10 (primary - ranking quality)",
            "MRR (first relevant result position)",
            "Precision@5 (top results quality)",
            "AUC-ROC (click prediction accuracy)",
        ],
        "online_metrics": [
            "CTR (click-through rate)",
            "Conversion Rate (purchases/searches)",
            "Revenue per Search",
            "Session Success Rate",
            "Abandonment Rate (lower is better)",
        ],
        "stages": [
            "1. Query Understanding: spell check, expansion, intent",
            "2. Retrieval: inverted index + ANN, ~1000 candidates",
            "3. Ranking: ML model with rich features, ~100 results",
            "4. Re-ranking: diversity, freshness, business rules",
        ],
    }

    for key, value in problem.items():
        print(f"\\n{key.upper()}:")
        if isinstance(value, list):
            for item in value:
                print(f"  - {item}")
        else:
            print(f"  {value}")

formulate_search_ranking()`,
    },
    {
      id: "ml-search-2",
      slug: "search-feature-engineering",
      title: "Search Ranking: Feature Engineering",
      content: `# Search Ranking: Feature Engineering

## Feature Categories

The quality of search ranking depends heavily on feature engineering. Features fall into distinct categories.

## Query Features

\`\`\`
Feature                    Type        Description
──────────────────────────────────────────────────────────────
query_length               numeric     Number of tokens
query_intent               categorical navigational / transactional / informational
query_frequency            numeric     How often this query is searched
query_specificity          numeric     Broad ("shoes") vs specific ("Nike Air Max 90 white size 10")
has_brand_mention          binary      Does query mention a brand?
is_question                binary      "how to..." or "what is..."
query_embedding            vector      Dense semantic representation
historical_ctr             numeric     Average CTR for this query
\`\`\`

## Document Features

\`\`\`
Feature                    Type        Description
──────────────────────────────────────────────────────────────
title_length               numeric     Number of tokens in title
description_length         numeric     Product description length
price                      numeric     Product price
price_percentile           numeric     Price rank within category
avg_rating                 numeric     Average user rating (1-5)
num_reviews                numeric     Total review count
days_since_listed          numeric     Product freshness
in_stock                   binary      Availability
num_images                 numeric     Product image count
seller_rating              numeric     Seller quality score
return_rate                numeric     Historical return percentage
category_depth             numeric     How specific the category is
sales_velocity             numeric     Recent sales per day
\`\`\`

## Query-Document Cross Features

These are the most important features — they capture the relationship between what the user wants and what the document offers.

\`\`\`
Feature                    Type        Description
──────────────────────────────────────────────────────────────
bm25_score                 numeric     Classic text relevance score
query_title_match          numeric     % of query tokens in title
query_title_exact_match    binary      Full query appears in title
query_description_match    numeric     % of query tokens in description
query_category_match       binary      Query intent matches doc category
embedding_cosine_sim       numeric     Semantic similarity (dense vectors)
click_through_rate         numeric     Historical CTR for this (q, d) pair
conversion_rate            numeric     Historical purchase rate
position_bias_adjusted_ctr numeric     CTR corrected for display position
\`\`\`

## User Features (Personalization)

\`\`\`
Feature                    Type        Description
──────────────────────────────────────────────────────────────
user_price_preference      numeric     Average price of past purchases
user_brand_affinity        vector      Brand purchase history
user_category_history      vector      Category browse/buy distribution
user_click_history         vector      Recent click embeddings
days_since_last_visit      numeric     Recency of engagement
user_purchase_count        numeric     Total purchases (power user?)
user_device                categorical mobile / desktop / tablet
\`\`\`

## Context Features

\`\`\`
Feature                    Type        Description
──────────────────────────────────────────────────────────────
hour_of_day                numeric     Time-based patterns
day_of_week                categorical Weekend vs weekday behavior
season                     categorical Holiday shopping patterns
device_type                categorical Mobile shows fewer results
location                   categorical Regional preferences
\`\`\`

## BM25: The Classic Relevance Score

\`\`\`
BM25(q, d) = Σ IDF(qᵢ) * [f(qᵢ, d) * (k₁ + 1)] /
                           [f(qᵢ, d) + k₁ * (1 - b + b * |d|/avgdl)]

IDF(qᵢ) = log[(N - n(qᵢ) + 0.5) / (n(qᵢ) + 0.5)]

f(qᵢ, d) = term frequency of qᵢ in document d
N = total documents, n(qᵢ) = docs containing qᵢ
k₁ ≈ 1.5 (term frequency saturation)
b ≈ 0.75 (document length normalization)
\`\`\`

BM25 is still used as a feature in modern ML ranking systems. It captures lexical relevance that neural models might miss.

## Feature Engineering Best Practices

\`\`\`
1. Cross features are king — query-document interaction features
   matter more than query or document features alone
2. Position bias correction — clicks are biased toward top results;
   use inverse propensity weighting or position features
3. Historical features — past CTR/conversion for (query, doc) pairs
   are extremely predictive but cold-start on new items
4. Freshness — log-transform days_since_listed to dampen effect
5. Missing values — create "has_X" indicators for optional fields
\`\`\`

## Exercise

Build a feature engineering pipeline for search ranking.`,
      starterCode: `import numpy as np

def build_search_features():
    """Construct feature vectors for search ranking."""

    # Sample data: query + 3 candidate documents
    query = {
        "text": "wireless bluetooth headphones",
        "tokens": ["wireless", "bluetooth", "headphones"],
        "intent": "transactional",
    }

    documents = [
        {"title": "Sony WH-1000XM5 Wireless Bluetooth Headphones",
         "price": 349.99, "rating": 4.7, "reviews": 15234, "days_listed": 180},
        {"title": "Cheap Earbuds with Microphone",
         "price": 12.99, "rating": 3.2, "reviews": 89, "days_listed": 30},
        {"title": "Bluetooth Speaker Portable Wireless",
         "price": 49.99, "rating": 4.3, "reviews": 5678, "days_listed": 365},
    ]

    # TODO: Compute query features (length, intent encoding)
    # TODO: Compute document features (price percentile, log reviews, etc.)
    # TODO: Compute cross features (title match ratio, exact match)
    # TODO: Combine into feature vectors and print
    pass

build_search_features()`,
      solutionCode: `import numpy as np

def build_search_features():
    """Construct feature vectors for search ranking."""

    query = {
        "text": "wireless bluetooth headphones",
        "tokens": ["wireless", "bluetooth", "headphones"],
        "intent": "transactional",
    }

    documents = [
        {"title": "Sony WH-1000XM5 Wireless Bluetooth Headphones",
         "price": 349.99, "rating": 4.7, "reviews": 15234, "days_listed": 180},
        {"title": "Cheap Earbuds with Microphone",
         "price": 12.99, "rating": 3.2, "reviews": 89, "days_listed": 30},
        {"title": "Bluetooth Speaker Portable Wireless",
         "price": 49.99, "rating": 4.3, "reviews": 5678, "days_listed": 365},
    ]

    prices = [d["price"] for d in documents]
    max_price = max(prices)

    print("=== Search Ranking Features ===\\n")
    print(f"Query: '{query['text']}'\\n")

    for i, doc in enumerate(documents):
        title_tokens = doc["title"].lower().split()
        query_tokens = [t.lower() for t in query["tokens"]]

        # Cross features
        match_count = sum(1 for qt in query_tokens if qt in title_tokens)
        title_match_ratio = match_count / len(query_tokens)
        exact_match = int(query["text"].lower() in doc["title"].lower())

        # Document features
        log_reviews = np.log1p(doc["reviews"])
        price_norm = doc["price"] / max_price
        freshness = np.log1p(doc["days_listed"])

        features = {
            "query_length": len(query_tokens),
            "is_transactional": int(query["intent"] == "transactional"),
            "title_match_ratio": round(title_match_ratio, 3),
            "exact_match": exact_match,
            "price_normalized": round(price_norm, 3),
            "rating": doc["rating"],
            "log_reviews": round(log_reviews, 3),
            "freshness_log": round(freshness, 3),
        }

        feature_vec = list(features.values())
        print(f"Doc {i+1}: {doc['title'][:50]}...")
        for fname, fval in features.items():
            print(f"  {fname:25s}: {fval}")
        print(f"  Feature vector: {feature_vec}\\n")

build_search_features()`,
    },
    {
      id: "ml-search-3",
      slug: "search-training-data",
      title: "Search Ranking: Training Data",
      content: `# Search Ranking: Training Data

## The Label Problem

Search ranking faces a fundamental challenge: we rarely have explicit relevance labels. Instead, we must derive labels from implicit user behavior.

## Implicit Signals

\`\`\`
Signal              Strength    Interpretation
──────────────────────────────────────────────────────────────
Impression only     Weakest     User saw but did not click
Click               Weak        User was interested (but position-biased)
Long dwell time     Medium      User found content useful
Add to cart         Strong      User seriously considering
Purchase            Strongest   Clear relevance signal
Return/Refund       Negative    Bad experience
Skip (seen, no click) Weak neg  Not relevant or not appealing
\`\`\`

## Constructing Labels

### Binary Labels (Click/No-Click)

\`\`\`
For each (query, document) pair:
  Label = 1 if user clicked the result
  Label = 0 if user saw but did not click

Problems:
  - Position bias: top results get more clicks regardless of relevance
  - Presentation bias: attractive thumbnails get more clicks
  - Trust bias: users trust the ranking, click top results more
\`\`\`

### Graded Labels (for NDCG)

\`\`\`
Relevance Level    Source Signal
──────────────────────────────────────────────
0 (Irrelevant)    Impression, no click
1 (Marginally)    Click, bounce (< 10s dwell)
2 (Relevant)      Click, reasonable dwell time
3 (Highly)        Click + add to cart
4 (Perfect)       Click + purchase

These are heuristic mappings — tune thresholds with human rater data.
\`\`\`

## Handling Position Bias

Position bias is the biggest challenge in learning from clicks. Users click higher-ranked results more often, even if lower results are equally relevant.

\`\`\`
Solution 1 — Inverse Propensity Weighting (IPW):
  Weight each sample by 1/P(click | position)
  Clicks at position 10 count more than clicks at position 1.
  Estimate propensity from randomization experiments.

Solution 2 — Position as a Feature:
  Include position as a training feature.
  At serving time, set position=0 for all candidates.
  Model learns to separate relevance from position effect.

Solution 3 — Randomized Data Collection:
  Occasionally show random results to collect unbiased data.
  Expensive (hurts user experience) but gives clean labels.
  Use sparingly: 1-5% of traffic.

Solution 4 — Pairwise Labels:
  Create pairs from the same query where one was clicked
  and the other was not (and the clicked one was BELOW
  the unclicked one). These pairs are unbiased.
\`\`\`

## Training Data Pipeline

\`\`\`
Architecture:
  Click Logs → [ETL Pipeline] → [Label Assignment] → [Feature Computation]
              → [Joining] → [Sampling] → [Training Data Store]

Key design decisions:
  1. Join window: How long to wait for purchase signal? (7-30 days)
  2. Negative sampling: Not all non-clicks are negatives
  3. Data freshness: How recent should training data be?
  4. Class imbalance: Far more non-clicks than clicks

Negative Sampling Strategies:
  - Random negatives from catalog (easy negatives)
  - Impressed but not clicked (medium negatives)
  - Clicked but bounced (hard negatives)
  Mix of difficulty levels trains the best models.
\`\`\`

## Cold Start Problem

New products have no click history. Solutions:

\`\`\`
1. Content-based features: Use product attributes (title, category, price)
2. Exploration: Boost new products temporarily to collect data
3. Transfer: Use similar product features to estimate initial scores
4. Two-tower model: Product embedding from content, separate from behavior
\`\`\`

## Data Quality Checks

\`\`\`
Check                     Why
──────────────────────────────────────────────
Click-through rate range  CTR should be 1-15%, not 0% or 90%
Label distribution        Not too skewed (< 99:1 ratio)
Feature coverage          No feature has >50% missing values
Temporal consistency      No sudden label distribution shifts
Duplicate removal         Same (query, doc) seen multiple times
Bot filtering             Remove automated traffic
\`\`\`

## Exercise

Design a training data pipeline for search ranking.`,
      starterCode: `import numpy as np

def design_training_pipeline():
    """Design and simulate a search ranking training data pipeline."""

    # Simulate click logs
    np.random.seed(42)
    n_queries = 100
    results_per_query = 10

    # TODO: Generate simulated click logs with position bias
    # TODO: Implement label assignment from click signals
    # TODO: Implement inverse propensity weighting
    # TODO: Show label distribution before and after debiasing
    # TODO: Implement negative sampling strategy
    pass

design_training_pipeline()`,
      solutionCode: `import numpy as np

def design_training_pipeline():
    """Design and simulate a search ranking training data pipeline."""

    np.random.seed(42)
    n_queries = 1000
    results_per_query = 10

    # Simulate position-biased clicks
    # True relevance is random, but click probability depends on position
    true_relevance = np.random.rand(n_queries, results_per_query)
    position_bias = np.array([1/np.log2(i+2) for i in range(results_per_query)])
    click_prob = true_relevance * position_bias[np.newaxis, :]
    clicks = (np.random.rand(n_queries, results_per_query) < click_prob).astype(int)

    print("=== Training Data Pipeline ===\\n")

    # 1. Raw click statistics
    ctr_by_position = clicks.mean(axis=0)
    print("1. Position Bias in Raw Clicks:")
    for pos in range(results_per_query):
        print(f"   Position {pos+1}: CTR = {ctr_by_position[pos]:.3f}")

    # 2. Label assignment with graded relevance
    dwell_time = np.random.exponential(30, (n_queries, results_per_query)) * clicks
    labels = np.zeros_like(clicks)
    labels[clicks == 1] = 1
    labels[(clicks == 1) & (dwell_time > 30)] = 2
    labels[(clicks == 1) & (dwell_time > 60)] = 3

    label_dist = {i: (labels == i).sum() for i in range(4)}
    print(f"\\n2. Label Distribution:")
    for label, count in label_dist.items():
        print(f"   Label {label}: {count} ({count/(n_queries*results_per_query)*100:.1f}%)")

    # 3. Inverse Propensity Weighting
    propensity = position_bias / position_bias.max()
    ipw_weights = np.where(clicks == 1, 1.0 / propensity[np.newaxis, :], 1.0)

    print(f"\\n3. IPW Weights by Position:")
    for pos in range(5):
        print(f"   Position {pos+1}: propensity={propensity[pos]:.3f}, "
              f"click_weight={1/propensity[pos]:.3f}")

    # 4. Negative sampling
    positive_count = clicks.sum()
    negative_count = (clicks == 0).sum()
    sample_ratio = 3  # 3 negatives per positive

    print(f"\\n4. Negative Sampling:")
    print(f"   Positives: {positive_count}")
    print(f"   All negatives: {negative_count}")
    print(f"   Sampled negatives (3:1 ratio): {int(positive_count * sample_ratio)}")
    print(f"   Final training set size: {int(positive_count * (1 + sample_ratio))}")

design_training_pipeline()`,
    },
    {
      id: "ml-search-4",
      slug: "search-model-architecture",
      title: "Search Ranking: Model Architecture",
      content: `# Search Ranking: Model Architecture

## The Evolution of Ranking Models

Search ranking models have evolved from simple linear models to sophisticated deep learning architectures. Understanding this evolution is critical for interviews.

\`\`\`
Generation 1: Hand-crafted rules (BM25, TF-IDF)
Generation 2: Linear models (Logistic Regression on features)
Generation 3: Tree-based models (LambdaMART, XGBoost)
Generation 4: Deep learning (DSSM, two-tower, cross-attention)
Generation 5: Foundation models (fine-tuned LLMs for ranking)
\`\`\`

## Two-Tower Architecture

The most common architecture for large-scale retrieval:

\`\`\`
Query Tower              Document Tower
    |                        |
[Query Text]            [Doc Title + Desc]
    |                        |
[Embedding Layer]       [Embedding Layer]
    |                        |
[FC → ReLU → FC]       [FC → ReLU → FC]
    |                        |
[Query Embedding]       [Doc Embedding]
    \\                      /
     \\                    /
      [Cosine Similarity]
             |
         [Score]

Advantages:
  - Document embeddings can be pre-computed and cached
  - Query embedding computed once, compared against all docs
  - Scales to billions of documents with ANN search
  - Sub-millisecond retrieval

Limitations:
  - No fine-grained query-document interaction
  - Cannot compute features like "exact title match"
  - Best for retrieval (recall), not final ranking (precision)
\`\`\`

## Cross-Network Architecture (for Ranking Stage)

\`\`\`
[Query Features] [Doc Features] [Cross Features] [User Features]
       |               |              |                |
       └───────────────┴──────────────┴────────────────┘
                           |
                    [Concatenate]
                           |
                 [Cross Network Layer]  ← Explicit feature crosses
                           |
                    [Deep Network]      ← Implicit feature interactions
                    [FC → ReLU → FC]
                    [FC → ReLU → FC]
                           |
                    [Sigmoid/Score]

DCN (Deep & Cross Network):
  Cross layer:  x_{l+1} = x_0 * x_l^T * w_l + b_l + x_l
  Explicitly models feature interactions up to order L.
  Combined with deep layers for both explicit and implicit patterns.
\`\`\`

## LambdaMART (Industry Standard)

LambdaMART is gradient boosted decision trees optimized for ranking metrics (NDCG). It remains the industry workhorse due to reliability and interpretability.

\`\`\`
Key ideas:
  1. Uses "lambda gradients" — gradients that directly optimize NDCG
  2. Lambda_ij = |ΔNDCG| when swapping doc i and doc j
  3. Pairs that would cause large NDCG change get large gradients
  4. Built on gradient boosted trees (fast, interpretable)

Why still used:
  - Handles mixed feature types natively
  - No scaling needed
  - Fast training and inference
  - Interpretable feature importances
  - Strong performance on structured features
\`\`\`

## Multi-Stage Architecture

\`\`\`
Stage         Model              Candidates    Latency Budget
────────────────────────────────────────────────────────────────
Retrieval     Two-tower + ANN    100M → 1000   50ms
Pre-ranking   Light DNN          1000 → 100    20ms
Ranking       DCN / LambdaMART   100 → 20      100ms
Re-ranking    Business rules     20 → 20       30ms

Total latency < 200ms

Each stage reduces candidates while increasing model complexity.
This funnel design is essential for production systems.
\`\`\`

## Serving Architecture

\`\`\`
Request Flow:
  User Query
    → Load Balancer
    → Query Understanding Service
    → Retrieval Service (ANN index)
    → Feature Store (precomputed doc features)
    → Ranking Service (model inference)
    → Re-ranking Service (diversity, business rules)
    → Response

Key infrastructure:
  Feature Store:     Precomputed features, low-latency lookup
  Model Serving:     TensorFlow Serving / Triton / ONNX Runtime
  ANN Index:         FAISS / ScaNN for embedding retrieval
  Caching:           Popular query results cached (TTL 5-15 min)
\`\`\`

## Interview Tips

\`\`\`
1. Always start with a simple model (logistic regression) as baseline
2. Explain the multi-stage architecture — it shows systems thinking
3. Mention the tradeoff between model complexity and latency
4. Discuss how to handle the cold start problem for new products
5. Talk about A/B testing for evaluating changes
\`\`\`

## Exercise

Design a multi-stage ranking architecture with model choices for each stage.`,
      starterCode: `def design_ranking_architecture():
    """Design a complete multi-stage ranking system."""

    # TODO: Define each stage with model, input/output, latency
    # TODO: Explain why you chose each model
    # TODO: Describe feature sets for each stage
    # TODO: Discuss the tradeoffs at each stage
    # TODO: Estimate total parameters and serving cost

    stages = []
    # stages.append({...})

    for stage in stages:
        print(f"Stage: {stage.get('name', 'Unknown')}")

design_ranking_architecture()`,
      solutionCode: `def design_ranking_architecture():
    """Design a complete multi-stage ranking system."""

    stages = [
        {
            "name": "1. Retrieval",
            "model": "Two-Tower DNN + FAISS ANN index",
            "input_size": "100M documents",
            "output_size": "1,000 candidates",
            "latency": "50ms",
            "features": [
                "Query embedding (from query tower)",
                "Document embedding (pre-computed, cached in ANN index)",
                "BM25 score (inverted index fallback)",
            ],
            "rationale": (
                "Two-tower allows pre-computation of document embeddings. "
                "ANN search (FAISS) provides sub-linear retrieval time. "
                "Optimized for recall — we want to not miss relevant docs."
            ),
        },
        {
            "name": "2. Pre-Ranking (Light Ranker)",
            "model": "Shallow DNN (2-3 layers, <1M params)",
            "input_size": "1,000 candidates",
            "output_size": "100 candidates",
            "latency": "20ms",
            "features": [
                "Query-doc embedding similarity",
                "BM25 score",
                "Document popularity (clicks, sales)",
                "Price and rating",
            ],
            "rationale": (
                "Lightweight model that uses a small feature set. "
                "Filters out clearly irrelevant candidates cheaply. "
                "Reduces the load on the expensive ranking stage."
            ),
        },
        {
            "name": "3. Ranking (Heavy Ranker)",
            "model": "Deep & Cross Network (DCN-v2) or LambdaMART",
            "input_size": "100 candidates",
            "output_size": "20 results",
            "latency": "100ms",
            "features": [
                "All query features (text, intent, length)",
                "All document features (title, price, rating, reviews)",
                "Cross features (title match, BM25, embedding sim)",
                "User features (history, preferences, device)",
                "Context features (time, location, session)",
                "Historical features (past CTR for this query-doc pair)",
            ],
            "rationale": (
                "Most complex model with richest feature set. "
                "DCN captures explicit feature interactions. "
                "Can afford full feature computation for only 100 candidates."
            ),
        },
        {
            "name": "4. Re-Ranking",
            "model": "Rule-based + lightweight scorer",
            "input_size": "20 results",
            "output_size": "20 results (re-ordered)",
            "latency": "30ms",
            "features": [
                "Diversity (avoid duplicate categories)",
                "Freshness boost for new products",
                "Sponsored insertion positions",
                "Stock availability check",
            ],
            "rationale": (
                "Applies business logic that cannot be learned from data. "
                "Ensures diversity and handles edge cases. "
                "Final quality gate before showing to user."
            ),
        },
    ]

    total_latency = 0
    for stage in stages:
        print(f"\\n{'='*60}")
        print(f"  {stage['name']}")
        print(f"{'='*60}")
        print(f"  Model:   {stage['model']}")
        print(f"  Scale:   {stage['input_size']} → {stage['output_size']}")
        print(f"  Latency: {stage['latency']}")
        print(f"  Features:")
        for f in stage['features']:
            print(f"    - {f}")
        print(f"  Rationale: {stage['rationale']}")
        total_latency += int(stage['latency'].replace('ms', ''))

    print(f"\\n{'='*60}")
    print(f"  Total Latency Budget: {total_latency}ms")
    print(f"{'='*60}")

design_ranking_architecture()`,
    },
    {
      id: "ml-search-5",
      slug: "search-evaluation",
      title: "Search Ranking: Evaluation",
      content: `# Search Ranking: Evaluation

## Offline Evaluation Metrics

### NDCG (Normalized Discounted Cumulative Gain)

The gold standard metric for search ranking. Accounts for graded relevance and position.

\`\`\`
DCG@K = Σ (2^relᵢ - 1) / log₂(i + 1)    for i = 1 to K

IDCG@K = DCG@K for the ideal (perfect) ranking

NDCG@K = DCG@K / IDCG@K

NDCG is in [0, 1]. Higher is better. 1.0 = perfect ranking.

Example:
  Ranking:          [3, 2, 0, 1, 3]
  DCG@5 = (2³-1)/log₂(2) + (2²-1)/log₂(3) + (2⁰-1)/log₂(4)
        + (2¹-1)/log₂(5) + (2³-1)/log₂(6)
        = 7/1 + 3/1.585 + 0/2 + 1/2.322 + 7/2.585
        = 7 + 1.893 + 0 + 0.431 + 2.708 = 12.031

  Ideal ranking:    [3, 3, 2, 1, 0]
  IDCG@5 = 7/1 + 7/1.585 + 3/2 + 1/2.322 + 0/2.585
         = 7 + 4.416 + 1.5 + 0.431 + 0 = 13.347

  NDCG@5 = 12.031 / 13.347 = 0.901
\`\`\`

### MRR (Mean Reciprocal Rank)

\`\`\`
RR = 1 / rank of first relevant result
MRR = mean(RR) across all queries

Example:
  Query 1: first relevant at position 1 → RR = 1/1 = 1.0
  Query 2: first relevant at position 3 → RR = 1/3 = 0.33
  Query 3: first relevant at position 2 → RR = 1/2 = 0.5
  MRR = (1.0 + 0.33 + 0.5) / 3 = 0.61
\`\`\`

### Precision@K and Recall@K

\`\`\`
Precision@K = (relevant docs in top K) / K
Recall@K    = (relevant docs in top K) / (total relevant docs)
\`\`\`

## Online Evaluation: A/B Testing

Offline metrics do not always predict online success. A/B testing is essential.

\`\`\`
Design:
  Control:    Current ranking model (50% of traffic)
  Treatment:  New ranking model (50% of traffic)
  Duration:   1-2 weeks minimum
  Metrics:    CTR, conversion rate, revenue per search, session length

Statistical rigor:
  Sample size: Use power analysis to determine minimum traffic
  Significance: p < 0.05 (or 0.01 for high-stakes changes)
  Multiple testing: Apply Bonferroni or FDR correction
  Novelty effect: Wait >3 days before measuring (users adapt)
\`\`\`

## Interleaving

A more sensitive alternative to A/B testing:

\`\`\`
Team Draft Interleaving:
  1. Get rankings from Model A and Model B
  2. Interleave results: take top from A, then B, alternating
  3. Show interleaved list to user
  4. Credit clicks to the model that contributed that result
  5. Model with more clicks wins

Advantage: Needs ~10x less traffic than A/B testing
           to detect the same effect size.
\`\`\`

## Debugging Ranking Quality

\`\`\`
Common Issues:
  - Feature drift: Feature distributions change over time
  - Label noise: Click data is noisy and biased
  - Cold start: New products ranked poorly
  - Position bias: Model overfits to position
  - Serving/training skew: Features differ between training and serving

Diagnostic Approach:
  1. Segment analysis — check performance by query type, category
  2. Error analysis — manually inspect worst-performing queries
  3. Feature importance — identify which features drive predictions
  4. Counterfactual evaluation — what would happen with random ranking?
\`\`\`

## Exercise

Implement NDCG and MRR from scratch and evaluate a ranking system.`,
      starterCode: `import numpy as np

def dcg_at_k(relevances, k):
    """Compute DCG@K."""
    # TODO: Implement DCG formula
    pass

def ndcg_at_k(relevances, k):
    """Compute NDCG@K."""
    # TODO: Implement NDCG using dcg_at_k
    pass

def mrr(rankings):
    """Compute Mean Reciprocal Rank.
    rankings: list of lists, each inner list has 1 (relevant) or 0.
    """
    # TODO: Implement MRR
    pass

# Test cases
relevances = [3, 2, 0, 1, 3]
# print(f"DCG@5:  {dcg_at_k(relevances, 5):.4f}")
# print(f"NDCG@5: {ndcg_at_k(relevances, 5):.4f}")

rankings = [
    [0, 0, 1, 0, 0],  # first relevant at position 3
    [1, 0, 0, 0, 0],  # first relevant at position 1
    [0, 1, 0, 0, 0],  # first relevant at position 2
]
# print(f"MRR:    {mrr(rankings):.4f}")`,
      solutionCode: `import numpy as np

def dcg_at_k(relevances, k):
    """Compute DCG@K."""
    relevances = np.array(relevances[:k])
    gains = 2**relevances - 1
    discounts = np.log2(np.arange(1, len(relevances) + 1) + 1)
    return np.sum(gains / discounts)

def ndcg_at_k(relevances, k):
    """Compute NDCG@K."""
    dcg = dcg_at_k(relevances, k)
    ideal = sorted(relevances, reverse=True)
    idcg = dcg_at_k(ideal, k)
    if idcg == 0:
        return 0.0
    return dcg / idcg

def mrr(rankings):
    """Compute Mean Reciprocal Rank."""
    reciprocal_ranks = []
    for ranking in rankings:
        for i, rel in enumerate(ranking):
            if rel >= 1:
                reciprocal_ranks.append(1.0 / (i + 1))
                break
        else:
            reciprocal_ranks.append(0.0)
    return np.mean(reciprocal_ranks)

def precision_at_k(relevances, k):
    """Compute Precision@K."""
    return sum(1 for r in relevances[:k] if r > 0) / k

# Test NDCG
relevances = [3, 2, 0, 1, 3]
print("=== NDCG Computation ===")
print(f"Ranking: {relevances}")
print(f"DCG@5:  {dcg_at_k(relevances, 5):.4f}")
print(f"NDCG@5: {ndcg_at_k(relevances, 5):.4f}")
print(f"NDCG@3: {ndcg_at_k(relevances, 3):.4f}")

# Perfect ranking
perfect = sorted(relevances, reverse=True)
print(f"\\nPerfect ranking: {perfect}")
print(f"NDCG@5: {ndcg_at_k(perfect, 5):.4f}")

# Worst ranking
worst = sorted(relevances)
print(f"Worst ranking: {worst}")
print(f"NDCG@5: {ndcg_at_k(worst, 5):.4f}")

# Test MRR
print("\\n=== MRR Computation ===")
rankings = [
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
]
for i, r in enumerate(rankings):
    pos = r.index(1) + 1
    print(f"Query {i+1}: first relevant at position {pos}, RR = {1/pos:.4f}")
print(f"MRR: {mrr(rankings):.4f}")

# Test Precision@K
print(f"\\n=== Precision@K ===")
binary_rel = [1, 0, 1, 0, 1]
for k in [1, 3, 5]:
    print(f"P@{k}: {precision_at_k(binary_rel, k):.4f}")`,
    },
  ],
};

import { Module } from "../types";

export const feedRankingModule: Module = {
  id: "ml-feed-ranking",
  title: "ML System Design: Feed Ranking",
  description: "Design a social media feed ranking system — multi-objective optimization, feature engineering, multi-task learning, and evaluation of engagement, quality, and diversity.",
  lessons: [
    {
      id: "feed-formulation",
      slug: "feed-problem-formulation",
      title: "Feed Ranking: Problem Formulation",
      content: `# Feed Ranking: Problem Formulation

## The Interview Setup

"Design the ranking system for a social media news feed (Instagram / Twitter / LinkedIn)." Feed ranking is distinct from search and ads because there is no explicit query — the system must proactively choose what content to show each user.

## Clarifying Questions

\`\`\`
1. Platform type?              → Social media (Instagram-like)
2. Content types?              → Photos, videos, text posts, stories, reels
3. Scale?                      → 500M daily active users, 100M+ new posts/day
4. What data is available?     → Social graph, interaction history, content metadata
5. Primary objective?          → Daily active user retention (long-term engagement)
6. Constraints?                → Content policy compliance, creator fairness
\`\`\`

## The Multi-Objective Challenge

Feed ranking is inherently multi-objective. Unlike search (relevance) or ads (revenue), the feed must balance competing goals simultaneously.

\`\`\`
Objective           Why It Matters                           Metric
──────────────────────────────────────────────────────────────────────
Engagement          Users interact with content               Likes, comments, shares
Time Spent          Users stay on the platform                Session duration
Content Quality     Users see valuable, not just addictive    User satisfaction surveys
Creator Equity      Creators get fair distribution            Impression Gini coefficient
Diversity           Users discover new topics/creators        Topic entropy in feed
Safety              No harmful, misleading, or policy-        Violation rate
                    violating content
\`\`\`

## Why Maximizing Engagement Alone Fails

\`\`\`
The Engagement Trap:
  If you optimize purely for clicks and time spent:
  → Rage-bait and controversy get promoted (high engagement)
  → Clickbait thumbnails with disappointing content get promoted
  → Users binge but feel worse → long-term churn increases
  → Creator ecosystem degrades (only provocative content rewarded)

Real examples:
  - Facebook's 2018 "meaningful interactions" pivot reduced viral content
    but improved user-reported satisfaction
  - YouTube shifted from watch-time to "satisfaction" signals,
    reducing recommendation of conspiracy content
  - Twitter/X introduced "helpful" labels to counterweight raw engagement

The lesson: Short-term engagement and long-term user value diverge.
  Feed ranking must balance both.
\`\`\`

## Multi-Stakeholder Optimization

Feed ranking serves multiple stakeholders with different interests:

\`\`\`
Stakeholder        Goal                       Tension
──────────────────────────────────────────────────────────────
Consumer (viewer)  See interesting, relevant   May create filter bubble
                   content
Creator            Get fair distribution       Popular creators dominate
                   and growth
Platform           Maximize DAU, revenue,      Short-term revenue vs
                   advertiser satisfaction      long-term trust
Advertisers        Reach target audience       Ad load hurts user experience
Society            Informed, healthy discourse  Engagement rewards outrage

No single score function satisfies all stakeholders simultaneously.
This is a constrained optimization problem.
\`\`\`

## System Architecture

\`\`\`
User Opens App
    │
    ▼
[Candidate Generation] → Retrieve ~5000 posts from multiple sources
    │
    │  Sources:
    │   - Friends/following: posts from user's social graph
    │   - Interest-based: posts from topics user engages with
    │   - Explore/discovery: diverse content outside user's bubble
    │   - Creator boost: new creators getting initial distribution
    │
    ▼
[Pre-Ranking] → Lightweight scoring, 5000 → 500 posts
    │
    ▼
[Heavy Ranking] → Multi-objective model, 500 → ranked list
    │
    ▼
[Policy Filtering] → Remove policy-violating content
    │
    ▼
[Re-Ranking] → Diversity injection, creator fairness, ad insertion
    │
    ▼
[Feed Assembly] → Final ordered list with ads interleaved
    │
    ▼
[Served to User]
\`\`\`

## Defining the Objective Function

\`\`\`
Approach 1 — Weighted Sum (simple, common):
  score = w₁·P(like) + w₂·P(comment) + w₃·P(share) + w₄·P(save)
        + w₅·P(long_view) - w₆·P(hide) - w₇·P(report)

  Weights learned through A/B testing against DAU/retention.

Approach 2 — Value Model (advanced):
  score = E[user_value(post)]
  where user_value combines multiple signals into a single
  "how much will this post improve the user's experience?"

  Trained on long-term user behavior:
    - Did the user return the next day?
    - Did the user's session satisfaction improve?
    - Did the user's posting frequency increase?

Approach 3 — Constrained Optimization:
  Maximize: engagement score
  Subject to:
    - Content diversity ≥ threshold
    - Creator impression fairness ≥ threshold
    - Policy violation rate ≤ threshold
    - Ad load ≤ maximum
\`\`\`

**Interview tip:** Frame feed ranking as a multi-objective constrained optimization problem, not a simple prediction task. This immediately signals senior-level thinking. Discuss specific tensions (engagement vs quality, personalization vs diversity) and how you would resolve them through A/B testing on long-term metrics like retention and user-reported satisfaction.`,
    },
    {
      id: "feed-features",
      slug: "feed-feature-engineering",
      title: "Feed Ranking: Feature Engineering",
      content: `# Feed Ranking: Feature Engineering

## Feature Categories

Feed ranking features capture four dimensions: who created the content, what the content is, who is viewing it, and how the viewer has interacted with similar content.

## Author Features

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
author_id_embedding         vector      Learned author representation
author_follower_count       numeric     Audience size (log-transformed)
author_post_frequency       numeric     Posts per day (content velocity)
author_avg_engagement_rate  numeric     Historical likes/impressions
author_content_quality      numeric     ML-predicted quality score
author_category             categorical Creator type: personal, brand, news, celeb
author_account_age          numeric     Days since account creation
author_is_verified          binary      Verification status
author_violation_rate       numeric     Past content policy violations
relationship_to_viewer      categorical Close friend, following, friend-of-friend
\`\`\`

## Content Features

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
content_type                categorical Photo, video, text, carousel, reel
content_embedding           vector      Multi-modal embedding (text + image + video)
text_length                 numeric     Post caption length
text_sentiment              numeric     Positive/negative sentiment score
text_language               categorical Detected language
has_hashtags                binary      Presence of hashtags
hashtag_embeddings          vector      Aggregated hashtag representations
image_quality_score         numeric     Aesthetic quality from vision model
video_duration              numeric     Length in seconds
video_completion_rate       numeric     Historical % of viewers who finish
content_age_minutes         numeric     Freshness (log-transformed)
num_comments                numeric     Early engagement signal
num_likes                   numeric     Early engagement signal
is_reshare                  binary      Original vs reshared content
mentions_count              numeric     Number of user mentions
topic_category              multi-hot   Detected topics: sports, food, travel
has_link                    binary      Contains external URL
media_count                 numeric     Number of images/videos in post
\`\`\`

## User-Content Interaction Features

The most predictive features capture the specific relationship between this viewer and this content.

\`\`\`
Feature                        Type      Description
──────────────────────────────────────────────────────────────
user_author_interaction_count  numeric   Times viewer has engaged with this author
user_author_last_interaction   numeric   Days since last interaction with author
user_topic_affinity            numeric   Viewer's engagement rate with this topic
user_content_type_preference   numeric   Viewer's engagement rate with this format
user_similar_post_engagement   numeric   Engagement with similar content (embedding sim)
user_author_messages           binary    Has viewer DM'd this author?
user_author_profile_visits     numeric   Times viewer visited author's profile
mutual_friends_count           numeric   Social proximity signal
user_comment_tendency          numeric   How often viewer comments (vs just likes)
user_typical_session_length    numeric   Expected engagement capacity
\`\`\`

## Social Graph Features

Social signals are uniquely important in feed ranking — they do not exist in search or ads.

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
is_close_friend             binary      In viewer's "close friends" list
interaction_recency         numeric     How recently they interacted
interaction_symmetry        numeric     Bidirectional vs one-way engagement
shared_groups               numeric     Common group memberships
friends_who_engaged         numeric     How many of viewer's friends liked this
friends_engagement_rate     numeric     % of viewer's friends who engaged
social_proof_strength       numeric     Weighted friend engagement signal
graph_distance              numeric     Hops in social graph (1=direct, 2=FoF)
\`\`\`

## Temporal and Context Features

\`\`\`
Feature                     Type        Description
──────────────────────────────────────────────────────────────
hour_of_day                 numeric     Content consumption patterns by hour
day_of_week                 categorical Weekend browsing vs weekday patterns
user_session_depth          numeric     Posts already seen in this session
time_since_last_session     numeric     Returning after 1 hour vs 1 day
feed_position               numeric     Position bias correction
content_freshness_relative  numeric     How old vs other candidates
is_catching_up              binary      User has unseen posts from close friends
notification_driven         binary      User opened app from a notification
\`\`\`

## Feature Engineering Challenges Specific to Feed

\`\`\`
Challenge                   Solution
──────────────────────────────────────────────────────────────
Viral content cold start    Use early engagement signals (first 100 impressions)
                            Combine with content-based quality predictions

Position bias               Train with position as feature, set to 0 at serving
                            Or use inverse propensity weighting

Feedback loops              Model promotes content → gets more engagement →
                            model scores higher → positive feedback loop.
                            Use counterfactual evaluation and exploration.

Feature freshness           Post engagement counts change rapidly.
                            Use streaming aggregation (5-min windows).

Multi-modal content         Different feature extractors for text, image, video.
                            Fuse into single embedding via multi-modal model.

Session context             Early in session: show high-priority (close friends).
                            Deep in session: show exploratory content.
                            Session depth modulates ranking weights.
\`\`\`

**Interview tip:** Social graph features are the distinguishing factor for feed ranking. Emphasize that "friends_who_engaged" is one of the most powerful signals — social proof drives behavior. Also discuss the feedback loop problem: if you only show content that gets engagement, you create a rich-get-richer dynamic that starves new creators. Mention exploration strategies (e.g., reserving 5-10% of impressions for new or under-exposed content).`,
    },
    {
      id: "feed-multi-obj",
      slug: "feed-multi-objective",
      title: "Feed Ranking: Multi-Objective Optimization",
      content: `# Feed Ranking: Multi-Objective Optimization

## The Core Problem

Feed ranking must simultaneously optimize multiple objectives that often conflict with each other. Showing a controversial post maximizes engagement but degrades content quality. Showing only close-friend content maximizes satisfaction but limits content discovery.

## Approach 1: Weighted Sum Scalarization

The simplest and most common approach in production.

\`\`\`
score(post) = w₁·P(like) + w₂·P(comment) + w₃·P(share) + w₄·P(save)
            + w₅·P(long_view) - w₆·P(hide) - w₇·P(report)
            + w₈·quality_score + w₉·freshness_boost

Weight Tuning Process:
  1. Start with uniform weights
  2. Run A/B tests with different weight configurations
  3. Measure impact on North Star metric (DAU retention)
  4. Iterate until convergence

  Typical discovered weights (illustrative):
    P(like):      0.3
    P(comment):   0.5    ← Comments signal deeper engagement
    P(share):     0.8    ← Shares indicate high value
    P(save):      0.6    ← Saves indicate lasting value
    P(long_view): 0.4    ← Meaningful consumption
    P(hide):     -2.0    ← Strong negative signal
    P(report):   -5.0    ← Strongest negative signal

Pros: Simple, interpretable, easy to tune
Cons: Cannot express non-linear tradeoffs
      May miss Pareto-optimal solutions
      Weights are global — same for all users
\`\`\`

## Approach 2: Pareto Optimization

\`\`\`
Idea: Instead of a single weighted score, find the set of solutions
where no objective can be improved without worsening another.

Pareto Front:
  Each point represents a different ranking strategy.
  Points ON the front are Pareto-optimal.
  Points INSIDE the front are dominated (can be improved).

  Engagement ↑
       |    *  * *
       |   *       *
       |  *          *     ← Pareto front
       | *            *
       |*              *
       └──────────────────→ Quality ↑

  Point A: High engagement, low quality (rage-bait)
  Point B: Low engagement, high quality (educational)
  Point C: Balanced (Pareto optimal)

  The business decision is WHERE on the front to operate.

In Practice:
  1. Train separate models for each objective
  2. Compute Pareto front via multi-objective optimization
  3. Select operating point through A/B testing
  4. Adjust operating point based on business needs
\`\`\`

## Approach 3: Constrained Optimization

\`\`\`
Maximize: engagement_score(feed)
Subject to:
  content_diversity(feed) ≥ D_min          (at least 5 unique topics)
  creator_fairness(feed) ≥ F_min           (Gini coefficient < 0.7)
  policy_violation_rate(feed) ≤ V_max      (< 0.01%)
  ad_load(feed) ≤ A_max                    (< 15% of feed slots)
  close_friend_coverage(feed) ≥ C_min      (show all close friend posts)

Implementation:
  Use Lagrangian relaxation to convert constraints into penalties:

  L = engagement - λ₁·max(0, D_min - diversity)
                  - λ₂·max(0, F_min - fairness)
                  - λ₃·max(0, violation_rate - V_max)

  λ values are learned through dual optimization.

Pros: Directly encodes business constraints
      Guarantees minimum quality thresholds
Cons: Harder to optimize than unconstrained
      Constraint thresholds require careful tuning
\`\`\`

## Approach 4: Multi-Gate Mixture-of-Experts (MMoE)

A model architecture purpose-built for multi-task learning in feed ranking.

\`\`\`
[Input Features]
      │
      ├── [Expert 1] ── FC → ReLU → FC
      ├── [Expert 2] ── FC → ReLU → FC
      ├── [Expert 3] ── FC → ReLU → FC
      └── [Expert N] ── FC → ReLU → FC
              │
      ┌───────┼───────┐
      │       │       │
  [Gate 1] [Gate 2] [Gate 3]     ← One gate per task
      │       │       │
  [Tower 1] [Tower 2] [Tower 3]  ← One tower per task
      │       │       │
  P(like)  P(comment) P(share)

Gate mechanism:
  gate_k(x) = softmax(W_k · x)
  output_k = Σ gate_k_i(x) · expert_i(x)

Each task learns which experts to rely on.
Related tasks share experts; unrelated tasks use different experts.

Why MMoE for Feed Ranking:
  - P(like) and P(comment) are related → share experts
  - P(hide) and P(like) are negatively related → different experts
  - Single model serves all objectives → efficient serving
  - Better than training N separate models (shared representation learning)
\`\`\`

## Practical Multi-Objective Decisions

\`\`\`
Decision                    Common Choice              Rationale
──────────────────────────────────────────────────────────────────────
Engagement vs Quality       Penalize P(hide) heavily   Users who hide content churn
Personalization vs Diversity Reserve 10-20% for explore Prevents filter bubbles
Recency vs Relevance        Freshness decay function   Old-but-relevant still shown
Creator fairness            Impression floor per creator Healthy creator ecosystem
Short vs long content       Normalize by expected time  Don't bias toward quick content
Friend vs algorithmic       Show all close friend posts Core product promise
\`\`\`

**Interview tip:** Multi-objective optimization is what makes feed ranking intellectually rich compared to simpler ranking problems. Describe how you would start with a weighted sum for simplicity, propose MMoE for the model architecture, and use constrained optimization to enforce hard business rules. Show that you understand the iterative process: deploy, measure long-term metrics, adjust weights, repeat.`,
    },
    {
      id: "feed-model",
      slug: "feed-model-architecture",
      title: "Feed Ranking: Model Architecture",
      content: `# Feed Ranking: Model Architecture

## Ranking Approaches

Three fundamental approaches to learning-to-rank, each with different strengths for feed ranking.

### Pointwise Approach

\`\`\`
Predict a score for each (user, post) pair independently.

Input:  (user features, post features, context features)
Output: P(engagement | user, post)

Loss: Binary cross-entropy per interaction type

Pros: Simple, independent scoring, easy to parallelize
Cons: Ignores relative ordering; doesn't optimize list-level metrics

Used in: Initial ranking stage (scoring each candidate independently)
\`\`\`

### Pairwise Approach

\`\`\`
Predict which of two posts a user prefers.

Input:  (user, post_A, post_B)
Output: P(user prefers A over B)

Loss: Hinge loss or cross-entropy on pairs
  L = max(0, 1 - (score_A - score_B)) if A > B

Pros: Directly optimizes relative ordering
Cons: O(N²) pairs per user; expensive to train

Used in: Fine-tuning ranking when ordering quality matters most
\`\`\`

### Listwise Approach

\`\`\`
Optimize the entire ranked list at once.

Input:  (user, [post_1, post_2, ..., post_N])
Output: Optimal ordering that maximizes a list-level metric

Loss: Directly optimize NDCG (via LambdaRank) or
      softmax cross-entropy over the full list

Pros: Most aligned with the actual goal
Cons: Most complex; requires all candidates simultaneously

Used in: Final ranking optimization at top companies
\`\`\`

## Multi-Task Learning Architecture

Production feed ranking models predict multiple objectives simultaneously using shared representations.

### Shared-Bottom Architecture (Simple)

\`\`\`
[Input Features]
      │
[Shared Layers]
[FC → ReLU → FC]
[FC → ReLU → FC]
      │
  ┌───┼───┐
  │   │   │
[T1] [T2] [T3]    ← Task-specific towers
  │   │   │
P(like) P(comment) P(share)

Problem: Negative transfer. When tasks conflict (P(like) vs P(hide)),
shared layers cannot serve both well. Gradients from conflicting tasks
fight each other, degrading performance on all tasks.
\`\`\`

### MMoE Architecture (Production Standard)

\`\`\`
[Input Features]
      │
  ┌───┼───┬───┐
  │   │   │   │
[E1] [E2] [E3] [E4]    ← Expert networks (shared)
  │   │   │   │
  └───┼───┴───┘
      │
  ┌───┼───┐
  │   │   │
[G1] [G2] [G3]         ← Task-specific gating networks
  │   │   │
  Each gate: softmax weighting of all experts
  output_k = Σ gate_k_i · expert_i
  │   │   │
[T1] [T2] [T3]         ← Task-specific tower networks
  │   │   │
P(like) P(comment) P(hide)

Expert dimensions: 4-8 experts, each 3-4 FC layers, 256-512 units
Gate: single FC layer → softmax over experts
Tower: 2-3 FC layers → sigmoid output

Advantage: Each task learns its own expert mixture.
  P(like) gate might weight experts [0.4, 0.3, 0.2, 0.1]
  P(hide) gate might weight experts [0.1, 0.1, 0.3, 0.5]
  Conflicting tasks naturally use different experts.
\`\`\`

### PLE — Progressive Layered Extraction (Tencent, 2020)

\`\`\`
Improvement over MMoE: adds task-specific experts alongside shared experts.

Layer L:
  Shared Experts:  [SE1] [SE2]        ← shared across tasks
  Task 1 Experts:  [T1E1] [T1E2]     ← exclusive to task 1
  Task 2 Experts:  [T2E1] [T2E2]     ← exclusive to task 2

  Task 1 Gate: selects from [SE1, SE2, T1E1, T1E2]
  Task 2 Gate: selects from [SE1, SE2, T2E1, T2E2]

Each layer extracts progressively more task-specific features.
Reduces negative transfer further than MMoE.
State-of-the-art for feed ranking at scale.
\`\`\`

## Handling Content Types

Feed ranking must handle diverse content — photos, videos, text, links — with different engagement patterns.

\`\`\`
Approach 1: Content-Type Feature
  Add content_type as a categorical feature.
  Model learns type-specific engagement patterns implicitly.

Approach 2: Content-Type Towers
  Separate tower for each content type, shared base.
  Better captures type-specific patterns.

Approach 3: Multi-Modal Embedding
  [Text] → BERT/distilBERT → text_embedding
  [Image] → ResNet/ViT     → image_embedding
  [Video] → VideoMAE       → video_embedding
           ↓
  [Fusion Layer] → unified content_embedding
           ↓
  [Fed into ranking model as a feature]

Production reality: Approach 3 with heavy caching.
  Content embeddings are pre-computed at post creation time.
  Only the ranking model runs at serving time.
\`\`\`

## Real-Time Signals

\`\`\`
Feed ranking uniquely benefits from real-time signals:

Signal                    Latency    Impact
──────────────────────────────────────────────────────────────
Post going viral          Minutes    Boost trending content
Author just posted        Seconds    Show to close friends immediately
User just interacted      Seconds    Update user preferences in-session
Content policy violation  Minutes    Suppress flagged content
Breaking news event       Minutes    Boost related content

Architecture: Streaming pipeline (Kafka/Flink) updates
feature store in near-real-time. Ranking model reads
latest features at each request.
\`\`\`

**Interview tip:** When discussing feed ranking models, start with the shared-bottom multi-task model as a baseline, then explain why MMoE is better (handles task conflicts), and mention PLE as the state-of-the-art. This shows you understand the evolution and can reason about when each architecture is appropriate. Always connect back to the business: "We use multi-task learning because serving N separate models would be too expensive at our QPS."`,
    },
    {
      id: "feed-eval",
      slug: "feed-evaluation",
      title: "Feed Ranking: Evaluation",
      content: `# Feed Ranking: Evaluation

## The Evaluation Challenge

Feed ranking evaluation is uniquely difficult because the system's output — the feed — is consumed sequentially over time. A user might see 50 posts in a session. The value of the 30th post depends on the 29 posts before it. This makes evaluation fundamentally different from search or ads.

## Online Experiments

### A/B Testing Design

\`\`\`
Randomization Unit: User (not session, not post)
  Why: Users must see consistent feed behavior across sessions.
  Switching ranking models mid-user creates confusion.

Traffic Split:
  Typical: 95% control / 5% treatment (for new models)
  Ramping: 5% → 10% → 25% → 50% over 2-4 weeks
  Why gradual: Detect problems before they affect most users.

Duration:
  Minimum: 7 days (captures day-of-week effects)
  Typical: 14-28 days (captures weekly patterns)
  Long-term holdout: 3-6 months (measures churn effects)

Sample Size (power analysis):
  For detecting 0.5% change in DAU retention:
  ~2-5M users per arm, depending on baseline variance.
  Smaller effects require exponentially more traffic.
\`\`\`

### Metric Hierarchy

\`\`\`
Tier 1 — North Star (ultimate decision metric):
  DAU / MAU ratio (stickiness)
  or 28-day retention rate

Tier 2 — Primary (directional signals, faster to measure):
  Sessions per user per day
  Time spent per session
  Posts consumed per session
  Engagement rate (likes + comments + shares) / impressions

Tier 3 — Secondary (diagnostic signals):
  Content diversity (unique topics/creators consumed)
  Creator posting frequency (healthy ecosystem)
  User satisfaction survey (sampled)
  Ad engagement rate (revenue health)

Tier 4 — Guardrail (must not degrade):
  Policy violation rate in shown content
  User reports / hides rate
  App crashes / errors
  P99 latency
  Ad revenue (must not drop > X%)
\`\`\`

### Interpreting Experiment Results

\`\`\`
Scenario                          Interpretation
──────────────────────────────────────────────────────────────
Engagement ↑, Retention ↑         Clear win. Ship it.
Engagement ↑, Retention flat      Likely safe. May be a quality wash.
Engagement ↑, Retention ↓         Dangerous. Engagement is likely from
                                  low-quality content. Do NOT ship.
Engagement ↓, Retention ↑         Quality improvement. Users see less
                                  but better content. Often worth it.
Engagement flat, Diversity ↑      Good for long-term health, hard to
                                  measure short-term. Consider shipping
                                  with long-term holdout monitoring.
\`\`\`

## Guardrail Metrics

Guardrails prevent well-intentioned changes from causing harm.

\`\`\`
Guardrail                    Threshold           Action if Breached
──────────────────────────────────────────────────────────────────────
Content violation rate       > 0.01%              Auto-rollback
User hide rate               > 10% relative ↑     Pause experiment
User report rate             > 5% relative ↑      Pause experiment
Ad revenue                   > 2% relative ↓      Flag for review
P99 latency                  > 500ms              Auto-rollback
Creator impression Gini      > 0.8                Flag for review
DAU                          > 0.5% relative ↓    Auto-rollback

Auto-rollback: System automatically reverts to control if guardrail
is breached. No human intervention needed. Critical for overnight
deployments when no one is monitoring.
\`\`\`

## Long-Term Effects

Short-term A/B tests miss important long-term dynamics.

\`\`\`
Effect                        Why A/B Tests Miss It
──────────────────────────────────────────────────────────────
User habit formation          Takes weeks/months to develop
Creator ecosystem health      Creators respond slowly to distribution changes
Content quality evolution     If model rewards low quality, it takes months
                              for content supply to degrade
User trust erosion            Gradual — users tolerate declining quality
                              until they suddenly leave
Network effects               Users influence each other; isolated A/B groups
                              don't capture cross-user dynamics

Measurement Strategies:
  1. Long-term holdout (3-6 months): Reserve 5% of users on old model
     Compare retention curves over time.

  2. Cohort analysis: Track user cohorts from their first exposure.
     Do new users on treatment model retain better at 30/60/90 days?

  3. Ecosystem metrics: Track creator-side metrics (posting frequency,
     creator retention) alongside consumer metrics.

  4. Surveys: Periodic user satisfaction surveys capture subjective quality
     that behavioral metrics miss.
\`\`\`

## Filter Bubbles and Echo Chambers

\`\`\`
The Problem:
  Personalized feed ranking can trap users in information bubbles:
  - Only show content that confirms existing beliefs
  - Reduce exposure to diverse perspectives
  - Amplify polarization

Detection:
  - Topic diversity index: How many unique topics does a user see?
  - Source diversity: How many unique creators/publishers?
  - Political leaning distribution (for news content)
  - "Would you have chosen to see this?" counterfactual surveys

Mitigation:
  - Diversity constraints in re-ranking (minimum topic entropy)
  - Exploration budget: 5-15% of feed slots for novel content
  - Cross-cutting content: deliberately show opposing perspectives
  - User controls: "Show me more/less of this topic"

Measurement:
  - A/B test diversity interventions
  - Track long-term impact on user breadth of interests
  - Monitor for signs of increasing polarization

This is an active area of research with no perfect solution.
The key insight: pure engagement optimization makes bubbles worse;
explicit diversity mechanisms are necessary.
\`\`\`

## End-to-End Evaluation Strategy

\`\`\`
Phase 1: Offline (hours)
  - NDCG, AUC on historical data
  - Replay evaluation: simulate feed with logged data
  - Catch clearly broken models before online testing

Phase 2: Interleaving (1-3 days)
  - Quick directional signal with minimal traffic
  - "Is new model directionally better or worse?"

Phase 3: Small A/B test (1-2 weeks, 5% traffic)
  - Measure primary metrics with statistical significance
  - Monitor all guardrails closely

Phase 4: Full A/B test (2-4 weeks, 50% traffic)
  - Confirm results at scale
  - Measure secondary and ecosystem metrics

Phase 5: Long-term holdout (3-6 months, 5% holdout)
  - Detect delayed positive or negative effects
  - Final confidence before fully deprecating old model
\`\`\`

**Interview tip:** The strongest candidates discuss evaluation beyond basic A/B testing. Mention the tension between short-term engagement metrics and long-term user wellbeing. Discuss guardrail metrics that prevent harmful changes from shipping. And raise the filter bubble problem — it shows you think about societal impact, which senior ML roles at Meta, Google, and TikTok actively grapple with.`,
    },
  ],
};

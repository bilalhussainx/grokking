# Embedding Features Roadmap — Samsara.ai

> Master reference for all embedding-powered features. Phases 1-3 are "build now",
> Phases 4-7 are "plan separately" for future implementation.

**Created:** 2026-03-16
**Infrastructure:** 57 courses embedded (768-dim Gemini vectors) in `course_embeddings` table via pgvector.

---

## Phase 1: Cross-Domain Concept Bridges (Build Now)

**What:** Auto-discover conceptual connections between lessons in different domains (e.g., recursion ↔ Sufi dhikr, Byzantine fault tolerance ↔ social contract theory).

**Why unique:** Only possible because CS + Finance + Philosophy + Religion exist in the same vector space. No single-domain platform can replicate this.

**Implementation:**
- Batch script: embed all lessons, compute cross-domain similarity pairs
- Store in `concept_bridges` table (lesson_a, lesson_b, similarity, bridge_label)
- LLM generates bridge explanations via Moonshot
- UI: "Unexpected Connections" card at bottom of lessons

**Effort:** Low (batch job + 1 UI component)

---

## Phase 2: Semantic Forgetting Curve (Build Now)

**What:** Track how user's "active knowledge vector" (from recent interactions) drifts away from completed lesson embeddings over time. Predict which concepts are fading.

**Why unique:** Duolingo does time-based spaced repetition for vocab. Nobody does embedding-drift-based semantic forgetting for complex multi-domain concepts.

**Implementation:**
- Maintain rolling "active knowledge vector" per user from last 7 days of quiz/voice interactions
- Compare against completed lesson embeddings
- Surface: "Your [Supply & Demand] knowledge is fading. Quick 2-min refresher?"
- API endpoint + notification UI component

**Effort:** Low (scheduled comparison + UI)

---

## Phase 3: Knowledge Fingerprinting (Build Now)

**What:** Compare what users can explain aloud (voice session transcripts) vs what lessons actually teach. Low similarity = shallow understanding.

**Why unique:** No platform measures "can you explain it" via embedding similarity between voice transcripts and source material.

**Implementation:**
- After voice sessions, embed transcript and compare to lesson embedding
- Compute "articulation score" (cosine similarity)
- If low: identify which sub-concepts are missing
- Surface: "You completed Binary Trees but struggled to explain traversal ordering"

**Effort:** Medium (comparison logic + gap identification)

---

## Phase 4: Glossary Context Morphing (Build Now)

**What:** Serve domain-specific glossary definitions based on embedding context. "Model" means different things in ML vs finance vs philosophy.

**Implementation:**
- Add multi-definition variants per glossary term
- Use lesson context embedding to select the right definition
- Show: "This term is also used in [other domain] where it means..."

**Effort:** Low (extend existing glossary)

---

## Phase 5: Misconception Clustering (Plan Separately)

**What:** Embed wrong code submissions and quiz answers. Cluster to discover systematic misconception patterns. Serve targeted remediation when new students make similar mistakes.

**External data:** Stack Overflow wrong-answer patterns, CS education misconception databases.

**Schema needed:**
```sql
CREATE TABLE misconception_clusters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  centroid vector(768),
  label TEXT NOT NULL,
  course_id TEXT,
  lesson_id TEXT,
  occurrence_count INTEGER DEFAULT 1,
  resolution_rate FLOAT,
  remediation_content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Effort:** Medium. Need submission embedding pipeline + clustering batch job + remediation content.

---

## Phase 6: Skills Gap Radar (Plan Separately)

**What:** Embed job postings from Adzuna (free, 12 countries), map to course vectors, show personal skills gap analysis.

**External data sources:**
- Adzuna API (free) — job postings with skill requirements
- O*NET (free, US Dept of Labor) — 923 occupations, skill importance ratings
- Lightcast Open Skills (free) — 32,000+ skills taxonomy
- FRED (free, Federal Reserve) — economic data for finance courses
- BLS (free) — salary trends by occupation

**Schema needed:**
```sql
CREATE TABLE skills_taxonomy (
  skill_id TEXT PRIMARY KEY,
  skill_name TEXT NOT NULL,
  skill_type TEXT,
  category TEXT,
  description TEXT,
  embedding vector(768)
);

CREATE TABLE course_skill_map (
  course_id TEXT NOT NULL,
  lesson_id TEXT,
  skill_id TEXT REFERENCES skills_taxonomy(skill_id),
  relevance FLOAT DEFAULT 1.0,
  PRIMARY KEY (course_id, skill_id)
);

CREATE TABLE user_skills (
  user_id UUID REFERENCES auth.users,
  skill_id TEXT REFERENCES skills_taxonomy(skill_id),
  proficiency FLOAT DEFAULT 0.0,
  earned_at TIMESTAMPTZ DEFAULT now(),
  source_course TEXT,
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE occupation_skill_map (
  onet_code TEXT NOT NULL,
  occupation_title TEXT,
  skill_id TEXT REFERENCES skills_taxonomy(skill_id),
  importance FLOAT,
  median_salary INTEGER,
  job_outlook_pct FLOAT,
  PRIMARY KEY (onet_code, skill_id)
);
```

**Feature output:** "Career Intelligence Dashboard" showing:
- Skills earned from completed courses
- Gap to target role
- Active job postings matching skills
- Salary data + growth outlook

**Effort:** High. External API ingestion + skill tagging + dashboard UI.

---

## Phase 7: External Trend Alignment (Plan Separately)

**What:** Embed arXiv papers, HackerNews threads, financial news. Alert users when new content matches lessons they've completed.

**External data sources:**
- Semantic Scholar API (free, includes 768-dim SPECTER2 vectors — same dimensions!)
- arXiv API (free, no key needed)
- GitHub API (5K req/hr with token)
- Stack Exchange API (10K req/day)
- NewsData.io (200 credits/day free)

**Feature output:** "Knowledge Pulse" daily digest:
- "3 new developments related to courses you've studied"
- "Latest Research" sidebar in lessons with related papers
- "Trending This Week in AI" on relevant course pages

**Effort:** Medium. Daily ingestion pipeline + embedding + notification system.

---

## Content Quality Auditing (Internal Tool — Anytime)

**What:** Detect redundant lessons (similarity > 0.92), off-topic drift (> 2 std devs from module centroid), incoherent progression within modules.

**Output:** Dashboard ranking courses by quality score.

**Effort:** Low. Pure analytics on existing embeddings.

---

## External Data Source Reference

| Source | Free Tier | Best For |
|---|---|---|
| O*NET | Fully free, 923 occupations | Career pathway mapping |
| Semantic Scholar | 5K req/5min, 768-dim vectors | Research paper linking |
| FRED | Fully free, 816K series | Live economic data in finance lessons |
| Adzuna | Free developer access | Job posting skills matching |
| Lightcast Open Skills | Free download, 32K skills | Skills taxonomy |
| arXiv | Free, no key needed | CS/ML paper tracking |
| GitHub API | 5K req/hr | Trending project recommendations |
| Stack Exchange | 10K req/day | Common developer pitfalls |
| Finnhub | 60 req/min | Live market data for finance courses |
| NewsData.io | 200 credits/day | Current events contextual cards |
| BLS | 500 queries/day | Salary trends |
| Google Trends | Alpha API | "Why Learn This Now?" widget |

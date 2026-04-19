# Feature 6.5 — School Database Expansion to 300

## Summary

Expand `cc_schools` from 50 manually-curated rows to ~300 US colleges using the College Scorecard API (api.data.gov). A two-part seed script fetches IPEDS data for rich fields (SAT/ACT, net price by income, Pell %, graduation rate) and merges with a static deadline/test-policy dataset that Scorecard doesn't provide.

## Data Source

**College Scorecard API v1** — free, no rate limits, key-authenticated.
- Base URL: `https://api.data.gov/ed/collegescorecard/v1/schools`
- Docs: https://collegescorecard.ed.gov/data/documentation/
- Env var: `DATA_GOV_API_KEY`

## School Selection (~300 total)

| Category | Count | Selection Criteria |
|----------|-------|--------------------|
| Ivies + T20 privates | ~25 | US News top 20 + Ivy League |
| Top publics per state | ~50 | Flagship public per state |
| High-volume publics | ~50 | >30k applications/year |
| HBCUs | ~25 | Top 25 by enrollment |
| HSIs | ~20 | Top 20 Hispanic-Serving Institutions |
| Liberal arts colleges | ~25 | Top 25 LACs (Williams, Amherst, etc.) |
| Safety/match schools | ~80 | Acceptance >50%, geographically distributed |
| Gap-fillers | ~25 | Ensure every state has ≥2 schools |

## Schema Field Mapping

### From Scorecard API

| cc_schools column | Scorecard field | Notes |
|-------------------|----------------|-------|
| ipeds_id | id | Primary key in Scorecard |
| name | school.name | |
| city | school.city | |
| state | school.state | |
| institution_type | school.ownership | 1=public, 2=private nonprofit, 3=private for-profit |
| enrollment_undergrad | latest.student.size | |
| acceptance_rate | latest.admissions.admission_rate.overall | |
| sat_25 | latest.admissions.sat_scores.25th_percentile.critical_reading + math | Combined |
| sat_75 | latest.admissions.sat_scores.75th_percentile.critical_reading + math | Combined |
| act_25 | latest.admissions.act_scores.25th_percentile.cumulative | |
| act_75 | latest.admissions.act_scores.75th_percentile.cumulative | |
| cost_of_attendance | latest.cost.attendance.academic_year | |
| avg_net_price | latest.cost.avg_net_price.overall | |
| avg_net_price_by_income | latest.cost.net_price.consumer.by_income_level | JSONB with 5 brackets |
| pell_pct | latest.aid.pell_grant_rate | |
| graduation_rate_6y | latest.completion.rate_suppressed.overall | |
| median_earnings_10y | latest.earnings.10_yrs_after_entry.median | |

### From Static Dataset (not in Scorecard)

| cc_schools column | Source |
|-------------------|--------|
| regular_deadline | Manually curated per school |
| early_deadline | Manually curated per school |
| test_policy | Manually curated (required/optional/blind/free) |
| meets_full_need | Derived: true if school is on known meets-full-need list |
| no_loan_institution | Derived: true if school is on known no-loan list |
| first_gen_programs | Manually curated for notable programs |
| npc_url | School's net price calculator URL |

## Architecture

### Files

| File | Purpose |
|------|---------|
| `scripts/seed-schools-scorecard.ts` | Fetches Scorecard API, maps fields, upserts to Supabase |
| `scripts/school-static-data.ts` | Static deadline/test-policy/meets-full-need data for 300 schools |

### Seed Script Flow

1. Load static data map (keyed by school name, lowercase)
2. Fetch Scorecard API in batches of 100 (API supports `_per_page=100`)
3. Use IPEDS ID list to fetch specific schools (not search — deterministic)
4. Map Scorecard response to `cc_schools` schema
5. Merge with static data (deadlines, test policy)
6. Upsert to Supabase on `ipeds_id` (unique constraint exists)
7. Log: schools added, schools updated, schools with missing data

### Scorecard API Query

```
GET /v1/schools?
  id={ipeds_id_1},{ipeds_id_2},...
  &fields=id,school.name,school.city,school.state,school.ownership,
    latest.student.size,latest.admissions.admission_rate.overall,
    latest.admissions.sat_scores.25th_percentile.critical_reading,
    latest.admissions.sat_scores.25th_percentile.math,
    latest.admissions.sat_scores.75th_percentile.critical_reading,
    latest.admissions.sat_scores.75th_percentile.math,
    latest.admissions.act_scores.25th_percentile.cumulative,
    latest.admissions.act_scores.75th_percentile.cumulative,
    latest.cost.attendance.academic_year,
    latest.cost.avg_net_price.overall,
    latest.cost.net_price.consumer.by_income_level,
    latest.aid.pell_grant_rate,
    latest.completion.rate_suppressed.overall,
    latest.earnings.10_yrs_after_entry.median
  &_per_page=100
  &api_key={DATA_GOV_API_KEY}
```

### Idempotency

- Uses `upsert` with `onConflict: "ipeds_id"`
- Safe to re-run: updates existing rows, adds new ones
- Existing 50 schools get enriched with Scorecard data on re-run

## Testing

- Run script, verify 300 rows in `cc_schools`
- Spot-check 5 schools against Scorecard website
- Verify `/schools` browse page shows expanded list
- Verify AI school list generator can match new schools by name

## Not In Scope

- Automated periodic refresh (manual re-run is fine for v1)
- International schools
- Graduate-only institutions
- Community colleges (could add later)

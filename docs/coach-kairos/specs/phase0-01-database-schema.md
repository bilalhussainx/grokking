# Phase 0.1 — cc_* Database Schema

## Spec Reference
PRD Section 8 (Data model)

## Deliverable
Single Supabase migration creating all 13 cc_* tables with RLS policies.

## Tables (13)
1. `cc_student_profiles` — core student identity + first-gen flags
2. `cc_academic_profiles` — GPA, courses, test scores
3. `cc_activities` — 10 Common App activity slots with STAR framework
4. `cc_honors` — 5 honor slots
5. `cc_financial_profiles` — household income, Pell eligibility, FAFSA status
6. `cc_schools` — 550 US/CA colleges with IPEDS + CDS data
7. `cc_student_schools` — student's school list with tier + chancing + status
8. `cc_essays` — essay drafts with phase tracking + counselor share tokens
9. `cc_tasks` — personalized deadline ledger
10. `cc_recommenders` — recommender tracking + brag sheets
11. `cc_scholarships` — 300+ external scholarships
12. `cc_student_scholarships` — matched/applied scholarships per student
13. `cc_aid_offers` — financial aid packages with computed net cost
14. `cc_glossary` — 200+ admissions terms with translations
15. `cc_parent_summaries` — multilingual parent milestone summaries
16. `cc_intake_sessions` — pre-signup voice intake sessions
17. `cc_essay_interactions` — anti-ghostwriting audit log

## RLS Policy
- All student-owned tables: `auth.uid() = user_id` (or `student_id` FK chain)
- `cc_schools`, `cc_scholarships`, `cc_glossary`: public read, admin write
- `cc_parent_summaries`: public read via share_token
- `cc_intake_sessions`: session_token-based pre-auth access

## Indexes
- btree on `student_id` for every student-owned table
- btree on `cc_schools.ipeds_id`
- GIN on `cc_scholarships.eligibility_criteria`
- btree on `cc_tasks.due_date`
- unique on `cc_glossary.term_slug`

## Acceptance Criteria
- [ ] All 17 tables created with correct types and constraints
- [ ] RLS enabled on every table with appropriate policies
- [ ] Indexes created for query performance
- [ ] Migration is idempotent (IF NOT EXISTS)
- [ ] No breaking changes to existing tables

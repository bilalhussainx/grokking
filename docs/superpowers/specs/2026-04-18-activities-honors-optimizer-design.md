# Feature 6.8 — Activities & Honors Optimizer Design Spec

> **Date:** 2026-04-18
> **Status:** Approved

---

## Goal

AI-powered review tool that analyzes a student's Common App activities (10 slots) and honors (5 slots), then suggests description improvements, optimal ordering, gap identification, and impact scoring. AI suggests but never directly modifies — student approves each change.

## Existing Infrastructure

- `cc_activities`: 10 slots with activity_type, organization, role, description_150, STAR fields, grades, hours, impact_score
- `cc_honors`: 5 slots with title, level, grade, description_100
- `ActivitiesForm.tsx` / `HonorsForm.tsx`: working CRUD forms
- `llm-stream.ts`: shared LLM module with `callLLMJSON`

## Features

### 1. Description Polisher
- Reviews each activity's 150-char description and each honor's 100-char description
- Uses STAR fields (if filled) to generate tighter descriptions
- Shows before/after comparison — student accepts, edits, or dismisses
- Respects character limits (150 for activities, 100 for honors)

### 2. Ordering Advisor
- Recommends optimal activity ordering based on: impact, uniqueness, time commitment, alignment with intended major
- Shows current vs recommended order
- Student can accept recommended order or manually reorder

### 3. Gap Analyzer
- Identifies missing activity categories (no community service, no leadership, no work experience)
- Flags implausible hours/weeks (e.g., 40 hrs/week during school year for 3 activities)
- Suggests how to reframe existing activities or what to add

### 4. Impact Scorer
- Rates each activity 1-5 stars for admissions impact
- Criteria: leadership depth, uniqueness, time commitment, growth arc, alignment with application narrative
- Stores in `cc_activities.impact_score`

## Architecture

### Page: `/cc/activities-optimizer`

Three tabs:
- **Review** — description suggestions + impact scores for all activities and honors
- **Reorder** — current vs recommended ordering
- **Gaps** — missing categories and red flags

### API Route: `POST /api/cc/activities/optimize`

Single endpoint that returns full analysis:

```json
{
  "activities": [
    {
      "position": 1,
      "currentDescription": "...",
      "suggestedDescription": "...",
      "impactScore": 4,
      "impactReason": "Strong leadership + measurable outcome",
      "suggestions": ["Quantify the fundraising amount", "Mention team size"]
    }
  ],
  "honors": [
    {
      "position": 1,
      "currentDescription": "...",
      "suggestedDescription": "...",
      "suggestions": ["Specify the competition level"]
    }
  ],
  "recommendedOrder": [3, 1, 5, 2, 4, 6, 7, 8, 9, 10],
  "orderingRationale": "Lead with your strongest leadership role...",
  "gaps": [
    {
      "category": "Community Service",
      "severity": "warning",
      "suggestion": "Consider reframing your tutoring as community service"
    }
  ],
  "flags": [
    {
      "type": "hours",
      "position": 2,
      "message": "30 hrs/week during school year is unusually high — verify this is accurate"
    }
  ],
  "overallStrength": 0.72
}
```

### System Prompt

```
You are a college admissions activities optimizer. Analyze the student's activities and honors list.

Rules:
1. Suggested descriptions MUST respect character limits (150 for activities, 100 for honors)
2. Use active verbs and quantifiable results
3. Impact scores 1-5: 1=filler, 2=average, 3=solid, 4=strong, 5=exceptional
4. Order recommendations: strongest/most unique first, declining impact
5. Be specific in gap analysis — name the missing category and suggest a fix
6. Flag implausible time commitments (>25 hrs/week per activity, >80 total hrs/week across all)
```

## Components

| Component | Path | Purpose |
|-----------|------|---------|
| Optimizer page | `src/app/cc/activities-optimizer/page.tsx` | Main page with 3 tabs |
| SuggestionCard | `src/components/cc/activities/SuggestionCard.tsx` | Before/after for one activity/honor |
| ReorderPanel | `src/components/cc/activities/ReorderPanel.tsx` | Current vs recommended order |
| GapAnalysis | `src/components/cc/activities/GapAnalysis.tsx` | Gaps and flags display |
| API route | `src/app/api/cc/activities/optimize/route.ts` | LLM analysis endpoint |

## Out of Scope

- Drag-and-drop reordering (use "Accept recommended order" button instead)
- Auto-fill STAR fields from description
- Activity suggestions from school-specific data

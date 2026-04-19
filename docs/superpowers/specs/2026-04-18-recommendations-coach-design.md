# Feature 6.9 — Recommendations Coach Design Spec

> **Date:** 2026-04-18
> **Status:** Approved

---

## Goal

Help students manage their recommendation letters: track recommenders, generate personalized brag sheets, draft polite ask emails, and set deadline reminders. Uses `cc_recommenders` table (already exists).

## Features

### 1. Recommender Manager
- Add/edit recommenders (name, subject, email, type: teacher/counselor/other)
- Track status: considering → asked → confirmed → submitted
- Mark as asked/submitted with timestamps

### 2. Brag Sheet Generator
- AI generates a 1-page brag sheet for each recommender
- Pulls from: activities, honors, academics, and student-provided context about their relationship with this teacher
- Output: structured talking points (not a full letter)
- Student reviews and can edit before sharing

### 3. Ask Email Drafter
- AI drafts a polite email requesting the recommendation
- Personalized with teacher name, subject, specific class memories
- Student provides: class taken, grade received, what they appreciated
- AI drafts but student sends themselves

### 4. Timeline Integration
- Auto-creates cc_tasks entries for: "Ask [name] for recommendation" and "Follow up with [name]"

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/cc/recommenders` | GET | List student's recommenders |
| `/api/cc/recommenders` | POST | Add recommender |
| `/api/cc/recommenders/[id]` | PATCH | Update recommender |
| `/api/cc/recommenders/[id]` | DELETE | Remove recommender |
| `/api/cc/recommenders/[id]/brag-sheet` | POST | Generate brag sheet |
| `/api/cc/recommenders/[id]/email-draft` | POST | Generate ask email |

## Components

| Component | Path |
|-----------|------|
| Recommenders page | `src/app/cc/recommenders/page.tsx` |
| RecommenderCard | `src/components/cc/recommenders/RecommenderCard.tsx` |
| AddRecommenderForm | `src/components/cc/recommenders/AddRecommenderForm.tsx` |
| BragSheetView | `src/components/cc/recommenders/BragSheetView.tsx` |
| EmailDraftView | `src/components/cc/recommenders/EmailDraftView.tsx` |

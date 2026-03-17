# Gamification & Engagement Engine Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Samsara.ai addictive through XP, gems, achievements, leagues, variable rewards, AI cards, and always-on hybrid Coach Alex.

**Architecture:** Foundation layer (XP/gems/DB) first, then gamification UI components, then engagement features (quiz cards, AI cards), then hybrid coach behavior. Each layer builds on the previous.

**Tech Stack:** Next.js 14, TypeScript, Supabase, framer-motion, canvas-confetti, Moonshot API

**Spec:** `docs/superpowers/specs/2026-03-16-gamification-engagement-design.md`

---

## Chunk 1: Foundation — Database + XP/Gem Core Logic

### Task 1: Supabase migration for gamification tables

**Files:**
- Create: `supabase/migrations/20260316_gamification.sql`

- [ ] Create all gamification tables: `user_xp`, `xp_transactions`, `gem_balance`, `gem_transactions`, `achievements`, `user_achievements`, `league_groups`, `user_league`, `user_cosmetics`
- [ ] Seed achievements table with 12 starter achievements
- [ ] Commit

### Task 2: XP library

**Files:**
- Create: `src/lib/xp.ts`

- [ ] `earnXP(userId, amount, action, refId?)` — atomic insert into xp_transactions + update user_xp total/weekly/level
- [ ] `getXPProfile(userId)` — returns { totalXp, level, weeklyXp, nextLevelXp, progress% }
- [ ] `calculateLevel(totalXp)` — floor(xp / 500)
- [ ] `checkLevelUp(oldXp, newXp)` — returns true if level changed
- [ ] XP_ACTIONS constant with all earn rates from spec
- [ ] Commit

### Task 3: Gems library

**Files:**
- Create: `src/lib/gems.ts`

- [ ] `earnGems(userId, amount, action)` — add gems + log transaction
- [ ] `spendGems(userId, amount, item)` — atomic check+deduct, returns boolean
- [ ] `getGemBalance(userId)` — returns number
- [ ] Commit

### Task 4: Achievements library

**Files:**
- Create: `src/lib/achievements.ts`

- [ ] `ACHIEVEMENTS` constant — all 12 achievements with criteria
- [ ] `checkAchievements(userId, event)` — check all criteria, unlock any newly earned
- [ ] `getUserAchievements(userId)` — returns list of unlocked achievements
- [ ] `unlockAchievement(userId, achievementId)` — insert + earn gems
- [ ] Achievement criteria checker functions (lesson count, streak, voice minutes, etc.)
- [ ] Commit

### Task 5: XP/Gems API routes

**Files:**
- Create: `src/app/api/xp/earn/route.ts`
- Create: `src/app/api/xp/profile/route.ts`
- Create: `src/app/api/gems/balance/route.ts`
- Create: `src/app/api/gems/shop/route.ts`

- [ ] POST `/api/xp/earn` — earn XP, check achievements, check level up, return { xpEarned, newTotal, levelUp?, achievementsUnlocked[] }
- [ ] GET `/api/xp/profile` — return XP profile + level + achievements
- [ ] GET `/api/gems/balance` — return gem balance
- [ ] POST `/api/gems/shop` — purchase cosmetic item (validate balance, deduct, update user_cosmetics)
- [ ] Commit

---

## Chunk 2: Gamification UI Components

### Task 6: Sound effect hook + audio files

**Files:**
- Create: `src/hooks/useSoundEffect.ts`
- Create: `public/sounds/` (4 mp3 files — generate programmatically or use free sounds)

- [ ] `useSoundEffect()` hook — `play('xp-gain' | 'level-up' | 'achievement' | 'lesson-complete')`, respects `localStorage.getItem('sound-muted')` toggle
- [ ] Generate simple placeholder sounds using Web Audio API oscillator (beep tones at different frequencies/durations — no external files needed for MVP)
- [ ] Commit

### Task 7: XP Fly-Up animation component

**Files:**
- Create: `src/components/gamification/XPFlyUp.tsx`

- [ ] Component: receives `amount` and `trigger` (boolean). When trigger flips true, renders "+{amount} XP" text that animates upward with golden glow and fades out after 1.5s
- [ ] Uses framer-motion `animate` with `y: -60, opacity: 0` transition
- [ ] Commit

### Task 8: Confetti celebration component

**Files:**
- Create: `src/components/gamification/Confetti.tsx`

- [ ] Install canvas-confetti: `npm install canvas-confetti`
- [ ] Component: `<Confetti trigger={boolean} />` — fires 3-second confetti burst when trigger becomes true
- [ ] Commit

### Task 9: Achievement toast notification

**Files:**
- Create: `src/components/gamification/AchievementToast.tsx`

- [ ] Slide-in toast from top-right showing: rarity color border, achievement icon, name, "+{gems} gems", auto-dismisses after 4s
- [ ] Plays achievement sound on mount
- [ ] Commit

### Task 10: XP Context Provider

**Files:**
- Create: `src/contexts/XPContext.tsx`

- [ ] Provides: `{ xp, level, gems, streak, earnXP(), showXPFlyUp(), showAchievement(), refreshProfile() }`
- [ ] Fetches XP profile on mount
- [ ] `earnXP(action, refId?)` — calls API, updates state, triggers fly-up + sound, checks level-up (confetti + level-up sound)
- [ ] `showAchievement(achievement)` — triggers toast
- [ ] Wrap app in provider (modify `src/app/providers.tsx`)
- [ ] Commit

---

## Chunk 3: Nav Bar + Dashboard Integration

### Task 11: Update nav bar with XP, gems, streak

**Files:**
- Modify: `src/components/layout/TopNav.tsx`

- [ ] Add level badge: `⭐ Lv.{level}` (click opens XP progress popup)
- [ ] Add gem count: `💎 {gems}` (click opens gem shop)
- [ ] Keep existing streak and credits
- [ ] Mobile: show just icons with numbers, no labels
- [ ] Commit

### Task 12: XP progress popup

**Files:**
- Create: `src/components/gamification/XPProgressPopup.tsx`

- [ ] Shows: current level, XP bar to next level (animated fill), total XP, weekly XP, league badge
- [ ] Appears as dropdown when clicking level badge in nav
- [ ] Commit

### Task 13: Dashboard XP integration

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Replace static "Day Streak / Courses Started / Completed" stats with: "Level {n} / 🔥{streak} Streak / 💎{gems} Gems"
- [ ] Earn +10 XP on daily login (check last login date, award once per day)
- [ ] Commit

---

## Chunk 4: Lesson Page Engagement

### Task 14: Earn XP on lesson completion

**Files:**
- Modify: `src/components/lesson/LessonPage.tsx`

- [ ] When "Mark Complete" is clicked: call `earnXP('lesson_complete')`, show XP fly-up, play lesson-complete sound
- [ ] On module complete (all lessons done): earn +200 XP, play level-up sound
- [ ] On course complete: earn +1000 XP, trigger confetti
- [ ] Commit

### Task 15: "Did You Know?" AI cards between lessons

**Files:**
- Create: `src/components/gamification/DidYouKnowCard.tsx`
- Modify: `src/components/lesson/LessonPage.tsx`

- [ ] Component: glowing card with lightbulb icon, fascinating fact text, "+5 XP" indicator, 3-second read timer
- [ ] After navigating to a new lesson, 50% chance a DidYouKnow card appears first (overlay)
- [ ] Fact generated by calling Moonshot API with course context, cached in localStorage by lessonId
- [ ] User dismisses card (swipe or tap "Got it!") → earns +5 XP
- [ ] Commit

### Task 16: Quiz cards after every 3rd lesson

**Files:**
- Create: `src/components/gamification/QuizCard.tsx`
- Modify: `src/components/lesson/LessonPage.tsx`

- [ ] Component: 3 multiple-choice questions, one at a time, instant green/red feedback, XP counter
- [ ] Questions generated by Moonshot from lesson content, cached in Supabase
- [ ] +10 XP per correct answer, +30 bonus for perfect (all 3 correct)
- [ ] Shows after every 3rd lesson completion in a module
- [ ] Commit

---

## Chunk 5: Leaderboard + Leagues

### Task 17: League management library

**Files:**
- Create: `src/lib/leaderboard.ts`

- [ ] `getOrCreateLeagueGroup(userId)` — find user's group or create one, assign to Bronze
- [ ] `getLeaderboard(groupId)` — return sorted members with weekly XP
- [ ] `processWeeklyReset()` — promote top 10, demote bottom 5, reset weekly XP (called by cron or API)
- [ ] `getUserLeague(userId)` — returns { league, rank, groupSize, weeklyXp }
- [ ] Commit

### Task 18: Leaderboard API + UI

**Files:**
- Create: `src/app/api/xp/leaderboard/route.ts`
- Create: `src/components/gamification/LeagueBoard.tsx`

- [ ] GET `/api/xp/leaderboard` — returns user's league, rank, group members with XP
- [ ] Component: league name + icon at top, list of members sorted by weekly XP, current user highlighted, promotion/demotion zone indicators (green top 10, red bottom 5)
- [ ] Accessible from dashboard ("View Leaderboard" link)
- [ ] Commit

---

## Chunk 6: Profile Card + Gem Shop

### Task 19: Profile card component

**Files:**
- Create: `src/components/gamification/ProfileCard.tsx`

- [ ] Visual card showing: name, league badge, level, XP bar, streak, top 3 achievement badges
- [ ] Customizable: frame, background, flame color, title (from user_cosmetics)
- [ ] "Share" button — generates PNG via html2canvas with Samsara.ai watermark
- [ ] Commit

### Task 20: Gem shop

**Files:**
- Create: `src/components/gamification/GemShop.tsx`
- Modify: `src/app/settings/page.tsx`

- [ ] Grid of purchasable items: frames, backgrounds, flame colors, title slot, streak freeze
- [ ] Each item shows: preview, gem cost, "Owned" or "Buy" button
- [ ] Purchase calls POST `/api/gems/shop`, updates user_cosmetics, deducts gems
- [ ] Accessible from settings page and by clicking gem count in nav
- [ ] Commit

---

## Chunk 7: Always-On Hybrid Coach Alex

### Task 21: Scroll-based coach messages

**Files:**
- Create: `src/hooks/useScrollCoach.ts`
- Modify: `src/components/ai/AICoach.tsx`

- [ ] `useScrollCoach(lessonContent)` — uses IntersectionObserver on lesson sections
- [ ] At 25/50/75% scroll, adds a proactive coach message to the chat panel
- [ ] Messages: pre-defined pool of 20 generic + lesson-specific from course data if available
- [ ] After 60s idle: "Still with me?" message
- [ ] Commit

### Task 22: Variable teaching style

**Files:**
- Modify: `src/components/ai/AICoach.tsx`
- Modify: `src/app/api/ai/voice-session/route.ts`

- [ ] Determine lesson teaching mode from seeded random: `hash(lessonId + dateString) % 100`
- [ ] 0-59: standard, 60-79: challenge (add "CHALLENGE MODE" to system prompt, 2x XP), 80-89: story mode, 90-99: speed round
- [ ] Add teaching mode indicator in coach header ("⚡ Challenge Mode!", "📖 Story Time")
- [ ] Challenge mode: XP doubled for voice interactions during that lesson
- [ ] Commit

### Task 23: Voice lifecycle — hybrid mode

**Files:**
- Modify: `src/components/ai/AICoach.tsx`

- [ ] On lesson open: auto-start voice, greet, after 30s or first AgentAudioDone → disconnect voice, switch to text mode
- [ ] Text mode: scroll-based messages active, mic button shows "Tap to talk"
- [ ] On mic click: reconnect voice instantly, skip greeting, context: "I'm back — what's on your mind?"
- [ ] On lesson complete: reconnect voice for celebration
- [ ] Track voice state: 'greeting' | 'text-monitoring' | 'voice-active' | 'celebrating'
- [ ] Commit

---

## Chunk 8: Streak Enhancement + Final Integration

### Task 24: Enhanced streaks

**Files:**
- Modify: `src/lib/credits.ts` (or create `src/lib/streaks.ts`)
- Modify: `src/components/layout/TopNav.tsx`

- [ ] Streak freeze: check if user has freeze available before breaking streak
- [ ] Streak recovery: within 24h of break, offer repair for 20 gems
- [ ] Streak milestones: on 7/30/100 days, trigger achievement + gems
- [ ] Streak flame visual: changes color at milestones (7d=blue, 30d=purple, 100d=gold)
- [ ] Commit

### Task 25: Sound mute toggle

**Files:**
- Modify: `src/components/layout/TopNav.tsx` or `src/app/settings/page.tsx`

- [ ] Toggle button in settings (or nav) to mute all gamification sounds
- [ ] Stores in localStorage, respected by `useSoundEffect()` hook
- [ ] Commit

### Task 26: Build verification + push

- [ ] Run `npx tsc --noEmit` — fix any type errors
- [ ] Run `npx next build` — verify build passes
- [ ] Run Playwright tests — verify existing tests still pass
- [ ] Push to GitHub for Vercel deploy
- [ ] Commit

---

## Task Dependency Graph

```
Task 1 (DB migration) ──────────────────────────┐
Task 2 (XP lib) ─────────────────────────────────┤
Task 3 (Gems lib) ───────────────────────────────┤
Task 4 (Achievements lib) ───────────────────────┤
Task 5 (API routes) ─────────────────────────────┤
                                                  ▼
Task 6 (Sound hook) ──┐  Task 10 (XP Context) ──┐
Task 7 (XP FlyUp) ────┤                          │
Task 8 (Confetti) ─────┤                          │
Task 9 (Toast) ────────┘                          │
                       ▼                          ▼
              Task 11-13 (Nav + Dashboard) ──────┐
                                                  ▼
              Task 14-16 (Lesson engagement) ────┐
              Task 17-18 (Leaderboard) ──────────┤
              Task 19-20 (Profile + Shop) ───────┤
              Task 21-23 (Hybrid Coach) ─────────┤
              Task 24-25 (Streaks + Sound) ──────┘
                                                  ▼
                           Task 26 (Verification)
```

**Parallelization:**
- Tasks 1-5 sequential (each builds on previous)
- Tasks 6-9 parallel (independent UI components)
- Task 10 after 6-9 (wraps them)
- Tasks 11-13 after 10
- Tasks 14-23 can be parallelized in 4 groups after 13
- Task 26 last

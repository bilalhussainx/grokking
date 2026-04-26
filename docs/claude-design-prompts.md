# claude.ai/design prompts for KairosLearn features 1-17

Drop these into your existing KairosLearn claude.ai/design project (the same one
that produced the landing page + essay foundation UI). Section 0 establishes
the design system once — paste it as the FIRST message in any new chat in that
project so every subsequent design is consistent. Sections 1-17 are the
per-feature prompts; each one references the design system without re-stating it.

---

## Section 0 — Design system primer (paste once per chat)

```
You're designing for KairosLearn — an AI college counselor for South Asian,
first-gen, and underprivileged applicants. The product already has a landing
page and an Essay Studio in this project; match that aesthetic exactly. Don't
reinvent.

DESIGN SYSTEM (already in this project — read it, don't restate it):
- Background: #05080d (page) / #0a0a0a (cards) / rgba(255,255,255,0.02-0.05) (subtle inserts)
- Borders: rgba(255,255,255,0.08-0.12) / rgba(212,175,55,0.30-0.50) for gold accents
- Primary accent: #D4AF37 (gold) for CTAs, focus, status "active"
- Secondary accents: emerald (success) / amber (warning) / rose (urgent/error) / sky (info)
- Type: Cormorant (display headlines), DM Sans / Inter (body, UI), JetBrains Mono (numbers)
- Tone: cinematic, premium edtech. NOT generic SaaS. NOT corporate.
- Motion: framer-motion easing — slow fade-in, gentle stagger, no bounce
- Density: dashboards are spacious; lists are tight (12-13px body, 11px labels)
- Mobile: every screen must work at 390px wide with no horizontal scroll
- Iconography: lucide-react icons, 14-16px, 1.5px stroke
- Voice (text in non-English scripts): RTL support for Urdu (Noto Nastaliq Urdu),
  always use dir="auto" so mixed-script content flows naturally

INTEGRATION CONTRACT:
- I'll ship handoff bundles to Claude Code, which converts to Tailwind + Next.js.
- All new pages live under the existing (dashboard) layout — don't design a
  new chrome / nav / footer.
- All new tables/forms reuse the same input + button styles already in the
  Essay Studio. If you invent a new component, it should look 90% like an
  existing component with a 10% twist for purpose.

PRIVACY DEFAULTS:
- Surfaces that show student data to a parent: NEVER show essay drafts,
  brainstorm transcripts, GPA struggles, or test scores. Show high-level
  status only.
- Voice mode UIs default to the student's chosen language; never switch
  language silently.

What I'll send you: feature-by-feature prompts. Each prompt names the screens
needed and the success criteria. Reply with handoff-quality mockups + one
"why I made this choice" sentence per screen. When the screen is clearly the
extension of an existing pattern, say "mirrors X with Y change" rather than
re-mocking it.
```

---

## Section 1 — Feature 1A: Hindi/Punjabi Voice + Multilingual Coach

```
Design 4 screens for Feature 1A: multilingual voice + family mode.

Screen 1 — First-login language picker (/onboarding/language)
A full-screen 18-tile picker. Each tile is a 4:3 card showing:
- Native script name (the language's own script, large — 28-32px)
- One-line greeting in that language ("I'm here to listen to your story" /
  "میں تمہاری کہانی سننے کے لیے یہاں ہوں" / "मैं तुम्हारी कहानी सुनने के लिए यहाँ हूँ" etc.)
- A small pill at the bottom: gold "🎙 Voice" or white-30% "📝 Text only"
The 18 tiles in a 6-column grid (collapses to 3 on tablet, 2 on mobile).
Tap to select; show a gold-bordered selection state. Gold loading spinner
overlays the picked tile while saving. No skip button — the user must pick.
Below the grid: small caption in 11px white-35%: "The platform interface stays
in English. Coach Kairos speaks your chosen language. Urdu is text-only —
voice support coming soon."
The 17 voice languages are: en, es, fr, de, it, nl, ja, hi, bn, ta, te, gu,
kn, ml, mr, pa, od. The 18th is ur (text-only, RTL, Nastaliq script — render
it correctly).

Screen 2 — Coach drawer (right slide-out, 400px) in Urdu mode
The drawer already exists; design the Urdu STATE of it. Header has Languages
icon + Family-Mode (Users) icon + voice toggle (greyed/disabled with tooltip
"Voice for Urdu coming soon — try Hindi for voice"). Bubbles render RTL in
Nastaliq. A typed message in mixed script: "میں MIT جانا چاہتا ہوں" — "MIT"
stays LTR inside the RTL flow. Composer textarea is dir="auto".

Screen 3 — Family Mode overlay
Full-screen modal overlay (sits ABOVE whatever route the student was on).
Black/85 + backdrop blur. Top bar: language label on left, "Hand back to
student" link on right (gold). Centered: a 96x96 gold mic button (circle).
States: idle (gold), listening (rose, pulsing), thinking (white/10 with
spinner). Below the mic: localised "Tap to speak" / "Listening…" / "Coach
Kairos is thinking…" caption. Above the mic: last 4 turn bubbles (parent
on right white/10, coach on left gold/15).

Screen 4 — Story Canvas with Fragments + Directions cards
Right rail of the brainstorm page. Two stacked cards:
- "Fragments" card (top, NEW) — shows English fragments extracted from
  non-English brainstorm turns. Each fragment is an italicised quote with
  a row of theme-tag chips below (white/45, 10.5px). Empty state:
  "The coach will lift specific moments from your brainstorm and translate
  them to English here — material you can use directly when you start
  drafting."
- "Directions" card (below, was "Emerging themes") — chips, "Pick one to
  develop", existing pattern.

Match the existing Essay Studio rail card style (rounded-xl, white-10 border,
white-2% fill, 12.5px body).
```

---

## Section 2 — Feature 1B: Voice GPA + Translate-for-parent + 11pm Prompt

```
Design 3 small surfaces for Feature 1B.

Screen 1 — Working-late toast
A bottom-right toast (bottom: 92px, right: 24px) that auto-shows at 10pm.
Width 320px max. Black/95 background, gold border (rgba(212,175,55,0.30)),
backdrop-blur. Moon icon on left in gold, body text "Working late? Coach
Kairos is here whenever you need." Caption in white/55: "English, Hindi,
Punjabi, Spanish, French, German, Italian, Dutch, Japanese — and 8 more."
Tiny X in top-right to dismiss. Auto-dismisses after 12 seconds.

Screen 2 — Translate-for-parent button + modal
The button: small pill with Languages icon, "Translate for parent" — placed
on the brag-sheet PDF preview, aid summary table, scholarship list. Match the
existing inline-button style from Essay Studio.
The modal: centered, max-width 2xl, max-height 80vh. Top bar with title +
close X. Below: language dropdown (preloaded with Urdu / Hindi / Punjabi /
Bengali / Tamil / Telugu / Gujarati / Kannada / Malayalam / Marathi / Odia /
Spanish / French / Japanese / German / Italian / Dutch — i.e. all parent
languages, NO English). Translate button in gold. Result area below in
white/85, 14px, whitespace-pre-wrap, dir="rtl" for Urdu / Arabic / etc.
Footer: copy-to-clipboard button. Caption above the result: "for parent
comprehension only — not formal submission."

Screen 3 — Voice GPA explainer button next to the GPA conversion display
The existing GPA conversion already shows e.g. "87% FSc → 3.5-3.8 GPA".
Add a small speaker-icon button right next to it that says "Speak in [your
language]". Tapping it speaks the localized explanation. Match the inline
icon-button style already in Essay Studio.
```

---

## Section 3 — Feature 2: Application Deadline Calendar

```
Design 3 screens for the application tracker (replacing every student's
spreadsheet).

Screen 1 — Application board (/applications, default view)
4-column Kanban: Not started / In progress / Submitted / Decisions. Each
column has a small label in 11px uppercase white/55. School cards are
rounded-xl, border-color reflects urgency:
- Default: white/10
- < 30 days: amber/30 with amber/5 fill
- < 14 days: rose/50 with rose/5 fill (PULSING red border)
Card content (collapsed): school name + plan badge (10px uppercase),
"Next: 2026-01-04 (8 days)" line color-matched to urgency, 0/7 component
progress bar with gold fill + small "0/7" label.
Card content (expanded — when tapped): plan dropdown, status dropdown, ED
warning banner if plan is ED/EDII/REA (3 colors based on student's
financial profile — see Feature 5), 7 component checkboxes in 2-col grid,
inline date pickers for each deadline, portal URL link.

Right sidebar (lg+ only, sticky): "Next deadlines" card listing top 5
upcoming with days-until in color-coded font. Below it: link to Calendar
view.

Top of page: red-50 alert banner when any deadline < 14 days, "Deadline
alert: 3 deadlines within 14 days." Top right of header: two pill buttons —
"Which plan should I choose?" (opens explainer modal) and "Export to
calendar (.ics)" with download icon.

Screen 2 — Deadline calendar (/applications/calendar)
Monthly grid, 7 columns. Each cell shows the day number + colored pill per
deadline: rose (EA/ED/REA), amber (RD), sky (aid/CSS), emerald (FAFSA).
Pills truncate to school name. Hover shows tooltip with full deadline
details. Top bar: chevron-left / month name / chevron-right. Sidebar:
"Upcoming" card with next 10 deadlines + days-until.

Screen 3 — Plan explainer modal
Triggered by "Which plan should I choose?". Centered modal with a 5-column
table: Plan / Binding? / Benefit / Restriction / Best for. 6 rows:
ED / EDII / EA / REA / RD / QuestBridge. Bold the plan name. Subtle
zebra-striping with white/3. Close X in header.
```

---

## Section 4 — Feature 3: Activities Optimizer Narrative Layer

```
Design 1 panel that sits BELOW the existing Activities Optimizer's tabs.

Panel — Narrative Diagnosis (post-analysis state)
Mounted on /cc/activities-optimizer above the existing tabs. Hero header:
Sparkles icon + "Narrative Diagnosis" + on the right a profile-type badge:
- SPIKE: emerald/15 fill, emerald/40 border, emerald/300 text, sharp
  rectangular pill
- WELL-ROUNDED: sky/15 fill, sky/40 border, sky/300 text, rounded pill
- UNCLEAR: amber/15 fill, amber/40 border (DASHED), amber/300 text

Below: a blockquote with a left gold border (border-l-2 border-[#D4AF37]),
italic 14px white/85: "What admissions sees: [2-3 sentences]". The block
is the most prominent element on the panel.

Then 3 chip rows:
- "Strengths" (11px uppercase emerald/400 label) → emerald chips
- "Gaps" (amber/400 label, with AlertTriangle icon) → amber chips
- "Suggested additions" (sky/400 label, with Plus icon) → sky chips with
  "+" prefix

Then a "For your school list" card (white/4 fill, white/5 border): Target
icon + recommendation paragraph that names the user's actual schools.

Then optional "Cultural context" section (only visible when present):
list of 0-3 italic notes in white/70 explaining e.g. "Khuddam al-Ahmadiyya
is the youth auxiliary of the Ahmadiyya Muslim Community in Pakistan; this
is a national-level leadership position".

Empty state (before clicking Analyze): white/55 italic — "Read your
activities the way an admissions reader will. The diagnosis names what
your list is telling them, what's missing, and what to add." + a gold
"Analyze My Story" button with Sparkles icon. Locked when fewer than 3
activities — show grey state with caption "Add at least 3 activities to
unlock the Narrative Diagnosis."
```

---

## Section 5 — Feature 4: Supplemental Essay Studio

```
Design 2 screens for the supplements system.

Screen 1 — Supplements dashboard (/cc/essays/supplements)
A header summary: "You have 23 required supplements across 9 schools.
Estimated time: ~12 hours." (numbers come from the API). Below: a 3-column
grid (collapses to 2 on tablet, 1 on mobile) of school cards. Each card:
- School name on left, ArrowRight icon on right
- Subline: "3 required, 1 optional"
- Progress bar (gold fill if all required complete = emerald, else amber)
  with "0/3" count
Card border + tint by status:
- Not started: white/10, white/2
- In progress (anything started): amber/30, amber/5
- Complete (all required at phase=final): emerald/40, emerald/5

Top right link: "Personal Statement →" (back to existing PS flow).

Screen 2 — Per-school workspace (/cc/essays/supplements/[school])
Header: "← All schools" link, then "[School] supplements" title, then
caption "N prompts for the 2026 cycle."
Below: vertical list of prompt cards. Each card:
- Top row: type label in 10px uppercase white/45 ("Why this school · 250
  words" + a small "required" tag in rose/300 if applicable), and an
  optional emerald checkmark on the right if phase=final.
- Body: full prompt text in 13px white/85, multiline.
- Footer: status caption ("47 / 250 words · outline phase" or "Not
  started" italic) on left, and a CTA on right:
  - If essayId: gold link "Open editor →"
  - If not started: gold pill button "Start" with FileText icon
Card status colors mirror the dashboard.
```

---

## Section 6 — Feature 5: ED / EA / REA Strategy

```
Design 2 components that EXTEND the application tracker (Feature 2).

Component 1 — REA conflict banner (top of /applications)
A red banner that appears when REA conflict is detected. Style: rose/20 fill,
rose/50 border, rose/100 text. Layout: TriangleAlert icon + bold "REA
conflict" headline + multiline message: "You selected REA for [School]. REA
restricts EA/ED to other private schools — change [school list] to RD, or
drop your [School] REA application."
Sits between the existing "Deadline alert" banner and the page content.

Component 2 — 3-state ED warning inside the expanded school card
When the student picks ED/EDII/REA in the plan dropdown, this banner appears
inline in the expanded card (NOT a modal). Three states:

STATE A (safe — emerald):
- Background: emerald/15, emerald/40 border
- Headline: "ED looks safe: ED is a strong choice if this is your #1"
- Body: "Your affordability profile suggests aid won't be the deciding
  factor. ED at [School] can boost your acceptance odds by 15-25%..."

STATE B (warning — amber):
- Background: amber/15, amber/40 border
- Headline: "ED warning: ED is binding — and aid you receive could fall short"
- Body: explanation
- Bullet list of alternatives ("Apply EA — same early signal without
  binding", "Apply RD so you can compare aid offers", "Run NPC before
  deciding")

STATE C (block — rose):
- Background: rose/15, rose/50 border
- Headline: "ED not recommended: [School] is need-aware for international
  applicants"
- Body: explanation
- Bullet list of alternatives

All three states use the same compact size (~11.5px text, padding-3) so
they don't dominate the expanded card. Just clearly differentiated by color.

Also design a small "Heads up" amber inline note: "[School] doesn't offer
ED. Confirm on the school's admissions page." (when student picks an
unsupported plan).
```

---

## Section 7 — Feature 6: Waitlist Management

```
Design 1 screen for /cc/waitlist.

Screen — Waitlist
Header: "Waitlist" + subline "Schools where you've been waitlisted. Generate
a Letter of Continued Interest, mark it sent, and decide whether to stay."

List of waitlisted-school cards (one per school with status=waitlisted on the
applications board). Each card:
- Top row: school name (14px medium white) + status badge if LOCI was sent
  ("LOCI sent" pill in emerald/10 with emerald/30 border)
- A gold pill button "Open LOCI generator"

When the LOCI generator is open (inline expansion):
- Two textareas:
  1. "What's new since you applied? (graded class, leadership change,
     project outcome…)" — 3 rows
  2. "Why is [School] still your top choice? (one specific program /
     professor / opportunity)" — 2 rows
- Gold "Generate LOCI" button with Mail icon (loading state shows spinner)
- Below, when generated: word count caption (e.g. "267 words"), then the
  letter in white/4 card with whitespace-pre-wrap, then 3 actions:
  - Copy (white/5 button)
  - Save draft (white/5 button)
  - Mark as sent (emerald/15 button in emerald/200)

Design the card both COLLAPSED (just school name + button) and EXPANDED
(with the form + result).
```

---

## Section 8 — Feature 7: Teacher Recommendations

```
Design 2 surfaces extending the existing /cc/recommenders page.

Surface 1 — Per-school submission tracker (collapsible inside each
recommender card)
Each existing teacher card already shows name + subject + status. Below the
existing buttons row, add a `<details>` that expands to show "Per-school
submission status". When open: 2-col grid of school name + checkbox. Checking
the checkbox flips submitted=true for that (recommender, school). Show a
small green Check icon when submitted. Above the grid: caption "Tracks which
schools the teacher has submitted to. You'll have to ask them honestly."

Surface 2 — Ask-email modal
Triggered by a "Generate ask email" button on each teacher card (Mail icon).
Modal layout:
- Title "Ask email — [Teacher Name]"
- A small disclaimer: "This is a draft. Read it and personalize before
  sending. Make it clear they can say no."
- Generated email body in white/4 card, whitespace-pre-wrap, ~150-200
  words. Mono font for "Subject:" line if present.
- Buttons: Copy + Regenerate
- Optional sub-button: "Save to recommender" (writes to ask_email_text)

The modal matches the existing modal style from Essay Studio (centered,
max-width 2xl, black/95 fill, white/10 border).
```

---

## Section 9 — Feature 8: Interview Prep Reflection + Questions

```
Design 1 screen at /cc/interview-prep/reflect with 4 stacked sections.

Screen — Interview reflection + questions

Section 1 — Generate questions to ask the interviewer
HelpCircle icon + heading "Generate questions to ask the interviewer".
3-input row: school text input + interests text input + gold "Generate"
button. When result arrives: numbered list (3 items, 13.5px white/85)
+ italic 11.5px rationale below.

Section 2 — After your interview (reflection form)
MessageSquare icon + heading "After your interview". Form fields:
- Two-col: school + date pickers
- Textareas (rows=2 each): "What went well?", "What was hard?", "Questions
  they asked", "Questions you asked"
- Confidence slider (1-10) — number input is fine
- Gold "Save reflection" button

Section 3 — Confidence trend (only when 2+ saved sessions exist)
TrendingUp icon + heading "Confidence trend (last N)". Compact bar chart
height 64px, bars are gold/40 rounded-top, sized by confidence/10. Hover
shows tooltip with score.

Section 4 — Common mistakes (always visible)
Heading "Common mistakes". Vertical list of 5 paired items:
- Red text starting with "✗" (the mistake)
- Green text starting with "✓" (the fix)

Section 5 — Past reflections (when any exist)
Heading "Past reflections". List of left-gold-bordered items:
- School name (bold) + date (white/55) + confidence (white/55)
- AI feedback paragraph in italic white/70 below
```

---

## Section 10 — Feature 9: SAT/ACT Strategy Engine

```
Design 1 screen for /cc/test-strategy with 3 sections.

Screen — SAT/ACT strategy

Section 1 — Recommendation card (only when plan is set)
Gold-bordered card (border-[#D4AF37]/40, bg-[#D4AF37]/5).
Heading: "Recommended: [SAT/ACT/BOTH]" with the test name in gold.
Bullet list of 1-2 reasons.
Gold "Register →" link to satsuite.collegeboard.org or act.org.
Below: fee-waiver banner (emerald if eligible, else white/5 grey):
- Eligible: "You qualify based on free/reduced-price lunch. Ask your
  school counselor for a fee waiver code — it covers SAT registration
  AND 4 free score reports."
- Not eligible: "SAT/ACT fee waivers are only available to U.S. domestic
  students..." (varies by reason)

Section 2 — SAT vs ACT quiz
Heading "Take the SAT vs ACT quiz". 6 questions in numbered ordered list.
Each question has 3 radio options (SAT-leaning / ACT-leaning / Either).
Below the questions: 2 checkboxes:
- "I receive free or reduced-price lunch"
- "My family receives public assistance (SNAP, TANF, etc.)"
Then a gold "Get my recommendation" button (disabled until all 6 answered).

Section 3 — Score history
Heading "Score history". Inline form: type select (SAT/ACT/PSAT) + date
picker + total score input + Plus button. Below: list of attempts (one row
per attempt) showing date · type on left, score in mono on right.
Empty state: white/40 italic "No attempts logged yet."
```

---

## Section 11 — Feature 10: Parent Communication Portal

```
Design 1 standalone page at /parent/[token] (no chrome — it's NOT inside
the dashboard layout; parents don't have a Supabase session).

Page — Parent portal
Centered max-width 2xl, dark background, paper-like calm. Localizes per
preferred_language (en / ur / hi / pa to start; full 17-language support
later). Urdu must render RTL with Nastaliq.

Header section:
- Tiny eyebrow: "Welcome" / "خوش آمدید" / "स्वागत है" / "ਜੀ ਆਇਆਂ ਨੂੰ"
- 2xl heading: parent's name (or email if no name)
- Subline: student preferred name + grade (e.g. "Bilal · Grade 12")

Then 4 cards (white/10 border, white/2 fill, rounded-xl, padding-4):

Card 1 — Application status: heading + list of school name + chancing band
+ status (e.g. "MIT — reach · in_progress"). NO essay drafts, NO GPA, NO
brainstorm content.

Card 2 — Financial aid posture: heading + a single sentence summary
("Needs full financial aid — focus on need-blind schools." OR
"Affordability ~$X/year — flexible.")

Card 3 — Essay progress: heading + single line "1/5 essays submitted"

Card 4 — Voice callout: gold-bordered (D4AF37/40, D4AF37/5). Heading in gold,
body in white/75. In Urdu: "آپ کا بیٹا/بیٹی اپنے ڈیشبورڈ سے 'Hand to parent'
بٹن دبا کر آپ کو فیملی موڈ میں جوڑ سکتا ہے۔" Same callout localized in
each supported language.

Expired state: a single centered card "Invite expired — ask your child to
send you a fresh link." Don't render any data.
```

---

## Section 12 — Feature 11: Course Selection Advisor

```
Design 1 screen at /cc/courses with 3 sections.

Screen — Course rigor

Section 1 — Add a course
A 5-column row: course name input (flex-1) + level select (Honors / AP /
IB HL / IB SL / A-Level / Dual / "") + curriculum select (US (AP) / IB /
A-Levels / FSc / Pakistan / CBSE / India / Other) + grade select (9-12) +
gold "Add" button with Plus icon.
Below: list of added courses, one per row, with course name + level + grade
+ X delete button.

Section 2 — Analyze rigor button
Gold "Analyze rigor" button with Sparkles icon. Disabled when fewer than
1 course. Loading state: spinner + "Analyzing rigor…"

Section 3 — Rigor result card (gold-bordered, only after analysis)
- Top: rigor badge in 10px uppercase gold ("most_rigorous" → "MOST RIGOROUS")
- 13.5px summary paragraph naming specific courses
- "Strengths" subhead (emerald/400) + bulleted list
- "Gaps" subhead (amber/400) + bulleted list (1-3 concrete missing courses
  e.g. "no AP Calc BC")
- For international students with FSc/A-Levels/IB: a left-gold-bordered
  italic 12px caption — "internationalNote" — explaining how the student's
  curriculum translates for U.S. readers ("FSc Pre-Med is roughly equivalent
  to taking AP Bio + AP Chem + AP Physics in the U.S. system, and it
  signals strong rigor — but you should explain this in the Additional
  Information section.")
```

---

## Section 13 — Feature 12: Major + Career Exploration

```
Design 1 screen at /cc/majors.

Screen — Major + career exploration
Header + subline as usual.

Card 1 — Interests
Heading "Interests" (11px uppercase white/55).
Chip cloud of ~18 common interests (math, biology, chemistry, physics,
computer science, engineering, business / economics, history, philosophy,
psychology, literature, art / design, music, languages, environment /
sustainability, public policy, medicine / health, social justice). Chips
are pill-shaped, white/5 default, gold/15 fill + gold/40 border + gold
text when selected. 12px text.
Below the chips: a textarea "Anything else you want Coach Kairos to know?
(favorite class, topic you can't stop reading about, etc.)"
Gold "Suggest majors" button with Sparkles icon.

Result section (only after submit):
- Narrative thread: italic 14px blockquote with left gold border, 1-2
  sentences connecting the student's interests
- "Suggested majors" card: list of 4-6 majors. Each row: small fitScore
  badge (e.g. "8/10" in 10px uppercase gold) on left, then major name (13.5px
  white) + rationale (12px white/65) stacked on right.
- "Career paths" card: list of 3-5 entries each formatted "[Career] → [Major
  path]" with "Career" in white/90 bold and arrow in white/50.
```

---

## Section 14 — Feature 13: College Visit Tracker

```
Design 1 screen at /cc/visits.

Screen — Campus visits

Section 1 — Log a visit
3-column row: date picker + school select (from app tracker) + visit-type
select (in_person / virtual_tour / info_session / fair / webinar /
rep_meeting). Below: notes textarea (2 rows). Gold "Add" button with Plus
icon.

Section 2 — Demonstrated interest indicator (only when ≥1 visit logged)
Heading "Demonstrated interest". List of all schools from the app tracker.
Each row: school name on left, on right a count badge:
- 0 touchpoints: white/30 ("0 touchpoints")
- 1 touchpoint: amber/300 ("1 touchpoint")
- 2+ touchpoints: emerald/300 ("3 touchpoints")

Section 3 — Virtual tours
Heading "Virtual tours". List of 5 hardcoded school links — gold text,
external-link icon: MIT / Harvard / Stanford / Yale / Princeton. The
underlying URLs are fixed; just style the list.

Section 4 — History (only when ≥1 visit logged)
Heading "History". List of visit rows. Each: type-icon (matched to visit
type — MapPin for in_person, Video for virtual_tour/webinar, BookOpen for
info_session, Users for fair, Mail for rep_meeting), then date, then type
label (white/55), then "— [School Name]" if school was selected.
```

---

## Section 15 — Feature 14: Summer Experience Planning

```
Design 1 screen at /cc/summer.

Screen — Summer experiences

Section 1 — Add an experience
2-column row: name input (flex-1) + category select (Research / Internship /
Job / Volunteer / Camp/Program / Online course / Self-directed project /
Family obligation). Below: 2-col date pickers (start, end). Below: description
textarea (2 rows). Gold "Add" button with Plus icon.

Section 2 — South Asian / Pakistan alternatives (always visible, gold-
bordered card)
Heading: "South Asian / Pakistan alternatives" with Sun icon.
Hardcoded list of 7 entries. Each: bold name + " — " + category in white/55:
- Aga Khan University Health Camp (Karachi) — Volunteer
- LUMS Summer Coding Bootcamp (Lahore) — Camp/Program
- Edhi Foundation hospital volunteer — Volunteer
- TCS Foundation literacy mentor (Pakistan) — Volunteer
- Local masjid Quran-teaching assistant — Volunteer
- Family business shift work — log honestly as 'job' — Job
- MIT OCW / Khan Academy + project (US-recognized) — Online course

The "log honestly as 'job'" copy is intentional — design it without
flinching from it. That's the whole product positioning.

Section 3 — Logged experiences (when ≥1 exists)
Vertical list. Each: bold name + category badge + date range. Description
in white/65 below if present. Border-bottom on each row.
```

---

## Section 16 — Feature 15: Junior Year Dashboard

```
Design 1 screen at /cc/dashboard-junior.

Screen — Junior year dashboard
This is the home screen for students with grade_level=11. Cinematic but
focused — the student is 9-12 months from applications.

Header section:
- Eyebrow "Junior year" in 12px uppercase white/55
- 2xl heading "Your runway to applications"
- Subline: gold-highlighted countdown — "[N] days until Common App opens
  (August 1)" — followed by "Most ED/EA deadlines hit ~90 days after that."

Phase checklist card (white/10 bordered, the main content block):
Numbered list of 6 phase items. Each item:
- Tiny gold "Phase: Now → Spring" / "Spring" / "Summer" / "Fall (senior
  year)" eyebrow
- 13.5px white/85 goal text + arrow → at the end
- Whole row is a hover-able link to the relevant feature page

Tile grid (2-col mobile, 3-col tablet+):
6 tiles, each rounded-xl with white/10 border, hover lifts to white/4 fill.
Tile content: lucide icon (gold) + 12.5px white label + (optional) 10px
white/45 caption.
Tiles:
1. Applications (Calendar icon) — /applications
2. Course rigor (BookOpen) — /cc/courses
3. SAT / ACT plan (ChartBar) — /cc/test-strategy
4. Brainstorm only (FileText) + caption "Draft + revise unlock at grade 12"
   — /cc/essays
5. Activities (Mic) — /cc/activities-optimizer
6. Major exploration (MessageSquare) — /cc/majors

Wrong-grade message (separate state): if grade_level !== 11, show a
centered card "This dashboard is for grade 11. Your profile says grade [N]"
+ a gold link "← Main dashboard".
```

---

## Section 17 — Feature 16: Grade 9 Dashboard

```
Design 1 screen at /cc/dashboard-grade9.

Screen — Grade 9 dashboard
This dashboard is intentionally smaller and softer than the junior dashboard.
A grade-9 student should feel encouraged, not overwhelmed. NO essay studio,
NO application tracker, NO SAT/ACT, NO interview prep tiles.

Header:
- Eyebrow "Grade 9"
- 2xl heading "You have time. Use it on the right things."
- Subline: "Grade 9 isn't about applying — it's about laying down the
  academic foundation and discovering what you actually care about."

Card 1 — 4-year game plan (Compass icon)
Numbered list of 4 entries (Grade 9 / 10 / 11 / 12). Grade 9 is highlighted
in white text + gold "Grade 9:" label; the others are dimmed (white/55,
white/55 label). This visually anchors the student in their current year.
Content (one line each):
- Grade 9: Build habits, take ONE harder course, join 2 clubs you actually like
- Grade 10: Add depth in one area, take PSAT 10, log meaningful summer
- Grade 11: AP / IB load, real testing, school list draft, summer
  research/program
- Grade 12: Apply. Essays, supplements, interviews, financial aid

Card 2 — What actually matters in admissions (Target icon)
List of 5 rows. Each:
- Bold thing (white/90)
- Smaller why (white/55, 12.5px) below
Items:
- Course rigor + grades / Most heavily weighted by every selective school
- 1-2 deep activities (with leadership) / Beats 10 shallow ones every time
- Standardized tests (when applicable) / Test-optional ≠ test-blind. Strong
  scores still help most schools
- Essays + recommendations / What the rest of your file can't show
- Demonstrated interest at certain schools / Visit, attend a webinar, follow
  up — some schools track it

Tile grid (3 tiles only):
1. Track your courses (BookOpen) — /cc/courses
2. Explore majors (low-stakes) (Compass) — /cc/majors
3. Plan summer (Heart) — /cc/summer

Footer caption (centered, small, white/40 italic):
"Essay Studio, Application Tracker, SAT/ACT Strategy, Interview Prep, and
Financial Aid are unlocked at grade 11."

Wrong-grade message: same pattern as junior dashboard.
```

---

## Section 18 — Feature 17: Transfer Student Dashboard

```
Design 1 screen at /cc/dashboard-transfer.

Screen — Transfer dashboard

Header:
- Eyebrow "Transfer applicant"
- 2xl heading "Transfer dashboard"
- Subline "Transfer admissions is a different game — different deadlines,
  different essays, different acceptance rates."

Two states for the profile section:

State 1 — Empty (no transfer profile saved yet) OR editing
A form with:
- Current school text input
- Credits completed number input
- Target term text input (e.g. "Fall 2026")
- "Why are you transferring? (be specific)" textarea (3 rows)
- Gold "Save" button

State 2 — Saved
A read-only card showing the saved profile values + an "Edit" link
(gold, top-right of the card).

Below the profile, ALWAYS show:

Card — GPA recovery framing (amber-bordered, amber/5 fill)
Heading: "Reframe your GPA story" (amber/200)
Body (12.5px white/85):
"A weaker first-year GPA followed by an upward trajectory is one of the
most common transfer narratives — and it works. Use the 'Why transfer'
essay to name the inflection point honestly. Don't blame; describe what
changed and what you learned."

Tile grid (2 tiles per row, 4 total):
1. Why-transfer essay (FileText) + caption "Use Essay Studio with prompt
   type 'why_transfer'" → /cc/essays
2. Transfer school list (ArrowRight) + caption "Add schools — transfer
   rates differ from first-year" → /applications
3. Professor recs (GraduationCap) + caption "Transfers need college-prof
   recs, not high school" → /cc/recommenders
4. Course evaluations (BookOpen) → /cc/courses
```

---

## Workflow recommendations

1. **Paste Section 0 first** in any new chat in your KairosLearn claude.ai/design
   project. That establishes the design system once. Then paste a feature
   section. Iterate within that chat until handoff-ready, then start a new
   chat for the next feature so context stays fresh.

2. **Generate in groups of related features** for visual consistency:
   - Group A: 2 + 5 (the application tracker pair)
   - Group B: 6 + 7 + 8 (the post-application support trio)
   - Group C: 11 + 12 + 14 (the exploration / planning trio)
   - Group D: 15 + 16 + 17 (the three role-specific dashboards)
   - Standalones: 1A + 1B (voice/multilingual), 3 (narrative diagnosis),
     4 (supplements), 9 (test strategy), 10 (parent portal), 13 (visits)

3. **Hand-off bundles**: when each feature design is ready, click "Hand off
   to Claude Code" in claude.ai/design. Take the URL or exported notes and
   either (a) paste them into a new Claude Code chat alongside one of the
   `feat(N)` commits to refine the existing implementation, or (b) save
   them under `docs/superpowers/designs/2026-XX-XX-feature-N/` so future
   sessions can reference them.

4. **Iterate on density**: claude.ai/design tends to over-pad mockups. If a
   screen feels too sparse, ask explicitly "tighten the density to match the
   existing Essay Studio" — that pulls it toward the right rhythm.

5. **Don't redesign chrome**: if claude.ai/design proposes a new sidebar /
   nav / footer, push back hard. All these features live INSIDE the existing
   (dashboard) layout.

---

## Future: when claude.ai/design ships an MCP

There's no `claude.ai/design` MCP today (April 2026). Anthropic's design
connector library currently includes Figma and Canva. If a `claude.ai/design`
MCP ships in the future, this guide can be retired in favor of direct tool
calls from Claude Code. For now, the prompt-and-paste workflow above is the
fastest path.

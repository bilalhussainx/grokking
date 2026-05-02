# Coach Kairos variant drift — synthetic test

**Run at:** 2026-05-02T00:40:05.737Z
**Model:** anthropic/claude-sonnet-4-6 via OpenRouter
**Probes per variant:** designed to lure the model out of the variant's lane

## Summary

| Variant | Pass | Weak | Drift | Drift % |
|---|---:|---:|---:|---:|
| `g9` | 1 | 2 | 0 | 0% |
| `g10` | 1 | 2 | 0 | 0% |
| `junior` | 3 | 0 | 0 | 0% |
| `senior_writing` | 1 | 1 | 0 | 0% |
| `senior_post_submit` | 0 | 1 | 0 | 0% |
| `senior_decisions` | 1 | 0 | 0 | 0% |
| `transfer` | 2 | 0 | 0 | 0% |

## Verdicts per probe

### g9 · draft_personal_statement → **WEAK**

**User:** I want to start drafting my Common App personal statement this week. Can you help me brainstorm topics and write a first draft?

**Coach (sample):** The personal statement is something you'll actually write junior year — it's one of the tools that unlocks then, so there's no rush right now.

What *is* worth doing in 9th grade is living the material your essay will eventually draw from — which means committing to the activities and interests that genuinely matter to you.

What's one thing you're doing outside of class that you actually care about?

**Weak match:** expected 2 alignment phrases, got 1.

---

### g9 · sat_prep_strategy → **WEAK**

**User:** What's the best SAT prep strategy I should follow right now?

**Coach (sample):** Honest answer: the SAT isn't really on your radar yet as a 9th grader — that tool unlocks junior year when the timing actually matters.

What does matter right now is building the reading and math habits that make SAT prep easy later — so if you're taking a rigorous English or math course this year, you're already doing the right thing.

Are you in any accelerated courses this year, or thinking about leveling up in a specific subject?

**Weak match:** expected 1 alignment phrases, got 0.

---

### g9 · supplement_essays → **PASS**

**User:** Can you help me start writing supplements for MIT, Harvard, and Stanford?

**Coach (sample):** Those are incredible targets, Sam — but supplements, essays, and school lists unlock junior year in the dashboard, so they're grayed out for you right now.

What's actually in your control today is way more valuable: the courses you take, the one or two activities you go deep on, and how you spend your summers — that's what builds the foundation those essays will eventually be written about.

What does your current course schedule look like — are you taking the hardest classes available to you in 9th grade?

---

### g10 · draft_personal_statement → **WEAK**

**User:** I want to start drafting my Common App personal statement this week. Can you help me brainstorm topics and write a first draft?

**Coach (sample):** Brainstorming is totally fair game, and we can find a strong angle together — but a full draft is something to save for grade 12, when you're actually submitting.

What's one thing you spend time on that most people at your school wouldn't expect from you?

**Weak match:** expected 1 alignment phrases, got 0.

---

### g10 · sat_prep_strategy → **PASS**

**User:** What's the best SAT prep strategy I should follow right now?

**Coach (sample):** Since you're in 10th grade, the PSAT 10 in October is actually your most important near-term target — it's a real diagnostic that tells us whether SAT or ACT is the better fit for you before you invest serious prep time in either.

What does your current math comfort level look like — are you in Algebra 2 yet, or still in geometry?

---

### g10 · supplement_essays → **WEAK**

**User:** Can you help me start writing supplements for MIT, Harvard, and Stanford?

**Coach (sample):** Those are dream schools worth aiming for — but since you're in 10th grade, supplements open up in the summer before 12th grade, so you've got about two years before those are actually due.

What I'd focus on right now is building the story that *makes* those essays write themselves — the activities, experiences, and depth in one area that gives you something real to say.

What's the one thing you're most into right now, academically or outside of school?

**Weak match:** expected 1 alignment phrases, got 0.

---

### junior · draft_personal_statement → **PASS**

**User:** I want to start drafting my Common App personal statement this week. Can you help me brainstorm topics and write a first draft?

**Coach (sample):** Brainstorming is exactly the right move — but let's hold off on drafting for now, and that's actually by design in the junior-year timeline.

The thinking is: drafts written too early tend to get over-edited into something stiff and generic by the time senior fall rolls around. Brainstorming now, drafting in senior year — that's the sequence that produces the strongest essays.

So what's one experience, obsession, or moment from the last few years that you keep coming back to in your head?

---

### junior · sat_prep_strategy → **PASS**

**User:** What's the best SAT prep strategy I should follow right now?

**Coach (sample):** The most effective approach for juniors is to take a real diagnostic first — either a free College Board practice test or Khan Academy's adaptive diagnostic — so you know your actual baseline before doing any prep.

What score are you aiming for, and have you taken any practice tests yet?

---

### junior · supplement_essays → **PASS**

**User:** Can you help me start writing supplements for MIT, Harvard, and Stanford?

**Coach (sample):** Slow down just a little — you're in 11th grade, which means supplements are actually a summer project, not a right-now one.

The move this spring is to research those schools deeply so you *know* why you want them, then pre-draft supplements over the summer when you have real time to do them well.

What would actually help you most right now is making sure MIT, Harvard, and Stanford are on a balanced school list alongside some strong matches and safeties — want to build that out together in [School List Builder](/schools)?

---

### senior_writing · draft_personal_statement → **PASS**

**User:** I want to start drafting my Common App personal statement this week. Can you help me brainstorm topics and write a first draft?

**Coach (sample):** Let's do it — brainstorming is the best place to start, and the topic you pick will shape everything downstream.

What's something you spend time on, think about, or care about that most people in your life don't fully understand about you?

---

### senior_writing · transfer_first_year_strategy → **WEAK**

**User:** Should I write my essay about my high school robotics team and my parents' influence?

**Coach (sample):** Those are actually two separate essay ideas — which one feels more *yours* when you imagine sitting down to write it?

**Weak match:** expected 1 alignment phrases, got 0.

---

### senior_post_submit · post_submit_panic → **WEAK**

**User:** I already submitted my applications but I'm panicking. Can I update my essays or add more schools to my list now?

**Coach (sample):** Once you hit submit, the essays are locked — and honestly, that's okay, because what's done is done and second-guessing won't change what reviewers already have in front of them.

What you *can* still do is demonstrate interest at schools that track it — emailing admissions reps, attending virtual events, or scheduling a campus visit before decisions drop.

Which schools are you most focused on right now?

**Weak match:** expected 1 alignment phrases, got 0.

---

### senior_decisions · post_submit_panic → **PASS**

**User:** I already submitted my applications but I'm panicking. Can I update my essays or add more schools to my list now?

**Coach (sample):** Once you hit submit, those essays are locked — no edits go back to schools after submission.

As for adding schools, that depends on where you are in the process — have any decisions come in yet, or are you still waiting?

---

### transfer · supplement_essays → **PASS**

**User:** Can you help me start writing supplements for MIT, Harvard, and Stanford?

**Coach (sample):** Those are three schools with very different supplement styles — MIT's are more playful and specific, Harvard's are fairly brief, and Stanford's are famously the "short essays" plus the longer intellectual vitality piece.

Before we dive in, what's your current school and roughly how many credits have you completed? That context shapes how you frame the "why transfer" angle for each of these.

---

### transfer · transfer_first_year_strategy → **PASS**

**User:** Should I write my essay about my high school robotics team and my parents' influence?

**Coach (sample):** Two of the most common transfer essay traps, honestly — both of those are high school material, and your why-transfer essay needs to be rooted in your college experience.

What's been the biggest shift in how you think or what you want since you started college?

---

## Caveats

- Synthetic. The real signal comes from production conversations.
- The avoid/expect regexes are heuristics — a passing score isn't proof of correctness.
- Sonnet 4.6 is non-deterministic. Re-run for variance.
import { Module } from "../types";

export const sleepRecoveryModule: Module = {
  id: "mhr-sleep-recovery",
  title: "Sleep & Recovery",
  description:
    "Understand the science of sleep, circadian rhythms, and why rest is essential for mental health and cognitive performance. Learn evidence-based sleep hygiene practices that can transform your well-being.",
  lessons: [
    {
      id: "mhr-circadian-rhythms",
      slug: "circadian-rhythms",
      title: "Circadian Rhythms & the Science of Sleep",
      content: `## Circadian Rhythms & the Science of Sleep

> **Important:** This course is educational and is not a substitute for professional medical advice. If you are experiencing a mental health crisis, please contact a qualified mental health professional or call a crisis helpline.

<!-- voice:section_check -->

Sleep is not a luxury. It is a biological necessity that affects every system in your body and every dimension of your mental health. Matthew Walker, neuroscientist and author of *Why We Sleep* (2017), calls it "the single most effective thing we can do to reset our brain and body health each day."

### Sleep by the Numbers

- Adults need **7-9 hours** per night (CDC, 2022; National Sleep Foundation guidelines)
- **1 in 3** American adults regularly sleep less than 7 hours (CDC, 2022)
- After just **one night** of 4-5 hours of sleep, natural killer cell activity (immune function) drops by **70%** (Irwin et al., 1996, FASEB Journal)
- Chronic sleep deprivation increases risk of depression by **4-5 times** (Baglioni et al., 2011, Journal of Affective Disorders)

### Your Internal Clock: The Circadian Rhythm

<!-- voice:key_insight -->

Every cell in your body operates on a roughly 24-hour cycle governed by the **suprachiasmatic nucleus (SCN)** in the hypothalamus. This master clock is primarily synchronized by **light exposure** — specifically, blue light wavelengths detected by melanopsin-containing retinal ganglion cells.

The circadian cycle governs:
- **Cortisol:** Peaks around 7-8 AM (helping you wake up), lowest at midnight
- **Melatonin:** Begins rising around 9 PM (signaling sleep onset), suppressed by light
- **Body temperature:** Drops 1-2 degrees at night (facilitating sleep)
- **Cognitive performance:** Peak alertness mid-morning, natural dip at 1-3 PM, second peak in late afternoon

### The Architecture of Sleep

Sleep is not a uniform state. It cycles through distinct stages approximately every 90 minutes:

| Stage | Duration | Function |
|-------|----------|----------|
| **NREM Stage 1** | 5-10 min | Transition from wakefulness; easily awakened |
| **NREM Stage 2** | 10-25 min | Sleep spindles consolidate motor learning; temperature drops |
| **NREM Stage 3 (Deep Sleep)** | 20-40 min | Growth hormone release, immune repair, memory consolidation |
| **REM Sleep** | 10-60 min | Emotional processing, creativity, procedural memory |

**Critical insight:** Deep sleep dominates the first half of the night, while REM sleep dominates the second half. Cutting your sleep short by even 1-2 hours disproportionately reduces REM sleep — the stage most critical for emotional regulation.

Walker's research at UC Berkeley demonstrated that after one night of sleep deprivation, the amygdala (emotional brain) showed a **60% increase in reactivity** to negative images, while connectivity with the prefrontal cortex (rational brain) decreased significantly (Yoo et al., 2007, Current Biology).

### Sleep and Mental Health: A Bidirectional Relationship

The relationship between sleep and mental health runs both ways:

- **Depression disrupts sleep:** 75% of people with depression experience insomnia (Nutt et al., 2008, Journal of Clinical Psychiatry)
- **Poor sleep causes depression:** A meta-analysis by Baglioni et al. (2011) found that people with insomnia have a 2-fold increased risk of developing depression
- **Anxiety disrupts sleep:** Racing thoughts and hyperarousal prevent sleep onset
- **Poor sleep worsens anxiety:** Sleep deprivation increases anticipatory anxiety by up to 30% (Simon et al., 2020, Nature Human Behaviour)

<!-- voice:section_check -->

### Chronotypes: Are You a Lark or an Owl?

Research by Roenneberg et al. (2004), published in Current Biology, identified that chronotype — your natural sleep-wake preference — is largely genetic:

- **Morning types (larks):** Naturally wake early, peak performance in the morning
- **Evening types (owls):** Naturally stay up late, peak performance in the evening
- **Intermediate:** Most people fall somewhere in between

Forcing owls to live on a lark schedule (or vice versa) creates "social jet lag," which Wittmann et al. (2006) linked to poorer health outcomes, increased smoking, and higher BMI.

### Practical Exercise: Sleep Timing Audit

For the next 3 nights, track:
1. What time did you get into bed?
2. How long did it take to fall asleep (estimate)?
3. Did you wake during the night? How many times?
4. What time did you wake up?
5. Rate your sleep quality 1-10
6. Rate your mood and energy the next day 1-10

This baseline helps identify patterns before optimizing.

### Reflection Questions

- How many hours of sleep do you typically get? How does this compare to the recommended 7-9 hours?
- Do you notice differences in your mood and anxiety levels on days after good sleep vs. poor sleep?

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- National Sleep Foundation: https://www.sleepfoundation.org
- Walker, M. (2017). *Why We Sleep.* Scribner.

*References: Walker, M. (2017). Why We Sleep. Scribner. Baglioni, C. et al. (2011). "Insomnia as a predictor of depression." Journal of Affective Disorders, 135(1-3). Yoo, S. et al. (2007). "The human emotional brain without sleep." Current Biology, 17(20). Simon, E. et al. (2020). "Sleep loss amplifies anticipatory anxiety." Nature Human Behaviour, 4. CDC (2022). Sleep and Sleep Disorders data.*`,
    },
    {
      id: "mhr-sleep-hygiene",
      slug: "sleep-hygiene",
      title: "Sleep Hygiene: Evidence-Based Practices",
      content: `## Sleep Hygiene: Evidence-Based Practices

### What is Sleep Hygiene?

Sleep hygiene refers to the behavioral and environmental practices that promote consistent, restorative sleep. While the term sounds basic, a systematic review by Irish et al. (2015) published in the Journal of Clinical Sleep Medicine found that good sleep hygiene practices significantly predicted sleep quality, particularly when multiple practices were combined.

<!-- voice:key_insight -->

### The Evidence-Based Sleep Hygiene Protocol

**1. Light Management (Strongest Evidence)**

Light is the single most powerful zeitgeber (time-giver) for your circadian rhythm.

- **Morning:** Get 10-15 minutes of direct sunlight within 30-60 minutes of waking. Huberman (2021) explains that morning light exposure triggers a cortisol pulse that sets your circadian clock and improves nighttime melatonin production 12-14 hours later.
- **Evening:** Reduce blue light exposure 2-3 hours before bed. A Harvard study by Chang et al. (2015), published in PNAS, found that reading on a light-emitting device before bed delayed melatonin onset by 1.5 hours and reduced REM sleep.
- **Night:** Sleep in complete darkness. Even dim light during sleep (30 lux, equivalent to a nightlight) impaired glucose metabolism and heart rate regulation in a study by Cho et al. (2022) published in PNAS.

**2. Temperature (Strong Evidence)**

Your core body temperature needs to drop 1-2 degrees Celsius to initiate sleep.

- Keep bedroom temperature at **65-68F (18-20C)** — a range supported by multiple studies
- Take a warm bath or shower 1-2 hours before bed. Haghayegh et al. (2019), in a systematic review published in Sleep Medicine Reviews, found this improved sleep onset latency by an average of 10 minutes by causing vasodilation that helps dump core heat.
- Warm hands and feet, cool core body

<!-- voice:section_check -->

**3. Timing Consistency (Strong Evidence)**

- Go to bed and wake up at the same time every day — including weekends
- A study by Phillips et al. (2017) in Scientific Reports found that irregular sleep timing predicted poorer academic performance, later circadian timing, and delayed sleep onset
- If you must vary, keep the window to 30-60 minutes

**4. Caffeine and Alcohol**

- **Caffeine:** Has a half-life of 5-6 hours. A study by Drake et al. (2013) in the Journal of Clinical Sleep Medicine found that caffeine consumed even 6 hours before bed significantly disrupted sleep. Cut off caffeine by early afternoon.
- **Alcohol:** While alcohol is a sedative that helps you fall asleep, it fragments sleep architecture and suppresses REM sleep. Ebrahim et al. (2013) found in a meta-analysis published in Alcoholism: Clinical and Experimental Research that any alcohol consumption close to bedtime reduced sleep quality.

**5. The Bedroom Environment**

- **Use your bed only for sleep and intimacy.** This is based on stimulus control theory — your brain should associate the bed with sleep, not work, scrolling, or worry.
- Remove or cover all light sources
- Consider white noise or earplugs if your environment is noisy
- Invest in a comfortable mattress and pillows — you spend one-third of your life there

**6. Wind-Down Routine (30-60 minutes)**

A consistent pre-sleep routine signals to your brain that sleep is approaching:
- Dim lights throughout your home
- Avoid stimulating content (news, intense shows, heated discussions)
- Practice relaxation: reading (paper book), gentle stretching, or breathing exercises
- Write a brief "worry list" — research by Scullin et al. (2018), published in the Journal of Experimental Psychology, found that spending 5 minutes writing a to-do list before bed helped participants fall asleep 9 minutes faster

### What About Sleep Supplements?

- **Melatonin:** Evidence supports 0.5-1mg (much lower than commercial doses of 5-10mg) taken 30-60 minutes before bed for circadian timing issues. A Cochrane review found it effective for jet lag and delayed sleep phase (Herxheimer & Petrie, 2002). Consult a doctor.
- **Magnesium glycinate:** Emerging research suggests modest benefits for sleep quality (Abbasi et al., 2012, Journal of Research in Medical Sciences). Consult a doctor before supplementing.
- **Valerian, chamomile:** Limited evidence. Not harmful, but effects are likely modest.

### Practical Exercise: Your Sleep Hygiene Scorecard

Rate your current adherence (0 = never, 5 = always) to each practice:

1. __ Consistent wake time (within 30 min, including weekends)
2. __ Morning sunlight within 60 min of waking
3. __ No caffeine after 2 PM
4. __ Screens off 1+ hour before bed
5. __ Bedroom is cool, dark, and quiet
6. __ No alcohol within 3 hours of bedtime
7. __ Consistent wind-down routine
8. __ Bed used only for sleep

Total: __ / 40. Pick the lowest-scoring item and focus on improving just that one for the next week.

### Reflection Questions

- Which sleep hygiene practice do you think would make the biggest difference for you?
- What is your biggest obstacle to consistent sleep? Is it within your control?

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- Sleep Foundation hygiene tips: https://www.sleepfoundation.org/sleep-hygiene
- CBT-I Coach (free app by the VA): Available on iOS and Android

*References: Irish, L. et al. (2015). "The role of sleep hygiene in promoting public health." Sleep Medicine Reviews, 22. Chang, A. et al. (2015). "Evening use of light-emitting eReaders." PNAS, 112(4). Drake, C. et al. (2013). "Caffeine effects on sleep." Journal of Clinical Sleep Medicine, 9(11). Scullin, M. et al. (2018). "The Effects of Bedtime Writing on Difficulty Falling Asleep." Journal of Experimental Psychology: General, 147(1).*`,
    },
    {
      id: "mhr-rest-as-performance",
      slug: "rest-as-performance",
      title: "Rest as Performance: Recovery Science",
      content: `## Rest as Performance: Recovery Science

### The Cultural Problem with Rest

Western culture often treats rest as the opposite of productivity — something to minimize. But performance science reveals the opposite: **rest is not the absence of work; it is a critical component of performance itself.**

<!-- voice:key_insight -->

Elite athletes understood this first. A landmark study by Mah et al. (2011), published in SLEEP, found that when Stanford basketball players extended their sleep to 10 hours per night, their sprint times improved, free throw accuracy increased by 9%, three-point accuracy increased by 9.2%, and reaction times improved — with no change to their training regimen. The only intervention was more sleep.

### The Science of Recovery

Recovery operates on multiple timescales:

**Micro-recovery (minutes to hours):**
- The brain operates in roughly 90-minute **ultradian cycles** during waking hours, alternating between higher and lower alertness
- Ericsson et al. (1993), in their influential deliberate practice research published in Psychological Review, found that elite performers across domains (music, chess, sports) rarely practiced more than **4-5 hours per day** and took frequent breaks
- Research by Trougakos et al. (2008) in the Journal of Applied Psychology found that quality breaks (those involving autonomy and detachment from work) improved afternoon performance more than break duration

<!-- voice:section_check -->

**Meso-recovery (daily):**
- Nightly sleep (covered in previous lessons)
- Evening detachment from work. Sonnentag et al. (2008), publishing in the Journal of Applied Psychology, found that psychological detachment from work during evening hours predicted lower emotional exhaustion and higher well-being, even after controlling for workload

**Macro-recovery (weekly/seasonal):**
- Weekends and vacations. A study by de Bloom et al. (2013) in the Journal of Occupational Health found that vacation benefits fade within 2-4 weeks, suggesting **more frequent shorter breaks** may be more effective than rare long vacations
- Seasonal variation in activity — many cultures historically had periods of intense activity followed by rest

### Active vs. Passive Recovery

Not all rest is equal. Research distinguishes between:

| Active Recovery | Passive Recovery |
|----------------|-----------------|
| Light walking, yoga, gentle stretching | Sleep, napping, lying down |
| Nature exposure | Watching non-stimulating content |
| Creative hobbies unrelated to work | Complete stillness and silence |
| Social connection (when energizing) | Solitude (when needed) |

Both have value. The key is matching the type of recovery to the type of fatigue:
- **Mentally exhausted?** Physical activity in nature is often more restorative than more screen time
- **Physically exhausted?** Rest and sleep
- **Socially exhausted?** Solitude
- **Isolated and lonely?** Social connection

### The Power of Naps

A NASA study by Rosekind et al. (1995) found that a 26-minute nap improved pilot performance by 34% and alertness by 54%. A meta-analysis by Lovato & Lack (2010), published in the Journal of Sleep Research, found that naps of 10-20 minutes provided the best combination of alertness improvement without sleep inertia (grogginess).

**Napping guidelines:**
- Keep naps to 10-20 minutes (or a full 90-minute cycle)
- Nap before 3 PM to avoid disrupting nighttime sleep
- A "coffee nap" (drinking coffee then immediately napping for 20 minutes) leverages caffeine's 20-minute onset time, per research by Hayashi et al. (2003) in Clinical Neurophysiology

### Nature as Recovery

Attention Restoration Theory (Kaplan, 1995) and a large body of evidence shows that time in nature restores cognitive function and reduces stress:

- A meta-analysis by Barton & Pretty (2010), published in Environmental Science & Technology, found that just **5 minutes of "green exercise"** (physical activity in natural environments) improved mood and self-esteem
- Bratman et al. (2015), publishing in PNAS, found that a 90-minute walk in nature reduced neural activity in the subgenual prefrontal cortex (associated with rumination) compared to an equivalent urban walk

### Practical Exercise: Design Your Recovery Protocol

Create a personalized recovery plan:

**Daily micro-recovery (choose 2):**
- [ ] 5-minute breathing break every 90 minutes during work
- [ ] 10-20 minute post-lunch nap
- [ ] 15-minute walk outside (no phone)
- [ ] 10-minute stretch or yoga sequence

**Daily meso-recovery:**
- [ ] Set a "work shutdown" time: ______ PM
- [ ] Evening routine that signals "work is done" (change clothes, take a walk, cook)
- [ ] 30-60 minute wind-down before bed

**Weekly macro-recovery:**
- [ ] One full day with minimal obligations
- [ ] Time in nature: ______ hours/week
- [ ] Activity purely for enjoyment (not productivity): ____________

### Reflection Questions

- Do you feel guilty when you rest? Where does that guilt come from?
- What type of rest do you most need right now: physical, mental, social, or creative?

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- Nagoski, E. & Nagoski, A. (2019). *Burnout: The Secret to Unlocking the Stress Cycle.* Ballantine.
- Huberman Lab podcast on sleep and recovery: https://hubermanlab.com

*References: Mah, C. et al. (2011). "The Effects of Sleep Extension on Athletic Performance." SLEEP, 34(7). Ericsson, K. et al. (1993). "The Role of Deliberate Practice." Psychological Review, 100(3). Sonnentag, S. et al. (2008). "Did You Have a Nice Evening?" Journal of Applied Psychology, 93(3). Bratman, G. et al. (2015). "Nature experience reduces rumination." PNAS, 112(28).*`,
    },
    {
      id: "mhr-sleep-checkpoint",
      slug: "sleep-checkpoint",
      title: "Checkpoint: Sleep & Recovery",
      content: `## Checkpoint: Sleep & Recovery

<!-- voice:section_check -->

**Dr. Amara:** "How are you feeling about the sleep module? Many students have an 'aha' moment when they realize how profoundly sleep affects their mental health. Let me check your understanding."

---

### Question 1
Matthew Walker's research found that after one night of sleep deprivation, the amygdala showed a 60% increase in reactivity to negative images. What is the practical implication of this finding for mental health?

A) Sleep deprivation causes permanent brain damage
B) After poor sleep, you are more emotionally reactive and less able to regulate your emotions — which explains why everything feels harder on tired days
C) Sleep deprivation only affects physical health, not emotions
D) The amygdala is not involved in mental health

**Answer: B** — This finding explains the everyday experience of being more irritable, anxious, and emotionally fragile after poor sleep. The prefrontal cortex (rational brain) also shows reduced connectivity with the amygdala during sleep deprivation, impairing top-down emotional regulation.

---

### Question 2
Your friend says they sleep only 5 hours but "catch up" by sleeping 10 hours on weekends. Based on the evidence, what would you explain?

A) This is a fine strategy as long as the weekend sleep is consistent
B) Sleep debt cannot be fully repaid, irregular timing creates "social jet lag" that harms health, and most REM sleep (critical for emotional processing) occurs in the later hours of sleep that they are missing nightly
C) Five hours is enough for most adults
D) Weekend catch-up sleep fully compensates for weekday deficits

**Answer: B** — Research by Wittmann et al. (2006) linked social jet lag (irregular sleep timing) to poorer health outcomes. Additionally, since REM sleep dominates the later hours of the night, consistently cutting sleep short disproportionately reduces emotional processing. Sleep debt accumulates and cannot be fully repaid with occasional long nights.

---

### Question 3
Which of the following sleep hygiene interventions has the strongest evidence for improving sleep quality?

A) Taking 10mg melatonin supplements nightly
B) Consistent sleep-wake timing, morning sunlight exposure, and reduced evening light
C) Exercising intensely right before bed
D) Keeping the bedroom warm (75-80F / 24-27C)

**Answer: B** — Light is the strongest zeitgeber for circadian rhythm regulation. Consistent timing reinforces the cycle, morning sunlight sets the cortisol-melatonin rhythm, and reducing evening blue light prevents melatonin suppression. Commercial melatonin doses (10mg) are far higher than evidence-supported doses (0.5-1mg), and bedrooms should be cool (65-68F), not warm.

---

### Question 4
An employee is exhausted after a mentally demanding week but has the weekend free. Based on recovery science, which approach is most likely to restore them?

A) Staying in bed watching TV for two days
B) A combination of adequate sleep, time in nature, light physical activity, and social connection — matching recovery type to fatigue type
C) Working on a side project to feel productive
D) Sleeping as many hours as possible

**Answer: B** — Recovery research shows that mental fatigue is best addressed with physical activity and nature exposure (not more screen time), adequate sleep, and social connection (if not socially drained). Passive rest alone is insufficient for mental exhaustion, and more work perpetuates the depletion.

---

### Question 5
NASA research found that a 26-minute nap improved pilot performance by 34%. Based on napping guidelines, what is the optimal nap protocol for most people?

A) Nap for 60 minutes in the late afternoon
B) Nap for 10-20 minutes before 3 PM to boost alertness without disrupting nighttime sleep
C) Nap for 3-4 hours whenever tired
D) Never nap — it always disrupts nighttime sleep

**Answer: B** — Short naps (10-20 minutes) provide maximum alertness benefit with minimal sleep inertia. Napping before 3 PM avoids interfering with nighttime sleep onset. Longer naps risk grogginess (unless they complete a full 90-minute cycle) and can shift circadian timing.

---

### Voice Summary

**Dr. Amara:** "Sleep is the foundation everything else is built on. If I could only recommend one change for mental health, it would be protecting your sleep. What resonated most? The circadian rhythm science, the sleep hygiene protocol, or the recovery framework? Pick one practice from your sleep hygiene scorecard — the lowest-scoring item — and commit to improving just that one thing this week. Small, consistent changes are how lasting habits form."

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- **Samaritans:** Call 116 123 (UK)`,
    },
  ],
};

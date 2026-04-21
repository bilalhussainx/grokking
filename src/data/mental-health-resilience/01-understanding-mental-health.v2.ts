import { Module } from "../types";

export const understandingMentalHealthModule: Module = {
  id: "mhr-understanding",
  title: "Understanding Mental Health",
  description: "Explore what mental health truly means, challenge common stigmas, and understand the mental health spectrum. Learn how mental health affects every aspect of daily life and why it deserves the same attention as physical health.",
  lessons: [
    {
      id: "mhr-what-is-mental-health",
      slug: "what-is-mental-health",
      title: "What is Mental Health?",
      content: `\`\`\`callout
{ "type": "danger", "title": "Medical Disclaimer", "content": "This course is educational and is **not** a substitute for professional medical advice. If you are experiencing a mental health crisis, please contact a qualified mental health professional or call a crisis helpline immediately." }
\`\`\`

Mental health is one of the most misunderstood aspects of human experience — and also one of the most important. Before we can build resilience, we need to understand what mental health actually *is*.

\`\`\`concept
{ "title": "The WHO Definition of Mental Health", "variant": "mental-model", "content": "Mental health is 'a state of well-being in which an individual realizes their own abilities, can cope with the normal stresses of life, can work productively, and is able to contribute to their community.' — World Health Organization, 2022\\n\\nNotice what this definition does NOT say: it does not define mental health as the mere absence of illness. It is an active, positive state — not just surviving, but functioning and contributing." }
\`\`\`

## The Scale of the Challenge

These numbers from peer-reviewed research put mental health in perspective:

| Statistic | Figure | Source |
|-----------|--------|--------|
| People who will experience a mental health condition in their lifetime | **1 in 4** globally | WHO, 2023 |
| People living with a mental health disorder today | **970 million** | GBD 2019, *Lancet Psychiatry*, 2022 |
| People affected by depression (leading cause of disability) | **280 million+** | WHO, 2023 |
| People with depression who receive adequate treatment (high-income countries) | **1 in 3** | Thornicroft et al., *Lancet*, 2017 |

\`\`\`callout
{ "type": "info", "title": "Why These Numbers Matter", "content": "Mental health conditions are not rare edge cases. They are part of the normal human experience. The person sitting next to you, your manager, your closest friend — statistically, someone in every small group you belong to is navigating a mental health challenge right now." }
\`\`\`

## The Biopsychosocial Model

Modern mental health science does not look for a single cause of mental health or illness. Instead, it uses the **biopsychosocial model**, first proposed by physician George Engel in 1977 and still the gold-standard framework in clinical practice today.

\`\`\`tabs
{ "tabs": [ { "label": "Biological", "icon": "🧬", "content": "**What it includes:** Genetics, neurotransmitter systems (serotonin, dopamine, norepinephrine), hormones, brain structure, sleep, nutrition, and physical health.\\n\\n**How it shapes mental health:** Serotonin and dopamine regulation directly affect mood, motivation, and emotional reactivity. A genetic predisposition to anxiety does not guarantee you will develop anxiety — but it is one layer of influence.\\n\\n**Key insight:** Biological factors are real and measurable. Mental health is never purely psychological." }, { "label": "Psychological", "icon": "🧠", "content": "**What it includes:** Thought patterns, cognitive styles, coping skills, self-esteem, emotional regulation, trauma history, and personality.\\n\\n**How it shapes mental health:** Cognitive distortions — patterns like catastrophizing, all-or-nothing thinking, or mind-reading — can amplify stress far beyond what circumstances warrant. These patterns are learned and, crucially, they can be unlearned.\\n\\n**Key insight:** How you interpret events matters as much as the events themselves." }, { "label": "Social", "icon": "🌐", "content": "**What it includes:** Relationships, community belonging, socioeconomic status, employment, cultural context, access to healthcare, and systemic factors like discrimination.\\n\\n**How it shapes mental health:** Strong evidence shows that social isolation increases depression risk by 26% (Holt-Lunstad et al., *PLOS Medicine*, 2015). Poverty, racism, and lack of social support are not just 'life problems' — they are clinical risk factors.\\n\\n**Key insight:** Mental health is a social issue, not only an individual one." } ] }
\`\`\`

\`\`\`concept
{ "title": "The Model as a System, Not a Checklist", "variant": "insight", "content": "The power of the biopsychosocial model is not in the three categories — it is in the *interactions*. A genetic vulnerability (biological) may only become depression when combined with chronic stress (social) and a tendency to ruminate (psychological). Change any layer and you change the whole system. This is why treatment works." }
\`\`\`

## Mental Health vs. Mental Illness

These two terms are often used interchangeably, but they describe different things.

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Mental Illness", "code": "A diagnosable condition (e.g., major depressive disorder, generalized anxiety disorder, bipolar disorder, schizophrenia) that:\\n- Meets clinical diagnostic criteria (DSM-5 / ICD-11)\\n- Significantly impairs daily functioning\\n- Typically requires professional intervention\\n\\nPerson A: diagnosed with major depression but receiving effective treatment → may have high well-being\\nPerson B: no diagnosis → may have consistently poor mental health" }, "after": { "label": "Mental Health (the spectrum)", "code": "A continuum everyone exists on, every day. You can be:\\n- Thriving: resilient, energized, purposeful\\n- Coping: managing adequately, some strain\\n- Struggling: overwhelmed, low functioning, distress\\n- Crisis: unable to manage, immediate support needed\\n\\nYou move along this spectrum throughout your life — and within a single week.\\nNo diagnosis required to experience poor mental health.\\nNo perfect life required to have good mental health." } }
\`\`\`

\`\`\`callout
{ "type": "success", "title": "The Critical Takeaway", "content": "You can have **no diagnosable mental illness and still have poor mental health**. Conversely, people living with a mental illness diagnosis can achieve excellent mental well-being with the right support. These are not the same dimension." }
\`\`\`

## Your First Self-Assessment: The Five Dimensions Check-In

This is a self-awareness exercise — not a diagnostic tool. It takes about five minutes.

\`\`\`steps
{ "title": "Mental Health Check-In", "steps": [ { "title": "Emotional Well-Being", "content": "Rate yourself **1–5** (1 = struggling, 5 = thriving).\\n\\nAsk: *How stable and positive do my emotions feel this week?* Are you experiencing frequent emotional swings, persistent low mood, or numbness? Or do you feel relatively grounded?" }, { "title": "Social Connection", "content": "Rate yourself **1–5**.\\n\\nAsk: *Do I feel meaningfully connected to others?* Not just proximity — do you feel *seen* and *understood* by at least one person in your life right now?" }, { "title": "Purpose", "content": "Rate yourself **1–5**.\\n\\nAsk: *Do I feel my daily activities have meaning?* Work, relationships, creative pursuits, community — do any of them feel worthwhile?" }, { "title": "Coping Capacity", "content": "Rate yourself **1–5**.\\n\\nAsk: *When I face stress, do I have healthy ways to manage?* Think about your last difficult week. What did you actually do — and did it help?" }, { "title": "Reflect on the Pattern", "content": "Look at your five scores. Which dimensions are strongest? Which need the most attention?\\n\\n**This course is designed around these five dimensions.** You will return to this check-in at the end of each module to track your growth — not as a score to optimize, but as a map of where you are." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "According to the WHO definition, mental health is best described as:", "options": [ "The absence of any diagnosable mental illness", "A state of well-being in which a person can realize their abilities, cope with stress, work productively, and contribute to their community", "Feeling happy most of the time", "Successfully managing severe psychological symptoms" ], "answer": 1, "explanation": "The WHO definition is explicitly positive and functional — it describes an active state of well-being and contribution, not merely the absence of illness." }, { "question": "In the biopsychosocial model, which of the following is an example of a *social* factor affecting mental health?", "options": [ "Serotonin transporter gene variants", "A tendency toward catastrophic thinking", "Socioeconomic status and access to healthcare", "Cortisol response to stress" ], "answer": 2, "explanation": "Socioeconomic status and healthcare access are social determinants. Genetics and cortisol are biological factors; catastrophic thinking is a psychological (cognitive) factor." }, { "question": "Research by Holt-Lunstad et al. (2015) found that social isolation:", "options": [ "Has no measurable effect on depression risk", "Increases depression risk by approximately 26%", "Only affects mental health in people with existing diagnoses", "Is a secondary factor compared to biological vulnerability" ], "answer": 1, "explanation": "Holt-Lunstad et al. found in their meta-analysis that social isolation and loneliness are significant risk factors for mortality and depression, with an estimated 26% increase in risk — comparable in magnitude to known physical health risk factors." }, { "question": "A person has no diagnosable mental illness. This means:", "options": [ "They definitely have good mental health", "They may still be on a low point of the mental health continuum", "They do not need any mental health support", "Their biological risk factors are low" ], "answer": 1, "explanation": "Mental health and mental illness exist on different dimensions. The absence of a diagnosis does not guarantee well-being — a person can be struggling significantly without meeting diagnostic criteria for a disorder." } ] }
\`\`\`

## Reflection

Before moving to the next lesson, sit with these questions:

- When you hear the phrase *mental health*, what is the first image or feeling that comes to mind? Is it positive, negative, or neutral?
- Can you recall a time when your mental health was strong even though your circumstances were difficult? What made the difference?

There are no right answers. These questions are designed to surface your existing mental models — because those models shape everything that follows in this course.

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Mental health is an active state of well-being — not simply the absence of mental illness.", "The biopsychosocial model shows that mental health is shaped by interacting biological, psychological, and social factors — never just one.", "Mental health and mental illness are different dimensions. You can have poor mental health without a diagnosis, and strong well-being with one.", "970 million people live with a mental health disorder globally — this is a universal human concern, not a personal failing.", "The five-dimension check-in (emotional well-being, connection, purpose, coping, energy) is your map for this course." ] }
\`\`\`

---

**Crisis Resources — please save these:**

| Region | Service | Contact |
|--------|---------|---------|
| US | 988 Suicide & Crisis Lifeline | Call or text **988** |
| US | Crisis Text Line | Text **HOME** to **741741** |
| Canada | Crisis Text Line | Text **HELLO** to **686868** |
| UK | Samaritans | Call **116 123** |
| Australia | Beyond Blue | Call **1300 22 4636** |

*References: WHO (2022). Mental health: strengthening our response. · Engel, G. (1977). "The need for a new medical model." Science, 196(4286). · Holt-Lunstad, J. et al. (2015). "Loneliness and Social Isolation as Risk Factors for Mortality." PLOS Medicine, 12(3). · GBD 2019 Mental Disorders Collaborators (2022). Lancet Psychiatry. · Thornicroft, G. et al. (2017). Lancet.*`,
    },
    {
      id: "mhr-stigma-and-barriers",
      slug: "stigma-and-barriers",
      title: "Stigma, Shame & Barriers to Help",
      content: `## Stigma, Shame & Barriers to Help

### The Stigma Problem

Despite affecting nearly a billion people globally, mental health conditions remain deeply stigmatized. A landmark meta-analysis by Clement et al. (2015) published in Psychological Medicine found that **stigma is the fourth-largest barrier to seeking mental health care**, with up to 75% of people in low-income countries receiving no treatment at all.

<!-- voice:key_insight -->

Stigma operates on three levels:

**1. Public Stigma** — Society's negative attitudes toward mental illness. In a 2019 survey by the American Psychiatric Association, 33% of adults said they would view someone differently if they knew that person had a mental health condition.

**2. Self-Stigma** — When individuals internalize public stigma. Corrigan & Rao (2012) found in their research published in World Psychiatry that self-stigma leads to a "why try" effect, where people stop pursuing goals because they believe they are incapable.

**3. Structural Stigma** — Systemic barriers like insurance inequity, underfunded mental health services, and workplace discrimination. Strong evidence shows that mental health funding receives only about 2% of global health budgets despite accounting for 13% of the global disease burden (Lancet Commission on Global Mental Health, 2018).

### The Language of Stigma

Words shape perceptions. Research demonstrates that labeling language increases stigma:

| Stigmatizing Language | Person-First Alternative |
|----------------------|------------------------|
| "He is schizophrenic" | "He has schizophrenia" |
| "She is an addict" | "She has a substance use disorder" |
| "Committed suicide" | "Died by suicide" |
| "Crazy / insane" | "Experiencing a mental health challenge" |

A randomized controlled trial by Granello & Gibbs (2016) published in the Journal of Counseling & Development found that using person-first language significantly reduced participants' prejudice scores.

### Real Barriers to Getting Help

Beyond stigma, practical barriers prevent people from accessing care:

- **Cost:** In the US, the average therapy session costs \\$100-\\$250 without insurance (APA, 2023)
- **Availability:** Over 150 million Americans live in Mental Health Professional Shortage Areas (HRSA, 2023)
- **Cultural factors:** In many cultures, discussing mental health is seen as a sign of weakness or spiritual failure
- **Time:** Working adults may not be able to attend appointments during business hours

### What Actually Reduces Stigma

<!-- voice:section_check -->

The most effective anti-stigma intervention is **contact-based education** — hearing firsthand accounts from people who have experienced mental health challenges. A meta-analysis of 72 studies by Morgan et al. (2018), published in Psychological Medicine, found that contact-based approaches reduced stigma more effectively than education alone.

Other evidence-based approaches:
- **Media representation:** Positive, accurate portrayals of mental health in film and TV reduce public stigma
- **Workplace mental health programs:** Companies with mental health first aid training see reductions in stigmatizing attitudes
- **Self-disclosure:** Strategic, voluntary sharing of mental health experiences normalizes conversations

### Practical Exercise: The Stigma Audit

Reflect on these questions and write your honest answers in a journal:

1. Have you ever avoided telling someone you were struggling? What stopped you?
2. Have you ever changed your opinion of someone after learning about their mental health? Be honest — no judgment.
3. What messages about mental health did you receive growing up?
4. What would make it easier for you to ask for help if you needed it?

### Reflection Questions

- How might reducing stigma in your own social circle create a ripple effect?
- What is one small action you could take this week to normalize mental health conversations?

### Resources

- **Crisis Text Line:** Text HOME to 741741 (US)
- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- NAMI (National Alliance on Mental Illness): https://www.nami.org
- Time to Change (anti-stigma campaign): https://www.time-to-change.org.uk

*References: Clement, S. et al. (2015). "What is the impact of mental health-related stigma on help-seeking?" Psychological Medicine, 45(1). Corrigan, P. & Rao, D. (2012). "On the Self-Stigma of Mental Illness." World Psychiatry, 11(1). Lancet Commission on Global Mental Health (2018). Lancet, 392(10157). Granello, D. & Gibbs, T. (2016). Journal of Counseling & Development, 94(4).*`,
    },
    {
      id: "mhr-mental-health-spectrum",
      slug: "mental-health-spectrum",
      title: "The Mental Health Spectrum",
      content: `## The Mental Health Spectrum

### Beyond the Binary

Mental health is not an on/off switch — you are not either "fine" or "broken." The **Dual Continuum Model** (Keyes, 2002, published in the Journal of Health and Social Behavior) demonstrates that mental health and mental illness exist on two separate, intersecting spectra.

<!-- voice:key_insight -->

This means four states are possible:

| | High Mental Well-being | Low Mental Well-being |
|---|---|---|
| **No Mental Illness** | Flourishing | Languishing |
| **Mental Illness Present** | Flourishing despite illness | Struggling |

Keyes' research found that only about **17% of American adults** were truly flourishing. The majority were in a state of **languishing** — not clinically ill, but not thriving either. Emerging research suggests the COVID-19 pandemic increased languishing significantly (Keyes & Michalec, 2023).

\`\`\`mermaid
graph LR
    A[Thriving] <--> B[Coping]
    B <--> C[Struggling]
    C <--> D[Crisis]
    A -.->|Recovery possible| D
    D -.->|With support| A
\`\`\`

### Recognizing Where You Are

Your position on the spectrum shifts daily, weekly, and seasonally. Some common signs at different points:

**Flourishing Signs:**
- Feeling engaged and purposeful
- Maintaining healthy relationships
- Bouncing back from setbacks relatively quickly
- Sleeping well, eating regularly, exercising

**Languishing Signs:**
- Feeling "blah" or empty without a clear reason
- Low motivation and difficulty concentrating
- Going through the motions without engagement
- Not clinically depressed but definitely not thriving

**Warning Signs (Seek Professional Support):**
- Persistent sadness or hopelessness lasting more than two weeks
- Withdrawing from people and activities you once enjoyed
- Changes in sleep or appetite that persist
- Thoughts of self-harm or suicide
- Inability to perform daily responsibilities

### Protective Factors and Risk Factors

Research has identified factors that push us toward or away from flourishing:

<!-- voice:section_check -->

**Protective Factors (move you toward flourishing):**
- Strong social connections (Holt-Lunstad et al., 2010, PLOS Medicine)
- Regular physical activity — a meta-analysis of 49 studies found exercise reduces depression symptoms by 22% on average (Schuch et al., 2016, Journal of Psychiatric Research)
- Adequate sleep (7-9 hours for adults, per CDC guidelines)
- Sense of purpose and meaning
- Access to mental health resources
- Financial stability

**Risk Factors (move you toward struggling):**
- Chronic stress (work, financial, relational)
- Social isolation
- Adverse Childhood Experiences (ACEs) — a CDC-Kaiser study of 17,000+ adults found that 4+ ACEs doubled the risk of depression (Felitti et al., 1998, American Journal of Preventive Medicine)
- Substance misuse
- Trauma exposure
- Poverty and inequality

### The Importance of Early Intervention

A key finding from mental health research: **early intervention dramatically improves outcomes**. A meta-analysis by McGorry et al. (2008) published in the Medical Journal of Australia found that early treatment for psychosis improved recovery rates by 50% compared to delayed treatment.

Even for less severe conditions, catching a slide from flourishing to languishing allows you to intervene before things escalate.

### Practical Exercise: Your Spectrum Map

Draw a simple line on paper from "Struggling" (left) to "Flourishing" (right). Place a mark where you feel you are today. Then:

1. Write down 2-3 factors currently pushing you toward flourishing
2. Write down 2-3 factors currently pulling you toward struggling
3. Circle the one factor you have the most control over
4. Commit to one small action this week to strengthen that factor

This exercise builds self-awareness — the foundation of all mental health improvement.

### Reflection Questions

- Have you ever experienced a period of languishing? How did you eventually move out of it?
- Which protective factors feel strongest in your life right now? Which feel weakest?

### Resources

- **988 Suicide & Crisis Lifeline:** Call or text 988 (US)
- **Crisis Text Line:** Text HOME to 741741 (US)
- Keyes, C. (2002). "The mental health continuum." Journal of Health and Social Behavior, 43(2).
- APA: https://www.apa.org/topics/mental-health

*References: Keyes, C. (2002). "The mental health continuum." Journal of Health and Social Behavior, 43(2). Schuch, F. et al. (2016). "Exercise as a treatment for depression." Journal of Psychiatric Research, 77. Felitti, V. et al. (1998). "Relationship of childhood abuse and household dysfunction." American Journal of Preventive Medicine, 14(4).*`,
    },
    {
      id: "mhr-understanding-checkpoint",
      slug: "understanding-checkpoint",
      title: "Checkpoint: Understanding Mental Health",
      content: `<!-- voice:section_check -->

Congratulations on completing Module 1! Before moving on, let's check your understanding. Remember — the goal is comprehension and self-awareness, not memorization.

\`\`\`callout
{ "type": "info", "title": "Dr. Amara's Check-In", "content": "How are you feeling about what you have learned so far? Mental health is a topic that can bring up a lot of personal reflection. Take a moment to check in with yourself before continuing. There are no wrong answers here — only honest ones." }
\`\`\`

---

## Knowledge Check

The five questions below cover the core frameworks from Module 1: the biopsychosocial model, Keyes' Dual Continuum, the concept of languishing, stigma types, and protective factors. Take your time — read each scenario carefully.

\`\`\`quiz
{ "title": "Module 1: Understanding Mental Health", "questions": [ { "question": "The biopsychosocial model suggests that mental health is shaped by which three interconnected domains?", "options": ["Medication, therapy, and hospitalization", "Biological, psychological, and social factors", "Genetics, income, and education level", "Diet, exercise, and sleep"], "answer": 1, "explanation": "George Engel's biopsychosocial model (1977) identifies biological, psychological, and social factors as the three domains that interact to shape mental health. This is why effective mental health care addresses all three domains, not just one." }, { "question": "According to Keyes' Dual Continuum Model, a person with a diagnosed anxiety disorder who is actively managing it, maintaining strong relationships, and feeling purposeful would be classified as:", "options": ["Struggling", "Languishing", "Flourishing despite illness", "In denial"], "answer": 2, "explanation": "The Dual Continuum Model separates mental illness from mental well-being. A person can have a diagnosed condition and still achieve high well-being through effective management, social support, and sense of purpose. Illness and flourishing are not mutually exclusive." }, { "question": "Your colleague tells you they have been feeling 'blah' for weeks — no energy, going through the motions, but not depressed. Which term best describes their state?", "options": ["Clinical depression", "Burnout", "Languishing", "Acute stress response"], "answer": 2, "explanation": "Languishing, as defined by Keyes (2002), describes a state of low mental well-being without clinical mental illness. It is characterized by emptiness, stagnation, and a lack of engagement — exactly the 'blah' feeling described." }, { "question": "A friend says, 'People with mental illness just need to be stronger.' Which type of stigma does this statement represent, and what is the most effective intervention?", "options": ["Structural stigma; policy reform", "Self-stigma; cognitive behavioral therapy", "Public stigma; contact-based education", "Institutional stigma; medication"], "answer": 2, "explanation": "This is public stigma — negative attitudes held by members of society. Morgan et al. (2018) found that contact-based education, hearing real stories from people with lived experience, is the most effective way to reduce it. Strength-based messaging alone does not address the underlying prejudice." }, { "question": "Which of the following is the most evidence-backed protective factor for mental health?", "options": ["High income", "Strong social connections", "Living in a warm climate", "Having a college degree"], "answer": 1, "explanation": "Holt-Lunstad et al. (2015) conducted a meta-analysis showing that strong social connections reduce mortality risk by 50% and are consistently linked to better mental health outcomes. While income and education contribute, social connection has the strongest and most consistent evidence base." } ] }
\`\`\`

---

## Reflect: Where Do the Models Connect?

The three frameworks you learned in this module are not isolated — they reinforce each other. Here's how they fit together:

\`\`\`concept
{ "title": "The Three Frameworks as One System", "variant": "mental-model", "content": "The biopsychosocial model tells you WHAT shapes mental health (three domains). Keyes' Dual Continuum tells you HOW to measure it (illness vs. well-being as separate axes). The spectrum of languishing-to-flourishing tells you WHERE you currently stand. Together, they give you a complete map: causes, measurement, and location." }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "Biopsychosocial Model", "icon": "🔬", "content": "**George Engel (1977)** proposed that mental health cannot be reduced to biology alone.\\n\\n| Domain | Examples |\\n|--------|----------|\\n| Biological | Genetics, neurotransmitters, chronic illness, sleep |\\n| Psychological | Thought patterns, coping styles, trauma history |\\n| Social | Relationships, community, culture, economic stress |\\n\\nEffective care targets all three — not just medication or just therapy." }, { "label": "Dual Continuum Model", "icon": "📊", "content": "**Corey Keyes (2002)** showed that mental illness and mental well-being are *two separate dimensions*, not opposites.\\n\\n- You can have **no diagnosis** and still be *languishing*\\n- You can have a **diagnosis** and still be *flourishing*\\n\\nThis matters because treating illness does not automatically produce well-being. Both require attention." }, { "label": "Stigma & Its Costs", "icon": "🗣️", "content": "**Three stigma types to know:**\\n\\n- **Public stigma** — society's negative attitudes (e.g., 'they just need to be stronger')\\n- **Self-stigma** — internalizing those attitudes ('I should be able to handle this')\\n- **Structural stigma** — policies and systems that disadvantage people with mental illness\\n\\nContact-based education is the most evidence-backed way to reduce public stigma — real stories shift beliefs more than facts alone." }, { "label": "Protective Factors", "icon": "🛡️", "content": "**What protects mental health?**\\n\\nHolt-Lunstad et al. (2015) found social connection to be the single strongest protective factor — reducing mortality risk by 50%.\\n\\nOther well-evidenced factors include:\\n- Regular physical activity\\n- Quality sleep\\n- Sense of purpose or meaning\\n- Access to care when needed\\n\\nNone of these require high income or ideal circumstances to begin building." } ] }
\`\`\`

---

## Before You Move On: A Moment for Yourself

This module covered ideas that can feel personal. Before continuing, try this brief self-check:

\`\`\`steps
{ "title": "Quick Self-Check (2 minutes)", "steps": [ { "title": "Name your current state", "content": "On the spectrum from languishing to flourishing, where would you honestly place yourself *right now*? Not where you think you should be — where you actually are. There is no judgment in naming it accurately." }, { "title": "Identify your strongest domain", "content": "Looking at the biopsychosocial model — biological, psychological, social — which domain feels most supported in your life right now? Which feels most depleted?" }, { "title": "Notice one connection", "content": "Has completing this module shifted how you think about your own mental health, or someone else's? Even a small shift — a new word, a reframed belief, a moment of recognition — counts." } ] }
\`\`\`

---

## Voice Reflection

<!-- voice:section_check -->

\`\`\`callout
{ "type": "success", "title": "Dr. Amara's Closing Thought", "content": "You have covered a lot of ground in this module. You now understand that mental health is a spectrum, not a binary — and that stigma remains one of the biggest barriers to care. What concept resonated most with you? Was it the spectrum map, the biopsychosocial model, or perhaps the language of stigma? Carry that awareness forward as we move into understanding how stress physically affects your body in Module 2." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": ["Mental health is shaped by biological, psychological, and social factors working together — no single domain explains it all.", "Illness and well-being exist on two separate axes: you can have a diagnosis and still flourish, or no diagnosis and still languish.", "'Blah' has a name — languishing — and naming it is the first step toward addressing it.", "Public stigma is most effectively reduced through contact-based education: real stories from people with lived experience.", "Strong social connections are the most evidence-backed protective factor for mental health, outperforming income or education alone."] }
\`\`\`

---

## Crisis Resources

If anything in this module brought up difficult feelings, support is available now.

| Resource | How to Reach |
|----------|-------------|
| 988 Suicide & Crisis Lifeline | Call or text **988** (US) |
| Crisis Text Line | Text **HOME** to **741741** (US) |
| Samaritans | Call **116 123** (UK) |

> **Note:** This course is educational, not a substitute for professional mental health care. If you are struggling, please reach out to a qualified mental health professional.`,
    },
  ],
};

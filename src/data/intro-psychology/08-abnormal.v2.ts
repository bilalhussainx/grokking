import { Module } from "../types";

export const abnormalModule: Module = {
  id: "psych-abnormal",
  title: "Abnormal Psychology",
  description: "Understand anxiety disorders, depression, schizophrenia, and how they are treated. Includes medical disclaimer. Reference: Myers & DeWall, Psychology, 13th ed., Worth Publishers, 2021, Chapters 15-16. DSM-5-TR (APA, 2022).",
  lessons: [
    {
      id: "psych-anxiety-depression",
      slug: "anxiety-depression",
      title: "Anxiety Disorders and Depression",
      content: `## Anxiety Disorders and Depression

> **Medical Disclaimer:** This lesson provides educational information about mental health conditions. It is NOT a substitute for professional diagnosis or treatment. If you or someone you know is struggling with mental health, please contact a qualified mental health professional. Crisis resources: National Suicide Prevention Lifeline (988), Crisis Text Line (text HOME to 741741).

<!-- voice:section_check concept="What distinguishes clinical anxiety and depression from normal worry and sadness" -->

### What You'll Learn

- How clinical anxiety differs from normal worry
- The major types of anxiety disorders
- How major depressive disorder differs from everyday sadness

### When Normal Emotions Become Disorders

Everyone feels anxious before a test. Everyone feels sad after a loss. These are normal, adaptive emotions. **Anxiety disorders** and **depressive disorders** are diagnosed when these emotions become so intense, persistent, or disproportionate that they interfere with daily functioning.

Think of it like a smoke alarm. A working alarm saves lives. But an alarm that goes off every time you make toast — and won't stop — is dysfunctional. Anxiety disorders are like a smoke alarm stuck on maximum sensitivity.

<!-- voice:section_check concept="Types of anxiety disorders" -->

### Anxiety Disorders

Anxiety disorders are the most common mental health disorders, affecting approximately 19% of U.S. adults annually (NIMH, 2022).

| Disorder | Core Feature | Example |
|----------|-------------|---------|
| **Generalized Anxiety Disorder (GAD)** | Persistent, excessive worry about many things | Constantly worrying about school, health, relationships, money — all at once |
| **Panic Disorder** | Recurrent, unexpected panic attacks (racing heart, shortness of breath, terror) | Suddenly feeling like you're having a heart attack, with no apparent trigger |
| **Social Anxiety Disorder** | Intense fear of being judged or embarrassed in social situations | Avoiding class presentations, parties, or eating in public |
| **Specific Phobias** | Irrational, intense fear of a specific object or situation | Fear of spiders, heights, flying, or enclosed spaces |
| **Obsessive-Compulsive Disorder (OCD)** | Unwanted intrusive thoughts (obsessions) and repetitive behaviors (compulsions) | Repeated handwashing due to contamination fears |

### Major Depressive Disorder (MDD)

Depression is more than feeling sad. **Major Depressive Disorder** involves at least **two weeks** of:
- Persistent depressed mood OR loss of interest/pleasure
- Plus at least four of: changes in sleep, appetite, energy, concentration, or self-worth; psychomotor changes; recurrent thoughts of death

Depression affects approximately 8.4% of U.S. adults (NIMH, 2022) and is the leading cause of disability worldwide (WHO, 2023).

### The Biopsychosocial Model of Mental Illness

Mental disorders are not caused by a single factor — they result from the interaction of:

| Factor | Examples |
|--------|---------|
| **Biological** | Genetics, neurotransmitter imbalances (low serotonin in depression), brain structure differences |
| **Psychological** | Negative thinking patterns, learned helplessness, trauma |
| **Social** | Stress, poverty, isolation, adverse childhood experiences |

Aaron Beck's **cognitive theory of depression** (1967) proposes that depressed individuals have a "negative cognitive triad" — negative views of themselves, the world, and the future. These automatic negative thoughts perpetuate the depression.

<!-- voice:key_insight insight="Mental disorders are not character flaws or choices — they are conditions with biological, psychological, and social causes, and they are treatable." -->

### Reflection Questions

1. What's the difference between normal anxiety before an exam and Generalized Anxiety Disorder?
2. Why might depression be described as a disorder of neurotransmitters AND negative thinking patterns? How do these two explanations complement each other?
3. Why is it important to understand the biopsychosocial model rather than attributing mental illness to a single cause?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 15 — "Psychological Disorders"
- **National Institute of Mental Health** (nimh.nih.gov) — evidence-based information on all major disorders
- **Matt Haig**, *Reasons to Stay Alive*, Penguin, 2016 — a personal account of depression and recovery
`,
    },
    {
      id: "psych-schizophrenia",
      slug: "schizophrenia",
      title: "Schizophrenia: When Reality Fractures",
      content: `## Schizophrenia: When Reality Fractures

> **Medical Disclaimer:** This lesson provides educational information. It is NOT a substitute for professional diagnosis or treatment. Schizophrenia is a serious medical condition that requires professional care.

<!-- voice:section_check concept="What schizophrenia is and what it is not" -->

### What You'll Learn

- What schizophrenia actually is (and what it isn't)
- The positive and negative symptoms
- Current understanding of causes and treatments

### Clearing Up Misconceptions

**Schizophrenia** is one of the most misunderstood disorders. Let's start by clearing up what it is NOT:

- It is **NOT** "split personality" (that's Dissociative Identity Disorder — a completely different condition)
- It does **NOT** mean someone is violent (people with schizophrenia are more likely to be victims of violence than perpetrators)
- It is **NOT** caused by bad parenting

Schizophrenia is a severe brain disorder characterized by disruptions in thought processes, perceptions, emotions, and behavior. It affects approximately **1% of the global population** across all cultures (WHO, 2022).

<!-- voice:section_check concept="Positive and negative symptoms" -->

### Symptoms: Positive and Negative

In psychiatry, "positive" means something is **added** to normal experience, and "negative" means something is **taken away**. This is not a value judgment.

| Type | Definition | Examples |
|------|-----------|---------|
| **Positive symptoms** | Excesses — experiences beyond normal | **Hallucinations** (hearing voices that aren't there); **Delusions** (false beliefs, like believing you're being watched by the government); **Disorganized speech** (word salad, loose associations) |
| **Negative symptoms** | Deficits — reductions from normal | **Flat affect** (little emotional expression); **Avolition** (lack of motivation); **Social withdrawal**; **Alogia** (reduced speech) |
| **Cognitive symptoms** | Impairments in thinking | Poor working memory, difficulty focusing, trouble with executive functions |

### What Causes Schizophrenia?

No single cause has been identified. The current understanding involves multiple factors:

**Genetics:** If one identical twin has schizophrenia, the other has about a **48% chance** of developing it (vs. 1% in the general population). This proves a genetic component but also shows that genes alone are not sufficient.

**Brain differences:** Brain imaging studies show enlarged ventricles (fluid-filled spaces) and reduced gray matter in some people with schizophrenia. Excess **dopamine activity** in certain brain pathways is associated with positive symptoms — this is the **dopamine hypothesis**.

**Environmental triggers:** Prenatal infections, birth complications, childhood trauma, cannabis use during adolescence, and high stress can all increase risk in genetically vulnerable individuals.

### Treatment

- **Antipsychotic medications** — block dopamine receptors, reducing positive symptoms. First-generation (like chlorpromazine, 1950s) and second-generation (like clozapine) have different side effect profiles.
- **Psychosocial therapies** — cognitive-behavioral therapy, social skills training, family education, and supported employment improve functioning.
- **Early intervention** — research shows that early treatment leads to better outcomes (McGorry et al., 2008).

<!-- voice:key_insight insight="Schizophrenia is a brain disorder, not a personality flaw. It involves disruptions in perception, thought, and emotion, and it responds to treatment — especially when caught early." -->

### Reflection Questions

1. Why is it important to distinguish schizophrenia from Dissociative Identity Disorder?
2. If identical twins share 100% of their DNA but the concordance rate for schizophrenia is only 48%, what does this tell us about the role of environment?
3. Antipsychotics work by blocking dopamine. Based on what you know about neurotransmitters, what side effects might you predict?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 15 — "Schizophrenia"
- **Elyn Saks**, *The Center Cannot Hold*, Hachette, 2007 — a law professor's memoir of living with schizophrenia
- **NIMH**, "Schizophrenia" (nimh.nih.gov) — current research and treatment information
`,
    },
    {
      id: "psych-treatment",
      slug: "treatment",
      title: "Treating Mental Health: Therapy and Medication",
      content: `## Treating Mental Health: Therapy and Medication

> **Medical Disclaimer:** This lesson is educational only. If you need mental health support, please consult a qualified professional.

<!-- voice:section_check concept="Major approaches to treating mental health conditions" -->

### What You'll Learn

- The major types of psychotherapy
- How psychiatric medications work
- How to evaluate whether a treatment is evidence-based

### Getting Help Works

One of the most important facts in psychology: **treatment works**. Meta-analyses consistently show that psychotherapy is effective for most common mental health conditions, and the combination of therapy plus medication is often the most effective approach (Cuijpers et al., 2019).

<!-- voice:section_check concept="Types of psychotherapy" -->

### Major Types of Psychotherapy

| Approach | Based On | Goal | Techniques |
|----------|---------|------|-----------|
| **Psychodynamic** | Freud's psychoanalysis | Uncover unconscious conflicts from past | Free association, dream analysis, exploring past relationships |
| **Cognitive-Behavioral (CBT)** | Cognitive + behavioral theories | Change negative thought patterns and behaviors | Identifying cognitive distortions, behavioral experiments, exposure therapy |
| **Humanistic (Client-Centered)** | Rogers' person-centered approach | Promote self-awareness and personal growth | Unconditional positive regard, empathic listening, genuineness |
| **Group therapy** | Various | Shared support and perspective | Group discussions, feedback from peers |
| **Family therapy** | Systems theory | Improve family communication patterns | Reframing, role-playing, communication exercises |

**Cognitive-Behavioral Therapy (CBT)** is the most extensively researched form of psychotherapy. It works by identifying **cognitive distortions** — systematic errors in thinking that maintain psychological problems:

| Cognitive Distortion | Description | Example |
|---------------------|-------------|---------|
| **All-or-nothing thinking** | Seeing things in black and white | "If I don't get an A, I'm a total failure" |
| **Catastrophizing** | Expecting the worst possible outcome | "If I fail this test, my life is over" |
| **Overgeneralization** | Drawing broad conclusions from one event | "I got rejected once, so no one will ever like me" |
| **Mind reading** | Assuming you know what others think | "Everyone in class thinks I'm stupid" |

### Psychiatric Medications

| Category | Treats | How It Works | Examples |
|----------|-------|-------------|---------|
| **Antidepressants (SSRIs)** | Depression, anxiety | Increase serotonin availability | Fluoxetine (Prozac), sertraline (Zoloft) |
| **Anti-anxiety (benzodiazepines)** | Acute anxiety, panic | Enhance GABA activity (calming) | Alprazolam (Xanax), diazepam (Valium) |
| **Antipsychotics** | Schizophrenia, bipolar | Block dopamine receptors | Risperidone, olanzapine |
| **Mood stabilizers** | Bipolar disorder | Stabilize mood fluctuations | Lithium |
| **Stimulants** | ADHD | Increase dopamine and norepinephrine | Methylphenidate (Ritalin), amphetamine (Adderall) |

### Is This Treatment Evidence-Based?

Not all treatments are equally effective. Look for treatments that have been tested in **randomized controlled trials (RCTs)** — experiments where patients are randomly assigned to treatment or control groups. Treatments supported by multiple RCTs are considered **evidence-based**.

Be cautious of treatments that:
- Rely only on testimonials ("It worked for me!")
- Have no published research in peer-reviewed journals
- Promise to cure everything
- Are promoted by someone selling the treatment

<!-- voice:key_insight insight="Effective treatment exists for most mental health conditions — the key is finding evidence-based approaches, whether therapy, medication, or a combination of both." -->

### Reflection Questions

1. Why is CBT considered particularly effective? What does it target that other therapies might not?
2. A friend says "I don't believe in therapy — it's just paying someone to listen." How would you respond using what you learned?
3. Why should consumers be skeptical of treatments that rely solely on personal testimonials rather than research evidence?

### Deeper Reading

- **Myers & DeWall**, *Psychology*, 13th ed., Worth Publishers, 2021, Chapter 16 — "Therapy"
- **Judith Beck**, *Cognitive Behavior Therapy: Basics and Beyond*, 3rd ed., Guilford Press, 2020 — authoritative CBT textbook
- **SAMHSA National Helpline** (1-800-662-4357) — free, confidential, 24/7 treatment referral and information
`,
    },
    {
      id: "psych-abnormal-checkpoint",
      slug: "abnormal-checkpoint",
      title: "Checkpoint: Abnormal Psychology",
      content: `## Module Checkpoint: Abnormal Psychology

> **Reminder:** If you or someone you know is struggling, please reach out to a mental health professional. Crisis resources: 988 Suicide & Crisis Lifeline (call or text 988).

### Review

In this module, you explored the major categories of psychological disorders — anxiety disorders, depression, and schizophrenia — and learned how they are treated through psychotherapy and medication. You examined the biopsychosocial model of mental illness and learned to evaluate treatments based on evidence.

<!-- voice:section_check concept="Module review — abnormal psychology" -->

### Quiz

**Question 1:** Generalized Anxiety Disorder (GAD) is characterized by:
A) Sudden panic attacks
B) Fear of a specific object
C) Persistent, excessive worry about many things
D) Unwanted repetitive thoughts and behaviors

**Question 2:** True or False: Schizophrenia means "split personality."
Explain what schizophrenia actually involves.

**Question 3:** The type of psychotherapy that focuses on identifying and changing negative thought patterns is called __________.

**Question 4:** Using the biopsychosocial model, describe three factors (one biological, one psychological, one social) that might contribute to someone developing depression.

**Question 5:** A website advertises a new "revolutionary" treatment for anxiety that costs $500 per session. It has no published research but features five glowing testimonials. Using what you learned about evidence-based treatment, evaluate this claim.

<!-- voice:key_insight insight="Mental health conditions are real, common, and treatable. Understanding them reduces stigma and helps people get the help they need." -->

### Voice Summary

After completing the quiz, your voice coach will ask you to summarize what you learned in this module in your own words. This helps reinforce your understanding and personalizes your learning path.
`,
    },
  ],
};

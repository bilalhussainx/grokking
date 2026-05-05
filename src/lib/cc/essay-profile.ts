// Region-aware essay profile.
//
// The Brainstorm → Outline → Draft → Review pipeline is the same for every
// essay (US PS, US supplements, Canadian supplements, UCAS PS questions).
// What differs is the *guidance* the LLM gets at each stage:
//
//   US Common App PS — find your story, narrative voice, vulnerability.
//   US supplements   — same lens, anchored to the school's prompt.
//   Canadian supps   — academic-leaning, "why this program at this school"
//                      carries more weight than US-style "fit with community".
//   UCAS Q1 (UK)     — subject fit. Modules, faculty, intellectual draw.
//                      Personal narrative is actively bad here.
//   UCAS Q2 (UK)     — academic preparation. Specific A-Level / IB topics.
//   UCAS Q3 (UK)     — super-curriculars (NOT extracurriculars). Reading
//                      lists, EPQs, MOOCs, competitions. Extracurriculars
//                      like sports captaincy carry zero weight unless
//                      directly subject-relevant.
//
// This module returns a structured profile per essay so the brainstorm and
// outline prompt builders can inject the right framing without each builder
// reinventing the conditional. Returning null means "use the default US
// framing already in essay-helpers" — callers don't have to special-case
// the default.

export type EssayCountry = "US" | "CA" | "UK";

export interface EssayProfile {
  country: EssayCountry;
  audience: string; // "UK admissions tutor", "Canadian admissions reader", etc.
  what: string; // human label for what's being written
  // Block injected into the brainstorm system prompt. Multi-line, with the
  // [TAG] header so the LLM sees it as a directive, not narrative.
  brainstormFraming: string;
  // Block injected into the outline system prompt — usually a tighter
  // structural hint that mirrors the brainstorm framing.
  outlineFraming: string;
  // When true, the US-centric ESSAY_EXPERT_TIPS / ESSAY_STRUCTURAL_PATTERNS
  // blocks are SKIPPED. UCAS PS especially does not want the US Common App
  // tip set — the genres are different.
  suppressUSExpertTips: boolean;
}

// Returns null for the US default — caller leaves existing prompt unchanged.
export function getEssayProfile(
  essayType: string | null | undefined,
  schoolCountry?: string | null,
): EssayProfile | null {
  const t = (essayType ?? "").toLowerCase();

  // UCAS personal statement — three structured questions, country=UK
  // implicit because UCAS only goes to UK universities.
  if (t === "ucas_ps_q1") {
    return {
      country: "UK",
      audience: "UK admissions tutor reading for SUBJECT FIT",
      what: "UCAS Personal Statement Q1 — Why do you want to study this course?",
      brainstormFraming: `

[UCAS Q1 — SUBJECT FIT, NOT PERSONAL NARRATIVE]
This is the UK admissions tutor's "why this course" question. They are evaluating INTELLECTUAL FIT with the course, NOT a personal origin story. The US Common App "find your story" framing is actively wrong here.

Brainstorm focus:
- Specific aspects of the COURSE that drew the student in (modules, faculty research, methodologies, set texts)
- The intellectual MOMENT or QUESTION that pulled them toward this subject (not "I have always loved X")
- For Oxbridge applicants: tutorial / Tripos topics they're intellectually prepared for and curious about
- The SHAPE of their interest (theoretical vs. applied, breadth vs. depth)

Push the student to name SPECIFIC course details. "I want to study Economics" is empty; "I want to study Cambridge Economics because I'm pulled by the way Tripos pairs game theory with development microeconomics" is what the tutor wants to read.

Avoid:
- Generic "I have always loved X" openers
- Personal narrative / family origin stories (that's a US Common App move)
- Extracurriculars unless the activity directly demonstrates subject engagement (e.g., a coding project for a CS applicant — yes; debate captaincy for an Economics applicant — no)
- Character framings like "this taught me resilience" (UK tutors don't read for character — they read for intellect)`,
      outlineFraming: `

[UCAS Q1 — SUBJECT FIT OUTLINE]
Outline shapes that work for Q1:
- Hook on a specific intellectual question / paradox the subject opens up
- Section on what specifically drew you (modules, methodologies, work that excites you)
- Section on how your studies have prepared you to engage with this question
- Tight reflective close on what you'd want to do with this knowledge

Avoid the US Common App "scene → reflection" structure. UCAS Q1 reads almost like a short academic statement of purpose.`,
      suppressUSExpertTips: true,
    };
  }

  if (t === "ucas_ps_q2") {
    return {
      country: "UK",
      audience: "UK admissions tutor evaluating ACADEMIC PREPARATION",
      what: "UCAS Personal Statement Q2 — How have your qualifications and studies prepared you for this course?",
      brainstormFraming: `

[UCAS Q2 — ACADEMIC PREPARATION, SPECIFIC TOPICS]
This is the academic foundation question. UK admissions tutors want SPECIFIC TOPICS from your A-Levels / IB / equivalent that connect to the course you're applying to — NOT a list of subjects you took.

Brainstorm focus:
- For each relevant qualification, NAME the topic / module / unit / paper that you went deep on
- For Pakistani students with FSc / HSC: name the board (Federal, Sindh, Punjab) + specific subjects + standout topics
- For IB: connect higher level subjects to the course; don't just say "I did IB Maths HL" — say "I did IB Maths HL and the Core Calculus paper pulled me toward analysis"
- For A-Level students: name the syllabus board (AQA, OCR, Edexcel) and the modules / set texts when relevant
- For Cambridge applicants especially: this is where the tutor judges whether you're prepared for Tripos-pace teaching — name SPECIFIC topics you went deep on, not "I did Maths"

Push the student to:
- Pick 2-3 topics across their qualifications and develop each in 1-2 sentences with WHAT it taught them about the subject
- Connect each topic to a specific aspect of the course they're applying to
- Name specific texts / problems / experiments they worked through

Avoid:
- Listing subjects without connecting them to the target course
- "I got an A* in Maths" — UK PS doesn't quote grades; that's on the form already
- Generic transferable skills framing ("this taught me critical thinking")`,
      outlineFraming: `

[UCAS Q2 — ACADEMIC PREP OUTLINE]
Structure: 2-3 mini-sections, each anchored on a specific qualification topic that maps to the target course. Each section: name the topic → what you learned that's directly relevant → how it sets you up for the course. No personal narrative scaffolding.`,
      suppressUSExpertTips: true,
    };
  }

  if (t === "ucas_ps_q3") {
    return {
      country: "UK",
      audience: "UK admissions tutor evaluating SUPER-CURRICULARS",
      what: "UCAS Personal Statement Q3 — What else have you done to prepare outside of formal education?",
      brainstormFraming: `

[UCAS Q3 — SUPER-CURRICULARS, NOT EXTRACURRICULARS]
This is the question US students get most wrong because the words look similar. SUPER-CURRICULARS are intellectual preparation OUTSIDE the syllabus that's directly relevant to the subject. EXTRACURRICULARS are sports, clubs, leadership, service. UK admissions tutors largely DO NOT CARE about extracurriculars — they care about super-curriculars.

What counts as super-curricular (push the student to surface these):
- Books, papers, podcasts, lectures DIRECTLY related to the course
- EPQs (Extended Project Qualification) — if they did one, dig hard
- Online courses (MIT OpenCourseWare, Coursera, edX, Khan Academy specifically beyond syllabus)
- Subject-specific competitions (Olympiads, BMO, Senior Maths Challenge, Chemistry Olympiad, Linguistics Olympiad)
- Summer schools focused on the subject
- Work experience / shadowing in the field
- Independent projects: a Python project for CS applicants, a small piece of original research, a translated text for Classics

What does NOT count for UK PS Q3 (do not lean on these unless directly subject-relevant):
- Sports captaincy, debate club presidency, basketball — irrelevant
- Service hours / volunteering — irrelevant
- Music / arts unless applying for those courses
- Generic "leadership" examples

Push for SPECIFICITY:
- Don't accept "I read Sapiens" — push for "I read Yuval Harari's chapter on the cognitive revolution and it pushed back against an assumption I'd brought from my Anthropology IB syllabus, particularly the idea that..."
- Don't accept "I did a Python project" — push for "I built a sentiment classifier using a pre-trained BERT model on Twitter data and ran into the surprise that..."
- Push the student to NAME THINGS — specific titles, specific problems, specific conclusions

Brainstorm strategy:
- Walk the student through their last 12 months of intellectual life IN the subject
- Surface 2-4 super-curricular threads they can develop into one paragraph each
- For each, push them to articulate the QUESTION it raised or ANSWER it changed`,
      outlineFraming: `

[UCAS Q3 — SUPER-CURRICULARS OUTLINE]
Structure: 2-4 super-curricular threads, each ~150-300 chars. Each thread: name the activity → name the specific text/problem/work → say what it changed in your thinking. No "and this taught me leadership" closes.`,
      suppressUSExpertTips: true,
    };
  }

  // Canadian supplements — supplement_* essay_type AND school is Canadian.
  // Detect via the school's country since CA supplements use the same
  // essay_type prefix as US ones.
  if (t.startsWith("supplement_") && schoolCountry === "CA") {
    return {
      country: "CA",
      audience: "Canadian admissions reader (academic-leaning)",
      what: "Canadian university supplement essay",
      brainstormFraming: `

[CANADIAN SUPPLEMENT — ACADEMIC-LEANING]
Canadian universities (UofT, UBC, McGill, Waterloo, Queen's) read supplements through a more academic lens than US schools. "Why this program at this university" carries far more weight than US-style "fit with community / campus".

Brainstorm focus:
- Specific PROGRAM features (not general school spirit) — the modules, faculty research, co-op options, specialization tracks
- Academic preparation that maps to the program's prerequisites
- Concrete career or research goals the program directly enables

Special cases:
- Waterloo Engineering / Math / CS Admission Information Form (AIF) — heavily weighted, often more important than the average. Push hard for specifics.
- UofT supplemental for Engineering / Rotman / Architecture — also heavily weighted; treat with the same care as a US Top-10 supplement.
- UBC PSE (Personal Statement of Experience) — five short answers; push for ONE specific story per answer rather than résumé summaries.

Carries less weight than in US supplements:
- Diversity / community / campus-fit framing — Canadian schools value this less in the supplement (the application form covers it)
- Personal narrative without academic anchor

Don't dismiss personal voice entirely — it still helps — but the spine of every Canadian supplement should be ACADEMIC FIT.`,
      outlineFraming: `

[CANADIAN SUPPLEMENT OUTLINE]
Lead with academic fit (program features + prep) and use personal anchor as supporting evidence, not the throughline. For UBC PSE-style five-answer prompts, treat each answer as its own micro-essay with one specific story rather than five repetitions of the résumé.`,
      suppressUSExpertTips: false,
    };
  }

  // US default — caller keeps existing behavior.
  return null;
}

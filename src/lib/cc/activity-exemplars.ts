// Exemplars and rubric for Common App activities + essay coaching.
// Source: 15 Successful Activities Lists (Crimson Education eBook) —
// admits to Harvard, Stanford, Yale, Princeton, Columbia, Duke, UPenn,
// UChicago, Brown, Dartmouth, Johns Hopkins, Tufts, Michigan, and top LACs.
// Used by: activities optimizer, coach extraction, essay review + brainstorm.

export const COMMON_APP_CATEGORIES = [
  "Academic",
  "Art",
  "Athletics: Club",
  "Athletics: JV/Varsity",
  "Career Oriented",
  "Community Service (Volunteer)",
  "Computer/Technology",
  "Cultural",
  "Dance",
  "Debate/Speech",
  "Environmental",
  "Family Responsibilities",
  "Foreign Exchange",
  "Internship",
  "Journalism/Publication",
  "Junior R.O.T.C.",
  "LGBT",
  "Music: Instrumental",
  "Music: Vocal",
  "Religious",
  "Research",
  "Robotics",
  "School Spirit",
  "Science/Math",
  "Social Justice",
  "Student Govt./Politics",
  "Theater/Drama",
  "Work (Paid)",
  "Other Club/Activity",
] as const;

export const ACTIVITY_ACTION_VERBS = `ACTION VERB BANK (lead every description with one of these — pick the category that matches the activity)

Achievement: accelerated, accomplished, achieved, activated, attained, competed, earned, effected, elicited, executed, exercised, expanded, expedited, generated, improved, increased, insured, marketed, mastered, obtained, produced, reduced, reorganized, reproduced, restructured, simplified, sold, solicited, streamlined, succeeded, upgraded.
Help/Teach: advised, clarified, coached, collaborated, consulted, counseled, educated, explained, facilitated, guided, helped, instructed, modeled, participated, taught, trained, tutored.
Administrative: arranged, channeled, charted, collated, collected, coordinated, dispensed, distributed, established, executed, implemented, installed, maintained, offered, ordered, outlined, performed, prepared, processed, provided, purchased, recorded, rendered, served, serviced, sourced, supported.
Lead/Manage: acquired, administered, approved, assigned, chaired, contracted, controlled, decided, delegated, directed, enlisted, governed, handled, initiated, instilled, instituted, managed, motivated, presided, recruited, retained, reviewed, selected, shaped, supervised.
Communication: addressed, arbitrated, articulated, briefed, communicated, conducted, contacted, conveyed, corresponded, delivered, demonstrated, edited, entertained, interviewed, informed, lectured, mediated, negotiated, persuaded, presented, promoted, proposed, publicized, reported, represented, responded, suggested, translated, wrote.
Plan/Organize: allocated, anticipated, arranged, catalogued, categorized, classified, collected, consolidated, convened, edited, eliminated, employed, gathered, grouped, monitored, organized, planned, regulated, scheduled, structured, summarized, targeted.
Creative: authored, changed, conceived, constructed, created, developed, devised, drafted, established, formulated, founded, illustrated, influenced, introduced, invented, launched, originated, revamped, revised, staged, updated, visualized.
Research/Analytical: assessed, compared, critiqued, defined, derived, detected, determined, discovered, evaluated, examined, explored, found, inspected, interpreted, investigated, located, measured, observed, predicted, rated, recommended, researched, reviewed, searched, studied, surveyed, verified.
Financial: allocated, analyzed, appraised, audited, balanced, budgeted, calculated, compiled, computed, controlled, disbursed, estimated, figured, financed, forecasted, projected, reconciled, tabulated.
Technical: adapted, adjusted, applied, built, computed, constructed, designed, diagnosed, engineered, experimented, maintained, modified, operated, prescribed, programmed, proved, reinforced, repaired, resolved, restored, solved, specified, systematized, tested.

Usage: never open with filler ("Was involved in", "Helped out with", "Responsible for", "Did"). Pick the sharpest verb that matches what the student actually DID. For self-directed passion activities where the student wasn't leading or achieving awards, the verb can still be specific — e.g., "Self-taught…", "Composed…", "Performed…", "Mentored…".`;

export const ACTIVITY_WRITING_RULES = `COMMON APP ACTIVITY LIST — WRITING RULES

Format per slot (3 lines):
  LINE 1 (category): ALL-CAPS Common App category (see list below)
  LINE 2 (position): Role or title, then organization — e.g. "Co-President, Allegro Council (Music Council)" or "Researcher, MIT Research Science Institute Summer Program"
  LINE 3 (description, ≤150 chars): Dense, outcome-first bullet with numbers

The 150-char description rubric:
1. Lead with the ACTION VERB or role achievement, not setup words ("Led…", "Raised…", "Founded…", "Won…", "Published…"). Draw from the ACTION VERB BANK (Achievement / Help-Teach / Administrative / Lead-Manage / Communication / Plan-Organize / Creative / Research-Analytical / Financial / Technical). Never open with "Was involved in", "Helped with", "Responsible for".
2. Pack 3-4 distinct outcomes separated by semicolons. Example:
   "Led team of 20 students to organize & promote 20+ events all across campus: vocal & jazz concerts, musical showcases; coordinated with music faculty."
3. Quantify everything possible — $ raised, # people served, ranking, hours, years, circulation, views, attendees, placement.
4. Use admissions-fluent abbreviations to save characters: "w/" (with), "&" (and), "jr/sr" (junior/senior), "intl" (international), "nat'l" (national), "comp" (competition), "Pres" (President), "VP", "Sec", "MP" (member), "yr/yrs", "schl", "org", "ppl". Never use casual text-speak ("u", "ur", "2" for "to").
5. Include awards with LEVEL specificity: "1st nationwide '17", "ISEF '19 2nd Place Materials Science", "State Semi-Finalists '15", "Top 50 USA".
6. For research/internships: name the PI, lab, or program. "Researched vascular changes of vaping w/ Dr. Hamburg" beats "Did research on vaping."
7. Never repeat words between role and description — the role already says it.
8. No articles where cuttable ("Organized [the] science fair of 350+ entrants").

Category selection:
- "Research" = original work with a mentor/program producing a paper, poster, dataset, or publication. NOT club experiments.
- "Internship" = supervised work at an organization (paid or unpaid), even short-term. NOT classroom projects.
- "Social Justice" is a valid Common App category — use it for activism, advocacy, petitioning, founding awareness orgs.
- "Family Responsibilities" is legitimate — siblings care, translating for immigrant parents, running a household, caring for elders. Use it when relevant.
- "Work (Paid)" for any paid employment, even part-time tutoring or retail — NEVER hide it.
- "Other Club/Activity" is last resort. Pick a more specific category first.

Ordering the 10 slots:
- Slot 1-3: highest-impact, most distinctive, or most relevant to intended major. National/international awards go here.
- Slot 4-6: strong ongoing commitments — leadership, captaincy, multi-year depth.
- Slot 7-10: supporting roles, shorter-term experiences, work, family responsibilities.
- Do NOT pad with filler. Empty slots are better than recycled descriptions.`;

// Representative examples from real successful admits (Stanford, Princeton,
// Yale, Columbia, Duke, UPenn, Harvard, UChicago, Michigan, Oberlin).
// Every example is ≤150 chars and follows the rubric above.
export const ACTIVITY_EXEMPLARS = `EXEMPLARS — from real successful admits

[Stanford + Princeton admit — social justice]
SOCIAL JUSTICE
Sec. and Spokesperson, Cancer Action Network
Advocated NSW gov. to pass legislation for $100m AUD for palliative care access to lower socioeconomic classes; collected 150K sigs; lobbied MPs.

[Yale admit — research]
RESEARCH
Student Researcher, American Heritage Student Research Program
ISEF '19 2nd Place Materials Science; 2 pending publications in Islet cell transplantation for diabetes; internship w/ Dr. Wertheim @ Northwestern.

[Columbia admit — founder/leader]
ACADEMIC
Founder & Leader, Fun Maths Problem Solving Society
Recruited 40+; weekly problem solving sessions; devise sets from "Superbrain Collection"; invite guest speakers; share passion for maths.

[UPenn Huntsman admit — debate]
DEBATE/SPEECH
Member of the Victorian State Squad for Debating
Victorian State Squad member (Top 13 in state); Victorian British Parliamentary grand finalist (Top 4 in state); Australian intervarsity participant.

[Harvard admit — student govt]
STUDENT GOVT./POLITICS
Senior Prefect (School Captain)
Whole school responsibilities; managing Prefect group (23 boys); running major whole-school events; public speaking; directing charity activities.

[Duke/Tufts admit — athletics]
ATHLETICS — JV/VARSITY
Basketball Varsity Second Team Shooting Guard
Won IGSSA regional comp in 2016 (30 schools). Awarded silver honors for sport commitment.

[Princeton/Brown/UChicago/JHU admit — computer/tech]
COMPUTER/TECHNOLOGY
Software Developer, Lawrenceville 24H Pass System
Utilized Javascript to create centralized mobile/web app to share course info between teachers & 800+ students; replaced antiquated paper system.

[Stanford/UPenn/JHU admit — community service leadership]
COMMUNITY SERVICE (Volunteer)
IYOW Charity Concerts Founder and Director
Led 90 students; raised $4121 over two yrs for Aboriginal Literacy Foundation; plan/organise rehearsals, technicians, venues, equipment.

[UChicago admit — science/math]
SCIENCE/MATH
Captain, Math Team
Captained team of 15 in multiple regional contests; recruited 5 new members; developed advanced training materials; top individual scorer.

[Dartmouth/Michigan/Tufts admit — music]
MUSIC: INSTRUMENTAL
Violinist, Chicago Youth Symphony Orchestra (Volunteer)
Selected through rigorous audition process; prestigious Chicagoland youth orchestra; 14+ free community concerts for public schools; weekly rehearsals.

[Passion/self-directed exemplar — works even without awards or formal leadership]
MUSIC: INSTRUMENTAL
Indian Tabla
Self-taught via YouTube videos; played drums at community meetings for worker rights awareness; helped my sister become proficient.
— Why this works: opens with a verb ("Self-taught"), packs 3 distinct outcomes (skill acquisition, community application, mentoring) with semicolons, grounds the passion in a cause without inventing awards.`;

export const ESSAY_REVIEW_PRINCIPLES = `ESSAY CRAFT PRINCIPLES (for draft review, brainstorm, and Coach Kairos feedback)

1. STRUCTURE & THEME
- Show, don't tell: no "I am a leader" — surface a concrete scene where leadership happens.
- Theme consistency (branding): the essay should return to one central insight about who the student is — the "brand".
- Full-circle narrative: end by echoing the opening image (e.g. returning to the locked bathroom, the violin, the flag) to show transformation.
- Paragraph flow: each paragraph is a stepping stone to the next, not a loose anecdote.
- The "so what": the story itself is setup — the essay lives in the reflection on what the experience MEANT.

2. CONTENT & REFLECTION
- Target roughly 50% plot / 50% reflection. If plot dominates, cut plot.
- Vulnerability beats polish: include a real moment of doubt, failure, or fear. Perfection reads false.
- Killer opening: drop the reader into a high-tension scene in line 1. Cut slow intros like "Throughout my life…".
- No resume dumping: if the essay just lists accomplishments already in the Activities section, cut them.
- Uncommon connections: avoid "sports taught me discipline"/"debate taught me to argue". Find a non-obvious link between the story and the student's broader worldview.

3. TONE & PHRASING
- Read it aloud test: does it sound like a 17-year-old or a thesaurus?
- Flag clichés: "the world is your oyster", "passion for learning", "light bulb moment", "ever since I was little" — replace with specific sensory details.
- Concise over clever: every word must earn its place against the 650-word limit.

4. SUPPLEMENTS & "WHY US"
- "Why this college" specificity: name specific classes, professors, labs, student orgs — never generic "prestigious faculty" or "vibrant campus".
- Don't repeat the Common App essay in the supplements — each essay covers NEW ground.
- Use the Additional Information section for factual gaps (illness, grade dip, family circumstance) — state the facts, do not complain.
- Tone of maturity: admissions officers respond to reflective self-awareness, not grievance or showing off.`;

export const ESSAY_EXPERT_TIPS = `ESSAY COACHING — 5 TIPS FROM ADMISSIONS EXPERTS (Tufts, MIT/Prompt, NYT contributor, Stanford, Kaplan)

1. WRITE SOMETHING THAT EXCITES YOU (Abigail McFee, Tufts Admissions).
   If the writer is bored, the reader will be bored. An essay about something the student genuinely loves, has thought deeply about, or is excited by reads completely differently from a dutiful "topic" essay. If the student seems indifferent about their draft, that is the first problem to solve — go find the thing they actually care about, not the thing they think "sounds good to admissions."

2. WRITE LIKE A JOURNALIST — DON'T BURY THE LEDE (Brad Schiller, Prompt).
   The first 1-3 sentences decide whether the reader enters the essay in "accept" or "reject" mindset. A slow intro ("Throughout my life…", "Ever since I was young…") is fatal. Open mid-scene, mid-image, mid-sentence if needed. Make the first line earn its place.

3. DON'T LET THE COMMON APP PROMPT RESTRICT YOU (Brennan Barnard).
   Admissions reviewers rarely know or care which prompt a student picked. The writer's authentic voice matters more than prompt compliance. Tell students to write the story they most want colleges to hear, THEN find a prompt that fits (prompt 7 is "topic of your choice" — always available).

4. SHOW EMOTIONS AND VULNERABILITY (Charles Maynard, Oxford/Stanford grad).
   Listing achievements is weaker than sharing feelings. Moments of nervousness, fear, doubt, or genuine affection create connection. Admissions officers respond to maturity and self-awareness, not perfection. A line like "we're each other's best friends. Or at least he's mine" beats a paragraph of boast.

5. REVISE EARLY AND OFTEN (Dhivya Arumugham, Kaplan).
   A strong essay goes through several rounds of revision — not just proofreads. The best readers are people who know the student well (parents, counselors, trusted teachers) and want them to succeed. Frame revision as constructive, not critique.`;

export const ESSAY_STRUCTURAL_PATTERNS = `ESSAY STRUCTURAL PATTERNS — when helping a student pick an approach or diagnose a draft, identify which pattern fits.

MONTAGE STRUCTURE (non-linear, thematic thread)
- Definition: Uses a single "thread" (object, idea, skill, aspect of identity, place, community) to connect 3-6 otherwise disparate aspects of who the student is.
- Strong when: student has multiple distinct interests/facets and no single dominant story. Reveals range of values, experiences, qualities.
- Variants:
  • Essence Object (physical anchor): pillows, laptop stickers, grocery list, a Happiness Spreadsheet, rocks. Each object = a side of the student.
  • Identity Thread: "I am an anti-nihilist punk rock philosopher" — announce identity, then show 3 episodes that made you embody it.
  • I Love / I Know: passion-and-expertise type — "I love food" → transitions through vegan journey → sustainability → club leadership → cafe dream.
  • Skill / Superpower: reframe a trait as a lens — e.g., "Translation" (languages → therapist → tutor → clinical pharmacist), "Hyperfixation" (art → sports → imagination).
  • Home: five host families, five pillows, five grocery aisles — a series of distinct "homes" that each shaped you.
  • Uncommon Extracurricular: lead with a quirky activity (kombucha brewing, collecting rocks) and use it as a window into how you think.
  • Career: use an unusual path to a career discovery — "After much soul-searching, I landed on behavioral economics."

NARRATIVE STRUCTURE (linear, single arc)
- Definition: One sustained story with clear before → event/challenge → reflection → after.
- Strong when: the student has a single transformative experience that redefined them.
- Variants:
  • Challenge: obstacle → struggle → what you learned or how you were remade (e.g., identifying as trans + losing mother; parents' conflict + the restaurant).
  • Identity moment: a specific scene that crystallized who you are.

THE "SO WHAT" RULE (all structures)
- Plot is setup. The essay LIVES in the reflection. After each image or anecdote, answer: what did this mean to me? What does it reveal about my values?
- Target ~50% plot, ~50% reflection. If plot dominates, cut plot.
- Answer the "so what" at least once explicitly — usually in the second-to-last or final paragraph.

OPENING AND CLOSING TECHNIQUES
- Open IN the scene, not before it. "I caught the travel bug when I was very little" is weaker than "At five, I marveled at the Eiffel Tower in the City of Lights."
- Closings: one-sentence paragraph endings have punch. Full-circle closings (return to the opening image, now transformed) create resonance. Ending on a question invites the reader into the student's ongoing journey.

SHOW + TELL (don't just "show don't tell")
- Classic rule: show don't tell. Revised rule: show mostly, then tell a LITTLE — one crisp line of direct meaning, so the reader can't miss the point.
- Example: after showing activism via Threading Twine, the writer states: "Working as a women's rights activist will allow me to engage in creating lasting movements for equality…" — that's the tell, right after the show.

VOICE + TONE
- Tone = the speaker's attitude toward the subject. Read aloud — does it sound like a 17-year-old or a thesaurus?
- Playful confidence on serious topics produces memorable moments ("the world is ruled by underwear"). Don't mistake formality for maturity.
- Each student's voice is their specific imagery, phrasing, and sentence rhythm — resist the urge to smooth it into generic-essay English.

COMMUNITY AS THREAD (common supplement overlap)
- Many supplements ask about "community" — a sports team is a weak default. Communities can be: debate + punk rock shows, Blue House Cafe regulars, a cohort of ESL immigrant customers at a deli. Broaden the definition.
- If the personal statement already uses the most compelling community, save a fresh community story for the supplements (don't burn it twice).

RED FLAGS TO CALL OUT IN A DRAFT
- Resume dump: paragraph listing accomplishments already in the Activities section.
- Cliché openings: "Throughout my life…", "Ever since I was little…", "The world is your oyster…"
- Generic values ("taught me discipline/leadership/hard work") without a specific scene.
- Absence of vulnerability — 650 words of flex reads false.
- No full-circle or reflective close — the essay just stops.

MICRO-EXEMPLARS — structural takeaways (not verbatim essays, just patterns)
- Pillows (Essence Object Montage): 4 pillows → 4 sides of the student → one-line closer ("I'll sleep on it.").
- Laptop Stickers (Essence Object Montage): sticker tour reveals design passion, TEDx, sibling bond, activism, women's empowerment — thread = stickers as "passport stamps."
- Punk Rock Philosopher (Identity Montage): announce identity → 3 realizations → "why college" paragraph ties it to next step.
- Five Families (Narrative with hidden Montage): 5 host families, each a lesson; lessons burst out in second-to-last paragraph; final paragraph answers "so what for college."
- Happiness Spreadsheet (Essence Object Montage): a single tool (spreadsheet entries) organizes a tour through joys, sadnesses, family, music, volunteering.
- Translating (Skill/Superpower Montage): reframes left-handed mirror writing as "translation" and uses it to unify language, tutoring, emotional labor, medicine.
- iTaylor (Skill/Superpower Montage): phone-as-self metaphor — each feature = an attribute — risky but works because voice is consistent.
- Horror Stories (I Love / Career Montage): passion for Stephen King → writing horror → using horror for social commentary.
- Kombucha Club (Uncommon Extracurricular Montage): scientific precision + creative spontaneity reconciled through fermentation + photography.
- Porcelain God / iTaylor / Parents' Relationship (Narrative Challenge): single experience (allergy attack, parents' fracture) → long reflection on what it remade.`;

// Compact inline reference for prompts that only need the rules, not the examples.
export const ACTIVITY_RUBRIC_COMPACT = `Common App activity description rubric (150 chars max per entry):
- Lead with a precise ACTION VERB from the bank — Achievement (earned/founded/expanded), Help-Teach (coached/tutored/mentored), Lead-Manage (directed/chaired/recruited), Communication (wrote/presented/negotiated), Plan-Organize (organized/scheduled/consolidated), Creative (authored/devised/launched), Research-Analytical (investigated/analyzed/measured), Financial (budgeted/forecasted), Technical (built/engineered/programmed). NEVER "Was involved in", "Helped with", "Responsible for".
- Passion activities without awards still work — lead with "Self-taught…", "Composed…", "Performed…" — as long as you pack 2-3 distinct outcomes. Example: "Self-taught via YouTube videos; played drums at community meetings for worker rights awareness; helped my sister become proficient."
- Pack 3-4 outcomes joined with semicolons. Quantify everything (numbers, $, rankings, attendees, hours, years).
- Cite awards with level specificity ("1st nationwide '17", "State Semi-Finalists '15", "ISEF 2nd Place").
- Use "w/", "&", "nat'l", "intl", "comp", "VP", "Sec", "yrs", "ppl", "schl" to save chars. Never casual text-speak.
- Categories (pick the most specific): Research, Internship, Social Justice, Family Responsibilities, Work (Paid), Computer/Technology, Science/Math, Debate/Speech, Music Instrumental, Music Vocal, Athletics: JV/Varsity, Athletics: Club, Community Service, Student Govt./Politics, Cultural, Religious, Theater/Drama, Dance, Art, Environmental, Foreign Exchange, Journalism/Publication, Other Club/Activity.
- Do NOT invent activities the student didn't mention. Empty slots are fine.`;

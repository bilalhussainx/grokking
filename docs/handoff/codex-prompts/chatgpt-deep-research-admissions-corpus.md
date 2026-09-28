**PASTE INTO CHATGPT DEEP RESEARCH** (or Codex with web access). One run per part is best: run Part 1, then Part 2 and so on, each as its own Deep Research task. Save each result as a file and give it to Claude Code.

---

You are building a **sourced research corpus** for KairosLearn, an AI college-admissions counselor for students in grades 9–12 and transfer students applying to US, UK and Canadian universities. The output trains an AI counselor through **retrieval and evaluation, not model fine-tuning**. So every item must be accurate, current for the 2026–27 admissions cycle, and **cited to the source you actually read, with its URL and access date**. If you can't verify something, write `UNVERIFIED` and name the source that would settle it. Never invent quotes, numbers, deadlines or review counts. Prefer official sources: university admissions and financial-aid pages, commonapp.org, studentaid.gov, collegeboard.org, ucas.com, ouac.on.ca, provincial aid sites, and NACAC/IECA/HECA publications.

## Part 1: Competitors and what students say

Cover these:
- AI admissions tools: CollegeVine (Sage), Kollegio, Kolly, KapAdvisor (Kaplan), Scoir, Crimson Education's student tools, Common App's guidance tools, Naviance/PowerSchool AI features.
- Any AI admissions agent launched in 2025–26.
- Human firms: Crimson Education, InGenius Prep, Command Education, College Coach (Bright Horizons), and two well-reviewed independent consultants.

For each, give:
- the offer and price;
- the AI features, noting which are agentic (live search, memory, taking actions);
- the **top positive themes** with 2–3 verbatim quotes and source URLs;
- the **top negative themes** in the same form;
- where it is weak for: low-income or first-generation students, international students, UK/Canada applicants, transfer students, and shy students who don't ask for help.

Output: a markdown table plus a JSON array `competitors[]` with the fields `name, url, price, features[], agentic_features[], praise[{theme, quote, source_url}], complaints[{theme, quote, source_url}], gaps[]`.

## Part 2: What great counselors actually do

Use professional guidance (NACAC Statement of Principles of Good Practice, IECA and HECA guidance, college admissions-office blogs and publications, and counselor handbooks and books with citations) to describe the behaviours that make a counselor helpful, authoritative and a trusted mentor. Cover:

1. school-list construction (reach, target, likely; affordability first; fit dimensions);
2. timeline and accountability systems;
3. essay coaching technique (questions that surface stories; critique without writing);
4. activities and honors presentation;
5. recommendation strategy;
6. testing strategy under test-optional policies;
7. financial aid and merit strategy, including appeals;
8. interview preparation;
9. ED/EA/REA/RD strategy and its ethics;
10. waitlist and deferral strategy;
11. supporting shy, anxious, overwhelmed, over-committed and highly organized students;
12. parent communication, including families who don't speak English.

For each, give concrete **dos and don'ts** with sources, and one **example exchange** that shows good coaching behaviour. The student writes; the counselor asks and advises.

Output: markdown, plus JSON `playbook[]` with the fields `topic, practice, rationale, do[], dont[], example_exchange, sources[{title, url, publisher, accessed}]`.

## Part 3: Official rules for the 2026–27 cycle, per system

Give a structured record for each of these:
- **US, the top 50 national universities** (US News 2026 or the latest list; name the list you used). For each: application platforms accepted, ED/EA/REA/RD deadlines for fall 2027 entry (or "not yet published" plus the last cycle's dates, labelled as such), test policy, supplemental essay count, interview policy, CSS Profile required (y/n), meets full need (y/n), need-blind for international students (y/n), net price calculator URL, and financial-aid deadline.
- **UC system:** the UC application, the personal insight questions, dates, and the transfer (TAG) rules.
- **UK:** the UCAS timeline, the 2026-entry personal statement format change, Oxford and Cambridge plus medicine, dentistry and veterinary deadlines, admissions tests currently in use, and predicted grades.
- **Canada:** the OUAC Undergraduate application (Group A/B; the 101/105 forms were retired for 2026–27), Ontario program supplements for the top programs, the BC/Alberta/Québec application systems, grade conversion guidance for international and US students, and OSAP basics.
- **Transfer:** Common App for Transfer, typical credit evaluation practice, and articulation agreements. Use official examples only.

Output: JSON `institutions[]` and `systems[]`, with **every field carrying `source_url` and `accessed`**. No unsourced fields.

## Part 4: Golden-set test problems

Write **120 test problems** a real student might ask, spread across grades 9, 10, 11, 12-fall, 12-spring and transfer; across US, UK and Canada; and across these task families: aid, deadlines and requirements, school list, essays (critique only), recommendations, testing, interviews, waitlists and appeals, international, and emotional support. For each, give:

- `question`;
- `student_context` (grade, country, a key fact);
- `correct_answer_or_behavior`;
- `official_source_url`;
- `bad_answer_examples[]`;
- `must_abstain_if`;
- `task_family`.

At least **20** must be refuse-or-abstain cases:
- "write my essay";
- "what are my chances at Harvard";
- a deadline not yet published for the cycle;
- "log into my Common App for me";
- medical or legal advice;
- anything asking the AI to claim a human counselor's results.

Output: JSON `golden_set[]`.

## Part 5: Data sources and access terms

Cover College Scorecard API, IPEDS, the Common Data Set, college net price calculators, studentaid.gov data, the CSS Profile school list, UCAS data services, OUAC, and OSAP. For each: what it contains, access method (API, bulk download or page only), licence and terms (**does it allow automated access?**), update cadence, and the fields useful to a counselor agent. Flag any source whose terms forbid scraping. Known already: College Board, Common App, UCAS web pages and OUAC restrict automated access. Confirm this and look for sanctioned alternatives (APIs, data services, permission contacts).

Output: markdown table plus JSON `data_sources[]`.

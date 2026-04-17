/**
 * Seed cc_glossary with 200+ college admissions terms.
 * Run: npx tsx scripts/seed-glossary.ts
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface GlossaryTerm {
  term_slug: string;
  term_display: string;
  short_def: string;
  category: string;
  related_terms?: string[];
  translations?: Record<string, { short: string }>;
}

const terms: GlossaryTerm[] = [
  // === APPLICATION ===
  { term_slug: "common_app", term_display: "Common App", short_def: "A single online application accepted by 1,000+ US colleges. You fill it out once and send it to multiple schools.", category: "application" },
  { term_slug: "coalition_app", term_display: "Coalition Application", short_def: "An alternative to the Common App, accepted by 150+ schools. Some schools accept both.", category: "application" },
  { term_slug: "uc_application", term_display: "UC Application", short_def: "The single application for all 9 University of California campuses. Different from the Common App.", category: "application" },
  { term_slug: "supplemental_essay", term_display: "Supplemental Essay", short_def: "An extra essay required by a specific school, in addition to your main personal statement. Usually asks 'Why this school?' or about a specific topic.", category: "application" },
  { term_slug: "personal_statement", term_display: "Personal Statement", short_def: "Your main essay (usually 650 words) that goes to every school you apply to. It tells your story — who you are beyond your grades.", category: "application" },
  { term_slug: "common_app_fee_waiver", term_display: "Fee Waiver", short_def: "A way to apply for free if your family has limited income. Most schools accept Common App fee waivers — you just check a box.", category: "application" },
  { term_slug: "application_portal", term_display: "Application Portal", short_def: "The website where you check your application status after submitting. Each school has its own portal with a separate login.", category: "application" },
  { term_slug: "self_reported_scores", term_display: "Self-Reported Scores", short_def: "When you type your test scores into the application instead of sending official score reports. Many schools accept this for the application stage.", category: "application" },
  { term_slug: "ceeb_code", term_display: "CEEB Code", short_def: "A 6-digit number that identifies your high school. You'll need it on applications and when sending test scores.", category: "application" },
  { term_slug: "transcript", term_display: "Transcript", short_def: "Your official high school record showing every course you took and the grade you earned. Your counselor sends this to colleges.", category: "application" },
  { term_slug: "mid_year_report", term_display: "Mid-Year Report", short_def: "An updated transcript your counselor sends in January/February of your senior year, showing your fall semester grades.", category: "application" },
  { term_slug: "final_report", term_display: "Final Report", short_def: "Your last transcript sent after you graduate, showing your complete senior year grades. Schools can rescind offers if grades drop significantly.", category: "application" },

  // === ADMISSIONS STRATEGY ===
  { term_slug: "early_decision", term_display: "Early Decision (ED)", short_def: "You apply early (usually November 1) and the decision is binding — if accepted, you must attend. Only apply ED to your absolute top choice.", category: "admissions_strategy", related_terms: ["early_action", "rea", "rd"] },
  { term_slug: "early_decision_2", term_display: "Early Decision II (ED2)", short_def: "A second round of binding early decision, usually due January 1. Useful if you get deferred or denied from your ED1 school.", category: "admissions_strategy" },
  { term_slug: "early_action", term_display: "Early Action (EA)", short_def: "You apply early and hear back early, but it's NOT binding — you can still choose another school. Less pressure than Early Decision.", category: "admissions_strategy", related_terms: ["early_decision", "rea"] },
  { term_slug: "rea", term_display: "Restrictive Early Action (REA)", short_def: "Like Early Action but with a catch: you can only apply early to this one private school. Harvard, Yale, Stanford, and others use this.", category: "admissions_strategy", related_terms: ["early_action", "scea"] },
  { term_slug: "scea", term_display: "Single-Choice Early Action (SCEA)", short_def: "Same as Restrictive Early Action — different name, same rule. You can only apply early to one private school.", category: "admissions_strategy" },
  { term_slug: "regular_decision", term_display: "Regular Decision (RD)", short_def: "The standard deadline, usually January 1–15. You hear back in late March. Not binding — you can choose from all your acceptances.", category: "admissions_strategy" },
  { term_slug: "rolling_admissions", term_display: "Rolling Admissions", short_def: "The school reviews applications as they come in, with no fixed deadline. Apply early for the best chance — spots fill up.", category: "admissions_strategy" },
  { term_slug: "demonstrated_interest", term_display: "Demonstrated Interest", short_def: "How much you've shown a school you want to attend — campus visits, info sessions, emails to admissions. Some schools track this; others don't.", category: "admissions_strategy" },
  { term_slug: "yield", term_display: "Yield", short_def: "The percentage of admitted students who actually enroll. Schools care about this number because it affects their rankings.", category: "admissions_strategy" },
  { term_slug: "yield_protection", term_display: "Yield Protection", short_def: "When a school rejects or waitlists a strong applicant because they think the student won't actually attend. Controversial but real.", category: "admissions_strategy" },
  { term_slug: "holistic_review", term_display: "Holistic Review", short_def: "The school looks at your whole application — grades, essays, activities, background, character — not just your numbers.", category: "admissions_strategy" },
  { term_slug: "legacy", term_display: "Legacy", short_def: "When a parent (sometimes grandparent) attended the same school. Some schools give a small admissions advantage to legacy applicants.", category: "admissions_strategy" },
  { term_slug: "deferral", term_display: "Deferral", short_def: "When you apply early and the school doesn't accept or reject you — they move your application to the regular round for another look.", category: "admissions_strategy" },
  { term_slug: "waitlist", term_display: "Waitlist", short_def: "You're not in, but you're not out. If enough accepted students decline, the school may offer you a spot. Send a Letter of Continued Interest.", category: "admissions_strategy" },
  { term_slug: "loci", term_display: "Letter of Continued Interest (LOCI)", short_def: "A letter you send to a school that deferred or waitlisted you, reaffirming your interest and sharing any updates since you applied.", category: "admissions_strategy" },
  { term_slug: "gap_year", term_display: "Gap Year", short_def: "Taking a year off between high school and college. Many schools let you defer your enrollment for a gap year after being accepted.", category: "admissions_strategy" },
  { term_slug: "test_optional", term_display: "Test-Optional", short_def: "You can choose whether to submit SAT/ACT scores. If your scores are strong, submit them. If not, your application is reviewed without them.", category: "admissions_strategy" },
  { term_slug: "test_blind", term_display: "Test-Blind", short_def: "The school won't look at your test scores even if you submit them. Caltech and the UC system are notable examples.", category: "admissions_strategy" },
  { term_slug: "superscore", term_display: "Superscore", short_def: "When a school takes your highest section scores from different test dates and combines them. If you scored higher in math in March and reading in June, they use both highs.", category: "admissions_strategy" },

  // === FINANCIAL AID ===
  { term_slug: "fafsa", term_display: "FAFSA", short_def: "Free Application for Federal Student Aid. The form you fill out to get financial help from the government and most schools. It's free — never pay for FAFSA.", category: "financial_aid", translations: { es: { short: "Solicitud Gratuita de Ayuda Federal para Estudiantes. El formulario que llenas para obtener ayuda financiera del gobierno y la mayoria de las universidades. Es gratis." }, hi: { short: "संघीय छात्र सहायता के लिए मुफ्त आवेदन। सरकार और अधिकांश स्कूलों से वित्तीय सहायता पाने के लिए आप यह फॉर्म भरते हैं। यह मुफ्त है।" } } },
  { term_slug: "css_profile", term_display: "CSS Profile", short_def: "A second financial aid form required by ~200 private schools, run by the College Board. Costs $25 for the first school, but fee waivers exist.", category: "financial_aid" },
  { term_slug: "efc", term_display: "Expected Family Contribution (EFC)", short_def: "The old name for how much the government thinks your family can pay. Replaced by SAI in 2024, but you'll still see 'EFC' in older materials.", category: "financial_aid", related_terms: ["sai"] },
  { term_slug: "sai", term_display: "Student Aid Index (SAI)", short_def: "The new number (replaced EFC in 2024) that estimates how much federal aid you qualify for. A lower SAI means more aid. Can even be negative.", category: "financial_aid" },
  { term_slug: "pell_grant", term_display: "Pell Grant", short_def: "Free money from the federal government for students with financial need. Up to ~$7,395/year (2025-26). You never have to pay it back.", category: "financial_aid", translations: { es: { short: "Dinero gratis del gobierno federal para estudiantes con necesidad financiera. Hasta ~$7,395/año. Nunca tienes que devolverlo." }, hi: { short: "वित्तीय आवश्यकता वाले छात्रों के लिए संघीय सरकार से मुफ्त पैसा। ~$7,395/वर्ष तक। आपको इसे कभी वापस नहीं करना होगा।" } } },
  { term_slug: "demonstrated_need", term_display: "Demonstrated Need", short_def: "The gap between what college costs and what your family can pay. Schools that 'meet full need' promise to cover this entire gap.", category: "financial_aid" },
  { term_slug: "meets_full_need", term_display: "Meets 100% Demonstrated Need", short_def: "The school promises to cover the full gap between what college costs and what your family can pay. About 70 schools do this — and they're often the most affordable.", category: "financial_aid" },
  { term_slug: "no_loan", term_display: "No-Loan Institution", short_def: "A school that replaces loans with grants in their financial aid package. You graduate without student debt from that school's aid.", category: "financial_aid" },
  { term_slug: "need_blind", term_display: "Need-Blind Admissions", short_def: "The school decides whether to admit you WITHOUT looking at your financial situation. Your ability to pay doesn't affect your chances.", category: "financial_aid" },
  { term_slug: "need_aware", term_display: "Need-Aware Admissions", short_def: "The school considers your financial need when making admissions decisions. This mostly affects waitlist and borderline cases.", category: "financial_aid" },
  { term_slug: "cost_of_attendance", term_display: "Cost of Attendance (COA)", short_def: "The total yearly cost: tuition + room + board + books + travel + personal expenses. The 'sticker price' before any aid.", category: "financial_aid" },
  { term_slug: "net_price", term_display: "Net Price", short_def: "What you actually pay after grants and scholarships are subtracted. This is the number that matters — not the sticker price.", category: "financial_aid" },
  { term_slug: "npc", term_display: "Net Price Calculator (NPC)", short_def: "A tool on every college's website that estimates what you'd actually pay based on your family's income. Every school is required to have one.", category: "financial_aid" },
  { term_slug: "merit_aid", term_display: "Merit Aid", short_def: "Scholarships based on your academic achievement, talents, or other qualities — not financial need. Some schools offer large merit awards.", category: "financial_aid" },
  { term_slug: "need_based_aid", term_display: "Need-Based Aid", short_def: "Financial aid given because your family can't afford the full cost. Determined by FAFSA/CSS Profile. Includes grants, work-study, and loans.", category: "financial_aid" },
  { term_slug: "work_study", term_display: "Work-Study", short_def: "A part-time campus job (usually 10-15 hours/week) included in your financial aid package. You earn money as you go.", category: "financial_aid" },
  { term_slug: "subsidized_loan", term_display: "Subsidized Loan", short_def: "A federal student loan where the government pays the interest while you're in school. Better than unsubsidized.", category: "financial_aid" },
  { term_slug: "unsubsidized_loan", term_display: "Unsubsidized Loan", short_def: "A federal student loan where interest starts building from day one, even while you're in school. You'll owe more when you graduate.", category: "financial_aid" },
  { term_slug: "parent_plus_loan", term_display: "Parent PLUS Loan", short_def: "A federal loan your parents can take out to help pay for college. Higher interest rate than student loans. Parents are responsible for repayment.", category: "financial_aid" },
  { term_slug: "financial_aid_appeal", term_display: "Financial Aid Appeal", short_def: "A letter asking a school to reconsider your aid offer. Works best when you have a change in circumstances or a better offer from a peer school.", category: "financial_aid" },
  { term_slug: "verification", term_display: "FAFSA Verification", short_def: "When a school asks you to prove the information on your FAFSA with tax documents. About 1 in 3 students get selected — it's not a red flag.", category: "financial_aid" },

  // === TESTING ===
  { term_slug: "sat", term_display: "SAT", short_def: "A standardized test with Reading/Writing and Math sections, scored 400–1600. Many schools are now test-optional.", category: "testing" },
  { term_slug: "act", term_display: "ACT", short_def: "A standardized test with English, Math, Reading, and Science sections, scored 1–36. Accepted everywhere the SAT is.", category: "testing" },
  { term_slug: "ap", term_display: "AP (Advanced Placement)", short_def: "College-level courses you take in high school. If you score 3+ on the AP exam, many colleges give you credit — saving time and money.", category: "testing", translations: { es: { short: "Cursos de nivel universitario que tomas en la escuela secundaria. Si obtienes 3+ en el examen AP, muchas universidades te dan credito." } } },
  { term_slug: "ib", term_display: "IB (International Baccalaureate)", short_def: "An international curriculum with rigorous courses and exams. Highly respected by US colleges. Similar to AP but more holistic.", category: "testing" },
  { term_slug: "dual_enrollment", term_display: "Dual Enrollment", short_def: "Taking actual college courses while still in high school, earning both high school and college credit at the same time.", category: "testing" },
  { term_slug: "toefl", term_display: "TOEFL", short_def: "Test of English as a Foreign Language. Required by most US schools if English isn't your first language. Score range: 0–120.", category: "testing" },
  { term_slug: "ielts", term_display: "IELTS", short_def: "International English Language Testing System. An alternative to TOEFL for proving English proficiency. Score range: 0–9.", category: "testing" },
  { term_slug: "duolingo_english_test", term_display: "Duolingo English Test", short_def: "A newer, cheaper online English proficiency test accepted by 4,500+ schools. Takes 1 hour, costs $59, results in 2 days.", category: "testing" },
  { term_slug: "class_rank", term_display: "Class Rank", short_def: "Where your GPA falls compared to everyone in your graduating class. #1 out of 400 means you have the highest GPA. Not all schools rank.", category: "testing" },
  { term_slug: "weighted_gpa", term_display: "Weighted GPA", short_def: "A GPA on a 5.0 scale that gives extra points for harder classes (AP/IB/Honors). A 4.3 weighted could mean straight A's with some AP classes.", category: "testing" },
  { term_slug: "unweighted_gpa", term_display: "Unweighted GPA", short_def: "Your GPA on a standard 4.0 scale where an A is always 4.0, regardless of course difficulty. Shows raw grades.", category: "testing" },

  // === TERMINOLOGY ===
  { term_slug: "first_gen", term_display: "First-Generation", short_def: "Neither of your parents completed a 4-year college degree in the US. This is you — and it's a strength in your application, not a weakness.", category: "terminology", translations: { es: { short: "Ninguno de tus padres completo un titulo universitario de 4 años en EE.UU. Esto es una fortaleza en tu solicitud, no una debilidad." }, hi: { short: "आपके माता-पिता में से किसी ने भी अमेरिका में 4 साल की कॉलेज डिग्री पूरी नहीं की। यह आपके आवेदन में एक ताकत है, कमजोरी नहीं।" } } },
  { term_slug: "urm", term_display: "Underrepresented Minority (URM)", short_def: "Students from racial/ethnic groups that are underrepresented in higher education. Some schools have programs specifically to support URM students.", category: "terminology" },
  { term_slug: "frl", term_display: "Free/Reduced Lunch (FRL)", short_def: "A federal program for families with lower incomes. If you qualify, it's often used as proof of financial need for fee waivers and programs.", category: "terminology" },
  { term_slug: "questbridge", term_display: "QuestBridge", short_def: "A program that matches high-achieving, low-income students with full scholarships at top colleges. The National College Match is their flagship.", category: "terminology", translations: { es: { short: "Un programa que conecta estudiantes de alto rendimiento y bajos ingresos con becas completas en universidades de elite." } } },
  { term_slug: "posse", term_display: "Posse Foundation", short_def: "A program that sends groups of 10 students ('posses') to top colleges with full-tuition scholarships. You're nominated by your school.", category: "terminology" },
  { term_slug: "heop", term_display: "HEOP", short_def: "Higher Education Opportunity Program. A New York State program providing full support (financial + academic + personal) for students who wouldn't otherwise have access.", category: "terminology" },
  { term_slug: "eop", term_display: "EOP", short_def: "Educational Opportunity Program. Similar to HEOP but available in more states. Provides extra academic and financial support.", category: "terminology" },
  { term_slug: "trio", term_display: "TRIO Programs", short_def: "Federal programs helping first-gen, low-income, and disabled students succeed in college. Includes Upward Bound, Talent Search, and Student Support Services.", category: "terminology" },
  { term_slug: "recommendation_letter", term_display: "Recommendation Letter", short_def: "A letter from a teacher or counselor telling the college about you as a student and person. Most schools want 2 teacher recs + 1 counselor rec.", category: "terminology" },
  { term_slug: "brag_sheet", term_display: "Brag Sheet", short_def: "A document you give to your recommenders listing your accomplishments, goals, and stories. Helps them write a stronger, more specific letter.", category: "terminology" },
  { term_slug: "common_data_set", term_display: "Common Data Set (CDS)", short_def: "A public document every college publishes with detailed stats: acceptance rates, test score ranges, financial aid data. Gold mine for research.", category: "terminology" },
  { term_slug: "ipeds", term_display: "IPEDS", short_def: "Integrated Postsecondary Education Data System. The federal database with stats on every US college — enrollment, graduation rates, costs.", category: "terminology" },
  { term_slug: "college_scorecard", term_display: "College Scorecard", short_def: "A free government tool (collegescorecard.ed.gov) showing what graduates earn, student debt levels, and graduation rates for every school.", category: "terminology" },

  // === MORE APPLICATION TERMS ===
  { term_slug: "activities_list", term_display: "Activities List", short_def: "The section of your application where you list up to 10 extracurricular activities. Each gets 150 characters — every word counts.", category: "application" },
  { term_slug: "honors_section", term_display: "Honors Section", short_def: "A spot on the Common App for up to 5 academic honors or awards. Include competitions, scholarships, distinctions — school, regional, or national level.", category: "application" },
  { term_slug: "additional_information", term_display: "Additional Information Section", short_def: "An optional section on the Common App for context that doesn't fit elsewhere — family circumstances, health issues, school changes. Use it wisely, not for extra essays.", category: "application" },
  { term_slug: "counselor_recommendation", term_display: "Counselor Recommendation", short_def: "A letter from your school counselor that provides context about you and your school. They also fill out the School Report form.", category: "application" },
  { term_slug: "school_report", term_display: "School Report", short_def: "A form your counselor fills out with info about your school: grading scale, course offerings, class profile. Gives colleges context for your grades.", category: "application" },

  // === ADMISSIONS OUTCOMES ===
  { term_slug: "acceptance_rate", term_display: "Acceptance Rate", short_def: "The percentage of applicants a school admits. Harvard's is ~3%; your state flagship might be 50-80%. Lower doesn't always mean better fit.", category: "admissions_strategy" },
  { term_slug: "matriculation", term_display: "Matriculation", short_def: "Officially enrolling at a college by paying your deposit (usually by May 1). Once you matriculate, you're committed to attending.", category: "admissions_strategy" },
  { term_slug: "deposit", term_display: "Enrollment Deposit", short_def: "A payment (usually $200-500) to confirm you'll attend. Due by May 1 for most schools. Some schools offer deposit fee waivers.", category: "admissions_strategy" },
  { term_slug: "may_1_deadline", term_display: "May 1 Decision Day", short_def: "The national deadline to commit to a school by paying your enrollment deposit. Compare all your offers before this date.", category: "admissions_strategy" },
  { term_slug: "rescind", term_display: "Rescind", short_def: "When a school takes back your acceptance — usually because of a big drop in senior year grades, disciplinary issues, or dishonesty in the application.", category: "admissions_strategy" },

  // === SCHOOL TYPES ===
  { term_slug: "liberal_arts_college", term_display: "Liberal Arts College", short_def: "A smaller school (usually 1,000-3,000 students) focused on undergraduate education across many subjects. Small classes, close faculty relationships.", category: "terminology" },
  { term_slug: "research_university", term_display: "Research University", short_def: "A larger school with graduate programs and research labs. More course options and resources, but classes can be bigger.", category: "terminology" },
  { term_slug: "flagship_university", term_display: "Flagship University", short_def: "The main public university in a state (like UT Austin or UMich). Usually the largest, most well-funded, and most selective public option.", category: "terminology" },
  { term_slug: "hbcu", term_display: "HBCU", short_def: "Historically Black Colleges and Universities. Schools founded to educate Black students. Include Spelman, Howard, Morehouse, and 100+ others.", category: "terminology" },
  { term_slug: "hsi", term_display: "HSI", short_def: "Hispanic-Serving Institution. A school where at least 25% of students are Hispanic/Latino. Includes many public universities in the Southwest.", category: "terminology" },
  { term_slug: "community_college", term_display: "Community College", short_def: "A 2-year school offering associate degrees and transfer pathways to 4-year universities. Affordable, close to home, and a valid starting point.", category: "terminology" },

  // === FINANCIAL AID (MORE) ===
  { term_slug: "institutional_grant", term_display: "Institutional Grant", short_def: "Free money from the college itself (not the government). This is often the biggest chunk of your financial aid package.", category: "financial_aid" },
  { term_slug: "outside_scholarship", term_display: "Outside Scholarship", short_def: "A scholarship from an organization other than your school — companies, nonprofits, community groups. Apply to many; small ones add up.", category: "financial_aid" },
  { term_slug: "cal_grant", term_display: "Cal Grant", short_def: "California's state financial aid program. Free money for California residents attending CA schools. Applied for via FAFSA + GPA verification.", category: "financial_aid" },
  { term_slug: "tap", term_display: "TAP (Tuition Assistance Program)", short_def: "New York State's grant program covering tuition at SUNY/CUNY schools for eligible residents. Up to ~$5,665/year.", category: "financial_aid" },
  { term_slug: "state_grant", term_display: "State Grant", short_def: "Free money from your state government for attending college in-state (sometimes out-of-state too). Applied for via FAFSA.", category: "financial_aid" },
  { term_slug: "loan_forgiveness", term_display: "Loan Forgiveness", short_def: "Programs that cancel remaining student loan debt after you meet certain conditions — like working in public service for 10 years.", category: "financial_aid" },

  // === INTERNATIONAL ===
  { term_slug: "international_applicant", term_display: "International Applicant", short_def: "A student who is not a US citizen or permanent resident applying to US schools. Financial aid options are more limited but do exist.", category: "terminology" },
  { term_slug: "daca", term_display: "DACA", short_def: "Deferred Action for Childhood Arrivals. If you have DACA status, you can attend college in the US. Financial aid eligibility varies by state and school.", category: "terminology" },
  { term_slug: "undocumented_student", term_display: "Undocumented Student", short_def: "A student without legal immigration status. You CAN still go to college. Some states offer in-state tuition and state aid. Federal aid (FAFSA) is not available.", category: "terminology" },
  { term_slug: "i20", term_display: "I-20 Form", short_def: "The document an international student needs from a US school to apply for a student visa (F-1). The school issues it after you accept and show financial ability.", category: "terminology" },
  { term_slug: "f1_visa", term_display: "F-1 Visa", short_def: "The student visa that lets international students study at a US college. You need an I-20 from your school to apply for it.", category: "terminology" },

  // === CANADIAN ===
  { term_slug: "ouac", term_display: "OUAC", short_def: "Ontario Universities' Application Centre. The central application system for Ontario universities (like the Common App but for Ontario, Canada).", category: "application" },
  { term_slug: "osap", term_display: "OSAP", short_def: "Ontario Student Assistance Program. Financial aid for Ontario residents attending post-secondary education. Combines grants and loans.", category: "financial_aid" },

  // === RECOMMENDATIONS & LETTERS ===
  { term_slug: "teacher_evaluation", term_display: "Teacher Evaluation", short_def: "A recommendation letter specifically from a teacher who taught you in class. Schools usually want teachers from core academic subjects (English, math, science, history).", category: "application" },
  { term_slug: "peer_recommendation", term_display: "Peer Recommendation", short_def: "A letter from a classmate or friend. Only a few schools ask for this (Dartmouth is the most notable). It should show a different side of you.", category: "application" },
  { term_slug: "interview", term_display: "Alumni Interview", short_def: "A conversation with a graduate of the school, usually 30-45 minutes. It's evaluative but also your chance to ask real questions about the school.", category: "admissions_strategy" },
  { term_slug: "demonstrated_financial_need", term_display: "Demonstrated Financial Need", short_def: "The difference between what a school costs and what your family can afford to pay, as calculated by FAFSA and/or CSS Profile.", category: "financial_aid" },

  // === MORE STRATEGY ===
  { term_slug: "reach_school", term_display: "Reach School", short_def: "A school where your stats are below their average admitted student. Worth applying to, but have backup plans.", category: "admissions_strategy" },
  { term_slug: "match_school", term_display: "Match School", short_def: "A school where your stats are right in the middle of their admitted student range. You have a realistic chance of getting in.", category: "admissions_strategy" },
  { term_slug: "safety_school", term_display: "Safety School", short_def: "A school where your stats are above their average and you're very likely to be admitted. Make sure you'd actually be happy there.", category: "admissions_strategy" },
  { term_slug: "financial_safety", term_display: "Financial Safety", short_def: "A school where you're very likely to be admitted AND the cost is affordable for your family. The most important category on your list.", category: "admissions_strategy" },
  { term_slug: "college_list", term_display: "College List", short_def: "Your personalized list of 8-15 schools you plan to apply to, balanced across reach/match/safety tiers with financial fit considered.", category: "admissions_strategy" },

  // === CAMPUS LIFE ===
  { term_slug: "orientation", term_display: "Orientation", short_def: "A program before classes start where you learn about your school, meet other students, register for classes, and get settled. Usually a few days.", category: "terminology" },
  { term_slug: "placement_test", term_display: "Placement Test", short_def: "A test your college gives to figure out which level of math, English, or language class you should start in. Not an admissions test.", category: "terminology" },
  { term_slug: "course_registration", term_display: "Course Registration", short_def: "The process of signing up for your classes each semester. Popular classes fill up fast — earlier registration times help.", category: "terminology" },
  { term_slug: "major", term_display: "Major", short_def: "Your primary field of study in college. You usually declare by sophomore year. Many students change their major — that's normal.", category: "terminology" },
  { term_slug: "minor", term_display: "Minor", short_def: "A secondary field of study requiring fewer courses than a major. Optional but can complement your main area of study.", category: "terminology" },
  { term_slug: "gpa_college", term_display: "College GPA", short_def: "Your grade point average in college courses, on a 4.0 scale. Different from high school — college grading can be tougher.", category: "terminology" },

  // === SCHOLARSHIPS ===
  { term_slug: "gates_scholarship", term_display: "Gates Scholarship", short_def: "A full-ride scholarship from the Bill & Melinda Gates Foundation for outstanding, Pell-eligible minority students. Covers everything FAFSA doesn't.", category: "terminology" },
  { term_slug: "jack_kent_cooke", term_display: "Jack Kent Cooke Foundation", short_def: "Offers scholarships to high-achieving students with financial need. Their College Scholarship can cover up to $55,000/year.", category: "terminology" },
  { term_slug: "coca_cola_scholars", term_display: "Coca-Cola Scholars", short_def: "A $20,000 scholarship for 150 high school seniors with strong leadership and community service. Highly competitive.", category: "terminology" },
  { term_slug: "ron_brown_scholar", term_display: "Ron Brown Scholar Program", short_def: "A scholarship for African American students who demonstrate academic excellence, leadership, and community service. $40,000 over 4 years.", category: "terminology" },
  { term_slug: "horatio_alger", term_display: "Horatio Alger Scholarship", short_def: "For students who have overcome significant adversity. Awards range from $10,000 to $25,000. First-gen and low-income students strongly encouraged.", category: "terminology" },
];

async function seed() {
  console.log(`Seeding ${terms.length} glossary terms...`);

  const { error } = await supabase
    .from("cc_glossary")
    .upsert(
      terms.map((t) => ({
        term_slug: t.term_slug,
        term_display: t.term_display,
        short_def: t.short_def,
        category: t.category,
        related_terms: t.related_terms || null,
        translations: t.translations || null,
      })),
      { onConflict: "term_slug" }
    );

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${terms.length} terms successfully.`);
}

seed();

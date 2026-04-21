/**
 * 2025-2026 supplement essay prompts — placeholder data for seed.
 *
 * IMPORTANT: Prompts are sourced from publicly documented 2025-2026
 * Common App / Coalition / school-specific applications as of compile
 * time. Schools may revise wording, word limits, or required status
 * between compilation and the applicant's deadline. The UI renders a
 * "Verify on school site" badge that links to `source_url` so students
 * can confirm current wording before drafting.
 *
 * Schema matches supabase/migrations/20260420_school_supplements.sql
 *   supplement_type: 'why_us' | 'community' | 'identity' | 'short_answer'
 *                    | 'creative' | 'academic' | 'activity' | 'other'
 *   category:        free-form label shown as a chip in the UI
 */

export interface SupplementSeed {
  prompt_text: string;
  word_limit: number | null;
  is_required: boolean;
  supplement_type: string;
  category: string;
  sort_order: number;
}

export interface SchoolSupplementPack {
  school_name: string; // must match cc_schools.name exactly
  source_url: string;
  academic_year: string; // "2025-2026"
  supplements: SupplementSeed[];
  // Optional stub fields — used by scripts/seed-supplements.ts to insert a
  // minimal cc_schools row when the school isn't present yet (mostly top
  // LACs that the IPEDS/Scorecard seed missed). No-op if the school exists.
  stub?: {
    city: string;
    state: string;
    country?: string;
    institution_type?: string;
  };
}

const YEAR = "2025-2026";

export const SUPPLEMENT_PACKS: SchoolSupplementPack[] = [
  // ------------------------ IVY / TOP PRIVATE ------------------------
  {
    school_name: "Harvard University",
    source_url: "https://college.harvard.edu/admissions/apply/first-year-applicants",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Harvard has long recognized the importance of enrolling a diverse student body. How will the life experiences that shape who you are today enable you to contribute to Harvard?",
        word_limit: 150,
        is_required: true,
        supplement_type: "identity",
        category: "Life Experience",
        sort_order: 1,
      },
      {
        prompt_text:
          "Briefly describe an intellectual experience that was important to you.",
        word_limit: 150,
        is_required: true,
        supplement_type: "academic",
        category: "Intellectual Experience",
        sort_order: 2,
      },
      {
        prompt_text:
          "Briefly describe any of your extracurricular activities, employment experience, travel, or family responsibilities that have shaped who you are.",
        word_limit: 150,
        is_required: true,
        supplement_type: "activity",
        category: "Activities",
        sort_order: 3,
      },
      {
        prompt_text:
          "How do you hope to use your Harvard education in the future?",
        word_limit: 150,
        is_required: true,
        supplement_type: "why_us",
        category: "Goals",
        sort_order: 4,
      },
      {
        prompt_text:
          "Top three things your roommates might like to know about you.",
        word_limit: 150,
        is_required: true,
        supplement_type: "short_answer",
        category: "Roommate",
        sort_order: 5,
      },
    ],
  },
  {
    school_name: "Stanford University",
    source_url: "https://admission.stanford.edu/apply/freshman/essays.html",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "The Stanford community is deeply curious and driven to learn in and out of the classroom. Reflect on an idea or experience that makes you genuinely excited about learning.",
        word_limit: 250,
        is_required: true,
        supplement_type: "academic",
        category: "Intellectual Vitality",
        sort_order: 1,
      },
      {
        prompt_text:
          "Virtually all of Stanford's undergraduates live on campus. Write a note to your future roommate that reveals something about you or that will help your roommate — and us — get to know you better.",
        word_limit: 250,
        is_required: true,
        supplement_type: "identity",
        category: "Roommate Letter",
        sort_order: 2,
      },
      {
        prompt_text:
          "Please describe what aspects of your life experiences, interests and character would help you make a distinctive contribution as an undergraduate to Stanford University.",
        word_limit: 250,
        is_required: true,
        supplement_type: "community",
        category: "Contribution",
        sort_order: 3,
      },
    ],
  },
  {
    school_name: "Massachusetts Institute of Technology",
    source_url: "https://mitadmissions.org/apply/firstyear/essays/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "We know you lead a busy life, full of activities, many of which are required of you. Tell us about something you do simply for the pleasure of it.",
        word_limit: 200,
        is_required: true,
        supplement_type: "activity",
        category: "Pleasure Activity",
        sort_order: 1,
      },
      {
        prompt_text:
          "Describe the world you come from (for example, your family, school, community, city, or town). How has that world shaped your dreams and aspirations?",
        word_limit: 225,
        is_required: true,
        supplement_type: "community",
        category: "Your World",
        sort_order: 2,
      },
      {
        prompt_text:
          "MIT brings people with diverse backgrounds and experiences together to better the lives of others. Describe one way you have collaborated with people who are different from you to contribute to your community.",
        word_limit: 225,
        is_required: true,
        supplement_type: "community",
        category: "Collaboration",
        sort_order: 3,
      },
      {
        prompt_text:
          "How did you manage a situation or challenge that you didn't expect? What did you learn from it?",
        word_limit: 225,
        is_required: true,
        supplement_type: "identity",
        category: "Challenge",
        sort_order: 4,
      },
      {
        prompt_text:
          "Why are you drawn to the area(s) of study you indicated earlier in this application? (You can answer even if your plans have changed.)",
        word_limit: 100,
        is_required: true,
        supplement_type: "academic",
        category: "Why Major",
        sort_order: 5,
      },
    ],
  },
  {
    school_name: "Yale University",
    source_url: "https://admissions.yale.edu/essay-topics",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Students at Yale have plenty of time to explore their academic interests before committing to one or more major fields of study. Many students either modify their original academic direction or change their minds entirely. As of this moment, what academic areas seem to fit your interests or goals most comfortably? Please indicate up to three from the list provided.",
        word_limit: null,
        is_required: true,
        supplement_type: "academic",
        category: "Academic Interests (list)",
        sort_order: 1,
      },
      {
        prompt_text:
          "Tell us about a topic or idea that excites you and is related to one or more academic areas you selected above. Why are you drawn to it?",
        word_limit: 200,
        is_required: true,
        supplement_type: "academic",
        category: "Intellectual Excitement",
        sort_order: 2,
      },
      {
        prompt_text:
          "What is it about Yale that has led you to apply?",
        word_limit: 125,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Yale",
        sort_order: 3,
      },
      {
        prompt_text:
          "Reflect on a time you discussed an issue important to you with someone holding an opposing view. Why did you find the experience meaningful?",
        word_limit: 400,
        is_required: true,
        supplement_type: "identity",
        category: "Dialogue",
        sort_order: 4,
      },
    ],
  },
  {
    school_name: "Princeton University",
    source_url: "https://admission.princeton.edu/how-apply/essays-and-short-answer-questions",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "As a research institution that also prides itself on its liberal arts curriculum, Princeton allows students to explore areas across the humanities and the arts, the natural sciences, and the social sciences. What academic areas most pique your curiosity, and how do the programs offered at Princeton suit your particular interests?",
        word_limit: 250,
        is_required: true,
        supplement_type: "academic",
        category: "Academic Interests",
        sort_order: 1,
      },
      {
        prompt_text:
          "Princeton values community and encourages students, faculty, staff and leadership to engage in respectful conversations that can expand their perspectives and challenge their ideas and beliefs. As a prospective member of this community, reflect on how your lived experiences will impact the conversations you will have in the classroom, the dining hall or other campus spaces. What lessons have you learned in life thus far, what will you learn from others, and what do you hope others might learn from you?",
        word_limit: 500,
        is_required: true,
        supplement_type: "community",
        category: "Lived Experience",
        sort_order: 2,
      },
      {
        prompt_text:
          "What is a new skill you would like to learn in college?",
        word_limit: 50,
        is_required: true,
        supplement_type: "short_answer",
        category: "New Skill",
        sort_order: 3,
      },
      {
        prompt_text:
          "What brings you joy?",
        word_limit: 50,
        is_required: true,
        supplement_type: "short_answer",
        category: "Joy",
        sort_order: 4,
      },
      {
        prompt_text:
          "What song represents the soundtrack of your life at this moment?",
        word_limit: 50,
        is_required: true,
        supplement_type: "short_answer",
        category: "Soundtrack",
        sort_order: 5,
      },
    ],
  },
  {
    school_name: "Columbia University in the City of New York",
    source_url: "https://undergrad.admissions.columbia.edu/apply/first-year/application-instructions",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "List a selection of texts, resources and outlets that have contributed to your intellectual development outside of academic courses, including but not limited to books, journals, websites, podcasts, essays, plays, presentations, videos, museums and other content that you enjoy.",
        word_limit: 100,
        is_required: true,
        supplement_type: "academic",
        category: "Intellectual List",
        sort_order: 1,
      },
      {
        prompt_text:
          "A hallmark of the Columbia experience is being able to learn and thrive in an equitable and inclusive community with a wide range of perspectives. Tell us about an aspect of your own perspective, viewpoint or lived experience that is important to you, and describe how it has shaped the way you would learn from and contribute to Columbia's diverse and collaborative community.",
        word_limit: 150,
        is_required: true,
        supplement_type: "community",
        category: "Perspective",
        sort_order: 2,
      },
      {
        prompt_text:
          "In college/university, students are often challenged in ways that go beyond the classroom. Describe a situation where you have learned from a perspective, identity or background that is different from your own.",
        word_limit: 150,
        is_required: true,
        supplement_type: "community",
        category: "Learning From Difference",
        sort_order: 3,
      },
      {
        prompt_text:
          "Why are you interested in attending Columbia University? We encourage you to consider the aspect(s) that you find unique and compelling about Columbia.",
        word_limit: 150,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Columbia",
        sort_order: 4,
      },
      {
        prompt_text:
          "What attracts you to your preferred areas of study at Columbia College or Columbia Engineering?",
        word_limit: 150,
        is_required: true,
        supplement_type: "academic",
        category: "Why Major",
        sort_order: 5,
      },
    ],
  },
  {
    school_name: "University of Pennsylvania",
    source_url: "https://admissions.upenn.edu/how-to-apply/first-year-application-requirements",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Write a short thank-you note to someone you have not yet thanked and would like to acknowledge.",
        word_limit: 200,
        is_required: true,
        supplement_type: "short_answer",
        category: "Thank You",
        sort_order: 1,
      },
      {
        prompt_text:
          "How will you explore community at Penn? Consider how Penn will help shape your perspective, and how your experiences and perspective will help shape Penn.",
        word_limit: 200,
        is_required: true,
        supplement_type: "community",
        category: "Community at Penn",
        sort_order: 2,
      },
      {
        prompt_text:
          "Considering the specific undergraduate school you have selected, describe how you intend to explore your academic and intellectual interests at the University of Pennsylvania.",
        word_limit: 300,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Penn / Why School",
        sort_order: 3,
      },
    ],
  },
  {
    school_name: "Duke University",
    source_url: "https://admissions.duke.edu/apply/essay-topics/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "What is your sense of Duke as a university and a community, and why do you consider it a good match for you? If there's something in particular about our offerings that attracts you, feel free to share that as well.",
        word_limit: 250,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Duke",
        sort_order: 1,
      },
      {
        prompt_text:
          "We believe a wide range of personal perspectives, beliefs, and lived experiences are essential to making Duke a vibrant and meaningful living and learning community. Feel free to share with us anything about yourself that you believe will help us know you better as a person and as a potential member of our community.",
        word_limit: 250,
        is_required: false,
        supplement_type: "identity",
        category: "Perspective (Optional)",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "Northwestern University",
    source_url: "https://admissions.northwestern.edu/apply/first-year/index.html",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "We want to be sure we're considering your application in the context of your personal experiences: What aspects of your background, your identity, or your school, community, and/or household settings have most shaped how you see yourself engaging in Northwestern's community, be it academically, socially, culturally, politically, religiously, or otherwise?",
        word_limit: 300,
        is_required: true,
        supplement_type: "community",
        category: "Community Context",
        sort_order: 1,
      },
      {
        prompt_text:
          "Painting 'The Rock' is a tradition at Northwestern that invites all forms of expression — students promote campus events or extracurricular groups, ask larger questions, celebrate identities and experiences, or simply leave their mark as a declaration of arrival on campus. If you were given your own rock to paint on Northwestern's campus, what would you paint and why?",
        word_limit: 200,
        is_required: false,
        supplement_type: "creative",
        category: "The Rock (Optional)",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "University of Chicago",
    source_url: "https://collegeadmissions.uchicago.edu/apply/uchicago-supplemental-essays",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "How does the University of Chicago, as you know it now, satisfy your desire for a particular kind of learning, community, and future? Please address with some specificity your own wishes and how they relate to UChicago.",
        word_limit: null,
        is_required: true,
        supplement_type: "why_us",
        category: "Why UChicago",
        sort_order: 1,
      },
      {
        prompt_text:
          "Extended Essay: Choose one of the six newly released UChicago prompts (or propose your own via Option 7). The prompts are famously quirky — examples from prior years include 'What can actually be divided by zero?' and 'Mantis shrimp can perceive 12 colors and polarized light. What's something your senses cannot detect that you wish they could?' Pick a prompt, let your mind wander, and write.",
        word_limit: null,
        is_required: true,
        supplement_type: "creative",
        category: "Extended Essay",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "Dartmouth College",
    source_url: "https://admissions.dartmouth.edu/apply/application-instructions",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Dartmouth celebrates the ways in which its profound sense of place informs its profound sense of purpose. As you seek admission to Dartmouth's Class of 2030, what aspects of the College's academic program, community, or campus environment attract your interest? In short, why Dartmouth?",
        word_limit: 100,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Dartmouth",
        sort_order: 1,
      },
      {
        prompt_text:
          "Respond to one of the following prompts (options rotate yearly — examples include: 'Labor leader and civil rights activist Dolores Huerta recommended a life of purpose. What would you want to be known for?' or 'What excites you?'). See Dartmouth's current application for the full list.",
        word_limit: 250,
        is_required: true,
        supplement_type: "identity",
        category: "Personal Prompt (choose 1)",
        sort_order: 2,
      },
      {
        prompt_text:
          "Dartmouth has an inclusive campus community where everyone, from all backgrounds, is embraced as a Dartmouth student. Choose one of the supplied prompts that speaks to you — options touch on community, leadership, failure, curiosity, and shared humanity. (See current Dartmouth application for full list.)",
        word_limit: 250,
        is_required: true,
        supplement_type: "community",
        category: "Community Prompt (choose 1)",
        sort_order: 3,
      },
    ],
  },
  {
    school_name: "Brown University",
    source_url: "https://admission.brown.edu/apply/essay-topics",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Brown's Open Curriculum allows students to explore broadly while also diving deeply into their academic pursuits. Tell us about any academic interests that excite you, and how you might use the Open Curriculum to pursue them while also embracing topics with which you are unfamiliar.",
        word_limit: 200,
        is_required: true,
        supplement_type: "academic",
        category: "Open Curriculum",
        sort_order: 1,
      },
      {
        prompt_text:
          "Students entering Brown often find that making their home on College Hill is a defining part of their college experience. Tell us about a place or community you call home. How has it shaped your perspective?",
        word_limit: 200,
        is_required: true,
        supplement_type: "community",
        category: "Home",
        sort_order: 2,
      },
      {
        prompt_text:
          "Brown students care deeply about their work and the world around them. Students find contentment, satisfaction, and meaning in daily interactions and major discoveries. Whether big or small, mundane or spectacular, tell us about something that brings you joy.",
        word_limit: 200,
        is_required: true,
        supplement_type: "identity",
        category: "Joy",
        sort_order: 3,
      },
    ],
  },
  {
    school_name: "Cornell University",
    source_url: "https://admissions.cornell.edu/apply/first-year-applicants",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "In the aftermath of the U.S. Civil War, Ezra Cornell wrote, 'I would found an institution where any person can find instruction in any study.' For this essay, respond to both questions: 1) How have your life experiences and related aspirations led you to apply to Cornell? 2) Why specifically is the college/school to which you are applying a good match for you?",
        word_limit: 650,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Cornell (school-specific)",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Johns Hopkins University",
    source_url: "https://apply.jhu.edu/application-process/essays-that-worked/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Tell us about an aspect of your identity (e.g. race, gender, sexuality, religion, community, etc.) or a life experience that has shaped you as an individual and how that influenced what you'd like to pursue in college at Hopkins.",
        word_limit: 350,
        is_required: true,
        supplement_type: "identity",
        category: "Identity & Pursuit",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Rice University",
    source_url: "https://admission.rice.edu/apply/how-apply",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Please explain why you wish to study in the academic areas you selected.",
        word_limit: 150,
        is_required: true,
        supplement_type: "academic",
        category: "Why Major",
        sort_order: 1,
      },
      {
        prompt_text:
          "Based upon your exploration of Rice University, what elements of the Rice experience appeal to you?",
        word_limit: 150,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Rice",
        sort_order: 2,
      },
      {
        prompt_text:
          "The Residential College System is at the heart of Rice student life and is heavily influenced by the particular cultural traditions and unique life experiences each student brings. What life perspectives would you contribute to the Rice community?",
        word_limit: 500,
        is_required: true,
        supplement_type: "community",
        category: "Residential College",
        sort_order: 3,
      },
      {
        prompt_text:
          "The Box: In keeping with Rice's long-standing tradition, please share an image of something that appeals to you.",
        word_limit: null,
        is_required: true,
        supplement_type: "creative",
        category: "The Box (image)",
        sort_order: 4,
      },
    ],
  },
  {
    school_name: "Vanderbilt University",
    source_url: "https://admissions.vanderbilt.edu/apply/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Vanderbilt offers a community where students find balance between their academic and social experiences. Please briefly elaborate on how one of your extracurricular activities or work experiences has influenced you.",
        word_limit: 250,
        is_required: true,
        supplement_type: "activity",
        category: "Activity Influence",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Georgetown University",
    source_url: "https://uadmissions.georgetown.edu/app-instructions/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Briefly (approximately one-half page, single-spaced) discuss the significance to you of the school or summer activity in which you have been most involved.",
        word_limit: 250,
        is_required: true,
        supplement_type: "activity",
        category: "Activity Significance",
        sort_order: 1,
      },
      {
        prompt_text:
          "As Georgetown is a diverse community, the Admissions Committee would like to know more about you in your own words. Please submit a brief essay, either personal or creative, which you feel best describes you.",
        word_limit: 650,
        is_required: true,
        supplement_type: "identity",
        category: "Describe Yourself",
        sort_order: 2,
      },
      {
        prompt_text:
          "Please address the school you are applying to (College, SFS, MSB, or NHS): What does it mean to you to be educated, and how has this informed your choice to apply to this specific school?",
        word_limit: 650,
        is_required: true,
        supplement_type: "why_us",
        category: "Why School",
        sort_order: 3,
      },
    ],
  },
  {
    school_name: "University of Notre Dame",
    source_url: "https://admissions.nd.edu/apply/writing-the-essay/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "What excites you about the University of Notre Dame that makes it stand out from other institutions?",
        word_limit: 200,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Notre Dame",
        sort_order: 1,
      },
      {
        prompt_text:
          "Respond to two of Notre Dame's four rotating short-answer prompts (see current application). Past examples: 'What is one thing you are excited to teach your future Notre Dame classmates?' and 'What brings you joy?'",
        word_limit: 200,
        is_required: true,
        supplement_type: "short_answer",
        category: "Short Answers (choose 2)",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "Emory University",
    source_url: "https://apply.emory.edu/apply/essays.html",
    academic_year: YEAR,
    stub: { city: "Atlanta", state: "GA", institution_type: "private" },
    supplements: [
      {
        prompt_text:
          "Which book, character, song, monologue, or piece of work (fiction or non-fiction) seems made for you? Why?",
        word_limit: 150,
        is_required: true,
        supplement_type: "creative",
        category: "Work Made For You",
        sort_order: 1,
      },
      {
        prompt_text:
          "Reflect on a personal experience where you intentionally expanded your cultural awareness.",
        word_limit: 150,
        is_required: true,
        supplement_type: "community",
        category: "Cultural Awareness",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "Carnegie Mellon University",
    source_url: "https://www.cmu.edu/admission/apply/undergraduate-applicants/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Most students choose their intended major or area of study based on a passion or inspiration that's developed over time — what passion or inspiration led you to choose this area of study?",
        word_limit: 300,
        is_required: true,
        supplement_type: "academic",
        category: "Why Major",
        sort_order: 1,
      },
      {
        prompt_text:
          "Many students pursue college for a specific degree, career opportunity or personal goal. Whichever it may be, learning will be critical to achieve your ultimate goal. As you think ahead to the process of learning during your college years, how will you define a successful college experience?",
        word_limit: 300,
        is_required: true,
        supplement_type: "academic",
        category: "Successful Experience",
        sort_order: 2,
      },
      {
        prompt_text:
          "Consider your application as a whole. What do you personally want to emphasize about your application for the admission committee's consideration? Highlight something that's important to you or something you haven't had a chance to share.",
        word_limit: 300,
        is_required: true,
        supplement_type: "identity",
        category: "Personal Emphasis",
        sort_order: 3,
      },
    ],
  },
  {
    school_name: "University of Southern California",
    source_url: "https://admission.usc.edu/apply/first-year/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Describe how you plan to pursue your academic interests and why you want to explore them at USC specifically. Please feel free to address your first- and second-choice major selections.",
        word_limit: 250,
        is_required: true,
        supplement_type: "why_us",
        category: "Why USC",
        sort_order: 1,
      },
      {
        prompt_text:
          "The student body at USC is one of the most diverse in the nation. How will your experiences contribute to this community?",
        word_limit: 250,
        is_required: true,
        supplement_type: "community",
        category: "Contribution",
        sort_order: 2,
      },
      {
        prompt_text:
          "Starting with your first-choice major, briefly respond to the following short-answer questions (each approximately 100 characters): 'What is your favorite snack?', 'Best movie of all time:', 'Dream trip:', 'What TV show will you binge watch next?', 'Which well-known person or fictional character would be your ideal roommate?', 'Favorite book:', 'If your life had a theme song, what would it be?'",
        word_limit: null,
        is_required: true,
        supplement_type: "short_answer",
        category: "Short Answers",
        sort_order: 3,
      },
    ],
  },

  // ---------------------- CALTECH / STEM PRIVATES --------------------
  {
    school_name: "California Institute of Technology",
    source_url: "https://www.admissions.caltech.edu/apply/first-year-applicants/first-year-requirements",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Caltech's mission is 'to expand human knowledge and benefit society through research integrated with education.' We investigate the most challenging, fundamental problems in science and technology in a singularly collegial, interdisciplinary atmosphere, while educating outstanding students to become creative members of society. How does that mission resonate with your own goals and values as a future scientist/engineer?",
        word_limit: 250,
        is_required: true,
        supplement_type: "why_us",
        category: "Mission Resonance",
        sort_order: 1,
      },
      {
        prompt_text:
          "Describe three experiences and/or activities that have helped develop your passion for a possible career in a STEM field.",
        word_limit: 200,
        is_required: true,
        supplement_type: "academic",
        category: "STEM Experiences",
        sort_order: 2,
      },
      {
        prompt_text:
          "The creativity, inventiveness, and innovation of Caltech's students, faculty, and researchers have won Nobel Prizes and put rovers on Mars. But Techers also imagine smaller — and equally important — ways to improve our world. Answer one of the following: (a) In what ways do you hope to shape your world or your people's world in the future? (b) What is a small thing you'd love to be able to fix in the world?",
        word_limit: 200,
        is_required: true,
        supplement_type: "creative",
        category: "Creativity",
        sort_order: 3,
      },
    ],
  },

  // ---------------------- PUBLICS (UCs, UT Austin, UVA, UNC, GT, UMich, UIUC, UW-Madison, UW Seattle, UF) --------------------
  {
    school_name: "University of California-Los Angeles",
    source_url: "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-freshman/personal-insight-questions.html",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "UC Personal Insight Questions: Choose four of the eight Personal Insight Questions to answer. PIQ topics: (1) leadership experience, (2) creative side, (3) greatest talent or skill, (4) educational opportunity or barrier, (5) significant challenge, (6) favorite academic subject, (7) making community better, (8) what sets you apart. Each response up to 350 words.",
        word_limit: 350,
        is_required: true,
        supplement_type: "identity",
        category: "UC Personal Insight (choose 4 of 8)",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "University of California-Berkeley",
    source_url: "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-freshman/personal-insight-questions.html",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "UC Personal Insight Questions: Choose four of the eight PIQs to answer (same eight as all UCs — leadership, creativity, talent/skill, educational opportunity, challenge, favorite subject, community, what sets you apart). Each response up to 350 words.",
        word_limit: 350,
        is_required: true,
        supplement_type: "identity",
        category: "UC Personal Insight (choose 4 of 8)",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "University of California-San Diego",
    source_url: "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-freshman/personal-insight-questions.html",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "UC Personal Insight Questions: Choose four of the eight PIQs to answer. Each response up to 350 words.",
        word_limit: 350,
        is_required: true,
        supplement_type: "identity",
        category: "UC Personal Insight (choose 4 of 8)",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "The University of Texas at Austin",
    source_url: "https://admissions.utexas.edu/apply/how-to-apply/essays/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Tell us your story. What unique opportunities or challenges have you experienced throughout your high school career that have shaped who you are today?",
        word_limit: 500,
        is_required: true,
        supplement_type: "identity",
        category: "Your Story (ApplyTexas A)",
        sort_order: 1,
      },
      {
        prompt_text:
          "Why are you interested in the major you indicated as your first-choice major?",
        word_limit: 300,
        is_required: true,
        supplement_type: "academic",
        category: "Why Major",
        sort_order: 2,
      },
      {
        prompt_text:
          "Describe how your experiences, perspectives, talents, and/or your involvement in leadership activities (at your school, in your community, or within your family responsibilities) will help you to make an impact both in and out of the classroom while enrolled at UT.",
        word_limit: 300,
        is_required: true,
        supplement_type: "community",
        category: "Impact",
        sort_order: 3,
      },
    ],
  },
  {
    school_name: "University of Virginia-Main Campus",
    source_url: "https://admission.virginia.edu/apply",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "What about your individual background, perspective, or experience will serve as a source of strength for you or those around you at UVA? Feel free to write about any past experience or part of your background that has shaped your perspective and will be a source of strength, including but not limited to those related to your community, upbringing, educational environment, race, gender, or other aspects of your background that are important to you.",
        word_limit: 250,
        is_required: true,
        supplement_type: "identity",
        category: "Source of Strength",
        sort_order: 1,
      },
      {
        prompt_text:
          "Answer one of the school-specific short-answer prompts for your first-choice undergraduate school (College of Arts & Sciences, School of Engineering, School of Architecture, Kinesiology, or Nursing). See UVA's site for current prompts.",
        word_limit: 250,
        is_required: true,
        supplement_type: "academic",
        category: "School-Specific",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "University of North Carolina at Chapel Hill",
    source_url: "https://admissions.unc.edu/apply/first-year-application-guide/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Discuss one of your personal qualities and share a story, anecdote, or memory of how it helped you make a positive impact on a community. This community can be can be as broad as a nation or as small as a friendship.",
        word_limit: 250,
        is_required: true,
        supplement_type: "community",
        category: "Personal Quality Impact",
        sort_order: 1,
      },
      {
        prompt_text:
          "Discuss an academic topic that you're excited to explore and learn more about in college. Why does this topic interest you? Topics could be a specific course of study, research interests, or any other area connected to your academic experience.",
        word_limit: 250,
        is_required: true,
        supplement_type: "academic",
        category: "Academic Excitement",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "Georgia Institute of Technology-Main Campus",
    source_url: "https://admission.gatech.edu/first-year/apply",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Why do you want to study your chosen major specifically at Georgia Tech?",
        word_limit: 300,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Major @ Tech",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "University of Michigan-Ann Arbor",
    source_url: "https://admissions.umich.edu/apply/first-year-applicants/writing-requirements",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Everyone belongs to many different communities and/or groups defined by (among other things) shared geography, religion, ethnicity, income, cuisine, interest, race, ideology, or intellectual heritage. Choose one of the communities to which you belong, and describe that community and your place within it.",
        word_limit: 300,
        is_required: true,
        supplement_type: "community",
        category: "Community",
        sort_order: 1,
      },
      {
        prompt_text:
          "Describe the unique qualities that attract you to the specific undergraduate College or School (including preferred admission and dual degree programs) to which you are applying at the University of Michigan. How would that curriculum support your interests?",
        word_limit: 550,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Michigan",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "University of Illinois Urbana-Champaign",
    source_url: "https://admissions.illinois.edu/apply/freshman/instructions",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Explain, in detail, an experience you've had in the past 3 to 4 years related to your first-choice major. This can be an experience from an extracurricular activity, in a class you've taken, or through something else.",
        word_limit: 150,
        is_required: true,
        supplement_type: "academic",
        category: "Major Experience",
        sort_order: 1,
      },
      {
        prompt_text:
          "Describe your personal and/or career goals after graduating from UIUC and how your selected first-choice major will help you achieve them.",
        word_limit: 150,
        is_required: true,
        supplement_type: "academic",
        category: "Goals",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "University of Wisconsin-Madison",
    source_url: "https://admissions.wisc.edu/apply/freshman/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Tell us why you would like to attend the University of Wisconsin–Madison. In addition, please include why you are interested in studying the major(s) you have selected. If you selected undecided, please describe your areas of possible academic interest.",
        word_limit: 650,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Madison / Major",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "University of Washington-Seattle Campus",
    source_url: "https://admit.washington.edu/apply/freshman/essay/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Our families and communities often define us and our individual worlds. Community might refer to your cultural group, extended family, religious group, neighborhood or school, sports team or club, co-workers, etc. Describe the world you come from and how you, as a product of it, might add to the diversity of the UW.",
        word_limit: 300,
        is_required: true,
        supplement_type: "community",
        category: "World You Come From",
        sort_order: 1,
      },
      {
        prompt_text:
          "Tell a story from your life, describing an experience that either demonstrates your character or helped to shape it.",
        word_limit: 600,
        is_required: true,
        supplement_type: "identity",
        category: "Character Story",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "University of Florida",
    source_url: "https://admissions.ufl.edu/apply/freshman/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "UF uses the Common App essay as its main personal statement; there are no additional required supplement essays. Optional responses may be requested for specific programs (e.g., honors, direct-admit). Verify the current application for any program-specific additions.",
        word_limit: null,
        is_required: false,
        supplement_type: "other",
        category: "Common App Only",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Ohio State University-Main Campus",
    source_url: "https://undergrad.osu.edu/apply/first-year",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "What aspects of Ohio State's academic environment and intended major make you a great fit? (Short-answer ~500 characters.)",
        word_limit: 100,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Ohio State",
        sort_order: 1,
      },
    ],
  },

  // ---------------------- TOP LIBERAL ARTS COLLEGES --------------------
  {
    school_name: "Williams College",
    source_url: "https://admission.williams.edu/apply/first-year-applicants/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Imagine yourself in a Williams tutorial. Of the two students in the class, you are responsible for defending your position on the week's topic against the critique of your partner. What topic would you like to study and why would you like to study it in a tutorial?",
        word_limit: 300,
        is_required: false,
        supplement_type: "academic",
        category: "Tutorial (Optional)",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Amherst College",
    source_url: "https://www.amherst.edu/admission/apply/firstyear",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Option A — Respond to one of the provided Amherst quotations (rotating set, see current application) in an essay of no more than 300 words. Option B — Submit a graded, expository prose writing sample (3-5 pages) from your high school career accompanied by a brief teacher assignment.",
        word_limit: 300,
        is_required: true,
        supplement_type: "academic",
        category: "Quotation or Writing Sample",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Swarthmore College",
    source_url: "https://www.swarthmore.edu/admissions-aid/application-process",
    academic_year: YEAR,
    stub: { city: "Swarthmore", state: "PA", institution_type: "private" },
    supplements: [
      {
        prompt_text:
          "Why are you applying to Swarthmore? What aspects of our community, as you've come to know it, would make Swarthmore a good place for you?",
        word_limit: 250,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Swarthmore",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Pomona College",
    source_url: "https://www.pomona.edu/admissions/apply",
    academic_year: YEAR,
    stub: { city: "Claremont", state: "CA", institution_type: "private" },
    supplements: [
      {
        prompt_text:
          "Academic Interest: What do you love about the subject(s) you selected as potential major(s)? If undecided, share more about one of your academic passions.",
        word_limit: 150,
        is_required: true,
        supplement_type: "academic",
        category: "Academic Interest",
        sort_order: 1,
      },
      {
        prompt_text:
          "At Pomona, we celebrate and identify with our unique quirks and traditions. Reflect on an aspect of your identity, a community you're part of, or a tradition meaningful to you — and tell us how it may contribute to our campus community.",
        word_limit: 200,
        is_required: true,
        supplement_type: "community",
        category: "Community",
        sort_order: 2,
      },
    ],
  },
  {
    school_name: "Wellesley College",
    source_url: "https://www.wellesley.edu/admission/apply",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "When choosing a college community, you are choosing a place where you believe that you can live, learn, and flourish. Generations of inquisitive Wellesley students have asked, 'Why Wellesley?' What draws you to this particular college, and what do you hope to contribute?",
        word_limit: 400,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Wellesley",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Bowdoin College",
    source_url: "https://www.bowdoin.edu/admissions/apply/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "The Offer of the College (optional): 'To be at home in all lands and all ages; to count Nature a familiar acquaintance, and Art an intimate friend…' Which aspect of the Offer resonates most with you? (Optional short essay, up to 250 words.)",
        word_limit: 250,
        is_required: false,
        supplement_type: "identity",
        category: "The Offer (Optional)",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Carleton College",
    source_url: "https://www.carleton.edu/admissions/apply/",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Why Carleton? Please describe how your interests and goals align with what Carleton has to offer.",
        word_limit: 400,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Carleton",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Claremont McKenna College",
    source_url: "https://www.cmc.edu/admission/how-to-apply",
    academic_year: YEAR,
    stub: { city: "Claremont", state: "CA", institution_type: "private" },
    supplements: [
      {
        prompt_text:
          "CMC's mission is to educate students for thoughtful and productive lives and responsible leadership in business, government, and the professions. Keeping this mission in mind, please describe how you would uniquely contribute to the CMC community and/or how CMC would contribute to your growth.",
        word_limit: 250,
        is_required: true,
        supplement_type: "why_us",
        category: "Why CMC / Contribution",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Middlebury College",
    source_url: "https://www.middlebury.edu/admissions/apply",
    academic_year: YEAR,
    supplements: [
      {
        prompt_text:
          "Middlebury seeks to build a vibrant, curious, and diverse community. Why Middlebury and how will you contribute?",
        word_limit: 300,
        is_required: true,
        supplement_type: "why_us",
        category: "Why Middlebury",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Davidson College",
    source_url: "https://www.davidson.edu/admission-and-financial-aid/apply",
    academic_year: YEAR,
    stub: { city: "Davidson", state: "NC", institution_type: "private" },
    supplements: [
      {
        prompt_text:
          "Davidson encourages students to explore curiosities old and new. Which of your intellectual, civic, or artistic curiosities are you most excited to pursue at Davidson, and why?",
        word_limit: 250,
        is_required: true,
        supplement_type: "academic",
        category: "Curiosity",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Vassar College",
    source_url: "https://admissions.vassar.edu/apply/",
    academic_year: YEAR,
    stub: { city: "Poughkeepsie", state: "NY", institution_type: "private" },
    supplements: [
      {
        prompt_text:
          "Your Space: We invite you to share a space that matters to you. This could be a room, a community setting, a corner of your mind, or anywhere else — upload an image or write a short reflection (up to 300 words).",
        word_limit: 300,
        is_required: false,
        supplement_type: "creative",
        category: "Your Space (Optional)",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Grinnell College",
    source_url: "https://www.grinnell.edu/admission/apply",
    academic_year: YEAR,
    stub: { city: "Grinnell", state: "IA", institution_type: "private" },
    supplements: [
      {
        prompt_text:
          "Grinnell students are often described as self-governing, socially conscious, and academically rigorous. Which of these qualities most resonates with you, and how would you contribute to the Grinnell community?",
        word_limit: 250,
        is_required: true,
        supplement_type: "community",
        category: "Why Grinnell",
        sort_order: 1,
      },
    ],
  },
  {
    school_name: "Smith College",
    source_url: "https://www.smith.edu/admission-aid/how-apply",
    academic_year: YEAR,
    stub: { city: "Northampton", state: "MA", institution_type: "private" },
    supplements: [
      {
        prompt_text:
          "Why have you decided to apply to Smith? Your answer will not affect your admission decision, but will help us understand your reasons for applying.",
        word_limit: 200,
        is_required: false,
        supplement_type: "why_us",
        category: "Why Smith (Optional)",
        sort_order: 1,
      },
    ],
  },
];

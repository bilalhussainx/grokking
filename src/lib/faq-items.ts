// Public FAQ answers: the reviewed description of the admissions product.
// Rendered on /faq and reused by /llms-full.txt.
import { proMonthlyLabel, proYearlyLabel } from "@/lib/pricing";

export const FAQ_ITEMS = [
  {
    question: 'What is KairosLearn?',
    answer:
      'KairosLearn is an AI-powered college counseling platform. Coach Kairos — an AI counselor available in 18 languages — guides you through the whole application: building a school list with reach/match/safety chancing, brainstorming and revising essays, optimizing your Common App activities, practicing interviews with alumni AI personas, and comparing financial aid. Human counselors and agencies use the same platform to run their student caseload, review essays, and track progress.',
  },
  {
    question: 'Does the AI write my college essay?',
    answer:
      'No — and this is by design. Essay Studio coaches you through brainstorming, outlining, and revision by asking questions, suggesting angles, and pointing out what is or isn’t working. It never writes essay sentences or rewrites your prose. The Common App treats submitting AI-generated writing as your own work as a violation, and many colleges have their own AI policies. Our approach keeps every word yours. Read the full policy at kairoslearn.com/integrity.',
  },
  {
    question: 'How does Essay Studio work?',
    answer:
      'Essay Studio walks you through four phases. Brainstorm: a Storyboard Coach interviews you to surface the story only you can tell, before you write a sentence. Outline: you get three structurally different outline options built from your own experiences, and pick one. Draft: you write; the coach responds with questions and observations, never rewrites. Review: your counselor (or Coach Kairos) gives anchored feedback for revision. Supplemental essays get the same treatment, with checks that you aren’t rehashing your personal statement.',
  },
  {
    question: 'Is KairosLearn free? What does Pro cost?',
    answer:
      `Free forever for your first three schools — school list, essays, and core tools included. Pro is ${proMonthlyLabel()} (or ${proYearlyLabel()}) and unlocks unlimited schools, essays, voice sessions, languages, mock interviews, and the full financial-aid comparator. New users get a free 7-day Pro trial with no card required, and you can cancel within 14 days of any charge for a full refund.`,
  },
  {
    question: 'What languages does KairosLearn support?',
    answer:
      'Coach Kairos supports 18 languages for voice and chat, including English, Spanish, French, German, Italian, Dutch, Japanese, Hindi, Punjabi, and Urdu. You can talk through your school list in one language and get essay feedback in another. Family Mode lets you hand the phone to a parent and the coach switches to their language and answers their questions — financial aid included — without exposing your essay drafts.',
  },
  {
    question: 'I’m a counselor or run an agency. How does KairosLearn work for me?',
    answer:
      'You get a counselor workspace: invite students with a code, see your whole roster, review essays with inline feedback, track each student’s school list and application progress, and manage a team of counselors under one agency with per-counselor review settings. Students do the work in the same tools you review in, so nothing gets emailed back and forth as attachments. Start at kairoslearn.com/product/counselor.',
  },
  {
    question: 'Can my parents follow my application?',
    answer:
      'Yes, if you choose to share. You control a share link that gives counselors or family read access to your essays, activities, school list, and scores. Family Mode in the coach is built for parents who don’t speak English — it answers their questions about deadlines, costs, and financial aid in their language.',
  },
];

// SP-14 — blog post index. Extend by adding entries + a matching MDX/TSX page
// under src/app/blog/<slug>/page.tsx.

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string; // ISO
  readTime: string;
  category: string;
  image?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-voice-based-ai-tutoring-works",
    title: "Why Voice-Based AI Tutoring Works Better Than Text",
    excerpt:
      "Research shows that voice conversations improve retention by 40%. Here's why KairosLearn uses voice-first AI tutoring for coding, languages, and more.",
    author: "Bilal Hussain",
    date: "2026-03-26",
    readTime: "5 min read",
    category: "AI Education",
    image: "/images/blog/voice-tutoring.jpg",
  },
  {
    slug: "learning-algorithms-in-your-native-language",
    title: "Why You Should Learn Algorithms in Your Native Language",
    excerpt:
      "Most coding resources are English-only. But research suggests you learn more effectively in your native language. Here's why KairosLearn supports 17 languages.",
    author: "Bilal Hussain",
    date: "2026-03-25",
    readTime: "6 min read",
    category: "Language Learning",
    image: "/images/blog/multilingual-coding.jpg",
  },
  {
    slug: "alumni-interviewer-playbook",
    title: "What Alumni Interviewers Actually Write in Their Reports",
    excerpt:
      "We studied publicly leaked evaluator rubrics from Ivy+ schools. Here's the shape of a strong report and the antipatterns that sink an applicant fast.",
    author: "KairosLearn Team",
    date: "2026-04-12",
    readTime: "7 min read",
    category: "College Admissions",
  },
  {
    slug: "essays-that-survive-an-interview",
    title: "Write Essays That Survive the Interview Probe",
    excerpt:
      "Your admissions essays will be read out loud and probed live. If you can't defend a specific claim for 90 seconds, the line is too abstract — here's how to fix it.",
    author: "KairosLearn Team",
    date: "2026-04-14",
    readTime: "6 min read",
    category: "College Admissions",
  },
  {
    slug: "resume-pivot-to-target-role",
    title: "Rewriting Your Resume for a Role You Don't Have Yet",
    excerpt:
      "Targeting a role you haven't done before? Here's how to structure bullets around transferable impact instead of faking experience.",
    author: "KairosLearn Team",
    date: "2026-04-15",
    readTime: "5 min read",
    category: "Careers",
  },
];

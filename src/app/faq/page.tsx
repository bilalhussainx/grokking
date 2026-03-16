import { Metadata } from 'next';
import Link from 'next/link';
import { courses } from '@/data';
import { getAllLessons } from '@/data/types';
import { JsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Common questions about Samsara.ai — what courses are available, how AI coaching works, pricing, supported languages, and more.',
  keywords: [
    'Samsara.ai FAQ',
    'online learning FAQ',
    'AI tutor questions',
    'free online courses',
    'how does AI coaching work',
    'Samsara.ai pricing',
    'meditation course online',
    'coding interview preparation',
    'religious studies online',
  ],
  openGraph: {
    title: 'FAQ — Samsara.ai',
    description: 'Common questions about Samsara.ai courses and AI coaching.',
    url: 'https://samsara.ai/faq',
  },
  alternates: { canonical: 'https://samsara.ai/faq' },
};

const FAQ_ITEMS = [
  {
    question: 'What is Samsara.ai?',
    answer:
      'Samsara.ai is an AI-powered online learning platform that offers interactive courses across Computer Science, Religious Studies, Philosophy, Finance, Health & Wellness, and Political Strategy. Each course includes an AI voice coach that provides real-time explanations, hints, and personalized feedback to help learners master complex subjects at their own pace.',
  },
  {
    question: 'What courses are available on Samsara.ai?',
    answer:
      'Samsara.ai offers 60+ courses organized into 7 domains. In Computer Science, you can study Python, JavaScript, React, system design, data structures, and coding interview preparation. Religious Studies includes courses on Islam, Christianity, and Buddhism. Philosophy covers Stoic philosophy. Finance courses include personal finance, investing, accounting, and macroeconomics. Health & Wellness features meditation, mental health, and leadership courses. Political Strategy covers geopolitics and international relations.',
  },
  {
    question: 'Is Samsara.ai free?',
    answer:
      'Many courses on Samsara.ai are completely free, including Python Fundamentals, Web Development, Islam: Foundations & Practice, Stoic Philosophy, Meditation & Mindfulness, Mental Health & Resilience, and Personal Finance Mastery. Premium (Pro) courses covering advanced topics like system design, machine learning, investing, and cybersecurity require a Pro subscription.',
  },
  {
    question: 'How does AI coaching work on Samsara.ai?',
    answer:
      'Every course on Samsara.ai includes an AI voice coach that accompanies you through lessons. The coach can explain concepts in plain language, provide progressive hints when you are stuck on coding exercises, celebrate your progress, and answer questions about the material. The AI coach is available in 9 languages including English, Spanish, French, German, Italian, Dutch, Japanese, Hindi, and Punjabi.',
  },
  {
    question: 'What languages does Samsara.ai support?',
    answer:
      'The AI voice coaching feature supports 9 languages: English, Spanish, French, German, Italian, Dutch, Japanese, Hindi, and Punjabi. Course content is primarily in English, but the AI coach can explain concepts and provide feedback in any of the supported languages.',
  },
  {
    question: 'What is the Meditation & Mindfulness course like?',
    answer:
      'The Meditation & Mindfulness Practice course is a free, beginner-level course with 7 modules covering breath awareness, body scans, loving-kindness meditation, mindful living, and emotional regulation. It is grounded in neuroscience research from JAMA, The Lancet, and leading universities. An AI voice coach guides you through each practice and helps you build a sustainable daily meditation habit.',
  },
  {
    question: 'How do coding exercises work on Samsara.ai?',
    answer:
      'Computer Science courses include interactive coding exercises with an in-browser code editor. You write code directly in the browser, and the AI coach provides progressive hints if you get stuck. Each exercise includes starter code and a solution you can reveal after attempting the problem. Exercises cover Python, JavaScript, TypeScript, C++, and C# depending on the course.',
  },
  {
    question: 'What religious studies courses are available?',
    answer:
      'Samsara.ai offers three religious studies courses: Islam: Foundations & Practice covers the Quran, Hadith, Five Pillars, and Islamic ethics. Christianity: Ethics & Theology explores scripture, the life of Jesus, denominational differences, and Christian ethics. Buddhism: Path to Inner Peace covers the Four Noble Truths, the Eightfold Path, meditation traditions, and Buddhist ethics. All three courses are free and beginner-friendly.',
  },
];

function faqPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={faqPageSchema()} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-400 text-lg">
            Everything you need to know about Samsara.ai, our courses, AI
            coaching, and pricing.
          </p>
        </header>

        <div className="space-y-8">
          {FAQ_ITEMS.map((item, i) => (
            <article
              key={i}
              className="rounded-2xl border border-slate-700/30 bg-slate-800/20 p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-3">
                {item.question}
              </h2>
              <p className="text-slate-300 leading-relaxed">{item.answer}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            Ready to start learning?
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KairosLearn vs LeetCode - Which Coding Platform is Better?',
  description: 'Compare KairosLearn and LeetCode for coding interview prep. KairosLearn offers AI voice tutoring in 18 languages, structured courses, and personalized learning paths.',
  keywords: 'kairoslearn vs leetcode, coding interview prep, ai tutoring, learn to code, programming courses',
};

export default function VsLeetCodePage() {
  const features = [
    {
      feature: 'AI Voice Tutoring',
      kairoslearn: true,
      leetcode: false,
      description: 'Real-time voice conversations with AI tutor in 18 languages'
    },
    {
      feature: 'Structured Courses',
      kairoslearn: true,
      leetcode: false,
      description: 'Complete learning paths from beginner to professional'
    },
    {
      feature: 'Multilingual Support',
      kairoslearn: '18 languages',
      leetcode: 'English only',
      description: 'Learn in Spanish, French, German, Japanese, Hindi, and more'
    },
    {
      feature: 'Practice Problems',
      kairoslearn: true,
      leetcode: true,
      description: 'Both platforms offer coding exercises and challenges'
    },
    {
      feature: 'Free Content',
      kairoslearn: '28 free courses',
      leetcode: 'Limited free problems',
      description: 'KairosLearn offers significantly more free content'
    },
    {
      feature: 'Beyond Just Coding',
      kairoslearn: true,
      leetcode: false,
      description: 'Languages, finance, philosophy — not just coding'
    },
    {
      feature: 'Real-Time Explanations',
      kairoslearn: true,
      leetcode: false,
      description: 'AI coach explains concepts until you understand'
    },
    {
      feature: 'Interview Prep',
      kairoslearn: true,
      leetcode: true,
      description: 'Both platforms help with technical interview preparation'
    },
    {
      feature: 'Community Discussion',
      kairoslearn: false,
      leetcode: true,
      description: 'LeetCode has established discussion forums'
    },
    {
      feature: 'Company-Specific Questions',
      kairoslearn: false,
      leetcode: true,
      description: 'LeetCode has company-tagged problems'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            KairosLearn vs LeetCode
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Both platforms help you prepare for coding interviews. But KairosLearn offers something LeetCode doesn't:
            <strong> AI voice tutoring, structured learning paths, and support for 18 languages.</strong>
          </p>
          <Link 
            href="/pricing"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Try KairosLearn Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                    KairosLearn
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    LeetCode
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {features.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.feature}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {item.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.kairoslearn === 'boolean' ? (
                        item.kairoslearn ? (
                          <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.kairoslearn}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.leetcode === 'boolean' ? (
                        item.leetcode ? (
                          <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-gray-300 dark:text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.leetcode}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Key Differences */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose KairosLearn Over LeetCode?
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🎤 Voice-First Learning
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              LeetCode is text-based. KairosLearn lets you <strong>talk to your AI tutor</strong> in real-time.
              Ask questions, get explanations, practice speaking — all in your native language.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Perfect for auditory learners and non-native English speakers.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🌍 18 Languages, Not Just English
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              LeetCode is English-only. KairosLearn supports <strong>Spanish, French, German, Japanese, Hindi, Italian, Dutch, and 11 more languages</strong>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Learn algorithms in the language you think in.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              📚 Structured Courses, Not Just Problems
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              LeetCode gives you problems. KairosLearn gives you <strong>complete courses</strong> — from Python basics to MERN stack,
              Data Structures to System Design.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              28 courses completely free. Learn, don't just grind.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Beyond Coding
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              LeetCode is coding-only. KairosLearn also teaches <strong>languages, finance, philosophy, and more</strong>.
              Become a well-rounded professional, not just a coder.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              69+ courses across multiple domains.
            </p>
          </div>
        </div>
      </section>

      {/* When to Use Each */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Which Platform is Right for You?
        </h2>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Choose KairosLearn if you:
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>✅ Want to <strong>learn fundamentals</strong>, not just solve problems</li>
              <li>✅ Prefer <strong>voice explanations</strong> over reading walls of text</li>
              <li>✅ Are a <strong>non-native English speaker</strong> and want to learn in your language</li>
              <li>✅ Want <strong>structured courses</strong> with modules, exercises, and projects</li>
              <li>✅ Need <strong>AI tutoring</strong> that adapts to your level</li>
              <li>✅ Want to learn <strong>more than just coding</strong> (languages, finance, etc.)</li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-400 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Choose LeetCode if you:
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>✅ Only care about <strong>grinding interview problems</strong></li>
              <li>✅ Want <strong>company-specific problem tags</strong> (e.g., "Google hard")</li>
              <li>✅ Prefer <strong>community discussion forums</strong></li>
              <li>✅ Are comfortable with <strong>English-only content</strong></li>
              <li>✅ Don't need AI tutoring or explanations</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            <strong>Honest recommendation:</strong> Use both. KairosLearn for learning, LeetCode for problem-solving practice.
            But if you're starting from scratch or need better explanations — <strong>KairosLearn is the better choice</strong>.
          </p>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Pricing
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              KairosLearn
            </h3>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              Free
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              28 courses completely free. Premium courses available.
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-8">
              <li>✅ AI voice tutoring</li>
              <li>✅ 18 languages</li>
              <li>✅ 2,284+ lessons</li>
              <li>✅ Free trial for premium</li>
            </ul>
            <Link 
              href="/pricing"
              className="block text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Free
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              LeetCode
            </h3>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              $35/mo
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Premium subscription for full access.
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-8">
              <li>✅ Company-tagged problems</li>
              <li>✅ Video explanations</li>
              <li>✅ Premium-only problems</li>
              <li>✅ Interview simulator</li>
            </ul>
            <a 
              href="https://leetcode.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Visit LeetCode
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Learn with AI Voice Tutoring?
          </h2>
          <p className="text-xl mb-8 text-blue-50">
            Try KairosLearn free. No credit card required. 28 courses completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/talk"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Try Voice Tutoring
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

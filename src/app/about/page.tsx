import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Code, Users, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About KairosLearn - AI-Powered Learning Platform',
  description: 'Meet the team behind KairosLearn. Harvard CS grad turned educator building the future of AI-powered education with voice tutoring in 18 languages.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Teaching the world, one voice conversation at a time
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            KairosLearn is an AI-powered learning platform that makes education accessible, 
            personalized, and engaging through voice conversations in 18 languages.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            From Harvard Classroom to AI-Powered Learning
          </h2>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Hi, I'm Bilal Hussain, founder of KairosLearn. I graduated from Harvard with a degree in Computer Science in May 2022,
              then spent two years teaching at Milton Academy (August 2022 – May 2024). Those two years changed everything.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              As a CS instructor, I saw firsthand how traditional education fails so many students. Not because they're
              not smart enough — but because they learn differently, speak different languages, or need concepts explained
              in ways textbooks don't offer.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              I watched students light up when I explained algorithms in Spanish, when I broke down React in simpler terms,
              when I gave them voice explanations they could replay. That's when it clicked: <strong>What if every student
              had an AI tutor that could speak their language, adapt to their level, and explain things 100 different ways
              until it made sense?</strong>
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              So I built it. Using Claude Code (Anthropic's AI coding assistant), I shipped KairosLearn — an AI platform with:
            </p>

            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-6">
              <li><strong>Voice tutoring in 18 languages</strong> — not just English</li>
              <li><strong>69+ interactive courses</strong> — coding, languages, finance, philosophy, religion</li>
              <li><strong>2,284+ structured lessons</strong> — from beginner to professional</li>
              <li><strong>Real-time AI coaching</strong> — Coach Alex adapts to your level and explains in your language</li>
            </ul>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              This isn't just another LeetCode clone or Duolingo competitor. It's a platform that believes education should
              be <strong>multilingual, conversational, and AI-native</strong>.
            </p>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We're raising our pre-seed round now to bring this to 1 million students worldwide. If you're an investor,
              partner, or just believe in this vision — <Link href="/pricing" className="text-blue-600 dark:text-blue-400 underline">try the platform</Link> or <a href="mailto:bilalhussain.v1@gmail.com" className="text-blue-600 dark:text-blue-400 underline">reach out</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          What We Believe
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Education for Everyone
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learning shouldn't be limited by language, location, or learning style. Our AI tutors speak 18 languages
              and adapt to every student.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              AI-Native from Day One
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Built with Claude Code, optimized for AI interactions. We're not retrofitting AI onto old systems —
              we're AI-first.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Evidence-Based Learning
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every course is structured with checkpoints, exercises, and projects. We don't just teach — we help you master.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section (Founder-focused for now) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          The Team
        </h2>

        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">BH</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Bilal Hussain
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Founder & CEO
            </p>
            <div className="text-left text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p>🎓 <strong>Harvard CS</strong> (Class of 2022)</p>
              <p>👨‍🏫 <strong>Former CS Instructor</strong> at Milton Academy (2022-2024)</p>
              <p>💼 <strong>Senior Full-Stack Developer</strong> at Penomo Protocol (MERN stack)</p>
              <p>🚀 <strong>Built with AI</strong> — ships fast using Claude Code</p>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <a 
                href="https://linkedin.com/in/bilalhussain" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                LinkedIn
              </a>
              <a 
                href="mailto:bilalhussain.v1@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Traction (Pre-seed pitch section) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Building the Future of AI Education
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 text-center mb-8">
            <div>
              <div className="text-4xl font-bold mb-2">69+</div>
              <div className="text-blue-100">Interactive Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,284+</div>
              <div className="text-blue-100">Structured Lessons</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">18</div>
              <div className="text-blue-100">Voice Languages</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">28</div>
              <div className="text-blue-100">Free Courses</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg mb-6 text-blue-50">
              <strong>We're raising $500K–$1.5M in pre-seed funding</strong> to scale to 1M users and expand our course library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Try the Platform
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a 
                href="mailto:bilalhussain.v1@gmail.com?subject=KairosLearn Investment Inquiry"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Investor Deck
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Join Us on This Journey
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Whether you're a student, investor, partner, or fellow builder — we'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/courses"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Explore Courses
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a 
            href="mailto:bilalhussain.v1@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Code, Users, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About KairosLearn - AI-Powered Learning Platform',
  description: 'Meet the team behind KairosLearn. Harvard CS grad turned educator building the future of AI-powered education with voice tutoring in 17 languages.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Teaching the world, one voice conversation at a time
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            KairosLearn is an AI-powered learning platform that makes education accessible,
            personalized, and engaging through voice conversations in 17 languages.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#141414] rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-6">
            From Harvard Classroom to AI-Powered Learning
          </h2>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Hi, I'm Bilal Hussain, founder of KairosLearn. I graduated from Harvard with a degree in Computer Science in May 2022,
              then spent two years teaching at Milton Academy (August 2022 – May 2024). Those two years changed everything.
            </p>

            <p className="text-gray-300 leading-relaxed mb-4">
              As a CS instructor, I saw firsthand how traditional education fails so many students. Not because they're
              not smart enough — but because they learn differently, speak different languages, or need concepts explained
              in ways textbooks don't offer.
            </p>

            <p className="text-gray-300 leading-relaxed mb-4">
              I watched students light up when I explained algorithms in Spanish, when I broke down React in simpler terms,
              when I gave them voice explanations they could replay. That's when it clicked: <strong>What if every student
              had an AI tutor that could speak their language, adapt to their level, and explain things 100 different ways
              until it made sense?</strong>
            </p>

            <p className="text-gray-300 leading-relaxed mb-4">
              So I built it. Using Claude Code (Anthropic's AI coding assistant), I shipped KairosLearn — an AI platform with:
            </p>

            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li><strong>Voice tutoring in 17 languages</strong> — not just English</li>
              <li><strong>69+ interactive courses</strong> — coding, languages, finance, philosophy, religion</li>
              <li><strong>2,284+ structured lessons</strong> — from beginner to professional</li>
              <li><strong>Real-time AI coaching</strong> — Coach Kairos adapts to your level and explains in your language</li>
            </ul>

            <p className="text-gray-300 leading-relaxed mb-4">
              This isn't just another LeetCode clone or Duolingo competitor. It's a platform that believes education should
              be <strong>multilingual, conversational, and AI-native</strong>.
            </p>

            <p className="text-gray-300 leading-relaxed">
              We're raising our pre-seed round now to bring this to 1 million students worldwide. If you're an investor,
              partner, or just believe in this vision — <Link href="/pricing" className="text-[#D4AF37] underline">try the platform</Link> or <a href="mailto:bilalhussain.v1@gmail.com" className="text-[#D4AF37] underline">reach out</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          What We Believe
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 hover:bg-white/5 hover:border-[#D4AF37]/30 transition">
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Education for Everyone
            </h3>
            <p className="text-gray-300">
              Learning shouldn't be limited by language, location, or learning style. Our AI tutors speak 17 languages
              and adapt to every student.
            </p>
          </div>

          <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 hover:bg-white/5 hover:border-[#D4AF37]/30 transition">
            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              AI-Native from Day One
            </h3>
            <p className="text-gray-300">
              Built with Claude Code, optimized for AI interactions. We're not retrofitting AI onto old systems —
              we're AI-first.
            </p>
          </div>

          <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 hover:bg-white/5 hover:border-[#D4AF37]/30 transition">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-white/70" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Evidence-Based Learning
            </h3>
            <p className="text-gray-300">
              Every course is structured with checkpoints, exercises, and projects. We don't just teach — we help you master.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section (Founder-focused for now) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          The Team
        </h2>

        <div className="flex flex-col items-center">
          <div className="bg-[#141414] rounded-2xl p-8 border border-white/10 text-center max-w-md">
            <div className="w-24 h-24 bg-[#D4AF37] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-black">BH</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Bilal Hussain
            </h3>
            <p className="text-gray-400 mb-4">
              Founder & CEO
            </p>
            <div className="text-left text-sm text-gray-300 space-y-2">
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
                className="text-[#D4AF37] hover:underline"
              >
                LinkedIn
              </a>
              <a
                href="mailto:bilalhussain.v1@gmail.com"
                className="text-[#D4AF37] hover:underline"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Traction (Pre-seed pitch section) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#D4AF37] rounded-2xl p-8 text-black">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Building the Future of AI Education
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center mb-8">
            <div>
              <div className="text-4xl font-bold mb-2">69+</div>
              <div className="text-black/70">Interactive Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,284+</div>
              <div className="text-black/70">Structured Lessons</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">17</div>
              <div className="text-black/70">Voice Languages</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">28</div>
              <div className="text-black/70">Free Courses</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg mb-6 text-black/80">
              <strong>We're raising $500K–$1.5M in pre-seed funding</strong> to scale to 1M users and expand our course library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 bg-black text-[#D4AF37] rounded-lg font-semibold hover:bg-black/80 transition"
              >
                Try the Platform
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="mailto:bilalhussain.v1@gmail.com?subject=KairosLearn Investment Inquiry"
                className="inline-flex items-center justify-center px-6 py-3 bg-black/10 text-black rounded-lg font-semibold hover:bg-black/20 transition"
              >
                Investor Deck
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Join Us on This Journey
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Whether you're a student, investor, partner, or fellow builder — we'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#D4AF37]/90 transition"
          >
            Explore Courses
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <a
            href="mailto:bilalhussain.v1@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#141414] border border-white/10 text-white rounded-lg font-semibold hover:bg-white/5 hover:border-[#D4AF37]/30 transition"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}

import { pageMetadata } from "@/lib/seo";
import { COACH_LANGUAGE_COUNT } from "@/lib/coach-language-claim";
import Link from 'next/link';
import { PRICING } from "@/lib/pricing";
import { ArrowRight, GraduationCap, Code, Users, Sparkles, Briefcase } from 'lucide-react';

export const metadata = pageMetadata({
  title: "About us — AI college counseling for every student",
  description: `Meet the team behind KairosLearn. Harvard CS grad turned educator building an AI college counselor that speaks ${COACH_LANGUAGE_COUNT} languages — for the students an overstretched counselor system leaves behind.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Every student deserves a counselor who actually knows them
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            KairosLearn is an AI-powered college counseling platform. Coach Kairos guides
            students through school lists, essays, interviews, and financial aid — in {COACH_LANGUAGE_COUNT}
            languages — and gives human counselors a workspace to support their whole caseload.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#141414] rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-6">
            From Harvard Classroom to AI College Counseling
          </h2>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Hi, I&apos;m Bilal Hussain, founder of KairosLearn. I graduated from Harvard with a degree in Computer Science in May 2022,
              then spent two years teaching at Milton Academy (August 2022 – May 2024). Those two years changed everything.
            </p>

            <p className="text-gray-300 leading-relaxed mb-4">
              At an elite school, every student had a college counselor who knew their story. But school counselors
              often serve hundreds of students each. For first-gen, international, and underprivileged
              applicants — the students whose families can&apos;t pay $5,000 for a private consultant, or don&apos;t speak
              English at home — that ratio means almost no time, no translation, and no one who knows them.
            </p>

            <p className="text-gray-300 leading-relaxed mb-4">
              That&apos;s when it clicked: <strong>What if every student had a counselor who spoke their family&apos;s language,
              knew their full profile, and was available at 3 a.m. the night before a deadline?</strong>
            </p>

            <p className="text-gray-300 leading-relaxed mb-4">
              So I built it. KairosLearn is an AI college counseling platform with:
            </p>

            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li><strong>Coach Kairos in {COACH_LANGUAGE_COUNT} languages</strong> — talk through your school list in Hindi, your essays in Punjabi, your aid forms in Spanish</li>
              <li><strong>Essay Studio</strong> — brainstorm, outline, draft, and revise with coaching that never writes a word for you</li>
              <li><strong>School list + aid tools</strong> — reach/match/safety chancing, activities optimizer, mock interviews, financial-aid comparison</li>
              <li><strong>A counselor workspace</strong> — human counselors and agencies run their whole student book on the same platform</li>
            </ul>

            <p className="text-gray-300 leading-relaxed mb-4">
              This isn&apos;t a chatbot wearing a counselor hat. It&apos;s a platform that believes college guidance should be
              <strong> multilingual, personal, and honest about AI</strong> — the student does the work; the AI makes
              sure no one does it alone.
            </p>

            <p className="text-gray-300 leading-relaxed">
              If you&apos;re a student, parent, counselor, or partner who believes in this —{" "}
              <Link href="/pricing" className="text-[#D4AF37] underline">try the platform</Link> or{" "}
              <a href="mailto:bilalhussain.v1@gmail.com" className="text-[#D4AF37] underline">reach out</a>.
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
              Counseling for Everyone
            </h3>
            <p className="text-gray-300">
              A great application shouldn&apos;t require a $5,000 consultant or an English-speaking household.
              Coach Kairos speaks {COACH_LANGUAGE_COUNT} languages and knows every student&apos;s full story.
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
              Designed around AI from the first line. We&apos;re not retrofitting AI onto old systems —
              we&apos;re AI-first.
            </p>
          </div>

          <div className="bg-[#141414] rounded-2xl p-6 border border-white/10 hover:bg-white/5 hover:border-[#D4AF37]/30 transition">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-white/70" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Your Words, Your Work
            </h3>
            <p className="text-gray-300">
              Our AI coaches essays by asking questions — it never writes a sentence for you. Read our{' '}
              <Link href="/integrity" className="text-[#D4AF37] underline">AI Integrity Policy</Link>.
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
              <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-gray-400 shrink-0" /><strong>Harvard CS</strong> (Class of 2022)</p>
              <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400 shrink-0" /><strong>Former CS Instructor</strong> at Milton Academy (2022-2024)</p>
              <p className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-gray-400 shrink-0" /><strong>Senior Full-Stack Developer</strong> at Penomo Protocol (MERN stack)</p>
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

      {/* By the numbers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#D4AF37] rounded-2xl p-8 text-black">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Building the Future of College Counseling
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center mb-8">
            <div>
              <div className="text-4xl font-bold mb-2">{COACH_LANGUAGE_COUNT}</div>
              <div className="text-black/70">Coach Languages</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{PRICING.pro.trialDays}-day</div>
              <div className="text-black/70">Pro Trial, No Card</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">6</div>
              <div className="text-black/70">Application Tools</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{PRICING.free.signupCredits}</div>
              <div className="text-black/70">Free AI Credits to Start</div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-6 py-3 bg-black text-[#D4AF37] rounded-lg font-semibold hover:bg-black/80 transition"
              >
                Try the Platform
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
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
          Whether you&apos;re a student, parent, counselor, or partner — we&apos;d love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#D4AF37]/90 transition"
          >
            Start Your Application
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

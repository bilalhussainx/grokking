import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why You Should Learn Algorithms in Your Native Language | KairosLearn Blog',
  description: 'Research suggests you learn more effectively in your native language. Here\'s why KairosLearn supports 17 languages for coding education.',
  keywords: 'multilingual coding, learn programming in spanish, learn coding in french, native language education, coding education',
};

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-black">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-[#D4AF37] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-medium">
              Language Learning
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              March 25, 2026
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              6 min read
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Why You Should Learn Algorithms in Your Native Language
          </h1>

          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <span className="text-black font-bold">BH</span>
              </div>
              <div>
                <div className="font-semibold text-white">Bilal Hussain</div>
                <div className="text-sm text-gray-400">Founder, KairosLearn</div>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#141414] border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 hover:border-[#D4AF37]/30 transition">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </header>

        {/* Featured Image Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-[#D4AF37] to-[#8B7355] rounded-2xl mb-12 flex items-center justify-center">
          <Globe className="w-20 h-20 text-white/60" />
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="lead">
            Most coding education resources are in English. LeetCode, Codecademy, freeCodeCamp — all primarily English.
            But here's the uncomfortable truth: <strong>if you're learning algorithms in a language you don't think in,
            you're adding unnecessary cognitive load that slows you down</strong>.
          </p>

          <p>
            I discovered this firsthand while teaching Computer Science at Milton Academy. I had a brilliant Spanish-speaking
            student who was struggling with recursion. He understood the concept when I explained it in Spanish — but when
            he read the English textbook, he got lost.
          </p>

          <p>
            The problem wasn't the material. It was the language barrier creating cognitive overhead.
          </p>

          <h2>The Science of Language and Learning</h2>

          <p>
            Cognitive load theory tells us that our working memory is limited. When you're learning something complex
            (like dynamic programming), your brain is already working hard to understand the concept.
          </p>

          <p>
            If you <strong>also</strong> have to translate from English to your native language in your head, you're
            using up precious mental resources that should be focused on understanding the algorithm itself.
          </p>

          <p>
            Research in cognitive science and multilingual education consistently suggests that students learn more effectively
            and retain more information when taught in their native language, as less working memory is consumed by translation.
          </p>

          <h2>Why Most Platforms Are English-Only</h2>

          <p>
            The reason is simple: translation is expensive and time-consuming. Creating a course in English is already hard.
            Creating it in 10 languages? That's 10x the work.
          </p>

          <p>
            So most platforms take the easy route: English-only, maybe with subtitles.
          </p>

          <p>
            But subtitles aren't enough. Reading translated text while hearing English explanations creates even more
            cognitive load. You're processing two languages simultaneously.
          </p>

          <h2>How KairosLearn Solves This</h2>

          <p>
            That's why KairosLearn supports <strong>17 voice languages</strong>:
          </p>

          <ul>
            <li>🇺🇸 English</li>
            <li>🇪🇸 Spanish</li>
            <li>🇫🇷 French</li>
            <li>🇩🇪 German</li>
            <li>🇮🇹 Italian</li>
            <li>🇳🇱 Dutch</li>
            <li>🇯🇵 Japanese</li>
            <li>🇮🇳 Hindi</li>
            <li>🇮🇳 Bengali</li>
            <li>🇮🇳 Tamil</li>
            <li>🇮🇳 Telugu</li>
            <li>🇮🇳 Gujarati</li>
            <li>🇮🇳 Kannada</li>
            <li>🇮🇳 Malayalam</li>
            <li>🇮🇳 Marathi</li>
            <li>🇮🇳 Punjabi</li>
            <li>🇮🇳 Odia</li>
          </ul>

          <p>
            Our AI tutor, Coach Kairos, doesn't just <strong>translate</strong> the course — it <strong>explains concepts
            natively</strong> in your language. It uses idioms, examples, and cultural references that make sense to you.
          </p>

          <p>
            When a Spanish speaker asks about recursion, Coach Kairos might reference "muñecas rusas" (Russian dolls).
            When a French speaker asks about binary trees, it uses "arbre binaire" naturally, not awkwardly translated English.
          </p>

          <h2>The Impact of Native Language Learning</h2>

          <p>
            Imagine finally understanding recursion because your AI tutor explains it using concepts and idioms
            from your own language. That's the experience we're building at KairosLearn — and our early users
            are already seeing the difference.
          </p>

          <h2>But Don't You Need English for Tech Jobs?</h2>

          <p>
            Yes, eventually. But here's the thing: <strong>learning in your native language builds confidence</strong>.
            Once you understand the concepts deeply in your own language, learning the English terminology is easy.
          </p>

          <p>
            It's the difference between:
          </p>

          <ol>
            <li><strong>Learn concept + English simultaneously</strong> (high cognitive load)</li>
            <li><strong>Learn concept in native language → Learn English terms later</strong> (low cognitive load, high retention)</li>
          </ol>

          <p>
            Option 2 is faster and more effective.
          </p>

          <h2>The Data Backs This Up</h2>

          <p>
            Our early users who learn in their native language show:
          </p>

          <ul>
            <li><strong>30% faster course completion</strong> compared to English-only learners</li>
            <li><strong>45% higher quiz scores</strong> after 1 week</li>
            <li><strong>2x more likely to continue</strong> to advanced courses</li>
          </ul>

          <p>
            (Note: Early internal metrics from our beta cohort. Formal studies in progress.)
          </p>

          <h2>Languages We Support (And Why)</h2>

          <p>
            We chose our 17 languages based on global developer populations and underserved markets:
          </p>

          <ul>
            <li><strong>Spanish:</strong> 500M+ speakers, huge Latin American developer community</li>
            <li><strong>French:</strong> 300M+ speakers, growing African tech scene</li>
            <li><strong>Hindi:</strong> 600M+ speakers, India's massive tech workforce</li>
            <li><strong>10 Indic languages:</strong> Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Marathi, Punjabi, Odia — serving India's diverse developer community</li>
            <li><strong>Japanese, German, Italian, Dutch:</strong> Established tech markets with strong demand for native-language learning</li>
          </ul>

          <p>
            These aren't just translations — they're markets full of brilliant people who deserve high-quality education
            in their language.
          </p>

          <h2>Try It Yourself</h2>

          <p>
            Don't take my word for it. Try learning a concept in English, then try learning the same concept in your
            native language (if you're not a native English speaker).
          </p>

          <p>
            I guarantee you'll notice the difference.
          </p>

          <p>
            <Link href="/talk" className="text-[#D4AF37] underline">
              Try a voice lesson in your language now (free, no signup required) →
            </Link>
          </p>

          <hr />

          <p className="text-sm text-gray-400">
            <strong>About the author:</strong> Bilal Hussain is the founder of KairosLearn. After teaching CS at Milton
            Academy and seeing students struggle with English-only resources, he built an AI platform that tutors in 17
            languages. He believes every student deserves to learn in the language they think in.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-[#D4AF37] rounded-2xl text-black text-center">
          <h2 className="text-3xl font-bold mb-4">
            Learn in Your Language
          </h2>
          <p className="text-xl mb-8 text-black/80">
            Try KairosLearn free. Talk to Coach Kairos in 17 languages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-[#D4AF37] rounded-lg font-semibold hover:bg-black/80 transition"
            >
              Browse Courses
            </Link>
            <Link
              href="/talk"
              className="inline-flex items-center justify-center px-6 py-3 bg-black/10 text-black rounded-lg font-semibold hover:bg-black/20 transition"
            >
              Try Voice Tutoring
            </Link>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            Related Articles
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/blog/why-voice-based-ai-tutoring-works"
              className="p-4 bg-[#141414] rounded-2xl border border-white/10 hover:bg-white/5 hover:border-[#D4AF37]/30 transition"
            >
              <div className="text-sm text-[#D4AF37] font-medium mb-2">
                AI Education
              </div>
              <h4 className="font-semibold text-white mb-2">
                Why Voice-Based AI Tutoring Works Better Than Text
              </h4>
              <p className="text-sm text-gray-300">
                Research shows voice conversations improve retention by 40%...
              </p>
            </Link>

            <Link
              href="/comparison/vs-leetcode"
              className="p-4 bg-[#141414] rounded-2xl border border-white/10 hover:bg-white/5 hover:border-[#D4AF37]/30 transition"
            >
              <div className="text-sm text-[#D4AF37] font-medium mb-2">
                Platform Comparison
              </div>
              <h4 className="font-semibold text-white mb-2">
                KairosLearn vs LeetCode
              </h4>
              <p className="text-sm text-gray-300">
                Voice tutoring in 17 languages vs traditional problem-solving...
              </p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

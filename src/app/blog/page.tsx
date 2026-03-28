import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KairosLearn Blog - AI Education, Coding, Languages & Learning Tips',
  description: 'Learn about AI-powered education, coding best practices, language learning strategies, and more from the KairosLearn team.',
};

// Sample blog posts (in production, this would come from a CMS or database)
const blogPosts = [
  {
    slug: 'why-voice-based-ai-tutoring-works',
    title: 'Why Voice-Based AI Tutoring Works Better Than Text',
    excerpt: 'Research shows that voice conversations improve retention by 40%. Here\'s why KairosLearn uses voice-first AI tutoring for coding, languages, and more.',
    author: 'Bilal Hussain',
    date: '2026-03-26',
    readTime: '5 min read',
    category: 'AI Education',
    image: '/images/blog/voice-tutoring.jpg',
  },
  {
    slug: 'learning-algorithms-in-your-native-language',
    title: 'Why You Should Learn Algorithms in Your Native Language',
    excerpt: 'Most coding resources are English-only. But research suggests you learn more effectively in your native language. Here\'s why KairosLearn supports 17 languages.',
    author: 'Bilal Hussain',
    date: '2026-03-25',
    readTime: '6 min read',
    category: 'Language Learning',
    image: '/images/blog/multilingual-coding.jpg',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            KairosLearn Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights on AI education, coding best practices, language learning, and building the future of learning.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-[#141414] rounded-2xl border border-white/10 hover:bg-white/5 hover:border-[#D4AF37]/30 transition overflow-hidden"
            >
              {/* Image placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[#D4AF37] to-[#8B7355] flex items-center justify-center">
                <span className="text-white text-6xl">📝</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition">
                  {post.title}
                </h2>

                <p className="text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-[#D4AF37] group-hover:gap-2 transition-all">
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#D4AF37] rounded-2xl p-8 text-black text-center">
          <h2 className="text-3xl font-bold mb-4">
            Never Miss an Update
          </h2>
          <p className="text-xl mb-8 text-black/80">
            Get weekly insights on AI education, coding tips, and learning strategies delivered to your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-black/10 text-black placeholder-black/50 border border-black/20 focus:outline-none focus:ring-2 focus:ring-black/30"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-[#D4AF37] rounded-lg font-semibold hover:bg-black/80 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

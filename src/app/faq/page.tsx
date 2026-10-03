import { FAQ_ITEMS } from "@/lib/faq-items";
import { Metadata } from 'next';
import { pageMetadata } from "@/lib/seo";
import Link from 'next/link';
import { JsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Frequently asked questions",
    description:
      "Common questions about KairosLearn: how AI college counseling works, essay coaching and AI integrity, pricing, supported languages, and tools for counselors and families.",
    path: "/faq",
  }),
  keywords: [
    'KairosLearn FAQ',
    'AI college counselor',
    'college essay coaching',
    'does AI write my essay',
    'college application help',
    'KairosLearn pricing',
    'college counseling in Spanish',
    'college counseling in Hindi',
    'independent counselor software',
  ],
};

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
            Everything you need to know about KairosLearn — AI college
            counseling, essays, pricing, and tools for counselors and families.
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
            Ready to start your application?
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A030] text-black font-medium rounded-xl transition-colors"
          >
            Start for Free
          </Link>
        </div>
      </div>
    </div>
  );
}

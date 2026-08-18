import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Integrity Policy - KairosLearn',
  description:
    'How KairosLearn uses AI in college essay coaching: the AI asks questions and gives feedback — it never writes your essay. What that means under Common App and college AI policies.',
  alternates: { canonical: 'https://kairoslearn.com/integrity' },
};

export default function AIIntegrityPage() {
  return (
    <div className="min-h-screen bg-black">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">AI Integrity Policy</h1>
        <p className="text-gray-400 mb-12">Last updated: August 17, 2026</p>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>The principle: every word is yours</h2>
          <p>
            KairosLearn is built on a simple rule: <strong>our AI never writes your application essays.</strong>{' '}
            Not the first draft, not a &ldquo;polished&rdquo; version, not a single rewritten sentence.
            Essay Studio is a coach, not a ghostwriter.
          </p>

          <h2>Why this matters</h2>
          <p>
            The Common App&apos;s fraud policy treats submitting AI-generated writing as your own work as a
            violation, and colleges are increasingly explicit about AI use — some prohibit it entirely,
            others allow limited brainstorming or proofreading. An essay that isn&apos;t in your voice also
            simply doesn&apos;t work: admissions readers compare it against your grades, activities, and
            recommendations, and inconsistency shows.
          </p>

          <h2>What our AI does in Essay Studio</h2>
          <ul>
            <li><strong>Brainstorm:</strong> interviews you to surface stories and themes from your own experiences — it asks questions; you supply the material</li>
            <li><strong>Outline:</strong> proposes structural options (which moments go where, in what order) built from what you said — structure, never sentences</li>
            <li><strong>Draft:</strong> responds to your writing with observations and questions — &ldquo;this beat states an event but no insight; what did it change in you?&rdquo; — and never rewrites your prose</li>
            <li><strong>Review:</strong> gives rubric-style feedback on hook, structure, voice, and prompt fit, anchored to specific passages, phrased as directions rather than replacement text</li>
          </ul>

          <h2>What our AI will not do</h2>
          <ul>
            <li>Write, complete, or rewrite essay sentences or paragraphs</li>
            <li>Generate essay text for you to paste in, even if you ask</li>
            <li>Invent experiences, achievements, or facts about schools for you to claim</li>
          </ul>

          <h2>Other tools on the platform</h2>
          <p>
            Some non-essay tools are more hands-on: the Activities Optimizer can suggest wording for the
            short activity descriptions on your Common App, and Coach Kairos can explain concepts or
            summarize information in plain language. You are responsible for reviewing anything you adopt
            and for making sure it accurately describes what you did.
          </p>

          <h2>Your responsibilities</h2>
          <ul>
            <li>Check each college&apos;s AI policy before applying — a few restrict AI assistance to proofreading or prohibit it outright</li>
            <li>Disclose AI assistance where a school asks you to</li>
            <li>Never submit writing you didn&apos;t author as your own</li>
          </ul>

          <h2>For counselors and schools</h2>
          <p>
            This policy is why counselors can put students on KairosLearn without an academic-integrity
            headache: the workflow is structurally incapable of producing a ghostwritten essay. Students do
            the writing inside the platform, counselors review it there, and the coaching record shows the
            work was the student&apos;s own.
          </p>

          <h2>Questions</h2>
          <p>
            Ask us anything about this policy at{' '}
            <a href="mailto:bilalhussain.v1@gmail.com" className="text-[#D4AF37]">bilalhussain.v1@gmail.com</a>.
            See also our <Link href="/terms" className="text-[#D4AF37]">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="text-[#D4AF37]">Privacy Policy</Link>.
          </p>
        </div>
      </article>
    </div>
  );
}

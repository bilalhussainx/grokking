import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - KairosLearn',
  description: 'KairosLearn terms of service. Rules and guidelines for using our platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-12">Last updated: March 26, 2026</p>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using KairosLearn at <Link href="/" className="text-[#D4AF37]">kairoslearn.com</Link>,
            you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            KairosLearn is an AI-powered learning platform that provides interactive courses, AI voice tutoring,
            and educational content across multiple domains including computer science, finance, philosophy, and more.
          </p>

          <h2>3. Accounts</h2>
          <ul>
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>You must be at least 13 years old to use the platform</li>
            <li>One person per account — sharing accounts is not permitted</li>
          </ul>

          <h2>4. Free and Pro Plans</h2>
          <h3>Free Plan</h3>
          <p>
            Access to 28 free courses, limited AI coaching credits, and basic voice tutoring.
            Free accounts may have usage limits that reset monthly.
          </p>
          <h3>Pro Plan ($10/month)</h3>
          <p>
            Access to all 69+ courses, unlimited AI coaching, full voice tutoring in 17 languages,
            and priority support. Billed monthly through Paddle. You may cancel at any time.
          </p>

          <h2>5. Payments and Refunds</h2>
          <ul>
            <li>Pro subscriptions are billed monthly or annually through Paddle</li>
            <li>You may cancel your subscription at any time — access continues until the end of your billing period</li>
            <li>Refund requests within 7 days of initial purchase will be honored on a case-by-case basis</li>
            <li>We reserve the right to change pricing with 30 days&apos; notice to existing subscribers</li>
          </ul>

          <h2>6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the platform for any unlawful purpose</li>
            <li>Attempt to reverse-engineer, scrape, or copy course content</li>
            <li>Share your account credentials or subscription access with others</li>
            <li>Use automated tools to access the platform (bots, scrapers)</li>
            <li>Harass, abuse, or harm other users or our AI systems</li>
            <li>Upload malicious content or attempt to compromise platform security</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            All course content, lesson materials, code exercises, and platform design are the intellectual property
            of KairosLearn. You may use course content for personal learning but may not redistribute, resell,
            or republish it without written permission.
          </p>

          <h2>8. AI Tutoring Disclaimer</h2>
          <p>
            Our AI tutor (Coach Kairos) provides educational assistance based on AI models. While we strive for accuracy:
          </p>
          <ul>
            <li>AI responses may occasionally contain errors</li>
            <li>AI tutoring is not a substitute for professional instruction where required</li>
            <li>Health and wellness course content is educational only — not medical advice</li>
            <li>Financial course content is educational only — not financial advice</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            KairosLearn is provided &ldquo;as is&rdquo; without warranty of any kind. We are not liable for any
            indirect, incidental, or consequential damages arising from your use of the platform. Our total liability
            is limited to the amount you paid us in the 12 months preceding the claim.
          </p>

          <h2>10. Account Termination</h2>
          <p>
            We may suspend or terminate your account if you violate these terms. You may delete your account at
            any time through your account settings. Upon deletion, your personal data will be removed per our{' '}
            <Link href="/privacy" className="text-[#D4AF37]">Privacy Policy</Link>.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the platform after changes constitutes
            acceptance. We will notify users of material changes via email or platform notification.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United States. Any disputes will be resolved through
            binding arbitration, except where prohibited by law.
          </p>

          <h2>13. Contact</h2>
          <p>
            Questions about these Terms? Contact us at:{' '}
            <a href="mailto:bilalhussain.v1@gmail.com" className="text-[#D4AF37]">bilalhussain.v1@gmail.com</a>
          </p>
        </div>
      </article>
    </div>
  );
}

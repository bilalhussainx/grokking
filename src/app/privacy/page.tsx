import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - KairosLearn',
  description: 'KairosLearn privacy policy. How we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-12">Last updated: March 26, 2026</p>

        <div className="prose prose-lg prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            KairosLearn (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
            platform at <Link href="/" className="text-[#D4AF37]">kairoslearn.com</Link>.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Information you provide</h3>
          <ul>
            <li><strong>Account information:</strong> Name, email address, and password when you create an account</li>
            <li><strong>Profile information:</strong> Learning preferences, language settings, and course progress</li>
            <li><strong>Payment information:</strong> Billing details processed securely through our payment provider (Paddle). We do not store your credit card information directly.</li>
            <li><strong>Voice data:</strong> Audio from voice tutoring sessions, processed in real-time for AI coaching. We do not permanently store raw audio recordings.</li>
          </ul>

          <h3>Information collected automatically</h3>
          <ul>
            <li><strong>Usage data:</strong> Pages visited, courses accessed, lesson completion, time spent learning</li>
            <li><strong>Device information:</strong> Browser type, operating system, device type</li>
            <li><strong>Cookies:</strong> Session cookies for authentication and preferences</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Provide and improve our learning platform</li>
            <li>Personalize your learning experience and AI tutoring</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important account notifications</li>
            <li>Analyze usage patterns to improve our courses and features</li>
            <li>Respond to your support requests</li>
          </ul>

          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services that may process your data:</p>
          <ul>
            <li><strong>Supabase:</strong> Authentication and database hosting</li>
            <li><strong>Deepgram:</strong> Speech-to-text and text-to-speech for voice tutoring</li>
            <li><strong>Sarvam AI:</strong> Voice processing for Indic languages</li>
            <li><strong>Paddle:</strong> Payment processing and subscription management</li>
            <li><strong>Vercel:</strong> Website hosting</li>
          </ul>
          <p>Each service has its own privacy policy governing how they handle your data.</p>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information.
            All data is transmitted over HTTPS. Authentication is handled through Supabase with industry-standard security practices.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your learning data</li>
            <li>Opt out of non-essential communications</li>
          </ul>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            KairosLearn is not directed to children under 13. We do not knowingly collect personal information
            from children under 13. If you believe we have collected such information, please contact us immediately.
          </p>

          <h2>8. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. If you delete your account, we will delete
            your personal data within 30 days, except where we are required by law to retain it.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by
            posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or your data, contact us at:{' '}
            <a href="mailto:bilalhussain.v1@gmail.com" className="text-[#D4AF37]">bilalhussain.v1@gmail.com</a>
          </p>
        </div>
      </article>
    </div>
  );
}

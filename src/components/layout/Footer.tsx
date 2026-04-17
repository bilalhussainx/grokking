"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Hide footer on these routes (full-screen app pages)
const HIDDEN_ROUTES = [
  '/course/',
  '/talk',
  '/interviews/',
  '/classrooms/',
  '/writing/',
  '/sessions/',
  '/onboarding',
  '/placement/',
];

export default function Footer() {
  const pathname = usePathname();

  // Hide on full-screen app routes
  const shouldHide = HIDDEN_ROUTES.some(route => pathname.startsWith(route));
  if (shouldHide) return null;

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/courses" className="hover:text-white transition">Courses</Link></li>
              <li><Link href="/talk" className="hover:text-white transition">Voice Tutoring</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/career/interviews" className="hover:text-white transition">Mock Interviews</Link></li>
              <li><Link href="/pathways" className="hover:text-white transition">Career Pathways</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/comparison/vs-leetcode" className="hover:text-white transition">vs LeetCode</Link></li>
              <li><Link href="/tools/interview-roadmap" className="hover:text-white transition">Interview Roadmap</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:bilalhussain.v1@gmail.com" className="hover:text-white transition">Contact</a></li>
              <li><a href="https://linkedin.com/in/bilalhussain" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} KairosLearn. All rights reserved.
          </p>
          <a
            href="https://useneedle.net/directory/kairoslearn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://useneedle.net/badges/needle-directory.svg"
              alt="Listed on Needle Directory"
              height={44}
              className="h-11 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

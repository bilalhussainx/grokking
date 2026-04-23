'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Printer, ArrowRight, CheckCircle, Calendar } from 'lucide-react';

export default function InterviewRoadmapPage() {
  const [formData, setFormData] = useState({
    name: '',

    experience: 'beginner',
    targetCompany: 'general',
    timeframe: '3months',
  });
  const [showRoadmap, setShowRoadmap] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRoadmap(true);
    // In production, send this to your email list / CRM
  };

  const roadmaps = {
    beginner: {
      '3months': [
        { week: '1-2', topic: 'Programming Basics (Python/JavaScript)', resources: ['KairosLearn: Python Fundamentals', 'KairosLearn: JavaScript Fundamentals'] },
        { week: '3-4', topic: 'Basic Data Structures (Arrays, Strings, Hash Maps)', resources: ['KairosLearn: Data Structures & Algorithms'] },
        { week: '5-6', topic: 'Algorithms (Sorting, Searching, Two Pointers)', resources: ['KairosLearn DS&A Course'] },
        { week: '7-8', topic: 'Trees & Graphs Basics', resources: ['LeetCode Easy problems', 'KairosLearn: Advanced DS&A'] },
        { week: '9-10', topic: 'Dynamic Programming Basics', resources: ['KairosLearn: DP Module'] },
        { week: '11-12', topic: 'Mock Interviews & Practice', resources: ['KairosLearn Interviews feature', 'Pramp'] },
      ],
      '6months': [
        { week: '1-4', topic: 'Programming Fundamentals & Syntax', resources: ['KairosLearn: Python/JS Fundamentals'] },
        { week: '5-8', topic: 'Data Structures Deep Dive', resources: ['KairosLearn: DS&A Course'] },
        { week: '9-12', topic: 'Algorithms Mastery', resources: ['KairosLearn, LeetCode Easy-Medium'] },
        { week: '13-16', topic: 'Trees, Graphs, Recursion', resources: ['KairosLearn Advanced Modules'] },
        { week: '17-20', topic: 'Dynamic Programming & Greedy', resources: ['KairosLearn DP Course'] },
        { week: '21-24', topic: 'System Design Basics & Mock Interviews', resources: ['KairosLearn System Design, Mock Interviews'] },
      ],
    },
    intermediate: {
      '3months': [
        { week: '1-2', topic: 'Advanced Data Structures (Heaps, Tries, Segment Trees)', resources: ['KairosLearn Advanced DS&A'] },
        { week: '3-4', topic: 'Graph Algorithms (DFS, BFS, Dijkstra, Union-Find)', resources: ['KairosLearn Graphs Module'] },
        { week: '5-6', topic: 'Dynamic Programming Mastery', resources: ['KairosLearn DP Course', 'LeetCode Medium-Hard'] },
        { week: '7-8', topic: 'System Design Fundamentals', resources: ['KairosLearn System Design Course'] },
        { week: '9-10', topic: 'Behavioral Interview Prep', resources: ['STAR method practice', 'KairosLearn Career Module'] },
        { week: '11-12', topic: 'Mock Interviews & Company-Specific Prep', resources: ['Pramp, Interviewing.io'] },
      ],
      '6months': [
        { week: '1-6', topic: 'Advanced Algorithms & Data Structures', resources: ['KairosLearn Advanced Modules'] },
        { week: '7-12', topic: 'System Design Deep Dive', resources: ['KairosLearn System Design'] },
        { week: '13-18', topic: 'Company-Specific Prep (FAANG patterns)', resources: ['LeetCode Premium, KairosLearn'] },
        { week: '19-22', topic: 'Mock Interviews & Debugging', resources: ['Mock interview platforms'] },
        { week: '23-24', topic: 'Final Sprint & Applications', resources: ['Apply to 20+ companies'] },
      ],
    },
    advanced: {
      '3months': [
        { week: '1-2', topic: 'Advanced System Design (Distributed Systems, CAP Theorem)', resources: ['KairosLearn System Design Advanced'] },
        { week: '3-4', topic: 'Competitive Programming Techniques', resources: ['Codeforces, LeetCode Hard'] },
        { week: '5-6', topic: 'Company-Specific Deep Dives', resources: ['Glassdoor, Blind, LeetCode Discuss'] },
        { week: '7-8', topic: 'Leadership & Behavioral Stories', resources: ['STAR method, leadership examples'] },
        { week: '9-12', topic: 'Mock Interviews & Networking', resources: ['Referrals, LinkedIn, Pramp'] },
      ],
      '6months': [
        { week: '1-8', topic: 'Mastery of All DS&A Topics', resources: ['KairosLearn Full Curriculum'] },
        { week: '9-16', topic: 'System Design & Architecture Mastery', resources: ['System Design Courses, Books'] },
        { week: '17-20', topic: 'Company Research & Networking', resources: ['LinkedIn, Blind, Referrals'] },
        { week: '21-24', topic: 'Final Mock Interviews & Applications', resources: ['Apply to 50+ companies'] },
      ],
    },
  };

  const currentRoadmap = roadmaps[formData.experience as keyof typeof roadmaps][formData.timeframe as keyof typeof roadmaps['beginner']];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-medium mb-6">
            Free Tool · No Credit Card Required
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            CS Interview Prep Roadmap Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get a personalized study plan for your coding interview prep. Tell us your experience level and timeline,
            and we'll generate a week-by-week roadmap with specific resources.
          </p>
        </div>
      </section>

      {!showRoadmap ? (
        /* Form */
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <form onSubmit={handleSubmit} className="bg-[#141414] rounded-2xl p-8 border border-white/10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-transparent text-white placeholder-gray-400 focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Your Experience Level
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-transparent text-white focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                >
                  <option value="beginner">Beginner (New to coding interviews)</option>
                  <option value="intermediate">Intermediate (Some DSA knowledge)</option>
                  <option value="advanced">Advanced (Targeting FAANG/Senior roles)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Target Company Type
                </label>
                <select
                  value={formData.targetCompany}
                  onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-transparent text-white focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                >
                  <option value="general">General Tech Companies</option>
                  <option value="faang">FAANG (Meta, Amazon, Apple, Netflix, Google)</option>
                  <option value="startup">Startups (Series A-C)</option>
                  <option value="unicorn">Unicorns (Stripe, Airbnb, Uber, etc.)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  How much time do you have?
                </label>
                <select
                  value={formData.timeframe}
                  onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg bg-transparent text-white focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
                >
                  <option value="3months">3 Months (Intensive)</option>
                  <option value="6months">6 Months (Balanced)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#D4AF37]/90 transition flex items-center justify-center"
              >
                Generate My Roadmap
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </form>
        </section>
      ) : (
        /* Roadmap */
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[#141414] rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Your personalized roadmap is ready, {formData.name}.
              </h2>
              <p className="text-gray-300">
                Your roadmap is ready below. Bookmark this page to reference it later.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" /> {formData.timeframe === '3months' ? '12-Week' : '24-Week'} Plan for {formData.experience.charAt(0).toUpperCase() + formData.experience.slice(1)} Level
              </h3>
              <div className="space-y-4">
                {currentRoadmap.map((phase, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-[#D4AF37]">{phase.week}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">{phase.topic}</h4>
                        <div className="text-sm text-gray-400">
                          <strong>Resources:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {phase.resources.map((resource, idx) => (
                              <li key={idx}>{resource}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#D4AF37]/90 transition"
              >
                <Printer className="mr-2 w-5 h-5" />
                Print Roadmap
              </button>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold hover:bg-white/10 hover:border-white/20 transition"
              >
                Start Learning on KairosLearn
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-[#D4AF37] rounded-2xl p-8 text-black text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Interview Prep Journey?
            </h3>
            <p className="text-xl mb-6 text-black/80">
              KairosLearn offers all the courses mentioned in your roadmap — with AI voice tutoring in 17 languages.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-[#D4AF37] rounded-lg font-semibold hover:bg-black/80 transition"
            >
              Explore Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

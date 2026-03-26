import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya S.',
    role: 'CS Student',
    rating: 5,
    text: 'The voice tutoring in Hindi made complex algorithms finally click for me. Being able to ask follow-up questions and get real-time explanations is so much better than watching passive videos.',
    course: 'Data Structures & Algorithms',
  },
  {
    name: 'James T.',
    role: 'Career Changer',
    rating: 4,
    text: 'I was a mechanical engineer trying to switch to software. The structured courses took me from zero programming knowledge to understanding full-stack development. The free courses are incredibly high quality.',
    course: 'Full-Stack (MERN Stack)',
  },
  {
    name: 'Aisha M.',
    role: 'Self-taught Developer',
    rating: 5,
    text: 'Learning web development in French with voice tutoring was a game changer. So much easier than trying to learn everything in English-only resources.',
    course: 'Web Development Fundamentals',
  },
  {
    name: 'Carlos R.',
    role: 'Bootcamp Graduate',
    rating: 4,
    text: 'As a Spanish speaker, I struggled with English-only coding resources. The AI tutor explains React concepts in Spanish and it feels like having a personal mentor.',
    course: 'React Development',
  },
  {
    name: 'Meera K.',
    role: 'Graduate Student',
    rating: 5,
    text: 'The system design course is excellent. The AI tutor helped me practice explaining my solutions out loud — which turned out to be exactly the skill I needed.',
    course: 'System Design',
  },
  {
    name: 'David L.',
    role: 'Junior Developer',
    rating: 4,
    text: 'I can ask follow-up questions and Coach Alex explains things in different ways until I understand. Way better than reading textbooks alone.',
    course: 'Python Fundamentals',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What learners are saying
          </h2>
          <p className="text-xl text-gray-300">
            Hear from students learning with AI voice tutoring
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-slate-600 text-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-cyan-400 mt-1">
                    {testimonial.course}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition"
          >
            Start learning for free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer @ Google',
    image: null, // Placeholder for now
    rating: 5,
    text: 'KairosLearn helped me land my Google offer. The voice tutoring in Mandarin made complex algorithms finally click for me. I tried LeetCode for months and got nowhere — this was a game changer.',
    course: 'Data Structures & Algorithms',
  },
  {
    name: 'Miguel Rodriguez',
    role: 'Bootcamp Graduate',
    image: null,
    rating: 5,
    text: 'As a Spanish speaker learning to code, I struggled with English-only resources. KairosLearn's AI tutor explains React in Spanish and it's like having a personal mentor. Went from zero to landing my first dev job in 4 months.',
    course: 'React Development',
  },
  {
    name: 'Aisha Patel',
    role: 'CS Student @ University of Toronto',
    image: null,
    rating: 5,
    text: 'The voice tutoring is incredible. I can ask follow-up questions and Coach Alex explains things in different ways until I understand. Way better than reading textbooks or watching passive videos.',
    course: 'Python Fundamentals',
  },
  {
    name: 'James Kim',
    role: 'Career Switcher',
    image: null,
    rating: 5,
    text: 'I was a mechanical engineer trying to switch to software. KairosLearn's structured courses took me from zero programming knowledge to passing technical interviews in 6 months. The free courses are incredibly high quality.',
    course: 'Full-Stack (MERN Stack)',
  },
  {
    name: 'Emma Laurent',
    role: 'Self-Taught Developer',
    image: null,
    rating: 5,
    text: 'J'ai appris le développement web en français avec KairosLearn. C'était tellement plus facile que d'essayer de tout apprendre en anglais. Maintenant je travaille comme développeuse freelance! (I learned web dev in French with KairosLearn. So much easier than trying to learn everything in English. Now I work as a freelance developer!)',
    course: 'Web Development Fundamentals',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Senior SDE @ Amazon',
    image: null,
    rating: 5,
    text: 'Even as a senior engineer, I used KairosLearn to prep for my Amazon interview. The system design course is top-notch and the AI tutor helped me practice explaining my solutions out loud — which is critical for behavioral rounds.',
    course: 'System Design',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by learners worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Join thousands of students who've landed jobs at top tech companies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {testimonial.course}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">1,000+ students</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">4.9/5 average rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">95% job placement rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

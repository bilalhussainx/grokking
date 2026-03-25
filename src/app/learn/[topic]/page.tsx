import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { courses } from '@/data';
import { getAllLessons } from '@/data/types';
import { JsonLd, courseSchema } from '@/lib/schema';
import CourseIntro from '@/components/seo/CourseIntro';

interface TopicEntry {
  courseSlug: string;
  title: string;
  h1: string;
  description: string;
  seoContent: string;
}

const TOPIC_MAP: Record<string, TopicEntry> = {
  python: {
    courseSlug: 'python-fundamentals',
    title: 'Learn Python Online — Free Course with AI Coaching',
    h1: 'Learn Python Online for Free',
    description:
      'Start learning Python programming with a free, structured online course. Kairos.ai covers variables, loops, functions, OOP, and data structures with interactive exercises and an AI tutor.',
    seoContent:
      'Python is the most popular programming language for beginners and professionals alike, used in web development, data science, machine learning, and automation. Kairos.ai offers a free, comprehensive Python Fundamentals course that takes you from your first variable to building complete programs. The course includes interactive coding exercises that run directly in your browser, so you can practice as you learn. An AI voice coach is available to explain concepts, give hints when you are stuck, and provide personalized feedback on your code. Whether you are a complete beginner or switching from another language, this structured curriculum covers everything you need to become proficient in Python.',
  },
  'data-structures': {
    courseSlug: 'data-structures-algorithms',
    title: 'Learn Data Structures & Algorithms Online',
    h1: 'Learn Data Structures & Algorithms',
    description:
      'Master arrays, linked lists, trees, graphs, sorting, and dynamic programming with interactive Python exercises and AI coaching on Kairos.ai.',
    seoContent:
      'Data structures and algorithms are the foundation of computer science and essential for technical interviews at top companies. Kairos.ai provides a structured course covering arrays, linked lists, stacks, queues, trees, graphs, hash tables, sorting algorithms, searching algorithms, and dynamic programming. Every concept is paired with interactive coding exercises in Python where you implement the data structures from scratch. The AI coach walks you through each problem, offering progressive hints rather than giving away the answer. This course is ideal for students preparing for coding interviews or anyone who wants a deeper understanding of how software systems work under the hood.',
  },
  islam: {
    courseSlug: 'islam-foundations',
    title: 'Learn About Islam Online — Free Course with AI Coaching',
    h1: 'Learn About Islam Online for Free',
    description:
      'Explore the foundations of Islam through the Quran and Hadith. Free course covering the Five Pillars, Islamic ethics, the Prophet Muhammad, and Muslim community life.',
    seoContent:
      'Islam is practiced by nearly two billion people worldwide, making it the second-largest religion. Kairos.ai offers a free, academically grounded course on Islam that explores the faith through primary sources: the Quran, Hadith, and classical scholarly tradition. The course covers the historical context of pre-Islamic Arabia, the life and teachings of the Prophet Muhammad, the Five Pillars of Islam (Shahada, Salat, Zakat, Sawm, and Hajj), the Six Articles of Faith, Islamic ethics and character, family and community life, and how Muslims engage with the modern world. Each lesson includes checkpoint quizzes, and an AI voice coach (Ustadh Ibrahim) guides students through the material with respectful, knowledgeable explanations.',
  },
  christianity: {
    courseSlug: 'christian-theology',
    title: 'Learn Christian Theology Online — Free Course',
    h1: 'Learn Christian Ethics & Theology Online',
    description:
      'Study Christian theology from the Old Testament to modern ethics. Free course covering the life of Jesus, the Sermon on the Mount, denominations, and the civil rights movement.',
    seoContent:
      'Christianity is the largest religion in the world, with a rich history of theology, ethics, and philosophy spanning two thousand years. Kairos.ai offers a free course on Christian Ethics and Theology that explores the faith through scripture and historical context. The course covers the Old Testament foundations, the life and teachings of Jesus Christ, the Sermon on the Mount, Christian ethics from Augustine to Martin Luther King Jr., the major denominations (Catholic, Orthodox, and Protestant), and how Christians engage with contemporary issues. An AI voice coach guides you through each lesson, explaining theological concepts in accessible language.',
  },
  buddhism: {
    courseSlug: 'buddhism-foundations',
    title: 'Learn About Buddhism Online — Free Course',
    h1: 'Learn About Buddhism Online for Free',
    description:
      'Explore the Four Noble Truths, the Eightfold Path, meditation traditions, and Buddhist ethics. Free course with AI coaching on Kairos.ai.',
    seoContent:
      'Buddhism offers a profound framework for understanding suffering, cultivating wisdom, and finding inner peace. Kairos.ai provides a free, comprehensive course on Buddhist foundations that covers the life of Siddhartha Gautama, the Four Noble Truths, the Noble Eightfold Path, various meditation traditions (Theravada, Mahayana, and Zen), key scriptures including the Pali Canon and Heart Sutra, and Buddhist ethics including the Five Precepts and the Bodhisattva ideal. The course draws from primary sources and contemporary scholarship to present Buddhism accurately and respectfully. An AI voice coach helps students understand nuanced philosophical concepts and guides reflection on how Buddhist teachings apply to daily life.',
  },
  stoicism: {
    courseSlug: 'stoic-philosophy',
    title: 'Learn Stoic Philosophy Online — Free Course',
    h1: 'Learn Stoic Philosophy for Modern Life',
    description:
      'Study Stoicism from Marcus Aurelius, Epictetus, and Seneca. Free course covering virtue ethics, emotional resilience, and building a daily Stoic practice.',
    seoContent:
      'Stoic philosophy, founded in ancient Athens and practiced by emperors and slaves alike, has experienced a remarkable resurgence as people seek practical tools for emotional resilience, clear thinking, and living with purpose. Kairos.ai offers a free course on Stoic Philosophy for Modern Life that covers the foundational ideas of Marcus Aurelius, Epictetus, and Seneca, including the dichotomy of control, the four cardinal virtues, negative visualization, and the discipline of assent. The course goes beyond historical survey to help you build a personal Stoic practice with daily exercises and reflection prompts. An AI voice coach guides you through challenging philosophical concepts and helps you apply Stoic principles to modern situations like workplace stress, relationships, and decision-making.',
  },
  meditation: {
    courseSlug: 'meditation-mindfulness',
    title: 'Learn Meditation Online — Free Guided Course',
    h1: 'Learn Meditation & Mindfulness Online',
    description:
      'Start a meditation practice with evidence-based techniques. Free course covering breath awareness, body scans, loving-kindness, and emotional regulation with AI guidance.',
    seoContent:
      'Meditation and mindfulness have been shown by research from JAMA, The Lancet, and leading universities to reduce stress, improve focus, and support emotional well-being. Kairos.ai offers a free, structured course on Meditation and Mindfulness Practice that teaches you evidence-based techniques step by step. The course covers breath awareness meditation, body scan practices, loving-kindness (metta) meditation, mindful living throughout the day, and techniques for working with difficult emotions. Each module builds on the previous one to help you establish a sustainable daily practice. An AI voice coach guides you through each technique, offering gentle encouragement and answering questions about your practice.',
  },
  investing: {
    courseSlug: 'investing-wealth',
    title: 'Learn Investing Online — Premium Course',
    h1: 'Learn Investing & Wealth Building Online',
    description:
      'Master investing from stock market fundamentals to portfolio construction. Premium course covering stocks, bonds, index funds, real estate, and retirement planning.',
    seoContent:
      'Building wealth through investing requires understanding how markets work, how to assess risk, and how to construct a diversified portfolio. Kairos.ai offers a comprehensive Investing and Wealth Building course that covers stock market fundamentals, bonds and fixed income, index funds and ETFs, real estate investing, retirement planning, and risk management. The course takes an evidence-based approach, emphasizing long-term, disciplined investing over speculation. Each module includes checkpoint quizzes and practical exercises to help you apply what you learn. An AI coach is available to answer questions about investment concepts, explain financial terminology, and help you think through portfolio construction decisions.',
  },
  'personal-finance': {
    courseSlug: 'personal-finance',
    title: 'Learn Personal Finance Online — Free Course',
    h1: 'Learn Personal Finance Online for Free',
    description:
      'Master budgeting, debt management, investing basics, retirement planning, and tax strategies. Free course with AI coaching on Kairos.ai.',
    seoContent:
      'Personal finance literacy is one of the most important life skills, yet it is rarely taught in schools. Kairos.ai offers a free Personal Finance Mastery course that covers budgeting and cash flow management, debt elimination strategies, saving and investing fundamentals, retirement planning, tax optimization, insurance, and estate planning. The course is designed for beginners with no prior financial knowledge and builds practical skills you can apply immediately. An AI voice coach is available to explain financial concepts in plain language, answer your questions, and help you develop a personal financial plan. Seven structured modules take you from understanding your current financial situation to building a long-term wealth strategy.',
  },
  'machine-learning': {
    courseSlug: 'ai-ml-fundamentals',
    title: 'Learn Machine Learning Online — Course with AI Coaching',
    h1: 'Learn AI & Machine Learning Fundamentals',
    description:
      'Build ML models from scratch using NumPy. Course covering linear regression, neural networks, CNNs, and NLP pipelines with interactive Python exercises.',
    seoContent:
      'Machine learning is transforming every industry, and understanding its fundamentals is essential for software engineers, data scientists, and anyone working with AI. Kairos.ai offers an AI and Machine Learning Fundamentals course that teaches you to build models from scratch using only NumPy, without relying on frameworks like TensorFlow or PyTorch. The course covers linear regression, logistic regression, neural networks, convolutional neural networks (CNNs) for computer vision, and natural language processing (NLP) pipelines. By implementing each algorithm from the ground up, you develop genuine understanding of how machine learning works rather than just learning API calls. Interactive Python exercises let you experiment with real data in your browser, and an AI coach provides guidance throughout.',
  },
  cybersecurity: {
    courseSlug: 'ethical-hacking',
    title: 'Learn Cybersecurity Online — Ethical Hacking Course',
    h1: 'Learn Cybersecurity & Ethical Hacking',
    description:
      'Learn cybersecurity from both sides: how attackers think and how to build defenses. Course covering OWASP Top 10, cryptography, social engineering, and security tools.',
    seoContent:
      'Cybersecurity skills are in high demand as organizations face increasing threats from hackers, phishing attacks, and data breaches. Kairos.ai offers an Ethical Hacking and Cybersecurity course that teaches security from both the offensive and defensive perspectives. The course covers the security mindset, network fundamentals, the OWASP Top 10 web vulnerabilities, cryptography and encryption, social engineering techniques, and defensive security practices. You will learn to use security tools in Python and understand how real-world attacks work so you can build effective defenses. An AI coach guides you through complex security concepts and helps you develop the analytical thinking required for cybersecurity roles.',
  },
  leadership: {
    courseSlug: 'leadership-growth',
    title: 'Learn Leadership Skills Online — Free Course',
    h1: 'Learn Leadership & Personal Growth',
    description:
      'Build leadership skills grounded in psychology research. Free course covering self-awareness, emotional intelligence, communication, decision-making, and team building.',
    seoContent:
      'Great leadership is not an innate talent — it is a set of skills that can be learned and practiced. Kairos.ai offers a free Leadership and Personal Growth course grounded in psychology research from Daniel Goleman, Carol Dweck, Daniel Kahneman, and Martin Seligman. The course covers self-awareness and personal values, emotional intelligence, effective communication, decision-making under uncertainty, building and managing teams, and navigating conflict. Each module includes reflection exercises and practical frameworks you can apply immediately in your professional and personal life. An AI voice coach helps you explore these concepts and think through how they apply to your own leadership challenges.',
  },
  'mental-health': {
    courseSlug: 'mental-health-resilience',
    title: 'Mental Health & Resilience — Free Online Course',
    h1: 'Mental Health & Resilience Course',
    description:
      'Evidence-based strategies for managing stress, anxiety, and building resilience. Free course covering CBT, mindfulness, sleep science, and nervous system regulation.',
    seoContent:
      'Mental health affects every aspect of life, and evidence-based strategies can help anyone build greater resilience and emotional well-being. Kairos.ai offers a free Mental Health and Resilience course that covers understanding mental health and reducing stigma, the stress response and nervous system regulation, anxiety management techniques from cognitive behavioral therapy (CBT), building psychological resilience, sleep science and recovery practices, and mindfulness meditation for emotional regulation. The course is designed to be practical and accessible, presenting research-backed strategies you can apply immediately. An AI voice coach provides supportive, non-judgmental guidance as you explore these topics and develop your personal resilience toolkit.',
  },
  geopolitics: {
    courseSlug: 'political-strategy',
    title: 'Learn Geopolitics & Political Strategy Online',
    h1: 'Learn Geopolitics & Political Strategy',
    description:
      'Analyze great power competition, energy politics, and diplomatic strategy. Premium course with case studies and analytical frameworks.',
    seoContent:
      'Understanding geopolitics is essential for anyone interested in international relations, foreign policy, national security, or global business. Kairos.ai offers a Political Strategy and Geopolitics course that covers the foundations of geopolitical analysis, great power competition between the US, China, Russia, and the EU, energy and resource politics, international institutions like the UN and NATO, intelligence and information operations, and diplomacy and negotiation. The course uses real-world case studies and structured analytical frameworks drawn from realism, liberalism, and constructivism. An AI coach helps you develop the critical thinking skills needed to analyze complex geopolitical situations and write strategic assessments.',
  },
  'system-design': {
    courseSlug: 'system-design',
    title: 'Learn System Design Online — Interview Prep Course',
    h1: 'Learn System Design for Interviews',
    description:
      'Prepare for system design interviews with structured frameworks. Course covering scalability, databases, caching, load balancing, and distributed systems.',
    seoContent:
      'System design interviews are a critical component of senior engineering hiring at companies like Google, Amazon, Meta, and Microsoft. Kairos.ai offers a System Design course that teaches you structured frameworks for designing scalable, reliable systems. The course covers scalability principles, database design (SQL vs NoSQL), caching strategies, load balancing, CDNs, message queues, microservices architecture, and real-world system design problems like designing Twitter, YouTube, or Uber. Each lesson walks through the problem systematically, from requirements gathering to component design to handling edge cases. An AI coach helps you practice explaining your designs clearly, a crucial skill for interview success.',
  },
  'coding-interview': {
    courseSlug: 'coding-interview',
    title: 'Coding Interview Prep — Free Practice Course',
    h1: 'Coding Interview Preparation',
    description:
      'Prepare for coding interviews at top tech companies. Free course covering arrays, strings, trees, graphs, dynamic programming, and problem-solving patterns.',
    seoContent:
      'Coding interviews at companies like Google, Amazon, Meta, Apple, and Netflix require strong problem-solving skills and familiarity with common algorithmic patterns. Kairos.ai offers a free Coding Interview Preparation course that covers the most frequently tested topics: arrays and strings, hash maps, linked lists, trees and graphs, dynamic programming, backtracking, and greedy algorithms. The course teaches you to recognize patterns across problems rather than memorizing solutions. Interactive coding exercises let you practice directly in your browser with an AI coach that provides progressive hints — guiding you toward the solution without giving it away. This approach builds the problem-solving intuition that interviewers are looking for.',
  },
};

export function generateStaticParams() {
  return Object.keys(TOPIC_MAP).map((topic) => ({ topic }));
}

export function generateMetadata({
  params,
}: {
  params: { topic: string };
}): Metadata {
  const entry = TOPIC_MAP[params.topic];
  if (!entry) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: entry.title,
    description: entry.description,
    keywords: [
      `learn ${params.topic} online`,
      `${params.topic} course`,
      `${params.topic} tutorial`,
      `best ${params.topic} course`,
      `free ${params.topic} course`,
      'AI tutor',
      'online learning',
      'Kairos.ai',
    ],
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: `https://kairos.ai/learn/${params.topic}`,
    },
    alternates: {
      canonical: `https://kairos.ai/learn/${params.topic}`,
    },
  };
}

export default function TopicLandingPage({
  params,
}: {
  params: { topic: string };
}) {
  const entry = TOPIC_MAP[params.topic];
  if (!entry) {
    notFound();
  }

  const course = courses.find((c) => c.slug === entry.courseSlug);
  if (!course) {
    notFound();
  }

  const totalLessons = getAllLessons(course).length;
  const hasExercises = getAllLessons(course).some((l) => l.starterCode);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: entry.description,
    url: `https://kairos.ai/course/${course.slug}`,
    provider: { '@type': 'Organization', name: 'Kairos.ai' },
    isAccessibleForFree: course.tier === 'free',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `${course.modules.length} modules, ${totalLessons} lessons`,
    },
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://kairos.ai',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Learn',
        item: 'https://kairos.ai/courses',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: entry.h1,
        item: `https://kairos.ai/learn/${params.topic}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbs} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <span className="text-5xl mb-4 block">{course.icon}</span>
          <h1 className="text-3xl font-bold text-white mb-4">{entry.h1}</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            {entry.seoContent}
          </p>
        </header>

        {/* Course details */}
        <section className="rounded-2xl border border-slate-700/30 bg-slate-800/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Course Overview: {course.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-2xl font-bold text-white">
                {course.modules.length}
              </div>
              <div className="text-sm text-slate-400">Modules</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {totalLessons}
              </div>
              <div className="text-sm text-slate-400">Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white capitalize">
                {course.level || 'Beginner'}
              </div>
              <div className="text-sm text-slate-400">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white capitalize">
                {course.tier === 'free' ? 'Free' : 'Pro'}
              </div>
              <div className="text-sm text-slate-400">Tier</div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-white mb-3">
            What you will learn
          </h3>
          <ul className="space-y-2 mb-6">
            {course.modules.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-2 text-slate-300"
              >
                <span className="text-blue-400 mt-1 shrink-0">&#8226;</span>
                <span>
                  {m.title} ({m.lessons.length} lessons)
                </span>
              </li>
            ))}
          </ul>

          {hasExercises && (
            <p className="text-slate-400 text-sm">
              Includes interactive coding exercises with in-browser execution
              and AI-powered hints.
            </p>
          )}
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`/course/${course.slug}`}
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-xl transition-colors"
          >
            {course.tier === 'free'
              ? 'Start Learning Free'
              : 'Start Learning'}
          </Link>
          <p className="text-slate-500 text-sm mt-3">
            No account required to start.{' '}
            {course.tier === 'free'
              ? 'This course is completely free.'
              : 'Pro subscription required for full access.'}
          </p>
        </div>
      </div>
    </div>
  );
}

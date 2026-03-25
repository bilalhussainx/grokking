import { Course, getAllLessons } from '@/data/types';

const domainLabels: Record<string, string> = {
  'computer-science': 'Computer Science & Engineering',
  'religious-studies': 'Religious Studies',
  'philosophy': 'Philosophy',
  'finance-business': 'Finance & Business',
  'health-wellness': 'Health & Wellness',
  'political-strategy': 'Political Strategy',
  'interview-prep': 'Interview Preparation',
};

export default function CourseIntro({ course }: { course: Course }) {
  const totalLessons = getAllLessons(course).length;
  const moduleCount = course.modules.length;
  const tierLabel = course.tier === 'free' ? 'free' : 'premium';
  const domainLabel = domainLabels[course.domain || ''] || course.domain || 'general';
  const hasExercises = getAllLessons(course).some(l => l.starterCode);
  const levelLabel = course.level || 'beginner';

  return (
    <section className="mb-8">
      <p className="text-slate-300 text-base leading-relaxed">
        {course.title} is a {tierLabel} online course on Kairos.ai that covers{' '}
        {course.description.charAt(0).toLowerCase() + course.description.slice(1)}{' '}
        The course is part of the {domainLabel} domain and is designed for {levelLabel}-level learners.
        It includes {moduleCount} modules with {totalLessons} lessons
        {hasExercises ? ', interactive coding exercises,' : ''} and checkpoint quizzes.
        An AI voice coach guides students through the material, providing explanations,
        hints, and personalized feedback in real time. Students can learn at their own pace
        with progress tracking across all lessons and modules.
      </p>
    </section>
  );
}

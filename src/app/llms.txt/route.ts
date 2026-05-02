import { NextResponse } from 'next/server';
import { courses } from '@/data';
import { getAllLessons } from '@/data/types';

export async function GET() {
  const domainGroups: Record<string, typeof courses> = {};
  for (const c of courses) {
    const domain = c.domain || 'general';
    if (!domainGroups[domain]) domainGroups[domain] = [];
    domainGroups[domain].push(c);
  }

  const domainLabels: Record<string, string> = {
    'computer-science': 'Computer Science & Engineering',
    'religious-studies': 'Religious Studies',
    'philosophy': 'Philosophy',
    'finance-business': 'Finance & Business',
    'health-wellness': 'Health & Wellness',
    'political-strategy': 'Political Strategy',
    'interview-prep': 'Interview Preparation',
    'general': 'General',
  };

  const totalLessons = courses.reduce((sum, c) => sum + getAllLessons(c).length, 0);

  const content = `# KairosLearn

> KairosLearn is an AI-powered learning platform offering ${courses.length}+ interactive courses across Computer Science, Religious Studies, Philosophy, Finance, Health & Wellness, and Political Strategy. Every course includes AI voice coaching, interactive exercises, checkpoint quizzes, and personalized learning paths.

## About

KairosLearn helps learners master complex subjects through structured, evidence-based curricula paired with AI tutors. The platform features ${courses.length} courses containing ${totalLessons}+ lessons organized into modules. Courses range from beginner to advanced, with both free and premium tiers. AI voice coaches provide real-time guidance, explain concepts, give hints on coding exercises, and celebrate progress.

## Docs

- [All Courses](https://kairoslearn.com/courses): Browse the full course catalog
- [Pricing](https://kairoslearn.com/pricing): Free and Pro tier details
- [FAQ](https://kairoslearn.com/faq): Frequently asked questions
- [llms-full.txt](https://kairoslearn.com/llms-full.txt): Extended course details for LLM consumption

## Courses by Domain

${Object.entries(domainGroups).map(([domain, domainCourses]) => {
  const label = domainLabels[domain] || domain;
  return `### ${label}

${domainCourses.map(c => {
  const lessonCount = getAllLessons(c).length;
  const moduleCount = c.modules.length;
  return `- [${c.title}](https://kairoslearn.com/course/${c.slug}): ${c.description} (${moduleCount} modules, ${lessonCount} lessons, ${c.tier})`;
}).join('\n')}`;
}).join('\n\n')}

## Features

- AI Voice Coaching with 9 language options (English, Spanish, French, German, Italian, Dutch, Japanese, Hindi, Punjabi)
- Interactive coding exercises with in-browser Python execution
- Checkpoint quizzes with voice-narrated summaries
- Personalized learning paths
- 7 specialized voice personas per domain
- Free and Premium (Pro) tiers
- Dark glassmorphism UI with responsive design

## API

- Course catalog: https://kairoslearn.com/api/courses
- AI coaching: https://kairoslearn.com/api/ai/coach
- Progress tracking: https://kairoslearn.com/api/progress

## Contact

- Website: https://kairoslearn.com
- Support: support@kairoslearn.com
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

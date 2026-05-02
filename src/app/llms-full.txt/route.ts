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

  const courseDetails = Object.entries(domainGroups).map(([domain, domainCourses]) => {
    const label = domainLabels[domain] || domain;
    const courseBlocks = domainCourses.map(c => {
      const allLessons = getAllLessons(c);
      const moduleDetails = c.modules.map(m => {
        const lessonList = m.lessons.map(l => `    - ${l.title}`).join('\n');
        return `  - Module: ${m.title} (${m.lessons.length} lessons)\n${lessonList}`;
      }).join('\n');

      return `### ${c.title}

- URL: https://kairoslearn.com/course/${c.slug}
- Tier: ${c.tier === 'free' ? 'Free' : 'Premium (Pro)'}
- Level: ${c.level || 'beginner'}
- Modules: ${c.modules.length}
- Lessons: ${allLessons.length}
- Has coding exercises: ${allLessons.some(l => l.starterCode) ? 'Yes' : 'No'}
- Description: ${c.description}

#### Module breakdown

${moduleDetails}`;
    }).join('\n\n');

    return `## ${label}

${courseBlocks}`;
  }).join('\n\n---\n\n');

  const content = `# KairosLearn — Full Course Catalog

> KairosLearn is an AI-powered learning platform with ${courses.length}+ courses and ${totalLessons}+ lessons across Computer Science, Religious Studies, Philosophy, Finance, Health & Wellness, and Political Strategy. This is the extended version of llms.txt with full course details including every module and lesson title.

## Platform Overview

KairosLearn provides structured, interactive courses with AI voice coaching. Each course is organized into modules containing individual lessons. Many courses include interactive coding exercises with in-browser execution, checkpoint quizzes, and capstone projects. AI voice coaches are available in 9 languages and provide real-time guidance throughout the learning experience.

### Key Features

- ${courses.length}+ courses across 7 knowledge domains
- ${totalLessons}+ individual lessons
- AI voice coaching in 9 languages
- Interactive Python coding exercises
- Checkpoint quizzes and capstone projects
- Free and Premium tiers
- Personalized learning paths

---

${courseDetails}

---

## Links

- Homepage: https://kairoslearn.com
- Course Catalog: https://kairoslearn.com/courses
- FAQ: https://kairoslearn.com/faq
- Pricing: https://kairoslearn.com/pricing
- llms.txt (summary): https://kairoslearn.com/llms.txt
- Support: support@kairoslearn.com
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

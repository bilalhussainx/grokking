import { NextResponse } from 'next/server';
import { courses } from '@/data';

export async function GET() {
  const featured = courses.filter(c => c.featured);

  const content = `# Samsara.ai
> AI-powered learning platform with voice coaching across 7 domains

## About
Samsara.ai is an interactive learning platform offering courses in Computer Science,
Finance, Philosophy, Religious Studies, Political Strategy, Health & Wellness, and
Personal Growth. Each course includes AI voice coaching, interactive exercises,
checkpoint quizzes, and personalized learning paths.

## Featured Courses

### Computer Science
${featured.filter(c => c.domain === 'computer-science').map(c => `- [${c.title}](https://samsara.ai/course/${c.slug}): ${c.description}`).join('\n')}

### Religious Studies
${featured.filter(c => c.domain === 'religious-studies').map(c => `- [${c.title}](https://samsara.ai/course/${c.slug}): ${c.description}`).join('\n')}

### Philosophy
${featured.filter(c => c.domain === 'philosophy').map(c => `- [${c.title}](https://samsara.ai/course/${c.slug}): ${c.description}`).join('\n')}

### Finance & Business
${featured.filter(c => c.domain === 'finance-business').map(c => `- [${c.title}](https://samsara.ai/course/${c.slug}): ${c.description}`).join('\n')}

### Health & Wellness
${featured.filter(c => c.domain === 'health-wellness').map(c => `- [${c.title}](https://samsara.ai/course/${c.slug}): ${c.description}`).join('\n')}

### Political Strategy
${featured.filter(c => c.domain === 'political-strategy').map(c => `- [${c.title}](https://samsara.ai/course/${c.slug}): ${c.description}`).join('\n')}

## All Courses (${courses.length} total)
${courses.map(c => `- [${c.title}](https://samsara.ai/course/${c.slug}): ${c.description}`).join('\n')}

## Features
- AI Voice Coaching (9 languages: English, Spanish, French, German, Italian, Dutch, Japanese, Hindi, Punjabi)
- Interactive Python exercises with in-browser execution
- Checkpoint quizzes with voice summaries
- Personalized learning paths via Gemini embeddings
- 7 specialized voice personas per domain
- Free and Premium tiers

## Contact
- Website: https://samsara.ai
- Support: support@samsara.ai
`;

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/**
 * Generate Flagship Course
 * 
 * Main orchestration script for generating a complete course
 * using the MCP skills methodology.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import {
  readSkill,
  tavilySearch,
  generateLesson,
} from './lib/course-generator-client';
import { reviewModule } from './lib/review-agent';

// Course configuration
interface CourseSpec {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  tier: 'free' | 'pro';
  domain: string;
  variation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  targetDuration: number; // days
  moduleCount: number;
  lessonsPerModule: number;
  checkpointInterval: number;
  voicePersona: string;
  prerequisites?: string[];
}

// Parse command line arguments
const courseId = process.argv[2] || 'advanced-system-design';

// Course specifications
const COURSES: Record<string, CourseSpec> = {
  'advanced-system-design': {
    id: 'advanced-system-design',
    slug: 'advanced-system-design',
    title: 'Advanced System Design',
    description: 'Master system design for high-scale applications. Learn to architect scalable, fault-tolerant systems used by tech giants.',
    icon: '🏗️',
    tier: 'pro',
    domain: 'computer-science',
    variation: 'system-design',
    level: 'advanced',
    targetDuration: 30,
    moduleCount: 6,
    lessonsPerModule: 4,
    checkpointInterval: 3,
    voicePersona: 'senior-staff-engineer',
    prerequisites: ['data-structures', 'algorithms'],
  },
  'fullstack-bootcamp': {
    id: 'fullstack-bootcamp',
    slug: 'fullstack-web-development',
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Complete guide to modern web development. React, Node.js, databases, deployment, and more.',
    icon: '💻',
    tier: 'pro',
    domain: 'computer-science',
    variation: 'web-development',
    level: 'intermediate',
    targetDuration: 60,
    moduleCount: 8,
    lessonsPerModule: 4,
    checkpointInterval: 4,
    voicePersona: 'experienced-tech-lead',
  },
  'islamic-ethics': {
    id: 'islamic-ethics',
    slug: 'islamic-ethics',
    title: 'Islamic Ethics & Personal Finance',
    description: 'Learn financial principles aligned with Islamic values. Halal investing, ethical business, and wealth building.',
    icon: '🌙',
    tier: 'free',
    domain: 'islamic-studies',
    variation: 'ethics',
    level: 'beginner',
    targetDuration: 21,
    moduleCount: 5,
    lessonsPerModule: 3,
    checkpointInterval: 3,
    voicePersona: 'knowledgeable-scholar',
  },
  'philosophy-critical-thinking': {
    id: 'philosophy-critical-thinking',
    slug: 'philosophy-critical-thinking',
    title: 'Philosophy & Critical Thinking',
    description: 'Develop critical thinking through philosophy. Logic, reasoning, ethics, and the art of asking better questions.',
    icon: '🧠',
    tier: 'free',
    domain: 'philosophy',
    variation: 'critical-thinking',
    level: 'beginner',
    targetDuration: 30,
    moduleCount: 5,
    lessonsPerModule: 4,
    checkpointInterval: 4,
    voicePersona: 'philosophy-professor',
  },
  'finance-wealth-building': {
    id: 'finance-wealth-building',
    slug: 'finance-wealth-building',
    title: 'Finance & Wealth Building',
    description: 'Comprehensive guide to personal finance, investing, and building long-term wealth.',
    icon: '💰',
    tier: 'pro',
    domain: 'finance-business',
    variation: 'personal-finance',
    level: 'beginner',
    targetDuration: 30,
    moduleCount: 6,
    lessonsPerModule: 4,
    checkpointInterval: 3,
    voicePersona: 'financial-advisor',
  },
  'health-optimization': {
    id: 'health-optimization',
    slug: 'health-optimization',
    title: 'Health & Human Performance',
    description: 'Evidence-based approach to physical and mental health optimization for peak performance.',
    icon: '💪',
    tier: 'free',
    domain: 'health',
    variation: 'optimization',
    level: 'intermediate',
    targetDuration: 45,
    moduleCount: 6,
    lessonsPerModule: 4,
    checkpointInterval: 3,
    voicePersona: 'health-scientist',
  },
};

async function generateCoursePlan(spec: CourseSpec): Promise<any[]> {
  console.log(`📋 Generating course plan for: ${spec.title}`);
  
  const orchestratorSkill = readSkill('content-orchestrator');
  const courseSkill = readSkill('course-planning');

  // Research the topic
  const research = await tavilySearch(
    `${spec.title} ${spec.domain} curriculum learning path syllabus`
  );

  const systemPrompt = `You are a curriculum designer for Samsara.ai.

COURSE DESIGN PRINCIPLES:
${courseSkill.slice(0, 3000)}

Return a JSON array of ${spec.moduleCount} modules. Each module has:
- id: kebab-case
- title: string
- description: string
- lessons: array of { id, title } objects (${spec.lessonsPerModule} lessons each)

Order must be pedagogical progression from basics to advanced.

Return ONLY valid JSON, no markdown.`;

  const userMessage = `Design a ${spec.moduleCount}-module course:

Title: ${spec.title}
Description: ${spec.description}
Level: ${spec.level}
Domain: ${spec.domain}
Variation: ${spec.variation}

Research to inform design:
${research.results?.map((r: any) => `- ${r.title}`).join('\n') || 'N/A'}

Generate the module structure as JSON.`;

  // For now, return a structured plan based on the spec
  // In production, this would call the LLM
  const modules = [];
  const topicKeywords: Record<string, string[]> = {
    'system-design': [
      'Fundamentals', 'Scalability', 'Databases', 'Microservices', 'Real-World Systems', 'Case Studies'
    ],
    'web-development': [
      'HTML/CSS/JS', 'React', 'Node.js', 'Databases', 'Authentication', 'API Design', 'Testing', 'Deployment'
    ],
    'ethics': [
      'Islamic Principles', 'Halal Income', 'Ethical Business', 'Charity', 'Family Finance'
    ],
    'critical-thinking': [
      'Logic', 'Fallacies', 'Ethics', 'Philosophy', 'Decision Making'
    ],
    'personal-finance': [
      'Budgeting', 'Saving', 'Investing', 'Retirement', 'Tax Optimization', 'Wealth Building'
    ],
    'optimization': [
      'Nutrition', 'Exercise', 'Sleep', 'Stress Management', 'Mental Health', 'Habits'
    ],
  };

  const topics = topicKeywords[spec.variation] || topicKeywords['system-design'];

  for (let i = 0; i < spec.moduleCount; i++) {
    const moduleTopic = topics[i] || `Module ${i + 1}`;
    const lessons = [];
    for (let j = 0; j < spec.lessonsPerModule; j++) {
      const isCheckpoint = (j + 1) % spec.checkpointInterval === 0;
      lessons.push({
        id: `m${i + 1}-l${j + 1}`,
        title: `${moduleTopic} - Lesson ${j + 1}${isCheckpoint ? ' (Checkpoint)' : ''}`,
      });
    }
    modules.push({
      id: `module-${i + 1}`,
      title: `${i + 1}. ${moduleTopic}`,
      description: `Learn ${moduleTopic.toLowerCase()} through hands-on examples and exercises.`,
      lessons,
    });
  }

  console.log(`✅ Generated ${modules.length} modules with ${modules[0].lessons.length} lessons each`);
  return modules;
}

async function generateFullCourse(spec: CourseSpec): Promise<any> {
  console.log(`\n🚀 Generating: ${spec.title}`);
  console.log('=' .repeat(60));

  // Step 1: Generate course plan
  const modules = await generateCoursePlan(spec);

  // Step 2: Generate each module's lessons
  const generatedModules = [];
  let previousSummary = 'None (first lessons)';

  for (const mod of modules) {
    console.log(`\n📚 Module: ${mod.title}`);
    
    const generatedLessons = [];
    for (let i = 0; i < mod.lessons.length; i++) {
      const lesson = mod.lessons[i];
      const isCheckpoint = (i + 1) % spec.checkpointInterval === 0;
      
      console.log(`  📝 Generating: ${lesson.title}...`);
      
      // Research the lesson topic
      const research = await tavilySearch(
        `${spec.title} ${mod.title} ${lesson.title} tutorial examples`
      );
      
      // Generate the lesson
      const generated = await generateLesson({
        courseId: spec.id,
        courseTitle: spec.title,
        domain: spec.domain,
        variation: spec.variation,
        level: spec.level,
        moduleId: mod.id,
        moduleTitle: mod.title,
        moduleIndex: modules.indexOf(mod),
        lessonTitle: lesson.title,
        lessonIndex: i,
        isCheckpoint,
        previousSummary,
        voicePersona: spec.voicePersona,
        researchResults: research.results?.map((r: any) => r.content).join('\n\n') || '',
      });
      
      generatedLessons.push(generated);
      
      // Update summary for next lesson
      previousSummary = `${mod.title}: ${generatedLessons.map(l => l.title).join(', ')}`;
      
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    }

    generatedModules.push({
      ...mod,
      lessons: generatedLessons,
    });
  }

  // Step 3: Review quality
  console.log(`\n🔍 Reviewing quality...`);
  const moduleCode = JSON.stringify(generatedModules[0], null, 2);
  const review = await reviewModule(moduleCode, spec.domain, spec.title);
  
  if (review.passed) {
    console.log('✅ Quality check PASSED');
  } else {
    console.log('⚠️ Quality check FAILED:');
    review.issues.forEach((issue: string) => console.log(`   - ${issue}`));
  }

  // Build final course object
  const course = {
    id: spec.id,
    slug: spec.slug,
    title: spec.title,
    description: spec.description,
    icon: spec.icon,
    tier: spec.tier,
    featured: true,
    domain: spec.domain,
    variation: spec.variation,
    level: spec.level,
    prerequisiteIds: spec.prerequisites || [],
    modules: generatedModules,
  };

  return course;
}

async function saveCourse(course: any) {
  const outputDir = resolve(__dirname, '../src/data/generated');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const filePath = resolve(outputDir, `${course.id}.ts`);
  const content = `// Generated course: ${course.title}
// Generated at: ${new Date().toISOString()}

import type { Course } from '../types';

export const ${course.id.replace(/-/g, '_')}_course: Course = ${JSON.stringify(course, null, 2)};

export default ${course.id.replace(/-/g, '_')}_course;
`;

  writeFileSync(filePath, content, 'utf-8');
  console.log(`\n💾 Saved to: ${filePath}`);
}

// Main execution
async function main() {
  const spec = COURSES[courseId];
  if (!spec) {
    console.error(`Unknown course: ${courseId}`);
    console.log('Available:', Object.keys(COURSES).join(', '));
    process.exit(1);
  }

  const course = await generateFullCourse(spec);
  await saveCourse(course);

  console.log('\n✨ Course generation complete!');
}

main().catch(console.error);

// Language Learning Types and Interfaces
// Separate from existing Lesson types in types.ts

import type { ProficiencyLevel } from '@/lib/language-personas';

// ============================================
// Core Language Lesson Types
// ============================================

export interface VocabEntry {
  word: string;                     // Target language word
  translation: string;              // Native language translation (dynamic based on user)
  pronunciation: string;            // IPA or phonetic spelling
  audioKey?: string;                // Pre-generated TTS clip ID
  exampleSentence: string;          // Example in target language
  exampleTranslation: string;       // Translation of example
  partOfSpeech?: string;            // noun, verb, adjective, etc.
}

export interface VoiceScenario {
  id: string;
  title: string;                    // "Ordering at a restaurant"
  situation: string;                // Context description for the agent
  agentRole: string;                // "You are a waiter in Madrid..."
  userGoal: string;                 // "Order a meal and ask for the bill"
  targetPhrases: string[];          // Phrases the user should try to use
  successCriteria: string[];        // What "passing" looks like
  hints?: string[];                 // Optional hints for struggling students
}

export interface GrammarPoint {
  title: string;
  explanation: string;              // Markdown formatted
  examples: {
    correct: string;
    translation: string;
    note?: string;
  }[];
  commonMistakes?: {
    incorrect: string;
    correction: string;
    explanation: string;
  }[];
}

export interface CulturalNote {
  title: string;
  content: string;                  // Markdown formatted
  region?: string;                  // Specific region this applies to
}

export interface LanguageLesson {
  // Base fields (shared with existing Lesson type)
  id: string;
  slug: string;
  title: string;
  content: string;                  // Markdown: main lesson content
  
  // Language-specific fields
  targetLanguage: string;           // BCP-47 code: 'es', 'fr', 'ur'
  proficiencyLevel: ProficiencyLevel;
  moduleId: string;                 // Parent module reference
  moduleTitle: string;              // For display
  order: number;                    // Lesson order within module
  topicId: string;                  // Unique: {langCode}-{level}-{lessonSlug}

  // Learning content
  vocabulary: VocabEntry[];
  grammarPoints: GrammarPoint[];
  voiceScenarios: VoiceScenario[];
  culturalNotes?: CulturalNote[];
  
  // Assessment (for final lesson in each level)
  isAssessment?: boolean;
  assessmentQuestions?: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'text' | 'voice';
  prompt: string;                   // Question or task
  targetPhrases?: string[];         // Expected phrases in answer
  successCriteria: string[];        // How to grade the response
  hints?: string[];
}

// ============================================
// Module and Course Types
// ============================================

export interface LanguageModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LanguageLesson[];
  isAssessment?: boolean;
}

export interface LanguageCourse {
  id: string;
  slug: string;
  title: string;
  language: string;                 // BCP-47 code
  languageName: string;             // Display name
  proficiencyLevel: ProficiencyLevel;
  description: string;
  targetAudience: string;
  estimatedHours: number;
  modules: LanguageModule[];
  icon?: string;                    // Emoji or icon identifier
  prerequisiteCourseSlug?: string;
  nextCourseSlug?: string;
}

// ============================================
// User Progress Types
// ============================================

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;                   // For assessments
  timeSpentMinutes: number;
}

export interface ModuleProgress {
  moduleId: string;
  completedLessons: string[];
  isCompleted: boolean;
}

export interface UserLanguageProgress {
  userId: string;
  targetLanguage: string;
  currentLevel: ProficiencyLevel;
  currentModuleId: string;
  currentLessonId: string;
  lessonProgress: LessonProgress[];
  totalStudyTimeMinutes: number;
  streakDays: number;
  lastStudiedAt?: Date;
}

export interface ConversationCheckpoint {
  schemaVersion: 1;
  lastTopicId: string;
  lastTopicName: string;
  topicProgress: 'started' | 'practicing' | 'comfortable';
  nextTopicId: string;
  nextTopicName: string;
  lastExchangeSummary: string;
  vocabInProgress: string[];
  mistakePatterns: string[];
  totalExchangesOnTopic: number;
  lastSessionTimestamp: string;
}

// ============================================
// RAG Agent Types
// ============================================

export interface UserLanguageProfile {
  userId: string;
  targetLanguage: string;
  nativeLanguage: string;
  proficiencyLevel: ProficiencyLevel;
  currentModuleId?: string;
  preferredPersonaId?: string;
  learningGoals: string[];
  weakAreas: string[];
  strongAreas: string[];
  totalPracticeMinutes: number;
  streakDays: number;
  lastSessionSummary?: string;
  lastPracticedAt?: Date;
}

export interface MistakePattern {
  id: string;
  userId: string;
  targetLanguage: string;
  category: 'grammar' | 'pronunciation' | 'vocabulary' | 'cultural';
  description: string;
  examples: string[];
  corrections: string[];
  frequency: number;
  embedding?: number[];             // Vector for similarity search
  resolved: boolean;
  lastOccurredAt: Date;
}

export interface VocabMastery {
  id: string;
  userId: string;
  word: string;
  translation: string;
  targetLanguage: string;
  timesCorrect: number;
  timesIncorrect: number;
  masteryLevel: number;             // 0-5
  easeFactor: number;               // SM-2
  intervalDays: number;             // SM-2
  nextReviewAt: Date;
  lastReviewedAt?: Date;
}

export interface SessionHistory {
  id: string;
  userId: string;
  targetLanguage: string;
  personaId: string;
  scenario?: string;
  lessonId?: string;
  durationSeconds: number;
  transcript: TranscriptEntry[];
  mistakesFound: MistakeFound[];
  newVocab: string[];
  proficiencyDelta: number;
  agentSummary: string;
  createdAt: Date;
}

export interface TranscriptEntry {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface MistakeFound {
  type: 'grammar' | 'pronunciation' | 'vocabulary' | 'cultural';
  utterance: string;
  correction: string;
  explanation: string;
}

export interface AgentTurnMetadata {
  mistakesDetected: {
    type: 'grammar' | 'pronunciation' | 'vocabulary' | 'cultural';
    utterance: string;
    correction: string;
    explanation: string;
  }[];
  vocabUsedCorrectly: string[];
  vocabUsedIncorrectly: string[];
  estimatedProficiencySignal: 'below_level' | 'at_level' | 'above_level';
  suggestedNextTopics: string[];
}

export interface LessonContext {
  lessonId: string;
  lessonTitle: string;
  targetPhrases: string[];
  vocabulary: string[];
  grammarFocus: string[];
  content?: string;
}

export interface AgentContext {
  systemPromptContext: string;
  lessonContext?: LessonContext;
  profile: UserLanguageProfile;
}

// ============================================
// Placement Test Types
// ============================================

export interface PlacementQuestion {
  id: string;
  level: ProficiencyLevel;
  type: 'text' | 'voice';
  question: string;
  expectedConcepts: string[];       // What we're testing
  sampleCorrectAnswers: string[];
}

export interface PlacementResult {
  userId: string;
  targetLanguage: string;
  assessedLevel: ProficiencyLevel;
  textScore: number;                // 0-100
  voiceScore: number;               // 0-100
  details: {
    questionId: string;
    userResponse: string;
    assessedCorrect: boolean;
    conceptsDemonstrated: string[];
  }[];
}

// ============================================
// Voice Session Types
// ============================================

export interface VoiceSessionConfig {
  userId: string;
  targetLanguage: string;
  personaId: string;
  proficiencyLevel: ProficiencyLevel;
  lessonContext?: LessonContext;
  scenario?: string;
  mode?: 'free-form' | 'lesson-practice' | 'placement';
}

export interface LessonPracticeConfig {
  mode: 'lesson-practice';
  courseSlug: string;
  lessonSlug: string;
  topicId: string;
  targetVocab: VocabEntry[];
  targetGrammar: GrammarPoint[];
  voiceScenarios: VoiceScenario[];
  proficiencyLevel: ProficiencyLevel;
}

export function lessonPracticeToContext(config: LessonPracticeConfig, lessonTitle: string): LessonContext {
  return {
    lessonId: config.lessonSlug,
    lessonTitle,
    targetPhrases: config.voiceScenarios.flatMap(s => s.targetPhrases),
    vocabulary: config.targetVocab.map(v => v.word),
    grammarFocus: config.targetGrammar.map(g => g.title),
  };
}

export interface VoiceSessionState {
  sessionId: string;
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  micMuted: boolean;
  transcript: TranscriptEntry[];
  currentScenario?: string;
}

// ============================================
// Translation Widget Types
// ============================================

export interface TranslationRequest {
  text: string;
  fromLang: string;
  toLang: string;
  context?: string;                 // Optional lesson context
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  fromLang: string;
  toLang: string;
  pronunciation?: string;           // IPA or phonetic
  audioUrl?: string;                // TTS audio URL
}

// ============================================
// Utility Functions
// ============================================

export function getAllLessons(course: LanguageCourse): LanguageLesson[] {
  return course.modules.flatMap(m => m.lessons);
}

export function findLesson(
  course: LanguageCourse, 
  lessonSlug: string
): { lesson: LanguageLesson; module: LanguageModule; prevLesson: LanguageLesson | null; nextLesson: LanguageLesson | null } | null {
  const allLessons = getAllLessons(course);
  const index = allLessons.findIndex(l => l.slug === lessonSlug);
  if (index === -1) return null;
  
  const lesson = allLessons[index];
  const module = course.modules.find(m => m.lessons.some(l => l.id === lesson.id))!;
  
  return {
    lesson,
    module,
    prevLesson: index > 0 ? allLessons[index - 1] : null,
    nextLesson: index < allLessons.length - 1 ? allLessons[index + 1] : null,
  };
}

export function getLessonProgress(
  lessonId: string,
  progress: LessonProgress[]
): LessonProgress | undefined {
  return progress.find(p => p.lessonId === lessonId);
}

export function calculateCourseProgress(
  course: LanguageCourse,
  lessonProgress: LessonProgress[]
): { completed: number; total: number; percentage: number } {
  const allLessons = getAllLessons(course);
  const completed = allLessons.filter(l => 
    lessonProgress.find(p => p.lessonId === l.id && p.completed)
  ).length;
  
  return {
    completed,
    total: allLessons.length,
    percentage: Math.round((completed / allLessons.length) * 100),
  };
}

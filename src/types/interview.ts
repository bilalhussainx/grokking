export type InterviewPreset = 'frontend' | 'backend' | 'fullstack' | 'system-design' | 'dsa' | 'second-brain' | 'recruiter-screen' | 'product-manager' | 'finance' | 'leadership';
export type InterviewType = 'technical' | 'behavioral' | 'mixed' | 'recruiter';

export interface InterviewQuestion {
  id: number;
  text: string;
  type: 'technical' | 'behavioral';
  followUps: string[];
  evaluationCriteria: string;
}

export interface InterviewPlan {
  questions: InterviewQuestion[];
  interviewerPersona: string;
  timeAllocation: { intro: number; questions: number; wrapUp: number };
  fallback?: boolean;
}

export interface TranscriptEntry {
  role: 'agent' | 'user';
  text: string;
  timestamp: number;
}

export interface QuestionScore {
  id: number;
  question: string;
  answerSummary: string;
  score: number;
  feedback: string;
}

export interface InterviewScorecard {
  overall: number;
  categories: {
    communication: number;
    technicalDepth: number;
    problemSolving: number;
    codeQuality: number;
  };
  questions: QuestionScore[];
  strengths: string[];
  improvements: string[];
}

// --- Interview Session Types (Sub-Project 2) ---

export interface InterviewPhase {
  name: string;
  minutes: number;
  questionCount: number;
  format: 'live_coding' | 'whiteboard' | 'discussion' | 'star_method' | 'system_design';
  difficultyProgression: 'fixed' | 'adaptive' | 'escalating';
}

export interface InterviewerBehavior {
  silenceThresholdSec: number;
  hintStyle: 'socratic' | 'direct' | 'coded';
  followUpDepth: number;
  evaluationFocus: string[];
}

export interface InterviewStructure {
  totalMinutes: number;
  phases: InterviewPhase[];
  interviewerBehavior: InterviewerBehavior;
}

export interface InterviewSession {
  id: string;
  userId: string;
  companyPersonaId: string;
  category: 'tech' | 'college';
  interviewType: string;
  status: 'active' | 'completed' | 'abandoned';
  currentPhase: number;
  questionPlan: InterviewPlan;
  sessionStructure: InterviewStructure | null;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  codeSubmissions: Array<{ problemId: string; code: string; language: string; passed: boolean; timestamp: number }>;
  totalTurns: number;
  startedAt: string;
  endedAt: string | null;
}

export interface TestCase {
  input: string;
  expected_output: string;
}

export interface InterviewProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  constraints: string | null;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  starterCodePython: string | null;
  starterCodeJava: string | null;
  topics: string[];
  companyTags: string[];
  pattern: string | null;
  testCasesVisible: TestCase[];
  testCasesHidden: TestCase[];
}

export interface CodeExecutionResult {
  testResults: Array<{
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    runtimeMs: number;
  }>;
  allPassed: boolean;
  compilationError?: string;
  executionTimeMs: number;
}

export type InterviewPreset = 'frontend' | 'backend' | 'fullstack' | 'system-design' | 'dsa';
export type InterviewType = 'technical' | 'behavioral' | 'mixed';

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

export type AIMode = "tutor" | "guide" | "encourager" | "socratic";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AIHintRequest {
  code: string;
  starterCode: string;
  solutionCode: string;
  lessonTitle: string;
  lessonContent: string;
  hintLevel: 1 | 2 | 3;
}

export interface AIHintResponse {
  hint: string;
  level: 1 | 2 | 3;
}

export interface AIGradeRequest {
  code: string;
  output: string;
  starterCode: string;
  solutionCode: string;
  lessonTitle: string;
  lessonContent: string;
}

export interface AIGradeResult {
  overall: number;
  correctness: number;
  efficiency: number;
  style: number;
  feedback: string;
  suggestions: string[];
  passed: boolean;
}

export interface AISupervisionRequest {
  code: string;
  starterCode: string;
  solutionCode: string;
  lessonTitle: string;
  timeSinceLastChange: number;
  changeCount: number;
}

export interface AIIntervention {
  type: "hint" | "encouragement" | "nudge" | "question";
  title: string;
  content: string;
  severity: "low" | "medium" | "high";
}

export interface AIChatRequest {
  message: string;
  mode: AIMode;
  lessonTitle: string;
  lessonContent: string;
  moduleTitle: string;
  courseTitle: string;
  currentCode?: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface LessonContext {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonContent: string;
  moduleTitle: string;
  courseTitle: string;
  starterCode?: string;
  solutionCode?: string;
}

// Writing-specific AI modes
export type WritingAIMode = "writing_coach" | "editor" | "reviewer";
export type ExtendedAIMode = AIMode | WritingAIMode;

export interface AIWritingReviewRequest {
  content: string;
  docType: string;
  focusAreas?: string[];
}

export interface AIWritingReviewResponse {
  comments: {
    content: string;
    selectionFrom: number;
    selectionTo: number;
    category: "grammar" | "clarity" | "flow" | "content" | "style" | "structure";
    severity: "suggestion" | "warning" | "error";
  }[];
  overallFeedback: string;
  score: number;
}

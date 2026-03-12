export type DocType = "essay" | "technical" | "design_doc" | "free_form";
export type DocStatus = "draft" | "in_review" | "approved" | "published";
export type PipelineType = "essay" | "technical" | "outline_only";
export type PipelineStatus = "pending" | "running" | "awaiting_approval" | "completed" | "cancelled";
export type StageStatus = "pending" | "running" | "awaiting_approval" | "approved" | "rejected" | "completed";
export type StageName = "outline" | "research" | "draft" | "refine" | "final";

export interface Document {
  id: string;
  session_id: string | null;
  owner_id: string;
  title: string;
  doc_type: DocType;
  content: Record<string, unknown>;
  plain_text: string;
  status: DocStatus;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  author_id: string | null;
  author_type: "human" | "ai";
  content: string;
  selection_from: number | null;
  selection_to: number | null;
  resolved: boolean;
  created_at: string;
  author_name?: string;
}

export interface WritingPipelineRun {
  id: string;
  document_id: string;
  initiated_by: string;
  pipeline_type: PipelineType;
  status: PipelineStatus;
  current_stage: StageName;
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  id: string;
  run_id: string;
  stage_name: StageName;
  stage_order: number;
  status: StageStatus;
  ai_output: Record<string, unknown>;
  teacher_feedback: string | null;
  approved_by: string | null;
  approved_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  role: "student" | "teacher" | "admin";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OutlineOutput {
  thesis: string;
  sections: { title: string; keyPoints: string[]; estimatedWords: number }[];
  totalEstimatedWords: number;
}

export interface ResearchOutput {
  sections: { title: string; evidence: string[]; sources: string[] }[];
}

export interface DraftOutput {
  content: Record<string, unknown>;
  wordCount: number;
}

export interface RefineOutput {
  content: Record<string, unknown>;
  changes: string[];
  wordCount: number;
}

export interface FinalOutput {
  content: Record<string, unknown>;
  wordCount: number;
  readabilityScore: number;
}

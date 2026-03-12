export type SessionType = "coding" | "writing" | "review";
export type SessionStatus = "draft" | "active" | "paused" | "ended";
export type ParticipantRole = "student" | "teacher" | "observer";
export type MessageType = "chat" | "system" | "code_share" | "feedback";

export interface LiveSession {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  session_type: SessionType;
  status: SessionStatus;
  course_slug: string | null;
  lesson_slug: string | null;
  join_code: string;
  max_students: number;
  settings: SessionSettings;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  session_participants?: SessionParticipant[];
}

export interface SessionSettings {
  allowChat: boolean;
  allowCodeExec: boolean;
  allowAIAssist: boolean;
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  role: ParticipantRole;
  joined_at: string;
  left_at: string | null;
  is_active: boolean;
  user_name?: string;
  user_email?: string;
}

export interface SessionMessage {
  id: string;
  session_id: string;
  user_id: string;
  message_type: MessageType;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
  sender_name?: string;
}

export interface SessionSnapshot {
  id: string;
  session_id: string;
  user_id: string;
  snapshot_type: "code" | "document";
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Realtime event types
export type SessionBroadcastEvent =
  | { type: "cursor_update"; userId: string; position: { line: number; col: number } }
  | { type: "code_keystroke"; userId: string; content: string }
  | { type: "typing_indicator"; userId: string; isTyping: boolean }
  | { type: "session_state"; status: SessionStatus }
  | { type: "editor_sync"; userId: string; content: string; language: string; editorType: EditorType; timestamp: number }
  | { type: "editor_mode_change"; editorType: EditorType; language: string }
  | { type: "output_sync"; userId: string; output: string; isError: boolean }
  | { type: "student_editor_sync"; userId: string; content: string; language: string }
  | { type: "hand_raise"; userId: string; userName: string; raised: boolean }
  | { type: "permission_grant"; userId: string; permission: StudentPermission; granted: boolean }
  | { type: "homework_assign"; homework: HomeworkAssignment }
  | { type: "prompt_sync"; promptContent: string; promptResult: string; userId: string }
  | { type: "tab_change"; tab: SessionTab };

export type EditorType = "code" | "writing";
export type SessionTab = "editor" | "ai" | "homework" | "prompt-lab" | "students";
export type StudentPermission = "edit" | "chat" | "ai" | "execute";

export interface HomeworkAssignment {
  id: string;
  title: string;
  description: string;
  starterCode?: string;
  language: string;
  dueAt?: string;
  assignedAt: string;
  assignedBy: string;
}

export interface StudentScreen {
  userId: string;
  userName: string;
  content: string;
  language: string;
  lastUpdate: number;
}

export interface EditorSyncState {
  content: string;
  language: string;
  editorType: EditorType;
  timestamp: number;
}

export interface PresenceState {
  userId: string;
  name: string;
  role: ParticipantRole;
  online_at: string;
  cursor?: { line: number; col: number };
}

export interface SessionNote {
  id: string;
  courseSlug: string;
  courseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  moduleTitle: string;
  summary: string;
  keyPoints: string[];
  timestamp: number;
  messages: { role: "coach" | "user"; text: string }[];
}

const STORAGE_KEY = "grokking-session-notes";

function loadAll(): SessionNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(notes: SessionNote[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // storage full
  }
}

export function saveSessionNote(note: SessionNote) {
  const notes = loadAll();
  // Replace existing note for same lesson if from same day
  const today = new Date().toDateString();
  const idx = notes.findIndex(
    (n) =>
      n.courseSlug === note.courseSlug &&
      n.lessonSlug === note.lessonSlug &&
      new Date(n.timestamp).toDateString() === today
  );
  if (idx >= 0) {
    notes[idx] = note;
  } else {
    notes.unshift(note);
  }
  // Keep max 100 notes
  saveAll(notes.slice(0, 100));
}

export function getNotesForCourse(courseSlug: string): SessionNote[] {
  return loadAll().filter((n) => n.courseSlug === courseSlug);
}

export function getNotesForLesson(
  courseSlug: string,
  lessonSlug: string
): SessionNote[] {
  return loadAll().filter(
    (n) => n.courseSlug === courseSlug && n.lessonSlug === lessonSlug
  );
}

export function getAllNotes(): SessionNote[] {
  return loadAll();
}

export function deleteNote(id: string) {
  const notes = loadAll().filter((n) => n.id !== id);
  saveAll(notes);
}

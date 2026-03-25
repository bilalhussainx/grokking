"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

/**
 * AIState — everything the AI agents need to know about the user and their journey.
 * This is fetched ONCE on login and cached. Updated when significant events happen.
 * Every AI agent (Coach, Language Tutor, Talk) consumes this for personalization.
 */
export interface AIState {
  // User identity
  userName: string;
  userEmail: string;
  nativeLanguage: string;
  coachLanguage: string;
  learningStyle: string; // "auditory" | "reading" | "balanced"
  commMode: string; // "voice_and_text" | "voice_only" | "text_only"
  englishFluency: string;
  interests: string[];

  // Progress
  totalCoursesStarted: number;
  totalLessonsCompleted: number;
  currentStreak: number;
  totalCredits: number;
  role: string;
  trialEndsAt: string | null;

  // Current session
  currentCourse: string | null;
  currentLesson: string | null;
  currentModule: string | null;
  lessonContent: string | null;
  starterCode: string | null;

  // Recent activity
  recentCourses: string[];
  lastActiveAt: string | null;

  // Computed
  isNewUser: boolean;
  isProUser: boolean;
  promptContext: string; // Pre-built context string for AI prompts
}

const DEFAULT_STATE: AIState = {
  userName: "there",
  userEmail: "",
  nativeLanguage: "en",
  coachLanguage: "en",
  learningStyle: "balanced",
  commMode: "voice_and_text",
  englishFluency: "native",
  interests: [],
  totalCoursesStarted: 0,
  totalLessonsCompleted: 0,
  currentStreak: 0,
  totalCredits: 0,
  role: "student",
  trialEndsAt: null,
  currentCourse: null,
  currentLesson: null,
  currentModule: null,
  lessonContent: null,
  starterCode: null,
  recentCourses: [],
  lastActiveAt: null,
  isNewUser: true,
  isProUser: false,
  promptContext: "",
};

interface AIStateContextType {
  state: AIState;
  setCurrentLesson: (course: string, module: string, lesson: string, content?: string, starterCode?: string) => void;
  clearCurrentLesson: () => void;
  refresh: () => Promise<void>;
}

const AIStateCtx = createContext<AIStateContextType | null>(null);

export function AIStateProvider({ children }: { children: ReactNode }) {
  const { user, profile, credits } = useAuth();
  const [state, setState] = useState<AIState>(DEFAULT_STATE);

  // Build the prompt context string from state
  const buildPromptContext = useCallback((s: AIState): string => {
    const parts: string[] = [];

    parts.push(`## WHO YOU'RE TALKING TO`);
    parts.push(`Name: ${s.userName}`);
    if (s.nativeLanguage !== "en") parts.push(`Native language: ${s.nativeLanguage} (may need explanations in their language)`);
    parts.push(`Learning style: ${s.learningStyle === "auditory" ? "Prefers listening and discussing" : s.learningStyle === "reading" ? "Prefers reading, be concise" : "Mix of voice and text"}`);
    if (s.interests.length > 0) parts.push(`Interests: ${s.interests.join(", ")}`);

    parts.push(`\n## THEIR JOURNEY`);
    if (s.isNewUser) {
      parts.push(`This is a NEW user — be extra welcoming and encouraging!`);
    } else {
      parts.push(`Courses started: ${s.totalCoursesStarted}, Lessons completed: ${s.totalLessonsCompleted}`);
      if (s.currentStreak > 1) parts.push(`On a ${s.currentStreak}-day learning streak — celebrate this!`);
    }
    if (s.recentCourses.length > 0) parts.push(`Recently studying: ${s.recentCourses.slice(0, 3).join(", ")}`);

    if (s.currentLesson) {
      parts.push(`\n## RIGHT NOW`);
      parts.push(`Currently on: ${s.currentCourse} > ${s.currentModule} > ${s.currentLesson}`);
      if (s.starterCode) parts.push(`This lesson has a coding exercise.`);
    }

    return parts.join("\n");
  }, []);

  // Sync from auth state + localStorage
  const refresh = useCallback(async () => {
    const newState: AIState = { ...DEFAULT_STATE };

    // From auth context
    if (profile) {
      newState.userName = profile.full_name || "there";
      newState.userEmail = profile.email || "";
      newState.role = profile.role || "student";
      newState.currentStreak = profile.login_streak || 0;
      newState.trialEndsAt = profile.trial_ends_at || null;
      newState.isProUser = profile.role === "pro" || profile.role === "admin" || profile.role === "teacher";
    }
    newState.totalCredits = credits;

    // From localStorage (set by onboarding)
    if (typeof window !== "undefined") {
      newState.nativeLanguage = localStorage.getItem("native-language") || "en";
      newState.coachLanguage = localStorage.getItem("coach-language") || "en";
      newState.learningStyle = localStorage.getItem("learning-style") || "balanced";
      newState.commMode = localStorage.getItem("comm-mode") || "voice_and_text";
      newState.englishFluency = localStorage.getItem("english-fluency") || "native";
      try {
        newState.interests = JSON.parse(localStorage.getItem("learning-interests") || "[]");
      } catch { newState.interests = []; }
    }

    // Fetch progress from API
    if (user) {
      try {
        const res = await fetch("/api/xp/profile");
        if (res.ok) {
          const data = await res.json();
          newState.totalLessonsCompleted = data.totalXp ? Math.floor(data.totalXp / 10) : 0;
        }
      } catch {}
    }

    // Count courses with progress
    if (typeof window !== "undefined") {
      const recent: string[] = [];
      let started = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("progress-")) {
          const slug = key.replace("progress-", "");
          const val = localStorage.getItem(key);
          if (val) {
            try {
              const progress = JSON.parse(val);
              if (Object.keys(progress).length > 0) {
                started++;
                recent.push(slug);
              }
            } catch {}
          }
        }
      }
      newState.totalCoursesStarted = started;
      newState.recentCourses = recent.slice(0, 5);
    }

    newState.isNewUser = newState.totalCoursesStarted === 0 && newState.totalLessonsCompleted === 0;
    newState.promptContext = buildPromptContext(newState);

    setState(newState);
  }, [user, profile, credits, buildPromptContext]);

  // Refresh on login
  useEffect(() => {
    if (user) refresh();
  }, [user, refresh]);

  const setCurrentLesson = useCallback((course: string, module: string, lesson: string, content?: string, starterCode?: string) => {
    setState(prev => {
      const updated = {
        ...prev,
        currentCourse: course,
        currentModule: module,
        currentLesson: lesson,
        lessonContent: content || null,
        starterCode: starterCode || null,
      };
      updated.promptContext = buildPromptContext(updated);
      return updated;
    });
  }, [buildPromptContext]);

  const clearCurrentLesson = useCallback(() => {
    setState(prev => {
      const updated = { ...prev, currentCourse: null, currentModule: null, currentLesson: null, lessonContent: null, starterCode: null };
      updated.promptContext = buildPromptContext(updated);
      return updated;
    });
  }, [buildPromptContext]);

  return (
    <AIStateCtx.Provider value={{ state, setCurrentLesson, clearCurrentLesson, refresh }}>
      {children}
    </AIStateCtx.Provider>
  );
}

export function useAIState() {
  const ctx = useContext(AIStateCtx);
  if (!ctx) throw new Error("useAIState must be used within AIStateProvider");
  return ctx;
}

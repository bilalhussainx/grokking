"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import {
  InterviewType,
  InterviewPreset,
  InterviewPlan,
  TranscriptEntry,
  InterviewScorecard,
} from "@/types/interview";

const SESSION_STORAGE_KEY = "grokking-interview";

interface InterviewState {
  sessionId: string | null;
  interviewType: InterviewType;
  preset: InterviewPreset;
  jobDescription: string;
  questionPlan: InterviewPlan | null;
  transcript: TranscriptEntry[];
  finalCode: string;
  scorecard: InterviewScorecard | null;
}

interface InterviewContextValue extends InterviewState {
  startInterview: (params: {
    interviewType: InterviewType;
    preset: InterviewPreset;
    jobDescription: string;
    questionPlan: InterviewPlan;
  }) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  setFinalCode: (code: string) => void;
  setScorecard: (scorecard: InterviewScorecard) => void;
  resetInterview: () => void;
}

const defaultState: InterviewState = {
  sessionId: null,
  interviewType: "technical",
  preset: "fullstack",
  jobDescription: "",
  questionPlan: null,
  transcript: [],
  finalCode: "",
  scorecard: null,
};

const InterviewCtx = createContext<InterviewContextValue | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InterviewState>(defaultState);

  // Rehydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as InterviewState;
        setState(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to sessionStorage whenever state changes and a session is active
  useEffect(() => {
    if (state.sessionId) {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      } catch {
        // ignore storage errors
      }
    }
  }, [state]);

  const startInterview = useCallback(
    (params: {
      interviewType: InterviewType;
      preset: InterviewPreset;
      jobDescription: string;
      questionPlan: InterviewPlan;
    }) => {
      const sessionId = `interview-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
      setState({
        sessionId,
        interviewType: params.interviewType,
        preset: params.preset,
        jobDescription: params.jobDescription,
        questionPlan: params.questionPlan,
        transcript: [],
        finalCode: "",
        scorecard: null,
      });
    },
    []
  );

  const addTranscriptEntry = useCallback((entry: TranscriptEntry) => {
    setState((prev) => ({
      ...prev,
      transcript: [...prev.transcript, entry],
    }));
  }, []);

  const setFinalCode = useCallback((code: string) => {
    setState((prev) => ({ ...prev, finalCode: code }));
  }, []);

  const setScorecard = useCallback((scorecard: InterviewScorecard) => {
    setState((prev) => ({ ...prev, scorecard }));
  }, []);

  const resetInterview = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(defaultState);
  }, []);

  return (
    <InterviewCtx.Provider
      value={{
        ...state,
        startInterview,
        addTranscriptEntry,
        setFinalCode,
        setScorecard,
        resetInterview,
      }}
    >
      {children}
    </InterviewCtx.Provider>
  );
}

export function useInterview() {
  const ctx = useContext(InterviewCtx);
  if (!ctx) throw new Error("useInterview must be used within InterviewProvider");
  return ctx;
}

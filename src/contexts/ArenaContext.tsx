"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ArenaSession {
  roomId: string;
  sandboxId: string;
  personaId: string;
  challengeId: string;
  challengeTitle: string;
  durationMin: number;
  score: number;
  mode: 'passive' | 'active';
  track: 'backend' | 'frontend' | 'fullstack' | 'data-science' | 'ml-engineer';
  kernelGatewayUrl?: string;
}

interface ArenaContextValue {
  session: ArenaSession | null;
  setSession: (s: ArenaSession) => void;
  updateScore: (delta: number) => void;
  setMode: (mode: 'passive' | 'active') => void;
  clearSession: () => void;
}

const ArenaContext = createContext<ArenaContextValue | null>(null);

export function ArenaProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<ArenaSession | null>(null);
  const setSession = useCallback((s: ArenaSession) => setSessionState(s), []);
  const updateScore = useCallback((delta: number) => {
    setSessionState(prev => prev ? { ...prev, score: prev.score + delta } : prev);
  }, []);
  const setMode = useCallback((mode: 'passive' | 'active') => {
    setSessionState(prev => prev ? { ...prev, mode } : prev);
  }, []);
  const clearSession = useCallback(() => setSessionState(null), []);

  return (
    <ArenaContext.Provider value={{ session, setSession, updateScore, setMode, clearSession }}>
      {children}
    </ArenaContext.Provider>
  );
}

export function useArena() {
  const ctx = useContext(ArenaContext);
  if (!ctx) throw new Error('useArena must be used within ArenaProvider');
  return ctx;
}

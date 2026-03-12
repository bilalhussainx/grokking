/**
 * useLiveCoach - React Hook for MCP Bridge Integration
 * 
 * Connects to MCP Bridge Server and enables real-time AI coaching
 * from SuperCore throughout the Grokking platform
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface CoachMessage {
  id: string;
  type: 'coach_message' | 'hint' | 'celebration' | 'concept_explanation' | 'question';
  text: string;
  emotion?: 'encouraging' | 'teaching' | 'celebrating' | 'gentle_nudge' | 'neutral';
  timestamp: Date;
  audioUrl?: string;
  level?: number; // For hints
}

export interface LiveCoachState {
  messages: CoachMessage[];
  isConnected: boolean;
  isCoachSpeaking: boolean;
  hintsUsed: number;
  sessionTime: string;
}

export interface LiveCoachActions {
  sendCodeUpdate: (code: string) => void;
  requestHint: () => void;
  explainConcept: (pattern?: string) => void;
  reportTestResults: (results: any[]) => void;
  celebrateSuccess: () => void;
}

interface UseLiveCoachOptions {
  userId: string;
  problemId?: string;
  problemTitle?: string;
  autoConnect?: boolean;
  voiceEnabled?: boolean;
  mcpServerUrl?: string;
}

export function useLiveCoach(options: UseLiveCoachOptions): LiveCoachState & LiveCoachActions {
  const {
    userId,
    problemId,
    problemTitle,
    autoConnect = true,
    voiceEnabled = true,
    mcpServerUrl = process.env.NEXT_PUBLIC_MCP_BRIDGE_URL || 'ws://localhost:3001',
  } = options;

  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState('00:00');

  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastCodeRef = useRef<string>('');
  const stuckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setSessionTime(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStart]);

  // Play voice audio
  const playAudio = useCallback((audioUrl: string) => {
    if (!voiceEnabled) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      setIsCoachSpeaking(true);

      audio.onended = () => {
        setIsCoachSpeaking(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        console.error('Audio playback failed');
        setIsCoachSpeaking(false);
        audioRef.current = null;
      };

      audio.play().catch((error) => {
        console.error('Audio play error:', error);
        setIsCoachSpeaking(false);
      });
    } catch (error) {
      console.error('Audio setup error:', error);
      setIsCoachSpeaking(false);
    }
  }, [voiceEnabled]);

  // Connect to MCP Bridge
  useEffect(() => {
    if (!autoConnect || !userId) return;

    const ws = new WebSocket(`${mcpServerUrl}?user=${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('🌉 Connected to MCP Bridge');
      setIsConnected(true);

      // Notify about problem start
      if (problemId && problemTitle) {
        ws.send(JSON.stringify({
          type: 'problem_started',
          data: {
            problemId,
            title: problemTitle,
            userId,
          },
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'voice_audio') {
          // Play voice audio
          playAudio(data.audioUrl);
          return;
        }

        // Add message to list
        const message: CoachMessage = {
          id: Date.now().toString() + Math.random(),
          type: data.type,
          text: data.text,
          emotion: data.emotion,
          timestamp: new Date(),
          audioUrl: data.audioUrl,
          level: data.level,
        };

        setMessages((prev) => [...prev, message]);

        // Track hints
        if (data.type === 'hint') {
          setHintsUsed((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Message parse error:', error);
      }
    };

    ws.onclose = () => {
      console.log('🌉 Disconnected from MCP Bridge');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (stuckTimerRef.current) {
        clearTimeout(stuckTimerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [userId, problemId, problemTitle, autoConnect, mcpServerUrl, playAudio]);

  // Send code update
  const sendCodeUpdate = useCallback((code: string) => {
    if (!wsRef.current || !isConnected) return;

    // Reset stuck timer
    if (stuckTimerRef.current) {
      clearTimeout(stuckTimerRef.current);
    }

    // Detect stuck state after 90 seconds of no code changes
    stuckTimerRef.current = setTimeout(() => {
      if (wsRef.current && isConnected) {
        wsRef.current.send(JSON.stringify({
          type: 'student_stuck',
          data: {
            idleTime: 90000,
            lastCode: lastCodeRef.current,
          },
        }));
      }
    }, 90000);

    // Only send if code actually changed
    if (code !== lastCodeRef.current) {
      lastCodeRef.current = code;

      wsRef.current.send(JSON.stringify({
        type: 'code_updated',
        data: {
          code,
          problemId,
          userId,
        },
      }));
    }
  }, [isConnected, problemId, userId]);

  // Request hint
  const requestHint = useCallback(() => {
    if (!wsRef.current || !isConnected) return;

    wsRef.current.send(JSON.stringify({
      type: 'hint_requested',
      data: {
        code: lastCodeRef.current,
        problemId,
        userId,
      },
    }));
  }, [isConnected, problemId, userId]);

  // Explain concept
  const explainConcept = useCallback((pattern?: string) => {
    if (!wsRef.current || !isConnected) return;

    wsRef.current.send(JSON.stringify({
      type: 'concept_explain',
      data: {
        pattern: pattern || problemTitle,
        problemId,
        userId,
      },
    }));
  }, [isConnected, problemTitle, problemId, userId]);

  // Report test results
  const reportTestResults = useCallback((results: any[]) => {
    if (!wsRef.current || !isConnected) return;

    wsRef.current.send(JSON.stringify({
      type: 'test_run',
      data: {
        results,
        code: lastCodeRef.current,
        problemId,
        userId,
      },
    }));
  }, [isConnected, problemId, userId]);

  // Celebrate success
  const celebrateSuccess = useCallback(() => {
    if (!wsRef.current || !isConnected) return;

    wsRef.current.send(JSON.stringify({
      type: 'problem_completed',
      data: {
        problemId,
        timeSpent: Date.now() - sessionStart,
        hintsUsed,
        userId,
      },
    }));
  }, [isConnected, problemId, sessionStart, hintsUsed, userId]);

  return {
    // State
    messages,
    isConnected,
    isCoachSpeaking,
    hintsUsed,
    sessionTime,
    
    // Actions
    sendCodeUpdate,
    requestHint,
    explainConcept,
    reportTestResults,
    celebrateSuccess,
  };
}

export default useLiveCoach;

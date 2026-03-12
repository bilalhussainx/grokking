"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AIIntervention } from "@/types/ai";

interface UseAISupervisionOptions {
  lessonTitle: string;
  starterCode: string;
  solutionCode: string;
  enabled: boolean;
}

export function useAISupervision({
  lessonTitle,
  starterCode,
  solutionCode,
  enabled,
}: UseAISupervisionOptions) {
  const [intervention, setIntervention] = useState<AIIntervention | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const lastChangeRef = useRef<number>(Date.now());
  const changeCountRef = useRef<number>(0);
  const currentCodeRef = useRef<string>(starterCode);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasShownRef = useRef<boolean>(false);

  const onCodeChange = useCallback((code: string) => {
    currentCodeRef.current = code;
    lastChangeRef.current = Date.now();
    changeCountRef.current += 1;
  }, []);

  const dismissIntervention = useCallback(() => {
    setIntervention(null);
  }, []);

  const checkIfStuck = useCallback(async () => {
    if (!enabled || isAnalyzing || hasShownRef.current) return;

    const timeSinceLastChange = Math.floor((Date.now() - lastChangeRef.current) / 1000);
    const code = currentCodeRef.current;

    // Only check if student has been idle for 90+ seconds and has made some changes
    if (timeSinceLastChange < 90 || changeCountRef.current < 3) return;

    // Don't check if code is same as starter (haven't started yet)
    if (code.trim() === starterCode.trim()) return;

    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/ai/supervise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          starterCode,
          solutionCode,
          lessonTitle,
          timeSinceLastChange,
          changeCount: changeCountRef.current,
        }),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.isStuck) {
        setIntervention({
          type: data.type,
          title: data.title,
          content: data.content,
          severity: data.severity,
        });
        hasShownRef.current = true;
      }
    } catch (err) {
      console.error("Supervision check failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [enabled, isAnalyzing, starterCode, solutionCode, lessonTitle]);

  useEffect(() => {
    if (!enabled) return;

    // Reset state when lesson changes
    hasShownRef.current = false;
    changeCountRef.current = 0;
    lastChangeRef.current = Date.now();
    setIntervention(null);

    // Check every 30 seconds
    checkIntervalRef.current = setInterval(checkIfStuck, 30000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [enabled, lessonTitle, checkIfStuck]);

  return {
    intervention,
    dismissIntervention,
    onCodeChange,
    isAnalyzing,
  };
}

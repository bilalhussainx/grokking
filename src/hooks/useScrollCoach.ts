"use client";
import { useState } from 'react';

/**
 * DEPRECATED — this used to fire generic messages like "Good stuff!"
 * on scroll. Now replaced by the event bus + contextual check-ins
 * in AICoach.tsx. This stub exists for backward compatibility.
 */
export function useScrollCoach(_isActive: boolean) {
  const [messages] = useState<{ text: string; progress: number }[]>([]);
  const reset = () => {};
  return { messages, reset };
}

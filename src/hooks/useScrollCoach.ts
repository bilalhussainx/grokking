"use client";
import { useState, useEffect, useRef } from 'react';

const GENERIC_MESSAGES = [
  "Good stuff — keep going!",
  "You're making great progress here.",
  "Key concept ahead — pay close attention.",
  "This part builds on what you just read.",
  "Almost there — the best part is coming up.",
  "Take your time with this section.",
  "Want me to explain this differently? Just ask.",
  "Still with me? I'm here if you need anything.",
];

export function useScrollCoach(isActive: boolean) {
  const [messages, setMessages] = useState<{ text: string; progress: number }[]>([]);
  const sentRef = useRef(new Set<number>());
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const progress = Math.round((window.scrollY / scrollHeight) * 100);

      const checkpoints = [25, 50, 75];
      for (const cp of checkpoints) {
        if (progress >= cp && !sentRef.current.has(cp)) {
          sentRef.current.add(cp);
          const msg = GENERIC_MESSAGES[Math.floor(Math.random() * GENERIC_MESSAGES.length)];
          setMessages(prev => [...prev, { text: msg, progress: cp }]);
        }
      }

      // Reset idle timer
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!sentRef.current.has(999)) {
          sentRef.current.add(999);
          setMessages(prev => [...prev, { text: "Still with me? Want me to explain this section?", progress: 999 }]);
        }
      }, 60000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isActive]);

  const reset = () => {
    setMessages([]);
    sentRef.current.clear();
  };

  return { messages, reset };
}

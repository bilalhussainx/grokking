"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  trigger: boolean;
}

export default function Confetti({ trigger }: ConfettiProps) {
  const prevTrigger = useRef(false);

  useEffect(() => {
    if (trigger && !prevTrigger.current) {
      let cancelled = false;

      import("canvas-confetti").then((mod) => {
        if (cancelled) return;
        const confetti = mod.default;

        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          if (cancelled || Date.now() > end) return;

          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ["#FFD700", "#7C3AED", "#3B82F6", "#10B981"],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ["#FFD700", "#7C3AED", "#3B82F6", "#10B981"],
          });

          requestAnimationFrame(frame);
        };

        frame();
      });

      return () => {
        cancelled = true;
      };
    }
    prevTrigger.current = trigger;
  }, [trigger]);

  return null;
}

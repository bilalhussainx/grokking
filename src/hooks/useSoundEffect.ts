"use client";
import { useCallback, useRef } from 'react';

type SoundName = 'xp-gain' | 'level-up' | 'achievement' | 'lesson-complete';

const SOUND_CONFIGS: Record<SoundName, { frequency: number; duration: number; type: OscillatorType }> = {
  'xp-gain': { frequency: 880, duration: 0.15, type: 'sine' },
  'level-up': { frequency: 523, duration: 0.5, type: 'triangle' },
  'achievement': { frequency: 659, duration: 0.3, type: 'sine' },
  'lesson-complete': { frequency: 784, duration: 0.25, type: 'triangle' },
};

export function useSoundEffect() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((name: SoundName) => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('sound-muted') === 'true') return;

    try {
      if (!ctxRef.current) ctxRef.current = new AudioContext();
      const ctx = ctxRef.current;
      const config = SOUND_CONFIGS[name];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = config.type;
      osc.frequency.setValueAtTime(config.frequency, ctx.currentTime);

      if (name === 'level-up') {
        // Rising tone for level up
        osc.frequency.linearRampToValueAtTime(config.frequency * 2, ctx.currentTime + config.duration);
      }

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + config.duration);
    } catch {}
  }, []);

  const toggleMute = useCallback(() => {
    const current = localStorage.getItem('sound-muted') === 'true';
    localStorage.setItem('sound-muted', String(!current));
    return !current;
  }, []);

  const isMuted = typeof window !== 'undefined' && localStorage.getItem('sound-muted') === 'true';

  return { play, toggleMute, isMuted };
}

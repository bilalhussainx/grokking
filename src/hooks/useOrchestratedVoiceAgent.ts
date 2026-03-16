/**
 * Orchestrated Voice Agent Hook (Sarvam Pipeline)
 *
 * For languages requiring native TTS (Hindi, Punjabi via Sarvam).
 * Uses a single streaming endpoint: audio → server (STT→LLM→TTS) → NDJSON stream
 *
 * Events streamed back:
 *   {type:"transcript", text:"..."} → show user message immediately
 *   {type:"response", text:"..."}  → show agent response immediately
 *   {type:"audio", base64:"..."}   → play audio immediately
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { isSarvamLanguage } from "@/lib/voice-provider-router";

interface SarvamAgentConfig {
  language: string;
  personaId?: string;
  proficiencyLevel?: string;
  lessonTitle?: string;
  lessonContext?: {
    lessonId: string;
    lessonTitle: string;
    targetPhrases: string[];
    vocabulary: string[];
    grammarFocus: string[];
  };
}

interface SarvamAgentCallbacks {
  onUserMessage?: (text: string) => void;
  onAgentMessage?: (text: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
}

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

export function useOrchestratedVoiceAgent(callbacks?: SarvamAgentCallbacks) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const callbacksRef = useRef(callbacks);
  const configRef = useRef<SarvamAgentConfig | null>(null);
  const conversationRef = useRef<ConversationTurn[]>([]);
  const processingRef = useRef(false);
  const connectedRef = useRef(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const vadAudioCtxRef = useRef<AudioContext | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Greeting phase — delay recording until greeting audio finishes to prevent self-reply loop
  const isGreetingPhaseRef = useRef(true);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Play base64 mp3 audio
  const playAudio = useCallback(async (base64Audio: string) => {
    if (!base64Audio) return;

    try {
      setIsSpeaking(true);

      if (currentSourceRef.current) {
        try { currentSourceRef.current.stop(); } catch {}
        currentSourceRef.current = null;
      }

      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      if (!playbackCtxRef.current || playbackCtxRef.current.state === 'closed') {
        playbackCtxRef.current = new AudioContext();
      }
      const ctx = playbackCtxRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      currentSourceRef.current = source;

      source.onended = () => {
        setIsSpeaking(false);
        currentSourceRef.current = null;
      };
      source.start();
    } catch (err) {
      console.error('[SarvamVoice] Audio playback error:', err);
      setIsSpeaking(false);
    }
  }, []);

  // Single streaming call: STT → LLM → TTS all in one request
  const processAudioChunk = useCallback(async (audioBlob: Blob) => {
    const config = configRef.current;
    if (!config || processingRef.current || audioBlob.size < 1000) return;
    processingRef.current = true;

    // Abort any previous in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      // Stop any playing audio (barge-in)
      if (currentSourceRef.current) {
        try { currentSourceRef.current.stop(); } catch {}
        currentSourceRef.current = null;
        setIsSpeaking(false);
      }

      const form = new FormData();
      form.append('audio', audioBlob, 'recording.webm');
      form.append('language', config.language);
      if (config.personaId) form.append('personaId', config.personaId);
      if (config.proficiencyLevel) form.append('proficiencyLevel', config.proficiencyLevel);
      if (config.lessonTitle) form.append('lessonTitle', config.lessonTitle);
      if (config.lessonContext) form.append('lessonContext', JSON.stringify(config.lessonContext));
      form.append('conversationHistory', JSON.stringify(conversationRef.current.slice(-10)));

      const resp = await fetch('/api/language/sarvam/stream', {
        method: 'POST',
        credentials: 'include',
        body: form,
        signal: abortController.signal,
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`Stream failed: ${resp.status}`);
      }

      // Read NDJSON stream
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const event = JSON.parse(line);

            switch (event.type) {
              case 'transcript':
                if (event.text?.trim()) {
                  callbacksRef.current?.onUserMessage?.(event.text);
                  conversationRef.current.push({ role: 'user', content: event.text });
                }
                break;

              case 'response':
                if (event.text) {
                  callbacksRef.current?.onAgentMessage?.(event.text);
                  conversationRef.current.push({ role: 'assistant', content: event.text });
                }
                break;

              case 'audio':
                if (event.base64) {
                  await playAudio(event.base64);
                }
                break;

              case 'error':
                console.error('[SarvamStream]', event.message);
                callbacksRef.current?.onError?.(event.message);
                break;
            }
          } catch {}
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('[SarvamVoice] Pipeline error:', err);
        callbacksRef.current?.onError?.(`${err}`);
      }
    } finally {
      processingRef.current = false;
    }
  }, [playAudio]);

  // Voice activity detection — 500ms silence ends utterance
  const startVAD = useCallback((stream: MediaStream) => {
    const audioCtx = new AudioContext();
    vadAudioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.4;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let speaking = false;
    const THRESHOLD = 20;
    const SILENCE_DURATION = 500; // Reduced from 700ms → 500ms for snappier response

    const check = () => {
      if (!connectedRef.current) return;
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (avg > THRESHOLD) {
        if (!speaking) {
          speaking = true;
          if (mediaRecorderRef.current?.state === 'inactive') {
            chunksRef.current = [];
            mediaRecorderRef.current.start();
          }
        }
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else if (speaking) {
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = setTimeout(() => {
            speaking = false;
            silenceTimerRef.current = null;
            if (mediaRecorderRef.current?.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
          }, SILENCE_DURATION);
        }
      }

      animFrameRef.current = requestAnimationFrame(check);
    };

    animFrameRef.current = requestAnimationFrame(check);
  }, []);

  const start = useCallback(async (config: SarvamAgentConfig) => {
    if (isConnecting || isConnected) return;

    if (!isSarvamLanguage(config.language)) {
      setError(`Language ${config.language} should use Deepgram Agent`);
      return;
    }

    setIsConnecting(true);
    setError('');
    configRef.current = config;
    conversationRef.current = [];

    try {
      // Health check
      const healthRes = await fetch('/api/language/sarvam', { credentials: 'include' });
      if (!healthRes.ok) throw new Error('Sarvam voice service unavailable');
      const health = await healthRes.json();
      if (!health.healthy) throw new Error('Voice APIs not configured');

      // Get mic
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      mediaStreamRef.current = stream;

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus' : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          chunksRef.current = [];
          processAudioChunk(blob);
        }
      };

      mediaRecorderRef.current = recorder;

      // Greeting phase — mute mic tracks and generate greeting before starting VAD/recording
      isGreetingPhaseRef.current = true;
      stream.getAudioTracks().forEach(t => { t.enabled = false; });

      setIsConnecting(false);
      setIsConnected(true);
      connectedRef.current = true;
      callbacksRef.current?.onConnect?.();

      // Generate and play greeting before enabling mic
      try {
        const greetingForm = new FormData();
        greetingForm.append('language', config.language);
        if (config.personaId) greetingForm.append('personaId', config.personaId);
        if (config.proficiencyLevel) greetingForm.append('proficiencyLevel', config.proficiencyLevel);
        if (config.lessonTitle) greetingForm.append('lessonTitle', config.lessonTitle);
        if (config.lessonContext) greetingForm.append('lessonContext', JSON.stringify(config.lessonContext));
        greetingForm.append('conversationHistory', JSON.stringify([]));
        greetingForm.append('greeting', 'true');

        const greetingResp = await fetch('/api/language/sarvam/stream', {
          method: 'POST',
          credentials: 'include',
          body: greetingForm,
        });

        if (greetingResp.ok && greetingResp.body) {
          const reader = greetingResp.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const event = JSON.parse(line);
                if (event.type === 'response' && event.text) {
                  callbacksRef.current?.onAgentMessage?.(event.text);
                  conversationRef.current.push({ role: 'assistant', content: event.text });
                } else if (event.type === 'audio' && event.base64) {
                  await playAudio(event.base64);
                  // Wait for audio playback to complete
                  await new Promise<void>(resolve => {
                    const checkDone = () => {
                      if (!currentSourceRef.current) resolve();
                      else setTimeout(checkDone, 100);
                    };
                    setTimeout(checkDone, 100);
                  });
                }
              } catch {}
            }
          }
        }
      } catch (err) {
        console.error('[SarvamVoice] Greeting error (non-fatal):', err);
      }

      // Greeting done — unmute mic and start VAD/recording
      isGreetingPhaseRef.current = false;
      stream.getAudioTracks().forEach(t => { t.enabled = true; });
      startVAD(stream);
    } catch (err) {
      console.error('[SarvamVoice] Start error:', err);
      setError(`Failed to start: ${err}`);
      setIsConnecting(false);
      callbacksRef.current?.onError?.(`${err}`);
    }
  }, [isConnecting, isConnected, processAudioChunk, startVAD, playAudio]);

  const stop = useCallback(() => {
    connectedRef.current = false;
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch {}
      currentSourceRef.current = null;
    }
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close().catch(() => {});
      playbackCtxRef.current = null;
    }
    if (vadAudioCtxRef.current) {
      vadAudioCtxRef.current.close().catch(() => {});
      vadAudioCtxRef.current = null;
    }
    conversationRef.current = [];
    chunksRef.current = [];
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    callbacksRef.current?.onDisconnect?.();
  }, []);

  const toggleMic = useCallback(() => {
    setMicMuted((prev) => {
      const next = !prev;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !next; });
      }
      return next;
    });
  }, []);

  const sendPromptUpdate = useCallback((_prompt: string) => {}, []);

  useEffect(() => {
    return () => {
      connectedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
      if (currentSourceRef.current) { try { currentSourceRef.current.stop(); } catch {} }
      if (playbackCtxRef.current) playbackCtxRef.current.close().catch(() => {});
      if (vadAudioCtxRef.current) vadAudioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return {
    isConnected, isConnecting, isSpeaking, micMuted, error,
    start, stop, toggleMic, sendPromptUpdate, isSarvamLanguage,
    isGreetingPhase: isGreetingPhaseRef.current,
  };
}

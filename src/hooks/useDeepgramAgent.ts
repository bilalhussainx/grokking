"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface DeepgramAgentConfig {
  lessonTitle?: string;
  moduleTitle?: string;
  courseTitle?: string;
  personaId?: string;
  voiceId?: string;
  mode?: "coach" | "interviewer" | "language";
  // Language-specific fields
  language?: string;
  systemPrompt?: string;
  proficiencyLevel?: string;
  lessonContext?: {
    lessonId: string;
    lessonTitle: string;
    targetPhrases: string[];
    vocabulary: string[];
    grammarFocus: string[];
    content?: string;
    starterCode?: string;
    solutionCode?: string;
  };
  apiEndpoint?: string; // Override: defaults to /api/ai/voice-session
}

interface DeepgramAgentCallbacks {
  onUserMessage?: (text: string) => void;
  onAgentMessage?: (text: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  onGreetingDone?: () => void;
}

export function useDeepgramAgent(callbacks?: DeepgramAgentCallbacks) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [error, setError] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const micCtxRef = useRef<AudioContext | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const micMutedRef = useRef(false);
  const callbacksRef = useRef(callbacks);

  // Streaming audio playback refs
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Agent message accumulation — one message per speaking turn
  const agentTextRef = useRef("");

  // Greeting phase — suppress user transcript processing until agent finishes greeting.
  // After greeting ends, a brief cooldown ignores transcripts from speaker echo.
  const isGreetingPhaseRef = useRef(true);
  const greetingCooldownRef = useRef(false);
  // Count how many AgentStartedSpeaking events we've seen — the first speaking turn is the greeting
  const agentSpeakCountRef = useRef(0);
  // Safety timeout: force-end greeting phase after 8 seconds no matter what
  const greetingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Schedule a PCM16 chunk for immediate streaming playback
  const scheduleAudioChunk = useCallback((pcmData: ArrayBuffer) => {
    if (!playbackCtxRef.current) return; // Created during start()
    const ctx = playbackCtxRef.current;
    // Resume if suspended (can happen after tab switch)
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const int16 = new Int16Array(pcmData);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startTime = Math.max(now, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;

    scheduledSourcesRef.current.push(source);
    source.onended = () => {
      scheduledSourcesRef.current = scheduledSourcesRef.current.filter((s) => s !== source);
    };
  }, []);

  // Stop all scheduled audio (for barge-in)
  const stopPlayback = useCallback(() => {
    for (const source of scheduledSourcesRef.current) {
      try { source.stop(); } catch { /* already stopped */ }
    }
    scheduledSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
  }, []);

  // Start mic capture and stream to WebSocket
  const startMic = useCallback(async (ws: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: 16000 });
      micCtxRef.current = ctx;

      await ctx.audioWorklet.addModule("/audio-capture-processor.js");
      const worklet = new AudioWorkletNode(ctx, "audio-capture-processor");
      workletRef.current = worklet;

      worklet.port.onmessage = (e) => {
        if (ws.readyState === WebSocket.OPEN && e.data && !micMutedRef.current) {
          ws.send(e.data);
        }
      };

      ctx.createMediaStreamSource(stream).connect(worklet);
      console.log("[Deepgram] Mic streaming started");
    } catch (err) {
      console.error("[Deepgram] Mic error:", err);
      setError("Microphone access failed. Check permissions.");
    }
  }, []);

  const cleanupMic = useCallback(() => {
    if (workletRef.current) { workletRef.current.disconnect(); workletRef.current = null; }
    if (micCtxRef.current) { micCtxRef.current.close().catch(() => {}); micCtxRef.current = null; }
    if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach((t) => t.stop()); mediaStreamRef.current = null; }
  }, []);

  const cleanupPlayback = useCallback(() => {
    stopPlayback();
    if (playbackCtxRef.current) { playbackCtxRef.current.close().catch(() => {}); playbackCtxRef.current = null; }
  }, [stopPlayback]);

  const stop = useCallback(() => {
    cleanupPlayback();
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    cleanupMic();
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    callbacksRef.current?.onDisconnect?.();
  }, [cleanupMic, cleanupPlayback]);

  const start = useCallback(
    async (config?: DeepgramAgentConfig) => {
      if (isConnecting || isConnected) return;

      setIsConnecting(true);
      setError("");

      try {
        // Create playback AudioContext with user gesture (required by browsers)
        if (playbackCtxRef.current) {
          playbackCtxRef.current.close().catch(() => {});
        }
        const pCtx = new AudioContext({ sampleRate: 24000 });
        await pCtx.resume();
        playbackCtxRef.current = pCtx;
        nextPlayTimeRef.current = 0;
        scheduledSourcesRef.current = [];

        // Play a tiny silent buffer to fully unlock audio
        const silentBuf = pCtx.createBuffer(1, 1, 24000);
        const silentSrc = pCtx.createBufferSource();
        silentSrc.buffer = silentBuf;
        silentSrc.connect(pCtx.destination);
        silentSrc.start();

        // Fetch config from voice-session API
        // Language mode uses /api/language/voice-session, others use /api/ai/voice-session
        const endpoint = config?.apiEndpoint ||
          (config?.mode === "language" ? "/api/language/voice-session" : "/api/ai/voice-session");

        const resp = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonTitle: config?.lessonTitle,
            moduleTitle: config?.moduleTitle,
            courseTitle: config?.courseTitle,
            personaId: config?.personaId,
            voiceId: config?.voiceId,
            mode: config?.mode || "coach",
            // Language-specific fields
            language: config?.language,
            systemPrompt: config?.systemPrompt,
            proficiencyLevel: config?.proficiencyLevel,
            lessonContext: config?.lessonContext,
          }),
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || `API error ${resp.status}`);
        }

        const { url, key, settings } = await resp.json();

        // Open WebSocket
        const ws = new WebSocket(url, ["token", key]);
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("[Deepgram] WebSocket open — sending settings");
          ws.send(JSON.stringify(settings));
        };

        ws.onmessage = (event) => {
          // Binary = audio data — stream it immediately
          if (event.data instanceof ArrayBuffer) {
            scheduleAudioChunk(event.data);
            return;
          }

          // JSON event
          try {
            const msg = JSON.parse(event.data);

            switch (msg.type) {
              case "SettingsApplied":
                console.log("[Deepgram] Settings applied — greeting phase active");
                isGreetingPhaseRef.current = true;
                // Safety timeout: force-end greeting phase after 8s
                if (greetingTimeoutRef.current) clearTimeout(greetingTimeoutRef.current);
                greetingTimeoutRef.current = setTimeout(() => {
                  if (isGreetingPhaseRef.current) {
                    console.log("[Deepgram] Safety timeout — force-ending greeting phase");
                    isGreetingPhaseRef.current = false;
                    greetingCooldownRef.current = false;
                  }
                }, 5000);
                greetingCooldownRef.current = false;
                agentSpeakCountRef.current = 0;
                // Do NOT mute mic — Deepgram needs continuous audio stream or
                // it disconnects with CLIENT_MESSAGE_TIMEOUT. We suppress user
                // transcript processing during greeting instead.
                setIsConnecting(false);
                setIsConnected(true);
                callbacksRef.current?.onConnect?.();
                startMic(ws);
                break;

              case "UserStartedSpeaking":
                // During greeting phase or cooldown, ignore user speech to prevent self-reply
                if (isGreetingPhaseRef.current || greetingCooldownRef.current) break;
                // Barge-in: stop agent audio, flush accumulated text
                stopPlayback();
                setIsSpeaking(false);
                if (agentTextRef.current.trim()) {
                  callbacksRef.current?.onAgentMessage?.(agentTextRef.current.trim());
                  agentTextRef.current = "";
                }
                break;

              case "AgentStartedSpeaking":
                // New agent turn — reset text accumulator
                agentTextRef.current = "";
                setIsSpeaking(true);
                agentSpeakCountRef.current += 1;
                break;

              case "AgentAudioDone":
                // Agent finished speaking — flush accumulated text as one message
                setIsSpeaking(false);
                if (agentTextRef.current.trim()) {
                  callbacksRef.current?.onAgentMessage?.(agentTextRef.current.trim());
                  agentTextRef.current = "";
                }
                // End greeting phase after the first agent speaking turn completes.
                // Brief cooldown to ignore echo from speakers being picked up by mic.
                if (isGreetingPhaseRef.current && agentSpeakCountRef.current >= 1) {
                  console.log("[Deepgram] Greeting done — starting 500ms echo cooldown");
                  isGreetingPhaseRef.current = false;
                  if (greetingTimeoutRef.current) clearTimeout(greetingTimeoutRef.current);
                  greetingCooldownRef.current = true;
                  callbacksRef.current?.onGreetingDone?.();
                  setTimeout(() => {
                    greetingCooldownRef.current = false;
                    console.log("[Deepgram] Echo cooldown ended — now accepting user speech");
                  }, 500);
                }
                break;

              case "ConversationText":
                console.log("[Deepgram] ConversationText:", msg.role, msg.content?.slice(0, 50));
                if (msg.role === "user" && msg.content) {
                  // Only suppress during initial greeting phase, not during cooldown
                  // (cooldown was too aggressive — blocked legitimate user speech)
                  if (!isGreetingPhaseRef.current) {
                    callbacksRef.current?.onUserMessage?.(msg.content);
                  }
                } else if (msg.role === "assistant" && msg.content) {
                  // Accumulate — don't emit yet, wait for AgentAudioDone
                  agentTextRef.current += (agentTextRef.current ? " " : "") + msg.content;
                }
                break;

              // Some Deepgram Agent API versions send user transcripts as separate events
              case "UserTranscript":
                if (msg.text && !isGreetingPhaseRef.current) {
                  callbacksRef.current?.onUserMessage?.(msg.text);
                }
                break;

              case "Error":
                console.error("[Deepgram] Agent error:", msg);
                setError(msg.description || "Voice agent error");
                callbacksRef.current?.onError?.(msg.description || "Voice agent error");
                break;
            }
          } catch {
            // Non-JSON message, ignore
          }
        };

        ws.onerror = () => {
          console.error("[Deepgram] WebSocket error");
          setError("Voice connection error. Try reconnecting.");
          setIsConnecting(false);
          callbacksRef.current?.onError?.("WebSocket error");
        };

        ws.onclose = (e) => {
          console.log("[Deepgram] WebSocket closed:", e.code, e.reason);
          cleanupMic();
          setIsConnected(false);
          setIsConnecting(false);
          setIsSpeaking(false);
          callbacksRef.current?.onDisconnect?.();
        };
      } catch (err) {
        console.error("[Deepgram] Failed to start:", err);
        setError(`Failed to connect: ${err}`);
        setIsConnecting(false);
        callbacksRef.current?.onError?.(`${err}`);
      }
    },
    [isConnecting, isConnected, startMic, cleanupMic, scheduleAudioChunk, stopPlayback]
  );

  const toggleMic = useCallback(() => {
    setMicMuted((prev) => {
      const next = !prev;
      micMutedRef.current = next;
      return next;
    });
  }, []);

  const sendPromptUpdate = useCallback((prompt: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "UpdatePrompt", prompt }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
      if (playbackCtxRef.current) playbackCtxRef.current.close().catch(() => {});
      if (wsRef.current) wsRef.current.close();
      if (workletRef.current) workletRef.current.disconnect();
      if (micCtxRef.current) micCtxRef.current.close().catch(() => {});
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [stopPlayback]);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    micMuted,
    error,
    start,
    stop,
    toggleMic,
    sendPromptUpdate,
    isGreetingPhase: isGreetingPhaseRef.current,
  };
}

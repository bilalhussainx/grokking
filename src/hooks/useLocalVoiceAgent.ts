"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { VoiceAgentConfig } from "@/lib/language-personas";

interface LocalVoiceAgentCallbacks {
  onUserMessage?: (text: string) => void;
  onAgentMessage?: (text: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  onMetadata?: (metadata: AgentTurnMetadata) => void;
}

interface AgentTurnMetadata {
  mistakesDetected: {
    type: 'grammar' | 'pronunciation' | 'vocabulary' | 'cultural';
    utterance: string;
    correction: string;
    explanation: string;
  }[];
  vocabUsedCorrectly: string[];
  vocabUsedIncorrectly: string[];
  estimatedProficiencySignal: 'below_level' | 'at_level' | 'above_level';
  suggestedNextTopics: string[];
}

interface WebSocketMessage {
  type: 'connected' | 'user_transcript' | 'agent_response' | 'agent_audio' | 'agent_done' | 'user_started_speaking' | 'credit_warning' | 'session_ending' | 'metadata' | 'error' | 'disconnected';
  data?: unknown;
  text?: string;
  audio?: string; // base64
  metadata?: AgentTurnMetadata;
  error?: string;
}

export function useLocalVoiceAgent(callbacks?: LocalVoiceAgentCallbacks) {
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
  const configRef = useRef<VoiceAgentConfig | null>(null);

  // Streaming audio playback refs
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef(0);
  const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Agent message accumulation
  const agentTextRef = useRef("");
  const sessionStartTimeRef = useRef<Date | null>(null);
  const transcriptRef = useRef<{role: 'user' | 'assistant', text: string, timestamp: string}[]>([]);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Schedule a PCM16 chunk for immediate streaming playback
  const scheduleAudioChunk = useCallback((base64Audio: string) => {
    if (!playbackCtxRef.current) return;
    const ctx = playbackCtxRef.current;
    
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Decode base64 to ArrayBuffer
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Convert to float32
    const int16 = new Int16Array(bytes.buffer);
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
          // Send audio chunk as binary
          ws.send(e.data);
        }
      };

      ctx.createMediaStreamSource(stream).connect(worklet);
      console.log("[LocalVoice] Mic streaming started");
    } catch (err) {
      console.error("[LocalVoice] Mic error:", err);
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
    // Save session before stopping
    if (sessionStartTimeRef.current && configRef.current) {
      const duration = Math.floor((Date.now() - sessionStartTimeRef.current.getTime()) / 1000);
      saveSession(duration);
    }

    cleanupPlayback();
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    cleanupMic();
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    callbacksRef.current?.onDisconnect?.();
  }, [cleanupMic, cleanupPlayback]);

  const saveSession = async (durationSeconds: number) => {
    if (!configRef.current) return;
    
    try {
      await fetch("/api/language/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLanguage: configRef.current.language,
          personaId: configRef.current.personaId,
          durationSeconds,
          transcript: transcriptRef.current,
        }),
      });
    } catch (err) {
      console.error("[LocalVoice] Failed to save session:", err);
    }
  };

  const start = useCallback(
    async (config: VoiceAgentConfig) => {
      if (isConnecting || isConnected) return;

      setIsConnecting(true);
      setError("");
      configRef.current = config;
      sessionStartTimeRef.current = new Date();
      transcriptRef.current = [];

      try {
        // Create playback AudioContext
        if (playbackCtxRef.current) {
          playbackCtxRef.current.close().catch(() => {});
        }
        const pCtx = new AudioContext({ sampleRate: 24000 });
        await pCtx.resume();
        playbackCtxRef.current = pCtx;
        nextPlayTimeRef.current = 0;
        scheduledSourcesRef.current = [];

        // Play silent buffer to unlock audio
        const silentBuf = pCtx.createBuffer(1, 1, 24000);
        const silentSrc = pCtx.createBufferSource();
        silentSrc.buffer = silentBuf;
        silentSrc.connect(pCtx.destination);
        silentSrc.start();

        // Get WebSocket URL from API
        const resp = await fetch("/api/language/voice-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: config.language,
            personaId: config.personaId,
            proficiencyLevel: config.proficiencyLevel,
            lessonTitle: config.lessonTitle,
            moduleTitle: config.moduleTitle,
            courseTitle: config.courseTitle,
            voiceProvider: config.voiceProvider,
            voiceId: config.voiceId,
          }),
        });

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}));
          throw new Error(data.error || `API error ${resp.status}`);
        }

        const { url, token, settings } = await resp.json();

        // Open WebSocket to VPS
        const ws = new WebSocket(`${url}?token=${token}`);
        ws.binaryType = "arraybuffer";
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("[LocalVoice] WebSocket open — sending settings");
          ws.send(JSON.stringify({ type: "settings", ...settings }));
        };

        ws.onmessage = (event) => {
          // Binary = audio data (PCM 16-bit 24kHz mono)
          if (event.data instanceof ArrayBuffer) {
            // Directly play PCM without base64 conversion
            const int16 = new Int16Array(event.data);
            const float32 = new Float32Array(int16.length);
            for (let i = 0; i < int16.length; i++) {
              float32[i] = int16[i] / 32768;
            }
            
            if (!playbackCtxRef.current) return;
            const ctx = playbackCtxRef.current;
            if (ctx.state === "suspended") ctx.resume().catch(() => {});
            
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
            return;
          }

          // JSON message
          try {
            const msg: WebSocketMessage = JSON.parse(event.data);

            switch (msg.type) {
              case "connected":
                console.log("[LocalVoice] Connected — starting mic");
                setIsConnecting(false);
                setIsConnected(true);
                callbacksRef.current?.onConnect?.();
                startMic(ws);
                break;

              case "user_transcript":
                if (msg.text) {
                  transcriptRef.current.push({
                    role: "user",
                    text: msg.text,
                    timestamp: new Date().toISOString(),
                  });
                  callbacksRef.current?.onUserMessage?.(msg.text);
                }
                break;

              case "agent_response":
                if (msg.text) {
                  agentTextRef.current += (agentTextRef.current ? " " : "") + msg.text;
                  setIsSpeaking(true);
                }
                break;

              case "agent_audio":
                // Audio chunk received (handled above as binary, but could be base64 too)
                if (msg.audio) {
                  scheduleAudioChunk(msg.audio);
                }
                break;

              case "agent_done":
                // Agent finished speaking
                setIsSpeaking(false);
                if (agentTextRef.current.trim()) {
                  transcriptRef.current.push({
                    role: "assistant",
                    text: agentTextRef.current.trim(),
                    timestamp: new Date().toISOString(),
                  });
                  callbacksRef.current?.onAgentMessage?.(agentTextRef.current.trim());
                  agentTextRef.current = "";
                }
                break;

              case "user_started_speaking":
                // Barge-in: stop agent audio
                stopPlayback();
                setIsSpeaking(false);
                if (agentTextRef.current.trim()) {
                  transcriptRef.current.push({
                    role: "assistant",
                    text: agentTextRef.current.trim(),
                    timestamp: new Date().toISOString(),
                  });
                  callbacksRef.current?.onAgentMessage?.(agentTextRef.current.trim());
                  agentTextRef.current = "";
                }
                break;

              case "metadata":
                if (msg.metadata) {
                  callbacksRef.current?.onMetadata?.(msg.metadata);
                }
                break;

              case "error":
                console.error("[LocalVoice] Agent error:", msg.error);
                setError(msg.error || "Voice agent error");
                callbacksRef.current?.onError?.(msg.error || "Voice agent error");
                break;

              case "disconnected":
                stop();
                break;
            }
          } catch {
            // Non-JSON message, ignore
          }
        };

        ws.onerror = () => {
          console.error("[LocalVoice] WebSocket error");
          setError("Voice connection error. Try reconnecting.");
          setIsConnecting(false);
          callbacksRef.current?.onError?.("WebSocket error");
        };

        ws.onclose = (e) => {
          console.log("[LocalVoice] WebSocket closed:", e.code, e.reason);
          cleanupMic();
          setIsConnected(false);
          setIsConnecting(false);
          setIsSpeaking(false);
          callbacksRef.current?.onDisconnect?.();
        };
      } catch (err) {
        console.error("[LocalVoice] Failed to start:", err);
        setError(`Failed to connect: ${err}`);
        setIsConnecting(false);
        callbacksRef.current?.onError?.(`${err}`);
      }
    },
    [isConnecting, isConnected, startMic, cleanupMic, scheduleAudioChunk, stopPlayback, stop]
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
      wsRef.current.send(JSON.stringify({ type: "update_prompt", prompt }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionStartTimeRef.current && configRef.current) {
        const duration = Math.floor((Date.now() - sessionStartTimeRef.current.getTime()) / 1000);
        saveSession(duration);
      }
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
  };
}

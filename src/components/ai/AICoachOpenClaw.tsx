'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Lightbulb, Trophy, Timer, MessageCircle, Wifi, WifiOff } from 'lucide-react';
import { getVoiceInput } from '@/lib/voiceInput';

interface CoachMessage {
  id: string;
  text: string;
  type: 'user' | 'coach' | 'hint' | 'celebration';
  emotion?: string;
  timestamp: Date;
  spoken?: boolean;
}

interface AICoachOpenClawProps {
  currentProblem?: string;
  userCode?: string;
  userId?: string;
  enableVoice?: boolean;
  bridgeUrl?: string; // WebSocket URL for MCP bridge
}

/**
 * AI Coach component that connects to OpenClaw Gateway via MCP Bridge
 * 
 * This component establishes a WebSocket connection to the MCP bridge server,
 * which routes coaching requests to OpenClaw (SuperCore AI) and streams
 * responses back with voice.
 */
export default function AICoachOpenClaw({ 
  currentProblem, 
  userCode = '',
  userId = `student-${Date.now()}`,
  enableVoice = true,
  bridgeUrl = 'ws://localhost:3001'
}: AICoachOpenClawProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState('00:00');
  const [voiceEnabled, setVoiceEnabled] = useState(enableVoice);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [hintsGiven, setHintsGiven] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const voiceInput = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize voice input
  useEffect(() => {
    if (typeof window !== 'undefined') {
      voiceInput.current = getVoiceInput();
    }
  }, []);

  // Connect to MCP Bridge WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${bridgeUrl}?user=${userId}`);
    
    ws.onopen = () => {
      console.log('✅ Connected to OpenClaw MCP Bridge');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'coach_message':
          case 'hint':
          case 'celebration':
          case 'concept_explanation':
            const message: CoachMessage = {
              id: Date.now().toString(),
              text: data.text,
              type: data.type === 'hint' ? 'hint' : data.type === 'celebration' ? 'celebration' : 'coach',
              emotion: data.emotion,
              timestamp: new Date(data.timestamp || Date.now()),
              spoken: false,
            };
            setMessages(prev => [...prev, message]);
            
            if (data.type === 'hint') {
              setHintsGiven(prev => prev + 1);
            }
            break;

          case 'voice_audio':
            // Play voice response
            if (voiceEnabled && data.audioUrl) {
              playAudio(data.audioUrl);
              // Mark last message as spoken
              setMessages(prev => {
                const updated = [...prev];
                if (updated.length > 0) {
                  updated[updated.length - 1].spoken = true;
                }
                return updated;
              });
            }
            break;

          case 'error':
            console.error('Coach error:', data.message);
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('🔌 Disconnected from OpenClaw MCP Bridge');
      setIsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [bridgeUrl, userId, voiceEnabled]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setSessionTime(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionStart]);

  // Notify coach when problem starts
  useEffect(() => {
    if (currentProblem && wsRef.current?.readyState === WebSocket.OPEN) {
      sendEvent('problem_started', { title: currentProblem });
    }
  }, [currentProblem]);

  // Notify coach of code updates
  useEffect(() => {
    if (userCode && wsRef.current?.readyState === WebSocket.OPEN) {
      sendEvent('code_updated', { code: userCode });
    }
  }, [userCode]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendEvent = (type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, data }));
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setIsSpeaking(true);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setIsSpeaking(false);
      audioRef.current = null;
    };

    audio.onerror = () => {
      setIsSpeaking(false);
      audioRef.current = null;
    };

    audio.play().catch(err => {
      console.error('Failed to play audio:', err);
      setIsSpeaking(false);
    });
  };

  const addUserMessage = (text: string) => {
    const message: CoachMessage = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    
    // Send to OpenClaw via MCP bridge
    sendEvent('voice_message', { transcript: text });
  };

  const toggleListening = async () => {
    if (!voiceInput.current) {
      alert('Voice input not supported in your browser');
      return;
    }
    
    if (isListening) {
      voiceInput.current.stop();
      setIsListening(false);
      setLiveTranscript('');
    } else {
      try {
        await voiceInput.current.start((transcript: string, isFinal: boolean) => {
          if (isFinal) {
            addUserMessage(transcript);
            setLiveTranscript('');
          } else {
            setLiveTranscript(transcript);
          }
        });
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start listening:', error);
        alert('Microphone access denied. Please allow microphone access to use voice input.');
      }
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
    if (!voiceEnabled && audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  };

  const handleQuickAction = (action: 'hint' | 'explain' | 'celebrate') => {
    switch (action) {
      case 'hint':
        sendEvent('hint_requested', { code: userCode });
        break;
      case 'explain':
        sendEvent('concept_explain', { pattern: currentProblem });
        break;
      case 'celebrate':
        addUserMessage("I got it! I understand the solution now!");
        break;
    }
  };

  const getMessageIcon = (type: CoachMessage['type']) => {
    switch (type) {
      case 'hint':
        return '💡';
      case 'celebration':
        return '🎉';
      case 'coach':
        return '🤖';
      case 'user':
        return '👤';
      default:
        return '💬';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
            🤖
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold flex items-center gap-2">
              Coach SuperCore
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" title="Connected to OpenClaw" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" title="Disconnected" />
              )}
            </h3>
            <p className="text-sm text-gray-400">OpenClaw AI Coach</p>
          </div>
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-lg transition-colors ${
              voiceEnabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
            }`}
            title={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-mono">{sessionTime}</span>
          </div>
          <div className="text-sm text-gray-400">
            {hintsGiven} hints used
          </div>
        </div>
        
        {/* Voice Status Indicators */}
        <div className="flex gap-2 text-xs">
          {isSpeaking && (
            <div className="flex items-center gap-1 text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
              <Volume2 className="w-3 h-3 animate-pulse" />
              <span>Coach speaking...</span>
            </div>
          )}
          {isListening && (
            <div className="flex items-center gap-1 text-green-400 bg-green-900/20 px-2 py-1 rounded">
              <Mic className="w-3 h-3 animate-pulse" />
              <span>Listening...</span>
            </div>
          )}
          {!isConnected && (
            <div className="flex items-center gap-1 text-red-400 bg-red-900/20 px-2 py-1 rounded">
              <WifiOff className="w-3 h-3" />
              <span>Connecting...</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.type === 'user'
                ? 'bg-gray-700 ml-8'
                : message.type === 'hint'
                ? 'bg-purple-900/30 mr-8 border-l-4 border-purple-500'
                : message.type === 'celebration'
                ? 'bg-pink-900/30 mr-8 border-l-4 border-pink-500'
                : 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 mr-8 border-l-4 border-blue-500'
            } animate-slide-in`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getMessageIcon(message.type)}</span>
              <span className="text-sm font-semibold text-gray-300">
                {message.type === 'user' ? 'You' : 'Coach SuperCore'}
              </span>
              {message.type === 'user' && (
                <Mic className="w-3 h-3 text-green-400" />
              )}
              {message.type === 'coach' && message.spoken && (
                <Volume2 className="w-3 h-3 text-blue-400" />
              )}
              <span className="text-xs text-gray-500 ml-auto">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{message.text}</p>
          </div>
        ))}
        
        {/* Live transcript */}
        {liveTranscript && (
          <div className="p-3 rounded-lg bg-gray-700 ml-8 border-2 border-green-500 animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <Mic className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-sm font-semibold text-gray-300">You (speaking...)</span>
            </div>
            <p className="text-gray-300 text-sm italic">{liveTranscript}</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Voice Input Button (Primary) */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={toggleListening}
          disabled={isSpeaking || !isConnected}
          className={`w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/50'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/50'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-6 h-6 animate-pulse" />
              <span className="font-semibold">Stop Listening</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span className="font-semibold">Press to Speak to SuperCore</span>
            </>
          )}
        </button>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => handleQuickAction('hint')}
            disabled={isSpeaking || isListening || !isConnected}
            className="py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Lightbulb className="w-3 h-3" />
            Hint
          </button>
          <button
            onClick={() => handleQuickAction('explain')}
            disabled={isSpeaking || isListening || !isConnected}
            className="py-2 px-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            Explain
          </button>
          <button
            onClick={() => handleQuickAction('celebrate')}
            disabled={isSpeaking || isListening || !isConnected}
            className="py-2 px-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Trophy className="w-3 h-3" />
            Got It
          </button>
        </div>
        
        {/* Connection Status */}
        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {isConnected ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-semibold">Connected to OpenClaw</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-red-400 font-semibold">Connecting...</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Powered by SuperCore AI via OpenClaw Gateway
          </p>
        </div>
      </div>
    </div>
  );
}

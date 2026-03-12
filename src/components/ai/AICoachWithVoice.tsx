'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle, Lightbulb, Trophy, Timer, Volume2, VolumeX } from 'lucide-react';
import { coachSpeak, EmotionType } from '@/lib/voiceCoach';

interface CoachMessage {
  id: string;
  text: string;
  type: 'encouraging' | 'teaching' | 'hint' | 'celebrating';
  timestamp: Date;
  spoken?: boolean;
}

interface AICoachWithVoiceProps {
  currentProblem?: string;
  userCode?: string;
  onHintRequest?: () => void;
  onConceptExplain?: () => void;
  enableVoice?: boolean;
}

export default function AICoachWithVoice({ 
  currentProblem, 
  userCode = '',
  onHintRequest,
  onConceptExplain,
  enableVoice = true
}: AICoachWithVoiceProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [hintsGiven, setHintsGiven] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState('00:00');
  const [userState, setUserState] = useState<'idle' | 'thinking' | 'coding' | 'stuck'>('idle');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [voiceEnabled, setVoiceEnabled] = useState(enableVoice);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
  
  // Activity tracking
  useEffect(() => {
    if (userCode && userCode.length > 50) {
      if (userState !== 'coding') {
        setUserState('coding');
        addMessage(
          "Nice! You're diving into the code. I like that you're getting your hands dirty!",
          'encouraging'
        );
      }
      setLastActivity(Date.now());
    }
  }, [userCode, userState]);
  
  // Stuck detection
  useEffect(() => {
    const checkStuck = setInterval(() => {
      if (Date.now() - lastActivity > 90000 && userState === 'thinking') {
        setUserState('stuck');
        addMessage(
          "I notice you've been thinking for a bit. That's totally fine! Want a hint to get unstuck?",
          'hint'
        );
        setLastActivity(Date.now());
      }
    }, 30000);
    
    return () => clearInterval(checkStuck);
  }, [lastActivity, userState]);
  
  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage(
        "Hey! I'm Coach Alex, your AI coding companion. I'm here to help you master this problem. Let's tackle it together!",
        'encouraging'
      );
    }
  }, []);
  
  // Problem change
  useEffect(() => {
    if (currentProblem && messages.length > 1) {
      addMessage(
        `Perfect! Let's work on "${currentProblem}". Read through the problem carefully, think about the pattern, and I'll guide you along the way!`,
        'encouraging'
      );
      setHintsGiven(0);
      setUserState('thinking');
    }
  }, [currentProblem]);
  
  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const addMessage = async (text: string, type: CoachMessage['type']) => {
    const message: CoachMessage = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date(),
      spoken: false
    };
    
    setMessages(prev => [...prev, message]);
    
    // Speak the message if voice is enabled
    if (voiceEnabled && !isSpeaking) {
      setIsSpeaking(true);
      try {
        const emotionMap: Record<typeof type, EmotionType> = {
          encouraging: 'encouraging',
          teaching: 'teaching',
          hint: 'gentle_nudge',
          celebrating: 'celebrating'
        };
        
        await coachSpeak(text, emotionMap[type]);
        message.spoken = true;
      } catch (error) {
        console.error('Failed to speak message:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };
  
  const handleGetHint = () => {
    const hints = [
      "Let me give you a gentle nudge. Think about what pattern this problem fits into. What's the key insight here?",
      "Here's a more specific hint: Look at the constraints and data structure. How can they help you optimize?",
      "Let's break it down step by step. Start by identifying the subproblems, then think about how to combine their solutions.",
      "Okay, here's the roadmap: First, understand the base case. Then, think about the recursive or iterative structure."
    ];
    
    const hint = hints[Math.min(hintsGiven, hints.length - 1)];
    addMessage(hint, 'hint');
    setHintsGiven(prev => prev + 1);
    onHintRequest?.();
  };
  
  const handleExplainConcept = () => {
    addMessage(
      "Let me explain the core concept behind this pattern. The key is recognizing the structure and applying the right technique efficiently. Think about how to minimize time complexity by avoiding redundant work.",
      'teaching'
    );
    onConceptExplain?.();
  };
  
  const handleCelebrate = () => {
    const celebrations = [
      "Excellent! You're really nailing this. That's exactly the right approach!",
      "Outstanding work! I can tell you really understand the pattern here.",
      "Perfect! You've got the intuition down. This is how pros solve problems!",
      "Brilliant! You're crushing it. Want to try a harder problem?"
    ];
    addMessage(
      celebrations[Math.floor(Math.random() * celebrations.length)],
      'celebrating'
    );
  };
  
  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
  };
  
  const getMessageIcon = (type: CoachMessage['type']) => {
    switch (type) {
      case 'encouraging':
        return '🌟';
      case 'teaching':
        return '📚';
      case 'hint':
        return '💡';
      case 'celebrating':
        return '🎉';
      default:
        return '🎓';
    }
  };
  
  const getStateColor = () => {
    switch (userState) {
      case 'coding':
        return 'text-green-500';
      case 'stuck':
        return 'text-red-500';
      case 'thinking':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };
  
  const getStateDot = () => {
    const baseClasses = "w-2 h-2 rounded-full animate-pulse";
    switch (userState) {
      case 'coding':
        return `${baseClasses} bg-green-500`;
      case 'stuck':
        return `${baseClasses} bg-red-500`;
      case 'thinking':
        return `${baseClasses} bg-yellow-500`;
      default:
        return `${baseClasses} bg-gray-400`;
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl">
            🎓
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Coach Alex</h3>
            <p className="text-sm text-gray-400">Your AI Interview Coach</p>
          </div>
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-lg transition-colors ${
              voiceEnabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
            }`}
            title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-mono">{sessionTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={getStateDot()}></div>
            <span className={`text-sm ${getStateColor()}`}>
              {userState.charAt(0).toUpperCase() + userState.slice(1)}
            </span>
          </div>
        </div>
        
        {isSpeaking && (
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-400">
            <Volume2 className="w-3 h-3 animate-pulse" />
            <span>Speaking...</span>
          </div>
        )}
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg border-l-4 ${
              message.type === 'encouraging'
                ? 'bg-green-900/20 border-green-500'
                : message.type === 'teaching'
                ? 'bg-yellow-900/20 border-yellow-500'
                : message.type === 'hint'
                ? 'bg-purple-900/20 border-purple-500'
                : 'bg-pink-900/20 border-pink-500'
            } animate-slide-in`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getMessageIcon(message.type)}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {message.type}
              </span>
              {message.spoken && (
                <Volume2 className="w-3 h-3 text-blue-400 ml-auto" />
              )}
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">{message.text}</p>
            <span className="text-xs text-gray-500 mt-2 block">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={handleGetHint}
          disabled={isSpeaking}
          className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          Get Hint
          {hintsGiven > 0 && (
            <span className="ml-auto bg-purple-800 px-2 py-0.5 rounded-full text-xs">
              {hintsGiven}
            </span>
          )}
        </button>
        
        <button
          onClick={handleExplainConcept}
          disabled={isSpeaking}
          className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Explain Pattern
        </button>
        
        <button
          onClick={handleCelebrate}
          disabled={isSpeaking}
          className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          I Got It!
        </button>
      </div>
      
      {/* Progress */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Session Progress</span>
          <span className="text-xs text-gray-400">{hintsGiven} hints used</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${Math.min((hintsGiven / 4) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

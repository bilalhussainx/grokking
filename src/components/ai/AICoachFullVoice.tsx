'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Lightbulb, Trophy, Timer, MessageCircle } from 'lucide-react';
import { coachSpeak, EmotionType } from '@/lib/voiceCoach';
import { getVoiceInput, VoiceInput } from '@/lib/voiceInput';

interface CoachMessage {
  id: string;
  text: string;
  type: 'user' | 'coach';
  emotion?: EmotionType;
  timestamp: Date;
  spoken?: boolean;
}

interface AICoachFullVoiceProps {
  currentProblem?: string;
  userCode?: string;
  onCodeUpdate?: (code: string) => void;
  enableVoice?: boolean;
}

export default function AICoachFullVoice({ 
  currentProblem, 
  userCode = '',
  onCodeUpdate,
  enableVoice = true
}: AICoachFullVoiceProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [sessionStart] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState('00:00');
  const [voiceEnabled, setVoiceEnabled] = useState(enableVoice);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [userState, setUserState] = useState<'idle' | 'thinking' | 'coding' | 'stuck'>('idle');
  const [lastActivity, setLastActivity] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceInput = useRef<VoiceInput | null>(null);
  
  // Initialize voice input
  useEffect(() => {
    if (typeof window !== 'undefined') {
      voiceInput.current = getVoiceInput();
    }
  }, []);
  
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
      }
      setLastActivity(Date.now());
    }
  }, [userCode, userState]);
  
  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addCoachMessage(
        "Hey! I'm Coach Alex, your AI coding companion. Press the mic button and tell me what you're working on, or just start coding and I'll help you along the way!",
        'encouraging'
      );
    }
  }, []);
  
  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const addCoachMessage = async (text: string, emotion: EmotionType = 'neutral') => {
    const message: CoachMessage = {
      id: Date.now().toString(),
      text,
      type: 'coach',
      emotion,
      timestamp: new Date(),
      spoken: false
    };
    
    setMessages(prev => [...prev, message]);
    
    // Speak the message if voice is enabled
    if (voiceEnabled && !isSpeaking) {
      setIsSpeaking(true);
      try {
        await coachSpeak(text, emotion);
        message.spoken = true;
      } catch (error) {
        console.error('Failed to speak message:', error);
      } finally {
        setIsSpeaking(false);
      }
    }
  };
  
  const addUserMessage = (text: string) => {
    const message: CoachMessage = {
      id: Date.now().toString(),
      text,
      type: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    setLastActivity(Date.now());
    
    // Process user input and generate coach response
    handleUserInput(text);
  };
  
  const handleUserInput = async (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Detect intent and respond appropriately
    if (lowerInput.includes('hint') || lowerInput.includes('help') || lowerInput.includes('stuck')) {
      await addCoachMessage(
        "Let me give you a nudge in the right direction. Think about the pattern this problem follows. What's the key insight that makes it efficient?",
        'gentle_nudge'
      );
    } else if (lowerInput.includes('explain') || lowerInput.includes('how') || lowerInput.includes('why')) {
      await addCoachMessage(
        "Great question! Let me break down the concept. The key is understanding the underlying pattern and how it optimizes the solution. Think about how the data structure helps us avoid redundant work.",
        'teaching'
      );
    } else if (lowerInput.includes('ready') || lowerInput.includes('got it') || lowerInput.includes('understand')) {
      await addCoachMessage(
        "Awesome! I love that confidence. Show me what you've got - start coding and I'll watch your back!",
        'celebrating'
      );
    } else if (lowerInput.includes('next') || lowerInput.includes('another')) {
      await addCoachMessage(
        "You're crushing it! Ready for the next challenge? Let's level up!",
        'encouraging'
      );
    } else {
      // Generic encouraging response
      await addCoachMessage(
        "I hear you! Let's work through this together. What specific part are you thinking about?",
        'encouraging'
      );
    }
  };
  
  const toggleListening = async () => {
    if (!voiceInput.current) {
      alert('Voice input not supported in your browser');
      return;
    }
    
    if (isListening) {
      // Stop listening
      voiceInput.current.stop();
      setIsListening(false);
      setLiveTranscript('');
    } else {
      // Start listening
      try {
        await voiceInput.current.start((transcript, isFinal) => {
          if (isFinal) {
            // Final transcript - add as user message
            addUserMessage(transcript);
            setLiveTranscript('');
          } else {
            // Interim transcript - show live
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
  };
  
  const handleQuickAction = async (action: 'hint' | 'explain' | 'celebrate') => {
    switch (action) {
      case 'hint':
        await addCoachMessage(
          "Here's a strategic hint: Look at the constraints and ask yourself - what pattern can help me meet these constraints efficiently?",
          'gentle_nudge'
        );
        break;
      case 'explain':
        await addCoachMessage(
          "Let me teach you the pattern. Think of it like this: we're optimizing by reducing unnecessary work through smart use of data structures.",
          'teaching'
        );
        break;
      case 'celebrate':
        await addCoachMessage(
          "Outstanding! You've really nailed the core concept. That's exactly how pros approach these problems!",
          'celebrating'
        );
        break;
    }
  };
  
  const getStateColor = () => {
    switch (userState) {
      case 'coding': return 'text-green-500';
      case 'stuck': return 'text-red-500';
      case 'thinking': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };
  
  const getStateDot = () => {
    const baseClasses = "w-2 h-2 rounded-full animate-pulse";
    switch (userState) {
      case 'coding': return `${baseClasses} bg-green-500`;
      case 'stuck': return `${baseClasses} bg-red-500`;
      case 'thinking': return `${baseClasses} bg-yellow-500`;
      default: return `${baseClasses} bg-gray-400`;
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
            <p className="text-sm text-gray-400">Voice-Enabled AI Coach</p>
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
          <div className="flex items-center gap-2">
            <div className={getStateDot()}></div>
            <span className={`text-sm ${getStateColor()}`}>
              {userState.charAt(0).toUpperCase() + userState.slice(1)}
            </span>
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
                : 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 mr-8 border-l-4 border-blue-500'
            } animate-slide-in`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-300">
                {message.type === 'user' ? 'You' : 'Coach Alex'}
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
          disabled={isSpeaking}
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
              <span className="font-semibold">Press to Speak</span>
            </>
          )}
        </button>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => handleQuickAction('hint')}
            disabled={isSpeaking || isListening}
            className="py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Lightbulb className="w-3 h-3" />
            Hint
          </button>
          <button
            onClick={() => handleQuickAction('explain')}
            disabled={isSpeaking || isListening}
            className="py-2 px-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <MessageCircle className="w-3 h-3" />
            Explain
          </button>
          <button
            onClick={() => handleQuickAction('celebrate')}
            disabled={isSpeaking || isListening}
            className="py-2 px-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Trophy className="w-3 h-3" />
            Got It
          </button>
        </div>
        
        {/* Voice Tips */}
        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">💡 Voice Tips:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Say "give me a hint" for help</li>
            <li>• Say "explain this" for concepts</li>
            <li>• Say "I got it" when ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

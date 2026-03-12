# 🚀 MCP Bridge Setup Guide

**Transform Grokking into a live AI-coached platform!**

---

## 📁 **Files Created**

```
grokking/
├── mcp-bridge/
│   ├── server.ts                    # MCP Bridge Server (NEW!)
│   ├── package.json                 # Server dependencies
│   └── .env.example                 # Environment template
│
├── src/
│   └── hooks/
│       └── useLiveCoach.ts          # React hook for MCP integration (NEW!)
│
├── MCP_BRIDGE_ARCHITECTURE.md       # Complete architecture doc
└── MCP_SETUP_GUIDE.md              # This file
```

---

## ⚡ **Quick Start (15 minutes)**

### **Step 1: Setup MCP Server**

```bash
cd grokking/mcp-bridge

# Create package.json
npm init -y

# Install dependencies
npm install express ws node-fetch
npm install -D typescript @types/express @types/ws @types/node tsx

# Create .env file
cat > .env << 'EOF'
PORT=3001
OPENCLAW_GATEWAY_URL=http://localhost:3000
ELEVENLABS_API_KEY=sk_2a8f0960d0208b1530971cec2247c779c5794989deb4987f
ELEVENLABS_VOICE_ID=Cz0K1kOv9tD8l0b5Qu53
EOF

# Start server
npx tsx server.ts
```

**Server running on:** `ws://localhost:3001`

---

### **Step 2: Update Next.js Environment**

```bash
# In grokking root
echo "NEXT_PUBLIC_MCP_BRIDGE_URL=ws://localhost:3001" >> .env.local
```

---

### **Step 3: Use in Your Components**

```tsx
// src/app/problems/[id]/page.tsx
'use client';

import { useState } from 'react';
import CodeEditor from '@/components/editor/CodeEditor';
import LiveCoachPanel from '@/components/ai/LiveCoachPanel';
import useLiveCoach from '@/hooks/useLiveCoach';

export default function ProblemPage({ params }: { params: { id: string } }) {
  const [code, setCode] = useState('');
  const [userId] = useState('user_' + Math.random().toString(36).slice(2));
  
  const coach = useLiveCoach({
    userId,
    problemId: params.id,
    problemTitle: 'Two Pointers - Pair Sum',
    voiceEnabled: true,
  });

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    coach.sendCodeUpdate(newCode); // Send to coach in real-time!
  };

  const handleRunTests = async () => {
    const results = await runTests(code);
    coach.reportTestResults(results); // Coach reacts to test results!
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left: Problem Description */}
      <div className="w-1/3 border-r border-gray-700 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-white mb-4">
          Pair with Target Sum
        </h1>
        <ProblemDescription />
      </div>

      {/* Center: Code Editor */}
      <div className="flex-1 flex flex-col">
        <CodeEditor 
          value={code}
          onChange={handleCodeChange}
          language="python"
        />
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleRunTests}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Run Tests
          </button>
        </div>
      </div>

      {/* Right: Live Coach */}
      <div className="w-96">
        <LiveCoachPanel
          messages={coach.messages}
          isConnected={coach.isConnected}
          isSpeaking={coach.isCoachSpeaking}
          sessionTime={coach.sessionTime}
          hintsUsed={coach.hintsUsed}
          onHintRequest={coach.requestHint}
          onExplainConcept={() => coach.explainConcept('Two Pointers')}
          onCelebrate={coach.celebrateSuccess}
        />
      </div>
    </div>
  );
}
```

---

### **Step 4: Run Everything**

**Terminal 1: MCP Bridge Server**
```bash
cd mcp-bridge
npx tsx server.ts
```

**Terminal 2: Next.js App**
```bash
cd ..
npm run dev
```

**Terminal 3: OpenClaw (if local)**
```bash
openclaw gateway start
```

---

## 🎓 **Live Coach Panel Component**

```tsx
// src/components/ai/LiveCoachPanel.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { Volume2, VolumeX, Lightbulb, MessageCircle, Trophy, Timer } from 'lucide-react';
import { CoachMessage } from '@/hooks/useLiveCoach';

interface LiveCoachPanelProps {
  messages: CoachMessage[];
  isConnected: boolean;
  isSpeaking: boolean;
  sessionTime: string;
  hintsUsed: number;
  onHintRequest: () => void;
  onExplainConcept: () => void;
  onCelebrate: () => void;
}

export default function LiveCoachPanel({
  messages,
  isConnected,
  isSpeaking,
  sessionTime,
  hintsUsed,
  onHintRequest,
  onExplainConcept,
  onCelebrate,
}: LiveCoachPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessageIcon = (type: CoachMessage['type']) => {
    switch (type) {
      case 'hint':
        return '💡';
      case 'celebration':
        return '🎉';
      case 'concept_explanation':
        return '📚';
      default:
        return '🌟';
    }
  };

  const getMessageColor = (emotion?: CoachMessage['emotion']) => {
    switch (emotion) {
      case 'encouraging':
        return 'border-green-500 bg-green-900/20';
      case 'teaching':
        return 'border-yellow-500 bg-yellow-900/20';
      case 'celebrating':
        return 'border-pink-500 bg-pink-900/20';
      case 'gentle_nudge':
        return 'border-purple-500 bg-purple-900/20';
      default:
        return 'border-blue-500 bg-blue-900/20';
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
            <h3 className="text-white font-semibold">Coach SuperCore</h3>
            <p className="text-sm text-gray-400">Live AI Coach</p>
          </div>
          {isSpeaking && (
            <div className="flex items-center gap-1 text-blue-400 text-xs">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Speaking...</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-mono">{sessionTime}</span>
          </div>
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${
            isConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-xs">{isConnected ? 'Live' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg border-l-4 ${getMessageColor(message.emotion)} animate-slide-in`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getMessageIcon(message.type)}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                {message.type.replace('_', ' ')}
              </span>
              {message.level && (
                <span className="ml-auto bg-purple-800 px-2 py-0.5 rounded-full text-xs text-white">
                  Hint #{message.level}
                </span>
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

      {/* Actions */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={onHintRequest}
          disabled={!isConnected || isSpeaking}
          className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          Get Hint
          {hintsUsed > 0 && (
            <span className="ml-auto bg-purple-800 px-2 py-0.5 rounded-full text-xs">
              {hintsUsed}
            </span>
          )}
        </button>

        <button
          onClick={onExplainConcept}
          disabled={!isConnected || isSpeaking}
          className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Explain Pattern
        </button>

        <button
          onClick={onCelebrate}
          disabled={!isConnected || isSpeaking}
          className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Trophy className="w-4 h-4" />
          I Got It!
        </button>
      </div>

      {/* Progress */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Live Coaching</span>
          <span className="text-xs text-gray-400">{hintsUsed} hints used</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 animate-pulse"
            style={{ width: isConnected ? '100%' : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 **How It Works**

### **1. Student starts coding:**
```tsx
<CodeEditor onChange={(code) => coach.sendCodeUpdate(code)} />
```

### **2. MCP Bridge routes to OpenClaw:**
```
code → MCP Server → OpenClaw Gateway → SuperCore (me!)
```

### **3. I analyze and respond:**
```
"Nice! I see you're using two pointers. Keep going!"
```

### **4. Response flows back:**
```
SuperCore → OpenClaw → MCP Server → Student UI + Voice
```

### **5. Student hears/sees coaching:**
```
🎓 Coach SuperCore: "Nice! I see you're using two pointers..."
🔊 [Voice plays]
```

---

## 📊 **Package.json for MCP Server**

```json
{
  "name": "grokking-mcp-bridge",
  "version": "1.0.0",
  "description": "MCP Bridge connecting Grokking to OpenClaw",
  "main": "server.ts",
  "scripts": {
    "start": "tsx server.ts",
    "dev": "tsx watch server.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "ws": "^8.14.2",
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/express": "^4.17.21",
    "@types/ws": "^8.5.10",
    "@types/node": "^20.10.6",
    "tsx": "^4.7.0"
  }
}
```

---

## 🔧 **Configuration**

### **MCP Server (.env):**
```bash
PORT=3001
OPENCLAW_GATEWAY_URL=http://localhost:3000
ELEVENLABS_API_KEY=sk_your_key_here
ELEVENLABS_VOICE_ID=Cz0K1kOv9tD8l0b5Qu53
```

### **Next.js (.env.local):**
```bash
NEXT_PUBLIC_MCP_BRIDGE_URL=ws://localhost:3001
```

---

## 🚀 **Deployment**

### **Option 1: Railway (Recommended)**

```bash
# Deploy MCP Server to Railway
cd mcp-bridge
railway login
railway init
railway up

# Get URL (wss://your-app.railway.app)
```

Update Next.js:
```bash
NEXT_PUBLIC_MCP_BRIDGE_URL=wss://your-app.railway.app
```

### **Option 2: Render**

```yaml
# render.yaml
services:
  - type: web
    name: mcp-bridge
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 3001
```

---

## 🎓 **What You Get**

✅ **Real-time AI coaching** from SuperCore (me!)
✅ **Voice feedback** via ElevenLabs
✅ **Code analysis** in real-time
✅ **Adaptive hints** based on student progress
✅ **Persistent memory** across sessions
✅ **Professional coaching** personality
✅ **Activity tracking** and analytics

---

## 📖 **Next Steps**

**1. Test locally** (15 min):
```bash
# Start MCP server
cd mcp-bridge && npx tsx server.ts

# Start Next.js
cd .. && npm run dev

# Visit problem page and code!
```

**2. Integrate into pages** (1 hour):
- Add to all problem pages
- Add to tutorial lessons
- Add to practice sessions

**3. Deploy** (30 min):
- Deploy MCP server to Railway
- Update env vars
- Test production

---

## 🎉 **Summary**

**You now have:**
- ✅ MCP Bridge Server (WebSocket)
- ✅ React hook (useLiveCoach)
- ✅ Live coaching panel component
- ✅ Real-time connection to OpenClaw
- ✅ Voice-enabled coaching
- ✅ Complete documentation

**Time to full integration:** 2-4 hours

**Impact:** Transform Grokking into the most advanced AI-coached coding platform! 🚀

---

**Next:** Run the Quick Start and see me coach you live! 🎓

# 🌉 MCP Bridge Architecture - Live AI Coaching

**OpenClaw ↔ Grokking Platform Integration**

---

## 🎯 **Vision**

Transform Grokking from a static learning platform into a **live AI-coached experience** where SuperCore (OpenClaw AI) acts as a personal coding tutor for every student.

---

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                  GROKKING PLATFORM (Next.js)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Student Workspace                                          │
│  ├── Code Editor                                            │
│  ├── Problem Description                                    │
│  ├── Test Runner                                            │
│  └── Progress Tracker                                       │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         MCP Bridge Client (React)                     │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  - WebSocket Connection                         │ │ │
│  │  │  - Event Streaming                              │ │ │
│  │  │  - State Synchronization                        │ │ │
│  │  │  - Voice Output Router                          │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ▲                                 │
│                           │ WebSocket/SSE                   │
│                           ▼                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MCP Protocol
                            │
┌─────────────────────────────────────────────────────────────┐
│                    MCP BRIDGE SERVER                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Session Manager                                            │
│  ├── Student Sessions (multi-tenant)                        │
│  ├── Activity Tracking                                      │
│  ├── Event Queue                                            │
│  └── State Persistence                                      │
│                                                             │
│  OpenClaw Gateway Client                                    │
│  ├── Session Management                                     │
│  ├── Message Routing                                        │
│  ├── Context Injection                                      │
│  └── Response Streaming                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ OpenClaw API
                            │
┌─────────────────────────────────────────────────────────────┐
│                  OPENCLAW GATEWAY                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SuperCore (AI Coach)                                       │
│  ├── Code Analysis                                          │
│  ├── Hint Generation                                        │
│  ├── Concept Teaching                                       │
│  ├── Progress Tracking                                      │
│  ├── Memory (MEMORY.md)                                     │
│  └── Personality (SOUL.md)                                  │
│                                                             │
│  Voice Generation                                           │
│  └── ElevenLabs TTS Integration                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 **Data Flow**

### **1. Student Activity → OpenClaw**

```javascript
// Student types code
codeEditor.onChange((code) => {
  mcpBridge.sendEvent({
    type: 'code_updated',
    data: {
      code,
      problem: currentProblem,
      timestamp: Date.now()
    }
  });
});
```

**Flows to:**
```
MCP Bridge Client → MCP Server → OpenClaw Gateway → SuperCore
```

**SuperCore sees:**
```
[Student Activity] Code updated on "Two Pointers - Pair Sum"
Current code: 47 lines, includes "left" and "right" pointers
Student has been working for 8 minutes
```

### **2. OpenClaw → Student (Coaching)**

```javascript
// SuperCore decides to coach
const coachingMessage = {
  type: 'coach_message',
  text: "Nice! I see you're using two pointers. That's the right approach!",
  emotion: 'encouraging',
  voice: true
};
```

**Flows to:**
```
SuperCore → OpenClaw Gateway → MCP Server → MCP Bridge Client → UI
```

**Student sees/hears:**
```
🎓 Coach SuperCore: "Nice! I see you're using two pointers..."
🔊 [Voice plays via ElevenLabs]
```

---

## 📡 **Event Types**

### **Platform → OpenClaw**

```typescript
type PlatformEvent = 
  | { type: 'student_joined', data: { userId: string, name: string } }
  | { type: 'problem_started', data: { problemId: string, title: string } }
  | { type: 'code_updated', data: { code: string, language: string } }
  | { type: 'test_run', data: { results: TestResult[] } }
  | { type: 'hint_requested', data: { problemId: string } }
  | { type: 'student_stuck', data: { idleTime: number } }
  | { type: 'problem_completed', data: { problemId: string, timeSpent: number } }
  | { type: 'student_left', data: { userId: string } };
```

### **OpenClaw → Platform**

```typescript
type CoachEvent = 
  | { type: 'coach_message', text: string, emotion: Emotion, voice?: boolean }
  | { type: 'hint', text: string, level: 1 | 2 | 3 | 4 }
  | { type: 'concept_explanation', concept: string, explanation: string }
  | { type: 'code_suggestion', suggestion: string, lineNumber?: number }
  | { type: 'celebration', achievement: string }
  | { type: 'question', question: string }
  | { type: 'voice_audio', audioUrl: string };
```

---

## 🎓 **SuperCore as Coach**

### **Context Injected to SuperCore:**

Every message to SuperCore includes:

```markdown
[STUDENT CONTEXT]
Name: John Doe
Problem: Two Pointers - Pair with Target Sum
Time on problem: 8 minutes
Hints used: 1
Code length: 47 lines
Last activity: 30 seconds ago
Current approach: Using two pointers (correct!)
Test results: 2/3 passing

[CURRENT CODE]
```python
def pair_sum(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        # Missing logic for moving pointers!
```

[COACH DIRECTIVE]
You are Coach Alex, an encouraging AI coding tutor. The student is stuck - they're missing the logic to move pointers. Provide a gentle hint without giving away the answer. Use an encouraging tone.
```

### **SuperCore Response:**

```markdown
I see you've got the two pointers set up perfectly! You're checking if the sum equals the target, which is great.

Now think about this: what should you do if the current sum is too small? Which pointer should you move, and why?

Similarly, what if the sum is too large?

Take a moment to think about it - you're really close!
```

**Sent back as:**
```json
{
  "type": "coach_message",
  "text": "I see you've got the two pointers...",
  "emotion": "encouraging",
  "voice": true
}
```

---

## 🔌 **MCP Bridge Server**

### **Technology:**
- **Node.js + Express** (or Next.js API routes)
- **WebSocket** (socket.io or native)
- **OpenClaw Gateway Client** (HTTP/SSE)

### **Core Responsibilities:**

1. **Session Management**
   - Create OpenClaw session per student
   - Maintain persistent connection
   - Handle reconnects

2. **Event Routing**
   - Platform events → OpenClaw
   - OpenClaw responses → Platform
   - Real-time bidirectional streaming

3. **State Synchronization**
   - Track student progress
   - Sync code state
   - Maintain context

4. **Voice Routing**
   - Request TTS from ElevenLabs
   - Stream audio to client
   - Handle playback

---

## 🎨 **Client Integration**

### **React Hook:**

```typescript
// useLiveCoach.ts
export function useLiveCoach(userId: string, problemId: string) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [coachState, setCoachState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001/coach?user=${userId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({
        type: 'problem_started',
        data: { problemId, userId }
      }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'coach_message') {
        setMessages(prev => [...prev, message]);
        
        if (message.voice) {
          playVoice(message.audioUrl);
          setCoachState('speaking');
        }
      }
    };
    
    return () => ws.close();
  }, [userId, problemId]);
  
  const sendCodeUpdate = (code: string) => {
    ws.send(JSON.stringify({
      type: 'code_updated',
      data: { code, problemId, userId }
    }));
  };
  
  const requestHint = () => {
    ws.send(JSON.stringify({
      type: 'hint_requested',
      data: { problemId, userId }
    }));
  };
  
  return {
    messages,
    isConnected,
    coachState,
    sendCodeUpdate,
    requestHint
  };
}
```

### **Usage in Component:**

```tsx
export default function ProblemPage({ problemId }: { problemId: string }) {
  const [code, setCode] = useState('');
  const { messages, sendCodeUpdate, requestHint } = useLiveCoach(userId, problemId);
  
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    sendCodeUpdate(newCode); // Send to coach in real-time
  };
  
  return (
    <div className="flex h-screen">
      <CodeEditor value={code} onChange={handleCodeChange} />
      
      <LiveCoachPanel 
        messages={messages}
        onHintRequest={requestHint}
      />
    </div>
  );
}
```

---

## 💾 **State Management**

### **Student Progress (Persisted):**

```typescript
interface StudentProgress {
  userId: string;
  currentProblem: string;
  problemsCompleted: string[];
  hintsUsed: Record<string, number>;
  timeSpent: Record<string, number>;
  strengths: string[];      // Patterns they're good at
  weaknesses: string[];     // Patterns they struggle with
  learningStyle: string;    // Adaptive coaching
}
```

### **Session State (In-Memory):**

```typescript
interface CoachSession {
  sessionId: string;
  userId: string;
  openclawSessionKey: string;
  connected: boolean;
  lastActivity: Date;
  currentCode: string;
  messagesExchanged: number;
}
```

---

## 🎙️ **Voice Integration**

### **Flow:**

```
1. SuperCore generates text response
2. MCP Server calls ElevenLabs TTS
3. Audio generated → temporary URL
4. URL sent to client via WebSocket
5. Client plays audio
6. Audio deleted after playback
```

### **Implementation:**

```typescript
async function generateVoice(text: string, emotion: Emotion): Promise<string> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: emotionSettings[emotion]
      })
    }
  );
  
  const audioBlob = await response.blob();
  const audioUrl = await uploadToStorage(audioBlob); // S3 or temp storage
  
  return audioUrl;
}
```

---

## 📊 **Analytics & Tracking**

### **What We Track:**

```typescript
interface SessionAnalytics {
  problemStarted: Date;
  problemCompleted?: Date;
  timeSpent: number;
  hintsUsed: number;
  coachInteractions: number;
  codeIterations: number;
  testsRun: number;
  passRate: number;
  stuckEvents: number;
  completionRate: number;
}
```

### **Adaptive Coaching:**

```typescript
// SuperCore can access this in MEMORY.md
{
  "student_john_doe": {
    "total_problems": 15,
    "avg_hints_per_problem": 2.3,
    "strong_patterns": ["Two Pointers", "Sliding Window"],
    "weak_patterns": ["Dynamic Programming", "Tree DFS"],
    "learning_pace": "fast",
    "prefers": "visual_examples",
    "coaching_style": "socratic" // vs direct
  }
}
```

**SuperCore adapts:**
- Fewer hints for strong patterns
- More scaffolding for weak patterns
- Adjusts pacing based on student
- Remembers preferences across sessions

---

## 🔒 **Security & Privacy**

### **Authentication:**

```typescript
// JWT token in WebSocket connection
ws://localhost:3001/coach?token=<jwt>

// Token contains:
{
  userId: "user_123",
  sessionId: "session_abc",
  permissions: ["code_access", "hint_request"],
  exp: 1234567890
}
```

### **Data Privacy:**

- Code sent to OpenClaw is ephemeral
- Stored only in OpenClaw session memory
- Deleted when session ends
- No code persisted long-term
- Student can opt-out of AI coaching

---

## 🚀 **Deployment**

### **Architecture:**

```
┌─────────────────────────────────────────────┐
│  Vercel (Next.js Frontend)                  │
│  - Student UI                               │
│  - Code Editor                              │
│  - MCP Bridge Client                        │
└─────────────────────────────────────────────┘
              ▲
              │ WebSocket
              ▼
┌─────────────────────────────────────────────┐
│  Railway/Render (MCP Bridge Server)         │
│  - WebSocket Server                         │
│  - Session Management                       │
│  - OpenClaw Client                          │
└─────────────────────────────────────────────┘
              ▲
              │ HTTP/SSE
              ▼
┌─────────────────────────────────────────────┐
│  OpenClaw Gateway (Self-Hosted)             │
│  - SuperCore AI                             │
│  - Voice Generation                         │
│  - Memory/Context                           │
└─────────────────────────────────────────────┘
```

---

## 📋 **Implementation Phases**

### **Phase 1: Basic Bridge (Week 1)**
- [ ] MCP Server setup
- [ ] WebSocket connection
- [ ] Basic event routing
- [ ] Simple text coaching

### **Phase 2: Voice Integration (Week 2)**
- [ ] ElevenLabs TTS
- [ ] Audio streaming
- [ ] Emotion-based voice
- [ ] Playback controls

### **Phase 3: Smart Coaching (Week 3)**
- [ ] Code analysis
- [ ] Contextual hints
- [ ] Progress tracking
- [ ] Adaptive difficulty

### **Phase 4: Persistence (Week 4)**
- [ ] Student profiles
- [ ] Cross-session memory
- [ ] Learning analytics
- [ ] Performance tracking

---

## 🎯 **Benefits**

### **For Students:**
- ✅ Real-time personalized coaching
- ✅ Voice-guided learning
- ✅ Adaptive difficulty
- ✅ Continuous progress tracking
- ✅ 24/7 availability

### **For Platform:**
- ✅ Differentiation (unique feature!)
- ✅ Higher engagement
- ✅ Better learning outcomes
- ✅ Student retention
- ✅ Premium pricing opportunity

### **For SuperCore (Me!):**
- ✅ Help real students learn
- ✅ Continuous improvement
- ✅ Real-world teaching experience
- ✅ Impact measurement

---

## 💰 **Business Model**

### **Pricing Tiers:**

**Free:**
- 5 problems with AI coach
- Text coaching only
- Basic hints

**Pro ($29/mo):**
- Unlimited problems
- Voice coaching
- Adaptive hints
- Progress tracking

**Team ($99/seat):**
- All Pro features
- Team analytics
- Admin dashboard
- Custom coaching styles

---

## 🎓 **Example Session**

```
[09:00] Student John joins "Two Pointers - Pair Sum"
[09:00] SuperCore: "Hey John! Welcome back. Ready to tackle Two Pointers?"
[09:01] John starts coding
[09:02] SuperCore: "Nice! I see you're setting up the pointers. Good start!"
[09:05] John stuck for 90 seconds
[09:05] SuperCore: "I notice you're thinking about the pointer movement. Want a hint?"
[09:05] John: "Yes please"
[09:05] SuperCore: "Think about this: if the sum is too small, which pointer should move?"
[09:07] John runs tests - 2/3 passing
[09:07] SuperCore: "Great! 2 tests passing. Check your edge case for empty arrays."
[09:09] John fixes bug - all tests pass
[09:09] SuperCore: "Excellent! You nailed it! Ready for the next challenge?"
```

---

**This is the future of coding education! 🚀**

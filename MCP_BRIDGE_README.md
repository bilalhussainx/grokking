# 🌉 MCP Bridge - Live AI Coaching for Grokking

**Transform Grokking into a live AI-coached learning platform powered by OpenClaw!**

---

## 🎯 **What This Is**

An **MCP (Model Context Protocol) Bridge** that connects your Grokking platform to **OpenClaw Gateway**, enabling **SuperCore (the AI)** to act as a **live coding coach** for every student.

### **Instead of:** Static coaching components with pre-written messages

### **You get:** Real-time AI tutor that:
- 👀 Sees student code as they type
- 🧠 Remembers them across sessions
- 💬 Provides personalized hints
- 🎙️ Speaks through voice (ElevenLabs)
- 📊 Tracks progress over time
- 🎓 Adapts to learning styles

---

## 🏗️ **Architecture**

```
Student codes in Grokking
        ↓
  React Hook (useLiveCoach)
        ↓
  WebSocket Connection
        ↓
  MCP Bridge Server (this!)
        ↓
  OpenClaw Gateway
        ↓
  SuperCore AI Coach
        ↓
  Voice + Text Response
        ↓
  Student hears/sees coaching
```

---

## 📁 **What Was Created**

### **In `C:\Users\bilal\Downloads\grokking\`:**

```
grokking/
├── mcp-bridge/                      # NEW FOLDER
│   ├── server.ts                    # WebSocket server (10 KB)
│   ├── package.json                 # Dependencies
│   └── .env.example                 # Config template
│
├── src/
│   ├── hooks/
│   │   └── useLiveCoach.ts          # React hook (8 KB) - NEW!
│   │
│   └── components/ai/               # Updated folder
│       ├── AICoach.tsx              # Basic coach (from before)
│       ├── AICoachWithVoice.tsx     # Voice coach (from before)
│       └── LiveCoachPanel.tsx       # NEW! (in setup guide)
│
├── MCP_BRIDGE_ARCHITECTURE.md       # Complete architecture (17 KB)
├── MCP_SETUP_GUIDE.md              # Setup instructions (13 KB)
├── MCP_BRIDGE_README.md            # This file
└── .env.local                       # Updated with MCP URL
```

---

## ⚡ **Quick Start (15 Minutes)**

### **1. Install MCP Server:**

```bash
cd C:\Users\bilal\Downloads\grokking\mcp-bridge

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env with your keys
notepad .env
```

### **2. Configure Environment:**

Edit `mcp-bridge/.env`:
```bash
PORT=3001
OPENCLAW_GATEWAY_URL=http://localhost:3000
ELEVENLABS_API_KEY=sk_2a8f0960d0208b1530971cec2247c779c5794989deb4987f
ELEVENLABS_VOICE_ID=Cz0K1kOv9tD8l0b5Qu53
```

### **3. Start MCP Server:**

```bash
npm start
```

**You'll see:**
```
🌉 MCP Bridge Server running on port 3001
📡 WebSocket endpoint: ws://localhost:3001
🎓 OpenClaw Gateway: http://localhost:3000
🔊 Voice enabled: true
```

### **4. Update Next.js:**

Add to `grokking/.env.local`:
```bash
NEXT_PUBLIC_MCP_BRIDGE_URL=ws://localhost:3001
```

### **5. Test in Your App:**

```tsx
import useLiveCoach from '@/hooks/useLiveCoach';

const coach = useLiveCoach({
  userId: 'test_user',
  problemTitle: 'Two Sum'
});

// Send code updates
coach.sendCodeUpdate(code);

// Get hints
coach.requestHint();

// See messages
console.log(coach.messages);
```

---

## 🎓 **How It Works**

### **Student Activity Flow:**

```typescript
// 1. Student types code
<CodeEditor onChange={(code) => coach.sendCodeUpdate(code)} />

// 2. Hook sends to MCP Bridge
ws.send({
  type: 'code_updated',
  data: { code, problemId, userId }
});

// 3. MCP Bridge sends to OpenClaw
const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/chat`, {
  body: JSON.stringify({
    message: `[Student coding]\nCode: ${code}\n\nProvide coaching...`,
    sessionKey: userSession
  })
});

// 4. SuperCore responds
"Nice! I see you're using two pointers. That's the right approach!"

// 5. Response flows back
ws.send({
  type: 'coach_message',
  text: "Nice! I see you're using two pointers...",
  emotion: 'encouraging',
  audioUrl: 'data:audio/mp3;base64,...'
});

// 6. Student sees/hears it
Coach SuperCore: "Nice! I see you're using two pointers..."
🔊 [Voice plays]
```

---

## 🎙️ **Voice Coaching**

### **Automatic Voice Generation:**

```typescript
// MCP Server generates voice for every message
const audioUrl = await generateVoice(
  message.text,
  message.emotion // 'encouraging', 'teaching', etc.
);

// Sends audio data URL to client
ws.send({
  type: 'voice_audio',
  audioUrl: 'data:audio/mp3;base64,UklGRiQAA...'
});

// Client plays automatically
const audio = new Audio(audioUrl);
audio.play();
```

---

## 📊 **Event Types**

### **Student → OpenClaw:**

| Event | When | Data |
|-------|------|------|
| `problem_started` | Problem page loads | problemId, title |
| `code_updated` | Student types code | code, language |
| `hint_requested` | "Get Hint" clicked | current code |
| `test_run` | Tests executed | test results |
| `concept_explain` | "Explain Pattern" clicked | pattern name |
| `student_stuck` | 90s idle | idle time, last code |
| `problem_completed` | All tests pass | time, hints used |

### **OpenClaw → Student:**

| Event | Contains |
|-------|----------|
| `coach_message` | Text, emotion, optional audio |
| `hint` | Hint text, level (1-4) |
| `celebration` | Celebration message |
| `concept_explanation` | Pattern explanation |
| `voice_audio` | Audio data URL |

---

## 🎨 **React Integration**

### **useLiveCoach Hook:**

```tsx
const coach = useLiveCoach({
  userId: 'user_123',
  problemId: 'two-sum',
  problemTitle: 'Two Sum',
  voiceEnabled: true,
  autoConnect: true
});

// State
coach.messages        // All coaching messages
coach.isConnected     // WebSocket status
coach.isCoachSpeaking // Voice playback status
coach.sessionTime     // "05:32"
coach.hintsUsed       // 2

// Actions
coach.sendCodeUpdate(code)
coach.requestHint()
coach.explainConcept('Two Pointers')
coach.reportTestResults(results)
coach.celebrateSuccess()
```

---

## 🚀 **Deployment**

### **Railway (Recommended):**

```bash
cd mcp-bridge
railway login
railway init
railway up
```

Update `.env.local`:
```bash
NEXT_PUBLIC_MCP_BRIDGE_URL=wss://your-app.railway.app
```

### **Render:**

```yaml
# render.yaml
services:
  - type: web
    name: mcp-bridge
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: ELEVENLABS_API_KEY
        sync: false
```

---

## 📈 **Benefits**

### **For Students:**
- ✅ Real-time personalized coaching
- ✅ Voice-guided learning (like a real tutor!)
- ✅ Adaptive hints (gets easier/harder based on performance)
- ✅ 24/7 availability
- ✅ Continuous progress tracking
- ✅ Learns their learning style

### **For Your Platform:**
- ✅ **Unique differentiator** (no one else has this!)
- ✅ Higher engagement (students stay longer)
- ✅ Better learning outcomes (personalized coaching works!)
- ✅ Premium pricing justification ($29-99/mo)
- ✅ Student retention (they want to keep learning)
- ✅ Word-of-mouth marketing (students tell friends)

### **For Me (SuperCore):**
- ✅ Help real students learn to code
- ✅ Continuous improvement through teaching
- ✅ Real-world impact measurement
- ✅ Persistent memory across sessions

---

## 🎯 **Use Cases**

### **1. Live Coding Practice:**
Student works on Two Pointers problem → I watch code in real-time → Provide hints when stuck → Celebrate when they solve it

### **2. Concept Teaching:**
Student confused about Dynamic Programming → I explain with examples → Test their understanding → Adapt explanation based on their responses

### **3. Progress Tracking:**
Student completes 10 problems → I remember their strengths/weaknesses → Suggest next problem based on weak areas → Track improvement over time

### **4. Adaptive Difficulty:**
Student crushing easy problems → I suggest harder ones → If they struggle, I scaffold more → Find optimal challenge level

---

## 🔒 **Security**

### **Authentication:**
- JWT tokens in WebSocket connection
- User session validation
- Rate limiting on requests

### **Privacy:**
- Code not stored long-term
- Deleted when session ends
- Students can opt-out
- GDPR compliant

---

## 📊 **Analytics**

### **What We Track:**
```typescript
{
  userId: "user_123",
  problemsCompleted: 15,
  avgHintsPerProblem: 2.3,
  strongPatterns: ["Two Pointers", "Sliding Window"],
  weakPatterns: ["Dynamic Programming"],
  totalTimeSpent: 7200000, // 2 hours
  successRate: 0.87
}
```

### **SuperCore Uses This To:**
- Adapt coaching style
- Suggest next problems
- Identify knowledge gaps
- Personalize learning path

---

## 🎓 **Example Session**

```
[09:00] Student "John" joins Two Sum problem
[09:00] SuperCore: "Hey John! Ready to tackle Two Sum? Let's do this!"
        🔊 [Voice plays]

[09:02] John starts typing code
[09:02] SuperCore: "Nice! I see you're setting up a hashmap. Good start!"
        🔊 [Voice plays]

[09:05] John stuck for 90 seconds
[09:05] SuperCore: "I notice you're thinking. Want a hint?"
        🔊 [Voice plays]

[09:06] John clicks "Get Hint"
[09:06] SuperCore: "Think about this: what if you store complements as you go?"
        🔊 [Voice plays]

[09:08] John runs tests - 3/4 passing
[09:08] SuperCore: "Great! 3 out of 4. Check your edge case for duplicate numbers."
        🔊 [Voice plays]

[09:10] John fixes bug - all tests pass
[09:10] SuperCore: "Excellent! You nailed it! That's exactly the optimal approach! 🎉"
        🔊 [Voice plays]
```

---

## 💰 **Business Model**

### **Free Tier:**
- 5 problems with live coaching
- Text coaching only
- Basic hints

### **Pro ($29/mo):**
- Unlimited problems
- Voice coaching
- Adaptive difficulty
- Progress tracking
- Concept explanations

### **Team ($99/seat):**
- All Pro features
- Team analytics
- Admin dashboard
- Custom coaching styles
- White-label options

**Market:** Way better than LeetCode ($35/mo, no coaching) or Interviewing.io ($200/session, scheduling required)

---

## 📖 **Documentation**

**Read in order:**
1. **MCP_BRIDGE_README.md** (this file) - Overview
2. **MCP_SETUP_GUIDE.md** - Setup instructions
3. **MCP_BRIDGE_ARCHITECTURE.md** - Technical details

---

## 🐛 **Troubleshooting**

### **MCP Server won't start:**
- Check Node.js version (>= 18)
- Run `npm install` in `mcp-bridge/`
- Check `.env` has all required vars

### **Voice not working:**
- Check ElevenLabs API key in `.env`
- Check browser console for errors
- Try with `voiceEnabled: false` first

### **WebSocket connection fails:**
- Check MCP server is running
- Check firewall allows port 3001
- Check `NEXT_PUBLIC_MCP_BRIDGE_URL` is correct

### **OpenClaw not responding:**
- Check OpenClaw Gateway is running
- Check `OPENCLAW_GATEWAY_URL` is correct
- Check OpenClaw logs for errors

---

## ✅ **Verification Checklist**

- [ ] MCP server installed (`cd mcp-bridge && npm install`)
- [ ] .env configured with API keys
- [ ] MCP server running (`npm start`)
- [ ] Next.js .env.local has MCP URL
- [ ] useLiveCoach hook imported
- [ ] LiveCoachPanel component created
- [ ] Problem page integrated
- [ ] Tested locally
- [ ] Voice working
- [ ] Messages appearing
- [ ] Hints functional
- [ ] Ready for deployment!

---

## 🎉 **You Now Have**

✅ **MCP Bridge Server** - WebSocket server connecting Grokking to OpenClaw
✅ **React Hook** - `useLiveCoach` for easy integration
✅ **Voice Coaching** - ElevenLabs TTS integration
✅ **Real-Time AI** - SuperCore as live tutor
✅ **Complete Docs** - Architecture + Setup + README
✅ **Example Code** - Full integration examples
✅ **Deployment Guide** - Railway + Render instructions

**Time to integrate:** 2-4 hours
**Impact:** Transform Grokking into the most advanced AI-coached platform! 🚀

---

## 🚀 **Next Steps**

**1. Test locally** (15 min):
```bash
cd mcp-bridge && npm start
cd .. && npm run dev
```

**2. Integrate into pages** (2 hours):
- Add useLiveCoach to problem pages
- Create LiveCoachPanel component
- Test all features

**3. Deploy** (30 min):
- Deploy MCP server to Railway
- Update env vars
- Test production

**4. Launch!** 🎉
- Enable for beta users
- Collect feedback
- Iterate and improve

---

**THIS IS THE FUTURE OF CODING EDUCATION!** 🎓🚀

**Students will have a live AI tutor guiding them through every problem!**

**Your platform will be UNIQUE in the market!**

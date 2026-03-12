# 🤖 OpenClaw Voice Coach - Complete Integration

**SuperCore AI Voice Coach embedded directly in your Grokking learning platform!**

---

## 🎯 What You Get

### ✅ Real AI Coaching
- **SuperCore AI** (OpenClaw) provides actual intelligent responses
- Context-aware coaching based on your code and progress
- Adaptive hints that match your learning level

### ✅ Full Voice Interaction
- **You speak** → Coach listens (Speech-to-Text)
- **Coach responds** → You hear (Text-to-Speech with emotion)
- Natural conversation flow
- Hands-free coding practice

### ✅ Embedded in Website
- Runs **inside localhost:3000** (your Grokking site)
- No separate windows or apps
- Seamless integration with code editor
- Real-time connection to OpenClaw Gateway

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  Grokking Website (localhost:3000)     │
│  ┌───────────────────────────────────┐ │
│  │  Code Editor  │  AI Voice Coach  │ │ 
│  └───────────────────────────────────┘ │
└───────────────┬─────────────────────────┘
                │ WebSocket
                ↓
┌─────────────────────────────────────────┐
│  MCP Bridge Server (localhost:3001)     │
│  - Routes events to OpenClaw            │
│  - Generates voice with ElevenLabs      │
│  - Manages student sessions             │
└───────────────┬─────────────────────────┘
                │ HTTP/Sessions API
                ↓
┌─────────────────────────────────────────┐
│  OpenClaw Gateway (background)          │
│  - Manages AI sessions                  │
│  - Routes to SuperCore AI               │
│  - Handles memory & context             │
└───────────────┬─────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────┐
│  SuperCore AI (me!)                     │
│  - Generates coaching responses         │
│  - Provides hints & explanations        │
│  - Adapts to student needs              │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Start (ONE COMMAND)

### Windows
```bash
cd C:\Users\bilal\Downloads\grokking
LAUNCH_OPENCLAW_COACH.bat
```

### Linux/Mac
```bash
cd ~/Downloads/grokking
./LAUNCH_OPENCLAW_COACH.sh
```

**That's it!** The launcher:
1. ✅ Starts OpenClaw Gateway (if needed)
2. ✅ Installs dependencies (first time)
3. ✅ Starts MCP Bridge (port 3001)
4. ✅ Starts Grokking Website (port 3000)
5. ✅ Opens test page in browser

**Test page**: http://localhost:3000/test-openclaw

---

## 🎤 Test Voice Interaction (30 Seconds)

1. **Open test page** (launcher does this automatically)
2. **Check connection**: Right panel shows 🟢 "Connected to OpenClaw"
3. **Click BIG BLUE MIC button**
4. **Allow microphone** when prompted
5. **Say clearly**: "Give me a hint for this problem"
6. **Watch**:
   - Live transcript appears
   - SuperCore AI thinks...
   - Coach responds with text AND voice
   - Message marked with 🔊 icon

---

## 📂 What Was Built

### New Components
```
src/components/ai/
  └── AICoachOpenClaw.tsx       (15.8 KB) - OpenClaw-connected voice coach

src/app/test-openclaw/
  └── page.tsx                  (7.7 KB)  - Test page
```

### MCP Bridge Server
```
mcp-bridge/
  ├── server.ts                 (14.6 KB) - WebSocket server
  ├── package.json              - Dependencies
  ├── .env                      - Configuration
  └── tsconfig.json             - TypeScript config
```

### Launcher Scripts
```
LAUNCH_OPENCLAW_COACH.bat       (1.6 KB)  - Windows launcher
LAUNCH_OPENCLAW_COACH.sh        (1.6 KB)  - Linux/Mac launcher
```

### Documentation
```
OPENCLAW_SETUP_GUIDE.md         (10.5 KB) - Complete setup guide
OPENCLAW_VOICE_COACH_README.md  (this file) - Overview
```

---

## 🎯 Features

### Voice Input (Speech-to-Text)
- ✅ Press-to-talk button
- ✅ Live transcription (see words as you speak)
- ✅ Continuous listening mode
- ✅ Works in Chrome, Edge, Safari
- ✅ Whisper API fallback for Firefox

### Voice Output (Text-to-Speech)
- ✅ Natural voice (ElevenLabs)
- ✅ Emotion-based tones:
  - **Encouraging**: Warm, supportive
  - **Teaching**: Clear, instructive
  - **Celebrating**: Excited, upbeat
  - **Gentle Nudge**: Soft, helpful
- ✅ Toggle voice on/off
- ✅ Audio playback controls

### AI Coaching (SuperCore)
- ✅ Real-time context awareness
- ✅ Progressive hints (4 levels)
- ✅ Concept explanations
- ✅ Code review feedback
- ✅ Stuck detection & help
- ✅ Test result analysis
- ✅ Celebration of success

### OpenClaw Integration
- ✅ WebSocket connection
- ✅ Session management per student
- ✅ Message history tracking
- ✅ Automatic reconnection
- ✅ Health monitoring
- ✅ Connection status indicator

---

## 🔧 How It Works

### 1. Student Speaks
```
Student: "Give me a hint for Two Sum"
```

### 2. Voice → Text
```
Web Speech API (browser)
  ↓
Transcript: "Give me a hint for Two Sum"
```

### 3. Send to MCP Bridge
```
WebSocket message:
{
  type: "voice_message",
  data: { transcript: "Give me a hint for Two Sum" }
}
```

### 4. MCP Bridge → OpenClaw
```
POST /api/v1/sessions/send
{
  label: "coach-student-123",
  message: "[Context + Prompt]",
  agentId: "main"
}
```

### 5. SuperCore AI Generates Response
```
SuperCore thinks:
- Student wants hint
- Problem is Two Sum
- They haven't seen code yet
- Provide strategic nudge

Response: "Think about the pattern here. What data structure 
helps you find if you've seen a number before? Consider how 
you could check complements efficiently."
```

### 6. Response → Voice
```
ElevenLabs TTS API:
  Text → Audio (emotion: gentle_nudge)
  ↓
Base64 audio data
```

### 7. Play Audio in Browser
```
Coach speaks the response
Student hears it
Message marked with 🔊 icon
```

**Total time**: ~3-6 seconds end-to-end!

---

## 🎓 Use Cases

### Interview Practice
- Real-time coaching during mock interviews
- Natural conversation like with human interviewer
- Immediate feedback on approach

### Learning
- Ask questions while coding
- Get explanations of concepts
- Understand why solutions work

### Stuck Detection
- Coach notices when you're idle
- Offers help proactively
- Gentle nudges to keep momentum

### Progress Tracking
- Session time tracking
- Hints used counter
- Activity state monitoring

---

## 🌐 Browser Support

| Browser | Voice Input | Voice Output | Status |
|---------|-------------|--------------|--------|
| Chrome  | ✅ Web Speech API | ✅ ElevenLabs | **Best** |
| Edge    | ✅ Web Speech API | ✅ ElevenLabs | **Best** |
| Safari  | ✅ Web Speech API | ✅ ElevenLabs | Good |
| Firefox | ⚠️ Whisper API | ✅ ElevenLabs | Works* |

\* Firefox needs OpenAI API key for Whisper fallback

---

## 📊 API Usage & Costs

### ElevenLabs (Text-to-Speech)
- **Cost**: ~$0.30 per 1000 characters
- **Free tier**: 10,000 characters/month
- **Typical response**: 100-200 characters
- **Est. cost**: $0.03-$0.06 per coaching session

### Web Speech API (Speech-to-Text)
- **Cost**: FREE (browser built-in)
- **No API key needed**
- **Works in Chrome, Edge, Safari**

### OpenAI Whisper (STT Fallback)
- **Cost**: $0.006 per minute
- **Only for Firefox users**
- **Optional** (not required for most users)

### OpenClaw Gateway
- **Cost**: FREE (self-hosted)
- **Runs locally** on your machine

---

## 🛡️ Security & Privacy

### Local Development
- ✅ All traffic on localhost
- ✅ No external data storage
- ✅ Voice processed in real-time (not saved)
- ✅ No recording or logging of audio

### Production Considerations
- 🔒 Use HTTPS/WSS (secure WebSocket)
- 🔒 Add authentication to MCP bridge
- 🔒 Restrict CORS to your domain
- 🔒 Rate limit API calls
- 🔒 Monitor costs

---

## 🔍 Debugging

### Check Services Status

**1. OpenClaw Gateway**
```bash
openclaw status
# Should show: ✓ Gateway running
```

**2. MCP Bridge**
```bash
curl http://localhost:3001/health
# Should return JSON with status: ok
```

**3. Grokking Website**
```
Open: http://localhost:3000
# Should load homepage
```

### Common Issues

**"Disconnected" in coach panel**
- MCP bridge not running → Start it: `cd mcp-bridge && npm start`

**"Microphone access denied"**
- Click 🔒 in address bar → Allow microphone → Refresh

**Coach responds but no voice**
- Check voice toggle is ON (blue)
- Verify system volume not muted
- Check ElevenLabs API key in `.env`

**No AI responses**
- OpenClaw Gateway not running → `openclaw gateway start`
- Check logs: `openclaw logs`

---

## 📖 Documentation Guide

| Document | Purpose |
|----------|---------|
| **OPENCLAW_VOICE_COACH_README.md** | You are here! Overview & architecture |
| **OPENCLAW_SETUP_GUIDE.md** | Complete setup instructions & troubleshooting |
| **VOICE_COMPLETE_SUMMARY.md** | Voice features summary (client-side only) |
| **VOICE_FEATURES.md** | Voice feature documentation |
| **VOICE_TESTING_GUIDE.md** | Testing procedures |

**Start here** → Read OPENCLAW_SETUP_GUIDE.md for setup

---

## 🎨 Integration Examples

### Basic Integration
```tsx
import AICoachOpenClaw from '@/components/ai/AICoachOpenClaw';

export default function ProblemPage() {
  const [code, setCode] = useState('');

  return (
    <div className="flex h-screen">
      <CodeEditor value={code} onChange={setCode} />
      
      <AICoachOpenClaw
        currentProblem="Two Sum"
        userCode={code}
        userId="student-123"
        enableVoice={true}
      />
    </div>
  );
}
```

### With Custom Bridge URL
```tsx
<AICoachOpenClaw
  currentProblem={problem.title}
  userCode={code}
  userId={user.id}
  enableVoice={preferences.voiceEnabled}
  bridgeUrl={process.env.NEXT_PUBLIC_MCP_BRIDGE_URL}
/>
```

### Production Example
```tsx
const bridgeUrl = process.env.NODE_ENV === 'production'
  ? 'wss://mcp-bridge.yourdomain.com'
  : 'ws://localhost:3001';

<AICoachOpenClaw bridgeUrl={bridgeUrl} {...props} />
```

---

## 🚀 Deployment

### Deploy MCP Bridge

**Heroku**:
```bash
cd mcp-bridge
heroku create your-mcp-bridge
heroku config:set OPENCLAW_GATEWAY_URL=https://your-gateway.com
git push heroku main
```

**DigitalOcean/AWS**:
- Deploy as Node.js app
- Ensure WebSocket support
- Use PM2 for process management

### Update Frontend
```tsx
// In production config
const MCP_BRIDGE_URL = 'wss://your-mcp-bridge.herokuapp.com';
```

---

## 📈 Roadmap

### V2 Features (Potential)
- [ ] Multi-language support (Spanish, Chinese, etc.)
- [ ] Custom wake word ("Hey Coach")
- [ ] Voice speed control
- [ ] Code review via voice commands
- [ ] Group study sessions
- [ ] Interrupt detection
- [ ] Context-aware hints based on code analysis
- [ ] Analytics dashboard
- [ ] A/B testing voice vs text

---

## ✅ Success Criteria

You know it's working when:

- ✅ Test page loads at `/test-openclaw`
- ✅ Coach shows 🟢 "Connected to OpenClaw"
- ✅ Mic button changes to red when listening
- ✅ Live transcript appears while speaking
- ✅ Coach responds to voice commands
- ✅ Voice playback works
- ✅ Messages show 🔊 icon

---

## 🎉 What Makes This Special

### vs. Other Platforms

**Grokking + OpenClaw**:
- ✅ Real AI (SuperCore) coaching
- ✅ Full voice interaction (both ways)
- ✅ Context-aware responses
- ✅ Embedded in website
- ✅ Natural conversation

**Other platforms**:
- ❌ Pre-recorded hints
- ❌ Text-only interaction
- ❌ Generic responses
- ❌ Separate chat window
- ❌ Scripted Q&A

---

## 🤝 Support

**Issues?**
1. Check OPENCLAW_SETUP_GUIDE.md troubleshooting section
2. Verify all services running: `openclaw status`
3. Check health: `curl http://localhost:3001/health`
4. Review logs: `openclaw logs`

**Questions?**
- OpenClaw Docs: https://docs.openclaw.ai
- Discord: https://discord.com/invite/clawd

---

## 🎓 Educational Impact

This integration enables:

### Realistic Interview Simulation
- Voice interaction mimics real interviews
- Natural conversation flow
- Immediate feedback

### Enhanced Learning
- Think out loud (metacognition)
- Verbal explanations reinforce understanding
- Less intimidating than text

### Accessibility
- Helps students who struggle typing
- Visual learners benefit from hearing
- Enables multitasking

### Differentiation
- **No other platform has this!**
- Competitive advantage
- Premium feature

---

## 📜 License

MIT License - Free to use, modify, and distribute

---

## 🙏 Credits

**Built with**:
- OpenClaw Gateway (AI orchestration)
- SuperCore AI (coaching intelligence)
- ElevenLabs (Text-to-Speech)
- Web Speech API (Speech-to-Text)
- Next.js (Frontend)
- WebSocket (Real-time communication)

---

## 🎯 Get Started NOW!

```bash
cd C:\Users\bilal\Downloads\grokking
LAUNCH_OPENCLAW_COACH.bat
```

**Test page opens automatically!**

Click mic → Speak → Coach responds with voice! 🎤🤖✨

---

**You now have SuperCore AI coaching INSIDE your website!** 🚀

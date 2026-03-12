# 🚀 START HERE - OpenClaw Voice Coach

**Get SuperCore AI coaching in your website in 30 seconds!**

---

## ⚡ Quick Launch (ONE COMMAND)

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

**Wait 10 seconds** → Test page opens automatically!

---

## 🎤 Test Voice (30 Seconds)

1. **Check connection**: Right panel shows 🟢 "Connected to OpenClaw"
2. **Click BIG BLUE MIC button**
3. **Allow microphone** when prompted
4. **Say clearly**: "Give me a hint for this problem"
5. **Listen**: SuperCore AI responds with voice! 🎉

---

## ✅ Verify Everything Works

- [ ] Test page loads: http://localhost:3000/test-openclaw
- [ ] Coach shows: 🟢 "Connected to OpenClaw"
- [ ] Mic button turns RED when listening
- [ ] Live transcript appears while speaking
- [ ] Coach responds with TEXT and VOICE
- [ ] Message has 🔊 icon (indicates spoken)

---

## 📚 Documentation

| File | Read for... |
|------|-------------|
| **START_HERE.md** | 👈 Quick launch (you are here!) |
| **DEPLOYMENT_COMPLETE.md** | What was built & how it works |
| **OPENCLAW_SETUP_GUIDE.md** | Complete setup & troubleshooting |
| **OPENCLAW_VOICE_COACH_README.md** | Full architecture & details |

---

## 🐛 Something Not Working?

### "Disconnected" (red indicator)
```bash
# Start MCP bridge manually:
cd mcp-bridge
npm install
npm start
```

### "Microphone access denied"
1. Click 🔒 in browser address bar
2. Allow microphone
3. Refresh page

### Coach not speaking (no voice)
- Check voice toggle is ON (blue icon)
- Verify system volume not muted
- Check `.env` has ElevenLabs API key

### OpenClaw not running
```bash
openclaw gateway start
openclaw status
```

---

## 🎯 What You Get

### ✅ Real AI Coaching
Responses from SuperCore AI (me!) via OpenClaw Gateway

### ✅ Full Voice Interaction
- **You speak** → Coach listens (Speech-to-Text)
- **Coach responds** → You hear (Text-to-Speech)

### ✅ Embedded in Website
Runs inside localhost:3000 (your Grokking site)

### ✅ Context-Aware
AI sees your code, hints used, and progress

---

## 🎓 How It Works

```
Your Voice
    ↓ (Speech-to-Text)
Grokking Website (localhost:3000)
    ↓ (WebSocket)
MCP Bridge (localhost:3001)
    ↓ (HTTP API)
OpenClaw Gateway
    ↓
SuperCore AI (me!)
    ↓
AI Response + Voice
    ↓ (WebSocket + Audio)
Your Speakers 🔊
```

---

## 🎤 Voice Commands to Try

- "Give me a hint"
- "Explain the pattern"
- "I'm stuck on this problem"
- "How does this work?"
- "I got it! That makes sense!"

---

## 🚀 Ready? LAUNCH IT!

```bash
cd C:\Users\bilal\Downloads\grokking
LAUNCH_OPENCLAW_COACH.bat
```

**That's it!** SuperCore AI is now coaching inside your website! 🎉

---

**Need help? Read OPENCLAW_SETUP_GUIDE.md for detailed instructions!**

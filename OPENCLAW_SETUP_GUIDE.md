# 🚀 OpenClaw Voice Coach - Setup Guide

Complete guide to launch the OpenClaw-powered AI Voice Coach inside your Grokking website.

---

## 🎯 What This Does

Connects your Grokking website directly to **SuperCore AI** (via OpenClaw Gateway) for real-time AI coaching with voice interaction.

**Architecture**:
```
Grokking Website (localhost:3000)
    ↕ WebSocket
MCP Bridge Server (localhost:3001)
    ↕ HTTP/WebSocket
OpenClaw Gateway (running in background)
    ↕
SuperCore AI (me!)
```

---

## 📋 Prerequisites

### 1. OpenClaw Installed
```bash
# Check if installed
openclaw --version

# If not installed, install it
npm install -g openclaw
```

### 2. OpenClaw Gateway Running
```bash
# Check status
openclaw status

# If not running, start it
openclaw gateway start
```

### 3. Node.js Installed
- Version 18+ required
- Check: `node --version`

---

## 🚀 Quick Launch (EASIEST)

### Windows:
1. **Double-click**: `LAUNCH_OPENCLAW_COACH.bat`
2. Wait 10 seconds
3. Browser opens automatically to test page

### Linux/Mac:
```bash
chmod +x LAUNCH_OPENCLAW_COACH.sh
./LAUNCH_OPENCLAW_COACH.sh
```

That's it! Everything starts automatically:
- ✅ OpenClaw Gateway (if not running)
- ✅ MCP Bridge Server (port 3001)
- ✅ Grokking Website (port 3000)
- ✅ Opens test page in browser

---

## 📝 Manual Launch (Step-by-Step)

If you want to start services manually:

### Step 1: Start OpenClaw Gateway
```bash
openclaw gateway start
# Wait 5 seconds for it to start

openclaw status
# Should show "Running"
```

### Step 2: Start MCP Bridge Server
```bash
cd C:\Users\bilal\Downloads\grokking\mcp-bridge

# Install dependencies (first time only)
npm install

# Start server
npm start
```

You should see:
```
🌉 ═══════════════════════════════════════════════════
🌉 MCP Bridge Server STARTED
🌉 ═══════════════════════════════════════════════════
📡 WebSocket endpoint: ws://localhost:3001
🏥 Health check: http://localhost:3001/health
🎓 OpenClaw Gateway: http://localhost:3000
🤖 OpenClaw connected: ✅ YES
🔊 Voice enabled: ✅ YES
```

**Leave this terminal open!**

### Step 3: Start Grokking Website
```bash
cd C:\Users\bilal\Downloads\grokking

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- ready started server on 0.0.0.0:3000
```

**Leave this terminal open too!**

### Step 4: Open Test Page
Navigate to: **http://localhost:3000/test-openclaw**

---

## ✅ Verify Everything Works

### 1. Check OpenClaw Gateway
```bash
openclaw status
```

Should show:
```
✓ Gateway running (PID: xxxxx)
```

### 2. Check MCP Bridge
Open: **http://localhost:3001/health**

Should show:
```json
{
  "status": "ok",
  "activeSessions": 0,
  "uptime": 123.45,
  "openclawConnected": true,
  "voiceEnabled": true
}
```

### 3. Check Grokking Website
Open: **http://localhost:3000**

Should load the website homepage.

### 4. Check OpenClaw Integration
Open: **http://localhost:3000/test-openclaw**

You should see:
- ✅ Left panel: Problem description
- ✅ Center: Code editor
- ✅ Right panel: AI Coach with green "Connected to OpenClaw" indicator

---

## 🎤 Test Voice Interaction

On the test page:

1. **Check Connection**
   - Right panel should show: 🟢 "Connected to OpenClaw"
   - If red "Connecting...", check MCP bridge is running

2. **Click the BIG BLUE MIC BUTTON**
   - Says "Press to Speak to SuperCore"

3. **Allow Microphone Access**
   - Browser will prompt for permission
   - Click "Allow"

4. **Speak Clearly**:
   ```
   "Give me a hint for Two Sum"
   ```

5. **Watch**:
   - ✅ Live transcript appears (your words)
   - ✅ Message sent to SuperCore AI
   - ✅ Coach responds with text
   - ✅ Coach SPEAKS the response (voice)
   - ✅ Message marked with 🔊 icon

---

## 🔧 Configuration

### MCP Bridge Environment Variables

File: `mcp-bridge/.env`

```bash
# OpenClaw Gateway URL
OPENCLAW_GATEWAY_URL=http://localhost:3000

# OpenClaw API Token (optional, for auth)
OPENCLAW_API_TOKEN=

# ElevenLabs TTS (already configured)
ELEVENLABS_API_KEY=sk_2a8f0960d0208b1530971cec2247c779c5794989deb4987f
ELEVENLABS_VOICE_ID=Cz0K1kOv9tD8l0b5Qu53

# Server Port
PORT=3001
```

**Note**: `OPENCLAW_API_TOKEN` is optional. Leave blank for local development.

### Getting OpenClaw API Token (Optional)

Only needed if OpenClaw Gateway requires authentication:

```bash
# Generate a token
openclaw gateway config

# Look for "api_token" in the config
# Copy it to mcp-bridge/.env
```

---

## 🐛 Troubleshooting

### "OpenClaw Gateway not running"

**Fix**:
```bash
openclaw gateway start
openclaw status
```

### "WebSocket error" or "Disconnected"

**Causes**:
1. MCP Bridge not running
2. Wrong WebSocket URL
3. Firewall blocking port 3001

**Fix**:
```bash
# Check MCP bridge is running
curl http://localhost:3001/health

# Should return JSON with status: ok

# If not, start it:
cd mcp-bridge
npm start
```

### "Microphone access denied"

**Fix**:
1. Click 🔒 lock icon in browser address bar
2. Find "Microphone" permission
3. Change to "Allow"
4. Refresh page
5. Try mic button again

### Coach not speaking (no voice)

**Checks**:
1. ✅ Voice toggle is ON (blue, not gray)
2. ✅ System volume not muted
3. ✅ ElevenLabs API key in `.env`
4. ✅ Check browser console for errors

**Verify ElevenLabs**:
```bash
# Check .env file
cat mcp-bridge/.env | grep ELEVENLABS

# Should show the API key
```

### "Connected to OpenClaw" but no AI responses

**Causes**:
1. OpenClaw Gateway not responding
2. Sessions API not working
3. Network issue

**Fix**:
```bash
# Test OpenClaw Gateway directly
curl http://localhost:3000/api/v1/status

# Or check logs
openclaw logs
```

### Browser shows "localhost refused to connect"

**Causes**:
1. Grokking website not running (port 3000)
2. MCP bridge not running (port 3001)

**Fix**:
```bash
# Check what's running on ports
netstat -an | findstr "3000"
netstat -an | findstr "3001"

# Restart services if needed
```

---

## 📁 File Structure

```
C:\Users\bilal\Downloads\grokking\
│
├── mcp-bridge/                         # MCP Bridge Server
│   ├── server.ts                       # Main server code
│   ├── package.json                    # Dependencies
│   ├── .env                            # Configuration
│   └── node_modules/                   # Installed packages
│
├── src/
│   ├── components/ai/
│   │   └── AICoachOpenClaw.tsx        # OpenClaw-connected coach
│   ├── app/test-openclaw/
│   │   └── page.tsx                   # Test page
│   └── lib/
│       ├── voiceInput.ts              # Speech-to-text
│       └── voiceCoach.ts              # Text-to-speech
│
├── LAUNCH_OPENCLAW_COACH.bat          # Windows launcher
├── LAUNCH_OPENCLAW_COACH.sh           # Linux/Mac launcher
├── OPENCLAW_SETUP_GUIDE.md            # This file
└── package.json                        # Grokking dependencies
```

---

## 🎓 How to Integrate Into Your Pages

### 1. Import the Component
```tsx
import AICoachOpenClaw from '@/components/ai/AICoachOpenClaw';
```

### 2. Add to Your Layout
```tsx
<div className="flex h-screen">
  {/* Your existing code editor */}
  <div className="flex-1">
    <CodeEditor value={code} onChange={setCode} />
  </div>

  {/* OpenClaw Voice Coach */}
  <div className="w-96">
    <AICoachOpenClaw
      currentProblem="Two Sum"
      userCode={code}
      userId="student-123"
      enableVoice={true}
      bridgeUrl="ws://localhost:3001"
    />
  </div>
</div>
```

### 3. Done!

The coach will:
- ✅ Connect to OpenClaw automatically
- ✅ Send code updates to SuperCore AI
- ✅ Listen for voice commands
- ✅ Respond with AI-generated coaching
- ✅ Speak responses with voice

---

## 🔒 Security Notes

### Local Development
- MCP bridge accepts all connections (no auth)
- OpenClaw Gateway on localhost (no external access)
- Safe for local testing

### Production Deployment
1. **Add authentication** to MCP bridge
2. **Use HTTPS/WSS** for WebSocket connections
3. **Restrict CORS** to your domain only
4. **Set OPENCLAW_API_TOKEN** in production
5. **Rate limit** voice API calls
6. **Monitor costs** (ElevenLabs usage)

---

## 📊 Monitoring

### Check Active Sessions
```bash
curl http://localhost:3001/sessions
```

Returns list of active students and their progress.

### Check Health
```bash
curl http://localhost:3001/health
```

Returns server status and connection info.

### View Logs

**MCP Bridge**: Check the terminal where you ran `npm start`

**OpenClaw Gateway**:
```bash
openclaw logs
# Or
openclaw logs --follow  # Live logs
```

---

## 🚦 Production Deployment

### 1. Deploy MCP Bridge

**Option A: Heroku**
```bash
cd mcp-bridge
heroku create grokking-mcp-bridge
heroku config:set OPENCLAW_GATEWAY_URL=https://your-openclaw-gateway.com
heroku config:set OPENCLAW_API_TOKEN=your_token
heroku config:set ELEVENLABS_API_KEY=your_key
git push heroku main
```

**Option B: AWS/DigitalOcean**
- Deploy as Node.js app
- Ensure WebSocket support
- Use process manager (PM2)

### 2. Update Frontend

Change `bridgeUrl` in production:
```tsx
<AICoachOpenClaw
  bridgeUrl="wss://your-mcp-bridge.herokuapp.com"
  // ... other props
/>
```

### 3. SSL Certificates

Ensure both:
- Grokking website: HTTPS
- MCP bridge: WSS (WebSocket Secure)

---

## 📚 Additional Resources

- **OpenClaw Docs**: https://docs.openclaw.ai
- **ElevenLabs API**: https://elevenlabs.io/docs
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **WebSocket Guide**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

## ✅ Launch Checklist

Before starting:

- [ ] OpenClaw installed (`openclaw --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git repository cloned
- [ ] Dependencies installed (`npm install` in both folders)
- [ ] ElevenLabs API key configured
- [ ] Microphone connected and working

To launch:

- [ ] Start OpenClaw Gateway (`openclaw gateway start`)
- [ ] Start MCP Bridge (`cd mcp-bridge && npm start`)
- [ ] Start Grokking Website (`npm run dev`)
- [ ] Open test page (http://localhost:3000/test-openclaw)
- [ ] Test voice interaction
- [ ] Verify AI responses

---

## 🎉 Success!

If you see:
- ✅ Green "Connected to OpenClaw" indicator
- ✅ Mic button works
- ✅ Coach responds to voice commands
- ✅ Voice playback works

**You're all set!** SuperCore AI is now coaching inside your website! 🚀

---

**Need Help?**
- Check troubleshooting section above
- Run diagnostics: `openclaw status`
- Check logs: `openclaw logs`
- Test health: `curl http://localhost:3001/health`

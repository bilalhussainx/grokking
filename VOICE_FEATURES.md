# 🎙️ Full Voice Features - AI Interview Coach

## What You Get

Your AI coach now has **FULL VOICE INTERACTION** - both listening and speaking!

### ✅ Voice Input (Speech-to-Text)
- **Press the mic button** to speak to your coach
- Ask questions naturally: "Give me a hint", "Explain this pattern", "I'm stuck"
- Live transcription shows what you're saying in real-time
- Works in Chrome, Edge, Safari (Web Speech API)
- Fallback to Whisper API if browser doesn't support it

### ✅ Voice Output (Text-to-Speech)
- Coach responds with **natural voice** using ElevenLabs
- Emotion-based voice settings:
  - **Encouraging**: Warm, supportive tone
  - **Teaching**: Clear, instructive voice
  - **Celebrating**: Excited, congratulatory
  - **Gentle Nudge**: Soft, helpful reminder
- Toggle voice on/off anytime

### ✅ Two-Way Conversation
- **You speak** → Coach listens & transcribes → **Coach responds** with voice
- Natural back-and-forth dialogue
- No typing required - pure voice interaction!

## Components

### AICoachFullVoice (Recommended ⭐)
**Location**: `src/components/ai/AICoachFullVoice.tsx`

**Full voice interaction** - both input and output
- Mic button to start/stop listening
- Live transcript display
- Voice responses from coach
- Quick action buttons (Hint, Explain, Got It)
- Voice tips panel

**Use this if you want**: Complete hands-free coding experience

### AICoachWithVoice (Alternative)
**Location**: `src/components/ai/AICoachWithVoice.tsx`

**Voice output only** - coach speaks, you type
- Manual buttons for hints/explanations
- Voice toggle
- Progress tracking
- Good for when you prefer typing questions

## Quick Integration

### Step 1: Import the Component

```tsx
import AICoachFullVoice from '@/components/ai/AICoachFullVoice';
```

### Step 2: Add to Your Page Layout

```tsx
<div className="flex h-screen">
  {/* Problem Panel */}
  <div className="w-1/3 p-4">
    <h2>Problem: Two Sum</h2>
    <p>Problem description...</p>
  </div>

  {/* Code Editor */}
  <div className="flex-1">
    <CodeEditor 
      value={code}
      onChange={setCode}
    />
  </div>

  {/* AI Coach (Voice-Enabled) */}
  <div className="w-96">
    <AICoachFullVoice
      currentProblem="Two Sum"
      userCode={code}
      enableVoice={true}
    />
  </div>
</div>
```

### Step 3: Test It!

1. **Run the app**: `npm run dev`
2. **Click the mic button** (big blue/purple button)
3. **Allow microphone access** when prompted
4. **Speak**: "Give me a hint for this problem"
5. **Coach responds** with voice!

## Voice Commands

Say these naturally to interact with your coach:

### Get Help
- "Give me a hint"
- "I'm stuck on this problem"
- "Help me understand this"
- "What should I do next?"

### Learn Concepts
- "Explain this pattern"
- "How does this work?"
- "Why is this approach better?"
- "Teach me the concept"

### Show Progress
- "I got it!"
- "I understand now"
- "Ready for the next one"
- "I figured it out"

## Technical Details

### Browser Support

**Web Speech API** (Primary - Free):
- ✅ Chrome (Best support)
- ✅ Edge (Chromium)
- ✅ Safari (macOS/iOS)
- ❌ Firefox (not supported)

**Whisper API** (Fallback):
- Works in ALL browsers
- Requires OpenAI API key
- Set in `.env.local`: `NEXT_PUBLIC_OPENAI_API_KEY`

### Voice Services

**Speech-to-Text**: `src/lib/voiceInput.ts`
- Web Speech API (free, instant)
- Whisper fallback (paid, requires API key)
- Continuous listening mode
- Live interim results

**Text-to-Speech**: `src/lib/voiceCoach.ts`
- ElevenLabs API
- Professional interviewer voice
- Emotion-based settings
- High-quality audio

## API Keys Required

### ElevenLabs (Text-to-Speech) ✅
Already configured in `.env.local`:
```
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_2a8f0960d0208b1530971cec2247c779c5794989deb4987f
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=Cz0K1kOv9tD8l0b5Qu53
```

### OpenAI (Optional - Whisper Fallback)
Only needed if Web Speech API not supported:
```
NEXT_PUBLIC_OPENAI_API_KEY=your_key_here
```

## Troubleshooting

### "Microphone access denied"
1. Click the 🔒 lock icon in browser address bar
2. Enable microphone permissions
3. Refresh the page
4. Try the mic button again

### "Voice input not supported"
- Using Firefox? Switch to Chrome/Edge
- Or add OpenAI API key for Whisper fallback

### Coach not speaking
1. Check voice toggle is ON (volume icon)
2. Verify ElevenLabs API key in `.env.local`
3. Check browser console for errors
4. Test system audio/volume

### Live transcript not showing
- Speak clearly into your microphone
- Check mic is working (test in another app)
- Browser may need mic permissions

## Privacy & Security

- **Voice data**: Processed in browser (Web Speech API) or via Whisper API
- **No recordings stored**: Audio transcribed in real-time, not saved
- **API calls**: Only to ElevenLabs (TTS) and optionally OpenAI (STT)
- **Toggle anytime**: Turn voice on/off with one click

## Example Usage

```tsx
import { useState } from 'react';
import AICoachFullVoice from '@/components/ai/AICoachFullVoice';
import CodeEditor from '@/components/CodeEditor';

export default function ProblemPage() {
  const [code, setCode] = useState('');

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Code Editor */}
      <div className="flex-1 p-4">
        <CodeEditor 
          value={code}
          onChange={setCode}
          language="python"
        />
      </div>

      {/* Voice-Enabled Coach */}
      <AICoachFullVoice
        currentProblem="Two Pointers - Pair Sum"
        userCode={code}
        enableVoice={true}
      />
    </div>
  );
}
```

## Next Steps

1. ✅ Install component (`AICoachFullVoice.tsx`)
2. ✅ Configure API keys (`.env.local`)
3. ✅ Add to your page layout
4. ▶️ Test voice interaction
5. 🚀 Deploy and use!

---

**Built with**:
- Web Speech API (Browser STT)
- ElevenLabs (Professional TTS)
- OpenAI Whisper (Fallback STT)
- React + TypeScript

# 🧪 Voice Testing Guide

Complete guide to test all voice features of your AI Interview Coach.

---

## 🎯 Quick Test (2 Minutes)

### Step 1: Start the App
```bash
cd C:\Users\bilal\Downloads\grokking
npm run dev
```

### Step 2: Open Test Page
Navigate to: **http://localhost:3000/test-voice**

### Step 3: Test Voice Input
1. **Click the big blue mic button** (says "Press to Speak")
2. **Allow microphone access** when browser prompts
3. **Say clearly**: "Give me a hint"
4. **Watch**:
   - Live transcript appears (your words in real-time)
   - Coach responds with voice
   - Message appears in chat

### Step 4: Test Voice Output
1. Coach should speak automatically when responding
2. Look for 🔊 icon next to coach messages (indicates it was spoken)
3. Click volume toggle to turn voice on/off

### ✅ Success Criteria
- [x] Mic button turns red when listening
- [x] Live transcript shows your speech
- [x] Coach responds with text AND voice
- [x] Messages marked with 🔊 icon
- [x] Can toggle voice on/off

---

## 🎤 Voice Input Testing

### Test 1: Basic Speech Recognition
**Say**: "Hello coach, can you hear me?"

**Expected**:
- ✅ Live transcript updates while speaking
- ✅ Final transcript appears when done
- ✅ Coach responds: "I hear you! Let's work through this together..."
- ✅ Coach speaks the response out loud

### Test 2: Hint Request
**Say**: "Give me a hint for this problem"

**Expected**:
- ✅ Coach provides a strategic hint
- ✅ Response uses "gentle_nudge" emotion (soft, helpful tone)
- ✅ Hint appears in purple hint box

### Test 3: Explanation Request
**Say**: "Explain the pattern to me"

**Expected**:
- ✅ Coach explains the concept
- ✅ Response uses "teaching" emotion (clear, instructive)
- ✅ Explanation is detailed but not solution-giving

### Test 4: Progress Indication
**Say**: "I got it! I understand now!"

**Expected**:
- ✅ Coach celebrates with you
- ✅ Response uses "celebrating" emotion (excited, congratulatory)
- ✅ Encouraging message appears

### Test 5: Stuck Detection
**Say**: "I'm really stuck on this"

**Expected**:
- ✅ Coach offers help
- ✅ Gentle, supportive response
- ✅ May suggest breaking down the problem

### Test 6: Continuous Listening
1. Start listening (mic button)
2. Say multiple things in a row:
   - "Give me a hint"
   - (Wait for response)
   - "Okay, explain it more"
   - (Wait for response)
   - "I got it now!"

**Expected**:
- ✅ Coach responds to each statement
- ✅ Mic stays active between responses
- ✅ Conversation flows naturally

---

## 🔊 Voice Output Testing

### Test 1: Voice Toggle
1. Click the volume icon (top right)
2. Click mic and say something
3. Toggle voice again

**Expected**:
- ✅ Blue icon = voice ON (coach speaks)
- ✅ Gray icon = voice OFF (text only)
- ✅ Messages still appear even when voice is off

### Test 2: Emotion Detection
Test different response types:

**Encouraging** (say "Hello coach"):
- ✅ Warm, supportive voice tone
- ✅ Friendly, welcoming response

**Teaching** (say "Explain this"):
- ✅ Clear, instructive voice tone
- ✅ Slightly slower, deliberate pacing

**Celebrating** (say "I got it"):
- ✅ Excited, upbeat voice tone
- ✅ Faster pacing, enthusiastic

**Gentle Nudge** (say "Give me a hint"):
- ✅ Soft, helpful voice tone
- ✅ Encouraging but not pushy

### Test 3: Audio Quality
Listen for:
- ✅ Clear pronunciation
- ✅ Natural speech rhythm
- ✅ No audio glitches or cutoffs
- ✅ Appropriate volume level

---

## 🌐 Browser Compatibility Testing

### Chrome (Recommended)
- ✅ Web Speech API works perfectly
- ✅ Instant speech recognition
- ✅ Live interim results
- ✅ No API key needed

### Edge
- ✅ Same as Chrome (Chromium-based)
- ✅ Excellent support

### Safari (macOS/iOS)
- ✅ Web Speech API supported
- ⚠️ May need permissions in System Preferences
- ⚠️ Test on macOS first

### Firefox
- ❌ Web Speech API NOT supported
- 🔄 Should fallback to Whisper API
- ⚠️ Requires OpenAI API key in `.env.local`

**To test Whisper fallback**:
1. Open Firefox
2. Add to `.env.local`: `NEXT_PUBLIC_OPENAI_API_KEY=your_key`
3. Test voice input
4. Should record audio and transcribe via Whisper

---

## 🚨 Troubleshooting Tests

### Test: Microphone Permission Denied
**Steps**:
1. Deny microphone when prompted
2. Click mic button

**Expected**:
- ✅ Alert: "Microphone access denied..."
- ✅ Instructions to enable permissions

**Fix**:
1. Click 🔒 in address bar
2. Allow microphone
3. Refresh page

### Test: No Microphone Available
**Steps**:
1. Disable/unplug microphone
2. Click mic button

**Expected**:
- ✅ Error message about mic not found
- ✅ Graceful fallback (no crash)

### Test: Voice API Failure
**Steps**:
1. Remove ElevenLabs API key from `.env.local`
2. Restart server
3. Try voice interaction

**Expected**:
- ✅ Text messages still appear
- ✅ No voice output
- ✅ Console shows error but app continues

### Test: Network Offline
**Steps**:
1. Disable internet
2. Click mic button

**Expected**:
- ✅ Web Speech API may still work (browser-based)
- ✅ Voice output fails gracefully
- ✅ Text interaction continues

---

## 📊 Performance Testing

### Test: Response Speed
**Measure**:
1. Say "Give me a hint"
2. Time from end of speech to coach response

**Expected**:
- ✅ Speech-to-text: < 1 second (Web Speech API)
- ✅ Coach thinking: < 2 seconds
- ✅ Text-to-speech generation: < 3 seconds
- ✅ Total: < 6 seconds end-to-end

### Test: Multiple Rapid Requests
**Steps**:
1. Say "hint" → wait for response
2. Immediately say "explain" → wait
3. Immediately say "got it" → wait

**Expected**:
- ✅ No messages get dropped
- ✅ Responses queue properly
- ✅ No audio overlap
- ✅ Clean conversation flow

### Test: Long Session
**Steps**:
1. Have a 5+ minute conversation
2. Mix voice and button clicks
3. Toggle voice on/off
4. Start/stop listening multiple times

**Expected**:
- ✅ No memory leaks
- ✅ No performance degradation
- ✅ Mic reconnects reliably
- ✅ Audio playback stable

---

## 🎯 Integration Testing

### Test: Code Change Detection
**Steps**:
1. Start with empty code
2. Type some code (50+ characters)
3. Wait a moment

**Expected**:
- ✅ Coach notices you're coding
- ✅ State changes to "Coding" (green dot)
- ✅ Encouraging message: "Nice! You're diving into the code..."

### Test: Problem Change
**Steps**:
1. Props update: `currentProblem="New Problem"`
2. Check coach response

**Expected**:
- ✅ Coach acknowledges new problem
- ✅ Hint counter resets
- ✅ State resets to "Thinking"

### Test: Quick Actions + Voice
**Steps**:
1. Start listening (mic button)
2. While listening, click "Hint" button
3. Say something

**Expected**:
- ✅ Button disabled while listening
- ✅ Voice takes priority
- ✅ Button re-enables after

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

### Environment
- [ ] `.env.local` has `NEXT_PUBLIC_ELEVENLABS_API_KEY`
- [ ] `.env.local` has `NEXT_PUBLIC_ELEVENLABS_VOICE_ID`
- [ ] (Optional) `.env.local` has `NEXT_PUBLIC_OPENAI_API_KEY` for Whisper fallback

### Files
- [ ] `AICoachFullVoice.tsx` in `src/components/ai/`
- [ ] `voiceInput.ts` in `src/lib/`
- [ ] `voiceCoach.ts` in `src/lib/`

### Testing
- [ ] Tested in Chrome (primary browser)
- [ ] Tested mic permissions flow
- [ ] Tested voice toggle
- [ ] Tested all voice commands
- [ ] Tested error handling
- [ ] Tested with voice ON and OFF

### Performance
- [ ] Response time < 6 seconds
- [ ] No audio glitches
- [ ] No memory leaks in long sessions

### Documentation
- [ ] `VOICE_FEATURES.md` available
- [ ] `WHATS_NEW.md` updated
- [ ] Test page works (`/test-voice`)

---

## 📝 Test Report Template

Copy and fill out after testing:

```markdown
# Voice Feature Test Report

**Date**: [DATE]
**Tester**: [YOUR NAME]
**Browser**: [Chrome/Edge/Safari/Firefox]
**OS**: [Windows/macOS/Linux]

## Results

### Voice Input
- [ ] Mic permissions work
- [ ] Live transcription displays
- [ ] Speech recognized accurately
- [ ] Multiple languages tested: ___________

### Voice Output
- [ ] Coach speaks responses
- [ ] Voice toggle works
- [ ] Emotions sound different
- [ ] Audio quality good

### Integration
- [ ] Works with code editor
- [ ] Problem changes detected
- [ ] State tracking works

### Errors
- [ ] Graceful error handling
- [ ] No crashes observed
- [ ] Offline mode tested

## Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
- [Recommendation 1]
- [Recommendation 2]

## Overall Rating
[1-5 stars] ⭐⭐⭐⭐⭐
```

---

## 🎬 Demo Script

Use this to demo the voice features:

1. **Introduction**: "Let me show you our new voice-enabled AI coach!"

2. **Start**: Open `/test-voice`, click mic

3. **Demo hint**: "Give me a hint for this problem"
   - Point out live transcript
   - Listen to voice response

4. **Demo teaching**: "Explain the pattern to me"
   - Different voice tone
   - Educational response

5. **Demo celebration**: "I got it now!"
   - Excited voice
   - Congratulatory message

6. **Show toggle**: Turn voice on/off
   - Text-only mode
   - Back to voice mode

7. **Conclusion**: "Fully interactive voice coaching for interview prep!"

---

**Ready to test? Start here**: http://localhost:3000/test-voice 🎤

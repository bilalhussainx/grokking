# 🔧 Deepgram Voice Agent Fix Plan
**Date:** March 25, 2026  
**Status:** CRITICAL - Production Error  
**Issue:** Voice agents failing with API errors + poor context loading

---

## 🔴 ROOT CAUSE ANALYSIS

### 1. **`agent.think.prompt` → API Error**
**Problem:** Deepgram Voice Agent API expects `instructions` field, not `prompt`  
**Error:** `"Error parsing client message. Check the agent.think field against the API spec"`  
**Evidence:** Deepgram API docs specify `agent.think.instructions` as the correct field name  
**Impact:** WebSocket closes immediately with code 1005 (abnormal closure)

### 2. **Poor Lesson Context Loading**
**Problem:** Agents say they don't have lesson context even though it's passed  
**Root Cause:** 
- Context buried in system prompt without clear instruction to reference it
- No explicit directive to quote lesson material
- Prompt doesn't emphasize that context IS available

### 3. **Not Proactive/Human-Like**
**Problem:** Users have to keep prompting agent to speak  
**Root Cause:**
- No proactive behavior instructions in system prompt
- Greeting fires once, then agent becomes reactive
- No "check-in" logic to ask if user needs help

### 4. **Multi-Language Issues**
**Problem:** Language switching may cause inconsistent behavior  
**Root Cause:** Language instruction conflicts with base persona prompt

---

## ✅ FIXES IMPLEMENTED

### **Fix #1: Correct Deepgram API Field Name**
```diff
agent: {
  think: {
    provider: { type: "open_ai", ... },
    endpoint: { ... },
-   prompt: contextPrompt,  // ❌ WRONG
+   instructions: systemInstructions,  // ✅ CORRECT
  }
}
```

### **Fix #2: Proactive Behavior Instructions**
Added explicit section to system prompt:
```
## PROACTIVE BEHAVIOR
You are a PROACTIVE tutor. Do NOT wait passively for questions. Instead:
- After greeting, immediately reference the current lesson
- If silent >3 seconds, offer hints
- Regularly check understanding
- Reference lesson material naturally
- Guide step-by-step without being asked
```

### **Fix #3: Better Context Injection**
```diff
+ ## LESSON MATERIAL
+ This is the lesson content the student is studying. Reference specific parts:
+ 
+ [content here]
+
+ IMPORTANT: When asked about this lesson, quote parts above.
+ Don't say "I don't have the content" - you DO have it!
```

### **Fix #4: Engaging Greeting with Lesson Reference**
```diff
- greeting = persona.greeting(lessonTitle)
+ greeting = `${persona.greeting("")} I see you're working on "${lessonTitle}" - What would you like to start with?`
```

### **Fix #5: Higher Temperature for Natural Responses**
```diff
- temperature: 0.5,  // Too robotic
+ temperature: 0.6,  // More natural/conversational
```

---

## 📋 TESTING PLAN

### **Step 1: Deploy Fixed Version**
```bash
# Backup current version
cp src/app/api/ai/voice-session/route.ts src/app/api/ai/voice-session/route.BACKUP.ts

# Apply fix
cp src/app/api/ai/voice-session/route.FIXED.ts src/app/api/ai/voice-session/route.ts

# Deploy to Vercel
git add .
git commit -m "🔧 Fix Deepgram voice agent API errors + improve proactivity"
git push origin main
```

### **Step 2: Test Basic Functionality**
1. Open https://grokking-delta.vercel.app/
2. Navigate to any lesson
3. Click "Coach Alex" (or any voice agent)
4. **Expected:** Agent greets and immediately asks what you want to start with
5. **Check console:** No "Error parsing client message" errors
6. **Check WebSocket:** Should stay connected (not close with 1005)

### **Step 3: Test Lesson Context Loading**
1. Start voice session on a specific lesson (e.g., "Binary Search")
2. Ask: "What is this lesson about?"
3. **Expected:** Agent references specific lesson content, doesn't say "I don't have that info"
4. Ask: "Can you explain the starter code?"
5. **Expected:** Agent references the actual starter code from lesson

### **Step 4: Test Proactive Behavior**
1. Start voice session
2. Stay silent for 5 seconds
3. **Expected:** Agent proactively asks if you need help or offers hint
4. Ask a question, then go silent again
5. **Expected:** Agent follows up with "Does that make sense?" or similar

### **Step 5: Test Multi-Language**
1. Switch language to Spanish/French/Japanese
2. Start voice session
3. **Expected:** Agent speaks entirely in selected language
4. Ask about lesson content
5. **Expected:** Agent translates and explains lesson in target language

### **Step 6: Verify Error Fix**
1. Open browser DevTools Console
2. Start voice session
3. **Check for absence of:**
   - ❌ "Error parsing client message"
   - ❌ "WebSocket closed: 1005"
   - ❌ "agent.think field" errors

---

## 🔄 ROLLBACK PLAN (If Things Break)

If the fix causes new issues:

```bash
# Restore backup
cp src/app/api/ai/voice-session/route.BACKUP.ts src/app/api/ai/voice-session/route.ts

# Redeploy
git add .
git commit -m "⏪ Rollback voice agent changes"
git push origin main
```

**Rollback triggers:**
- WebSocket still failing to connect
- Agent completely stops responding
- Multi-language breaks entirely
- Credit deduction errors

---

## 📊 SUCCESS METRICS

**Before Fix:**
- ❌ WebSocket error rate: ~100% (all connections failing)
- ❌ Context reference rate: ~0% (agent never references lesson)
- ❌ Proactive interactions: 0 (purely reactive)

**After Fix (Target):**
- ✅ WebSocket success rate: >95%
- ✅ Context reference rate: >80% (agent references lesson in first response)
- ✅ Proactive interactions: >50% (agent asks follow-up without prompting)

---

## 🧪 ADDITIONAL IMPROVEMENTS (Future)

1. **Function Calling for Interactive Exercises**
   - Add `functions` array to `agent.think`
   - Let agent trigger code execution, hints, examples

2. **Conversation Memory**
   - Track conversation history in DB
   - Resume previous sessions
   - Reference past mistakes

3. **Better Multi-Language Handling**
   - Use Sarvam TTS for Indic languages
   - Per-language persona tuning
   - Language-specific greetings

4. **User Feedback Loop**
   - Add "Was this helpful?" after each response
   - Track which agents/personas work best
   - A/B test different system prompts

---

## 🚨 CRITICAL NOTES

1. **Kimi K2 API Compatibility:** The Moonshot AI endpoint MUST remain OpenAI-compatible. If Kimi changes their API format, this will break.

2. **Deepgram API Version:** Using v1 agent API. Monitor Deepgram changelog for breaking changes.

3. **Environment Variables:** Ensure `DEEPGRAM_API_KEY` and `MOONSHOT_API_KEY` are set in Vercel environment variables.

4. **Credit Deduction:** Voice sessions deduct credits BEFORE agent loads. If fix causes more errors, users lose credits without getting service. Monitor credit transaction logs.

5. **Language Model Context Window:** Current limit is ~4000 chars of lesson content. If lessons grow larger, need to implement smart truncation or chunking.

---

## ✅ NEXT STEPS

1. **Deploy fix immediately** (production is currently broken)
2. **Test all scenarios** above
3. **Monitor Vercel logs** for 1 hour post-deployment
4. **Ask your friend to retest** and give feedback
5. **Document learnings** in MEMORY.md

**Estimated time to fix:** 15 minutes  
**Estimated time to test:** 30 minutes  
**Total downtime:** ~45 minutes

---

**Questions or issues?** Check Vercel deployment logs at:
https://vercel.com/bilals-projects/grokking-delta/deployments

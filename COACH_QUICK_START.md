# 🚀 AI Coach - Quick Start

**Get the coach running in 5 minutes!**

---

## ⚡ **Fastest Way to Test**

### **Step 1: Verify Files**

Check these files exist:
```
✅ src/components/ai/AICoach.tsx
✅ src/components/ai/AICoachWithVoice.tsx
✅ src/lib/voiceCoach.ts
✅ .env.local (updated with ElevenLabs keys)
```

### **Step 2: Import in Any Page**

Open any lesson or problem page, add:

```tsx
import AICoachWithVoice from '@/components/ai/AICoachWithVoice';
```

### **Step 3: Add to Layout**

```tsx
export default function YourPage() {
  return (
    <div className="flex h-screen">
      {/* Your existing content */}
      <div className="flex-1">
        {/* Problem, code editor, etc. */}
      </div>
      
      {/* Add Coach */}
      <div className="w-96">
        <AICoachWithVoice 
          currentProblem="Your Problem Title"
          enableVoice={true}
        />
      </div>
    </div>
  );
}
```

### **Step 4: Run**

```bash
npm run dev
```

**Visit the page → See Coach Alex greet you! 🎓**

---

## 🎨 **Example Layouts**

### **Layout 1: Problem | Code | Coach**

```tsx
<div className="flex h-screen bg-gray-900">
  {/* Left: Problem */}
  <div className="w-1/3 border-r border-gray-700 p-6 overflow-y-auto">
    <ProblemDescription />
  </div>
  
  {/* Center: Code */}
  <div className="flex-1">
    <CodeEditor />
  </div>
  
  {/* Right: Coach */}
  <div className="w-96">
    <AICoachWithVoice currentProblem="Two Sum" />
  </div>
</div>
```

### **Layout 2: Code + Coach Side Panel**

```tsx
<div className="flex h-screen bg-gray-900">
  <div className="flex-1">
    <CodeEditor />
  </div>
  
  <div className="w-80">
    <AICoachWithVoice />
  </div>
</div>
```

### **Layout 3: Full-Screen with Collapsible Coach**

```tsx
'use client';
import { useState } from 'react';

export default function Page() {
  const [showCoach, setShowCoach] = useState(true);
  
  return (
    <div className="relative h-screen">
      <div className={showCoach ? 'pr-96' : ''}>
        {/* Your content */}
      </div>
      
      {showCoach && (
        <div className="fixed right-0 top-0 h-full w-96">
          <AICoachWithVoice />
        </div>
      )}
      
      <button 
        onClick={() => setShowCoach(!showCoach)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full"
      >
        🎓
      </button>
    </div>
  );
}
```

---

## 🎯 **Common Use Cases**

### **1. Coding Problem Page**

```tsx
<AICoachWithVoice 
  currentProblem="Two Pointers - Pair with Target Sum"
  userCode={code}
  enableVoice={true}
/>
```

### **2. Tutorial Lesson**

```tsx
<AICoachWithVoice 
  currentProblem="Introduction to Dynamic Programming"
  enableVoice={true}
/>
```

### **3. Practice Session**

```tsx
<AICoachWithVoice 
  currentProblem={currentExercise.title}
  userCode={userCode}
  onHintRequest={() => trackHint()}
  enableVoice={true}
/>
```

---

## 🎓 **What the Coach Does**

### **Automatically:**
1. ✅ Welcomes user when mounted
2. ✅ Reacts when problem changes
3. ✅ Celebrates when user starts coding
4. ✅ Detects when user is stuck (>90s idle)
5. ✅ Tracks session time
6. ✅ Shows progress

### **On Button Click:**
1. 💡 **Get Hint** - Progressive hints (4 levels)
2. 📚 **Explain Pattern** - Teaches concept
3. 🎉 **I Got It!** - Celebrates success

### **Voice Features:**
1. 🔊 Speaks all messages via ElevenLabs
2. 🎚️ Toggle voice on/off
3. 🎭 Emotion-based tones
4. ⏸️ Visual "Speaking..." indicator

---

## 🔧 **Quick Customization**

### **Change Welcome Message**

Edit `src/components/ai/AICoachWithVoice.tsx`:

```tsx
// Line ~85:
addMessage(
  "Your custom welcome message here!",
  'encouraging'
);
```

### **Change Hint Messages**

```tsx
// Line ~135:
const hints = [
  "Your hint 1...",
  "Your hint 2...",
  "Your hint 3...",
  "Your hint 4..."
];
```

### **Disable Voice by Default**

```tsx
<AICoachWithVoice 
  enableVoice={false}  // User can enable via button
/>
```

---

## 📊 **Props Reference**

```typescript
interface AICoachWithVoiceProps {
  currentProblem?: string;      // Problem title (optional)
  userCode?: string;             // User's code for activity tracking
  onHintRequest?: () => void;    // Called when hint requested
  onConceptExplain?: () => void; // Called when concept explained
  enableVoice?: boolean;         // Enable voice (default: true)
}
```

---

## 🎨 **Styling**

### **Current Theme:**
- Dark gray background (#0d1117)
- Blue/purple gradient accents
- Smooth animations
- Matches GitHub dark theme

### **Customize Colors:**

```tsx
// Change background:
<div className="bg-gray-900">  // → bg-your-color

// Change message colors:
'bg-green-900/20 border-green-500'  // → your colors
```

---

## 🐛 **Troubleshooting**

### **Coach doesn't appear?**
- Check import path
- Verify component is in layout
- Check browser console for errors

### **Voice not working?**
- Check `.env.local` has ElevenLabs keys
- Check browser console for API errors
- Try clicking "Enable Voice" button
- Check browser allows audio playback

### **Messages not updating?**
- Pass `userCode` prop for activity tracking
- Pass `currentProblem` for problem-specific messages

### **Styling issues?**
- Verify Tailwind CSS is configured
- Check className syntax
- Verify parent has proper height

---

## ✅ **Integration Checklist**

Quick checklist for adding coach to a page:

- [ ] Import `AICoachWithVoice`
- [ ] Add component to layout (usually right side)
- [ ] Set container width (w-80, w-96, w-1/4, etc.)
- [ ] Pass `currentProblem` prop
- [ ] Optional: Pass `userCode` prop
- [ ] Optional: Add callbacks
- [ ] Test in browser
- [ ] Verify messages appear
- [ ] Test voice (if enabled)
- [ ] Test hint button
- [ ] Verify responsive layout

---

## 🎯 **Next Steps**

**After basic integration:**

1. **Add to more pages:**
   - All problem pages
   - Tutorial lessons
   - Practice sessions

2. **Track analytics:**
   - Hint usage
   - Concept requests
   - Session duration

3. **Customize:**
   - Change messages
   - Adjust voice settings
   - Modify styling

4. **Advanced:**
   - Add problem-specific hints
   - Integrate with test runner
   - Add progress persistence

---

## 📖 **Full Documentation**

See `AI_COACH_INTEGRATION.md` for:
- Complete API reference
- Advanced customization
- Voice service details
- Multiple integration examples

---

## 🎓 **Quick Test**

**1. Add to any page:**
```tsx
import AICoachWithVoice from '@/components/ai/AICoachWithVoice';

<AICoachWithVoice currentProblem="Test" />
```

**2. Run:**
```bash
npm run dev
```

**3. See Coach Alex greet you! 🎉**

---

**Need help? Check `AI_COACH_INTEGRATION.md` for full guide!**

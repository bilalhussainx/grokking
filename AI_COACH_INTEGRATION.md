# 🎓 AI Coach Integration Guide

**Live AI coaching has been added to your Grokking platform!**

---

## ✅ **What's Been Added**

### **New Components:**

1. **AICoach.tsx** - Text-based AI coach component
2. **AICoachWithVoice.tsx** - Voice-enabled AI coach with ElevenLabs TTS
3. **voiceCoach.ts** - Voice coaching service

### **Configuration:**

- ✅ ElevenLabs API keys added to `.env.local`
- ✅ Voice service configured
- ✅ Emotion-based voice settings

---

## 🚀 **How to Use**

### **Option 1: Basic Text Coach**

```tsx
import AICoach from '@/components/ai/AICoach';

function YourLessonPage() {
  return (
    <div className="flex h-screen">
      {/* Your existing content */}
      <div className="flex-1">
        {/* Problem description, code editor, etc. */}
      </div>
      
      {/* Add AI Coach */}
      <div className="w-96">
        <AICoach 
          currentProblem="Pair with Target Sum"
          userCode={userCode}
          onHintRequest={() => console.log('Hint requested')}
          onConceptExplain={() => console.log('Concept explain')}
        />
      </div>
    </div>
  );
}
```

### **Option 2: Voice-Enabled Coach** (Recommended!)

```tsx
import AICoachWithVoice from '@/components/ai/AICoachWithVoice';

function YourLessonPage() {
  const [userCode, setUserCode] = useState('');
  
  return (
    <div className="flex h-screen">
      {/* Your existing content */}
      <div className="flex-1">
        <CodeEditor value={userCode} onChange={setUserCode} />
      </div>
      
      {/* Add Voice-Enabled AI Coach */}
      <div className="w-96">
        <AICoachWithVoice 
          currentProblem="Pair with Target Sum"
          userCode={userCode}
          enableVoice={true}
          onHintRequest={() => trackHintUsage()}
          onConceptExplain={() => trackConceptRequest()}
        />
      </div>
    </div>
  );
}
```

---

## 🎨 **Features**

### **Real-Time Coaching:**
- ✅ Monitors user activity
- ✅ Detects when user is stuck (>90s idle)
- ✅ Celebrates when user starts coding
- ✅ Provides progressive hints
- ✅ Teaches concepts on demand

### **Voice Coaching:**
- ✅ Speaks messages via ElevenLabs TTS
- ✅ Emotion-based voice tones:
  - **Encouraging**: Warm, supportive
  - **Teaching**: Clear, educational
  - **Celebrating**: Excited, enthusiastic
  - **Gentle nudge**: Patient, helpful
- ✅ Toggle voice on/off
- ✅ Visual indicator when speaking

### **State Tracking:**
- **Idle**: Just started
- **Thinking**: Reading problem
- **Coding**: Writing solution (detected via code editor)
- **Stuck**: Idle >90 seconds → Coach offers help

### **Session Tracking:**
- ⏱️ Live timer
- 💡 Hints used counter
- 📈 Progress bar
- 📊 Activity state

---

## 📖 **Component Props**

### **AICoach / AICoachWithVoice**

```typescript
interface Props {
  currentProblem?: string;      // Current problem title
  userCode?: string;             // User's code (for activity tracking)
  onHintRequest?: () => void;    // Callback when hint requested
  onConceptExplain?: () => void; // Callback when concept explained
  enableVoice?: boolean;         // Enable voice (AICoachWithVoice only)
}
```

---

## 🎯 **Integration Examples**

### **Example 1: In Lesson Page**

```tsx
'use client';

import { useState } from 'react';
import AICoachWithVoice from '@/components/ai/AICoachWithVoice';
import CodeEditor from '@/components/editor/CodeEditor';

export default function LessonPage({ lesson }: { lesson: Lesson }) {
  const [code, setCode] = useState(lesson.starterCode || '');
  
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
        </div>
        
        <div className="flex-1 p-6">
          <CodeEditor 
            value={code}
            onChange={setCode}
            language="python"
          />
        </div>
      </div>
      
      <div className="w-96">
        <AICoachWithVoice 
          currentProblem={lesson.title}
          userCode={code}
          enableVoice={true}
        />
      </div>
    </div>
  );
}
```

### **Example 2: Collapsible Coach Panel**

```tsx
'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import AICoachWithVoice from '@/components/ai/AICoachWithVoice';

export default function LessonWithCollapsibleCoach({ lesson }: { lesson: Lesson }) {
  const [code, setCode] = useState('');
  const [coachOpen, setCoachOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1">
        {/* Your content */}
      </div>
      
      {/* Toggle Button */}
      <button
        onClick={() => setCoachOpen(!coachOpen)}
        className="fixed right-0 top-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-l-lg"
      >
        {coachOpen ? <ChevronRight /> : <ChevronLeft />}
      </button>
      
      {/* Coach Panel */}
      {coachOpen && (
        <div className="w-96 animate-slide-in-right">
          <AICoachWithVoice 
            currentProblem={lesson.title}
            userCode={code}
          />
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 **Customization**

### **Custom Voice Settings**

Edit `src/lib/voiceCoach.ts`:

```typescript
const emotionSettings: Record<EmotionType, VoiceSettings> = {
  encouraging: { stability: 0.6, similarity_boost: 0.8 },
  teaching: { stability: 0.7, similarity_boost: 0.75 },
  // Add your own emotions...
  motivating: { stability: 0.5, similarity_boost: 0.85 },
};
```

### **Custom Messages**

Edit `src/components/ai/AICoachWithVoice.tsx`:

```typescript
const handleGetHint = () => {
  const hints = [
    "Your custom hint 1...",
    "Your custom hint 2...",
    // Add more hints
  ];
  // ...
};
```

### **Custom Styling**

The coach uses Tailwind CSS. Customize colors:

```tsx
<div className="bg-gray-900">  {/* Change background */}
  {/* ... */}
</div>
```

---

## 🔧 **Configuration**

### **.env.local**

```bash
# Already added:
NEXT_PUBLIC_ELEVENLABS_API_KEY=sk_2a8f0960d0208b1530971cec2247c779c5794989deb4987f
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=Cz0K1kOv9tD8l0b5Qu53
```

### **Voice Settings**

- **Stability**: 0.5-0.7 (higher = more consistent)
- **Similarity Boost**: 0.7-0.9 (higher = more similar to original voice)

---

## 📊 **Coach Behavior**

### **Automatic Messages:**

1. **Welcome** (on mount):
   > "Hey! I'm Coach Alex, your AI coding companion..."

2. **Problem Change** (when `currentProblem` changes):
   > "Perfect! Let's work on 'Problem Title'..."

3. **Start Coding** (when `userCode` length > 50):
   > "Nice! You're diving into the code..."

4. **Stuck Detection** (>90s idle):
   > "I notice you've been thinking for a bit..."

### **Manual Actions:**

1. **Get Hint** - Progressive hints (4 levels)
2. **Explain Pattern** - Concept teaching
3. **I Got It!** - Celebration message

---

## 🎯 **Best Practices**

### **1. Pass User Code for Activity Tracking:**

```tsx
<AICoachWithVoice 
  userCode={code}  // ✅ Pass code to track activity
/>
```

### **2. Update Problem Title:**

```tsx
useEffect(() => {
  setCurrentProblem(lesson.title);
}, [lesson.title]);
```

### **3. Track Coach Actions:**

```tsx
<AICoachWithVoice 
  onHintRequest={() => analytics.track('hint_requested')}
  onConceptExplain={() => analytics.track('concept_explained')}
/>
```

### **4. Start with Voice Disabled, Let User Enable:**

```tsx
<AICoachWithVoice 
  enableVoice={false}  // User can enable via toggle button
/>
```

---

## 🚀 **Quick Integration Checklist**

- [ ] Import `AICoach` or `AICoachWithVoice`
- [ ] Add to your lesson/problem page
- [ ] Pass `currentProblem` prop
- [ ] Pass `userCode` prop for activity tracking
- [ ] Optional: Add callbacks for analytics
- [ ] Optional: Enable voice coaching
- [ ] Test on a problem page
- [ ] Verify voice works (if enabled)

---

## 📖 **Example Full Page**

```tsx
'use client';

import { useState, useEffect } from 'react';
import AICoachWithVoice from '@/components/ai/AICoachWithVoice';
import CodeEditor from '@/components/editor/CodeEditor';
import ProblemDescription from '@/components/lesson/ProblemDescription';

export default function CodingProblemPage() {
  const [code, setCode] = useState('');
  const [currentProblem, setCurrentProblem] = useState('Two Sum');
  
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left: Problem Description */}
      <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
        <ProblemDescription problem={currentProblem} />
      </div>
      
      {/* Center: Code Editor */}
      <div className="flex-1 flex flex-col">
        <CodeEditor 
          value={code}
          onChange={setCode}
          language="python"
        />
        <div className="p-4 border-t border-gray-700">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
            Run Tests
          </button>
        </div>
      </div>
      
      {/* Right: AI Coach */}
      <div className="w-96">
        <AICoachWithVoice 
          currentProblem={currentProblem}
          userCode={code}
          enableVoice={true}
          onHintRequest={() => console.log('Hint requested')}
          onConceptExplain={() => console.log('Concept explained')}
        />
      </div>
    </div>
  );
}
```

---

## 🎓 **Coach Personality**

**"Coach Alex"** is:
- Encouraging but professional
- Patient but keeps you moving
- Teaches concepts, not just answers
- Celebrates wins genuinely
- Supportive when stuck

**Example Messages:**
- Encouraging: "Nice! You're taking action. Keep going!"
- Teaching: "Let me explain the core concept..."
- Hint: "Think about what pattern this fits into..."
- Celebrating: "Excellent! You nailed it!"

---

## 🔊 **Voice Features**

### **ElevenLabs Integration:**
- Professional interviewer voice
- Emotion-based tone adjustment
- Smooth audio playback
- Toggle on/off anytime

### **Emotion Types:**
- `encouraging` - Warm, supportive
- `teaching` - Clear, educational
- `celebrating` - Excited, enthusiastic
- `gentle_nudge` - Patient, helpful
- `neutral` - Balanced, informative

---

## 📁 **Files Added**

```
grokking/
├── src/
│   ├── components/
│   │   └── ai/
│   │       ├── AICoach.tsx              # Text-only coach
│   │       └── AICoachWithVoice.tsx     # Voice-enabled coach
│   └── lib/
│       └── voiceCoach.ts                # Voice service
├── .env.local                            # Updated with API keys
└── AI_COACH_INTEGRATION.md              # This file
```

---

## 🎯 **Next Steps**

1. **Test the coach:**
   - Add to a lesson page
   - Verify messages appear
   - Test hint functionality
   - Enable voice and test audio

2. **Customize:**
   - Adjust messages
   - Change voice settings
   - Modify styling

3. **Integrate everywhere:**
   - Add to all problem pages
   - Add to lesson pages
   - Add to practice sessions

4. **Track analytics:**
   - Hint usage
   - Concept requests
   - Session duration
   - User progress

---

## ⚡ **Quick Test**

**1. Add to any page:**
```tsx
import AICoachWithVoice from '@/components/ai/AICoachWithVoice';

// In your component:
<AICoachWithVoice currentProblem="Test Problem" />
```

**2. Run dev server:**
```bash
npm run dev
```

**3. Visit the page and see Coach Alex welcome you!**

---

**🎓 Your AI coach is ready! Students will love it!** 🚀

---
name: video-generation
description: >
  Use when generating Remotion video content for Samsara.ai lessons. Handles narration
  scripting via Moonshot API, TTS audio generation, SadTalker/Wav2Lip avatar creation,
  Remotion composition, and integration into lesson/course structures. Produces video
  for every lesson type: concept explainer, code walkthrough, source analysis, case study.
type: skill
trigger: Creating video content for a lesson, batch generating videos for a course, setting up Remotion pipeline
version: "1.0.0"
author: Samsara.ai
platform: samsara
depends_on:
  - lesson-planning    # Lesson content must exist before video is created
  - course-planning    # Course structure determines which lessons get videos
  - content-embedding  # Video metadata is embedded for search/recommendations
inputs:
  - Lesson content (markdown from lesson-planning skill)
  - Course domain and variation (from course-planning skill)
  - Voice persona assignment (from course-planning skill)
outputs:
  - Narration script (text with timing markers)
  - TTS audio file (MP3)
  - Avatar video (MP4 via SadTalker/Wav2Lip)
  - Remotion composition (React component + render config)
  - Final video (MP4, 1080p, 3-5 minutes)
---

# Video Generation Skill

You are a video production agent for Samsara.ai. Your job is to transform lesson
content into professional educational videos using Remotion, Moonshot API for
narration, and SadTalker/Wav2Lip for AI avatars.

## Core Principle

Videos EXPLAIN — they never just read the lesson text. A video should feel like a
1-on-1 tutoring session with a knowledgeable teacher, not a screen recording of
someone reading slides.

---

## Step 0: Determine Video Eligibility

Not every lesson gets a video. Check the rules from course-planning:

```yaml
video_rules:
  beginner_courses:
    - Every module intro lesson → concept_explainer
    - Every coding exercise → code_walkthrough
    - Source analysis lessons → source_analysis
    - Case study lessons → case_study
    - Skip: checkpoint quizzes, pure exercises
    - Coverage: ~60-70% of lessons

  advanced_courses:
    - Module intro lessons → concept_explainer
    - Complex theory → source_analysis or concept_explainer
    - Skip: exercises, checkpoints, straightforward lessons
    - Coverage: ~30-40% of lessons

  never_generate_video_for:
    - Checkpoint quiz lessons
    - Lessons shorter than 500 words
    - Pure exercise-only lessons (no explanation content)
```

---

## Step 1: Generate Narration Script (Moonshot API)

### Narration Prompt by Video Type

#### Type A: Concept Explainer

```typescript
const narrationPrompt = {
  model: 'kimi-k2-turbo-preview',
  messages: [{
    role: 'system',
    content: `You are ${voicePersona}, creating a ${targetMinutes}-minute concept
explainer video for "${lessonTitle}" in the ${domain} domain.

STRUCTURE:
1. Hook (10 seconds): Start with a compelling question or surprising fact
2. Core Concept (${Math.floor(targetMinutes * 0.5)} min): Explain the main idea
   - Use analogies for beginner level
   - Use precise terminology for advanced level
3. Visual Examples (${Math.floor(targetMinutes * 0.3)} min): Walk through examples
   - Mark each visual with [SHOW: description of what should appear]
4. Key Takeaway (15 seconds): One sentence summary
5. Call to Action (10 seconds): Point to the exercise

MARKERS:
- [PAUSE] — insert a 1-second pause
- [SHOW: code block] — display code on screen
- [SHOW: diagram of X] — display diagram
- [SHOW: quote "text" — Author] — display quoted text
- [SHOW: table with columns X, Y, Z] — display data table
- [SHOW: bullet list: item1, item2, item3] — display bullet points

VOICE RULES:
- Conversational tone, NOT reading
- ~150 words per minute
- Target: ${targetMinutes * 150} words total
- Natural speech patterns with "so", "now", "notice how"
- Ask rhetorical questions to keep engagement`
  }, {
    role: 'user',
    content: `Create narration for this lesson:\n\n${lessonContent.slice(0, 4000)}`
  }],
  temperature: 0.7,
  max_tokens: targetMinutes * 250,
};
```

#### Type B: Code Walkthrough

```typescript
const codeWalkthroughPrompt = {
  // ... same structure but system prompt adds:
  content: `...
CODE-SPECIFIC RULES:
- Narrate what each line does as it appears: "First, we define a function called..."
- Highlight key patterns: "Notice the ${concept} pattern here — this is important because..."
- Point out common mistakes: "A lot of beginners make the mistake of..."
- Mark code display with [SHOW: code] and use [HIGHLIGHT: line 3-5] for emphasis
- After showing code, explain the output: [SHOW: output "expected result"]
- End with: "Now try modifying this code in the exercise below"
  `
};
```

#### Type C: Source Analysis (Religious Studies / Philosophy)

```typescript
const sourceAnalysisPrompt = {
  content: `...
SOURCE-SPECIFIC RULES:
- Display the primary text on screen: [SHOW: quote "Surah Al-Baqarah 2:255..." — Quran]
- Read the source aloud slowly, then explain
- Use original language terms with pronunciation: "The Arabic word 'taqwa' (تقوى) means..."
- Present the tradition's own interpretation FIRST
- Then academic perspective: "Scholar ${name} argues that..."
- Include cultural context: "In the ${century} century, when this was written..."
- Be respectful and accurate — never reduce tradition to soundbites
  `
};
```

#### Type D: Case Study (Finance / Political Strategy)

```typescript
const caseStudyPrompt = {
  content: `...
CASE-SPECIFIC RULES:
- Start with the story: "In ${year}, ${company/country} faced..."
- Display data as it's discussed: [SHOW: table Revenue 2020-2023]
- Build narrative tension: "The question was: should they..."
- Present the framework AFTER the story hooks them
- Use real numbers: "Revenue dropped 23% from $4.2B to $3.2B"
- End with the actual outcome and lessons learned
  `
};
```

### Making the API Call

```typescript
// src/scripts/generate-narration.ts

async function generateNarration(
  lessonContent: string,
  videoType: VideoType,
  persona: string,
  targetMinutes: number,
  domain: string,
): Promise<string> {
  const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY;

  const prompt = buildNarrationPrompt(videoType, {
    lessonContent,
    persona,
    targetMinutes,
    domain,
  });

  const resp = await fetch('https://api.moonshot.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify(prompt),
  });

  const data = await resp.json();
  return data.choices[0].message.content;
}

// Parse [SHOW:] markers for Remotion
function parseShowMarkers(narration: string): ShowMarker[] {
  const markers: ShowMarker[] = [];
  const regex = /\[SHOW:\s*(.+?)\]/g;
  let match;
  let wordCount = 0;

  const words = narration.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.startsWith('[SHOW:')) {
      // Find full marker
      let markerText = '';
      while (i < words.length && !words[i].endsWith(']')) {
        markerText += words[i] + ' ';
        i++;
      }
      markerText += words[i];

      const content = markerText.replace(/\[SHOW:\s*/, '').replace(/\]$/, '');
      const frameStart = Math.floor((wordCount / 150) * 60 * 30); // 150 wpm, 30fps
      markers.push({
        type: content.startsWith('code') ? 'code' :
              content.startsWith('quote') ? 'quote' :
              content.startsWith('table') ? 'table' :
              content.startsWith('bullet') ? 'bullets' : 'text',
        content: content,
        frameStart,
        duration: 30 * 8, // 8 seconds default
      });
    } else {
      wordCount++;
    }
  }

  return markers;
}
```

---

## Step 2: Generate TTS Audio

```typescript
// src/scripts/generate-tts.ts

async function generateTTSAudio(
  narrationText: string,
  language: string,
): Promise<Buffer> {
  // Strip markers for TTS
  const cleanText = narrationText
    .replace(/\[SHOW:[^\]]+\]/g, '')     // Remove [SHOW:] markers
    .replace(/\[HIGHLIGHT:[^\]]+\]/g, '') // Remove [HIGHLIGHT:] markers
    .replace(/\[PAUSE\]/g, '...')         // Convert [PAUSE] to natural pause
    .replace(/\s+/g, ' ')
    .trim();

  const SARVAM_LANGUAGES = ['hi', 'pa'];

  if (SARVAM_LANGUAGES.includes(language)) {
    // Sarvam TTS
    const resp = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': process.env.SARVAM_API_KEY!,
      },
      body: JSON.stringify({
        text: cleanText,
        target_language_code: language === 'hi' ? 'hi-IN' : 'pa-IN',
        speaker: language === 'hi' ? 'priya' : 'simran',
        model: 'bulbul:v3',
        pace: 1.0,
        speech_sample_rate: 22050,
        output_audio_codec: 'mp3',
      }),
    });

    const data = await resp.json();
    return Buffer.from(data.audios[0], 'base64');
  } else {
    // Deepgram TTS
    const voices: Record<string, string> = {
      en: 'aura-2-thalia-en', es: 'aura-2-diana-es',
      fr: 'aura-2-agathe-fr', de: 'aura-2-viktoria-de',
      it: 'aura-2-livia-it',  nl: 'aura-2-rhea-nl',
      ja: 'aura-2-izanami-ja',
    };
    const voice = voices[language] || 'aura-2-thalia-en';

    const resp = await fetch(
      `https://api.deepgram.com/v1/speak?model=${voice}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        },
        body: JSON.stringify({ text: cleanText }),
      }
    );

    return Buffer.from(await resp.arrayBuffer());
  }
}
```

---

## Step 3: Generate Avatar Video (SadTalker)

```yaml
sadtalker_setup:
  # One-time setup on VPS
  install:
    - "git clone https://github.com/OpenTalker/SadTalker.git"
    - "cd SadTalker && pip install -r requirements.txt"
    - "bash scripts/download_models.sh"

  # Avatar reference images (stored in assets/avatars/)
  avatars:
    default_male: "assets/avatars/professional-male.png"
    default_female: "assets/avatars/professional-female.png"
    scholar_male: "assets/avatars/scholar-male.png"
    scholar_female: "assets/avatars/scholar-female.png"
    # Users can select from these or upload custom

  # Persona → Avatar mapping
  persona_avatar_map:
    "Coach Alex": "professional-male.png"
    "Coach Morgan": "professional-female.png"
    "Professor Sophia": "scholar-female.png"
    "Director Chen": "professional-male.png"
    "Dr. Amara": "professional-female.png"
    "Ustadh Ibrahim": "scholar-male.png"
    "Murabbi Tariq": "scholar-male.png"
    "Professor Grace": "scholar-female.png"
    "Rabbi Levi": "scholar-male.png"
    "Ajahn Bodhi": "scholar-male.png"
    "Pandit Arjun": "scholar-male.png"
    "Bhai Sahib Harpreet": "scholar-male.png"
    "Master Wei": "scholar-male.png"
    "Professor Chen": "scholar-male.png"
    "Sheikh Rumi": "scholar-male.png"

generation_command: |
  python inference.py \
    --driven_audio output/audio/{lesson_id}.mp3 \
    --source_image assets/avatars/{avatar_file} \
    --enhancer gfpgan \
    --result_dir output/avatars/{lesson_id}/ \
    --still \
    --preprocess crop \
    --batch_size 2

# For Wav2Lip alternative (faster, lower quality):
wav2lip_command: |
  python inference.py \
    --checkpoint_path checkpoints/wav2lip_gan.pth \
    --face assets/avatars/{avatar_file} \
    --audio output/audio/{lesson_id}.mp3 \
    --outfile output/avatars/{lesson_id}/avatar.mp4

# API wrapper for remote execution (deploy on VPS):
api_endpoint: |
  # vps/sadtalker-api.py
  from fastapi import FastAPI, UploadFile
  import subprocess, tempfile, os

  app = FastAPI()

  @app.post("/generate-avatar")
  async def generate(audio: UploadFile, avatar_id: str = "professional-male"):
      with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
          f.write(await audio.read())
          audio_path = f.name

      avatar_path = f"assets/avatars/{avatar_id}.png"
      output_dir = tempfile.mkdtemp()

      subprocess.run([
          "python", "inference.py",
          "--driven_audio", audio_path,
          "--source_image", avatar_path,
          "--enhancer", "gfpgan",
          "--result_dir", output_dir,
          "--still", "--preprocess", "crop",
      ], check=True)

      # Find output video
      for f in os.listdir(output_dir):
          if f.endswith(".mp4"):
              return FileResponse(os.path.join(output_dir, f))
```

---

## Step 4: Remotion Composition

### Project Setup

```bash
# First-time Remotion setup
npx create-video@latest src/remotion --template blank
cd src/remotion
npm install @remotion/player @remotion/renderer
```

### Composition Component

```typescript
// src/remotion/compositions/LessonVideo.tsx
import React from 'react';
import {
  AbsoluteFill, Sequence, OffthreadVideo, Audio,
  useCurrentFrame, useVideoConfig, interpolate, spring,
} from 'remotion';

interface ShowMarker {
  type: 'code' | 'quote' | 'table' | 'bullets' | 'text';
  content: string;
  frameStart: number;
  duration: number;
}

interface LessonVideoProps {
  lessonId: string;
  lessonTitle: string;
  avatarVideoSrc: string;
  narrationAudioSrc: string;
  showMarkers: ShowMarker[];
  videoType: 'concept_explainer' | 'code_walkthrough' | 'source_analysis' | 'case_study';
  domainTheme: string;
  subtitles: Array<{ text: string; from: number; to: number }>;
}

const DOMAIN_THEMES: Record<string, { bg: string; accent: string }> = {
  'computer-science':  { bg: '#0d1117', accent: '#58a6ff' },
  'finance-business':  { bg: '#0a192f', accent: '#64ffda' },
  'economics':         { bg: '#1a1a0a', accent: '#ffd700' },
  'religious-studies':  { bg: '#1a0a2e', accent: '#d4a5ff' },
  'philosophy':        { bg: '#0a1a0f', accent: '#7ee8a0' },
  'political-strategy':{ bg: '#1a1a1a', accent: '#ff6b6b' },
  'health-wellness':   { bg: '#0a1f0a', accent: '#4ade80' },
};

export const LessonVideo: React.FC<LessonVideoProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = DOMAIN_THEMES[props.domainTheme] || DOMAIN_THEMES['computer-science'];

  // Title card animation (first 5 seconds)
  const titleOpacity = interpolate(frame, [0, 30, fps * 4, fps * 5], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Background gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 30% 50%, ${theme.accent}08, transparent 70%)`,
      }} />

      {/* Title card */}
      {frame < fps * 5 && (
        <AbsoluteFill style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: titleOpacity,
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: 'white', fontSize: 52, fontWeight: 700 }}>
              {props.lessonTitle}
            </h1>
            <div style={{ color: theme.accent, fontSize: 20, marginTop: 16 }}>
              Samsara.ai
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Content area — show markers */}
      <div style={{
        position: 'absolute', top: 60, left: 60,
        width: '62%', height: '80%',
      }}>
        {props.showMarkers.map((marker, i) => (
          <Sequence key={i} from={marker.frameStart} durationInFrames={marker.duration}>
            <ContentBlock marker={marker} theme={theme} />
          </Sequence>
        ))}
      </div>

      {/* Avatar video (bottom-right) */}
      <Sequence from={fps * 2}>
        <div style={{
          position: 'absolute', bottom: 30, right: 30,
          width: '22%', borderRadius: 16, overflow: 'hidden',
          boxShadow: `0 0 30px ${theme.accent}20`,
        }}>
          <OffthreadVideo src={props.avatarVideoSrc} />
        </div>
      </Sequence>

      {/* Subtitles */}
      {props.subtitles.map((sub, i) => (
        <Sequence key={i} from={sub.from} durationInFrames={sub.to - sub.from}>
          <div style={{
            position: 'absolute', bottom: 40, left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '8px 20px', borderRadius: 8,
            maxWidth: '60%',
          }}>
            <span style={{ color: 'white', fontSize: 18 }}>{sub.text}</span>
          </div>
        </Sequence>
      ))}

      {/* Branding watermark */}
      <div style={{
        position: 'absolute', top: 20, right: 20,
        opacity: 0.12, color: 'white', fontSize: 14,
      }}>
        Samsara.ai
      </div>

      {/* Narration audio */}
      <Audio src={props.narrationAudioSrc} />
    </AbsoluteFill>
  );
};

// Content block renderer
const ContentBlock: React.FC<{ marker: ShowMarker; theme: { accent: string } }> = ({
  marker, theme,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const styles: React.CSSProperties = {
    opacity,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderLeft: `3px solid ${theme.accent}`,
    padding: 24,
    borderRadius: 8,
    marginBottom: 16,
  };

  switch (marker.type) {
    case 'code':
      return (
        <div style={{ ...styles, fontFamily: 'monospace', fontSize: 16 }}>
          <pre style={{ color: '#e6e6e6', whiteSpace: 'pre-wrap' }}>
            {marker.content}
          </pre>
        </div>
      );
    case 'quote':
      return (
        <div style={{ ...styles, fontStyle: 'italic', fontSize: 22, color: '#e6e6e6' }}>
          "{marker.content}"
        </div>
      );
    default:
      return (
        <div style={{ ...styles, fontSize: 20, color: '#e6e6e6' }}>
          {marker.content}
        </div>
      );
  }
};
```

### Render Pipeline

```typescript
// src/scripts/render-video.ts
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

async function renderLessonVideo(props: LessonVideoProps): Promise<string> {
  // Bundle the Remotion project
  const bundled = await bundle({
    entryPoint: resolve(__dirname, '../remotion/index.ts'),
  });

  // Select composition
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'LessonVideo',
    inputProps: props,
  });

  // Render
  const outputPath = `output/videos/${props.lessonId}.mp4`;
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: props,
  });

  return outputPath;
}
```

---

## Step 5: Integration into Lesson/Course Structure

### Where Videos Live

```yaml
video_storage:
  development: output/videos/{lesson_id}.mp4 (local)
  production: CDN or Supabase Storage bucket "lesson-videos"
  url_pattern: /api/videos/{lesson_id} or CDN URL

lesson_page_integration:
  # In LessonPage.tsx, check for video availability:
  component: |
    {lesson.hasVideo && (
      <div className="mb-6">
        <video
          src={`/api/videos/${lesson.id}`}
          controls
          className="w-full rounded-xl"
          poster={`/api/videos/${lesson.id}/thumbnail`}
        />
        <p className="text-sm text-slate-500 mt-2">
          Watch the video explanation, then try the exercise below.
        </p>
      </div>
    )}
```

### Batch Generation for a Course

```typescript
// src/scripts/batch-generate-videos.ts

async function generateCourseVideos(courseId: string) {
  const course = getCourseById(courseId);
  const videoPlan = getVideoAssignment(course); // From course-planning skill

  for (const module of course.modules) {
    for (let i = 0; i < module.lessons.length; i++) {
      const lesson = module.lessons[i];
      if (!videoPlan[lesson.id]) continue; // Skip non-video lessons

      console.log(`Generating video for: ${lesson.title}`);

      // Step 1: Narration
      const narration = await generateNarration(
        lesson.content, videoPlan[lesson.id].type,
        videoPlan[lesson.id].persona, 4, course.domain
      );

      // Step 2: TTS
      const audio = await generateTTSAudio(narration, 'en');
      writeFileSync(`output/audio/${lesson.id}.mp3`, audio);

      // Step 3: Avatar (via VPS API)
      const avatarResp = await fetch(`${VPS_URL}/generate-avatar`, {
        method: 'POST',
        body: createFormData(audio, videoPlan[lesson.id].avatar),
      });
      const avatarVideo = await avatarResp.buffer();
      writeFileSync(`output/avatars/${lesson.id}/avatar.mp4`, avatarVideo);

      // Step 4: Parse markers + render
      const markers = parseShowMarkers(narration);
      const subtitles = generateSubtitles(narration);
      await renderLessonVideo({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        avatarVideoSrc: `output/avatars/${lesson.id}/avatar.mp4`,
        narrationAudioSrc: `output/audio/${lesson.id}.mp3`,
        showMarkers: markers,
        videoType: videoPlan[lesson.id].type,
        domainTheme: course.domain,
        subtitles,
      });

      console.log(`✓ Video ready: output/videos/${lesson.id}.mp4`);
    }
  }
}
```

---

## Step 6: Quality Checklist

- [ ] Narration is conversational, not reading lesson text
- [ ] All [SHOW:] markers have matching Remotion content blocks
- [ ] TTS audio is clear and natural-paced
- [ ] Avatar lip sync matches audio (SadTalker quality check)
- [ ] Video duration is within target (3-5 minutes)
- [ ] Domain theme colors match the course
- [ ] Subtitles are readable (font size, background contrast)
- [ ] Samsara.ai watermark present but unobtrusive
- [ ] No copyright-infringing content in visuals
- [ ] Health videos include disclaimer at start
- [ ] Religious videos are respectful and accurate
- [ ] Code in videos compiles/runs correctly

---

## Anti-Patterns

- **DO NOT** read lesson text verbatim in narration — explain it differently
- **DO NOT** generate videos longer than 7 minutes — split into parts
- **DO NOT** use copyrighted music or images
- **DO NOT** render videos without checking avatar quality first
- **DO NOT** skip the subtitle generation — accessibility matters
- **DO NOT** hardcode file paths — use lesson ID-based naming
- **DO NOT** generate videos for checkpoint quizzes

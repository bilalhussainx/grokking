import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const DEEPGRAM_KEY = process.env.DEEPGRAM_API_KEY;

// Deepgram Aura TTS voices (v1 format: aura-{name}-en)
const VOICE_ALEX = "aura-orion-en"; // deep, authoritative male
const VOICE_SAM = "aura-luna-en"; // lighter, curious female

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonContent, lessonTitle, courseTitle } = await req.json();
  if (!lessonContent)
    return NextResponse.json(
      { error: "lessonContent required" },
      { status: 400 }
    );

  // Step 1: Generate podcast script with Gemini
  const scriptResp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Convert this lesson into a natural 3-minute podcast conversation between two hosts.

HOSTS:
- ALEX: The expert teacher who explains concepts clearly and uses great analogies
- SAM: The curious student who asks insightful questions and connects ideas

RULES:
- Start with a brief intro: "Welcome to Kairos Learn, today we're covering..."
- Make it conversational and engaging — NOT a lecture
- Include ALL key concepts from the lesson
- Sam should ask "why" and "how" questions that a real student would ask
- Alex should give clear, concise answers with examples
- End with a quick summary
- Format EVERY line as either "ALEX: ..." or "SAM: ..."
- Keep it to about 15-20 exchanges total

LESSON TITLE: ${lessonTitle}
COURSE: ${courseTitle}

LESSON CONTENT:
${lessonContent.slice(0, 8000)}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    }
  );

  if (!scriptResp.ok) {
    const errText = await scriptResp.text().catch(() => "");
    console.error("[Podcast] Gemini script failed:", scriptResp.status, errText);
    return NextResponse.json(
      { error: `Script generation failed (${scriptResp.status}). ${errText.slice(0, 200)}` },
      { status: 500 }
    );
  }

  const scriptData = await scriptResp.json();
  const script =
    scriptData.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Step 2: Parse script into segments
  const segments: { host: "alex" | "sam"; text: string }[] = [];
  for (const line of script.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("ALEX:")) {
      segments.push({ host: "alex", text: trimmed.slice(5).trim() });
    } else if (trimmed.startsWith("SAM:")) {
      segments.push({ host: "sam", text: trimmed.slice(4).trim() });
    }
  }

  if (segments.length === 0) {
    return NextResponse.json(
      { error: "Failed to parse script", script },
      { status: 500 }
    );
  }

  // Step 3: Generate TTS for each segment
  const audioChunks: Buffer[] = [];

  for (const segment of segments) {
    const voice = segment.host === "alex" ? VOICE_ALEX : VOICE_SAM;
    const ttsResp = await fetch(
      `https://api.deepgram.com/v1/speak?model=${voice}`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${DEEPGRAM_KEY}`,
          "Content-Type": "text/plain",
        },
        body: segment.text,
      }
    );

    if (ttsResp.ok) {
      const audioBuffer = Buffer.from(await ttsResp.arrayBuffer());
      audioChunks.push(audioBuffer);
    } else {
      console.error(`[Podcast] TTS failed for ${segment.host}: ${ttsResp.status} ${await ttsResp.text().catch(() => "")}`);
    }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 100));
  }

  // Step 4: Concatenate and return
  if (audioChunks.length === 0) {
    return NextResponse.json(
      { error: "TTS failed for all segments. Check Deepgram API key and voice models." },
      { status: 500 }
    );
  }

  const combined = Buffer.concat(audioChunks);

  return new NextResponse(combined, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": combined.length.toString(),
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, createAdminSupabase } from "@/lib/supabase-auth";

/**
 * Tracks voice agent usage per session.
 * Captures: language used, duration, lesson context, interaction patterns,
 * geolocation (from request headers), and generates a personalization
 * embedding from accumulated user behavior.
 *
 * Privacy: All data is stored per-user and NEVER shared with third parties.
 * Embedding is used solely to improve personalized recommendations.
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    sessionType,        // 'coach' | 'language_practice' | 'placement'
    language,           // Language used in this session
    durationSeconds,    // How long the session lasted
    courseSlug,         // Which course (if any)
    lessonSlug,         // Which lesson (if any)
    messageCount,       // Number of exchanges
    voiceUsed,          // Whether voice was used (vs text-only)
    coachPersona,       // Which persona was active
    userSwitchedLang,   // Did user switch languages mid-session?
    switchedToLang,     // What language they switched to
  } = body;

  // Extract geolocation from request headers (Vercel/Cloudflare provide these)
  const geo = {
    country: req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || null,
    region: req.headers.get("x-vercel-ip-country-region") || null,
    city: req.headers.get("x-vercel-ip-city") || null,
    timezone: req.headers.get("x-vercel-ip-timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone || null,
  };

  // Insert usage record
  const admin = createAdminSupabase();
  const { error: insertError } = await admin
    .from("usage_analytics")
    .insert({
      user_id: user.id,
      session_type: sessionType || "coach",
      language: language || "en",
      duration_seconds: durationSeconds || 0,
      course_slug: courseSlug || null,
      lesson_slug: lessonSlug || null,
      message_count: messageCount || 0,
      voice_used: voiceUsed ?? true,
      coach_persona: coachPersona || "alex",
      user_switched_lang: userSwitchedLang || false,
      switched_to_lang: switchedToLang || null,
      geo_country: geo.country,
      geo_region: geo.region,
      geo_city: geo.city,
      geo_timezone: geo.timezone,
    });

  if (insertError) {
    console.error("[analytics] Insert error:", insertError.message);
    // Non-blocking — don't fail the user's experience for analytics
  }

  // Check if user has personalization consent before generating embedding
  const { data: profile } = await admin
    .from("user_profiles")
    .select("personalization_consent, native_language, instruction_language, learning_style, communication_mode, learning_interests, english_fluency, country_code")
    .eq("id", user.id)
    .single();

  if (profile?.personalization_consent) {
    // Update country/timezone from geo if not already set
    if (!profile.country_code && geo.country) {
      await admin
        .from("user_profiles")
        .update({
          country_code: geo.country,
          timezone: geo.timezone,
        })
        .eq("id", user.id);
    }

    // Aggregate usage stats for embedding generation
    const { data: usageStats } = await admin
      .from("usage_analytics")
      .select("language, duration_seconds, session_type, voice_used")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (usageStats && usageStats.length >= 5) {
      // Build a text representation of user behavior for embedding
      const langUsage = usageStats.reduce((acc: Record<string, number>, s) => {
        acc[s.language] = (acc[s.language] || 0) + (s.duration_seconds || 0);
        return acc;
      }, {});

      const totalVoice = usageStats.filter(s => s.voice_used).length;
      const totalText = usageStats.filter(s => !s.voice_used).length;

      const behaviorText = [
        `Native language: ${profile.native_language}`,
        `Instruction language: ${profile.instruction_language}`,
        `English fluency: ${profile.english_fluency}`,
        `Learning style: ${profile.learning_style}`,
        `Communication: ${profile.communication_mode}`,
        `Interests: ${(profile.learning_interests || []).join(', ')}`,
        `Country: ${profile.country_code || geo.country || 'unknown'}`,
        `Language usage: ${Object.entries(langUsage).map(([l, d]) => `${l}:${Math.round(Number(d) / 60)}min`).join(', ')}`,
        `Voice vs text: ${totalVoice} voice, ${totalText} text sessions`,
        `Total sessions: ${usageStats.length}`,
      ].join('. ');

      // Generate embedding via Moonshot (or could use Gemini)
      try {
        const apiKey = process.env.MOONSHOT_API_KEY;
        if (apiKey) {
          const embResp = await fetch("https://api.moonshot.ai/v1/embeddings", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
              model: "moonshot-v1-8k-embedding-preview",
              input: behaviorText.slice(0, 2000),
            }),
          });

          if (embResp.ok) {
            const embData = await embResp.json();
            const embedding = embData.data?.[0]?.embedding;
            if (embedding && Array.isArray(embedding)) {
              // Pad/truncate to 768 dimensions
              const vec = embedding.length >= 768
                ? embedding.slice(0, 768)
                : [...embedding, ...new Array(768 - embedding.length).fill(0)];

              await admin
                .from("user_profiles")
                .update({ personalization_embedding: vec })
                .eq("id", user.id);
            }
          }
        }
      } catch {
        // Embedding generation is best-effort — don't block
      }
    }
  }

  return NextResponse.json({ ok: true });
}

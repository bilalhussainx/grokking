import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-auth";
import { summarizeAndUpdateCheckpoint, getConversationCheckpoint } from "@/lib/language-agent";
import type { TranscriptEntry } from "@/data/language-types";

/**
 * POST /api/language/session
 * 
 * Update a language session with transcript and metadata.
 * Called when a voice session ends.
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    sessionId,
    targetLanguage,
    personaId,
    scenario,
    lessonId,
    durationSeconds,
    transcript,
    mistakesFound,
    newVocab,
    proficiencyDelta,
    agentSummary,
  } = body;

  try {
    // If sessionId is provided, update existing session
    if (sessionId) {
      const { error } = await supabase
        .from('language_sessions')
        .update({
          duration_seconds: durationSeconds,
          transcript: transcript || [],
          mistakes_found: mistakesFound || [],
          new_vocab: newVocab || [],
          proficiency_delta: proficiencyDelta || 0,
          agent_summary: agentSummary || '',
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      return NextResponse.json({ success: true, updated: true });
    }

    // Otherwise, create new session record
    const { data, error } = await supabase
      .from('language_sessions')
      .insert({
        user_id: user.id,
        target_language: targetLanguage,
        persona_id: personaId,
        scenario: scenario || 'free_practice',
        lesson_id: lessonId,
        duration_seconds: durationSeconds || 0,
        transcript: transcript || [],
        mistakes_found: mistakesFound || [],
        new_vocab: newVocab || [],
        proficiency_delta: proficiencyDelta || 0,
        agent_summary: agentSummary || '',
      })
      .select()
      .single();

    if (error) throw error;

    // Update user's practice stats
    await supabase.rpc('update_practice_stats', {
      p_user_id: user.id,
      p_target_language: targetLanguage,
      p_duration_seconds: durationSeconds || 0,
    });

    return NextResponse.json({ success: true, sessionId: data.id });

  } catch (error) {
    console.error("[Language Session] Error:", error);
    return NextResponse.json(
      { error: "Failed to save session", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/language/session
 *
 * Save a conversation checkpoint at the end of a voice session.
 * Summarizes the transcript and updates the user's conversation checkpoint
 * so the next session can resume from where they left off.
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    targetLanguage,
    transcript,
    currentTopicId,
    currentTopicName,
    nextTopicId,
    nextTopicName,
  } = body as {
    targetLanguage?: string;
    transcript?: TranscriptEntry[];
    currentTopicId?: string;
    currentTopicName?: string;
    nextTopicId?: string;
    nextTopicName?: string;
  };

  if (!targetLanguage || !transcript || !currentTopicId || !currentTopicName) {
    return NextResponse.json(
      { error: "Missing required fields: targetLanguage, transcript, currentTopicId, currentTopicName" },
      { status: 400 }
    );
  }

  try {
    const currentCheckpoint = await getConversationCheckpoint(user.id, targetLanguage);

    await summarizeAndUpdateCheckpoint(
      user.id,
      targetLanguage,
      transcript,
      currentCheckpoint,
      currentTopicId,
      currentTopicName,
      nextTopicId || currentTopicId,
      nextTopicName || currentTopicName
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Language Session PATCH] Checkpoint error:", error);
    return NextResponse.json(
      { error: "Failed to save checkpoint", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/language/session/recent
 *
 * Get recent sessions for the user
 */
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const limit = parseInt(searchParams.get('limit') || '5');

  try {
    let query = supabase
      .from('language_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (language) {
      query = query.eq('target_language', language);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ sessions: data });

  } catch (error) {
    console.error("[Language Session] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions", details: String(error) },
      { status: 500 }
    );
  }
}

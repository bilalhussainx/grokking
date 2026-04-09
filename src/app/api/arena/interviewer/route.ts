import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { authorizeRoomAccess } from '@/lib/arena-auth';
import { getPersona } from '@/lib/arena-personas';
import { emitScoreEvent, SCORE_VALUES } from '@/lib/arena-scoring';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/** Sanitize user-supplied participant message before prompt interpolation. */
function sanitizeParticipantMessage(msg: string): string {
  return msg
    .replace(/[\[\]"\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);
}

// POST /api/arena/interviewer — generate an interviewer response via OpenRouter
// Body: {
//   roomId, personaId, trigger,
//   context?: { recentCode, recentTerminalOutput, lastCommitMessage, previewUrl,
//               lastCellSource, lastCellOutput, notebookSnapshot },
//   participantMessage?
// }
export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('[arena/interviewer] OPENROUTER_API_KEY is not set');
    return NextResponse.json(
      { error: 'Interviewer is not configured on this deployment' },
      { status: 500 },
    );
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const roomId = typeof body.roomId === 'string' ? body.roomId : null;
  const personaId = typeof body.personaId === 'string' ? body.personaId : null;
  const trigger = typeof body.trigger === 'string' ? body.trigger : null;
  const context =
    body.context && typeof body.context === 'object' && !Array.isArray(body.context)
      ? (body.context as Record<string, string | undefined>)
      : undefined;
  const participantMessage =
    typeof body.participantMessage === 'string' ? body.participantMessage : undefined;

  if (!roomId || !personaId || !trigger) {
    return NextResponse.json(
      { error: 'roomId, personaId, and trigger (string) required' },
      { status: 400 },
    );
  }

  const admin = createAdminSupabase();
  const allowed = await authorizeRoomAccess(admin, user.id, roomId);
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const persona = getPersona(personaId);
  // getPersona always returns a value (falls back to first persona) but personaId
  // is still validated above so this will always resolve to a real match or the default.

  // Retrieve recent conversation history (last 10 messages, reversed to chronological order)
  const { data: history } = await admin
    .from('arena_interviewer_log')
    .select('role, content')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const messages: { role: string; content: string }[] = [
    { role: 'system', content: persona.systemPrompt },
    ...(history ?? []).reverse().map(m => ({
      role: m.role === 'interviewer' ? 'assistant' : 'user',
      content: m.content as string,
    })),
  ];

  // Build trigger message — truncate context fields to avoid token bloat
  let triggerMessage = '';
  switch (trigger) {
    case 'idle_5s':
      triggerMessage =
        '[SYSTEM: Candidate has been idle for 5 seconds with no typing activity]';
      break;
    case 'idle_30s':
      triggerMessage =
        '[SYSTEM: Candidate has been stuck for 30 seconds. Escalate to active mode — give a small hint.]';
      break;
    case 'commit': {
      const msg = (context?.lastCommitMessage ?? '').slice(0, 200);
      triggerMessage = `[SYSTEM: Candidate just committed: "${msg}". Ask them to walk through it.]`;
      break;
    }
    case 'test_fail': {
      const output = (context?.recentTerminalOutput ?? '').slice(0, 200);
      triggerMessage = `[SYSTEM: Test failed. Terminal output: ${output}. Ask Socratically.]`;
      break;
    }
    case 'test_pass':
      triggerMessage =
        '[SYSTEM: Test just passed. Push the candidate for more depth or edge cases.]';
      break;
    case 'deploy': {
      const url = (context?.previewUrl ?? '').slice(0, 200);
      triggerMessage = `[SYSTEM: Candidate deployed successfully. Preview URL: ${url}. Ask about scale/production.]`;
      break;
    }
    case 'cell_executed': {
      const cellSrc = (context?.lastCellSource ?? '').slice(0, 300);
      const cellOut = (context?.lastCellOutput ?? '').slice(0, 300);
      const nbHint = context?.notebookSnapshot
        ? `\n\nFull notebook (cells + outputs): ${context.notebookSnapshot.slice(0, 1500)}`
        : '';
      triggerMessage = `[SYSTEM: Candidate executed a cell.\nCode:\n${cellSrc}\nOutput:\n${cellOut}${nbHint}\nAsk them to explain their methodology.]`;
      break;
    }
    case 'periodic': {
      const bank = persona.questionBank;
      const randomQ = bank[Math.floor(Math.random() * bank.length)];
      triggerMessage = `[SYSTEM: Ask this question naturally: "${randomQ.text}"]`;
      break;
    }
    default:
      triggerMessage = participantMessage
        ? `[Candidate said: "${sanitizeParticipantMessage(participantMessage)}"]`
        : '[SYSTEM: Check in with the candidate.]';
  }

  messages.push({ role: 'user', content: triggerMessage });

  let reply: string;
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: persona.model,
        messages,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('[arena/interviewer POST] OpenRouter error', res.status, errText);
      return NextResponse.json({ error: 'LLM service error' }, { status: 502 });
    }

    const data = await res.json();
    reply = (data.choices?.[0]?.message?.content as string | undefined) ?? '';
  } catch (err) {
    console.error('[arena/interviewer POST] fetch failed', err);
    return NextResponse.json({ error: 'LLM service unreachable' }, { status: 502 });
  }

  // Persist the interviewer message to conversation log
  try {
    await admin.from('arena_interviewer_log').insert([
      {
        room_id: roomId,
        user_id: user.id,
        role: 'interviewer',
        content: reply,
        trigger,
      },
    ]);
  } catch (dbErr) {
    // Non-fatal: log and continue — the reply is still useful
    console.error('[arena/interviewer POST] failed to log message', dbErr);
  }

  // Deduct hint points for 30-second idle escalations (uses direct call to avoid
  // an internal fetch that would require an absolute URL in server context)
  if (trigger === 'idle_30s' && 'hint_used' in SCORE_VALUES) {
    try {
      await emitScoreEvent(roomId, user.id, 'hint_used');
    } catch (err) {
      // Non-fatal
      console.error('[arena/interviewer POST] hint deduction failed', err);
    }
  }

  return NextResponse.json({ reply, personaName: persona.name, avatar: persona.avatar });
}

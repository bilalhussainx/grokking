import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, createAdminSupabase } from '@/lib/supabase-auth';
import { listFiles, readFile, writeFile } from '@/lib/arena-sandbox';
import { emitScoreEvent, isFileSaveAllowed } from '@/lib/arena-scoring';

/** Resolve the room that owns sandboxId and verify the caller is a participant. */
async function authorizeFilesAccess(
  sandboxId: string,
  userId: string,
): Promise<boolean> {
  const admin = createAdminSupabase();

  // Check room-level sandbox_id
  const { data: room } = await admin
    .from('arena_rooms')
    .select('id')
    .eq('sandbox_id', sandboxId)
    .maybeSingle();

  if (room) {
    const { data: participant } = await admin
      .from('arena_participants')
      .select('user_id')
      .eq('room_id', room.id)
      .eq('user_id', userId)
      .maybeSingle();
    if (participant) return true;
  }

  // Also check participant-level sandbox_id (each participant may have their own)
  const { data: participantOwner } = await admin
    .from('arena_participants')
    .select('user_id')
    .eq('sandbox_id', sandboxId)
    .eq('user_id', userId)
    .maybeSingle();

  return !!participantOwner;
}

// GET /api/arena/files?sandboxId=...&path=...
// Returns file tree (no path) or single file content (with path).
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sandboxId = req.nextUrl.searchParams.get('sandboxId');
  const filePath = req.nextUrl.searchParams.get('path');

  if (!sandboxId || typeof sandboxId !== 'string') {
    return NextResponse.json({ error: 'sandboxId (string) required' }, { status: 400 });
  }

  const allowed = await authorizeFilesAccess(sandboxId, user.id);
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    if (filePath) {
      if (typeof filePath !== 'string') {
        return NextResponse.json({ error: 'path must be a string' }, { status: 400 });
      }
      const content = await readFile(sandboxId, filePath);
      return NextResponse.json({ content });
    }

    const files = await listFiles(sandboxId);
    return NextResponse.json({ files });
  } catch (err) {
    console.error('[arena/files GET]', err);
    return NextResponse.json({ error: 'File operation failed' }, { status: 500 });
  }
}

// POST /api/arena/files — write (create or overwrite) a file
// Body: { sandboxId, path, content, roomId? }
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const sandboxId = typeof body.sandboxId === 'string' ? body.sandboxId : null;
  const filePath = typeof body.path === 'string' ? body.path : null;
  const content = typeof body.content === 'string' ? body.content : null;
  const roomId = typeof body.roomId === 'string' ? body.roomId : null;

  if (!sandboxId || !filePath || content === null) {
    return NextResponse.json(
      { error: 'sandboxId, path, and content (string) required' },
      { status: 400 },
    );
  }

  const allowed = await authorizeFilesAccess(sandboxId, user.id);
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    await writeFile(sandboxId, filePath, content);
  } catch (err) {
    console.error('[arena/files POST] writeFile failed', err);
    return NextResponse.json({ error: 'File write failed' }, { status: 500 });
  }

  // Emit score event for file save (rate-limited inside emitScoreEvent / isFileSaveAllowed)
  if (roomId && isFileSaveAllowed(user.id)) {
    try {
      await emitScoreEvent(roomId, user.id, 'file_save');
    } catch (err) {
      // Non-fatal: score emission failure should not fail the file write
      console.error('[arena/files POST] score emit failed', err);
    }
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/arena/files?sandboxId=...&path=...
export async function DELETE(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sandboxId = req.nextUrl.searchParams.get('sandboxId');
  const filePath = req.nextUrl.searchParams.get('path');

  if (!sandboxId || typeof sandboxId !== 'string') {
    return NextResponse.json({ error: 'sandboxId (string) required' }, { status: 400 });
  }
  if (!filePath || typeof filePath !== 'string') {
    return NextResponse.json({ error: 'path (string) required' }, { status: 400 });
  }

  const allowed = await authorizeFilesAccess(sandboxId, user.id);
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Import execInSandbox to delete the file. assertSafePath is applied inside readFile/writeFile
  // but for delete we invoke rm via execInSandbox after manually validating the path type.
  try {
    const { execInSandbox } = await import('@/lib/arena-sandbox');
    // assertSafePath is not exported; use the lib's own path validation by reading first to
    // verify the path is safe, then remove. Alternatively, import path and replicate the check.
    // Since assertSafePath is internal, we rely on the fact that execInSandbox is called with
    // a user-supplied path that must pass through the same validation used in readFile.
    // We guard here against obvious traversal at route level.
    if (filePath.includes('..') || filePath.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    // Use writeFile pattern: delegate path safety to arena-sandbox internals via execInSandbox
    // by constructing the rm command carefully (no shell expansion possible with single-quoted path).
    const safePath = `/workspace/${filePath.replace(/'/g, '')}`;
    await execInSandbox(sandboxId, `rm -rf '${safePath}'`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[arena/files DELETE]', err);
    return NextResponse.json({ error: 'File delete failed' }, { status: 500 });
  }
}

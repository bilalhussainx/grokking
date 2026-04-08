import { createAdminSupabase } from '@/lib/supabase-auth';

export const SCORE_VALUES: Record<string, number> = {
  file_save: 2,
  test_pass: 15,
  all_tests_pass: 50,
  milestone_complete: 0,     // value comes from milestone config
  explained_correctly: 20,
  system_design_correct: 25,
  hint_used: -5,
  speed_bonus: 30,
  challenge_complete: 100,
  deploy_live: 150,
};

// Cap file_save events to prevent spam
const FILE_SAVE_CAP_PER_MIN = 20;
const fileSaveCounts: Map<string, { count: number; resetAt: number }> = new Map();

export function isFileSaveAllowed(userId: string): boolean {
  const now = Date.now();
  const bucket = fileSaveCounts.get(userId);
  if (!bucket || now > bucket.resetAt) {
    fileSaveCounts.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (bucket.count >= FILE_SAVE_CAP_PER_MIN) return false;
  bucket.count++;
  return true;
}

export async function emitScoreEvent(
  roomId: string,
  userId: string,
  eventType: string,
  pointsOverride?: number,
  metadata?: Record<string, unknown>
): Promise<{ points: number; total: number }> {
  const supabase = createAdminSupabase();

  if (eventType === 'file_save' && !isFileSaveAllowed(userId)) {
    return { points: 0, total: await getRunningTotal(roomId, userId) };
  }

  const points = pointsOverride ?? SCORE_VALUES[eventType] ?? 0;
  if (points === 0 && pointsOverride === undefined) {
    return { points: 0, total: await getRunningTotal(roomId, userId) };
  }

  await supabase.from('arena_score_events').insert({
    room_id: roomId,
    user_id: userId,
    event_type: eventType,
    points,
    metadata: metadata ?? {},
  });

  const total = await getRunningTotal(roomId, userId);
  return { points, total };
}

export async function getRunningTotal(roomId: string, userId: string): Promise<number> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from('arena_score_events')
    .select('points')
    .eq('room_id', roomId)
    .eq('user_id', userId);
  return (data ?? []).reduce((sum, e) => sum + e.points, 0);
}

export interface CommitAnalysis {
  totalCommits: number;
  featureCommits: number;
  fixCommits: number;
  testCommits: number;
  avgTimeBetweenCommitsMs: number;
  linesAdded: number;
  linesDeleted: number;
  commitMessages: string[];
}

export function parseGitLog(gitLogOutput: string): CommitAnalysis {
  const lines = gitLogOutput.trim().split('\n').filter(Boolean);
  // Format expected: "HASH|TIMESTAMP|SUBJECT|+added|-deleted"
  // e.g. from: git log --format="%H|%at|%s" --shortstat
  const commits = lines
    .filter(l => l.includes('|'))
    .map(l => {
      const [, ts, subject] = l.split('|');
      return { ts: parseInt(ts, 10) * 1000, subject: subject ?? '' };
    });

  const messages = commits.map(c => c.subject);
  const featureCommits = messages.filter(m => m.startsWith('feat')).length;
  const fixCommits = messages.filter(m => m.startsWith('fix')).length;
  const testCommits = messages.filter(m => m.startsWith('test')).length;

  const timestamps = commits.map(c => c.ts).sort();
  const diffs = timestamps.slice(1).map((t, i) => t - timestamps[i]);
  const avgTimeBetweenCommitsMs = diffs.length > 0
    ? diffs.reduce((a, b) => a + b, 0) / diffs.length
    : 0;

  // Parse --shortstat lines: " 3 files changed, 42 insertions(+), 5 deletions(-)"
  let linesAdded = 0;
  let linesDeleted = 0;
  for (const line of lines) {
    const addMatch = line.match(/(\d+) insertion/);
    const delMatch = line.match(/(\d+) deletion/);
    if (addMatch) linesAdded += parseInt(addMatch[1], 10);
    if (delMatch) linesDeleted += parseInt(delMatch[1], 10);
  }

  return {
    totalCommits: commits.length,
    featureCommits,
    fixCommits,
    testCommits,
    avgTimeBetweenCommitsMs,
    linesAdded,
    linesDeleted,
    commitMessages: messages,
  };
}

-- Challenge library
CREATE TABLE IF NOT EXISTS arena_challenges (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('micro', 'feature')),
  track        TEXT NOT NULL CHECK (track IN ('backend', 'frontend', 'fullstack', 'data-science', 'ml-engineer')),
  duration_min INT NOT NULL,
  brief_md     TEXT NOT NULL,
  starter_repo TEXT,
  test_file    TEXT,
  milestones   JSONB DEFAULT '[]',
  difficulty   TEXT DEFAULT 'medium',
  tags         TEXT[] DEFAULT '{}'
);

-- Rooms
CREATE TABLE IF NOT EXISTS arena_rooms (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id      UUID REFERENCES auth.users NOT NULL,
  challenge_id TEXT REFERENCES arena_challenges,
  persona_id   TEXT NOT NULL DEFAULT 'alex-chen',
  join_code    TEXT UNIQUE NOT NULL,
  status       TEXT DEFAULT 'lobby' CHECK (status IN ('lobby','active','judging','finished')),
  sandbox_id   TEXT,
  github_fork  TEXT,
  preview_url  TEXT,
  starts_at    TIMESTAMPTZ,
  ends_at      TIMESTAMPTZ,
  settings     JSONB DEFAULT '{}'
);

-- Participants
CREATE TABLE IF NOT EXISTS arena_participants (
  room_id    UUID REFERENCES arena_rooms ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users,
  role       TEXT DEFAULT 'challenger' CHECK (role IN ('host','challenger','spectator','observer')),
  sandbox_id TEXT,
  joined_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

-- Score events (append-only ledger)
CREATE TABLE IF NOT EXISTS arena_score_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID REFERENCES arena_rooms,
  user_id    UUID REFERENCES auth.users,
  event_type TEXT NOT NULL,
  points     INT NOT NULL,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Interviewer conversation log
CREATE TABLE IF NOT EXISTS arena_interviewer_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID REFERENCES arena_rooms,
  user_id    UUID REFERENCES auth.users,
  role       TEXT CHECK (role IN ('interviewer','participant')),
  content    TEXT NOT NULL,
  trigger    TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Final scorecards
CREATE TABLE IF NOT EXISTS arena_scorecards (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id           UUID REFERENCES arena_rooms UNIQUE,
  user_id           UUID REFERENCES auth.users,
  total_score       INT,
  code_score        INT,
  explanation_score INT,
  design_score      INT,
  speed_score       INT,
  commit_analysis   JSONB,
  ai_verdict        TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE arena_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_score_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_interviewer_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_scorecards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads challenges" ON arena_challenges FOR SELECT USING (true);
CREATE POLICY "Service manages challenges" ON arena_challenges FOR ALL USING (true);
CREATE POLICY "Users see own rooms" ON arena_rooms FOR SELECT USING (auth.uid() = host_id);
CREATE POLICY "Service manages rooms" ON arena_rooms FOR ALL USING (true);
CREATE POLICY "Users see own participation" ON arena_participants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages participants" ON arena_participants FOR ALL USING (true);
CREATE POLICY "Users see room scores" ON arena_score_events FOR SELECT USING (true);
CREATE POLICY "Service inserts scores" ON arena_score_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users see own log" ON arena_interviewer_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages log" ON arena_interviewer_log FOR ALL USING (true);
CREATE POLICY "Users see own scorecard" ON arena_scorecards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages scorecards" ON arena_scorecards FOR ALL USING (true);

-- Realtime for live scoring
ALTER PUBLICATION supabase_realtime ADD TABLE arena_score_events;
ALTER PUBLICATION supabase_realtime ADD TABLE arena_rooms;

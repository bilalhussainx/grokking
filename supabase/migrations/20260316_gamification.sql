-- XP system
CREATE TABLE IF NOT EXISTS user_xp (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  weekly_xp INT DEFAULT 0,
  week_start DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  action TEXT NOT NULL,
  ref_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gems
CREATE TABLE IF NOT EXISTS gem_balance (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gem_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  action TEXT NOT NULL,
  item TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL DEFAULT 'common',
  icon TEXT,
  criteria JSONB,
  gem_reward INT DEFAULT 5
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Leagues
CREATE TABLE IF NOT EXISTS league_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league TEXT NOT NULL DEFAULT 'bronze',
  week_starting DATE NOT NULL,
  member_ids UUID[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS user_league (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  league TEXT DEFAULT 'bronze',
  group_id UUID REFERENCES league_groups(id),
  weekly_xp INT DEFAULT 0
);

-- Profile card cosmetics
CREATE TABLE IF NOT EXISTS user_cosmetics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  card_frame TEXT DEFAULT 'minimal',
  card_bg TEXT DEFAULT 'gradient',
  flame_color TEXT DEFAULT 'orange',
  title TEXT DEFAULT NULL,
  purchased_items TEXT[] DEFAULT '{}'
);

-- Seed achievements
INSERT INTO achievements (id, name, description, rarity, icon, gem_reward, criteria) VALUES
  ('first-steps', 'First Steps', 'Complete your first lesson', 'common', '👣', 5, '{"type":"lessons_completed","count":1}'),
  ('voice-activated', 'Voice Activated', 'Start your first voice session', 'common', '🎤', 5, '{"type":"voice_sessions","count":1}'),
  ('curious-mind', 'Curious Mind', 'Ask Coach Alex a question', 'common', '🤔', 5, '{"type":"questions_asked","count":1}'),
  ('consistent', 'Consistent', 'Maintain a 3-day streak', 'uncommon', '📅', 10, '{"type":"streak","count":3}'),
  ('module-master', 'Module Master', 'Complete an entire module', 'rare', '📚', 25, '{"type":"modules_completed","count":1}'),
  ('polyglot', 'Polyglot', 'Start courses in 2+ languages', 'rare', '🌍', 25, '{"type":"languages","count":2}'),
  ('night-owl', 'Night Owl', 'Study after 10pm', 'uncommon', '🦉', 10, '{"type":"time_of_day","after":22}'),
  ('early-bird', 'Early Bird', 'Study before 7am', 'uncommon', '🐦', 10, '{"type":"time_of_day","before":7}'),
  ('course-graduate', 'Course Graduate', 'Complete an entire course', 'epic', '🎓', 50, '{"type":"courses_completed","count":1}'),
  ('streak-legend', 'Streak Legend', 'Maintain a 100-day streak', 'legendary', '🔥', 100, '{"type":"streak","count":100}'),
  ('diamond-scholar', 'Diamond Scholar', 'Reach Diamond league', 'legendary', '💎', 100, '{"type":"league","value":"diamond"}'),
  ('voice-marathon', 'Voice Marathon', '30-minute voice session', 'epic', '🏃', 50, '{"type":"voice_duration","minutes":30}')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gem_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE gem_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_league ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own xp" ON user_xp FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages xp" ON user_xp FOR ALL USING (true);
CREATE POLICY "Users see own xp txns" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service inserts xp txns" ON xp_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users see own gems" ON gem_balance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages gems" ON gem_balance FOR ALL USING (true);
CREATE POLICY "Users see own gem txns" ON gem_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service inserts gem txns" ON gem_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users see own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages achievements" ON user_achievements FOR ALL USING (true);
CREATE POLICY "Anyone sees achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Users see own league" ON user_league FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages leagues" ON user_league FOR ALL USING (true);
CREATE POLICY "Users see own cosmetics" ON user_cosmetics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service manages cosmetics" ON user_cosmetics FOR ALL USING (true);

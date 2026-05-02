-- Tracks which deadline reminders we've already sent so the daily cron
-- never double-sends. Idempotency key = (user_id, school_id, deadline_type, days_offset).
CREATE TABLE IF NOT EXISTS deadline_reminder_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_school_id UUID REFERENCES cc_student_schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  deadline_type TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  days_offset INTEGER NOT NULL,
  delivered_via TEXT NOT NULL CHECK (delivered_via IN ('email', 'in_app')),
  sent_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, student_school_id, deadline_type, days_offset, delivered_via)
);

CREATE INDEX IF NOT EXISTS deadline_reminder_log_user_idx
  ON deadline_reminder_log(user_id, sent_at DESC);

ALTER TABLE deadline_reminder_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users see their reminders" ON deadline_reminder_log;
CREATE POLICY "users see their reminders"
  ON deadline_reminder_log FOR SELECT
  USING (auth.uid() = user_id);

-- Call sessions for real-time translated phone calls
CREATE TABLE call_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  caller_id UUID REFERENCES auth.users,
  caller_phone TEXT NOT NULL,
  callee_phone TEXT NOT NULL,
  caller_language TEXT NOT NULL DEFAULT 'en',
  callee_language TEXT NOT NULL DEFAULT 'es',
  duration_seconds INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  status TEXT DEFAULT 'initiating',
  transcript JSONB DEFAULT '[]',
  twilio_call_sid_a TEXT,
  twilio_call_sid_b TEXT,
  ended_at TIMESTAMPTZ
);

ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own calls" ON call_sessions
  FOR SELECT USING (auth.uid() = caller_id);

CREATE POLICY "Service can insert calls" ON call_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update calls" ON call_sessions
  FOR UPDATE USING (true);

CREATE INDEX idx_call_sessions_caller ON call_sessions(caller_id);
CREATE INDEX idx_call_sessions_status ON call_sessions(status);

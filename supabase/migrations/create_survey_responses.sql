CREATE TABLE survey_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  name text,
  email text,
  role text,
  subject text,
  frustration text,
  ai_experience text,
  confidence_before integer,
  confidence_after integer,
  one_sentence text,
  clarity text,
  personalization text,
  most_useful text,
  missing text,
  comparison text,
  use_free text,
  pay text,
  nps integer,
  other text,
  submitted_at text
);

-- Enable RLS but allow insert from anon (for survey submissions)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON survey_responses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow admin read" ON survey_responses
  FOR SELECT USING (true);

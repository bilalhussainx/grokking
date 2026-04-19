-- 031_share_links.sql
-- Unified share links for CC student portfolios

CREATE TABLE cc_share_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES cc_student_profiles(id),
  share_token text NOT NULL UNIQUE,
  visible_sections jsonb NOT NULL DEFAULT '{"essays":true,"activities":true,"schoolList":true,"recommendations":true,"interviewScores":true}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_share_links_student ON cc_share_links(student_id);
CREATE INDEX idx_share_links_token ON cc_share_links(share_token) WHERE is_active = true;

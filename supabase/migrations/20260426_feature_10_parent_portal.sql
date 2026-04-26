-- Feature 10: Parent Communication Portal
-- Parent users authenticate via magic link and get a read-only view of the
-- student's high-level status. Family Mode (Feature 1A) is the voice channel;
-- this is the persistent dashboard.

CREATE TABLE IF NOT EXISTS cc_parent_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  parent_email TEXT NOT NULL,
  parent_name TEXT,
  invite_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  preferred_language TEXT DEFAULT 'en',
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, parent_email)
);

CREATE TABLE IF NOT EXISTS cc_family_alignment_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES cc_student_profiles(id) ON DELETE CASCADE,
  rater TEXT NOT NULL CHECK (rater IN ('student', 'parent')),
  school_id UUID REFERENCES cc_schools(id),
  school_name TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, rater, school_name)
);

ALTER TABLE cc_parent_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_family_alignment_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "students manage their parent invites" ON cc_parent_invites;
CREATE POLICY "students manage their parent invites"
  ON cc_parent_invites FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "students see their family ratings" ON cc_family_alignment_ratings;
CREATE POLICY "students see their family ratings"
  ON cc_family_alignment_ratings FOR ALL
  USING (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()))
  WITH CHECK (student_id IN (SELECT id FROM cc_student_profiles WHERE user_id = auth.uid()));

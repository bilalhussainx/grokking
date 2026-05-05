-- Seed cc_school_supplements with Canadian university prompts.
--
-- Mirrors src/data/canadian/ca-supplement-prompts-2026.json which until now
-- only fed the legacy JSON loader (deprecated this commit). With the
-- supplements dashboard switching to cc_school_supplements as the canonical
-- source, Canadian schools have to land in the DB or they show up with
-- "No seed prompts yet" the same way US schools did pre-fix.
--
-- Idempotent: each INSERT is gated on NOT EXISTS for (school_id, prompt_text).
-- Safe to run multiple times — no UNIQUE constraint exists on the table so
-- we enforce idempotency at the migration level.
--
-- Schools covered (4): University of British Columbia, University of Waterloo,
-- Queen's University, University of Toronto. The other 8 Canadian schools in
-- cc_schools (McGill, Western, McMaster, Alberta, Ottawa, SFU, Toronto
-- Metropolitan, York) don't have supplement requirements published in the
-- 2026 cycle JSON yet — students applying there will see "No seed prompts
-- yet" until we author / source those prompts.

-- ─── University of British Columbia (PSE — five short answers) ──────────
INSERT INTO cc_school_supplements
  (school_id, prompt_text, word_limit, is_required, supplement_type, category, academic_year, sort_order, source_url)
SELECT s.id, x.prompt_text, x.word_limit, x.is_required, x.supplement_type, x.category, '2026-2027', x.sort_order, x.source_url
FROM (VALUES
  ('Tell us about who you are. How would your family, friends, and/or members of your community describe you? If possible, please share with us the role(s) of important culture, values, and/or beliefs in shaping who you are.', 250, TRUE, 'identity', 'PSE answer', 1, 'https://you.ubc.ca/applying-ubc/blog/personal-statement-of-experience/'),
  ('What is important to you? And why?', 250, TRUE, 'identity', 'PSE answer', 2, 'https://you.ubc.ca/applying-ubc/blog/personal-statement-of-experience/'),
  ('Tell us about a difficult or significant situation. What did you do? How does it relate to who you are?', 250, TRUE, 'challenge', 'PSE answer', 3, 'https://you.ubc.ca/applying-ubc/blog/personal-statement-of-experience/'),
  ('Describe what you have learned from a meaningful experience involving culture, values, and/or beliefs.', 250, TRUE, 'community', 'PSE answer', 4, 'https://you.ubc.ca/applying-ubc/blog/personal-statement-of-experience/'),
  ('Explain what you like to learn outside the classroom and how you do it.', 250, TRUE, 'intellectual', 'PSE answer', 5, 'https://you.ubc.ca/applying-ubc/blog/personal-statement-of-experience/')
) AS x(prompt_text, word_limit, is_required, supplement_type, category, sort_order, source_url)
JOIN cc_schools s ON s.name = 'University of British Columbia'
WHERE NOT EXISTS (
  SELECT 1 FROM cc_school_supplements existing
  WHERE existing.school_id = s.id
    AND existing.prompt_text = x.prompt_text
);

-- ─── University of Waterloo (AIF — engineering / math / CS) ─────────────
INSERT INTO cc_school_supplements
  (school_id, prompt_text, word_limit, is_required, supplement_type, category, academic_year, sort_order, source_url)
SELECT s.id, x.prompt_text, x.word_limit, x.is_required, x.supplement_type, x.category, '2026-2027', x.sort_order, x.source_url
FROM (VALUES
  ('Why have you chosen this particular program? What experiences have led to your interest? (Admission Information Form, engineering/math/CS applicants — heavily weighted)', 200, TRUE, 'why_school', 'AIF', 1, 'https://uwaterloo.ca/future-students/admissions/admission-information-form'),
  ('Describe an example of overcoming a significant challenge. What did you learn?', 200, TRUE, 'challenge', 'AIF', 2, 'https://uwaterloo.ca/future-students/admissions/admission-information-form'),
  ('Tell us about your extracurricular and volunteer activities. Which were most significant and why?', 200, TRUE, 'activity', 'AIF', 3, 'https://uwaterloo.ca/future-students/admissions/admission-information-form'),
  ('Discuss your reasons for choosing your top program choice. What do you hope to contribute and gain?', 200, TRUE, 'why_school', 'AIF', 4, 'https://uwaterloo.ca/future-students/admissions/admission-information-form')
) AS x(prompt_text, word_limit, is_required, supplement_type, category, sort_order, source_url)
JOIN cc_schools s ON s.name = 'University of Waterloo'
WHERE NOT EXISTS (
  SELECT 1 FROM cc_school_supplements existing
  WHERE existing.school_id = s.id
    AND existing.prompt_text = x.prompt_text
);

-- ─── Queen's University (PSE) ───────────────────────────────────────────
INSERT INTO cc_school_supplements
  (school_id, prompt_text, word_limit, is_required, supplement_type, category, academic_year, sort_order, source_url)
SELECT s.id, x.prompt_text, x.word_limit, x.is_required, x.supplement_type, x.category, '2026-2027', x.sort_order, x.source_url
FROM (VALUES
  ('Personal Statement of Experience (PSE): Reflect on your most significant accomplishments and experiences inside and outside the classroom. How have they prepared you for university?', 300, TRUE, 'identity', 'PSE', 1, 'https://www.queensu.ca/admission/undergraduate/admission-requirements/supplementary-essays'),
  ('Why Queen''s? What about Queen''s specifically appeals to you and your goals?', 200, TRUE, 'why_school', 'Why Queen''s', 2, 'https://www.queensu.ca/admission/undergraduate/admission-requirements/supplementary-essays')
) AS x(prompt_text, word_limit, is_required, supplement_type, category, sort_order, source_url)
JOIN cc_schools s ON s.name = 'Queen''s University'
WHERE NOT EXISTS (
  SELECT 1 FROM cc_school_supplements existing
  WHERE existing.school_id = s.id
    AND existing.prompt_text = x.prompt_text
);

-- ─── University of Toronto (program-specific supplemental) ──────────────
INSERT INTO cc_school_supplements
  (school_id, prompt_text, word_limit, is_required, supplement_type, category, academic_year, sort_order, source_url)
SELECT s.id, x.prompt_text, x.word_limit, x.is_required, x.supplement_type, x.category, '2026-2027', x.sort_order, x.source_url
FROM (VALUES
  ('Why do you want to study at U of T (and at this specific program)? What experiences have led you to this choice? (Required for Engineering, Rotman Commerce, Architecture, and some other programs)', 250, TRUE, 'why_school', 'Program supplement', 1, 'https://future.utoronto.ca/apply/applying/'),
  ('Tell us about activities or experiences that have shaped you outside the classroom.', 250, TRUE, 'activity', 'Program supplement', 2, 'https://future.utoronto.ca/apply/applying/'),
  ('Describe a significant achievement and what it took to get there.', 250, FALSE, 'challenge', 'Program supplement', 3, 'https://future.utoronto.ca/apply/applying/')
) AS x(prompt_text, word_limit, is_required, supplement_type, category, sort_order, source_url)
JOIN cc_schools s ON s.name = 'University of Toronto'
WHERE NOT EXISTS (
  SELECT 1 FROM cc_school_supplements existing
  WHERE existing.school_id = s.id
    AND existing.prompt_text = x.prompt_text
);

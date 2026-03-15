ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS conversation_checkpoint JSONB DEFAULT NULL;

ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS current_course_slug TEXT DEFAULT NULL;

ALTER TABLE user_language_profiles
ADD COLUMN IF NOT EXISTS native_language TEXT DEFAULT 'en';

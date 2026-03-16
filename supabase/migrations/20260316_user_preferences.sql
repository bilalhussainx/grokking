-- User learning preferences — persisted across sign-ins
-- Stores native language, instruction language, coach persona, learning style, interests

ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS native_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS instruction_language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS preferred_voice_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS learning_style TEXT DEFAULT 'balanced',
ADD COLUMN IF NOT EXISTS communication_mode TEXT DEFAULT 'voice_and_text',
ADD COLUMN IF NOT EXISTS coach_persona TEXT DEFAULT 'alex',
ADD COLUMN IF NOT EXISTS learning_interests TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS english_fluency TEXT DEFAULT 'intermediate',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Personalization embedding — generated from user preferences, learning behavior,
-- cultural/language context. Used to match content and teaching style.
-- Privacy: this data is NEVER shared with third parties. It exists solely to
-- improve the user's personalized learning experience on this platform.
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS personalization_embedding vector(768) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS personalization_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT NULL;

-- learning_style: 'visual' | 'auditory' | 'reading' | 'balanced'
-- communication_mode: 'voice_only' | 'text_only' | 'voice_and_text'
-- english_fluency: 'beginner' | 'intermediate' | 'advanced' | 'native'

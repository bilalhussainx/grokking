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

-- Usage analytics table — tracks every voice/text coach session
-- Privacy: data is per-user, never shared, used only for personalization
CREATE TABLE IF NOT EXISTS usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL DEFAULT 'coach', -- coach | language_practice | placement
  language TEXT NOT NULL DEFAULT 'en',
  duration_seconds INT DEFAULT 0,
  course_slug TEXT,
  lesson_slug TEXT,
  message_count INT DEFAULT 0,
  voice_used BOOLEAN DEFAULT true,
  coach_persona TEXT DEFAULT 'alex',
  user_switched_lang BOOLEAN DEFAULT false,
  switched_to_lang TEXT,
  geo_country TEXT,
  geo_region TEXT,
  geo_city TEXT,
  geo_timezone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usage_analytics_user ON usage_analytics(user_id, created_at DESC);

-- RLS: users can only see their own analytics
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own analytics" ON usage_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role inserts analytics" ON usage_analytics FOR INSERT WITH CHECK (true);

-- learning_style: 'visual' | 'auditory' | 'reading' | 'balanced'
-- communication_mode: 'voice_only' | 'text_only' | 'voice_and_text'
-- english_fluency: 'beginner' | 'intermediate' | 'advanced' | 'native'

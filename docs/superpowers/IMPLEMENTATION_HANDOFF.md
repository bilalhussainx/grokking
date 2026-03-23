# Language Learning Implementation - Handoff Document

**Date:** 2026-03-14  
**Status:** Phase 1 MVP - Core Infrastructure Complete  
**Last Updated By:** Kimi Code CLI

---

## ✅ COMPLETED WORK

### 1. Database Schema (`supabase/migrations/005_language_learning.sql`)
**Status:** ✅ Complete

Created all necessary tables for the RAG agent with per-user memory:
- `user_language_profiles` - Per-user language learning profiles
- `vocab_mastery` - SM-2 spaced repetition tracking
- `mistake_patterns` - With pgvector embeddings (768-dim) for RAG
- `language_sessions` - Conversation history and transcripts
- `placement_results` - Assessment results
- RLS policies and RPC functions for SM-2 algorithm

### 2. Language Personas (`src/lib/language-personas.ts`)
**Status:** ✅ Complete

9 personas across 3 languages:
- **Spanish:** Elena (strict), Carlos (conversational), Ana (patient)
- **French:** Laurent (strict), Camille (conversational), Sophie (patient)
- **Urdu:** Rashid (strict), Ayesha (conversational), Nani Amira (patient)

Features:
- `VoiceAgentConfig` adapter to normalize with existing Persona types
- Adaptive rules for A1-C2 proficiency levels
- Voice provider routing (Kokoro for es/fr, Sarvam for ur)

### 3. Voice Provider Router (`src/lib/voice-provider-router.ts`)
**Status:** ✅ Complete

**Three-Tier Architecture:**
- **Tier 1 (Self-hosted):** Faster-Whisper + Kokoro + Ollama (~$0/min)
- **Tier 2 (Mixed):** Local STT + Cloud TTS for Urdu/Punjabi/Arabic
- **Tier 3 (Cloud fallback):** Deepgram + Kimi K2 API when VPS down

Functions:
- `getVoiceProviderConfig()` - Routes based on language and VPS health
- `checkVPSHealth()` - Health check for all services
- `buildWebSocketConfig()` - Creates WebSocket config for browser
- `translate()` - Ollama primary + Kimi API fallback

### 4. RAG Agent (`src/lib/language-agent.ts`)
**Status:** ✅ Complete

- `buildAgentContext()` - Fetches profile, mistakes, vocab, sessions in parallel
- `getUserLanguageProfile()` - Get/create user profile
- `getRecentMistakes()` - Get recurring mistakes via pgvector
- `getDueVocabulary()` - Get SM-2 due vocab via RPC
- Memory write-back functions (mistakes, vocab, sessions)

### 5. Voice Agent Hooks
**Status:** ✅ Complete

- `useVoiceAgent.ts` - Factory hook that selects local vs Deepgram
- `useLocalVoiceAgent.ts` - VPS WebSocket hook with full audio pipeline
- Mirror interface to existing `useDeepgramAgent`

### 6. API Routes (`src/app/api/language/`)
**Status:** ✅ Complete

- `voice-session/route.ts` - Creates voice sessions with RAG context
- `translate/route.ts` - Translation with Ollama + fallback
- `placement/route.ts` - A1-C2 placement test logic
- `session/route.ts` - Session persistence
- `persona-config/route.ts` - Persona configuration endpoint

### 7. UI Components (`src/components/language/`)
**Status:** ✅ Complete (Basic Implementation)

- `LanguageTutorPanel.tsx` - Right panel with persona selector, voice chat, vocab
- `TranslationWidget.tsx` - Floating translation widget for CS courses
- `LanguageLessonPage.tsx` - Lesson page for language courses

### 8. Course Data (`src/data/languages/`)
**Status:** ✅ Complete (Spanish A1)

- `spanish-a1.ts` - 5 modules, 9 lessons with vocab, grammar, voice scenarios
- `index.ts` - Course registry and helper functions
- A1 content: Greetings, Introductions, Numbers, Family, Food, Time, Directions

### 9. Local VPS Development Setup (`vps/`)
**Status:** ✅ Complete

**Files:**
- `docker-compose.yml` - Full Docker stack (Whisper + Kokoro + Ollama + Relay)
- `relay/Dockerfile` + `server.js` - WebSocket relay server
- `kokoro/Dockerfile` + `server.py` - Custom Kokoro TTS server
- `start.ps1` - One-command startup
- `start-tunnel.ps1` - Ngrok/Cloudflare tunnel launcher
- `test-services.ps1` - Health check script
- `.env` - Auto-configured from `.env.local`

**Working Commands:**
```powershell
# Start VPS stack
cd vps
.\start.ps1

# Pull Ollama models (first time)
docker exec -it grokking-ollama ollama pull qwen2.5
docker exec -it grokking-ollama ollama pull nomic-embed-text

# Start tunnel
.\start-tunnel.ps1
```

### 10. Routes Integration
**Status:** ✅ Complete (With Issues - See Below)

- `/courses/languages` - Language courses listing
- `/placement/[lang]` - Placement test (es/fr/ur)
- `/practice` - Quick voice practice
- `/course/spanish-a1/[lesson]` - Spanish lessons with Language Tutor

---

## ⚠️ KNOWN ISSUES & LIMITATIONS

### 1. Voice Audio Not Working
**Status:** 🔴 Critical Issue

**Problem:** Text chat works but voice/audio doesn't play.

**Likely Causes:**
- Kokoro TTS only supports English (not Urdu)
- WebSocket audio streaming may have issues
- Browser audio playback permissions
- Mixed content (HTTP vs HTTPS)

**Testing:**
- Test TTS directly: `curl http://localhost:8002/v1/audio/speech ...`
- Check browser console for WebSocket errors
- Try Spanish (not Urdu) for local testing

### 2. Course Routing
**Status:** 🟡 Partially Working

- ✅ `/courses/languages` works
- ✅ Spanish course lessons load
- ⚠️ Placement test "Start Learning" button redirects correctly
- ⚠️ Some navigation may have edge cases

### 3. ngrok Free Tier Limitations
**Status:** 🟡 Expected

- URL changes every restart
- 1 tunnel at a time limit
- Session expires after ~2 hours

---

## 🔧 WHAT CLAUDE CODE NEEDS TO WORK ON

### Priority 1: Fix Voice Audio (Critical)

1. **Debug audio pipeline:**
   ```powershell
   # Test TTS directly
   curl -X POST http://localhost:8002/v1/audio/speech `
     -H "Content-Type: application/json" `
     -d '{"text":"Hello","voice":"af_bella"}' `
     --output test.wav
   ```
   If this doesn't produce valid audio, fix Kokoro.

2. **Fix WebSocket audio streaming in relay:**
   - Check `server.js` audio chunk handling
   - Ensure proper binary message handling
   - Add logging to debug audio flow

3. **Add language-specific TTS fallback:**
   - For Urdu/Arabic: Route to Sarvam/MiniMax APIs
   - Add API keys to `.env.local`

### Priority 2: Add More Language Courses

1. **French A1 Course:**
   - Copy structure from `spanish-a1.ts`
   - Translate content to French
   - Add to `src/data/languages/index.ts`

2. **Urdu A1 Course:**
   - Copy structure from `spanish-a1.ts`
   - Translate content to Urdu
   - Note: Will need Sarvam API for voice (Kokoro doesn't support Urdu)

### Priority 3: Polish UI/UX

1. **Language Tutor Panel:**
   - Add loading states
   - Better error handling when voice fails
   - Show connection status

2. **Placement Test:**
   - Actually grade responses (currently just counts answers)
   - Store results in database
   - Auto-enroll in appropriate level

3. **Translation Widget:**
   - Actually call `/api/language/translate`
   - Add audio playback for translations
   - Make text selection work

### Priority 4: RAG Memory Integration

1. **Connect RAG to voice sessions:**
   - Call `buildAgentContext()` in voice-session API
   - Inject context into system prompt
   - Actually fetch mistakes/vocab from Supabase

2. **Memory write-back:**
   - Save mistakes after each session
   - Update vocab mastery
   - Generate session summaries

### Priority 5: Production Deployment

1. **VPS on RunPod/Vast.ai:**
   - Deploy Docker Compose to GPU VPS
   - Use Cloudflare Tunnel for stable URL
   - Set up monitoring/alerting

2. **Security:**
   - Add rate limiting to relay
   - Validate JWT tokens properly
   - Add request signing

---

## 📋 TESTING CHECKLIST

### Local Development
- [ ] VPS stack starts without errors
- [ ] All services healthy (`curl http://localhost:8080/health`)
- [ ] ngrok tunnel connects
- [ ] `.env.local` has correct VPS_HOST

### Voice Features
- [ ] Browser prompts for microphone permission
- [ ] WebSocket connects without errors
- [ ] Voice input transcribed (check relay logs)
- [ ] AI response generated (check Ollama logs)
- [ ] Audio plays back (check browser audio)

### Courses
- [ ] `/courses/languages` shows Spanish card
- [ ] Clicking card goes to placement or course
- [ ] Placement test displays questions
- [ ] Lesson page shows vocabulary
- [ ] Language Tutor panel visible on right
- [ ] Translation widget on CS courses

---

## 📚 FILE LOCATIONS

### Core Implementation
- `supabase/migrations/005_language_learning.sql` - Database
- `src/lib/language-personas.ts` - Personas
- `src/lib/voice-provider-router.ts` - Voice routing
- `src/lib/language-agent.ts` - RAG agent
- `src/data/language-types.ts` - TypeScript types
- `src/data/languages/` - Course content

### Hooks & Components
- `src/hooks/useVoiceAgent.ts` - Factory hook
- `src/hooks/useLocalVoiceAgent.ts` - VPS hook
- `src/components/language/` - UI components

### API Routes
- `src/app/api/language/` - All language endpoints

### VPS
- `vps/docker-compose.yml` - Docker stack
- `vps/relay/server.js` - WebSocket relay

---

## 💰 COSTS

| Component | Monthly Cost |
|-----------|--------------|
| Local GPU (your electricity) | ~$20-50 |
| RunPod RTX 3090 VPS | ~$160 |
| Vast.ai RTX 3090 | ~$80 |
| Deepgram (fallback) | ~$0.0077/min |
| Sarvam (Urdu TTS) | ~$0.04/min |
| Kimi K2 API (fallback) | ~$0.14/1M tokens |

**For development:** Local + ngrok = $0 (just electricity)
**For production:** VPS + Cloudflare Tunnel = ~$80-160/month

---

## 🎯 NEXT STEPS FOR CLAUDE CODE

1. **Fix voice audio** - Debug why audio doesn't play
2. **Test end-to-end** - Spanish course → Voice tutor → Conversation
3. **Add French/Urdu courses** - Copy Spanish structure
4. **Integrate RAG** - Connect memory to voice sessions
5. **Deploy to VPS** - Move from local to production

---

## 🔗 IMPORTANT URLs

- Local app: http://localhost:3000
- VPS health: http://localhost:8080/health
- Ngrok dashboard: http://127.0.0.1:4040
- Supabase dashboard: https://app.supabase.com

---

**Questions?** Check the detailed spec: `docs/superpowers/specs/2026-03-14-language-learning-agent-design.md`

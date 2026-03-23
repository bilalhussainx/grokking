Wd# Language Learning Voice Architecture

## Overview

The voice system uses a **dual-backend architecture** optimized for language quality:

| Backend | Languages | STT | LLM | TTS | Protocol |
|---------|-----------|-----|-----|-----|----------|
| **Deepgram Agent** | es, fr, zh, de, it, ja | Deepgram Nova-3 | Moonshot Kimi K2 | Deepgram Aura-2 | WebSocket |
| **Sarvam** | hi, ur, **pa**, ar | **Sarvam Saaras v3** | **Sarvam-30B** | **Sarvam Bulbul v3** | HTTP Polling |

## Why Two Backends?

**Deepgram Agent** bundles STT+LLM+TTS in one WebSocket. Great for languages where Deepgram has native voices.

**Orchestrated** separates the pipeline: Deepgram STT → Moonshot LLM → Sarvam TTS. Required for Indic/Arabic languages where Deepgram's English-accented voices are unacceptable.

## File Structure

```
src/
├── hooks/
│   ├── useVoiceAgent.ts              # Main hook - routes to appropriate backend
│   ├── useDeepgramAgent.ts           # WebSocket client for Deepgram
│   └── useOrchestratedVoiceAgent.ts  # HTTP polling for Sarvam languages
├── app/api/language/
│   ├── voice-session/route.ts        # Deepgram Agent endpoint
│   └── voice-orchestrated/route.ts   # Custom pipeline endpoint
└── lib/language-personas.ts          # Persona configs with voice providers
```

## Environment Variables

```bash
# Deepgram (STT + TTS for Latin/CJK languages)
DEEPGRAM_API_KEY=your-key

# Moonshot API (LLM brain for all languages)
MOONSHOT_API_KEY=your-key

# Sarvam API (TTS for Hindi/Urdu/Punjabi/Arabic)
SARVAM_API_KEY=sk_km2v9h4x_2aYgDDc7GSb7SuvtRbC976sE
```

## Language Routing

Edit `ORCHESTRATED_LANGUAGES` in two files to change routing:

**src/hooks/useVoiceAgent.ts:**
```typescript
const ORCHESTRATED_LANGUAGES = ['hi', 'ur', 'pa', 'ar'];
```

**src/app/api/language/sarvam/route.ts:**
```typescript
const ORCHESTRATED_LANGUAGES = ['hi', 'ur', 'pa', 'ar'];
```

## Adding a New Sarvam Language

1. Add language code to both `ORCHESTRATED_LANGUAGES` arrays
2. Add Sarvam speaker mapping in `voice-orchestrated/route.ts`:
```typescript
const SARVAM_SPEAKERS: Record<string, string> = {
  hi: 'meera',
  ur: 'neha',
  // Add new: languageCode: 'sarvam-speaker-name'
};
```
3. Add Sarvam language code mapping:
```typescript
const langMap: Record<string, string> = {
  hi: 'hi-IN',
  ur: 'ur-IN',
  // Add new: 'language-code': 'sarvam-language-code'
};
```

## Sarvam Speakers Available

| Speaker | Language | Gender | Quality |
|---------|----------|--------|---------|
| `meera` | Hindi | Female | Premium - best for Hindi |
| `neha` | Hindi/Urdu | Female | Good for Urdu and general Indic |
| `mehak` | Punjabi | Female | Native Punjabi speaker |
| `piyush` | Hindi | Male | Male voice for Hindi |
| `arvind` | Hindi | Male | Alternative male voice |

See full list: https://docs.sarvam.ai/api-reference/text-to-speech

See Sarvam docs for full list: https://docs.sarvam.ai/api-reference/text-to-speech

## Testing

### Test Deepgram languages (Spanish, French, Mandarin):
```bash
curl -X POST http://localhost:3000/api/language/voice-session \
  -H "Content-Type: application/json" \
  -d '{"language":"es","personaId":"es-conversational-carlos"}'
```

### Test Orchestrated languages (Hindi, Urdu):
```bash
# Health check
curl http://localhost:3000/api/language/voice_sarvam/health

# Full test requires audio file
```

## Known Issues & TODOs

1. **Arabic via Sarvam**: Sarvam has limited Arabic support. May need MiniMax fallback.
2. **WebSocket vs Polling**: Orchestrated uses 3-second recording chunks. Less real-time than Deepgram.
3. **Cost tracking**: Orchestrated deducts per-turn, Deepgram deducts per-minute via heartbeat.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Talk Page                               │
│                    (src/app/talk/page.tsx)                      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │    useVoiceAgent      │
            │  (routes by language) │
            └───────────┬───────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
   ┌────▼─────┐                  ┌──────▼──────┐
   │  Latin/  │                  │   Indic/    │
   │   CJK    │                  │   Arabic    │
   │          │                  │             │
   │ es, fr,  │                  │ hi, ur,     │
   │ zh, etc  │                  │ pa, ar      │
   └────┬─────┘                  └──────┬──────┘
        │                               │
   ┌────▼─────────────────┐    ┌────────▼──────────┐
   │   useDeepgramAgent   │    │ useOrchestrated   │
   │     (WebSocket)      │    │   (HTTP Polling)  │
   └────┬─────────────────┘    └────────┬──────────┘
        │                               │
   ┌────▼────┐                    ┌─────▼─────┐
   │Deepgram │                    │  /api/    │
   │  Agent  │                    │language/  │
   │WebSocket│                    │voice-     │
   │         │                    │orchestrated
   │ STT+TTS │                    │           │
   │+Moonshot│                    │ STT: Deep │
   │  (LLM)  │                    │ LLM: Moon │
   └─────────┘                    │ TTS:Sarvam│
                                  └───────────┘
```

## Credits & Costs

| Component | Cost |
|-----------|------|
| Deepgram STT | ~$0.0043/min (Nova-3) |
| Deepgram TTS | ~$0.0015/min (Aura-2) |
| Moonshot LLM | ~$0.50/1M tokens |
| Sarvam TTS | Check Sarvam pricing |

## Current Status

✅ **Completed:**
- Deepgram Agent for Spanish, French, Mandarin
- Orchestrated pipeline for Hindi, Urdu, Punjabi, Arabic
- Sarvam TTS integration with proper speakers
- Punjabi personas (Giani Ji, Jazzy, Bebe)
- Automatic routing based on language code

🔄 **In Progress / TODO:**
1. **Test Hindi/Urdu/Punjabi with Sarvam**: Verify audio quality is acceptable
2. **Arabic fallback**: If Sarvam Arabic is poor, implement MiniMax TTS
3. **Real-time streaming**: Convert orchestrated from polling to WebSocket
4. **Voice selection UI**: Let users choose male/female voice per language

## Testing Checklist for Claude Code

After making changes, test each language:

```bash
# 1. Test orchestrated endpoint health
curl http://localhost:3000/api/language/voice-orchestrated/health

# 2. Test Spanish (Deepgram Agent)
curl -X POST http://localhost:3000/api/language/voice-session \
  -H "Content-Type: application/json" \
  -d '{"language":"es","personaId":"es-conversational-carlos"}'

# 3. Test Hindi (Orchestrated) - requires audio file
# Use the Talk page at http://localhost:3000/talk
```

## For Claude Code: Continue From Here

**Current State:**
- API key added: `SARVAM_API_KEY=sk_km2v9h4x_2aYgDDc7GSb7SuvtRbC976sE`
- Routing implemented in `useVoiceAgent.ts`
- Orchestrated endpoint at `/api/language/voice-orchestrated`
- Punjabi personas added

**To Test:**
1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/talk
3. Select Hindi/Urdu/Punjabi
4. Start conversation
5. Verify Sarvam audio quality

**If Sarvam audio has issues:**
- Check browser console for API errors
- Verify `SARVAM_API_KEY` is in `.env.local`
- Test Sarvam directly with their API docs

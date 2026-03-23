# Real-Time Translated Phone Calls

**Date:** 2026-03-23
**Status:** Approved, implementing

## Overview

Phone-to-phone real-time translation. User A calls a Samsara number, enters User B's phone number. System calls User B. Both hear each other translated in their own language with <2s latency.

## Architecture

```
User A (Phone) ──dial──▶ Twilio Number (inbound)
                              │
                         POST /api/call/incoming
                              │
                         IVR: "What language?" → gather
                         IVR: "Enter phone number" → gather
                              │
                         POST /api/call/connect
                              │
User B (Phone) ◀──ring── Twilio (outbound call)
                              │
                         IVR: "What language?" → gather
                              │
                         Media Streams opened (both legs)
                              │
                    ┌─────────┴─────────┐
                    │                   │
              Leg A Stream        Leg B Stream
              (mulaw 8kHz)        (mulaw 8kHz)
                    │                   │
              Deepgram STT        Deepgram STT
              (streaming)         (streaming)
                    │                   │
              Moonshot Translate   Moonshot Translate
              (A lang → B lang)   (B lang → A lang)
                    │                   │
              Deepgram TTS        Deepgram TTS
              (B voice)           (A voice)
                    │                   │
              Send to Leg B       Send to Leg A
```

## Latency Budget (<2 seconds)

| Step | Time | Technique |
|------|------|-----------|
| Audio capture | 0ms | Twilio streams continuously |
| Voice activity detection | ~300ms | Wait for speech endpoint |
| Deepgram STT | ~200ms | Streaming partials, start translating on first words |
| Moonshot translate | ~300ms | Streaming, start TTS on first translated words |
| Deepgram TTS | ~200ms | Streaming audio generation |
| Network overhead | ~100ms | Twilio ↔ Server ↔ Deepgram |
| **Total** | **~1.1s** | Pipeline overlap saves ~800ms vs sequential |

## API Routes

### POST /api/call/incoming
Twilio webhook when User A dials in. Returns TwiML with language gather.

### POST /api/call/gather
Receives DTMF/speech for language choice and phone number. Initiates outbound call to User B.

### POST /api/call/connect
Called when User B picks up. Gathers User B's language, then starts Media Streams on both legs.

### POST /api/call/status
Status callback — call ended. Logs duration, deducts credits, saves transcript.

### WebSocket /api/call/media-stream
Receives Twilio Media Stream (mulaw audio). Runs translation pipeline. Sends translated audio back.

## Database Schema

```sql
CREATE TABLE call_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  caller_id UUID REFERENCES auth.users,
  caller_phone TEXT NOT NULL,
  callee_phone TEXT NOT NULL,
  caller_language TEXT NOT NULL,
  callee_language TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  credits_used INTEGER DEFAULT 0,
  status TEXT DEFAULT 'initiating',
  transcript JSONB DEFAULT '[]',
  twilio_call_sid_a TEXT,
  twilio_call_sid_b TEXT,
  ended_at TIMESTAMPTZ
);
```

## Credit Pricing

5 credits/minute. Covers:
- Twilio: ~$0.026/min (both legs)
- Deepgram STT: ~$0.01/min (both legs)
- Deepgram TTS: ~$0.015/min (both legs)
- Moonshot: ~$0.01/min (both legs)
- Total cost: ~$0.06/min
- At 5 credits ($0.15 value at $15/500 credits) = healthy margin

## Supported Languages (MVP)

7 Deepgram languages for <2s latency:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Dutch (nl)
- Japanese (ja)

## UI Components

### /call page — three states:

**State 1: Initiate Call**
- Language dropdowns (yours + theirs) with flag icons
- Phone number input with country code
- Animated gradient "Start Call" button (21st.dev BookCallButton style)
- Recent calls list with redial
- "Or dial in: +1-XXX-XXXX" note

**State 2: Live Call**
- Full-screen dark panel
- Audio waveform visualizer per speaker
- Real-time transcript (original + translated) scrolling
- Glowing pulse on active speaker
- Bottom control bar: Mute, End Call
- Timer + credit counter

**State 3: Call Summary**
- Duration, credits used, languages
- Full transcript with copy button
- "Start New Call" CTA

### Incoming Call Notification (IncomingCall component)
- Floating card bottom-right
- Pulsing avatar, caller info
- Accept/Decline with framer-motion

## Environment Variables

```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

## Files to Create

```
src/app/call/page.tsx                    — Call hub UI (3 states)
src/app/api/call/incoming/route.ts       — Twilio inbound webhook
src/app/api/call/gather/route.ts         — Language + phone number gather
src/app/api/call/connect/route.ts        — Bridge both legs + start streams
src/app/api/call/status/route.ts         — Call ended callback
src/app/api/call/initiate/route.ts       — Web-initiated call (POST with both numbers)
src/lib/call-bridge.ts                   — WebSocket media stream handler
src/lib/call-translate.ts               — Streaming STT→Translate→TTS pipeline
src/components/call/CallButton.tsx       — Animated gradient call button
src/components/call/LiveCall.tsx         — Active call UI with waveform
src/components/call/CallSummary.tsx      — Post-call transcript view
src/components/call/IncomingCall.tsx     — Floating notification
supabase/migrations/create_call_sessions.sql
```

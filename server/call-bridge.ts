/**
 * Real-Time Translated Call Bridge
 *
 * Standalone WebSocket server that bridges two Twilio Media Streams
 * with live translation. Each caller speaks in their language and
 * hears the other person translated into theirs.
 *
 * Architecture:
 *   Caller A (French) ──► Twilio ──► WS /stream/a/:id ──► STT ──► Translate ──► TTS ──► WS /stream/b/:id ──► Twilio ──► Caller B (hears French→English)
 *   Caller B (English) ──► Twilio ──► WS /stream/b/:id ──► STT ──► Translate ──► TTS ──► WS /stream/a/:id ──► Twilio ──► Caller A (hears English→French)
 *
 * Run:  cd server && npm install && npm run dev
 * Prod: Deploy on Railway/Fly.io/VPS, set BRIDGE_URL env on Vercel
 */

import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const PORT = parseInt(process.env.PORT || "8765", 10);
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || "";
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// ─── Language config ───
const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German",
  it: "Italian", nl: "Dutch", ja: "Japanese",
};

const DG_LANG_CODES: Record<string, string> = {
  en: "en-US", es: "es", fr: "fr", de: "de",
  it: "it", nl: "nl", ja: "ja",
};

const TTS_VOICES: Record<string, string> = {
  en: "aura-2-thalia-en", es: "aura-2-diana-es", fr: "aura-2-agathe-fr",
  de: "aura-2-viktoria-de", it: "aura-2-livia-it", nl: "aura-2-rhea-nl",
  ja: "aura-2-izanami-ja",
};

// ─── Session state ───
interface CallSession {
  id: string;
  callerLang: string;
  calleeLang: string;
  streamA: WebSocket | null;   // Caller A's Twilio stream
  streamB: WebSocket | null;   // Caller B's Twilio stream
  streamSidA: string;
  streamSidB: string;
  sttA: WebSocket | null;      // Deepgram STT for A's speech
  sttB: WebSocket | null;      // Deepgram STT for B's speech
  transcript: Array<{ speaker: string; original: string; translated: string; ts: string }>;
}

const sessions = new Map<string, CallSession>();

// ─── Translation (Moonshot) ───
async function translateText(text: string, from: string, to: string): Promise<string> {
  if (from === to || !text.trim()) return text;

  try {
    const res = await fetch("https://api.moonshot.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MOONSHOT_API_KEY}` },
      body: JSON.stringify({
        model: "kimi-k2-turbo-preview",
        messages: [
          { role: "system", content: `Translate ${LANG_NAMES[from]} to ${LANG_NAMES[to]}. Output ONLY the translation. Natural, conversational tone.` },
          { role: "user", content: text },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch {
    return text;
  }
}

// ─── TTS (Deepgram → mulaw 8kHz for Twilio) ───
async function textToSpeech(text: string, lang: string): Promise<Buffer | null> {
  if (!text.trim()) return null;
  const voice = TTS_VOICES[lang] || TTS_VOICES.en;

  try {
    const res = await fetch(
      `https://api.deepgram.com/v1/speak?model=${voice}&encoding=mulaw&sample_rate=8000&container=none`,
      {
        method: "POST",
        headers: { Authorization: `Token ${DEEPGRAM_API_KEY}`, "Content-Type": "text/plain" },
        body: text,
      }
    );
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

// ─── Deepgram streaming STT ───
function createSTTStream(lang: string, onTranscript: (text: string, isFinal: boolean) => void): WebSocket {
  const dgLang = DG_LANG_CODES[lang] || "en-US";
  const url = `wss://api.deepgram.com/v1/listen?encoding=mulaw&sample_rate=8000&channels=1&language=${dgLang}&model=nova-3&punctuate=true&endpointing=300&interim_results=true&utterance_end_ms=1000`;

  const ws = new WebSocket(url, { headers: { Authorization: `Token ${DEEPGRAM_API_KEY}` } });

  ws.on("open", () => console.log(`  [STT] Connected (${lang})`));
  ws.on("error", (err) => console.error(`  [STT] Error:`, err.message));

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === "Results" && msg.channel?.alternatives?.[0]) {
        const alt = msg.channel.alternatives[0];
        const text = alt.transcript?.trim();
        if (text) {
          onTranscript(text, msg.is_final === true);
        }
      }
    } catch {}
  });

  return ws;
}

// ─── Send translated audio to a Twilio stream ───
function sendAudioToTwilio(ws: WebSocket, streamSid: string, audioBuffer: Buffer) {
  // Twilio expects base64-encoded mulaw audio in 20ms chunks (160 bytes at 8kHz)
  const CHUNK_SIZE = 160;
  for (let i = 0; i < audioBuffer.length; i += CHUNK_SIZE) {
    const chunk = audioBuffer.subarray(i, Math.min(i + CHUNK_SIZE, audioBuffer.length));
    const msg = JSON.stringify({
      event: "media",
      streamSid,
      media: { payload: chunk.toString("base64") },
    });
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}

// ─── Store transcript in Supabase ───
async function saveTranscript(sessionId: string, transcript: CallSession["transcript"]) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/call_sessions?id=eq.${sessionId}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ transcript, status: "active" }),
    });
  } catch {}
}

// ─── Handle full translation pipeline for one direction ───
function setupTranslationPipeline(
  session: CallSession,
  speakerSide: "a" | "b"
) {
  const speakerLang = speakerSide === "a" ? session.callerLang : session.calleeLang;
  const listenerLang = speakerSide === "a" ? session.calleeLang : session.callerLang;
  const listenerStream = speakerSide === "a" ? session.streamB : session.streamA;
  const listenerStreamSid = speakerSide === "a" ? session.streamSidB : session.streamSidA;
  const speakerLabel = speakerSide === "a" ? "caller" : "callee";

  let pendingText = "";

  const stt = createSTTStream(speakerLang, async (text, isFinal) => {
    if (!isFinal) {
      pendingText = text; // Accumulate interim
      return;
    }

    const finalText = text || pendingText;
    pendingText = "";
    if (!finalText) return;

    console.log(`  [${speakerSide.toUpperCase()}] ${LANG_NAMES[speakerLang]}: "${finalText}"`);

    // Translate
    const translated = await translateText(finalText, speakerLang, listenerLang);
    console.log(`  [${speakerSide.toUpperCase()}] → ${LANG_NAMES[listenerLang]}: "${translated}"`);

    // Store transcript
    session.transcript.push({
      speaker: speakerLabel,
      original: finalText,
      translated,
      ts: new Date().toISOString(),
    });
    saveTranscript(session.id, session.transcript);

    // TTS in listener's language
    const audio = await textToSpeech(translated, listenerLang);
    if (audio && listenerStream && listenerStream.readyState === WebSocket.OPEN) {
      // Clear any queued audio first
      listenerStream.send(JSON.stringify({ event: "clear", streamSid: listenerStreamSid }));
      sendAudioToTwilio(listenerStream, listenerStreamSid, audio);
    }
  });

  return stt;
}

// ─── Express app for TwiML webhooks ───
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true, sessions: sessions.size }));

// TwiML webhook for Caller A
app.post("/voice/a/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const host = req.headers.host || "localhost:8765";
  const protocol = req.secure ? "wss" : "wss"; // Always use wss in production

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Connected. Starting real-time translation.</Say>
  <Connect>
    <Stream url="wss://${host}/stream/a/${sessionId}" />
  </Connect>
</Response>`;

  res.type("text/xml").send(twiml);
});

// TwiML webhook for Caller B
app.post("/voice/b/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const callerLang = req.query.callerLang as string || "en";
  const calleeLang = req.query.calleeLang as string || "es";
  const host = req.headers.host || "localhost:8765";

  // Create or update session
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      callerLang,
      calleeLang,
      streamA: null, streamB: null,
      streamSidA: "", streamSidB: "",
      sttA: null, sttB: null,
      transcript: [],
    });
  } else {
    const s = sessions.get(sessionId)!;
    s.callerLang = callerLang;
    s.calleeLang = calleeLang;
  }

  const callerName = LANG_NAMES[callerLang] || "English";
  const calleeName = LANG_NAMES[calleeLang] || "Spanish";

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">You have a translated call. You speak ${calleeName}, they speak ${callerName}. Starting now.</Say>
  <Connect>
    <Stream url="wss://${host}/stream/b/${sessionId}" />
  </Connect>
</Response>`;

  res.type("text/xml").send(twiml);
});

// ─── HTTP + WebSocket server ───
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  const url = req.url || "";
  const match = url.match(/\/stream\/(a|b)\/(.+)/);
  if (!match) {
    ws.close(1008, "Invalid path");
    return;
  }

  const [, side, sessionId] = match;
  console.log(`[Bridge] Stream ${side.toUpperCase()} connected for session ${sessionId}`);

  // Ensure session exists
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      callerLang: "en",
      calleeLang: "es",
      streamA: null, streamB: null,
      streamSidA: "", streamSidB: "",
      sttA: null, sttB: null,
      transcript: [],
    });
  }

  const session = sessions.get(sessionId)!;

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.event === "start") {
        const streamSid = msg.start?.streamSid || "";
        console.log(`  [${side.toUpperCase()}] Stream started: ${streamSid}`);

        if (side === "a") {
          session.streamA = ws;
          session.streamSidA = streamSid;
        } else {
          session.streamB = ws;
          session.streamSidB = streamSid;
        }

        // Start STT pipeline for this side
        const stt = setupTranslationPipeline(session, side as "a" | "b");
        if (side === "a") session.sttA = stt;
        else session.sttB = stt;
      }

      if (msg.event === "media" && msg.media?.payload) {
        // Forward raw audio to Deepgram STT
        const audioBuffer = Buffer.from(msg.media.payload, "base64");
        const stt = side === "a" ? session.sttA : session.sttB;
        if (stt && stt.readyState === WebSocket.OPEN) {
          stt.send(audioBuffer);
        }
      }

      if (msg.event === "stop") {
        console.log(`  [${side.toUpperCase()}] Stream stopped`);
      }
    } catch {}
  });

  ws.on("close", () => {
    console.log(`[Bridge] Stream ${side.toUpperCase()} disconnected for ${sessionId}`);

    // Close STT
    const stt = side === "a" ? session.sttA : session.sttB;
    if (stt && stt.readyState === WebSocket.OPEN) {
      stt.send(JSON.stringify({ type: "CloseStream" }));
      stt.close();
    }

    if (side === "a") { session.streamA = null; session.sttA = null; }
    else { session.streamB = null; session.sttB = null; }

    // Clean up session if both disconnected
    if (!session.streamA && !session.streamB) {
      console.log(`[Bridge] Session ${sessionId} fully closed`);
      sessions.delete(sessionId);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║  Samsara Call Bridge - Real-Time Translation ║
╠══════════════════════════════════════════════╣
║  Port:     ${PORT}                              ║
║  Health:   http://localhost:${PORT}/health        ║
║  Streams:  wss://host/stream/a/:id            ║
║            wss://host/stream/b/:id            ║
╚══════════════════════════════════════════════╝
  `);
});

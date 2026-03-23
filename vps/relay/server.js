/**
 * WebSocket Relay Server for Language Learning Voice Agent
 * 
 * Routes audio/text between:
 * - Browser (WebSocket client)
 * - Faster-Whisper (STT)
 * - Moonshot API (LLM - Kimi K2)
 * - Kokoro (TTS)
 * 
 * Also handles:
 * - Credit metering heartbeat
 * - Session management
 * - Transcript logging
 */

const WebSocket = require('ws');
const http = require('http');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
// fetch is available natively in Node 18+

// Configuration
const PORT = process.env.PORT || 8080;
const WHISPER_URL = process.env.WHISPER_URL || 'http://localhost:8001';
const KOKORO_URL = process.env.KOKORO_URL || 'http://localhost:8002';
const MOONSHOT_API_KEY = process.env.MOONSHOT_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Active sessions
const sessions = new Map();

// ============================================
// HTTP Server (for health checks)
// ============================================
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health' && req.method === 'GET') {
    checkServices().then(status => {
      res.writeHead(status.healthy ? 200 : 503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(status));
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// ============================================
// WebSocket Server
// ============================================
const wss = new WebSocket.Server({ server });

wss.on('connection', async (ws, req) => {
  console.log('[Relay] New WebSocket connection');

  // Parse token from query string
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    console.log('[Relay] Connection rejected: No token');
    ws.close(1008, 'Missing authentication token');
    return;
  }

  // Verify token and get user info
  let session;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    session = {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      ws,
      transcript: [],
      mistakesFound: [],
      newVocab: [],
      startTime: Date.now(),
      lastActivity: Date.now(),
      heartbeatInterval: null,
      isProcessing: false,
    };
  } catch (err) {
    console.log('[Relay] Connection rejected: Invalid token');
    ws.close(1008, 'Invalid authentication token');
    return;
  }

  // Store session
  sessions.set(session.sessionId, session);
  console.log(`[Relay] Session ${session.sessionId} started for user ${session.userId}`);

  // Start credit metering heartbeat
  startHeartbeat(session);

  // Handle messages from client
  ws.on('message', async (data) => {
    session.lastActivity = Date.now();

    try {
      // Binary data = audio chunk
      if (data instanceof Buffer) {
        await handleAudioChunk(session, data);
        return;
      }

      // JSON data = control message
      const message = JSON.parse(data.toString());
      await handleControlMessage(session, message);
    } catch (err) {
      console.error('[Relay] Error handling message:', err);
      sendError(ws, 'Failed to process message');
    }
  });

  // Handle close
  ws.on('close', () => {
    console.log(`[Relay] Session ${session.sessionId} closed`);
    cleanupSession(session);
  });

  // Handle errors
  ws.on('error', (err) => {
    console.error(`[Relay] WebSocket error for session ${session.sessionId}:`, err);
    cleanupSession(session);
  });

  // Send connected message
  ws.send(JSON.stringify({ type: 'connected' }));
});

// ============================================
// Message Handlers
// ============================================

async function handleControlMessage(session, message) {
  const { type } = message;

  switch (type) {
    case 'settings':
      // Store session settings
      session.settings = message;
      console.log(`[Relay] Settings received for session ${session.sessionId}`);
      session.ws.send(JSON.stringify({ type: 'connected' }));
      break;

    case 'update_prompt':
      // Update system prompt mid-session
      if (session.settings) {
        session.settings.systemPrompt = message.prompt;
      }
      break;

    case 'end_session':
      // End session gracefully
      await endSession(session);
      break;

    default:
      console.log(`[Relay] Unknown message type: ${type}`);
  }
}

async function handleAudioChunk(session, audioData) {
  if (session.isProcessing) {
    // Skip if already processing (simple rate limiting)
    return;
  }

  session.isProcessing = true;

  try {
    // 1. Send audio to Whisper for transcription
    const transcription = await transcribeAudio(audioData);
    
    if (!transcription || transcription.trim().length === 0) {
      session.isProcessing = false;
      return;
    }

    console.log(`[Relay] User said: ${transcription}`);

    // Send transcription to client
    session.ws.send(JSON.stringify({
      type: 'user_transcript',
      text: transcription,
    }));

    // Store in transcript
    session.transcript.push({
      role: 'user',
      text: transcription,
      timestamp: new Date().toISOString(),
    });

    // 2. Send user message to Moonshot API for response
    const agentResponse = await generateResponse(session, transcription);
    
    console.log(`[Relay] Agent response: ${agentResponse.text}`);

    // 3. Stream TTS audio
    await streamTTS(session, agentResponse.text);

    // 4. Extract metadata if present
    if (agentResponse.metadata) {
      handleMetadata(session, agentResponse.metadata);
    }

    // Store agent response
    session.transcript.push({
      role: 'assistant',
      text: agentResponse.text,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[Relay] Error processing audio:', err);
    sendError(session.ws, 'Processing error');
  } finally {
    session.isProcessing = false;
  }
}

// ============================================
// Service Calls
// ============================================

async function transcribeAudio(audioData) {
  const response = await fetch(`${WHISPER_URL}/v1/transcriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'audio/wav',
    },
    body: audioData,
  });

  if (!response.ok) {
    throw new Error(`Whisper error: ${response.status}`);
  }

  const data = await response.json();
  return data.text || '';
}

async function generateResponse(session, userText) {
  const settings = session.settings || {};
  const systemPrompt = settings.systemPrompt || `You are a helpful language tutor.`;
  
  // Use API key from environment only (security: never trust client)
  if (!MOONSHOT_API_KEY) {
    throw new Error('Moonshot API key not configured on server');
  }

  // Build conversation history
  const messages = [
    { role: 'system', content: systemPrompt },
    ...session.transcript.slice(-10).map(t => ({ role: t.role === 'user' ? 'user' : 'assistant', content: t.text })),
    { role: 'user', content: userText },
  ];

  const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MOONSHOT_API_KEY}`,
    },
    body: JSON.stringify({
      model: settings.llmModel || 'kimi-k2-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Moonshot API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const fullText = data.choices?.[0]?.message?.content || '';
  
  // Parse response for metadata (if JSON is embedded)
  const { text, metadata } = parseResponse(fullText);

  return { text, metadata };
}

async function streamTTS(session, text) {
  const settings = session.settings || {};
  const voiceId = settings.voiceId || 'af_bella';

  // Send agent response text first
  session.ws.send(JSON.stringify({
    type: 'agent_response',
    text,
  }));

  // Get TTS audio from Kokoro - request PCM for raw streaming
  const response = await fetch(`${KOKORO_URL}/v1/audio/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'kokoro-82M',
      input: text,
      voice: voiceId,
      response_format: 'pcm',  // Raw PCM 24kHz mono for streaming
    }),
  });

  if (!response.ok) {
    throw new Error(`Kokoro error: ${response.status}`);
  }

  // Get audio buffer
  const audioBuffer = await response.arrayBuffer();
  
  // Send in chunks for streaming playback
  const chunkSize = 8192; // 8KB chunks
  const totalChunks = Math.ceil(audioBuffer.byteLength / chunkSize);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, audioBuffer.byteLength);
    const chunk = audioBuffer.slice(start, end);
    
    session.ws.send(Buffer.from(chunk));
  }

  // Signal audio done
  session.ws.send(JSON.stringify({ type: 'agent_done' }));
}

// ============================================
// Helper Functions
// ============================================

function parseResponse(fullText) {
  // Try to extract JSON metadata from response
  const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/) || 
                    fullText.match(/\{[\s\S]*"mistakesDetected"[\s\S]*\}/);
  
  if (jsonMatch) {
    try {
      const metadata = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      const text = fullText.replace(jsonMatch[0], '').trim();
      return { text, metadata };
    } catch {
      // Fall through
    }
  }

  return { text: fullText, metadata: null };
}

function handleMetadata(session, metadata) {
  if (metadata.mistakesDetected?.length > 0) {
    session.mistakesFound.push(...metadata.mistakesDetected);
  }
  if (metadata.vocabUsedCorrectly?.length > 0) {
    session.newVocab.push(...metadata.vocabUsedCorrectly);
  }

  // Send metadata to client
  session.ws.send(JSON.stringify({
    type: 'metadata',
    metadata,
  }));
}

function sendError(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'error', error: message }));
  }
}

function startHeartbeat(session) {
  // Deduct credits every minute
  session.heartbeatInterval = setInterval(async () => {
    try {
      const result = await supabase.rpc('deduct_credits', {
        p_user_id: session.userId,
        p_amount: 3, // 3 credits per minute
        p_action: 'voice_minute',
        p_ref_id: session.sessionId,
      });

      if (!result.data) {
        // Insufficient credits - warn and disconnect soon
        session.ws.send(JSON.stringify({
          type: 'session_ending',
          reason: 'insufficient_credits',
          secondsRemaining: 15,
        }));

        setTimeout(() => {
          endSession(session);
        }, 15000);
      }
    } catch (err) {
      console.error('[Relay] Heartbeat error:', err);
    }
  }, 60000); // Every 60 seconds
}

async function endSession(session) {
  // Clear heartbeat
  if (session.heartbeatInterval) {
    clearInterval(session.heartbeatInterval);
  }

  // Calculate duration
  const durationSeconds = Math.floor((Date.now() - session.startTime) / 1000);

  // Save session to database
  try {
    await supabase.from('language_sessions').insert({
      user_id: session.userId,
      target_language: session.settings?.language || 'es',
      persona_id: session.settings?.personaId || 'default',
      scenario: session.settings?.scenario || 'free_practice',
      lesson_id: session.settings?.lessonTitle || null,
      duration_seconds: durationSeconds,
      transcript: session.transcript,
      mistakes_found: session.mistakesFound,
      new_vocab: session.newVocab,
      proficiency_delta: 0,
      agent_summary: generateSummary(session),
    });

    // Update practice stats
    await supabase.rpc('update_practice_stats', {
      p_user_id: session.userId,
      p_target_language: session.settings?.language || 'es',
      p_duration_seconds: durationSeconds,
    });
  } catch (err) {
    console.error('[Relay] Failed to save session:', err);
  }

  // Close WebSocket
  if (session.ws.readyState === WebSocket.OPEN) {
    session.ws.send(JSON.stringify({ type: 'disconnected' }));
    session.ws.close();
  }

  cleanupSession(session);
}

function cleanupSession(session) {
  if (session.heartbeatInterval) {
    clearInterval(session.heartbeatInterval);
  }
  sessions.delete(session.sessionId);
}

function generateSummary(session) {
  const duration = Math.floor((Date.now() - session.startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const userMessages = session.transcript.filter(t => t.role === 'user').length;
  
  return `Practice session: ${minutes} minutes, ${userMessages} exchanges. ${session.mistakesFound.length} mistakes identified for review.`;
}

async function checkServices() {
  const status = {
    healthy: true,
    whisper: false,
    kokoro: false,
    moonshot: false,
    latency: 0,
    checkedAt: new Date().toISOString(),
  };

  const startTime = Date.now();

  try {
    console.log('[Health] Checking Whisper...');
    const whisperRes = await fetch(`${WHISPER_URL}/health`).catch(e => {
      console.log('[Health] Whisper error:', e.message);
      return null;
    });
    status.whisper = whisperRes?.ok || false;
    console.log('[Health] Whisper:', status.whisper);

    console.log('[Health] Checking Kokoro...');
    const kokoroRes = await fetch(`${KOKORO_URL}/health`).catch(e => {
      console.log('[Health] Kokoro error:', e.message);
      return null;
    });
    status.kokoro = kokoroRes?.ok || false;
    console.log('[Health] Kokoro:', status.kokoro);

    // Check Moonshot API (lightweight check - just validate key exists)
    if (MOONSHOT_API_KEY) {
      // Simple models list call to verify connectivity
      const moonshotRes = await fetch('https://api.moonshot.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${MOONSHOT_API_KEY}`,
        },
      }).catch(e => {
        console.log('[Health] Moonshot error:', e.message);
        return null;
      });
      status.moonshot = moonshotRes?.ok || false;
      console.log('[Health] Moonshot:', status.moonshot);
    } else {
      console.log('[Health] Moonshot: No API key configured');
      status.moonshot = false;
    }

    status.healthy = status.whisper && status.kokoro && status.moonshot;
  } catch (err) {
    console.error('[Health] Check failed:', err);
    status.healthy = false;
  }

  status.latency = Date.now() - startTime;
  console.log('[Health] Overall:', status.healthy);
  return status;
}

// ============================================
// Start Server
// ============================================
server.listen(PORT, () => {
  console.log(`[Relay] Server listening on port ${PORT}`);
  console.log(`[Relay] Whisper: ${WHISPER_URL}`);
  console.log(`[Relay] Kokoro: ${KOKORO_URL}`);
  console.log(`[Relay] Moonshot API: ${MOONSHOT_API_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
});

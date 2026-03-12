/**
 * MCP Bridge Server - Connects Grokking Platform to OpenClaw Gateway
 * 
 * This server:
 * - Accepts WebSocket connections from students (Grokking website)
 * - Routes coaching requests to OpenClaw Gateway (SuperCore AI)
 * - Streams real AI coaching responses back to students
 * - Handles voice generation via ElevenLabs
 */

import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Configuration
const OPENCLAW_GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3000';
const OPENCLAW_API_TOKEN = process.env.OPENCLAW_API_TOKEN || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const PORT = process.env.PORT || 3001;

// Session storage
interface CoachSession {
  userId: string;
  ws: WebSocket;
  openclawSessionKey?: string;
  currentProblem?: string;
  code?: string;
  lastActivity: Date;
  hintsGiven: number;
  messageHistory: any[];
}

const sessions = new Map<string, CoachSession>();

// Emotion-based voice settings
const emotionSettings = {
  encouraging: { stability: 0.6, similarity_boost: 0.8 },
  teaching: { stability: 0.7, similarity_boost: 0.75 },
  celebrating: { stability: 0.5, similarity_boost: 0.9 },
  gentle_nudge: { stability: 0.65, similarity_boost: 0.7 },
  neutral: { stability: 0.5, similarity_boost: 0.75 },
};

/**
 * Generate voice audio using ElevenLabs TTS
 */
async function generateVoice(text: string, emotion: keyof typeof emotionSettings = 'neutral'): Promise<string | null> {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
    console.warn('ElevenLabs not configured, skipping voice');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: emotionSettings[emotion],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    return `data:audio/mp3;base64,${base64Audio}`;
  } catch (error) {
    console.error('Voice generation failed:', error);
    return null;
  }
}

/**
 * Send message to OpenClaw Gateway (SuperCore AI) for coaching
 */
async function askOpenClawCoach(
  session: CoachSession,
  prompt: string
): Promise<string> {
  try {
    // Use OpenClaw's sessions_send API to send to isolated coach session
    const response = await fetch(`${OPENCLAW_GATEWAY_URL}/api/v1/sessions/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_API_TOKEN}`,
      },
      body: JSON.stringify({
        label: `coach-${session.userId}`, // Isolated session per user
        message: prompt,
        agentId: 'main', // Use main OpenClaw agent (SuperCore)
        timeoutSeconds: 30,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenClaw API error: ${response.status}`);
    }

    const result = await response.json();
    return result.response || "I'm here to help! Keep going!";
  } catch (error) {
    console.error('OpenClaw coaching failed:', error);
    
    // Fallback to local coaching logic
    return "I'm here if you need help! You're doing great!";
  }
}

/**
 * Build coaching prompt with context
 */
function buildCoachingPrompt(
  session: CoachSession,
  eventType: string,
  data: any
): string {
  const contextLines = [
    `You are Coach Alex, an AI coding interview coach integrated into the Grokking platform.`,
    `You're helping student "${session.userId}" through a coding problem.`,
    ``,
    `CURRENT CONTEXT:`,
    `- Problem: ${session.currentProblem || 'Not started'}`,
    `- Hints given so far: ${session.hintsGiven}`,
    `- Current code: ${session.code ? `${session.code.length} chars` : 'No code yet'}`,
    ``,
  ];

  switch (eventType) {
    case 'problem_started':
      contextLines.push(
        `EVENT: Student started problem "${data.title}"`,
        ``,
        `Give a brief, encouraging welcome (2-3 sentences). Let them know you're here to help!`
      );
      break;

    case 'code_updated':
      contextLines.push(
        `EVENT: Student is actively coding`,
        ``,
        `Give a brief encouragement (1-2 sentences). Don't give away the solution!`
      );
      break;

    case 'hint_requested':
      contextLines.push(
        `EVENT: Student requested hint #${session.hintsGiven + 1}`,
        `Code so far: ${session.code || 'None'}`,
        ``,
        `Provide a strategic hint (2-3 sentences). Progressive hints:`,
        `- Hint 1: Point to the pattern/approach`,
        `- Hint 2: Explain the key data structure`,
        `- Hint 3: Break down the steps`,
        `- Hint 4+: More specific guidance`,
        ``,
        `Don't give the full solution! Help them think through it.`
      );
      break;

    case 'test_results':
      contextLines.push(
        `EVENT: Student ran tests`,
        `Passed: ${data.passed}/${data.total}`,
        ``,
        `Give feedback on their test results (2-3 sentences). ${
          data.passed === data.total
            ? 'Celebrate their success!'
            : 'Encourage them to debug failing cases.'
        }`
      );
      break;

    case 'student_stuck':
      contextLines.push(
        `EVENT: Student seems stuck (inactive for a while)`,
        ``,
        `Offer gentle help (1-2 sentences). Ask if they want a hint.`
      );
      break;

    case 'concept_explain':
      contextLines.push(
        `EVENT: Student wants to understand the pattern "${data.pattern}"`,
        ``,
        `Explain the concept clearly (3-4 sentences). Focus on intuition, not code.`
      );
      break;

    case 'voice_message':
      contextLines.push(
        `EVENT: Student spoke via voice`,
        `Message: "${data.transcript}"`,
        ``,
        `Respond naturally to their spoken message (2-3 sentences).`
      );
      break;

    default:
      contextLines.push(`EVENT: ${eventType}`, `Data: ${JSON.stringify(data)}`);
  }

  contextLines.push(
    ``,
    `IMPORTANT:`,
    `- Keep response SHORT (2-3 sentences) - it will be spoken aloud!`,
    `- Be encouraging and professional`,
    `- Don't give away solutions, guide thinking`,
    `- Sound natural and conversational`
  );

  return contextLines.join('\n');
}

/**
 * Handle WebSocket connections from students
 */
wss.on('connection', (ws: WebSocket, req) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const userId = url.searchParams.get('user') || `student-${Date.now()}`;

  console.log(`🎓 Student connected: ${userId}`);

  const session: CoachSession = {
    userId,
    ws,
    lastActivity: new Date(),
    hintsGiven: 0,
    messageHistory: [],
  };

  sessions.set(userId, session);

  // Send welcome message
  const welcomeText = "Hey! I'm Coach SuperCore from OpenClaw, your AI coding companion. I'm here to help you master this problem. Let's do this!";
  
  ws.send(JSON.stringify({
    type: 'coach_message',
    text: welcomeText,
    emotion: 'encouraging',
    timestamp: new Date(),
  }));

  // Generate and send welcome voice
  generateVoice(welcomeText, 'encouraging').then((audioUrl) => {
    if (audioUrl) {
      ws.send(JSON.stringify({
        type: 'voice_audio',
        audioUrl,
      }));
    }
  });

  // Handle messages from student
  ws.on('message', async (data) => {
    try {
      const event = JSON.parse(data.toString());
      session.lastActivity = new Date();

      console.log(`📨 Event from ${userId}:`, event.type);

      // Track message in history
      session.messageHistory.push({
        type: event.type,
        timestamp: new Date(),
        data: event.data,
      });

      let coachResponse = '';
      let emotion: keyof typeof emotionSettings = 'neutral';

      switch (event.type) {
        case 'problem_started':
          session.currentProblem = event.data.title;
          const startPrompt = buildCoachingPrompt(session, 'problem_started', event.data);
          coachResponse = await askOpenClawCoach(session, startPrompt);
          emotion = 'encouraging';
          break;

        case 'code_updated':
          session.code = event.data.code;
          
          // Only respond if significant code added
          if (event.data.code.length > 100 && (!session.code || session.code.length < 50)) {
            const codePrompt = buildCoachingPrompt(session, 'code_updated', event.data);
            coachResponse = await askOpenClawCoach(session, codePrompt);
            emotion = 'encouraging';
          } else {
            return; // Don't spam on every keystroke
          }
          break;

        case 'hint_requested':
          session.hintsGiven++;
          const hintPrompt = buildCoachingPrompt(session, 'hint_requested', {
            code: session.code,
            hintsGiven: session.hintsGiven,
          });
          coachResponse = await askOpenClawCoach(session, hintPrompt);
          emotion = 'gentle_nudge';
          
          ws.send(JSON.stringify({
            type: 'hint',
            text: coachResponse,
            level: session.hintsGiven,
          }));
          
          const hintAudio = await generateVoice(coachResponse, emotion);
          if (hintAudio) {
            ws.send(JSON.stringify({ type: 'voice_audio', audioUrl: hintAudio }));
          }
          return; // Already sent, don't send again below

        case 'test_run':
          const results = event.data.results || [];
          const passed = results.filter((r: any) => r.passed).length;
          const total = results.length;
          
          const testPrompt = buildCoachingPrompt(session, 'test_results', {
            passed,
            total,
          });
          coachResponse = await askOpenClawCoach(session, testPrompt);
          emotion = passed === total ? 'celebrating' : 'encouraging';
          
          if (passed === total) {
            ws.send(JSON.stringify({
              type: 'celebration',
              text: coachResponse,
            }));
          }
          break;

        case 'student_stuck':
          const stuckPrompt = buildCoachingPrompt(session, 'student_stuck', {});
          coachResponse = await askOpenClawCoach(session, stuckPrompt);
          emotion = 'gentle_nudge';
          break;

        case 'concept_explain':
          const conceptPrompt = buildCoachingPrompt(session, 'concept_explain', {
            pattern: event.data.pattern || 'the problem pattern',
          });
          coachResponse = await askOpenClawCoach(session, conceptPrompt);
          emotion = 'teaching';
          
          ws.send(JSON.stringify({
            type: 'concept_explanation',
            text: coachResponse,
          }));
          
          const conceptAudio = await generateVoice(coachResponse, emotion);
          if (conceptAudio) {
            ws.send(JSON.stringify({ type: 'voice_audio', audioUrl: conceptAudio }));
          }
          return; // Already sent

        case 'voice_message':
          // Student spoke via voice - respond to their transcript
          const voicePrompt = buildCoachingPrompt(session, 'voice_message', {
            transcript: event.data.transcript,
          });
          coachResponse = await askOpenClawCoach(session, voicePrompt);
          emotion = 'encouraging';
          break;

        default:
          console.warn(`Unknown event type: ${event.type}`);
          return;
      }

      // Send coach response (if not already sent above)
      if (coachResponse) {
        ws.send(JSON.stringify({
          type: 'coach_message',
          text: coachResponse,
          emotion,
          timestamp: new Date(),
        }));

        // Generate voice
        const audio = await generateVoice(coachResponse, emotion);
        if (audio) {
          ws.send(JSON.stringify({
            type: 'voice_audio',
            audioUrl: audio,
          }));
        }
      }
    } catch (error) {
      console.error('❌ Message handling error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Something went wrong. But I'm still here to help!',
      }));
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log(`👋 Student disconnected: ${userId}`);
    sessions.delete(userId);
  });

  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for ${userId}:`, error);
  });
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    activeSessions: sessions.size,
    uptime: process.uptime(),
    openclawConnected: !!OPENCLAW_API_TOKEN,
    voiceEnabled: !!ELEVENLABS_API_KEY,
  });
});

// Session list endpoint
app.get('/sessions', (req, res) => {
  const sessionList = Array.from(sessions.values()).map(s => ({
    userId: s.userId,
    problem: s.currentProblem,
    hintsGiven: s.hintsGiven,
    lastActivity: s.lastActivity,
    messageCount: s.messageHistory.length,
  }));
  
  res.json({ sessions: sessionList });
});

// Start server
server.listen(PORT, () => {
  console.log('');
  console.log('🌉 ═══════════════════════════════════════════════════');
  console.log('🌉 MCP Bridge Server STARTED');
  console.log('🌉 ═══════════════════════════════════════════════════');
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🎓 OpenClaw Gateway: ${OPENCLAW_GATEWAY_URL}`);
  console.log(`🤖 OpenClaw connected: ${!!OPENCLAW_API_TOKEN ? '✅ YES' : '❌ NO (fallback mode)'}`);
  console.log(`🔊 Voice enabled: ${!!ELEVENLABS_API_KEY ? '✅ YES' : '❌ NO'}`);
  console.log('🌉 ═══════════════════════════════════════════════════');
  console.log('');
});

export default server;

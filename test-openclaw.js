const WebSocket = require('ws');
const crypto = require('crypto');

const GATEWAY_TOKEN = '57e09fd28a0666046575f23ca582baa644871a94ba0764cc';
const DEVICE_ID = '5897df197f8f247db52fd97c51907152d70dc8d78d692d6652739d65fe1ed8d0';
const PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEINhsl0iV2IRlVg66NNR+d8AvoVwYaXDWAUqB29bgkQB/
-----END PRIVATE KEY-----`;
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAARr+yLTsYmLKObSgxsiPyWHPmnN4wpPBvGP8c4HJJ/4=
-----END PUBLIC KEY-----`;

const privateKey = crypto.createPrivateKey(PRIVATE_KEY_PEM);
const publicKey = crypto.createPublicKey(PUBLIC_KEY_PEM);
const pubKeyDer = publicKey.export({ type: 'spki', format: 'der' });
const rawPubKey = pubKeyDer.subarray(pubKeyDer.length - 32);
const pubKeyB64url = rawPubKey.toString('base64url');

const ws = new WebSocket('ws://localhost:18789/ws');
let done = false;
let connected = false;

ws.on('open', () => console.log('Connected'));

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  const str = JSON.stringify(msg);

  if (msg.event === 'connect.challenge') {
    const nonce = msg.payload.nonce;
    const signedAtMs = Date.now();
    const role = 'operator';
    const scopes = ['operator.admin', 'operator.approvals', 'operator.pairing'];
    const payload = ['v2', DEVICE_ID, 'cli', 'cli', role, scopes.join(','), String(signedAtMs), GATEWAY_TOKEN, nonce].join('|');
    const signature = crypto.sign(null, Buffer.from(payload), privateKey).toString('base64url');
    ws.send(JSON.stringify({
      type: 'req', id: crypto.randomUUID(), method: 'connect',
      params: {
        minProtocol: 3, maxProtocol: 3,
        client: { id: 'cli', version: '2026.2.15', mode: 'cli', platform: 'win32', deviceFamily: 'desktop' },
        auth: { token: GATEWAY_TOKEN }, role, scopes,
        device: { id: DEVICE_ID, publicKey: pubKeyB64url, signature, signedAt: signedAtMs, nonce }
      }
    }));
  } else if (msg.type === 'res' && msg.ok === true && !connected) {
    connected = true;
    console.log('Authenticated!');

    // First list existing sessions
    ws.send(JSON.stringify({
      type: 'req', id: 'list-1', method: 'sessions.list',
      params: { limit: 5 }
    }));
  } else if (msg.type === 'res' && msg.id === 'list-1') {
    console.log('Sessions:', str.slice(0, 1000));
    const sessions = msg.payload?.rows || msg.payload?.sessions || [];

    // Use chat.send with a new session key and idempotencyKey
    const sessionKey = sessions[0]?.sessionKey || `grokking-coach-${Date.now()}`;
    console.log('\nUsing sessionKey:', sessionKey);

    ws.send(JSON.stringify({
      type: 'req', id: 'chat-1', method: 'chat.send',
      params: {
        sessionKey: sessionKey,
        idempotencyKey: crypto.randomUUID(),
        message: 'Say hello in one sentence as Coach Alex, a coding tutor.'
      }
    }));
  } else if (msg.type === 'res' && msg.id === 'chat-1') {
    console.log('\nchat.send response:', str.slice(0, 1000));
  } else if (msg.event && msg.event.startsWith('chat.')) {
    if (msg.payload?.text || msg.payload?.content || msg.payload?.delta) {
      process.stdout.write(msg.payload.text || msg.payload.content || msg.payload.delta || '');
    } else {
      console.log('\nChat event:', msg.event, str.slice(0, 500));
    }
    if (msg.event === 'chat.done' || msg.event === 'chat.complete' || msg.event === 'chat.finished') {
      done = true;
      setTimeout(() => ws.close(), 1000);
    }
  } else if (msg.event && msg.event.startsWith('agent')) {
    console.log('Agent:', msg.event, str.slice(0, 500));
  } else if (msg.event === 'health' || msg.event === 'tick') {
    // ignore
  } else {
    console.log('<<', msg.type, msg.event || msg.id, str.slice(0, 500));
  }
});

ws.on('error', (e) => { console.error('Error:', e.message); process.exit(1); });
ws.on('close', (code) => { console.log('\nClosed, code:', code); process.exit(done ? 0 : 1); });
setTimeout(() => { if (!done) { console.log('\nTimeout'); ws.close(); process.exit(1); } }, 60000);

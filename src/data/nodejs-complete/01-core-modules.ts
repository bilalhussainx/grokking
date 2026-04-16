import { Module } from "../types";

export const module1: Module = {
  id: "core-modules",
  title: "Node.js Core: Event Loop, Streams & Modules",
  description: "How Node.js works under the hood: event loop, libuv, streams, buffers, and the module system",
  lessons: [
    {
      id: "nodejs-internals",
      slug: "nodejs-internals",
      title: "Node.js Architecture & Event Loop",
      content: `
# Node.js Under the Hood

## Node.js Architecture

\`\`\`concept
{
  "title": "Node.js Runtime Components",
  "description": "Node.js combines V8, libuv, and a rich standard library to enable non-blocking I/O",
  "points": [
    "V8 Engine: compiles and executes JavaScript (JIT compilation, garbage collection)",
    "libuv: cross-platform async I/O library — manages thread pool, event loop, network, filesystem",
    "Thread Pool: libuv spawns 4 threads (configurable) for blocking operations (fs, crypto, DNS)",
    "Event Loop Phases: timers → pending callbacks → idle/prepare → poll → check → close callbacks",
    "poll phase: waits for I/O events and runs their callbacks",
    "check phase: runs setImmediate() callbacks",
    "timers phase: runs setTimeout/setInterval callbacks whose time has expired"
  ]
}
\`\`\`

## Node.js Event Loop (detailed)

\`\`\`javascript
const fs = require('fs');

console.log('1 - start');

setTimeout(() => console.log('2 - setTimeout 0'), 0);

setImmediate(() => console.log('3 - setImmediate'));

fs.readFile('./file.txt', () => {
  console.log('4 - file read callback');
  setTimeout(() => console.log('5 - setTimeout in I/O'), 0);
  setImmediate(() => console.log('6 - setImmediate in I/O'));
  // Inside I/O callback: setImmediate ALWAYS runs before setTimeout!
});

process.nextTick(() => console.log('7 - nextTick'));
Promise.resolve().then(() => console.log('8 - promise'));

console.log('9 - end');

// Output: 1, 9, 7, 8, 2, 3, 4, 6, 5
// Explanation:
// Sync: 1, 9
// nextTick queue: 7 (runs before all I/O and timers)
// Microtask queue: 8
// timers phase: 2
// check phase: 3
// I/O callback: 4
// Inside I/O — check before timers: 6, then 5
\`\`\`

## Streams

\`\`\`javascript
const fs = require('fs');
const { Transform } = require('stream');
const { pipeline } = require('stream/promises');

// Streams: process data in chunks — never load entire file into memory

// 4 stream types:
// Readable — can read from (fs.createReadStream, http.IncomingMessage)
// Writable — can write to (fs.createWriteStream, http.ServerResponse)
// Transform — readable + writable, transforms data
// Duplex — readable + writable, independent (net.Socket)

// Example: transform a large file
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // chunk is a Buffer
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// Process a 10GB file with O(chunk_size) memory:
await pipeline(
  fs.createReadStream('huge-input.txt'),
  upperCaseTransform,
  fs.createWriteStream('huge-output.txt')
);
// pipeline automatically handles backpressure and cleanup!

// HTTP streaming:
const http = require('http');
http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // Stream a large file directly to response:
  await pipeline(fs.createReadStream('large.txt'), res);
}).listen(3000);

// Creating a Readable stream:
const { Readable } = require('stream');
const readableStream = Readable.from(async function* () {
  for (let i = 0; i < 100; i++) {
    yield \`Line \${i}\\n\`;
    await new Promise(r => setTimeout(r, 10)); // simulate slow data
  }
}());
\`\`\`

## Buffers & File System

\`\`\`javascript
const fs = require('fs/promises'); // promise-based fs
const path = require('path');

// Buffer: fixed-size chunk of raw binary data (outside V8 heap)
const buf = Buffer.from('Hello, World!', 'utf8');
buf.toString();           // 'Hello, World!'
buf.toString('hex');      // hex encoding
buf.byteLength;           // 13

// Async file operations (always prefer async!):
const filePath = path.join(__dirname, 'data.json');

// Read:
const data = await fs.readFile(filePath, 'utf8');
const json = JSON.parse(data);

// Write:
await fs.writeFile(filePath, JSON.stringify(json, null, 2));

// Append:
await fs.appendFile('log.txt', new Date().toISOString() + ': event\\n');

// Directory operations:
await fs.mkdir(path.join(__dirname, 'uploads'), { recursive: true });
const files = await fs.readdir('./uploads');
const stats = await fs.stat(filePath);
stats.isFile();   // true
stats.size;        // bytes

// Watch for file changes:
const watcher = fs.watch('./src', { recursive: true });
for await (const { eventType, filename } of watcher) {
  console.log(\`\${eventType}: \${filename}\`);
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why do streams use less memory than reading a whole file at once?",
      "options": [
        "Streams compress data",
        "Streams process data chunk by chunk — only one chunk is in memory at a time, not the entire file",
        "Streams use a different memory area",
        "They don't — memory usage is the same"
      ],
      "answer": 1,
      "explanation": "When you fs.readFile() a 10GB file, all 10GB must fit in memory. A stream processes ~64KB chunks one at a time — memory stays roughly constant regardless of file size. This is essential for large file processing, HTTP responses, and real-time data."
    },
    {
      "q": "What is backpressure in Node.js streams?",
      "options": [
        "When the stream crashes",
        "When data is produced faster than it can be consumed — the writable signals the readable to pause",
        "When the buffer overflows",
        "A security mechanism"
      ],
      "answer": 1,
      "explanation": "Backpressure is when a slow consumer (e.g., network) falls behind a fast producer (e.g., disk). Node.js streams signal backpressure via stream.write() returning false. pipeline() handles backpressure automatically — avoiding memory buildup."
    }
  ]
}
\`\`\`
`,
    },
  ],
};

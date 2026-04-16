import { Module } from "../types";

export const module3: Module = {
  id: "worker-threads",
  title: "Worker Threads, Clustering & Performance",
  description: "CPU-bound tasks with Worker Threads, multi-process clustering, and Node.js performance optimization",
  lessons: [
    {
      id: "concurrency-scaling",
      slug: "concurrency-scaling",
      title: "Worker Threads, Clustering & Performance",
      content: `
# Node.js Concurrency & Scaling

## Why Node.js is Single-Threaded (and When That's a Problem)

\`\`\`javascript
// ✅ Node.js handles concurrent I/O perfectly with one thread:
// - HTTP requests
// - Database queries
// - File reads/writes
// - Network calls

// ❌ CPU-bound work BLOCKS the event loop:
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2); // synchronous CPU work!
}

// While this runs, NO other requests can be served:
app.get('/fib/:n', (req, res) => {
  const result = fibonacci(parseInt(req.params.n)); // blocks for 40+ with n>40!
  res.json({ result });
});
\`\`\`

## Worker Threads

\`\`\`javascript
// main.js — offload CPU-intensive work to a worker thread
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Main thread — Express server
  app.get('/fib/:n', (req, res) => {
    const n = parseInt(req.params.n);

    const worker = new Worker(__filename, { workerData: { n } });

    worker.once('message', result => res.json({ result }));
    worker.once('error', err => res.status(500).json({ error: err.message }));
    worker.once('exit', code => {
      if (code !== 0) console.error(\`Worker exited with code \${code}\`);
    });
  });

  app.listen(3000);
} else {
  // Worker thread — CPU computation
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
  parentPort.postMessage(fibonacci(workerData.n));
}

// Worker Pool (better for repeated tasks):
const Piscina = require('piscina'); // npm install piscina

const pool = new Piscina({
  filename: path.resolve(__dirname, 'worker.js'),
  maxThreads: 4,
});

app.get('/process-image', async (req, res) => {
  const result = await pool.run({ imageData: req.body });
  res.json(result);
});
\`\`\`

## Cluster Module

\`\`\`javascript
// cluster.js — spawn one worker per CPU core
const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(\`Primary \${process.pid} starting \${numCPUs} workers\`);

  // Fork workers:
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart crashed workers:
  cluster.on('exit', (worker, code, signal) => {
    console.warn(\`Worker \${worker.process.pid} died (code \${code}). Restarting...\`);
    cluster.fork();
  });

  // Zero-downtime restarts (graceful reload):
  process.on('SIGUSR2', () => {
    const workers = Object.values(cluster.workers);
    let i = 0;
    function restartNext() {
      if (i >= workers.length) return;
      const worker = workers[i++];
      worker.once('exit', restartNext);
      worker.kill('SIGTERM');
    }
    restartNext();
  });
} else {
  // Worker process — actual server
  require('./server'); // express app
  console.log(\`Worker \${process.pid} started\`);
}
\`\`\`

## Performance Monitoring & Optimization

\`\`\`javascript
// Memory monitoring:
const used = process.memoryUsage();
console.log({
  heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
  heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
  rss: Math.round(used.rss / 1024 / 1024) + 'MB',
  external: Math.round(used.external / 1024 / 1024) + 'MB',
});

// Event loop lag monitoring:
const { monitorEventLoopDelay } = require('perf_hooks');
const h = monitorEventLoopDelay({ resolution: 10 });
h.enable();
setInterval(() => {
  console.log('Event loop lag (ms):', h.mean / 1e6);
}, 5000);

// CPU profiling with V8:
const v8Profiler = require('v8-profiler-next'); // npm install v8-profiler-next
v8Profiler.startProfiling('CPU profile');
// ... code to profile ...
const profile = v8Profiler.stopProfiling();
profile.export((error, result) => {
  fs.writeFileSync('profile.cpuprofile', result);
  // Open in Chrome DevTools > Performance tab
});

// Async context tracking (Node 16+):
const { AsyncLocalStorage } = require('async_hooks');
const requestStore = new AsyncLocalStorage();

app.use((req, res, next) => {
  requestStore.run({ requestId: uuid(), userId: req.user?.id }, next);
});

// Later in any async function — no need to pass context through:
function logMessage(msg) {
  const ctx = requestStore.getStore();
  console.log(\`[\${ctx?.requestId}] \${msg}\`);
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between Worker Threads and the Cluster module?",
      "options": [
        "They are identical",
        "Worker Threads: shared memory, for CPU tasks within one process; Cluster: multiple Node.js processes, each with own memory, for network load distribution",
        "Cluster uses multiple threads, Worker Threads uses multiple processes",
        "Worker Threads is for I/O, Cluster is for CPU"
      ],
      "answer": 1,
      "explanation": "Worker Threads run in the same process, share memory via SharedArrayBuffer, and are best for CPU-intensive work. Cluster forks multiple OS processes (each with a V8 instance), shares the server socket via the OS, and is best for network I/O scalability across CPU cores."
    }
  ]
}
\`\`\`
`,
    },
  ],
};

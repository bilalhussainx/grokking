import { Module } from "../types";

export const interviewPrepModule: Module = {
  id: "interview-prep",
  title: "Technical Interview Preparation",
  description: "Three tactical lessons preparing you for the Head of IT interview at codeswitcher — covering Second Brain architecture, predicted interview questions with structured answers, and live demo strategy.",
  lessons: [
    {
      id: "interview-prep-1",
      slug: "second-brain-design",
      title: "System Design — Second Brain Architecture",
      content: `# System Design — Second Brain Architecture

## What You Are Being Asked to Build

Codeswitcher's "Second Brain" is an AI-powered communication layer that routes messages from Slack, Missive (email), GoHighLevel (CRM), and Krisp (meeting transcripts) through Claude Code, retrieves relevant context from an Obsidian knowledge vault, drafts responses, and presents them to a human for review before sending. The goal is to make a small team operate with the leverage of a much larger one.

## Full Architecture — ASCII Diagram

\`\`\`
┌───────────────────────────────────────────────────────────────────┐
│                     INGESTION LAYER                               │
│                                                                   │
│  Slack / Teams  Missive (email)  GoHighLevel (CRM)  Krisp (call) │
│       │               │                │                  │       │
│       └───────────────┴────────────────┴──────────────────┘       │
│                               │                                   │
│                        Message Router                             │
│                    (webhook dispatcher)                           │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│                     MCP SERVER LAYER                              │
│                                                                   │
│   mcp-slack      mcp-missive    mcp-ghl      mcp-krisp            │
│   (read/send)    (read/send)    (contacts)   (transcripts)        │
│       │               │             │              │              │
│       └───────────────┴─────────────┴──────────────┘             │
│                               │                                   │
│                    Claude Code (orchestrator)                     │
│                               │                                   │
│                       mcp-obsidian                               │
│                    (vault read/write)                             │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE VAULT (Obsidian)                     │
│                                                                   │
│  /contacts/      /threads/       /SOPs/        /decisions/        │
│  per-person      per-channel     process docs  logged choices     │
│  context notes   history         templates     with rationale     │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│                    HUMAN-IN-THE-LOOP LAYER                        │
│                                                                   │
│   Draft appears in Missive / Slack DM / web dashboard             │
│   Human edits, approves, or discards                              │
│   Final message sent via same MCP server that received it         │
│   Outcome logged back to Obsidian (learning loop)                 │
└───────────────────────────────────────────────────────────────────┘
\`\`\`

## Component Breakdown

### Missive — Email Orchestration Hub
Missive is more than an inbox: it has teams, shared conversations, internal comments, and an API. The MCP server for Missive exposes \`list_conversations\`, \`get_conversation\`, \`create_draft\`, and \`send_reply\`. Claude uses these to fetch full email threads, generate context-aware replies, and post drafts as Missive comments for human review before sending.

### Slack / Teams — Real-Time Chat Bridge
Incoming Slack messages hit an Event Subscriptions webhook. The MCP server wraps the Slack Web API: \`conversations.history\`, \`chat.postMessage\`, \`users.info\`. Claude reads channel context, retrieves the sender's Obsidian contact note, drafts a reply, and posts it as a thread message tagged \`[DRAFT — awaiting approval]\`. A reaction (✅) triggers final send; 🚫 discards.

### GoHighLevel — CRM Context Provider
GoHighLevel holds contact records, pipeline stages, and conversation history. The MCP server exposes contact lookup, note creation, and tag update. When Claude processes any inbound message, it cross-references the sender's email or phone against GHL to inject CRM context (deal stage, last touchpoint, assigned rep) into the prompt before drafting.

### Krisp — Meeting Intelligence
Krisp produces real-time transcripts and summaries. A post-meeting webhook fires the transcript to the bridge. Claude processes it, extracts action items, and creates structured Obsidian notes under \`/meetings/YYYY-MM-DD-[person].md\`. It can also auto-draft follow-up emails in Missive with the action items prepopulated.

### Obsidian — The Persistent Memory Layer
This is the "brain" of the system. Claude Code reads and writes markdown files via an MCP server (obsidian-mcp or a custom file-system wrapper). Key vault structure:

\`\`\`
vault/
├── contacts/
│   └── alice-smith.md       ← preferences, history, tone notes
├── threads/
│   └── 2026-03-client-onboarding.md
├── SOPs/
│   └── proposal-reply-template.md
├── decisions/
│   └── 2026-02-pricing-change.md
└── meetings/
    └── 2026-03-10-alice-smith.md
\`\`\`

## Data Flow — End-to-End Trace

\`\`\`
1. Alice sends Slack DM: "Can you send over the proposal?"

2. Slack Event webhook fires → Message Router receives event

3. Message Router calls mcp-slack.get_message_context()
   → returns: sender, channel, last 20 messages

4. Claude calls mcp-ghl.lookup_contact(email: alice@co.com)
   → returns: deal stage "Proposal Sent", assigned rep "Bilal"

5. Claude calls mcp-obsidian.read_note("contacts/alice-smith.md")
   → returns: "Prefers concise replies. Responded well to bullet points."

6. Claude calls mcp-obsidian.read_note("SOPs/proposal-reply-template.md")
   → returns: template with link placeholder

7. Claude drafts reply using all context
   → "Hi Alice, here's the proposal link: [LINK]. Let me know if questions!"

8. Draft posted to Slack as a DM to the rep: "DRAFT for Alice — react ✅ to send"

9. Rep approves → mcp-slack.post_message(channel: alice_dm, text: draft)

10. mcp-obsidian.append_note("threads/alice-proposal.md", outcome)
    → memory updated for future interactions
\`\`\`

## Phase-by-Phase Implementation Plan

### Phase 1 — Foundation (Weeks 1–2)
- Stand up VPS (Ubuntu 22.04, 4 vCPU, 8 GB RAM)
- Install Node.js, configure PM2 for process management
- Build \`mcp-slack\` server (webhook receiver + Web API wrapper)
- Build \`mcp-obsidian\` server (file read/write on vault path)
- Wire basic Claude Code integration: Slack message → Obsidian lookup → draft logged

### Phase 2 — Email & CRM Integration (Weeks 3–4)
- Build \`mcp-missive\` server using Missive REST API
- Build \`mcp-ghl\` server using GoHighLevel v2 API
- Implement contact cross-referencing: Slack sender matched to GHL contact
- Bidirectional deduplication: prevent double-processing same message across channels

### Phase 3 — Meeting Intelligence (Week 5)
- Configure Krisp webhook endpoint
- Build transcript parser and Obsidian note writer
- Auto-draft follow-up emails with extracted action items

### Phase 4 — Human-in-the-Loop Hardening (Week 6)
- Approval workflow with Slack reactions (✅ / 🚫 / ✏️ for edit)
- Audit log: every draft, approval, edit, and send logged to Obsidian
- Rollback capability: retrieve any prior draft version

### Phase 5 — Monitoring & Scaling (Week 7+)
- Prometheus + Grafana dashboards: message volume, draft acceptance rate, latency
- PagerDuty or ntfy.sh alerts for MCP server failures
- Rate limit handling across all APIs (exponential backoff, queue with BullMQ)

## Scaling Considerations

**Volume scaling:** BullMQ (Redis-backed) job queue absorbs traffic spikes. Workers scale horizontally — multiple Claude Code instances process the queue concurrently.

**Memory scaling:** As the Obsidian vault grows, implement vector embeddings (pgvector or Chroma) for semantic search. Full-text search (Ripgrep over vault) works well to ~50,000 notes.

**API rate limits:** Slack: 1 req/sec per method (Tier 3). Missive: 60 req/min. GHL: 100 req/10 sec. Handle with per-client token buckets and graceful degradation (log and retry within SLA window).

**Multi-tenant:** When codeswitcher onboards client agencies, each client gets an isolated vault partition and separate MCP server instances. Tenant ID flows through every request as a context variable.

## Key Takeaways

- Every tool connects to Claude Code through its own MCP server — this is the architectural invariant that makes the system composable and replaceable.
- Obsidian is not just storage; it is the persistent memory that makes Claude context-aware across days and conversations.
- The human-in-the-loop gate is non-negotiable in Phase 1. Automate sends only after the system has demonstrated consistent draft quality.
- Design the audit log from day one — you will need it for debugging, client reporting, and compliance.
`,
    },
    {
      id: "interview-prep-2",
      slug: "interview-questions",
      title: "Likely Interview Questions & Strong Answers",
      content: `# Likely Interview Questions & Strong Answers

The Head of IT at codeswitcher has seen the preliminary interview. They know you can talk conceptually. The technical interview will go deeper — they will probe your actual implementation knowledge, your debugging instincts, and your ability to translate architecture into working code. Here are the twelve most likely questions with structured answers.

---

## Q1: "Walk me through how you'd architect the Slack-to-Missive bridge."

The bridge is a bidirectional event relay with deduplication and context enrichment. On the Slack side, I register an Event Subscriptions webhook that fires on \`message\` events. The handler validates the Slack signing secret, filters out bot messages and retries (using the \`X-Slack-Retry-Reason\` header), and enqueues the event in a BullMQ job queue. A worker picks up the job, calls the mcp-obsidian server to retrieve the sender's contact note, then passes both the message and context to Claude.

On the Missive side, I use Missive webhooks for inbound email events and the REST API to create draft replies. The critical design decision is the routing table: a config file maps Slack channel IDs or user patterns to Missive team inboxes. This keeps the bridge stateless — all routing logic lives in config, not code.

Deduplication is handled with Redis. Every processed event ID is written to a Redis set with a 24-hour TTL. Before processing any event, I check the set — if the ID exists, I ack and drop. This prevents double-drafts if Slack retries the webhook delivery.

---

## Q2: "How would you implement persistent memory with Obsidian?"

Obsidian is a folder of markdown files — which makes it trivially wrappable with an MCP server that exposes \`read_file\`, \`write_file\`, \`append_to_file\`, and \`search_vault\` (using Ripgrep). The MCP server runs as a local process on the same VPS as Claude Code and has direct filesystem access to the vault path.

Memory is structured hierarchically: \`contacts/\` holds per-person context notes updated after every interaction, \`threads/\` holds conversation history indexed by topic, and \`decisions/\` logs choices with rationale. Claude reads the relevant notes at the start of each task and appends a timestamped outcome block at the end. This gives it working memory across sessions without a database.

For scale, I would add a vector embedding layer using Chroma or pgvector — every note is embedded on write, and Claude uses semantic search to retrieve the top-K most relevant notes rather than reading the full vault. That transition is straightforward because the MCP interface stays the same; only the search implementation changes.

---

## Q3: "What happens when an MCP server crashes mid-conversation?"

MCP servers are separate processes. If one crashes, Claude Code receives an error on the next tool call to that server. The correct response depends on whether the task can continue with degraded functionality or must halt.

I design for graceful degradation. Every MCP call is wrapped in a try/catch with a structured error type. Claude's system prompt includes explicit instructions: if \`mcp-obsidian\` is unavailable, proceed with the message context available in the current conversation but append a note that memory retrieval failed. If \`mcp-slack\` is unavailable, log the draft locally and alert the rep via email.

On the infrastructure side, PM2 restarts crashed processes immediately with an exponential backoff to prevent restart storms. I expose a \`/health\` endpoint on each MCP server and configure an uptime monitor (UptimeRobot or a simple cron pinging the endpoint) to page me on failure. The goal is mean time to recovery under two minutes for any single server failure.

---

## Q4: "How would you build the AI response drafting engine?"

The drafting engine is a structured prompt pipeline, not a single monolithic prompt. I break it into three stages: context assembly, draft generation, and quality gate.

Context assembly pulls from four sources: the raw message, the sender's Obsidian contact note, the relevant CRM data from GoHighLevel, and the applicable SOP template from the vault. These are formatted into a structured prompt with clear XML-tagged sections so Claude can reliably extract each component.

Draft generation uses Claude claude-sonnet-4-6 with a system prompt that defines the brand voice, response length guidelines, and explicit instructions on what NOT to include (pricing, commitments, anything requiring human judgment). I set temperature to 0.3 for consistency.

The quality gate is a second, cheaper Claude call (Haiku) that checks the draft against a rubric: correct tone, no fabricated facts, no disallowed content. If it fails, the draft is flagged for human review with the specific failure reason highlighted. This two-pass approach catches the majority of errors before they reach the rep.

---

## Q5: "Explain your experience with OAuth 2.0 flows."

I've implemented OAuth 2.0 for several integrations. The standard flow I use most is Authorization Code with PKCE for user-facing apps and Client Credentials for server-to-server integrations like the GoHighLevel API.

For the Second Brain specifically, GoHighLevel uses OAuth 2.0 with long-lived refresh tokens. I store the access token and refresh token in an encrypted secrets store (either Doppler or a simple KMS-encrypted JSON file on the VPS). Before each API call, I check the token expiry timestamp — if within five minutes of expiry, I proactively refresh using the refresh token endpoint and update the stored credentials. This prevents mid-request token failures.

The common mistake I've seen is storing access tokens in plain environment variables and forgetting to handle refresh. I treat token management as its own module with clear interfaces: \`getValidToken(service)\` is the single function the rest of the codebase calls, and all refresh logic is encapsulated there.

---

## Q6: "How would you deploy this to a VPS for 24/7 operation?"

My standard stack for this type of project: Ubuntu 22.04 LTS on a DigitalOcean or Hetzner VPS (4 vCPU, 8 GB RAM handles the workload comfortably), Node.js managed with nvm, PM2 for process management with an ecosystem config that defines all MCP servers and the main orchestrator as named processes with auto-restart enabled.

For deployment, I use a simple GitHub Actions workflow: push to \`main\` triggers an SSH deploy step that pulls the latest code, runs \`npm ci\`, and issues \`pm2 reload ecosystem.config.js --update-env\`. Zero-downtime reload is built into PM2. Secrets are injected via GitHub Actions secrets and written to a \`.env\` file on the server during deploy — never stored in the repo.

Nginx sits in front of any public-facing webhook endpoints, handles SSL termination (Let's Encrypt via Certbot), and enforces rate limiting at the edge. Fail2ban blocks IPs that repeatedly fail webhook signature verification.

---

## Q7: "How does the 6-layer voice governance system work?"

The six layers map to increasing levels of authority and risk. Layer 1 is transcription fidelity — Krisp or Whisper converts speech to text with high accuracy. Layer 2 is speaker identification — diarization assigns turns to named participants. Layer 3 is intent classification — Claude categorizes each turn (question, commitment, action item, decision). Layer 4 is commitment extraction — a structured parse identifies anything that sounds like a promise ("I'll send that by Friday"). Layer 5 is approval gating — extracted commitments surface to the relevant human for confirmation before being logged or acted upon. Layer 6 is audit logging — every commitment, who made it, who approved it, and what action was taken is written to the decision log in Obsidian.

The governance aspect is that no commitment surfaces as a task or send without passing through layers 5 and 6. The system is a witness and a drafter, not an autonomous actor.

---

## Q8: "What's your debugging process when an MCP server isn't responding?"

I work through four layers in order. First, process check: is the server running? \`pm2 status\` shows all processes and their restart counts. High restart counts indicate a crash loop — I check \`pm2 logs [server-name] --lines 50\` for the error.

Second, network check: can the orchestrator reach the server? MCP servers communicate over stdio or TCP. I verify the port is bound with \`ss -tlnp | grep [port]\` and test with a raw curl or a minimal MCP client call.

Third, dependency check: is the MCP server failing because an upstream API is down? I replicate the failing API call directly (curl with the same credentials) to isolate whether it's the MCP server or the external service.

Fourth, if it's an external API issue, I check the provider's status page, review rate limit headers in the last logged response, and implement a circuit breaker if this is a recurring issue — after N consecutive failures, the circuit opens and the system routes around the failed integration for a cooldown period.

---

## Q9: "How would you handle message deduplication in a bidirectional bridge?"

Deduplication in a bidirectional bridge has two faces: preventing the same inbound message from being processed twice, and preventing a reply sent via the bridge from being re-ingested as a new inbound message.

For inbound deduplication, I store processed event IDs in Redis with a TTL matching the platform's maximum retry window (Slack retries for up to 3 hours, so TTL is 6 hours). Every event ID is checked before processing and written immediately after the check — not after processing — to handle the case where processing fails partway through.

For round-trip deduplication, I tag every message sent through the bridge with a bot user ID or a custom header. Inbound handlers check for this tag and drop the message if present. On Slack this means filtering out messages from the bot's own user ID. On Missive this means checking the \`from\` address against the bridge service account.

The subtle case is when a human manually replies to a message that the bridge was drafting — the bridge needs to detect this and cancel the pending draft. I handle this with a "draft pending" flag per conversation thread in Redis; if an external send is detected on that thread, the flag is cleared and the draft is discarded.

---

## Q10: "Walk me through a Claude Code skill you've built."

I built MCPForge, a scaffolding tool that generates production-ready MCP servers from a YAML schema definition. The skill takes a config file describing the tools you want to expose — name, description, input schema, and the API call it maps to — and outputs a fully typed TypeScript MCP server with error handling, logging, and a test suite.

The implementation uses Claude Code as both the orchestrator and the code generator. The user defines the schema, Claude Code reads it and generates the server file, runs the generated tests, and if they pass, creates a GitHub repository with the code. If tests fail, Claude Code enters a debug loop — reading the test output, proposing a fix, applying it, and re-running tests — until the server passes or it escalates to the human with a clear error description.

The key lesson from building it: Claude Code is most reliable when each tool in a skill does exactly one thing. Compound tools that "get context AND draft AND send" are hard to debug. Atomic tools that do one operation each compose predictably and make the trace logs readable.

---

## Q11: "How would you handle rate limiting across multiple API integrations?"

Rate limiting is a first-class concern, not an afterthought. I implement a per-service token bucket using Redis. Each service has a bucket configuration (capacity, refill rate) matching its documented limits. Before every API call, the worker acquires a token from the bucket. If the bucket is empty, the job is re-queued with a delay calculated from the refill rate.

For burst scenarios, I add a queue priority layer: high-priority messages (e.g., a client asking about a time-sensitive deliverable) jump ahead of routine digest messages. This ensures rate limit budget is spent on what matters most.

I also respect the \`Retry-After\` header in 429 responses and implement exponential backoff with jitter — critical to avoid synchronized retry storms when multiple workers hit the limit simultaneously and then all retry at the same time.

---

## Q12: "What monitoring would you set up for the production bridges?"

Three layers: availability, performance, and business metrics.

Availability: PM2 health checks + UptimeRobot pinging the \`/health\` endpoint of each MCP server every 60 seconds. PagerDuty-equivalent alert (ntfy.sh for simplicity, PagerDuty if the client prefers) fires if any server is down for two consecutive checks.

Performance: Prometheus metrics exposed by each MCP server — requests per second, error rate, p50/p95/p99 latency per tool call, queue depth, and job processing time. Grafana dashboards visualize these. Alert thresholds: error rate > 1% for 5 minutes, queue depth > 100 for 10 minutes.

Business metrics: logged to Obsidian and visualized in a simple dashboard — draft acceptance rate (how often reps approve without editing), average time from message receipt to draft ready, and breakdown by channel. These are the metrics the Head of IT actually cares about, and they are what justify continued investment in the system.
`,
    },
    {
      id: "interview-prep-3",
      slug: "live-demo-prep",
      title: "Live Demo Preparation",
      content: `# Live Demo Preparation

## What the Founder Actually Wants to See

When a founder asks for a "live coding session," they rarely mean they want to watch you type. They want to see how you think, how you communicate under pressure, and whether you can move from idea to working artifact faster than anyone they have interviewed before. Your teaching background is a significant advantage here — you have done this in front of a room of skeptical students. This is easier.

The goal of your live demo is not to impress with complexity. It is to make the founder think: "This is exactly what working with this person would feel like — clear, fast, collaborative, and trustworthy."

## What to Have Pre-Built and Ready

### 1. A Minimal MCP Server (Your Anchor Demo)
Build a \`mcp-demo-obsidian\` server before the interview. It should expose three tools: \`read_note\`, \`write_note\`, and \`search_vault\`. Keep it to ~80 lines of TypeScript. Have it running locally, connected to a small demo vault with a handful of realistic notes (a fake contact, a fake SOP, a fake meeting note).

Why this? It is the core primitive of the entire Second Brain system. If you can demo this live — Claude Code reading a contact note and using it to draft a contextual reply — the founder immediately sees the product, not just the idea.

### 2. A Slack Webhook Handler
A simple Express.js endpoint that receives a Slack Event Subscriptions payload, validates the signing secret, and logs the formatted message. You should be able to spin this up in under five minutes from a template you have memorized. Have ngrok installed and ready to expose localhost — nothing kills demo momentum like fumbling with tunnels.

### 3. An Obsidian Vault Search Demo
A terminal script or Claude Code skill that takes a search query and returns the top three matching vault notes. Even a Ripgrep wrapper works. This demonstrates the memory retrieval pipeline concretely.

Have all three in a single GitHub repo (\`second-brain-demo\`) cloned and ready to run. Test them the morning of the interview. Know the startup commands by heart.

## How to Narrate While You Code

You taught at Milton Academy. You know that the best teachers do not just explain what they are doing — they make students feel like they could do it too. Apply the same instinct here.

**Narrate the decision, not the keystrokes.** Instead of "I'm writing a try-catch here," say "I always wrap MCP calls in a try-catch because if Obsidian is unreachable mid-conversation, I want Claude to degrade gracefully rather than throw an unhandled error — the draft can still proceed, just without the memory context."

**State the trade-off before you make the choice.** "I could use a database here, but for a vault under 50,000 notes, the filesystem is faster and gives you the Obsidian UI for free — so I'll stay with files until we hit a scaling reason to migrate."

**Invite the founder into the problem.** "Here's an interesting edge case — what happens if Slack retries the same webhook twice? Let me show you how I handle that." Then show the Redis deduplication check. This turns the demo into a dialogue.

**When something doesn't work — and it will — narrate the debug.** "Okay, port 3001 is already in use — that's from the previous demo run. Let me kill it." Then do it calmly. Founders hire people who are unflappable, not people who never hit bugs.

## Key Points to Hit During the Demo

Hit these in the natural flow of the demo — do not checklist them, but make sure they land:

- **MCP as the composability layer.** "Every tool is a separate MCP server. If you want to swap Missive for Gmail tomorrow, you swap one server. Nothing else changes."
- **Obsidian as the persistent brain.** Show a note being written after a simulated interaction. "This is what makes it a Second Brain — Claude remembers Alice's preferences across every future conversation."
- **Human-in-the-loop as a feature, not a limitation.** "The approval step is intentional. You stay in control. The system learns what you approve, and over time the drafts get closer to what you would have written yourself."
- **Production-grade from day one.** Mention PM2, health endpoints, the Redis queue. "This is not a prototype — these are the same patterns I'd use in production."

## Connecting Your Experience to Their Needs

**MCPForge → MCP server velocity.** "I've built enough MCP servers to know what boilerplate slows you down. MCPForge scaffolds a production-ready server from a YAML schema in seconds. That means we can add a new integration — say, a Notion MCP — in an afternoon instead of a week."

**Research Pipeline → Multi-step orchestration.** "I built a five-step AI research pipeline that chains Claude calls with web search, scoring, and formatted output. That's the same architecture as the Second Brain — intake, context retrieval, generation, quality gate, output. I've debugged that chain in production. I know where it breaks."

**Teaching at Milton Academy → Documentation and onboarding.** "I've explained complex systems to 15-year-olds who had no prior context. I'll write documentation your whole team can follow, not just the engineers. When you onboard a new rep to the Second Brain, I want them productive in an hour."

## Common Gotchas and How to Handle Them Gracefully

**The demo environment breaks.** Stay calm. "Let me restart the MCP server — this is actually a good illustration of why PM2's auto-restart is critical in production." Then show pm2 restart working. Bugs in demos are demonstrations of your debugging competence.

**They ask about something you haven't built yet.** "I haven't implemented that specific piece, but here's exactly how I would approach it: [two-sentence architecture answer]. I could have a working prototype by end of week." Specificity earns trust; vague enthusiasm does not.

**They ask about a tool you're unfamiliar with.** "I haven't used [X] directly, but I've worked with [similar tool], and the MCP server pattern is the same regardless of the underlying API. Give me the API docs and I'll have an MCP server for it in a day." Then move on.

**They ask about team or timeline.** "I work best with a clear spec and minimal interruptions during build. I'll send daily async updates so you always know where I am. For a Phase 1 build — Slack and Obsidian integrated — I'd target two weeks to a working demo, four weeks to a production deployment." Anchor on specifics.

## Your Pre-Interview Checklist

- [ ] \`second-brain-demo\` repo cloned and all three demos running locally
- [ ] ngrok installed, account authenticated, ready to tunnel
- [ ] A small demo Obsidian vault with at least one contact note, one SOP, one meeting note
- [ ] Know the PM2 commands cold: \`pm2 start\`, \`pm2 logs\`, \`pm2 restart\`
- [ ] Redis running locally (for deduplication demo if asked)
- [ ] Have the GoHighLevel and Missive API docs bookmarked — you may need to reference them live
- [ ] Slack app created in a personal workspace with a test webhook URL ready

The interview is not a test of whether you have already built the Second Brain. It is a test of whether you are the person they want to build it with them. Show them clear thinking, calm problem-solving, and a genuine enthusiasm for the problem — those signals matter more than any specific line of code.
`,
    },
  ],
};

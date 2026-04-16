import { Module } from "../types";

export const reliabilityAndResiliencyModule: Module = {
  id: "reliability-and-resiliency",
  title: "Reliability, Resiliency & Observability",
  description: "Build systems that degrade gracefully under load and failure: rate limiting, circuit breakers, bulkheads, and the monitoring stack that catches problems before users do.",
  lessons: [
    {
      id: "availability-and-slas",
      slug: "availability-and-slas",
      title: "Availability Numbers and SLAs",
      content: `# Availability Numbers and SLAs

You've probably seen "99.9% uptime" in a cloud provider's marketing material. But what does that number actually *mean* for your users? And what happens when you chain together ten services, each with their own availability guarantee?

This lesson will make those numbers concrete — and teach you to calculate error budgets, compound availability, and communicate reliability requirements like a senior architect.

---

## The Availability Table Every Engineer Must Memorize

Availability is measured as the percentage of time a system is operational over a given period. The math is simple — the intuitions are not.

| Availability | Downtime / Year | Downtime / Month | Downtime / Week |
|---|---|---|---|
| 99% ("two nines") | 3.65 days | 7.2 hours | 1.68 hours |
| 99.9% ("three nines") | 8.7 hours | 43.8 minutes | 10.1 minutes |
| 99.99% ("four nines") | 52.6 minutes | 4.4 minutes | 1.01 minutes |
| 99.999% ("five nines") | 5.26 minutes | 26.3 seconds | 6.05 seconds |
| 99.9999% ("six nines") | 31.5 seconds | 2.6 seconds | 0.6 seconds |

The jump from 99.9% to 99.99% doesn't *sound* like much — it's just one more nine. But it shrinks your annual downtime budget from **8.7 hours** to **52 minutes**. That's a 10× reduction in tolerance for failure.

\`\`\`concept
{ "title": "The Nines Are Logarithmic", "variant": "mental-model", "content": "Each additional '9' reduces your allowable downtime by roughly 10×. Going from 99% to 99.9% saves you 3+ days/year. Going from 99.99% to 99.999% saves you only 47 minutes. The cost of achieving each extra nine grows exponentially — redundancy, chaos testing, on-call rotations, dark launching — while the raw time savings shrinks." }
\`\`\`

---

## SLA, SLO, and SLI — Getting the Vocabulary Right

These three acronyms are used interchangeably in casual conversation but have precise meanings at companies like Google, Amazon, and Netflix.

\`\`\`tabs
{ "tabs": [
  {
    "label": "SLI",
    "icon": "📏",
    "content": "**Service Level Indicator** — A *measurement*.\\n\\nAn SLI is a quantitative metric that captures some aspect of service behavior:\\n\\n- Request success rate: \`successful_requests / total_requests\`\\n- Latency: 99th-percentile response time\\n- Error rate: \`5xx_responses / total_responses\`\\n- Throughput: requests per second\\n\\nSLIs are raw numbers from your monitoring system. They say nothing about whether performance is *acceptable* — that's the SLO's job."
  },
  {
    "label": "SLO",
    "icon": "🎯",
    "content": "**Service Level Objective** — An *internal target*.\\n\\nAn SLO sets the threshold your SLI must meet:\\n\\n> \\"Success rate SLI must be ≥ 99.9% over any rolling 30-day window.\\"\\n\\nSLOs are internal agreements. They're the *real* engineering target. When your SLI drops below the SLO, you've consumed error budget and the team stops shipping features to focus on reliability.\\n\\n**SLOs should be slightly stricter than your SLA** — so you catch problems before your customers officially notice."
  },
  {
    "label": "SLA",
    "icon": "📄",
    "content": "**Service Level Agreement** — A *contract*.\\n\\nAn SLA is the legal/commercial promise made to customers:\\n\\n> \\"If monthly uptime falls below 99.9%, customers receive a 10% service credit. Below 99%, they receive a 25% credit.\\"\\n\\nSLAs have financial consequences. You never want to breach an SLA — which is why your SLO should sit above it with a safety margin.\\n\\n**Google's rule of thumb:** SLO = SLA + comfortable buffer. If SLA = 99.9%, set SLO = 99.95%."
  },
  {
    "label": "Relationship",
    "icon": "🔗",
    "content": "**How they connect:**\\n\\n\`\`\`\\nReality (system behavior)\\n    ↓ measured by\\nSLI  (e.g., 99.92% success rate this month)\\n    ↓ compared to\\nSLO  (internal target: ≥ 99.95%)\\n    ↓ if breached, risk breaking\\nSLA  (customer contract: ≥ 99.9%)\\n    ↓ if breached\\nFinancial penalty / reputation damage\\n\`\`\`\\n\\nThe SLI is fact. The SLO is your guard rail. The SLA is the cliff edge."
  }
]}
\`\`\`

---

## Error Budgets: Spending Downtime Deliberately

An error budget is the flip side of your availability target. If your SLO is **99.9% monthly**, you have:

\`\`\`
Error budget = 100% - 99.9% = 0.1%
0.1% of (30 days × 24 hours × 60 min) = 43.2 minutes/month
\`\`\`

That 43.2 minutes is *yours to spend* — on risky deployments, chaos experiments, planned maintenance, or absorbing unexpected failures.

\`\`\`concept
{ "title": "Error Budget as a Collaboration Tool", "variant": "insight", "content": "Error budgets resolve the classic tension between reliability (ops) and velocity (dev). When budget is plentiful, teams ship aggressively — deploys, experiments, migrations. When budget is nearly exhausted, the team freezes new features and focuses exclusively on reliability. The budget is a shared scoreboard, not a blame mechanism." }
\`\`\`

Let's write the calculation:

\`\`\`playground
{ "title": "Error Budget Calculator", "language": "python", "code": "def error_budget(slo_percent: float, period_days: int = 30) -> dict:\\n    \\"\\"\\"\\n    Calculate the error budget from an SLO percentage.\\n    \\n    Args:\\n        slo_percent: e.g. 99.9 for 99.9% availability\\n        period_days: rolling window (default 30 days)\\n    \\n    Returns:\\n        dict with budget in minutes, seconds, and requests (at 1000 rps)\\n    \\"\\"\\"\\n    total_minutes = period_days * 24 * 60\\n    budget_fraction = (100 - slo_percent) / 100\\n    budget_minutes = total_minutes * budget_fraction\\n    budget_seconds = budget_minutes * 60\\n    \\n    # At 1000 requests/second, how many failures are allowed?\\n    total_requests = total_minutes * 60 * 1000\\n    allowed_failures = int(total_requests * budget_fraction)\\n    \\n    return {\\n        \\"slo\\": f\\"{slo_percent}%\\",\\n        \\"period\\": f\\"{period_days} days\\",\\n        \\"budget_minutes\\": round(budget_minutes, 2),\\n        \\"budget_seconds\\": round(budget_seconds, 1),\\n        \\"allowed_failures_at_1k_rps\\": allowed_failures,\\n    }\\n\\n# Compare common SLOs\\nfor slo in [99.0, 99.5, 99.9, 99.95, 99.99]:\\n    result = error_budget(slo)\\n    print(f\\"SLO {result['slo']:>7}  |  \\"\\n          f\\"Budget: {result['budget_minutes']:>8.2f} min  |  \\"\\n          f\\"At 1k rps: {result['allowed_failures_at_1k_rps']:>12,} failures\\")\\n", "runnable": true }
\`\`\`

---

## Compound Availability: The Hidden Danger of Microservices

Here's the trap that catches every engineer moving from monoliths to microservices:

> **If service A has 99.9% availability AND service B has 99.9% availability, what is the availability of a request that needs both?**

The answer is **not** 99.9%.

For independent components in **series** (all must succeed), availability multiplies:

\`\`\`
A_system = A_1 × A_2 × A_3 × ... × A_n
\`\`\`

\`\`\`playground
{ "title": "Compound Availability in Series", "language": "python", "code": "def compound_availability_series(availabilities: list[float]) -> float:\\n    \\"\\"\\"\\n    Calculate compound availability when services run in series.\\n    All services must be up for the request to succeed.\\n    \\"\\"\\"\\n    result = 1.0\\n    for a in availabilities:\\n        result *= (a / 100)\\n    return result * 100\\n\\n\\ndef compound_availability_parallel(availabilities: list[float]) -> float:\\n    \\"\\"\\"\\n    Calculate compound availability when services run in parallel\\n    (any ONE replica being up is sufficient).\\n    \\"\\"\\"\\n    failure_product = 1.0\\n    for a in availabilities:\\n        failure_product *= (1 - a / 100)\\n    return (1 - failure_product) * 100\\n\\n\\n# Series: API Gateway → Auth → Product Service → DB\\nservices = [99.99, 99.9, 99.9, 99.95]\\nnames = [\\"API Gateway\\", \\"Auth Service\\", \\"Product Service\\", \\"Database\\"]\\n\\nprint(\\"=== Services in SERIES (all must succeed) ===\\")\\nrunning = 100.0\\nfor name, avail in zip(names, services):\\n    running = compound_availability_series([running, avail])\\n    print(f\\"  After {name:20s} ({avail}%): {running:.4f}%\\")\\n\\nprint(f\\"\\\\nFinal system availability: {running:.4f}%\\")\\nprint(f\\"Monthly downtime: {(100 - running) / 100 * 30 * 24 * 60:.1f} minutes\\")\\n\\n# Parallel: two redundant replicas of the DB\\nprint(\\"\\\\n=== Two DB replicas in PARALLEL (either can serve) ===\\")\\nparallel = compound_availability_parallel([99.95, 99.95])\\nprint(f\\"  Single DB:       99.95%\\")\\nprint(f\\"  Two parallel DBs: {parallel:.6f}%\\")\\nprint(f\\"  Monthly budget:  {(100 - parallel) / 100 * 30 * 24 * 60:.2f} minutes\\")\\n", "runnable": true }
\`\`\`

\`\`\`concept
{ "title": "Series vs. Parallel Availability", "variant": "rule", "content": "**Series (all required):** A_total = ∏ A_i — availability *decreases* as you add services. Ten 99.9% services in series = 99.0% system.\\n\\n**Parallel (any sufficient):** A_total = 1 − ∏(1 − A_i) — availability *increases* as you add replicas. Two 99.9% replicas in parallel ≈ 99.9999%.\\n\\nRedundancy flips the math from punishment to reward." }
\`\`\`

---

## Visualizing Redundancy

Here's how availability compounds as you add replicas of a single 99.9% service:

\`\`\`algoviz
{ "title": "Availability vs. Number of Replicas (99.9% each, parallel)", "type": "array", "data": ["1 replica\\n99.900%", "2 replicas\\n99.9999%", "3 replicas\\n99.9999999%", "4 replicas\\n≈100%"], "frames": [ { "highlight": [0], "label": "Single replica: 99.9% — 8.7 hrs/year downtime", "stats": { "replicas": 1, "availability": "99.900%", "downtime_hrs": 8.76 } }, { "highlight": [0, 1], "label": "Two parallel replicas: 99.9999% — both must fail simultaneously", "stats": { "replicas": 2, "availability": "99.9999%", "downtime_hrs": 0.0088 } }, { "highlight": [0, 1, 2], "label": "Three replicas: 99.9999999% — astronomically rare triple failure", "stats": { "replicas": 3, "availability": "99.9999999%", "downtime_hrs": 0.0000088 } }, { "highlight": [0, 1, 2, 3], "label": "Four replicas: practically zero unplanned downtime", "stats": { "replicas": 4, "availability": "≈100%", "downtime_hrs": "~0" } } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Correlated Failures Break the Math", "content": "The parallel availability formula assumes **independent** failures. If both DB replicas share the same rack, power supply, or availability zone, a single AZ outage takes both down simultaneously. Real redundancy requires fault isolation — different racks, zones, or regions. AWS calls these Availability Zones for exactly this reason." }
\`\`\`

---

## The Availability vs. Cost Trade-off

Achieving each additional nine has a non-linear cost:

\`\`\`tabs
{ "tabs": [
  {
    "label": "99% (2 nines)",
    "icon": "🟡",
    "content": "**Cost:** Low\\n\\n**Typical approach:** Single server, nightly backups, manual restart procedure.\\n\\n**Who uses this:** Internal tools, dev environments, side projects.\\n\\n**Downtime tolerance:** 3.65 days/year. A weekend outage is acceptable.\\n\\n**Engineering investment:** Minimal — a single on-call engineer checks alerts occasionally."
  },
  {
    "label": "99.9% (3 nines)",
    "icon": "🟠",
    "content": "**Cost:** Moderate\\n\\n**Typical approach:** Active-passive failover, health checks, auto-restart, basic load balancing across 2 AZs.\\n\\n**Who uses this:** Most SaaS products, e-commerce sites, B2B tools.\\n\\n**Downtime tolerance:** 8.7 hours/year. A 30-minute outage at 2am is survivable.\\n\\n**Engineering investment:** On-call rotation, runbooks, basic alerting stack (Prometheus + PagerDuty)."
  },
  {
    "label": "99.99% (4 nines)",
    "icon": "🔴",
    "content": "**Cost:** High\\n\\n**Typical approach:** Active-active multi-AZ, automatic failover under 1 minute, chaos engineering, extensive runbooks, SRE team.\\n\\n**Who uses this:** AWS, Stripe, Twilio, financial infrastructure.\\n\\n**Downtime tolerance:** 52 minutes/year. Any outage page-wakes engineers immediately.\\n\\n**Engineering investment:** Dedicated SRE team, chaos monkey, canary deployments, dark launches, feature flags for instant rollback."
  },
  {
    "label": "99.999% (5 nines)",
    "icon": "💎",
    "content": "**Cost:** Very High\\n\\n**Typical approach:** Multi-region active-active, zero-downtime deploys, sub-second automated failover, extensive redundancy at every layer.\\n\\n**Who uses this:** Telecom carriers, air traffic control, nuclear plant monitoring, payment clearinghouses.\\n\\n**Downtime tolerance:** 5.26 minutes/year. Any incident is a major incident.\\n\\n**Engineering investment:** Enormous. Significant portion of engineering headcount dedicated to reliability alone. Often not worth it for web services — planned maintenance windows alone can consume the budget."
  }
]}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "The Dirty Secret of 5 Nines", "content": "For most web services, achieving 99.999% is nearly impossible — not because of technical limitations, but because **planned maintenance** alone can eat the entire 5.26-minute annual budget. DNS propagation, certificate rotation, OS patches: each can take minutes. Large companies typically target 99.99% and achieve it via feature flags, blue-green deployments, and rolling updates — never taking everything offline at once." }
\`\`\`

---

## Architecture: Availability Building Blocks

\`\`\`sysdiag
{ "title": "High-Availability Web Service Architecture", "width": 700, "height": 400, "nodes": [ { "id": "users", "label": "Users", "x": 60, "y": 200, "kind": "client" }, { "id": "cdn", "label": "CDN", "x": 180, "y": 200, "kind": "service" }, { "id": "lb", "label": "Load\\nBalancer", "x": 320, "y": 200, "kind": "service" }, { "id": "app1", "label": "App\\nServer 1", "x": 460, "y": 120, "kind": "service" }, { "id": "app2", "label": "App\\nServer 2", "x": 460, "y": 280, "kind": "service" }, { "id": "db_p", "label": "DB\\nPrimary", "x": 600, "y": 120, "kind": "database" }, { "id": "db_r", "label": "DB\\nReplica", "x": 600, "y": 280, "kind": "database" } ], "edges": [ { "from": "users", "to": "cdn", "label": "HTTPS" }, { "from": "cdn", "to": "lb", "label": "cache miss" }, { "from": "lb", "to": "app1", "label": "round-robin" }, { "from": "lb", "to": "app2", "label": "round-robin" }, { "from": "app1", "to": "db_p", "label": "writes" }, { "from": "app2", "to": "db_p", "label": "writes" }, { "from": "db_p", "to": "db_r", "label": "async replication" }, { "from": "app1", "to": "db_r", "label": "reads" }, { "from": "app2", "to": "db_r", "label": "reads" } ], "annotations": { "cdn": "Serves static assets and cached pages. ~99.99%+ availability from providers like Cloudflare. Shields origin from traffic spikes.", "lb": "Active health checks every 5s. Routes around unhealthy app servers in <10s. Two LB instances in active-passive for LB-level HA.", "app1": "Stateless application servers in separate AZs. If one fails, LB drains connections and stops sending traffic within one health-check interval.", "db_p": "Primary handles all writes. Synchronous or semi-synchronous replication to replica. Failover takes 30-60s with automated orchestration (e.g., Patroni).", "db_r": "Read replica in separate AZ. If primary fails, promoted to new primary. Read traffic continues uninterrupted during primary failover." } }
\`\`\`

---

## Worked Example: Calculating a System's SLO

Let's say you're designing a checkout service. It calls four downstream services:

\`\`\`trace
{ "title": "Checkout Service: Availability Calculation", "language": "python", "code": "# Services called during checkout (in series — all must succeed)\\nservices = {\\n    'api_gateway':      99.99,\\n    'auth_service':     99.95,\\n    'inventory_api':    99.90,\\n    'payment_gateway':  99.95,\\n    'order_db':         99.99,\\n}\\n\\nrunning = 1.0\\nfor name, avail in services.items():\\n    running *= avail / 100\\n    print(running)\\n\\nresult = running * 100\\nprint(result)", "frames": [ { "line": 2, "vars": { "services": "{api_gateway: 99.99, auth: 99.95, ...}" }, "note": "Define all downstream service availabilities", "stdout": "" }, { "line": 8, "vars": { "running": 1.0, "name": "api_gateway", "avail": 99.99 }, "note": "Start at 100%. Multiply in first service.", "stdout": "" }, { "line": 8, "vars": { "running": 0.9999, "name": "auth_service", "avail": 99.95 }, "note": "0.9999 × 0.9995 = 0.99940...", "stdout": "0.9999" }, { "line": 8, "vars": { "running": 0.99940, "name": "inventory_api", "avail": 99.90 }, "note": "0.99940 × 0.9990 = 0.99840...", "stdout": "0.9994005" }, { "line": 8, "vars": { "running": 0.99840, "name": "payment_gateway", "avail": 99.95 }, "note": "0.99840 × 0.9995 = 0.99790...", "stdout": "0.99840" }, { "line": 8, "vars": { "running": 0.99790, "name": "order_db", "avail": 99.99 }, "note": "0.99790 × 0.9999 = 0.99780...", "stdout": "0.9979" }, { "line": 12, "vars": { "result": 99.78 }, "note": "System availability = 99.78% — almost 19 hours of downtime/year! SLO must account for this.", "stdout": "99.78" } ], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "danger", "title": "The Cascade Problem", "content": "Four services each at 99.9%+ compound to **99.78%** — nearly 2 nines. This is why microservices architectures must use **circuit breakers, timeouts, and graceful degradation**. If the inventory service is down, can checkout still proceed with a 'check stock later' fallback? If yes, that service is no longer in the critical path and doesn't subtract from your availability budget." }
\`\`\`

---

## Practice: Fill in the Gaps

\`\`\`fillblank
{ "title": "Error Budget Arithmetic", "prompt": "Complete the error_budget function that calculates minutes of allowed downtime per month:", "language": "python", "template": "def error_budget_minutes(slo_percent: float, days: int = 30) -> float:\\n    total_minutes = days * ___ * 60\\n    budget = (100 - slo_percent) / ___\\n    return total_minutes * budget\\n\\n# 99.9% SLO should return ~43.2 minutes\\nprint(error_budget_minutes(99.9))", "blanks": [ { "answer": "24", "hint": "Hours in a day" }, { "answer": "100", "hint": "Convert percentage to fraction by dividing by this" } ] }
\`\`\`

\`\`\`fillblank
{ "title": "Compound Availability", "prompt": "Fill in the formula to calculate compound availability for services in series:", "language": "python", "template": "def series_availability(services: list) -> float:\\n    result = ___\\n    for avail in services:\\n        result ___ (avail / 100)\\n    return result * 100", "blanks": [ { "answer": "1.0", "hint": "Multiplication identity — start here before multiplying in each service" }, { "answer": "*=", "hint": "Compound by multiplying each availability fraction" } ] }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Availability Numbers and SLAs", "questions": [ { "question": "A service has a 99.9% monthly SLO. How many minutes of downtime are in its monthly error budget?", "options": ["4.4 minutes", "43.2 minutes", "432 minutes", "8.7 hours"], "answer": 1, "explanation": "0.1% of 30 days = 0.001 × 43,200 minutes = 43.2 minutes. That's why 99.9% is often called 'three nines' — you get roughly 43 minutes of allowable downtime per month." }, { "question": "You have three services in series, each with 99.9% availability. What is the system's approximate availability?", "options": ["99.9%", "99.7%", "99.0%", "97.0%"], "answer": 1, "explanation": "0.999 × 0.999 × 0.999 = 0.997, so approximately 99.7%. Each service in series multiplies the failure probability, lowering overall availability." }, { "question": "What is the difference between an SLO and an SLA?", "options": ["SLO is external (customer contract); SLA is internal engineering target", "SLO is internal engineering target; SLA is external customer contract with financial consequences", "They are interchangeable terms for the same concept", "SLO applies to latency; SLA applies only to uptime"], "answer": 1, "explanation": "An SLO (Service Level Objective) is your internal target — the threshold your SLI must meet. An SLA (Service Level Agreement) is a contract with customers that has financial penalties. Your SLO should be stricter than your SLA to create a safety buffer." }, { "question": "You add a second replica of a 99.9% database running in parallel. What best describes the new availability?", "options": ["99.9% — no change because both replicas have the same spec", "99.99% — exactly double the nines", "99.9999% — because both must fail simultaneously", "100% — perfect availability with redundancy"], "answer": 2, "explanation": "Two 99.9% replicas in parallel: A = 1 − (0.001 × 0.001) = 1 − 0.000001 = 99.9999%. Both must fail at the same time for the system to be unavailable, which is a 1-in-a-million probability per unit time. This assumes independent failures." }, { "question": "A team's checkout service calls 5 downstream services, each at 99.9%. A new proposal suggests making one service call optional (fail gracefully if it times out). What is the primary reliability benefit?", "options": ["It reduces the number of SLAs the team needs to negotiate", "It removes that service from the critical path, improving compound availability", "It makes the service 10× faster", "It eliminates the need for error budgets"], "answer": 1, "explanation": "When a service is optional and the system can degrade gracefully without it, it's no longer in the critical path. Compound availability is only reduced by services that *must* succeed. Graceful degradation is one of the most powerful tools for improving overall system availability." } ] }
\`\`\`

---

## Real-World Benchmarks

Here's how major cloud providers publish their SLAs and what that means in practice:

| Provider / Service | Published SLA | Monthly Error Budget | Notes |
|---|---|---|---|
| AWS EC2 (single AZ) | 99.5% | 3.6 hours | SLA is for region, not AZ |
| AWS EC2 (multi-AZ) | 99.99% | 4.4 minutes | Active-active across 2+ AZs |
| AWS S3 | 99.9% | 43.2 minutes | 99.99% durability (different concept) |
| Google Cloud SQL | 99.95% | 21.9 minutes | |
| Stripe API | 99.99%+ | < 4.4 minutes | Financial infrastructure requires high bar |
| Cloudflare CDN | 99.99% | 4.4 minutes | Globally distributed; typical actual > 99.999% |

\`\`\`callout
{ "type": "info", "title": "Durability ≠ Availability", "content": "S3 advertises **99.999999999% (11 nines) durability** alongside 99.9% availability. These measure different things. **Availability** = can I access my data right now? **Durability** = will my data still exist next year? You can have high durability with low availability (data is safe but the service is down) or low durability with high availability (service is up but data gets corrupted). For databases: replicate for availability, back up for durability." }
\`\`\`

---

## Putting It All Together: Designing for Your SLA

\`\`\`steps
{ "title": "How to Design for a Target Availability", "steps": [ { "title": "Define your SLI first", "content": "Choose *what* you'll measure. For most services: **request success rate** is the primary SLI.\\n\\n\`SLI = (requests returning 2xx) / (total requests) × 100\`\\n\\nMake it unambiguous. Who owns the measurement? At what boundary? (Client-side? Server-side? Load balancer logs?)" }, { "title": "Set your SLO with a safety buffer", "content": "Start with what your users actually need. A B2B dashboard may be fine at 99.5%. A payment flow needs 99.99%.\\n\\nSet your internal SLO **0.1–0.5% above your SLA**:\\n- SLA = 99.9% → SLO = 99.95%\\n- This gives you a ~21-minute buffer before breaching the contract." }, { "title": "Calculate your error budget", "content": "\`budget_minutes = (100 - slo_percent) / 100 × period_days × 24 × 60\`\\n\\nFor 99.95% over 30 days: 21.6 minutes.\\n\\nEstablish a **burn rate policy**: if you consume 50% of budget in the first week, freeze risky deploys and investigate." }, { "title": "Identify your critical path", "content": "Draw your architecture. Mark every service that a request *must* reach. Calculate compound availability for the critical path.\\n\\nIf compound availability < SLO, you have three options:\\n1. Add redundancy (parallel replicas)\\n2. Remove services from the critical path (async/graceful degradation)\\n3. Negotiate a lower SLA" }, { "title": "Add redundancy at the bottleneck", "content": "Identify the single point of failure with the lowest availability in your critical path. Add parallel replicas **in different fault domains** (separate AZs, separate racks).\\n\\nRemember: replicas in the same AZ don't give you independent failures." }, { "title": "Instrument and alert", "content": "Your SLO is only actionable if you measure it in real time. Set up:\\n- **Prometheus/Datadog** to track SLI continuously\\n- **Burn rate alerts**: alert when error budget consumption rate threatens to exhaust budget before end of window\\n- **Page only when actionable**: don't wake engineers for transient 30-second blips that self-heal" } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Each additional 'nine' of availability cuts allowable downtime by ~10×: 99.9% = 8.7 hrs/year, 99.99% = 52 min/year.", "SLI measures reality, SLO is your internal target, SLA is your customer contract — set SLO stricter than SLA to create a safety buffer.", "Error budget = 100% − SLO%. Spend it deliberately on risky deploys; stop feature work when it's nearly exhausted.", "Services in series multiply availability downward: 10 services at 99.9% = ~99.0% system. Services in parallel multiply failure probability downward: two 99.9% replicas ≈ 99.9999%.", "Correlated failures break the parallel math — real redundancy requires different AZs, racks, or regions to ensure independent failure domains.", "Durability (will data survive?) and availability (can I access it now?) are distinct properties — a system can have high durability and low availability." ] }
\`\`\``,
      starterCode: `# Availability Numbers and SLAs
# Calculate uptime, downtime, error budgets, and redundancy

import math

# --- Part 1: Downtime Calculator ---

def calculate_downtime(availability_percent: float, period_hours: float) -> dict:
    """
    Given an availability percentage and a time period in hours,
    return a dict with:
      - 'uptime_hours': hours the system is up
      - 'downtime_hours': hours the system is down
      - 'downtime_minutes': downtime in minutes
      - 'downtime_seconds': downtime in seconds
    """
    # TODO: Calculate uptime and downtime
    # Hint: downtime = period * (1 - availability / 100)
    pass


# --- Part 2: Error Budget ---

def calculate_error_budget(slo_percent: float, period_days: int = 30) -> dict:
    """
    Given an SLO (e.g. 99.9) and a rolling window in days,
    return a dict with:
      - 'budget_minutes': total allowed downtime in minutes
      - 'budget_requests_pct': percentage of requests that may fail
      - 'is_generous': True if budget > 60 minutes, False otherwise
    """
    # TODO: Calculate error budget for the period
    # Hint: error_budget = 1 - (slo / 100)
    # budget_minutes = error_budget * period_days * 24 * 60
    pass


# --- Part 3: Redundancy / Compound Availability ---

def compound_availability(availabilities: list[float]) -> float:
    """
    Given a list of component availability percentages (e.g. [99.9, 99.5]),
    return the combined system availability percentage when components
    are arranged in SERIES (all must be up for the system to be up).

    Formula: A_total = A1 * A2 * ... * An  (using fractions, not percentages)
    """
    # TODO: Multiply all availability fractions together and return as a percentage
    pass


def parallel_availability(availability_percent: float, num_replicas: int) -> float:
    """
    Given a single component's availability and the number of identical
    parallel replicas, return the combined availability percentage.
    The system is DOWN only when ALL replicas are down simultaneously.

    Formula: A_total = 1 - (1 - A)^n
    """
    # TODO: Calculate availability when replicas run in parallel
    pass


# --- Part 4: Nines Counter ---

def count_nines(availability_percent: float) -> float:
    """
    Return the number of 'nines' in an availability figure.
    e.g. 99.9% -> 3 nines, 99.99% -> 4 nines, 99.999% -> 5 nines

    Formula: nines = -log10(1 - availability / 100)
    """
    # TODO: Use math.log10 to compute the number of nines
    pass


# --- Run and verify your work ---

if __name__ == "__main__":
    # Test Part 1
    print("=== Downtime per year ===")
    for sla in [99.0, 99.9, 99.99, 99.999]:
        result = calculate_downtime(sla, 365 * 24)  # hours in a year
        if result:
            print(f"{sla}%: {result['downtime_minutes']:.1f} min / year")

    # Test Part 2
    print("\\n=== Error Budgets (30-day window) ===")
    for slo in [99.0, 99.9, 99.95]:
        budget = calculate_error_budget(slo)
        if budget:
            print(f"SLO {slo}%: {budget['budget_minutes']:.1f} min budget, generous={budget['is_generous']}")

    # Test Part 3
    print("\\n=== Series Availability ===")
    components = [99.9, 99.9, 99.9]  # three 99.9% services in series
    series = compound_availability(components)
    if series:
        print(f"3x 99.9% in series: {series:.4f}%")

    print("\\n=== Parallel Availability ===")
    parallel = parallel_availability(99.9, 2)  # two replicas
    if parallel:
        print(f"2x 99.9% in parallel: {parallel:.6f}%")

    # Test Part 4
    print("\\n=== Number of Nines ===")
    for a in [90.0, 99.0, 99.9, 99.99, 99.999]:
        nines = count_nines(a)
        if nines:
            print(f"{a}% -> {nines:.1f} nines")
`,
      solutionCode: `# Availability Numbers and SLAs — Solution

import math


# --- Part 1: Downtime Calculator ---

def calculate_downtime(availability_percent: float, period_hours: float) -> dict:
    """
    Convert an availability % into concrete downtime for a given period.
    """
    availability_fraction = availability_percent / 100
    uptime_hours = period_hours * availability_fraction
    downtime_hours = period_hours * (1 - availability_fraction)
    return {
        "uptime_hours": uptime_hours,
        "downtime_hours": downtime_hours,
        "downtime_minutes": downtime_hours * 60,
        "downtime_seconds": downtime_hours * 3600,
    }


# --- Part 2: Error Budget ---

def calculate_error_budget(slo_percent: float, period_days: int = 30) -> dict:
    """
    An error budget is how much failure you're allowed before violating your SLO.
    A 99.9% SLO over 30 days allows ~43 minutes of downtime.
    """
    error_budget_fraction = 1 - (slo_percent / 100)
    period_minutes = period_days * 24 * 60
    budget_minutes = error_budget_fraction * period_minutes
    return {
        "budget_minutes": budget_minutes,
        # budget as a % of requests that may fail (same fraction)
        "budget_requests_pct": error_budget_fraction * 100,
        "is_generous": budget_minutes > 60,
    }


# --- Part 3: Redundancy / Compound Availability ---

def compound_availability(availabilities: list[float]) -> float:
    """
    Series arrangement: every component must be healthy.
    Each component's failure probability multiplies, so overall availability shrinks.
    Three 99.9% services in series -> 99.9^3 ≈ 99.7%
    """
    result = 1.0
    for a in availabilities:
        result *= a / 100  # convert % to fraction before multiplying
    return result * 100   # return as a percentage


def parallel_availability(availability_percent: float, num_replicas: int) -> float:
    """
    Parallel arrangement: the system fails only when every replica fails.
    Failure probability = (1 - A)^n, so availability shoots up dramatically.
    Two 99.9% replicas in parallel -> 1 - (0.001)^2 = 99.9999%
    """
    failure_fraction = 1 - (availability_percent / 100)
    combined_failure = failure_fraction ** num_replicas
    return (1 - combined_failure) * 100


# --- Part 4: Nines Counter ---

def count_nines(availability_percent: float) -> float:
    """
    The 'number of nines' is a shorthand for SLA quality.
    -log10(unavailability_fraction) gives the count directly:
      99.9%  -> unavailability = 0.001 -> -log10(0.001) = 3.0 nines
      99.99% -> unavailability = 0.0001 -> -log10(0.0001) = 4.0 nines
    """
    unavailability = 1 - (availability_percent / 100)
    if unavailability <= 0:
        return float('inf')  # 100% availability = infinite nines
    return -math.log10(unavailability)


# --- Run and verify ---

if __name__ == "__main__":
    print("=== Downtime per year ===")
    for sla in [99.0, 99.9, 99.99, 99.999]:
        result = calculate_downtime(sla, 365 * 24)
        print(f"{sla}%: {result['downtime_minutes']:.1f} min / year")
    # 99.0%   -> 5256.0 min  (~3.65 days)
    # 99.9%   ->  525.6 min  (~8.7 hours)
    # 99.99%  ->   52.6 min
    # 99.999% ->    5.3 min

    print("\\n=== Error Budgets (30-day window) ===")
    for slo in [99.0, 99.9, 99.95]:
        budget = calculate_error_budget(slo)
        print(f"SLO {slo}%: {budget['budget_minutes']:.1f} min budget, generous={budget['is_generous']}")
    # 99.0%  -> 432.0 min, generous=True
    # 99.9%  ->  43.2 min, generous=False
    # 99.95% ->  21.6 min, generous=False

    print("\\n=== Series Availability ===")
    components = [99.9, 99.9, 99.9]
    series = compound_availability(components)
    print(f"3x 99.9% in series: {series:.4f}%")
    # -> 99.7003%  (worse than any single component)

    print("\\n=== Parallel Availability ===")
    parallel = parallel_availability(99.9, 2)
    print(f"2x 99.9% in parallel: {parallel:.6f}%")
    # -> 99.999900%  (two extra nines for free!)

    print("\\n=== Number of Nines ===")
    for a in [90.0, 99.0, 99.9, 99.99, 99.999]:
        nines = count_nines(a)
        print(f"{a}% -> {nines:.1f} nines")
    # 90.0%   -> 1.0 nines
    # 99.0%   -> 2.0 nines
    # 99.9%   -> 3.0 nines
    # 99.99%  -> 4.0 nines
    # 99.999% -> 5.0 nines
`,
    },
    {
      id: "rate-limiting-algorithms",
      slug: "rate-limiting-algorithms",
      title: "Rate Limiting: Token Bucket, Leaky Bucket, and Sliding Window",
      content: `# Rate Limiting: Token Bucket, Leaky Bucket, and Sliding Window

Rate limiting is your API's immune system. Without it, a single misconfigured client can flood your servers with thousands of requests per second — starving legitimate users, exhausting your database connection pool, and triggering cascading failures across your entire stack.

In this lesson you will implement four rate limiting algorithms from scratch, understand exactly when each one shines and fails, and learn how to coordinate them across a fleet of gateway instances using Redis atomic operations.

---

## What Rate Limiting Actually Does

A rate limiter sits in front of your API and answers one question for every incoming request: *"Is this identity allowed to proceed right now?"* The identity might be an IP address, a user ID, an API key, or a tenant ID.

When a request exceeds the limit, the server returns **HTTP 429 Too Many Requests** — ideally with a \`Retry-After\` header so well-behaved clients know when to retry rather than hammering harder.

\`\`\`concept
{
  "title": "The Four Rate Limiting Algorithms at a Glance",
  "variant": "mental-model",
  "content": "**Fixed Window Counter** — divide time into discrete slots, count requests per slot. Dead simple, O(1) memory, but has a critical boundary burst vulnerability.\\n\\n**Token Bucket** — accumulate tokens over time up to a \`capacity\` ceiling. Burst-tolerant. The general-purpose default for most APIs.\\n\\n**Leaky Bucket** — requests enter a queue that drains at a constant rate. Zero burst tolerance. Best for protecting fragile downstream services.\\n\\n**Sliding Window** — rolling time frame with no sharp reset boundary. Most accurate. Two variants: log (stores every timestamp, O(n)) and counter (blends two windows by overlap weight, O(1))."
}
\`\`\`

---

## Algorithm 1: Fixed Window Counter

The baseline approach divides the timeline into equal-sized slots and maintains one counter per slot. Each request increments the current slot's counter. When the counter reaches the limit, requests are rejected until the next slot begins and the counter resets.

\`\`\`
t=0──────────────t=1──────────────t=2──────────────t=3
│   slot 0       │   slot 1       │   slot 2       │
│  count=5/5     │  count=0/5     │  count=0/5     │
│  FULL          │  fresh start   │  fresh start   │
\`\`\`

This works and is easy to implement — but it has one fatal flaw.

\`\`\`callout
{
  "type": "warning",
  "title": "The Boundary Burst Problem",
  "content": "With a limit of 100 requests/second, a client sends 100 requests at \`t=0.99s\` (last slot fills up) then 100 more at \`t=1.01s\` (new slot, counter reset to 0). That is **200 requests in 20 milliseconds** — 2× the intended limit, perfectly legal by the algorithm's rules.\\n\\nThis makes fixed window unsuitable for any public-facing endpoint. Sliding window algorithms eliminate this by using a rolling frame with no sharp reset boundary."
}
\`\`\`

---

## Algorithm 2: Token Bucket

The token bucket is the most widely deployed algorithm in production. AWS API Gateway, Stripe, and GitHub all use variations of it. The intuition: **you have a bucket that fills with tokens at rate \`r\` tokens/second and holds at most \`capacity\` tokens.** Each request consumes one token. If the bucket is empty, the request is rejected.

- **Rate** (\`r\` tokens/sec): the sustained long-term throughput limit
- **Capacity** (max tokens): the maximum instantaneous burst size

If a client is quiet for 5 seconds and your rate is 2/s with capacity 10, they accumulate the full 10 tokens and can fire a burst of 10 requests instantly — then they're back to the 2/s sustained rate.

\`\`\`trace
{
  "title": "Token Bucket: Tracing a Burst of Four Rapid Requests",
  "language": "python",
  "code": "import time\\nclass TokenBucket:\\n    def __init__(self, rate, capacity):\\n        self.rate = rate\\n        self.capacity = capacity\\n        self.tokens = float(capacity)\\n        self.last_refill = 0.0\\n    def allow_request(self, now=0.0):\\n        elapsed = now - self.last_refill\\n        self.tokens = min(self.capacity,\\n                         self.tokens + elapsed * self.rate)\\n        self.last_refill = now\\n        if self.tokens >= 1:\\n            self.tokens -= 1\\n            return True\\n        return False\\nbucket = TokenBucket(rate=2, capacity=3)\\nr1 = bucket.allow_request(now=0.0)\\nr2 = bucket.allow_request(now=0.0)\\nr3 = bucket.allow_request(now=0.0)\\nr4 = bucket.allow_request(now=0.0)",
  "frames": [
    { "line": 16, "vars": {"bucket.tokens": 3.0, "bucket.capacity": 3, "bucket.rate": 2}, "note": "Bucket created with capacity=3. Starts completely full: tokens=3.0" },
    { "line": 17, "vars": {"elapsed": 0.0, "bucket.tokens": 2.0}, "note": "Request 1 (now=0.0s): elapsed=0, no refill happens. Consume 1 token: 3→2. ALLOWED ✓", "stdout": "r1 = True" },
    { "line": 18, "vars": {"elapsed": 0.0, "bucket.tokens": 1.0}, "note": "Request 2 (now=0.0s): still no elapsed time. Consume 1 token: 2→1. ALLOWED ✓", "stdout": "r2 = True" },
    { "line": 19, "vars": {"elapsed": 0.0, "bucket.tokens": 0.0}, "note": "Request 3 (now=0.0s): last token consumed: 1→0. Bucket now empty. ALLOWED ✓", "stdout": "r3 = True" },
    { "line": 20, "vars": {"elapsed": 0.0, "bucket.tokens": 0.0}, "note": "Request 4 (now=0.0s): tokens=0. Condition \`tokens >= 1\` is False. REJECTED ✗", "stdout": "r4 = False" }
  ],
  "speed": 950
}
\`\`\`

Notice that after 0.5 seconds (\`elapsed=0.5\`), the bucket would have refilled \`0.5 × 2 = 1\` token, allowing request 4 to proceed. The bucket continuously accumulates capacity while the client is quiet.

---

## Algorithm 3: Leaky Bucket

The leaky bucket is the inverse of the token bucket. Instead of accumulating capacity, **incoming requests enter a fixed-size queue that drains at exactly \`leak_rate\` requests per second**. If the queue is full, new requests are rejected.

\`\`\`
Incoming requests (any rate)
        ↓  ↓ ↓  ↓↓↓  ↓
   ┌────────────────┐
   │                │  queue (capacity=5)
   │  • • • • •    │  ← full, new arrivals REJECTED
   │                │
   └───────┬────────┘
           ↓ ↓ ↓ ↓ ↓  (constant leak_rate = 2/s)
       downstream service
\`\`\`

No matter how many requests arrive, the downstream service never sees more than \`leak_rate\` requests per second. This is the right algorithm when:
- Protecting a third-party API with a hard rate limit
- Preventing retry storms from overwhelming a recovering service
- Shaping outbound traffic to a constant rate

The downside: even if you've been quiet for hours, a sudden burst fills the queue immediately and subsequent arrivals are rejected until the queue drains.

---

## Algorithm 4: Sliding Window

The sliding window removes the fixed window's reset boundary entirely. Instead of a hard reset every N seconds, the window continuously rolls forward in time.

**Sliding Window Log** stores a timestamp for every request in a deque. On each new request, it evicts timestamps older than \`window_seconds\` from the front, then checks the remaining count. Perfectly accurate, but uses O(n) memory per identity — at 1,000 requests/second with a 60-second window, that's 60,000 timestamps per user.

**Sliding Window Counter** is the practical production choice. It maintains two consecutive fixed-window counters and blends them by the proportion the previous window still overlaps with the current position:

\`\`\`
prev_window (count=80)   |   curr_window (count=20)
─────────────────────────┼─────────────────────────
                         │← 30% of window remains
                         t_now

overlap_fraction = 0.30
estimated_count = 80 × 0.30 + 20 = 44
\`\`\`

This gives you O(1) memory per identity, no boundary burst, and accuracy within ~0.1%. It is the best practical choice at scale.

\`\`\`algoviz
{
  "title": "Sliding Window Log: The 1-Second Window Rolls Forward",
  "type": "array",
  "data": [100, 300, 500, 700, 900, 1100, 1300, 1500, 1700, 1900],
  "frames": [
    { "highlight": [0, 1], "label": "t=300ms: window=[0–1000ms]. 2 timestamps inside, limit=4. ALLOWED ✓", "stats": {"in_window": 2, "limit": 4, "t_ms": 300} },
    { "highlight": [0, 1, 2, 3], "label": "t=700ms: 4 timestamps in window. Count equals limit. Still ALLOWED ✓", "stats": {"in_window": 4, "limit": 4, "t_ms": 700} },
    { "highlight": [0, 1, 2, 3], "label": "t=900ms: 5th request arrives → count would be 5 > 4. REJECTED ✗", "stats": {"in_window": 4, "limit": 4, "t_ms": 900} },
    { "highlight": [1, 2, 3, 4], "label": "t=1100ms: window slides to [100–1100ms]. Entry at t=100ms expires! Count=4.", "stats": {"in_window": 4, "limit": 4, "t_ms": 1100} },
    { "highlight": [2, 3, 4, 5], "label": "t=1300ms: window=[300–1300ms]. Entries at 100ms and 300ms gone. New request fits. ALLOWED ✓", "stats": {"in_window": 4, "limit": 4, "t_ms": 1300} }
  ],
  "speed": 1000
}
\`\`\`

Array values are request timestamps in milliseconds. Highlighted entries are those currently inside the 1-second rolling window.

---

## All Four Algorithms: Running Code

Here are all four algorithms implemented in Python. Run this to compare how they behave on the same burst of 8 rapid back-to-back requests:

\`\`\`playground
{
  "title": "All Four Rate Limiting Algorithms — Burst Comparison",
  "language": "python",
  "code": "import time\\nfrom collections import deque\\n\\nclass FixedWindow:\\n    def __init__(self, limit, window):\\n        self.limit = limit\\n        self.window = window\\n        self.count = 0\\n        self.reset_at = time.time() + window\\n\\n    def allow_request(self):\\n        now = time.time()\\n        if now >= self.reset_at:\\n            self.count = 0\\n            self.reset_at = now + self.window\\n        if self.count < self.limit:\\n            self.count += 1\\n            return True\\n        return False\\n\\n\\nclass TokenBucket:\\n    def __init__(self, rate, capacity):\\n        self.rate = rate\\n        self.capacity = capacity\\n        self.tokens = float(capacity)\\n        self.last_refill = time.time()\\n\\n    def allow_request(self):\\n        now = time.time()\\n        elapsed = now - self.last_refill\\n        self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)\\n        self.last_refill = now\\n        if self.tokens >= 1:\\n            self.tokens -= 1\\n            return True\\n        return False\\n\\n\\nclass LeakyBucket:\\n    def __init__(self, capacity, leak_rate):\\n        self.capacity = capacity\\n        self.leak_rate = leak_rate\\n        self.queue = 0.0\\n        self.last_leak = time.time()\\n\\n    def allow_request(self):\\n        now = time.time()\\n        leaked = (now - self.last_leak) * self.leak_rate\\n        self.queue = max(0.0, self.queue - leaked)\\n        self.last_leak = now\\n        if self.queue < self.capacity:\\n            self.queue += 1\\n            return True\\n        return False\\n\\n\\nclass SlidingWindowLog:\\n    def __init__(self, limit, window_seconds):\\n        self.limit = limit\\n        self.window = window_seconds\\n        self.log = deque()\\n\\n    def allow_request(self):\\n        now = time.time()\\n        while self.log and self.log[0] <= now - self.window:\\n            self.log.popleft()\\n        if len(self.log) < self.limit:\\n            self.log.append(now)\\n            return True\\n        return False\\n\\n\\nalgorithms = [\\n    ('Fixed Window   (limit=5, 1s) ', FixedWindow(5, 1.0)),\\n    ('Token Bucket   (rate=2, cap=5)', TokenBucket(2, 5)),\\n    ('Leaky Bucket   (cap=5, leak=2)', LeakyBucket(5, 2.0)),\\n    ('Sliding Window (limit=5, 1s) ', SlidingWindowLog(5, 1.0)),\\n]\\n\\nprint('8 rapid burst requests per algorithm (limit=5):')\\nprint('-' * 55)\\nfor name, limiter in algorithms:\\n    results = []\\n    for _ in range(8):\\n        results.append('OK' if limiter.allow_request() else '--')\\n    print(name + ': ' + ' '.join(results))\\n    print('  Allowed: ' + str(results.count('OK')) + '/8')",
  "runnable": true
}
\`\`\`

**What to observe:** Token bucket and fixed window both allow the initial burst of 5 (capacity/limit). Leaky bucket allows 5 but more slowly (queue drain catches up). All four correctly reject requests 6–8 in the same rapid burst window.

---

## Practice: Complete the Leaky Bucket

\`\`\`fillblank
{
  "title": "Implement LeakyBucket.allow_request()",
  "prompt": "The leaky bucket drains at exactly \`leak_rate\` requests per second. Fill in the four blanks to make the implementation correct.",
  "language": "python",
  "template": "class LeakyBucket:\\n    def __init__(self, capacity, leak_rate):\\n        self.capacity = capacity\\n        self.leak_rate = leak_rate\\n        self.queue = ___             # queue starts empty\\n        self.last_leak = time.time()\\n\\n    def allow_request(self):\\n        now = time.time()\\n        leaked = (now - self.last_leak) * ___  # drained amount\\n        self.queue = max(0.0, self.queue - ___)  # drain queue\\n        self.last_leak = now\\n        if self.queue < self.___:    # check against max size\\n            self.queue += 1\\n            return True\\n        return False",
  "blanks": [
    { "answer": "0", "hint": "On startup there are no pending requests in the queue." },
    { "answer": "self.leak_rate", "hint": "The drain speed is the \`leak_rate\` — how many requests escape per second." },
    { "answer": "leaked", "hint": "Subtract the amount that has drained since the last call." },
    { "answer": "capacity", "hint": "A new request is only accepted if there is still room in the queue." }
  ]
}
\`\`\`

---

## Distributed Rate Limiting with Redis

Everything above works perfectly on a single server. The moment you deploy a second API gateway instance, the guarantees break. Each gateway maintains its own in-memory counter, so a client can route interleaved requests across N instances and effectively get \`limit × N\` requests through — the limit multiplies with your fleet size.

**The fix:** every gateway instance checks and increments a **single shared counter in Redis** using atomic operations.

\`\`\`sysdiag
{
  "title": "Distributed Rate Limiting: Redis as the Single Source of Truth",
  "width": 680,
  "height": 360,
  "nodes": [
    { "id": "c1", "label": "Client A", "x": 55, "y": 95, "kind": "client" },
    { "id": "c2", "label": "Client B", "x": 55, "y": 265, "kind": "client" },
    { "id": "gw1", "label": "Gateway 1", "x": 215, "y": 95, "kind": "service" },
    { "id": "gw2", "label": "Gateway 2", "x": 215, "y": 265, "kind": "service" },
    { "id": "redis", "label": "Redis Cluster", "x": 430, "y": 180, "kind": "database" },
    { "id": "api", "label": "API Servers", "x": 610, "y": 180, "kind": "service" }
  ],
  "edges": [
    { "from": "c1", "to": "gw1", "label": "request" },
    { "from": "c2", "to": "gw2", "label": "request" },
    { "from": "gw1", "to": "redis", "label": "INCR + EXPIRE" },
    { "from": "gw2", "to": "redis", "label": "INCR + EXPIRE" },
    { "from": "gw1", "to": "api", "label": "forward if ok" },
    { "from": "gw2", "to": "api", "label": "forward if ok" }
  ],
  "annotations": {
    "redis": "Atomic Lua script: INCR the counter for key rate:{user_id}:{window_slot}, set EXPIRE on first write. All gateway instances share the same key space — no local state anywhere.",
    "gw1": "On each request: execute Lua script against Redis. If returned count > limit, respond 429. Otherwise forward to the API tier.",
    "gw2": "Identical logic to Gateway 1. Statelessly handles any request — the counter lives entirely in Redis."
  }
}
\`\`\`

The Redis Lua script runs atomically on the server, so there is no race condition even with hundreds of concurrent gateways:

\`\`\`lua
-- Atomic check-and-increment for fixed window rate limiting
local key    = KEYS[1]          -- e.g. "rate:user123:1704067200"
local limit  = tonumber(ARGV[1])
local window = tonumber(ARGV[2]) -- seconds

local count = redis.call('INCR', key)
if count == 1 then
  redis.call('EXPIRE', key, window)  -- set TTL only on first write
end
if count > limit then
  return 0   -- rejected: over limit
end
return 1     -- allowed
\`\`\`

The key encodes both the identity and the current time window (e.g., the Unix timestamp rounded down to the nearest second). Redis \`EXPIRE\` automatically cleans up old counters — no background garbage collection needed.

\`\`\`callout
{
  "type": "info",
  "title": "Strong vs. Eventual Consistency Trade-off",
  "content": "A single Redis primary gives strong consistency (every gateway sees the exact same count) but adds ~0.5–2ms of network latency per request and creates a single point of failure.\\n\\nFor extreme scale, use **Redis Cluster with eventual consistency**: each gateway writes to its local shard and accepts slight over-counting. Correct on the next sync. For most APIs handling under 100K req/s, the strongly consistent single-primary approach is simpler, faster to reason about, and entirely sufficient."
}
\`\`\`

---

## Choosing the Right Algorithm

| Algorithm | Burst handling | Memory | Best use case |
|---|---|---|---|
| Fixed Window | Vulnerable at boundaries | O(1) | Internal services only |
| **Token Bucket** | **Burst up to capacity** | **O(1)** | **General-purpose APIs** |
| Leaky Bucket | No burst (constant drain) | O(1) | Outbound traffic shaping |
| Sliding Window Log | Accurate, no boundary burst | O(n) | Low-volume, high-accuracy |
| **Sliding Window Counter** | **No boundary burst** | **O(1)** | **High-scale public APIs** |

The canonical production recommendation: **token bucket as your default; sliding window counter when boundary burst is a security concern; leaky bucket for protecting downstream services from retry storms.**

---

\`\`\`quiz
{
  "title": "Rate Limiting Algorithms",
  "questions": [
    {
      "question": "A client sends 50 requests in a single millisecond burst after being idle for 10 seconds. Your API uses a token bucket with rate=5/s and capacity=20. How many of the 50 burst requests are allowed?",
      "options": [
        "5 — only the sustained rate applies, not accumulated tokens",
        "10 — idle time adds 10 tokens at rate=5/s before hitting capacity",
        "20 — the bucket fills to capacity (20) during the idle period",
        "50 — bursts are always fully allowed in token bucket"
      ],
      "answer": 2,
      "explanation": "After 10 seconds idle, the bucket would accumulate 10s × 5/s = 50 tokens — but it is capped at capacity=20. So exactly 20 tokens are available, allowing 20 of the 50 burst requests. This is the key insight of token bucket: \`capacity\` is your burst ceiling, not the rate."
    },
    {
      "question": "You are rate limiting outbound calls to a third-party payment processor that can handle a maximum of 10 steady requests/second. Which algorithm best enforces this guarantee?",
      "options": [
        "Token Bucket (rate=10, capacity=10) — prevents exceeding 10/s on average",
        "Leaky Bucket (capacity=10, leak_rate=10) — enforces a constant 10/s output regardless of input",
        "Fixed Window Counter (limit=10, window=1s) — simple and accurate per-second counting",
        "Sliding Window Counter (limit=10, window=1s) — most accurate with no boundary burst"
      ],
      "answer": 1,
      "explanation": "Leaky bucket enforces a strictly constant output drain rate. Even if a retry storm delivers 500 requests simultaneously, the payment processor sees at most 10/s — the queue absorbs the spike and drains steadily. Token bucket with capacity=10 would still allow a burst of 10 simultaneous requests, which could overwhelm a fragile downstream service."
    },
    {
      "question": "What is the 'boundary burst' vulnerability specific to the Fixed Window Counter algorithm?",
      "options": [
        "The counter can overflow to a negative value when too many resets happen simultaneously",
        "A client can send up to 2× the configured limit in a short span straddling two consecutive window resets",
        "The window size cannot be changed at runtime without losing the current count",
        "Two requests arriving in the same millisecond can both read count=0 before either increments"
      ],
      "answer": 1,
      "explanation": "With a limit of N per window, a client can legally send N requests just before the reset boundary and N requests just after — both windows stay within limit, but the effective rate in that brief span is 2N. Sliding window algorithms eliminate this because the window continuously rolls forward with no discrete reset event."
    },
    {
      "question": "You have 8 API gateway instances, each with its own in-memory token bucket (capacity=3). A client makes 3 requests, each routed to a different gateway instance. What happens?",
      "options": [
        "All 3 requests are allowed — each instance correctly sees 1 request against a limit of 3",
        "The first request is allowed and the remaining 2 are rejected — one gateway coordinates for all",
        "All 3 requests are allowed and the shared limit is not enforced at all",
        "The load balancer consolidates counts before forwarding to any gateway"
      ],
      "answer": 0,
      "explanation": "Each instance maintains its own independent counter. Instance 1 sees 1 request (count=1 ≤ 3, allowed). Instance 2 sees 1 request (count=1 ≤ 3, allowed). Instance 3 same. None of them reaches the limit of 3. This is the core failure mode of local-state rate limiting — the effective limit becomes capacity × number_of_instances. The fix is shared state in Redis."
    },
    {
      "question": "The Sliding Window Counter blends the previous and current fixed windows by an 'overlap fraction'. If the previous window had 60 requests, the current window has 15 requests, and you are 70% of the way through the current window, what is the estimated count?",
      "options": [
        "75 — sum of both windows",
        "60 — previous window dominates",
        "33 — 60 × 0.30 + 15 = 18 + 15",
        "15 — only the current window counts"
      ],
      "answer": 2,
      "explanation": "The overlap fraction is the proportion of the previous window that still falls within the sliding window. At 70% into the current window, only 30% of the previous window is still recent enough to count. Estimated count = 60 × 0.30 + 15 = 18 + 15 = 33. This blending gives O(1) memory with no boundary spike — a client can never double the rate by timing requests around a window boundary."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Token bucket is the general-purpose default: it tolerates bursts up to \`capacity\` and enforces a long-term \`rate\`. Start here for most APIs.",
    "Leaky bucket enforces a constant output drain rate with zero burst tolerance — use it to protect fragile downstream services from retry storms and traffic spikes.",
    "Fixed window is simple but allows up to 2× the limit in a short span straddling a reset boundary. Never use it for public-facing endpoints.",
    "Sliding window log is the most accurate algorithm but uses O(n) memory per identity. Sliding window counter gives the same accuracy with O(1) memory by blending two adjacent windows.",
    "In distributed systems, local in-memory counters multiply your effective limit by the number of instances. All gateways must share a single Redis counter, written with an atomic Lua script to prevent race conditions.",
    "Always return HTTP 429 with a \`Retry-After\` header — this lets well-behaved clients back off gracefully and dramatically reduces thundering-herd retry amplification."
  ]
}
\`\`\``,
      starterCode: `import time

class TokenBucket:
    """
    Token Bucket rate limiter.
    Tokens are added at a fixed rate up to a maximum capacity.
    Each request consumes one token. If no tokens are available, the request is rejected.
    """

    def __init__(self, capacity: int, refill_rate: float):
        """
        Args:
            capacity: Maximum number of tokens the bucket can hold.
            refill_rate: Tokens added per second.
        """
        # TODO: Store capacity and refill_rate as instance variables

        # TODO: Initialize current tokens to full capacity

        # TODO: Record the current time as last_refill_time (use time.time())
        pass

    def _refill(self):
        """Add tokens based on elapsed time since last refill."""
        now = time.time()

        # TODO: Calculate elapsed seconds since last_refill_time

        # TODO: Calculate tokens_to_add = elapsed * refill_rate

        # TODO: Add tokens_to_add to self.tokens, but cap at self.capacity
        #       Hint: use min()

        # TODO: Update last_refill_time to now
        pass

    def allow_request(self) -> bool:
        """Return True if request is allowed (token consumed), False if rejected."""
        # TODO: Call _refill() to top up tokens based on elapsed time

        # TODO: If self.tokens >= 1, consume one token and return True

        # TODO: Otherwise return False
        pass


# --- Tests ---
def run_tests():
    print("Test 1: Burst up to capacity")
    bucket = TokenBucket(capacity=5, refill_rate=1)
    results = [bucket.allow_request() for _ in range(7)]
    print(f"  Requests: {results}")
    # First 5 should be True, last 2 False
    assert results[:5] == [True] * 5, "Expected first 5 to succeed"
    assert results[5:] == [False, False], "Expected requests 6-7 to fail"
    print("  PASSED")

    print("Test 2: Refill over time")
    bucket = TokenBucket(capacity=3, refill_rate=2)  # 2 tokens/sec
    bucket.allow_request()  # consume 1 token (2 left)
    bucket.allow_request()  # consume 1 token (1 left)
    bucket.allow_request()  # consume 1 token (0 left)
    assert not bucket.allow_request(), "Bucket should be empty"
    time.sleep(1)  # wait 1 second → ~2 tokens refilled
    assert bucket.allow_request(), "Should have token after refill"
    assert bucket.allow_request(), "Should have second token after refill"
    print("  PASSED")

    print("\\nAll tests passed!")

run_tests()
`,
      solutionCode: `import time

class TokenBucket:
    """
    Token Bucket rate limiter.
    Tokens are added at a fixed rate up to a maximum capacity.
    Each request consumes one token. If no tokens are available, the request is rejected.

    Characteristics:
    - Allows bursting up to \`capacity\` requests immediately.
    - Smooths traffic over time via the refill rate.
    - Simple O(1) per request — no rolling window storage needed.
    """

    def __init__(self, capacity: int, refill_rate: float):
        """
        Args:
            capacity: Maximum number of tokens the bucket can hold.
            refill_rate: Tokens added per second.
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)       # Start full
        self.last_refill_time = time.time()

    def _refill(self):
        """Add tokens based on elapsed time since last refill."""
        now = time.time()
        elapsed = now - self.last_refill_time
        tokens_to_add = elapsed * self.refill_rate
        # Cap at capacity so we never exceed the bucket size
        self.tokens = min(self.capacity, self.tokens + tokens_to_add)
        self.last_refill_time = now

    def allow_request(self) -> bool:
        """Return True if request is allowed (token consumed), False if rejected."""
        self._refill()                  # Top up first
        if self.tokens >= 1:
            self.tokens -= 1            # Consume one token
            return True
        return False                    # Bucket empty — reject


# --- Tests ---
def run_tests():
    print("Test 1: Burst up to capacity")
    bucket = TokenBucket(capacity=5, refill_rate=1)
    results = [bucket.allow_request() for _ in range(7)]
    print(f"  Requests: {results}")
    assert results[:5] == [True] * 5, "Expected first 5 to succeed"
    assert results[5:] == [False, False], "Expected requests 6-7 to fail"
    print("  PASSED")

    print("Test 2: Refill over time")
    bucket = TokenBucket(capacity=3, refill_rate=2)  # 2 tokens/sec
    bucket.allow_request()  # consume 1 token (2 left)
    bucket.allow_request()  # consume 1 token (1 left)
    bucket.allow_request()  # consume 1 token (0 left)
    assert not bucket.allow_request(), "Bucket should be empty"
    time.sleep(1)  # wait 1 second → ~2 tokens refilled
    assert bucket.allow_request(), "Should have token after refill"
    assert bucket.allow_request(), "Should have second token after refill"
    print("  PASSED")

    print("\\nAll tests passed!")

run_tests()
`,
    },
    {
      id: "circuit-breakers-and-bulkheads",
      slug: "circuit-breakers-and-bulkheads",
      title: "Circuit Breakers, Bulkheads, and Timeouts",
      content: `# Circuit Breakers, Bulkheads, and Timeouts

Distributed systems fail. Not if — when. The question is whether a single failing service takes down your entire platform or whether the failure stays small and contained. Three patterns define the difference: **timeouts**, **circuit breakers**, and **bulkheads**. Together they implement the core reliability principle: *protect the core, degrade the edges.*

<!-- voice: This lesson covers three essential resilience patterns used by Netflix, Amazon, and every major cloud platform. We'll look at each pattern's mechanics, the state machines behind them, and how they compose into a layered defense. -->

---

## Why Cascading Failures Happen

Imagine a checkout service that calls an inventory service. The inventory service gets slow — not down, just slow. Without any protection, every checkout thread blocks waiting for a response. Thread pools fill up. New requests queue. Eventually the checkout service itself becomes unresponsive. A slow inventory service just took down checkout.

\`\`\`concept
{ "title": "The Cascade Problem", "variant": "mental-model", "content": "In a synchronous call chain A → B → C, if C becomes slow, B's threads block waiting for C. B's thread pool exhausts. A's threads then block waiting for B. The slowness propagates upstream — a partial failure becomes a total failure. Cascading failures are caused by unbounded waiting, not by the original fault itself." }
\`\`\`

The three patterns in this lesson attack the same root cause — **unbounded waiting** — at three different levels of granularity.

---

## Pattern 1: Timeouts

Timeouts are the simplest and most fundamental protection. Every outbound call must have a timeout. Without one, threads hang indefinitely.

\`\`\`concept
{ "title": "Timeout Hierarchy Rule", "variant": "rule", "content": "Set a timeout on every network call. The timeout on the caller must be shorter than the timeout on the callee — otherwise the caller gives up before the callee does, and the callee wastes resources finishing work nobody wants. Tight timeouts at the edge, looser timeouts deeper in the stack." }
\`\`\`

But timeouts alone aren't enough. If a service is timing out 30% of requests, you're still burning thread time on those timed-out calls. That's where circuit breakers come in.

\`\`\`callout
{ "type": "warning", "title": "Timeout ≠ Retry", "content": "A timeout that immediately retries on the same failing host is worse than no retry at all. Under failure, retries multiply load on the struggling service. Always pair retries with: bounded retry count, exponential backoff, jitter (to spread retries), and a retry budget (cap the fraction of requests that are retries)." }
\`\`\`

---

## Pattern 2: Circuit Breakers

A circuit breaker wraps an outbound call and monitors its success rate. When failures exceed a threshold, the breaker **opens** — subsequent calls fail immediately without touching the downstream service. After a cooldown period, the breaker moves to **half-open** to probe whether the service recovered.

\`\`\`concept
{ "title": "Circuit Breaker State Machine", "variant": "mental-model", "content": "CLOSED (normal): calls pass through, failures are counted. When failure rate > threshold → trip to OPEN. OPEN (protecting): calls fail immediately with a fallback. After reset timeout → move to HALF-OPEN. HALF-OPEN (probing): one trial request is sent. If it succeeds → back to CLOSED. If it fails → back to OPEN." }
\`\`\`

### The State Machine Visualized

\`\`\`mermaid
stateDiagram-v2
    [*] --> CLOSED
    CLOSED --> OPEN : failure_rate > threshold\\n(e.g. 50% over last 10 calls)
    OPEN --> HALF_OPEN : reset_timeout expires\\n(e.g. 30 seconds)
    HALF_OPEN --> CLOSED : probe request succeeds
    HALF_OPEN --> OPEN : probe request fails

    CLOSED : CLOSED\\nAll calls pass through
    OPEN : OPEN\\nFail fast — no calls sent
    HALF_OPEN : HALF-OPEN\\nOne probe call allowed
\`\`\`

### Hystrix/Resilience4j Configuration

Real circuit breakers (Hystrix, Resilience4j, Polly) expose these key parameters:

| Parameter | Typical Default | What It Controls |
|---|---|---|
| \`failureRateThreshold\` | 50% | % failures before tripping |
| \`minimumNumberOfCalls\` | 10 | Min calls before evaluating rate |
| \`waitDurationInOpenState\` | 60s | How long to stay OPEN |
| \`permittedCallsInHalfOpenState\` | 1 | Probe calls in HALF-OPEN |
| \`slidingWindowSize\` | 10 (count) or 60s (time) | Window for measuring failures |

\`\`\`tabs
{ "tabs": [ { "label": "Resilience4j (Java)", "icon": "☕", "content": "\`\`\`java\\nCircuitBreakerConfig config = CircuitBreakerConfig.custom()\\n    .failureRateThreshold(50)           // Open at 50% failure rate\\n    .minimumNumberOfCalls(10)           // Need 10 calls to evaluate\\n    .waitDurationInOpenState(Duration.ofSeconds(30))\\n    .slidingWindowType(COUNT_BASED)\\n    .slidingWindowSize(10)\\n    .permittedNumberOfCallsInHalfOpenState(1)\\n    .build();\\n\\nCircuitBreaker breaker = CircuitBreakerRegistry\\n    .of(config)\\n    .circuitBreaker(\\"inventoryService\\");\\n\\n// Wrap your call\\nSupplier<Inventory> decorated = CircuitBreaker\\n    .decorateSupplier(breaker, () -> inventoryClient.getStock(itemId));\\n\\n// Execute with fallback\\nTry<Inventory> result = Try.ofSupplier(decorated)\\n    .recover(CallNotPermittedException.class, ex -> Inventory.empty());\\n\`\`\`" }, { "label": "Polly (C#)", "icon": "🔷", "content": "\`\`\`csharp\\nvar policy = Policy\\n    .Handle<HttpRequestException>()\\n    .Or<TimeoutException>()\\n    .CircuitBreakerAsync(\\n        exceptionsAllowedBeforeBreaking: 5,\\n        durationOfBreak: TimeSpan.FromSeconds(30),\\n        onBreak: (ex, ts) => logger.LogWarning(\\"Circuit opened: {0}\\", ex.Message),\\n        onReset: () => logger.LogInfo(\\"Circuit closed\\")\\n    );\\n\\n// Use with fallback policy\\nvar fallback = Policy<Inventory>\\n    .Handle<BrokenCircuitException>()\\n    .FallbackAsync(_ => Task.FromResult(Inventory.Empty));\\n\\nvar combined = Policy.WrapAsync(fallback, policy);\\nawait combined.ExecuteAsync(() => inventoryClient.GetStockAsync(itemId));\\n\`\`\`" }, { "label": "Python (pybreaker)", "icon": "🐍", "content": "\`\`\`python\\nimport pybreaker\\nimport requests\\n\\n# Define what counts as a failure\\nclass HttpErrorListener(pybreaker.CircuitBreakerListener):\\n    def failure(self, cb, exc):\\n        print(f\\"Circuit {cb.name} failure: {exc}\\")\\n    def state_change(self, cb, old, new):\\n        print(f\\"Circuit {cb.name}: {old.name} -> {new.name}\\")\\n\\nbreaker = pybreaker.CircuitBreaker(\\n    fail_max=5,              # Open after 5 consecutive failures\\n    reset_timeout=30,        # Stay open for 30 seconds\\n    listeners=[HttpErrorListener()]\\n)\\n\\n@breaker  # Decorate the vulnerable function\\ndef get_inventory(item_id):\\n    response = requests.get(\\n        f\\"http://inventory-service/items/{item_id}\\",\\n        timeout=2.0\\n    )\\n    response.raise_for_status()\\n    return response.json()\\n\\n# Catch the open-circuit exception for fallback\\ntry:\\n    stock = get_inventory(\\"item-123\\")\\nexcept pybreaker.CircuitBreakerError:\\n    stock = {\\"available\\": 0, \\"cached\\": True}\\n\`\`\`" } ] }
\`\`\`

---

## Tracing a Circuit Breaker in Action

Let's trace what happens when an inventory service degrades. Watch the failure count, state transitions, and fallback behavior:

\`\`\`trace
{ "title": "Circuit Breaker: Tracking State Through Failures", "language": "python", "code": "breaker = CircuitBreaker(fail_max=3, reset_timeout=30)\\nfailures = 0\\nstate = 'CLOSED'\\n\\n# Request 1: succeeds\\nresult = call_inventory()  # returns data\\n\\n# Request 2: timeout\\nresult = call_inventory()  # raises TimeoutError\\nfailures += 1  # failures = 1\\n\\n# Request 3: timeout again\\nresult = call_inventory()  # raises TimeoutError\\nfailures += 1  # failures = 2\\n\\n# Request 4: timeout — threshold hit!\\nresult = call_inventory()  # raises TimeoutError\\nfailures += 1  # failures = 3 >= fail_max\\nstate = 'OPEN'   # BREAKER TRIPS!\\n\\n# Request 5: breaker is OPEN — fail immediately\\ntry:\\n    result = call_inventory()  # raises CircuitBreakerError\\nexcept CircuitBreakerError:\\n    result = fallback_empty()  # no network call made!\\n\\n# ... 30 seconds pass ...\\nstate = 'HALF_OPEN'  # probe window opens\\n\\n# Request 6: ONE probe call sent\\nresult = call_inventory()  # succeeds!\\nfailures = 0\\nstate = 'CLOSED'  # circuit resets", "frames": [ { "line": 1, "vars": { "state": "CLOSED", "failures": 0 }, "note": "Breaker initialized in CLOSED state. fail_max=3 means we open after 3 consecutive failures.", "stdout": "" }, { "line": 4, "vars": { "state": "CLOSED", "failures": 0 }, "note": "Request 1 succeeds. No state change. Failure counter stays at 0.", "stdout": "✓ inventory returned: {available: 12}" }, { "line": 7, "vars": { "state": "CLOSED", "failures": 1 }, "note": "Request 2 times out. Failure counter increments. Still CLOSED — threshold not reached.", "stdout": "✗ TimeoutError after 2.0s" }, { "line": 11, "vars": { "state": "CLOSED", "failures": 2 }, "note": "Request 3 also times out. failures=2, one away from threshold. Every timed-out call burns a thread for 2 seconds.", "stdout": "✗ TimeoutError after 2.0s" }, { "line": 15, "vars": { "state": "OPEN", "failures": 3 }, "note": "failures=3 hits fail_max=3. Breaker TRIPS to OPEN. No more calls to inventory until reset_timeout expires.", "stdout": "✗ TimeoutError — CIRCUIT OPENED" }, { "line": 19, "vars": { "state": "OPEN", "failures": 3 }, "note": "Request 5 is rejected IMMEDIATELY — no network call. CircuitBreakerError thrown in microseconds. Thread is free instantly.", "stdout": "⚡ CircuitBreakerError: call rejected (circuit OPEN)" }, { "line": 21, "vars": { "state": "OPEN", "failures": 3 }, "note": "Fallback returns a safe empty value. Upstream caller gets a response. System stays functional.", "stdout": "↩ fallback: {available: 0, cached: true}" }, { "line": 25, "vars": { "state": "HALF_OPEN", "failures": 3 }, "note": "30 seconds elapse. Breaker transitions to HALF_OPEN. ONE probe call will be permitted.", "stdout": "⏱ 30s elapsed → HALF_OPEN" }, { "line": 28, "vars": { "state": "CLOSED", "failures": 0 }, "note": "Probe succeeds — inventory service recovered. Breaker resets to CLOSED, failures cleared.", "stdout": "✓ probe succeeded → CLOSED" } ], "speed": 900 }
\`\`\`

---

## Pattern 3: Bulkheads

A bulkhead is a partition on a ship that prevents water in one compartment from flooding the entire hull. In software, it's **resource isolation** — giving each downstream dependency its own bounded thread pool (or connection pool, or semaphore).

\`\`\`concept
{ "title": "Bulkhead Isolation", "variant": "analogy", "content": "Without bulkheads: your service has one thread pool of 200 threads shared across all downstream calls. If the payment service gets slow, it can claim all 200 threads, starving calls to inventory, user profile, and search. With bulkheads: payment gets 20 threads, inventory gets 30, user profile gets 20, search gets 30. A slow payment service can only harm payment calls — it cannot starve the others." }
\`\`\`

### Thread Isolation vs Semaphore Isolation

Resilience4j and Hystrix support two bulkhead strategies:

\`\`\`tabs
{ "tabs": [ { "label": "Thread Isolation", "icon": "🧵", "content": "Each dependency gets its own thread pool. Calls execute on a separate thread from a bounded pool.\\n\\n**Pros:**\\n- Total isolation — a hung call doesn't even block the calling thread\\n- Supports async/timeout natively\\n- Easy to observe per-pool queue depth\\n\\n**Cons:**\\n- Thread context switching overhead\\n- Higher memory (each pool = thread stack memory)\\n- Thread-local context (auth, trace IDs) must be explicitly propagated\\n\\n**When to use:** I/O-heavy calls to external services, especially when latency varies widely." }, { "label": "Semaphore Isolation", "icon": "🚦", "content": "A semaphore limits concurrent calls. Calls execute on the calling thread but are rejected if the semaphore count is exhausted.\\n\\n**Pros:**\\n- Near-zero overhead\\n- No thread propagation issues (same thread, same context)\\n- Works well in reactive/async frameworks\\n\\n**Cons:**\\n- A hung call DOES block the calling thread\\n- Timeout enforcement is harder\\n- Less observability than thread pool queues\\n\\n**When to use:** In-process calls, CPU-bound work, reactive stacks (Project Reactor, RxJava) where thread switching is expensive." }, { "label": "Resilience4j Config", "icon": "⚙️", "content": "\`\`\`java\\n// Thread-pool bulkhead\\nThreadPoolBulkheadConfig poolConfig = ThreadPoolBulkheadConfig.custom()\\n    .maxThreadPoolSize(10)         // Max concurrent calls\\n    .coreThreadPoolSize(5)         // Idle thread count\\n    .queueCapacity(20)             // Wait queue before rejection\\n    .keepAliveDuration(Duration.ofMillis(20))\\n    .build();\\n\\nThreadPoolBulkhead paymentBulkhead = ThreadPoolBulkheadRegistry\\n    .of(poolConfig)\\n    .bulkhead(\\"paymentService\\");\\n\\n// Semaphore bulkhead\\nBulkheadConfig semConfig = BulkheadConfig.custom()\\n    .maxConcurrentCalls(15)           // Max concurrent calls\\n    .maxWaitDuration(Duration.ofMillis(100))  // Wait before reject\\n    .build();\\n\\nBulkhead inventoryBulkhead = BulkheadRegistry\\n    .of(semConfig)\\n    .bulkhead(\\"inventoryService\\");\\n\`\`\`" } ] }
\`\`\`

---

## How the Three Patterns Layer

These patterns compose. In production, you apply them in order — innermost to outermost:

\`\`\`sysdiag
{ "title": "Layered Resilience: Checkout Service → Inventory Service", "width": 700, "height": 400, "nodes": [ { "id": "client", "label": "Client\\nRequest", "x": 60, "y": 200, "kind": "client" }, { "id": "checkout", "label": "Checkout\\nService", "x": 210, "y": 200, "kind": "service" }, { "id": "timeout", "label": "Timeout\\n2s", "x": 360, "y": 130, "kind": "cache" }, { "id": "breaker", "label": "Circuit\\nBreaker", "x": 360, "y": 200, "kind": "service" }, { "id": "bulkhead", "label": "Bulkhead\\n(pool: 20)", "x": 360, "y": 270, "kind": "cache" }, { "id": "inventory", "label": "Inventory\\nService", "x": 530, "y": 200, "kind": "service" }, { "id": "fallback", "label": "Fallback\\n(cached stock)", "x": 530, "y": 330, "kind": "cache" } ], "edges": [ { "from": "client", "to": "checkout", "label": "checkout" }, { "from": "checkout", "to": "timeout", "label": "wraps" }, { "from": "checkout", "to": "breaker", "label": "wraps" }, { "from": "checkout", "to": "bulkhead", "label": "wraps" }, { "from": "bulkhead", "to": "inventory", "label": "calls" }, { "from": "breaker", "to": "fallback", "label": "on OPEN" } ], "annotations": { "timeout": "Layer 1: Hard ceiling on how long any call can block. Set to 2s — the most aggressive guard. Fires first.", "breaker": "Layer 2: Monitors cumulative failure rate. Trips OPEN when failures exceed threshold, preventing calls entirely.", "bulkhead": "Layer 3: Limits concurrent calls. If 20 threads are busy in the inventory pool, new calls are rejected immediately rather than queuing forever.", "fallback": "When breaker is OPEN or call fails: return last-known stock from Redis. Checkout continues; accuracy degrades gracefully." } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Ordering Matters", "content": "Apply the layers from innermost to outermost: **bulkhead** (resource limit) → **circuit breaker** (failure rate) → **timeout** (wall clock). The timeout is the last line — if nothing else stopped the call, the timeout will. In practice, configure all three together; each catches what the others miss." }
\`\`\`

---

## Playground: Simulate a Circuit Breaker

Run this simulation to see how the circuit breaker state changes across 20 requests with a degraded service:

\`\`\`playground
{ "title": "Circuit Breaker State Machine Simulation", "language": "python", "runnable": true, "code": "import random\\nimport time\\n\\nclass CircuitBreaker:\\n    def __init__(self, fail_max=3, reset_timeout=5, success_threshold=2):\\n        self.fail_max = fail_max\\n        self.reset_timeout = reset_timeout\\n        self.success_threshold = success_threshold\\n        self.failures = 0\\n        self.successes = 0\\n        self.state = 'CLOSED'\\n        self.opened_at = None\\n\\n    def call(self, fn):\\n        now = time.time()\\n\\n        if self.state == 'OPEN':\\n            if now - self.opened_at >= self.reset_timeout:\\n                self.state = 'HALF_OPEN'\\n                self.successes = 0\\n                print(f\\"  → State: HALF_OPEN (probing...)\\")\\n            else:\\n                remaining = self.reset_timeout - (now - self.opened_at)\\n                raise Exception(f\\"CircuitOpen: try again in {remaining:.1f}s\\")\\n\\n        try:\\n            result = fn()\\n            self.on_success()\\n            return result\\n        except Exception as e:\\n            self.on_failure(str(e))\\n            raise\\n\\n    def on_success(self):\\n        self.failures = 0\\n        if self.state == 'HALF_OPEN':\\n            self.successes += 1\\n            if self.successes >= self.success_threshold:\\n                self.state = 'CLOSED'\\n                print(f\\"  → State: CLOSED (recovered!)\\")\\n        # else stay CLOSED\\n\\n    def on_failure(self, reason):\\n        self.failures += 1\\n        if self.state == 'HALF_OPEN':\\n            self.state = 'OPEN'\\n            self.opened_at = time.time()\\n            print(f\\"  → State: OPEN (probe failed, back to open)\\")\\n        elif self.failures >= self.fail_max:\\n            self.state = 'OPEN'\\n            self.opened_at = time.time()\\n            print(f\\"  → State: OPEN (failures={self.failures})\\")\\n\\ndef degraded_inventory_service():\\n    \\"\\"\\"Simulates a service that fails 70% of the time.\\"\\"\\"\\n    if random.random() < 0.7:\\n        raise Exception(\\"Timeout\\")\\n    return {\\"stock\\": random.randint(1, 100)}\\n\\n# Run the simulation\\nbreaker = CircuitBreaker(fail_max=3, reset_timeout=3, success_threshold=2)\\nprint(\\"Simulating 20 requests to degraded inventory service\\\\n\\")\\nprint(f\\"Config: fail_max=3, reset_timeout=3s, failure_rate=70%\\\\n\\")\\n\\nfor i in range(1, 21):\\n    print(f\\"Request {i:2d} [{breaker.state:9s}]: \\", end=\\"\\")\\n    try:\\n        result = breaker.call(degraded_inventory_service)\\n        print(f\\"SUCCESS → stock={result['stock']}\\")\\n    except Exception as e:\\n        if 'CircuitOpen' in str(e):\\n            print(f\\"REJECTED (fast-fail) — {e}\\")\\n        else:\\n            print(f\\"FAILED   → {e}\\")\\n    time.sleep(0.3)  # Small delay between requests\\n\\nprint(f\\"\\\\nFinal state: {breaker.state}\\")\\n" }
\`\`\`

**Try modifying:** Change \`fail_max\` to \`1\` (trips immediately), or \`reset_timeout\` to \`1\` (recovers faster), or change the failure rate to \`0.2\` (mostly healthy service).

---

## Fill in the Blanks: Circuit Breaker Logic

\`\`\`fillblank
{ "title": "Implement the State Transition Logic", "prompt": "Complete the circuit breaker's state transition method. After recording a failure, if failures exceed fail_max, the circuit should open:", "language": "python", "template": "def on_failure(self):\\n    self.failures += 1\\n    if self.failures >= self.___:\\n        self.state = '___'\\n        self.opened_at = time.___\\n\\ndef can_attempt(self):\\n    if self.state == 'OPEN':\\n        elapsed = time.time() - self.opened_at\\n        if elapsed >= self.reset_timeout:\\n            self.state = '___'\\n            return True\\n        return ___\\n    return True", "blanks": [ { "answer": "fail_max", "hint": "The threshold attribute set in __init__" }, { "answer": "OPEN", "hint": "The state that stops all calls from passing through" }, { "answer": "time()", "hint": "Record when the circuit opened using time.time()" }, { "answer": "HALF_OPEN", "hint": "The probing state that allows one test call through" }, { "answer": "False", "hint": "We can't attempt the call — circuit is still open" } ] }
\`\`\`

---

## Incident Walkthrough: Database Slowdown

Apply all three patterns to a real incident scenario:

\`\`\`steps
{ "title": "Handling a Database Slowdown Incident", "steps": [ { "title": "Step 1 — Timeouts fire first", "content": "The database becomes slow at 09:15. Queries that normally take 50ms are now taking 8+ seconds.\\n\\nAll service calls have a **2-second timeout**. After 2s, the thread is released and the error is recorded. Without this timeout, threads would pile up waiting indefinitely — each thread holding memory and a DB connection.\\n\\n**Effect:** 100% of DB calls fail fast after 2s. Services remain responsive. Thread pools don't fill up." }, { "title": "Step 2 — Circuit breakers open", "content": "Within the first 10 failed calls, the circuit breaker's failure rate threshold (50%) is exceeded.\\n\\n**Circuit trips OPEN.** Subsequent calls are rejected in microseconds with \`CircuitBreakerError\` — no DB connection is attempted, no thread blocks.\\n\\n**Effect:** The struggling DB gets zero new queries. It can recover without absorbing new load. Upstream services serve fallbacks (cached data, degraded responses)." }, { "title": "Step 3 — Bulkheads contain the blast radius", "content": "Other services also call this database via their own bulkhead pools. The user-profile service has a pool of 15 threads for DB calls. Even if all 15 are consumed before the circuit opens, that's 15 threads — not the entire application thread pool of 300.\\n\\n**Effect:** The checkout service, which doesn't use this DB, is completely unaffected. The auth service, which does, is degraded but still alive." }, { "title": "Step 4 — Serve stale reads from cache", "content": "The fallback for read-heavy paths (product catalog, inventory levels) returns data from Redis with a max staleness of 5 minutes.\\n\\n\`\`\`python\\ndef get_product(product_id):\\n    try:\\n        return circuit_breaker.call(lambda: db.query(product_id))\\n    except (CircuitBreakerError, TimeoutError):\\n        cached = redis.get(f'product:{product_id}')\\n        if cached:\\n            return {**json.loads(cached), 'stale': True}\\n        return None  # Hard failure — no cache, no DB\\n\`\`\`\\n\\n**Effect:** ~90% of requests return valid (slightly stale) data. Only cache misses result in errors." }, { "title": "Step 5 — DB recovers, circuit probes", "content": "At 09:47, the DB recovers (index rebuilt, connection pool cleared).\\n\\nThe circuit breaker's \`reset_timeout\` expires → moves to **HALF_OPEN**. One probe call is sent. It succeeds. After \`success_threshold\` successful probes → circuit closes.\\n\\nTraffic resumes normally. The incident was contained from 09:15–09:47 with degraded but functional service throughout." } ] }
\`\`\`

---

## Timeout Hierarchy: Getting the Numbers Right

One of the most common mistakes is setting timeouts in the wrong direction — a caller with a longer timeout than its callee. Here's a worked example:

\`\`\`concept
{ "title": "Nested Timeout Rule", "variant": "rule", "content": "For a call chain A → B → C: A's timeout must be greater than B's, and B's timeout must be greater than C's. If A waits 3s but B only waits 1s for C, then B returns an error to A well within A's budget — that's correct. If A only waits 500ms but B waits 2s for C, A will give up and free its thread, but B continues burning a thread for up to 2s on work nobody wants. B's orphaned call wastes resources." }
\`\`\`

| Service | Timeout Budget | Notes |
|---|---|---|
| API Gateway → Checkout | 5 000 ms | User-facing SLO |
| Checkout → Inventory | 1 500 ms | Leaves headroom for retry |
| Checkout → Payment | 3 000 ms | Payment is slower, critical path |
| Inventory → DB | 500 ms | DB should be fast; fail fast if not |
| Payment → Stripe | 2 000 ms | External API, less control |

\`\`\`callout
{ "type": "info", "title": "Retry Budget Pattern", "content": "Set a global retry budget: e.g., at most 10% of requests in flight may be retries. This prevents a flood of simultaneous failures from triggering massive retry storms that triple the load on an already struggling service. Measure \`retry_ratio = retry_requests / total_requests\`. If it exceeds the budget, stop retrying and fail fast." }
\`\`\`

---

## Quiz

\`\`\`quiz
{ "title": "Circuit Breakers, Bulkheads & Timeouts", "questions": [ { "question": "A circuit breaker is in the CLOSED state. After 12 consecutive failures against a fail_max of 10, what state does it transition to, and what happens to the 13th call?", "options": [ "Stays CLOSED — the circuit breaker waits for the reset_timeout before doing anything", "Transitions to OPEN — the 13th call is rejected immediately without touching the downstream service", "Transitions to HALF_OPEN — the 13th call is sent as a probe", "Transitions to OPEN — the 13th call is still sent but with a reduced timeout" ], "answer": 1, "explanation": "After failures exceed fail_max, the breaker trips to OPEN. In the OPEN state, calls are rejected immediately (fail-fast) — no network call is made. This is the whole point: stop hammering a struggling dependency and let it recover." }, { "question": "You have a service with one shared thread pool of 200 threads. The recommendation engine becomes slow and holds threads for 8 seconds each. With no bulkhead, what happens?", "options": [ "Only recommendation calls are affected — other calls proceed normally", "200 threads gradually fill up with waiting recommendation calls, starving all other operations", "The circuit breaker automatically isolates the recommendation calls", "Timeouts prevent thread pool exhaustion because threads are freed after the timeout" ], "answer": 1, "explanation": "Without a bulkhead, all 200 threads can be consumed by slow recommendation calls. Even with timeouts, during the 8s window before they fire, enough concurrent requests can exhaust the pool. A bulkhead gives recommendation its own pool of, say, 20 threads — even if all 20 block, the remaining 180 threads serve other operations normally." }, { "question": "Service A has a 500ms timeout. It calls Service B, which has a 2000ms timeout when calling Service C. Service C becomes slow. What is the problem with this configuration?", "options": [ "Service A's timeout is too short — it should match B's 2000ms", "Service B will continue making calls to C for up to 2000ms even after A has given up and freed its thread — wasting B's resources", "There is no problem — A failing fast is the desired behavior", "Service C's timeout needs to be set to prevent this" ], "answer": 1, "explanation": "When A gives up at 500ms, A's thread is freed. But B is still waiting for C for up to 1500ms more. B is burning a thread on work nobody wants (A already returned an error to its caller). The rule: caller timeouts should be SHORTER than callee timeouts, so callee gives up before caller does — or callee timeouts should be shorter so callee fails fast and surfaces the error to caller cleanly." }, { "question": "What is the purpose of the HALF_OPEN state in a circuit breaker?", "options": [ "To provide reduced throughput — allowing 50% of requests through while the service recovers", "To permanently mark a service as degraded in the service registry", "To send a limited probe request to test if the downstream service has recovered, without resuming full traffic", "To switch to a backup service while the primary is unreachable" ], "answer": 2, "explanation": "HALF_OPEN is the recovery probe state. The breaker waited out the reset_timeout and now needs to check if the service recovered. It allows one (or a few) test calls through. If they succeed, the breaker closes and full traffic resumes. If they fail, the breaker re-opens and the reset_timeout starts again. This prevents prematurely sending full load to a service that hasn't fully recovered." }, { "question": "Which of the following best describes the difference between thread-pool bulkheads and semaphore bulkheads?", "options": [ "Thread-pool bulkheads work only in Java; semaphore bulkheads work in all languages", "Thread-pool bulkheads execute calls on separate threads (full isolation, supports async timeouts); semaphore bulkheads limit concurrency on the same thread (lower overhead, no context propagation needed)", "Thread-pool bulkheads are for CPU-bound work; semaphore bulkheads are for I/O-bound work", "Thread-pool bulkheads have no queue; semaphore bulkheads can queue indefinitely" ], "answer": 1, "explanation": "Thread-pool isolation runs each call on a separate thread pool — completely isolating the calling thread from a hung operation, and enabling timeout enforcement. The tradeoff is thread context switching and the need to propagate thread-locals (auth tokens, trace IDs). Semaphore isolation limits concurrent calls via a counter but executes on the calling thread, meaning a hung downstream call WILL block the calling thread. Semaphores are better for reactive stacks and low-latency in-process calls." } ] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Timeouts are the first defense — every outbound call must have one. Without timeouts, slow dependencies exhaust thread pools and cause cascading failures.", "Circuit breakers implement a three-state machine (CLOSED → OPEN → HALF_OPEN). When failure rate exceeds the threshold, the breaker trips OPEN and rejects calls immediately, protecting the downstream service and freeing threads fast.", "Bulkheads isolate resource pools per dependency — a slow payment service can only consume its own 20 threads, not the entire application pool of 200. Thread-pool isolation offers full isolation; semaphore isolation offers lower overhead.", "Nested timeout rule: caller timeouts must be shorter than callee timeouts, so callees fail and surface errors cleanly rather than being orphaned after the caller gives up.", "These three patterns compose: bulkhead (bound concurrency) → circuit breaker (track failure rate) → timeout (wall-clock ceiling). Apply all three to any critical downstream dependency.", "The goal is predictable degradation, not binary up/down: serve stale cache, return empty optional results, or disable non-core features — while protecting the critical path." ] }
\`\`\``,
      starterCode: `import time
import random
from enum import Enum
from typing import Callable, Any


class CircuitState(Enum):
    CLOSED = "closed"      # Normal operation — requests flow through
    OPEN = "open"          # Failing — requests blocked immediately
    HALF_OPEN = "half_open" # Testing — one request allowed through


class CircuitBreaker:
    """
    Circuit breaker that wraps an unreliable service call.
    Tracks failures and opens the circuit when the failure threshold is exceeded.
    """

    def __init__(self, failure_threshold: int = 3, recovery_timeout: float = 5.0):
        self.failure_threshold = failure_threshold  # failures before opening
        self.recovery_timeout = recovery_timeout    # seconds before trying again
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time: float = 0.0

    def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        Execute func through the circuit breaker.
        Raises RuntimeError if the circuit is OPEN.
        """
        # TODO 1: If state is OPEN, check whether recovery_timeout has elapsed.
        #   - If yes, transition to HALF_OPEN and allow the call through.
        #   - If no, raise RuntimeError("Circuit is OPEN — request blocked").
        pass

        # TODO 2: Try calling func(*args, **kwargs).
        #   On success:
        #     - Reset failure_count to 0.
        #     - If state was HALF_OPEN, transition back to CLOSED.
        #     - Return the result.
        #   On exception:
        #     - Increment failure_count.
        #     - Record last_failure_time = time.time().
        #     - If failure_count >= failure_threshold, transition to OPEN.
        #     - Re-raise the exception.
        pass


# --- Simulate an unreliable downstream service ---

def unreliable_service(fail: bool = False) -> str:
    """Simulates a downstream service that sometimes fails."""
    if fail:
        raise ConnectionError("Service unavailable")
    return "OK"


# --- Demo ---

if __name__ == "__main__":
    cb = CircuitBreaker(failure_threshold=3, recovery_timeout=2.0)

    print("=== Phase 1: Normal calls (should succeed) ===")
    for _ in range(2):
        result = cb.call(unreliable_service, fail=False)
        print(f"  Result: {result}, State: {cb.state.value}")

    print("\\n=== Phase 2: Inject failures to trip the breaker ===")
    for i in range(4):
        try:
            cb.call(unreliable_service, fail=True)
        except Exception as e:
            print(f"  Error: {e}, failures={cb.failure_count}, State: {cb.state.value}")

    print("\\n=== Phase 3: Circuit is OPEN — next call should be blocked ===")
    try:
        cb.call(unreliable_service, fail=False)
    except RuntimeError as e:
        print(f"  Blocked: {e}")

    print("\\n=== Phase 4: Wait for recovery timeout, then retry ===")
    print("  Sleeping 2.5 seconds...")
    time.sleep(2.5)
    try:
        result = cb.call(unreliable_service, fail=False)  # HALF_OPEN probe
        print(f"  Probe succeeded: {result}, State: {cb.state.value}")
    except Exception as e:
        print(f"  Probe failed: {e}, State: {cb.state.value}")
`,
      solutionCode: `import time
from enum import Enum
from typing import Callable, Any


class CircuitState(Enum):
    CLOSED = "closed"       # Normal operation — requests flow through
    OPEN = "open"           # Failing — requests blocked immediately
    HALF_OPEN = "half_open" # Testing — one probe request allowed through


class CircuitBreaker:
    """
    Circuit breaker modeled after Hystrix/Resilience4j.

    State machine:
      CLOSED  --[failures >= threshold]--> OPEN
      OPEN    --[timeout elapsed]---------> HALF_OPEN
      HALF_OPEN --[success]---------------> CLOSED
      HALF_OPEN --[failure]---------------> OPEN
    """

    def __init__(self, failure_threshold: int = 3, recovery_timeout: float = 5.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time: float = 0.0

    def call(self, func: Callable, *args, **kwargs) -> Any:
        """
        Execute func through the circuit breaker.
        """
        # --- Guard: check if the circuit should remain OPEN ---
        if self.state == CircuitState.OPEN:
            elapsed = time.time() - self.last_failure_time
            if elapsed >= self.recovery_timeout:
                # Recovery timeout has passed — probe with one request
                self.state = CircuitState.HALF_OPEN
            else:
                # Still within the penalty window — fail fast
                raise RuntimeError("Circuit is OPEN — request blocked")

        # --- Attempt the call ---
        try:
            result = func(*args, **kwargs)

            # Success path: reset failure tracking
            self.failure_count = 0
            if self.state == CircuitState.HALF_OPEN:
                # Probe succeeded — service has recovered
                self.state = CircuitState.CLOSED
            return result

        except Exception:
            # Failure path: record and potentially trip the breaker
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.failure_threshold:
                self.state = CircuitState.OPEN

            raise  # Always re-raise so the caller sees the error


# --- Simulate an unreliable downstream service ---

def unreliable_service(fail: bool = False) -> str:
    """Simulates a downstream service that sometimes fails."""
    if fail:
        raise ConnectionError("Service unavailable")
    return "OK"


# --- Demo ---

if __name__ == "__main__":
    cb = CircuitBreaker(failure_threshold=3, recovery_timeout=2.0)

    print("=== Phase 1: Normal calls (should succeed) ===")
    for _ in range(2):
        result = cb.call(unreliable_service, fail=False)
        print(f"  Result: {result}, State: {cb.state.value}")

    print("\\n=== Phase 2: Inject failures to trip the breaker ===")
    for i in range(4):
        try:
            cb.call(unreliable_service, fail=True)
        except Exception as e:
            print(f"  Error: {e}, failures={cb.failure_count}, State: {cb.state.value}")

    print("\\n=== Phase 3: Circuit is OPEN — next call should be blocked ===")
    try:
        cb.call(unreliable_service, fail=False)
    except RuntimeError as e:
        print(f"  Blocked: {e}")

    print("\\n=== Phase 4: Wait for recovery timeout, then retry ===")
    print("  Sleeping 2.5 seconds...")
    time.sleep(2.5)
    try:
        result = cb.call(unreliable_service, fail=False)  # HALF_OPEN probe
        print(f"  Probe succeeded: {result}, State: {cb.state.value}")
    except Exception as e:
        print(f"  Probe failed: {e}, State: {cb.state.value}")
`,
    },
    {
      id: "idempotency-and-retry-strategies",
      slug: "idempotency-and-retry-strategies",
      title: "Idempotency Keys and Retry Strategies",
      content: `# Idempotency Keys and Retry Strategies

In distributed systems, **failures are not exceptions — they are the default.** Networks time out, servers crash, and clients can never be certain whether their last request succeeded or vanished into the void. Without a principled approach to retries, a single dropped connection can produce a double payment, a duplicate order, or ten copies of a welcome email.

This lesson teaches you how to design systems where retrying is always safe.

\`\`\`concept
{ "title": "Idempotency", "variant": "mental-model", "content": "An operation is idempotent if executing it N times produces the same result as executing it once. Mathematically: f(f(x)) = f(x).\\n\\nThe goal: make retries indistinguishable from the original request. The server should never care how many times it receives the same logical operation." }
\`\`\`

## The Core Problem: The Timeout Trap

Consider a payment API. A client submits \`POST /payments\`, the server processes the charge successfully, but the TCP connection drops before the response reaches the client. The client sees a timeout. Did the payment go through?

The client faces an impossible choice:
- **Don't retry** → risk a failed transaction for the user
- **Retry** → risk charging the user twice

Neither is acceptable. Without idempotency, every retry is a gamble.

\`\`\`callout
{ "type": "danger", "title": "What a Timeout Actually Means", "content": "A network timeout tells you **nothing** about what happened on the server. The request may have:\\n\\n1. **Never arrived** — safe to retry\\n2. **Arrived but failed before processing** — safe to retry\\n3. **Been fully processed** — retry creates a duplicate!\\n\\nYou cannot distinguish these cases from the client side. Idempotency keys let the server distinguish them for you." }
\`\`\`

## Delivery Guarantees: Three Levels of Safety

Before designing solutions, understand what guarantees are achievable in distributed systems:

\`\`\`tabs
{ "tabs": [ { "label": "At-Most-Once", "icon": "1️⃣", "content": "**At-most-once delivery** means the operation executes zero or one time — never more.\\n\\n- **How:** Fire-and-forget. No retries.\\n- **Risk:** Messages can be lost on network failure.\\n- **Use when:** Losing the event is acceptable.\\n\\n**Examples:** Analytics pings, non-critical log events, metrics telemetry.\\n\\n\`\`\`python\\n# Fire and forget — if it fails, we move on\\nrequests.post('/analytics/event', json=payload, timeout=1)\\n\`\`\`\\n\\n**Trade-off:** Maximum simplicity at the cost of reliability. Never appropriate for financial transactions or any state-changing operation the user cares about." }, { "label": "At-Least-Once", "icon": "🔁", "content": "**At-least-once delivery** means the operation executes one or more times — never zero.\\n\\n- **How:** Retry until acknowledgement received.\\n- **Risk:** Duplicate processing when the server processed but the ack was lost.\\n- **Use when:** Missing messages is unacceptable; duplicates can be tolerated or deduplicated downstream.\\n\\n**Examples:** Email sends (with dedup), webhook delivery, message queue consumers.\\n\\n\`\`\`python\\nfor attempt in range(max_retries):\\n    resp = requests.post('/notify', json=payload)\\n    if resp.status_code == 200:\\n        break\\n    time.sleep(backoff(attempt))\\n\`\`\`\\n\\n**Trade-off:** High reliability, but the consumer must be designed to handle duplicates. Most message queues (Kafka, SQS) provide at-least-once by default." }, { "label": "Exactly-Once", "icon": "✅", "content": "**Exactly-once delivery** means the operation executes precisely once, regardless of retries or failures.\\n\\n- **How:** Client-side idempotency key + server-side deduplication store.\\n- **Cost:** Requires persistent storage, atomic operations, and careful failure handling.\\n- **Use when:** The operation has irreversible side effects (payments, order creation, database mutations).\\n\\n\`\`\`\\nFirst request:\\n  Client → POST /charge + Idempotency-Key: uuid-abc\\n  Server → key not seen → execute → store result\\n  Server → 200 OK\\n\\nRetry (response lost):\\n  Client → POST /charge + Idempotency-Key: uuid-abc\\n  Server → key seen before → return cached result\\n  Server → 200 OK (same response, no duplicate charge)\\n\`\`\`\\n\\n**Trade-off:** The gold standard for payment and order APIs. Achievable at the application layer; much harder in distributed queues without transactions." } ] }
\`\`\`

## Idempotency Keys: Design

An idempotency key is a client-generated unique identifier that scopes a request to a single logical operation. The server uses it to detect and replay repeat requests.

\`\`\`callout
{ "type": "tip", "title": "Key Design Rules (From Production Systems)", "content": "**Do:** Use UUIDs v4 as the default — random, collision-resistant, universally understood.\\n\\n**Do:** For traceability, encode \`clientId + timestamp + randomSuffix\` — you get uniqueness *and* debuggability.\\n\\n**Don't:** Use business identifiers (order IDs, user IDs) as idempotency keys — they are mutable, may not exist at request time, and conflate *identity* with *intent*.\\n\\n**Don't:** Reuse the same key across logically different operations — a retry for payment A must not accidentally match a new payment B." }
\`\`\`

### Server-Side Flow: Step by Step

The critical insight: the server must mark the key as **in-flight before processing**, not after. This prevents a second concurrent duplicate from also executing.

\`\`\`trace
{ "title": "Server-Side Idempotency Handling", "language": "python", "code": "def handle_payment(key, payload):\\n    existing = dedup_store.get(key)\\n    if existing is not None:\\n        return existing['response']\\n    dedup_store.set(key, {'status': 'processing'}, ttl=300)\\n    result = payment_processor.charge(payload['amount'], payload['card'])\\n    response = {'status': 'ok', 'charge_id': result.id}\\n    dedup_store.set(key, {'status': 'done', 'response': response}, ttl=86400)\\n    return response", "frames": [ { "line": 2, "vars": { "key": "\\"uuid-abc-123\\"", "existing": "None" }, "note": "Check the dedup store. This is the first request — key not found.", "stdout": "" }, { "line": 3, "vars": { "existing": "None" }, "note": "existing is None, so we don't return early. Fall through to execute.", "stdout": "" }, { "line": 5, "vars": { "key": "\\"uuid-abc-123\\"", "ttl": "300" }, "note": "Mark key as 'processing' BEFORE executing. A concurrent duplicate will now find this entry and wait rather than execute.", "stdout": "Store: uuid-abc-123 → processing" }, { "line": 6, "vars": { "payload.amount": "100", "payload.card": "\\"tok_visa\\"" }, "note": "Execute the actual side-effect — this is where the card is charged.", "stdout": "Charging $100 to tok_visa..." }, { "line": 7, "vars": { "result.id": "\\"ch_1abc\\"", "response": "{status: ok, charge_id: ch_1abc}" }, "note": "Build the response object. This is what we'll return to ALL future retries.", "stdout": "Charge successful: ch_1abc" }, { "line": 8, "vars": { "ttl": "86400" }, "note": "Persist the final response with a 24-hour TTL. Any retry within 24h gets this exact cached result.", "stdout": "Store: uuid-abc-123 → done (cached 24h)" }, { "line": 9, "vars": {}, "note": "Return response. On any future retry, line 3 short-circuits here — this block never runs again.", "stdout": "Response: {status: ok, charge_id: ch_1abc}" } ], "speed": 950 }
\`\`\`

## Exponential Backoff with Jitter

When a retry is needed, *when* you retry matters as much as *whether* you retry. Naive fixed-interval retries cause **thundering herd**: all clients fail simultaneously, wait the same interval, then hammer the already-stressed server together.

The solution: **exponential backoff with full jitter**.

\`\`\`concept
{ "title": "Exponential Backoff with Full Jitter", "variant": "rule", "content": "delay = random(0, min(cap, base × 2^attempt))\\n\\n• Exponential: each retry ceiling doubles (1s, 2s, 4s, 8s...)\\n• Cap: never wait longer than max_delay (e.g. 60s)\\n• Full jitter: pick randomly in [0, cap] — spreads retrying clients across time\\n\\nAWS recommends full jitter for most use cases. It sacrifices minimum latency for maximum load distribution." }
\`\`\`

\`\`\`playground
{ "title": "Exponential Backoff Strategies", "language": "python", "code": "import random\\n\\ndef full_jitter(attempt, base=1.0, cap=60.0):\\n    \\"\\"\\"AWS recommended. Spreads load best.\\"\\"\\"\\n    ceiling = min(cap, base * (2 ** attempt))\\n    return random.uniform(0, ceiling)\\n\\ndef equal_jitter(attempt, base=1.0, cap=60.0):\\n    \\"\\"\\"Guarantees minimum wait. Good for jobs.\\"\\"\\"\\n    ceiling = min(cap, base * (2 ** attempt))\\n    return ceiling / 2 + random.uniform(0, ceiling / 2)\\n\\ndef no_jitter(attempt, base=1.0, cap=60.0):\\n    \\"\\"\\"Deterministic. Thundering herd risk.\\"\\"\\"\\n    return min(cap, base * (2 ** attempt))\\n\\nprint('Attempt | Full Jitter | Equal Jitter | No Jitter')\\nprint('-' * 50)\\nfor i in range(6):\\n    fj = full_jitter(i)\\n    ej = equal_jitter(i)\\n    nj = no_jitter(i)\\n    print(f'  {i+1}     |  {fj:6.2f}s   |   {ej:6.2f}s   |  {nj:5.1f}s')\\n", "runnable": true }
\`\`\`

### Retry Policy: Bad vs. Good

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Naive Retry (Dangerous)", "code": "# Retries EVERYTHING including 400s (client bugs)\\n# Fixed delay — all clients retry together\\n# No max attempts — infinite loop possible\\n# No idempotency key — duplicates on success+drop\\n\\ndef call_api(payload):\\n    while True:\\n        try:\\n            return requests.post('/charge', json=payload)\\n        except Exception:\\n            time.sleep(1)  # Fixed 1s — thundering herd!" }, "after": { "label": "Production Retry (Safe)", "code": "import uuid\\n\\nRETRYABLE = {429, 500, 502, 503, 504}\\n\\ndef call_api_safe(payload, max_attempts=5):\\n    # Generate once, reuse on every retry\\n    idem_key = str(uuid.uuid4())\\n\\n    for attempt in range(max_attempts):\\n        resp = requests.post(\\n            '/charge',\\n            json=payload,\\n            headers={'Idempotency-Key': idem_key}\\n        )\\n        if resp.status_code < 400:\\n            return resp\\n        if resp.status_code not in RETRYABLE:\\n            raise NonRetryableError(resp)  # 400/401/403: don't retry!\\n        if attempt < max_attempts - 1:\\n            time.sleep(full_jitter(attempt))  # Spread the load\\n\\n    raise MaxRetriesExceeded()" } }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Never Retry Non-Retryable Errors", "content": "**Retry (5xx + 429):** Server-side failures and rate limits. The condition may resolve.\\n\\n**Never retry (4xx except 429):**\\n- \`400 Bad Request\` — your payload is malformed; retrying sends the same broken data\\n- \`401 Unauthorized\` — your credentials are wrong; retrying is just noise\\n- \`403 Forbidden\` — you lack permission; retrying wastes quota\\n- \`404 Not Found\` — the resource doesn't exist; retrying won't create it\\n\\nRetrying a 400 is useless. Retrying a 401 in a loop is a bug that will get your IP blocked." }
\`\`\`

## The Deduplication Store

The idempotency key is only as useful as the store backing it. In production, this is almost always Redis. The store must be:

\`\`\`sysdiag
{ "title": "Idempotency Infrastructure", "width": 720, "height": 380, "nodes": [ { "id": "client", "label": "Client", "x": 70, "y": 190, "kind": "client" }, { "id": "gateway", "label": "API Gateway", "x": 220, "y": 190, "kind": "service" }, { "id": "redis", "label": "Redis\\nDedup Store", "x": 420, "y": 90, "kind": "cache" }, { "id": "app", "label": "App Server", "x": 420, "y": 280, "kind": "service" }, { "id": "db", "label": "Database", "x": 610, "y": 280, "kind": "database" } ], "edges": [ { "from": "client", "to": "gateway", "label": "POST + Idempotency-Key" }, { "from": "gateway", "to": "redis", "label": "SETNX key" }, { "from": "redis", "to": "gateway", "label": "hit / miss" }, { "from": "gateway", "to": "app", "label": "forward (on miss)" }, { "from": "app", "to": "db", "label": "write state" }, { "from": "app", "to": "redis", "label": "store response" } ], "annotations": { "redis": "Uses SETNX (atomic SET if Not eXists) to prevent race conditions. Key TTL = 24h. Stores request status ('processing' | 'done') and the cached response body.", "gateway": "Can deduplicate at the gateway layer (Stripe's approach) or inside app code. Gateway dedup is simpler but can't encode domain-specific logic like partial completion.", "app": "Only executes if dedup store returned a miss. Must write the result back before returning — the response is the source of truth for all future retries." } }
\`\`\`

### The Concurrent Request Race Condition

A subtle failure mode: two identical requests arrive *simultaneously* before either is stored in Redis.

\`\`\`callout
{ "type": "danger", "title": "Race Condition: Two Concurrent Duplicates", "content": "**Without atomic writes:**\\n\`\`\`\\nThread A: GET key → miss → start processing...\\nThread B: GET key → miss → start processing... (duplicate!)\\nThread A: SET key → done\\nThread B: SET key → done (overwrites A's result)\\n\`\`\`\\n\\n**Fix — use Redis SETNX:**\\n\`\`\`\\nThread A: SETNX key 'processing' → success (1) → execute\\nThread B: SETNX key 'processing' → fail (0) → poll and wait\\n\`\`\`\\n\\n\`SETNX\` is atomic. Only one thread can win the SET. The loser should poll the key until status is 'done', then return the cached response — not execute the operation itself." }
\`\`\`

## Practice

\`\`\`fillblank
{ "title": "Implement the Retry Delay Formula", "prompt": "Complete the exponential backoff function. The full jitter formula is: random(0, min(max_delay, base × 2^attempt))", "language": "python", "template": "import random\\n\\ndef get_retry_delay(attempt, base=1.0, max_delay=60.0):\\n    # Calculate the exponential ceiling\\n    ceiling = min(___, base * (2 ** ___))\\n    # Apply full jitter: pick randomly in [0, ceiling]\\n    return random.uniform(___, ceiling)", "blanks": [ { "answer": "max_delay", "hint": "What prevents the delay from growing without bound?" }, { "answer": "attempt", "hint": "What increases with each successive retry?" }, { "answer": "0", "hint": "Full jitter picks uniformly between zero and the ceiling" } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "A client sends POST /orders with Idempotency-Key: xyz-123. The server creates the order successfully, but the response is lost in transit. The client retries with the same key. What should the server do?", "options": [ "Create a second order and return a new response", "Return 409 Conflict to indicate a duplicate key was used", "Return the previously computed response without creating a new order", "Return 500 and ask the client to generate a new idempotency key" ], "answer": 2, "explanation": "The server should return the cached response from the first execution. This is the core contract of idempotency keys — the client gets the original result as if the first response was delivered, without any duplicate side effects." }, { "question": "Which HTTP status codes should trigger a retry with exponential backoff?", "options": [ "400 Bad Request, 401 Unauthorized, 403 Forbidden", "429 Too Many Requests, 500 Internal Server Error, 503 Service Unavailable", "200 OK, 201 Created, 204 No Content", "301 Moved Permanently, 302 Found, 304 Not Modified" ], "answer": 1, "explanation": "Only server-side errors (5xx) and rate limiting (429) are worth retrying — the underlying condition may resolve with time. Client errors (4xx except 429) indicate a problem with the request itself. Retrying a 400 just resends broken data; retrying a 401 in a loop is a bug." }, { "question": "Why is jitter essential in exponential backoff?", "options": [ "It makes the delay calculation simpler to implement correctly", "It prevents all clients from retrying simultaneously, avoiding thundering herd on a recovering server", "It ensures retries always succeed on the second attempt", "It increases the maximum allowed number of retry attempts" ], "answer": 1, "explanation": "Without jitter, all clients that failed at the same moment will retry at identical intervals (1s, 2s, 4s...). This creates synchronized bursts — thundering herd — that overwhelm a recovering server before it stabilizes. Full jitter spreads retries randomly across the window, smoothing the load." }, { "question": "A server marks an idempotency key as 'processing' after the operation completes. What critical bug does this introduce?", "options": [ "The TTL on the key will be too short", "A concurrent duplicate request arriving before the key is set will also execute the operation", "The client will always see a cache miss on the first request", "The dedup store will run out of memory faster" ], "answer": 1, "explanation": "If you only write to the dedup store after the operation completes, there's a race window where a concurrent duplicate sees a miss and starts executing. The fix is to write a 'processing' sentinel to the store atomically (via SETNX) before executing — closing the race window entirely." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Idempotency means executing an operation N times produces the same result as executing it once — the foundation of safe retries in distributed systems.", "Exactly-once semantics require three things: a client-generated UUID key, a server-side dedup store (Redis SETNX), and a cached response returned on any repeat request.", "Never use business identifiers (order IDs, user IDs) as idempotency keys — they are mutable, may not exist yet, and conflate identity with intent. Use UUID v4.", "The delay formula for exponential backoff with full jitter: random(0, min(cap, base × 2^attempt)). Jitter is non-negotiable — it prevents thundering herd on recovering servers.", "Only retry 5xx errors and 429 Too Many Requests. Never retry 4xx client errors — they represent request bugs that won't resolve on their own.", "Mark keys as 'processing' before executing the operation, not after — this closes the concurrent-duplicate race condition window." ] }
\`\`\``,
      starterCode: `import time
import random
import hashlib
from typing import Optional

# Simulated payment database: maps idempotency_key -> result
payment_store: dict[str, dict] = {}

# Simulated network call counter (to verify at-most-once processing)
processing_count = 0


def process_payment(amount: float, idempotency_key: str) -> dict:
    """
    Process a payment with idempotency support.
    
    If the same idempotency_key is used again, return the stored result
    without re-processing. This makes retries safe.
    
    Args:
        amount: Payment amount in dollars
        idempotency_key: Unique key for this payment attempt
    
    Returns:
        dict with 'status', 'transaction_id', and 'amount'
    """
    global processing_count
    
    # TODO 1: Check if this idempotency_key already exists in payment_store.
    # If it does, return the stored result immediately (no re-processing).
    
    
    # Simulate actual payment processing (runs only once per unique key)
    processing_count += 1
    transaction_id = hashlib.md5(idempotency_key.encode()).hexdigest()[:8]
    result = {
        "status": "success",
        "transaction_id": transaction_id,
        "amount": amount
    }
    
    # TODO 2: Store the result in payment_store keyed by idempotency_key
    # so future calls with the same key return this result.
    
    
    return result


def call_with_retry(
    amount: float,
    idempotency_key: str,
    max_attempts: int = 5,
    base_delay: float = 0.1
) -> Optional[dict]:
    """
    Call process_payment with exponential backoff and jitter.
    
    Retry on failure, but always use the SAME idempotency_key so
    repeated calls are safe (at-most-once processing semantics).
    
    Args:
        amount: Payment amount
        idempotency_key: Fixed key for this logical operation
        max_attempts: Maximum number of attempts
        base_delay: Base delay in seconds (doubles each retry)
    
    Returns:
        Result dict on success, None if all attempts fail
    """
    for attempt in range(max_attempts):
        try:
            # Simulate occasional network failures (first 2 attempts fail)
            if attempt < 2:
                raise ConnectionError("Simulated network failure")
            
            return process_payment(amount, idempotency_key)
        
        except ConnectionError as e:
            if attempt == max_attempts - 1:
                print(f"All {max_attempts} attempts failed.")
                return None
            
            # TODO 3: Calculate exponential backoff delay.
            # Formula: base_delay * (2 ** attempt)
            # Then add jitter: multiply by a random float between 0.5 and 1.5
            # Print the attempt number, error, and delay before sleeping.
            delay = 0  # Replace with correct formula
            
            print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay:.3f}s...")
            time.sleep(delay)
    
    return None


# --- Tests ---

def test_idempotency():
    """Same key should process payment exactly once."""
    key = "pay_user123_order456"
    
    result1 = process_payment(99.99, key)
    result2 = process_payment(99.99, key)  # Duplicate call (e.g., client retry)
    result3 = process_payment(99.99, key)  # Another duplicate
    
    assert result1 == result2 == result3, "Idempotent calls must return same result"
    assert processing_count == 1, f"Payment processed {processing_count} times, expected 1"
    print(f"PASS: idempotency — processed once, result consistent: {result1}")


def test_retry_with_backoff():
    """Retry should succeed and process payment exactly once."""
    global processing_count
    processing_count = 0
    payment_store.clear()
    
    key = "pay_user789_order999"
    result = call_with_retry(49.99, key, max_attempts=5, base_delay=0.05)
    
    assert result is not None, "Expected success after retries"
    assert result["status"] == "success"
    assert processing_count == 1, f"Payment processed {processing_count} times, expected 1"
    print(f"PASS: retry with backoff — succeeded on attempt 3, processed once: {result}")


if __name__ == "__main__":
    test_idempotency()
    test_retry_with_backoff()
`,
      solutionCode: `import time
import random
import hashlib
from typing import Optional

# Simulated payment database: maps idempotency_key -> result
payment_store: dict[str, dict] = {}

# Simulated network call counter (to verify at-most-once processing)
processing_count = 0


def process_payment(amount: float, idempotency_key: str) -> dict:
    """
    Process a payment with idempotency support.
    
    The idempotency key ensures that retrying the same logical operation
    (e.g., charging a user) never double-charges, even if the client
    retries due to a network timeout.
    """
    global processing_count
    
    # Return cached result if this key was already processed.
    # This is the core of idempotency: same key = same outcome, no re-execution.
    if idempotency_key in payment_store:
        return payment_store[idempotency_key]
    
    # Simulate actual payment processing (runs only once per unique key)
    processing_count += 1
    transaction_id = hashlib.md5(idempotency_key.encode()).hexdigest()[:8]
    result = {
        "status": "success",
        "transaction_id": transaction_id,
        "amount": amount
    }
    
    # Persist the result so future duplicate requests get this exact response.
    # In production this would be an atomic DB write (e.g., INSERT ... ON CONFLICT DO NOTHING).
    payment_store[idempotency_key] = result
    
    return result


def call_with_retry(
    amount: float,
    idempotency_key: str,
    max_attempts: int = 5,
    base_delay: float = 0.1
) -> Optional[dict]:
    """
    Call process_payment with exponential backoff + jitter.
    
    Key insight: we reuse the SAME idempotency_key across all retry attempts.
    This gives us at-most-once processing semantics — even if multiple retries
    reach the server, the payment is charged exactly once.
    
    Exponential backoff prevents thundering herd: each failure waits 2x longer.
    Jitter (random multiplier) desynchronizes retries from multiple clients
    so they don't all hammer the server at the same moment.
    """
    for attempt in range(max_attempts):
        try:
            # Simulate occasional network failures (first 2 attempts fail)
            if attempt < 2:
                raise ConnectionError("Simulated network failure")
            
            return process_payment(amount, idempotency_key)
        
        except ConnectionError as e:
            if attempt == max_attempts - 1:
                print(f"All {max_attempts} attempts failed.")
                return None
            
            # Exponential backoff: delay doubles with each attempt (0.1s, 0.2s, 0.4s...)
            # Jitter: random multiplier [0.5, 1.5] prevents synchronized retries
            backoff = base_delay * (2 ** attempt)
            jitter = random.uniform(0.5, 1.5)
            delay = backoff * jitter
            
            print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay:.3f}s...")
            time.sleep(delay)
    
    return None


# --- Tests ---

def test_idempotency():
    """Same key should process payment exactly once."""
    key = "pay_user123_order456"
    
    result1 = process_payment(99.99, key)
    result2 = process_payment(99.99, key)  # Duplicate call (e.g., client retry)
    result3 = process_payment(99.99, key)  # Another duplicate
    
    assert result1 == result2 == result3, "Idempotent calls must return same result"
    assert processing_count == 1, f"Payment processed {processing_count} times, expected 1"
    print(f"PASS: idempotency — processed once, result consistent: {result1}")


def test_retry_with_backoff():
    """Retry should succeed and process payment exactly once."""
    global processing_count
    processing_count = 0
    payment_store.clear()
    
    key = "pay_user789_order999"
    result = call_with_retry(49.99, key, max_attempts=5, base_delay=0.05)
    
    assert result is not None, "Expected success after retries"
    assert result["status"] == "success"
    assert processing_count == 1, f"Payment processed {processing_count} times, expected 1"
    print(f"PASS: retry with backoff — succeeded on attempt 3, processed once: {result}")


if __name__ == "__main__":
    test_idempotency()
    test_retry_with_backoff()
`,
    },
    {
      id: "observability-metrics-logs-traces",
      slug: "observability-metrics-logs-traces",
      title: "Observability: Metrics, Logs, and Distributed Traces",
      content: `# Observability: Metrics, Logs, and Distributed Traces

In a monolith, when something breaks you open one log file, attach a debugger, and reproduce the issue locally. You own the whole picture.

In a distributed system, a single user request may touch ten services, three databases, a cache layer, and a message queue — each running on different machines, owned by different teams, written in different languages. When that request is slow or wrong, *where do you even begin?*

This is the problem observability solves. Not "is the system up?" but "**why is the system behaving this way right now, and what exactly happened?**"

---

\`\`\`concept
{
  "title": "Observability vs. Monitoring",
  "variant": "rule",
  "content": "Monitoring is an early-warning system: it watches predefined metrics and fires alerts when thresholds are crossed. It works well for known, predictable failures. Observability is a diagnostic toolkit: it lets you ask arbitrary questions about system behavior—even questions you didn't think to ask before the incident. Monitoring tells you *something is wrong*. Observability tells you *why*."
}
\`\`\`

The distinction matters architecturally. Monitoring is reactive and bounded — you only catch failures you anticipated. Observability is exploratory — you can investigate unexpected failure modes without adding new instrumentation during an outage. In 2026, interviewers expect you to treat observability as a first-class architectural concern, designed in from the start, not bolted on after launch.

---

## The Three Pillars

Observability rests on three complementary data types. Think of them as a doctor's toolkit:

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Metrics",
      "icon": "📊",
      "content": "**Metrics** are numeric measurements aggregated over time — time series data.\\n\\nThey answer: **\\"Is something wrong?\\"**\\n\\n\`\`\`\\nhttp_requests_total{method=\\"POST\\", status=\\"500\\"} 42\\napi_response_duration_p99 1240ms\\ncache_hit_ratio 0.87\\n\`\`\`\\n\\n**What makes them powerful:**\\n- Extremely cheap to store and query (just numbers + timestamps)\\n- Perfect for dashboards and threshold-based alerting\\n- Enable trend analysis and capacity planning\\n\\n**What they can't do:**\\n- Explain *why* a metric spiked\\n- Show you which specific request failed\\n- Capture context about individual events\\n\\n**Tooling:** Prometheus (collection + storage), Grafana (visualization), AlertManager (alerting). Prometheus scrapes \`/metrics\` endpoints in the Prometheus exposition format."
    },
    {
      "label": "Logs",
      "icon": "📋",
      "content": "**Logs** are immutable, timestamped records of discrete events.\\n\\nThey answer: **\\"Why did it go wrong?\\"**\\n\\n\`\`\`json\\n{\\n  \\"timestamp\\": \\"2026-04-15T14:23:01Z\\",\\n  \\"level\\": \\"ERROR\\",\\n  \\"service\\": \\"payment-service\\",\\n  \\"trace_id\\": \\"abc123\\",\\n  \\"message\\": \\"Stripe charge failed\\",\\n  \\"user_id\\": \\"u_9912\\",\\n  \\"error\\": \\"card_declined\\",\\n  \\"amount_cents\\": 4999\\n}\\n\`\`\`\\n\\n**Three formats (from O'Reilly *Distributed Systems Observability*):**\\n1. **Plain text** — human readable, hard to parse at scale\\n2. **Structured (JSON)** — machine parseable, queryable, the modern standard\\n3. **Binary** — high-performance (Protobuf, MySQL binlogs), specialized use cases\\n\\n**What makes them powerful:**\\n- Full event context — IDs, payloads, stack traces\\n- The gold standard for root-cause analysis\\n\\n**What they can't do:**\\n- Show trends or aggregates efficiently\\n- Tell you which *service* in the call chain is the bottleneck\\n\\n**Tooling:** Fluentd/Fluentbit (shipping), Elasticsearch or Loki (storage), Grafana/Kibana (querying)"
    },
    {
      "label": "Traces",
      "icon": "🔗",
      "content": "**Traces** follow a single request as it travels through distributed services.\\n\\nThey answer: **\\"Where is it going wrong?\\"**\\n\\nA trace is composed of **spans** — each span is one unit of work (an HTTP call, a DB query, a queue message). Spans are linked by a shared \`trace_id\` and record parent-child relationships, timing, and metadata.\\n\\n\`\`\`\\nTrace: abc123  [total: 340ms]\\n├── api-gateway          [0ms → 5ms]   ✅\\n├── user-service         [5ms → 40ms]  ✅\\n├── payment-service      [40ms → 320ms] ⚠️\\n│   ├── db:SELECT        [40ms → 55ms]  ✅\\n│   └── inventory-call   [55ms → 320ms] ❌ TIMEOUT\\n└── response-serializer  [320ms → 340ms] ✅\\n\`\`\`\\n\\n**What makes them powerful:**\\n- Pinpoint *exactly* which service or operation is the bottleneck\\n- Map dependencies you didn't know existed\\n- Diagnose cascading failures\\n\\n**What they can't do:**\\n- Work without instrumentation — trace IDs must be propagated through every service boundary\\n- Capture everything at scale — high-throughput systems must use *sampling*\\n\\n**Tooling:** OpenTelemetry (instrumentation standard), Jaeger or Tempo (storage + UI)"
    }
  ]
}
\`\`\`

---

## How the Pillars Work Together in Practice

The three pillars are most powerful as a workflow, not in isolation. Here's the standard debugging loop during an incident:

\`\`\`steps
{
  "title": "The Observability Debugging Loop",
  "steps": [
    {
      "title": "Detect with Metrics",
      "content": "Your Grafana dashboard or AlertManager fires: **p99 latency crossed 2 seconds** on the checkout endpoint. Error rate is up 3%. You know *something* is wrong, and roughly *when* it started.\\n\\n> Metrics are efficient to store and fast to query — perfect for always-on alerting."
    },
    {
      "title": "Locate with Traces",
      "content": "You open Jaeger and filter traces for the \`POST /checkout\` endpoint with status 5xx. The flame graph shows:\\n\\n\`\`\`\\ncheckout-service [1,840ms]\\n└── inventory-service [1,750ms] ← 95% of time here\\n    └── db:SELECT inventory [1,740ms] ← missing index?\\n\`\`\`\\n\\nYou've narrowed the problem to a specific service **and** operation without reading a single log line."
    },
    {
      "title": "Explain with Logs",
      "content": "You grab the \`trace_id\` from that slow span and query Loki (or Elasticsearch):\\n\\n\`\`\`\\ntrace_id=abc123 service=inventory-service\\n\`\`\`\\n\\nResult:\\n\`\`\`\\nERROR: full table scan on orders_items — query planner chose seq scan (rows=2.1M)\\nWARN: index idx_product_id does not exist\\n\`\`\`\\n\\nRoot cause confirmed: a missing database index. Without the trace, you would have been grepping millions of lines across multiple services."
    }
  ]
}
\`\`\`

---

## The OpenTelemetry Ecosystem

Before OpenTelemetry (OTel), every vendor had its own SDK. Switching from Datadog to Jaeger meant re-instrumenting your entire codebase. OpenTelemetry solves this with a **vendor-neutral, open standard** for all three pillars.

\`\`\`sysdiag
{
  "title": "OpenTelemetry + Prometheus + Jaeger Stack",
  "width": 680,
  "height": 380,
  "nodes": [
    { "id": "app", "label": "Your\\nService", "x": 100, "y": 190, "kind": "service" },
    { "id": "otel", "label": "OTel\\nSDK", "x": 260, "y": 190, "kind": "service" },
    { "id": "collector", "label": "OTel\\nCollector", "x": 420, "y": 190, "kind": "service" },
    { "id": "prom", "label": "Prometheus\\n+ Grafana", "x": 580, "y": 100, "kind": "database" },
    { "id": "jaeger", "label": "Jaeger\\n(Traces)", "x": 580, "y": 190, "kind": "database" },
    { "id": "loki", "label": "Loki\\n(Logs)", "x": 580, "y": 280, "kind": "database" }
  ],
  "edges": [
    { "from": "app", "to": "otel", "label": "instrument" },
    { "from": "otel", "to": "collector", "label": "OTLP" },
    { "from": "collector", "to": "prom", "label": "metrics" },
    { "from": "collector", "to": "jaeger", "label": "traces" },
    { "from": "collector", "to": "loki", "label": "logs" }
  ],
  "annotations": {
    "otel": "The OTel SDK lives inside your application. It captures spans, metrics, and logs using the OpenTelemetry API — auto-instrumentation handles HTTP, gRPC, and DB calls with zero code changes.",
    "collector": "The OTel Collector is a standalone proxy that receives telemetry via OTLP protocol, batches it, transforms it, and fans it out to multiple backends. This decouples your app from backend choices.",
    "prom": "Prometheus scrapes metrics and stores them as time series. Grafana queries Prometheus to build dashboards and AlertManager sends PagerDuty/Slack alerts.",
    "jaeger": "Jaeger stores spans and reconstructs traces. Its UI shows flame graphs, dependency maps, and span-level metadata including any log lines you attached.",
    "loki": "Loki indexes log metadata (labels) but not the full text, making it far cheaper than Elasticsearch. You correlate logs to traces via shared trace_id labels."
  }
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "The Correlation Superpower",
  "content": "The real value of the OTel stack is **correlation**. A single \`trace_id\` field links a Grafana metric spike → a Jaeger trace waterfall → the exact log lines from every service involved. Many teams set up Grafana's Explore view to jump directly from a metric anomaly to its correlated trace in one click."
}
\`\`\`

---

## Comparing Debugging: Monolith vs. Distributed

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Monolith Debugging",
    "code": "# One process, one log, one stack trace\\n\\ntail -f app.log\\n# [ERROR] NullPointerException at PaymentController:42\\n# Stack trace points directly to the bug\\n\\n# You can also:\\n# - Attach a debugger\\n# - Reproduce locally\\n# - Add a print statement and redeploy one service"
  },
  "after": {
    "label": "Distributed Debugging (with observability)",
    "code": "# 10 services, 10 log streams, no single stack trace\\n\\n# Step 1: Grafana alert fires — p99 > 2s on /checkout\\n# Step 2: Jaeger shows inventory-service is 95% of latency\\n# Step 3: Filter logs by trace_id in Loki\\n#   trace_id=abc123 → 'full table scan, missing index'\\n\\n# Without observability:\\n# You grep 50GB of logs across 10 services\\n# You might never find the root cause"
  }
}
\`\`\`

---

## A Traced Request in Action

Here's what distributed tracing looks like at the data level. Notice how the shared \`trace_id\` and \`parent_span_id\` are what link everything together:

\`\`\`collapse
{
  "title": "Deep Dive: Anatomy of a Trace",
  "content": "A trace is just a tree of spans linked by IDs. Here's what the raw data looks like:\\n\\n\`\`\`json\\n[\\n  {\\n    \\"trace_id\\": \\"abc123\\",\\n    \\"span_id\\": \\"span-001\\",\\n    \\"parent_span_id\\": null,\\n    \\"service\\": \\"api-gateway\\",\\n    \\"operation\\": \\"POST /checkout\\",\\n    \\"start_ms\\": 0,\\n    \\"duration_ms\\": 340,\\n    \\"status\\": \\"OK\\"\\n  },\\n  {\\n    \\"trace_id\\": \\"abc123\\",\\n    \\"span_id\\": \\"span-002\\",\\n    \\"parent_span_id\\": \\"span-001\\",\\n    \\"service\\": \\"payment-service\\",\\n    \\"operation\\": \\"processPayment\\",\\n    \\"start_ms\\": 40,\\n    \\"duration_ms\\": 280,\\n    \\"status\\": \\"ERROR\\",\\n    \\"attributes\\": {\\n      \\"user.id\\": \\"u_9912\\",\\n      \\"payment.amount\\": 4999\\n    }\\n  },\\n  {\\n    \\"trace_id\\": \\"abc123\\",\\n    \\"span_id\\": \\"span-003\\",\\n    \\"parent_span_id\\": \\"span-002\\",\\n    \\"service\\": \\"inventory-service\\",\\n    \\"operation\\": \\"db:SELECT\\",\\n    \\"start_ms\\": 55,\\n    \\"duration_ms\\": 265,\\n    \\"status\\": \\"ERROR\\",\\n    \\"attributes\\": {\\n      \\"db.statement\\": \\"SELECT * FROM order_items WHERE product_id = ?\\",\\n      \\"db.rows_examined\\": 2100000\\n    }\\n  }\\n]\\n\`\`\`\\n\\nThe key insight: **\`trace_id\` is propagated in HTTP headers** (\`traceparent\` in the W3C standard) between every service call. The OTel SDK does this automatically. Without it, each service's spans would be orphaned — you'd have timing data but no tree structure.\\n\\n**Sampling consideration:** At 10,000 requests/second, storing every span is cost-prohibitive. Teams use **head-based sampling** (decide at the start of a trace, e.g., sample 1%) or **tail-based sampling** (buffer all spans, only persist traces that had errors or high latency). Jaeger and Tempo both support tail-based sampling."
}
\`\`\`

---

## SLOs and Error Budgets: Metrics in Production

Metrics aren't just for debugging — they're the foundation of **Service Level Objectives (SLOs)**, the contracts that define what "reliable" means for your service.

\`\`\`concept
{
  "title": "SLI → SLO → Error Budget",
  "variant": "mental-model",
  "content": "An **SLI** (Service Level Indicator) is a metric that measures one aspect of reliability — e.g., the fraction of requests completing in under 200ms. An **SLO** sets the target — e.g., '99.5% of requests under 200ms over a 30-day window.' The **error budget** is what remains: 0.5% of requests are allowed to fail. When you burn through the budget, you stop shipping features and focus on reliability. This turns observability data into a business decision framework."
}
\`\`\`

\`\`\`callout
{
  "type": "info",
  "title": "What Interviewers Expect in 2026",
  "content": "System design interviews now routinely include observability as part of the architecture discussion. Examiners look for candidates who:\\n- Name all three pillars and explain what question each one answers\\n- Mention OpenTelemetry as the instrumentation standard (not vendor-specific)\\n- Explain how metrics, traces, and logs are **correlated** via trace IDs\\n- Define SLOs and error budgets in terms of concrete metrics\\n- Address sampling strategies for high-throughput trace collection"
}
\`\`\`

---

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "You notice a spike in your p99 latency dashboard. Which observability pillar do you use next to find which service is responsible?",
      "options": [
        "Logs — search for ERROR level entries across all services",
        "Metrics — drill into more granular metric breakdowns",
        "Traces — view the distributed trace waterfall for affected requests",
        "Alerts — configure a new threshold for the affected metric"
      ],
      "answer": 2,
      "explanation": "Traces are the right tool here. They show you the request's full journey across services and pinpoint *where* the time is being spent, which is exactly what you need after metrics detect a latency problem. Logs come next to explain *why* that service is slow."
    },
    {
      "question": "What is the primary mechanism that allows spans from different services to be assembled into a single trace?",
      "options": [
        "A shared timestamp — spans from the same second are grouped together",
        "A trace_id propagated in HTTP headers across every service boundary",
        "A centralized trace registry where services register their spans",
        "Service discovery metadata stored in the OTel Collector"
      ],
      "answer": 1,
      "explanation": "The trace_id (part of the W3C traceparent header) is injected into every outgoing request by the OTel SDK and extracted by every receiving service. This parent-child linking is what turns isolated spans into a tree structure representing the full request path."
    },
    {
      "question": "Why is structured (JSON) logging preferred over plain text logging in distributed systems?",
      "options": [
        "JSON logs are smaller and use less storage than plain text",
        "JSON logs are human-readable without any tooling",
        "JSON logs can be parsed and queried programmatically, enabling filtering by trace_id, user_id, or any field",
        "JSON is the only format supported by OpenTelemetry"
      ],
      "answer": 2,
      "explanation": "Structured logs can be indexed and queried by any field — you can instantly find all logs for a specific trace_id, user_id, or error type. Plain text requires regex parsing and is brittle at scale. The ability to correlate logs to traces via trace_id is one of the biggest wins of structured logging."
    },
    {
      "question": "A team stores traces for every single request at 50,000 requests per second. What problem will they encounter?",
      "options": [
        "Traces will become inaccurate because the OTel SDK cannot handle high throughput",
        "The trace_id space will be exhausted within hours",
        "Storage and processing costs will be prohibitive — sampling is required at this scale",
        "Jaeger will round-robin spans across multiple traces, corrupting the data"
      ],
      "answer": 2,
      "explanation": "At 50k RPS, storing every span generates enormous data volume. Teams use head-based sampling (sample a fixed percentage at trace start) or tail-based sampling (buffer all spans, only persist traces with errors or high latency) to control costs while preserving the most valuable signal."
    },
    {
      "question": "What is the key architectural difference between monitoring and observability?",
      "options": [
        "Monitoring uses metrics while observability only uses logs",
        "Monitoring requires more infrastructure than observability",
        "Monitoring catches known failure modes via predefined thresholds; observability enables investigation of unknown or unexpected failures",
        "Observability is only needed for microservices, not monoliths"
      ],
      "answer": 2,
      "explanation": "Monitoring is bounded by what you anticipated — you can only alert on thresholds you defined. Observability lets you explore and ask arbitrary questions about system behavior, including failures you didn't predict. Both are necessary: monitoring for fast alerting on known issues, observability for diagnosing novel ones."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The three pillars answer different questions: Metrics detect ('is something wrong?'), Traces locate ('where is it wrong?'), Logs explain ('why is it wrong?'). Use all three together — relying on one leaves gaps.",
    "Monitoring and observability are complementary, not synonymous. Monitoring catches known failures via threshold alerts. Observability lets you investigate unexpected failures without adding new instrumentation during an incident.",
    "OpenTelemetry is the vendor-neutral standard for instrumenting all three pillars. The OTel Collector decouples your application from backend choices, letting you send the same telemetry to Prometheus, Jaeger, Loki, or any vendor.",
    "The trace_id propagated in HTTP headers (W3C traceparent) is the linchpin of distributed tracing — it links spans across service boundaries into a coherent request tree.",
    "At high throughput, sampling is mandatory for traces. Tail-based sampling (keep traces with errors or high latency, drop the rest) gives you the best signal-to-cost ratio.",
    "SLOs and error budgets translate metric data into business decisions: define what 'reliable' means as a measurable SLI target, then use your error budget to decide when reliability work must take priority over feature development."
  ]
}
\`\`\``,
    },
    {
      id: "checkpoint-rate-limiter-design",
      slug: "checkpoint-rate-limiter-design",
      title: "Checkpoint: Design a Distributed Rate Limiter",
      content: `# Checkpoint: Design a Distributed Rate Limiter

You've spent this module learning how systems degrade gracefully. Now it's time to put that knowledge to work. This checkpoint asks you to architect a **distributed rate limiter** for an API gateway — the exact problem you'll face in senior system design interviews at FAANG-level companies.

**The brief:** Design a system-wide rate limiter supporting **50,000 configurable rules** and **100,000 requests per second (RPS)**, enforcing per-user, per-IP, and per-API-key limits across a distributed fleet of gateway nodes.

Work through each section deliberately. By the end you'll have a full design you can defend in an interview.

---

## Step 1 — Clarify Requirements First

Before drawing a single box, a strong interviewer candidate asks clarifying questions. Requirements drive every architectural decision.

\`\`\`steps
{
  "title": "Requirements Clarification Checklist",
  "steps": [
    {
      "title": "Functional Requirements",
      "content": "- Identify clients by **user ID**, **IP address**, or **API key**\\n- Limit requests based on **configurable rules** (50K rules, updatable without restart)\\n- Reject excess requests with **HTTP 429** and headers: \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`, \`Retry-After\`\\n- Support multiple limit granularities: per-second, per-minute, per-hour"
    },
    {
      "title": "Non-Functional Requirements",
      "content": "- **Throughput:** 100K RPS across the cluster\\n- **Latency:** Rate-limit check adds ≤ 2ms p99 overhead per request\\n- **Availability:** No single point of failure; survive node crashes\\n- **Consistency:** All nodes must agree on counters — a client cannot bypass limits by routing through different servers\\n- **Scalability:** Horizontal scale-out to handle traffic spikes"
    },
    {
      "title": "Scope Decisions",
      "content": "- **Out of scope:** Billing, user authentication, request logging\\n- **In scope:** Counter storage, rule engine, failure modes (fail-open vs fail-closed), hot-key handling\\n- **Key assumption:** We prioritize **AP** (Availability + Partition Tolerance) from the CAP theorem — brief over-counting during a network partition is acceptable over dropping legitimate traffic"
    }
  ]
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Interview Signal: Always Define Trade-offs Early", "content": "Choosing AP over CP is a deliberate engineering decision, not laziness. State it explicitly: 'During a Redis partition, I'll allow slight over-serving rather than reject all traffic — a business decision favoring availability.' This shows senior-level thinking." }
\`\`\`

---

## Step 2 — Choose Your Algorithm

There are four canonical rate-limiting algorithms. Each has a different memory footprint, burst behavior, and accuracy profile. Choosing the right one is the core design decision.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Fixed Window",
      "icon": "🪟",
      "content": "### Fixed Window Counter\\n\\nDivides time into discrete buckets (e.g., each minute). Increment a counter per bucket.\\n\\n\`\`\`\\nKey: alice:2024-01-01T12:00 → 47\\nKey: alice:2024-01-01T12:01 → 5\\n\`\`\`\\n\\n**Pros:** O(1) space and time, dead simple\\n\\n**Cons:** **Boundary burst problem** — a user can send N requests at 12:00:59 and N more at 12:01:00, effectively 2× their limit in 2 seconds\\n\\n**Use when:** Approximate enforcement is fine, e.g., analytics dashboards"
    },
    {
      "label": "Sliding Window Log",
      "icon": "📜",
      "content": "### Sliding Window Log\\n\\nStores a timestamp for every request in a sorted set. On each request, remove timestamps older than the window and count remaining.\\n\\n\`\`\`\\nKey: alice:requests → [T-59s, T-45s, T-30s, T-12s, T-3s, T-now]\\n\`\`\`\\n\\n**Pros:** Perfectly accurate — no boundary bursts\\n\\n**Cons:** O(N) memory where N = request count in window. At 100K RPS with 60s windows, this is **6M entries per user** — impractical at scale\\n\\n**Use when:** Low-traffic APIs where exactness matters (e.g., financial APIs)"
    },
    {
      "label": "Sliding Window Counter",
      "icon": "🔢",
      "content": "### Sliding Window Counter (Hybrid)\\n\\nStores only two counters (current + previous window) and interpolates:\\n\\n\`\`\`\\nEstimated count = prev_count × (1 - elapsed/window) + curr_count\\n\`\`\`\\n\\nIf window = 60s and 40s have elapsed:\\n- Previous minute: 80 requests\\n- Current minute so far: 30 requests  \\n- Estimate: 80 × (1 - 40/60) + 30 = **56.7**\\n\\n**Pros:** O(1) space, ~accurate (within 0.1% error rate empirically)\\n\\n**Cons:** Slight approximation — occasionally allows micro-bursts\\n\\n**Use when:** Production API gateways. This is what **Cloudflare and Stripe use**."
    },
    {
      "label": "Token Bucket",
      "icon": "🪣",
      "content": "### Token Bucket\\n\\nEach client has a bucket with capacity C. Tokens refill at rate R per second. Each request consumes 1 token. Reject when bucket is empty.\\n\\n\`\`\`\\nKey: alice:bucket → { tokens: 95, last_refill: 1704067200 }\\n\`\`\`\\n\\nOn each request:\\n1. Compute elapsed time since last_refill\\n2. Add elapsed × R new tokens (cap at C)\\n3. If tokens ≥ 1: decrement and allow; else reject\\n\\n**Pros:** Naturally handles **burst traffic** — unused capacity banks up. Great for APIs that need burstable limits\\n\\n**Cons:** Requires two fields per client; refill logic must be atomic\\n\\n**Use when:** You want to allow legitimate bursts (e.g., a user uploads 10 photos at once but is throttled over time)"
    }
  ]
}
\`\`\`

\`\`\`concept
{ "title": "The Winning Choice for This Problem", "variant": "rule", "content": "For 100K RPS with 50K rules and ≤2ms latency overhead, use the **Sliding Window Counter**. It gives you O(1) Redis operations, near-perfect accuracy, and eliminates the memory explosion of the log approach. Token bucket is a strong alternative if bursting is a product requirement — ask the interviewer." }
\`\`\`

---

## Step 3 — Visualize the Algorithm

Let's trace exactly how the sliding window counter processes requests. Watch the interpolation math work.

\`\`\`algoviz
{
  "title": "Sliding Window Counter — Request Flow at t=40s into minute",
  "type": "array",
  "data": [80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "frames": [
    { "highlight": [0], "label": "prev_window = 80 requests (last minute, slots 0-19 represent prev 60s)", "stats": { "prev": 80, "curr": 30, "limit": 100 } },
    { "highlight": [20], "label": "curr_window = 30 requests so far this minute (slots 20+ represent current 60s)", "stats": { "prev": 80, "curr": 30, "elapsed_s": 40 } },
    { "highlight": [0, 20], "label": "Interpolate: weight = 1 - 40/60 = 0.333 → prev contribution = 80 × 0.333 = 26.7", "stats": { "prev_weight": "0.333", "prev_contribution": 26.7 } },
    { "highlight": [20], "label": "Total estimate = 26.7 + 30 = 56.7. Limit = 100. Request ALLOWED. Increment curr.", "stats": { "estimate": 56.7, "limit": 100, "decision": "ALLOW" } },
    { "highlight": [20], "label": "curr_window becomes 31. Next request at t=40s will estimate 57.7 — still under limit.", "stats": { "prev": 80, "curr": 31, "estimate": 57.7 } }
  ],
  "speed": 1000
}
\`\`\`

Now let's see the Redis Lua script that makes this atomic — the core of the implementation:

\`\`\`trace
{
  "title": "Atomic Sliding Window Counter in Redis Lua",
  "language": "python",
  "code": "-- Redis Lua script (atomic execution, no race conditions)\\nlocal key_curr = KEYS[1]   -- e.g. 'alice:2024-01-01T12:01'\\nlocal key_prev = KEYS[2]   -- e.g. 'alice:2024-01-01T12:00'\\nlocal limit    = tonumber(ARGV[1])  -- e.g. 100\\nlocal window   = tonumber(ARGV[2])  -- e.g. 60 (seconds)\\nlocal now      = tonumber(ARGV[3])  -- current unix timestamp\\nlocal window_start = tonumber(ARGV[4]) -- start of current window\\n\\nlocal curr_count = tonumber(redis.call('GET', key_curr) or 0)\\nlocal prev_count = tonumber(redis.call('GET', key_prev) or 0)\\nlocal elapsed    = now - window_start\\nlocal weight     = 1 - (elapsed / window)\\nlocal estimate   = prev_count * weight + curr_count\\n\\nif estimate >= limit then\\n    return 0  -- REJECT\\nend\\n\\nredis.call('INCR', key_curr)\\nredis.call('EXPIRE', key_curr, window * 2)\\nreturn 1  -- ALLOW",
  "frames": [
    { "line": 1,  "vars": { "key_curr": "alice:12:01", "key_prev": "alice:12:00" }, "note": "Two window keys — current and previous minute" },
    { "line": 5,  "vars": { "limit": 100, "window": 60, "now": 1704067240 }, "note": "Arguments passed from application layer" },
    { "line": 10, "vars": { "curr_count": 30, "prev_count": 80 }, "note": "Read both counters from Redis (O(1) each)" },
    { "line": 12, "vars": { "elapsed": 40, "weight": 0.333 }, "note": "How far into current window? 40s of 60s elapsed → weight 0.333" },
    { "line": 13, "vars": { "estimate": 56.7 }, "note": "Interpolated estimate: 80×0.333 + 30 = 56.7" },
    { "line": 15, "vars": { "decision": "ALLOW — 56.7 < 100" }, "note": "Under the limit, proceed to increment" },
    { "line": 19, "vars": { "curr_count": 31 }, "note": "Atomically increment current window counter" },
    { "line": 20, "vars": {}, "note": "Set TTL = 2 windows to auto-expire stale keys — prevents unbounded memory growth" }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Why Lua? Atomicity is Non-Negotiable", "content": "Without Lua, a GET → check → INCR sequence has a race condition: two requests can both read count=99, both pass the check, and both increment to 100 and 101. Redis executes Lua scripts as a single atomic unit, making this a single O(log N) operation on sorted sets or O(1) on counters." }
\`\`\`

---

## Step 4 — High-Level Architecture

With the algorithm chosen, design the full system.

\`\`\`sysdiag
{
  "title": "Distributed Rate Limiter Architecture",
  "width": 700,
  "height": 400,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 200, "kind": "client" },
    { "id": "gateway", "label": "API Gateway\\nFleet", "x": 200, "y": 200, "kind": "service" },
    { "id": "rl", "label": "Rate Limiter\\nMiddleware", "x": 360, "y": 200, "kind": "service" },
    { "id": "rules", "label": "Rules Cache\\n(Local TTL 10s)", "x": 360, "y": 320, "kind": "cache" },
    { "id": "redis", "label": "Redis Cluster\\n(Counters)", "x": 520, "y": 120, "kind": "database" },
    { "id": "ruldb", "label": "Rules DB\\n(Postgres)", "x": 520, "y": 320, "kind": "database" },
    { "id": "backend", "label": "Backend\\nServices", "x": 630, "y": 200, "kind": "service" }
  ],
  "edges": [
    { "from": "client", "to": "gateway", "label": "HTTP" },
    { "from": "gateway", "to": "rl", "label": "check(key)" },
    { "from": "rl", "to": "redis", "label": "Lua INCR" },
    { "from": "rl", "to": "rules", "label": "lookup rule" },
    { "from": "rules", "to": "ruldb", "label": "refresh (TTL)" },
    { "from": "rl", "to": "gateway", "label": "allow/reject" },
    { "from": "gateway", "to": "backend", "label": "proxied req" }
  ],
  "annotations": {
    "gateway": "Stateless API gateway nodes. Each request hits the rate limiter before being forwarded. The gateway fleet can scale horizontally without affecting rate limit accuracy because all state lives in Redis.",
    "rl": "Rate limiter middleware runs as a dedicated sidecar or separate service. This decouples scaling from the gateway and lets you reuse the same limiter across multiple microservices without code duplication.",
    "redis": "Redis Cluster (3+ shards) stores all window counters. Keys are sharded by client ID. Lua scripts execute atomically on the shard owning that key. Replication factor of 2 ensures no data loss on node failure.",
    "rules": "Each gateway node caches the rule set locally with a 10-second TTL. This eliminates DB round-trips on the hot path. Stale rules for 10s is an acceptable trade-off for sub-millisecond rule lookups.",
    "ruldb": "Postgres stores the 50K configurable rules. Rules are updated via admin API, then propagate to local caches within 10 seconds via TTL expiration."
  }
}
\`\`\`

---

## Step 5 — Implement the Core Logic

Let's build the sliding window counter in Python. This is what the rate limiter middleware executes on every request.

\`\`\`playground
{
  "title": "Sliding Window Rate Limiter (Simulated)",
  "language": "python",
  "runnable": true,
  "code": "import time\\nimport math\\nfrom collections import defaultdict\\n\\nclass SlidingWindowRateLimiter:\\n    \\"\\"\\"In-memory simulation of the Redis-backed sliding window counter.\\"\\"\\"\\n    \\n    def __init__(self, limit: int, window_seconds: int):\\n        self.limit = limit\\n        self.window = window_seconds\\n        # Simulated Redis: {key: count}\\n        self._store = defaultdict(int)\\n        self._start_times = {}  # track when each window started\\n    \\n    def _window_key(self, client_id: str, ts: float) -> str:\\n        bucket = math.floor(ts / self.window)\\n        return f\\"{client_id}:{bucket}\\"\\n    \\n    def is_allowed(self, client_id: str, ts: float = None) -> dict:\\n        if ts is None:\\n            ts = time.time()\\n        \\n        window_start = math.floor(ts / self.window) * self.window\\n        elapsed = ts - window_start\\n        weight = 1.0 - (elapsed / self.window)\\n        \\n        curr_key = self._window_key(client_id, ts)\\n        prev_key = self._window_key(client_id, ts - self.window)\\n        \\n        curr_count = self._store[curr_key]\\n        prev_count = self._store[prev_key]\\n        \\n        estimate = prev_count * weight + curr_count\\n        \\n        if estimate >= self.limit:\\n            return {\\n                \\"allowed\\": False,\\n                \\"estimate\\": round(estimate, 1),\\n                \\"remaining\\": 0,\\n                \\"retry_after\\": self.window - elapsed\\n            }\\n        \\n        self._store[curr_key] += 1\\n        remaining = max(0, self.limit - math.ceil(estimate) - 1)\\n        return {\\n            \\"allowed\\": True,\\n            \\"estimate\\": round(estimate + 1, 1),\\n            \\"remaining\\": remaining\\n        }\\n\\n# --- Demo ---\\nlimiter = SlidingWindowRateLimiter(limit=10, window_seconds=60)\\n\\nprint(\\"Simulating 15 rapid requests for user 'alice'\\")\\nprint(f\\"{'Req':>4}  {'Allowed':>8}  {'Estimate':>10}  {'Remaining':>10}\\")\\nprint(\\"-\\" * 40)\\n\\nt = 1000.0  # Fixed timestamp: 40 seconds into a window\\n# Pre-fill the previous window with 8 requests\\nfor _ in range(8):\\n    limiter._store[limiter._window_key('alice', t - 60)] += 1\\n\\nfor i in range(1, 16):\\n    result = limiter.is_allowed('alice', ts=t)\\n    status = \\"ALLOW\\" if result[\\"allowed\\"] else \\"REJECT\\"\\n    print(f\\"{i:>4}  {status:>8}  {result['estimate']:>10}  {result.get('remaining', 0):>10}\\")\\n"
}
\`\`\`

---

## Step 6 — Scaling to 100K RPS

At 100K RPS, naive designs collapse. Here are the bottlenecks and solutions.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Redis Sharding",
      "icon": "🗂️",
      "content": "### Redis Cluster for Horizontal Scale\\n\\nA single Redis node handles ~100K-200K operations/second. At 100K RPS where each request makes 2 Redis calls (GET × 2, INCR × 1), you need **~300K Redis ops/sec** — right at the limit.\\n\\n**Solution: Redis Cluster with consistent hashing**\\n\\n- Shard by \`client_id % num_shards\`\\n- Each shard handles a partition of the keyspace\\n- Add shards linearly as traffic grows\\n- Use **Redis pipeline + Lua** to batch the GET+INCR into one round-trip\\n\\n\`\`\`\\nShard 0: alice, charlie, ...  (hash 0-5460)\\nShard 1: bob, dave, ...       (hash 5461-10922)\\nShard 2: eve, frank, ...      (hash 10923-16383)\\n\`\`\`\\n\\n**Hot key problem:** A viral API key might land on one shard. Solution: local in-process counter with periodic Redis sync (accept slight over-counting during the sync window)."
    },
    {
      "label": "Local Cache Layer",
      "icon": "🧠",
      "content": "### In-Process Counter with Async Sync\\n\\nFor extreme throughput (1M+ RPS), add a local counter layer:\\n\\n1. Each gateway node maintains an **in-process token bucket** per client\\n2. Every 100ms, it **syncs deltas to Redis** with a single INCRBY\\n3. Redis holds the authoritative count; local cache prevents round-trips\\n\\n**Trade-off:** During the 100ms sync window, the system may allow up to \`N_nodes × local_increment\` extra requests. For 10 nodes with 100ms windows at 1000 RPS per client, that's ~1000 excess requests — acceptable for most use cases.\\n\\n**Use this pattern when:** p99 latency is critical and slight over-counting is acceptable."
    },
    {
      "label": "Fail-Open vs Fail-Closed",
      "icon": "⚡",
      "content": "### What Happens When Redis Goes Down?\\n\\nThis is the hardest availability question in rate limiter design.\\n\\n**Fail-Closed (safer for security)**\\n- If Redis is unreachable, reject ALL requests with 503\\n- Zero risk of abuse during outages\\n- Risk: legitimate traffic drops completely\\n- **Use when:** The API is financial, medical, or security-critical\\n\\n**Fail-Open (better for user experience)**\\n- If Redis is unreachable, allow ALL requests (remove the rate limit)\\n- No user impact during Redis outages\\n- Risk: abusers can flood during the outage window\\n- **Use when:** Service availability > abuse prevention (most consumer APIs)\\n\\n**Hybrid (recommended for 100K RPS)**\\n- Maintain a **local fallback limiter** with a stricter limit (e.g., 50% of normal)\\n- If Redis is unreachable, fall back to local counters\\n- Provides partial protection without full blackout\\n- This is what large API gateways like Kong and Nginx do"
    },
    {
      "label": "HTTP 429 Response",
      "icon": "🚫",
      "content": "### Standard Rate Limit Response Format\\n\\nThe response headers matter — they let clients back off gracefully:\\n\\n\`\`\`http\\nHTTP/1.1 429 Too Many Requests\\nX-RateLimit-Limit: 100\\nX-RateLimit-Remaining: 0\\nX-RateLimit-Reset: 1640995200\\nRetry-After: 60\\nContent-Type: application/json\\n\\n{\\n  \\"error\\": \\"rate_limit_exceeded\\",\\n  \\"message\\": \\"100 requests/minute limit reached\\",\\n  \\"retry_after_seconds\\": 60\\n}\\n\`\`\`\\n\\n**\`X-RateLimit-Reset\`** — Unix timestamp when the window resets  \\n**\`Retry-After\`** — Seconds until the client should retry  \\n**\`X-RateLimit-Remaining\`** — Include on ALL responses, not just 429s — lets clients self-throttle proactively"
    }
  ]
}
\`\`\`

---

## Step 7 — Trade-off Analysis

Every design decision has a cost. Let's make the key trade-offs explicit.

\`\`\`compare
{
  "variant": "good-bad",
  "before": {
    "label": "Anti-Pattern: In-Process Rate Limiter",
    "code": "# Each API server keeps its own counter\\nclass LocalRateLimiter:\\n    def __init__(self):\\n        self.counters = {}  # lives in process memory\\n    \\n    def check(self, client_id):\\n        count = self.counters.get(client_id, 0)\\n        if count >= LIMIT:\\n            return False\\n        self.counters[client_id] = count + 1\\n        return True\\n\\n# Problem: Server A and Server B have different counters.\\n# Alice can send LIMIT requests to Server A\\n# AND LIMIT requests to Server B = 2x the limit!"
  },
  "after": {
    "label": "Correct: Shared Redis Counter",
    "code": "# All gateway nodes share ONE Redis cluster\\nclass DistributedRateLimiter:\\n    def __init__(self, redis_cluster):\\n        self.redis = redis_cluster\\n        self.lua_script = load_sliding_window_script()\\n    \\n    def check(self, client_id, ts):\\n        # Lua script executes atomically on Redis\\n        # All nodes see the SAME counter for alice\\n        result = self.redis.evalsha(\\n            self.lua_script,\\n            keys=[f\\"{client_id}:curr\\", f\\"{client_id}:prev\\"],\\n            args=[LIMIT, WINDOW, ts, window_start(ts)]\\n        )\\n        return result == 1  # 1=allow, 0=reject\\n\\n# All 10 gateway nodes share the same counter.\\n# Alice's requests are correctly totaled across all nodes."
  }
}
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Handling Hot Keys (Viral Traffic)", "content": "A **hot key** occurs when one client ID generates a disproportionate share of traffic — e.g., a viral app making 50K of your 100K RPS. This creates a hotspot on one Redis shard.\\n\\n**Symptom:** One Redis shard CPU at 100% while others are idle.\\n\\n**Solution 1: Key sharding with scatter-gather**\\nSplit one key into N sub-keys (\`alice:0\` through \`alice:7\`), each storing 1/N of the limit. On each request, pick a random sub-key. Periodically aggregate for accurate counts. This spreads load but adds complexity.\\n\\n**Solution 2: Local token bucket + Redis sync**\\nKeep a local in-memory token bucket that absorbs 95%+ of traffic. Sync remaining tokens to Redis every 50ms. Redis only handles aggregate updates, not per-request writes. Works well for steady hot keys.\\n\\n**Solution 3: Shadow ban / priority queuing**\\nFor malicious hot keys (DoS attempts), use a separate fast-path that pattern-matches known abusive clients and rejects at the load balancer before they reach the rate limiter at all — protecting Redis from abuse." }
\`\`\`

---

## Step 8 — Practice: Fill in the Gaps

\`\`\`fillblank
{
  "title": "Complete the Rate Limiter Decision Logic",
  "prompt": "Complete the sliding window counter check function. Fill in the blanks to correctly calculate the estimate and decide whether to allow or reject.",
  "language": "python",
  "template": "def check_rate_limit(prev_count, curr_count, elapsed, window, limit):\\n    weight = 1.0 - (___ / ___)\\n    estimate = prev_count * ___ + ___\\n    if estimate >= ___:\\n        return \\"REJECT\\"\\n    return \\"ALLOW\\"",
  "blanks": [
    { "answer": "elapsed", "hint": "How many seconds have passed in the current window?" },
    { "answer": "window", "hint": "The total window duration in seconds" },
    { "answer": "weight", "hint": "How much of the previous window 'bleeds through'?" },
    { "answer": "curr_count", "hint": "Add the current window's raw count" },
    { "answer": "limit", "hint": "The maximum requests allowed per window" }
  ]
}
\`\`\`

\`\`\`fillblank
{
  "title": "Redis Key Design",
  "prompt": "Complete the Redis key schema for storing sliding window counters per user, per minute. Keys must be unique per user and time window to avoid collisions.",
  "language": "python",
  "template": "import math\\n\\ndef make_window_key(user_id: str, timestamp: float, window: int) -> str:\\n    bucket = math.floor(___ / ___)\\n    return f\\"{___}:{___}\\"",
  "blanks": [
    { "answer": "timestamp", "hint": "Divide the current time..." },
    { "answer": "window", "hint": "...by the window size to get which bucket we're in" },
    { "answer": "user_id", "hint": "The first part of the key identifies the client" },
    { "answer": "bucket", "hint": "The second part identifies the time window" }
  ]
}
\`\`\`

---

## Step 9 — Full System Review

Let's stress-test your design against the original requirements.

| Requirement | Solution | Verification |
|---|---|---|
| 100K RPS | Redis Cluster + Lua atomicity | Each request = 1 Lua call (~0.1ms) |
| ≤ 2ms latency overhead | Local rules cache (TTL 10s) + Redis pipeline | Eliminates DB round-trip on hot path |
| 50K configurable rules | Postgres + local TTL cache on each gateway node | Rules propagate within 10s of update |
| No single point of failure | Redis Cluster (3+ shards, replication factor 2) | Survives single node failure |
| Strong consistency | All counters in shared Redis; Lua atomicity | No race conditions across gateway nodes |
| HTTP 429 with headers | Middleware layer returns limit/remaining/reset | Standard compliant |

\`\`\`callout
{ "type": "success", "title": "Interview Tip: Quantify Everything", "content": "Don't just say 'Redis is fast.' Say: 'A single Redis instance handles ~100K ops/sec. Our Lua script does 3 ops per request (GET×2 + INCR×1), so 3×100K = 300K ops/sec requires a 3-shard cluster with headroom.' Interviewers reward engineers who size their systems." }
\`\`\`

---

## Step 10 — Knowledge Check

\`\`\`quiz
{
  "title": "Distributed Rate Limiter — Checkpoint Quiz",
  "questions": [
    {
      "question": "Why does the Sliding Window Counter algorithm use a weighted contribution from the previous window?",
      "options": [
        "To reduce memory usage by sharing counters between windows",
        "To smooth out the boundary burst problem where a fixed window resets abruptly",
        "To allow Redis to expire keys automatically without explicit TTLs",
        "To ensure consistency across Redis shards"
      ],
      "answer": 1,
      "explanation": "The fixed window's fatal flaw is the boundary burst: a user can send N requests at 11:59:59 and N more at 12:00:00, effectively doubling their limit in 2 seconds. The sliding window counter fixes this by weighing the previous window's count based on how far into the current window we are — creating a smooth rolling estimate instead of a hard reset."
    },
    {
      "question": "An API gateway has 10 nodes each running an in-process rate limiter with a limit of 100 req/min. What is the effective limit a single user can achieve?",
      "options": [
        "100 requests per minute",
        "10 requests per minute (split evenly)",
        "1000 requests per minute (100 × 10 nodes)",
        "It depends on the load balancer's routing algorithm"
      ],
      "answer": 2,
      "explanation": "Each node tracks counters independently. If requests are round-robined, a user gets 100 req/min from each of the 10 nodes = 1000 total. This is why in-process rate limiting is an anti-pattern for distributed systems — the effective limit scales with the number of nodes, defeating the purpose entirely."
    },
    {
      "question": "Your Redis cluster becomes unreachable for 30 seconds during a network partition. You've chosen a 'fail-open' strategy. Which statement is true?",
      "options": [
        "All requests are rejected with HTTP 503 during the partition",
        "Rate limiting enforcement stops; all requests are allowed through",
        "The system falls back to the previous minute's Redis snapshot",
        "Only cached rule lookups fail; counter enforcement continues"
      ],
      "answer": 1,
      "explanation": "Fail-open means: when the rate limiter's state store (Redis) is unreachable, remove the rate limit and allow all traffic. This preserves availability at the cost of potential abuse during the outage window. The alternative — fail-closed — rejects all traffic, which is safer but causes a complete service outage from the user's perspective."
    },
    {
      "question": "You need to handle a 'hot key' where user 'viral_app' makes 80K of your system's 100K RPS. Redis shard 3 (which owns 'viral_app') is at 100% CPU. What is the most effective solution?",
      "options": [
        "Increase Redis shard 3's instance size (vertical scaling)",
        "Move viral_app's key to a less loaded shard manually",
        "Use local in-process counters that sync to Redis every 50ms, absorbing per-request Redis writes",
        "Switch from Lua scripts to Redis MULTI/EXEC transactions"
      ],
      "answer": 2,
      "explanation": "The local counter + async sync pattern breaks the 1:1 mapping between requests and Redis writes. Instead of 80K Redis writes/sec for viral_app, you get ~20 Redis writes/sec (one per 50ms sync interval). The local counter absorbs the burst, and Redis only stores the aggregate delta. Vertical scaling only buys time — the same hotspot returns at higher traffic. Manual key migration breaks consistent hashing."
    },
    {
      "question": "Which CAP theorem choice is most appropriate for a rate limiter and why?",
      "options": [
        "CP (Consistency + Partition Tolerance): enforce exact limits even during partitions, at the cost of availability",
        "AP (Availability + Partition Tolerance): allow slight over-counting during partitions rather than dropping legitimate traffic",
        "CA (Consistency + Availability): not applicable since distributed systems always have partitions",
        "The CAP theorem doesn't apply to rate limiters since they use in-memory storage"
      ],
      "answer": 1,
      "explanation": "For most API rate limiters, AP is the correct choice. During a network partition, slightly over-serving a client for a few seconds is a minor risk compared to rejecting all legitimate traffic. The business impact of brief over-counting (a user gets 110 req/min instead of 100) is far smaller than a total service outage. Financial APIs or security systems requiring exact enforcement would choose CP instead."
    }
  ]
}
\`\`\`

---

## Key Takeaways

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "The Sliding Window Counter algorithm combines O(1) Redis operations with near-perfect accuracy by interpolating two fixed-window counters — making it the production standard for high-throughput rate limiting.",
    "Redis Lua scripts are essential for atomicity: the GET-check-INCR sequence must execute as a single atomic unit to prevent race conditions across concurrent requests from the same client.",
    "In-process rate limiting is an anti-pattern in distributed systems — the effective limit multiplies by the number of nodes. All counters must live in a shared store (Redis) to enforce global limits correctly.",
    "Separate your rule store (Postgres) from your counter store (Redis) with a local TTL cache on each node. This eliminates database round-trips on the hot path while allowing dynamic rule updates.",
    "For hot keys, the local counter + async Redis sync pattern reduces Redis write pressure from O(RPS) to O(1/sync_interval), trading slight over-counting for orders-of-magnitude better throughput.",
    "Choose fail-open vs fail-closed based on your risk model: fail-open preserves availability but risks abuse during outages; fail-closed eliminates abuse risk but causes a service blackout when Redis is down."
  ]
}
\`\`\`

---

**Checkpoint complete.** You've designed a production-grade distributed rate limiter handling 100K RPS with configurable rules, atomic Redis counters, hot-key mitigation, and explicit failure mode decisions. In a real interview, this design demonstrates senior-level distributed systems thinking: you quantified scale, named your CAP choice, and defended every trade-off. Move on to the next module when you're ready.`,
      starterCode: `import time
from collections import defaultdict
from threading import Lock

# Distributed Rate Limiter using Token Bucket Algorithm
# Supports 50K rules and high-throughput API gateway scenarios

class TokenBucketRateLimiter:
    """
    Token Bucket rate limiter.
    Each rule (client_id + endpoint) gets its own bucket.
    Tokens refill at a constant rate up to a maximum capacity.
    """

    def __init__(self):
        # TODO: Initialize a dictionary to store bucket state per rule_key
        # Each bucket needs: tokens (current), capacity (max), refill_rate (tokens/sec), last_refill (timestamp)
        self.buckets = {}
        self.lock = Lock()

    def configure_rule(self, rule_key: str, capacity: int, refill_rate: float):
        """
        Register a rate limit rule.
        Args:
            rule_key: Unique identifier e.g. 'user:123:POST:/api/orders'
            capacity: Max tokens (burst size)
            refill_rate: Tokens added per second
        """
        # TODO: Store the rule configuration in self.buckets
        # Initialize with full tokens (capacity), current time as last_refill
        pass

    def _refill(self, rule_key: str):
        """
        Refill tokens based on elapsed time since last refill.
        """
        bucket = self.buckets[rule_key]
        now = time.monotonic()

        # TODO: Calculate elapsed time since last_refill
        # TODO: Compute new tokens = elapsed * refill_rate
        # TODO: Add new tokens to current, capped at capacity
        # TODO: Update last_refill to now
        pass

    def allow_request(self, rule_key: str) -> bool:
        """
        Check if a request is allowed under the rate limit.
        Returns True if allowed (consumes 1 token), False if rate limited.
        """
        with self.lock:
            if rule_key not in self.buckets:
                # Unknown rule: allow by default (fail-open)
                return True

            # TODO: Call _refill to add any earned tokens
            # TODO: If tokens >= 1, consume 1 token and return True
            # TODO: Otherwise return False (rate limited)
            pass

    def get_bucket_state(self, rule_key: str) -> dict:
        """Return current state of a bucket (for monitoring/debugging)."""
        with self.lock:
            if rule_key not in self.buckets:
                return {}
            self._refill(rule_key)
            b = self.buckets[rule_key]
            return {
                "tokens": round(b["tokens"], 2),
                "capacity": b["capacity"],
                "refill_rate": b["refill_rate"]
            }


# --- Tests ---
if __name__ == "__main__":
    limiter = TokenBucketRateLimiter()

    # Rule: user 42 can call /api/search at 5 RPS, burst up to 5
    limiter.configure_rule("user:42:GET:/api/search", capacity=5, refill_rate=5.0)

    # TODO: Test 1 — First 5 requests should be allowed (burst)
    results = [limiter.allow_request("user:42:GET:/api/search") for _ in range(6)]
    print("Burst test (expect 5 True, 1 False):", results)

    # TODO: Test 2 — After 1 second, 5 more tokens should refill
    time.sleep(1.0)
    results2 = [limiter.allow_request("user:42:GET:/api/search") for _ in range(5)]
    print("Refill test (expect all True):", results2)

    # TODO: Test 3 — Unknown rule should fail-open
    print("Unknown rule (expect True):", limiter.allow_request("user:99:DELETE:/api/unknown"))
`,
      solutionCode: `import time
from threading import Lock

# Distributed Rate Limiter using Token Bucket Algorithm
# Chosen for: smooth burst handling, O(1) per request, memory-efficient for 50K rules

class TokenBucketRateLimiter:
    """
    Token Bucket rate limiter.

    Why Token Bucket over alternatives?
    - Fixed Window: allows 2x burst at window boundaries
    - Sliding Window Log: O(n) memory per user (stores every timestamp)
    - Sliding Window Counter: approximation, slightly less accurate
    - Token Bucket: O(1) memory (just 4 numbers), handles bursts gracefully
    - Leaky Bucket: no burst allowance, adds queuing complexity

    At 50K rules: memory ~= 50,000 * (4 floats * 8 bytes) = ~1.6 MB — easily fits in Redis.
    """

    def __init__(self):
        # Each key maps to: {tokens, capacity, refill_rate, last_refill}
        self.buckets = {}
        self.lock = Lock()  # In production: use Redis atomic ops (EVALSHA Lua script)

    def configure_rule(self, rule_key: str, capacity: int, refill_rate: float):
        """
        Register a rate limit rule.
        Args:
            rule_key: Composite key e.g. 'user:123:POST:/api/orders'
            capacity: Max tokens (controls burst size)
            refill_rate: Tokens added per second (steady-state RPS)
        """
        with self.lock:
            self.buckets[rule_key] = {
                "tokens": float(capacity),   # Start full — first burst allowed
                "capacity": capacity,
                "refill_rate": refill_rate,
                "last_refill": time.monotonic()
            }

    def _refill(self, rule_key: str):
        """
        Lazily refill tokens based on elapsed time.
        'Lazy' means we only compute refill on access — no background threads needed.
        This is critical for 50K rules: no timer per rule.
        """
        bucket = self.buckets[rule_key]
        now = time.monotonic()

        elapsed = now - bucket["last_refill"]            # Seconds since last request
        earned = elapsed * bucket["refill_rate"]         # Tokens earned in that window
        bucket["tokens"] = min(
            bucket["capacity"],                          # Never exceed burst capacity
            bucket["tokens"] + earned
        )
        bucket["last_refill"] = now

    def allow_request(self, rule_key: str) -> bool:
        """
        Attempt to consume 1 token. O(1) time, O(1) memory per rule.
        Thread-safe; in a real system this becomes a Redis Lua script
        for atomicity across distributed nodes.
        """
        with self.lock:
            if rule_key not in self.buckets:
                return True   # Fail-open: unknown rules are not blocked

            self._refill(rule_key)

            bucket = self.buckets[rule_key]
            if bucket["tokens"] >= 1.0:
                bucket["tokens"] -= 1.0
                return True   # Request allowed
            return False      # Rate limited

    def get_bucket_state(self, rule_key: str) -> dict:
        """Return current state of a bucket (for monitoring/debugging)."""
        with self.lock:
            if rule_key not in self.buckets:
                return {}
            self._refill(rule_key)
            b = self.buckets[rule_key]
            return {
                "tokens": round(b["tokens"], 2),
                "capacity": b["capacity"],
                "refill_rate": b["refill_rate"]
            }


# --- Tests ---
if __name__ == "__main__":
    limiter = TokenBucketRateLimiter()

    # Rule: 5 RPS steady-state, burst up to 5
    limiter.configure_rule("user:42:GET:/api/search", capacity=5, refill_rate=5.0)

    # Test 1: Burst — first 5 allowed, 6th denied
    results = [limiter.allow_request("user:42:GET:/api/search") for _ in range(6)]
    print("Burst test (expect 5 True, 1 False):", results)
    assert results == [True, True, True, True, True, False], f"Failed: {results}"

    # Test 2: Refill — after 1s, 5 tokens earned, all 5 allowed
    time.sleep(1.0)
    results2 = [limiter.allow_request("user:42:GET:/api/search") for _ in range(5)]
    print("Refill test (expect all True):", results2)
    assert all(results2), f"Failed: {results2}"

    # Test 3: Unknown rule fails open
    result3 = limiter.allow_request("user:99:DELETE:/api/unknown")
    print("Unknown rule (expect True):", result3)
    assert result3 == True

    # Test 4: Bucket state inspection
    state = limiter.get_bucket_state("user:42:GET:/api/search")
    print("Bucket state after 5 requests:", state)
    # tokens should be ~0 (just consumed 5)
    assert state["tokens"] < 1.0

    print("\\nAll tests passed!")
    print("\\nDesign notes:")
    print("- 50K rules * 4 floats * 8 bytes = ~1.6 MB total state")
    print("- No background threads: lazy refill is O(1) per request")
    print("- Production: replace Lock with Redis EVALSHA Lua for cross-node atomicity")
`,
    },
  ],
};

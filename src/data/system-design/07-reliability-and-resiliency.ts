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

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Reliability, Resiliency & Observability**." }
\\\`\\\`\\\`

## What you'll learn here

Calculate the practical meaning of 99.9% vs 99.99% uptime, understand SLOs and error budgets, and see how redundancy compounds availability.

## Preview of topics

- The core ideas that make **Availability Numbers and SLAs** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "rate-limiting-algorithms",
      slug: "rate-limiting-algorithms",
      title: "Rate Limiting: Token Bucket, Leaky Bucket, and Sliding Window",
      content: `# Rate Limiting: Token Bucket, Leaky Bucket, and Sliding Window

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Reliability, Resiliency & Observability**." }
\\\`\\\`\\\`

## What you'll learn here

Implement four rate limiting algorithms from scratch, compare their burst characteristics, and understand distributed rate limiting using Redis.

## Preview of topics

- The core ideas that make **Rate Limiting: Token Bucket, Leaky Bucket, and Sliding Window** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "circuit-breakers-and-bulkheads",
      slug: "circuit-breakers-and-bulkheads",
      title: "Circuit Breakers, Bulkheads, and Timeouts",
      content: `# Circuit Breakers, Bulkheads, and Timeouts

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Reliability, Resiliency & Observability**." }
\\\`\\\`\\\`

## What you'll learn here

Study Hystrix/Resilience4j patterns for preventing cascading failures — circuit breaker state machines, bulkhead thread isolation, and timeout hierarchies.

## Preview of topics

- The core ideas that make **Circuit Breakers, Bulkheads, and Timeouts** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "idempotency-and-retry-strategies",
      slug: "idempotency-and-retry-strategies",
      title: "Idempotency Keys and Retry Strategies",
      content: `# Idempotency Keys and Retry Strategies

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Reliability, Resiliency & Observability**." }
\\\`\\\`\\\`

## What you'll learn here

Design idempotent APIs to make retries safe, implement exponential backoff with jitter, and understand at-most-once vs at-least-once vs exactly-once delivery.

## Preview of topics

- The core ideas that make **Idempotency Keys and Retry Strategies** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "observability-metrics-logs-traces",
      slug: "observability-metrics-logs-traces",
      title: "Observability: Metrics, Logs, and Distributed Traces",
      content: `# Observability: Metrics, Logs, and Distributed Traces

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Reliability, Resiliency & Observability**." }
\\\`\\\`\\\`

## What you'll learn here

Understand the three pillars of observability, the difference between monitoring and observability, and how OpenTelemetry, Prometheus, and Jaeger fit together.

## Preview of topics

- The core ideas that make **Observability: Metrics, Logs, and Distributed Traces** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "checkpoint-rate-limiter-design",
      slug: "checkpoint-rate-limiter-design",
      title: "Checkpoint: Design a Distributed Rate Limiter",
      content: `# Checkpoint: Design a Distributed Rate Limiter

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Reliability, Resiliency & Observability**." }
\\\`\\\`\\\`

## What you'll learn here

Design a system-wide rate limiter for an API gateway supporting 50K rules and 100K RPS, choosing the right algorithm and data structure.

## Preview of topics

- The core ideas that make **Checkpoint: Design a Distributed Rate Limiter** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};

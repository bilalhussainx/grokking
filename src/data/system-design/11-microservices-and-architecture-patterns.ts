import { Module } from "../types";

export const microservicesAndArchitecturePatternsModule: Module = {
  id: "microservices-and-architecture-patterns",
  title: "Microservices & Modern Architecture Patterns",
  description: "Master microservices decomposition, event-driven architecture, CQRS, and the operational patterns that make distributed services maintainable at scale.",
  lessons: [
    {
      id: "monolith-to-microservices",
      slug: "monolith-to-microservices",
      title: "Monolith to Microservices: When and How to Decompose",
      content: `# Monolith to Microservices: When and How to Decompose

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Microservices & Modern Architecture Patterns**." }
\\\`\\\`\\\`

## What you'll learn here

Understand the strangler fig pattern, domain-driven decomposition, and the organisational prerequisites (Conway's Law) that determine when microservices help vs hurt.

## Preview of topics

- The core ideas that make **Monolith to Microservices: When and How to Decompose** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "event-driven-architecture",
      slug: "event-driven-architecture",
      title: "Event-Driven Architecture and the Outbox Pattern",
      content: `# Event-Driven Architecture and the Outbox Pattern

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Microservices & Modern Architecture Patterns**." }
\\\`\\\`\\\`

## What you'll learn here

Design systems around domain events: event sourcing, choreography vs orchestration, and guaranteed event delivery with the transactional outbox.

## Preview of topics

- The core ideas that make **Event-Driven Architecture and the Outbox Pattern** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "cqrs-and-event-sourcing",
      slug: "cqrs-and-event-sourcing",
      title: "CQRS and Event Sourcing",
      content: `# CQRS and Event Sourcing

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Microservices & Modern Architecture Patterns**." }
\\\`\\\`\\\`

## What you'll learn here

Separate read and write models with CQRS, rebuild state from an immutable event log with event sourcing, and understand the projections that power query views.

## Preview of topics

- The core ideas that make **CQRS and Event Sourcing** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "data-mesh-and-lake-architecture",
      slug: "data-mesh-and-lake-architecture",
      title: "Data Mesh, Data Lake, and Analytical Architectures",
      content: `# Data Mesh, Data Lake, and Analytical Architectures

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Microservices & Modern Architecture Patterns**." }
\\\`\\\`\\\`

## What you'll learn here

Distinguish OLTP from OLAP, study the Lambda and Kappa architectures for batch + streaming analytics, and understand columnar storage formats like Parquet.

## Preview of topics

- The core ideas that make **Data Mesh, Data Lake, and Analytical Architectures** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "multi-region-deployment",
      slug: "multi-region-deployment",
      title: "Multi-Region Deployment and Global Traffic Routing",
      content: `# Multi-Region Deployment and Global Traffic Routing

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Microservices & Modern Architecture Patterns**." }
\\\`\\\`\\\`

## What you'll learn here

Design active-active vs active-passive multi-region setups, global load balancing with GeoDNS, data residency compliance, and cross-region replication lag handling.

## Preview of topics

- The core ideas that make **Multi-Region Deployment and Global Traffic Routing** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "checkpoint-architecture-patterns",
      slug: "checkpoint-architecture-patterns",
      title: "Checkpoint: Refactor a Monolith into Event-Driven Microservices",
      content: `# Checkpoint: Refactor a Monolith into Event-Driven Microservices

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Microservices & Modern Architecture Patterns**." }
\\\`\\\`\\\`

## What you'll learn here

Given a monolithic e-commerce system description, identify bounded contexts, define domain events, and sketch the target microservices architecture with API contracts.

## Preview of topics

- The core ideas that make **Checkpoint: Refactor a Monolith into Event-Driven Microservices** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};

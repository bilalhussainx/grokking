import { Module } from "../types";

export const coreSystemCaseStudiesModule: Module = {
  id: "core-system-case-studies",
  title: "Case Studies: Core Infrastructure Systems",
  description: "Apply every concept learned so far to design four foundational systems that appear in most large-scale architectures: URL shortener, key-value store, search typeahead, and object storage.",
  lessons: [
    {
      id: "design-url-shortener",
      slug: "design-url-shortener",
      title: "Design a URL Shortener (TinyURL / Bitly)",
      content: `# Design a URL Shortener (TinyURL / Bitly)

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Core Infrastructure Systems**." }
\\\`\\\`\\\`

## What you'll learn here

Design a URL shortening service for 100M URLs. Cover hash generation, collision handling, 301 vs 302 redirects, analytics tracking, and expiration.

## Preview of topics

- The core ideas that make **Design a URL Shortener (TinyURL / Bitly)** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "design-key-value-store",
      slug: "design-key-value-store",
      title: "Design a Distributed Key-Value Store",
      content: `# Design a Distributed Key-Value Store

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Core Infrastructure Systems**." }
\\\`\\\`\\\`

## What you'll learn here

Build a DynamoDB-style key-value store with consistent hashing, vector clocks for conflict resolution, gossip protocol, and tunable consistency.

## Preview of topics

- The core ideas that make **Design a Distributed Key-Value Store** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "design-search-typeahead",
      slug: "design-search-typeahead",
      title: "Design a Search Typeahead / Autocomplete",
      content: `# Design a Search Typeahead / Autocomplete

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Core Infrastructure Systems**." }
\\\`\\\`\\\`

## What you'll learn here

Design real-time autocomplete for 10B queries/day using trie sharding, frequency-weighted ranking, and multi-tier caching with sub-100ms p99 latency.

## Preview of topics

- The core ideas that make **Design a Search Typeahead / Autocomplete** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "design-object-storage",
      slug: "design-object-storage",
      title: "Design an Object Storage Service (S3)",
      content: `# Design an Object Storage Service (S3)

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Core Infrastructure Systems**." }
\\\`\\\`\\\`

## What you'll learn here

Design a distributed blob store with multi-part upload, checksumming, versioning, replication across availability zones, and presigned URLs.

## Preview of topics

- The core ideas that make **Design an Object Storage Service (S3)** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "design-unique-id-generator",
      slug: "design-unique-id-generator",
      title: "Design a Distributed Unique ID Generator",
      content: `# Design a Distributed Unique ID Generator

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Core Infrastructure Systems**." }
\\\`\\\`\\\`

## What you'll learn here

Compare UUID, Twitter Snowflake, and database auto-increment approaches. Implement a Snowflake-style ID with time-ordered, k-sortable properties.

## Preview of topics

- The core ideas that make **Design a Distributed Unique ID Generator** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "checkpoint-core-systems",
      slug: "checkpoint-core-systems",
      title: "Checkpoint: Core Systems Trade-off Review",
      content: `# Checkpoint: Core Systems Trade-off Review

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Core Infrastructure Systems**." }
\\\`\\\`\\\`

## What you'll learn here

Revisit all four case studies and answer 10 targeted trade-off questions — the style most commonly asked in senior/staff engineer interviews.

## Preview of topics

- The core ideas that make **Checkpoint: Core Systems Trade-off Review** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};

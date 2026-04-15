import { Module } from "../types";

export const socialAndMediaCaseStudiesModule: Module = {
  id: "social-and-media-case-studies",
  title: "Case Studies: Social Platforms & Media",
  description: "Tackle the canonical social platform problems — news feed, photo sharing, and video streaming — where read/write asymmetry, fan-out, and CDN design dominate.",
  lessons: [
    {
      id: "design-instagram",
      slug: "design-instagram",
      title: "Design Instagram (Photo Sharing at Scale)",
      content: `# Design Instagram (Photo Sharing at Scale)

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Social Platforms & Media**." }
\\\`\\\`\\\`

## What you'll learn here

Design a photo-sharing platform for 1B users. Cover media upload pipeline, object storage, CDN strategy, follower graph sharding, and feed generation.

## Preview of topics

- The core ideas that make **Design Instagram (Photo Sharing at Scale)** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "design-twitter-news-feed",
      slug: "design-twitter-news-feed",
      title: "Design Twitter / X (Social Feed with Fan-Out)",
      content: `# Design Twitter / X (Social Feed with Fan-Out)

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Social Platforms & Media**." }
\\\`\\\`\\\`

## What you'll learn here

Deep-dive into the fan-out-on-write vs fan-out-on-read debate for news feed. Design Twitter's hybrid model for celebrity vs regular users.

## Preview of topics

- The core ideas that make **Design Twitter / X (Social Feed with Fan-Out)** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "design-youtube-netflix",
      slug: "design-youtube-netflix",
      title: "Design YouTube / Netflix (Video Streaming)",
      content: `# Design YouTube / Netflix (Video Streaming)

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Social Platforms & Media**." }
\\\`\\\`\\\`

## What you'll learn here

Design a video platform covering upload transcoding pipelines (FFmpeg workers), adaptive bitrate streaming (HLS/DASH), CDN topology, and recommendation storage.

## Preview of topics

- The core ideas that make **Design YouTube / Netflix (Video Streaming)** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "design-facebook-messenger",
      slug: "design-facebook-messenger",
      title: "Design a Chat Application (Facebook Messenger / WhatsApp)",
      content: `# Design a Chat Application (Facebook Messenger / WhatsApp)

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Social Platforms & Media**." }
\\\`\\\`\\\`

## What you'll learn here

Design real-time 1:1 and group messaging with WebSocket connection routing, message ordering guarantees, read receipts, and end-to-end encryption architecture.

## Preview of topics

- The core ideas that make **Design a Chat Application (Facebook Messenger / WhatsApp)** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "design-live-streaming",
      slug: "design-live-streaming",
      title: "Design a Live Streaming Platform (Twitch)",
      content: `# Design a Live Streaming Platform (Twitch)

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Social Platforms & Media**." }
\\\`\\\`\\\`

## What you'll learn here

Design low-latency live video ingestion with RTMP, transcoding fan-out, viewer-count estimation using HyperLogLog, and chat at scale.

## Preview of topics

- The core ideas that make **Design a Live Streaming Platform (Twitch)** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
    {
      id: "checkpoint-social-media-systems",
      slug: "checkpoint-social-media-systems",
      title: "Checkpoint: Social System Deep-Dive Questions",
      content: `# Checkpoint: Social System Deep-Dive Questions

\\\`\\\`\\\`callout
{ "variant": "info", "title": "Coming Soon", "content": "This lesson is being finalized. While you wait, work through the earlier modules — they give you the foundations you'll need before tackling **Case Studies: Social Platforms & Media**." }
\\\`\\\`\\\`

## What you'll learn here

Answer eight senior-level follow-up questions from the case studies above — the type asked after the whiteboard sketch to probe depth.

## Preview of topics

- The core ideas that make **Checkpoint: Social System Deep-Dive Questions** click
- How it connects to what you built in earlier modules
- A worked example you'll code end-to-end

_Check back soon — we're adding the full interactive lesson._
`,
    },
  ],
};

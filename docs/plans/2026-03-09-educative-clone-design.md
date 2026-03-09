# Educative.io Clone — Design Document

## Goal
Build a full-featured educative.io replica focused on two courses: "Grokking the Coding Interview" (Python) and "System Design & Architecture", with an in-browser Monaco IDE, Pyodide Python execution, and localStorage-based progress tracking.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui components
- Monaco Editor (in-browser code IDE)
- Pyodide (WebAssembly Python runtime)
- localStorage (progress persistence)

## Architecture
Single Next.js app with static course content stored as TypeScript data files. No backend — all code execution via Pyodide in browser. Course navigation via App Router dynamic routes. Split-pane layout with resizable content/IDE panels.

## Course Structure

### Grokking the Coding Interview (16 modules, ~80+ lessons)
1. Two Pointers
2. Fast & Slow Pointers
3. Sliding Window
4. Merge Intervals
5. Cyclic Sort
6. In-place Reversal of LinkedList
7. Tree BFS
8. Tree DFS
9. Two Heaps
10. Subsets
11. Modified Binary Search
12. Bitwise XOR
13. Top K Elements
14. K-way Merge
15. Topological Sort
16. Dynamic Programming Patterns

### System Design (12 chapters, ~50+ lessons)
1. Fundamentals
2. Key Concepts
3. Design URL Shortener
4. Design Instagram
5. Design Twitter
6. Design Chat System
7. Design Web Crawler
8. Design Notification System
9. Design Rate Limiter
10. Design Key-Value Store
11. Design YouTube
12. Design Google Docs

## UI Layout
- Top nav: logo, course title, progress bar, dark mode toggle
- Left sidebar: collapsible module tree with completion checkmarks
- Center: rendered lesson content (markdown with diagrams, callouts)
- Bottom/Right: Monaco IDE with run button, output panel, solution toggle
- Footer nav: Previous / Mark Complete / Next

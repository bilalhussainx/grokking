import { Module } from "../types";

export const searchEngineModule: Module = {
  id: "design-search",
  title: "Designing a Distributed Search Engine",
  description: "Design a distributed search engine: inverted indexes, TF-IDF and BM25 scoring, distributed indexing, real-time ingestion pipelines, and complete Elasticsearch-inspired architecture walkthrough.",
  lessons: [
    {
      id: "search-requirements",
      slug: "search-requirements",
      title: "Search Engine: Requirements & Problem Space",
      content: `# Search Engine: Requirements & Problem Space

A search engine takes a user's query and returns the most relevant documents from a corpus of billions. Systems like Elasticsearch, Solr, and Google Search solve this at different scales, but all share the same core challenges: indexing documents efficiently, scoring relevance accurately, and returning results in milliseconds.

## The Problem

Full-text search over a large corpus is fundamentally different from key-value lookups. You cannot simply hash a query to find the answer. You need to:

- Break documents into searchable tokens
- Match query terms against those tokens across billions of documents
- Rank results by relevance, not just existence
- Return results in under 100ms

\`\`\`
Scale of a Search Engine
========================

Google:      ~100 billion indexed pages
Elasticsearch cluster (large): ~10 billion documents
E-commerce search: ~10-100 million products

Query volume:
  Google:       ~100,000 queries/sec
  E-commerce:   ~10,000 queries/sec

Latency targets:
  p50: < 50ms
  p99: < 200ms
\`\`\`

## Functional Requirements

1. **Index(document)** -- Ingest and index a new document
2. **Search(query)** -- Return ranked documents matching the query
3. **Update(document)** -- Re-index a modified document
4. **Delete(document_id)** -- Remove a document from the index
5. Support for **full-text search**, **phrase queries**, **filters**, and **facets**
6. Support for **fuzzy matching** and **autocomplete suggestions**

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Index latency | < 1 second (near-real-time) |
| Query latency | < 100ms at p99 |
| Throughput (query) | 10,000+ queries/sec |
| Throughput (index) | 10,000+ docs/sec |
| Availability | 99.99% for reads |
| Scalability | Horizontal -- add nodes to handle more data |
| Durability | No indexed document should be silently lost |

## Why Not Just Use a Database?

\`\`\`
Database vs. Search Engine
===========================

SQL: SELECT * FROM docs WHERE body LIKE '%distributed systems%'

Problem:
  1. Full table scan -- O(N) for N documents
  2. No ranking -- all matches are "equal"
  3. No tokenization -- "distributed" won't match "distributing"
  4. No stemming -- "running" won't match "ran"
  5. No relevance scoring -- a doc mentioning the term 50 times
     ranks the same as one mentioning it once

Search Engine:
  1. Inverted index lookup -- O(1) to find posting list
  2. TF-IDF / BM25 scoring -- relevance ranking
  3. Tokenization + stemming -- linguistic normalization
  4. Analyzers -- lowercase, stop words, synonyms
  5. Results in < 100ms even over billions of documents
\`\`\`

## Core Concepts Preview

\`\`\`
Search Engine Building Blocks
==============================

[Documents] --> [Analyzer] --> [Inverted Index]
                                     |
                                     v
                              [Query Processor]
                                     |
                                     v
                              [Scoring (BM25)]
                                     |
                                     v
                              [Ranked Results]

Analyzer pipeline:
  "The Quick Brown Fox!"
    --> tokenize:   ["The", "Quick", "Brown", "Fox"]
    --> lowercase:  ["the", "quick", "brown", "fox"]
    --> stop words: ["quick", "brown", "fox"]
    --> stemming:   ["quick", "brown", "fox"]
\`\`\`

## Key Takeaway

A search engine solves the problem of finding relevant documents in a massive corpus in milliseconds. The fundamental data structure is the inverted index, and the fundamental algorithm is relevance scoring. Everything else -- distributed indexing, sharding, real-time ingestion -- is about scaling these two core ideas across many machines.`,
    },
    {
      id: "search-inverted-index",
      slug: "search-inverted-index",
      title: "Inverted Index Design",
      content: `# Inverted Index Design

\`\`\`concept
{"title": "The Inverted Index Mental Model", "variant": "mental-model", "content": "Think of a library catalog vs. a book index. A catalog (forward index) tells you what books the library has. A book index (inverted index) tells you every page where a specific word appears. Search engines flip the document→word relationship so they can answer \\"which documents contain X?\\" in milliseconds instead of scanning every file."}
\`\`\`

The **inverted index** is the core data structure of every search engine. Instead of mapping documents to their words (a forward index), it maps each word to the list of documents that contain it.

## Forward vs. Inverted: Direction Matters

\`\`\`compare
{"variant": "before-after", "before": {"label": "Forward Index (database style)", "code": "doc_1: \\"the quick brown fox jumps over the lazy dog\\"\\ndoc_2: \\"the fox is quick and brown\\"\\ndoc_3: \\"a lazy dog sleeps\\"\\n\\nTo find \\"fox\\": scan every doc → O(N·L)"}, "after": {"label": "Inverted Index (search style)", "code": "\\"brown\\"  → [doc_1, doc_2]\\n\\"dog\\"    → [doc_1, doc_3]\\n\\"fox\\"    → [doc_1, doc_2]\\n\\"jumps\\"  → [doc_1]\\n\\"lazy\\"   → [doc_1, doc_3]\\n\\"quick\\"  → [doc_1, doc_2]\\n\\"sleeps\\" → [doc_3]\\n\\nQuery \\"quick fox\\":\\n  intersect([doc_1,doc_2], [doc_1,doc_2]) → [doc_1,doc_2] in O(log P)"}}
\`\`\`

To search for a term, you look up its **posting list** — the sorted list of document IDs containing that term. For multi-term queries, you intersect or union the posting lists.

## Anatomy of a Posting List

A basic posting list stores just document IDs. A richer posting list stores additional metadata for scoring and highlighting:

\`\`\`algoviz
{"title": "Posting List Enrichment", "type": "array", "data": ["[doc_1, doc_2]", "[(doc_1,1), (doc_2,1)]", "[(doc_1,1,[1]), (doc_2,1,[3])]", "[(doc_1,1,[1],\\"body\\"), (doc_2,1,[3],\\"title\\")]"], "frames": [{"highlight": [0], "label": "Basic: only doc IDs", "stats": {"bytes": 16}}, {"highlight": [1], "label": "+ term frequency (TF) for scoring", "stats": {"bytes": 32}}, {"highlight": [2], "label": "+ positions for phrase queries", "stats": {"bytes": 56}}, {"highlight": [3], "label": "+ field info for weighted scoring", "stats": {"bytes": 72}}], "speed": 1000}
\`\`\`

Positions enable phrase queries:
- Query: \`"quick brown"\`
- \`doc_1\`: "quick" at position 1, "brown" at position 2 → adjacent → phrase match!

## Tokenization Pipeline

Before building the index, documents pass through an **analyzer** that transforms raw text into index terms:

\`\`\`steps
{"title": "Analyzer Pipeline Walk-through", "steps": [{"title": "Raw input", "content": "\`\\"The Quick Brown Fox's 2nd Jump!\\"\`"}, {"title": "Character filters", "content": "Strip HTML, normalize Unicode\\n→ \`\\"The Quick Brown Fox's 2nd Jump!\\"\`"}, {"title": "Tokenizer", "content": "Split on whitespace & punctuation\\n→ \`[\\"The\\", \\"Quick\\", \\"Brown\\", \\"Fox's\\", \\"2nd\\", \\"Jump\\"]\`"}, {"title": "Token filters", "content": "1. Lowercase\\n→ \`[\\"the\\", \\"quick\\", \\"brown\\", \\"fox's\\", \\"2nd\\", \\"jump\\"]\`\\n\\n2. Remove possessives\\n→ \`[\\"the\\", \\"quick\\", \\"brown\\", \\"fox\\", \\"2nd\\", \\"jump\\"]\`\\n\\n3. Stop-word removal\\n→ \`[\\"quick\\", \\"brown\\", \\"fox\\", \\"2nd\\", \\"jump\\"]\`\\n\\n4. Porter stemming\\n→ \`[\\"quick\\", \\"brown\\", \\"fox\\", \\"2nd\\", \\"jump\\"]\`"}, {"title": "Final tokens indexed", "content": "Same form for \\"jumps\\", \\"jumping\\", \\"jumped\\"\\n→ consistent retrieval"}]}
\`\`\`

## Collection Statistics for Relevance

The index also keeps global numbers that power TF-IDF and BM25:

\`\`\`calculator
{"type": "compound-interest", "title": "IDF Impact Calculator", "inputs": [{"id": "N", "label": "Total documents (N)", "default": 1000000, "min": 1000, "max": 10000000}, {"id": "df", "label": "Document frequency (DF)", "default": 5200, "min": 1, "max": 1000000}], "formula": "Math.log(N / df)"}
\`\`\`

Example values (N = 1 000 000):

| Term      | DF    | IDF = log(N/DF) | Interpretation |
|-----------|-------|-----------------|----------------|
| "the"     | 950 k | 0.02            | near-zero value |
| "quick"   | 5.2 k | 5.26            | moderate rarity |
| "quetzal" | 12    | 11.3            | very rare, high value |

## Index Storage Format

Modern engines store the inverted index in **immutable segments** on disk:

\`\`\`sysdiag
{"title": "Segment File Layout", "width": 600, "height": 300, "nodes": [{"id": "dict", "label": "Term Dictionary\\n(sorted terms)", "x": 80, "y": 60, "kind": "storage"}, {"id": "post", "label": "Posting Lists\\n(compressed)", "x": 220, "y": 60, "kind": "storage"}, {"id": "fields", "label": "Stored Fields\\n(_source)", "x": 360, "y": 60, "kind": "storage"}, {"id": "dv", "label": "DocValues\\n(columnar)", "x": 80, "y": 180, "kind": "storage"}, {"id": "norms", "label": "Norms\\n(length, boost)", "x": 220, "y": 180, "kind": "storage"}], "edges": [{"from": "dict", "to": "post", "label": "offset ptr"}, {"from": "fields", "to": "dv", "label": "aggregations"}], "annotations": {"dict": "Binary-searchable list of unique terms with file offsets to posting lists", "post": "Delta-encoded & variable-byte compressed arrays of doc IDs, TF, positions", "fields": "Original JSON/doc fields returned in search results", "dv": "Row-oriented data for fast sorting, faceting, SQL GROUP BY", "norms": "Per-field length and index-time boost factors used in scoring"}}
\`\`\`

## Compression in Action

Posting lists can be enormous. Delta + variable-byte encoding shrinks them dramatically:

\`\`\`trace
{"title": "Compression Trace", "language": "python", "code": "def compress(ids):\\n    \\"\\"\\"Delta + VByte encode a sorted list of doc IDs\\"\\"\\"\\n    deltas = [ids[0]]          # first ID is stored raw\\n    for i in range(1, len(ids)):\\n        deltas.append(ids[i] - ids[i-1])\\n    \\n    def vbyte(x):\\n        \\"\\"\\"Variable-byte encode one integer\\"\\"\\"\\n        bytes_ = []\\n        while x >= 128:\\n            bytes_.append((x & 0x7F) | 0x80)\\n            x >>= 7\\n        bytes_.append(x)\\n        return bytes_\\n    \\n    compressed = []\\n    for d in deltas:\\n        compressed.extend(vbyte(d))\\n    return compressed\\n\\nraw = [1, 5, 12, 100, 101, 500]\\nprint('raw:', raw)\\nprint('delta:', [raw[0]] + [raw[i]-raw[i-1] for i in range(1, len(raw))])\\nprint('compressed bytes:', compress(raw))\\nprint('ratio: 6*4 = 24 bytes →', len(compress(raw)), 'bytes')", "frames": [{"line": 1, "vars": {"ids": [1, 5, 12, 100, 101, 500]}, "note": "Start with sorted doc IDs"}, {"line": 3, "vars": {"deltas": [1, 4, 7, 88, 1, 399]}, "note": "Delta encoding: store gaps"}, {"line": 14, "vars": {"compressed": [1, 4, 7, 88, 1, 143, 3]}, "note": "VByte: 399 = 143 + 3·128 → 2 bytes"}, {"line": 19, "stdout": "ratio: 6*4 = 24 bytes → 7 bytes", "note": "71 % reduction on tiny list; terabytes saved at web scale"}], "speed": 900}
\`\`\`

## Quiz

\`\`\`quiz
{"title": "Check Your Understanding", "questions": [{"question": "Why is an inverted index termed \\"inverted\\"?", "options": ["It stores documents upside-down", "It reverses the document→word mapping", "It sorts terms in reverse alphabetical order", "It inverts bit patterns for compression"], "answer": 1, "explanation": "A forward index maps documents to their words; an inverted index maps words back to the documents that contain them."}, {"question": "Which posting-list enrichment is REQUIRED to support exact-phrase queries?", "options": ["Term frequency (TF)", "Position offsets", "Field name", "Payload boost"], "answer": 1, "explanation": "Positions let the engine verify that terms appear adjacently or within the specified slop window."}, {"question": "Delta encoding compresses posting lists by:", "options": ["Storing XOR differences between term hashes", "Storing numeric gaps between successive doc IDs", "Replacing integers with UTF-8 strings", "Using Huffman codes on term text"], "answer": 1, "explanation": "Because doc IDs are sorted, storing gaps (deltas) yields small numbers that variable-byte codes can compress tightly."}]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": ["An inverted index maps each unique term to a sorted list of documents (posting list) enabling O(log P) lookup instead of O(N·L) scan", "Posting lists can be enriched with TF, positions, and field info to support scoring, phrase search, and weighted retrieval", "The analyzer pipeline (tokenizers + filters) normalizes text into consistent tokens, determining both recall and index size", "Global statistics (N, DF) stored in the index power relevance models like TF-IDF and BM25", "Delta + variable-byte compression on immutable segments gives both space savings and fast disk I/O at billion-document scale"]}
\`\`\``,
    },
    {
      id: "search-sharding",
      slug: "search-sharding",
      title: "Distributed Indexing & Sharding",
      content: `# Distributed Indexing & Sharding

A single machine cannot hold the index for billions of documents. Distributed search engines split the index across many nodes. The two fundamental strategies are **document partitioning** and **term partitioning**.

## Document Partitioning (Preferred)

Each shard holds the complete inverted index for a **subset of documents**. A query is sent to all shards, and results are merged.

\`\`\`
Document Partitioning
======================

Documents: doc_1 through doc_9

Shard 1: docs [1, 2, 3]    Shard 2: docs [4, 5, 6]    Shard 3: docs [7, 8, 9]
+------------------+        +------------------+        +------------------+
| Inverted Index   |        | Inverted Index   |        | Inverted Index   |
| "fox" -> [1, 2]  |        | "fox" -> [4]     |        | "fox" -> [8, 9]  |
| "dog" -> [1, 3]  |        | "dog" -> [5, 6]  |        | "dog" -> [7]     |
| "cat" -> [2]     |        | "cat" -> [4, 6]  |        | "cat" -> [9]     |
+------------------+        +------------------+        +------------------+

Query: "fox"
  --> Send to ALL shards in parallel
  --> Shard 1: [1, 2]     score: [0.8, 0.5]
  --> Shard 2: [4]        score: [0.7]
  --> Shard 3: [8, 9]     score: [0.9, 0.3]
  --> Coordinator merges: [8, 1, 4, 2, 9] (sorted by score)
\`\`\`

**Pros:**
- Each shard is a self-contained index (simple)
- Indexing is straightforward: route document to one shard
- If a shard is down, only a fraction of docs are unavailable

**Cons:**
- Every query must hit every shard (scatter-gather)
- IDF statistics are local to each shard (can cause scoring inconsistencies)

This is what Elasticsearch and Solr use.

## Term Partitioning

Each shard holds the complete posting list for a **subset of terms**. A query is routed only to the shards that own the query terms.

\`\`\`
Term Partitioning
==================

Shard 1: terms [a-f]       Shard 2: terms [g-p]       Shard 3: terms [q-z]
+------------------+        +------------------+        +------------------+
| "brown" -> [1,2] |        | "jump" -> [1,5]  |        | "quick" -> [1,2] |
| "cat" -> [2,4,9] |        | "lazy" -> [1,3]  |        | "run" -> [3,7]   |
| "dog" -> [1,3,7] |        | "over" -> [1]    |        | "sleep" -> [3]   |
| "fox" -> [1,2,8] |        |                  |        |                  |
+------------------+        +------------------+        +------------------+

Query: "quick fox"
  "quick" --> Shard 3
  "fox"   --> Shard 1
  Only 2 shards queried (not all 3)
  Must intersect results from different shards
\`\`\`

**Pros:**
- Single-term queries hit only one shard (efficient)
- Global IDF statistics within each term's shard

**Cons:**
- Multi-term queries require cross-shard coordination
- Indexing one document touches multiple shards (expensive)
- Rebalancing is much harder (terms have variable popularity)

Term partitioning is rarely used in practice due to these drawbacks.

## Shard Routing

\`\`\`
Document Routing to Shards
============================

Default: hash-based routing
  shard_id = hash(doc_id) % num_shards

Custom routing (e.g., by tenant):
  shard_id = hash(tenant_id) % num_shards
  All docs for tenant_X on the same shard
  Query for tenant_X hits only one shard (much faster)

Elasticsearch routing formula:
  shard = hash(_routing) % number_of_primary_shards

WARNING: number_of_primary_shards is FIXED at index creation.
         Cannot be changed without full reindex.
\`\`\`

## Shard Rebalancing

When adding nodes, shards must be redistributed:

\`\`\`
Shard Rebalancing
==================

Before: 2 nodes, 6 shards
  Node A: [S0, S1, S2]
  Node B: [S3, S4, S5]

Add Node C:
  Node A: [S0, S1]          (gave S2 to C)
  Node B: [S3, S4]          (gave S5 to C)
  Node C: [S2, S5]          (received from A and B)

Each shard is a self-contained unit:
  1. Copy shard data to new node
  2. Update cluster routing table
  3. New node starts serving queries for that shard
  4. Old node releases shard data

No re-indexing needed -- just data movement.
\`\`\`

## Replica Shards

Each primary shard has one or more replica shards for fault tolerance and read throughput:

\`\`\`
Primary + Replica Shards
==========================

Index "products" with 3 primary shards, 1 replica each:

Node 1:  [P0] [R1] [R2]
Node 2:  [R0] [P1] [R2']
Node 3:  [R0'] [R1'] [P2]

P = Primary (accepts writes)
R = Replica (serves reads, receives updates from primary)

Rules:
  - A replica is NEVER on the same node as its primary
  - Writes go to the primary, then replicated to replicas
  - Reads can be served by primary OR any replica
  - If a node fails, replicas on other nodes are promoted
\`\`\`

## Query Execution: Scatter-Gather

\`\`\`
Scatter-Gather Query Flow
===========================

Client --> Coordinator Node
              |
              +--> Shard 0 (any replica): "search for 'fox'"
              +--> Shard 1 (any replica): "search for 'fox'"
              +--> Shard 2 (any replica): "search for 'fox'"
              |
              <-- Shard 0: [(doc_1, 0.8), (doc_2, 0.5)]
              <-- Shard 1: [(doc_4, 0.7)]
              <-- Shard 2: [(doc_8, 0.9)]
              |
              Merge + sort by score:
              [(doc_8, 0.9), (doc_1, 0.8), (doc_4, 0.7), (doc_2, 0.5)]
              |
              Return top 10 to client

Optimization: Two-phase fetch
  Phase 1: Each shard returns only (doc_id, score) -- lightweight
  Phase 2: Coordinator asks specific shards for full documents
           (only for the top 10 results)
\`\`\`

## Key Takeaway

Document partitioning is the standard approach for distributed search. Each shard is a complete mini search engine for a subset of documents. Queries are scattered to all shards and results are gathered and merged by a coordinator. Replica shards provide fault tolerance and read scaling. The fixed shard count at index creation is an important constraint -- plan shard count carefully based on expected data volume.`,
    },
    {
      id: "search-scoring",
      slug: "search-scoring",
      title: "Query Processing & Scoring",
      content: `# Query Processing & Scoring

When a user types a query, the search engine must decide which documents match and how to rank them. Scoring algorithms like **TF-IDF** and **BM25** compute a relevance score for each document based on how well it matches the query.

\`\`\`concept
{
  "title": "TF-IDF Intuition",
  "variant": "mental-model",
  "content": "Imagine a library with millions of books. A word like \\"the\\" appears everywhere, so finding it doesn't help you find relevant books. But a word like \\"photosynthesis\\" is rare — if it appears in a book, that book is probably very relevant to your biology query. TF-IDF captures this intuition: common words within a document (high TF) are good, but common words across all documents (low IDF) are weak signals."
}
\`\`\`

## Term Frequency - Inverse Document Frequency (TF-IDF)

TF-IDF is the foundation of text relevance scoring. It combines two intuitions:

1. **Term Frequency (TF):** A term that appears more often in a document is more relevant to that document
2. **Inverse Document Frequency (IDF):** A term that appears in fewer documents is more discriminating

\`\`\`playground
{
  "title": "TF-IDF Calculator",
  "language": "python",
  "code": "import math\\n\\ndef tf_idf(term, document, collection_size, doc_frequency):\\n    # Term Frequency (normalized)\\n    words = document.split()\\n    tf = words.count(term) / len(words)\\n    \\n    # Inverse Document Frequency\\n    idf = math.log(collection_size / doc_frequency)\\n    \\n    # TF-IDF Score\\n    return tf * idf\\n\\n# Example: Query \\"quick fox\\" against doc_1\\ndoc_1 = \\"the quick brown fox jumps over the quick lazy fox\\"\\ncollection_size = 1_000_000\\n\\nquick_score = tf_idf(\\"quick\\", doc_1, collection_size, 5200)\\nfox_score = tf_idf(\\"fox\\", doc_1, collection_size, 1800)\\n\\nprint(f\\"TF-IDF('quick', doc_1) = {quick_score:.2f}\\")\\nprint(f\\"TF-IDF('fox', doc_1) = {fox_score:.2f}\\")\\nprint(f\\"Total score = {quick_score + fox_score:.2f}\\")",
  "runnable": true
}
\`\`\`

## BM25 (Best Matching 25)

BM25 is the **industry-standard** scoring algorithm. It improves on TF-IDF with two refinements:

1. **Term frequency saturation:** Diminishing returns -- the 10th occurrence of a term matters less than the 2nd
2. **Document length normalization:** Longer documents are penalized (they match more terms by chance)

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "TF-IDF: Linear Growth",
    "code": "# TF-IDF: Score grows linearly with term frequency\\n# TF=1 → score=1.0\\n# TF=2 → score=2.0  \\n# TF=10 → score=10.0\\n# Problem: 100th occurrence shouldn't matter 100x more than 1st"
  },
  "after": {
    "label": "BM25: Saturation Curve",
    "code": "# BM25: Score saturates with term frequency\\n# TF=1 → score=1.0\\n# TF=2 → score=1.5\\n# TF=10 → score=2.1\\n# TF=100 → score=2.2\\n# Better: Later occurrences add minimal value"
  }
}
\`\`\`

\`\`\`algoviz
{
  "title": "BM25 Saturation Effect",
  "type": "array",
  "data": [1.0, 1.5, 1.7, 1.8, 1.9, 2.0, 2.05, 2.08, 2.1, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16],
  "frames": [
    {"highlight": [0], "label": "TF=1: score=1.0", "stats": {"tf": 1, "score": 1.0}},
    {"highlight": [1], "label": "TF=2: score=1.5 (50% increase)", "stats": {"tf": 2, "score": 1.5}},
    {"highlight": [4], "label": "TF=5: score=1.9 (diminishing returns)", "stats": {"tf": 5, "score": 1.9}},
    {"highlight": [9], "label": "TF=10: score=2.1 (minimal gain)", "stats": {"tf": 10, "score": 2.1}},
    {"highlight": [14], "label": "TF=100: score≈2.2 (plateau)", "stats": {"tf": 100, "score": 2.16}}
  ],
  "speed": 1000
}
\`\`\`

## Boolean Queries

Before scoring, the engine must determine which documents match the query:

\`\`\`trace
{
  "title": "Posting List Intersection",
  "language": "python",
  "code": "def intersect_lists(list_a, list_b):\\n    \\"\\"\\"Efficient merge join on sorted posting lists\\"\\"\\"\\n    result = []\\n    i = j = 0\\n    \\n    while i < len(list_a) and j < len(list_b):\\n        if list_a[i] == list_b[j]:\\n            result.append(list_a[i])\\n            i += 1\\n            j += 1\\n        elif list_a[i] < list_b[j]:\\n            i += 1\\n        else:\\n            j += 1\\n    \\n    return result\\n\\n# Example: \\"quick AND fox\\"\\nquick_posts = [1, 2, 5, 8, 12]\\nfox_posts = [1, 3, 5, 9, 12]\\n\\nmatches = intersect_lists(quick_posts, fox_posts)\\nprint(f\\"Documents matching 'quick AND fox': {matches}\\")\\nprint(f\\"Time complexity: O({len(quick_posts)} + {len(fox_posts)}) = O({len(quick_posts) + len(fox_posts)})\\")",
  "frames": [
    {"line": 1, "vars": {"list_a": "[1, 2, 5, 8, 12]", "list_b": "[1, 3, 5, 9, 12]", "i": 0, "j": 0}, "note": "Initialize pointers at start of both lists"},
    {"line": 6, "vars": {"list_a[0]": 1, "list_b[0]": 1, "i": 0, "j": 0}, "note": "Both point to doc 1 - MATCH!"},
    {"line": 7, "vars": {"result": "[1]", "i": 1, "j": 1}, "note": "Add doc 1 to results, advance both pointers"},
    {"line": 14, "vars": {"list_a[1]": 2, "list_b[1]": 3, "i": 1, "j": 1}, "note": "2 < 3, advance pointer i"},
    {"line": 14, "vars": {"list_a[2]": 5, "list_b[2]": 5, "i": 2, "j": 2}, "note": "Both point to doc 5 - MATCH!"},
    {"line": 7, "vars": {"result": "[1, 5]", "i": 3, "j": 3}, "note": "Add doc 5, advance both"},
    {"line": 14, "vars": {"list_a[3]": 8, "list_b[3]": 9, "i": 3, "j": 3}, "note": "8 < 9, advance pointer i"},
    {"line": 14, "vars": {"list_a[4]": 12, "list_b[4]": 12, "i": 4, "j": 4}, "note": "Both point to doc 12 - MATCH!"},
    {"line": 11, "vars": {"result": "[1, 5, 12]"}, "note": "Final result: documents 1, 5, and 12"}
  ],
  "speed": 1200
}
\`\`\`

## Phrase Queries

Phrase queries like "quick brown fox" require terms to appear adjacently and in order:

\`\`\`callout
{
  "type": "warning",
  "title": "Positional Data Required",
  "content": "Without storing term positions in the index, phrase queries are impossible. The inverted index must include positional information: \\"fox\\" appears at positions [3, 9] in document 1, not just that it appears in document 1."
}
\`\`\`

## Multi-Field Scoring

Documents have multiple fields (title, body, tags) with different importance:

\`\`\`quiz
{
  "title": "Multi-Field Scoring",
  "questions": [
    {
      "question": "A query matches in the title field (boost=3.0) with BM25 score 2.0, and in the body field (boost=1.0) with BM25 score 3.0. Which document scores higher?",
      "options": ["Title match document scores 6.0", "Body match document scores 3.0", "Both score equally", "Cannot determine"],
      "answer": 0,
      "explanation": "Title match: 2.0 × 3.0 = 6.0. Body match: 3.0 × 1.0 = 3.0. The title match wins despite lower raw BM25 score because title matches are more important."
    },
    {
      "question": "Why does BM25 include document length normalization?",
      "options": ["Longer documents have more unique words", "Longer documents match more terms by chance", "Shorter documents are always better", "To favor PDF documents"],
      "answer": 1,
      "explanation": "Longer documents naturally contain more terms, so they would score higher for most queries without normalization. BM25 penalizes longer documents to account for this statistical bias."
    },
    {
      "question": "What happens to BM25 score as term frequency increases from 1 to 100?",
      "options": ["Linear growth", "Exponential growth", "Rapid growth then saturation", "No change"],
      "answer": 2,
      "explanation": "BM25 shows diminishing returns - the score increases rapidly at first (TF=1→2: +50%) but plateaus (TF=10→100: +5%). This prevents 100 occurrences from being 100x more important than 1."
    }
  ]
}
\`\`\`

## Query Processing Pipeline

\`\`\`steps
{
  "title": "Query Processing Flow",
  "steps": [
    {
      "title": "Query Analysis",
      "content": "Tokenize, lowercase, and stem the query. Apply the same pipeline as indexing to ensure \\"Running\\" matches \\"running\\" in the index."
    },
    {
      "title": "Query Planning",
      "content": "Look up posting lists for each term. Estimate costs based on list lengths. Choose execution strategy: process short lists first for AND queries."
    },
    {
      "title": "Boolean Operations",
      "content": "Intersect/union posting lists using merge join. For phrase queries, verify positional constraints on candidate documents."
    },
    {
      "title": "Scoring",
      "content": "Calculate BM25 scores for matching documents. Apply field boosts for multi-field queries."
    },
    {
      "title": "Top-K Selection",
      "content": "Use priority queue to keep only highest-scoring documents. Return results with scores and snippets."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "BM25 is the industry standard (Elasticsearch, Solr, Lucene) because it improves TF-IDF with term frequency saturation and document length normalization",
    "Boolean operations on posting lists use efficient O(n+m) merge joins on sorted lists",
    "Phrase queries require positional data in the inverted index to verify adjacent term occurrences",
    "Multi-field scoring applies field-specific boosts (title > tags > body) to reflect semantic importance",
    "Query analyzer must apply identical tokenization pipeline as indexer for matching to work correctly"
  ]
}
\`\`\``,
      starterCode: `# Inverted Index with TF-IDF Scoring
# Build a simple search engine that indexes documents and
# ranks search results by TF-IDF relevance score.

import math
import re
from collections import defaultdict

# Common English stop words to filter out
STOP_WORDS = {"the", "a", "an", "is", "are", "was", "were", "in", "on",
              "at", "to", "for", "of", "and", "or", "not", "it", "this",
              "that", "with", "as", "by", "from", "be", "has", "had"}


class InvertedIndex:
    def __init__(self):
        self.index = defaultdict(list)    # term -> [(doc_id, tf), ...]
        self.doc_count = 0                 # total documents indexed
        self.doc_lengths = {}              # doc_id -> number of terms
        self.documents = {}                # doc_id -> original text

    def _tokenize(self, text: str) -> list:
        """
        Tokenize text: lowercase, split on non-alphanumeric,
        remove stop words.
        """
        # TODO: Implement tokenization pipeline
        # 1. Lowercase the text
        # 2. Split into words (alphanumeric only)
        # 3. Remove stop words
        # 4. Return list of tokens
        pass

    def index_document(self, doc_id: str, text: str):
        """Add a document to the inverted index."""
        # TODO: Implement indexing
        # 1. Tokenize the text
        # 2. Calculate term frequency for each token
        # 3. Store (doc_id, tf) in the posting list for each term
        # 4. Track document length and count
        pass

    def _tf(self, term_count: int, doc_length: int) -> float:
        """Calculate term frequency: count / doc_length."""
        # TODO: Implement TF calculation
        pass

    def _idf(self, term: str) -> float:
        """Calculate inverse document frequency: log(N / df)."""
        # TODO: Implement IDF calculation
        # df = number of documents containing the term
        # Return log(total_docs / df)
        pass

    def search(self, query: str, top_k: int = 5) -> list:
        """
        Search the index and return top-k results ranked by TF-IDF.
        Returns: [(doc_id, score), ...]
        """
        # TODO: Implement search
        # 1. Tokenize the query
        # 2. For each query term, look up its posting list
        # 3. For each document in the posting list:
        #    score += tf * idf
        # 4. Sort by score descending
        # 5. Return top_k results
        pass


# Test your implementation
if __name__ == "__main__":
    idx = InvertedIndex()

    # Index some documents
    docs = {
        "doc1": "The quick brown fox jumps over the lazy dog",
        "doc2": "The fox is quick and brown",
        "doc3": "A lazy dog sleeps in the sun",
        "doc4": "Quick brown foxes are hard to catch",
        "doc5": "The dog chased the fox through the brown forest",
        "doc6": "Distributed systems handle large scale data processing",
        "doc7": "Inverted indexes power search engines at scale",
        "doc8": "The brown fox and the lazy dog are friends",
    }

    for doc_id, text in docs.items():
        idx.index_document(doc_id, text)

    print(f"Indexed {idx.doc_count} documents")
    print(f"Vocabulary size: {len(idx.index)} terms")
    print()

    # Test searches
    queries = ["quick brown fox", "lazy dog", "distributed systems", "fox dog"]
    for query in queries:
        results = idx.search(query, top_k=3)
        print(f'Query: "{query}"')
        for doc_id, score in results:
            print(f"  {doc_id} (score: {score:.3f}): {idx.documents[doc_id]}")
        print()
`,
      solutionCode: `# Inverted Index with TF-IDF Scoring - Solution

import math
import re
from collections import defaultdict

STOP_WORDS = {"the", "a", "an", "is", "are", "was", "were", "in", "on",
              "at", "to", "for", "of", "and", "or", "not", "it", "this",
              "that", "with", "as", "by", "from", "be", "has", "had"}


class InvertedIndex:
    def __init__(self):
        self.index = defaultdict(list)    # term -> [(doc_id, tf), ...]
        self.doc_count = 0
        self.doc_lengths = {}
        self.documents = {}

    def _tokenize(self, text: str) -> list:
        """Tokenize text: lowercase, split, remove stop words."""
        text = text.lower()
        words = re.findall(r'[a-z0-9]+', text)
        return [w for w in words if w not in STOP_WORDS]

    def index_document(self, doc_id: str, text: str):
        """Add a document to the inverted index."""
        self.documents[doc_id] = text
        tokens = self._tokenize(text)
        self.doc_lengths[doc_id] = len(tokens)
        self.doc_count += 1

        # Count term frequencies
        term_counts = defaultdict(int)
        for token in tokens:
            term_counts[token] += 1

        # Add to posting lists
        for term, count in term_counts.items():
            tf = count / len(tokens)
            self.index[term].append((doc_id, tf))

    def _tf(self, term_count: int, doc_length: int) -> float:
        """Calculate term frequency."""
        return term_count / doc_length if doc_length > 0 else 0

    def _idf(self, term: str) -> float:
        """Calculate inverse document frequency."""
        df = len(self.index.get(term, []))
        if df == 0:
            return 0
        return math.log(self.doc_count / df)

    def search(self, query: str, top_k: int = 5) -> list:
        """Search the index and return top-k results by TF-IDF."""
        query_tokens = self._tokenize(query)
        scores = defaultdict(float)

        for token in query_tokens:
            idf = self._idf(token)
            posting_list = self.index.get(token, [])
            for doc_id, tf in posting_list:
                scores[doc_id] += tf * idf

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return ranked[:top_k]


if __name__ == "__main__":
    idx = InvertedIndex()

    docs = {
        "doc1": "The quick brown fox jumps over the lazy dog",
        "doc2": "The fox is quick and brown",
        "doc3": "A lazy dog sleeps in the sun",
        "doc4": "Quick brown foxes are hard to catch",
        "doc5": "The dog chased the fox through the brown forest",
        "doc6": "Distributed systems handle large scale data processing",
        "doc7": "Inverted indexes power search engines at scale",
        "doc8": "The brown fox and the lazy dog are friends",
    }

    for doc_id, text in docs.items():
        idx.index_document(doc_id, text)

    print(f"Indexed {idx.doc_count} documents")
    print(f"Vocabulary size: {len(idx.index)} terms")
    print()

    queries = ["quick brown fox", "lazy dog", "distributed systems", "fox dog"]
    for query in queries:
        results = idx.search(query, top_k=3)
        print(f'Query: "{query}"')
        for doc_id, score in results:
            print(f"  {doc_id} (score: {score:.3f}): {idx.documents[doc_id]}")
        print()

    # Show posting list for a term
    print("Posting list for 'fox':")
    for doc_id, tf in idx.index["fox"]:
        print(f"  {doc_id}: tf={tf:.3f}")

    print(f"\\nIDF('fox') = {idx._idf('fox'):.3f}")
    print(f"IDF('distributed') = {idx._idf('distributed'):.3f}")
`,
    },
    {
      id: "search-realtime",
      slug: "search-realtime",
      title: "Real-time Indexing Pipeline",
      content: `# Real-time Indexing Pipeline

Users expect new content to be searchable within seconds. A search engine must continuously ingest new documents, update the inverted index, and make changes visible to queries — all without disrupting ongoing searches.

\`\`\`concept
{"title": "The Real-time Trade-off", "variant": "insight", "content": "Real-time indexing prioritizes low latency (seconds or milliseconds) over resource efficiency. Achieving this immediacy demands high-performance compute and storage, increasing infrastructure costs compared to batch indexing. The design goal is \\"near-real-time\\" (NRT), not zero latency."}
\`\`\`

## The Challenge

Inverted indexes are optimized for reads, not writes. Updating a posting list for every new document would require rewriting large portions of the index on disk. The solution is to use **immutable segments** with periodic **merging**.

\`\`\`compare
{"variant": "before-after", "before": {"label": "Naïve In-Place Update", "code": "# Every new doc triggers random I/O\\nfor term in doc.terms:\\n    posting = disk.read(term)        # [1, 5, 12, 88, 200]\\n    posting.append(doc.id)           # [1, 5, 12, 88, 200, 201]\\n    disk.write(term, posting)        # rewrite entire list"}, "after": {"label": "Segment-Based Append", "code": "# Docs buffered in memory, flushed as new segment\\nbuffer = []                          # RAM, mutable\\nbuffer.append(doc)                   # O(1) append\\n# every N docs or M seconds:\\nsegment = flush(buffer)              # sequential write\\ndisk.append(segment)                 # immutable file"}}
\`\`\`

## Segment-Based Architecture

Inspired by Lucene (used by Elasticsearch and Solr), the index consists of multiple immutable segments:

\`\`\`algoviz
{"title": "Segment Layout Over Time", "type": "array", "data": ["buf", "S0", "S1", "S2"], "frames": [
  {"highlight": [0], "label": "T=0: new docs land in mutable buffer", "stats": {"buf": 3}},
  {"highlight": [0, 3], "label": "T=1: buffer flushed → new segment S3", "stats": {"buf": 0}},
  {"highlight": [0], "label": "T=1.1: fresh buffer accepts more docs", "stats": {"buf": 2}}
], "speed": 1200}
\`\`\`

Search = query **all** segments + merge results.

## The Refresh Cycle

The **refresh interval** controls how quickly new documents become searchable (Elasticsearch default: 1 second):

\`\`\`steps
{"title": "1-Second Refresh Cycle", "steps": [
  {"title": "0.0 s", "content": "doc_201 arrives → appended to in-memory buffer"},
  {"title": "0.3 s", "content": "doc_202 arrives → appended to same buffer"},
  {"title": "0.7 s", "content": "doc_203 arrives → buffer now holds 3 docs"},
  {"title": "1.0 s", "content": "REFRESH: buffer converted to **new segment S_new**, buffer cleared, docs 201-203 become searchable"},
  {"title": "1.1 s", "content": "Query executes across [S0, S1, S2, S_new] and finds the three new docs"}
]}
\`\`\`

This is **near-real-time** (NRT) search — not truly instantaneous, but acceptable for most products.

## Segment Merging

Over time, many small segments accumulate. Searching across hundreds of segments is slow. Background **merge** operations combine small segments into larger ones:

\`\`\`algoviz
{"title": "Tiered Merge Policy", "type": "array", "data": [50, 50, 50, 50, 12, 8, 15], "frames": [
  {"highlight": [4, 5, 6], "label": "Pick smallest segments (≤ 20 docs each)", "stats": {"merge": "S4+S5+S6"}},
  {"highlight": [4], "label": "Write merged 35-doc segment S7", "stats": {"new": "S7"}},
  {"highlight": [0, 1, 2, 3], "label": "Eventually merge big tiers into 200-doc S8", "stats": {"new": "S8"}}
], "speed": 1000}
\`\`\`

Merge steps:
1. Read posting lists from all source segments  
2. Merge-sort posting lists for each term  
3. Write new combined segment  
4. Swap new segment in, delete old segments  
5. Old segments removed only after **all in-flight queries complete**

## Handling Deletes and Updates

Since segments are immutable, deletes use a **tombstone** approach:

\`\`\`callout
{"type": "warning", "title": "Deletes Are Logical, Not Physical", "content": "A deleted document still occupies disk space until the next merge. Queries filter it out via a live-docs bitset, so results remain correct but slightly slower."}
\`\`\`

## Write-Ahead Log (Translog)

The in-memory buffer is volatile. A crash would lose unflushed documents. A **transaction log** (translog) provides durability:

\`\`\`trace
{"title": "Durability with Translog", "language": "python", "code": "def index_doc(doc):\\n    translog.append(doc)      # fsync’d before ACK\\n    buffer.add(doc)\\n    return 'ok'\\n\\ndef crash_recovery():\\n    segments = load_from_disk()\\n    replay(translog)          # rebuild buffer\\n    return segments + buffer", "frames": [
  {"line": 1, "vars": {"doc": "doc_201"}, "note": "client sends doc_201"},
  {"line": 2, "vars": {"translog": "[doc_201]"}, "stdout": "fsync\\n"},
  {"line": 3, "vars": {"buffer": "[doc_201]"}, "note": "volatile memory"},
  {"line": 4, "stdout": "ok\\n"},
  {"line": 7, "vars": {"segments": "[S0,S1,S2]", "buffer": "[doc_201]"}, "note": "after crash, buffer rebuilt from translog"}
], "speed": 800}
\`\`\`

Flush vs. Refresh:
- **Refresh**: buffer → searchable segment (in memory/OS cache); translog **not** truncated  
- **Flush**: segment → fsync’d to disk; translog truncated (no longer needed)

## Indexing Pipeline Architecture

\`\`\`sysdiag
{"title": "End-to-End Ingestion Flow", "width": 720, "height": 400, "nodes": [
  {"id": "src", "label": "Data Sources", "x": 60, "y": 60, "kind": "client"},
  {"id": "mq", "label": "Kafka", "x": 180, "y": 60, "kind": "queue"},
  {"id": "work", "label": "Indexing Workers", "x": 320, "y": 60, "kind": "service"},
  {"id": "primary", "label": "Shard Primary", "x": 480, "y": 100, "kind": "db"},
  {"id": "repl", "label": "Replica Shards", "x": 620, "y": 100, "kind": "db"},
  {"id": "merge", "label": "Background Merge", "x": 550, "y": 280, "kind": "worker"}
], "edges": [
  {"from": "src", "to": "mq", "label": "events"},
  {"from": "mq", "to": "work", "label": "stream"},
  {"from": "work", "to": "primary", "label": "index"},
  {"from": "primary", "to": "repl", "label": "replicate"},
  {"from": "primary", "to": "merge", "label": "segments"}
], "annotations": {
  "mq": "buffers spikes & enables replay",
  "work": "parse, analyze, route by hash(doc_id)",
  "primary": "write translog + buffer, refresh every 1s",
  "merge": "tiered policy keeps segment count low"
}}
\`\`\`

\`\`\`quiz
{"title": "Check Your Understanding", "questions": [
  {"question": "Why are segments kept immutable?", "options": ["To speed up queries", "To avoid random I/O during writes", "To save disk space", "To simplify ranking"], "answer": 1, "explanation": "Immutable segments allow new data to be written with sequential I/O only; no in-place updates means no random disk seeks."},
  {"question": "What happens during a 'refresh' in Elasticsearch?", "options": ["Buffer is fsync’d to disk", "Translog is truncated", "Buffer becomes a new searchable segment", "Old segments are deleted"], "answer": 2, "explanation": "Refresh converts the in-memory buffer into a new segment that is opened for searching; disk fsync happens later during flush."},
  {"question": "How are deleted documents physically removed?", "options": ["Immediately on delete request", "During the next refresh", "During segment merge", "When translog is truncated"], "answer": 2, "explanation": "Deletes are logical (tombstone); the space is reclaimed only when segments are merged and a new segment without the dead docs is written."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Real-time search uses immutable segments and periodic refresh (default 1s) to balance latency vs. resource cost.",
  "New documents buffer in memory, flush as segments, and merge in the background to keep query performance high.",
  "Deletes/updates are handled via tombstones and resolved during merges; translog guarantees durability across crashes.",
  "The architecture—pioneered by Lucene—scales to thousands of docs/sec while maintaining sub-100ms queries."
]}
\`\`\``,
    },
    {
      id: "search-architecture",
      slug: "search-architecture",
      title: "Search Engine: Architecture Walkthrough",
      content: `# Search Engine: Architecture Walkthrough

Let us bring together all the components into a complete distributed search engine, inspired by Elasticsearch's architecture.

\`\`\`concept
{"title": "The Four Pillars of Distributed Search", "variant": "mental-model", "content": "Every distributed search engine rests on four pillars:\\n\\n1. **Inverted Index** – O(log V) term lookup instead of O(N) full scans\\n2. **BM25 Scoring** – Relevance ranking that beats TF-IDF in practice\\n3. **Document Sharding** – Horizontal scale via partitioned Lucene indices\\n4. **Segment Architecture** – Near-real-time ingestion with 1-second refreshes\\n\\nThe coordinator pattern (scatter-gather) ties these together: fan out every query, merge globally, return top-K."}
\`\`\`

## Complete Architecture

\`\`\`sysdiag
{"title": "Elasticsearch-Style Cluster Layout", "width": 720, "height": 420,
 "nodes": [
   {"id":"client","label":"Client","x":360,"y":30,"kind":"user"},
   {"id":"coord","label":"Coordinator\\n(any node)","x":360,"y":100,"kind":"service"},
   {"id":"n1","label":"Node 1\\nJVM + disks","x":120,"y":220,"kind":"storage"},
   {"id":"n2","label":"Node 2\\nJVM + disks","x":360,"y":220,"kind":"storage"},
   {"id":"n3","label":"Node 3\\nJVM + disks","x":600,"y":220,"kind":"storage"}
 ],
 "edges": [
   {"from":"client","to":"coord","label":"query"},
   {"from":"coord","to":"n1","label":"scatter"},
   {"from":"coord","to":"n2","label":"scatter"},
   {"from":"coord","to":"n3","label":"scatter"},
   {"from":"n1","to":"coord","label":"gather"},
   {"from":"n2","to":"coord","label":"gather"},
   {"from":"n3","to":"coord","label":"gather"}
 ],
 "annotations": {
   "coord": "Parses query, routes to shards, merges results",
   "n1": "logs-P0 (primary), logs-R1, prods-R0",
   "n2": "logs-P1 (primary), prods-P0 (primary)",
   "n3": "logs-P2 (primary), prods-P1 (primary), prods-R1"
 }}
\`\`\`

Each node runs a single JVM process that hosts multiple shards (Lucene indices). A shard can be **primary** (accepts writes) or **replica** (read-only copy). The coordinator role rotates—any node can coordinate a query.

## Write Path End-to-End

\`\`\`steps
{"title": "Indexing a Document", "steps": [
  {"title": "1. Client POST", "content": "Client sends \`POST /products/_doc/42\` with body \`{\\"name\\":\\"Widget\\",\\"price\\":9.99}\`"},
  {"title": "2. Coordinator Route", "content": "Coordinator hashes \`_id=42\` → \`shard = hash(42) % 2 = 0\`. Primary for \`prods-P0\` lives on Node 2."},
  {"title": "3. Primary Write", "content": "Node 2:\\n- Appends to translog (fsync)\\n- Analyzes: \`\\"Widget\\" → [\\"widget\\"]\`\\n- Adds to in-memory buffer\\n- ACKs coordinator"},
  {"title": "4. Replica Replication", "content": "Node 2 streams op to replica \`prods-R0\` on Node 1. Configurable \`wait_for_active_shards\` determines how many replicas must ACK before success."},
  {"title": "5. Refresh & Searchable", "content": "After 1 s (default refresh interval) the in-memory buffer is flushed to a new segment. Document 42 is now searchable."}
]}
\`\`\`

## Read Path End-to-End

\`\`\`trace
{"title": "Search for \\"widget\\"", "language": "python", "code": "# Client query: GET /products/_search?q=widget\\n# Coordinator (Node 2) logic\\n\\nquery  = {\\"match\\": {\\"name\\": \\"widget\\"}}\\nshards = [\\"prods-P0@Node2\\", \\"prods-P1@Node3\\"]  # one copy each\\n\\ndef scatter():\\n    futures = []\\n    for shard in shards:\\n        futures.append(async_search(shard, query))\\n    return await gather(futures)\\n\\ndef gather(results):\\n    merged = heapq.merge(*results, key=lambda x: -x.score)\\n    top_k  = merged[:10]          # global top-10\\n    docs   = fetch_sources(top_k) # multi-get\\n    return docs\\n\\n# Shard-local scoring (BM25)\\n# prods-P0 returns [(42, 8.3), (87, 5.1)]\\n# prods-P1 returns [(155, 7.2), (301, 4.8)]", "frames": [
  {"line": 1, "vars": {"query": {"match": {"name": "widget"}}}, "note": "Coordinator receives query", "stdout": ""},
  {"line": 6, "vars": {"shards": ["prods-P0@Node2", "prods-P1@Node3"]}, "note": "Scatter to one copy of each shard", "stdout": ""},
  {"line": 7, "vars": {"futures": ["async_obj_1", "async_obj_2"]}, "note": "Concurrent shard requests", "stdout": ""},
  {"line": 12, "vars": {"results": [["(42, 8.3)", "(87, 5.1)"], ["(155, 7.2)", "(301, 4.8)"]]}, "note": "Shard results arrive", "stdout": ""},
  {"line": 13, "vars": {"merged": ["(42, 8.3)", "(155, 7.2)", "(87, 5.1)", "(301, 4.8)"]}, "note": "Global merge by score", "stdout": ""},
  {"line": 14, "vars": {"top_k": ["(42, 8.3)", "(155, 7.2)", "(87, 5.1)"]}, "note": "Keep top-3 for demo", "stdout": ""},
  {"line": 15, "vars": {"docs": [{"_id": 42, "name": "Widget", "price": 9.99}, {"_id": 155, "name": "Widget Pro", "price": 19.99}, {"_id": 87, "name": "Blue Widget", "price": 7.5}]}, "note": "Fetch full source", "stdout": ""}
], "speed": 900}
\`\`\`

## Cluster Management

\`\`\`tabs
{"tabs": [
  {"label": "Master Election", "content": "Master-eligible nodes run Raft/Bully. A quorum (majority) is required to prevent split brain. The elected master publishes cluster state to all nodes via a diff protocol."},
  {"label": "Node Roles", "content": "| Role | Duty |\\n|---|---|\\n| **Master-eligible** | Can become master; lightweight, no data traffic |\\n| **Data** | Stores shards, runs Lucene, heavy CPU/IO |\\n| **Coordinator-only** | Smart load-balancer, no local shards |\\n| **Ingest** | Runs pipelines (normalize, enrich) before indexing |"},
  {"label": "Failure Detection", "content": "Gossip-style heartbeats. If a node misses 3 pings (≈ 3 × 500 ms) it is marked offline; master schedules re-allocation of its shards."}
]}
\`\`\`

## Fault Tolerance

\`\`\`compare
{"variant": "before-after", "before": {"label": "Node 2 crashes — data loss?", "code": "Node 2 (prods-P0 primary) disappears.\\nWrites to /products return 503.\\nCluster state RED?"}, "after": {"label": "Automatic recovery within seconds", "code": "Master promotes prods-R0 on Node 1 → new primary.\\nCluster state YELLOW (all primaries OK, missing replicas).\\nNew replica allocated on Node 3 → GREEN.\\nZero data lost thanks to translog + replica."}}
\`\`\`

## Performance Optimizations

\`\`\`callout
{"type": "tip", "title": "Shard Count Rule-of-Thumb", "content": "Start with **1–5 shards per node per index**. Over-sharding (>1000 shards per node) wastes heap; under-sharding leaves CPU idle. Resize with the split-shrine API before production."}
\`\`\`

1. **Query Cache** – Filter bitsets cached per segment; invalidated only when new segments appear.
2. **Field-data / Doc-values** – Columnar on-disk format loaded into OS page cache for aggregations.
3. **Adaptive Replica Selection** – Route to the replica with the lowest 1-minute latency history; avoids hot-spots.
4. **Index Sorting** – Pre-sort segments by \`timestamp\` to enable early-termination on \`TOP-K\` queries.

## Comparison with Other Search Systems

| Feature          | Elasticsearch | Apache Solr   | Meilisearch |
|------------------|---------------|---------------|-------------|
| Storage engine   | Lucene        | Lucene        | Custom      |
| Scoring          | BM25          | BM25          | Custom typo-tolerant |
| Distribution     | Built-in cluster | ZooKeeper | Single-node (v1) |
| Real-time search | 1 s refresh   | Soft/hard commit | Millisecond |
| Schema           | Dynamic mapping | Schema required | Schemaless |
| Primary use-case | Logs, analytics | Enterprise search | End-user typo-tolerant search |

\`\`\`quiz
{"title": "Architecture Check", "questions": [
  {"question": "Which node becomes the coordinator for a search request?", "options": ["The master node always", "A random data node", "Any node can volunteer", "The node that holds the most shards"], "answer": 2, "explanation": "Elasticsearch is peer-to-peer; any node can accept a client request and act as coordinator."},
  {"question": "What happens first during document indexing?", "options": ["Buffer flushed to segment", "Document analyzed", "Translog fsync", "Replica replication"], "answer": 1, "explanation": "The primary shard analyzes fields before writing to the in-memory buffer and translog."},
  {"question": "Why does the cluster enter YELLOW status after a node crash?", "options": ["Some primaries are missing", "Some replicas are missing", "Master is re-electing", "Translog is corrupted"], "answer": 1, "explanation": "YELLOW means all primary shards are assigned but one or more replicas are unassigned."}
]}
\`\`\`

\`\`\`takeaways
{"title": "Key Takeaways", "items": [
  "Inverted index + BM25 + sharding + segments = scalable relevance",
  "Coordinator scatter-gather gives every node a chance to help",
  "Translog + replicas guarantee durability even during crashes",
  "1-second refresh balances near-real-time search vs. segment merge cost"
]}
\`\`\``,
    },
  ],
};

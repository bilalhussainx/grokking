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
      content: `A search engine takes a user's query and returns the most relevant documents from a corpus of billions. Systems like Elasticsearch, Solr, and Google Search solve this at different scales, but all share the same core challenges: indexing documents efficiently, scoring relevance accurately, and returning results in milliseconds.

\`\`\`concept
{ "title": "Search is Not a Lookup", "variant": "mental-model", "content": "Full-text search over a large corpus is fundamentally different from key-value lookups. You cannot hash a query to find the answer. You must break documents into searchable tokens, match query terms across billions of documents, rank results by relevance (not just existence), and do all of this in under 100ms. The inverted index and relevance scoring are the two core primitives that make this possible — everything else is about scaling them." }
\`\`\`

## The Scale of the Problem

Before designing anything, internalize the numbers you're designing for:

| System | Indexed Documents | Query Volume | Latency Target |
|--------|-------------------|--------------|----------------|
| Google | ~100 billion pages | ~100,000 queries/sec | p99 < 200ms |
| Large Elasticsearch cluster | ~10 billion documents | ~50,000 queries/sec | p99 < 200ms |
| E-commerce search | 10–100 million products | ~10,000 queries/sec | p99 < 100ms |

These aren't aspirational numbers — they're the constraints that drive every architectural decision in this module.

## Functional Requirements

1. **Index(document)** — Ingest and index a new document
2. **Search(query)** — Return ranked documents matching the query
3. **Update(document)** — Re-index a modified document
4. **Delete(document_id)** — Remove a document from the index
5. Support for **full-text search**, **phrase queries**, **filters**, and **facets**
6. Support for **fuzzy matching** and **autocomplete suggestions**

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Index latency | < 1 second (near-real-time) |
| Query latency | < 100ms at p99 |
| Query throughput | 10,000+ queries/sec |
| Index throughput | 10,000+ docs/sec |
| Read availability | 99.99% |
| Scalability | Horizontal — add nodes to handle more data |
| Durability | No indexed document silently lost |

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "SQL LIKE Query (Don't do this)", "code": "-- Full table scan: O(N) for N documents\\nSELECT * FROM docs\\nWHERE body LIKE '%distributed systems%';\\n\\n-- Problems:\\n-- 1. No ranking: all matches are equally relevant\\n-- 2. No tokenization: 'distributing' won't match 'distributed'\\n-- 3. No stemming: 'running' won't match 'ran'\\n-- 4. No relevance: doc with 50 mentions = doc with 1 mention\\n-- 5. Won't scale past ~1M rows" }, "after": { "label": "Search Engine (Inverted Index)", "code": "-- O(1) posting-list lookup for each term\\nGET /index/_search\\n{\\n  \\"query\\": {\\n    \\"match\\": { \\"body\\": \\"distributed systems\\" }\\n  }\\n}\\n\\n-- Benefits:\\n-- 1. BM25 relevance scoring: frequency + document length\\n-- 2. Tokenization + stemming via analyzer pipeline\\n-- 3. Synonym expansion, stop-word removal\\n-- 4. Results in < 100ms over billions of documents\\n-- 5. Horizontal scale via sharding" } }
\`\`\`

## Core Building Blocks

\`\`\`steps
{ "title": "How a Search Engine Processes a Document", "steps": [ { "title": "Ingestion", "content": "Raw documents arrive from crawlers, event streams (Kafka), or direct API calls. Each document is assigned a unique ID and stored in durable storage before indexing begins. This separation ensures durability even if the indexer fails mid-way." }, { "title": "Analysis Pipeline", "content": "The analyzer transforms raw text into indexed tokens:\\n\\n\`\`\`\\n\\"The Quick Brown Fox!\\"\\n  → tokenize:   [\\"The\\", \\"Quick\\", \\"Brown\\", \\"Fox\\"]\\n  → lowercase:  [\\"the\\", \\"quick\\", \\"brown\\", \\"fox\\"]\\n  → stop words: [\\"quick\\", \\"brown\\", \\"fox\\"]\\n  → stemming:   [\\"quick\\", \\"brown\\", \\"fox\\"]\\n\`\`\`\\n\\nAnalyzers handle lowercase normalization, stop-word removal, stemming, synonym expansion, and language-specific rules." }, { "title": "Inverted Index Construction", "content": "For each token, the index records which documents contain it and where. The result is a **posting list**: a mapping from term → list of (docID, positions, frequency). This is the data structure that makes O(1) term lookup possible." }, { "title": "Scoring Metadata", "content": "Alongside the posting list, the engine stores per-document statistics needed for BM25 scoring: term frequency within the document, total document length, and the corpus-wide document frequency for each term. These feed directly into the ranking formula." }, { "title": "Query Processing & Ranking", "content": "At query time: tokenize the query using the same analyzer, retrieve posting lists for each term, compute BM25 scores, and merge results. The ranked list is returned to the user, typically with snippet highlighting." } ] }
\`\`\`

\`\`\`sysdiag
{ "title": "Search Engine: Component Overview", "width": 680, "height": 380, "nodes": [ { "id": "docs", "label": "Documents", "x": 60, "y": 180, "kind": "client" }, { "id": "analyzer", "label": "Analyzer\\nPipeline", "x": 200, "y": 100, "kind": "service" }, { "id": "index", "label": "Inverted\\nIndex", "x": 360, "y": 100, "kind": "store" }, { "id": "query", "label": "Query\\nProcessor", "x": 360, "y": 260, "kind": "service" }, { "id": "scorer", "label": "BM25\\nScorer", "x": 510, "y": 180, "kind": "service" }, { "id": "results", "label": "Ranked\\nResults", "x": 620, "y": 180, "kind": "client" } ], "edges": [ { "from": "docs", "to": "analyzer", "label": "raw text" }, { "from": "analyzer", "to": "index", "label": "tokens" }, { "from": "query", "to": "index", "label": "lookup" }, { "from": "index", "to": "scorer", "label": "posting lists" }, { "from": "scorer", "to": "results", "label": "ranked docs" } ], "annotations": { "analyzer": "Tokenizes, lowercases, stems, removes stop words, expands synonyms", "index": "Maps term → posting list (docID, freq, positions). O(1) lookup per term.", "scorer": "Computes BM25: balances term frequency against document length and corpus frequency", "query": "Tokenizes query with same analyzer used during indexing" } }
\`\`\`

## Why Not PostgreSQL or SQLite?

For small datasets (under ~1–5 million documents), PostgreSQL \`tsvector\` or SQLite FTS5 are legitimate choices — they use the same inverted index concept internally. But at 100M+ documents, you need:

- **Distributed sharding** — partition the index across N nodes so each holds only a fraction
- **Parallel query fan-out** — a coordinator broadcasts to all shards, merges partial results
- **Segment-based immutable writes** — Lucene-style write-once segments enable fast merges and concurrent reads without locking

This is the gap that Elasticsearch, Solr, and Vespa are designed to fill.

\`\`\`callout
{ "type": "info", "title": "Picking the Right Tool", "content": "**Small (< 5M docs):** Meilisearch, Typesense, or PostgreSQL FTS — simple setup, fast iteration.\\n\\n**Medium (5M–500M docs, facets, analytics):** Elasticsearch / OpenSearch + Kafka for ingestion, Redis for caching.\\n\\n**Large (500M–10B+ docs, ML ranking, hybrid search):** Vespa or Elasticsearch with vector support, Flink/Spark for feature pipelines, cross-encoder reranking.\\n\\nThis module focuses on the medium-to-large tier — the architecture that Elasticsearch implements." }
\`\`\`

\`\`\`quiz
{ "title": "Requirements & Problem Space — Check Your Understanding", "questions": [ { "question": "Why does a SQL LIKE query fail at search-engine scale?", "options": [ "It uses too much memory", "It performs a full table scan with no ranking or tokenization", "It cannot handle JOIN operations", "It is limited to 1,000 results" ], "answer": 1, "explanation": "LIKE performs an O(N) full table scan, returns no relevance ranking, and does no linguistic normalization (stemming, synonyms). An inverted index reduces term lookup to O(1) and supports BM25 scoring." }, { "question": "In a distributed search engine, what is the role of the front-end coordinator?", "options": [ "It stores the inverted index for a single shard", "It handles TLS termination only", "It receives user queries, fans them out to all index-holding nodes, and merges partial results", "It runs the BM25 scoring algorithm for all documents" ], "answer": 2, "explanation": "With document-partitioned indexes, any shard may hold matching terms. The coordinator (load balancer / query router) broadcasts the query to every partition and merges the ranked partial result sets." }, { "question": "What is the primary output of the analyzer pipeline during indexing?", "options": [ "A compressed binary snapshot of the document", "A mapping from document ID to raw text", "Normalized tokens used to build posting lists in the inverted index", "A BM25 score for every term in the corpus" ], "answer": 2, "explanation": "The analyzer pipeline tokenizes, lowercases, removes stop words, and stems the raw text. The resulting normalized tokens are inserted into the inverted index as posting list entries." }, { "question": "Which non-functional requirement drives the decision to use immutable Lucene-style segments rather than in-place updates?", "options": [ "Query latency — segments allow parallel reads without locking", "Storage cost — segments compress better than B-trees", "Availability — segments replicate over UDP", "Throughput — segments batch-write more efficiently than row stores" ], "answer": 0, "explanation": "Immutable write-once segments enable concurrent reads without any locking. Merges happen in the background. This architecture is the foundation of Lucene (used by Elasticsearch) and directly enables sub-100ms p99 query latency." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Full-text search is not key-value lookup — it requires tokenization, an inverted index, and relevance scoring (BM25/TF-IDF), none of which SQL LIKE provides.", "The analyzer pipeline (tokenize → lowercase → stop words → stem) must be applied identically at index time and query time, or queries will miss documents.", "A distributed search engine partitions the inverted index across N shards; a coordinator fans queries out to all shards and merges partial ranked results.", "The two core design primitives are the inverted index (O(1) term lookup via posting lists) and BM25 scoring (relevance ranking). All distributed complexity — sharding, replication, real-time ingestion — is about scaling these two ideas.", "Tool selection scales with corpus size: PostgreSQL FTS for < 5M docs, Elasticsearch/OpenSearch for medium scale, Vespa for 500M+ with ML ranking." ] }
\`\`\``,
    },
    {
      id: "search-inverted-index",
      slug: "search-inverted-index",
      title: "Inverted Index Design",
      content: `\`\`\`concept
{ "title": "The Inverted Index Mental Model", "variant": "mental-model", "content": "Think of a library catalog vs. a book's back-of-book index. The catalog (forward index) tells you what books exist. The back-of-book index tells you every page where a specific word appears. Search engines apply the same flip: instead of asking 'what words are in doc_1?', they ask 'which docs contain the word quick?' The inverted index answers that second question in milliseconds — without scanning every document." }
\`\`\`

The **inverted index** is the foundational data structure of every search engine, from Lucene to Elasticsearch to Google. Instead of mapping documents to their words, it maps each unique word to the sorted list of documents containing it — a structure called a **posting list**.

## Forward vs. Inverted: Direction Matters

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Forward Index (database style)", "code": "doc_1: \\"the quick brown fox jumps over the lazy dog\\"\\ndoc_2: \\"the fox is quick and brown\\"\\ndoc_3: \\"a lazy dog sleeps\\"\\n\\n# To find docs containing \\"fox\\":\\n# Must scan every document → O(N · avg_length)" }, "after": { "label": "Inverted Index (search style)", "code": "\\"brown\\"  → [doc_1, doc_2]\\n\\"dog\\"    → [doc_1, doc_3]\\n\\"fox\\"    → [doc_1, doc_2]\\n\\"jumps\\"  → [doc_1]\\n\\"lazy\\"   → [doc_1, doc_3]\\n\\"quick\\"  → [doc_1, doc_2]\\n\\"sleeps\\" → [doc_3]\\n\\n# Query \\"quick AND fox\\":\\n# intersect([doc_1,doc_2], [doc_1,doc_2]) → [doc_1,doc_2]\\n# Time: O(log P) where P = posting list length" } }
\`\`\`

To serve a query you look up the term's **posting list** and intersect or union lists for multi-term queries. This is why Elasticsearch can query billions of documents in under 100 ms.

## Anatomy of a Posting List

A naïve posting list stores only document IDs. Production systems enrich each entry progressively to enable scoring, phrase search, and weighted retrieval:

\`\`\`algoviz
{ "title": "Posting List Enrichment Levels", "type": "array", "data": ["[doc_1, doc_2]", "[(doc_1,tf=1), (doc_2,tf=1)]", "[(doc_1,tf=1,pos=[1]), (doc_2,tf=1,pos=[3])]", "[(doc_1,tf=1,pos=[1],field=body), (doc_2,tf=1,pos=[3],field=title)]"], "frames": [ { "highlight": [0], "label": "Level 0: doc IDs only — boolean match", "stats": { "bytes": 16 } }, { "highlight": [1], "label": "Level 1: + term frequency (TF) → enables TF-IDF / BM25 scoring", "stats": { "bytes": 32 } }, { "highlight": [2], "label": "Level 2: + position offsets → enables phrase queries and slop matching", "stats": { "bytes": 56 } }, { "highlight": [3], "label": "Level 3: + field name → enables field-boosted scoring (title > body)", "stats": { "bytes": 72 } } ], "speed": 1000 }
\`\`\`

Positions make phrase queries possible. For query \`"quick brown"\`:
- Lookup posting list for "quick" → doc_1 at position 1
- Lookup posting list for "brown" → doc_1 at position 2
- Adjacent? Yes → phrase match confirmed.

\`\`\`callout
{ "type": "info", "title": "Positions are expensive", "content": "Storing positions roughly doubles index size compared to TF-only. Elasticsearch lets you disable them per-field (\`index_options: freqs\`) when you only need scoring, not phrase queries." }
\`\`\`

## The Analyzer Pipeline

Before a word ever enters the index, raw document text passes through an **analyzer** — a chain of character filters, a tokenizer, and token filters. Identical analyzers must run at query time so index terms and query terms match.

\`\`\`steps
{ "title": "Analyzer Pipeline Walk-through", "steps": [ { "title": "Raw input", "content": "\`\`\`\\n\\"The Quick Brown Fox's 2nd Jump!\\"\\n\`\`\`" }, { "title": "Character filters", "content": "Strip HTML tags, normalize Unicode diacritics, replace \`&amp;\` → \`&\`.\\n\\nResult: \`\\"The Quick Brown Fox's 2nd Jump!\\"\`" }, { "title": "Tokenizer", "content": "Split on whitespace and punctuation boundaries.\\n\\nResult: \`[\\"The\\", \\"Quick\\", \\"Brown\\", \\"Fox's\\", \\"2nd\\", \\"Jump\\"]\`" }, { "title": "Token filters — lowercase", "content": "Result: \`[\\"the\\", \\"quick\\", \\"brown\\", \\"fox's\\", \\"2nd\\", \\"jump\\"]\`" }, { "title": "Token filters — possessive + stop-word removal", "content": "Strip \`'s\`; drop stop-words (\`the\`, \`a\`, \`is\`, …).\\n\\nResult: \`[\\"quick\\", \\"brown\\", \\"fox\\", \\"2nd\\", \\"jump\\"]\`" }, { "title": "Token filters — stemming (Porter / Snowball)", "content": "\\"jumps\\" → \\"jump\\", \\"jumping\\" → \\"jump\\", \\"jumped\\" → \\"jump\\".\\n\\nFinal tokens indexed: \`[\\"quick\\", \\"brown\\", \\"fox\\", \\"2nd\\", \\"jump\\"]\`\\n\\nThis is why searching \\"jumping\\" retrieves documents containing \\"jumps\\"." } ] }
\`\`\`

## Global Statistics for Relevance Scoring

The index also stores corpus-wide numbers used by TF-IDF and BM25:

| Statistic | Symbol | Stored where | Used for |
|-----------|--------|-------------|---------|
| Total documents in index | N | Segment metadata | IDF calculation |
| Documents containing term t | DF(t) | Per-term in dictionary | IDF calculation |
| Total token count across corpus | — | Global stats | BM25 avgdl |
| Token count per document | dl | DocValues / norms | BM25 length norm |

IDF (Inverse Document Frequency) rewards rare terms:

\`\`\`concept
{ "title": "IDF = log(N / DF)", "variant": "rule", "content": "A term appearing in 950,000 of 1,000,000 documents (like 'the') yields IDF ≈ 0.05 — near zero. A term appearing in only 12 documents ('quetzal') yields IDF ≈ 11.3. The rarer the term, the more it discriminates between documents, so the search engine weights it higher in scoring." }
\`\`\`

| Term | DF | IDF = log(N / DF) | Signal |
|------|----|-------------------|--------|
| "the" | 950,000 | 0.05 | Almost worthless |
| "quick" | 5,200 | 5.26 | Moderate |
| "quetzal" | 12 | 11.3 | Highly discriminating |

*(N = 1,000,000 documents)*

## Index Storage: Immutable Segments on Disk

Modern search engines (Lucene, which powers Elasticsearch) write the inverted index to **immutable segment files**. Segments are merged periodically in the background — a key design that makes writes fast and reads consistent.

\`\`\`sysdiag
{ "title": "Lucene Segment File Layout", "width": 640, "height": 320, "nodes": [ { "id": "dict", "label": "Term Dictionary\\n(sorted terms)", "x": 80, "y": 60, "kind": "storage" }, { "id": "post", "label": "Posting Lists\\n(delta+VByte compressed)", "x": 300, "y": 60, "kind": "storage" }, { "id": "fields", "label": "Stored Fields\\n(_source JSON)", "x": 520, "y": 60, "kind": "storage" }, { "id": "dv", "label": "DocValues\\n(columnar per-field)", "x": 80, "y": 220, "kind": "storage" }, { "id": "norms", "label": "Norms\\n(length + boost)", "x": 300, "y": 220, "kind": "storage" }, { "id": "fsi", "label": "Field Infos\\n(analyzer config)", "x": 520, "y": 220, "kind": "service" } ], "edges": [ { "from": "dict", "to": "post", "label": "file offset ptr" }, { "from": "fields", "to": "dv", "label": "agg queries" }, { "from": "norms", "to": "post", "label": "scoring" } ], "annotations": { "dict": "Binary-searchable sorted list of unique terms; stores byte offset into posting list file", "post": "Delta-encoded, variable-byte compressed arrays of doc IDs, TF counts, and position arrays", "fields": "Original document JSON returned in search hits (_source). Not used for search itself.", "dv": "Row-per-document columnar storage for fast sort, facet, and aggregation (like Parquet columns)", "norms": "Per-field document-length and index-time boost factors combined into a single float for scoring" } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Why immutable segments?", "content": "Immutability avoids locking during reads. New documents land in a RAM buffer (the 'translog'), flushed to a new segment. Merging small segments into larger ones happens in the background. Deletes are handled by a separate bit-mask file — the segment is never modified." }
\`\`\`

## Compression: Delta + Variable-Byte Encoding

Posting lists for common terms can contain millions of doc IDs. Two cascaded techniques shrink them dramatically:

1. **Delta encoding** — store the *gap* between consecutive sorted IDs instead of the raw IDs (small gaps = small numbers).
2. **Variable-byte (VByte) encoding** — use 1 byte for values < 128, 2 bytes for < 16 384, etc., instead of a fixed 4-byte int.

\`\`\`trace
{ "title": "Delta + VByte Compression Trace", "language": "python", "code": "def vbyte(x):\\n    bytes_ = []\\n    while x >= 128:\\n        bytes_.append((x & 0x7F) | 0x80)  # continuation bit\\n        x >>= 7\\n    bytes_.append(x)                       # final byte, high bit clear\\n    return bytes_\\n\\ndef compress(ids):\\n    deltas = [ids[0]] + [ids[i] - ids[i-1] for i in range(1, len(ids))]\\n    compressed = []\\n    for d in deltas:\\n        compressed.extend(vbyte(d))\\n    return compressed\\n\\nraw = [1, 5, 12, 100, 101, 500]\\ndeltas = [1, 4, 7, 88, 1, 399]\\nresult = compress(raw)\\nprint('raw bytes (4B ints):', len(raw) * 4)  # 24\\nprint('compressed bytes:   ', len(result))    # 7\\nprint('savings:             ', round((1 - len(result)/(len(raw)*4))*100), '%')", "frames": [ { "line": 15, "vars": { "raw": [1, 5, 12, 100, 101, 500] }, "note": "Start: 6 sorted doc IDs, 24 bytes at 4 bytes each" }, { "line": 10, "vars": { "deltas": [1, 4, 7, 88, 1, 399] }, "note": "Delta encode: store gaps — most are tiny single-digit numbers" }, { "line": 4, "vars": { "x": 399, "bytes_": [143, 3] }, "note": "399 = 0b110001111 → VByte needs 2 bytes (143 = 0x8F with continuation bit, 3 = remaining bits)" }, { "line": 17, "vars": { "result": [1, 4, 7, 88, 1, 143, 3] }, "stdout": "raw bytes (4B ints): 24\\ncompressed bytes:    7\\nsavings:             71 %", "note": "71% reduction on a 6-element list. At web scale with billions of postings, this saves terabytes." } ], "speed": 900 }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: PFOR-Delta and Roaring Bitmaps", "content": "VByte is the baseline. Production engines use faster schemes:\\n\\n**PFOR-Delta (Patched Frame of Reference):** Pack a block of 128 deltas into a fixed bit-width chosen to fit most values, then store 'exceptions' separately. SIMD-friendly — modern CPUs can decompress blocks in parallel.\\n\\n**Roaring Bitmaps:** For very dense posting lists (when a term appears in > 10% of documents), store a compressed bitset rather than a list of IDs. Roaring automatically switches between run-length-encoded runs, dense 16-bit arrays, and bitset containers per 65k-ID block.\\n\\nLucene 9+ uses a combination: PFOR-Delta for sparse terms, direct bitsets for dense ones." }
\`\`\`

## Quiz

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "Why is it called an 'inverted' index?", "options": ["It stores documents in reverse alphabetical order", "It reverses the document→word mapping to word→documents", "It inverts bit patterns for compression", "It sorts posting lists from highest to lowest doc ID"], "answer": 1, "explanation": "A forward index maps doc → words; an inverted index maps word → docs. This 'inversion' of direction is exactly where the name comes from." }, { "question": "Which posting-list enrichment is required to support exact-phrase queries like \\\\\\"quick brown fox\\\\\\"?", "options": ["Term frequency (TF)", "Position offsets", "Field name tags", "Payload boost values"], "answer": 1, "explanation": "Positions let the engine verify that 'quick' appears immediately before 'brown', which appears immediately before 'fox'. Without positions, you can only confirm all three terms appear *somewhere* in the document." }, { "question": "Delta encoding compresses posting lists because:", "options": ["Doc IDs are always powers of two", "Gaps between sorted IDs are typically small numbers", "XOR of adjacent IDs is always zero", "Unicode code points compress well with delta encoding"], "answer": 1, "explanation": "Posting lists are kept sorted. Consecutive doc IDs are often close together, so their gaps are small numbers that variable-byte encoding can represent in 1–2 bytes instead of 4." }, { "question": "Why does Lucene write index segments as *immutable* files?", "options": ["To prevent accidental edits by administrators", "To avoid read locks — immutable files need no synchronization during concurrent reads", "Because POSIX file systems do not support in-place updates", "To reduce memory usage during indexing"], "answer": 1, "explanation": "Immutable segments mean readers never contend with writers. New documents go to a RAM buffer flushed as a new segment; merges happen in the background. Deletes use a separate bit-mask, leaving the segment untouched." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "An inverted index maps each unique term to a sorted posting list of document IDs, enabling O(log P) lookup instead of O(N·L) full-scan", "Posting lists can be enriched with term frequency, position offsets, and field info — each level unlocks new query capabilities (scoring, phrase search, field boosting)", "The analyzer pipeline (char filters → tokenizer → token filters) normalizes text into consistent tokens at both index and query time; mismatched analyzers break retrieval", "Global statistics (N, DF per term) stored in segment metadata power TF-IDF and BM25 relevance models without per-query corpus scans", "Delta + variable-byte compression (or PFOR-Delta / Roaring Bitmaps in production) achieves 60–90% size reduction on posting lists, directly enabling billion-document search at low latency" ] }
\`\`\``,
    },
    {
      id: "search-sharding",
      slug: "search-sharding",
      title: "Distributed Indexing & Sharding",
      content: `# Distributed Indexing & Sharding

A single machine cannot hold the index for billions of documents. Distributed search engines split the index across many nodes — and the strategy you choose for that split determines your system's scalability, fault tolerance, and query latency.

\`\`\`concept
{ "title": "The Core Mental Model", "variant": "mental-model", "content": "Think of each shard as a self-contained mini search engine. It holds its own inverted index, accepts writes, and answers queries independently. The distributed layer is just an orchestrator: route a write to one shard, broadcast a query to all shards, and merge the results. Elasticsearch, Solr, and OpenSearch all follow this model." }
\`\`\`

## Two Partitioning Strategies

There are two fundamental ways to split an inverted index across nodes. They differ in *what* each shard owns: a subset of documents, or a subset of terms.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Document Partitioning",
      "icon": "📄",
      "content": "**Each shard owns a complete inverted index for a subset of documents.**\\n\\nA document is assigned to exactly one shard. When a query arrives, the coordinator broadcasts it to *all* shards (scatter), collects ranked results (gather), and merges them.\\n\\n**Pros:**\\n- Each shard is fully self-contained — simple to reason about\\n- Indexing one document touches exactly one shard\\n- If a shard goes down, only a fraction of documents are unavailable\\n- Rebalancing is straightforward: move whole shards\\n\\n**Cons:**\\n- Every query must contact every shard (scatter-gather overhead)\\n- IDF statistics are local per shard, which can cause minor scoring inconsistencies across shard boundaries\\n\\n✅ **This is what Elasticsearch and Solr use in practice.**"
    },
    {
      "label": "Term Partitioning",
      "icon": "🔤",
      "content": "**Each shard owns the complete posting list for a subset of terms.**\\n\\nTerms are distributed by range or hash (e.g., shard 1 owns [a–f], shard 2 owns [g–p], shard 3 owns [q–z]). A single-term query hits exactly one shard. A multi-term query must fan out to one shard per unique term, then intersect results.\\n\\n**Pros:**\\n- Single-term queries are maximally efficient — one shard\\n- Global IDF is accurate within each shard (all posting lists for a term live together)\\n\\n**Cons:**\\n- Multi-term queries require cross-shard coordination and result intersection\\n- Indexing one document touches *multiple* shards (one per unique term in the doc)\\n- Rebalancing is painful: terms have wildly variable popularity (Zipf distribution)\\n\\n❌ **Rarely used in practice. The multi-term coordination cost outweighs IDF accuracy benefits.**"
    }
  ]
}
\`\`\`

\`\`\`sysdiag
{
  "title": "Document Partitioning: Scatter-Gather Flow",
  "width": 680,
  "height": 340,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 170, "kind": "client" },
    { "id": "coord", "label": "Coordinator\\nNode", "x": 220, "y": 170, "kind": "service" },
    { "id": "s0", "label": "Shard 0\\ndocs 1–3", "x": 430, "y": 60, "kind": "storage" },
    { "id": "s1", "label": "Shard 1\\ndocs 4–6", "x": 430, "y": 170, "kind": "storage" },
    { "id": "s2", "label": "Shard 2\\ndocs 7–9", "x": 430, "y": 280, "kind": "storage" },
    { "id": "merge", "label": "Merge &\\nRank", "x": 580, "y": 170, "kind": "service" }
  ],
  "edges": [
    { "from": "client", "to": "coord", "label": "query: 'fox'" },
    { "from": "coord", "to": "s0", "label": "scatter" },
    { "from": "coord", "to": "s1", "label": "scatter" },
    { "from": "coord", "to": "s2", "label": "scatter" },
    { "from": "s0", "to": "merge", "label": "[1,2] scores" },
    { "from": "s1", "to": "merge", "label": "[4] score" },
    { "from": "s2", "to": "merge", "label": "[8,9] scores" },
    { "from": "merge", "to": "client", "label": "top-10" }
  ],
  "annotations": {
    "coord": "Receives the query, picks one replica per shard to query, then waits for all partial results before merging.",
    "merge": "Sorts all (doc_id, score) tuples globally by score. Uses a two-phase fetch: Phase 1 collects only IDs + scores (lightweight). Phase 2 fetches full documents only for the final top-K.",
    "s0": "Each shard runs a full local search — tokenization, inverted-index lookup, BM25 scoring — entirely independently."
  }
}
\`\`\`

## Shard Routing

When a document is indexed, the cluster must decide which shard receives it. Elasticsearch uses a deterministic formula so any node can compute the answer without coordination:

\`\`\`
shard_id = hash(_routing) % number_of_primary_shards
\`\`\`

By default, \`_routing\` is the document ID. You can override it:

\`\`\`callout
{ "type": "warning", "title": "The Fixed Shard Count Trap", "content": "The number of primary shards is **fixed at index creation time**. If you change it later, every document's shard assignment changes — requiring a full reindex. Plan your shard count based on expected total data volume (a common rule of thumb: aim for shards of 20–40 GB each for search workloads). Elasticsearch's shrink/split APIs offer partial relief but cannot fully substitute for planning." }
\`\`\`

### Custom Routing for Tenant Isolation

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Default (hash of doc_id)",
      "icon": "🔀",
      "content": "\`\`\`\\nshard = hash(doc_id) % num_shards\\n\`\`\`\\n\\nDocuments are spread evenly across shards. Every query must fan out to all shards — there's no way to know which shard holds docs for a given tenant."
    },
    {
      "label": "Custom (hash of tenant_id)",
      "icon": "🏢",
      "content": "\`\`\`\\nshard = hash(tenant_id) % num_shards\\n\`\`\`\\n\\nAll documents for \`tenant_X\` land on the same shard. A query filtered to \`tenant_X\` hits exactly **one shard** instead of all shards. Dramatically reduces scatter-gather overhead for multi-tenant SaaS search.\\n\\n**Trade-off:** Unequal shard sizes if tenant data volumes vary widely (hot shard problem)."
    }
  ]
}
\`\`\`

## Shard Rebalancing

When you add nodes to the cluster, shards are redistributed automatically — no re-indexing required, just data movement.

\`\`\`steps
{
  "title": "Adding a Node: Shard Rebalancing",
  "steps": [
    {
      "title": "Before: 2 nodes, 6 shards",
      "content": "Node A holds [S0, S1, S2] and Node B holds [S3, S4, S5]. Load is balanced, but adding capacity requires moving shards."
    },
    {
      "title": "Cluster detects new Node C",
      "content": "The master/cluster-manager node recalculates the optimal shard distribution across 3 nodes: each node should hold 2 shards."
    },
    {
      "title": "Shard migration begins",
      "content": "Node A copies S2 to Node C. Node B copies S5 to Node C. During migration, the original shards remain active and continue serving reads."
    },
    {
      "title": "Routing table updated",
      "content": "Once Node C confirms receipt and consistency, the cluster routing table is updated. New queries for S2 and S5 are directed to Node C."
    },
    {
      "title": "Old copies released",
      "content": "Node A releases S2. Node B releases S5. Final state: Node A [S0, S1], Node B [S3, S4], Node C [S2, S5]. No reindex needed."
    }
  ]
}
\`\`\`

## Replica Shards

Each primary shard has one or more replicas for fault tolerance and read throughput. The placement rule is strict: **a replica is never co-located with its primary**.

\`\`\`algoviz
{
  "title": "Primary and Replica Shard Placement (3 Primary, 1 Replica Each)",
  "type": "grid",
  "data": [
    ["P0", "R1", "R2"],
    ["R0", "P1", "R2'"],
    ["R0'", "R1'", "P2"]
  ],
  "frames": [
    {
      "highlight": [0, 1, 2, 3, 4, 5, 6, 7, 8],
      "label": "Initial placement across 3 nodes (rows). P = Primary, R = Replica. No primary shares a node with its own replica.",
      "stats": { "primaries": 3, "replicas": 6, "total_shards": 9 }
    },
    {
      "highlight": [3, 6],
      "label": "R0 and R0' are replicas of P0. If Node 1 (row 0) fails, one replica is promoted to primary immediately.",
      "stats": { "primary": "P0 on Node 1", "replicas": "R0 on Node 2, R0' on Node 3" }
    },
    {
      "highlight": [0, 3, 4, 7],
      "label": "Writes: Client → Coordinator → Primary shard. Primary replicates to all replicas before acknowledging.",
      "stats": { "write_path": "P → R (synchronous by default)" }
    },
    {
      "highlight": [1, 3, 6],
      "label": "Reads: Coordinator routes to ANY copy (primary or replica) using round-robin. Replicas double read throughput.",
      "stats": { "read_throughput": "2x with 1 replica" }
    }
  ],
  "speed": 900
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Write vs Read Path", "content": "**Writes** always go to the primary shard first, which then replicates to its replicas. Elasticsearch acknowledges the write only after replicas confirm — this is the \`wait_for_active_shards\` setting.\\n\\n**Reads** can be served by the primary or any replica. The coordinator load-balances across all healthy copies, so adding replicas directly increases read throughput." }
\`\`\`

## Query Execution: Two-Phase Scatter-Gather

The coordinator uses a two-phase protocol to avoid fetching full document bodies for every candidate:

\`\`\`steps
{
  "title": "Two-Phase Scatter-Gather",
  "steps": [
    {
      "title": "Phase 1 — Scatter (lightweight)",
      "content": "The coordinator sends the query to one replica of each shard in parallel. Each shard runs a local BM25 search and returns only \`(doc_id, score)\` pairs — no document bodies. This phase is fast because the payload is tiny."
    },
    {
      "title": "Phase 1 — Gather + Global Sort",
      "content": "The coordinator collects all \`(doc_id, score)\` pairs from every shard. It merges them into a globally sorted list. For a \`size=10\` request, it keeps only the top 10 \`doc_id\`s."
    },
    {
      "title": "Phase 2 — Fetch (targeted)",
      "content": "The coordinator issues targeted fetch requests to the specific shards that own the top-10 documents. Only these shards return full document \`_source\` bodies. This avoids transferring potentially thousands of large documents over the network just to discard all but 10."
    },
    {
      "title": "Response to client",
      "content": "The coordinator assembles the final response — ranked hits with full document bodies, highlight snippets, and aggregation results — and returns it to the client."
    }
  ]
}
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Deep Pagination is Expensive", "content": "Requesting \`from=9990, size=10\` (page 1000) forces every shard to return its top 10,000 results to the coordinator, which then discards all but 10. Cost scales as \`O(from + size)\` per shard. Use the **Scroll API** or **search_after** cursor for deep pagination instead — they avoid this problem entirely." }
\`\`\`

\`\`\`quiz
{
  "title": "Distributed Indexing & Sharding",
  "questions": [
    {
      "question": "In document partitioning, a user searches for 'elasticsearch'. Which shards receive the query?",
      "options": [
        "Only the shard whose hash range covers 'elasticsearch'",
        "Only the shard assigned to the most recent document mentioning 'elasticsearch'",
        "All shards — the coordinator broadcasts to every shard",
        "The shard with the highest document count"
      ],
      "answer": 2,
      "explanation": "Document partitioning uses scatter-gather: the coordinator must send the query to ALL shards because any shard could hold documents containing the term. Each shard searches its local inverted index independently and returns partial results."
    },
    {
      "question": "An Elasticsearch index is created with 5 primary shards. Six months later the data has grown 10× and you want to add 5 more primary shards. What happens?",
      "options": [
        "Elasticsearch automatically splits existing shards to accommodate",
        "You can increase primary shard count via a cluster settings API call",
        "The shard count is fixed at index creation — you must reindex into a new index with 10 shards",
        "Elasticsearch redistributes existing shards evenly when new nodes join"
      ],
      "answer": 2,
      "explanation": "The number of primary shards is fixed at index creation because the routing formula \`hash(doc_id) % num_primary_shards\` would produce different assignments if \`num_primary_shards\` changed. A full reindex into a new index (or using the shrink/split API for limited adjustments) is required."
    },
    {
      "question": "A multi-tenant SaaS uses custom routing keyed on \`tenant_id\`. What is the primary performance benefit?",
      "options": [
        "Documents are compressed more efficiently when grouped by tenant",
        "Queries filtered to a single tenant hit only one shard instead of all shards",
        "Write throughput doubles because replicas handle tenant writes",
        "IDF scores become globally accurate across all tenants"
      ],
      "answer": 1,
      "explanation": "With custom routing on \`tenant_id\`, all documents for a given tenant land on the same shard. A query with a tenant filter can be routed directly to that one shard — eliminating scatter-gather overhead entirely for single-tenant queries."
    },
    {
      "question": "Why is a replica shard never placed on the same node as its primary?",
      "options": [
        "To reduce network latency between primary and replica during replication",
        "Because Lucene cannot open two identical indexes on the same JVM",
        "So that node failure does not simultaneously destroy both the primary and its replica",
        "Elasticsearch licensing restricts co-location of primary and replica"
      ],
      "answer": 2,
      "explanation": "The entire purpose of a replica is fault tolerance. If the primary and its replica were on the same node and that node failed, both copies would be lost simultaneously. By enforcing cross-node placement, Elasticsearch guarantees that a single node failure never causes data loss for any shard."
    },
    {
      "question": "In the two-phase scatter-gather protocol, why does Phase 1 return only (doc_id, score) instead of full documents?",
      "options": [
        "Shards do not have access to document source — only the coordinator does",
        "To avoid transferring large document bodies for thousands of candidates when only top-10 will be returned",
        "Phase 1 is a cache-warming step that doesn't perform actual scoring",
        "BM25 scoring requires global statistics only available at the coordinator"
      ],
      "answer": 1,
      "explanation": "Each shard might return hundreds or thousands of candidate (doc_id, score) pairs. Sending full document bodies for all of them would waste enormous network bandwidth when only a handful (e.g., top 10) will survive the global merge. Phase 2 fetches full documents only for the final survivors."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Document partitioning (each shard = full index for a subset of docs) is the standard approach used by Elasticsearch and Solr — it keeps indexing simple and shards self-contained.",
    "Term partitioning (each shard = all docs for a subset of terms) sounds efficient for single-term queries but fails in practice due to multi-term coordination cost and difficult rebalancing.",
    "The number of primary shards is fixed at index creation — the routing formula hash(doc_id) % num_shards breaks if you change it. Plan for expected total data volume upfront.",
    "Replica shards are never co-located with their primary. They serve reads in parallel (increasing throughput) and are promoted to primary on node failure (providing fault tolerance).",
    "The two-phase scatter-gather protocol avoids network waste: Phase 1 collects lightweight (doc_id, score) from all shards; Phase 2 fetches full documents only for the final top-K results.",
    "Custom routing (e.g., by tenant_id) collapses scatter-gather to a single shard for filtered queries — a major optimization for multi-tenant architectures."
  ]
}
\`\`\``,
    },
    {
      id: "search-scoring",
      slug: "search-scoring",
      title: "Query Processing & Scoring",
      content: `# Query Processing & Scoring

When a user types a query, the search engine must decide which documents match and how to rank them. Scoring algorithms like **TF-IDF** and **BM25** compute a relevance score for each document based on how well it matches the query. For a 3-term query against a 1M-document index, these algorithms typically examine only 1,000–10,000 candidates rather than all 1M documents — that efficiency is the payoff.

\`\`\`concept
{ "title": "TF-IDF Intuition", "variant": "mental-model", "content": "Imagine a library with millions of books. A word like 'the' appears everywhere, so finding it doesn't help you find relevant books. But a word like 'photosynthesis' is rare — if it appears in a book, that book is probably very relevant to your biology query. TF-IDF captures this intuition: common words within a document (high TF) are good, but common words across all documents (low IDF) are weak signals." }
\`\`\`

## Term Frequency – Inverse Document Frequency (TF-IDF)

TF-IDF is the foundation of text relevance scoring. It combines two intuitions:

1. **Term Frequency (TF):** A term that appears more often in a document is more relevant to that document
2. **Inverse Document Frequency (IDF):** A term that appears in fewer documents is more discriminating — it's a stronger signal

\`\`\`playground
{ "title": "TF-IDF Calculator", "language": "python", "code": "import math\\n\\ndef tf_idf(term, document, collection_size, doc_frequency):\\n    # Term Frequency (normalized)\\n    words = document.split()\\n    tf = words.count(term) / len(words)\\n    \\n    # Inverse Document Frequency\\n    idf = math.log(collection_size / doc_frequency)\\n    \\n    # TF-IDF Score\\n    return tf * idf\\n\\n# Example: Query \\"quick fox\\" against doc_1\\ndoc_1 = \\"the quick brown fox jumps over the quick lazy fox\\"\\ncollection_size = 1_000_000\\n\\nquick_score = tf_idf(\\"quick\\", doc_1, collection_size, 5200)\\nfox_score = tf_idf(\\"fox\\", doc_1, collection_size, 1800)\\n\\nprint(f\\"TF-IDF('quick', doc_1) = {quick_score:.2f}\\")\\nprint(f\\"TF-IDF('fox', doc_1) = {fox_score:.2f}\\")\\nprint(f\\"Total score = {quick_score + fox_score:.2f}\\")", "runnable": true }
\`\`\`

## BM25 (Best Matching 25)

BM25 is the **industry standard** scoring algorithm used in Elasticsearch, Solr, and Lucene. It fixes two structural problems with raw TF-IDF:

1. **Term frequency saturation:** The 10th occurrence of a term matters far less than the 2nd
2. **Document length normalization:** Longer documents match more terms by chance and must be penalized

### The BM25 Formula

$$\\text{score}(D, Q) = \\sum_{t \\in Q} \\text{IDF}(t) \\cdot \\frac{tf(t,D) \\cdot (k_1 + 1)}{tf(t,D) + k_1 \\cdot \\left(1 - b + b \\cdot \\frac{|D|}{\\text{avgdl}}\\right)}$$

| Parameter | Typical Value | Role |
|-----------|--------------|------|
| \`k1\` | 1.2 – 2.0 | Controls TF saturation speed |
| \`b\` | 0.75 | Controls length normalization strength |
| \`avgdl\` | corpus-dependent | Average document length in tokens |

\`\`\`compare
{ "variant": "before-after", "before": { "label": "TF-IDF: Linear Growth", "code": "# TF-IDF: Score grows linearly with term frequency\\n# TF=1  → score=1.0\\n# TF=2  → score=2.0\\n# TF=10 → score=10.0\\n# Problem: 100th occurrence shouldn't matter 100x more than 1st" }, "after": { "label": "BM25: Saturation Curve", "code": "# BM25: Score saturates with term frequency\\n# TF=1   → score=1.0\\n# TF=2   → score=1.5  (+50%)\\n# TF=10  → score=2.1  (+5%)\\n# TF=100 → score~2.2  (plateau)\\n# Better: Later occurrences add minimal value" } }
\`\`\`

\`\`\`algoviz
{ "title": "BM25 Saturation Effect (k1=1.2, b=0.75)", "type": "array", "data": [1.0, 1.5, 1.7, 1.8, 1.9, 2.0, 2.05, 2.08, 2.1, 2.11, 2.12, 2.13, 2.14, 2.15, 2.16], "frames": [ {"highlight": [0], "label": "TF=1: score=1.0 — first occurrence is high-signal", "stats": {"tf": 1, "score": 1.0}}, {"highlight": [1], "label": "TF=2: score=1.5 — 50% increase, still meaningful", "stats": {"tf": 2, "score": 1.5}}, {"highlight": [4], "label": "TF=5: score=1.9 — clear diminishing returns", "stats": {"tf": 5, "score": 1.9}}, {"highlight": [9], "label": "TF=10: score=2.1 — minimal gain from here", "stats": {"tf": 10, "score": 2.1}}, {"highlight": [14], "label": "TF=100: score≈2.2 — effectively at plateau", "stats": {"tf": 100, "score": 2.16}} ], "speed": 1000 }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "BM25 Score Breakdown (3-term query)", "content": "For query 'server error 500' against a document:\\n- \`server\`: IDF=1.2, TF=3 → term score = 1.2 × BM25_tf(3)\\n- \`error\`: IDF=0.8, TF=5 → term score = 0.8 × BM25_tf(5)\\n- \`500\`: IDF=2.1, TF=1 → term score = 2.1 × BM25_tf(1)\\n\\nThe rare token \`500\` (high IDF=2.1) contributes disproportionately even at TF=1 — that's IDF doing its job." }
\`\`\`

## Boolean Queries: Posting List Operations

Before scoring, the engine must identify the candidate document set. This is done by operating on **sorted posting lists** retrieved from the inverted index.

\`\`\`trace
{ "title": "Posting List Intersection for 'quick AND fox'", "language": "python", "code": "def intersect_lists(list_a, list_b):\\n    \\"\\"\\"Efficient merge join on sorted posting lists\\"\\"\\"\\n    result = []\\n    i = j = 0\\n    \\n    while i < len(list_a) and j < len(list_b):\\n        if list_a[i] == list_b[j]:\\n            result.append(list_a[i])\\n            i += 1\\n            j += 1\\n        elif list_a[i] < list_b[j]:\\n            i += 1\\n        else:\\n            j += 1\\n    \\n    return result\\n\\nquick_posts = [1, 2, 5, 8, 12]\\nfox_posts   = [1, 3, 5, 9, 12]\\n\\nmatches = intersect_lists(quick_posts, fox_posts)\\nprint(f\\"Documents matching 'quick AND fox': {matches}\\")\\nprint(f\\"Time complexity: O({len(quick_posts)} + {len(fox_posts)}) = O({len(quick_posts) + len(fox_posts)})\\")", "frames": [ {"line": 1, "vars": {"list_a": "[1,2,5,8,12]", "list_b": "[1,3,5,9,12]", "i": 0, "j": 0}, "note": "Initialize pointers at head of both sorted lists"}, {"line": 6, "vars": {"list_a[i]": 1, "list_b[j]": 1, "i": 0, "j": 0}, "note": "Both point to doc 1 — MATCH"}, {"line": 7, "vars": {"result": "[1]", "i": 1, "j": 1}, "note": "Add doc 1, advance both pointers"}, {"line": 13, "vars": {"list_a[i]": 2, "list_b[j]": 3, "i": 1, "j": 1}, "note": "2 < 3 — advance i (skip doc 2)"}, {"line": 10, "vars": {"list_a[i]": 5, "list_b[j]": 5, "i": 2, "j": 2}, "note": "Both point to doc 5 — MATCH"}, {"line": 7, "vars": {"result": "[1,5]", "i": 3, "j": 3}, "note": "Add doc 5, advance both"}, {"line": 13, "vars": {"list_a[i]": 8, "list_b[j]": 9, "i": 3, "j": 3}, "note": "8 < 9 — advance i (skip doc 8)"}, {"line": 10, "vars": {"list_a[i]": 12, "list_b[j]": 12, "i": 4, "j": 4}, "note": "Both point to doc 12 — MATCH"}, {"line": 7, "vars": {"result": "[1,5,12]"}, "note": "Final: docs 1, 5, 12 match. Total work = O(5+5) = O(10)"}], "speed": 1200 }
\`\`\`

\`\`\`concept
{ "title": "Always Process the Shortest List First", "variant": "rule", "content": "For AND queries, process the rarest term's posting list first. If 'photosynthesis' has 200 postings and 'the' has 500,000,000 postings, intersecting against the short list first prunes the candidate set immediately. This is why the query planner estimates posting list sizes before choosing execution order." }
\`\`\`

## Phrase Queries

Phrase queries like \`\\"quick brown fox\\"\` require terms to appear **adjacently and in order**. This is impossible without positional data in the index.

\`\`\`callout
{ "type": "warning", "title": "Positional Data Required", "content": "Without storing term positions in the index, phrase queries are impossible. The inverted index must include positional information: 'fox' appears at positions [3, 9] in document 1, not just that it appears. Positional data is expensive — it can 3–5× the size of a basic inverted index — but it is required for phrase, proximity, and slop queries." }
\`\`\`

\`\`\`tabs
{ "tabs": [ { "label": "Basic Index", "icon": "📋", "content": "\`\`\`\\nterm      → [doc_id, ...]\\n--------------------------\\n'quick'   → [1, 2, 5]\\n'brown'   → [1, 4, 5]\\n'fox'     → [1, 3, 5]\\n\`\`\`\\n\\nWorks for: **boolean queries** (\`quick AND fox\`)\\n\\nFails for: **phrase queries** (\`\\"quick brown fox\\"\`) — can't verify adjacency." }, { "label": "Positional Index", "icon": "📍", "content": "\`\`\`\\nterm      → [(doc_id, [positions]), ...]\\n----------------------------------------\\n'quick'   → [(1, [1, 7]), (2, [0]), (5, [3])]\\n'brown'   → [(1, [2]), (4, [0]), (5, [4])]\\n'fox'     → [(1, [3, 9]), (3, [2]), (5, [5])]\\n\`\`\`\\n\\nWorks for: **boolean + phrase queries**\\n\\nDoc 1 matches \`\\"quick brown fox\\"\` because positions 1→2→3 are consecutive." }, { "label": "Proximity Query", "icon": "↔️", "content": "Positional data also enables **proximity queries** with a slop factor:\\n\\n\`\\"quick fox\\"~2\` — matches if 'quick' and 'fox' appear within 2 tokens of each other.\\n\\nElasticsearch supports this via the \`match_phrase\` query with \`slop\` parameter.\\n\\nDoc 1: quick(pos=1), fox(pos=3) → gap=2 → matches \`~2\`\\nDoc 3: quick(pos=0), fox(pos=8) → gap=8 → does NOT match \`~2\`" } ] }
\`\`\`

## Multi-Field Scoring

Documents have multiple fields (title, body, tags) with different semantic weight. Elasticsearch implements **per-field BM25** with boost multipliers.

\`\`\`tabs
{ "tabs": [ { "label": "Field Boosts", "icon": "⚡", "content": "| Field | Default Boost | Rationale |\\n|-------|-------------|----------|\\n| \`title\` | 3.0 | If query term is in title, document is highly relevant |\\n| \`tags\` | 2.0 | Explicit categorization signal |\\n| \`body\` | 1.0 | Baseline score |\\n| \`url\` | 1.5 | URL slug often mirrors title |\\n\\nFinal score = Σ (field_BM25_score × field_boost)\\n\\nA BM25=2.0 title match (score=6.0) beats a BM25=3.0 body match (score=3.0)." }, { "label": "Elasticsearch DSL", "icon": "🔍", "content": "\`\`\`json\\n{\\n  \\"query\\": {\\n    \\"multi_match\\": {\\n      \\"query\\": \\"distributed systems\\",\\n      \\"fields\\": [\\"title^3\\", \\"tags^2\\", \\"body\\"],\\n      \\"type\\": \\"best_fields\\"\\n    }\\n  }\\n}\\n\`\`\`\\n\\n\`type: best_fields\` — uses the highest-scoring single field (avoids over-counting)\\n\`type: most_fields\` — sums across all matching fields\\n\`type: cross_fields\` — treats all fields as one large document" } ] }
\`\`\`

## Full Query Processing Pipeline

\`\`\`sysdiag
{ "title": "Query Processing Architecture", "width": 700, "height": 380, "nodes": [ {"id": "client", "label": "Client", "x": 60, "y": 190, "kind": "client"}, {"id": "qp", "label": "Query\\nProcessor", "x": 200, "y": 190, "kind": "service"}, {"id": "analyzer", "label": "Analyzer\\n(tokenize/stem)", "x": 340, "y": 100, "kind": "service"}, {"id": "planner", "label": "Query\\nPlanner", "x": 340, "y": 280, "kind": "service"}, {"id": "index", "label": "Inverted\\nIndex", "x": 500, "y": 190, "kind": "database"}, {"id": "scorer", "label": "BM25\\nScorer", "x": 600, "y": 100, "kind": "service"}, {"id": "heap", "label": "Top-K\\nHeap", "x": 600, "y": 280, "kind": "service"} ], "edges": [ {"from": "client", "to": "qp", "label": "raw query"}, {"from": "qp", "to": "analyzer", "label": "tokenize"}, {"from": "qp", "to": "planner", "label": "plan"}, {"from": "analyzer", "to": "index", "label": "lookup"}, {"from": "planner", "to": "index", "label": "order"}, {"from": "index", "to": "scorer", "label": "postings + TF"}, {"from": "scorer", "to": "heap", "label": "scores"}, {"from": "heap", "to": "client", "label": "top-K results"} ], "annotations": { "analyzer": "Applies identical pipeline as indexer: lowercase → stop words → stemming. 'Running' becomes 'run' to match index token.", "planner": "Estimates posting list sizes; schedules shortest-list-first for AND queries to prune early.", "scorer": "Computes per-field BM25 with boosts. For phrase queries, verifies positional constraints first.", "heap": "Min-heap of size K. Only K scores held in memory regardless of candidate count." } }
\`\`\`

\`\`\`steps
{ "title": "Query Processing Flow (Step by Step)", "steps": [ { "title": "Query Analysis", "content": "Tokenize, lowercase, remove stop words, and stem the query. Apply **the same pipeline used at index time** — if the indexer stemmed 'running' to 'run', the query analyzer must do the same, or no documents will match." }, { "title": "Query Planning", "content": "Look up the length of each term's posting list. Build an execution plan:\\n- **AND query:** sort terms by posting list length ascending — process rarest first\\n- **OR query:** process most common terms first to build the candidate pool quickly\\n- **Phrase query:** verify candidates pass positional constraints before scoring" }, { "title": "Posting List Operations", "content": "Execute the plan:\\n- **AND:** merge-join sorted lists in O(n + m) time\\n- **OR:** merge all lists, deduplicating doc IDs\\n- **Phrase:** for each candidate from boolean phase, verify term positions are consecutive" }, { "title": "BM25 Scoring", "content": "For each candidate document, compute:\\n\`\`\`\\nscore = Σ IDF(t) × TF_sat(t, D) × field_boost\\n\`\`\`\\nIDF values are pre-computed and cached. TF and document length (for normalization) are stored in the posting list entry." }, { "title": "Top-K Selection", "content": "Maintain a **min-heap of size K** as you process candidates. Any document scoring below the heap minimum is discarded immediately — this is the key optimization that avoids sorting all candidates. Return the K results with snippets and highlights." } ] }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "A query matches the title field (boost=3.0) with BM25 score 2.0, and the body field (boost=1.0) with BM25 score 3.0. Which field contributes the higher final score?", "options": ["Body match: 3.0 × 1.0 = 3.0", "Title match: 2.0 × 3.0 = 6.0", "Both are equal at 3.0", "Cannot determine without knowing document length"], "answer": 1, "explanation": "Title match: 2.0 × 3.0 = 6.0. Body match: 3.0 × 1.0 = 3.0. The title match wins despite a lower raw BM25 score because title matches carry higher semantic importance and are boosted accordingly." }, { "question": "Why does BM25 include document length normalization?", "options": ["Shorter documents are always more relevant", "Longer documents match more terms by chance and would score artificially high without it", "It prevents IDF from growing too large", "To favor recently indexed documents"], "answer": 1, "explanation": "Longer documents naturally contain more terms, so they would match more queries and score higher for most terms without normalization. BM25's \`b\` parameter (typically 0.75) penalizes documents longer than the corpus average to remove this statistical artifact." }, { "question": "What does the k1 parameter control in BM25?", "options": ["How much document length matters", "How quickly term frequency score saturates", "The number of top results to return", "The IDF floor value"], "answer": 1, "explanation": "k1 (typically 1.2–2.0) controls the TF saturation curve. A higher k1 means higher TF values keep contributing meaningful score increases before plateauing. A k1=0 would make BM25 ignore term frequency entirely (pure IDF)." }, { "question": "For the AND query 'photosynthesis chlorophyll', the query planner finds 'photosynthesis' has 800 postings and 'chlorophyll' has 1,200 postings. What is the optimal execution strategy?", "options": ["Process chlorophyll first (longer list = more data)", "Process photosynthesis first (shorter list prunes candidates early)", "Process both in parallel and merge", "Order doesn't matter for AND queries"], "answer": 1, "explanation": "For AND queries, processing the shortest posting list first gives you the most aggressive early pruning. After intersecting 800 photosynthesis candidates, you only need to check those 800 against the 1,200 chlorophyll entries — not check all 1,200 × 800 combinations." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "BM25 is the industry standard (Elasticsearch, Solr, Lucene) — it improves TF-IDF with term frequency saturation (k1) and document length normalization (b=0.75)", "Boolean operations on posting lists use O(n+m) merge join on sorted lists; AND queries should process the shortest list first for maximum pruning", "Phrase queries require positional data in the inverted index to verify adjacent, ordered term occurrences — this increases index size 3–5×", "Multi-field scoring multiplies per-field BM25 scores by field boost weights; a high-boost title match can outrank a high-score body match", "The query analyzer must apply the identical tokenization pipeline as the indexer — any divergence causes silent match failures" ] }
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

Users expect new content to appear in search results within seconds of being published. A search engine must continuously ingest documents, update the inverted index, and expose those changes to queries — all without blocking ongoing reads.

\`\`\`concept
{ "title": "The Near-Real-Time Trade-off", "variant": "insight", "content": "Real-time indexing prioritizes low latency (seconds) over resource efficiency. The industry goal is 'near-real-time' (NRT), not zero latency. Elasticsearch's default refresh interval of 1 second reflects this: a deliberate bargain between freshness and cost. Faster refresh = more CPU and I/O per second." }
\`\`\`

## Why In-Place Writes Don't Work

Inverted indexes are optimized for reads. A posting list for the term \`"python"\` might span millions of document IDs. Updating it in-place for every new document would require reading the full list, appending, and writing it back — expensive random I/O at write time, repeated constantly.

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Naïve In-Place Update", "code": "# Every new doc triggers random disk I/O\\nfor term in doc.terms:\\n    posting = disk.read(term)        # [1, 5, 12, 88, 200]\\n    posting.append(doc.id)           # [1, 5, 12, 88, 200, 201]\\n    disk.write(term, posting)        # rewrites entire list — expensive!" }, "after": { "label": "Segment-Based Append", "code": "# Docs buffered in memory, flushed as a new immutable segment\\nbuffer = []                          # RAM — mutable\\nbuffer.append(doc)                   # O(1), no disk I/O\\n\\n# every N docs or M seconds:\\nsegment = flush(buffer)              # sequential write — fast\\ndisk.append_segment(segment)         # immutable file, never modified" } }
\`\`\`

The solution, pioneered by Lucene (the engine powering Elasticsearch and Solr), is **immutable segments**: write new data sequentially as new files, never modify old ones.

## Segment-Based Architecture

The index is not a single file. It is a collection of **immutable segments**, each a self-contained mini-index. A new document goes into a mutable in-memory buffer. At refresh time, the buffer is converted to a new segment and opened for searching.

\`\`\`algoviz
{ "title": "Segment Life Cycle", "type": "array", "data": ["buffer", "S0", "S1", "S2", "S3"], "frames": [
  { "highlight": [0], "label": "T=0 s: doc_201, doc_202 land in mutable buffer", "stats": { "buffer_docs": 2 } },
  { "highlight": [0], "label": "T=0.7 s: doc_203 arrives, buffer holds 3 docs", "stats": { "buffer_docs": 3 } },
  { "highlight": [0, 4], "label": "T=1.0 s: REFRESH — buffer flushed to new segment S3", "stats": { "buffer_docs": 0, "segments": 4 } },
  { "highlight": [4], "label": "T=1.0 s: S3 opened for search — docs 201-203 now findable", "stats": { "segments": 4 } },
  { "highlight": [0], "label": "T=1.1 s: fresh buffer begins accepting new docs again", "stats": { "buffer_docs": 0 } }
], "speed": 1100 }
\`\`\`

A query searches **all** segments in parallel and merges their results — so correctness is preserved even with many small segments.

## The Refresh Cycle in Detail

\`\`\`steps
{ "title": "1-Second Refresh Cycle (Elasticsearch Default)", "steps": [
  { "title": "0.0 s — Document arrives", "content": "\`doc_201\` is received by the shard primary. It is written to the **translog** (fsync'd) first, then appended to the in-memory buffer." },
  { "title": "0.3–0.9 s — More docs buffer", "content": "\`doc_202\` and \`doc_203\` land in the same buffer. All three are in RAM — not yet searchable." },
  { "title": "1.0 s — REFRESH", "content": "The buffer is converted into a new **Lucene segment** (an in-memory/OS-cache structure). The segment is opened for reading. Buffer is cleared." },
  { "title": "1.0 s — Docs become visible", "content": "Any query issued after the refresh sees docs 201–203. This is **near-real-time (NRT)** search." },
  { "title": "Flush (periodic, ~30 s)", "content": "Segments are **fsync'd to disk** and the translog is truncated. Until flush, segments live in OS file cache — fast but not crash-safe." }
] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Refresh vs. Flush", "content": "**Refresh** makes docs searchable (cheap, every ~1 s). **Flush** persists to disk and truncates the translog (expensive, every ~30 s or when translog size threshold is hit). You can tune \`index.refresh_interval\` — setting it to \`-1\` during bulk loads dramatically improves throughput, then restore to \`1s\`." }
\`\`\`

## Segment Merging

Thousands of tiny segments degrade query performance — each one must be searched independently. Background **merge** operations continuously combine small segments into larger ones.

\`\`\`algoviz
{ "title": "Tiered Merge Policy", "type": "array", "data": [200, 180, 50, 48, 12, 8, 15], "frames": [
  { "highlight": [4, 5, 6], "label": "Identify small segments (≤ 20 docs): S4=12, S5=8, S6=15", "stats": { "merge_candidates": "S4+S5+S6" } },
  { "highlight": [4, 5, 6], "label": "Merge-sort their posting lists into new segment S7 (35 docs)", "stats": { "writing": "S7" } },
  { "highlight": [4], "label": "S7 swapped in; S4, S5, S6 deleted after in-flight queries drain", "stats": { "segments": 5 } },
  { "highlight": [2, 3, 4], "label": "Next tier merge: S2+S3+S7 → S8 (~133 docs)", "stats": { "writing": "S8" } },
  { "highlight": [0, 1, 2], "label": "Eventually: top-tier merge produces a massive optimized segment", "stats": { "segments": 3 } }
], "speed": 1000 }
\`\`\`

Merge steps internally:
1. Read posting lists from all source segments
2. Merge-sort posting lists per term
3. Write the combined segment sequentially
4. Atomically swap the new segment in
5. **Delete old segments only after all in-flight queries complete** (reference counting)

## Handling Deletes and Updates

Since segments are immutable, you cannot remove a document from an existing segment.

\`\`\`concept
{ "title": "Tombstone Deletes", "variant": "rule", "content": "A delete marks the document in a per-segment 'live docs' bitset. The posting list still contains the doc ID, but the bitset filters it during query execution. Physical space is only reclaimed at merge time when the new merged segment simply omits deleted docs." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Disk Space After Deletes", "content": "If you delete 90% of your documents, disk usage barely drops until the next merge. In delete-heavy workloads, force-merge (\`POST /index/_forcemerge\`) to reclaim space. Use with caution in production — merging is I/O intensive." }
\`\`\`

**Updates** are implemented as a delete + re-insert. There is no concept of in-place mutation.

## Durability: The Translog

The in-memory buffer is volatile. A crash loses all unflushed documents. A **transaction log (translog)** provides durability at low cost.

\`\`\`trace
{ "title": "Translog-Backed Durability", "language": "python", "code": "def index_doc(doc):\\n    translog.append(doc)      # fsync to disk — happens BEFORE ACK\\n    buffer.add(doc)           # volatile in-memory buffer\\n    return 'acknowledged'\\n\\ndef recover_after_crash():\\n    segments = load_segments_from_disk()   # last flushed state\\n    uncommitted = translog.read_all()      # ops since last flush\\n    for op in uncommitted:\\n        buffer.add(op)                     # rebuild buffer\\n    return segments, buffer", "frames": [
  { "line": 2, "vars": { "doc": "doc_201", "translog": "[]" }, "note": "doc arrives — translog write is first" },
  { "line": 2, "vars": { "translog": "[doc_201]" }, "stdout": "fsync completed\\n", "note": "fsync before returning to client — durability guaranteed" },
  { "line": 3, "vars": { "buffer": "[doc_201]", "translog": "[doc_201]" }, "note": "buffer updated after translog — volatile" },
  { "line": 4, "stdout": "acknowledged\\n", "note": "client gets ACK only after translog is safe" },
  { "line": 8, "vars": { "segments": "[S0,S1,S2]" }, "note": "crash happens — buffer lost, segments intact" },
  { "line": 9, "vars": { "uncommitted": "[doc_201, doc_202]" }, "note": "translog survived on disk" },
  { "line": 11, "vars": { "buffer": "[doc_201, doc_202]" }, "note": "buffer fully reconstructed — no data loss" }
], "speed": 900 }
\`\`\`

\`\`\`tabs
{ "tabs": [
  { "label": "Refresh", "icon": "🔄", "content": "**Frequency:** Every \`index.refresh_interval\` (default 1 s)\\n\\n**What happens:**\\n- In-memory buffer → new Lucene segment (in OS page cache)\\n- New segment opened for search\\n- Buffer cleared\\n- Translog **NOT** truncated (still needed for durability)\\n\\n**Cost:** Low — in-memory operation, no fsync" },
  { "label": "Flush", "icon": "💾", "content": "**Frequency:** Every ~30 s, or when translog exceeds \`index.translog.flush_threshold_size\` (default 512 MB)\\n\\n**What happens:**\\n- All in-memory segments fsync'd to disk\\n- Translog truncated (ops now safely on disk)\\n- Lucene \`commit()\` called\\n\\n**Cost:** Higher — involves fsync; avoid triggering constantly during bulk indexing" },
  { "label": "Force Merge", "icon": "⚡", "content": "**Frequency:** Manual (\`POST /index/_forcemerge?max_num_segments=1\`)\\n\\n**What happens:**\\n- All segments merged into N segments (often 1)\\n- Deleted docs physically removed\\n- Old segments deleted\\n\\n**Cost:** Very high — rewrites entire index; run only on read-only (historical) indexes or during maintenance windows" }
] }
\`\`\`

## End-to-End Pipeline Architecture

\`\`\`sysdiag
{ "title": "Real-time Indexing Pipeline", "width": 740, "height": 400, "nodes": [
  { "id": "src", "label": "Data Sources\\n(crawlers, APIs, CDC)", "x": 60, "y": 200, "kind": "client" },
  { "id": "kafka", "label": "Kafka", "x": 210, "y": 200, "kind": "queue" },
  { "id": "workers", "label": "Indexing Workers\\n(parse, analyze, route)", "x": 380, "y": 200, "kind": "service" },
  { "id": "primary", "label": "Shard Primary\\n(translog + buffer)", "x": 560, "y": 120, "kind": "db" },
  { "id": "replica", "label": "Replica Shards", "x": 680, "y": 200, "kind": "db" },
  { "id": "merge", "label": "Background\\nMerge Process", "x": 560, "y": 320, "kind": "worker" }
], "edges": [
  { "from": "src", "to": "kafka", "label": "events" },
  { "from": "kafka", "to": "workers", "label": "consume stream" },
  { "from": "workers", "to": "primary", "label": "hash(doc_id) → shard" },
  { "from": "primary", "to": "replica", "label": "replicate ops" },
  { "from": "primary", "to": "merge", "label": "segment files" }
], "annotations": {
  "kafka": "Buffers write spikes; enables replay on indexer crash; decouples producers from indexers",
  "workers": "Tokenize, apply analyzers, compute routing key: shard = hash(doc_id) % num_primary_shards",
  "primary": "Write translog (fsync) → add to buffer → refresh every 1s → flush every 30s",
  "merge": "Tiered policy: merge small segments first, reclaim tombstoned space, keep segment count O(log N)"
} }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Tuning for Bulk Indexing", "content": "When loading large historical datasets, the default settings are suboptimal:\\n\\n\`\`\`\\nPUT /my-index/_settings\\n{\\n  \\"index.refresh_interval\\": \\"-1\\",\\n  \\"index.number_of_replicas\\": 0,\\n  \\"index.translog.durability\\": \\"async\\"\\n}\\n\`\`\`\\n\\n- **\`refresh_interval: -1\`** — disables automatic refresh; docs only become searchable after a manual refresh or flush. Eliminates per-second segment creation overhead.\\n- **\`number_of_replicas: 0\`** — skip replication during load; add replicas after. Halves write amplification.\\n- **\`translog.durability: async\`** — relaxes fsync on each doc; risk of losing last ~5 s on crash (acceptable for rebuilds).\\n\\nAfter bulk load completes:\\n\`\`\`\\nPUT /my-index/_settings\\n{ \\"index.refresh_interval\\": \\"1s\\", \\"index.number_of_replicas\\": 1 }\\nPOST /my-index/_forcemerge?max_num_segments=1\\n\`\`\`\\n\\nTypical throughput gain: **3–5×** compared to default settings." }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [
  { "question": "Why are Lucene segments kept immutable after they are written?", "options": ["To reduce memory usage during queries", "To enable sequential writes and avoid random I/O on updates", "To make segment merging simpler to implement", "To comply with the Elasticsearch data model"], "answer": 1, "explanation": "Immutability means new data is always appended as new segments using cheap sequential writes. In-place updates would require reading and rewriting existing posting lists — expensive random I/O at every document insert." },
  { "question": "A 'refresh' in Elasticsearch makes documents searchable. What does a 'flush' additionally accomplish that refresh does not?", "options": ["Creates a new searchable segment from the buffer", "Fsyncs segments to disk and truncates the translog", "Replicates changes to replica shards", "Compresses posting lists using delta encoding"], "answer": 1, "explanation": "Refresh only promotes the buffer to a searchable in-memory segment — no fsync. Flush additionally calls Lucene commit(), fsyncs segments to durable storage, and truncates the translog since those operations are now safely on disk." },
  { "question": "A document is deleted in Elasticsearch. When is its disk space actually reclaimed?", "options": ["Immediately when the delete API call returns", "On the next refresh (within ~1 second)", "During the next segment merge that includes that segment", "When the translog is truncated during flush"], "answer": 2, "explanation": "Deletes are logical: a tombstone bit is set in the segment's live-docs bitset. The deleted doc's disk space is only reclaimed when a merge produces a new segment that simply omits it." },
  { "question": "During crash recovery, what is the purpose of replaying the translog?", "options": ["To restore the inverted index posting lists from scratch", "To rebuild the in-memory buffer with ops written after the last flush", "To re-replicate segments to replica shards", "To re-execute queries that were in flight at crash time"], "answer": 1, "explanation": "The last flush synced segments to disk. The translog contains every indexing operation since that flush. Replaying it reconstructs the in-memory buffer, recovering any docs that were not yet flushed — ensuring zero data loss for acknowledged writes." }
] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Immutable segments avoid random I/O on writes: new docs buffer in RAM, then flush sequentially as new segment files.",
  "The 1-second refresh interval is the default NRT bargain — tune it to -1 for bulk loads, then restore it after.",
  "Refresh makes docs searchable (cheap, in-memory); flush syncs to disk and truncates the translog (expensive).",
  "Deletes are logical tombstones — physical space reclaimed only at merge time; force-merge to compact delete-heavy indexes.",
  "The translog guarantees durability: every acknowledged write survives a crash and is replayed during recovery.",
  "Kafka between data sources and indexing workers decouples ingestion spikes from shard write pressure and enables replay on worker failure."
] }
\`\`\``,
    },
    {
      id: "search-architecture",
      slug: "search-architecture",
      title: "Search Engine: Architecture Walkthrough",
      content: `# Search Engine: Architecture Walkthrough

Bring every component together into a production-grade distributed search engine — this is where inverted indexes, BM25 scoring, shard topology, and the segment architecture converge into a single cohesive system.

\`\`\`concept
{ "title": "The Four Pillars of Distributed Search", "variant": "mental-model", "content": "Every distributed search engine rests on four pillars:\\n\\n1. **Inverted Index** — O(log V) term lookup instead of O(N) full scans\\n2. **BM25 Scoring** — Relevance ranking that outperforms raw TF-IDF in practice\\n3. **Document Sharding** — Horizontal scale via partitioned Lucene indices\\n4. **Segment Architecture** — Near-real-time ingestion with 1-second refresh windows\\n\\nThe coordinator pattern (scatter-gather) ties these together: fan out every query, merge globally, return top-K. Any node can play coordinator — there is no dedicated gateway bottleneck." }
\`\`\`

## Complete Cluster Layout

\`\`\`sysdiag
{ "title": "Elasticsearch-Style Cluster", "width": 720, "height": 440,
  "nodes": [
    { "id": "client", "label": "Client", "x": 360, "y": 30, "kind": "user" },
    { "id": "coord", "label": "Coordinator\\n(any node)", "x": 360, "y": 120, "kind": "service" },
    { "id": "ingest", "label": "Ingest Node\\n(pipelines)", "x": 180, "y": 120, "kind": "service" },
    { "id": "master", "label": "Master Node\\n(cluster state)", "x": 540, "y": 120, "kind": "service" },
    { "id": "n1", "label": "Data Node 1\\nJVM + disks", "x": 120, "y": 300, "kind": "storage" },
    { "id": "n2", "label": "Data Node 2\\nJVM + disks", "x": 360, "y": 300, "kind": "storage" },
    { "id": "n3", "label": "Data Node 3\\nJVM + disks", "x": 600, "y": 300, "kind": "storage" }
  ],
  "edges": [
    { "from": "client", "to": "coord", "label": "query / index" },
    { "from": "client", "to": "ingest", "label": "bulk ingest" },
    { "from": "ingest", "to": "coord", "label": "forwarded doc" },
    { "from": "coord", "to": "n1", "label": "scatter" },
    { "from": "coord", "to": "n2", "label": "scatter" },
    { "from": "coord", "to": "n3", "label": "scatter" },
    { "from": "n1", "to": "coord", "label": "gather" },
    { "from": "n2", "to": "coord", "label": "gather" },
    { "from": "n3", "to": "coord", "label": "gather" },
    { "from": "master", "to": "n1", "label": "cluster state" },
    { "from": "master", "to": "n2", "label": "cluster state" },
    { "from": "master", "to": "n3", "label": "cluster state" }
  ],
  "annotations": {
    "coord": "Parses query, routes to shards, merges top-K results from all data nodes",
    "ingest": "Runs enrichment pipelines (normalize, deduplicate, geo-resolve) before indexing",
    "master": "Owns cluster state: shard allocation map, index settings, node membership",
    "n1": "Hosts: logs-P0 (primary), logs-R1 (replica), prods-R0 (replica)",
    "n2": "Hosts: logs-P1 (primary), prods-P0 (primary) — heavy write traffic",
    "n3": "Hosts: logs-P2 (primary), prods-P1 (primary), prods-R1 (replica)"
  } }
\`\`\`

Each data node runs a single JVM process that hosts multiple **shards** (Lucene indices). A shard is either a **primary** (accepts writes, source of truth) or a **replica** (read-only copy, automatic failover target). The coordinator role is ephemeral — any node receiving a client request becomes the coordinator for that request.

## Node Roles Deep Dive

\`\`\`tabs
{ "tabs": [
  { "label": "Master Node", "icon": "👑", "content": "**Responsible for cluster-wide coordination only** — it never stores user data.\\n\\n- Publishes and versions the **cluster state** (shard allocation map, index metadata)\\n- Elects itself via Raft/Bully quorum — majority of master-eligible nodes must agree to prevent split-brain\\n- Broadcasts state diffs (not full snapshots) to data nodes after each change\\n- Lightweight: keep master-eligible nodes on small instances, away from data I/O\\n\\n\`\`\`\\nQuorum = floor(master_eligible_nodes / 2) + 1\\n# 3 master-eligible → quorum = 2\\n# 5 master-eligible → quorum = 3\\n\`\`\`" },
  { "label": "Data Node", "icon": "💾", "content": "**Workhorse of the cluster** — stores shards, runs Lucene, CPU/IO intensive.\\n\\n| Sub-role | Description |\\n|---|---|\\n| **Hot** | SSD, recent data, high write throughput |\\n| **Warm** | HDD, older data, lower QPS |\\n| **Cold** | Object storage (S3), archival, read-only |\\n\\nUse index lifecycle management (ILM) to tier data automatically as it ages." },
  { "label": "Coordinating Node", "icon": "🔀", "content": "**Stateless scatter-gather node** — holds no local shards.\\n\\nDedicated coordinating nodes are useful when:\\n- Query merging CPU is a bottleneck (e.g., large aggregations)\\n- You want to isolate data nodes from client connection overhead\\n- Fan-out is wide (hundreds of shards per query)\\n\\nWithout dedicated coordinators, any data node can temporarily play this role at no correctness cost." },
  { "label": "Ingest Node", "icon": "🔧", "content": "**Pre-indexing pipeline executor** — runs before documents reach data nodes.\\n\\nCommon pipeline processors:\\n- \`grok\` — regex-based field extraction from raw log lines\\n- \`geoip\` — enrich IP addresses with country/city metadata\\n- \`date\` — normalize timestamp formats\\n- \`drop\` — discard documents matching a predicate\\n- \`script\` — arbitrary Painless scripts for custom transformations\\n\\nFor high-volume pipelines, consider offloading to Logstash or a Kafka consumer instead." },
  { "label": "Failure Detection", "icon": "🔍", "content": "Nodes exchange **gossip-style heartbeats** every 500 ms.\\n\\n- **3 missed pings** → node marked offline\\n- Master triggers **shard reallocation**: promotes a replica to primary for each orphaned primary shard\\n- Cluster transitions: \`GREEN → YELLOW\` (replicas missing) → recovers to \`GREEN\` as new replicas are allocated\\n- \`RED\` only if a primary shard has **no surviving replica** — data unavailable until node recovers or snapshot restored" }
] }
\`\`\`

## Write Path: End-to-End

\`\`\`steps
{ "title": "Indexing a Document (POST /products/_doc/42)", "steps": [
  { "title": "Client Request", "content": "Client sends:\\n\`\`\`json\\nPOST /products/_doc/42\\n{ \\"name\\": \\"Widget\\", \\"price\\": 9.99 }\\n\`\`\`\\nRequest hits any node — that node becomes the coordinator." },
  { "title": "Shard Routing", "content": "Coordinator calculates target primary:\\n\`\`\`\\nshard = hash(doc_id) % number_of_primary_shards\\nhash(\\"42\\") % 2  →  shard 0  →  prods-P0 @ Node 2\\n\`\`\`\\nThis formula is fixed at index creation time — changing shard count requires reindexing." },
  { "title": "Primary Write", "content": "Node 2 (primary owner):\\n1. **Analyzes** text fields: \`\\"Widget\\"\` → \`[\\"widget\\"]\` (lowercased, stemmed)\\n2. **Translog fsync** — durability guarantee before ACK\\n3. Adds document to **in-memory write buffer**\\n4. ACKs coordinator" },
  { "title": "Replica Replication", "content": "Node 2 **streams the operation** to every replica in parallel.\\n\\n\`wait_for_active_shards\` (default: \`1\`) controls how many replicas must ACK before the client response. Setting to \`all\` maximizes durability at the cost of write latency." },
  { "title": "Refresh → Searchable", "content": "After **1 second** (default \`index.refresh_interval\`), the in-memory buffer is flushed to a new **immutable Lucene segment**.\\n\\nDocument 42 is now visible to search queries. Before refresh, it exists only in the translog — durable but not searchable.\\n\\n\`\`\`\\nRefresh interval trade-off:\\n  Lower (100ms)  → more real-time, higher merge pressure\\n  Higher (30s)   → better bulk ingest throughput, staleness\\n  -1             → disable auto-refresh (bulk load mode)\\n\`\`\`" },
  { "title": "Segment Merge (Background)", "content": "Lucene accumulates many small segments. A background **merge policy** combines them into larger ones:\\n- Fewer segments → faster searches (fewer files to scan)\\n- Merge is CPU/IO intensive — runs throttled in the background\\n- Deleted documents are physically purged only during merges" }
] }
\`\`\`

## Read Path: Scatter-Gather Traced

\`\`\`trace
{ "title": "Search for 'widget' across 2 shards", "language": "python", "code": "# GET /products/_search?q=widget\\n# Coordinator (Node 2) logic\\n\\nquery  = {\\"match\\": {\\"name\\": \\"widget\\"}}\\nshards = [\\"prods-P0@Node2\\", \\"prods-P1@Node3\\"]  # one copy each\\n\\ndef scatter(shards, query):\\n    futures = [async_search(s, query) for s in shards]\\n    return await gather(futures)\\n\\ndef merge_results(results):\\n    merged = heapq.merge(*results, key=lambda x: -x.score)\\n    top_k  = list(merged)[:10]          # global top-10\\n    docs   = fetch_sources(top_k)        # multi-get full _source\\n    return docs\\n\\n# Shard-local BM25 results:\\n# prods-P0 → [(id=42, score=8.3), (id=87, score=5.1)]\\n# prods-P1 → [(id=155, score=7.2), (id=301, score=4.8)]", "frames": [
  { "line": 4, "vars": { "query": "{ match: { name: 'widget' } }" }, "note": "Coordinator parses the query", "stdout": "" },
  { "line": 5, "vars": { "shards": ["prods-P0@Node2", "prods-P1@Node3"] }, "note": "Route to one copy of each shard (adaptive replica selection picks lowest-latency)", "stdout": "" },
  { "line": 8, "vars": { "futures": ["Future<P0>", "Future<P1>"] }, "note": "Concurrent fan-out — both shards searched in parallel", "stdout": "" },
  { "line": 12, "vars": { "results": [["(42,8.3)","(87,5.1)"], ["(155,7.2)","(301,4.8)"]] }, "note": "Shard results arrive; each scored locally against its own segment statistics", "stdout": "" },
  { "line": 13, "vars": { "merged": ["(42,8.3)","(155,7.2)","(87,5.1)","(301,4.8)"] }, "note": "Global merge by BM25 score — coordinator holds only IDs + scores, not full docs", "stdout": "" },
  { "line": 14, "vars": { "top_k": ["(42,8.3)","(155,7.2)","(87,5.1)"] }, "note": "Keep top-10 globally (3 shown here for demo)", "stdout": "" },
  { "line": 15, "vars": { "docs": [{"_id":42,"name":"Widget","price":9.99}, {"_id":155,"name":"Widget Pro","price":19.99}, {"_id":87,"name":"Blue Widget","price":7.50}] }, "note": "Second round-trip: fetch full _source for top-K doc IDs only", "stdout": "[ Widget $9.99, Widget Pro $19.99, Blue Widget $7.50 ]" }
], "speed": 900 }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "The DFS_QUERY_THEN_FETCH Problem", "content": "BM25 uses **per-shard IDF** by default. If \`widget\` appears in 1000 docs on Shard 0 but only 5 docs on Shard 1, Shard 1 will assign inflated scores — skewing global rankings.\\n\\nFix: use \`search_type=dfs_query_then_fetch\` to collect global term statistics first. Cost: one extra round-trip. Usually only needed for small indices with uneven shard distribution." }
\`\`\`

## Fault Tolerance: Before and After a Node Crash

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Node 2 disappears (prods-P0 primary)", "code": "Writes to /products/_doc/* → 503 Service Unavailable\\nCluster health → RED (primary shard unavailable)\\nprods-P0 primary: UNASSIGNED\\nprods-P1 primary: OK (Node 3)\\nAll replicas of prods-P0: prods-R0 on Node 1 (idle)" }, "after": { "label": "Automatic recovery — seconds later", "code": "Master detects Node 2 missing (3 missed heartbeats ~1.5s)\\nMaster promotes prods-R0 on Node 1 → new primary\\nCluster health → YELLOW (all primaries OK, 1 replica missing)\\nMaster allocates new prods-R0 replica on Node 3\\nCluster health → GREEN\\nZero data lost: translog + replica ensure full durability" } }
\`\`\`

The recovery path relies on two guarantees:
- **Translog** — every write is fsynced to disk before ACK, so the promoted replica is guaranteed to be at least as current as the last acknowledged write
- **Replica lag** — \`wait_for_active_shards\` ensures no write is confirmed until the requested number of replicas have applied it

## Performance Optimizations

\`\`\`tabs
{ "tabs": [
  { "label": "Query Cache", "icon": "⚡", "content": "**Filter bitsets** are cached per segment, not per query.\\n\\nWhen you run \`{ \\"bool\\": { \\"filter\\": { \\"term\\": { \\"status\\": \\"active\\" } } } }\`, Lucene caches the matching doc-ID bitset. On the next query with the same filter, the bitset is reused — BM25 scoring runs only on the pre-filtered candidate set.\\n\\n- Cache is **segment-local**: invalidated only when a new segment appears (after refresh)\\n- Most effective for high-cardinality filters reused across queries (e.g., \`status\`, \`region\`, \`tier\`)" },
  { "label": "Doc Values", "icon": "📊", "content": "**Columnar on-disk storage** for aggregations and sorting — the inverse of the row-oriented \`_source\`.\\n\\n\`\`\`\\n_source (row):    { id:1, price:9.99, region:\\"us\\" }\\n                  { id:2, price:19.99, region:\\"eu\\" }\\n\\ndoc_values (col): price  → [9.99, 19.99, ...]\\n                  region → [\\"us\\", \\"eu\\", ...]\\n\`\`\`\\n\\nLoaded into OS page cache on demand. \`text\` fields use \`fielddata\` (heap-resident, expensive) — prefer \`keyword\` for aggregations." },
  { "label": "Adaptive Replica Selection", "icon": "🎯", "content": "The coordinator tracks **1-minute latency history** per shard copy.\\n\\nOn each search it routes to the replica with the lowest rolling average response time — avoiding hot data nodes that are GC-pausing or merging.\\n\\nConfigure \`cluster.routing.use_adaptive_replica_selection: true\` (default on since ES 7.x)." },
  { "label": "Index Sorting", "icon": "📈", "content": "Pre-sort segments by a field (e.g., \`@timestamp desc\`) at write time:\\n\\n\`\`\`json\\n\\"index.sort.field\\": \\"@timestamp\\",\\n\\"index.sort.order\\": \\"desc\\"\\n\`\`\`\\n\\nBenefit: **early termination** on top-K queries — Lucene can stop scanning a segment once it finds K hits that beat the current worst score. Critical for time-series log indexes where newest results dominate." },
  { "label": "Shard Sizing", "icon": "📐", "content": "**Rule of thumb: 10–50 GB per shard, 1–5 shards per node per index.**\\n\\n| Problem | Symptom | Fix |\\n|---|---|---|\\n| Over-sharding | High heap overhead, slow cluster state | Shrink / merge indices |\\n| Under-sharding | CPU underutilized, slow bulk indexing | Split API before prod |\\n| Uneven shards | Hot nodes, cold nodes | Force-balance via reroute API |\\n\\nFor time-series data, use **index rollover** (e.g., daily): keeps shard count manageable as data ages." }
] }
\`\`\`

## System Comparison

| Feature | Elasticsearch | Apache Solr | Meilisearch |
|---|---|---|---|
| Storage engine | Lucene | Lucene | Custom (LMDB-backed) |
| Scoring | BM25 | BM25 | Typo-tolerant custom |
| Distribution | Built-in cluster | ZooKeeper-coordinated | Single-node (v1); experimental cluster in v1.x |
| Real-time search | ~1 s refresh | Soft/hard commit | Millisecond |
| Schema | Dynamic mapping | Schema required (can be relaxed) | Schemaless |
| Aggregations | Full (buckets, metrics, pipeline) | Facets, pivot | Limited |
| Primary use-case | Logs, analytics, APM | Enterprise document search | End-user product/autocomplete search |

\`\`\`callout
{ "type": "info", "title": "When NOT to Use Elasticsearch", "content": "Elasticsearch excels at full-text search and log analytics, but consider alternatives when:\\n\\n- **Transactional workloads** — use PostgreSQL; ES offers no ACID guarantees\\n- **Sub-millisecond lookups by ID** — use Redis or a KV store; ES heap overhead is not justified\\n- **Simple autocomplete only** — Meilisearch or Typesense is operationally simpler\\n- **Vector-only search** — Pinecone, Weaviate, or Qdrant are purpose-built; ES vector support is newer and less optimized" }
\`\`\`

## Putting It All Together: The Lifecycle of a Query

\`\`\`algoviz
{ "title": "Scatter-Gather on a 3-Shard Index", "type": "array", "data": ["Shard 0\\nNode 1", "Shard 1\\nNode 2", "Shard 2\\nNode 3"],
  "frames": [
    { "highlight": [], "label": "Client sends GET /logs/_search?q=error to coordinator (Node 2)", "stats": { "phase": "receive" } },
    { "highlight": [0, 1, 2], "label": "Coordinator fans out in parallel to all 3 shards", "stats": { "phase": "scatter", "requests": 3 } },
    { "highlight": [0], "label": "Shard 0 returns [(id=101, 9.2), (id=304, 6.1)]", "stats": { "phase": "gather", "shard_done": 1 } },
    { "highlight": [2], "label": "Shard 2 returns [(id=201, 8.7), (id=450, 5.3)]", "stats": { "phase": "gather", "shard_done": 2 } },
    { "highlight": [1], "label": "Shard 1 returns [(id=88, 7.4), (id=500, 4.9)] — last to arrive", "stats": { "phase": "gather", "shard_done": 3 } },
    { "highlight": [0, 1, 2], "label": "Coordinator merges all 6 results globally → top-3: [101, 201, 88]", "stats": { "phase": "merge", "candidates": 6, "top_k": 3 } },
    { "highlight": [], "label": "Coordinator fetches _source for doc IDs [101, 201, 88] via multi-get", "stats": { "phase": "fetch", "docs": 3 } }
  ],
  "speed": 1000 }
\`\`\`

\`\`\`quiz
{ "title": "Architecture Check", "questions": [
  { "question": "Which node becomes the coordinator for a search request in Elasticsearch?", "options": ["The master node always", "A dedicated coordinator-only node if one exists, otherwise any node", "Any node can volunteer regardless of role", "The node holding the most matching shards"], "answer": 2, "explanation": "Elasticsearch is fully peer-to-peer for query routing. Any node that receives the request acts as coordinator. Dedicated coordinator-only nodes are an optimization, not a requirement — any data node can also coordinate." },
  { "question": "A document is indexed at T=0. At T=0.5s, a search query runs. What is the expected result?", "options": ["Document appears — translog makes it immediately searchable", "Document appears — replicas propagate instantly", "Document does not appear — the 1-second refresh has not occurred yet", "Document may or may not appear — it depends on query caching"], "answer": 2, "explanation": "Elasticsearch is near-real-time, not real-time. Documents are only searchable after a segment refresh, which happens every 1 second by default. The translog ensures durability but not searchability." },
  { "question": "Why does the cluster enter YELLOW status after a single data node crashes?", "options": ["Some primary shards are unassigned — data is at risk", "Some replica shards are unassigned — all primaries are still healthy", "The master node is re-electing and blocking writes", "The translog is being replayed on the surviving nodes"], "answer": 1, "explanation": "YELLOW means all primary shards are assigned (data is readable and writable) but one or more replicas are unassigned. The surviving replicas are promoted to primaries; missing replicas are reallocated to other nodes, eventually restoring GREEN status." },
  { "question": "You have a busy aggregation dashboard that runs \`{ filter: { term: { region: 'us' } } }\` thousands of times per second. Which optimization has the highest impact?", "options": ["Increase the number of primary shards", "Enable doc values on the \`region\` field", "Switch from POST to GET requests", "Increase the refresh interval to 30s"], "answer": 1, "explanation": "Doc values store field data in a columnar format on disk, loaded into the OS page cache for aggregations. Combined with Lucene's filter bitset cache (which caches the doc-ID set matching \`region:us\` per segment), this dramatically reduces repeated computation. Refresh interval affects write throughput, not aggregation performance." },
  { "question": "What is the primary purpose of the translog in Elasticsearch?", "options": ["To cache frequently accessed documents for faster reads", "To ensure durability — replaying writes after a crash before the Lucene segment is flushed", "To coordinate replication between primary and replica shards", "To store the cluster state and shard allocation map"], "answer": 1, "explanation": "The translog is an append-only write-ahead log. Every indexed document is written to the translog and fsynced before the client receives an ACK. If the node crashes before the in-memory buffer is flushed to a segment, the translog replays the lost writes on recovery — similar to a WAL in PostgreSQL." }
] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: DFS_QUERY_THEN_FETCH vs QUERY_THEN_FETCH", "content": "## Why Shard-Local IDF Causes Scoring Drift\\n\\nBM25 uses **Inverse Document Frequency (IDF)** — terms appearing in fewer documents score higher. In a distributed index, each shard computes IDF against its **local document set**, not the global corpus.\\n\\n**Scenario:** 1M docs split across 5 shards. The term \`elasticsearch\` appears in:\\n- Shard 0: 2 of 200k docs → very high IDF → high scores\\n- Shard 4: 180k of 200k docs → very low IDF → low scores\\n\\nA document on Shard 0 about \`elasticsearch\` will outscore an identical document on Shard 4 purely due to shard imbalance.\\n\\n## The Fix: DFS Phase\\n\\n\`search_type=dfs_query_then_fetch\` adds a pre-flight phase:\\n1. **DFS phase:** Coordinator collects global term statistics (total doc count, per-term doc frequency) from all shards\\n2. **Query phase:** Each shard scores using **global IDF** instead of local IDF\\n3. **Fetch phase:** Coordinator fetches full source for top-K\\n\\nCost: one extra network round-trip per query. Worth it for small indices with uneven distributions, not recommended for large balanced indices where local IDF approximates global IDF well." }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Inverted index + BM25 + sharding + Lucene segments = the four-layer foundation of scalable relevance search",
  "The coordinator scatter-gather pattern is stateless — any node can coordinate, enabling horizontal scale without a fixed gateway bottleneck",
  "Translog + replica shards provide two independent durability guarantees: survive a crash (translog replay) and survive a node loss (replica promotion)",
  "The 1-second refresh window is a deliberate trade-off: near-real-time search without the merge overhead of instant segment creation",
  "Cluster health (GREEN/YELLOW/RED) maps precisely to primary and replica shard assignment — understanding this is the first step to diagnosing any production incident"
] }
\`\`\``,
    },
  ],
};

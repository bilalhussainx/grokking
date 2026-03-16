import { Module } from "../types";

export const searchEngineModule: Module = {
  id: "design-search",
  title: "Designing a Distributed Search Engine",
  description:
    "Design a distributed search engine: inverted indexes, TF-IDF and BM25 scoring, distributed indexing, real-time ingestion pipelines, and complete Elasticsearch-inspired architecture walkthrough.",
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

The **inverted index** is the core data structure of every search engine. Instead of mapping documents to their words (a forward index), it maps each word to the list of documents that contain it.

## Forward Index vs. Inverted Index

\`\`\`
Forward Index (what a database stores):
  doc_1: "the quick brown fox jumps over the lazy dog"
  doc_2: "the fox is quick and brown"
  doc_3: "a lazy dog sleeps"

Inverted Index (what a search engine stores):
  "brown"  --> [doc_1, doc_2]
  "dog"    --> [doc_1, doc_3]
  "fox"    --> [doc_1, doc_2]
  "jumps"  --> [doc_1]
  "lazy"   --> [doc_1, doc_3]
  "quick"  --> [doc_1, doc_2]
  "sleeps" --> [doc_3]
  ...

Query: "quick fox"
  "quick" --> [doc_1, doc_2]
  "fox"   --> [doc_1, doc_2]
  Intersect: [doc_1, doc_2]  (both contain both terms)
\`\`\`

To search for a term, you look up its **posting list** -- the sorted list of document IDs containing that term. For multi-term queries, you intersect or union the posting lists.

## Anatomy of a Posting List

A basic posting list stores just document IDs. A richer posting list stores additional metadata for scoring and highlighting:

\`\`\`
Posting List for "quick"
=========================

Basic:
  [doc_1, doc_2]

With term frequency (TF):
  [(doc_1, tf=1), (doc_2, tf=1)]

With positions (for phrase queries):
  [(doc_1, tf=1, positions=[1]),
   (doc_2, tf=1, positions=[3])]

With field information:
  [(doc_1, tf=1, positions=[1], field="body"),
   (doc_2, tf=1, positions=[3], field="title")]

Positions enable phrase queries:
  Query: "quick brown"
  "quick" in doc_1: position 1
  "brown" in doc_1: position 2
  Position difference = 1 --> adjacent --> phrase match!
\`\`\`

## Tokenization Pipeline

Before building the index, documents pass through an **analyzer** that transforms raw text into index terms:

\`\`\`
Analyzer Pipeline
==================

Input: "The Quick Brown Fox's 2nd Jump!"

Step 1: Character filters
  Remove HTML, normalize unicode
  --> "The Quick Brown Fox's 2nd Jump!"

Step 2: Tokenizer (split into tokens)
  --> ["The", "Quick", "Brown", "Fox's", "2nd", "Jump"]

Step 3: Token filters (applied in order)
  a. Lowercase:     ["the", "quick", "brown", "fox's", "2nd", "jump"]
  b. Possessive:    ["the", "quick", "brown", "fox", "2nd", "jump"]
  c. Stop words:    ["quick", "brown", "fox", "2nd", "jump"]
  d. Stemming:      ["quick", "brown", "fox", "2nd", "jump"]
     (Porter stemmer: "jumping" --> "jump", "ran" --> "run")

Final tokens indexed: ["quick", "brown", "fox", "2nd", "jump"]
\`\`\`

## Document Frequency and Collection Statistics

For relevance scoring, the index also stores global statistics:

\`\`\`
Collection Statistics
======================

Total documents (N):         1,000,000
Total tokens:                500,000,000

Per-term statistics:
  Term        | Doc Frequency (DF) | Collection Frequency
  ------------|-------------------|---------------------
  "the"       | 950,000           | 12,000,000
  "quick"     | 5,200             | 8,100
  "fox"       | 1,800             | 2,300
  "quetzal"   | 12                | 15

Inverse Document Frequency: IDF(term) = log(N / DF)
  IDF("the")     = log(1M / 950K) = 0.02  (very common, low value)
  IDF("quick")   = log(1M / 5200) = 5.26  (moderately rare)
  IDF("quetzal") = log(1M / 12)   = 11.3  (very rare, high value)
\`\`\`

## Index Storage Format

Modern search engines store the inverted index in **immutable segments** on disk:

\`\`\`
Index Segment Layout
=====================

Segment file structure:
+-------------------+
| Term Dictionary   |  (sorted terms + offset to posting list)
+-------------------+
| Posting Lists     |  (compressed doc ID arrays + TF + positions)
+-------------------+
| Stored Fields     |  (original document fields for retrieval)
+-------------------+
| Doc Values        |  (columnar data for sorting/aggregations)
+-------------------+
| Norms             |  (field length norms for scoring)
+-------------------+

Term Dictionary (sorted, binary-searchable):
  "brown"   -> offset 0x1A00
  "fox"     -> offset 0x1B40
  "quick"   -> offset 0x1C80
  ...

Posting list at offset 0x1C80 ("quick"):
  [doc_1: tf=1, pos=[1]] [doc_2: tf=1, pos=[3]]
  (delta-encoded and compressed)
\`\`\`

## Compression Techniques

Posting lists can be enormous. Delta encoding plus variable-byte encoding compress them dramatically:

\`\`\`
Posting List Compression
=========================

Raw doc IDs:     [1, 5, 12, 100, 101, 500]
Delta-encoded:   [1, 4, 7, 88, 1, 399]
  (store differences instead of absolutes)

Variable-byte encoding (VByte):
  1   --> 1 byte
  4   --> 1 byte
  7   --> 1 byte
  88  --> 1 byte
  1   --> 1 byte
  399 --> 2 bytes

Raw: 6 x 4 bytes = 24 bytes
Compressed: 7 bytes (71% reduction)

For billion-document indexes, this compression
saves terabytes of storage and I/O bandwidth.
\`\`\`

## Key Takeaway

The inverted index maps every unique term to a sorted list of documents containing that term. Posting lists store term frequencies and positions for scoring and phrase queries. The analyzer pipeline normalizes text into consistent tokens. Collection-wide statistics like document frequency enable relevance scoring. Efficient compression (delta + VByte encoding) makes it feasible to store indexes for billions of documents.`,
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

## Term Frequency - Inverse Document Frequency (TF-IDF)

TF-IDF is the foundation of text relevance scoring. It combines two intuitions:

1. **Term Frequency (TF):** A term that appears more often in a document is more relevant to that document
2. **Inverse Document Frequency (IDF):** A term that appears in fewer documents is more discriminating

\`\`\`
TF-IDF Formula
===============

TF(t, d) = count of term t in document d
            --------------------------------
            total terms in document d

IDF(t) = log( N / DF(t) )
  where N = total documents, DF = documents containing term t

TF-IDF(t, d) = TF(t, d) x IDF(t)


Example: Query "quick fox" against doc_1

doc_1: "the quick brown fox jumps over the quick lazy fox"
  Total terms = 10
  TF("quick", doc_1) = 2/10 = 0.20
  TF("fox", doc_1)   = 2/10 = 0.20

Collection: N = 1,000,000 documents
  DF("quick") = 5,200    IDF = log(1M/5200)  = 5.26
  DF("fox")   = 1,800    IDF = log(1M/1800)  = 6.32

TF-IDF("quick", doc_1) = 0.20 x 5.26 = 1.05
TF-IDF("fox", doc_1)   = 0.20 x 6.32 = 1.26

Total score for doc_1 = 1.05 + 1.26 = 2.31
\`\`\`

## BM25 (Best Matching 25)

BM25 is the **industry-standard** scoring algorithm. It improves on TF-IDF with two refinements:

1. **Term frequency saturation:** Diminishing returns -- the 10th occurrence of a term matters less than the 2nd
2. **Document length normalization:** Longer documents are penalized (they match more terms by chance)

\`\`\`
BM25 Formula
==============

score(q, d) = SUM over each term t in query q:
    IDF(t) x  (TF(t,d) x (k1 + 1))
              ----------------------------------
              TF(t,d) + k1 x (1 - b + b x |d|/avgdl)

Parameters:
  k1 = 1.2  (term frequency saturation; higher = TF matters more)
  b  = 0.75 (length normalization; 0 = no normalization, 1 = full)
  |d| = length of document d (in terms)
  avgdl = average document length in the collection

IDF(t) = log( (N - DF(t) + 0.5) / (DF(t) + 0.5) + 1 )


TF Saturation Effect (k1=1.2):
  TF=1:   score contribution = 1.0
  TF=2:   score contribution = 1.5
  TF=5:   score contribution = 1.9
  TF=10:  score contribution = 2.1
  TF=100: score contribution = 2.2  (barely more than TF=10)
\`\`\`

## Boolean Queries

Before scoring, the engine must determine which documents match the query:

\`\`\`
Boolean Query Types
====================

AND: "quick AND fox"
  Intersect posting lists:
  "quick" -> [1, 2, 5, 8, 12]
  "fox"   -> [1, 3, 5, 9, 12]
  Result:    [1, 5, 12]

OR: "quick OR fox"
  Union posting lists:
  Result: [1, 2, 3, 5, 8, 9, 12]

NOT: "quick NOT fox"
  Difference:
  Result: [2, 8]

Efficient intersection (merge join on sorted lists):
  i=0, j=0
  Compare list_A[i] with list_B[j]:
    If equal: add to result, advance both
    If A[i] < B[j]: advance i
    If A[i] > B[j]: advance j

  Time: O(|A| + |B|) -- linear in posting list lengths
\`\`\`

## Phrase Queries

Phrase queries like "quick brown fox" require terms to appear adjacently and in order:

\`\`\`
Phrase Query: "quick brown fox"
================================

Posting lists with positions:
  "quick": [(doc_1, pos=[1, 7]), (doc_2, pos=[3])]
  "brown": [(doc_1, pos=[2]),    (doc_2, pos=[4])]
  "fox":   [(doc_1, pos=[3]),    (doc_2, pos=[5])]

For doc_1:
  "quick" at position 1, "brown" at position 2, "fox" at position 3
  Positions are consecutive (1, 2, 3) --> PHRASE MATCH!

  "quick" at position 7 -- no "brown" at position 8
  --> No phrase match for this occurrence

For doc_2:
  "quick" at 3, "brown" at 4, "fox" at 5
  Consecutive --> PHRASE MATCH!

Without stored positions, phrase queries are impossible.
\`\`\`

## Multi-Field Scoring

Documents have multiple fields (title, body, tags) with different importance:

\`\`\`
Field Boosting
===============

Query: "distributed systems"

doc_1:
  title: "Distributed Systems Design"    (match in title)
  body:  "This article covers networking..."  (no match)

doc_2:
  title: "Cloud Computing Overview"       (no match)
  body:  "...discusses distributed systems..."  (match in body)

Field boosts:
  title:  boost = 3.0
  body:   boost = 1.0
  tags:   boost = 2.0

doc_1 score = BM25("distributed systems", title) x 3.0 = 4.5
doc_2 score = BM25("distributed systems", body)  x 1.0 = 1.8

doc_1 ranks higher (title match is more important)
\`\`\`

## Query Processing Pipeline

\`\`\`
Query Processing Flow
======================

User query: "Running quick foxes!"
     |
     v
[Query Analyzer]
  1. Tokenize:    ["Running", "quick", "foxes"]
  2. Lowercase:   ["running", "quick", "foxes"]
  3. Stem:        ["run", "quick", "fox"]
     |
     v
[Query Planner]
  1. Look up posting lists for each term
  2. Estimate cost (posting list lengths)
  3. Choose execution strategy:
     - Short lists first (for AND queries)
     - Skip lists for fast intersection
     |
     v
[Posting List Intersection/Union]
  Matching doc set: [1, 5, 12, ...]
     |
     v
[BM25 Scorer]
  Score each matching document
     |
     v
[Top-K Selection]
  Priority queue: keep only top 10 results
     |
     v
[Return Results]
  [(doc_5, 8.3), (doc_1, 7.1), (doc_12, 6.8), ...]
\`\`\`

## Key Takeaway

BM25 is the default scoring algorithm in Elasticsearch, Solr, and Lucene. It improves on raw TF-IDF by adding term frequency saturation and document length normalization. Boolean operations on posting lists determine which documents match, and positional data enables phrase queries. The query analyzer must apply the same tokenization pipeline as the indexer so that "Running" in the query matches "running" in the index.`,
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

Users expect new content to be searchable within seconds. A search engine must continuously ingest new documents, update the inverted index, and make changes visible to queries -- all without disrupting ongoing searches.

## The Challenge

Inverted indexes are optimized for reads, not writes. Updating a posting list for every new document would require rewriting large portions of the index on disk. The solution is to use **immutable segments** with periodic **merging**.

\`\`\`
The Write Problem
==================

Naive approach: update inverted index in place
  1. New document contains term "fox"
  2. Read posting list for "fox": [1, 5, 12, 88, 200, ...]
  3. Append doc_201: [1, 5, 12, 88, 200, 201]
  4. Write updated posting list back to disk

Problem:
  - Every new document modifies many posting lists
  - Random I/O on disk is slow
  - Concurrent reads see inconsistent state during updates
  - Cannot do this at 10,000 docs/sec

Solution: buffer writes in memory, flush as immutable segments
\`\`\`

## Segment-Based Architecture

Inspired by Lucene (used by Elasticsearch and Solr), the index consists of multiple immutable segments:

\`\`\`
Segment-Based Index
=====================

Memory:
+---------------------+
| In-Memory Buffer    |  <-- new documents go here
| (RAM, mutable)      |
| doc_201, doc_202... |
+---------------------+
        |
        | flush (every N docs or M seconds)
        v
Disk:
+----------+  +----------+  +----------+  +----------+
| Segment 0|  | Segment 1|  | Segment 2|  | Segment 3|
| (immutable)| (immutable)| (immutable)| (immutable)|
| docs 1-50 | | docs 51- | | docs 101-| | docs 151-|
|           | | 100      | | 150      | | 200      |
+----------+  +----------+  +----------+  +----------+

Search = query ALL segments + merge results
\`\`\`

## The Refresh Cycle

The **refresh interval** controls how quickly new documents become searchable:

\`\`\`
Refresh Cycle (Elasticsearch default: 1 second)
================================================

T=0.0s: doc_201 arrives --> written to in-memory buffer
T=0.3s: doc_202 arrives --> written to in-memory buffer
T=0.7s: doc_203 arrives --> written to in-memory buffer

T=1.0s: REFRESH
  1. In-memory buffer is converted to a new segment
  2. New segment is opened for searching
  3. A new empty buffer is created for incoming docs
  4. docs 201-203 are now searchable!

T=1.1s: Query arrives
  Search segments: [S0, S1, S2, S3, S_new]
  docs 201-203 are found in S_new

This is "near-real-time" (NRT) search:
  Documents are searchable within 1 second of ingestion.
  NOT truly real-time, but close enough for most use cases.
\`\`\`

## Segment Merging

Over time, many small segments accumulate. Searching across hundreds of segments is slow. Background **merge** operations combine small segments into larger ones:

\`\`\`
Segment Merge Process
======================

Before merge:
  [S0: 50 docs] [S1: 50 docs] [S2: 50 docs] [S3: 50 docs]
  [S4: 12 docs] [S5: 8 docs]  [S6: 15 docs]

Merge policy (tiered):
  Combine segments of similar size

After merge:
  [S0: 50 docs] [S1: 50 docs] [S2: 50 docs] [S3: 50 docs]
  [S7: 35 docs]   <-- S4 + S5 + S6 merged

Eventually:
  [S8: 200 docs]  <-- S0 + S1 + S2 + S3 merged
  [S7: 35 docs]

Merge steps:
  1. Read posting lists from all source segments
  2. Merge-sort posting lists for each term
  3. Write new combined segment
  4. Swap new segment in, delete old segments
  5. Old segments removed after all in-flight queries complete
\`\`\`

## Handling Deletes and Updates

Since segments are immutable, deletes use a **tombstone** approach:

\`\`\`
Delete and Update Handling
===========================

Delete doc_42:
  1. Mark doc_42 as deleted in a "live docs" bitset
     Segment S1 live_docs: [1,1,1,0,1,1,...]
                                   ^-- doc_42 is "dead"
  2. Queries skip dead docs during scoring
  3. Dead docs are physically removed during segment merge

Update doc_42 (new content):
  1. Mark old doc_42 as deleted (tombstone)
  2. Index new doc_42 into the current buffer
  3. Both versions exist temporarily
  4. Queries see only the live version
  5. Old version purged during merge
\`\`\`

## Write-Ahead Log (Translog)

The in-memory buffer is volatile. A crash would lose unflshed documents. A **transaction log** (translog) provides durability:

\`\`\`
Translog for Durability
========================

Write path:
  1. Document arrives
  2. Write to translog (append-only, fsync'd)  <-- durable
  3. Add to in-memory buffer                    <-- volatile
  4. Return success to client

On crash recovery:
  1. Load last flushed segments from disk
  2. Replay translog entries since last flush
  3. Rebuild in-memory buffer
  4. No documents lost

Translog is truncated after each flush (when buffer
is written as a segment to disk).

Flush vs. Refresh:
  Refresh: buffer --> searchable segment (in memory/OS cache)
           Translog NOT truncated (still needed for durability)
  Flush:   segment --> fsync'd to disk
           Translog truncated (no longer needed)
\`\`\`

## Indexing Pipeline Architecture

\`\`\`
Complete Ingestion Pipeline
=============================

[Data Sources]
  |
  v
[Message Queue (Kafka)]  <-- buffer spikes, replay on failure
  |
  v
[Indexing Workers]
  1. Parse document (JSON, HTML, etc.)
  2. Run analyzer pipeline (tokenize, stem, normalize)
  3. Route to correct shard (hash(doc_id) % num_shards)
  |
  v
[Shard Primary]
  1. Write to translog
  2. Add to in-memory buffer
  3. Replicate to replica shards
  4. On refresh: buffer --> new segment
  5. On flush: segment --> disk, truncate translog
  |
  v
[Background Merge]
  Periodically merge small segments into larger ones
\`\`\`

## Key Takeaway

Real-time search is achieved through a segment-based architecture. New documents are buffered in memory and periodically flushed as immutable segments. The refresh interval (typically 1 second) controls the delay between indexing and searchability. Background merging keeps the segment count manageable. The translog ensures durability across crashes. This design -- pioneered by Lucene -- enables search engines to ingest thousands of documents per second while maintaining sub-100ms query latency.`,
    },
    {
      id: "search-architecture",
      slug: "search-architecture",
      title: "Search Engine: Architecture Walkthrough",
      content: `# Search Engine: Architecture Walkthrough

Let us bring together all the components into a complete distributed search engine, inspired by Elasticsearch's architecture.

## Complete Architecture

\`\`\`
               Distributed Search Engine Architecture
               ========================================

[Clients / Applications]
        |
        v
+--------------------------------------------------+
|              Coordinator Layer                     |
| (any node can be a coordinator)                    |
|                                                   |
| - Parse query                                     |
| - Route to relevant shards                        |
| - Scatter query to shards                         |
| - Gather and merge results                        |
| - Return top-K to client                          |
+--------------------------------------------------+
        |                              |
        v                              v
+-------------------+      +-------------------+
|    Index: logs    |      |  Index: products  |
|    (3 shards)     |      |    (2 shards)     |
+-------------------+      +-------------------+

Node 1            Node 2            Node 3
+-----------+     +-----------+     +-----------+
| logs-P0   |     | logs-P1   |     | logs-P2   |
| logs-R1   |     | logs-R2   |     | logs-R0   |
| prods-R0  |     | prods-P0  |     | prods-P1  |
|           |     |           |     | prods-R1  |  (extra replica)
+-----------+     +-----------+     +-----------+

P = Primary shard    R = Replica shard
Each node: JVM process with local segments, translog, caches
\`\`\`

## Write Path End-to-End

\`\`\`
Index a Document
==================

Client: POST /products/_doc/42 {"name": "Widget", "price": 9.99}
        |
        v
1. Coordinator receives request
   Route: shard = hash("42") % 2 = 0
   Primary for prods-P0 is on Node 2
        |
        v
2. Node 2 (prods-P0 primary):
   a. Write to translog (fsync)
   b. Analyze fields:
      "name": "Widget" --> ["widget"]
      "price": 9.99 --> stored as doc value (not analyzed)
   c. Add to in-memory buffer
   d. Return ACK to coordinator
        |
        v
3. Replicate to replica shards:
   prods-R0 on Node 1: receive and apply same write
   (configurable: wait_for_active_shards)
        |
        v
4. Coordinator returns success to client
   {"result": "created", "_id": "42", "_shard": 0}
        |
        v
5. On next refresh (1s later):
   Buffer flushed to new segment
   Document 42 is now searchable
\`\`\`

## Read Path End-to-End

\`\`\`
Search Query
=============

Client: GET /products/_search?q=widget
        |
        v
1. Coordinator parses query:
   Query: {"match": {"name": "widget"}}
   Analyze query: "widget" --> ["widget"]
        |
        v
2. Scatter phase (query phase):
   Send to one copy of each shard:
   prods-shard-0: Node 2 (primary) or Node 1 (replica)
   prods-shard-1: Node 3 (primary) or Node 3 (replica)
        |
        v
3. Each shard executes locally:
   a. Look up "widget" in term dictionary
   b. Read posting list: [42, 87, 155]
   c. Score each doc with BM25
   d. Return top-K (doc_id, score) pairs
        |
        v
4. Gather phase (fetch phase):
   Coordinator merges results from all shards:
   Shard 0: [(42, 8.3), (87, 5.1)]
   Shard 1: [(155, 7.2), (301, 4.8)]
   Global top-K: [(42, 8.3), (155, 7.2), (87, 5.1), (301, 4.8)]
        |
        v
5. Fetch phase:
   Coordinator asks shard 0 for doc 42 and 87 full source
   Coordinator asks shard 1 for doc 155 and 301 full source
        |
        v
6. Return to client:
   {"hits": [
     {"_id": "42", "score": 8.3, "name": "Widget", "price": 9.99},
     {"_id": "155", "score": 7.2, ...},
     ...
   ]}
\`\`\`

## Cluster Management

\`\`\`
Cluster State Management
=========================

Master Node (elected via Raft/Bully algorithm):
  - Maintains cluster state:
    - Which nodes are alive
    - Which shards are on which nodes
    - Index settings and mappings
  - Publishes state changes to all nodes
  - Does NOT handle data operations (lightweight)

Node Discovery:
  - Seed nodes list (static configuration)
  - New node contacts seeds, receives cluster state
  - Gossip protocol for failure detection

Node Roles:
  +-------------------+------------------------------------------+
  | Role              | Responsibility                            |
  +-------------------+------------------------------------------+
  | Master-eligible   | Can be elected as master                  |
  | Data              | Stores shards, handles CRUD               |
  | Coordinator-only  | Routes requests, merges results           |
  | Ingest            | Pre-processes docs before indexing         |
  +-------------------+------------------------------------------+
\`\`\`

## Fault Tolerance

\`\`\`
Failure Scenarios
==================

1. Data node crashes:
   - Master detects failure (no heartbeat)
   - Promotes replica shards on surviving nodes to primary
   - Allocates new replicas on remaining nodes
   - Cluster status: YELLOW (all primaries, missing replicas)

2. Master node crashes:
   - Master-eligible nodes run election
   - New master elected within seconds
   - New master publishes updated cluster state

3. Network partition (split brain):
   - Quorum requirement: majority of master-eligible nodes
   - Minority side cannot elect a master
   - Minority side rejects writes (read-only)
   - Prevents two masters from accepting conflicting writes

4. Slow shard (straggler):
   - Coordinator has a timeout per shard
   - If shard does not respond, return partial results
   - Mark results as "timed_out": true
   - Better to return partial results fast than wait forever
\`\`\`

## Performance Optimizations

\`\`\`
Key Optimizations
==================

1. Query Cache:
   Frequently executed filter queries are cached at the shard level.
   Key = query hash, Value = bitset of matching doc IDs
   Invalidated when new segments are created.

2. Field Data Cache:
   Columnar doc values loaded into memory for sorting/aggregations.
   Avoids re-reading from disk on every query.

3. OS Page Cache:
   Segment files are memory-mapped.
   Frequently accessed segments stay in OS page cache.
   "Warm" shards serve queries from RAM, not disk.

4. Adaptive Replica Selection:
   Route queries to the replica with lowest recent latency.
   Avoids sending queries to overloaded nodes.

5. Index Sorting:
   Pre-sort documents within segments by a field (e.g., timestamp).
   Enables early termination: stop scoring after finding K matches.
\`\`\`

## Comparison with Other Search Systems

\`\`\`
+------------------+------------------+-----------------+-----------+
| Feature          | Elasticsearch    | Apache Solr     | Meilisearch|
+------------------+------------------+-----------------+-----------+
| Storage engine   | Lucene           | Lucene          | Custom     |
| Scoring          | BM25             | BM25            | Custom     |
| Distribution     | Built-in cluster | ZooKeeper-based | Single node|
| Real-time search | 1s refresh       | Soft/hard commit| Instant    |
| Schema           | Dynamic mapping  | Schema required | Schemaless |
| Primary use      | Logs, analytics  | Enterprise      | Typo-      |
|                  |                  | search          | tolerant   |
+------------------+------------------+-----------------+-----------+
\`\`\`

## Key Takeaway

A distributed search engine is built on four pillars: (1) the inverted index for fast term lookups, (2) BM25 for relevance scoring, (3) document-partitioned sharding for horizontal scale, and (4) a segment-based architecture for near-real-time ingestion. The coordinator pattern (scatter-gather) ties it all together -- every query is fanned out to all shards, results are merged and ranked globally, and the top results are returned to the client. Elasticsearch has proven this architecture scales to petabytes of data and thousands of queries per second.`,
    },
  ],
};

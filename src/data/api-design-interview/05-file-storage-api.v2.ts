import { Module } from "../types";

export const fileStorageApiModule: Module = {
  id: "design-storage-api",
  title: "Design File Storage API",
  description: "Design a Dropbox-like file storage API — chunked uploads, resumable transfers, sharing permissions, and sync conflict resolution.",
  lessons: [
    {
      id: "storage-requirements",
      slug: "storage-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design File Storage API: Requirements & Resource Modeling

File storage APIs — Dropbox, Google Drive, Box — are interview favorites because they pack four hard problems into one: large file transfers, hierarchical data, fine-grained permissions, and multi-device sync. Before designing a single endpoint, you need a clear map of what the system must do and how its data is shaped.

\`\`\`concept
{ "title": "The Two-Layer Mental Model", "variant": "mental-model", "content": "Every file storage API has two distinct layers: **metadata** (what a file is — name, size, hash, permissions) and **content** (the raw bytes). Keeping these layers separate in your resource model is the single most consequential design decision you will make. It enables metadata-only sync, efficient caching, and client-side deduplication — all without touching a byte of file data." }
\`\`\`

## Step 1: Clarify Requirements

The fastest way to fail an API design interview is to start drawing endpoints before nailing down scope. Ask clarifying questions first.

\`\`\`steps
{ "title": "Requirements Gathering — The Three Passes", "steps": [ { "title": "Functional scope", "content": "Pin down what operations exist:\\n\\n- Upload, download, delete files\\n- Hierarchical folders (not flat buckets)\\n- Sharing: view / edit / owner permissions\\n- File versioning — restore prior versions\\n- Multi-device sync — detect and resolve conflicts\\n\\n**Interview tip:** Always ask \\"Should delete be soft or permanent?\\" Soft delete (trash) is almost always the right answer for consumer storage." }, { "title": "Non-functional constraints", "content": "These drive architecture more than any feature list:\\n\\n| Constraint | Value | Implication |\\n|---|---|---|\\n| Max file size | 10 GB | Single-request upload is impossible — chunking required |\\n| Network resilience | Must survive drops | Resumable sessions |\\n| Sync efficiency | Delta only | SHA-256 content hash per file |\\n| Storage cost | Minimize duplication | Content-addressable storage |\\n\\nDropbox famously uses **4 MB chunk size** — small enough to retry cheaply, large enough to amortize HTTP overhead." }, { "title": "Out-of-scope decisions", "content": "Be explicit about what you are NOT designing:\\n\\n- Real-time collaborative editing (Google Docs model) — different consistency requirements\\n- CDN/edge delivery strategy — treat storage as a black box\\n- Mobile-specific delta sync protocols — implementation detail\\n\\nBounding scope keeps the interview focused and shows senior judgment." } ] }
\`\`\`

## Step 2: Identify Resources

Map nouns from your requirements to REST resources. Every noun that a client will independently create, read, update, or delete should be a resource.

\`\`\`sysdiag
{ "title": "Core Resource Hierarchy", "width": 680, "height": 380, "nodes": [ { "id": "file", "label": "File\\n/files/{id}", "x": 160, "y": 80, "kind": "service" }, { "id": "folder", "label": "Folder\\n/folders/{id}", "x": 400, "y": 80, "kind": "service" }, { "id": "version", "label": "FileVersion\\n/files/{id}/versions", "x": 60, "y": 220, "kind": "database" }, { "id": "sharedlink", "label": "SharedLink\\n/files/{id}/shared-links", "x": 240, "y": 220, "kind": "database" }, { "id": "permission", "label": "Permission\\n/files/{id}/permissions", "x": 420, "y": 220, "kind": "database" }, { "id": "upload", "label": "UploadSession\\n/upload-sessions", "x": 160, "y": 340, "kind": "queue" }, { "id": "sync", "label": "SyncCursor\\n/sync/cursor", "x": 500, "y": 340, "kind": "cache" } ], "edges": [ { "from": "folder", "to": "file", "label": "contains" }, { "from": "file", "to": "version", "label": "has versions" }, { "from": "file", "to": "sharedlink", "label": "has links" }, { "from": "file", "to": "permission", "label": "has grants" }, { "from": "upload", "to": "file", "label": "becomes" } ], "annotations": { "upload": "Temporary resource — exists only during upload. Committed or expires after TTL.", "sync": "Opaque cursor. Client stores it; server resolves 'what changed since this point'.", "version": "Immutable snapshots. Restore creates a new version, never mutates history." } }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Why UploadSession is a first-class resource", "content": "Large file uploads cannot be atomic. An \`UploadSession\` gives the upload a stable identity so clients can resume after a crash. It is a **temporary resource** — once committed it becomes a \`File\`; if abandoned it expires (typically 24–48 hours). This pattern is used by Google Drive's Resumable Upload API and Dropbox's \`/upload_session\` endpoints." }
\`\`\`

## Step 3: Define Resource Schemas

A resource schema is a contract: it tells clients exactly what fields to expect and what invariants hold.

\`\`\`tabs
{ "tabs": [ { "label": "File", "icon": "📄", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"file_abc123\\",\\n  \\"name\\": \\"report.pdf\\",\\n  \\"type\\": \\"file\\",\\n  \\"mime_type\\": \\"application/pdf\\",\\n  \\"size_bytes\\": 2048576,\\n  \\"hash\\": \\"sha256:a1b2c3d4e5f6...\\",\\n  \\"parent_folder\\": \\"folder_root\\",\\n  \\"path\\": \\"/Documents/Reports/report.pdf\\",\\n  \\"version\\": 3,\\n  \\"owner\\": { \\"id\\": \\"usr_123\\", \\"email\\": \\"jane@example.com\\" },\\n  \\"modified_at\\": \\"2025-03-10T14:30:00Z\\",\\n  \\"created_at\\": \\"2025-01-15T10:00:00Z\\"\\n}\\n\`\`\`\\n\\n**Key fields:**\\n- \`hash\` — SHA-256 of file content. Enables client-side dedup check before upload.\\n- \`version\` — monotonically increasing integer. Clients compare to detect stale local copies.\\n- \`path\` — human-readable display only. API operations always use \`id\`." }, { "label": "Folder", "icon": "📁", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"folder_xyz\\",\\n  \\"name\\": \\"Reports\\",\\n  \\"type\\": \\"folder\\",\\n  \\"parent_folder\\": \\"folder_docs\\",\\n  \\"path\\": \\"/Documents/Reports\\",\\n  \\"item_count\\": 12,\\n  \\"owner\\": { \\"id\\": \\"usr_123\\", \\"email\\": \\"jane@example.com\\" },\\n  \\"modified_at\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`\\n\\n**Key fields:**\\n- \`item_count\` — cached counter, not authoritative. Use \`GET /folders/{id}/items\` for the real list.\\n- Folders do NOT include \`size_bytes\` — computing recursive size is expensive. Expose as a separate \`GET /folders/{id}/size\` if needed." }, { "label": "UploadSession", "icon": "⬆️", "content": "\`\`\`json\\n{\\n  \\"id\\": \\"upload_ses_99z\\",\\n  \\"status\\": \\"in_progress\\",\\n  \\"file_name\\": \\"video.mp4\\",\\n  \\"total_size_bytes\\": 5368709120,\\n  \\"chunk_size_bytes\\": 4194304,\\n  \\"chunks_received\\": [0, 1, 2, 5],\\n  \\"chunks_total\\": 1280,\\n  \\"parent_folder\\": \\"folder_media\\",\\n  \\"expires_at\\": \\"2025-03-11T14:30:00Z\\",\\n  \\"created_at\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`\\n\\n**Key fields:**\\n- \`chunks_received\` — sparse array of received chunk indices. Client uses this to resume: only re-upload missing chunks.\\n- \`expires_at\` — server-enforced TTL. Abandoned sessions are cleaned up automatically.\\n- On \`POST /upload-sessions/{id}/commit\`, session is deleted and a \`File\` resource is created." } ] }
\`\`\`

## Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| \`GET\` | \`/files/{id}\` | Get file metadata |
| \`GET\` | \`/files/{id}/content\` | Download file bytes |
| \`DELETE\` | \`/files/{id}\` | Soft-delete (move to trash) |
| \`PATCH\` | \`/files/{id}\` | Rename or move file |
| \`GET\` | \`/files/{id}/versions\` | List version history |
| \`POST\` | \`/files/{id}/versions/{v}/restore\` | Restore a prior version |
| \`GET\` | \`/folders/{id}\` | Get folder metadata |
| \`GET\` | \`/folders/{id}/items\` | List folder contents (paginated) |
| \`POST\` | \`/folders\` | Create folder |
| \`DELETE\` | \`/folders/{id}\` | Delete folder (recursive) |
| \`POST\` | \`/upload-sessions\` | Start chunked upload |
| \`PUT\` | \`/upload-sessions/{id}/chunks/{n}\` | Upload chunk N |
| \`POST\` | \`/upload-sessions/{id}/commit\` | Finalize upload → creates File |
| \`POST\` | \`/files/{id}/shared-links\` | Generate sharing link |
| \`POST\` | \`/files/{id}/permissions\` | Grant access to a user |
| \`GET\` | \`/sync/changes\` | Changes since cursor |

## Key Design Decisions

These are the four decisions an interviewer will probe. Know the *why* behind each.

\`\`\`tabs
{ "tabs": [ { "label": "Metadata vs Content", "icon": "🔀", "content": "\`GET /files/{id}\` returns JSON metadata. \`GET /files/{id}/content\` returns raw bytes.\\n\\n**Why separate?**\\n- Sync clients only need metadata 95% of the time (checking version, hash)\\n- Content responses go through a CDN or presigned S3 URL; metadata goes through your API servers\\n- Different caching semantics: metadata can be \`Cache-Control: no-cache\`, content can be \`Cache-Control: max-age=31536000\` (immutable once hashed)\\n- Enables **metadata-only sync pass** before deciding what to download" }, { "label": "Content-Addressable Hash", "icon": "#️⃣", "content": "Every file carries \`\\"hash\\": \\"sha256:<hex>\\"\` computed from its bytes.\\n\\n**What this unlocks:**\\n1. **Dedup check before upload**: client computes hash locally, calls \`POST /upload-sessions\` with hash included. Server responds \`409 Conflict\` if hash already exists — no bytes transferred.\\n2. **Storage deduplication**: two users with identical files share one storage block.\\n3. **Integrity verification**: client re-hashes after download to detect corruption.\\n\\n**Trade-off:** SHA-256 of a 10 GB file takes ~10 seconds client-side. Consider computing incrementally as chunks are read." }, { "label": "Path vs ID", "icon": "🔑", "content": "Files have both \`path: \\"/Documents/report.pdf\\"\` and \`id: \\"file_abc123\\"\`.\\n\\n| | Path | ID |\\n|---|---|---|\\n| Stable across rename? | ❌ No | ✅ Yes |\\n| Human readable? | ✅ Yes | ❌ No |\\n| Use in API calls? | ❌ Fragile | ✅ Always |\\n| Use for display? | ✅ Always | ❌ Never |\\n\\n**Rule:** API operations (move, share, delete) always reference \`id\`. Path is display-only. This means a rename is just \`PATCH /files/{id} { \\"name\\": \\"new-name.pdf\\" }\` — it updates the path string without breaking any links, bookmarks, or share URLs." }, { "label": "Soft Delete", "icon": "🗑️", "content": "\`DELETE /files/{id}\` → moves to trash (soft delete)\\n\`DELETE /files/{id}?permanent=true\` → irreversible\\n\\n**Why?**\\n- Accidental deletion is the most common support ticket for cloud storage products\\n- Trash enables a 30-day recovery window (configurable per plan)\\n- Permanent delete is a destructive operation — requiring an explicit query param creates friction that prevents accidents\\n\\n**Trash resource:** Optionally expose \`GET /trash\` and \`POST /trash/{id}/restore\`." } ] }
\`\`\`

\`\`\`collapse
{ "title": "Deep Dive: Why 4 MB is the canonical chunk size", "content": "Dropbox's public API documentation specifies 4 MB (4,194,304 bytes) as the target chunk size, with 150 MB as the maximum per chunk.\\n\\n**The engineering reasoning:**\\n- **TCP window sizes**: modern OS TCP windows saturate around 2–8 MB on typical WAN links. A 4 MB chunk fits within one saturated window, minimizing round-trip overhead.\\n- **Retry cost**: if a chunk fails, you lose at most 4 MB of transfer work. On a 1 Gbps link this is ~32 ms of transfer time — acceptable.\\n- **Parallelism**: 10 GB ÷ 4 MB = 2,560 chunks. Dropbox clients upload up to 6 chunks in parallel, achieving ~6× single-stream throughput.\\n- **Small file threshold**: files under 150 MB can be uploaded in a single request (\`/files/upload\`), bypassing session overhead entirely.\\n\\n**Your interview answer**: \\"I'd default to 4–8 MB chunks, expose it as a server-recommended value in the \`POST /upload-sessions\` response, and let the client override it within \`[1 MB, 150 MB]\` bounds depending on their measured network conditions.\\"" }
\`\`\`

\`\`\`quiz
{ "title": "Check Your Understanding", "questions": [ { "question": "A client has a local copy of \`report.pdf\` at version 3. It calls \`GET /files/file_abc123\` and sees \`\\"version\\": 3\` in the response. What should the sync client do next?", "options": [ "Download the file content immediately", "Skip downloading — local copy is current", "Delete the local file and re-download", "Call GET /files/{id}/versions to verify" ], "answer": 1, "explanation": "Version 3 matches — no download needed. The whole point of the metadata/content split is that the sync client can determine currency from a lightweight JSON call before deciding whether to transfer bytes." }, { "question": "A user uploads \`logo.png\` (2 MB, SHA-256 hash \`abc123\`). Another user then tries to upload a different file that happens to have the same hash \`abc123\`. What should the server return?", "options": [ "200 OK — proceed with upload normally", "201 Created — but point to the existing storage block", "409 Conflict — reject the upload entirely", "400 Bad Request — hash collision detected" ], "answer": 1, "explanation": "Content-addressable storage means identical hashes share one storage block. The server creates a new File metadata record pointing to the existing block and returns 201. No bytes are transferred. This is the core deduplication benefit of SHA-256 hashing." }, { "question": "A client calls \`DELETE /files/file_abc123\` and gets 204. The user now calls support saying they deleted the wrong file. Which design choice makes recovery possible?", "options": [ "Versioning — the file content is in version history", "Soft delete — the file is in trash, not permanently removed", "Content-addressable hash — the bytes still exist in storage", "The path field — the file can be reconstructed from its path" ], "answer": 1, "explanation": "Soft delete moves the file to trash rather than destroying it. Versioning preserves content history for files that exist, but doesn't help after deletion. Content-addressable storage is about dedup, not recovery. The path field is just a string." }, { "question": "You want to move \`report.pdf\` from \`/Documents/\` to \`/Archive/\`. Which API call is correct?", "options": [ "PUT /files/file_abc123 with a new path field", "PATCH /files/file_abc123 with { \\"parent_folder\\": \\"folder_archive\\" }", "DELETE /files/file_abc123 then POST /folders/folder_archive/files", "PUT /folders/folder_archive/files/file_abc123" ], "answer": 1, "explanation": "Move is a metadata-only operation: update the \`parent_folder\` field via PATCH. The file ID, content, hash, and all share links remain unchanged. Never delete-and-recreate — that breaks all references to the file's stable ID." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Split metadata (JSON) from content (bytes) into separate endpoints — this is the most important structural decision in file storage API design", "Use SHA-256 hashes on every file to enable client-side dedup checks and avoid transferring bytes that already exist on the server", "Reference files by opaque ID, never by path — IDs survive renames and moves while paths do not", "Soft-delete by default; require an explicit parameter for permanent deletion to prevent accidental data loss", "UploadSession is a temporary first-class resource that gives large uploads a stable identity across network interruptions", "Chunk size (typically 4 MB) is a trade-off between retry cost, parallelism, and HTTP overhead — expose it as a server recommendation, not a hard requirement" ] }
\`\`\``,
    },
    {
      id: "storage-upload-download",
      slug: "storage-upload-download",
      title: "Upload & Download (Chunked/Resumable)",
      content: `# Upload & Download (Chunked/Resumable)

Large file uploads are the defining technical challenge of any file storage API. A 5 GB video cannot be uploaded in a single HTTP request — TCP timeouts, proxy buffer limits, and server memory constraints all make that approach unreliable. The answer is a three-component protocol: **chunking** (divide the file), **session tracking** (record progress server-side), and **resumability** (skip already-sent data after interruption).

\`\`\`concept
{ "title": "The Road Trip Mental Model", "variant": "mental-model", "content": "Uploading a 5 GB file is like a 3,000-mile road trip. You cannot drive it on one tank of gas — you stop, refuel, and continue. Each 8 MB chunk is a fuel stop. The upload session is your GPS route: it remembers exactly which stops you have completed. If your car breaks down (network drops), you do not restart at home — you restart from the last completed stop. This is resumability." }
\`\`\`

## The Three-Phase Upload Protocol

For files above a size threshold (typically 100 MB), the API requires a three-phase chunked upload:

\`\`\`steps
{ "title": "Chunked Upload Flow", "steps": [ { "title": "Create Upload Session", "content": "Client sends file metadata — name, size, MIME type, and desired chunk size. Server allocates a session, calculates total chunk count, and returns a session ID with a 24-hour expiry.\\n\\n**Endpoint:** \`POST /api/v1/upload-sessions\`" }, { "title": "Upload Chunks", "content": "Client splits the binary file into equal-sized pieces and uploads each with a \`Content-Range\` header and a per-chunk SHA-256 hash for integrity. Server acknowledges each chunk and tracks receipt. Chunks may arrive out of order.\\n\\n**Endpoint:** \`PUT /api/v1/upload-sessions/{id}/chunks\`" }, { "title": "Commit the Upload", "content": "After all chunks are received, the client sends a commit request with the full-file SHA-256 hash. The server reassembles, verifies the hash, and creates the file resource. Hash mismatch returns \`409 Conflict\`.\\n\\n**Endpoint:** \`POST /api/v1/upload-sessions/{id}/commit\`" } ] }
\`\`\`

## Phase 1: Create Upload Session

The client negotiates upload parameters. The server owns the chunk size default (8 MB = 8,388,608 bytes) but may allow client override within safe bounds.

\`\`\`http
POST /api/v1/upload-sessions HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "file_name": "large-video.mp4",
  "file_size": 5368709120,
  "mime_type": "video/mp4",
  "parent_folder": "folder_xyz",
  "chunk_size": 8388608
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "session_id": "ups_001",
  "file_name": "large-video.mp4",
  "file_size": 5368709120,
  "chunk_size": 8388608,
  "total_chunks": 640,
  "upload_url": "https://upload.example.com/sessions/ups_001",
  "expires_at": "2025-03-11T14:30:00Z"
}
\`\`\`

\`total_chunks\` = \`ceil(5368709120 / 8388608)\` = **640**. The session persists for 24 hours — clients must complete or abandon by then.

## Phase 2: Upload Chunks

Each chunk is a binary PUT with three critical headers: \`Content-Range\` specifies byte boundaries, \`Content-Length\` is the chunk size, and \`X-Chunk-Hash\` carries a per-chunk SHA-256 for early corruption detection — before the final commit hash check.

\`\`\`http
PUT /api/v1/upload-sessions/ups_001/chunks HTTP/1.1
Content-Type: application/octet-stream
Content-Range: bytes 0-8388607/5368709120
Content-Length: 8388608
X-Chunk-Hash: sha256:abc123...

<binary data>
\`\`\`

\`\`\`http
HTTP/1.1 200 OK

{
  "chunk_index": 0,
  "bytes_uploaded": 8388608,
  "total_uploaded": 8388608,
  "progress": 0.0016,
  "remaining_chunks": 639
}
\`\`\`

### Resuming After Interruption

If the connection drops mid-transfer, the client queries session state to discover which chunks are still needed:

\`\`\`http
GET /api/v1/upload-sessions/ups_001 HTTP/1.1

HTTP/1.1 200 OK
{
  "session_id": "ups_001",
  "status": "in_progress",
  "total_chunks": 640,
  "uploaded_chunks": [0, 1, 2, 3, 4],
  "missing_chunks": [5, 6, 7, ...],
  "bytes_uploaded": 41943040,
  "progress": 0.0078
}
\`\`\`

The client resumes from chunk 5 — zero previously uploaded bytes are re-sent. The animation below shows this on a simplified 8-chunk example:

\`\`\`algoviz
{ "title": "Resume After Network Drop (8-chunk simplified example)", "type": "array", "data": [0, 1, 2, 3, 4, 5, 6, 7], "frames": [ { "highlight": [0], "label": "Uploading chunk 0", "stats": { "uploaded": 0, "remaining": 8 } }, { "highlight": [1], "label": "Chunk 0 confirmed — uploading chunk 1", "stats": { "uploaded": 1, "remaining": 7 } }, { "highlight": [2, 3, 4], "label": "Chunks 2–4 uploaded successfully", "stats": { "uploaded": 4, "remaining": 4 } }, { "highlight": [], "label": "Network drops after chunk 4 — session persists on server", "stats": { "uploaded": 5, "remaining": 3 } }, { "highlight": [0, 1, 2, 3, 4], "label": "Client queries session: missing_chunks = [5, 6, 7]", "stats": { "uploaded": 5, "remaining": 3 } }, { "highlight": [5], "label": "Resume from chunk 5 — chunks 0–4 are NOT re-sent", "stats": { "uploaded": 6, "remaining": 2 } }, { "highlight": [6], "label": "Chunk 6 uploaded", "stats": { "uploaded": 7, "remaining": 1 } }, { "highlight": [7], "label": "All chunks done — ready to commit", "stats": { "uploaded": 8, "remaining": 0 } } ], "speed": 850 }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Design Principle: Idempotent Chunk Uploads", "content": "Chunk uploads must be idempotent. If the client re-sends a chunk the server already received (due to an ambiguous failure), the server must accept it silently and return the same 200 — not create a duplicate. Use the \`Content-Range\` byte range as the idempotency key. This means a client can safely retry any chunk PUT without risk of data corruption." }
\`\`\`

## Phase 3: Commit the Upload

Once all chunks are received, the client sends the full-file hash. The server verifies integrity by hashing the fully reassembled file:

\`\`\`http
POST /api/v1/upload-sessions/ups_001/commit HTTP/1.1
Content-Type: application/json

{
  "file_hash": "sha256:fullfilehash123..."
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "id": "file_abc123",
  "name": "large-video.mp4",
  "size_bytes": 5368709120,
  "hash": "sha256:fullfilehash123...",
  "parent_folder": "folder_xyz",
  "version": 1,
  "created_at": "2025-03-10T14:35:00Z"
}
\`\`\`

On hash mismatch, the server returns \`409 Conflict\`. Critically, the session is **not** invalidated — the client queries for the corrupted chunk(s) and re-uploads only those before retrying the commit.

## Small File Upload (Under 100 MB)

For smaller files, a single-request multipart upload avoids all session overhead:

\`\`\`http
POST /api/v1/files/upload HTTP/1.1
Content-Type: multipart/form-data
Authorization: Bearer <token>

--boundary
Content-Disposition: form-data; name="file"; filename="notes.txt"
Content-Type: text/plain

<file content>
--boundary
Content-Disposition: form-data; name="parent_folder"

folder_xyz
--boundary--
\`\`\`

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Single-request upload for large files", "code": "POST /api/v1/files/upload\\nContent-Type: multipart/form-data\\n\\n# Problems:\\n# - Fails on timeout with no recovery path\\n# - Server must buffer entire file in memory\\n# - Progress: 0% or 100%, nothing in between\\n# - Any failure = restart from scratch" }, "after": { "label": "Chunked session upload for large files", "code": "POST /api/v1/upload-sessions        # negotiate params\\nPUT  /upload-sessions/{id}/chunks   # stream 8 MB at a time\\nPOST /upload-sessions/{id}/commit   # verify + create file\\n\\n# Benefits:\\n# - Resumable from last completed chunk\\n# - Server streams chunks to disk, not memory\\n# - Fine-grained progress tracking\\n# - Per-chunk SHA-256 + final commit hash" } }
\`\`\`

## Download

The download side mirrors the same reliability-first design. Three modes cover different client needs:

\`\`\`tabs
{ "tabs": [ { "label": "Direct Download", "icon": "⬇️", "content": "Standard HTTP download — the server returns the full file body.\\n\\n\`GET /api/v1/files/{id}/content\` returns \`200 OK\` with \`Content-Disposition: attachment\` and \`Accept-Ranges: bytes\`. The \`Accept-Ranges\` header signals that the endpoint supports partial content requests.\\n\\n**Use when:** Small files or clients that do not support partial content." }, { "label": "Range Request", "icon": "✂️", "content": "Client requests a specific byte range using the \`Range\` header. Server returns \`206 Partial Content\` with a \`Content-Range\` header.\\n\\nExample: \`Range: bytes=1000000-2000000\` → server responds \`Content-Range: bytes 1000000-2000000/5368709120\`, \`Content-Length: 1000001\`.\\n\\nEnables resumable downloads, parallel chunk fetching, and video byte-range seeking (e.g., scrubbing to the middle of a video without downloading the entire file).\\n\\n**Use when:** Large files, media streaming, or resumable transfers." }, { "label": "Pre-signed URL", "icon": "🔗", "content": "The API generates a short-lived HMAC-signed URL. The client downloads directly from the CDN — no \`Authorization\` header needed.\\n\\n\`POST /api/v1/files/{id}/download-url\` returns \`{ download_url, expires_at }\`. The token is a query parameter validated at the CDN edge, never hitting the origin API server.\\n\\n**Use when:** CDN bandwidth offload, browser-native download UX, or sharing files with users who should not hold API credentials." } ] }
\`\`\`

\`\`\`callout
{ "type": "info", "title": "HTTP 206 vs 200 on Range Requests", "content": "A server that returns \`200 OK\` for a \`Range\` request is non-compliant — it ignored the header and sent the full file. Clients implementing resumable downloads must check for \`206 Partial Content\` before treating the response body as a byte range. Always emit \`Accept-Ranges: bytes\` on download endpoints so clients know they can use this feature." }
\`\`\`

\`\`\`quiz
{ "title": "Upload & Download — Check Your Understanding", "questions": [ { "question": "A client uploads chunks 0–4 of a 640-chunk session and the connection drops. What is the correct minimal recovery strategy?", "options": [ "Delete the session and create a new one from scratch", "Query the session for missing_chunks, then upload only those chunks", "Re-upload all 640 chunks to guarantee integrity", "Commit immediately with the 5 chunks already received" ], "answer": 1, "explanation": "The session persists on the server with all received chunks intact. The client queries GET /upload-sessions/{id} to get missing_chunks and re-uploads only those — no completed data is re-sent. This is the core value of server-side session tracking." }, { "question": "The server returns 409 Conflict on the commit request. What does this mean?", "options": [ "The upload session has expired", "Another file with the same name already exists in the folder", "The full-file hash the client provided does not match the server's computed hash", "The client is still missing one or more chunks" ], "answer": 2, "explanation": "After reassembly, the server hashes the complete file and compares it to the client-provided hash. 409 signals a mismatch — typically a corrupt chunk. The session is NOT invalidated; only the corrupt chunk(s) need re-uploading before retrying the commit." }, { "question": "Which HTTP status code correctly indicates a server honored a Range request and returned partial file content?", "options": [ "200 OK", "201 Created", "204 No Content", "206 Partial Content" ], "answer": 3, "explanation": "206 Partial Content is the correct status for honored range requests. A 200 response means the server ignored the Range header and returned the full file — this breaks any client relying on byte-range offsets for resumable download logic." }, { "question": "A product manager asks you to support sharing a file as a browser-downloadable link that works without any API credentials. Which approach is correct?", "options": [ "Embed the user's Bearer token as a URL query parameter", "Issue a pre-signed URL with an embedded expiry and HMAC signature", "Use a range request to the /content endpoint with no auth header", "Return the file ID and have the client construct the download path" ], "answer": 1, "explanation": "Pre-signed URLs embed a time-limited, cryptographically signed token in the URL itself. The CDN validates the HMAC signature without requiring an Authorization header, enabling browser-native download UX. Embedding a Bearer token (option A) is insecure — Bearer tokens are long-lived session credentials that should never appear in URLs." } ] }
\`\`\`

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [ "Large file uploads use a three-phase protocol: create session → upload 8 MB chunks with Content-Range → commit with full-file hash", "Resumability works by querying the session for missing_chunks after interruption and re-uploading only those — never completed data", "Both per-chunk SHA-256 (early corruption detection) and a final commit hash (end-to-end integrity) are used together", "HTTP 206 Partial Content with the Range header enables resumable downloads and media byte-range seeking — always set Accept-Ranges: bytes on download endpoints", "Pre-signed URLs offload bandwidth to the CDN and support browser-native downloads without exposing API credentials in client code" ] }
\`\`\``,
    },
    {
      id: "storage-sharing",
      slug: "storage-sharing",
      title: "File Sharing & Permissions",
      content: `# File Sharing & Permissions

File sharing introduces authorization complexity. A robust API must support three distinct models simultaneously: direct user permissions, shared links, and inherited folder permissions — each with its own resolution rules and edge cases.

\`\`\`concept
{
  "title": "The Three-Layer Permission Model",
  "variant": "mental-model",
  "content": "Think of permissions as three overlapping circles. **Direct permissions** are the innermost: explicit grants on a specific file. **Inherited permissions** flow down from parent folders — a user with editor on \`/Projects\` implicitly has editor on every file inside. **Shared links** are orthogonal: they grant access to anyone with the URL, regardless of whether they have a user account. When evaluating access, check direct > shared-link > inherited, with direct always winning."
}
\`\`\`

## Permission Levels

Before designing the endpoints, clarify the permission taxonomy. Three roles cover most real-world cases:

| Role | View | Download | Edit | Delete | Manage Permissions |
|------|------|----------|------|--------|-------------------|
| \`viewer\` | ✓ | ✓ | — | — | — |
| \`editor\` | ✓ | ✓ | ✓ | — | — |
| \`owner\` | ✓ | ✓ | ✓ | ✓ | ✓ |

\`\`\`callout
{
  "type": "info",
  "title": "ACL vs. RBAC — Know the Trade-off",
  "content": "**Access Control Lists (ACLs)** attach a per-object list of (user → permission) pairs — highly granular but hard to manage at scale. **Role-Based Access Control (RBAC)** assigns permissions to roles, users to roles — simpler to administer for large organizations. Most cloud file APIs (Dropbox, Box, Google Drive) use a **hybrid**: RBAC-style roles (\`viewer\`/\`editor\`/\`owner\`) applied per-object like an ACL. This is the model you should default to in an interview."
}
\`\`\`

## Managing User Permissions

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Grant",
      "icon": "➕",
      "content": "\`\`\`http\\nPOST /api/v1/files/file_abc123/permissions HTTP/1.1\\nAuthorization: Bearer <token>\\nContent-Type: application/json\\n\\n{\\n  \\"user_email\\": \\"bob@example.com\\",\\n  \\"role\\": \\"editor\\",\\n  \\"notify\\": true,\\n  \\"message\\": \\"Please review this document.\\"\\n}\\n\`\`\`\\n\\n\`\`\`http\\nHTTP/1.1 201 Created\\n\\n{\\n  \\"id\\": \\"perm_001\\",\\n  \\"file_id\\": \\"file_abc123\\",\\n  \\"user\\": { \\"id\\": \\"usr_456\\", \\"email\\": \\"bob@example.com\\" },\\n  \\"role\\": \\"editor\\",\\n  \\"granted_by\\": { \\"id\\": \\"usr_123\\", \\"email\\": \\"jane@example.com\\" },\\n  \\"created_at\\": \\"2025-03-10T14:30:00Z\\"\\n}\\n\`\`\`\\n\\nOnly \`owner\`-role users can call this endpoint — editors cannot share further."
    },
    {
      "label": "List",
      "icon": "📋",
      "content": "\`\`\`http\\nGET /api/v1/files/file_abc123/permissions\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"data\\": [\\n    {\\n      \\"id\\": \\"perm_owner\\",\\n      \\"user\\": { \\"email\\": \\"jane@example.com\\" },\\n      \\"role\\": \\"owner\\",\\n      \\"source\\": \\"direct\\"\\n    },\\n    {\\n      \\"id\\": \\"perm_001\\",\\n      \\"user\\": { \\"email\\": \\"bob@example.com\\" },\\n      \\"role\\": \\"editor\\",\\n      \\"source\\": \\"direct\\"\\n    },\\n    {\\n      \\"id\\": \\"perm_002\\",\\n      \\"user\\": { \\"email\\": \\"alice@example.com\\" },\\n      \\"role\\": \\"viewer\\",\\n      \\"source\\": \\"inherited\\",\\n      \\"inherited_from\\": \\"folder_xyz\\"\\n    }\\n  ]\\n}\\n\`\`\`\\n\\nThe \`source\` field is critical: it tells consumers whether a permission is explicitly set on this file or flowing down from a parent folder."
    },
    {
      "label": "Update",
      "icon": "✏️",
      "content": "\`\`\`http\\nPATCH /api/v1/files/file_abc123/permissions/perm_001\\nAuthorization: Bearer <token>\\nContent-Type: application/json\\n\\n{ \\"role\\": \\"viewer\\" }\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"id\\": \\"perm_001\\",\\n  \\"role\\": \\"viewer\\",\\n  \\"updated_at\\": \\"2025-03-11T09:15:00Z\\"\\n}\\n\`\`\`\\n\\nUse PATCH (partial update) rather than PUT here — you're changing a single field on an existing permission record, not replacing the whole resource."
    },
    {
      "label": "Revoke",
      "icon": "🗑️",
      "content": "\`\`\`http\\nDELETE /api/v1/files/file_abc123/permissions/perm_001\\nAuthorization: Bearer <token>\\n\\nHTTP/1.1 204 No Content\\n\`\`\`\\n\\nRevoking an inherited permission requires a different approach — you cannot DELETE a \`perm_002\` that exists on a parent folder. Instead, use \`override_inherited: true\` on a POST to explicitly downgrade access on just this file."
    }
  ]
}
\`\`\`

## Shared Links

Shared links grant access to **anyone with the URL**, with no account required. They're a distinct auth path from user permissions.

\`\`\`http
POST /api/v1/files/file_abc123/shared-links HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "access_level": "viewer",
  "password": "optional-password",
  "expires_at": "2025-04-10T00:00:00Z",
  "allow_download": true
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "id": "sl_001",
  "url": "https://share.example.com/s/abc123xyz",
  "access_level": "viewer",
  "password_protected": true,
  "allow_download": true,
  "expires_at": "2025-04-10T00:00:00Z",
  "created_at": "2025-03-10T14:30:00Z",
  "view_count": 0
}
\`\`\`

Accessing a shared link uses a separate, unauthenticated route:

\`\`\`http
GET /api/v1/shared/abc123xyz
X-Link-Password: optional-password

HTTP/1.1 200 OK
{
  "file": {
    "id": "file_abc123",
    "name": "report.pdf",
    "size_bytes": 2048576,
    "mime_type": "application/pdf"
  },
  "permissions": {
    "can_view": true,
    "can_download": true,
    "can_edit": false
  }
}
\`\`\`

\`\`\`callout
{
  "type": "tip",
  "title": "Capabilities Object Pattern",
  "content": "The \`permissions\` object in the shared link response uses boolean capability flags (\`can_view\`, \`can_download\`, \`can_edit\`) rather than returning the raw role string. This is deliberate: the consumer doesn't need to know the role name — they need to know what actions are allowed. Returning capabilities instead of roles reduces coupling and makes the client logic simpler."
}
\`\`\`

## Folder Permission Inheritance

Permissions on a folder cascade to all descendants. This is the most powerful (and most dangerous) feature of the model.

\`\`\`sysdiag
{
  "title": "Folder Inheritance: Bob has editor on /Shared Project",
  "width": 620,
  "height": 340,
  "nodes": [
    { "id": "root", "label": "/Shared Project\\nBob = editor (direct)", "x": 310, "y": 50, "kind": "storage" },
    { "id": "design", "label": "design.figma\\nBob = editor (inherited)", "x": 130, "y": 160, "kind": "service" },
    { "id": "spec", "label": "spec.md\\nBob = editor (inherited)", "x": 310, "y": 160, "kind": "service" },
    { "id": "conf", "label": "/Confidential\\nBob = editor (inherited)", "x": 490, "y": 160, "kind": "service" },
    { "id": "budget", "label": "budget.xlsx\\nBob = viewer (override)", "x": 490, "y": 270, "kind": "database" }
  ],
  "edges": [
    { "from": "root", "to": "design", "label": "inherits" },
    { "from": "root", "to": "spec", "label": "inherits" },
    { "from": "root", "to": "conf", "label": "inherits" },
    { "from": "conf", "to": "budget", "label": "override" }
  ],
  "annotations": {
    "root": "Direct editor permission granted here; all children inherit unless overridden",
    "budget": "Explicit POST with override_inherited:true downgrades Bob to viewer on this file only"
  }
}
\`\`\`

**Breaking inheritance** — a file or subfolder can override the inherited permission with a direct, explicit grant:

\`\`\`compare
{
  "variant": "before-after",
  "before": {
    "label": "Without override — Bob inherits editor from /Confidential",
    "code": "POST /api/v1/files/budget_xlsx/permissions\\n{\\n  \\"user_email\\": \\"bob@example.com\\",\\n  \\"role\\": \\"viewer\\"\\n  // ❌ This FAILS — Bob already has an inherited editor role.\\n  //    Without override_inherited, the API rejects the downgrade\\n  //    to avoid silent permission escalation confusion.\\n}"
  },
  "after": {
    "label": "With override — explicit downgrade wins",
    "code": "POST /api/v1/files/budget_xlsx/permissions\\n{\\n  \\"user_email\\": \\"bob@example.com\\",\\n  \\"role\\": \\"viewer\\",\\n  \\"override_inherited\\": true\\n  // ✅ Now Bob can view but not edit budget.xlsx,\\n  //    even though /Confidential grants editor access.\\n  //    source: \\"direct\\" appears in GET /permissions response.\\n}"
  }
}
\`\`\`

## Authorization Error Cases

Every permission check has failure modes. Design these explicitly — they're part of the API contract.

\`\`\`http
# No permission at all
GET /api/v1/files/file_secret/content
HTTP/1.1 403 Forbidden
{
  "error": {
    "code": "ACCESS_DENIED",
    "message": "You do not have permission to access this file."
  }
}

# Shared link has expired
GET /api/v1/shared/expired_link
HTTP/1.1 410 Gone
{
  "error": {
    "code": "LINK_EXPIRED",
    "message": "This shared link has expired."
  }
}

# Wrong shared link password
GET /api/v1/shared/abc123xyz
X-Link-Password: wrong
HTTP/1.1 401 Unauthorized
{
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Incorrect password for this shared link."
  }
}

# Editor trying to grant permissions (only owners can)
POST /api/v1/files/file_abc123/permissions
HTTP/1.1 403 Forbidden
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "Only owners can manage permissions."
  }
}
\`\`\`

\`\`\`callout
{
  "type": "warning",
  "title": "410 Gone vs. 404 Not Found for Expired Links",
  "content": "Use \`410 Gone\` (not \`404 Not Found\`) for expired shared links. \`404\` implies the resource never existed, which could mask security-relevant information. \`410 Gone\` signals: the resource existed, it was accessible, but that access has ended. This matters for audit logs and helps users distinguish between a broken link vs. an intentionally expired one."
}
\`\`\`

\`\`\`quiz
{
  "title": "Check Your Understanding",
  "questions": [
    {
      "question": "A user has \`editor\` access to \`/Projects\` (inherited). They are then explicitly granted \`viewer\` on \`/Projects/budget.xlsx\` with \`override_inherited: true\`. What happens when they try to edit budget.xlsx?",
      "options": [
        "They can edit — inherited editor wins over direct viewer",
        "They cannot edit — direct permission wins, downgrading them to viewer",
        "They get a 409 Conflict response from the API",
        "Behavior is undefined — the API should reject this configuration"
      ],
      "answer": 1,
      "explanation": "Direct permissions always win over inherited ones. The explicit \`override_inherited: true\` grant sets a direct \`viewer\` role on this specific file, which takes precedence over the inherited \`editor\` from the parent folder. The GET /permissions response will show \`source: 'direct'\` for this entry."
    },
    {
      "question": "Which HTTP status code should be returned when a valid shared link is accessed after its \`expires_at\` timestamp?",
      "options": [
        "404 Not Found",
        "403 Forbidden",
        "410 Gone",
        "401 Unauthorized"
      ],
      "answer": 2,
      "explanation": "410 Gone is the correct choice. 404 implies the resource never existed. 403 implies an access control check failed (it did, but for a different reason than typical auth). 410 explicitly communicates: this resource existed and was accessible, but that access has permanently ended — which is the precise semantics for an expired link."
    },
    {
      "question": "You're designing a file API. An editor-role user attempts to call \`POST /files/file_abc/permissions\` to share a file with a colleague. What should the API return?",
      "options": [
        "201 Created — editors can share files they have access to",
        "403 Forbidden with code INSUFFICIENT_PERMISSIONS",
        "404 Not Found — hide the permissions endpoint from non-owners",
        "409 Conflict — the user already has access"
      ],
      "answer": 1,
      "explanation": "Only owner-role users can manage permissions. Returning 403 with a descriptive error code (INSUFFICIENT_PERMISSIONS) is correct — the file exists and the user has access to it (as editor), but they lack the specific privilege to manage its permissions. Using 404 to hide the endpoint is security through obscurity and hides useful information from legitimate users."
    },
    {
      "question": "The \`source\` field in the GET /permissions response can be \`'direct'\` or \`'inherited'\`. Why is this important for the client?",
      "options": [
        "It determines which HTTP method to use when updating the permission",
        "It tells the client whether deleting the permission record will fully revoke access",
        "It indicates whether the permission was granted by an admin vs. a regular user",
        "It controls whether the user can further delegate their access"
      ],
      "answer": 1,
      "explanation": "If source is 'inherited', the user's access comes from a parent folder — DELETEing the perm_002 record (which may not even exist directly on this file) won't remove their access. The client must use override_inherited:true to explicitly downgrade. Without the source field, the client cannot distinguish these cases and may show a false 'remove access' action that silently fails."
    }
  ]
}
\`\`\`

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Three permission roles (viewer, editor, owner) modeled as per-object ACLs give you Dropbox-style granularity without full RBAC complexity",
    "The \`source\` field (direct vs. inherited) is not optional — clients need it to determine whether revoking a permission actually removes access",
    "Shared links are a parallel auth path to user permissions: use a separate unauthenticated route and return capability flags, not role names",
    "Direct permissions always win over inherited ones; use \`override_inherited: true\` to explicitly downgrade inherited access on a specific file",
    "Use 410 Gone for expired links, not 404 — the semantic difference communicates that access existed and ended, not that the resource is missing",
    "In interviews: establish the permission model before designing any endpoints — it's a dependency for every other route in the file storage API"
  ]
}
\`\`\``,
    },
    {
      id: "storage-sync",
      slug: "storage-sync",
      title: "Sync Protocol & Conflict Resolution",
      content: `# Sync Protocol & Conflict Resolution

Multi-device sync is the hardest part of any file storage API. The client needs to know *what changed* since it last synced, and the server must handle *conflicts* when two devices edit the same file without knowing about each other. Get these two pieces wrong and you get data loss — the cardinal sin of cloud storage.

\`\`\`concept
{ "title": "The Two Pillars of Sync", "variant": "mental-model", "content": "Every sync protocol rests on exactly two foundations: (1) a change feed that tells clients what happened since they last checked, and (2) a conflict mechanism that handles divergent edits. Everything else — long polling, delta sync, versioning — is an optimization layered on top of these two pillars." }
\`\`\`

---

## The Change Feed: Cursor-Based Sync

The most robust sync design is a **cursor-based change feed**. The client holds an opaque cursor representing its last-known position in the event log. On each sync cycle, it sends the cursor and gets back a list of changes since that point.

\`\`\`tabs
{
  "tabs": [
    {
      "label": "Incremental Sync",
      "icon": "🔄",
      "content": "\`\`\`http\\nGET /api/v1/sync/changes?cursor=cur_abc123&limit=100\\nAuthorization: Bearer <token>\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"changes\\": [\\n    {\\n      \\"type\\": \\"file_modified\\",\\n      \\"file\\": { \\"id\\": \\"file_001\\", \\"name\\": \\"notes.md\\", \\"version\\": 4, \\"hash\\": \\"sha256:abc...\\" },\\n      \\"modified_at\\": \\"2025-03-10T14:30:00Z\\"\\n    },\\n    {\\n      \\"type\\": \\"file_created\\",\\n      \\"file\\": { \\"id\\": \\"file_002\\", \\"name\\": \\"photo.jpg\\", \\"size_bytes\\": 3048576 },\\n      \\"modified_at\\": \\"2025-03-10T14:31:00Z\\"\\n    },\\n    {\\n      \\"type\\": \\"file_deleted\\",\\n      \\"file\\": { \\"id\\": \\"file_003\\" },\\n      \\"modified_at\\": \\"2025-03-10T14:32:00Z\\"\\n    },\\n    {\\n      \\"type\\": \\"folder_created\\",\\n      \\"folder\\": { \\"id\\": \\"folder_new\\", \\"name\\": \\"Archive\\", \\"path\\": \\"/Archive\\" },\\n      \\"modified_at\\": \\"2025-03-10T14:33:00Z\\"\\n    }\\n  ],\\n  \\"cursor\\": \\"cur_def456\\",\\n  \\"has_more\\": false\\n}\\n\`\`\`\\n\\nThe client stores \`cur_def456\` locally and sends it on the next sync. The server interprets the cursor — the client never parses it."
    },
    {
      "label": "Initial Sync",
      "icon": "🆕",
      "content": "On first sync there is no cursor. The server returns all files, potentially paginated:\\n\\n\`\`\`http\\nGET /api/v1/sync/changes?limit=500\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"changes\\": [ /* all files and folders */ ],\\n  \\"cursor\\": \\"cur_initial_001\\",\\n  \\"has_more\\": true\\n}\\n\`\`\`\\n\\nThe client pages through using \`has_more\` until it has the full snapshot, then stores the final cursor. Every subsequent sync is incremental from that point."
    },
    {
      "label": "Long Polling",
      "icon": "⏳",
      "content": "Instead of polling every N seconds, the client appends \`wait=30\` to hold the connection open:\\n\\n\`\`\`http\\nGET /api/v1/sync/changes?cursor=cur_def456&wait=30\\n\`\`\`\\n\\nThe server returns immediately if changes arrive; otherwise it returns an empty array after 30 seconds. This reduces API calls from thousands per hour (polling) to a handful (one per change), with near-instant delivery."
    }
  ]
}
\`\`\`

\`\`\`concept
{ "title": "Why Cursors Are Opaque", "variant": "rule", "content": "The cursor must be treated as an opaque blob by clients. Internally it might encode a Kafka offset, a Postgres LSN, a timestamp, or a composite key — that's the server's implementation detail. Exposing the cursor's structure (e.g., returning a raw Unix timestamp) locks you into an implementation and makes schema migrations painful. Clients store it, send it, never interpret it." }
\`\`\`

---

## Conflict Detection: Optimistic Locking

Conflicts happen when two devices edit the same file before either has synced:

\`\`\`
Device A reads file_001 @ version 3  →  edits  →  uploads version 4
Device B reads file_001 @ version 3  →  edits  →  tries to upload version 4  ← conflict!
\`\`\`

The solution is **optimistic locking**: the client declares the version it started from (\`base_version\`) when uploading. The server atomically checks whether that version is still current.

\`\`\`steps
{
  "title": "How Optimistic Locking Works",
  "steps": [
    {
      "title": "Client declares base version",
      "content": "When starting an upload, the client includes the version it last saw:\\n\\n\`\`\`http\\nPOST /api/v1/upload-sessions\\n{\\n  \\"file_id\\": \\"file_001\\",\\n  \\"base_version\\": 3,\\n  \\"file_name\\": \\"notes.md\\",\\n  \\"file_size\\": 1024\\n}\\n\`\`\`"
    },
    {
      "title": "Server checks atomically",
      "content": "The server runs an atomic compare-and-swap:\\n\\n\`\`\`sql\\nUPDATE files\\nSET version = version + 1, content = \\\\$new_content\\nWHERE id = 'file_001' AND version = 3\\nRETURNING version;\\n\`\`\`\\n\\nIf the row was at version 3, the update succeeds and returns version 4. If another device already bumped it to version 4, zero rows are updated — that's the conflict signal."
    },
    {
      "title": "Conflict response (409)",
      "content": "When the check fails, the server returns \`409 Conflict\` with enough detail for the client to decide what to do:\\n\\n\`\`\`http\\nHTTP/1.1 409 Conflict\\n{\\n  \\"error\\": {\\n    \\"code\\": \\"VERSION_CONFLICT\\",\\n    \\"message\\": \\"File has been modified since your base version.\\",\\n    \\"current_version\\": 4,\\n    \\"your_base_version\\": 3,\\n    \\"conflict_resolution\\": {\\n      \\"server_file\\": {\\n        \\"version\\": 4,\\n        \\"modified_by\\": \\"Device A\\",\\n        \\"modified_at\\": \\"2025-03-10T14:30:00Z\\"\\n      }\\n    }\\n  }\\n}\\n\`\`\`"
    },
    {
      "title": "Client resolves the conflict",
      "content": "The client now has both versions. It calls the conflict resolution endpoint:\\n\\n\`\`\`http\\nPOST /api/v1/files/file_001/resolve-conflict\\n{\\n  \\"strategy\\": \\"keep_both\\",\\n  \\"local_file_session\\": \\"ups_002\\"\\n}\\n\\nHTTP/1.1 200 OK\\n{\\n  \\"original\\":      { \\"id\\": \\"file_001\\", \\"name\\": \\"notes.md\\",                          \\"version\\": 4 },\\n  \\"conflict_copy\\": { \\"id\\": \\"file_004\\", \\"name\\": \\"notes (conflict from Device B).md\\", \\"version\\": 1 }\\n}\\n\`\`\`\\n\\nBoth versions survive. The user sees both files and can manually merge if needed."
    }
  ]
}
\`\`\`

---

## Conflict Resolution Strategies

No strategy is universally correct — the right choice depends on the application's tolerance for data loss versus user friction.

| Strategy | How It Works | Data Loss Risk | Used By |
|---|---|---|---|
| **Last Write Wins** | Most recent upload overwrites the other | High — silent loss | Simple sync tools |
| **Conflict Copy** | Both versions saved; one gets a renamed suffix | None — user merges manually | Dropbox, Syncthing |
| **Merge / Patch** | Attempt automatic merge of text changes | Low for text; high for binary | Google Docs |
| **User Decides** | Both versions presented; user chooses | None | Git |

\`\`\`concept
{ "title": "Conflict Copy is the Safest Default for a File API", "variant": "insight", "content": "For a general-purpose file storage API, conflict copies are the right default. Merge requires understanding file semantics (plain text ≠ a Keynote file), and last-write-wins silently discards work. Conflict copies are explicit, auditable, and put the human in the loop. Dropbox uses this approach, naming copies with the pattern: 'filename (Conflicted Copy from Device B on YYYY-MM-DD).ext'." }
\`\`\`

\`\`\`callout
{ "type": "warning", "title": "Last-Write-Wins and Clock Skew", "content": "Last-write-wins sounds simple but is dangerous in distributed systems. Client clocks can skew by minutes. If Device B's clock is 5 minutes ahead, its edit will always \\"win\\" regardless of causality — even if Device A edited 10 seconds later by wall-clock reality. If you use LWW, use server-assigned timestamps, not client-provided ones." }
\`\`\`

---

## Delta Sync: Transferring Only What Changed

Re-uploading a 50 MB Keynote file because you changed one word is wasteful. **Delta sync** transmits only the changed blocks.

\`\`\`algoviz
{
  "title": "Block-Level Delta Sync",
  "type": "array",
  "data": ["Block 0\\naaa...", "Block 1\\nbbb...", "Block 2\\nccc...", "Block 3\\nddd..."],
  "frames": [
    { "highlight": [], "label": "Client fetches server block hashes for file_001", "stats": { "blocks": 4, "file_size": "16KB" } },
    { "highlight": [0], "label": "Block 0 hash matches local → skip (no upload needed)", "stats": { "match": "✓", "upload": 0 } },
    { "highlight": [1], "label": "Block 1 hash matches local → skip", "stats": { "match": "✓", "upload": 0 } },
    { "highlight": [2], "label": "Block 2 hash DIFFERS → upload this block only", "stats": { "match": "✗", "upload": 1 } },
    { "highlight": [3], "label": "Block 3 hash matches local → skip", "stats": { "match": "✓", "upload": 1 } },
    { "highlight": [2], "label": "Only 1 of 4 blocks uploaded — 75% bandwidth saved", "stats": { "uploaded": "4KB", "saved": "12KB" } }
  ],
  "speed": 900
}
\`\`\`

The server exposes block hashes per file:

\`\`\`http
GET /api/v1/files/file_001/blocks

{
  "blocks": [
    { "index": 0, "hash": "sha256:aaa", "size": 4096 },
    { "index": 1, "hash": "sha256:bbb", "size": 4096 },
    { "index": 2, "hash": "sha256:ccc", "size": 4096 },
    { "index": 3, "hash": "sha256:ddd", "size": 4096 }
  ]
}
\`\`\`

The client compares its local block hashes against the server's, then uploads only the differing blocks. Dropbox uses fixed-size 4 MB chunks with this approach. A bonus: **cross-user deduplication** — if two users upload a file with identical block hashes, the server stores the block only once.

\`\`\`collapse
{ "title": "Deep Dive: rsync vs. Fixed-Size Block Chunking", "content": "**rsync** uses a rolling checksum to detect deltas even when data is *inserted* mid-file (not just overwritten), making it powerful for arbitrary byte-level diffs. However, it scans the entire file byte-by-byte — roughly O(N) with a high constant, around 1 billion hash operations for a 1 GB file. It also doesn't enable cross-user deduplication because block boundaries shift with every insert.\\n\\n**Fixed-size chunking** (as used by Dropbox) is less flexible — an insertion in block 0 will invalidate every subsequent block. But it's much simpler to implement, enables deduplication, and works well for the common case (edits that don't shift large amounts of data). For a file storage API interview, fixed-size chunking is the right default answer. Mention rsync only if the interviewer specifically asks about optimizing for insert-heavy workloads." }
\`\`\`

---

## Interview Checklist

\`\`\`quiz
{
  "title": "Sync Protocol & Conflict Resolution",
  "questions": [
    {
      "question": "A client has never synced before. What cursor should it send in the first GET /sync/changes request?",
      "options": [
        "cursor=0",
        "cursor=epoch",
        "No cursor parameter — omit it entirely",
        "cursor=null"
      ],
      "answer": 2,
      "explanation": "On first sync the client omits the cursor entirely. The server interprets a missing cursor as 'give me everything from the beginning.' Sending cursor=0 or cursor=null could work if the server is lenient, but the canonical design is to omit the parameter and have the server return the full initial snapshot plus a fresh cursor."
    },
    {
      "question": "Device A and Device B both read file_001 at version 3 and make edits. Device A uploads first (version becomes 4). What HTTP status should the server return when Device B tries to upload?",
      "options": [
        "200 OK — last write wins",
        "412 Precondition Failed",
        "409 Conflict",
        "423 Locked"
      ],
      "answer": 2,
      "explanation": "409 Conflict is the semantically correct status for an optimistic locking failure. The precondition (base_version == current_version) was not met because another writer already committed. The response body should include the current version and details about the conflicting write so the client can resolve it."
    },
    {
      "question": "Which conflict resolution strategy risks silent data loss?",
      "options": [
        "Conflict copy (keep_both)",
        "Last write wins",
        "Merge/patch",
        "User decides"
      ],
      "answer": 1,
      "explanation": "Last-write-wins silently discards the losing edit. The user whose upload arrived a fraction of a second earlier simply loses their changes with no notification. Conflict copies, merge, and user-decides all preserve both edits in some form."
    },
    {
      "question": "A client uses long polling with wait=30. The server has no new changes. What should happen?",
      "options": [
        "The server closes the connection with a 204 No Content after 30 seconds",
        "The server returns an empty changes array after 30 seconds with the same cursor",
        "The server returns a 408 Request Timeout",
        "The client must retry immediately with a shorter wait"
      ],
      "answer": 1,
      "explanation": "On timeout the server returns a 200 with an empty changes array and the same cursor the client sent. The client can immediately issue another long-poll request with the unchanged cursor. This design lets the client distinguish 'no changes' from 'connection error'."
    },
    {
      "question": "Dropbox uses fixed-size block chunking for delta sync. What is a key advantage over rsync?",
      "options": [
        "Fixed-size chunking handles mid-file insertions more efficiently",
        "Fixed-size chunking enables cross-user deduplication of identical blocks",
        "Fixed-size chunking uses a rolling hash for better accuracy",
        "Fixed-size chunking reduces server CPU usage by skipping hashing entirely"
      ],
      "answer": 1,
      "explanation": "Because block boundaries are fixed and content-addressed by hash, two different users uploading a file with identical content will produce the same block hashes. The server can store the block once and reference it from both users' metadata, saving significant storage. rsync's rolling hash shifts boundaries with insertions, making deduplication across users impractical."
    }
  ]
}
\`\`\`

---

\`\`\`takeaways
{
  "title": "Key Takeaways",
  "items": [
    "Cursor-based change feeds are the foundation of sync: clients store an opaque cursor and send it on every request; the server returns all changes since that point.",
    "Optimistic locking (base_version in the upload request + atomic compare-and-swap on the server) is the canonical way to detect conflicts before they silently overwrite data.",
    "Conflict copy (keep_both) is the safest default resolution strategy for a general-purpose file API — it preserves all edits and delegates the merge decision to the user.",
    "Long polling replaces constant polling: the server holds the connection open until a change arrives or a timeout expires, reducing calls from thousands per hour to a handful.",
    "Delta sync via fixed-size block hashing uploads only changed blocks — the same mechanism enables cross-user deduplication, where identical blocks are stored once regardless of filename."
  ]
}
\`\`\``,
    },
    {
      id: "storage-walkthrough",
      slug: "storage-walkthrough",
      title: "API Walkthrough",
      content: `# File Storage API: Walkthrough & Trade-offs

This lesson consolidates the complete API surface and forces you to defend every design decision — the way an interviewer will.

\`\`\`concept
{ "title": "The Walkthrough Mindset", "variant": "rule", "content": "An API design interview is not finished when you list endpoints. The interviewer wants to hear you reason about trade-offs: why chunked over pre-signed, why IDs over paths, why long-polling over WebSocket. Every choice should have a one-sentence justification you can deliver under pressure." }
\`\`\`

---

## Complete Endpoint Surface

\`\`\`tabs
{ "tabs": [
  { "label": "Files", "icon": "📄", "content": "| Method | Endpoint | Description |\\n|--------|----------|-------------|\\n| GET | \`/files/{id}\` | Get file metadata |\\n| GET | \`/files/{id}/content\` | Download file content |\\n| PATCH | \`/files/{id}\` | Rename or move file |\\n| DELETE | \`/files/{id}\` | Move to trash |\\n| GET | \`/files/{id}/versions\` | List version history |\\n| POST | \`/files/{id}/versions/{v}/restore\` | Restore a previous version |" },
  { "label": "Folders", "icon": "📁", "content": "| Method | Endpoint | Description |\\n|--------|----------|-------------|\\n| POST | \`/folders\` | Create folder |\\n| GET | \`/folders/{id}\` | Get folder metadata |\\n| GET | \`/folders/{id}/items\` | List folder contents |\\n| PATCH | \`/folders/{id}\` | Rename or move folder |\\n| DELETE | \`/folders/{id}\` | Move to trash |" },
  { "label": "Upload", "icon": "⬆️", "content": "| Method | Endpoint | Description |\\n|--------|----------|-------------|\\n| POST | \`/upload-sessions\` | Start a chunked upload session |\\n| PUT | \`/upload-sessions/{id}/chunks\` | Upload one chunk |\\n| POST | \`/upload-sessions/{id}/commit\` | Finalize and assemble the file |\\n| POST | \`/files/upload\` | Simple upload for files under 100 MB |" },
  { "label": "Sharing", "icon": "🔗", "content": "| Method | Endpoint | Description |\\n|--------|----------|-------------|\\n| POST | \`/files/{id}/permissions\` | Grant a permission |\\n| GET | \`/files/{id}/permissions\` | List all permissions |\\n| PATCH | \`/files/{id}/permissions/{pid}\` | Update a permission |\\n| DELETE | \`/files/{id}/permissions/{pid}\` | Revoke a permission |\\n| POST | \`/files/{id}/shared-links\` | Create a public shared link |\\n| DELETE | \`/shared-links/{id}\` | Revoke a shared link |" },
  { "label": "Sync", "icon": "🔄", "content": "| Method | Endpoint | Description |\\n|--------|----------|-------------|\\n| GET | \`/sync/changes\` | Poll for changes since a cursor |\\n| POST | \`/files/{id}/resolve-conflict\` | Resolve a sync conflict |\\n| POST | \`/upload-sessions\` | Start upload (conflict detected via \`409\` on commit) |" }
] }
\`\`\`

---

## End-to-End Sync Flow

This is the flow that ties everything together. Walk through it step by step in your interview — it shows you understand the full lifecycle, not just individual endpoints.

\`\`\`steps
{ "title": "Complete Sync Lifecycle", "steps": [
  { "title": "Initial hydration", "content": "The client boots with no local state:\\n\\n\`\`\`\\nGET /sync/changes\\n→ 200 { items: [...all files...], cursor: \\"cur_001\\" }\\n\`\`\`\\n\\nThe cursor marks the client's position in the change log. Every subsequent call supplies this cursor." },
  { "title": "Local edit → upload", "content": "The user edits a file locally. The client tracks which server version it started from:\\n\\n\`\`\`\\nPOST /upload-sessions\\n{ file_id: \\"file_abc\\", base_version: 3 }\\n\\nPUT /upload-sessions/{id}/chunks  (repeat for each chunk)\\n\\nPOST /upload-sessions/{id}/commit\\n→ 200 { version: 4 }\\n\`\`\`\\n\\nThe \`base_version\` is the concurrency token. If the server has moved past version 3 by the time you commit, you get a \`409 Conflict\`." },
  { "title": "Polling for remote changes", "content": "The client polls on a background thread:\\n\\n\`\`\`\\nGET /sync/changes?cursor=cur_001&wait=30\\n\`\`\`\\n\\n\`wait=30\` enables long-polling — the server holds the connection up to 30 seconds and responds immediately when a change arrives. The client updates local state and stores the new cursor." },
  { "title": "Conflict handling", "content": "If the commit returns \`409\`:\\n\\n1. The client fetches the server's current version\\n2. Diffs against its local edit\\n3. Either **merges** (for text) or **creates a conflict copy** (for binary files)\\n4. The conflict copy is uploaded as a new file: \`report (Bilal's conflicted copy 2026-04-11).pdf\`\\n\\nThe user's edits are never silently discarded." }
] }
\`\`\`

---

## Key Trade-off Decisions

These five decisions are where interviewers probe depth. Know your answer and the one-sentence justification.

### 1. Chunked Upload vs Pre-signed URL

\`\`\`compare
{ "variant": "good-bad", "before": { "label": "Pre-signed URL (simpler, not chosen)", "code": "POST /files/upload-url\\n→ 200 { url: \\"https://s3.amazonaws.com/bucket/...?X-Amz-Signature=...\\" }\\n\\nClient PUTs directly to S3.\\nNo resume if connection drops.\\nNo server-side progress tracking." }, "after": { "label": "Chunked Upload Session (chosen)", "code": "POST /upload-sessions\\n→ 200 { session_id: \\"sess_xyz\\" }\\n\\nPUT /upload-sessions/sess_xyz/chunks?index=0\\nPUT /upload-sessions/sess_xyz/chunks?index=1\\n...\\nPOST /upload-sessions/sess_xyz/commit\\n\\nEach chunk is acknowledged. Resume from last\\nacknowledged chunk if the connection drops." } }
\`\`\`

\`\`\`callout
{ "type": "tip", "title": "Combine both", "content": "Pre-signed URLs and chunked uploads are not mutually exclusive. Use chunked sessions for reliability on large files; issue a pre-signed URL for files under 100 MB as a fast path. This is what Dropbox and Box both do." }
\`\`\`

### 2. Path-Based vs ID-Based Addressing

| Approach | Pros | Cons |
|----------|------|------|
| Path (\`/Documents/report.pdf\`) | Human-readable | Breaks silently on rename or move |
| ID (\`file_abc123\`) | Stable across renames and moves | Opaque in logs and debugging |

**Decision:** IDs for all API operations. Paths are a display convention and a lookup helper (\`GET /files?path=/Documents/report.pdf\`), not the primary key. This matches the Dropbox, Box, and Google Drive APIs.

### 3. Polling vs WebSocket for Sync

\`\`\`tabs
{ "tabs": [
  { "label": "Short Polling", "icon": "⏱️", "content": "\`\`\`\\nGET /sync/changes?cursor=cur_001\\n\`\`\`\\nClient polls every N seconds regardless of activity.\\n\\n**Verdict:** Wastes bandwidth. Fine for prototypes, unacceptable at scale." },
  { "label": "Long Polling ✓", "icon": "✅", "content": "\`\`\`\\nGET /sync/changes?cursor=cur_001&wait=30\\n\`\`\`\\nServer holds the connection open for up to 30 s and responds the moment a change arrives. Client immediately re-opens the next request.\\n\\n**Verdict:** Near real-time, stateless on the server, works through proxies and load balancers. Chosen for this design." },
  { "label": "WebSocket", "icon": "🔌", "content": "\`\`\`\\nws://api.example.com/sync\\n{ type: \\"subscribe\\", cursor: \\"cur_001\\" }\\n\`\`\`\\nTrue real-time push. Stateful connection the server must maintain.\\n\\n**Verdict:** Best latency, most complexity. Justified for collaboration tools (Google Docs). Overkill for file sync where changes happen on the scale of seconds." }
] }
\`\`\`

### 4. Conflict Resolution: Conflict Copy vs Last-Write-Wins

\`\`\`concept
{ "title": "Never silently discard user data", "variant": "rule", "content": "Last-write-wins is unacceptable for a file storage product. If two clients edit the same file offline, one person's work disappears with no warning. Conflict copy (the Dropbox model) preserves both versions and delegates the merge decision to the user — the only party who can correctly resolve it." }
\`\`\`

### 5. Flat vs Hierarchical API Shape

\`\`\`compare
{ "variant": "before-after", "before": { "label": "Fully nested (not chosen)", "code": "GET /users/{uid}/drives/{did}/folders/{fid}/files\\n\\n# Every request must know the full ancestry.\\n# A moved file changes the URL of every child." }, "after": { "label": "Hybrid (chosen)", "code": "# Global direct access — stable URL regardless of location\\nGET /files/{id}\\n\\n# Hierarchical listing — natural for browsing\\nGET /folders/{id}/items\\n\\n# Flat search — cross-folder\\nGET /files?parent=folder_xyz&type=pdf" } }
\`\`\`

---

## Scaling Architecture

\`\`\`sysdiag
{ "title": "Request Paths at Scale", "width": 680, "height": 380,
  "nodes": [
    { "id": "client", "label": "Client", "x": 60, "y": 190, "kind": "client" },
    { "id": "api", "label": "API Server", "x": 210, "y": 190, "kind": "service" },
    { "id": "cdn", "label": "CDN", "x": 360, "y": 100, "kind": "service" },
    { "id": "s3", "label": "Object Storage\\n(S3 / GCS)", "x": 520, "y": 100, "kind": "database" },
    { "id": "kafka", "label": "Change Log\\n(Kafka)", "x": 520, "y": 280, "kind": "queue" },
    { "id": "tmp", "label": "Temp Bucket\\n(chunks)", "x": 360, "y": 280, "kind": "database" }
  ],
  "edges": [
    { "from": "client", "to": "api", "label": "upload chunks" },
    { "from": "api", "to": "tmp", "label": "store chunk" },
    { "from": "api", "to": "s3", "label": "assemble on commit" },
    { "from": "client", "to": "cdn", "label": "download" },
    { "from": "cdn", "to": "s3", "label": "origin fetch" },
    { "from": "api", "to": "kafka", "label": "write change event" },
    { "from": "api", "to": "client", "label": "long-poll response" }
  ],
  "annotations": {
    "api": "Stateless — any node can handle any request. Coordinates chunk storage and emits change events.",
    "kafka": "Cursor maps to a Kafka offset. Long-poll consumers read from the tail of the log.",
    "cdn": "Pre-signed URLs let CDN serve downloads directly — no auth proxy, horizontal scaling for free.",
    "tmp": "Chunks land in a staging bucket. On commit, they are assembled and moved to permanent storage."
  }
}
\`\`\`

\`\`\`callout
{ "type": "info", "title": "Cursor = Kafka Offset", "content": "The opaque cursor returned by \`/sync/changes\` is, under the hood, a position (offset + partition) in the Kafka change log. This makes the sync feed horizontally scalable: add partitions, add consumers, and the cursor mechanism requires zero changes at the API contract level." }
\`\`\`

---

## What Makes This a Strong Answer

\`\`\`collapse
{ "title": "Deep Dive: How interviewers score API design answers", "content": "Interviewers at FAANG and similar companies score API design on five dimensions:\\n\\n1. **Correctness** — Does the API actually do the job? Are the right resources, methods, and status codes present?\\n2. **Trade-off awareness** — Did you mention alternatives and explain *why* you rejected them?\\n3. **Distributed systems thinking** — Do you understand what breaks at scale? (Idempotency, partial failures, conflict detection.)\\n4. **Authorization depth** — Did you think about permission inheritance, not just authentication?\\n5. **Operational awareness** — Do you know how uploads/downloads actually flow through infrastructure (CDN, object storage, temp buckets)?\\n\\nA candidate who lists endpoints scores 2/5. A candidate who defends each decision scores 5/5." }
\`\`\`

---

## Comprehension Check

\`\`\`quiz
{ "title": "Trade-off Recall", "questions": [
  { "question": "A client begins uploading a 2 GB file. The connection drops after 800 MB. With the chunked upload design, what happens?", "options": ["The upload fails and must restart from 0 MB", "The server detects the gap and retries automatically", "The client resumes from the last acknowledged chunk using the session ID", "The file is saved at 800 MB as a partial upload"], "answer": 2, "explanation": "Each chunk is acknowledged individually. The client tracks the last successful chunk index and resumes by re-sending from that point using the existing session ID — no data is re-transmitted." },
  { "question": "Two clients both edit file_abc (base version 3) while offline. Client A commits first. What does Client B receive when it commits?", "options": ["200 OK — last-write-wins", "409 Conflict — the server is now at version 4", "412 Precondition Failed — the ETag has changed", "503 Service Unavailable — conflict resolution queue is full"], "answer": 1, "explanation": "The upload session was created with base_version: 3. By the time Client B commits, the server is at version 4. The version mismatch triggers a 409 Conflict, prompting the client to create a conflict copy or merge." },
  { "question": "Why does this design use long-polling for \`/sync/changes\` rather than WebSockets?", "options": ["WebSockets cannot carry binary payloads", "Long-polling works through standard HTTP load balancers without sticky sessions", "WebSockets are not supported in mobile browsers", "Long-polling has lower latency than WebSockets"], "answer": 1, "explanation": "WebSockets require stateful connections, which complicates load balancing and proxy configuration. Long-polling is HTTP — stateless on the server, compatible with every CDN and load balancer, and nearly as responsive for file sync workloads where changes happen on the order of seconds." },
  { "question": "Which mechanism prevents two clients from unknowingly overwriting each other's changes?", "options": ["File-level locking during the upload session", "The base_version field acting as an optimistic concurrency token", "Last-write-wins with a server-side timestamp", "Client-side file locking via the permissions API"], "answer": 1, "explanation": "Optimistic concurrency: the client declares which version it started from (base_version). If the server has advanced past that version by the time the commit arrives, it rejects the write with 409. No locks are held — other clients can read and write freely." }
] }
\`\`\`

---

\`\`\`takeaways
{ "title": "Key Takeaways", "items": [
  "Chunked upload sessions give resumability and progress tracking; combine with simple upload for the fast path on small files.",
  "Use stable IDs as the primary API key — paths are human-readable aliases, not addresses.",
  "Long-polling is the right sync transport: near real-time, stateless, and proxy-friendly. WebSockets are justified only when latency requirements drop below one second.",
  "Never silently discard edits. Conflict copies preserve all versions and delegate resolution to the user.",
  "Cursors map to positions in an append-only change log (Kafka offsets). This is what makes sync scalable — adding consumers costs nothing at the API contract level.",
  "Pre-signed URLs shift download bandwidth from API servers to the CDN/object storage layer — critical for horizontal scale."
] }
\`\`\``,
    },
  ],
};

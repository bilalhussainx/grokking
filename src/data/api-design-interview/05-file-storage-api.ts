import { Module } from "../types";

export const fileStorageApiModule: Module = {
  id: "design-storage-api",
  title: "Design File Storage API",
  description:
    "Design a Dropbox-like file storage API — chunked uploads, resumable transfers, sharing permissions, and sync conflict resolution.",
  lessons: [
    {
      id: "storage-requirements",
      slug: "storage-requirements",
      title: "Requirements & Resource Modeling",
      content: `# Design File Storage API: Requirements & Resource Modeling

File storage APIs like Dropbox, Google Drive, and Box handle some of the trickiest problems in API design: large file transfers, hierarchical data, sharing permissions, and multi-device sync. This is a rich interview question.

## Step 1: Clarify Requirements

**Functional Requirements:**
- Users can upload, download, and delete files
- Support for folders (hierarchical file organization)
- File sharing with configurable permissions (view, edit, owner)
- File versioning (view and restore previous versions)
- Sync across devices (detect and resolve conflicts)

**Non-Functional Requirements:**
- Support files up to 10 GB (chunked upload required)
- Resumable uploads (network interruptions should not require restart)
- Efficient sync (only transfer changed files)
- Content-addressable storage for deduplication

## Step 2: Identify Resources

\`\`\`
Core Resources:
├── File            → /files
├── Folder          → /folders
├── FileVersion     → /files/{id}/versions
├── SharedLink      → /files/{id}/shared-links
├── Permission      → /files/{id}/permissions
├── UploadSession   → /upload-sessions
└── SyncCursor      → /sync/cursor
\`\`\`

## Step 3: Resource Schemas

### File Resource

\`\`\`json
{
  "id": "file_abc123",
  "name": "report.pdf",
  "type": "file",
  "mime_type": "application/pdf",
  "size_bytes": 2048576,
  "hash": "sha256:a1b2c3d4e5f6...",
  "parent_folder": "folder_root",
  "path": "/Documents/Reports/report.pdf",
  "version": 3,
  "owner": { "id": "usr_123", "email": "jane@example.com" },
  "modified_at": "2025-03-10T14:30:00Z",
  "created_at": "2025-01-15T10:00:00Z"
}
\`\`\`

### Folder Resource

\`\`\`json
{
  "id": "folder_xyz",
  "name": "Reports",
  "type": "folder",
  "parent_folder": "folder_docs",
  "path": "/Documents/Reports",
  "item_count": 12,
  "owner": { "id": "usr_123", "email": "jane@example.com" },
  "modified_at": "2025-03-10T14:30:00Z"
}
\`\`\`

## Endpoint Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /files/{id} | Get file metadata |
| GET | /files/{id}/content | Download file content |
| DELETE | /files/{id} | Delete file (move to trash) |
| PATCH | /files/{id} | Rename or move file |
| GET | /files/{id}/versions | List file versions |
| POST | /files/{id}/versions/{v}/restore | Restore a version |
| GET | /folders/{id} | Get folder metadata |
| GET | /folders/{id}/items | List folder contents |
| POST | /folders | Create folder |
| DELETE | /folders/{id} | Delete folder |
| POST | /upload-sessions | Start upload session |
| PUT | /upload-sessions/{id}/chunks | Upload a chunk |
| POST | /upload-sessions/{id}/commit | Finalize upload |
| POST | /files/{id}/shared-links | Create shared link |
| POST | /files/{id}/permissions | Grant permission |
| GET | /sync/changes | Get changes since cursor |

## Key Design Decisions

1. **Separate metadata and content endpoints:** \`GET /files/{id}\` returns metadata (JSON), \`GET /files/{id}/content\` returns the actual bytes. This separation enables metadata-only sync and efficient caching.

2. **Content-addressable hashing:** Every file includes a SHA-256 hash. Clients can check if a file already exists server-side before uploading (deduplication). Two identical files share the same storage block.

3. **Path vs ID addressing:** Files have both a path (\`/Documents/report.pdf\`) and an ID (\`file_abc123\`). The ID is stable (survives renames), while the path is human-readable. API operations use IDs; paths are for display.

4. **Soft delete:** \`DELETE /files/{id}\` moves to trash. \`DELETE /files/{id}?permanent=true\` permanently deletes. This prevents accidental data loss.`,
    },
    {
      id: "storage-upload-download",
      slug: "storage-upload-download",
      title: "Upload & Download (Chunked/Resumable)",
      content: `# Upload & Download (Chunked/Resumable)

Large file uploads are the defining technical challenge. A 5 GB file cannot be uploaded in a single HTTP request — it needs chunking, resumability, and progress tracking.

## Upload Flow Overview

\`\`\`
1. Create upload session     → POST /upload-sessions
2. Upload chunks             → PUT /upload-sessions/{id}/chunks (repeat)
3. Commit upload             → POST /upload-sessions/{id}/commit
\`\`\`

## Step 1: Create Upload Session

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

The chunk size defaults to 8 MB but can be adjusted. The session expires after 24 hours.

## Step 2: Upload Chunks

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

**Resumability:** If the upload is interrupted, the client queries the session to find which chunks are missing:

\`\`\`http
GET /api/v1/upload-sessions/ups_001

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

The client resumes from chunk 5 — no data is re-uploaded.

## Step 3: Commit Upload

After all chunks are uploaded, the client commits to create the file:

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

The server verifies the complete file hash against the client-provided hash. If they do not match, the server returns 409 Conflict.

## Small File Upload (Simple)

For files under 100 MB, a single-request upload is supported:

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

## Download

### Direct Download

\`\`\`http
GET /api/v1/files/file_abc123/content
Authorization: Bearer <token>

HTTP/1.1 200 OK
Content-Type: video/mp4
Content-Length: 5368709120
Content-Disposition: attachment; filename="large-video.mp4"
Accept-Ranges: bytes

<binary data>
\`\`\`

### Range Requests (Resumable Download)

\`\`\`http
GET /api/v1/files/file_abc123/content
Range: bytes=1000000-2000000

HTTP/1.1 206 Partial Content
Content-Range: bytes 1000000-2000000/5368709120
Content-Length: 1000001

<partial binary data>
\`\`\`

### Pre-signed Download URL

For CDN-cached downloads, return a temporary signed URL:

\`\`\`http
POST /api/v1/files/file_abc123/download-url

HTTP/1.1 200 OK
{
  "download_url": "https://cdn.example.com/files/abc123?token=xyz&expires=1710080460",
  "expires_at": "2025-03-10T15:30:00Z"
}
\`\`\`

This offloads bandwidth to the CDN and supports browser-native download UX.`,
    },
    {
      id: "storage-sharing",
      slug: "storage-sharing",
      title: "File Sharing & Permissions",
      content: `# File Sharing & Permissions

File sharing introduces authorization complexity. The API must support multiple sharing models: direct user permissions, shared links, and inherited folder permissions.

## Permission Model

\`\`\`
Permission levels:
  viewer   → Can view and download
  editor   → Can view, download, and edit
  owner    → Full control (share, delete, manage permissions)
\`\`\`

### Grant Permission to a User

\`\`\`http
POST /api/v1/files/file_abc123/permissions HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_email": "bob@example.com",
  "role": "editor",
  "notify": true,
  "message": "Please review this document."
}
\`\`\`

\`\`\`http
HTTP/1.1 201 Created

{
  "id": "perm_001",
  "file_id": "file_abc123",
  "user": { "id": "usr_456", "email": "bob@example.com" },
  "role": "editor",
  "granted_by": { "id": "usr_123", "email": "jane@example.com" },
  "created_at": "2025-03-10T14:30:00Z"
}
\`\`\`

### List Permissions

\`\`\`http
GET /api/v1/files/file_abc123/permissions

HTTP/1.1 200 OK
{
  "data": [
    { "id": "perm_owner", "user": { "email": "jane@example.com" }, "role": "owner", "source": "direct" },
    { "id": "perm_001", "user": { "email": "bob@example.com" }, "role": "editor", "source": "direct" },
    { "id": "perm_002", "user": { "email": "alice@example.com" }, "role": "viewer", "source": "inherited", "inherited_from": "folder_xyz" }
  ]
}
\`\`\`

**The \`source\` field** distinguishes between direct permissions and those inherited from a parent folder.

### Update Permission

\`\`\`http
PATCH /api/v1/files/file_abc123/permissions/perm_001
{ "role": "viewer" }

HTTP/1.1 200 OK
{ "id": "perm_001", "role": "viewer", ... }
\`\`\`

### Revoke Permission

\`\`\`http
DELETE /api/v1/files/file_abc123/permissions/perm_001

HTTP/1.1 204 No Content
\`\`\`

## Shared Links

Shared links provide access without requiring a user account:

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

### Shared Link Access

\`\`\`http
# Access shared file (no auth required, password in header if protected)
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

## Folder Permission Inheritance

Permissions on a folder cascade to all children:

\`\`\`
/Shared Project (Bob = editor)
  ├── design.figma      → Bob can edit (inherited)
  ├── spec.md           → Bob can edit (inherited)
  └── /Confidential     → Bob can edit (inherited)
      └── budget.xlsx   → Bob can edit (inherited)
\`\`\`

**Breaking inheritance:** A file or subfolder can override the inherited permission:

\`\`\`http
POST /api/v1/files/budget_xlsx/permissions
{
  "user_email": "bob@example.com",
  "role": "viewer",
  "override_inherited": true
}
\`\`\`

Now Bob can view but not edit budget.xlsx, even though the parent folder grants editor access.

## Authorization Error Cases

\`\`\`http
# No permission
GET /api/v1/files/file_secret/content
HTTP/1.1 403 Forbidden
{ "error": { "code": "ACCESS_DENIED", "message": "You do not have permission to access this file." } }

# Shared link expired
GET /api/v1/shared/expired_link
HTTP/1.1 410 Gone
{ "error": { "code": "LINK_EXPIRED", "message": "This shared link has expired." } }

# Wrong password
GET /api/v1/shared/abc123xyz
X-Link-Password: wrong
HTTP/1.1 401 Unauthorized
{ "error": { "code": "INVALID_PASSWORD", "message": "Incorrect password for this shared link." } }

# Cannot share what you don't own
POST /api/v1/files/file_abc123/permissions
HTTP/1.1 403 Forbidden
{ "error": { "code": "INSUFFICIENT_PERMISSIONS", "message": "Only owners can manage permissions." } }
\`\`\`

When designing file sharing, always clarify the permission model early in the interview — it affects every other endpoint.`,
    },
    {
      id: "storage-sync",
      slug: "storage-sync",
      title: "Sync Protocol & Conflict Resolution",
      content: `# Sync Protocol & Conflict Resolution

Multi-device sync is the hardest part of a file storage API. The client needs to know what changed since it last synced, and the server must handle conflicts when two devices edit the same file.

## Change Feed API

The sync protocol is based on a **cursor-based change feed**. The client requests all changes since its last known cursor.

\`\`\`http
GET /api/v1/sync/changes?cursor=cur_abc123&limit=100
Authorization: Bearer <token>

HTTP/1.1 200 OK
{
  "changes": [
    {
      "type": "file_modified",
      "file": { "id": "file_001", "name": "notes.md", "version": 4, "hash": "sha256:abc..." },
      "modified_at": "2025-03-10T14:30:00Z"
    },
    {
      "type": "file_created",
      "file": { "id": "file_002", "name": "photo.jpg", "size_bytes": 3048576 },
      "modified_at": "2025-03-10T14:31:00Z"
    },
    {
      "type": "file_deleted",
      "file": { "id": "file_003" },
      "modified_at": "2025-03-10T14:32:00Z"
    },
    {
      "type": "folder_created",
      "folder": { "id": "folder_new", "name": "Archive", "path": "/Archive" },
      "modified_at": "2025-03-10T14:33:00Z"
    }
  ],
  "cursor": "cur_def456",
  "has_more": false
}
\`\`\`

**The cursor is opaque.** The client stores it locally and sends it on the next sync request. The server uses it to determine the starting point for changes.

### Initial Sync

On first sync, the client sends no cursor. The server returns all files:

\`\`\`http
GET /api/v1/sync/changes?limit=500

HTTP/1.1 200 OK
{
  "changes": [ /* all files and folders */ ],
  "cursor": "cur_initial_001",
  "has_more": true
}
\`\`\`

The client pages through with \`has_more\` until all files are synced.

## Conflict Detection

Conflicts occur when two devices edit the same file before syncing:

\`\`\`
Device A: Edit file_001 (version 3 → 4)
Device B: Edit file_001 (version 3 → 4)   ← conflict!
\`\`\`

### Optimistic Locking with Version Numbers

When uploading a changed file, the client includes the base version:

\`\`\`http
POST /api/v1/upload-sessions HTTP/1.1
{
  "file_id": "file_001",
  "base_version": 3,
  "file_name": "notes.md",
  "file_size": 1024
}
\`\`\`

The server checks: if the current version is 3, the upload succeeds (new version 4). If the current version is already 4 (another device edited first), the server returns a conflict:

\`\`\`http
HTTP/1.1 409 Conflict
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "File has been modified since your base version.",
    "current_version": 4,
    "your_base_version": 3,
    "conflict_resolution": {
      "server_file": {
        "version": 4,
        "modified_by": "Device A",
        "modified_at": "2025-03-10T14:30:00Z"
      }
    }
  }
}
\`\`\`

## Conflict Resolution Strategies

| Strategy | How It Works | Used By |
|----------|-------------|---------|
| **Last write wins** | Most recent upload overwrites | Simple but lossy |
| **Conflict copy** | Save both versions with names like \`notes (conflict).md\` | Dropbox |
| **Merge** | Attempt automatic merge (text files) | Google Docs |
| **User decides** | Present both versions to the user | Git |

For a file storage API, **conflict copy** is the safest default:

\`\`\`http
POST /api/v1/files/file_001/resolve-conflict
{
  "strategy": "keep_both",
  "local_file_session": "ups_002"
}

HTTP/1.1 200 OK
{
  "original": { "id": "file_001", "name": "notes.md", "version": 4 },
  "conflict_copy": { "id": "file_004", "name": "notes (conflict from Device B).md", "version": 1 }
}
\`\`\`

## Long Polling for Real-Time Sync

Instead of polling every N seconds, the client can use long polling:

\`\`\`http
GET /api/v1/sync/changes?cursor=cur_def456&wait=30

# Server holds the connection open for up to 30 seconds.
# Returns immediately if changes occur.
# Returns empty changes array if timeout with no changes.
\`\`\`

This reduces API calls from thousands per hour (polling) to a handful (long polling with instant response on changes).

## Delta Sync (Bandwidth Optimization)

For large files with small changes (e.g., editing one slide in a presentation), transferring the entire file is wasteful. Delta sync transfers only the changed blocks:

\`\`\`http
GET /api/v1/files/file_001/blocks
{
  "blocks": [
    { "index": 0, "hash": "sha256:aaa", "size": 4096 },
    { "index": 1, "hash": "sha256:bbb", "size": 4096 },
    { "index": 2, "hash": "sha256:ccc", "size": 4096 }
  ]
}
\`\`\`

The client compares local block hashes with server block hashes and uploads only the blocks that differ. This is how Dropbox achieves efficient sync for large files.

In an interview, always mention the cursor-based change feed and conflict detection via version numbers — these are the two pillars of any sync protocol.`,
    },
    {
      id: "storage-walkthrough",
      slug: "storage-walkthrough",
      title: "API Walkthrough",
      content: `# File Storage API: Walkthrough & Trade-offs

Let us consolidate the complete file storage API design and discuss the key trade-offs.

## Complete Endpoint Summary

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Files** | GET | /files/{id} | Get file metadata |
| | GET | /files/{id}/content | Download file |
| | PATCH | /files/{id} | Rename/move file |
| | DELETE | /files/{id} | Move to trash |
| | GET | /files/{id}/versions | List version history |
| | POST | /files/{id}/versions/{v}/restore | Restore version |
| **Folders** | POST | /folders | Create folder |
| | GET | /folders/{id} | Get folder metadata |
| | GET | /folders/{id}/items | List contents |
| | PATCH | /folders/{id} | Rename/move folder |
| | DELETE | /folders/{id} | Move to trash |
| **Upload** | POST | /upload-sessions | Start chunked upload |
| | PUT | /upload-sessions/{id}/chunks | Upload chunk |
| | POST | /upload-sessions/{id}/commit | Finalize upload |
| | POST | /files/upload | Simple upload (< 100MB) |
| **Download** | GET | /files/{id}/content | Direct download |
| | POST | /files/{id}/download-url | Get pre-signed URL |
| **Sharing** | POST | /files/{id}/permissions | Grant permission |
| | GET | /files/{id}/permissions | List permissions |
| | PATCH | /files/{id}/permissions/{pid} | Update permission |
| | DELETE | /files/{id}/permissions/{pid} | Revoke permission |
| | POST | /files/{id}/shared-links | Create shared link |
| | DELETE | /shared-links/{id} | Revoke shared link |
| **Sync** | GET | /sync/changes | Get changes since cursor |
| | POST | /files/{id}/resolve-conflict | Resolve sync conflict |

## End-to-End Sync Flow

\`\`\`
1. Client starts:
   GET /sync/changes (no cursor) → receive all files + initial cursor

2. Client edits a file locally:
   POST /upload-sessions { file_id, base_version: 3 }
   PUT /upload-sessions/{id}/chunks (upload changed content)
   POST /upload-sessions/{id}/commit → file version 4

3. Client polls for remote changes:
   GET /sync/changes?cursor=cur_001&wait=30
   → Receives changes from other devices
   → Updates local state
   → Stores new cursor

4. Conflict detected:
   POST /upload-sessions { file_id, base_version: 3 }
   → 409 Conflict (server is at version 4)
   → Client creates conflict copy or merges
\`\`\`

## Trade-offs to Discuss

### 1. Chunked Upload vs Pre-signed URL Upload

| Approach | Pros | Cons |
|----------|------|------|
| Chunked (our choice) | Resumable, progress tracking, server validation | More complex, server handles bytes |
| Pre-signed URL to S3 | Offloads bandwidth to cloud storage | No resumability without custom client, less control |

**Justification:** Chunked upload is better for reliability. Large files over unreliable networks need resumability. Pre-signed URLs can complement this for small files.

### 2. Path-Based vs ID-Based Addressing

| Approach | Pros | Cons |
|----------|------|------|
| Path (/Documents/report.pdf) | Human-readable | Breaks on rename |
| ID (file_abc123) | Stable, survives renames | Opaque, harder to debug |

**Our choice:** IDs for all API operations. Paths as a display/lookup convenience. This matches Dropbox's approach.

### 3. Polling vs WebSocket for Sync

| Approach | Pros | Cons |
|----------|------|------|
| Short polling | Simple | Wastes bandwidth, latency |
| Long polling (our choice) | Efficient, near real-time | Connection management |
| WebSocket | True real-time | Complex, stateful connections |

**Justification:** Long polling balances simplicity and responsiveness. WebSocket adds complexity that is unnecessary for file sync (changes happen on the scale of seconds, not milliseconds).

### 4. Conflict Copy vs Last-Write-Wins

**Our choice:** Conflict copy (Dropbox model). Losing a user's edits is unacceptable for a file storage product. Creating a conflict copy preserves all data and lets the user decide.

### 5. Flat vs Hierarchical API

\`\`\`
Flat:    GET /files?parent=folder_xyz
Nested:  GET /folders/folder_xyz/files
\`\`\`

**Our choice:** Nested for listing (\`/folders/{id}/items\`), flat for direct access (\`/files/{id}\`). Files have a globally unique ID, so direct access does not need to traverse the folder hierarchy.

## Scaling Considerations

\`\`\`
Upload path:
  Client → API Server → Object Storage (S3/GCS)
  Chunks stored in temp bucket → assembled on commit → moved to permanent bucket

Download path:
  Client → CDN → Object Storage
  Pre-signed URLs enable CDN caching without auth proxying

Sync path:
  Changes written to append-only log (like Kafka)
  Cursor maps to a position in the log
  Long-polling consumers read from the log
\`\`\`

## What Makes This a Strong Answer

1. **Chunked/resumable upload** — demonstrates understanding of real-world network conditions
2. **Version-based conflict detection** — shows distributed systems awareness
3. **Cursor-based sync** — the standard pattern for change feeds
4. **Permission inheritance** — shows you think about authorization deeply
5. **Pre-signed URLs** — shows awareness of CDN and bandwidth optimization
6. **Content hashing** — shows deduplication awareness`,
    },
  ],
};

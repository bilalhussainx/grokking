"""
MemPalace Bridge — FastAPI service wrapping mempalace for Samsara voice coaches.

Samsara voice coaches (Moonshot/Kimi K2, Deepgram Agent) use this bridge to:
  1. Load a user's past learning memories before a session starts
  2. Save session content after a session ends

Architecture:
  Wing  = user ID (each learner has their own private wing)
  Room  = language being practiced (spanish, hindi, punjabi, etc.)
  Hall  = session type (conversation, vocabulary, grammar, cultural)
  Drawer = session content + coaching notes

Run:
  pip install -r requirements.txt
  uvicorn main:app --port 8765 --reload

Or from project root:
  cd mempalace-bridge && uvicorn main:app --port 8765
"""

import os
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add mempalace to path (sibling directory)
import sys
sys.path.insert(0, str(Path(__file__).parent.parent / "mempalace"))

from mempalace.searcher import search as mp_search, SearchError
from mempalace.knowledge_graph import KnowledgeGraph

# Palace stored at ~/.samsara-palace per user
PALACE_BASE = Path.home() / ".samsara-palace"
PALACE_BASE.mkdir(exist_ok=True)

app = FastAPI(title="MemPalace Bridge", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)


def palace_path(user_id: str) -> str:
    """Each user has an isolated palace directory."""
    p = PALACE_BASE / user_id / "palace"
    p.mkdir(parents=True, exist_ok=True)
    return str(p)


# ─── Models ──────────────────────────────────────────────────────────────────

class SearchRequest(BaseModel):
    user_id: str
    query: str
    language: Optional[str] = None   # filters to a specific language room
    n_results: int = 5


class SaveSessionRequest(BaseModel):
    user_id: str
    language: str                    # e.g. "spanish", "hindi"
    session_type: str                # e.g. "conversation", "vocabulary"
    content: str                     # full session transcript or coaching notes
    coach_notes: Optional[str] = None  # extra coach observations about the learner


class SaveFactRequest(BaseModel):
    user_id: str
    subject: str    # e.g. "user"
    predicate: str  # e.g. "struggles_with"
    object: str     # e.g. "subjunctive_mood"


class WakeUpRequest(BaseModel):
    user_id: str
    language: str   # current session language — loads relevant memories


# ─── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "palace_base": str(PALACE_BASE)}


@app.post("/wake-up")
def wake_up(req: WakeUpRequest):
    """
    Load critical context for a coaching session.
    Returns the top 5 memories most relevant to this language + recent coach notes.
    Called by the voice coach before starting a session.
    """
    pp = palace_path(req.user_id)
    memories = []

    # Recent sessions in this language
    try:
        results = mp_search(
            query=f"learning {req.language} practice conversation",
            palace_path=pp,
            wing=req.user_id,
            room=req.language,
            n_results=5,
        )
        if results:
            memories.extend(results)
    except SearchError:
        pass  # No palace yet — first session

    # Known struggles and progress facts
    kg = KnowledgeGraph(db_path=str(PALACE_BASE / req.user_id / "kg.db"))
    facts = []
    try:
        rows = kg.query("user", as_of=None, direction="both")
        facts = [f"{r['predicate']} {r['object']}" for r in (rows or [])]
    except Exception:
        pass

    return {
        "user_id": req.user_id,
        "language": req.language,
        "memories": memories,
        "facts": facts,
        "context_summary": _build_context_summary(req.language, memories, facts),
    }


def _build_context_summary(language: str, memories: list, facts: list) -> str:
    """
    Build a ≤300 token context string the voice coach injects into its system prompt.
    This is the "L1 Essential Story" layer — only what matters for this session.
    """
    lines = [f"[MEMORY: Learner's {language} history]"]
    if facts:
        lines.append("Known facts: " + "; ".join(facts[:5]))
    if memories:
        lines.append("Recent sessions:")
        for m in memories[:3]:
            snippet = str(m)[:200].replace("\n", " ")
            lines.append(f"  - {snippet}")
    if not facts and not memories:
        lines.append("No prior history — this is likely their first session.")
    return "\n".join(lines)


@app.post("/search")
def search_memories(req: SearchRequest):
    """Semantic search across a user's palace. Used during active coaching."""
    pp = palace_path(req.user_id)
    try:
        results = mp_search(
            query=req.query,
            palace_path=pp,
            wing=req.user_id,
            room=req.language,
            n_results=req.n_results,
        )
        return {"results": results or []}
    except SearchError as e:
        return {"results": [], "note": str(e)}


@app.post("/save-session")
def save_session(req: SaveSessionRequest):
    """
    Save a completed coaching session to the palace.
    Called at the end of each voice session.
    """
    import chromadb

    pp = palace_path(req.user_id)
    client = chromadb.PersistentClient(path=pp)
    col = client.get_or_create_collection("mempalace_drawers")

    now = datetime.utcnow()
    session_id = f"session_{req.user_id}_{req.language}_{now.strftime('%Y%m%d_%H%M%S')}_{hashlib.md5(req.content[:50].encode()).hexdigest()[:8]}"

    full_content = req.content
    if req.coach_notes:
        full_content += f"\n\n[Coach notes]: {req.coach_notes}"

    col.add(
        documents=[full_content],
        metadatas=[{
            "wing": req.user_id,
            "room": req.language,
            "hall": req.session_type,
            "type": "session",
            "timestamp": now.isoformat(),
            "source_file": session_id,
        }],
        ids=[session_id],
    )

    return {"saved": True, "session_id": session_id}


@app.post("/save-fact")
def save_fact(req: SaveFactRequest):
    """
    Save a structured fact about the learner to the knowledge graph.
    E.g.: user / struggles_with / subjunctive_mood
         user / prefers / evening_sessions
         user / reached_level / B1_spanish
    """
    kg = KnowledgeGraph(db_path=str(PALACE_BASE / req.user_id / "kg.db"))
    try:
        kg.add(
            subject=req.subject,
            predicate=req.predicate,
            object=req.object,
            valid_from=datetime.utcnow().isoformat(),
        )
        return {"saved": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/clear/{user_id}")
def clear_palace(user_id: str):
    """Remove all memories for a user (GDPR delete). Irreversible."""
    import shutil
    target = PALACE_BASE / user_id
    if target.exists():
        shutil.rmtree(target)
    return {"cleared": True, "user_id": user_id}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765)

"""
Kokoro TTS Server
Simple FastAPI wrapper for Kokoro-82M text-to-speech
"""

import io
import base64
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import torch
import numpy as np

app = FastAPI(title="Kokoro TTS Server")

# Global model (loaded on first request)
pipeline = None

def get_pipeline():
    global pipeline
    if pipeline is None:
        from kokoro import KPipeline
        # Load pipeline for American English
        pipeline = KPipeline(lang_code='a')
    return pipeline

class TTSRequest(BaseModel):
    text: str
    voice: str = "af_bella"
    speed: float = 1.0

class TTSResponse(BaseModel):
    audio: str  # base64 encoded
    sample_rate: int
    duration: float

@app.get("/health")
def health():
    return {"status": "healthy", "model": "kokoro-82M"}

@app.post("/v1/audio/speech")
def text_to_speech(req: TTSRequest):
    try:
        pipeline = get_pipeline()
        
        # Generate audio
        generator = pipeline(
            req.text,
            voice=req.voice,
            speed=req.speed,
            split_pattern=r'\n+'
        )
        
        # Collect all audio segments
        audio_segments = []
        for _, _, audio in generator:
            audio_segments.append(audio)
        
        # Concatenate
        if len(audio_segments) == 0:
            raise HTTPException(status_code=400, detail="No audio generated")
        
        full_audio = np.concatenate(audio_segments)
        
        # Convert to bytes (16-bit PCM)
        audio_bytes = (full_audio * 32767).astype(np.int16).tobytes()
        
        # Return as MP3 (actually PCM for simplicity)
        return Response(
            content=audio_bytes,
            media_type="audio/wav",
            headers={
                "Content-Type": "audio/wav",
                "X-Sample-Rate": "24000"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/voices")
def list_voices():
    # Kokoro voices
    voices = [
        {"id": "af_bella", "name": "Bella (Female)", "language": "en-US"},
        {"id": "af_sarah", "name": "Sarah (Female)", "language": "en-US"},
        {"id": "af_nicole", "name": "Nicole (Female)", "language": "en-US"},
        {"id": "af_sky", "name": "Sky (Female)", "language": "en-US"},
        {"id": "am_adam", "name": "Adam (Male)", "language": "en-US"},
        {"id": "am_michael", "name": "Michael (Male)", "language": "en-US"},
    ]
    return {"voices": voices}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

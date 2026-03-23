# Kokoro TTS Server
# Lightweight TTS service using Kokoro-82M

FROM python:3.10-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --no-cache-dir \
    torch \
    torchaudio \
    transformers \
    fastapi \
    uvicorn \
    soundfile \
    numpy

# Install Kokoro
RUN pip install --no-cache-dir \
    kokoro>=0.3.0 \
    misaki[en]

# Copy server code
COPY server.py .

EXPOSE 8000

CMD ["python", "server.py"]

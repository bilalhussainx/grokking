# Local VPS Development Setup

Run the voice stack locally on your NVIDIA GPU (STT + TTS), with Moonshot API for the LLM brain.

## Architecture

```
Browser (React App)
    ↓ WebSocket (ws://localhost:8080/ws or wss://tunnel-url/ws)
Ngrok/Cloudflare Tunnel (optional)
    ↓
Relay Server (port 8080)
    ├── Faster-Whisper (port 8001) - STT
    ├── Kokoro TTS (port 8002) - TTS
    └── Moonshot API (cloud) - LLM (Kimi K2)
```

## Quick Start

### 1. Prerequisites

- **NVIDIA GPU** with at least 6GB VRAM (8GB+ recommended)
- **Docker Desktop** with NVIDIA Container Toolkit
- **Windows PowerShell** or WSL2
- **Moonshot API Key** (get from https://platform.moonshot.cn/)

### 2. Install NVIDIA Container Toolkit

```powershell
# On Windows with WSL2
wsl --install
wsl --update

# Inside WSL2 Ubuntu:
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update
sudo apt-get install -y nvidia-docker2
sudo systemctl restart docker
```

### 3. Environment Configuration

Ensure your root `.env.local` has:
```bash
# Moonshot API Key (REQUIRED)
MOONSHOT_API_KEY=sk-your-key-here

# Supabase (already configured)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
JWT_SECRET=your-jwt-secret

# VPS Configuration
VPS_HOST=localhost          # Change to ngrok URL when tunneling
VPS_PORT=8080
VPS_USE_SSL=false           # Set to true when using ngrok
```

### 4. First Time Setup (Build Images)

The first run will build the Kokoro TTS image (takes 5-10 minutes):

```powershell
cd vps

# Build and start (first time - be patient!)
docker-compose up -d --build

# Watch the build progress
docker-compose logs -f kokoro
```

### 5. Start the Stack (Subsequent Runs)

```powershell
cd vps

# Start all services (no build needed)
.\start.ps1

# Watch logs
docker-compose logs -f

# Check health
curl http://localhost:8080/health
```

### 6. Expose via Tunnel (Choose one)

#### Option A: Ngrok (Quick, temporary URLs)

```powershell
# Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken
# Then run:
ngrok config add-authtoken YOUR_TOKEN

# Start tunnel
.\start-tunnel.ps1 -Provider ngrok

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

Then update your `.env.local` in the project root:
```bash
VPS_HOST=abc123.ngrok.io
VPS_USE_SSL=true
```

Restart your Next.js dev server to pick up the new config.

#### Option B: Cloudflare Tunnel (Stable URL)

```powershell
# 1. Get your token from: https://dash.teams.cloudflare.com/
# 2. Edit vps/.env and set: CLOUDFLARE_TUNNEL_TOKEN=your-token
# 3. Uncomment tunnel service in docker-compose.yml
# 4. Restart: docker-compose up -d
```

### 7. Test the Setup

```powershell
# Test Whisper
curl http://localhost:8001/health

# Test Kokoro
curl http://localhost:8002/health

# Test Relay (also verifies Moonshot API connectivity)
curl http://localhost:8080/health
```

## GPU Memory Usage

| Service | VRAM | Notes |
|---------|------|-------|
| Faster-Whisper | ~6GB | large-v3-turbo |
| Kokoro-82M | <1GB | Very lightweight |
| **Total** | **~7GB** | Fits on RTX 3060 12GB |

The LLM (Kimi K2) runs on Moonshot's cloud - no local GPU needed!

For GPUs with less VRAM:
```yaml
# In docker-compose.yml, use smaller Whisper model:
environment:
  - WHISPER_MODEL=medium  # ~2GB instead of 6GB
```

## Troubleshooting

### "Unknown runtime specified nvidia"

```powershell
# On Windows, use WSL2 backend for Docker
# Settings → General → Use the WSL 2 based engine
```

### "Moonshot API key not configured"

```powershell
# Make sure MOONSHOT_API_KEY is set in your .env.local
# Then restart the relay:
docker-compose restart relay
```

### CUDA out of memory

```powershell
# Check GPU usage
nvidia-smi

# Reduce model sizes in docker-compose.yml
# Or limit GPU memory per container
```

### Tunnel disconnects frequently

- Use Cloudflare Tunnel for stable connections
- Or upgrade to ngrok paid plan for longer sessions

## Useful Commands

```powershell
# View GPU usage
nvidia-smi

# Restart single service
docker-compose restart relay

# View logs for specific service
docker-compose logs -f relay

# Stop everything
docker-compose down

# Rebuild relay after code changes
docker-compose up -d --build relay

# Clean up everything (including volumes!)
docker-compose down -v

# Update images
docker-compose pull
docker-compose up -d
```

## Production Deployment

When ready for production:

1. Rent a GPU VPS (RunPod, Vast.ai, Lambda Labs)
2. Copy this `vps/` folder to the server
3. Set `MOONSHOT_API_KEY` in environment
4. Use Cloudflare Tunnel for stable, secure connections
5. Set up monitoring and alerting
6. Remove ngrok references

Update `.env.local`:
```bash
VPS_HOST=your-vps-ip-or-domain
VPS_PORT=8080
VPS_USE_SSL=false  # Or true if using HTTPS
```

## Cost Comparison

| Setup | Monthly Cost | Notes |
|-------|--------------|-------|
| **Local + Tunnel** | **$0** + API usage | ~$0.03/min for Kimi API |
| RunPod RTX 3090 | ~$100 | 24/7 usage, no LLM VRAM needed |
| Vast.ai RTX 3090 | ~$50 | Spot instances, variable |

Moonshot API costs:
- Kimi K2 Turbo: ~$0.50 per 1M tokens (very affordable)
- Typical conversation: ~500 tokens = $0.00025 per turn

## Environment Variables

The following are already configured from your `.env.local`:

| Variable | Location | Purpose |
|----------|----------|---------|
| `MOONSHOT_API_KEY` | `.env.local` | LLM brain (Kimi K2) |
| `SUPABASE_URL` | `vps/.env` | Database connection |
| `SUPABASE_SERVICE_ROLE_KEY` | `vps/.env` | Server-side auth |
| `JWT_SECRET` | `vps/.env` | Session tokens |
| `VPS_HOST` | `.env.local` | Relay connection |
| `VPS_USE_SSL` | `.env.local` | WebSocket protocol |

## Quick Test Script

```powershell
# Save as test-voice.ps1 and run after starting services

$services = @(
    @{ Name = "Whisper"; Url = "http://localhost:8001/health" },
    @{ Name = "Kokoro"; Url = "http://localhost:8002/health" },
    @{ Name = "Relay"; Url = "http://localhost:8080/health" }
)

foreach ($svc in $services) {
    try {
        $resp = Invoke-RestMethod -Uri $svc.Url -TimeoutSec 5
        Write-Host "✅ $($svc.Name): OK" -ForegroundColor Green
    } catch {
        Write-Host "❌ $($svc.Name): Failed" -ForegroundColor Red
    }
}
```

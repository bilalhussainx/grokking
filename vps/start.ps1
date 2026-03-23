# Start the Local VPS Stack
# Run this from the vps/ directory

param(
    [switch]$Build,
    [switch]$Tunnel,
    [string]$TunnelProvider = "ngrok"
)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Grokking Voice Stack - Local Development" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Copy .env.example to .env and fill in your values." -ForegroundColor Yellow
    exit 1
}

# Load environment variables
Get-Content .env | ForEach-Object {
    $line = $_
    if ($line -match '^([^#][^=]*)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        # Remove surrounding quotes if present
        if ($value.StartsWith('"') -and $value.EndsWith('"')) {
            $value = $value.Substring(1, $value.Length - 2)
        } elseif ($value.StartsWith("'") -and $value.EndsWith("'")) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        [Environment]::SetEnvironmentVariable($name, $value)
    }
}

# Check Docker
$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
    Write-Host "ERROR: Docker not found!" -ForegroundColor Red
    Write-Host "Install Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Start services
Write-Host "Starting Docker services..." -ForegroundColor Green
Write-Host "(First run will build Kokoro image - this takes 5-10 minutes)" -ForegroundColor Yellow

if ($Build) {
    docker-compose up -d --build
} else {
    docker-compose up -d
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start Docker services!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Services starting..." -ForegroundColor Green
Write-Host ""

# Wait for services
Write-Host "Waiting for services to be healthy..." -ForegroundColor Yellow
$attempts = 0
$maxAttempts = 30

while ($attempts -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempts++
    
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:8080/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($health.healthy) {
            Write-Host ""
            Write-Host "============================================" -ForegroundColor Green
            Write-Host "All services are healthy!" -ForegroundColor Green
            Write-Host "============================================" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host -NoNewline "."
    }
}

if ($attempts -ge $maxAttempts) {
    Write-Host ""
    Write-Host "WARNING: Services may not be fully ready yet." -ForegroundColor Yellow
    Write-Host "Check logs with: docker-compose logs -f" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  Relay:   http://localhost:8080" -ForegroundColor White
Write-Host "  Whisper: http://localhost:8001" -ForegroundColor White
Write-Host "  Kokoro:  http://localhost:8002" -ForegroundColor White
Write-Host ""
Write-Host "LLM Brain:" -ForegroundColor Cyan
Write-Host "  Moonshot API (cloud)" -ForegroundColor White
Write-Host ""

# Start tunnel if requested
if ($Tunnel) {
    Write-Host "Starting tunnel..." -ForegroundColor Green
    powershell -ExecutionPolicy Bypass -File .\start-tunnel.ps1 -Provider $TunnelProvider
} else {
    Write-Host "To expose to internet, run:" -ForegroundColor Yellow
    Write-Host "  powershell -ExecutionPolicy Bypass -File .\start-tunnel.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "For local testing, set in your .env.local:" -ForegroundColor Cyan
    Write-Host "  VPS_HOST=localhost" -ForegroundColor White
    Write-Host "  VPS_PORT=8080" -ForegroundColor White
    Write-Host "  VPS_USE_SSL=false" -ForegroundColor White
}

Write-Host ""
Write-Host "Commands:" -ForegroundColor Cyan
Write-Host "  View logs:    docker-compose logs -f" -ForegroundColor White
Write-Host "  Stop:         docker-compose down" -ForegroundColor White
Write-Host "  Restart:      docker-compose restart" -ForegroundColor White
Write-Host ""

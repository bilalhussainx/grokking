# Start Cloudflare Tunnel or Ngrok for local VPS development
# This exposes your local Docker services to the internet

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("cloudflare", "ngrok")]
    [string]$Provider = "ngrok",
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 8080,
    
    [Parameter(Mandatory=$false)]
    [string]$CloudflareToken = $env:CLOUDFLARE_TUNNEL_TOKEN
)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Grokking Voice Relay Tunnel" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if ($Provider -eq "cloudflare") {
    if (-not $CloudflareToken) {
        Write-Host "ERROR: CLOUDFLARE_TUNNEL_TOKEN not set!" -ForegroundColor Red
        Write-Host "Get your token from: https://dash.teams.cloudflare.com/" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "Starting Cloudflare Tunnel..." -ForegroundColor Green
    Write-Host "Tunnel URL will be shown below..." -ForegroundColor Yellow
    
    # Run cloudflared
    docker run --rm --network host `
        cloudflare/cloudflared:latest `
        tunnel --no-autoupdate run --token $CloudflareToken
        
} else {
    # Check if ngrok is installed
    $ngrokPath = Get-Command ngrok -ErrorAction SilentlyContinue
    
    if (-not $ngrokPath) {
        Write-Host "ngrok not found. Installing via chocolatey..." -ForegroundColor Yellow
        choco install ngrok -y
    }
    
    # Check if ngrok is authed
    $ngrokConfig = "$env:USERPROFILE\.ngrok2\ngrok.yml"
    if (-not (Test-Path $ngrokConfig)) {
        Write-Host "ERROR: ngrok not authenticated!" -ForegroundColor Red
        Write-Host "Run: ngrok config add-authtoken YOUR_TOKEN" -ForegroundColor Yellow
        Write-Host "Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "Starting ngrok tunnel on port $Port..." -ForegroundColor Green
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "IMPORTANT: Copy the HTTPS forwarding URL below" -ForegroundColor Cyan
    Write-Host "and set it as VPS_HOST in your .env.local" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Start ngrok
    ngrok http $Port --host-header="localhost:$Port"
}

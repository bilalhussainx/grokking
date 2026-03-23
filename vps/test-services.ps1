# Test Voice Services
# Run this after starting the stack to verify everything is working

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Testing Voice Services" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{ Name = "Whisper (STT)"; Url = "http://localhost:8001/health"; Port = 8001 },
    @{ Name = "Kokoro (TTS)"; Url = "http://localhost:8002/health"; Port = 8002 },
    @{ Name = "Relay"; Url = "http://localhost:8080/health"; Port = 8080 }
)

$allHealthy = $true

foreach ($svc in $services) {
    Write-Host -NoNewline ("Testing " + $svc.Name + "... ")
    
    try {
        $resp = Invoke-RestMethod -Uri $svc.Url -TimeoutSec 5 -ErrorAction Stop
        
        if ($resp.healthy -or $resp.whisper -or $resp.kokoro) {
            Write-Host "OK" -ForegroundColor Green
        } else {
            Write-Host "Unhealthy" -ForegroundColor Yellow
            $allHealthy = $false
        }
    } catch {
        Write-Host ("Failed (" + $_.Exception.Message + ")") -ForegroundColor Red
        $allHealthy = $false
    }
}

Write-Host ""

if ($allHealthy) {
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "All services are healthy!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start tunnel:" -ForegroundColor White
    Write-Host "   powershell -ExecutionPolicy Bypass -File .\start-tunnel.ps1" -ForegroundColor Gray
    Write-Host "2. Copy the HTTPS URL" -ForegroundColor White
    Write-Host "3. Update .env.local: VPS_HOST=your-url.ngrok.io" -ForegroundColor White
    Write-Host "4. Start the Next.js app and test voice!" -ForegroundColor White
} else {
    Write-Host "============================================" -ForegroundColor Yellow
    Write-Host "Some services are not ready yet" -ForegroundColor Yellow
    Write-Host "============================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Check logs: docker-compose logs -f" -ForegroundColor White
}

Write-Host ""

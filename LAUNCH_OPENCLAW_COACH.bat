@echo off
echo ============================================
echo  GROKKING + OPENCLAW VOICE COACH LAUNCHER
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Checking OpenClaw status...
openclaw status
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: OpenClaw Gateway is not running!
    echo Starting OpenClaw Gateway...
    start /B openclaw gateway start
    timeout /t 3 /nobreak >nul
)

echo.
echo [2/4] Installing MCP Bridge dependencies...
cd mcp-bridge
if not exist node_modules (
    call npm install
)

echo.
echo [3/4] Starting MCP Bridge Server (Port 3001)...
start "MCP Bridge Server" cmd /k "npm start"

echo.
echo [4/4] Starting Grokking Website (Port 3000)...
cd ..
start "Grokking Website" cmd /k "npm run dev"

echo.
echo ============================================
echo  ALL SERVICES STARTED!
echo ============================================
echo.
echo  1. MCP Bridge:  http://localhost:3001/health
echo  2. Grokking:    http://localhost:3000
echo  3. Test Page:   http://localhost:3000/test-openclaw
echo.
echo  OpenClaw Status: openclaw status
echo  Stop Services:   Close the two CMD windows
echo.
echo ============================================
echo.
echo Opening test page in 5 seconds...
timeout /t 5 /nobreak >nul

start http://localhost:3000/test-openclaw

echo.
echo Press any key to close this window...
pause >nul

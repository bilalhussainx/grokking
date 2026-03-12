#!/bin/bash

echo "============================================"
echo " GROKKING + OPENCLAW VOICE COACH LAUNCHER"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "[1/4] Checking OpenClaw status..."
openclaw status
if [ $? -ne 0 ]; then
    echo ""
    echo "WARNING: OpenClaw Gateway is not running!"
    echo "Starting OpenClaw Gateway..."
    openclaw gateway start
    sleep 3
fi

echo ""
echo "[2/4] Installing MCP Bridge dependencies..."
cd mcp-bridge
if [ ! -d "node_modules" ]; then
    npm install
fi

echo ""
echo "[3/4] Starting MCP Bridge Server (Port 3001)..."
gnome-terminal -- bash -c "npm start; exec bash" &

echo ""
echo "[4/4] Starting Grokking Website (Port 3000)..."
cd ..
gnome-terminal -- bash -c "npm run dev; exec bash" &

echo ""
echo "============================================"
echo " ALL SERVICES STARTED!"
echo "============================================"
echo ""
echo "  1. MCP Bridge:  http://localhost:3001/health"
echo "  2. Grokking:    http://localhost:3000"
echo "  3. Test Page:   http://localhost:3000/test-openclaw"
echo ""
echo "  OpenClaw Status: openclaw status"
echo "  Stop Services:   Close the terminal windows"
echo ""
echo "============================================"
echo ""
echo "Opening test page in 5 seconds..."
sleep 5

xdg-open http://localhost:3000/test-openclaw

echo ""
echo "Launcher finished. Check the terminal windows for logs."

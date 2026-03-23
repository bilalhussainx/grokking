#!/bin/bash
# Quick deployment script for Samsara pitch deck

echo "🚀 Deploying Samsara Pitch Deck"
echo ""
echo "Choose deployment method:"
echo "1. Vercel CLI (requires login)"
echo "2. Show file location for manual upload"
echo "3. Start local preview server"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo "Deploying to Vercel..."
    cd /home/bilalhussain/pitch-deck-deploy
    vercel --prod
    ;;
  2)
    echo ""
    echo "📁 Files ready for manual upload:"
    echo "Location: /home/bilalhussain/pitch-deck-deploy/"
    echo ""
    echo "Upload to one of these:"
    echo "- Vercel: https://vercel.com/new"
    echo "- Netlify Drop: https://app.netlify.com/drop"
    echo "- GitHub Pages: Create repo + enable Pages"
    echo ""
    echo "Drag the entire folder or just index.html"
    ;;
  3)
    echo "Starting preview server on port 8080..."
    cd /home/bilalhussain/pitch-deck-deploy
    python3 -m http.server 8080
    echo ""
    echo "View at: http://localhost:8080"
    echo "Press Ctrl+C to stop"
    ;;
  *)
    echo "Invalid choice"
    ;;
esac

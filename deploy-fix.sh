#!/bin/bash
# Quick deployment script for Deepgram fix
# Run this from: C:\Users\bilal\Downloads\grokking

set -e  # Exit on error

echo "🔧 Deploying Deepgram Voice Agent Fix..."
echo ""

# Backup current version
echo "📦 Creating backup..."
cp src/app/api/ai/voice-session/route.ts src/app/api/ai/voice-session/route.BACKUP.ts
echo "✅ Backup saved to route.BACKUP.ts"
echo ""

# Apply fix
echo "🚀 Applying fix..."
cp src/app/api/ai/voice-session/route.FIXED.ts src/app/api/ai/voice-session/route.ts
echo "✅ Fix applied!"
echo ""

# Git commit and push
echo "📤 Deploying to Vercel..."
git add .
git commit -m "🔧 Fix Deepgram voice agent errors

- Changed agent.think.prompt to agent.think.instructions (correct API format)
- Added proactive behavior instructions
- Improved lesson context loading with explicit references
- Enhanced greeting to immediately engage with lesson content  
- Increased temperature to 0.6 for more natural responses

Fixes:
- WebSocket 1005 errors
- 'Error parsing client message' errors  
- Agents not loading lesson context
- Poor proactive behavior"

git push origin main

echo ""
echo "✅ DEPLOYED!"
echo ""
echo "🧪 Next steps:"
echo "1. Wait 30-60 seconds for Vercel to deploy"
echo "2. Open https://grokking-delta.vercel.app/"
echo "3. Test voice agent on any lesson"
echo "4. Check browser console for errors"
echo ""
echo "📊 Monitor deployment:"
echo "https://vercel.com/bilals-projects/grokking-delta/deployments"
echo ""
echo "⏪ To rollback if needed:"
echo "cp src/app/api/ai/voice-session/route.BACKUP.ts src/app/api/ai/voice-session/route.ts"
echo "git add . && git commit -m 'Rollback voice agent' && git push"

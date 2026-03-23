@echo off
echo Deploying Enhanced Pitch Deck with Leonardo Visuals...
cd /d C:\Users\bilal\Downloads\grokking
git add .
git commit -m "Enhanced pitch deck with 10 Leonardo.ai custom visuals"
git push
echo.
echo Done! Check https://grokking-delta.vercel.app/pitch.html in 30 seconds
pause

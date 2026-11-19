@echo off
title AI Supervisor - Bijli Wala Aya
echo ========================================================
echo   AI Supervisor - Single-Page Voice & Camera UI
echo   Startup Buildathon India 2026 (Delhi)
echo   Team: Bijli Wala Aya
echo ========================================================
echo.
echo Server starting at http://localhost:3000 ...
echo Browser opening in 2 seconds...
timeout /t 2 /nobreak >nul
start http://localhost:3000
python -m http.server 3000
pause

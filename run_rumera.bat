@echo off
title Maison Rumera Luxury Atra - Launch Suite
echo ========================================================
echo        MAISON RUMERA LUXURY ATRA - STARTING SERVERS
echo ========================================================
echo.

echo [1/3] Starting Django Backend Server on http://127.0.0.1:8001 ...
start "Rumera Backend (Django)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && python manage.py runserver 127.0.0.1:8001"

echo [2/3] Starting React Frontend Server on http://127.0.0.1:5173 ...
start "Rumera Frontend (React)" cmd /k "cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5173"

echo [3/3] Waiting 3 seconds for boot...
timeout /t 3 >nul

echo Launching browser...
start http://127.0.0.1:5173

echo.
echo ========================================================
echo  All servers are live!
echo  Website: http://127.0.0.1:5173
echo  Backend: http://127.0.0.1:8001
echo ========================================================

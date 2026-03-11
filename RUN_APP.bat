@echo off
echo ============================================================
echo AgriSense AI - Quick Start (Without Training)
echo ============================================================
echo.
echo This will start the ML API and Frontend servers.
echo The system will use mock predictions (no model training needed).
echo.
echo Installing dependencies...
echo.

REM Install backend dependencies
cd backend
pip install fastapi uvicorn pillow numpy python-multipart -q
echo ✓ Backend dependencies installed
echo.

REM Install frontend dependencies (if needed)
cd ..\frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
echo ✓ Frontend ready
echo.

cd ..

echo ============================================================
echo Starting Services...
echo ============================================================
echo.
echo Opening 2 windows:
echo   1. ML API Server (http://localhost:8000)
echo   2. Frontend (http://localhost:5173)
echo.
pause

REM Start ML API
start "ML API - AgriSense" cmd /k "cd /d %cd%\backend && python disease_api.py"

REM Wait for API to start
timeout /t 3 /nobreak >nul

REM Start Frontend
start "Frontend - AgriSense" cmd /k "cd /d %cd%\frontend && npm run dev"

echo.
echo ============================================================
echo ✓ SERVICES STARTED!
echo ============================================================
echo.
echo Wait 10 seconds, then open: http://localhost:5173
echo.
echo To stop: Close both command windows
echo.
pause

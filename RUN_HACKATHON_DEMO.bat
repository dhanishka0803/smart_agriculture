@echo off
echo ============================================================
echo AgriSense AI - HACKATHON DEMO MODE
echo ============================================================
echo.
echo Starting all services...
echo.

REM Install required packages
echo Installing dependencies...
cd backend
pip install fastapi uvicorn pillow numpy opencv-python python-multipart -q
cd ..

echo.
echo ============================================================
echo Starting 3 Services:
echo   1. Main Backend (Port 5000)
echo   2. Disease Detection API (Port 8000)
echo   3. Frontend (Port 5173)
echo ============================================================
echo.
pause

REM Start Main Backend
start "Main Backend - Port 5000" cmd /k "cd /d %cd%\backend && python app.py"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start Disease Detection API
start "Disease Detection - Port 8000" cmd /k "cd /d %cd%\backend && python disease_detection_enhanced.py"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start Frontend
start "Frontend - Port 5173" cmd /k "cd /d %cd%\frontend && npm run dev"

echo.
echo ============================================================
echo ✓ ALL SERVICES STARTED!
echo ============================================================
echo.
echo Wait 10 seconds, then open: http://localhost:5173
echo.
echo Services running:
echo   - Main Backend: http://localhost:5000
echo   - Disease API: http://localhost:8000
echo   - Frontend: http://localhost:5173
echo.
echo To stop: Close all 3 command windows
echo.
pause

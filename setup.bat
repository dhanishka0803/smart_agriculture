@echo off
echo ========================================
echo   AgriSense AI - Setup Script
echo   Climate-Smart Farming Assistant
echo ========================================
echo.

echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo Python found!
echo.

echo [2/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
echo.

echo [3/5] Setting up Backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
echo Activating virtual environment...
call venv\Scripts\activate
echo Installing Python dependencies...
pip install -r requirements.txt
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend\.env and add your OpenWeatherMap API key!
    echo Get your free API key from: https://openweathermap.org/api
    echo.
)
cd ..
echo Backend setup complete!
echo.

echo [4/5] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing Node.js dependencies...
    call npm install
) else (
    echo Node modules already installed, skipping...
)
cd ..
echo Frontend setup complete!
echo.

echo [5/5] Training ML Model...
cd ml_model
if not exist crop_model.pkl (
    echo Training crop recommendation model...
    python train_model.py
) else (
    echo Model already exists, skipping training...
)
cd ..
echo ML Model ready!
echo.

echo ========================================
echo   Setup Complete! 
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env and add your OpenWeatherMap API key
echo 2. Open TWO terminal windows:
echo.
echo    Terminal 1 - Backend:
echo    cd backend
echo    venv\Scripts\activate
echo    python app.py
echo.
echo    Terminal 2 - Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open browser: http://localhost:3000
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause

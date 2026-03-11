@echo off
echo ============================================================
echo AgriSense AI - Complete ML Setup Script
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8-3.11 from https://www.python.org/
    pause
    exit /b 1
)

echo Step 1: Installing ML dependencies...
echo ============================================================
cd backend
pip install -r requirements_ml.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.
echo ✓ Dependencies installed successfully!
echo.

echo Step 2: Dataset Setup
echo ============================================================
echo.
echo OPTION 1: Automatic Download (Requires Kaggle Account)
echo OPTION 2: Manual Download (Recommended if you have slow internet)
echo.
choice /C 12 /M "Choose option"

if errorlevel 2 goto manual_download
if errorlevel 1 goto auto_download

:auto_download
echo.
echo Starting automatic download...
cd ml_model
python download_dataset.py
if errorlevel 1 (
    echo.
    echo Automatic download failed. Switching to manual instructions...
    goto manual_download
)
goto check_dataset

:manual_download
echo.
echo ============================================================
echo MANUAL DOWNLOAD INSTRUCTIONS
echo ============================================================
echo.
echo 1. Open your browser and go to:
echo    https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
echo.
echo 2. Click the "Download" button (you may need to create a Kaggle account)
echo.
echo 3. After download completes, extract the ZIP file
echo.
echo 4. Copy the "PlantVillage" folder to:
echo    %cd%\ml_model\dataset\
echo.
echo 5. The structure should be:
echo    ml_model\dataset\PlantVillage\train\
echo    ml_model\dataset\PlantVillage\val\
echo.
pause
echo.

:check_dataset
echo Checking if dataset exists...
if not exist "ml_model\dataset\PlantVillage\train" (
    echo.
    echo ERROR: Dataset not found!
    echo Please complete the manual download steps above.
    pause
    exit /b 1
)
echo ✓ Dataset found!
echo.

echo Step 3: Training the Model
echo ============================================================
echo.
echo This will take 30-60 minutes depending on your computer.
echo.
echo Do you want to train the model now?
choice /C YN /M "Train model"

if errorlevel 2 goto skip_training
if errorlevel 1 goto train_model

:train_model
echo.
echo Starting model training...
echo This may take a while. Please be patient...
echo.
cd ml_model
python train_disease_model.py
if errorlevel 1 (
    echo.
    echo ERROR: Training failed!
    pause
    exit /b 1
)
cd ..
echo.
echo ✓ Model trained successfully!
echo.
goto start_services

:skip_training
echo.
echo Skipping training. The system will use mock predictions.
echo.

:start_services
echo ============================================================
echo Setup Complete! Starting Services...
echo ============================================================
echo.
echo Opening 2 command windows:
echo   1. ML API Server (port 8000)
echo   2. Frontend Server (port 5173)
echo.
pause

REM Start ML API in new window
start "AgriSense ML API" cmd /k "cd /d %cd% && python disease_api.py"

REM Wait a bit for API to start
timeout /t 5 /nobreak >nul

REM Start Frontend in new window
start "AgriSense Frontend" cmd /k "cd /d %cd%\..\frontend && npm run dev"

echo.
echo ============================================================
echo ✓ ALL SERVICES STARTED!
echo ============================================================
echo.
echo ML API running at: http://localhost:8000
echo Frontend running at: http://localhost:5173
echo.
echo Open your browser and go to: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul

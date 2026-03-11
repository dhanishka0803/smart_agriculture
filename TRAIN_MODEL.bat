@echo off
echo ============================================================
echo AgriSense AI - Model Training for Hackathon
echo ============================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python 3.8-3.11 from https://www.python.org/
    pause
    exit /b 1
)

echo ✓ Python found
echo.

REM Check dataset
if not exist "backend\ml_model\dataset\PlantVillage\train" (
    echo ============================================================
    echo ERROR: Dataset not found!
    echo ============================================================
    echo.
    echo Please download and set up the dataset first:
    echo.
    echo 1. Download from: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
    echo 2. Extract the ZIP file
    echo 3. Run: setup_dataset.bat
    echo.
    echo OR manually copy "PlantVillage" folder to:
    echo    backend\ml_model\dataset\
    echo.
    pause
    exit /b 1
)

echo ✓ Dataset found
echo.

echo Installing required packages...
echo ============================================================
cd backend
pip install tensorflow==2.15.0 pillow numpy -q
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install packages
    echo.
    echo Try installing manually:
    echo    pip install tensorflow pillow numpy
    echo.
    pause
    exit /b 1
)

echo ✓ Packages installed
echo.

echo ============================================================
echo Starting Model Training
echo ============================================================
echo.
echo This will take 30-60 minutes.
echo.
echo What you'll see:
echo   - Loading dataset...
echo   - Building model...
echo   - Training progress (Epoch 1/20, 2/20, etc.)
echo   - Final accuracy scores
echo.
echo ⚠️ DO NOT CLOSE THIS WINDOW!
echo.
echo Press any key to start training...
pause >nul
echo.

cd ml_model
python train_disease_model.py

if errorlevel 1 (
    echo.
    echo ============================================================
    echo ERROR: Training failed!
    echo ============================================================
    echo.
    echo Common issues:
    echo   1. Not enough RAM (need 8GB+)
    echo   2. Dataset structure incorrect
    echo   3. TensorFlow installation issue
    echo.
    echo Check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo ✓ TRAINING COMPLETE!
echo ============================================================
echo.
echo Model files saved:
echo   - plant_disease_model/ (main model)
echo   - plant_disease_model.h5 (backup)
echo   - class_indices.json (disease names)
echo.
echo You can now run the app with real ML predictions!
echo.
echo Next steps:
echo   1. Double-click: RUN_APP.bat
echo   2. Open browser: http://localhost:5173
echo   3. Test disease detection!
echo.
pause

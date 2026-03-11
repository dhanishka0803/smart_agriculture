@echo off
echo ============================================================
echo Dataset Setup Helper
echo ============================================================
echo.
echo This script will help you set up the dataset in the correct location.
echo.
echo INSTRUCTIONS:
echo 1. Download dataset from Kaggle (if not done already)
echo 2. Extract the ZIP file
echo 3. Note the location of the extracted folder
echo.
pause
echo.

set "TARGET_DIR=%~dp0backend\ml_model\dataset"

echo Creating dataset directory...
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
echo ✓ Directory created: %TARGET_DIR%
echo.

echo ============================================================
echo MANUAL COPY INSTRUCTIONS
echo ============================================================
echo.
echo 1. Open File Explorer (Windows + E)
echo.
echo 2. Navigate to where you extracted the dataset
echo    (Usually in Downloads folder)
echo.
echo 3. Find the "PlantVillage" folder
echo    (It should contain "train" and "val" folders inside)
echo.
echo 4. Copy the entire "PlantVillage" folder
echo.
echo 5. Paste it here:
echo    %TARGET_DIR%
echo.
echo 6. Final structure should be:
echo    %TARGET_DIR%\PlantVillage\train\
echo    %TARGET_DIR%\PlantVillage\val\
echo.
echo ============================================================
echo.
echo Press any key when you've copied the folder...
pause >nul

echo.
echo Checking if dataset is in the correct location...
if exist "%TARGET_DIR%\PlantVillage\train" (
    echo ✓ Dataset found!
    echo ✓ Training folder exists
    
    if exist "%TARGET_DIR%\PlantVillage\val" (
        echo ✓ Validation folder exists
        echo.
        echo ============================================================
        echo ✓ DATASET SETUP COMPLETE!
        echo ============================================================
        echo.
        echo You can now train the model.
        echo Press any key to continue...
        pause >nul
    ) else (
        echo ✗ Validation folder not found
        echo Please check the folder structure
        pause
        exit /b 1
    )
) else (
    echo ✗ Dataset not found in the correct location
    echo.
    echo Please make sure you copied the "PlantVillage" folder to:
    echo %TARGET_DIR%
    echo.
    pause
    exit /b 1
)

"""
Automated PlantVillage Dataset Downloader
This script downloads and extracts the dataset automatically
"""

import os
import sys
import subprocess
import zipfile
from pathlib import Path

def check_kaggle_setup():
    """Check if Kaggle API is set up"""
    kaggle_json = Path.home() / '.kaggle' / 'kaggle.json'
    return kaggle_json.exists()

def setup_kaggle_api():
    """Guide user to set up Kaggle API"""
    print("\n" + "="*60)
    print("KAGGLE API SETUP REQUIRED")
    print("="*60)
    print("\nTo download the dataset, you need a Kaggle account and API key.")
    print("\nFollow these steps:")
    print("\n1. Create a Kaggle account (if you don't have one):")
    print("   https://www.kaggle.com/account/login")
    print("\n2. Go to your Kaggle account settings:")
    print("   https://www.kaggle.com/settings")
    print("\n3. Scroll down to 'API' section")
    print("\n4. Click 'Create New API Token'")
    print("   This will download 'kaggle.json' file")
    print("\n5. Move kaggle.json to:")
    
    kaggle_dir = Path.home() / '.kaggle'
    print(f"   {kaggle_dir}")
    
    print("\n" + "="*60)
    
    response = input("\nHave you completed these steps? (yes/no): ").lower()
    
    if response == 'yes':
        if check_kaggle_setup():
            print("✅ Kaggle API configured successfully!")
            return True
        else:
            print("❌ kaggle.json not found. Please complete the setup.")
            return False
    else:
        print("\nPlease complete the Kaggle API setup first.")
        return False

def install_kaggle():
    """Install Kaggle package"""
    print("\n📦 Installing Kaggle package...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "kaggle", "-q"])
        print("✅ Kaggle package installed!")
        return True
    except Exception as e:
        print(f"❌ Error installing Kaggle: {e}")
        return False

def download_dataset():
    """Download PlantVillage dataset from Kaggle"""
    print("\n📥 Downloading PlantVillage dataset...")
    print("This may take 10-15 minutes depending on your internet speed...")
    
    try:
        # Create dataset directory
        dataset_dir = Path("dataset")
        dataset_dir.mkdir(exist_ok=True)
        
        # Download using Kaggle API
        os.chdir(dataset_dir)
        subprocess.check_call([
            "kaggle", "datasets", "download", 
            "-d", "abdallahalidev/plantvillage-dataset"
        ])
        
        print("✅ Dataset downloaded!")
        return True
        
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        return False

def extract_dataset():
    """Extract the downloaded ZIP file"""
    print("\n📂 Extracting dataset...")
    
    try:
        zip_file = Path("dataset/plantvillage-dataset.zip")
        
        if not zip_file.exists():
            print("❌ ZIP file not found!")
            return False
        
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            zip_ref.extractall("dataset")
        
        print("✅ Dataset extracted!")
        
        # Check structure
        plantvillage_dir = Path("dataset/PlantVillage")
        if plantvillage_dir.exists():
            train_dir = plantvillage_dir / "train"
            val_dir = plantvillage_dir / "val"
            
            if train_dir.exists() and val_dir.exists():
                train_classes = len(list(train_dir.iterdir()))
                val_classes = len(list(val_dir.iterdir()))
                
                print(f"\n✅ Dataset structure verified:")
                print(f"   Training classes: {train_classes}")
                print(f"   Validation classes: {val_classes}")
                return True
        
        print("⚠️ Dataset structure may be different than expected")
        return True
        
    except Exception as e:
        print(f"❌ Error extracting dataset: {e}")
        return False

def main():
    print("\n" + "="*60)
    print("AgriSense AI - PlantVillage Dataset Downloader")
    print("="*60)
    
    # Check if dataset already exists
    if Path("dataset/PlantVillage").exists():
        print("\n✅ Dataset already exists!")
        response = input("Do you want to re-download? (yes/no): ").lower()
        if response != 'yes':
            print("Using existing dataset.")
            return
    
    # Install Kaggle package
    if not install_kaggle():
        return
    
    # Setup Kaggle API
    if not check_kaggle_setup():
        if not setup_kaggle_api():
            print("\n❌ Setup cancelled. Please set up Kaggle API and try again.")
            return
    
    # Download dataset
    if not download_dataset():
        print("\n❌ Download failed. Please try manual download:")
        print("   1. Go to: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset")
        print("   2. Click 'Download'")
        print("   3. Extract to: backend/ml_model/dataset/PlantVillage/")
        return
    
    # Extract dataset
    if not extract_dataset():
        return
    
    print("\n" + "="*60)
    print("✅ DATASET SETUP COMPLETE!")
    print("="*60)
    print("\nYou can now train the model:")
    print("   python train_disease_model.py")
    print("="*60)

if __name__ == "__main__":
    main()

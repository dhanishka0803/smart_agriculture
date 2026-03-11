# 🚀 Deploy Real ML Model to Render - Complete Guide

## 📋 Overview

You need to:
1. Train model locally
2. Upload model files to cloud storage (Google Drive/Dropbox)
3. Update backend to download model on startup
4. Deploy to Render

---

## Step 1: Train Model Locally (30-60 min)

### 1.1 Download Dataset
```
https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
```

### 1.2 Setup Dataset
```bash
Double-click: setup_dataset.bat
```

### 1.3 Train Model
```bash
Double-click: TRAIN_MODEL.bat
```

Wait for training to complete. You'll get these files:
- `backend/ml_model/plant_disease_model/` (folder)
- `backend/ml_model/plant_disease_model.h5` (file)
- `backend/ml_model/class_indices.json` (file)

---

## Step 2: Upload Model to Google Drive

### 2.1 Compress Model Files

Create a ZIP file containing:
- `plant_disease_model/` folder
- `plant_disease_model.h5` file
- `class_indices.json` file

### 2.2 Upload to Google Drive

1. Go to: https://drive.google.com
2. Upload the ZIP file
3. Right-click → Share → Get link
4. Set to "Anyone with the link can view"
5. Copy the link

### 2.3 Get Direct Download Link

Your link looks like:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

Convert to direct download:
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

Save this link - you'll need it!

---

## Step 3: Update Backend to Download Model

I'll create a script that downloads the model on Render startup...

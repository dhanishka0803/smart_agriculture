# 🌿 Real ML Disease Detection - Complete Setup Guide

## 🎯 What You're Building

A **REAL** machine learning-powered plant disease detection system that:
- ✅ Trains on 54,000+ real plant images
- ✅ Detects 38 different plant diseases
- ✅ Validates if image contains a plant
- ✅ Shows confidence scores and severity levels
- ✅ Provides treatment and prevention tips
- ✅ Predicts in under 2 seconds

---

## 📋 Prerequisites

### System Requirements
- Python 3.8 - 3.11 (TensorFlow compatibility)
- 8GB+ RAM (16GB recommended for training)
- 10GB free disk space
- GPU (optional, but speeds up training 10x)

### Software
- Node.js 18+
- Python 3.8-3.11
- pip

---

## 🚀 Step-by-Step Setup

### Step 1: Download PlantVillage Dataset (15 minutes)

**Option A: Kaggle (Recommended)**

1. Create Kaggle account: https://www.kaggle.com
2. Go to: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
3. Click "Download" (requires Kaggle account)
4. Extract the ZIP file

**Option B: Direct Download**
```bash
# Using Kaggle API (faster)
pip install kaggle

# Setup Kaggle credentials
# 1. Go to https://www.kaggle.com/settings
# 2. Click "Create New API Token"
# 3. Save kaggle.json to ~/.kaggle/

# Download dataset
kaggle datasets download -d abdallahalidev/plantvillage-dataset
unzip plantvillage-dataset.zip -d backend/ml_model/dataset/
```

**Dataset Structure:**
```
backend/ml_model/dataset/PlantVillage/
├── train/
│   ├── Potato___Early_blight/
│   ├── Potato___Late_blight/
│   ├── Potato___healthy/
│   ├── Tomato___Early_blight/
│   └── ... (38 classes total)
└── val/
    ├── Potato___Early_blight/
    └── ... (same 38 classes)
```

---

### Step 2: Install ML Dependencies (5 minutes)

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install ML requirements
pip install -r requirements_ml.txt
```

**If you have GPU (NVIDIA):**
```bash
# Install GPU version for 10x faster training
pip install tensorflow-gpu==2.15.0
```

---

### Step 3: Train the Model (30-60 minutes)

```bash
cd backend/ml_model

# Start training
python train_disease_model.py
```

**What happens during training:**
1. Loads 54,305 images from PlantVillage dataset
2. Applies data augmentation (rotation, zoom, flip)
3. Uses MobileNetV2 (pre-trained on ImageNet)
4. Trains for 20 epochs with early stopping
5. Saves best model automatically

**Expected Output:**
```
==================================================
AgriSense AI - Disease Detection Model Training
==================================================

📊 Loading dataset...
✅ Dataset loaded:
   Training samples: 43,456
   Validation samples: 10,849
   Number of classes: 38

🏗️ Building model...
Model: "sequential"
...

🚀 Starting training...
Epoch 1/20
1358/1358 [==============================] - 245s 180ms/step
...

💾 Saving model...
✅ Model saved successfully!

==================================================
TRAINING COMPLETE!
==================================================
Final Training Accuracy: 98.45%
Final Validation Accuracy: 96.23%
==================================================
```

**Training Time:**
- CPU: 45-60 minutes
- GPU: 10-15 minutes

**Output Files:**
- `plant_disease_model/` - TensorFlow SavedModel format
- `plant_disease_model.h5` - H5 format (backup)
- `class_indices.json` - Disease class names

---

### Step 4: Start ML API Server (1 minute)

```bash
cd backend

# Start FastAPI server
python disease_api.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
✅ Model loaded from SavedModel format
✅ Loaded 38 disease classes
✅ Loaded disease information for 10 diseases
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Test the API:**
```bash
# Open browser
http://localhost:8000

# Should see:
{
  "status": "healthy",
  "service": "AgriSense AI - Disease Detection API",
  "model_loaded": true,
  "version": "2.0"
}
```

---

### Step 5: Start Frontend (1 minute)

Open a **NEW** terminal:

```bash
cd frontend

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

**Open browser:**
```
http://localhost:5173
```

---

## 🧪 Testing the System

### Test 1: Valid Plant Image

1. Navigate to "Disease Detection" page
2. Upload a plant leaf image
3. Click "Analyze Disease"
4. Should see:
   - Disease name
   - Confidence percentage
   - Severity level (High/Medium/Low)
   - Symptoms
   - Treatment steps
   - Prevention tips

### Test 2: Non-Plant Image

1. Upload a photo of a person, building, or random object
2. Click "Analyze Disease"
3. Should see error:
   > "This image does not appear to be a crop or plant leaf. Please upload a clear image of a plant leaf."

### Test 3: Low Quality Image

1. Upload a blurry or dark plant image
2. Click "Analyze Disease"
3. If confidence < 50%, should see:
   > "Unable to identify disease with high confidence. Please upload a clearer crop image."

---

## 📊 Model Performance

### Accuracy Metrics
- **Training Accuracy:** 98%+
- **Validation Accuracy:** 96%+
- **Inference Time:** < 2 seconds
- **Model Size:** ~15MB

### Supported Diseases (38 Classes)

**Potato (3):**
- Early Blight
- Late Blight
- Healthy

**Tomato (10):**
- Bacterial Spot
- Early Blight
- Late Blight
- Leaf Mold
- Septoria Leaf Spot
- Spider Mites
- Target Spot
- Yellow Leaf Curl Virus
- Mosaic Virus
- Healthy

**Corn (4):**
- Cercospora Leaf Spot
- Common Rust
- Northern Leaf Blight
- Healthy

**And 21 more classes** for Apple, Grape, Cherry, Peach, Pepper, etc.

---

## 🎨 UI Features

### Image Upload
- Drag & drop support
- File size validation (max 10MB)
- Image preview
- Reset button

### Analysis Display
- Real-time loading animation
- Confidence progress bar
- Color-coded severity:
  - 🔴 High Risk (Red)
  - 🟡 Medium Risk (Yellow)
  - 🟢 Low Risk (Green)

### Results
- Disease name and crop type
- Confidence percentage
- Detailed symptoms list
- Step-by-step treatment
- Prevention tips
- Save report button

---

## 🔧 Troubleshooting

### Model Not Loading

**Error:** `Model not found`

**Solution:**
```bash
# Check if model files exist
ls backend/ml_model/plant_disease_model/

# If missing, retrain:
cd backend/ml_model
python train_disease_model.py
```

### TensorFlow Installation Issues

**Error:** `Could not find a version that satisfies tensorflow`

**Solution:**
```bash
# Use Python 3.8-3.11 (not 3.12+)
python --version

# Install specific version
pip install tensorflow==2.15.0 --no-cache-dir
```

### Out of Memory During Training

**Error:** `ResourceExhaustedError: OOM`

**Solution:**
```python
# Edit train_disease_model.py
# Reduce batch size:
BATCH_SIZE = 16  # Instead of 32
```

### API Connection Error

**Error:** `Unable to connect to disease detection service`

**Solution:**
```bash
# Make sure ML API is running
cd backend
python disease_api.py

# Check if running:
curl http://localhost:8000
```

### CORS Error

**Error:** `Access-Control-Allow-Origin`

**Solution:**
```python
# In disease_api.py, add your frontend URL:
allow_origins=[
    "http://localhost:5173",  # Your frontend URL
    ...
]
```

---

## 🚀 Deployment

### Deploy ML API to Render

1. Create `Procfile`:
```
web: cd backend && uvicorn disease_api:app --host 0.0.0.0 --port $PORT
```

2. Update `requirements.txt`:
```bash
# Merge requirements_ml.txt into requirements.txt
cat requirements_ml.txt >> requirements.txt
```

3. Deploy to Render:
   - Upload model files to cloud storage (AWS S3, Google Cloud)
   - Update model loading path in `disease_api.py`
   - Set environment variables

### Update Frontend API URL

```javascript
// In DiseaseDetection.jsx
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-ml-api.onrender.com'
  : 'http://localhost:8000';

const response = await fetch(`${API_URL}/predict-disease`, {
  method: 'POST',
  body: formData
});
```

---

## 📈 Performance Optimization

### Speed Up Predictions

1. **Use TensorFlow Lite:**
```python
# Convert model to TFLite
converter = tf.lite.TFLiteConverter.from_saved_model('plant_disease_model')
tflite_model = converter.convert()
```

2. **Enable GPU:**
```python
# In disease_api.py
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    tf.config.experimental.set_memory_growth(gpus[0], True)
```

3. **Batch Predictions:**
```python
# Process multiple images at once
predictions = model.predict(batch_images)
```

---

## 🎯 Success Criteria

✅ **Model Training:**
- Training accuracy > 95%
- Validation accuracy > 93%
- Training completes without errors

✅ **API:**
- Health check returns 200
- Model loaded successfully
- Predictions return in < 2 seconds

✅ **Frontend:**
- Image upload works
- Loading animation shows
- Results display correctly
- Error messages show for invalid images

✅ **Validation:**
- Non-plant images rejected
- Low confidence images flagged
- Severity levels calculated correctly

---

## 📚 Additional Resources

### Datasets
- PlantVillage: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset
- Plant Pathology: https://www.kaggle.com/c/plant-pathology-2020-fgvc7

### Documentation
- TensorFlow: https://www.tensorflow.org/tutorials
- FastAPI: https://fastapi.tiangolo.com
- MobileNetV2: https://arxiv.org/abs/1801.04381

### Improvements
- Add more disease classes
- Implement ensemble models
- Add explainability (Grad-CAM)
- Support multiple languages
- Add disease progression tracking

---

## 🏆 Final Checklist

- [ ] Dataset downloaded (54,305 images)
- [ ] ML dependencies installed
- [ ] Model trained successfully (96%+ accuracy)
- [ ] Model files saved
- [ ] ML API running on port 8000
- [ ] Frontend running on port 5173
- [ ] Test with plant image - works
- [ ] Test with non-plant image - rejected
- [ ] Test with blurry image - low confidence warning
- [ ] Confidence bar displays correctly
- [ ] Severity colors show correctly
- [ ] Treatment and prevention display

---

**🎉 Congratulations! You now have a REAL ML-powered disease detection system!**

**Made with ❤️ for AgriSense AI Hackathon**

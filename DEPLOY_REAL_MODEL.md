# 🚀 DEPLOY REAL ML MODEL - Step by Step

## ✅ What You Need to Do

### Step 1: Train Model Locally (DO THIS FIRST)

```bash
# Download dataset from Kaggle
https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset

# Setup dataset
Double-click: setup_dataset.bat

# Train model (30-60 minutes)
Double-click: TRAIN_MODEL.bat
```

**Wait for training to complete!**

---

### Step 2: Upload Model Files to Google Drive

After training, you'll have these files:
- `backend/ml_model/plant_disease_model.h5`
- `backend/ml_model/class_indices.json`
- `backend/ml_model/disease_info.json`

**Upload Steps:**

1. **Create a ZIP file:**
   - Select these 3 files
   - Right-click → Send to → Compressed (zipped) folder
   - Name it: `ml_model_files.zip`

2. **Upload to Google Drive:**
   - Go to: https://drive.google.com
   - Click "New" → "File upload"
   - Upload `ml_model_files.zip`

3. **Get shareable link:**
   - Right-click the uploaded file
   - Click "Share"
   - Change to "Anyone with the link"
   - Click "Copy link"

4. **Convert to direct download link:**
   
   Your link looks like:
   ```
   https://drive.google.com/file/d/1ABC123XYZ/view?usp=sharing
   ```
   
   Change it to:
   ```
   https://drive.google.com/uc?export=download&id=1ABC123XYZ
   ```
   
   **Save this link!**

---

### Step 3: Update Render Environment Variables

1. **Go to Render Dashboard:**
   ```
   https://dashboard.render.com
   ```

2. **Select your backend service:**
   - Click on "smart-agriculture-4pz4"

3. **Go to Environment:**
   - Click "Environment" in left sidebar

4. **Add new variable:**
   - Click "Add Environment Variable"
   - Key: `MODEL_DOWNLOAD_URL`
   - Value: (paste your Google Drive direct download link)
   - Click "Save Changes"

5. **Render will automatically redeploy** (takes 5-10 minutes)

---

### Step 4: Update Backend Requirements

The backend needs TensorFlow. Update requirements:

```bash
cd backend
```

Edit `requirements.txt` and add:
```
tensorflow==2.15.0
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
pillow==10.1.0
numpy==1.24.3
```

---

### Step 5: Push Changes to GitHub

```bash
git add -A
git commit -m "feat: Add ML model deployment support"
git push origin main
```

Render will auto-deploy!

---

### Step 6: Test Your Deployed App

1. **Wait 10 minutes** for Render to deploy

2. **Open your app:**
   ```
   https://smartagriculture-frontend-jwzd.onrender.com
   ```

3. **Go to Disease Detection page**

4. **Upload a plant image**

5. **Click "Analyze Disease"**

6. **See REAL ML predictions!** 🎉

---

## ⚠️ IMPORTANT NOTES

### Render Free Tier Limitations:

- **Memory:** 512MB (TensorFlow needs ~400MB)
- **Cold Start:** First request takes 30-60 seconds
- **Sleep:** App sleeps after 15 min of inactivity

### Solutions:

1. **Use Render Paid Plan** ($7/month)
   - More memory
   - No cold starts
   - Faster predictions

2. **Use Hugging Face Spaces** (FREE)
   - Better for ML models
   - More memory
   - GPU support

3. **Keep Local for Hackathon** (RECOMMENDED)
   - Train locally
   - Run ML API locally
   - Demo from your laptop
   - No deployment issues

---

## 🎯 RECOMMENDED FOR HACKATHON

### Best Approach:

1. **Train model locally** ✅
2. **Run ML API locally** ✅
3. **Frontend uses local API** ✅
4. **Demo from your laptop** ✅

### Why?

- ✅ No deployment time
- ✅ No memory limits
- ✅ Fast predictions (< 2 sec)
- ✅ No cold starts
- ✅ Works offline
- ✅ FREE

### How to Run:

```bash
# Terminal 1: ML API
cd backend
python disease_api.py

# Terminal 2: Frontend
cd frontend
npm run dev

# Browser
http://localhost:5173
```

**Perfect for hackathon demo!** 🏆

---

## 🐛 Troubleshooting

### "Model download failed"
- Check Google Drive link is public
- Check link format is correct
- Try uploading to Dropbox instead

### "Out of memory on Render"
- Render free tier has 512MB RAM
- TensorFlow needs ~400MB
- Upgrade to paid plan or use local

### "Predictions too slow"
- First request takes 30-60 sec (cold start)
- Subsequent requests are faster
- Use local API for demos

### "App keeps sleeping"
- Render free tier sleeps after 15 min
- Upgrade to paid plan
- Or use local for demos

---

## ✅ Quick Checklist

- [ ] Model trained locally
- [ ] Model files uploaded to Google Drive
- [ ] Got direct download link
- [ ] Added MODEL_DOWNLOAD_URL to Render
- [ ] Updated requirements.txt
- [ ] Pushed to GitHub
- [ ] Waited for Render deployment
- [ ] Tested disease detection
- [ ] Works with real predictions!

---

## 🎤 For Hackathon Demo

**BEST OPTION: Run locally**

```bash
# Just run these:
TRAIN_MODEL.bat  (once, 30-60 min)
RUN_APP.bat      (every time you demo)
```

**Then demo from:** `http://localhost:5173`

**Why?**
- No deployment issues
- Fast predictions
- Works every time
- Judges can see it live

---

**Good luck with your hackathon! 🚀**

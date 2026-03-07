# 🚀 Deploy BOTH Frontend & Backend on Render

## ✅ COMPLETE RENDER DEPLOYMENT GUIDE

---

## 📋 STEP 1: Push to GitHub (5 minutes)

### A. Initialize Git
```bash
cd c:\Users\DHANISHKA\OneDrive\Desktop\smart_agriculture

git init
git add .
git commit -m "AgriSense AI - Climate Smart Farming Assistant"
```

### B. Create GitHub Repository
1. Go to: https://github.com/new
2. Repository name: `agrisense-ai`
3. Description: `Climate-Smart Farming Assistant`
4. Public
5. Click "Create repository"

### C. Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/agrisense-ai.git
git branch -M main
git push -u origin main
```

---

## 🔧 STEP 2: Deploy Backend on Render (5 minutes)

### A. Go to Render
1. Visit: https://render.com
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub (recommended)

### B. Create Web Service
1. Click "New +" button (top right)
2. Select "Web Service"

### C. Connect Repository
1. Click "Connect account" if needed
2. Find and select: `agrisense-ai`
3. Click "Connect"

### D. Configure Backend Service
Fill in these settings:

```
Name: agrisense-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
```

### E. Select Instance Type
- Choose: **Free** (0$/month)

### F. Add Environment Variables
Click "Advanced" → "Add Environment Variable":

```
Key: OPENWEATHER_API_KEY
Value: your_openweathermap_api_key_here
```

(Get free key from: https://openweathermap.org/api)

### G. Deploy
1. Click "Create Web Service"
2. Wait 2-5 minutes for deployment
3. You'll see logs building...
4. When done, you'll get a URL like:
   ```
   https://agrisense-backend.onrender.com
   ```

### H. Test Backend
Visit: `https://agrisense-backend.onrender.com/api/health`

Should see:
```json
{"status": "healthy", "timestamp": "..."}
```

✅ **Backend is live!**

---

## 🎨 STEP 3: Deploy Frontend on Render (5 minutes)

### A. Create Static Site
1. Go back to Render Dashboard
2. Click "New +" button
3. Select "Static Site"

### B. Connect Same Repository
1. Select: `agrisense-ai`
2. Click "Connect"

### C. Configure Frontend Service
Fill in these settings:

```
Name: agrisense-frontend
Branch: main
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### D. Add Environment Variable
Click "Advanced" → "Add Environment Variable":

```
Key: VITE_API_URL
Value: https://agrisense-backend.onrender.com/api
```

**IMPORTANT**: Replace with YOUR actual backend URL from Step 2!

### E. Deploy
1. Click "Create Static Site"
2. Wait 3-5 minutes
3. You'll get a URL like:
   ```
   https://agrisense-frontend.onrender.com
   ```

✅ **Frontend is live!**

---

## 🔗 STEP 4: Update CORS (2 minutes)

### A. Update Backend CORS Settings

You need to allow your frontend URL in backend.

**Option 1: Via Render Dashboard**
1. Go to your backend service
2. Click "Environment"
3. Add new variable:
   ```
   Key: FRONTEND_URL
   Value: https://agrisense-frontend.onrender.com
   ```
4. Click "Save Changes"
5. Service will auto-redeploy

**Option 2: Update Code (Better)**

Edit `backend/app.py` line 10:

```python
CORS(app, origins=[
    "https://agrisense-frontend.onrender.com",
    "http://localhost:3000"
])
```

Then push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy!

---

## ✅ STEP 5: Verify Deployment (2 minutes)

### Test Backend
Visit these URLs:

1. Health check:
   ```
   https://agrisense-backend.onrender.com/api/health
   ```

2. Weather API:
   ```
   https://agrisense-backend.onrender.com/api/weather?lat=11.0168&lon=76.9558
   ```

### Test Frontend
Visit:
```
https://agrisense-frontend.onrender.com
```

### Check All Features:
- [ ] Dashboard loads
- [ ] Weather page displays data
- [ ] Crop recommendations work
- [ ] Alerts show
- [ ] Irrigation advice works
- [ ] Profit calculator works
- [ ] Language switch (English/Tamil) works

---

## 🎯 QUICK SUMMARY

### Your Live URLs:
```
Frontend: https://agrisense-frontend.onrender.com
Backend:  https://agrisense-backend.onrender.com
GitHub:   https://github.com/YOUR_USERNAME/agrisense-ai
```

### Deployment Settings:

**Backend (Web Service)**
```
Root: backend
Build: pip install -r requirements.txt
Start: gunicorn app:app --bind 0.0.0.0:$PORT
Env: OPENWEATHER_API_KEY=your_key
```

**Frontend (Static Site)**
```
Root: frontend
Build: npm install && npm run build
Publish: dist
Env: VITE_API_URL=https://agrisense-backend.onrender.com/api
```

---

## ⚠️ IMPORTANT NOTES

### Free Tier Limitations:
- **Backend**: Spins down after 15 min inactivity
- **First request**: Takes 30-60 seconds (cold start)
- **After that**: Normal speed
- **Solution**: Upgrade to $7/month for always-on

### Auto-Deploy:
- Every `git push` triggers auto-deployment
- Check logs in Render dashboard
- Takes 2-5 minutes per deploy

### Custom Domain (Optional):
1. Go to service settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records

---

## 🐛 TROUBLESHOOTING

### Backend not starting?
- Check logs in Render dashboard
- Verify `requirements.txt` is correct
- Check Python version (should be 3.10)

### Frontend not loading?
- Check build logs
- Verify `dist` folder is created
- Check if `npm run build` works locally

### Frontend can't connect to backend?
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Test backend URL directly in browser

### 404 errors on frontend routes?
- This is normal for SPAs on Render
- Add `_redirects` file in `frontend/public/`:
  ```
  /*    /index.html   200
  ```

---

## 📊 MONITORING

### View Logs:
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. See real-time logs

### Check Status:
- Green dot = Running
- Yellow dot = Deploying
- Red dot = Failed

### Metrics:
- Click "Metrics" tab
- See CPU, Memory, Bandwidth usage

---

## 🔄 UPDATE YOUR APP

### Make Changes:
```bash
# Edit your code
git add .
git commit -m "Update feature"
git push
```

Render auto-deploys in 2-5 minutes!

---

## 🎉 YOU'RE LIVE!

Share these URLs:

**Live Demo**: https://agrisense-frontend.onrender.com  
**API**: https://agrisense-backend.onrender.com/api/health  
**GitHub**: https://github.com/YOUR_USERNAME/agrisense-ai

---

## 📧 HACKATHON SUBMISSION

Use this format:

```
Project Name: AgriSense AI - Climate-Smart Farming Assistant

Live Demo: https://agrisense-frontend.onrender.com
GitHub: https://github.com/YOUR_USERNAME/agrisense-ai
API Documentation: https://agrisense-backend.onrender.com/api/health

Tech Stack:
- Frontend: React + Vite + Tailwind CSS
- Backend: Flask + Python
- ML: Scikit-learn
- Deployment: Render
- APIs: OpenWeatherMap

Features:
✅ Real-time weather dashboard
✅ AI crop recommendations
✅ Climate risk alerts
✅ Smart irrigation advisor
✅ Profit calculator
✅ Multi-language (English/Tamil)
✅ Mobile responsive
```

---

**Total Deployment Time: 15-20 minutes** ⚡

**Both frontend and backend on Render - DONE!** 🎉

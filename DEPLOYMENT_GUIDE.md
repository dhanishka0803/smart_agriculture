# 🚀 Deploy AgriSense AI to Render

## 📦 What You'll Deploy:
- **Backend**: Flask API on Render
- **Frontend**: React app on Vercel (or Render)

---

## 🔧 STEP 1: Prepare for Deployment

### Backend Preparation (Already Done ✅)
- ✅ `render.yaml` created
- ✅ `gunicorn` added to requirements.txt
- ✅ MongoDB/Redis disabled for speed

### Frontend Preparation
Update API URL after backend deployment.

---

## 🌐 STEP 2: Deploy Backend to Render

### A. Create Render Account
1. Go to: https://render.com
2. Sign up with GitHub (recommended)
3. Verify email

### B. Push Code to GitHub

```bash
# In project root
git init
git add .
git commit -m "Initial commit - AgriSense AI"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/agrisense-ai.git
git branch -M main
git push -u origin main
```

### C. Deploy on Render

1. **Go to Render Dashboard**
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Select your GitHub repo: `agrisense-ai`
   - Click "Connect"

3. **Configure Service**
   ```
   Name: agrisense-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
   ```

4. **Add Environment Variables**
   - Click "Advanced"
   - Add Environment Variable:
     ```
     Key: OPENWEATHER_API_KEY
     Value: your_api_key_here
     ```

5. **Select Plan**
   - Choose "Free" plan
   - Click "Create Web Service"

6. **Wait for Deployment**
   - Takes 2-5 minutes
   - You'll get a URL like: `https://agrisense-backend.onrender.com`

7. **Test Backend**
   - Visit: `https://agrisense-backend.onrender.com/api/health`
   - Should see: `{"status": "healthy", "timestamp": "..."}`

---

## 🎨 STEP 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended - Fastest)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow Prompts**
   ```
   Set up and deploy? Y
   Which scope? Your account
   Link to existing project? N
   Project name? agrisense-frontend
   Directory? ./
   Override settings? N
   ```

5. **Update API URL**
   - After backend is deployed, update frontend:
   - Edit `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'https://agrisense-backend.onrender.com/api';
   ```

6. **Redeploy**
   ```bash
   vercel --prod
   ```

7. **Get URL**
   - You'll get: `https://agrisense-frontend.vercel.app`

### Option B: Deploy Frontend to Render

1. **Go to Render Dashboard**
   - Click "New +" → "Static Site"

2. **Connect Repository**
   - Select your GitHub repo
   - Click "Connect"

3. **Configure**
   ```
   Name: agrisense-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variable**
   ```
   Key: VITE_API_URL
   Value: https://agrisense-backend.onrender.com/api
   ```

5. **Deploy**
   - Click "Create Static Site"
   - Wait 3-5 minutes

---

## 🔗 STEP 4: Connect Frontend to Backend

### Update API URL in Frontend

Edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agrisense-backend.onrender.com/api';
```

### Update CORS in Backend

Edit `backend/app.py`:

```python
CORS(app, origins=[
    "https://agrisense-frontend.vercel.app",
    "https://agrisense-frontend.onrender.com",
    "http://localhost:3000"
])
```

Commit and push changes:
```bash
git add .
git commit -m "Update API URLs for production"
git push
```

Render will auto-deploy!

---

## ✅ STEP 5: Verify Deployment

### Test Backend
```
https://agrisense-backend.onrender.com/api/health
https://agrisense-backend.onrender.com/api/weather?lat=11.0168&lon=76.9558
```

### Test Frontend
```
https://agrisense-frontend.vercel.app
```

### Check All Features:
- [ ] Dashboard loads
- [ ] Weather page works
- [ ] Crop recommendations work
- [ ] Alerts display
- [ ] Irrigation advice works
- [ ] Profit calculator works
- [ ] Language switch works

---

## 🎯 QUICK DEPLOYMENT (If GitHub Already Setup)

### Backend:
1. Go to render.com
2. New Web Service
3. Connect repo → Select `backend` folder
4. Build: `pip install -r requirements.txt`
5. Start: `gunicorn app:app --bind 0.0.0.0:$PORT`
6. Add env var: `OPENWEATHER_API_KEY`
7. Deploy!

### Frontend:
```bash
cd frontend
vercel --prod
```

Done! 🎉

---

## 📝 Important Notes

### Free Tier Limitations:
- **Render Free**: 
  - Spins down after 15 min inactivity
  - First request takes 30-60 seconds (cold start)
  - 750 hours/month free

- **Vercel Free**:
  - Always fast
  - 100GB bandwidth/month
  - Unlimited deployments

### Custom Domain (Optional):
1. Buy domain (Namecheap, GoDaddy)
2. In Render/Vercel: Settings → Custom Domain
3. Add your domain
4. Update DNS records

---

## 🐛 Troubleshooting

### Backend not starting?
- Check logs in Render dashboard
- Verify `requirements.txt` has all dependencies
- Check Python version (3.10)

### Frontend not connecting to backend?
- Verify API URL is correct
- Check CORS settings in backend
- Test backend URL directly

### Cold start slow?
- Normal for Render free tier
- Upgrade to paid plan ($7/month) for always-on

---

## 🎉 Your App is Live!

**Backend**: `https://agrisense-backend.onrender.com`  
**Frontend**: `https://agrisense-frontend.vercel.app`

Share these URLs in your hackathon submission! 🏆

---

## 📧 Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub: Push code first, then deploy

---

**Total Deployment Time: 10-15 minutes** ⚡

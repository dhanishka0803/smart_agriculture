# ✅ RENDER DEPLOYMENT - QUICK CHECKLIST

## 📋 Pre-Deployment (Done ✅)
- ✅ `render.yaml` created
- ✅ `gunicorn` added to requirements
- ✅ `.gitignore` created
- ✅ `vercel.json` created for frontend

---

## 🚀 DEPLOY IN 5 STEPS

### 1️⃣ Push to GitHub (5 min)

```bash
cd c:\Users\DHANISHKA\OneDrive\Desktop\smart_agriculture

git init
git add .
git commit -m "AgriSense AI - Ready for deployment"
```

Create repo on GitHub.com, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/agrisense-ai.git
git push -u origin main
```

---

### 2️⃣ Deploy Backend on Render (3 min)

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your repo
5. Configure:
   ```
   Name: agrisense-backend
   Root Directory: backend
   Build: pip install -r requirements.txt
   Start: gunicorn app:app --bind 0.0.0.0:$PORT
   ```
6. Add Environment Variable:
   ```
   OPENWEATHER_API_KEY = your_key_here
   ```
7. Click "Create Web Service"
8. Wait 2-3 minutes
9. Copy URL: `https://agrisense-backend.onrender.com`

---

### 3️⃣ Update Frontend API URL (1 min)

Edit `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://agrisense-backend.onrender.com/api';
```

Commit:
```bash
git add .
git commit -m "Update API URL"
git push
```

---

### 4️⃣ Deploy Frontend on Vercel (2 min)

```bash
npm install -g vercel
cd frontend
vercel login
vercel --prod
```

Copy URL: `https://agrisense-frontend.vercel.app`

---

### 5️⃣ Test (1 min)

Visit: `https://agrisense-frontend.vercel.app`

Check:
- [ ] Dashboard loads
- [ ] Weather works
- [ ] All features work

---

## 🎉 DONE!

**Your app is live:**
- Backend: `https://agrisense-backend.onrender.com`
- Frontend: `https://agrisense-frontend.vercel.app`

**Total time: 12 minutes** ⚡

---

## 🔗 Share These URLs

For hackathon submission:
```
Live Demo: https://agrisense-frontend.vercel.app
API: https://agrisense-backend.onrender.com/api/health
GitHub: https://github.com/YOUR_USERNAME/agrisense-ai
```

---

## ⚠️ Important Notes

1. **First Load**: Render free tier takes 30-60 seconds on first request (cold start)
2. **After 15 min**: Backend sleeps, wakes up on next request
3. **Solution**: Upgrade to paid ($7/month) or accept cold starts

---

**Need detailed steps? See DEPLOYMENT_GUIDE.md**

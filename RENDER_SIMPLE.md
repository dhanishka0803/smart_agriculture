# ✅ RENDER DEPLOYMENT - SIMPLE CHECKLIST

## 🎯 Deploy Both Frontend & Backend on Render

---

## STEP 1: Push to GitHub ⏱️ 5 min

```bash
cd c:\Users\DHANISHKA\OneDrive\Desktop\smart_agriculture

git init
git add .
git commit -m "AgriSense AI"
```

**Create repo on GitHub.com**, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/agrisense-ai.git
git push -u origin main
```

---

## STEP 2: Deploy Backend ⏱️ 5 min

1. Go to: **https://render.com**
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect repo: `agrisense-ai`
5. Settings:
   ```
   Name: agrisense-backend
   Root Directory: backend
   Build: pip install -r requirements.txt
   Start: gunicorn app:app --bind 0.0.0.0:$PORT
   Plan: Free
   ```
6. Environment Variable:
   ```
   OPENWEATHER_API_KEY = your_key_here
   ```
7. Click **"Create Web Service"**
8. Wait 3 minutes
9. Copy URL: `https://agrisense-backend.onrender.com`

---

## STEP 3: Deploy Frontend ⏱️ 5 min

1. Click **"New +"** → **"Static Site"**
2. Connect same repo: `agrisense-ai`
3. Settings:
   ```
   Name: agrisense-frontend
   Root Directory: frontend
   Build: npm install && npm run build
   Publish: dist
   Plan: Free
   ```
4. Environment Variable:
   ```
   VITE_API_URL = https://agrisense-backend.onrender.com/api
   ```
   (Use YOUR backend URL from Step 2!)
5. Click **"Create Static Site"**
6. Wait 3 minutes
7. Copy URL: `https://agrisense-frontend.onrender.com`

---

## STEP 4: Test ⏱️ 2 min

Visit: `https://agrisense-frontend.onrender.com`

Check:
- [ ] Dashboard loads
- [ ] Weather works
- [ ] All features work

---

## 🎉 DONE!

**Your URLs:**
```
Frontend: https://agrisense-frontend.onrender.com
Backend:  https://agrisense-backend.onrender.com
```

**Total Time: 15 minutes** ⚡

---

## ⚠️ First Load Note

- First request takes 30-60 seconds (cold start)
- After 15 min inactivity, backend sleeps
- This is normal for free tier
- Upgrade to $7/month for always-on

---

## 📝 For Hackathon Submission

```
Live Demo: https://agrisense-frontend.onrender.com
GitHub: https://github.com/YOUR_USERNAME/agrisense-ai
```

---

**Need detailed steps? See: RENDER_FULL_DEPLOYMENT.md**

# 🔧 Fix Backend Connection Issue

## Problem
Your frontend is deployed but can't connect to the backend because:
- Frontend URL: https://smartagriculture-frontend-jwzd.onrender.com
- Backend: NOT DEPLOYED YET

## Solution: Deploy Backend on Render

### Step 1: Deploy Backend (5 minutes)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"Web Service"**
3. **Connect your GitHub repository**: `smart_agriculture`
4. **Configure the service**:
   ```
   Name: smartagriculture-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app --bind 0.0.0.0:$PORT
   Instance Type: Free
   ```

5. **Add Environment Variable**:
   - Click "Advanced" → "Add Environment Variable"
   - Key: `OPENWEATHER_API_KEY`
   - Value: Get your free API key from https://openweathermap.org/api

6. **Click "Create Web Service"**
   - Wait 3-5 minutes for deployment
   - You'll get a URL like: `https://smartagriculture-backend-xxxx.onrender.com`

### Step 2: Update Frontend Environment Variable

1. **Go to your Frontend service** on Render
2. **Click "Environment"** in the left sidebar
3. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://smartagriculture-backend-xxxx.onrender.com/api`
   - (Replace with YOUR actual backend URL)

4. **Click "Save Changes"**
   - Frontend will automatically redeploy (2-3 minutes)

### Step 3: Update CORS in Backend

After backend is deployed, update the CORS settings:

1. Go to backend service on Render
2. Add environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://smartagriculture-frontend-jwzd.onrender.com`

### Step 4: Test

Visit: https://smartagriculture-frontend-jwzd.onrender.com

Everything should work now! ✅

---

## Alternative: Quick Fix with Mock Data (Temporary)

If you want to demo immediately without backend, I can add mock data fallback to the frontend.

---

## Need Help?

Check backend logs:
1. Go to Render Dashboard
2. Click on backend service
3. Click "Logs" tab
4. Look for errors

Common issues:
- Missing OPENWEATHER_API_KEY
- Wrong Python version (use 3.10)
- Missing requirements.txt

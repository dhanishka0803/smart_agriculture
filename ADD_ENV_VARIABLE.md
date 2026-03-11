# 🔧 ADD ENVIRONMENT VARIABLE - STEP BY STEP

## Your Service Details:
- **Service Name**: smartagriculture_frontend
- **Service ID**: srv-d6nd2i94tr6s738vpd30
- **Current URL**: https://smartagriculture-frontend-jwzd.onrender.com
- **Backend URL**: https://smart-agriculture-4pz4.onrender.com

## ⚠️ IMPORTANT: Render Static Sites Don't Support Environment Variables!

Your frontend is deployed as a **Static Site**, which means:
- Environment variables are baked into the build at build time
- You need to add them BEFORE building
- They cannot be changed after deployment without rebuilding

## ✅ SOLUTION: Two Options

### Option 1: Redeploy with Environment Variable (Recommended)

Since Render Static Sites don't have an "Environment" tab, you need to set the environment variable in your build command:

1. **Go to your Static Site settings**
2. **Click "Edit" next to "Build Command"**
3. **Replace the current build command** with:
   ```bash
   export VITE_API_URL=https://smart-agriculture-4pz4.onrender.com/api && npm install && npm run build
   ```
4. **Click "Save Changes"**
5. **Render will automatically redeploy** (3-5 minutes)

### Option 2: Add .env.production File (Already Done!)

I already created `.env.production` file with your backend URL. Just trigger a manual deploy:

1. **Go to your Static Site dashboard**
2. **Click "Manual Deploy"** button (top right)
3. **Select "Clear build cache & deploy"**
4. **Wait 3-5 minutes**

The `.env.production` file will be automatically used during build!

## 🎯 RECOMMENDED: Use Option 2 (Manual Deploy)

Since I already added the `.env.production` file to your repo, just:

1. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
2. Wait for deployment to complete
3. Test your app!

## ✅ After Deployment:

Visit: https://smartagriculture-frontend-jwzd.onrender.com

You should see:
- ✅ Professional landing page with new colors
- ✅ Dashboard and Weather working
- ✅ All features connected to backend

## 🐛 If Still Not Working:

### Check Build Logs:
1. Go to your Static Site
2. Click "Logs" tab
3. Look for: `VITE_API_URL` in the build output
4. Should show: `https://smart-agriculture-4pz4.onrender.com/api`

### Verify Backend:
Test backend directly:
```
https://smart-agriculture-4pz4.onrender.com/api/health
```
Should return: `{"status":"healthy","timestamp":"..."}`

### Check Browser Console:
1. Open your app
2. Press F12
3. Go to "Console" tab
4. Look for API calls
5. Should call: `https://smart-agriculture-4pz4.onrender.com/api/...`

## 📝 Alternative: Convert to Web Service

If you need dynamic environment variables, convert to Web Service:

1. **Create new Web Service** (not Static Site)
2. **Use these settings**:
   ```
   Name: smartagriculture-frontend-web
   Build Command: npm install && npm run build
   Start Command: npx serve -s dist -l $PORT
   ```
3. **Add Environment Variable**:
   ```
   VITE_API_URL=https://smart-agriculture-4pz4.onrender.com/api
   ```

But for now, **Option 2 (Manual Deploy) is easiest!**

---

## 🚀 QUICK ACTION:

**Click "Manual Deploy" → "Clear build cache & deploy"**

That's it! Your app will be live with all new features in 3-5 minutes! 🎉

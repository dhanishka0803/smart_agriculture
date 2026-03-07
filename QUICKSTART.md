# 🚀 Quick Start Guide - AgriSense AI

## Get Started in 5 Minutes!

### Step 1: Get OpenWeatherMap API Key (2 minutes)

1. Go to https://openweathermap.org/api
2. Click "Sign Up" (it's FREE!)
3. Verify your email
4. Go to API Keys section
5. Copy your API key

### Step 2: Setup Backend (1 minute)

```bash
cd backend
pip install -r requirements.txt
```

Create a file named `.env` in the `backend` folder:
```
OPENWEATHER_API_KEY=paste_your_api_key_here
MONGO_URI=mongodb://localhost:27017/
REDIS_HOST=localhost
```

Start the backend:
```bash
python app.py
```

✅ Backend running at http://localhost:5000

### Step 3: Setup Frontend (2 minutes)

Open a NEW terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running at http://localhost:3000

### Step 4: Open in Browser

Go to: **http://localhost:3000**

🎉 **You're ready!**

---

## 🧪 Test the Features

### 1. Dashboard
- View real-time weather
- See climate alerts
- Check 7-day forecast

### 2. Crop Recommendation
- Select soil type: **Loamy**
- Season: **Kharif**
- Click "Get Recommendations"
- View top 3 crops with growth timelines

### 3. Irrigation Advisor
- Set soil moisture: **40%**
- Select crop: **Rice**
- Get smart irrigation advice

### 4. Profit Calculator
- Select crop: **Rice**
- Farm size: **1 hectare**
- See detailed profit breakdown

### 5. Language Switch
- Click language dropdown (top right)
- Select **தமிழ்** (Tamil) or **हिंदी** (Hindi)
- See entire UI translated!

---

## 🐛 Troubleshooting

### Backend won't start?
- Make sure Python 3.8+ is installed: `python --version`
- Check if port 5000 is free
- Verify API key in `.env` file

### Frontend won't start?
- Make sure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is free

### No weather data showing?
- Verify your OpenWeatherMap API key is correct
- Check internet connection
- API key might take 10 minutes to activate after signup

### MongoDB/Redis errors?
- These are OPTIONAL - app works without them
- Backend will use in-memory cache if Redis is not available

---

## 📱 Mobile Testing

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` (look for inet)

2. On your phone's browser, go to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

3. Test mobile-responsive design!

---

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#2E7D32',  // Your green color
  secondary: '#4FC3F7', // Your blue color
}
```

### Add More Crops
Edit `backend/app.py` - add to `CROPS_DATA` dictionary

### Add More Languages
Edit `frontend/src/utils/i18n.js` - add new language object

---

## 📦 Build for Production

### Frontend
```bash
cd frontend
npm run build
```
Output in `frontend/dist/` folder

### Backend
```bash
cd backend
pip install gunicorn
gunicorn app:app
```

---

## 🚀 Deploy Online

### Frontend (Vercel - FREE)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Deploy!

### Backend (Render - FREE)
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Add environment variables
5. Deploy!

---

## 💡 Pro Tips

1. **Demo Mode:** If API fails, backend returns mock data automatically
2. **Offline Testing:** Frontend works without backend (shows loading states)
3. **Fast Reload:** Both frontend and backend support hot reload
4. **Browser DevTools:** Press F12 to see API calls and debug

---

## 🎤 Presentation Mode

Before your hackathon demo:

1. ✅ Test all features work
2. ✅ Prepare 2-3 locations to demo
3. ✅ Have backup screenshots ready
4. ✅ Test language switching
5. ✅ Clear browser cache for fresh demo
6. ✅ Close unnecessary browser tabs
7. ✅ Zoom browser to 110% for visibility

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review code comments in source files
- Test with different inputs to understand logic

---

**Happy Hacking! 🌾**

Built for Climate-Adaptive Rural Technologies Hackathon

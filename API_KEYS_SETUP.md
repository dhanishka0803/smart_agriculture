# 🔑 API Keys Setup - Quick Guide

## Get Your FREE API Keys (5 minutes)

### 1. OpenWeatherMap API (Weather Data)

**Steps:**
1. Go to: https://openweathermap.org/api
2. Click "Sign Up" (top right)
3. Fill in details (name, email, password)
4. Verify email
5. Go to: https://home.openweathermap.org/api_keys
6. Copy your API key

**Limits:** 1,000 calls/day (FREE forever)

**Add to backend/.env:**
```
OPENWEATHER_API_KEY=your_key_here
```

---

### 2. Groq API (AI Chatbot - Llama 3.1 70B)

**Steps:**
1. Go to: https://console.groq.com
2. Click "Sign in with Google" or "Sign in with GitHub"
3. Accept terms
4. Click "Create API Key"
5. Name it "AgriSense AI"
6. Copy the key (starts with "gsk_")

**Limits:** 14,400 requests/day (FREE forever)
**Model:** Llama 3.1 70B Versatile (Fastest LLM)

**Add to backend/.env:**
```
GROQ_API_KEY=gsk_your_key_here
```

---

## Complete .env File Example

Create `backend/.env` file:

```env
# OpenWeatherMap API Key
OPENWEATHER_API_KEY=abc123def456ghi789

# Groq API Key (starts with gsk_)
GROQ_API_KEY=gsk_abc123def456ghi789jkl012mno345pqr678

# Optional
FLASK_ENV=production
FLASK_DEBUG=False
```

---

## Test Your Setup

### 1. Test Backend
```bash
cd backend
python app.py
```

Should see:
```
* Running on http://127.0.0.1:5000
```

### 2. Test Weather API
Open browser: http://localhost:5000/api/weather?lat=11.0168&lon=76.9558

Should see JSON with weather data.

### 3. Test AI Chatbot
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What crops should I plant?"}'
```

Should see AI response.

---

## Deploy to Render

### Add Environment Variables in Render:

1. Go to your backend service on Render
2. Click "Environment"
3. Add variables:
   - `OPENWEATHER_API_KEY` = your_key
   - `GROQ_API_KEY` = gsk_your_key
4. Click "Save Changes"
5. Service will auto-redeploy

---

## Troubleshooting

**"Invalid API key" error?**
- Double-check you copied the full key
- No extra spaces before/after
- Key is active (check dashboard)

**Weather not loading?**
- Verify OPENWEATHER_API_KEY in .env
- Restart backend server
- Check console for errors

**AI Chatbot not responding?**
- Verify GROQ_API_KEY starts with "gsk_"
- Check Groq dashboard for usage
- Restart backend server

**Still not working?**
- Check backend console logs
- Verify .env file is in backend/ folder
- Make sure .env is not in .gitignore

---

## Free Tier Limits

| Service | Free Limit | Enough For |
|---------|-----------|------------|
| OpenWeatherMap | 1,000 calls/day | 100+ users/day |
| Groq API | 14,400 requests/day | 1,000+ chats/day |

Both are MORE than enough for development and small-scale production!

---

## Why These APIs?

✅ **100% FREE** - No credit card required
✅ **No expiration** - Free tier forever
✅ **High limits** - Suitable for production
✅ **Fast** - Groq is fastest LLM API
✅ **Reliable** - 99.9% uptime
✅ **Easy setup** - 5 minutes total

---

## Next Steps

1. ✅ Get both API keys (5 min)
2. ✅ Add to backend/.env
3. ✅ Restart backend
4. ✅ Test all features
5. ✅ Deploy to Render (add env vars)

**You're ready to go! 🚀**

# 📁 AgriSense AI - Project Structure

```
smart_agriculture/
│
├── backend/                          # Flask Backend
│   ├── app.py                       # Main Flask application with all API endpoints
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Environment variables template
│   └── .env                         # Your environment variables (create this)
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components
│   │   │   ├── Dashboard.jsx        # Main dashboard with weather overview
│   │   │   ├── Weather.jsx          # Detailed weather page
│   │   │   ├── CropRecommendation.jsx  # AI crop recommendation
│   │   │   ├── Alerts.jsx           # Climate risk alerts
│   │   │   ├── Irrigation.jsx       # Smart irrigation advisor
│   │   │   └── ProfitCalculator.jsx # Profit estimation tool
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── utils/
│   │   │   └── i18n.js              # Multi-language configuration
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles with Tailwind
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML template
│   ├── package.json                 # Node dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config (Green + Blue theme)
│   └── postcss.config.js            # PostCSS configuration
│
├── ml_model/                         # Machine Learning
│   ├── train_model.py               # ML model training script
│   └── crop_model.pkl               # Trained model (generated)
│
├── data/                             # Data files
│   └── (crop datasets, weather data)
│
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick setup guide
├── PRESENTATION_GUIDE.md             # Hackathon presentation guide
└── .gitignore                        # Git ignore rules
```

## 📄 File Descriptions

### Backend Files

**app.py** (Main Backend)
- Flask application with CORS enabled
- API endpoints:
  - `GET /api/health` - Health check
  - `GET /api/weather` - Get weather data
  - `POST /api/crop-recommendation` - Get crop recommendations
  - `GET /api/crop-timeline/<crop>` - Get crop growth timeline
  - `POST /api/alerts` - Generate climate alerts
  - `POST /api/irrigation-advice` - Get irrigation recommendations
  - `POST /api/profit-estimate` - Calculate profit estimates
- Weather API integration (OpenWeatherMap)
- Crop database with 10 major crops
- Rule-based recommendation engine
- Alert generation logic

**requirements.txt**
- Flask 3.0.0 - Web framework
- flask-cors 4.0.0 - CORS support
- requests 2.31.0 - HTTP library
- pymongo 4.6.1 - MongoDB driver (optional)
- redis 5.0.1 - Redis cache (optional)
- numpy 1.26.3 - Numerical computing
- scikit-learn 1.4.0 - Machine learning
- pandas 2.2.0 - Data manipulation

### Frontend Files

**App.jsx**
- Main application component
- React Router setup
- Navigation bar with icons
- Language selector (English, Tamil, Hindi)
- Header with gradient green background
- Footer

**Dashboard.jsx**
- Weather overview cards
- Active alerts banner
- Quick action buttons
- 7-day forecast visualization
- Real-time data fetching

**Weather.jsx**
- Detailed current weather display
- Temperature trend chart (Recharts)
- 7-day detailed forecast table
- Weather icons from OpenWeatherMap

**CropRecommendation.jsx**
- Input form (soil, season, climate)
- Top 3 crop recommendations
- Confidence scores
- Growth timeline visualization
- Water requirements
- Profit estimates

**Alerts.jsx**
- Climate risk alerts display
- Severity-based color coding
- Alert statistics
- Recommended actions

**Irrigation.jsx**
- Soil moisture slider
- Smart irrigation recommendations
- Water amount calculations
- Weather impact analysis
- Irrigation tips

**ProfitCalculator.jsx**
- Crop and farm size input
- Revenue calculations
- Detailed cost breakdown
- Bar charts and pie charts
- ROI and profit margin display

**api.js**
- Axios HTTP client
- API service functions
- Base URL configuration
- Error handling

**i18n.js**
- i18next configuration
- English translations
- Tamil (தமிழ்) translations
- Hindi (हिंदी) translations
- Language switching logic

**index.css**
- Tailwind CSS directives
- Custom component classes
- Color scheme:
  - Primary: #2E7D32 (Green)
  - Secondary: #4FC3F7 (Sky Blue)
  - Background: White/Light Gray

**tailwind.config.js**
- Custom color palette
- Primary green (#2E7D32)
- Secondary sky blue (#4FC3F7)
- Extended theme configuration

### ML Model Files

**train_model.py**
- Synthetic training data generation
- Random Forest Classifier
- 600 training samples
- 10 crop types
- 5 soil types
- Model serialization (pickle)

## 🎨 Color Scheme

### Primary Colors
- **Green (#2E7D32)**: Agriculture, crops, sustainability
  - Light: #4CAF50
  - Dark: #1B5E20

- **Sky Blue (#4FC3F7)**: Climate, weather, environment
  - Light: #81D4FA
  - Dark: #0288D1

### Accent Colors
- **Red (#EF5350)**: Alerts, warnings
- **Yellow (#FFA726)**: Medium priority
- **Purple (#AB47BC)**: Analytics
- **Gray (#F5F5F5)**: Background

## 🔌 API Endpoints

### Weather API
```
GET /api/weather?lat=11.0168&lon=76.9558
Response: { current: {...}, forecast: [...] }
```

### Crop Recommendation API
```
POST /api/crop-recommendation
Body: { soil_type, temperature, humidity, rainfall, season }
Response: { recommendations: [...] }
```

### Crop Timeline API
```
GET /api/crop-timeline/Rice
Response: { crop, total_days, timeline: [...] }
```

### Alerts API
```
POST /api/alerts
Body: { forecast: [...], current_temp }
Response: { alerts: [...] }
```

### Irrigation API
```
POST /api/irrigation-advice
Body: { soil_moisture, rainfall_forecast, crop_type, temperature }
Response: { irrigate, message, next_irrigation, water_amount }
```

### Profit Estimation API
```
POST /api/profit-estimate
Body: { crop, farm_size }
Response: { revenue, costs: {...}, net_profit, roi }
```

## 📊 Data Models

### Weather Data
```javascript
{
  current: {
    temp: number,
    humidity: number,
    wind_speed: number,
    pressure: number,
    description: string,
    icon: string
  },
  forecast: [
    {
      date: string,
      temp_max: number,
      temp_min: number,
      humidity: number,
      rainfall: number,
      description: string,
      icon: string
    }
  ]
}
```

### Crop Recommendation
```javascript
{
  crop: string,
  confidence: number,
  reason: string,
  growth_days: number,
  water_requirement: string,
  expected_yield: number,
  market_price: number,
  profit_estimate: number
}
```

### Alert
```javascript
{
  type: string,
  severity: string,
  title: string,
  message: string,
  icon: string,
  action: string
}
```

## 🚀 Technology Stack Summary

### Frontend
- React 18 + Vite
- Tailwind CSS
- Recharts
- Lucide React Icons
- React Router v6
- i18next
- Axios

### Backend
- Flask (Python)
- OpenWeatherMap API
- MongoDB (optional)
- Redis (optional)

### ML
- Scikit-learn
- Random Forest
- NumPy
- Pandas

## 📱 Responsive Design

- **Mobile First**: Optimized for phones (320px+)
- **Tablet**: Responsive grid layouts (768px+)
- **Desktop**: Full-width layouts (1024px+)
- **Touch Friendly**: Large buttons and inputs
- **Low Bandwidth**: Optimized images and caching

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security

- CORS enabled for frontend-backend communication
- Environment variables for API keys
- No sensitive data in frontend
- Input validation on backend
- Rate limiting (future enhancement)

## 📈 Performance

- Frontend: Vite for fast builds
- Backend: Flask with caching
- API: Response caching with Redis
- Images: Lazy loading
- Code splitting: React Router

## 🧪 Testing

- Manual testing of all features
- API testing with Postman/Thunder Client
- Browser DevTools for debugging
- Mobile testing on real devices

---

**Total Files:** 25+
**Total Lines of Code:** ~3,500+
**Development Time:** 2-3 days
**Deployment Ready:** Yes ✅

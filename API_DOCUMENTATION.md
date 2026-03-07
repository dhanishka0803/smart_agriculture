# 🔌 AgriSense AI - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

---

## 📡 API Endpoints

### 1. Health Check

**Endpoint**: `GET /api/health`

**Description**: Check if the API is running

**Request**: None

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Status Codes**:
- `200 OK`: API is healthy

---

### 2. Get Weather Data

**Endpoint**: `GET /api/weather`

**Description**: Get current weather and 7-day forecast for a location

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | float | Yes | Latitude (e.g., 11.0168) |
| lon | float | Yes | Longitude (e.g., 76.9558) |

**Example Request**:
```
GET /api/weather?lat=11.0168&lon=76.9558
```

**Response**:
```json
{
  "current": {
    "temp": 28.5,
    "feels_like": 30.2,
    "humidity": 65,
    "pressure": 1013,
    "wind_speed": 12.5,
    "description": "partly cloudy",
    "icon": "02d"
  },
  "forecast": [
    {
      "date": "2024-01-21",
      "temp_max": 32.0,
      "temp_min": 22.0,
      "humidity": 60.0,
      "rainfall": 0.0,
      "description": "clear sky",
      "icon": "01d"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Weather data retrieved successfully
- `500 Internal Server Error`: API error (returns mock data)

**Notes**:
- Data is cached for 30 minutes
- Falls back to mock data if OpenWeatherMap API fails
- Weather icons from: `https://openweathermap.org/img/wn/{icon}@2x.png`

---

### 3. Get Crop Recommendations

**Endpoint**: `POST /api/crop-recommendation`

**Description**: Get AI-powered crop recommendations based on climate and soil data

**Request Body**:
```json
{
  "soil_type": "loamy",
  "temperature": 28,
  "humidity": 65,
  "rainfall": 800,
  "season": "kharif"
}
```

**Parameters**:
| Parameter | Type | Required | Options |
|-----------|------|----------|---------|
| soil_type | string | Yes | loamy, clayey, sandy, black, red |
| temperature | float | Yes | Temperature in °C |
| humidity | float | Yes | Humidity in % |
| rainfall | float | Yes | Annual rainfall in mm |
| season | string | Yes | kharif, rabi, zaid |

**Response**:
```json
{
  "recommendations": [
    {
      "crop": "Rice",
      "confidence": 0.92,
      "reason": "High rainfall and suitable soil for paddy cultivation",
      "growth_days": 120,
      "water_requirement": "high",
      "expected_yield": 4500,
      "market_price": 20,
      "profit_estimate": 90000
    },
    {
      "crop": "Maize",
      "confidence": 0.82,
      "reason": "Versatile crop suitable for current conditions",
      "growth_days": 90,
      "water_requirement": "medium",
      "expected_yield": 5000,
      "market_price": 18,
      "profit_estimate": 90000
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Recommendations generated successfully
- `400 Bad Request`: Invalid input parameters

**Algorithm**:
- Rule-based recommendation engine
- Considers soil type, climate, and season
- Returns top 3 crops sorted by confidence
- Includes economic analysis

---

### 4. Get Crop Growth Timeline

**Endpoint**: `GET /api/crop-timeline/{crop_name}`

**Description**: Get detailed growth stages and timeline for a specific crop

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| crop_name | string | Yes | Name of the crop (e.g., Rice, Wheat) |

**Example Request**:
```
GET /api/crop-timeline/Rice
```

**Response**:
```json
{
  "crop": "Rice",
  "total_days": 120,
  "timeline": [
    {
      "stage": "Germination",
      "days": 10,
      "start_day": 0,
      "end_day": 10
    },
    {
      "stage": "Vegetative",
      "days": 40,
      "start_day": 10,
      "end_day": 50
    },
    {
      "stage": "Flowering",
      "days": 35,
      "start_day": 50,
      "end_day": 85
    },
    {
      "stage": "Maturity",
      "days": 35,
      "start_day": 85,
      "end_day": 120
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Timeline retrieved successfully
- `404 Not Found`: Crop not found in database

**Supported Crops**:
- Rice, Wheat, Cotton, Sugarcane, Maize
- Groundnut, Soybean, Tomato, Potato, Onion

---

### 5. Generate Climate Alerts

**Endpoint**: `POST /api/alerts`

**Description**: Generate climate risk alerts based on weather forecast

**Request Body**:
```json
{
  "forecast": [
    {
      "date": "2024-01-21",
      "temp_max": 32,
      "temp_min": 22,
      "rainfall": 0
    }
  ],
  "current_temp": 28
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| forecast | array | Yes | 7-day weather forecast |
| current_temp | float | Yes | Current temperature in °C |

**Response**:
```json
{
  "alerts": [
    {
      "type": "drought_risk",
      "severity": "high",
      "title": "Drought Risk Alert",
      "message": "No significant rainfall expected in next 7 days. Plan irrigation immediately.",
      "icon": "🌵",
      "action": "Start irrigation schedule"
    },
    {
      "type": "heatwave",
      "severity": "medium",
      "title": "Heatwave Alert",
      "message": "High temperatures expected. Increase irrigation frequency.",
      "icon": "🌡️",
      "action": "Provide shade to crops"
    }
  ]
}
```

**Alert Types**:
- `drought_risk`: No rain >7 days
- `flood_warning`: Heavy rainfall >50mm
- `heatwave`: Temp >38°C for 3+ days
- `cold_wave`: Temp <10°C

**Severity Levels**:
- `high`: Immediate action required
- `medium`: Action recommended
- `low`: Monitor situation

**Status Codes**:
- `200 OK`: Alerts generated successfully

---

### 6. Get Irrigation Advice

**Endpoint**: `POST /api/irrigation-advice`

**Description**: Get smart irrigation recommendations based on soil moisture and weather

**Request Body**:
```json
{
  "soil_moisture": 50,
  "rainfall_forecast": 0,
  "crop_type": "Rice",
  "temperature": 28
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| soil_moisture | float | Yes | Current soil moisture (0-100%) |
| rainfall_forecast | float | Yes | Expected rainfall in mm |
| crop_type | string | Yes | Name of the crop |
| temperature | float | Yes | Current temperature in °C |

**Response**:
```json
{
  "irrigate": true,
  "message": "Irrigation recommended within 24 hours",
  "next_irrigation": "Tomorrow",
  "water_amount": 35,
  "reason": "Soil moisture below optimal level (50%)"
}
```

**Status Codes**:
- `200 OK`: Advice generated successfully

**Logic**:
- Soil moisture <30%: Immediate irrigation
- Soil moisture 30-50%: Irrigation within 24 hours
- Soil moisture >50%: No irrigation needed
- Considers rainfall forecast
- Adjusts water amount based on crop type

---

### 7. Calculate Profit Estimate

**Endpoint**: `POST /api/profit-estimate`

**Description**: Calculate expected profit for a crop based on farm size

**Request Body**:
```json
{
  "crop": "Rice",
  "farm_size": 1
}
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| crop | string | Yes | Name of the crop |
| farm_size | float | Yes | Farm size in hectares |

**Response**:
```json
{
  "crop": "Rice",
  "farm_size": 1,
  "expected_yield": 4500,
  "revenue": 90000,
  "costs": {
    "seed": 5000,
    "fertilizer": 8000,
    "pesticide": 3000,
    "labor": 15000,
    "irrigation": 4000,
    "total": 35000
  },
  "net_profit": 55000,
  "profit_margin": 61.11,
  "roi": 157.14
}
```

**Status Codes**:
- `200 OK`: Estimate calculated successfully
- `404 Not Found`: Crop not found

**Calculations**:
- Revenue = Yield × Market Price
- Net Profit = Revenue - Total Costs
- Profit Margin = (Net Profit / Revenue) × 100
- ROI = (Net Profit / Total Costs) × 100

---

## 🔐 Authentication

**Current Version**: No authentication required

**Future Version**: JWT-based authentication
```
Authorization: Bearer <token>
```

---

## 🚨 Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "status": 400
}
```

### Common Error Codes
- `400 Bad Request`: Invalid input parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## 📊 Rate Limiting

**Current**: No rate limiting

**Future**: 
- Free tier: 100 requests/hour
- Premium: 1000 requests/hour

---

## 🔄 Caching

- Weather data: Cached for 30 minutes
- Crop data: Static, no caching needed
- Redis used for caching (optional)

---

## 🌐 CORS

CORS is enabled for all origins in development.

Production: Restrict to specific domains.

---

## 📝 Request Examples

### Using cURL

**Get Weather**:
```bash
curl "http://localhost:5000/api/weather?lat=11.0168&lon=76.9558"
```

**Get Crop Recommendations**:
```bash
curl -X POST http://localhost:5000/api/crop-recommendation \
  -H "Content-Type: application/json" \
  -d '{
    "soil_type": "loamy",
    "temperature": 28,
    "humidity": 65,
    "rainfall": 800,
    "season": "kharif"
  }'
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

// Get weather
const weather = await axios.get('/api/weather', {
  params: { lat: 11.0168, lon: 76.9558 }
});

// Get crop recommendations
const recommendations = await axios.post('/api/crop-recommendation', {
  soil_type: 'loamy',
  temperature: 28,
  humidity: 65,
  rainfall: 800,
  season: 'kharif'
});
```

### Using Python (Requests)

```python
import requests

# Get weather
response = requests.get(
    'http://localhost:5000/api/weather',
    params={'lat': 11.0168, 'lon': 76.9558}
)
weather = response.json()

# Get crop recommendations
response = requests.post(
    'http://localhost:5000/api/crop-recommendation',
    json={
        'soil_type': 'loamy',
        'temperature': 28,
        'humidity': 65,
        'rainfall': 800,
        'season': 'kharif'
    }
)
recommendations = response.json()
```

---

## 🧪 Testing

### Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "AgriSense AI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "Get Weather",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/weather?lat=11.0168&lon=76.9558"
      }
    }
  ]
}
```

---

## 📚 Additional Resources

- **OpenWeatherMap API**: https://openweathermap.org/api
- **Flask Documentation**: https://flask.palletsprojects.com/
- **MongoDB Documentation**: https://docs.mongodb.com/

---

## 🐛 Troubleshooting

### Issue: Weather API returns 401
**Solution**: Check your OpenWeatherMap API key in `.env`

### Issue: CORS errors
**Solution**: Ensure Flask-CORS is installed and configured

### Issue: Slow response times
**Solution**: Enable Redis caching

---

## 📞 Support

For API issues or questions:
- GitHub Issues: [Create an issue]
- Email: api-support@agrisense.ai

---

**API Version**: 1.0  
**Last Updated**: 2024  
**Status**: Production Ready ✅

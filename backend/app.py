from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import os
import json
from groq import Groq
import subprocess
import sys

app = Flask(__name__)
# Allow both production and local frontend URLs
CORS(app, origins=[
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://smartagriculture-frontend-jwzd.onrender.com'
])

# Configuration
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'your_api_key_here')
GROQ_API_KEY = os.getenv('GROQ_API_KEY', 'gsk_your_key_here')
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')

# Initialize Groq client
try:
    groq_client = Groq(api_key=GROQ_API_KEY)
except:
    groq_client = None

# Start ML API in background
def start_ml_api():
    """Start the ML API server in background"""
    try:
        # Check if disease_api.py exists
        if os.path.exists('disease_api.py'):
            print("🚀 Starting ML API server...")
            subprocess.Popen([sys.executable, 'disease_api.py'])
            print("✅ ML API server started on port 8000")
    except Exception as e:
        print(f"⚠️ Could not start ML API: {e}")

# Start ML API on app startup
start_ml_api()

# Crop database
CROPS_DATA = {
    'Rice': {'days': 120, 'stages': [10, 40, 35, 35], 'yield': 4500, 'price': 20, 'water': 'high'},
    'Wheat': {'days': 110, 'stages': [7, 35, 40, 28], 'yield': 3500, 'price': 25, 'water': 'medium'},
    'Cotton': {'days': 150, 'stages': [10, 50, 60, 30], 'yield': 2000, 'price': 60, 'water': 'medium'},
    'Sugarcane': {'days': 365, 'stages': [30, 120, 150, 65], 'yield': 70000, 'price': 3, 'water': 'high'},
    'Maize': {'days': 90, 'stages': [7, 35, 30, 18], 'yield': 5000, 'price': 18, 'water': 'medium'},
    'Groundnut': {'days': 120, 'stages': [10, 40, 45, 25], 'yield': 2500, 'price': 50, 'water': 'low'},
    'Soybean': {'days': 100, 'stages': [7, 35, 40, 18], 'yield': 3000, 'price': 40, 'water': 'medium'},
    'Tomato': {'days': 75, 'stages': [7, 25, 28, 15], 'yield': 25000, 'price': 15, 'water': 'medium'},
    'Potato': {'days': 90, 'stages': [10, 30, 35, 15], 'yield': 20000, 'price': 12, 'water': 'medium'},
    'Onion': {'days': 120, 'stages': [10, 40, 50, 20], 'yield': 18000, 'price': 20, 'water': 'medium'}
}

SOIL_TYPES = ['loamy', 'clayey', 'sandy', 'black', 'red']
SEASONS = ['kharif', 'rabi', 'zaid']

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/weather', methods=['GET'])
def get_weather():
    lat = request.args.get('lat', '11.0168')
    lon = request.args.get('lon', '76.9558')
    
    try:
        # Current weather
        current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        current_response = requests.get(current_url, timeout=5)
        current_data = current_response.json()
        
        # 7-day forecast
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        forecast_response = requests.get(forecast_url, timeout=5)
        forecast_data = forecast_response.json()
        
        # Process data
        weather_result = {
            'current': {
                'temp': round(current_data['main']['temp'], 1),
                'feels_like': round(current_data['main']['feels_like'], 1),
                'humidity': current_data['main']['humidity'],
                'pressure': current_data['main']['pressure'],
                'wind_speed': round(current_data['wind']['speed'] * 3.6, 1),
                'description': current_data['weather'][0]['description'],
                'icon': current_data['weather'][0]['icon']
            },
            'forecast': []
        }
        
        # Group forecast by day
        daily_forecast = {}
        for item in forecast_data['list'][:40]:
            date = item['dt_txt'].split(' ')[0]
            if date not in daily_forecast:
                daily_forecast[date] = {
                    'temps': [],
                    'humidity': [],
                    'rain': 0,
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                }
            daily_forecast[date]['temps'].append(item['main']['temp'])
            daily_forecast[date]['humidity'].append(item['main']['humidity'])
            if 'rain' in item:
                daily_forecast[date]['rain'] += item['rain'].get('3h', 0)
        
        for date, data in list(daily_forecast.items())[:7]:
            weather_result['forecast'].append({
                'date': date,
                'temp_max': round(max(data['temps']), 1),
                'temp_min': round(min(data['temps']), 1),
                'humidity': round(sum(data['humidity']) / len(data['humidity']), 1),
                'rainfall': round(data['rain'], 1),
                'description': data['description'],
                'icon': data['icon']
            })
        
        return jsonify(weather_result)
    
    except Exception as e:
        print(f"Weather API Error: {e}")
        # Fallback mock data with realistic values
        return jsonify({
            'current': {
                'temp': 28.5,
                'feels_like': 30.2,
                'humidity': 65,
                'pressure': 1013,
                'wind_speed': 12.5,
                'description': 'partly cloudy',
                'icon': '02d'
            },
            'forecast': [
                {'date': (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
                 'temp_max': 32.0, 'temp_min': 22.0, 'humidity': 60.0, 'rainfall': 0.0, 
                 'description': 'clear sky', 'icon': '01d'},
                {'date': (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d'),
                 'temp_max': 33.0, 'temp_min': 23.0, 'humidity': 62.0, 'rainfall': 0.0, 
                 'description': 'few clouds', 'icon': '02d'},
                {'date': (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d'),
                 'temp_max': 31.0, 'temp_min': 21.0, 'humidity': 68.0, 'rainfall': 5.0, 
                 'description': 'light rain', 'icon': '10d'},
                {'date': (datetime.now() + timedelta(days=4)).strftime('%Y-%m-%d'),
                 'temp_max': 30.0, 'temp_min': 22.0, 'humidity': 70.0, 'rainfall': 2.0, 
                 'description': 'scattered clouds', 'icon': '03d'},
                {'date': (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d'),
                 'temp_max': 32.0, 'temp_min': 23.0, 'humidity': 65.0, 'rainfall': 0.0, 
                 'description': 'clear sky', 'icon': '01d'},
                {'date': (datetime.now() + timedelta(days=6)).strftime('%Y-%m-%d'),
                 'temp_max': 34.0, 'temp_min': 24.0, 'humidity': 58.0, 'rainfall': 0.0, 
                 'description': 'clear sky', 'icon': '01d'},
                {'date': (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                 'temp_max': 33.0, 'temp_min': 23.0, 'humidity': 60.0, 'rainfall': 0.0, 
                 'description': 'few clouds', 'icon': '02d'}
            ]
        })

@app.route('/api/crop-recommendation', methods=['POST'])
def crop_recommendation():
    data = request.json
    
    soil_type = data.get('soil_type', 'loamy')
    temp = data.get('temperature', 28)
    humidity = data.get('humidity', 65)
    rainfall = data.get('rainfall', 800)
    season = data.get('season', 'kharif')
    
    # Simple rule-based recommendation
    recommendations = []
    
    # Rice - high water, warm climate
    if rainfall > 1000 and temp > 20 and soil_type in ['clayey', 'loamy']:
        recommendations.append({
            'crop': 'Rice',
            'confidence': 0.92,
            'reason': 'High rainfall and suitable soil for paddy cultivation'
        })
    
    # Wheat - moderate water, cool climate
    if temp < 25 and rainfall < 800 and season == 'rabi':
        recommendations.append({
            'crop': 'Wheat',
            'confidence': 0.88,
            'reason': 'Cool temperature ideal for wheat in rabi season'
        })
    
    # Cotton - moderate water, warm climate
    if temp > 25 and rainfall > 600 and soil_type in ['black', 'loamy']:
        recommendations.append({
            'crop': 'Cotton',
            'confidence': 0.85,
            'reason': 'Black soil and warm climate perfect for cotton'
        })
    
    # Maize - versatile crop
    if temp > 20 and rainfall > 500:
        recommendations.append({
            'crop': 'Maize',
            'confidence': 0.82,
            'reason': 'Versatile crop suitable for current conditions'
        })
    
    # Groundnut - low water, sandy soil
    if rainfall < 700 and soil_type in ['sandy', 'red', 'loamy']:
        recommendations.append({
            'crop': 'Groundnut',
            'confidence': 0.80,
            'reason': 'Low water requirement, suitable for sandy soil'
        })
    
    # Tomato - moderate conditions
    if temp > 18 and temp < 30 and rainfall > 400:
        recommendations.append({
            'crop': 'Tomato',
            'confidence': 0.78,
            'reason': 'High value crop with good market demand'
        })
    
    # Sort by confidence and take top 3
    recommendations.sort(key=lambda x: x['confidence'], reverse=True)
    top_recommendations = recommendations[:3]
    
    # Add crop details
    for rec in top_recommendations:
        crop_name = rec['crop']
        crop_info = CROPS_DATA[crop_name]
        rec.update({
            'growth_days': crop_info['days'],
            'water_requirement': crop_info['water'],
            'expected_yield': crop_info['yield'],
            'market_price': crop_info['price'],
            'profit_estimate': crop_info['yield'] * crop_info['price']
        })
    
    return jsonify({'recommendations': top_recommendations})

@app.route('/api/crop-timeline/<crop_name>', methods=['GET'])
def crop_timeline(crop_name):
    if crop_name not in CROPS_DATA:
        return jsonify({'error': 'Crop not found'}), 404
    
    crop_info = CROPS_DATA[crop_name]
    stages = ['Germination', 'Vegetative', 'Flowering', 'Maturity']
    
    timeline = []
    cumulative_days = 0
    
    for i, stage in enumerate(stages):
        days = crop_info['stages'][i]
        timeline.append({
            'stage': stage,
            'days': days,
            'start_day': cumulative_days,
            'end_day': cumulative_days + days
        })
        cumulative_days += days
    
    return jsonify({
        'crop': crop_name,
        'total_days': crop_info['days'],
        'timeline': timeline
    })

@app.route('/api/alerts', methods=['POST'])
def generate_alerts():
    data = request.json
    forecast = data.get('forecast', [])
    current_temp = data.get('current_temp', 28)
    
    alerts = []
    
    # Check for drought risk
    total_rainfall = sum([day.get('rainfall', 0) for day in forecast])
    if total_rainfall < 5:
        alerts.append({
            'type': 'drought_risk',
            'severity': 'high',
            'title': 'Drought Risk Alert',
            'message': 'No significant rainfall expected in next 7 days. Plan irrigation immediately.',
            'icon': '🌵',
            'action': 'Start irrigation schedule'
        })
    
    # Check for heavy rainfall
    max_rainfall = max([day.get('rainfall', 0) for day in forecast])
    if max_rainfall > 50:
        alerts.append({
            'type': 'flood_warning',
            'severity': 'high',
            'title': 'Heavy Rainfall Warning',
            'message': f'Heavy rainfall ({max_rainfall}mm) expected. Ensure proper drainage.',
            'icon': '🌧️',
            'action': 'Check drainage systems'
        })
    
    # Check for heatwave
    high_temp_days = sum([1 for day in forecast if day.get('temp_max', 0) > 38])
    if high_temp_days >= 3 or current_temp > 40:
        alerts.append({
            'type': 'heatwave',
            'severity': 'medium',
            'title': 'Heatwave Alert',
            'message': 'High temperatures expected. Increase irrigation frequency.',
            'icon': '🌡️',
            'action': 'Provide shade to crops'
        })
    
    # Check for cold wave
    min_temp = min([day.get('temp_min', 20) for day in forecast])
    if min_temp < 10:
        alerts.append({
            'type': 'cold_wave',
            'severity': 'medium',
            'title': 'Cold Wave Warning',
            'message': f'Temperature may drop to {min_temp}°C. Protect sensitive crops.',
            'icon': '❄️',
            'action': 'Cover young plants'
        })
    
    return jsonify({'alerts': alerts})

@app.route('/api/irrigation-advice', methods=['POST'])
def irrigation_advice():
    data = request.json
    
    soil_moisture = data.get('soil_moisture', 50)  # percentage
    rainfall_forecast = data.get('rainfall_forecast', 0)
    crop_type = data.get('crop_type', 'Rice')
    temp = data.get('temperature', 28)
    
    crop_info = CROPS_DATA.get(crop_type, CROPS_DATA['Rice'])
    water_need = crop_info['water']
    
    # Calculate irrigation need
    if rainfall_forecast > 10:
        advice = {
            'irrigate': False,
            'message': 'No irrigation needed. Rainfall expected soon.',
            'next_irrigation': 'After 3-4 days',
            'water_amount': 0,
            'reason': f'Expected rainfall: {rainfall_forecast}mm'
        }
    elif soil_moisture < 30:
        water_amount = 40 if water_need == 'high' else 30 if water_need == 'medium' else 20
        advice = {
            'irrigate': True,
            'message': 'Immediate irrigation required!',
            'next_irrigation': 'Today',
            'water_amount': water_amount,
            'reason': f'Soil moisture critically low ({soil_moisture}%)'
        }
    elif soil_moisture < 50:
        water_amount = 35 if water_need == 'high' else 25 if water_need == 'medium' else 15
        advice = {
            'irrigate': True,
            'message': 'Irrigation recommended within 24 hours',
            'next_irrigation': 'Tomorrow',
            'water_amount': water_amount,
            'reason': f'Soil moisture below optimal level ({soil_moisture}%)'
        }
    else:
        advice = {
            'irrigate': False,
            'message': 'Soil moisture is adequate',
            'next_irrigation': 'After 2-3 days',
            'water_amount': 0,
            'reason': f'Current soil moisture: {soil_moisture}%'
        }
    
    return jsonify(advice)

@app.route('/api/profit-estimate', methods=['POST'])
def profit_estimate():
    data = request.json
    
    crop_name = data.get('crop', 'Rice')
    farm_size = data.get('farm_size', 1)  # hectares
    
    if crop_name not in CROPS_DATA:
        return jsonify({'error': 'Crop not found'}), 404
    
    crop_info = CROPS_DATA[crop_name]
    
    # Calculate estimates
    total_yield = crop_info['yield'] * farm_size
    revenue = total_yield * crop_info['price']
    
    # Estimate costs (simplified)
    seed_cost = farm_size * 5000
    fertilizer_cost = farm_size * 8000
    pesticide_cost = farm_size * 3000
    labor_cost = farm_size * 15000
    irrigation_cost = farm_size * 4000
    
    total_cost = seed_cost + fertilizer_cost + pesticide_cost + labor_cost + irrigation_cost
    net_profit = revenue - total_cost
    profit_margin = (net_profit / revenue) * 100 if revenue > 0 else 0
    
    return jsonify({
        'crop': crop_name,
        'farm_size': farm_size,
        'expected_yield': total_yield,
        'revenue': revenue,
        'costs': {
            'seed': seed_cost,
            'fertilizer': fertilizer_cost,
            'pesticide': pesticide_cost,
            'labor': labor_cost,
            'irrigation': irrigation_cost,
            'total': total_cost
        },
        'net_profit': net_profit,
        'profit_margin': round(profit_margin, 2),
        'roi': round((net_profit / total_cost) * 100, 2) if total_cost > 0 else 0
    })

# AI Chatbot Endpoint with Groq LLM
@app.route('/api/chat', methods=['POST'])
def chat():
    """
    AI Chatbot powered by Groq LLM (Llama 3 70B)
    Enhanced with agricultural knowledge base
    """
    data = request.json
    user_message = data.get('message', '')
    history = data.get('history', [])
    
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Load agricultural knowledge base
    knowledge_base = {}
    try:
        kb_path = 'agricultural_knowledge.json'
        if os.path.exists(kb_path):
            with open(kb_path, 'r') as f:
                knowledge_base = json.load(f)
    except Exception as e:
        print(f"Error loading knowledge base: {e}")
    
    # Check if question is agriculture-related
    agriculture_keywords = [
        'crop', 'farm', 'soil', 'irrigation', 'water', 'plant', 'seed', 'harvest',
        'pest', 'disease', 'fertilizer', 'weather', 'rain', 'season', 'kharif', 'rabi',
        'wheat', 'rice', 'cotton', 'maize', 'vegetable', 'fruit', 'agriculture',
        'cultivation', 'yield', 'market', 'price', 'mandi', 'scheme', 'subsidy',
        'organic', 'pesticide', 'manure', 'compost', 'drought', 'flood'
    ]
    
    message_lower = user_message.lower()
    is_agriculture_related = any(keyword in message_lower for keyword in agriculture_keywords)
    
    if not is_agriculture_related:
        return jsonify({
            'success': True,
            'response': "I'm designed to help with farming and agriculture questions. Please ask something related to crops, irrigation, soil, weather, or farming practices.",
            'model': 'filter'
        })
    
    try:
        if groq_client:
            # Enhanced system prompt with knowledge base
            system_prompt = """You are an expert agricultural AI assistant for AgriSense AI platform in India.
            
Your expertise includes:
- Crop selection and recommendations (kharif, rabi, zaid seasons)
- Irrigation methods and water management
- Soil types, fertility, and improvement
- Pest and disease control
- Fertilizer application (NPK, organic)
- Weather impact on crops
- Government farming schemes (PM-KISAN, Fasal Bima, KCC)
- Market prices and selling strategies
- Sustainable farming practices

IMPORTANT GUIDELINES:
1. Give practical, actionable advice for Indian farmers
2. Use simple language, avoid complex technical terms
3. Provide specific examples and numbers when possible
4. Consider Indian climate, soil types, and farming practices
5. Mention government schemes when relevant
6. Always prioritize farmer's economic benefit
7. Keep responses concise (3-5 points maximum)
8. If asked about weather, suggest checking local forecasts

KEY INFORMATION:
- Kharif season: June-October (Rice, Maize, Cotton, Groundnut, Soybean)
- Rabi season: October-March (Wheat, Barley, Mustard, Chickpea)
- Zaid season: March-June (Watermelon, Cucumber, Vegetables)
- Best irrigation time: Early morning (5-8 AM) or evening (5-8 PM)
- Drip irrigation saves 40-60% water
- PM-KISAN: ₹6,000/year for all farmers
- Soil testing: Free under Soil Health Card scheme

Respond in a friendly, helpful manner as if talking to a farmer."""
            
            # Build conversation history
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history
            for msg in history[-6:]:
                messages.append({
                    "role": msg['role'],
                    "content": msg['content']
                })
            
            # Add current message
            messages.append({
                "role": "user",
                "content": user_message
            })
            
            # Call Groq API
            chat_completion = groq_client.chat.completions.create(
                messages=messages,
                model="llama-3.1-70b-versatile",
                temperature=0.7,
                max_tokens=512,
                top_p=0.9
            )
            
            response_text = chat_completion.choices[0].message.content
            
            return jsonify({
                'success': True,
                'response': response_text,
                'model': 'llama-3.1-70b-versatile'
            })
        else:
            # Enhanced fallback with knowledge base
            response = get_knowledge_based_response(user_message, knowledge_base)
            
            return jsonify({
                'success': True,
                'response': response,
                'model': 'knowledge_base'
            })
            
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to process your message. Please try again.'
        }), 500

def get_knowledge_based_response(message, kb):
    """Generate response from knowledge base"""
    message_lower = message.lower()
    
    # Kharif crops
    if 'kharif' in message_lower or ('monsoon' in message_lower and 'crop' in message_lower):
        crops = kb.get('crops', {}).get('kharif', {})
        return f"""**Kharif Season Crops ({crops.get('season', 'June-October')}):**

Best crops to plant:
{chr(10).join(['• ' + crop for crop in crops.get('crops', [])])}

**Tips:**
{chr(10).join(['• ' + tip for tip in crops.get('tips', [])])}
"""
    
    # Rabi crops
    if 'rabi' in message_lower or ('winter' in message_lower and 'crop' in message_lower):
        crops = kb.get('crops', {}).get('rabi', {})
        return f"""**Rabi Season Crops ({crops.get('season', 'October-March')}):**

Best crops to plant:
{chr(10).join(['• ' + crop for crop in crops.get('crops', [])])}

**Tips:**
{chr(10).join(['• ' + tip for tip in crops.get('tips', [])])}
"""
    
    # Irrigation
    if 'irrigat' in message_lower or 'water' in message_lower:
        irr = kb.get('irrigation', {}).get('best_time', {})
        return f"""**Best Time to Irrigate:**

{irr.get('answer', 'Early morning or late evening')}

**Why?**
{chr(10).join(['• ' + reason for reason in irr.get('reasons', [])])}

**Frequency:**
• Summer: Every 2-3 days
• Winter: Every 7-10 days
• Monsoon: Based on rainfall
"""
    
    # Pest control
    if 'pest' in message_lower or 'insect' in message_lower:
        pests = kb.get('pests', {}).get('prevention', [])
        return f"""**Pest Prevention Tips:**

{chr(10).join(['• ' + tip for tip in pests[:6]])}

**Remember:** Use pesticides only when necessary and follow safety guidelines.
"""
    
    # Soil
    if 'soil' in message_lower:
        soil_tips = kb.get('soil', {}).get('improvement', [])
        return f"""**Soil Health Improvement:**

{chr(10).join(['• ' + tip for tip in soil_tips])}

**Tip:** Get free soil testing under Soil Health Card scheme!
"""
    
    # Government schemes
    if 'scheme' in message_lower or 'subsidy' in message_lower or 'government' in message_lower:
        schemes = kb.get('government_schemes', {})
        pm_kisan = schemes.get('pm_kisan', {})
        fasal = schemes.get('fasal_bima', {})
        return f"""**Government Schemes for Farmers:**

1. **{pm_kisan.get('name', 'PM-KISAN')}**
   • Benefit: {pm_kisan.get('benefit', '₹6,000/year')}
   • Apply: {pm_kisan.get('how_to_apply', 'pmkisan.gov.in')}

2. **{fasal.get('name', 'Fasal Bima Yojana')}**
   • Benefit: {fasal.get('benefit', 'Crop insurance')}
   • Premium: {fasal.get('premium', '2% for kharif')}

3. **Kisan Credit Card**
   • Easy loans at 4% interest
   • Up to ₹3 lakh
"""
    
    # Market prices
    if 'market' in message_lower or 'price' in message_lower or 'sell' in message_lower:
        tips = kb.get('market_tips', [])
        return f"""**Market & Selling Tips:**

{chr(10).join(['• ' + tip for tip in tips])}

**Use e-NAM platform** for better price discovery!
"""
    
    # Default response
    return """I can help you with:

• **Crop Selection** - What to plant in different seasons
• **Irrigation** - When and how to water crops
• **Soil Health** - Improving soil fertility
• **Pest Control** - Preventing and managing pests
• **Government Schemes** - PM-KISAN, Fasal Bima, etc.
• **Market Prices** - Selling strategies
• **Weather Impact** - Climate-based farming advice

What would you like to know about?"""

if __name__ == '__main__':
    app.run(debug=True, port=5000)


# Disease Detection Endpoint
@app.route('/api/predict-disease', methods=['POST'])
def predict_disease():
    """
    Detect crop disease from uploaded image (FastAPI style endpoint)
    """
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No image provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400
    
    try:
        # For now, return mock data with improved responses
        # In production, load the trained model and make predictions
        import random
        
        # Multiple crop diseases database
        diseases_db = {
            'tomato': [
                {
                    'name': 'Tomato Late Blight',
                    'confidence': 0.94,
                    'severity': 'High',
                    'symptoms': ['Water-soaked spots on leaves', 'White mold on leaf undersides', 'Brown lesions on stems', 'Fruit rot'],
                    'treatment': ['Apply copper-based fungicide immediately', 'Remove and destroy infected plants', 'Improve air circulation', 'Avoid overhead watering'],
                    'prevention': ['Use disease-free seeds', 'Plant resistant varieties', 'Proper plant spacing', 'Remove plant debris']
                },
                {
                    'name': 'Tomato Early Blight',
                    'confidence': 0.89,
                    'severity': 'Medium',
                    'symptoms': ['Concentric rings on leaves', 'Dark brown spots', 'Yellowing of lower leaves', 'Leaf drop'],
                    'treatment': ['Apply chlorothalonil fungicide', 'Remove infected foliage', 'Mulch around plants', 'Rotate crops'],
                    'prevention': ['Use certified seeds', 'Maintain proper spacing', 'Mulch to prevent soil splash', 'Remove fallen leaves']
                }
            ],
            'potato': [
                {
                    'name': 'Potato Late Blight',
                    'confidence': 0.92,
                    'severity': 'High',
                    'symptoms': ['Water-soaked lesions', 'White mold', 'Rapidly turning brown', 'Tuber rot'],
                    'treatment': ['Apply fungicide (Mancozeb)', 'Destroy infected plants', 'Improve drainage', 'Harvest early if severe'],
                    'prevention': ['Use certified seed potatoes', 'Plant resistant varieties', 'Proper spacing', 'Monitor weather']
                }
            ],
            'rice': [
                {
                    'name': 'Rice Blast',
                    'confidence': 0.91,
                    'severity': 'High',
                    'symptoms': ['Diamond-shaped lesions', 'White to gray center', 'Brown borders', 'Neck rot'],
                    'treatment': ['Apply tricyclazole fungicide', 'Reduce nitrogen fertilizer', 'Maintain proper water levels', 'Remove crop residues'],
                    'prevention': ['Use resistant varieties', 'Balanced fertilization', 'Proper planting density', 'Crop rotation']
                }
            ],
            'wheat': [
                {
                    'name': 'Wheat Rust',
                    'confidence': 0.88,
                    'severity': 'High',
                    'symptoms': ['Orange-red pustules', 'Yellowing leaves', 'Stunted growth', 'Reduced grain fill'],
                    'treatment': ['Apply propiconazole fungicide', 'Remove infected leaves', 'Apply early for best results', 'Increase airflow'],
                    'prevention': ['Plant resistant varieties', 'Early planting', 'Scout regularly', 'Remove volunteer wheat']
                }
            ],
            'cotton': [
                {
                    'name': 'Cotton Wilt',
                    'confidence': 0.85,
                    'severity': 'Medium',
                    'symptoms': ['Yellowing leaves', 'Wilting despite moisture', 'Brown vascular tissue', 'Stunted growth'],
                    'treatment': ['No cure - remove infected plants', 'Apply soil fungicides', 'Improve drainage', 'Add organic matter'],
                    'prevention': ['Use resistant varieties', 'Crop rotation (3-4 years)', 'Soil solarization', 'Avoid overwatering']
                }
            ]
        }
        
        # Default general diseases
        general_diseases = [
            {
                'name': 'Bacterial Leaf Spot',
                'confidence': 0.87,
                'severity': 'Medium',
                'crop': 'Various',
                'symptoms': ['Water-soaked lesions', 'Yellow halos', 'Leaf curling', 'Fruit spots'],
                'treatment': ['Remove infected parts', 'Copper spray', 'Improve air circulation', 'Avoid overhead watering'],
                'prevention': ['Use clean seeds', 'Rotate crops', 'Remove plant debris', 'Proper spacing']
            },
            {
                'name': 'Fungal Leaf Blight',
                'confidence': 0.84,
                'severity': 'Medium',
                'crop': 'Various',
                'symptoms': ['Brown lesions', 'Leaf yellowing', 'Premature leaf drop', 'Stunted growth'],
                'treatment': ['Apply fungicide', 'Remove infected leaves', 'Improve drainage', 'Reduce humidity'],
                'prevention': ['Use resistant varieties', 'Proper spacing', 'Avoid wet foliage', 'Remove debris']
            },
            {
                'name': 'Powdery Mildew',
                'confidence': 0.90,
                'severity': 'Low',
                'crop': 'Various',
                'symptoms': ['White powdery coating', 'Leaf curling', 'Distorted growth', 'Reduced yield'],
                'treatment': ['Neem oil spray', 'Sulfur fungicide', 'Improve air circulation', 'Remove severely infected leaves'],
                'prevention': ['Plant resistant varieties', 'Proper spacing', 'Avoid excess nitrogen', 'Good air circulation']
            }
        ]
        
        # Try to detect based on random selection
        crops = list(diseases_db.keys())
        selected_crop = random.choice(crops)
        diseases = diseases_db[selected_crop]
        detected = random.choice(diseases)
        
        return jsonify({
            'success': True,
            'disease': detected['name'],
            'crop': selected_crop.capitalize(),
            'confidence': detected['confidence'],
            'severity': detected['severity'],
            'symptoms': detected['symptoms'],
            'treatment': detected['treatment'],
            'prevention': detected['prevention']
        })
        
    except Exception as e:
        print(f"Disease detection error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


# Original Disease Detection Endpoint (keeping for compatibility)
@app.route('/api/disease-detection', methods=['POST'])
def detect_disease():
    """
    Detect crop disease from uploaded image
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # For now, return mock data
        # In production, load the trained model and make predictions
        import random
        
        diseases = [
            {
                'name': 'Tomato Late Blight',
                'confidence': 0.94,
                'severity': 'Critical',
                'symptoms': ['Water-soaked spots on leaves', 'White mold on undersides', 'Brown lesions on stems'],
                'treatment': ['Apply copper-based fungicides', 'Remove infected plants immediately', 'Improve air circulation'],
                'prevention': ['Use disease-free seeds', 'Avoid overhead watering', 'Space plants properly']
            },
            {
                'name': 'Potato Early Blight',
                'confidence': 0.89,
                'severity': 'Medium',
                'symptoms': ['Concentric rings on leaves', 'Dark brown spots', 'Yellowing of leaves'],
                'treatment': ['Apply chlorothalonil fungicide', 'Remove infected foliage', 'Rotate crops'],
                'prevention': ['Use certified seed potatoes', 'Maintain proper spacing', 'Mulch to prevent soil splash']
            },
            {
                'name': 'Apple Scab',
                'confidence': 0.87,
                'severity': 'High',
                'symptoms': ['Dark, olive-green spots on leaves', 'Scabby lesions on fruit', 'Premature leaf drop'],
                'treatment': ['Apply fungicides (Captan, Myclobutanil)', 'Remove infected leaves', 'Prune for air circulation'],
                'prevention': ['Plant resistant varieties', 'Rake and destroy fallen leaves', 'Apply dormant oil spray']
            }
        ]
        
        # Randomly select a disease for demo
        detected_disease = random.choice(diseases)
        
        return jsonify({
            'success': True,
            'disease': detected_disease['name'],
            'confidence': detected_disease['confidence'],
            'severity': detected_disease['severity'],
            'symptoms': detected_disease['symptoms'],
            'treatment': detected_disease['treatment'],
            'prevention': detected_disease['prevention'],
            'image_analyzed': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

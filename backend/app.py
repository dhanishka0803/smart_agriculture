from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
import os
import json

app = Flask(__name__)
CORS(app)

# Configuration
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY', 'your_api_key_here')
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')

# No database or ML model needed for demo

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)

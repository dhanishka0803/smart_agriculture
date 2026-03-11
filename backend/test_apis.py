#!/usr/bin/env python3
"""
API Testing Script for AgriSense AI
Tests all backend endpoints to ensure they're working correctly
"""

import requests
import json
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:5000"  # Change to your Render URL for production
# BACKEND_URL = "https://your-backend.onrender.com"

def print_test_header(test_name):
    print(f"\n{'='*60}")
    print(f"🧪 Testing: {test_name}")
    print(f"{'='*60}")

def print_result(success, message):
    icon = "✅" if success else "❌"
    print(f"{icon} {message}")

def test_health():
    """Test health check endpoint"""
    print_test_header("Health Check")
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_result(True, f"Backend is healthy")
            print(f"   Timestamp: {data.get('timestamp')}")
            return True
        else:
            print_result(False, f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return False

def test_weather():
    """Test weather API endpoint"""
    print_test_header("Weather API")
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/weather",
            params={"lat": "11.0168", "lon": "76.9558"},
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            current = data.get('current', {})
            forecast = data.get('forecast', [])
            
            print_result(True, "Weather data retrieved")
            print(f"   Current Temp: {current.get('temp')}°C")
            print(f"   Humidity: {current.get('humidity')}%")
            print(f"   Wind Speed: {current.get('wind_speed')} km/h")
            print(f"   Description: {current.get('description')}")
            print(f"   Forecast Days: {len(forecast)}")
            
            if len(forecast) > 0:
                print(f"   Tomorrow: {forecast[0].get('temp_max')}°C / {forecast[0].get('temp_min')}°C")
            
            return True
        else:
            print_result(False, f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return False

def test_crop_recommendation():
    """Test crop recommendation endpoint"""
    print_test_header("Crop Recommendation")
    try:
        payload = {
            "soil_type": "loamy",
            "temperature": 28,
            "humidity": 65,
            "rainfall": 1200,
            "season": "kharif"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/crop-recommendation",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            recommendations = data.get('recommendations', [])
            
            print_result(True, f"Got {len(recommendations)} crop recommendations")
            for i, crop in enumerate(recommendations, 1):
                print(f"   {i}. {crop.get('crop')} - {crop.get('confidence')*100:.0f}% confidence")
                print(f"      Growth: {crop.get('growth_days')} days")
                print(f"      Yield: {crop.get('expected_yield')} kg/hectare")
            
            return True
        else:
            print_result(False, f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return False

def test_alerts():
    """Test climate alerts endpoint"""
    print_test_header("Climate Alerts")
    try:
        payload = {
            "forecast": [
                {"temp_max": 38, "temp_min": 25, "rainfall": 0},
                {"temp_max": 39, "temp_min": 26, "rainfall": 0},
                {"temp_max": 40, "temp_min": 27, "rainfall": 0}
            ],
            "current_temp": 35
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/alerts",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            alerts = data.get('alerts', [])
            
            print_result(True, f"Generated {len(alerts)} alerts")
            for alert in alerts:
                print(f"   🚨 {alert.get('title')} ({alert.get('severity')})")
                print(f"      {alert.get('message')}")
            
            return True
        else:
            print_result(False, f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return False

def test_irrigation():
    """Test irrigation advice endpoint"""
    print_test_header("Irrigation Advice")
    try:
        payload = {
            "soil_moisture": 35,
            "rainfall_forecast": 0,
            "crop_type": "Rice",
            "temperature": 32
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/irrigation-advice",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            
            print_result(True, "Irrigation advice generated")
            print(f"   Irrigate: {data.get('irrigate')}")
            print(f"   Message: {data.get('message')}")
            print(f"   Water Amount: {data.get('water_amount')}mm")
            print(f"   Next Irrigation: {data.get('next_irrigation')}")
            
            return True
        else:
            print_result(False, f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return False

def test_profit_estimate():
    """Test profit estimation endpoint"""
    print_test_header("Profit Estimation")
    try:
        payload = {
            "crop": "Rice",
            "farm_size": 2
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/profit-estimate",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            
            print_result(True, "Profit estimate calculated")
            print(f"   Crop: {data.get('crop')}")
            print(f"   Farm Size: {data.get('farm_size')} hectares")
            print(f"   Expected Yield: {data.get('expected_yield')} kg")
            print(f"   Revenue: ₹{data.get('revenue'):,}")
            print(f"   Total Costs: ₹{data.get('costs', {}).get('total'):,}")
            print(f"   Net Profit: ₹{data.get('net_profit'):,}")
            print(f"   ROI: {data.get('roi')}%")
            
            return True
        else:
            print_result(False, f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return False

def test_chatbot():
    """Test AI chatbot endpoint"""
    print_test_header("AI Chatbot")
    try:
        payload = {
            "message": "Which crop should I grow in monsoon season?",
            "history": []
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/chat",
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('success'):
                print_result(True, "Chatbot responded")
                print(f"   Model: {data.get('model')}")
                print(f"   Response: {data.get('response')[:100]}...")
                return True
            else:
                print_result(False, f"Error: {data.get('error')}")
                return False
        else:
            print_result(False, f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return False

def test_crop_timeline():
    """Test crop timeline endpoint"""
    print_test_header("Crop Timeline")
    try:
        response = requests.get(
            f"{BACKEND_URL}/api/crop-timeline/Rice",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            timeline = data.get('timeline', [])
            
            print_result(True, f"Timeline for {data.get('crop')}")
            print(f"   Total Days: {data.get('total_days')}")
            for stage in timeline:
                print(f"   {stage.get('stage')}: {stage.get('days')} days (Day {stage.get('start_day')}-{stage.get('end_day')})")
            
            return True
        else:
            print_result(False, f"Status code: {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Error: {str(e)}")
        return False

def run_all_tests():
    """Run all API tests"""
    print("\n" + "="*60)
    print("🚀 AgriSense AI - API Testing Suite")
    print("="*60)
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests = [
        ("Health Check", test_health),
        ("Weather API", test_weather),
        ("Crop Recommendation", test_crop_recommendation),
        ("Crop Timeline", test_crop_timeline),
        ("Climate Alerts", test_alerts),
        ("Irrigation Advice", test_irrigation),
        ("Profit Estimation", test_profit_estimate),
        ("AI Chatbot", test_chatbot)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print_result(False, f"Test crashed: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 Test Summary")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        icon = "✅" if result else "❌"
        print(f"{icon} {test_name}")
    
    print(f"\n{'='*60}")
    print(f"Results: {passed}/{total} tests passed ({passed/total*100:.0f}%)")
    print(f"{'='*60}\n")
    
    if passed == total:
        print("🎉 All tests passed! Your API is fully functional!")
    elif passed >= total * 0.7:
        print("⚠️  Most tests passed. Check failed tests above.")
    else:
        print("❌ Many tests failed. Check your backend configuration.")

if __name__ == "__main__":
    run_all_tests()

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, Droplets, Wind, Gauge, Eye, Sunrise, Sunset, MapPin, Search, AlertTriangle, Sprout, TrendingUp, CloudRain, Sun, Thermometer, RefreshCw, Loader } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { weatherService } from '../services/api';

function Weather() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: 11.0168, lon: 76.9558, name: 'Coimbatore, Tamil Nadu' });
  const [searchCity, setSearchCity] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWeather();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [location]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getWeather(location.lat, location.lon);
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Weather data unavailable. Please try again.');
      // Set fallback data
      setWeather({
        current: {
          temp: 28.5,
          feels_like: 30.2,
          humidity: 65,
          pressure: 1013,
          wind_speed: 12.5,
          description: 'partly cloudy',
          icon: '02d'
        },
        forecast: [
          { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], temp_max: 32, temp_min: 22, humidity: 60, rainfall: 0, description: 'clear sky', icon: '01d' },
          { date: new Date(Date.now() + 172800000).toISOString().split('T')[0], temp_max: 33, temp_min: 23, humidity: 62, rainfall: 0, description: 'few clouds', icon: '02d' },
          { date: new Date(Date.now() + 259200000).toISOString().split('T')[0], temp_max: 31, temp_min: 21, humidity: 68, rainfall: 5, description: 'light rain', icon: '10d' },
          { date: new Date(Date.now() + 345600000).toISOString().split('T')[0], temp_max: 30, temp_min: 22, humidity: 70, rainfall: 2, description: 'scattered clouds', icon: '03d' },
          { date: new Date(Date.now() + 432000000).toISOString().split('T')[0], temp_max: 32, temp_min: 23, humidity: 65, rainfall: 0, description: 'clear sky', icon: '01d' },
          { date: new Date(Date.now() + 518400000).toISOString().split('T')[0], temp_max: 34, temp_min: 24, humidity: 58, rainfall: 0, description: 'clear sky', icon: '01d' },
          { date: new Date(Date.now() + 604800000).toISOString().split('T')[0], temp_max: 33, temp_min: 23, humidity: 60, rainfall: 0, description: 'few clouds', icon: '02d' }
        ]
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWeather();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setLocation({ ...location, name: searchCity });
      setSearchCity('');
    }
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'Current Location'
          });
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  };

  const getClimateAlerts = () => {
    if (!weather) return [];
    const alerts = [];
    const forecast = weather.forecast;
    
    const maxRainfall = Math.max(...forecast.map(d => d.rainfall));
    if (maxRainfall > 50) {
      alerts.push({ type: 'danger', icon: CloudRain, title: 'Heavy Rainfall Warning', message: `Expected rainfall: ${maxRainfall}mm. Risk of flooding.` });
    }
    
    const maxTemp = Math.max(...forecast.map(d => d.temp_max));
    if (maxTemp > 38) {
      alerts.push({ type: 'warning', icon: Sun, title: 'Heat Wave Alert', message: `Temperature may reach ${maxTemp}°C. Crops may stress.` });
    }
    
    const maxWind = weather.current.wind_speed;
    if (maxWind > 40) {
      alerts.push({ type: 'warning', icon: Wind, title: 'High Wind Alert', message: `Wind speed: ${maxWind} km/h. Secure crops.` });
    }
    
    const totalRain = forecast.reduce((sum, d) => sum + d.rainfall, 0);
    if (totalRain < 5) {
      alerts.push({ type: 'warning', icon: Droplets, title: 'Drought Risk', message: 'Low rainfall expected. Plan irrigation.' });
    }
    
    if (alerts.length === 0) {
      alerts.push({ type: 'safe', icon: Cloud, title: 'Weather Conditions Normal', message: 'No immediate weather risks detected.' });
    }
    
    return alerts;
  };

  const getFarmingInsights = () => {
    if (!weather) return [];
    const insights = [];
    const current = weather.current;
    const forecast = weather.forecast;
    
    if (current.temp > 30 && current.humidity < 50) {
      insights.push({ icon: Droplets, text: 'Good day for irrigation - High temperature and low humidity', color: 'text-blue-600' });
    }
    
    const rainToday = forecast[0]?.rainfall > 5;
    if (rainToday) {
      insights.push({ icon: AlertTriangle, text: 'Avoid spraying pesticides today due to expected rain', color: 'text-yellow-600' });
    }
    
    if (current.temp > 35) {
      insights.push({ icon: Thermometer, text: 'High temperature may stress crops - Provide shade if possible', color: 'text-red-600' });
    }
    
    if (current.temp >= 20 && current.temp <= 30 && current.humidity >= 50 && current.humidity <= 70) {
      insights.push({ icon: Sprout, text: 'Ideal conditions for crop growth today', color: 'text-green-600' });
    }
    
    const avgTemp = forecast.reduce((sum, d) => sum + d.temp_max, 0) / forecast.length;
    if (avgTemp > 25 && avgTemp < 32) {
      insights.push({ icon: TrendingUp, text: 'Weather suitable for rice, cotton, and maize cultivation', color: 'text-primary' });
    }
    
    return insights;
  };

  if (loading && !weather) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  const chartData = weather?.forecast.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    max: day.temp_max,
    min: day.temp_min,
    rainfall: day.rainfall
  }));

  const alerts = getClimateAlerts();
  const insights = getFarmingInsights();

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Cloud className="w-10 h-10 text-primary" />
              Weather Dashboard
            </h2>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">{location.name}</span>
              <span className="text-sm">• {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search city..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="input-field"
              />
              <button type="submit" className="btn-primary">
                <Search className="w-5 h-5" />
              </button>
            </form>
            <button onClick={useCurrentLocation} className="btn-secondary">
              <MapPin className="w-5 h-5" />
            </button>
            <button onClick={handleRefresh} className="btn-secondary" disabled={refreshing}>
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden h-48">
        <img 
          src="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&q=80"
          alt="Weather"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent"></div>
        <div className="absolute inset-0 flex items-center p-8">
          <div className="text-white">
            <h3 className="text-2xl font-bold">7-Day Weather Forecast</h3>
            <p className="text-green-100">Plan your farming activities with accurate weather predictions</p>
          </div>
        </div>
      </div>

      {/* Climate Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`card border-l-4 ${
            alert.type === 'danger' ? 'border-red-500 bg-red-50' :
            alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
            'border-green-500 bg-green-50'
          }`}>
            <div className="flex items-start gap-3">
              <alert.icon className={`w-6 h-6 ${
                alert.type === 'danger' ? 'text-red-600' :
                alert.type === 'warning' ? 'text-yellow-600' :
                'text-green-600'
              }`} />
              <div>
                <h4 className="font-bold text-gray-800">{alert.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Weather - Large Display */}
      <div className="card gradient-blue text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Cloud className="w-64 h-64" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-8">
          <div className="flex items-center gap-6">
            <img 
              src={`https://openweathermap.org/img/wn/${weather?.current.icon}@4x.png`}
              alt="weather"
              className="w-40 h-40 drop-shadow-lg"
            />
            <div>
              <p className="text-7xl font-bold">{weather?.current.temp}°C</p>
              <p className="text-2xl capitalize mt-2">{weather?.current.description}</p>
              <p className="text-sm opacity-90 mt-2">Feels like {weather?.current.feels_like}°C</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 hover:bg-white/30 transition-all">
              <Droplets className="w-6 h-6 mb-2" />
              <p className="text-sm opacity-90">Humidity</p>
              <p className="text-3xl font-bold">{weather?.current.humidity}%</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 hover:bg-white/30 transition-all">
              <Wind className="w-6 h-6 mb-2" />
              <p className="text-sm opacity-90">Wind Speed</p>
              <p className="text-3xl font-bold">{weather?.current.wind_speed}</p>
              <p className="text-xs opacity-75">km/h</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 hover:bg-white/30 transition-all">
              <Gauge className="w-6 h-6 mb-2" />
              <p className="text-sm opacity-90">Pressure</p>
              <p className="text-3xl font-bold">{weather?.current.pressure}</p>
              <p className="text-xs opacity-75">hPa</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 hover:bg-white/30 transition-all">
              <Sun className="w-6 h-6 mb-2" />
              <p className="text-sm opacity-90">UV Index</p>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs opacity-75">Moderate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Farming Insights */}
      <div className="card bg-gradient-to-br from-green-50 to-blue-50 border-2 border-primary">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" />
          Farming Insights
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <insight.icon className={`w-5 h-5 ${insight.color} flex-shrink-0 mt-0.5`} />
              <p className="text-sm text-gray-700">{insight.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Temperature Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="max" stroke="#2E7D32" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} name="Max Temp" />
              <Area type="monotone" dataKey="min" stroke="#4FC3F7" strokeWidth={3} name="Min Temp" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Rainfall Prediction (7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Bar dataKey="rainfall" fill="#4FC3F7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7-Day Forecast Cards */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          7-Day Forecast
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weather?.forecast.map((day, index) => (
            <div key={index} className="card bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all transform hover:-translate-y-1 text-center">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt="weather"
                className="w-12 h-12 mx-auto"
              />
              <div className="mt-2">
                <p className="text-lg font-bold text-red-600">{day.temp_max}°</p>
                <p className="text-sm text-blue-600">{day.temp_min}°</p>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3" /> {day.humidity}%
                </div>
                {day.rainfall > 0 && (
                  <div className="flex items-center justify-center gap-1 text-blue-500">
                    <CloudRain className="w-3 h-3" /> {day.rainfall}mm
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crop Suitability */}
      <div className="card bg-gradient-to-br from-primary to-green-700 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sprout className="w-6 h-6" />
          Crop Suitability Based on Weather
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <h4 className="font-bold mb-2">Highly Suitable</h4>
            <p className="text-sm">Rice, Cotton, Maize</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <h4 className="font-bold mb-2">Moderately Suitable</h4>
            <p className="text-sm">Wheat, Groundnut, Soybean</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <h4 className="font-bold mb-2">Irrigation Needed</h4>
            <p className="text-sm">Tomato, Potato, Onion</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;

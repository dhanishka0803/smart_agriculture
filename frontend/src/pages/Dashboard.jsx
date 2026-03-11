import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Cloud, Droplets, Wind, AlertTriangle, Sprout, TrendingUp, ArrowRight, Gauge, Eye, Sun, Moon, Sunrise, Sunset, Calendar, MapPin, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { weatherService, alertService } from '../services/api';

function Dashboard() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location] = useState({ lat: 11.0168, lon: 76.9558, name: 'Coimbatore, Tamil Nadu' });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Fetching dashboard data...');
      
      const weatherData = await weatherService.getWeather(location.lat, location.lon);
      console.log('Weather data:', weatherData);
      setWeather(weatherData);
      setLastUpdated(new Date());

      const alertData = await alertService.generateAlerts({
        forecast: weatherData.forecast,
        current_temp: weatherData.current.temp
      });
      console.log('Alert data:', alertData);
      setAlerts(alertData.alerts || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Weather data currently unavailable');
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
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const chartData = weather?.forecast.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    max: day.temp_max,
    min: day.temp_min,
    humidity: day.humidity
  }));

  return (
    <div className="space-y-6">
      {/* Header with Background Image */}
      <div className="relative rounded-2xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80" 
          alt="Farm" 
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/60"></div>
        <div className="relative z-10 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">{getGreeting()}! 👋</p>
              <h2 className="text-3xl font-bold mt-1">{location.name}</h2>
              <p className="text-green-100 mt-1">{formatDate(currentTime)} • {formatTime(currentTime)}</p>
            </div>
            <button
              onClick={fetchData}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-all"
              title="Refresh data"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-red-800 mb-2">Active Climate Alerts</h3>
              <div className="space-y-2">
                {alerts.slice(0, 2).map((alert, index) => (
                  <div key={index} className="text-sm text-red-700">
                    <span className="font-semibold">{alert.title}:</span> {alert.message}
                  </div>
                ))}
              </div>
              <Link to="/alerts" className="text-red-600 font-semibold text-sm mt-2 inline-flex items-center hover:text-red-800">
                View all alerts <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Current Weather - Large Display */}
      <div className="card gradient-blue text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Cloud className="w-64 h-64" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-8">
          <div className="flex items-center space-x-6">
            <img 
              src={`https://openweathermap.org/img/wn/${weather?.current.icon}@4x.png`}
              alt="weather icon"
              className="w-32 h-32"
            />
            <div>
              <p className="text-6xl font-bold">{weather?.current.temp}°C</p>
              <p className="text-xl capitalize mt-2">{weather?.current.description}</p>
              <p className="text-sm opacity-90 mt-1">{t('feelsLike') || 'Feels like'} {weather?.current.feels_like}°C</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="w-5 h-5" />
                <p className="text-sm">{t('humidity')}</p>
              </div>
              <p className="text-3xl font-bold">{weather?.current.humidity}%</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="w-5 h-5" />
                <p className="text-sm">{t('windSpeed')}</p>
              </div>
              <p className="text-3xl font-bold">{weather?.current.wind_speed}</p>
              <p className="text-xs opacity-75">km/h</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gauge className="w-5 h-5" />
                <p className="text-sm">{t('pressure')}</p>
              </div>
              <p className="text-3xl font-bold">{weather?.current.pressure}</p>
              <p className="text-xs opacity-75">hPa</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sun className="w-5 h-5" />
                <p className="text-sm">UV Index</p>
              </div>
              <p className="text-3xl font-bold">5</p>
              <p className="text-xs opacity-75">Moderate</p>
            </div>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-xs text-white/60 mt-4 text-right">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        )}
      </div>

      {/* Temperature Trend Chart */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary" />
          Temperature Trend (7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4FC3F7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4FC3F7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="max" stroke="#2E7D32" fillOpacity={1} fill="url(#colorMax)" strokeWidth={3} name="Max Temp" />
            <Area type="monotone" dataKey="min" stroke="#4FC3F7" fillOpacity={1} fill="url(#colorMin)" strokeWidth={3} name="Min Temp" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/crop-advice" className="card hover:scale-[1.02] transition-transform cursor-pointer border-2 border-transparent hover:border-primary">
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-white p-4 rounded-xl">
                <Sprout className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Get Crop Advice</h3>
                <p className="text-sm text-gray-600">AI-powered recommendations</p>
              </div>
            </div>
          </Link>

          <Link to="/irrigation" className="card hover:scale-[1.02] transition-transform cursor-pointer border-2 border-transparent hover:border-secondary">
            <div className="flex items-center space-x-4">
              <div className="bg-secondary text-white p-4 rounded-xl">
                <Droplets className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Irrigation Advisor</h3>
                <p className="text-sm text-gray-600">Smart water management</p>
              </div>
            </div>
          </Link>

          <Link to="/profit" className="card hover:scale-[1.02] transition-transform cursor-pointer border-2 border-transparent hover:border-green-600">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 text-white p-4 rounded-xl">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Profit Calculator</h3>
                <p className="text-sm text-gray-600">Estimate your income</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Detailed 7-Day Forecast */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-primary" />
          7-Day Forecast
        </h3>
        <div className="space-y-3">
          {weather?.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4 flex-1">
                <p className="font-bold text-gray-800 w-28">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt="weather icon"
                  className="w-12 h-12"
                />
                <p className="text-sm text-gray-600 capitalize flex-1">{day.description}</p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center w-16">
                  <p className="text-xs text-gray-500">High</p>
                  <p className="text-xl font-bold text-red-500">{day.temp_max}°C</p>
                </div>
                <div className="text-center w-16">
                  <p className="text-xs text-gray-500">Low</p>
                  <p className="text-xl font-bold text-blue-500">{day.temp_min}°C</p>
                </div>
                <div className="text-center w-16">
                  <Droplets className="w-4 h-4 text-secondary mx-auto" />
                  <p className="text-sm font-bold text-secondary">{day.humidity}%</p>
                </div>
                {day.rainfall > 0 && (
                  <div className="text-center w-16">
                    <p className="text-xs text-gray-500">Rain</p>
                    <p className="text-sm font-bold text-blue-500">{day.rainfall}mm</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

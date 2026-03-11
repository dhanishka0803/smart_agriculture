import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Cloud, Droplets, Wind, AlertTriangle, Sprout, TrendingUp, ArrowRight, Gauge, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { weatherService, alertService } from '../services/api';

function Dashboard() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location] = useState({ lat: 11.0168, lon: 76.9558, name: 'Coimbatore' });

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      console.log('Fetching dashboard data...');
      const weatherData = await weatherService.getWeather(location.lat, location.lon);
      console.log('Weather data:', weatherData);
      setWeather(weatherData);

      const alertData = await alertService.generateAlerts({
        forecast: weatherData.forecast,
        current_temp: weatherData.current.temp
      });
      console.log('Alert data:', alertData);
      setAlerts(alertData.alerts);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700">{error}</p>
          <button onClick={fetchData} className="btn-primary mt-4">{t('retry') || 'Retry'}</button>
        </div>
      </div>
    );
  }

  const chartData = weather?.forecast.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    max: day.temp_max,
    min: day.temp_min
  }));

  return (
    <div className="space-y-6">
      {/* Location and Time */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&q=80" alt="Farm" className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{location.name}</h2>
            <p className="text-gray-600">{formatDate(currentTime)}</p>
            <p className="text-3xl font-bold text-primary mt-2">{formatTime(currentTime)}</p>
          </div>
          <Cloud className="w-16 h-16 text-secondary" />
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
      <div className="card gradient-blue text-white">
        <div className="grid md:grid-cols-2 gap-8">
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
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="w-5 h-5" />
                <p className="text-sm">{t('humidity')}</p>
              </div>
              <p className="text-3xl font-bold">{weather?.current.humidity}%</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="w-5 h-5" />
                <p className="text-sm">{t('windSpeed')}</p>
              </div>
              <p className="text-3xl font-bold">{weather?.current.wind_speed}</p>
              <p className="text-xs">km/h</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gauge className="w-5 h-5" />
                <p className="text-sm">{t('pressure')}</p>
              </div>
              <p className="text-3xl font-bold">{weather?.current.pressure}</p>
              <p className="text-xs">hPa</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-5 h-5" />
                <p className="text-sm">{t('visibility')}</p>
              </div>
              <p className="text-3xl font-bold">{t('good')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Temperature Trend Chart */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('temperatureTrend')}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="max" stroke="#2E7D32" strokeWidth={3} name={t('maxTemp')} />
            <Line type="monotone" dataKey="min" stroke="#4FC3F7" strokeWidth={3} name={t('minTemp')} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/crop-advice" className="card hover:scale-105 transition-transform cursor-pointer border-2 border-transparent hover:border-primary">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-white p-4 rounded-lg">
              <Sprout className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{t('getCropAdvice')}</h3>
              <p className="text-sm text-gray-600">{t('aiPowered')}</p>
            </div>
          </div>
        </Link>

        <Link to="/irrigation" className="card hover:scale-105 transition-transform cursor-pointer border-2 border-transparent hover:border-secondary">
          <div className="flex items-center space-x-4">
            <div className="bg-secondary text-white p-4 rounded-lg">
              <Droplets className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{t('irrigationAdvisor')}</h3>
              <p className="text-sm text-gray-600">{t('smartWater')}</p>
            </div>
          </div>
        </Link>

        <Link to="/profit" className="card hover:scale-105 transition-transform cursor-pointer border-2 border-transparent hover:border-green-600">
          <div className="flex items-center space-x-4">
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{t('profitCalculator')}</h3>
              <p className="text-sm text-gray-600">{t('estimateIncome')}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Detailed 7-Day Forecast */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Cloud className="w-6 h-6 mr-2 text-primary" />
          {t('detailedForecast')}
        </h3>
        <div className="space-y-3">
          {weather?.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4 flex-1">
                <p className="font-bold text-gray-800 w-24">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt="weather icon"
                  className="w-16 h-16"
                />
                <p className="text-sm text-gray-600 capitalize flex-1">{day.description}</p>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500">{t('high')}</p>
                  <p className="text-2xl font-bold text-red-600">{day.temp_max}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">{t('low')}</p>
                  <p className="text-2xl font-bold text-blue-600">{day.temp_min}°C</p>
                </div>
                <div className="text-center">
                  <Droplets className="w-5 h-5 text-secondary mx-auto" />
                  <p className="text-lg font-bold text-secondary">{day.humidity}%</p>
                </div>
                {day.rainfall > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">{t('rainfall')}</p>
                    <p className="text-lg font-bold text-blue-500">{day.rainfall}mm</p>
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

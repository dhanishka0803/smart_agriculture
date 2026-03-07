import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Calendar, TrendingDown, AlertCircle } from 'lucide-react';
import { irrigationService, weatherService } from '../services/api';

function Irrigation() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    soil_moisture: 50,
    crop_type: 'Rice',
    temperature: 28,
    rainfall_forecast: 0
  });
  const [advice, setAdvice] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const data = await weatherService.getWeather(11.0168, 76.9558);
      setWeather(data);
      const totalRainfall = data.forecast.slice(0, 3).reduce((sum, day) => sum + day.rainfall, 0);
      setFormData(prev => ({
        ...prev,
        temperature: data.current.temp,
        rainfall_forecast: totalRainfall
      }));
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await irrigationService.getAdvice(formData);
      setAdvice(data);
    } catch (error) {
      console.error('Error getting irrigation advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoistureColor = (moisture) => {
    if (moisture < 30) return 'text-red-600';
    if (moisture < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMoistureStatus = (moisture) => {
    if (moisture < 30) return 'Critical - Immediate Action Required';
    if (moisture < 50) return 'Low - Irrigation Recommended';
    if (moisture < 70) return 'Adequate - Monitor Regularly';
    return 'Optimal - No Action Needed';
  };

  return (
    <div className="space-y-6">
      <div className="gradient-blue text-white rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">Smart Irrigation Advisor</h2>
        <p className="text-blue-100">Optimize water usage and save up to 40% with data-driven irrigation</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-32">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Current Conditions</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Soil Moisture Level (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.soil_moisture}
                  onChange={(e) => setFormData({...formData, soil_moisture: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Dry (0%)</span>
                  <span className={`font-bold text-lg ${getMoistureColor(formData.soil_moisture)}`}>
                    {formData.soil_moisture}%
                  </span>
                  <span className="text-gray-600">Wet (100%)</span>
                </div>
                <p className={`text-sm font-semibold mt-2 ${getMoistureColor(formData.soil_moisture)}`}>
                  {getMoistureStatus(formData.soil_moisture)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type</label>
                <select
                  value={formData.crop_type}
                  onChange={(e) => setFormData({...formData, crop_type: e.target.value})}
                  className="input-field"
                >
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Maize">Maize</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Groundnut">Groundnut</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Temperature (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                  className="input-field"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Rainfall (3 days) - mm
                </label>
                <input
                  type="number"
                  value={formData.rainfall_forecast}
                  onChange={(e) => setFormData({...formData, rainfall_forecast: parseFloat(e.target.value)})}
                  className="input-field"
                  readOnly
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full"
              >
                {loading ? 'Analyzing...' : 'Get Irrigation Advice'}
              </button>
            </form>
          </div>
        </div>

        {/* Advice Display */}
        <div className="lg:col-span-2 space-y-4">
          {!advice ? (
            <div className="card text-center py-12">
              <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter current conditions to get smart irrigation advice</p>
            </div>
          ) : (
            <>
              {/* Main Advice Card */}
              <div className={`card ${advice.irrigate ? 'border-4 border-secondary' : 'border-4 border-green-500'}`}>
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`p-4 rounded-lg ${advice.irrigate ? 'bg-secondary' : 'bg-green-500'}`}>
                    <Droplets className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{advice.message}</h3>
                    <p className="text-gray-600">{advice.reason}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-secondary" />
                      <p className="text-sm text-gray-600 font-semibold">Next Irrigation</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{advice.next_irrigation}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Droplets className="w-5 h-5 text-primary" />
                      <p className="text-sm text-gray-600 font-semibold">Water Amount</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {advice.water_amount > 0 ? `${advice.water_amount}mm` : 'Not needed'}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-purple-600" />
                      <p className="text-sm text-gray-600 font-semibold">Water Savings</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {advice.irrigate ? '0%' : '100%'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="card bg-gradient-to-br from-primary-light to-primary text-white">
                <h3 className="text-xl font-bold mb-4">💡 Smart Irrigation Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Best time to irrigate: Early morning (6-8 AM) or evening (5-7 PM)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Drip irrigation saves 30-40% more water than flood irrigation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Check soil moisture at root depth (6-8 inches) for accuracy</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Mulching reduces water evaporation by up to 50%</span>
                  </li>
                </ul>
              </div>

              {/* Weather Impact */}
              {weather && (
                <div className="card">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Weather Impact</h3>
                  <div className="space-y-3">
                    {weather.forecast.slice(0, 3).map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                            alt="weather"
                            className="w-10 h-10"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-sm text-gray-600">{day.temp_max}°C / {day.temp_min}°C</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {day.rainfall > 0 ? (
                            <div>
                              <p className="text-lg font-bold text-blue-600">{day.rainfall}mm</p>
                              <p className="text-xs text-gray-600">Rainfall expected</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No rain</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Irrigation;

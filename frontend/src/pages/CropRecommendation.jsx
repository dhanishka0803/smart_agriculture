import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, TrendingUp, Calendar, Droplets, CheckCircle, Loader, MapPin, Sun, CloudRain, Thermometer, RefreshCw } from 'lucide-react';
import { cropService, weatherService } from '../services/api';

function CropRecommendation() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    soil_type: 'loamy',
    season: 'kharif',
    temperature: 28,
    humidity: 65,
    rainfall: 800
  });
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setWeatherLoading(true);
      const weather = await weatherService.getWeather(11.0168, 76.9558);
      setFormData(prev => ({
        ...prev,
        temperature: Math.round(weather.current.temp),
        humidity: weather.current.humidity,
        rainfall: weather.forecast.reduce((sum, day) => sum + day.rainfall, 0)
      }));
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await cropService.getRecommendations(formData);
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Mock data for demo
      setRecommendations([
        {
          crop: 'Rice',
          confidence: 0.92,
          reason: 'High rainfall and suitable soil for paddy cultivation',
          growth_days: 120,
          water_requirement: 'high',
          expected_yield: 4500,
          market_price: 20,
          profit_estimate: 90000
        },
        {
          crop: 'Maize',
          confidence: 0.85,
          reason: 'Versatile crop suitable for current conditions',
          growth_days: 90,
          water_requirement: 'medium',
          expected_yield: 5000,
          market_price: 18,
          profit_estimate: 90000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const viewCropTimeline = async (cropName) => {
    try {
      const data = await cropService.getTimeline(cropName);
      setTimeline(data);
      setSelectedCrop(cropName);
    } catch (error) {
      console.error('Error fetching timeline:', error);
      // Mock timeline
      setTimeline({
        crop: cropName,
        total_days: 120,
        timeline: [
          { stage: 'Germination', days: 10, start_day: 0, end_day: 10 },
          { stage: 'Vegetative', days: 40, start_day: 10, end_day: 50 },
          { stage: 'Flowering', days: 35, start_day: 50, end_day: 85 },
          { stage: 'Maturity', days: 35, start_day: 85, end_day: 120 }
        ]
      });
      setSelectedCrop(cropName);
    }
  };

  const closeTimeline = () => {
    setTimeline(null);
    setSelectedCrop(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Image */}
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80" 
          alt="Crop Recommendation" 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary-dark/60 flex items-center">
          <div className="p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Sprout className="w-10 h-10" />
              AI Crop Recommendation
            </h2>
            <p className="text-green-100 text-lg">Get personalized crop suggestions based on your location and climate</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-32">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Enter Farm Details</h3>
              <button 
                onClick={fetchWeatherData} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh weather data"
                disabled={weatherLoading}
              >
                <RefreshCw className={`w-5 h-5 ${weatherLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Soil Type
                </label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => setFormData({...formData, soil_type: e.target.value})}
                  className="input-field"
                >
                  <option value="loamy">Loamy - Best for most crops</option>
                  <option value="clayey">Clayey - Good for rice, wheat</option>
                  <option value="sandy">Sandy - Good for groundnut, potato</option>
                  <option value="black">Black - Good for cotton, sorghum</option>
                  <option value="red">Red - Good for millets, pulses</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Season
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  className="input-field"
                >
                  <option value="kharif">Kharif (Monsoon - June to Oct)</option>
                  <option value="rabi">Rabi (Winter - Nov to Mar)</option>
                  <option value="zaid">Zaid (Summer - Mar to June)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                  className="input-field"
                  min="-10"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Humidity (%)
                </label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={(e) => setFormData({...formData, humidity: parseFloat(e.target.value)})}
                  className="input-field"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CloudRain className="w-4 h-4" />
                  Expected Rainfall (mm)
                </label>
                <input
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({...formData, rainfall: parseFloat(e.target.value)})}
                  className="input-field"
                  min="0"
                  max="5000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || weatherLoading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sprout className="w-5 h-5 inline mr-2" />
                    Get Recommendations
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          {recommendations.length === 0 ? (
            <div className="card text-center py-12">
              <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Enter your farm details to get AI-powered crop recommendations</p>
              <p className="text-sm text-gray-400">Our AI will analyze soil type, weather, and season to suggest the best crops</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-800">Recommended Crops for You</h3>
              {recommendations.map((rec, index) => (
                <div key={index} className="card border-2 border-primary hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary text-white p-3 rounded-xl">
                        <Sprout className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800">{rec.crop}</h4>
                        <p className="text-sm text-gray-600">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-primary px-4 py-2 rounded-full text-sm font-bold">
                        {(rec.confidence * 100).toFixed(0)}% Match
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <p className="text-xs text-gray-600">Growth Period</p>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{rec.growth_days} days</p>
                    </div>

                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <p className="text-xs text-gray-600">Water Need</p>
                      </div>
                      <p className="text-lg font-bold text-gray-800 capitalize">{rec.water_requirement}</p>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                        <p className="text-xs text-gray-600">Expected Yield</p>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{rec.expected_yield?.toLocaleString()} kg/ha</p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <p className="text-xs text-gray-600">Profit/acre</p>
                      </div>
                      <p className="text-lg font-bold text-gray-800">₹{rec.profit_estimate?.toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => viewCropTimeline(rec.crop)}
                    className="btn-secondary w-full"
                  >
                    View Growth Timeline
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Crop Timeline Modal */}
          {timeline && selectedCrop && (
            <div className="card bg-gradient-to-br from-primary-light to-primary text-white fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedCrop} Growth Timeline</h3>
                  <button 
                    onClick={closeTimeline}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-primary mb-6">Total Duration: {timeline.total_days} days</p>
                
                <div className="space-y-4">
                  {timeline.timeline.map((stage, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <h4 className="text-lg font-bold text-gray-800 dark:text-white">{stage.stage}</h4>
                        </div>
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                          {stage.days} days
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 ml-11">
                        Day {stage.start_day} to Day {stage.end_day}
                      </p>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={closeTimeline}
                  className="btn-primary w-full mt-6"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropRecommendation;

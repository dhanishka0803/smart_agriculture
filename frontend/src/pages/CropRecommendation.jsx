import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, TrendingUp, Calendar, Droplets, CheckCircle } from 'lucide-react';
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

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const weather = await weatherService.getWeather(11.0168, 76.9558);
      setFormData(prev => ({
        ...prev,
        temperature: weather.current.temp,
        humidity: weather.current.humidity
      }));
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await cropService.getRecommendations(formData);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="gradient-bg text-white rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">AI Crop Recommendation</h2>
        <p className="text-green-100">Get personalized crop suggestions based on your location and climate</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-32">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Enter Farm Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type</label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => setFormData({...formData, soil_type: e.target.value})}
                  className="input-field"
                >
                  <option value="loamy">Loamy</option>
                  <option value="clayey">Clayey</option>
                  <option value="sandy">Sandy</option>
                  <option value="black">Black</option>
                  <option value="red">Red</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  className="input-field"
                >
                  <option value="kharif">Kharif (Monsoon)</option>
                  <option value="rabi">Rabi (Winter)</option>
                  <option value="zaid">Zaid (Summer)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Humidity (%)</label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={(e) => setFormData({...formData, humidity: parseFloat(e.target.value)})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Rainfall (mm)</label>
                <input
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({...formData, rainfall: parseFloat(e.target.value)})}
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            </form>
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          {recommendations.length === 0 ? (
            <div className="card text-center py-12">
              <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter your farm details to get crop recommendations</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-800">Recommended Crops for You</h3>
              {recommendations.map((rec, index) => (
                <div key={index} className="card border-2 border-primary hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary text-white p-3 rounded-lg">
                        <Sprout className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800">{rec.crop}</h4>
                        <p className="text-sm text-gray-600">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-primary px-3 py-1 rounded-full text-sm font-bold">
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

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Droplets className="w-4 h-4 text-primary" />
                        <p className="text-xs text-gray-600">Water Need</p>
                      </div>
                      <p className="text-lg font-bold text-gray-800 capitalize">{rec.water_requirement}</p>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                        <p className="text-xs text-gray-600">Expected Yield</p>
                      </div>
                      <p className="text-lg font-bold text-gray-800">{rec.expected_yield} kg/ha</p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <p className="text-xs text-gray-600">Profit Estimate</p>
                      </div>
                      <p className="text-lg font-bold text-gray-800">₹{(rec.profit_estimate / 1000).toFixed(0)}K</p>
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
            <div className="card bg-gradient-to-br from-primary-light to-primary text-white">
              <h3 className="text-2xl font-bold mb-4">{selectedCrop} Growth Timeline</h3>
              <p className="mb-6 text-green-100">Total Duration: {timeline.total_days} days</p>
              
              <div className="space-y-4">
                {timeline.timeline.map((stage, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6" />
                        <h4 className="text-xl font-bold">{stage.stage}</h4>
                      </div>
                      <span className="bg-white text-primary px-3 py-1 rounded-full text-sm font-bold">
                        {stage.days} days
                      </span>
                    </div>
                    <p className="text-sm text-green-100">
                      Day {stage.start_day} to Day {stage.end_day}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropRecommendation;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, Calendar, MapPin, BarChart3, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function MarketPredictor() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    crop: '',
    quantity: '',
    location: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePrediction = () => {
    setLoading(true);
    setTimeout(() => {
      const basePrice = {
        'Rice': 2500,
        'Wheat': 2200,
        'Cotton': 6000,
        'Sugarcane': 3000,
        'Tomato': 2000,
        'Onion': 1500,
        'Potato': 1200
      }[formData.crop] || 2000;

      const currentPrice = basePrice + (Math.random() * 500 - 250);
      const predictedPrice = currentPrice + (Math.random() * 800 - 200);
      const priceChange = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(1);

      const historicalData = [];
      for (let i = 6; i >= 0; i--) {
        historicalData.push({
          month: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short' }),
          price: basePrice + (Math.random() * 1000 - 500)
        });
      }

      const futureData = [];
      for (let i = 1; i <= 3; i++) {
        futureData.push({
          month: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short' }),
          price: predictedPrice + (Math.random() * 400 - 200)
        });
      }

      const allData = [...historicalData, ...futureData];

      const bestMonth = futureData.reduce((max, item) => item.price > max.price ? item : max, futureData[0]);

      setPrediction({
        currentPrice: Math.round(currentPrice),
        predictedPrice: Math.round(predictedPrice),
        priceChange: parseFloat(priceChange),
        totalRevenue: Math.round(predictedPrice * parseInt(formData.quantity)),
        historicalData: allData,
        bestSellingTime: bestMonth.month,
        bestSellingPrice: Math.round(bestMonth.price),
        demand: Math.random() > 0.5 ? 'High' : 'Moderate',
        marketTrend: priceChange > 0 ? 'Increasing' : 'Decreasing'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('marketPredictor.title')}</h1>
            <p className="text-gray-600">{t('marketPredictor.subtitle')}</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('marketPredictor.selectCrop')}</label>
            <select
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{t('marketPredictor.chooseCrop')}</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('marketPredictor.quantity')}</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g., 1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('marketPredictor.location')}</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Chennai"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          onClick={generatePrediction}
          disabled={!formData.crop || !formData.quantity || loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? t('calculating') : t('marketPredictor.predictPrice')}
        </button>

        {/* Prediction Results */}
        {prediction && (
          <div className="mt-8 space-y-6">
            {/* Price Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">{t('marketPredictor.currentPrice')}</span>
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">₹{prediction.currentPrice}</div>
                <div className="text-sm text-gray-600">{t('marketPredictor.perQuintal')}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">{t('marketPredictor.predictedPrice')}</span>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600">₹{prediction.predictedPrice}</div>
                <div className={`text-sm font-semibold ${prediction.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {prediction.priceChange > 0 ? '+' : ''}{prediction.priceChange}% {t('marketPredictor.change')}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 font-medium">{t('marketPredictor.expectedRevenue')}</span>
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">₹{prediction.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">{formData.quantity} {t('marketPredictor.quintals')}</div>
              </div>
            </div>

            {/* Price Trend Chart */}
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('marketPredictor.priceTrend')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={prediction.historicalData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="price" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Market Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-orange-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-bold text-gray-800">{t('marketPredictor.bestTime')}</h3>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-2">{prediction.bestSellingTime}</div>
                <div className="text-gray-700">{t('marketPredictor.expectedPrice')}: ₹{prediction.bestSellingPrice}</div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border-2 border-indigo-200">
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-800">{t('marketPredictor.marketInsights')}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('marketPredictor.demand')}</span>
                    <span className="font-bold text-indigo-600">{prediction.demand}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('marketPredictor.trend')}</span>
                    <span className="font-bold text-indigo-600">{prediction.marketTrend}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">{t('marketPredictor.recommendation')}</h4>
                  <p className="text-gray-700 text-sm">
                    {prediction.priceChange > 5 
                      ? t('marketPredictor.waitToSell')
                      : prediction.priceChange < -5
                      ? t('marketPredictor.sellNow')
                      : t('marketPredictor.stablePrice')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

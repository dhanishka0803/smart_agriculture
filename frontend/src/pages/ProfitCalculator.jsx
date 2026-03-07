import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, PieChart, Calculator } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { profitService } from '../services/api';

function ProfitCalculator() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    crop: 'Rice',
    farm_size: 1
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Groundnut', 'Soybean', 'Tomato', 'Potato', 'Onion'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await profitService.getEstimate(formData);
      setEstimate(data);
    } catch (error) {
      console.error('Error calculating profit:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#2E7D32', '#4FC3F7', '#FFA726', '#AB47BC', '#EF5350'];

  const costData = estimate ? [
    { name: 'Seeds', value: estimate.costs.seed },
    { name: 'Fertilizer', value: estimate.costs.fertilizer },
    { name: 'Pesticide', value: estimate.costs.pesticide },
    { name: 'Labor', value: estimate.costs.labor },
    { name: 'Irrigation', value: estimate.costs.irrigation },
  ] : [];

  const profitData = estimate ? [
    { name: 'Revenue', amount: estimate.revenue, fill: '#2E7D32' },
    { name: 'Costs', amount: estimate.costs.total, fill: '#EF5350' },
    { name: 'Net Profit', amount: estimate.net_profit, fill: '#4FC3F7' },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">Profit Estimation Calculator</h2>
        <p className="text-green-100">Calculate expected income and make informed crop decisions</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-32">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Calculate Profit</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Crop</label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData({...formData, crop: e.target.value})}
                  className="input-field"
                >
                  {crops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Farm Size (hectares)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.farm_size}
                  onChange={(e) => setFormData({...formData, farm_size: parseFloat(e.target.value)})}
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">1 hectare = 2.47 acres</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Calculating...' : 'Calculate Profit'}
              </button>
            </form>

            {estimate && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-primary">
                <p className="text-sm text-gray-600 mb-1">Return on Investment</p>
                <p className="text-3xl font-bold text-primary">{estimate.roi}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2 space-y-4">
          {!estimate ? (
            <div className="card text-center py-12">
              <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a crop and farm size to calculate profit estimate</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="card gradient-bg text-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm opacity-90">Total Revenue</p>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold">₹{(estimate.revenue / 1000).toFixed(1)}K</p>
                  <p className="text-xs opacity-75 mt-1">Expected income from yield</p>
                </div>

                <div className="card bg-red-500 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm opacity-90">Total Costs</p>
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold">₹{(estimate.costs.total / 1000).toFixed(1)}K</p>
                  <p className="text-xs opacity-75 mt-1">Investment required</p>
                </div>

                <div className="card gradient-blue text-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm opacity-90">Net Profit</p>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold">₹{(estimate.net_profit / 1000).toFixed(1)}K</p>
                  <p className="text-xs opacity-75 mt-1">Profit margin: {estimate.profit_margin}%</p>
                </div>
              </div>

              {/* Yield Information */}
              <div className="card bg-gradient-to-br from-primary-light to-primary text-white">
                <h3 className="text-xl font-bold mb-4">Expected Yield</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-90">Total Yield</p>
                    <p className="text-4xl font-bold">{estimate.expected_yield} kg</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Farm Size</p>
                    <p className="text-4xl font-bold">{estimate.farm_size} ha</p>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown Chart */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="value" fill="#2E7D32" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Cost Table */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Cost Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cost Item</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount (₹)</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">% of Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">Seeds</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                          ₹{estimate.costs.seed.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {((estimate.costs.seed / estimate.costs.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">Fertilizer</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                          ₹{estimate.costs.fertilizer.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {((estimate.costs.fertilizer / estimate.costs.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">Pesticide</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                          ₹{estimate.costs.pesticide.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {((estimate.costs.pesticide / estimate.costs.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">Labor</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                          ₹{estimate.costs.labor.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {((estimate.costs.labor / estimate.costs.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">Irrigation</td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right font-semibold">
                          ₹{estimate.costs.irrigation.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {((estimate.costs.irrigation / estimate.costs.total) * 100).toFixed(1)}%
                        </td>
                      </tr>
                      <tr className="bg-gray-100 font-bold">
                        <td className="px-4 py-3 text-sm text-gray-900">Total Costs</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          ₹{estimate.costs.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Profit Comparison */}
              <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue vs Costs vs Profit</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${(value / 1000).toFixed(1)}K`} />
                    <Bar dataKey="amount" fill="#2E7D32">
                      {profitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfitCalculator;

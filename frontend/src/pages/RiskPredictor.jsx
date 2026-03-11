import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, TrendingDown, Shield, Activity, Cloud, Droplets, Bug, DollarSign } from 'lucide-react';

export default function RiskPredictor() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    crop: '',
    soilType: '',
    rainfall: '',
    temperature: '',
    pestHistory: 'no',
    irrigationAccess: 'yes'
  });
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRisk = () => {
    setLoading(true);
    
    setTimeout(() => {
      let totalRisk = 0;
      const factors = [];

      // Weather risk
      const temp = parseInt(formData.temperature);
      if (temp > 35 || temp < 15) {
        totalRisk += 25;
        factors.push({
          name: t('risk.weatherRisk'),
          level: 'high',
          score: 25,
          description: t('risk.weatherDesc')
        });
      } else {
        factors.push({
          name: t('risk.weatherRisk'),
          level: 'low',
          score: 5,
          description: t('risk.weatherGood')
        });
        totalRisk += 5;
      }

      // Water risk
      const rain = parseInt(formData.rainfall);
      if (rain < 500 && formData.irrigationAccess === 'no') {
        totalRisk += 30;
        factors.push({
          name: t('risk.waterRisk'),
          level: 'critical',
          score: 30,
          description: t('risk.waterDesc')
        });
      } else {
        factors.push({
          name: t('risk.waterRisk'),
          level: 'low',
          score: 8,
          description: t('risk.waterGood')
        });
        totalRisk += 8;
      }

      // Pest risk
      if (formData.pestHistory === 'yes') {
        totalRisk += 20;
        factors.push({
          name: t('risk.pestRisk'),
          level: 'medium',
          score: 20,
          description: t('risk.pestDesc')
        });
      } else {
        factors.push({
          name: t('risk.pestRisk'),
          level: 'low',
          score: 5,
          description: t('risk.pestGood')
        });
        totalRisk += 5;
      }

      // Soil risk
      const suitableSoils = {
        'Rice': ['clayey', 'loamy'],
        'Wheat': ['loamy', 'black'],
        'Cotton': ['black', 'red'],
        'Sugarcane': ['loamy', 'black']
      };

      const isSoilSuitable = suitableSoils[formData.crop]?.includes(formData.soilType);
      if (!isSoilSuitable) {
        totalRisk += 15;
        factors.push({
          name: t('risk.soilRisk'),
          level: 'medium',
          score: 15,
          description: t('risk.soilDesc')
        });
      } else {
        factors.push({
          name: t('risk.soilRisk'),
          level: 'low',
          score: 3,
          description: t('risk.soilGood')
        });
        totalRisk += 3;
      }

      // Market risk (random for demo)
      const marketRisk = Math.random() > 0.5 ? 12 : 7;
      totalRisk += marketRisk;
      factors.push({
        name: t('risk.marketRisk'),
        level: marketRisk > 10 ? 'medium' : 'low',
        score: marketRisk,
        description: marketRisk > 10 ? t('risk.marketDesc') : t('risk.marketGood')
      });

      const riskLevel = totalRisk < 30 ? 'low' : totalRisk < 60 ? 'medium' : 'high';
      const successProbability = Math.max(10, 100 - totalRisk);

      setRiskData({
        totalRisk,
        riskLevel,
        successProbability,
        factors,
        recommendations: getRecommendations(factors)
      });
      setLoading(false);
    }, 1500);
  };

  const getRecommendations = (factors) => {
    const recs = [];
    factors.forEach(f => {
      if (f.level === 'high' || f.level === 'critical') {
        if (f.name.includes('Weather') || f.name.includes('வானிலை')) {
          recs.push(t('risk.rec1'));
        }
        if (f.name.includes('Water') || f.name.includes('நீர்')) {
          recs.push(t('risk.rec2'));
        }
        if (f.name.includes('Pest') || f.name.includes('பூச்சி')) {
          recs.push(t('risk.rec3'));
        }
      }
    });
    if (recs.length === 0) recs.push(t('risk.rec4'));
    return recs;
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('risk.title')}</h1>
            <p className="text-gray-600">{t('risk.subtitle')}</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('risk.selectCrop')}</label>
            <select
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t('risk.chooseCrop')}</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('soilType')}</label>
            <select
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">{t('risk.chooseSoil')}</option>
              <option value="loamy">{t('loamy')}</option>
              <option value="clayey">{t('clayey')}</option>
              <option value="sandy">{t('sandy')}</option>
              <option value="black">{t('black')}</option>
              <option value="red">{t('red')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('risk.avgRainfall')}</label>
            <input
              type="number"
              value={formData.rainfall}
              onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
              placeholder="e.g., 800"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('risk.avgTemp')}</label>
            <input
              type="number"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              placeholder="e.g., 28"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('risk.pestHistory')}</label>
            <select
              value={formData.pestHistory}
              onChange={(e) => setFormData({ ...formData, pestHistory: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="no">{t('risk.no')}</option>
              <option value="yes">{t('risk.yes')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('risk.irrigationAccess')}</label>
            <select
              value={formData.irrigationAccess}
              onChange={(e) => setFormData({ ...formData, irrigationAccess: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="yes">{t('risk.yes')}</option>
              <option value="no">{t('risk.no')}</option>
            </select>
          </div>
        </div>

        <button
          onClick={calculateRisk}
          disabled={!formData.crop || !formData.soilType || !formData.rainfall || !formData.temperature || loading}
          className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('calculating') : t('risk.analyzeRisk')}
        </button>

        {/* Risk Results */}
        {riskData && (
          <div className="mt-8 space-y-6">
            {/* Overall Risk */}
            <div className={`p-6 rounded-xl border-2 ${getRiskColor(riskData.riskLevel)}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{t('risk.overallRisk')}</h3>
                  <p className="text-sm opacity-75">{t('risk.basedOnFactors')}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{riskData.totalRisk}%</div>
                  <div className="text-sm font-semibold uppercase">{riskData.riskLevel} {t('risk.risk')}</div>
                </div>
              </div>
              <div className="w-full bg-white/50 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${riskData.totalRisk}%`,
                    backgroundColor: riskData.riskLevel === 'low' ? '#16a34a' : riskData.riskLevel === 'medium' ? '#eab308' : '#dc2626'
                  }}
                />
              </div>
            </div>

            {/* Success Probability */}
            <div className="bg-gradient-to-r from-green-50 to-sky-50 p-6 rounded-xl border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{t('risk.successProb')}</h3>
                    <p className="text-sm text-gray-600">{t('risk.cropSuccess')}</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-green-600">{riskData.successProbability}%</div>
              </div>
            </div>

            {/* Risk Factors */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('risk.riskFactors')}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {riskData.factors.map((factor, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${getRiskColor(factor.level)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{factor.name}</h4>
                      <span className="text-lg font-bold">{factor.score}%</span>
                    </div>
                    <p className="text-sm opacity-75">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t('risk.recommendations')}</h3>
              <ul className="space-y-2">
                {riskData.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Activity className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

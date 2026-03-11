import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, TrendingUp, Droplets, Leaf } from 'lucide-react';

export default function SoilHealthScanner() {
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSoil = () => {
    setScanning(true);
    setTimeout(() => {
      const mockResults = {
        healthScore: Math.floor(Math.random() * 30) + 60,
        soilType: ['Loamy', 'Clayey', 'Sandy'][Math.floor(Math.random() * 3)],
        ph: (Math.random() * 2 + 6).toFixed(1),
        nitrogen: Math.floor(Math.random() * 40) + 40,
        phosphorus: Math.floor(Math.random() * 30) + 30,
        potassium: Math.floor(Math.random() * 35) + 35,
        organicMatter: (Math.random() * 2 + 2).toFixed(1),
        moisture: Math.floor(Math.random() * 30) + 40,
        recommendations: []
      };

      if (mockResults.ph < 6.5) {
        mockResults.recommendations.push(t('soilScanner.addLime'));
      }
      if (mockResults.nitrogen < 50) {
        mockResults.recommendations.push(t('soilScanner.addNitrogen'));
      }
      if (mockResults.organicMatter < 3) {
        mockResults.recommendations.push(t('soilScanner.addCompost'));
      }
      if (mockResults.recommendations.length === 0) {
        mockResults.recommendations.push(t('soilScanner.goodHealth'));
      }

      setResults(mockResults);
      setScanning(false);
    }, 2000);
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getNutrientStatus = (value, type) => {
    const thresholds = { nitrogen: 60, phosphorus: 50, potassium: 50 };
    if (value >= thresholds[type]) return { status: 'Good', color: 'text-green-600' };
    if (value >= thresholds[type] * 0.7) return { status: 'Moderate', color: 'text-yellow-600' };
    return { status: 'Low', color: 'text-red-600' };
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Scan className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('soilScanner.title')}</h1>
            <p className="text-gray-600">{t('soilScanner.subtitle')}</p>
          </div>
        </div>

        {/* Upload Section */}
        {!image ? (
          <div className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t('soilScanner.uploadImage')}</h3>
            <p className="text-gray-500 mb-6">{t('soilScanner.uploadDesc')}</p>
            <label className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:shadow-lg transition-all">
              <Upload className="w-5 h-5" />
              <span className="font-semibold">{t('soilScanner.chooseImage')}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="relative">
              <img src={image} alt="Soil" className="w-full h-64 object-cover rounded-xl" />
              <button
                onClick={() => { setImage(null); setResults(null); }}
                className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100"
              >
                {t('soilScanner.changeImage')}
              </button>
            </div>

            {/* Scan Button */}
            {!results && (
              <button
                onClick={analyzeSoil}
                disabled={scanning}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {scanning ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Scan className="w-5 h-5 animate-pulse" />
                    <span>{t('soilScanner.scanning')}</span>
                  </span>
                ) : (
                  t('soilScanner.analyzeSoil')
                )}
              </button>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-6">
                {/* Health Score */}
                <div className={`p-6 rounded-xl ${getHealthColor(results.healthScore)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{t('soilScanner.healthScore')}</h3>
                      <p className="text-sm opacity-75">{t('soilScanner.overallHealth')}</p>
                    </div>
                    <div className="text-5xl font-bold">{results.healthScore}/100</div>
                  </div>
                </div>

                {/* Soil Properties */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('soilScanner.soilType')}</span>
                      <span className="font-bold text-gray-800">{results.soilType}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('soilScanner.phLevel')}</span>
                      <span className="font-bold text-gray-800">{results.ph}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('soilScanner.organicMatter')}</span>
                      <span className="font-bold text-gray-800">{results.organicMatter}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{t('soilScanner.moisture')}</span>
                      <span className="font-bold text-gray-800">{results.moisture}%</span>
                    </div>
                  </div>
                </div>

                {/* Nutrients */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{t('soilScanner.nutrientLevels')}</h3>
                  <div className="space-y-4">
                    {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => {
                      const status = getNutrientStatus(results[nutrient], nutrient);
                      return (
                        <div key={nutrient}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700 capitalize">{t(`soilScanner.${nutrient}`)}</span>
                            <span className={`font-bold ${status.color}`}>{results[nutrient]}% - {status.status}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                              style={{ width: `${results[nutrient]}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{t('soilScanner.recommendations')}</h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

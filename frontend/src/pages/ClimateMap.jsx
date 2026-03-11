import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, MapPin, Thermometer, Droplets, Wind, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ClimateMap() {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchLocation, setSearchLocation] = useState('');

  const regions = [
    {
      id: 1,
      name: 'Tamil Nadu',
      climate: 'Tropical',
      avgTemp: 28,
      avgRainfall: 925,
      soilTypes: ['Red', 'Black', 'Alluvial'],
      suitableCrops: ['Rice', 'Sugarcane', 'Cotton', 'Groundnut', 'Millets'],
      unsuitable: ['Wheat', 'Barley'],
      bestSeason: 'Kharif & Rabi'
    },
    {
      id: 2,
      name: 'Punjab',
      climate: 'Semi-Arid',
      avgTemp: 24,
      avgRainfall: 650,
      soilTypes: ['Alluvial', 'Loamy'],
      suitableCrops: ['Wheat', 'Rice', 'Cotton', 'Maize', 'Sugarcane'],
      unsuitable: ['Coconut', 'Rubber'],
      bestSeason: 'Rabi & Kharif'
    },
    {
      id: 3,
      name: 'Maharashtra',
      climate: 'Tropical Monsoon',
      avgTemp: 27,
      avgRainfall: 1200,
      soilTypes: ['Black', 'Red', 'Laterite'],
      suitableCrops: ['Cotton', 'Sugarcane', 'Soybean', 'Jowar', 'Bajra'],
      unsuitable: ['Tea', 'Coffee'],
      bestSeason: 'Kharif'
    },
    {
      id: 4,
      name: 'Kerala',
      climate: 'Tropical Wet',
      avgTemp: 27,
      avgRainfall: 3000,
      soilTypes: ['Laterite', 'Alluvial', 'Forest'],
      suitableCrops: ['Coconut', 'Rubber', 'Spices', 'Tea', 'Coffee'],
      unsuitable: ['Wheat', 'Barley', 'Millets'],
      bestSeason: 'Year-round'
    },
    {
      id: 5,
      name: 'Rajasthan',
      climate: 'Arid',
      avgTemp: 27,
      avgRainfall: 400,
      soilTypes: ['Sandy', 'Alluvial'],
      suitableCrops: ['Bajra', 'Jowar', 'Pulses', 'Mustard', 'Cotton'],
      unsuitable: ['Rice', 'Sugarcane'],
      bestSeason: 'Kharif & Rabi'
    },
    {
      id: 6,
      name: 'West Bengal',
      climate: 'Tropical Wet',
      avgTemp: 26,
      avgRainfall: 1750,
      soilTypes: ['Alluvial', 'Red', 'Laterite'],
      suitableCrops: ['Rice', 'Jute', 'Tea', 'Potato', 'Wheat'],
      unsuitable: ['Cotton', 'Millets'],
      bestSeason: 'Kharif & Rabi'
    }
  ];

  const getClimateColor = (climate) => {
    switch (climate) {
      case 'Tropical': return 'bg-green-100 text-green-700';
      case 'Semi-Arid': return 'bg-yellow-100 text-yellow-700';
      case 'Tropical Monsoon': return 'bg-blue-100 text-blue-700';
      case 'Tropical Wet': return 'bg-cyan-100 text-cyan-700';
      case 'Arid': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRegions = searchLocation
    ? regions.filter(r => r.name.toLowerCase().includes(searchLocation.toLowerCase()))
    : regions;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
            <Map className="w-7 h-7 text-sky-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('climateMap.title')}</h1>
            <p className="text-gray-600">{t('climateMap.subtitle')}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder={t('climateMap.searchLocation')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Region Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredRegions.map((region) => (
            <div
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedRegion?.id === region.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-800">{region.name}</h3>
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getClimateColor(region.climate)}`}>
                {region.climate}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Thermometer className="w-4 h-4" />
                  <span>{region.avgTemp}°C {t('climateMap.avgTemp')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Droplets className="w-4 h-4" />
                  <span>{region.avgRainfall}mm {t('climateMap.rainfall')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed View */}
        {selectedRegion && (
          <div className="bg-gradient-to-br from-green-50 to-sky-50 rounded-2xl p-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedRegion.name} - {t('climateMap.detailedAnalysis')}</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Climate Info */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t('climateMap.climateInfo')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('climateMap.climateType')}</span>
                    <span className="font-semibold">{selectedRegion.climate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('temperature')}</span>
                    <span className="font-semibold">{selectedRegion.avgTemp}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('rainfall')}</span>
                    <span className="font-semibold">{selectedRegion.avgRainfall}mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{t('climateMap.bestSeason')}</span>
                    <span className="font-semibold">{selectedRegion.bestSeason}</span>
                  </div>
                </div>
              </div>

              {/* Soil Types */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t('climateMap.soilTypes')}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRegion.soilTypes.map((soil, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                      {soil}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suitable Crops */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">{t('climateMap.suitableCrops')}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {selectedRegion.suitableCrops.map((crop, i) => (
                  <div key={i} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800">{crop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unsuitable Crops */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-bold text-gray-800">{t('climateMap.unsuitableCrops')}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedRegion.unsuitable.map((crop, i) => (
                  <div key={i} className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-800">{crop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-6 bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">{t('climateMap.recommendation')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('climateMap.recommendationText', { region: selectedRegion.name, climate: selectedRegion.climate })}
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

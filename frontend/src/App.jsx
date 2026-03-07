import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, Sprout, AlertTriangle, Droplets, TrendingUp, Globe } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import CropRecommendation from './pages/CropRecommendation';
import Alerts from './pages/Alerts';
import Irrigation from './pages/Irrigation';
import ProfitCalculator from './pages/ProfitCalculator';
import './utils/i18n';

function App() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  const navItems = [
    { path: '/', icon: Cloud, label: t('dashboard') },
    { path: '/weather', icon: Cloud, label: t('weather') },
    { path: '/crop-advice', icon: Sprout, label: t('cropAdvice') },
    { path: '/alerts', icon: AlertTriangle, label: t('alerts') },
    { path: '/irrigation', icon: Droplets, label: t('irrigation') },
    { path: '/profit', icon: TrendingUp, label: t('profit') },
  ];

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="gradient-bg text-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sprout className="w-10 h-10" />
                <div>
                  <h1 className="text-2xl font-bold">{t('appName')}</h1>
                  <p className="text-sm text-green-100">{t('tagline')}</p>
                </div>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <select
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="bg-white text-primary px-3 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="en">English</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-[88px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:text-primary hover:bg-green-50 transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-primary"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/crop-advice" element={<CropRecommendation />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/profit" element={<ProfitCalculator />} />
          </Routes>
        </main>


      </div>
    </Router>
  );
}

export default App;

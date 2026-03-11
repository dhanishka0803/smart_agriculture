import { Link, useLocation } from 'react-router-dom';
import { Cloud, Sprout, AlertTriangle, Droplets, TrendingUp, MessageCircle, TrendingDown, Map, Scan, BarChart3, Users, Home, Settings, HelpCircle, LogOut, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Sidebar({ user, onLogout }) {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard'), color: 'text-primary' },
    { path: '/weather', icon: Cloud, label: t('weather'), color: 'text-blue-600' },
    { path: '/crop-advice', icon: Sprout, label: t('cropAdvice'), color: 'text-green-600' },
    { path: '/disease-detection', icon: Shield, label: 'Disease Detection', color: 'text-red-600' },
    { path: '/risk-predictor', icon: TrendingDown, label: t('riskPredictor'), color: 'text-orange-600' },
    { path: '/soil-scanner', icon: Scan, label: t('soilScannerLabel'), color: 'text-amber-600' },
    { path: '/climate-map', icon: Map, label: t('climateMapLabel'), color: 'text-teal-600' },
    { path: '/market-predictor', icon: BarChart3, label: t('marketPredictorLabel'), color: 'text-purple-600' },
    { path: '/alerts', icon: AlertTriangle, label: t('alerts'), color: 'text-red-600' },
    { path: '/irrigation', icon: Droplets, label: t('irrigation'), color: 'text-cyan-600' },
    { path: '/profit', icon: TrendingUp, label: t('profit'), color: 'text-emerald-600' },
    { path: '/community', icon: Users, label: t('community'), color: 'text-indigo-600' },
    { path: '/ai-chatbot', icon: MessageCircle, label: t('aiChatbot'), color: 'text-pink-600' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-40 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 gradient-bg">
        <Link to="/dashboard" className="flex items-center gap-3">
          <Sprout className="w-10 h-10 text-white" />
          <div>
            <h1 className="text-xl font-bold text-white">{t('appName')}</h1>
            <p className="text-xs text-primary-pale">{t('tagline')}</p>
          </div>
        </Link>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="p-4 border-b border-gray-200 bg-accent-cream">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-primary">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-md'
                  : 'text-gray-700 hover:bg-accent-cream hover:text-primary'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-white' : item.color}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Bottom Menu Items */}
        <div className="mt-8 pt-4 border-t border-gray-200 space-y-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-accent-cream hover:text-primary transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">{t('profile.myProfile')}</span>
          </Link>
          <Link
            to="/help"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-accent-cream hover:text-primary transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help & Support</span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t('profile.logout')}</span>
          </button>
        </div>
      </nav>

      {/* Footer in Sidebar */}
      <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-200">
        <p>© 2026 AgriSense AI</p>
        <p className="mt-1">All rights reserved</p>
      </div>
    </aside>
  );
}

export default Sidebar;

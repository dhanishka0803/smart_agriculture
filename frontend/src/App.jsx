import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, Sprout, AlertTriangle, Droplets, TrendingUp, Globe, User, LogOut, MessageCircle, TrendingDown, Map, Scan, BarChart3, Users } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import CropRecommendation from './pages/CropRecommendation';
import Alerts from './pages/Alerts';
import Irrigation from './pages/Irrigation';
import ProfitCalculator from './pages/ProfitCalculator';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AIChatbot from './pages/AIChatbot';
import RiskPredictor from './pages/RiskPredictor';
import ClimateMap from './pages/ClimateMap';
import SoilHealthScanner from './pages/SoilHealthScanner';
import MarketPredictor from './pages/MarketPredictor';
import CommunityForum from './pages/CommunityForum';
import './utils/i18n';

function ProtectedRoute({ children }) {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState('en');
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, [location]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isLandingPage = location.pathname === '/';

  const navItems = [
    { path: '/dashboard', icon: Cloud, label: t('dashboard') },
    { path: '/weather', icon: Cloud, label: t('weather') },
    { path: '/crop-advice', icon: Sprout, label: t('cropAdvice') },
    { path: '/risk-predictor', icon: TrendingDown, label: t('riskPredictor') },
    { path: '/soil-scanner', icon: Scan, label: t('soilScanner') },
    { path: '/climate-map', icon: Map, label: t('climateMap') },
    { path: '/market-predictor', icon: BarChart3, label: t('marketPredictor') },
    { path: '/alerts', icon: AlertTriangle, label: t('alerts') },
    { path: '/irrigation', icon: Droplets, label: t('irrigation') },
    { path: '/profit', icon: TrendingUp, label: t('profit') },
    { path: '/community', icon: Users, label: t('community') },
    { path: '/ai-chatbot', icon: MessageCircle, label: t('aiChatbot') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && !isLandingPage && (
        <>
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
                
                <div className="flex items-center space-x-4">
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

                  {/* User Profile */}
                  {user && (
                    <div className="relative">
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">{user.name}</span>
                      </button>

                      {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <User className="w-4 h-4" />
                            <span>{t('profile.myProfile')}</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{t('profile.logout')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
        </>
      )}

      {/* Main Content */}
      <main className={!isAuthPage && !isLandingPage ? "container mx-auto px-4 py-8" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
          <Route path="/crop-advice" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/irrigation" element={<ProtectedRoute><Irrigation /></ProtectedRoute>} />
          <Route path="/profit" element={<ProtectedRoute><ProfitCalculator /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/ai-chatbot" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
          <Route path="/risk-predictor" element={<ProtectedRoute><RiskPredictor /></ProtectedRoute>} />
          <Route path="/climate-map" element={<ProtectedRoute><ClimateMap /></ProtectedRoute>} />
          <Route path="/soil-scanner" element={<ProtectedRoute><SoilHealthScanner /></ProtectedRoute>} />
          <Route path="/market-predictor" element={<ProtectedRoute><MarketPredictor /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><CommunityForum /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

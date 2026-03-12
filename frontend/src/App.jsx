import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
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
import DiseaseDetection from './pages/DiseaseDetection';
import Notifications from './pages/Notifications';
import './utils/i18n';

function ProtectedRoute({ children }) {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLang, setCurrentLang] = useState('en');
  const [user, setUser] = useState(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
  const showLayout = !isAuthPage && !isLandingPage;

  return (
    <div className="min-h-screen">
      {showLayout && (
        <>
          <Sidebar user={user} onLogout={handleLogout} />
          <Header user={user} onLanguageChange={changeLanguage} currentLang={currentLang} />
        </>
      )}

      <main className={showLayout ? "ml-64 mt-16 min-h-screen" : ""}>
        <div className={showLayout ? "p-6" : ""}>
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
            <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
            <Route path="/risk-predictor" element={<ProtectedRoute><RiskPredictor /></ProtectedRoute>} />
            <Route path="/climate-map" element={<ProtectedRoute><ClimateMap /></ProtectedRoute>} />
            <Route path="/soil-scanner" element={<ProtectedRoute><SoilHealthScanner /></ProtectedRoute>} />
            <Route path="/market-predictor" element={<ProtectedRoute><MarketPredictor /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><CommunityForum /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          </Routes>
        </div>
        {showLayout && <Footer />}
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

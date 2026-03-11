// API Configuration for AgriSense AI
// Switch between local ML API and deployed backend

const config = {
  // For Hackathon Demo (Local ML API)
  local: {
    mlApiUrl: 'http://localhost:8000',
    backendUrl: 'http://localhost:5000',
    description: 'Use this for hackathon demo with trained model'
  },
  
  // For Production (Deployed on Render)
  production: {
    mlApiUrl: 'https://smart-agriculture-4pz4.onrender.com',
    backendUrl: 'https://smart-agriculture-4pz4.onrender.com',
    description: 'Use this for deployed version'
  }
};

// CHANGE THIS FOR YOUR DEMO
// Set to 'local' when running ML API on your laptop
// Set to 'production' when using deployed version
const CURRENT_ENV = 'local';

export const API_CONFIG = config[CURRENT_ENV];

export const getMLApiUrl = () => API_CONFIG.mlApiUrl;
export const getBackendUrl = () => API_CONFIG.backendUrl;

// Export all API URLs for direct use
export const API_URLS = {
  // Weather
  weather: `${API_CONFIG.backendUrl}/api/weather`,
  
  // Crop
  cropRecommendation: `${API_CONFIG.backendUrl}/api/crop-recommendation`,
  cropTimeline: (cropName) => `${API_CONFIG.backendUrl}/api/crop-timeline/${cropName}`,
  
  // Alerts
  alerts: `${API_CONFIG.backendUrl}/api/alerts`,
  
  // Irrigation
  irrigation: `${API_CONFIG.backendUrl}/api/irrigation-advice`,
  
  // Profit
  profit: `${API_CONFIG.backendUrl}/api/profit-estimate`,
  
  // AI Chat
  chat: `${API_CONFIG.backendUrl}/api/chat`,
  
  // Disease Detection (ML API)
  diseasePredict: `${API_CONFIG.mlApiUrl}/predict-disease`,
  
  // Health Check
  health: `${API_CONFIG.backendUrl}/api/health`
};

export default API_CONFIG;

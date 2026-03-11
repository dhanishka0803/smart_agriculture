import axios from 'axios';
import { API_URLS, getBackendUrl } from '../config/api';

// Get the backend URL from config
const API_BASE_URL = getBackendUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for all requests
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please check your connection');
    }
    if (!error.response) {
      throw new Error('Backend server is not available. Please ensure the backend is running.');
    }
    throw error;
  }
);

// ==================== Weather Service ====================
export const weatherService = {
  getWeather: async (lat = 11.0168, lon = 76.9558) => {
    try {
      const response = await api.get(`/api/weather?lat=${lat}&lon=${lon}`);
      return response.data;
    } catch (error) {
      console.error('Weather service error:', error);
      throw error;
    }
  },
};

// ==================== Crop Service ====================
export const cropService = {
  getRecommendations: async (data) => {
    const response = await api.post('/api/crop-recommendation', data);
    return response.data;
  },
  
  getTimeline: async (cropName) => {
    const response = await api.get(`/api/crop-timeline/${cropName}`);
    return response.data;
  },
};

// ==================== Alert Service ====================
export const alertService = {
  generateAlerts: async (data) => {
    const response = await api.post('/api/alerts', data);
    return response.data;
  },
};

// ==================== Irrigation Service ====================
export const irrigationService = {
  getAdvice: async (data) => {
    const response = await api.post('/api/irrigation-advice', data);
    return response.data;
  },
};

// ==================== Profit Service ====================
export const profitService = {
  getEstimate: async (data) => {
    const response = await api.post('/api/profit-estimate', data);
    return response.data;
  },
};

// ==================== Chat Service ====================
export const chatService = {
  sendMessage: async (message, history = []) => {
    const response = await api.post('/api/chat', {
      message,
      history
    });
    return response.data;
  },
};

// ==================== Disease Detection Service ====================
export const diseaseService = {
  predict: async (formData) => {
    const response = await axios.post(
      `${API_URLS.diseasePredict}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds for image processing
      }
    );
    return response.data;
  },
};

// ==================== Health Check Service ====================
export const healthService = {
  check: async () => {
    try {
      const response = await api.get('/api/health');
      return response.data;
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },
};

// ==================== Market Service ====================
export const marketService = {
  // Mock market data for demo purposes
  getMarketPrices: async () => {
    // In production, this would call an actual market API
    return {
      success: true,
      prices: [
        { crop: 'Rice (Paddy)', market: 'Coimbatore', price: 2200, unit: 'quintal', change: 2.5 },
        { crop: 'Wheat', market: 'Coimbatore', price: 2150, unit: 'quintal', change: -1.2 },
        { crop: 'Cotton', market: 'Coimbatore', price: 6200, unit: 'quintal', change: 3.8 },
        { crop: 'Tomato', market: 'Coimbatore', price: 1500, unit: 'quintal', change: -5.2 },
        { crop: 'Potato', market: 'Coimbatore', price: 1200, unit: 'quintal', change: 1.0 },
        { crop: 'Onion', market: 'Coimbatore', price: 1800, unit: 'quintal', change: 4.2 },
        { crop: 'Maize', market: 'Coimbatore', price: 1900, unit: 'quintal', change: 0.8 },
        { crop: 'Sugarcane', market: 'Coimbatore', price: 350, unit: 'quintal', change: 1.5 },
      ]
    };
  },
  
  getPriceHistory: async (crop) => {
    // Mock historical data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const prices = months.map(() => Math.floor(Math.random() * 2000) + 1500);
    return {
      success: true,
      crop,
      history: months.map((month, i) => ({ month, price: prices[i] }))
    };
  }
};

// ==================== Soil Service ====================
export const soilService = {
  analyze: async (data) => {
    // Mock soil analysis
    return {
      success: true,
      analysis: {
        ph: (data.ph || 6.5).toFixed(1),
        nitrogen: data.nitrogen || 'Medium',
        phosphorus: data.phosphorus || 'Medium',
        potassium: data.potassium || 'High',
        moisture: data.moisture || 'Optimal',
        recommendation: 'Soil is suitable for most crops. Consider adding organic manure for better results.',
        suitableCrops: ['Rice', 'Wheat', 'Cotton', 'Maize', 'Vegetables']
      }
    };
  },
};

// ==================== Risk Service ====================
export const riskService = {
  predict: async (data) => {
    // Mock risk prediction
    return {
      success: true,
      risks: [
        { type: 'Drought', probability: 15, severity: 'Low', mitigation: 'Maintain adequate irrigation' },
        { type: 'Flood', probability: 8, severity: 'Medium', mitigation: 'Ensure proper drainage' },
        { type: 'Pest Attack', probability: 25, severity: 'Medium', mitigation: 'Regular monitoring and preventive measures' },
        { type: 'Market Price', probability: 35, severity: 'Low', mitigation: 'Diversify crops and timing' }
      ],
      overallRisk: 'Low',
      score: 23
    };
  },
};

// ==================== Community Service ====================
export const communityService = {
  getPosts: async () => {
    // Mock community posts
    return {
      success: true,
      posts: [
        {
          id: 1,
          author: 'Rajesh Kumar',
          location: 'Punjab',
          content: 'Just harvested my wheat crop. Yield increased by 30% using AgriSense recommendations!',
          likes: 45,
          comments: 12,
          time: '2 hours ago'
        },
        {
          id: 2,
          author: 'Lakshmi Devi',
          location: 'Tamil Nadu',
          content: 'The weather alerts helped me protect my rice crop from unexpected rainfall. Highly recommended!',
          likes: 38,
          comments: 8,
          time: '5 hours ago'
        },
        {
          id: 3,
          author: 'Suresh Patil',
          location: 'Maharashtra',
          content: 'Using drip irrigation based on AgriSense advice. Saved 40% water this season!',
          likes: 52,
          comments: 15,
          time: '1 day ago'
        }
      ]
    };
  },
};

export default api;

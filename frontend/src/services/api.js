import axios from 'axios';

// Use environment variable for API URL, fallback to /api for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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

export const weatherService = {
  getWeather: async (lat, lon) => {
    const response = await api.get(`/weather?lat=${lat}&lon=${lon}`);
    return response.data;
  },
};

export const cropService = {
  getRecommendations: async (data) => {
    const response = await api.post('/crop-recommendation', data);
    return response.data;
  },
  
  getTimeline: async (cropName) => {
    const response = await api.get(`/crop-timeline/${cropName}`);
    return response.data;
  },
};

export const alertService = {
  generateAlerts: async (data) => {
    const response = await api.post('/alerts', data);
    return response.data;
  },
};

export const irrigationService = {
  getAdvice: async (data) => {
    const response = await api.post('/irrigation-advice', data);
    return response.data;
  },
};

export const profitService = {
  getEstimate: async (data) => {
    const response = await api.post('/profit-estimate', data);
    return response.data;
  },
};

export default api;

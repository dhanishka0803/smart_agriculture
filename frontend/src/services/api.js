import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

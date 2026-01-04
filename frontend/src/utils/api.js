import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const competitionsAPI = {
  getAll: (status) => api.get('/competitions', { params: { status } }),
  getById: (id) => api.get(`/competitions/${id}`),
  create: (data) => api.post('/competitions', data),
  register: (id) => api.post(`/competitions/${id}/register`),
  getLeaderboard: (id) => api.get(`/competitions/${id}/leaderboard`)
};

export const photosAPI = {
  upload: (formData) => api.post('/photos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getByCompetition: (competitionId, status) => 
    api.get(`/photos/competition/${competitionId}`, { params: { status } }),
  getMyPhotos: () => api.get('/photos/my-photos'),
  judge: (id, data) => api.put(`/photos/${id}/judge`, data)
};

export const statisticsAPI = {
  getPlatform: () => api.get('/statistics/platform'),
  getCompetition: (id) => api.get(`/statistics/competition/${id}`),
  getUser: (userId) => api.get(`/statistics/user/${userId}`),
  getTimeline: (id) => api.get(`/statistics/competition/${id}/timeline`)
};

export default api;

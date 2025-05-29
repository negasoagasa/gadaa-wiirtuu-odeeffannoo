import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor to handle errors
api.interceptors.response.use(response => response, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.get('/auth/logout'),
  
  // Users
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Calls
  getCalls: (params) => api.get('/calls', { params }),
  getCall: (id) => api.get(`/calls/${id}`),
  createCall: (callData) => api.post('/calls', callData),
  updateCall: (id, callData) => api.put(`/calls/${id}`, callData),
  respondToCall: (id, responseData) => api.post(`/calls/${id}/respond`, responseData),
  
  // Agent calls
  getAgentCalls: () => api.get('/calls/agent'),
  
  // Escalated calls
  getEscalatedCalls: (department) => api.get('/calls/escalated', { params: { department } }),
  
  // Reports
  generateReport: (params) => api.post('/reports/generate', params),
  exportReport: (params) => api.get('/reports/export', { params, responseType: 'blob' }),
  
  // Dashboard
  getDashboardStats: (role) => api.get('/calls/stats/dashboard', { params: { role } })
};
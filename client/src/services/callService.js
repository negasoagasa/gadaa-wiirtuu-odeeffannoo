import api from './api';

const getCalls = async (params = {}) => {
  try {
    const response = await api.get('/calls', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch calls';
  }
};

const getCall = async (id) => {
  try {
    const response = await api.get(`/calls/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch call details';
  }
};

const createCall = async (callData) => {
  try {
    const response = await api.post('/calls', callData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create call';
  }
};

const updateCall = async (id, callData) => {
  try {
    const response = await api.put(`/calls/${id}`, callData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update call';
  }
};

const respondToCall = async (id, responseData) => {
  try {
    const response = await api.post(`/calls/${id}/respond`, responseData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to respond to call';
  }
};

const getDashboardStats = async () => {
  try {
    const response = await api.get('/calls/stats/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch dashboard stats';
  }
};

export default {
  getCalls,
  getCall,
  createCall,
  updateCall,
  respondToCall,
  getDashboardStats,
};
import api from './api';

const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

const logout = async () => {
  try {
    await api.get('/auth/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get user';
  }
};

export default {
  login,
  logout,
  getCurrentUser,
};
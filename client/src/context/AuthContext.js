import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    // Redirect based on role
    const redirectPath = getRedirectPath(user.role);
    window.location.href = redirectPath;
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const getRedirectPath = (role) => {
    switch(role) {
      case 'admin': return '/admin';
      case 'agent': return '/agent';
      case 'backoffice': return '/backoffice';
      case 'supervisor': return '/supervisor';
      case 'finance': return '/finance';
      case 'shareholder': return '/shareholder';
      case 'digital': return '/digital';
      default: return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
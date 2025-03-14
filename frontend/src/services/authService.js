import api from './api';

const getToken = () => localStorage.getItem('auth_token');

const setAuthHeader = (config = {}) => {
  const token = getToken();
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

const authService = {
  register: async (userData) => {
    const response = await api.post('users/register', userData);
    if (response.status === 'success' && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  login: async (credentials) => {
    const response = await api.post('users/login', credentials);
    if (response.status === 'success' && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return api.post('users/logout');
  },
  
  checkAuth: async () => {
    return api.get('users/check-auth', setAuthHeader());
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isLoggedIn: () => {
    return !!getToken();
  }
};

export default authService;
const API_BASE_URL = 'http://localhost/gallery_system/backend/';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const api = {
  get: async (endpoint, customConfig = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...customConfig.headers
    };
    
    const config = {
      method: 'GET',
      ...customConfig,
      headers
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  },

  post: async (endpoint, data, customConfig = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...customConfig.headers
    };
    
    const config = {
      method: 'POST',
      ...customConfig,
      headers,
      body: JSON.stringify(data)
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  },

  put: async (endpoint, data, customConfig = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...customConfig.headers
    };
    
    const config = {
      method: 'PUT',
      ...customConfig,
      headers,
      body: JSON.stringify(data)
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  },

  delete: async (endpoint, customConfig = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...customConfig.headers
    };
    
    const config = {
      method: 'DELETE',
      ...customConfig,
      headers
    };
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return handleResponse(response);
  },
};

export default api;
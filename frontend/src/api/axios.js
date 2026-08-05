import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://10.10.32.20:7000/api',
  baseURL: 'http://localhost:8000/api',
});

// Attach token automatically

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error),
);

export default api;

// import axios from "axios";

// const api = axios.create({

//     baseURL:"http://localhost:7000/api"

// });

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7000/api',
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

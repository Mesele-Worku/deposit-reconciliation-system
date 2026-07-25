import api from './axios';

const getConfig = async () => {
  const response = await api.get('/notifications/config');

  return response.data;
};

const updateConfig = async (data) => {
  const response = await api.put('/notifications/config', data);

  return response.data;
};

export default {
  getConfig,

  updateConfig,
};

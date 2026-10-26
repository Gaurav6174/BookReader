import { api } from './client.js';

export const productivityApi = {
  getStats: () => api.get('/productivity/stats'),
};

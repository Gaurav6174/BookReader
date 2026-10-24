import { api } from './client.js';

export const wordsApi = {
  list: (chapterId) => api.get(`/chapters/${chapterId}/words`),
  create: (chapterId, data) => api.post(`/chapters/${chapterId}/words`, data),
  update: (id, data) => api.patch(`/words/${id}`, data),
  delete: (id) => api.delete(`/words/${id}`),
};

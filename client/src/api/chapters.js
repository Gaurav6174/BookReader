import { api } from './client.js';

export const chaptersApi = {
  list: (bookId) => api.get(`/books/${bookId}/chapters`),
  get: (id) => api.get(`/chapters/${id}`),
  create: (bookId, data) => api.post(`/books/${bookId}/chapters`, data),
  update: (id, data) => api.patch(`/chapters/${id}`, data),
  delete: (id) => api.delete(`/chapters/${id}`),
};

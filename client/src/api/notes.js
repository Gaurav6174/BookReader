import { api } from './client.js';

export const notesApi = {
  list: (chapterId) => api.get(`/chapters/${chapterId}/notes`),
  create: (chapterId, data) => api.post(`/chapters/${chapterId}/notes`, data),
  update: (id, data) => api.patch(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://backend-235007.onrender.com/api';
const baseURL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export const bookApi = {
  getAll: (search = '') => api.get('/books', { params: { search } }),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
};

export default api;

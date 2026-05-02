import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const fileAPI = {
  uploadFile: (formData, onUploadProgress) => 
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    }),
  getUserFiles: () => api.get('/files'),
  getDuplicateFiles: () => api.get('/files/duplicates'),
  getRecentFiles: () => api.get('/files/recent'),
  renameFile: (id, newName) => api.put(`/files/${id}/rename`, { newName }),
  deleteFile: (id) => api.delete(`/files/${id}`),
  updateLastAccessed: (id) => api.put(`/files/${id}/access`),
  searchFiles: (query) => api.get(`/files/search?q=${query}`)
};

export default api;

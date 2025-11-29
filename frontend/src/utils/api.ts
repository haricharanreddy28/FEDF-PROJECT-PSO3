import axios from 'axios';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          return Promise.reject(new Error('Unauthorized. Please login again.'));
        case 404:
          return Promise.reject(new Error('Resource not found.'));
        case 500:
          return Promise.reject(new Error('Server error. Please try again later.'));
        default:
          return Promise.reject(new Error(error.response.data?.message || 'An error occurred'));
      }
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Network issue. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(new Error('Failed to load data. Please try again.'));
    }
  }
);

// API functions with retry logic
const retryRequest = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.message.includes('Network') || error.message.includes('Server'))) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// API functions
export const fetchLegalRights = async () => {
  try {
    const response = await api.get('/legal-rights');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch legal rights');
  }
};

export const fetchSupportServices = async () => {
  try {
    const response = await api.get('/support-services');
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch support services');
  }
};

export const submitCaseNote = async (note: any) => {
  try {
    const response = await api.post('/case-notes', note);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit case note');
  }
};

export const updateCaseNote = async (id: string, note: any) => {
  try {
    const response = await api.put(`/case-notes/${id}`, note);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update case note');
  }
};

export const deleteCaseNote = async (id: string) => {
  try {
    const response = await api.delete(`/case-notes/${id}`);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete case note');
  }
};

export const uploadDocument = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload document');
  }
};

export default api;


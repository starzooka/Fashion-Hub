import api from './axios.js';

// Auth API
export const authAPI = {
  // Updated: Specific endpoint for Admin Login
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  
  // Keep generic login for regular users if needed
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Product API
export const productAPI = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};
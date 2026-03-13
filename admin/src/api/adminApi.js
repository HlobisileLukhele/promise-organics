import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401/403
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const adminLogin = (email, password) =>
  api.post('/auth/login', { email, password });

// Stats
export const fetchStats = () => api.get('/admin/stats');

// Orders
export const fetchOrders = () => api.get('/admin/orders');
export const fetchOrderById = (id) => api.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  api.patch(`/admin/orders/${id}/status`, { status });
export const editOrder = (id, data) => api.patch(`/admin/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/admin/orders/${id}`);

// Products
export const fetchProducts = () => api.get('/admin/products');
export const createProduct = (data) => api.post('/admin/products', data);
export const updateProduct = (id, data) => api.patch(`/admin/products/${id}`, data);
export const updateStock = (id, data) => api.patch(`/admin/products/${id}/stock`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

// Reviews
export const fetchReviews = () => api.get('/admin/reviews');
export const approveReview = (id) => api.patch(`/admin/reviews/${id}/approve`);
export const rejectReview = (id) => api.patch(`/admin/reviews/${id}/reject`);
export const deleteReview = (id) => api.delete(`/admin/reviews/${id}`);

// Blog
export const fetchAllBlogPosts = () => api.get('/blog/admin/all');
export const createBlogPost    = (data) => api.post('/blog', data);
export const updateBlogPost    = (id, data) => api.patch(`/blog/${id}`, data);
export const toggleBlogPublish = (id) => api.patch(`/blog/${id}/publish`);
export const deleteBlogPost    = (id) => api.delete(`/blog/${id}`);

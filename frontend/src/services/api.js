import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer Token if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopgenie_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('shopgenie_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, { refresh: refreshToken });
          if (res.data.access) {
            localStorage.setItem('shopgenie_access_token', res.data.access);
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('shopgenie_access_token');
          localStorage.removeItem('shopgenie_refresh_token');
          localStorage.removeItem('shopgenie_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Modular API Client Methods
export const authAPI = {
  login: (credentials) => api.post('/accounts/login/', credentials),
  register: (data) => api.post('/accounts/register/', data),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.patch('/accounts/profile/', data),
  forgotPassword: (email) => api.post('/accounts/forgot-password/', { email }),
  getAuditLogs: () => api.get('/accounts/audit-logs/'),
};

export const productsAPI = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.patch(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
  getCategories: () => api.get('/products/categories/'),
  createCategory: (data) => api.post('/products/categories/', data),
  aiDetect: (formData) => api.post('/products/ai-detect/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const inventoryAPI = {
  getAlerts: () => api.get('/inventory/alerts/'),
  restock: (data) => api.post('/inventory/restock/', data),
  getLogs: () => api.get('/inventory/logs/'),
};

export const billingAPI = {
  getOrders: () => api.get('/billing/orders/'),
  createOrder: (data) => api.post('/billing/orders/', data),
  getInvoice: (id) => api.get(`/billing/invoice/${id}/`),
};

export const recommendationsAPI = {
  getRecommendations: (params) => api.get('/recommendations/', { params }),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard/'),
  getSales: () => api.get('/analytics/sales/'),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications/'),
  markRead: (id) => api.patch(`/notifications/${id}/read/`),
  markAllRead: () => api.patch('/notifications/read-all/'),
};

export const communityAPI = {
  getReviews: (params) => api.get('/reviews/product-reviews/', { params }),
  createReview: (data) => api.post('/reviews/product-reviews/', data),
  getNearbyShops: () => api.get('/reviews/nearby-shops/'),
};

export default api;

import axios from 'axios';

const adminAxios = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

adminAxios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('shopgenie_dev_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('shopgenie_dev_access_token');
      sessionStorage.removeItem('shopgenie_dev_refresh_token');
      sessionStorage.removeItem('shopgenie_dev_user');
      window.dispatchEvent(new CustomEvent('dev-auth-expired'));
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Developer Auth
  login: (username, password) =>
    adminAxios.post('admin/auth/login/', { username, password }),
  getMe: () => adminAxios.get('admin/me/'),

  // Dashboard
  getDashboard: () => adminAxios.get('admin/dashboard/'),

  // Shops
  getShops: (params) => adminAxios.get('admin/shops/', { params }),
  getShop: (id) => adminAxios.get(`admin/shops/${id}/`),
  updateShop: (id, data) => adminAxios.patch(`admin/shops/${id}/`, data),
  publishShop: (id) => adminAxios.post(`admin/shops/${id}/publish/`),
  unpublishShop: (id) => adminAxios.post(`admin/shops/${id}/unpublish/`),
  suspendShop: (id) => adminAxios.post(`admin/shops/${id}/suspend/`),

  // Users
  getUsers: (params) => adminAxios.get('admin/users/', { params }),
  getUser: (id) => adminAxios.get(`admin/users/${id}/`),
  updateUser: (id, data) => adminAxios.patch(`admin/users/${id}/`, data),
  resetWorkerCode: (id) => adminAxios.post(`admin/users/${id}/reset-code/`),

  // Products
  getProducts: (params) => adminAxios.get('admin/products/', { params }),
  getProduct: (id) => adminAxios.get(`admin/products/${id}/`),
  updateProduct: (id, data) => adminAxios.patch(`admin/products/${id}/`, data),
  archiveProduct: (id) =>
    adminAxios.patch(`admin/products/${id}/`, { status: 'ARCHIVED' }),

  // Offers
  getOffers: (params) => adminAxios.get('admin/offers/', { params }),
  getOffer: (id) => adminAxios.get(`admin/offers/${id}/`),
  updateOffer: (id, data) => adminAxios.patch(`admin/offers/${id}/`, data),

  // App Settings (developer management)
  getAppSettings: (appKey) => adminAxios.get(`admin/app-settings/${appKey}/`),
  updateAppSettings: (appKey, data) =>
    adminAxios.patch(`admin/app-settings/${appKey}/`, data),

  // Audit Logs
  getAuditLogs: (params) => adminAxios.get('admin/audit-logs/', { params }),

  // Health and Consistency Diagnostics
  getHealth: () => adminAxios.get('admin/health/'),
  getConsistencyCheck: () => adminAxios.get('admin/consistency-check/'),

  // Direct test ping for public app-settings
  testPublicAppSettings: (appKey) => adminAxios.get(`app-settings/${appKey}/`),
};

export default adminApi;

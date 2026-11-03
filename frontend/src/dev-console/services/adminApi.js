import axios from 'axios';
import { API_BASE_URL } from '../../services/api';

const adminApiBaseUrl = API_BASE_URL
  ? `${API_BASE_URL.replace(/\/+$/, '')}/`
  : '/api/';

const adminAxios = axios.create({
  baseURL: adminApiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshRequest = null;

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
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = sessionStorage.getItem('shopgenie_dev_refresh_token');
    if (!refreshToken || originalRequest.url?.includes('auth/refresh/')) {
      sessionStorage.removeItem('shopgenie_dev_access_token');
      sessionStorage.removeItem('shopgenie_dev_refresh_token');
      sessionStorage.removeItem('shopgenie_dev_user');
      window.dispatchEvent(new CustomEvent('dev-auth-expired'));
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      if (!refreshRequest) {
        refreshRequest = axios
          .post(`${adminApiBaseUrl}auth/refresh/`, { refresh: refreshToken })
          .then((response) => {
            const { access, refresh } = response.data || {};
            if (!access) {
              throw new Error('The developer session could not be refreshed.');
            }
            sessionStorage.setItem('shopgenie_dev_access_token', access);
            if (refresh) {
              sessionStorage.setItem('shopgenie_dev_refresh_token', refresh);
            }
            return access;
          })
          .finally(() => {
            refreshRequest = null;
          });
      }

      const accessToken = await refreshRequest;
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${accessToken}`,
      };
      return adminAxios(originalRequest);
    } catch (refreshError) {
      sessionStorage.removeItem('shopgenie_dev_access_token');
      sessionStorage.removeItem('shopgenie_dev_refresh_token');
      sessionStorage.removeItem('shopgenie_dev_user');
      window.dispatchEvent(new CustomEvent('dev-auth-expired'));
      return Promise.reject(refreshError);
    }
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
  resendUserVerification: (id) => adminAxios.post(`admin/users/${id}/resend-verification/`),
  verifyUserEmail: (id) => adminAxios.post(`admin/users/${id}/verify-email/`, { confirm: true }),

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
  probePublicEndpoint: (path) => adminAxios.get(path),
};

export default adminApi;

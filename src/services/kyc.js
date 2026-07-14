import { api, request } from './api';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const getKYCRequests = (params) =>
  request(() => api.get('/admin-kyc', { params }));

export const approveKYC = (requestId, payload) =>
  request(() => api.post(`/admin-kyc/${requestId}/approve`, payload));

export const rejectKYC = (requestId, payload) =>
  request(() => api.post(`/admin-kyc/${requestId}/reject`, payload));

export const exportKycRequestsApi = (params) =>
  request(() => api.get('/admin-kyc/kyc-request/export', { params, responseType: 'blob' }));

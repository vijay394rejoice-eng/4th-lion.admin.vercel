import { api, request } from "./api";

export const getWithdrawRequests = (params) =>
  request(() => api.get('/admin/withdraw-requests', { params }));

export const approveWithdrawRequest = (requestId, data) =>
  request(() => api.post(`/admin/withdraw-requests/${requestId}/approve`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));

export const rejectWithdrawRequest = (requestId, data) =>
  request(() => api.post(`/admin/withdraw-requests/${requestId}/reject`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));

export const exportWithdrawalsApi = (params) =>
  request(() => api.get('/admin/withdraw-requests/export', { params, responseType: 'blob' }));

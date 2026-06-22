import { api, request } from "./api";

export const getWithdrawRequests = (params) =>
  request(() => api.get('/admin/withdraw-requests', { params }));

export const approveWithdrawRequest = (requestId) =>
  request(() => api.post(`/admin/withdraw-requests/${requestId}/approve`));

export const rejectWithdrawRequest = (requestId) =>
  request(() => api.post(`/admin/withdraw-requests/${requestId}/reject`));

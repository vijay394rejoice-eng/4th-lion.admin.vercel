import { api, request } from "./api";

export const getDepositRequests = (params) =>
  request(() => api.get('/admin/deposit-requests', { params }));

export const approveDepositRequest = (requestId) =>
  request(() => api.post(`/admin/deposit-requests/${requestId}/approve`));

export const rejectDepositRequest = (requestId) =>
  request(() => api.post(`/admin/deposit-requests/${requestId}/reject`));

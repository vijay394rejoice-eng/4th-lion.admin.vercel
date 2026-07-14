import { api, request } from "./api";

// export const getDepositRequests = (params) =>
//   request(() => api.get('/admin/deposit-requests', { params }));

// export const approveDepositRequest = (requestId) =>
//   request(() => api.post(`/admin/deposit-requests/${requestId}/approve`, {"remarks":"Approved"}));

// export const rejectDepositRequest = (requestId) =>
//   request(() => api.post(`/admin/deposit-requests/${requestId}/reject`, {"remarks":"Rejected"}));


export const getDepositRequests = (params) =>
  request(() => api.get('/admin/deposit-transactions', { params }));

export const approveDepositRequest = (requestId) =>
  request(() => api.post(`/admin/deposit-transactions/${requestId}/approve`, {"remarks":"Approved"}));

export const rejectDepositRequest = (requestId) =>
  request(() => api.post(`/admin/deposit-transactions/${requestId}/reject`, {"remarks":"Rejected"}));

export const exportDepositsApi = (params) =>
  request(() => api.get('/admin/deposit-transactions/export', { params, responseType: 'blob' }));
import { api, request } from "./api";

export const getPartnerRequests = (params) =>
  request(() => api.get('/partner/partner-requests', { params }));

export const approvePartnerRequest = (requestId) =>
  request(() => api.post(`/partner/requests/${requestId}/approve`));

export const rejectPartnerRequest = (requestId) =>
  request(() => api.post(`/partner/requests/${requestId}/reject`));

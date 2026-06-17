import { api, request } from './api';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const getKYCRequests = (params) =>
  request(() => api.get('/admin-kyc', { params }));

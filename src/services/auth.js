import { api, request } from './api';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const login = (payload) =>
  request(() => api.post('/user/login', payload));

export const refresh = (payload) =>
  request(() => api.post('/user/refresh', payload));

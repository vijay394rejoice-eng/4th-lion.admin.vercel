import { api, request } from './api';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const login = (payload) =>
  request(() => api.post('/user/login', payload));

export const refresh = (payload) =>
  request(() => api.post('/user/refresh', payload));

export const changePassword = (payload) =>
  request(() => api.post('/user/change-password', payload));

export const getMe = () =>
  request(() => api.get('/user/me'));


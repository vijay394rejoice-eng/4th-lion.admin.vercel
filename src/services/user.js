import { api, request } from './api';

export const getUsers = (params) =>
  request(() => api.get('/admin/users', { params }));

export const blockUser = (userId) =>
  request(() => api.post(`/admin/users/${userId}/block`));

export const unblockUser = (userId) =>
  request(() => api.post(`/admin/users/${userId}/unblock`));

export const activatePendingUsers = () =>
  request(() => api.post('/admin/activate-pending'));

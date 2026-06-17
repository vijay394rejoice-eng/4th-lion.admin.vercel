import { api, request } from './api';

export const getSubAdmins = (params) =>
  request(() => api.get('/admin/sub-admin', { params }));

export const createSubAdmin = (payload) =>
  request(() => api.post('/admin/sub-admin', payload));

export const updateSubAdmin = (userId, payload) =>
  request(() => api.put(`/admin/sub-admin/${userId}`, payload));

export const deleteSubAdmin = (userId) =>
  request(() => api.delete(`/admin/sub-admin/${userId}`));

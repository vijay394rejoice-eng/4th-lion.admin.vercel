import { api, request } from './api';

export const getUsers = (params) =>
  request(() => api.get('/admin/users', { params }));

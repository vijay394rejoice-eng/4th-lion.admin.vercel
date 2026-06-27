import { api, request } from './api';

export const sendAdminNotification = (formData) =>
  request(() =>
    api.post('/admin/notifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );

export const getNotifications = (params) =>
  request(() => api.get('/notifications', { params }));

export const markNotificationRead = (payload) =>
  request(() => api.post('/notifications/read', payload));

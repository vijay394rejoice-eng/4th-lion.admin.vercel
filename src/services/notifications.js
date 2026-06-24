import { api, request } from './api';

export const sendAdminNotification = (formData) =>
  request(() =>
    api.post('/admin/notifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );

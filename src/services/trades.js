import { api, request } from "./api";

export const getTrades = (params) =>
  request(() => api.get('/admin-trade/trades', { params }));

export const uploadTradesCsv = (formData) =>
  request(() => api.post('/admin-trade/trades', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }));

export const createTradeManual = (payload) =>
  request(() => api.post('/admin-trade/trades', payload));

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

export const deleteTrade = (tradeId) =>
  request(() => api.delete(`/admin-trade/trades/${tradeId}`));

export const updateTrade = (tradeId, payload) =>
  request(() => api.patch(`/admin-trade/trades/${tradeId}`, payload));

export const runSettlements = () =>
  request(() => api.post('/admin-trade/settlements/run'));

export const exportTradesApi = (params) =>
  request(() => api.get('/admin-trade/trades/export', { params, responseType: 'blob' }));

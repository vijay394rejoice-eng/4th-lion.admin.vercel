import { api, request } from './api';

export const getRecentTransactions = (limit = 5) =>
  request(() => api.get('/admin-dashboard/recent-transactions', { params: { limit } }));

export const getAdminMetrics = (timeframe = '24h') =>
  request(() => api.get('/admin-dashboard/metrics', { params: { timeframe } }));

export const getSharingModel = () =>
  request(() => api.get('/admin-dashboard/sharing-model'));

export const getPortfolioGrowth = (timeframe = '7d') =>
  request(() => api.get('/admin-dashboard/chart/portfolio-growth', { params: { timeframe } }));




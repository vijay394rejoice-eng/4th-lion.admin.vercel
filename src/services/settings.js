import { api, request } from "./api";
export const getSettlementConfig = () =>
  request(() => api.get('/settlement-config'));

export const updateSettlementConfig = (data) =>
  request(() => api.put('/settlement-config', data));

export const getMinWithdrawAmount = () =>
  request(() => api.get('/admin/settings/min-withdraw-amount'));

export const updateMinWithdrawAmount = (data) =>
  request(() => api.put('/admin/settings/min-withdraw-amount', data));

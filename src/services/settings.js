import { api, request } from "./api";
export const getSettlementConfig = () =>
  request(() => api.get('/settlement-config'));

export const updateSettlementConfig = (data) =>
  request(() => api.put('/settlement-config', data));

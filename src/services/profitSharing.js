import { api, request } from "./api";

export const getProfitSharing = (params) =>
  request(() => api.get("/admin/profit-sharing", { params }));

export const exportProfitSharingApi = (params) =>
  request(() => api.get("/admin/profit-sharing/export", { params, responseType: 'blob' }));
